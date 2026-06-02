-- Migration: Add origin_jurisdiction column to profiles
-- ToS Section 13.3 compliance — immutable on UUIDv4 provisioning
-- Deployed: 02 June 2026

-- Add the column (nullable initially for existing rows)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS origin_jurisdiction VARCHAR(2) DEFAULT 'XX';

-- Add comment for documentation
COMMENT ON COLUMN profiles.origin_jurisdiction IS
  'ISO 3166-1 alpha-2 country code set once at account creation via edge-level IP geofencing. Immutable per ToS Section 13.3. XX = unknown/unresolved.';

-- Index for compliance queries
CREATE INDEX IF NOT EXISTS idx_profiles_origin_jurisdiction
ON profiles(origin_jurisdiction);

-- Add origin_jurisdiction to existing profiles where NULL
UPDATE profiles
SET origin_jurisdiction = 'XX'
WHERE origin_jurisdiction IS NULL;

-- Verify
SELECT 
  COUNT(*) as total_profiles,
  COUNT(origin_jurisdiction) as with_jurisdiction,
  origin_jurisdiction,
  COUNT(*) as count
FROM profiles
GROUP BY origin_jurisdiction
ORDER BY count DESC;
