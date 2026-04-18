/**
 * Test Runner for Authentication Test Suite (Node.js Version)
 * 
 * Usage:
 * 1. Set environment variables or update config below
 * 2. Run: npm run test:auth (or node tests/run-auth-tests.js after build)
 * 
 * Environment Variables:
 * - VITE_SUPABASE_URL: Your Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Your Supabase anon key
 * - TEST_EMAIL: Test user email
 * - TEST_PASSWORD: Test user password
 */

import { AuthTestSuite } from './auth-test-suite';

// Configuration
const config = {
  supabaseUrl: process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
  supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key',
  edgeFunctionUrl: (process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co').replace('/auth', '/functions/v1'),
  testEmail: process.env.TEST_EMAIL || 'test@example.com',
  testPassword: process.env.TEST_PASSWORD || 'TestPassword123',
};

async function main() {
  console.log('🚀 Authentication Test Suite Runner');
  console.log('='.repeat(60));
  console.log('Configuration:');
  console.log(`  Supabase URL: ${config.supabaseUrl}`);
  console.log(`  Edge Function URL: ${config.edgeFunctionUrl}`);
  console.log(`  Test Email: ${config.testEmail}`);
  console.log('='.repeat(60));

  const testSuite = new AuthTestSuite(config);

  try {
    await testSuite.runAllTests();
    console.log('\n✅ All tests completed');
  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  }
}

main();
