import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Veremark's registered public encryption JWK — set this once when Veremark onboards
// In production, store in Supabase secrets: VEREMARK_PUBLIC_JWK
const VEREMARK_PUBLIC_JWK = Deno.env.get('VEREMARK_PUBLIC_JWK')
  ? JSON.parse(Deno.env.get('VEREMARK_PUBLIC_JWK')!)
  : null

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ── Base64url helpers ────────────────────────────────────────────────────────

function base64urlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '='))
  return new Uint8Array([...bin].map(c => c.charCodeAt(0)))
}

// ── Verify a JWS proof from Veremark using their registered public key ────────

async function verifyVeremarkJWS(
  jws: string,
  publicJwk: JsonWebKey
): Promise<{ valid: boolean; payload?: Record<string, unknown> }> {
  try {
    const parts = jws.split('.')
    if (parts.length !== 3) return { valid: false }

    const signingInput = `${parts[0]}.${parts[1]}`
    const signature = base64urlDecode(parts[2])

    const publicKey = await crypto.subtle.importKey(
      'jwk', publicJwk,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false, ['verify']
    )

    const valid = await crypto.subtle.verify(
      { name: 'ECDSA', hash: 'SHA-256' },
      publicKey,
      signature.buffer as ArrayBuffer,
      new TextEncoder().encode(signingInput).buffer as ArrayBuffer
    )

    if (!valid) return { valid: false }

    const payload = JSON.parse(new TextDecoder().decode(base64urlDecode(parts[1])))
    return { valid: true, payload }
  } catch (err) {
    console.error('[verify-completion] JWS verify error:', err)
    return { valid: false }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const {
      recordId,
      veremarkPublicJwk,
      verificationProofJWS,
    } = await req.json()

    if (!recordId || !verificationProofJWS) {
      return new Response(JSON.stringify({ error: 'Missing recordId or verificationProofJWS' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Use registered Veremark key, or the key submitted with the request (dev mode)
    const veremarkKey = VEREMARK_PUBLIC_JWK || veremarkPublicJwk
    if (!veremarkKey) {
      return new Response(JSON.stringify({ error: 'Veremark public key not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Step 1: Verify the JWS signature — proves the approval came from Veremark
    const { valid, payload } = await verifyVeremarkJWS(verificationProofJWS, veremarkKey)

    if (!valid || !payload) {
      console.warn('[verify-completion] Invalid JWS signature for record:', recordId)
      return new Response(JSON.stringify({ error: 'Invalid signature proof. Signal rejected.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (payload.assertion !== 'Verified and Cleared') {
      return new Response(JSON.stringify({ error: 'Payload assertion mismatch.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const pilotDid = payload.pilotDid as string
    const veremarkDid = payload.veriferDid as string

    // Step 2: Fetch the verification request record
    const { data: record, error: recordError } = await supabase
      .from('pilot_verification_requests')
      .select('id, profile_id, auth0_id, status')
      .eq('id', recordId)
      .single()

    if (recordError || !record) {
      return new Response(JSON.stringify({ error: 'Verification record not found.' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (record.status === 'verified_and_completed') {
      return new Response(JSON.stringify({ success: true, alreadyVerified: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Step 3: Update verification request to completed
    await supabase
      .from('pilot_verification_requests')
      .update({
        status: 'verified_and_completed',
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', recordId)

    // Step 4: Flip the pilot's profile to verified — the final status signal
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        is_verified: true,
        verified_at: new Date().toISOString(),
        verification_audit_record_id: recordId,
        veremark_subject_did: veremarkDid || null,
      })
      .eq('id', record.profile_id)

    if (profileError) {
      console.error('[verify-completion] Profile update failed:', profileError)
      return new Response(JSON.stringify({ error: 'Profile update failed.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`[verify-completion] Pilot ${record.profile_id} verified. DID: ${pilotDid}`)

    // Step 5: Issue platform-signed VerifiedOperatorVC (the digital watermark)
    // Signed by PilotRecognition's self-hosted issuer
    let watermarkCredentialUrl: string | null = null
    try {
      const PILOT_ISSUER_URL = Deno.env.get('PILOT_ISSUER_URL') || 'https://issuer.pilotrecognition.com'
      const now = new Date()
      const issuanceDate = now.toISOString()
      const expirationDate = new Date(now.getFullYear() + 2, now.getMonth(), now.getDate()).toISOString()

      // Onboard issuer key
      const onboardRes = await fetch(`${PILOT_ISSUER_URL}/onboard/issuer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: { backend: 'jwk', keyType: 'secp256r1' }, did: { method: 'jwk' } })
      })

      if (onboardRes.ok) {
        const onboardData = await onboardRes.json()

        const issueRes = await fetch(`${PILOT_ISSUER_URL}/openid4vc/jwt/issue`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'accept': 'text/plain' },
          body: JSON.stringify({
            issuerKey: { type: 'jwk', jwk: onboardData.issuerKey.jwk },
            issuerDid: onboardData.issuerDid,
            credentialConfigurationId: 'OpenBadgeCredential_jwt_vc_json',
            credentialData: {
              '@context': ['https://www.w3.org/2018/credentials/v1'],
              type: ['VerifiableCredential', 'VerifiedOperatorVC'],
              issuer: onboardData.issuerDid,
              issuanceDate,
              expirationDate,
              credentialSubject: {
                id: pilotDid || `did:web:pilotrecognition.com:pilots:${record.profile_id}`,
                status: 'VERIFIED_OPERATOR',
                verifiedBy: 'Veremark',
                verifiedAt: now.toISOString(),
                auditRecordId: recordId,
                issuedBy: 'PilotRecognition',
              },
            },
          })
        })

        if (issueRes.ok) {
          watermarkCredentialUrl = await issueRes.text()

          // Store watermark VC in pilot_credentials
          await supabase.from('pilot_credentials').insert({
            profile_id: record.profile_id,
            auth0_id: record.auth0_id,
            credential_type: 'VerifiedOperatorVC',
            issuer_did: onboardData.issuerDid,
            subject_did: pilotDid || `did:web:pilotrecognition.com:pilots:${record.profile_id}`,
            credential_offer_url: watermarkCredentialUrl,
            credential_jwt: watermarkCredentialUrl,
            source_provider: 'pilotrecognition',
            status: 'active',
            issued_at: issuanceDate,
            expires_at: expirationDate,
            metadata: { verifiedBy: 'Veremark', auditRecordId: recordId },
          })

          console.log(`[verify-completion] VerifiedOperatorVC issued for ${record.profile_id}`)
        }
      }
    } catch (watermarkErr) {
      console.warn('[verify-completion] Watermark issuance failed (non-critical):', watermarkErr)
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Signal validated. Pilot profile updated to VERIFIED status.',
      profileId: record.profile_id,
      watermarkIssued: !!watermarkCredentialUrl,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[verify-completion] Error:', message)
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
