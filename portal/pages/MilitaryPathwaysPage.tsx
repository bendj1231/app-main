import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, MapPin, Star, Shield, Users, Clock, Award, Plane, X } from 'lucide-react';
import { DUMMY_MILITARY_PATHWAYS, MilitaryBranch } from '../../data/military-pathways';
import { useAuth } from '../../src/contexts/AuthContext';

interface MilitaryPathwaysPageProps {
  pathwayId: string;
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

// Search Bar component
const SearchBar: React.FC<{ onSearch: (query: string) => void; isDarkMode?: boolean }> = ({ onSearch, isDarkMode = true }) => (
  <div className="relative w-[600px] flex items-center gap-3">
    <div className="relative flex-1">
      <Search className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
      <input
        type="text"
        placeholder="Search military pathways, branches, or locations..."
        className={`w-full pl-4 pr-12 py-4 backdrop-blur border rounded-lg focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all ${
          isDarkMode
            ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400'
            : 'bg-white/70 border-slate-300/50 text-slate-900 placeholder-slate-500'
        }`}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  </div>
);

const MilitaryPathwaysPage: React.FC<MilitaryPathwaysPageProps> = ({ pathwayId, onBack, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMilitaryPathway, setSelectedMilitaryPathway] = useState<any>(null);
  const militaryCarouselRef = useRef<HTMLDivElement>(null);
  const [branchFilter, setBranchFilter] = useState<MilitaryBranch>('All');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { currentUser } = useAuth();

  // Filter military pathways by branch
  const filteredMilitaryPathways = DUMMY_MILITARY_PATHWAYS.filter(pathway => {
    if (pathway.id === 'military-intro') return true;
    if (branchFilter === 'All') return true;
    return pathway.branch === branchFilter;
  });

  // Filter by search query
  const searchFilteredPathways = filteredMilitaryPathways.filter(pathway => {
    if (pathway.id === 'military-intro') return true;
    const query = searchQuery.toLowerCase();
    return (
      pathway.name.toLowerCase().includes(query) ||
      pathway.description.toLowerCase().includes(query) ||
      pathway.location.toLowerCase().includes(query)
    );
  });

  // Set initial selected pathway
  useEffect(() => {
    if (searchFilteredPathways.length > 0 && !selectedMilitaryPathway) {
      setSelectedMilitaryPathway(searchFilteredPathways[0]);
    }
  }, [selectedMilitaryPathway, searchFilteredPathways]);

  const scrollMilitaryCarousel = (dir: 'left' | 'right') => {
    const container = militaryCarouselRef.current;
    if (!container || searchFilteredPathways.length === 0) return;

    const currentIndex = searchFilteredPathways.findIndex(p => p.id === selectedMilitaryPathway?.id);
    if (currentIndex === -1) return;

    let newIndex = dir === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0) newIndex = searchFilteredPathways.length - 1;
    if (newIndex >= searchFilteredPathways.length) newIndex = 0;

    setSelectedMilitaryPathway(searchFilteredPathways[newIndex]);

    setTimeout(() => {
      const cardElements = container.querySelectorAll('[data-card-id]');
      const targetCard = Array.from(cardElements).find(el => el.getAttribute('data-card-id') === searchFilteredPathways[newIndex].id);
      if (targetCard) {
        const cardCenter = (targetCard as HTMLElement).offsetLeft + (targetCard as HTMLElement).offsetWidth / 2;
        container.scrollTo({ left: cardCenter - container.offsetWidth / 2, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 backdrop-blur-md ${isDarkMode ? 'bg-slate-900/80 border-b border-slate-700' : 'bg-white/80 border-b border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-800 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Military Flight Training
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Shield className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {searchFilteredPathways.length - 1} Pathways Available
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <SearchBar onSearch={setSearchQuery} isDarkMode={isDarkMode} />
        </div>

        {/* Branch Filter */}
        <div className="flex justify-center flex-wrap gap-2 mb-8">
          {(['All', 'Air Force', 'Navy', 'Army', 'Marine Corps'] as MilitaryBranch[]).map((branch) => (
            <button
              key={branch}
              onClick={() => setBranchFilter(branch)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                branchFilter === branch
                  ? 'bg-blue-600 text-white shadow-lg'
                  : isDarkMode
                  ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {branch === 'All' ? 'All Branches' : branch}
            </button>
          ))}
        </div>

        {/* Military Pathways Carousel */}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Military Aviation Programs
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => scrollMilitaryCarousel('left')}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollMilitaryCarousel('right')}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'}`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={militaryCarouselRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {searchFilteredPathways.map((pathway) => (
              <motion.div
                key={pathway.id}
                data-card-id={pathway.id}
                onClick={() => setSelectedMilitaryPathway(pathway)}
                className={`flex-shrink-0 w-80 rounded-2xl overflow-hidden cursor-pointer transition-all ${
                  selectedMilitaryPathway?.id === pathway.id
                    ? 'ring-4 ring-blue-500 scale-105'
                    : isDarkMode
                    ? 'bg-slate-800 hover:bg-slate-700'
                    : 'bg-white hover:bg-slate-50 border border-slate-300'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {pathway.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={pathway.image}
                      alt={pathway.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {pathway.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        {pathway.rating}
                      </span>
                    </div>
                  </div>
                  <p className={`text-sm mb-3 line-clamp-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {pathway.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                      {pathway.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-2">
                    <Clock className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                      {pathway.serviceCommitment}
                    </span>
                  </div>
                  {pathway.branch !== 'All' && (
                    <div className="mt-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        pathway.branch === 'Air Force' ? 'bg-blue-100 text-blue-800' :
                        pathway.branch === 'Navy' ? 'bg-blue-100 text-blue-800' :
                        pathway.branch === 'Army' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {pathway.branch}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Selected Pathway Details */}
        <AnimatePresence>
          {selectedMilitaryPathway && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mt-8 p-6 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white border border-slate-300'}`}
            >
              <div className="flex items-start gap-6">
                {selectedMilitaryPathway.image && (
                  <div className="flex-shrink-0">
                    <img
                      src={selectedMilitaryPathway.image}
                      alt={selectedMilitaryPathway.name}
                      className="w-48 h-48 object-cover rounded-xl"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {selectedMilitaryPathway.name}
                  </h2>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {selectedMilitaryPathway.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                      <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                        {selectedMilitaryPathway.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                      <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                        {selectedMilitaryPathway.serviceCommitment}
                      </span>
                    </div>
                  </div>
                  <p className={`mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {selectedMilitaryPathway.description}
                  </p>
                  {selectedMilitaryPathway.branch !== 'All' && (
                    <div className="mb-4">
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                        selectedMilitaryPathway.branch === 'Air Force' ? 'bg-blue-100 text-blue-800' :
                        selectedMilitaryPathway.branch === 'Navy' ? 'bg-blue-100 text-blue-800' :
                        selectedMilitaryPathway.branch === 'Army' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedMilitaryPathway.branch}
                      </span>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        isDarkMode
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      Apply Now
                    </button>
                    <button
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        isDarkMode
                          ? 'bg-slate-700 hover:bg-slate-600 text-white'
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MilitaryPathwaysPage;
