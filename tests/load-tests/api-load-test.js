// API Endpoint Load Test
// Tests API endpoints under load

import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration
const BASE_URL = __ENV.BASE_URL || 'https://your-project.supabase.co/functions/v1';
const API_BASE_URL = __ENV.API_BASE_URL || 'https://your-project.supabase.co/rest/v1';

// Load test configuration
export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up to 50 users
    { duration: '3m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 200 },  // Ramp up to 200 users
    { duration: '10m', target: 250 }, // Ramp up to 250 users
    { duration: '10m', target: 250 }, // Sustain at 250 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(50)<150', 'p(95)<300', 'p(99)<500'],
    http_req_failed: ['rate<0.03'],
    checks: ['rate>0.97'],
  },
};

// Helper function to get auth headers
function getAuthHeaders() {
  const accessToken = __ENV.ACCESS_TOKEN || 'test-access-token';
  return {
    'Authorization': `Bearer ${accessToken}`,
    'apikey': __ENV.API_KEY || 'test-api-key',
    'Content-Type': 'application/json',
  };
}

// Test: GET request (read operation)
export function getEndpoint(endpoint) {
  const res = http.get(`${API_BASE_URL}${endpoint}`, {
    headers: getAuthHeaders(),
    tags: { name: 'GET', endpoint: endpoint },
  });

  const success = check(res, {
    'GET status is 200 or 404': (r) => r.status === 200 || r.status === 404,
    'GET response time < 200ms': (r) => r.timings.duration < 200,
    'GET has content-type': (r) => r.headers['Content-Type'] && r.headers['Content-Type'].includes('application/json'),
  });

  return {
    success,
    status: res.status,
  };
}

// Test: POST request (write operation)
export function postEndpoint(endpoint, data) {
  const res = http.post(`${API_BASE_URL}${endpoint}`, 
    JSON.stringify(data),
    {
      headers: getAuthHeaders(),
      tags: { name: 'POST', endpoint: endpoint },
    }
  );

  const success = check(res, {
    'POST status is 201 or 400': (r) => r.status === 201 || r.status === 400,
    'POST response time < 300ms': (r) => r.timings.duration < 300,
  });

  return {
    success,
    status: res.status,
  };
}

// Test: PUT request (update operation)
export function putEndpoint(endpoint, data) {
  const res = http.put(`${API_BASE_URL}${endpoint}`, 
    JSON.stringify(data),
    {
      headers: getAuthHeaders(),
      tags: { name: 'PUT', endpoint: endpoint },
    }
  );

  const success = check(res, {
    'PUT status is 200 or 404': (r) => r.status === 200 || r.status === 404,
    'PUT response time < 300ms': (r) => r.timings.duration < 300,
  });

  return {
    success,
    status: res.status,
  };
}

// Test: DELETE request (delete operation)
export function deleteEndpoint(endpoint) {
  const res = http.del(`${API_BASE_URL}${endpoint}`, {
    headers: getAuthHeaders(),
    tags: { name: 'DELETE', endpoint: endpoint },
  });

  const success = check(res, {
    'DELETE status is 204 or 404': (r) => r.status === 204 || r.status === 404,
    'DELETE response time < 200ms': (r) => r.timings.duration < 200,
  });

  return {
    success,
    status: res.status,
  };
}

// Test: Batch GET requests
export function batchGetRequests(endpoints) {
  const results = [];
  
  for (const endpoint of endpoints) {
    const res = http.get(`${API_BASE_URL}${endpoint}`, {
      headers: getAuthHeaders(),
      tags: { name: 'batch-GET', endpoint: endpoint },
    });

    results.push({
      endpoint,
      status: res.status,
      duration: res.timings.duration,
    });
  }

  const allSuccess = results.every(r => r.status === 200 || r.status === 404);
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;

  check({
    'all batch GET requests successful': allSuccess,
    'batch GET avg response time < 300ms': avgDuration < 300,
  });

  return {
    success: allSuccess,
    avgDuration,
    results,
  };
}

// Test: Filtered GET request
export function filteredGetRequest(endpoint, filter) {
  const res = http.get(`${API_BASE_URL}${endpoint}?${filter}`, {
    headers: getAuthHeaders(),
    tags: { name: 'filtered-GET', endpoint: endpoint },
  });

  const success = check(res, {
    'filtered GET status is 200': (r) => r.status === 200,
    'filtered GET response time < 250ms': (r) => r.timings.duration < 250,
    'filtered GET has data': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body) || typeof body === 'object';
      } catch {
        return false;
      }
    },
  });

  return {
    success,
    status: res.status,
  };
}

// Test: Paginated GET request
export function paginatedGetRequest(endpoint, page = 1, limit = 20) {
  const res = http.get(`${API_BASE_URL}${endpoint}?page=${page}&limit=${limit}`, {
    headers: getAuthHeaders(),
    tags: { name: 'paginated-GET', endpoint: endpoint },
  });

  const success = check(res, {
    'paginated GET status is 200': (r) => r.status === 200,
    'paginated GET response time < 300ms': (r) => r.timings.duration < 300,
    'paginated GET has data': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body);
      } catch {
        return false;
      }
    },
  });

  return {
    success,
    status: res.status,
  };
}

// Main test scenario
export default function () {
  const userId = __VU;

  // Scenario 1: GET requests (40% of requests)
  if (Math.random() < 0.4) {
    const endpoints = [
      '/profiles',
      '/user_app_access',
      '/pilot_licensure_experience',
    ];
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    getEndpoint(endpoint);
  }

  // Scenario 2: Filtered GET requests (20% of requests)
  else if (Math.random() < 0.6) {
    const endpoint = '/profiles';
    const filter = `user_id=eq.test${userId}`;
    filteredGetRequest(endpoint, filter);
  }

  // Scenario 3: Paginated GET requests (15% of requests)
  else if (Math.random() < 0.75) {
    const endpoint = '/profiles';
    const page = Math.floor(Math.random() * 10) + 1;
    paginatedGetRequest(endpoint, page);
  }

  // Scenario 4: POST requests (10% of requests)
  else if (Math.random() < 0.85) {
    const endpoint = '/profiles';
    const data = {
      user_id: `test${userId}`,
      full_name: `Test User ${userId}`,
      email: `test${userId}@example.com`,
    };
    postEndpoint(endpoint, data);
  }

  // Scenario 5: PUT requests (10% of requests)
  else if (Math.random() < 0.95) {
    const endpoint = `/profiles?id=eq.test${userId}`;
    const data = {
      full_name: `Updated Test User ${userId}`,
    };
    putEndpoint(endpoint, data);
  }

  // Scenario 6: DELETE requests (5% of requests)
  else {
    const endpoint = `/profiles?id=eq.test${userId}`;
    deleteEndpoint(endpoint);
  }

  // Sleep between requests to simulate realistic API usage
  sleep(Math.random() * 2 + 0.5); // 0.5-2.5 seconds between requests
}
