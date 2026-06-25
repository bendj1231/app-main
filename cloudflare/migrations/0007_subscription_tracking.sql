--- Migration number: 0007
--- Subscription tracking with renewal logic

CREATE TABLE IF NOT EXISTS subscriptions (
  id              TEXT PRIMARY KEY,
  subscriber_type TEXT NOT NULL,
  subscriber_id   TEXT NOT NULL,
  tier            TEXT NOT NULL,
  status          TEXT DEFAULT 'active',
  billing_cycle   TEXT DEFAULT 'monthly',
  amount_cents    INTEGER DEFAULT 0,
  currency        TEXT DEFAULT 'USD',
  payment_provider TEXT,
  provider_subscription_id TEXT,
  current_period_start TEXT,
  current_period_end   TEXT,
  cancel_at_period_end INTEGER DEFAULT 0,
  trial_end       TEXT,
  renewal_count   INTEGER DEFAULT 0,
  metadata        TEXT,
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_subscriber ON subscriptions(subscriber_type, subscriber_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end ON subscriptions(current_period_end);
CREATE INDEX IF NOT EXISTS idx_subscriptions_provider ON subscriptions(provider_subscription_id);
