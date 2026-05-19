import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-veremark-signature',
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

    // Verify Veremark signature
    const signature = req.headers.get('x-veremark-signature');
    const veremarkSecret = Deno.env.get('VEREMARK_WEBHOOK_SECRET');

    if (!signature || !veremarkSecret) {
      return new Response(
        JSON.stringify({ error: 'Missing signature or secret' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.text();
    const event = JSON.parse(body);

    console.log('Veremark webhook received:', event.type, event.checkId || event.id);

    const checkId = event.checkId || event.id;
    const pilotId = event.metadata?.pilot_id || event.pilotId;
    const status = event.status || event.data?.status;
    const eventType = event.type || event.event_type;

    // Log webhook for audit
    await supabaseAdmin.from('veremark_webhook_logs').insert({
      pilot_id: pilotId || null,
      veremark_check_id: checkId,
      event_type: eventType,
      status,
      payload: event,
      processed_at: new Date().toISOString(),
    });

    // Handle verification status updates
    if (pilotId) {
      switch (eventType) {
        case 'check.started':
        case 'verification.initiated': {
          await supabaseAdmin
            .from('profiles')
            .update({
              veremark_status: 'in_progress',
              veremark_verification_id: checkId,
              updated_by: 'veremark_webhook',
              updated_at: new Date().toISOString(),
            })
            .eq('id', pilotId);
          break;
        }

        case 'check.completed':
        case 'verification.completed': {
          const finalStatus = status === 'verified' ? 'verified' : 
                           status === 'discrepancy' ? 'discrepancy' : 
                           status === 'failed' ? 'failed' : 'discrepancy';
          
          await supabaseAdmin
            .from('profiles')
            .update({
              veremark_status: finalStatus,
              veremark_verification_id: checkId,
              veremark_checked_at: new Date().toISOString(),
              updated_by: 'veremark_webhook',
              updated_at: new Date().toISOString(),
            })
            .eq('id', pilotId);

          // Log the completion
          await supabaseAdmin.from('user_activity_log').insert({
            user_id: pilotId,
            action: 'veremark_verification_completed',
            details: {
              check_id: checkId,
              status: finalStatus,
              provider: 'veremark',
              event_type: eventType,
            },
            created_at: new Date().toISOString(),
          });

          // ACTIVATION CREDIT: Generate 5% Member Credit for ATO (if verification succeeded)
          if (finalStatus === 'verified' && event.metadata?.ato_id) {
            const atoId = event.metadata.ato_id;
            const verificationFee = 99; // $99 base verification fee
            const creditAmount = verificationFee * 0.05; // 5% = $4.95

            // Create activation credit record (NO EXPIRATION — accumulates indefinitely)
            const { data: creditRecord } = await supabaseAdmin
              .from('ato_activation_credits')
              .insert({
                ato_id: atoId,
                pilot_id: pilotId,
                verification_id: checkId,
                credit_amount: creditAmount,
                status: 'unclaimed',
                created_at: new Date().toISOString(),
                metadata: {
                  pilot_name: event.metadata?.pilot_name,
                  aircraft_type: event.metadata?.aircraft_type,
                  verification_fee: verificationFee,
                },
              })
              .select()
              .single();

            // Get current accumulated balance for this ATO
            const { data: balanceData } = await supabaseAdmin
              .from('ato_unclaimed_balance')
              .select('total_unclaimed_amount, pending_credits_count')
              .eq('ato_id', atoId)
              .single();

            const totalUnclaimed = balanceData?.total_unclaimed_amount || creditAmount;
            const pendingCount = balanceData?.pending_credits_count || 1;

            // Queue notification email (accumulating vault FOMO messaging)
            await supabaseAdmin.from('notification_queue').insert({
              recipient_type: 'ato',
              recipient_id: atoId,
              notification_type: 'activation_credit_generated',
              subject: `Verification Payout Pending: $${totalUnclaimed.toFixed(2)} in Unclaimed Rewards`,
              template_data: {
                new_credit_amount: creditAmount.toFixed(2),
                total_unclaimed_amount: totalUnclaimed.toFixed(2),
                pending_credits_count: pendingCount,
                pilot_name: event.metadata?.pilot_name || 'A pilot',
                enterprise_seat_price: 1000,
                break_even_threshold: Math.ceil(1000 / creditAmount), // How many credits to break even
                credit_id: creditRecord?.id,
                message: `Your former students are verifying flight hours. You have $${totalUnclaimed.toFixed(2)} in accumulated network validation payouts waiting. Subscribe to Enterprise Access to claim all accumulated rewards and capture 5% of all future verifications.`,
              },
              status: 'pending',
              created_at: new Date().toISOString(),
            });

            console.log(`Activation Credit added to vault: $${creditAmount.toFixed(2)} for ATO ${atoId}. Total unclaimed: $${totalUnclaimed.toFixed(2)}`);
          }
          break;
        }

        case 'check.expired':
        case 'verification.expired': {
          await supabaseAdmin
            .from('profiles')
            .update({
              veremark_status: 'expired',
              updated_by: 'veremark_webhook',
              updated_at: new Date().toISOString(),
            })
            .eq('id', pilotId);
          break;
        }

        case 'check.cancelled':
        case 'verification.cancelled': {
          await supabaseAdmin
            .from('profiles')
            .update({
              veremark_status: 'not_started',
              updated_by: 'veremark_webhook',
              updated_at: new Date().toISOString(),
            })
            .eq('id', pilotId);
          break;
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        received: true, 
        type: eventType,
        pilot_id: pilotId,
        check_id: checkId,
        status,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Veremark webhook error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
