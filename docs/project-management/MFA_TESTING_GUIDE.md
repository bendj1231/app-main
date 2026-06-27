# MFA Testing Guide

## Overview
This document provides end-to-end testing procedures for the Multi-Factor Authentication (MFA) implementation.

## Prerequisites
- User account created and verified
- Authenticator app installed (Google Authenticator, Authy, etc.)
- Access to the application

## Test Scenarios

### 1. MFA Setup Flow

**Steps:**
1. Login to the application
2. Navigate to Settings → Security
3. Click "Enable Two-Factor Authentication"
4. Click "Setup 2FA"
5. Verify QR code is displayed
6. Scan QR code with authenticator app
7. Enter the 6-digit code from the authenticator app
8. Click "Verify & Enable MFA"
9. Verify backup codes are displayed
10. Save backup codes in a secure location
11. Click "I've Saved My Codes"

**Expected Results:**
- QR code displays correctly with otpauth:// URL
- Authenticator app accepts the QR code
- TOTP code verification succeeds
- MFA status shows "Enabled"
- 10 backup codes are generated and displayed
- User can dismiss the backup codes modal

**Edge Cases:**
- Invalid code: Show error message
- Expired code: Show error message
- Network timeout: Show appropriate error message

### 2. Login with MFA Enabled

**Steps:**
1. Logout of the application
2. Enter email and password
3. Click "Access Platform"
4. Verify MFA verification modal appears
5. Enter the 6-digit code from authenticator app
6. Click "Verify"
7. Verify successful login

**Expected Results:**
- MFA verification modal appears after credential verification
- Code input accepts 6 digits
- Correct code grants access
- User is redirected to dashboard

**Edge Cases:**
- Invalid code: Show error message, allow retry
- No code entered: Show validation error
- Timeout: Show appropriate error message

### 3. Login with Backup Code

**Steps:**
1. Logout of the application
2. Enter email and password
3. Click "Access Platform"
4. MFA verification modal appears
5. Enter a backup code instead of TOTP code
6. Click "Verify"
7. Verify successful login

**Expected Results:**
- Backup code is accepted
- Code is marked as used
- User can access the account

**Edge Cases:**
- Used backup code: Show error message
- Invalid backup code: Show error message
- All backup codes used: Show error, prompt to regenerate

### 4. MFA Disable Flow

**Steps:**
1. Login to the application
2. Navigate to Settings → Security
3. Click "Disable 2FA"
4. Enter current TOTP code or backup code
5. Click "Disable MFA"
6. Confirm MFA is disabled

**Expected Results:**
- MFA disable modal appears
- Code verification works
- MFA status shows "Disabled"
- User can login without MFA on next login

**Edge Cases:**
- Invalid code: Show error message
- No MFA enabled: Show appropriate message

### 5. Backup Code Regeneration

**Steps:**
1. Login to the application
2. Navigate to Settings → Security → Backup Codes tab
3. Click "Generate New Backup Codes"
4. Confirm the action
5. Verify new codes are generated
6. Save new codes

**Expected Results:**
- Confirmation dialog appears
- Old codes are invalidated
- 10 new codes are generated
- Warning about one-time display

**Edge Cases:**
- Rate limit exceeded: Show error message
- MFA not enabled: Show appropriate message

### 6. MFA Enforcement Policies

**Steps:**
1. Set MFA enforcement to 'optional' for a user
2. Verify user can login without MFA
3. Set MFA enforcement to 'required_all' for a user
4. Verify user must complete MFA to login
5. Set MFA enforcement to 'required_admin' for admin user
6. Verify admin must complete MFA to login

**Expected Results:**
- Optional policy: User can skip MFA setup
- Required policy: User must complete MFA to access account
- Admin policy: Only admins require MFA

### 7. Rate Limiting

**Steps:**
1. Attempt MFA setup 6 times within 1 hour
2. Verify rate limit error on 6th attempt
3. Attempt MFA verification 11 times within 15 minutes
4. Verify rate limit error on 11th attempt
5. Attempt backup code generation 4 times within 24 hours
6. Verify rate limit error on 4th attempt

**Expected Results:**
- Rate limit errors appear with appropriate messages
- Retry-After header is set correctly
- User can retry after rate limit expires

### 8. Security Headers

**Steps:**
1. Use browser dev tools to inspect MFA Edge Function responses
2. Verify security headers are present:
   - Content-Security-Policy
   - X-Frame-Options
   - X-Content-Type-Options
   - X-XSS-Protection
   - Referrer-Policy
   - Permissions-Policy
   - Strict-Transport-Security

**Expected Results:**
- All security headers are present
- Headers have correct values

### 9. RLS Policies

**Steps:**
1. Login as User A
2. Attempt to access User B's MFA settings via direct SQL query
3. Verify access is denied
4. Login as service role
5. Verify service role can access all MFA data

**Expected Results:**
- Users can only access their own MFA data
- Service role has full access

### 10. Secret Encryption

**Steps:**
1. Query mfa_secrets table directly
2. Verify encrypted_secret column contains encrypted data
3. Verify secret column is NULL (after encryption)
4. Test decrypt_mfa_secret function

**Expected Results:**
- Secrets are encrypted in database
- Decryption function works correctly
- Plain text secrets are not stored

## Test Results Template

| Test Scenario | Status | Notes | Date |
|--------------|--------|-------|------|
| MFA Setup Flow | ⬜ | | |
| Login with MFA Enabled | ⬜ | | |
| Login with Backup Code | ⬜ | | |
| MFA Disable Flow | ⬜ | | |
| Backup Code Regeneration | ⬜ | | |
| MFA Enforcement Policies | ⬜ | | |
| Rate Limiting | ⬜ | | |
| Security Headers | ⬜ | | |
| RLS Policies | ⬜ | | |
| Secret Encryption | ⬜ | | |

## Known Issues
- None currently identified

## Production Checklist
- [ ] Change default encryption key from placeholder
- [ ] Configure MFA enforcement policy per user role
- [ ] Enable database-backed rate limiting
- [ ] Set up MFA event monitoring and logging
- [ ] Configure SMS-based 2FA fallback (if needed)
- [ ] Test in staging environment before production deployment

## Support Contacts
- For MFA issues: Contact security team
- For Edge Function issues: Check Supabase logs
- For database issues: Contact database administrator
