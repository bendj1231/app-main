import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0';

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2026-04-22.dahlia',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const payload = await req.text();
    const sig = req.headers.get('stripe-signature');
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    let event: Stripe.Event;

    if (endpointSecret && sig) {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } else {
      // Development fallback
      event = JSON.parse(payload);
    }

    console.log('Stripe webhook event:', event.type, event.id);

    // ────────────────────────────────────────────────────────────────────────
    // EVENT 1: Recognition Fee Invoice Paid → Unlock Direct Contact
    // ────────────────────────────────────────────────────────────────────────
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice;

      // Only process recognition fee invoices
      if (!invoice.metadata?.pilotrecognition_invoice_id) {
        console.log('Not a recognition fee invoice — skipping');
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const recognitionInvoiceId = invoice.metadata.pilotrecognition_invoice_id;
      const matchAgreementId = invoice.metadata?.match_agreement_id;

      // Update recognition_fee_invoices to paid
      await supabaseAdmin
        .from('recognition_fee_invoices')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
          stripe_payment_intent_id: invoice.payment_intent as string || null,
        })
        .eq('id', recognitionInvoiceId);

      // Unlock direct contact on the match agreement
      if (matchAgreementId) {
        await supabaseAdmin
          .from('match_agreements')
          .update({
            status: 'fee_paid',
            direct_contact_unlocked_at: new Date().toISOString(),
            pilot_email_revealed: true,
            pilot_phone_revealed: true,
          })
          .eq('id', matchAgreementId);

        // Optionally: notify both parties that contact is now unlocked
        // This could trigger a Supabase realtime event or email
        console.log(`Direct contact unlocked for agreement ${matchAgreementId}`);
      }

      return new Response(JSON.stringify({
        received: true,
        processed: 'recognition_fee_paid',
        recognitionInvoiceId,
        matchAgreementId,
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ────────────────────────────────────────────────────────────────────────
    // EVENT 2: Checkout Session Completed → Upgrade Enterprise to Data Controller
    // ────────────────────────────────────────────────────────────────────────
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const enterpriseAccountId = session.metadata?.enterprise_account_id;
      const tier = session.metadata?.tier || 'data_controller';

      if (!enterpriseAccountId) {
        console.log('No enterprise_account_id in checkout session metadata');
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Update enterprise account tier and permissions
      await supabaseAdmin
        .from('enterprise_accounts')
        .update({
          account_tier: tier,
          can_pull_verified_profiles: true,
          can_view_pilot_details: true,
          can_export_data: tier === 'enterprise',
          max_pathway_cards: tier === 'enterprise' ? 50 : 10,
          max_interest_views_per_month: tier === 'enterprise' ? 99999 : 500,
          stripe_customer_id: session.customer as string || null,
          billing_email: session.customer_details?.email || null,
          tier_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('id', enterpriseAccountId);

      // Record the subscription
      await supabaseAdmin
        .from('subscriptions')
        .insert({
          enterprise_account_id: enterpriseAccountId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          status: 'active',
          tier: tier,
          amount: tier === 'data_controller' ? 100000 : 0, // $1,000 in cents
          currency: 'usd',
          interval: 'year',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('enterprise_account_id', enterpriseAccountId)
        .select()
        .single();

      console.log(`Enterprise ${enterpriseAccountId} upgraded to ${tier}`);

      return new Response(JSON.stringify({
        received: true,
        processed: 'enterprise_tier_upgrade',
        enterpriseAccountId,
        tier,
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ────────────────────────────────────────────────────────────────────────
    // EVENT 3: Subscription Cancelled / Expired → Downgrade to Free
    // ────────────────────────────────────────────────────────────────────────
    if (event.type === 'customer.subscription.deleted' || event.type === 'invoice.payment_failed') {
      const subscription = event.data.object as Stripe.Subscription;

      const { data: subRecord } = await supabaseAdmin
        .from('subscriptions')
        .select('enterprise_account_id')
        .eq('stripe_subscription_id', subscription.id)
        .maybeSingle();

      if (subRecord?.enterprise_account_id) {
        await supabaseAdmin
          .from('enterprise_accounts')
          .update({
            account_tier: 'free',
            can_pull_verified_profiles: false,
            can_view_pilot_details: false,
            can_export_data: false,
            max_pathway_cards: 1,
            max_interest_views_per_month: 0,
          })
          .eq('id', subRecord.enterprise_account_id);

        await supabaseAdmin
          .from('subscriptions')
          .update({ status: event.type === 'customer.subscription.deleted' ? 'cancelled' : 'past_due' })
          .eq('stripe_subscription_id', subscription.id);
      }

      return new Response(JSON.stringify({ received: true, processed: 'subscription_cancelled' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('Stripe webhook error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
