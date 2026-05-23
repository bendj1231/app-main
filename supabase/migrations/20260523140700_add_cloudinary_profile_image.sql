-- Migration: Add Cloudinary profile image support
-- Uses Cloudinary's free tier for image storage (zero cost)

-- Add column for Cloudinary public_id (needed for image management)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS profile_image_public_id TEXT;

-- Remove encrypted flag if it was added (not needed for Cloudinary)
ALTER TABLE profiles 
DROP COLUMN IF EXISTS profile_image_encrypted;

COMMENT ON COLUMN profiles.profile_image_url IS 
'Profile image URL from Cloudinary. Uses Cloudinary free tier (25GB storage, 25GB bandwidth).';

COMMENT ON COLUMN profiles.profile_image_public_id IS 
'Cloudinary public_id for the profile image. Used for image management and transformations.';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_cloudinary 
ON profiles(profile_image_public_id) 
WHERE profile_image_public_id IS NOT NULL;
