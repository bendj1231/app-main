# Production Deployment Guide

This guide provides step-by-step instructions for deploying the application to production with cookie-based authentication, Edge Functions, and comprehensive security measures.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [Edge Functions Deployment](#edge-functions-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Pre-Deployment Checklist](#pre-deployment-checklist)

---

## Prerequisites

### Required Accounts and Services

- **Supabase Project** (https://supabase.com)
  - Project URL and service role key
  - Database connection string
  - Storage buckets configured

- **Firebase Project** (optional, for legacy compatibility)
  - Firebase config credentials
  - Firestore database

- **Resend API Key** (for email services)
  - API key for transactional emails

- **Domain Name**
  - Custom domain for production
  - SSL certificate configured

### Local Development Tools

```bash
# Required CLI tools
npm install -g supabase
npm install -g vercel  # or your preferred hosting platform
```

---

## Environment Configuration

### 1. Supabase Environment Variables

Create a `.env.production` file in the project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Supabase Edge Functions (deployed via Supabase CLI)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Environment
ENVIRONMENT=production
DEBUG=false

# Email Service (Resend)
RESEND_API_KEY=your-resend-api-key

# Firebase (optional, for legacy compatibility)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 2. Edge Functions Environment Variables

Set these in Supabase Dashboard → Settings → Edge Functions:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ENVIRONMENT=production
DEBUG=false
RESEND_API_KEY=your-resend-api-key
```

### 3. Security Considerations

- **Never commit** `.env.production` to version control
- Use **environment-specific** keys (different from development)
- Rotate service role keys after deployment
- Enable **IP restrictions** on service role access if possible

---

## Database Setup

### 1. Enable Required Extensions

Connect to your Supabase database and run:

```sql
-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for encryption functions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

### 2. Create Rate Limiting Table

For database-backed rate limiting:

```sql
-- Create rate_limits table for distributed rate limiting
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  identifier TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  reset_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier);
CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_time ON rate_limits(reset_time);

-- Create upsert function
CREATE OR REPLACE FUNCTION upsert_rate_limit(
  p_identifier TEXT,
  p_max_requests INTEGER,
  p_window_ms INTEGER
) RETURNS VOID AS $$
BEGIN
  INSERT INTO rate_limits (identifier, count, reset_time)
  VALUES (p_identifier, 1, NOW() + (p_window_ms || ' milliseconds')::INTERVAL)
  ON CONFLICT (identifier) 
  DO UPDATE SET
    count = CASE
      WHEN rate_limits.reset_time < NOW() THEN 1
      ELSE rate_limits.count + 1
    END,
    reset_time = CASE
      WHEN rate_limits.reset_time < NOW() THEN NOW() + (p_window_ms || ' milliseconds')::INTERVAL
      ELSE rate_limits.reset_time
    END,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
```

### 3. Verify Core Tables

Ensure these tables exist (created via migrations):

```sql
-- Core user tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'pilot_licensure_experience', 'user_app_access', 'enrollments');

-- Expected output should show all 4 tables
```

### 4. Run Security Advisor Check

```bash
# Using Supabase CLI
supabase db diff --schema public
supabase gen types typescript --local
```

---

## Edge Functions Deployment

### 1. Install Supabase CLI (if not installed)

```bash
npm install -g supabase
```

### 2. Link to Supabase Project

```bash
cd /Users/bowler/Documents/apps/app-main
supabase link --project-ref your-project-ref
```

### 3. Deploy All Edge Functions

```bash
# Deploy all functions at once
supabase functions deploy

# Or deploy individual functions
supabase functions deploy auth-login
supabase functions deploy auth-signup
supabase functions deploy auth-logout
supabase functions deploy auth-refresh
supabase functions deploy auth-verify
supabase functions deploy delete-account
supabase functions deploy health-check
supabase functions deploy send-account-created-email
supabase functions deploy send-enrollment-email
```

### 4. Set Environment Variables for Functions

```bash
# Set environment variables for Edge Functions
supabase secrets set ENVIRONMENT=production
supabase secrets set DEBUG=false
supabase secrets set RESEND_API_KEY=your-resend-api-key
```

### 5. Verify Deployment

```bash
# List deployed functions
supabase functions list

# Test health check endpoint
curl https://your-project.supabase.co/functions/v1/health-check
```

### 6. Configure Function Permissions

In Supabase Dashboard → Edge Functions:

1. Go to each function
2. Set **JWT Verification** to:
   - `auth-login`: Disabled (handles auth)
   - `auth-signup`: Disabled (handles auth)
   - `auth-logout`: Disabled (handles auth)
   - `auth-refresh`: Disabled (handles auth)
   - `auth-verify`: Enabled (requires valid session)
   - `delete-account`: Enabled (requires valid session)
   - `health-check`: Disabled (public endpoint)
   - `send-*`: Disabled (internal use)

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Set environment variables in Vercel Dashboard
# Add all variables from Environment Configuration section
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to production
netlify deploy --prod

# Set environment variables in Netlify Dashboard
```

### Option 3: Custom Hosting (VPS/Cloud)

```bash
# Build the application
npm run build

# The build output will be in the 'dist' directory
# Deploy the 'dist' folder to your web server

# Example for Nginx:
# sudo cp -r dist/* /var/www/html/
# sudo systemctl reload nginx
```

### Build Configuration

Ensure `vite.config.ts` is configured for production:

```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
      },
    },
  },
  server: {
    port: 3000,
  },
})
```

---

## Post-Deployment Verification

### 1. Health Check

```bash
curl https://your-project.supabase.co/functions/v1/health-check
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "uptime": 123456,
  "checks": {
    "database": { "status": "healthy", "responseTime": 50 },
    "memory": { "status": "healthy", "usage": 0, "limit": 536870912 },
    "cache": { "status": "healthy", "entries": 0, "size": 0 }
  },
  "metrics": {
    "totalRequests": 0,
    "errorRate": 0,
    "avgResponseTime": 0
  }
}
```

### 2. Test Authentication Flow

**Test Signup:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/auth-signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "userData": {"fullName": "Test User"}
  }'
```

**Test Login:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/auth-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

**Test Session Verification:**
```bash
curl -X GET https://your-project.supabase.co/functions/v1/auth-verify \
  -H "Cookie: sb-access-token=your-token; csrf-token=your-csrf-token" \
  -H "X-CSRF-Token: your-csrf-token"
```

### 3. Verify Security Headers

```bash
curl -I https://your-domain.com
```

Check for these headers:
- `Content-Security-Policy`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security`
- `Referrer-Policy`

### 4. Check Database Security

Run Supabase Security Advisor:

```bash
# Via Supabase Dashboard
# Go to Database → Security → Run Security Advisor
```

Expected: 9/10 or 10/10 security rating

### 5. Monitor Initial Logs

```bash
# View Edge Function logs
supabase functions logs auth-login
supabase functions logs auth-signup
```

---

## Pre-Deployment Checklist

### Security

- [ ] All environment variables are set in production
- [ ] Service role keys are different from development
- [ ] CSRF protection is enabled on all auth endpoints
- [ ] Rate limiting is configured and tested
- [ ] Security headers are properly configured
- [ ] HTTPS is enforced (redirect HTTP to HTTPS)
- [ ] Database RLS policies are enabled
- [ ] API keys are not exposed in client-side code
- [ ] Firebase config uses production credentials (if used)

### Database

- [ ] All migrations have been applied
- [ ] Rate limiting table is created
- [ ] Required extensions are installed
- [ ] Security advisor shows 9/10+ rating
- [ ] Backup schedule is configured
- [ ] Connection pooling is enabled

### Edge Functions

- [ ] All 8 functions are deployed successfully
- [ ] JWT verification is correctly configured per function
- [ ] Environment variables are set for functions
- [ ] Health check returns healthy status
- [ ] Function logs are accessible

### Frontend

- [ ] Application builds without errors
- [ ] Environment variables are configured in hosting platform
- [ ] Build output is optimized (minified, no sourcemaps)
- [ ] Static assets are properly served
- [ ] Custom domain is configured with SSL

### Testing

- [ ] Health check endpoint responds correctly
- [ ] Signup flow works end-to-end
- [ ] Login flow works end-to-end
- [ ] Logout clears all cookies
- [ ] Token refresh works automatically
- [ ] CSRF tokens are validated
- [ ] Rate limiting prevents abuse
- [ ] Error handling returns appropriate messages

### Monitoring

- [ ] Log aggregation is configured
- [ ] Error tracking is set up (Sentry, etc.)
- [ ] Performance monitoring is enabled
- [ ] Uptime monitoring is configured
- [ ] Alert notifications are configured

### Documentation

- [ ] Runbook is created for common issues
- [ ] Rollback procedure is documented
- [ ] On-call rotation is established
- [ ] Emergency contacts are documented

---

## Rollback Procedure

If deployment fails or issues arise:

### 1. Edge Functions Rollback

```bash
# List function versions
supabase functions list

# Redeploy previous version (if versioned)
supabase functions deploy auth-login --version previous-version

# Or redeploy from local backup
supabase functions deploy
```

### 2. Frontend Rollback

**Vercel:**
```bash
vercel rollback
```

**Netlify:**
```bash
netlify rollback
```

**Custom:**
```bash
# Restore previous build from backup
sudo cp -r /backups/previous-dist/* /var/www/html/
```

### 3. Database Rollback

```bash
# Use Supabase Dashboard to restore from backup
# Or run rollback migration:
supabase db reset
```

---

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues and solutions.

---

## Support

For deployment issues:
- Check Supabase logs: Dashboard → Edge Functions → Logs
- Check database logs: Dashboard → Database → Logs
- Review security advisor: Dashboard → Database → Security
- Consult API documentation: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
