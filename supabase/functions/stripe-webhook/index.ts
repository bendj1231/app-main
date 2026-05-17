import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2026-04-22.dahlia',
});

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret!);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(JSON.stringify({ error: 'Invalid signature' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  console.log('Stripe webhook received:', event.type);

  try {
    switch (event.type) {
      // Enterprise subscription created
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const metadata = session.metadata || {};
        const userId = session.client_reference_id || metadata.user_id;
        const plan = metadata.plan || 'enterprise_monthly';
        const paymentType = metadata.payment_type || 'enterprise_checkout';

        if (paymentType === 'enterprise_checkout' && userId) {
          // Update profile to enterprise
          const { error } = await supabaseAdmin
            .from('profiles')
            .update({
              account_tier: 'enterprise',
              account_tier_updated_at: new Date().toISOString(),
              stripe_customer_id: session.customer,
              stripe_subscription_id: session.subscription,
              updated_by: 'stripe_webhook',
            })
            .eq('id', userId);

          if (error) {
            console.error('Failed to update profile tier:', error);
          } else {
            console.log('Profile upgraded to enterprise:', userId, plan);
            
            // Trigger commission release for this ATO
            try {
              const releaseResponse = await fetch(
                `${Deno.env.get('SUPABASE_URL')}/functions/v1/release-ato-commissions`,
                {
                  method: 'POST',
                  headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
                  },
                  body: JSON.stringify({ atoId: userId }),
                }
              );
              
              if (releaseResponse.ok) {
                const releaseData = await releaseResponse.json();
                console.log('Auto-released commissions:', releaseData);
              }
            } catch (releaseErr) {
              console.error('Auto-release failed:', releaseErr);
              // Don't fail the webhook if release fails
            }
          }
        }

        // Also handle Recognition+ subscriptions
        if (metadata.payment_type === 'recognition_plus' && userId) {
          await supabaseAdmin
            .from('profiles')
            .update({
              account_tier: 'recognition_plus',
              account_tier_updated_at: new Date().toISOString(),
              stripe_customer_id: session.customer,
              stripe_subscription_id: session.subscription,
              updated_by: 'stripe_webhook',
            })
            .eq('id', userId);
        }
        break;
      }

      // Subscription renewed
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription;

        if (subscriptionId) {
          const { data: profiles } = await supabaseAdmin
            .from('profiles')
            .select('id, account_tier')
            .eq('stripe_subscription_id', subscriptionId);

          if (profiles && profiles.length > 0) {
            for (const profile of profiles) {
              // Keep tier active (renewal succeeded)
              await supabaseAdmin
                .from('profiles')
                .update({
                  account_tier_updated_at: new Date().toISOString(),
                  status: 'active',
                  updated_by: 'stripe_webhook_renewal',
                })
                .eq('id', profile.id);
            }
          }
        }
        break;
      }

      // Subscription cancelled or failed
      case 'invoice.payment_failed':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const subscriptionId = subscription.id || subscription.subscription;

        if (subscriptionId) {
          const { data: profiles } = await supabaseAdmin
            .from('profiles')
            .select('id, account_tier')
            .eq('stripe_subscription_id', subscriptionId);

          if (profiles && profiles.length > 0) {
            for (const profile of profiles) {
              // Downgrade to free (keep account but remove enterprise features)
              await supabaseAdmin
                .from('profiles')
                .update({
                  account_tier: 'free',
                  account_tier_updated_at: new Date().toISOString(),
                  stripe_subscription_id: null,
                  updated_by: 'stripe_webhook_cancellation',
                })
                .eq('id', profile.id);
            }
          }
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Webhook processing error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
