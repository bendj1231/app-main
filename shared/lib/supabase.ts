// STUB — Supabase client removed. Migrate to Worker API.
// This file exists to prevent build errors while other files are being migrated.
// TODO: Remove after all imports are replaced with Worker calls.
const noopChannel = {
  on: () => noopChannel,
  subscribe: () => ({ unsubscribe: () => {} }),
};
const noopAuth = {
  getSession: async () => ({ data: { session: null }, error: null }),
  getUser: async () => ({ data: { user: null }, error: null }),
  resend: async () => ({ data: {}, error: null }),
  onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  signInWithOAuth: async () => ({ data: {}, error: null }),
  signInWithPassword: async () => ({ data: {}, error: null }),
  signUp: async () => ({ data: {}, error: null }),
  signOut: async () => ({ error: null }),
};
export const supabase = {
  auth: noopAuth,
  channel: () => noopChannel,
  removeChannel: () => {},
  removeAllChannels: () => {},
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: [], error: null }),
    update: () => ({ data: [], error: null }),
    upsert: () => ({ data: [], error: null }),
    delete: () => ({ data: [], error: null }),
    eq: () => ({ data: [], error: null }),
    single: () => ({ data: null, error: null }),
  }),
} as any;
