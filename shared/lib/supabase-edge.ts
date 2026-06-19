import { createClient } from '@supabase/supabase-js';

// Edge-compatible Supabase client configuration
// This version does not use localStorage, making it compatible with Edge Functions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ NEXT_PUBLIC_SUPABASE_URL not set — Edge Supabase client not initialized (migration to Worker API in progress)');
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function createNoOpClient(): any {
  const noop = () => Promise.resolve({ data: null, error: new Error('Supabase not configured') });
  const noopChain: any = new Proxy({} as any, {
    get() { return noopChain; },
    apply() { return noopChain; },
  });
  return {
    from: () => noopChain,
    auth: { getSession: noop, signOut: noop, getUser: noop, onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) },
    functions: { invoke: noop },
    storage: { from: () => noopChain },
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// Create a Supabase client for Edge Functions without localStorage
export const supabaseEdge = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : createNoOpClient();
