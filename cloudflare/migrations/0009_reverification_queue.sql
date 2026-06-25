--- Migration number: 0009
--- Annual Re-Verification Queue

CREATE TABLE IF NOT EXISTS reverification_queue (
  id              TEXT PRIMARY KEY,
  pilot_id        TEXT NOT NULL,
  pilot_email     TEXT,
  pilot_name      TEXT,
  credential_type TEXT NOT NULL,
  credential_id   TEXT,
  current_expiry  TEXT,
  status          TEXT DEFAULT 'pending',
  cycle_year      INTEGER NOT NULL,
  batch_id        TEXT,
  notified_at     TEXT,
  completed_at    TEXT,
  dismissed_at    TEXT,
  dismissed_by    TEXT,
  notes           TEXT,
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (pilot_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reverification_pilot ON reverification_queue(pilot_id);
CREATE INDEX IF NOT EXISTS idx_reverification_status ON reverification_queue(status);
CREATE INDEX IF NOT EXISTS idx_reverification_cycle ON reverification_queue(cycle_year);
CREATE INDEX IF NOT EXISTS idx_reverification_type ON reverification_queue(credential_type);
