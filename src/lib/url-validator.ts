/**
 * URL Validation Utility
 * Prevents open redirect vulnerabilities by validating redirect URLs
 */

/**
 * Allowed domains for external redirects (if needed in future)
 * Currently only allowing relative/internal URLs for security
 */
const ALLOWED_DOMAINS = [
  window.location.hostname,
  // Add other trusted domains here if needed
];

/**
 * Validates if a URL is safe for redirect
 * Only allows relative URLs starting with '/' or URLs to allowed domains
 * 
 * @param url - The URL to validate
 * @returns true if the URL is safe, false otherwise
 */
export function isValidRedirectUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Allow relative URLs starting with '/'
  if (url.startsWith('/')) {
    // Prevent protocol-relative URLs like //evil.com
    if (url.startsWith('//')) {
      return false;
    }
    
    // Prevent javascript: and data: protocols
    if (url.toLowerCase().startsWith('javascript:') || 
        url.toLowerCase().startsWith('data:') ||
        url.toLowerCase().startsWith('vbscript:')) {
      return false;
    }
    
    return true;
  }

  try {
    const parsedUrl = new URL(url);
    
    // Check if the hostname is in the allowed list
    if (ALLOWED_DOMAINS.includes(parsedUrl.hostname)) {
      return true;
    }
    
    // Reject all other domains
    return false;
  } catch {
    // Invalid URL
    return false;
  }
}

/**
 * Safely redirects to a URL after validation
 * If the URL is invalid, redirects to a default fallback
 * 
 * @param url - The URL to redirect to
 * @param fallback - The fallback URL if validation fails (default: '/')
 */
export function safeRedirect(url: string, fallback: string = '/'): void {
  if (isValidRedirectUrl(url)) {
    window.location.href = url;
  } else {
    console.warn('Invalid redirect URL detected:', url);
    window.location.href = fallback;
  }
}

/**
 * Creates a safe navigation callback for use in components
 * 
 * @param fallback - The fallback URL if validation fails (default: '/')
 * @returns A function that safely redirects
 */
export function createSafeNavigator(fallback: string = '/'): (page: string) => void {
  return (page: string) => safeRedirect(page, fallback);
}
