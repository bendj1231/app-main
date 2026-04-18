// Database Load Test
// Tests database query performance under load

import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration
const API_BASE_URL = __ENV.API_BASE_URL || 'https://your-project.supabase.co/rest/v1';
const ACCESS_TOKEN = __ENV.ACCESS_TOKEN || 'test-access-token';
const API_KEY = __ENV.API_KEY || 'test-api-key';

// Load test configuration
export const options = {
  stages: [
    { duration: '2m', target: 25 },   // Ramp up to 25 users
    { duration: '3m', target: 75 },   // Ramp up to 75 users
    { duration: '5m', target: 150 },  // Ramp up to 150 users
    { duration: '10m', target: 250 }, // Ramp up to 250 users
    { duration: '10m', target: 250 }, // Sustain at 250 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(50)<100', 'p(95)<200', 'p(99)<400'],
    http_req_failed: ['rate<0.02'],
    checks: ['rate>0.98'],
  },
};

// Helper function to get auth headers
function getAuthHeaders() {
  return {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'apikey': API_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
  };
}

// Test: Simple SELECT query (single row)
export function testSimpleSelect() {
  const userId = `test${__VU}`;
  
  const res = http.get(`${API_BASE_URL}/profiles?user_id=eq.${userId}&select=*`, {
    headers: getAuthHeaders(),
    tags: { name: 'simple-select' },
  });

  const success = check(res, {
    'simple-select status is 200 or 404': (r) => r.status === 200 || r.status === 404,
    'simple-select response time < 100ms': (r) => r.timings.duration < 100,
    'simple-select has data array': (r) => {
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
    duration: res.timings.duration,
  };
}

// Test: SELECT with JOIN
export function testSelectWithJoin() {
  const userId = `test${__VU}`;
  
  const res = http.get(
    `${API_BASE_URL}/profiles?user_id=eq.${userId}&select=*,pilot_licensure_experience(*)`,
    {
      headers: getAuthHeaders(),
      tags: { name: 'select-with-join' },
    }
  );

  const success = check(res, {
    'select-with-join status is 200': (r) => r.status === 200,
    'select-with-join response time < 200ms': (r) => r.timings.duration < 200,
  });

  return {
    success,
    status: res.status,
    duration: res.timings.duration,
  };
}

// Test: SELECT with filter and order
export function testSelectWithFilter() {
  const res = http.get(
    `${API_BASE_URL}/profiles?created_at=gte.2024-01-01&order=created_at&limit=50`,
    {
      headers: getAuthHeaders(),
      tags: { name: 'select-with-filter' },
    }
  );

  const success = check(res, {
    'select-with-filter status is 200': (r) => r.status === 200,
    'select-with-filter response time < 150ms': (r) => r.timings.duration < 150,
    'select-with-filter returns data': (r) => {
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
    duration: res.timings.duration,
  };
}

// Test: INSERT query
export function testInsert() {
  const timestamp = Date.now();
  const userId = `test${timestamp}`;
  
  const res = http.post(
    `${API_BASE_URL}/profiles`,
    JSON.stringify({
      user_id: userId,
      full_name: `Test User ${timestamp}`,
      email: `test${timestamp}@example.com`,
      created_at: new Date().toISOString(),
    }),
    {
      headers: getAuthHeaders(),
      tags: { name: 'insert' },
    }
  );

  const success = check(res, {
    'insert status is 201': (r) => r.status === 201,
    'insert response time < 200ms': (r) => r.timings.duration < 200,
  });

  return {
    success,
    status: res.status,
    duration: res.timings.duration,
  };
}

// Test: UPDATE query
export function testUpdate() {
  const userId = `test${__VU}`;
  
  const res = http.patch(
    `${API_BASE_URL}/profiles?user_id=eq.${userId}`,
    JSON.stringify({
      full_name: `Updated Test User ${Date.now()}`,
    }),
    {
      headers: getAuthHeaders(),
      tags: { name: 'update' },
    }
  );

  const success = check(res, {
    'update status is 204 or 404': (r) => r.status === 204 || r.status === 404,
    'update response time < 150ms': (r) => r.timings.duration < 150,
  });

  return {
    success,
    status: res.status,
    duration: res.timings.duration,
  };
}

// Test: DELETE query
export function testDelete() {
  const timestamp = Date.now();
  const userId = `test${timestamp}`;
  
  const res = http.del(
    `${API_BASE_URL}/profiles?user_id=eq.${userId}`,
    {
      headers: getAuthHeaders(),
      tags: { name: 'delete' },
    }
  );

  const success = check(res, {
    'delete status is 204 or 404': (r) => r.status === 204 || r.status === 404,
    'delete response time < 150ms': (r) => r.timings.duration < 150,
  });

  return {
    success,
    status: res.status,
    duration: res.timings.duration,
  };
}

// Test: Batch SELECT (multiple queries)
export function testBatchSelect() {
  const endpoints = [
    '/profiles?limit=10',
    '/user_app_access?limit=10',
    '/pilot_licensure_experience?limit=10',
  ];
  
  const results = [];
  const startTime = Date.now();
  
  for (const endpoint of endpoints) {
    const res = http.get(`${API_BASE_URL}${endpoint}`, {
      headers: getAuthHeaders(),
      tags: { name: 'batch-select' },
    });
    results.push({
      endpoint,
      status: res.status,
      duration: res.timings.duration,
    });
  }
  
  const totalDuration = Date.now() - startTime;
  const avgDuration = totalDuration / endpoints.length;
  const allSuccess = results.every(r => r.status === 200);

  check({
    'batch-select all successful': allSuccess,
    'batch-select avg response time < 200ms': avgDuration < 200,
    'batch-select total time < 500ms': totalDuration < 500,
  });

  return {
    success: allSuccess,
    avgDuration,
    totalDuration,
    results,
  };
}

// Test: Pagination query
export function testPagination() {
  const page = Math.floor(Math.random() * 10) + 1;
  const limit = 20;
  
  const res = http.get(
    `${API_BASE_URL}/profiles?page=${page}&limit=${limit}`,
    {
      headers: getAuthHeaders(),
      tags: { name: 'pagination' },
    }
  );

  const success = check(res, {
    'pagination status is 200': (r) => r.status === 200,
    'pagination response time < 150ms': (r) => r.timings.duration < 150,
  });

  return {
    success,
    status: res.status,
    duration: res.timings.duration,
  };
}

// Test: Aggregation query
export function testAggregation() {
  const res = http.get(
    `${API_BASE_URL}/profiles?select=count(*)`,
    {
      headers: getAuthHeaders(),
      tags: { name: 'aggregation' },
    }
  );

  const success = check(res, {
    'aggregation status is 200': (r) => r.status === 200,
    'aggregation response time < 300ms': (r) => r.timings.duration < 300,
  });

  return {
    success,
    status: res.status,
    duration: res.timings.duration,
  };
}

// Test: Full-text search
export function testFullTextSearch() {
  const searchTerm = 'pilot';
  
  const res = http.get(
    `${API_BASE_URL}/profiles?full_name=ilike.*${searchTerm}*`,
    {
      headers: getAuthHeaders(),
      tags: { name: 'fulltext-search' },
    }
  );

  const success = check(res, {
    'fulltext-search status is 200': (r) => r.status === 200,
    'fulltext-search response time < 250ms': (r) => r.timings.duration < 250,
  });

  return {
    success,
    status: res.status,
    duration: res.timings.duration,
  };
}

// Test: Transaction simulation (multiple operations)
export function testTransaction() {
  const timestamp = Date.now();
  const userId = `test${timestamp}`;
  
  // INSERT
  const insertRes = http.post(
    `${API_BASE_URL}/profiles`,
    JSON.stringify({
      user_id: userId,
      full_name: `Test User ${timestamp}`,
      email: `test${timestamp}@example.com`,
    }),
    {
      headers: getAuthHeaders(),
      tags: { name: 'transaction-insert' },
    }
  );

  // SELECT
  const selectRes = http.get(
    `${API_BASE_URL}/profiles?user_id=eq.${userId}`,
    {
      headers: getAuthHeaders(),
      tags: { name: 'transaction-select' },
    }
  );

  // UPDATE
  const updateRes = http.patch(
    `${API_BASE_URL}/profiles?user_id=eq.${userId}`,
    JSON.stringify({
      full_name: `Updated Test User ${timestamp}`,
    }),
    {
      headers: getAuthHeaders(),
      tags: { name: 'transaction-update' },
    }
  );

  // DELETE
  const deleteRes = http.del(
    `${API_BASE_URL}/profiles?user_id=eq.${userId}`,
    {
      headers: getAuthHeaders(),
      tags: { name: 'transaction-delete' },
    }
  );

  const allSuccess = [insertRes, selectRes, updateRes, deleteRes].every(
    r => r.status === 201 || r.status === 200 || r.status === 204 || r.status === 404
  );
  const totalDuration = insertRes.timings.duration + selectRes.timings.duration + 
                        updateRes.timings.duration + deleteRes.timings.duration;

  check({
    'transaction all operations successful': allSuccess,
    'transaction total time < 500ms': totalDuration < 500,
  });

  return {
    success: allSuccess,
    totalDuration,
    operations: {
      insert: insertRes.timings.duration,
      select: selectRes.timings.duration,
      update: updateRes.timings.duration,
      delete: deleteRes.timings.duration,
    },
  };
}

// Main test scenario
export default function () {
  const scenario = Math.random();

  // Scenario 1: Simple SELECT (30% of requests)
  if (scenario < 0.30) {
    testSimpleSelect();
  }
  
  // Scenario 2: SELECT with filter (20% of requests)
  else if (scenario < 0.50) {
    testSelectWithFilter();
  }
  
  // Scenario 3: Pagination (15% of requests)
  else if (scenario < 0.65) {
    testPagination();
  }
  
  // Scenario 4: INSERT (10% of requests)
  else if (scenario < 0.75) {
    testInsert();
  }
  
  // Scenario 5: UPDATE (8% of requests)
  else if (scenario < 0.83) {
    testUpdate();
  }
  
  // Scenario 6: DELETE (5% of requests)
  else if (scenario < 0.88) {
    testDelete();
  }
  
  // Scenario 7: SELECT with JOIN (5% of requests)
  else if (scenario < 0.93) {
    testSelectWithJoin();
  }
  
  // Scenario 8: Batch SELECT (4% of requests)
  else if (scenario < 0.97) {
    testBatchSelect();
  }
  
  // Scenario 9: Aggregation (2% of requests)
  else if (scenario < 0.99) {
    testAggregation();
  }
  
  // Scenario 10: Transaction (1% of requests)
  else {
    testTransaction();
  }

  // Sleep between requests to simulate realistic database usage
  sleep(Math.random() * 1.5 + 0.5); // 0.5-2 seconds between requests
}

// Setup function
export function setup() {
  console.log('Starting database load test...');
  console.log(`Target: 250 concurrent users`);
  console.log(`Duration: 30 minutes`);
  console.log(`API Base URL: ${API_BASE_URL}`);
}

// Teardown function
export function teardown(data) {
  console.log('Database load test completed.');
  console.log('Check results for detailed metrics.');
}
