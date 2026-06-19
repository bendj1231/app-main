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
 *              createEnterprise | getEnterprises | getEnterprise
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
  DB: D1Database;
  AUTH0_DOMAIN: string;
  AUTH0_AUDIENCE: string;
  DODO_API_KEY?: string;
  DODO_WEBHOOK_SECRET?: string;
  VEREMARK_WEBHOOK_SECRET?: string;
  DODO_PRODUCT_ID_RECOGNITION_PLUS?: string;
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

async function ensureProfile(db: D1Database, auth0Id: string, email: string, name?: string, originJurisdiction?: string) {
  let profile = await getProfileByAuth0Id(db, auth0Id);
  if (!profile) {
    const id = crypto.randomUUID();
    const displayName = name || email.split('@')[0];
    const now = new Date().toISOString();
    await db.prepare(`
      INSERT INTO profiles (id, auth0_id, email, display_name, role, status, subscription_tier, origin_jurisdiction, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(id, auth0Id, email, displayName, 'pilot', 'active', 'free', originJurisdiction || null, now, now).run();
    profile = await getProfileById(db, id);
  }
  return profile;
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

  // Everything below requires Auth0 JWT
  let auth: JWTPayload;
  try {
    auth = await verifyAuth0Token(request, env);
  } catch (err) {
    if (err instanceof Response) return err;
    return jsonResponse({ error: 'Unauthorized' }, 401, origin);
  }

  const db = env.DB;

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
          results[req.action] = await handleAction(req.action, req.params || {}, db, auth, env);
        } catch (err) {
          results[req.action] = { error: err instanceof Error ? err.message : String(err) };
        }
      }
      return jsonResponse(results, 200, origin);
    }

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

    // ── Profile ──
    case 'getProfile': {
      if (params.me === 1 || params.me === '1' || params.me === true) {
        const profile = await getProfileByAuth0Id(db, auth.sub);
        if (!profile) throw new Error('Not found');
        return profile;
      }
      if (params.id) {
        const profile = await getProfileById(db, params.id as string);
        if (!profile) throw new Error('Not found');
        return profile;
      }
      if (params.auth0_id) {
        const profile = await getProfileByAuth0Id(db, params.auth0_id as string);
        if (!profile) throw new Error('Not found');
        return profile;
      }
      throw new Error('Missing param: auth0_id, id, or me');
    }
    case 'createProfile': {
      const missing = validateRequiredFields(params, ['email']);
      if (missing) throw new Error(missing);
      const originJurisdiction = params._originJurisdiction as string | undefined;
      return ensureProfile(db, auth.sub, params.email as string, params.name as string, originJurisdiction);
    }
    case 'updateProfile': {
      const id = params.id as string;
      if (!id) throw new Error('Missing id');
      const existing = await getProfileById(db, id);
      if (!existing) throw new Error('Not found');
      if (existing['auth0_id'] !== auth.sub) {
        const me = await getProfileByAuth0Id(db, auth.sub);
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
      await db.prepare(`UPDATE profiles SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();
      return getProfileById(db, id);
    }
    case 'deleteProfile': {
      const id = params.id as string;
      if (!id) throw new Error('Missing id');
      const existing = await getProfileById(db, id);
      if (!existing) throw new Error('Not found');
      if (existing['auth0_id'] !== auth.sub) {
        const me = await getProfileByAuth0Id(db, auth.sub);
        if (!me || me['role'] !== 'super_admin') throw new Error('Forbidden');
      }
      await db.prepare('DELETE FROM profiles WHERE id = ?').bind(id).run();
      return { deleted: true };
    }

    // ── Verification Status ──
    case 'getVerificationStatus': {
      const userId = params.user_id as string;
      if (!userId) throw new Error('Missing user_id');
      const targetProfile = await getProfileById(db, userId);
      if (!targetProfile) throw new Error('Not found');
      if (targetProfile['auth0_id'] !== auth.sub) {
        const me = await getProfileByAuth0Id(db, auth.sub);
        if (!me || me['role'] !== 'super_admin') throw new Error('Forbidden');
      }
      const { results } = await db.prepare(`
        SELECT credential_type, status, issued_at, expires_at, revoked_at
        FROM pilot_credentials
        WHERE user_id = ?
        ORDER BY credential_type ASC
      `).bind(userId).all();
      const credentialTypes = ['license', 'medical', 'radio_license', 'english_proficiency', 'flight_hours'];
      const statusMap: Record<string, { valid: boolean; status: string; issued_at?: string; expires_at?: string }> = {};
      for (const type of credentialTypes) statusMap[type] = { valid: false, status: 'missing' };
      for (const row of (results || [])) {
        const r = row as Record<string, unknown>;
        const type = r['credential_type'] as string;
        const st = r['status'] as string;
        statusMap[type] = {
          valid: st === 'active',
          status: st,
          issued_at: r['issued_at'] as string | undefined,
          expires_at: r['expires_at'] as string | undefined,
        };
      }
      return {
        license: statusMap['license'],
        medical: statusMap['medical'],
        radio_license: statusMap['radio_license'],
        english_proficiency: statusMap['english_proficiency'],
        flight_hours: statusMap['flight_hours'],
      };
    }

    // ── Recognition ──
    case 'getRecognitionScore': {
      const userId = params.user_id as string;
      if (!userId) throw new Error('Missing user_id');
      const row = await db.prepare('SELECT * FROM recognition_scores WHERE user_id = ?').bind(userId).first();
      if (!row) throw new Error('Not found');
      return row;
    }
    case 'saveRecognitionScore': {
      const missing = validateRequiredFields(params, ['user_id']);
      if (missing) throw new Error(missing);
      const userId = params.user_id as string;
      const existing = await db.prepare('SELECT id FROM recognition_scores WHERE user_id = ?').bind(userId).first();
      if (existing) {
        await db.prepare(`
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
        await db.prepare(`
          INSERT INTO recognition_scores (id, user_id, total_score, hours_score, experience_score,
            assessment_score, mentorship_score, score_tier, breakdown, recommendations)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          id, userId, params.total_score || 0, params.hours_score || 0, params.experience_score || 0,
          params.assessment_score || 0, params.mentorship_score || 0, params.score_tier || 'bronze',
          JSON.stringify(params.breakdown || {}), JSON.stringify(params.recommendations || [])
        ).run();
      }
      return db.prepare('SELECT * FROM recognition_scores WHERE user_id = ?').bind(userId).first();
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
      const profile = await getProfileByAuth0Id(db, auth.sub);
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

    // ── DIDs ──
    case 'createDid': {
      const missing = validateRequiredFields(params, ['profile_id', 'auth0_id', 'did']);
      if (missing) throw new Error(missing);
      const id = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO pilot_dids (id, profile_id, auth0_id, did, did_method, public_key_jwk)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        id, params.profile_id, params.auth0_id, params.did,
        params.did_method || 'did:key', JSON.stringify(params.public_key_jwk || {})
      ).run();
      return db.prepare('SELECT * FROM pilot_dids WHERE id = ?').bind(id).first();
    }
    case 'getDid': {
      const auth0Id = params.auth0_id as string;
      if (!auth0Id) throw new Error('Missing auth0_id');
      const row = await db.prepare('SELECT * FROM pilot_dids WHERE auth0_id = ?').bind(auth0Id).first();
      if (!row) throw new Error('Not found');
      return row;
    }

    // ── Credentials ──
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
    case 'getCredentials': {
      const userId = params.user_id as string;
      if (!userId) throw new Error('Missing user_id');
      const { results } = await db.prepare('SELECT * FROM pilot_credentials WHERE user_id = ? ORDER BY issued_at DESC').bind(userId).all();
      return results || [];
    }

    // ── Enterprise ──
    case 'createEnterprise': {
      const missing = validateRequiredFields(params, ['company_name']);
      if (missing) throw new Error(missing);
      const id = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO enterprise_profiles (id, company_name, industry, contact_email, contact_phone, website, country, employee_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, params.company_name, params.industry || null, params.contact_email || null,
        params.contact_phone || null, params.website || null, params.country || null,
        params.employee_count || null
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
      const { results } = await db.prepare(sql).bind(...binds).all();
      return results || [];
    }
    case 'getUserRank': {
      const userId = params.user_id as string;
      if (!userId) throw new Error('Missing user_id');
      const userScore = await db.prepare('SELECT total_score FROM recognition_scores WHERE user_id = ?').bind(userId).first() as { total_score: number } | null;
      if (!userScore) return 0;
      const { results } = await db.prepare('SELECT COUNT(*) as count FROM recognition_scores WHERE total_score > ?').bind(userScore.total_score).all();
      return ((results?.[0] as Record<string, unknown>)?.['count'] as number || 0) + 1;
    }
    case 'getScoreStatistics': {
      const userId = params.user_id as string;
      if (!userId) throw new Error('Missing user_id');
      const { results: allScores } = await db.prepare('SELECT total_score FROM recognition_scores').all();
      const scores = (allScores || []).map(r => (r as Record<string, unknown>)['total_score'] as number);
      const userRow = await db.prepare('SELECT total_score FROM recognition_scores WHERE user_id = ?').bind(userId).first() as { total_score: number } | null;
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
        'profiles', 'recognition_scores', 'payments', 'pilot_credentials', 'pilot_dids',
        'enterprise_profiles', 'score_history', 'score_notifications', 'completion_tracking',
        'goal_tracking', 'ai_coaching_actions', 'score_boost_history', 'user_activity_log',
        'mentorship_requests', 'mentorship_messages', 'mentorship_badges', 'mentorship_sessions',
        'peer_endorsements', 'efb_uploads', 'logbook_entries', 'sim_sessions', 'alumni_network',
        'event_attendance', 'forum_posts', 'learning_hours', 'pilot_documents',
        'pilot_platform_connections', 'logbook_hour_tokens', 'p12_verification_events',
        'efb_complexity_tokens', 'sim_session_tokens',
        'pilot_licensure_experience', 'mfa_secrets', 'referral_conversions', 'referral_partners', 'user_app_access'
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
      const me = await getProfileByAuth0Id(db, auth.sub);
      if (!me || me['role'] !== 'super_admin') throw new Error('Forbidden');
      const { results } = await db.prepare('SELECT * FROM profiles ORDER BY created_at DESC LIMIT 500').all();
      return results || [];
    }
    case 'updateUserTier': {
      const me = await getProfileByAuth0Id(db, auth.sub);
      if (!me || me['role'] !== 'super_admin') throw new Error('Forbidden');
      const userId = params.user_id as string;
      const tier = params.tier as string;
      if (!userId || !tier) throw new Error('Missing user_id or tier');
      await db.prepare(`
        UPDATE profiles SET subscription_tier = ?, subscription_status = 'active', updated_at = datetime('now') WHERE id = ?
      `).bind(tier, userId).run();
      return getProfileById(db, userId);
    }

    case 'deleteAccount': {
      const userId = params.userId as string;
      if (!userId) throw new Error('Missing userId');
      // Cascade delete user data
      await db.prepare('DELETE FROM profiles WHERE id = ?').bind(userId).run();
      await db.prepare('DELETE FROM pilot_licensure_experience WHERE user_id = ?').bind(userId).run();
      await db.prepare('DELETE FROM payments WHERE user_id = ?').bind(userId).run();
      await db.prepare('DELETE FROM recognition_scores WHERE user_id = ?').bind(userId).run();
      await db.prepare('DELETE FROM pilot_credentials WHERE user_id = ?').bind(userId).run();
      await db.prepare('DELETE FROM pilot_dids WHERE profile_id = ?').bind(userId).run();
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
      // TODO: Implement real referral code generation
      return { success: true, referralCode: `REF${crypto.randomUUID().slice(0, 6).toUpperCase()}` };
    }

    case 'sendAccountCreatedEmail': {
      // TODO: Integrate Resend for account creation emails
      return { success: true };
    }

    case 'issuerSign': {
      // TODO: Migrate issuer-sign edge function logic into Worker (needs signing key env)
      return { success: false, error: 'issuerSign not yet migrated to Worker. Use legacy issuer endpoint.' };
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
        await env.DB.prepare(`
          INSERT INTO payments (id, user_id, amount_cents, currency, tier_purchased,
            tax_amount, tax_rate_percent, dodo_payment_id, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          crypto.randomUUID(), userId, Math.round(amount * 100), currency, tier,
          Math.round(amount * 100 * 0.15), 15, paymentId, 'completed'
        ).run();

        // Upgrade user tier
        await env.DB.prepare(`
          UPDATE profiles SET subscription_tier = ?, subscription_status = 'active', updated_at = datetime('now')
          WHERE id = ?
        `).bind(tier, userId).run();
      } catch (dbErr) {
        // Log error but still acknowledge webhook (Dodo will retry if we 500)
        console.error('[DodoWebhook] DB error:', dbErr);
      }
    } else {
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

  // ── Update pilot_credentials from Veremark check results ──
  if (body.check_id && body.candidate_id) {
    const profile = await env.DB.prepare('SELECT id FROM profiles WHERE auth0_id = ?').bind(body.candidate_id).first();
    if (profile) {
      const profileId = (profile as Record<string, unknown>)['id'] as string;
      const credentialType = body.check_type || 'license'; // 'license', 'medical', 'radio_license', 'english_proficiency', 'flight_hours'
      const newStatus = body.status === 'completed' ? 'active' : (body.status === 'expired' ? 'expired' : (body.status === 'revoked' ? 'revoked' : 'active'));

      // Upsert credential record — Veremark is the source of truth
      await env.DB.prepare(`
        INSERT INTO pilot_credentials (id, user_id, credential_type, issuer, credential_data, status, issued_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(id) DO UPDATE SET
          status = excluded.status,
          credential_data = excluded.credential_data,
          issued_at = excluded.issued_at
      `).bind(
        body.check_id || crypto.randomUUID(),
        profileId,
        credentialType,
        'veremark',
        JSON.stringify({ check_id: body.check_id, candidate_id: body.candidate_id, status: body.status, completed_at: body.completed_at }),
        newStatus
      ).run();
    }
  }

  // ── ToS Section 11.2 / 16.1: Automated Revocation ──
  // If Veremark signals expired/revoked, cascade to credentials + wallet
  if (body.status === 'expired' || body.status === 'revoked' || body.status === 'failed') {
    const profile = await env.DB.prepare('SELECT id FROM profiles WHERE auth0_id = ?').bind(body.candidate_id).first();
    if (profile) {
      const profileId = (profile as Record<string, unknown>)['id'] as string;
      try {
        // Revoke the specific credential type returned by Veremark
        await env.DB.prepare(`
          UPDATE pilot_credentials
          SET status = 'revoked', revoked_at = datetime('now')
          WHERE user_id = ? AND credential_type = ?
        `).bind(profileId, body.check_type || 'license').run();

        // NOTE: Terminal 3 token zero-out is frontend responsibility.
        // The wallet client polls /api/credentials and triggers UI revocation.
      } catch (revErr) {
        console.error('[VeremarkWebhook] Revocation cascade error:', revErr);
      }
    }
  }

  return jsonResponse({ received: true }, 200, origin);
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
