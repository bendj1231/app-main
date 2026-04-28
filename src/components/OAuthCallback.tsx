import React, { useEffect } from 'react';

const safeRedirect = (path: string) => {
  window.location.href = path;
};

export const OAuthCallback = () => {
  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = window.location.search;
      const hash = window.location.hash;

      if (searchParams) {
        safeRedirect(`/auth/callback${searchParams}${hash}`);
      } else if (hash) {
        safeRedirect(`/auth/callback${hash}`);
      } else {
        safeRedirect('/');
      }
    };

    handleCallback();
  }, []);

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
          Processing Authentication
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
