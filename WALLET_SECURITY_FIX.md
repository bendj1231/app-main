# Wallet Creation Security Fix — Implementation

## Summary
Fixed **C-2 & C-3** vulnerabilities in `api/wallet/create.ts`:
- ✅ Added JWT authentication requirement
- ✅ Derived `pilotId` server-side (no longer accepts from request body)
- ✅ Implemented proper CORS via `_shared/cors.ts` (no more `*` + credentials)
- ✅ Removed permissive CORS misconfiguration

## What Changed

### Old (Deprecated): `api/wallet/create.ts`
- ❌ Zero authentication
- ❌ CORS: `*` with credentials
- ❌ Accepted arbitrary `pilotId` from request
- ❌ Status: 410 Gone (redirects to new endpoint)

### New (Secure): `supabase/functions/wallet-create/index.ts`
- ✅ Requires `Authorization: Bearer <jwt>`
- ✅ Validates JWT server-side via `supabase.auth.getUser(token)`
- ✅ Derives `pilotId` from authenticated `user.id`
- ✅ CORS restricted to allowlist (`_shared/cors.ts`)
- ✅ Enforces strong password (12+ chars)
- ✅ Email validation
- ✅ Audit logging
- ✅ Request ID tracking

## Client Migration

### Before (Deprecated)
```typescript
// Old — unsecured
const response = await fetch('/api/wallet/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    pilotId: user.id,  // ❌ UNSAFE: Client sends pilotId
    email: user.email,
    password: walletPassword
  })
});
```

### After (Secure)
```typescript
// New — authenticated
import { supabase } from '@/lib/supabase';

// Get JWT from Supabase session
const { data: { session } } = await supabase.auth.getSession();
if (!session?.access_token) {
  throw new Error('Not authenticated');
}

// Call new Edge Function
const { data, error } = await supabase.functions.invoke('wallet-create', {
  headers: {
    Authorization: `Bearer ${session.access_token}`
    // pilotId is now server-side derived ✅
  },
  body: {
    email: user.email,
    password: walletPassword,
    issuers: approvedIssuers
  }
});

if (error) {
  console.error('Wallet creation failed:', error);
} else {
  console.log('Wallet created:', data.walletId);
}
```

## Deployment

### Step 1: Deploy Edge Function
```bash
cd /Users/bowler/Documents/apps/app-main
supabase functions deploy wallet-create
```

### Step 2: Update Environment
Ensure these are set in Supabase secrets (not `.env.local`):
- `TRUVERA_API_URL`
- `TRUVERA_API_KEY`

### Step 3: Update Client Code
Replace all calls to `POST /api/wallet/create` with `supabase.functions.invoke('wallet-create', ...)`.

Check `src/components/TruveraWalletSetup.tsx` (line 65) for example.

### Step 4: Test
```bash
# Test with auth
curl -X POST https://your-project.supabase.co/functions/v1/wallet-create \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"YourStrongPassword123"}'

# Expected: 201 with wallet details
# Without auth: 401 Unauthorized
# Invalid JWT: 401 Unauthorized
```

### Step 5: Deprecate Old Endpoint
- ✅ Old endpoint now returns 410 Gone
- Monitor logs for any remaining calls to old endpoint
- Remove `src/pages/api/wallet/create.ts` after 30 days grace period

---

## Security Benefits

| Risk | Before | After |
|------|--------|-------|
| Wallet hijacking | ❌ Anyone could create wallets for any pilot | ✅ Only authenticated users can create for themselves |
| CORS bypass | ❌ `*` + credentials allowed cross-origin requests | ✅ Restricted to allowlist |
| Privilege escalation | ❌ Client-provided `pilotId` accepted | ✅ Server-side derived from JWT |
| Rate limiting | ⚠️ No rate limiting | ✅ Database-backed rate limiter on Edge Functions |
| Audit trail | ❌ No logging | ✅ Request ID + user ID logged |

---

## Testing Checklist
- [ ] Deploy `wallet-create` Edge Function
- [ ] Update `TruveraWalletSetup.tsx` to use new endpoint
- [ ] Test wallet creation with valid JWT
- [ ] Test wallet creation rejected without JWT
- [ ] Test CORS allowed from frontend domains only
- [ ] Monitor logs for "Wallet created successfully" entries
- [ ] Verify old endpoint returns 410 Gone
- [ ] Check request tracking via requestId in logs

---

## Related Issues Addressed
- **C-2**: Wallet creation now requires JWT authentication
- **C-3**: CORS no longer uses `*` + credentials combination

## Next Steps (H-1)
Audit `api-gateway` and downstream functions to ensure they re-validate JWT instead of trusting `X-User-ID` headers.
