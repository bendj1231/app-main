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

    // Map frontend field names to actual DB column names
    const profileData: Record<string, any> = {
      id: userId,
      updated_at: new Date().toISOString(),
    }

    if (email !== undefined) profileData.email = email
    if (displayName !== undefined) profileData.display_name = displayName
    if (firstName || lastName) profileData.full_name = `${firstName || ''} ${lastName || ''}`.trim() || null
    if (occupation !== undefined) profileData.track = occupation
    if (dob !== undefined) profileData.date_of_birth = dob || null
    if (totalHours !== undefined) profileData.total_flight_hours = totalHours || 0
    if (aircraftTypes !== undefined) profileData.aircraft_rated_on = Array.isArray(aircraftTypes) ? aircraftTypes.join(', ') : aircraftTypes
    if (issuingAuthority !== undefined) profileData.country_of_license = issuingAuthority
    if (licenseTypes !== undefined) profileData.license_id = Array.isArray(licenseTypes) ? licenseTypes.join(', ') : licenseTypes
    if (ratings !== undefined) profileData.ratings = Array.isArray(ratings) ? ratings : (ratings ? [ratings] : null)
    if (elpLevel !== undefined) profileData.english_proficiency_level = elpLevel

    console.log('[create-wallet] upserting profileData keys:', Object.keys(profileData))

    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert(profileData, { onConflict: 'id' })

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
