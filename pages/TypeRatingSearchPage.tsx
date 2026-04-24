import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Plane, CheckCircle2, Star, DollarSign, Calendar, FileText, Gauge, Building2, BookOpen, MousePointerClick, Briefcase } from 'lucide-react';
import { manufacturers, aircraftTypeRatings, Manufacturer, AircraftTypeRating, getManufacturerById, getAircraftByManufacturer, getAircraftByCategory } from '../data/aircraft-manufacturers';

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

export default function TypeRatingSearchPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [activeLegacySubcategory, setActiveLegacySubcategory] = useState<string | null>(null);
  const [activeHelicopterSubcategory, setActiveHelicopterSubcategory] = useState<string | null>(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState<AircraftTypeRating | null>(null);
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
    
    if (searchQuery) {
      aircraft = aircraft.filter(a => 
        a.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.manufacturerId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return aircraft;
  }, [selectedManufacturer, activeCategory, activeLegacySubcategory, activeHelicopterSubcategory, searchQuery]);

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

      {/* Category filter chips */}
      <div className="max-w-7xl mx-auto px-6 mb-8 flex gap-1.5 flex-wrap justify-center">
        {availableCategories.map(cat => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setActiveLegacySubcategory(null); setActiveHelicopterSubcategory(null); setSelectedAircraft(null); }}
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
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1.5 text-sky-300 text-sm">
                    <img src={getManufacturer(selectedAircraft)?.logo || '/logo.png'} alt="Manufacturer" className="h-4 w-auto object-contain opacity-80" />
                    {getManufacturer(selectedAircraft)?.name}
                  </span>
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

            {/* Description Section — requirements + specs */}
            <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8 border-b border-slate-100">
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
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Description</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{selectedAircraft.description}</p>
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
            <div className="px-6 md:px-8 py-6">
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
    </div>
  );
}
