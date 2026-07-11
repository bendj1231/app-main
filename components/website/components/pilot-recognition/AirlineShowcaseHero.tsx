import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, Clock, Plane } from 'lucide-react';
import type { Airline } from '@/portal/pages/PortalAirlineExpectationsPage';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface AirlineShowcaseHeroProps {
  airline: Airline;
  hasRecognitionAccess?: boolean;
  onClear?: () => void;
}

export const AirlineShowcaseHero: React.FC<AirlineShowcaseHeroProps> = ({
  airline,
  hasRecognitionAccess = false,
  onClear,
}) => {
  const image = airline.heroImage;
  const fleetCount = airline.fleetWithEndOfService
    ? airline.fleetWithEndOfService.length
    : airline.fleet
      ? airline.fleet.split(',').length
      : 0;

  const getSalaryRange = (a: Airline) =>
    hasRecognitionAccess && a.salaryRangeDetailed ? a.salaryRangeDetailed : a.salaryRange;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 'clamp(480px, 65vh, 720px)' }}
    >
      {/* Background image + gradient layer with shared bottom dissolve */}
      <div
        className="absolute inset-0"
        style={{
          maskImage:
            'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 72%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 72%, rgba(0,0,0,0) 100%)',
        }}
      >
        {image ? (
          <motion.div
            key={airline.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url('${image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900" />
        )}

        {/* Bottom gradient for readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(2, 6, 23, 0.92) 0%, rgba(15, 23, 42, 0.45) 45%, rgba(15, 23, 42, 0.1) 70%, transparent 100%)',
          }}
        />
      </div>

      {/* Top-left info panel */}
      <div
        className="absolute top-4 left-4 md:top-6 md:left-6 z-10"
        style={{
          background: 'rgba(15, 23, 42, 0.72)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          maxWidth: '360px',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          {airline.logo && (
            <img
              src={airline.logo}
              alt={airline.name}
              className="h-5 md:h-6 w-auto object-contain brightness-0 invert opacity-90"
            />
          )}
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
            {airline.region}
          </span>
        </div>

        <motion.h1
          key={`${airline.id}-name`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.1 }}
          className="text-2xl md:text-3xl font-serif font-normal text-white leading-tight mb-2"
        >
          {airline.name}
        </motion.h1>

        <motion.p
          key={`${airline.id}-desc`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.2 }}
          className="text-xs md:text-sm text-white/80 leading-relaxed line-clamp-3 mb-3"
        >
          {airline.description}
        </motion.p>

        <div className="flex flex-wrap gap-1.5">
          {airline.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-semibold bg-white/10 text-white/90 px-2 py-0.5 rounded-full border border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom center spec badges */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center justify-end pb-10 md:pb-14 px-4">
        <motion.div
          key={`${airline.id}-specs`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 md:gap-3"
        >
          <div
            className="flex flex-col items-center justify-center min-w-[90px] px-3 py-2 rounded-xl"
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <div className="flex items-center gap-1 text-[9px] uppercase tracking-[0.15em] text-white/60 mb-1">
              <MapPin className="w-3 h-3" />
              Location
            </div>
            <div className="text-xs md:text-sm font-semibold text-white text-center">
              {airline.location}
            </div>
          </div>

          <div
            className="flex flex-col items-center justify-center min-w-[90px] px-3 py-2 rounded-xl"
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <div className="flex items-center gap-1 text-[9px] uppercase tracking-[0.15em] text-white/60 mb-1">
              <DollarSign className="w-3 h-3" />
              Salary
            </div>
            <div className="text-xs md:text-sm font-semibold text-white text-center">
              {getSalaryRange(airline)}
            </div>
          </div>

          <div
            className="flex flex-col items-center justify-center min-w-[90px] px-3 py-2 rounded-xl"
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <div className="flex items-center gap-1 text-[9px] uppercase tracking-[0.15em] text-white/60 mb-1">
              <Clock className="w-3 h-3" />
              Hours
            </div>
            <div className="text-xs md:text-sm font-semibold text-white text-center">
              {airline.flightHours}
            </div>
          </div>

          <div
            className="flex flex-col items-center justify-center min-w-[90px] px-3 py-2 rounded-xl"
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <div className="flex items-center gap-1 text-[9px] uppercase tracking-[0.15em] text-white/60 mb-1">
              <Plane className="w-3 h-3" />
              Fleet
            </div>
            <div className="text-xs md:text-sm font-semibold text-white text-center">
              {fleetCount} Aircraft
            </div>
          </div>
        </motion.div>

        {onClear && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            onClick={onClear}
            className="mt-4 px-4 py-1.5 text-xs font-medium text-white/80 hover:text-white border border-white/30 hover:border-white/50 rounded-full backdrop-blur-sm transition-all"
          >
            Back to search
          </motion.button>
        )}
      </div>
    </div>
  );
};
