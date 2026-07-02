-- Admin Email Management + Inbound Email Storage
-- Maps from Supabase: admin_emails, received_emails
-- Target D1: pilotrecognition-d1 (DB_OPS binding)

-- Admin emails: drafts, pending review, sent, rejected
CREATE TABLE IF NOT EXISTS admin_emails (
  id              TEXT PRIMARY KEY,
  recipient       TEXT NOT NULL,
  subject         TEXT NOT NULL,
  body            TEXT NOT NULL,
  status          TEXT DEFAULT 'draft',                -- 'draft', 'pending_review', 'sent', 'reviewed', 'rejected'
  author_id       TEXT,                                 -- auth0_id of the employee who drafted
  reviewer_id     TEXT,                                 -- auth0_id of the director who approved/rejected
  category        TEXT DEFAULT 'Airlines',             -- Airlines, ATOs, Operators, etc.
  review_notes    TEXT,
  resend_message_id TEXT,
  sent_at         TEXT,
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_admin_emails_status ON admin_emails(status);
CREATE INDEX idx_admin_emails_author ON admin_emails(author_id);
CREATE INDEX idx_admin_emails_created ON admin_emails(created_at);
CREATE INDEX idx_admin_emails_category ON admin_emails(category);

-- Received emails: inbound emails captured via Resend webhook
CREATE TABLE IF NOT EXISTS received_emails (
  id              TEXT PRIMARY KEY,
  to_email        TEXT NOT NULL,
  from_email      TEXT NOT NULL,
  from_name       TEXT,
  subject         TEXT,
  body            TEXT,
  resend_email_id TEXT,
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_received_emails_to ON received_emails(to_email);
CREATE INDEX idx_received_emails_created ON received_emails(created_at);
