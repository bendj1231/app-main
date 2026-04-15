import React from 'react';

const loadingPhaseOrder = ['fetch', 'sync', 'deploy'] as const;
export type LoadingPhase = typeof loadingPhaseOrder[number];

const loadingPhaseDetails: Record<LoadingPhase, { title: string; subtitle: string }> = {
  fetch: {
    title: 'Fetching Program Data',
    subtitle: 'Verifying enrollment status and simulator modules'
  },
  sync: {
    title: 'Pilot Recognition Sync',
    subtitle: 'Syncing recognition ledger and advocacy records'
  },
  deploy: {
    title: 'Connecting to Pilot Pathways Network',
    subtitle: 'Loading mentorship applications and dashboards'
  }
};

interface LoadingScreenProps {
  phase: LoadingPhase;
  error?: string | null;
  onRetry?: () => void;
  onSkip?: () => void;
  canSkip?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ phase, error, onRetry, onSkip, canSkip = false }) => {
  const phaseIndex = loadingPhaseOrder.indexOf(phase);
  const progress = ((phaseIndex + 1) / loadingPhaseOrder.length) * 100;

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
          style={{ textAlign: 'left' }}
        >
          <div
            style={{
              marginBottom: '0.35rem',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: '0.95rem',
              transition: 'opacity 0.3s ease'
            }}
          >
            {loadingPhaseDetails[phase].title}
          </div>
          <div
            style={{
              fontSize: '0.8rem',
              color: '#475569',
              marginBottom: '1rem',
              transition: 'opacity 0.3s ease'
            }}
          >
            {loadingPhaseDetails[phase].subtitle}
          </div>
          
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Loading: ${loadingPhaseDetails[phase].title}`}
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
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #2563eb, #0f172a)',
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 0 10px rgba(37, 99, 235, 0.5)'
              }}
            />
          </div>

          <nav
            aria-label="Loading phases"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
              fontSize: '0.7rem'
            }}
          >
            {loadingPhaseOrder.map((phaseKey, idx) => {
              const status = idx < phaseIndex ? 'complete' : idx === phaseIndex ? 'active' : 'pending';
              const statusColor = status === 'active' ? '#0f172a' : status === 'complete' ? '#2563eb' : '#94a3b8';
              const statusBg = status === 'active' ? 'rgba(37, 99, 235, 0.1)' : 'transparent';
              return (
                <div
                  key={phaseKey}
                  aria-current={status === 'active' ? 'step' : undefined}
                  style={{
                    color: statusColor,
                    fontWeight: status === 'active' ? 700 : 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    background: statusBg,
                    transition: 'all 0.3s ease',
                    transform: status === 'active' ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  {status === 'complete' && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  <span>{loadingPhaseDetails[phaseKey].title}</span>
                  {idx < loadingPhaseOrder.length - 1 && (
                    <span
                      aria-hidden="true"
                      style={{
                        width: '15px',
                        height: '2px',
                        background: status === 'complete' ? '#2563eb' : 'rgba(148,163,184,0.4)',
                        display: 'inline-block',
                        transition: 'background 0.3s ease'
                      }}
                    />
                  )}
                </div>
              );
            })}
          </nav>

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
      `}</style>
    </div>
  );
};
