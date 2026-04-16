import { createClient } from '@supabase/supabase-js';

// WingMentor Supabase configuration from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseAnonKey) {
  console.error('❌ SUPABASE_ANON_KEY is not set');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
