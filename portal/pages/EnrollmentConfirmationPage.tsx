import React, { useEffect } from 'react';
import { Icons } from '../icons';
import { supabase } from '../lib/supabase-auth';

interface EnrollmentConfirmationPageProps {
    onComplete: () => void;
    onBack?: () => void;
    onLogout?: () => void;
    userEmail?: string;
    userProfile?: {
        firstName?: string;
        email?: string;
    };
}

export const EnrollmentConfirmationPage: React.FC<EnrollmentConfirmationPageProps> = ({
    onComplete,
    onBack,
    onLogout,
    userEmail,
    userProfile
}) => {
    useEffect(() => {
        // Auto-advance to slideshow after 5 seconds
        const timer = setTimeout(() => {
            onComplete();
        }, 5000);

        // Send enrollment confirmation email
        const sendEnrollmentEmail = async () => {
            try {
                const { data, error } = await supabase.functions.invoke('send-enrollment-email', {
                    body: {
                        email: userProfile?.email || userEmail,
                        name: userProfile?.firstName,
                        program: 'Foundation Program',
                        type: 'enrollment-confirmation'
                    }
                });

                if (error) {
                    console.error('❌ Failed to send enrollment confirmation email:', error);
                } else {
                    console.log('✅ Enrollment confirmation email sent');
                }
            } catch (error) {
                console.error('❌ Error sending enrollment confirmation email:', error);
            }
        };

        sendEnrollmentEmail();

        return () => clearTimeout(timer);
    }, [onComplete, userProfile, userEmail]);
    return (
        <div style={{
            fontFamily: 'Georgia, serif',
            maxWidth: '600px',
            margin: '0 auto',
            padding: '20px',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            background: 'linear-gradient(180deg, #f0f4f8 0%, #e8eef5 100%)'
        }}>
            {/* Soft Transition Shader Background */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `
                    radial-gradient(circle at 20% 20%, rgba(59,130,246,0.25), rgba(255,255,255,0.15) 20%, transparent 35%),
                    radial-gradient(circle at 80% 10%, rgba(14,165,233,0.25), rgba(255,255,255,0.12) 18%, transparent 30%),
                    radial-gradient(circle at 50% 60%, rgba(147,197,253,0.20), rgba(255,255,255,0.10) 25%, transparent 40%),
                    radial-gradient(circle at 35% 75%, rgba(59,130,246,0.15), rgba(255,255,255,0.08) 22%, transparent 38%)
                `,
                mixBlendMode: 'screen',
                pointerEvents: 'none',
                zIndex: 1
            }}></div>
            
            <div style={{
                position: 'absolute',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 30%, transparent 50%)',
                top: '10%',
                right: '0%',
                filter: 'blur(8px)',
                opacity: 0.9,
                pointerEvents: 'none',
                zIndex: 1
            }}></div>
            
            <div style={{
                position: 'absolute',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(147,197,253,0.18) 0%, rgba(255,255,255,0.06) 35%, transparent 55%)',
                bottom: '5%',
                left: '-10%',
                filter: 'blur(12px)',
                opacity: 0.8,
                pointerEvents: 'none',
                zIndex: 1
            }}></div>
            
            <div style={{
                position: 'absolute',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.05) 40%, transparent 60%)',
                top: '60%',
                left: '40%',
                filter: 'blur(10px)',
                opacity: 0.7,
                pointerEvents: 'none',
                zIndex: 1
            }}></div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
                textAlign: 'center',
                position: 'relative',
                zIndex: 2
            }}>
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    borderRadius: '16px',
                    padding: '3rem 2.5rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    backdropFilter: 'blur(18px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    width: '100%',
                    fontFamily: 'sans-serif'
                }}>
                    <img
                        src="https://lh3.googleusercontent.com/d/1KgVuIuCv8mKxTcJ4rClCUCdaQ3fxm0x6"
                        alt="WingMentor Logo"
                        style={{
                            height: '110px',
                            width: 'auto',
                            objectFit: 'contain',
                            marginBottom: '1.5rem'
                        }}
                    />
                    
                    <div style={{
                        color: '#2563eb',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        marginBottom: '0.75rem'
                    }}>
                        ENROLLMENT CONFIRMATION
                    </div>
                    
                    <h2 style={{
                        fontSize: '1.8rem',
                        fontWeight: 400,
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.2,
                        color: '#0f172a',
                        marginBottom: '2.5rem'
                    }}>
                        Welcome to the Foundation Program
                    </h2>
                    
                    <p style={{
                        color: '#475569',
                        fontSize: '1.05rem',
                        lineHeight: 1.8,
                        margin: '0 auto 2rem',
                        maxWidth: '40rem',
                        textAlign: 'left'
                    }}>
                        Congratulations <strong>{userProfile?.firstName || 'Pilot'}</strong>! Your enrollment in the <strong>Foundation Program</strong> has been successfully confirmed. This email serves as your official enrollment confirmation and provides access to your personalized pilot development journey.
                    </p>
                    
                    <div style={{
                        textAlign: 'center',
                        margin: '2.5rem 0'
                    }}>
                        <button
                            onClick={onComplete}
                            style={{
                                display: 'inline-block',
                                padding: '1.1rem 2.75rem',
                                background: 'rgba(147, 197, 253, 0.35)',
                                color: '#1e40af',
                                textDecoration: 'none',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: 700,
                                transition: 'all 0.25s ease',
                                boxShadow: '0 8px 32px rgba(147, 197, 253, 0.2), inset 0 1px 0 rgba(255,255,255,0.6)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(147, 197, 253, 0.4)',
                                cursor: 'pointer'
                            }}
                        >
                            Continue to Dashboard
                        </button>
                    </div>
                    
                    <div style={{
                        background: '#dbeafe',
                        borderLeft: '4px solid #2563eb',
                        padding: '15px',
                        marginBottom: '20px'
                    }}>
                        <p style={{
                            color: '#1e40af',
                            margin: 0,
                            fontSize: '0.9rem'
                        }}>
                            <strong>Next Steps:</strong> Our mentorship team will review your onboarding responses and contact you with further instructions.
                        </p>
                    </div>
                    
                    <div style={{
                        textAlign: 'center',
                        color: '#64748b',
                        fontSize: '0.85rem',
                        marginTop: '30px',
                        paddingTop: '20px',
                        borderTop: '1px solid #e5e7eb'
                    }}>
                        <p>For questions about your enrollment, contact: enroll@pilotrecognition.com</p>
                        <p style={{
                            color: '#9ca3af',
                            fontSize: '0.75rem',
                            marginTop: '15px'
                        }}>
                            © 2026 PilotRecognition.com. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnrollmentConfirmationPage;
