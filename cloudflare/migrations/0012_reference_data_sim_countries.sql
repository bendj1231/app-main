-- Reference Data: Sim Centers & Countries
-- Target: pilotrecognition-reference-data (DB binding)

-- ============================================================
-- SIM CENTERS (training locations)
-- ============================================================
CREATE TABLE IF NOT EXISTS sim_centers (
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
  facilities      TEXT,
  aircraft_types  TEXT,
  is_active       INTEGER DEFAULT 1,
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sim_centers_country ON sim_centers(country);
CREATE INDEX IF NOT EXISTS idx_sim_centers_active ON sim_centers(is_active);

-- ============================================================
-- COUNTRIES (reference data)
-- ============================================================
CREATE TABLE IF NOT EXISTS countries (
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

CREATE INDEX IF NOT EXISTS idx_countries_region ON countries(region);
