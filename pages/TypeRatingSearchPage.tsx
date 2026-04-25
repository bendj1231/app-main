import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Plane, CheckCircle2, Star, DollarSign, Calendar, FileText, Gauge, Building2, BookOpen, MousePointerClick, Briefcase, X, Globe, Users } from 'lucide-react';
import { manufacturers, aircraftTypeRatings, Manufacturer, AircraftTypeRating, getManufacturerById, getAircraftByManufacturer, getAircraftByCategory } from '../data/aircraft-manufacturers';

// Career Score Calculation Function
function calculateCareerScore(aircraft: AircraftTypeRating, pilotProfile?: {
  totalFlightHours?: number;
  licenses?: string[];
  recognitionScore?: number;
  experienceLevel?: string;
  technicalSkillsScore?: number;
  interviewScore?: number;
  examinationScore?: number;
}): number {
  let score = 0;
  const maxScore = 100;

  // === Aircraft-Based Scoring (60 points) ===

  // Demand Level (15 points)
  if (aircraft.demandLevel === 'high') score += 15;
  else if (aircraft.demandLevel === 'low') score += 6;
  else score += 0;

  // Lifecycle Stage (12 points)
  if (aircraft.lifecycleStage === 'early-career') score += 12;
  else if (aircraft.lifecycleStage === 'mid-career') score += 6;
  else score += 0;

  // Order Backlog Ratio (12 points) - orders/delivered
  if (aircraft.orderBacklog) {
    const ratio = aircraft.orderBacklog.orders / (aircraft.orderBacklog.delivered || 1);
    if (ratio >= 2) score += 12;
    else if (ratio >= 1.5) score += 9;
    else if (ratio >= 1) score += 6;
    else score += 3;
  }

  // Operator Count (9 points) - more operators = more opportunities
  if (aircraft.operatorCount) {
    if (aircraft.operatorCount >= 30) score += 9;
    else if (aircraft.operatorCount >= 20) score += 7;
    else if (aircraft.operatorCount >= 10) score += 5;
    else score += 2;
  }

  // Pilot Count vs Demand (12 points) - fewer pilots with rating = higher score
  if (aircraft.pilotCount && aircraft.operatorCount) {
    const pilotsPerOperator = aircraft.pilotCount / aircraft.operatorCount;
    if (pilotsPerOperator <= 100) score += 12;
    else if (pilotsPerOperator <= 200) score += 9;
    else if (pilotsPerOperator <= 300) score += 6;
    else score += 3;
  } else if (!aircraft.pilotCount) {
    score += 6;
  }

  // === Pilot Profile-Based Scoring (40 points) ===

  if (pilotProfile) {
    // Total Flight Hours (12 points)
    if (pilotProfile.totalFlightHours) {
      if (pilotProfile.totalFlightHours >= 5000) score += 12;
      else if (pilotProfile.totalFlightHours >= 3000) score += 9;
      else if (pilotProfile.totalFlightHours >= 1500) score += 6;
      else if (pilotProfile.totalFlightHours >= 500) score += 3;
      else score += 1;
    }

    // Number of Licenses (8 points)
    if (pilotProfile.licenses) {
      if (pilotProfile.licenses.length >= 5) score += 8;
      else if (pilotProfile.licenses.length >= 3) score += 6;
      else if (pilotProfile.licenses.length >= 2) score += 4;
      else if (pilotProfile.licenses.length >= 1) score += 2;
    }

    // Recognition Score (10 points)
    if (pilotProfile.recognitionScore) {
      if (pilotProfile.recognitionScore >= 80) score += 10;
      else if (pilotProfile.recognitionScore >= 60) score += 8;
      else if (pilotProfile.recognitionScore >= 40) score += 5;
      else if (pilotProfile.recognitionScore >= 20) score += 3;
      else score += 1;
    }

    // Experience Level (5 points)
    if (pilotProfile.experienceLevel) {
      if (pilotProfile.experienceLevel === 'senior' || pilotProfile.experienceLevel === 'captain') score += 5;
      else if (pilotProfile.experienceLevel === 'mid-level' || pilotProfile.experienceLevel === 'first-officer') score += 3;
      else if (pilotProfile.experienceLevel === 'junior') score += 1;
    }

    // Technical Skills Score (5 points)
    if (pilotProfile.technicalSkillsScore) {
      if (pilotProfile.technicalSkillsScore >= 80) score += 5;
      else if (pilotProfile.technicalSkillsScore >= 60) score += 3;
      else if (pilotProfile.technicalSkillsScore >= 40) score += 1;
    }
  }

  return Math.min(score, maxScore);
}

// Cache for fetched thumbnail URLs
const thumbnailCache: Record<string, string> = {};

function SketchfabThumbnail({
  sketchfabId,
  alt,
  className,
  onError,
}: {
  sketchfabId: string;
  alt: string;
  className?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}) {
  const [src, setSrc] = useState<string | null>(thumbnailCache[sketchfabId] || null);
  const [loading, setLoading] = useState(!thumbnailCache[sketchfabId]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (thumbnailCache[sketchfabId]) {
      setSrc(thumbnailCache[sketchfabId]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setFailed(false);
    let cancelled = false;
    fetch(`https://api.sketchfab.com/v3/models/${sketchfabId}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        const images: any[] = data?.thumbnails?.images || [];
        const best = images.sort((a, b) => (b.width || 0) - (a.width || 0))[0];
        if (best?.url) {
          thumbnailCache[sketchfabId] = best.url;
          setSrc(best.url);
          setLoading(false);
        } else {
          setFailed(true);
          setLoading(false);
        }
      })
      .catch(() => { if (!cancelled) { setFailed(true); setLoading(false); } });
    return () => { cancelled = true; };
  }, [sketchfabId]);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-200 animate-pulse`}>
        <Plane className="w-8 h-8 text-slate-400" />
      </div>
    );
  }

  if (failed || !src) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-100`}>
        <Plane className="w-10 h-10 text-slate-400" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={onError}
    />
  );
}

type Category = 'all' | 'commercial' | 'private' | 'cargo' | 'regional' | 'helicopter' | 'military' | 'legacy' | 'flagship';

const CATEGORY_LABELS: Record<string, string> = {
  'all': 'All',
  'commercial': 'Commercial',
  'private': 'Private',
  'cargo': 'Cargo',
  'regional': 'Regional',
  'helicopter': 'Helicopter',
  'military': 'Military',
  'legacy': 'Legacy (Retired)',
  'flagship': 'Flagship',
};

const CATEGORY_COLORS: Record<string, string> = {
  'commercial': 'bg-blue-500',
  'private': 'bg-emerald-500',
  'cargo': 'bg-purple-500',
  'regional': 'bg-sky-500',
  'helicopter': 'bg-teal-500',
  'military': 'bg-rose-500',
  'legacy': 'bg-slate-500',
  'flagship': 'bg-amber-500',
};

const LEGACY_SUBCATEGORY_LABELS: Record<string, string> = {
  'retired': 'Retired',
  'reaching-end-of-service': 'Reaching End of Service',
  'historical': 'Historical',
};

const LEGACY_SUBCATEGORY_COLORS: Record<string, string> = {
  'retired': 'bg-slate-600',
  'reaching-end-of-service': 'bg-orange-500',
  'historical': 'bg-amber-600',
};

const HELICOPTER_SUBCATEGORY_LABELS: Record<string, string> = {
  'light-single-engine': 'Light Single-Engine',
  'light-twin-engine': 'Light Twin-Engine',
  'medium-twin-engine': 'Medium Twin-Engine',
  'heavy-twin-engine': 'Heavy Twin-Engine',
  'evtol': 'eVTOL',
  'drone-helicopter': 'Drone',
};

const HELICOPTER_SUBCATEGORY_COLORS: Record<string, string> = {
  'light-single-engine': 'bg-sky-500',
  'light-twin-engine': 'bg-blue-500',
  'medium-twin-engine': 'bg-indigo-500',
  'heavy-twin-engine': 'bg-purple-500',
  'evtol': 'bg-emerald-500',
  'drone-helicopter': 'bg-teal-500',
};

const MILITARY_SUBCATEGORY_LABELS: Record<string, string> = {
  'transport-tanker': 'Transport & Tanker',
  'tactical-transport': 'Tactical Transport',
  'combat-stealth': 'Combat & Stealth',
  'attack-tactical-helicopter': 'Attack/Tactical Heli',
  'utility-helicopter': 'Utility/Scout Heli',
  'surveillance-uas': 'Surveillance & UAS',
};

const MILITARY_SUBCATEGORY_COLORS: Record<string, string> = {
  'transport-tanker': 'bg-slate-700',
  'tactical-transport': 'bg-stone-600',
  'combat-stealth': 'bg-red-600',
  'attack-tactical-helicopter': 'bg-orange-600',
  'utility-helicopter': 'bg-amber-600',
  'surveillance-uas': 'bg-cyan-600',
};

const CARGO_SUBCATEGORY_LABELS: Record<string, string> = {
  'production-freighter': 'Production Freighter',
  'p2f-freighter': 'P2F Conversion',
  'outsize-transport': 'Outsize Transport',
  'historical-cargo': 'Historical',
};

const CARGO_SUBCATEGORY_COLORS: Record<string, string> = {
  'production-freighter': 'bg-indigo-700',
  'p2f-freighter': 'bg-purple-700',
  'outsize-transport': 'bg-pink-700',
  'historical-cargo': 'bg-gray-600',
};

const FLAGSHIP_SUBCATEGORY_LABELS: Record<string, string> = {
  'game-changer': 'Game Changers',
  'legacy-fading': 'Legacy (Fading)',
  'resurgent': 'Resurgent',
  'historical-flagship': 'Historical',
};

const FLAGSHIP_SUBCATEGORY_COLORS: Record<string, string> = {
  'game-changer': 'bg-blue-700',
  'legacy-fading': 'bg-orange-700',
  'resurgent': 'bg-emerald-700',
  'historical-flagship': 'bg-gray-700',
};

// Manufacturer Hero Component
function ManufacturerHero({ manufacturer, onClose }: { manufacturer: Manufacturer; onClose: () => void }) {
  return (
    <div className="relative overflow-hidden mb-8 min-h-[500px]">
      {/* Background image with Netflix-style blue theme overlay */}
      {manufacturer.heroImage && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-no-repeat"
            style={{ backgroundImage: `url(${manufacturer.heroImage})`, backgroundPosition: 'right center' }}
          />
          {/* Netflix-style gradient overlays with blue theme - fade from left to right */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900/90 via-blue-800/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 to-transparent" />
          {/* Blur overlay on left side of image */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/30 backdrop-blur-sm to-transparent" />
        </>
      )}
      {!manufacturer.heroImage && (
        <>
          {/* Background with gradient fallback */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 to-transparent" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        </>
      )}
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 h-full flex flex-col">
        {/* Content on the left side */}
        <div className="flex-1 flex flex-col justify-center text-white">
          <div className="max-w-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-4xl md:text-6xl font-serif font-normal mb-2">{manufacturer.name}</h2>
                <div className="flex items-center gap-4 text-slate-300 text-sm">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {manufacturer.headquarters}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Founded {manufacturer.founded}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    {manufacturer.reputationScore}/10
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-slate-300 text-lg mb-6 max-w-xl">{manufacturer.description}</p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                  Aircrafts Listed
                </div>
                <div className="text-xl font-bold">87</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                  Preferred Type of Pilots
                </div>
                <div className="text-sm font-bold leading-tight">600-1500 hours</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                  Pilots Rated
                </div>
                <div className="text-xl font-bold">200,000-250,000+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TypeRatingSearchPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('flagship');
  const [activeLegacySubcategory, setActiveLegacySubcategory] = useState<string | null>(null);
  const [activeHelicopterSubcategory, setActiveHelicopterSubcategory] = useState<string | null>(null);
  const [activeMilitarySubcategory, setActiveMilitarySubcategory] = useState<string | null>(null);
  const [activeCargoSubcategory, setActiveCargoSubcategory] = useState<string | null>(null);
  const [activeFlagshipSubcategory, setActiveFlagshipSubcategory] = useState<string | null>(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState<AircraftTypeRating | null>(null);
  const [showExtendedInfo, setShowExtendedInfo] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const carouselRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const filteredAircraft = React.useMemo(() => {
    let aircraft = aircraftTypeRatings;
    
    if (selectedManufacturer) {
      aircraft = getAircraftByManufacturer(selectedManufacturer.id);
    }
    
    if (activeCategory !== 'all') {
      aircraft = aircraft.filter(a => a.category === activeCategory);
    }
    
    // Filter by legacy subcategory if legacy category is selected and a subcategory is active
    if (activeCategory === 'legacy' && activeLegacySubcategory) {
      aircraft = aircraft.filter(a => a.subcategory === activeLegacySubcategory);
    }
    
    // Filter by helicopter subcategory if helicopter category is selected and a subcategory is active
    if (activeCategory === 'helicopter' && activeHelicopterSubcategory) {
      aircraft = aircraft.filter(a => a.subcategory === activeHelicopterSubcategory);
    }
    
    // Filter by military subcategory if military category is selected and a subcategory is active
    if (activeCategory === 'military' && activeMilitarySubcategory) {
      aircraft = aircraft.filter(a => a.subcategory === activeMilitarySubcategory);
    }
    
    // Filter by cargo subcategory if cargo category is selected and a subcategory is active
    if (activeCategory === 'cargo' && activeCargoSubcategory) {
      aircraft = aircraft.filter(a => a.subcategory === activeCargoSubcategory);
    }
    
    // Filter by flagship subcategory if flagship category is selected and a subcategory is active
    if (activeCategory === 'flagship' && activeFlagshipSubcategory) {
      aircraft = aircraft.filter(a => a.subcategory === activeFlagshipSubcategory);
    }
    
    if (searchQuery) {
      aircraft = aircraft.filter(a => 
        a.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.manufacturerId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return aircraft;
  }, [selectedManufacturer, activeCategory, activeLegacySubcategory, activeHelicopterSubcategory, activeMilitarySubcategory, activeCargoSubcategory, activeFlagshipSubcategory, searchQuery]);

  // Get available categories for selected manufacturer
  const availableCategories = React.useMemo(() => {
    if (!selectedManufacturer) {
      return Object.keys(CATEGORY_LABELS) as Category[];
    }
    
    const manufacturerAircraft = getAircraftByManufacturer(selectedManufacturer.id);
    const categories = new Set(manufacturerAircraft.map(a => a.category));
    return ['all', ...Array.from(categories)] as Category[];
  }, [selectedManufacturer]);

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (!carouselRef.current) return;
      const el = carouselRef.current;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: 288, behavior: 'smooth' });
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [filteredAircraft]);

  const scroll = (dir: 'left' | 'right') =>
    carouselRef.current?.scrollBy({ left: dir === 'left' ? -288 : 288, behavior: 'smooth' });

  const handleSelect = (aircraft: AircraftTypeRating) => {
    setSelectedAircraft(aircraft);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  const getManufacturer = (aircraft: AircraftTypeRating) => {
    return getManufacturerById(aircraft.manufacturerId);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">

      {/* Header Nav */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <img src="/logo.png" alt="WingMentor" className="h-8 w-auto object-contain" />
          <span className="text-sm font-semibold text-slate-900">Aircraft Type-Ratings</span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden pt-16 pb-12 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/20 via-transparent to-indigo-900/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-sky-500 mb-3">3D Models & Type Rating Info</p>
          <h1 className="text-4xl md:text-6xl font-serif font-normal leading-tight mb-4 text-slate-900">
            Aircraft <span style={{ color: '#DAA520' }}>Type Ratings</span>
          </h1>
          <p className="text-lg md:text-xl mb-2 text-slate-500">
            Explore · Manufacturers · Requirements · Specifications
          </p>

          {/* Search */}
          <div className="mt-8 max-w-lg mx-auto relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search aircraft, manufacturers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-11 py-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Manufacturer Carousel */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-serif font-normal text-slate-900">Browse Manufacturers</h2>
          <p className="text-sm text-slate-500">{manufacturers.length} manufacturers available</p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
          {manufacturers.map(manufacturer => (
            <button
              key={manufacturer.id}
              onClick={() => { setSelectedManufacturer(manufacturer); setSelectedAircraft(null); }}
              className={`flex-shrink-0 w-72 p-6 rounded-xl border-2 transition-all ${
                selectedManufacturer?.id === manufacturer.id
                  ? 'ring-2 ring-sky-500 border-sky-500/50 bg-sky-50'
                  : 'border-slate-200 hover:border-slate-400 bg-white'
              }`}
            >
              <img
                src={manufacturer.logo}
                alt={manufacturer.name}
                className="w-32 h-32 object-contain mx-auto"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Default Hero - shows when no manufacturer is selected */}
      {!selectedManufacturer && (
        <div className="relative overflow-hidden mb-8">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
            <div className="text-center text-white">
              <h2 className="text-4xl md:text-5xl font-serif font-normal mb-4">
                Discover Aircraft Manufacturers' Expectations & Type Rating Requirements
              </h2>
              <p className="text-lg text-slate-300 mb-8 max-w-4xl mx-auto">
                Understanding type ratings is crucial for your career. While aircraft may seem similar, each rating opens different opportunities based on market demand, airline preferences, and career progression.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <Plane className="w-6 h-6 text-sky-400" />
                    <h3 className="text-xl font-semibold">Market Demand</h3>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Airlines prioritize ratings based on their fleet composition. A320/A321neo dominate short-haul, while A350/A380 lead long-haul. Choose ratings matching airline expansion plans.
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <Briefcase className="w-6 h-6 text-emerald-400" />
                    <h3 className="text-xl font-semibold">Career Progression</h3>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Start with high-demand narrow-body ratings (A320neo, B737MAX) for faster employment. Wide-body ratings (A350, B777) offer premium routes but require more experience.
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <Star className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-xl font-semibold">Strategic Choice</h3>
                  </div>
                  <p className="text-slate-300 text-sm">
                    A320 vs A330: Same manufacturer, different markets. A320 = high volume, rapid hiring. A330 = medium-haul, bridge to A350. Research airline fleets before investing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manufacturer Hero - shows when manufacturer is selected */}
      {selectedManufacturer && (
        <ManufacturerHero 
          manufacturer={selectedManufacturer} 
          onClose={() => setSelectedManufacturer(null)} 
        />
      )}

      {/* Category filter chips */}
      <div className="max-w-7xl mx-auto px-6 mb-8 flex gap-1.5 flex-wrap justify-center">
        {availableCategories.map(cat => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setActiveLegacySubcategory(null); setActiveHelicopterSubcategory(null); setActiveMilitarySubcategory(null); setActiveCargoSubcategory(null); setActiveFlagshipSubcategory(null); setSelectedAircraft(null); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === cat
                ? `${CATEGORY_COLORS[cat] || 'bg-sky-500'} text-white shadow-sm`
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Legacy subcategory filter chips (only show when legacy is selected) */}
      {activeCategory === 'legacy' && (
        <div className="max-w-7xl mx-auto px-6 mb-8 flex gap-1.5 flex-wrap justify-center">
          <button
            onClick={() => { setActiveLegacySubcategory(null); setSelectedAircraft(null); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeLegacySubcategory === null
                ? 'bg-slate-500 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Legacy
          </button>
          {Object.entries(LEGACY_SUBCATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setActiveLegacySubcategory(key); setSelectedAircraft(null); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeLegacySubcategory === key
                  ? `${LEGACY_SUBCATEGORY_COLORS[key]} text-white shadow-sm`
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Helicopter subcategory filter chips (only show when helicopter is selected) */}
      {activeCategory === 'helicopter' && (
        <div className="max-w-7xl mx-auto px-6 mb-8 flex gap-1.5 flex-wrap justify-center">
          <button
            onClick={() => { setActiveHelicopterSubcategory(null); setSelectedAircraft(null); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeHelicopterSubcategory === null
                ? 'bg-slate-500 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Helicopters
          </button>
          {Object.entries(HELICOPTER_SUBCATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setActiveHelicopterSubcategory(key); setSelectedAircraft(null); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeHelicopterSubcategory === key
                  ? `${HELICOPTER_SUBCATEGORY_COLORS[key]} text-white shadow-sm`
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Military subcategory filter chips (only show when military is selected) */}
      {activeCategory === 'military' && (
        <div className="max-w-7xl mx-auto px-6 mb-8 flex gap-1.5 flex-wrap justify-center">
          <button
            onClick={() => { setActiveMilitarySubcategory(null); setSelectedAircraft(null); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeMilitarySubcategory === null
                ? 'bg-slate-500 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Military
          </button>
          {Object.entries(MILITARY_SUBCATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setActiveMilitarySubcategory(key); setSelectedAircraft(null); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeMilitarySubcategory === key
                  ? `${MILITARY_SUBCATEGORY_COLORS[key]} text-white shadow-sm`
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Cargo subcategory filter chips (only show when cargo is selected) */}
      {activeCategory === 'cargo' && (
        <div className="max-w-7xl mx-auto px-6 mb-8 flex gap-1.5 flex-wrap justify-center">
          <button
            onClick={() => { setActiveCargoSubcategory(null); setSelectedAircraft(null); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCargoSubcategory === null
                ? 'bg-slate-500 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Cargo
          </button>
          {Object.entries(CARGO_SUBCATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setActiveCargoSubcategory(key); setSelectedAircraft(null); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCargoSubcategory === key
                  ? `${CARGO_SUBCATEGORY_COLORS[key]} text-white shadow-sm`
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Flagship subcategory filter chips (only show when flagship is selected) */}
      {activeCategory === 'flagship' && (
        <div className="max-w-7xl mx-auto px-6 mb-8 flex gap-1.5 flex-wrap justify-center">
          <button
            onClick={() => { setActiveFlagshipSubcategory(null); setSelectedAircraft(null); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeFlagshipSubcategory === null
                ? 'bg-slate-500 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Flagship
          </button>
          {Object.entries(FLAGSHIP_SUBCATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setActiveFlagshipSubcategory(key); setSelectedAircraft(null); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeFlagshipSubcategory === key
                  ? `${FLAGSHIP_SUBCATEGORY_COLORS[key]} text-white shadow-sm`
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Carousel Section */}
      <div className="px-0 mb-12">
        <div className="max-w-7xl mx-auto px-6 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-normal text-slate-900">Browse Aircraft</h2>
            <p className="text-sm text-slate-500">{filteredAircraft.length} aircraft available</p>
          </div>
          {/* Scroll arrows */}
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll('right')} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Edge-to-edge carousel */}
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto pb-4 px-6 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          {filteredAircraft.map(aircraft => (
            <div
              key={aircraft.id}
              onClick={() => handleSelect(aircraft)}
              className={`flex-shrink-0 w-72 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 border ${
                selectedAircraft?.id === aircraft.id
                  ? 'ring-2 ring-sky-500 border-sky-500/50'
                  : 'border-slate-200 hover:border-slate-400'
              } bg-white group`}
            >
              {/* Thumbnail */}
              <div className="relative h-44 overflow-hidden bg-slate-100">
                {aircraft.sketchfabId ? (
                  <SketchfabThumbnail
                    sketchfabId={aircraft.sketchfabId}
                    alt={aircraft.model}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <img
                    src={aircraft.image}
                    alt={aircraft.model}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-white font-serif text-base leading-tight">{aircraft.model}</span>
                  <div className="flex items-center gap-1 text-white/70 text-xs mt-0.5">
                    <Plane className="w-3 h-3" />
                    {CATEGORY_LABELS[aircraft.category]}
                  </div>
                </div>
              </div>
              {/* Card body */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={getManufacturer(aircraft)?.logo || '/logo.png'}
                    alt={getManufacturer(aircraft)?.name || 'Manufacturer'}
                    className="h-6 object-contain"
                  />
                  <span className="text-xs text-slate-600">{getManufacturer(aircraft)?.name}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{aircraft.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty state — no aircraft selected */}
      {!selectedAircraft && (
        <div ref={detailRef} className="max-w-7xl mx-auto px-6 mb-16">
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 md:p-16 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-sky-50 flex items-center justify-center">
                <MousePointerClick className="w-10 h-10 text-sky-400" />
              </div>
            </div>
            <h2 className="text-2xl font-serif font-normal text-slate-800 mb-3">Select an Aircraft to Explore</h2>
            <p className="text-slate-500 max-w-xl mx-auto mb-8 leading-relaxed">
              Choose any aircraft from the carousel above to view its specifications, training requirements, manufacturer details, and career information.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { icon: <Plane className="w-5 h-5 text-sky-500" />, label: 'Aircraft Specifications' },
                { icon: <DollarSign className="w-5 h-5 text-emerald-500" />, label: 'Training Costs' },
                { icon: <Building2 className="w-5 h-5 text-purple-500" />, label: 'Manufacturer Info' },
                { icon: <Gauge className="w-5 h-5 text-rose-500" />, label: 'Performance Specs' },
                { icon: <Calendar className="w-5 h-5 text-amber-500" />, label: 'Aircraft History' },
                { icon: <BookOpen className="w-5 h-5 text-indigo-500" />, label: 'Training Requirements' },
                { icon: <Briefcase className="w-5 h-5 text-teal-500" />, label: 'Career Info' },
                { icon: <Star className="w-5 h-5 text-yellow-500" />, label: 'Reputation Score' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  {item.icon}
                  <span className="text-xs font-medium text-slate-600 text-center">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Selected Aircraft Detail Panel */}
      {selectedAircraft && (
        <div ref={detailRef} className="max-w-7xl mx-auto px-6 mb-12">
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg">

            {/* Hero image with overlay */}
            <div className="relative h-64 md:h-80">
              {selectedAircraft.sketchfabId ? (
                <SketchfabThumbnail
                  sketchfabId={selectedAircraft.sketchfabId}
                  alt={selectedAircraft.model}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={selectedAircraft.image}
                  alt={selectedAircraft.model}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold tracking-[0.2em] uppercase text-sky-400 bg-sky-500/20 px-3 py-1 rounded-full border border-sky-400/30`}>
                    {CATEGORY_LABELS[selectedAircraft.category]}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-2">{selectedAircraft.model}</h2>
                <div className="flex items-center gap-4 flex-wrap mb-3">
                  <span className="flex items-center gap-1.5 text-sky-300 text-sm">
                    <img src={getManufacturer(selectedAircraft)?.logo || '/logo.png'} alt="Manufacturer" className="h-4 w-auto object-contain opacity-80" />
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
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xl border-2 ${
                      selectedAircraft.demandLevel === 'high' ? 'bg-emerald-500 text-white border-emerald-400' :
                      selectedAircraft.demandLevel === 'low' ? 'bg-amber-500 text-white border-amber-400' :
                      'bg-red-500 text-white border-red-400'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        selectedAircraft.demandLevel === 'high' ? 'bg-white' :
                        selectedAircraft.demandLevel === 'low' ? 'bg-white' :
                        'bg-white'
                      }`} />
                      Demand: {selectedAircraft.demandLevel === 'high' ? 'High' : selectedAircraft.demandLevel === 'low' ? 'Low' : 'None'}
                    </div>
                  )}
                  {selectedAircraft.conditionallyNew && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xl border-2 ${
                      selectedAircraft.conditionallyNew === 'green' ? 'bg-emerald-500 text-white border-emerald-400' :
                      selectedAircraft.conditionallyNew === 'amber' ? 'bg-amber-500 text-white border-amber-400' :
                      'bg-red-500 text-white border-red-400'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        selectedAircraft.conditionallyNew === 'green' ? 'bg-white' :
                        selectedAircraft.conditionallyNew === 'amber' ? 'bg-white' :
                        'bg-white'
                      }`} />
                      Conditionally New
                    </div>
                  )}
                  {selectedAircraft.lifecycleStage && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xl border-2 ${
                      selectedAircraft.lifecycleStage === 'early-career' ? 'bg-emerald-500 text-white border-emerald-400' :
                      selectedAircraft.lifecycleStage === 'mid-career' ? 'bg-amber-500 text-white border-amber-400' :
                      'bg-red-500 text-white border-red-400'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        selectedAircraft.lifecycleStage === 'early-career' ? 'bg-white' :
                        selectedAircraft.lifecycleStage === 'mid-career' ? 'bg-white' :
                        'bg-white'
                      }`} />
                      Lifecycle: {selectedAircraft.lifecycleStage === 'early-career' ? 'Early Career' : selectedAircraft.lifecycleStage === 'mid-career' ? 'Mid Career' : 'End of Life'}
                    </div>
                  )}
                  {selectedAircraft.operatorCount && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500 text-white border-2 border-amber-400 backdrop-blur-xl">
                      <div className="w-2 h-2 rounded-full bg-white" />
                      Operators: {selectedAircraft.operatorCount}+
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info bar — manufacturer + cost + age */}
            <div className="px-6 md:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img src={getManufacturer(selectedAircraft)?.logo || '/logo.png'} alt={getManufacturer(selectedAircraft)?.name} className="h-8 object-contain" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400">Manufacturer</p>
                  <p className="text-sm font-semibold text-slate-800">{getManufacturer(selectedAircraft)?.name}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">First Flight</p>
                <p className="text-sm font-semibold text-slate-800">{selectedAircraft.firstFlight}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">Category</p>
                <p className="text-sm font-semibold text-slate-800 capitalize">{selectedAircraft.category}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">Reputation</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-slate-800">{getManufacturer(selectedAircraft)?.reputationScore}</span>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-slate-200 px-6 md:px-8 bg-white">
              <div className="flex gap-1 overflow-x-auto">
                {['Overview', 'Training', 'Hiring', 'Compensation', 'Comparison'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-sky-500 text-sky-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Description Section — requirements + specs */}
            <div className="p-6 md:p-8 border-b border-slate-100">
              {activeTab === 'Overview' && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-slate-900">Description</h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-4">{selectedAircraft.description}</p>
                    
                    {selectedAircraft.whyChooseRating && (
                      <>
                        <h3 className="text-lg font-semibold mb-3 text-slate-900">Why Should a Pilot Choose This Rating?</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{selectedAircraft.whyChooseRating}</p>
                        {selectedAircraft.id === 'a220-300' && (
                          <button
                            onClick={() => setShowExtendedInfo(true)}
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
                    <h3 className="text-lg font-semibold mb-3 text-slate-900">Technical Specifications</h3>
                    <div className="space-y-2">
                      {Object.entries(selectedAircraft.specifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between py-2 border-b border-slate-50">
                          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="text-sm font-medium text-slate-800">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Overview' && selectedAircraft.news && selectedAircraft.news.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900">Latest News</h3>
                  <div className="space-y-3">
                    {selectedAircraft.news.map((news, i) => (
                      <div key={news.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-slate-300 transition-colors">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 text-sm mb-1">{news.title}</h4>
                            <p className="text-xs text-slate-500 mb-2">{news.summary}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400">{new Date(news.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                              <a href={news.url} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-600 hover:text-sky-700 font-medium">
                                Read more →
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Training' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Training Requirements</h3>
                  <ul className="space-y-2.5 mb-6">
                    <li className="flex items-start gap-3 text-sm text-slate-500">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      Minimum Flight Hours: {selectedAircraft.trainingRequirements.minimumHours}
                    </li>
                    <li className="flex items-start gap-3 text-sm text-slate-500">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      Ground School: {selectedAircraft.trainingRequirements.groundSchoolHours} hours
                    </li>
                    <li className="flex items-start gap-3 text-sm text-slate-500">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      Simulator Training: {selectedAircraft.trainingRequirements.simulatorHours} hours
                    </li>
                    <li className="flex items-start gap-3 text-sm text-slate-500">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      Flight Training: {selectedAircraft.trainingRequirements.flightHours} hours
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === 'Hiring' && selectedAircraft.id === 'a220-300' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Hiring Requirements by Airline Type</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">
                    Many operators now offer company-funded type ratings for the A220 to meet high demand, but minimum flight hour thresholds vary significantly between regional and major carriers.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-slate-600 border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="text-left p-2 border border-slate-200 font-semibold">Airline</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">Position</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">Min. Total Hours</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">Key Requirements</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border border-slate-200">airBaltic</td>
                          <td className="p-2 border border-slate-200">First Officer</td>
                          <td className="p-2 border border-slate-200">300–500 hrs</td>
                          <td className="p-2 border border-slate-200">300+ hrs on aircraft &gt;5.7t; EASA license</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200">Breeze Airways</td>
                          <td className="p-2 border border-slate-200">First Officer</td>
                          <td className="p-2 border border-slate-200">1,500 hrs</td>
                          <td className="p-2 border border-slate-200">FAA ATP/R-ATP; 500 hrs turbine; 50 hrs multi-engine</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200">QantasLink</td>
                          <td className="p-2 border border-slate-200">First Officer</td>
                          <td className="p-2 border border-slate-200">500–700 hrs</td>
                          <td className="p-2 border border-slate-200">CASA license; 200 hrs multi-engine/turbine command; Level 6 English</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200">Air France</td>
                          <td className="p-2 border border-slate-200">First Officer</td>
                          <td className="p-2 border border-slate-200">~1,500 hrs</td>
                          <td className="p-2 border border-slate-200">Varies by recruitment cycle; typically requires EASA ATPL</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200">Delta Air Lines</td>
                          <td className="p-2 border border-slate-200">First Officer</td>
                          <td className="p-2 border border-slate-200">1,500+ hrs</td>
                          <td className="p-2 border border-slate-200">FAA ATP; prefers 1,000+ hours in Part 121 operations</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'Hiring' && selectedAircraft.id === 'a220-100' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">First Officer (FO) Requirements</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Total Flight Time:</strong> 1,500 hours (FAA) or 500 hours (EASA/ICAO with an airline cadet background)</li>
                    <li><strong>Multi-Engine/Turbine Time:</strong> Minimum 500 hours preferred (though many A220 operators like airBaltic accept 300 hours on aircraft &gt;5.7t)</li>
                    <li><strong>License:</strong> Valid ATPL or CPL with "Frozen" ATPL theory</li>
                    <li><strong>Medical:</strong> Class 1 Medical Certificate</li>
                    <li><strong>English Proficiency:</strong> ICAO Level 4 minimum (Level 6 preferred)</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Direct Entry Captain (DEC) Requirements</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Total Flight Time:</strong> 3,000 – 5,000+ hours</li>
                    <li><strong>PIC Command Time:</strong> 1,000 hours as Pilot-in-Command (PIC) on a multi-pilot turbojet aircraft (e.g., A320, B737, or E-Jet)</li>
                    <li><strong>Type Specific:</strong> Non-type rated pilots are frequently accepted if they have experience on "Glass Cockpit" and Fly-By-Wire aircraft</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Career Opportunities & Bonuses</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">
                    <strong>Current Demand:</strong> Very High. Because the A220 fleet is expanding faster than pilots can be trained, "Type Rating provided by company" is a common offer.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                      <h4 className="text-sm font-semibold text-emerald-800 mb-1">Sign-on Bonuses</h4>
                      <p className="text-xs text-emerald-700">Currently ranging from $10,000 to $15,000 for type-rated pilots at regional and expansion carriers</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-1">Fast-Track Command</h4>
                      <p className="text-xs text-blue-700">Due to the massive order backlog, First Officers on the A220 often see a faster path to the left seat than those on established A320 fleets</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    <strong>Major Operators Hiring:</strong> Delta Air Lines, JetBlue, Air France, airBaltic, Breeze Airways, and QantasLink
                  </p>

                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                    <h3 className="text-sm font-bold text-sky-800 mb-1 uppercase tracking-wide">Recruiter's Note</h3>
                    <p className="text-sm text-sky-700 leading-relaxed italic">
                      "The A220 is currently the best airframe for pilots looking to transition from Regional Jets (ERJ/CRJ) to Mainline flying, as its systems logic is the most modern in the narrow-body class."
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Hiring' && selectedAircraft.id === 'a320' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">First Officer (FO) Requirements</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Total Flight Time:</strong> 1,500 hours (FAA ATP) or 200 hours (EASA/ICAO via Integrated Cadet programs)</li>
                    <li><strong>Multi-Engine/Turbine Time:</strong> 500 hours preferred for direct entry; often waived for graduates of partnered flight schools</li>
                    <li><strong>License:</strong> Valid ATPL or CPL with "Frozen" ATPL theory</li>
                    <li><strong>Type Rating Status:</strong> Many LCCs require a self-funded rating, while legacy carriers usually provide the rating via a training bond. Note: Many European and Asian LCCs now offer "Pay-via-Salary-Deduction" schemes, where the airline pays the $25k upfront and the pilot pays it back over 3 years from their paycheck, reducing the barrier to entry for new FOs.</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Direct Entry Captain (DEC) Requirements</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Total Flight Time:</strong> 3,000 – 5,000+ hours</li>
                    <li><strong>Command Experience:</strong> 1,000 hours Pilot-in-Command (PIC) on a multi-pilot turbojet aircraft (CS25/Part 25)</li>
                    <li><strong>Glass Cockpit Experience:</strong> Mandatory. Previous Fly-By-Wire (Airbus) experience is a major advantage but not always required if transitioning from Boeing</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Career Opportunities & Job Security</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">
                    <strong>Global Reach:</strong> With over 370 operators, an A320 rating allows a pilot to work in almost any country.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                      <h4 className="text-sm font-semibold text-emerald-800 mb-1">The "Neo" Growth</h4>
                      <p className="text-xs text-emerald-700">Because of the massive A320neo backlog, airlines are hiring at record rates to replace aging CEO fleets</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-1">Fast-Track Command</h4>
                      <p className="text-xs text-blue-700">In high-growth regions (India, SE Asia, Middle East), FO-to-Captain upgrades can occur in as little as 3–5 years</p>
                    </div>
                  </div>

                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                    <h3 className="text-sm font-bold text-sky-800 mb-1 uppercase tracking-wide">Career Path Note</h3>
                    <p className="text-sm text-sky-700 leading-relaxed italic">
                      "The A320 is the ultimate 'Utility Rating.' It opens doors to hundreds of airlines and serves as the technical foundation for the A330 and A350 widebody fleets."
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Hiring' && selectedAircraft.id === 'a330' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">First Officer (FO) Requirements</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Total Flight Time:</strong> 3,000 hours (FAA) or 1,500 hours (EASA/ICAO with previous jet experience)</li>
                    <li><strong>Multi-Engine/Turbine Time:</strong> 1,000 hours minimum on multi-pilot turbojet aircraft</li>
                    <li><strong>License:</strong> Valid ATPL (CPL with "Frozen" ATPL not accepted for wide-body)</li>
                    <li><strong>Type Rating Status:</strong> Most wide-body carriers provide the rating via training bond. A320-rated pilots can transition via CCQ in 8-10 days.</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Direct Entry Captain (DEC) Requirements</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Total Flight Time:</strong> 5,000 – 8,000+ hours</li>
                    <li><strong>Command Experience:</strong> 2,000 hours Pilot-in-Command (PIC) on wide-body or narrow-body aircraft</li>
                    <li><strong>Wide-body Experience:</strong> Preferred but not always mandatory. Previous heavy aircraft experience valued.</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Career Opportunities & Job Security</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">
                    <strong>Global Reach:</strong> The A330 rating is a "passport" to global wide-body carriers including Delta, Cathay Pacific, Qatar Airways, and Turkish Airlines.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                      <h4 className="text-sm font-semibold text-emerald-800 mb-1">The "A320 Advantage"</h4>
                      <p className="text-xs text-emerald-700">For A320-rated pilots, the transition is famously smooth via Cross-Crew Qualification (CCQ) - only 8-10 working days of training instead of a full month-long type rating.</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-1">Heavy Lifestyle</h4>
                      <p className="text-xs text-blue-700">Wide-body flying offers premium layovers in international destinations and significantly higher compensation compared to narrow-body operations.</p>
                    </div>
                  </div>

                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                    <h3 className="text-sm font-bold text-sky-800 mb-1 uppercase tracking-wide">Career Path Note</h3>
                    <p className="text-sm text-sky-700 leading-relaxed italic">
                      "The A330 is the best aircraft for achieving a 'Heavy' rating without the stress of a completely new flight deck logic. It offers a massive jump in pay and lifestyle (layovers) for a fraction of the training time of a Boeing 787."
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Hiring' && selectedAircraft.id !== 'a220-300' && selectedAircraft.id !== 'a220-100' && selectedAircraft.id !== 'a320' && selectedAircraft.id !== 'a330' && (
                <p className="text-sm text-slate-500 italic">Hiring requirements are not available for this aircraft.</p>
              )}

              {activeTab === 'Compensation' && selectedAircraft.id === 'a220-300' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Compensation Package (Year 1 First Officer)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">
                    Based on typical 2026 contract rates from top-tier carriers like Air France and Delta.
                  </p>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li><strong>Base Salary (MMG):</strong> ~$100,000 – $115,000 (Minimum Monthly Guarantee of 70–75 flight hours)</li>
                    <li><strong>Flight Hourly Rate:</strong> $110 – $170/hr (First-year FO rates ~$112/hr at major US carriers; €70k – €90k in Europe)</li>
                    <li><strong>Per Diems (Tax-Free):</strong> ~$7,000 – $12,000 (US: $2.25 – $3.50/hr away from base; higher for international layovers)</li>
                    <li><strong>Total Annual Cash (Year 1):</strong> ~$110,000 – $135,000</li>
                  </ul>
                </div>
              )}

              {activeTab === 'Compensation' && selectedAircraft.id === 'a220-100' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">First Officer (FO) Earnings</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Starting Salary (Year 1):</strong> $110,000 – $135,000</li>
                    <li><strong>Senior FO (Year 5+):</strong> $160,000 – $220,000</li>
                    <li><strong>Hourly Rate (US Major Scale):</strong> $112 – $185/hr (Typically 75-hour monthly guarantee)</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Captain Earnings</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Starting Command (Year 1):</strong> $260,000 – $315,000</li>
                    <li><strong>Senior Captain (Year 12+):</strong> $350,000 – $450,000+</li>
                    <li><strong>Hourly Rate (US Major Scale):</strong> $295 – $415/hr</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Additional Financial Benefits</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Per Diems:</strong> Average $7,000 – $12,000 annually (tax-free)</li>
                    <li><strong>Retirement:</strong> Major carriers contribute 14% – 17% direct 401k/Pension funding</li>
                    <li><strong>Sign-on Bonuses:</strong> Currently $10k – $15k for type-rated candidates</li>
                    <li><strong>Efficiency Bonus:</strong> Many operators offer "productivity pay" for flying above 75 hours a month</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Career Intel for Pilots</h3>
                  <div className="space-y-3 mb-4">
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                      <h4 className="text-sm font-semibold text-emerald-800 mb-1">Pay Parity</h4>
                      <p className="text-xs text-emerald-700">Most airlines place the A220 in the same "Narrow-body" pay bracket as the A320 and B737. This means pilots earn the same high rates while operating a significantly quieter, more modern aircraft with lower fatigue levels.</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-1">The "Regional Plus" Advantage</h4>
                      <p className="text-xs text-blue-700">For pilots at carriers like Breeze or QantasLink, the A220 offers mainline-level compensation while maintaining a mix of short-haul and trans-continental schedules.</p>
                    </div>
                  </div>

                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                    <h3 className="text-sm font-bold text-sky-800 mb-1 uppercase tracking-wide">Summary</h3>
                    <p className="text-sm text-sky-700 leading-relaxed italic">
                      "The A220 is a financial winner. Pilots enjoy A320-level pay with 21st-century tech, lower cockpit noise, and a massive growth curve that ensures career longevity."
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Compensation' && selectedAircraft.id === 'a320' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Annual Compensation Profiles (2026)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    The A320 often shares the same pay scale as larger wide-bodies at legacy airlines, meaning pilots earn premium rates while maintaining a short-haul lifestyle.
                  </p>
                  
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="p-2 text-left font-semibold text-slate-800">Region</th>
                          <th className="p-2 text-left font-semibold text-slate-800">First Officer (Entry - Senior)</th>
                          <th className="p-2 text-left font-semibold text-slate-800">Captain (Junior - Senior)</th>
                          <th className="p-2 text-left font-semibold text-slate-800">Key Benefits</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 text-slate-700">United States</td>
                          <td className="p-2 text-slate-700">$120,000 – $200,000+</td>
                          <td className="p-2 text-slate-700">$250,000 – $450,000+</td>
                          <td className="p-2 text-slate-700">14–17% 401k direct contribution</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 text-slate-700">Middle East</td>
                          <td className="p-2 text-slate-700">$100,000 – $180,000</td>
                          <td className="p-2 text-slate-700">$200,000 – $380,000</td>
                          <td className="p-2 text-slate-700">Tax-free, housing, and schooling</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 text-slate-700">Europe</td>
                          <td className="p-2 text-slate-700">€50,000 – €150,000</td>
                          <td className="p-2 text-slate-700">€150,000 – €350,000</td>
                          <td className="p-2 text-slate-700">High job security & sector protections</td>
                        </tr>
                        <tr>
                          <td className="p-2 text-slate-700">India / Asia</td>
                          <td className="p-2 text-slate-700">$30,000 – $80,000</td>
                          <td className="p-2 text-slate-700">$100,000 – $250,000+</td>
                          <td className="p-2 text-slate-700">Rapid command upgrade paths</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Carrier Spotlights (A320 Family)</h3>
                  <div className="space-y-3 mb-4">
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <h4 className="text-sm font-semibold text-purple-800 mb-1">Lufthansa Mainline</h4>
                      <p className="text-xs text-purple-700">Features a "Golden Cage" pay scale where base salary is ~85% of total pay, offering unmatched security. Senior Captains can earn up to €280,000 gross plus high pension contributions.</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                      <h4 className="text-sm font-semibold text-orange-800 mb-1">Air France</h4>
                      <p className="text-xs text-orange-700">Uses a dual-pillar system with high fixed pay and a productivity-based "Prime de Vol". Long-haul A320 Captains can reach €350,000 gross.</p>
                    </div>
                    <div className="bg-teal-50 rounded-lg p-3 border border-teal-200">
                      <h4 className="text-sm font-semibold text-teal-800 mb-1">Etihad Airways</h4>
                      <p className="text-xs text-teal-700">Offers tax-free packages up to $170,000 for A320 Captains, plus massive education and housing allowances.</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Additional Earnings Components</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Per Diems:</strong> Often add $7,000 – $12,000 in tax-free income for meal and hotel incidentals</li>
                    <li><strong>Overtime:</strong> Most contracts pay 150% or more for any flight hours exceeding the monthly guarantee (typically 70–75 hours)</li>
                    <li><strong>Training Supplements:</strong> Check Captains (TRI/TRE) typically earn a premium of $15,000 – $25,000 annually on top of their standard pay</li>
                  </ul>

                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                    <h3 className="text-sm font-bold text-sky-800 mb-1 uppercase tracking-wide">Summary</h3>
                    <p className="text-sm text-sky-700 leading-relaxed italic">
                      "The A320 is the most portable rating in aviation. It offers high-level compensation that rivals wide-body pay in the U.S. and provides tax-free wealth-building opportunities in the Middle East."
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Compensation' && selectedAircraft.id === 'a330' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Wide-Body Compensation Profile (2026)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    The A330 offers premium compensation for "Heavy" wide-body flying, with significantly higher earnings than narrow-body aircraft.
                  </p>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">First Officer Earnings</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Starting Salary (Year 1):</strong> $140,000 – $180,000</li>
                    <li><strong>Senior FO (Year 5+):</strong> $180,000 – $220,000</li>
                    <li><strong>Hourly Rate:</strong> $180 – $250/hr (varies by carrier and region)</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Captain Earnings</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Starting Command (Year 1):</strong> $280,000 – $350,000</li>
                    <li><strong>Senior Captain (Year 12+):</strong> $350,000 – $480,000+</li>
                    <li><strong>Hourly Rate:</strong> $350 – $480/hr</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Additional Benefits</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Per Diems:</strong> $15,000 – $25,000 annually (tax-free) for international layovers</li>
                    <li><strong>Premium Layovers:</strong> Wide-body routes often include 24-48 hour stays in premium destinations</li>
                    <li><strong>Retirement:</strong> Major carriers contribute 16% – 20% direct pension/401k funding</li>
                  </ul>

                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                    <h3 className="text-sm font-bold text-sky-800 mb-1 uppercase tracking-wide">Summary</h3>
                    <p className="text-sm text-sky-700 leading-relaxed italic">
                      "The A330 rating is a 'passport' to global wide-body carriers. It offers a massive jump in pay and lifestyle (layovers) for a fraction of the training time of a Boeing 787."
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Compensation' && selectedAircraft.id !== 'a220-300' && selectedAircraft.id !== 'a220-100' && selectedAircraft.id !== 'a320' && selectedAircraft.id !== 'a330' && (
                <p className="text-sm text-slate-500 italic">Compensation data is not available for this aircraft.</p>
              )}

              {activeTab === 'Comparison' && selectedAircraft.id === 'a220-300' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">A220-100 vs. A220-300: The Common Type Rating</h3>
                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200 mb-4">
                    <p className="text-sm text-sky-700 leading-relaxed font-semibold mb-2">
                      Important: Pilots do not choose between them.
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed mb-2">
                      Because they share a Common Type Rating (BD-500), when you get rated on one, you are legally qualified to fly both. The FAA and EASA recognize them under the same "BD-500" endorsement.
                    </p>
                    <ul className="space-y-1 text-sm text-slate-700">
                      <li><strong>One License, Two Planes:</strong> Training centers offer the rating for both simultaneously.</li>
                      <li><strong>99% Commonality:</strong> Both variants share the same engines, flight deck, and internal systems.</li>
                      <li><strong>Unified Training:</strong> Airlines typically train pilots on the -300 and provide a brief differences module for the -100.</li>
                      <li><strong>Mixed-Fleet Flying:</strong> At airlines that operate both, pilots will often fly a -100 in the morning and a -300 in the afternoon on the same schedule.</li>
                      <li><strong>Current Status:</strong> Both are in high production. Neither is retiring; the -300 is entering its "golden age" of deliveries.</li>
                    </ul>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Which Variant is "Best" for You?</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    While you get both on your license, pilots often prefer one over the other based on the type of flying they want to do:
                  </p>
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm text-slate-600 border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="text-left p-2 border border-slate-200 font-semibold">Feature</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">A220-100 (The "Sports Car")</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">A220-300 (The "Workhorse")</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Handling</td>
                          <td className="p-2 border border-slate-200">More "twitchy" and responsive; feels lighter on controls</td>
                          <td className="p-2 border border-slate-200">More stable and "heavy" feel; smoother in turbulence</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Routes</td>
                          <td className="p-2 border border-slate-200">Short, high-frequency, or niche (Steep approaches)</td>
                          <td className="p-2 border border-slate-200">Long-haul narrow-body (Trans-con/Trans-atlantic)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Prestige</td>
                          <td className="p-2 border border-slate-200">Access to restricted airports like London City (LCY)</td>
                          <td className="p-2 border border-slate-200">Access to high-capacity "flagship" routes for major airlines</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Landing</td>
                          <td className="p-2 border border-slate-200">Harder to "grease" (shorter, more sensitive)</td>
                          <td className="p-2 border border-slate-200">Easier to land smoothly (longer wheelbase)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Best For</td>
                          <td className="p-2 border border-slate-200">Pilots who love stick-and-rudder handling</td>
                          <td className="p-2 border border-slate-200">Pilots who want stability and long-range flying</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Airlines by Variant (As of April 2026)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    The A220-300 is the "volume seller" with many more operators, while the A220-100 is a niche specialist for restricted airports.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h4 className="text-sm font-semibold text-purple-800 mb-2">Airlines Flying BOTH</h4>
                      <ul className="space-y-1 text-xs text-purple-700">
                        <li>Delta Air Lines</li>
                        <li>SWISS</li>
                        <li>ITA Airways</li>
                        <li>Bulgaria Air</li>
                        <li>Air Canada</li>
                        <li>Korean Air</li>
                        <li>QantasLink</li>
                        <li>Croatia Airlines</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-2">A220-300 ONLY</h4>
                      <ul className="space-y-1 text-xs text-blue-700">
                        <li>airBaltic (All-A220 fleet)</li>
                        <li>JetBlue</li>
                        <li>Air France</li>
                        <li>Breeze Airways</li>
                        <li>EgyptAir</li>
                        <li>Iraqi Airways</li>
                        <li>Air Austral</li>
                        <li>Air Tanzania</li>
                        <li>Cyprus Airways</li>
                      </ul>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <h4 className="text-sm font-semibold text-emerald-800 mb-2">A220-100 ONLY</h4>
                      <ul className="space-y-1 text-xs text-emerald-700">
                        <li>Executive/Private Jets</li>
                        <li>(Niche operators)</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Advice: Choose an Airline, Not a Variant</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    Since the rating is the same, choose based on the Airline's Fleet Mix:
                  </p>
                  <div className="space-y-3 mb-4">
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <h4 className="text-sm font-semibold text-emerald-800 mb-1">Choose a -100 Operator (e.g., Delta, SWISS)</h4>
                      <p className="text-xs text-emerald-700">If you want to fly into unique, challenging airports with short runways. The -100 has a better thrust-to-weight ratio and can get in and out of places the -300 cannot. It is the largest aircraft certified for London City Airport (LCY) due to its steep approach capabilities.</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-1">Choose a -300 Operator (e.g., Air France, JetBlue, Breeze)</h4>
                      <p className="text-xs text-blue-700">If you want maximum job security and variety. With a backlog of over 700 units, this variant is the industry standard for "long and thin" routes, including some trans-Atlantic hops. It is easier to land smoothly due to its longer fuselage.</p>
                    </div>
                  </div>

                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                    <h3 className="text-sm font-bold text-sky-800 mb-1 uppercase tracking-wide">Pilot Recognition Verdict</h3>
                    <p className="text-sm text-sky-700 leading-relaxed italic">
                      "Don't worry about choosing a variant—focus on getting the BD-500 rating. Once you have it, you are part of an elite group of ~5,000 pilots who can fly the most modern narrow-body fleet in the world. If you want the 'purest' flying experience, aim for the -100; if you want the most stable career path, the -300 is the king of the backlog."
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Comparison' && selectedAircraft.id === 'a220-100' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">A220-100 vs. A220-300: The Common Type Rating</h3>
                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200 mb-4">
                    <p className="text-sm text-sky-700 leading-relaxed font-semibold mb-2">
                      Important: Pilots do not choose between them.
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed mb-2">
                      Because they share a Common Type Rating (BD-500), when you get rated on one, you are legally qualified to fly both. The FAA and EASA recognize them under the same "BD-500" endorsement.
                    </p>
                    <ul className="space-y-1 text-sm text-slate-700">
                      <li><strong>One License, Two Planes:</strong> Training centers offer the rating for both simultaneously.</li>
                      <li><strong>99% Commonality:</strong> Both variants share the same engines, flight deck, and internal systems.</li>
                      <li><strong>Unified Training:</strong> Airlines typically train pilots on the -300 and provide a brief differences module for the -100.</li>
                      <li><strong>Mixed-Fleet Flying:</strong> At airlines that operate both, pilots will often fly a -100 in the morning and a -300 in the afternoon on the same schedule.</li>
                      <li><strong>Current Status:</strong> Both are in high production. Neither is retiring; the -300 is entering its "golden age" of deliveries.</li>
                    </ul>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Which Variant is "Best" for You?</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    While you get both on your license, pilots often prefer one over the other based on the type of flying they want to do:
                  </p>
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm text-slate-600 border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="text-left p-2 border border-slate-200 font-semibold">Feature</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">A220-100 (The "Sports Car")</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">A220-300 (The "Workhorse")</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Handling</td>
                          <td className="p-2 border border-slate-200">More "twitchy" and responsive; feels lighter on controls</td>
                          <td className="p-2 border border-slate-200">More stable and "heavy" feel; smoother in turbulence</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Routes</td>
                          <td className="p-2 border border-slate-200">Short, high-frequency, or niche (Steep approaches)</td>
                          <td className="p-2 border border-slate-200">Long-haul narrow-body (Trans-con/Trans-atlantic)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Prestige</td>
                          <td className="p-2 border border-slate-200">Access to restricted airports like London City (LCY)</td>
                          <td className="p-2 border border-slate-200">Access to high-capacity "flagship" routes for major airlines</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Landing</td>
                          <td className="p-2 border border-slate-200">Harder to "grease" (shorter, more sensitive)</td>
                          <td className="p-2 border border-slate-200">Easier to land smoothly (longer wheelbase)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Best For</td>
                          <td className="p-2 border border-slate-200">Pilots who love stick-and-rudder handling</td>
                          <td className="p-2 border border-slate-200">Pilots who want stability and long-range flying</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Airlines by Variant (As of April 2026)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    The A220-300 is the "volume seller" with many more operators, while the A220-100 is a niche specialist for restricted airports.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h4 className="text-sm font-semibold text-purple-800 mb-2">Airlines Flying BOTH</h4>
                      <ul className="space-y-1 text-xs text-purple-700">
                        <li>Delta Air Lines</li>
                        <li>SWISS</li>
                        <li>ITA Airways</li>
                        <li>Bulgaria Air</li>
                        <li>Air Canada</li>
                        <li>Korean Air</li>
                        <li>QantasLink</li>
                        <li>Croatia Airlines</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-2">A220-300 ONLY</h4>
                      <ul className="space-y-1 text-xs text-blue-700">
                        <li>airBaltic (All-A220 fleet)</li>
                        <li>JetBlue</li>
                        <li>Air France</li>
                        <li>Breeze Airways</li>
                        <li>EgyptAir</li>
                        <li>Iraqi Airways</li>
                        <li>Air Austral</li>
                        <li>Air Tanzania</li>
                        <li>Cyprus Airways</li>
                      </ul>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <h4 className="text-sm font-semibold text-emerald-800 mb-2">A220-100 ONLY</h4>
                      <ul className="space-y-1 text-xs text-emerald-700">
                        <li>Executive/Private Jets</li>
                        <li>(Niche operators)</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Advice: Choose an Airline, Not a Variant</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    Since the rating is the same, choose based on the Airline's Fleet Mix:
                  </p>
                  <div className="space-y-3 mb-4">
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <h4 className="text-sm font-semibold text-emerald-800 mb-1">Choose a -100 Operator (e.g., Delta, SWISS)</h4>
                      <p className="text-xs text-emerald-700">If you want to fly into unique, challenging airports with short runways. The -100 has a better thrust-to-weight ratio and can get in and out of places the -300 cannot. It is the largest aircraft certified for London City Airport (LCY) due to its steep approach capabilities.</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-1">Choose a -300 Operator (e.g., Air France, JetBlue, Breeze)</h4>
                      <p className="text-xs text-blue-700">If you want maximum job security and variety. With a backlog of over 700 units, this variant is the industry standard for "long and thin" routes, including some trans-Atlantic hops. It is easier to land smoothly due to its longer fuselage.</p>
                    </div>
                  </div>

                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                    <h3 className="text-sm font-bold text-sky-800 mb-1 uppercase tracking-wide">Pilot Recognition Verdict</h3>
                    <p className="text-sm text-sky-700 leading-relaxed italic">
                      "Don't worry about choosing a variant—focus on getting the BD-500 rating. Once you have it, you are part of an elite group of ~5,000 pilots who can fly the most modern narrow-body fleet in the world. If you want the 'purest' flying experience, aim for the -100; if you want the most stable career path, the -300 is the king of the backlog."
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Comparison' && selectedAircraft.id === 'a320' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">A320 Comparison Profile</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    The A320 is most frequently compared to its arch-rival, the Boeing 737, and its smaller, more modern sibling, the Airbus A220.
                  </p>

                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm text-slate-600 border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="text-left p-2 border border-slate-200 font-semibold">Feature</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">Airbus A320 (CEO/NEO)</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">Boeing 737 (NG/MAX)</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">Airbus A220-300</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Control System</td>
                          <td className="p-2 border border-slate-200">Sidestick / Fly-By-Wire</td>
                          <td className="p-2 border border-slate-200">Control Yoke / Cables (Manual)</td>
                          <td className="p-2 border border-slate-200">Sidestick / Fly-By-Wire</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Cockpit Tech</td>
                          <td className="p-2 border border-slate-200">Glass Cockpit / ECAM</td>
                          <td className="p-2 border border-slate-200">Glass Cockpit / Overhead Panels</td>
                          <td className="p-2 border border-slate-200">Advanced 5-Screen / Mouse-CCU</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Training Path</td>
                          <td className="p-2 border border-slate-200">Foundation for A330/A350</td>
                          <td className="p-2 border border-slate-200">Foundation for 777/787</td>
                          <td className="p-2 border border-slate-200">Standalone (Niche)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Pilot Comfort</td>
                          <td className="p-2 border border-slate-200">High (Tray table, wider cockpit)</td>
                          <td className="p-2 border border-slate-200">Moderate (Cramped, no table)</td>
                          <td className="p-2 border border-slate-200">High (Newest design)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Market Role</td>
                          <td className="p-2 border border-slate-200">Global Backbone</td>
                          <td className="p-2 border border-slate-200">Global Backbone</td>
                          <td className="p-2 border border-slate-200">High-Efficiency Specialist</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Handling</td>
                          <td className="p-2 border border-slate-200">"Law" Protected (Stable)</td>
                          <td className="p-2 border border-slate-200">Traditional (Manual feel)</td>
                          <td className="p-2 border border-slate-200">"Law" Protected (Responsive)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">A320ceo vs. A320neo: Pilot's Quick Fact Sheet</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    While the "office" remains virtually identical, the performance jump is substantial.
                  </p>

                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm text-slate-600 border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="text-left p-2 border border-slate-200 font-semibold">Feature</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">A320ceo (Current Engine Option)</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">A320neo (New Engine Option)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Engines</td>
                          <td className="p-2 border border-slate-200">CFM56-5B or IAE V2500</td>
                          <td className="p-2 border border-slate-200">CFM LEAP-1A or PW1100G-JM</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Fuel Burn</td>
                          <td className="p-2 border border-slate-200">Standard Efficiency</td>
                          <td className="p-2 border border-slate-200">15–20% Lower Fuel Burn</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Range</td>
                          <td className="p-2 border border-slate-200">~6,200 km (3,350 nm)</td>
                          <td className="p-2 border border-slate-200">~6,400 km (3,450 nm)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Max Capacity</td>
                          <td className="p-2 border border-slate-200">180 Passengers</td>
                          <td className="p-2 border border-slate-200">194 Passengers</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Noise Level</td>
                          <td className="p-2 border border-slate-200">Standard</td>
                          <td className="p-2 border border-slate-200">50% Quieter</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Sharklets</td>
                          <td className="p-2 border border-slate-200">Optional (Retrofit or later models)</td>
                          <td className="p-2 border border-slate-200">Standard</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Key Technical Intelligence</h3>
                  <div className="space-y-3 mb-4">
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                      <h4 className="text-sm font-semibold text-emerald-800 mb-1">95% Airframe Commonality</h4>
                      <p className="text-xs text-emerald-700">From a pilot's perspective, the cockpit and operational philosophy are largely unchanged. This means a pilot can fly an A320ceo one day and an A320neo the next with only minor differences training.</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-1">Engine Innovation</h4>
                      <p className="text-xs text-blue-700">The "neo" uses larger fan diameters and higher bypass ratios to achieve its efficiency. Specifically, the Pratt & Whitney PW1100G uses a unique Geared Turbofan system, allowing the fan and turbine to spin at their respective optimal speeds.</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <h4 className="text-sm font-semibold text-purple-800 mb-1">Weight & Performance</h4>
                      <p className="text-xs text-purple-700">The "neo" is roughly 1.8 tonnes heavier than the "ceo," but pilots enjoy better climb performance, often reaching initial cruise altitudes (FL350) much faster.</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                      <h4 className="text-sm font-semibold text-orange-800 mb-1">Aero Enhancements</h4>
                      <p className="text-xs text-orange-700">Standard Sharklets (2.4m tall wingtip devices) improve the lift-to-drag ratio, reducing fuel consumption by up to 4% on long-haul routes.</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Strategic Advice for Pilots</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h4 className="text-sm font-semibold text-purple-800 mb-1">A320 vs. Boeing 737</h4>
                      <p className="text-xs text-purple-700"><strong>The Choice:</strong> Choose the A320 if you prefer a modern, ergonomic office with a tray table and a sidestick that does a lot of the "heavy lifting" for you via flight envelope protections.</p>
                      <p className="text-xs text-purple-700 mt-2"><strong>The Career:</strong> The A320 rating is generally considered more "flexible" globally, as the systems logic prepares you perfectly for the larger A330 and A350 widebodies.</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <h4 className="text-sm font-semibold text-orange-800 mb-1">A320 vs. A220</h4>
                      <p className="text-xs text-orange-700"><strong>The Choice:</strong> Choose the A320 if you want the widest possible variety of airlines to work for. While the A220 is "newer" and "fancier," the A320 has 10x the number of jobs available worldwide.</p>
                      <p className="text-xs text-orange-700 mt-2"><strong>The Career:</strong> The A320 is the safer "long-term" bet for job security, while the A220 is a "boutique" rating for pilots who want to fly the latest tech on specific regional/mainline routes.</p>
                    </div>
                  </div>

                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                    <h3 className="text-sm font-bold text-sky-800 mb-1 uppercase tracking-wide">PILOT RECOGNITION VERDICT</h3>
                    <p className="text-sm text-sky-700 leading-relaxed italic">
                      "The A320 is the industry standard. If you are looking for your first jet rating, this is the one. It offers the best balance of pay, global job mobility, and a clear path to widebody 'Heavy' aircraft later in your career."
                    </p>
                  </div>

                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 mt-4">
                    <h3 className="text-sm font-bold text-emerald-800 mb-1 uppercase tracking-wide">CEO vs. NEO Summary</h3>
                    <p className="text-sm text-emerald-700 leading-relaxed italic">
                      "The 'neo' is the smarter, greener version of the world's most popular jet. While it feels the same in your hands, the fuel savings and range boost make it the clear choice for airlines looking toward 2030 and beyond."
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Comparison' && selectedAircraft.id === 'a330' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">A320 to A330: The Career Leap</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    This transition chart shows A320 pilots exactly how to level up their careers. It highlights how Airbus's Common Cockpit Philosophy turns a narrow-body pilot into a wide-body "Heavy" pilot with minimal friction.
                  </p>

                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm text-slate-600 border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="text-left p-2 border border-slate-200 font-semibold">Feature</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">Airbus A320 (The Foundation)</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">Airbus A330 (The Heavy Step)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Typical Mission</td>
                          <td className="p-2 border border-slate-200">1–4 Hour Regional Sectors</td>
                          <td className="p-2 border border-slate-200">6–12 Hour Long-Haul Layovers</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Flight Deck</td>
                          <td className="p-2 border border-slate-200">Standard 6-screen Glass Cockpit</td>
                          <td className="p-2 border border-slate-200">95% Identical (Familiar layout)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Sidestick Logic</td>
                          <td className="p-2 border border-slate-200">Normal/Alternate/Direct Law</td>
                          <td className="p-2 border border-slate-200">Same Laws (Scale adjusted for mass)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Training Path</td>
                          <td className="p-2 border border-slate-200">Full Type Rating (4-6 weeks)</td>
                          <td className="p-2 border border-slate-200">CCQ Short Course (8-10 Days)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Pilot Workload</td>
                          <td className="p-2 border border-slate-200">High (Multiple takeoffs/landings per day)</td>
                          <td className="p-2 border border-slate-200">Low (Cruise-heavy, 1 takeoff/landing)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Wake Category</td>
                          <td className="p-2 border border-slate-200">Medium</td>
                          <td className="p-2 border border-slate-200">Heavy (Enhanced prestige/pay)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Bunk/Rest</td>
                          <td className="p-2 border border-slate-200">None (Flight deck only)</td>
                          <td className="p-2 border border-slate-200">Dedicated Crew Rest Compartments</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Why the Transition is the "Smartest Move" in Aviation</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                      <h4 className="text-sm font-semibold text-emerald-800 mb-1">1. The CCQ (Cross-Crew Qualification) Advantage</h4>
                      <p className="text-xs text-emerald-700">Because the A330 was designed to be handled just like an A320, the training is essentially a "differences" course. You learn the Trim Tank (fuel in the tail for CG balance) and the larger landing gear geometry, but you don't have to re-learn how to fly the airplane.</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-1">2. Physical Handling: "A320 on Slow Motion"</h4>
                      <p className="text-xs text-blue-700">Pilots transitioning to the A330 often describe it as flying an A320 that has been slowed down. The aircraft is much heavier (242 tonnes vs 78 tonnes), so it has more inertia. It responds slightly slower to sidestick inputs, which many pilots find makes it easier and smoother to land.</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <h4 className="text-sm font-semibold text-purple-800 mb-1">3. Lifestyle & Pay Jump</h4>
                      <p className="text-xs text-purple-700"><strong>The Pay:</strong> Moving to the A330 usually triggers "Widebody Pay Scales," which are typically 15-25% higher than narrow-body rates for the same seniority level.</p>
                      <p className="text-xs text-purple-700 mt-2"><strong>The Lifestyle:</strong> Instead of flying 4 sectors and sleeping at home, you fly one long sector and spend 24–48 hours in cities like Tokyo, London, or Rio.</p>
                    </div>
                  </div>

                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200 mb-4">
                    <h3 className="text-sm font-bold text-sky-800 mb-1 uppercase tracking-wide">Strategic Advice: The "A330 Passport"</h3>
                    <p className="text-sm text-sky-700 leading-relaxed italic">
                      "If you are an A320 pilot, the A330 rating is your passport to the world. It is the most efficient way to get 'Heavy' time in your logbook. Once you have A330 time, you are a prime candidate for the A350, as the commonality continues upward through the entire Airbus family."
                    </p>
                  </div>

                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                    <h3 className="text-sm font-bold text-emerald-800 mb-1 uppercase tracking-wide">The "Pilot Recognition" Verdict</h3>
                    <p className="text-sm text-emerald-700 leading-relaxed italic">
                      "Don't stay in the narrow-body lane forever. If your airline operates both, or if you're looking to move to a global carrier, the A330 is the most logical and highest-ROI upgrade for an A320-rated pilot."
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Comparison' && selectedAircraft.id !== 'a220-300' && selectedAircraft.id !== 'a220-100' && selectedAircraft.id !== 'a320' && selectedAircraft.id !== 'a330' && (
                <p className="text-sm text-slate-500 italic">Comparison data is not available for this aircraft.</p>
              )}
            </div>

            {/* Training Curriculum */}
            <div className="px-6 md:px-8 py-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Training Curriculum</h3>
              <div className="space-y-4">
                {selectedAircraft.trainingCurriculum.map((item, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{item.phase}</h4>
                      <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded">{item.duration}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.topics.map((topic, j) => (
                        <span key={j} className="text-xs text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">{topic}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulator Details */}
            <div className="px-6 md:px-8 py-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Simulator Training</h3>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Simulator Type</p>
                    <p className="font-semibold text-slate-900">{selectedAircraft.simulatorDetails.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Available Locations</p>
                    <p className="font-semibold text-slate-900">{selectedAircraft.simulatorDetails.locations.join(', ')}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-slate-500 mb-1">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAircraft.simulatorDetails.features.map((feature, i) => (
                      <span key={i} className="text-xs text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">{feature}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Extended Info Modal */}
      {showExtendedInfo && selectedAircraft && selectedAircraft.id === 'a220-300' && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
          <div className="min-h-full flex items-start justify-center p-4 pt-10 pb-10">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl relative">
              <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl sticky top-0 z-10">
                <h2 className="text-xl font-bold text-slate-900">{selectedAircraft.model} — Pilot Career Outlook</h2>
                <button
                  onClick={() => setShowExtendedInfo(false)}
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <section>
                  <h3 className="text-lg font-semibold text-sky-700 mb-2">The "Why": Pilot Benefits vs. Other Airbus Ratings</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">
                    Unlike the A320 or A350, the A220 was a "clean-sheet" design (originally the Bombardier CSeries). This offers specific advantages:
                  </p>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li><strong>Modernity:</strong> It features a newer flight deck than the A320. It uses Sidestick controllers and a Fly-By-Wire system, but with the latest tech—including five large LCD screens and an electronic flight bag (EFB) integrated from day one.</li>
                    <li><strong>Steep Approach Capability:</strong> It is certified for steep approaches (like London City), giving pilots access to challenging, prestigious, and "fun" airports that many standard narrow-bodies can't touch.</li>
                    <li><strong>Comfort:</strong> Because the cabin altitude is lower and the windows are larger, crew fatigue is often reported as lower compared to older narrow-body fleets.</li>
                    <li><strong>The "Cross-Crew Qualification" (CCQ):</strong> While it is a distinct type rating from the A320 family, Airbus has worked to harmonize training. For a pilot, having an A220 rating on a license is currently a "boutique" skill that sets them apart from the massive pool of A320-rated pilots.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-sky-700 mb-2">Market Demand & Backlog (Job Security)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">
                    The A220 is not just "in demand"—it has one of the healthiest backlogs in its segment, ensuring decades of flying for newly rated pilots.
                  </p>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li><strong>Total Orders:</strong> 959 firm orders from 33–34 different customers.</li>
                    <li><strong>Remaining Backlog:</strong> Approximately 458 aircraft are still waiting to be built and delivered as of April 2026.</li>
                    <li><strong>Production Goal:</strong> Airbus is aiming to ramp up to 12 aircraft per month by the end of 2026.</li>
                    <li><strong>Market Share:</strong> The A220 family holds over 55% market share in the small single-aisle commercial aircraft sector.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-sky-700 mb-2">A220 Pilot Community</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">
                    The A220 pilot community is relatively small compared to legacy types, creating excellent opportunities for newly rated pilots.
                  </p>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li><strong>Global Community Size:</strong> Approximately 5,000+ pilots (vs. 150,000+ for A320 family).</li>
                    <li><strong>Pilots Per Aircraft:</strong> Major airlines typically employ 10-12 pilots per aircraft for duty limits and scheduling.</li>
                    <li><strong>Major Employers:</strong> Delta Air Lines (85 aircraft), airBaltic (all-A220 fleet, 54 aircraft, 1,500+ pilots), JetBlue (61), Air France (55), Breeze Airways (54).</li>
                    <li><strong>Growth Potential:</strong> The backlog will require approximately 4,500-5,500 additional A220-rated pilots in coming years to staff new deliveries.</li>
                    <li><strong>Certification:</strong> Listed as BD-500 by aviation authorities (reflecting Bombardier CSeries origins), covers both A220-100 and A220-300 under a single rating.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-sky-700 mb-2">Operational Reliability & Reach</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">
                    Pilots can use these stats to judge the maturity of the "office" they will be working in:
                  </p>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li><strong>Flight Hours:</strong> The global fleet has surpassed 3.65 million block hours.</li>
                    <li><strong>Flight Cycles:</strong> Over 2.08 million flights completed.</li>
                    <li><strong>Route Network:</strong> The A220 currently serves over 1,900 routes to more than 500 destinations.</li>
                    <li><strong>Reliability:</strong> Maintains a 99% operational reliability (3-month rolling average), making it a highly dependable machine for flight crews.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-sky-700 mb-2">Why Pilots Choose It (Technical Perks)</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li><strong>Modern Cockpit:</strong> Features five 15.1-inch LCD displays and full Fly-By-Wire technology.</li>
                    <li><strong>Environmentally Leading:</strong> 25% lower fuel burn and CO2 emissions per seat compared to previous generation aircraft.</li>
                    <li><strong>Maintenance Intervals:</strong> Pilots deal with fewer mechanical groundings due to longer intervals: 1,000 hours for "A" checks and 8,500 hours for "C" checks.</li>
                  </ul>
                </section>

                <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                  <h3 className="text-sm font-bold text-sky-800 mb-1 uppercase tracking-wide">Summary for Pilots</h3>
                  <p className="text-sm text-sky-700 leading-relaxed italic">
                    "This aircraft is at the 'peak of its youth.' With over 500 planes in the air and another 450+ on the way, an A220 type rating is one of the most future-proof credentials a pilot can hold right now."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
