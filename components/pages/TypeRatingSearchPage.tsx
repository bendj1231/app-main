import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, User, Clock, Award, Shield, ChevronDown } from 'lucide-react';
import { MeshGradient } from '@paper-design/shaders-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';

import {
  fetchTypeRatingNews,
  fetchLatestTypeRatingChanges,
  staticTypeRatingNews,
  staticLatestTypeRatingChanges,
  type TypeRatingNewsArticle,
  type LatestTypeRatingChange,
} from '@/services/newsService';
import { PlatformNavbar } from '@/components/website/components/PlatformNavbar';
import { ManufacturerPreviewCard } from '@/components/website/components/pilot-recognition/ManufacturerPreviewCard';
import { AircraftPreviewCard } from '@/components/website/components/pilot-recognition/AircraftPreviewCard';
import { ManufacturerAircraftCarousel } from '@/components/website/components/pilot-recognition/ManufacturerAircraftCarousel';
import { AircraftLogbookStylePanel } from '@/components/website/components/pilot-recognition/AircraftLogbookStylePanel';
import { AboutManufacturerPanel } from '@/components/website/components/pilot-recognition/AboutManufacturerPanel';
import { AircraftShowcaseHero } from '@/components/website/components/pilot-recognition/AircraftShowcaseHero';
import { safeRedirect } from '@/lib/url-validator';
import {
  manufacturers as rawManufacturers,
  aircraftTypeRatings as rawAircraftTypeRatings,
} from '@/data/aircraft-manufacturers';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Types from D1 schema
interface Manufacturer {
  id: string;
  name: string;
  logo: string;
  hero_image?: string;
  description?: string;
  founded?: number;
  headquarters?: string;
  website?: string;
  reputation_score?: number;
  total_aircraft_count?: number;
  hero_stats?: unknown;
  rating_estimates?: unknown;
}

interface AircraftTypeRating {
  id: string;
  model: string;
  manufacturer_id: string;
  category: string;
  subcategory?: string;
  image?: string;
  sketchfab_id?: string;
  description?: string;
  conditionally_new?: 'green' | 'amber' | 'red';
  first_flight?: string | number;
  why_choose_rating?: string;
  specifications?: Record<string, unknown>;
  news?: unknown;
  training_requirements?: unknown;
  training_curriculum?: unknown;
  simulator_details?: unknown;
  career_info?: unknown;
  hiring_requirements?: unknown;
  compensation_data?: unknown;
  comparison_data?: unknown;
  show_career_outlook?: boolean;
  extended_info_content?: unknown;
  order_backlog?: { orders: number; delivered: number };
  demandLevel?: 'none' | 'high' | 'medium' | 'low';
  lifecycleStage?: 'early-career' | 'mid-career' | 'mature' | 'retiring' | 'end-of-life';
  lifecycle_stage?: 'early-career' | 'mid-career' | 'mature' | 'retiring' | 'end-of-life';
  orderBacklog?: { orders: number; delivered: number };
  operatorCount?: number;
  operator_count?: number;
  pilotCount?: number;
  pilot_count?: number;
  careerScore?: number;
}

// Manufacturer logo mapping — categorized in /images/manufacturer-logos/<category>/
const MANUFACTURER_LOGOS: Record<string, string> = {
  airbus: '/images/manufacturer-logos/commercial-jets/airbus-logo.svg',
  boeing: '/images/manufacturer-logos/commercial-jets/boeing-logo.svg',
  atr: '/images/manufacturer-logos/regional-aircraft/atr-logo.svg',
  embraer: '/images/manufacturer-logos/regional-aircraft/embraer-logo.svg',
  bombardier: '/images/manufacturer-logos/regional-aircraft/bombardier-logo.svg',
  gulfstream: '/images/manufacturer-logos/business-private-jets/gulfstream-logo.svg',
  cessna: '/images/manufacturer-logos/business-private-jets/cessna-logo.svg',
  'dassault-falcon': '/images/manufacturer-logos/business-private-jets/dassault-logo.svg',
  pilatus: '/images/manufacturer-logos/business-private-jets/pilatus-logo.svg',
  beechcraft: '/images/manufacturer-logos/business-private-jets/beechcraft-logo.svg',
  sikorsky: '/images/manufacturer-logos/helicopters/sikorsky-logo.svg',
  leonardo: '/images/manufacturer-logos/helicopters/leonardo-logo.svg',
  'de-havilland': '/images/manufacturer-logos/regional-aircraft/de-havilland-logo.svg',
  'mitsubishi-mrj': '/images/manufacturer-logos/regional-aircraft/mitsubishi-logo.svg',
  'comac-c919': '/images/manufacturer-logos/commercial-jets/comac-logo.svg',
  tecnam: '/images/manufacturer-logos/general-aviation/tecnam-logo.svg',
  piper: '/images/manufacturer-logos/general-aviation/piper-logo.svg',
  cirrus: '/images/manufacturer-logos/general-aviation/cirrus-logo.svg',
  let: '/images/manufacturer-logos/regional-aircraft/let-logo.svg',
  aeroprakt: '/images/manufacturer-logos/general-aviation/aeroprakt-logo.svg',
  antonov: '/images/manufacturer-logos/military-defense/antonov-logo.svg',
  ilyushin: '/images/manufacturer-logos/military-defense/ilyushin-logo.svg',
  'hindustan-aeronautics': '/images/manufacturer-logos/military-defense/hindustan-logo.svg',
  dornier: '/images/manufacturer-logos/military-defense/dornier-logo.svg',
  archer: '/images/manufacturer-logos/evtol-uam/archer-logo.svg',
  joby: '/images/manufacturer-logos/evtol-uam/joby-logo.svg',
  mlg: '/images/manufacturer-logos/other/mlg-logo.svg',
  bell: '/images/manufacturer-logos/helicopters/bell-logo.svg',
  ehang: '/images/manufacturer-logos/evtol-uam/ehang-logo.svg',
  raytheon: '/images/manufacturer-logos/military-defense/raytheon-logo.svg',
  lilium: '/images/manufacturer-logos/evtol-uam/lilium-logo.svg',
  wisk: '/images/manufacturer-logos/evtol-uam/wisk-logo.svg',
  beta: '/images/manufacturer-logos/evtol-uam/beta-logo.svg',
  autoflight: '/images/manufacturer-logos/evtol-uam/autoflight-logo.svg',
  eve: '/images/manufacturer-logos/evtol-uam/eve-logo.svg',
  mooney: '/images/manufacturer-logos/general-aviation/mooney-logo.svg',
  pipistrel: '/images/manufacturer-logos/general-aviation/pipistrel-logo.svg',
  aviat: '/images/manufacturer-logos/general-aviation/aviat-logo.svg',
  'american-champion': '/images/manufacturer-logos/general-aviation/american-champion-logo.svg',
  sling: '/images/manufacturer-logos/general-aviation/sling-logo.svg',
  epic: '/images/manufacturer-logos/business-private-jets/epic-logo.svg',
  socata: '/images/manufacturer-logos/business-private-jets/socata-logo.svg',
  hondajet: '/images/manufacturer-logos/business-private-jets/hondajet-logo.svg',
  airtractor: '/images/manufacturer-logos/agricultural-utility/airtractor-logo.svg',
  thrush: '/images/manufacturer-logos/agricultural-utility/thrush-logo.svg',
  elixir: '/images/manufacturer-logos/general-aviation/elixir-logo.svg',
  icon: '/images/manufacturer-logos/general-aviation/icon-logo.svg',
  waco: '/images/manufacturer-logos/general-aviation/waco-logo.svg',
  vulcanair: '/images/manufacturer-logos/general-aviation/vulcanair-logo.svg',
  mahindra: '/images/manufacturer-logos/general-aviation/mahindra-logo.svg',
  'twin-commander': '/images/manufacturer-logos/business-private-jets/twin-commander-logo.svg',
  'britten-norman': '/images/manufacturer-logos/general-aviation/britten-norman-logo.svg',
  evektor: '/images/manufacturer-logos/general-aviation/evektor-logo.svg',
  bristell: '/images/manufacturer-logos/general-aviation/bristell-logo.svg',
  velocity: '/images/manufacturer-logos/general-aviation/velocity-logo.svg',
  quest: '/images/manufacturer-logos/general-aviation/quest-logo.svg',
  'pacific-aerospace': '/images/manufacturer-logos/general-aviation/pacific-aerospace-logo.svg',
  'aero-east-europe': '/images/manufacturer-logos/general-aviation/aero-east-europe-logo.svg',
  jmb: '/images/manufacturer-logos/general-aviation/jmb-logo.svg',
  foxcon: '/images/manufacturer-logos/general-aviation/foxcon-logo.svg',
  grob: '/images/manufacturer-logos/general-aviation/grob-logo.svg',
  'elroy-air': '/images/manufacturer-logos/autonomous-cargo/elroy-air-logo.svg',
  pyka: '/images/manufacturer-logos/autonomous-cargo/pyka-logo.svg',
  sabrewing: '/images/manufacturer-logos/autonomous-cargo/sabrewing-logo.svg',
  fugro: '/images/manufacturer-logos/survey-utility/fugro-logo.svg',
  supernal: '/images/manufacturer-logos/evtol-uam/supernal-logo.svg',
  'regent-craft': '/images/manufacturer-logos/evtol-uam/regent-craft-logo.svg',
};

// Map hardcoded data file manufacturers to component interface
const HARDCODED_MANUFACTURERS: Manufacturer[] = rawManufacturers.map((m) => ({
  id: m.id,
  name: m.name,
  logo: MANUFACTURER_LOGOS[m.id] || m.logo || '/images/set-01-logos/logo.png',
  hero_image: m.heroImage,
  description: m.description,
  founded: m.founded,
  headquarters: m.headquarters,
  website: m.website,
  reputation_score: m.reputationScore,
  total_aircraft_count: m.totalAircraftCount,
}));

// Map hardcoded data file aircraft to component interface
const HARDCODED_AIRCRAFT: AircraftTypeRating[] = rawAircraftTypeRatings.map(
  (a: AircraftTypeRating) => ({
    id: a.id,
    model: a.model,
    manufacturer_id: a.manufacturer_id,
    category: a.category,
    subcategory: a.subcategory,
    image: a.image,
    sketchfab_id: a.sketchfab_id,
    description: a.description,
    conditionally_new: a.conditionally_new as 'green' | 'amber' | 'red' | undefined,
    first_flight: String(a.first_flight),
    why_choose_rating: a.why_choose_rating,
    specifications: a.specifications,
    demandLevel: a.demandLevel === 'none' ? 'low' : (a.demandLevel as 'high' | 'medium' | 'low'),
    lifecycleStage: a.lifecycle_stage as
      | 'early-career'
      | 'mid-career'
      | 'mature'
      | 'retiring'
      | undefined,
    orderBacklog: a.order_backlog,
    operatorCount: a.operator_count,
    pilotCount: a.pilot_count,
  })
);

// Logo folder categories — matches /images/manufacturer-logos/<category>/
const FOLDER_CATEGORY_LABELS: Record<string, string> = {
  'commercial-jets': 'Commercial Jets',
  'regional-aircraft': 'Regional Aircraft',
  'business-private-jets': 'Business & Private Jets',
  helicopters: 'Helicopters',
  'military-defense': 'Military & Defense',
  'general-aviation': 'General Aviation',
  'evtol-uam': 'eVTOL & UAM',
  'agricultural-utility': 'Agricultural & Utility',
  'autonomous-cargo': 'Autonomous Cargo',
  'survey-utility': 'Survey & Utility',
  other: 'Other',
};

const getManufacturerFolderCategory = (manufacturerId: string): string => {
  const path = MANUFACTURER_LOGOS[manufacturerId];
  if (!path) return 'other';
  const match = path.match(/\/manufacturer-logos\/([^/]+)\//);
  return match ? match[1] : 'other';
};

interface TypeRatingSearchPageProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export default function TypeRatingSearchPage({
  onNavigate,
  onBack: _onBack,
}: TypeRatingSearchPageProps) {
  const { currentUser, userProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const isLoggedIn = !!currentUser;
  const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [aircraftSort, setAircraftSort] = useState<
    'newest' | 'oldest' | 'trending' | 'recommended'
  >('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState<AircraftTypeRating | null>(null);
  const [showExtendedInfo, setShowExtendedInfo] = useState(false);
  const [disclaimerExpanded, setDisclaimerExpanded] = useState(false);
  const [typeRatingNews, setTypeRatingNews] =
    useState<TypeRatingNewsArticle[]>(staticTypeRatingNews);
  const [latestChanges, setLatestChanges] = useState<LatestTypeRatingChange[]>(
    staticLatestTypeRatingChanges
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingManufacturerId, setPendingManufacturerId] = useState<string | null>(null);
  const manufacturerCarouselRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  // Scroll to top when landing on the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Universal search entity tabs
  type EntityType = 'all' | 'manufacturers' | 'airlines' | 'operators' | 'private-jet';
  const [activeEntity, setActiveEntity] = useState<EntityType>('all');
  const [activeEntityCategory, setActiveEntityCategory] = useState<string>('All');

  const ENTITY_TABS: { id: EntityType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'manufacturers', label: 'Manufacturers' },
    { id: 'airlines', label: 'Airlines' },
    { id: 'operators', label: 'Operators' },
    { id: 'private-jet', label: 'Private Jet' },
  ];

  const ENTITY_CATEGORIES: Record<EntityType, string[]> = {
    all: ['All'],
    manufacturers: ['All', ...Array.from(new Set(Object.values(FOLDER_CATEGORY_LABELS))).sort()],
    airlines: ['All', 'International', 'Regional', 'Low-Cost', 'Cargo', 'Legacy'],
    operators: ['All', 'Commercial', 'Corporate', 'Charter', 'Cargo', 'Training'],
    'private-jet': ['All', 'Light', 'Mid-Size', 'Super Mid-Size', 'Large', 'Ultra-Long Range'],
  };

  // Data — manufacturers load immediately from hardcoded data (old version behavior)
  const [manufacturers] = useState<Manufacturer[]>(HARDCODED_MANUFACTURERS);
  const [aircraftTypeRatings, setAircraftTypeRatings] =
    useState<AircraftTypeRating[]>(HARDCODED_AIRCRAFT);
  const [, setDataLoading] = useState(true);

  // Filter manufacturers shown in the carousel by search query and category
  const filteredManufacturers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = manufacturers;
    if (activeEntity === 'manufacturers' && activeEntityCategory !== 'All') {
      result = result.filter(
        (m) => FOLDER_CATEGORY_LABELS[getManufacturerFolderCategory(m.id)] === activeEntityCategory
      );
    }
    if (!query) return result;
    return result.filter((m) => m.name.toLowerCase().includes(query));
  }, [searchQuery, manufacturers, activeEntity, activeEntityCategory]);

  const { callApi } = useWorkerAuth();

  // Fetch aircraft from D1 and merge with hardcoded data
  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        // Fetch aircraft type ratings from D1 and merge
        const aircraftData = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'aircraft_type_ratings',
          operation: 'select',
          limit: 500,
        });
        if (aircraftData && aircraftData.length > 0) {
          // Merge: D1 entries override hardcoded by ID
          const hardcodedIds = new Set(HARDCODED_AIRCRAFT.map((a) => a.id));
          const newD1 = aircraftData.filter(
            (a: Record<string, unknown>) => !hardcodedIds.has(a.id as string)
          );
          setAircraftTypeRatings([...HARDCODED_AIRCRAFT, ...(newD1 as AircraftTypeRating[])]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, [callApi]);

  // Fetch type-rating news from MongoDB Atlas on mount (fallback to static if unavailable)
  useEffect(() => {
    const loadNews = async () => {
      try {
        const [news, changes] = await Promise.all([
          fetchTypeRatingNews(6),
          fetchLatestTypeRatingChanges(6),
        ]);
        setTypeRatingNews(news);
        setLatestChanges(changes);
      } catch (err) {
        console.error('Error fetching type-rating news:', err);
      }
    };

    loadNews();
  }, []);

  // Handle URL parameters for pre-selection
  /* eslint-disable react-hooks/set-state-in-effect -- synchronizes component state with external URL search params */
  useEffect(() => {
    const manufacturerParam = searchParams.get('manufacturer');
    const aircraftParam = searchParams.get('aircraft');
    const searchQueryParam = searchParams.get('search');

    if (searchQueryParam) {
      setSearchQuery(searchQueryParam);
    }

    if (manufacturerParam) {
      const manufacturer = manufacturers.find((m) => m.id === manufacturerParam);
      if (manufacturer) {
        setSelectedManufacturer(manufacturer);
      }
    }

    if (aircraftParam) {
      const aircraft = aircraftTypeRatings.find((a) => a.id === aircraftParam);
      if (aircraft) {
        setSelectedAircraft(aircraft);
      }
    }
  }, [searchParams, manufacturers, aircraftTypeRatings]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Get available categories for selected manufacturer

  // Get categories specifically available for the selected manufacturer
  const manufacturerCategories = React.useMemo(() => {
    if (!selectedManufacturer) return [];
    const categories = new Set<string>();
    aircraftTypeRatings
      .filter((a) => a.manufacturer_id === selectedManufacturer.id)
      .forEach((a) => categories.add(a.category));
    return Array.from(categories).sort();
  }, [selectedManufacturer, aircraftTypeRatings]);

  // Auto-scroll manufacturer carousel (infinite loop)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!manufacturerCarouselRef.current) return;
      const el = manufacturerCarouselRef.current;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: 240, behavior: 'smooth' });
      }
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleSelectAircraftById = (aircraftId: string) => {
    const aircraft = aircraftTypeRatings.find((a) => a.id === aircraftId);
    if (!aircraft) return;
    const manufacturer = manufacturers.find((m) => m.id === aircraft.manufacturer_id);
    setSelectedManufacturer(manufacturer || null);
    setSelectedAircraft(aircraft);
    setTimeout(
      () => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      100
    );
  };

  const handleManufacturerSelect = (manufacturer: Manufacturer) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setPendingManufacturerId(manufacturer.id);

    // Pause auto-scroll during the transition
    if (manufacturerCarouselRef.current) {
      manufacturerCarouselRef.current.style.overflowX = 'hidden';
    }

    setTimeout(() => {
      setSelectedManufacturer(manufacturer);
      setSelectedAircraft(null);
      setSelectedCategory('all');
      setSearchQuery('');
      setTimeout(() => {
        setIsTransitioning(false);
        setPendingManufacturerId(null);
        if (manufacturerCarouselRef.current) {
          manufacturerCarouselRef.current.style.overflowX = 'auto';
        }
      }, 650);
    }, 420);
  };

  const getManufacturer = (aircraft: AircraftTypeRating) => {
    return manufacturers.find((m) => m.id === aircraft.manufacturer_id);
  };

  // Helper function to get manufacturer by ID (for direct access)
  const getManufacturerById = (id: string) => {
    return manufacturers.find((m) => m.id === id);
  };

  return (
    <div className="min-h-screen relative text-slate-900 font-sans">
      {/* MeshGradient Background */}
      <div className="fixed inset-0 z-0">
        <MeshGradient
          className="w-full h-full"
          colors={['#020617', '#0f172a', '#1e293b', '#1e3a5f', '#111827']}
          speed={0.22}
        />
      </div>
      {/* Subtle page tone overlay */}
      <div className="fixed inset-0 bg-slate-900/10 z-0" />

      {/* Top Navigation Bar */}
      <PlatformNavbar
        onNavigate={onNavigate || ((page) => safeRedirect(`/${page}`))}
        currentPage="pathways"
        transparent={!selectedManufacturer && !selectedAircraft}
      />

      {/* Hero Section - outside main, edge-to-edge behind navbar */}
      <div className="relative overflow-hidden z-10">
        {/* Background - dark gradient, only when manufacturer or aircraft selected */}
        {(selectedManufacturer || selectedAircraft) && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 z-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
            {/* Press/media style repeating selected manufacturer logo wall */}
            {selectedManufacturer && (
              <div
                className="absolute inset-0 overflow-hidden z-0 pointer-events-none opacity-[0.22]"
                style={{ filter: 'grayscale(100%) brightness(0) invert(1)' }}
              >
                <div className="space-y-16">
                  {[...Array(12)].map((_, rowIndex) => (
                    <div
                      key={rowIndex}
                      className={`flex gap-24 ${rowIndex % 2 === 1 ? 'pl-32' : ''}`}
                    >
                      {[...Array(14)].map((_, i) => (
                        <img
                          key={`${selectedManufacturer.id}-${rowIndex}-${i}`}
                          src={selectedManufacturer.logo}
                          alt={selectedManufacturer.name}
                          className="h-10 w-auto object-contain flex-shrink-0"
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div
          className={`relative z-10 ${selectedManufacturer || selectedAircraft ? 'max-w-7xl mx-auto px-6 pt-6 pb-4' : ''}`}
        >
          {!selectedManufacturer && !selectedAircraft ? (
            <AircraftShowcaseHero />
          ) : selectedAircraft ? (
            <div className="px-4 md:px-8 lg:px-12">
              <AircraftPreviewCard
                aircraft={selectedAircraft}
                manufacturer={getManufacturerById(selectedAircraft.manufacturer_id)}
              />
            </div>
          ) : (
            <motion.div
              key="manufacturer-preview"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              className="px-4 md:px-8 lg:px-12"
            >
              <ManufacturerPreviewCard manufacturer={selectedManufacturer} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Manufacturer Carousel - sits below the hero section */}
      <div
        className="relative z-20 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl"
        style={{ background: 'rgba(15, 23, 42, 0.15)' }}
      >
        {!selectedManufacturer && (
          <div className="text-center -mt-3 mb-1">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-xl border border-white/20"
              style={{
                background: 'rgba(255,255,255,0.1)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
            >
              <h2 className="text-sm font-serif font-normal text-white drop-shadow-md">
                <>
                  Browse Manufacturers{' '}
                  <span className="text-xs text-white/60">({filteredManufacturers.length})</span>
                </>
              </h2>
            </div>
          </div>
        )}
        <AnimatePresence mode="wait" initial={false}>
          {!selectedManufacturer ? (
            <motion.div
              key="manufacturer-stage"
              ref={manufacturerCarouselRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              className="flex gap-3 overflow-x-auto pt-1 pb-3 px-5 scroll-smooth"
              style={
                {
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch',
                } as React.CSSProperties
              }
            >
              {filteredManufacturers.map((manufacturer, index) => (
                <motion.button
                  key={manufacturer.id}
                  initial={{ opacity: 0, y: 24, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: index * 0.02,
                    duration: 0.45,
                    ease: EASE_OUT_EXPO,
                  }}
                  whileHover={{
                    y: -6,
                    scale: 1.04,
                    borderColor: 'rgba(255,255,255,0.35)',
                    backgroundColor: 'rgba(255,255,255,0.14)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleManufacturerSelect(manufacturer)}
                  disabled={isTransitioning}
                  className="flex-shrink-0 rounded-lg relative overflow-hidden text-left disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    width: '160px',
                    border: '2px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.08)',
                  }}
                >
                  {/* Animated glow overlay on tap */}
                  {isTransitioning && pendingManufacturerId === manufacturer.id && (
                    <motion.div
                      className="absolute inset-0 z-0 rounded-lg"
                      style={{
                        background:
                          'radial-gradient(circle at center, rgba(14,165,233,0.55) 0%, transparent 70%)',
                      }}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: [0, 1, 0.6], scale: [0.5, 1.6, 2.2] }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                    />
                  )}
                  {/* Top: Logo on light background */}
                  <div
                    className="h-[85px] relative overflow-hidden flex items-center justify-center p-3 rounded-t-lg"
                    style={{ background: '#f3f4f6' }}
                  >
                    <motion.img
                      src={manufacturer.logo}
                      alt={manufacturer.name}
                      className="w-full h-full object-contain relative z-10"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  {/* Bottom: Name on dark bg */}
                  <div className="p-3 relative z-10">
                    <p className="text-sm font-bold text-white truncate">{manufacturer.name}</p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Floating Aircraft Cards Section - cinematic edge-to-edge carousel strip */}
      <AnimatePresence mode="wait" initial={false}>
        {selectedManufacturer && (
          <motion.div
            key="floating-aircraft-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-30 py-4"
            style={{
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* Cinematic top light leak */}
            <div
              className="absolute inset-x-0 top-0 h-32 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, rgba(14, 165, 233, 0.08), transparent)',
              }}
            />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />

            <div className="relative">
              <ManufacturerAircraftCarousel
                manufacturer={selectedManufacturer}
                manufacturerId={selectedManufacturer.id}
                manufacturerName={selectedManufacturer.name}
                manufacturerLogo={selectedManufacturer.logo}
                onSelect={(aircraft) => setSelectedAircraft(aircraft)}
                onManufacturerSelect={() => setSelectedAircraft(null)}
                selectedId={selectedAircraft?.id}
                categoryFilter={selectedCategory}
                searchFilter={searchQuery}
                sort={aircraftSort}
                floating
              />

              {/* Search bar + category filter buttons below aircraft carousel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.45, ease: EASE_OUT_EXPO }}
                className="mt-3 flex flex-col items-center gap-3 max-w-5xl mx-auto px-6"
              >
                {/* Long centered search bar */}
                <div className="relative w-full max-w-2xl">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1 z-10">
                    <img
                      src={selectedManufacturer.logo}
                      alt={selectedManufacturer.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search aircraft, manufacturers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-11 py-3 rounded-xl border border-white/30 bg-white/90 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/50 transition-all shadow-lg pl-14"
                  />
                </div>

                {/* Controls row */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedManufacturer(null);
                      setSelectedAircraft(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap backdrop-blur-xl border border-red-500/40 text-white hover:bg-red-500/20 transition-all flex-shrink-0"
                    style={{
                      background: 'rgba(239, 68, 68, 0.85)',
                      boxShadow:
                        '0 4px 16px rgba(239, 68, 68, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
                    }}
                  >
                    <X className="w-3 h-3" />
                    Cancel Filter
                  </button>

                  {/* Category dropdown */}
                  <div className="relative flex-shrink-0">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="appearance-none bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-1.5 pl-3 pr-8 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all cursor-pointer min-w-[110px]"
                      style={{ backgroundColor: 'rgba(59, 130, 246, 1)' }}
                    >
                      <option value="all" className="bg-slate-900 text-white">
                        All
                      </option>
                      {manufacturerCategories.map((category) => (
                        <option
                          key={category}
                          value={category}
                          className="bg-slate-900 text-white capitalize"
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/90 pointer-events-none" />
                  </div>

                  {/* Sort dropdown */}
                  <div className="relative flex-shrink-0">
                    <select
                      value={aircraftSort}
                      onChange={(e) => setAircraftSort(e.target.value as typeof aircraftSort)}
                      className="appearance-none bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-1.5 pl-3 pr-8 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all cursor-pointer"
                      style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                      <option value="newest" className="bg-slate-900 text-white">
                        Newest
                      </option>
                      <option value="oldest" className="bg-slate-900 text-white">
                        Oldest
                      </option>
                      <option value="trending" className="bg-slate-900 text-white">
                        Trending
                      </option>
                      <option value="recommended" className="bg-slate-900 text-white">
                        Recommended
                      </option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/70 pointer-events-none" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 w-full min-h-screen overflow-x-hidden" style={{ paddingTop: '0' }}>
        {/* Search + Entity Tabs area */}
        <div className="relative overflow-hidden pt-4 md:pt-6 lg:pt-8 pb-4 md:pb-6 lg:pb-8 px-4 md:px-6 z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-900/20 via-transparent to-indigo-900/10 pointer-events-none" />

          {/* Search — only in main content when no manufacturer selected (aircraft stage uses carousel search) */}
          {!selectedManufacturer && (
            <div className="max-w-lg mx-auto relative px-2 sm:px-0">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search aircraft, manufacturers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-white/30 bg-white/90 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/50 transition-all shadow-lg"
                />
              </div>
            </div>
          )}

          {/* Universal Search Entity Tabs — frosty glassy UI, hidden in aircraft selection stage */}
          {!selectedManufacturer && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto px-2 sm:px-0">
              {/* Left: Entity selector card */}
              <div
                className="relative rounded-xl overflow-hidden backdrop-blur-2xl"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.35)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                <div className="p-2 text-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-0.5 text-white/80">
                    Discover Pathways
                  </p>
                  <div className="relative flex items-center justify-center">
                    <select
                      value={activeEntity}
                      onChange={(e) => {
                        setActiveEntity(e.target.value as EntityType);
                        setActiveEntityCategory('All');
                      }}
                      className="w-full bg-transparent text-white text-sm font-semibold appearance-none cursor-pointer focus:outline-none pr-6"
                    >
                      {ENTITY_TABS.map((tab) => (
                        <option key={tab.id} value={tab.id} className="bg-slate-900 text-white">
                          {tab.label}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              {/* Right: Category selector card */}
              <div
                className="relative rounded-xl overflow-hidden backdrop-blur-2xl"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.35)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                <div className="p-3 text-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-0.5 text-white/80">
                    Category
                  </p>
                  <div className="relative flex items-center justify-center">
                    <select
                      value={activeEntityCategory}
                      onChange={(e) => setActiveEntityCategory(e.target.value)}
                      className="w-full bg-transparent text-white text-sm font-semibold appearance-none cursor-pointer focus:outline-none pr-6"
                    >
                      {ENTITY_CATEGORIES[activeEntity].map((cat) => (
                        <option key={cat} value={cat} className="bg-slate-900 text-white">
                          {cat}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Read more about manufacturer expectations - positioned at bottom center of hero */}
        {selectedManufacturer && (
          <div className="relative z-10 flex justify-center mb-8">
            <button
              onClick={() => safeRedirect(`/manufacturer/${selectedManufacturer.id}/expectations`)}
              className="bg-white/30 backdrop-blur-xl border border-white/50 px-6 py-3 text-white text-sm font-medium rounded-xl hover:bg-white/40 transition-all shadow-xl"
            >
              Read more about {selectedManufacturer.name} expectations
            </button>
          </div>
        )}

        {/* Dark blue background for content below hero */}
        <div className="relative z-10 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-12">
          {/* Press/media style repeating selected manufacturer logo wall */}
          {selectedManufacturer && (
            <div
              className="absolute -inset-8 overflow-hidden z-0 pointer-events-none opacity-[0.16]"
              style={{ filter: 'grayscale(100%) brightness(0) invert(1)' }}
            >
              <div className="space-y-16">
                {[...Array(18)].map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`flex gap-24 ${rowIndex % 2 === 1 ? 'pl-32' : ''}`}
                  >
                    {[...Array(14)].map((_, i) => (
                      <img
                        key={`${selectedManufacturer.id}-${rowIndex}-${i}`}
                        src={selectedManufacturer.logo}
                        alt={selectedManufacturer.name}
                        className="h-9 w-auto object-contain flex-shrink-0"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="relative z-10">
            {!selectedManufacturer ? (
              // Profile view when no manufacturer is selected
              <div className="max-w-7xl mx-auto px-6 pt-8">
                {isLoggedIn && userProfile ? (
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200 mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <User className="w-6 h-6 text-sky-500" />
                      Your Profile
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* User Info */}
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {userProfile.full_legal_name
                              ? userProfile.full_legal_name.charAt(0).toUpperCase()
                              : userProfile.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">
                              {userProfile.full_legal_name || userProfile.display_name || 'Pilot'}
                            </h4>
                            <p className="text-sm text-slate-500">{userProfile.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Flight Hours */}
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-emerald-500" />
                          <span className="text-sm text-slate-500">Total Flight Hours</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-900">
                          {userProfile.total_flight_hours || userProfile.flight_hours || '0'}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Hours logged</p>
                      </div>

                      {/* Recognition Score */}
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="w-5 h-5 text-yellow-500" />
                          <span className="text-sm text-slate-500">Recognition Score</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-900">
                          {userProfile.recognition_score || userProfile.recognitionScore || 'N/A'}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Industry recognition</p>
                      </div>
                    </div>

                    {/* Additional Profile Details */}
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-slate-200">
                        <div className="text-sm text-slate-500 mb-1">License Type</div>
                        <div className="font-semibold text-slate-900">
                          {userProfile.license_type || userProfile.licenseType || 'CPL/ATPL'}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-slate-200">
                        <div className="text-sm text-slate-500 mb-1">Experience Level</div>
                        <div className="font-semibold text-slate-900">
                          {userProfile.experience_level ||
                            userProfile.experienceLevel ||
                            'Mid-Career'}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-slate-200">
                        <div className="text-sm text-slate-500 mb-1">Country</div>
                        <div className="font-semibold text-slate-900">
                          {userProfile.residing_country ||
                            userProfile.residingCountry ||
                            userProfile.nationality ||
                            'N/A'}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-slate-200">
                        <div className="text-sm text-slate-500 mb-1">Member Since</div>
                        <div className="font-semibold text-slate-900">
                          {userProfile.created_at
                            ? new Date(userProfile.created_at).getFullYear()
                            : '2026'}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="max-w-7xl mx-auto px-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Industry News Section — Type-Rating focused */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                      <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="w-2 h-8 bg-sky-500 rounded-full"></span>
                        Type-Rating News
                      </h3>
                      <div className="space-y-4">
                        {typeRatingNews.map((item, idx) => (
                          <div
                            key={`${item.aircraftId}-${idx}`}
                            className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
                          >
                            <span className="text-xs text-sky-600 font-semibold mb-1 block">
                              {item.date}
                            </span>
                            <h4 className="font-semibold text-slate-900 mb-1">{item.headline}</h4>
                            <p className="text-sm text-slate-600 mb-2">{item.summary}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <p className="text-[10px] text-slate-400 italic">
                                Source: {item.source}
                              </p>
                              <button
                                onClick={() => handleSelectAircraftById(item.aircraftId)}
                                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 transition-colors shadow-sm"
                              >
                                View Type Rating
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Latest Type Rating Changes Section */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                      <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                        Latest Type Rating Changes
                      </h3>
                      <div className="space-y-4">
                        {latestChanges.map((item, idx) => (
                          <div
                            key={`${item.aircraftId}-${idx}`}
                            className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
                          >
                            <span className="text-xs text-emerald-600 font-semibold mb-1 block">
                              {item.tag}
                            </span>
                            <h4 className="font-semibold text-slate-900 mb-1">{item.headline}</h4>
                            <p className="text-sm text-slate-600 mb-2">{item.summary}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <p className="text-[10px] text-slate-400 italic">
                                Source: {item.source}
                              </p>
                              <button
                                onClick={() => handleSelectAircraftById(item.aircraftId)}
                                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm"
                              >
                                View Type Rating
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Manufacturer Overview Stats */}
                <div className="max-w-7xl mx-auto px-6">
                  <div className="mt-8 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-6 border border-sky-200">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                      Manufacturer Overview ({manufacturers.length} Aircraft Manufacturers)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-slate-200">
                        <div className="text-3xl font-bold text-slate-900">200,000+</div>
                        <div className="text-sm text-slate-600">Total Aircraft in Service</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-slate-200">
                        <div className="text-3xl font-bold text-slate-900">500,000+</div>
                        <div className="text-sm text-slate-600">Type-Rated Pilots Worldwide</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-slate-200">
                        <div className="text-3xl font-bold text-slate-900">87</div>
                        <div className="text-sm text-slate-600">Active Type Ratings</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-slate-200">
                        <div className="text-3xl font-bold text-slate-900">150+</div>
                        <div className="text-sm text-slate-600">Training Centers Globally</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Manufacturer details when selected
              <>
                {/* About Manufacturer Panel — shown when no aircraft is selected */}
                {!selectedAircraft && selectedManufacturer && (
                  <div ref={detailRef} className="max-w-7xl mx-auto px-6 mb-12">
                    <AboutManufacturerPanel manufacturer={selectedManufacturer} />
                  </div>
                )}
              </>
            )}

            {/* Selected Aircraft Detail Panel */}
            {selectedAircraft && (
              <div
                id="aircraft-detail-section"
                ref={detailRef}
                className="max-w-7xl mx-auto px-6 mb-12"
              >
                <AircraftLogbookStylePanel
                  aircraft={selectedAircraft}
                  manufacturer={getManufacturer(selectedAircraft)}
                  onShowExtendedInfo={() => setShowExtendedInfo(true)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Extended Info Modal */}
        {showExtendedInfo && selectedAircraft && selectedAircraft.id === 'a220-300' && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
            <div className="min-h-full flex items-start justify-center p-4 pt-10 pb-10">
              <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl relative">
                <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl sticky top-0 z-10">
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedAircraft.model} — Pilot Career Outlook
                  </h2>
                  <button
                    onClick={() => setShowExtendedInfo(false)}
                    className="p-2 rounded-full hover:bg-slate-100 transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold text-sky-700 mb-2">
                      The "Why": Pilot Benefits vs. Other Airbus Ratings
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-2">
                      Unlike the A320 or A350, the A220 was a "clean-sheet" design (originally the
                      Bombardier CSeries). This offers specific advantages:
                    </p>
                    <ul className="space-y-1.5 text-sm text-slate-600">
                      <li>
                        <strong>Modernity:</strong> It features a newer flight deck than the A320.
                        It uses Sidestick controllers and a Fly-By-Wire system, but with the latest
                        tech—including five large LCD screens and an electronic flight bag (EFB)
                        integrated from day one.
                      </li>
                      <li>
                        <strong>Steep Approach Capability:</strong> It is certified for steep
                        approaches (like London City), giving pilots access to challenging,
                        prestigious, and "fun" airports.
                      </li>
                      <li>
                        <strong>Comfort:</strong> Because the cabin altitude is lower and the
                        windows are larger, crew fatigue is often reported as lower compared to
                        older narrow-body fleets.
                      </li>
                      <li>
                        <strong>The CCQ:</strong> While it is a distinct type rating from the A320
                        family, Airbus has worked to harmonize training. For a pilot, having an A220
                        rating is currently a "boutique" skill.
                      </li>
                    </ul>
                  </section>
                  <section>
                    <h3 className="text-lg font-semibold text-sky-700 mb-2">
                      Market Demand & Backlog (Job Security)
                    </h3>
                    <ul className="space-y-1.5 text-sm text-slate-600">
                      <li>
                        <strong>Total Orders:</strong> 959 firm orders from 33–34 different
                        customers.
                      </li>
                      <li>
                        <strong>Remaining Backlog:</strong> Approximately 458 aircraft still waiting
                        to be delivered as of April 2026.
                      </li>
                      <li>
                        <strong>Production Goal:</strong> Airbus is aiming to ramp up to 12 aircraft
                        per month by the end of 2026.
                      </li>
                      <li>
                        <strong>Market Share:</strong> The A220 family holds over 55% market share
                        in its segment.
                      </li>
                    </ul>
                  </section>
                  <section>
                    <h3 className="text-lg font-semibold text-sky-700 mb-2">
                      A220 Pilot Community
                    </h3>
                    <ul className="space-y-1.5 text-sm text-slate-600">
                      <li>
                        <strong>Global Community Size:</strong> Approximately 5,000+ pilots (vs.
                        150,000+ for A320 family).
                      </li>
                      <li>
                        <strong>Pilots Per Aircraft:</strong> Major airlines typically employ 10-12
                        pilots per aircraft.
                      </li>
                      <li>
                        <strong>Major Employers:</strong> Delta Air Lines (85 aircraft), airBaltic
                        (54 aircraft, 1,500+ pilots), JetBlue (61), Air France (55), Breeze Airways
                        (54).
                      </li>
                      <li>
                        <strong>Growth Potential:</strong> The backlog will require approximately
                        4,500-5,500 additional A220-rated pilots.
                      </li>
                      <li>
                        <strong>Certification:</strong> Listed as BD-500 by aviation authorities,
                        covering both A220-100 and A220-300 under a single rating.
                      </li>
                    </ul>
                  </section>
                  <section>
                    <h3 className="text-lg font-semibold text-sky-700 mb-2">
                      Operational Reliability & Reach
                    </h3>
                    <ul className="space-y-1.5 text-sm text-slate-600">
                      <li>
                        <strong>Flight Hours:</strong> The global fleet has surpassed 3.65 million
                        block hours.
                      </li>
                      <li>
                        <strong>Flight Cycles:</strong> Over 2.08 million flights completed.
                      </li>
                      <li>
                        <strong>Route Network:</strong> The A220 currently serves over 1,900 routes
                        to more than 500 destinations.
                      </li>
                      <li>
                        <strong>Reliability:</strong> Maintains a 99% operational reliability
                        (3-month rolling average).
                      </li>
                    </ul>
                  </section>
                  <section>
                    <h3 className="text-lg font-semibold text-sky-700 mb-2">
                      Why Pilots Choose It (Technical Perks)
                    </h3>
                    <ul className="space-y-1.5 text-sm text-slate-600">
                      <li>
                        <strong>Modern Cockpit:</strong> Features five 15.1-inch LCD displays and
                        full Fly-By-Wire technology.
                      </li>
                      <li>
                        <strong>Environmentally Leading:</strong> 25% lower fuel burn and CO2
                        emissions per seat.
                      </li>
                      <li>
                        <strong>Maintenance Intervals:</strong> 1,000 hours for "A" checks and 8,500
                        hours for "C" checks.
                      </li>
                    </ul>
                  </section>
                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                    <h3 className="text-sm font-bold text-sky-800 mb-1 uppercase tracking-wide">
                      Summary for Pilots
                    </h3>
                    <p className="text-sm text-sky-700 leading-relaxed italic">
                      "This aircraft is at the 'peak of its youth.' With over 500 planes in the air
                      and another 450+ on the way, an A220 type rating is one of the most
                      future-proof credentials a pilot can hold right now."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Disclaimer — hidden when extended-info modal is open; foldable on mobile */}
        {!showExtendedInfo && (
          <div className="px-6 md:px-8 pb-6 border-t border-slate-200 pt-5 bg-white relative z-10">
            <div className="p-3 rounded-lg bg-slate-100 border border-slate-300 max-w-7xl mx-auto">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-slate-700 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 mb-1">Data Disclaimer</p>
                  <p
                    className={`text-xs text-slate-800 leading-relaxed md:line-clamp-none ${disclaimerExpanded ? 'line-clamp-none' : 'line-clamp-4'}`}
                  >
                    pilotcareerpathways.com, pilotrecognition.com, and pilotshortage.org are
                    operated by Aviation Pathways Consultancy Ltd. All information regarding
                    aircraft, type ratings, pathway cards, career data, and manufacturer details
                    presented on these platforms is solely an aggregation of information found
                    publicly on the internet, compiled for educational, career-alignment, and
                    industry-familiarization purposes. Wherever possible, information is labeled
                    with its source or citation. Aviation Pathways Consultancy Ltd, the claimant,
                    owner, or authorized representative of any manufacturer, airline, or training
                    organization may request to verify, update, or correct information in the
                    interest of transparency and informational safety for pilots. Airline,
                    manufacturer, and third-party logos, trademarks, and branding are used under
                    fair-use principles solely for identification and informational purposes. No
                    airline, manufacturer, or regulator has verified, endorsed, or approved the
                    information on this platform unless explicitly stated. Salary ranges,
                    requirements, aircraft specifications, and assessment processes are estimates
                    derived from publicly available data and may not reflect current policies. Users
                    should conduct their own due diligence and verify all information directly with
                    official sources before making career decisions. Memberships or fees, where
                    applicable, are solely for platform development, AI-powered comparison tools,
                    and related services—not for access to airline or manufacturer data. This
                    platform provides general guidance only and does not constitute professional
                    career, legal, or financial advice.
                  </p>
                  <button
                    onClick={() => setDisclaimerExpanded((v) => !v)}
                    className="mt-2 text-xs font-semibold text-sky-600 hover:text-sky-500 md:hidden"
                  >
                    {disclaimerExpanded ? 'View less' : 'View more'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
