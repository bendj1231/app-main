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
  try {
    // Step 1: Exchange authorization code for Google ID token
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

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(
        `Failed to exchange authorization code: ${tokenResponse.status} ${tokenResponse.statusText}. ${errorText}`
      );
    }

    const tokenData = await tokenResponse.json();

    if (!tokenData.id_token) {
      throw new Error('No id_token in Google token response');
    }

    // Step 2: Sign in to Supabase using the Google ID token
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: tokenData.id_token,
    });

    if (error) {
      throw new Error(`Supabase sign-in failed: ${error.message}`);
    }

    if (!data.session) {
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
    console.error('Error exchanging code for Supabase session:', error);
    throw error;
  }
}
