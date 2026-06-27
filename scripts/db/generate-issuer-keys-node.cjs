#!/usr/bin/env node
/**
 * Generate ECDSA P-256 key pair for PilotRecognition issuer
 * Node.js version (no Deno required)
 * 
 * Usage: node scripts/generate-issuer-keys-node.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🔐 PilotRecognition Issuer Key Generator (Node.js)');
console.log('===================================================\n');

// Generate ECDSA P-256 key pair
const keyPair = crypto.generateKeyPairSync('ec', {
  namedCurve: 'prime256v1', // P-256
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

// Convert to JWK format
const privateKeyJwk = crypto.createPrivateKey(keyPair.privateKey).export({
  format: 'jwk'
});

const publicKeyJwk = crypto.createPublicKey(keyPair.publicKey).export({
  format: 'jwk'
});

// Ensure P-256 curve
privateKeyJwk.crv = 'P-256';
privateKeyJwk.kty = 'EC';
publicKeyJwk.crv = 'P-256';
publicKeyJwk.kty = 'EC';

console.log('✅ Keys generated successfully!\n');

console.log('🔒 PRIVATE KEY (JWK - Keep Secret!):');
console.log('=====================================');
console.log(JSON.stringify(privateKeyJwk, null, 2));
console.log('');

console.log('🔓 PUBLIC KEY (JWK - Goes in DID Document):');
console.log('==========================================');
console.log(JSON.stringify(publicKeyJwk, null, 2));
console.log('');

// Create DID document content
const didDocument = {
  "@context": ["https://www.w3.org/ns/did/v1"],
  "id": "did:web:pilotrecognition.com",
  "verificationMethod": [{
    "id": "did:web:pilotrecognition.com#key-1",
    "type": "JsonWebKey2020",
    "controller": "did:web:pilotrecognition.com",
    "publicKeyJwk": publicKeyJwk
  }],
  "assertionMethod": ["did:web:pilotrecognition.com#key-1"]
};

console.log('📄 DID DOCUMENT (Save to public/.well-known/did.json):');
console.log('======================================================');
console.log(JSON.stringify(didDocument, null, 2));
console.log('');

// Update the DID file
const didPath = path.join(__dirname, '..', 'public', '.well-known', 'did.json');
try {
  fs.mkdirSync(path.dirname(didPath), { recursive: true });
  fs.writeFileSync(didPath, JSON.stringify(didDocument, null, 2));
  console.log(`✅ DID document updated: ${didPath}`);
} catch (err) {
  console.error(`❌ Failed to write DID document: ${err.message}`);
}

console.log('\n🚀 NEXT STEPS:');
console.log('==============');
console.log('1. Set the private key as Supabase secret:');
console.log('   supabase secrets set PLATFORM_SIGNING_KEY_JWK');
console.log('   [Copy the JWK from above]');
console.log('');
console.log('2. Deploy the edge function:');
console.log('   supabase functions deploy issuer-sign --project-ref gkbhgrozrzhalnjherfu');
console.log('');
console.log('3. Test the issuer:');
console.log('   curl -X POST https://gkbhgrozrzhalnjherfu.supabase.co/functions/v1/issuer-sign ...');
console.log('');
console.log('⚠️  IMPORTANT: Save the private key JWK somewhere secure!');
console.log('   If you lose it, you cannot sign credentials.');
