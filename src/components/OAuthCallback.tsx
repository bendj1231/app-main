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
  const { isLoading, isAuthenticated, user, error } = useAuth0();
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
        const isCareerPathways = window.location.hostname.includes('pilotcareerpathways') || 
          window.location.hostname.includes('careerpathways') ||
          (window.location.hostname === 'localhost' && new URLSearchParams(window.location.search).get('product') === 'careerpathways');

        // ─── STEP 1: Check cached profile ───
        let existing = getCachedProfile(user.sub);

        if (!existing) {
          // ─── STEP 2: Query profile via Worker API ───
          try {
            const accessToken = sessionStorage.getItem('access_token') || '';
            const rows = await api(accessToken, 'queryTable', {
              table: 'profiles',
              operation: 'select',
              where: { auth0_id: user.sub },
              limit: 1,
            }) as Record<string, unknown>[];
            existing = rows?.[0] ?? null;
            if (existing) {
              setCachedProfile(user.sub, existing);
              console.log('[OAuthCallback] Profile found via Worker API');
            } else {
              console.log('[OAuthCallback] Profile NOT found — new user');
            }
          } catch (err) {
            console.warn('[OAuthCallback] Worker API profile lookup failed:', err);
            existing = null;
          }
        }

        // ─── STEP 3: Determine redirect ───
        const returnTo = sessionStorage.getItem('auth0_return_to');
        if (returnTo) {
          sessionStorage.removeItem('auth0_return_to');
          setProfileCreated(true);
          navigate(returnTo, { replace: true });
          return;
        }

        if (!existing) {
          // New user — AuthContext will handle profile creation
          setProfileCreated(true);
          const target = isPilotTerminal ? '/' : '/become-member?setup=1';
          navigate(target, { replace: true });
        } else if (!existing.display_name) {
          // Profile exists but incomplete
          setProfileCreated(true);
          const target = isPilotTerminal ? '/' : '/become-member?setup=1';
          console.debug('[OAuthCallback] profile incomplete; redirecting to', target);
          navigate(target, { replace: true });
        } else {
          // Existing complete profile
          setProfileCreated(true);
          const target = isPilotTerminal ? '/' : isCareerPathways ? '/' : '/platform';
          console.debug('[OAuthCallback] existing profile; redirecting to', target);
          navigate(target, { replace: true });
        }
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
