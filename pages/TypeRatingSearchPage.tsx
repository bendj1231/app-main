import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Plane, CheckCircle2, Star, LayoutGrid } from 'lucide-react';
import { aircraftModels, AircraftModel } from '../data/aircraft-models';

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

type Category = 'all' | 'commercial' | 'regional' | 'business-jet' | 'single-engine' | 'multi-engine' | 'turboprop' | 'jet' | 'cockpit' | 'amphibious' | 'vintage';

const CATEGORY_LABELS: Record<string, string> = {
  'all': 'All',
  'commercial': 'Commercial',
  'regional': 'Regional',
  'business-jet': 'Business Jets',
  'single-engine': 'Single Engine',
  'multi-engine': 'Multi Engine',
  'turboprop': 'Turboprop',
  'jet': 'Jet',
  'cockpit': 'Cockpits',
  'amphibious': 'Amphibious',
  'vintage': 'Vintage',
};

const CATEGORY_COLORS: Record<string, string> = {
  'commercial': 'bg-blue-500',
  'regional': 'bg-emerald-500',
  'business-jet': 'bg-purple-500',
  'single-engine': 'bg-sky-500',
  'multi-engine': 'bg-indigo-500',
  'turboprop': 'bg-teal-500',
  'jet': 'bg-rose-500',
  'cockpit': 'bg-amber-500',
  'amphibious': 'bg-cyan-500',
  'vintage': 'bg-orange-500',
};

const getCockpitUrl = (id: string): string | null => {
  if (id.includes('a320') || id.includes('a318') || id.includes('a319') || id.includes('a321'))
    return 'https://sketchfab.com/models/feaa475ce5824121be0380a42987007f/embed?camera=0&preload=1&ui_theme=dark&autostart=1';
  if (id.includes('737'))
    return 'https://sketchfab.com/models/41a1ae9e252d41bda7c63cfe9fab5a02/embed?autospin=1&camera=0&preload=1&ui_theme=dark';
  if (id.includes('747'))
    return 'https://sketchfab.com/models/9e7bfa1049ec44a2a8d8d0bdaf51533c/embed?autospin=1&camera=0&preload=1&ui_theme=dark';
  return null;
};

export default function TypeRatingSearchPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState<AircraftModel | null>(null);
  const [showCockpit, setShowCockpit] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const filteredAircraft = aircraftModels.filter(a => {
    const matchesCat = activeCategory === 'all' || a.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

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

  const handleSelect = (aircraft: AircraftModel) => {
    setSelectedAircraft(aircraft);
    setShowCockpit(false);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">

      {/* Header Nav */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
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
            Explore · 3D Models · Cockpits · Requirements
          </p>

          {/* Search */}
          <div className="mt-8 max-w-lg mx-auto relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search aircraft, type ratings, tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-11 py-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="px-0 mb-12">
        <div className="max-w-7xl mx-auto px-6 mb-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-serif font-normal text-slate-900">Browse Aircraft</h2>
            <p className="text-sm text-slate-500">{filteredAircraft.length} aircraft available</p>
          </div>
          {/* Category filter chips */}
          <div className="flex gap-1.5 flex-wrap">
            {(Object.keys(CATEGORY_LABELS) as Category[]).map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setSelectedAircraft(null); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? `${CATEGORY_COLORS[cat] || 'bg-sky-500'} text-white`
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
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
                <SketchfabThumbnail
                  sketchfabId={aircraft.sketchfabId}
                  alt={aircraft.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-white font-serif text-base leading-tight">{aircraft.name}</span>
                  <div className="flex items-center gap-1 text-white/70 text-xs mt-0.5">
                    <Plane className="w-3 h-3" />
                    {CATEGORY_LABELS[aircraft.category]}
                  </div>
                </div>
              </div>
              {/* Card body */}
              <div className="p-4">
                <div className="flex flex-wrap gap-1">
                  {aircraft.tags.slice(0, 4).map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Aircraft Detail Panel */}
      {selectedAircraft && (
        <div ref={detailRef} className="max-w-7xl mx-auto px-6 mb-12">
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg">

            {/* Hero image with overlay */}
            <div className="relative h-64 md:h-80">
              <SketchfabThumbnail
                sketchfabId={selectedAircraft.sketchfabId}
                alt={selectedAircraft.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold tracking-[0.2em] uppercase text-sky-400 bg-sky-500/20 px-3 py-1 rounded-full border border-sky-400/30`}>
                    {CATEGORY_LABELS[selectedAircraft.category]}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-2">{selectedAircraft.name}</h2>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1.5 text-sky-300 text-sm">
                    <img src="/logo.png" alt="WingMentor" className="h-4 w-auto object-contain opacity-80" />
                    Model by {selectedAircraft.author}
                  </span>
                </div>
              </div>
            </div>

            {/* Description Section — requirements side by side */}
            <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Type Rating Requirements</h3>
                <ul className="space-y-2.5">
                  {[
                    'Valid ATPL or frozen ATPL',
                    'Multi-Engine Instrument Rating (ME/IR)',
                    'Class 1 Medical Certificate',
                    'MCC course completion',
                    'ICAO English Level 4+',
                  ].map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-500">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Recommended</h3>
                <ul className="space-y-2.5">
                  {[
                    'Prior experience on similar aircraft type',
                    'Simulator training at approved ATO',
                    'EBT / CBTA certification',
                    'Recent line experience (last 12 months)',
                  ].map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-500">
                      <Star className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 3D Viewer Section — tab switch above, full-width viewer below */}
            <div className="p-6 md:p-8">
              {/* Tab toggle */}
              <div className="flex items-center gap-3 mb-5">
                <button
                  onClick={() => setShowCockpit(false)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${!showCockpit ? 'bg-sky-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  Aircraft Full View 3D
                </button>
                {selectedAircraft.category !== 'cockpit' && (
                  <button
                    onClick={() => setShowCockpit(true)}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${showCockpit ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    Cockpit View
                  </button>
                )}
              </div>

              {/* Full-width viewer */}
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100">
                {!showCockpit ? (
                  <iframe
                    src={selectedAircraft.embedUrl}
                    className="w-full h-full"
                    title={selectedAircraft.title}
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                  />
                ) : getCockpitUrl(selectedAircraft.id) ? (
                  <iframe
                    src={getCockpitUrl(selectedAircraft.id)!}
                    className="w-full h-full"
                    title={`${selectedAircraft.name} Cockpit`}
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                    Cockpit view not available for this aircraft
                  </div>
                )}
              </div>
            </div>

            {/* Tags & link */}
            <div className="px-6 md:px-8 pb-6 border-t border-slate-100 pt-5">
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedAircraft.tags.map(tag => (
                  <span key={tag} className="text-xs px-3 py-1.5 rounded-full font-medium bg-sky-50 text-sky-700 border border-sky-200">
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={selectedAircraft.modelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-sky-600 hover:text-sky-700"
              >
                View on Sketchfab →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
