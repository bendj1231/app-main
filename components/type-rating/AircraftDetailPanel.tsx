import React, { useSyncExternalStore } from 'react';
import { Star, ChevronRight, CheckCircle2 } from 'lucide-react';
import { SketchfabThumbnail } from './SketchfabThumbnail';
import { AircraftVariantCarousel } from './AircraftVariantCarousel';
import { calculateCareerScore, type AircraftTypeRating } from '../../utils/careerScoreCalculator';

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  commercial: 'Commercial',
  private: 'Private',
  cargo: 'Cargo',
  regional: 'Regional',
  helicopter: 'Helicopter',
  military: 'Military',
  legacy: 'Legacy (Retired)',
  flagship: 'Flagship',
};

interface AircraftVariant {
  id: string;
  name: string;
  years: string;
  description: string;
  image: string;
  features: string[];
}

interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  url: string;
}

interface HiringRequirement {
  airline_type: string;
  total_flight_time: string;
  multi_engine_turbine_time?: string;
  license: string;
  medical?: string;
  english_proficiency?: string;
}

interface SalaryRange {
  position: string;
  salary: string;
  notes: string;
}

interface ComparisonFeature {
  feature: string;
  a220_100: string;
  a220_300: string;
}

interface AirlineByVariant {
  name: string;
  fleet: string;
  notes: string;
}

// Hook for time-based synchronized cycling (stable during render, updates on interval)
const useTimeBucket = (intervalMs: number) =>
  useSyncExternalStore(
    (callback) => {
      const interval = setInterval(callback, intervalMs);
      return () => clearInterval(interval);
    },
    () => Math.floor(Date.now() / intervalMs),
    () => 0
  );

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

interface AircraftDetailPanelProps {
  selectedAircraft: AircraftTypeRating;
  activeTab: string;
  onTabChange: (tab: string) => void;
  showExtendedInfo: boolean;
  onExtendedInfoToggle: (show: boolean) => void;
  getManufacturer: (
    aircraft: AircraftTypeRating
  ) => { id: string; name: string; logo: string; reputation_score: number } | undefined;
  detailRef: React.RefObject<HTMLDivElement>;
}

export function AircraftDetailPanel({
  selectedAircraft,
  activeTab,
  onTabChange,
  showExtendedInfo: _showExtendedInfo,
  onExtendedInfoToggle,
  getManufacturer,
  detailRef,
}: AircraftDetailPanelProps) {
  const timeBucket = useTimeBucket(7000);

  // Time-based synchronized image cycling (same formula as carousel)
  const getSynchronizedImageIndex = (aircraftId: string, imageCount: number, bucket: number) => {
    if (imageCount <= 1) return 0;
    const aircraftSeed = aircraftId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (bucket + aircraftSeed) % imageCount;
  };

  // Get current image
  const getCurrentImage = () => {
    const images = selectedAircraft.images || [selectedAircraft.image].filter(Boolean);
    if (images.length <= 1) return selectedAircraft.image;
    const currentIndex = getSynchronizedImageIndex(selectedAircraft.id, images.length, timeBucket);
    return images[currentIndex];
  };

  return (
    <div ref={detailRef} className="max-w-7xl mx-auto px-6 mb-12">
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg">
        {/* Hero image with overlay */}
        <div className="relative h-64 md:h-80">
          {selectedAircraft.sketchfab_id ? (
            <SketchfabThumbnail
              sketchfab_id={selectedAircraft.sketchfab_id}
              alt={selectedAircraft.model}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              key={getSynchronizedImageIndex(
                selectedAircraft.id,
                (selectedAircraft.images || [selectedAircraft.image].filter(Boolean)).length,
                timeBucket
              )}
              src={getCurrentImage()}
              alt={selectedAircraft.model}
              className="w-full h-full object-cover transition-opacity duration-500"
              style={{ opacity: 1 }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs font-bold tracking-[0.2em] uppercase text-sky-400 bg-sky-500/20 px-3 py-1 rounded-full border border-sky-400/30`}
              >
                {CATEGORY_LABELS[selectedAircraft.category]}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-2">
              {selectedAircraft.model}
            </h2>
            <div className="flex items-center gap-4 flex-wrap mb-3">
              <span className="flex items-center gap-1.5 text-sky-300 text-sm">
                <img
                  src={getManufacturer(selectedAircraft)?.logo || '/images/set-01-logos/logo.png'}
                  alt="Manufacturer"
                  className="h-4 w-auto object-contain opacity-80"
                />
                {getManufacturer(selectedAircraft)?.name}
              </span>
            </div>
            {/* Indicators */}
            <div className="flex flex-wrap gap-2">
              {selectedAircraft.careerScore ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-sky-500 to-blue-600 text-white border-2 border-sky-400 backdrop-blur-xl shadow-lg">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  Career Score: {selectedAircraft.careerScore}/100
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-sky-500 to-blue-600 text-white border-2 border-sky-400 backdrop-blur-xl shadow-lg">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  Career Score: {calculateCareerScore(selectedAircraft)}/100
                </div>
              )}
              {selectedAircraft.demandLevel && (
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xl border-2 ${
                    selectedAircraft.demandLevel === 'high'
                      ? 'bg-emerald-500 text-white border-emerald-400'
                      : selectedAircraft.demandLevel === 'low'
                        ? 'bg-amber-500 text-white border-amber-400'
                        : 'bg-red-500 text-white border-red-400'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      selectedAircraft.demandLevel === 'high'
                        ? 'bg-white'
                        : selectedAircraft.demandLevel === 'low'
                          ? 'bg-white'
                          : 'bg-white'
                    }`}
                  />
                  Demand:{' '}
                  {selectedAircraft.demandLevel === 'high'
                    ? 'High'
                    : selectedAircraft.demandLevel === 'low'
                      ? 'Low'
                      : 'None'}
                </div>
              )}
              {selectedAircraft.conditionally_new && (
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xl border-2 ${
                    selectedAircraft.conditionally_new === 'green'
                      ? 'bg-emerald-500 text-white border-emerald-400'
                      : selectedAircraft.conditionally_new === 'amber'
                        ? 'bg-amber-500 text-white border-amber-400'
                        : 'bg-red-500 text-white border-red-400'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      selectedAircraft.conditionally_new === 'green'
                        ? 'bg-white'
                        : selectedAircraft.conditionally_new === 'amber'
                          ? 'bg-white'
                          : 'bg-white'
                    }`}
                  />
                  Conditionally New
                </div>
              )}
              {selectedAircraft.lifecycle_stage && (
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xl border-2 ${
                    selectedAircraft.lifecycle_stage === 'early-career'
                      ? 'bg-emerald-500 text-white border-emerald-400'
                      : selectedAircraft.lifecycle_stage === 'mid-career'
                        ? 'bg-amber-500 text-white border-amber-400'
                        : 'bg-red-500 text-white border-red-400'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      selectedAircraft.lifecycle_stage === 'early-career'
                        ? 'bg-white'
                        : selectedAircraft.lifecycle_stage === 'mid-career'
                          ? 'bg-white'
                          : 'bg-white'
                    }`}
                  />
                  Lifecycle:{' '}
                  {selectedAircraft.lifecycle_stage === 'early-career'
                    ? 'Early Career'
                    : selectedAircraft.lifecycle_stage === 'mid-career'
                      ? 'Mid Career'
                      : 'End of Life'}
                </div>
              )}
              {selectedAircraft.operator_count && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500 text-white border-2 border-amber-400 backdrop-blur-xl">
                  <div className="w-2 h-2 rounded-full bg-white" />
                  Operators: {selectedAircraft.operator_count}+
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Aircraft Variants Carousel */}
        {selectedAircraft.id === 'cessna-180' ? (
          <div className="px-6 md:px-8 py-6 bg-slate-50 border-b border-slate-100">
            <AircraftVariantCarousel
              variants={AIRCRAFT_VARIANTS['cessna-180'] || []}
              onVariantClick={() => {
                // TODO: Show variant details modal or navigate to variant page
              }}
            />
          </div>
        ) : (
          AIRCRAFT_VARIANTS[selectedAircraft.id] &&
          AIRCRAFT_VARIANTS[selectedAircraft.id].length > 0 && (
            <div className="px-6 md:px-8 py-6 bg-slate-50 border-b border-slate-100">
              <AircraftVariantCarousel
                variants={AIRCRAFT_VARIANTS[selectedAircraft.id]}
                onVariantClick={() => {
                  // TODO: Show variant details modal or navigate to variant page
                }}
              />
            </div>
          )
        )}

        {/* Info bar — manufacturer + cost + age */}
        <div className="px-6 md:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src={getManufacturer(selectedAircraft)?.logo || '/images/set-01-logos/logo.png'}
              alt={getManufacturer(selectedAircraft)?.name}
              className="h-8 object-contain"
            />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400">Manufacturer</p>
              <p className="text-sm font-semibold text-slate-800">
                {getManufacturer(selectedAircraft)?.name}
              </p>
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">
              First Flight
            </p>
            <p className="text-sm font-semibold text-slate-800">{selectedAircraft.first_flight}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">Category</p>
            <p className="text-sm font-semibold text-slate-800 capitalize">
              {selectedAircraft.category}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">
              Reputation
            </p>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold text-slate-800">
                {getManufacturer(selectedAircraft)?.reputation_score}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 px-6 md:px-8 bg-white">
          <div className="flex gap-1 overflow-x-auto">
            {['Overview', 'Training', 'Hiring', 'Compensation', 'Comparison', 'Variants'].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => onTabChange(tab)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-sky-500 text-sky-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>
        </div>

        {/* Description Section — requirements + specs */}
        <div className="p-6 md:p-8 border-b border-slate-100">
          {activeTab === 'Overview' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Description</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  {selectedAircraft.description}
                </p>

                {selectedAircraft.why_choose_rating && (
                  <>
                    <h3 className="text-lg font-semibold mb-3 text-slate-900">
                      Why Should a Pilot Choose This Rating?
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {selectedAircraft.why_choose_rating}
                    </p>
                    {selectedAircraft.show_career_outlook && (
                      <button
                        onClick={() => onExtendedInfoToggle(true)}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
                      >
                        View Full Career Outlook
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-slate-900">
                  Technical Specifications
                </h3>
                <div className="space-y-2">
                  {selectedAircraft.specifications &&
                    Object.entries(selectedAircraft.specifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between py-2 border-b border-slate-50"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-sm font-medium text-slate-800">{String(value)}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Overview' &&
            selectedAircraft.news &&
            selectedAircraft.news.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-slate-900">Latest News</h3>
                <div className="space-y-3">
                  {selectedAircraft.news.map((news: NewsItem) => (
                    <div
                      key={news.id}
                      className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 text-sm mb-1">
                            {news.title}
                          </h4>
                          <p className="text-xs text-slate-500 mb-2">{news.date}</p>
                          <p className="text-sm text-slate-600">{news.summary}</p>
                        </div>
                        <a
                          href={news.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-600 hover:text-sky-700 text-sm font-medium"
                        >
                          Read More →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {activeTab === 'Training' && selectedAircraft.training_curriculum && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Training Curriculum</h3>
              <div className="space-y-4">
                {selectedAircraft.training_curriculum.map((phase, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{phase.phase}</h4>
                      <span className="text-sm text-sky-600 font-medium">{phase.duration}</span>
                    </div>
                    <ul className="space-y-1">
                      {phase.topics.map((topic, topicIdx) => (
                        <li
                          key={topicIdx}
                          className="flex items-center gap-2 text-sm text-slate-600"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Training' && selectedAircraft.simulator_details && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Simulator Details</h3>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Type</p>
                    <p className="text-sm font-medium text-slate-800">
                      {selectedAircraft.simulator_details.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Locations</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedAircraft.simulator_details.locations.map((loc, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-white px-2 py-1 rounded border border-slate-200"
                        >
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-slate-500 mb-2">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAircraft.simulator_details.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-white px-2 py-1 rounded border border-slate-200"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Training' && selectedAircraft.training_requirements && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-slate-900">Training Requirements</h3>
              <ul className="space-y-2.5 mb-6">
                <li className="flex items-start gap-3 text-sm text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Minimum Flight Hours: {selectedAircraft.training_requirements.minimum_hours}
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Ground School: {selectedAircraft.training_requirements.ground_school_hours} hours
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Simulator Training: {selectedAircraft.training_requirements.simulator_hours} hours
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Flight Training: {selectedAircraft.training_requirements.flight_hours} hours
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'Variants' && (
            <div>
              {AIRCRAFT_VARIANTS[selectedAircraft.id] &&
              AIRCRAFT_VARIANTS[selectedAircraft.id].length > 0 ? (
                <AircraftVariantCarousel
                  variants={AIRCRAFT_VARIANTS[selectedAircraft.id]}
                  onVariantClick={() => {
                    // TODO: Show variant details modal or navigate to variant page
                  }}
                />
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <p className="text-lg">No variants available for this aircraft</p>
                  <p className="text-sm mt-2">Variants will be added soon.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Hiring' && selectedAircraft.hiring_requirements && (
            <div>
              {selectedAircraft.hiring_requirements.airline_specific && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">
                    Hiring Requirements by Airline Type
                  </h3>
                  <div className="space-y-3">
                    {selectedAircraft.hiring_requirements.airline_specific.map(
                      (req: HiringRequirement, idx: number) => (
                        <div
                          key={idx}
                          className="bg-slate-50 rounded-lg p-4 border border-slate-200"
                        >
                          <h4 className="font-semibold text-slate-900 mb-2">{req.airline_type}</h4>
                          <ul className="space-y-1.5 text-sm text-slate-600">
                            <li>
                              <strong>Total Flight Time:</strong> {req.total_flight_time}
                            </li>
                            {req.multi_engine_turbine_time && (
                              <li>
                                <strong>Multi-Engine/Turbine Time:</strong>{' '}
                                {req.multi_engine_turbine_time}
                              </li>
                            )}
                            <li>
                              <strong>License:</strong> {req.license}
                            </li>
                            {req.medical && (
                              <li>
                                <strong>Medical:</strong> {req.medical}
                              </li>
                            )}
                            {req.english_proficiency && (
                              <li>
                                <strong>English Proficiency:</strong> {req.english_proficiency}
                              </li>
                            )}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {selectedAircraft.hiring_requirements.career_opportunities && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">
                    Career Opportunities
                  </h3>
                  <div className="space-y-2 mb-4">
                    {selectedAircraft.hiring_requirements.career_opportunities.sign_on_bonuses && (
                      <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                        <h4 className="text-sm font-semibold text-emerald-800 mb-1">
                          Sign-on Bonuses
                        </h4>
                        <p className="text-xs text-emerald-700">
                          {
                            selectedAircraft.hiring_requirements.career_opportunities
                              .sign_on_bonuses
                          }
                        </p>
                      </div>
                    )}
                    {selectedAircraft.hiring_requirements.career_opportunities
                      .fast_track_command && (
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <h4 className="text-sm font-semibold text-blue-800 mb-1">
                          Fast-Track Command
                        </h4>
                        <p className="text-xs text-blue-700">
                          {
                            selectedAircraft.hiring_requirements.career_opportunities
                              .fast_track_command
                          }
                        </p>
                      </div>
                    )}
                    {selectedAircraft.hiring_requirements.career_opportunities.neo_growth && (
                      <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                        <h4 className="text-sm font-semibold text-emerald-800 mb-1">
                          The Neo Growth
                        </h4>
                        <p className="text-xs text-emerald-700">
                          {selectedAircraft.hiring_requirements.career_opportunities.neo_growth}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Compensation' && selectedAircraft.compensation_data && (
            <div>
              {selectedAircraft.compensation_data.title && (
                <h3 className="text-lg font-semibold mb-3 text-slate-900">
                  {selectedAircraft.compensation_data.title}
                </h3>
              )}
              {selectedAircraft.compensation_data.description && (
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {selectedAircraft.compensation_data.description}
                </p>
              )}
              {selectedAircraft.compensation_data.salary_ranges && (
                <div className="space-y-3">
                  {selectedAircraft.compensation_data.salary_ranges.map(
                    (range: SalaryRange, idx: number) => (
                      <div key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-900">{range.position}</h4>
                          <span className="text-sm font-medium text-emerald-600">
                            {range.salary}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{range.notes}</p>
                      </div>
                    )
                  )}
                </div>
              )}
              {selectedAircraft.compensation_data.benefits && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Benefits</h3>
                  <ul className="space-y-2">
                    {selectedAircraft.compensation_data.benefits.map(
                      (benefit: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          {benefit}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Comparison' && selectedAircraft.comparison_data && (
            <div>
              {selectedAircraft.comparison_data.title && (
                <h3 className="text-lg font-semibold mb-3 text-slate-900">
                  {selectedAircraft.comparison_data.title}
                </h3>
              )}
              {selectedAircraft.comparison_data.common_type_rating && (
                <div className="mb-4 p-3 bg-sky-50 rounded-lg border border-sky-200 text-sm text-sky-700">
                  {selectedAircraft.comparison_data.common_type_rating}
                </div>
              )}
              {selectedAircraft.comparison_data.variant_comparison && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">
                    {selectedAircraft.comparison_data.variant_comparison.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {selectedAircraft.comparison_data.variant_comparison.description}
                  </p>
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm text-slate-600 border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="text-left p-2 border border-slate-200 font-semibold">
                            Feature
                          </th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">
                            A220-100 (The "Sports Car")
                          </th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">
                            A220-300 (The "Workhorse")
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedAircraft.comparison_data.variant_comparison.features.map(
                          (feature: ComparisonFeature, idx: number) => (
                            <tr key={idx}>
                              <td className="p-2 border border-slate-200 font-semibold">
                                {feature.feature}
                              </td>
                              <td className="p-2 border border-slate-200">{feature.a220_100}</td>
                              <td className="p-2 border border-slate-200">{feature.a220_300}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {selectedAircraft.comparison_data.airlines_by_variant && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">
                    {selectedAircraft.comparison_data.airlines_by_variant.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    {selectedAircraft.comparison_data.airlines_by_variant.description}
                  </p>
                  <div className="space-y-2">
                    {selectedAircraft.comparison_data.airlines_by_variant.airlines.map(
                      (airline: AirlineByVariant, idx: number) => (
                        <div
                          key={idx}
                          className="bg-slate-50 rounded-lg p-3 border border-slate-200"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-slate-900 text-sm">
                              {airline.name}
                            </span>
                            <span className="text-xs text-slate-500">{airline.fleet}</span>
                          </div>
                          <p className="text-xs text-slate-600">{airline.notes}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
              {selectedAircraft.comparison_data.advice && (
                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h3 className="text-sm font-bold text-amber-800 mb-2">Advice for Pilots</h3>
                  <p className="text-sm text-amber-700">
                    {selectedAircraft.comparison_data.advice}
                  </p>
                </div>
              )}
              {selectedAircraft.comparison_data.pilot_recognition_verdict && (
                <div className="mt-4 p-4 bg-sky-50 rounded-lg border border-sky-200">
                  <h3 className="text-sm font-bold text-sky-800 mb-2">Pilot Recognition Verdict</h3>
                  <p className="text-sm text-sky-700">
                    {selectedAircraft.comparison_data.pilot_recognition_verdict}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
