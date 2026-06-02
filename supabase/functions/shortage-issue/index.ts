/**
 * shortage-issue - Anonymous Credential Issuance for pilotshortage.org
 * 
 * Issues privacy-preserving credentials for PSA pilots.
 * Does NOT store PII - only cryptographic proofs.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const ISSUER_DID = 'did:web:pilotrecognition.com';
const PILOT_ISSUER_URL = 'https://issuer.pilotrecognition.com';

// Hash function for anonymization
async function hashLicense(licenseNumber: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(licenseNumber.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const {
      auth0_id,
      profile_id,
      license_hash,      // Pre-hashed by client
      license_type,
      verification_level, // 'anonymous' | 'verified'
    } = await req.json();

    if (!auth0_id || !profile_id) {
      return new Response(
        JSON.stringify({ error: 'auth0_id and profile_id required' }),
        { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    const subjectDid = `did:web:pilotrecognition.com:pilots:${auth0_id.replace('|', '-')}`;
    const issuanceDate = new Date().toISOString();
    const expirationDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    // Build privacy-preserving credential
    const credentialData = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential', 'AnonymousPilotVC'],
      issuer: { id: ISSUER_DID, name: 'Pilot Shortage Alliance' },
      issuanceDate,
      expirationDate,
      credentialSubject: {
        id: subjectDid,
        pilotStatus: verification_level === 'verified' ? 'VERIFIED_PILOT' : 'SELF_ATTESTED',
        licenseHash: license_hash || null,  // Anonymous fingerprint
        licenseType: license_type || 'Unknown',
        // NO PII - no name, no actual license number, no DOB
        domainSource: 'pilotshortage.org',
      },
    };

    // Issue credential
    const onboardRes = await fetch(`${PILOT_ISSUER_URL}/onboard/issuer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: { backend: 'jwk', keyType: 'secp256r1' },
        did: { method: 'jwk' }
      })
    });

    if (!onboardRes.ok) throw new Error('Issuer onboard failed');
    const onboardData = await onboardRes.json();

    const issueRes = await fetch(`${PILOT_ISSUER_URL}/openid4vc/jwt/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'accept': 'text/plain' },
      body: JSON.stringify({
        issuerKey: { type: 'jwk', jwk: onboardData.issuerKey.jwk },
        issuerDid: onboardData.issuerDid || ISSUER_DID,
        credentialConfigurationId: 'OpenBadgeCredential_jwt_vc_json',
        credentialData,
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
    });

    if (!issueRes.ok) throw new Error('Credential issuance failed');
    const credentialOfferUrl = await issueRes.text();

    // Store minimal record (NO PII)
    const { data: inserted, error: dbError } = await supabase
      .from('pilot_credentials')
      .insert({
        profile_id,
        auth0_id,
        credential_type: 'AnonymousPilotVC',
        issuer_did: ISSUER_DID,
        subject_did: subjectDid,
        credential_offer_url: credentialOfferUrl,
        credential_jwt: credentialOfferUrl,
        source_provider: 'pilotshortage.org',
        status: 'active',
        issued_at: issuanceDate,
        expires_at: expirationDate,
        metadata: {
          verificationLevel: verification_level,
          domainSource: 'shortage',
          privacyMode: 'anonymous',
        },
      })
      .select()
      .single();

    if (dbError) throw new Error(`Database insert failed: ${dbError.message}`);

    return new Response(
      JSON.stringify({
        success: true,
        credential_id: inserted.id,
        credential_offer_url: credentialOfferUrl,
        verification_level,
        privacy_note: 'No PII stored. Only cryptographic proof of pilot status.',
      }),
      { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } }
    );

  } catch (err: any) {
    console.error('[shortage-issue] Error:', err.message);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
    );
  }
});
