-- Create enterprise_profiles table for admin dashboard
CREATE TABLE IF NOT EXISTS public.enterprise_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  industry TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  country TEXT,
  employee_count INTEGER,
  subscription_status TEXT DEFAULT 'trial', -- 'trial', 'active', 'cancelled', 'expired'
  subscription_tier TEXT DEFAULT 'basic', -- 'basic', 'pro', 'enterprise'
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_enterprise_profiles_status ON public.enterprise_profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_enterprise_profiles_created_at ON public.enterprise_profiles(created_at DESC);

-- Enable RLS
ALTER TABLE public.enterprise_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can read all enterprise profiles
CREATE POLICY "Admins can read enterprise profiles"
  ON public.enterprise_profiles FOR SELECT
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('super_admin', 'admin'));

-- Policy: Admins can insert enterprise profiles
CREATE POLICY "Admins can insert enterprise profiles"
  ON public.enterprise_profiles FOR INSERT
  WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('super_admin', 'admin'));

-- Policy: Admins can update enterprise profiles
CREATE POLICY "Admins can update enterprise profiles"
  ON public.enterprise_profiles FOR UPDATE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('super_admin', 'admin'));

COMMENT ON TABLE public.enterprise_profiles IS 'Enterprise account profiles for airline partners and corporate customers';
