import "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'DELETE' && req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    // Verify the requesting user via JWT — prevents deleting other users' accounts
    const authClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: req.headers.get('Authorization')! } },
    });

    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = user.id;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

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
    await supabase.from('logbook_hour_tokens').delete().eq('user_id', userId);

    await supabase.from('profiles').delete().eq('id', userId);

    // Delete the auth user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
    if (deleteError) throw deleteError;

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
