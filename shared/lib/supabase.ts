import { createClient } from '@supabase/supabase-js';

// Shared Supabase client configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in environment variables');
}

// Create a single shared Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
