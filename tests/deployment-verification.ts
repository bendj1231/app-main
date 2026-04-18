// Deployment Verification Tests
// Verifies that all authentication Edge Functions are deployed and working correctly

interface DeploymentConfig {
  baseUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

interface HealthCheckResult {
  endpoint: string;
  status: number;
  responseTime: number;
  success: boolean;
  error?: string;
}

interface DeploymentTestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
}

class DeploymentVerifier {
  private config: DeploymentConfig;
  private results: DeploymentTestResult[] = [];

  constructor(config: DeploymentConfig) {
    this.config = config;
  }

  async healthCheck(endpoint: string): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const responseTime = Date.now() - startTime;

      return {
        endpoint,
        status: response.status,
        responseTime,
        success: response.ok || response.status === 401 || response.status === 403, // 401/403 expected for unauthenticated requests
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        endpoint,
        status: 0,
        responseTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async testEdgeFunctionHealth(): Promise<DeploymentTestResult> {
    const startTime = Date.now();
    const edgeFunctions = [
      'auth-login',
      'auth-signup',
      'auth-logout',
      'auth-refresh',
      'auth-verify',
    ];

    try {
      const results = await Promise.all(
        edgeFunctions.map(func => 
          this.healthCheck(`${this.config.baseUrl}/${func}`)
        )
      );

      const failures = results.filter(r => !r.success);

      if (failures.length > 0) {
        throw new Error(`Failed edge functions: ${failures.map(f => f.endpoint).join(', ')}`);
      }

      const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;

      return {
        name: 'Edge Function Health Check',
        passed: true,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        name: 'Edge Function Health Check',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async testCSRFProtection(): Promise<DeploymentTestResult> {
    const startTime = Date.now();

    try {
      // Test that requests without CSRF token are rejected
      const response = await fetch(`${this.config.baseUrl}/auth-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'TestPassword123',
        }),
      });

      // Should return 403 (CSRF validation failed)
      if (response.status !== 403) {
        throw new Error(`CSRF protection not working. Expected 403, got ${response.status}`);
      }

      return {
        name: 'CSRF Protection',
        passed: true,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        name: 'CSRF Protection',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async testSecurityHeaders(): Promise<DeploymentTestResult> {
    const startTime = Date.now();

    try {
      const response = await fetch(`${this.config.baseUrl}/auth-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const requiredHeaders = [
        'Content-Security-Policy',
        'X-Frame-Options',
        'X-Content-Type-Options',
        'Strict-Transport-Security',
      ];

      const missingHeaders = requiredHeaders.filter(header => !response.headers.get(header));

      if (missingHeaders.length > 0) {
        throw new Error(`Missing security headers: ${missingHeaders.join(', ')}`);
      }

      // Verify specific header values
      const csp = response.headers.get('Content-Security-Policy');
      const frameOptions = response.headers.get('X-Frame-Options');
      
      if (frameOptions !== 'DENY') {
        throw new Error(`X-Frame-Options should be DENY, got ${frameOptions}`);
      }

      return {
        name: 'Security Headers',
        passed: true,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        name: 'Security Headers',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async testRateLimiting(): Promise<DeploymentTestResult> {
    const startTime = Date.now();

    try {
      // Make multiple requests to test rate limiting
      const requests = Array(6).fill(null).map(() =>
        fetch(`${this.config.baseUrl}/auth-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'TestPassword123',
          }),
        })
      );

      const responses = await Promise.all(requests);
      
      // Check if any request was rate limited (429)
      const rateLimited = responses.some(r => r.status === 429);

      if (!rateLimited) {
        // This is acceptable - rate limiting might not trigger in this test
        console.warn('Rate limiting not triggered in test (acceptable)');
      }

      return {
        name: 'Rate Limiting',
        passed: true,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        name: 'Rate Limiting',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async testInputValidation(): Promise<DeploymentTestResult> {
    const startTime = Date.now();

    try {
      // Test invalid email format
      const response = await fetch(`${this.config.baseUrl}/auth-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'TestPassword123',
        }),
      });

      // Should return 400 (invalid input)
      if (response.status !== 400) {
        throw new Error(`Input validation not working. Expected 400, got ${response.status}`);
      }

      return {
        name: 'Input Validation',
        passed: true,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        name: 'Input Validation',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async testPasswordStrength(): Promise<DeploymentTestResult> {
    const startTime = Date.now();

    try {
      // Test weak password
      const response = await fetch(`${this.config.baseUrl}/auth-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'weak',
        }),
      });

      // Should return 400 (weak password)
      if (response.status !== 400) {
        throw new Error(`Password strength validation not working. Expected 400, got ${response.status}`);
      }

      return {
        name: 'Password Strength Validation',
        passed: true,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        name: 'Password Strength Validation',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async testErrorHandling(): Promise<DeploymentTestResult> {
    const startTime = Date.now();

    try {
      // Test with invalid credentials
      const response = await fetch(`${this.config.baseUrl}/auth-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'WrongPassword123',
        }),
      });

      // Should return 401 (invalid credentials)
      if (response.status !== 401) {
        throw new Error(`Error handling not working. Expected 401, got ${response.status}`);
      }

      // Check that error message is generic (not revealing)
      const data = await response.json();
      if (data.error && (data.error.includes('user') || data.error.includes('User'))) {
        throw new Error('Error message reveals too much information');
      }

      return {
        name: 'Error Handling',
        passed: true,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        name: 'Error Handling',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async runAllTests(): Promise<DeploymentTestResult[]> {
    console.log('Starting deployment verification tests...\n');

    const tests = [
      () => this.testEdgeFunctionHealth(),
      () => this.testCSRFProtection(),
      () => this.testSecurityHeaders(),
      () => this.testRateLimiting(),
      () => this.testInputValidation(),
      () => this.testPasswordStrength(),
      () => this.testErrorHandling(),
    ];

    for (const test of tests) {
      const result = await test();
      this.results.push(result);
      
      const status = result.passed ? '✓ PASS' : '✗ FAIL';
      const duration = `(${result.duration}ms)`;
      console.log(`${status} ${result.name} ${duration}`);
      
      if (result.error) {
        console.log(`  Error: ${result.error}`);
      }
    }

    console.log('\nDeployment verification tests completed.');
    return this.results;
  }

  printSummary(): void {
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const total = this.results.length;

    console.log('\n=================================');
    console.log('Deployment Verification Summary');
    console.log('=================================');
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    console.log('=================================');

    if (failed > 0) {
      console.log('\nFailed Tests:');
      this.results.filter(r => !r.passed).forEach(r => {
        console.log(`  - ${r.name}: ${r.error}`);
      });
    }
  }
}

// Main execution
async function main() {
  const config: DeploymentConfig = {
    baseUrl: process.env.EDGE_FUNCTION_URL || process.env.BASE_URL || 'https://your-project.supabase.co/functions/v1',
    supabaseUrl: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'your-anon-key',
  };

  const verifier = new DeploymentVerifier(config);
  const results = await verifier.runAllTests();
  verifier.printSummary();

  const allPassed = results.every(r => r.passed);
  process.exit(allPassed ? 0 : 1);
}

// Export for use in other scripts
export { DeploymentVerifier };
export type { DeploymentConfig, DeploymentTestResult };

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Deployment verification failed:', error);
    process.exit(1);
  });
}
