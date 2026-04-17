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
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); border: 1px solid rgba(255, 255, 255, 0.5);">
          <tr>
            <td style="padding: 40px 40px 30px 40px; text-align: center;">
              <img src="https://lh3.googleusercontent.com/d/1KgVuIuCv8mKxTcJ4rClCUCdaQ3fxm0x6" alt="WingMentor Logo" style="height: 90px; width: auto; object-fit: contain; display: block; margin: 0 auto 30px auto;" />
              
              <div style="color: #2563eb; font-size: 14px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 20px;">
                ENROLLMENT CONFIRMATION
              </div>
              
              <h2 style="font-size: 28px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.2; color: #0f172a; margin: 0 0 24px 0;">
                Welcome to the ${program || 'Foundation Program'}
              </h2>
              
              <p style="color: #475569; font-size: 16px; line-height: 1.7; margin: 0 0 32px 0;">
                Congratulations <strong>${displayName}</strong>! Your enrollment in the <strong>${program || 'Foundation Program'}</strong> has been successfully confirmed. This email serves as your official enrollment confirmation and provides access to your personalized pilot development journey.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 30px 40px; text-align: center;">
              <a href="https://pilotrecognition.com/portal" 
                 style="display: inline-block; padding: 16px 40px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 12px; font-size: 16px; font-weight: 600;">
                View Pilot Portfolio
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <div style="background: #dbeafe; border-left: 4px solid #2563eb; padding: 20px; border-radius: 8px;">
                <p style="color: #1e40af; margin: 0; font-size: 15px; line-height: 1.5;"><strong>Next Steps:</strong> Our mentorship team will review your onboarding responses and contact you with further instructions.</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px 40px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #64748b; font-size: 14px; margin: 0 0 8px 0;">For questions about your enrollment, contact: enroll@pilotrecognition.com</p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 PilotRecognition.com. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
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
