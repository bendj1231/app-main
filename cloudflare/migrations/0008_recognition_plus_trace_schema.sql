-- Migration: Recognition+ Trace Data Schema
-- Database: recognition-plus-trace
-- Purpose: Separate sensitive aviation trace data from ordinary pilot profiles
-- Tables: credentials, licenses, verification, logbook, flight hours

-- Pilot Credentials (licenses, type ratings, certificates)
CREATE TABLE IF NOT EXISTS pilot_credentials (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    credential_type TEXT NOT NULL,
    issuer TEXT NOT NULL,
    credential_data TEXT,
    walt_id TEXT,
    expires_at TEXT,
    status TEXT DEFAULT 'active',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_credentials_user_id ON pilot_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_credentials_type ON pilot_credentials(credential_type);

-- Pilot Licensure & Experience (license numbers, medical certs, ratings)
CREATE TABLE IF NOT EXISTS pilot_licensure_experience (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    license_number TEXT NOT NULL,
    license_type TEXT,
    issue_date TEXT,
    expiry_date TEXT,
    issuing_authority TEXT NOT NULL,
    ratings TEXT,
    limitations TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_ple_user_id ON pilot_licensure_experience(user_id);
CREATE INDEX IF NOT EXISTS idx_ple_license_number ON pilot_licensure_experience(license_number);

-- Verification Submissions (background checks, document uploads)
CREATE TABLE IF NOT EXISTS verification_submissions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    auth0_sub TEXT NOT NULL,
    account_number TEXT NOT NULL,
    status TEXT DEFAULT 'submitted',
    submitted_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    document_keys TEXT DEFAULT '{}',
    consent_json_path TEXT,
    document_purge_after TEXT,
    result_data TEXT
);
CREATE INDEX IF NOT EXISTS idx_verifications_user_id ON verification_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_verifications_account_number ON verification_submissions(account_number);
CREATE INDEX IF NOT EXISTS idx_verifications_status ON verification_submissions(status);

-- Reverification Queue (annual recertification tracking)
CREATE TABLE IF NOT EXISTS reverification_queue (
    id TEXT PRIMARY KEY,
    pilot_id TEXT NOT NULL,
    credential_type TEXT NOT NULL,
    credential_id TEXT,
    current_expiry TEXT,
    status TEXT DEFAULT 'pending',
    cycle_year INTEGER NOT NULL,
    batch_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_revqueue_pilot_id ON reverification_queue(pilot_id);
CREATE INDEX IF NOT EXISTS idx_revqueue_status ON reverification_queue(status);
CREATE INDEX IF NOT EXISTS idx_revqueue_cycle ON reverification_queue(cycle_year);

-- Pilot Logbook Connections (third-party logbook provider links)
CREATE TABLE IF NOT EXISTS pilot_logbook_connections (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    access_token_encrypted TEXT,
    refresh_token_encrypted TEXT,
    last_sync_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_logbook_user_id ON pilot_logbook_connections(user_id);

-- Flight Hours (individual flight log entries)
CREATE TABLE IF NOT EXISTS flight_hours (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    total_hours REAL NOT NULL,
    log_date TEXT NOT NULL,
    aircraft_type TEXT,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_flight_hours_user_id ON flight_hours(user_id);
CREATE INDEX IF NOT EXISTS idx_flight_hours_date ON flight_hours(log_date);
