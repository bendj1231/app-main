import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, MapPin, Star, DollarSign, GraduationCap, Award, Plane, Users, Clock, CheckCircle2, X, ArrowLeft, User, Settings, Bell, LogOut, Globe } from 'lucide-react';
import { usePathwaysIntelligence } from '../hooks/usePathwaysIntelligence';
import { DUMMY_FLIGHT_SCHOOLS, Region } from '../../data/flight-schools';
import { useAuth } from '../../src/contexts/AuthContext';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gkbhgrozrzhalnjherfu.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdraGJncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNDA1NDksImV4cCI6MjA2MDYxNjU0OX0.MjUa3LdM8Y7F8X9jYqK3Z7q0W5X1nY2qK3Z7q0W5X1nY'
);

interface PathwayDetailPageProps {
  pathwayId: string;
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

interface SubPathway {
  id: string;
  pathway_id: string;
  name: string;
  description: string;
  requirements: any;
  estimated_duration: string | null;
  estimated_cost: string | null;
  display_order: number;
  is_active: boolean;
}

interface Pathway {
  id: string;
  general_category_id: string;
  name: string;
  description: string;
  display_order: number;
}

// Search Bar component
const SearchBar: React.FC<{ onSearch: (query: string) => void; isDarkMode?: boolean }> = ({ onSearch, isDarkMode = true }) => (
  <div className="relative w-[600px] flex items-center gap-3">
    <div className="relative flex-1">
      <Search className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
      <input
        type="text"
        placeholder="Search pathways, airlines, or locations..."
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

const PathwayDetailPage: React.FC<PathwayDetailPageProps> = ({ pathwayId, onBack, onNavigate }) => {
  const [subPathway, setSubPathway] = useState<SubPathway | null>(null);
  const [pathway, setPathway] = useState<Pathway | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCarouselPathway, setSelectedCarouselPathway] = useState<SubPathway | null>(null);
  const [allSubPathways, setAllSubPathways] = useState<SubPathway[]>([]);
  const [selectedFlightSchool, setSelectedFlightSchool] = useState<any>(null);
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const flightSchoolCarouselRef = React.useRef<HTMLDivElement>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [regionFilter, setRegionFilter] = useState<Region>('All');
  const { currentUser, userProfile } = useAuth();

  // Filter flight schools by region
  const filteredFlightSchools = DUMMY_FLIGHT_SCHOOLS.filter(school => {
    if (school.id === 'wingmentor-intro') return true; // Always show intro card
    if (regionFilter === 'All') return true;
    return school.region === regionFilter;
  });

  useEffect(() => {
    async function fetchPathwayDetails() {
      try {
        // Fetch sub-pathway details
        const { data: subPathwayData, error: subPathwayError } = await supabase
          .from('career_hierarchy_sub_pathways')
          .select('*')
          .eq('id', pathwayId)
          .single();

        if (subPathwayError) throw subPathwayError;
        setSubPathway(subPathwayData);

        // Fetch parent pathway details
        if (subPathwayData?.pathway_id) {
          const { data: pathwayData, error: pathwayError } = await supabase
            .from('career_hierarchy_pathways')
            .select('*')
            .eq('id', subPathwayData.pathway_id)
            .single();

          if (pathwayError) throw pathwayError;
          setPathway(pathwayData);

          // Fetch all sub-pathways for the carousel
          const { data: allSubPathwaysData, error: allSubPathwaysError } = await supabase
            .from('career_hierarchy_sub_pathways')
            .select('*')
            .eq('pathway_id', subPathwayData.pathway_id)
            .order('display_order');

          if (allSubPathwaysError) throw allSubPathwaysError;
          setAllSubPathways(allSubPathwaysData || []);
          setSelectedCarouselPathway(subPathwayData);
        }
      } catch (error) {
        console.error('Error fetching pathway details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPathwayDetails();
  }, [pathwayId]);

  // Carousel scroll function
  const scrollCarousel = (dir: 'left' | 'right') => {
    const container = carouselRef.current;
    if (!container || allSubPathways.length === 0) return;

    const currentIndex = allSubPathways.findIndex(p => p.id === selectedCarouselPathway?.id);
    if (currentIndex === -1) return;

    let newIndex = dir === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0) newIndex = allSubPathways.length - 1;
    if (newIndex >= allSubPathways.length) newIndex = 0;

    setSelectedCarouselPathway(allSubPathways[newIndex]);
  };

  // Flight school carousel scroll function
  const scrollFlightSchoolCarousel = (dir: 'left' | 'right') => {
    const container = flightSchoolCarouselRef.current;
    if (!container || DUMMY_FLIGHT_SCHOOLS.length === 0) return;

    const currentIndex = DUMMY_FLIGHT_SCHOOLS.findIndex(s => s.id === selectedFlightSchool?.id);
    if (currentIndex === -1) return;

    let newIndex = dir === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0) newIndex = DUMMY_FLIGHT_SCHOOLS.length - 1;
    if (newIndex >= DUMMY_FLIGHT_SCHOOLS.length) newIndex = 0;

    setSelectedFlightSchool(DUMMY_FLIGHT_SCHOOLS[newIndex]);

    // Scroll to the card in carousel
    setTimeout(() => {
      const cardElements = container.querySelectorAll('[data-card-id]');
      const targetCard = Array.from(cardElements).find(el => el.getAttribute('data-card-id') === DUMMY_FLIGHT_SCHOOLS[newIndex].id);
      if (targetCard) {
        const cardCenter = (targetCard as HTMLElement).offsetLeft + (targetCard as HTMLElement).offsetWidth / 2;
        const targetScrollLeft = cardCenter - container.offsetWidth / 2;
        container.scrollTo({
          left: targetScrollLeft,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Set initial selected flight school
  useEffect(() => {
    if (DUMMY_FLIGHT_SCHOOLS.length > 0 && !selectedFlightSchool) {
      setSelectedFlightSchool(DUMMY_FLIGHT_SCHOOLS[0]);
    }
  }, [selectedFlightSchool]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <p>Loading pathway details...</p>
        </div>
      </div>
    );
  }

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
              <span className="text-black">Pathways</span> <span className="text-red-400">Flight Schools</span>
            </h1>
            <p className="text-slate-300 mb-2 text-center text-lg">Discover and compare flight school pathways to achieve your aviation goals</p>
            <p className="text-slate-400 mb-8 text-center">Pathway ID: {pathwayId}</p>

            {/* Search Bar */}
            <div className="mb-8 space-y-4 text-center">
              <div className="flex justify-center">
                <div className="relative w-[600px]">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search flight schools..."
                    className="w-full pl-4 pr-12 py-4 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 placeholder-slate-500"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Geographical Location Categories */}
              <div className="flex items-center justify-center gap-2 mt-6">
                <Globe className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-600 mr-2">Region:</span>
                {(['All', 'Asia', 'Europe', 'Americas', 'Oceania', 'Africa', 'Middle East'] as Region[]).map((region) => (
                  <button
                    key={region}
                    onClick={() => setRegionFilter(region)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all border-2 ${
                      regionFilter === region
                        ? 'bg-sky-500 text-white border-sky-500 shadow-md'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Flight School Carousel - in shader section */}
        {!subPathway && (
          <div className="px-8 pb-12">
            <div className="w-screen left-1/2 -translate-x-1/2 relative">
              <div className="mb-4 pr-4 pl-8 w-full">
                <div className="text-left">
                  <h2
                    className="text-3xl md:text-4xl font-normal text-white"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  >
                    Flight Schools
                  </h2>
                  <p className="text-slate-400 text-xs mt-1">
                    Discover flight schools for your aviation journey
                  </p>
                </div>
              </div>

              {/* Carousel Container */}
              <div className="relative w-screen left-1/2 -translate-x-1/2">
                <style>{`
                  .flight-school-carousel::-webkit-scrollbar { display: none; }
                  .flight-school-carousel { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
                <div
                  ref={flightSchoolCarouselRef}
                  className="flight-school-carousel flex gap-4 overflow-x-auto overflow-y-hidden pb-4"
                  style={{
                    WebkitOverflowScrolling: 'touch',
                    cursor: 'grab',
                    paddingLeft: '0px',
                    paddingRight: 'calc(50vw - 300px)',
                  }}
                >
                  {filteredFlightSchools.map((school) => (
                    <div
                      key={school.id}
                      data-card-id={school.id}
                      onClick={(e) => {
                        setSelectedFlightSchool(school);

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
                        selectedFlightSchool?.id === school.id
                          ? 'ring-2 ring-blue-500'
                          : 'hover:ring-2 hover:ring-blue-400'
                      }`}
                    >
                      {school.id === 'wingmentor-intro' ? (
                        // WingMentor Intro Card - Glassy UI without image
                        <div className="h-80 bg-white/10 backdrop-blur-xl border border-white/20 flex flex-col items-center justify-center p-8">
                          <h3 className="text-2xl font-semibold mb-4 text-white text-center">{school.name}</h3>
                          <p className="text-slate-300 mb-6 text-center text-lg">{school.description}</p>
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
                        // Regular Flight School Card
                        <div className="relative h-80">
                          <img
                            src={school.image}
                            alt={school.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                          <div className="absolute bottom-0 left-0 p-6">
                            <h3 className="text-xl font-semibold mb-2 text-white">{school.name}</h3>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-white/80">📍 {school.location}</span>
                              <span className="text-yellow-400">⭐ {school.rating}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* White background section */}
      <div className="relative z-10 bg-white text-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header Context with Navigation Buttons */}
          <div className="flex items-center justify-between mb-8">
            {/* Left Arrow */}
            <button
              onClick={() => scrollFlightSchoolCarousel('left')}
              className="bg-slate-100 hover:bg-slate-200 rounded-full p-3 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>

            {/* Centered Header */}
            <div className="flex-1 text-center px-4">
              <h1 className="text-6xl font-serif mb-4">
                <span className="text-black">{selectedFlightSchool?.name || 'Pathways'}</span>
              </h1>
              <p className="text-slate-600 mb-2 text-lg">{selectedFlightSchool?.description || 'Discover and compare flight school pathways to achieve your aviation goals'}</p>
              <p className="text-slate-500 mb-8">Pathway ID: {pathwayId}</p>
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scrollFlightSchoolCarousel('right')}
              className="bg-slate-100 hover:bg-slate-200 rounded-full p-3 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-slate-600" />
            </button>
          </div>

          {/* Carousel Section - Related Pathways */}
          {allSubPathways.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-serif mb-4">Related Pathways</h2>
              <div className="relative">
                <style>{`
                  .pathway-detail-carousel::-webkit-scrollbar { display: none; }
                  .pathway-detail-carousel { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
                <div
                  ref={carouselRef}
                  className="pathway-detail-carousel flex gap-4 overflow-x-auto overflow-y-hidden pb-4"
                  style={{
                    WebkitOverflowScrolling: 'touch',
                    cursor: 'grab',
                  }}
                >
                  {allSubPathways.map((subPath) => (
                    <div
                      key={subPath.id}
                      onClick={() => setSelectedCarouselPathway(subPath)}
                      className={`flex-shrink-0 w-80 bg-slate-100 rounded-xl p-6 cursor-pointer transition-all ${
                        selectedCarouselPathway?.id === subPath.id
                          ? 'ring-2 ring-blue-500 bg-slate-200'
                          : 'hover:bg-slate-200'
                      }`}
                    >
                      <h3 className="text-lg font-semibold mb-2">{subPath.name}</h3>
                      <p className="text-slate-600 text-sm">{subPath.description}</p>
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons */}
                {allSubPathways.length > 1 && (
                  <>
                    <button
                      onClick={() => scrollCarousel('left')}
                      className="absolute left-0 top-1/2 -translate-y-1/2 bg-slate-200 hover:bg-slate-300 rounded-full p-2 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => scrollCarousel('right')}
                      className="absolute right-0 top-1/2 -translate-y-1/2 bg-slate-200 hover:bg-slate-300 rounded-full p-2 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {subPathway && (
            <div className="bg-slate-100 rounded-xl p-8 mb-6">
              <h2 className="text-2xl mb-4">{subPathway.name}</h2>
              <p className="text-slate-600 mb-4">{subPathway.description}</p>

              {pathway && (
                <div className="mt-6 pt-6 border-t border-slate-300">
                  <p className="text-sm text-slate-500 mb-2">Parent Pathway:</p>
                  <p className="text-lg font-semibold">{pathway.name}</p>
                  <p className="text-slate-500">{pathway.description}</p>
                </div>
              )}

              {subPathway.estimated_duration && (
                <div className="mt-4">
                  <p className="text-sm text-slate-500">Estimated Duration:</p>
                  <p className="text-slate-700">{subPathway.estimated_duration}</p>
                </div>
              )}

              {subPathway.estimated_cost && (
                <div className="mt-4">
                  <p className="text-sm text-slate-500">Estimated Cost:</p>
                  <p className="text-slate-700">{subPathway.estimated_cost}</p>
                </div>
              )}
            </div>
          )}

          {!subPathway && selectedFlightSchool && (
            <div className="mt-8">
              {/* Selected Flight School Details - Hero Section */}
              <div className="max-w-7xl mx-auto px-6 mb-12 relative">
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  {/* Hero Image */}
                  <div className="relative h-64 md:h-80">
                    <img
                      src={selectedFlightSchool.image}
                      alt={selectedFlightSchool.name}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 md:p-8">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">✈️</span>
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-sky-400 bg-sky-500/20 px-3 py-1 rounded-full border border-sky-400/30">
                          Selected Flight School
                        </span>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-serif text-white mb-2">{selectedFlightSchool.name}</h2>
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1.5 text-white/80 text-sm">📍{selectedFlightSchool.location}</span>
                        <span className="flex items-center gap-1.5 text-yellow-400 text-sm font-medium">⭐ {selectedFlightSchool.rating}</span>
                        <span className="flex items-center gap-1.5 text-emerald-300 text-sm font-medium">{selectedFlightSchool.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tab Navigation */}
                  <div className="border-b border-slate-200 px-6 md:px-8 bg-white">
                    <div className="flex gap-1 overflow-x-auto">
                      {['Overview', 'Programs', 'Requirements', 'Fleet', 'Admissions', 'Career', 'Contact'].map((tab) => (
                        <button
                          key={tab}
                          className="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-sky-500 text-sky-600 transition-colors"
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="px-6 md:px-8 py-8 bg-white">
                    <h3 className="text-2xl font-semibold mb-4">Overview</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">{selectedFlightSchool.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PathwayDetailPage;
