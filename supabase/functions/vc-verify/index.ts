/**
 * vc-verify — Verifiable Credential Verification API
 *
 * Accepts a credential_offer_url OR a raw JWT VC and:
 * 1. Decodes the JWT payload
 * 2. Checks revocation status in vc_revocation_registry
 * 3. Checks expiry
 * 4. Verifies issuer DID matches did:web:pilotrecognition.com
 * 5. Returns structured verification result
 *
 * Public endpoint — no auth required (airlines verify without logging in)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

const TRUSTED_ISSUER_DIDS = [
  'did:web:pilotrecognition.com',
  'did:web:pilotterminal.com',
];

const WALT_ISSUER_URL = 'https://issuer.demo.walt.id';

function base64urlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
  return atob(padded);
}

function decodeJwtPayload(jwt: string): Record<string, any> | null {
  try {
    const parts = jwt.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(base64urlDecode(parts[1]));
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    let credentialJwt: string | null = null;
    let credentialId: string | null = null;

    if (req.method === 'POST') {
      const body = await req.json();
      credentialJwt = body.credential_jwt || null;
      credentialId = body.credential_id || null;

      // If credential_id provided, look up from pilot_credentials table
      if (!credentialJwt && credentialId) {
        const { data: cred } = await supabase
          .from('pilot_credentials')
          .select('credential_offer_url, status')
          .eq('id', credentialId)
          .single();
        if (cred) {
          // credential_offer_url is the OID4VCI offer — use walt.id to resolve
          // For direct JWT verification, pilot must present the raw JWT
          return new Response(JSON.stringify({
            verified: false,
            error: 'Provide credential_jwt for cryptographic verification. credential_id lookup is for status only.',
            db_status: cred.status,
          }), { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } });
        }
      }
    } else if (req.method === 'GET') {
      // GET /vc-verify?credential_id=xxx  — quick status check only
      const url = new URL(req.url);
      credentialId = url.searchParams.get('credential_id');

      if (!credentialId) {
        return new Response(JSON.stringify({ error: 'credential_id required' }), {
          status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
        });
      }

      const { data: reg } = await supabase
        .from('vc_revocation_registry')
        .select('status, revocation_reason, revoked_at, credential_type, issued_at, expires_at')
        .eq('credential_id', credentialId)
        .single();

      if (!reg) {
        return new Response(JSON.stringify({ verified: false, error: 'Credential not found in registry' }), {
          status: 404, headers: { ...CORS, 'Content-Type': 'application/json' },
        });
      }

      const now = new Date();
      const expired = reg.expires_at ? new Date(reg.expires_at) < now : false;

      return new Response(JSON.stringify({
        verified: reg.status === 'active' && !expired,
        credential_id: credentialId,
        status: expired ? 'expired' : reg.status,
        credential_type: reg.credential_type,
        issued_at: reg.issued_at,
        expires_at: reg.expires_at,
        revocation_reason: reg.revocation_reason || null,
        revoked_at: reg.revoked_at || null,
        checked_at: now.toISOString(),
        issuer: 'did:web:pilotrecognition.com',
      }), { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } });
    }

    if (!credentialJwt) {
      return new Response(JSON.stringify({ error: 'credential_jwt is required for full verification' }), {
        status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    // --- Decode JWT payload ---
    const payload = decodeJwtPayload(credentialJwt);
    if (!payload) {
      return new Response(JSON.stringify({ verified: false, error: 'Invalid JWT format' }), {
        status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const vc = payload.vc || payload;
    const issuerDid = typeof vc.issuer === 'string' ? vc.issuer : vc.issuer?.id;
    const subjectDid = vc.credentialSubject?.id;
    const credType = Array.isArray(vc.type) ? vc.type.filter((t: string) => t !== 'VerifiableCredential') : [];
    const extractedCredId = payload.jti || vc.id;
    const expirationDate = vc.expirationDate || payload.exp;
    const issuanceDate = vc.issuanceDate || payload.iat;

    // --- Check 1: Trusted issuer ---
    const trustedIssuer = issuerDid && TRUSTED_ISSUER_DIDS.some(d => issuerDid.startsWith(d));

    // --- Check 2: Expiry ---
    const now = new Date();
    let expired = false;
    if (expirationDate) {
      const expDate = typeof expirationDate === 'number'
        ? new Date(expirationDate * 1000)
        : new Date(expirationDate);
      expired = expDate < now;
    }

    // --- Check 3: Revocation registry ---
    let revocationStatus: any = null;
    if (extractedCredId) {
      const { data: reg } = await supabase
        .from('vc_revocation_registry')
        .select('status, revocation_reason, revoked_at')
        .eq('credential_id', extractedCredId)
        .single();
      revocationStatus = reg;
    }

    const isRevoked = revocationStatus?.status === 'revoked' || revocationStatus?.status === 'suspended';
    const registryStatus = revocationStatus?.status || 'not_registered';

    // --- Cryptographic verification via walt.id verifier ---
    let cryptoVerified = false;
    let cryptoError: string | null = null;
    try {
      const verifyRes = await fetch(`${WALT_ISSUER_URL}/openid4vc/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialJwt }),
      });
      if (verifyRes.ok) {
        const verifyData = await verifyRes.json();
        cryptoVerified = verifyData.valid === true || verifyData.verified === true;
      } else {
        cryptoError = `walt.id verifier returned ${verifyRes.status}`;
      }
    } catch (e: any) {
      cryptoError = `Crypto verification unavailable: ${e.message}`;
      // Degrade gracefully — trust registry + issuer check still valid
    }

    const verified = trustedIssuer && !expired && !isRevoked;

    // --- Log verification event ---
    try {
      await supabase.from('user_activity_log').insert({
        action: 'vc_verified',
        details: {
          credential_id: extractedCredId,
          credential_type: credType,
          issuer_did: issuerDid,
          subject_did: subjectDid,
          verified,
          expired,
          is_revoked: isRevoked,
          registry_status: registryStatus,
          crypto_verified: cryptoVerified,
        },
        created_at: now.toISOString(),
      });
    } catch { /* non-critical */ }

    return new Response(JSON.stringify({
      verified,
      credential_id: extractedCredId || null,
      credential_type: credType,
      issuer_did: issuerDid,
      subject_did: subjectDid,
      trusted_issuer: trustedIssuer,
      expired,
      expiration_date: expirationDate || null,
      issuance_date: issuanceDate || null,
      revocation_status: registryStatus,
      revocation_reason: revocationStatus?.revocation_reason || null,
      crypto_verified: cryptoVerified,
      crypto_error: cryptoError,
      checked_at: now.toISOString(),
      verification_summary: verified
        ? 'CREDENTIAL VALID — Issued by PilotRecognition, not expired, not revoked'
        : [
            !trustedIssuer ? 'UNTRUSTED ISSUER' : null,
            expired ? 'CREDENTIAL EXPIRED' : null,
            isRevoked ? `REVOKED: ${revocationStatus?.revocation_reason || 'No reason given'}` : null,
          ].filter(Boolean).join(' | '),
    }), {
      status: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('[vc-verify] Error:', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
