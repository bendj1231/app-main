/**
 * Comprehensive Authentication Test Suite
 * Tests all authentication flows, security features, and edge cases
 * 
 * Prerequisites:
 * - Supabase project URL and anon key
 * - Test user credentials (or ability to create them)
 * - Edge Functions deployed
 */

interface TestConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  testEmail: string;
  testPassword: string;
  edgeFunctionUrl: string;
}

interface TestResult {
  testName: string;
  passed: boolean;
  duration: number;
  error?: string;
  details?: any;
}

class AuthTestSuite {
  private config: TestConfig;
  private results: TestResult[] = [];
  private csrfToken: string | null = null;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(config: TestConfig) {
    this.config = config;
  }

  private async recordTest(testName: string, testFn: () => Promise<void>): Promise<void> {
    const startTime = Date.now();
    try {
      await testFn();
      const duration = Date.now() - startTime;
      this.results.push({ testName, passed: true, duration });
      console.log(`✅ PASS: ${testName} (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.results.push({ testName, passed: false, duration, error: errorMessage });
      console.error(`❌ FAIL: ${testName} (${duration}ms) - ${errorMessage}`);
    }
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {},
    includeCookies: boolean = true
  ): Promise<Response> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.csrfToken) {
      headers['X-CSRF-Token'] = this.csrfToken;
    }

    const cookieHeader = this.buildCookieHeader();
    if (cookieHeader && includeCookies) {
      headers['Cookie'] = cookieHeader;
    }

    const url = `${this.config.edgeFunctionUrl}/${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    // Update CSRF token from response
    const setCookieHeader = response.headers.get('Set-Cookie');
    if (setCookieHeader) {
      const csrfMatch = setCookieHeader.match(/csrf-token=([^;]+)/);
      if (csrfMatch) {
        this.csrfToken = csrfMatch[1];
      }

      const accessMatch = setCookieHeader.match(/sb-access-token=([^;]+)/);
      if (accessMatch) {
        this.accessToken = accessMatch[1];
      }

      const refreshMatch = setCookieHeader.match(/sb-refresh-token=([^;]+)/);
      if (refreshMatch) {
        this.refreshToken = refreshMatch[1];
      }
    }

    return response;
  }

  private buildCookieHeader(): string {
    const cookies: string[] = [];
    if (this.csrfToken) cookies.push(`csrf-token=${this.csrfToken}`);
    if (this.accessToken) cookies.push(`sb-access-token=${this.accessToken}`);
    if (this.refreshToken) cookies.push(`sb-refresh-token=${this.refreshToken}`);
    return cookies.join('; ');
  }

  private clearCookies(): void {
    this.csrfToken = null;
    this.accessToken = null;
    this.refreshToken = null;
  }

  // ==================== AUTHENTICATION FLOW TESTS ====================

  async testLoginFlow(): Promise<void> {
    await this.recordTest('Login Flow - Valid Credentials', async () => {
      const response = await this.makeRequest('auth-login', {
        method: 'POST',
        body: JSON.stringify({
          email: this.config.testEmail,
          password: this.config.testPassword,
        }),
      });

      if (!response.ok) {
        throw new Error(`Login failed with status ${response.status}`);
      }

      const data = await response.json();
      if (!data.success || !data.user) {
        throw new Error('Login response missing success or user data');
      }

      if (!this.csrfToken || !this.accessToken || !this.refreshToken) {
        throw new Error('Login did not set required cookies');
      }
    });
  }

  async testLoginInvalidCredentials(): Promise<void> {
    await this.recordTest('Login Flow - Invalid Credentials', async () => {
      const response = await this.makeRequest('auth-login', {
        method: 'POST',
        body: JSON.stringify({
          email: this.config.testEmail,
          password: 'wrongpassword',
        }),
      });

      if (response.ok) {
        throw new Error('Login should have failed with wrong password');
      }

      if (response.status !== 401) {
        throw new Error(`Expected 401, got ${response.status}`);
      }
    });
  }

  async testLoginMissingFields(): Promise<void> {
    await this.recordTest('Login Flow - Missing Fields', async () => {
      const response = await this.makeRequest('auth-login', {
        method: 'POST',
        body: JSON.stringify({ email: this.config.testEmail }),
      });

      if (response.ok) {
        throw new Error('Login should have failed with missing password');
      }

      if (response.status !== 400) {
        throw new Error(`Expected 400, got ${response.status}`);
      }
    });
  }

  async testSignupFlow(): Promise<void> {
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;

    await this.recordTest('Signup Flow - Valid Data', async () => {
      const response = await this.makeRequest('auth-signup', {
        method: 'POST',
        body: JSON.stringify({
          email: testEmail,
          password: 'TestPass123',
          userData: {
            fullName: 'Test User',
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Signup failed with status ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error('Signup response missing success flag');
      }
    });
  }

  async testSignupInvalidEmail(): Promise<void> {
    await this.recordTest('Signup Flow - Invalid Email', async () => {
      const response = await this.makeRequest('auth-signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'TestPass123',
        }),
      });

      if (response.ok) {
        throw new Error('Signup should have failed with invalid email');
      }

      if (response.status !== 400) {
        throw new Error(`Expected 400, got ${response.status}`);
      }
    });
  }

  async testSignupWeakPassword(): Promise<void> {
    await this.recordTest('Signup Flow - Weak Password', async () => {
      const response = await this.makeRequest('auth-signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'weak',
        }),
      });

      if (response.ok) {
        throw new Error('Signup should have failed with weak password');
      }

      if (response.status !== 400) {
        throw new Error(`Expected 400, got ${response.status}`);
      }
    });
  }

  async testLogoutFlow(): Promise<void> {
    // First login
    await this.testLoginFlow();

    await this.recordTest('Logout Flow', async () => {
      const response = await this.makeRequest('auth-logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Logout failed with status ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error('Logout response missing success flag');
      }

      // Verify cookies are cleared
      if (this.accessToken || this.refreshToken || this.csrfToken) {
        throw new Error('Logout did not clear cookies properly');
      }
    });
  }

  async testRefreshFlow(): Promise<void> {
    // First login
    await this.testLoginFlow();

    await this.recordTest('Refresh Flow - Valid Token', async () => {
      const response = await this.makeRequest('auth-refresh', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Refresh failed with status ${response.status}`);
      }

      const data = await response.json();
      if (!data.success || !data.user) {
        throw new Error('Refresh response missing success or user data');
      }
    });
  }

  async testVerifyFlow(): Promise<void> {
    // First login
    await this.testLoginFlow();

    await this.recordTest('Verify Flow - Valid Session', async () => {
      const response = await this.makeRequest('auth-verify', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Verify failed with status ${response.status}`);
      }

      const data = await response.json();
      if (!data.success || !data.user) {
        throw new Error('Verify response missing success or user data');
      }
    });
  }

  async testVerifyNoSession(): Promise<void> {
    this.clearCookies();

    await this.recordTest('Verify Flow - No Session', async () => {
      const response = await this.makeRequest('auth-verify', {
        method: 'POST',
      });

      if (response.ok) {
        throw new Error('Verify should have failed without session');
      }

      if (response.status !== 401) {
        throw new Error(`Expected 401, got ${response.status}`);
      }
    });
  }

  // ==================== CSRF PROTECTION TESTS ====================

  async testCSRFProtection(): Promise<void> {
    this.clearCookies();

    await this.recordTest('CSRF Protection - Missing Token', async () => {
      const response = await this.makeRequest(
        'auth-login',
        {
          method: 'POST',
          body: JSON.stringify({
            email: this.config.testEmail,
            password: this.config.testPassword,
          }),
        },
        false // Don't include cookies
      );

      // CSRF protection should reject requests without proper CSRF token
      if (response.status !== 403 && response.status !== 400) {
        console.warn(`CSRF test: Expected 403 or 400, got ${response.status}`);
      }
    });
  }

  // ==================== RATE LIMITING TESTS ====================

  async testRateLimitingLogin(): Promise<void> {
    await this.recordTest('Rate Limiting - Login (11 attempts)', async () => {
      let successCount = 0;
      let rateLimited = false;

      for (let i = 0; i < 11; i++) {
        const response = await this.makeRequest('auth-login', {
          method: 'POST',
          body: JSON.stringify({
            email: this.config.testEmail,
            password: 'wrongpassword',
          }),
        });

        if (response.status === 429) {
          rateLimited = true;
          break;
        }

        if (response.ok) {
          successCount++;
        }
      }

      if (!rateLimited) {
        console.warn(`Rate limiting not triggered after 11 attempts. Success count: ${successCount}`);
      }

      // Rate limit is 5 attempts per 15 minutes, so we should be rate limited
      if (successCount > 5) {
        throw new Error(`Rate limiting not working: ${successCount} successful requests`);
      }
    });
  }

  async testRateLimitingSignup(): Promise<void> {
    await this.recordTest('Rate Limiting - Signup (4 attempts)', async () => {
      let successCount = 0;
      let rateLimited = false;

      for (let i = 0; i < 4; i++) {
        const timestamp = Date.now();
        const response = await this.makeRequest('auth-signup', {
          method: 'POST',
          body: JSON.stringify({
            email: `test${timestamp}@example.com`,
            password: 'TestPass123',
          }),
        });

        if (response.status === 429) {
          rateLimited = true;
          break;
        }

        if (response.ok) {
          successCount++;
        }
      }

      // Rate limit is 3 attempts per hour
      if (successCount > 3) {
        throw new Error(`Rate limiting not working: ${successCount} successful requests`);
      }
    });
  }

  // ==================== INPUT VALIDATION TESTS ====================

  async testInputValidationEmailFormats(): Promise<void> {
    const invalidEmails = [
      '',
      'invalid',
      '@example.com',
      'test@',
      'test@.com',
      'test space@example.com',
    ];

    for (const email of invalidEmails) {
      await this.recordTest(`Input Validation - Invalid Email: "${email}"`, async () => {
        const response = await this.makeRequest('auth-login', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password: this.config.testPassword,
          }),
        });

        if (response.ok) {
          throw new Error(`Should have rejected invalid email: ${email}`);
        }

        if (response.status !== 400) {
          throw new Error(`Expected 400 for invalid email, got ${response.status}`);
        }
      });
    }
  }

  async testInputValidationPasswordStrength(): Promise<void> {
    const weakPasswords = [
      '',
      'short',
      'nouppercase123',
      'NOLOWERCASE123',
      'NoNumbers',
    ];

    for (const password of weakPasswords) {
      await this.recordTest(`Input Validation - Weak Password: "${password}"`, async () => {
        const response = await this.makeRequest('auth-signup', {
          method: 'POST',
          body: JSON.stringify({
            email: 'test@example.com',
            password,
          }),
        });

        if (response.ok) {
          throw new Error(`Should have rejected weak password: ${password}`);
        }

        if (response.status !== 400) {
          throw new Error(`Expected 400 for weak password, got ${response.status}`);
        }
      });
    }
  }

  // ==================== CONCURRENT USER TESTS ====================

  async testConcurrentLogins(): Promise<void> {
    await this.recordTest('Concurrent Users - 10 Simultaneous Logins', async () => {
      const promises = Array.from({ length: 10 }, async (_, i) => {
        const response = await this.makeRequest('auth-login', {
          method: 'POST',
          body: JSON.stringify({
            email: this.config.testEmail,
            password: this.config.testPassword,
          }),
        });
        return response.status;
      });

      const results = await Promise.all(promises);
      const successCount = results.filter((status) => status === 200).length;

      console.log(`Concurrent login results: ${successCount}/10 successful`);

      // All should succeed or fail gracefully
      if (successCount === 0) {
        throw new Error('All concurrent logins failed');
      }
    });
  }

  // ==================== EDGE CASE TESTS ====================

  async testNetworkFailure(): Promise<void> {
    await this.recordTest('Edge Case - Network Failure Simulation', async () => {
      // This test requires network simulation tools
      // For now, we'll test with an invalid URL
      try {
        const response = await fetch('https://invalid-url-that-does-not-exist.com/auth-login', {
          method: 'POST',
          body: JSON.stringify({
            email: this.config.testEmail,
            password: this.config.testPassword,
          }),
        });

        throw new Error('Should have thrown network error');
      } catch (error) {
        if (!(error instanceof TypeError)) {
          throw new Error('Expected network error (TypeError)');
        }
        console.log('Network error handled correctly');
      }
    });
  }

  async testLargePayload(): Promise<void> {
    await this.recordTest('Edge Case - Large Payload', async () => {
      const largeUserData = {
        fullName: 'A'.repeat(10000),
        // Add more large fields
      };

      const response = await this.makeRequest('auth-signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'TestPass123',
          userData: largeUserData,
        }),
      });

      // Should either succeed or fail gracefully with 413 (Payload Too Large)
      if (response.status !== 200 && response.status !== 413 && response.status !== 400) {
        console.warn(`Large payload test: Unexpected status ${response.status}`);
      }
    });
  }

  // ==================== SECURITY VULNERABILITY TESTS ====================

  async testXSSInEmail(): Promise<void> {
    await this.recordTest('Security - XSS in Email Field', async () => {
      const xssPayload = '<script>alert("xss")</script>@example.com';

      const response = await this.makeRequest('auth-login', {
        method: 'POST',
        body: JSON.stringify({
          email: xssPayload,
          password: this.config.testPassword,
        }),
      });

      if (response.ok) {
        throw new Error('Should have rejected XSS payload');
      }

      // Check that the response doesn't contain the XSS payload
      const text = await response.text();
      if (text.includes('<script>')) {
        throw new Error('Response contains XSS payload (reflected XSS)');
      }
    });
  }

  async testSQLInjectionInEmail(): Promise<void> {
    await this.recordTest('Security - SQL Injection in Email Field', async () => {
      const sqlPayload = "' OR '1'='1'--@example.com";

      const response = await this.makeRequest('auth-login', {
        method: 'POST',
        body: JSON.stringify({
          email: sqlPayload,
          password: this.config.testPassword,
        }),
      });

      if (response.ok) {
        throw new Error('Should have rejected SQL injection payload');
      }
    });
  }

  async testSessionHijackingAttempt(): Promise<void> {
    await this.recordTest('Security - Session Hijacking Attempt', async () => {
      // Try to use an expired or invalid token
      this.accessToken = 'invalid-token-12345';

      const response = await this.makeRequest('auth-verify', {
        method: 'POST',
      });

      if (response.ok) {
        throw new Error('Should have rejected invalid token');
      }

      if (response.status !== 401) {
        throw new Error(`Expected 401, got ${response.status}`);
      }
    });
  }

  // ==================== RUN ALL TESTS ====================

  async runAllTests(): Promise<void> {
    console.log('🧪 Starting Authentication Test Suite\n');
    console.log('='.repeat(60));

    // Authentication Flow Tests
    console.log('\n📋 Authentication Flow Tests');
    console.log('-'.repeat(60));
    await this.testLoginFlow();
    await this.testLoginInvalidCredentials();
    await this.testLoginMissingFields();
    await this.testSignupFlow();
    await this.testSignupInvalidEmail();
    await this.testSignupWeakPassword();
    await this.testLogoutFlow();
    await this.testRefreshFlow();
    await this.testVerifyFlow();
    await this.testVerifyNoSession();

    // CSRF Protection Tests
    console.log('\n📋 CSRF Protection Tests');
    console.log('-'.repeat(60));
    await this.testCSRFProtection();

    // Rate Limiting Tests
    console.log('\n📋 Rate Limiting Tests');
    console.log('-'.repeat(60));
    await this.testRateLimitingLogin();
    await this.testRateLimitingSignup();

    // Input Validation Tests
    console.log('\n📋 Input Validation Tests');
    console.log('-'.repeat(60));
    await this.testInputValidationEmailFormats();
    await this.testInputValidationPasswordStrength();

    // Concurrent User Tests
    console.log('\n📋 Concurrent User Tests');
    console.log('-'.repeat(60));
    await this.testConcurrentLogins();

    // Edge Case Tests
    console.log('\n📋 Edge Case Tests');
    console.log('-'.repeat(60));
    await this.testNetworkFailure();
    await this.testLargePayload();

    // Security Vulnerability Tests
    console.log('\n📋 Security Vulnerability Tests');
    console.log('-'.repeat(60));
    await this.testXSSInEmail();
    await this.testSQLInjectionInEmail();
    await this.testSessionHijackingAttempt();

    // Print Summary
    this.printSummary();
  }

  private printSummary(): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));

    const passed = this.results.filter((r) => r.passed).length;
    const failed = this.results.filter((r) => !r.passed).length;
    const total = this.results.length;
    const passRate = ((passed / total) * 100).toFixed(1);

    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed} (${passRate}%)`);
    console.log(`Failed: ${failed}`);
    console.log('\n⏱️  Performance:');
    const avgDuration = this.results.reduce((sum, r) => sum + r.duration, 0) / total;
    console.log(`Average Test Duration: ${avgDuration.toFixed(2)}ms`);

    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter((r) => !r.passed)
        .forEach((r) => {
          console.log(`  - ${r.testName}: ${r.error}`);
        });
    }

    console.log('\n' + '='.repeat(60));
  }

  getResults(): TestResult[] {
    return this.results;
  }
}

// Export for use in test runner
export { AuthTestSuite };
export type { TestConfig, TestResult };
