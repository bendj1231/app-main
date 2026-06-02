/// <reference lib="deno.ns" />
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0';

import { getCorsHeaders } from '../_shared/cors.ts';

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2026-04-22.dahlia',
});

/**
 * Enterprise Upgrade — Creates a Stripe Checkout Session for:
 * - Data Controller Tier: $1,000/yr (unlocks full pilot pull, unblurred dashboard, contact)
 * - Enterprise Tier: Custom pricing
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
  const corsHeaders = getCorsHeaders(req);
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const {
      enterpriseAccountId,
      tier = 'data_controller', // 'data_controller' | 'enterprise'
      successUrl,
      cancelUrl,
    } = await req.json();

    if (!enterpriseAccountId) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: enterpriseAccountId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify enterprise exists and get current tier
    const { data: enterprise, error: entError } = await supabaseAdmin
      .from('enterprise_accounts')
      .select('airline_name, billing_email, contact_information, stripe_customer_id, account_tier, profile_id')
      .eq('id', enterpriseAccountId)
      .single();

    if (entError || !enterprise) {
      return new Response(
        JSON.stringify({ error: 'Enterprise account not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prevent duplicate upgrade if already on target tier
    if (enterprise.account_tier === tier) {
      return new Response(
        JSON.stringify({ error: `Already on ${tier} tier` }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Resolve Stripe customer
    let customerId = enterprise.stripe_customer_id;
    const fallbackEmail = enterprise.billing_email
      || (enterprise.contact_information as any)?.email
      || 'billing@pilotrecognition.com';

    if (!customerId) {
      const customer = await stripe.customers.create({
        name: enterprise.airline_name,
        email: fallbackEmail,
        metadata: {
          enterprise_account_id: enterpriseAccountId,
          source: 'pilotrecognition.com enterprise upgrade',
        },
      });
      customerId = customer.id;

      await supabaseAdmin
        .from('enterprise_accounts')
        .update({ stripe_customer_id: customer.id })
        .eq('id', enterpriseAccountId);
    }

    // Resolve the correct Stripe Price ID based on tier
    // In production, store these in environment variables or a config table
    const priceIds: Record<string, string> = {
      data_controller: Deno.env.get('STRIPE_DATA_CONTROLLER_PRICE_ID') || 'price_placeholder_dc',
      enterprise: Deno.env.get('STRIPE_ENTERPRISE_PRICE_ID') || 'price_placeholder_ent',
    };

    const priceId = priceIds[tier];

    if (!priceId || priceId.includes('placeholder')) {
      return new Response(
        JSON.stringify({ error: `Stripe price ID not configured for tier: ${tier}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${Deno.env.get('APP_URL') || 'http://localhost:5173'}/enterprise/upgrade/success?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
      cancel_url: cancelUrl || `${Deno.env.get('APP_URL') || 'http://localhost:5173'}/enterprise/upgrade/cancel`,
      allow_promotion_codes: true,
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
      metadata: {
        enterprise_account_id: enterpriseAccountId,
        tier: tier,
        source: 'enterprise_upgrade',
      },
      subscription_data: {
        metadata: {
          enterprise_account_id: enterpriseAccountId,
          tier: tier,
        },
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        sessionId: session.id,
        url: session.url,
        tier: tier,
        price: tier === 'data_controller' ? '$1,000/year' : 'Custom pricing',
        enterpriseAccountId,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err: any) {
    console.error('Enterprise upgrade error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
