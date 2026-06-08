import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiter (simple in-memory for now, consider Redis in production)
const requestLimits = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // 5 requests per hour per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestLimits.get(ip);
  
  if (!record || now > record.resetTime) {
    requestLimits.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  record.count++;
  return true;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function validateString(str: any, maxLength: number): boolean {
  if (typeof str !== 'string') return false;
  return str.length > 0 && str.length <= maxLength;
}

function sanitizeField(value: any): string {
  if (typeof value !== 'string') return 'N/A';
  // Remove newlines to prevent email header injection
  return value.replace(/[\r\n]/g, ' ').slice(0, 1000);
}

export default async function handler(req: Request) {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-client-ip') || 
               'unknown';
    
    if (!checkRateLimit(ip)) {
      return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();

    // Input validation
    if (!validateString(body.name, 255) || !validateEmail(body.email) || 
        !validateString(body.company, 255) || !validateString(body.message, 2000)) {
      return new Response(JSON.stringify({ error: 'Invalid input parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Format the email body using sanitized values to prevent header injection
    const emailBody = [
      'Enterprise Access Request',
      '',
      'Contact Information:',
      `- Name: ${sanitizeField(body.name)}`,
      `- Email: ${sanitizeField(body.email)}`,
      `- Phone: ${sanitizeField(body.phone)}`,
      '',
      'Company Information:',
      `- Company: ${sanitizeField(body.company)}`,
      `- Role: ${sanitizeField(body.role)}`,
      `- Website: ${sanitizeField(body.website)}`,
      `- Company Size: ${sanitizeField(body.companySize)}`,
      `- Country: ${sanitizeField(body.country)}`,
      '',
      'Organization Type:',
      `- Airline Operator: ${body.operator ? 'Yes' : 'No'}`,
      `- Aircraft Manufacturer: ${body.manufacturer ? 'Yes' : 'No'}`,
      `- ATO / Training Provider: ${body.ato ? 'Yes' : 'No'}`,
      `- Type Rating Center: ${body.typeRatingProvider ? 'Yes' : 'No'}`,
      `- Airline Recruiter: ${body.airlineRecruiter ? 'Yes' : 'No'}`,
      `- Staffing Firm: ${body.staffingFirm ? 'Yes' : 'No'}`,
      `- Recruitment Agency: ${body.recruitmentAgency ? 'Yes' : 'No'}`,
      '',
      'Partnership Interest:',
      `- What do you do: ${sanitizeField(body.businessType)}`,
      `- Partnership Interest: ${sanitizeField(body.partnershipInterest)}`,
      `- Pathway Interests: ${sanitizeField(Array.isArray(body.pathwayInterests) ? body.pathwayInterests.join(', ') : 'N/A')}`,
      `- Custom Pathway: ${sanitizeField(body.customPathway)}`,
      `- Timeline: ${sanitizeField(body.timeline)}`,
      `- Data Input Requirements: ${sanitizeField(body.dataInput)}`,
      '',
      'Additional Information:',
      `- Partnership Goals: ${sanitizeField(body.message)}`
    ].join('\n');

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
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const config = {
  runtime: 'nodejs',
};
