CREATE TABLE IF NOT EXISTS rate_limits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_identifier TEXT NOT NULL,
  action TEXT NOT NULL,
  request_date TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_identifier, action, request_date)
);
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup ON rate_limits(user_identifier, action, request_date);
