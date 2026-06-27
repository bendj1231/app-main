import React, { useState } from 'react';
import { supabase } from '@/lib/shared/supabase';

interface PasskeyGateProps {
  onAuthenticated: (userId: string) => void;
  onCancel: () => void;
}

type Step = 'choose' | 'passkey' | 'google' | 'error';

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

export const PasskeyGate: React.FC<PasskeyGateProps> = ({ onAuthenticated, onCancel }) => {
  const [step, setStep] = useState<Step>('choose');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePasskey = async () => {
    setStep('passkey');
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Get challenge from edge function
      const { data: { session } } = await supabase.auth.getSession();
      const challengeRes = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/passkey-generate-challenge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!challengeRes.ok) throw new Error('Failed to generate challenge');
      const { challenge, allowCredentials } = await challengeRes.json();

      // 2. WebAuthn get credential
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: base64urlDecode(challenge),
          allowCredentials: (allowCredentials || []).map((c: any) => ({
            id: base64urlDecode(c.id),
            type: 'public-key',
            transports: c.transports,
          })),
          userVerification: 'required',
          timeout: 60000,
        },
      }) as PublicKeyCredential;

      const response = assertion.response as AuthenticatorAssertionResponse;

      // 3. Verify with edge function
      const verifyRes = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/passkey-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          credentialId: bufferToBase64url(assertion.rawId),
          authenticatorData: bufferToBase64url(response.authenticatorData),
          clientDataJSON: bufferToBase64url(response.clientDataJSON),
          signature: bufferToBase64url(response.signature),
          userHandle: response.userHandle ? bufferToBase64url(response.userHandle) : null,
        }),
      });

      if (!verifyRes.ok) throw new Error('Passkey verification failed');
      const { userId } = await verifyRes.json();
      onAuthenticated(userId);
    } catch (err: any) {
      if (err?.name === 'NotAllowedError') {
        setErrorMsg('Passkey cancelled or not available on this device.');
      } else {
        setErrorMsg(err?.message || 'Passkey authentication failed.');
      }
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setStep('google');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/wallet/manage`,
          queryParams: { prompt: 'select_account' },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google sign-in failed.');
      setStep('error');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420, background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
        {/* Red top bar */}
        <div style={{ height: 5, background: 'linear-gradient(90deg, #dc2626, #ef4444)' }} />

        <div style={{ padding: '32px 32px 28px' }}>
          {/* Icon */}
          <div style={{ width: 52, height: 52, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>

          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: '#dc2626', textTransform: 'uppercase', margin: '0 0 6px' }}>
            Wallet Authentication
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Verify it's you
          </h1>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 28px', lineHeight: 1.6 }}>
            Your wallet is protected. Use your passkey or Google account to unlock editing.
          </p>

          {/* Error state */}
          {step === 'error' && (
            <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: '#991b1b', margin: 0, fontWeight: 600 }}>{errorMsg}</p>
            </div>
          )}

          {/* Auth options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Passkey */}
            <button
              onClick={handlePasskey}
              disabled={loading}
              style={{ width: '100%', padding: '13px 16px', background: '#0f172a', color: 'white', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: loading && step === 'passkey' ? 0.7 : 1, transition: 'background 0.15s' }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#1e293b'; }}
              onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#0f172a'; }}
            >
              {loading && step === 'passkey'
                ? <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
              }
              Use Passkey / Biometrics
            </button>

            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={loading}
              style={{ width: '100%', padding: '13px 16px', background: 'white', color: '#0f172a', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: loading && step === 'google' ? 0.7 : 1, transition: 'border-color 0.15s' }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.borderColor = '#94a3b8'; }}
              onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0'; }}
            >
              {loading && step === 'google'
                ? <div style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.1)', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              }
              Continue with Google
            </button>
          </div>

          {/* Cancel */}
          <button
            onClick={onCancel}
            style={{ width: '100%', marginTop: 14, padding: '10px', background: 'transparent', color: '#94a3b8', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.05em' }}
          >
            Back to public view
          </button>

          <p style={{ textAlign: 'center', fontSize: 10, color: '#cbd5e1', margin: '14px 0 0', lineHeight: 1.5 }}>
            Your passkey is stored in Google Password Manager or iCloud Keychain.<br/>
            We never see or store your private key.
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
