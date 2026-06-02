-- Migration: API Rate Limits Table
-- Created: June 2, 2026
-- Purpose: Distributed rate limiting for Edge Functions across multiple instances

-- ============================================
-- API RATE LIMITS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS api_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL,  -- e.g., "pull-api:{user_id}"
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    request_count INTEGER NOT NULL DEFAULT 1,
    
    -- Index for efficient cleanup
    CONSTRAINT api_rate_limits_identifier_created_idx UNIQUE (identifier, created_at)
);

-- Index for fast lookups
CREATE INDEX idx_api_rate_limits_identifier ON api_rate_limits(identifier);
CREATE INDEX idx_api_rate_limits_created_at ON api_rate_limits(created_at);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only service role can access rate limit data
CREATE POLICY "service_role_only" ON api_rate_limits
    FOR ALL
    USING (current_setting('role', true) = 'service_role');

-- ============================================
-- CLEANUP FUNCTION (Run every hour)
-- ============================================

-- Create a function to clean up old rate limit entries
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete rate limit entries older than 1 hour
    DELETE FROM api_rate_limits
    WHERE created_at < now() - interval '1 hour';
END;
$$;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE api_rate_limits IS 'Distributed rate limiting storage for Edge Functions. Stores request counts per identifier within time windows.';
COMMENT ON COLUMN api_rate_limits.identifier IS 'Rate limit key, typically "{endpoint}:{user_id}" format';
COMMENT ON COLUMN api_rate_limits.created_at IS 'Timestamp of the request, used for window calculations';
COMMENT ON COLUMN api_rate_limits.request_count IS 'Number of requests in this entry (usually 1)';

-- ============================================
-- DEPLOYMENT NOTES
-- ============================================

-- This table should be cleaned up regularly to prevent unbounded growth.
-- Options:
-- 1. Set up a cron job to call cleanup_old_rate_limits() every hour
-- 2. Use pg_cron extension if available
-- 3. Add TTL logic in application code

-- Example cron setup (if pg_cron is enabled):
-- SELECT cron.schedule('cleanup-rate-limits', '0 * * * *', 'SELECT cleanup_old_rate_limits()');
