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
 * Generates a human-readable pilot reference code.
 * Format: PILOT-{COUNTRY_CODE}-{RANDOM}  e.g., PILOT-PH-8932
 */
function generatePilotReferenceCode(countryCode: string): string {
  const random = Math.floor(1000 + Math.random() * 9000);
  const cc = (countryCode || 'XX').toUpperCase().slice(0, 2);
  return `PILOT-${cc}-${random}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
  const corsHeaders = getCorsHeaders(req);
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const {
      action,
      // For 'record_pilot_consent' or 'record_airline_consent'
      matchAgreementId,
      // For 'create_invoice' (auto or manual)
      enterpriseAccountId,
      pilotId,
      pathwayCardInterestId,
      pilotName,
      pilotLicenseCountry,
      pilotLicenseType,
      airlineName,
      airlineBillingEmail,
      feeAmount = 500.00,
      currency = 'USD',
    } = await req.json();

    // ────────────────────────────────────────────────────────────────────────
    // ACTION 1: Record pilot consent — initiates the handshake
    // ────────────────────────────────────────────────────────────────────────
    if (action === 'record_pilot_consent') {
      if (!pilotId || !enterpriseAccountId || !pathwayCardInterestId) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: pilotId, enterpriseAccountId, pathwayCardInterestId' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Lookup pilot profile for snapshot data
      const { data: pilotProfile } = await supabaseAdmin
        .from('profiles')
        .select('full_name, display_name, country, country_of_license, license_id, license_type')
        .eq('id', pilotId)
        .maybeSingle();

      const { data: enterprise } = await supabaseAdmin
        .from('enterprise_accounts')
        .select('airline_name, billing_email, contact_information, account_tier, can_pull_verified_profiles')
        .eq('id', enterpriseAccountId)
        .maybeSingle();

      const refCode = generatePilotReferenceCode(pilotProfile?.country || pilotProfile?.country_of_license || 'XX');

      const { data: agreement, error: insertError } = await supabaseAdmin
        .from('match_agreements')
        .insert({
          pilot_id: pilotId,
          pilot_reference_code: refCode,
          pilot_name_at_time: pilotProfile?.full_name || pilotProfile?.display_name || 'Unknown Pilot',
          pilot_consent_at: new Date().toISOString(),
          enterprise_account_id: enterpriseAccountId,
          airline_name_at_time: enterprise?.airline_name || airlineName || 'Unknown Airline',
          pathway_card_interest_id: pathwayCardInterestId,
          status: 'pending_airline_consent',
          expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (insertError || !agreement) {
        return new Response(
          JSON.stringify({ error: 'Failed to create match agreement', details: insertError?.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update the original interest to link to this agreement
      await supabaseAdmin
        .from('pathway_card_interests')
        .update({ status: 'pending_airline_consent', notes: `Agreement ${agreement.id} initiated` })
        .eq('id', pathwayCardInterestId);

      return new Response(
        JSON.stringify({
          success: true,
          agreementId: agreement.id,
          pilotReferenceCode: refCode,
          status: 'pending_airline_consent',
          message: 'Pilot consent recorded. Waiting for airline to confirm.',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ────────────────────────────────────────────────────────────────────────
    // ACTION 2: Record airline consent — completes the FREE platform handshake
    // NO fee charged here. Platform-mediated connection is FREE.
    // ────────────────────────────────────────────────────────────────────────
    if (action === 'record_airline_consent') {
      if (!matchAgreementId) {
        return new Response(
          JSON.stringify({ error: 'Missing required field: matchAgreementId' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Fetch the agreement with enterprise tier check
      const { data: agreement, error: fetchError } = await supabaseAdmin
        .from('match_agreements')
        .select('*, enterprise_accounts!inner(account_tier, can_pull_verified_profiles)')
        .eq('id', matchAgreementId)
        .single();

      if (fetchError || !agreement) {
        return new Response(
          JSON.stringify({ error: 'Match agreement not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Tier enforcement: free-tier airlines cannot approve connections
      const enterpriseTier = agreement.enterprise_accounts?.account_tier || 'free';
      if (enterpriseTier === 'free') {
        return new Response(
          JSON.stringify({
            error: 'Free tier restriction: Upgrade to Data Controller tier ($1,000/yr) to approve pilot connections and view verified profiles.',
            upgradeRequired: true,
            tier: 'free',
          }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (agreement.status !== 'pending_airline_consent') {
        return new Response(
          JSON.stringify({ error: `Agreement status is ${agreement.status}, cannot record airline consent` }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (new Date(agreement.expires_at) < new Date()) {
        await supabaseAdmin
          .from('match_agreements')
          .update({ status: 'expired' })
          .eq('id', matchAgreementId);
        return new Response(
          JSON.stringify({ error: 'Agreement has expired' }),
          { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update agreement to both_agreed — FREE platform connection
      const { data: updatedAgreement, error: updateError } = await supabaseAdmin
        .from('match_agreements')
        .update({
          status: 'both_agreed',
          airline_consent_at: new Date().toISOString(),
        })
        .eq('id', matchAgreementId)
        .select()
        .single();

      if (updateError || !updatedAgreement) {
        return new Response(
          JSON.stringify({ error: 'Failed to update match agreement' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          agreementId: updatedAgreement.id,
          pilotReferenceCode: updatedAgreement.pilot_reference_code,
          status: 'both_agreed',
          message: 'Both parties agreed. Platform-mediated connection established. FREE.',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ────────────────────────────────────────────────────────────────────────
    // ACTION 3: Request discharge from platform — one party wants direct contact
    // ────────────────────────────────────────────────────────────────────────
    if (action === 'request_discharge') {
      if (!matchAgreementId || !pilotId) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: matchAgreementId, pilotId (requester)' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: agreement, error: fetchError } = await supabaseAdmin
        .from('match_agreements')
        .select('*')
        .eq('id', matchAgreementId)
        .single();

      if (fetchError || !agreement) {
        return new Response(
          JSON.stringify({ error: 'Match agreement not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (agreement.status !== 'both_agreed') {
        return new Response(
          JSON.stringify({ error: `Agreement status is ${agreement.status}. Must be both_agreed before requesting discharge.` }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      await supabaseAdmin
        .from('match_agreements')
        .update({
          status: 'discharge_requested',
          discharge_requested_by: pilotId,
          discharge_requested_at: new Date().toISOString(),
        })
        .eq('id', matchAgreementId);

      return new Response(
        JSON.stringify({
          success: true,
          agreementId: matchAgreementId,
          status: 'discharge_requested',
          message: 'Discharge from platform requested. Waiting for other party to approve.',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ────────────────────────────────────────────────────────────────────────
    // ACTION 4: Approve discharge — both parties want off-platform contact
    // THIS is where the $500 Recognition Fee is triggered.
    // ────────────────────────────────────────────────────────────────────────
    if (action === 'approve_discharge') {
      if (!matchAgreementId || !pilotId) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: matchAgreementId, pilotId (approver)' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: agreement, error: fetchError } = await supabaseAdmin
        .from('match_agreements')
        .select('*')
        .eq('id', matchAgreementId)
        .single();

      if (fetchError || !agreement) {
        return new Response(
          JSON.stringify({ error: 'Match agreement not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (agreement.status !== 'discharge_requested') {
        return new Response(
          JSON.stringify({ error: `Agreement status is ${agreement.status}. Must be discharge_requested before approving.` }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Prevent self-approval
      if (agreement.discharge_requested_by === pilotId) {
        return new Response(
          JSON.stringify({ error: 'Cannot approve your own discharge request.' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Mark discharge approved
      const { data: updatedAgreement, error: updateError } = await supabaseAdmin
        .from('match_agreements')
        .update({
          status: 'discharge_approved',
          discharge_approved_by: pilotId,
          discharge_approved_at: new Date().toISOString(),
        })
        .eq('id', matchAgreementId)
        .select()
        .single();

      if (updateError || !updatedAgreement) {
        return new Response(
          JSON.stringify({ error: 'Failed to update match agreement' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // NOW create the recognition fee invoice — discharge is the chargeable event
      const invoiceNumber = `PR-REC-${Date.now()}`;

      const { data: invoice, error: invoiceError } = await supabaseAdmin
        .from('recognition_fee_invoices')
        .insert({
          invoice_number: invoiceNumber,
          match_agreement_id: updatedAgreement.id,
          pilot_reference_code: updatedAgreement.pilot_reference_code,
          pilot_name_at_time: updatedAgreement.pilot_name_at_time,
          pilot_license_country: pilotLicenseCountry || updatedAgreement.metadata?.pilot_license_country,
          pilot_license_type: pilotLicenseType || updatedAgreement.metadata?.pilot_license_type,
          airline_name: updatedAgreement.airline_name_at_time,
          airline_billing_email: airlineBillingEmail || enterpriseAccountId,
          enterprise_account_id: updatedAgreement.enterprise_account_id,
          fee_amount: feeAmount,
          currency: currency,
          description: `Platform Discharge Recognition Fee — Pilot ${updatedAgreement.pilot_reference_code} direct contact unlocked`,
          status: 'pending',
          service_description: `Service: Platform Discharge & Recognition Fee. Date: ${new Date().toISOString().split('T')[0]}. Candidate Reference Code: ${updatedAgreement.pilot_reference_code}. Status: Completed (Both parties consented to discharge from platform).`,
        })
        .select()
        .single();

      if (invoiceError || !invoice) {
        return new Response(
          JSON.stringify({ error: 'Failed to create recognition fee invoice record', details: invoiceError?.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update agreement status
      await supabaseAdmin
        .from('match_agreements')
        .update({ status: 'fee_invoiced' })
        .eq('id', matchAgreementId);

      return new Response(
        JSON.stringify({
          success: true,
          agreementId: updatedAgreement.id,
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoice_number,
          pilotReferenceCode: updatedAgreement.pilot_reference_code,
          status: 'fee_invoiced',
          message: 'Discharge approved. Recognition Fee invoice created. Direct contact will unlock upon payment.',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ────────────────────────────────────────────────────────────────────────
    // ACTION 5: Finalize and send Stripe invoice to airline
    // ────────────────────────────────────────────────────────────────────────
    if (action === 'finalize_stripe_invoice') {
      if (!matchAgreementId) {
        return new Response(
          JSON.stringify({ error: 'Missing required field: matchAgreementId' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Fetch invoice record
      const { data: invoiceRecord, error: invFetchError } = await supabaseAdmin
        .from('recognition_fee_invoices')
        .select('*')
        .eq('match_agreement_id', matchAgreementId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (invFetchError || !invoiceRecord) {
        return new Response(
          JSON.stringify({ error: 'No pending recognition fee invoice found for this agreement' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Find or create Stripe customer for the airline
      const { data: enterprise } = await supabaseAdmin
        .from('enterprise_accounts')
        .select('airline_name, billing_email, contact_information, stripe_customer_id')
        .eq('id', invoiceRecord.enterprise_account_id)
        .maybeSingle();

      const fallbackEmail = enterprise?.billing_email
        || enterprise?.contact_information?.email
        || 'billing@placeholder.com';

      let stripeCustomerId = enterprise?.stripe_customer_id;

      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          name: enterprise?.airline_name || invoiceRecord.airline_name,
          email: invoiceRecord.airline_billing_email || fallbackEmail,
          metadata: {
            enterprise_account_id: invoiceRecord.enterprise_account_id || '',
            source: 'pilotrecognition.com recognition fee',
          },
        });
        stripeCustomerId = customer.id;

        // Save stripe_customer_id back to enterprise_accounts
        await supabaseAdmin
          .from('enterprise_accounts')
          .update({ stripe_customer_id: customer.id })
          .eq('id', invoiceRecord.enterprise_account_id);
      }

      // Create Stripe invoice
      const stripeInvoice = await stripe.invoices.create({
        customer: stripeCustomerId,
        collection_method: 'send_invoice',
        days_until_due: 14,
        auto_advance: true,
        description: invoiceRecord.service_description,
        metadata: {
          pilotrecognition_invoice_id: invoiceRecord.id,
          match_agreement_id: matchAgreementId,
          pilot_reference_code: invoiceRecord.pilot_reference_code,
        },
      });

      // Add line item
      await stripe.invoiceItems.create({
        customer: stripeCustomerId,
        invoice: stripeInvoice.id,
        amount: Math.round(invoiceRecord.fee_amount * 100), // cents
        currency: invoiceRecord.currency.toLowerCase(),
        description: `Recognition Fee — Pilot ${invoiceRecord.pilot_reference_code}`,
      });

      // Finalize and send
      const finalizedInvoice = await stripe.invoices.finalizeInvoice(stripeInvoice.id);
      const sentInvoice = await stripe.invoices.sendInvoice(finalizedInvoice.id);

      // Update our record
      await supabaseAdmin
        .from('recognition_fee_invoices')
        .update({
          status: 'sent',
          stripe_invoice_id: sentInvoice.id,
          stripe_customer_id: stripeCustomerId,
          sent_at: new Date().toISOString(),
          due_date: new Date(sentInvoice.due_date * 1000).toISOString(),
        })
        .eq('id', invoiceRecord.id);

      // Update agreement
      await supabaseAdmin
        .from('match_agreements')
        .update({ status: 'fee_invoiced' })
        .eq('id', matchAgreementId);

      return new Response(
        JSON.stringify({
          success: true,
          invoiceId: invoiceRecord.id,
          invoiceNumber: invoiceRecord.invoice_number,
          stripeInvoiceId: sentInvoice.id,
          stripeInvoiceUrl: sentInvoice.hosted_invoice_url,
          amount: `$${invoiceRecord.fee_amount.toFixed(2)}`,
          currency: invoiceRecord.currency,
          dueDate: new Date(sentInvoice.due_date * 1000).toISOString(),
          message: `Invoice ${invoiceRecord.invoice_number} sent to ${invoiceRecord.airline_name}.`,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ────────────────────────────────────────────────────────────────────────
    // ACTION 6: Stripe webhook handler — mark invoice as paid, unlock contact
    // ────────────────────────────────────────────────────────────────────────
    if (action === 'mark_paid') {
      if (!matchAgreementId) {
        return new Response(
          JSON.stringify({ error: 'Missing required field: matchAgreementId' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      await supabaseAdmin
        .from('recognition_fee_invoices')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
        })
        .eq('match_agreement_id', matchAgreementId);

      // Unlock direct contact details on the agreement
      await supabaseAdmin
        .from('match_agreements')
        .update({
          status: 'fee_paid',
          direct_contact_unlocked_at: new Date().toISOString(),
          pilot_email_revealed: true,
          pilot_phone_revealed: true,
        })
        .eq('id', matchAgreementId);

      return new Response(
        JSON.stringify({ success: true, message: 'Invoice marked as paid. Direct contact details unlocked.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Use record_pilot_consent, record_airline_consent, request_discharge, approve_discharge, finalize_stripe_invoice, or mark_paid' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err: any) {
    console.error('Recognition fee invoice error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
