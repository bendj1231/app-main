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
      // Generate a new referral link
      const formData = await req.json()

      // Input validation
      if (!formData.flight_school_id) {
        return new Response(JSON.stringify({ error: 'flight_school_id is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Check if user is admin of this flight school
      const { data: isAdmin, error: adminCheckError } = await supabase
        .from('flight_school_admins')
        .select('*')
        .eq('flight_school_id', formData.flight_school_id)
        .eq('user_id', user.id)
        .single()

      if (adminCheckError || !isAdmin) {
        // Also check if user is super admin
        const { data: enterpriseAccount } = await supabase
          .from('enterprise_accounts')
          .select('*')
          .eq('profile_id', user.id)
          .eq('is_super_admin', true)
          .single()

        if (!enterpriseAccount) {
          return new Response(JSON.stringify({ error: 'Forbidden: Not authorized for this flight school' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
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

      // Generate referral link
      const baseUrl = 'https://pilotrecognition.com'
      const referralLink = `${baseUrl}/ref/${flightSchool.referral_code}`

      // Create referral record if pilot email provided
      let referralId = null
      if (formData.pilot_email) {
        const { data: newReferral, error: referralError } = await supabase
          .from('referrals')
          .insert({
            flight_school_id: formData.flight_school_id,
            pilot_email: formData.pilot_email,
            pilot_name: formData.pilot_name || null,
            referral_code: flightSchool.referral_code,
            referral_link: referralLink,
            commission_amount: flightSchool.commission_rate,
            metadata: formData.metadata || {}
          })
          .select()
          .single()

        if (referralError) {
          return new Response(JSON.stringify({ error: 'Failed to create referral' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        referralId = newReferral.id
      }

      return new Response(
        JSON.stringify({
          success: true,
          referral_link: referralLink,
          referral_code: flightSchool.referral_code,
          referral_id: referralId,
          flight_school: {
            id: flightSchool.id,
            name: flightSchool.name,
            commission_rate: flightSchool.commission_rate
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

    if (req.method === 'GET') {
      // Get referral link for a flight school
      const url = new URL(req.url)
      const flightSchoolId = url.searchParams.get('flight_school_id')

      if (!flightSchoolId) {
        return new Response(JSON.stringify({ error: 'flight_school_id is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Get flight school details
      const { data: flightSchool, error: schoolError } = await supabase
        .from('flight_schools')
        .select('*')
        .eq('id', flightSchoolId)
        .single()

      if (schoolError || !flightSchool) {
        return new Response(JSON.stringify({ error: 'Flight school not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const baseUrl = 'https://pilotrecognition.com'
      const referralLink = `${baseUrl}/ref/${flightSchool.referral_code}`

      return new Response(
        JSON.stringify({
          success: true,
          referral_link: referralLink,
          referral_code: flightSchool.referral_code,
          flight_school: {
            id: flightSchool.id,
            name: flightSchool.name,
            commission_rate: flightSchool.commission_rate
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
