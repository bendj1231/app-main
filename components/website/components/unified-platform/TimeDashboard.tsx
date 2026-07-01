import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import AttitudeIndicator from './AttitudeIndicator';
import ASIHoursGauge from './ASIHoursGauge';

interface TimeDashboardProps {
  userId?: string;
  profile?: Record<string, unknown> | null;
  isFreeUser?: boolean;
  logbookConnected?: boolean;
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

const fmtHrs = (decimalHours: number): string => {
  if (!Number.isFinite(decimalHours)) return '0+00';
  const h = Math.floor(decimalHours);
  const m = Math.round((decimalHours - h) * 60);
  const paddedHours = h < 10 ? h.toString().padStart(2, '0') : h.toString();
  return `${paddedHours}+${m.toString().padStart(2, '0')}`;
};

const AltimeterGauge: React.FC<{
  rawHours: number;
  label: string;
  sub?: string;
  started: boolean;
  delay: number;
}> = ({ rawHours, label, sub, started, delay }) => {
  const maxScale = 1500;
  const clamped = Math.min(rawHours, maxScale);
  const degPerHour = 270 / maxScale;
  const offsetDeg = -135;
  const mainHandDeg = offsetDeg + clamped * degPerHour;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: delay * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className="relative w-full" style={{ aspectRatio: '1 / 1' }}>
        <img
          src="/instruments/alt/alt.svg"
          alt=""
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: 'none' }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              position: 'absolute',
              width: '90%',
              height: '90%',
              transform: `rotate(${mainHandDeg}deg)`,
              transformOrigin: 'center center',
              transition: started ? 'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <filter id="handShadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="rgba(0,0,0,0.5)" />
                </filter>
              </defs>
              <polygon points="100,28 97,100 103,100" fill="#fff" filter="url(#handShadow)" />
              <circle cx="100" cy="100" r="4" fill="#fff" />
              <circle cx="100" cy="100" r="1.5" fill="#0f1522" />
            </svg>
          </div>
        </div>
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 100%)',
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.08)',
          }}
        />
      </div>
    </motion.div>
  );
};

export const TimeDashboard: React.FC<TimeDashboardProps> = ({
  userId,
  profile,
  isFreeUser = false,
  logbookConnected = false,
}) => {
  const [hours, setHours] = useState<FlightHoursData>(DEFAULT_HOURS);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });
  const { callApi } = useWorkerAuth();

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
        console.error('[TimeDashboard] fetch error:', err);
      }
    };
    fetch();
  }, [isInView, userId, callApi, profile]);

  return (
    <div ref={ref} className="space-y-4">
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
        <div className="w-full self-start" style={{ transform: 'scale(0.70)', transformOrigin: 'center top' }}>
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
          <AltimeterGauge
            rawHours={hours.totalTime}
            label="Altitude"
            sub={isFreeUser ? 'UNVERIFIED' : ''}
            started={isInView}
            delay={2}
          />
        </div>
      </div>
    </div>
  );
};

export default TimeDashboard;
