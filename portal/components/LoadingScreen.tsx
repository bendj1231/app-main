import React from 'react';

interface LoadingScreenProps {
  phase?: string;
  error?: string | null;
  onRetry?: () => void;
  onSkip?: () => void;
  canSkip?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ error, onRetry, onSkip, canSkip = false }) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-title"
      aria-describedby="loading-description"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '2.5rem',
        backdropFilter: 'blur(4px)'
      }}
    >
      <div
        style={{
          maxWidth: '550px',
          width: '100%',
          background: 'rgba(255,255,255,0.92)',
          borderRadius: '24px',
          padding: '2rem 2.25rem 1.5rem',
          boxShadow: '0 40px 120px rgba(15,23,42,0.25)',
          border: '1px solid rgba(255,255,255,0.65)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          animation: 'fadeIn 0.3s ease-out'
        }}
      >
        <header style={{ textAlign: 'center' }}>
          <img
            src="/logo.png"
            alt="WingMentor Logo"
            style={{
              width: '100px',
              margin: '0 auto 1rem',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          />
          <div
            style={{
              letterSpacing: '0.25em',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#2563eb',
              marginBottom: '0.5rem',
              textTransform: 'uppercase'
            }}
          >
            BRIDGING THE GAP
          </div>
          <h1
            id="loading-title"
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '1.1rem',
              color: '#0f172a',
              letterSpacing: '-0.02em',
              margin: 0
            }}
          >
            Loading Portal
          </h1>
        </header>

        <main
          id="loading-description"
          style={{ textAlign: 'center' }}
        >
          <div
            style={{
              marginBottom: '0.35rem',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: '0.95rem'
            }}
          >
            Loading...
          </div>
          <div
            style={{
              height: '8px',
              background: '#e2e8f0',
              borderRadius: '999px',
              overflow: 'hidden',
              boxShadow: 'inset 0 1px 4px rgba(15,23,42,0.1)',
              marginBottom: '1rem'
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, #2563eb, #0f172a)',
                animation: 'progress 2s ease-in-out infinite',
                boxShadow: '0 0 10px rgba(37, 99, 235, 0.5)'
              }}
            />
          </div>

          {error && (
            <div
              role="alert"
              style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                textAlign: 'center'
              }}
            >
              <p style={{ color: '#dc2626', marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.85rem' }}>
                {error}
              </p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  style={{
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    padding: '0.56rem 1.13rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#b91c1c'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#dc2626'}
                >
                  Retry
                </button>
              )}
            </div>
          )}

          {canSkip && onSkip && !error && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                onClick={onSkip}
                style={{
                  background: 'transparent',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.color = '#0f172a';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#64748b';
                }}
              >
                Skip to Dashboard
              </button>
            </div>
          )}
        </main>

        <footer style={{ textAlign: 'center', marginTop: 'auto' }}>
          <p
            style={{
              textTransform: 'uppercase',
              fontSize: '0.7rem',
              letterSpacing: '0.25em',
              color: '#94a3b8',
              margin: '0.75rem 0 0.25rem'
            }}
          >
            Accredited & Recognized
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
              color: '#0f172a',
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          >
            <span>Programs</span>
            <span style={{ color: '#cbd5f5' }}>|</span>
            <span>Pilot Recognition</span>
            <span style={{ color: '#cbd5f5' }}>|</span>
            <span>Pathways</span>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
