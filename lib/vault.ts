/**
 * vault.ts — Client-side AES-256-GCM encryption vault
 *
 * Architecture (hardened):
 *   pepper  = HMAC-SHA256(VAULT_MASTER_SECRET, google_sub)  ← server-side, JWT-gated
 *   keyMat  = pepper bytes (raw secret)
 *   salt    = SHA-256(google_sub)  ← deterministic, user-specific, not concatenated
 *   info    = "pilot-vault:v1:{google_sub}"
 *   vaultKey = HKDF-SHA256(keyMat, salt, info) → AES-256-GCM, non-extractable
 *
 * Properties:
 *   - Supabase stores only AES-GCM ciphertext + IV + version tag
 *   - Key requires BOTH: authenticated Google session AND server master secret
 *   - Key is non-extractable from browser memory (Web Crypto API)
 *   - IV is 96-bit random per encryption (AES-GCM spec)
 *   - GCM authentication tag validates integrity on every decrypt (tampering detected)
 *   - Key cleared from memory on logout
 *   - Pepper fetch fails hard — no silent plaintext fallback
 *   - Versioned ciphertext envelope supports future key rotation
 */

// ─── Current vault schema version ────────────────────────────────────────────
const VAULT_VERSION = 1;

// ─── Pepper Fetch ─────────────────────────────────────────────────────────────

async function fetchPepper(supabaseAccessToken: string): Promise<Uint8Array> {
  const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL
    || 'https://gkbhgrozrzhalnjherfu.supabase.co';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000); // 8s hard timeout

  let res: Response;
  try {
    res = await fetch(`${supabaseUrl}/functions/v1/vc-vault-key`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${supabaseAccessToken}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    throw new Error(`[vault] Pepper fetch failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (!data.pepper) throw new Error('[vault] Malformed pepper response');

  // Decode hex pepper to bytes
  const hex: string = data.pepper;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

// ─── Key Derivation ───────────────────────────────────────────────────────────

/**
 * Derive AES-256-GCM vault key using HKDF-SHA256.
 *
 * HKDF inputs (bank-grade separation):
 *   - Key material: pepper bytes (32 bytes of server HMAC output)
 *   - Salt: SHA-256(google_sub) — user-specific, deterministic, not secret
 *   - Info: domain-separated context string binding key to user + version
 *
 * The key is non-extractable from the browser.
 */
async function deriveVaultKey(googleSub: string, pepperBytes: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();

  // Key material = pepper (server HMAC output, 32 bytes)
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    pepperBytes,
    { name: 'HKDF' },
    false,
    ['deriveKey']
  );

  // Salt = SHA-256(googleSub) — domain-separated from info, user-specific
  const salt = new Uint8Array(
    await crypto.subtle.digest('SHA-256', encoder.encode(googleSub))
  );

  return crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt,
      info: encoder.encode(`pilot-vault:v${VAULT_VERSION}:${googleSub}`),
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,       // non-extractable — cannot be read out of browser memory
    ['encrypt', 'decrypt']
  );
}

// ─── Session Key Cache ────────────────────────────────────────────────────────
// Module-level variable cleared on logout and on HMR (dev only).
// Never serialised or persisted anywhere.

let _vaultKey: CryptoKey | null = null;

export function clearVaultKey(): void {
  _vaultKey = null;
}

export async function getVaultKey(
  googleSub: string,
  supabaseAccessToken: string
): Promise<CryptoKey> {
  if (_vaultKey) return _vaultKey;
  const pepperBytes = await fetchPepper(supabaseAccessToken);
  _vaultKey = await deriveVaultKey(googleSub, pepperBytes);
  return _vaultKey;
}

// ─── Encrypt / Decrypt ────────────────────────────────────────────────────────

export interface VaultEncrypted {
  iv: string;    // base64url — 96-bit random per encryption
  data: string;  // base64url — AES-256-GCM ciphertext + 128-bit GCM auth tag
  v: number;     // schema version — supports future key rotation
}

const b64url = {
  encode: (buf: ArrayBuffer | Uint8Array): string => {
    const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  },
  decode: (str: string): Uint8Array => {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
  },
};

export async function vaultEncrypt(
  plaintext: string,
  key: CryptoKey
): Promise<VaultEncrypted> {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV per NIST SP 800-38D

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, tagLength: 128 }, // 128-bit auth tag — maximum
    key,
    new TextEncoder().encode(plaintext)
  );

  return {
    iv: b64url.encode(iv),
    data: b64url.encode(ciphertext),
    v: VAULT_VERSION,
  };
}

export async function vaultDecrypt(
  encrypted: VaultEncrypted,
  key: CryptoKey
): Promise<string> {
  if (encrypted.v !== VAULT_VERSION) {
    throw new Error(`[vault] Unsupported vault version: ${encrypted.v}`);
  }

  const iv = b64url.decode(encrypted.iv);
  const data = b64url.decode(encrypted.data);

  // AES-GCM will throw DOMException if auth tag fails — tampering detected
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    key,
    data
  );

  return new TextDecoder().decode(plaintext);
}

// ─── Field-level helpers ──────────────────────────────────────────────────────

const VAULT_PREFIX = '{"iv":"'; // fast sentinel check

export async function encryptFields<T extends Record<string, any>>(
  record: T,
  sensitiveFields: (keyof T)[],
  key: CryptoKey
): Promise<T> {
  const result = { ...record };
  for (const field of sensitiveFields) {
    const value = record[field];
    if (value !== null && value !== undefined && value !== '') {
      const encrypted = await vaultEncrypt(String(value), key);
      (result as any)[field] = JSON.stringify(encrypted);
    }
  }
  return result;
}

/**
 * Decrypt sensitive fields.
 * - Encrypted fields (detected by VAULT_PREFIX) are decrypted and verified via GCM auth tag.
 * - Plaintext legacy fields are returned as-is (pre-vault pilots).
 * - If decryption fails (wrong key, tampered data), the field is set to null and an error is logged.
 *   It does NOT silently return the ciphertext blob as if it were plaintext.
 */
export async function decryptFields<T extends Record<string, any>>(
  record: T,
  sensitiveFields: (keyof T)[],
  key: CryptoKey
): Promise<T> {
  const result = { ...record };
  for (const field of sensitiveFields) {
    const value = record[field];
    if (typeof value === 'string' && value.startsWith(VAULT_PREFIX)) {
      try {
        const encrypted: VaultEncrypted = JSON.parse(value);
        (result as any)[field] = await vaultDecrypt(encrypted, key);
      } catch (err: any) {
        console.error(`[vault] Decrypt failed for field "${String(field)}":`, err.message);
        (result as any)[field] = null; // fail safe — return null, never ciphertext
      }
    }
  }
  return result;
}

// ─── Sensitive field definitions ─────────────────────────────────────────────

export const PROFILE_SENSITIVE_FIELDS = [
  'date_of_birth',
  'phone',
  'license_id',
  'license_expiry',
  'medical_class',
  'medical_expiry',
  'medical_country',
  'radio_license_expiry',
  'flight_school_address',
] as const;

export const PILOT_LICENSURE_SENSITIVE_FIELDS = [
  'date_of_birth',
  'contact_number',
  'license_number',
  'license_expiry',
  'medical_expiry',
  'medical_class',
  'radio_license_expiry',
] as const;
