// Authentication Flow Load Test
// Tests authentication flows under load

import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration
const BASE_URL = __ENV.BASE_URL || 'https://your-project.supabase.co/functions/v1';
const TEST_EMAIL_PREFIX = __ENV.TEST_EMAIL_PREFIX || 'test.user';
const TEST_PASSWORD = __ENV.TEST_PASSWORD || 'TestPassword123';

// Load test configuration
export const options = {
  stages: [
    { duration: '2m', target: 10 },   // Ramp up to 10 users
    { duration: '3m', target: 30 },   // Ramp up to 30 users
    { duration: '5m', target: 60 },   // Ramp up to 60 users
    { duration: '10m', target: 100 }, // Ramp up to 100 users
    { duration: '10m', target: 100 }, // Sustain at 100 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(50)<200', 'p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.05'],
    checks: ['rate>0.95'],
  },
};

// Helper function to generate test user email
function getTestEmail(userId) {
  return `${TEST_EMAIL_PREFIX}${userId}@example.com`;
}

// Helper function to extract CSRF token from cookies
function extractCSRFToken(cookies) {
  const match = cookies.match(/csrf-token=([^;]+)/);
  return match ? match[1] : null;
}

// Helper function to extract access token from cookies
function extractAccessToken(cookies) {
  const match = cookies.match(/sb-access-token=([^;]+)/);
  return match ? match[1] : null;
}

// Helper function to extract refresh token from cookies
function extractRefreshToken(cookies) {
  const match = cookies.match(/sb-refresh-token=([^;]+)/);
  return match ? match[1] : null;
}

// Test: Login flow
export function login(userId) {
  const email = getTestEmail(userId);
  const csrfToken = 'test-csrf-token'; // In real test, would get from previous request

  const loginRes = http.post(`${BASE_URL}/auth-login`, 
    JSON.stringify({
      email: email,
      password: TEST_PASSWORD
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      tags: { name: 'login' },
    }
  );

  const loginSuccess = check(loginRes, {
    'login status is 200 or 401': (r) => r.status === 200 || r.status === 401,
    'login has CSRF token': (r) => r.headers['Set-Cookie'] && r.headers['Set-Cookie'].includes('csrf-token'),
    'login has access token': (r) => r.headers['Set-Cookie'] && r.headers['Set-Cookie'].includes('sb-access-token'),
    'login has refresh token': (r) => r.headers['Set-Cookie'] && r.headers['Set-Cookie'].includes('sb-refresh-token'),
    'login response time < 500ms': (r) => r.timings.duration < 500,
  });

  return {
    success: loginSuccess,
    cookies: loginRes.headers['Set-Cookie'],
    accessToken: extractAccessToken(loginRes.headers['Set-Cookie']),
    refreshToken: extractRefreshToken(loginRes.headers['Set-Cookie']),
    csrfToken: extractCSRFToken(loginRes.headers['Set-Cookie']),
  };
}

// Test: Signup flow
export function signup(userId) {
  const timestamp = Date.now();
  const email = `test.user${timestamp}.${userId}@example.com`;
  const csrfToken = 'test-csrf-token';

  const signupRes = http.post(`${BASE_URL}/auth-signup`, 
    JSON.stringify({
      email: email,
      password: TEST_PASSWORD,
      userData: {
        fullName: 'Test User',
        pilotId: `TEST${userId}`,
      }
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      tags: { name: 'signup' },
    }
  );

  const signupSuccess = check(signupRes, {
    'signup status is 200 or 400': (r) => r.status === 200 || r.status === 400,
    'signup response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  return {
    success: signupSuccess,
    status: signupRes.status,
  };
}

// Test: Logout flow
export function logout(cookies, csrfToken) {
  const logoutRes = http.post(`${BASE_URL}/auth-logout`, 
    JSON.stringify({}),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
        'X-CSRF-Token': csrfToken,
      },
      tags: { name: 'logout' },
    }
  );

  const logoutSuccess = check(logoutRes, {
    'logout status is 200': (r) => r.status === 200,
    'logout clears cookies': (r) => r.headers['Set-Cookie'] && r.headers['Set-Cookie'].includes('Max-Age=0'),
    'logout response time < 200ms': (r) => r.timings.duration < 200,
  });

  return {
    success: logoutSuccess,
  };
}

// Test: Token refresh flow
export function refreshToken(cookies, csrfToken) {
  const refreshRes = http.post(`${BASE_URL}/auth-refresh`, 
    JSON.stringify({}),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
        'X-CSRF-Token': csrfToken,
      },
      tags: { name: 'refresh' },
    }
  );

  const refreshSuccess = check(refreshRes, {
    'refresh status is 200 or 401': (r) => r.status === 200 || r.status === 401,
    'refresh has new CSRF token': (r) => r.headers['Set-Cookie'] && r.headers['Set-Cookie'].includes('csrf-token'),
    'refresh has new access token': (r) => r.headers['Set-Cookie'] && r.headers['Set-Cookie'].includes('sb-access-token'),
    'refresh response time < 300ms': (r) => r.timings.duration < 300,
  });

  return {
    success: refreshSuccess,
    newCsrfToken: extractCSRFToken(refreshRes.headers['Set-Cookie']),
    newAccessToken: extractAccessToken(refreshRes.headers['Set-Cookie']),
  };
}

// Test: Session verification flow
export function verifySession(cookies, csrfToken) {
  const verifyRes = http.post(`${BASE_URL}/auth-verify`, 
    JSON.stringify({}),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
        'X-CSRF-Token': csrfToken,
      },
      tags: { name: 'verify' },
    }
  );

  const verifySuccess = check(verifyRes, {
    'verify status is 200 or 401': (r) => r.status === 200 || r.status === 401,
    'verify response time < 200ms': (r) => r.timings.duration < 200,
  });

  return {
    success: verifySuccess,
  };
}

// Main test scenario
export default function () {
  const userId = __VU; // Use virtual user ID as user identifier

  // Scenario 1: Login flow (70% of requests)
  if (Math.random() < 0.7) {
    const loginResult = login(userId);
    
    if (loginResult.success && loginResult.accessToken) {
      // Scenario 1a: Verify session after login (50% of logins)
      if (Math.random() < 0.5) {
        const verifyResult = verifySession(loginResult.cookies, loginResult.csrfToken);
      }

      // Scenario 1b: Refresh token (20% of logins)
      if (Math.random() < 0.2) {
        const refreshResult = refreshToken(loginResult.cookies, loginResult.csrfToken);
      }

      // Scenario 1c: Logout (10% of logins)
      if (Math.random() < 0.1) {
        const logoutResult = logout(loginResult.cookies, loginResult.csrfToken);
      }
    }
  }

  // Scenario 2: Signup flow (20% of requests)
  else if (Math.random() < 0.9) {
    const signupResult = signup(userId);
  }

  // Scenario 3: Direct verify (10% of requests)
  else {
    // This would typically use cached cookies from a previous login
    // For load testing, we simulate with invalid cookies to test error handling
    const verifyRes = http.post(`${BASE_URL}/auth-verify`, 
      JSON.stringify({}),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'sb-access-token=invalid-token',
          'X-CSRF-Token': 'invalid-token',
        },
        tags: { name: 'verify' },
      }
    );

    check(verifyRes, {
      'verify handles invalid token': (r) => r.status === 401,
    });
  }

  // Sleep between requests to simulate realistic user behavior
  sleep(Math.random() * 3 + 1); // 1-4 seconds between requests
}
