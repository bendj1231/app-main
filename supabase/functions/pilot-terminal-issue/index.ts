import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// PilotTerminal.com is the credential infrastructure domain
// All VCs are issued under did:web:pilotterminal.com
const ISSUER_DID = 'did:web:pilotrecognition.com';
const PILOT_ISSUER_URL = 'https://issuer.pilotrecognition.com';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  try {
    const {
      auth0_id,
      profile_id,
      credential_type,   // 'FlightHoursVC' | 'PilotLicenseVC' | 'MedicalCertVC' | 'TypeRatingVC'
      credential_data,   // the claims — varies by type
      source_provider,   // 'MyFlightBook' | 'Veremark' | 'ATO'
    } = await req.json();

    if (!auth0_id || !credential_type || !credential_data) {
      return new Response(JSON.stringify({ error: 'auth0_id, credential_type, and credential_data are required' }), {
        status: 400, headers: { ...CORS, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const issuanceDate = new Date().toISOString();
    const expirationDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    // Build credential subject based on type
    const subjectDid = `did:web:pilotrecognition.com:pilots:${auth0_id.replace('|', '-')}`;

    const credentialSubject: Record<string, any> = {
      id: subjectDid,
      platform: 'PilotTerminal',
      issuingPlatform: 'PilotRecognition',
      verifiedAt: issuanceDate,
      ...credential_data,
    };

    const credentialDataPayload = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/security/suites/jws-2020/v1',
        'https://pilotterminal.com/contexts/aviation/v1',
      ],
      type: ['VerifiableCredential', credential_type],
      issuer: { id: ISSUER_DID, name: 'PilotRecognition — Aviation Credential Infrastructure' },
      issuanceDate,
      expirationDate,
      credentialSubject,
    };

    // Onboard a fresh issuer key (dev mode — replace with PLATFORM_SIGNING_KEY_JWK secret in production)
    const ISSUER_JWK = Deno.env.get('PLATFORM_SIGNING_KEY_JWK');
    let issuerKey: any;
    let issuerDid = ISSUER_DID;

    if (ISSUER_JWK) {
      issuerKey = { type: 'jwk', jwk: JSON.parse(ISSUER_JWK) };
    } else {
      const onboardRes = await fetch(`${PILOT_ISSUER_URL}/onboard/issuer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: { backend: 'jwk', keyType: 'secp256r1' },
          did: { method: 'web', domain: 'pilotterminal.com' }
        })
      });
      if (!onboardRes.ok) {
        const err = await onboardRes.text();
        throw new Error(`Issuer onboard failed: ${err}`);
      }
      const onboardData = await onboardRes.json();
      issuerKey = { type: 'jwk', jwk: onboardData.issuerKey.jwk };
      issuerDid = onboardData.issuerDid || ISSUER_DID;
      console.log('[PilotTerminal] Onboarded issuer DID:', issuerDid);
    }

    // Issue via PilotRecognition OID4VCI
    const issueRes = await fetch(`${PILOT_ISSUER_URL}/openid4vc/jwt/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'accept': 'text/plain' },
      body: JSON.stringify({
        issuerKey,
        issuerDid,
        credentialConfigurationId: 'OpenBadgeCredential_jwt_vc_json',
        credentialData: credentialDataPayload,
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

    if (!issueRes.ok) {
      const err = await issueRes.text();
      throw new Error(`Issuer signing failed (${issueRes.status}): ${err}`);
    }

    const credentialOfferUrl = await issueRes.text();
    console.log('[PilotTerminal] VC issued:', credential_type, credentialOfferUrl.substring(0, 80));

    // Persist to Supabase
    const { data: inserted, error: dbError } = await supabase
      .from('pilot_credentials')
      .insert({
        profile_id: profile_id || null,
        auth0_id,
        credential_type,
        issuer_did: issuerDid,
        credential_offer_url: credentialOfferUrl,
        source_provider: source_provider || 'PilotTerminal',
        total_hours: credential_data.totalFlightHours || null,
        status: 'issued',
        metadata: { credentialData: credentialDataPayload, issuedVia: 'pilotrecognition.com' },
      })
      .select('id, credential_offer_url, issued_at')
      .single();

    if (dbError) throw new Error(`DB insert failed: ${dbError.message}`);

    return new Response(JSON.stringify({
      success: true,
      credential_id: inserted.id,
      credential_offer_url: credentialOfferUrl,
      issued_at: inserted.issued_at,
      issuer_did: issuerDid,
      credential_type,
      // Deep link for wallet claim
      claim_links: {
        pilot_wallet: `https://wallet.pilotrecognition.com/?offer=${encodeURIComponent(credentialOfferUrl)}`,
        iota: credentialOfferUrl,
      }
    }), {
      status: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    console.error('[pilot-terminal-issue] Error:', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' }
    });
  }
});
