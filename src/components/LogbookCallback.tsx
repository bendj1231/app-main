import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LogbookCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [totalHours, setTotalHours] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Clear explicit logout flag so Auth0 session restores correctly after MFB redirect
    localStorage.removeItem('explicitLogout');

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

    // Immediately remove code from URL to prevent reuse on refresh
    window.history.replaceState({}, document.title, window.location.pathname);

    if (error) {
      setErrorMsg(error);
      setStatus('error');
      return;
    }

    if (!code) {
      setErrorMsg('No authorization code received.');
      setStatus('error');
      return;
    }

    const redirectUri = window.location.hostname === 'localhost'
      ? `${window.location.origin}/auth/logbook/callback`
      : 'https://pilotrecognition.com/auth/logbook/callback';

    const exchange = async () => {
      try {
        const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MzQxOTEsImV4cCI6MjA4OTExMDE5MX0.m49ula5RMn4uEtRTk6l9q_6VElyPrY1YPMj-gtUYRsY';
        let res: Response;
        try {
          res = await fetch('https://gkbhgrozrzhalnjherfu.supabase.co/functions/v1/mfb-token-exchange', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({
              code,
              redirect_uri: redirectUri,
              auth0_id: localStorage.getItem('auth0_user_id') || undefined,
            }),
          });
        } catch (fetchErr: any) {
          throw new Error(`Network error: ${fetchErr?.message ?? 'fetch failed'}`);
        }

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || `Edge function error ${res.status}`);
        }

        const data = await res.json();
        const hours = data.totalHours;
        setTotalHours(hours);
        setStatus('success');

        // Store in sessionStorage so BecomeMemberPage can read it
        sessionStorage.setItem('mfb_total_hours', String(hours ?? 0));
        sessionStorage.setItem('mfb_provider', 'MyFlightBook');

        // Store VC credential offer URL if issued
        if (data.credential?.offer_url) {
          sessionStorage.setItem('vc_credential_offer_url', data.credential.offer_url);
          sessionStorage.setItem('vc_credential_id', data.credential.id);
        }

        setTimeout(() => navigate('/become-member?setup=1&logbook=synced'), 1500);
      } catch (err: any) {
        setErrorMsg(err?.message ?? 'Token exchange failed');
        setStatus('error');
      }
    };

    exchange();
  }, []);

  if (status === 'error') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f172a' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <h2 style={{ color: '#ef4444', marginBottom: 8 }}>Logbook Sync Failed</h2>
          <p style={{ color: '#94a3b8', marginBottom: 16 }}>{errorMsg}</p>
          <button onClick={() => navigate('/become-member?setup=1')} style={{ padding: '8px 16px', background: '#1e293b', color: 'white', border: '1px solid #334155', borderRadius: 8, cursor: 'pointer' }}>
            Back to Profile Setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f172a' }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{ width: 48, height: 48, border: '4px solid #00b4d8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
        {status === 'processing' && <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Syncing with MyFlightBook...</h2>}
        {status === 'success' && (
          <>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4ade80' }}>Logbook Synced!</h2>
            {totalHours !== null && <p style={{ color: '#94a3b8', marginTop: 8 }}>{Math.floor(totalHours)}h {Math.round((totalHours % 1) * 60)}m total flight time</p>}
          </>
        )}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
};
