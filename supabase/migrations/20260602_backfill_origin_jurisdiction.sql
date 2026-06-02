-- Migration: Backfill origin_jurisdiction and enforce immutability
-- ToS Section 13.3 enforcement — prevents modification after initial provisioning
-- Created: 02 June 2026

-- Step 1: Attempt to backfill origin_jurisdiction for existing 'XX' profiles
-- from their earliest user_activity_log entry (IP-based geolocation record)
UPDATE profiles p
SET origin_jurisdiction = COALESCE(
  (
    SELECT DISTINCT ON (user_id) 
      CASE 
        WHEN details->>'country' IS NOT NULL AND details->>'country' != '' 
        THEN UPPER(LEFT(details->>'country', 2))
        WHEN details->>'origin_jurisdiction' IS NOT NULL 
        THEN UPPER(LEFT(details->>'origin_jurisdiction', 2))
        ELSE NULL
      END
    FROM user_activity_log
    WHERE user_id = p.id
      AND created_at IS NOT NULL
    ORDER BY created_at ASC
    LIMIT 1
  ),
  p.origin_jurisdiction
)
WHERE p.origin_jurisdiction = 'XX';

-- Step 2: Make column non-nullable to enforce presence
ALTER TABLE profiles
ALTER COLUMN origin_jurisdiction SET NOT NULL;

-- Step 3: Create function to enforce immutability (ToS Section 13.3)
CREATE OR REPLACE FUNCTION enforce_origin_jurisdiction_immutable()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow setting from NULL/XX during initial backfill
  IF OLD.origin_jurisdiction = 'XX' OR OLD.origin_jurisdiction IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Block any change after initial set
  IF NEW.origin_jurisdiction IS DISTINCT FROM OLD.origin_jurisdiction THEN
    RAISE EXCEPTION 'origin_jurisdiction is immutable per ToS Section 13.3. Cannot change from % to %', 
      OLD.origin_jurisdiction, NEW.origin_jurisdiction;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Attach trigger
DROP TRIGGER IF EXISTS trg_enforce_origin_jurisdiction ON profiles;
CREATE TRIGGER trg_enforce_origin_jurisdiction
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION enforce_origin_jurisdiction_immutable();

-- Step 5: Verify counts
SELECT 
  origin_jurisdiction,
  COUNT(*) as profile_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM profiles
GROUP BY origin_jurisdiction
ORDER BY profile_count DESC;
