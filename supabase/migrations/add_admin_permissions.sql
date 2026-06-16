-- Add granular admin permissions system
-- Run this in Supabase SQL Editor

-- Add admin_permissions column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS admin_permissions JSONB DEFAULT '{}';

-- Define permission structure:
-- {
--   "pilots": { "view": true, "edit": true, "delete": false, "verify": false },
--   "enterprises": { "view": true, "edit": false, "delete": false },
--   "objectives": { "view": true, "edit": true, "delete": false },
--   "events": { "view": true, "edit": true, "delete": false },
--   "settings": { "view": true, "edit": false },
--   "audit_log": { "view": false }
-- }

-- Set default permissions for existing admins (full access)
UPDATE public.profiles
SET admin_permissions = '{
  "pilots": { "view": true, "edit": true, "delete": true, "verify": true },
  "enterprises": { "view": true, "edit": true, "delete": true },
  "objectives": { "view": true, "edit": true, "delete": true },
  "events": { "view": true, "edit": true, "delete": true },
  "settings": { "view": true, "edit": true },
  "audit_log": { "view": true }
}'::jsonb
WHERE role IN ('super_admin', 'admin') AND admin_permissions = '{}';

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_admin_permissions ON public.profiles USING GIN (admin_permissions);

-- Add comments
COMMENT ON COLUMN public.profiles.admin_permissions IS 'Granular admin permissions as JSONB. Keys: pilots, enterprises, objectives, events, settings, audit_log. Each has: view, edit, delete, verify (pilots only)';
