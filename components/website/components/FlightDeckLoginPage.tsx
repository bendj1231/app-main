import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MeshGradient } from '@paper-design/shaders-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/src/lib/supabase';

interface FlightDeckLoginPageProps {
  onNavigate: (page: string) => void;
}

export const FlightDeckLoginPage: React.FC<FlightDeckLoginPageProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, currentUser, oauthAccountCheck, resetOauthAccountCheck } = useAuth();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [checkingOAuth, setCheckingOAuth] = useState(false);
  const [checkingAccount, setCheckingAccount] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper: check if a profile row exists for a given user id
  const profileExists = async (userId: string): Promise<boolean> => {
    const { data } = await supabase.from('profiles').select('id').eq('id', userId).maybeSingle();
    return !!data;
  };

  // Watch currentUser and verify they have a valid profile row in the database.
  // If they logged in via Google OAuth but have no profile row, sign out silently
  // and redirect to /become-member?setup=1 so they can register.
  useEffect(() => {
    if (!currentUser || oauthAccountCheck.checking || oauthAccountCheck.hasAccount !== null) return;

    let active = true;
    const verifyUserAccount = async () => {
      setCheckingOAuth(true);
      const hasProfile = await profileExists(currentUser.id);
      if (!active) return;

      if (hasProfile) {
        setCheckingOAuth(false);
        navigate('/platform', { replace: true });
      } else {
        await supabase.auth.signOut();
        setCheckingOAuth(false);
        navigate('/become-member?setup=1', { replace: true });
      }
    };

    verifyUserAccount();
    return () => {
      active = false;
    };
  }, [currentUser, oauthAccountCheck.checking, oauthAccountCheck.hasAccount, navigate]);

  useEffect(() => {
    if (oauthAccountCheck.checking || oauthAccountCheck.hasAccount === null) return;

    const handleOAuthResult = async () => {
      if (oauthAccountCheck.hasAccount) {
        resetOauthAccountCheck();
        navigate('/platform', { replace: true });
      } else {
        await supabase.auth.signOut();
        resetOauthAccountCheck();
        navigate('/become-member?setup=1', { replace: true });
      }
    };

    handleOAuthResult();
  }, [oauthAccountCheck, navigate, resetOauthAccountCheck]);

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
      await sendOtp(email.trim());
      setOtpSent(true);
      startResendTimer();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send code. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !otp.trim()) return;
    setVerifyLoading(true);
    setCheckingAccount(true);
    setError('');

    try {
      await verifyOtp(email.trim(), otp.trim());

      // After verifyOtp, currentUser is set by AuthContext.
      // Check if profile exists — if not, send to become-member.
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

      if (profile) {
        navigate('/platform');
      } else {
        onNavigate('become-member');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid code. Please try again.');
    } finally {
      setVerifyLoading(false);
      setCheckingAccount(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/flight-deck-login`,
      },
    });

    if (error) {
      setError(error.message || 'Google sign-in failed');
      setGoogleLoading(false);
    }
  };

  const oauthInProgress = googleLoading || checkingOAuth || oauthAccountCheck.checking || checkingAccount;
  const oauthStatusText = googleLoading
    ? 'Redirecting to Google for sign in…'
    : checkingAccount
    ? 'Checking if account exists…'
    : oauthAccountCheck.checking
    ? 'Checking your Supabase account…'
    : 'Verifying account credentials...';

  if (oauthInProgress) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          background: '#0f172a',
          color: 'rgba(255,255,255,0.8)',
          fontSize: 16,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: '3px solid rgba(255,255,255,0.1)',
              borderTop: '3px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          {oauthStatusText}
          <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
        </div>
      </div>
    );
  }

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
        @keyframes borderGlow {
          0% {
            box-shadow: 0 0 0 rgba(255,255,255,0), inset 0 1px 0 rgba(255,255,255,0);
            border-color: rgba(255,255,255,0.05);
          }
          100% {
            box-shadow: 0 8px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
            border-color: rgba(255,255,255,0.15);
          }
        }
      `}</style>

      {/* Animated mesh gradient background */}
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
          speed={0.4}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(100,116,139,0.2), rgba(15,23,42,0.35), rgba(2,6,23,0.6))',
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

      {/* Logo + title */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: 32,
          position: 'relative',
          zIndex: 1,
          animation: 'glassMaterialize 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6 }}>
          <span style={{ color: '#ffffff' }}>pilot</span>
          <span style={{ color: '#ef4444' }}>recognition</span>
          <span style={{ color: '#ffffff' }}>.com</span>
        </div>
        <p
          style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: 14,
            margin: 0,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          Flight Deck
        </p>
      </div>

      {/* Glassy card */}
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
          animation: 'glassMaterialize 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards, borderGlow 1.2s ease-out 0.3s forwards',
          opacity: 0,
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

        {/* Email OTP form */}
        <form
          onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
          style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
        >
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
            {otpSent
              ? 'Magic Link Sent ✓'
              : otpLoading
                ? 'Sending magic link...'
                : 'Send Magic Link →'}
          </button>

          {otpSent && resendTimer > 0 && (
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
              Resend link in {resendTimer}s
            </p>
          )}

          {otpSent && resendTimer === 0 && (
            <button
              type="button"
              onClick={() => { setOtpSent(false); setOtp(''); setError(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
                textAlign: 'center',
              }}
            >
              Use a different email
            </button>
          )}
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 16px' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }} />
        </div>

        {/* Google Sign In — via Supabase OAuth */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading || checkingOAuth || oauthAccountCheck.checking}
          style={{
            width: '100%',
            padding: '10px 14px',
            background: googleLoading || checkingOAuth || oauthAccountCheck.checking ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.9)',
            cursor: googleLoading || checkingOAuth || oauthAccountCheck.checking ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 10,
          }}
          onMouseEnter={(e) => {
            if (!googleLoading && !checkingOAuth && !oauthAccountCheck.checking) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
            }
          }}
          onMouseLeave={(e) => {
            if (!googleLoading && !checkingOAuth && !oauthAccountCheck.checking) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
            />
            <path
              fill="#FBBC05"
              d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Sign up + Forgot password links */}
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 8px' }}>
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('become-member')}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
                fontSize: 13,
              }}
            >
              Sign up
            </button>
          </p>
          <button
            onClick={() => onNavigate('forgot-password')}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.35)',
              fontWeight: 400,
              cursor: 'pointer',
              padding: 0,
              fontSize: 12,
            }}
          >
            Forgot password?
          </button>
        </div>
      </div>

      {/* Back link */}
      <button
        onClick={() => navigate('/')}
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
        ← Back to Home
      </button>
    </div>
  );
};

export default FlightDeckLoginPage;
