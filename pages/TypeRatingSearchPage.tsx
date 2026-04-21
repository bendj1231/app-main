import React, { useState, useRef } from 'react';
import { Search, ArrowLeft, X, LayoutGrid } from 'lucide-react';
import { aircraftModels, AircraftModel } from '../data/aircraft-models';

const categoryLabels: Record<string, string> = {
  'all': 'All Aircraft',
  'commercial': 'Commercial',
  'regional': 'Regional',
  'business-jet': 'Business Jets',
  'single-engine': 'Single Engine',
  'multi-engine': 'Multi Engine',
  'turboprop': 'Turboprop',
  'jet': 'Jet',
  'cockpit': 'Cockpits',
  'amphibious': 'Amphibious',
  'vintage': 'Vintage'
};

const categoryColors: Record<string, string> = {
  'commercial': 'bg-blue-500',
  'regional': 'bg-emerald-500',
  'business-jet': 'bg-purple-500',
  'single-engine': 'bg-sky-500',
  'multi-engine': 'bg-indigo-500',
  'turboprop': 'bg-teal-500',
  'jet': 'bg-rose-500',
  'cockpit': 'bg-amber-500',
  'amphibious': 'bg-cyan-500',
  'vintage': 'bg-orange-500'
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
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState<AircraftModel | null>(null);
  const [showCockpit, setShowCockpit] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);

  const filteredAircraft = aircraftModels.filter(aircraft => {
    const matchesCategory = activeCategory === 'all' || aircraft.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      aircraft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aircraft.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSelect = (aircraft: AircraftModel) => {
    setSelectedAircraft(aircraft);
    setShowCockpit(false);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/80 border-b border-slate-200 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
          <img src="/logo.png" alt="WingMentor" className="h-10 w-auto object-contain" />
          <div>
            <h1 className="text-lg font-bold text-slate-900">Aircraft Type-Ratings</h1>
            <p className="text-slate-500 text-xs">Explore aircraft types and 3D models</p>
          </div>
          <div className="ml-auto relative">
            <input
              type="text"
              placeholder="Search aircraft..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-4 pr-10 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/40 w-56"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-normal text-slate-900 mb-2">
            Aircraft <span style={{ color: '#DAA520' }}>Type Ratings</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm">
            Click any aircraft to explore its 3D model and cockpit. {filteredAircraft.length} aircraft available.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {Object.keys(categoryLabels).map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setSelectedAircraft(null); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? `${categoryColors[cat] || 'bg-sky-500'} text-white shadow-md scale-105`
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Aircraft Grid — thumbnails only, no iframes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {filteredAircraft.map(aircraft => (
            <button
              key={aircraft.id}
              onClick={() => handleSelect(aircraft)}
              className={`group text-left rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-all ${
                selectedAircraft?.id === aircraft.id
                  ? 'ring-2 ring-sky-500 border-sky-400'
                  : 'border-slate-200 hover:border-sky-300'
              } bg-white`}
            >
              <div className="aspect-video bg-slate-100 relative overflow-hidden">
                <img
                  src={`https://media.sketchfab.com/models/${aircraft.sketchfabId}/thumbnails/2048x2048/e3ab0eff2ed442ecb9e06d5e7aaf62e3.jpeg`}
                  alt={aircraft.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => {
                    (e.target as HTMLImageElement).src = `https://media.sketchfab.com/models/${aircraft.sketchfabId}/thumbnails/640x360/8f5c92def5534d9ab02b0ccdc4cf9eff.jpeg`;
                  }}
                />
                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-semibold text-white ${categoryColors[aircraft.category] || 'bg-slate-500'}`}>
                  {categoryLabels[aircraft.category]}
                </span>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-slate-900 truncate">{aircraft.name}</p>
                <p className="text-xs text-slate-500 truncate">{aircraft.tags.slice(0, 3).join(' · ')}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Inline Detail Panel — iframe loads only here */}
        {selectedAircraft && (
          <div ref={detailRef} className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden mb-12">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="WingMentor" className="h-8 w-auto object-contain" />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedAircraft.name}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold text-white ${categoryColors[selectedAircraft.category]}`}>
                      {categoryLabels[selectedAircraft.category]}
                    </span>
                    <span className="text-xs text-slate-500">Model by {selectedAircraft.author}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedAircraft(null)}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Toggle */}
            <div className="flex gap-2 px-6 pt-4">
              <button
                onClick={() => setShowCockpit(false)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${!showCockpit ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                3D Model
              </button>
              {selectedAircraft.category !== 'cockpit' && (
                <button
                  onClick={() => setShowCockpit(true)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${showCockpit ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  <LayoutGrid className="w-4 h-4 inline mr-1" />
                  Cockpit View
                </button>
              )}
            </div>

            {/* 3D Model iframe — only loads when panel is open */}
            <div className="px-6 py-4">
              {!showCockpit ? (
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100">
                  <iframe
                    src={selectedAircraft.embedUrl}
                    className="w-full h-full"
                    title={selectedAircraft.title}
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100">
                  {getCockpitUrl(selectedAircraft.id) ? (
                    <iframe
                      src={getCockpitUrl(selectedAircraft.id)!}
                      className="w-full h-full"
                      title={`${selectedAircraft.name} Cockpit`}
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; fullscreen; xr-spatial-tracking"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                      Cockpit view not available for this aircraft
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tags & Link */}
            <div className="px-6 pb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedAircraft.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs bg-slate-100 text-slate-600">{tag}</span>
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
        )}
      </main>
    </div>
  );
}
