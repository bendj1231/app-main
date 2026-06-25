--- Migration number: 0005
--- Add flight_schools, referrals, payouts, notifications for ATO/enterprise portal

CREATE TABLE IF NOT EXISTS flight_schools (
  id              TEXT PRIMARY KEY,
  enterprise_id   TEXT NOT NULL,
  name            TEXT NOT NULL,
  referral_code   TEXT UNIQUE,
  commission_rate INTEGER DEFAULT 20,
  payout_method   TEXT,
  contact_email   TEXT,
  contact_phone   TEXT,
  country         TEXT,
  website         TEXT,
  is_active       INTEGER DEFAULT 1,
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (enterprise_id) REFERENCES enterprise_profiles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_flight_schools_enterprise ON flight_schools(enterprise_id);
CREATE INDEX IF NOT EXISTS idx_flight_schools_referral ON flight_schools(referral_code);

CREATE TABLE IF NOT EXISTS flight_school_referrals (
  id                TEXT PRIMARY KEY,
  flight_school_id  TEXT NOT NULL,
  pilot_email       TEXT,
  pilot_name        TEXT,
  referral_code     TEXT,
  referral_link     TEXT,
  commission_amount INTEGER DEFAULT 2000,
  status            TEXT DEFAULT 'pending',
  commission_status TEXT DEFAULT 'pending',
  created_at        TEXT DEFAULT (datetime('now')),
  updated_at        TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (flight_school_id) REFERENCES flight_schools(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_fs_referrals_school ON flight_school_referrals(flight_school_id);
CREATE INDEX IF NOT EXISTS idx_fs_referrals_status ON flight_school_referrals(status);

CREATE TABLE IF NOT EXISTS flight_school_payouts (
  id               TEXT PRIMARY KEY,
  flight_school_id TEXT NOT NULL,
  amount           INTEGER NOT NULL,
  status           TEXT DEFAULT 'pending',
  payout_method    TEXT,
  created_at       TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (flight_school_id) REFERENCES flight_schools(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_fs_payouts_school ON flight_school_payouts(flight_school_id);

CREATE TABLE IF NOT EXISTS flight_school_notifications (
  id               TEXT PRIMARY KEY,
  flight_school_id TEXT NOT NULL,
  title            TEXT NOT NULL,
  message          TEXT,
  read             INTEGER DEFAULT 0,
  created_at       TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (flight_school_id) REFERENCES flight_schools(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_fs_notifications_school ON flight_school_notifications(flight_school_id);
CREATE INDEX IF NOT EXISTS idx_fs_notifications_read ON flight_school_notifications(read);
