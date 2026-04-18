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

  return `${authorizationEndpoint}?${authParams.toString()}`;
}

/**
 * Extracts the authorization code from the callback URL
 * @param url - The callback URL from Google OAuth
 * @returns Object containing the code or error
 */
export function extractCodeFromUrl(url: string): GoogleAuthCodeResult {
  try {
    const urlObj = new URL(url);
    const code = urlObj.searchParams.get('code');
    const error = urlObj.searchParams.get('error');

    return {
      code,
      error,
    };
  } catch (e) {
    return {
      code: null,
      error: 'Invalid URL format',
    };
  }
}
