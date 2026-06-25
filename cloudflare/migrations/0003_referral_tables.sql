--- Migration number: 0003
--- Add referral_partners and referral_conversions tables for Dodo webhook commission tracking

CREATE TABLE IF NOT EXISTS referral_partners (
  id              TEXT PRIMARY KEY,
  profile_id      TEXT,
  name            TEXT NOT NULL,
  email           TEXT,
  partner_type    TEXT DEFAULT 'pilot',
  referral_code   TEXT NOT NULL UNIQUE,
  is_active       INTEGER DEFAULT 1,
  commission_rate INTEGER DEFAULT 20,
  total_referrals INTEGER DEFAULT 0,
  total_payouts   INTEGER DEFAULT 0,
  pending_payouts INTEGER DEFAULT 0,
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_referral_partners_code ON referral_partners(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_partners_profile ON referral_partners(profile_id);

CREATE TABLE IF NOT EXISTS referral_conversions (
  id                TEXT PRIMARY KEY,
  partner_id        TEXT,
  referral_code     TEXT NOT NULL,
  pilot_id          TEXT NOT NULL,
  pilot_email       TEXT,
  pilot_name        TEXT,
  status            TEXT DEFAULT 'subscribed',
  signed_up_at      TEXT,
  subscribed_at     TEXT DEFAULT (datetime('now')),
  commission_amount INTEGER DEFAULT 2000,
  commission_status TEXT DEFAULT 'pending',
  FOREIGN KEY (partner_id) REFERENCES referral_partners(id) ON DELETE SET NULL,
  FOREIGN KEY (pilot_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_referral_conversions_code ON referral_conversions(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_pilot ON referral_conversions(pilot_id);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_partner ON referral_conversions(partner_id);
