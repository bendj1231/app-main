import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const OAuthCallback = () => {
  const { isLoading, isAuthenticated, user, error } = useAuth0();
  const [profileCreated, setProfileCreated] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user || profileCreated) return;

    const createSupabaseProfile = async () => {
      try {
        const { supabase } = await import('@/src/lib/supabase');

        // 1. Check by auth0_id first
        let { data: existing } = await supabase
          .from('profiles')
          .select('id, auth0_id')
          .eq('auth0_id', user.sub)
          .maybeSingle();

        // 2. Fallback: check by email (covers users registered before Auth0)
        if (!existing && user.email) {
          const { data: byEmail } = await supabase
            .from('profiles')
            .select('id, auth0_id')
            .eq('email', user.email)
            .maybeSingle();

          if (byEmail) {
            // Stamp auth0_id onto existing profile so future logins are instant
            await supabase
              .from('profiles')
              .update({ auth0_id: user.sub })
              .eq('id', byEmail.id);
            existing = byEmail;
          }
        }

        if (!existing) {
          // Brand new user — create profile
          const { data: newProfile } = await supabase.from('profiles').insert({
            auth0_id: user.sub,
            email: user.email,
            display_name: user.name || user.email?.split('@')[0],
            avatar_url: user.picture,
            account_tier: 'free',
            created_at: new Date().toISOString(),
          }).select('id').single();

          if (newProfile?.id) {
            await supabase.functions.invoke('generate-profile-token', {
              body: { userId: newProfile.id }
            }).catch(() => {}); // non-critical
          }

          setProfileCreated(true);
          window.location.href = '/become-member?setup=1';
        } else {
          setProfileCreated(true);
          window.location.href = '/platform';
        }
      } catch (err) {
        console.error('Profile creation error:', err);
        window.location.href = '/';
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
