import { Resend } from 'resend';

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

export default async function handler(req: Request) {
  try {
    // Verify Resend webhook signature
    const signature = req.headers.get('resend-signature');
    if (!signature) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Parse webhook event
    const event = await req.json();
    
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
