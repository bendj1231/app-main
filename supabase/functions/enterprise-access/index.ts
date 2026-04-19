// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface reqPayload {
  name: string;
  email: string;
  phone?: string;
  company: string;
  role?: string;
  website?: string;
  companySize?: string;
  country?: string;
  operator?: boolean;
  manufacturer?: boolean;
  ato?: boolean;
  typeRatingProvider?: boolean;
  airlineRecruiter?: boolean;
  staffingFirm?: boolean;
  recruitmentAgency?: boolean;
  businessType?: string;
  partnershipInterest?: string;
  pathwayInterests?: string[];
  customPathway?: string;
  timeline?: string;
  dataInput?: string;
  message?: string;
}

console.info('enterprise-access server started');

Deno.serve(async (req: Request) => {
  try {
    if (req.method !== 'POST') {
      const data = { error: 'Method not allowed' };
      return new Response(
        JSON.stringify(data),
        { 
          status: 405,
          headers: { 'Content-Type': 'application/json', 'Connection': 'keep-alive' }
        }
      );
    }

    const formData: reqPayload = await req.json();

    // Input validation
    if (!formData.email || !formData.company || !formData.name) {
      const data = { error: 'Name, email, and company are required' };
      return new Response(
        JSON.stringify(data),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Connection': 'keep-alive' }
        }
      );
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
    `.trim();

    // Send email using Resend API
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      const data = { error: 'Email service not configured' };
      return new Response(
        JSON.stringify(data),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Connection': 'keep-alive' }
        }
      );
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
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error('Resend API error:', errorText);
      const data = { error: 'Failed to send email' };
      return new Response(
        JSON.stringify(data),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Connection': 'keep-alive' }
        }
      );
    }

    const resendData = await resendResponse.json();
    console.log('Email sent successfully:', resendData.id);

    const data = {
      success: true,
      message: 'Your request has been sent successfully',
      emailId: resendData.id
    };

    return new Response(
      JSON.stringify(data),
      { headers: { 'Content-Type': 'application/json', 'Connection': 'keep-alive' }}
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    const data = { error: 'An unexpected error occurred' };
    return new Response(
      JSON.stringify(data),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Connection': 'keep-alive' }
      }
    );
  }
});
