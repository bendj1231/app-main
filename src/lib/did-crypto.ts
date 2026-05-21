/**
 * did-crypto.ts
 * Client-side DID cryptography using native browser Web Crypto API.
 * Zero cost, zero npm packages, runs on Vercel.
 *
 * Implements:
 * - JWS (JSON Web Signature) — pilot signs their own data
 * - ECDH-ES key agreement — encrypts data for a specific recipient's public key
 * - AES-GCM — symmetric encryption of the payload
 */

// ── Helpers ──────────────────────────────────────────────────────────────────

function base64url(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64urlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '='));
  return new Uint8Array([...bin].map(c => c.charCodeAt(0)));
}

// ── Key Management ────────────────────────────────────────────────────────────

export interface PilotKeyPair {
  signingKey: CryptoKeyPair;       // ECDSA P-256 — for signing (JWS)
  encryptionKey: CryptoKeyPair;    // ECDH P-256 — for encryption (JWE)
  publicSigningJwk: JsonWebKey;
  publicEncryptionJwk: JsonWebKey;
}

export async function generatePilotKeys(): Promise<PilotKeyPair> {
  const [signingKey, encryptionKey] = await Promise.all([
    crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']),
    crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveKey']),
  ]);

  const [publicSigningJwk, publicEncryptionJwk] = await Promise.all([
    crypto.subtle.exportKey('jwk', signingKey.publicKey),
    crypto.subtle.exportKey('jwk', encryptionKey.publicKey),
  ]);

  return { signingKey, encryptionKey, publicSigningJwk, publicEncryptionJwk };
}

export async function exportPrivateKeys(keys: PilotKeyPair): Promise<{ signingPrivateJwk: JsonWebKey; encryptionPrivateJwk: JsonWebKey }> {
  const [signingPrivateJwk, encryptionPrivateJwk] = await Promise.all([
    crypto.subtle.exportKey('jwk', keys.signingKey.privateKey),
    crypto.subtle.exportKey('jwk', keys.encryptionKey.privateKey),
  ]);
  return { signingPrivateJwk, encryptionPrivateJwk };
}

export async function importEncryptionPublicKey(jwk: JsonWebKey): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'jwk', jwk,
    { name: 'ECDH', namedCurve: 'P-256' },
    false, []
  );
}

export async function importSigningPrivateKey(jwk: JsonWebKey): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'jwk', jwk,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false, ['sign']
  );
}

export async function importEncryptionPrivateKey(jwk: JsonWebKey): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'jwk', jwk,
    { name: 'ECDH', namedCurve: 'P-256' },
    false, ['deriveKey']
  );
}

// ── JWS — Sign data (Pilot proves they wrote it) ─────────────────────────────

export async function signPayload(
  payload: Record<string, unknown>,
  signingPrivateKey: CryptoKey,
  issuerDid: string
): Promise<string> {
  const header = { alg: 'ES256', typ: 'JWT', kid: issuerDid };
  const headerB64 = base64url(new TextEncoder().encode(JSON.stringify(header)).buffer as ArrayBuffer);
  const payloadB64 = base64url(new TextEncoder().encode(JSON.stringify(payload)).buffer as ArrayBuffer);
  const signingInput = `${headerB64}.${payloadB64}`;

  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    signingPrivateKey,
    new TextEncoder().encode(signingInput).buffer as ArrayBuffer
  );

  return `${signingInput}.${base64url(signature)}`;
}

export async function verifySignature(
  jwt: string,
  signingPublicJwk: JsonWebKey
): Promise<{ valid: boolean; payload?: Record<string, unknown> }> {
  try {
    const parts = jwt.split('.');
    if (parts.length !== 3) return { valid: false };

    const signingInput = `${parts[0]}.${parts[1]}`;
    const signature = base64urlDecode(parts[2]);

    const publicKey = await crypto.subtle.importKey(
      'jwk', signingPublicJwk,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false, ['verify']
    );

    const valid = await crypto.subtle.verify(
      { name: 'ECDSA', hash: 'SHA-256' },
      publicKey,
      signature.buffer as ArrayBuffer,
      new TextEncoder().encode(signingInput).buffer as ArrayBuffer
    );

    if (!valid) return { valid: false };

    const payload = JSON.parse(new TextDecoder().decode(base64urlDecode(parts[1])));
    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

// ── JWE — Encrypt for recipient (only they can decrypt) ──────────────────────

export interface EncryptedPackage {
  protected: string;    // base64url header
  encrypted_key: string;
  iv: string;
  ciphertext: string;
  tag: string;
  sender_did: string;
  recipient_did: string;
}

export async function encryptForRecipient(
  payload: Record<string, unknown>,
  recipientPublicJwk: JsonWebKey,
  senderDid: string,
  recipientDid: string
): Promise<EncryptedPackage> {
  // ECDH-ES: derive shared secret from recipient's public key + ephemeral private key
  const ephemeralKey = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveKey']
  );
  const recipientPubKey = await importEncryptionPublicKey(recipientPublicJwk);

  const sharedKey = await crypto.subtle.deriveKey(
    { name: 'ECDH', public: recipientPubKey },
    ephemeralKey.privateKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintextBytes = new TextEncoder().encode(JSON.stringify(payload));

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    sharedKey,
    plaintextBytes.buffer as ArrayBuffer
  );

  const ephemeralPublicJwk = await crypto.subtle.exportKey('jwk', ephemeralKey.publicKey);

  const header = {
    alg: 'ECDH-ES',
    enc: 'A256GCM',
    epk: ephemeralPublicJwk,
    kid: recipientDid,
  };

  // Split ciphertext and tag (last 16 bytes)
  const cipherBytes = new Uint8Array(encrypted);
  const ciphertext = cipherBytes.slice(0, -16);
  const tag = cipherBytes.slice(-16);

  return {
    protected: base64url(new TextEncoder().encode(JSON.stringify(header)).buffer as ArrayBuffer),
    encrypted_key: '',
    iv: base64url(iv.buffer as ArrayBuffer),
    ciphertext: base64url(ciphertext.buffer as ArrayBuffer),
    tag: base64url(tag.buffer as ArrayBuffer),
    sender_did: senderDid,
    recipient_did: recipientDid,
  };
}

export async function decryptFromSender(
  pkg: EncryptedPackage,
  recipientPrivateJwk: JsonWebKey
): Promise<Record<string, unknown>> {
  const header = JSON.parse(
    new TextDecoder().decode(base64urlDecode(pkg.protected))
  );

  const recipientPrivateKey = await importEncryptionPrivateKey(recipientPrivateJwk);
  const ephemeralPublicKey = await importEncryptionPublicKey(header.epk);

  const sharedKey = await crypto.subtle.deriveKey(
    { name: 'ECDH', public: ephemeralPublicKey },
    recipientPrivateKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  const iv = base64urlDecode(pkg.iv);
  const ciphertext = base64urlDecode(pkg.ciphertext);
  const tag = base64urlDecode(pkg.tag);

  // Recombine ciphertext + tag for AES-GCM
  const combined = new Uint8Array(ciphertext.length + tag.length);
  combined.set(ciphertext);
  combined.set(tag, ciphertext.length);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer },
    sharedKey,
    combined.buffer as ArrayBuffer
  );

  return JSON.parse(new TextDecoder().decode(decrypted));
}

// ── Verification Request Builder ──────────────────────────────────────────────

export interface VerificationRequest {
  signedJwt: string;
  encryptedPackage: EncryptedPackage;
  senderDid: string;
  recipientDid: string;
}

export async function buildVerificationRequest(
  pilotData: Record<string, unknown>,
  pilotSigningPrivateJwk: JsonWebKey,
  pilotEncryptionPrivateJwk: JsonWebKey,
  pilotDid: string,
  recipientPublicEncryptionJwk: JsonWebKey,
  recipientDid: string
): Promise<VerificationRequest> {
  const signingKey = await importSigningPrivateKey(pilotSigningPrivateJwk);

  // Step 1: Pilot signs their own data (proves authorship)
  const signedJwt = await signPayload(
    { ...pilotData, iss: pilotDid, iat: Math.floor(Date.now() / 1000) },
    signingKey,
    pilotDid
  );

  // Step 2: Encrypt the signed JWT for the recipient only
  const encryptedPackage = await encryptForRecipient(
    { signedJwt, senderDid: pilotDid },
    recipientPublicEncryptionJwk,
    pilotDid,
    recipientDid
  );

  return { signedJwt, encryptedPackage, senderDid: pilotDid, recipientDid };
}
