-- Migration: Add profile image columns for Cloudinary uploads and editable social fields
ALTER TABLE profiles ADD COLUMN profile_image_url TEXT;
ALTER TABLE profiles ADD COLUMN profile_image_public_id TEXT;
ALTER TABLE profiles ADD COLUMN bio TEXT;
ALTER TABLE profiles ADD COLUMN linkedin_url TEXT;
ALTER TABLE profiles ADD COLUMN instagram_url TEXT;
ALTER TABLE profiles ADD COLUMN domicile TEXT;
