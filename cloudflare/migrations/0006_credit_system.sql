--- Migration number: 0006
--- Credit system: balances, transactions, verification queue

CREATE TABLE IF NOT EXISTS enterprise_credits (
  id              TEXT PRIMARY KEY,
  enterprise_id   TEXT NOT NULL UNIQUE,
  balance         INTEGER DEFAULT 0,
  total_burned    INTEGER DEFAULT 0,
  total_topped_up INTEGER DEFAULT 0,
  updated_at      TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (enterprise_id) REFERENCES enterprise_profiles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_credits_enterprise ON enterprise_credits(enterprise_id);

CREATE TABLE IF NOT EXISTS credit_transactions (
  id              TEXT PRIMARY KEY,
  enterprise_id   TEXT NOT NULL,
  type            TEXT NOT NULL,
  amount          INTEGER NOT NULL,
  balance_after   INTEGER NOT NULL,
  description     TEXT,
  verification_id TEXT,
  created_at      TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (enterprise_id) REFERENCES enterprise_profiles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_credit_tx_enterprise ON credit_transactions(enterprise_id);
CREATE INDEX IF NOT EXISTS idx_credit_tx_type ON credit_transactions(type);
CREATE INDEX IF NOT EXISTS idx_credit_tx_created ON credit_transactions(created_at);

CREATE TABLE IF NOT EXISTS verification_submissions (
  id              TEXT PRIMARY KEY,
  enterprise_id   TEXT NOT NULL,
  pilot_email     TEXT,
  pilot_name      TEXT,
  document_type   TEXT NOT NULL,
  document_url    TEXT,
  document_hash   TEXT,
  status          TEXT DEFAULT 'pending',
  credits_burned  INTEGER DEFAULT 0,
  reviewer_notes  TEXT,
  reviewed_at     TEXT,
  expires_at      TEXT,
  is_permanent    INTEGER DEFAULT 0,
  metadata        TEXT,
  created_at      TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (enterprise_id) REFERENCES enterprise_profiles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_verification_enterprise ON verification_submissions(enterprise_id);
CREATE INDEX IF NOT EXISTS idx_verification_status ON verification_submissions(status);
CREATE INDEX IF NOT EXISTS idx_verification_expires ON verification_submissions(expires_at);
