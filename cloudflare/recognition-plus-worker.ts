/**
 * Recognition+ Trace Data API
 * Handles sensitive aviation trace data: licenses, credentials, verification, logbook
 * Separated from ordinary pilot profile data for regulatory compliance
 *
 * Auth: Bearer token from Auth0 (validated via JWKS)
 * Rate limit: 60 req/min per IP
 * Max body: 1 MB
 */

// ── Types ──────────────────────────────────────────────────────

interface Env {
  DB: D1Database;
  VAULT: R2Bucket;
  AUTH0_DOMAIN: string;
  AUTH0_AUDIENCE: string;
}

// R2Bucket minimal interface for Workers runtime
declare interface R2Bucket {
  put(key: string, value: ArrayBuffer | string | ReadableStream | Blob, options?: R2PutOptions): Promise<R2Object>;
  get(key: string): Promise<R2Object | null>;
  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{ objects: R2Object[]; truncated: boolean; cursor?: string }>;
}

declare interface R2Object {
  key: string;
  size: number;
  etag: string;
  httpEtag: string;
  httpMetadata: R2HTTPMetadata;
  customMetadata: Record<string, string>;
  range: R2Range;
  checksums: R2Checksums;
  uploaded: Date;
  version: string;
  body: ReadableStream;
  bodyUsed: boolean;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
  blob(): Promise<Blob>;
  json(): Promise<unknown>;
}

declare interface R2PutOptions {
  httpMetadata?: R2HTTPMetadata;
  customMetadata?: Record<string, string>;
  md5?: ArrayBuffer | string;
  sha1?: ArrayBuffer | string;
  sha256?: ArrayBuffer | string;
  sha384?: ArrayBuffer | string;
  sha512?: ArrayBuffer | string;
}

declare interface R2HTTPMetadata {
  contentType?: string;
  contentLanguage?: string;
  contentDisposition?: string;
  contentEncoding?: string;
  cacheControl?: string;
  cacheExpiry?: Date;
}

declare interface R2Range {
  offset: number;
  length: number;
}

declare interface R2Checksums {
  md5?: ArrayBuffer;
  sha1?: ArrayBuffer;
  sha256?: ArrayBuffer;
  sha384?: ArrayBuffer;
  sha512?: ArrayBuffer;
}

// ── JWKS & JWT Types ─────────────────────────────────────────

interface JWK {
  kty: string;
  kid: string;
  use?: string;
  n: string;
  e: string;
}

interface JWTPayload {
  sub: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

interface CachedKey {
  key: CryptoKey;
  kid: string;
  expiry: number;
}

// ── Rate Limit Map ───────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// ── Constants ──────────────────────────────────────────────────

const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 60;
const MAX_BODY_SIZE = 1_048_576; // 1 MB

// ── In-memory caches (per isolate) ─────────────────────────────

const jwksCache: { keys: JWK[]; expiry: number } = { keys: [], expiry: 0 };
const keyCache: Map<string, CachedKey> = new Map();
const rateLimitMap: Map<string, RateLimitEntry> = new Map();

// ── Utility Functions ────────────────────────────────────────

function jsonResponse(data: unknown, status = 200, origin?: string): Response {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
  }
  return new Response(JSON.stringify(data), { status, headers });
}

function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  let entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    entry = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateLimitMap.set(ip, entry);
    return true;
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) return false;
  entry.count++;
  return true;
}

function base64UrlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// ── Auth0 JWT Verification ─────────────────────────────────────

async function fetchJWKS(domain: string): Promise<JWK[]> {
  const res = await fetch(`https://${domain}/.well-known/jwks.json`, { cf: { cacheTtl: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch JWKS');
  const data = await res.json() as { keys: JWK[] };
  return data.keys;
}

async function verifyAuth0Token(request: Request, env: Env): Promise<JWTPayload> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) throw new Error('Missing token');
  const token = authHeader.slice(7);

  const [headerB64, payloadB64, signatureB64] = token.split('.');
  if (!headerB64 || !payloadB64 || !signatureB64) throw new Error('Invalid token format');

  const header = JSON.parse(new TextDecoder().decode(base64UrlDecode(headerB64))) as { kid: string; alg: string };
  const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadB64))) as JWTPayload;

  if (payload.exp && payload.exp * 1000 < Date.now()) throw new Error('Token expired');
  if (payload.aud && payload.aud !== env.AUTH0_AUDIENCE) throw new Error('Invalid audience');

  let cached = keyCache.get(header.kid);
  if (!cached || cached.expiry < Date.now()) {
    const jwks = jwksCache.expiry > Date.now() ? jwksCache.keys : await fetchJWKS(env.AUTH0_DOMAIN);
    if (jwksCache.expiry <= Date.now()) { jwksCache.keys = jwks; jwksCache.expiry = Date.now() + 3600_000; }
    const jwk = jwks.find(k => k.kid === header.kid);
    if (!jwk) throw new Error('Key not found');
    const cryptoKey = await crypto.subtle.importKey(
      'jwk', { kty: 'RSA', n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']
    );
    cached = { key: cryptoKey, kid: header.kid, expiry: Date.now() + 3600_000 };
    keyCache.set(header.kid, cached);
  }

  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5', cached.key,
    base64UrlDecode(signatureB64),
    new TextEncoder().encode(`${headerB64}.${payloadB64}`)
  );
  if (!valid) throw new Error('Invalid signature');
  return payload;
}

// ── Schema Helpers ─────────────────────────────────────────────

function validateRequiredFields(params: Record<string, unknown>, fields: string[]): string | null {
  for (const f of fields) if (params[f] === undefined || params[f] === null || params[f] === '') return `Missing ${f}`;
  return null;
}

// ── Main Request Handler ───────────────────────────────────────

async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method;
  const origin = request.headers.get('Origin') || '*';
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (!checkRateLimit(clientIP)) return jsonResponse({ error: 'Rate limited' }, 429, origin);
  if (request.body && request.headers.get('Content-Length') && parseInt(request.headers.get('Content-Length')!) > MAX_BODY_SIZE) {
    return jsonResponse({ error: 'Payload too large' }, 413, origin);
  }

  // ── Health Check ──
  if (url.pathname === '/api/health' && method === 'GET') {
    try {
      await env.DB.prepare('SELECT 1').first();
      return jsonResponse({ status: 'ok', db: 'connected' }, 200, origin);
    } catch {
      return jsonResponse({ status: 'error', db: 'disconnected' }, 503, origin);
    }
  }

  // Everything below requires Auth0 JWT
  let auth: JWTPayload;
  try {
    auth = await verifyAuth0Token(request, env);
  } catch (err) {
    if (err instanceof Response) return err;
    return jsonResponse({ error: 'Unauthorized' }, 401, origin);
  }

  const db = env.DB;

  // ── Action Router ──
  if (url.pathname === '/api' && method === 'POST') {
    const body = await request.json() as Record<string, unknown>;
    const action = body.action as string;
    const params = (body.params || {}) as Record<string, unknown>;
    if (!action) return jsonResponse({ error: 'Missing action' }, 400, origin);

    try {
      const result = await handleAction(action, params, db, auth, env);
      return jsonResponse(result, 200, origin);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const status = msg === 'Forbidden' ? 403 : msg === 'Not found' ? 404 : 400;
      return jsonResponse({ error: msg }, status, origin);
    }
  }

  return jsonResponse({ error: 'Not found' }, 404, origin);
}

// ── Action Handlers ────────────────────────────────────────────

async function handleAction(
  action: string,
  params: Record<string, unknown>,
  db: D1Database,
  auth: JWTPayload,
  env: Env
): Promise<unknown> {
  switch (action) {

    // ── Pilot Credentials ──
    case 'getCredentials': {
      const userId = params.user_id as string;
      if (!userId) throw new Error('Missing user_id');
      const { results } = await db.prepare('SELECT * FROM pilot_credentials WHERE user_id = ? ORDER BY issued_at DESC').bind(userId).all();
      return results || [];
    }
    case 'createCredential': {
      const missing = validateRequiredFields(params, ['user_id', 'credential_type', 'issuer']);
      if (missing) throw new Error(missing);
      const id = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO pilot_credentials (id, user_id, credential_type, issuer, credential_data, walt_id, expires_at, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, params.user_id, params.credential_type, params.issuer,
        JSON.stringify(params.credential_data || {}), params.walt_id || null,
        params.expires_at || null, params.status || 'active'
      ).run();
      return db.prepare('SELECT * FROM pilot_credentials WHERE id = ?').bind(id).first();
    }

    // ── Pilot Licensure & Experience ──
    case 'getLicenses': {
      const userId = params.user_id as string;
      if (!userId) throw new Error('Missing user_id');
      const { results } = await db.prepare('SELECT * FROM pilot_licensure_experience WHERE user_id = ?').bind(userId).all();
      return results || [];
    }
    case 'upsertLicense': {
      const missing = validateRequiredFields(params, ['user_id', 'license_number', 'issuing_authority']);
      if (missing) throw new Error(missing);
      const existing = await db.prepare('SELECT id FROM pilot_licensure_experience WHERE user_id = ? AND license_number = ?').bind(params.user_id, params.license_number).first();
      if (existing) {
        await db.prepare(`
          UPDATE pilot_licensure_experience SET
            license_type = ?, issue_date = ?, expiry_date = ?, issuing_authority = ?,
            ratings = ?, limitations = ?, updated_at = datetime('now')
          WHERE id = ?
        `).bind(
          params.license_type || null, params.issue_date || null, params.expiry_date || null,
          params.issuing_authority, JSON.stringify(params.ratings || []), JSON.stringify(params.limitations || []),
          (existing as Record<string, unknown>)['id']
        ).run();
        return db.prepare('SELECT * FROM pilot_licensure_experience WHERE id = ?').bind((existing as Record<string, unknown>)['id']).first();
      }
      const id = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO pilot_licensure_experience (id, user_id, license_number, license_type, issue_date, expiry_date, issuing_authority, ratings, limitations)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, params.user_id, params.license_number, params.license_type || null,
        params.issue_date || null, params.expiry_date || null, params.issuing_authority,
        JSON.stringify(params.ratings || []), JSON.stringify(params.limitations || [])
      ).run();
      return db.prepare('SELECT * FROM pilot_licensure_experience WHERE id = ?').bind(id).first();
    }

    // ── Verification Submissions ──
    case 'submitVerification': {
      const missing = validateRequiredFields(params, ['account_number', 'user_id']);
      if (missing) throw new Error(missing);
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const consentJsonPath = `consents/${id}.json`;
      await db.prepare(`
        INSERT INTO verification_submissions (id, user_id, auth0_sub, account_number, status, submitted_at, updated_at, consent_json_path, document_keys)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, params.user_id, auth.sub, params.account_number, 'submitted',
        now, now, consentJsonPath, JSON.stringify(params.document_keys || {})
      ).run();
      return { id, status: 'submitted', submitted_at: now };
    }
    case 'getVerificationStatus': {
      const userId = params.user_id as string;
      if (!userId) throw new Error('Missing user_id');
      const { results } = await db.prepare(`
        SELECT credential_type, status, issued_at, expires_at, revoked_at
        FROM pilot_credentials WHERE user_id = ?
        UNION ALL
        SELECT 'verification' as credential_type, status, submitted_at as issued_at, null as expires_at, null as revoked_at
        FROM verification_submissions WHERE user_id = ?
      `).bind(userId, userId).all();
      return results || [];
    }
    case 'getVerificationByAccountNumber': {
      const accountNumber = params.account_number as string;
      if (!accountNumber) throw new Error('Missing account_number');
      return db.prepare('SELECT * FROM verification_submissions WHERE account_number = ? ORDER BY submitted_at DESC').bind(accountNumber).first();
    }
    case 'updateVerificationStatus': {
      const id = params.id as string;
      const status = params.status as string;
      if (!id || !status) throw new Error('Missing id or status');
      await db.prepare(`
        UPDATE verification_submissions SET status = ?, updated_at = datetime('now') WHERE id = ?
      `).bind(status, id).run();
      return db.prepare('SELECT * FROM verification_submissions WHERE id = ?').bind(id).first();
    }

    // ── Reverification Queue ──
    case 'getReverificationQueue': {
      const { results } = await db.prepare(`
        SELECT * FROM reverification_queue WHERE status = 'pending' ORDER BY current_expiry ASC
      `).all();
      return results || [];
    }
    case 'triggerAnnualReverification': {
      const year = new Date().getFullYear();
      const batchId = `annual-${year}`;
      const now = new Date().toISOString();
      const ninetyDays = new Date();
      ninetyDays.setDate(ninetyDays.getDate() + 90);
      const { results } = await db.prepare(`
        SELECT pc.*, ple.license_number
        FROM pilot_credentials pc
        JOIN pilot_licensure_experience ple ON pc.user_id = ple.user_id
        WHERE pc.expires_at IS NOT NULL AND pc.expires_at <= ? AND pc.status = 'active'
      `).bind(ninetyDays.toISOString()).all();
      const credentials = (results || []) as Record<string, unknown>[];
      let created = 0;
      for (const cred of credentials) {
        const existing = await db.prepare('SELECT id FROM reverification_queue WHERE pilot_id = ? AND credential_type = ? AND cycle_year = ?').bind(cred.user_id, cred.credential_type, year).first();
        if (existing) continue;
        const id = crypto.randomUUID();
        await db.prepare(`
          INSERT INTO reverification_queue (id, pilot_id, credential_type, credential_id, current_expiry, status, cycle_year, batch_id, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(id, cred.user_id, cred.credential_type, cred.id || null, cred.expires_at, 'pending', year, batchId, now, now).run();
        created++;
      }
      return { created, year };
    }

    // ── Logbook Connections ──
    case 'getLogbookConnections': {
      const userId = params.user_id as string;
      if (!userId) throw new Error('Missing user_id');
      const { results } = await db.prepare('SELECT * FROM pilot_logbook_connections WHERE user_id = ?').bind(userId).all();
      return results || [];
    }
    case 'connectLogbookProvider': {
      const missing = validateRequiredFields(params, ['user_id', 'provider_id']);
      if (missing) throw new Error(missing);
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      await db.prepare(`
        INSERT INTO pilot_logbook_connections (id, user_id, provider_id, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(id, params.user_id, params.provider_id, 'active', now, now).run();
      return db.prepare('SELECT * FROM pilot_logbook_connections WHERE id = ?').bind(id).first();
    }

    // ── Flight Hours ──
    case 'getFlightHours': {
      const userId = params.user_id as string;
      if (!userId) throw new Error('Missing user_id');
      const { results } = await db.prepare('SELECT * FROM flight_hours WHERE user_id = ? ORDER BY log_date DESC').bind(userId).all();
      return results || [];
    }
    case 'addFlightHours': {
      const missing = validateRequiredFields(params, ['user_id', 'total_hours', 'log_date']);
      if (missing) throw new Error(missing);
      const id = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO flight_hours (id, user_id, total_hours, log_date, aircraft_type, notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(id, params.user_id, params.total_hours, params.log_date, params.aircraft_type || null, params.notes || null).run();
      return db.prepare('SELECT * FROM flight_hours WHERE id = ?').bind(id).first();
    }

    // ── Admin: Query Tables ──
    case 'queryTable': {
      const table = params.table as string;
      const allowedTables = new Set([
        'pilot_credentials', 'pilot_licensure_experience', 'verification_submissions',
        'reverification_queue', 'pilot_logbook_connections', 'flight_hours'
      ]);
      if (!allowedTables.has(table)) throw new Error(`Table '${table}' not allowed`);
      const limit = Math.min((params.limit as number) || 200, 500);
      const { results } = await db.prepare(`SELECT * FROM ${table} LIMIT ?`).bind(limit).all();
      return results || [];
    }

    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

// ── Exported Handler ───────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      return await handleRequest(request, env);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Worker error:', msg);
      return jsonResponse({ error: 'Internal error', message: msg }, 500);
    }
  },

  // ── Daily Cron: Purge expired verification documents ──
  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
    const now = new Date().toISOString();
    console.log('[PurgeCron][TraceDB] Starting at', now);

    const db = env.DB;

    const { results } = await db.prepare(`
      SELECT id, auth0_sub, account_number, document_keys, consent_json_path, document_purge_after, status
      FROM verification_submissions
      WHERE document_purge_after IS NOT NULL
        AND document_purge_after < ?
        AND document_keys IS NOT NULL
        AND document_keys != ''
        AND document_keys != '{}'
    `).bind(now).all();

    const rows = (results || []) as Array<Record<string, unknown>>;
    console.log('[PurgeCron][TraceDB] Found', rows.length, 'submissions with expired documents');

    for (const row of rows) {
      const submissionId = row['id'] as string;
      const documentKeysRaw = row['document_keys'] as string;
      let documentKeys: Record<string, string> = {};
      try { documentKeys = JSON.parse(documentKeysRaw || '{}'); } catch { continue; }

      const keysToDelete = Object.values(documentKeys).filter(Boolean);
      for (const r2Key of keysToDelete) {
        if (r2Key.startsWith('consents/')) continue;
        try { await env.VAULT.delete(r2Key); } catch (err) { console.error('[PurgeCron] Failed to delete:', r2Key, err); }
      }

      try {
        await db.prepare(`UPDATE verification_submissions SET document_keys = '{}', updated_at = ? WHERE id = ?`).bind(now, submissionId).run();
      } catch (dbErr) { console.error('[PurgeCron] Failed to update D1 for submission:', submissionId, dbErr); }
    }

    console.log('[PurgeCron][TraceDB] Finished. Processed', rows.length, 'submissions');
  },
} satisfies ExportedHandler<Env>;
