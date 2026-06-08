/// <reference lib="deno.ns" />
/**
 * delete-account — CRITICAL: Requires server-side passkey/MFA verification (C-4 fix)
 * 
 * Security Flow:
 * 1. Client calls passkey-verify with WebAuthn assertion
 * 2. Server verifies passkey cryptographically
 * 3. Server issues short-lived delete-intent token (5-min expiry, single-use)
 * 4. Client calls delete-account with both JWT + delete-intent token
 * 5. Server verifies BOTH before irreversibly deleting account
 * 
 * This prevents:
 * - Custom clients from bypassing passkey verification
 * - Unauthorized account deletion via compromised JWT alone
 */

import "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'DELETE' && req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // ──────────────────────────────────────────────────────────────────────────
    // SECURITY STEP 1: Verify JWT signature via Supabase auth
    // ──────────────────────────────────────────────────────────────────────────
    const authHeader = req.headers.get('Authorization') || '';
    const jwt = authHeader.replace(/^Bearer\s+/i, '');
    if (!jwt) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Missing JWT' }), {
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

    // Look up the profile — sub may be a Supabase UUID or an Auth0 id
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

    // ──────────────────────────────────────────────────────────────────────────
    // SECURITY STEP 2: Verify delete-intent token (CRITICAL C-4 FIX)
    // Requires proof of server-side passkey/MFA verification
    // ──────────────────────────────────────────────────────────────────────────
    const deleteIntentToken = req.headers.get('X-Delete-Intent-Token');
    if (!deleteIntentToken) {
      console.warn(`[SECURITY] Account deletion attempted without delete-intent token for user ${userId}`);
      return new Response(JSON.stringify({
        error: 'Authorization failed: Passkey verification required',
        code: 'PASSKEY_VERIFICATION_REQUIRED',
        details: 'This operation requires re-verification. Call passkey-verify first to obtain a delete-intent token.'
      }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify the delete-intent token is valid, not expired, and matches this user
    const { data: deleteIntentRecord, error: tokenLookupError } = await supabase
      .from('delete_intent_tokens')
      .select('*')
      .eq('user_id', userId)
      .eq('token', deleteIntentToken)
      .eq('consumed', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (tokenLookupError || !deleteIntentRecord) {
      console.warn(`[SECURITY] Invalid/expired delete-intent token attempted for user ${userId}`);
      return new Response(JSON.stringify({
        error: 'Authorization failed: Token invalid, expired, or already used',
        code: 'INVALID_DELETE_INTENT_TOKEN'
      }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Mark token as consumed (single-use)
    await supabase
      .from('delete_intent_tokens')
      .update({ consumed: true, consumed_at: new Date().toISOString() })
      .eq('id', deleteIntentRecord.id);

    console.info(`[AUDIT] Account deletion authorized for user ${userId} via valid delete-intent token`);

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

    // NOTE: match_agreements and recognition_fee_invoices are INTENTIONALLY NOT deleted.
    // These are permanent financial audit records required for tax compliance.
    // pilot_id in match_agreements is stored as raw UUID (no FK) — the record
    // remains intact but becomes anonymized when the pilot's profile is deleted.
    // recognition_fee_invoices stores only static snapshot data (name, reference code)
    // and has NO foreign key to profiles — it survives deletion completely.

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
