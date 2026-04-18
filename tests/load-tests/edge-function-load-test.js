// Edge Function Load Test
// Tests Edge Functions specifically under load

import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration
const BASE_URL = __ENV.BASE_URL || 'https://your-project.supabase.co/functions/v1';
const TEST_EMAIL = __ENV.TEST_EMAIL || 'test.user@example.com';
const TEST_PASSWORD = __ENV.TEST_PASSWORD || 'TestPassword123';

// Load test configuration for 500 concurrent users (target)
export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up to 50 users (10%)
    { duration: '3m', target: 150 },  // Ramp up to 150 users (30%)
    { duration: '5m', target: 300 },  // Ramp up to 300 users (60%)
    { duration: '10m', target: 500 }, // Ramp up to 500 users (100%)
    { duration: '10m', target: 500 }, // Sustain at 500 users
    { duration: '5m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(50)<100', 'p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.05'],
    checks: ['rate>0.95'],
  },
};

// Helper function to generate CSRF token
function generateCSRFToken() {
  return 'test-csrf-token-' + Math.random().toString(36).substring(7);
}

// Test: auth-login Edge Function
export function testAuthLogin() {
  const csrfToken = generateCSRFToken();
  
  const res = http.post(`${BASE_URL}/auth-login`, 
    JSON.stringify({
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      tags: { name: 'auth-login' },
    }
  );

  const success = check(res, {
    'auth-login status is 200 or 401': (r) => r.status === 200 || r.status === 401,
    'auth-login has cookies': (r) => r.headers['Set-Cookie'] !== undefined,
    'auth-login response time < 300ms': (r) => r.timings.duration < 300,
    'auth-login has CSRF token': (r) => r.headers['Set-Cookie'] && r.headers['Set-Cookie'].includes('csrf-token'),
    'auth-login has access token': (r) => r.headers['Set-Cookie'] && r.headers['Set-Cookie'].includes('sb-access-token'),
    'auth-login has refresh token': (r) => r.headers['Set-Cookie'] && r.headers['Set-Cookie'].includes('sb-refresh-token'),
  });

  return {
    success,
    status: res.status,
    duration: res.timings.duration,
    hasCookies: !!res.headers['Set-Cookie'],
  };
}

// Test: auth-signup Edge Function
export function testAuthSignup() {
  const csrfToken = generateCSRFToken();
  const timestamp = Date.now();
  
  const res = http.post(`${BASE_URL}/auth-signup`, 
    JSON.stringify({
      email: `test.user${timestamp}@example.com`,
      password: TEST_PASSWORD,
      userData: {
        fullName: 'Test User',
        pilotId: `TEST${timestamp}`,
      }
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      tags: { name: 'auth-signup' },
    }
  );

  const success = check(res, {
    'auth-signup status is 200 or 400': (r) => r.status === 200 || r.status === 400,
    'auth-signup response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  return {
    success,
    status: res.status,
    duration: res.timings.duration,
  };
}

// Test: auth-logout Edge Function
export function testAuthLogout() {
  const csrfToken = generateCSRFToken();
  const cookies = 'sb-access-token=test-token; csrf-token=test-csrf';
  
  const res = http.post(`${BASE_URL}/auth-logout`, 
    JSON.stringify({}),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
        'X-CSRF-Token': csrfToken,
      },
      tags: { name: 'auth-logout' },
    }
  );

  const success = check(res, {
    'auth-logout status is 200': (r) => r.status === 200,
    'auth-logout response time < 200ms': (r) => r.timings.duration < 200,
    'auth-logout clears cookies': (r) => r.headers['Set-Cookie'] && r.headers['Set-Cookie'].includes('Max-Age=0'),
  });

  return {
    success,
    status: res.status,
    duration: res.timings.duration,
  };
}

// Test: auth-refresh Edge Function
export function testAuthRefresh() {
  const csrfToken = generateCSRFToken();
  const cookies = 'sb-refresh-token=test-refresh-token; csrf-token=test-csrf';
  
  const res = http.post(`${BASE_URL}/auth-refresh`, 
    JSON.stringify({}),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
        'X-CSRF-Token': csrfToken,
      },
      tags: { name: 'auth-refresh' },
    }
  );

  const success = check(res, {
    'auth-refresh status is 200 or 401': (r) => r.status === 200 || r.status === 401,
    'auth-refresh response time < 300ms': (r) => r.timings.duration < 300,
    'auth-refresh has new CSRF token': (r) => r.headers['Set-Cookie'] && r.headers['Set-Cookie'].includes('csrf-token'),
  });

  return {
    success,
    status: res.status,
    duration: res.timings.duration,
  };
}

// Test: auth-verify Edge Function
export function testAuthVerify() {
  const csrfToken = generateCSRFToken();
  const cookies = 'sb-access-token=test-access-token; csrf-token=test-csrf';
  
  const res = http.post(`${BASE_URL}/auth-verify`, 
    JSON.stringify({}),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
        'X-CSRF-Token': csrfToken,
      },
      tags: { name: 'auth-verify' },
    }
  );

  const success = check(res, {
    'auth-verify status is 200 or 401': (r) => r.status === 200 || r.status === 401,
    'auth-verify response time < 200ms': (r) => r.timings.duration < 200,
  });

  return {
    success,
    status: res.status,
    duration: res.timings.duration,
  };
}

// Test: Cold start detection
export function testColdStart() {
  const startTime = Date.now();
  
  const res = http.post(`${BASE_URL}/auth-verify`, 
    JSON.stringify({}),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'sb-access-token=test-token; csrf-token=test-csrf',
        'X-CSRF-Token': generateCSRFToken(),
      },
      tags: { name: 'cold-start' },
    }
  );

  const duration = Date.now() - startTime;
  
  // Cold start typically takes > 500ms
  const isColdStart = duration > 500;

  check(res, {
    'cold-start detection': (r) => true, // Always pass, just for measurement
  });

  return {
    duration,
    isColdStart,
    status: res.status,
  };
}

// Test: Consecutive requests (warm state)
export function testConsecutiveRequests() {
  const csrfToken = generateCSRFToken();
  const cookies = 'sb-access-token=test-token; csrf-token=test-csrf';
  const durations = [];
  
  // Make 5 consecutive requests
  for (let i = 0; i < 5; i++) {
    const startTime = Date.now();
    
    const res = http.post(`${BASE_URL}/auth-verify`, 
      JSON.stringify({}),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies,
          'X-CSRF-Token': csrfToken,
        },
        tags: { name: 'consecutive' },
      }
    );

    durations.push(Date.now() - startTime);
    
    // Small sleep between requests
    sleep(0.1);
  }

  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);

  check({
    'consecutive avg response time < 100ms': avgDuration < 100,
    'consecutive max response time < 200ms': maxDuration < 200,
  });

  return {
    avgDuration,
    minDuration,
    maxDuration,
    durations,
  };
}

// Main test scenario
export default function () {
  const scenario = Math.random();

  // Scenario 1: auth-login (35% of requests)
  if (scenario < 0.35) {
    testAuthLogin();
  }
  
  // Scenario 2: auth-verify (30% of requests)
  else if (scenario < 0.65) {
    testAuthVerify();
  }
  
  // Scenario 3: auth-refresh (15% of requests)
  else if (scenario < 0.80) {
    testAuthRefresh();
  }
  
  // Scenario 4: auth-logout (10% of requests)
  else if (scenario < 0.90) {
    testAuthLogout();
  }
  
  // Scenario 5: auth-signup (5% of requests)
  else if (scenario < 0.95) {
    testAuthSignup();
  }
  
  // Scenario 6: Cold start detection (2.5% of requests)
  else if (scenario < 0.975) {
    testColdStart();
  }
  
  // Scenario 7: Consecutive requests (2.5% of requests)
  else {
    testConsecutiveRequests();
  }

  // Sleep between requests to simulate realistic usage
  sleep(Math.random() * 2 + 0.5); // 0.5-2.5 seconds between requests
}

// Setup function to initialize test data
export function setup() {
  console.log('Starting Edge Function load test...');
  console.log(`Target: 500 concurrent users`);
  console.log(`Duration: 30 minutes`);
  console.log(`Base URL: ${BASE_URL}`);
}

// Teardown function to clean up
export function teardown(data) {
  console.log('Edge Function load test completed.');
  console.log('Check results for detailed metrics.');
}
