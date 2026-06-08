export function getAuth0RedirectUri() {
  const rawCallbackUrl = import.meta.env.VITE_AUTH0_CALLBACK_URL as string | undefined;

  // During local development, always use the current origin for Auth0 callbacks.
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return `${window.location.origin}/callback`;
  }

  if (!rawCallbackUrl) {
    return `${window.location.origin}/callback`;
  }

  try {
    const url = new URL(rawCallbackUrl, window.location.origin);
    const callbackPath = `${url.pathname}${url.search}${url.hash}`;

    // Preserve current localhost origin so callback state is read from the same origin
    if (window.location.hostname === 'localhost' && url.hostname === 'localhost') {
      return `${window.location.origin}${callbackPath}`;
    }

    return url.toString();
  } catch {
    return `${window.location.origin}${rawCallbackUrl.startsWith('/') ? rawCallbackUrl : `/${rawCallbackUrl}`}`;
  }
}
