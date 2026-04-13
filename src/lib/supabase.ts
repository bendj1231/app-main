import { createClient } from '@supabase/supabase-js';

// WingMentor Supabase configuration
const supabaseUrl = 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuaGhlcmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwODU4NzEsImV4cCI6MjA1NzY2MTg3MX0.RLJktszUsmFmDTUF1Qq0OyFLkrDiFJsB7RV-DaOJ04Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
