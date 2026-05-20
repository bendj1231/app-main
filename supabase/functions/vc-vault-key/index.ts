/**
 * vc-vault-key — Serve per-pilot vault pepper
 *
 * Flow:
 *   1. Pilot authenticates with Google via Auth0 → gets Supabase JWT
 *   2. Client calls GET /vc-vault-key with Bearer token
 *   3. This function validates JWT, extracts pilot's stable sub (auth0_id)
 *   4. Derives a deterministic pepper: HMAC-SHA256(VAULT_MASTER_SECRET, sub)
 *   5. Returns pepper — unique per pilot, consistent across logins
 *
 * Security properties:
 *   - Pilot must be authenticated to receive their pepper
 *   - Pepper is deterministic — same sub always → same pepper
 *   - VAULT_MASTER_SECRET never leaves this function
 *   - If VAULT_MASTER_SECRET is rotated, all vaults need re-encryption (migration)
 *   - Supabase RLS ensures pilot only gets their own pepper
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

/**
 * HMAC-SHA256 of (secret + sub) → hex string
 * Deterministic: same inputs always produce same output.
 */
async function derivePerPilotPepper(masterSecret: string, sub: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(masterSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(`pr:vault:pepper:${sub}`)
  );
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify JWT and get user identity
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    // Get the master secret — stored as Supabase secret VAULT_MASTER_SECRET
    const masterSecret = Deno.env.get('VAULT_MASTER_SECRET');
    if (!masterSecret) {
      console.error('[vc-vault-key] VAULT_MASTER_SECRET not set');
      return new Response(JSON.stringify({ error: 'Vault not configured' }), {
        status: 503, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    // Use auth0_id from profiles if available (stable Google sub),
    // fallback to Supabase user.id
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('auth0_id')
      .eq('id', user.id)
      .single();

    // Prefer auth0_id (google-oauth2|12345...) as it's the most stable identifier
    // Falls back to Supabase UUID if no auth0_id
    const stableSub = profile?.auth0_id || user.id;

    const pepper = await derivePerPilotPepper(masterSecret, stableSub);

    // Log vault key access for audit (non-blocking)
    supabaseAdmin.from('user_activity_log').insert({
      user_id: user.id,
      action: 'vault_key_accessed',
      details: {
        sub_type: profile?.auth0_id ? 'auth0_id' : 'supabase_id',
        accessed_at: new Date().toISOString(),
      },
      created_at: new Date().toISOString(),
    }).catch(() => {});

    return new Response(JSON.stringify({
      pepper,
      sub: stableSub,
      issued_at: new Date().toISOString(),
    }), {
      status: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('[vc-vault-key] Error:', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
