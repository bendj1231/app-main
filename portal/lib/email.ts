interface EnrollmentEmailPayload {
  email: string;
  name?: string | null;
}

export const sendEnrollmentConfirmationEmail = async ({ email, name }: EnrollmentEmailPayload, token?: string) => {
  try {
    const displayName = name || email.split('@')[0];

    const apiUrl = (import.meta as any).env?.VITE_PILOT_API_URL || '';
    if (!apiUrl) {
      console.warn('⚠️ VITE_PILOT_API_URL not set, skipping enrollment email');
      return;
    }

    const res = await fetch(`${apiUrl}/api/send-enrollment-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        email,
        name: displayName,
        program: 'Foundational',
        type: 'enrollment-confirmation'
      }),
    });

    if (!res.ok) {
      console.error('❌ Worker API email error:', await res.text());
    } else {
      console.log('✅ Enrollment confirmation email queued via Worker API');
    }
  } catch (error) {
    console.error('❌ Error sending enrollment confirmation:', error);
    // Don't throw error - enrollment should succeed even if email fails
  }
};
