import "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'DELETE' && req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Decode the JWT to extract sub — works for both Supabase JWTs and Auth0 JWTs
    const authHeader = req.headers.get('Authorization') || '';
    const jwt = authHeader.replace(/^Bearer\s+/i, '');
    if (!jwt) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let sub: string | null = null;
    try {
      const parts = jwt.split('.');
      if (parts.length !== 3) throw new Error('bad jwt structure');
      // Restore standard base64 from base64url, then pad to multiple of 4
      let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4 !== 0) b64 += '=';
      const payload = JSON.parse(atob(b64));
      sub = payload.sub as string;
      console.log('[delete-account] decoded sub:', sub);
    } catch (e: any) {
      console.error('[delete-account] JWT decode error:', e.message, '| jwt prefix:', jwt.substring(0, 30));
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!sub) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Look up the profile — sub may be a Supabase UUID or an Auth0 id (google-oauth2|...)
    const isAuth0 = sub.includes('|');
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, auth0_id')
      .eq(isAuth0 ? 'auth0_id' : 'id', sub)
      .maybeSingle();

    if (!profile?.id) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = profile.id;

    // Delete pilot documents from storage
    const { data: docs } = await supabase
      .from('pilot_documents')
      .select('storage_path')
      .eq('pilot_id', userId);

    if (docs && docs.length > 0) {
      const paths = docs.map((d: any) => d.storage_path).filter(Boolean);
      if (paths.length > 0) {
        await supabase.storage.from('pilot-documents').remove(paths);
      }
    }

    // Delete profile image from storage if it exists
    const { data: profileData } = await supabase
      .from('profiles')
      .select('profile_image_url')
      .eq('id', userId)
      .single();

    if (profileData?.profile_image_url) {
      try {
        const url = new URL(profileData.profile_image_url);
        const pathParts = url.pathname.split('/object/public/');
        if (pathParts.length > 1) {
          await supabase.storage.from('profile pics').remove([pathParts[1]]);
        }
      } catch (error) {
        console.error('Error deleting profile image:', error);
      }
    }

    // Delete all related data rows — complete ciphertext purge for DCA Article 6 compliance
    await supabase.from('pilot_documents').delete().eq('pilot_id', userId);
    await supabase.from('pilot_licensure_experience').delete().eq('user_id', userId);
    await supabase.from('pilot_passkeys').delete().eq('user_id', userId);
    await supabase.from('pilot_passkey_challenges').delete().eq('user_id', userId);
    await supabase.from('user_activity_log').delete().eq('user_id', userId);
    await supabase.from('pathway_card_interests').delete().eq('pilot_id', userId);
    await supabase.from('user_app_access').delete().eq('user_id', userId);
    await supabase.from('enrollments').delete().eq('user_id', userId);

    // Wallet & VC data — must be revoked before deletion
    await supabase.from('vc_revocation_registry').delete().eq('subject_id', userId);
    await supabase.from('pilot_verification_wallet').delete().eq('profile_id', userId);
    await supabase.from('pilot_credentials').delete().eq('user_id', userId);
    await supabase.from('credential_requests').delete().eq('user_id', userId);

    // Logbook data
    await supabase.from('logbook_provider_sync').delete().eq('user_id', userId);
    await supabase.from('logbook_hour_tokens').delete().eq('pilot_id', userId);
    await supabase.from('pilot_flight_logs').delete().eq('user_id', userId);

    // Program & resume data
    await supabase.from('atlas_resumes').delete().eq('user_id', userId);
    await supabase.from('program_progress').delete().eq('user_id', userId);
    await supabase.from('completion_tracking').delete().eq('user_id', userId);

    // Interview data
    await supabase.from('interview_assessments').delete().eq('interviewer_id', userId);
    await supabase.from('interview_feedback').delete().eq('reviewer_id', userId);
    await supabase.from('interviews').delete().eq('pilot_profile_id', userId);

    await supabase.from('profiles').delete().eq('id', userId);

    // Delete the Supabase auth user only if this is a native Supabase user
    // Auth0 users have no Supabase auth record — attempting deleteUser would fail
    if (!profile.auth0_id) {
      const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
      if (deleteError) console.error('deleteUser error (non-fatal):', deleteError.message);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Account and all associated data permanently deleted.', deleted_at: new Date().toISOString() }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in delete-account function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
