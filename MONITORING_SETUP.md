# Monitoring and Logging Setup

This guide covers setting up comprehensive monitoring, logging, and alerting for the production application.

## Table of Contents

1. [Edge Function Logging](#edge-function-logging)
2. [Performance Monitoring](#performance-monitoring)
3. [Error Tracking](#error-tracking)
4. [Rate Limiting Monitoring](#rate-limiting-monitoring)
5. [Security Event Logging](#security-event-logging)
6. [Health Check Monitoring](#health-check-monitoring)
7. [Database Monitoring](#database-monitoring)
8. [Alerting Configuration](#alerting-configuration)
9. [Log Aggregation](#log-aggregation)

---

## Edge Function Logging

### Built-in Structured Logging

All Edge Functions use structured logging via the `Logger` class in `security-middleware.ts`.

**Log Format:**
```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "level": "info|warn|error|debug",
  "message": "Human-readable message",
  "context": {
    "key": "value"
  },
  "requestId": "uuid-v4",
  "duration": 123,
  "service": "edge-function",
  "environment": "production"
}
```

### Viewing Logs

**Via Supabase CLI:**
```bash
# View logs for a specific function
supabase functions logs auth-login

# View logs with tail (real-time)
supabase functions logs auth-login --tail

# View logs for all functions
supabase functions logs
```

**Via Supabase Dashboard:**
1. Go to Edge Functions
2. Select a function
3. Click "Logs" tab
4. Filter by time range, level, or search

### Log Levels

- **info**: Normal operation (successful requests, user actions)
- **warn**: Warning conditions (rate limit near threshold, deprecated usage)
- **error**: Error conditions (failed requests, exceptions)
- **debug**: Detailed debugging (only when `DEBUG=true`)

### Request ID Tracking

Every request gets a unique UUID for tracing:

```typescript
const requestId = generateRequestId()
Logger.info('Processing request', {}, requestId)
```

Use the request ID to trace a request across multiple logs and services.

---

## Performance Monitoring

### Built-in Performance Metrics

The `PerformanceMonitor` class tracks:

- **Total requests**: Counter of all requests
- **Error rate**: Percentage of failed requests
- **Average response time**: Mean request duration
- **Uptime**: Time since function started

**Accessing Metrics:**
```typescript
const metrics = PerformanceMonitor.getMetrics()
// Returns: { uptime, requests, errors, errorRate, avgResponseTime }
```

### Health Check Endpoint

The `/health-check` function provides real-time metrics:

```bash
curl https://your-project.supabase.co/functions/v1/health-check
```

**Response:**
```json
{
  "status": "healthy|degraded|unhealthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "uptime": 123456,
  "checks": {
    "database": {
      "status": "healthy",
      "responseTime": 50
    },
    "memory": {
      "status": "healthy",
      "usage": 0,
      "limit": 536870912
    },
    "cache": {
      "status": "healthy",
      "entries": 10,
      "size": 1024
    }
  },
  "metrics": {
    "totalRequests": 1000,
    "errorRate": 0.5,
    "avgResponseTime": 120
  }
}
```

### Monitoring Response Times

**Key Metrics to Track:**
- auth-login: Target < 500ms
- auth-signup: Target < 1000ms
- auth-verify: Target < 200ms
- auth-refresh: Target < 300ms
- health-check: Target < 100ms

**Set up monitoring:**
```bash
# Use a monitoring service to ping health-check every minute
# Example with UptimeRobot or Pingdom
```

---

## Error Tracking

### Supabase Error Logs

Edge Functions automatically log errors to Supabase:

```typescript
Logger.error('Error message', error, context, requestId)
```

**View errors in Dashboard:**
1. Edge Functions → Logs
2. Filter by level: "error"
3. Search by requestId for context

### External Error Tracking (Sentry)

For advanced error tracking, integrate Sentry:

**1. Install Sentry SDK in Edge Functions:**

```typescript
// Add to function imports
import * as Sentry from 'https://deno.land/x/sentry@7.77.0/mod.ts'

// Initialize Sentry
Sentry.init({
  dsn: Deno.env.get('SENTRY_DSN'),
  environment: Deno.env.get('ENVIRONMENT') || 'production',
  tracesSampleRate: 0.1, // 10% of requests for performance tracing
})

// Wrap function handler
try {
  // Your function logic
} catch (error) {
  Sentry.captureException(error)
  throw error
}
```

**2. Set environment variable:**
```bash
supabase secrets set SENTRY_DSN=your-sentry-dsn
```

### Error Categories to Monitor

1. **Authentication Errors** (401)
   - Invalid credentials
   - Expired tokens
   - Missing cookies

2. **Authorization Errors** (403)
   - CSRF token mismatch
   - Rate limit exceeded

3. **Validation Errors** (400)
   - Missing required fields
   - Invalid email format
   - Weak password

4. **Server Errors** (500)
   - Database connection failures
   - External service failures
   - Unexpected exceptions

---

## Rate Limiting Monitoring

### Rate Limit Metrics

Rate limiting is tracked per endpoint:

```typescript
// Check rate limit status
const rateLimitResult = await SecurityMiddleware.checkRateLimit(
  `login:${clientId}`,
  RATE_LIMIT_CONFIGS.login
)
// Returns: { allowed, resetTime, remaining }
```

**Rate Limit Configurations:**
- login: 5 requests per 15 minutes
- signup: 3 requests per hour
- refresh: 10 requests per 15 minutes
- verify: 100 requests per 15 minutes
- logout: 20 requests per 15 minutes
- health: 1000 requests per minute

### Monitoring Rate Limit Violations

**In logs:**
```bash
# Search for rate limit warnings
supabase functions logs auth-login | grep "Rate limit exceeded"
```

**Alert thresholds:**
- > 10 rate limit violations per hour on auth-login
- > 5 rate limit violations per hour on auth-signup
- Any rate limit violation on health-check

### Database-Backed Rate Limiting

For production, use the database-backed rate limiter:

```sql
-- Monitor rate limit table
SELECT 
  identifier,
  count,
  reset_time,
  created_at
FROM rate_limits
WHERE reset_time > NOW()
ORDER BY count DESC
LIMIT 100;
```

**Cleanup old records:**
```sql
-- Delete expired rate limit records
DELETE FROM rate_limits 
WHERE reset_time < NOW();
```

---

## Security Event Logging

### Security Events to Log

**Authentication Events:**
- Successful login (with user ID, IP, timestamp)
- Failed login attempts (with reason, IP)
- Password reset requests
- Account deletions

**Authorization Events:**
- CSRF token validation failures
- Rate limit violations
- Invalid token attempts

**Session Events:**
- Session creation
- Session refresh
- Session expiration
- Session invalidation

### Log Security Events

```typescript
// Example: Log failed login
Logger.warn('Login failed', {
  email: email,
  reason: 'invalid_credentials',
  ip: SecurityMiddleware.getClientIdentifier(req)
}, requestId)

// Example: Log CSRF violation
Logger.warn('CSRF token validation failed', {
  hasHeader: !!csrfToken,
  hasCookie: !!cookieToken,
  ip: SecurityMiddleware.getClientIdentifier(req)
}, requestId)
```

### Security Alert Triggers

Set up alerts for:
- > 5 failed login attempts from same IP in 5 minutes
- > 10 CSRF violations in 1 hour
- Any account deletion
- Unusual pattern of session refreshes

---

## Health Check Monitoring

### Automated Health Checks

Set up external monitoring to ping the health check endpoint:

**Recommended intervals:**
- Every 1 minute for production
- Every 5 minutes for staging

**Example with cron (if you have a server):**
```bash
# Add to crontab
*/1 * * * * curl -f https://your-project.supabase.co/functions/v1/health-check || alert-admin
```

**Example with UptimeRobot:**
1. Create monitor for `https://your-project.supabase.co/functions/v1/health-check`
2. Set check interval: 1 minute
3. Configure alert triggers:
   - Status not 200
   - Response time > 1 second
   - Response contains "status": "unhealthy"

### Health Check Response Codes

- **200**: All systems healthy
- **503**: Service degraded or unhealthy

### Custom Health Checks

Add custom checks to `health-check/index.ts`:

```typescript
// Example: Check external API
const externalApiCheck = await fetch('https://api.example.com/health')
const externalApiStatus = externalApiCheck.ok ? 'healthy' : 'unhealthy'

// Add to health status
healthStatus.checks.externalApi = {
  status: externalApiStatus,
  responseTime: externalApiTime
}
```

---

## Database Monitoring

### Supabase Dashboard Monitoring

**Database Metrics to Monitor:**

1. **Connection Pool**
   - Active connections
   - Idle connections
   - Max connections reached

2. **Query Performance**
   - Slow queries (> 1 second)
   - Query throughput
   - Cache hit ratio

3. **Storage**
   - Database size
   - Table bloat
   - Index usage

4. **Replication Lag** (if using read replicas)

### Enable Query Performance Insights

In Supabase Dashboard:
1. Database → Performance
2. Enable "Query Performance Insights"
3. Review slow queries weekly

### Monitor Key Tables

```sql
-- Monitor user growth
SELECT 
  DATE(created_at) as date,
  COUNT(*) as new_users
FROM profiles
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Monitor active sessions (approximate via auth logs)
SELECT 
  DATE(created_at) as date,
  COUNT(*) as logins
FROM auth.logs
WHERE event = 'user.login'
AND created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Monitor rate limit usage
SELECT 
  COUNT(*) as active_limits,
  AVG(count) as avg_count,
  MAX(count) as max_count
FROM rate_limits
WHERE reset_time > NOW();
```

---

## Alerting Configuration

### Alert Channels

**Recommended Alert Channels:**
- Email (for critical alerts)
- Slack (for team notifications)
- PagerDuty (for on-call)
- SMS (for emergency)

### Critical Alerts (Immediate)

**Trigger conditions:**
- Health check returns "unhealthy" for > 2 minutes
- Error rate > 10% for > 5 minutes
- Database connection failures
- All Edge Functions down

**Response time:** < 5 minutes

### Warning Alerts (Within 1 hour)

**Trigger conditions:**
- Health check returns "degraded" for > 10 minutes
- Error rate > 5% for > 15 minutes
- Rate limit violations > 50/hour
- Response time > 1 second average

**Response time:** < 1 hour

### Info Alerts (Daily digest)

**Trigger conditions:**
- Daily error summary
- Weekly performance metrics
- Monthly security review

**Response time:** Next business day

### Setting Up Alerts

**Via Supabase Dashboard:**
1. Settings → Alerts
2. Configure alert rules
3. Set notification channels

**Via External Monitoring (Sentry/Datadog):**
```typescript
// Example: Sentry alert rules
// - Error rate > 5% for 5 minutes
// - Response time P95 > 1 second
// - Any 5xx error
```

---

## Log Aggregation

### Supabase Log Retention

- **Edge Function logs**: Retained for 7 days (free tier)
- **Database logs**: Retained for 7 days (free tier)
- **Auth logs**: Retained for 7 days (free tier)

### External Log Aggregation (Optional)

For longer retention and advanced analysis:

**Option 1: Logstash + Elasticsearch**
```bash
# Forward Supabase logs to Logstash
# Requires custom log shipper
```

**Option 2: CloudWatch Logs (AWS)**
```typescript
// Add CloudWatch logging to Edge Functions
import { CloudWatchLogsClient, PutLogEventsCommand } from 'https://esm.sh/@aws-sdk/client-cloudwatch-logs'

const client = new CloudWatchLogsClient({
  region: Deno.env.get('AWS_REGION'),
  credentials: {
    accessKeyId: Deno.env.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: Deno.env.get('AWS_SECRET_ACCESS_KEY')
  }
})

// Send logs
await client.send(new PutLogEventsCommand({
  logGroupName: 'supabase-edge-functions',
  logStreamName: 'auth-login',
  logEvents: [{ message: JSON.stringify(logEntry), timestamp: Date.now() }]
}))
```

**Option 3: Loki + Grafana**
```bash
# Use Grafana Loki for log aggregation
# Forward logs via Loki API
```

### Log Analysis Queries

**Example: Find all failed logins from an IP:**
```bash
supabase functions logs auth-login | grep "Login failed" | grep "192.168.1.1"
```

**Example: Count errors by type:**
```bash
supabase functions logs | grep '"level":"error"' | jq -r '.message' | sort | uniq -c
```

---

## Monitoring Dashboard Setup

### Recommended Dashboard Layout

**Overview Dashboard:**
1. Health check status (uptime gauge)
2. Total requests (line chart)
3. Error rate (line chart)
4. Average response time (line chart)
5. Active users (counter)
6. Rate limit violations (counter)

**Auth Dashboard:**
1. Login success rate (gauge)
2. Signup rate (line chart)
3. Failed login attempts (line chart)
4. Active sessions (counter)
5. CSRF violations (counter)

**Database Dashboard:**
1. Connection pool usage (gauge)
2. Query performance (line chart)
3. Database size (line chart)
4. Slow queries (table)

### Using Grafana

**1. Set up Supabase as data source:**
```bash
# Use Supabase Postgres connection string
# Format: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

**2. Import dashboard panels:**
- Health check status
- Request metrics
- Error rates
- Database performance

---

## Monitoring Best Practices

### 1. Set Realistic Thresholds

- Don't alert on every error
- Use baselines from normal traffic
- Adjust thresholds after deployment

### 2. Monitor the Right Metrics

- Focus on user-facing metrics (response time, error rate)
- Don't over-monitor internal metrics
- Correlate metrics with user impact

### 3. Use Alert Escalation

- Start with low-severity alerts
- Escalate if not resolved
- Have clear on-call procedures

### 4. Regular Review

- Weekly: Review error logs and slow queries
- Monthly: Review alert thresholds and adjust
- Quarterly: Review monitoring strategy

### 5. Test Alerts

- Regularly test alert channels work
- Verify alert notifications are received
- Practice on-call response procedures

---

## Troubleshooting Monitoring Issues

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common monitoring issues.
