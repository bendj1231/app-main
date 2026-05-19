import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

/**
 * Activation Credit Expiry Handler
 * 
 * Runs every hour to process pending activation credits that have passed
 * their 5-business-day expiration window.
 * 
 * Credits that lapse are marked as 'lapsed' and the funds return to the 
 * platform infrastructure pool. Soft "lapse" language preserves neutrality.
 */

Deno.serve(async (req) => {
  try {
    // Verify cron secret if provided
    const authHeader = req.headers.get('authorization');
    const cronSecret = Deno.env.get('CRON_SECRET');
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const now = new Date().toISOString();
    
    // Find all pending credits that have expired
    const { data: expiredCredits, error: fetchError } = await supabaseAdmin
      .from('ato_activation_credits')
      .select('*, ato:ato_id(email, display_name, organization_name)')
      .eq('status', 'pending')
      .lt('expires_at', now);

    if (fetchError) {
      throw fetchError;
    }

    if (!expiredCredits || expiredCredits.length === 0) {
      return new Response(
        JSON.stringify({ 
          processed: 0, 
          message: 'No expired activation credits found' 
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const results = {
      lapsed: 0,
      totalAmount: 0,
      notificationsQueued: 0,
      errors: [] as string[],
    };

    // Process each expired credit
    for (const credit of expiredCredits) {
      try {
        // Mark credit as lapsed
        const { error: updateError } = await supabaseAdmin
          .from('ato_activation_credits')
          .update({
            status: 'lapsed',
            lapsed_at: now,
            metadata: {
              ...credit.metadata,
              lapse_reason: '5_business_day_window_expired',
              lapse_processed_at: now,
            },
          })
          .eq('id', credit.id);

        if (updateError) {
          throw updateError;
        }

        results.lapsed++;
        results.totalAmount += parseFloat(credit.credit_amount);

        // Queue lapse notification (soft language)
        const { error: notifyError } = await supabaseAdmin
          .from('notification_queue')
          .insert({
            recipient_type: 'ato',
            recipient_id: credit.ato_id,
            notification_type: 'activation_credit_lapsed',
            subject: 'Member Activation Credit Update',
            template_data: {
              credit_amount: credit.credit_amount.toFixed(2),
              pilot_name: credit.metadata?.pilot_name || 'A pilot',
              lapsed_at: now,
              original_expires_at: credit.expires_at,
              enterprise_seat_price: 1000,
              message: 'This promotional credit has lapsed and returned to the platform infrastructure pool. Future verification events will continue to generate Activation Credits for your organization.',
            },
            status: 'pending',
            created_at: now,
          });

        if (!notifyError) {
          results.notificationsQueued++;
        }

        console.log(`Credit ${credit.id} lapsed: $${credit.credit_amount} for ATO ${credit.ato_id}`);

      } catch (err: any) {
        results.errors.push(`Credit ${credit.id}: ${err.message}`);
        console.error(`Failed to process credit ${credit.id}:`, err);
      }
    }

    // Log summary
    console.log(`Activation Credit Expiry processed: ${results.lapsed} credits lapsed, $${results.totalAmount.toFixed(2)} returned to platform`);

    return new Response(
      JSON.stringify({
        processed: results.lapsed,
        total_amount: results.totalAmount.toFixed(2),
        notifications_queued: results.notificationsQueued,
        errors: results.errors,
        message: `${results.lapsed} activation credits lapsed. Funds returned to platform infrastructure pool.`,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err: any) {
    console.error('Activation credit expiry error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
