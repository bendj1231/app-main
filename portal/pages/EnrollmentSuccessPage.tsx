import React from 'react';
import { Icons } from '../icons';

interface EnrollmentSuccessPageProps {
    onBack: () => void;
}

export const EnrollmentSuccessPage: React.FC<EnrollmentSuccessPageProps> = ({ onBack }) => {
    return (
        <div className="animate-fade-in" style={{
            minHeight: '100vh',
            padding: '4rem 1rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f8fafc'
        }}>
            <div style={{
                maxWidth: '600px',
                width: '100%',
                backgroundColor: 'white',
                borderRadius: '24px',
                padding: '4rem 3rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                textAlign: 'center'
            }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        backgroundColor: '#dcfce7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </div>
                </div>

                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    marginBottom: '1rem',
                    fontFamily: 'Georgia, serif'
                }}>
                    You Are Enrolled!
                </h1>

                <p style={{
                    fontSize: '1.125rem',
                    color: '#64748b',
                    lineHeight: 1.6,
                    marginBottom: '2rem'
                }}>
                    Congratulations! You have successfully enrolled in the Foundational Program. Welcome to WingMentor.
                </p>

                <button
                    onClick={onBack}
                    style={{
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        padding: '1rem 3rem',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                >
                    Back to Programs
                </button>
            </div>
        </div>
    );
};
