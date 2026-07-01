import React from 'react';
import { motion } from 'framer-motion';

interface AttitudeIndicatorProps {
  progress?: number;
  deviation?: number;
  label?: string;
  sub?: string;
  started?: boolean;
  delay?: number;
}

const AttitudeIndicator: React.FC<AttitudeIndicatorProps> = ({
  progress = 0,
  deviation = 0,
  label = 'CAREER HORIZON',
  sub = '',
  started = true,
  delay = 0,
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const clampedDeviation = Math.max(-100, Math.min(100, deviation));

  const pitchDeg = (clampedProgress / 100) * 60 - 30;
  const rollDeg = (clampedDeviation / 100) * 90;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay * 0.1 }}
      className="flex flex-col items-stretch w-full h-full"
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
        }}
      >
        <img
          src="/instruments/ai/ai.svg"
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            transform: `rotate(${-rollDeg}deg) translateY(${-pitchDeg * 2}px)`,
            transition: started ? 'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
            filter: 'blur(4px)',
            opacity: 0.65,
            zIndex: 1,
          }}
        />

        {/* Digit windows overlay */}
        <svg
          viewBox="0 0 200 200"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        >
          <defs>
            <linearGradient id="boxShine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <filter id="digitBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
            </filter>
          </defs>
          {(() => {
            const value = '00+00';
            const chars = value.split('');
            const boxW = 14;
            const boxH = 18;
            const gap = 2;
            const totalW = chars.length * boxW + (chars.length - 1) * gap;
            const startX = 100 - totalW / 2;
            const baseY = 88;
            return (
              <g>
                {/* Backing blur panel behind digit windows */}
                <rect
                  x={startX - 4}
                  y={baseY - 4}
                  width={totalW + 8}
                  height={boxH + 8}
                  rx="4"
                  fill="rgba(15,23,42,0.75)"
                  filter="url(#digitBlur)"
                />
                {chars.map((ch, i) => {
                  const x = startX + i * (boxW + gap);
                  return (
                    <g key={i}>
                      <rect
                        x={x}
                        y={baseY}
                        width={boxW}
                        height={boxH}
                        rx="2"
                        fill="rgba(0,0,0,0.55)"
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="0.5"
                      />
                      <text
                        x={x + boxW / 2}
                        y={baseY + boxH / 2 + 1}
                        fill="#fff"
                        fontSize="12"
                        fontWeight="900"
                        fontFamily="system-ui, -apple-system, sans-serif"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                      >
                        {ch}
                      </text>
                      <rect
                        x={x}
                        y={baseY}
                        width={boxW}
                        height={boxH / 2}
                        rx="2"
                        fill="url(#boxShine)"
                        opacity="0.12"
                      />
                    </g>
                  );
                })}
              </g>
            );
          })()}
        </svg>

        {/* Label overlay at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 4,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '0.6rem',
              letterSpacing: '0.15em',
              color: 'rgba(148,163,184,0.8)',
              fontWeight: 600,
              textTransform: 'uppercase',
              textShadow: '0 1px 3px rgba(0,0,0,0.6)',
            }}
          >
            {label}
          </p>
          {sub && (
            <p
              style={{
                margin: '2px 0 0',
                fontSize: '0.55rem',
                color: '#ef4444',
                letterSpacing: '0.1em',
                fontWeight: 700,
                opacity: 0.85,
                textShadow: '0 1px 3px rgba(0,0,0,0.6)',
              }}
            >
              {sub}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AttitudeIndicator;
