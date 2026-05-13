# Testing Guide - Phase 5

## Step 27: Cross-Subdomain Authentication Testing

### Test 1: Login on Main Domain, Access Subdomain
```
1. Go to https://pilotrecognition.com
2. Log in with test account
3. Navigate to https://enterprise.pilotrecognition.com
4. EXPECTED: Still logged in, user info visible
5. ACTUAL: __________
6. PASS/FAIL: _______
```

### Test 2: Login on Subdomain, Access Main Domain
```
1. Go to https://join.pilotrecognition.com
2. Log in with test account
3. Navigate to https://pilotrecognition.com/portal
4. EXPECTED: Still logged in
5. ACTUAL: __________
6. PASS/FAIL: _______
```

### Test 3: Logout Propagation
```
1. Log in on any subdomain
2. Log out
3. Check all other subdomains
4. EXPECTED: Logged out everywhere
5. ACTUAL: __________
6. PASS/FAIL: _______
```

### Supabase Auth Configuration
Verify in Supabase Dashboard:
- Site URL: `https://pilotrecognition.com`
- Additional Redirect URLs: 
  ```
  https://enterprise.pilotrecognition.com/**
  https://pathways.pilotrecognition.com/**
  https://recognitionplus.pilotrecognition.com/**
  https://support.pilotrecognition.com/**
  https://partners.pilotrecognition.com/**
  https://join.pilotrecognition.com/**
  ```

---

## Step 28: Analytics Tracking Verification

### Google Analytics 4 Setup

Add to all pages (already in layout):
```tsx
// Google Analytics 4 tracking ID: G-XXXXXXXXXX
// Should fire on all subdomain page views
```

### Test Checklist

| Subdomain | Page View Tracking | Event Tracking | E-commerce | Status |
|-----------|-------------------|----------------|------------|--------|
| pilotrecognition.com | ✅ | ✅ | N/A | ______ |
| enterprise.pilotrecognition.com | ✅ | ✅ | N/A | ______ |
| pathways.pilotrecognition.com | ✅ | ✅ | N/A | ______ |
| recognitionplus.pilotrecognition.com | ✅ | ✅ | Checkout | ______ |
| support.pilotrecognition.com | ✅ | ✅ | N/A | ______ |
| join.pilotrecognition.com | ✅ | ✅ | Signup | ______ |

### Verify in GA4 Real-Time
```
1. Open GA4 dashboard
2. Go to Reports > Realtime
3. Visit each subdomain
4. Confirm activity appears within 30 seconds
```

### Cross-Domain Tracking Setup
In GA4 Admin > Data Streams:
- Configure domains list:
  - pilotrecognition.com
  - enterprise.pilotrecognition.com
  - pathways.pilotrecognition.com
  - recognitionplus.pilotrecognition.com
  - support.pilotrecognition.com
  - partners.pilotrecognition.com
  - join.pilotrecognition.com

### Test User Journey Tracking
```
1. Visit https://pilotrecognition.com
2. Click "Join" → goes to join.pilotrecognition.com
3. Click "Enterprise" link → goes to enterprise.pilotrecognition.com
4. Check GA4: Should show as single session, not 3 separate sessions
```

---

## Automated Test Script

Run this in browser console on each subdomain:

```javascript
// Test 1: Check if Supabase auth works
console.log('Testing auth on:', window.location.hostname);
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user ? 'LOGGED IN' : 'NOT LOGGED IN');

// Test 2: Check if GA4 firing
gtag('event', 'test_event', {
  'event_category': 'testing',
  'event_label': window.location.hostname
});
console.log('GA4 test event sent');
```

---

## Bug Reporting Template

If tests fail:

```
**Subdomain:** __________
**Test:** __________
**Expected:** __________
**Actual:** __________
**Browser:** __________
**Screenshot:** __________
**Console Errors:** __________
```

---

**Timeline:** Complete within 48 hours of DNS propagation
**Owner:** __________ (assign team member)
