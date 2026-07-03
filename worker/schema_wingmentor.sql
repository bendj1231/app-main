-- Wingmentor Program Schema (extracted from migration for reference)
-- Run via: npx wrangler d1 execute wingmentor-program --file ./schema_wingmentor.sql

CREATE TABLE IF NOT EXISTS enrollments (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL,
  program_name    TEXT NOT NULL,
  enrollment_status TEXT DEFAULT 'active',
  onboarding_data   TEXT,
  enrolled_at       TEXT DEFAULT (datetime('now')),
  completed_at      TEXT,
  updated_at        TEXT DEFAULT (datetime('now'))
);
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_program ON enrollments(program_name);

CREATE TABLE IF NOT EXISTS program_progress (
  id                      TEXT PRIMARY KEY,
  user_id                 TEXT NOT NULL,
  program_type            TEXT NOT NULL,
  completion_percentage   INTEGER DEFAULT 0,
  modules_completed       TEXT,
  total_modules           INTEGER DEFAULT 3,
  status                  TEXT DEFAULT 'not_started',
  start_date              TEXT,
  expected_completion     TEXT,
  last_activity_at        TEXT DEFAULT (datetime('now')),
  created_at              TEXT DEFAULT (datetime('now')),
  updated_at              TEXT DEFAULT (datetime('now'))
);
CREATE INDEX idx_program_progress_user ON program_progress(user_id);
CREATE INDEX idx_program_progress_type ON program_progress(program_type);

CREATE TABLE IF NOT EXISTS program_modules (
  id              TEXT PRIMARY KEY,
  program_type    TEXT NOT NULL,
  module_number   INTEGER NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  content_url     TEXT,
  estimated_hours INTEGER DEFAULT 1,
  is_required     INTEGER DEFAULT 1,
  prerequisites   TEXT,
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS logbook_hour_tokens (
  id                  TEXT PRIMARY KEY,
  pilot_id            TEXT NOT NULL,
  issuer_name         TEXT NOT NULL,
  total_hours         REAL DEFAULT 0,
  pic_hours           REAL DEFAULT 0,
  aircraft_type       TEXT,
  period_from         TEXT,
  period_to           TEXT,
  verification_level  TEXT DEFAULT 'basic',
  attestation_token   TEXT NOT NULL UNIQUE,
  status              TEXT DEFAULT 'active',
  revoked_at          TEXT,
  revoked_reason      TEXT,
  created_at          TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS interview_assessments (
  id                      TEXT PRIMARY KEY,
  pilot_id                TEXT NOT NULL,
  interviewer_id          TEXT,
  overall_score           INTEGER,
  overall_grade           TEXT,
  technical_knowledge_score INTEGER,
  communication_score       INTEGER,
  decision_making_score     INTEGER,
  strengths               TEXT,
  areas_for_improvement   TEXT,
  detailed_feedback       TEXT,
  recommendation          TEXT DEFAULT 'pending',
  assessment_date           TEXT,
  created_at              TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS atlas_resumes (
  id              TEXT PRIMARY KEY,
  pilot_id        TEXT NOT NULL UNIQUE,
  resume_data     TEXT,
  markdown_text   TEXT,
  html_version    TEXT,
  is_public       INTEGER DEFAULT 0,
  view_count      INTEGER DEFAULT 0,
  last_updated    TEXT DEFAULT (datetime('now')),
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS mentor_profiles (
  id              TEXT PRIMARY KEY,
  auth0_id        TEXT NOT NULL UNIQUE,
  email           TEXT NOT NULL,
  display_name    TEXT,
  first_name      TEXT,
  last_name       TEXT,
  bio             TEXT,
  specialties     TEXT,
  airline         TEXT,
  years_experience INTEGER,
  hourly_rate     INTEGER,
  is_active       INTEGER DEFAULT 1,
  max_mentees     INTEGER DEFAULT 5,
  profile_image_url TEXT,
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS meetings (
  id              TEXT PRIMARY KEY,
  mentor_id       TEXT NOT NULL,
  pilot_id        TEXT NOT NULL,
  meeting_type     TEXT DEFAULT 'mentorship',
  scheduled_at    TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status          TEXT DEFAULT 'scheduled',
  notes           TEXT,
  recording_url   TEXT,
  feedback_submitted INTEGER DEFAULT 0,
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS events (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  description     TEXT,
  event_type      TEXT DEFAULT 'webinar',
  start_date      TEXT NOT NULL,
  end_date        TEXT,
  start_time      TEXT,
  end_time        TEXT,
  timezone        TEXT DEFAULT 'UTC',
  location        TEXT,
  meeting_link    TEXT,
  max_attendees   INTEGER,
  speaker_ids     TEXT,
  program_type    TEXT,
  status          TEXT DEFAULT 'upcoming',
  created_by      TEXT,
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS event_registrations (
  id              TEXT PRIMARY KEY,
  event_id        TEXT NOT NULL,
  pilot_id        TEXT NOT NULL,
  registration_status TEXT DEFAULT 'registered',
  attended_at     TEXT,
  feedback_rating INTEGER,
  feedback_comment TEXT,
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS daily_quotes (
  id              TEXT PRIMARY KEY,
  quote           TEXT NOT NULL,
  author          TEXT,
  category        TEXT DEFAULT 'general',
  display_date    TEXT,
  is_active       INTEGER DEFAULT 1,
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS mentorship_assignments (
  id              TEXT PRIMARY KEY,
  mentor_id       TEXT NOT NULL,
  pilot_id        TEXT NOT NULL,
  program_type    TEXT NOT NULL,
  status          TEXT DEFAULT 'active',
  start_date      TEXT DEFAULT (datetime('now')),
  end_date        TEXT,
  termination_reason TEXT,
  created_at      TEXT DEFAULT (datetime('now'))
);
