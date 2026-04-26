import { createClient } from '@supabase/supabase-js';

// Edge-compatible Supabase client configuration
// This version does not use localStorage, making it compatible with Edge Functions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseAnonKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in environment variables');
}

// Create a Supabase client for Edge Functions without localStorage
export const supabaseEdge = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
