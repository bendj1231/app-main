# Load Testing Guide
## Authentication System - Cookie-Based Auth Implementation

**Document Version:** 1.0  
**Last Updated:** April 18, 2026  
**Test Tool:** k6

---

## Overview

This guide provides comprehensive instructions for executing load tests on the authentication system. Load testing validates that the system can handle the target scale of 500 concurrent users with sub-100ms response times for critical endpoints.

**Target Performance Metrics:**
- P50 response time: < 200ms at 500 users
- P95 response time: < 1s at 500 users
- P99 response time: < 2s at 500 users
- Error rate: < 5% at 500 users
- Throughput: > 100 requests/second

---

## Prerequisites

### Software Requirements

**k6 Load Testing Tool:**
```bash
# macOS
brew install k6

# Linux
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

**Node.js (for test execution):**
```bash
# Install Node.js 20+
nvm install 20
nvm use 20
```

### Environment Setup

**Required Environment Variables:**
```bash
# Supabase Configuration
export BASE_URL=https://your-project.supabase.co/functions/v1
export API_BASE_URL=https://your-project.supabase.co/rest/v1
export ACCESS_TOKEN=your-access-token
export API_KEY=your-api-key

# Test Configuration
export TEST_EMAIL_PREFIX=test.user
export TEST_PASSWORD=TestPassword123
```

**GitHub Secrets (for CI/CD):**
- `BASE_URL` - Edge Functions base URL
- `API_BASE_URL` - API base URL
- `ACCESS_TOKEN` - Supabase access token
- `API_KEY` - Supabase API key
- `TEST_EMAIL_PREFIX` - Test email prefix
- `TEST_PASSWORD` - Test password

---

## Load Test Scripts

### 1. auth-load-test.js

**Purpose:** Test authentication flows under load

**Test Scenarios:**
- Login flow (valid credentials)
- Signup flow (new user registration)
- Logout flow
- Token refresh flow
- Session verification flow

**Usage:**
```bash
# Basic execution
k6 run tests/load-tests/auth-load-test.js

# With environment variables
BASE_URL=https://your-project.supabase.co/functions/v1 \
TEST_EMAIL_PREFIX=test.user \
TEST_PASSWORD=TestPassword123 \
k6 run tests/load-tests/auth-load-test.js

# With custom load level
k6 run --stage '2m:50,3m:100,5m:200,10m:250,10m:250,2m:0' \
  tests/load-tests/auth-load-test.js
```

**Load Levels:**
- Default: 100 users (2m ramp-up, 10m sustain)
- Modified: Can be customized via command line

---

### 2. api-load-test.js

**Purpose:** Test API endpoints under load

**Test Scenarios:**
- GET requests (read operations)
- POST requests (write operations)
- PUT requests (update operations)
- DELETE requests (delete operations)
- Filtered queries
- Paginated queries

**Usage:**
```bash
# Basic execution
k6 run tests/load-tests/api-load-test.js

# With environment variables
API_BASE_URL=https://your-project.supabase.co/rest/v1 \
ACCESS_TOKEN=your-access-token \
API_KEY=your-api-key \
k6 run tests/load-tests/api-load-test.js
```

**Load Levels:**
- Default: 250 users (2m ramp-up, 10m sustain)
- Modified: Can be customized via command line

---

### 3. edge-function-load-test.js

**Purpose:** Test Edge Functions specifically

**Test Scenarios:**
- auth-login
- auth-signup
- auth-logout
- auth-refresh
- auth-verify
- Cold start detection
- Consecutive requests

**Usage:**
```bash
# Basic execution
k6 run tests/load-tests/edge-function-load-test.js

# With environment variables
BASE_URL=https://your-project.supabase.co/functions/v1 \
TEST_EMAIL=test.user@example.com \
TEST_PASSWORD=TestPassword123 \
k6 run tests/load-tests/edge-function-load-test.js
```

**Load Levels:**
- Default: 500 users (target load, 10m ramp-up, 10m sustain)
- Modified: Can be customized via command line

---

### 4. database-load-test.js

**Purpose:** Test database query performance under load

**Test Scenarios:**
- Simple SELECT queries
- SELECT with JOIN
- SELECT with filter
- INSERT queries
- UPDATE queries
- DELETE queries
- Pagination
- Aggregation
- Transaction simulation

**Usage:**
```bash
# Basic execution
k6 run tests/load-tests/database-load-test.js

# With environment variables
API_BASE_URL=https://your-project.supabase.co/rest/v1 \
ACCESS_TOKEN=your-access-token \
API_KEY=your-api-key \
k6 run tests/load-tests/database-load-test.js
```

**Load Levels:**
- Default: 250 users (2m ramp-up, 10m sustain)
- Modified: Can be customized via command line

---

## Execution Guide

### Step 1: Prepare Test Environment

**Create Test Data:**
```bash
# Create test users in staging environment
# Use database migration or script
# See: scripts/create-test-users.sh
```

**Configure Monitoring:**
- Ensure Supabase Dashboard is accessible
- Set up performance monitoring dashboards
- Configure alert thresholds

**Verify Environment Variables:**
```bash
# Check required environment variables
echo $BASE_URL
echo $API_BASE_URL
echo $ACCESS_TOKEN
echo $API_KEY
```

---

### Step 2: Execute Baseline Test (1 User)

**Purpose:** Establish baseline performance

**Command:**
```bash
k6 run --stage '5m:1' tests/load-tests/edge-function-load-test.js
```

**Expected Results:**
- P50 response time: < 100ms
- P95 response time: < 500ms
- P99 response time: < 1s
- Error rate: 0%

**Document Results:**
- Record baseline metrics
- Save output to file: `k6 run --out json=baseline-results.json ...`

---

### Step 3: Execute Level 2 Test (100 Users)

**Purpose:** Test normal daily usage

**Command:**
```bash
k6 run tests/load-tests/edge-function-load-test.js
```

**Expected Results:**
- P50 response time: < 150ms
- P95 response time: < 500ms
- P99 response time: < 1s
- Error rate: < 1%

**Document Results:**
- Compare with baseline
- Identify performance degradation

---

### Step 4: Execute Level 3 Test (250 Users)

**Purpose:** Test moderate usage

**Command:**
```bash
k6 run --stage '2m:50,3m:150,5m:300,10m:250,10m:250,2m:0' \
  tests/load-tests/edge-function-load-test.js
```

**Expected Results:**
- P50 response time: < 200ms
- P95 response time: < 800ms
- P99 response time: < 1.5s
- Error rate: < 2%

**Document Results:**
- Monitor resource utilization
- Check for bottlenecks

---

### Step 5: Execute Level 4 Test (500 Users - Target)

**Purpose:** Test target usage (production target)

**Command:**
```bash
k6 run tests/load-tests/edge-function-load-test.js
```

**Expected Results:**
- P50 response time: < 200ms
- P95 response time: < 1s
- P99 response time: < 2s
- Error rate: < 5%

**Document Results:**
- Validate against performance targets
- Identify scaling limitations

---

### Step 6: Execute Level 5 Test (1000 Users - Stress)

**Purpose:** Find breaking point

**Command:**
```bash
k6 run --stage '2m:100,3m:300,5m:600,10m:1000,10m:1000,2m:0' \
  tests/load-tests/edge-function-load-test.js
```

**Expected Results:**
- System degrades gracefully
- No complete failures
- Clear error messages
- Automatic recovery after load reduces

**Document Results:**
- Identify breaking point
- Document degradation pattern

---

## Interpreting Results

### Key Metrics

**Response Time Percentiles:**
- **P50 (Median):** 50% of requests complete in this time
- **P95:** 95% of requests complete in this time
- **P99:** 99% of requests complete in this time
- **P99.9:** 99.9% of requests complete in this time

**Error Rate:**
- Percentage of requests that failed (HTTP errors, timeouts, etc.)
- Target: < 5% at 500 users

**Throughput:**
- Requests per second
- Target: > 100 req/s

**Checks:**
- Percentage of checks that passed
- Target: > 95%

---

### Success Criteria

**At 500 Users (Target Load):**

| Metric | Target | Pass | Fail |
|--------|--------|------|------|
| P50 Response Time | < 200ms | ✅ | ❌ |
| P95 Response Time | < 1s | ✅ | ❌ |
| P99 Response Time | < 2s | ✅ | ❌ |
| Error Rate | < 5% | ✅ | ❌ |
| Throughput | > 100 req/s | ✅ | ❌ |

---

### Common Issues

**Issue: High Error Rate**
- **Cause:** Rate limiting, invalid test data, network issues
- **Solution:** Check rate limit configuration, verify test data, check network connectivity

**Issue: Slow Response Times**
- **Cause:** Cold starts, database queries, network latency
- **Solution:** Implement cold start mitigation, optimize database queries, check network

**Issue: Connection Pool Exhaustion**
- **Cause:** Too many concurrent users, small connection pool
- **Solution:** Increase connection pool size, reduce concurrent users

---

## CI/CD Integration

### GitHub Actions Workflow

**Add to `.github/workflows/load-test.yml`:**

```yaml
name: Load Testing

on:
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM
  workflow_dispatch:

jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup k6
        run: |
          sudo gpg -k
          sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install k6

      - name: Run load tests
        run: |
          k6 run tests/load-tests/edge-function-load-test.js \
            --out json=load-test-results.json
        env:
          BASE_URL: ${{ secrets.STAGING_BASE_URL }}
          TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
          TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}

      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: load-test-results
          path: load-test-results.json
```

---

## Best Practices

### Test Design

**1. Use Realistic Scenarios**
- Simulate actual user behavior
- Include think time between requests
- Use realistic data distributions

**2. Monitor During Tests**
- Watch response times in real-time
- Monitor error rates
- Check resource utilization

**3. Document Everything**
- Record test configuration
- Document test results
- Note any anomalies

### Test Execution

**1. Start Small**
- Begin with baseline test (1 user)
- Gradually increase load
- Identify breaking point

**2. Run Multiple Times**
- Execute tests multiple times
- Average results
- Identify variability

**3. Test Different Times**
- Test during peak hours
- Test during off-peak hours
- Compare results

### Results Analysis

**1. Look for Trends**
- Compare across load levels
- Identify performance degradation patterns
- Find bottlenecks

**2. Investigate Anomalies**
- Look for unexpected results
- Investigate high error rates
- Check for outliers

**3. Validate Against Targets**
- Compare with performance targets
- Identify gaps
- Plan optimizations

---

## Troubleshooting

### Common Errors

**Error: "connection refused"**
- **Cause:** Wrong URL, service down
- **Solution:** Verify BASE_URL, check service status

**Error: "rate limit exceeded"**
- **Cause:** Too many requests, rate limiting active
- **Solution:** Reduce concurrent users, increase rate limit

**Error: "invalid credentials"**
- **Cause:** Wrong ACCESS_TOKEN or API_KEY
- **Solution:** Verify credentials, regenerate tokens

### Getting Help

**Resources:**
- Load Testing Strategy: `tests/LOAD_TESTING_STRATEGY.md`
- Load Test Execution Results: `tests/LOAD_TEST_EXECUTION_RESULTS.md`
- Performance Optimization Recommendations: `tests/PERFORMANCE_OPTIMIZATION_RECOMMENDATIONS.md`
- k6 Documentation: https://k6.io/docs/

**Contacts:**
- DevOps Team: [Contact]
- Performance Team: [Contact]
- On-Call Engineer: [Contact]

---

## Appendix A: Quick Reference

### Common Commands

```bash
# Run auth load test
k6 run tests/load-tests/auth-load-test.js

# Run API load test
k6 run tests/load-tests/api-load-test.js

# Run Edge Function load test
k6 run tests/load-tests/edge-function-load-test.js

# Run database load test
k6 run tests/load-tests/database-load-test.js

# Run with custom load level
k6 run --stage '2m:50,3m:100,5m:200,10m:250,10m:250,2m:0' \
  tests/load-tests/edge-function-load-test.js

# Run with output to file
k6 run --out json=results.json tests/load-tests/edge-function-load-test.js

# Run with environment variables
BASE_URL=https://your-project.supabase.co/functions/v1 \
k6 run tests/load-tests/edge-function-load-test.js
```

### Environment Variables

```bash
# Edge Functions
export BASE_URL=https://your-project.supabase.co/functions/v1

# API
export API_BASE_URL=https://your-project.supabase.co/rest/v1

# Authentication
export ACCESS_TOKEN=your-access-token
export API_KEY=your-api-key

# Test Data
export TEST_EMAIL_PREFIX=test.user
export TEST_PASSWORD=TestPassword123
export TEST_EMAIL=test.user@example.com
```

---

**Document Version:** 1.0  
**Last Updated:** April 18, 2026  
**Next Review:** After implementing optimizations
