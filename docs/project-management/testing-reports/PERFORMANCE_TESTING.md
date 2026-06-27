# Performance Testing Recommendations
## Authentication System - Cookie-Based Auth Implementation

**Date:** April 18, 2026  
**Target:** Enterprise-level application (500+ users)  
**Scope:** Authentication flows, Edge Functions, Session management

---

## Executive Summary

This document provides comprehensive performance testing recommendations for the cookie-based authentication system. The recommendations cover load testing, stress testing, latency benchmarks, and performance monitoring strategies suitable for an enterprise application serving 500+ users.

**Target Performance Metrics:**
- Login: < 500ms (P95), < 1s (P99)
- Signup: < 1s (P95), < 2s (P99)
- Token Refresh: < 300ms (P95), < 500ms (P99)
- Session Verify: < 200ms (P95), < 400ms (P99)
- Logout: < 200ms (P95), < 400ms (P99)

---

## 1. Load Testing Strategy

### 1.1 Baseline Performance Testing

**Objective:** Establish baseline performance metrics for all auth endpoints under normal load.

**Test Scenarios:**

#### Scenario 1.1.1: Single User Baseline
- **Users:** 1
- **Duration:** 10 minutes
- **Endpoints:** All auth endpoints
- **Purpose:** Establish single-user baseline

**Script Example (k6):**
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 1,
  duration: '10m',
};

export default function () {
  // Login
  const loginRes = http.post('https://your-project.supabase.co/functions/v1/auth-login', 
    JSON.stringify({
      email: 'test@example.com',
      password: 'TestPassword123'
    }), {
      headers: { 'Content-Type': 'application/json' }
    }
  );

  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'login response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);

  // Session verify
  const verifyRes = http.post('https://your-project.supabase.co/functions/v1/auth-verify', 
    JSON.stringify({}), {
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': loginRes.headers['Set-Cookie']
      }
    }
  );

  check(verifyRes, {
    'verify status is 200': (r) => r.status === 200,
    'verify response time < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
}
```

**Success Criteria:**
- All endpoints return 200
- Response times meet target metrics
- No errors or timeouts

---

#### Scenario 1.1.2: Normal Load (50 Users)
- **Users:** 50 concurrent
- **Duration:** 30 minutes
- **Ramp-up:** 5 minutes
- **Purpose:** Simulate normal daily usage

**k6 Configuration:**
```javascript
export let options = {
  stages: [
    { duration: '5m', target: 50 },  // Ramp up
    { duration: '20m', target: 50 }, // Sustain
    { duration: '5m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
  },
};
```

**Success Criteria:**
- < 1% error rate
- P95 response time < 500ms for login
- P99 response time < 1s for login
- No memory leaks in Edge Functions

---

#### Scenario 1.1.3: Peak Load (100 Users)
- **Users:** 100 concurrent
- **Duration:** 15 minutes
- **Ramp-up:** 3 minutes
- **Purpose:** Simulate peak usage periods

**k6 Configuration:**
```javascript
export let options = {
  stages: [
    { duration: '3m', target: 100 },
    { duration: '10m', target: 100 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000', 'p(99)<2000'],
    http_req_failed: ['rate<0.05'],
  },
};
```

**Success Criteria:**
- < 5% error rate
- P95 response time < 1s
- P99 response time < 2s
- System remains stable

---

#### Scenario 1.1.4: Sustained Load (500 Users)
- **Users:** 500 concurrent
- **Duration:** 1 hour
- **Ramp-up:** 10 minutes
- **Purpose:** Test for sustained enterprise usage

**k6 Configuration:**
```javascript
export let options = {
  stages: [
    { duration: '10m', target: 500 },
    { duration: '40m', target: 500 },
    { duration: '10m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1500', 'p(99)<3000'],
    http_req_failed: ['rate<0.1'],
  },
};
```

**Success Criteria:**
- < 10% error rate
- P95 response time < 1.5s
- P99 response time < 3s
- No degradation over time
- Memory usage stable

---

### 1.2 Stress Testing

**Objective:** Determine breaking point and system behavior under extreme load.

#### Scenario 1.2.1: Stress Test (1000 Users)
- **Users:** 1000 concurrent
- **Duration:** 10 minutes
- **Ramp-up:** 2 minutes
- **Purpose:** Find system breaking point

**k6 Configuration:**
```javascript
export let options = {
  stages: [
    { duration: '2m', target: 1000 },
    { duration: '5m', target: 1000 },
    { duration: '3m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    http_req_failed: ['rate<0.2'],
  },
};
```

**Metrics to Monitor:**
- Error rate escalation
- Response time degradation
- Edge Function cold starts
- Database connection pool exhaustion
- Memory usage spikes

**Success Criteria:**
- System degrades gracefully
- No complete failures
- Clear error messages
- Automatic recovery after load reduces

---

#### Scenario 1.2.2: Spike Test (500 to 1000 Users)
- **Users:** Spike from 500 to 1000
- **Duration:** 5 minutes
- **Spike duration:** 1 minute
- **Purpose:** Test sudden traffic spikes

**k6 Configuration:**
```javascript
export let options = {
  stages: [
    { duration: '2m', target: 500 },
    { duration: '30s', target: 1000 },  // Spike
    { duration: '30s', target: 500 },  // Drop
    { duration: '2m', target: 0 },
  ],
};
```

**Success Criteria:**
- System handles spike without crashing
- Graceful degradation during spike
- Quick recovery after spike
- No data corruption

---

### 1.3 Endurance Testing

**Objective:** Verify system stability over extended periods.

#### Scenario 1.3.1: 24-Hour Endurance Test
- **Users:** 50 concurrent
- **Duration:** 24 hours
- **Purpose:** Detect memory leaks and long-term issues

**k6 Configuration:**
```javascript
export let options = {
  stages: [
    { duration: '5m', target: 50 },
    { duration: '23h50m', target: 50 },
    { duration: '5m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.05'],
  },
};
```

**Metrics to Monitor:**
- Memory usage over time
- Response time trends
- Error rate trends
- Database connection pool health
- Edge Function restarts

**Success Criteria:**
- No memory leaks
- Stable response times over 24 hours
- Error rate remains constant
- No performance degradation

---

## 2. Latency Benchmarks

### 2.1 Endpoint-Specific Benchmarks

#### auth-login Endpoint

**Target Metrics:**
- P50: < 200ms
- P95: < 500ms
- P99: < 1s

**Test Script:**
```javascript
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 10,
  duration: '5m',
  thresholds: {
    http_req_duration: ['p(50)<200', 'p(95)<500', 'p(99)<1000'],
  },
};

export default function () {
  const res = http.post('https://your-project.supabase.co/functions/v1/auth-login',
    JSON.stringify({
      email: 'test@example.com',
      password: 'TestPassword123'
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(res, {
    'status is 200': (r) => r.status === 200,
    'P50 < 200ms': (r) => r.timings.duration < 200,
    'P95 < 500ms': (r) => r.timings.duration < 500,
  });
}
```

**Optimization Recommendations:**
- Implement connection pooling
- Cache frequently accessed data
- Optimize database queries
- Use CDN for static assets

---

#### auth-signup Endpoint

**Target Metrics:**
- P50: < 300ms
- P95: < 1s
- P99: < 2s

**Note:** Signup is slower due to multiple database writes (profile, app access, pilot data).

**Test Script:**
```javascript
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 5,
  duration: '5m',
  thresholds: {
    http_req_duration: ['p(50)<300', 'p(95)<1000', 'p(99)<2000'],
  },
};

export default function () {
  const timestamp = Date.now();
  const res = http.post('https://your-project.supabase.co/functions/v1/auth-signup',
    JSON.stringify({
      email: `test${timestamp}@example.com`,
      password: 'TestPass123',
      userData: {
        fullName: 'Test User',
        pilotId: 'TEST123',
      }
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(res, {
    'status is 200': (r) => r.status === 200,
    'P50 < 300ms': (r) => r.timings.duration < 300,
    'P95 < 1s': (r) => r.timings.duration < 1000,
  });
}
```

**Optimization Recommendations:**
- Batch database writes
- Use transactions for consistency
- Implement async processing for non-critical data
- Queue email notifications

---

#### auth-refresh Endpoint

**Target Metrics:**
- P50: < 150ms
- P95: < 300ms
- P99: < 500ms

**Test Script:**
```javascript
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 20,
  duration: '5m',
  thresholds: {
    http_req_duration: ['p(50)<150', 'p(95)<300', 'p(99)<500'],
  },
};

export default function () {
  const res = http.post('https://your-project.supabase.co/functions/v1/auth-refresh',
    JSON.stringify({}),
    { 
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': 'sb-refresh-token=valid-token-here'
      }
    }
  );

  check(res, {
    'status is 200': (r) => r.status === 200,
    'P50 < 150ms': (r) => r.timings.duration < 150,
    'P95 < 300ms': (r) => r.timings.duration < 300,
  });
}
```

**Optimization Recommendations:**
- Cache refresh token validation
- Implement token pre-refresh
- Use in-memory cache for active sessions

---

#### auth-verify Endpoint

**Target Metrics:**
- P50: < 100ms
- P95: < 200ms
- P99: < 400ms

**Test Script:**
```javascript
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 50,
  duration: '5m',
  thresholds: {
    http_req_duration: ['p(50)<100', 'p(95)<200', 'p(99)<400'],
  },
};

export default function () {
  const res = http.post('https://your-project.supabase.co/functions/v1/auth-verify',
    JSON.stringify({}),
    { 
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': 'sb-access-token=valid-token-here'
      }
    }
  );

  check(res, {
    'status is 200': (r) => r.status === 200,
    'P50 < 100ms': (r) => r.timings.duration < 100,
    'P95 < 200ms': (r) => r.timings.duration < 200,
  });
}
```

**Optimization Recommendations:**
- Implement JWT validation without database lookup
- Use short-lived access tokens
- Cache user session data

---

## 3. Performance Monitoring

### 3.1 Real User Monitoring (RUM)

**Implementation:**

```typescript
// Add to AuthContext or client-side monitoring
class PerformanceMonitor {
  static trackAuthOperation(operation: string, startTime: number) {
    const duration = Date.now() - startTime;
    
    // Send to analytics
    if (window.gtag) {
      gtag('event', 'auth_operation', {
        event_category: 'performance',
        event_label: operation,
        value: duration,
      });
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`[Performance] ${operation}: ${duration}ms`);
    }

    // Send to custom monitoring endpoint
    fetch('/api/monitoring/performance', {
      method: 'POST',
      body: JSON.stringify({
        operation,
        duration,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {
      // Silently fail monitoring
    });
  }
}

// Usage in AuthContext
async function login(email: string, password: string) {
  const startTime = Date.now();
  try {
    const { data, error } = await supabase.functions.invoke('auth-login', {
      body: { email, password }
    });
    PerformanceMonitor.trackAuthOperation('login_success', startTime);
    return data;
  } catch (error) {
    PerformanceMonitor.trackAuthOperation('login_failure', startTime);
    throw error;
  }
}
```

**Metrics to Track:**
- Operation duration (P50, P95, P99)
- Success/failure rates
- Error types
- Geographic performance
- Device/browser performance

---

### 3.2 Edge Function Monitoring

**Add to Edge Functions:**

```typescript
// Add to security-middleware.ts
class PerformanceMetrics {
  private static metrics = new Map<string, {
    count: number;
    totalTime: number;
    minTime: number;
    maxTime: number;
    errors: number;
  }>();

  static record(operation: string, durationMs: number, success: boolean = true): void {
    const existing = this.metrics.get(operation) || {
      count: 0,
      totalTime: 0,
      minTime: Infinity,
      maxTime: 0,
      errors: 0,
    };
    
    existing.count++;
    existing.totalTime += durationMs;
    existing.minTime = Math.min(existing.minTime, durationMs);
    existing.maxTime = Math.max(existing.maxTime, durationMs);
    if (!success) existing.errors++;
    
    this.metrics.set(operation, existing);
  }

  static getMetrics(): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [operation, data] of this.metrics.entries()) {
      result[operation] = {
        count: data.count,
        avgTime: data.totalTime / data.count,
        minTime: data.minTime === Infinity ? 0 : data.minTime,
        maxTime: data.maxTime,
        errorRate: data.errors / data.count,
      };
    }
    return result;
  }

  static logMetrics(): void {
    Logger.info('Performance metrics', { metrics: this.getMetrics() });
  }
}

// Usage in Edge Functions
serve(async (req) => {
  const startTime = performance.now();
  let success = false;
  
  try {
    // ... function logic
    success = true;
    return response;
  } finally {
    const duration = performance.now() - startTime;
    PerformanceMetrics.record('auth-login', duration, success);
  }
});
```

---

### 3.3 Database Query Monitoring

**Implement query logging:**

```typescript
// Add to Edge Functions
class QueryMonitor {
  static logQuery(query: string, duration: number) {
    if (duration > 100) {
      Logger.warn('Slow query detected', {
        query: query.substring(0, 100),
        duration,
      });
    }
  }
}

// Usage
const startTime = performance.now();
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();

QueryMonitor.logQuery('profile_select', performance.now() - startTime);
```

**Slow Query Thresholds:**
- < 10ms: Excellent
- 10-50ms: Good
- 50-100ms: Acceptable
- 100-500ms: Slow (investigate)
- > 500ms: Very Slow (optimize immediately)

---

## 4. Performance Optimization Recommendations

### 4.1 Database Optimizations

#### Index Recommendations
```sql
-- Add indexes for frequently queried fields
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_pilot_licensure_user_id ON pilot_licensure_experience(user_id);
CREATE INDEX IF NOT EXISTS idx_user_app_access_user_id ON user_app_access(user_id);
```

#### Query Optimization
- Use `select()` with specific columns instead of `*`
- Implement pagination for large result sets
- Use database views for complex joins
- Cache frequently accessed data

---

### 4.2 Edge Function Optimizations

#### Connection Pooling
```typescript
// Reuse Supabase client instances
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Don't create new client for each request
```

#### Response Compression
```typescript
// Enable compression in Edge Functions
response.headers.set('Content-Encoding', 'gzip');
```

#### Cold Start Mitigation
- Keep Edge Functions warm with periodic health checks
- Use provisioned concurrency (if available)
- Optimize function size and dependencies

---

### 4.3 Client-Side Optimizations

#### Request Batching
```typescript
// Batch multiple operations into single request
const batchOperations = async () => {
  const results = await Promise.all([
    supabase.functions.invoke('auth-verify'),
    supabase.from('profiles').select('*').eq('id', userId),
    supabase.from('user_app_access').select('*').eq('user_id', userId),
  ]);
  return results;
};
```

#### Local Caching
```typescript
// Cache user profile locally
const cachedProfile = localStorage.getItem('userProfile');
if (cachedProfile) {
  return JSON.parse(cachedProfile);
}

// Refresh cache in background
fetchProfile().then(profile => {
  localStorage.setItem('userProfile', JSON.stringify(profile));
});
```

#### Optimistic UI Updates
```typescript
// Update UI immediately, rollback on error
const handleLogout = async () => {
  setUser(null); // Optimistic update
  try {
    await logout();
  } catch (error) {
    setUser(currentUser); // Rollback
    showError('Logout failed');
  }
};
```

---

## 5. Performance Testing Tools

### 5.1 k6 (Recommended)

**Installation:**
```bash
# macOS
brew install k6

# Or download from https://k6.io
```

**Basic Usage:**
```bash
k6 run script.js
```

**With Output:**
```bash
k6 run --out json=results.json script.js
```

---

### 5.2 Artillery

**Alternative load testing tool**

**Installation:**
```bash
npm install -g artillery
```

**Config Example:**
```yaml
config:
  target: "https://your-project.supabase.co/functions/v1"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Ramp up"
    - duration: 300
      arrivalRate: 100
      name: "Sustained load"

scenarios:
  - name: "Auth Flow"
    flow:
      - post:
          url: "/auth-login"
          json:
            email: "test@example.com"
            password: "TestPassword123"
          capture:
            - json: "$.user.id"
              as: "userId"
      - post:
          url: "/auth-verify"
          json: {}
```

---

### 5.3 Lighthouse CI

**For client-side performance testing**

**Installation:**
```bash
npm install -g @lhci/cli
```

**Config:**
```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended"
    }
  }
}
```

---

## 6. Performance Benchmarks Summary

### Target Performance Metrics

| Endpoint | P50 | P95 | P99 | Notes |
|----------|-----|-----|-----|-------|
| auth-login | < 200ms | < 500ms | < 1s | Includes database query |
| auth-signup | < 300ms | < 1s | < 2s | Multiple writes |
| auth-logout | < 100ms | < 200ms | < 400ms | Simple cookie clear |
| auth-refresh | < 150ms | < 300ms | < 500ms | Token rotation |
| auth-verify | < 100ms | < 200ms | < 400ms | JWT validation |

### Load Test Targets

| Scenario | Users | Duration | Error Rate | P95 Response |
|----------|-------|----------|------------|--------------|
| Normal Load | 50 | 30min | < 1% | < 500ms |
| Peak Load | 100 | 15min | < 5% | < 1s |
| Sustained Load | 500 | 1hr | < 10% | < 1.5s |
| Stress Test | 1000 | 10min | < 20% | < 3s |

---

## 7. Performance Testing Checklist

### Pre-Test
- [ ] Test environment configured
- [ ] Baseline metrics established
- [ ] Monitoring tools deployed
- [ ] Test data prepared
- [ ] Load testing tools installed

### During Test
- [ ] Monitor CPU/memory usage
- [ ] Track response times
- [ ] Log error rates
- [ ] Monitor database connections
- [ ] Check Edge Function cold starts

### Post-Test
- [ ] Analyze results
- [ ] Identify bottlenecks
- [ ] Document findings
- [ ] Implement optimizations
- [ ] Re-test after changes

---

## 8. Continuous Performance Monitoring

### Alerting Thresholds

**Set up alerts for:**
- P95 response time > 1s for 5 minutes
- Error rate > 5% for 5 minutes
- Edge Function cold start rate > 10%
- Database connection pool > 80% utilization
- Memory usage > 80%

**Monitoring Tools:**
- Supabase Dashboard (built-in)
- Grafana + Prometheus
- Datadog
- New Relic

---

## 9. Performance Testing Schedule

### Recommended Testing Frequency

- **Daily:** Automated smoke tests (10 users, 5 min)
- **Weekly:** Load tests (50 users, 30 min)
- **Monthly:** Full performance suite (all scenarios)
- **Pre-Deployment:** Regression tests (normal + peak load)
- **Post-Deployment:** Monitoring for 24 hours

---

## 10. Conclusion

Performance testing is critical for ensuring the authentication system can handle enterprise-level load. The recommendations in this document provide a comprehensive approach to load testing, stress testing, and performance monitoring.

**Key Takeaways:**
1. Establish baseline metrics before optimization
2. Test under realistic load scenarios
3. Monitor continuously in production
4. Optimize based on data, not assumptions
5. Re-test after every significant change

**Next Steps:**
1. Implement automated performance tests
2. Set up monitoring and alerting
3. Run initial baseline tests
4. Establish performance budgets
5. Integrate performance tests into CI/CD

---

**Last Updated:** April 18, 2026  
**Next Review:** May 18, 2026
