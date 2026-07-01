import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import AttitudeIndicator from './AttitudeIndicator';

interface CockpitFlightHoursDashboardProps {
  userId: string | undefined;
  profile: Record<string, unknown> | null | undefined;
  isFreeUser: boolean;
  logbookConnected: boolean;
  onCompleteProfile?: () => void;
}

interface FlightHoursData {
  totalTime: number;
  picTime: number;
  dualTime: number;
  xcTime: number;
  nightTime: number;
  simInstTime: number;
  actualInstTime: number;
  simTime: number;
  landings: number;
}

const DEFAULT_HOURS: FlightHoursData = {
  totalTime: 0,
  picTime: 0,
  dualTime: 0,
  xcTime: 0,
  nightTime: 0,
  simInstTime: 0,
  actualInstTime: 0,
  simTime: 0,
  landings: 0,
};

const REVOLVE_CHARS = '0123456789';

const SplitFlapDigit: React.FC<{ char: string; delay: number; started: boolean }> = ({
  char,
  delay,
  started,
}) => {
  const [displayChar, setDisplayChar] = useState('·');
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (!started) return;
    let iterations = 0;
    const maxIterations = 6;
    const timer = setInterval(() => {
      if (iterations >= maxIterations) {
        setDisplayChar(char);
        setFlipping(false);
        clearInterval(timer);
        return;
      }
      setDisplayChar(REVOLVE_CHARS[Math.floor(Math.random() * REVOLVE_CHARS.length)]);
      setFlipping(true);
      setTimeout(() => setFlipping(false), 140);
      iterations++;
    }, 220 + delay * 40);
    return () => clearInterval(timer);
  }, [char, delay, started]);

  return (
    <div
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        width: '1.6ch',
        minWidth: '1.6ch',
        height: '1.2em',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 100%)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '4px',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 4px rgba(0,0,0,0.4)',
        perspective: '200px',
      }}
    >
      <span
        className="absolute text-white font-black tabular-nums leading-none"
        style={{
          fontSize: '1.1em',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          transition: 'transform 140ms ease-out, opacity 140ms ease-out',
          transform: flipping ? 'rotateX(-90deg) scaleY(0.8)' : 'rotateX(0deg) scaleY(1)',
          opacity: flipping ? 0.5 : 1,
          transformOrigin: 'center center',
        }}
      >
        {displayChar}
      </span>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 45%, rgba(0,0,0,0.25) 100%)',
        }}
      />
    </div>
  );
};

const SplitFlapNumber: React.FC<{ value: string; started: boolean; className?: string }> = ({
  value,
  started,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center gap-[2px] ${className}`}>
      {value.split('').map((char, i) => (
        <SplitFlapDigit key={`${char}-${i}`} char={char} delay={i} started={started} />
      ))}
    </div>
  );
};

const fmtHrs = (decimalHours: number): string => {
  if (!Number.isFinite(decimalHours)) return '0+00';
  const h = Math.floor(decimalHours);
  const m = Math.round((decimalHours - h) * 60);
  // Pad hours to minimum 2 digits, but allow 3+ digits for larger values
  // Examples: 5h -> 05+30, 10h -> 10+00, 100h -> 100+00, 150h -> 150+00
  const paddedHours = h < 10 ? h.toString().padStart(2, '0') : h.toString();
  return `${paddedHours}+${m.toString().padStart(2, '0')}`;
};

const InstrumentCard: React.FC<{
  label: string;
  value: string;
  sub?: string;
  started: boolean;
  delay: number;
}> = ({ label, value, sub, started, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: delay * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
      style={{ perspective: '1000px' }}
    >
      <div
        className="relative flex flex-col items-center justify-center p-4 sm:p-5 transition-transform duration-300"
        style={{
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 50%, rgba(0,0,0,0.15) 100%)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '18px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
      >
        {/* Outer bezel ring */}
        <div
          className="absolute inset-0 rounded-[18px] pointer-events-none"
          style={{
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: 'inset 0 0 20px rgba(255,255,255,0.03)',
          }}
        />

        {/* Value */}
        <div className="relative z-10 py-2">
          <SplitFlapNumber
            value={value}
            started={started}
            className="text-3xl sm:text-4xl md:text-5xl"
          />
        </div>

        {/* Label */}
        <p
          className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.18em] text-center mt-2"
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          {label}
        </p>

        {/* Sub label */}
        {sub && (
          <p
            className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-center mt-1 underline underline-offset-2"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            {sub}
          </p>
        )}
      </div>
    </motion.div>
  );
};

const ASIHoursGauge: React.FC<{
  value: string;
  rawHours: number;
  label: string;
  sub?: string;
  started: boolean;
  delay: number;
}> = ({ value, rawHours, label, sub, started, delay }) => {
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
        {/* Layer 1: dark glassy dial */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 50% 55%, rgba(30,40,55,0.95) 0%, rgba(10,15,25,0.98) 60%, rgba(5,8,14,1) 100%)',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6), inset 0 2px 8px rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        />

        {/* Layer 2: SVG scale */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="boxShine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <filter id="screwShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="rgba(0,0,0,0.5)" />
            </filter>
            <style>{`
              @keyframes gaugeBlink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.15; }
              }
            `}</style>
          </defs>
          {/* Thick arcs — airspeed indicator style, fitted inside bezel */}
          <path d={`M ${tickToCoord(0,82).x.toFixed(1)} ${tickToCoord(0,82).y.toFixed(1)} A 82 82 0 0 1 ${tickToCoord(500,82).x.toFixed(1)} ${tickToCoord(500,82).y.toFixed(1)}`} fill="none" stroke="#fff" strokeWidth="14" opacity="0.9" />
          <path d={`M ${tickToCoord(600,82).x.toFixed(1)} ${tickToCoord(600,82).y.toFixed(1)} A 82 82 0 0 1 ${tickToCoord(1000,82).x.toFixed(1)} ${tickToCoord(1000,82).y.toFixed(1)}`} fill="none" stroke="#fff" strokeWidth="14" opacity="0.9" />

          {/* Inner sub-arc — green from 20 to 1k */}
          <path d={`M ${tickToCoord(20,74).x.toFixed(1)} ${tickToCoord(20,74).y.toFixed(1)} A 74 74 0 0 1 ${tickToCoord(1000,74).x.toFixed(1)} ${tickToCoord(1000,74).y.toFixed(1)}`} fill="none" stroke="#22c55e" strokeWidth="6" opacity="0.85" />

          {/* Yellow sub-arc — from 1k to 1.25k */}
          <path d={`M ${tickToCoord(1000,74).x.toFixed(1)} ${tickToCoord(1000,74).y.toFixed(1)} A 74 74 0 0 1 ${tickToCoord(1250,74).x.toFixed(1)} ${tickToCoord(1250,74).y.toFixed(1)}`} fill="none" stroke="#FFD700" strokeWidth="6" opacity="0.9" />

          {/* Minor ticks — fitted inside bezel, skip gap between white arcs */}
          {Array.from({ length: 31 }, (_, i) => i * 50).filter(t => !majorTicks.includes(t) && !(t > 500 && t < 600)).map(tick => {
            const { x: x1, y: y1 } = tickToCoord(tick, 68);
            const { x: x2, y: y2 } = tickToCoord(tick, 82);
            return <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" />;
          })}

          {/* Major ticks + numbers — fitted inside bezel */}
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

          {/* Readout — segmented digit boxes */}
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
                      {/* Box */}
                      <rect x={x} y={baseY} width={boxW} height={boxH} rx="3" fill="rgba(0,0,0,0.45)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
                      {/* Digit */}
                      <text x={x + boxW / 2} y={baseY + boxH / 2 + 1} fill="#fff" fontSize="14" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" textAnchor="middle" dominantBaseline="middle" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{ch}</text>
                      {/* Shine overlay */}
                      <rect x={x} y={baseY} width={boxW} height={boxH / 2} rx="3" fill="url(#boxShine)" opacity="0.15" />
                    </g>
                  );
                })}
                {/* HOURS */}
                <text x="100" y="134" fill="rgba(255,255,255,0.4)" fontSize="6.5" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif" textAnchor="middle" letterSpacing="2.5">HOURS</text>
                {/* UNVERIFIED — faded red static */}
                {sub && (
                  <text x="100" y="36" fill="#dc2626" fontSize="7" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" textAnchor="middle" letterSpacing="3" opacity="0.55">{sub}</text>
                )}
                {/* TOTAL TIME */}
                <text x="100" y="76" fill="rgba(255,255,255,0.45)" fontSize="6" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" textAnchor="middle" letterSpacing="2">{label.toUpperCase()}</text>
              </g>
            );
          })()}

          {/* Glassy screws */}
          {[
            { cx: 20, cy: 20, rot: 34 },
            { cx: 180, cy: 20, rot: -52 },
            { cx: 20, cy: 180, rot: 78 },
            { cx: 180, cy: 180, rot: 12 },
          ].map((s, i) => (
            <g key={i} transform={`rotate(${s.rot}, ${s.cx}, ${s.cy})`}>
              {/* Screw head — translucent dark glass */}
              <circle cx={s.cx} cy={s.cy} r="7" fill="rgba(20,25,35,0.45)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" filter="url(#screwShadow)" />
              {/* Inner glass ring */}
              <circle cx={s.cx} cy={s.cy} r="5.5" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
              {/* Phillips cross */}
              <line x1={s.cx - 3} y1={s.cy} x2={s.cx + 3} y2={s.cy} stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" strokeLinecap="round" />
              <line x1={s.cx} y1={s.cy - 3} x2={s.cx} y2={s.cy + 3} stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" strokeLinecap="round" />
              {/* Center dot */}
              <circle cx={s.cx} cy={s.cy} r="1.5" fill="rgba(255,255,255,0.3)" />
              {/* Glassy shine highlight (top-left) */}
              <circle cx={s.cx - 2} cy={s.cy - 2} r="2.5" fill="rgba(255,255,255,0.15)" />
            </g>
          ))}
        </svg>

        {/* Layer 3: needle shadow */}
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

        {/* Layer 4: needle */}
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

        {/* Layer 5: glass glare */}
        <img src="/instruments/asi/glass_glare.png" alt="" className="absolute inset-0 w-full h-full object-cover rounded-full" style={{ transform: 'rotate(-100deg)', opacity: 0.25, pointerEvents: 'none', mixBlendMode: 'screen' }} />

        {/* Layer 6: bezel */}
        <img src="/instruments/asi/bezel.png" alt="" className="absolute inset-0 w-full h-full object-cover rounded-full" style={{ pointerEvents: 'none' }} />

        {/* Glassy SVG screws — inside the main SVG overlay */}
      </div>

      {/* Sub label now rendered inside the dial */}
    </motion.div>
  );
};

export const CockpitFlightHoursDashboard: React.FC<CockpitFlightHoursDashboardProps> = ({
  userId,
  profile,
  isFreeUser,
  logbookConnected,
  onCompleteProfile,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [hours, setHours] = useState<FlightHoursData>(DEFAULT_HOURS);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });
  const { callApi } = useWorkerAuth();

  // Initialize hours from profile prop immediately (parent already loaded getDashboardData)
  useEffect(() => {
    if (!profile) return;
    const p = profile as Record<string, unknown>;
    setHours({
      totalTime: Number(p.total_flight_hours ?? 0),
      picTime: Number(p.pic_hours ?? 0),
      dualTime: Number(p.dual_hours ?? 0),
      xcTime: Number(p.cross_country_hours ?? 0),
      nightTime: Number(p.night_hours ?? 0),
      simInstTime: Number(p.simulated_instrument_hours ?? 0),
      actualInstTime: Number(p.actual_instrument_hours ?? 0),
      simTime: Number(p.sim_time ?? 0),
      landings: Number(p.total_landings ?? 0),
    });
  }, [profile]);

  // Refresh from Worker when scrolled into view
  useEffect(() => {
    if (!isInView || !userId) return;

    const fetch = async () => {
      try {
        const data = (await callApi('getDashboardData', { user_id: userId })) as Record<string, unknown> | null;
        const flightHours = (data?.flight_hours || data?.profile || {}) as Record<string, unknown>;
        const fallback = (profile || {}) as Record<string, unknown>;

        setHours({
          totalTime: Number(flightHours.total_flight_hours ?? fallback.total_flight_hours ?? 0),
          picTime: Number(flightHours.pic_hours ?? fallback.pic_hours ?? 0),
          dualTime: Number(flightHours.dual_hours ?? fallback.dual_hours ?? 0),
          xcTime: Number(flightHours.cross_country_hours ?? fallback.cross_country_hours ?? 0),
          nightTime: Number(flightHours.night_hours ?? fallback.night_hours ?? 0),
          simInstTime: Number(flightHours.simulated_instrument_hours ?? fallback.simulated_instrument_hours ?? 0),
          actualInstTime: Number(flightHours.actual_instrument_hours ?? fallback.actual_instrument_hours ?? 0),
          simTime: Number(flightHours.sim_time ?? fallback.sim_time ?? 0),
          landings: Number(flightHours.total_landings ?? fallback.total_landings ?? 0),
        });
      } catch (err) {
        console.error('[CockpitFlightHoursDashboard] fetch error:', err);
      }
    };

    fetch();
  }, [isInView, userId, callApi, profile]);

  const secondaryInstruments = [
    { label: 'Cross Country', value: fmtHrs(hours.xcTime), sub: isFreeUser ? 'UNVERIFIED' : '' },
    { label: 'Night Time', value: fmtHrs(hours.nightTime), sub: isFreeUser ? 'UNVERIFIED' : '' },
    { label: 'Sim. Instrument', value: fmtHrs(hours.simInstTime), sub: isFreeUser ? 'UNVERIFIED' : '' },
    { label: 'Total Landings', value: String(hours.landings), sub: isFreeUser ? 'UNVERIFIED' : '' },
    { label: 'SIM Time', value: fmtHrs(hours.simTime), sub: isFreeUser ? 'UNVERIFIED' : '' },
    { label: 'Actual Inst.', value: fmtHrs(hours.actualInstTime), sub: isFreeUser ? 'UNVERIFIED' : '' },
  ];

  return (
    <div
      ref={ref}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-[10px] font-black tracking-[0.25em] uppercase text-white/90">
          Digital Flight Logbook
        </span>
        <div
          className="w-full h-px rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.65) 20%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.65) 80%, transparent 100%)',
            boxShadow: '0 0 8px rgba(255,255,255,0.25), 0 1px 2px rgba(255,255,255,0.15)',
          }}
        />
      </div>

      {/* Free user notice */}
      {isFreeUser && !logbookConnected && (
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)' }}
        >
          <p className="text-[10px] text-white/90 leading-relaxed">
            <span className="font-black text-white">UNVERIFIED</span> — Hours pulled from profile. Please sync a logbook to confirm total count and ensure it is ready for verification.
          </p>
        </div>
      )}

      {/* 6-pack primary instruments */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 items-start justify-items-center">
        <div className="w-full self-start" style={{ transform: 'scale(0.70)', transformOrigin: 'center top' }}>
          <ASIHoursGauge
            value={fmtHrs(hours.totalTime)}
            rawHours={hours.totalTime}
            label="Total Time"
            sub={isFreeUser ? 'UNVERIFIED' : ''}
            started={isInView}
            delay={0}
          />
        </div>
        <div className="w-full self-start" style={{ transform: 'scale(0.70)', transformOrigin: 'center top', marginTop: '-28px' }}>
          <AttitudeIndicator
            progress={Math.min(100, (hours.totalTime / 1500) * 100)}
            deviation={0}
            label="Career Horizon"
            sub={isFreeUser ? 'UNVERIFIED' : ''}
            started={isInView}
            delay={1}
          />
        </div>
        <div className="w-full self-start" style={{ transform: 'scale(0.70)', transformOrigin: 'center top' }}>
          <InstrumentCard
            label="PIC"
            value={fmtHrs(hours.picTime)}
            sub={isFreeUser ? 'UNVERIFIED' : ''}
            started={isInView}
            delay={2}
          />
        </div>
      </div>

      {/* Expandable secondary instruments */}
      <div className="relative">
        <div
          className="overflow-hidden transition-all duration-500 ease-in-out"
          style={{ maxHeight: expanded ? '600px' : '0px', opacity: expanded ? 1 : 0 }}
        >
          <div className="relative grid grid-cols-3 gap-2 sm:gap-3 pt-2">
            {secondaryInstruments.map((instrument, i) => (
              <InstrumentCard
                key={instrument.label}
                label={instrument.label}
                value={instrument.value}
                sub={instrument.sub}
                started={isInView}
                delay={i + 3}
              />
            ))}

            {/* Blur gate for incomplete profiles */}
            {isFreeUser && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-2xl" style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', background: 'rgba(15,23,42,0.75)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <span className="text-white text-xl font-black">PR°</span>
                </div>
                <div className="text-center px-6 max-w-sm">
                  <p className="text-lg font-black text-white tracking-tight">Complete Your Advanced Profile</p>
                  <p className="text-sm text-white/60 mt-2 leading-relaxed">Unlock your full flight time breakdown, AI pathway matching, and recurrency alerts.</p>
                </div>
                {onCompleteProfile && (
                  <button
                    onClick={onCompleteProfile}
                    className="px-6 py-2.5 rounded-full text-sm font-black tracking-wider text-white transition-all hover:brightness-110"
                    style={{ background: '#dc2626' }}
                  >
                    COMPLETE PROFILE →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View More toggle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black tracking-wider text-white/60 transition-all hover:bg-white/10"
        style={{
          background: 'rgba(0,0,0,0.55)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {expanded ? 'SHOW LESS' : 'VIEW MORE'}
        <span className="inline-flex items-center justify-center ml-2 leading-none">
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </span>
      </button>
    </div>
  );
};

export default CockpitFlightHoursDashboard;
