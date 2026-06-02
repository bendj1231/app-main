/// <reference lib="deno.ns" />
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

import { getCorsHeaders } from '../_shared/cors.ts';

function generateCode(auth0Id: string): string {
  // Deterministic short code: PR- + first 8 chars of auth0Id hash-like suffix
  const clean = auth0Id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
  return `PR-${clean.slice(-8)}`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const corsHeaders = getCorsHeaders(req);

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { auth0Id, profileId } = await req.json()

    if (!auth0Id || !profileId) {
      return new Response(JSON.stringify({ error: 'Missing auth0Id or profileId' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check if code already exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('referral_code')
      .eq('id', profileId)
      .single()

    if (existing?.referral_code) {
      return new Response(JSON.stringify({ referralCode: existing.referral_code }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Generate and store unique code
    const referralCode = generateCode(auth0Id)

    await supabase
      .from('profiles')
      .update({ referral_code: referralCode })
      .eq('id', profileId)

    console.log(`[generate-referral] Code ${referralCode} created for ${profileId}`)

    return new Response(JSON.stringify({ referralCode }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
