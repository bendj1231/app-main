# Troubleshooting Guide

This guide provides solutions to common issues encountered during deployment, operation, and maintenance of the application.

## Table of Contents

1. [Authentication Issues](#authentication-issues)
2. [Edge Function Issues](#edge-function-issues)
3. [Database Issues](#database-issues)
4. [Rate Limiting Issues](#rate-limiting-issues)
5. [CSRF Protection Issues](#csrf-protection-issues)
6. [Performance Issues](#performance-issues)
7. [Deployment Issues](#deployment-issues)
8. [Monitoring Issues](#monitoring-issues)
9. [Rollback Procedures](#rollback-procedures)
10. [Emergency Procedures](#emergency-procedures)

---

## Authentication Issues

### Issue: Login Returns "Invalid CSRF Token"

**Symptoms:**
- Login request fails with 403 error
- Error message: "Invalid CSRF token"
- User cannot authenticate

**Causes:**
1. CSRF token not set in cookie
2. CSRF token expired (> 24 hours)
3. CSRF token mismatch between header and cookie
4. Browser blocking cookies

**Solutions:**

**1. Check CSRF Token in Cookies:**
```bash
# In browser console
document.cookie
# Should contain: csrf-token=<value>
```

**2. Clear Cookies and Retry:**
```javascript
// In browser console
document.cookie.split(";").forEach(c => document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"));
location.reload();
```

**3. Check Cookie Settings:**
- Ensure cookies are enabled in browser
- Check for third-party cookie blocking
- Verify SameSite policy compatibility

**4. Verify CSRF Token Header:**
```bash
# Check request headers
curl -X POST https://your-project.supabase.co/functions/v1/auth-login \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: your-token" \
  -d '{"email":"test@example.com","password":"password"}'
```

**5. Check Edge Function Logs:**
```bash
supabase functions logs auth-login | grep "CSRF"
```

---

### Issue: Session Expired Immediately

**Symptoms:**
- User logs in successfully
- Session expires within seconds
- Frequent re-authentication required

**Causes:**
1. Clock skew between client and server
2. Access token expiration misconfiguration
3. Session storage issues
4. Token refresh failure

**Solutions:**

**1. Check System Clock:**
```bash
# Check client time
date

# Check server time (via health check)
curl https://your-project.supabase.co/functions/v1/health-check
```

**2. Verify Token Expiration:**
```typescript
// Check token expiration in Edge Function
const expiresAt = Date.now() + (data.session.expires_in * 1000)
console.log('Token expires at:', new Date(expiresAt))
```

**3. Check Session Storage:**
```javascript
// In browser console
sessionStorage.getItem('supabase.auth.token')
```

**4. Enable Debug Logging:**
```bash
# Set environment variable
supabase secrets set DEBUG=true

# View detailed logs
supabase functions logs auth-login
```

**5. Test Token Refresh:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/auth-refresh \
  -H "Cookie: sb-refresh-token=your-token"
```

---

### Issue: "Too Many Login Attempts" Error

**Symptoms:**
- Login request fails with 429 error
- Error message: "Too many login attempts"
- Rate limit exceeded

**Causes:**
1. Exceeded rate limit (5 per 15 minutes)
2. Shared IP address (NAT/proxy)
3. Automated login attempts
4. Malicious activity

**Solutions:**

**1. Check Rate Limit Status:**
```bash
# View rate limit headers in response
curl -I https://your-project.supabase.co/functions/v1/auth-login
# Look for: X-RateLimit-Remaining, Retry-After
```

**2. Wait for Reset:**
- Login rate limit: 15 minutes
- Signup rate limit: 1 hour
- Refresh rate limit: 15 minutes

**3. Check Database Rate Limits:**
```sql
SELECT identifier, count, reset_time
FROM rate_limits
WHERE identifier LIKE 'login:%'
ORDER BY reset_time DESC
LIMIT 10;
```

**4. Reset Rate Limit (Emergency Only):**
```sql
-- WARNING: Only use in emergencies
DELETE FROM rate_limits WHERE identifier = 'login:IP_ADDRESS';
```

**5. Implement IP Whitelist:**
- For legitimate users behind NAT
- Add to Cloudflare or WAF
- Document in security policy

---

### Issue: Cookies Not Being Set

**Symptoms:**
- Login succeeds but cookies not set
- Subsequent requests fail authentication
- No cookies visible in browser

**Causes:**
1. HTTP instead of HTTPS
2. Cookie domain mismatch
3. Browser privacy settings
4. SameSite policy issues

**Solutions:**

**1. Verify HTTPS:**
```bash
# Ensure using HTTPS
curl -I https://your-domain.com
# Should return: HTTP/2 200
```

**2. Check Cookie Domain:**
```typescript
// In Edge Function
response.headers.append('Set-Cookie',
  `sb-access-token=token; ` +
  `Path=/; ` +
  `Domain=.your-domain.com; ` +  // Add if needed
  `HttpOnly; ` +
  `Secure; ` +
  `SameSite=Strict`
)
```

**3. Check Browser Settings:**
- Enable third-party cookies
- Disable strict tracking protection
- Check cookie blocking settings

**4. Test Cookie Setting:**
```bash
# Test with curl
curl -X POST https://your-project.supabase.co/functions/v1/auth-login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  -v
# Look for Set-Cookie headers
```

**5. Check Response Headers:**
```bash
curl -I https://your-project.supabase.co/functions/v1/auth-login
# Should include Set-Cookie headers
```

---

## Edge Function Issues

### Issue: Edge Function Returns 500 Error

**Symptoms:**
- Edge Function fails with 500 error
- Generic error message returned
- No specific error details

**Causes:**
1. Unhandled exception in function
2. Missing environment variables
3. Database connection failure
4. External service failure

**Solutions:**

**1. Check Function Logs:**
```bash
supabase functions logs auth-login
```

**2. Check Environment Variables:**
```bash
# List secrets
supabase secrets list

# Verify required variables
supabase secrets list | grep SUPABASE
```

**3. Test Database Connection:**
```bash
# Via health check
curl https://your-project.supabase.co/functions/v1/health-check
```

**4. Add Detailed Logging:**
```typescript
// In Edge Function
try {
  // Your code
} catch (error) {
  Logger.error('Detailed error', error, { context: 'detailed' }, requestId)
  throw error
}
```

**5. Test Function Locally:**
```bash
# Using Supabase CLI
supabase functions serve auth-login
```

---

### Issue: Edge Function Deployment Fails

**Symptoms:**
- Deployment command fails
- Error: "Deployment failed"
- Function not updated

**Causes:**
1. Syntax error in function code
2. Missing dependencies
3. Supabase CLI version mismatch
4. Network issues

**Solutions:**

**1. Check Function Syntax:**
```bash
# Lint TypeScript
deno check supabase/functions/auth-login/index.ts
```

**2. Update Supabase CLI:**
```bash
npm install -g supabase@latest
supabase --version
```

**3. Check Dependencies:**
```typescript
// Ensure imports are correct
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
```

**4. Test Deployment with Dry Run:**
```bash
supabase functions deploy auth-login --dry-run
```

**5. Check Network Connection:**
```bash
# Test Supabase connectivity
curl https://api.supabase.com
```

---

### Issue: Edge Function Timeout

**Symptoms:**
- Function takes too long to respond
- Request times out
- 504 Gateway Timeout error

**Causes:**
1. Slow database queries
2. External API latency
3. Large payload processing
4. Infinite loops

**Solutions:**

**1. Check Function Duration:**
```bash
# View logs with duration
supabase functions logs auth-login | grep "duration"
```

**2. Optimize Database Queries:**
```sql
-- Add indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_user_app_access_user_id ON user_app_access(user_id);
```

**3. Add Timeout Handling:**
```typescript
// Add timeout to external requests
const controller = new AbortController()
const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

try {
  const response = await fetch(url, { signal: controller.signal })
  clearTimeout(timeoutId)
} catch (error) {
  if (error.name === 'AbortError') {
    throw new Error('Request timeout')
  }
  throw error
}
```

**4. Implement Pagination:**
```typescript
// Don't fetch all data at once
const { data } = await supabase
  .from('profiles')
  .select('*')
  .range(0, 100) // Paginate
```

**5. Use Caching:**
```typescript
// Cache frequently accessed data
const cached = Cache.get('user-profile')
if (cached) {
  return cached
}
```

---

## Database Issues

### Issue: Database Connection Failed

**Symptoms:**
- Edge Function cannot connect to database
- Error: "Connection refused"
- Health check shows unhealthy database

**Causes:**
1. Database is paused
2. Network connectivity issues
3. Invalid credentials
4. Connection pool exhausted

**Solutions:**

**1. Check Database Status:**
```bash
# Via Supabase Dashboard
# Database → Status
```

**2. Resume Database:**
```bash
# Via Supabase CLI
supabase db resume
```

**3. Check Connection String:**
```bash
# Verify environment variables
supabase secrets list | grep SUPABASE
```

**4. Test Connection:**
```sql
-- Via SQL Editor
SELECT NOW();
```

**5. Check Connection Pool:**
```sql
-- View active connections
SELECT count(*) FROM pg_stat_activity;
```

---

### Issue: RLS Policy Blocking Access

**Symptoms:**
- Query returns no results
- Error: "Permission denied"
- User cannot access own data

**Causes:**
1. RLS policy too restrictive
2. Policy not matching user ID
3. Policy disabled for table
4. Auth context not passed

**Solutions:**

**1. Check RLS Status:**
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

**2. Review RLS Policies:**
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';
```

**3. Test Policy with Auth Context:**
```sql
-- Set auth context
SET local jwt.claims.sub = 'user-id';

-- Test query
SELECT * FROM profiles WHERE id = 'user-id';
```

**4. Update RLS Policy:**
```sql
-- Example: Allow users to see own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);
```

**5. Disable RLS Temporarily (Emergency Only):**
```sql
-- WARNING: Only for debugging
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
-- Re-enable after debugging
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

---

### Issue: Slow Database Queries

**Symptoms:**
- Queries take > 1 second
- Application feels slow
- Database CPU high

**Causes:**
1. Missing indexes
2. Inefficient queries
3. Large table scans
4. Lock contention

**Solutions:**

**1. Enable Query Performance Insights:**
```bash
# Via Supabase Dashboard
# Database → Performance → Enable Query Performance Insights
```

**2. Identify Slow Queries:**
```sql
-- View slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

**3. Add Missing Indexes:**
```sql
-- Create index on frequently filtered columns
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);
```

**4. Optimize Queries:**
```sql
-- Before: Full table scan
SELECT * FROM profiles WHERE email LIKE '%@example.com';

-- After: Use proper index
SELECT * FROM profiles WHERE email = 'user@example.com';
```

**5. Analyze Table Statistics:**
```sql
-- Update table statistics
ANALYZE profiles;
ANALYZE pilot_licensure_experience;
```

---

## Rate Limiting Issues

### Issue: Rate Limit Not Working

**Symptoms:**
- Requests not rate limited
- Can make unlimited requests
- Rate limit headers not present

**Causes:**
1. Rate limiter not initialized
2. Client identification failing
3. Configuration error
4. Cold start resetting limits

**Solutions:**

**1. Check Rate Limit Config:**
```typescript
// Verify configuration
console.log(RATE_LIMIT_CONFIGS.login)
// Should output: { maxRequests: 5, windowMs: 900000 }
```

**2. Check Client Identification:**
```typescript
// Log client IP
const ip = SecurityMiddleware.getClientIdentifier(req)
Logger.info('Client IP', { ip }, requestId)
```

**3. Test Rate Limit:**
```bash
# Make multiple requests quickly
for i in {1..10}; do
  curl https://your-project.supabase.co/functions/v1/auth-login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password"}'
done
```

**4. Enable Database-Backed Rate Limiting:**
```sql
-- Create rate_limits table
-- See PRODUCTION_DEPLOYMENT_GUIDE.md
```

**5. Check Rate Limit Store:**
```typescript
// Add logging to rate limiter
Logger.info('Rate limit check', {
  identifier,
  count: record?.count,
  resetTime: record?.resetTime
}, requestId)
```

---

### Issue: Legitimate Users Rate Limited

**Symptoms:**
- Valid users hit rate limits
- Corporate networks affected
- Shared IP addresses blocked

**Causes:**
1. Multiple users behind NAT
2. Proxy/VPN usage
3. Rate limits too strict
4. IP-based identification only

**Solutions:**

**1. Implement User-Based Rate Limiting:**
```typescript
// Use user ID instead of IP for authenticated requests
const identifier = userId ? `user:${userId}` : `ip:${clientId}`
```

**2. Add IP Whitelist:**
```typescript
const whitelistedIPs = ['192.168.1.1', '10.0.0.1']
if (whitelistedIPs.includes(clientId)) {
  return { allowed: true, remaining: Infinity }
}
```

**3. Increase Rate Limits:**
```typescript
export const RATE_LIMIT_CONFIGS = {
  login: { maxRequests: 10, windowMs: 15 * 60 * 1000 }, // Increased from 5
  // ...
}
```

**4. Implement Rate Limit Bypass:**
```typescript
// Add API key for trusted clients
const apiKey = req.headers.get('X-API-Key')
if (isValidApiKey(apiKey)) {
  return { allowed: true, remaining: Infinity }
}
```

---

## CSRF Protection Issues

### Issue: CSRF Token Mismatch

**Symptoms:**
- CSRF validation fails
- 403 Forbidden error
- Token in header doesn't match cookie

**Causes:**
1. Token not set in cookie
2. Token expired
3. Multiple tabs with different tokens
4. Cookie not sent with request

**Solutions:**

**1. Verify Token in Cookie:**
```javascript
// In browser console
document.cookie.match(/csrf-token=([^;]+)/)?.[1]
```

**2. Check Token in Header:**
```bash
# Verify header is sent
curl -X POST https://your-project.supabase.co/functions/v1/auth-login \
  -H "X-CSRF-Token: your-token" \
  -H "Cookie: csrf-token=your-token" \
  -d '{"email":"test@example.com","password":"password"}' \
  -v
```

**3. Regenerate CSRF Token:**
```bash
# Clear cookies and re-login
document.cookie = 'csrf-token=; Path=/; Max-Age=0'
location.reload()
```

**4. Check Token Rotation:**
```typescript
// Ensure new token is generated on refresh
const newCsrfToken = SecurityMiddleware.generateCSRFToken()
SecurityMiddleware.setCSRFCookie(response, newCsrfToken)
```

**5. Disable CSRF for Testing (Not Recommended):**
```typescript
// Only for development
if (Deno.env.get('ENVIRONMENT') === 'development') {
  // Skip CSRF validation
}
```

---

## Performance Issues

### Issue: Slow Response Times

**Symptoms:**
- API responses > 1 second
- Poor user experience
- Health check shows degraded

**Causes:**
1. Database query slowness
2. Network latency
3. Large payload processing
4. Edge Function cold starts

**Solutions:**

**1. Monitor Response Times:**
```bash
# View average response time
curl https://your-project.supabase.co/functions/v1/health-check
# Check metrics.avgResponseTime
```

**2. Optimize Database Queries:**
```sql
-- Use EXPLAIN ANALYZE
EXPLAIN ANALYZE SELECT * FROM profiles WHERE email = 'test@example.com';
```

**3. Implement Caching:**
```typescript
const cached = Cache.get('user-profile')
if (cached) {
  return cached
}
```

**4. Reduce Payload Size:**
```typescript
// Select only needed fields
const { data } = await supabase
  .from('profiles')
  .select('id, email, display_name') // Instead of *
```

**5. Keep Functions Warm:**
```bash
# Ping health check every 5 minutes
*/5 * * * * curl https://your-project.supabase.co/functions/v1/health-check
```

---

### Issue: High Memory Usage

**Symptoms:**
- Edge Function memory limit reached
- 502 Bad Gateway errors
- Function crashes

**Causes:**
1. Memory leak
2. Large data processing
3. Cache too large
4. Infinite loops

**Solutions:**

**1. Monitor Memory Usage:**
```typescript
// Check cache size
const stats = Cache.getStats()
console.log('Cache size:', stats.currentSize)
```

**2. Clear Cache:**
```typescript
Cache.clear()
```

**3. Process Data in Batches:**
```typescript
// Instead of loading all data
for (const batch of chunks(largeData, 100)) {
  await processBatch(batch)
}
```

**4. Limit Cache Size:**
```typescript
const CACHE_CONFIGS = {
  userProfile: { ttlMs: 5 * 60 * 1000, maxSize: 10 * 1024 }, // Reduced from 50KB
}
```

**5. Add Memory Monitoring:**
```typescript
// Log memory usage periodically
setInterval(() => {
  const stats = Cache.getStats()
  Logger.info('Memory usage', stats)
}, 60000)
```

---

## Deployment Issues

### Issue: Build Fails

**Symptoms:**
- `npm run build` fails
- TypeScript errors
- Missing dependencies

**Causes:**
1. Type errors
2. Missing dependencies
3. Configuration errors
4. Node version mismatch

**Solutions:**

**1. Check TypeScript Errors:**
```bash
npx tsc --noEmit
```

**2. Install Dependencies:**
```bash
npm install
npm audit fix
```

**3. Check Node Version:**
```bash
node --version
# Should match package.json engines
```

**4. Clean Build:**
```bash
rm -rf node_modules dist
npm install
npm run build
```

**5. Check Vite Config:**
```typescript
// Verify vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
})
```

---

### Issue: Environment Variables Not Set

**Symptoms:**
- Application uses wrong configuration
- Features not working
- Connection errors

**Causes:**
1. Variables not set in production
2. Wrong variable names
3. Variables not loaded
4. Case sensitivity issues

**Solutions:**

**1. Check Environment Variables:**
```bash
# For frontend (Vercel/Netlify)
# Check dashboard environment variables

# For Edge Functions
supabase secrets list
```

**2. Set Missing Variables:**
```bash
# Supabase Edge Functions
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-key
```

**3. Verify Variable Names:**
```typescript
// Check in code
const url = Deno.env.get('SUPABASE_URL')
console.log('SUPABASE_URL:', url)
```

**4. Check Variable Loading:**
```javascript
// Check in browser console
console.log(import.meta.env.VITE_SUPABASE_URL)
```

**5. Use .env.example:**
```bash
# Create .env.example
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Monitoring Issues

### Issue: Logs Not Appearing

**Symptoms:**
- No logs in Supabase Dashboard
- Logs not updating
- Search returns no results

**Causes:**
1. Function not deployed
2. Logging not enabled
3. Time zone mismatch
4. Log retention expired

**Solutions:**

**1. Verify Function Deployed:**
```bash
supabase functions list
```

**2. Check Log Retention:**
```bash
# Free tier: 7 days
# Pro tier: 30 days
```

**3. Test Logging:**
```typescript
Logger.info('Test log', { test: true }, requestId)
```

**4. Check Time Zone:**
```bash
# Dashboard uses UTC
date -u
```

**5. Use External Logging:**
```typescript
// Forward to external service (Sentry, LogRocket)
// See MONITORING_SETUP.md
```

---

### Issue: Health Check Fails

**Symptoms:**
- Health check returns 503
- Status shows "unhealthy"
- Database check fails

**Causes:**
1. Database connection failed
2. Cache full
3. High error rate
4. Slow response time

**Solutions:**

**1. Check Database Connection:**
```bash
curl https://your-project.supabase.co/functions/v1/health-check
# Check checks.database.status
```

**2. Clear Cache:**
```typescript
Cache.clear()
```

**3. Check Error Rate:**
```bash
# View metrics in health check response
curl https://your-project.supabase.co/functions/v1/health-check
# Check metrics.errorRate
```

**4. Reduce Response Time:**
```sql
-- Optimize slow queries
-- See Database Issues section
```

**5. Restart Function:**
```bash
supabase functions deploy health-check
```

---

## Rollback Procedures

### Rollback Edge Function

```bash
# List versions (if versioned)
supabase functions list

# Redeploy previous version
supabase functions deploy auth-login --version previous-version

# Or redeploy from local backup
cd /path/to/backup
supabase functions deploy auth-login
```

### Rollback Database Migration

```bash
# View migration history
supabase migration list

# Rollback to specific migration
supabase migration down --version <version>

# Or reset database (emergency)
supabase db reset
```

### Rollback Frontend

**Vercel:**
```bash
vercel rollback
```

**Netlify:**
```bash
netlify rollback
```

**Custom:**
```bash
# Restore from backup
sudo cp -r /backups/previous-dist/* /var/www/html/
```

---

## Emergency Procedures

### Database Down

**1. Check Status:**
```bash
curl https://your-project.supabase.co/functions/v1/health-check
```

**2. Resume Database:**
```bash
supabase db resume
```

**3. Check Maintenance Mode:**
```bash
# Via Supabase Dashboard
# Settings → Database → Maintenance Mode
```

**4. Contact Support:**
- Supabase Support: support@supabase.com
- Emergency: +1-555-EMERGENCY

### All Edge Functions Down

**1. Check Supabase Status:**
```bash
# https://status.supabase.com
```

**2. Redeploy All Functions:**
```bash
supabase functions deploy
```

**3. Check Environment Variables:**
```bash
supabase secrets list
```

**4. Verify Network:**
```bash
curl https://api.supabase.com
```

### Security Incident

**1. Contain:**
- Disable affected functions
- Rotate all secrets
- Enable maintenance mode

**2. Investigate:**
- Review logs for suspicious activity
- Check for data breaches
- Identify attack vector

**3. Remediate:**
- Patch vulnerabilities
- Update RLS policies
- Implement additional security measures

**4. Communicate:**
- Notify stakeholders
- Document incident
- Post-mortem analysis

---

## Getting Help

### Documentation

- [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md)
- [MONITORING_SETUP.md](./MONITORING_SETUP.md)
- [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md)
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Community

- Supabase Discord: https://supabase.com/discord
- GitHub Issues: https://github.com/supabase/supabase/issues
- Stack Overflow: https://stackoverflow.com/questions/tagged/supabase

### Support

- **Email**: support@example.com
- **Slack**: #support-channel
- **Emergency**: +1-555-EMERGENCY

### Escalation Path

1. Check documentation
2. Search community forums
3. Create support ticket
4. Contact on-call engineer
5. Emergency escalation

---

## Common Error Codes

| Error Code | Meaning | Solution |
|------------|---------|----------|
| 400 | Bad Request | Check request body and headers |
| 401 | Unauthorized | Check authentication tokens |
| 403 | Forbidden | Check CSRF token and permissions |
| 429 | Too Many Requests | Wait for rate limit reset |
| 500 | Internal Server Error | Check function logs |
| 503 | Service Unavailable | Check health status |
| 504 | Gateway Timeout | Check function duration |

---

## Prevention

### Regular Maintenance

**Weekly:**
- Review error logs
- Check performance metrics
- Verify rate limit effectiveness

**Monthly:**
- Update dependencies
- Review security advisor
- Test backup/restore procedures

**Quarterly:**
- Conduct security audit
- Review and update documentation
- Test disaster recovery procedures

### Monitoring Setup

See [MONITORING_SETUP.md](./MONITORING_SETUP.md) for comprehensive monitoring configuration.

### Security Best Practices

See [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md) for security guidelines.
