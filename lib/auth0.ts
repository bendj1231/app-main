export function getAuth0RedirectUri() {
  // Always use the current origin for the callback URL.
  // This ensures production (pilotrecognition.com, pilotterminal.com, etc.)
  // always redirects back to the correct domain, regardless of what
  // VITE_AUTH0_CALLBACK_URL is set to in .env.local (which may be localhost).
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    // Auth0 dashboard allows /callback for localhost, /auth/callback for production
    const path = origin.includes('localhost') ? '/callback' : '/auth/callback';
    return `${origin}${path}`;
  }

  // Server-side fallback (should never hit in browser)
  return 'https://pilotrecognition.com/auth/callback';
}
