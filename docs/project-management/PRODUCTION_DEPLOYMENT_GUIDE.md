# Production Deployment Guide

This guide provides step-by-step instructions for deploying the application to production with cookie-based authentication, Cloudflare Workers, D1 databases, and comprehensive security measures.

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

- **Cloudflare Account** (https://cloudflare.com)
  - Workers & Pages enabled
  - D1 databases created: `pilotrecognition-profiles`, `pilotrecognition-d1`, `pilotrecognition-reference-data`, `recognition-plus-trace`, `wingmentor-program`
  - R2 buckets configured (if using object storage)

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
npm install -g wrangler  # Cloudflare CLI
```

---

## Environment Configuration

### 1. Environment Variables

Create a `.env.production` file in the project root:

```bash
# Worker API endpoints (public — safe for frontend)
VITE_PILOT_API_URL=https://pilotrecognition-api.benjamintigerbowler.workers.dev
VITE_PLATFORM_API_URL=https://platform-api.benjamintigerbowler.workers.dev

# Auth0 (public config)
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=your-auth0-audience

# Stripe (public key only)
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

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

### 2. Cloudflare Worker Secrets

Set encrypted secrets via Wrangler:

```bash
cd worker
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put EMAIL_API_SECRET
npx wrangler secret put OPENROUTER_API_KEY
npx wrangler secret put MFA_ENCRYPTION_KEY
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put DODO_API_KEY
npx wrangler secret put VEREMARK_WEBHOOK_SECRET

cd ../cloudflare
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put DODO_API_KEY
npx wrangler secret put VEREMARK_WEBHOOK_SECRET
npx wrangler secret put CLOUDINARY_API_SECRET
npx wrangler secret put CLOUDFLARE_R2_SECRET_ACCESS_KEY
```

### 3. Security Considerations

- **Never commit** `.env.production` to version control
- Use **environment-specific** keys (different from development)
- Rotate Worker secrets after deployment
- Enable **Access policies** on sensitive routes if needed

---

## Database Setup

### 1. Apply D1 Migrations

The project uses Cloudflare D1 (SQLite). Apply migrations to each database:

```bash
# Profiles database
cd worker
npx wrangler d1 migrations apply pilotrecognition-profiles --remote

# Ops database
cd ../cloudflare
npx wrangler d1 migrations apply pilotrecognition-d1 --remote

# Reference data database
npx wrangler d1 migrations apply pilotrecognition-reference-data --remote

# Trace database
npx wrangler d1 migrations apply recognition-plus-trace --remote

# Wingmentor program database
npx wrangler d1 migrations apply wingmentor-program --remote
```

### 2. Verify Core Tables

Ensure these tables exist in each D1 database:

```bash
npx wrangler d1 execute pilotrecognition-profiles --remote --command "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('profiles', 'flight_hours', 'pilot_credentials', 'pilot_notifications');"

npx wrangler d1 execute pilotrecognition-d1 --remote --command "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('admin_emails', 'messages', 'support_enquiries', 'ai_usage_log');"
```

### 3. Run Schema Diff Check

```bash
npx wrangler d1 migrations list pilotrecognition-profiles --remote
npx wrangler d1 migrations list pilotrecognition-d1 --remote
```

---

## Cloudflare Workers Deployment

### 1. Install Wrangler (if not installed)

```bash
npm install -g wrangler
```

### 2. Deploy Pilot Worker

```bash
cd /Users/bowler/Documents/apps/app-main/worker
npx wrangler deploy
```

### 3. Deploy Platform Worker

```bash
cd /Users/bowler/Documents/apps/app-main/cloudflare
npx wrangler deploy
```

### 4. Set Worker Secrets

```bash
cd /Users/bowler/Documents/apps/app-main/worker
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put EMAIL_API_SECRET
npx wrangler secret put OPENROUTER_API_KEY
npx wrangler secret put MFA_ENCRYPTION_KEY
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put DODO_API_KEY
npx wrangler secret put VEREMARK_WEBHOOK_SECRET

cd /Users/bowler/Documents/apps/app-main/cloudflare
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put DODO_API_KEY
npx wrangler secret put VEREMARK_WEBHOOK_SECRET
npx wrangler secret put CLOUDINARY_API_SECRET
npx wrangler secret put CLOUDFLARE_R2_SECRET_ACCESS_KEY
```

### 5. Verify Deployment

```bash
# Test pilot worker health endpoint
curl https://pilotrecognition-api.benjamintigerbowler.workers.dev/api/health

# Test platform worker health endpoint
curl https://platform-api.benjamintigerbowler.workers.dev/api/health
```

---

## Frontend Deployment

### Option 1: Cloudflare Pages (Recommended)

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to production
wrangler pages deploy dist --project-name=<your-cloudflare-pages-project>

# Set environment variables in Cloudflare Pages Dashboard
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
# Pilot Worker health check
curl https://pilotrecognition-api.benjamintigerbowler.workers.dev/api/health

# Platform Worker health check
curl https://platform-api.benjamintigerbowler.workers.dev/api/health
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

Authentication is handled by Auth0. Test via the frontend or Auth0 dashboard:

```bash
# Verify Auth0 domain is reachable
curl https://<your-auth0-domain>/.well-known/openid-configuration

# Test Worker API with a valid Auth0 token
curl -H "Authorization: Bearer <your-access-token>" \
  https://pilotrecognition-api.benjamintigerbowler.workers.dev/api/getDashboardData
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

Review Cloudflare D1 security:

```bash
# Via Cloudflare Dashboard
# Go to Workers & Pages → D1 → Your Database → Settings
```

Ensure:
- D1 databases are only accessible via Workers
- No direct SQL access from outside the Cloudflare network
- Worker bindings are correctly configured

### 5. Monitor Initial Logs

```bash
# View Worker logs
npx wrangler tail --name pilotrecognition-api
npx wrangler tail --name platform-api

# View Pages deployment logs
wrangler pages deployment tail --project-name=<your-project>
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

### 1. Cloudflare Workers Rollback

```bash
# List Worker versions and roll back via dashboard
npx wrangler deployments list --name pilotrecognition-api
npx wrangler deployments list --name platform-api

# Or redeploy previous commit
cd worker && npx wrangler deploy
cd ../cloudflare && npx wrangler deploy
```

### 2. Frontend Rollback

**Cloudflare Pages:**
```bash
wrangler pages deployment list --project-name=<your-project>
wrangler pages deployment tail --project-name=<your-project>
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
# D1 does not have a direct reset. Restore from a backup or reapply migrations:
npx wrangler d1 export pilotrecognition-profiles --remote --output=backup.sql
npx wrangler d1 migrations list pilotrecognition-profiles --remote
```

---

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues and solutions.

---

## Support

For deployment issues:
- Check Cloudflare Worker logs: Dashboard → Workers & Pages → Logs
- Check D1 database logs: Dashboard → Workers & Pages → D1 → Your Database
- Review security settings: Dashboard → Account → Security
- Consult API documentation: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
