/**
 * PilotRecognition Wallet — Tier 1: Hardware Security Module Shim
 *
 * Abstracts the signing boundary between the application layer and
 * the hardware-bound key store. The private key NEVER leaves this module.
 *
 * Platform routing:
 *   Native (iOS)     → SecureEnclave + CryptoKit (Ed25519), requires biometric auth
 *   Native (Android) → Android Keystore (ECDSA P-256), StrongBox if available
 *   Web (this file)  → Web Crypto API, ECDSA P-256 / non-extractable CryptoKey
 *                      The key is marked extractable:false — browser cannot export it.
 *                      Persistence: stored as opaque handle in IndexedDB (STORE_ENCLAVE).
 *
 * DID Method: did:key (multibase base58btc encoded compressed public key)
 * Spec: https://w3c-ccg.github.io/did-method-key/
 *
 * In the React Native migration phase, this module's sign() and getDid() interfaces
 * remain identical — only the internal platform branch changes.
 */

const STORE_ENCLAVE = 'pr_enclave_v1';
const KEY_HANDLE_ID = 'master_signing_key';

// ─────────────────────────────────────────────────────────────
// KEY PERSISTENCE — IndexedDB opaque handle
// The CryptoKey object itself is stored (non-extractable).
// The raw private bytes never appear in memory outside the browser engine.
// ─────────────────────────────────────────────────────────────

function openEnclaveDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(STORE_ENCLAVE, 1);
    req.onupgradeneeded = (e) => {
      (e.target as IDBOpenDBRequest).result.createObjectStore('keys', { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

async function saveKeyPair(kp: CryptoKeyPair): Promise<void> {
  const db = await openEnclaveDb();
  await new Promise<void>((resolve, reject) => {
    const tx  = db.transaction('keys', 'readwrite');
    tx.objectStore('keys').put({ id: KEY_HANDLE_ID, privateKey: kp.privateKey, publicKey: kp.publicKey });
    tx.oncomplete = () => resolve();
    tx.onerror    = () => reject(tx.error);
  });
}

async function loadKeyPair(): Promise<CryptoKeyPair | null> {
  const db = await openEnclaveDb();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction('keys', 'readonly');
    const req = tx.objectStore('keys').get(KEY_HANDLE_ID);
    req.onsuccess = () => {
      const r = req.result as { privateKey: CryptoKey; publicKey: CryptoKey } | undefined;
      resolve(r ? { privateKey: r.privateKey, publicKey: r.publicKey } : null);
    };
    req.onerror = () => reject(req.error);
  });
}

// ─────────────────────────────────────────────────────────────
// KEY GENERATION
// Algorithm: ECDSA P-256 (Web Crypto) → maps to P-256 did:key multicodec 0x1200
// extractable: false on privateKey — browser engine enforces non-exportability
// ─────────────────────────────────────────────────────────────

export async function generateEnclaveKey(): Promise<void> {
  const existing = await loadKeyPair();
  if (existing) return; // idempotent — never overwrite an existing key

  const kp = await crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,       // extractable: FALSE — private key cannot be exported
    ['sign', 'verify'],
  );
  await saveKeyPair(kp);
}

// ─────────────────────────────────────────────────────────────
// DID:KEY DERIVATION
// Encodes the compressed P-256 public key as a did:key multibase identifier.
// Format: did:key:z<base58btc(multicodec_prefix + compressed_pubkey)>
// ─────────────────────────────────────────────────────────────

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function toBase58(bytes: Uint8Array): string {
  let num = BigInt('0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(''));
  let result = '';
  const base = BigInt(58);
  while (num > 0n) {
    result = BASE58_ALPHABET[Number(num % base)] + result;
    num = num / base;
  }
  for (const b of bytes) {
    if (b !== 0) break;
    result = '1' + result;
  }
  return result;
}

function compressP256(rawPublicKey: ArrayBuffer): Uint8Array {
  // Raw P-256 public key = 04 | x (32 bytes) | y (32 bytes)
  const bytes = new Uint8Array(rawPublicKey);
  const x = bytes.slice(1, 33);
  const y = bytes.slice(33, 65);
  const prefix = (y[31] & 1) === 0 ? 0x02 : 0x03;
  return new Uint8Array([prefix, ...x]);
}

export async function getHolderDid(): Promise<string> {
  const kp = await loadKeyPair();
  if (!kp) throw new Error('Enclave key not initialised — call generateEnclaveKey() first');

  const rawPub  = await crypto.subtle.exportKey('raw', kp.publicKey);
  const compressed = compressP256(rawPub);

  // Multicodec prefix for P-256 public key: 0x1200 (varint encoded)
  const multicodec = new Uint8Array([0x80, 0x24, ...compressed]);
  const encoded    = toBase58(multicodec);
  return `did:key:z${encoded}`;
}

// ─────────────────────────────────────────────────────────────
// SIGNING — application requests signature, enclave executes
// The application passes the payload bytes; the private key never leaves.
// In native build: replaced by SecureEnclave.sign() which requires biometric auth.
// ─────────────────────────────────────────────────────────────

export async function enclaveSign(payloadBytes: Uint8Array): Promise<string> {
  const kp = await loadKeyPair();
  if (!kp) throw new Error('Enclave key not initialised');

  const sigBuf = await crypto.subtle.sign(
    { name: 'ECDSA', hash: { name: 'SHA-256' } },
    kp.privateKey,
    payloadBytes.buffer as ArrayBuffer,
  );

  return btoa(String.fromCharCode(...new Uint8Array(sigBuf)));
}

/**
 * Sign a W3C DataIntegrityProof payload.
 * The input is the canonicalized credential JSON (JSON-LD normalised).
 * Returns the base64-encoded DER signature to be placed in proofValue.
 */
export async function signCredentialPayload(canonicalJson: string): Promise<string> {
  const encoded = new TextEncoder().encode(canonicalJson);
  return enclaveSign(encoded);
}

// ─────────────────────────────────────────────────────────────
// VERIFY — check an inbound signature against a known public key JWK
// Used when validating issuer signatures on imported VCs
// ─────────────────────────────────────────────────────────────

export async function verifySignature(
  payloadBytes: Uint8Array,
  signatureBase64: string,
  issuerPublicKeyJwk: JsonWebKey,
): Promise<boolean> {
  try {
    const pubKey = await crypto.subtle.importKey(
      'jwk',
      issuerPublicKeyJwk,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['verify'],
    );
    const sigBytes = Uint8Array.from(atob(signatureBase64), c => c.charCodeAt(0));
    return crypto.subtle.verify(
      { name: 'ECDSA', hash: { name: 'SHA-256' } },
      pubKey,
      sigBytes.buffer as ArrayBuffer,
      payloadBytes.buffer as ArrayBuffer,
    );
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// BIOMETRIC AUTH GATE (web shim)
// On native: gates every sign() call behind FaceID / TouchID.
// On web: no-op — replaced in the React Native migration.
// Returns true if the user is authorised to request a signature.
// ─────────────────────────────────────────────────────────────

export async function requestBiometricAuth(): Promise<boolean> {
  // Web platform — no hardware biometric API available.
  // In React Native: replaced by LocalAuthentication.authenticateAsync()
  // For now, treat the session as implicitly authenticated (the user logged in via Supabase auth).
  return true;
}

// ─────────────────────────────────────────────────────────────
// ENCLAVE STATUS
// ─────────────────────────────────────────────────────────────

export interface EnclaveStatus {
  keyPresent: boolean;
  holderDid: string | null;
  platform: 'web-crypto' | 'ios-secure-enclave' | 'android-keystore';
  biometricAvailable: boolean;
  extractable: false;
}

export async function getEnclaveStatus(): Promise<EnclaveStatus> {
  const kp = await loadKeyPair();
  let did: string | null = null;
  if (kp) {
    try { did = await getHolderDid(); } catch { did = null; }
  }
  return {
    keyPresent:          !!kp,
    holderDid:           did,
    platform:            'web-crypto',
    biometricAvailable:  false,
    extractable:         false,
  };
}

// ─────────────────────────────────────────────────────────────
// ENCLAVE WIPE — called on Identity Fraud Reset (AV3)
// Deletes the key handle from IndexedDB.
// The credential database (storage.ts wipeLocalWallet) must be called separately.
// ─────────────────────────────────────────────────────────────

export async function wipeEnclaveKey(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase(STORE_ENCLAVE);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}
