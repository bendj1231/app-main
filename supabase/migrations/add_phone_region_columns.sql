-- Add phone_number and region columns to profiles table
-- Run this in Supabase SQL Editor

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS region TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.phone_number IS 'User phone number for contact';
COMMENT ON COLUMN public.profiles.region IS 'Account region: APAC, EMEA, Americas, or Global';
