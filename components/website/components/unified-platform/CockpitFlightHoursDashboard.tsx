import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronDown, ChevronUp, BookOpen, User, MessageSquare } from 'lucide-react';
import { RecognitionAIChat } from './RecognitionAIChat';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import ASIHoursGauge from './ASIHoursGauge';
// @ts-ignore — Vite raw import
import altSvg from '/instruments/alt/alt.svg?raw';

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

export const CockpitFlightHoursDashboard: React.FC<CockpitFlightHoursDashboardProps> = ({
  userId,
  profile,
  isFreeUser,
  logbookConnected,
  onCompleteProfile,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'analog' | 'glass'>('analog');
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
    { label: 'PIC', value: fmtHrs(hours.picTime), sub: isFreeUser ? 'UNVERIFIED' : '' },
    { label: 'Cross Country', value: fmtHrs(hours.xcTime), sub: isFreeUser ? 'UNVERIFIED' : '' },
    { label: 'Night Time', value: fmtHrs(hours.nightTime), sub: isFreeUser ? 'UNVERIFIED' : '' },
    { label: 'Sim. Instrument', value: fmtHrs(hours.simInstTime), sub: isFreeUser ? 'UNVERIFIED' : '' },
    { label: 'Total Landings', value: String(hours.landings), sub: isFreeUser ? 'UNVERIFIED' : '' },
    { label: 'Actual Inst.', value: fmtHrs(hours.actualInstTime), sub: isFreeUser ? 'UNVERIFIED' : '' },
  ];

  const glassInstruments = [
    { label: 'Total Time', value: fmtHrs(hours.totalTime), sub: isFreeUser ? 'UNVERIFIED' : '' },
    { label: 'PIC', value: fmtHrs(hours.picTime), sub: isFreeUser ? 'UNVERIFIED' : '' },
    { label: 'Dual', value: fmtHrs(hours.dualTime), sub: isFreeUser ? 'UNVERIFIED' : '' },
    { label: 'Cross Country', value: fmtHrs(hours.xcTime), sub: isFreeUser ? 'UNVERIFIED' : '' },
    { label: 'Night Time', value: fmtHrs(hours.nightTime), sub: isFreeUser ? 'UNVERIFIED' : '' },
    { label: 'Sim. Instrument', value: fmtHrs(hours.simInstTime), sub: isFreeUser ? 'UNVERIFIED' : '' },
    { label: 'Total Landings', value: String(hours.landings), sub: isFreeUser ? 'UNVERIFIED' : '' },
    { label: 'Actual Inst.', value: fmtHrs(hours.actualInstTime), sub: isFreeUser ? 'UNVERIFIED' : '' },
    { label: 'Sim Time', value: fmtHrs(hours.simTime), sub: isFreeUser ? 'UNVERIFIED' : '' },
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

      {/* View mode toggle */}
      <div className="flex items-center justify-center gap-1">
        <button
          onClick={() => setViewMode('analog')}
          className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all ${
            viewMode === 'analog'
              ? 'text-white border border-white/20'
              : 'text-white/30 hover:text-white/50'
          }`}
          style={viewMode === 'analog' ? { background: 'rgba(255,255,255,0.08)' } : {}}
        >
          Analog
        </button>
        <button
          onClick={() => setViewMode('glass')}
          className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all ${
            viewMode === 'glass'
              ? 'text-white border border-white/20'
              : 'text-white/30 hover:text-white/50'
          }`}
          style={viewMode === 'glass' ? { background: 'rgba(255,255,255,0.08)' } : {}}
        >
          Glass Cockpit
        </button>
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

      {viewMode === 'analog' && (
        <div className="relative">
          {/* Main flight hours gauge */}
          <div className="flex justify-center items-center gap-4 py-4">
            <div className="w-56 h-56 flex-shrink-0 relative overflow-hidden">
              <div className="absolute inset-0">
                <ASIHoursGauge
                  value={fmtHrs(hours.totalTime)}
                  rawHours={hours.totalTime}
                  label="Total Time"
                  sub={isFreeUser ? 'UNVERIFIED' : ''}
                  started={isInView}
                  delay={0}
                />
              </div>
            </div>
            <div
              className="w-56 h-56 flex-shrink-0 relative overflow-hidden rounded-full"
              style={{
                background: 'radial-gradient(circle at 50% 55%, rgba(30,40,55,0.95) 0%, rgba(10,15,25,0.98) 60%, rgba(5,8,14,1) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6), inset 0 2px 8px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.35)',
              }}
            >
              <img
                src="/instruments/ai/ai.svg"
                alt="Attitude Indicator"
                className="w-full h-full object-contain"
                style={{ opacity: 0.9 }}
              />
              <img src="/instruments/asi/glass_glare.png" alt="" className="absolute inset-0 w-full h-full object-cover rounded-full" style={{ transform: 'rotate(-100deg)', opacity: 0.25, pointerEvents: 'none', mixBlendMode: 'screen' }} />

              {/* Center frosted glass hours window */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl"
                  style={{
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    background: 'rgba(0,0,0,0.45)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
                    transform: 'translateY(-8%)',
                  }}
                >
                  {isFreeUser && (
                    <span className="text-[6px] font-black text-red-500 tracking-[0.25em] opacity-60">UNVERIFIED</span>
                  )}
                  <div className="flex gap-[2px]">
                    {fmtHrs(hours.picTime).split('').map((ch, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-center rounded-sm"
                        style={{
                          width: '17px',
                          height: '21px',
                          background: 'rgba(0,0,0,0.55)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          fontSize: '12px',
                          fontWeight: 900,
                          color: '#fff',
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                        }}
                      >
                        {ch}
                      </div>
                    ))}
                  </div>
                  <span className="text-[6.5px] font-black text-white/40 tracking-[0.25em]">PIC TIME</span>
                </div>
              </div>
            </div>

            {/* Altimeter — alt.svg decorative instrument */}
            <div
              className="w-56 h-56 flex-shrink-0 relative overflow-hidden rounded-full"
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
              }}
              dangerouslySetInnerHTML={{ __html: altSvg }}
            />
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

          {/* Glassy overlay — connect logbook */}
          {!logbookConnected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 z-20 flex items-center justify-center p-6"
              style={{
                background: 'rgba(15,23,42,0.35)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              <div
                className="flex flex-col items-center justify-center text-center p-6 rounded-2xl"
                style={{
                  width: '280px',
                  height: '280px',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,250,240,0.88) 100%)',
                  border: '1px solid rgba(255,255,255,0.5)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{
                    background: 'rgba(220,38,38,0.1)',
                    border: '1px solid rgba(220,38,38,0.2)',
                  }}
                >
                  <BookOpen size={20} className="text-red-500" />
                </div>
                <p className="text-sm font-black text-slate-800 mb-1">Connect Your Logbook</p>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                  Sync your digital logbook to display analog & digital flight hours on your dashboard.
                </p>
                <button
                  onClick={() => onCompleteProfile?.()}
                  className="px-5 py-2 rounded-full text-[10px] font-black tracking-wider text-white transition-all hover:brightness-110"
                  style={{ background: '#dc2626' }}
                >
                  CONNECT LOGBOOK →
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {viewMode === 'glass' && (
        <div className="relative">
          <div className="relative grid grid-cols-3 gap-2 sm:gap-3 pt-2">
            {glassInstruments.map((instrument, i) => (
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

          {/* Glassy overlay — connect logbook */}
          {!logbookConnected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 z-20 flex items-center justify-center p-6"
              style={{
                background: 'rgba(15,23,42,0.35)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              <div
                className="flex flex-col items-center justify-center text-center p-6 rounded-2xl"
                style={{
                  width: '280px',
                  height: '280px',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,250,240,0.88) 100%)',
                  border: '1px solid rgba(255,255,255,0.5)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{
                    background: 'rgba(220,38,38,0.1)',
                    border: '1px solid rgba(220,38,38,0.2)',
                  }}
                >
                  <BookOpen size={20} className="text-red-500" />
                </div>
                <p className="text-sm font-black text-slate-800 mb-1">Connect Your Logbook</p>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                  Sync your digital logbook to display analog & digital flight hours on your dashboard.
                </p>
                <button
                  onClick={() => onCompleteProfile?.()}
                  className="px-5 py-2 rounded-full text-[10px] font-black tracking-wider text-white transition-all hover:brightness-110"
                  style={{ background: '#dc2626' }}
                >
                  CONNECT LOGBOOK →
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* ─── PILOT BIO & INTERESTS ─── */}
      <div className="space-y-4 pt-2">
        {/* Divider */}
        <div
          className="w-full h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.2) 80%, transparent 100%)' }}
        />

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User size={14} className="text-sky-400" />
            <span className="text-[10px] font-black tracking-wider uppercase text-white/50">Pilot Bio & Interests</span>
          </div>
          {onCompleteProfile && (
            <button
              onClick={onCompleteProfile}
              className="text-[9px] font-black tracking-wider text-white/40 hover:text-white/70 transition-colors flex items-center gap-1"
            >
              Complete Profile →
            </button>
          )}
        </div>

        {/* Pathway interests — wired from profile / getDashboardData */}
        {(() => {
          const interests = [
            { label: 'Career Goal', value: profile?.career_goal },
            { label: 'Pilot Stage', value: profile?.pilot_stage },
            { label: 'Target Role', value: profile?.target_role },
            { label: 'Preferred Region', value: profile?.preferred_region },
            { label: 'Current Occupation', value: profile?.current_occupation },
            { label: 'Employment Status', value: profile?.employment_status },
          ].filter((i) => !!i.value);

          if (interests.length === 0) {
            return (
              <div
                className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}
              >
                <p className="text-[11px] text-white/25">No interests or goals set yet.</p>
                <p className="text-[10px] text-white/20 mt-1">
                  Complete your advanced profile to unlock pathway matching.
                </p>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {interests.map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl p-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <p className="text-[8px] font-black tracking-wider uppercase text-white/30">{label}</p>
                  <p className="text-[11px] font-bold text-white/80 mt-0.5 truncate">{String(value)}</p>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Recognition AI — compact chat CTA */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="mb-3">
            <p className="text-[11px] font-bold text-white/80">Ask Recognition AI</p>
            <p className="text-[10px] text-white/40">Get advice on your pathways, career goals, and interests.</p>
          </div>
          <div className="max-h-[240px] overflow-hidden rounded-lg">
            <RecognitionAIChat profile={profile} />
          </div>
        </div>
      </div>

      {/* Free user prompt below instruments */}
      {isFreeUser && (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <p className="text-xs font-black text-white/50 tracking-wider uppercase">Complete Your Advanced Profile</p>
          <p className="text-[10px] text-white/30">Unlock full flight time breakdown, AI pathway matching, and recurrency alerts.</p>
          {onCompleteProfile && (
            <button
              onClick={onCompleteProfile}
              className="mt-1 px-5 py-2 rounded-full text-[10px] font-black tracking-wider text-white transition-all hover:brightness-110"
              style={{ background: '#dc2626' }}
            >
              COMPLETE PROFILE →
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CockpitFlightHoursDashboard;
