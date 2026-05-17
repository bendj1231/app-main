import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') || Deno.env.get('NEXT_PUBLIC_SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST' && req.method !== 'GET') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    let tokenId: string;
    if (req.method === 'POST') {
      const body = await req.json();
      tokenId = body.tokenId;
    } else {
      const url = new URL(req.url);
      tokenId = url.searchParams.get('tokenId') || '';
    }

    if (!tokenId) {
      return new Response(JSON.stringify({ error: 'Missing tokenId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch token with ATO and pilot profile details
    const { data: token, error } = await supabase
      .from('ato_issued_tokens')
      .select('*, ato:ato_id(id, institution_name, country, verified_issuer), pilot:pilot_id(id, display_name, full_name, total_flight_hours)')
      .eq('id', tokenId)
      .single();

    if (error || !token) {
      return new Response(JSON.stringify({ error: 'Token not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify signature integrity (recompute hash)
    let integrityValid = false;
    if (token.signature_hash && token.signature_algorithm === 'SHA-256') {
      const payload = JSON.stringify({
        ato_id: token.ato_id,
        pilot_id: token.pilot_id,
        token_type: token.token_type,
        token_label: token.token_label,
        total_hours_verified: token.total_hours_verified,
        graduation_date: token.graduation_date,
        aircraft_ratings: token.aircraft_ratings,
        issued_at: token.created_at,
      });
      const encoder = new TextEncoder();
      const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(payload));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const recomputedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      integrityValid = recomputedHash === token.signature_hash;
    }

    return new Response(JSON.stringify({
      disclaimer: 'Training hours are attested by the ATO. PilotRecognition independently verifies regulatory credentials, medical certificates, and background checks through international partners. The attesting institution bears responsibility for hour accuracy.',
      valid: token.status === 'active',
      status: token.status,
      integrity: integrityValid,
      revoked_at: token.revoked_at,
      revoked_reason: token.revoked_reason,
      token: {
        id: token.id,
        type: token.token_type,
        label: token.token_label,
        total_hours_verified: token.total_hours_verified,
        graduation_date: token.graduation_date,
        aircraft_ratings: token.aircraft_ratings,
        issued_at: token.created_at,
      },
      ato: token.ato ? {
        id: token.ato.id,
        name: token.ato.institution_name,
        country: token.ato.country,
        verified_issuer: token.ato.verified_issuer,
      } : null,
      pilot: token.pilot ? {
        id: token.pilot.id,
        name: token.pilot.display_name || token.pilot.full_name || 'Unknown',
        total_flight_hours: token.pilot.total_flight_hours,
      } : null,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Token verification error:', error);
    return new Response(JSON.stringify({ error: 'Verification failed', details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
