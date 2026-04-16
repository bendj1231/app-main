import { Resend } from 'resend';

let resend: Resend | null = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn('RESEND_API_KEY not set - email functionality will be disabled');
}

export const sendEmail = async ({
  to,
  subject,
  html,
  from = 'PilotRecognition Team <contact@pilotrecognition.com>',
}: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}) => {
  if (!resend) {
    console.warn('Email functionality disabled - RESEND_API_KEY not set');
    return null;
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Failed to send email:', error);
      throw error;
    }

    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (to: string, name: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wingmentor.app';
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; margin: 0; padding: 0;">
        <div style="background-color: #ffffff; margin: 0 auto; padding: 20px 0 48px; max-width: 600px;">
          <img src="${baseUrl}/logo.png" alt="WingMentor" style="display: block; margin: 0 auto; width: 120px; height: 40px;">
          <h2 style="font-size: 24px; font-weight: 600; color: #1a1a1a; padding: 0 48px; text-align: center; margin: 32px 0 0 0;">Welcome to WingMentor, ${name}!</h2>
          <p style="color: #666; font-size: 16px; line-height: 24px; text-align: center; padding: 0 48px; margin: 16px 0;">
            Thank you for creating your account. Your pilot recognition journey begins now.
          </p>
          <p style="color: #666; font-size: 16px; line-height: 24px; text-align: center; padding: 0 48px; margin: 16px 0;">
            You can now access your dashboard, explore programs, and connect with the aviation community.
          </p>
          <div style="padding: 27px 0 27px; text-align: center;">
            <a href="https://wingmentor.app/dashboard" style="background-color: #0ea5e9; border-radius: 8px; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; text-align: center; display: inline-block; padding: 12px 24px;">
              Get Started
            </a>
          </div>
          <p style="color: #999; font-size: 12px; line-height: 16px; text-align: center; padding: 0 48px; margin: 48px 0 0 0;">
            Best regards,<br>
            Benjamin Bowler<br>
            PilotRecognition Team
          </p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: 'Welcome to WingMentor',
    html,
  });
};

export const sendAssessmentResultsEmail = async (to: string, name: string, passed: boolean) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${passed ? '#10b981' : '#ef4444'};">
        ${passed ? 'Congratulations!' : 'Assessment Results'}
      </h2>
      <p style="color: #666; line-height: 1.6;">
        ${passed 
          ? `Great job, ${name}! You have successfully passed the screening assessment.`
          : `Hi ${name}, thank you for completing the assessment. Here are your results.`
        }
      </p>
      <div style="margin: 30px 0;">
        <a href="https://wingmentor.app/dashboard" 
           style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
          View Full Results
        </a>
      </div>
      <p style="color: #999; font-size: 12px;">
        Best regards,<br>
        Karl Brian Vogt<br>
        WingMentor Team
      </p>
    </div>
  `;

  return sendEmail({
    to,
    subject: passed ? 'Assessment Results - Passed!' : 'Assessment Results Available',
    html,
  });
};
