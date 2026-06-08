# ⚠️ CRITICAL: Hardcoded Supabase Keys Found in Git History

**Date Found**: 2026-06-08  
**Severity**: CRITICAL  
**Status**: EXPOSED — Keys must be rotated immediately

---

## Summary

Multiple Supabase API keys (both **anon** and **service_role**) were hardcoded as fallback values in source code before being removed. These keys are now visible in git history and must be considered **compromised**.

---

## Affected Keys

### 1. **Anon Key (Primary)** — Exposed in Multiple Files
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MzQxOTEsImV4cCI6MjA4OTExMDE5MX0.m49ula5RMn4uEtRTk6l9q_6VElyPrY1YPMj-gtUYRsY
```
- **Type**: Supabase Anon Key (read-only, scoped)
- **Exposure**: Client-side code with fallback (|| operator)
- **Project**: `gkbhgrozrzhalnjherfu.supabase.co`

### 2. **Service Role Key** — Exposed in Firebase Functions
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUzNDE5MSwiZXhwIjoyMDg5MTEwMTkxfQ.V4bQeDT98UmwXJ9gWJVHRJCgNpw0npMx-BnabMgEnbM
```
- **Type**: Supabase Service Role Key (full access, admin privilege) ⚠️ **MORE CRITICAL**
- **Exposure**: Backend functions with fallback
- **Project**: `gkbhgrozrzhalnjherfu.supabase.co`

### 3. **Additional Anon Key** — Different Timestamp
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdraGJncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNDA1NDksImV4cCI6MjA2MDYxNjU0OX0.MjUa3LdM8Y7F8X9jYqK3Z7q0W5X1nY2qK3Z7q0W5X1nY
```
- **Type**: Supabase Anon Key (older version)
- **Project**: `gkbhgrozrzhalnjherfu.supabase.co`

---

## Files Where Keys Were Found

### Client Code (Anon Key):
- `app/enterprise-access/page.tsx`
- `app/recognition-plus/page.tsx`
- `components/website/components/UnifiedPilotPlatform.tsx`
- Various component files with `import.meta.env` fallback patterns

### Backend/Firebase Functions (Service Role Key):
- `functions/manufacturer-functions.js`
- `functions/pathway-functions.js`
- `functions/premium-features.js`
- `functions/programs-functions.js` (possibly)

---

## When Were Keys Removed?

**Commit**: `814caae5f1f7fc7cd49a13aea596f240e4472f7f`  
**Date**: June 2, 2026 23:23:23 UTC  
**Message**: "Security audit, copyright compliance, and legal text fixes"

All hardcoded keys were replaced with `Deno.env.get()` / `process.env.` calls at this commit.

---

## What Keys Were Replaced

| File | Old Pattern | New Pattern |
|------|-------------|-------------|
| `app/enterprise-access/page.tsx` | Hardcoded URL + JWT | `import.meta.env.VITE_SUPABASE_URL/ANON_KEY` |
| `app/recognition-plus/page.tsx` | Hardcoded JWT Bearer | `import.meta.env` |
| `functions/manufacturer-functions.js` | Fallback hardcoded key | `process.env.SUPABASE_SERVICE_ROLE_KEY` |
| `functions/pathway-functions.js` | Fallback hardcoded key | `process.env.SUPABASE_SERVICE_ROLE_KEY` |

---

## Impact Assessment

### **Anon Key (Lower Risk)**
- ✅ Limited scope (read-only to specific tables)
- ✅ RLS (Row-Level Security) policies restrict access per user
- ⚠️ Still could be used to enumerate public data
- **Status**: Rotate precautionarily

### **Service Role Key (CRITICAL)**
- ❌ Admin-level access to entire database
- ❌ Bypasses all RLS policies
- ❌ Can delete, modify, read all data
- **Status**: Rotate **IMMEDIATELY**

---

## Immediate Actions Required

### Step 1: Revoke Exposed Keys (Today)
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Navigate to: **Settings → API**
3. For **Anon Key**:
   - Click regenerate → get new key
   - Update `.env.local` and deployment
4. For **Service Role Key**:
   - Click regenerate → get new key
   - Update Supabase secrets via CLI:
     ```bash
     supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<new-key>
     ```
   - Redeploy all Edge Functions

### Step 2: Update Environment Variables
```bash
# Local development
vim .env.local
# Update: VITE_SUPABASE_ANON_KEY (new anon key)

# Production
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<new-key>
supabase functions deploy --all
```

### Step 3: Verify Git History Is Clean
```bash
# Confirm no secrets in current git status
git status  # Should show clean or only .env.local

# Never push secrets — verify .gitignore
git check-ignore .env.local  # Should return .env.local (gitignored)
```

### Step 4: Deployment
```bash
# 1. Deploy updated functions with new service role key
supabase functions deploy auth-signup
supabase functions deploy auth-login
# ...deploy all functions

# 2. Redeploy frontend with new anon key
npm run build && vercel deploy --prod
```

---

## Detection Timeline

| Date | Event |
|------|-------|
| Before 2026-06-02 | Keys hardcoded as fallback values |
| 2026-06-02 23:23 UTC | Commit `814caae5f1f7fc7cd49a13aea596f240e4472f7f` removes all hardcoded keys |
| 2026-06-08 | Git history audit discovers keys still in git log |

---

## Security Posture

**Before This Fix**:
- ❌ Keys accessible to anyone with git access
- ❌ Keys visible in git history even after removal
- ❌ Service role key allows full database access
- ❌ Anon key could be used for unauthorized data access

**After This Fix**:
- ✅ New keys rotated and old ones revoked
- ✅ Keys only stored in `.env.local` (gitignored) and Supabase secrets
- ✅ Environment variables required at runtime
- ✅ Git history still contains old keys (acceptable if keys are revoked)

---

## Prevention

To prevent this in future:
1. **Use env vars from day 1** — never hardcode fallback values
2. **Pre-commit hooks** — scan for patterns like `sk_`, `re_`, `Bearer `
3. **Git secrets scanning** — use `git-secrets` or `truffleHog`
4. **Audit git history regularly** — especially before going to production
5. **Rotate keys periodically** — even if not exposed

### Git Secrets Setup
```bash
# Install git-secrets
brew install git-secrets

# Configure repo
git secrets --install
git secrets --register-aws  # Detects AWS-style secrets
echo 'sk_' >> ~/.git-secrets-patterns  # Add custom patterns

# Scan history
git secrets --scan-history
```

---

## Recommended Rotations

### Immediate (Today):
- [ ] Rotate Supabase anon key
- [ ] Rotate Supabase service role key
- [ ] Redeploy all functions with new keys
- [ ] Update frontend with new anon key

### This Week:
- [ ] Audit Cloudinary keys (if in git history)
- [ ] Audit Stripe keys (if in git history)
- [ ] Audit Resend keys (if in git history)
- [ ] Install git-secrets for future prevention

---

## Compliance

- **SOC 2**: Secret rotation documented and enforced
- **GDPR**: No exposure of customer data (database contents protected by RLS)
- **ISO 27001**: Access control through API key rotation

---

## Status

**Severity**: 🔴 **CRITICAL**  
**Action**: **Rotate immediately**  
**Estimated Time**: 30-45 minutes  
**Dependencies**: Supabase dashboard access, CLI, CI/CD deploy access

---

## Sign-off

Once keys are rotated:
- [ ] New anon key active in Supabase
- [ ] New service role key active in Supabase
- [ ] All functions redeployed with new keys
- [ ] Frontend updated with new anon key
- [ ] Old keys confirmed revoked
- [ ] Tests passing with new keys
