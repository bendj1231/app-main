-- Messages + per-pilot connections/mfa for pilotrecognition-profiles DB

-- ============================================================
-- MESSAGES (admin <> pilot communication)
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id              TEXT PRIMARY KEY,
  sender_id       TEXT NOT NULL,                        -- auth0_id
  sender_type     TEXT DEFAULT 'admin',                -- 'admin', 'pilot', 'system'
  recipient_id    TEXT NOT NULL,                        -- auth0_id or 'all'
  recipient_type  TEXT DEFAULT 'pilot',              -- 'pilot', 'admin', 'all'
  subject         TEXT,
  body            TEXT NOT NULL,
  is_read         INTEGER DEFAULT 0,
  read_at         TEXT,
  thread_id       TEXT,                                -- for threaded conversations
  priority        TEXT DEFAULT 'normal',              -- 'low', 'normal', 'high', 'urgent'
  category        TEXT DEFAULT 'general',             -- 'general', 'support', 'verification', 'billing'
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);

-- ============================================================
-- PILOT PLATFORM CONNECTIONS (logbook providers)
-- ============================================================
CREATE TABLE IF NOT EXISTS pilot_platform_connections (
  id                  TEXT PRIMARY KEY,
  pilot_id            TEXT NOT NULL,
  provider_name       TEXT NOT NULL,
  provider_user_id    TEXT,
  connection_status   TEXT DEFAULT 'pending',
  last_sync_at        TEXT,
  total_imported_hours REAL DEFAULT 0,
  sync_error          TEXT,
  created_at          TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_platform_connections_pilot ON pilot_platform_connections(pilot_id);
CREATE INDEX IF NOT EXISTS idx_platform_connections_status ON pilot_platform_connections(connection_status);

-- ============================================================
-- MFA SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS mfa_settings (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL UNIQUE,
  mfa_required    INTEGER DEFAULT 0,
  mfa_enabled     INTEGER DEFAULT 0,
  mfa_method      TEXT DEFAULT 'totp',
  backup_codes_hash TEXT,
  last_verified_at TEXT,
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_mfa_required ON mfa_settings(mfa_required);
