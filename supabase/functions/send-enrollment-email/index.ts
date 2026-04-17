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
    const { email, name, program, type } = await req.json()

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

    console.log('📧 Sending enrollment confirmation to:', email)
    
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
      
      const emailHtml = `
<div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);">
  <div style="background-color: rgba(255, 255, 255, 0.95); border-radius: 16px; padding: 3rem 2.5rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); border: 1px solid rgba(255, 255, 255, 0.5);">
    <img src="https://lh3.googleusercontent.com/d/1KgVuIuCv8mKxTcJ4rClCUCdaQ3fxm0x6" alt="WingMentor Logo" style="height: 90px; width: auto; object-fit: contain; margin-bottom: 2rem; display: block; margin-left: auto; margin-right: auto;" />
    
    <div style="color: #2563eb; font-size: 0.875rem; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 1rem; text-align: center;">
      ENROLLMENT CONFIRMATION
    </div>
    
    <h2 style="font-size: 1.75rem; font-weight: 600; letter-spacing: -0.02em; line-height: 1.2; color: #0f172a; margin-bottom: 1.5rem; text-align: center;">
      Welcome to the ${program || 'Foundation Program'}
    </h2>
    
    <p style="color: #475569; font-size: 1rem; line-height: 1.7; margin: 0 0 2rem 0; text-align: center;">
      Congratulations <strong>${displayName}</strong>! Your enrollment in the <strong>${program || 'Foundation Program'}</strong> has been successfully confirmed. This email serves as your official enrollment confirmation and provides access to your personalized pilot development journey.
    </p>
    
    <div style="text-align: center; margin: 2rem 0;">
      <a href="https://pilotrecognition.com/portal" 
         style="display: inline-block; padding: 1rem 2.5rem; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 12px; font-size: 1rem; font-weight: 600; transition: background-color 0.2s;">
        View Pilot Portfolio
      </a>
    </div>
    
    <div style="background: #dbeafe; border-left: 4px solid #2563eb; padding: 1.25rem; margin: 2rem 0 0 0; border-radius: 8px;">
      <p style="color: #1e40af; margin: 0; font-size: 0.95rem; line-height: 1.5;"><strong>Next Steps:</strong> Our mentorship team will review your onboarding responses and contact you with further instructions.</p>
    </div>
    
    <div style="text-align: center; color: #64748b; font-size: 0.85rem; margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 0.5rem 0;">For questions about your enrollment, contact: enroll@pilotrecognition.com</p>
      <p style="margin: 0; color: #9ca3af; font-size: 0.75rem;">© 2026 PilotRecognition.com. All rights reserved.</p>
    </div>
  </div>
</div>
`;
      
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'noreply@pilotrecognition.com',
          to: email,
          subject: 'Enrollment Confirmation - WingMentor Foundation Program',
          html: emailHtml
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

      console.log('✅ Email sent via Resend API')
      await storeNotification(supabase, email, displayName, program, 'resend-api')
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Enrollment confirmation sent via Resend',
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

async function storeNotification(supabase: any, email: string, displayName: string, program: string, method: string) {
  try {
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: null,
        title: 'Enrollment Confirmation Sent',
        message: `Your enrollment confirmation for the WingMentor Foundational Program has been sent to ${email}`,
        type: 'system',
        priority: 'high',
        metadata: {
          email: email,
          displayName: displayName,
          program: program,
          enrollmentDate: new Date().toISOString(),
          emailSubject: '✅ Enrollment Confirmed - WingMentor Foundational Program',
          method: method
        }
      })
    
    if (notificationError) {
      console.warn('⚠️ Could not store notification:', notificationError)
    } else {
      console.log('✅ Notification stored successfully')
    }
  } catch (error) {
    console.warn('⚠️ Error storing notification:', error)
  }
}
