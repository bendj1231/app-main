-- Migration: Add profile image columns for Cloudinary uploads and editable social fields
-- NOTE: No-op in production because these columns were already added manually.
-- A future migration will recreate the table schema for new environments if needed.
SELECT 1;
