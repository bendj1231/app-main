import { supabase } from './supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Exchanges a Google authorization code for a Supabase session
 * Server-side token exchange keeps Google Client Secret out of client JS.
 *
 * @param code - The Google OAuth authorization code
 * @param redirectUri - The redirect URI used in the OAuth flow
 * @returns The Supabase session data
 * @throws Error if the token exchange or Supabase sign-in fails
 */
export async function exchangeCodeForSupabaseSession(
  code: string,
  redirectUri: string
): Promise<{
  data: { session: unknown; user: unknown };
  error: null;
}> {
  const timestamp = new Date().toISOString();

  try {
    // Step 1: Exchange authorization code via server-side edge function
    // Google Client Secret never touches the browser.
    const edgeRes = await fetch(`${SUPABASE_URL}/functions/v1/google-oauth-exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ code, redirectUri }),
    });

    const tokenData = await edgeRes.json();

    if (!edgeRes.ok) {
      console.error(`[${timestamp}] [SUPABASE OAUTH ERROR] Edge function token exchange failed`);
      console.error(`[${timestamp}] [SUPABASE OAUTH ERROR] Status: ${edgeRes.status}`);
      console.error(`[${timestamp}] [SUPABASE OAUTH ERROR] Response:`, tokenData.error || edgeRes.statusText);
      throw new Error(
        `Token exchange failed: ${tokenData.error || edgeRes.statusText}`
      );
    }

    if (!tokenData.id_token) {
      console.error(`[${timestamp}] [SUPABASE OAUTH ERROR] No id_token in token response`);
      console.error(`[${timestamp}] [SUPABASE OAUTH ERROR] Token fields present:`, Object.keys(tokenData).join(', '));
      throw new Error('No id_token in token response');
    }

    // Step 2: Sign in to Supabase using the Google ID token
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: tokenData.id_token,
    });

    if (error) {
      console.error(`[${timestamp}] [SUPABASE OAUTH ERROR] Supabase sign-in failed`);
      console.error(`[${timestamp}] [SUPABASE OAUTH ERROR] Error message:`, error.message);
      throw new Error(`Supabase sign-in failed: ${error.message}`);
    }

    if (!data.session) {
      console.error(`[${timestamp}] [SUPABASE OAUTH ERROR] No session returned from Supabase sign-in`);
      throw new Error('No session returned from Supabase sign-in');
    }

    return {
      data: {
        session: data.session,
        user: data.user,
      },
      error: null,
    };
  } catch (error) {
    const errorTimestamp = new Date().toISOString();
    console.error(`[${errorTimestamp}] [SUPABASE OAUTH ERROR] Error exchanging code for Supabase session`);
    console.error(`[${errorTimestamp}] [SUPABASE OAUTH ERROR] Error:`, error instanceof Error ? error.message : String(error));
    throw error;
  }
}
