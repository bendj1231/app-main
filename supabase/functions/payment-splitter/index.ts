/// <reference lib="deno.ns" />
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import { getCorsHeaders } from '../_shared/cors.ts';

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Revenue share configuration
const SPLIT_CONFIG = {
  veremark: {
    wallet: Deno.env.get('VEREMARK_WALLET') || '',
    percentage: 0.23,
    label: 'Pilot Verification (Veremark)',
  },
  logbookProvider: {
    wallet: Deno.env.get('LOGBOOK_WALLET') || '',
    percentage: 0.05,
    label: 'Logbook Data Feed',
  },
  atoOperator: {
    wallet: Deno.env.get('ATO_WALLET') || '',
    percentage: 0.05,
    label: 'ATO / Operator',
  },
  platform: {
    wallet: Deno.env.get('PLATFORM_WALLET') || '',
    percentage: 0.67,
    label: 'PilotRecognition Platform',
  },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
  const corsHeaders = getCorsHeaders(req);
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const {
      pilotId,
      flightSchoolId,
      amount, // Total amount in USDC (e.g., 100.00)
      paymentId,
      paymentProvider, // 'helio' | 'stripe'
      metadata = {},
    } = await req.json();

    if (!pilotId || !amount || !paymentId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: pilotId, amount, paymentId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if ATO is a paid enterprise subscriber
    // Look up the pilot's ATO from their profile
    const { data: pilotProfile } = await supabaseAdmin
      .from('profiles')
      .select('ato_enterprise_account_id')
      .eq('id', pilotId)
      .maybeSingle();

    let atoIsPaid = false;
    let atoId = null;

    if (pilotProfile?.ato_enterprise_account_id) {
      atoId = pilotProfile.ato_enterprise_account_id;
      const { data: atoAccount } = await supabaseAdmin
        .from('enterprise_accounts')
        .select('account_tier, status')
        .eq('id', atoId)
        .maybeSingle();

      // ATO must be enterprise tier AND active
      atoIsPaid = atoAccount?.account_tier === 'enterprise' && atoAccount?.status === 'active';
    }

    // Calculate splits based on ATO status
    const veremarkAmount = +(amount * SPLIT_CONFIG.veremark.percentage).toFixed(2);
    const logbookAmount = +(amount * SPLIT_CONFIG.logbookProvider.percentage).toFixed(2);
    const atoAmount = +(amount * SPLIT_CONFIG.atoOperator.percentage).toFixed(2);
    
    // If ATO is NOT paid, we HOLD their 5% in escrow instead of giving it to platform
    // This creates a viral incentive for ATOs to subscribe
    const atoHeldInEscrow = !atoIsPaid && atoId;
    
    // Platform always gets 67% (ATO share held separately, not absorbed)
    const platformAmount = +(amount - veremarkAmount - logbookAmount - atoAmount).toFixed(2);

    const splitRecord = {
      payment_id: paymentId,
      payment_provider: paymentProvider,
      pilot_id: pilotId,
      flight_school_id: flightSchoolId || null,
      total_amount: amount,
      currency: 'USDC',
      splits: [
        {
          recipient: SPLIT_CONFIG.veremark.label,
          wallet: SPLIT_CONFIG.veremark.wallet,
          amount: veremarkAmount,
          percentage: SPLIT_CONFIG.veremark.percentage,
          status: 'pending',
        },
        {
          recipient: SPLIT_CONFIG.logbookProvider.label,
          wallet: SPLIT_CONFIG.logbookProvider.wallet,
          amount: logbookAmount,
          percentage: SPLIT_CONFIG.logbookProvider.percentage,
          status: 'pending',
        },
        {
          recipient: SPLIT_CONFIG.atoOperator.label,
          wallet: SPLIT_CONFIG.atoOperator.wallet,
          amount: atoAmount,
          percentage: SPLIT_CONFIG.atoOperator.percentage,
          status: 'pending',
        },
        {
          recipient: SPLIT_CONFIG.platform.label,
          wallet: SPLIT_CONFIG.platform.wallet,
          amount: platformAmount,
          percentage: platformAmount / amount,
          status: 'pending',
        },
      ],
      status: 'pending',
      metadata,
      created_at: new Date().toISOString(),
    };

    // Store split record
    const { error: insertError } = await supabaseAdmin
      .from('payment_splits')
      .insert(splitRecord);

    if (insertError) {
      throw insertError;
    }

    // If ATO is not subscribed, HOLD their 5% in escrow
    // This creates a viral incentive loop
    if (atoHeldInEscrow) {
      await supabaseAdmin.from('held_commissions').insert({
        ato_enterprise_account_id: atoId,
        pilot_id: pilotId,
        payment_id: paymentId,
        amount: atoAmount,
        currency: 'USDC',
        status: 'held',
        metadata: {
          pilot_name: metadata.pilot_name || '',
          verification_type: 'professional_qualification',
          held_reason: 'ATO not subscribed to enterprise tier',
          can_claim_after_subscription: true,
        },
        held_at: new Date().toISOString(),
      });

      // Log the held commission for audit
      await supabaseAdmin.from('user_activity_log').insert({
        user_id: pilotId,
        action: 'ato_commission_held_in_escrow',
        details: {
          ato_id: atoId,
          amount: atoAmount,
          payment_id: paymentId,
          reason: 'ATO not enterprise subscriber',
        },
        created_at: new Date().toISOString(),
      });
    }

    // Log the split for audit
    await supabaseAdmin.from('user_activity_log').insert({
      user_id: pilotId,
      action: 'payment_split_created',
      details: {
        payment_id: paymentId,
        total: amount,
        splits: {
          veremark: veremarkAmount,
          logbook: logbookAmount,
          ato: atoAmount,
          platform: platformAmount,
        },
      },
      created_at: new Date().toISOString(),
    });

    // In production, this would trigger actual on-chain transfers
    // For now, we return the split instructions for manual/queued processing
    return new Response(
      JSON.stringify({
        success: true,
        paymentId,
        totalAmount: amount,
        currency: 'USDC',
        splits: {
          veremark: {
            amount: veremarkAmount,
            wallet: SPLIT_CONFIG.veremark.wallet,
            percentage: `${SPLIT_CONFIG.veremark.percentage * 100}%`,
            status: 'pending_transfer',
          },
          logbook: {
            amount: logbookAmount,
            wallet: SPLIT_CONFIG.logbookProvider.wallet,
            percentage: `${SPLIT_CONFIG.logbookProvider.percentage * 100}%`,
            status: 'pending_transfer',
          },
          ato: {
            amount: atoAmount,
            wallet: SPLIT_CONFIG.atoOperator.wallet,
            percentage: `${SPLIT_CONFIG.atoOperator.percentage * 100}%`,
            status: 'pending_transfer',
          },
          platform: {
            amount: platformAmount,
            wallet: SPLIT_CONFIG.platform.wallet,
            percentage: `${((platformAmount / amount) * 100).toFixed(0)}%`,
            status: 'pending_transfer',
          },
        },
        atoEscrow: atoHeldInEscrow ? {
          held: true,
          amount: atoAmount,
          atoId,
          message: 'ATO commission held in escrow. Subscribe at pilotrecognition.com/enterprise to claim.',
        } : {
          held: false,
          amount: atoAmount,
          message: 'ATO is subscribed — commission released directly.',
        },
        message: atoHeldInEscrow 
          ? 'Payment split recorded. ATO commission held in escrow pending subscription.'
          : 'Payment split recorded. Transfers queued for processing.', 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Payment splitter error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
