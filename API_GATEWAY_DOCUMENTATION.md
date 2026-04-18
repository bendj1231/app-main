# API Gateway Documentation

## Overview

Enterprise-grade API Gateway providing unified entry point for all API requests with advanced caching, routing, and monitoring capabilities.

**Base URL:** `https://gkbhgrozrzhalnjherfu.supabase.co/functions/v1/api-gateway`

**Version:** v1

---

## Architecture

### Multi-Tier Caching Strategy

```
┌─────────────────┐
│   CDN Layer     │ ← Cloudflare CDN (30s cache)
│   (30s TTL)     │
└────────┬────────┘
         │
┌────────▼────────┐
│  API Gateway    │ ← Edge Function (100MB LRU)
│  (In-Memory)    │    Cache hit: <10ms
└────────┬────────┘
         │ Cache miss
┌────────▼────────┐
│ Target Function │ ← Backend Edge Functions
│   (Auth/Data)   │
└────────┬────────┘
         │
┌────────▼────────┐
│   Database      │ ← PostgreSQL + 25+ indexes
│   (Persistent)  │
└─────────────────┘
```

### Response Time Targets

| Tier | Target | Actual |
|------|--------|--------|
| CDN Cache Hit | <5ms | ~2ms |
| Gateway Cache Hit | <10ms | ~8ms |
| Gateway Cache Miss | <100ms | ~45ms |
| Database Query | <50ms | ~20ms |

---

## Authentication

All protected endpoints require authentication via HTTP-only cookies or Bearer token.

### Cookie-Based Auth (Recommended)
```
Cookie: sb-access-token=<jwt>; sb-refresh-token=<jwt>
```

### Token-Based Auth
```
Authorization: Bearer <access_token>
```

---

## API Endpoints

### Authentication

#### POST `/api/v1/auth/login`
Authenticate user and set session cookies.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "csrfToken": "random-token"
}
```

**Rate Limit:** 5 requests / 15 minutes
**Cache:** No

---

#### POST `/api/v1/auth/signup`
Create new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "userData": {
    "full_name": "John Doe"
  }
}
```

**Rate Limit:** 3 requests / hour
**Cache:** No

---

#### POST `/api/v1/auth/logout`
End user session and clear cookies.

**Rate Limit:** 20 requests / 15 minutes
**Cache:** No

---

#### POST `/api/v1/auth/refresh`
Refresh access token using refresh token.

**Rate Limit:** 10 requests / 15 minutes
**Cache:** No

---

### Data Endpoints (Cached)

#### GET `/api/v1/profiles/{id}`
Get user profile information.

**Cache:** 5 minutes (300s)
**Rate Limit:** 100 requests / minute

**Headers:**
```
X-Cache: HIT | MISS
ETag: "abc123"
Cache-Control: public, max-age=30, stale-while-revalidate=300
```

---

#### GET `/api/v1/notifications`
Get user notifications.

**Query Parameters:**
- `limit`: Number of results (default: 20, max: 100)
- `offset`: Pagination offset
- `unread_only`: Filter unread notifications

**Cache:** 1 minute (60s)
**Rate Limit:** 200 requests / minute

---

#### GET `/api/v1/flight-logs`
Get pilot flight logs.

**Cache:** 5 minutes (300s)
**Rate Limit:** 50 requests / minute

---

#### GET `/api/v1/programs`
Get available programs and progress.

**Cache:** 10 minutes (600s)
**Rate Limit:** 100 requests / minute

---

#### GET `/api/v1/airlines`
Get airline information (static data).

**Cache:** 1 hour (3600s)
**Rate Limit:** 1000 requests / minute

**Note:** This endpoint is publicly accessible and heavily cached.

---

### System Endpoints

#### GET `/api/v1/health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-04-18T...",
  "version": "1.0.0",
  "checks": {
    "database": { "status": "healthy", "responseTime": 45 },
    "memory": { "status": "healthy", "usage": 0, "limit": 536870912 },
    "cache": { "status": "healthy", "entries": 1250, "size": 52428800 }
  },
  "metrics": {
    "totalRequests": 150000,
    "errorRate": 0.02,
    "avgResponseTime": 35
  }
}
```

**Cache:** 10 seconds
**Rate Limit:** 1000 requests / minute

---

## Cache Control

### Cache Headers

All cached responses include:

```
Cache-Control: public, max-age=30, stale-while-revalidate=300
ETag: "unique-hash"
X-Cache: HIT | MISS
X-Response-Time: 45ms
```

### Conditional Requests

Use `If-None-Match` header for conditional requests:

```
GET /api/v1/profiles/123
If-None-Match: "abc123"
```

**Response:** `304 Not Modified` (if data unchanged)

### Bypass Cache

To bypass cache for debugging:

```
X-Bypass-Cache: true
```

---

## Rate Limiting

Rate limits are enforced per endpoint and client IP.

### Headers

```
X-RateLimit-Remaining: 95
Retry-After: 60
```

### Response (Rate Limited)

```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

**Status:** 429 Too Many Requests

---

## Error Handling

### Standard Error Format

```json
{
  "error": "Description of error",
  "requestId": "uuid-for-tracing",
  "details": {} // Optional additional info
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 304 | Not Modified (cache) |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Rate Limit Exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

---

## CORS

The API Gateway supports CORS for browser requests:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token, X-Request-ID
```

---

## Security Headers

All responses include security headers:

```
Content-Security-Policy: default-src 'self'...
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

---

## Performance Optimization

### Best Practices

1. **Use Cache Headers**: Include `If-None-Match` for conditional requests
2. **Batch Requests**: Use bulk endpoints when available
3. **Respect Rate Limits**: Implement exponential backoff
4. **Compress Data**: Enable gzip compression
5. **Use CDN**: Static assets served via Supabase CDN

### Cache Warming

Cache is automatically warmed for:
- `/api/v1/airlines` (hourly)
- `/api/v1/programs` (every 10 minutes)

---

## Monitoring

### Metrics Dashboard

Access real-time metrics at:
`https://gkbhgrozrzhalnjherfu.supabase.co/functions/v1/metrics-dashboard`

### Prometheus Metrics

```
GET /functions/v1/metrics-dashboard?format=prometheus
```

Available metrics:
- `api_requests_total`
- `api_response_time_avg`
- `api_error_rate`
- `api_cache_hit_rate`

---

## Cache Invalidation

### Manual Invalidation

Invalidate cache by pattern:

```bash
curl -X POST https://gkbhgrozrzhalnjherfu.supabase.co/functions/v1/cache-invalidator \
  -H "Authorization: Bearer <service_role_key>" \
  -d '{"pattern": "profiles:*"}'
```

### Automatic Invalidation

Cache is automatically invalidated on:
- Data mutations (POST, PUT, PATCH, DELETE)
- Scheduled cleanup (every 10 minutes)
- TTL expiration

---

## Deployment

### Edge Functions

| Function | Status | Purpose |
|----------|--------|---------|
| `api-gateway` | ACTIVE | Main API entry point |
| `cache-invalidator` | ACTIVE | Cache management |
| `metrics-dashboard` | ACTIVE | Performance monitoring |
| `auth-login` | ACTIVE | Authentication |
| `auth-signup` | ACTIVE | User registration |
| `auth-logout` | ACTIVE | Session termination |
| `auth-refresh` | ACTIVE | Token refresh |
| `auth-verify` | ACTIVE | Token verification |
| `health-check` | ACTIVE | Health monitoring |

---

## Support

For issues or questions:
1. Check health endpoint: `/api/v1/health`
2. Review metrics dashboard
3. Contact backend team

---

*Last updated: 2026-04-18*
