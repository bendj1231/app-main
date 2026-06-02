# Key Management & Rotation

**Cryptographic Key Lifecycle** — Issuer Keys and Wallet Keys

---

## Overview

This document describes the complete key management architecture for the PilotRecognition platform, covering both platform issuer keys and pilot wallet keys.

```
┌─────────────────────────────────────────────────────────────────┐
│                    KEY MANAGEMENT ARCHITECTURE                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────┐    ┌─────────────────────────────┐ │
│  │   PLATFORM ISSUER KEYS   │    │      PILOT WALLET KEYS     │ │
│  │                          │    │                            │ │
│  │  • did:web:pilotrecognition │   │  • did:key per pilot      │ │
│  │  • Self-hosted P-256       │   │  • Non-extractable        │ │
│  │  • 90-day rotation         │   │  • Hardware-bound         │ │
│  │  • HSM-backed (production)  │   │  • Device-specific        │ │
│  │                          │    │                            │ │
│  │  Rotation Schedule:       │   │  Rotation: On device change│ │
│  │  - Primary: Active        │   │                            │ │
│  │  - Secondary: Standby     │   │                            │ │
│  │  - Tertiary: Emergency    │   │                            │ │
│  └─────────────────────────┘    └─────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Platform Issuer Keys

### Key Hierarchy

```
┌────────────────────────────────────────────────────────────────┐
│                    ISSUER KEY HIERARCHY                          │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Tier 1: MASTER KEY (Offline, HSM-backed)                         │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ • Air-gapped signing ceremony                              ││
│  │ • Shamir's Secret Sharing (3-of-5)                         ││
│  │ • Only signs rotation certificates                         ││
│  └────────────────────────────────────────────────────────────┘│
│                              │                                  │
│                              ▼                                  │
│  Tier 2: OPERATIONAL KEYS (Supabase Edge Functions)             │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ Primary Key   (Active)    → issues VCs                     ││
│  │ Secondary Key (Standby)   → ready for rotation            ││
│  │ Tertiary Key  (Emergency) → disaster recovery             ││
│  └────────────────────────────────────────────────────────────┘│
│                              │                                  │
│                              ▼                                  │
│  Tier 3: DID DOCUMENT (Public)                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ public/.well-known/did.json                               ││
│  │ - Lists all active verificationMethods                     ││
│  │ - Includes key expiry metadata                             ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Key Generation

```typescript
// scripts/generate-issuer-keys.ts
import * as jose from 'jose';

export async function generateIssuerKeyPair(): Promise<IssuerKeyPair> {
  // Generate P-256 key pair
  const { publicKey, privateKey } = await jose.generateKeyPair('ES256');
  
  // Export as JWK for storage
  const privateJwk = await jose.exportJWK(privateKey);
  const publicJwk = await jose.exportJWK(publicKey);
  
  return {
    id: crypto.randomUUID(),
    privateKey: privateJwk,
    publicKey: publicJwk,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  };
}
```

### DID Document Management

```typescript
// lib/did.ts
interface DIDDocument {
  '@context': ['https://www.w3.org/ns/did/v1'];
  id: string;  // did:web:pilotrecognition.com
  verificationMethod: VerificationMethod[];
  assertionMethod: string[];
  keyAgreement?: string[];
}

export async function generateDIDDocument(
  keys: IssuerKeyPair[]
): Promise<DIDDocument> {
  const verificationMethods = keys.map((key, index) => ({
    id: `did:web:pilotrecognition.com#key-${index + 1}`,
    type: 'JsonWebKey2020',
    controller: 'did:web:pilotrecognition.com',
    publicKeyJwk: key.publicKey,
  }));
  
  return {
    '@context': ['https://www.w3.org/ns/did/v1'],
    id: 'did:web:pilotrecognition.com',
    verificationMethod: verificationMethods,
    assertionMethod: verificationMethods.map(vm => vm.id),
  };
}
```

---

## Key Rotation Schedule

### Automated 90-Day Rotation

```typescript
// supabase/functions/key-rotation/index.ts
export async function scheduledKeyRotation(): Promise<void> {
  const keys = await getActiveKeys();
  
  // Check if primary key expires within 7 days
  const primaryKey = keys.find(k => k.status === 'primary');
  const daysUntilExpiry = daysUntil(primaryKey.expiresAt);
  
  if (daysUntilExpiry <= 7) {
    // Promote standby to primary
    const standbyKey = keys.find(k => k.status === 'standby');
    await promoteKey(standbyKey.id, 'primary');
    
    // Generate new standby key
    const newStandby = await generateIssuerKeyPair();
    await storeKey({ ...newStandby, status: 'standby' });
    
    // Update DID document
    await regenerateDIDDocument();
    
    // Log rotation
    await logKeyRotation({
      previousPrimary: primaryKey.id,
      newPrimary: standbyKey.id,
      newStandby: newStandby.id,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### Rotation Notification

When a key rotation occurs:

1. **DID Document Updated** — All verification methods refreshed
2. **Status List Regenerated** — References updated
3. **Client Cache Invalidated** — 60-second TTL ensures quick pickup
4. **Emergency Rollback** — Previous key remains valid for 24h grace period

---

## Pilot Wallet Key Rotation

### When to Rotate

| Scenario | Action | Data Preservation |
|----------|--------|-------------------|
| New device | Generate new keys | Credentials re-downloaded |
| Key compromise | Emergency rotation | All credentials re-issued |
| Periodic rotation (1 year) | Scheduled rotation | Seamless transition |
| Browser data cleared | Recovery from backup | Restore from mnemonic |

### Rotation Process

```typescript
// lib/wallet/rotation.ts
export async function rotateWalletKey(
  oldKey: EnclaveKeyPair,
  reason: RotationReason
): Promise<EnclaveKeyPair> {
  // 1. Generate new key pair
  const newKey = await generateEnclaveKey();
  
  // 2. Re-issue all credentials with new subject DID
  const credentials = await getStoredCredentials(oldKey.did);
  
  for (const cred of credentials) {
    // Request re-issuance with new DID
    await requestCredentialReissuance({
      credentialId: cred.id,
      oldSubjectDid: oldKey.did,
      newSubjectDid: newKey.did,
      proof: await signWithEnclave(oldKey.privateKey, newKey.did),
    });
  }
  
  // 3. Transfer storage encryption
  await transferStorageEncryption(oldKey, newKey);
  
  // 4. Mark old key as rotated
  await db.enclaveKeys.update(oldKey.did, {
    status: 'rotated',
    rotatedAt: Date.now(),
    rotatedTo: newKey.did,
  });
  
  return newKey;
}
```

---

## Key Storage

### Production (HSM)

```typescript
// Production: Keys stored in CloudHSM or similar
interface HSMConfig {
  provider: 'aws-cloudhsm' | 'azure-dedicated-hsm' | 'google-cloud-hsm';
  clusterId: string;
  partition: string;
  keyHandles: {
    primary: string;   // HSM key handle
    standby: string;
    tertiary: string;
  };
}

export async function signWithHSM(
  keyHandle: string,
  data: Uint8Array
): Promise<ArrayBuffer> {
  // Call HSM via PKCS#11 interface
  // Key never leaves HSM
  return hsmClient.sign({
    keyHandle,
    mechanism: 'ECDSA_SHA256',
    data,
  });
}
```

### Staging (Environment Variables)

```typescript
// Staging: Encrypted JWK in environment
const ENCRYPTED_JWK = Deno.env.get('PLATFORM_SIGNING_KEY_JWK');
const DECRYPTION_KEY = Deno.env.get('JWK_ENCRYPTION_KEY');

export async function loadStagingKey(): Promise<CryptoKey> {
  const decrypted = await decryptAesGcm(ENCRYPTED_JWK, DECRYPTION_KEY);
  const jwk = JSON.parse(decrypted);
  return jose.importJWK(jwk, 'ES256');
}
```

---

## Backup and Recovery

### Shamir's Secret Sharing (Master Key)

```typescript
// scripts/sss-backup.ts
import { split, combine } from 'shamir-secret-sharing';

export async function backupMasterKey(
  masterKey: Uint8Array,
  shares: number = 5,
  threshold: number = 3
): Promise<Uint8Array[]> {
  // Split into 5 shares, need 3 to reconstruct
  return split(masterKey, shares, threshold);
}

// Distribute shares to:
// - Share 1: CEO
// - Share 2: CTO
// - Share 3: Legal counsel
// - Share 4: Offline safe
// - Share 5: Bank vault
```

### Key Recovery Ceremony

```
EMERGENCY KEY RECOVERY
━━━━━━━━━━━━━━━━━━━━━━━

Trigger: Catastrophic key loss (fire, theft, corruption)

Participants Required: 3 of 5 share holders

Steps:
1. Emergency meeting (video recorded)
2. Each participant retrieves their share
3. Combine shares to reconstruct master key
4. Generate new operational key pair
5. Rotate all credentials
6. Destroy emergency-access logs after 30 days
```

---

## Key Audit and Monitoring

### Audit Log Schema

```typescript
interface KeyAuditEvent {
  id: string;
  timestamp: string;
  eventType: 'generated' | 'rotated' | 'compromised' | 'revoked' | 'used';
  keyId: string;
  keyType: 'issuer' | 'wallet';
  actor: string;  // DID or service account
  metadata: {
    ip?: string;
    userAgent?: string;
    reason?: string;
  };
}
```

### Alerts

| Condition | Severity | Action |
|-----------|----------|--------|
| Key used from unexpected IP | High | Alert security team |
| Rotation failed | Critical | Page on-call |
| Multiple rotation attempts | Critical | Suspect compromise |
| DID document not accessible | High | Check CDN status |

---

## Related Documents

- [03-wallet-system-architecture.md](./03-wallet-system-architecture.md) — Four-tier wallet infrastructure
- [07-secure-enclave-architecture.md](./07-secure-enclave-architecture.md) — Tier 1 enclave details

---

**Document Version:** 1.0  
**Last Updated:** June 2, 2026
