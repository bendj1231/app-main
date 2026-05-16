import { createClient } from '@supabase/supabase-js';

// Shared Supabase client configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Debug logging for dev environment
if (typeof window !== 'undefined') {
  console.log('[Supabase Debug] URL:', supabaseUrl);
  console.log('[Supabase Debug] Key exists:', !!supabaseAnonKey);
  console.log('[Supabase Debug] import.meta.env.VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
}

if (!supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in environment variables');
}

// Create a single shared Supabase client instance with localStorage persistence
// localStorage persists across page reloads, maintaining session after OAuth redirect
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
