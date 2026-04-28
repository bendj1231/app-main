import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: Request) {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const body = await req.json();

    // Format the email body
    const emailBody = `
Enterprise Access Request

Contact Information:
- Name: ${body.name}
- Email: ${body.email}
- Phone: ${body.phone}

Company Information:
- Company: ${body.company}
- Role: ${body.role}
- Website: ${body.website}
- Company Size: ${body.companySize}
- Country: ${body.country}

Organization Type:
- Airline Operator: ${body.operator ? 'Yes' : 'No'}
- Aircraft Manufacturer: ${body.manufacturer ? 'Yes' : 'No'}
- ATO / Training Provider: ${body.ato ? 'Yes' : 'No'}
- Type Rating Center: ${body.typeRatingProvider ? 'Yes' : 'No'}
- Airline Recruiter: ${body.airlineRecruiter ? 'Yes' : 'No'}
- Staffing Firm: ${body.staffingFirm ? 'Yes' : 'No'}
- Recruitment Agency: ${body.recruitmentAgency ? 'Yes' : 'No'}

Partnership Interest:
- What do you do: ${body.businessType}
- Partnership Interest: ${body.partnershipInterest}
- Pathway Interests: ${body.pathwayInterests?.join(', ') || 'N/A'}
- Custom Pathway: ${body.customPathway || 'N/A'}
- Timeline: ${body.timeline}
- Data Input Requirements: ${body.dataInput || 'N/A'}

Additional Information:
- Partnership Goals: ${body.message}
    `.trim();

    const { data, error } = await resend.emails.send({
      from: 'PilotRecognition Enterprise <contact@pilotrecognition.com>',
      to: ['benjamintigerbowler@gmail.com'],
      subject: `Enterprise Access Request - ${body.company}`,
      text: emailBody,
      replyTo: body.email,
    });

    if (error) {
      console.error('Resend API error:', error);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, data }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const config = {
  runtime: 'edge',
};
