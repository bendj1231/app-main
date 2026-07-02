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
  referred_by_code        TEXT,                        -- referral code used at signup
  referred_by_profile_id  TEXT,                        -- who referred this pilot

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
CREATE INDEX idx_profiles_referred_by_code ON profiles(referred_by_code);
CREATE INDEX idx_profiles_referred_by_profile_id ON profiles(referred_by_profile_id);

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
-- STRICTLY SEPARATE from pilot profiles table. Linked by Auth0 ID.
CREATE TABLE enterprise_profiles (
  id              TEXT PRIMARY KEY,
  auth0_id        TEXT UNIQUE,                        -- Auth0 sub (e.g. auth0|abc123)
  company_name    TEXT NOT NULL,
  airline_name    TEXT,                                -- display name for airlines
  airline_iata_code TEXT,
  airline_logo_url  TEXT,
  airline_website   TEXT,
  company_description TEXT,
  industry        TEXT,
  account_type    TEXT DEFAULT 'airline',            -- 'airline', 'cargo', 'charter', 'ato', 'sim_center', 'oem', 'military', 'other'
  contact_email   TEXT,
  contact_phone   TEXT,
  billing_email   TEXT,
  website         TEXT,
  country         TEXT,
  base_locations  TEXT,                                  -- JSON array of strings
  fleet_information TEXT,                              -- JSON object
  contact_information TEXT,                            -- JSON object
  employee_count  INTEGER,
  is_active       INTEGER DEFAULT 1,
  account_tier    TEXT DEFAULT 'free',                 -- 'free', 'data_controller', 'enterprise'
  can_pull_verified_profiles INTEGER DEFAULT 0,
  can_view_pilot_details     INTEGER DEFAULT 0,
  can_export_data            INTEGER DEFAULT 0,
  max_pathway_cards          INTEGER DEFAULT 3,
  max_interest_views_per_month INTEGER DEFAULT 50,
  stripe_customer_id         TEXT,
  tier_expires_at            TEXT,
  subscription_status TEXT DEFAULT 'trial',         -- 'trial', 'active', 'cancelled', 'expired'
  subscription_tier   TEXT DEFAULT 'basic',         -- 'basic', 'pro', 'enterprise'
  subscription_start_date TEXT,
  subscription_end_date   TEXT,
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_enterprise_auth0_id ON enterprise_profiles(auth0_id);
CREATE INDEX idx_enterprise_status ON enterprise_profiles(subscription_status);
CREATE INDEX idx_enterprise_created ON enterprise_profiles(created_at);
CREATE INDEX idx_enterprise_account_type ON enterprise_profiles(account_type);
CREATE INDEX idx_enterprise_active ON enterprise_profiles(is_active);

-- ============================================================
-- SUBSCRIPTION TRACKING
-- ============================================================

CREATE TABLE subscriptions (
  id              TEXT PRIMARY KEY,
  subscriber_type TEXT NOT NULL,                       -- 'profile' (pilot) or 'enterprise'
  subscriber_id   TEXT NOT NULL,                       -- profiles.id or enterprise_profiles.id
  tier            TEXT NOT NULL,                       -- 'free', 'basic', 'pro', 'enterprise', 'recognition+'
  status          TEXT DEFAULT 'active',               -- 'active', 'trial', 'cancelled', 'expired', 'past_due'
  billing_cycle   TEXT DEFAULT 'monthly',            -- 'monthly', 'yearly', 'quarterly'
  amount_cents    INTEGER DEFAULT 0,                 -- e.g., 2900 for $29.00
  currency        TEXT DEFAULT 'USD',
  payment_provider TEXT,                               -- 'stripe', 'dodo', 'manual'
  provider_subscription_id TEXT,                       -- external sub ID
  current_period_start TEXT,
  current_period_end   TEXT,                           -- auto-calculated expiry
  cancel_at_period_end INTEGER DEFAULT 0,              -- 1 = will not renew
  trial_end       TEXT,
  renewal_count   INTEGER DEFAULT 0,                   -- how many times renewed
  metadata        TEXT,                                -- JSON
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_subscriptions_subscriber ON subscriptions(subscriber_type, subscriber_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_end ON subscriptions(current_period_end);
CREATE INDEX idx_subscriptions_provider ON subscriptions(provider_subscription_id);

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
-- FLIGHT SCHOOL / ATO TABLES (enterprise-linked)
-- ============================================================

CREATE TABLE flight_schools (
  id              TEXT PRIMARY KEY,
  enterprise_id   TEXT NOT NULL,                        -- FK to enterprise_profiles
  name            TEXT NOT NULL,
  referral_code   TEXT UNIQUE,
  commission_rate INTEGER DEFAULT 20,                   -- dollars per pilot
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

CREATE INDEX idx_flight_schools_enterprise ON flight_schools(enterprise_id);
CREATE INDEX idx_flight_schools_referral ON flight_schools(referral_code);

CREATE TABLE flight_school_referrals (
  id                TEXT PRIMARY KEY,
  flight_school_id  TEXT NOT NULL,
  pilot_email       TEXT,
  pilot_name        TEXT,
  referral_code     TEXT,
  referral_link     TEXT,
  commission_amount INTEGER DEFAULT 2000,               -- cents
  status            TEXT DEFAULT 'pending',             -- 'pending', 'clicked', 'signed_up', 'completed', 'paid'
  commission_status TEXT DEFAULT 'pending',              -- 'pending', 'eligible', 'paid'
  created_at        TEXT DEFAULT (datetime('now')),
  updated_at        TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (flight_school_id) REFERENCES flight_schools(id) ON DELETE CASCADE
);

CREATE INDEX idx_fs_referrals_school ON flight_school_referrals(flight_school_id);
CREATE INDEX idx_fs_referrals_status ON flight_school_referrals(status);

CREATE TABLE flight_school_payouts (
  id              TEXT PRIMARY KEY,
  flight_school_id TEXT NOT NULL,
  amount          INTEGER NOT NULL,                    -- cents
  status          TEXT DEFAULT 'pending',              -- 'pending', 'processing', 'completed', 'failed', 'cancelled'
  payout_method   TEXT,
  created_at      TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (flight_school_id) REFERENCES flight_schools(id) ON DELETE CASCADE
);

CREATE INDEX idx_fs_payouts_school ON flight_school_payouts(flight_school_id);

CREATE TABLE flight_school_notifications (
  id              TEXT PRIMARY KEY,
  flight_school_id TEXT NOT NULL,
  title           TEXT NOT NULL,
  message         TEXT,
  read            INTEGER DEFAULT 0,
  created_at      TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (flight_school_id) REFERENCES flight_schools(id) ON DELETE CASCADE
);

CREATE INDEX idx_fs_notifications_school ON flight_school_notifications(flight_school_id);
CREATE INDEX idx_fs_notifications_read ON flight_school_notifications(read);

-- ============================================================
-- CREDIT SYSTEM (enterprise verification credits)
-- ============================================================

CREATE TABLE enterprise_credits (
  id              TEXT PRIMARY KEY,
  enterprise_id   TEXT NOT NULL UNIQUE,                -- FK to enterprise_profiles
  balance         INTEGER DEFAULT 0,                   -- credits in cents (e.g., 1000 = $10.00)
  total_burned    INTEGER DEFAULT 0,                  -- lifetime burned
  total_topped_up INTEGER DEFAULT 0,                  -- lifetime topped up
  updated_at      TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (enterprise_id) REFERENCES enterprise_profiles(id) ON DELETE CASCADE
);

CREATE INDEX idx_credits_enterprise ON enterprise_credits(enterprise_id);

CREATE TABLE credit_transactions (
  id              TEXT PRIMARY KEY,
  enterprise_id   TEXT NOT NULL,
  type            TEXT NOT NULL,                       -- 'burn', 'top_up', 'refund', 'grant'
  amount          INTEGER NOT NULL,                    -- positive for top_up, negative for burn
  balance_after   INTEGER NOT NULL,
  description     TEXT,                                -- e.g., "Verification of pilot license"
  verification_id TEXT,                                -- link to verification_submissions
  created_at      TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (enterprise_id) REFERENCES enterprise_profiles(id) ON DELETE CASCADE
);

CREATE INDEX idx_credit_tx_enterprise ON credit_transactions(enterprise_id);
CREATE INDEX idx_credit_tx_type ON credit_transactions(type);
CREATE INDEX idx_credit_tx_created ON credit_transactions(created_at);

-- Verification queue for enterprise-initiated pilot checks
CREATE TABLE verification_submissions (
  id              TEXT PRIMARY KEY,
  enterprise_id   TEXT NOT NULL,
  pilot_email     TEXT,
  pilot_name      TEXT,
  document_type   TEXT NOT NULL,                       -- 'license', 'medical', 'radio', 'elp', 'logbook', 'background_check'
  document_url    TEXT,                                -- R2 or Cloudinary URL
  document_hash   TEXT,                                -- SHA-256 of document for integrity
  status          TEXT DEFAULT 'pending',              -- 'pending', 'in_review', 'verified', 'rejected', 'expired'
  credits_burned  INTEGER DEFAULT 0,                   -- how many credits consumed
  reviewer_notes  TEXT,
  reviewed_at     TEXT,
  expires_at      TEXT,                                -- auto-purge target (ignored if is_permanent = 1)
  is_permanent    INTEGER DEFAULT 0,                   -- 1 = consent form / permanent retention, skip purge
  metadata        TEXT,                                -- JSON: {icao_code, license_number, etc}
  created_at      TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (enterprise_id) REFERENCES enterprise_profiles(id) ON DELETE CASCADE
);

CREATE INDEX idx_verification_enterprise ON verification_submissions(enterprise_id);
CREATE INDEX idx_verification_status ON verification_submissions(status);
CREATE INDEX idx_verification_expires ON verification_submissions(expires_at);

-- ============================================================
-- ATO BULK VOUCHER SYSTEM
-- ============================================================

CREATE TABLE bulk_voucher_batches (
  id              TEXT PRIMARY KEY,
  enterprise_id   TEXT NOT NULL,                       -- ATO / flight school
  batch_name      TEXT NOT NULL,                       -- e.g. "WCC Class of 2026"
  tier            TEXT DEFAULT 'recognition_plus',      -- what subscription tier this voucher unlocks
  amount_cents    INTEGER DEFAULT 2900,                 -- price per voucher in cents (discounted)
  quantity        INTEGER NOT NULL,                     -- how many codes in this batch
  codes_generated INTEGER DEFAULT 0,
  codes_redeemed  INTEGER DEFAULT 0,
  expires_at      TEXT,                                 -- batch expiry
  status          TEXT DEFAULT 'active',                -- 'active', 'paused', 'expired'
  payment_status  TEXT DEFAULT 'pending',               -- 'pending', 'paid', 'failed', 'refunded'
  dodo_checkout_id TEXT,
  metadata        TEXT,                                 -- JSON: {graduation_date, instructor_notes}
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (enterprise_id) REFERENCES enterprise_profiles(id) ON DELETE CASCADE
);

CREATE TABLE bulk_voucher_codes (
  id              TEXT PRIMARY KEY,
  batch_id        TEXT NOT NULL,
  code            TEXT NOT NULL UNIQUE,                -- e.g. "ATO-WCC-2026-X7K9"
  status          TEXT DEFAULT 'unused',                -- 'unused', 'redeemed', 'expired', 'revoked'
  redeemed_by     TEXT,                                 -- profiles.id
  redeemed_at     TEXT,
  created_at      TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (batch_id) REFERENCES bulk_voucher_batches(id) ON DELETE CASCADE,
  FOREIGN KEY (redeemed_by) REFERENCES profiles(id) ON DELETE SET NULL
);

CREATE INDEX idx_voucher_batches_enterprise ON bulk_voucher_batches(enterprise_id);
CREATE INDEX idx_voucher_codes_batch ON bulk_voucher_codes(batch_id);
CREATE INDEX idx_voucher_codes_code ON bulk_voucher_codes(code);
CREATE INDEX idx_voucher_codes_redeemed ON bulk_voucher_codes(redeemed_by);

-- ============================================================
-- ANNUAL RE-VERIFICATION QUEUE
-- ============================================================

CREATE TABLE reverification_queue (
  id              TEXT PRIMARY KEY,
  pilot_id        TEXT NOT NULL,                          -- profiles.id
  pilot_email     TEXT,
  pilot_name      TEXT,
  credential_type TEXT NOT NULL,                          -- 'license', 'medical', 'radio_license', 'english_proficiency'
  credential_id   TEXT,                                   -- pilot_credentials.id (nullable)
  current_expiry  TEXT,                                   -- current expiry date of the credential
  status          TEXT DEFAULT 'pending',                  -- 'pending', 'notified', 'in_progress', 'completed', 'dismissed'
  cycle_year      INTEGER NOT NULL,                       -- e.g. 2026
  batch_id        TEXT,                                   -- grouping for annual runs
  notified_at     TEXT,
  completed_at    TEXT,
  dismissed_at    TEXT,
  dismissed_by    TEXT,
  notes           TEXT,
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (pilot_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE INDEX idx_reverification_pilot ON reverification_queue(pilot_id);
CREATE INDEX idx_reverification_status ON reverification_queue(status);
CREATE INDEX idx_reverification_cycle ON reverification_queue(cycle_year);
CREATE INDEX idx_reverification_type ON reverification_queue(credential_type);

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
-- SIM CENTERS (training locations)
-- ============================================================
CREATE TABLE sim_centers (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  icao            TEXT,
  iata            TEXT,
  country         TEXT,
  city            TEXT,
  latitude        REAL,
  longitude       REAL,
  address         TEXT,
  phone           TEXT,
  email           TEXT,
  website         TEXT,
  facilities      TEXT,                                -- JSON: {full_motion: true, ftd: true, ...}
  aircraft_types  TEXT,                                -- JSON array
  is_active       INTEGER DEFAULT 1,
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_sim_centers_country ON sim_centers(country);
CREATE INDEX idx_sim_centers_active ON sim_centers(is_active);

-- ============================================================
-- COUNTRIES (reference data)
-- ============================================================
CREATE TABLE countries (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  iso_code        TEXT NOT NULL UNIQUE,
  iso3_code       TEXT,
  dialing_code    TEXT,
  currency        TEXT,
  region          TEXT,
  is_active       INTEGER DEFAULT 1,
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_countries_region ON countries(region);

-- ============================================================
-- BLOG POSTS
-- ============================================================
CREATE TABLE blog_posts (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  excerpt         TEXT,
  content         TEXT NOT NULL,
  cover_image_url TEXT,
  author_id       TEXT,
  author_name     TEXT,
  category        TEXT DEFAULT 'news',
  tags            TEXT,
  is_published    INTEGER DEFAULT 0,
  published_at    TEXT,
  view_count      INTEGER DEFAULT 0,
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published, published_at);

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
-- REFERRAL PARTNERS (pilots / orgs with active referral codes)
-- ============================================================

CREATE TABLE referral_partners (
  id              TEXT PRIMARY KEY,
  profile_id      TEXT,                                 -- pilot profile (nullable for orgs)
  name            TEXT NOT NULL,
  email           TEXT,
  partner_type    TEXT DEFAULT 'pilot',                 -- 'pilot', 'flight_school', 'ato', 'airline'
  referral_code   TEXT NOT NULL UNIQUE,
  is_active       INTEGER DEFAULT 1,
  commission_rate INTEGER DEFAULT 20,                   -- fixed $20 per Recognition+ subscription
  total_referrals INTEGER DEFAULT 0,
  total_payouts   INTEGER DEFAULT 0,                    -- cents
  pending_payouts INTEGER DEFAULT 0,                    -- cents
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE SET NULL
);

CREATE INDEX idx_referral_partners_code ON referral_partners(referral_code);
CREATE INDEX idx_referral_partners_profile ON referral_partners(profile_id);

-- ============================================================
-- REFERRAL CONVERSIONS (subscription events for commission payout)
-- ============================================================

CREATE TABLE referral_conversions (
  id                TEXT PRIMARY KEY,
  partner_id        TEXT,                               -- links to referral_partners
  referral_code     TEXT NOT NULL,
  pilot_id          TEXT NOT NULL,
  pilot_email       TEXT,
  pilot_name        TEXT,
  status            TEXT DEFAULT 'subscribed',           -- 'subscribed'
  signed_up_at      TEXT,
  subscribed_at     TEXT DEFAULT (datetime('now')),
  commission_amount INTEGER DEFAULT 2000,               -- cents ($20.00 default)
  commission_status TEXT DEFAULT 'pending',              -- 'pending', 'paid', 'cancelled'
  FOREIGN KEY (partner_id) REFERENCES referral_partners(id) ON DELETE SET NULL,
  FOREIGN KEY (pilot_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE INDEX idx_referral_conversions_code ON referral_conversions(referral_code);
CREATE INDEX idx_referral_conversions_pilot ON referral_conversions(pilot_id);
CREATE INDEX idx_referral_conversions_partner ON referral_conversions(partner_id);

-- ============================================================
-- AUDIT / ACTIVITY LOG
-- ============================================================

CREATE TABLE user_activity_log (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL,                        -- auth0_id of the actor
  action          TEXT NOT NULL,                        -- e.g. 'enterprise_pull', 'profile_update'
  entity_type     TEXT,                                 -- e.g. 'profile', 'credential'
  entity_id       TEXT,                                 -- target UUID (nullable for bulk ops)
  metadata        TEXT,                                 -- JSON payload
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX idx_user_activity_log_action ON user_activity_log(action);
CREATE INDEX idx_user_activity_log_created ON user_activity_log(created_at);

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
