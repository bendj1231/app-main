'use client';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MeshGradient } from '@paper-design/shaders-react';
import { useAuth } from '@/contexts/AuthContext';

interface EmailSignupConfirmPageProps {
  onNavigate?: (page: string) => void;
}

export const EmailSignupConfirmPage: React.FC<EmailSignupConfirmPageProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { sendOtp } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');

    try {
      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/become-member?setup=1` : undefined;
      await sendOtp(email.trim(), redirectTo);
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send confirmation email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        position: 'relative',
        overflow: 'hidden',
        padding: '24px',
      }}
    >
      <style>{`
        @keyframes glassMaterialize {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(20px);
            filter: blur(12px);
          }
          60% {
            opacity: 1;
            transform: scale(1.01) translateY(-2px);
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0px);
          }
        }
      `}</style>

      {/* Shader background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <MeshGradient
          className="w-full h-full"
          colors={[
            '#dbeafe',
            '#94a3b8',
            '#64748b',
            '#475569',
            '#334155',
            '#1e3a5f',
            '#1e3a8a',
            '#0f172a',
          ]}
          speed={0.22}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(100,116,139,0.2), rgba(15,23,42,0.35), rgba(2,6,23,0.6))',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backdropFilter: 'blur(3px)',
            background: 'rgba(15,23,42,0.1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
          }}
        />
      </div>

      {/* Card */}
      <div
        style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 16,
          padding: '32px 28px',
          width: '100%',
          maxWidth: 420,
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 8px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
          position: 'relative',
          zIndex: 1,
          animation: 'glassMaterialize 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        }}
      >
        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 6,
              padding: '10px 14px',
              marginBottom: 16,
              color: '#dc2626',
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, color: '#ffffff' }}>
            Confirm your email
          </div>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, margin: 0 }}>
            Enter your email to receive a confirmation link
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.85)',
                  marginBottom: 6,
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Pilot@pilotrecognition.com"
                required
                autoComplete="email"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 6,
                  fontSize: 14,
                  color: '#ffffff',
                  background: 'rgba(255,255,255,0.08)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              style={{
                width: '100%',
                padding: '11px',
                background: loading || !email.trim() ? '#fca5a5' : '#dc2626',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
                cursor: loading || !email.trim() ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
                marginTop: 4,
              }}
            >
              {loading ? 'Sending...' : 'Send Confirmation Link →'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: 600, marginBottom: 8 }}>
              Check your email
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
              We sent a confirmation link to <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{email}</strong>.<br />
              Click the link to continue your sign-up.
            </p>
          </div>
        )}
      </div>

      {/* Back link */}
      <button
        onClick={() => navigate('/become-member')}
        style={{
          marginTop: 24,
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.4)',
          fontSize: 13,
          cursor: 'pointer',
          zIndex: 1,
          position: 'relative',
        }}
      >
        ← Back to Sign Up
      </button>
    </div>
  );
};

export default EmailSignupConfirmPage;
