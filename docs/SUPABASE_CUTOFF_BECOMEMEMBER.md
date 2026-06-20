# Supabase Cutoff Audit — BecomeMemberPage & Related Files

**Date:** 2026-06-20
**Scope:** `BecomeMemberPage.tsx` and all files it imports that touch Supabase
**Goal:** List every Supabase dependency so the user can decide: KEEP / REPLACE WITH WORKER / DELETE
**New Stack:** Auth0 (auth) → D1 (profiles) → Cloudflare Workers (API) → R2 (storage) → Cloudinary (images) → Resend (emails)

---

## 1. Imports at Top of BecomeMemberPage.tsx

| # | Import | File | What It Does | New Stack Replacement | Action |
|---|---|---|---|---|---|
| 1 | `import { supabase } from '../../../src/lib/supabase'` | `src/lib/supabase.ts` | Creates Supabase client singleton using `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` | **Auth0 SDK** for auth session | **DELETE** — replace with Auth0 `getAccessTokenSilently()` |
| 2 | `import { WalletFirstCredentialFlow } from './WalletFirstCredentialFlow'` | `WalletFirstCredentialFlow.tsx` | Child component that ALSO imports `supabase` to update `profiles.wallet_connected` | **D1 API** via Worker | **REPLACE** — already uses D1 in `wallet.ts`, just needs this one line swapped |
| 3 | `import { issueAndStoreCredential, issueAndStoreCredentialSelfHosted } from '../../../src/lib/wallet'` | `src/lib/wallet.ts` | Already uses **D1 API** (`api()` function) — NOT Supabase! | D1 API ✅ | **KEEP** — already migrated |
| 4 | `import { getRegionalSupabaseClient, getJurisdictionCode } from '../../../lib/regionalRouter'` | `lib/regionalRouter.ts` | Returns a Supabase client based on license issuing authority (EU vs World) | **D1** (single DB, no regional split needed) or **Worker** with jurisdiction logic | **DELETE** — D1 is in single region, worker can handle jurisdiction tagging |

---

## 2. Supabase Usage Inside BecomeMemberPage.tsx (Line-by-Line)

### A. Session Detection (Google OAuth Users)

| Line | Code | Purpose | Replacement |
|---|---|---|---|
| 282 | `supabase.auth.getSession()` | Detect if user arrived via Google OAuth | Auth0 `getAccessTokenSilently()` or check URL for `code=` / `state=` after Auth0 redirect |
| 283-294 | `session?.user` → `setSupabaseUser(...)` | Populate local state with Supabase user ID/email/name | Auth0 `user` object from `useAuth0()` hook |

**→ Action:** Replace with Auth0 session detection. Google OAuth should go through Auth0 (which supports Google as a connection), not Supabase.

---

### B. Google OAuth Sign-In Button

| Line | Code | Purpose | Replacement |
|---|---|---|---|
| 676-681 | `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })` | Initiates Google OAuth via Supabase | Auth0 `loginWithRedirect({ connection: 'google-oauth2' })` |

**→ Action:** Replace with Auth0 login. The redirect should go to `/become-member?setup=1` after Auth0 auth.

---

### C. Profile Existence Check (Pre-Onboarding Gate)

| Line | Code | Purpose | Replacement |
|---|---|---|---|
| 690 | `getRegionalSupabaseClient('CAAP')` | Gets regional Supabase client (hardcoded to CAAP/World) | Call **Worker** endpoint: `GET /api/profile?auth0_id={id}` |
| 691-695 | `regionalSupabase.from('profiles').select('id').eq('id', userId).maybeSingle()` | Checks if profile already exists | D1 query via Worker |

**→ Action:** Replace with single Worker request. The Worker checks D1 `profiles` table by `auth0_id`.

---

### D. Partial Save (Auto-Save After Each Step)

| Line | Code | Purpose | Replacement |
|---|---|---|---|
| 483 | `supabase.auth.getSession()` | Get current user ID for partial save | Auth0 `user.sub` |
| 486 | `supabase.from('profiles').update(fields).eq('id', sbUserId)` | Save partial form data mid-onboarding | **Worker:** `PATCH /api/profile` with auth0_id + fields |

**→ Action:** Replace with Worker call. This is non-blocking (warns on failure), so can be fire-and-forget.

---

### E. Full Profile Save (The Big One — handleSaveProfile)

| Line | Code | Purpose | Replacement |
|---|---|---|---|
| 493 | `supabase.auth.getSession()` | Get authenticated user for save | Auth0 `user.sub` + access token |
| 507 | `sbUserId = dbgSession?.user?.id \|\| supabaseUser?.id` | Determine user ID | `auth0User.sub` |
| 513 | `getRegionalSupabaseClient(issuingAuthority)` | Get regional client based on license authority | **NOT NEEDED** — D1 is single-region, worker handles all writes |
| 538-542 | `regionalSupabase.from('profiles').select('id').eq('id', sbUserId).maybeSingle()` | Check if profile exists for upsert decision | Worker handles this internally |
| 544-548 | `regionalSupabase.from('profiles').update(payload).eq('id', sbUserId)` | **UPDATE** existing profile | **Worker:** `PUT /api/profile` with full payload |
| 551-569 | `regionalSupabase.from('profiles').insert({...payload})` | **INSERT** new profile with auto-generated `pilot_id` | **Worker:** `POST /api/profile` — Worker generates `pilot_id` (PR0001 format) |

**Payload fields sent to Supabase:**
- `display_name`, `full_name`, `current_occupation`, `date_of_birth`, `total_flight_hours`
- `aircraft_types`, `aircraft_rated_on`, `nationality`, `license_issuing_authority`, `country_of_license`
- `origin_jurisdiction`, `ratings`, `license_types`, `employment_status`, `unemployed_duration`
- `current_job`, `career_goal`, `pilot_stage`
- **Plus on insert:** `id` (auth0 sub), `email`, `role` (visitor/mentee), `status`, `pilot_id`, `enrolled_programs`, timestamps

**→ Action:** Replace entire `handleSaveProfile` Supabase block with a **single Worker request**.

**Worker endpoint design:**
```
POST /api/profile/create-or-update
Headers: Authorization: Bearer {auth0_access_token}
Body: {
  auth0_id, email, display_name, full_name, occupation, dob, hours,
  aircraft_types, ratings, issuing_authority, nationality, pilot_stage,
  employment_status, career_goal, current_job, unemployed_duration,
  elp_level, type_ratings, ...
}
```
The Worker:
1. Validates JWT via Auth0
2. Checks if profile exists in D1 `profiles` table
3. If exists: UPDATE
4. If new: INSERT with auto-generated `pilot_id` (PR0001 format)
5. Returns `{ success, pilot_id, profile_id }`

---

### F. VC Credential Issuance — REMOVED FROM ONBOARDING

**User clarification:** VC issuance during onboarding is architecturally incorrect. The Verifiable Credential is issued **after** verification, not during signup.

**Correct flow (post-onboarding):**
```
Free Tier User → Subscribes to Recognition+ (Dodo Payments)
→ Dodo webhook → Cloudflare Worker
→ Worker triggers Veremark verification
→ Veremark sends results to platform + user email
→ Worker issues VC to profile
→ OR: Admin manually triggers VC via admin portal → Worker labels profile
```

**→ Action:** Remove the entire VC issuance block (lines 572–605) from `handleSaveProfile`. Onboarding only creates the profile. VC comes later via the verification pipeline.

| Line | Code | Action |
|---|---|---|
| 575-579 | `supabase.from('profiles').select(...)` | **DELETE** |
| 587-595 | `issueAndStoreCredentialSelfHosted(...)` | **DELETE** — call moved to post-verification Worker |
| 602-604 | VC error catch block | **DELETE** |

---

### G. Passkey Registration — REMOVED

**User clarification:** Passkeys are handled entirely by **Auth0 + the browser**. Google Account sign-in, iCloud Keychain, and platform authenticators are managed by the user's identity provider and device. We do NOT store passkey credentials in our database.

| Line | Code | Action |
|---|---|---|
| 608-648 | Entire passkey registration block (`navigator.credentials.create`, `supabase.from('pilot_passkeys').upsert(...)`) | **DELETE** |

**→ Action:** Remove the entire passkey block. Auth0 handles MFA and device trust. No passkey table needed in D1.

---

## 3. WalletFirstCredentialFlow.tsx → Rename to RecognitionProfileFlow

**User clarification:** "Wallet" is a misnomer. Rename to **Recognition Profile Creation**.

| Line | Code | Purpose | Replacement |
|---|---|---|---|
| 2 | `import { supabase } from '../../../src/lib/supabase'` | Import Supabase client | **DELETE** |
| 118-124 | `supabase.from('profiles').update({ wallet_connected: true, credential_issued_at: ... }).eq('auth0_id', auth0Id)` | Mark wallet-connected | **NOT NEEDED** — profile creation itself = recognition profile created |

**→ Action:** 
1. Rename file/component to `RecognitionProfileFlow.tsx`
2. Remove Supabase import
3. Remove the `wallet_connected` update — the profile creation at the final stage IS the recognition profile creation
4. The component should only handle **UI confirmation** ("Your Recognition Profile is ready") without DB writes

---

## 4. regionalRouter.ts — The Entire File

**File:** `lib/regionalRouter.ts`
**Purpose:** Switches between two Supabase projects (World = Sydney, EU = Paris) based on license issuing authority.

**Why it's no longer needed:**
- D1 is hosted in a single Cloudflare region (you pick one)
- If you need EU data residency, you can create a second D1 database in `eu-west` and route at the Worker level
- But the regional routing logic should live in the **Worker**, not the frontend

**→ Action:** **DELETE** the file. Worker handles jurisdiction.

---

## 5. src/lib/supabase.ts — The Client Singleton

**File:** `src/lib/supabase.ts`
```typescript
export { supabase } from '../../shared/lib/supabase';
```

**→ Action:** **DELETE** both `src/lib/supabase.ts` and `shared/lib/supabase.ts` once all imports are removed.

---

## 6. D1 API — ALREADY WORKING (The Replacement)

**File:** `src/lib/d1-api.ts`
**Purpose:** Generic API client for D1 via Cloudflare Worker

**Already used by:**
- `src/lib/wallet.ts` — all wallet operations use `api(accessToken, 'queryTable', {...})`
- Any file importing from `d1-api`

**Why this is the correct replacement:**
- Frontend calls Worker with Auth0 access token
- Worker validates token
- Worker queries D1
- No Supabase involved

---

## 7. Summary: What to Build on the Worker (Onboarding Only)

**Worker name:** `onboarding` (single Worker, multiple routes)

| # | Worker Endpoint | Method | Purpose | Replaces |
|---|---|---|---|---|
| 1 | `/api/profile` | `GET` | Check if profile exists by auth0_id | `checkUserProfileExists()` |
| 2 | `/api/profile` | `POST` | Create new profile with auto pilot_id | `regionalSupabase.from('profiles').insert()` |
| 3 | `/api/profile` | `PUT` | Update existing profile | `regionalSupabase.from('profiles').update()` |
| 4 | `/api/profile` | `PATCH` | Partial save (mid-onboarding) | `savePartialProfile()` |

### The Final Stage — Recognition Profile Creation (Batch Request)

At the last stage of onboarding, instead of multiple individual requests, the frontend sends **one batch request** containing all collected data:

```
POST /api/profile/create
Headers: Authorization: Bearer {auth0_access_token}
Body: {
  auth0_id: "auth0|...",
  email: "...",
  display_name: "...",
  full_name: "...",
  current_occupation: "Commercial Pilot (CPL)",
  date_of_birth: "1990-01-01",
  total_flight_hours: 1250.5,
  aircraft_types: ["C172", "P2002JF"],
  aircraft_rated_on: "C172, P2002JF",
  ratings: ["SEL", "Instrument"],
  license_types: ["CPL"],
  nationality: "Philippines",
  license_issuing_authority: "CAAP",
  country_of_license: "CAAP",
  origin_jurisdiction: "CAAP",
  employment_status: "employed",
  unemployed_duration: null,
  current_job: "Flight Instructor",
  career_goal: "Airline Pilot",
  pilot_stage: "cpl",
  elp_level: "Level 5",
  type_ratings: [],
  role: "mentee",           // or "visitor" if aspirant
}
```

The Worker:
1. Validates JWT via Auth0
2. Generates `pilot_id` (e.g., `PR0047`) if new user
3. INSERT or UPDATE D1 `profiles` table
4. Returns `{ success, pilot_id, profile_id, tier: "free" }`

**No separate calls for wallet, passkey, or VC.** One request handles everything.

---

**VC issuance is NOT in this Worker.** It lives in the post-verification pipeline:
- Dodo Payments webhook → Worker updates `payment_status`
- Veremark callback → Worker updates `verification_status`
- Admin trigger → Worker calls `issueAndStoreCredential()` (already in `wallet.ts` using D1)

---

## 8. Files to DELETE (No Longer Needed)

| File | Reason |
|---|---|
| `src/lib/supabase.ts` | Supabase client singleton |
| `shared/lib/supabase.ts` | Shared Supabase client |
| `lib/regionalRouter.ts` | Regional Supabase routing — Worker handles this |
| `supabase/functions/*` | All 75 Edge Functions — replaced by single Worker |
| `supabase/migrations/*` | Schema definitions — manually recreate in D1 |

---

## 9. Files to MODIFY

| File | Changes Needed |
|---|---|
| `components/website/components/BecomeMemberPage.tsx` | Replace all Supabase calls with single Worker batch request; delete passkey block; delete VC block; delete Google OAuth (use Auth0) |
| `components/website/components/WalletFirstCredentialFlow.tsx` | **Rename** to `RecognitionProfileFlow.tsx`; remove Supabase import; remove DB write; make pure UI confirmation component |
| `components/website/components/FlightDeckLoginPage.tsx` | Verify no remaining Supabase calls (should already be Auth0-only) |

---

## 10. Environment Variables to Remove

| Variable | Current Value | Action |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://gkbhgrozrzhalnjherfu.supabase.co` | **DELETE** |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbG...` | **DELETE** |
| `VITE_SUPABASE_URL_EU` | (if set) | **DELETE** |
| `VITE_SUPABASE_ANON_KEY_EU` | (if set) | **DELETE** |

**Keep:**
- `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, `VITE_AUTH0_AUDIENCE` ✅
- `VITE_PILOT_WALLET_URL`, `VITE_WALT_WALLET_API` ✅
- `VITE_PILOT_ISSUER_URL`, `VITE_ISSUER_DID` ✅

---

## 11. Package to Uninstall

```bash
npm uninstall @supabase/supabase-js
```

This removes the Supabase JS client from the bundle.

---

## 12. Decisions Confirmed

| # | Question | Decision |
|---|---|---|
| 1 | Auth0 handles Google OAuth? | **Yes** — `loginWithRedirect({ connection: 'google-oauth2' })` |
| 2 | Passkeys stored in our DB? | **No** — Auth0 + browser (Google Account, iCloud) handles passkeys natively |
| 3 | VC issued during onboarding? | **No** — VC is post-verification (Dodo → Veremark → Worker → VC) |
| 4 | "Wallet" terminology? | **Renamed** to "Recognition Profile" |
| 5 | Final stage request pattern? | **Single batch request** `POST /api/profile/create` with all fields |
| 6 | Delete supabase/ directory? | **Yes** — dead code |
| 7 | Worker count? | **Single Worker** with route handlers |

---

## 13. Remaining Open Questions

1. **Deploy CSP fix?** The `public/_headers` has the Supabase WebSocket fix applied but not deployed. Should I deploy that first so the site loads?
2. **Build Worker first or modify component first?** 
   - **Option A:** Build Worker first → then wire component to real endpoints
   - **Option B:** Modify component first with placeholder fetch calls → build Worker after
3. **D1 schema:** Do you have a D1 `profiles` table already, or do I need to create it?

---

**Note:** The Supabase account at `gkbhgrozrzhalnjherfu` can be left as-is (stranded). No data migration needed. New users go through Auth0 + D1. Old Supabase data is frozen in place. If you ever need historical data, you can log into the Supabase dashboard and export manually.
