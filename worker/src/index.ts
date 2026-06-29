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
        console.error(`[Worker batch] action=${req.action} error:`, err.message, 'params:', req.params);
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
    console.error(`[Worker single] action=${action} error:`, err.message, 'params:', params);
    return jsonResponse({ error: err.message }, 500);
  }
}

/**
 * Rate limiter: track profile mutations per user per calendar month.
 * Limit defaults to 2 changes per month for updateProfile and saveLicensure.
 */
async function checkRateLimit(db: D1Database, userId: string, action: string, maxChanges: number = 2): Promise<{ allowed: boolean; remaining: number; resetsAt: string }> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS profile_change_log (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      action TEXT NOT NULL,
      changed_at TEXT NOT NULL
    )
  `).run();

  const { results } = await db.prepare(`
    SELECT COUNT(*) as count FROM profile_change_log
    WHERE user_id = ? AND action = ? AND changed_at >= ?
  `).bind(userId, action, monthStart).all();

  const count = Number((results?.[0] as any)?.count || 0);
  const allowed = count < maxChanges;
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return {
    allowed,
    remaining: Math.max(0, maxChanges - count),
    resetsAt: nextMonth.toISOString()
  };
}

async function recordChange(db: D1Database, userId: string, action: string) {
  await db.prepare(`
    INSERT INTO profile_change_log (id, user_id, action, changed_at)
    VALUES (?, ?, ?, ?)
  `).bind(crypto.randomUUID(), userId, action, new Date().toISOString()).run();
}

async function executeAction(env: Env, action: string, params: any): Promise<unknown> {
  const db = env.pilotrecognition_profiles;

  switch (action) {
    // ── Profiles ────────────────────────────────────────
    case 'getProfile': {
      const { auth0_id, id, me, email } = params || {};
      if (auth0_id) {
        const { results } = await db.prepare('SELECT * FROM profiles WHERE auth0_id = ?').bind(auth0_id).all();
        if (results?.[0]) return results[0];
        // Fallback: some legacy profiles use email as auth0_id
        if (email) {
          const { results: emailResults } = await db.prepare('SELECT * FROM profiles WHERE auth0_id = ? OR email = ?').bind(auth0_id, email).all();
          if (emailResults?.[0]) return emailResults[0];
        }
      }
      if (email) {
        const { results } = await db.prepare('SELECT * FROM profiles WHERE email = ?').bind(email).all();
        if (results?.[0]) return results[0];
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
          role, status, avatar_url, profile_image_url, profile_image_public_id,
          phone, address, date_of_birth, nationality,
          current_flight_hours, total_flight_hours, mentorship_hours,
          foundation_progress, overall_recognition_score, current_level,
          current_occupation, license_id, license_number, country_of_license, ratings, pilot_id,
          enrolled_programs, app_access, is_enrolled_in_foundational,
          recognition_tier, subscription_tier, terms_accepted_at,
          data_controller_agreement_accepted, data_controller_agreement_accepted_at,
          license_type, pilot_stage, license_issuing_authority, aircraft_types, aircraft_category,
          license_types, type_ratings, type_rating_input, elp_level, medical_class,
          employment_status, current_job, career_goal, other_licence, bio,
          linkedin_url, instagram_url, domicile, is_visitor,
          hours_whole, hours_minutes, origin_jurisdiction, logbook_sync_valid, referral_code,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        data.profile_image_url || null,
        data.profile_image_public_id || null,
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
        data.license_number || null,
        data.country_of_license || null,
        data.ratings ? JSON.stringify(data.ratings) : null,
        data.pilot_id || null,
        data.enrolled_programs ? JSON.stringify(data.enrolled_programs) : null,
        data.app_access ? JSON.stringify(data.app_access) : null,
        data.is_enrolled_in_foundational ? 1 : 0,
        data.recognition_tier || 'Bronze',
        data.subscription_tier || 'free',
        data.terms_accepted_at || null,
        data.data_controller_agreement_accepted ? 1 : 0,
        data.data_controller_agreement_accepted_at || null,
        data.license_type || null,
        data.pilot_stage || null,
        data.license_issuing_authority || null,
        data.aircraft_types ? JSON.stringify(data.aircraft_types) : null,
        data.aircraft_category || null,
        data.license_types ? JSON.stringify(data.license_types) : null,
        data.type_ratings ? JSON.stringify(data.type_ratings) : null,
        data.type_rating_input || null,
        data.elp_level || null,
        data.medical_class || null,
        data.employment_status || null,
        data.current_job || null,
        data.career_goal || null,
        data.other_licence || null,
        data.bio || null,
        data.linkedin_url || null,
        data.instagram_url || null,
        data.domicile || null,
        data.is_visitor ? 1 : 0,
        data.hours_whole || null,
        data.hours_minutes || null,
        data.origin_jurisdiction || null,
        data.logbook_sync_valid ? 1 : 0,
        data.referral_code || generateReferralCode(id),
        now,
        now
      ).run();

      // If user was referred, track it
      if (data.referred_by) {
        await db.prepare(`
          INSERT INTO referral_uses (id, referral_code, referrer_id, referred_id, referred_email, status, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)
        `).bind(
          crypto.randomUUID(),
          data.referred_by,
          data.referrer_id || '',
          id,
          data.email || '',
          now,
          now
        ).run();
      }

      // Create Dodo discount code for this user's referrals
      const referralCode = data.referral_code || generateReferralCode(id);
      const dodoApiKey = (env as any).DODO_API_KEY;
      if (dodoApiKey) {
        try {
          const dodoBaseUrl = (env as any).DODO_ENV === 'test' ? 'https://test.dodopayments.com' : 'https://live.dodopayments.com';
          const discountRes = await fetch(`${dodoBaseUrl}/v1/discounts`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${dodoApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: `Referral - ${data.display_name || data.name || data.email || id.slice(-8)}`,
              code: referralCode,
              amount: 20,
              type: 'percentage',
              usage_limit: 50,
              preserve_on_plan_change: true,
              restricted_to: [(env as any).DODO_PRODUCT_ID_RECOGNITION_PLUS].filter(Boolean),
            }),
          });
          if (!discountRes.ok) {
            const errText = await discountRes.text().catch(() => 'unknown');
            console.error('[Dodo Discount] failed:', discountRes.status, errText);
          } else {
            console.log('[Dodo Discount] created:', referralCode);
          }
        } catch (err: any) {
          console.error('[Dodo Discount] error:', err.message);
        }
      }

      return { id, ...data, referral_code: referralCode, created_at: now, updated_at: now };
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
        avatar_url: 'avatar_url', profile_image_url: 'profile_image_url', profile_image_public_id: 'profile_image_public_id',
        phone: 'phone', address: 'address',
        status: 'status', current_level: 'current_level',
        terms_accepted_at: 'terms_accepted_at',
        data_controller_agreement_accepted: 'data_controller_agreement_accepted',
        data_controller_agreement_accepted_at: 'data_controller_agreement_accepted_at',
        license_type: 'license_type', pilot_stage: 'pilot_stage',
        license_issuing_authority: 'license_issuing_authority', aircraft_types: 'aircraft_types',
        aircraft_category: 'aircraft_category', license_types: 'license_types',
        type_ratings: 'type_ratings', type_rating_input: 'type_rating_input',
        elp_level: 'elp_level', medical_class: 'medical_class',
        employment_status: 'employment_status', current_job: 'current_job',
        career_goal: 'career_goal', other_licence: 'other_licence',
        immediate_available: 'immediate_available', unemployed_duration: 'unemployed_duration',
        hours_certified: 'hours_certified', radio_license: 'radio_license',
        bio: 'bio', linkedin_url: 'linkedin_url', instagram_url: 'instagram_url', domicile: 'domicile',
        is_visitor: 'is_visitor', hours_whole: 'hours_whole',
        hours_minutes: 'hours_minutes', origin_jurisdiction: 'origin_jurisdiction',
        logbook_sync_valid: 'logbook_sync_valid',
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
        INSERT INTO profiles (id, auth0_id, email, full_name, display_name, first_name, last_name, role, status, profile_image_url, profile_image_public_id, date_of_birth, nationality, current_occupation, total_flight_hours, current_flight_hours, ratings, license_id, country_of_license, recognition_tier, subscription_tier, terms_accepted_at, data_controller_agreement_accepted, data_controller_agreement_accepted_at, license_type, pilot_stage, license_issuing_authority, aircraft_types, aircraft_category, license_types, type_ratings, type_rating_input, elp_level, medical_class, employment_status, current_job, career_goal, other_licence, bio, linkedin_url, instagram_url, domicile, is_visitor, hours_whole, hours_minutes, origin_jurisdiction, logbook_sync_valid, app_access, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        newId, auth0Id, data.email || '', data.name || null, data.display_name || null,
        data.first_name || null, data.last_name || null, data.role || 'pilot', data.status || 'active',
        data.profile_image_url || null, data.profile_image_public_id || null,
        data.date_of_birth || null, data.nationality || null, data.current_occupation || null,
        data.total_flight_hours || 0, data.current_flight_hours || 0,
        data.ratings ? JSON.stringify(data.ratings) : null,
        data.license_id || null, data.country_of_license || null,
        data.recognition_tier || 'Bronze', data.subscription_tier || 'free',
        data.terms_accepted_at || null,
        data.data_controller_agreement_accepted ? 1 : 0,
        data.data_controller_agreement_accepted_at || null,
        data.license_type || null,
        data.pilot_stage || null,
        data.license_issuing_authority || null,
        data.aircraft_types ? JSON.stringify(data.aircraft_types) : null,
        data.aircraft_category || null,
        data.license_types ? JSON.stringify(data.license_types) : null,
        data.type_ratings ? JSON.stringify(data.type_ratings) : null,
        data.type_rating_input || null,
        data.elp_level || null,
        data.medical_class || null,
        data.employment_status || null,
        data.current_job || null,
        data.career_goal || null,
        data.other_licence || null,
        data.bio || null,
        data.linkedin_url || null,
        data.instagram_url || null,
        data.domicile || null,
        data.is_visitor ? 1 : 0,
        data.hours_whole || null,
        data.hours_minutes || null,
        data.origin_jurisdiction || null,
        data.logbook_sync_valid ? 1 : 0,
        Object.keys(onboardingMeta).length > 0 ? JSON.stringify(onboardingMeta) : null,
        now, now
      ).run();
      // Welcome notification for new pilots
      await db.prepare(`
        INSERT INTO pilot_notifications (id, pilot_id, type, title, message, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        crypto.randomUUID(), newId, 'welcome',
        'Welcome to PilotRecognition',
        'Complete your advanced profile to unlock pathway matching. Add your ratings, medical, and verify your credentials to get recognized by airlines.',
        now
      ).run();
      return { id: newId, created: true };
    }

    case 'updateProfile': {
      const { id, ...updates } = params || {};
      if (!id) throw new Error('Profile id required');

      const rateLimit = await checkRateLimit(db, id, 'updateProfile', 2);
      if (!rateLimit.allowed) {
        throw new Error(`Profile update limit reached. ${rateLimit.remaining} changes remaining. Resets on ${new Date(rateLimit.resetsAt).toLocaleDateString()}.`);
      }

      const setClauses: string[] = [];
      const values: any[] = [];

      const allowedFields = [
        'full_name', 'display_name', 'first_name', 'last_name', 'role', 'status',
        'avatar_url', 'profile_image_url', 'profile_image_public_id', 'phone', 'address', 'date_of_birth', 'nationality',
        'current_flight_hours', 'total_flight_hours', 'mentorship_hours',
        'foundation_progress', 'overall_recognition_score', 'current_level',
        'current_occupation', 'license_id', 'country_of_license', 'ratings',
        'pilot_id', 'enrolled_programs', 'app_access', 'is_enrolled_in_foundational',
        'recognition_tier', 'subscription_tier', 'terms_accepted_at',
        'data_controller_agreement_accepted', 'data_controller_agreement_accepted_at',
        'license_type', 'pilot_stage', 'license_issuing_authority', 'aircraft_types',
        'aircraft_category', 'license_types', 'type_ratings', 'type_rating_input',
        'elp_level', 'medical_class', 'employment_status', 'current_job',
        'career_goal', 'other_licence', 'bio', 'linkedin_url', 'instagram_url', 'domicile', 'is_visitor',
        'hours_whole', 'hours_minutes', 'origin_jurisdiction', 'logbook_sync_valid',
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

      await recordChange(db, id, 'updateProfile');

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

    // ── Notifications ───────────────────────────────────
    case 'getNotifications': {
      const { user_id, limit } = params || {};
      const { results } = await db.prepare(`
        SELECT id, pilot_id as user_id, type, title, message, data, is_read as read_at, created_at
        FROM pilot_notifications
        WHERE pilot_id = ?
        ORDER BY created_at DESC
        LIMIT ?
      `).bind(user_id, limit || 50).all();
      // Convert is_read integer to read_at string for frontend compatibility
      return (results || []).map((n: any) => ({
        ...n,
        read_at: n.read_at ? new Date().toISOString() : undefined,
      }));
    }

    case 'markNotificationRead': {
      const { id } = params || {};
      await db.prepare(`
        UPDATE pilot_notifications SET is_read = 1, read_at = ? WHERE id = ?
      `).bind(new Date().toISOString(), id).run();
      return { success: true };
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

    // ── Unified dashboard load — one request, all data ─────
    case 'getDashboardData': {
      const { user_id, auth0_id, email } = params || {};
      if (!user_id && !auth0_id) throw new Error('user_id or auth0_id required');

      const id = user_id || auth0_id;
      const isAuth0 = !user_id && !!auth0_id;

      let profile = null;
      if (isAuth0) {
        const { results: auth0Results } = await db.prepare('SELECT * FROM profiles WHERE auth0_id = ?').bind(id).all();
        profile = auth0Results?.[0] || null;
        // Fallback: some legacy profiles use email as auth0_id
        if (!profile && email) {
          const { results: emailResults } = await db.prepare('SELECT * FROM profiles WHERE auth0_id = ? OR email = ?').bind(id, email).all();
          profile = emailResults?.[0] || null;
        }
      } else {
        const { results: idResults } = await db.prepare('SELECT * FROM profiles WHERE id = ?').bind(id).all();
        profile = idResults?.[0] || null;
      }

      if (!profile) return { profile: null, flight_hours: null, badges: [], verification_receipts: [] };

      const profileId = profile.id;

      const [{ results: fhResults }, { results: badgeResults }, { results: receiptResults }, { results: credentialResults }, { results: licensureResults }] = await Promise.all([
        db.prepare('SELECT * FROM flight_hours WHERE user_id = ?').bind(profileId).all(),
        db.prepare('SELECT * FROM mentorship_badges WHERE user_id = ? ORDER BY earned_at DESC').bind(profileId).all(),
        db.prepare('SELECT * FROM verification_receipts WHERE user_id = ? ORDER BY updated_at DESC').bind(profileId).all(),
        db.prepare('SELECT * FROM pilot_credentials WHERE user_id = ? ORDER BY issued_at DESC').bind(profileId).all(),
        db.prepare('SELECT * FROM pilot_licensure_experience WHERE user_id = ?').bind(profileId).all(),
      ]);

      const licensure = (licensureResults?.[0] || null) as Record<string, unknown> | null;
      const parsedLicensure = licensure?.license_data ? JSON.parse(licensure.license_data as string) : null;

      return {
        profile,
        flight_hours: fhResults?.[0] || null,
        badges: badgeResults || [],
        verification_receipts: receiptResults || [],
        credentials: credentialResults || [],
        licensure: parsedLicensure,
      };
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

    // ── Logbook CSV ──────────────────────────────────────
    case 'uploadLogbookCSV': {
      const { user_id, csv_data, filename } = params || {};
      if (!user_id || !csv_data) throw new Error('user_id and csv_data required');
      const now = new Date().toISOString();
      const rowCount = (csv_data.split('\n').filter((r: string) => r.trim()).length) - 1; // minus header
      // Delete existing CSV for this user (one per user)
      await db.prepare('DELETE FROM pilot_logbook_csv WHERE user_id = ?').bind(user_id).run();
      const id = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO pilot_logbook_csv (id, user_id, filename, csv_data, row_count, uploaded_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(id, user_id, filename || 'logbook.csv', csv_data, Math.max(0, rowCount), now).run();
      return { success: true, id, row_count: Math.max(0, rowCount) };
    }

    case 'getLogbookCSV': {
      const { user_id } = params || {};
      if (!user_id) throw new Error('user_id required');
      const result = await db.prepare('SELECT * FROM pilot_logbook_csv WHERE user_id = ? ORDER BY uploaded_at DESC LIMIT 1').bind(user_id).first();
      return result || null;
    }

    case 'deleteLogbookCSV': {
      const { user_id } = params || {};
      if (!user_id) throw new Error('user_id required');
      await db.prepare('DELETE FROM pilot_logbook_csv WHERE user_id = ?').bind(user_id).run();
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

    // ── Licensure (stub) ─────────────────────────────────
    case 'getLicensure': {
      const { user_id } = params || {};
      const { results } = await db.prepare('SELECT * FROM pilot_licensure_experience WHERE user_id = ?').bind(user_id).all();
      return results?.[0] || null;
    }

    case 'saveLicensure': {
      const data = params || {};
      const userId = data.user_id;
      if (!userId) throw new Error('user_id required');

      const rateLimit = await checkRateLimit(db, userId, 'saveLicensure', 2);
      if (!rateLimit.allowed) {
        throw new Error(`Licensure save limit reached. ${rateLimit.remaining} changes remaining. Resets on ${new Date(rateLimit.resetsAt).toLocaleDateString()}.`);
      }

      const { results } = await db.prepare('SELECT id FROM pilot_licensure_experience WHERE user_id = ?').bind(userId).all();
      const existingId = results?.[0]?.id as string | undefined;
      const now = new Date().toISOString();
      if (existingId) {
        await db.prepare('UPDATE pilot_licensure_experience SET license_data = ?, updated_at = ? WHERE id = ?')
          .bind(JSON.stringify(data), now, existingId).run();
      } else {
        await db.prepare('INSERT INTO pilot_licensure_experience (id, user_id, license_data, created_at, updated_at) VALUES (?, ?, ?, ?, ?)')
          .bind(crypto.randomUUID(), userId, JSON.stringify(data), now, now).run();
      }
      await recordChange(db, userId, 'saveLicensure');
      return { success: true };
    }

    // ── Recognition score (stub) ───────────────────────────
    case 'getRecognitionScore': {
      const { user_id } = params || {};
      const { results } = await db.prepare('SELECT id, total_flight_hours, overall_recognition_score, recognition_tier FROM profiles WHERE id = ?').bind(user_id).all();
      const profile = results?.[0] as Record<string, unknown> | undefined;
      return {
        user_id,
        total_score: profile?.overall_recognition_score || 0,
        hours_score: profile?.total_flight_hours || 0,
        tier: profile?.recognition_tier || 'Bronze',
        updated_at: new Date().toISOString(),
      };
    }

    case 'getUserRank': {
      return 0;
    }

    case 'getScoreStatistics': {
      return { total_pilots: 0, average_score: 0, top_tier: 'Bronze' };
    }

    case 'saveRecognitionScore': {
      return { success: true };
    }

    case 'getLeaderboard': {
      return [];
    }

    // ── Wallet / referral / email / MFA (stubs) ────────────
    case 'provisionWallet': {
      return { success: true, wallet_id: params?.profile_id || crypto.randomUUID() };
    }

    case 'sendAccountCreatedEmail': {
      return { success: true };
    }

    case 'generateReferral': {
      const userId = params?.user_id as string;
      if (!userId) throw new Error('Missing user_id');
      const code = generateReferralCode(userId);
      await db.prepare('UPDATE profiles SET referral_code = ? WHERE id = ?').bind(code, userId).run();
      return { success: true, referral_code: code };
    }

    case 'getReferralStats': {
      const userId = params?.user_id as string;
      if (!userId) throw new Error('Missing user_id');
      const { results } = await db.prepare(`
        SELECT id, referral_code, referred_id, referred_email, status, reward_amount, reward_type, created_at
        FROM referral_uses WHERE referrer_id = ? ORDER BY created_at DESC
      `).bind(userId).all();
      const profile = await db.prepare('SELECT referral_code FROM profiles WHERE id = ?').bind(userId).first() as Record<string, unknown> | undefined;
      return {
        referral_code: profile?.referral_code || null,
        total_referrals: (results || []).length,
        pending: (results || []).filter((r: any) => r.status === 'pending').length,
        claimed: (results || []).filter((r: any) => r.status === 'claimed').length,
        paid: (results || []).filter((r: any) => r.status === 'paid').length,
        referrals: results || [],
      };
    }

    case 'updateReferralStatus': {
      const { referral_id, status, notes } = params || {};
      if (!referral_id || !status) throw new Error('Missing referral_id or status');
      const now = new Date().toISOString();
      await db.prepare(`
        UPDATE referral_uses SET status = ?, notes = ?, updated_at = ? WHERE id = ?
      `).bind(status, notes || null, now, referral_id).run();
      return { success: true };
    }

    case 'mfaBackupCodes': {
      return { success: true, codes: [] };
    }

    case 'mfaSetup': {
      return { success: true };
    }

    case 'deleteAccount': {
      return { success: true };
    }

    case 'createMentorshipRequest': {
      return { success: true, id: crypto.randomUUID() };
    }

    default:
      console.warn(`[Worker] Unknown action: ${action}. Returning safe default.`);
      return { success: false, error: `Unknown action: ${action}`, _stub: true };
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
    const discountCode = body.discount?.code || body.discount_code;

    if (userId) {
      await db.prepare('UPDATE profiles SET subscription_tier = ? WHERE id = ?')
        .bind(tier, userId)
        .run();

      // If a referral discount code was used, mark it as claimed
      if (discountCode && discountCode.startsWith('PR-')) {
        const now = new Date().toISOString();
        await db.prepare(`
          UPDATE referral_uses SET status = 'claimed', updated_at = ?
          WHERE referral_code = ? AND referred_id = ? AND status = 'pending'
        `).bind(now, discountCode, userId).run();
      }

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
  const { user_id, email, name, return_url } = body;

  if (!user_id) {
    return jsonResponse({ error: 'user_id required' }, 400);
  }

  // Dodo Payments API configuration
  const dodoApiKey = (env as any).DODO_API_KEY;
  const dodoProductId = (env as any).DODO_PRODUCT_ID_RECOGNITION_PLUS;
  const dodoBaseUrl = (env as any).DODO_ENV === 'test' ? 'https://test.dodopayments.com' : 'https://live.dodopayments.com';

  if (!dodoApiKey || !dodoProductId) {
    return jsonResponse({ error: 'Dodo Payments not configured' }, 500);
  }

  const origin = request.headers.get('Origin') || 'https://pilotrecognition.com';
  const successUrl = return_url || `${origin}/platform?tab=verification&checkout=success`;
  const cancelUrl = `${origin}/platform?tab=verification&checkout=cancelled`;

  try {
    const checkoutRes = await fetch(`${dodoBaseUrl}/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${dodoApiKey}`,
      },
      body: JSON.stringify({
        product_cart: [{ product_id: dodoProductId, quantity: 1 }],
        customer: email ? { email, name: name || undefined } : undefined,
        return_url: successUrl,
        cancel_url: cancelUrl,
        metadata: { user_id, tier },
        feature_flags: {
          allow_customer_editing_email: true,
          allow_customer_editing_name: true,
        },
      }),
    });

    const checkoutData = await checkoutRes.json().catch(() => ({}));

    if (!checkoutRes.ok) {
      console.error('[Dodo Checkout] error:', checkoutData);
      return jsonResponse({ error: checkoutData.message || 'Checkout creation failed' }, checkoutRes.status);
    }

    return jsonResponse({
      checkout_url: checkoutData.checkout_url,
      session_id: checkoutData.session_id,
      status: 'ready',
    });
  } catch (err: any) {
    console.error('[Dodo Checkout] exception:', err.message);
    return jsonResponse({ error: err.message || 'Checkout creation failed' }, 500);
  }
}

function generateReferralCode(userId: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'PR-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  result += '-' + userId.slice(-4).toUpperCase();
  return result;
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
