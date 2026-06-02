/// <reference lib="deno.ns" />
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

import { getCorsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
  const corsHeaders = getCorsHeaders(req);
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Verify the caller is authenticated
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const callerClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )
    const { data: { user }, error: authError } = await callerClient.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

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

    // Only allow generating a token for your own profile (admins exempt via RLS)
    if (user.id !== userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()
      if (!profile?.is_admin) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
          status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
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
