import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';

interface CockpitFlightHoursDashboardProps {
  userId: string | undefined;
  profile: Record<string, unknown> | null | undefined;
  isFreeUser: boolean;
  logbookConnected: boolean;
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
  return `${h}+${m.toString().padStart(2, '0')}`;
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

export const CockpitFlightHoursDashboard: React.FC<CockpitFlightHoursDashboardProps> = ({
  userId,
  profile,
  isFreeUser,
  logbookConnected,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [hours, setHours] = useState<FlightHoursData>(DEFAULT_HOURS);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });
  const { callApi } = useWorkerAuth();

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

  const primaryInstruments = [
    { label: 'Total Time', value: fmtHrs(hours.totalTime), sub: isFreeUser ? 'UNVERIFIED' : '' },
    { label: 'PIC', value: fmtHrs(hours.picTime), sub: isFreeUser ? 'UNVERIFIED' : '' },
    { label: 'Dual', value: fmtHrs(hours.dualTime), sub: isFreeUser ? 'UNVERIFIED' : '' },
  ];

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
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {primaryInstruments.map((instrument, i) => (
          <InstrumentCard
            key={instrument.label}
            label={instrument.label}
            value={instrument.value}
            sub={instrument.sub}
            started={isInView}
            delay={i}
          />
        ))}
      </div>

      {/* Expandable secondary instruments */}
      <div className="relative">
        <div
          className="overflow-hidden transition-all duration-500 ease-in-out"
          style={{ maxHeight: expanded ? '600px' : '0px', opacity: expanded ? 1 : 0 }}
        >
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2">
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
