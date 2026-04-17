import React, { useEffect, useRef } from 'react';
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

const CloudShader: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const animate = () => {
            // Light blue gradient background
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#e8f4fc');
            gradient.addColorStop(0.3, '#d4e9f7');
            gradient.addColorStop(0.6, '#c5dff0');
            gradient.addColorStop(1, '#b8d4ea');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const time = Date.now() * 0.0001;
            
            // Smoke wisps with Perlin-like noise effect
            for (let i = 0; i < 20; i++) {
                const x = (Math.sin(time + i * 0.3) * 0.5 + 0.5) * canvas.width;
                const y = (Math.cos(time * 0.2 + i * 0.4) * 0.5 + 0.5) * canvas.height;
                const radius = 150 + Math.sin(time + i * 0.5) * 100;
                const opacity = (Math.sin(time * 0.3 + i) + 1) / 2 * 0.15;

                const smokeGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                smokeGradient.addColorStop(0, `rgba(220, 235, 250, ${opacity})`);
                smokeGradient.addColorStop(0.5, `rgba(200, 220, 240, ${opacity * 0.5})`);
                smokeGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = smokeGradient;
                ctx.fill();
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
        />
    );
};

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

    const nextSteps = [
        "Review the Foundation Program overview in the next slides",
        "Access the W1000 application for examination practice",
        "Complete your initial pilot licensure examination",
        "Begin your mentorship journey with 20 hours of observation"
    ];

    return (
        <div className="dashboard-container animate-fade-in" style={{ zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', height: '100%', pointerEvents: 'none' }}>
                <CloudShader />
            </div>
            <main className="dashboard-card" style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 'auto',
                maxHeight: '85vh',
                padding: 0,
                maxWidth: '750px',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden'
            }}>
                {/* Progress Bar */}
                <div style={{ display: 'flex', width: '100%', height: '6px', backgroundColor: '#f1f5f9' }}>
                    <div style={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: '#2563eb',
                        transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}></div>
                </div>

                {/* Content area */}
                <div style={{ padding: '2.5rem 2.5rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', overflow: 'auto' }}>
                    <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
                        <div className="dashboard-logo" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '90px', height: 'auto' }} />
                        </div>

                        <div className="dashboard-subtitle">
                            ENROLLMENT CONFIRMED
                        </div>

                        <h1 className="dashboard-title" style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>
                            Welcome to the Foundation Program
                        </h1>

                        <p style={{ maxWidth: '550px', margin: '0 auto', fontSize: '0.95rem', color: '#475569', lineHeight: 1.5 }}>
                            Congratulations <strong>{userProfile?.firstName || 'Pilot'}</strong>! Your enrollment in the <strong>Foundation Program</strong> has been successfully confirmed. You're now ready to begin your personalized pilot development journey.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '480px', textAlign: 'center', margin: '0 auto' }}>
                        <div style={{
                            padding: '1.25rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.6)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(226, 232, 240, 0.8)',
                            borderRadius: '16px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
                        }}>
                            {nextSteps.map((step, index) => (
                                <div key={index} className="animate-fade-in" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', animationDelay: `${index * 0.15}s`, marginBottom: index < nextSteps.length - 1 ? '0.8rem' : '0' }}>
                                    <div style={{ marginTop: '0.1rem', color: '#10b981' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <p style={{ margin: 0, color: '#334155', fontSize: '0.875rem', lineHeight: 1.4, textAlign: 'left' }}>{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        background: '#dbeafe',
                        borderLeft: '4px solid #2563eb',
                        padding: '15px',
                        margin: '1.5rem 0 0',
                        maxWidth: '480px',
                        width: '100%'
                    }}>
                        <p style={{
                            color: '#1e40af',
                            margin: 0,
                            fontSize: '0.9rem',
                            textAlign: 'left'
                        }}>
                            <strong>Next Steps:</strong> Our mentorship team will review your onboarding responses and contact you with further instructions.
                        </p>
                    </div>
                </div>

                {/* Footer Controls */}
                <div style={{ padding: '1.25rem 2.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', backgroundColor: '#ffffff' }}>
                    <button
                        onClick={onComplete}
                        style={{
                            flex: 1,
                            padding: '0.6rem 1.25rem',
                            borderRadius: '10px',
                            backgroundColor: '#2563eb',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid #2563eb',
                            boxShadow: '0 8px 32px rgba(37, 99, 235, 0.3)',
                            color: '#ffffff',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            maxWidth: '140px'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#1d4ed8';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#2563eb';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        Continue
                        <Icons.ArrowRight style={{ width: 14, height: 14, marginLeft: '0.4rem', display: 'inline', verticalAlign: 'middle' }} />
                    </button>
                </div>
            </main>
        </div>
    );
};

export default EnrollmentConfirmationPage;
