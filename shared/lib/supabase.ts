import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Secure storage adapter for Supabase auth.
 * Uses sessionStorage instead of localStorage to reduce XSS attack surface.
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
      document.cookie = `${key}=${encodeURIComponent(value)}; path=/; SameSite=Strict; Secure`;
    } catch {
      // Ignore
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

let _client: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (_client) return _client;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl && typeof window !== 'undefined') {
    console.warn(
      '⚠️ VITE_SUPABASE_URL not set — Supabase client not initialized (migration to Worker API in progress)'
    );
  }

  // Lazy init: only create client when URL is present, otherwise a no-op stub
  if (supabaseUrl) {
    _client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: secureStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } else {
    _client = createNoOpClient();
  }
  return _client;
}

/** No-op stub so imports don't crash when Supabase env vars are missing */
/* eslint-disable @typescript-eslint/no-explicit-any */
function createNoOpClient(): SupabaseClient {
  const noop = () => Promise.resolve({ data: null, error: new Error('Supabase not configured') });
  const noopChain = new Proxy({} as any, {
    get() {
      return noopChain;
    },
    apply() {
      return noopChain;
    },
  });
  return {
    from: () => noopChain,
    auth: {
      getSession: noop,
      signOut: noop,
      getUser: noop,
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    } as any,
    functions: { invoke: noop } as any,
    storage: { from: () => noopChain } as any,
    channel: () => noopChain as any,
    removeChannel: () => noopChain as any,
    removeAllChannels: () => noopChain as any,
    realtime: {} as any,
    supabaseUrl: '',
    supabaseKey: '',
    headers: () => ({}),
  } as unknown as SupabaseClient;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Lazy proxy: initializes real client on first property access */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop: string | symbol) {
    const client = getSupabaseClient();
    return (client as any)[prop];
  },
});
/* eslint-enable @typescript-eslint/no-explicit-any */
