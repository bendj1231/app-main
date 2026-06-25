--- Migration number: 0002
--- Add referred_by_code and referred_by_profile_id to profiles for referral tracking

ALTER TABLE profiles ADD COLUMN referred_by_code TEXT;
ALTER TABLE profiles ADD COLUMN referred_by_profile_id TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_referred_by_code ON profiles(referred_by_code);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by_profile_id ON profiles(referred_by_profile_id);
