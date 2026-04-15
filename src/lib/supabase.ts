import { createClient } from '@supabase/supabase-js';

// WingMentor Supabase configuration
const supabaseUrl = 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuaGhlcmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MzQxOTEsImV4cCI6MjA4OTExMDE5MX0.m49ula5RMn4uEtRTk6l9q_6VElyPrY1YPMj-gtUYRsY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
