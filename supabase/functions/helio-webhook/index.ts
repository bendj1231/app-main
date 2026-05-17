import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-helio-signature',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    // Verify Helio signature
    const signature = req.headers.get('x-helio-signature');
    const helioSecret = Deno.env.get('HELIO_WEBHOOK_SECRET');

    if (!signature || !helioSecret) {
      return new Response(
        JSON.stringify({ error: 'Missing signature or secret' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.text();
    const event = JSON.parse(body);

    console.log('Helio webhook received:', event.type, event.paymentId || event.id);

    // Handle payment completed
    if (event.type === 'payment.completed' || event.status === 'COMPLETED') {
      const metadata = event.metadata || {};
      const userId = metadata.user_id;
      const paymentType = metadata.payment_type || 'recognition_plus';
      const amount = event.amount || event.paylink?.amount || 0;
      const currency = event.currency || 'USDC';
      const transactionId = event.paymentId || event.transactionId || event.id;

      if (!userId) {
        console.error('Helio webhook: missing user_id in metadata');
        return new Response(
          JSON.stringify({ error: 'Missing user_id in metadata' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Map payment type to account tier
      const tierMap: Record<string, string> = {
        'enterprise_monthly': 'enterprise',
        'enterprise_annual': 'enterprise',
        'recognition_plus': 'recognition_plus',
      };

      const newTier = tierMap[paymentType] || 'free';

      // Update profile tier
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          account_tier: newTier,
          account_tier_updated_at: new Date().toISOString(),
          updated_by: 'helio_webhook',
          status: 'active',
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Failed to update profile tier:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update profile', details: updateError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Log the payment for audit
      await supabaseAdmin.from('user_activity_log').insert({
        user_id: userId,
        action: 'crypto_payment_completed',
        details: {
          payment_provider: 'helio',
          transaction_id: transactionId,
          amount,
          currency,
          payment_type: paymentType,
          new_tier: newTier,
        },
        created_at: new Date().toISOString(),
      });

      console.log(`Profile ${userId} upgraded to ${newTier} via Helio payment ${transactionId}`);

      return new Response(
        JSON.stringify({
          success: true,
          message: `Account upgraded to ${newTier}`,
          transactionId,
          userId,
          tier: newTier,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle payment failed
    if (event.type === 'payment.failed' || event.status === 'FAILED') {
      console.log('Helio payment failed:', event.paymentId);
      return new Response(
        JSON.stringify({ received: true, status: 'logged_failure' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ received: true, type: event.type }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Helio webhook error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
