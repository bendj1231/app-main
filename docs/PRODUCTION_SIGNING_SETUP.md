# Production Signing Infrastructure Setup

**Replaces:** Walt.id demo issuer (`https://issuer.demo.walt.id`)
**New System:** Self-hosted ECDSA P-256 signing via `issuer-sign` edge function

---

## Overview

```
Before (Demo):
Veremark webhook → pilot-terminal-issue → Walt.id demo issuer → PENDING_ENCLAVE_SIGNATURE

After (Production):
Veremark webhook → issuer-sign (self-hosted) → Real ECDSA P-256 signature → Airline-verifiable VC
```

---

## Step 1: Generate Production Keys

```bash
# Run the key generator
deno run --allow-all scripts/generate-issuer-keys.ts
```

**Output will include:**
1. `PLATFORM_SIGNING_KEY_JWK` — Private key (SAVE SECURELY)
2. `did.json` content — DID document for hosting
3. Public key for verification

---

## Step 2: Set Environment Variables

```bash
# Set the signing key in Supabase secrets
supabase secrets set PLATFORM_SIGNING_KEY_JWK='{"kty":"EC","crv":"P-256","d":"YOUR_PRIVATE_KEY_HERE","x":"...","y":"..."}'

# Verify it's set
supabase secrets list
```

---

## Step 3: Deploy Edge Functions

```bash
# Deploy the new production issuer
supabase functions deploy issuer-sign

# Redeploy veremark-webhook (now uses issuer-sign)
supabase functions deploy veremark-webhook
```

---

## Step 4: Host DID Document

The file `public/.well-known/did.json` should already exist. Update it with your new public key:

```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/jws-2020/v1"
  ],
  "id": "did:web:pilotrecognition.com",
  "verificationMethod": [{
    "id": "did:web:pilotrecognition.com#key-1",
    "type": "JsonWebKey2020",
    "controller": "did:web:pilotrecognition.com",
    "publicKeyJwk": {
      "kty": "EC",
      "crv": "P-256",
      "x": "YOUR_PUBLIC_KEY_X_HERE",
      "y": "YOUR_PUBLIC_KEY_Y_HERE"
    }
  }],
  "authentication": ["did:web:pilotrecognition.com#key-1"],
  "assertionMethod": ["did:web:pilotrecognition.com#key-1"]
}
```

Deploy to production:
```bash
# If using Vercel/Netlify — commit and push
# The .well-known/did.json is served from public/
git add public/.well-known/did.json
git commit -m "Update DID document with production signing key"
git push
```

---

## Step 5: Verify Setup

### Test 1: DID Resolution
```bash
curl https://pilotrecognition.com/.well-known/did.json
```
Should return your DID document with public key.

### Test 2: Sign a Test Credential
```bash
curl -X POST https://<project>.supabase.co/functions/v1/issuer-sign \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <anon-key>' \
  -d '{
    "credential_type": "PilotLicenseVC",
    "subject_did": "did:web:pilotrecognition.com:pilots:test123",
    "credential_data": {
      "licenseNumber": "TEST-123456",
      "pelNumber": "123456",
      "issuingAuthority": "CAAP",
      "expiryDate": "2030-12-31",
      "totalHours": 1500,
      "verificationMethod": "Test"
    },
    "auth0_id": "test|123",
    "profile_id": "00000000-0000-0000-0000-000000000000"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "credential_id": "uuid",
  "issuer_did": "did:web:pilotrecognition.com",
  "signed_credential": {
    "@context": [...],
    "type": ["VerifiableCredential", "PilotLicenseCredential"],
    "issuer": { "id": "did:web:pilotrecognition.com", ... },
    "proof": {
      "type": "DataIntegrityProof",
      "cryptosuite": "ecdsa-2026",
      "proofValue": "BASE64_SIGNATURE_HERE",  // ← Real signature, not placeholder
      ...
    }
  }
}
```

### Test 3: End-to-End Veremark Flow
1. Trigger a Veremark verification for a test pilot
2. Wait for `verification.completed` webhook
3. Check `pilot_credentials` table — should have signed VC with `proof_value`
4. Verify credential is NOT `PENDING_ENCLAVE_SIGNATURE`

---

## Step 6: Database Migration

Ensure `pilot_credentials` table supports the new structure:

```sql
-- Add proof_value column if not exists
ALTER TABLE pilot_credentials 
ADD COLUMN IF NOT EXISTS proof_value TEXT,
ADD COLUMN IF NOT EXISTS signed_credential JSONB,
ADD COLUMN IF NOT EXISTS subject_did TEXT;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_pilot_credentials_proof 
ON pilot_credentials(proof_value) 
WHERE proof_value IS NOT NULL;
```

---

## Security Checklist

| Item | Status | Notes |
|------|--------|-------|
| Private key backed up | ☐ | Use 1Password, Vault, or HSM |
| Private key never logged | ☐ | Check `generate-issuer-keys.ts` output wasn't saved to shell history |
| DID document hosted | ☐ | Verify at `/.well-known/did.json` |
| HTTPS only | ☐ | DID must be served over TLS |
| Key rotation plan | ☐ | Document how to rotate in case of compromise |
| Revocation registry ready | ☐ | `vc_revocation_registry` table exists |

---

## Troubleshooting

### Issue: "PLATFORM_SIGNING_KEY_JWK not configured"
**Fix:**
```bash
supabase secrets set PLATFORM_SIGNING_KEY_JWK='...'
supabase functions deploy issuer-sign
```

### Issue: "Failed to import key"
**Cause:** Malformed JWK  
**Fix:** Regenerate keys with `generate-issuer-keys.ts`

### Issue: DID document not resolving
**Cause:** File not deployed or wrong path  
**Fix:** Check `public/.well-known/did.json` exists and is deployed

### Issue: Signature verification fails
**Cause:** DID document public key doesn't match signing key  
**Fix:** Regenerate both together, ensure they match

---

## Airline Verification Instructions

When airlines receive a signed VC from your pilots, they can verify:

```javascript
// 1. Resolve issuer DID
const didDocument = await fetch('https://pilotrecognition.com/.well-known/did.json').then(r => r.json());

// 2. Extract public key
const publicKey = didDocument.verificationMethod[0].publicKeyJwk;

// 3. Verify signature against credential
const isValid = await verifyEcdsaSignature(credential, publicKey);

// 4. Check revocation status
const status = await fetch('https://pilotrecognition.com/status/v1').then(r => r.json());
```

---

## Migration from Demo to Production

### Current State (Demo)
- Credentials show `PENDING_ENCLAVE_SIGNATURE`
- Walt.id demo issuer (untrusted)
- Airlines cannot verify

### Target State (Production)
- Real ECDSA P-256 signatures
- `did:web:pilotrecognition.com` issuer
- Airline-verifiable without external dependencies

### Migration Steps
1. ✅ Generate production keys
2. ✅ Deploy `issuer-sign` function
3. ✅ Update DID document
4. ✅ Set environment variables
5. ☐ Re-issue existing demo credentials (optional)
   ```sql
   -- Mark old demo credentials as deprecated
   UPDATE pilot_credentials 
   SET status = 'deprecated_demo', 
       metadata = metadata || '{"deprecated_reason": "demo_issuer"}'
   WHERE proof_value = 'PENDING_ENCLAVE_SIGNATURE';
   ```
6. ☐ Notify pilots with demo credentials to re-verify

---

## Cost Comparison

| Approach | Monthly Cost | Trust Level |
|----------|--------------|-------------|
| Walt.id Cloud | $200-500 | Vendor-dependent |
| **Self-Hosted (This Setup)** | **$0** | **Full platform control** |
| Enterprise HSM | $1000+ | Bank-grade |

---

## Next Steps

1. **Backup your private key immediately**
2. **Deploy to staging** and test with one pilot
3. **Deploy to production**
4. **Notify Karl** for airline partner verification testing
5. **Update documentation** for enterprise customers

---

**Ready to deploy?** Run the key generator now:
```bash
deno run --allow-all scripts/generate-issuer-keys.ts
```
