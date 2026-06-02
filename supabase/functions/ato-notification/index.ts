/// <reference lib="deno.ns" />
import { Resend } from 'https://esm.sh/resend@3.2.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

import { getCorsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || Deno.env.get('NEXT_PUBLIC_SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const resendApiKey = Deno.env.get('RESEND_API_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const resend = new Resend(resendApiKey);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
  const corsHeaders = getCorsHeaders(req);
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const { atoId, pilotName, claimedHours, requestId } = await req.json();

    if (!atoId || !requestId) {
      return new Response(JSON.stringify({ error: 'Missing atoId or requestId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch ATO admin details
    const { data: ato, error: atoError } = await supabase
      .from('ato_institutions')
      .select('admin_user_id, institution_name, contact_email')
      .eq('id', atoId)
      .single();

    if (atoError || !ato) {
      return new Response(JSON.stringify({ error: 'ATO not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch admin user email
    const { data: adminUser, error: userError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', ato.admin_user_id)
      .single();

    const recipientEmail = ato.contact_email || adminUser?.email;
    if (!recipientEmail) {
      return new Response(JSON.stringify({ error: 'No contact email for ATO admin' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const appUrl = Deno.env.get('VITE_APP_URL') || 'https://pilotrecognition.com';

    await resend.emails.send({
      from: 'PilotRecognition <notifications@pilotrecognition.com>',
      to: recipientEmail,
      subject: `New Hour Verification Request — ${pilotName || 'A pilot'}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem; color: #1e293b;">
          <h2 style="color: #0f172a; margin-bottom: 1rem;">New Verification Request</h2>
          <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
            A pilot has submitted a request for hour verification through your institution <strong>${ato.institution_name}</strong>.
          </p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem;">
            <p style="margin: 0 0 0.5rem; font-size: 0.9rem; color: #64748b;"><strong>Pilot:</strong> ${pilotName || 'Unknown'}</p>
            <p style="margin: 0 0 0.5rem; font-size: 0.9rem; color: #64748b;"><strong>Claimed Hours:</strong> ${claimedHours || 'N/A'}</p>
            <p style="margin: 0; font-size: 0.9rem; color: #64748b;"><strong>Request ID:</strong> ${requestId}</p>
          </div>
          <a href="${appUrl}/ato-dashboard" style="display: inline-block; padding: 0.75rem 1.5rem; background: #0ea5e9; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Review Request →
          </a>
          <p style="color: #94a3b8; font-size: 0.8rem; margin-top: 1.5rem;">
            You are receiving this because you are registered as an admin for ${ato.institution_name} on PilotRecognition.
          </p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('ATO notification error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send notification', details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
