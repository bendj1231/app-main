# CRITICAL Security Issues — Action Plan

## Priority: TODAY

### C-1: Rotate EU Supabase Anon Key
**Status**: Not committed to git ✅, but exists in working `.env.local`  
**Action**:
1. Go to [Supabase Dashboard](https://app.supabase.com) → Project: EU
2. Settings → API → Copy new `anon` key (auto-revokes old key)
3. Update `.env.local` line 138 with new key
4. Redeploy Edge Functions
5. Test: Verify client-side Supabase calls still work

**Timeline**: 10 minutes  
**Risk if not done**: Real JWT visible to anyone with repo access

---

### C-2 & C-3: Fix `api/wallet/create.ts` Authentication + CORS

**Current state**: 
- Zero authentication (anyone can call)
- CORS allows `*` with credentials (exploit vector)
- Accepts arbitrary `pilotId` in request body

**Action Plan**:

#### Option A (Recommended): Convert to Supabase Edge Function
1. Create `supabase/functions/wallet-create/index.ts`
2. Copy `api/wallet/create.ts` logic
3. Add JWT validation:
   ```typescript
   const token = req.headers.get('Authorization')?.replace('Bearer ', '')
   const { data: { user }, error } = await supabase.auth.getUser(token)
   if (error || !user) return new Response({ error: 'Unauthorized' }, { status: 401 })
   ```
4. Derive `pilotId` from `user.id` instead of request body
5. Use CORS from `_shared/cors.ts` (auto-restricts to allowlist)
6. Remove `X-Pilot-Id` header (don't expose pilot ID to Truvera)
7. Deploy: `supabase functions deploy wallet-create`

#### Option B (Quick): Add auth to existing route
1. Add JWT check at top of `api/wallet/create.ts`
2. Fix CORS: Replace `'*'` with validated origin from allowlist
3. Validate `pilotId` matches authenticated user's ID

**Timeline**: 30–60 minutes (Option A) | 15 minutes (Option B)  
**Risk if not done**: Wallet hijacking for any pilot; cross-origin exploit possible

---

### C-4: Add Server-Side Passkey Enforcement to `delete-account`

**Current state**: 
- Client calls `passkey-verify` before invoking `delete-account`
- BUT server doesn't enforce it — custom client can skip

**Action**:  
Option A: Require a delete-intent token
1. Have `passkey-verify` return a short-lived (5 min) `delete_intent_jwt` token only if passkey verified
2. Modify `delete-account` to require this token in the request body
3. Check `delete_intent_jwt` is valid + not expired + not reused

Option B: Require TOTP code in request body
1. At delete time, require user provides their MFA TOTP code
2. Validate against their `mfa_secret` (pgcrypto-encrypted in profiles)
3. Log the deletion for audit

**Timeline**: 30–45 minutes (Option A) | 20 minutes (Option B)  
**Risk if not done**: Irreversible account deletion by custom client (low risk via browser due to HttpOnly JWT, but possible via server-side attack)

---

### H-1 (Follow-up): Audit api-gateway header forwarding

**Action**:
1. List all functions in `supabase/functions/*/deno.json` or by filename
2. For each, check:
   - Does `deno.json` have `"verify_jwt": true`? If no, mark as HIGH risk
   - Does code do `const userId = req.headers.get('X-User-ID')`? If yes, must have JWT re-validation
3. Create a spreadsheet or audit log
4. Refactor high-risk functions to use `supabase.auth.getUser(token)` instead of headers

**Timeline**: 60–90 minutes (discovery + fixes)  
**Risk if not done**: Privilege escalation via header spoofing

---

## Summary

| Issue | Severity | Time | Impact |
|-------|----------|------|--------|
| C-1: Rotate anon key | CRITICAL | 10 min | Key rotation (precautionary) |
| C-2/C-3: wallet/create auth + CORS | CRITICAL | 15–60 min | Wallet hijacking |
| C-4: delete-account passkey | CRITICAL | 20–45 min | Account deletion by custom client |
| H-1: api-gateway audit | HIGH | 60–90 min | Privilege escalation risk |
| **Total** | | **105–205 min** | |

---

## Recommended Order

1. **C-1** (10 min) — Rotate EU key (quick win)
2. **C-2/C-3** (30 min) — Fix wallet auth + CORS (high impact)
3. **C-4** (30 min) — Add delete-account passkey token (irreversible action)
4. **H-1** (90 min) — Audit api-gateway (systematic fix)

**Total: ~3 hours for all CRITICAL + H-1**

---

## Testing After Fixes

- [ ] Test wallet creation with valid JWT
- [ ] Test wallet creation rejected without JWT
- [ ] Test delete-account requires passkey/TOTP
- [ ] Test api-gateway functions still work with re-validated JWT
- [ ] Test no privilege escalation via X-User-ID header spoofing

