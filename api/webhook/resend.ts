import { Resend } from 'resend';
import { createHmac, timingSafeEqual } from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

// Load routing from environment or fallback to empty (must be configured in prod)
function loadRouting(): Record<string, string | string[]> {
  if (process.env.RESEND_EMAIL_ROUTING) {
    try {
      return JSON.parse(process.env.RESEND_EMAIL_ROUTING);
    } catch {
      console.error('Invalid RESEND_EMAIL_ROUTING JSON');
    }
  }
  return {};
}

const emailRouting: Record<string, string | string[]> = loadRouting();

// Display name mapping for forwarded emails
const displayNameMapping: Record<string, string> = {
  'contact@pilotrecognition.com': 'PilotRecognition Team',
};

/**
 * Verify Resend webhook signature using HMAC-SHA256.
 * Resend sends the signature in the `resend-signature` header.
 */
function verifyResendSignature(payload: string, signature: string, secret: string): boolean {
  const expected = createHmac('sha256', secret).update(payload).digest('hex');
  const sigBuf = Buffer.from(signature, 'hex');
  const expBuf = Buffer.from(expected, 'hex');
  if (sigBuf.length !== expBuf.length) return false;
  return timingSafeEqual(sigBuf, expBuf);
}

export default async function handler(req: Request) {
  try {
    const signature = req.headers.get('resend-signature');
    const secret = process.env.RESEND_WEBHOOK_SECRET;
    if (!signature || !secret) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await req.text();
    if (!verifyResendSignature(body, signature, secret)) {
      console.error('Resend webhook signature verification failed');
      return new Response('Unauthorized', { status: 401 });
    }

    // Parse webhook event
    const event = JSON.parse(body);
    
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

      // Handle multiple destinations (array) or single destination (string)
      const destinations = Array.isArray(destination) ? destination : [destination];

      // Get custom display name if exists, otherwise use original address
      const displayName = displayNameMapping[toAddress];
      const fromAddress = displayName ? `${displayName} <${toAddress}>` : toAddress;

      // Forward email to each destination
      for (const dest of destinations) {
        const { data, error } = await resend.emails.receiving.forward({
          emailId: emailData.email_id,
          from: fromAddress,
          to: dest,
          passthrough: true, // Preserve formatting and attachments
        });

        if (error) {
          console.error(`Failed to forward email to ${dest}:`, error);
          return new Response('Failed to forward', { status: 500 });
        }

        console.log(`Forwarded email from ${toAddress} to ${dest}`);
      }

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
