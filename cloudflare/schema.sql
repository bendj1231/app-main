-- ============================================================
-- Cloudflare D1 Schema for PilotRecognition
-- Converted from PostgreSQL → SQLite (D1 dialect)
-- ============================================================
-- NOTE: Run this via Wrangler CLI or Cloudflare Dashboard SQL Editor
--       D1 uses SQLite syntax. No UUID type → TEXT. No TIMESTAMPTZ → TEXT.
-- ============================================================

-- Drop tables if they exist (for fresh migration)
-- Order matters: child tables with FKs must be dropped before parents
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS pilot_credentials;                -- FK: profiles
DROP TABLE IF EXISTS enterprise_profiles;              -- FK: enterprise_accounts
DROP TABLE IF EXISTS recognition_scores;
DROP TABLE IF EXISTS pilot_dids;
DROP TABLE IF EXISTS forum_reactions;                  -- FK: forum_posts
DROP TABLE IF EXISTS forum_posts;                      -- FK: forum_topics
DROP TABLE IF EXISTS forum_topic_views;                -- FK: forum_topics
DROP TABLE IF EXISTS forum_topics;                     -- FK: forum_categories
DROP TABLE IF EXISTS forum_categories;
DROP TABLE IF EXISTS delete_intent_tokens;             -- FK: profiles
DROP TABLE IF EXISTS profiles;

-- ============================================================
-- CORE USER TABLES
-- ============================================================

-- profiles: the master user record, keyed by Auth0 user ID
CREATE TABLE profiles (
  id              TEXT PRIMARY KEY,                    -- UUIDv4
  auth0_id        TEXT NOT NULL UNIQUE,                -- from Auth0 (e.g. auth0|abc123)
  email           TEXT NOT NULL UNIQUE,
  display_name    TEXT,
  first_name      TEXT,
  last_name       TEXT,
  phone           TEXT,
  country_code    TEXT,
  date_of_birth   TEXT,                                -- ISO 8601 date
  nationality     TEXT,
  role            TEXT DEFAULT 'pilot',                -- 'pilot', 'admin', 'super_admin', 'ato'
  status          TEXT DEFAULT 'active',               -- 'active', 'inactive', 'pending', 'suspended'
  avatar_url      TEXT,
  profile_image_url       TEXT,
  profile_image_public_id TEXT,

  -- Flight / Career fields
  current_flight_hours    INTEGER DEFAULT 0,
  total_flight_hours      INTEGER DEFAULT 0,
  mentorship_hours        INTEGER DEFAULT 0,
  foundation_progress     INTEGER DEFAULT 0,          -- 0-100
  overall_recognition_score INTEGER DEFAULT 0,
  current_level           TEXT,
  current_occupation      TEXT,
  license_id              TEXT,
  country_of_license      TEXT,
  ratings                 TEXT,                        -- JSON array as text
  is_enrolled_in_foundational BOOLEAN DEFAULT 0,

  -- Subscription / Tier
  subscription_tier       TEXT DEFAULT 'free',        -- 'free', 'basic', 'pro', 'recognition+', 'enterprise'
  subscription_status     TEXT DEFAULT 'active',      -- 'active', 'trial', 'cancelled', 'expired'
  subscription_start_date TEXT,
  subscription_end_date   TEXT,

  -- Wallet / DID
  wallet_id               TEXT,
  wallet_email            TEXT,
  wallet_did              TEXT,

  -- Referral (code to share; tracking lives in Dodo)
  referral_code           TEXT UNIQUE,

  -- Compliance
  origin_jurisdiction     TEXT,                        -- immutable, set at account creation (ToS Section 13.3)

  -- Timestamps
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_profiles_auth0_id ON profiles(auth0_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_subscription_tier ON profiles(subscription_tier);
CREATE INDEX idx_profiles_referral_code ON profiles(referral_code);

-- recognition_scores: calculated pilot recognition score
CREATE TABLE recognition_scores (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL UNIQUE,
  total_score     INTEGER DEFAULT 0,
  hours_score     INTEGER DEFAULT 0,
  experience_score INTEGER DEFAULT 0,
  assessment_score INTEGER DEFAULT 0,
  mentorship_score INTEGER DEFAULT 0,
  score_tier      TEXT DEFAULT 'bronze',             -- 'bronze', 'silver', 'gold', 'platinum'
  breakdown       TEXT,                               -- JSON
  recommendations TEXT,                               -- JSON array
  last_calculated_at TEXT DEFAULT (datetime('now')),
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE INDEX idx_recognition_scores_user_id ON recognition_scores(user_id);
CREATE INDEX idx_recognition_scores_tier ON recognition_scores(score_tier);

-- pilot_dids: Pilot Recognition Profile identifiers (decentralized ID for verified credentials)
CREATE TABLE pilot_dids (
  id              TEXT PRIMARY KEY,
  profile_id      TEXT NOT NULL,
  auth0_id        TEXT NOT NULL UNIQUE,
  did             TEXT NOT NULL,
  did_method      TEXT DEFAULT 'did:key',
  public_key_jwk  TEXT,                               -- JSON
  created_at      TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE INDEX idx_dids_auth0_id ON pilot_dids(auth0_id);

-- ============================================================
-- PAYMENT TABLES
-- ============================================================

-- payments: Dodo payment records + Mauritius tax audit trail
CREATE TABLE payments (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL,
  amount_cents    INTEGER NOT NULL,                   -- e.g. 1500 = $15.00
  currency        TEXT DEFAULT 'USD',
  tier_purchased  TEXT NOT NULL,                      -- 'pro', 'recognition+', etc.
  tax_amount      INTEGER DEFAULT 0,                  -- 15% in cents
  tax_rate_percent INTEGER DEFAULT 15,
  dodo_payment_id TEXT NOT NULL,
  dodo_invoice_id TEXT,
  dodo_checkout_id TEXT,
  status          TEXT DEFAULT 'completed',          -- 'completed', 'refunded', 'failed', 'disputed'
  payment_method  TEXT,
  receipt_url     TEXT,
  created_at      TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_dodo_id ON payments(dodo_payment_id);
CREATE INDEX idx_payments_created ON payments(created_at);

-- ============================================================
-- ADMIN / ENTERPRISE TABLES
-- ============================================================

-- enterprise_profiles: airline partners and corporate customers
CREATE TABLE enterprise_profiles (
  id              TEXT PRIMARY KEY,
  company_name    TEXT NOT NULL,
  industry        TEXT,
  contact_email   TEXT,
  contact_phone   TEXT,
  website         TEXT,
  country         TEXT,
  employee_count  INTEGER,
  subscription_status TEXT DEFAULT 'trial',         -- 'trial', 'active', 'cancelled', 'expired'
  subscription_tier   TEXT DEFAULT 'basic',         -- 'basic', 'pro', 'enterprise'
  subscription_start_date TEXT,
  subscription_end_date   TEXT,
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_enterprise_status ON enterprise_profiles(subscription_status);
CREATE INDEX idx_enterprise_created ON enterprise_profiles(created_at);

-- pilot_credentials: verifiable credentials issued to pilots
CREATE TABLE pilot_credentials (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL,
  credential_type TEXT NOT NULL,                      -- 'license', 'medical', 'radio_license', 'english_proficiency', 'flight_hours'
  issuer          TEXT NOT NULL,                      -- who issued it
  credential_data TEXT NOT NULL,                      -- JSON
  walt_id         TEXT,                               -- walt.id credential ID
  issued_at       TEXT DEFAULT (datetime('now')),
  expires_at      TEXT,
  revoked_at      TEXT,
  status          TEXT DEFAULT 'active',              -- 'active', 'expired', 'revoked'
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE INDEX idx_credentials_user_id ON pilot_credentials(user_id);
CREATE INDEX idx_credentials_type ON pilot_credentials(credential_type);

-- ============================================================
-- ENTERPRISE ACCOUNTS
-- ============================================================

CREATE TABLE enterprise_accounts (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  website         TEXT,
  country         TEXT,
  industry        TEXT,
  account_type    TEXT DEFAULT 'airline',                -- 'airline', 'operator', 'ato', 'other'
  status          TEXT DEFAULT 'active',
  created_at      TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- REFERENCE DATA TABLES (small, seedable)
-- ============================================================

-- airlines: static reference data (can also be JSON file in R2)
CREATE TABLE airlines (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  icao            TEXT,
  iata            TEXT,
  country         TEXT,
  logo_url        TEXT,
  website         TEXT,
  is_hiring       INTEGER DEFAULT 0,
  description     TEXT,
  metadata        TEXT,                               -- JSON
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_airlines_country ON airlines(country);
CREATE INDEX idx_airlines_hiring ON airlines(is_hiring);

-- aircraft_type_ratings
CREATE TABLE aircraft_type_ratings (
  id              TEXT PRIMARY KEY,
  manufacturer_id TEXT,
  model           TEXT NOT NULL,
  type_rating     TEXT,
  category        TEXT,                               -- 'single_engine', 'multi_engine', 'jet', 'turboprop'
  seats           INTEGER,
  max_weight_kg   INTEGER,
  description     TEXT,
  image_url       TEXT,
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_aircraft_manufacturer ON aircraft_type_ratings(manufacturer_id);

-- ============================================================
-- FORUM TABLES
-- ============================================================

CREATE TABLE forum_categories (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order  INTEGER DEFAULT 0,
  created_at  TEXT DEFAULT (datetime('now'))
);

CREATE TABLE forum_topics (
  id              TEXT PRIMARY KEY,
  category_id     TEXT NOT NULL,
  user_id         TEXT NOT NULL,
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL,
  content         TEXT NOT NULL,
  is_pinned       INTEGER DEFAULT 0,
  is_locked       INTEGER DEFAULT 0,
  view_count      INTEGER DEFAULT 0,
  reply_count     INTEGER DEFAULT 0,
  last_reply_at   TEXT,
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (category_id) REFERENCES forum_categories(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE INDEX idx_topics_category ON forum_topics(category_id);
CREATE INDEX idx_topics_user ON forum_topics(user_id);
CREATE INDEX idx_topics_pinned ON forum_topics(is_pinned, created_at);

CREATE TABLE forum_posts (
  id          TEXT PRIMARY KEY,
  topic_id    TEXT NOT NULL,
  user_id     TEXT NOT NULL,
  content     TEXT NOT NULL,
  is_solution INTEGER DEFAULT 0,
  created_at  TEXT DEFAULT (datetime('now')),
  updated_at  TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (topic_id) REFERENCES forum_topics(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE INDEX idx_posts_topic ON forum_posts(topic_id);
CREATE INDEX idx_posts_user ON forum_posts(user_id);

CREATE TABLE forum_reactions (
  id          TEXT PRIMARY KEY,
  post_id     TEXT NOT NULL,
  user_id     TEXT NOT NULL,
  reaction_type TEXT DEFAULT 'like',
  created_at  TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
  UNIQUE(post_id, user_id, reaction_type)
);

CREATE TABLE forum_topic_views (
  id          TEXT PRIMARY KEY,
  topic_id    TEXT NOT NULL,
  user_id     TEXT,
  ip_address  TEXT,
  viewed_at   TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (topic_id) REFERENCES forum_topics(id) ON DELETE CASCADE
);

CREATE INDEX idx_views_topic ON forum_topic_views(topic_id);

-- ============================================================
-- GDPR / DELETE TABLES
-- ============================================================

CREATE TABLE delete_intent_tokens (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL,
  token           TEXT NOT NULL UNIQUE,
  reason          TEXT,
  expires_at      TEXT NOT NULL,
  confirmed_at    TEXT,
  processed_at    TEXT,
  status          TEXT DEFAULT 'pending',
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE INDEX idx_delete_tokens_user ON delete_intent_tokens(user_id);
CREATE INDEX idx_delete_tokens_status ON delete_intent_tokens(status);

-- ============================================================
-- REFERRAL TRACKING (manual payout — referrer contacts admin)
-- ============================================================

CREATE TABLE referral_uses (
  id              TEXT PRIMARY KEY,
  referral_code   TEXT NOT NULL,                          -- the code that was used
  referrer_id     TEXT NOT NULL,                          -- who owns the code
  referred_id     TEXT NOT NULL UNIQUE,                   -- who signed up
  referred_email  TEXT,
  status          TEXT DEFAULT 'pending',                -- 'pending', 'claimed', 'paid', 'credited'
  reward_amount   INTEGER DEFAULT 2000,                   -- cents ($20.00 default)
  reward_type     TEXT DEFAULT 'credit',                  -- 'credit', 'cash', 'discount'
  notes           TEXT,                                    -- admin notes
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (referrer_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (referred_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE INDEX idx_referral_code ON referral_uses(referral_code);
CREATE INDEX idx_referral_referrer ON referral_uses(referrer_id);
CREATE INDEX idx_referral_status ON referral_uses(status);

-- ============================================================
-- VIEWS (SQLite supports simple views)
-- ============================================================

-- View: active pilots with tier info
CREATE VIEW IF NOT EXISTS v_pilot_summary AS
SELECT
  p.id,
  p.auth0_id,
  p.email,
  p.display_name,
  p.subscription_tier,
  p.subscription_status,
  p.total_flight_hours,
  p.overall_recognition_score,
  r.score_tier AS recognition_tier,
  p.created_at
FROM profiles p
LEFT JOIN recognition_scores r ON r.user_id = p.id
WHERE p.role = 'pilot' AND p.status = 'active';

-- ============================================================
-- NOTE: No auto-update trigger — SQLite triggers can recurse.
-- Worker code explicitly sets updated_at on PATCH requests.
-- ============================================================
