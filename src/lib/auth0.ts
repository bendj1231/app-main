export function getAuth0RedirectUri() {
  const rawCallbackUrl = (import.meta as any).env?.VITE_AUTH0_CALLBACK_URL as string | undefined;

  if (!rawCallbackUrl) {
    return `${window.location.origin}/callback`;
  }

  try {
    const url = new URL(rawCallbackUrl, window.location.origin);
    return url.toString();
  } catch {
    return `${window.location.origin}${rawCallbackUrl.startsWith('/') ? rawCallbackUrl : `/${rawCallbackUrl}`}`;
  }
}
