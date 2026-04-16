import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email routing mapping
const emailRouting = {
  'benjamin@pilotrecognition.com': 'benjamintigerbowler@gmail.com',
  'recruiter@pilotrecognition.com': 'recruiter-benjamintigerbowler@gmail.com',
  'karl@pilotrecognition.com': 'benjamintigerbowler@gmail.com',
  'kb@pilotrecognition.com': 'karlbrianabibas@gmail.com',
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

      // Forward email using Resend's receiving.forward() method
      const { data, error } = await resend.emails.receiving.forward({
        emailId: emailData.email_id,
        from: toAddress,
        to: destination,
        passthrough: true, // Preserve formatting and attachments
      });

      if (error) {
        console.error('Failed to forward email:', error);
        return new Response('Failed to forward', { status: 500 });
      }

      console.log(`Forwarded email from ${toAddress} to ${destination}`);
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
