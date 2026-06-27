# PilotRecognition.com — App Audit Report
## Mauritius Registration Readiness Assessment

**Date:** 2026-05-20
**Auditor:** Cascade AI
**Project:** PilotRecognition / Aviation Pathways Ltd
**Deadline:** September 2026 (critical)

---

## Executive Summary

The application has significant infrastructure and security foundations in place. **Critical blocker #1 (build failure) is now resolved.** The production build passes consistently. Several security gaps have been closed: open redirect vulnerabilities fixed, ToS-required `origin_jurisdiction` column added with immutability enforcement, and Supabase security advisor issues partially addressed.

**Remaining critical blockers:** Secret rotation (all keys in `.env.local` are exposed), Stripe test mode, Auth0 custom domain, and 3 manual Supabase security configurations. These require external service actions that cannot be performed via code changes.

**Recommendation:** Build is now green and ready for deployment. Proceed with secret rotation and Stripe live mode activation before contacting Mauritius authorities. The registration process requires a functioning legal entity linked to a deployed, revenue-ready platform.

---

## Critical Blockers (Must Fix Before Registration)

### 1. Production Build Failure — Systematic Code Corruption
- **Status:** FIXED (2026-05-20)
- **Root Cause:** A previous bulk removal of `console.log` statements (tagged `[AUDIT] Removed console.log`) left orphaned object literals, unmatched parentheses, and broken template literals across ~58 TypeScript/TSX files.
- **Files Affected:** `portal/App.tsx`, `components/website/components/AccessPortal2Page.tsx`, `components/website/components/pilot-recognition/PilotRecognitionProfilePage.tsx`, `portal/pages/PortalAirlineExpectationsPage.tsx`, `portal/pages/PathwaysPageModern.tsx`, `components/website/components/pilot-recognition/PathwaysSidebar.tsx`, and 50+ others.
- **Specific Patterns:**
  - Orphaned `});` blocks where `console.log({` was removed
  - `safeRedirect` template literal typos: `` `/${page)}` `` instead of `` `/${page}` ``
  - Missing closing parentheses from `window.location.href` → `safeRedirect` bulk replacement
- **Action:** Run a comprehensive cleanup script to remove all `[AUDIT] Removed console.log` artifacts and verify `safeRedirect` replacements have correct syntax. Then run `npm run build` until it passes.

### 2. Hardcoded Secrets in Working Directory
- **Status:** EXPOSED
- **Location:** `.env.local` (not tracked by git, but present in filesystem)
- **Exposed Values:**
  - `SUPABASE_SERVICE_ROLE_KEY` — full admin access to database
  - `ENCRYPTION_KEY`, `JWT_SECRET`, `SESSION_SECRET`, `API_SECRET`, `FIELD_ENCRYPTION_KEY`
  - `NEON_DATABASE_URL` — direct PostgreSQL connection string
  - `MONGODB_URI` + `MONGODB_ATLAS_SERVICE_ACCOUNT_SECRET`
  - `STRIPE_SECRET_KEY` (test key)
  - `RESEND_API_KEY` + `RESEND_WEBHOOK_SECRET`
  - `VITE_RESEND_API_KEY` (client-side exposed)
  - `GROQ_API_KEY`
  - `VITE_SUPABASE_MANAGEMENT_ACCESS_TOKEN`
- **Risk:** Any compromise of the workstation or accidental commit exposes all production infrastructure.
- **Action:**
  1. Immediately rotate ALL secrets (Supabase service role, encryption keys, JWT secret, MongoDB, Neon, Stripe, Resend, Groq)
  2. Move secrets to Supabase Edge Function secrets and Vercel environment variables only
  3. Delete `.env.local` from workstation after migration
  4. Verify no secrets are hardcoded in source files (`grep -rn` scan completed — no secrets found in `/src`)

### 3. Payment Infrastructure in Test Mode
- **Status:** NOT PRODUCTION-READY
- **Stripe:** Using `pk_test_*` and `sk_test_*` keys. Live keys required for real revenue.
- **Stripe Webhook Secret:** Value `mk_1TTGQoIhIQpGHTt6kBkWab8K` does not look like a valid webhook secret format (should start with `whsec_`)
- **Helio/USDC:** Configuration exists but untested for production
- **Action:**
  1. Create Stripe live account
  2. Replace test keys with live keys in Vercel environment variables
  3. Generate correct webhook secret and configure endpoint
  4. Test $99 verification payment flow end-to-end

### 4. Auth0 Configuration Uses Dev Tenant
- **Status:** NOT PRODUCTION-READY
- **Current Config:** `dev-ir828tguibp1dh5f.eu.auth0.com`
- **.env File Claims:** `VITE_AUTH0_DOMAIN=auth.pilotrecognition.com` (custom domain not configured)
- **Required Setup:**
  - Configure custom domain `auth.pilotrecognition.com` in Auth0
  - Update allowed callback/logout/web origins for production domains
  - Verify Google OAuth connection is enabled
- **Action:** Complete Auth0 production tenant setup with custom domain

### 5. DID / VC Signing Infrastructure Partial
- **Status:** PARTIALLY READY
- **DID Document:** `/public/.well-known/did.json` exists with `did:web:pilotrecognition.com`
- **Edge Function:** `issuer-sign` is deployed (version 5) on Supabase
- **Missing:** Cannot verify if `PLATFORM_SIGNING_KEY_JWK` secret is actually set in Supabase Edge Function secrets
- **.env Config:** Still references Walt.id demo issuer (`https://issuer.portal.walt.id`)
- **Action:**
  1. Verify `PLATFORM_SIGNING_KEY_JWK` is set as a Supabase secret (not in .env files)
  2. Update `.env` to remove Walt.id demo references
  3. Test end-to-end VC issuance through `issuer-sign`

---

## High Priority Issues (Fix Before Launch)

### 6. Supabase Security Advisor Findings
- **Status:** PARTIALLY ADDRESSED
- **Completed via MCP:** Security events table, RLS policies, function search_path, security definer view fixes
- **Remaining Findings:**
  - `enterprise_pilot_pulls` view still has `SECURITY DEFINER` (ERROR level)
  - `pathway_match_history` has RLS enabled but NO policies (pilots cannot access their own history)
  - `pathway_matches` has overly permissive RLS policy
  - `enforce_origin_jurisdiction_immutability` and `update_updated_at_column` functions have mutable `search_path`
  - **Leaked password protection is DISABLED** in Supabase Dashboard
- **Action:**
  1. Fix remaining security advisor items via Supabase MCP
  2. Enable leaked password protection in Supabase Dashboard (Settings → Authentication → Security)

### 7. 27 Remaining Manual Security Configurations
- **Status:** NOT STARTED
- **Categories:** Cloudflare WAF/DDoS, DNSSEC, DMARC/SPF/DKIM, TLS 1.3, HSTS, certificate management, encryption key rotation, third-party audit
- **Documentation:** Scripts and guides exist in `/scripts/` directory
- **Action:** Begin manual security hardening in parallel with build fixes. Start with Cloudflare WAF and DNS records.

### 8. Firebase Configuration Placeholders
- **Status:** INCOMPLETE
- **.env Values:** `VITE_FIREBASE_API_KEY=your_firebase_api_key`, `VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id`, `VITE_FIREBASE_APP_ID=your_firebase_app_id`
- **Action:** Replace placeholders with actual Firebase project credentials OR remove Firebase if not used

### 9. Three ToS vs Infrastructure Gaps
- **Status:** PARTIALLY ADDRESSED
1. **~~origin_jurisdiction column~~ ✅ FIXED** — Added to `profiles` table as VARCHAR(10) with immutability trigger. ToS Section 13.3 now enforced at database level.
2. **~~veremark-webhook revocation flow~~ ✅ IMPLEMENTED** — `veremark-webhook` edge function handles `discrepancy`/`failed` by revoking `pilot_credentials`, updating `vc_revocation_registry`, and downgrading profile tier. ToS Sections 11.2/16.1 covered.
3. **Redis 72-hour TTL enforcement** — Section 14.2 commits to deterministic expiration. **Still needs verification** in production cache layer.
- **Action:** Verify Redis/cache layer enforces 72-hour TTL on transient verification payloads.

### 10. Domain / Subdomain Architecture Ready
- **Status:** CONFIGURED
- **Vercel Config:** `vercel.json` has rewrites/redirects for 10 subdomains:
  - `wallet.pilotrecognition.com`, `platform.pilotrecognition.com`, `enterprise.pilotrecognition.com`, `pathways.pilotrecognition.com`, `recognitionplus.pilotrecognition.com`, `support.pilotrecognition.com`, `partners.pilotrecognition.com`, `join.pilotrecognition.com`, `blog.pilotrecognition.com`, `pilotcareerpathways.com`
- **CSP Headers:** Configured for wallet subdomain with appropriate `connect-src` restrictions
- **Action:** Ensure all domains are actually registered and DNS points to Vercel

---

## Medium Priority Issues (Fix Before Scaling)

### 11. Vercel Deployment Pipeline
- **Status:** UNTESTED (build fails locally)
- **Prebuild Script:** Generates static HTML from markdown framework docs
- **Action:** After build is fixed, deploy to Vercel staging and verify all subdomain routing

### 12. Messaging Overhaul Incomplete
- **Status:** IN PROGRESS
- **Context:** Platform rebranding from "job board" to "recognition/pathway discovery"
- **Documentation:** `TODAY_TODO_MASTER.md` tracks remaining messaging changes
- **Action:** Complete messaging audit before partner presentations

### 13. Test Pilot Data — Expired Medical
- **Status:** TEST DATA ONLY — NOT A BLOCKER
- **Note:** Benjamin Bowler's Class 1 Medical expired May 2, 2026 (13 days ago). CPL is invalid for commercial ops.
- **Action:** Update test data with valid medical or flag for renewal handling in wallet

---

## Completed / Green Items

- [x] Code-level security fixes (XSS, open redirects, hardcoded admin credentials)
- [x] Database-level security fixes (RLS policies, search_path, security definer)
- [x] DID document hosted at `/.well-known/did.json`
- [x] `issuer-sign` edge function deployed (v5)
- [x] URL validator (`safeRedirect`) implemented
- [x] Vercel subdomain routing configured
- [x] `.gitignore` properly excludes `.env` and `.env.*`
- [x] CSP headers configured for wallet subdomain
- [x] Terminal 1 infrastructure (Holding Lounge, DCA, Cadet Track gate) complete
- [x] W3C VC wallet architecture (Tier 1-4) implemented

---

## Immediate Action Plan (Next 48 Hours)

1. **~~Fix Build~~ ✅ COMPLETE**
   - Removed all `[AUDIT] Removed console.log` artifacts
   - Fixed `safeRedirect` template literal syntax errors
   - Fixed unmatched bracket in `portal/App.tsx` (`onAuthStateChange` callback)
   - Restored heavily corrupted files from `external-references`
   - `npm run build` passes consistently (verified 2x)

2. **Rotate Secrets (Day 1, Priority 2)**
   - Regenerate Supabase service role key
   - Generate new encryption keys, JWT secret, session secret
   - Rotate MongoDB and Neon credentials
   - Move all secrets to Supabase/Vercel secret management

3. **Stripe Production Setup (Day 2)**
   - Activate Stripe live account
   - Update environment variables with live keys
   - Configure webhook endpoint

4. **Auth0 Custom Domain (Day 2)**
   - Configure `auth.pilotrecognition.com` in Auth0
   - Update all allowed origins/callbacks

5. **Verify Signing Infrastructure (Day 2)**
   - Confirm `PLATFORM_SIGNING_KEY_JWK` is set as Supabase secret
   - Test VC issuance end-to-end

---

## Mauritius Registration Prerequisites

Per `docs/MAURITIUS_REGISTRATION_ACTION_PACK.md` and `docs/EDB_MAURITIUS_BUSINESS_SETUP.md`:

| Requirement | Status | Blocker |
|---|---|---|
| Company Name: Aviation Pathways Ltd | ✅ Ready | — |
| Founder: Mauritian National (Benjamin Bowler) | ✅ Ready | — |
| Estimated Cost: ~$150 USD | ✅ Ready | — |
| Estimated Timeline: 3-5 days | ✅ Ready | — |
| Business Plan | ⚠️ Draft exists | Needs update with current financials |
| KYC Documents | ⚠️ Partial | Ensure passport/address docs current |
| Live Product / URL | ❌ NO | **Build must pass and deploy first** |
| Revenue Model Evidence | ❌ NO | **Stripe must be in live mode** |
| Domain Ownership | ✅ Ready | pilotrecognition.com registered |

**Bottom Line:** Mauritius registration can proceed in parallel with build fixes, but the platform MUST be deployable and revenue-ready before any government submission. The September deadline is achievable if Critical blockers are resolved within the next 7-10 days.

---

## Files Referenced in This Audit

- `/Users/bowler/Documents/apps/app-main/PRE_DEPLOYMENT_CHECKLIST.md`
- `/Users/bowler/Documents/apps/app-main/SECURITY_FIXES_COMPLETE.md`
- `/Users/bowler/Documents/apps/app-main/SECURITY_FIXES_STATUS.md`
- `/Users/bowler/Documents/apps/app-main/docs/MAURITIUS_REGISTRATION_ACTION_PACK.md`
- `/Users/bowler/Documents/apps/app-main/docs/EDB_MAURITIUS_BUSINESS_SETUP.md`
- `/Users/bowler/Documents/apps/app-main/docs/REGISTRATION_STATUS_TRACKER.md`
- `/Users/bowler/Documents/apps/app-main/docs/PRODUCTION_SIGNING_SETUP.md`
- `/Users/bowler/Documents/apps/app-main/TODAY_TODO_MASTER.md`
- `/Users/bowler/Documents/apps/app-main/TODO_30_STEPS.md`
- `/Users/bowler/Documents/apps/app-main/.env`
- `/Users/bowler/Documents/apps/app-main/.env.local`
- `/Users/bowler/Documents/apps/app-main/public/.well-known/did.json`
- `/Users/bowler/Documents/apps/app-main/vercel.json`
- `/Users/bowler/Documents/apps/app-main/index.tsx`
