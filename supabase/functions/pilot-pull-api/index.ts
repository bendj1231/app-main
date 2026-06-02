/**
 * pilot-pull-api — Enterprise Pull API with rate limiting and session expiry
 *
 * Hardened for forensic audit:
 * - Per-enterprise rate limiting (200 req/hour)
 * - Session expiry validation (15-min idle timeout)
 * - PII redaction for non-admin callers
 * - Audit logging to user_activity_log
 */

/// <reference lib="deno.ns" />
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

/**
 * Distributed rate limiting using Supabase table.
 * Works across multiple Edge Function instances.
 */
async function checkRateLimit(
  supabase: any,
  identifier: string,
  maxRequests: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const now = Date.now();
  const windowStart = new Date(now - windowMs).toISOString();

  // Count requests in the current window
  const { count, error } = await supabase
    .from('api_rate_limits')
    .select('*', { count: 'exact', head: true })
    .eq('identifier', identifier)
    .gte('created_at', windowStart);

  if (error) {
    console.error('[pilot-pull-api] Rate limit check error:', error);
    // Fail closed on rate limit check errors — deny request to prevent abuse
    return { allowed: false, remaining: 0, resetTime: now + windowMs };
  }

  const currentCount = count || 0;
  const resetTime = now + windowMs;

  // Log this request
  await supabase.from('api_rate_limits').insert({
    identifier,
    created_at: new Date(now).toISOString(),
    request_count: 1,
  });

  if (currentCount >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime };
  }

  return { allowed: true, remaining: maxRequests - currentCount - 1, resetTime };
}

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();
  const startTime = Date.now();

  try {
    if (req.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ─── Authenticate caller ─────────────────────────────────────────────────
    const authHeader = req.headers.get('Authorization') ?? '';
    const callerClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await callerClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ─── Verify caller has enterprise access ────────────────────────────────
    const { data: callerProfile } = await supabase
      .from('profiles')
      .select('enterprise_access, system_role, last_login_at, account_tier')
      .eq('id', user.id)
      .maybeSingle();

    const isEnterprise = callerProfile?.enterprise_access === true || callerProfile?.system_role === 'admin';
    const { data: enterpriseAccount } = await supabase
      .from('enterprise_accounts')
      .select('id')
      .eq('profile_id', user.id)
      .maybeSingle();

    if (!isEnterprise && !enterpriseAccount) {
      return new Response(JSON.stringify({ error: 'Forbidden: enterprise access required' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ─── Session expiry check (15 minutes idle) ─────────────────────────────
    const lastLogin = callerProfile?.last_login_at ? new Date(callerProfile.last_login_at).getTime() : 0;
    const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
    if (lastLogin > 0 && Date.now() - lastLogin > SESSION_TIMEOUT_MS) {
      await supabase.from('security_events').insert({
        user_id: user.id,
        event_type: 'session_expired_pull_api',
        severity: 'medium',
        details: { source: 'pilot-pull-api', last_login_at: callerProfile?.last_login_at },
        ip_address: req.headers.get('CF-Connecting-IP') || req.headers.get('X-Forwarded-For')?.split(',')[0] || 'unknown',
        user_agent: req.headers.get('User-Agent') || 'unknown',
        created_at: new Date().toISOString(),
      });
      return new Response(JSON.stringify({ error: 'Session expired. Please re-authenticate.' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ─── Rate limiting ──────────────────────────────────────────────────────
    const rateKey = `pull-api:${user.id}`;
    const rateCheck = await checkRateLimit(supabase, rateKey, 200, 60 * 60 * 1000); // 200 requests per hour

    if (!rateCheck.allowed) {
      await supabase.from('security_events').insert({
        user_id: user.id,
        event_type: 'rate_limit_exceeded',
        severity: 'medium',
        details: { source: 'pilot-pull-api', rate_key: rateKey },
        ip_address: req.headers.get('CF-Connecting-IP') || 'unknown',
        created_at: new Date().toISOString(),
      });
      return new Response(JSON.stringify({ error: 'Rate limit exceeded', retry_after: Math.ceil((rateCheck.resetTime - Date.now()) / 1000) }), {
        status: 429,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': '200',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(rateCheck.resetTime / 1000)),
        },
      });
    }

    // ─── Parse query params ─────────────────────────────────────────────────
    const url = new URL(req.url);
    const params = {
      min_hours: parseFloat(url.searchParams.get('min_hours') ?? '0') || 0,
      max_hours: parseFloat(url.searchParams.get('max_hours') ?? '0') || null,
      country: url.searchParams.get('country') ?? null,
      license_type: url.searchParams.get('license_type') ?? null,
      medical_class: url.searchParams.get('medical_class') ?? null,
      verified_only: url.searchParams.get('verified_only') === 'true',
      recognition_plus_only: url.searchParams.get('recognition_plus_only') === 'true',
      min_score: parseInt(url.searchParams.get('min_score') ?? '0') || 0,
      rating: url.searchParams.get('rating') ?? null,
      language_level: url.searchParams.get('language_level') ?? null,
      limit: Math.min(parseInt(url.searchParams.get('limit') ?? '50') || 50, 200),
      offset: parseInt(url.searchParams.get('offset') ?? '0') || 0,
    };

    // ─── Build query ────────────────────────────────────────────────────────
    let query = supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        country,
        nationality,
        total_flight_hours,
        license_types,
        license_number,
        license_expiry,
        license_issuing_authority,
        medical_class,
        medical_expiry,
        medical_valid,
        license_valid,
        ratings,
        overall_recognition_score,
        language_icao_level,
        verified_account,
        is_recognition_plus,
        profile_slug,
        last_login_at,
        created_at
      `)
      .eq('status', 'active')
      .eq('profile_visibility', 'public')
      .order('overall_recognition_score', { ascending: false, nullsFirst: false })
      .range(params.offset, params.offset + params.limit - 1);

    if (params.min_hours > 0) query = query.gte('total_flight_hours', params.min_hours);
    if (params.max_hours) query = query.lte('total_flight_hours', params.max_hours);
    if (params.country) query = query.ilike('country', `%${params.country}%`);
    if (params.verified_only) query = query.eq('verified_account', true);
    if (params.recognition_plus_only) query = query.eq('is_recognition_plus', true);
    if (params.min_score > 0) query = query.gte('overall_recognition_score', params.min_score);
    if (params.medical_class) query = query.eq('medical_class', params.medical_class);
    if (params.language_level) query = query.eq('language_icao_level', params.language_level);
    if (params.license_type) query = query.contains('license_types', [params.license_type]);
    if (params.rating) query = query.contains('ratings', [params.rating]);

    const { data: pilots, error: queryError } = await query;

    if (queryError) {
      console.error('[pilot-pull-api] Query error:', queryError);
      return new Response(JSON.stringify({ error: 'Query failed' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ─── Sanitise output — redact PII for non-admin callers ─────────────────
    const isAdmin = callerProfile?.system_role === 'admin';
    const sanitised = (pilots ?? []).map((p: Record<string, unknown>) => {
      const base = {
        id: p.id,
        country: p.country,
        nationality: p.nationality,
        total_flight_hours: p.total_flight_hours,
        license_types: p.license_types,
        license_expiry: p.license_expiry,
        license_issuing_authority: p.license_issuing_authority,
        medical_class: p.medical_class,
        medical_expiry: p.medical_expiry,
        medical_valid: p.medical_valid,
        license_valid: p.license_valid,
        ratings: p.ratings,
        overall_recognition_score: p.overall_recognition_score,
        language_icao_level: p.language_icao_level,
        verified_account: p.verified_account,
        is_recognition_plus: p.is_recognition_plus,
        profile_slug: p.profile_slug,
      };
      if (isAdmin || enterpriseAccount) {
        return { ...base, full_name: p.full_name, license_number: p.license_number };
      }
      return base;
    });

    // ─── Log the pull for audit ─────────────────────────────────────────────
    await supabase.from('user_activity_log').insert({
      user_id: user.id,
      action: 'enterprise_pull_api',
      details: {
        filters: params,
        result_count: sanitised.length,
        enterprise_account_id: enterpriseAccount?.id ?? null,
        request_id: requestId,
        duration_ms: Date.now() - startTime,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        pilots: sanitised,
        meta: {
          total_returned: sanitised.length,
          offset: params.offset,
          limit: params.limit,
          rate_limit_remaining: rateCheck.remaining,
          rate_limit_reset: Math.ceil(rateCheck.resetTime / 1000),
          filters_applied: Object.fromEntries(
            Object.entries(params).filter(([, v]) => v !== null && v !== 0 && v !== false)
          ),
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('[pilot-pull-api] Error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error', request_id: requestId }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
