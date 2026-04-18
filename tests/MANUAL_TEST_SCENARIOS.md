# Manual Test Scenarios Documentation
## Authentication System Testing Guide

**Purpose:** Comprehensive manual testing scenarios for cookie-based authentication  
**Target Audience:** QA Engineers, Security Testers, Developers  
**Test Environment:** Staging/Production with test data

---

## Prerequisites

### Required Test Data
- Valid test user account (email: `test@example.com`, password: `TestPassword123`)
- Invalid test credentials
- Test email addresses for signup testing

### Required Tools
- Browser with developer tools (Chrome DevTools recommended)
- Network tab monitoring
- Cookie inspection capabilities
- CSRF token extraction tools
- Postman or similar API testing tool

### Environment Setup
1. Clear all browser cookies and localStorage
2. Disable browser extensions that might interfere
3. Open browser DevTools (Network, Application, Console)
4. Set up monitoring for network requests

---

## Test Category 1: Authentication Flows

### Test 1.1: Valid Login
**Objective:** Verify successful login with valid credentials

**Steps:**
1. Navigate to login page
2. Enter valid email: `test@example.com`
3. Enter valid password: `TestPassword123`
4. Click "Login" button

**Expected Results:**
- User is redirected to dashboard
- HTTP-only cookies set: `sb-access-token`, `sb-refresh-token`, `csrf-token`
- Console shows successful login message
- Network request to `auth-login` returns 200
- Response contains `success: true` and user data

**Verification:**
- Check Application > Cookies for all three cookies
- Verify cookies have `HttpOnly`, `Secure`, `SameSite=Strict` attributes
- Verify `sb-access-token` Max-Age is 900 seconds (15 minutes)
- Verify `sb-refresh-token` Max-Age is 2592000 seconds (30 days)

---

### Test 1.2: Invalid Login - Wrong Password
**Objective:** Verify login fails with incorrect password

**Steps:**
1. Navigate to login page
2. Enter valid email: `test@example.com`
3. Enter invalid password: `WrongPassword123`
4. Click "Login" button

**Expected Results:**
- Login fails
- Error message displayed: "Invalid credentials"
- No auth cookies set
- Network request returns 401
- Response contains generic error message (not "password incorrect")

**Verification:**
- Check that no cookies are set
- Verify error message doesn't reveal password is wrong
- Check network tab for 401 status

---

### Test 1.3: Invalid Login - Non-existent Email
**Objective:** Verify login fails with non-existent email

**Steps:**
1. Navigate to login page
2. Enter non-existent email: `nonexistent@example.com`
3. Enter any password
4. Click "Login" button

**Expected Results:**
- Login fails
- Error message displayed (generic)
- No auth cookies set
- Network request returns 401

**Verification:**
- Error message should be same as wrong password (prevents user enumeration)
- No cookies set

---

### Test 1.4: Login - Missing Fields
**Objective:** Verify validation for missing required fields

**Steps:**
1. Navigate to login page
2. Leave email field empty
3. Enter password
4. Click "Login" button
5. Repeat with email filled, password empty
6. Repeat with both empty

**Expected Results:**
- Validation error displayed for each case
- No network request made (client-side validation)
- Error message: "Email and password required"

**Verification:**
- Check form validation
- Verify no API call made

---

### Test 1.5: Login - Invalid Email Format
**Objective:** Verify email format validation

**Steps:**
1. Navigate to login page
2. Enter invalid email formats:
   - `invalid-email`
   - `@example.com`
   - `test@`
   - `test@.com`
   - `test space@example.com`
3. Enter valid password
4. Click "Login" button for each

**Expected Results:**
- Validation error for each invalid format
- Error message: "Invalid email format"
- Network request returns 400 if client-side validation bypassed

**Verification:**
- Test each invalid format
- Check error message consistency

---

### Test 1.6: Successful Signup
**Objective:** Verify new user account creation

**Steps:**
1. Navigate to signup page
2. Enter unique email: `test+${timestamp}@example.com`
3. Enter strong password: `NewUserPass123`
4. Fill required user data fields
5. Click "Signup" button

**Expected Results:**
- Account created successfully
- User redirected to dashboard or email verification page
- Cookies set if auto-confirmed
- Network request returns 200
- Response contains `success: true`

**Verification:**
- Check database for new user
- Verify profile created in `profiles` table
- Verify app access records created
- Check email for verification (if not auto-confirmed)

---

### Test 1.7: Signup - Weak Password
**Objective:** Verify password strength validation

**Steps:**
1. Navigate to signup page
2. Enter valid email
3. Enter weak passwords (test each):
   - `short` (less than 8 characters)
   - `nouppercase123` (no uppercase)
   - `NOLOWERCASE123` (no lowercase)
   - `NoNumbers` (no numbers)
4. Click "Signup" button for each

**Expected Results:**
- Validation error for each weak password
- Specific error message indicating requirement
- Network request returns 400
- Account not created

**Verification:**
- Test each password requirement individually
- Verify error messages are specific

---

### Test 1.8: Signup - Duplicate Email
**Objective:** Verify handling of existing email

**Steps:**
1. Navigate to signup page
2. Enter email of existing user
3. Enter valid password
4. Fill user data
5. Click "Signup" button

**Expected Results:**
- Generic error message (not "email already exists")
- Network request returns 400
- No duplicate account created

**Verification:**
- Error message prevents user enumeration
- Check database for no duplicate

---

### Test 1.9: Logout
**Objective:** Verify complete logout and cookie clearing

**Steps:**
1. Login with valid credentials
2. Verify cookies are set
3. Click "Logout" button
4. Check cookies after logout

**Expected Results:**
- User redirected to login page
- All auth cookies cleared (`sb-access-token`, `sb-refresh-token`, `csrf-token`)
- sessionStorage cleared
- Network request to `auth-logout` returns 200
- Response contains `success: true`

**Verification:**
- Check Application > Cookies - all should be cleared
- Verify sessionStorage is empty
- Try to access protected route - should redirect to login

---

### Test 1.10: Logout Persistence
**Objective:** Verify user stays logged out after page refresh

**Steps:**
1. Login with valid credentials
2. Logout
3. Refresh the page
4. Try to access protected route

**Expected Results:**
- User remains logged out after refresh
- No automatic re-authentication
- Redirected to login page
- No auth cookies present

**Verification:**
- Check cookies after refresh - should be empty
- Check `explicitLogout` flag persistence
- Verify no session restoration

---

### Test 1.11: Session Refresh
**Objective:** Verify token refresh mechanism

**Steps:**
1. Login with valid credentials
2. Wait 14 minutes (or manually expire access token)
3. Perform an action that requires authentication
4. Monitor network requests

**Expected Results:**
- Automatic token refresh occurs
- New access token set in cookie
- New CSRF token generated
- User action succeeds without re-login
- Network request to `auth-refresh` returns 200

**Verification:**
- Check cookie values before and after refresh
- Verify new CSRF token
- Monitor network for refresh request

---

### Test 1.12: Session Verification
**Objective:** Verify session validation on protected routes

**Steps:**
1. Login with valid credentials
2. Navigate to protected route
3. Monitor network requests
4. Check `auth-verify` endpoint call

**Expected Results:**
- Session verified on route access
- `auth-verify` returns 200 with user data
- User can access protected content
- No re-authentication required

**Verification:**
- Check network for verify request
- Verify response contains user data
- Check console for verification logs

---

## Test Category 2: Session Persistence

### Test 2.1: Session Persistence - Page Refresh
**Objective:** Verify session persists across page refresh

**Steps:**
1. Login with valid credentials
2. Verify cookies are set
3. Refresh the page (F5 or Cmd+R)
4. Check if user remains logged in
5. Verify cookies still present

**Expected Results:**
- User remains logged in after refresh
- Cookies persist across refresh
- No re-authentication required
- User can access protected routes

**Verification:**
- Check cookies before and after refresh
- Verify user state in AuthContext
- Monitor network for session verification

---

### Test 2.2: Session Persistence - Browser Close
**Objective:** Verify session behavior after browser close

**Steps:**
1. Login with valid credentials
2. Close browser completely
3. Reopen browser
4. Navigate to application

**Expected Results:**
- Session may or may not persist depending on cookie settings
- If cookies are session-based: user logged out
- If cookies have expiration: user remains logged in
- Clear indication of auth state

**Verification:**
- Check cookie Max-Age settings
- Test both scenarios
- Document expected behavior

---

### Test 2.3: Session Persistence - Multiple Tabs
**Objective:** Verify session sharing across browser tabs

**Steps:**
1. Login with valid credentials in Tab 1
2. Open new tab (Tab 2)
3. Navigate to application in Tab 2
4. Verify authentication state
5. Logout in Tab 1
6. Refresh Tab 2

**Expected Results:**
- Session shared across tabs (cookies are domain-wide)
- Tab 2 shows user as logged in
- Logout in Tab 1 clears cookies
- Tab 2 redirects to login after refresh

**Verification:**
- Test session sharing
- Verify logout affects all tabs
- Check cookie clearing behavior

---

### Test 2.4: Session Expiration
**Objective:** Verify session expiration handling

**Steps:**
1. Login with valid credentials
2. Wait for access token to expire (15 minutes)
3. Attempt to access protected route
4. Monitor behavior

**Expected Results:**
- Access token expired
- Automatic refresh attempted
- If refresh fails: user logged out
- Clear error message
- Redirect to login

**Verification:**
- Monitor token expiration
- Check refresh mechanism
- Verify error handling

---

## Test Category 3: Rate Limiting

### Test 3.1: Login Rate Limiting
**Objective:** Verify rate limiting on login attempts

**Steps:**
1. Clear cookies
2. Attempt 6 failed logins within 15 minutes:
   - Use same IP address
   - Use invalid password each time
   - Record response for each attempt
3. On 6th attempt, verify rate limit

**Expected Results:**
- First 5 attempts return 401
- 6th attempt returns 429 (Too Many Requests)
- Error message: "Too many login attempts"
- Retry-After header present (900 seconds)
- Rate limit resets after 15 minutes

**Verification:**
- Count successful vs rate-limited requests
- Check Retry-After header value
- Test reset after 15 minutes

---

### Test 3.2: Signup Rate Limiting
**Objective:** Verify rate limiting on signup attempts

**Steps:**
1. Attempt 4 signups within 1 hour:
   - Use different email each time
   - Use valid password each time
   - Record response for each attempt
2. On 4th attempt, verify rate limit

**Expected Results:**
- First 3 attempts return 200 or 400 (depending on validation)
- 4th attempt returns 429
- Error message: "Too many signup attempts"
- Retry-After header present (3600 seconds)
- Rate limit resets after 1 hour

**Verification:**
- Test with different emails
- Check rate limit threshold
- Verify reset time

---

### Test 3.3: Logout Rate Limiting
**Objective:** Verify rate limiting on logout attempts

**Steps:**
1. Login with valid credentials
2. Attempt 21 logout requests within 15 minutes
3. Verify rate limit on 21st attempt

**Expected Results:**
- First 20 attempts return 200
- 21st attempt returns 429
- Error message: "Too many requests"
- Retry-After header present (900 seconds)

**Verification:**
- Test rapid logout requests
- Verify rate limit threshold

---

### Test 3.4: Refresh Rate Limiting
**Objective:** Verify rate limiting on token refresh

**Steps:**
1. Login with valid credentials
2. Attempt 11 refresh requests within 15 minutes
3. Verify rate limit on 11th attempt

**Expected Results:**
- First 10 attempts return 200
- 11th attempt returns 429
- Error message: "Too many refresh attempts"
- Retry-After header present (900 seconds)

**Verification:**
- Test rapid refresh requests
- Verify rate limit threshold

---

### Test 3.5: Rate Limit Bypass - IP Change
**Objective:** Verify rate limiting is IP-based

**Steps:**
1. Trigger rate limit on current IP
2. Change IP address (VPN, proxy, or different network)
3. Attempt same operation

**Expected Results:**
- Rate limit may or may not persist across IP changes
- Document actual behavior
- If IP-based: new IP should have fresh limit
- If account-based: limit persists

**Verification:**
- Test with different IPs
- Document rate limiting strategy

---

## Test Category 4: CSRF Protection

### Test 4.1: CSRF Protection - Missing Token
**Objective:** Verify CSRF token is required

**Steps:**
1. Login to get valid session
2. Extract CSRF token from cookies
3. Make POST request without X-CSRF-Token header
4. Use Postman or curl for this test

**Expected Results:**
- Request rejected with 403
- Error message: "Invalid CSRF token"
- Request does not succeed

**Verification:**
- Test without CSRF token
- Verify rejection
- Check error message

---

### Test 4.2: CSRF Protection - Invalid Token
**Objective:** Verify invalid CSRF tokens are rejected

**Steps:**
1. Login to get valid session
2. Make POST request with invalid X-CSRF-Token header:
   - Use random string
   - Use expired token
   - Use token from different session

**Expected Results:**
- Request rejected with 403
- Error message: "Invalid CSRF token"
- Request does not succeed

**Verification:**
- Test with various invalid tokens
- Verify rejection in all cases

---

### Test 4.3: CSRF Token Rotation
**Objective:** Verify CSRF token rotates after sensitive operations

**Steps:**
1. Login and note CSRF token
2. Perform sensitive operation (login, refresh)
3. Check if new CSRF token is issued
4. Try to use old token

**Expected Results:**
- New CSRF token issued after operation
- Old token no longer valid
- Token rotation prevents replay attacks

**Verification:**
- Compare tokens before and after
- Test old token validity

---

### Test 4.4: CSRF Token in GET Requests
**Objective:** Verify CSRF not required for GET requests

**Steps:**
1. Login to get valid session
2. Make GET request to protected endpoint
3. Do not include CSRF token

**Expected Results:**
- GET request succeeds without CSRF token
- CSRF protection only applies to state-changing operations

**Verification:**
- Test GET without CSRF
- Verify success

---

## Test Category 5: Input Validation

### Test 5.1: Email Validation - SQL Injection
**Objective:** Verify SQL injection protection in email field

**Steps:**
1. Attempt login with SQL injection payloads:
   - `' OR '1'='1'--@example.com`
   - `admin'--@example.com`
   - `'; DROP TABLE users;--@example.com`

**Expected Results:**
- All attempts fail validation
- Error: "Invalid email format"
- No SQL errors in logs
- Database not affected

**Verification:**
- Test various SQL injection payloads
- Check logs for SQL errors
- Verify database integrity

---

### Test 5.2: Email Validation - XSS
**Objective:** Verify XSS protection in email field

**Steps:**
1. Attempt login with XSS payloads:
   - `<script>alert('xss')</script>@example.com`
   - `"><script>alert('xss')</script>@example.com`
   - `javascript:alert('xss')@example.com`

**Expected Results:**
- All attempts fail validation
- Error: "Invalid email format"
- XSS payload not reflected in response
- No script execution

**Verification:**
- Test various XSS payloads
- Check response for payload reflection
- Verify no script execution

---

### Test 5.3: Password Validation - Length
**Objective:** Verify password length requirements

**Steps:**
1. Attempt signup with passwords of varying lengths:
   - 7 characters (should fail)
   - 8 characters (should pass)
   - 100+ characters (test maximum)

**Expected Results:**
- Passwords < 8 characters rejected
- Passwords >= 8 characters accepted
- Maximum length enforced (if any)

**Verification:**
- Test boundary values
- Check error messages

---

### Test 5.4: Password Validation - Complexity
**Objective:** Verify password complexity requirements

**Steps:**
1. Attempt signup with passwords missing requirements:
   - No uppercase: `password123`
   - No lowercase: `PASSWORD123`
   - No numbers: `Password`
   - All requirements: `Password123`

**Expected Results:**
- Missing requirements rejected with specific error
- Valid password accepted
- Error message indicates missing requirement

**Verification:**
- Test each requirement individually
- Verify error specificity

---

### Test 5.5: Special Characters in Input
**Objective:** Verify handling of special characters

**Steps:**
1. Test with special characters in various fields:
   - Email: `test+tag@example.com`
   - Name: `O'Connor`
   - Name: `Müller`
   - Password: `P@ssw0rd!#$`

**Expected Results:**
- Valid special characters accepted
- Invalid characters rejected or sanitized
- No errors or injection vulnerabilities

**Verification:**
- Test various special characters
- Check database storage
- Verify no injection

---

## Test Category 6: Security Vulnerabilities

### Test 6.1: Session Hijacking - Token Theft
**Objective:** Verify stolen access token cannot be used without cookies

**Steps:**
1. Login and extract access token from cookie
2. Use token in Authorization header on different device/browser
3. Attempt to access protected route

**Expected Results:**
- Request fails without cookies
- HTTP-only cookies prevent token theft via XSS
- Token alone insufficient for authentication

**Verification:**
- Test token without cookies
- Verify cookie requirement

---

### Test 6.2: Session Fixation
**Objective:** Verify session fixation protection

**Steps:**
1. Obtain session ID before login (if possible)
2. Login
3. Verify session ID changes after login

**Expected Results:**
- New session ID issued after login
- Pre-login session ID invalidated
- Session fixation prevented

**Verification:**
- Compare session IDs
- Verify rotation

---

### Test 6.3: Cookie Security Attributes
**Objective:** Verify cookie security attributes

**Steps:**
1. Login to set cookies
2. Inspect cookies in DevTools
3. Check attributes for each cookie

**Expected Results:**
- `sb-access-token`: HttpOnly, Secure, SameSite=Strict
- `sb-refresh-token`: HttpOnly, Secure, SameSite=Strict
- `csrf-token`: HttpOnly, Secure, SameSite=Strict
- No cookies without Secure flag
- No cookies accessible via JavaScript

**Verification:**
- Check each cookie attribute
- Verify HttpOnly on auth cookies
- Verify Secure flag present
- Verify SameSite=Strict

---

### Test 6.4: Clickjacking Protection
**Objective:** Verify clickjacking protection via headers

**Steps:**
1. Login to application
2. Check response headers in Network tab
3. Look for X-Frame-Options header

**Expected Results:**
- `X-Frame-Options: DENY` present
- Application cannot be framed
- Clickjacking prevented

**Verification:**
- Check security headers
- Verify X-Frame-Options value

---

### Test 6.5: XSS Protection
**Objective:** Verify XSS protection headers and mechanisms

**Steps:**
1. Check response headers for:
   - X-XSS-Protection
   - Content-Security-Policy
2. Test XSS payload in user input fields

**Expected Results:**
- `X-XSS-Protection: 1; mode=block` present
- CSP header present with strict policy
- XSS payloads sanitized or rejected
- No script execution

**Verification:**
- Check security headers
- Test XSS payloads
- Verify CSP policy

---

## Test Category 7: Concurrent Users

### Test 7.1: Concurrent Logins - Same User
**Objective:** Verify behavior when same user logs in from multiple devices

**Steps:**
1. Login on Device 1
2. Login on Device 2 with same credentials
3. Check session on Device 1

**Expected Results:**
- Both sessions valid (if allowed)
- Or Device 1 session invalidated (if single session)
- Clear behavior documented
- No security issues

**Verification:**
- Test multiple devices
- Document session behavior
- Check for session conflicts

---

### Test 7.2: Concurrent Logins - Different Users
**Objective:** Verify system handles concurrent logins from different users

**Steps:**
1. Login with User A
2. Login with User B on different device
3. Perform operations on both
4. Verify no session bleeding

**Expected Results:**
- Both users have independent sessions
- No data leakage between users
- No session confusion
- Both can operate normally

**Verification:**
- Test with multiple users
- Check for data leakage
- Verify session isolation

---

### Test 7.3: Load Test - 10 Concurrent Users
**Objective:** Verify system performance under concurrent load

**Steps:**
1. Use load testing tool (k6, JMeter)
2. Simulate 10 concurrent users logging in
3. Monitor response times and errors
4. Verify all requests succeed

**Expected Results:**
- All 10 login requests succeed
- Response time < 2 seconds
- No rate limiting on legitimate concurrent users
- No errors or timeouts

**Verification:**
- Monitor performance metrics
- Check error rates
- Verify response times

---

## Test Category 8: Edge Cases

### Test 8.1: Network Failure During Login
**Objective:** Verify graceful handling of network failures

**Steps:**
1. Disconnect network (or use DevTools offline mode)
2. Attempt login
3. Reconnect network
4. Check application state

**Expected Results:**
- Clear error message: "Network error"
- Application remains functional
- No partial login state
- User can retry after reconnection

**Verification:**
- Test with network disconnected
- Check error handling
- Verify recovery

---

### Test 8.2: Timeout Scenarios
**Objective:** Verify timeout handling

**Steps:**
1. Use DevTools to throttle network (slow 3G)
2. Attempt login
3. Monitor timeout behavior
4. Check if request times out appropriately

**Expected Results:**
- Request times out after reasonable period
- Clear error message
- No hanging state
- User can retry

**Verification:**
- Test with slow network
- Check timeout duration
- Verify error handling

---

### Test 8.3: Large Payload
**Objective:** Verify handling of large request payloads

**Steps:**
1. Attempt signup with very large userData payload (10MB+)
2. Monitor response

**Expected Results:**
- Request rejected with 413 (Payload Too Large)
- Or request succeeds with acceptable performance
- No server crash
- Clear error message

**Verification:**
- Test with large payloads
- Check response status
- Verify server stability

---

### Test 8.4: Malformed JSON
**Objective:** Verify handling of malformed JSON in requests

**Steps:**
1. Send POST request with malformed JSON
2. Use Postman or curl
3. Monitor response

**Expected Results:**
- Request rejected with 400
- Error message: "Invalid JSON"
- No server error
- Graceful handling

**Verification:**
- Test with various malformed JSON
- Check error handling
- Verify server stability

---

### Test 8.5: Missing User-Agent
**Objective:** Verify behavior when User-Agent header is missing

**Steps:**
1. Send request without User-Agent header
2. Monitor response

**Expected Results:**
- Request succeeds or fails gracefully
- No server error
- Consistent behavior

**Verification:**
- Test without User-Agent
- Check response
- Document behavior

---

## Test Category 9: Performance

### Test 9.1: Login Response Time
**Objective:** Measure login response time

**Steps:**
1. Clear cache and cookies
2. Attempt login
3. Measure time from request to response
4. Repeat 10 times and calculate average

**Expected Results:**
- Average response time < 500ms
- P95 response time < 1s
- P99 response time < 2s
- Consistent performance

**Verification:**
- Use performance monitoring tools
- Calculate statistics
- Compare against benchmarks

---

### Test 9.2: Signup Response Time
**Objective:** Measure signup response time

**Steps:**
1. Clear cache and cookies
2. Attempt signup
3. Measure time from request to response
4. Repeat 10 times and calculate average

**Expected Results:**
- Average response time < 1s (includes database writes)
- P95 response time < 2s
- Consistent performance

**Verification:**
- Measure response times
- Calculate statistics
- Verify acceptable performance

---

### Test 9.3: Token Refresh Time
**Objective:** Measure token refresh response time

**Steps:**
1. Login to get valid session
2. Trigger token refresh
3. Measure refresh request time
4. Repeat 10 times

**Expected Results:**
- Average refresh time < 300ms
- P95 refresh time < 500ms
- Minimal user impact

**Verification:**
- Measure refresh times
- Verify performance
- Check user experience impact

---

### Test 9.4: Cookie Size Impact
**Objective:** Verify cookie size doesn't impact performance

**Steps:**
1. Measure cookie sizes
2. Monitor request overhead
3. Test with multiple cookies
4. Check performance impact

**Expected Results:**
- Total cookie size < 4KB
- Minimal request overhead
- No significant performance impact

**Verification:**
- Measure cookie sizes
- Check request headers
- Verify performance

---

## Test Category 10: Recovery Scenarios

### Test 10.1: Password Reset Flow
**Objective:** Verify password reset functionality

**Steps:**
1. Click "Forgot Password"
2. Enter registered email
3. Check email for reset link
4. Click reset link
5. Enter new password
6. Login with new password

**Expected Results:**
- Reset email sent
- Reset link works and expires appropriately
- New password accepted
- Old password no longer works
- User can login with new password

**Verification:**
- Test complete flow
- Verify email delivery
- Check link expiration
- Verify password change

---

### Test 10.2: Account Recovery After Lockout
**Objective:** Verify account recovery after rate limit lockout

**Steps:**
1. Trigger rate limit (11 failed logins)
2. Wait for rate limit to expire (15 minutes)
3. Attempt login with correct credentials
4. Verify successful login

**Expected Results:**
- Rate limit expires after configured time
- User can login after expiration
- No permanent lockout
- Clear indication of when lockout expires

**Verification:**
- Test rate limit expiration
- Verify recovery
- Check timing accuracy

---

### Test 10.3: Session Recovery After Server Restart
**Objective:** Verify session behavior after server restart

**Steps:**
1. Login to establish session
2. Restart Edge Functions (simulate deployment)
3. Attempt to use session
4. Check if session still valid

**Expected Results:**
- Session may be invalid if using in-memory rate limiting
- Or session valid if using database-backed sessions
- Clear error if session invalid
- Graceful degradation

**Verification:**
- Test session persistence
- Document actual behavior
- Check for issues

---

## Test Execution Checklist

### Pre-Test Setup
- [ ] Test environment prepared
- [ ] Test data created
- [ ] Browser DevTools configured
- [ ] Network monitoring enabled
- [ ] Cookies cleared
- [ ] Test plan reviewed

### Test Execution
- [ ] Authentication flow tests completed
- [ ] Session persistence tests completed
- [ ] Rate limiting tests completed
- [ ] CSRF protection tests completed
- [ ] Input validation tests completed
- [ ] Security vulnerability tests completed
- [ ] Concurrent user tests completed
- [ ] Edge case tests completed
- [ ] Performance tests completed
- [ ] Recovery scenario tests completed

### Post-Test
- [ ] All results documented
- [ ] Bugs logged with reproduction steps
- [ ] Screenshots captured for failures
- [ ] Performance metrics recorded
- [ ] Test report generated
- [ ] Recommendations documented

---

## Bug Reporting Template

### Bug Report Format

```
Title: [Category] - Brief Description

Severity: [Critical/High/Medium/Low]

Steps to Reproduce:
1. Step 1
2. Step 2
3. Step 3

Expected Results:
- What should happen

Actual Results:
- What actually happens

Environment:
- Browser: [Chrome/Firefox/Safari/Edge + version]
- OS: [Windows/Mac/Linux + version]
- Test Environment: [Staging/Production]

Screenshots/Videos:
- Attach if applicable

Additional Information:
- Any relevant logs, error messages, or context
```

---

## Test Data Cleanup

After testing, clean up test data:

1. Delete test user accounts created during signup tests
2. Clear test profiles from database
3. Remove test app access records
4. Clear rate limit entries (if using database)
5. Verify no test data remains in production

---

## Notes

- Document any deviations from expected results
- Capture screenshots of failures
- Record performance metrics
- Note any environment-specific issues
- Update test scenarios based on findings

---

**Last Updated:** April 18, 2026  
**Next Review:** May 18, 2026
