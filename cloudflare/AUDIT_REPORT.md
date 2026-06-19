# Cloudflare Migration — Comprehensive Audit Report

**Date:** 2025-06-19  
**Auditor:** AI Code Review  
**Scope:** `cloudflare/schema.sql`, `cloudflare/worker.ts`, `cloudflare/wrangler.toml`, `src/lib/d1-api.ts`, `MIGRATION_GUIDE.md` vs existing codebase

> **UPDATE (June 19, 2026):** All individual endpoints have been refactored into a single `POST /api` action router with batch support. See `worker.ts` comment block and `src/lib/d1-api.ts` for the current API. Webhooks (`/api/webhooks/dodo`, `/api/webhooks/veremark`) and health check (`/api/health`) remain separate.

---

## Executive Summary

| Category | Status |
|----------|--------|
| **Schema** | 75% complete — missing forum, notifications, and advanced business tables |
| **Worker API** | 60% complete — basic CRUD covered, missing wallet/VC/referral endpoints |
| **Frontend Library** | 70% complete — missing wallet/VC/referral helpers, outdated guide |
| **Security** | 65% complete — JWT auth works, but no rate limiting, input validation, or SQL injection protection |
| **Migration Guide** | 80% complete — needs webhook testing section and Supabase fallback strategy |

**Recommendation:** Deploy schema + Worker for core profile/bookmark flows first. Wallet/VC/forum endpoints are Phase 2.

---

## 1. SCHEMA AUDIT

### 1.1 Tables That Exist ✅

| Table | Status | Notes |
|-------|--------|-------|
| `profiles` | ✅ | All fields from codebase covered |
| `pilot_licensure_experience` | ✅ | All fields covered |
| `recognition_scores` | ✅ | All fields covered |
| `user_bookmarks` | ✅ | All fields covered |
| `pilot_passkeys` | ✅ | `public_key` stored as BLOB |
| `pilot_dids` | ✅ | `public_key_jwk` stored as TEXT JSON |
| `payments` | ✅ | Tax fields for Mauritius compliance |
| `referrals` | ✅ | Basic referral tracking |
| `webhook_events` | ✅ | Audit trail + replay support |
| `api_rate_limits` | ✅ | Table exists but unused in Worker |
| `enterprise_profiles` | ✅ | Basic fields |
| `admin_notifications` | ✅ | Admin inbox |
| `admin_audit_log` | ✅ | Action logging |
| `user_activity_log` | ✅ | Activity tracking |
| `pilot_credentials` | ✅ | Added after review |
| `airlines` | ✅ | Reference data |
| `aircraft_type_ratings` | ✅ | Reference data |

### 1.2 Tables MISSING from Schema ❌

| Table | Source File | Impact |
|-------|-------------|--------|
| `forum_categories` | `20260530_psa_forum_system.sql` | Community forum broken |
| `forum_topics` | `20260530_psa_forum_system.sql` | Community forum broken |
| `forum_posts` | `20260530_psa_forum_system.sql` | Community forum broken |
| `forum_reactions` | `20260530_psa_forum_system.sql` | Community forum broken |
| `forum_topic_views` | `20260530_psa_forum_system.sql` | Community forum broken |
| `delete_intent_tokens` | `20260608_delete_intent_tokens.sql` | GDPR deletion broken |
| `notification_queue` | `20260519_ato_activation_credits.sql` | Notification system broken |
| `match_agreements` | `20260601_recognition_fee_infrastructure.sql` | Recognition fee broken |
| `recognition_fee_invoices` | `20260601_recognition_fee_infrastructure.sql` | Invoicing broken |
| `daily_quotes` | `20260617_daily_quotes_and_team_updates.sql` | Dashboard broken |
| `team_updates` | `20260617_daily_quotes_and_team_updates.sql` | Dashboard broken |
| `employee_objectives` | `20260617_create_employee_objectives.sql` | Admin dashboard broken |
| `referral_conversions` | AuthContext.tsx line 745 | Referral credit tracking broken |
| `referral_partners` | AuthContext.tsx line 745 | Partner tracking broken |

### 1.3 Schema Field Mismatches ⚠️

| Issue | Location | Fix |
|-------|----------|-----|
| `pilot_credentials` uses `user_id` but wallet.ts uses `profile_id` | `schema.sql:343` | Either rename column or update wallet.ts queries |
| `profiles.id` used in AuthContext queries but Worker only has `auth0_id` lookup | `AuthContext.tsx:1538` | Add `GET /api/profile?id=xxx` endpoint |
| `wallet_email` in D1 schema but some edge functions may use different field | Check edge functions | Verify field names match |

---

## 2. WORKER API AUDIT

### 2.1 Endpoints That Exist ✅

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/api/health` | GET | None | ✅ |
| `/api/profile` | GET | JWT | ✅ (by auth0_id) |
| `/api/profile` | POST | JWT | ✅ (creates from JWT) |
| `/api/profile/:id` | PATCH | JWT | ✅ (self or admin) |
| `/api/licensure/:user_id` | GET | JWT | ✅ |
| `/api/licensure` | POST | JWT | ✅ |
| `/api/licensure/:user_id` | PATCH | JWT | ✅ |
| `/api/recognition/:user_id` | GET | JWT | ✅ |
| `/api/recognition` | POST | JWT | ✅ |
| `/api/bookmarks` | GET | JWT | ✅ |
| `/api/bookmarks` | POST | JWT | ✅ |
| `/api/bookmarks/:id` | DELETE | JWT | ✅ |
| `/api/payments` | GET | JWT | ✅ |
| `/api/payments` | POST | JWT | ✅ |
| `/api/admin/pilots` | GET | JWT + admin | ✅ |
| `/api/webhooks/dodo` | POST | Secret | ✅ |
| `/api/webhooks/veremark` | POST | Secret | ✅ |

### 2.2 Endpoints MISSING ❌

| Endpoint | Needed By | Priority |
|----------|-----------|----------|
| `GET /api/profile?id=xxx` | AuthContext.tsx line 1538 | **HIGH** |
| `GET /api/profile/me` | Frontend "get my profile" | **HIGH** |
| `DELETE /api/profile/:id` | GDPR delete account | MEDIUM |
| `POST /api/passkeys` | wallet.ts line 54 | **HIGH** |
| `POST /api/dids` | wallet.ts line 87 | **HIGH** |
| `POST /api/credentials` | wallet.ts line 280 | **HIGH** |
| `GET /api/credentials?user_id=xxx` | Wallet display | **HIGH** |
| `POST /api/referrals` | referral.ts | MEDIUM |
| `GET /api/referrals?referrer_id=xxx` | referral.ts | MEDIUM |
| `POST /api/activity-log` | auditLog.ts | MEDIUM |
| `POST /api/rate-limit/check` | Security middleware | MEDIUM |
| `GET /api/enterprise` | Enterprise dashboard | LOW |
| `POST /api/enterprise` | Enterprise signup | LOW |

### 2.3 Security Issues in Worker

| Severity | Issue | Location | Exploit Scenario |
|----------|-------|----------|------------------|
| **HIGH** | No input validation/sanitization | All POST/PATCH endpoints | Malicious JSON could break queries |
| **HIGH** | SQL injection via dynamic SET clause | `worker.ts:282`, `351` | Attacker injects SQL via field names |
| **HIGH** | `subscription_tier` self-upgrade | `worker.ts:270` | User patches own profile to `pro` without paying |
| **MEDIUM** | No rate limiting enforcement | All endpoints | DDoS / brute force |
| **MEDIUM** | `ensureProfile` trusts `body.email` | `worker.ts:247` | User could create profile with someone else's email |
| **MEDIUM** | No request size limits | All endpoints | Large payload could exhaust memory |
| **MEDIUM** | No Content-Type enforcement | Webhook endpoints | Could receive non-JSON and crash |
| **LOW** | CORS allows any origin | `worker.ts:158` | CSRF if Auth0 token is intercepted |
| **LOW** | Webhook HMAC format uncertain | `worker.ts:472` | Dodo signature may be hex, not base64 |

### 2.4 Bugs in Worker

| Severity | Bug | Location | Fix |
|----------|-----|----------|-----|
| **HIGH** | `updated_at` never set on PATCH | `worker.ts:282` | Add `updated_at = datetime('now')` to SET clause |
| **HIGH** | `fetchProfileById` calls non-existent endpoint | `d1-api.ts:212` | Add `GET /api/profile?id=xxx` or remove helper |
| **MEDIUM** | `ensureProfile` doesn't set `created_at` explicitly | `worker.ts:191` | Add `created_at` to INSERT |
| **MEDIUM** | Webhook error doesn't update `error_message` | `worker.ts:515` | Set `error_message` in webhook_events table |
| **LOW** | `health` check doesn't actually verify DB | `worker.ts:212` | Run a real `SELECT 1` query |

---

## 3. FRONTEND LIBRARY AUDIT (`src/lib/d1-api.ts`)

### 3.1 Functions That Work ✅

| Function | Correct Signature |
|----------|-----------------|
| `getProfile(token, auth0Id)` | ✅ |
| `createProfile(token, data)` | ✅ |
| `updateProfile(token, profileId, updates)` | ✅ |
| `getLicensure(token, userId)` | ✅ |
| `createLicensure(token, data)` | ✅ |
| `updateLicensure(token, userId, updates)` | ✅ |
| `getRecognitionScore(token, userId)` | ✅ |
| `saveRecognitionScore(token, data)` | ✅ |
| `getBookmarks(token, userId)` | ✅ |
| `addBookmark(token, data)` | ✅ |
| `removeBookmark(token, bookmarkId)` | ✅ |
| `getPayments(token, userId)` | ✅ |
| `getAllPilots(token)` | ✅ |

### 3.2 Functions MISSING ❌

| Function | Needed By | Priority |
|----------|-----------|----------|
| `getProfileById(token, userId)` | AuthContext.tsx | **HIGH** |
| `getMe(token)` | Frontend "my profile" | **HIGH** |
| `createPasskey(token, data)` | wallet.ts | **HIGH** |
| `getPasskeys(token, userId)` | wallet.ts | **HIGH** |
| `createDid(token, data)` | wallet.ts | **HIGH** |
| `getDid(token, auth0Id)` | wallet.ts | **HIGH** |
| `createCredential(token, data)` | wallet.ts | **HIGH** |
| `getCredentials(token, userId)` | wallet.ts | **HIGH** |
| `createReferral(token, data)` | referral.ts | MEDIUM |
| `getReferrals(token, referrerId)` | referral.ts | MEDIUM |
| `logActivity(token, data)` | auditLog.ts | MEDIUM |

### 3.3 Issues in d1-api.ts

| Issue | Impact | Fix |
|-------|--------|-----|
| `healthCheck()` has no token param | Could fail if Worker adds auth | Add optional token or keep no-auth |
| No retry logic | Supabase client had `authRetry` | Add exponential backoff |
| `fetchAPI` returns `unknown` | No type safety | Add generic `<T>` return type |

---

## 4. MIGRATION GUIDE AUDIT

### 4.1 Issues Found

| Issue | Location | Fix |
|-------|----------|-----|
| Step 8 references old sessionStorage pattern | `MIGRATION_GUIDE.md:115` | Update to `getAccessTokenSilently()` pattern |
| Step 9 mapping missing `accessToken` param | `MIGRATION_GUIDE.md:155-165` | Update all examples to include token |
| No webhook testing instructions | Missing | Add curl examples for webhook testing |
| No fallback strategy | Missing | Document "keep Supabase as backup" approach |
| No mention of lost features | Missing | Add section: "What You Lose (Realtime, Storage)" |
| No D1 limits warning | Missing | Add: "500MB storage, 1K writes/day on free tier" |
| `npx supabase db dump` won't work for D1 | `MIGRATION_GUIDE.md:186` | Add custom export script |

---

## 5. CROSS-CHECK VS EXISTING CODEBASE

### 5.1 Supabase Queries in AuthContext.tsx

| Line | Query | Worker Equivalent | Status |
|------|-------|-----------------|--------|
| 373 | `profiles.update(enc).eq('id', userId)` | `PATCH /api/profile/:id` | ✅ |
| 385 | `pilot_licensure_experience.update(enc).eq('user_id', userId)` | `PATCH /api/licensure/:userId` | ✅ |
| 745 | `referral_conversions.upsert(...)` | **MISSING** | ❌ |
| 1538 | `profiles.select().eq('id', userId).maybeSingle()` | **MISSING** (only auth0_id) | ❌ |
| 1552 | `pilot_licensure_experience.select().eq('user_id', userId).maybeSingle()` | `GET /api/licensure/:userId` | ✅ |

### 5.2 Supabase Queries in wallet.ts

| Line | Query | Worker Equivalent | Status |
|------|-------|-----------------|--------|
| 54 | `pilot_passkeys.upsert(...)` | **MISSING** | ❌ |
| 87 | `pilot_dids.upsert(...)` | **MISSING** | ❌ |
| 96 | `profiles.update({wallet_id...}).eq('id', profileId)` | `PATCH /api/profile/:id` | ✅ |
| 280 | `pilot_credentials.insert(...)` | **MISSING** | ❌ |
| 380 | `pilot_credentials.insert(...)` | **MISSING** | ❌ |

### 5.3 Supabase Edge Functions (60 total)

The Worker currently replaces ~17 endpoints. **43 edge functions still need Worker endpoints.**

**Phase 1 (Critical):** wallet-create, wallet-provision, passkey-challenge, passkey-verify, vc-vault-key, vc-status, vc-revoke, verify-token  
**Phase 2 (Business):** pilot-pull-api, match-pathway, recognition-score, enterprise-access, enterprise-upgrade, commission-manager, payout-manager  
**Phase 3 (Nice to have):** ai-coaching, metrics-dashboard, betteraviationjobs-sync, data-export, google-calendar-meeting  
**Never migrate:** cloudinary-upload, cloudinary-delete, r2-presign-upload (call directly from frontend)

---

## 6. SECURITY AUDIT

### 6.1 Authentication ✅

| Check | Status |
|-------|--------|
| JWT signature verification | ✅ (RS256 via JWKS) |
| Token expiration check | ✅ |
| Bearer prefix required | ✅ |
| Admin role enforcement | ✅ (super_admin check) |
| JWKS caching (24hr) | ✅ |

### 6.2 Authorization ⚠️

| Check | Status | Issue |
|-------|--------|-------|
| Users can only update own profile | ✅ | Checks `auth0_id` match |
| Users cannot read other profiles | ❌ | `GET /api/profile?auth0_id=xxx` allows any ID |
| Users cannot self-elevate tier | ❌ | `subscription_tier` in allowed fields |
| Webhooks require secret | ✅ | But signature format uncertain |

### 6.3 Data Integrity ❌

| Check | Status | Issue |
|-------|--------|-------|
| Input validation | ❌ | No Zod or manual checks |
| SQL injection protection | ❌ | Dynamic `SET ${sets.join(', ')}` |
| Request size limits | ❌ | No Content-Length check |
| Rate limiting | ❌ | Table exists but unused |
| Request timeouts | ❌ | No timeout handling |

### 6.4 Webhook Security ⚠️

| Check | Status | Issue |
|-------|--------|-------|
| Payload stored before processing | ✅ | Replay possible |
| Signature verified | ✅ | But format may be wrong |
| Idempotency | ⚠️ | No check for duplicate event IDs |
| Error handling | ✅ | try/catch around DB ops |

---

## 7. MISSING SUPABASE FEATURES

| Feature | Supabase Has | D1/Worker Replacement | Effort |
|---------|-----------|----------------------|--------|
| Realtime subscriptions | ✅ | None — need polling or SSE | HIGH |
| Row Level Security (RLS) | ✅ | JWT auth in Worker | MEDIUM |
| File Storage (buckets) | ✅ | Cloudflare R2 | MEDIUM |
| Edge Functions (60) | ✅ | Worker endpoints (17 done) | HIGH |
| Auth (OAuth, MFA) | ✅ | Auth0 (kept) | N/A |
| Database backups | ✅ | D1 automatic backups | N/A |
| pg_cron jobs | ✅ | Cloudflare Cron Triggers | LOW |
| Full-text search | ✅ | SQLite FTS5 (not in schema) | MEDIUM |
| PostGIS/geo | ✅ | Not needed | N/A |

---

## 8. PRIORITIZED FIX LIST

### Blockers (Deploy Nothing Until Fixed)

1. **Add `updated_at` to PATCH queries** — `worker.ts` lines 282, 351
2. **Remove `subscription_tier` from user-updatable fields** — `worker.ts` line 270
3. **Add input validation to all POST/PATCH endpoints** — Reject unknown fields, validate types
4. **Fix SQL injection in dynamic SET clauses** — Use parameterized column whitelist
5. **Add `GET /api/profile?id=xxx` endpoint** — AuthContext uses ID lookup

### Critical (Fix Before Production)

6. **Add wallet endpoints:** passkeys, DIDs, credentials
7. **Add `GET /api/profile/me` endpoint** — Convenience for frontend
8. **Add rate limiting middleware** — Read/write limits per user
9. **Enforce request size limits** — 1MB max JSON body
10. **Add `created_at` to `ensureProfile` INSERT**
11. **Fix webhook signature format** — Test with real Dodo payload
12. **Update MIGRATION_GUIDE.md** — Remove sessionStorage references, add token param

### Medium (Fix Before Full Launch)

13. Add forum tables to schema
14. Add delete_intent_tokens table (GDPR)
15. Add referral endpoints to Worker
16. Add activity-log endpoint
17. Add enterprise profile endpoints
18. Add `health` DB connectivity check
19. Add retry logic to `d1-api.ts`
20. Add generic `<T>` type to `fetchAPI`

### Low (Nice to Have)

21. Add `daily_quotes`, `team_updates` tables
22. Add `match_agreements`, `recognition_fee_invoices` tables
23. Add notification_queue table
24. Add employee_objectives table
25. Add CORS origin whitelist (don't use `*`)
26. Add webhook idempotency check (duplicate event_id)

---

## 9. DEPLOYMENT CHECKLIST

- [ ] Fix all **Blocker** items
- [ ] Create D1 database
- [ ] Apply schema
- [ ] Set `DODO_WEBHOOK_SECRET` secret
- [ ] Deploy Worker
- [ ] Test `/api/health`
- [ ] Test `GET /api/profile?auth0_id=xxx` with real token
- [ ] Test `PATCH /api/profile/:id` with real token
- [ ] Test webhook endpoints with curl
- [ ] Add `VITE_WORKER_API_URL` to `.env`
- [ ] Replace ONE component's Supabase calls (profile page)
- [ ] Test that component end-to-end
- [ ] Fix all **Critical** items
- [ ] Gradually replace all components
- [ ] Run data migration (LAST)
