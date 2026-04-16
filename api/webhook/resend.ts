import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email routing mapping
const emailRouting: Record<string, string | string[]> = {
  'benjamin@pilotrecognition.com': 'benjamintigerbowler@gmail.com',
  'recruiter@pilotrecognition.com': 'recruiter-benjamintigerbowler@gmail.com',
  'karl@pilotrecognition.com': 'benjamintigerbowler@gmail.com',
  'kb@pilotrecognition.com': 'karlbrianabibas@gmail.com',
  'support@pilotrecognition.com': ['karlbrianabibas@gmail.com', 'benjamintigerbowler@gmail.com'],
  'contact@pilotrecognition.com': 'benjamintigerbowler@gmail.com',
};

// Display name mapping for forwarded emails
const displayNameMapping: Record<string, string> = {
  'contact@pilotrecognition.com': 'WingMentor Team',
};

// Verify webhook signature
function verifyWebhookSignature(signature: string | null, body: string): boolean {
  if (!signature || !process.env.RESEND_WEBHOOK_SECRET) {
    return false;
  }

  const [timestamp, signatureValue] = signature.split(',');
  if (!timestamp || !signatureValue) {
    return false;
  }

  // Check if timestamp is within 5 minutes (300 seconds)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > 300) {
    return false;
  }

  // Create HMAC signature
  const hmac = crypto.createHmac('sha256', process.env.RESEND_WEBHOOK_SECRET);
  hmac.update(`${timestamp}.${body}`);
  const expectedSignature = hmac.digest('hex');

  // Use timing-safe comparison
  return crypto.timingSafeEqual(
    Buffer.from(signatureValue),
    Buffer.from(expectedSignature)
  );
}

// Background email forwarding function
async function forwardEmailInBackground(emailData: any, toAddress: string, destination: string | string[], displayName: string) {
  try {
    const destinations = Array.isArray(destination) ? destination : [destination];
    const fromAddress = displayName ? `${displayName} <${toAddress}>` : toAddress;

    for (const dest of destinations) {
      const { data, error } = await resend.emails.receiving.forward({
        emailId: emailData.email_id,
        from: fromAddress,
        to: dest,
        passthrough: true,
      });

      if (error) {
        console.error(`Failed to forward email to ${dest}:`, error);
      } else {
        console.log(`✅ Forwarded email from ${toAddress} to ${dest}`);
      }
    }
  } catch (error) {
    console.error('Background forwarding error:', error);
  }
}

export default async function handler(req: Request) {
  try {
    // Get raw body for signature verification
    const rawBody = await req.text();
    
    // Verify webhook signature
    const signature = req.headers.get('resend-signature');
    if (!verifyWebhookSignature(signature, rawBody)) {
      console.error('Invalid webhook signature');
      return new Response('Unauthorized', { status: 401 });
    }

    // Parse webhook event
    const event = JSON.parse(rawBody);
    
    // Handle email.received event
    if (event.type === 'email.received') {
      const emailData = event.data;
      const toAddress = emailData.to?.[0]?.email || emailData.to?.[0];
      
      if (!toAddress) {
        console.error('No recipient address found in webhook');
        return new Response('Bad Request', { status: 400 });
      }

      // Determine forwarding destination
      const destination = emailRouting[toAddress];
      
      if (!destination) {
        console.log(`No routing rule for ${toAddress}, skipping`);
        return new Response('OK', { status: 200 });
      }

      // Get custom display name
      const displayName = displayNameMapping[toAddress];

      // Respond immediately to prevent timeout
      // Process forwarding in background
      forwardEmailInBackground(emailData, toAddress, destination, displayName);

      return new Response('OK', { status: 200 });
    }

    // Handle other webhook events
    console.log(`Received webhook event: ${event.type}`);
    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Webhook handler error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export const config = {
  runtime: 'edge',
};
