import React, { useEffect, useState } from 'react';
import { safeRedirect } from '@/src/lib/url-validator';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { getBestClient } from '@/src/lib/auth-cluster';
import { supabase as legacySupabase } from '@/src/lib/supabase';

/** Retry helper with exponential backoff for resilient Supabase calls */
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, baseDelay = 500): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      // 522 = throttled, 503 = unavailable — these are retryable
      const status = (err as any)?.status || (err as any)?.code;
      const isRetryable = status === 522 || status === 503 || status === 'timeout' || status === 'ETIMEDOUT';
      if (!isRetryable && i === 0) throw err; // Non-retryable error, fail fast
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i); // 500ms, 1000ms, 2000ms
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
}

/** Cache profile data in sessionStorage to reduce Supabase calls */
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

    const handleAuthCallback = async () => {
      try {
        // Debug trace
        try {
          const dbg = JSON.parse(sessionStorage.getItem('oauth_debug_log') || '[]');
          dbg.push({ ts: Date.now(), step: 'oauth_callback_start', auth0Sub: user?.sub || null, email: user?.email || null });
          sessionStorage.setItem('oauth_debug_log', JSON.stringify(dbg.slice(-50)));
        } catch {}

        // ─── CLUSTER-AWARE CLIENT for auth, LEGACY for data ───
        const clusterClient = getBestClient();
        // Auth/session operations use cluster (failover-aware)
        const authSupabase = clusterClient || legacySupabase;
        // Profile/data operations ALWAYS use legacy Sydney (data lives there)
        const dataSupabase = legacySupabase;
        const activeNode = clusterClient ? 'cluster' : 'legacy';
        console.log(`[OAuthCallback] Auth: ${activeNode} node | Data: legacy (Sydney)`);

        const isPilotTerminal = window.location.hostname.includes('pilotterminal');
        const isCareerPathways = window.location.hostname.includes('pilotcareerpathways') || 
          window.location.hostname.includes('careerpathways') ||
          (window.location.hostname === 'localhost' && new URLSearchParams(window.location.search).get('product') === 'careerpathways');

        // ─── STEP 1: Check cached profile (reduces Supabase calls to zero if cache hit) ───
        let existing = getCachedProfile(user.sub);
        let supabaseError: unknown = null;

        if (!existing) {
          // ─── STEP 2: Query Supabase with retry (always use legacy Sydney for data) ───
          try {
            const result = await withRetry(() =>
              Promise.resolve(
                dataSupabase
                  .from('profiles')
                  .select('id, auth0_id, display_name, total_flight_hours, email')
                  .eq('auth0_id', user.sub)
                  .maybeSingle()
              )
            );
            existing = result.data || null;
            if (existing) setCachedProfile(user.sub, existing);
          } catch (err) {
            supabaseError = err;
            console.warn('[OAuthCallback] Supabase profile lookup failed after retries:', err);
            // DON'T crash — continue with null existing (assume new user)
          }

          // Fallback: check by email only if first query failed (not if null result)
          if (!existing && !supabaseError && user.email) {
            try {
              const emailResult = await withRetry(() =>
                Promise.resolve(
                  dataSupabase
                    .from('profiles')
                    .select('id, auth0_id, display_name, total_flight_hours')
                    .eq('email', user.email)
                    .maybeSingle()
                )
              );
              const byEmail = emailResult.data;
              if (byEmail) {
                await withRetry(() =>
                  Promise.resolve(
                    dataSupabase.from('profiles').update({ auth0_id: user.sub }).eq('id', byEmail.id)
                  )
                );
                existing = byEmail;
                setCachedProfile(user.sub, existing);
              }
            } catch (err) {
              console.warn('[OAuthCallback] Email fallback also failed:', err);
            }
          }
        }

        // ─── STEP 3: Determine redirect (works even if Supabase is down) ───
        const returnTo = sessionStorage.getItem('auth0_return_to');
        if (returnTo) {
          sessionStorage.removeItem('auth0_return_to');
          setProfileCreated(true);
          navigate(returnTo, { replace: true });
          return;
        }

        if (!existing) {
          // New user — try to create profile, but DON'T block on failure
          console.debug('[OAuthCallback] no profile (or Supabase down) — treating as new user');
          
          // Auth session from cluster-aware client (supports failover)
          const { data: { session } } = await authSupabase.auth.getSession().catch(() => ({ data: { session: null } }));
          const supabaseUid = session?.user?.id;

          if (supabaseUid && !supabaseError) {
            // Best effort: create profile, but don't await forever
            Promise.resolve(
              dataSupabase.from('profiles').upsert({
                id: supabaseUid,
                auth0_id: user.sub,
                email: user.email,
                avatar_url: user.picture,
                account_tier: 'free',
                created_at: new Date().toISOString(),
              }, { onConflict: 'auth0_id' }).select('id').maybeSingle()
            ).then((result) => {
              const newProfile = result.data;
              if (newProfile && 'id' in newProfile) {
                Promise.resolve(
                  dataSupabase.functions.invoke('generate-profile-token', {
                    body: { userId: newProfile.id }
                  })
                ).catch(() => {});
              }
            }).catch(() => {});
          }

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
