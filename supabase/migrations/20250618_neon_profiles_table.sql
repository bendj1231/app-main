-- Neon PostgreSQL: Create profiles table (primary data store)
-- This moves the profiles workload OFF Supabase to Neon

CREATE SCHEMA IF NOT EXISTS pilotrecognition;

CREATE TABLE IF NOT EXISTS pilotrecognition.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth0_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  total_flight_hours INTEGER DEFAULT 0,
  account_tier TEXT DEFAULT 'free',
  origin_jurisdiction VARCHAR(10) NOT NULL DEFAULT 'UNKNOWN',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_auth0_id ON pilotrecognition.profiles(auth0_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON pilotrecognition.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_account_tier ON pilotrecognition.profiles(account_tier);

-- Row Level Security equivalent (Neon doesn't have RLS, use application-level checks)
-- Application enforces: pilots can only read/write their own profile via auth0_id

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION pilotrecognition.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON pilotrecognition.profiles
  FOR EACH ROW
  EXECUTE FUNCTION pilotrecognition.update_updated_at_column();

-- Seed: Migrate existing Supabase profiles (run after data migration)
-- INSERT INTO pilotrecognition.profiles (id, auth0_id, email, display_name, avatar_url, total_flight_hours, account_tier, created_at)
-- SELECT id, auth0_id, email, display_name, avatar_url, total_flight_hours, account_tier, created_at
-- FROM supabase_profiles_migration_view;

COMMENT ON TABLE pilotrecognition.profiles IS 'Primary pilot profiles — moved from Supabase to Neon for scale';
