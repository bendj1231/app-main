import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { code, redirect_uri, auth0_id } = await req.json()

    if (!code || !redirect_uri) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: code, redirect_uri' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://www.myflightbook.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        client_id: Deno.env.get('MFB_CLIENT_ID') || 'PilotRecognition',
        client_secret: Deno.env.get('MFB_CLIENT_SECRET') || '',
      })
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('MFB token exchange failed:', errorText)
      return new Response(
        JSON.stringify({ error: 'Failed to exchange authorization code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Fetch pilot's flight data from MyFlightBook
    const flightsResponse = await fetch('https://www.myflightbook.com/api/logbookexport?format=json', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    })

    if (!flightsResponse.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch flight data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const flightsData = await flightsResponse.json()
    
    // Calculate total flight hours
    let totalHours = 0
    if (flightsData.flights && Array.isArray(flightsData.flights)) {
      totalHours = flightsData.flights.reduce((sum: number, flight: any) => {
        return sum + (parseFloat(flight.TotalTime) || 0)
      }, 0)
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    )

    // Store minimal metadata (not the actual flight data)
    if (auth0_id) {
      await supabase
        .from('profiles')
        .update({ 
          logbook_synced_at: new Date().toISOString(),
          total_hours: totalHours,
          logbook_provider: 'MyFlightBook'
        })
        .eq('auth0_id', auth0_id)
    }

    // Issue FlightHoursVC credential to Pilot Wallet
    let credentialData = null
    try {
      const PILOT_ISSUER_URL = 'https://issuer.pilotrecognition.com'
      const ISSUER_DID = 'did:web:pilotrecognition.com'
      const subjectDid = auth0_id ? `did:web:pilotrecognition.com:pilots:${auth0_id.replace('|', '-')}` : null

      if (subjectDid) {
        const issuanceDate = new Date().toISOString()
        const expirationDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()

        // Onboard issuer key (dev mode)
        const onboardRes = await fetch(`${PILOT_ISSUER_URL}/onboard/issuer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: { backend: 'jwk', keyType: 'secp256r1' },
            did: { method: 'jwk' }
          })
        })
        
        if (onboardRes.ok) {
          const onboardData = await onboardRes.json()

          // Create FlightHoursVC credential
          const flightHoursCredential = {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            type: ['VerifiableCredential', 'FlightHoursVC'],
            issuer: { id: ISSUER_DID, name: 'PilotRecognition' },
            issuanceDate,
            expirationDate,
            credentialSubject: {
              id: subjectDid,
              totalFlightHours: Math.round(totalHours * 100) / 100, // Round to 2 decimal places
              platform: 'MyFlightBook',
              syncDate: issuanceDate,
              verifiedAt: issuanceDate,
              dataSource: 'MyFlightBook API',
              flightCount: flightsData.flights?.length || 0,
            },
          }

          // Issue credential via OID4VCI
          const issueRes = await fetch(`${PILOT_ISSUER_URL}/openid4vc/jwt/issue`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'accept': 'text/plain' },
            body: JSON.stringify({
              issuerKey: { type: 'jwk', jwk: onboardData.issuerKey.jwk },
              issuerDid: onboardData.issuerDid || ISSUER_DID,
              credentialConfigurationId: 'OpenBadgeCredential_jwt_vc_json',
              credentialData: flightHoursCredential,
              mapping: {
                id: '<uuid>',
                issuer: { id: '<issuerDid>' },
                credentialSubject: { id: '<subjectDid>' },
                issuanceDate: '<timestamp>',
                expirationDate: '<timestamp-in:365d>',
              },
              authenticationMethod: 'PRE_AUTHORIZED',
              standardVersion: 'DRAFT13',
            })
          })

          if (issueRes.ok) {
            const credentialOfferUrl = await issueRes.text()
            credentialData = {
              id: `flight-hours-${Date.now()}`,
              offer_url: credentialOfferUrl,
              type: 'FlightHoursVC'
            }
          }
        }
      }
    } catch (credentialError) {
      console.error('Failed to issue FlightHoursVC:', credentialError)
      // Continue without credential - still return hours data
    }

    return new Response(
      JSON.stringify({
        totalHours,
        flights: flightsData.flights?.length || 0,
        lastSync: new Date().toISOString(),
        credential: credentialData
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('MFB token exchange error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
