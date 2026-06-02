# Data Custody Model

**Zero-Knowledge Data Architecture** — Pilot Sovereignty First

---

## Overview

The PilotRecognition platform implements a zero-knowledge data custody model where pilots retain sovereignty over their personal data. The platform acts as a coordination layer, not a data repository.

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA CUSTODY ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐│
│  │   PILOT DEVICE   │    │  PILOT DEVICE   │    │   AIRLINE ATS   ││
│  │                 │    │                 │    │                 ││
│  │  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌───────────┐  ││
│  │  │ Wallet    │  │    │  │ Wallet    │  │    │  │ Verified  │  ││
│  │  │ (Tier 2)  │  │    │  │ (Tier 2)  │  │    │  │ VP Check  │  ││
│  │  │ Encrypted │  │    │  │ Encrypted │  │    │  │           │  ││
│  │  └─────┬─────┘  │    │  └─────┬─────┘  │    │  └───────────┘  ││
│  │        │        │    │        │        │    │        ▲          ││
│  │        ▼        │    │        ▼        │    │        │          ││
│  │  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌────┴────┐     ││
│  │  │ VC Chain  │  │    │  │ VC Chain  │  │    │  │  ZKP     │     ││
│  │  │ License   │──┼────┼──▶│ License   │  │    │  │ Verify   │     ││
│  │  │ Medical   │  │    │  │ Medical   │  │    │  └──────────┘     ││
│  │  │ Hours     │  │    │  │ Hours     │  │    │                   ││
│  │  └───────────┘  │    │  └───────────┘  │    │                   ││
│  └─────────────────┘    └─────────────────┘    └─────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │         PLATFORM COORDINATION LAYER (Supabase)              │ │
│  │                                                             │ │
│  │  • Encrypted credential hashes (not plaintext)               │ │
│  │  • Status list pointers (not full credentials)             │ │
│  │  • Audit logs with zero PII                                │ │
│  │  • RLS policies enforcing domain boundaries                  │ │
│  │                                                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Core Principles

### 1. Pilot Sovereignty

Pilots own their data. The platform facilitates verification and sharing, but never owns or controls the underlying credentials.

### 2. Zero-Knowledge Verification

Third parties (airlines, ATOs) can verify credentials without accessing underlying PII through Zero-Knowledge Proofs (ZKPs).

### 3. No Centralized Repository

No centralized database of pilot credentials exists. Each pilot's wallet is their personal credential store.

### 4. Immutable Audit Trail

All platform actions are logged immutably, but without PII exposure.

---

## Data Classification

| Tier | Data Type | Storage | Access | Retention |
|------|-----------|---------|--------|-----------|
| **Tier 0** | Raw documents (license scans, medical certs) | Pilot's R2 private bucket | Pilot only | Until verified |
| **Tier 1** | Verified credential hashes | Supabase (encrypted) | Pilot + verified query | 7 years (regulatory) |
| **Tier 2** | Full VCs with PII | Pilot's device (Tier 2 wallet) | Pilot only | Until expiry |
| **Tier 3** | Status list pointers | Supabase (public) | Public | Real-time |
| **Tier 4** | Audit logs (zero PII) | Supabase (immutable) | Admin only | 12 months |

---

## Zero-Knowledge Proof Architecture

### What Airlines See

```typescript
// Verifiable Presentation (VP) - what airlines receive
interface VerifiablePresentation {
  '@context': ['https://www.w3.org/2018/credentials/v1'];
  type: ['VerifiablePresentation'];
  verifiableCredential: [{
    // Redacted credential - proof only, no PII
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiableCredential', 'PilotLicenseVC'],
    issuer: { id: 'did:web:pilotrecognition.com' },
    // NO credentialSubject with PII
    proof: {
      type: 'EcdsaSecp256r1Signature2019',
      verificationMethod: 'did:web:pilotrecognition.com#key-1',
      jws: '...',  // Signature proves validity
    },
  }];
  proof: {
    type: 'EcdsaSecp256r1Signature2019',
    challenge: 'pr_nonce_a3f92c1d',  // One-time use
    domain: 'workday.etihad.com',   // ATS-specific
    created: '2026-06-02T10:30:00Z',
    jws: '...',
  };
}
```

### Verification Without Exposure

```typescript
// Airline ATS verification flow
export async function verifyPilotPresentation(vp: VerifiablePresentation): Promise<VerificationResult> {
  // 1. Verify VP signature
  const isVpValid = await verifySignature(vp.proof);
  
  // 2. Verify credential signature
  const isCredentialValid = await verifyCredential(vp.verifiableCredential[0]);
  
  // 3. Check status list
  const status = await checkStatus(vp.verifiableCredential[0].id);
  
  // 4. Verify challenge uniqueness
  const isChallengeFresh = await checkChallengeNotReplayed(vp.proof.challenge);
  
  // Result: Verified, but airline never saw:
  // - License number
  // - Medical details
  // - Home address
  // - Personal identifiers
  return {
    verified: isVpValid && isCredentialValid && status === 'active' && isChallengeFresh,
    terminalTier: 'terminal-3',
    checks: {
      signature: isVpValid,
      credential: isCredentialValid,
      status,
      freshness: isChallengeFresh,
    },
    // Zero PII exposed
  };
}
```

---

## Legal Data Custody Framework

### Terms of Service Compliance

The platform's Terms of Service (Section 13.3) establishes:

```
┌─────────────────────────────────────────────────────────────────┐
│              LEGAL CUSTODY FRAMEWORK (ToS v1.6)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. ORIGIN_JURISDICTION (Immutable)                            │
│     → Set at account creation via IP geofencing                  │
│     → Governs applicable data protection law                     │
│     → Cannot be modified post-provisioning                       │
│                                                                  │
│  2. DATA CONTROLLER AGREEMENT                                   │
│     → Explicit consent for each data processing purpose        │
│     → Granular permission model (Article 4, 5, 7)                │
│     → Revocable at any time by pilot                           │
│                                                                  │
│  3. ZERO-PERSISTENCE RULE (Section S5.7)                        │
│     → Platform cannot retain PII post-verification              │
│     → Credential hashes stored, not plaintext                    │
│     → 72-hour TTL on transient verification payloads             │
│                                                                  │
│  4. REVOCATION CASCADE (Section 16.1)                          │
│     → Veremark webhook → instant credential revocation           │
│     → Status list updated within 60 seconds                      │
│     → Terminal 1 (red) status triggered                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Consent Layer

### Granular Permissions

```typescript
// lib/consent.ts
interface ConsentPreferences {
  profile: {
    fullName: boolean;        // Share name with airlines
    contactInfo: boolean;     // Share email/phone
    location: boolean;        // Share base location
  };
  credentials: {
    licenseNumber: boolean;   // Share actual license #
    medicalExpiry: boolean;   // Share medical status
    totalHours: boolean;      // Share flight hours
    ratings: boolean;         // Share type ratings
  };
  sharing: {
    allowPull: boolean;       // Airlines can pull profile
    allowSearch: boolean;     // Profile appears in search
    autoShareOnApply: boolean;  // Auto-share when applying
  };
}

// Default: Minimal sharing
export const defaultConsent: ConsentPreferences = {
  profile: { fullName: true, contactInfo: false, location: true },
  credentials: { licenseNumber: false, medicalExpiry: true, totalHours: true, ratings: true },
  sharing: { allowPull: false, allowSearch: true, autoShareOnApply: false },
};
```

---

## Redis TTL Enforcement

### Section 14.2 Compliance

```typescript
// lib/cache.ts
const TRANSIENT_TTL_SECONDS = 72 * 60 * 60; // 72 hours

export async function storeVerificationPayload(
  key: string,
  payload: VerificationPayload
): Promise<void> {
  // Store with deterministic TTL
  await redis.setex(`verify:${key}`, TRANSIENT_TTL_SECONDS, JSON.stringify(payload));
  
  // Log TTL setting for audit
  await logAuditEvent('transient_data_stored', {
    key,
    ttl: TRANSIENT_TTL_SECONDS,
    expiresAt: new Date(Date.now() + TRANSIENT_TTL_SECONDS * 1000).toISOString(),
  });
}

// Explicit DEL on verification completion
export async function deleteVerificationPayload(key: string): Promise<void> {
  await redis.del(`verify:${key}`);
  
  await logAuditEvent('transient_data_deleted', {
    key,
    deletedAt: new Date().toISOString(),
  });
}
```

---

## Data Retention Schedule

| Data Type | Retention Period | Action at Expiry |
|-----------|-----------------|------------------|
| Raw documents | 30 days post-verification | Automatic deletion |
| Verified credential hashes | 7 years (regulatory) | Archive to cold storage |
| Status list entries | Until credential expiry | Bit cleared |
| Audit logs | 12 months | Aggregate to summary stats |
| Session tokens | 24 hours | Redis TTL expiration |
| Verification payloads | 72 hours | Redis explicit DEL |

---

## Related Documents

- [03-wallet-system-architecture.md](./03-wallet-system-architecture.md) — Four-tier wallet security
- [07-secure-enclave-architecture.md](./07-secure-enclave-architecture.md) — Hardware-backed key storage
- [08-key-management-rotation.md](./08-key-management-rotation.md) — Cryptographic key lifecycle

---

**Document Version:** 1.0  
**Last Updated:** June 2, 2026
