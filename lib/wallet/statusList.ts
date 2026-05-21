/**
 * PilotRecognition Wallet — Bitstring Status List Worker
 *
 * Implements W3C Bitstring Status List v1.0
 * https://www.w3.org/TR/vc-bitstring-status-list/
 *
 * Poll interval: 60 seconds (matches S3.5(b) Emergency Revocation Protocol)
 * Bit 0 = valid/active
 * Bit 1 = revoked/suspended (circuit-breaker trips)
 *
 * This module runs purely client-side. It fetches the compressed bitstring
 * from the platform's did:web-hosted status list endpoint, decompresses it
 * (DecompressionStream GZIP, matching BitstringStatusListExpansionAlgorithm.kt),
 * and reads individual bit positions for each credential slot.
 */

import { BitstringStatusResult, BitstringStatusListCredential } from './types/schemas';

const POLL_INTERVAL_MS = 60_000;

// ─────────────────────────────────────────────────────────────
// GZIP DECOMPRESSION (Web Streams API — available in all modern browsers)
// ─────────────────────────────────────────────────────────────

async function decompressGzip(compressed: Uint8Array): Promise<Uint8Array> {
  const ds = new DecompressionStream('gzip');
  const writer = ds.writable.getWriter();
  const reader = ds.readable.getReader();

  writer.write(compressed.buffer as ArrayBuffer);
  writer.close();

  const chunks: Uint8Array[] = [];
  let done = false;
  while (!done) {
    const { value, done: d } = await reader.read();
    if (value) chunks.push(value);
    done = d;
  }

  const total = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

// ─────────────────────────────────────────────────────────────
// BASE64URL DECODE (multibase prefix 'u' stripped per spec)
// ─────────────────────────────────────────────────────────────

function decodeBase64Url(encoded: string): Uint8Array {
  const stripped = encoded.startsWith('u') ? encoded.slice(1) : encoded;
  const padded   = stripped.replace(/-/g, '+').replace(/_/g, '/');
  const pad      = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  const binary   = atob(padded + pad);
  return Uint8Array.from(binary, c => c.charCodeAt(0));
}

// ─────────────────────────────────────────────────────────────
// BIT READER
// ─────────────────────────────────────────────────────────────

function readBit(bytes: Uint8Array, bitIndex: number): 0 | 1 {
  const byteIndex = Math.floor(bitIndex / 8);
  const bitOffset = 7 - (bitIndex % 8);
  if (byteIndex >= bytes.length) return 0;
  return ((bytes[byteIndex] >> bitOffset) & 1) as 0 | 1;
}

export function bitToStatus(bit: 0 | 1, purpose: 'revocation' | 'suspension'): BitstringStatusResult {
  if (bit === 0) return 'valid';
  return purpose === 'revocation' ? 'revoked' : 'suspended';
}

// ─────────────────────────────────────────────────────────────
// STATUS LIST FETCHER
// ─────────────────────────────────────────────────────────────

interface StatusListCache {
  url: string;
  bytes: Uint8Array;
  purpose: 'revocation' | 'suspension';
  fetchedAt: number;
}

let _cache: StatusListCache | null = null;

/**
 * Fetch and decompress the Bitstring Status List from the platform endpoint.
 * Returns cached result if within the 60-second TTL.
 */
export async function fetchStatusList(
  statusListCredentialUrl: string,
): Promise<StatusListCache | null> {
  const now = Date.now();
  if (_cache && _cache.url === statusListCredentialUrl && now - _cache.fetchedAt < POLL_INTERVAL_MS) {
    return _cache;
  }

  try {
    const resp = await fetch(statusListCredentialUrl, {
      headers: { Accept: 'application/json, application/ld+json' },
      cache: 'no-store',
    });

    if (!resp.ok) return null;

    const credential: BitstringStatusListCredential = await resp.json();
    const { encodedList, statusPurpose } = credential.credentialSubject;

    const compressed = decodeBase64Url(encodedList);
    const bytes = await decompressGzip(compressed);

    _cache = { url: statusListCredentialUrl, bytes, purpose: statusPurpose, fetchedAt: now };
    return _cache;
  } catch {
    return null;
  }
}

/**
 * Check a single credential's revocation status by its list index.
 * Returns 'unknown' if the status list cannot be fetched.
 */
export async function checkCredentialStatus(
  statusListCredentialUrl: string,
  listIndex: number,
  purpose: 'revocation' | 'suspension' = 'revocation',
): Promise<BitstringStatusResult> {
  const list = await fetchStatusList(statusListCredentialUrl);
  if (!list) return 'unknown';
  const bit = readBit(list.bytes, listIndex);
  return bitToStatus(bit, purpose);
}

// ─────────────────────────────────────────────────────────────
// POLLING WORKER
// ─────────────────────────────────────────────────────────────

export interface StatusPollResult {
  slotIndex: number;
  status: BitstringStatusResult;
  checkedAt: number;
}

export type StatusUpdateCallback = (results: StatusPollResult[]) => void;

let _pollTimer: ReturnType<typeof setInterval> | null = null;

/**
 * Start the 60-second background polling loop.
 * On each tick, checks all provided slot indices against the status list.
 * Fires callback with results — caller updates WalletState accordingly.
 *
 * If the platform returns bit=1 for any slot, the UI should:
 *   1. Drop the active presentation token (zero out activePresentation)
 *   2. Render that credential sleeve in the revoked/expired state
 *   3. Show a circuit-breaker alert in the notification widget
 */
export function startStatusPolling(
  statusListUrl: string,
  slotIndices: number[],
  onUpdate: StatusUpdateCallback,
): void {
  if (_pollTimer) return;

  const poll = async () => {
    const results: StatusPollResult[] = await Promise.all(
      slotIndices.map(async (idx) => ({
        slotIndex: idx,
        status: await checkCredentialStatus(statusListUrl, idx),
        checkedAt: Date.now(),
      })),
    );
    onUpdate(results);
  };

  poll();
  _pollTimer = setInterval(poll, POLL_INTERVAL_MS);
}

export function stopStatusPolling(): void {
  if (_pollTimer) {
    clearInterval(_pollTimer);
    _pollTimer = null;
  }
}

export function invalidateStatusCache(): void {
  _cache = null;
}
