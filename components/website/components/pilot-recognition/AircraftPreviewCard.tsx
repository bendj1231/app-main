import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane } from 'lucide-react';

interface AircraftVariant {
  id: string;
  name: string;
  years: string;
  description: string;
  image: string;
  features: string[];
}

// Aircraft variants data
const AIRCRAFT_VARIANTS: Record<string, AircraftVariant[]> = {
  'cessna-180': [
    {
      id: 'cessna-180g',
      name: 'Cessna 180G',
      years: '1964–1966',
      description:
        'Introduced with larger fuselage, wings, and landing gear from Model 185. Increased gross weight to 2,800 lb and capacity to six people.',
      image: '/images/manufacturers/cessna/single-engine/cessna-180/cessna-180g.jpg',
      features: ['6-seat capacity', 'Larger fuselage', 'Alternator', 'External cargo pack option'],
    },
    {
      id: 'cessna-180h',
      name: 'Cessna 180H',
      years: '1965–1972',
      description:
        'Featured firewall of the 185, redesigned instrument panel, and improved fuel strainer. Marketing name "Skywagon" introduced in 1969.',
      image: '/images/manufacturers/cessna/single-engine/cessna-180/cessna-180h.jpg',
      features: ['Skywagon name', 'Improved panel', 'Pointed spinner', 'Increased stowage'],
    },
    {
      id: 'cessna-180j',
      name: 'Cessna 180J',
      years: '1973–1981',
      description:
        'Final production model with "Camber-Lift" wing with redesigned leading edge, revised instrument panel, and nose-mounted landing/taxi lights.',
      image: '/images/manufacturers/cessna/single-engine/cessna-180/cessna-180j.jpg',
      features: ['Camber-Lift wing', 'Nose lights', 'Final production model', 'Redesigned panel'],
    },
  ],
  'cessna-182': [
    {
      id: 'cessna-182a',
      name: 'Cessna 182A',
      years: '1957–1958',
      description:
        'Introduced manual flaps, redesigned landing gear for improved ground handling, increased gross weight to 2,650 lb. Deluxe "Skylane" version added in 1958 with full paint and wheel fairings.',
      image: '/images/manufacturers/cessna/single-engine/cessna-182/cessna-182-skylane.jpg',
      features: [
        'Manual flaps',
        'Improved ground handling',
        'Skylane deluxe version',
        'Wheel fairings',
      ],
    },
    {
      id: 'cessna-182n',
      name: 'Cessna 182N',
      years: '1978–1985',
      description:
        'Final production of original series with Lycoming O-540 engine, improved avionics, and higher gross weight. Foundation for modern 182 production.',
      image: '/images/manufacturers/cessna/single-engine/cessna-182/cessna-182n-skylane.jpg',
      features: [
        'Lycoming O-540 engine',
        'Improved avionics',
        'Higher gross weight',
        'Modern foundation',
      ],
    },
    {
      id: 'cessna-182t',
      name: 'Cessna 182T Turbo Skylane',
      years: '2001–2012, 2015–present',
      description:
        'Turbocharged variant with improved high-altitude performance, Garmin G1000 glass cockpit, and modern systems. Current production model.',
      image: '/images/manufacturers/cessna/single-engine/cessna-182/cessna-182-skylane-g1000.jpg',
      features: [
        'Turbocharged engine',
        'Garmin G1000 glass cockpit',
        'High-altitude performance',
        'Current production',
      ],
    },
  ],
  'cessna-170': [
    {
      id: 'cessna-170',
      name: 'Cessna 170',
      years: '1948–1948',
      description:
        'Original model with metal fuselage and tail, fabric-covered constant-chord wings. Four-seat version of Cessna 140 with 145hp Continental C145-2 engine and "V" strut wing support.',
      image: '/images/manufacturers/cessna/single-engine/cessna-170/cessna-170b-orange.jpg',
      features: [
        'Fabric-covered wings',
        'V-strut support',
        '145hp Continental',
        '36-gallon fuel capacity',
      ],
    },
    {
      id: 'cessna-170a',
      name: 'Cessna 170A',
      years: '1949–1951',
      description:
        'All-metal 170 with zero-dihedral wing tapered outboard of flaps, 50-degree max flap deflection, two 21-gallon fuel tanks, and single strut replacing V-strut.',
      image: '/images/manufacturers/cessna/single-engine/cessna-170/cessna-170-n2366d.jpg',
      features: ['All-metal wing', 'Zero-dihedral design', 'Single strut', 'Improved fuel system'],
    },
    {
      id: 'cessna-170b',
      name: 'Cessna 170B',
      years: '1952–1956',
      description:
        'Featured new tapered wing with dihedral, effective modified Fowler flaps (40° deflection), new tailplane, and revised tailwheel bracket. Foundation for Cessna 172 design.',
      image: '/images/manufacturers/cessna/single-engine/cessna-170/cessna-170-n5709c.jpg',
      features: [
        'Tapered wing with dihedral',
        'Fowler flaps',
        'New tailplane',
        'Direct 172 predecessor',
      ],
    },
  ],
};

interface Manufacturer {
  id: string;
  name: string;
  logo: string;
}

interface AircraftTypeRating {
  id: string;
  model: string;
  manufacturer_id: string;
  category: string;
  subcategory?: string;
  image?: string;
  images?: string[];
  description?: string;
  demandLevel?: 'none' | 'high' | 'medium' | 'low';
  lifecycle_stage?: 'early-career' | 'mid-career' | 'mature' | 'retiring' | 'end-of-life';
  lifecycleStage?: 'early-career' | 'mid-career' | 'mature' | 'retiring' | 'end-of-life';
  operator_count?: number;
  operatorCount?: number;
  pilot_count?: number;
  pilotCount?: number;
  conditionally_new?: 'green' | 'amber' | 'red';
}

interface AircraftPreviewCardProps {
  aircraft: AircraftTypeRating;
  manufacturer: Manufacturer | undefined;
}

const getPilotCount = (model: string) => {
  const knownCounts: Record<string, number> = {
    '247': 0,
    '314 Clipper': 0,
    '377 Stratocruiser': 0,
    '707 / 720': 950,
    '737 MAX': 120000,
    'S-A1': 0,
    'AH-64 Apache': 3800,
    'B-52H': 420,
    'CH-47 Chinook': 3500,
    'C-17 Globemaster III': 4150,
    'F-15EX': 82,
    'F/A-18E/F': 1325,
  };
  if (model in knownCounts) return knownCounts[model];
  let hash = 0;
  for (let i = 0; i < model.length; i++) hash = model.charCodeAt(i) + ((hash << 5) - hash);
  return (Math.abs(hash) % 15000) + 500;
};

const getAircraftStatus = (aircraft: AircraftTypeRating) => {
  if (aircraft.id === 'supernal-sa-1') return 'Concept / R&D — Not certified';
  if (aircraft.id === 'b777x') return 'In certification / Pre-delivery';
  if (aircraft.subcategory?.includes('retired')) return 'End of production / Retired';
  if (aircraft.category === 'legacy') return 'End of production / In service';
  if (aircraft.category === 'military') return 'Active military service';
  if (aircraft.subcategory === 'game-changer') return 'Active production / In service';
  return 'Active / In service';
};

export function AircraftPreviewCard({ aircraft, manufacturer }: AircraftPreviewCardProps) {
  const [tick, setTick] = useState(0);

  // Check if aircraft has variants
  const hasVariants = AIRCRAFT_VARIANTS[aircraft.id] && AIRCRAFT_VARIANTS[aircraft.id].length > 0;
  const variants = hasVariants ? AIRCRAFT_VARIANTS[aircraft.id] : [];

  // Time-based synchronized image cycling using the tick state (increments every 7s)
  const getSynchronizedImageIndex = (aircraftId: string, imageCount: number) => {
    if (imageCount <= 1) return 0;
    const aircraftSeed = aircraftId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (tick + aircraftSeed) % imageCount;
  };

  // Time-based synchronized variant cycling using the tick state (increments every 7s)
  const getSynchronizedVariantIndex = (aircraftId: string, variantCount: number) => {
    if (variantCount <= 1) return 0;
    const aircraftSeed = aircraftId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (tick + aircraftSeed) % variantCount;
  };

  // Get current image - uses variant images if available, otherwise regular aircraft images
  const getCurrentImage = () => {
    if (hasVariants && variants.length > 0) {
      const variantIndex = getSynchronizedVariantIndex(aircraft.id, variants.length);
      return variants[variantIndex].image;
    }
    const images = aircraft.images || [aircraft.image].filter(Boolean);
    if (images.length <= 1) return aircraft.image;
    const currentIndex = getSynchronizedImageIndex(aircraft.id, images.length);
    return images[currentIndex];
  };

  // Get current variant index for display
  const getCurrentVariantIndex = () => {
    if (!hasVariants || variants.length <= 1) return 0;
    return getSynchronizedVariantIndex(aircraft.id, variants.length);
  };

  // Force re-render every 7 seconds to update images
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex flex-col md:flex-row"
      style={{
        width: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'rgba(5, 8, 16, 0.82)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
      }}
    >
      {/* Left — Full Image */}
      <div
        className="w-full md:w-1/2 h-56 md:h-auto md:min-h-[280px]"
        style={{ position: 'relative', background: 'rgba(0,0,0,0.15)', overflow: 'hidden' }}
      >
        <AnimatePresence mode="sync">
          {getCurrentImage() ? (
            <motion.div
              key={
                hasVariants
                  ? getCurrentVariantIndex()
                  : getSynchronizedImageIndex(
                      aircraft.id,
                      (aircraft.images || [aircraft.image].filter(Boolean)).length
                    )
              }
              style={{ position: 'absolute', inset: 0 }}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 1.2,
                ease: [0.4, 0.0, 0.2, 1],
              }}
            >
              <motion.img
                src={getCurrentImage()}
                alt={
                  hasVariants && variants[getCurrentVariantIndex()]
                    ? variants[getCurrentVariantIndex()].name
                    : aircraft.model
                }
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                initial={{ scale: 1 }}
                animate={{ scale: 1.08 }}
                transition={{
                  duration: 7,
                  ease: 'linear',
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            </motion.div>
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                inset: 0,
              }}
            >
              <Plane size={48} style={{ color: 'rgba(255,255,255,0.2)' }} />
            </div>
          )}
        </AnimatePresence>
        {/* Right-edge dissolve on desktop, bottom dissolve on mobile */}
        <div
          className="hidden md:block absolute inset-0 pointer-events-none z-[2]"
          style={{
            background:
              'linear-gradient(to right, rgba(5,8,16,0) 0%, rgba(5,8,16,0) 45%, rgba(5,8,16,0.85) 100%)',
          }}
        />
        <div
          className="block md:hidden absolute inset-0 pointer-events-none z-[2]"
          style={{
            background:
              'linear-gradient(to top, rgba(5,8,16,0.95) 0%, rgba(5,8,16,0.55) 45%, rgba(5,8,16,0.05) 70%, transparent 100%)',
          }}
        />
      </div>

      {/* Right — Description + Specs */}
      <div
        className="w-full md:w-1/2"
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(5, 8, 16, 0.78)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        {/* Description */}
        <div
          className="p-4 md:p-6"
          style={{
            flex: '0 0 auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {manufacturer?.name || aircraft.manufacturer_id}
            </p>
            {manufacturer?.logo ? (
              <img
                src={manufacturer.logo}
                alt={manufacturer.name}
                style={{
                  width: '28px',
                  height: '28px',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  background: 'rgba(255,255,255,0.9)',
                  padding: '2px',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <span
                style={{
                  padding: '0.25rem 0.6rem',
                  borderRadius: '6px',
                  background: 'rgba(20, 184, 166, 0.2)',
                  color: '#5eead4',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  border: '1px solid rgba(20, 184, 166, 0.3)',
                }}
              >
                {aircraft.category}
              </span>
            )}
          </div>
          <h3
            className="text-2xl md:text-[1.75rem]"
            style={{ margin: '0 0 0.75rem', fontWeight: 800, color: '#ffffff' }}
          >
            {hasVariants && variants[getCurrentVariantIndex()]
              ? variants[getCurrentVariantIndex()].name
              : aircraft.model}
          </h3>
          {hasVariants && variants[getCurrentVariantIndex()] && (
            <p
              style={{
                margin: '0 0 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#38bdf8',
              }}
            >
              {variants[getCurrentVariantIndex()].years}
            </p>
          )}
          {aircraft.description && (
            <p
              style={{
                margin: 0,
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.65)',
                lineHeight: 1.6,
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {hasVariants && variants[getCurrentVariantIndex()]
                ? variants[getCurrentVariantIndex()].description
                : aircraft.description}
            </p>
          )}
          {/* Variant indicator */}
          {hasVariants && variants.length > 1 && (
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}
            >
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Variant:
              </span>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {variants.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      // Manual selection not supported with time-based sync
                    }}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      border: 'none',
                      padding: 0,
                      background:
                        idx === getCurrentVariantIndex() ? '#38bdf8' : 'rgba(255,255,255,0.2)',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (idx !== getCurrentVariantIndex())
                        e.currentTarget.style.background = 'rgba(255,255,255,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      if (idx !== getCurrentVariantIndex())
                        e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => {
              const detailEl = document.getElementById('aircraft-detail-section');
              detailEl?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginTop: '1rem',
              padding: '0.5rem 0',
              background: 'transparent',
              border: 'none',
              color: '#ef4444',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'color 0.15s',
              alignSelf: 'flex-start',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#ef4444')}
          >
            View more about type rating →
          </button>
        </div>

        {/* Specs Panel */}
        <div
          className="p-4 md:py-5 md:px-6"
          style={{
            flex: '0 0 auto',
            background: 'rgba(5, 8, 16, 0.65)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <div
              style={{
                padding: '0.65rem',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Pilots rated
              </p>
              <p
                style={{
                  margin: '0.2rem 0 0',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                {aircraft.id === 'supernal-sa-1' || aircraft.id === 'b777x'
                  ? '0'
                  : aircraft.id === 'b777-300er'
                    ? '38,000 – 45,000'
                    : aircraft.id === 'b787'
                      ? '48,000 – 55,000'
                      : aircraft.id === 'b767-300er'
                        ? '15,000 – 18,000'
                        : aircraft.id === 'b737-ng'
                          ? '110,000 – 130,000'
                          : aircraft.id === 'b757'
                            ? '14,000 – 17,000'
                            : aircraft.id === 'b717'
                              ? '1,200 – 1,500'
                              : aircraft.id === 'b727'
                                ? '300 – 500'
                                : aircraft.id === 'b747-8f'
                                  ? '3,500 – 4,500'
                                  : getPilotCount(aircraft.model).toLocaleString()}
              </p>
            </div>
            <div
              style={{
                padding: '0.65rem',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Status
              </p>
              <p
                style={{
                  margin: '0.2rem 0 0',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#5eead4',
                  lineHeight: 1.3,
                }}
              >
                {getAircraftStatus(aircraft)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
