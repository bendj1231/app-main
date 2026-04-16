import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a1a;">Welcome to WingMentor, ${name}!</h2>
      <p style="color: #666; line-height: 1.6;">
        Thank you for creating your account. Your pilot recognition journey begins now.
      </p>
      <p style="color: #666; line-height: 1.6;">
        You can now access your dashboard, explore programs, and connect with the aviation community.
      </p>
      <div style="margin: 30px 0;">
        <a href="https://wingmentor.app/dashboard" 
           style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
          Go to Dashboard
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
