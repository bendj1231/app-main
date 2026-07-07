-- Migration: Recognition+ Referral Codes
-- Database: recognition-plus-trace (DB_TRACE)
-- Purpose: Store pilot referral codes separately from the public profiles database

CREATE TABLE IF NOT EXISTS recognition_plus_referrals (
    id TEXT PRIMARY KEY,
    profile_id TEXT NOT NULL,
    auth0_sub TEXT,
    referral_code TEXT NOT NULL UNIQUE,
    display_name TEXT,
    email TEXT,
    is_active INTEGER DEFAULT 1,
    commission_rate INTEGER DEFAULT 20,
    total_referrals INTEGER DEFAULT 0,
    total_conversions INTEGER DEFAULT 0,
    total_payouts REAL DEFAULT 0,
    pending_payouts REAL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rp_referrals_profile_id ON recognition_plus_referrals(profile_id);
CREATE INDEX IF NOT EXISTS idx_rp_referrals_auth0_sub ON recognition_plus_referrals(auth0_sub);
CREATE INDEX IF NOT EXISTS idx_rp_referrals_code ON recognition_plus_referrals(referral_code);
