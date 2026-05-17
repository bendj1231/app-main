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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const { atoId } = await req.json();

    if (!atoId) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: atoId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify ATO is now enterprise
    const { data: atoAccount, error: atoError } = await supabaseAdmin
      .from('enterprise_accounts')
      .select('account_tier, status, name, wallet_address')
      .eq('id', atoId)
      .maybeSingle();

    if (atoError || !atoAccount) {
      return new Response(
        JSON.stringify({ error: 'ATO not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (atoAccount.account_tier !== 'enterprise' || atoAccount.status !== 'active') {
      return new Response(
        JSON.stringify({ 
          error: 'ATO is not an active enterprise subscriber',
          current_tier: atoAccount.account_tier,
          status: atoAccount.status,
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find all held commissions for this ATO
    const { data: heldCommissions, error: heldError } = await supabaseAdmin
      .from('held_commissions')
      .select('*')
      .eq('ato_enterprise_account_id', atoId)
      .eq('status', 'held');

    if (heldError) throw heldError;

    if (!heldCommissions || heldCommissions.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No held commissions found for this ATO.',
          atoId,
          atoName: atoAccount.name,
          totalReleased: 0,
          commissionCount: 0,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate total
    const totalReleased = heldCommissions.reduce((sum, c) => sum + (c.amount || 0), 0);

    // Update all held commissions to 'released'
    const commissionIds = heldCommissions.map(c => c.id);
    
    const { error: updateError } = await supabaseAdmin
      .from('held_commissions')
      .update({
        status: 'released',
        released_at: new Date().toISOString(),
      })
      .in('id', commissionIds);

    if (updateError) throw updateError;

    // Log the release
    await supabaseAdmin.from('user_activity_log').insert({
      user_id: atoId, // Using ATO ID as proxy
      action: 'ato_commissions_released',
      details: {
        ato_id: atoId,
        ato_name: atoAccount.name,
        total_released_usdc: totalReleased,
        commission_count: heldCommissions.length,
        commission_ids: commissionIds,
        wallet_address: atoAccount.wallet_address,
      },
      created_at: new Date().toISOString(),
    });

    // In production, trigger actual crypto transfer to ATO wallet here
    // For now, we mark them released and queue for processing

    return new Response(
      JSON.stringify({
        success: true,
        message: `Released ${heldCommissions.length} held commissions totaling $${totalReleased.toFixed(2)} USDC to ${atoAccount.name}.`,
        atoId,
        atoName: atoAccount.name,
        totalReleased,
        commissionCount: heldCommissions.length,
        commissions: heldCommissions.map(c => ({
          id: c.id,
          amount: c.amount,
          held_at: c.held_at,
          pilot_id: c.pilot_id,
        })),
        walletAddress: atoAccount.wallet_address,
        nextStep: 'Transfer queued to ATO wallet. Funds will arrive within 24 hours.',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Release commissions error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
