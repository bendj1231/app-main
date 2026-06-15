import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'apikey, Authorization, Content-Type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const {
      userId,
      email,
      displayName,
      firstName,
      lastName,
      occupation,
      dob,
      totalHours,
      aircraftTypes,
      issuingAuthority,
      licenseTypes,
      ratings,
      elpLevel,
    } = body

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Upsert profile
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: email || null,
        display_name: displayName || null,
        first_name: firstName || null,
        last_name: lastName || null,
        occupation: occupation || null,
        dob: dob || null,
        total_hours: totalHours || null,
        aircraft_types: aircraftTypes || null,
        issuing_authority: issuingAuthority || null,
        license_types: licenseTypes || null,
        ratings: ratings || null,
        elp_level: elpLevel || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' })

    if (upsertError) {
      console.error('[create-wallet] upsert error:', upsertError)
      return new Response(JSON.stringify({ error: upsertError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Generate deterministic DID-style identifier
    const did = `did:pr:${userId}`

    return new Response(JSON.stringify({
      success: true,
      did,
      walletId: userId,
      createdAt: new Date().toISOString(),
    }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[create-wallet] error:', err)
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
