// Google OAuth Configuration
export const GOOGLE_OAUTH_CONFIG = {
  clientId: '90918059889-jesc3p48sfo84nv8ef75v5iu8q8p1ne1.apps.googleusercontent.com',
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
  const timestamp = new Date().toISOString();
// [AUDIT] Removed console.log // line 29
// [AUDIT] Removed console.log // line 30
// [AUDIT] Removed console.log // line 31
// [AUDIT] Removed console.log // line 32
// [AUDIT] Removed console.log // line 33

  const { clientId, authorizationEndpoint, scopes } = GOOGLE_OAUTH_CONFIG;

  const authParams = new URLSearchParams({
    client_id: clientId,
    redirect_uri: params.redirectUri,
    response_type: 'code',
    scope: scopes.join(' '),
  });

// [AUDIT] Removed console.log // line 44

  // Optional parameters
  if (params.state) {
    authParams.append('state', params.state);
// [AUDIT] Removed console.log // line 49
  }

  if (params.loginHint) {
    authParams.append('login_hint', params.loginHint);
// [AUDIT] Removed console.log // line 54
  }

  if (params.prompt) {
    authParams.append('prompt', params.prompt);
// [AUDIT] Removed console.log // line 59
  }

  const finalUrl = `${authorizationEndpoint}?${authParams.toString()}`;
// [AUDIT] Removed console.log // line 63
// [AUDIT] Removed console.log // line 64

  return finalUrl;
}

/**
 * Extracts the authorization code from the callback URL
 * @param url - The callback URL from Google OAuth
 * @returns Object containing the code or error
 */
export function extractCodeFromUrl(url: string): GoogleAuthCodeResult {
  const timestamp = new Date().toISOString();
// [AUDIT] Removed console.log // line 76
// [AUDIT] Removed console.log // line 77
// [AUDIT] Removed console.log // line 78

  try {
    const urlObj = new URL(url);
    const code = urlObj.searchParams.get('code');
    const error = urlObj.searchParams.get('error');
    const state = urlObj.searchParams.get('state');

// [AUDIT] Removed console.log // line 86
// [AUDIT] Removed console.log // line 87
// [AUDIT] Removed console.log // line 88
// [AUDIT] Removed console.log // line 89
// [AUDIT] Removed console.log // line 90

    const result = {
      code,
      error,
    };

// [AUDIT] Removed console.log // line 97
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
