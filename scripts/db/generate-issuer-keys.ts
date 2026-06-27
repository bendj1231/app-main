/**
 * Generate Platform Signing Keys for Production
 * 
 * Run: deno run --allow-all scripts/generate-issuer-keys.ts
 * 
 * Outputs:
 *   1. JWK private key (save as PLATFORM_SIGNING_KEY_JWK env var)
 *   2. Public key for DID document
 *   3. did.json content for hosting
 */

// Generate ECDSA P-256 keypair
async function generateKeyPair() {
  const keyPair = await crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    true, // extractable for export
    ['sign', 'verify']
  );
  
  // Export private key as JWK
  const privateKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey);
  
  // Export public key as JWK
  const publicKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
  
  return { privateKeyJwk, publicKeyJwk };
}

// Convert JWK to DID verificationMethod format
function jwkToVerificationMethod(publicKeyJwk: JsonWebKey, did: string) {
  return {
    id: `${did}#key-1`,
    type: 'JsonWebKey2020',
    controller: did,
    publicKeyJwk: {
      kty: publicKeyJwk.kty,
      crv: publicKeyJwk.crv,
      x: publicKeyJwk.x,
      y: publicKeyJwk.y,
    },
  };
}

// Main execution
async function main() {
  const PLATFORM_DID = 'did:web:pilotrecognition.com';
  const DOMAIN = 'pilotrecognition.com';
  
  console.log('\n🔐 PilotRecognition Production Key Generator\n');
  console.log(`Platform DID: ${PLATFORM_DID}`);
  console.log('Algorithm: ECDSA P-256 (secp256r1)');
  console.log('Cryptosuite: ecdsa-2026\n');
  
  // Generate keys
  console.log('Generating keypair...');
  const { privateKeyJwk, publicKeyJwk } = await generateKeyPair();
  
  // Create DID document
  const verificationMethod = jwkToVerificationMethod(publicKeyJwk, PLATFORM_DID);
  
  const didDocument = {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      'https://w3id.org/security/suites/jws-2020/v1',
    ],
    id: PLATFORM_DID,
    verificationMethod: [verificationMethod],
    authentication: [`${PLATFORM_DID}#key-1`],
    assertionMethod: [`${PLATFORM_DID}#key-1`],
    keyAgreement: [],
    capabilityInvocation: [],
    capabilityDelegation: [],
  };
  
  // Output results
  console.log('\n' + '='.repeat(70));
  console.log('STEP 1: SET ENVIRONMENT VARIABLE');
  console.log('='.repeat(70));
  console.log('\nAdd this to your Supabase Edge Function secrets:\n');
  console.log(`PLATFORM_SIGNING_KEY_JWK='${JSON.stringify(privateKeyJwk)}'`);
  
  console.log('\n' + '='.repeat(70));
  console.log('STEP 2: HOST DID DOCUMENT');
  console.log('='.repeat(70));
  console.log('\nCreate file: public/.well-known/did.json\n');
  console.log(JSON.stringify(didDocument, null, 2));
  
  console.log('\n' + '='.repeat(70));
  console.log('STEP 3: VERIFY SETUP');
  console.log('='.repeat(70));
  console.log(`\n1. Deploy edge function:`);
  console.log(`   supabase functions deploy issuer-sign`);
  console.log(`\n2. Set secret:`);
  console.log(`   supabase secrets set PLATFORM_SIGNING_KEY_JWK='${JSON.stringify(privateKeyJwk).slice(0, 50)}...'`);
  console.log(`\n3. Test DID resolution:`);
  console.log(`   curl https://${DOMAIN}/.well-known/did.json`);
  console.log(`\n4. Test signing endpoint:`);
  console.log(`   curl -X POST https://<project>.supabase.co/functions/v1/issuer-sign \\\n        -H 'Content-Type: application/json' \\\n        -H 'Authorization: Bearer <anon-key>' \\\n        -d '{"credential_type":"PilotLicenseVC","subject_did":"did:web:pilotrecognition.com:pilots:test"}'`);
  
  console.log('\n' + '='.repeat(70));
  console.log('⚠️  CRITICAL: BACKUP PRIVATE KEY');
  console.log('='.repeat(70));
  console.log('\nSave the PLATFORM_SIGNING_KEY_JWK value securely.');
  console.log('If lost, all previously issued credentials become unverifiable.');
  console.log('Use 1Password, Vault, or hardware security module.\n');
}

main().catch(console.error);
