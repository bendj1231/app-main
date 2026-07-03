-- Admin & Audit Tables for pilotrecognition-d1 (DB_OPS binding)
-- These operational/audit tables are queried by the Infrastructure Dashboard and admin systems

-- ============================================================
-- AI USAGE LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_usage_log (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL,
  date            TEXT NOT NULL,
  request_type    TEXT DEFAULT 'chat',
  model           TEXT,
  tokens_used     INTEGER DEFAULT 0,
  status          TEXT DEFAULT 'success',
  created_at      TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_ai_usage_user ON ai_usage_log(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_date ON ai_usage_log(date);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created ON ai_usage_log(created_at);

-- ============================================================
-- USER ACTIVITY LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS user_activity_log (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL,
  activity_type   TEXT NOT NULL,
  entity_type     TEXT,
  entity_id       TEXT,
  metadata        TEXT,
  created_at      TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_user_activity_user ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON user_activity_log(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_created ON user_activity_log(created_at);

-- ============================================================
-- PAYOUTS (referral/admin payouts)
-- ============================================================
CREATE TABLE IF NOT EXISTS payouts (
  id              TEXT PRIMARY KEY,
  recipient_id    TEXT NOT NULL,
  recipient_type  TEXT DEFAULT 'pilot',
  amount_cents    INTEGER NOT NULL,
  currency        TEXT DEFAULT 'USD',
  payout_method   TEXT,
  status          TEXT DEFAULT 'pending',
  reference       TEXT,
  completed_at    TEXT,
  created_at      TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);
CREATE INDEX IF NOT EXISTS idx_payouts_recipient ON payouts(recipient_id);

-- ============================================================
-- ATO PENDING COMMISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS ato_pending_commissions (
  id              TEXT PRIMARY KEY,
  ato_id          TEXT NOT NULL,
  pilot_id        TEXT NOT NULL,
  enrollment_id   TEXT,
  commission_amount INTEGER DEFAULT 2000,
  status          TEXT DEFAULT 'pending',
  approved_by     TEXT,
  approved_at     TEXT,
  paid_at         TEXT,
  created_at      TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_ato_commissions_ato ON ato_pending_commissions(ato_id);
CREATE INDEX IF NOT EXISTS idx_ato_commissions_status ON ato_pending_commissions(status);

-- ============================================================
-- ATO VERIFICATION REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS ato_verification_requests (
  id              TEXT PRIMARY KEY,
  ato_id          TEXT NOT NULL,
  pilot_id        TEXT NOT NULL,
  request_type    TEXT NOT NULL,
  status          TEXT DEFAULT 'pending',
  submitted_docs  TEXT,
  reviewer_notes  TEXT,
  reviewed_by     TEXT,
  reviewed_at     TEXT,
  created_at      TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_ato_verif_ato ON ato_verification_requests(ato_id);
CREATE INDEX IF NOT EXISTS idx_ato_verif_status ON ato_verification_requests(status);

-- ============================================================
-- RATE LIMIT BUCKETS
-- ============================================================
CREATE TABLE IF NOT EXISTS rate_limit_buckets (
  id              TEXT PRIMARY KEY,
  identifier      TEXT NOT NULL,
  action_type     TEXT NOT NULL,
  window_start    TEXT NOT NULL,
  request_count   INTEGER DEFAULT 0,
  blocked_until   TEXT,
  created_at      TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_rate_limit_identifier ON rate_limit_buckets(identifier);
CREATE INDEX IF NOT EXISTS idx_rate_limit_action ON rate_limit_buckets(action_type);
CREATE INDEX IF NOT EXISTS idx_rate_limit_window ON rate_limit_buckets(window_start);
