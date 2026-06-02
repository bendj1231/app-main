/// <reference lib="deno.ns" />
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req: Request) => {
  // CORS headers
import { getCorsHeaders } from '../_shared/cors.ts';
  const corsHeaders = getCorsHeaders(req);

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (req.method === 'POST') {
      // Track referral click or sign-up
      const formData = await req.json()

      // Input validation
      if (!formData.referral_code) {
        return new Response(JSON.stringify({ error: 'referral_code is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      if (!formData.action) {
        return new Response(JSON.stringify({ error: 'action is required (click, sign_up, complete)' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Resolve partner from universal referral_partners table
      const { data: partner, error: partnerError } = await supabase
        .from('referral_partners')
        .select('*')
        .eq('referral_code', formData.referral_code)
        .eq('is_active', true)
        .single()

      if (partnerError || !partner) {
        return new Response(JSON.stringify({ error: 'Invalid referral code' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const now = new Date().toISOString()

      if (formData.action === 'click') {
        const { data: existing } = await supabase
          .from('referral_conversions')
          .select('id, metadata')
          .eq('partner_id', partner.id)
          .eq('pilot_email', formData.pilot_email || '')
          .single()

        if (existing) {
          await supabase
            .from('referral_conversions')
            .update({ status: 'clicked', clicked_at: now, metadata: { ...existing.metadata, user_agent: formData.user_agent, ip_address: formData.ip_address } })
            .eq('id', existing.id)
        } else if (formData.pilot_email) {
          await supabase.from('referral_conversions').insert({
            partner_id: partner.id,
            referral_code: partner.referral_code,
            pilot_email: formData.pilot_email,
            pilot_name: formData.pilot_name || null,
            status: 'clicked',
            clicked_at: now,
            commission_amount: partner.commission_rate,
            metadata: { user_agent: formData.user_agent, ip_address: formData.ip_address }
          })
          await supabase.from('referral_partners').update({ total_referrals: partner.total_referrals + 1 }).eq('id', partner.id)
        }

        return new Response(JSON.stringify({ success: true, message: 'Click tracked', partner: { id: partner.id, name: partner.name, type: partner.partner_type } }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }

      if (formData.action === 'sign_up') {
        if (!formData.pilot_email || !formData.pilot_id) {
          return new Response(JSON.stringify({ error: 'pilot_email and pilot_id required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        const { data: existing } = await supabase
          .from('referral_conversions')
          .select('id')
          .eq('partner_id', partner.id)
          .eq('pilot_email', formData.pilot_email)
          .single()

        if (existing) {
          await supabase.from('referral_conversions').update({ pilot_id: formData.pilot_id, status: 'signed_up', signed_up_at: now }).eq('id', existing.id)
        } else {
          await supabase.from('referral_conversions').insert({
            partner_id: partner.id,
            referral_code: partner.referral_code,
            pilot_id: formData.pilot_id,
            pilot_email: formData.pilot_email,
            pilot_name: formData.pilot_name || null,
            status: 'signed_up',
            clicked_at: now,
            signed_up_at: now,
            commission_amount: partner.commission_rate
          })
          await supabase.from('referral_partners').update({ total_referrals: partner.total_referrals + 1 }).eq('id', partner.id)
        }

        return new Response(JSON.stringify({ success: true, message: 'Sign-up tracked', partner: { id: partner.id, name: partner.name, type: partner.partner_type } }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }

      if (formData.action === 'subscribed') {
        // Fired when pilot pays — commission becomes eligible
        if (!formData.pilot_id) {
          return new Response(JSON.stringify({ error: 'pilot_id required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        const { data: existing } = await supabase
          .from('referral_conversions')
          .select('id, commission_amount')
          .eq('partner_id', partner.id)
          .eq('pilot_id', formData.pilot_id)
          .single()

        if (!existing) {
          return new Response(JSON.stringify({ error: 'Referral not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        await supabase.from('referral_conversions').update({ status: 'subscribed', subscribed_at: now, commission_status: 'eligible' }).eq('id', existing.id)
        await supabase.from('referral_partners').update({
          total_conversions: partner.total_conversions + 1,
          pending_payouts: partner.pending_payouts + existing.commission_amount
        }).eq('id', partner.id)

        return new Response(JSON.stringify({ success: true, message: 'Subscription tracked — commission eligible', commission_amount: existing.commission_amount }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }

      return new Response(JSON.stringify({ error: 'Invalid action. Use: click, sign_up, subscribed' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (req.method === 'GET') {
      const url = new URL(req.url)
      const referralCode = url.searchParams.get('code')

      if (!referralCode) {
        return new Response(JSON.stringify({ error: 'code parameter is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }

      const { data: partner, error: partnerError } = await supabase
        .from('referral_partners')
        .select('id, name, partner_type, logo_url, description, commission_rate, country')
        .eq('referral_code', referralCode)
        .eq('is_active', true)
        .single()

      if (partnerError || !partner) {
        return new Response(JSON.stringify({ error: 'Invalid or inactive referral code' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }

      return new Response(JSON.stringify({ success: true, partner }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
