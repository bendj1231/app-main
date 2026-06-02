/// <reference lib="deno.ns" />
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2026-04-22.dahlia',
});

import { getCorsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || Deno.env.get('NEXT_PUBLIC_SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
  const corsHeaders = getCorsHeaders(req);
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const { atoInstitutionId } = await req.json();

    if (!atoInstitutionId) {
      return new Response(JSON.stringify({ error: 'Missing atoInstitutionId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch ATO institution
    const { data: ato, error: atoError } = await supabase
      .from('ato_institutions')
      .select('id, stripe_subscription_id, admin_user_id')
      .eq('id', atoInstitutionId)
      .single();

    if (atoError || !ato) {
      return new Response(JSON.stringify({ error: 'ATO institution not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify the caller is the ATO admin
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);

    if (authError || !user || user.id !== ato.admin_user_id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!ato.stripe_subscription_id) {
      return new Response(JSON.stringify({ error: 'No active subscription' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await stripe.subscriptions.update(ato.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    await supabase.from('ato_institutions').update({
      onboarding_status: 'suspended',
    }).eq('id', ato.id);

    return new Response(JSON.stringify({ success: true, message: 'Subscription will cancel at period end.' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('ATO cancel subscription error:', error);
    return new Response(JSON.stringify({ error: 'Failed to cancel subscription', details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
