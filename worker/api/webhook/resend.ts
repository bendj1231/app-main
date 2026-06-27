import { Resend } from 'resend';
import { createHmac, timingSafeEqual } from 'crypto';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

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
      const fromAddress = emailData.from?.email || emailData.from;
      const fromName = emailData.from?.name || '';

      if (!toAddress) {
        console.error('No recipient address found in webhook');
        return new Response('Bad Request', { status: 400 });
      }

      // Store the received email in the database for the admin inbox
      try {
        const { error: dbError } = await supabase
          .from('received_emails')
          .insert({
            to_email: toAddress,
            from_email: fromAddress,
            from_name: fromName,
            subject: emailData.subject || '',
            body: emailData.text || emailData.html || '',
            resend_email_id: emailData.email_id || null,
          });
        if (dbError) {
          console.error('Failed to store received email:', dbError);
        } else {
          console.log(`Stored received email for ${toAddress} from ${fromAddress}`);
        }
      } catch (dbErr) {
        console.error('Database error storing received email:', dbErr);
      }

      // Determine forwarding destination
      const destination = emailRouting[toAddress];

      if (!destination) {
        console.warn(`No routing rule for ${toAddress}, skipping forward`);
        return new Response('OK', { status: 200 });
      }

      // Handle multiple destinations (array) or single destination (string)
      const destinations = Array.isArray(destination) ? destination : [destination];

      // Get custom display name if exists, otherwise use original address
      const displayName = displayNameMapping[toAddress];
      const forwardFrom = displayName ? `${displayName} <${toAddress}>` : toAddress;

      // Forward email to each destination
      for (const dest of destinations) {
        const res = await resend.emails.receiving.forward({
          emailId: emailData.email_id,
          from: forwardFrom,
          to: dest,
          passthrough: true, // Preserve formatting and attachments
        });

        if (res.error) {
          console.error(`Failed to forward email to ${dest}:`, res.error);
          return new Response('Failed to forward', { status: 500 });
        }

        console.log(`Forwarded email from ${toAddress} to ${dest}`);
      }

      return new Response('OK', { status: 200 });
    }

    // Handle other webhook events
    console.warn(`Received webhook event: ${event.type}`);
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export const config = {
  runtime: 'nodejs',
};
