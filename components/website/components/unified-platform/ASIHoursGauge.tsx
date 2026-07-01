import React from 'react';
import { motion } from 'framer-motion';

export interface ASIHoursGaugeProps {
  value: string;
  rawHours: number;
  label: string;
  sub?: string;
  started: boolean;
  delay: number;
}

const ASIHoursGauge: React.FC<ASIHoursGaugeProps> = ({
  value,
  rawHours,
  label,
  sub,
  started,
  delay,
}) => {
  const maxScale = 1500;
  const clampedHours = Math.min(rawHours, maxScale);
  const needleDeg = 45 + (clampedHours / maxScale) * 270;
  const majorTicks = [0, 250, 500, 750, 1000, 1250, 1500];
  const labelMap: Record<number, string> = {
    250: '50',
    500: '200',
    750: '500',
  };

  const tickToCoord = (tick: number, radius: number) => {
    const a = -45 + (tick / maxScale) * 270;
    const r = (a * Math.PI) / 180;
    return { x: 100 + radius * Math.cos(r), y: 100 + radius * Math.sin(r) };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: delay * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className="relative w-full" style={{ aspectRatio: '1 / 1' }}>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 50% 55%, rgba(30,40,55,0.95) 0%, rgba(10,15,25,0.98) 60%, rgba(5,8,14,1) 100%)',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6), inset 0 2px 8px rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        />
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="boxShine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          <path d={`M ${tickToCoord(0,82).x.toFixed(1)} ${tickToCoord(0,82).y.toFixed(1)} A 82 82 0 0 1 ${tickToCoord(500,82).x.toFixed(1)} ${tickToCoord(500,82).y.toFixed(1)}`} fill="none" stroke="#fff" strokeWidth="14" opacity="0.9" />
          <path d={`M ${tickToCoord(600,82).x.toFixed(1)} ${tickToCoord(600,82).y.toFixed(1)} A 82 82 0 0 1 ${tickToCoord(1000,82).x.toFixed(1)} ${tickToCoord(1000,82).y.toFixed(1)}`} fill="none" stroke="#fff" strokeWidth="14" opacity="0.9" />
          <path d={`M ${tickToCoord(20,74).x.toFixed(1)} ${tickToCoord(20,74).y.toFixed(1)} A 74 74 0 0 1 ${tickToCoord(1000,74).x.toFixed(1)} ${tickToCoord(1000,74).y.toFixed(1)}`} fill="none" stroke="#22c55e" strokeWidth="6" opacity="0.85" />
          <path d={`M ${tickToCoord(1000,74).x.toFixed(1)} ${tickToCoord(1000,74).y.toFixed(1)} A 74 74 0 0 1 ${tickToCoord(1250,74).x.toFixed(1)} ${tickToCoord(1250,74).y.toFixed(1)}`} fill="none" stroke="#FFD700" strokeWidth="6" opacity="0.9" />
          {Array.from({ length: 31 }, (_, i) => i * 50).filter(t => !majorTicks.includes(t) && !(t > 500 && t < 600)).map(tick => {
            const { x: x1, y: y1 } = tickToCoord(tick, 68);
            const { x: x2, y: y2 } = tickToCoord(tick, 82);
            return <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" />;
          })}
          {majorTicks.map(tick => {
            const { x: x1, y: y1 } = tickToCoord(tick, 66);
            const { x: x2, y: y2 } = tickToCoord(tick, 82);
            const { x: tx, y: ty } = tickToCoord(tick, 54);
            return (
              <g key={tick}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={tick === 1250 ? '#dc2626' : '#fff'} strokeWidth="2.5" strokeLinecap="round" />
                <text x={tx} y={ty} fill="#fff" fontSize="10" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" textAnchor="middle" dominantBaseline="middle" letterSpacing="0.5">
                  {labelMap[tick] ?? (tick >= 1000 ? `${tick / 1000}k` : tick)}
                </text>
              </g>
            );
          })}
          {(() => {
            const chars = value.split('');
            const boxW = 15;
            const boxH = 20;
            const gap = 2;
            const totalW = chars.length * boxW + (chars.length - 1) * gap;
            const startX = 100 - totalW / 2;
            const baseY = 96;
            return (
              <g>
                {chars.map((ch, i) => {
                  const x = startX + i * (boxW + gap);
                  return (
                    <g key={i}>
                      <rect x={x} y={baseY} width={boxW} height={boxH} rx="3" fill="rgba(0,0,0,0.45)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
                      <text x={x + boxW / 2} y={baseY + boxH / 2 + 1} fill="#fff" fontSize="14" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" textAnchor="middle" dominantBaseline="middle" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{ch}</text>
                      <rect x={x} y={baseY} width={boxW} height={boxH / 2} rx="3" fill="url(#boxShine)" opacity="0.15" />
                    </g>
                  );
                })}
                <text x="100" y="134" fill="rgba(255,255,255,0.4)" fontSize="6.5" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif" textAnchor="middle" letterSpacing="2.5">HOURS</text>
                {sub && (
                  <text x="100" y="36" fill="#dc2626" fontSize="7" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" textAnchor="middle" letterSpacing="3" opacity="0.55">{sub}</text>
                )}
                <text x="100" y="76" fill="rgba(255,255,255,0.45)" fontSize="6" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" textAnchor="middle" letterSpacing="2">{label.toUpperCase()}</text>
              </g>
            );
          })()}
        </svg>
        <div
          className="absolute group/needle cursor-pointer"
          style={{
            top: '5%', left: '5%', width: '90%', height: '90%',
            transform: `rotate(${needleDeg}deg)`,
            transformOrigin: 'center center',
            transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <img
            src="/instruments/asi/needle_shadow.png"
            alt=""
            className="w-full h-full opacity-50 group-hover/needle:opacity-15 transition-opacity duration-200"
            style={{ pointerEvents: 'none' }}
          />
        </div>
        <div
          className="absolute group/needle cursor-pointer"
          style={{
            top: '5%', left: '5%', width: '90%', height: '90%',
            transform: `rotate(${needleDeg}deg)`,
            transformOrigin: 'center center',
            transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <img
            src="/instruments/asi/needle.png"
            alt=""
            className="w-full h-full group-hover/needle:opacity-25 transition-opacity duration-200"
            style={{ pointerEvents: 'none' }}
          />
        </div>
        <img src="/instruments/asi/glass_glare.png" alt="" className="absolute inset-0 w-full h-full object-cover rounded-full" style={{ transform: 'rotate(-100deg)', opacity: 0.25, pointerEvents: 'none', mixBlendMode: 'screen' }} />
        <img src="/instruments/asi/bezel.png" alt="" className="absolute inset-0 w-full h-full object-cover rounded-full" style={{ pointerEvents: 'none' }} />
      </div>
    </motion.div>
  );
};

export default ASIHoursGauge;
