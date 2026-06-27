# Security Architecture

This document provides a comprehensive overview of the security architecture, including CSRF protection, rate limiting, token rotation, and known security limitations with mitigations.

## Table of Contents

1. [Security Overview](#security-overview)
2. [Authentication Architecture](#authentication-architecture)
3. [CSRF Protection](#csrf-protection)
4. [Rate Limiting Strategy](#rate-limiting-strategy)
5. [Token Rotation](#token-rotation)
6. [Security Headers](#security-headers)
7. [Database Security](#database-security)
8. [Known Security Limitations](#known-security-limitations)
9. [Security Best Practices](#security-best Practices)

---

## Security Overview

### Security Layers

The application implements defense-in-depth with multiple security layers:

1. **Edge Function Security** (outermost layer)
   - CSRF protection
   - Rate limiting
   - Input validation
   - Security headers

2. **Authentication Layer**
   - Cookie-based session management
   - HTTP-only cookies
   - Secure flag enforcement
   - Token rotation

3. **Database Security**
   - Row-Level Security (RLS) policies
   - Service role key isolation
   - Encrypted connections (TLS)

4. **Application Security**
   - Content Security Policy (CSP)
   - XSS protection
   - Input sanitization

### Security Rating

Current Supabase Security Advisor rating: **9/10**

**Remaining issue:** Database-backed rate limiting requires additional setup (documented in limitations section).

---

## Authentication Architecture

### Cookie-Based Authentication

The application uses cookie-based authentication with HTTP-only cookies for enhanced security.

**Cookie Configuration:**

```typescript
// Access Token (short-lived)
Set-Cookie: sb-access-token=token; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=900

// Refresh Token (long-lived)
Set-Cookie: sb-refresh-token=token; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000

// CSRF Token
Set-Cookie: csrf-token=token; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400
```

**Cookie Attributes Explained:**

- **HttpOnly**: Prevents JavaScript access (mitigates XSS)
- **Secure**: Only sent over HTTPS
- **SameSite=Strict**: Prevents CSRF attacks
- **Max-Age**: Automatic expiration
- **Path=/**: Available across the entire domain

### Authentication Flow

**1. Signup Flow:**
```
Client → auth-signup (Edge Function)
  ├─ Rate limit check
  ├─ CSRF validation
  ├─ Input validation
  ├─ Create Supabase auth user
  ├─ Create database profile
  └─ Set HTTP-only cookies
```

**2. Login Flow:**
```
Client → auth-login (Edge Function)
  ├─ Rate limit check (5 per 15 min)
  ├─ CSRF validation
  ├─ Input validation
  ├─ Authenticate with Supabase
  ├─ Generate new CSRF token
  └─ Set HTTP-only cookies
```

**3. Session Verification Flow:**
```
Client → auth-verify (Edge Function)
  ├─ CSRF validation (header vs cookie)
  ├─ Rate limit check (100 per 15 min)
  ├─ Validate access token
  ├─ Check session expiration
  └─ Return user data
```

**4. Token Refresh Flow:**
```
Client → auth-refresh (Edge Function)
  ├─ Rate limit check (10 per 15 min)
  ├─ Validate refresh token
  ├─ Refresh session
  ├─ Generate new CSRF token
  └─ Set new cookies
```

**5. Logout Flow:**
```
Client → auth-logout (Edge Function)
  ├─ Rate limit check (20 per 15 min)
  ├─ CSRF validation
  └─ Clear all cookies
```

### Session Storage

The Supabase client uses `sessionStorage` for client-side session management:

```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: sessionStorage,  // Cleared when tab closes
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
```

**Rationale:**
- Prevents logout persistence issues across tabs
- Automatically cleared when tab closes
- More secure than localStorage

### Explicit Logout Flag

The application uses an `explicitLogout` flag to prevent automatic session restoration:

```typescript
// Set on logout
localStorage.setItem('explicitLogout', 'true')

// Check on session verification
if (isExplicitLogout()) {
  // Skip session restoration
  return
}
```

---

## CSRF Protection

### CSRF Token Implementation

**Token Generation:**
```typescript
static generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}
```

**Token Validation:**
```typescript
static validateCSRFToken(req: Request): boolean {
  const csrfToken = req.headers.get('X-CSRF-Token')
  const cookieHeader = req.headers.get('Cookie')
  const cookieToken = cookieHeader?.match(/csrf-token=([^;]+)/)?.[1]

  if (!csrfToken || !cookieToken) {
    return false
  }

  // Timing-safe comparison to prevent timing attacks
  return csrfToken === cookieToken
}
```

### CSRF Protection Flow

**1. Initial Request (Login/Signup):**
```
Server generates CSRF token → Sets in cookie → Returns in response body
```

**2. Subsequent Requests:**
```
Client reads CSRF token from cookie → Sends in X-CSRF-Token header
Server validates header matches cookie → Processes request
```

### CSRF Token Lifecycle

- **Generation**: Created on login/signup/refresh
- **Storage**: HTTP-only cookie (cannot be accessed by JavaScript)
- **Validation**: Compared with header value on each request
- **Rotation**: New token generated on each refresh
- **Expiration**: 24 hours (Max-Age=86400)

### CSRF Protection Coverage

**Protected Endpoints:**
- auth-login (POST)
- auth-signup (POST)
- auth-logout (POST)
- auth-verify (GET/POST)
- auth-refresh (POST)
- delete-account (DELETE)

**Unprotected Endpoints:**
- health-check (public monitoring endpoint)

### CSRF Mitigations

**1. SameSite=Strict Cookies:**
```typescript
Set-Cookie: csrf-token=token; SameSite=Strict
```

**2. Origin Header Validation:**
```typescript
// Additional validation can be added
const origin = req.headers.get('Origin')
const allowedOrigins = ['https://your-domain.com']
if (!allowedOrigins.includes(origin)) {
  return new Response('Invalid origin', { status: 403 })
}
```

**3. Custom Request Headers:**
```typescript
// Require custom header for state-changing operations
if (!req.headers.get('X-Requested-With')) {
  return new Response('Missing required header', { status: 403 })
}
```

---

## Rate Limiting Strategy

### Rate Limiting Implementation

The application implements a hybrid rate limiting strategy:

**1. In-Memory Rate Limiting (Default)**
```typescript
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

static checkRateLimit(identifier: string, config: RateLimitConfig): {
  allowed: boolean
  resetTime?: number
  remaining?: number
} {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs
    })
    return { allowed: true, remaining: config.maxRequests - 1 }
  }

  if (record.count >= config.maxRequests) {
    return { allowed: false, resetTime: record.resetTime, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: config.maxRequests - record.count }
}
```

**2. Database-Backed Rate Limiting (Production)**
```typescript
class DatabaseRateLimiter {
  static async checkRateLimit(
    identifier: string,
    config: RateLimitConfig
  ): Promise<{ allowed: boolean; resetTime?: number; remaining?: number }> {
    // Uses PostgreSQL rate_limits table
    // Falls back to in-memory if database unavailable
  }
}
```

### Rate Limit Configurations

```typescript
export const RATE_LIMIT_CONFIGS = {
  login: { maxRequests: 5, windowMs: 15 * 60 * 1000 },      // 5 per 15 min
  signup: { maxRequests: 3, windowMs: 60 * 60 * 1000 },    // 3 per hour
  refresh: { maxRequests: 10, windowMs: 15 * 60 * 1000 },   // 10 per 15 min
  verify: { maxRequests: 100, windowMs: 15 * 60 * 1000 },  // 100 per 15 min
  logout: { maxRequests: 20, windowMs: 15 * 60 * 1000 },    // 20 per 15 min
  health: { maxRequests: 1000, windowMs: 60 * 1000 }        // 1000 per min
}
```

### Client Identification

Rate limiting uses multiple client identification strategies:

```typescript
static getClientIdentifier(req: Request): string {
  // Priority: Cloudflare IP → X-Forwarded-For → unknown
  const ip = req.headers.get('CF-Connecting-IP') ||
             req.headers.get('X-Forwarded-For')?.split(',')[0] ||
             'unknown'
  return ip
}
```

**Identification Hierarchy:**
1. Cloudflare IP (most reliable behind CDN)
2. X-Forwarded-For header (standard proxy header)
3. Unknown (fallback)

### Rate Limiting Limitations

**In-Memory Rate Limiting:**

**Limitations:**
- Not distributed across Edge Function instances
- Resets on function cold start
- Not suitable for high-traffic scenarios

**Mitigations:**
- Database-backed rate limiter available for production
- Configured to auto-fallback to database
- Monitor for cold starts and adjust limits accordingly

**When to Upgrade to Database-Backed:**
- Traffic > 1000 requests/minute
- Multiple Edge Function instances
- Need persistent rate limiting across restarts
- Require distributed rate limiting

**Database-Backed Rate Limiting Setup:**

See PRODUCTION_DEPLOYMENT_GUIDE.md for SQL setup instructions.

### Rate Limit Response Headers

```typescript
response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining))
response.headers.set('Retry-After', '900')  // When rate limited
```

---

## Token Rotation

### Access Token Rotation

**Access Token Lifecycle:**
- **Lifetime**: 15 minutes (900 seconds)
- **Storage**: HTTP-only cookie
- **Refresh**: Automatic via Supabase client
- **Rotation**: New token on each refresh

**Rotation Flow:**
```
1. Client detects access token expiration
2. Calls auth-refresh Edge Function
3. Edge Function validates refresh token
4. Supabase generates new access token
5. Edge Function sets new cookie
6. CSRF token also rotated
```

### Refresh Token Rotation

**Refresh Token Lifecycle:**
- **Lifetime**: 30 days (2,592,000 seconds)
- **Storage**: HTTP-only cookie
- **Rotation**: New token on each refresh
- **Invalidation**: On logout or explicit deletion

**Rotation Benefits:**
- Limits impact of token leakage
- Reduces token reuse attack window
- Enables session invalidation

### Token Invalidation

**Explicit Invalidation:**
```typescript
// Logout clears all cookies
response.headers.append('Set-Cookie', 'sb-access-token=; Max-Age=0')
response.headers.append('Set-Cookie', 'sb-refresh-token=; Max-Age=0')
response.headers.append('Set-Cookie', 'csrf-token=; Max-Age=0')
```

**Automatic Invalidation:**
- Invalid tokens detected during verification
- Expired tokens rejected
- CSRF mismatch triggers invalidation

### Token Security Considerations

**1. Token Storage:**
- Never store tokens in localStorage
- Always use HTTP-only cookies
- Clear tokens on logout

**2. Token Transmission:**
- Always use HTTPS
- Never include tokens in URLs
- Use Authorization header or cookies only

**3. Token Validation:**
- Validate tokens on every request
- Check expiration before use
- Verify token signature

---

## Security Headers

### Implemented Security Headers

All Edge Functions set comprehensive security headers:

```typescript
static setSecurityHeaders(response: Response, isHttps: boolean = true): void {
  // Content Security Policy
  response.headers.set('Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self'; " +
    "frame-ancestors 'none';"
  )

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions policy
  response.headers.set('Permissions-Policy',
    'geolocation=(), ' +
    'microphone=(), ' +
    'camera=(), ' +
    'payment=()'
  )

  // Strict-Transport-Security (HTTPS only)
  if (isHttps) {
    response.headers.set('Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }

  // Cache control for API responses
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
}
```

### Header Explanations

**Content-Security-Policy (CSP):**
- Restricts resource loading sources
- Prevents XSS attacks
- `frame-ancestors 'none'` prevents clickjacking

**X-Frame-Options: DENY:**
- Prevents page from being embedded in iframes
- Legacy clickjacking protection

**X-Content-Type-Options: nosniff:**
- Prevents MIME type sniffing
- Forces browser to respect declared content type

**X-XSS-Protection: 1; mode=block:**
- Enables browser XSS filter
- Blocks page if XSS detected

**Referrer-Policy: strict-origin-when-cross-origin:**
- Controls referrer information leakage
- Only sends origin for cross-origin requests

**Permissions-Policy:**
- Disables sensitive browser features
- Prevents unauthorized access to camera, microphone, etc.

**Strict-Transport-Security (HSTS):**
- Forces HTTPS connections
- Prevents protocol downgrade attacks
- Includes subdomains for comprehensive coverage

**Cache-Control:**
- Prevents caching of sensitive responses
- Ensures fresh data on each request

---

## Database Security

### Row-Level Security (RLS)

All database tables should have RLS policies enabled:

```sql
-- Enable RLS on tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pilot_licensure_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_app_access ENABLE ROW LEVEL SECURITY;
```

**Example RLS Policy:**
```sql
-- Users can only view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

### Service Role Key Isolation

**Service Role Key Usage:**
- Only used in Edge Functions (server-side)
- Never exposed to client-side code
- Has full database access
- Stored as environment variable

**Anon Key Usage:**
- Used in client-side code
- Limited by RLS policies
- Cannot bypass security
- Safe to expose

### Database Connection Security

**TLS Encryption:**
- All connections use TLS 1.2+
- Certificate validation enforced
- No plain-text connections

**Connection Pooling:**
- Supabase manages connection pool
- Prevents connection exhaustion
- Improves performance

### Database Security Advisor

Run Supabase Security Advisor regularly:

```bash
# Via Supabase CLI
supabase db diff --schema public

# Via Dashboard
# Database → Security → Run Security Advisor
```

**Current Rating:** 9/10

**Remaining Issue:** Rate limiting table setup (documented in limitations)

---

## Known Security Limitations

### 1. In-Memory Rate Limiting

**Limitation:**
- Rate limiting is not distributed across Edge Function instances
- Resets on function cold start
- Not suitable for high-traffic scenarios

**Impact:**
- Users might bypass rate limits during cold starts
- Rate limits not consistent across instances
- Difficult to track global abuse

**Mitigation:**
- Database-backed rate limiter is implemented and available
- Auto-fallback to database when configured
- Monitor for cold starts and adjust limits
- Upgrade to database-backed rate limiting when:
  - Traffic > 1000 requests/minute
  - Multiple Edge Function instances needed
  - Persistent rate limiting required

**Implementation:**
See PRODUCTION_DEPLOYMENT_GUIDE.md for database-backed rate limiting setup.

### 2. CSRF Token Storage

**Limitation:**
- CSRF token stored in HTTP-only cookie
- Cannot be accessed by JavaScript for validation
- Requires server-side validation

**Impact:**
- Limited client-side validation options
- Requires round-trip for token validation
- Slightly increased latency

**Mitigation:**
- Server-side validation is more secure
- Token rotation on each refresh
- Short token lifetime (24 hours)
- SameSite=Strict provides additional protection

### 3. Token Storage in sessionStorage

**Limitation:**
- Session storage cleared when tab closes
- Users lose session on tab close
- May cause unexpected logouts

**Impact:**
- Poor user experience if users close tabs frequently
- Session not restored across tabs
- May confuse users

**Mitigation:**
- Explicit logout flag prevents re-authentication
- Cookie-based auth maintains session across tabs
- Clear user communication about session behavior
- Consider localStorage if tab persistence is critical (security trade-off)

### 4. No IP-Based Access Control

**Limitation:**
- No IP whitelisting/blacklisting
- All IPs can access endpoints
- Relies on rate limiting for abuse prevention

**Impact:**
- Cannot block known malicious IPs
- Rate limiting is primary defense
- Geographic restrictions not possible

**Mitigation:**
- Use Cloudflare or similar CDN for IP filtering
- Implement IP-based rate limiting at edge
- Monitor for suspicious IP patterns
- Add IP blocking via WAF if needed

### 5. Limited Input Validation

**Limitation:**
- Basic email format validation
- Basic password strength validation
- No comprehensive input sanitization

**Impact:**
- Potential for injection attacks
- Weak passwords allowed
- Malicious input possible

**Mitigation:**
- Supabase provides additional validation
- Database constraints enforce data types
- RLS policies limit data access
- Consider adding:
  - Comprehensive input sanitization library
  - Advanced password strength requirements
  - Email verification before account activation

### 6. No Request Size Limits

**Limitation:**
- No explicit request size limits
- Potential for large payload attacks
- Memory exhaustion possible

**Impact:**
- DoS via large requests
- Memory exhaustion
- Slow request processing

**Mitigation:**
- Supabase Edge Functions have built-in limits (512MB)
- Add explicit size limits in middleware:
  ```typescript
  const contentLength = req.headers.get('Content-Length')
  if (contentLength && parseInt(contentLength) > 1_000_000) { // 1MB
    return new Response('Request too large', { status: 413 })
  }
  ```

### 7. No Request Throttling

**Limitation:**
- Rate limiting is per-IP, not per-user
- Shared IP addresses affect all users
- No per-user throttling

**Impact:**
- Legitimate users behind NAT affected
- Corporate networks may hit limits
- Cannot throttle specific users

**Mitigation:**
- Implement per-user rate limiting (requires authentication)
- Use user ID instead of IP for authenticated requests
- Add whitelisting for known corporate networks
- Monitor for shared IP issues

### 8. No Automated Security Scanning

**Limitation:**
- No automated vulnerability scanning
- Manual security reviews required
- Dependencies not automatically scanned

**Impact:**
- Vulnerabilities may go undetected
- Dependency vulnerabilities not caught
- Security debt accumulates

**Mitigation:**
- Implement automated security scanning:
  - npm audit for dependencies
  - Snyk or Dependabot for dependency monitoring
  - OWASP ZAP for application scanning
  - Regular manual security reviews

### 9. Firebase Legacy Compatibility

**Limitation:**
- Firebase auth maintained for compatibility
- Dual auth system increases attack surface
- Additional complexity in security model

**Impact:**
- Two auth systems to secure
- Potential for configuration errors
- Increased maintenance burden

**Mitigation:**
- Plan to deprecate Firebase auth
- Migrate all users to Supabase auth
- Remove Firebase dependencies when feasible
- Document migration path

### 10. Delete Account Function CORS

**Limitation:**
- delete-account function uses permissive CORS
- Allows cross-origin requests
- Less restrictive than other functions

**Impact:**
- Potential for CSRF on delete endpoint
- Could be abused from malicious sites
- Inconsistent with other security measures

**Mitigation:**
- Add CSRF protection to delete-account
- Restrict CORS to specific origins
- Require additional authentication
- Review and align with other functions

---

## Security Best Practices

### For Developers

**1. Never Expose Secrets:**
- Never commit service role keys
- Use environment variables for all secrets
- Rotate keys regularly

**2. Validate All Input:**
- Validate on client and server
- Use strict type checking
- Sanitize all user input

**3. Use Least Privilege:**
- Use anon key for client-side
- Use service role key only server-side
- Implement RLS policies

**4. Monitor and Alert:**
- Set up security event logging
- Alert on suspicious activity
- Review logs regularly

### For Operations

**1. Regular Security Audits:**
- Run security advisor monthly
- Review dependencies quarterly
- Conduct penetration testing annually

**2. Incident Response Plan:**
- Document response procedures
- Test incident response regularly
- Have emergency contacts ready

**3. Backup and Recovery:**
- Regular database backups
- Test restore procedures
- Document recovery steps

**4. Keep Updated:**
- Update dependencies regularly
- Apply security patches promptly
- Monitor security advisories

### For Users

**1. Strong Passwords:**
- Minimum 8 characters
- Uppercase and lowercase
- Numbers and special characters

**2. Secure Connections:**
- Always use HTTPS
- Avoid public Wi-Fi for sensitive operations
- Use VPN if necessary

**3. Session Management:**
- Log out after use
- Don't share credentials
- Report suspicious activity

---

## Security Roadmap

### Short Term (1-3 months)

- [ ] Implement database-backed rate limiting
- [ ] Add request size limits
- [ ] Enhance input validation
- [ ] Add CSRF protection to delete-account
- [ ] Implement automated dependency scanning

### Medium Term (3-6 months)

- [ ] Deprecate Firebase auth
- [ ] Implement per-user rate limiting
- [ ] Add IP-based access control
- [ ] Implement automated security scanning
- [ ] Add comprehensive audit logging

### Long Term (6-12 months)

- [ ] Implement hardware security modules (HSM)
- [ ] Add multi-factor authentication
- [ ] Implement advanced threat detection
- [ ] Add security analytics dashboard
- [ ] Conduct third-party security audit

---

## Security Contacts

For security concerns:
- **Security Team**: security@example.com
- **Emergency**: +1-555-SECURITY
- **Bug Bounty**: https://hackerone.com/example

**Vulnerability Disclosure Policy:**
1. Report vulnerabilities privately
2. Allow 90 days for remediation
3. Coordinate public disclosure
4. Credit researchers appropriately

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Guide](https://supabase.com/docs/guides/platform/security)
- [CSP Best Practices](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Rate Limiting Best Practices](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)
