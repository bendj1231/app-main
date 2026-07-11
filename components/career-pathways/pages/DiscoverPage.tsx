import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Search, X } from 'lucide-react';
import { AircraftShowcaseHero } from '@/components/website/components/pilot-recognition/AircraftShowcaseHero';
import { ManufacturerAircraftCarousel } from '@/components/website/components/pilot-recognition/ManufacturerAircraftCarousel';
import {
  aircraftTypeRatings,
  manufacturers,
  type AircraftTypeRating,
} from '@/data/aircraft-manufacturers';

export const DiscoverPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState<AircraftTypeRating | null>(null);
  const [manufacturerLogoError, setManufacturerLogoError] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);
  const recommendedManufacturer = useMemo(
    () => manufacturers.find((m) => m.id === 'embraer') || manufacturers[0],
    []
  );

  const additionalPathways = useMemo(() => {
    const ids = new Set(['a320-200', 'b737-max', 'cessna-172', 'atr-72-600', 'crj900']);
    return aircraftTypeRatings.filter((a) => ids.has(a.id));
  }, []);

  useEffect(() => {
    if (selectedAircraft && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedAircraft]);

  const handleSelectAircraft = (aircraft: AircraftTypeRating) => {
    setSelectedAircraft(aircraft);
    setManufacturerLogoError(false);
  };

  const aircraftImage = selectedAircraft
    ? selectedAircraft.images?.[0] || selectedAircraft.image
    : null;

  const selectedManufacturer = useMemo(
    () =>
      (selectedAircraft && manufacturers.find((m) => m.id === selectedAircraft.manufacturer_id)) ||
      recommendedManufacturer,
    [selectedAircraft, recommendedManufacturer]
  );

  const MANUFACTURER_LOGO_OVERRIDES: Record<string, string> = {
    embraer: '/images/manufacturer-logos/regional-aircraft/embraer-logo.svg',
    bombardier: '/images/manufacturer-logos/regional-aircraft/bombardier-logo.svg',
  };

  const getManufacturerLogoPath = (manufacturerId: string, category: string) => {
    const folderMap: Record<string, string> = {
      commercial: 'commercial-jets',
      flagship: 'commercial-jets',
      private: 'business-private-jets',
      'business-jet': 'business-private-jets',
      regional: 'regional-aircraft',
      helicopter: 'helicopters',
      military: 'military-defense',
      agricultural: 'agricultural-utility',
      'single-engine': 'general-aviation',
      'twin-engine-piston': 'general-aviation',
      'high-performance': 'general-aviation',
      'light-sport': 'general-aviation',
      experimental: 'evtol-uam',
      evtol: 'evtol-uam',
      survey: 'survey-utility',
    };
    const folder = folderMap[category] || 'general-aviation';
    return `/images/manufacturer-logos/${folder}/${manufacturerId}-logo.png`;
  };

  const manufacturerLogoSrc =
    selectedManufacturer?.logo ||
    MANUFACTURER_LOGO_OVERRIDES[selectedAircraft?.manufacturer_id || ''] ||
    (selectedAircraft
      ? getManufacturerLogoPath(selectedAircraft.manufacturer_id, selectedAircraft.category)
      : null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <div className="relative w-full">
        <AircraftShowcaseHero
          showOverlay={false}
          heroTitle="Discover exclusive pathways"
          heroCtaLabel="Explore"
          onHeroCta={() => navigate('/type-ratings')}
        />

        {/* Two CTA rectangles along the bottom of the hero */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/type-ratings')}
            className="group flex-1 h-40 rounded-xl bg-slate-900/60 hover:bg-slate-800/70 border border-white/10 hover:border-white/20 backdrop-blur-md p-5 flex flex-col justify-between text-left transition-all"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
                Explore
              </p>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase leading-tight">
                New Pathways
              </h3>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-white/80 group-hover:text-white transition-colors">
              View Now
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/recognition-plus')}
            className="group flex-1 h-40 rounded-xl bg-slate-900/60 hover:bg-slate-800/70 border border-white/10 hover:border-white/20 backdrop-blur-md p-5 flex flex-col justify-between text-left transition-all"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400 mb-1">
                Recognition+
              </p>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase leading-tight">
                Get verified first
              </h3>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-white/80 group-hover:text-white transition-colors">
              Operators and airlines prefer pre-screened pilots
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          }}
          className="group relative flex items-center gap-3 w-full max-w-3xl bg-slate-900/90 border border-slate-700 rounded-2xl px-4 py-3.5 shadow-2xl backdrop-blur-md"
        >
          <div className="absolute -inset-1 bg-indigo-500/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search aircraft type, school, job, or pathway..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={() => navigate('/type-ratings')}
            className="shrink-0 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Search
          </button>
        </motion.div>
      </div>

      {/* Recommended pathways carousel */}
      <div className="w-full max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-lg font-bold text-white mb-4">Recommended pathways</h2>
        <ManufacturerAircraftCarousel
          manufacturer={recommendedManufacturer}
          manufacturerId={recommendedManufacturer.id}
          manufacturerName={recommendedManufacturer.name}
          manufacturerLogo={recommendedManufacturer.logo}
          onSelect={handleSelectAircraft}
          selectedId={selectedAircraft?.id}
          floating
          additionalAircraft={additionalPathways}
          leadCardLabel="Get Rated"
          onLeadCardClick={() => {
            setSelectedAircraft(null);
            navigate('/get-rated');
          }}
        />
      </div>

      {/* Selected aircraft hero section */}
      {selectedAircraft && (
        <div ref={detailsRef} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
            }}
            className="relative overflow-hidden min-h-screen"
          >
            <div className="absolute inset-0 z-0">
              {aircraftImage ? (
                <img
                  src={aircraftImage}
                  alt={selectedAircraft.model}
                  className="w-full h-full object-cover"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
            </div>

            <div className="absolute top-0 left-0 z-20 px-6 md:px-12 lg:px-20 pt-12 md:pt-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase leading-[1] tracking-tight">
                {selectedAircraft.model}
              </h2>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-end min-h-screen px-6 md:px-12 lg:px-20 pt-32 pb-12 md:pb-20">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                {manufacturerLogoSrc && !manufacturerLogoError ? (
                  <img
                    src={manufacturerLogoSrc}
                    alt={selectedManufacturer?.name || ''}
                    className="h-16 md:h-24 lg:h-28 w-auto object-contain brightness-0 invert"
                    onError={() => setManufacturerLogoError(true)}
                  />
                ) : selectedManufacturer?.name ? (
                  <div className="flex items-center justify-center h-16 md:h-24 lg:h-28 w-24 md:w-36 lg:w-40 rounded-2xl bg-white/10 border border-white/20">
                    <span className="text-xl md:text-2xl font-black text-white uppercase text-center px-2">
                      {selectedManufacturer.name}
                    </span>
                  </div>
                ) : null}

                <div className="max-w-4xl text-center space-y-5">
                  <p className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-slate-300">
                    Pathways <span className="mx-2 text-slate-500">/</span>{' '}
                    {selectedAircraft.category}
                  </p>

                  <p className="text-base md:text-lg text-slate-200 leading-relaxed max-w-xl mx-auto">
                    {selectedAircraft.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                    <button
                      onClick={() => navigate('/type-ratings')}
                      className="group inline-flex items-center gap-2.5 px-6 py-2.5 bg-white hover:bg-slate-200 text-slate-950 text-sm md:text-base font-bold rounded-full transition-colors"
                    >
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-950 text-white">
                        <Play className="w-3 h-3 fill-current" />
                      </span>
                      View full pathway
                    </button>
                    <button
                      onClick={() => setSelectedAircraft(null)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-transparent hover:bg-white/10 text-white text-sm md:text-base font-bold rounded-full border border-white/30 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Close
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-5 pt-2">
                    <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-300">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {selectedAircraft.certification.authority}
                    </div>
                    <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-300">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      {selectedAircraft.specifications.capacity} seats
                    </div>
                    <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-300">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {selectedAircraft.specifications.range}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;
