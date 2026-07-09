import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Calendar, MapPin, Hash, Award, ChevronRight } from 'lucide-react';

interface PanelManufacturer {
  id: string;
  name: string;
  logo: string;
  description?: string;
  founded?: number;
  headquarters?: string;
  total_aircraft_count?: number;
  reputation_score?: number;
  why_choose_rating?: string;
  website?: string;
}

interface AboutManufacturerPanelProps {
  manufacturer: PanelManufacturer;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const AboutManufacturerPanel: React.FC<AboutManufacturerPanelProps> = ({ manufacturer }) => {
  const stats = [
    { icon: Calendar, label: 'Founded', value: manufacturer.founded || 'N/A' },
    { icon: MapPin, label: 'Headquarters', value: manufacturer.headquarters || 'N/A' },
    {
      icon: Hash,
      label: 'Aircraft Built',
      value: `${(manufacturer.total_aircraft_count || 0).toLocaleString()}+`,
    },
    { icon: Award, label: 'Reputation', value: `${manufacturer.reputation_score || 0}/100` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
      className="rounded-3xl overflow-hidden backdrop-blur-xl border border-white/10"
      style={{
        background:
          'linear-gradient(180deg, rgba(30, 41, 70, 0.75) 0%, rgba(15, 23, 42, 0.9) 100%)',
        boxShadow:
          '0 24px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Left - Logo panel */}
        <div
          className="lg:w-2/5 p-8 lg:p-12 flex flex-col items-center justify-center relative min-h-[280px] lg:min-h-[420px]"
          style={{
            background:
              'linear-gradient(135deg, rgba(40, 50, 75, 0.5) 0%, rgba(20, 28, 48, 0.7) 100%)',
            borderRight: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, transparent 50%, rgba(15, 23, 42, 0.4) 100%)',
              pointerEvents: 'none',
            }}
          />
          {manufacturer.logo ? (
            <img
              src={manufacturer.logo}
              alt={manufacturer.name}
              style={{
                maxWidth: '220px',
                maxHeight: '120px',
                width: '80%',
                height: 'auto',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <Plane className="w-20 h-20 text-white/20" />
          )}
        </div>

        {/* Right - Content */}
        <div className="lg:w-3/5 p-8 lg:p-10 flex flex-col justify-center">
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400 mb-2">
            Manufacturer
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4 tracking-tight">
            {manufacturer.name}
          </h2>

          {manufacturer.description && (
            <p className="text-sm lg:text-base text-slate-300 leading-relaxed mb-6">
              {manufacturer.description}
            </p>
          )}

          {manufacturer.why_choose_rating && (
            <div
              className="mb-6 p-4 rounded-xl"
              style={{
                background: 'rgba(14, 165, 233, 0.1)',
                border: '1px solid rgba(14, 165, 233, 0.2)',
              }}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
                Why choose a {manufacturer.name} rating?
              </p>
              <p className="text-sm text-slate-200 leading-relaxed">
                {manufacturer.why_choose_rating}
              </p>
            </div>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-3 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div className="flex items-center gap-1.5 mb-1.5 text-slate-400">
                  <stat.icon className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
                <p className="text-sm font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          {manufacturer.website && (
            <a
              href={manufacturer.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors"
            >
              Visit official website
              <ChevronRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};
