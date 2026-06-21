-- Profiles table (replaces Supabase profiles)
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  auth0_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  display_name TEXT,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'pilot',
  status TEXT DEFAULT 'active',
  avatar_url TEXT,
  profile_image_url TEXT,
  profile_image_public_id TEXT,
  phone TEXT,
  address TEXT,
  date_of_birth TEXT,
  nationality TEXT,
  current_flight_hours INTEGER DEFAULT 0,
  total_flight_hours INTEGER DEFAULT 0,
  mentorship_hours INTEGER DEFAULT 0,
  foundation_progress REAL DEFAULT 0,
  overall_recognition_score REAL DEFAULT 0,
  current_level TEXT DEFAULT 'Foundation',
  current_occupation TEXT,
  license_id TEXT,
  license_type TEXT,
  pilot_stage TEXT,
  license_issuing_authority TEXT,
  country_of_license TEXT,
  ratings TEXT,
  aircraft_types TEXT,
  aircraft_category TEXT,
  license_types TEXT,
  type_ratings TEXT,
  type_rating_input TEXT,
  pilot_id TEXT,
  enrolled_programs TEXT,
  app_access TEXT,
  is_enrolled_in_foundational INTEGER DEFAULT 0,
  is_visitor INTEGER DEFAULT 0,
  recognition_tier TEXT DEFAULT 'Bronze',
  subscription_tier TEXT DEFAULT 'free',
  elp_level TEXT,
  medical_class TEXT,
  employment_status TEXT,
  current_job TEXT,
  career_goal TEXT,
  other_licence TEXT,
  bio TEXT,
  linkedin_url TEXT,
  instagram_url TEXT,
  domicile TEXT,
  hours_whole TEXT,
  hours_minutes TEXT,
  origin_jurisdiction TEXT,
  terms_accepted_at TEXT,
  data_controller_agreement_accepted INTEGER DEFAULT 0,
  data_controller_agreement_accepted_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Mentorship badges
CREATE TABLE IF NOT EXISTS mentorship_badges (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id),
  badge_id TEXT NOT NULL,
  badge_name TEXT,
  badge_description TEXT,
  badge_icon TEXT,
  badge_tier TEXT DEFAULT 'bronze',
  earned_at TEXT,
  criteria_met TEXT,
  is_displayed INTEGER DEFAULT 1
);

-- Flight hours tracking
CREATE TABLE IF NOT EXISTS flight_hours (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES profiles(id),
  total_hours REAL DEFAULT 0,
  pic_hours REAL DEFAULT 0,
  instrument_hours REAL DEFAULT 0,
  night_hours REAL DEFAULT 0,
  cross_country_hours REAL DEFAULT 0,
  dual_hours REAL DEFAULT 0,
  last_updated TEXT
);

-- Verification receipts from external providers (Veremark, etc.)
-- Stores provider-processed status without exposing license numbers
CREATE TABLE IF NOT EXISTS verification_receipts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id),
  provider TEXT NOT NULL,
  credential_type TEXT NOT NULL,
  status TEXT NOT NULL,
  expires_at TEXT,
  near_expiry INTEGER DEFAULT 0,
  verified_at TEXT,
  flags TEXT,
  raw_provider_response TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_verification_receipts_user ON verification_receipts(user_id);

-- Cache table for batched API responses
CREATE TABLE IF NOT EXISTS _cache (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_cache_expires ON _cache(expires_at);

-- Index for auth0 lookups
CREATE INDEX IF NOT EXISTS idx_profiles_auth0_id ON profiles(auth0_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_mentorship_badges_user ON mentorship_badges(user_id);
