/**
 * pilotshortage.org Worker — Satellite of pilotrecognition.com
 *
 * Architecture: All three products (Pathways, Recognition, Shortage) share
 * the same account system powered by pilotrecognition.com.
 * - Same D1 database (pilotshortage_stories table lives alongside pilot_profiles, pathways, etc.)
 * - Same Auth0 tenant (enterprise users from Pathways have identical access here)
 * - Same pilot identity (a pilot profile on Recognition is the same pilot on Shortage)
 *
 * This worker is a dedicated route handler for pilotshortage.org traffic.
 * It isolates marketing-scale public reads from the main platform API while
 * reading/writing the same underlying data.
 *
 * Public endpoints (no auth):
 *   GET  /stats              → Live counters: total stories, verified, by floor, featured
 *   GET  /stories            → List stories with filters (status, floor, featured, limit, offset)
 *   GET  /stories/:id        → Single story detail (increments view_count)
 *   POST /stories            → Submit a new story/claim (no auth, rate limited)
 *   GET  /featured           → Featured approved stories only
 *   GET  /floors             → Floor-level aggregated stats
 *
 * Enterprise endpoints (Auth0 JWT + enterprise role — same tenant as Pathways):
 *   PUT  /stories/:id        → Update story status, feature, flag, verification
 *   POST /stories/:id/verify → Advance verification stage (license/logbook/interview/approved/rejected)
 *   GET  /admin/queue        → Pending verification queue for review team
 *   PUT  /stories/:id/feature → Toggle featured status with reason
 *
 * Auth: Bearer token from Auth0 (validated via JWKS) for enterprise endpoints
 * Rate limit: 5 submissions/hour per IP
 * CORS: pilotshortage.org, www.pilotshortage.org, localhost:*
 */

// ── D1 Types ────────────────────────────────────────────────────
declare interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

declare interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = { results: Record<string, unknown>[] }>(): Promise<T>;
  run(): Promise<Record<string, unknown>>;
}

// ── Environment ───────────────────────────────────────────────
interface Env {
  DB: D1Database;
  AUTH0_DOMAIN: string;
  AUTH0_AUDIENCE: string;
}

// ── Types ────────────────────────────────────────────────────
interface JWTPayload {
  sub: string;
  email?: string;
  permissions?: string[];
  [key: string]: unknown;
}

interface JWKS {
  keys: JsonWebKey[];
}

// ── CORS ──────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://pilotshortage.org',
  'https://www.pilotshortage.org',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8787',
];

function getCorsHeaders(origin: string | undefined): Record<string, string> {
  const allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(body: unknown, status = 200, origin?: string): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...getCorsHeaders(origin),
    },
  });
}

// ── Rate Limiting (in-memory per colo) ────────────────────────
const RATE_LIMITS = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5;

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const key = `submit:${ip}`;
  const entry = RATE_LIMITS.get(key);

  if (!entry || now > entry.resetAt) {
    RATE_LIMITS.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count, resetAt: entry.resetAt };
}

// ── Auth0 JWT Verification ────────────────────────────────────
let jwksCache: JWKS | null = null;
let jwksFetchedAt = 0;
const JWKS_TTL_MS = 5 * 60 * 1000;

async function fetchJWKS(domain: string): Promise<JWKS> {
  const now = Date.now();
  if (jwksCache && now - jwksFetchedAt < JWKS_TTL_MS) return jwksCache;

  const res = await fetch(`https://${domain}/.well-known/jwks.json`);
  if (!res.ok) throw new Error('Failed to fetch JWKS');
  jwksCache = (await res.json()) as JWKS;
  jwksFetchedAt = now;
  return jwksCache;
}

function base64UrlDecode(input: string): Uint8Array {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function parseJWT(token: string): { header: Record<string, unknown>; payload: JWTPayload; signature: Uint8Array } {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format');
  const header = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[0]))) as Record<string, unknown>;
  const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[1]))) as JWTPayload;
  const signature = base64UrlDecode(parts[2]);
  return { header, payload, signature };
}

async function verifyAuth0Token(request: Request, env: Env): Promise<JWTPayload> {
  const authHeader = request.headers.get('Authorization') || '';
  const match = authHeader.match(/^Bearer\s+(.+)$/);
  if (!match) throw new Error('Missing Authorization header');
  const token = match[1];

  const { header, payload } = parseJWT(token);
  const jwks = await fetchJWKS(env.AUTH0_DOMAIN);
  const kid = header.kid as string;
  const jwk = jwks.keys.find((k) => (k as Record<string, unknown>).kid === kid);
  if (!jwk) throw new Error('Signing key not found');

  const cryptoKey = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const parts = token.split('.');
  const data = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
  const signature = base64UrlDecode(parts[2]);
  const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', cryptoKey, new Uint8Array(signature).buffer, data);
  if (!valid) throw new Error('Invalid token signature');

  const now = Math.floor(Date.now() / 1000);
  if ((payload.exp as number) < now) throw new Error('Token expired');
  if (payload.aud !== env.AUTH0_AUDIENCE) throw new Error('Invalid audience');

  return payload;
}

async function requireEnterpriseAuth(request: Request, env: Env): Promise<JWTPayload> {
  const payload = await verifyAuth0Token(request, env);
  const perms = (payload.permissions || []) as string[];
  if (!perms.includes('enterprise')) throw new Error('Enterprise permission required');
  return payload;
}

// ── Helper: Floor Labels ────────────────────────────────────
const FLOOR_LABELS: Record<number, string> = {
  0: 'Graduate (200 hrs CPL)',
  1: 'Instructor (5K hrs)',
  2: 'Recognition Gap',
  3: 'Airline (12+ yrs)',
};

function formatStory(row: Record<string, unknown>): Record<string, unknown> {
  return {
    id: row.id,
    display_name: row.display_name,
    is_anonymous: (row.is_anonymous as number || 0) === 1,
    headline: row.headline,
    content: row.content,
    floor_level: row.floor_level,
    floor_label: FLOOR_LABELS[row.floor_level as number] || 'Unknown',
    career_shift_from: row.career_shift_from,
    career_shift_to: row.career_shift_to,
    years_in_aviation: row.years_in_aviation,
    total_hours_at_shift: row.total_hours_at_shift,
    investment_usd: row.investment_usd,
    support_request: row.support_request,
    status: row.status,
    verification_stages: (() => { try { return JSON.parse((row.verification_stages as string) || '[]'); } catch { return []; } })(),
    verified_at: row.verified_at,
    is_featured: (row.is_featured as number || 0) === 1,
    featured_at: row.featured_at,
    view_count: row.view_count,
    share_count: row.share_count,
    created_at: row.created_at,
    value_proposition: 'Testify your pilot journey. In exchange for recognition.',
  };
}

// ── Main Handler ──────────────────────────────────────────────
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const origin = request.headers.get('Origin') || undefined;
    const db = env.DB;
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

    // ── CORS Preflight ──
    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders(origin) });
    }

    // ── PUBLIC: GET /stats ──
    if (path === '/stats' && method === 'GET') {
      const totalStories = await db.prepare(
        "SELECT COUNT(*) as count FROM pilotshortage_stories WHERE status IN ('submitted', 'under_review', 'license_verified', 'logbook_verified', 'interview_scheduled', 'interview_conducted', 'approved')"
      ).first() as Record<string, unknown>;
      const verifiedStories = await db.prepare(
        "SELECT COUNT(*) as count FROM pilotshortage_stories WHERE status = 'approved'"
      ).first() as Record<string, unknown>;
      const byFloor = await db.prepare(`
        SELECT floor_level, COUNT(*) as count FROM pilotshortage_stories
        WHERE status IN ('submitted', 'under_review', 'license_verified', 'logbook_verified', 'interview_scheduled', 'interview_conducted', 'approved')
        GROUP BY floor_level ORDER BY floor_level
      `).all() as { results: Record<string, unknown>[] };
      const featuredCount = await db.prepare(
        "SELECT COUNT(*) as count FROM pilotshortage_stories WHERE is_featured = 1 AND status = 'approved'"
      ).first() as Record<string, unknown>;

      return jsonResponse({
        total_stories: totalStories?.count || 0,
        verified_approved: verifiedStories?.count || 0,
        featured: featuredCount?.count || 0,
        by_floor: (byFloor.results || []).reduce((acc: Record<string, unknown>, row: Record<string, unknown>) => {
          const name = FLOOR_LABELS[row.floor_level as number] || `floor_${row.floor_level}`;
          acc[name] = row.count;
          return acc;
        }, {}),
        message: 'The pilot is not the failure. The pipeline is.',
      }, 200, origin);
    }

    // ── PUBLIC: GET /floors ──
    if (path === '/floors' && method === 'GET') {
      const floors = await db.prepare(`
        SELECT floor_level,
               COUNT(*) as total,
               SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
               SUM(CASE WHEN is_featured = 1 THEN 1 ELSE 0 END) as featured
        FROM pilotshortage_stories
        WHERE status IN ('submitted', 'under_review', 'license_verified', 'logbook_verified', 'interview_scheduled', 'interview_conducted', 'approved')
        GROUP BY floor_level ORDER BY floor_level
      `).all() as { results: Record<string, unknown>[] };

      return jsonResponse({
        floors: (floors.results || []).map((row: Record<string, unknown>) => ({
          floor_level: row.floor_level,
          floor_label: FLOOR_LABELS[row.floor_level as number] || 'Unknown',
          total_stories: row.total,
          approved: row.approved,
          featured: row.featured,
        })),
      }, 200, origin);
    }

    // ── PUBLIC: GET /featured ──
    if (path === '/featured' && method === 'GET') {
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '10', 10), 50);

      const { results } = await db.prepare(`
        SELECT id, display_name, is_anonymous, headline, content, floor_level,
               career_shift_from, career_shift_to, years_in_aviation, total_hours_at_shift,
               investment_usd, support_request, status, verification_stages, verified_at,
               is_featured, featured_at, view_count, share_count, created_at
        FROM pilotshortage_stories
        WHERE is_featured = 1 AND status = 'approved'
        ORDER BY featured_at DESC
        LIMIT ?
      `).bind(limit).all() as { results: Record<string, unknown>[] };

      return jsonResponse({
        stories: (results || []).map(formatStory),
        count: (results || []).length,
      }, 200, origin);
    }

    // ── PUBLIC: GET /stories ──
    if (path === '/stories' && method === 'GET') {
      const status = url.searchParams.get('status');
      const floor = url.searchParams.get('floor');
      const featured = url.searchParams.get('featured') === '1';
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '20', 10), 100);
      const offset = parseInt(url.searchParams.get('offset') || '0', 10);

      let sql = `
        SELECT id, display_name, is_anonymous, headline, content, floor_level,
               career_shift_from, career_shift_to, years_in_aviation, total_hours_at_shift,
               investment_usd, support_request, status, verification_stages, verified_at,
               is_featured, featured_at, view_count, share_count, created_at
        FROM pilotshortage_stories
        WHERE status IN ('submitted', 'under_review', 'license_verified', 'logbook_verified', 'interview_scheduled', 'interview_conducted', 'approved')
      `;
      const binds: unknown[] = [];

      if (status) { sql += ' AND status = ?'; binds.push(status); }
      if (floor) { sql += ' AND floor_level = ?'; binds.push(parseInt(floor, 10)); }
      if (featured) { sql += ' AND is_featured = 1 AND status = \'approved\''; }

      sql += ' ORDER BY is_featured DESC, created_at DESC LIMIT ? OFFSET ?';
      binds.push(limit, offset);

      const { results } = await db.prepare(sql).bind(...binds).all() as { results: Record<string, unknown>[] };

      return jsonResponse({
        stories: (results || []).map(formatStory),
        count: (results || []).length,
        offset,
        limit,
        has_more: (results || []).length === limit,
      }, 200, origin);
    }

    // ── PUBLIC: GET /stories/:id ──
    if (path.match(/^\/stories\/[^\/]+$/) && method === 'GET') {
      const id = path.split('/')[2];

      const story = await db.prepare(`
        SELECT id, display_name, is_anonymous, headline, content, floor_level,
               career_shift_from, career_shift_to, years_in_aviation, total_hours_at_shift,
               investment_usd, support_request, status, verification_stages, verified_at,
               is_featured, featured_at, view_count, share_count, created_at
        FROM pilotshortage_stories WHERE id = ?
      `).bind(id).first() as Record<string, unknown> | null;

      if (!story) return jsonResponse({ error: 'Story not found' }, 404, origin);

      // Increment view count (fire and forget)
      db.prepare('UPDATE pilotshortage_stories SET view_count = COALESCE(view_count, 0) + 1 WHERE id = ?')
        .bind(id).run().catch(() => {});

      const formatted = formatStory(story);
      (formatted as Record<string, unknown>).view_count = (story.view_count as number || 0) + 1;

      return jsonResponse(formatted, 200, origin);
    }

    // ── PUBLIC: POST /stories ──
    if (path === '/stories' && method === 'POST') {
      // Rate limit
      const rateLimit = checkRateLimit(clientIP);
      if (!rateLimit.allowed) {
        return jsonResponse({
          error: 'Rate limit exceeded. You can submit up to 5 stories per hour.',
          retry_after_ms: rateLimit.resetAt - Date.now(),
        }, 429, origin);
      }

      const body = await request.json().catch(() => ({})) as Record<string, unknown>;

      if (!body.content || typeof body.content !== 'string' || body.content.length < 10) {
        return jsonResponse({ error: 'Content is required (minimum 10 characters). Tell your story.' }, 400, origin);
      }

      const id = crypto.randomUUID();
      const now = new Date().toISOString();

      let displayName = body.display_name as string || 'Anonymous Pilot';
      const isAnonymous = body.is_anonymous === true;
      const showFirstNameOnly = body.show_first_name_only !== false;

      if (isAnonymous) {
        displayName = 'Anonymous Pilot';
      } else if (showFirstNameOnly && displayName.includes(' ')) {
        displayName = displayName.split(' ')[0];
      }

      await db.prepare(`
        INSERT INTO pilotshortage_stories (
          id, pilot_profile_id, pilot_slug, story_type, content, headline,
          display_name, is_anonymous, show_first_name_only, floor_level,
          career_shift_from, career_shift_to, years_in_aviation, total_hours_at_shift,
          investment_usd, support_request, status, verification_stages, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id,
        body.pilot_profile_id || null,
        body.pilot_slug || null,
        body.story_type || 'claim',
        body.content,
        body.headline || null,
        displayName,
        isAnonymous ? 1 : 0,
        showFirstNameOnly ? 1 : 0,
        body.floor_level !== undefined ? Math.min(Math.max(parseInt(String(body.floor_level), 10), 0), 3) : 0,
        body.career_shift_from || null,
        body.career_shift_to || null,
        body.years_in_aviation || null,
        body.total_hours_at_shift || null,
        body.investment_usd || null,
        body.support_request || null,
        'submitted',
        JSON.stringify([{ stage: 'submitted', status: 'pending', at: now }]),
        now, now
      ).run();

      const created = await db.prepare('SELECT * FROM pilotshortage_stories WHERE id = ?').bind(id).first() as Record<string, unknown>;

      return jsonResponse({
        message: 'Story submitted. Free to join. Free to write. But the claim is worthless until verified. Your story enters the verification queue.',
        verification_note: 'Verification stages: license → logbook → interview → approved. Only then does your testimony hold weight.',
        rate_limit: {
          remaining: rateLimit.remaining,
          reset_at: new Date(rateLimit.resetAt).toISOString(),
        },
        story: created,
      }, 201, origin);
    }

    // ── ENTERPRISE: PUT /stories/:id ──
    if (path.match(/^\/stories\/[^\/]+$/) && method === 'PUT') {
      const id = path.split('/')[2];

      let auth: JWTPayload;
      try {
        auth = await requireEnterpriseAuth(request, env);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return jsonResponse({ error: msg }, 403, origin);
      }

      const body = await request.json().catch(() => ({})) as Record<string, unknown>;
      const allowedFields = [
        'status', 'verification_stages', 'verified_by', 'verified_at',
        'verification_notes', 'is_featured', 'featured_reason', 'is_flagged', 'flagged_reason',
        'headline', 'floor_level', 'career_shift_from', 'career_shift_to',
        'years_in_aviation', 'total_hours_at_shift', 'investment_usd', 'support_request'
      ];

      const sets: string[] = [];
      const values: unknown[] = [];

      for (const key of allowedFields) {
        if (key in body) {
          if (key === 'verification_stages') {
            sets.push(`${key} = ?`);
            values.push(JSON.stringify(body[key]));
          } else if (key === 'is_featured' || key === 'is_flagged') {
            sets.push(`${key} = ?`);
            values.push(body[key] ? 1 : 0);
          } else {
            sets.push(`${key} = ?`);
            values.push(body[key]);
          }
        }
      }

      if (sets.length === 0) {
        return jsonResponse({ error: 'No valid fields to update' }, 400, origin);
      }

      const now = new Date().toISOString();
      sets.push("updated_at = ?");
      values.push(now);

      if (body.is_featured === true && !sets.some((s) => s.includes('featured_at'))) {
        sets.push("featured_at = ?");
        values.push(now);
      }

      values.push(id);

      await db.prepare(`UPDATE pilotshortage_stories SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();

      const updated = await db.prepare('SELECT * FROM pilotshortage_stories WHERE id = ?').bind(id).first() as Record<string, unknown>;

      return jsonResponse({
        message: 'Story updated by verification team.',
        story: updated,
      }, 200, origin);
    }

    // ── ENTERPRISE: POST /stories/:id/verify ──
    if (path.match(/^\/stories\/[^\/]+\/verify$/) && method === 'POST') {
      const id = path.split('/')[2];

      let auth: JWTPayload;
      try {
        auth = await requireEnterpriseAuth(request, env);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return jsonResponse({ error: msg }, 403, origin);
      }

      const body = await request.json().catch(() => ({})) as Record<string, unknown>;
      const stage = body.stage as string;
      const validStages = ['license_verified', 'logbook_verified', 'interview_scheduled', 'interview_conducted', 'approved', 'rejected'];
      if (!stage || !validStages.includes(stage)) {
        return jsonResponse({ error: `stage must be one of: ${validStages.join(', ')}` }, 400, origin);
      }

      const story = await db.prepare('SELECT verification_stages, status FROM pilotshortage_stories WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
      if (!story) return jsonResponse({ error: 'Story not found' }, 404, origin);

      const now = new Date().toISOString();
      let stages: Record<string, unknown>[] = [];
      try {
        stages = JSON.parse((story.verification_stages as string) || '[]');
      } catch { stages = []; }

      stages.push({
        stage,
        status: stage === 'rejected' ? 'rejected' : 'passed',
        at: now,
        by: auth.sub,
        notes: body.notes || null,
      });

      let newStatus = stage;
      if (stage === 'approved' || stage === 'rejected') {
        newStatus = stage;
      } else {
        newStatus = story.status as string;
      }

      await db.prepare(`
        UPDATE pilotshortage_stories
        SET status = ?, verification_stages = ?, verified_by = ?, verified_at = ?, verification_notes = ?, updated_at = ?
        WHERE id = ?
      `).bind(newStatus, JSON.stringify(stages), auth.sub, now, body.notes || null, now, id).run();

      const updated = await db.prepare('SELECT * FROM pilotshortage_stories WHERE id = ?').bind(id).first() as Record<string, unknown>;

      return jsonResponse({
        message: `Story verification advanced to '${stage}'.`,
        verification_note: stage === 'approved'
          ? 'This testimony is now verified and approved. It holds weight.'
          : 'Free to join. Free to write. But worthless until fully verified.',
        story: updated,
      }, 200, origin);
    }

    // ── ENTERPRISE: GET /admin/queue ──
    if (path === '/admin/queue' && method === 'GET') {
      let auth: JWTPayload;
      try {
        auth = await requireEnterpriseAuth(request, env);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return jsonResponse({ error: msg }, 403, origin);
      }

      const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10), 100);
      const offset = parseInt(url.searchParams.get('offset') || '0', 10);

      const { results } = await db.prepare(`
        SELECT * FROM pilotshortage_stories
        WHERE status IN ('submitted', 'under_review', 'license_verified', 'logbook_verified', 'interview_scheduled')
        ORDER BY created_at ASC
        LIMIT ? OFFSET ?
      `).bind(limit, offset).all() as { results: Record<string, unknown>[] };

      return jsonResponse({
        queue: (results || []).map(formatStory),
        count: (results || []).length,
        offset,
        limit,
      }, 200, origin);
    }

    // ── 404 ──
    return jsonResponse({ error: 'Not found', path, method }, 404, origin);
  },
};
