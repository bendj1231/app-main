/// <reference lib="deno.ns" />
/**
 * vc-status — Public Revocation Registry Read Endpoint
 *
 * Called by airlines, operators, and wallets to check if a credential is still valid.
 * No auth required — this is the public trust anchor endpoint.
 *
 * GET  /vc-status?credential_id=xxx
 * GET  /vc-status?subject_did=did:web:pilotrecognition.com:pilots:xxx
 * POST /vc-status  { credential_ids: [array] }  — bulk check
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': getCorsHeaders(req)['Access-Control-Allow-Origin'],
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  const corsHeaders = getCorsHeaders(req);

  try {
    // Use anon key — public read via RLS policy
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    );

    const now = new Date();

    if (req.method === 'GET') {
      const url = new URL(req.url);
      const credentialId = url.searchParams.get('credential_id');
      const subjectDid = url.searchParams.get('subject_did');

      if (!credentialId && !subjectDid) {
        return new Response(JSON.stringify({ error: 'credential_id or subject_did required' }), {
          status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
        });
      }

      let query = supabase
        .from('vc_revocation_registry')
        .select('credential_id, credential_type, status, expires_at, issued_at, revoked_at, revocation_reason, issuer_did, subject_did');

      if (credentialId) {
        query = query.eq('credential_id', credentialId);
      } else {
        query = query.eq('subject_did', subjectDid!);
      }

      const { data: records, error } = await query;

      if (error) throw new Error(error.message);
      if (!records || records.length === 0) {
        return new Response(JSON.stringify({
          found: false,
          message: 'Credential not found in registry. It may be self-attested or not yet registered.',
        }), {
          status: 404, headers: { ...CORS, 'Content-Type': 'application/json' },
        });
      }

      const results = records.map(r => {
        const expired = r.expires_at ? new Date(r.expires_at) < now : false;
        return {
          credential_id: r.credential_id,
          credential_type: r.credential_type,
          issuer_did: r.issuer_did,
          subject_did: r.subject_did,
          status: expired ? 'expired' : r.status,
          valid: r.status === 'active' && !expired,
          issued_at: r.issued_at,
          expires_at: r.expires_at,
          revoked_at: r.revoked_at || null,
          revocation_reason: r.revocation_reason || null,
        };
      });

      return new Response(JSON.stringify({
        found: true,
        checked_at: now.toISOString(),
        registry: 'did:web:pilotrecognition.com',
        results,
      }), {
        status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      const credentialIds: string[] = body.credential_ids || [];

      if (!credentialIds.length || credentialIds.length > 50) {
        return new Response(JSON.stringify({ error: 'credential_ids must be array of 1-50 IDs' }), {
          status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
        });
      }

      const { data: records, error } = await supabase
        .from('vc_revocation_registry')
        .select('credential_id, credential_type, status, expires_at, issued_at, revoked_at, revocation_reason, issuer_did, subject_did')
        .in('credential_id', credentialIds);

      if (error) throw new Error(error.message);

      const foundIds = new Set(records?.map(r => r.credential_id) || []);

      const results = credentialIds.map(id => {
        const r = records?.find(rec => rec.credential_id === id);
        if (!r) return { credential_id: id, found: false, valid: false, status: 'not_registered' };

        const expired = r.expires_at ? new Date(r.expires_at) < now : false;
        return {
          credential_id: id,
          found: true,
          credential_type: r.credential_type,
          issuer_did: r.issuer_did,
          subject_did: r.subject_did,
          status: expired ? 'expired' : r.status,
          valid: r.status === 'active' && !expired,
          issued_at: r.issued_at,
          expires_at: r.expires_at,
          revoked_at: r.revoked_at || null,
          revocation_reason: r.revocation_reason || null,
        };
      });

      const allValid = results.every(r => r.valid);
      const anyRevoked = results.some(r => r.status === 'revoked' || r.status === 'suspended');

      return new Response(JSON.stringify({
        checked_at: now.toISOString(),
        registry: 'did:web:pilotrecognition.com',
        total_checked: credentialIds.length,
        all_valid: allValid,
        any_revoked: anyRevoked,
        results,
      }), {
        status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...CORS, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('[vc-status] Error:', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
