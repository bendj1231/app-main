-- Enterprise, Content & Pathways Tables
-- Target: pilotrecognition-reference-data (DB binding)

-- ============================================================
-- PUBLIC IPFS PINS (static content catalog)
-- ============================================================
CREATE TABLE IF NOT EXISTS public_ipfs_pins (
  id              TEXT PRIMARY KEY,
  pin_name        TEXT NOT NULL,
  cid             TEXT NOT NULL UNIQUE,
  size_bytes      INTEGER,
  pinned_by       TEXT,
  is_active       INTEGER DEFAULT 1,
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ipfs_pins_active ON public_ipfs_pins(is_active);

-- ============================================================
-- JOB OPPORTUNITIES (enterprise job postings)
-- ============================================================
CREATE TABLE IF NOT EXISTS job_opportunities (
  id              TEXT PRIMARY KEY,
  enterprise_id   TEXT NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  position_type   TEXT DEFAULT 'pilot',
  location        TEXT,
  airline_name    TEXT,
  requirements    TEXT,
  salary_range    TEXT,
  benefits        TEXT,
  is_active       INTEGER DEFAULT 1,
  expires_at      TEXT,
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_enterprise ON job_opportunities(enterprise_id);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_active ON job_opportunities(is_active);

-- ============================================================
-- ENTERPRISE PATHWAY CARDS
-- ============================================================
CREATE TABLE IF NOT EXISTS enterprise_pathway_cards (
  id              TEXT PRIMARY KEY,
  enterprise_id   TEXT NOT NULL,
  title           TEXT NOT NULL,
  position_type   TEXT NOT NULL,
  description     TEXT,
  requirements    TEXT,
  salary_info     TEXT,
  benefits        TEXT,
  is_published    INTEGER DEFAULT 0,
  published_at    TEXT,
  expires_at      TEXT,
  view_count      INTEGER DEFAULT 0,
  interest_count  INTEGER DEFAULT 0,
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_pathway_cards_enterprise ON enterprise_pathway_cards(enterprise_id);
CREATE INDEX IF NOT EXISTS idx_pathway_cards_published ON enterprise_pathway_cards(is_published);

-- ============================================================
-- PATHWAY CARD INTERESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS pathway_card_interests (
  id              TEXT PRIMARY KEY,
  card_id         TEXT NOT NULL,
  pilot_id        TEXT NOT NULL,
  status          TEXT DEFAULT 'interested',
  notes           TEXT,
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_card_interests_card ON pathway_card_interests(card_id);
CREATE INDEX IF NOT EXISTS idx_card_interests_pilot ON pathway_card_interests(pilot_id);

-- ============================================================
-- AIRLINE EXPECTATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS airline_expectations (
  id              TEXT PRIMARY KEY,
  enterprise_id   TEXT NOT NULL,
  position_type   TEXT NOT NULL,
  min_flight_hours INTEGER DEFAULT 0,
  license_type    TEXT,
  type_ratings    TEXT,
  medical_class   TEXT,
  english_level   TEXT,
  additional_reqs TEXT,
  is_active       INTEGER DEFAULT 1,
  updated_at      TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_airline_expectations_enterprise ON airline_expectations(enterprise_id);

-- ============================================================
-- ENTERPRISE ACCESS REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS enterprise_access_requests (
  id              TEXT PRIMARY KEY,
  pilot_id        TEXT NOT NULL,
  email           TEXT NOT NULL,
  enterprise_name TEXT,
  request_type    TEXT DEFAULT 'access',
  status          TEXT DEFAULT 'pending',
  requested_at    TEXT DEFAULT (datetime('now')),
  approved_by     TEXT,
  approved_at     TEXT,
  rejection_reason TEXT,
  created_at      TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_access_requests_pilot ON enterprise_access_requests(pilot_id);
CREATE INDEX IF NOT EXISTS idx_access_requests_status ON enterprise_access_requests(status);

-- ============================================================
-- BLOG POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
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

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created ON blog_posts(created_at);
