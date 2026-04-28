import React from 'react';
import { Icons } from '../icons';

interface EnrollmentSuccessPageProps {
    onNavigateToDashboard?: () => void;
}

export const EnrollmentSuccessPage: React.FC<EnrollmentSuccessPageProps> = ({ onNavigateToDashboard }) => {
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
                    <img src="/logo.png" alt="PilotRecognition Logo" style={{ maxWidth: '200px', height: 'auto' }} />
                </div>

                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 400,
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
                    Congratulations! You have successfully enrolled in the Foundational Program. Welcome to PilotRecognition.
                </p>

                <button
                    onClick={onNavigateToDashboard}
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
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};
