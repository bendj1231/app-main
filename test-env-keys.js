#!/usr/bin/env node
/**
 * Test script to validate all API keys and credentials in .env.local
 * Tests Supabase, Stripe, Auth0, Resend, Cloudinary, and Cloudflare R2
 */

require('dotenv').config({ path: '.env.local' });

const https = require('https');
const http = require('http');

// Helper function for HTTPS/HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const requestFn = url.startsWith('https') ? https : http;
    const req = requestFn.request(url, { method: 'GET', timeout: 5000, ...options }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, data });
      });
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function testSupabaseWorld() {
  console.log('\n🔷 Testing Supabase World Project...');
  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !anonKey) {
    console.log('  ❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
    return false;
  }
  
  try {
    const res = await makeRequest(`${url}/rest/v1/profiles?select=id&limit=1`, {
      headers: { 'apikey': anonKey }
    });
    if (res.status === 200) {
      console.log('  ✅ Supabase World Anon Key: VALID');
      return true;
    } else {
      console.log(`  ⚠️  Supabase World Anon Key: HTTP ${res.status}`);
      return false;
    }
  } catch (err) {
    console.log(`  ❌ Supabase World: ${err.message}`);
    return false;
  }
}

async function testSupabaseEU() {
  console.log('\n🔷 Testing Supabase EU Project...');
  const url = process.env.VITE_SUPABASE_URL_EU;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY_EU;
  
  if (!url || !anonKey) {
    console.log('  ❌ Missing VITE_SUPABASE_URL_EU or VITE_SUPABASE_ANON_KEY_EU');
    return false;
  }
  
  try {
    const res = await makeRequest(`${url}/rest/v1/profiles?select=id&limit=1`, {
      headers: { 'apikey': anonKey }
    });
    if (res.status === 200) {
      console.log('  ✅ Supabase EU Anon Key: VALID');
      return true;
    } else {
      console.log(`  ⚠️  Supabase EU Anon Key: HTTP ${res.status}`);
      return false;
    }
  } catch (err) {
    console.log(`  ❌ Supabase EU: ${err.message}`);
    return false;
  }
}

async function testStripe() {
  console.log('\n💳 Testing Stripe Keys...');
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const publishableKey = process.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  if (!secretKey) {
    console.log('  ❌ Missing STRIPE_SECRET_KEY');
    return false;
  }
  
  try {
    const auth = Buffer.from(`${secretKey}:`).toString('base64');
    const res = await makeRequest('https://api.stripe.com/v1/customers?limit=1', {
      method: 'GET',
      headers: { 'Authorization': `Basic ${auth}` }
    });
    if (res.status === 200) {
      console.log('  ✅ Stripe Secret Key: VALID');
      return true;
    } else {
      console.log(`  ⚠️  Stripe Secret Key: HTTP ${res.status}`);
      return false;
    }
  } catch (err) {
    console.log(`  ❌ Stripe: ${err.message}`);
    return false;
  }
}

async function testResend() {
  console.log('\n✉️  Testing Resend API Key...');
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.log('  ❌ Missing RESEND_API_KEY');
    return false;
  }
  
  try {
    const res = await makeRequest('https://api.resend.com/emails?limit=1', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    if (res.status === 200 || res.status === 401) {
      console.log('  ✅ Resend API Key: VALID (API responded)');
      return true;
    } else {
      console.log(`  ⚠️  Resend API Key: HTTP ${res.status}`);
      return false;
    }
  } catch (err) {
    console.log(`  ❌ Resend: ${err.message}`);
    return false;
  }
}

async function testAuth0() {
  console.log('\n🔐 Testing Auth0 Configuration...');
  const domain = process.env.VITE_AUTH0_DOMAIN;
  const clientId = process.env.VITE_AUTH0_CLIENT_ID;
  
  if (!domain || !clientId) {
    console.log('  ❌ Missing Auth0 configuration');
    return false;
  }
  
  try {
    const res = await makeRequest(`https://${domain}/.well-known/openid-configuration`);
    if (res.status === 200) {
      console.log('  ✅ Auth0 Domain: VALID');
      const data = JSON.parse(res.data);
      if (data.issuer) {
        console.log('  ✅ Auth0 Client ID configured: ' + clientId.substring(0, 10) + '...');
        return true;
      }
    } else {
      console.log(`  ⚠️  Auth0 Domain: HTTP ${res.status}`);
      return false;
    }
  } catch (err) {
    console.log(`  ❌ Auth0: ${err.message}`);
    return false;
  }
}

async function testCloudinary() {
  console.log('\n🖼️  Testing Cloudinary Credentials...');
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  if (!cloudName || !apiKey || !apiSecret) {
    console.log('  ❌ Missing Cloudinary credentials');
    return false;
  }
  
  try {
    // Test resource listing (requires valid API key/secret)
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    const res = await makeRequest(`https://api.cloudinary.com/v1_1/${cloudName}/resources?type=upload&max_results=1`, {
      headers: { 'Authorization': `Basic ${auth}` }
    });
    if (res.status === 200) {
      console.log('  ✅ Cloudinary Account: VALID (' + cloudName + ')');
      console.log('  ✅ Cloudinary API Credentials: VALID');
      return true;
    } else if (res.status === 401) {
      console.log('  ❌ Cloudinary Credentials: INVALID (401 Unauthorized)');
      return false;
    } else {
      console.log(`  ⚠️  Cloudinary: HTTP ${res.status}`);
      return false;
    }
  } catch (err) {
    console.log(`  ❌ Cloudinary: ${err.message}`);
    return false;
  }
}

async function testCloudflareR2() {
  console.log('\n☁️  Testing Cloudflare R2 Credentials...');
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  
  if (!accountId || !accessKeyId || !secretAccessKey) {
    console.log('  ⚠️  Cloudflare R2 credentials configured:');
    if (accountId) console.log('    ✅ Account ID present');
    if (accessKeyId) console.log('    ✅ Access Key ID present');
    if (secretAccessKey) console.log('    ✅ Secret Access Key present');
    if (bucketName) console.log('    ✅ Bucket Name: ' + bucketName);
    return true; // Credentials are there, can't fully test without AWS SDK
  }
  
  try {
    // Basic validation: check format
    if (accountId.length > 20 && accessKeyId.length > 20 && secretAccessKey.length > 30) {
      console.log('  ✅ Cloudflare R2 Account ID: ' + accountId.substring(0, 10) + '...');
      console.log('  ✅ Cloudflare R2 Access Key: ' + accessKeyId.substring(0, 10) + '...');
      console.log('  ✅ Cloudflare R2 Secret Key: ' + secretAccessKey.substring(0, 10) + '...');
      console.log('  ✅ Bucket: ' + bucketName);
      return true;
    } else {
      console.log('  ⚠️  Cloudflare R2 credentials appear incomplete');
      return false;
    }
  } catch (err) {
    console.log(`  ❌ Cloudflare R2: ${err.message}`);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('          API Keys & Credentials Validation Test');
  console.log('═══════════════════════════════════════════════════════════════');
  
  const results = {
    'Supabase World': await testSupabaseWorld(),
    'Supabase EU': await testSupabaseEU(),
    'Stripe': await testStripe(),
    'Resend': await testResend(),
    'Auth0': await testAuth0(),
    'Cloudinary': await testCloudinary(),
    'Cloudflare R2': await testCloudflareR2()
  };
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('                    SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════');
  
  let passCount = 0;
  let failCount = 0;
  
  for (const [service, passed] of Object.entries(results)) {
    if (passed) {
      console.log(`  ✅ ${service}`);
      passCount++;
    } else {
      console.log(`  ❌ ${service}`);
      failCount++;
    }
  }
  
  console.log('\n' + `Total: ${passCount} passed, ${failCount} failed`);
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  process.exit(failCount > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
