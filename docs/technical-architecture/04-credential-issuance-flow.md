# Credential Issuance Flow

**W3C Verifiable Credentials Pipeline** — From Verification to Wallet Storage

---

## Overview

The credential issuance flow transforms verified pilot documents into cryptographically signed W3C Verifiable Credentials (VCs) stored in the pilot's wallet.

```
┌─────────────────────────────────────────────────────────────────┐
│                    CREDENTIAL ISSUANCE PIPELINE                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────────────┐   │
│  │   Document   │──▶│  Verification │──▶│  VC Construction   │   │
│  │   Upload     │   │  (Veremark/API)│   │  (W3C Standard)    │   │
│  └──────────────┘   └──────────────┘   └────────────────────┘   │
│                                               │                  │
│                                               ▼                  │
│                              ┌────────────────────────────┐     │
│                              │      Issuer Signing         │     │
│                              │  (ECDSA P-256 Self-Hosted)  │     │
│                              └────────────────────────────┘     │
│                                               │                  │
│                                               ▼                  │
│                              ┌────────────────────────────┐     │
│                              │   Wallet Storage (Tier 2)   │     │
│                              │   AES-256-GCM IndexedDB    │     │
│                              └────────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Credential Types

| VC Type | Source | Contains | Use Case |
|---------|--------|----------|----------|
| `PilotLicenseVC` | CAAP/FAA/EASA | License #, ratings, expiry | Job applications |
| `MedicalCertVC` | AME verification | Class, examiner, expiry | Medical compliance |
| `FlightHoursVC` | Logbook/ATO | Total hours, types flown | Experience proof |
| `ELPVC` | Language test | ICAO Level 4/5/6 | International ops |
| `AnonymousPilotVC` | Self-asserted | Hashed license only | PSA stories |

---

## Step 1: Document Upload

### Upload Flow

```typescript
// app/verification/page.tsx
async function uploadDocument(
  file: File,
  type: DocumentType
): Promise<UploadResult> {
  // 1. Client-side validation
  const validation = await validateDocument(file, type);
  if (!validation.valid) throw new Error(validation.error);

  // 2. Upload to private R2 bucket
  const { path, signedUrl } = await uploadToStorage(file, {
    bucket: 'pilot-documents',
    path: `${profileId}/${type}/${file.name}`,
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  });

  // 3. Create verification queue entry
  await supabase.from('pilot_documents').insert({
    profile_id: profileId,
    document_type: type,
    storage_path: path,
    status: 'pending_verification',
    uploaded_at: new Date().toISOString(),
  });

  return { path, signedUrl };
}
```

---

## Step 2: Verification

### Verification Sources

| Source | Method | Latency | Reliability |
|--------|--------|---------|-------------|
| **Veremark** | API + Webhook | 24-72h | High |
| **CAAP** | Direct API | <5s | Very High |
| **GCAA** | Direct API | <5s | Very High |
| **FAA** | Airmen Registry | <30s | High |
| **Self-asserted** | ATO endorsement | Manual | Medium |

### Veremark Integration

```typescript
// supabase/functions/veremark-webhook/index.ts
export async function handleVeremarkWebhook(req: Request): Promise<Response> {
  const payload = await req.json();
  const { check_id, status, candidate_id, result } = payload;

  // Update verification status
  await supabase.from('pilot_documents')
    .update({
      status: status === 'completed' ? 'verified' : 'failed',
      verification_result: result,
      verified_at: new Date().toISOString(),
    })
    .eq('veremark_check_id', check_id);

  // Trigger credential issuance if all docs verified
  if (status === 'completed') {
    await triggerCredentialIssuance(candidate_id);
  }

  return new Response('OK', { status: 200 });
}
```

---

## Step 3: VC Construction

### W3C VC Structure

```typescript
// lib/wallet/vcBuilder.ts
interface VerifiableCredential {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://pilotrecognition.com/contexts/v2/aviation-v2.jsonld'
  ];
  id: string;                    // UUID
  type: ['VerifiableCredential', 'PilotLicenseVC'];
  issuer: {
    id: string;                  // did:web:pilotrecognition.com
    name: string;
  };
  issuanceDate: string;          // ISO8601
  expirationDate: string;        // From license expiry
  credentialSubject: {
    id: string;                  // Holder's did:key
    licenseNumber: string;
    ratings: string[];
    issuingAuthority: string;
    dateOfIssue: string;
    dateOfExpiry: string;
    limitations?: string[];
  };
  proof: {
    type: 'EcdsaSecp256r1Signature2019';
    created: string;
    proofPurpose: 'assertionMethod';
    verificationMethod: string;
    jws: string;                  // Base64URL-encoded signature
  };
}
```

### Context File

```json
// public/contexts/v2/aviation-v2.jsonld
{
  "@context": {
    "@version": 1.1,
    "@protected": true,
    "PilotLicenseVC": "https://pilotrecognition.com/vc/PilotLicenseVC",
    "MedicalCertVC": "https://pilotrecognition.com/vc/MedicalCertVC",
    "FlightHoursVC": "https://pilotrecognition.com/vc/FlightHoursVC",
    "licenseNumber": "https://pilotrecognition.com/terms/licenseNumber",
    "ratings": "https://pilotrecognition.com/terms/ratings",
    "issuingAuthority": "https://pilotrecognition.com/terms/issuingAuthority"
  }
}
```

---

## Step 4: Issuer Signing

### Self-Hosted Issuer

```typescript
// supabase/functions/issuer-sign/index.ts
import * as jose from 'jose';

export async function signCredential(credential: CredentialPayload): Promise<SignedVC> {
  // Load signing key from environment
  const jwk = JSON.parse(Deno.env.get('PLATFORM_SIGNING_KEY_JWK'));
  const privateKey = await jose.importJWK(jwk, 'ES256');

  // Create JWT with credential as payload
  const jwt = await new jose.SignJWT({
    vc: credential,
  })
    .setProtectedHeader({ alg: 'ES256', typ: 'JWT' })
    .setIssuer('did:web:pilotrecognition.com')
    .setSubject(credential.credentialSubject.id)
    .setIssuedAt()
    .setExpirationTime(credential.expirationDate)
    .sign(privateKey);

  // Attach proof to credential
  return {
    ...credential,
    proof: {
      type: 'EcdsaSecp256r1Signature2019',
      created: new Date().toISOString(),
      proofPurpose: 'assertionMethod',
      verificationMethod: 'did:web:pilotrecognition.com#key-1',
      jws: jwt,
    },
  };
}
```

### DID Document

```json
// public/.well-known/did.json
{
  "@context": ["https://www.w3.org/ns/did/v1"],
  "id": "did:web:pilotrecognition.com",
  "verificationMethod": [{
    "id": "did:web:pilotrecognition.com#key-1",
    "type": "JsonWebKey2020",
    "controller": "did:web:pilotrecognition.com",
    "publicKeyJwk": {
      "kty": "EC",
      "crv": "P-256",
      "x": "...",
      "y": "..."
    }
  }],
  "assertionMethod": ["did:web:pilotrecognition.com#key-1"]
}
```

---

## Step 5: Wallet Delivery

### Storage Flow

```typescript
// lib/wallet/storage.ts
export async function receiveCredential(signedVC: SignedVC): Promise<void> {
  // 1. Verify signature before storage
  const isValid = await verifyCredential(signedVC);
  if (!isValid) throw new Error('Invalid credential signature');

  // 2. Decrypt storage key
  const storageKey = await initStorageKey(holderDid);

  // 3. Encrypt and store
  await storeCredential(storageKey, signedVC);

  // 4. Update database reference
  await supabase.from('pilot_credentials').insert({
    profile_id: profileId,
    credential_type: signedVC.type[1],
    issuer_did: signedVC.issuer.id,
    subject_did: signedVC.credentialSubject.id,
    credential_jwt: signedVC.proof.jws,
    status: 'active',
    issued_at: signedVC.issuanceDate,
    expires_at: signedVC.expirationDate,
  });

  // 5. Log receipt (zero PII)
  await logWalletAction('credential_received', {
    type: signedVC.type[1],
    domain: getCurrentDomain(),
  });
}
```

---

## Domain-Specific Issuance

### pilotshortage.org — Anonymous

```typescript
// supabase/functions/shortage-issue/index.ts
export async function issueAnonymousCredential(profile: Profile): Promise<VC> {
  // Hash license number for privacy
  const licenseHash = await sha256(profile.license_number);

  return {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiableCredential', 'AnonymousPilotVC'],
    issuer: { id: 'did:web:pilotrecognition.com', name: 'PilotRecognition' },
    credentialSubject: {
      id: holderDid,
      licenseHash,           // SHA-256, not recoverable
      role: 'Pilot',
      // NO PII - no name, no actual license number
    },
    // ... proof
  };
}
```

### pilotcareerpathways.com — Career

```typescript
// supabase/functions/pathways-issue/index.ts
export async function issueCareerCredentials(profile: Profile): Promise<VC[]> {
  return [
    buildPilotLicenseVC(profile),
    buildMedicalCertVC(profile),
    buildFlightHoursVC(profile),
  ];
}
```

---

## Verification Endpoint

```typescript
// API: POST /api/verify-credential
export async function verifyCredentialHandler(req: Request): Promise<Response> {
  const { credential } = await req.json();

  // 1. Verify signature
  const jwk = await fetchDIDDocument(credential.proof.verificationMethod);
  const isSignatureValid = await jose.jwtVerify(
    credential.proof.jws,
    await jose.importJWK(jwk)
  );

  // 2. Check status list
  const status = await checkStatusList(credential.id);

  // 3. Verify expiry
  const isExpired = new Date(credential.expirationDate) < new Date();

  return Response.json({
    valid: isSignatureValid && status === 'active' && !isExpired,
    checks: {
      signature: isSignatureValid,
      status,
      expired: isExpired,
    },
  });
}
```

---

## Related Documents

- [03-wallet-system-architecture.md](./03-wallet-system-architecture.md) — Four-tier wallet infrastructure
- [05-credential-status-management.md](./05-credential-status-management.md) — Revocation system
- [08-key-management-rotation.md](./08-key-management-rotation.md) — Issuer key rotation

---

**Document Version:** 1.0  
**Last Updated:** June 2, 2026
