export function getAuth0RedirectUri() {
  // Always use the current origin for the callback URL.
  // This ensures production (pilotrecognition.com, pilotterminal.com, etc.)
  // always redirects back to the correct domain, regardless of what
  // VITE_AUTH0_CALLBACK_URL is set to in .env.local (which may be localhost).
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback`;
  }

  // Server-side fallback (should never hit in browser)
  return 'https://pilotrecognition.com/auth/callback';
}
