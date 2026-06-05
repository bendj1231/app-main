import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
});

// Edge-compatible Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

export default async function handler(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response(JSON.stringify({ error: 'Invalid signature' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        const userId = customer.metadata.userId;
        const atoInstitutionId = session.metadata?.ato_institution_id || customer.metadata?.ato_institution_id;
        const atoTier = session.metadata?.ato_tier;

        if (atoInstitutionId && subscriptionId) {
          // ATO subscription flow
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          await supabase.from('ato_institutions').update({
            stripe_subscription_id: subscriptionId,
            tier: atoTier,
            onboarding_status: 'active',
          }).eq('id', atoInstitutionId);

          // Log to ato_platform_invoices
          await supabase.from('ato_platform_invoices').insert({
            ato_enterprise_account_id: atoInstitutionId,
            period_start: new Date((subscription as any).current_period_start * 1000).toISOString().split('T')[0],
            period_end: new Date((subscription as any).current_period_end * 1000).toISOString().split('T')[0],
            total_sessions: 0,
            total_issuance_fees: 0,
            total_platform_fees: 0,
            status: 'draft',
            stripe_invoice_id: (session as any).invoice as string || null,
          });
        } else if (userId && subscriptionId) {
          // User subscription flow (Recognition+)
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          
          await supabase.from('subscriptions').update({
            stripe_subscription_id: subscriptionId,
            stripe_price_id: subscription.items.data[0].price.id,
            status: subscription.status,
            current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          }).eq('user_id', userId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const atoInstitutionId = subscription.metadata?.ato_institution_id;

        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        const userId = customer.metadata.userId;

        if (atoInstitutionId) {
          await supabase.from('ato_institutions').update({
            onboarding_status: subscription.status === 'active' ? 'active' : 'suspended',
          }).eq('id', atoInstitutionId);
        } else if (userId) {
          await supabase.from('subscriptions').update({
            stripe_price_id: subscription.items.data[0].price.id,
            status: subscription.status,
            current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          }).eq('user_id', userId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const atoInstitutionId = subscription.metadata?.ato_institution_id;

        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        const userId = customer.metadata.userId;

        if (atoInstitutionId) {
          await supabase.from('ato_institutions').update({
            onboarding_status: 'suspended',
            stripe_subscription_id: null,
          }).eq('id', atoInstitutionId);
        } else if (userId) {
          await supabase.from('subscriptions').update({
            status: 'canceled',
            stripe_subscription_id: null,
            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
          }).eq('user_id', userId);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription as string;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const customerId = subscription.customer as string;
          const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
          const userId = customer.metadata.userId;
          const atoInstitutionId = subscription.metadata?.ato_institution_id;

          if (atoInstitutionId) {
            await supabase.from('ato_institutions').update({
              onboarding_status: 'active',
            }).eq('id', atoInstitutionId);

            // Update invoice status to paid
            await supabase.from('ato_platform_invoices').update({
              status: 'paid',
              paid_at: new Date().toISOString(),
            }).eq('stripe_invoice_id', invoice.id);
          } else if (userId) {
            await supabase.from('subscriptions').update({
              status: subscription.status,
              current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
              current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            }).eq('user_id', userId);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription as string;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const customerId = subscription.customer as string;
          const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
          const userId = customer.metadata.userId;
          const atoInstitutionId = subscription.metadata?.ato_institution_id;

          if (atoInstitutionId) {
            await supabase.from('ato_institutions').update({
              onboarding_status: 'suspended',
            }).eq('id', atoInstitutionId);

            // Update invoice status
            await supabase.from('ato_platform_invoices').update({
              status: 'overdue',
            }).eq('stripe_invoice_id', invoice.id);
          } else if (userId) {
            await supabase.from('subscriptions').update({
              status: 'past_due',
            }).eq('user_id', userId);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return new Response(JSON.stringify({ error: 'Webhook handler failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const config = {
  runtime: 'edge',
};
