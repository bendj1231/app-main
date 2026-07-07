import React, { useEffect, useState } from 'react';
import { safeRedirect } from '@/lib/url-validator';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/d1-api';
import { useTheme } from '@/components/website/context/ThemeContext';

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
  const { isLoading, user, error, getIdTokenClaims } = useAuth0();
  const navigate = useNavigate();
  const [profileCreated, setProfileCreated] = useState(false);
  const { isDarkMode } = useTheme();

  // Theme persistence: force dark mode during OAuth redirect handshakes
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const [authError, _setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Guard: wait for Auth0 to finish processing the redirect before doing anything
    if (profileCreated || isLoading) {
      console.log('[OAuthCallback] Guard blocked — profileCreated:', profileCreated, 'isLoading:', isLoading);
      return;
    }

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

        // ─── STEP 1: Get ID token claims + check profile FIRST ───
        let token: string | null = null;
        let auth0Id: string | null = user?.sub || null;
        let userEmail: string | null = user?.email || null;
        try {
          console.log('[OAuthCallback] Fetching ID token...');
          let claims: { __raw?: string; sub?: string; email?: string } | undefined;
          for (let i = 0; i < 20; i++) {
            claims = await getIdTokenClaims() as { __raw?: string; sub?: string; email?: string } | undefined;
            if (claims?.__raw) break;
            await new Promise((r) => setTimeout(r, 300));
          }
          token = claims?.__raw || null;
          if (!auth0Id && claims?.sub) auth0Id = claims.sub;
          if (!userEmail && claims?.email) userEmail = claims.email;
          console.log('[OAuthCallback] Token acquired, length:', token?.length || 0, 'sub:', auth0Id);
        } catch (tokenErr) {
          console.warn('[OAuthCallback] Token fetch failed:', tokenErr);
        }

        let hasProfile = false;
        if (token && auth0Id) {
          const cached = getCachedProfile(auth0Id);
          if (cached?.id) {
            hasProfile = true;
            console.log('[OAuthCallback] Cached profile found');
          } else {
            console.log('[OAuthCallback] No cached profile, calling D1 getProfile for auth0_id:', auth0Id);
            try {
              const profile = await api(token, 'getProfile', { auth0_id: auth0Id, email: userEmail });
              console.log('[OAuthCallback] D1 getProfile response:', profile);
              if (profile && (profile as Record<string, unknown>)?.id) {
                setCachedProfile(auth0Id, profile);
                hasProfile = true;
              }
            } catch (apiErr) {
              console.warn('[OAuthCallback] D1 getProfile API error:', apiErr);
            }
          }
        }

        // If profile exists, go straight to platform — ignore returnTo
        if (hasProfile) {
          sessionStorage.removeItem('auth0_return_to');
          setProfileCreated(true);
          try { sessionStorage.setItem('pr_post_login_splash', '1'); } catch {}
          console.log('[OAuthCallback] Profile found — redirecting to /platform, flag set');
          navigate('/platform', { replace: true });
          return;
        }
        console.log('[OAuthCallback] No profile found, falling through to returnTo/onboarding');

        // ─── STEP 2: No profile → follow returnTo or default to onboarding ───
        const returnTo = sessionStorage.getItem('auth0_return_to');
        console.log('[OAuthCallback] returnTo from sessionStorage:', returnTo);
        if (returnTo) {
          sessionStorage.removeItem('auth0_return_to');
          setProfileCreated(true);
          const isPlatformReturnTo = returnTo === '/platform' || returnTo.startsWith('/platform');
          if (isPlatformReturnTo) {
            try { sessionStorage.setItem('pr_post_login_splash', '1'); } catch {}
          }
          console.log('[OAuthCallback] Redirecting to returnTo:', returnTo, 'isPlatformReturnTo:', isPlatformReturnTo, 'flag set:', isPlatformReturnTo);
          navigate(returnTo, { replace: true });
          return;
        }

        // ─── STEP 3: Fallback — no returnTo, go to onboarding ───
        setProfileCreated(true);
        let target = '/become-member?setup=1';

        // Reuse token from Step 1, or try again if it failed
        if (token && user?.sub) {
          const cached = getCachedProfile(user.sub);
          if (cached?.id) {
            target = '/platform';
            console.log('[OAuthCallback] Cached profile found — redirecting to /platform');
          } else {
            console.log('[OAuthCallback] No cached profile, calling D1 getProfile for auth0_id:', user.sub);
            try {
              const profile = await api(token, 'getProfile', { auth0_id: user.sub, email: user.email });
              console.log('[OAuthCallback] D1 getProfile response:', profile);
              if (profile && (profile as Record<string, unknown>)?.id) {
                setCachedProfile(user.sub, profile);
                target = '/platform';
                console.log('[OAuthCallback] Profile found in D1 — redirecting to /platform');
              } else {
                console.log('[OAuthCallback] D1 returned no profile — redirecting to onboarding');
              }
            } catch (apiErr) {
              console.warn('[OAuthCallback] D1 getProfile API error:', apiErr);
            }
          }
        } else {
          console.log('[OAuthCallback] No token or user.sub — skipping profile check, redirecting to onboarding');
        }

        if (isPilotTerminal && target !== '/platform') {
          target = '/';
        }
        if (target === '/platform') {
          try { sessionStorage.setItem('pr_post_login_splash', '1'); } catch {}
        }
        console.log('[OAuthCallback] Final navigation target:', target, 'flag set:', target === '/platform');
        navigate(target, { replace: true });
      } catch (err) {
        console.error('Unexpected OAuth callback error:', err);
        setProfileCreated(true);
        navigate('/');
      }
    };

    handleAuthCallback();

    return () => clearTimeout(timeout);
  }, [user, profileCreated, isLoading, navigate, getIdTokenClaims]);

  if (error || authError) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at center, #0f172a 0%, #020617 100%)'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '480px', padding: '0 24px' }}>
          <h2 style={{ color: '#dc2626', fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Authentication Error</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem' }}>{error?.message || authError}</p>
          <button
            onClick={() => safeRedirect('/')}
            style={{
              marginTop: '20px',
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              background: '#dc2626',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Match the Unified Platform dark-mode background so the Auth0 redirect
  // feels like a seamless transition into the app.
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-slate-950">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)' }}
      />
      {/* Atmospheric overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-500/20 via-slate-800/35 to-slate-950/60" />
      <div className="absolute inset-0 backdrop-blur-[1px] bg-slate-900/10" />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)' }}
      />
    </div>
  );
};
