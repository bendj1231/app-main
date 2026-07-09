import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  aircraftTypeRatings,
  manufacturers,
  type AircraftTypeRating,
  type Manufacturer,
} from '@/data/aircraft-manufacturers';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface FeaturedAircraft {
  aircraft: AircraftTypeRating;
  manufacturer: Manufacturer | undefined;
}

// Score aircraft by newness + popularity; higher is better
const scoreAircraft = (a: AircraftTypeRating): number => {
  const year = typeof a.first_flight === 'number' ? a.first_flight : 0;
  const operators = a.operator_count || 0;
  const pilots = a.pilot_count || 0;
  const career = a.careerScore || 0;
  // Reward recent aircraft and those with strong operator/pilot/career metrics
  const recency = Math.max(0, (year - 1970) * 2);
  const popularity = Math.log10(Math.max(operators + pilots, 10)) * 30;
  return recency + popularity + career;
};

// Pick a diverse, randomized set of featured aircraft from various manufacturers
const buildFeaturedList = (): FeaturedAircraft[] => {
  // Group valid aircraft by manufacturer
  const byManufacturer = new Map<string, AircraftTypeRating[]>();
  for (const aircraft of aircraftTypeRatings) {
    if (!aircraft || !aircraft.manufacturer_id || !aircraft.image) continue;
    const list = byManufacturer.get(aircraft.manufacturer_id) || [];
    list.push(aircraft);
    byManufacturer.set(aircraft.manufacturer_id, list);
  }

  const selected: FeaturedAircraft[] = [];

  // Pick one aircraft per manufacturer, weighted toward newer/popular models
  for (const [manufacturerId, aircraftList] of byManufacturer) {
    const scored = aircraftList.map((a) => ({
      aircraft: a,
      score: scoreAircraft(a) + Math.random() * 50,
    }));
    scored.sort((a, b) => b.score - a.score);

    // Take the top 3 scoring aircraft for this manufacturer and pick one at random
    const top = scored.slice(0, 3);
    const pick = top[Math.floor(Math.random() * top.length)];
    if (pick) {
      selected.push({
        aircraft: pick.aircraft,
        manufacturer: manufacturers.find((m) => m.id === manufacturerId),
      });
    }
  }

  // Shuffle so the order varies on each load
  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }

  return selected;
};

const getYear = (value: string | number | undefined): string => {
  if (value === undefined || value === null) return '—';
  const parsed = parseInt(String(value).slice(0, 4), 10);
  return Number.isNaN(parsed) ? '—' : String(parsed);
};

export const AircraftShowcaseHero: React.FC = () => {
  const featured = useMemo(() => buildFeaturedList(), []);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (featured.length === 0) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % featured.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const current = featured[index];
  const { aircraft, manufacturer } = current;
  const image = aircraft.images?.[0] || aircraft.image;

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
        <AnimatePresence mode="wait">
          <motion.div
            key={aircraft.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url('${image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </AnimatePresence>

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
          maxWidth: '320px',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          {manufacturer?.logo && (
            <img
              src={manufacturer.logo}
              alt={manufacturer.name}
              style={{
                width: 28,
                height: 28,
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
              }}
            />
          )}
          <span className="text-xs font-bold uppercase tracking-wider text-white/70">
            {manufacturer?.name || aircraft.manufacturer_id}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
            {aircraft.category.replace(/-/g, ' ')}
          </span>
        </div>
        <h2
          className="text-2xl md:text-3xl font-extrabold text-white mb-1"
          style={{ lineHeight: 1.1 }}
        >
          {aircraft.model}
        </h2>
        <p
          className="text-xs text-white/60 line-clamp-2"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {aircraft.description}
        </p>
      </div>

      {/* Bottom stats row */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'First Flight', value: getYear(aircraft.first_flight) },
              { label: 'Operators', value: aircraft.operator_count?.toLocaleString() || '—' },
              { label: 'Category', value: aircraft.category.replace(/-/g, ' ') },
              {
                label: 'Status',
                value: aircraft.production_status?.replace(/-/g, ' ') || 'In Service',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px',
                  padding: '0.65rem 1rem',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-0.5">
                  {stat.label}
                </div>
                <div className="text-sm md:text-base font-bold text-white capitalize">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex gap-2">
            {featured.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'}`}
                aria-label={`Show aircraft ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
