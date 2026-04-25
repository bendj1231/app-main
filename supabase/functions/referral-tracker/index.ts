// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req: Request) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  }

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

      // Find flight school by referral code
      const { data: flightSchool, error: schoolError } = await supabase
        .from('flight_schools')
        .select('*')
        .eq('referral_code', formData.referral_code)
        .single()

      if (schoolError || !flightSchool) {
        return new Response(JSON.stringify({ error: 'Invalid referral code' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Handle different actions
      if (formData.action === 'click') {
        // Track referral click - create referral record if it doesn't exist
        const { data: existingReferral } = await supabase
          .from('referrals')
          .select('*')
          .eq('flight_school_id', flightSchool.id)
          .eq('pilot_email', formData.pilot_email || '')
          .single()

        if (existingReferral) {
          // Update clicked timestamp
          const { error: updateError } = await supabase
            .from('referrals')
            .update({
              status: 'clicked',
              clicked_at: new Date().toISOString(),
              metadata: { ...existingReferral.metadata, user_agent: formData.user_agent, ip_address: formData.ip_address }
            })
            .eq('id', existingReferral.id)

          if (updateError) {
            return new Response(JSON.stringify({ error: 'Failed to update referral' }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }
        } else if (formData.pilot_email) {
          // Create new referral record
          const baseUrl = 'https://pilotrecognition.com'
          const referralLink = `${baseUrl}/ref/${flightSchool.referral_code}`

          const { error: createError } = await supabase
            .from('referrals')
            .insert({
              flight_school_id: flightSchool.id,
              pilot_email: formData.pilot_email,
              pilot_name: formData.pilot_name || null,
              referral_code: flightSchool.referral_code,
              referral_link: referralLink,
              status: 'clicked',
              clicked_at: new Date().toISOString(),
              commission_amount: flightSchool.commission_rate,
              metadata: { user_agent: formData.user_agent, ip_address: formData.ip_address }
            })

          if (createError) {
            return new Response(JSON.stringify({ error: 'Failed to create referral' }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // Update flight school referral count
          await supabase
            .from('flight_schools')
            .update({ total_referrals: flightSchool.total_referrals + 1 })
            .eq('id', flightSchool.id)
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Referral click tracked',
            flight_school: {
              id: flightSchool.id,
              name: flightSchool.name
            }
          }),
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
              'Connection': 'keep-alive'
            }
          }
        )
      }

      if (formData.action === 'sign_up') {
        // Track pilot sign-up
        if (!formData.pilot_email || !formData.pilot_id) {
          return new Response(JSON.stringify({ error: 'pilot_email and pilot_id are required for sign_up' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        // Find or create referral record
        const { data: existingReferral } = await supabase
          .from('referrals')
          .select('*')
          .eq('flight_school_id', flightSchool.id)
          .eq('pilot_email', formData.pilot_email)
          .single()

        if (existingReferral) {
          // Update sign-up details
          const { error: updateError } = await supabase
            .from('referrals')
            .update({
              pilot_id: formData.pilot_id,
              status: 'signed_up',
              signed_up_at: new Date().toISOString()
            })
            .eq('id', existingReferral.id)

          if (updateError) {
            return new Response(JSON.stringify({ error: 'Failed to update referral' }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }
        } else {
          // Create new referral with sign-up
          const baseUrl = 'https://pilotrecognition.com'
          const referralLink = `${baseUrl}/ref/${flightSchool.referral_code}`

          const { error: createError } = await supabase
            .from('referrals')
            .insert({
              flight_school_id: flightSchool.id,
              pilot_id: formData.pilot_id,
              pilot_email: formData.pilot_email,
              pilot_name: formData.pilot_name || null,
              referral_code: flightSchool.referral_code,
              referral_link: referralLink,
              status: 'signed_up',
              clicked_at: new Date().toISOString(),
              signed_up_at: new Date().toISOString(),
              commission_amount: flightSchool.commission_rate
            })

          if (createError) {
            return new Response(JSON.stringify({ error: 'Failed to create referral' }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // Update flight school referral count
          await supabase
            .from('flight_schools')
            .update({ total_referrals: flightSchool.total_referrals + 1 })
            .eq('id', flightSchool.id)
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Referral sign-up tracked',
            flight_school: {
              id: flightSchool.id,
              name: flightSchool.name
            }
          }),
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
              'Connection': 'keep-alive'
            }
          }
        )
      }

      if (formData.action === 'complete') {
        // Mark referral as completed (pilot completed program)
        if (!formData.pilot_id) {
          return new Response(JSON.stringify({ error: 'pilot_id is required for complete' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        // Find referral record
        const { data: existingReferral, error: findError } = await supabase
          .from('referrals')
          .select('*')
          .eq('flight_school_id', flightSchool.id)
          .eq('pilot_id', formData.pilot_id)
          .single()

        if (findError || !existingReferral) {
          return new Response(JSON.stringify({ error: 'Referral not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        // Update referral as completed and eligible for commission
        const { error: updateError } = await supabase
          .from('referrals')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            commission_status: 'eligible'
          })
          .eq('id', existingReferral.id)

        if (updateError) {
          return new Response(JSON.stringify({ error: 'Failed to update referral' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        // Update flight school pending payouts
        await supabase
          .from('flight_schools')
          .update({ 
            pending_payouts: flightSchool.pending_payouts + existingReferral.commission_amount 
          })
          .eq('id', flightSchool.id)

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Referral completed - commission eligible',
            commission_amount: existingReferral.commission_amount
          }),
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
              'Connection': 'keep-alive'
            }
          }
        )
      }

      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (req.method === 'GET') {
      // Get referral info by code
      const url = new URL(req.url)
      const referralCode = url.searchParams.get('code')

      if (!referralCode) {
        return new Response(JSON.stringify({ error: 'code parameter is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Find flight school by referral code
      const { data: flightSchool, error: schoolError } = await supabase
        .from('flight_schools')
        .select('id, name, logo_url, description, commission_rate')
        .eq('referral_code', referralCode)
        .eq('is_active', true)
        .single()

      if (schoolError || !flightSchool) {
        return new Response(JSON.stringify({ error: 'Invalid or inactive referral code' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      return new Response(
        JSON.stringify({
          success: true,
          flight_school: flightSchool
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Connection': 'keep-alive'
          }
        }
      )
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
