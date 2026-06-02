import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export const OAuthCallback = () => {
  const { isLoading, isAuthenticated, user, error } = useAuth0();
  const navigate = useNavigate();
  const [profileCreated, setProfileCreated] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user || profileCreated) return;

    const createSupabaseProfile = async () => {
      try {
// [AUDIT] Removed console.log // line 15
        const { supabase } = await import('@/src/lib/supabase');

        const { data: { session: cbSession } } = await supabase.auth.getSession();
// [AUDIT] Removed console.log // line 19

        // 1. Check by auth0_id first
        let { data: existing } = await supabase
          .from('profiles')
          .select('id, auth0_id, display_name, total_flight_hours')
          .eq('auth0_id', user.sub)
          .maybeSingle();
// [AUDIT] Removed console.log // line 27

        // 2. Fallback: check by email (covers users registered before Auth0)
        if (!existing && user.email) {
// [AUDIT] Removed console.log // line 31
          const { data: byEmail } = await supabase
            .from('profiles')
            .select('id, auth0_id, display_name, total_flight_hours')
            .eq('email', user.email)
            .maybeSingle();
// [AUDIT] Removed console.log // line 37

          if (byEmail) {
            await supabase
              .from('profiles')
              .update({ auth0_id: user.sub })
              .eq('id', byEmail.id);
            existing = byEmail;
          }
        }

        // Determine redirect based on domain
        const isPilotTerminal = window.location.hostname.includes('pilotterminal');
        const isCareerPathways = window.location.hostname.includes('pilotcareerpathways') || 
          window.location.hostname.includes('careerpathways') ||
          (window.location.hostname === 'localhost' && new URLSearchParams(window.location.search).get('product') === 'careerpathways');
        
        if (!existing) {
// [AUDIT] Removed console.log // line 55
          const { data: { session } } = await supabase.auth.getSession();
          const supabaseUid = session?.user?.id;
// [AUDIT] Removed console.log // line 58

          if (supabaseUid) {
            // Has a Supabase session — safe to upsert from client (RLS: auth.uid() = id)
            const { data: newProfile, error: upsertError } = await supabase.from('profiles').upsert({
              id: supabaseUid,
              auth0_id: user.sub,
              email: user.email,
              avatar_url: user.picture,
              account_tier: 'free',
              created_at: new Date().toISOString(),
            }, { onConflict: 'auth0_id' }).select('id').maybeSingle();
// [AUDIT] Removed console.log // line 70

            if (newProfile?.id) {
              await supabase.functions.invoke('generate-profile-token', {
                body: { userId: newProfile.id }
              }).catch(() => {});
            }
          } else {
            // No Supabase session yet (Auth0-only flow) — profile will be created by create-wallet edge function
// [AUDIT] Removed console.log // line 79
          }

          setProfileCreated(true);
          // Redirect: pilotterminal -> home, careerpathways -> become-member for setup, otherwise -> become-member
          navigate(isPilotTerminal ? '/' : isCareerPathways ? '/become-member?setup=1' : '/become-member?setup=1');
        } else if (!existing.display_name) {
          // Profile exists but setup not completed
          setProfileCreated(true);
          navigate(isPilotTerminal ? '/' : isCareerPathways ? '/become-member?setup=1' : '/become-member?setup=1');
        } else {
          setProfileCreated(true);
          // Redirect: pilotterminal -> home, careerpathways -> home (pathways page), otherwise -> platform
          navigate(isPilotTerminal ? '/' : isCareerPathways ? '/' : '/platform');
        }
      } catch (err) {
        console.error('Profile creation error:', err);
        navigate('/');
      }
    };

    createSupabaseProfile();
  }, [isAuthenticated, user, profileCreated]);

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#dc2626' }}>Authentication Error</h2>
          <p style={{ color: '#64748b' }}>{error.message}</p>
          <button onClick={() => window.location.href = '/'} style={{ marginTop: '16px', padding: '8px 16px' }}>
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
