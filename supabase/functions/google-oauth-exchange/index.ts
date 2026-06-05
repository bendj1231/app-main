/**
 * google-oauth-exchange — Server-side Google OAuth token exchange
 *
 * Security: Google Client Secret lives in Supabase Edge Function secrets only.
 * Client JS never sees the secret.
 *
 * Flow:
 *   1. Client sends { code, redirectUri } after Google redirects back
 *   2. This function exchanges code for tokens with Google (using client_secret)
 *   3. Returns { id_token, access_token, refresh_token } to client
 *   4. Client calls supabase.auth.signInWithIdToken({ provider: 'google', token: id_token })
 */

/// <reference lib="deno.ns" />
import { getCorsHeaders } from '../_shared/cors.ts';

interface GoogleTokenResponse {
  access_token?: string;
  id_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
  error?: string;
  error_description?: string;
}

export default async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req) });
  }

  const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID') || '';
  const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET') || '';

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return new Response(
      JSON.stringify({ error: 'Server configuration error: missing Google OAuth credentials' }),
      { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  }

  let body: { code?: string; redirectUri?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body' }),
      { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  }

  const { code, redirectUri } = body;
  if (!code || !redirectUri) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: code, redirectUri' }),
      { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData: GoogleTokenResponse = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return new Response(
        JSON.stringify({
          error: 'Google token exchange failed',
          details: tokenData.error_description || tokenData.error,
        }),
        { status: 401, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    if (!tokenData.id_token) {
      return new Response(
        JSON.stringify({ error: 'No id_token in Google response' }),
        { status: 401, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        id_token: tokenData.id_token,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
      }),
      { status: 200, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: 'Internal error during token exchange', details: message }),
      { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  }
};
