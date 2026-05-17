import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { userId } = await req.json()

    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Fetch pilot profile data
    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        id,
        auth0_id,
        display_name,
        current_flight_hours,
        license_id,
        country_of_license,
        aircraft_rated_on,
        pilot_category,
        account_tier,
        verification_status,
        created_at
      `)
      .eq('id', userId)
      .single()

    if (error || !profile) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Build canonical data string — deterministic order for consistent hashing
    const canonicalData = [
      profile.auth0_id || '',
      profile.current_flight_hours || '0',
      profile.license_id || '',
      profile.country_of_license || '',
      profile.aircraft_rated_on || '',
      profile.pilot_category || '',
      profile.account_tier || 'free',
      profile.verification_status || 'unverified',
      profile.created_at || '',
    ].join('|')

    // SHA-256 hash
    const encoder = new TextEncoder()
    const data = encoder.encode(canonicalData)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // Versioned token format: PR-v1-<first 32 chars of hash>
    const token = `PR-v1-${hashHex.substring(0, 32).toUpperCase()}`

    // Store token in profile
    await supabase
      .from('profiles')
      .update({
        profile_token: token,
        profile_token_generated_at: new Date().toISOString(),
        profile_token_version: 1,
      })
      .eq('id', userId)

    return new Response(JSON.stringify({
      success: true,
      token,
      generated_at: new Date().toISOString(),
      fields_hashed: [
        'auth0_id (anonymous)',
        'flight_hours',
        'license_id',
        'country_of_license',
        'aircraft_rated_on',
        'pilot_category',
        'account_tier',
        'verification_status',
        'created_at',
      ]
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
