import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MeshGradient } from '@paper-design/shaders-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/src/lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

function base64urlToBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const binary = atob(padded);
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) buffer[i] = binary.charCodeAt(i);
  return buffer.buffer;
}

function bufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

interface FlightDeckLoginPageProps {
  onNavigate: (page: string) => void;
}

export const FlightDeckLoginPage: React.FC<FlightDeckLoginPageProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { login, currentUser, oauthAccountCheck, resetOauthAccountCheck } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checkingOAuth, setCheckingOAuth] = useState(false);
  const [checkingAccount, setCheckingAccount] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setSubmitting(true);
    setCheckingAccount(true);
    setError('');

    try {
      // 1. Check if pilot has a profile before attempting login
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

      if (!profile) {
        // No account found → send to sign up
        onNavigate('become-member');
        return;
      }

      // 2. Profile exists — attempt Supabase login
      await login(email.trim(), password);
      navigate('/platform');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Incorrect password. Please try again.');
    } finally {
      setSubmitting(false);
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

  const handlePasskeyLogin = async () => {
    const credentialId = localStorage.getItem('pr_passkey_credential_id');
    if (!credentialId) {
      setError('No passkey found on this device. Please log in with email first.');
      return;
    }
    setPasskeyLoading(true);
    setError('');
    try {
      // 1. Get a server-issued challenge from Supabase
      const challengeRes = await fetch(`${SUPABASE_URL}/functions/v1/passkey-challenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY },
        body: JSON.stringify({ credentialId }),
      });
      if (!challengeRes.ok) throw new Error('Could not get challenge');
      const { challenge } = await challengeRes.json();

      // 2. Ask device to sign the challenge
      const assertion = (await navigator.credentials.get({
        publicKey: {
          challenge: base64urlToBuffer(challenge),
          allowCredentials: [{ id: base64urlToBuffer(credentialId), type: 'public-key' }],
          userVerification: 'required',
          timeout: 60000,
        },
      })) as PublicKeyCredential | null;

      if (!assertion) throw new Error('No assertion returned');

      const response = assertion.response as AuthenticatorAssertionResponse;

      // 3. Verify with Supabase edge function
      const verifyRes = await fetch(`${SUPABASE_URL}/functions/v1/passkey-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY },
        body: JSON.stringify({
          credentialId: assertion.id,
          authenticatorData: bufferToBase64url(response.authenticatorData),
          clientDataJSON: bufferToBase64url(response.clientDataJSON),
          signature: bufferToBase64url(response.signature),
          userHandle: response.userHandle ? bufferToBase64url(response.userHandle) : null,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.verified) {
        throw new Error(verifyData.error || 'Passkey verification failed');
      }

      // Verify they have a profile before logging in
      if (verifyData.userId) {
        const hasProfile = await profileExists(verifyData.userId);
        if (!hasProfile) {
          await supabase.auth.signOut();
          onNavigate('become-member');
          return;
        }
      }

      navigate('/platform');
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : 'Passkey sign-in failed. Try email/password instead.';
      if (err instanceof Error && err.name === 'NotAllowedError') {
        setError('Passkey sign-in was cancelled.');
      } else {
        setError(errorMsg);
      }
    } finally {
      setPasskeyLoading(false);
    }
  };

  const hasPasskey = localStorage.getItem('pr_passkey_registered') === 'true';

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
      <div style={{ textAlign: 'center', marginBottom: 32, position: 'relative', zIndex: 1 }}>
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

        {/* Email + Password form */}
        <form
          onSubmit={handleEmailLogin}
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
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '10px 40px 10px 12px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 6,
                  fontSize: 14,
                  color: '#ffffff',
                  background: 'rgba(255,255,255,0.08)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  fontSize: 12,
                  padding: 0,
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !email.trim() || !password.trim()}
            style={{
              width: '100%',
              padding: '11px',
              background: submitting || !email.trim() || !password.trim() ? '#fca5a5' : '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: submitting || !email.trim() || !password.trim() ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
              marginTop: 4,
            }}
          >
            {submitting ? 'Signing in...' : 'Sign In →'}
          </button>
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

        {/* Passkey option — only shown if registered on this device */}
        {hasPasskey && (
          <>
            <button
              onClick={handlePasskeyLogin}
              disabled={passkeyLoading}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.9)',
                cursor: passkeyLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            >
              {/* Apple/Touch ID icon */}
              <svg
                width="16"
                height="20"
                viewBox="0 0 814 1000"
                fill="currentColor"
                style={{ flexShrink: 0 }}
              >
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-42.3-150.3-109.7C55 556.8 17 429.7 17 309.2c0-190.5 123.3-291.5 245.5-291.5 63.2 0 115.9 41.7 155.5 41.7 38.3 0 98.1-44.2 170.7-44.2 26.9 0 109.1 2.6 168.4 87.3zm-180.3-141.9c30.7-36.4 52.4-86.7 52.4-136.7 0-6.8-.6-13.7-1.9-19.2-49.1 1.9-106.9 32.7-141.2 74.1-27.5 31.3-52.4 81.6-52.4 132.3 0 7.4 1.3 14.8 1.9 17.1 3.2.6 8.4 1.3 13.6 1.3 44.2 0 96.2-29.4 127.6-68.9z" />
              </svg>
              {passkeyLoading ? 'Verifying...' : 'Sign in with Passkey (Touch ID)'}
            </button>
          </>
        )}

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
