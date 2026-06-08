/**
 * Migration: Create delete_intent_tokens table
 * 
 * Purpose: Enforce server-side passkey/MFA verification for account deletion
 * 
 * This table stores short-lived tokens issued after passkey verification.
 * The tokens must be included in the delete-account request to prove the user
 * successfully verified with their passkey/MFA device.
 * 
 * This prevents custom clients from bypassing passkey verification.
 */

-- Create delete_intent_tokens table
CREATE TABLE IF NOT EXISTS delete_intent_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE, -- cryptographically secure random token
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL, -- 5 minutes from creation
  consumed BOOLEAN NOT NULL DEFAULT false,
  consumed_at TIMESTAMPTZ,
  ip_address TEXT, -- track where token was issued from
  user_agent TEXT,
  CHECK (expires_at > created_at),
  CHECK (consumed = false OR consumed_at IS NOT NULL) -- if consumed, must have timestamp
);

-- Indexes for fast lookup
CREATE INDEX idx_delete_intent_tokens_user_id ON delete_intent_tokens(user_id);
CREATE INDEX idx_delete_intent_tokens_expires_at ON delete_intent_tokens(expires_at);
CREATE INDEX idx_delete_intent_tokens_consumed ON delete_intent_tokens(consumed);

-- Cleanup policy: Remove expired/consumed tokens after 24 hours
CREATE OR REPLACE FUNCTION cleanup_delete_intent_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM delete_intent_tokens
  WHERE (consumed = true AND consumed_at < now() - interval '1 hour')
     OR (expires_at < now() - interval '1 hour');
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (via cron job in Edge Function)
-- For now, just document it for manual execution:
-- SELECT cleanup_delete_intent_tokens();

-- RLS: Only service role can create/read/delete tokens
ALTER TABLE delete_intent_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manage delete intent tokens"
  ON delete_intent_tokens
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

REVOKE SELECT, INSERT, UPDATE, DELETE ON delete_intent_tokens FROM authenticated;
