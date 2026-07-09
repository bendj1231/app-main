-- Migration: Create dashboard tables missing from the production D1 database
-- These tables are referenced by getDashboardData in worker/src/index.ts

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

-- Licensure experience table (JSON blob storage for advanced profile fields)
CREATE TABLE IF NOT EXISTS pilot_licensure_experience (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  license_data TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_pilot_licensure_user ON pilot_licensure_experience(user_id);

-- Verification receipts from external providers (Veremark, etc.)
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

-- Pilot credentials (certificates, licenses, etc.)
CREATE TABLE IF NOT EXISTS pilot_credentials (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id),
  credential_type TEXT NOT NULL,
  issuer TEXT,
  issued_at TEXT,
  expires_at TEXT,
  status TEXT DEFAULT 'active',
  verification_url TEXT,
  document_url TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_pilot_credentials_user ON pilot_credentials(user_id);

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

-- Pilot logbook CSV uploads
CREATE TABLE IF NOT EXISTS pilot_logbook_csv (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id),
  filename TEXT,
  csv_data TEXT NOT NULL,
  row_count INTEGER DEFAULT 0,
  uploaded_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_logbook_csv_user ON pilot_logbook_csv(user_id);

-- APC Verification Submissions
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
  rating_sets TEXT,
  ato_name TEXT,
  ato_location TEXT,
  ato_data_needed TEXT,
  document_keys TEXT,
  consent_json_path TEXT,
  consent_pdf_path TEXT,
  logbook_path TEXT,
  status TEXT DEFAULT 'submitted',
  document_purge_after TEXT,
  submitted_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_verification_submissions_auth0 ON verification_submissions(auth0_sub);
CREATE INDEX IF NOT EXISTS idx_verification_submissions_status ON verification_submissions(status);
CREATE INDEX IF NOT EXISTS idx_verification_submissions_account_number ON verification_submissions(account_number);

-- Employee Access Audit Log
CREATE TABLE IF NOT EXISTS verification_employee_access_log (
  id TEXT PRIMARY KEY,
  employee_auth0_sub TEXT NOT NULL,
  employee_email TEXT,
  action TEXT NOT NULL,
  target_account_number TEXT NOT NULL,
  target_submission_id TEXT,
  metadata TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_access_log_employee ON verification_employee_access_log(employee_auth0_sub);
CREATE INDEX IF NOT EXISTS idx_access_log_target ON verification_employee_access_log(target_account_number);
CREATE INDEX IF NOT EXISTS idx_access_log_created ON verification_employee_access_log(created_at);
