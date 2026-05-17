import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2026-04-22.dahlia',
});

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
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const { atoInstitutionId, tier, returnUrl } = await req.json();

    if (!atoInstitutionId || !tier) {
      return new Response(JSON.stringify({ error: 'Missing atoInstitutionId or tier' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate tier
    if (!['analytics', 'enterprise'].includes(tier)) {
      return new Response(JSON.stringify({ error: 'Invalid tier. Only analytics or enterprise require payment.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch ATO institution
    const { data: ato, error: atoError } = await supabase
      .from('ato_institutions')
      .select('id, institution_name, contact_email, stripe_customer_id')
      .eq('id', atoInstitutionId)
      .single();

    if (atoError || !ato) {
      return new Response(JSON.stringify({ error: 'ATO institution not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get or create Stripe customer
    let customerId = ato.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: ato.contact_email,
        name: ato.institution_name,
        metadata: {
          ato_institution_id: ato.id,
          type: 'ato',
        },
      });
      customerId = customer.id;

      // Save Stripe customer ID back to database
      await supabase
        .from('ato_institutions')
        .update({ stripe_customer_id: customerId })
        .eq('id', ato.id);
    }

    // All ATOs (flight schools, operators) pay $1,000/year for full access
    const priceLookupKey = 'ato_operator_annual';

    // Search for existing price by lookup key, or create product+price on the fly
    const prices = await stripe.prices.list({
      lookup_keys: [priceLookupKey],
      expand: ['data.product'],
    });

    let priceId: string;
    if (prices.data.length > 0) {
      priceId = prices.data[0].id;
    } else {
      // Create product and price dynamically — $1,000/year for all operator types
      const product = await stripe.products.create({
        name: 'PilotRecognition Operator Access — Flight Schools & ATOs',
        metadata: {
          ato_tier: tier,
          type: 'ato_subscription',
        },
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: 100000, // $1,000/year
        currency: 'usd',
        recurring: { interval: 'year' },
        lookup_key: priceLookupKey,
      });

      priceId = price.id;
    }

    const appUrl = Deno.env.get('VITE_APP_URL') || 'http://localhost:3002';

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
      success_url: `${returnUrl || appUrl + '/ato-dashboard'}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl || appUrl + '/ato-dashboard'}?cancelled=true`,
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          ato_institution_id: ato.id,
          ato_tier: tier,
          type: 'ato_subscription',
        },
      },
      metadata: {
        ato_institution_id: ato.id,
        ato_tier: tier,
        type: 'ato_subscription',
      },
    });

    return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('ATO checkout session creation error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create checkout session', details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
