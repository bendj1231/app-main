import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

/**
 * ATO Subscription Credit Release
 * 
 * Called when an ATO subscribes to Enterprise tier ($1,000/yr).
 * Releases ALL accumulated unclaimed credits retroactively.
 * 
 * Trigger: Stripe webhook on successful Enterprise subscription payment
 */

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const body = await req.json();
    const { ato_id, subscription_id, stripe_customer_id } = body;

    if (!ato_id || !subscription_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: ato_id, subscription_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get all unclaimed credits for this ATO
    const { data: unclaimedCredits, error: fetchError } = await supabaseAdmin
      .from('ato_activation_credits')
      .select('*')
      .eq('ato_id', ato_id)
      .eq('status', 'unclaimed')
      .order('created_at', { ascending: true });

    if (fetchError) {
      throw fetchError;
    }

    if (!unclaimedCredits || unclaimedCredits.length === 0) {
      // No unclaimed credits — just activate the subscription
      await supabaseAdmin
        .from('profiles')
        .update({
          account_tier: 'enterprise',
          stripe_subscription_id: subscription_id,
          stripe_customer_id: stripe_customer_id,
          enterprise_activated_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', ato_id);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Enterprise subscription activated. No unclaimed credits to release.',
          ato_id,
          subscription_id,
          credits_released: 0,
          total_amount: 0,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const now = new Date().toISOString();
    const totalAmount = unclaimedCredits.reduce((sum, credit) => sum + parseFloat(credit.credit_amount), 0);

    // Mark all credits as released
    const creditIds = unclaimedCredits.map(c => c.id);
    
    const { error: updateError } = await supabaseAdmin
      .from('ato_activation_credits')
      .update({
        status: 'released',
        released_at: now,
        claimed_by_enterprise_subscription_id: subscription_id,
        batch_claim_total: totalAmount,
        metadata: {
          ...unclaimedCredits[0]?.metadata,
          released_via_subscription: true,
          release_triggered_at: now,
          total_credits_in_batch: unclaimedCredits.length,
        },
      })
      .in('id', creditIds);

    if (updateError) {
      throw updateError;
    }

    // Activate Enterprise subscription on ATO profile
    await supabaseAdmin
      .from('profiles')
      .update({
        account_tier: 'enterprise',
        stripe_subscription_id: subscription_id,
        stripe_customer_id: stripe_customer_id,
        enterprise_activated_at: now,
        activation_credits_claimed: totalAmount,
        updated_at: now,
      })
      .eq('id', ato_id);

    // Queue success notification
    await supabaseAdmin.from('notification_queue').insert({
      recipient_type: 'ato',
      recipient_id: ato_id,
      notification_type: 'activation_credits_released',
      subject: `Enterprise Access Activated: $${totalAmount.toFixed(2)} in Rewards Released`,
      template_data: {
        total_released_amount: totalAmount.toFixed(2),
        credits_count: unclaimedCredits.length,
        subscription_id,
        subscription_price: 1000,
        net_cost_after_credits: Math.max(0, 1000 - totalAmount).toFixed(2),
        message: `Welcome to Enterprise Access! Your $${totalAmount.toFixed(2)} in accumulated verification rewards has been released. You will now capture 5% of all future verification checks automatically.`,
      },
      status: 'pending',
      created_at: now,
    });

    console.log(`ATO ${ato_id} subscribed to Enterprise. Released ${unclaimedCredits.length} credits ($${totalAmount.toFixed(2)})`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Enterprise subscription activated and all accumulated credits released.',
        ato_id,
        subscription_id,
        credits_released: unclaimedCredits.length,
        total_amount_released: totalAmount.toFixed(2),
        net_subscription_cost: Math.max(0, 1000 - totalAmount).toFixed(2),
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err: any) {
    console.error('ATO subscription credit release error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
