import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, MapPin, Star, Shield, Users, Clock, Award, Plane, X, ArrowLeft, User, Settings, Bell, LogOut, Globe, DollarSign } from 'lucide-react';
import { useAuth } from '../../src/contexts/AuthContext';

interface SpecialPathwaysPageProps {
  pathwayId: string;
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

const SpecialPathwaysPage: React.FC<SpecialPathwaysPageProps> = ({ pathwayId, onBack, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialPathway, setSelectedSpecialPathway] = useState<any>(null);
  const specialCarouselRef = useRef<HTMLDivElement>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { currentUser } = useAuth();
  
  // Mock user profile
  const userProfile = { 
    pilot_id: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Pilot',
    profile_image_url: null
  };

  // Special Pathways Data
  const specialPathways = [
    {
      id: 'special-1',
      name: 'Sport Pilot Transition',
      description: 'Transition from Sport Pilot to Private Pilot license with additional training. Build on your sport pilot experience to gain more privileges and capabilities.',
      location: 'USA',
      rating: 4.8,
      duration: '20-30 hours',
      cost: '$3,000 - $5,000',
      image: 'https://robbreport.com/wp-content/uploads/2018/08/magnusfusion3.jpg?w=1000',
      branch: 'Transition'
    },
    {
      id: 'special-2',
      name: 'Recreational Flight',
      description: 'Flexible online ground school courses completed at your own pace. Study theory, regulations, and procedures from anywhere with 24/7 access.',
      location: 'Global',
      rating: 4.6,
      duration: 'Self-paced',
      cost: '$500 - $1,500',
      image: 'https://cdn.prod.website-files.com/65407649ec08542fb947ad21/65ebe0a864d82a05893f0cc4_SFC-self-paced-courses-24.jpg',
      branch: 'Training'
    },
    {
      id: 'special-3',
      name: 'Glass Cockpit Training',
      description: 'Master modern avionics with hands-on Garmin G1000 training. Learn to operate glass cockpit systems, electronic flight displays, and advanced navigation technology.',
      location: 'USA',
      rating: 4.9,
      duration: '10-15 hours',
      cost: '$2,000 - $3,500',
      image: 'https://media.pea.com/wp-content/uploads/2023/06/altfull-view-of-G1000-Avionics-of-Cessna-172-1024x607.jpeg',
      branch: 'Training'
    },
    {
      id: 'special-4',
      name: 'Aviation Career Path',
      description: 'Explore various aviation career paths from commercial aviation to military service. Understand requirements, training paths, and opportunities in different sectors.',
      location: 'Global',
      rating: 4.7,
      duration: 'Varies',
      cost: 'N/A',
      image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
      branch: 'Career'
    },
      ];

  // Filter by search query
  const searchFilteredPathways = specialPathways.filter(pathway => {
    const query = searchQuery.toLowerCase();
    return (
      pathway.name.toLowerCase().includes(query) ||
      pathway.description.toLowerCase().includes(query) ||
      pathway.location.toLowerCase().includes(query)
    );
  });

  // Set initial selected pathway
  useEffect(() => {
    if (searchFilteredPathways.length > 0 && !selectedSpecialPathway) {
      setSelectedSpecialPathway(searchFilteredPathways[0]);
    }
  }, [selectedSpecialPathway, searchFilteredPathways]);

  const scrollSpecialCarousel = (dir: 'left' | 'right') => {
    const container = specialCarouselRef.current;
    if (!container || searchFilteredPathways.length === 0) return;

    const currentIndex = searchFilteredPathways.findIndex(p => p.id === selectedSpecialPathway?.id);
    if (currentIndex === -1) return;

    let newIndex = dir === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0) newIndex = searchFilteredPathways.length - 1;
    if (newIndex >= searchFilteredPathways.length) newIndex = 0;

    setSelectedSpecialPathway(searchFilteredPathways[newIndex]);

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
                    <User className="w-5 h-5" />
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
              <span className="text-black">Pathways</span> <span className="text-red-400">Specialized</span>
            </h1>
            <p className="text-slate-300 mb-2 text-center text-lg">Discover special aviation pathways and transitions</p>
            <p className="text-slate-400 mb-8 text-center">Pathway ID: {pathwayId}</p>

            {/* Search Bar */}
            <div className="mb-8 space-y-4 text-center">
              <div className="flex justify-center">
                <div className="relative w-[600px]">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search special pathways..."
                    className="w-full pl-4 pr-12 py-4 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 placeholder-slate-500"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Special Pathways Carousel - in shader section */}
          <div className="px-8 pb-12">
            <div className="w-screen left-1/2 -translate-x-1/2 relative">
              <div className="mb-4 pr-4 pl-8 w-full">
                <div className="text-left">
                  <h2
                    className="text-3xl md:text-4xl font-normal text-white"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  >
                    Special Programs
                  </h2>
                  <p className="text-slate-400 text-xs mt-1">
                    Discover special aviation pathways and transitions
                  </p>
                </div>
              </div>

              {/* Carousel Container */}
              <div className="relative w-screen left-1/2 -translate-x-1/2">
                <style>{`
                  .special-pathways-carousel::-webkit-scrollbar { display: none; }
                  .special-pathways-carousel { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
                <div
                  ref={specialCarouselRef}
                  className="special-pathways-carousel flex gap-4 overflow-x-auto overflow-y-hidden pb-4"
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
                        setSelectedSpecialPathway(pathway);

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
                        selectedSpecialPathway?.id === pathway.id
                          ? 'ring-2 ring-blue-500'
                          : 'hover:ring-2 hover:ring-blue-400'
                      }`}
                    >
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
              onClick={() => scrollSpecialCarousel('left')}
              className="bg-slate-100 hover:bg-slate-200 rounded-full p-3 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>

            {/* Centered Header */}
            <div className="flex-1 text-center px-4">
              <h1 className="text-6xl font-serif mb-4">
                <span className="text-black">{selectedSpecialPathway?.name || 'Special Programs'}</span>
              </h1>
              <p className="text-slate-600 mb-2 text-lg">{selectedSpecialPathway?.description || 'Discover special aviation pathways and transitions'}</p>
              <p className="text-slate-500 mb-8">Pathway ID: {pathwayId}</p>
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scrollSpecialCarousel('right')}
              className="bg-slate-100 hover:bg-slate-200 rounded-full p-3 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-slate-600" />
            </button>
          </div>

          {/* Selected Pathway Details */}
          <AnimatePresence>
            {selectedSpecialPathway && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-slate-100 rounded-xl p-8 mb-6"
              >
                <div className="flex items-start gap-6">
                  {selectedSpecialPathway.image && (
                    <div className="flex-shrink-0">
                      <img
                        src={selectedSpecialPathway.image}
                        alt={selectedSpecialPathway.name}
                        className="w-48 h-48 object-cover rounded-xl"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2 text-slate-900">
                      {selectedSpecialPathway.name}
                    </h2>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-slate-900">
                          {selectedSpecialPathway.rating}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-5 h-5 text-slate-500" />
                        <span className="text-slate-600">
                          {selectedSpecialPathway.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-5 h-5 text-slate-500" />
                        <span className="text-slate-600">
                          {selectedSpecialPathway.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-5 h-5 text-slate-500" />
                        <span className="text-slate-600">
                          {selectedSpecialPathway.cost}
                        </span>
                      </div>
                    </div>
                    <p className="mb-4 text-slate-600">
                      {selectedSpecialPathway.description}
                    </p>
                    <div className="mb-4">
                      <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {selectedSpecialPathway.branch}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        className="px-6 py-3 rounded-lg font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Learn More
                      </button>
                      <button
                        className="px-6 py-3 rounded-lg font-medium transition-all bg-slate-200 hover:bg-slate-300 text-slate-700"
                      >
                        Contact Us
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

export default SpecialPathwaysPage;
