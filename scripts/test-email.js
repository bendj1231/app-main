import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

(async function() {
  const { data, error } = await resend.emails.send({
    from: 'Karl <karl@pilotrecognition.com>',
    to: 'benjamintigerbowler@gmail.com', // Put your email here
    subject: 'Wingman Network Setup',
    html: '<strong>Domain Active!</strong> Setup for pilotrecognition.com is complete.',
  });

  if (error) {
    return console.error(error);
  }
  console.log('Email sent successfully:', data.id);
})();
