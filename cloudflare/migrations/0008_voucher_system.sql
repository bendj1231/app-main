--- Migration number: 0008
--- ATO Bulk Voucher System

CREATE TABLE IF NOT EXISTS bulk_voucher_batches (
  id              TEXT PRIMARY KEY,
  enterprise_id   TEXT NOT NULL,
  batch_name      TEXT NOT NULL,
  tier            TEXT DEFAULT 'recognition_plus',
  amount_cents    INTEGER DEFAULT 2900,
  quantity        INTEGER NOT NULL,
  codes_generated INTEGER DEFAULT 0,
  codes_redeemed  INTEGER DEFAULT 0,
  expires_at      TEXT,
  status          TEXT DEFAULT 'active',
  payment_status  TEXT DEFAULT 'pending',
  dodo_checkout_id TEXT,
  metadata        TEXT,
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (enterprise_id) REFERENCES enterprise_profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bulk_voucher_codes (
  id              TEXT PRIMARY KEY,
  batch_id        TEXT NOT NULL,
  code            TEXT NOT NULL UNIQUE,
  status          TEXT DEFAULT 'unused',
  redeemed_by     TEXT,
  redeemed_at     TEXT,
  created_at      TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (batch_id) REFERENCES bulk_voucher_batches(id) ON DELETE CASCADE,
  FOREIGN KEY (redeemed_by) REFERENCES profiles(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_voucher_batches_enterprise ON bulk_voucher_batches(enterprise_id);
CREATE INDEX IF NOT EXISTS idx_voucher_codes_batch ON bulk_voucher_codes(batch_id);
CREATE INDEX IF NOT EXISTS idx_voucher_codes_code ON bulk_voucher_codes(code);
CREATE INDEX IF NOT EXISTS idx_voucher_codes_redeemed ON bulk_voucher_codes(redeemed_by);
