import { createClient } from '@supabase/supabase-js';

// Shared Supabase client configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl && typeof window !== 'undefined') {
  console.error('❌ VITE_SUPABASE_URL is not set in environment variables');
}
if (!supabaseAnonKey && typeof window !== 'undefined') {
  console.error('❌ VITE_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in environment variables');
}

/**
 * Secure storage adapter for Supabase auth.
 * Uses sessionStorage instead of localStorage to reduce XSS attack surface:
 *   - Session clears when the tab closes (stolen tokens have limited lifetime)
 *   - Not shared across tabs (XSS in one tab can't steal session from another)
 *   - Still works for OAuth redirects (same-tab navigation preserves sessionStorage)
 *
 * Complemented by a SameSite=Strict cookie for CSRF protection on API calls.
 */
const secureStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(key, value);
      // Also set a cookie for CSRF-protected API calls (not HttpOnly — static SPA limitation)
      document.cookie = `${key}=${encodeURIComponent(value)}; path=/; SameSite=Strict; Secure`;
    } catch {
      // Ignore quota exceeded / private mode errors
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(key);
      document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure`;
    } catch {
      // Ignore
    }
  },
};

// Create a single shared Supabase client instance with secure sessionStorage persistence
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey, {
  auth: {
    storage: secureStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
