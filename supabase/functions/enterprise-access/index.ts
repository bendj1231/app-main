/// <reference lib="deno.ns" />
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getCorsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Simple email regex for basic validation
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LEN = 500;
const MAX_MESSAGE_LEN = 5000;

function sanitize(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim();
}

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req)

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
    const name = sanitize(formData.name);
    const email = sanitize(formData.email);
    const company = sanitize(formData.company);

    if (!name || !email || !company) {
      return new Response(JSON.stringify({ error: 'Name, email, and company are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (!EMAIL_RE.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (name.length > MAX_FIELD_LEN || company.length > MAX_FIELD_LEN || email.length > MAX_FIELD_LEN) {
      return new Response(JSON.stringify({ error: 'Field too long' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const message = sanitize(formData.message);
    if (message.length > MAX_MESSAGE_LEN) {
      return new Response(JSON.stringify({ error: 'Message too long' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Format the email body
    const emailBody = `
Enterprise Access Request

Contact Information:
- Name: ${name}
- Email: ${email}
- Phone: ${sanitize(formData.phone) || 'N/A'}

Company Information:
- Company: ${company}
- Role: ${sanitize(formData.role) || 'N/A'}
- Website: ${sanitize(formData.website) || 'N/A'}
- Company Size: ${sanitize(formData.companySize) || 'N/A'}
- Country: ${sanitize(formData.country) || 'N/A'}

Organization Type:
- Airline Operator: ${formData.operator ? 'Yes' : 'No'}
- Aircraft Manufacturer: ${formData.manufacturer ? 'Yes' : 'No'}
- ATO / Training Provider: ${formData.ato ? 'Yes' : 'No'}
- Type Rating Center: ${formData.typeRatingProvider ? 'Yes' : 'No'}
- Airline Recruiter: ${formData.airlineRecruiter ? 'Yes' : 'No'}
- Staffing Firm: ${formData.staffingFirm ? 'Yes' : 'No'}
- Recruitment Agency: ${formData.recruitmentAgency ? 'Yes' : 'No'}

Partnership Interest:
- What do you do: ${sanitize(formData.businessType) || 'N/A'}
- Partnership Interest: ${sanitize(formData.partnershipInterest) || 'N/A'}
- Pathway Interests: ${Array.isArray(formData.pathwayInterests) ? formData.pathwayInterests.map(sanitize).join(', ') : 'N/A'}
- Custom Pathway: ${sanitize(formData.customPathway) || 'N/A'}
- Timeline: ${sanitize(formData.timeline) || 'N/A'}
- Data Input Requirements: ${sanitize(formData.dataInput) || 'N/A'}

Additional Information:
- Partnership Goals: ${message || 'N/A'}
    `.trim()

    // Send email using Resend API
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const notificationEmails = Deno.env.get('ENTERPRISE_NOTIFICATION_EMAILS')?.split(',') || []
    if (notificationEmails.length === 0) {
      console.error('ENTERPRISE_NOTIFICATION_EMAILS not configured');
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'PilotRecognition Enterprise <enterprise@pilotrecognition.com>',
        to: notificationEmails.length > 0 ? notificationEmails : ['no-reply@pilotrecognition.com'],
        subject: `Enterprise Access Request - ${company}`,
        text: emailBody,
        reply_to: email,
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
