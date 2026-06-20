/**
 * PilotRecognition Worker API
 * Replaces Supabase queries with D1 SQLite for profile data
 */

export interface Env {
  pilotrecognition_profiles: D1Database;
  AUTH0_DOMAIN: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    try {
      // Main API router for action-based calls
      if (url.pathname === '/api' || url.pathname === '/api/') {
        return await handleApiAction(request, env);
      }

      // Profile-specific REST endpoints
      if (url.pathname.startsWith('/api/profile')) {
        return await handleProfileRoutes(request, env, url);
      }

      // Dodo Payments webhook
      if (url.pathname === '/api/webhooks/dodo') {
        return await handleDodoWebhook(request, env);
      }

      // Checkout endpoints
      if (url.pathname === '/api/checkout/recognition-plus') {
        return await handleCheckout(request, env, 'recognition_plus');
      }

      // Resend email endpoint
      if (url.pathname === '/api/email/send') {
        return await handleEmailSend(request, env);
      }

      // Health check
      if (url.pathname === '/api/health') {
        return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() });
      }

      return jsonResponse({ error: 'Not found' }, 404);
    } catch (err: any) {
      console.error('Worker error:', err);
      return jsonResponse({ error: err.message || 'Internal error' }, 500);
    }
  },
};

async function handleApiAction(request: Request, env: Env): Promise<Response> {
  const body = await request.json().catch(() => ({}));
  const { action, params, requests } = body;

  // Batch requests
  if (action === 'batch' && Array.isArray(requests)) {
    const results: Record<string, unknown> = {};
    for (let i = 0; i < requests.length; i++) {
      const req = requests[i];
      try {
        // Check if result is cached (only for GET-like actions)
        if (req.cache && req.cache > 0) {
          const cacheKey = `cache:${req.action}:${JSON.stringify(req.params)}`;
          const cached = await env.pilotrecognition_profiles.prepare(
            "SELECT value FROM _cache WHERE key = ? AND expires_at > datetime('now')"
          ).bind(cacheKey).first<string>('value');

          if (cached) {
            results[`result_${i}`] = JSON.parse(cached);
            continue;
          }
        }

        const result = await executeAction(env, req.action, req.params);
        results[`result_${i}`] = result;

        // Store cache if requested
        if (req.cache && req.cache > 0) {
          const cacheKey = `cache:${req.action}:${JSON.stringify(req.params)}`;
          await env.pilotrecognition_profiles.prepare(`
            INSERT INTO _cache (key, value, expires_at)
            VALUES (?, ?, datetime('now', '+${req.cache} seconds'))
            ON CONFLICT(key) DO UPDATE SET
              value = excluded.value,
              expires_at = excluded.expires_at
          `).bind(cacheKey, JSON.stringify(result)).run();
        }
      } catch (err: any) {
        results[`error_${i}`] = err.message;
      }
    }
    return jsonResponse(results);
  }

  // Single action
  try {
    const result = await executeAction(env, action, params);
    return jsonResponse(result);
  } catch (err: any) {
    return jsonResponse({ error: err.message }, 500);
  }
}

async function executeAction(env: Env, action: string, params: any): Promise<unknown> {
  const db = env.pilotrecognition_profiles;

  switch (action) {
    // ── Profiles ────────────────────────────────────────
    case 'getProfile': {
      const { auth0_id, id, me } = params || {};
      if (auth0_id) {
        const { results } = await db.prepare('SELECT * FROM profiles WHERE auth0_id = ?').bind(auth0_id).all();
        return results?.[0] || null;
      }
      if (id) {
        const { results } = await db.prepare('SELECT * FROM profiles WHERE id = ?').bind(id).all();
        return results?.[0] || null;
      }
      if (me) {
        // me requires auth context from JWT — simplified for now
        return null;
      }
      return null;
    }

    case 'createProfile': {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const data = params || {};
      await db.prepare(`
        INSERT INTO profiles (
          id, auth0_id, email, full_name, display_name, first_name, last_name,
          role, status, avatar_url, phone, address, date_of_birth, nationality,
          current_flight_hours, total_flight_hours, mentorship_hours,
          foundation_progress, overall_recognition_score, current_level,
          current_occupation, license_id, country_of_license, ratings, pilot_id,
          enrolled_programs, app_access, is_enrolled_in_foundational,
          recognition_tier, subscription_tier, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id,
        data.auth0_id || '',
        data.email || '',
        data.name || data.full_name || null,
        data.display_name || null,
        data.first_name || null,
        data.last_name || null,
        data.role || 'pilot',
        data.status || 'active',
        data.avatar_url || null,
        data.phone || null,
        data.address || null,
        data.date_of_birth || null,
        data.nationality || null,
        data.current_flight_hours || 0,
        data.total_flight_hours || 0,
        data.mentorship_hours || 0,
        data.foundation_progress || 0,
        data.overall_recognition_score || 0,
        data.current_level || 'Foundation',
        data.current_occupation || null,
        data.license_id || null,
        data.country_of_license || null,
        data.ratings ? JSON.stringify(data.ratings) : null,
        data.pilot_id || null,
        data.enrolled_programs ? JSON.stringify(data.enrolled_programs) : null,
        data.app_access ? JSON.stringify(data.app_access) : null,
        data.is_enrolled_in_foundational ? 1 : 0,
        data.recognition_tier || 'Bronze',
        data.subscription_tier || 'free',
        now,
        now
      ).run();
      return { id, ...data, created_at: now, updated_at: now };
    }

    case 'upsertProfile': {
      const data = params || {};
      const auth0Id = data.auth0_id || data.email || '';
      const now = new Date().toISOString();
      const fieldMap: Record<string, string> = {
        email: 'email', name: 'full_name', display_name: 'display_name',
        first_name: 'first_name', last_name: 'last_name', role: 'role',
        date_of_birth: 'date_of_birth', nationality: 'nationality',
        current_occupation: 'current_occupation', total_flight_hours: 'total_flight_hours',
        current_flight_hours: 'current_flight_hours', ratings: 'ratings',
        license_id: 'license_id', country_of_license: 'country_of_license',
        recognition_tier: 'recognition_tier', subscription_tier: 'subscription_tier',
        avatar_url: 'avatar_url', phone: 'phone', address: 'address',
        status: 'status', current_level: 'current_level',
      };
      // Build onboarding metadata from fields not in fieldMap
      const onboardingMeta: Record<string, any> = {};
      for (const key of Object.keys(data)) {
        if (!fieldMap[key] && key !== 'auth0_id' && key !== 'email') {
          onboardingMeta[key] = data[key];
        }
      }

      // Check if profile exists
      const { results: existing } = await db.prepare('SELECT id FROM profiles WHERE auth0_id = ? OR email = ?').bind(auth0Id, data.email || '').all();
      const existingId = existing?.[0]?.id as string | undefined;
      if (existingId) {
        const setClauses: string[] = [];
        const values: any[] = [];
        for (const [key, dbField] of Object.entries(fieldMap)) {
          if (data[key] !== undefined) {
            setClauses.push(`${dbField} = ?`);
            values.push(typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]);
          }
        }
        if (Object.keys(onboardingMeta).length > 0) {
          setClauses.push('app_access = ?');
          values.push(JSON.stringify(onboardingMeta));
        }
        if (setClauses.length > 0) {
          setClauses.push('updated_at = ?');
          values.push(now);
          values.push(existingId);
          await db.prepare(`UPDATE profiles SET ${setClauses.join(', ')} WHERE id = ?`).bind(...values).run();
        }
        return { id: existingId, updated: true };
      }
      // Create
      const newId = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO profiles (id, auth0_id, email, full_name, display_name, first_name, last_name, role, status, date_of_birth, nationality, current_occupation, total_flight_hours, current_flight_hours, ratings, license_id, country_of_license, recognition_tier, subscription_tier, app_access, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        newId, auth0Id, data.email || '', data.name || null, data.display_name || null,
        data.first_name || null, data.last_name || null, data.role || 'pilot', data.status || 'active',
        data.date_of_birth || null, data.nationality || null, data.current_occupation || null,
        data.total_flight_hours || 0, data.current_flight_hours || 0,
        data.ratings ? JSON.stringify(data.ratings) : null,
        data.license_id || null, data.country_of_license || null,
        data.recognition_tier || 'Bronze', data.subscription_tier || 'free',
        Object.keys(onboardingMeta).length > 0 ? JSON.stringify(onboardingMeta) : null,
        now, now
      ).run();
      return { id: newId, created: true };
    }

    case 'updateProfile': {
      const { id, ...updates } = params || {};
      if (!id) throw new Error('Profile id required');

      const setClauses: string[] = [];
      const values: any[] = [];

      const allowedFields = [
        'full_name', 'display_name', 'first_name', 'last_name', 'role', 'status',
        'avatar_url', 'phone', 'address', 'date_of_birth', 'nationality',
        'current_flight_hours', 'total_flight_hours', 'mentorship_hours',
        'foundation_progress', 'overall_recognition_score', 'current_level',
        'current_occupation', 'license_id', 'country_of_license', 'ratings',
        'pilot_id', 'enrolled_programs', 'app_access', 'is_enrolled_in_foundational',
        'recognition_tier', 'subscription_tier',
      ];

      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          setClauses.push(`${field} = ?`);
          values.push(updates[field]);
        }
      }

      if (setClauses.length === 0) throw new Error('No fields to update');

      const now = new Date().toISOString();
      setClauses.push('updated_at = ?');
      values.push(now);
      values.push(id);

      await db.prepare(`UPDATE profiles SET ${setClauses.join(', ')} WHERE id = ?`)
        .bind(...values)
        .run();

      return { success: true, updated_at: now };
    }

    case 'deleteProfile': {
      const { id } = params || {};
      if (!id) throw new Error('Profile id required');
      await db.prepare('DELETE FROM profiles WHERE id = ?').bind(id).run();
      return { success: true };
    }

    // ── Generic table queries (backward compat) ─────────
    case 'queryTable': {
      const { table, operation, where, data: updateData, id: updateId, limit } = params || {};

      if (operation === 'select') {
        const whereKeys = Object.keys(where || {});
        if (whereKeys.length === 0) {
          const { results } = await db.prepare(`SELECT * FROM ${table} LIMIT ?`).bind(limit || 100).all();
          return results || [];
        }
        const clauses = whereKeys.map(k => `${k} = ?`).join(' AND ');
        const { results } = await db.prepare(`SELECT * FROM ${table} WHERE ${clauses} LIMIT ?`)
          .bind(...whereKeys.map(k => where[k]), limit || 1)
          .all();
        return results || [];
      }

      if (operation === 'update' && updateId) {
        const keys = Object.keys(updateData || {});
        const setClause = keys.map(k => `${k} = ?`).join(', ');
        await db.prepare(`UPDATE ${table} SET ${setClause} WHERE id = ?`)
          .bind(...keys.map(k => updateData[k]), updateId)
          .run();
        return { success: true };
      }

      if (operation === 'insert') {
        const keys = Object.keys(updateData || {});
        const placeholders = keys.map(() => '?').join(', ');
        const result = await db.prepare(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`)
          .bind(...keys.map(k => updateData[k]))
          .run();
        return { id: result.meta?.last_row_id || crypto.randomUUID(), success: true };
      }

      return { error: 'Unsupported operation' };
    }

    // ── Mentorship badges ────────────────────────────────
    case 'getMentorshipBadges': {
      const { user_id } = params || {};
      const { results } = await db.prepare('SELECT * FROM mentorship_badges WHERE user_id = ? ORDER BY earned_at DESC')
        .bind(user_id)
        .all();
      return results || [];
    }

    case 'addMentorshipBadge': {
      const { user_id, badge_id, badge_name, badge_description, badge_icon, badge_tier } = params || {};
      const id = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO mentorship_badges (id, user_id, badge_id, badge_name, badge_description, badge_icon, badge_tier, earned_at, is_displayed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(id, user_id, badge_id, badge_name, badge_description, badge_icon, badge_tier, new Date().toISOString(), 1).run();
      return { id, success: true };
    }

    // ── Flight hours ────────────────────────────────────
    case 'getFlightHours': {
      const { user_id } = params || {};
      const { results } = await db.prepare('SELECT * FROM flight_hours WHERE user_id = ?').bind(user_id).all();
      return results?.[0] || {};
    }

    case 'updateFlightHours': {
      const { user_id, total_hours, pic_hours, instrument_hours } = params || {};
      await db.prepare(`
        INSERT INTO flight_hours (id, user_id, total_hours, pic_hours, instrument_hours, last_updated)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          total_hours = excluded.total_hours,
          pic_hours = excluded.pic_hours,
          instrument_hours = excluded.instrument_hours,
          last_updated = excluded.last_updated
      `).bind(crypto.randomUUID(), user_id, total_hours || 0, pic_hours || 0, instrument_hours || 0, new Date().toISOString()).run();
      return { success: true };
    }

    // ── Admin ────────────────────────────────────────────
    case 'getAllPilots': {
      const { results } = await db.prepare('SELECT id, auth0_id, email, full_name, display_name, role, status, current_level, recognition_tier, subscription_tier, created_at FROM profiles ORDER BY created_at DESC').all();
      return results || [];
    }

    case 'updateUserTier': {
      const { user_id, tier } = params || {};
      await db.prepare('UPDATE profiles SET subscription_tier = ? WHERE id = ?').bind(tier, user_id).run();
      return { success: true };
    }

    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

async function handleProfileRoutes(request: Request, env: Env, url: URL): Promise<Response> {
  const db = env.pilotrecognition_profiles;
  const pathParts = url.pathname.split('/');

  // GET /api/profile/:id
  if (pathParts.length === 4 && request.method === 'GET') {
    const id = pathParts[3];
    const { results } = await db.prepare(`
      SELECT p.*,
        (SELECT json_group_array(json_object('id', mb.id, 'badge_id', mb.badge_id, 'badge_name', mb.badge_name, 'earned_at', mb.earned_at))
         FROM mentorship_badges mb WHERE mb.user_id = p.id) as badges,
        (SELECT json_object('total_hours', fh.total_hours, 'pic_hours', fh.pic_hours, 'instrument_hours', fh.instrument_hours)
         FROM flight_hours fh WHERE fh.user_id = p.id) as flight_hours
      FROM profiles p WHERE p.id = ?
    `).bind(id).all();

    if (!results?.[0]) return jsonResponse({ error: 'Not found' }, 404);

    const profile = results[0] as any;
    return jsonResponse({
      ...profile,
      badges: JSON.parse(profile.badges || '[]'),
      flight_hours: JSON.parse(profile.flight_hours || '{}'),
    });
  }

  return jsonResponse({ error: 'Not found' }, 404);
}

async function handleDodoWebhook(request: Request, env: Env): Promise<Response> {
  const body = await request.json().catch(() => ({}));
  const db = env.pilotrecognition_profiles;

  // Dodo Payments sends webhook on payment success
  if (body.status === 'succeeded' || body.payment_status === 'succeeded') {
    const userId = body.customer_id || body.metadata?.user_id;
    const tier = body.metadata?.tier || 'recognition_plus';

    if (userId) {
      await db.prepare('UPDATE profiles SET subscription_tier = ? WHERE id = ?')
        .bind(tier, userId)
        .run();

      return jsonResponse({ success: true, action: 'tier_upgraded', userId, tier });
    }
  }

  return jsonResponse({ received: true }, 200);
}

async function handleEmailSend(request: Request, _env: Env): Promise<Response> {
  const body = await request.json().catch(() => ({}));
  const { to, subject, html, text } = body;

  if (!to || !subject) {
    return jsonResponse({ error: 'to and subject required' }, 400);
  }

  const resendKey = (request.headers.get('X-Resend-Key') || '');
  if (!resendKey) {
    return jsonResponse({ error: 'X-Resend-Key header required' }, 401);
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'PilotRecognition <noreply@pilotrecognition.com>',
        to,
        subject,
        html,
        text,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return jsonResponse({ error: data.message || 'Email send failed' }, res.status);
    }

    return jsonResponse({ success: true, id: data.id });
  } catch (err: any) {
    return jsonResponse({ error: err.message }, 500);
  }
}

async function handleCheckout(request: Request, env: Env, tier: string): Promise<Response> {
  const body = await request.json().catch(() => ({}));
  const { user_id, return_url } = body;

  if (!user_id) {
    return jsonResponse({ error: 'user_id required' }, 400);
  }

  // In production, this calls Dodo Payments API to create a checkout session
  // For now, return a mock checkout URL
  return jsonResponse({
    checkout_url: `https://checkout.dodopayments.com/buy/test-product?user_id=${user_id}&tier=${tier}`,
    status: 'ready',
  });
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}
