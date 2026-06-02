/// <reference lib="deno.ns" />
/**
 * passkey-challenge — Issue a single-use WebAuthn challenge
 *
 * Called before navigator.credentials.get() on the login page.
 * Stores the challenge server-side so passkey-verify can validate it.
 * Challenges expire in 5 minutes and are deleted after single use.
 *
 * POST body: { credentialId: string }
 * Response:  { challenge: string }  (base64url-encoded random bytes)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function generateChallenge(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

Deno.serve(async (req: Request) => {
import { getCorsHeaders } from '../_shared/cors.ts';
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { credentialId } = await req.json();

    if (!credentialId) {
      return new Response(JSON.stringify({ error: 'credentialId required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify the credential exists before issuing a challenge
    const { data: passkey } = await supabase
      .from('pilot_passkeys')
      .select('id')
      .eq('credential_id', credentialId)
      .single();

    if (!passkey) {
      return new Response(JSON.stringify({ error: 'Credential not registered' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const challenge = generateChallenge();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Delete any existing challenge for this credential (replace stale ones)
    await supabase.from('pilot_passkey_challenges').delete().eq('credential_id', credentialId);

    // Store new challenge
    const { error } = await supabase.from('pilot_passkey_challenges').insert({
      credential_id: credentialId,
      challenge,
      expires_at: expiresAt,
    });

    if (error) throw error;

    return new Response(JSON.stringify({ challenge }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('[passkey-challenge] Error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
