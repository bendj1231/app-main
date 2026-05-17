import Stripe from 'https://esm.sh/stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2026-04-22.dahlia',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const {
      flightSchoolName,
      flightSchoolEmail,
      flightSchoolAddress,
      flightSchoolTaxId,
      billingContactName,
      plan = 'enterprise_monthly', // enterprise_monthly | enterprise_annual
      pilotCount,
      paymentMethod = 'invoice', // 'invoice' | 'checkout' (instant with Apple Pay / Google Pay)
    } = await req.json();

    if (!flightSchoolName || !flightSchoolEmail || !billingContactName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: flightSchoolName, flightSchoolEmail, billingContactName' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Price configuration
    const priceMap: Record<string, { amount: number; description: string; interval: string }> = {
      enterprise_monthly: {
        amount: 1000_00, // $1,000.00 in cents
        description: 'PilotRecognition Enterprise Access — Monthly Subscription\nIncludes: Pull API, unlimited profile pulls, advanced filtering, EBT video access, pathway posting',
        interval: 'month',
      },
      enterprise_annual: {
        amount: 10000_00, // $10,000.00 in cents (2 months free)
        description: 'PilotRecognition Enterprise Access — Annual Subscription\nIncludes: Pull API, unlimited profile pulls, advanced filtering, EBT video access, pathway posting, priority support',
        interval: 'year',
      },
    };

    const priceConfig = priceMap[plan];
    if (!priceConfig) {
      return new Response(
        JSON.stringify({ error: 'Invalid plan. Use enterprise_monthly or enterprise_annual' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Create or retrieve Stripe Customer
    // Search by email first
    const existingCustomers = await stripe.customers.list({
      email: flightSchoolEmail,
      limit: 1,
    });

    let customer = existingCustomers.data[0];

    if (!customer) {
      customer = await stripe.customers.create({
        name: flightSchoolName,
        email: flightSchoolEmail,
        description: `Flight School / ATO — PilotRecognition Enterprise Partner`,
        address: flightSchoolAddress
          ? {
              line1: flightSchoolAddress.line1,
              line2: flightSchoolAddress.line2 || undefined,
              city: flightSchoolAddress.city,
              state: flightSchoolAddress.state,
              postal_code: flightSchoolAddress.postalCode,
              country: flightSchoolAddress.country,
            }
          : undefined,
        metadata: {
          tax_id: flightSchoolTaxId || '',
          billing_contact: billingContactName,
          pilot_count: String(pilotCount || ''),
          source: 'pilotrecognition.com enterprise portal',
        },
      });
    }

    // 2a. INSTANT CHECKOUT flow (Apple Pay / Google Pay)
    if (paymentMethod === 'checkout') {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: customer.id,
        payment_method_types: ['card'],
        automatic_payment_methods: { enabled: true },
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: priceConfig.amount,
              product_data: {
                name: `PilotRecognition Enterprise Access — ${priceConfig.interval === 'month' ? 'Monthly' : 'Annual'}`,
                description: priceConfig.description,
              },
              recurring: { interval: priceConfig.interval as 'month' | 'year' },
            },
            quantity: 1,
          },
        ],
        subscription_data: {
          trial_period_days: priceConfig.interval === 'month' ? 3 : 14,
          metadata: {
            plan,
            flight_school_name: flightSchoolName,
            pilot_count: String(pilotCount || ''),
            tax_id: flightSchoolTaxId || '',
            billing_contact: billingContactName,
            created_by: 'pilotrecognition.com',
            payment_type: 'enterprise_checkout',
          },
        },
        success_url: `${Deno.env.get('VITE_APP_URL') || 'http://localhost:3002'}/enterprise?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${Deno.env.get('VITE_APP_URL') || 'http://localhost:3002'}/enterprise?cancelled=true`,
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        invoice_creation: { enabled: true },
      });

      return new Response(
        JSON.stringify({
          success: true,
          checkoutUrl: session.url,
          sessionId: session.id,
          paymentMethod: 'checkout',
          message: 'Redirect to Stripe Checkout for instant payment. Apple Pay / Google Pay available on supported devices.',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2b. INVOICE flow (Net 14, for accounting departments)
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      collection_method: 'send_invoice',
      days_until_due: 14, // Net 14 terms for flight schools
      auto_advance: true,
      description: `Software subscription for pilot profile access and recruitment tools.\n\nService Provider: PilotRecognition platform services\nPlan: ${plan === 'enterprise_monthly' ? 'Enterprise Monthly ($1,000/month)' : 'Enterprise Annual ($10,000/year — 2 months free)'}\n\nFor support: enterprise@pilotrecognition.com`,
      metadata: {
        plan,
        flight_school_name: flightSchoolName,
        pilot_count: String(pilotCount || ''),
        created_by: 'pilotrecognition.com',
      },
      footer: 'PilotRecognition Enterprise Access — Powered by Stripe\nPayment remittance: Stripe, Inc. | 354 Oyster Point Blvd, South San Francisco, CA 94080, USA\nTax ID: 46-4602340 | stripe.com',
    });

    // 3. Add Invoice Items
    await stripe.invoiceItems.create({
      customer: customer.id,
      invoice: invoice.id,
      amount: priceConfig.amount,
      currency: 'usd',
      description: priceConfig.description,
    });

    // 4. Add success fee line item (explained but $0 until hire)
    await stripe.invoiceItems.create({
      customer: customer.id,
      invoice: invoice.id,
      amount: 0,
      currency: 'usd',
      description: 'Success Fee — $500 per pilot hired via pathway (billed separately upon hire confirmation)',
    });

    // 5. Finalize and send the invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
    const sentInvoice = await stripe.invoices.sendInvoice(finalizedInvoice.id);

    return new Response(
      JSON.stringify({
        success: true,
        invoiceId: sentInvoice.id,
        invoiceNumber: sentInvoice.number,
        invoiceUrl: sentInvoice.hosted_invoice_url,
        pdfUrl: sentInvoice.invoice_pdf,
        amount: `$${(priceConfig.amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        currency: 'USD',
        dueDate: new Date(sentInvoice.due_date * 1000).toISOString(),
        status: sentInvoice.status,
        customerEmail: flightSchoolEmail,
        message: `Invoice ${sentInvoice.number} sent to ${flightSchoolEmail}. Payment due in 14 days.`,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Enterprise invoice creation error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to create enterprise invoice',
        details: error.message,
        type: error.type,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
