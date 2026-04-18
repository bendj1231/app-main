# API Documentation

This document provides comprehensive API documentation for all Edge Functions, including endpoints, request/response formats, authentication requirements, and error handling.

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Account Management Endpoints](#account-management-endpoints)
3. [Monitoring Endpoints](#monitoring-endpoints)
4. [Email Endpoints](#email-endpoints)
5. [Common Response Formats](#common-response-formats)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [CSRF Protection](#csrf-protection)

---

## Authentication Endpoints

### POST /auth-login

Authenticate a user with email and password.

**Endpoint:** `https://your-project.supabase.co/functions/v1/auth-login`

**Method:** `POST`

**Authentication:** Not required (this endpoint provides authentication)

**CSRF Protection:** Required

**Rate Limit:** 5 requests per 15 minutes per IP

**Request Headers:**
```http
Content-Type: application/json
X-CSRF-Token: <csrf-token-from-cookie>
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | User email address |
| password | string | Yes | User password (min 8 chars, uppercase, lowercase, number) |

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid-v4",
    "email": "user@example.com"
  },
  "csrfToken": "new-csrf-token"
}
```

**Response Headers:**
```http
Set-Cookie: csrf-token=<new-token>; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400
Set-Cookie: sb-access-token=<access-token>; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=900
Set-Cookie: sb-refresh-token=<refresh-token>; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000
X-RateLimit-Remaining: 4
Content-Type: application/json
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "error": "Email and password required"
}
```

**400 Bad Request (Invalid Email):**
```json
{
  "error": "Invalid email format"
}
```

**401 Unauthorized:**
```json
{
  "error": "Invalid credentials"
}
```

**403 Forbidden (Invalid CSRF):**
```json
{
  "error": "Invalid CSRF token",
  "requestId": "uuid-v4"
}
```

**429 Too Many Requests:**
```json
{
  "error": "Too many login attempts. Please try again later.",
  "retryAfter": 900
}
```

**500 Internal Server Error:**
```json
{
  "error": "An error occurred. Please try again.",
  "requestId": "uuid-v4"
}
```

**Example cURL:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/auth-login \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: your-csrf-token" \
  -H "Cookie: csrf-token=your-csrf-token" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123"
  }' \
  -v
```

---

### POST /auth-signup

Register a new user account.

**Endpoint:** `https://your-project.supabase.co/functions/v1/auth-signup`

**Method:** `POST`

**Authentication:** Not required (this endpoint provides authentication)

**CSRF Protection:** Required

**Rate Limit:** 3 requests per hour per IP

**Request Headers:**
```http
Content-Type: application/json
X-CSRF-Token: <csrf-token-from-cookie>
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "userData": {
    "fullName": "John Doe",
    "contactNumber": "+1234567890",
    "residingCountry": "US",
    "nationality": "US",
    "dob": "1990-01-01",
    "pilotId": "PILOT123",
    "licenseId": "LIC456",
    "countryOfLicense": "US",
    "currentFlightHours": "500",
    "aircraftRatedOn": "Cessna 172",
    "experienceDescription": "5 years experience",
    "ratings": ["Private Pilot", "Instrument Rating"],
    "programInterests": ["Mentorship"],
    "pathwayInterests": ["Commercial"],
    "insightInterests": ["Airline Careers"]
  }
}
```

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | User email address |
| password | string | Yes | User password (min 8 chars, uppercase, lowercase, number) |
| userData | object | Yes | User profile data |
| userData.fullName | string | Yes | Full name |
| userData.contactNumber | string | No | Phone number |
| userData.residingCountry | string | No | Country of residence |
| userData.nationality | string | No | Nationality |
| userData.dob | string | No | Date of birth (ISO 8601) |
| userData.pilotId | string | No | Pilot ID |
| userData.licenseId | string | No | License ID |
| userData.countryOfLicense | string | No | Country of license |
| userData.currentFlightHours | string | No | Current flight hours |
| userData.aircraftRatedOn | string | No | Aircraft type |
| userData.experienceDescription | string | No | Experience description |
| userData.ratings | array | No | Pilot ratings |
| userData.programInterests | array | No | Program interests |
| userData.pathwayInterests | array | No | Pathway interests |
| userData.insightInterests | array | No | Insight interests |

**Success Response (200 - Auto-confirmed):**
```json
{
  "success": true,
  "user": {
    "id": "uuid-v4",
    "email": "user@example.com"
  },
  "message": "Account created successfully"
}
```

**Success Response (200 - Email Confirmation Required):**
```json
{
  "success": true,
  "user": {
    "id": "uuid-v4",
    "email": "user@example.com"
  },
  "message": "Please check your email to verify your account"
}
```

**Response Headers (Auto-confirmed):**
```http
Set-Cookie: csrf-token=<new-token>; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400
Set-Cookie: sb-access-token=<access-token>; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=900
Set-Cookie: sb-refresh-token=<refresh-token>; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000
X-RateLimit-Remaining: 2
Content-Type: application/json
```

**Error Responses:**

**400 Bad Request (Missing Fields):**
```json
{
  "error": "Email and password required"
}
```

**400 Bad Request (Invalid Email):**
```json
{
  "error": "Invalid email format"
}
```

**400 Bad Request (Weak Password):**
```json
{
  "error": "Password must be at least 8 characters"
}
```

**400 Bad Request (User Exists):**
```json
{
  "error": "Unable to create account. Please try again or contact support if the issue persists."
}
```

**403 Forbidden (Invalid CSRF):**
```json
{
  "error": "Invalid CSRF token",
  "requestId": "uuid-v4"
}
```

**429 Too Many Requests:**
```json
{
  "error": "Too many signup attempts. Please try again later.",
  "retryAfter": 3600
}
```

**500 Internal Server Error:**
```json
{
  "error": "An error occurred. Please try again.",
  "requestId": "uuid-v4"
}
```

**Example cURL:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/auth-signup \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: your-csrf-token" \
  -H "Cookie: csrf-token=your-csrf-token" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123",
    "userData": {
      "fullName": "John Doe"
    }
  }' \
  -v
```

---

### POST /auth-logout

Log out the current user and clear all cookies.

**Endpoint:** `https://your-project.supabase.co/functions/v1/auth-logout`

**Method:** `POST`

**Authentication:** Not required (clears cookies)

**CSRF Protection:** Required

**Rate Limit:** 20 requests per 15 minutes per IP

**Request Headers:**
```http
Content-Type: application/json
X-CSRF-Token: <csrf-token-from-cookie>
Cookie: csrf-token=<csrf-token>; sb-access-token=<access-token>; sb-refresh-token=<refresh-token>
```

**Request Body:** None

**Success Response (200):**
```json
{
  "success": true
}
```

**Response Headers:**
```http
Set-Cookie: sb-access-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0
Set-Cookie: sb-refresh-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0
Set-Cookie: csrf-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0
X-RateLimit-Remaining: 19
Content-Type: application/json
```

**Error Responses:**

**403 Forbidden (Invalid CSRF):**
```json
{
  "error": "Invalid CSRF token",
  "requestId": "uuid-v4"
}
```

**429 Too Many Requests:**
```json
{
  "error": "Too many requests. Please try again later."
}
```

**500 Internal Server Error:**
```json
{
  "error": "An error occurred. Please try again.",
  "requestId": "uuid-v4"
}
```

**Example cURL:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/auth-logout \
  -H "X-CSRF-Token: your-csrf-token" \
  -H "Cookie: csrf-token=your-csrf-token" \
  -v
```

---

### POST /auth-refresh

Refresh the access token using the refresh token.

**Endpoint:** `https://your-project.supabase.co/functions/v1/auth-refresh`

**Method:** `POST`

**Authentication:** Required (via refresh token cookie)

**CSRF Protection:** Not required (uses cookie-based auth)

**Rate Limit:** 10 requests per 15 minutes per IP

**Request Headers:**
```http
Cookie: sb-refresh-token=<refresh-token>
```

**Request Body:** None

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid-v4",
    "email": "user@example.com"
  },
  "csrfToken": "new-csrf-token"
}
```

**Response Headers:**
```http
Set-Cookie: csrf-token=<new-token>; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400
Set-Cookie: sb-access-token=<new-access-token>; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=900
Set-Cookie: sb-refresh-token=<new-refresh-token>; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000
X-RateLimit-Remaining: 9
Content-Type: application/json
```

**Error Responses:**

**401 Unauthorized (No Refresh Token):**
```json
{
  "error": "No refresh token",
  "requestId": "uuid-v4"
}
```

**401 Unauthorized (Invalid Token):**
```json
{
  "error": "Invalid refresh token",
  "requestId": "uuid-v4"
}
```

**401 Unauthorized (Session Expired):**
```json
{
  "error": "Session expired",
  "requestId": "uuid-v4"
}
```

**429 Too Many Requests:**
```json
{
  "error": "Too many refresh attempts. Please try again later."
}
```

**500 Internal Server Error:**
```json
{
  "error": "An error occurred. Please try again.",
  "requestId": "uuid-v4"
}
```

**Example cURL:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/auth-refresh \
  -H "Cookie: sb-refresh-token=your-refresh-token" \
  -v
```

---

### GET /auth-verify

Verify the current session and return user data.

**Endpoint:** `https://your-project.supabase.co/functions/v1/auth-verify`

**Method:** `GET`

**Authentication:** Required (via access token cookie)

**CSRF Protection:** Required

**Rate Limit:** 100 requests per 15 minutes per IP

**Request Headers:**
```http
X-CSRF-Token: <csrf-token-from-cookie>
Cookie: csrf-token=<csrf-token>; sb-access-token=<access-token>
```

**Request Body:** None

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid-v4",
    "email": "user@example.com"
  }
}
```

**Response Headers:**
```http
X-RateLimit-Remaining: 99
Content-Type: application/json
```

**Error Responses:**

**403 Forbidden (Invalid CSRF):**
```json
{
  "error": "Invalid CSRF token",
  "requestId": "uuid-v4"
}
```

**401 Unauthorized (No Access Token):**
```json
{
  "error": "No access token",
  "requestId": "uuid-v4"
}
```

**401 Unauthorized (Invalid Token):**
```json
{
  "error": "Invalid token",
  "requestId": "uuid-v4"
}
```

**429 Too Many Requests:**
```json
{
  "error": "Too many verification attempts. Please try again later."
}
```

**500 Internal Server Error:**
```json
{
  "error": "An error occurred. Please try again.",
  "requestId": "uuid-v4"
}
```

**Example cURL:**
```bash
curl -X GET https://your-project.supabase.co/functions/v1/auth-verify \
  -H "X-CSRF-Token: your-csrf-token" \
  -H "Cookie: csrf-token=your-csrf-token; sb-access-token=your-access-token" \
  -v
```

---

## Account Management Endpoints

### DELETE /delete-account

Delete a user account and all associated data.

**Endpoint:** `https://your-project.supabase.co/functions/v1/delete-account`

**Method:** `DELETE`

**Authentication:** Required (via JWT verification)

**CSRF Protection:** Not implemented (see SECURITY_ARCHITECTURE.md limitations)

**Rate Limit:** Not implemented

**Request Headers:**
```http
Content-Type: application/json
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "userId": "uuid-v4"
}
```

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string | Yes | User ID to delete |

**Success Response (200):**
```json
{
  "success": true
}
```

**Error Responses:**

**400 Bad Request (Missing User ID):**
```json
{
  "error": "User ID is required"
}
```

**405 Method Not Allowed:**
```json
{
  "error": "Method not allowed"
}
```

**500 Internal Server Error:**
```json
{
  "error": "<error-message>"
}
```

**Example cURL:**
```bash
curl -X DELETE https://your-project.supabase.co/functions/v1/delete-account \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-access-token" \
  -d '{
    "userId": "uuid-v4"
  }' \
  -v
```

---

## Monitoring Endpoints

### GET /health-check

Check the health status of the application and its dependencies.

**Endpoint:** `https://your-project.supabase.co/functions/v1/health-check`

**Method:** `GET`

**Authentication:** Not required (public endpoint)

**CSRF Protection:** Not required (public endpoint)

**Rate Limit:** 1000 requests per minute per IP

**Request Headers:** None

**Request Body:** None

**Success Response (200 - Healthy):**
```json
{
  "status": "healthy",
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

**Degraded Response (503):**
```json
{
  "status": "degraded",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "uptime": 123456,
  "checks": {
    "database": {
      "status": "unhealthy",
      "responseTime": 600,
      "message": "Connection timeout"
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
    "errorRate": 5.0,
    "avgResponseTime": 300
  }
}
```

**Response Headers:**
```http
X-Service-Status: healthy|degraded|unhealthy
X-RateLimit-Remaining: 999
Content-Type: application/json
```

**Error Response (503 - Unhealthy):**
```json
{
  "status": "unhealthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "error": "Health check failed"
}
```

**Example cURL:**
```bash
curl -X GET https://your-project.supabase.co/functions/v1/health-check \
  -v
```

---

## Email Endpoints

### POST /send-account-created-email

Send an account creation confirmation email.

**Endpoint:** `https://your-project.supabase.co/functions/v1/send-account-created-email`

**Method:** `POST`

**Authentication:** Internal use only

**CSRF Protection:** Required

**Rate Limit:** Not documented

**Request Headers:**
```http
Content-Type: application/json
X-CSRF-Token: <csrf-token-from-cookie>
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | Recipient email address |
| name | string | Yes | Recipient name |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Error Responses:**

**400 Bad Request (Missing Fields):**
```json
{
  "error": "Email and name required"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to send email"
}
```

---

### POST /send-enrollment-email

Send an enrollment confirmation email.

**Endpoint:** `https://your-project.supabase.co/functions/v1/send-enrollment-email`

**Method:** `POST`

**Authentication:** Internal use only

**CSRF Protection:** Required

**Rate Limit:** Not documented

**Request Headers:**
```http
Content-Type: application/json
X-CSRF-Token: <csrf-token-from-cookie>
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "program": "Mentorship Program"
}
```

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | Recipient email address |
| name | string | Yes | Recipient name |
| program | string | Yes | Program name |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Error Responses:**

**400 Bad Request (Missing Fields):**
```json
{
  "error": "Email, name, and program required"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to send email"
}
```

---

## Common Response Formats

### Success Response

All successful responses follow this format:

```json
{
  "success": true,
  "data": { ... }
}
```

Or for endpoints that don't return data:

```json
{
  "success": true
}
```

### Error Response

All error responses follow this format:

```json
{
  "error": "Error message",
  "requestId": "uuid-v4"
}
```

The `requestId` is included for debugging and support purposes.

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication failed or missing |
| 403 | Forbidden | CSRF token invalid or permissions insufficient |
| 405 | Method Not Allowed | HTTP method not supported |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error occurred |
| 503 | Service Unavailable | Service degraded or unhealthy |

### Error Messages

Common error messages and their meanings:

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Email and password required" | Missing request parameters | Include both email and password in request body |
| "Invalid email format" | Email format validation failed | Use valid email format (user@domain.com) |
| "Password must be at least 8 characters" | Password too short | Use password with 8+ characters |
| "Invalid credentials" | Email or password incorrect | Verify credentials and try again |
| "Invalid CSRF token" | CSRF token mismatch | Ensure CSRF token in header matches cookie |
| "Too many login attempts" | Rate limit exceeded | Wait for rate limit reset (15 minutes) |
| "No access token" | Missing authentication cookie | Log in to obtain access token |
| "Invalid token" | Token expired or invalid | Refresh token or log in again |
| "An error occurred. Please try again." | Generic server error | Check logs and try again |

### Request ID

Every error response includes a `requestId` for debugging:

```json
{
  "error": "Error message",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

Use this requestId to:
- Search logs for the specific request
- Report issues to support
- Debug in development

---

## Rate Limiting

### Rate Limit Headers

All endpoints include rate limit information in response headers:

```http
X-RateLimit-Remaining: 4
Retry-After: 900
```

**Header Descriptions:**
- `X-RateLimit-Remaining`: Number of requests remaining in current window
- `Retry-After`: Seconds until rate limit resets (only when rate limited)

### Rate Limit Configurations

| Endpoint | Limit | Window | Identifier |
|----------|-------|--------|------------|
| auth-login | 5 | 15 minutes | IP address |
| auth-signup | 3 | 1 hour | IP address |
| auth-refresh | 10 | 15 minutes | IP address |
| auth-verify | 100 | 15 minutes | IP address |
| auth-logout | 20 | 15 minutes | IP address |
| health-check | 1000 | 1 minute | IP address |

### Rate Limit Behavior

**When Rate Limit Exceeded:**
- Returns 429 status code
- Includes `Retry-After` header
- Error message indicates rate limit exceeded

**Rate Limit Reset:**
- Limits reset automatically after window expires
- Database-backed rate limiting provides persistence
- In-memory rate limiting resets on cold start

---

## CSRF Protection

### CSRF Token Flow

**1. Initial Request (Login/Signup):**
- Server generates CSRF token
- Token set in HTTP-only cookie
- Token returned in response body

**2. Subsequent Requests:**
- Client reads CSRF token from cookie
- Client sends token in `X-CSRF-Token` header
- Server validates header matches cookie

### CSRF Token Requirements

**Endpoints Requiring CSRF:**
- auth-login (POST)
- auth-signup (POST)
- auth-logout (POST)
- auth-verify (GET/POST)
- send-account-created-email (POST)
- send-enrollment-email (POST)

**Endpoints Not Requiring CSRF:**
- health-check (public)
- auth-refresh (uses cookie auth)
- delete-account (not implemented - see limitations)

### CSRF Token Validation

```typescript
// Server-side validation
const csrfToken = req.headers.get('X-CSRF-Token')
const cookieToken = req.headers.get('Cookie')?.match(/csrf-token=([^;]+)/)?.[1]

if (!csrfToken || !cookieToken || csrfToken !== cookieToken) {
  return new Response('Invalid CSRF token', { status: 403 })
}
```

---

## Authentication

### Cookie-Based Authentication

The application uses HTTP-only cookies for authentication:

**Cookies Set:**
- `sb-access-token`: Short-lived access token (15 minutes)
- `sb-refresh-token`: Long-lived refresh token (30 days)
- `csrf-token`: CSRF protection token (24 hours)

**Cookie Attributes:**
- `HttpOnly`: Not accessible via JavaScript
- `Secure`: Only sent over HTTPS
- `SameSite=Strict`: Prevents CSRF attacks
- `Path=/`: Available across entire domain

### Token Refresh Flow

**Automatic Refresh:**
- Supabase client automatically refreshes tokens
- Client detects access token expiration
- Calls auth-refresh endpoint
- New tokens set in cookies

**Manual Refresh:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/auth-refresh \
  -H "Cookie: sb-refresh-token=your-refresh-token"
```

### Session Verification

**Verify Session:**
```bash
curl -X GET https://your-project.supabase.co/functions/v1/auth-verify \
  -H "X-CSRF-Token: your-csrf-token" \
  -H "Cookie: csrf-token=your-csrf-token; sb-access-token=your-access-token"
```

---

## Testing

### Testing with cURL

**Test Login:**
```bash
# First, get CSRF token (if needed)
# Then login
curl -X POST https://your-project.supabase.co/functions/v1/auth-login \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: your-csrf-token" \
  -H "Cookie: csrf-token=your-csrf-token" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123"
  }' \
  -c cookies.txt \
  -v
```

**Test with Cookies:**
```bash
# Use saved cookies for subsequent requests
curl -X GET https://your-project.supabase.co/functions/v1/auth-verify \
  -H "X-CSRF-Token: your-csrf-token" \
  -b cookies.txt \
  -v
```

### Testing with Postman

**1. Create Environment:**
```
BASE_URL = https://your-project.supabase.co/functions/v1
CSRF_TOKEN = {{csrf_token}}
ACCESS_TOKEN = {{access_token}}
```

**2. Login Request:**
- Method: POST
- URL: `{{BASE_URL}}/auth-login`
- Headers:
  - Content-Type: application/json
  - X-CSRF-Token: {{CSRF_TOKEN}}
- Body:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123"
  }
  ```
- Tests:
  ```javascript
  const csrfToken = pm.response.headers.get("Set-Cookie").match(/csrf-token=([^;]+)/)[1];
  pm.environment.set("csrf_token", csrfToken);
  ```

---

## SDK Integration

### JavaScript/TypeScript

```typescript
import { supabase } from './lib/supabase'

// Login
const { data, error } = await supabase.functions.invoke('auth-login', {
  body: { email, password },
  headers: { 'X-CSRF-Token': csrfToken }
})

// Verify Session
const { data, error } = await supabase.functions.invoke('auth-verify', {
  headers: { 'X-CSRF-Token': csrfToken }
})

// Logout
await supabase.functions.invoke('auth-logout', {
  headers: { 'X-CSRF-Token': csrfToken }
})
```

### React Hook

```typescript
import { useAuth } from './contexts/AuthContext'

function Login() {
  const { login } = useAuth()

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password)
      // Redirect to dashboard
    } catch (error) {
      // Handle error
    }
  }

  return (
    <button onClick={() => handleLogin(email, password)}>
      Login
    </button>
  )
}
```

---

## Versioning

### API Version

Current API version: **1.0.0**

**Version Format:** Semantic Versioning (MAJOR.MINOR.PATCH)

- **MAJOR**: Breaking changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

### Backward Compatibility

The API maintains backward compatibility within major versions.

**Breaking Changes:**
- Will increment MAJOR version
- Will be announced in advance
- Migration guide provided

---

## Changelog

### Version 1.0.0 (Current)

**Initial Release:**
- Authentication endpoints (login, signup, logout, refresh, verify)
- Account management (delete-account)
- Monitoring (health-check)
- Email endpoints (send-account-created-email, send-enrollment-email)
- CSRF protection
- Rate limiting
- Security headers

---

## Support

### Documentation

- [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md)
- [MONITORING_SETUP.md](./MONITORING_SETUP.md)
- [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md)
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Getting Help

- **Email**: support@example.com
- **Slack**: #api-support
- **GitHub Issues**: https://github.com/example/repo/issues

### Reporting Issues

When reporting API issues, include:
- Request ID (from error response)
- Timestamp of request
- Endpoint and method
- Request body (sanitized)
- Response headers and body
- Steps to reproduce
