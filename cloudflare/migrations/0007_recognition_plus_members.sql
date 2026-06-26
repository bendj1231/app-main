-- Migration: Recognition+ Membership Tables
-- Database: pilotrecognition-d1 (Platform DB)
-- Purpose: Separate commercial membership data from pilot identity data
-- Regulatory benefit: Clear audit trail for government data requests

CREATE TABLE IF NOT EXISTS recognition_plus_members (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    auth0_sub TEXT NOT NULL UNIQUE,
    tier TEXT NOT NULL DEFAULT 'basic',
    status TEXT NOT NULL DEFAULT 'inactive',
    payment_status TEXT DEFAULT 'pending',
    veremark_checks_total INTEGER DEFAULT 0,
    veremark_checks_used INTEGER DEFAULT 0,
    started_at TEXT,
    expires_at TEXT,
    last_payment_at TEXT,
    cancellation_requested_at TEXT,
    metadata TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rp_members_user_id ON recognition_plus_members(user_id);
CREATE INDEX IF NOT EXISTS idx_rp_members_auth0_sub ON recognition_plus_members(auth0_sub);
CREATE INDEX IF NOT EXISTS idx_rp_members_status ON recognition_plus_members(status);

CREATE TABLE IF NOT EXISTS recognition_plus_feature_usage (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL,
    feature_name TEXT NOT NULL,
    usage_count INTEGER DEFAULT 1,
    period_start TEXT,
    period_end TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES recognition_plus_members(id)
);

CREATE INDEX IF NOT EXISTS idx_rp_usage_member_id ON recognition_plus_feature_usage(member_id);
CREATE INDEX IF NOT EXISTS idx_rp_usage_feature ON recognition_plus_feature_usage(member_id, feature_name);
