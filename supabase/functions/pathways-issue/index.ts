/**
 * pathways-issue - Career Credential Issuance for pilotcareerpathways.com
 * 
 * Issues job-application-ready credentials for pilots applying to airline pathways.
 * Optimized for airline HR systems and ATS integration.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const ISSUER_DID = 'did:web:pilotrecognition.com';
const PILOT_ISSUER_URL = 'https://issuer.pilotrecognition.com';

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
      license_number,
      license_type,
      issuing_authority,
      license_expiry,
      medical_class,
      medical_expiry,
      total_hours,
      ratings = [],
      atp_theory_passed = false,
    } = await req.json();

    if (!auth0_id || !profile_id || !license_number) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    const subjectDid = `did:web:pilotrecognition.com:pilots:${auth0_id.replace('|', '-')}`;
    const issuanceDate = new Date().toISOString();
    const expirationDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    // Onboard issuer
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

    const issuedCredentials = [];

    // 1. Issue PilotLicenseVC
    const licenseCred = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential', 'PilotLicenseVC'],
      issuer: { id: ISSUER_DID, name: 'Pilot Career Pathways' },
      issuanceDate,
      expirationDate: license_expiry || expirationDate,
      credentialSubject: {
        id: subjectDid,
        licenseNumber: license_number,
        licenseType: license_type,
        issuingAuthority: issuing_authority,
        ratings: ratings,
        atpTheoryPassed: atp_theory_passed,
        domainSource: 'pilotcareerpathways.com',
      },
    };

    const licenseRes = await fetch(`${PILOT_ISSUER_URL}/openid4vc/jwt/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'accept': 'text/plain' },
      body: JSON.stringify({
        issuerKey: { type: 'jwk', jwk: onboardData.issuerKey.jwk },
        issuerDid: onboardData.issuerDid || ISSUER_DID,
        credentialConfigurationId: 'OpenBadgeCredential_jwt_vc_json',
        credentialData: licenseCred,
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

    if (licenseRes.ok) {
      const offerUrl = await licenseRes.text();
      const { data: inserted } = await supabase.from('pilot_credentials').insert({
        profile_id,
        auth0_id,
        credential_type: 'PilotLicenseVC',
        issuer_did: ISSUER_DID,
        subject_did: subjectDid,
        credential_offer_url: offerUrl,
        credential_jwt: offerUrl,
        source_provider: 'pilotcareerpathways.com',
        status: 'active',
        issued_at: issuanceDate,
        expires_at: license_expiry || expirationDate,
        metadata: {
          licenseType: license_type,
          issuingAuthority: issuing_authority,
          ratings,
          domainSource: 'pathways',
        },
      }).select().single();

      issuedCredentials.push({ type: 'PilotLicenseVC', id: inserted?.id });
    }

    // 2. Issue MedicalCertVC (if provided)
    if (medical_class) {
      const medicalCred = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'MedicalCertVC'],
        issuer: { id: ISSUER_DID, name: 'Pilot Career Pathways' },
        issuanceDate,
        expirationDate: medical_expiry || expirationDate,
        credentialSubject: {
          id: subjectDid,
          medicalClass: medical_class,
          issuingAuthority: issuing_authority, // Same as license usually
          limitations: [],
        },
      };

      const medicalRes = await fetch(`${PILOT_ISSUER_URL}/openid4vc/jwt/issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'accept': 'text/plain' },
        body: JSON.stringify({
          issuerKey: { type: 'jwk', jwk: onboardData.issuerKey.jwk },
          issuerDid: onboardData.issuerDid || ISSUER_DID,
          credentialConfigurationId: 'OpenBadgeCredential_jwt_vc_json',
          credentialData: medicalCred,
          authenticationMethod: 'PRE_AUTHORIZED',
          standardVersion: 'DRAFT13',
        })
      });

      if (medicalRes.ok) {
        const offerUrl = await medicalRes.text();
        const { data: inserted } = await supabase.from('pilot_credentials').insert({
          profile_id,
          auth0_id,
          credential_type: 'MedicalCertVC',
          issuer_did: ISSUER_DID,
          subject_did: subjectDid,
          credential_offer_url: offerUrl,
          credential_jwt: offerUrl,
          source_provider: 'pilotcareerpathways.com',
          status: 'active',
          issued_at: issuanceDate,
          expires_at: medical_expiry || expirationDate,
          metadata: { medicalClass: medical_class, domainSource: 'pathways' },
        }).select().single();

        issuedCredentials.push({ type: 'MedicalCertVC', id: inserted?.id });
      }
    }

    // 3. Issue FlightHoursVC (if provided)
    if (total_hours && total_hours > 0) {
      const hoursCred = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'FlightHoursVC'],
        issuer: { id: ISSUER_DID, name: 'Pilot Career Pathways' },
        issuanceDate,
        expirationDate,
        credentialSubject: {
          id: subjectDid,
          totalFlightHours: total_hours,
          verifiedAt: issuanceDate,
          verificationMethod: 'Self-Attested via Career Wallet',
        },
      };

      const hoursRes = await fetch(`${PILOT_ISSUER_URL}/openid4vc/jwt/issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'accept': 'text/plain' },
        body: JSON.stringify({
          issuerKey: { type: 'jwk', jwk: onboardData.issuerKey.jwk },
          issuerDid: onboardData.issuerDid || ISSUER_DID,
          credentialConfigurationId: 'OpenBadgeCredential_jwt_vc_json',
          credentialData: hoursCred,
          authenticationMethod: 'PRE_AUTHORIZED',
          standardVersion: 'DRAFT13',
        })
      });

      if (hoursRes.ok) {
        const offerUrl = await hoursRes.text();
        const { data: inserted } = await supabase.from('pilot_credentials').insert({
          profile_id,
          auth0_id,
          credential_type: 'FlightHoursVC',
          issuer_did: ISSUER_DID,
          subject_did: subjectDid,
          credential_offer_url: offerUrl,
          credential_jwt: offerUrl,
          source_provider: 'pilotcareerpathways.com',
          status: 'active',
          issued_at: issuanceDate,
          expires_at: expirationDate,
          total_hours: total_hours,
          metadata: { totalHours: total_hours, domainSource: 'pathways' },
        }).select().single();

        issuedCredentials.push({ type: 'FlightHoursVC', id: inserted?.id });
      }
    }

    // Update pathway matching scores
    await supabase.rpc('recalculate_pathway_matches', { 
      p_profile_id: profile_id 
    });

    return new Response(
      JSON.stringify({
        success: true,
        credentials_issued: issuedCredentials.length,
        credentials: issuedCredentials,
        ready_for_applications: true,
      }),
      { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } }
    );

  } catch (err: any) {
    console.error('[pathways-issue] Error:', err.message);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
    );
  }
});
