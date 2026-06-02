/**
 * data-export — GDPR Art. 20 / RA 10173 s.16 Data Portability
 * Returns a complete machine-readable export of all personal data
 * held about the authenticated user across all platform tables.
 */

/// <reference lib="deno.ns" />
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify JWT signature via Supabase auth
    const authHeader = req.headers.get('Authorization') || '';
    const jwt = authHeader.replace(/^Bearer\s+/i, '');
    if (!jwt) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } }
    });
    const { data: { user }, error: authErr } = await supabaseAuth.auth.getUser();
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const sub = user.id;
    const auth0Sub = user.user_metadata?.sub as string | undefined;

    const isAuth0 = typeof auth0Sub === 'string' && auth0Sub.includes('|');
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, auth0_id')
      .eq(isAuth0 ? 'auth0_id' : 'id', isAuth0 ? auth0Sub : sub)
      .maybeSingle();

    if (!profile?.id) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = profile.id;

    // ─── Collect all personal data ───────────────────────────────────────

    const tables = [
      { name: 'profiles', query: supabase.from('profiles').select('*').eq('id', userId).single() },
      { name: 'pilot_documents', query: supabase.from('pilot_documents').select('*').eq('pilot_id', userId) },
      { name: 'pilot_licensure_experience', query: supabase.from('pilot_licensure_experience').select('*').eq('user_id', userId) },
      { name: 'pilot_passkeys', query: supabase.from('pilot_passkeys').select('id, credential_id, public_key_hex, sign_count, created_at').eq('user_id', userId) },
      { name: 'user_activity_log', query: supabase.from('user_activity_log').select('*').eq('user_id', userId) },
      { name: 'pathway_card_interests', query: supabase.from('pathway_card_interests').select('*').eq('pilot_id', userId) },
      { name: 'user_app_access', query: supabase.from('user_app_access').select('*').eq('user_id', userId) },
      { name: 'enrollments', query: supabase.from('enrollments').select('*').eq('user_id', userId) },
      { name: 'pilot_verification_wallet', query: supabase.from('pilot_verification_wallet').select('*').eq('profile_id', userId) },
      { name: 'pilot_credentials', query: supabase.from('pilot_credentials').select('*').eq('user_id', userId) },
      { name: 'credential_requests', query: supabase.from('credential_requests').select('*').eq('user_id', userId) },
      { name: 'logbook_provider_sync', query: supabase.from('logbook_provider_sync').select('*').eq('user_id', userId) },
      { name: 'logbook_hour_tokens', query: supabase.from('logbook_hour_tokens').select('*').eq('pilot_id', userId) },
      { name: 'pilot_flight_logs', query: supabase.from('pilot_flight_logs').select('*').eq('user_id', userId) },
      { name: 'atlas_resumes', query: supabase.from('atlas_resumes').select('*').eq('user_id', userId) },
      { name: 'program_progress', query: supabase.from('program_progress').select('*').eq('user_id', userId) },
      { name: 'completion_tracking', query: supabase.from('completion_tracking').select('*').eq('user_id', userId) },
      { name: 'interview_assessments', query: supabase.from('interview_assessments').select('*').eq('interviewer_id', userId) },
      { name: 'interview_feedback', query: supabase.from('interview_feedback').select('*').eq('reviewer_id', userId) },
      { name: 'interviews', query: supabase.from('interviews').select('*').eq('pilot_profile_id', userId) },
      { name: 'vc_revocation_registry', query: supabase.from('vc_revocation_registry').select('*').eq('profile_id', userId) },
      { name: 'ato_activation_credits', query: supabase.from('ato_activation_credits').select('*').eq('pilot_id', userId) },
      { name: 'referral_credits', query: supabase.from('referral_credits').select('*').eq('referrer_id', userId) },
    ];

    const exportPackage: Record<string, any> = {
      export_metadata: {
        generated_at: new Date().toISOString(),
        platform: 'PilotRecognition.com',
        legal_basis: 'GDPR Article 20 / RA 10173 Section 16 — Right to Data Portability',
        profile_id: userId,
        format_version: '1.0',
      },
    };

    for (const { name, query } of tables) {
      const { data, error } = await query;
      if (error) {
        console.warn(`[data-export] Table ${name} query error:`, error.message);
        exportPackage[name] = { _error: error.message, _records: [] };
      } else {
        exportPackage[name] = data || [];
      }
    }

    // Log the export request for audit
    await supabase.from('user_activity_log').insert({
      user_id: userId,
      action: 'data_export_requested',
      details: {
        format: 'json',
        tables_exported: tables.length,
        generated_at: new Date().toISOString(),
      },
      created_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify(exportPackage, null, 2),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="pilotrecognition-data-export-${userId.slice(0, 8)}.json"`,
        },
      }
    );
  } catch (err: any) {
    console.error('[data-export] error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
