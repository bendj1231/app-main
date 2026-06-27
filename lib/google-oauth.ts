// Google OAuth Configuration
// Client ID is public by design (embedded in OAuth URL), but env-driven for rotation.
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

export const GOOGLE_OAUTH_CONFIG = {
  clientId,
  scopes: ['openid', 'email', 'profile'],
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
} as const;

// TypeScript types
export interface GoogleAuthUrlParams {
  redirectUri: string;
  state?: string;
  loginHint?: string;
  prompt?: 'none' | 'consent' | 'select_account';
}

export interface GoogleAuthCodeResult {
  code: string | null;
  error: string | null;
}

/**
 * Generates the Google OAuth authorization URL
 * @param params - Parameters for the authorization URL
 * @returns The complete authorization URL
 */
export function generateGoogleAuthUrl(params: GoogleAuthUrlParams): string {
  void new Date().toISOString(); // timestamp for potential logging

  const { clientId, authorizationEndpoint, scopes } = GOOGLE_OAUTH_CONFIG;

  const authParams = new URLSearchParams({
    client_id: clientId,
    redirect_uri: params.redirectUri,
    response_type: 'code',
    scope: scopes.join(' '),
  });


  // Optional parameters
  if (params.state) {
    authParams.append('state', params.state);
  }

  if (params.loginHint) {
    authParams.append('login_hint', params.loginHint);
  }

  if (params.prompt) {
    authParams.append('prompt', params.prompt);
  }

  const finalUrl = `${authorizationEndpoint}?${authParams.toString()}`;

  return finalUrl;
}

/**
 * Extracts the authorization code from the callback URL
 * @param url - The callback URL from Google OAuth
 * @returns Object containing the code or error
 */
export function extractCodeFromUrl(url: string): GoogleAuthCodeResult {
  const timestamp = new Date().toISOString();

  try {
    const urlObj = new URL(url);
    const code = urlObj.searchParams.get('code');
    const error = urlObj.searchParams.get('error');

    const result = {
      code,
      error,
    };

    return result;
  } catch (e) {
    console.error(`[${timestamp}] [GOOGLE OAUTH ERROR] Failed to parse URL`);
    console.error(`[${timestamp}] [GOOGLE OAUTH ERROR] Error:`, e);
    console.error(`[${timestamp}] [GOOGLE OAUTH ERROR] Error message:`, e instanceof Error ? e.message : String(e));
    return {
      code: null,
      error: 'Invalid URL format',
    };
  }
}
