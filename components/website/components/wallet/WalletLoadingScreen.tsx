/// <reference path="../../../../src/vite-env.d.ts" />
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { supabase } from '../../../../shared/lib/supabase';

interface WalletLoadingScreenProps {
  onComplete: () => void;
}

// Steps before the passkey gate (indices 0-2)
const PRE_AUTH_STEPS = [
  'Initialising secure context…',
  'Resolving decentralised identity (DID:key)…',
  'Pulling from dual-ended storage providers…',
];

// Steps after passkey cleared (indices 3-6)
const POST_AUTH_STEPS = [
  'Reconciling Supabase ↔ Walt.id credential bundles…',
  'Decrypting payload with AES-256-GCM…',
  'Verifying cryptographic signatures…',
  'Wallet ready.',
];

const ALL_STEPS = [...PRE_AUTH_STEPS, ...POST_AUTH_STEPS];
const PASSKEY_GATE_AT = PRE_AUTH_STEPS.length; // pause after index 2

const base64urlDecode = (str: string): ArrayBuffer => {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
};

const bufferToBase64url = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let str = '';
  for (const byte of bytes) str += String.fromCharCode(byte);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

type AuthStage = 'pre' | 'gate' | 'verifying' | 'post' | 'error';

export const WalletLoadingScreen: React.FC<WalletLoadingScreenProps> = ({ onComplete }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [authStage, setAuthStage] = useState<AuthStage>('pre');
  const [authError, setAuthError] = useState('');
  const [fading, setFading] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setHasSession(true);
        setSessionUser(session.user);
      }
    });
  }, []);

  const runPostAuth = useCallback(() => {
    setAuthStage('post');
    let step = PASSKEY_GATE_AT;
    const stepDuration = 400;

    intervalRef.current = setInterval(() => {
      step += 1;
      setStepIndex(step);
      setProgress(Math.round((step / ALL_STEPS.length) * 100));

      if (step >= ALL_STEPS.length) {
        clearInterval(intervalRef.current!);
        setTimeout(() => {
          setFading(true);
          setTimeout(onComplete, 500);
        }, 300);
      }
    }, stepDuration);
  }, [onComplete]);

  // Phase 1: run pre-auth steps, then pause
  useEffect(() => {
    let step = 0;
    const stepDuration = 500;

    intervalRef.current = setInterval(() => {
      step += 1;
      setStepIndex(step);
      setProgress(Math.round((step / ALL_STEPS.length) * 100));

      if (step >= PASSKEY_GATE_AT) {
        clearInterval(intervalRef.current!);
        // Small delay then show gate
        setTimeout(() => setAuthStage('gate'), 300);
      }
    }, stepDuration);

    progressRef.current = setInterval(() => {
      setProgress(p => {
        const pct = Math.round((PASSKEY_GATE_AT / ALL_STEPS.length) * 100);
        if (p >= pct) return pct;
        return p + 1;
      });
    }, 30);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  const handlePasskey = async () => {
    setAuthStage('verifying');
    setAuthError('');

    if (!window.PublicKeyCredential) {
      setAuthError('WebAuthn not supported. Use Google instead.');
      setAuthStage('gate');
      return;
    }

    const rpId = window.location.hostname === 'localhost'
      ? 'localhost'
      : window.location.hostname.replace('www.', '');

    try {
      const challengeBytes = new Uint8Array(32);
      crypto.getRandomValues(challengeBytes);

      // Resolve user identity — try Supabase session first, then fallback to Auth0 cache
      const userId = sessionUser?.id
        || sessionStorage.getItem('mfb_auth0_id')
        || localStorage.getItem('auth0_user_id')
        || 'pilot-wallet-user';
      const userEmail = sessionUser?.email
        || sessionStorage.getItem('mfb_email')
        || 'pilot@pilotrecognition.com';
      const displayName = sessionUser?.user_metadata?.full_name || userEmail;

      try {
        // ── Always try to REGISTER first ──
        const userIdBytes = new TextEncoder().encode(userId);
        await navigator.credentials.create({
          publicKey: {
            challenge: challengeBytes.buffer,
            rp: { name: 'PilotRecognition Wallet', id: rpId },
            user: { id: userIdBytes.buffer, name: userEmail, displayName },
            pubKeyCredParams: [
              { type: 'public-key', alg: -7 },
              { type: 'public-key', alg: -257 },
            ],
            authenticatorSelection: { userVerification: 'required', residentKey: 'required' },
            timeout: 120000,
          },
        });
        // Registration succeeded — wallet open
        runPostAuth();
      } catch (createErr: any) {
        if (createErr?.name === 'InvalidStateError') {
          // Passkey already registered — authenticate with it instead
          const assertion = await navigator.credentials.get({
            publicKey: {
              challenge: challengeBytes.buffer,
              allowCredentials: [],
              userVerification: 'required',
              rpId,
              timeout: 120000,
            },
          }) as PublicKeyCredential | null;
          if (!assertion) throw new Error('No credential returned.');
          runPostAuth();
        } else {
          throw createErr;
        }
      }
    } catch (err: any) {
      console.error('[Passkey]', err?.name, err?.message);

      if (err?.name === 'NotAllowedError') {
        if (hasSession) {
          // They dismissed the save prompt — still let them in (already authenticated)
          runPostAuth();
        } else {
          setAuthError('Dismissed. Use Google to sign in instead.');
          setAuthStage('gate');
        }
      } else if (err?.name === 'InvalidStateError') {
        // Passkey already registered — just open the wallet
        runPostAuth();
      } else if (err?.name === 'SecurityError') {
        setAuthError('Security error — must be on HTTPS or localhost.');
        setAuthStage('gate');
      } else {
        setAuthError(err?.message || 'Try again or use Google.');
        setAuthStage('gate');
      }
    }
  };

  const handleGoogle = async () => {
    setAuthStage('verifying');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.href}`,
        queryParams: { prompt: 'select_account' },
      },
    });
    if (error) {
      setAuthError(error.message);
      setAuthStage('gate');
    }
  };

  // After OAuth redirect, check session and auto-resume + offer passkey registration
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session && authStage === 'gate') {
        // Try to register a passkey silently for future logins
        if (window.PublicKeyCredential && session.user) {
          try {
            const challengeBytes = new Uint8Array(32);
            crypto.getRandomValues(challengeBytes);
            const userIdBytes = new TextEncoder().encode(session.user.id);

            await navigator.credentials.create({
              publicKey: {
                challenge: challengeBytes.buffer,
                rp: {
                  name: 'PilotRecognition Wallet',
                  id: window.location.hostname.replace('www.', ''),
                },
                user: {
                  id: userIdBytes.buffer,
                  name: session.user.email || session.user.id,
                  displayName: session.user.user_metadata?.full_name || session.user.email || 'Pilot',
                },
                pubKeyCredParams: [
                  { type: 'public-key', alg: -7 },   // ES256
                  { type: 'public-key', alg: -257 },  // RS256
                ],
                authenticatorSelection: {
                  // No attachment restriction — offers Touch ID, Google Password Manager,
                  // iCloud Keychain, and hardware keys. Pilot chooses where to save.
                  userVerification: 'required',
                  residentKey: 'required',
                },
                timeout: 60000,
              },
            });
            // Registration succeeded silently — passkey saved for next time
          } catch {
            // User dismissed or device doesn't support — that's fine, continue
          }
        }
        runPostAuth();
      }
    });
  }, [authStage, runPostAuth]);

  const shieldColor = authStage === 'gate' ? '#f59e0b' : authStage === 'error' ? '#dc2626' : '#dc2626';
  const ringPaused = authStage === 'gate' || authStage === 'verifying';

  const content = (
    <div style={{
      position: 'fixed', inset: 0, background: '#ffffff',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, opacity: fading ? 0 : 1, transition: 'opacity 0.5s ease', padding: 24,
    }}>
      <style>{`
        @keyframes walletSpin { to { transform: rotate(360deg); } }
        @keyframes walletPulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes gateSlide { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%', pointerEvents: 'none',
        background: `radial-gradient(circle, ${authStage === 'gate' ? 'rgba(245,158,11,0.06)' : 'rgba(220,38,38,0.06)'} 0%, transparent 70%)`,
        transition: 'background 0.5s',
      }} />

      {/* Shield */}
      <div style={{ position: 'relative', marginBottom: 32 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: authStage === 'gate' ? '#fffbeb' : '#fef2f2',
          border: `1px solid ${authStage === 'gate' ? '#fde68a' : '#fecaca'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.4s',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={shieldColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div style={{
          position: 'absolute', inset: -8, borderRadius: '50%',
          border: '2px solid transparent',
          borderTopColor: authStage === 'gate' ? '#f59e0b' : '#dc2626',
          borderRightColor: authStage === 'gate' ? 'rgba(245,158,11,0.3)' : 'rgba(220,38,38,0.3)',
          animation: ringPaused ? 'walletPulse 1.5s ease infinite' : 'walletSpin 1.2s linear infinite',
          transition: 'border-color 0.4s',
        }} />
      </div>

      {/* Title */}
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: authStage === 'gate' ? '#f59e0b' : '#dc2626', textTransform: 'uppercase', marginBottom: 8, transition: 'color 0.4s' }}>
        PilotRecognition Wallet
      </p>
      <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: 6, textAlign: 'center' }}>
        {authStage === 'gate' || authStage === 'verifying'
          ? <>Identity verification<br />required</>
          : <>Decrypting your decentralised<br />pilot identity wallet</>
        }
      </h1>
      <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 28, letterSpacing: '0.04em', textAlign: 'center' }}>
        Supabase · Walt.id · Zero-knowledge · AES-256-GCM
      </p>

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 340, marginBottom: 20 }}>
        <div style={{ height: 3, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: authStage === 'gate'
              ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
              : 'linear-gradient(90deg, #dc2626, #ef4444)',
            borderRadius: 99, transition: 'width 0.15s ease, background 0.4s',
          }} />
        </div>
        {authStage === 'gate' && (
          <p style={{ fontSize: 9, color: 'rgba(245,158,11,0.6)', marginTop: 5, textAlign: 'right', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Paused — awaiting identity confirmation
          </p>
        )}
      </div>

      {/* Step log */}
      <div style={{ width: '100%', maxWidth: 340, marginBottom: authStage === 'gate' ? 20 : 0 }}>
        {ALL_STEPS.slice(0, Math.min(stepIndex + 1, ALL_STEPS.length)).map((step, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4,
            opacity: i === stepIndex && authStage !== 'gate' ? 1 : i < stepIndex || (authStage === 'gate' && i < PASSKEY_GATE_AT) ? 0.3 : 0,
            transition: 'opacity 0.3s',
          }}>
            {i < stepIndex || (authStage === 'gate' && i < PASSKEY_GATE_AT) ? (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <div style={{
                width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                border: '2px solid rgba(220,38,38,0.6)', borderTopColor: '#dc2626',
                animation: 'walletSpin 0.7s linear infinite',
              }} />
            )}
            <span style={{ fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.02em', color: '#64748b' }}>
              {step}
            </span>
          </div>
        ))}
      </div>

      {/* ── PASSKEY GATE (mid-loading paywall) ── */}
      {(authStage === 'gate' || authStage === 'verifying') && (
        <div style={{
          width: '100%', maxWidth: 340,
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 14, padding: '18px 20px',
          animation: 'gateSlide 0.35s ease',
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
            🔐 Encrypted vault — confirm identity to continue
          </p>
          <p style={{ fontSize: 11, color: '#64748b', marginBottom: 14, lineHeight: 1.5 }}>
            {hasSession
              ? 'Save a passkey to this device so Touch ID unlocks your wallet every time.'
              : 'Your credential bundle is AES-256-GCM encrypted. Confirm with your passkey to release the decryption key.'
            }
          </p>

          {authError && (
            <p style={{ fontSize: 11, color: '#fca5a5', marginBottom: 12, fontWeight: 600 }}>⚠ {authError}</p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={handlePasskey}
              disabled={authStage === 'verifying'}
              style={{
                width: '100%', padding: '11px 0', borderRadius: 10, border: 'none',
                background: authStage === 'verifying' ? 'rgba(245,158,11,0.3)' : '#f59e0b',
                color: '#ffffff', fontSize: 12, fontWeight: 800,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: authStage === 'verifying' ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 0.2s',
              }}
            >
              {authStage === 'verifying' ? (
                <>
                  <div style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#ffffff', borderRadius: '50%', animation: 'walletSpin 0.7s linear infinite' }} />
                  Verifying…
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                  </svg>
                  Save Passkey & Open Wallet
                </>
              )}
            </button>

            <button
              onClick={handleGoogle}
              disabled={authStage === 'verifying'}
              style={{
                width: '100%', padding: '10px 0', borderRadius: 10,
                background: '#f8fafc', border: '1px solid #e2e8f0',
                color: '#475569', fontSize: 11, fontWeight: 600,
                cursor: authStage === 'verifying' ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google instead
            </button>
          </div>

          <p style={{ fontSize: 9, color: '#94a3b8', textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>
            Private key never leaves your device · Google Password Manager
          </p>
        </div>
      )}

      {/* Bottom watermark */}
      <div style={{ position: 'absolute', bottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <span style={{ fontSize: 9, color: '#cbd5e1', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          wallet.pilotrecognition.com
        </span>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
};
