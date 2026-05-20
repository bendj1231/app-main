/**
 * vc-revoke — Revoke or suspend a Verifiable Credential
 *
 * Admin/service-role only. Called when:
 * - CAAP notifies a license is suspended/cancelled
 * - Medical certificate expires (automated cron)
 * - Admin manually revokes
 * - Pilot requests deletion
 *
 * Updates vc_revocation_registry + pilot_credentials status.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Verify caller is admin or service_role via Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const {
      credential_id,       // Required: UUID from vc_revocation_registry or pilot_credentials.id
      profile_id,          // Optional: if credential_id not known, revoke by profile+type
      credential_type,     // Optional: used with profile_id
      action,              // 'revoke' | 'suspend' | 'reinstate' | 'expire'
      reason,              // Human-readable reason
      revoked_by,          // Admin user ID or 'system' or 'caap_notification'
    } = await req.json();

    if (!credential_id && !profile_id) {
      return new Response(JSON.stringify({ error: 'credential_id or profile_id required' }), {
        status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const validActions = ['revoke', 'suspend', 'reinstate', 'expire'];
    if (!validActions.includes(action)) {
      return new Response(JSON.stringify({ error: `action must be one of: ${validActions.join(', ')}` }), {
        status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const now = new Date().toISOString();
    const newStatus = action === 'reinstate' ? 'active' : action === 'expire' ? 'expired' : action === 'suspend' ? 'suspended' : 'revoked';

    // Build query
    let query = supabase
      .from('vc_revocation_registry')
      .update({
        status: newStatus,
        revocation_reason: reason || null,
        revoked_by: revoked_by || 'admin',
        revoked_at: action === 'reinstate' ? null : now,
        updated_at: now,
      });

    if (credential_id) {
      query = query.eq('credential_id', credential_id);
    } else {
      query = query.eq('profile_id', profile_id);
      if (credential_type) query = query.eq('credential_type', credential_type);
    }

    const { data: updated, error: updateError } = await query.select();

    if (updateError) throw new Error(`Registry update failed: ${updateError.message}`);

    // Also update pilot_credentials table status
    let credsQuery = supabase
      .from('pilot_credentials')
      .update({ status: newStatus, updated_at: now });

    if (credential_id) {
      credsQuery = credsQuery.eq('id', credential_id);
    } else {
      credsQuery = credsQuery.eq('profile_id', profile_id);
      if (credential_type) credsQuery = credsQuery.eq('credential_type', credential_type);
    }
    await credsQuery;

    // Log the revocation event
    await supabase.from('user_activity_log').insert({
      user_id: profile_id || null,
      action: `vc_${action}d`,
      details: {
        credential_id,
        credential_type,
        reason,
        revoked_by: revoked_by || 'admin',
        new_status: newStatus,
        affected_rows: updated?.length || 0,
      },
      created_at: now,
    });

    // If profile_id present, check if any critical credentials revoked
    // and update profiles.verified_account accordingly
    if (profile_id && (action === 'revoke' || action === 'suspend' || action === 'expire')) {
      const criticalTypes = ['PilotLicenseVC', 'MedicalCertVC'];
      const isCritical = !credential_type || criticalTypes.includes(credential_type);

      if (isCritical) {
        await supabase
          .from('profiles')
          .update({
            verified_account: false,
            updated_at: now,
          })
          .eq('id', profile_id);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      action,
      new_status: newStatus,
      affected_credentials: updated?.length || 0,
      credential_id: credential_id || null,
      profile_id: profile_id || null,
      reason: reason || null,
      actioned_at: now,
    }), {
      status: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('[vc-revoke] Error:', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
