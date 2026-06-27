import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { api } from '@/lib/d1-api';

export const RecognitionProfileCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const doCreate = async () => {
    try {
      const raw = sessionStorage.getItem('pr_profile_payload');
      if (!raw) {
        setStatus('error');
        setErrorMsg('Profile data is missing. Please go back and try again.');
        return;
      }
      const payload = JSON.parse(raw);
      const token = await getAccessTokenSilently();
      await api(token, 'upsertProfile', payload);
      sessionStorage.removeItem('pr_profile_payload');
      setStatus('success');
      setTimeout(() => {
        navigate('/platform');
      }, 800);
    } catch (err: any) {
      console.error('[RecognitionProfileCreate] Error:', err);
      setStatus('error');
      setErrorMsg(err?.message || 'Failed to create profile. Please try again.');
    }
  };

  useEffect(() => {
    doCreate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0f172a',
        padding: '24px',
        gap: '24px',
      }}
    >
      {/* Logo lockup */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '28px' }}>✈️</span>
        <h1 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#ffffff', margin: 0 }}>
          <span style={{ color: '#ffffff' }}>PILOT</span>
          <span style={{ color: '#ef4444' }}>RECOGNITION</span>
        </h1>
      </div>

      {status === 'loading' && (
        <>
          <div
            style={{
              width: 56,
              height: 56,
              border: '4px solid rgba(255,255,255,0.1)',
              borderTopColor: '#00b4d8',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', margin: 0, fontWeight: 500, textAlign: 'center' }}>
            Creating your recognition profile…
          </p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', margin: 0, textAlign: 'center', maxWidth: 320, lineHeight: 1.5 }}>
            This may take a few seconds while we provision your secure credentials and sync with the verification network.
          </p>
        </>
      )}

      {status === 'success' && (
        <>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(34,197,94,0.12)',
              border: '2px solid rgba(34,197,94,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}
          >
            ✓
          </div>
          <p style={{ fontSize: '14px', color: '#22c55e', margin: 0, fontWeight: 600, textAlign: 'center' }}>
            Profile created successfully
          </p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', margin: 0, textAlign: 'center' }}>
            Redirecting to your platform…
          </p>
        </>
      )}

      {status === 'error' && (
        <>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(239,68,68,0.12)',
              border: '2px solid rgba(239,68,68,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}
          >
            ⚠️
          </div>
          <p style={{ fontSize: '14px', color: '#ef4444', margin: 0, fontWeight: 600, textAlign: 'center', maxWidth: 360 }}>
            {errorMsg}
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => {
                setStatus('loading');
                doCreate();
              }}
              style={{
                padding: '8px 18px',
                background: 'rgba(0,180,216,0.12)',
                border: '1px solid rgba(0,180,216,0.3)',
                borderRadius: '8px',
                color: '#00b4d8',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => navigate('/become-member')}
              style={{
                padding: '8px 18px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Go Back
            </button>
          </div>
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
