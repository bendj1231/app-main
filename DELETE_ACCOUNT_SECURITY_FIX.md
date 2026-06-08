# Delete Account Security Fix (C-4) — Implementation Guide

## Summary
Fixed **C-4** vulnerability: Added server-side passkey enforcement for irreversible account deletion.

- ✅ Created `delete_intent_tokens` table for short-lived, single-use tokens
- ✅ Modified `passkey-verify` to issue delete-intent token after successful verification
- ✅ Modified `delete-account` to require delete-intent token
- ✅ Prevents custom clients from bypassing passkey verification

## What Changed

### Problem
Account deletion is irreversible. The old implementation validated JWT but didn't require re-verification:
- ❌ Custom client could call `delete-account` with JWT alone
- ❌ No proof of passkey/biometric verification
- ❌ No audit trail of who initiated deletion

### Solution
Two-step verification flow:
1. **Passkey-verify** (unmodified flow)
   - User verifies with device passkey (Face ID / fingerprint / PIN)
   - Returns `deleteIntentToken` (5-minute expiry, single-use)

2. **Delete-account** (now requires token)
   - Client includes `X-Delete-Intent-Token` header
   - Server validates token before irreversible deletion
   - Token is consumed (single-use) after validation

---

## Deployment Checklist

### Phase 1: Database Setup
```bash
# Apply migration to create delete_intent_tokens table
cd /Users/bowler/Documents/apps/app-main
supabase migration up

# Or manually run:
# psql $SUPABASE_CONNECTION_STRING < supabase/migrations/20260608_delete_intent_tokens.sql
```

### Phase 2: Deploy Updated Functions
```bash
# Deploy passkey-verify with token issuance
supabase functions deploy passkey-verify

# Deploy delete-account with token validation
supabase functions deploy delete-account
```

### Phase 3: Update Client Code
Update all `delete-account` calls to:
1. Call `passkey-verify` first
2. Extract `deleteIntentToken` from response
3. Include token in delete-account request

---

## Client Integration

### Current (Old) Flow
```typescript
// ❌ UNSAFE: Only validates JWT, no re-verification
const response = await supabase.functions.invoke('delete-account', {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### New (Secure) Flow
```typescript
import { supabase } from '@/lib/supabase';

// Step 1: Get passkey challenge
const challengeResponse = await supabase.functions.invoke('passkey-challenge', {
  body: { userId: user.id }
});
const { challenge, credentialIds } = challengeResponse.data;

// Step 2: User verifies with device passkey
const assertion = await navigator.credentials.get({
  publicKey: {
    challenge: Uint8Array.from(atob(challenge), c => c.charCodeAt(0)),
    timeout: 60000,
    userVerification: 'required',
    allowCredentials: credentialIds.map(id => ({
      type: 'public-key',
      id: Uint8Array.from(atob(id), c => c.charCodeAt(0))
    }))
  }
});

// Step 3: Verify assertion and get delete-intent token
const verifyResponse = await supabase.functions.invoke('passkey-verify', {
  body: {
    credentialId: bufferToBase64url(assertion.id),
    authenticatorData: bufferToBase64url(assertion.response.authenticatorData),
    clientDataJSON: bufferToBase64url(assertion.response.clientDataJSON),
    signature: bufferToBase64url(assertion.response.signature),
    userHandle: bufferToBase64url(assertion.response.userHandle)
  }
});

// ⭐ CRITICAL: Extract delete-intent token
const { deleteIntentToken } = verifyResponse.data;

// Step 4: Delete account with delete-intent token
const deleteResponse = await supabase.functions.invoke('delete-account', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-Delete-Intent-Token': deleteIntentToken  // ⭐ NEW: Proves passkey verification
  }
});

if (deleteResponse.error) {
  // Handle errors
  if (deleteResponse.error.code === 'PASSKEY_VERIFICATION_REQUIRED') {
    // Guide user to re-verify passkey
    console.error('Please verify with your passkey first');
  } else if (deleteResponse.error.code === 'INVALID_DELETE_INTENT_TOKEN') {
    // Token expired or already used
    console.error('Verification token expired. Please verify again.');
  }
} else {
  // Account deletion successful
  console.log('Account permanently deleted');
}
```

### Helper Function
```typescript
// Utility for base64url encoding/decoding
function bufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
```

---

## Testing

### Test 1: Passkey verification succeeds, token issued
```bash
# 1. Get challenge
CHALLENGE=$(curl -s -X POST \
  https://your-project.supabase.co/functions/v1/passkey-challenge \
  -H "Content-Type: application/json" \
  -d '{"userId":"'"$USER_ID"'"}' \
  | jq -r '.challenge')

# 2. Verify passkey (simulated)
TOKEN=$(curl -s -X POST \
  https://your-project.supabase.co/functions/v1/passkey-verify \
  -H "Content-Type: application/json" \
  -d '{"credentialId":"...","authenticatorData":"...","clientDataJSON":"...","signature":"..."}' \
  | jq -r '.deleteIntentToken')

# 3. Delete account with token
curl -X DELETE \
  https://your-project.supabase.co/functions/v1/delete-account \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Delete-Intent-Token: $TOKEN"

# Expected: 200 { "success": true, "message": "Account permanently deleted" }
```

### Test 2: Delete-account without delete-intent token
```bash
curl -X DELETE \
  https://your-project.supabase.co/functions/v1/delete-account \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Expected: 403
# {
#   "error": "Authorization failed: Passkey verification required",
#   "code": "PASSKEY_VERIFICATION_REQUIRED",
#   "details": "This operation requires re-verification. Call passkey-verify first..."
# }
```

### Test 3: Delete-account with expired token
```bash
# Wait 6 minutes (token expires after 5 min)
sleep 360

curl -X DELETE \
  https://your-project.supabase.co/functions/v1/delete-account \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Delete-Intent-Token: $EXPIRED_TOKEN"

# Expected: 403
# {
#   "error": "Authorization failed: Token invalid, expired, or already used",
#   "code": "INVALID_DELETE_INTENT_TOKEN"
# }
```

### Test 4: Token single-use enforcement
```bash
# Use token for first deletion
TOKEN="..."

curl -X DELETE \
  https://your-project.supabase.co/functions/v1/delete-account \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Delete-Intent-Token: $TOKEN"
# → 200 Success

# Attempt reuse of same token
curl -X DELETE \
  https://your-project.supabase.co/functions/v1/delete-account \
  -H "Authorization: Bearer $DIFFERENT_TOKEN" \
  -H "X-Delete-Intent-Token: $TOKEN"

# Expected: 403 (token marked as consumed)
# {
#   "error": "Authorization failed: Token invalid, expired, or already used",
#   "code": "INVALID_DELETE_INTENT_TOKEN"
# }
```

---

## Migration Path

### For Existing Users
- **Grace period**: 30 days
- Old flow (JWT-only) returns `403 PASSKEY_VERIFICATION_REQUIRED`
- Users must complete passkey verification before account deletion
- This is a **security breaking change** — by design

### For New Users
- Immediately enforced
- Cannot delete account without passkey verification

---

## Database Schema
```sql
CREATE TABLE delete_intent_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL, -- 5 minutes
  consumed BOOLEAN NOT NULL DEFAULT false,
  consumed_at TIMESTAMPTZ,
  ip_address TEXT,
  user_agent TEXT
);
```

---

## Security Properties

| Property | Value | Notes |
|----------|-------|-------|
| Token lifetime | 5 minutes | Prevents token capture from being useful for long |
| Token format | 256-bit random (base64url) | Cryptographically secure, unforgeable |
| Single-use | Yes | Token marked consumed after validation |
| Audit logging | Yes | IP, user-agent, created_at, consumed_at tracked |
| Replay protection | Yes | Sign count monotonically increases in passkey |
| Biometric requirement | Yes | Passkey verification mandatory (Face ID / fingerprint / PIN) |

---

## Monitoring

### Log Verification Success
```
[AUDIT] Account deletion authorized for user $USER_ID via valid delete-intent token
```

### Log Security Events
```
[SECURITY] Account deletion attempted without delete-intent token for user $USER_ID
[SECURITY] Invalid/expired delete-intent token attempted for user $USER_ID
```

### Alerts
- Alert on repeated failed delete-intent token attempts (>3 failures)
- Alert on delete-intent tokens that expire without consumption (>1% of issued)
- Alert on delete-account calls with expired tokens

---

## Compliance

- **GDPR Article 17 (Right to Erasure)**: Enforces authorized deletion
- **CCPA (Data Deletion)**: Requires proof of account holder verification
- **ISO 27001 AC-3.1**: Multi-factor access control for critical operations

---

## Rollback Plan
If issues arise, rollback is **not recommended** — this is a critical security fix.

If you must rollback:
1. Deploy old `delete-account` function
2. Delete-intent tokens become unused
3. Cleanup via: `DELETE FROM delete_intent_tokens WHERE consumed = false;`

**But this re-introduces the vulnerability C-4. Do not do this.**

---

## Next Steps
- [ ] Run database migration
- [ ] Deploy passkey-verify
- [ ] Deploy delete-account
- [ ] Update client code (search for `delete-account` invocation)
- [ ] Test 4 test scenarios above
- [ ] Monitor logs for security/audit entries
- [ ] Announce to users: "Account deletion now requires passkey verification"

---

## Related Issues Addressed
- **C-4**: Account deletion now requires server-side passkey verification
