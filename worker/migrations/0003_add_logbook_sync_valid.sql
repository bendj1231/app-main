-- Add logbook_sync_valid column to profiles table
-- This column tracks whether the pilot has a valid external logbook provider sync
-- (e.g. MyFlightBook, LogTen Pro, ForeFlight) — distinct from manually entered total_flight_hours

ALTER TABLE profiles ADD COLUMN logbook_sync_valid INTEGER DEFAULT 0;

-- Index for fast filtering of pilots with synced logbooks
CREATE INDEX IF NOT EXISTS idx_profiles_logbook_sync ON profiles(logbook_sync_valid);
