import React, { useEffect, useState } from 'react';
import { safeRedirect } from '@/src/lib/url-validator';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/src/lib/d1-api';

/** Cache profile data in sessionStorage to reduce API calls */
function getCachedProfile(auth0Id: string): { display_name?: string | null; id?: string } | null {
  try {
    const cached = sessionStorage.getItem(`profile_cache:${auth0Id}`);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.ts > 30_000) return null; // 30 second TTL
    return parsed.data;
  } catch {
    return null;
  }
}

function setCachedProfile(auth0Id: string, data: unknown): void {
  try {
    sessionStorage.setItem(`profile_cache:${auth0Id}`, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // Ignore quota errors
  }
}

export const OAuthCallback = () => {
  const { isLoading, isAuthenticated, user, error, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [profileCreated, setProfileCreated] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user || profileCreated) return;

    // Safety timeout — never get stuck longer than 35s
    const timeout = setTimeout(() => {
      console.warn('[OAuthCallback] Timeout — forcing navigation');
      setProfileCreated(true);
      navigate('/become-member?setup=1', { replace: true });
    }, 35000);

    const handleAuthCallback = async () => {
      try {
        // Debug trace
        try {
          const dbg = JSON.parse(sessionStorage.getItem('oauth_debug_log') || '[]');
          dbg.push({ ts: Date.now(), step: 'oauth_callback_start', auth0Sub: user?.sub || null, email: user?.email || null });
          sessionStorage.setItem('oauth_debug_log', JSON.stringify(dbg.slice(-50)));
        } catch {}

        const isPilotTerminal = window.location.hostname.includes('pilotterminal');

        // ─── STEP 1: Determine redirect from returnTo or default ───
        const returnTo = sessionStorage.getItem('auth0_return_to');
        console.log('[OAuthCallback] returnTo from sessionStorage:', returnTo);
        if (returnTo) {
          sessionStorage.removeItem('auth0_return_to');
          setProfileCreated(true);
          console.log('[OAuthCallback] Redirecting to returnTo:', returnTo);
          navigate(returnTo, { replace: true });
          return;
        }

        // ─── STEP 2: If no returnTo, route based on profile existence ───
        setProfileCreated(true);
        let target = '/become-member?setup=1';
        try {
          const token = await getAccessTokenSilently();
          if (token && user?.sub) {
            const cached = getCachedProfile(user.sub);
            if (cached?.id) {
              target = '/platform';
              console.log('[OAuthCallback] Cached profile found — redirecting to /platform');
            } else {
              const profile = await api(token, 'getProfile', { auth0_id: user.sub, email: user.email });
              if (profile && (profile as any)?.id) {
                setCachedProfile(user.sub, profile);
                target = '/platform';
                console.log('[OAuthCallback] Profile found — redirecting to /platform');
              }
            }
          }
        } catch (profileErr) {
          console.warn('[OAuthCallback] Could not check profile, defaulting to onboarding:', profileErr);
        }

        if (isPilotTerminal && target !== '/platform') {
          target = '/';
        }
        console.log('[OAuthCallback] No returnTo, redirect to:', target);
        navigate(target, { replace: true });
      } catch (err) {
        console.error('Unexpected OAuth callback error:', err);
        navigate('/');
      }
    };

    handleAuthCallback();

    return () => clearTimeout(timeout);
  }, [isAuthenticated, user, profileCreated, navigate]);

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#dc2626' }}>Authentication Error</h2>
          <p style={{ color: '#64748b' }}>{error.message}</p>
          <button onClick={() => safeRedirect('/')} style={{ marginTop: '16px', padding: '8px 16px' }}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#f8fafc'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #3b82f6',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>
          {isLoading ? 'Processing Authentication...' : 'Setting up your profile...'}
        </h2>
        <p style={{ color: '#64748b' }}>Please wait while we complete your sign-in...</p>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
