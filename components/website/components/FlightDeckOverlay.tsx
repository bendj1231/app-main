import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { SafeMeshGradient } from '@/components/ui/SafeMeshGradient';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface FlightDeckOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  onBecomeMemberOpen?: () => void;
}

export const FlightDeckOverlay: React.FC<FlightDeckOverlayProps> = ({ isOpen, onClose, onNavigate, onBecomeMemberOpen }) => {
  const navigate = useNavigate();
  const { loginWithRedirect } = useAuth0();
  const { currentUser, oauthAccountCheck, resetOauthAccountCheck } = useAuth();

  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState('');

  // Close on ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setOtpLoading(true);
    setError('');
    try {
      console.log('[FlightDeckOverlay] initiating loginWithRedirect');
      await loginWithRedirect();
      setOtpSent(true);
      startResendTimer();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send code. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    console.log('[FlightDeckOverlay] initiating Google loginWithRedirect');
    await loginWithRedirect({ authorizationParams: { connection: 'google-oauth2' } });
  };

  const handleYahooLogin = async () => {
    setError('');
    console.log('[FlightDeckOverlay] initiating Yahoo loginWithRedirect');
    await loginWithRedirect({ authorizationParams: { connection: 'yahoo' } });
  };

  const handleOutlookLogin = async () => {
    setError('');
    console.log('[FlightDeckOverlay] initiating Outlook loginWithRedirect');
    await loginWithRedirect({ authorizationParams: { connection: 'windowslive' } });
  };

  const googleBtnDisabled = false;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            overflow: 'hidden',
          }}
        >
          <style>{`
            @keyframes glassMaterialize {
              0% { opacity: 0; transform: scale(0.92) translateY(20px); filter: blur(12px); }
              60% { opacity: 1; transform: scale(1.01) translateY(-2px); filter: blur(2px); }
              100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
            }
            @keyframes borderGlow {
              0% { box-shadow: 0 0 0 rgba(255,255,255,0), inset 0 1px 0 rgba(255,255,255,0); border-color: rgba(255,255,255,0.05); }
              100% { box-shadow: 0 8px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.15); }
            }
            @keyframes contentDematerialize {
              0% { opacity: 1; transform: scale(1); filter: blur(0px); }
              100% { opacity: 0; transform: scale(0.96); filter: blur(8px); }
            }
          `}</style>

          {/* Animated mesh gradient background */}
          <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
            <div style={{ position: 'absolute', inset: 0, background: '#0f172a' }} />
            <SafeMeshGradient
              className="w-full h-full"
              colors={[
                '#dbeafe', '#94a3b8', '#64748b', '#475569',
                '#334155', '#1e3a5f', '#1e3a8a', '#0f172a',
              ]}
              speed={0.4}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(100,116,139,0.2), rgba(15,23,42,0.35), rgba(2,6,23,0.6))' }} />
            <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(3px)', background: 'rgba(15,23,42,0.1)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 20%, transparent 40%, rgba(0,0,0,0.5) 100%)' }} />
          </div>

          {/* Close button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              zIndex: 10,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.8)',
              fontSize: 20,
              backdropFilter: 'blur(10px)',
            }}
            whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.2)' }}
            whileTap={{ scale: 0.95 }}
          >
            &#x2715;
          </motion.button>

          {/* Logo + title */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              textAlign: 'center',
              marginBottom: 32,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6 }}>
              <span style={{ color: '#ffffff' }}>pilot</span>
              <span style={{ color: '#ef4444' }}>recognition</span>
              <span style={{ color: '#ffffff' }}>.com</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, margin: 0, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500 }}>
              Flight Deck
            </p>
          </motion.div>

          {/* Glassy card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, filter: 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
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
            }}
          >
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '10px 14px', marginBottom: 16, color: '#dc2626', fontSize: 13 }}>
                {error}
              </div>
            )}

            {/* Email OTP form */}
            <form onSubmit={otpSent ? handleSendOtp : handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 6 }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Pilot@pilotrecognition.com"
                  required
                  autoComplete="email"
                  disabled={otpSent}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 6,
                    fontSize: 14,
                    color: '#ffffff',
                    background: otpSent ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: otpSent ? 'not-allowed' : 'text',
                  }}
                />
              </div>

              {otpSent && (
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 600, marginBottom: 8 }}>
                    Check your email
                  </p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
                    We sent a magic link to <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{email}</strong>.<br />
                    Click the link in your inbox to sign in.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={otpSent ? true : otpLoading || !email.trim()}
                style={{
                  width: '100%',
                  padding: '11px',
                  background: (otpSent ? true : otpLoading || !email.trim()) ? '#fca5a5' : '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: (otpSent ? true : otpLoading || !email.trim()) ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s',
                  marginTop: 4,
                }}
              >
                {otpSent ? 'Magic Link Sent ✓' : otpLoading ? 'Sending magic link...' : 'Send Magic Link →'}
              </button>

              {otpSent && resendTimer > 0 && (
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
                  Resend link in {resendTimer}s
                </p>
              )}

              {otpSent && resendTimer === 0 && (
                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setError(''); }}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0, textAlign: 'center' }}
                >
                  Use a different email
                </button>
              )}
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0 18px' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1, position: 'relative', top: 0 }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }} />
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleLogin}
              disabled={googleBtnDisabled}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: googleBtnDisabled ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.9)',
                cursor: googleBtnDisabled ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                marginBottom: 10,
              }}
              onMouseEnter={(e) => { if (!googleBtnDisabled) e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; }}
              onMouseLeave={(e) => { if (!googleBtnDisabled) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" />
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" />
                <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" />
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" />
              </svg>
              Continue with Google
            </button>

            {/* Yahoo Sign In */}
            <button
              onClick={handleYahooLogin}
              disabled={googleBtnDisabled}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: googleBtnDisabled ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.9)',
                cursor: googleBtnDisabled ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                marginBottom: 10,
              }}
              onMouseEnter={(e) => { if (!googleBtnDisabled) e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; }}
              onMouseLeave={(e) => { if (!googleBtnDisabled) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12.03 2C6.5 2 2 6.5 2 12s4.5 10 10.03 10C17.5 22 22 17.5 22 12S17.5 2 12.03 2zm4.2 15.5h-2.3l-1.8-3.2-1.8 3.2H7.8l2.8-4.7-2.6-4.6h2.3l1.6 2.9 1.6-2.9h2.3l-2.6 4.6 2.6 4.7z" fill="#6001D2"/>
              </svg>
              Continue with Yahoo
            </button>

            {/* Outlook Sign In */}
            <button
              onClick={handleOutlookLogin}
              disabled={googleBtnDisabled}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: googleBtnDisabled ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.9)',
                cursor: googleBtnDisabled ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                marginBottom: 10,
              }}
              onMouseEnter={(e) => { if (!googleBtnDisabled) e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; }}
              onMouseLeave={(e) => { if (!googleBtnDisabled) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            >
              <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
                <path d="M10.5 0L0 5.8v9.4l10.5 5.8 10.5-5.8V5.8L10.5 0z" fill="#0078D4"/>
                <path d="M10.5 1.2L1.3 6.3v8.4l9.2 5.1 9.2-5.1V6.3L10.5 1.2z" fill="#fff"/>
                <path d="M10.5 2.3L2.5 6.8v7.4l8 4.4 8-4.4V6.8l-8-4.5z" fill="#0078D4"/>
                <path d="M10.5 3.4L3.7 7.2v6.6l6.8 3.8 6.8-3.8V7.2l-6.8-3.8z" fill="#fff"/>
                <path d="M10.5 4.5L4.9 7.6v5.8l5.6 3.1 5.6-3.1V7.6l-5.6-3.1z" fill="#0078D4"/>
              </svg>
              Continue with Outlook
            </button>

            {/* Sign up link */}
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                Don't have an account?{' '}
                <button
                  onClick={() => { onClose(); onBecomeMemberOpen ? onBecomeMemberOpen() : onNavigate('become-member'); }}
                  style={{ background: 'none', border: 'none', color: '#ffffff', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: 13 }}
                >
                  Sign up
                </button>
              </p>
            </div>

            {/* Legal links */}
            <div style={{ marginTop: 18, textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
              <button onClick={() => { onClose(); onNavigate('terms'); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', fontSize: 12, cursor: 'pointer', padding: 0 }}>
                Terms of Service
              </button>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>|</span>
              <button onClick={() => { onClose(); onNavigate('privacy'); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', fontSize: 12, cursor: 'pointer', padding: 0 }}>
                Privacy Policy
              </button>
            </div>
          </motion.div>

          {/* Back link */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            onClick={onClose}
            style={{
              marginTop: 28,
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.75)',
              fontSize: 14,
              cursor: 'pointer',
              zIndex: 1,
              position: 'relative',
            }}
          >
            &#x2190; Back to Home
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FlightDeckOverlay;
