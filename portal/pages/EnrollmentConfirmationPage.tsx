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
    }, [userProfile, userEmail]);

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
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 2.5rem',
                maxWidth: '500px',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                textAlign: 'center'
            }}>
                <div className="dashboard-logo" style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '2rem' }}>
                    <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '80px', height: 'auto' }} />
                </div>

                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#2563eb',
                    marginBottom: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    Email Confirmation Sent!
                </h1>

                <p style={{
                    fontSize: '1.1rem',
                    color: '#475569',
                    lineHeight: 1.6,
                    marginBottom: '2.5rem'
                }}>
                    Welcome to the Foundation Program
                </p>

                <button
                    onClick={onComplete}
                    style={{
                        padding: '1rem 2.5rem',
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 8px 32px rgba(37, 99, 235, 0.3)'
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
                    Get Started
                    <Icons.ArrowRight style={{ width: 16, height: 16, marginLeft: '0.5rem', display: 'inline', verticalAlign: 'middle' }} />
                </button>
            </main>
        </div>
    );
};

export default EnrollmentConfirmationPage;
