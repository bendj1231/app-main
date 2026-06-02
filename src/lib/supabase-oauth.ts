import { supabase } from './supabase';
import { GOOGLE_OAUTH_CONFIG } from './google-oauth';

// Google OAuth client secret (should be moved to environment variables in production)
const GOOGLE_CLIENT_SECRET = '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';

/**
 * Exchanges a Google authorization code for a Supabase session
 * @param code - The Google OAuth authorization code
 * @param redirectUri - The redirect URI used in the OAuth flow
 * @returns The Supabase session data
 * @throws Error if the token exchange or Supabase sign-in fails
 */
export async function exchangeCodeForSupabaseSession(
  code: string,
  redirectUri: string
): Promise<{
  data: { session: any; user: any };
  error: null;
}> {
  const timestamp = new Date().toISOString();
// [AUDIT] Removed console.log // line 22
// [AUDIT] Removed console.log // line 23
// [AUDIT] Removed console.log // line 24
// [AUDIT] Removed console.log // line 25
// [AUDIT] Removed console.log // line 26
// [AUDIT] Removed console.log // line 27

  try {
    // Step 1: Exchange authorization code for Google ID token
// [AUDIT] Removed console.log // line 31
// [AUDIT] Removed console.log // line 32

    const tokenResponse = await fetch(GOOGLE_OAUTH_CONFIG.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_OAUTH_CONFIG.clientId,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

// [AUDIT] Removed console.log // line 48
// [AUDIT] Removed console.log // line 49

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error(`[${timestamp}] [SUPABASE OAUTH ERROR] Token exchange failed`);
      console.error(`[${timestamp}] [SUPABASE OAUTH ERROR] Status: ${tokenResponse.status} ${tokenResponse.statusText}`);
      console.error(`[${timestamp}] [SUPABASE OAUTH ERROR] Response body:`, errorText);
      throw new Error(
        `Failed to exchange authorization code: ${tokenResponse.status} ${tokenResponse.statusText}. ${errorText}`
      );
    }

    const tokenData = await tokenResponse.json();
// [AUDIT] Removed console.log // line 62
// [AUDIT] Removed console.log // line 63
// [AUDIT] Removed console.log // line 64
// [AUDIT] Removed console.log // line 65

    if (!tokenData.id_token) {
      console.error(`[${timestamp}] [SUPABASE OAUTH ERROR] No id_token in Google token response`);
      console.error(`[${timestamp}] [SUPABASE OAUTH ERROR] Full token data:`, JSON.stringify(tokenData, null, 2));
      throw new Error('No id_token in Google token response');
    }

// [AUDIT] Removed console.log // line 73
// [AUDIT] Removed console.log // line 74

    // Step 2: Sign in to Supabase using the Google ID token
// [AUDIT] Removed console.log // line 77
// [AUDIT] Removed console.log // line 78

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: tokenData.id_token,
    });

// [AUDIT] Removed console.log // line 85
// [AUDIT] Removed console.log // line 86
// [AUDIT] Removed console.log // line 87
// [AUDIT] Removed console.log // line 88
// [AUDIT] Removed console.log // line 89

    if (error) {
      console.error(`[${timestamp}] [SUPABASE OAUTH ERROR] Supabase sign-in failed`);
      console.error(`[${timestamp}] [SUPABASE OAUTH ERROR] Error message:`, error.message);
      console.error(`[${timestamp}] [SUPABASE OAUTH ERROR] Error details:`, JSON.stringify(error, null, 2));
      throw new Error(`Supabase sign-in failed: ${error.message}`);
    }

    if (!data.session) {
      console.error(`[${timestamp}] [SUPABASE OAUTH ERROR] No session returned from Supabase sign-in`);
      console.error(`[${timestamp}] [SUPABASE OAUTH ERROR] Data object:`, JSON.stringify(data, null, 2));
      throw new Error('No session returned from Supabase sign-in');
    }

// [AUDIT] Removed console.log // line 104
// [AUDIT] Removed console.log // line 105
// [AUDIT] Removed console.log // line 106
// [AUDIT] Removed console.log // line 107

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
    console.error(`[${errorTimestamp}] [SUPABASE OAUTH ERROR] Error:`, error);
    console.error(`[${errorTimestamp}] [SUPABASE OAUTH ERROR] Error name:`, error instanceof Error ? error.name : 'Unknown');
    console.error(`[${errorTimestamp}] [SUPABASE OAUTH ERROR] Error message:`, error instanceof Error ? error.message : String(error));
    console.error(`[${errorTimestamp}] [SUPABASE OAUTH ERROR] Error stack:`, error instanceof Error ? error.stack : 'No stack available');
    throw error;
  }
}
