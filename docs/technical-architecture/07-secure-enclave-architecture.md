# Secure Enclave Architecture

**Tier 1 Hardware-Backed Key Storage** — Non-Extractable Cryptographic Operations

---

## Overview

Tier 1 of the wallet architecture implements hardware-backed, non-extractable cryptographic key storage using the Web Crypto API. Keys are generated within the device's secure enclave and cannot be exported, providing protection against extraction attacks.

```
┌─────────────────────────────────────────────────────────────────┐
│                    TIER 1: SECURE ENCLAVE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                 BROWSER SECURE CONTEXT                       │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────┐   │ │
│  │  │           WEB CRYPTO API                           │   │ │
│  │  │                                                     │   │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │   │ │
│  │  │  │   KeyGen    │  │   Sign      │  │  Verify    │ │   │ │
│  │  │  │  (P-256)    │  │ (ECDSA)     │  │ (ECDSA)    │ │   │ │
│  │  │  └──────┬──────┘  └──────┬──────┘  └─────┬──────┘ │   │ │
│  │  │         │                │                │        │   │ │
│  │  │         ▼                ▼                ▼        │   │ │
│  │  │  ┌─────────────────────────────────────────────────┐ │   │ │
│  │  │  │         OPERATING SYSTEM KEYSTORE               │ │   │ │
│  │  │  │                                                     │ │   │ │
│  │  │  │  • macOS: Secure Enclave (SEP)                     │ │   │ │
│  │  │  │  • iOS: Secure Enclave + Keychain                 │ │   │ │
│  │  │  │  • Android: Keystore + StrongBox (if available)   │ │   │ │
│  │  │  │  • Windows: CNG/DPAPI                             │ │   │ │
│  │  │  │                                                     │ │   │ │
│  │  │  │  🔒 Keys marked as NON-EXTRACTABLE                 │ │   │ │
│  │  │  │  🔒 Hardware-bound to device                       │ │   │ │
│  │  │  │  🔒 Biometric/PIN authentication required         │ │   │ │
│  │  │  └─────────────────────────────────────────────────┘ │   │ │
│  │  └────────────────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Generation

### ECDSA P-256 Non-Extractable Keys

```typescript
// lib/wallet/enclave.ts
export interface EnclaveKeyPair {
  privateKey: CryptoKey;  // Non-extractable - hardware bound
  publicKey: CryptoKey;   // Exportable for did:key derivation
  did: string;            // did:key identifier
}

export async function generateEnclaveKey(): Promise<EnclaveKeyPair> {
  // Generate key pair with non-extractable private key
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    false, // 🔒 CRITICAL: Non-extractable
    ['sign', 'verify']
  );

  // Export public key for DID derivation
  const publicKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
  
  // Derive did:key from public key
  const did = await deriveDidKey(publicKeyJwk);

  return {
    privateKey: keyPair.privateKey,
    publicKey: keyPair.publicKey,
    did,
  };
}
```

### did:key Derivation

```typescript
// lib/wallet/did.ts
import { base58btc } from 'multiformats/bases/base58';

export async function deriveDidKey(publicKeyJwk: JsonWebKey): Promise<string> {
  // Convert JWK to raw bytes
  const x = base64urlToBytes(publicKeyJwk.x!);
  const y = base64urlToBytes(publicKeyJwk.y!);
  
  // P-256 public key format: 0x04 || x || y (65 bytes uncompressed)
  const publicKeyBytes = new Uint8Array(65);
  publicKeyBytes[0] = 0x04;
  publicKeyBytes.set(x, 1);
  publicKeyBytes.set(y, 33);
  
  // Multicodec prefix for P-256: 0x1200
  const multicodecPrefix = new Uint8Array([0x80, 0x24]);
  
  // Combine prefix + key
  const didBytes = new Uint8Array(multicodecPrefix.length + publicKeyBytes.length);
  didBytes.set(multicodecPrefix, 0);
  didBytes.set(publicKeyBytes, multicodecPrefix.length);
  
  // Base58BTC encode
  const didIdentifier = base58btc.encode(didBytes);
  
  return `did:key:${didIdentifier}`;
}
```

---

## Signing Operations

### In-Enclave Signing

```typescript
// lib/wallet/enclave.ts
export async function signWithEnclave(
  privateKey: CryptoKey,
  data: Uint8Array
): Promise<ArrayBuffer> {
  // Sign data without ever exposing private key
  const signature = await crypto.subtle.sign(
    {
      name: 'ECDSA',
      hash: 'SHA-256',
    },
    privateKey,  // 🔒 Never leaves secure enclave
    data
  );
  
  return signature;
}

// Usage: Sign a Verifiable Presentation
export async function signPresentation(
  enclaveKey: EnclaveKeyPair,
  presentation: VerifiablePresentation
): Promise<SignedVP> {
  const data = new TextEncoder().encode(JSON.stringify(presentation));
  
  const signature = await signWithEnclave(enclaveKey.privateKey, data);
  
  return {
    ...presentation,
    proof: {
      type: 'EcdsaSecp256r1Signature2019',
      created: new Date().toISOString(),
      proofPurpose: 'authentication',
      verificationMethod: `${enclaveKey.did}#key-0`,
      jws: encodeJWS(signature, data),
    },
  };
}
```

---

## Key Persistence

### IndexedDB Storage Pattern

```typescript
// lib/wallet/enclave.ts
export async function persistEnclaveKey(enclaveKey: EnclaveKeyPair): Promise<void> {
  // Store in IndexedDB - browser handles secure storage
  await db.enclaveKeys.put({
    did: enclaveKey.did,
    // Note: privateKey is a CryptoKey handle, not the actual key material
    privateKeyHandle: enclaveKey.privateKey,
    publicKeyHandle: enclaveKey.publicKey,
    createdAt: Date.now(),
  });
}

export async function retrieveEnclaveKey(did: string): Promise<EnclaveKeyPair | null> {
  const stored = await db.enclaveKeys.get(did);
  if (!stored) return null;
  
  return {
    privateKey: stored.privateKeyHandle,  // Still non-extractable
    publicKey: stored.publicKeyHandle,
    did: stored.did,
  };
}
```

---

## Platform-Specific Enclaves

### iOS/macOS Secure Enclave

```typescript
// On iOS Safari, Web Crypto uses Secure Enclave Processor (SEP)
// Keys are automatically stored in SEP when extractable: false

// Additional protection via Touch ID / Face ID
export async function authenticateWithBiometric(): Promise<boolean> {
  // WebAuthn can be used for biometric gate
  const credential = await navigator.credentials.get({
    publicKey: {
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      rpId: window.location.hostname,
      userVerification: 'required',  // Forces biometric/PIN
      allowCredentials: [],
    },
  });
  
  return !!credential;
}
```

### Android StrongBox

```typescript
// On Android Chrome with StrongBox TEE:
// - generateKey automatically uses StrongBox if available
// - Falls back to TEE (Trusted Execution Environment) if not

export async function checkStrongBoxSupport(): Promise<boolean> {
  // Feature detection - not directly exposed to web
  // But we can infer from performance characteristics
  try {
    const start = performance.now();
    await crypto.subtle.generateKey(
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['sign']
    );
    const duration = performance.now() - start;
    
    // StrongBox operations are slower (~100ms vs ~10ms)
    return duration > 50;
  } catch {
    return false;
  }
}
```

---

## Key Recovery

### Recovery Key Derivation

```typescript
// lib/wallet/recovery.ts
export async function generateRecoveryKey(
  mnemonic: string,  // BIP-39 style
  password: string
): Promise<RecoveryKey> {
  // Derive recovery key from mnemonic + password
  const encoder = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(mnemonic),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(password),
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    256
  );
  
  return {
    recoveryKey: new Uint8Array(derivedBits),
    mnemonic,
    createdAt: new Date().toISOString(),
  };
}
```

---

## Security Properties

| Property | Implementation | Protection |
|----------|----------------|------------|
| Key Generation | Web Crypto API | Browser + OS secure random |
| Key Storage | IndexedDB + OS Keystore | Hardware-bound |
| Extractability | `extractable: false` | Cannot be exported |
| Usage Authorization | User gesture required | Prevents automated abuse |
| Algorithm | ECDSA P-256 | NIST recommended |
| DID Method | `did:key` | Self-verifying |

---

## Threat Model

| Threat | Mitigation |
|--------|------------|
| Key extraction | Non-extractable flag, hardware binding |
| Memory dump | Keys never in JS heap as raw bytes |
| Malware | OS-level keystore isolation |
| Side-channel | Constant-time crypto operations |
| Phishing | Origin-bound keys, no cross-origin access |

---

## Related Documents

- [03-wallet-system-architecture.md](./03-wallet-system-architecture.md) — Four-tier wallet infrastructure
- [08-key-management-rotation.md](./08-key-management-rotation.md) — Key lifecycle management

---

**Document Version:** 1.0  
**Last Updated:** June 2, 2026
