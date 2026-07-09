-- Profile views tracking
-- Records when operators/recruiters view a pilot profile.
CREATE TABLE IF NOT EXISTS profile_views (
  id              TEXT PRIMARY KEY,
  pilot_id        TEXT NOT NULL,
  viewer_id       TEXT,
  viewer_type     TEXT,       -- 'operator', 'airline', 'recruiter', etc.
  viewer_name     TEXT,
  viewed_at       TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_profile_views_pilot ON profile_views(pilot_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_at ON profile_views(viewed_at);
