# Security Audit Findings

**Date:** June 2, 2026  
**Auditor:** Cascade AI  
**Scope:** Supabase Edge Functions, CORS configuration, authentication patterns

---

## 🚨 Critical Issues

### 1. Wildcard CORS on Sensitive Endpoints

**Severity:** CRITICAL  
**Files Affected:**
- `supabase/functions/issuer-sign/index.ts:26`
- `supabase/functions/pilot-pull-api/index.ts:18`
- `supabase/functions/wallet-provision/index.ts:9`

**Issue:** These endpoints use `Access-Control-Allow-Origin: '*'`, allowing any website to make requests to:
- Issue Verifiable Credentials (`issuer-sign`)
- Pull pilot data (`pilot-pull-api`)
- Provision wallets (`wallet-provision`)

**Risk:**
- CSRF attacks against authenticated users
- Unauthorized credential issuance if authentication is bypassed
- Data exfiltration via malicious websites

**Fix:** Use the shared CORS utility or implement origin validation:

```typescript
import { getCorsHeaders } from '../_shared/cors.ts';

// In handler:
const corsHeaders = getCorsHeaders(req);
```

**Priority:** Fix immediately before production deployment.

---

## ⚠️ Warning Issues

### 2. In-Memory Rate Limiting (Non-Distributed)

**Severity:** HIGH  
**File:** `supabase/functions/pilot-pull-api/index.ts:23-41`

**Issue:** Uses `const rateLimitStore = new Map<string, ...>()` for rate limiting. Edge Functions run on multiple isolated instances — each has its own memory. A user could make `200 requests × number of instances` instead of the intended 200/hour limit.

**Risk:** Rate limits can be bypassed by distributing requests across multiple connections.

**Fix:** Use Redis or Supabase table for distributed rate limiting:

```typescript
// Use Supabase table for rate limiting
const { data: rateRecord } = await supabase
  .from('rate_limits')
  .select('*')
  .eq('key', rateKey)
  .single();
```

---

### 3. Missing CORS Headers on Webhook

**Severity:** MEDIUM  
**File:** `supabase/functions/stripe-webhook/index.ts`

**Issue:** No CORS headers returned. While webhooks verify signatures, error responses may leak information to any origin.

**Fix:** Add minimal CORS headers or explicitly disable cross-origin access:

```typescript
const headers = {
  'Content-Type': 'application/json',
  // Explicitly deny cross-origin for webhooks
  'Access-Control-Allow-Origin': 'null',
};
```

---

### 4. Hardcoded Localhost Fallback

**Severity:** LOW  
**File:** `supabase/functions/wallet-provision/index.ts:6`

**Issue:** Falls back to `http://localhost:7001` if environment variable is not set.

**Risk:** Could cause unexpected behavior in production if env var is missing.

**Fix:** Fail closed:

```typescript
const PILOT_WALLET_API = Deno.env.get('PILOT_WALLET_API');
if (!PILOT_WALLET_API) {
  throw new Error('PILOT_WALLET_API environment variable required');
}
```

---

## ℹ️ Informational

### 5. Console Logging in Production

**Severity:** INFO  
**Files:** Multiple edge functions

**Issue:** `console.log` and `console.error` statements throughout code will output to logs.

**Note:** This is acceptable for debugging but ensure:
- No PII is logged (currently appears clean)
- Logs are retained appropriately
- Consider structured logging for production

---

## ✅ Positive Security Controls Found

| Control | Implementation | Status |
|---------|----------------|--------|
| JWT Authentication | Proper Bearer token validation | ✅ |
| PII Redaction | `pilot-pull-api` redacts `full_name` and `license_number` for non-admins | ✅ |
| Session Timeout | 15-minute idle timeout on pull API | ✅ |
| Audit Logging | `user_activity_log` and `security_events` tables | ✅ |
| Webhook Signature Verification | Stripe webhooks verify signatures | ✅ |
| RLS Policies | Multiple migrations enable RLS | ✅ |
| Non-extractable Keys | `issuer-sign` uses `extractable: false` | ✅ |
| Input Validation | Query params are parsed with defaults and limits | ✅ |

---

## Recommended Actions

### Immediate (Before Production)

1. **Fix wildcard CORS** on all three critical endpoints
2. **Implement distributed rate limiting** for `pilot-pull-api`
3. **Remove localhost fallback** from `wallet-provision`

### Short-term

4. Add automated CORS validation tests to CI/CD
5. Implement security headers (CSP, HSTS, X-Frame-Options)
6. Add request signing for internal service calls

### Long-term

7. Implement centralized logging with PII detection
8. Add automated security scanning to deployment pipeline
9. Regular penetration testing schedule

---

## Files to Review

```bash
# High priority
supabase/functions/issuer-sign/index.ts
supabase/functions/pilot-pull-api/index.ts
supabase/functions/wallet-provision/index.ts
supabase/functions/stripe-webhook/index.ts

# Medium priority
supabase/functions/r2-presign-upload/index.ts
supabase/functions/enterprise-access/index.ts
supabase/functions/ato-stripe-checkout/index.ts
```

---

**Next Audit:** Recommended within 30 days after fixes are deployed.
