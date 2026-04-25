# Atlas Résumé Database Schema

This document describes the database schema for the Atlas Résumé Builder system.

## Tables

### 1. atlas_resumes

Stores user resume data in the standardized Atlas format.

```sql
CREATE TABLE atlas_resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  personal_info JSONB NOT NULL,
  summary TEXT,
  flight_hours JSONB NOT NULL,
  aircraft_types JSONB NOT NULL DEFAULT '[]'::jsonb,
  licenses JSONB NOT NULL DEFAULT '[]'::jsonb,
  ratings JSONB NOT NULL DEFAULT '[]'::jsonb,
  work_experience JSONB NOT NULL DEFAULT '[]'::jsonb,
  education JSONB NOT NULL DEFAULT '[]'::jsonb,
  certifications JSONB NOT NULL DEFAULT '[]'::jsonb,
  skills TEXT[] NOT NULL DEFAULT '{}',
  core_competencies TEXT[] NOT NULL DEFAULT '{}',
  template TEXT NOT NULL DEFAULT 'modern',
  target_role TEXT NOT NULL DEFAULT 'commercial',
  is_certified BOOLEAN NOT NULL DEFAULT false,
  certification_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_exported_at TIMESTAMPTZ,
  
  CONSTRAINT valid_template CHECK (template IN ('modern', 'classic', 'executive', 'technical')),
  CONSTRAINT valid_role CHECK (target_role IN ('commercial', 'cargo', 'private', 'corporate', 'charter'))
);

-- Indexes
CREATE INDEX idx_atlas_resumes_user_id ON atlas_resumes(user_id);
CREATE INDEX idx_atlas_resumes_certified ON atlas_resumes(is_certified) WHERE is_certified = true;
CREATE INDEX idx_atlas_resumes_target_role ON atlas_resumes(target_role);

-- RLS Policies
ALTER TABLE atlas_resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resumes"
  ON atlas_resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes"
  ON atlas_resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON atlas_resumes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
  ON atlas_resumes FOR DELETE
  USING (auth.uid() = user_id);

-- Public read access for certified resumes (for airline portal)
CREATE POLICY "Public can view certified resumes"
  ON atlas_resumes FOR SELECT
  USING (is_certified = true);
```

### 2. resume_analytics

Tracks resume views, downloads, shares, and applications.

```sql
CREATE TABLE resume_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES atlas_resumes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  views INTEGER NOT NULL DEFAULT 0,
  downloads INTEGER NOT NULL DEFAULT 0,
  shares INTEGER NOT NULL DEFAULT 0,
  applications INTEGER NOT NULL DEFAULT 0,
  airlines_viewed TEXT[] NOT NULL DEFAULT '{}',
  last_viewed_at TIMESTAMPTZ,
  last_downloaded_at TIMESTAMPTZ,
  last_shared_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT non_negative_analytics CHECK (
    views >= 0 AND downloads >= 0 AND shares >= 0 AND applications >= 0
  )
);

-- Indexes
CREATE INDEX idx_resume_analytics_user_id ON resume_analytics(user_id);
CREATE INDEX idx_resume_analytics_resume_id ON resume_analytics(resume_id);

-- RLS Policies
ALTER TABLE resume_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics"
  ON resume_analytics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics"
  ON resume_analytics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics"
  ON resume_analytics FOR UPDATE
  USING (auth.uid() = user_id);
```

### 3. resume_shares

Manages shareable resume links and access control.

```sql
CREATE TABLE resume_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES atlas_resumes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  share_token TEXT UNIQUE NOT NULL,
  share_url TEXT NOT NULL,
  expires_at TIMESTAMPTZ,
  is_public BOOLEAN NOT NULL DEFAULT false,
  allowed_airlines TEXT[] NOT NULL DEFAULT '{}',
  password TEXT,
  access_count INTEGER NOT NULL DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_share_token CHECK (LENGTH(share_token) >= 8),
  CONSTRAINT non_negative_access CHECK (access_count >= 0)
);

-- Indexes
CREATE INDEX idx_resume_shares_user_id ON resume_shares(user_id);
CREATE INDEX idx_resume_shares_resume_id ON resume_shares(resume_id);
CREATE INDEX idx_resume_shares_token ON resume_shares(share_token);
CREATE INDEX idx_resume_shares_expires_at ON resume_shares(expires_at) WHERE expires_at IS NOT NULL;

-- RLS Policies
ALTER TABLE resume_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own shares"
  ON resume_shares FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own shares"
  ON resume_shares FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shares"
  ON resume_shares FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own shares"
  ON resume_shares FOR DELETE
  USING (auth.uid() = user_id);

-- Public access for valid share tokens (via application logic)
CREATE POLICY "Public can access valid shares"
  ON resume_shares FOR SELECT
  USING (
    is_public = true 
    AND (expires_at IS NULL OR expires_at > NOW())
  );
```

### 4. resume_airline_applications

Tracks when pilots apply to airlines via the resume sharing system.

```sql
CREATE TABLE resume_airline_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES atlas_resumes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  airline_id TEXT NOT NULL,
  airline_name TEXT NOT NULL,
  share_id UUID REFERENCES resume_shares(id) ON DELETE SET NULL,
  application_status TEXT NOT NULL DEFAULT 'pending',
  status TEXT NOT NULL DEFAULT 'submitted',
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  
  CONSTRAINT valid_status CHECK (status IN ('submitted', 'viewed', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'))
);

-- Indexes
CREATE INDEX idx_resume_applications_user_id ON resume_airline_applications(user_id);
CREATE INDEX idx_resume_applications_resume_id ON resume_airline_applications(resume_id);
CREATE INDEX idx_resume_applications_airline_id ON resume_airline_applications(airline_id);
CREATE INDEX idx_resume_applications_status ON resume_airline_applications(status);

-- RLS Policies
ALTER TABLE resume_airline_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications"
  ON resume_airline_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications"
  ON resume_airline_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON resume_airline_applications FOR UPDATE
  USING (auth.uid() = user_id);

-- Airlines can view applications sent to them (via enterprise portal)
CREATE POLICY "Airlines can view applications"
  ON resume_airline_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enterprise_access
      WHERE enterprise_access.airline_id = resume_airline_applications.airline_id
    )
  );
```

## JSONB Structure Examples

### personal_info
```json
{
  "fullName": "John Smith",
  "email": "john@example.com",
  "phone": "+1 555-123-4567",
  "location": "New York, USA",
  "nationality": "American",
  "dateOfBirth": "1990-01-15",
  "languages": ["English", "Spanish"],
  "linkedin": "linkedin.com/in/johnsmith",
  "website": "johnsmith.com"
}
```

### flight_hours
```json
{
  "total": 2500,
  "pic": 1800,
  "sic": 700,
  "crossCountry": 1200,
  "night": 400,
  "ifr": 800,
  "multiEngine": 1500,
  "simulator": 200,
  "dualReceived": 500
}
```

### aircraft_types
```json
[
  {
    "manufacturer": "Airbus",
    "model": "A320",
    "typeRating": true,
    "hours": 1200,
    "lastFlown": "2024-01-15"
  }
]
```

## Migration Script

```sql
-- Run this migration to create all tables
-- This should be added to your Supabase migrations

-- Create tables in order (respecting foreign key dependencies)
CREATE TABLE IF NOT EXISTS atlas_resumes (...);
CREATE TABLE IF NOT EXISTS resume_analytics (...);
CREATE TABLE IF NOT EXISTS resume_shares (...);
CREATE TABLE IF NOT EXISTS resume_airline_applications (...);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_atlas_resumes_user_id ON atlas_resumes(user_id);
-- ... (all other indexes)

-- Enable RLS
ALTER TABLE atlas_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_airline_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
-- ... (all RLS policies from above)
```

## Notes

1. **Security**: All tables have Row Level Security (RLS) enabled to ensure users can only access their own data
2. **Performance**: Indexes are created on frequently queried columns (user_id, resume_id, status)
3. **Data Integrity**: Check constraints ensure valid values for enums and non-negative counts
4. **Audit Trail**: created_at and updated_at timestamps track when records are modified
5. **Cascade Deletes**: Foreign key relationships use ON DELETE CASCADE to clean up related records
6. **Public Access**: Certified resumes can be viewed publicly for airline portal integration
