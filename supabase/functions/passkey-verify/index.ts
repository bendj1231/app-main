/// <reference lib="deno.ns" />
/**
 * passkey-verify — Server-side WebAuthn assertion verification
 *
 * Flow:
 *   1. Browser calls navigator.credentials.get() with challenge from /passkey-challenge
 *   2. Device signs the challenge with the private key (Face ID / fingerprint / PIN)
 *   3. Browser POSTs assertion to this function
 *   4. This function:
 *      a. Fetches the stored public key from pilot_passkeys by credential_id
 *      b. Verifies the authenticatorData and clientDataJSON structure
 *      c. Verifies the signature over (authenticatorData || clientDataHash) using stored public key
 *      d. Checks sign_count to prevent replay attacks
 *      e. Returns { verified: true, userId } if valid
 *
 * Security properties:
 *   - Private key never leaves device hardware
 *   - Challenge is single-use (stored in pilot_passkey_challenges, deleted on use)
 *   - Sign count monotonically increases (replay protection)
 *   - COSE public key verification uses SubtleCrypto (no external deps)
 *   - verify_jwt: false — this function bootstraps auth, so no JWT required on entry
 *     but it validates the WebAuthn assertion cryptographically instead
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RP_ID = Deno.env.get('PASSKEY_RP_ID') || 'pilotrecognition.com';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ── Helpers ──────────────────────────────────────────────────────────────────

function base64urlToBuffer(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
  const binary = atob(padded);
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) buffer[i] = binary.charCodeAt(i);
  return buffer;
}

function bufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Parse a COSE-encoded EC public key (alg -7 = ES256) into SubtleCrypto format.
 * COSE key map for EC2: { 1: kty=2, 3: alg=-7, -1: crv=1(P-256), -2: x, -3: y }
 */
async function importCosePublicKey(coseBytes: Uint8Array): Promise<CryptoKey> {
  // COSE is CBOR-encoded. For ES256 (alg -7, P-256), we extract x and y coordinates.
  // We use a simple CBOR decoder for the specific structure we registered.
  // The key is always a CBOR map with integer keys.
  
  // Convert COSE key to JWK for SubtleCrypto import
  // We parse the raw COSE bytes manually for the EC2 key type
  const coseKey = parseCborMap(coseBytes);
  
  // COSE EC2 key: -2 = x, -3 = y, -1 = crv (1 = P-256)
  const x = coseKey.get(-2);
  const y = coseKey.get(-3);
  
  if (!x || !y) throw new Error('Invalid COSE key: missing x or y coordinates');

  const jwk = {
    kty: 'EC',
    crv: 'P-256',
    x: bufferToBase64url(x),
    y: bufferToBase64url(y),
    ext: true,
  };

  return crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['verify']
  );
}

/**
 * Minimal CBOR map parser for WebAuthn COSE keys.
 * Handles only the subset needed: integer keys, byte strings, integers.
 */
function parseCborMap(data: Uint8Array): Map<number, Uint8Array | number> {
  const map = new Map<number, Uint8Array | number>();
  let offset = 0;

  const readByte = () => data[offset++];
  const readUint = (info: number): number => {
    if (info < 24) return info;
    if (info === 24) return readByte();
    if (info === 25) { const v = (data[offset] << 8) | data[offset + 1]; offset += 2; return v; }
    throw new Error('Unsupported CBOR uint size');
  };

  const readValue = (): Uint8Array | number => {
    const byte = readByte();
    const major = byte >> 5;
    const info = byte & 0x1f;

    if (major === 0) return readUint(info);           // unsigned int
    if (major === 1) return -(readUint(info) + 1);    // negative int
    if (major === 2) {                                 // byte string
      const len = readUint(info);
      const bytes = data.slice(offset, offset + len);
      offset += len;
      return bytes;
    }
    throw new Error(`Unsupported CBOR major type: ${major}`);
  };

  // First byte: map header
  const byte = readByte();
  const major = byte >> 5;
  const info = byte & 0x1f;
  if (major !== 5) throw new Error('Expected CBOR map');
  const count = readUint(info);

  for (let i = 0; i < count; i++) {
    const key = readValue() as number;
    const value = readValue();
    map.set(key, value as Uint8Array);
  }

  return map;
}

/**
 * Verify the WebAuthn assertion signature.
 * signature is over: SHA-256(clientDataJSON) concatenated with authenticatorData
 */
async function verifyAssertion(
  publicKeyBytes: Uint8Array,
  authenticatorData: Uint8Array,
  clientDataJSON: Uint8Array,
  signatureBytes: Uint8Array,
): Promise<boolean> {
  const publicKey = await importCosePublicKey(publicKeyBytes);

  // clientDataHash = SHA-256(clientDataJSON)
  const clientDataHash = await crypto.subtle.digest('SHA-256', clientDataJSON);

  // Signed data = authenticatorData || clientDataHash
  const signedData = new Uint8Array(authenticatorData.length + 32);
  signedData.set(authenticatorData, 0);
  signedData.set(new Uint8Array(clientDataHash), authenticatorData.length);

  // WebAuthn signatures use DER-encoded ECDSA — SubtleCrypto expects raw r||s (64 bytes)
  const rawSignature = derToRaw(signatureBytes);

  return crypto.subtle.verify(
    { name: 'ECDSA', hash: 'SHA-256' },
    publicKey,
    rawSignature,
    signedData,
  );
}

/**
 * Convert DER-encoded ECDSA signature to raw r||s format (64 bytes for P-256).
 */
function derToRaw(der: Uint8Array): Uint8Array {
  // DER: 0x30 [total-len] 0x02 [r-len] [r] 0x02 [s-len] [s]
  let offset = 2; // skip 0x30 and total length
  offset++; // skip 0x02
  const rLen = der[offset++];
  const r = der.slice(offset, offset + rLen);
  offset += rLen;
  offset++; // skip 0x02
  const sLen = der[offset++];
  const s = der.slice(offset, offset + sLen);

  // Pad or trim r and s to 32 bytes each
  const pad = (arr: Uint8Array, len: number): Uint8Array => {
    if (arr.length === len) return arr;
    if (arr.length > len) return arr.slice(arr.length - len); // trim leading zeros
    const padded = new Uint8Array(len);
    padded.set(arr, len - arr.length);
    return padded;
  };

  const raw = new Uint8Array(64);
  raw.set(pad(r, 32), 0);
  raw.set(pad(s, 32), 32);
  return raw;
}

// ── Main Handler ──────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
import { getCorsHeaders } from '../_shared/cors.ts';
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { credentialId, authenticatorData, clientDataJSON, signature, userHandle } = body;

    if (!credentialId || !authenticatorData || !clientDataJSON || !signature) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── 1. Fetch stored passkey record ──────────────────────────────────────
    const { data: passkey, error: pkError } = await supabase
      .from('pilot_passkeys')
      .select('id, user_id, public_key, sign_count')
      .eq('credential_id', credentialId)
      .single();

    if (pkError || !passkey) {
      return new Response(JSON.stringify({ error: 'Passkey not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── 2. Decode assertion components ─────────────────────────────────────
    const authDataBytes = base64urlToBuffer(authenticatorData);
    const clientDataBytes = base64urlToBuffer(clientDataJSON);
    const sigBytes = base64urlToBuffer(signature);

    // ── 3. Validate clientDataJSON ──────────────────────────────────────────
    const clientData = JSON.parse(new TextDecoder().decode(clientDataBytes));

    if (clientData.type !== 'webauthn.get') {
      return new Response(JSON.stringify({ error: 'Invalid clientData type' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate origin
    const expectedOrigins = [
      `https://${RP_ID}`,
      `https://www.${RP_ID}`,
      'http://localhost:5173',
      'http://localhost:3000',
    ];
    if (!expectedOrigins.includes(clientData.origin)) {
      return new Response(JSON.stringify({ error: 'Invalid origin', got: clientData.origin }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── 4. Validate challenge against stored challenge ──────────────────────
    const { data: challengeRow, error: challengeErr } = await supabase
      .from('pilot_passkey_challenges')
      .select('challenge, expires_at')
      .eq('credential_id', credentialId)
      .single();

    if (challengeErr || !challengeRow) {
      return new Response(JSON.stringify({ error: 'Challenge not found or expired' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (new Date(challengeRow.expires_at) < new Date()) {
      await supabase.from('pilot_passkey_challenges').delete().eq('credential_id', credentialId);
      return new Response(JSON.stringify({ error: 'Challenge expired' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (clientData.challenge !== challengeRow.challenge) {
      return new Response(JSON.stringify({ error: 'Challenge mismatch' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Delete challenge immediately (single-use)
    await supabase.from('pilot_passkey_challenges').delete().eq('credential_id', credentialId);

    // ── 5. Validate authenticatorData ──────────────────────────────────────
    // Bytes 0-31: rpIdHash, byte 32: flags, bytes 33-36: signCount
    const rpIdHash = authDataBytes.slice(0, 32);
    const flags = authDataBytes[32];
    const signCount = new DataView(authDataBytes.buffer).getUint32(33, false);

    // Verify RP ID hash
    const expectedRpIdHash = new Uint8Array(
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(RP_ID))
    );
    const rpIdMatch = rpIdHash.every((b, i) => b === expectedRpIdHash[i]);
    if (!rpIdMatch) {
      return new Response(JSON.stringify({ error: 'RP ID hash mismatch' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check user presence (UP flag, bit 0) and user verification (UV flag, bit 2)
    const UP = (flags & 0x01) !== 0;
    const UV = (flags & 0x04) !== 0;
    if (!UP || !UV) {
      return new Response(JSON.stringify({ error: 'User verification required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── 6. Replay attack prevention ─────────────────────────────────────────
    if (signCount > 0 && signCount <= passkey.sign_count) {
      // Sign count did not increase — possible cloned authenticator
      console.error(`[passkey-verify] Sign count replay: stored=${passkey.sign_count} received=${signCount} user=${passkey.user_id}`);
      return new Response(JSON.stringify({ error: 'Sign count replay detected' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── 7. Verify signature ──────────────────────────────────────────────────
    // public_key stored as integer array from browser registration
    const publicKeyBytes = new Uint8Array(passkey.public_key);

    const valid = await verifyAssertion(publicKeyBytes, authDataBytes, clientDataBytes, sigBytes);

    if (!valid) {
      return new Response(JSON.stringify({ error: 'Signature verification failed' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── 8. Update sign count ─────────────────────────────────────────────────
    await supabase
      .from('pilot_passkeys')
      .update({ sign_count: signCount, last_used_at: new Date().toISOString() })
      .eq('id', passkey.id);

    // ── 9. Return success with userId ────────────────────────────────────────
    // The client uses this userId to call Auth0 silently or use existing session.
    // Auth0 remains the session authority — passkey is an additional verification layer.
    return new Response(JSON.stringify({
      verified: true,
      userId: passkey.user_id,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('[passkey-verify] Error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error', detail: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
