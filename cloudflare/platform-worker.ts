// Cloudflare Workers runtime types — Wrangler provides these at build time.
// These declarations silence IDE errors without needing full @cloudflare/workers-types.

declare interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

declare interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<{ results: T[]; success: boolean }>;
  run(): Promise<{ success: boolean }>;
}

declare interface ExportedHandler<Env = unknown> {
  fetch?: (request: Request, env: Env, ctx: ExecutionContext) => Response | Promise<Response>;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// cf is a Cloudflare-specific fetch option
interface CfRequestInit extends RequestInit {
  cf?: { cacheTtl?: number };
}

/**
 * Cloudflare Worker API for PilotRecognition
 * Replaces Supabase client calls. Runs at the edge, talks to D1.
 *
 * Endpoints:
 *   GET  /api/health                          → System health
 *   POST /api                                → Action router (all authenticated operations)
 *     Actions: getProfile | createProfile | updateProfile | deleteProfile
 *              getVerificationStatus
 *              getRecognitionScore | saveRecognitionScore
 *              getPayments | createPayment
 *              createCheckout
 *              createDid | getDid
 *              createCredential | getCredentials
 *              createEnterprise | getEnterprises | getEnterprise | enterprisePull
 *              getAllPilots | updateUserTier
 *              batch  → runs multiple actions in one request
 *   POST /api/webhooks/dodo                  → Dodo payment confirmations
 *   POST /api/webhooks/veremark              → Veremark verification results
 *
 * Auth: Bearer token from Auth0 (validated via JWKS)
 * Rate limit: 60 req/min per IP
 * Max body: 1 MB
 */

// ── Types ──────────────────────────────────────────────────────

interface Env {
  DB: D1Database;                     // pilotrecognition-reference-data
  DB_PROFILES: D1Database;           // pilotrecognition-profiles (profiles, recognition_scores)
  DB_OPS: D1Database;                 // pilotrecognition-d1 (payments, enterprises, vouchers)
  DB_TRACE: D1Database;              // recognition-plus-trace (audit, credentials)
  DB_DOCS: D1Database;                // apc-document-metadata (stories, documents)
  VAULT: R2Bucket;
  AUTH0_DOMAIN: string;
  AUTH0_AUDIENCE: string;
  DODO_API_KEY?: string;
  DODO_WEBHOOK_SECRET?: string;
  VEREMARK_WEBHOOK_SECRET?: string;
  DODO_PRODUCT_ID_RECOGNITION_PLUS?: string;
}

// R2Bucket minimal interface for Workers runtime
declare interface R2Bucket {
  put(key: string, value: ArrayBuffer | string | ReadableStream | Blob, options?: R2PutOptions): Promise<R2Object>;
  get(key: string): Promise<R2Object | null>;
  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{ objects: R2Object[]; truncated: boolean; cursor?: string }>;
}

interface R2PutOptions {
  httpMetadata?: { contentType?: string };
  customMetadata?: Record<string, string>;
}

interface R2Object {
  key: string;
  size: number;
  etag: string;
  httpEtag: string;
  httpMetadata?: { contentType?: string };
  customMetadata?: Record<string, string>;
  uploaded: Date;
  checksum?: { md5?: string };
  body?: ReadableStream;
  bodyUsed: boolean;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
  json(): Promise<unknown>;
  blob(): Promise<Blob>;
}

interface JWTPayload {
  sub: string;
  email?: string;
  name?: string;
  exp: number;
  iat: number;
}

// ── JWKS Cache (module-level, persists across requests in same isolate) ──

interface CachedJWKS {
  keys: JsonWebKey[];
  fetchedAt: number;
}

let jwksCache: CachedJWKS | null = null;
const JWKS_CACHE_MS = 24 * 60 * 60 * 1000; // 24 hours

async function getJWKS(env: Env): Promise<JsonWebKey[]> {
  if (jwksCache && Date.now() - jwksCache.fetchedAt < JWKS_CACHE_MS) {
    return jwksCache.keys;
  }
  const jwksUrl = `https://${env.AUTH0_DOMAIN}/.well-known/jwks.json`;
  const jwksRes = await fetch(jwksUrl, { cf: { cacheTtl: 3600 } } as CfRequestInit);
  if (!jwksRes.ok) throw new Response(JSON.stringify({ error: 'Failed to fetch JWKS' }), { status: 500 });
  const jwks = await jwksRes.json() as { keys: JsonWebKey[] };
  jwksCache = { keys: jwks.keys, fetchedAt: Date.now() };
  return jwks.keys;
}

// ── Auth Middleware ──────────────────────────────────────────────

async function verifyAuth0Token(request: Request, env: Env): Promise<JWTPayload> {
  const header = request.headers.get('Authorization');
  if (!header?.startsWith('Bearer ')) {
    throw new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401 });
  }
  const token = header.slice(7);

  // Fetch Auth0 JWKS (cached for 24 hours)
  const jwksKeys = await getJWKS(env);

  // Decode header to find kid
  const parts = token.split('.');
  if (parts.length !== 3) throw new Response(JSON.stringify({ error: 'Invalid JWT' }), { status: 401 });
  const headerJson = JSON.parse(atob(parts[0]));
  const kid = headerJson.kid;

  const keyData = jwksKeys.find((k) => (k as any).kid === kid);
  if (!keyData) throw new Response(JSON.stringify({ error: 'Signing key not found' }), { status: 401 });

  // Build JWK and import
  const jwk: JsonWebKey = {
    kty: keyData.kty,
    n: (keyData as any).n,
    e: (keyData as any).e,
    alg: 'RS256',
    ext: true,
  };

  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);

  // Verify signature
  const encoder = new TextEncoder();
  const signature = base64UrlDecode(parts[2]) as any;
  const valid = await crypto.subtle.verify(
    { name: 'RSASSA-PKCS1-v1_5' },
    key,
    signature,
    encoder.encode(parts[0] + '.' + parts[1])
  );
  if (!valid) throw new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401 });

  // Decode payload
  const payload = JSON.parse(atob(parts[1])) as JWTPayload;
  if (payload.exp * 1000 < Date.now()) throw new Response(JSON.stringify({ error: 'Token expired' }), { status: 401 });

  return payload;
}

function base64UrlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = 4 - (base64.length % 4);
  const padded = pad !== 4 ? base64 + '='.repeat(pad) : base64;
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// ── CORS ───────────────────────────────────────────────────────

function corsHeaders(origin?: string): Record<string, string> {
  // Whitelist production + local dev origins
  const allowed = ['https://pilotterminal.com', 'https://pilotrecognition.com', 'http://localhost:5173'];
  const reflect = origin && allowed.some((a) => origin.startsWith(a)) ? origin : allowed[0];
  return {
    'Access-Control-Allow-Origin': reflect,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
  };
}

function jsonResponse(data: unknown, status = 200, origin?: string): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(origin),
  });
}

// ── D1 Helpers ─────────────────────────────────────────────────

async function getProfileByAuth0Id(db: D1Database, auth0Id: string): Promise<Record<string, unknown> | null> {
  return db.prepare('SELECT * FROM profiles WHERE auth0_id = ?').bind(auth0Id).first() as Promise<Record<string, unknown> | null>;
}

async function getProfileById(db: D1Database, id: string): Promise<Record<string, unknown> | null> {
  return db.prepare('SELECT * FROM profiles WHERE id = ?').bind(id).first() as Promise<Record<string, unknown> | null>;
}

// ── Input validation helper ───────────────────────────────────

function validateRequiredFields(body: Record<string, unknown>, required: string[]): string | null {
  for (const field of required) {
    if (!(field in body) || body[field] === null || body[field] === undefined || body[field] === '') {
      return `Missing required field: ${field}`;
    }
  }
  return null;
}

function generatePublicToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let token = 'pr-';
  for (let i = 0; i < 12; i++) token += chars[Math.floor(Math.random() * chars.length)];
  return token;
}

async function ensureProfile(dbProfiles: D1Database, auth0Id: string, email: string, name?: string, originJurisdiction?: string) {
  let profile = await getProfileByAuth0Id(dbProfiles, auth0Id);
  if (!profile) {
    const id = crypto.randomUUID();
    const displayName = name || email.split('@')[0];
    const publicToken = generatePublicToken();
    const now = new Date().toISOString();
    await dbProfiles.prepare(`
      INSERT INTO profiles (id, auth0_id, email, display_name, public_token, role, status, subscription_tier, origin_jurisdiction, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(id, auth0Id, email, displayName, publicToken, 'pilot', 'active', 'free', originJurisdiction || null, now, now).run();
    profile = await getProfileById(dbProfiles, id);
  }
  // Backfill public_token for existing profiles
  if (profile && !profile['public_token']) {
    const publicToken = generatePublicToken();
    await dbProfiles.prepare(`UPDATE profiles SET public_token = ? WHERE id = ?`).bind(publicToken, profile['id']).run();
    profile = await getProfileById(dbProfiles, profile['id'] as string);
  }
  return profile;
}

// Simple CSV line parser (handles quoted fields)
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (c === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += c;
    }
  }
  result.push(current.trim());
  return result;
}

async function handlePublicProfileRequest(token: string, dbProfiles: D1Database, origin?: string): Promise<Response> {
  const profile = await dbProfiles.prepare(`
    SELECT id, auth0_id, display_name, full_name, first_name, last_name, email, avatar_url, profile_image_url,
           current_flight_hours, total_flight_hours, license_id, country_of_license, ratings,
           license_types, type_ratings, current_occupation, current_level, pilot_stage,
           nationality, subscription_tier, created_at
    FROM profiles WHERE public_token = ?
  `).bind(token).first() as Record<string, unknown> | null;

  if (!profile) {
    return jsonResponse({ error: 'Not found' }, 404, origin);
  }

  // Risk score placeholder — trace data now lives in recognition-plus-api
  const riskScore = 0;

  const publicProfile = {
    id: profile['id'],
    name: profile['display_name'] || profile['full_name'] || `${profile['first_name'] || ''} ${profile['last_name'] || ''}`.trim(),
    email: profile['email'],
    avatar_url: profile['avatar_url'] || profile['profile_image_url'],
    total_flight_hours: profile['total_flight_hours'],
    license_id: profile['license_id'],
    country_of_license: profile['country_of_license'],
    ratings: profile['ratings'],
    license_types: profile['license_types'],
    type_ratings: profile['type_ratings'],
    current_occupation: profile['current_occupation'],
    current_level: profile['current_level'],
    pilot_stage: profile['pilot_stage'],
    nationality: profile['nationality'],
    subscription_tier: profile['subscription_tier'],
    credentials: creds || [],
    verifications: verifications || [],
    risk_score: riskScore,
    verified_pct: Math.round((verifiedCount / requiredCreds.length) * 100),
    created_at: profile['created_at'],
  };

  return jsonResponse(publicProfile, 200, origin);
}

// ── Rate Limiting ──────────────────────────────────────────────

const MAX_BODY_SIZE = 1 * 1024 * 1024; // 1 MB
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 60; // 60 requests per minute per IP

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }
  return false;
}

function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}

// ── Route Handlers ─────────────────────────────────────────────

async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin') || undefined;
  const path = url.pathname;
  const method = request.method;

  // Preflight
  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  // ── Request size limit ──
  const contentLength = request.headers.get('Content-Length');
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
    return jsonResponse({ error: 'Request body too large' }, 413, origin);
  }

  // ── Rate limiting (IP-based) ──
  const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (isRateLimited(`${method}:${path}:${clientIp}`)) {
    return jsonResponse({ error: 'Rate limit exceeded' }, 429, origin);
  }

  // Health check (no auth) — actually pings DB
  if (path === '/api/health') {
    try {
      await env.DB.prepare('SELECT 1').first();
      return jsonResponse({ status: 'ok', db: 'connected' }, 200, origin);
    } catch {
      return jsonResponse({ status: 'error', db: 'disconnected' }, 503, origin);
    }
  }

  // ── Dodo Webhook (no auth, signed by secret) ──
  if (path === '/api/webhooks/dodo' && method === 'POST') {
    return handleDodoWebhook(request, env);
  }

  // ── Veremark Webhook (no auth, signed by secret) ──
  if (path === '/api/webhooks/veremark' && method === 'POST') {
    return handleVeremarkWebhook(request, env);
  }

  // ── Checkout (no auth — called from frontend with user_id in body) ──
  if (path === '/api/checkout/recognition-plus' && method === 'POST') {
    return handleCheckout(request, env);
  }

  // ── Public Reference Data (no auth — manufacturers, aircraft, training requirements) ──
  if (path.startsWith('/api/reference/') && method === 'GET') {
    return handleReferenceDataRequest(request, env);
  }

  // Everything below requires Auth0 JWT
  let auth: JWTPayload;
  try {
    auth = await verifyAuth0Token(request, env);
  } catch (err) {
    if (err instanceof Response) {
      const body = await err.text();
      return new Response(body, { status: err.status, headers: { ...Object.fromEntries(err.headers.entries()), ...corsHeaders(origin) } });
    }
    return jsonResponse({ error: 'Unauthorized' }, 401, origin);
  }

  const dbOps = env.DB_OPS;         // operational DB: payments, subscriptions, enterprise_profiles, forums, vouchers
  const dbProfiles = env.DB_PROFILES; // profiles DB: profiles, recognition_scores, pilot_verifications
  const dbTrace = env.DB_TRACE;     // audit DB: credentials, background_checks, security_events
  const dbDocs = env.DB_DOCS;       // content DB: stories, documents, evidence
  const dbRef = env.DB;             // pilotpathways data: airlines, ATOs, TRCs, aircraft, training

  // ── Action Router ─────────────────────────────────────────────
  if (path === '/api' && method === 'POST') {
    const body = await request.json() as Record<string, unknown>;
    const action = body.action as string;
    const params = (body.params || {}) as Record<string, unknown>;

    if (!action) {
      return jsonResponse({ error: 'Missing action' }, 400, origin);
    }

    // Inject CF-IPCountry for profile creation (ToS Section 13.3)
    if (action === 'createProfile') {
      params._originJurisdiction = request.headers.get('CF-IPCountry') || undefined;
    }

    if (action === 'batch') {
      const requests = body.requests as Array<{ action: string; params?: Record<string, unknown> }>;
      if (!Array.isArray(requests)) {
        return jsonResponse({ error: 'batch requires requests array' }, 400, origin);
      }
      const results: Record<string, unknown> = {};
      for (const req of requests) {
        try {
          results[req.action] = await handleAction(req.action, req.params || {}, dbOps, dbProfiles, auth, env);
        } catch (err) {
          results[req.action] = { error: err instanceof Error ? err.message : String(err) };
        }
      }
      return jsonResponse(results, 200, origin);
    }

    try {
      const result = await handleAction(action, params, dbOps, dbProfiles, auth, env);
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
  db: D1Database,          // dbOps: operational tables
  dbProfiles: D1Database, // dbProfiles: profiles, recognition_scores
  auth: JWTPayload,
  env: Env
): Promise<unknown> {
  switch (action) {

    // ── Profile ──
    case 'getProfile': {
      if (params.me === 1 || params.me === '1' || params.me === true) {
        const profile = await getProfileByAuth0Id(dbProfiles, auth.sub);
        if (!profile) throw new Error('Not found');
        return profile;
      }
      if (params.id) {
        const profile = await getProfileById(dbProfiles, params.id as string);
        if (!profile) throw new Error('Not found');
        return profile;
      }
      if (params.auth0_id) {
        const profile = await getProfileByAuth0Id(dbProfiles, params.auth0_id as string);
        if (!profile) throw new Error('Not found');
        return profile;
      }
      throw new Error('Missing param: auth0_id, id, or me');
    }
    case 'createProfile': {
      const missing = validateRequiredFields(params, ['email']);
      if (missing) throw new Error(missing);
      const originJurisdiction = params._originJurisdiction as string | undefined;
      return ensureProfile(dbProfiles, auth.sub, params.email as string, params.name as string, originJurisdiction);
    }
    case 'updateProfile': {
      let id = params.id as string;
      if (!id) throw new Error('Missing id');
      let existing = await getProfileById(dbProfiles, id);
      // If not found by UUID, try auth0_id (for partial saves during onboarding)
      if (!existing) {
        existing = await getProfileByAuth0Id(dbProfiles, id);
        if (existing) id = existing['id'] as string;
      }
      if (!existing) throw new Error('Not found');
      if (existing['auth0_id'] !== auth.sub) {
        const me = await getProfileByAuth0Id(dbProfiles, auth.sub);
        if (!me || me['role'] !== 'super_admin') throw new Error('Forbidden');
      }
      const allowed = new Set([
        'display_name', 'first_name', 'last_name', 'phone', 'country_code',
        'date_of_birth', 'nationality', 'avatar_url', 'profile_image_url',
        'current_flight_hours', 'total_flight_hours', 'mentorship_hours',
        'foundation_progress', 'overall_recognition_score', 'current_level',
        'current_occupation', 'license_id', 'country_of_license', 'ratings',
        'is_enrolled_in_foundational', 'subscription_status',
        'wallet_id', 'wallet_email', 'wallet_did', 'referral_code',
        // Onboarding fields (2026-06-20)
        'employment_status', 'unemployed_duration', 'current_job', 'career_goal',
        'pilot_stage', 'elp_level', 'aircraft_types', 'aircraft_rated_on',
        'license_types', 'type_ratings', 'license_issuing_authority',
        'origin_jurisdiction', 'role',
      ]);
      for (const key of Object.keys(params)) {
        if (key.startsWith('_')) continue;
        if (!allowed.has(key)) throw new Error(`Field '${key}' is not allowed for update`);
      }
      const sets: string[] = [];
      const values: unknown[] = [];
      for (const key of allowed) {
        if (key in params) {
          sets.push(`${key} = ?`);
          values.push(params[key]);
        }
      }
      if (sets.length === 0) throw new Error('No fields to update');
      sets.push("updated_at = datetime('now')");
      values.push(id);
      await dbProfiles.prepare(`UPDATE profiles SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();
      return getProfileById(dbProfiles, id);
    }
    case 'upsertProfile': {
      // Full onboarding batch — creates or updates profile with all onboarding fields
      const required = ['email', 'display_name', 'full_name', 'current_occupation'];
      const missing = validateRequiredFields(params, required);
      if (missing) throw new Error(missing);

      const auth0Id = auth.sub;
      const email = params.email as string;
      let profile = await getProfileByAuth0Id(dbProfiles, auth0Id);
      const now = new Date().toISOString();

      // All onboarding fields that can be set
      const onboardingFields = [
        'display_name', 'full_name', 'current_occupation', 'date_of_birth',
        'total_flight_hours', 'aircraft_types', 'aircraft_rated_on', 'nationality',
        'license_issuing_authority', 'country_of_license', 'origin_jurisdiction',
        'ratings', 'license_types', 'employment_status', 'unemployed_duration',
        'current_job', 'career_goal', 'pilot_stage', 'elp_level', 'type_ratings', 'role',
        'dca_agreed', 'dca_agreed_at',
      ];

      if (!profile) {
        // Generate pilot_id in PR0001 format
        const countRow = await dbProfiles.prepare('SELECT COUNT(*) as cnt FROM profiles').first() as { cnt: number } | null;
        const count = (countRow?.cnt ?? 0) + 1;
        const pilotId = `PR${String(count).padStart(4, '0')}`;
        const id = crypto.randomUUID();

        const values: unknown[] = [id, auth0Id, email];
        const columns = ['id', 'auth0_id', 'email'];

        for (const key of onboardingFields) {
          if (key in params) {
            columns.push(key);
            values.push(params[key]);
          }
        }
        const publicToken = generatePublicToken();
        columns.push('pilot_id', 'public_token', 'role', 'status', 'subscription_tier', 'created_at', 'updated_at');
        values.push(pilotId, publicToken, params.role || 'mentee', 'active', 'free', now, now);

        const placeholders = values.map(() => '?').join(', ');
        await dbProfiles.prepare(`INSERT INTO profiles (${columns.join(', ')}) VALUES (${placeholders})`).bind(...values).run();
        profile = await getProfileById(dbProfiles, id);
      } else {
        // Update existing profile
        const sets: string[] = [];
        const values: unknown[] = [];
        for (const key of onboardingFields) {
          if (key in params) {
            sets.push(`${key} = ?`);
            values.push(params[key]);
          }
        }
        if (sets.length === 0) throw new Error('No fields to update');
        sets.push("updated_at = datetime('now')");
        values.push(profile['id']);
        await dbProfiles.prepare(`UPDATE profiles SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();
        profile = await getProfileById(dbProfiles, profile['id'] as string);
      }

      return { success: true, pilot_id: profile?.['pilot_id'], profile_id: profile?.['id'], profile };
    }
    case 'deleteProfile': {
      const id = params.id as string;
      if (!id) throw new Error('Missing id');
      const existing = await getProfileById(dbProfiles, id);
      if (!existing) throw new Error('Not found');
      if (existing['auth0_id'] !== auth.sub) {
        const me = await getProfileByAuth0Id(dbProfiles, auth.sub);
        if (!me || me['role'] !== 'super_admin') throw new Error('Forbidden');
      }
      await dbProfiles.prepare('DELETE FROM profiles WHERE id = ?').bind(id).run();
      return { deleted: true };
    }

    // ── Recognition ──
    case 'getRecognitionScore': {
      const userId = params.user_id as string;
      if (!userId) throw new Error('Missing user_id');
      const row = await dbProfiles.prepare('SELECT * FROM recognition_scores WHERE user_id = ?').bind(userId).first();
      if (!row) throw new Error('Not found');
      return row;
    }
    case 'saveRecognitionScore': {
      const missing = validateRequiredFields(params, ['user_id']);
      if (missing) throw new Error(missing);
      const userId = params.user_id as string;
      const existing = await dbProfiles.prepare('SELECT id FROM recognition_scores WHERE user_id = ?').bind(userId).first();
      if (existing) {
        await dbProfiles.prepare(`
          UPDATE recognition_scores SET
            total_score = ?, hours_score = ?, experience_score = ?, assessment_score = ?,
            mentorship_score = ?, score_tier = ?, breakdown = ?, recommendations = ?,
            last_calculated_at = datetime('now'), updated_at = datetime('now')
          WHERE user_id = ?
        `).bind(
          params.total_score || 0, params.hours_score || 0, params.experience_score || 0,
          params.assessment_score || 0, params.mentorship_score || 0, params.score_tier || 'bronze',
          JSON.stringify(params.breakdown || {}), JSON.stringify(params.recommendations || []), userId
        ).run();
      } else {
        const id = crypto.randomUUID();
        await dbProfiles.prepare(`
          INSERT INTO recognition_scores (id, user_id, total_score, hours_score, experience_score,
            assessment_score, mentorship_score, score_tier, breakdown, recommendations)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          id, userId, params.total_score || 0, params.hours_score || 0, params.experience_score || 0,
          params.assessment_score || 0, params.mentorship_score || 0, params.score_tier || 'bronze',
          JSON.stringify(params.breakdown || {}), JSON.stringify(params.recommendations || [])
        ).run();
      }
      return dbProfiles.prepare('SELECT * FROM recognition_scores WHERE user_id = ?').bind(userId).first();
    }

    // ── Payments ──
    case 'getPayments': {
      const userId = params.user_id as string;
      if (!userId) throw new Error('Missing user_id');
      const { results } = await db.prepare('SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC').bind(userId).all();
      return results || [];
    }
    case 'createPayment': {
      const missing = validateRequiredFields(params, ['user_id', 'amount_cents']);
      if (missing) throw new Error(missing);
      const id = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO payments (id, user_id, amount_cents, currency, tier_purchased,
          tax_amount, tax_rate_percent, dodo_payment_id, dodo_invoice_id, dodo_checkout_id,
          status, payment_method, receipt_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, params.user_id, params.amount_cents, params.currency || 'USD', params.tier_purchased,
        params.tax_amount || 0, params.tax_rate_percent || 15, params.dodo_payment_id,
        params.dodo_invoice_id || null, params.dodo_checkout_id || null,
        params.status || 'completed', params.payment_method || null, params.receipt_url || null
      ).run();
      return db.prepare('SELECT * FROM payments WHERE id = ?').bind(id).first();
    }

    // ── Checkout ──
    case 'createCheckout': {
      if (!env.DODO_API_KEY || !env.DODO_PRODUCT_ID_RECOGNITION_PLUS) {
        throw new Error('Checkout not configured');
      }
      const profile = await getProfileByAuth0Id(dbProfiles, auth.sub);
      if (!profile) throw new Error('Profile not found');
      const dodoRes = await fetch('https://live.dodopayments.com/v1/checkouts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.DODO_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_cart: [{ product_id: env.DODO_PRODUCT_ID_RECOGNITION_PLUS, quantity: 1 }],
          customer: {
            email: profile['email'] as string,
            name: profile['display_name'] as string || undefined,
          },
          metadata: {
            user_id: profile['id'],
            tier: 'recognition_plus',
            source: 'pilotrecognition_web',
          },
          return_url: 'https://pilotrecognition.com/checkout/success',
          cancel_url: 'https://pilotrecognition.com/checkout/cancel',
        }),
      });
      if (!dodoRes.ok) {
        const errText = await dodoRes.text();
        console.error('[Checkout] Dodo error:', dodoRes.status, errText);
        throw new Error('Payment provider error');
      }
      const dodoData = await dodoRes.json() as { checkout_url?: string; session_id?: string };
      return { checkout_url: dodoData.checkout_url, session_id: dodoData.session_id };
    }

    // ── Recognition+ Membership ──
    case 'getRecognitionPlusMember': {
      const auth0Sub = auth.sub;
      const member = await db.prepare('SELECT * FROM recognition_plus_members WHERE auth0_sub = ?').bind(auth0Sub).first();
      if (!member) return null;
      // Parse metadata if stored as JSON string
      const m = member as Record<string, unknown>;
      if (m['metadata'] && typeof m['metadata'] === 'string') {
        try { m['metadata'] = JSON.parse(m['metadata']); } catch { /* ignore */ }
      }
      return m;
    }
    case 'createRecognitionPlusMember': {
      const userId = params.user_id as string;
      const tier = params.tier as string || 'basic';
      if (!userId) throw new Error('Missing user_id');
      const existing = await db.prepare('SELECT id FROM recognition_plus_members WHERE auth0_sub = ?').bind(auth.sub).first();
      if (existing) throw new Error('Already a Recognition+ member');
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      await db.prepare(`
        INSERT INTO recognition_plus_members (id, user_id, auth0_sub, tier, status, payment_status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(id, userId, auth.sub, tier, 'active', 'pending', now, now).run();
      return db.prepare('SELECT * FROM recognition_plus_members WHERE id = ?').bind(id).first();
    }
    case 'updateRecognitionPlusMember': {
      const userId = params.user_id as string;
      if (!userId) throw new Error('Missing user_id');
      const updates: string[] = [];
      const values: unknown[] = [];
      if (params.tier !== undefined) { updates.push('tier = ?'); values.push(params.tier); }
      if (params.status !== undefined) { updates.push('status = ?'); values.push(params.status); }
      if (params.payment_status !== undefined) { updates.push('payment_status = ?'); values.push(params.payment_status); }
      if (params.veremark_checks_total !== undefined) { updates.push('veremark_checks_total = ?'); values.push(params.veremark_checks_total); }
      if (params.veremark_checks_used !== undefined) { updates.push('veremark_checks_used = ?'); values.push(params.veremark_checks_used); }
      if (params.expires_at !== undefined) { updates.push('expires_at = ?'); values.push(params.expires_at); }
      if (params.metadata !== undefined) { updates.push('metadata = ?'); values.push(JSON.stringify(params.metadata)); }
      if (updates.length === 0) throw new Error('No fields to update');
      updates.push("updated_at = datetime('now')");
      values.push(userId);
      await db.prepare(`UPDATE recognition_plus_members SET ${updates.join(', ')} WHERE user_id = ?`).bind(...values).run();
      return db.prepare('SELECT * FROM recognition_plus_members WHERE user_id = ?').bind(userId).first();
    }
    case 'useVeremarkCheck': {
      const auth0Sub = auth.sub;
      const result = await db.prepare(`
        UPDATE recognition_plus_members
        SET veremark_checks_used = veremark_checks_used + 1, updated_at = datetime('now')
        WHERE auth0_sub = ? AND status = 'active' AND veremark_checks_used < veremark_checks_total
      `).bind(auth0Sub).run();
      const changes = (result as unknown as { meta?: { changes?: number } }).meta?.changes || 0;
      if (changes === 0) throw new Error('No checks remaining or not active');
      return { success: true, checks_used: (await db.prepare('SELECT veremark_checks_used, veremark_checks_total FROM recognition_plus_members WHERE auth0_sub = ?').bind(auth0Sub).first()) };
    }
    case 'getRecognitionPlusStats': {
      // Admin-only: analytics
      const me = await getProfileByAuth0Id(dbProfiles, auth.sub);
      if (!me || me['role'] !== 'super_admin') throw new Error('Forbidden');
      const tierRes = await db.prepare(`
        SELECT tier, COUNT(*) as count, SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active
        FROM recognition_plus_members GROUP BY tier
      `).all();
      const statusRes = await db.prepare(`
        SELECT status, COUNT(*) as count FROM recognition_plus_members GROUP BY status
      `).all();
      return { byTier: tierRes.results || [], byStatus: statusRes.results || [] };
    }

    // ── Verification Receipts ──
    case 'getVerificationReceipts': {
      const userId = params.user_id as string;
      if (!userId) throw new Error('Missing user_id');
      const { results } = await db.prepare(`
        SELECT id, provider, credential_type, status, expires_at, near_expiry, verified_at, flags, updated_at
        FROM verification_receipts
        WHERE user_id = ?
        ORDER BY verified_at DESC
      `).bind(userId).all();
      return (results || []).map((row: unknown) => ({
        ...(row as Record<string, unknown>),
        near_expiry: Boolean((row as Record<string, unknown>).near_expiry),
        flags: (row as Record<string, unknown>).flags ? JSON.parse((row as Record<string, unknown>).flags as string) : [],
      }));
    }

    // ── Enterprise ──
    case 'createEnterprise': {
      const missing = validateRequiredFields(params, ['company_name']);
      if (missing) throw new Error(missing);
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      await db.prepare(`
        INSERT INTO enterprise_profiles (
          id, auth0_id, company_name, airline_name, airline_iata_code, airline_logo_url,
          airline_website, company_description, industry, account_type, contact_email,
          contact_phone, billing_email, website, country, base_locations, fleet_information,
          contact_information, employee_count, is_active, account_tier,
          can_pull_verified_profiles, can_view_pilot_details, can_export_data,
          max_pathway_cards, max_interest_views_per_month, stripe_customer_id,
          tier_expires_at, subscription_status, subscription_tier,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, params.auth0_id || null, params.company_name, params.airline_name || params.company_name || null,
        params.airline_iata_code || null, params.airline_logo_url || null, params.airline_website || null,
        params.company_description || null, params.industry || null, params.account_type || 'airline',
        params.contact_email || null, params.contact_phone || null, params.billing_email || null,
        params.website || null, params.country || null, JSON.stringify(params.base_locations || []),
        JSON.stringify(params.fleet_information || {}), JSON.stringify(params.contact_information || {}),
        params.employee_count || 0, params.is_active !== false, params.account_tier || 'basic',
        params.can_pull_verified_profiles || false, params.can_view_pilot_details || false,
        params.can_export_data || false, params.max_pathway_cards || 5,
        params.max_interest_views_per_month || 100, params.stripe_customer_id || null,
        params.tier_expires_at || null, params.subscription_status || 'trial',
        params.subscription_tier || 'basic', now, now
      ).run();
      return db.prepare('SELECT * FROM enterprise_profiles WHERE id = ?').bind(id).first();
    }
    case 'getEnterprises': {
      const { results } = await db.prepare('SELECT * FROM enterprise_profiles ORDER BY created_at DESC LIMIT 200').all();
      return results || [];
    }
    case 'getEnterprise': {
      const id = params.id as string;
      if (!id) throw new Error('Missing id');
      const row = await db.prepare('SELECT * FROM enterprise_profiles WHERE id = ?').bind(id).first();
      if (!row) throw new Error('Not found');
      return row;
    }
    case 'getEnterpriseByAuth0': {
      const auth0Id = params.auth0_id as string;
      if (!auth0Id) throw new Error('Missing auth0_id');
      const row = await db.prepare('SELECT * FROM enterprise_profiles WHERE auth0_id = ? AND is_active = 1').bind(auth0Id).first();
      if (!row) throw new Error('No enterprise account found for this user');
      return row;
    }
    case 'updateEnterprise': {
      const id = params.id as string;
      if (!id) throw new Error('Missing id');
      const allowed = [
        'company_name','airline_name','airline_iata_code','airline_logo_url',
        'airline_website','company_description','industry','account_type',
        'contact_email','contact_phone','billing_email','website','country',
        'base_locations','fleet_information','contact_information','employee_count',
        'is_active','account_tier','can_pull_verified_profiles','can_view_pilot_details',
        'can_export_data','max_pathway_cards','max_interest_views_per_month',
        'stripe_customer_id','tier_expires_at','subscription_status','subscription_tier'
      ];
      const updates: string[] = [];
      const binds: unknown[] = [];
      for (const key of allowed) {
        if (params[key] !== undefined) {
          updates.push(`${key} = ?`);
          if (['base_locations','fleet_information','contact_information'].includes(key)) {
            binds.push(typeof params[key] === 'string' ? params[key] : JSON.stringify(params[key]));
          } else if (['is_active','can_pull_verified_profiles','can_view_pilot_details','can_export_data'].includes(key)) {
            binds.push(params[key] ? 1 : 0);
          } else {
            binds.push(params[key]);
          }
        }
      }
      if (updates.length === 0) throw new Error('No fields to update');
      updates.push('updated_at = datetime("now")');
      await db.prepare(`UPDATE enterprise_profiles SET ${updates.join(', ')} WHERE id = ?`).bind(...binds, id).run();
      return db.prepare('SELECT * FROM enterprise_profiles WHERE id = ?').bind(id).first();
    }

    case 'enterprisePull': {
      // ── Auth: admin OR enterprise with can_pull_verified_profiles ──
      const me = await getProfileByAuth0Id(dbProfiles, auth.sub);
      const role = (me?.['role'] as string) || '';
      const isAdmin = ['super_admin', 'admin'].includes(role);

      let canPull = isAdmin;
      let canViewPii = isAdmin;

      if (!canPull) {
        const enterprise = await db.prepare(
          'SELECT can_pull_verified_profiles, can_view_pilot_details FROM enterprise_profiles WHERE auth0_id = ? AND is_active = 1'
        ).bind(auth.sub).first() as Record<string, number> | null;
        if (enterprise) {
          canPull = Boolean(enterprise['can_pull_verified_profiles']);
          canViewPii = Boolean(enterprise['can_view_pilot_details']);
        }
      }

      if (!canPull) {
        throw new Error('Forbidden: enterprise pull access required');
      }

      // ── Parse filters ──
      const minHours = params.min_hours !== undefined ? Number(params.min_hours) : null;
      const maxHours = params.max_hours !== undefined ? Number(params.max_hours) : null;
      const country = params.country as string | null;
      const licenseType = params.license_type as string | null;
      const medicalClass = params.medical_class as string | null;
      const verifiedOnly = params.verified_only === true || params.verified_only === 'true' || params.verified_only === 1;
      const recognitionPlusOnly = params.recognition_plus_only === true || params.recognition_plus_only === 'true' || params.recognition_plus_only === 1;
      const minScore = params.min_score !== undefined ? Number(params.min_score) : null;
      const rating = params.rating as string | null;
      const languageLevel = params.language_level as string | null;
      const limit = Math.min(Number(params.limit || 50), 200);
      const offset = Number(params.offset || 0);

      // ── Build query ──
      const filterConditions: string[] = ["p.role = 'pilot'", "p.status = 'active'"];
      const filterValues: unknown[] = [];

      if (minHours !== null && !isNaN(minHours)) {
        filterConditions.push('p.total_flight_hours >= ?');
        filterValues.push(minHours);
      }
      if (maxHours !== null && !isNaN(maxHours)) {
        filterConditions.push('p.total_flight_hours <= ?');
        filterValues.push(maxHours);
      }
      if (country) {
        filterConditions.push('p.country_of_license = ?');
        filterValues.push(country);
      }
      if (licenseType) {
        filterConditions.push('p.license_type = ?');
        filterValues.push(licenseType);
      }
      if (medicalClass) {
        filterConditions.push('p.medical_class = ?');
        filterValues.push(medicalClass);
      }
      if (languageLevel) {
        filterConditions.push('p.elp_level = ?');
        filterValues.push(languageLevel);
      }
      if (recognitionPlusOnly) {
        filterConditions.push("p.subscription_tier = 'recognition_plus'");
      }
      if (minScore !== null && !isNaN(minScore)) {
        filterConditions.push('r.total_score >= ?');
        filterValues.push(minScore);
      }
      if (rating) {
        filterConditions.push('p.ratings LIKE ?');
        filterValues.push(`%${rating}%`);
      }

      const whereClause = filterConditions.join(' AND ');
      const countQuery = `SELECT COUNT(*) as total FROM profiles p LEFT JOIN recognition_scores r ON r.user_id = p.id WHERE ${whereClause}`;
      const dataQuery = `SELECT
        p.id, p.auth0_id, p.email, p.display_name, p.first_name, p.last_name,
        p.phone, p.country_code, p.date_of_birth, p.nationality,
        p.current_flight_hours, p.total_flight_hours, p.mentorship_hours,
        p.overall_recognition_score, p.current_level, p.current_occupation,
        p.license_id, p.country_of_license, p.ratings, p.license_type,
        p.pilot_stage, p.license_issuing_authority, p.aircraft_types,
        p.aircraft_category, p.license_types, p.type_ratings, p.type_rating_input,
        p.elp_level, p.medical_class, p.employment_status, p.current_job,
        p.career_goal, p.bio, p.linkedin_url, p.domicile,
        p.subscription_tier, p.recognition_tier, p.status, p.pilot_id,
        p.created_at, p.updated_at,
        r.total_score, r.score_tier
      FROM profiles p
      LEFT JOIN recognition_scores r ON r.user_id = p.id
      WHERE ${whereClause}
      ORDER BY p.overall_recognition_score DESC
      LIMIT ? OFFSET ?`;

      const countResult = await db.prepare(countQuery).bind(...filterValues).first() as { total: number } | null;
      const total = Number(countResult?.total || 0);

      const { results } = await db.prepare(dataQuery).bind(...filterValues, limit, offset).all();

      // ── Sanitize PII ──
      const pilots = (results || []).map((row: unknown) => {
        const p = row as Record<string, unknown>;
        const base: Record<string, unknown> = {
          id: p.id,
          pilot_id: p.pilot_id,
          total_flight_hours: p.total_flight_hours,
          overall_recognition_score: p.overall_recognition_score,
          recognition_tier: p.recognition_tier,
          current_level: p.current_level,
          license_type: p.license_type,
          medical_class: p.medical_class,
          elp_level: p.elp_level,
          country_of_license: p.country_of_license,
          ratings: p.ratings,
          subscription_tier: p.subscription_tier,
          status: p.status,
          created_at: p.created_at,
          total_score: p.total_score,
          score_tier: p.score_tier,
        };

        if (canViewPii) {
          base.display_name = p.display_name;
          base.first_name = p.first_name;
          base.last_name = p.last_name;
          base.email = p.email;
          base.phone = p.phone;
          base.license_id = p.license_id;
          base.current_occupation = p.current_occupation;
          base.current_job = p.current_job;
          base.bio = p.bio;
          base.linkedin_url = p.linkedin_url;
          base.domicile = p.domicile;
        }

        return base;
      });

      // ── Audit log ──
      const logId = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO user_activity_log (id, user_id, action, entity_type, entity_id, metadata, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        logId,
        auth.sub,
        'enterprise_pull',
        'profile',
        null,
        JSON.stringify({
          filters: { min_hours: minHours, max_hours: maxHours, country, license_type: licenseType, medical_class: medicalClass, verified_only: verifiedOnly, recognition_plus_only: recognitionPlusOnly, min_score: minScore, rating, language_level: languageLevel, limit, offset },
          results_count: pilots.length,
          total_count: total,
          pii_exposed: canViewPii,
        }),
        new Date().toISOString()
      ).run();

      return {
        pilots,
        pagination: { total, limit, offset, has_more: offset + pilots.length < total },
        filters_applied: {
          min_hours: minHours, max_hours: maxHours, country, license_type: licenseType,
          medical_class: medicalClass, verified_only: verifiedOnly,
          recognition_plus_only: recognitionPlusOnly, min_score: minScore,
          rating, language_level: languageLevel,
        },
      };
    }

    // ── Flight School / ATO ──
    case 'createFlightSchool': {
      const missing = validateRequiredFields(params, ['enterprise_id', 'name']);
      if (missing) throw new Error(missing);
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const referralCode = params.referral_code as string || `FS${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      await db.prepare(`
        INSERT INTO flight_schools (
          id, enterprise_id, name, referral_code, commission_rate, payout_method,
          contact_email, contact_phone, country, website, is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, params.enterprise_id, params.name, referralCode,
        params.commission_rate || 20, params.payout_method || 'bank_transfer',
        params.contact_email || null, params.contact_phone || null,
        params.country || null, params.website || null, 1, now, now
      ).run();
      return db.prepare('SELECT * FROM flight_schools WHERE id = ?').bind(id).first();
    }
    case 'getFlightSchool': {
      const enterpriseId = params.enterprise_id as string;
      if (!enterpriseId) throw new Error('Missing enterprise_id');
      const row = await db.prepare('SELECT * FROM flight_schools WHERE enterprise_id = ? AND is_active = 1').bind(enterpriseId).first();
      if (!row) throw new Error('No flight school found for this enterprise');
      return row;
    }
    case 'getFlightSchoolReferrals': {
      const flightSchoolId = params.flight_school_id as string;
      if (!flightSchoolId) throw new Error('Missing flight_school_id');
      const { results } = await db.prepare('SELECT * FROM flight_school_referrals WHERE flight_school_id = ? ORDER BY created_at DESC LIMIT 200').bind(flightSchoolId).all();
      return results || [];
    }
    case 'getFlightSchoolPayouts': {
      const flightSchoolId = params.flight_school_id as string;
      if (!flightSchoolId) throw new Error('Missing flight_school_id');
      const { results } = await db.prepare('SELECT * FROM flight_school_payouts WHERE flight_school_id = ? ORDER BY created_at DESC LIMIT 100').bind(flightSchoolId).all();
      return results || [];
    }
    case 'getFlightSchoolNotifications': {
      const flightSchoolId = params.flight_school_id as string;
      if (!flightSchoolId) throw new Error('Missing flight_school_id');
      const { results } = await db.prepare('SELECT * FROM flight_school_notifications WHERE flight_school_id = ? ORDER BY created_at DESC LIMIT 50').bind(flightSchoolId).all();
      return results || [];
    }
    case 'createFlightSchoolReferral': {
      const flightSchoolId = params.flight_school_id as string;
      const pilotEmail = params.pilot_email as string;
      if (!flightSchoolId || !pilotEmail) throw new Error('Missing flight_school_id or pilot_email');
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const school = await db.prepare('SELECT referral_code, commission_rate FROM flight_schools WHERE id = ?').bind(flightSchoolId).first() as Record<string, unknown> | null;
      const referralCode = (school?.referral_code as string) || '';
      const commissionRate = (school?.commission_rate as number) || 20;
      const referralLink = `${params.origin as string || ''}/ref/${referralCode}?email=${encodeURIComponent(pilotEmail)}`;
      await db.prepare(`
        INSERT INTO flight_school_referrals (id, flight_school_id, pilot_email, referral_code, referral_link, commission_amount, status, commission_status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(id, flightSchoolId, pilotEmail, referralCode, referralLink, commissionRate * 100, 'pending', 'pending', now, now).run();
      return db.prepare('SELECT * FROM flight_school_referrals WHERE id = ?').bind(id).first();
    }
    case 'markNotificationRead': {
      const id = params.id as string;
      if (!id) throw new Error('Missing id');
      await db.prepare('UPDATE flight_school_notifications SET read = 1 WHERE id = ?').bind(id).run();
      return { success: true };
    }

    // ── Credit System ──
    case 'getCredits': {
      const enterpriseId = params.enterprise_id as string;
      if (!enterpriseId) throw new Error('Missing enterprise_id');
      const row = await db.prepare('SELECT * FROM enterprise_credits WHERE enterprise_id = ?').bind(enterpriseId).first();
      if (!row) return { balance: 0, total_burned: 0, total_topped_up: 0 };
      return row;
    }
    case 'getCreditTransactions': {
      const enterpriseId = params.enterprise_id as string;
      if (!enterpriseId) throw new Error('Missing enterprise_id');
      const limit = Math.min((params.limit as number) || 50, 200);
      const { results } = await db.prepare('SELECT * FROM credit_transactions WHERE enterprise_id = ? ORDER BY created_at DESC LIMIT ?').bind(enterpriseId, limit).all();
      return results || [];
    }
    case 'burnCredit': {
      const enterpriseId = params.enterprise_id as string;
      const amount = Math.abs(params.amount as number || 0);
      const description = params.description as string || 'Verification credit burn';
      const verificationId = params.verification_id as string || null;
      if (!enterpriseId || !amount) throw new Error('Missing enterprise_id or amount');

      // Atomic balance check and deduct
      const creditRow = await db.prepare('SELECT balance FROM enterprise_credits WHERE enterprise_id = ?').bind(enterpriseId).first() as { balance: number } | null;
      const currentBalance = creditRow?.balance || 0;
      if (currentBalance < amount) throw new Error('Insufficient credits');

      const newBalance = currentBalance - amount;
      const now = new Date().toISOString();
      const txId = crypto.randomUUID();

      await db.prepare('UPDATE enterprise_credits SET balance = ?, total_burned = total_burned + ?, updated_at = ? WHERE enterprise_id = ?')
        .bind(newBalance, amount, now, enterpriseId).run();
      await db.prepare('INSERT INTO credit_transactions (id, enterprise_id, type, amount, balance_after, description, verification_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(txId, enterpriseId, 'burn', -amount, newBalance, description, verificationId, now).run();

      return { success: true, balance: newBalance, transaction_id: txId };
    }
    case 'topUpCredits': {
      const enterpriseId = params.enterprise_id as string;
      const amount = Math.abs(params.amount as number || 0);
      if (!enterpriseId || !amount) throw new Error('Missing enterprise_id or amount');
      const now = new Date().toISOString();
      const txId = crypto.randomUUID();

      await db.prepare(`
        INSERT INTO enterprise_credits (id, enterprise_id, balance, total_topped_up, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(enterprise_id) DO UPDATE SET
          balance = balance + excluded.balance,
          total_topped_up = total_topped_up + excluded.total_topped_up,
          updated_at = excluded.updated_at
      `).bind(crypto.randomUUID(), enterpriseId, amount, amount, now).run();

      const row = await db.prepare('SELECT balance FROM enterprise_credits WHERE enterprise_id = ?').bind(enterpriseId).first() as { balance: number };
      await db.prepare('INSERT INTO credit_transactions (id, enterprise_id, type, amount, balance_after, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(txId, enterpriseId, 'top_up', amount, row.balance, `Top-up of ${amount} credits`, now).run();

      return { success: true, balance: row.balance, transaction_id: txId };
    }
    // ── Subscription Tracking ──
    case 'createSubscription': {
      const missing = validateRequiredFields(params, ['subscriber_type', 'subscriber_id', 'tier']);
      if (missing) throw new Error(missing);
      const id = crypto.randomUUID();
      const now = new Date();
      const billingCycle = (params.billing_cycle as string) || 'monthly';
      const periodEnd = new Date(now);
      if (billingCycle === 'monthly') periodEnd.setMonth(periodEnd.getMonth() + 1);
      else if (billingCycle === 'quarterly') periodEnd.setMonth(periodEnd.getMonth() + 3);
      else if (billingCycle === 'yearly') periodEnd.setFullYear(periodEnd.getFullYear() + 1);

      await db.prepare(`
        INSERT INTO subscriptions (id, subscriber_type, subscriber_id, tier, status, billing_cycle, amount_cents, currency,
          payment_provider, provider_subscription_id, current_period_start, current_period_end, cancel_at_period_end, trial_end, metadata, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, params.subscriber_type, params.subscriber_id, params.tier,
        params.status || 'active', billingCycle, params.amount_cents || 0, params.currency || 'USD',
        params.payment_provider || null, params.provider_subscription_id || null,
        now.toISOString(), periodEnd.toISOString(), params.cancel_at_period_end || 0,
        params.trial_end || null, params.metadata ? JSON.stringify(params.metadata) : null,
        now.toISOString(), now.toISOString()
      ).run();

      // Sync to subscriber profile
      const profileTable = params.subscriber_type === 'enterprise' ? 'enterprise_profiles' : 'profiles';
      await db.prepare(`UPDATE ${profileTable} SET subscription_tier = ?, subscription_status = ?, subscription_start_date = ?, subscription_end_date = ?, updated_at = ? WHERE id = ?`)
        .bind(params.tier, params.status || 'active', now.toISOString(), periodEnd.toISOString(), now.toISOString(), params.subscriber_id).run();

      return db.prepare('SELECT * FROM subscriptions WHERE id = ?').bind(id).first();
    }
    case 'getSubscription': {
      const subscriberType = params.subscriber_type as string;
      const subscriberId = params.subscriber_id as string;
      if (!subscriberType || !subscriberId) throw new Error('Missing subscriber_type or subscriber_id');
      const row = await db.prepare('SELECT * FROM subscriptions WHERE subscriber_type = ? AND subscriber_id = ? AND status IN ("active","trial","past_due") ORDER BY current_period_end DESC LIMIT 1').bind(subscriberType, subscriberId).first();
      return row || null;
    }
    case 'renewSubscription': {
      const id = params.id as string;
      if (!id) throw new Error('Missing id');
      const sub = await db.prepare('SELECT * FROM subscriptions WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
      if (!sub) throw new Error('Subscription not found');
      if (sub.cancel_at_period_end === 1) throw new Error('Subscription set to cancel, cannot renew');

      const now = new Date();
      const currentEnd = new Date(sub.current_period_end as string);
      const newEnd = currentEnd > now ? currentEnd : now;
      const billingCycle = sub.billing_cycle as string;
      if (billingCycle === 'monthly') newEnd.setMonth(newEnd.getMonth() + 1);
      else if (billingCycle === 'quarterly') newEnd.setMonth(newEnd.getMonth() + 3);
      else if (billingCycle === 'yearly') newEnd.setFullYear(newEnd.getFullYear() + 1);

      const renewalCount = (sub.renewal_count as number || 0) + 1;
      await db.prepare('UPDATE subscriptions SET current_period_end = ?, renewal_count = ?, status = "active", updated_at = ? WHERE id = ?')
        .bind(newEnd.toISOString(), renewalCount, now.toISOString(), id).run();

      // Sync to subscriber profile
      const profileTable = sub.subscriber_type === 'enterprise' ? 'enterprise_profiles' : 'profiles';
      await db.prepare(`UPDATE ${profileTable} SET subscription_status = "active", subscription_end_date = ?, updated_at = ? WHERE id = ?`)
        .bind(newEnd.toISOString(), now.toISOString(), sub.subscriber_id).run();

      return db.prepare('SELECT * FROM subscriptions WHERE id = ?').bind(id).first();
    }
    case 'cancelSubscription': {
      const id = params.id as string;
      if (!id) throw new Error('Missing id');
      const sub = await db.prepare('SELECT * FROM subscriptions WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
      if (!sub) throw new Error('Subscription not found');
      const now = new Date().toISOString();
      await db.prepare('UPDATE subscriptions SET status = "cancelled", cancel_at_period_end = 1, updated_at = ? WHERE id = ?').bind(now, id).run();
      // Sync to profile
      if (sub.subscriber_type === 'enterprise') {
        await db.prepare('UPDATE enterprise_profiles SET subscription_status = "cancelled", updated_at = ? WHERE id = ?').bind(now, sub.subscriber_id).run();
      } else {
        await dbProfiles.prepare('UPDATE profiles SET subscription_status = "cancelled", updated_at = ? WHERE id = ?').bind(now, sub.subscriber_id).run();
      }
      return { success: true, id };
    }
    case 'checkExpiredSubscriptions': {
      const now = new Date().toISOString();
      const { results } = await db.prepare('SELECT * FROM subscriptions WHERE current_period_end < ? AND status IN ("active","trial","past_due") AND cancel_at_period_end = 0').bind(now).all();
      const expired = (results || []) as Record<string, unknown>[];
      for (const sub of expired) {
        await db.prepare('UPDATE subscriptions SET status = "expired", updated_at = ? WHERE id = ?').bind(now, sub.id).run();
        if (sub.subscriber_type === 'enterprise') {
          await db.prepare('UPDATE enterprise_profiles SET subscription_status = "expired", subscription_tier = "free", updated_at = ? WHERE id = ?').bind(now, sub.subscriber_id).run();
        } else {
          await dbProfiles.prepare('UPDATE profiles SET subscription_status = "expired", subscription_tier = "free", updated_at = ? WHERE id = ?').bind(now, sub.subscriber_id).run();
        }
      }
      return { expired_count: expired.length, ids: expired.map(s => s.id) };
    }

    // ── Leaderboard / Rank ──
    case 'getLeaderboard': {
      const limit = Math.min((params.limit as number) || 50, 200);
      const tierFilter = params.tier_filter as string | undefined;
      let sql = 'SELECT * FROM recognition_scores';
      const binds: unknown[] = [];
      if (tierFilter) {
        sql += ' WHERE score_tier = ?';
        binds.push(tierFilter);
      }
      sql += ' ORDER BY total_score DESC LIMIT ?';
      binds.push(limit);
      const { results } = await dbProfiles.prepare(sql).bind(...binds).all();
      return results || [];
    }
    case 'getUserRank': {
      const userId = params.user_id as string;
      if (!userId) throw new Error('Missing user_id');
      const userScore = await dbProfiles.prepare('SELECT total_score FROM recognition_scores WHERE user_id = ?').bind(userId).first() as { total_score: number } | null;
      if (!userScore) return 0;
      const { results } = await dbProfiles.prepare('SELECT COUNT(*) as count FROM recognition_scores WHERE total_score > ?').bind(userScore.total_score).all();
      return ((results?.[0] as Record<string, unknown>)?.['count'] as number || 0) + 1;
    }
    case 'getScoreStatistics': {
      const userId = params.user_id as string;
      if (!userId) throw new Error('Missing user_id');
      const { results: allScores } = await dbProfiles.prepare('SELECT total_score FROM recognition_scores').all();
      const scores = (allScores || []).map(r => (r as Record<string, unknown>)['total_score'] as number);
      const userRow = await dbProfiles.prepare('SELECT total_score FROM recognition_scores WHERE user_id = ?').bind(userId).first() as { total_score: number } | null;
      const userScore = userRow?.total_score || 0;
      const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      const max = scores.length ? Math.max(...scores) : 0;
      const min = scores.length ? Math.min(...scores) : 0;
      return { user_score: userScore, average: avg, max, min, total_pilots: scores.length };
    }

    // ── Score History ──
    case 'getScoreHistory': {
      const userId = params.user_id as string;
      const scoreType = params.score_type as string | undefined;
      const days = params.days as number | undefined;
      if (!userId) throw new Error('Missing user_id');
      let sql = 'SELECT * FROM score_history WHERE user_id = ?';
      const binds: unknown[] = [userId];
      if (scoreType) { sql += ' AND score_type = ?'; binds.push(scoreType); }
      if (days) { sql += " AND calculated_at >= datetime('now', '-" + days + " days')"; }
      sql += ' ORDER BY calculated_at ASC';
      const { results } = await db.prepare(sql).bind(...binds).all();
      return results || [];
    }
    case 'logScore': {
      const userId = params.user_id as string;
      const scoreType = params.score_type as string;
      const scoreValue = params.score_value as number;
      if (!userId || !scoreType || scoreValue === undefined) throw new Error('Missing params');
      const id = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO score_history (id, user_id, score_type, score_value, calculated_at)
        VALUES (?, ?, ?, ?, datetime('now'))
      `).bind(id, userId, scoreType, scoreValue).run();
      return { id };
    }

    // ── Score Notifications ──
    case 'getScoreNotifications': {
      const userId = params.user_id as string;
      const limit = Math.min((params.limit as number) || 20, 100);
      if (!userId) throw new Error('Missing user_id');
      const { results } = await db.prepare(
        'SELECT * FROM score_notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ?'
      ).bind(userId, limit).all();
      return results || [];
    }
    case 'markNotificationRead': {
      const id = params.id as string;
      if (!id) throw new Error('Missing id');
      await db.prepare('UPDATE score_notifications SET read = 1 WHERE id = ?').bind(id).run();
      return { updated: true };
    }
    case 'markAllNotificationsRead': {
      const userId = params.user_id as string;
      if (!userId) throw new Error('Missing user_id');
      await db.prepare('UPDATE score_notifications SET read = 1 WHERE user_id = ? AND read = 0').bind(userId).run();
      return { updated: true };
    }

    // ── Activity Log ──
    case 'logActivity': {
      const userId = params.user_id as string;
      const activityType = params.activity_type as string;
      if (!userId || !activityType) throw new Error('Missing user_id or activity_type');
      const id = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO user_activity_log (id, user_id, activity_type, activity_details, ip_address, user_agent, created_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `).bind(
        id, userId, activityType,
        JSON.stringify(params.activity_details || {}),
        params.ip_address || null,
        params.user_agent || null
      ).run();
      return { id };
    }

    // ── Completion Tracking ──
    case 'getCompletionTracking': {
      const userId = params.user_id as string;
      if (!userId) throw new Error('Missing user_id');
      const { results } = await db.prepare(
        'SELECT * FROM completion_tracking WHERE user_id = ? ORDER BY updated_at DESC'
      ).bind(userId).all();
      return results || [];
    }
    case 'createCompletionTracking': {
      const id = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO completion_tracking (id, user_id, item_id, item_type, item_title, completion_percentage, status, started_at, time_spent_hours, score)
        VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, ?)
      `).bind(
        id, params.user_id, params.item_id || null, params.item_type, params.item_title,
        params.completion_percentage || 0, params.status || 'in_progress',
        params.time_spent_hours || 0, params.score || null
      ).run();
      return db.prepare('SELECT * FROM completion_tracking WHERE id = ?').bind(id).first();
    }
    case 'updateCompletionTracking': {
      const id = params.id as string;
      if (!id) throw new Error('Missing id');
      const sets: string[] = [];
      const values: unknown[] = [];
      for (const key of ['completion_percentage', 'status', 'completed_at', 'time_spent_hours', 'score']) {
        if (key in params) { sets.push(`${key} = ?`); values.push(params[key]); }
      }
      if (sets.length === 0) throw new Error('No fields to update');
      sets.push("updated_at = datetime('now')");
      values.push(id);
      await db.prepare(`UPDATE completion_tracking SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();
      return db.prepare('SELECT * FROM completion_tracking WHERE id = ?').bind(id).first();
    }

    // ── Goal Tracking ──
    case 'getGoalTracking': {
      const userId = params.user_id as string;
      if (!userId) throw new Error('Missing user_id');
      const { results } = await db.prepare(
        'SELECT * FROM goal_tracking WHERE user_id = ? ORDER BY created_at DESC'
      ).bind(userId).all();
      return results || [];
    }
    case 'createGoal': {
      const id = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO goal_tracking (id, user_id, goal_title, goal_type, target_value, current_value, unit, deadline, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, params.user_id, params.goal_title, params.goal_type,
        params.target_value, params.current_value || 0, params.unit,
        params.deadline || null, params.status || 'not_started'
      ).run();
      return db.prepare('SELECT * FROM goal_tracking WHERE id = ?').bind(id).first();
    }
    case 'updateGoal': {
      const id = params.id as string;
      if (!id) throw new Error('Missing id');
      const sets: string[] = [];
      const values: unknown[] = [];
      for (const key of ['current_value', 'status', 'updated_at']) {
        if (key in params) { sets.push(`${key} = ?`); values.push(params[key]); }
      }
      if (sets.length === 0) sets.push("updated_at = datetime('now')");
      else sets.push("updated_at = datetime('now')");
      values.push(id);
      await db.prepare(`UPDATE goal_tracking SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();
      return db.prepare('SELECT * FROM goal_tracking WHERE id = ?').bind(id).first();
    }
    case 'deleteGoal': {
      const id = params.id as string;
      if (!id) throw new Error('Missing id');
      await db.prepare('DELETE FROM goal_tracking WHERE id = ?').bind(id).run();
      return { deleted: true };
    }

    // ── AI Coaching ──
    case 'getCoachingActions': {
      const pilotId = params.pilot_id as string;
      if (!pilotId) throw new Error('Missing pilot_id');
      const { results } = await db.prepare(
        'SELECT * FROM ai_coaching_actions WHERE pilot_id = ? ORDER BY created_at DESC'
      ).bind(pilotId).all();
      return results || [];
    }
    case 'createCoachingAction': {
      const id = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO ai_coaching_actions (id, pilot_id, action_type, description, score_boost, completed)
        VALUES (?, ?, ?, ?, ?, 0)
      `).bind(id, params.pilot_id, params.action_type, params.description, params.score_boost || 0).run();
      return db.prepare('SELECT * FROM ai_coaching_actions WHERE id = ?').bind(id).first();
    }
    case 'completeCoachingAction': {
      const id = params.id as string;
      if (!id) throw new Error('Missing id');
      await db.prepare(`
        UPDATE ai_coaching_actions SET completed = 1, completed_at = datetime('now') WHERE id = ?
      `).bind(id).run();
      return db.prepare('SELECT * FROM ai_coaching_actions WHERE id = ?').bind(id).first();
    }
    case 'getBoostHistory': {
      const pilotId = params.pilot_id as string;
      if (!pilotId) throw new Error('Missing pilot_id');
      const { results } = await db.prepare(
        'SELECT * FROM score_boost_history WHERE pilot_id = ? ORDER BY timestamp DESC LIMIT 50'
      ).bind(pilotId).all();
      return results || [];
    }
    case 'logBoost': {
      const id = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO score_boost_history (id, pilot_id, action_id, score_before, score_after, boost_amount)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        id, params.pilot_id, params.action_id,
        params.score_before, params.score_after, params.boost_amount
      ).run();
      return { id };
    }

    // ── Mentorship ──
    case 'createMentorshipRequest': {
      const missing = validateRequiredFields(params, ['mentee_id', 'mentor_id']);
      if (missing) throw new Error(missing);
      const id = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO mentorship_requests (id, mentee_id, mentor_id, status, message, created_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
      `).bind(id, params.mentee_id, params.mentor_id, params.status || 'pending', params.message || null).run();
      return { id };
    }

    // ── Generic Table Operations ──
    case 'queryTable': {
      const table = params.table as string;
      const operation = params.operation as string;
      if (!table || !operation) throw new Error('Missing table or operation');
      const allowedTables = new Set([
        'profiles', 'recognition_scores', 'payments',
        'enterprise_profiles', 'score_history', 'score_notifications', 'completion_tracking',
        'goal_tracking', 'ai_coaching_actions', 'score_boost_history', 'user_activity_log',
        'mentorship_requests', 'mentorship_messages', 'mentorship_badges', 'mentorship_sessions',
        'peer_endorsements', 'efb_uploads', 'logbook_entries', 'sim_sessions', 'alumni_network',
        'event_attendance', 'forum_posts', 'learning_hours', 'pilot_documents',
        'pilot_platform_connections', 'logbook_hour_tokens', 'p12_verification_events',
        'efb_complexity_tokens', 'sim_session_tokens',
        'mfa_secrets', 'referral_conversions', 'referral_partners', 'user_app_access'
      ]);
      if (!allowedTables.has(table)) throw new Error(`Table '${table}' not allowed`);

      if (operation === 'select') {
        const where = params.where as Record<string, unknown> | undefined;
        const orderBy = params.orderBy as string | undefined;
        const limit = Math.min((params.limit as number) || 200, 500);
        let sql = `SELECT * FROM ${table} WHERE 1=1`;
        const binds: unknown[] = [];
        if (where) {
          for (const [key, val] of Object.entries(where)) {
            if (val !== undefined && val !== null) {
              sql += ` AND ${key} = ?`;
              binds.push(val);
            }
          }
        }
        if (orderBy) sql += ` ORDER BY ${orderBy}`;
        sql += ' LIMIT ?';
        binds.push(limit);
        const { results } = await db.prepare(sql).bind(...binds).all();
        return results || [];
      }

      if (operation === 'insert') {
        const data = params.data as Record<string, unknown>;
        if (!data) throw new Error('Missing data');
        const id = crypto.randomUUID();
        const cols = ['id', ...Object.keys(data)];
        const vals = [id, ...Object.values(data)];
        const placeholders = vals.map(() => '?').join(', ');
        await db.prepare(`INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders})`).bind(...vals).run();
        return { id };
      }

      if (operation === 'update') {
        const id = params.id as string;
        const data = params.data as Record<string, unknown>;
        if (!id || !data) throw new Error('Missing id or data');
        const sets: string[] = [];
        const values: unknown[] = [];
        for (const [key, val] of Object.entries(data)) {
          if (val !== undefined) { sets.push(`${key} = ?`); values.push(val); }
        }
        if (sets.length === 0) throw new Error('No fields to update');
        sets.push("updated_at = datetime('now')");
        values.push(id);
        await db.prepare(`UPDATE ${table} SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();
        return { updated: true };
      }

      if (operation === 'delete') {
        const id = params.id as string;
        if (!id) throw new Error('Missing id');
        await db.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
        return { deleted: true };
      }

      if (operation === 'count') {
        const where = params.where as Record<string, unknown> | undefined;
        let sql = `SELECT COUNT(*) as count FROM ${table} WHERE 1=1`;
        const binds: unknown[] = [];
        if (where) {
          for (const [key, val] of Object.entries(where)) {
            if (val !== undefined && val !== null) {
              sql += ` AND ${key} = ?`;
              binds.push(val);
            }
          }
        }
        const result = await db.prepare(sql).bind(...binds).first() as { count: number } | null;
        return { count: result?.count || 0 };
      }

      throw new Error(`Unknown operation: ${operation}`);
    }

    // ── Generic Profile Query ──
    case 'queryProfiles': {
      const role = params.role as string | undefined;
      const status = params.status as string | undefined;
      const limit = Math.min((params.limit as number) || 200, 500);
      let sql = 'SELECT * FROM profiles WHERE 1=1';
      const binds: unknown[] = [];
      if (role) { sql += ' AND role = ?'; binds.push(role); }
      if (status) { sql += ' AND status = ?'; binds.push(status); }
      sql += ' ORDER BY created_at DESC LIMIT ?';
      binds.push(limit);
      const { results } = await db.prepare(sql).bind(...binds).all();
      return results || [];
    }

    // ── Admin ──
    case 'getAllPilots': {
      const me = await getProfileByAuth0Id(dbProfiles, auth.sub);
      if (!me || me['role'] !== 'super_admin') throw new Error('Forbidden');
      const { results } = await dbProfiles.prepare('SELECT * FROM profiles ORDER BY created_at DESC LIMIT 500').all();
      return results || [];
    }
    case 'updateUserTier': {
      const me = await getProfileByAuth0Id(dbProfiles, auth.sub);
      if (!me || me['role'] !== 'super_admin') throw new Error('Forbidden');
      const userId = params.user_id as string;
      const tier = params.tier as string;
      if (!userId || !tier) throw new Error('Missing user_id or tier');
      await dbProfiles.prepare(`
        UPDATE profiles SET subscription_tier = ?, subscription_status = 'active', updated_at = datetime('now') WHERE id = ?
      `).bind(tier, userId).run();
      return getProfileById(dbProfiles, userId);
    }

    case 'deleteAccount': {
      const userId = params.userId as string;
      if (!userId) throw new Error('Missing userId');
      // Cascade delete pilot data
      await dbProfiles.prepare('DELETE FROM profiles WHERE id = ?').bind(userId).run();
      await dbProfiles.prepare('DELETE FROM recognition_scores WHERE user_id = ?').bind(userId).run();
      // Cascade delete platform data
      await db.prepare('DELETE FROM payments WHERE user_id = ?').bind(userId).run();
      await db.prepare('DELETE FROM score_history WHERE user_id = ?').bind(userId).run();
      await db.prepare('DELETE FROM score_notifications WHERE user_id = ?').bind(userId).run();
      await db.prepare('DELETE FROM user_activity_log WHERE user_id = ?').bind(userId).run();
      await db.prepare('DELETE FROM user_app_access WHERE user_id = ?').bind(userId).run();
      return { deleted: true };
    }

    case 'provisionWallet': {
      // TODO: Implement real wallet provisioning
      return { success: true, walletId: crypto.randomUUID() };
    }

    case 'generateReferral': {
      const profileId = params.profileId as string;
      if (!profileId) return { success: false, error: 'profileId required' };

      // Check if profile already has a referral code
      const existing = await env.DB_PROFILES.prepare(`
        SELECT referral_code, display_name, email FROM profiles WHERE id = ?
      `).bind(profileId).first() as Record<string, unknown> | null;

      if (existing?.['referral_code']) {
        return { success: true, referralCode: existing['referral_code'] };
      }

      const code = `REF${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
      await env.DB_PROFILES.prepare(`
        UPDATE profiles SET referral_code = ? WHERE id = ?
      `).bind(code, profileId).run();

      // Auto-create partner record so webhook can credit them
      const partnerId = crypto.randomUUID();
      await env.DB_OPS.prepare(`
        INSERT INTO referral_partners
        (id, profile_id, name, email, partner_type, referral_code, is_active, commission_rate, total_referrals, total_payouts, pending_payouts)
        VALUES (?, ?, ?, ?, ?, ?, 1, 20, 0, 0, 0)
      `).bind(
        partnerId,
        profileId,
        existing?.['display_name'] || 'Pilot',
        existing?.['email'] || null,
        'pilot',
        code
      ).run();

      return { success: true, referralCode: code };
    }

    case 'sendAccountCreatedEmail': {
      // TODO: Integrate Resend for account creation emails
      return { success: true };
    }

    case 'issuerSign': {
      // TODO: Migrate issuer-sign edge function logic into Worker (needs signing key env)
      return { success: false, error: 'issuerSign not yet migrated to Worker. Use legacy issuer endpoint.' };
    }

    case 'mfbTokenExchange': {
      // TODO: Migrate mfb-token-exchange edge function into Worker
      return { success: false, error: 'mfbTokenExchange not yet migrated to Worker' };
    }

    // ── ATO Bulk Voucher System ──
    case 'createVoucherBatch': {
      const missing = validateRequiredFields(params, ['enterprise_id', 'batch_name', 'quantity']);
      if (missing) throw new Error(missing);
      const batchId = crypto.randomUUID();
      const now = new Date().toISOString();
      const qty = Number(params.quantity);
      await db.prepare(`
        INSERT INTO bulk_voucher_batches (id, enterprise_id, batch_name, tier, amount_cents, quantity, codes_generated, codes_redeemed, expires_at, status, payment_status, metadata, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        batchId, params.enterprise_id, params.batch_name,
        params.tier || 'recognition_plus', params.amount_cents || 2900, qty, 0, 0,
        params.expires_at || null, 'active', 'pending', params.metadata ? JSON.stringify(params.metadata) : null, now, now
      ).run();
      return db.prepare('SELECT * FROM bulk_voucher_batches WHERE id = ?').bind(batchId).first();
    }
    case 'purchaseVoucherBatch': {
      const batchId = params.batch_id as string;
      if (!batchId) throw new Error('Missing batch_id');
      if (!env.DODO_API_KEY) throw new Error('Checkout not configured');

      const batch = await db.prepare('SELECT * FROM bulk_voucher_batches WHERE id = ?').bind(batchId).first() as Record<string, unknown> | null;
      if (!batch) throw new Error('Batch not found');
      if (batch.payment_status === 'paid') throw new Error('Batch already paid');

      const totalCents = Number(batch.amount_cents) * Number(batch.quantity);
      const enterprise = await db.prepare('SELECT company_name, contact_email FROM enterprise_profiles WHERE id = ?').bind(batch.enterprise_id).first() as Record<string, unknown> | null;

      const dodoRes = await fetch('https://live.dodopayments.com/v1/checkouts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.DODO_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_cart: [{ product_id: env.DODO_PRODUCT_ID_RECOGNITION_PLUS || 'voucher_batch', quantity: Number(batch.quantity) }],
          customer: {
            email: (enterprise?.['contact_email'] as string) || 'enterprise@pilotrecognition.com',
            name: (enterprise?.['company_name'] as string) || 'Enterprise',
          },
          metadata: {
            batch_id: batchId,
            enterprise_id: batch.enterprise_id,
            type: 'voucher_batch',
            quantity: batch.quantity,
            amount_cents_per_voucher: batch.amount_cents,
          },
          return_url: `https://pilotterminal.com/enterprise/vouchers?batch=${batchId}&checkout=success`,
          cancel_url: `https://pilotterminal.com/enterprise/vouchers?batch=${batchId}&checkout=cancelled`,
        }),
      });
      if (!dodoRes.ok) {
        const errText = await dodoRes.text();
        console.error('[VoucherCheckout] Dodo error:', dodoRes.status, errText);
        throw new Error('Payment provider error');
      }
      const dodoData = await dodoRes.json() as { checkout_url?: string; session_id?: string };
      if (dodoData.session_id) {
        await db.prepare('UPDATE bulk_voucher_batches SET dodo_checkout_id = ? WHERE id = ?').bind(dodoData.session_id, batchId).run();
      }
      return { checkout_url: dodoData.checkout_url, session_id: dodoData.session_id, total_cents: totalCents };
    }
    case 'generateVoucherCodes': {
      const batchId = params.batch_id as string;
      if (!batchId) throw new Error('Missing batch_id');
      const batch = await db.prepare('SELECT * FROM bulk_voucher_batches WHERE id = ?').bind(batchId).first() as Record<string, unknown> | null;
      if (!batch) throw new Error('Batch not found');
      if (batch.status !== 'active') throw new Error('Batch not active');

      const qty = Number(batch.quantity);
      const enterpriseId = String(batch.enterprise_id);
      const batchName = String(batch.batch_name).replace(/\s+/g, '').toUpperCase().slice(0, 10);
      const now = new Date().toISOString();
      const codes: string[] = [];

      for (let i = 0; i < qty; i++) {
        const code = `ATO-${batchName}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
        codes.push(code);
        await db.prepare('INSERT INTO bulk_voucher_codes (id, batch_id, code, status, created_at) VALUES (?, ?, ?, ?, ?)')
          .bind(crypto.randomUUID(), batchId, code, 'unused', now).run();
      }

      await db.prepare('UPDATE bulk_voucher_batches SET codes_generated = ? WHERE id = ?').bind(qty, batchId).run();
      return { generated: qty, codes };
    }
    case 'getVoucherBatches': {
      const enterpriseId = params.enterprise_id as string;
      if (!enterpriseId) throw new Error('Missing enterprise_id');
      const { results } = await db.prepare('SELECT * FROM bulk_voucher_batches WHERE enterprise_id = ? ORDER BY created_at DESC LIMIT 50').bind(enterpriseId).all();
      return results || [];
    }
    case 'getVoucherCodes': {
      const batchId = params.batch_id as string;
      if (!batchId) throw new Error('Missing batch_id');
      const { results } = await db.prepare('SELECT * FROM bulk_voucher_codes WHERE batch_id = ? ORDER BY created_at DESC').bind(batchId).all();
      return results || [];
    }
    case 'redeemVoucher': {
      const code = (params.code as string)?.trim().toUpperCase();
      if (!code) throw new Error('Missing code');
      const pilotId = params.pilot_id as string;
      if (!pilotId) throw new Error('Missing pilot_id');

      const voucher = await db.prepare('SELECT * FROM bulk_voucher_codes WHERE code = ?').bind(code).first() as Record<string, unknown> | null;
      if (!voucher) throw new Error('Invalid voucher code');
      if (voucher.status !== 'unused') throw new Error('Voucher already used or expired');

      const batch = await db.prepare('SELECT * FROM bulk_voucher_batches WHERE id = ?').bind(voucher.batch_id).first() as Record<string, unknown> | null;
      if (!batch) throw new Error('Batch not found');
      if (batch.status !== 'active') throw new Error('Batch not active');
      if (batch.expires_at && new Date(batch.expires_at as string) < new Date()) throw new Error('Batch expired');

      const now = new Date().toISOString();
      // Mark voucher redeemed
      await db.prepare('UPDATE bulk_voucher_codes SET status = "redeemed", redeemed_by = ?, redeemed_at = ? WHERE id = ?')
        .bind(pilotId, now, voucher.id).run();
      // Update batch stats
      await db.prepare('UPDATE bulk_voucher_batches SET codes_redeemed = codes_redeemed + 1 WHERE id = ?').bind(voucher.batch_id).run();
      // Grant tier to pilot
      const tier = String(batch.tier || 'recognition_plus');
      await dbProfiles.prepare('UPDATE profiles SET subscription_tier = ?, subscription_status = "active", updated_at = ? WHERE id = ?')
        .bind(tier, now, pilotId).run();

      return { success: true, tier, redeemed_at: now };
    }
    case 'revokeVoucher': {
      const id = params.id as string;
      if (!id) throw new Error('Missing id');
      await db.prepare('UPDATE bulk_voucher_codes SET status = "revoked" WHERE id = ?').bind(id).run();
      return { success: true };
    }

    // ── Referral Payout Automation ──
    case 'triggerReferralPayout': {
      // Trigger a manual $20 payout to a partner (admin only)
      const me = await getProfileByAuth0Id(dbProfiles, auth.sub);
      if (!me || me['role'] !== 'super_admin') throw new Error('Forbidden');

      const partnerId = params.partner_id as string;
      if (!partnerId) throw new Error('Missing partner_id');

      const partner = await db.prepare('SELECT * FROM referral_partners WHERE id = ?').bind(partnerId).first() as Record<string, unknown> | null;
      if (!partner) throw new Error('Partner not found');
      if ((partner.pending_payouts as number || 0) <= 0) throw new Error('No pending payouts');

      const payoutAmount = partner.pending_payouts as number;
      const now = new Date().toISOString();

      // Record payout
      const payoutId = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO flight_school_payouts (id, flight_school_id, amount, status, payout_method, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(payoutId, partnerId, payoutAmount, 'completed', partner.email || 'bank_transfer', now).run();

      // Update partner
      await db.prepare(`
        UPDATE referral_partners SET total_payouts = total_payouts + ?, pending_payouts = 0, updated_at = ? WHERE id = ?
      `).bind(payoutAmount, now, partnerId).run();

      // Mark all pending conversions as paid
      await db.prepare('UPDATE referral_conversions SET commission_status = "paid", paid_at = ? WHERE partner_id = ? AND commission_status = "pending"')
        .bind(now, partnerId).run();

      return { success: true, payout_id: payoutId, amount: payoutAmount };
    }
    case 'getReferralPartners': {
      const { results } = await db.prepare('SELECT * FROM referral_partners ORDER BY total_referrals DESC LIMIT 200').all();
      return results || [];
    }
    case 'getReferralConversions': {
      const partnerId = params.partner_id as string;
      let sql = 'SELECT * FROM referral_conversions';
      const binds: unknown[] = [];
      if (partnerId) { sql += ' WHERE partner_id = ?'; binds.push(partnerId); }
      sql += ' ORDER BY subscribed_at DESC LIMIT 200';
      const { results } = await db.prepare(sql).bind(...binds).all();
      return results || [];
    }

    // ── Logbook Provider Integration ──
    case 'getLogbookProviders': {
      const { results } = await db.prepare(`
        SELECT id, name, provider_type, country, website, user_count, tier, certification_status,
               is_active, created_at
        FROM logbook_providers WHERE is_active = 1 ORDER BY user_count DESC
      `).all();
      return results || [];
    }
    // ── In-App Notifications ──
    case 'getNotifications': {
      const userId = params.user_id as string;
      if (!userId) throw new Error('Missing user_id');
      const limit = Math.min((params.limit as number) || 50, 200);
      const unreadOnly = params.unread_only === true || params.unread_only === 'true';
      let sql = 'SELECT * FROM notifications WHERE user_id = ?';
      const binds: unknown[] = [userId];
      if (unreadOnly) { sql += ' AND read_at IS NULL'; }
      sql += ' ORDER BY created_at DESC LIMIT ?';
      binds.push(limit);
      const { results } = await db.prepare(sql).bind(...binds).all();
      return results || [];
    }

    // ── Flight Hours Diary (self-reported blocks — NOT a regulatory logbook) ──
    case 'getFlightHours': {
      const profile = await getProfileByAuth0Id(dbProfiles, auth.sub);
      if (!profile) throw new Error('Not found');
      const claims = await dbProfiles.prepare(
        'SELECT COALESCE(SUM(total_hours),0) as claimed_total, COALESCE(SUM(pic_hours),0) as claimed_pic FROM pilot_flight_log_batches WHERE pilot_profile_id = ? AND status != "rejected"'
      ).bind(profile['id']).first() as Record<string, unknown>;
      const verified = await env.DB_TRACE.prepare(
        'SELECT total_hours, pic_hours, night_hours, instrument_hours, cross_country_hours, multi_engine_hours, jet_hours, turbine_hours, simulator_hours FROM pilot_flight_hours WHERE pilot_profile_id = ?'
      ).bind(profile['id']).first() as Record<string, unknown> | null;
      return {
        claimed: { total_hours: claims['claimed_total'], pic_hours: claims['claimed_pic'] },
        verified: verified || null,
        disclaimer: 'These hours are self-reported claims for pathway-matching only. They are NOT a regulatory logbook and cannot be used for licensing or certification.',
      };
    }
    case 'getFlightLogBatches': {
      const profile = await getProfileByAuth0Id(dbProfiles, auth.sub);
      if (!profile) throw new Error('Not found');
      const { results } = await dbProfiles.prepare(
        'SELECT id, batch_name, source, entry_count, date_from, date_to, total_hours, pic_hours, night_hours, instrument_hours, status, verified_by, verified_at, trace_record_id, uploaded_at FROM pilot_flight_log_batches WHERE pilot_profile_id = ? ORDER BY uploaded_at DESC'
      ).bind(profile['id']).all();
      return results || [];
    }
    case 'importFlightLogCSV': {
      const profile = await getProfileByAuth0Id(dbProfiles, auth.sub);
      if (!profile) throw new Error('Not found');
      const pilotId = profile['id'] as string;
      const csvText = params.csv as string;
      if (!csvText || typeof csvText !== 'string') throw new Error('Missing csv param');

      const lines = csvText.split(/\r?\n/).filter(l => l.trim());
      if (lines.length < 2) throw new Error('CSV must have header and at least one data row');
      const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''));
      const colMap: Record<string, number> = {};
      headers.forEach((h, i) => { colMap[h] = i; });
      const getCol = (names: string[]) => {
        for (const n of names) { const idx = colMap[n]; if (idx !== undefined) return idx; }
        return -1;
      };
      const dateCol = getCol(['date', 'flight_date', 'day']);
      const totalCol = getCol(['total_time', 'total', 'duration', 'flight_time', 'time']);
      const picCol = getCol(['pic', 'pilot_in_command', 'pic_time']);
      const nightCol = getCol(['night', 'night_time']);
      const imcCol = getCol(['instrument', 'imc', 'instrument_time', 'ifr']);
      const xcCol = getCol(['cross_country', 'xc', 'cross_country_time']);
      const multiCol = getCol(['multi_engine', 'multi', 'multi_time']);
      const simCol = getCol(['simulator', 'sim', 'sim_time', 'simulator_time']);

      let totalH = 0, picH = 0, nightH = 0, imcH = 0, xcH = 0, multiH = 0, simH = 0;
      let entryCount = 0;
      let dateFrom: string | null = null;
      let dateTo: string | null = null;

      for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);
        if (cols.length < 2 || !cols[0]) continue;
        entryCount++;
        const parseTime = (idx: number) => {
          if (idx < 0 || idx >= cols.length) return 0;
          const v = cols[idx].replace(/[^0-9.]/g, '');
          return v ? parseFloat(v) : 0;
        };
        totalH += parseTime(totalCol);
        picH += parseTime(picCol);
        nightH += parseTime(nightCol);
        imcH += parseTime(imcCol);
        xcH += parseTime(xcCol);
        multiH += parseTime(multiCol);
        simH += parseTime(simCol);
        if (dateCol >= 0) {
          const d = cols[dateCol];
          if (d && (!dateFrom || d < dateFrom)) dateFrom = d;
          if (d && (!dateTo || d > dateTo)) dateTo = d;
        }
      }

      const batchId = crypto.randomUUID();
      const now = new Date().toISOString();
      await dbProfiles.prepare(`
        INSERT INTO pilot_flight_log_batches
        (id, pilot_profile_id, batch_name, source, entry_count, date_from, date_to, total_hours, pic_hours, night_hours, instrument_hours, cross_country_hours, multi_engine_hours, simulator_hours, status, file_name, uploaded_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(batchId, pilotId, (params.batch_name as string) || 'CSV Import', 'csv_import', entryCount, dateFrom, dateTo, totalH, picH, nightH, imcH, xcH, multiH, simH, 'self_reported', (params.file_name as string) || 'import.csv', now).run();

      return { batch_id: batchId, entry_count: entryCount, totals: { total_hours: totalH, pic_hours: picH, night_hours: nightH, instrument_hours: imcH }, status: 'self_reported' };
    }
    case 'requestBatchVerification': {
      const batchId = params.batch_id as string;
      if (!batchId) throw new Error('Missing batch_id');
      const profile = await getProfileByAuth0Id(dbProfiles, auth.sub);
      if (!profile) throw new Error('Not found');
      // Require Recognition+ subscription to verify flight hours
      const tier = (profile['subscription_tier'] as string) || 'free';
      const subStatus = (profile['subscription_status'] as string) || 'inactive';
      if (!['recognition_plus', 'enterprise'].includes(tier) || subStatus !== 'active') {
        throw new Error('Flight hours verification requires an active Recognition+ subscription');
      }
      const batch = await dbProfiles.prepare(
        'SELECT id, pilot_profile_id, status FROM pilot_flight_log_batches WHERE id = ?'
      ).bind(batchId).first() as Record<string, unknown> | null;
      if (!batch) throw new Error('Batch not found');
      if (batch['pilot_profile_id'] !== profile['id']) throw new Error('Forbidden');
      if (batch['status'] !== 'self_reported') throw new Error('Batch already processed');
      await dbProfiles.prepare(
        'UPDATE pilot_flight_log_batches SET status = ? WHERE id = ?'
      ).bind('pending_verification', batchId).run();
      return { batch_id: batchId, status: 'pending_verification' };
    }

    // ── Admin: verify flight log batch (called from admin portal after ATO/CFI confirmation) ──
    case 'adminVerifyFlightLogBatch': {
      // Only super_admin can verify batches
      const me = await getProfileByAuth0Id(dbProfiles, auth.sub);
      if (!me || me['role'] !== 'super_admin') throw new Error('Forbidden: super_admin required');

      const batchId = params.batch_id as string;
      const verificationNotes = (params.verification_notes as string) || '';
      const verifiedBy = (params.verified_by as string) || '';
      const cfiName = (params.cfi_name as string) || '';
      const cfiLicense = (params.cfi_license as string) || '';
      const atoName = (params.ato_name as string) || '';
      const signedDocumentUrl = (params.signed_document_url as string) || '';
      if (!batchId) throw new Error('Missing batch_id');

      const batch = await dbProfiles.prepare(
        'SELECT * FROM pilot_flight_log_batches WHERE id = ? AND status = ?'
      ).bind(batchId, 'pending_verification').first() as Record<string, unknown> | null;
      if (!batch) throw new Error('Batch not found or not pending verification');

      const pilotProfileId = batch['pilot_profile_id'] as string;
      const now = new Date().toISOString();
      const traceId = crypto.randomUUID();

      // Insert verified hours into DB_TRACE audit table
      await env.DB_TRACE.prepare(`
        INSERT INTO pilot_flight_hours
        (id, pilot_profile_id, total_hours, pic_hours, night_hours, instrument_hours, cross_country_hours, multi_engine_hours, jet_hours, turbine_hours, simulator_hours, source, verified_by, verified_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        traceId, pilotProfileId,
        batch['total_hours'] || 0, batch['pic_hours'] || 0, batch['night_hours'] || 0,
        batch['instrument_hours'] || 0, batch['cross_country_hours'] || 0,
        batch['multi_engine_hours'] || 0, batch['jet_hours'] || 0,
        batch['turbine_hours'] || 0, batch['simulator_hours'] || 0,
        'recognition_plus_verified', verifiedBy || 'admin', now, now, now
      ).run();

      // Link batch to trace record and mark verified
      await dbProfiles.prepare(`
        UPDATE pilot_flight_log_batches
        SET status = ?, verified_by = ?, verification_notes = ?, verified_at = ?, trace_record_id = ?
        WHERE id = ?
      `).bind('verified', verifiedBy || 'admin', verificationNotes, now, traceId, batchId).run();

      // Store CFI/ATO signature evidence in trace audit trail
      await env.DB_TRACE.prepare(`
        INSERT INTO verification_audit_trail
        (id, verification_id, pilot_profile_id, action, actor_id, actor_type, previous_status, new_status, evidence_url, notes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        crypto.randomUUID(), traceId, pilotProfileId,
        'flight_hours_verified',
        verifiedBy || 'admin', 'recognition_plus_admin',
        'pending_verification', 'verified',
        signedDocumentUrl || null,
        JSON.stringify({ cfi_name: cfiName, cfi_license: cfiLicense, ato_name: atoName, batch_id: batchId, verification_notes: verificationNotes }),
        now
      ).run();

      return {
        batch_id: batchId,
        status: 'verified',
        trace_record_id: traceId,
        verified_at: now,
        verified_by: verifiedBy || 'admin',
      };
    }

    // ── Admin: list pending flight log batches ──
    case 'getPendingVerificationBatches': {
      const me = await getProfileByAuth0Id(dbProfiles, auth.sub);
      if (!me || me['role'] !== 'super_admin') throw new Error('Forbidden: super_admin required');
      const limit = Math.min((params.limit as number) || 50, 200);
      const offset = (params.offset as number) || 0;
      const { results } = await dbProfiles.prepare(`
        SELECT b.*, p.display_name as pilot_name, p.email as pilot_email, p.public_slug as pilot_slug
        FROM pilot_flight_log_batches b
        LEFT JOIN profiles p ON b.pilot_profile_id = p.id
        WHERE b.status = ?
        ORDER BY b.uploaded_at DESC
        LIMIT ? OFFSET ?
      `).bind('pending_verification', limit, offset).all();
      return results || [];
    }

    // ── Admin: get single batch details (with pilot info and audit trail) ──
    case 'getBatchDetails': {
      const me = await getProfileByAuth0Id(dbProfiles, auth.sub);
      if (!me || me['role'] !== 'super_admin') throw new Error('Forbidden: super_admin required');
      const batchId = params.batch_id as string;
      if (!batchId) throw new Error('Missing batch_id');
      const batch = await dbProfiles.prepare(`
        SELECT b.*, p.display_name as pilot_name, p.email as pilot_email, p.phone as pilot_phone,
               p.country_of_license, p.license_id, p.current_occupation
        FROM pilot_flight_log_batches b
        LEFT JOIN profiles p ON b.pilot_profile_id = p.id
        WHERE b.id = ?
      `).bind(batchId).first() as Record<string, unknown> | null;
      if (!batch) throw new Error('Batch not found');
      // Get audit trail from DB_TRACE if verified
      let auditTrail: Record<string, unknown>[] = [];
      if (batch['trace_record_id']) {
        const { results } = await env.DB_TRACE.prepare(`
          SELECT * FROM verification_audit_trail WHERE verification_id = ? ORDER BY created_at DESC
        `).bind(batch['trace_record_id']).all();
        auditTrail = (results || []) as Record<string, unknown>[];
      }
      return { batch, audit_trail: auditTrail };
    }

    // ── Admin: reject a flight log batch ──
    case 'rejectFlightLogBatch': {
      const me = await getProfileByAuth0Id(dbProfiles, auth.sub);
      if (!me || me['role'] !== 'super_admin') throw new Error('Forbidden: super_admin required');
      const batchId = params.batch_id as string;
      const rejectionReason = (params.rejection_reason as string) || '';
      if (!batchId) throw new Error('Missing batch_id');
      const batch = await dbProfiles.prepare(
        'SELECT * FROM pilot_flight_log_batches WHERE id = ? AND status = ?'
      ).bind(batchId, 'pending_verification').first() as Record<string, unknown> | null;
      if (!batch) throw new Error('Batch not found or not pending verification');
      const now = new Date().toISOString();
      await dbProfiles.prepare(
        'UPDATE pilot_flight_log_batches SET status = ?, verification_notes = ?, verified_at = ? WHERE id = ?'
      ).bind('rejected', rejectionReason, now, batchId).run();
      // Log rejection in audit trail
      await env.DB_TRACE.prepare(`
        INSERT INTO verification_audit_trail
        (id, verification_id, pilot_profile_id, action, actor_id, actor_type, previous_status, new_status, notes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        crypto.randomUUID(), batchId, batch['pilot_profile_id'] as string,
        'flight_hours_rejected',
        auth.sub, 'recognition_plus_admin',
        'pending_verification', 'rejected',
        rejectionReason, now
      ).run();
      return { batch_id: batchId, status: 'rejected', reason: rejectionReason };
    }

    // ── Pilot: delete their own unverified batch ──
    case 'deleteFlightLogBatch': {
      const batchId = params.batch_id as string;
      if (!batchId) throw new Error('Missing batch_id');
      const profile = await getProfileByAuth0Id(dbProfiles, auth.sub);
      if (!profile) throw new Error('Not found');
      const batch = await dbProfiles.prepare(
        'SELECT id, pilot_profile_id, status FROM pilot_flight_log_batches WHERE id = ?'
      ).bind(batchId).first() as Record<string, unknown> | null;
      if (!batch) throw new Error('Batch not found');
      if (batch['pilot_profile_id'] !== profile['id']) throw new Error('Forbidden');
      if (batch['status'] === 'verified') throw new Error('Cannot delete a verified batch');
      await dbProfiles.prepare('DELETE FROM pilot_flight_log_batches WHERE id = ?').bind(batchId).run();
      return { deleted: true, batch_id: batchId };
    }

    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

// ── Webhook Handlers ───────────────────────────────────────────

async function handleDodoWebhook(request: Request, env: Env): Promise<Response> {
  const origin = request.headers.get('Origin') || undefined;
  const payload = await request.text();

  // Verify signature if secret configured
  if (env.DODO_WEBHOOK_SECRET) {
    const sig = request.headers.get('x-webhook-signature') || '';
    const expected = await hmacSha256(payload, env.DODO_WEBHOOK_SECRET);
    if (sig !== expected) {
      return jsonResponse({ error: 'Invalid signature' }, 401, origin);
    }
  }

  const body = JSON.parse(payload);

  // Process payment.succeeded
  if (body.event_type === 'payment.succeeded' || body.status === 'completed') {
    // Defensive: ensure metadata exists and has expected shape
    const metadata = body.metadata || {};
    const userId = body.customer_id || metadata.user_id;
    const tier = metadata.tier || 'pro';
    const amount = typeof body.amount === 'number' ? body.amount : 0;
    const currency = body.currency || 'USD';
    const paymentId = body.payment_id || body.id || 'unknown';

    if (userId && typeof userId === 'string') {
      try {
        // Record payment
        await env.DB_OPS.prepare(`
          INSERT INTO payments (id, user_id, amount_cents, currency, tier_purchased,
            tax_amount, tax_rate_percent, dodo_payment_id, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          crypto.randomUUID(), userId, Math.round(amount * 100), currency, tier,
          Math.round(amount * 100 * 0.15), 15, paymentId, 'completed'
        ).run();

        // Upgrade user tier
        await env.DB_PROFILES.prepare(`
          UPDATE profiles SET subscription_tier = ?, subscription_status = 'active', updated_at = datetime('now')
          WHERE id = ?
        `).bind(tier, userId).run();

        // ── Referral Conversion: payout on Recognition+ subscription ──
        try {
          const profile = await env.DB_PROFILES.prepare(`
            SELECT id, email, display_name, referred_by_code, referred_by_profile_id
            FROM profiles WHERE id = ?
          `).bind(userId).first() as Record<string, unknown> | null;

          const refCode = profile?.['referred_by_code'] as string | null;
          if (refCode && profile?.['referred_by_profile_id']) {
            const referrerId = profile['referred_by_profile_id'] as string;
            const pilotEmail = profile['email'] as string;
            const pilotName = profile['display_name'] as string | null;

            // Check if conversion already recorded for this pilot
            const existing = await env.DB_OPS.prepare(`
              SELECT id FROM referral_conversions WHERE pilot_id = ? AND status = 'subscribed'
            `).bind(userId).first();

            if (!existing) {
              // Find partner / referrer account
              const partner = await env.DB_OPS.prepare(`
                SELECT id, commission_rate, total_referrals
                FROM referral_partners
                WHERE referral_code = ? AND is_active = 1
              `).bind(refCode).first() as Record<string, unknown> | null;

              const commission = (partner?.['commission_rate'] as number) ?? 20;

              await env.DB_OPS.prepare(`
                INSERT INTO referral_conversions
                (id, partner_id, referral_code, pilot_id, pilot_email, pilot_name,
                 status, signed_up_at, subscribed_at, commission_amount)
                VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), ?)
              `).bind(
                crypto.randomUUID(),
                (partner?.['id'] as string) || null,
                refCode,
                userId,
                pilotEmail,
                pilotName,
                'subscribed',
                commission
              ).run();

              if (partner?.['id']) {
                await env.DB_OPS.prepare(`
                  UPDATE referral_partners
                  SET total_referrals = COALESCE(total_referrals, 0) + 1
                  WHERE id = ?
                `).bind(partner['id']).run();
              }

              console.log('[DodoWebhook] Referral conversion recorded:', refCode, 'commission:', commission);
            }
          }
        } catch (refErr) {
          console.error('[DodoWebhook] Referral conversion error (non-critical):', refErr);
        }
      } catch (dbErr) {
        // Log error but still acknowledge webhook (Dodo will retry if we 500)
        console.error('[DodoWebhook] DB error:', dbErr);
      }
    }

    // ── Voucher Batch Payment ──
    const batchId = metadata.batch_id as string | undefined;
    const voucherType = metadata.type as string | undefined;
    if (voucherType === 'voucher_batch' && batchId) {
      try {
        const now = new Date().toISOString();
        // Mark batch as paid
        await env.DB_OPS.prepare('UPDATE bulk_voucher_batches SET payment_status = "paid", updated_at = ? WHERE id = ?').bind(now, batchId).run();

        // Record payment
        await env.DB_OPS.prepare(`
          INSERT INTO payments (id, user_id, amount_cents, currency, tier_purchased,
            tax_amount, tax_rate_percent, dodo_payment_id, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          crypto.randomUUID(), batchId, Math.round(amount * 100), currency, 'voucher_batch',
          Math.round(amount * 100 * 0.15), 15, paymentId, 'completed'
        ).run();

        // Auto-generate codes
        const batch = await env.DB_OPS.prepare('SELECT * FROM bulk_voucher_batches WHERE id = ?').bind(batchId).first() as Record<string, unknown> | null;
        if (batch && batch.codes_generated === 0) {
          const qty = Number(batch.quantity);
          const batchName = String(batch.batch_name).replace(/\s+/g, '').toUpperCase().slice(0, 10);
          for (let i = 0; i < qty; i++) {
            const code = `ATO-${batchName}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
            await env.DB_OPS.prepare('INSERT INTO bulk_voucher_codes (id, batch_id, code, status, created_at) VALUES (?, ?, ?, ?, ?)')
              .bind(crypto.randomUUID(), batchId, code, 'unused', now).run();
          }
          await env.DB_OPS.prepare('UPDATE bulk_voucher_batches SET codes_generated = ? WHERE id = ?').bind(qty, batchId).run();
          console.log('[DodoWebhook] Voucher codes auto-generated for batch:', batchId, 'qty:', qty);
        }
      } catch (voucherErr) {
        console.error('[DodoWebhook] Voucher batch processing error (non-critical):', voucherErr);
      }
    }

    if (!userId && voucherType !== 'voucher_batch') {
      console.warn('[DodoWebhook] Missing userId in payload:', body);
    }
  }

  return jsonResponse({ received: true }, 200, origin);
}

async function handleVeremarkWebhook(request: Request, env: Env): Promise<Response> {
  const origin = request.headers.get('Origin') || undefined;
  const payload = await request.text();

  if (env.VEREMARK_WEBHOOK_SECRET) {
    const sig = request.headers.get('x-signature') || '';
    const expected = await hmacSha256(payload, env.VEREMARK_WEBHOOK_SECRET);
    if (sig !== expected) {
      return jsonResponse({ error: 'Invalid signature' }, 401, origin);
    }
  }

  const body = JSON.parse(payload);

  // Trace data (pilot_credentials) now lives in recognition-plus-api.
  // Forward Veremark webhook to recognition-plus-api if needed.
  console.log('[VeremarkWebhook] Received check_id:', body.check_id, 'status:', body.status, 'candidate_id:', body.candidate_id);

  return jsonResponse({ received: true }, 200, origin);
}

// ── Checkout Handler ──────────────────────────────────────────

async function handleCheckout(request: Request, env: Env): Promise<Response> {
  const origin = request.headers.get('Origin') || undefined;
  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  const { user_id, email, name, return_url } = body;

  if (!user_id) {
    return jsonResponse({ error: 'user_id required' }, 400, origin);
  }

  const dodoApiKey = env.DODO_API_KEY;
  const dodoProductId = env.DODO_PRODUCT_ID_RECOGNITION_PLUS;
  const dodoBaseUrl = 'https://live.dodopayments.com';

  if (!dodoApiKey || !dodoProductId) {
    return jsonResponse({ error: 'Dodo Payments not configured' }, 500, origin);
  }

  const successUrl = (return_url as string) || 'https://pilotrecognition.com/platform?tab=verification&checkout=success';
  const cancelUrl = 'https://pilotrecognition.com/platform?tab=verification&checkout=cancelled';

  try {
    const checkoutRes = await fetch(`${dodoBaseUrl}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${dodoApiKey}`,
      },
      body: JSON.stringify({
        product_cart: [{ product_id: dodoProductId, quantity: 1 }],
        customer: email ? { email: email as string, name: (name as string) || undefined } : undefined,
        return_url: successUrl,
        cancel_url: cancelUrl,
        metadata: { user_id, tier: 'recognition_plus' },
      }),
    });

    const checkoutData = await checkoutRes.json().catch(() => ({})) as Record<string, unknown>;

    if (!checkoutRes.ok) {
      console.error('[Dodo Checkout] error:', checkoutData);
      return jsonResponse({ error: (checkoutData as any).message || 'Checkout creation failed' }, checkoutRes.status, origin);
    }

    return jsonResponse({
      checkout_url: checkoutData.checkout_url,
      session_id: checkoutData.session_id,
      status: 'ready',
    }, 200, origin);
  } catch (err: any) {
    console.error('[Dodo Checkout] exception:', err.message);
    return jsonResponse({ error: err.message || 'Checkout creation failed' }, 500, origin);
  }
}

// ── Crypto Helpers ────────────────────────────────────────────

async function hmacSha256(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

// ── Main Export ────────────────────────────────────────────────

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

} satisfies ExportedHandler<Env>;
