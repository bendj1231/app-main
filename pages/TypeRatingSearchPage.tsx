import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, Filter, Plane, Target, LayoutGrid, ArrowLeft } from 'lucide-react';
import { aircraftModels, AircraftModel } from '../data/aircraft-models';

// Category labels
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

// Category colors for badges
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

export default function TypeRatingSearchPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState<AircraftModel | null>(null);
  const [showCockpit, setShowCockpit] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Filter aircraft by category and search
  const filteredAircraft = aircraftModels.filter(aircraft => {
    const matchesCategory = activeCategory === 'all' || aircraft.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      aircraft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aircraft.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Triple the array for infinite scrolling
  const infiniteAircraft = [...filteredAircraft, ...filteredAircraft, ...filteredAircraft];

  // Scroll carousel
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    
    const cardWidth = 600; // Card width + gap
    const scrollAmount = direction === 'right' ? cardWidth : -cardWidth;
    
    carouselRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  // Handle infinite scroll reset
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      const currentScroll = carousel.scrollLeft;

      // If scrolled to first third, jump to second third
      if (currentScroll < maxScroll / 3) {
        carousel.scrollLeft = currentScroll + maxScroll / 3;
      }
      // If scrolled past second third, jump to first third
      else if (currentScroll > (maxScroll / 3) * 2) {
        carousel.scrollLeft = currentScroll - maxScroll / 3;
      }
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, [filteredAircraft]);

  const bgGradient = isDarkMode 
    ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
    : 'bg-gradient-to-br from-slate-50 via-white to-slate-100';
  
  const headerText = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const borderColor = isDarkMode ? 'border-slate-700' : 'border-slate-200';
  const headerBg = isDarkMode ? 'bg-slate-900/80' : 'bg-white/80';

  return (
    <div className={`min-h-screen ${bgGradient}`}>
      {/* Header */}
      <header className={`${headerBg} border-b ${borderColor} backdrop-blur-sm sticky top-0 z-40`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.location.href = '/'}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900'} transition-all`}
                title="Back to Home"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <img 
                src="/logo.png" 
                alt="WingMentor Logo" 
                className="h-12 w-auto object-contain"
              />
              <div>
                <h1 className={`text-xl font-bold ${headerText}`}>
                  Type Rating Search
                </h1>
                <p className={`${subText} text-xs`}>Explore aircraft types and cockpits</p>
              </div>
            </div>
            
            {/* Search */}
            <div className="flex items-center gap-3">
              <div className={`relative ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} rounded-lg flex items-center px-3 py-2`}>
                <Search className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  type="text"
                  placeholder="Search aircraft..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`bg-transparent border-none outline-none ml-2 w-48 ${headerText} text-sm`}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className={`text-4xl md:text-5xl font-serif font-normal ${headerText} mb-2`}>
            Aircraft <span style={{ color: '#DAA520' }}>Type Ratings</span>
          </h1>
          <p className={`${subText} max-w-2xl mx-auto`}>
            Explore different aircraft types, their specifications, and cockpit layouts. Find the perfect aircraft for your next type rating.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {Object.keys(categoryLabels).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? `${categoryColors[category]} text-white shadow-lg scale-105`
                  : isDarkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>

        {/* Edge-to-edge Carousel Section */}
        <div className="flex flex-col items-center">
          <div className="w-full text-center mb-4">
            <h2 className={`text-3xl md:text-4xl font-serif font-normal ${headerText} mb-2`}>
              {activeCategory === 'all' ? 'All Aircraft' : categoryLabels[activeCategory]}
            </h2>
            <p className={`${subText} text-sm`}>
              {filteredAircraft.length} aircraft models available
              <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">3D MODELS</span>
            </p>
            <p className={`text-xs ${subText} italic mt-2`}>Swipe left and right or click arrows to browse aircraft</p>
          </div>

          {/* Carousel Container */}
          <div className="relative w-screen max-w-none left-1/2 -translate-x-1/2 overflow-hidden">
            <style>{`
              .aircraft-carousel::-webkit-scrollbar { display: none; }
              .aircraft-carousel { -ms-overflow-style: none; scrollbar-width: none; scroll-snap-type: x mandatory; }
              .aircraft-carousel > div { scroll-snap-align: center; scroll-snap-stop: always; }
            `}</style>
            <div
              ref={carouselRef}
              className="aircraft-carousel flex gap-6 overflow-x-scroll overflow-y-hidden pb-4"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {infiniteAircraft.map((aircraft, index) => (
                <div
                  key={`${aircraft.id}-${index}`}
                  className="flex-shrink-0 scroll-snap-align-center"
                  style={{ width: '600px' }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'} border rounded-xl overflow-hidden shadow-xl`}
                  >
                    {/* 3D Model View */}
                    <div className="aspect-video w-full relative">
                      <iframe
                        src={aircraft.embedUrl}
                        className="w-full h-full"
                        title={aircraft.title}
                        frameBorder="0"
                        allowFullScreen
                        allow="autoplay; fullscreen; xr-spatial-tracking"
                      />
                    </div>

                    {/* Aircraft Info */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className={`text-xl font-bold ${headerText} mb-1`}>{aircraft.name}</h3>
                          <p className={`text-xs ${subText} uppercase tracking-wider`}>{categoryLabels[aircraft.category]}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${categoryColors[aircraft.category]}`}>
                          {aircraft.category}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {aircraft.tags.slice(0, 5).map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedAircraft(aircraft)}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                            isDarkMode
                              ? 'bg-sky-600 hover:bg-sky-700 text-white'
                              : 'bg-sky-500 hover:bg-sky-600 text-white'
                          }`}
                        >
                          View Details
                        </button>
                        {aircraft.category !== 'cockpit' && (
                          <button
                            onClick={() => {
                              setSelectedAircraft(aircraft);
                              setShowCockpit(true);
                            }}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                              isDarkMode
                              ? 'bg-amber-600 hover:bg-amber-700 text-white'
                              : 'bg-amber-500 hover:bg-amber-600 text-white'
                            }`}
                          >
                            View Cockpit
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => scrollCarousel('left')}
                className={`p-3 rounded-full transition-all ${
                  isDarkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white shadow-xl'
                    : 'bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 shadow-xl'
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className={`p-3 rounded-full transition-all ${
                  isDarkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white shadow-xl'
                    : 'bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 shadow-xl'
                }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Aircraft Detail Modal */}
        <AnimatePresence>
          {selectedAircraft && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => {
                setSelectedAircraft(null);
                setShowCockpit(false);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className={`text-3xl font-bold ${headerText} mb-2`}>{selectedAircraft.name}</h2>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${categoryColors[selectedAircraft.category]}`}>
                          {categoryLabels[selectedAircraft.category]}
                        </span>
                        <p className={`${subText} text-sm`}>Model by {selectedAircraft.author}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedAircraft(null);
                        setShowCockpit(false);
                      }}
                      className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  </div>

                  {/* 3D Model View */}
                  <div className="aspect-video w-full mb-6 rounded-lg overflow-hidden">
                    <iframe
                      src={selectedAircraft.embedUrl}
                      className="w-full h-full"
                      title={selectedAircraft.title}
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; fullscreen; xr-spatial-tracking"
                    />
                  </div>

                  {/* Tags */}
                  <div className="mb-6">
                    <h3 className={`text-lg font-semibold ${headerText} mb-2`}>Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAircraft.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Cockpit View */}
                  {!showCockpit && selectedAircraft.category !== 'cockpit' && (
                    <button
                      onClick={() => setShowCockpit(true)}
                      className={`w-full py-3 rounded-lg font-medium transition-all ${
                        isDarkMode
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-amber-500 hover:bg-amber-600 text-white'
                      }`}
                    >
                      View Cockpit
                    </button>
                  )}

                  {/* Cockpit View */}
                  {showCockpit && selectedAircraft.category !== 'cockpit' && (
                    <div className="mt-6">
                      <h3 className={`text-xl font-semibold ${headerText} mb-4 flex items-center gap-2`}>
                        <LayoutGrid className="w-5 h-5 text-amber-500" />
                        Cockpit View
                      </h3>
                      <div className="aspect-video w-full rounded-lg overflow-hidden">
                        {selectedAircraft.id.includes('a320') || selectedAircraft.id.includes('a318') || selectedAircraft.id.includes('a319') || selectedAircraft.id.includes('a321') ? (
                          <iframe
                            src="https://sketchfab.com/models/feaa475ce5824121be0380a42987007f/embed?camera=0&preload=1&ui_theme=dark&autostart=1&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0"
                            className="w-full h-full"
                            title="A320 Cockpit"
                            frameBorder="0"
                            allowFullScreen
                            allow="autoplay; fullscreen; xr-spatial-tracking"
                          />
                        ) : selectedAircraft.id.includes('737') ? (
                          <iframe
                            src="https://sketchfab.com/models/41a1ae9e252d41bda7c63cfe9fab5a02/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0"
                            className="w-full h-full"
                            title="Boeing 737 Cockpit"
                            frameBorder="0"
                            allowFullScreen
                            allow="autoplay; fullscreen; xr-spatial-tracking"
                          />
                        ) : selectedAircraft.id.includes('747') ? (
                          <iframe
                            src="https://sketchfab.com/models/9e7bfa1049ec44a2a8d8d0bdaf51533c/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0"
                            className="w-full h-full"
                            title="Boeing 747 Cockpit"
                            frameBorder="0"
                            allowFullScreen
                            allow="autoplay; fullscreen; xr-spatial-tracking"
                          />
                        ) : (
                          <div className={`h-full flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <p className={`${subText}`}>Cockpit view not available for this aircraft</p>
                          </div>
                        )}
                      </div>
                      <p className={`text-xs ${subText} mt-2 text-center`}>
                        Interactive cockpit view
                      </p>
                    </div>
                  )}

                  {/* Links */}
                  <div className="mt-6 pt-6 border-t border-slate-700">
                    <a
                      href={selectedAircraft.modelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm ${isDarkMode ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-700'}`}
                    >
                      View on Sketchfab →
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
