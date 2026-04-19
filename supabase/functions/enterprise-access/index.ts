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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const formData = await req.json()

    // Input validation
    if (!formData.email || !formData.company || !formData.name) {
      return new Response(JSON.stringify({ error: 'Name, email, and company are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Format the email body
    const emailBody = `
Enterprise Access Request

Contact Information:
- Name: ${formData.name}
- Email: ${formData.email}
- Phone: ${formData.phone || 'N/A'}

Company Information:
- Company: ${formData.company}
- Role: ${formData.role || 'N/A'}
- Website: ${formData.website || 'N/A'}
- Company Size: ${formData.companySize || 'N/A'}
- Country: ${formData.country || 'N/A'}

Organization Type:
- Airline Operator: ${formData.operator ? 'Yes' : 'No'}
- Aircraft Manufacturer: ${formData.manufacturer ? 'Yes' : 'No'}
- ATO / Training Provider: ${formData.ato ? 'Yes' : 'No'}
- Type Rating Center: ${formData.typeRatingProvider ? 'Yes' : 'No'}
- Airline Recruiter: ${formData.airlineRecruiter ? 'Yes' : 'No'}
- Staffing Firm: ${formData.staffingFirm ? 'Yes' : 'No'}
- Recruitment Agency: ${formData.recruitmentAgency ? 'Yes' : 'No'}

Partnership Interest:
- What do you do: ${formData.businessType || 'N/A'}
- Partnership Interest: ${formData.partnershipInterest || 'N/A'}
- Pathway Interests: ${formData.pathwayInterests?.join(', ') || 'N/A'}
- Custom Pathway: ${formData.customPathway || 'N/A'}
- Timeline: ${formData.timeline || 'N/A'}
- Data Input Requirements: ${formData.dataInput || 'N/A'}

Additional Information:
- Partnership Goals: ${formData.message || 'N/A'}
    `.trim()

    // Send email using Resend API
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'WingMentor Enterprise <enterprise@pilotrecognition.com>',
        to: ['benjamintigerbowler@gmail.com'],
        subject: `Enterprise Access Request - ${formData.company}`,
        text: emailBody,
        reply_to: formData.email,
      }),
    })

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text()
      console.error('Resend API error:', errorText)
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const resendData = await resendResponse.json()
    console.log('Email sent successfully:', resendData.id)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Your request has been sent successfully',
        emailId: resendData.id
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Connection': 'keep-alive'
        } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
