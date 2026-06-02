/// <reference lib="deno.ns" />
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const CREDIT_AMOUNT = 20.00

import { getCorsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const corsHeaders = getCorsHeaders(req);

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Called when a referred pilot subscribes to Recognition+
    // Payload: { referredProfileId, subscriptionEventId }
    const { referredProfileId, subscriptionEventId } = await req.json()

    if (!referredProfileId) {
      return new Response(JSON.stringify({ error: 'Missing referredProfileId' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get the referred pilot's profile to find who referred them
    const { data: referredProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, referred_by_code, referral_credits')
      .eq('id', referredProfileId)
      .single()

    if (profileError || !referredProfile?.referred_by_code) {
      return new Response(JSON.stringify({ success: false, reason: 'No referral code on this profile' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Find the referrer by their referral code
    const { data: referrer, error: referrerError } = await supabase
      .from('profiles')
      .select('id, referral_credits, referral_code')
      .eq('referral_code', referredProfile.referred_by_code)
      .single()

    if (referrerError || !referrer) {
      return new Response(JSON.stringify({ success: false, reason: 'Referrer not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check if already credited for this referred pilot
    const { data: existing } = await supabase
      .from('referrals')
      .select('id, status')
      .eq('referrer_profile_id', referrer.id)
      .eq('referred_profile_id', referredProfileId)
      .eq('status', 'credited')
      .maybeSingle()

    if (existing) {
      return new Response(JSON.stringify({ success: false, reason: 'Already credited for this referral' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Credit $20 to referrer
    const newBalance = (referrer.referral_credits || 0) + CREDIT_AMOUNT
    await supabase
      .from('profiles')
      .update({ referral_credits: newBalance })
      .eq('id', referrer.id)

    // Record the referral event
    await supabase.from('referrals').insert({
      referrer_profile_id: referrer.id,
      referred_profile_id: referredProfileId,
      referral_code: referredProfile.referred_by_code,
      status: 'credited',
      credit_amount: CREDIT_AMOUNT,
      credited_at: new Date().toISOString(),
      subscription_event_id: subscriptionEventId || null,
    })

    console.log(`[referral-credit] $${CREDIT_AMOUNT} credited to ${referrer.id} — new balance $${newBalance}`)

    return new Response(JSON.stringify({
      success: true,
      referrerId: referrer.id,
      creditAmount: CREDIT_AMOUNT,
      newBalance,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
