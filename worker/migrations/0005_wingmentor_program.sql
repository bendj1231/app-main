-- Wingmentor Program Database Schema
-- Target: New D1 database for program enrollments, progress, and related features
-- This replaces Supabase tables: enrollments, program_progress, logbook_hour_tokens,
-- interview_assessments, atlas_resumes, mentor_profiles, meetings, events, daily_quotes

-- ============================================================
-- ENROLLMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS enrollments (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL,                        -- profiles.id (Auth0 user)
  program_name    TEXT NOT NULL,                        -- 'Foundational', 'Transition', 'ATPL', etc.
  enrollment_status TEXT DEFAULT 'active',               -- 'active', 'completed', 'paused', 'withdrawn'
  onboarding_data   TEXT,                                -- JSON: responses to onboarding questions
  enrolled_at       TEXT DEFAULT (datetime('now')),
  completed_at      TEXT,
  updated_at        TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_program ON enrollments(program_name);
CREATE INDEX idx_enrollments_status ON enrollments(enrollment_status);

-- ============================================================
-- PROGRAM PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS program_progress (
  id                      TEXT PRIMARY KEY,
  user_id                 TEXT NOT NULL,
  program_type            TEXT NOT NULL,                -- 'Foundational', 'Transition', 'ATPL'
  completion_percentage   INTEGER DEFAULT 0,            -- 0-100
  modules_completed       TEXT,                        -- JSON array of completed module IDs
  total_modules           INTEGER DEFAULT 3,
  status                  TEXT DEFAULT 'not_started',  -- 'not_started', 'in_progress', 'completed'
  start_date              TEXT,
  expected_completion     TEXT,
  last_activity_at        TEXT DEFAULT (datetime('now')),
  created_at              TEXT DEFAULT (datetime('now')),
  updated_at              TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_program_progress_user ON program_progress(user_id);
CREATE INDEX idx_program_progress_type ON program_progress(program_type);
CREATE INDEX idx_program_progress_status ON program_progress(status);

-- ============================================================
-- PROGRAM MODULES (static content definitions)
-- ============================================================
CREATE TABLE IF NOT EXISTS program_modules (
  id              TEXT PRIMARY KEY,
  program_type    TEXT NOT NULL,                        -- 'Foundational', 'Transition'
  module_number   INTEGER NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  content_url     TEXT,                                 -- R2 or external URL
  estimated_hours INTEGER DEFAULT 1,
  is_required     INTEGER DEFAULT 1,
  prerequisites   TEXT,                                 -- JSON array of module IDs
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_program_modules_program ON program_modules(program_type);
CREATE INDEX idx_program_modules_number ON program_modules(module_number);

-- ============================================================
-- LOGBOOK HOUR TOKENS (verification attestation)
-- ============================================================
CREATE TABLE IF NOT EXISTS logbook_hour_tokens (
  id                  TEXT PRIMARY KEY,
  pilot_id            TEXT NOT NULL,
  issuer_name         TEXT NOT NULL,                    -- ATO / flight school name
  total_hours         REAL DEFAULT 0,
  pic_hours           REAL DEFAULT 0,
  aircraft_type       TEXT,
  period_from         TEXT,                             -- ISO date
  period_to           TEXT,                             -- ISO date
  verification_level  TEXT DEFAULT 'basic',            -- 'basic', 'detailed', 'audit'
  attestation_token   TEXT NOT NULL UNIQUE,             -- cryptographic proof
  status              TEXT DEFAULT 'active',           -- 'active', 'revoked', 'expired'
  revoked_at          TEXT,
  revoked_reason      TEXT,
  created_at          TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_logbook_tokens_pilot ON logbook_hour_tokens(pilot_id);
CREATE INDEX idx_logbook_tokens_status ON logbook_hour_tokens(status);
CREATE INDEX idx_logbook_tokens_token ON logbook_hour_tokens(attestation_token);

-- ============================================================
-- INTERVIEW ASSESSMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS interview_assessments (
  id                      TEXT PRIMARY KEY,
  pilot_id                TEXT NOT NULL,
  interviewer_id          TEXT,                         -- employee/admin auth0_id
  overall_score           INTEGER,                    -- 0-100
  overall_grade           TEXT,                         -- 'A', 'B', 'C', etc.
  technical_knowledge_score INTEGER,
  communication_score       INTEGER,
  decision_making_score     INTEGER,
  strengths               TEXT,                         -- JSON array
  areas_for_improvement   TEXT,                         -- JSON array
  detailed_feedback       TEXT,
  recommendation          TEXT DEFAULT 'pending',      -- 'strong_hire', 'hire', 'consider', 'reject'
  assessment_date           TEXT,
  created_at              TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_interview_assessments_pilot ON interview_assessments(pilot_id);
CREATE INDEX idx_interview_assessments_interviewer ON interview_assessments(interviewer_id);

-- ============================================================
-- ATLAS RESUMES (structured pilot CV)
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_resumes (
  id              TEXT PRIMARY KEY,
  pilot_id        TEXT NOT NULL UNIQUE,
  resume_data     TEXT,                                -- JSON: structured resume fields
  markdown_text   TEXT,                              -- formatted markdown version
  html_version    TEXT,                              -- rendered HTML
  is_public       INTEGER DEFAULT 0,
  view_count      INTEGER DEFAULT 0,
  last_updated    TEXT DEFAULT (datetime('now')),
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_atlas_resumes_pilot ON atlas_resumes(pilot_id);

-- ============================================================
-- MENTOR PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS mentor_profiles (
  id              TEXT PRIMARY KEY,
  auth0_id        TEXT NOT NULL UNIQUE,
  email           TEXT NOT NULL,
  display_name    TEXT,
  first_name      TEXT,
  last_name       TEXT,
  bio             TEXT,
  specialties     TEXT,                                -- JSON array: ['ATPL', 'Multi-Engine']
  airline         TEXT,
  years_experience INTEGER,
  hourly_rate     INTEGER,                            -- cents
  is_active       INTEGER DEFAULT 1,
  max_mentees     INTEGER DEFAULT 5,
  profile_image_url TEXT,
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_mentor_profiles_auth0 ON mentor_profiles(auth0_id);
CREATE INDEX idx_mentor_profiles_active ON mentor_profiles(is_active);

-- ============================================================
-- MEETINGS (mentorship / coaching sessions)
-- ============================================================
CREATE TABLE IF NOT EXISTS meetings (
  id              TEXT PRIMARY KEY,
  mentor_id       TEXT NOT NULL,                      -- mentor_profiles.id
  pilot_id        TEXT NOT NULL,                      -- profiles.id
  meeting_type     TEXT DEFAULT 'mentorship',          -- 'mentorship', 'interview', 'review'
  scheduled_at    TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status          TEXT DEFAULT 'scheduled',           -- 'scheduled', 'in_progress', 'completed', 'cancelled'
  notes           TEXT,
  recording_url   TEXT,
  feedback_submitted INTEGER DEFAULT 0,
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_meetings_mentor ON meetings(mentor_id);
CREATE INDEX idx_meetings_pilot ON meetings(pilot_id);
CREATE INDEX idx_meetings_status ON meetings(status);
CREATE INDEX idx_meetings_scheduled ON meetings(scheduled_at);

-- ============================================================
-- EVENTS (program events, workshops, webinars)
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  description     TEXT,
  event_type      TEXT DEFAULT 'webinar',             -- 'webinar', 'workshop', 'seminar', 'graduation'
  start_date      TEXT NOT NULL,
  end_date        TEXT,
  start_time      TEXT,
  end_time        TEXT,
  timezone        TEXT DEFAULT 'UTC',
  location        TEXT,                                -- physical or 'virtual'
  meeting_link    TEXT,
  max_attendees   INTEGER,
  speaker_ids     TEXT,                                -- JSON array of mentor/auth0 IDs
  program_type    TEXT,                                -- 'Foundational', 'All'
  status          TEXT DEFAULT 'upcoming',            -- 'upcoming', 'ongoing', 'completed', 'cancelled'
  created_by      TEXT,                                -- admin auth0_id
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start ON events(start_date);
CREATE INDEX idx_events_program ON events(program_type);

-- ============================================================
-- EVENT REGISTRATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS event_registrations (
  id              TEXT PRIMARY KEY,
  event_id        TEXT NOT NULL,
  pilot_id        TEXT NOT NULL,
  registration_status TEXT DEFAULT 'registered',     -- 'registered', 'attended', 'no_show', 'cancelled'
  attended_at     TEXT,
  feedback_rating INTEGER,
  feedback_comment TEXT,
  created_at      TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE INDEX idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_pilot ON event_registrations(pilot_id);

-- ============================================================
-- DAILY QUOTES (motivational content for dashboard)
-- ============================================================
CREATE TABLE IF NOT EXISTS daily_quotes (
  id              TEXT PRIMARY KEY,
  quote           TEXT NOT NULL,
  author          TEXT,
  category        TEXT DEFAULT 'general',             -- 'general', 'aviation', 'leadership'
  display_date    TEXT,                                -- optional: show on specific date
  is_active       INTEGER DEFAULT 1,
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_daily_quotes_active ON daily_quotes(is_active);

-- ============================================================
-- MENTOR-MENTEE RELATIONSHIPS
-- ============================================================
CREATE TABLE IF NOT EXISTS mentorship_assignments (
  id              TEXT PRIMARY KEY,
  mentor_id       TEXT NOT NULL,
  pilot_id        TEXT NOT NULL,
  program_type    TEXT NOT NULL,
  status          TEXT DEFAULT 'active',            -- 'active', 'completed', 'terminated'
  start_date      TEXT DEFAULT (datetime('now')),
  end_date        TEXT,
  termination_reason TEXT,
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_mentorship_mentor ON mentorship_assignments(mentor_id);
CREATE INDEX idx_mentorship_pilot ON mentorship_assignments(pilot_id);
CREATE INDEX idx_mentorship_status ON mentorship_assignments(status);

-- ============================================================
-- SEED DATA: Program Modules (Foundational)
-- ============================================================
INSERT OR IGNORE INTO program_modules (id, program_type, module_number, title, description, estimated_hours, is_required) VALUES
  ('mod_f01', 'Foundational', 1, 'Career Assessment & Goal Setting', 'Define your aviation career path and set measurable goals', 2, 1),
  ('mod_f02', 'Foundational', 2, 'License & Medical Requirements', 'Understand EASA, FAA, and CAAP licensing pathways', 3, 1),
  ('mod_f03', 'Foundational', 3, 'Flight Hours Building Strategy', 'Plan efficient hour-building for CPL/ATPL requirements', 2, 1),
  ('mod_f04', 'Foundational', 4, 'Airline Interview Preparation', 'Mock interviews, CV building, and assessment prep', 4, 1);

-- ============================================================
-- SEED DATA: Daily Quotes
-- ============================================================
INSERT OR IGNORE INTO daily_quotes (id, quote, author, category) VALUES
  ('dq_01', 'The only way to do great work is to love what you do.', 'Steve Jobs', 'general'),
  ('dq_02', 'A good pilot is always learning.', 'Unknown', 'aviation'),
  ('dq_03', 'Leadership is not about being in charge. It is about taking care of those in your charge.', 'Simon Sinek', 'leadership');
