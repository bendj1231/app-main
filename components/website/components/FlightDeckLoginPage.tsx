import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { MeshGradient } from '@paper-design/shaders-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';

interface FlightDeckLoginPageProps {
  onNavigate: (page: string) => void;
}

export const FlightDeckLoginPage: React.FC<FlightDeckLoginPageProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { loginWithRedirect } = useAuth0();
  const { currentUser, oauthAccountCheck, resetOauthAccountCheck, devLogin } = useAuth();
  const { callApi } = useWorkerAuth();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [checkingOAuth, setCheckingOAuth] = useState(false);
  const [checkingAccount, setCheckingAccount] = useState(false);
  const [error, setError] = useState('');
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = () => {
    // Dev-only easter egg: 5 rapid clicks on the logo logs in a dummy account on localhost.
    if (typeof window === 'undefined') return;
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return;
    }

    logoClickCount.current += 1;
    if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
    logoClickTimer.current = setTimeout(() => {
      logoClickCount.current = 0;
    }, 2000);

    if (logoClickCount.current === 5) {
      logoClickCount.current = 0;
      devLogin().then(() => {
        navigate('/platform', { replace: true });
      });
    }
  };

  // Helper: check if a profile row exists for a given user id (Auth0 sub)
  const profileExists = async (userId: string): Promise<boolean> => {
    const byId = await callApi<Record<string, unknown>[]>('queryTable', {
      table: 'profiles',
      operation: 'select',
      where: { id: userId },
      limit: 1,
    });
    if (byId?.length) return true;
    const byAuth0Id = await callApi<Record<string, unknown>[]>('queryTable', {
      table: 'profiles',
      operation: 'select',
      where: { auth0_id: userId },
      limit: 1,
    });
    return !!byAuth0Id?.length;
  };

  // Watch currentUser and verify they have a valid profile row in the database.
  // If they logged in via Google OAuth but have no profile row, sign out silently
  // and redirect to /become-member?setup=1 so they can register.
  useEffect(() => {
    console.log('[FlightDeckLogin] currentUser effect fired:', { currentUser: currentUser?.id ?? null, checking: oauthAccountCheck.checking, hasAccount: oauthAccountCheck.hasAccount });
    if (!currentUser || oauthAccountCheck.checking || oauthAccountCheck.hasAccount !== null) return;

    let active = true;
    const verifyUserAccount = async () => {
      setCheckingOAuth(true);
      console.log('[FlightDeckLogin] Checking if profile exists for user:', currentUser.id);
      const hasProfile = await profileExists(currentUser.id);
      console.log('[FlightDeckLogin] profileExists result:', hasProfile);
      if (!active) return;

      if (hasProfile) {
        setCheckingOAuth(false);
        console.log('[FlightDeckLogin] Profile found — redirecting to /platform');
        navigate('/platform', { replace: true });
        return;
      } else {
        console.log('[FlightDeckLogin] No profile found — redirecting to /become-member?setup=1 for onboarding');
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
    console.log('[FlightDeckLogin] oauthAccountCheck effect fired:', oauthAccountCheck);
    if (oauthAccountCheck.checking || oauthAccountCheck.hasAccount === null) return;

    const handleOAuthResult = async () => {
      if (oauthAccountCheck.hasAccount) {
        console.log('[FlightDeckLogin] oauthAccountCheck.hasAccount=true — redirecting to /platform');
        navigate('/platform', { replace: true });
        return;
      } else {
        console.log('[FlightDeckLogin] oauthAccountCheck.hasAccount=false — redirecting to /become-member?setup=1 for onboarding');
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
      // Auth0 handles the email/passwordless flow; the callback routes to platform or onboarding.
      console.log('[FlightDeckLogin] initiating OTP loginWithRedirect');
      await loginWithRedirect();
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
      // Auth0 handles verification; the callback routes to platform or onboarding.
      await loginWithRedirect();
      setOtpSent(true);
      startResendTimer();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid code. Please try again.');
    } finally {
      setVerifyLoading(false);
      setCheckingAccount(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    console.log('[FlightDeckLogin] Google sign-in button clicked — using Auth0');

    await loginWithRedirect({
      authorizationParams: {
        connection: 'google-oauth2',
      },
    });
  };

  const handleYahooLogin = async () => {
    setError('');
    console.log('[FlightDeckLogin] Yahoo sign-in button clicked — using Auth0');

    await loginWithRedirect({
      authorizationParams: {
        connection: 'yahoo',
      },
    });
  };

  const handleOutlookLogin = async () => {
    setError('');
    console.log('[FlightDeckLogin] Outlook sign-in button clicked — using Auth0');

    await loginWithRedirect({
      authorizationParams: {
        connection: 'windowslive',
      },
    });
  };

  const googleBtnDisabled = checkingOAuth || oauthAccountCheck.checking;

  const oauthInProgress = checkingOAuth || oauthAccountCheck.checking || checkingAccount;
  const oauthStatusText = checkingAccount
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
            background: 'radial-gradient(ellipse at 30% 20%, transparent 40%, rgba(0,0,0,0.5) 100%)',
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
        <div
          onClick={handleLogoClick}
          style={{
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: '-0.5px',
            marginBottom: 6,
            cursor: 'pointer',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
          title="Localhost dev shortcut: click 5 times to sign in with a dummy account"
        >
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0 18px' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1, position: 'relative', top: 0 }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }} />
        </div>

        {/* Google Sign In — via Supabase OAuth */}
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
          onMouseEnter={(e) => {
            if (!googleBtnDisabled) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
            }
          }}
          onMouseLeave={(e) => {
            if (!googleBtnDisabled) {
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
          onMouseEnter={(e) => {
            if (!googleBtnDisabled) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
            }
          }}
          onMouseLeave={(e) => {
            if (!googleBtnDisabled) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }
          }}
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
          onMouseEnter={(e) => {
            if (!googleBtnDisabled) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
            }
          }}
          onMouseLeave={(e) => {
            if (!googleBtnDisabled) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }
          }}
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
              onClick={() => onNavigate('become-member')}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
                fontSize: 13,
              }}
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Legal links */}
        <div style={{ marginTop: 18, textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => onNavigate('terms')}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', fontSize: 12, cursor: 'pointer', padding: 0 }}
          >
            Terms of Service
          </button>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>|</span>
          <button
            onClick={() => onNavigate('privacy')}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', fontSize: 12, cursor: 'pointer', padding: 0 }}
          >
            Privacy Policy
          </button>
        </div>
      </div>

      {/* Back link */}
      <button
        onClick={() => navigate('/')}
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
        ← Back to Home
      </button>

      {/* Admin portal */}
      <button
        onClick={() => navigate('/admin')}
        style={{
          marginTop: 10,
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.55)',
          fontSize: 12,
          cursor: 'pointer',
          zIndex: 1,
          position: 'relative',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
      >
        Admin Portal
      </button>
    </div>
  );
};

export default FlightDeckLoginPage;
