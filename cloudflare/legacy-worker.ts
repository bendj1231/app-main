// Legacy PilotRecognition Worker — reads from pilotrecognition-profiles D1
// Bridges the old database until full migration completes

export interface Env {
  DB: D1Database;
}

function jsonResponse(data: unknown, status = 200, origin?: string): Response {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  return new Response(JSON.stringify(data), { status, headers });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || undefined;
    const path = url.pathname;
    const method = request.method;

    // CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin || '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Health check
    if (path === '/health') {
      return jsonResponse({ status: 'ok', worker: 'legacy-profiles', timestamp: new Date().toISOString() }, 200, origin);
    }

    // ── Get all legacy profiles ──
    if (path === '/api/legacy/profiles' && method === 'GET') {
      try {
        const { results } = await env.DB.prepare(`
          SELECT id, auth0_id, email, full_name, display_name, first_name, last_name,
                 avatar_url, profile_image_url, total_flight_hours, current_flight_hours,
                 license_id, country_of_license, ratings, license_types, type_ratings,
                 current_occupation, current_level, pilot_stage, nationality,
                 subscription_tier, role, status, created_at, updated_at
          FROM profiles
          ORDER BY created_at DESC
        `).all();
        return jsonResponse({ profiles: results || [] }, 200, origin);
      } catch (err) {
        return jsonResponse({ error: 'Database error', details: String(err) }, 500, origin);
      }
    }

    // ── Get single legacy profile by ID ──
    if (path === '/api/legacy/profile' && method === 'GET') {
      const id = url.searchParams.get('id');
      if (!id) return jsonResponse({ error: 'Missing id' }, 400, origin);
      try {
        const profile = await env.DB.prepare(`
          SELECT id, auth0_id, email, full_name, display_name, first_name, last_name,
                 avatar_url, profile_image_url, total_flight_hours, current_flight_hours,
                 license_id, country_of_license, ratings, license_types, type_ratings,
                 current_occupation, current_level, pilot_stage, nationality,
                 subscription_tier, role, status, created_at, updated_at
          FROM profiles WHERE id = ?
        `).bind(id).first();
        if (!profile) return jsonResponse({ error: 'Not found' }, 404, origin);
        return jsonResponse({ profile }, 200, origin);
      } catch (err) {
        return jsonResponse({ error: 'Database error', details: String(err) }, 500, origin);
      }
    }

    // ── Get single legacy profile by Auth0 ID ──
    if (path === '/api/legacy/profile-by-auth0' && method === 'GET') {
      const auth0Id = url.searchParams.get('auth0_id');
      if (!auth0Id) return jsonResponse({ error: 'Missing auth0_id' }, 400, origin);
      try {
        const profile = await env.DB.prepare(`
          SELECT id, auth0_id, email, full_name, display_name, first_name, last_name,
                 avatar_url, profile_image_url, total_flight_hours, current_flight_hours,
                 license_id, country_of_license, ratings, license_types, type_ratings,
                 current_occupation, current_level, pilot_stage, nationality,
                 subscription_tier, role, status, created_at, updated_at
          FROM profiles WHERE auth0_id = ?
        `).bind(auth0Id).first();
        if (!profile) return jsonResponse({ error: 'Not found' }, 404, origin);
        return jsonResponse({ profile }, 200, origin);
      } catch (err) {
        return jsonResponse({ error: 'Database error', details: String(err) }, 500, origin);
      }
    }

    // ── Get legacy profile count ──
    if (path === '/api/legacy/stats' && method === 'GET') {
      try {
        const profileCount = await env.DB.prepare('SELECT COUNT(*) as count FROM profiles').first();
        return jsonResponse({
          profiles: profileCount?.count || 0,
          database: 'pilotrecognition-profiles',
          note: 'Legacy database — migrate to pilotrecognition-d1',
        }, 200, origin);
      } catch (err) {
        return jsonResponse({ error: 'Database error', details: String(err) }, 500, origin);
      }
    }

    return jsonResponse({ error: 'Not found' }, 404, origin);
  },
};
