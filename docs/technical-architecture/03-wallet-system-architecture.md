# Wallet System Architecture

**Four-Tier Secure Wallet Infrastructure** — W3C Verifiable Credentials

---

## Overview

The PilotRecognition Wallet implements a four-tier security architecture for storing and managing W3C Verifiable Credentials (VCs). Each tier provides increasing levels of security and isolation.

```
┌─────────────────────────────────────────────────────────────┐
│                      TIER 4: AUDIT LAYER                     │
│              Immutable Supabase Activity Logs                 │
│          Every action logged with zero PII exposure          │
├─────────────────────────────────────────────────────────────┤
│                      TIER 3: STATUS LAYER                  │
│            Bitstring Status List v2021                       │
│        60-second polling circuit breaker                    │
├─────────────────────────────────────────────────────────────┤
│                      TIER 2: STORAGE LAYER                 │
│         AES-256-GCM Encrypted IndexedDB                     │
│           PBKDF2 key derivation (100k iterations)           │
├─────────────────────────────────────────────────────────────┤
│                      TIER 1: ENCLAVE LAYER                 │
│         WebCrypto Non-Extractable P-256 Keys                │
│              did:key derivation, hardware-bound               │
└─────────────────────────────────────────────────────────────┘
```

---

## Tier 1: Secure Enclave

### Purpose
Hardware-backed key generation and cryptographic operations. Keys are non-extractable and bound to the device.

### Implementation

```typescript
// lib/wallet/enclave.ts
export interface EnclaveKey {
  privateKey: CryptoKey;  // Non-extractable
  publicKey: CryptoKey;
  did: string;              // did:key format
}

export async function generateEnclaveKey(): Promise<EnclaveKey> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    false, // Non-extractable - CRITICAL
    ['sign', 'verify']
  );

  // Derive did:key from public key
  const publicKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
  const did = await deriveDidKey(publicKeyJwk);

  return {
    privateKey: keyPair.privateKey,
    publicKey: keyPair.publicKey,
    did,
  };
}
```

### Key Properties

| Property | Value | Purpose |
|----------|-------|---------|
| Algorithm | ECDSA P-256 | W3C standard, widely supported |
| Extractable | `false` | Prevents key export |
| Storage | WebCrypto KeyStore | OS-level secure storage |
| DID Method | `did:key` | Self-verifying, no registry needed |

---

## Tier 2: Encrypted Storage

### Purpose
Client-side encrypted database for credential storage using AES-256-GCM.

### Implementation

```typescript
// lib/wallet/storage.ts
export async function initStorageKey(holderDid: string): Promise<CryptoKey> {
  // Derive encryption key from holder DID + user password
  const encoder = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(holderDid + userPassword),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('pilot-wallet-v1'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function storeCredential(
  storageKey: CryptoKey,
  credential: VerifiableCredential
): Promise<void> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(credential));
  
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    storageKey,
    encoded
  );

  // Store in IndexedDB
  await db.credentials.put({
    id: credential.id,
    iv: Array.from(iv),
    ciphertext: Array.from(new Uint8Array(ciphertext)),
    storedAt: Date.now(),
  });
}
```

### Storage Schema

```typescript
// IndexedDB Structure
db.version(1).stores({
  credentials: '++id, type, issuedAt, status',
  auditLog: '++id, action, timestamp',
  statusCache: 'credentialId, lastChecked, status',
});
```

---

## Tier 3: Status Management

### Purpose
Real-time credential revocation checking via Bitstring Status List v2021.

### Implementation

```typescript
// lib/wallet/statusList.ts
const STATUS_POLL_INTERVAL = 60000; // 60 seconds
const STATUS_LIST_URL = 'https://pilotrecognition.com/.well-known/status-list.json';

export async function startStatusPolling(): Promise<void> {
  setInterval(async () => {
    const credentials = await db.credentials.toArray();
    
    for (const cred of credentials) {
      try {
        const status = await checkCredentialStatus(cred.id);
        await db.statusCache.put({
          credentialId: cred.id,
          lastChecked: Date.now(),
          status, // 'active' | 'suspended' | 'revoked'
        });
      } catch (err) {
        console.error('Status check failed:', err);
        // Continue - don't block on failure
      }
    }
  }, STATUS_POLL_INTERVAL);
}

export async function checkCredentialStatus(credentialId: string): Promise<Status> {
  const response = await fetch(STATUS_LIST_URL);
  const statusList = await response.json();
  
  // Bitstring decoding
  const bitIndex = deriveBitIndex(credentialId);
  const byteIndex = Math.floor(bitIndex / 8);
  const bitOffset = bitIndex % 8;
  
  const bit = (statusList.bitstring[byteIndex] >> bitOffset) & 1;
  return bit === 0 ? 'active' : 'revoked';
}
```

### Terminal Status Display

```typescript
// Tier indicators on wallet UI
type TerminalTier = 'terminal-1' | 'terminal-2' | 'terminal-3';

const terminalConfig = {
  'terminal-1': { color: '#dc2626', label: 'Revoked/Expired' },    // Red
  'terminal-2': { color: '#d97706', label: 'Suspended/Unverified' }, // Amber
  'terminal-3': { color: '#059669', label: 'Verified/Active' },     // Green
};
```

---

## Tier 4: Audit Logging

### Purpose
Immutable, zero-PII audit trail for all wallet operations.

### Implementation

```typescript
// lib/wallet/audit.ts
export async function logWalletAction(
  action: ActionType,
  metadata: ActionMetadata
): Promise<void> {
  const auditEntry = {
    id: crypto.randomUUID(),
    action,
    timestamp: new Date().toISOString(),
    did: holderDid,              // Anonymous identifier only
    credentialType: metadata.type,
    domain: metadata.domain,     // For cross-domain tracking
    // NO PII - no names, license numbers, or medical data
  };

  // Local IndexedDB
  await db.auditLog.add(auditEntry);

  // Sync to Supabase (if online)
  await supabase.from('wallet_audit_log').insert(auditEntry);
}
```

---

## Wallet Initialization Sequence

```typescript
// Wallet boot sequence on DOM load
async function initializeWallet() {
  // 1. Tier 1: Generate/retrieve hardware key
  const enclave = await generateEnclaveKey();
  setHolderDid(enclave.did);

  // 2. Tier 2: Initialize encrypted storage
  const storageKey = await initStorageKey(enclave.did);
  setStorageKey(storageKey);

  // 3. Build initial wallet state from Supabase
  const credentials = await buildInitialWalletState(enclave.did);
  
  // 4. Persist to encrypted storage
  for (const cred of credentials) {
    await storeCredential(storageKey, cred);
  }

  // 5. Start status polling
  startStatusPolling();

  // 6. Initialize audit logging
  initializeAuditLog();
}
```

---

## Domain-Specific Wallet Types

### pilotrecognition.com — Full Wallet
Enterprise features, full credential suite, ATS integration.

### pilotcareerpathways.com — Career Wallet
Job application focus, pathway matching, one-click sharing.

### pilotshortage.org — Anonymous Wallet
Zero-knowledge credentials, no PII, privacy-preserving.

---

## Security Considerations

| Threat | Mitigation |
|--------|------------|
| Key extraction | Non-extractable WebCrypto keys |
| Credential theft | AES-256-GCM encryption at rest |
| Revocation delay | 60-second polling with circuit breaker |
| Audit tampering | Immutable Supabase logs |
| Cross-site scripting | Strict CSP, no inline scripts |
| Replay attacks | Nonce-based VP generation |

---

## Related Documents

- [04-credential-issuance-flow.md](./04-credential-issuance-flow.md) — VC issuance pipeline
- [05-credential-status-management.md](./05-credential-status-management.md) — Revocation system
- [07-secure-enclave-architecture.md](./07-secure-enclave-architecture.md) — Deep dive on Tier 1

---

**Document Version:** 1.0  
**Last Updated:** June 2, 2026
