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
    const { data: { user }, error: authError } = await createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!)
      .auth.getUser(req.headers.get('Authorization')?.replace('Bearer ', '') || '')

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (req.method === 'POST') {
      const formData = await req.json()

      // Input validation
      if (!formData.flight_school_id) {
        return new Response(JSON.stringify({ error: 'flight_school_id is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Check authorization
      const { data: isAdmin } = await supabase
        .from('flight_school_admins')
        .select('*')
        .eq('flight_school_id', formData.flight_school_id)
        .eq('user_id', user.id)
        .single()

      const { data: enterpriseAccount } = await supabase
        .from('enterprise_accounts')
        .select('*')
        .eq('profile_id', user.id)
        .eq('is_super_admin', true)
        .single()

      if (!isAdmin && !enterpriseAccount) {
        return new Response(JSON.stringify({ error: 'Forbidden: Not authorized for this flight school' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Get flight school details
      const { data: flightSchool, error: schoolError } = await supabase
        .from('flight_schools')
        .select('*')
        .eq('id', formData.flight_school_id)
        .single()

      if (schoolError || !flightSchool) {
        return new Response(JSON.stringify({ error: 'Flight school not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Handle different commission actions
      if (formData.action === 'calculate') {
        // Calculate commissions for eligible referrals
        const { data: eligibleReferrals } = await supabase
          .from('referrals')
          .select('*')
          .eq('flight_school_id', formData.flight_school_id)
          .eq('commission_status', 'eligible')

        if (!eligibleReferrals || eligibleReferrals.length === 0) {
          return new Response(
            JSON.stringify({
              success: true,
              message: 'No eligible referrals found',
              total_commission: 0,
              referral_count: 0
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

        const totalCommission = eligibleReferrals.reduce((sum, r) => sum + parseFloat(r.commission_amount), 0)

        return new Response(
          JSON.stringify({
            success: true,
            total_commission: totalCommission,
            referral_count: eligibleReferrals.length,
            commission_per_referral: flightSchool.commission_rate,
            referrals: eligibleReferrals.map(r => ({
              id: r.id,
              pilot_email: r.pilot_email,
              pilot_name: r.pilot_name,
              commission_amount: r.commission_amount,
              completed_at: r.completed_at
            }))
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

      if (formData.action === 'mark_paid') {
        // Mark specific referrals as paid
        if (!formData.referral_ids || !Array.isArray(formData.referral_ids)) {
          return new Response(JSON.stringify({ error: 'referral_ids array is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        if (!formData.payout_id) {
          return new Response(JSON.stringify({ error: 'payout_id is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        // Update referrals
        const { error: updateError } = await supabase
          .from('referrals')
          .update({
            commission_status: 'paid',
            payout_id: formData.payout_id,
            paid_at: new Date().toISOString()
          })
          .in('id', formData.referral_ids)

        if (updateError) {
          return new Response(JSON.stringify({ error: 'Failed to mark referrals as paid' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        // Update flight school totals
        const { data: updatedReferrals } = await supabase
          .from('referrals')
          .select('commission_amount')
          .in('id', formData.referral_ids)

        const paidAmount = updatedReferrals?.reduce((sum, r) => sum + parseFloat(r.commission_amount), 0) || 0

        await supabase
          .from('flight_schools')
          .update({
            total_payouts: flightSchool.total_payouts + paidAmount,
            pending_payouts: flightSchool.pending_payouts - paidAmount
          })
          .eq('id', formData.flight_school_id)

        return new Response(
          JSON.stringify({
            success: true,
            message: `${formData.referral_ids.length} referrals marked as paid`,
            paid_amount: paidAmount
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

      if (formData.action === 'update_rate') {
        // Update commission rate for flight school
        if (!formData.commission_rate || formData.commission_rate <= 0) {
          return new Response(JSON.stringify({ error: 'Valid commission_rate is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        const { error: updateError } = await supabase
          .from('flight_schools')
          .update({ commission_rate: formData.commission_rate })
          .eq('id', formData.flight_school_id)

        if (updateError) {
          return new Response(JSON.stringify({ error: 'Failed to update commission rate' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Commission rate updated successfully',
            new_rate: formData.commission_rate
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
      const url = new URL(req.url)
      const flightSchoolId = url.searchParams.get('flight_school_id')
      const commissionStatus = url.searchParams.get('commission_status')

      if (!flightSchoolId) {
        return new Response(JSON.stringify({ error: 'flight_school_id is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Check authorization
      const { data: isAdmin } = await supabase
        .from('flight_school_admins')
        .select('*')
        .eq('flight_school_id', flightSchoolId)
        .eq('user_id', user.id)
        .single()

      const { data: enterpriseAccount } = await supabase
        .from('enterprise_accounts')
        .select('*')
        .eq('profile_id', user.id)
        .eq('is_super_admin', true)
        .single()

      if (!isAdmin && !enterpriseAccount) {
        return new Response(JSON.stringify({ error: 'Forbidden: Not authorized for this flight school' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Build query
      let query = supabase
        .from('referrals')
        .select('*')
        .eq('flight_school_id', flightSchoolId)
        .order('created_at', { ascending: false })

      if (commissionStatus) {
        query = query.eq('commission_status', commissionStatus)
      }

      const { data: referrals, error: referralsError } = await query

      if (referralsError) {
        return new Response(JSON.stringify({ error: 'Failed to fetch referrals' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Calculate commission summary
      const totalEligible = referrals?.filter(r => r.commission_status === 'eligible').reduce((sum, r) => sum + parseFloat(r.commission_amount), 0) || 0
      const totalPaid = referrals?.filter(r => r.commission_status === 'paid').reduce((sum, r) => sum + parseFloat(r.commission_amount), 0) || 0
      const totalProcessing = referrals?.filter(r => r.commission_status === 'processing').reduce((sum, r) => sum + parseFloat(r.commission_amount), 0) || 0

      return new Response(
        JSON.stringify({
          success: true,
          referrals: referrals,
          summary: {
            total_eligible: totalEligible,
            total_paid: totalPaid,
            total_processing: totalProcessing,
            pending_payment: totalEligible + totalProcessing
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
