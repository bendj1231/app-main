import React, { useEffect, useState } from 'react';
import { SafeMeshGradient } from '@/components/ui/SafeMeshGradient';

interface PostOAuthWelcomeScreenProps {
  userName?: string;
  onComplete: () => void;
  duration?: number;
}

export const PostOAuthWelcomeScreen: React.FC<PostOAuthWelcomeScreenProps> = ({
  userName,
  onComplete,
  duration = 2800,
}) => {
  const [phase, setPhase] = useState<'entering' | 'holding' | 'exiting' | 'done'>('entering');

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase('holding'), 600);
    const exitTimer = setTimeout(() => setPhase('exiting'), duration - 600);
    const doneTimer = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, duration);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [duration, onComplete]);

  if (phase === 'done') return null;

  const isEntering = phase === 'entering';
  const isExiting = phase === 'exiting';

  const getBlurStyle = (): React.CSSProperties => {
    if (isEntering) {
      return {
        filter: 'blur(14px)',
        opacity: 0,
        transform: 'translateY(12px) scale(0.96)',
      };
    }
    if (isExiting) {
      return {
        filter: 'blur(14px)',
        opacity: 0,
        transform: 'translateY(-12px) scale(1.03)',
      };
    }
    return {
      filter: 'blur(0px)',
      opacity: 1,
      transform: 'translateY(0) scale(1)',
    };
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* Animated mesh gradient background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {/* Solid fallback background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#0f172a',
          }}
        />
        <SafeMeshGradient
          className="w-full h-full"
          colors={[
            '#dbeafe',
            '#94a3b8',
            '#64748b',
            '#475569',
            '#334155',
            '#1e3a5f',
            '#1e3a8a',
            '#0f172a',
          ]}
          speed={0.4}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(100,116,139,0.2), rgba(15,23,42,0.35), rgba(2,6,23,0.6))',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backdropFilter: 'blur(3px)',
            background: 'rgba(15,23,42,0.1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
          }}
        />
      </div>

      {/* Centered content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          transition: 'all 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
          ...getBlurStyle(),
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            letterSpacing: '-0.5px',
            lineHeight: 1.1,
            textShadow: '0 0 40px rgba(239,68,68,0.25), 0 0 80px rgba(59,130,246,0.15)',
          }}
        >
          <span style={{ color: '#ffffff' }}>pilot</span>
          <span style={{ color: '#ef4444' }}>recognition</span>
          <span style={{ color: '#ffffff' }}>.com</span>
        </div>

        {/* Welcome text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.95)',
              letterSpacing: '-0.3px',
            }}
          >
            Welcome{userName ? `, ${userName}` : ''}
          </div>
          <div
            style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 500,
            }}
          >
            Preparing your flight deck
          </div>
        </div>

        {/* Subtle animated dot */}
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.35)',
                animation: `welcomePulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes welcomePulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
};
