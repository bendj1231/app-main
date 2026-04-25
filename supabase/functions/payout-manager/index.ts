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

      if (!formData.amount || formData.amount <= 0) {
        return new Response(JSON.stringify({ error: 'Valid amount is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Check if user is admin of this flight school or super admin
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

      // Create payout record
      const { data: payout, error: payoutError } = await supabase
        .from('payouts')
        .insert({
          flight_school_id: formData.flight_school_id,
          amount: formData.amount,
          currency: formData.currency || 'USD',
          payout_method: formData.payout_method || flightSchool.payout_method,
          scheduled_for: formData.scheduled_for || null,
          notes: formData.notes || null,
          metadata: formData.metadata || {}
        })
        .select()
        .single()

      if (payoutError) {
        return new Response(JSON.stringify({ error: 'Failed to create payout' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Link referrals to this payout if provided
      if (formData.referral_ids && Array.isArray(formData.referral_ids)) {
        await supabase
          .from('referrals')
          .update({
            payout_id: payout.id,
            commission_status: 'processing'
          })
          .in('id', formData.referral_ids)
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Payout created successfully',
          payout: payout
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

    if (req.method === 'GET') {
      const url = new URL(req.url)
      const flightSchoolId = url.searchParams.get('flight_school_id')
      const status = url.searchParams.get('status')
      const limit = parseInt(url.searchParams.get('limit') || '50')

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
        .from('payouts')
        .select('*')
        .eq('flight_school_id', flightSchoolId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (status) {
        query = query.eq('status', status)
      }

      const { data: payouts, error: payoutsError } = await query

      if (payoutsError) {
        return new Response(JSON.stringify({ error: 'Failed to fetch payouts' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Calculate summary statistics
      const { data: summary } = await supabase
        .from('payouts')
        .select('status, amount')
        .eq('flight_school_id', flightSchoolId)

      const totalPayouts = summary?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0
      const pendingPayouts = summary?.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0
      const completedPayouts = summary?.filter(p => p.status === 'completed').reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0

      return new Response(
        JSON.stringify({
          success: true,
          payouts: payouts,
          summary: {
            total: totalPayouts,
            pending: pendingPayouts,
            completed: completedPayouts
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
