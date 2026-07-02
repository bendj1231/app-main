import React, { useEffect, useState } from 'react';
import { safeRedirect } from '@/lib/url-validator';
import { useAuth0 } from '@auth0/auth0-react';
import { WalletPublicCard } from './WalletPublicCard';
import { PasskeyGate } from './PasskeyGate';
import { WalletLoadingScreen } from './WalletLoadingScreen';
import { WalletPageWithSidebar } from './WalletPageWithSidebar';

type View = 'loading' | 'public' | 'gate' | 'manage' | 'no-token';

const isWalletHost = () => {
  const h = window.location.hostname;
  return h === 'wallet.pilotrecognition.com' || h === 'localhost' || h === '127.0.0.1';
};

export const WalletRouter: React.FC = () => {
  const { user: auth0User, isAuthenticated } = useAuth0();
  const [view, setView] = useState<View>('loading');
  const [nextView, setNextView] = useState<View>('no-token');
  const [token, setToken] = useState<string>('');
  const [authedUserId, setAuthedUserId] = useState<string>('');

  useEffect(() => {
    // Extract token from path: wallet.pilotrecognition.com/[token]
    // or ?token=xxx  or localhost:3000?token=xxx
    const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
    const params = new URLSearchParams(window.location.search);
    const t = path || params.get('token') || '';

    if (t && t !== 'manage') {
      setToken(t);
      setNextView('public');
    } else if (t === 'manage') {
      if (isAuthenticated && auth0User?.sub) {
        setAuthedUserId(auth0User.sub);
        setNextView('manage');
      } else {
        setNextView('gate');
      }
    } else {
      setNextView('no-token');
    }
  }, []);

  if (view === 'loading') {
    return (
      <WalletLoadingScreen
        onComplete={async () => {
          if (isAuthenticated && auth0User?.sub) setAuthedUserId(auth0User.sub);
          setView(nextView === 'no-token' ? 'manage' : nextView);
        }}
      />
    );
  }

  if (view === 'no-token') {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{ marginBottom: 20 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#dc2626', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>PilotRecognition PIC</p>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: 'white', marginBottom: 12, letterSpacing: '-0.02em' }}>No PIC Record</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: 28 }}>
            Visit this page with a pilot record in the URL.<br/>
            e.g. <span style={{ fontFamily: 'monospace', color: '#94a3b8' }}>pic.pilotrecognition.com/0xABC123</span>
          </p>
          <a
            href="https://pilotrecognition.com/platform?tab=wallet"
            style={{ display: 'inline-block', padding: '11px 28px', background: '#dc2626', color: 'white', borderRadius: 10, fontSize: 12, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            Open My PIC
          </a>
        </div>
      </div>
    );
  }

  if (view === 'gate') {
    return (
      <PasskeyGate
        onAuthenticated={(userId) => {
          setAuthedUserId(userId);
          setView('manage');
        }}
        onCancel={() => {
          if (token) {
            setView('public');
          } else {
            safeRedirect('https://pilotrecognition.com/platform?tab=wallet');
          }
        }}
      />
    );
  }

  if (view === 'manage') {
    return (
      <WalletPageWithSidebar
        userId={authedUserId}
        onNavigate={() => {
          if (token) setView('public');
          else safeRedirect('https://pilotrecognition.com/platform?tab=wallet');
        }}
      />
    );
  }

  // Default: public read-only card
  return (
    <WalletPublicCard
      token={token}
      onManage={() => {
        // Check if already logged in first
        if (isAuthenticated && auth0User?.sub) {
          safeRedirect(`https://pilotrecognition.com/platform?tab=wallet`);
        } else {
          setView('gate');
        }
      }}
    />
  );
};
