/**
 * OAuth Configuration
 * Manages allowed redirect URLs for OAuth providers
 */

/**
 * Allowed OAuth redirect URLs
 * Prevents open redirect vulnerabilities during OAuth flows
 */
export const ALLOWED_OAUTH_REDIRECTS = [
  // Production domain
  typeof window !== 'undefined' ? `${window.location.origin}/` : 'http://localhost:3000/',
  typeof window !== 'undefined' ? `${window.location.origin}/flight-deck-login` : 'http://localhost:3000/flight-deck-login',
  typeof window !== 'undefined' ? `${window.location.origin}/become-member` : 'http://localhost:3000/become-member',

  // Local development
  'http://localhost:3000/',
  'http://localhost:5173/',
  'http://localhost:3000/flight-deck-login',
  'http://localhost:5173/flight-deck-login',
  'http://localhost:3000/become-member',
  'http://localhost:5173/become-member',

  // Add any other allowed domains here
  // 'https://staging.yourdomain.com/',
  // 'https://yourdomain.com/',
];

/**
 * Validates if a redirect URL is allowed for OAuth
 *
 * @param redirectUrl - The redirect URL to validate
 * @returns true if the URL is allowed, false otherwise
 */
export function isValidOAuthRedirect(redirectUrl: string): boolean {
  if (!redirectUrl || typeof redirectUrl !== 'string') {
    return false;
  }

  // Check if the redirect URL matches any allowed URL
  return ALLOWED_OAUTH_REDIRECTS.some((allowedUrl) => {
    // Exact match
    if (redirectUrl === allowedUrl) {
      return true;
    }

    // Check if it starts with an allowed URL (for paths)
    if (redirectUrl.startsWith(allowedUrl)) {
      return true;
    }

    return false;
  });
}

/**
 * Gets the default OAuth redirect URL
 *
 * @returns The default redirect URL for the current environment
 */
export function getDefaultOAuthRedirect(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/`;
  }
  return 'http://localhost:3000/';
}
