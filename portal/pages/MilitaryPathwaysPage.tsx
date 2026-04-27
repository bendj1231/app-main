import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, MapPin, Star, Shield, Users, Clock, Award, Plane, X, ArrowLeft, User, Settings, Bell, LogOut, Globe } from 'lucide-react';
import { DUMMY_MILITARY_PATHWAYS, MilitaryBranch } from '../../data/military-pathways';
import { useAuth } from '../../src/contexts/AuthContext';

interface MilitaryPathwaysPageProps {
  pathwayId: string;
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

type Region = 'All' | 'Asia' | 'Europe' | 'Americas' | 'Oceania' | 'Africa' | 'Middle East';

const MilitaryPathwaysPage: React.FC<MilitaryPathwaysPageProps> = ({ pathwayId, onBack, onNavigate }) => {
  console.log('[DEBUG] MilitaryPathwaysPage mounted with pathwayId:', pathwayId);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMilitaryPathway, setSelectedMilitaryPathway] = useState<any>(null);
  const militaryCarouselRef = useRef<HTMLDivElement>(null);
  const [branchFilter, setBranchFilter] = useState<MilitaryBranch>('All');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { currentUser } = useAuth();
  
  // Mock user profile
  const userProfile = { 
    pilot_id: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Pilot',
    profile_image_url: null
  };

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
    <div className="min-h-screen relative">
      {/* Navigation Bar */}
      <header className="bg-white border-b border-slate-200 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto pr-6 py-4 w-full max-w-[1800px]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {/* Back Button */}
                <button
                  onClick={onBack}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 hover:scale-105 transition-transform"
                  title="Back to Pathways"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                {/* PilotRecognition.com Logo */}
                <div className="flex flex-col">
                  <span style={{ fontFamily: 'Georgia, serif' }} className="text-black text-2xl font-normal">
                    Discover <span className="text-red-600">Pathways</span>
                  </span>
                  <span className="text-xs text-slate-600 font-normal">
                    pilotrecognition.com
                  </span>
                </div>
              </div>
            </div>

            {/* Centered Navigation Buttons */}
            <div className="flex items-center justify-center flex-1 gap-3">
              {[
                { label: 'Airline Expectations', page: 'portal-airline-expectations' },
                { label: 'Aircraft Type-Ratings', page: 'type-rating-search' },
                { label: 'Pilot Pathways', page: 'pathways-modern' },
                { label: 'Job Listings', page: 'job-listings' },
              ].map(({ label, page }) => {
                const isActive = page === 'pathways-modern';
                return (
                  <button
                    key={page}
                    onClick={() => onNavigate && onNavigate(page)}
                    className={`text-[0.6rem] font-bold uppercase tracking-[0.1em] transition-all hover:text-blue-400 flex items-center gap-1 whitespace-nowrap ${
                      isActive
                        ? 'text-blue-600 border-b-2 border-blue-600 pb-1 font-black'
                        : 'text-slate-900'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Right side items */}
            <div className="flex items-center gap-3">
              {/* Profile section */}
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-slate-900">
                      {userProfile?.pilot_id || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Pilot'}
                    </span>
                    <span className="text-[10px] text-slate-500">Signed In</span>
                  </div>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
                  >
                    {userProfile?.profile_image_url ? (
                      <img
                        src={userProfile.profile_image_url}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </button>
                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-16 top-16 bg-white border border-slate-200 rounded-lg shadow-lg py-2 w-48 z-50">
                      <button className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Notifications
                      </button>
                      <hr className="my-2" />
                      <button className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-2 text-red-600">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-6 py-2 rounded-lg transition-colors">
                  Become a Member
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Top section with shader */}
      <div className="relative z-10 bg-gradient-to-b from-transparent to-slate-900">
        <div className="p-8 pt-20">
          {/* Main Header - in shader section */}
          <div className="max-w-4xl mx-auto mb-8">
            <h1 className="text-6xl font-serif mb-4 text-center">
              <span className="text-black">Pathways</span> <span className="text-red-400">Military Training</span>
            </h1>
            <p className="text-slate-300 mb-2 text-center text-lg">Discover and compare military aviation pathways to achieve your aviation goals</p>
            <p className="text-slate-400 mb-8 text-center">Pathway ID: {pathwayId}</p>

            {/* Search Bar */}
            <div className="mb-8 space-y-4 text-center">
              <div className="flex justify-center">
                <div className="relative w-[600px]">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search military pathways..."
                    className="w-full pl-4 pr-12 py-4 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 placeholder-slate-500"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Branch Filter */}
              <div className="flex items-center justify-center gap-2 mt-6">
                <Shield className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-600 mr-2">Branch:</span>
                {(['All', 'Air Force', 'Navy', 'Army', 'Marine Corps', 'RAF', 'Coast Guard', 'Police', 'Defense Contractor'] as MilitaryBranch[]).map((branch) => (
                  <button
                    key={branch}
                    onClick={() => setBranchFilter(branch)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all border-2 ${
                      branchFilter === branch
                        ? 'bg-sky-500 text-white border-sky-500 shadow-md'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {branch === 'All' ? 'All Branches' : branch}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Military Pathways Carousel - in shader section */}
          <div className="px-8 pb-12">
            <div className="w-screen left-1/2 -translate-x-1/2 relative">
              <div className="mb-4 pr-4 pl-8 w-full">
                <div className="text-left">
                  <h2
                    className="text-3xl md:text-4xl font-normal text-white"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  >
                    Military Programs
                  </h2>
                  <p className="text-slate-400 text-xs mt-1">
                    Discover military aviation pathways for your career
                  </p>
                </div>
              </div>

              {/* Carousel Container */}
              <div className="relative w-screen left-1/2 -translate-x-1/2">
                <style>{`
                  .military-pathways-carousel::-webkit-scrollbar { display: none; }
                  .military-pathways-carousel { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
                <div
                  ref={militaryCarouselRef}
                  className="military-pathways-carousel flex gap-4 overflow-x-auto overflow-y-hidden pb-4"
                  style={{
                    WebkitOverflowScrolling: 'touch',
                    cursor: 'grab',
                    paddingLeft: '0px',
                    paddingRight: 'calc(50vw - 300px)',
                  }}
                >
                  {searchFilteredPathways.map((pathway) => (
                    <div
                      key={pathway.id}
                      data-card-id={pathway.id}
                      onClick={(e) => {
                        setSelectedMilitaryPathway(pathway);

                        // Scroll card to center
                        const cardElement = e.currentTarget as HTMLElement;
                        const carousel = cardElement.parentElement;
                        if (carousel && cardElement) {
                          const cardCenterInContainer = cardElement.offsetLeft + cardElement.offsetWidth / 2;
                          const targetScrollLeft = cardCenterInContainer - carousel.offsetWidth / 2;

                          carousel.scrollTo({
                            left: targetScrollLeft,
                            behavior: 'smooth'
                          });
                        }
                      }}
                      className={`flex-shrink-0 w-[600px] rounded-xl overflow-hidden cursor-pointer transition-all ${
                        selectedMilitaryPathway?.id === pathway.id
                          ? 'ring-2 ring-blue-500'
                          : 'hover:ring-2 hover:ring-blue-400'
                      }`}
                    >
                      {pathway.id === 'military-intro' ? (
                        // Military Intro Card - Glassy UI without image
                        <div className="h-80 bg-white/10 backdrop-blur-xl border border-white/20 flex flex-col items-center justify-center p-8">
                          <h3 className="text-2xl font-semibold mb-4 text-white text-center">{pathway.name}</h3>
                          <p className="text-slate-300 mb-6 text-center text-lg">{pathway.description}</p>
                          <div className="flex items-center gap-4 text-slate-400 text-sm">
                            <span className="flex items-center gap-2">
                              <ChevronLeft className="w-5 h-5" />
                              Swipe left
                            </span>
                            <span>or</span>
                            <span className="flex items-center gap-2">
                              Swipe right
                              <ChevronRight className="w-5 h-5" />
                            </span>
                            <span>to select a pathway</span>
                          </div>
                        </div>
                      ) : (
                        // Regular Military Pathway Card
                        <div className="relative h-80">
                          <img
                            src={pathway.image}
                            alt={pathway.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                          <div className="absolute bottom-0 left-0 p-6">
                            <h3 className="text-xl font-semibold mb-2 text-white">{pathway.name}</h3>
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-300" />
                                <span className="text-slate-300">{pathway.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-white">{pathway.rating}</span>
                              </div>
                            </div>
                            <p className="text-slate-300 text-sm mt-2 line-clamp-2">{pathway.description}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* White background section */}
      <div className="relative z-10 bg-white text-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header Context with Navigation Buttons */}
          <div className="flex items-center justify-between mb-8">
            {/* Left Arrow */}
            <button
              onClick={() => scrollMilitaryCarousel('left')}
              className="bg-slate-100 hover:bg-slate-200 rounded-full p-3 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>

            {/* Centered Header */}
            <div className="flex-1 text-center px-4">
              <h1 className="text-6xl font-serif mb-4">
                <span className="text-black">{selectedMilitaryPathway?.name || 'Military Programs'}</span>
              </h1>
              <p className="text-slate-600 mb-2 text-lg">{selectedMilitaryPathway?.description || 'Discover and compare military aviation pathways to achieve your aviation goals'}</p>
              <p className="text-slate-500 mb-8">Pathway ID: {pathwayId}</p>
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scrollMilitaryCarousel('right')}
              className="bg-slate-100 hover:bg-slate-200 rounded-full p-3 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-slate-600" />
            </button>
          </div>

          {/* Selected Pathway Details */}
          <AnimatePresence>
            {selectedMilitaryPathway && selectedMilitaryPathway.id !== 'military-intro' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-slate-100 rounded-xl p-8 mb-6"
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
                    <h2 className="text-2xl font-bold mb-2 text-slate-900">
                      {selectedMilitaryPathway.name}
                    </h2>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-slate-900">
                          {selectedMilitaryPathway.rating}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-5 h-5 text-slate-500" />
                        <span className="text-slate-600">
                          {selectedMilitaryPathway.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-5 h-5 text-slate-500" />
                        <span className="text-slate-600">
                          {selectedMilitaryPathway.serviceCommitment}
                        </span>
                      </div>
                    </div>
                    <p className="mb-4 text-slate-600">
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
                        className="px-6 py-3 rounded-lg font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Apply Now
                      </button>
                      <button
                        className="px-6 py-3 rounded-lg font-medium transition-all bg-slate-200 hover:bg-slate-300 text-slate-700"
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
    </div>
  );
};

export default MilitaryPathwaysPage;
