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
  license_number TEXT,
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
  account_number TEXT UNIQUE, -- Recognition+ unique account number
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
  logbook_sync_valid INTEGER DEFAULT 0,
  terms_accepted_at TEXT,
  data_controller_agreement_accepted INTEGER DEFAULT 0,
  data_controller_agreement_accepted_at TEXT,
  favorite_airports TEXT,
  favorite_aircraft_2 TEXT,
  favorite_aircraft_3 TEXT,
  other_industry_experience TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

--- Licensure experience table (JSON blob storage for advanced profile fields)
CREATE TABLE IF NOT EXISTS pilot_licensure_experience (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  license_data TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pilot_licensure_user ON pilot_licensure_experience(user_id);

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

-- APC Verification Submissions (manual form + document metadata)
-- Stores all submitted form data, consent forms, document keys, and R2 paths
CREATE TABLE IF NOT EXISTS verification_submissions (
  id TEXT PRIMARY KEY,
  auth0_sub TEXT NOT NULL,
  account_number TEXT,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  nationality TEXT,
  license_number TEXT,
  license_type TEXT,
  license_expiry TEXT,
  medical_class TEXT,
  medical_expiry TEXT,
  total_hours REAL DEFAULT 0,
  pic_hours REAL DEFAULT 0,
  dual_hours REAL DEFAULT 0,
  dual_xc_hours REAL DEFAULT 0,
  night_hours REAL DEFAULT 0,
  instrument_sim_hours REAL DEFAULT 0,
  instrument_actual_hours REAL DEFAULT 0,
  multi_engine_sim_hours REAL DEFAULT 0,
  multi_engine_actual_hours REAL DEFAULT 0,
  cross_country_hours REAL DEFAULT 0,
  rating_sets TEXT, -- JSON array of {index, trainingCenter, country, hasCertFile, hasLicFile}
  ato_name TEXT,
  ato_location TEXT,
  ato_data_needed TEXT,
  document_keys TEXT, -- JSON mapping of docType -> R2 key
  consent_json_path TEXT, -- R2 path to the consent form JSON
  consent_pdf_path TEXT, -- R2 path to the consent form PDF (if generated)
  logbook_path TEXT, -- R2 path to logbook CSV
  status TEXT DEFAULT 'submitted', -- submitted, processing, verified, rejected
  document_purge_after TEXT, -- ISO timestamp when R2 documents should be deleted (30 days post-verification)
  submitted_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_verification_submissions_auth0 ON verification_submissions(auth0_sub);
CREATE INDEX IF NOT EXISTS idx_verification_submissions_status ON verification_submissions(status);
CREATE INDEX IF NOT EXISTS idx_verification_submissions_account_number ON verification_submissions(account_number);

-- Employee Access Audit Log (who searched what account number, when)
CREATE TABLE IF NOT EXISTS verification_employee_access_log (
  id TEXT PRIMARY KEY,
  employee_auth0_sub TEXT NOT NULL,
  employee_email TEXT,
  action TEXT NOT NULL, -- 'view_submission', 'download_document', 'update_status'
  target_account_number TEXT NOT NULL,
  target_submission_id TEXT,
  metadata TEXT, -- JSON extras
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_access_log_employee ON verification_employee_access_log(employee_auth0_sub);
CREATE INDEX IF NOT EXISTS idx_access_log_target ON verification_employee_access_log(target_account_number);
CREATE INDEX IF NOT EXISTS idx_access_log_created ON verification_employee_access_log(created_at);

-- Pilot Logbook CSV uploads (per-user CSV file storage)
CREATE TABLE IF NOT EXISTS pilot_logbook_csv (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id),
  filename TEXT,
  csv_data TEXT NOT NULL, -- raw CSV content
  row_count INTEGER DEFAULT 0,
  uploaded_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_logbook_csv_user ON pilot_logbook_csv(user_id);

-- Pilot notifications (in-app messages)
CREATE TABLE IF NOT EXISTS pilot_notifications (
  id TEXT PRIMARY KEY,
  pilot_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'default',
  title TEXT NOT NULL,
  message TEXT,
  data TEXT,
  is_read INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_pilot_notifications_pilot ON pilot_notifications(pilot_id);
CREATE INDEX IF NOT EXISTS idx_pilot_notifications_unread ON pilot_notifications(pilot_id, is_read);

-- Index for auth0 lookups
CREATE INDEX IF NOT EXISTS idx_profiles_auth0_id ON profiles(auth0_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_account_number ON profiles(account_number);
CREATE INDEX IF NOT EXISTS idx_mentorship_badges_user ON mentorship_badges(user_id);
