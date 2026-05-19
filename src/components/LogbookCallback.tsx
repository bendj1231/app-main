import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';

export const LogbookCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [totalHours, setTotalHours] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

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

    const redirectUri = `${window.location.origin}/auth/logbook/callback`;

    const exchange = async () => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke('mfb-token-exchange', {
          body: { code, redirect_uri: redirectUri },
        });

        if (fnError || !data) throw fnError ?? new Error('No data returned');

        const hours = data.totalHours;
        setTotalHours(hours);
        setStatus('success');

        // Store in sessionStorage so BecomeMemberPage can read it
        if (hours !== null) {
          sessionStorage.setItem('mfb_total_hours', String(hours));
          sessionStorage.setItem('mfb_provider', 'MyFlightBook');
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
