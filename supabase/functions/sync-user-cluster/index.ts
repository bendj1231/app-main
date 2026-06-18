/// <reference lib="deno.ns" />
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

import { getCorsHeaders } from '../_shared/cors.ts';

interface UserSyncPayload {
  auth0_id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  supabase_uid?: string;
}

interface SyncResult {
  sydney: { success: boolean; error?: string };
  singapore: { success: boolean; error?: string };
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const payload: UserSyncPayload = await req.json();
    const { auth0_id, email, display_name, avatar_url, supabase_uid } = payload;

    if (!auth0_id || !email) {
      return new Response(JSON.stringify({ error: 'auth0_id and email required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const result: SyncResult = {
      sydney: { success: false },
      singapore: { success: false }
    };

    // ─── Sync to Sydney (local) ───
    try {
      const sydneyClient = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );

      const { error: sydneyError } = await sydneyClient
        .from('profiles')
        .upsert({
          auth0_id,
          email,
          display_name: display_name || email.split('@')[0],
          avatar_url: avatar_url || null,
          total_flight_hours: 0,
          account_tier: 'free',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'auth0_id' });

      if (sydneyError) {
        result.sydney.error = sydneyError.message;
        console.error('[SyncUser] Sydney sync failed:', sydneyError);
      } else {
        result.sydney.success = true;
      }
    } catch (err) {
      result.sydney.error = err instanceof Error ? err.message : String(err);
      console.error('[SyncUser] Sydney exception:', err);
    }

    // ─── Sync to Singapore (remote REST API) ───
    try {
      const singaporeUrl = Deno.env.get('SINGAPORE_SUPABASE_URL');
      const singaporeKey = Deno.env.get('SINGAPORE_SERVICE_ROLE_KEY');

      if (!singaporeUrl || !singaporeKey) {
        result.singapore.error = 'Singapore credentials not configured';
      } else {
        const res = await fetch(`${singaporeUrl}/rest/v1/profiles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': singaporeKey,
            'Authorization': `Bearer ${singaporeKey}`,
            'Prefer': 'resolution=merge-duplicates',
          },
          body: JSON.stringify({
            auth0_id,
            email,
            display_name: display_name || email.split('@')[0],
            avatar_url: avatar_url || null,
            total_flight_hours: 0,
            account_tier: 'free',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        });

        if (!res.ok && res.status !== 409) { // 409 = conflict on upsert, which is fine
          const errText = await res.text().catch(() => 'unknown');
          result.singapore.error = `HTTP ${res.status}: ${errText}`;
          console.error('[SyncUser] Singapore sync failed:', res.status, errText);
        } else {
          result.singapore.success = true;
        }
      }
    } catch (err) {
      result.singapore.error = err instanceof Error ? err.message : String(err);
      console.error('[SyncUser] Singapore exception:', err);
    }

    // Return partial success if at least one node succeeded
    const anySuccess = result.sydney.success || result.singapore.success;
    const statusCode = anySuccess ? 200 : 502;

    return new Response(JSON.stringify({
      success: anySuccess,
      result,
      timestamp: new Date().toISOString(),
    }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('[SyncUser] Unhandled error:', err);
    return new Response(JSON.stringify({
      error: err instanceof Error ? err.message : String(err)
    }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
