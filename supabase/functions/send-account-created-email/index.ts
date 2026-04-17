import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, name } = await req.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const displayName = name || email.split('@')[0]
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('📧 Sending account creation email to:', email)
    
    // Use Resend API only - no fallbacks
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.error('❌ Resend API key not configured')
      return new Response(
        JSON.stringify({ error: 'Resend API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    try {
      console.log('📧 Sending via Resend API...')
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'noreply@pilotrecognition.com',
          to: email,
          subject: 'Welcome to PilotRecognition.com',
          template: 'account-created',
          variables: {
            first_name: displayName,
            dashboard_url: 'https://pilotrecognition.com/portal',
            support_email: 'support@pilotrecognition.com',
            company_name: 'PilotRecognition.com'
          }
        })
      })

      if (!resendResponse.ok) {
        const errorText = await resendResponse.text()
        console.error('❌ Resend API error:', resendResponse.status, errorText)
        return new Response(
          JSON.stringify({ error: 'Resend API failed', details: errorText }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      console.log('✅ Account creation email sent via Resend API')
      await storeNotification(supabase, email, displayName, 'resend-api')
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Account creation email sent via Resend',
          email: email,
          method: 'resend-api'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    } catch (resendError) {
      console.error('❌ Resend API error:', resendError)
      return new Response(
        JSON.stringify({ error: 'Resend API error', details: (resendError as Error).message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
  } catch (error) {
    console.error('❌ Error in Edge Function:', error)
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

async function storeNotification(supabase: any, email: string, displayName: string, method: string) {
  try {
    // Get the user ID from the email
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()
    
    if (profileError) {
      console.warn('⚠️ Could not find user profile for email:', email)
    } else if (profileData) {
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: profileData.id,
          title: 'Account Creation Email Sent',
          message: `Your account creation email has been sent to ${email}`,
          type: 'system',
          priority: 'high',
          metadata: {
            email: email,
            displayName: displayName,
            emailSubject: 'Welcome to PilotRecognition.com',
            method: method
          }
        })
      
      if (notificationError) {
        console.warn('⚠️ Could not store notification:', notificationError)
      } else {
        console.log('✅ Notification stored successfully')
      }
    }
  } catch (error) {
    console.warn('⚠️ Error storing notification:', error)
  }
}
