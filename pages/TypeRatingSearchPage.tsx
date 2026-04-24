import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Plane, CheckCircle2, Star, LayoutGrid, DollarSign, Calendar, FileText, Gauge, Building2, BookOpen, MousePointerClick, Filter, MapPin, GraduationCap, Briefcase, TrendingUp, Users, Award, Globe, Clock, Shield, Zap, Heart } from 'lucide-react';
import { manufacturers, aircraftTypeRatings, Manufacturer, AircraftTypeRating, getManufacturerById, getAircraftByManufacturer, getAircraftByCategory } from '../data/aircraft-manufacturers';

export default function TypeRatingSearchPageNew() {
  // State for manufacturer carousel
  const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'commercial' | 'private' | 'cargo' | 'regional' | 'helicopter' | 'military'>('all');
  const [selectedAircraft, setSelectedAircraft] = useState<AircraftTypeRating | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'training' | 'specifications' | 'career'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  const manufacturerCarouselRef = useRef<HTMLDivElement>(null);
  const aircraftCarouselRef = useRef<HTMLDivElement>(null);
  
  // Filter aircraft based on selected manufacturer and category
  const filteredAircraft = React.useMemo(() => {
    let aircraft = aircraftTypeRatings;
    
    if (selectedManufacturer) {
      aircraft = getAircraftByManufacturer(selectedManufacturer.id);
    }
    
    if (selectedCategory !== 'all') {
      aircraft = getAircraftByCategory(selectedCategory);
    }
    
    if (searchQuery) {
      aircraft = aircraft.filter(a => 
        a.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.manufacturerId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return aircraft;
  }, [selectedManufacturer, selectedCategory, searchQuery]);
  
  // Scroll manufacturer carousel
  const scrollManufacturers = (direction: 'left' | 'right') => {
    if (manufacturerCarouselRef.current) {
      const scrollAmount = 300;
      manufacturerCarouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  // Scroll aircraft carousel
  const scrollAircraft = (direction: 'left' | 'right') => {
    if (aircraftCarouselRef.current) {
      const scrollAmount = 300;
      aircraftCarouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Type Rating Search</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">Discover and compare aircraft type ratings</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search aircraft..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(['all', 'commercial', 'private', 'cargo', 'regional', 'helicopter', 'military'] as const).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Manufacturer Carousel */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Manufacturers</h2>
            <div className="flex gap-2">
              <button
                onClick={() => scrollManufacturers('left')}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
              <button
                onClick={() => scrollManufacturers('right')}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
            </div>
          </div>
          <div
            ref={manufacturerCarouselRef}
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
          >
            {manufacturers.map((manufacturer) => (
              <button
                key={manufacturer.id}
                onClick={() => setSelectedManufacturer(selectedManufacturer?.id === manufacturer.id ? null : manufacturer)}
                className={`flex-shrink-0 p-4 rounded-xl border-2 transition-all ${
                  selectedManufacturer?.id === manufacturer.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-slate-700'
                }`}
              >
                <img
                  src={manufacturer.logo}
                  alt={manufacturer.name}
                  className="w-16 h-16 object-contain mb-2"
                />
                <div className="text-center">
                  <p className="font-medium text-slate-900 dark:text-white text-sm">{manufacturer.name}</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-slate-600 dark:text-slate-400">{manufacturer.reputationScore}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Aircraft Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {selectedManufacturer ? `${selectedManufacturer.name} Aircraft` : 'All Aircraft'}
            <span className="text-slate-500 dark:text-slate-400 font-normal ml-2">({filteredAircraft.length})</span>
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scrollAircraft('left')}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
            <button
              onClick={() => scrollAircraft('right')}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>
        
        {filteredAircraft.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <Plane className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">No aircraft found matching your criteria</p>
          </div>
        ) : (
          <div
            ref={aircraftCarouselRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredAircraft.map((aircraft) => (
              <button
                key={aircraft.id}
                onClick={() => setSelectedAircraft(aircraft)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedAircraft?.id === aircraft.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-slate-800'
                }`}
              >
                <img
                  src={aircraft.image}
                  alt={aircraft.model}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{aircraft.model}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">{aircraft.description}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Calendar className="w-3 h-3" />
                  <span>First Flight: {aircraft.firstFlight}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Aircraft Detail Panel */}
      {selectedAircraft && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedAircraft.model}</h2>
              <button
                onClick={() => setSelectedAircraft(null)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <CheckCircle2 className="w-6 h-6 text-slate-600 dark:text-slate-300" />
              </button>
            </div>
            
            {/* Detail Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-700">
              <div className="flex gap-4 px-4">
                {(['overview', 'training', 'specifications', 'career'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveDetailTab(tab)}
                    className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                      activeDetailTab === tab
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Detail Content */}
            <div className="p-6">
              {activeDetailTab === 'overview' && (
                <div>
                  <img
                    src={selectedAircraft.image}
                    alt={selectedAircraft.model}
                    className="w-full h-64 object-cover rounded-xl mb-6"
                  />
                  <p className="text-slate-700 dark:text-slate-300 mb-4">{selectedAircraft.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">First Flight</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{selectedAircraft.firstFlight}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                      <Plane className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">Category</p>
                      <p className="font-semibold text-slate-900 dark:text-white capitalize">{selectedAircraft.category}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeDetailTab === 'training' && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Training Requirements</h3>
                  <div className="space-y-4">
                    <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                      <Gauge className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">Minimum Flight Hours</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{selectedAircraft.trainingRequirements.minimumHours} hours</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                      <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">Ground School</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{selectedAircraft.trainingRequirements.groundSchoolHours} hours</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                      <Plane className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">Simulator Training</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{selectedAircraft.trainingRequirements.simulatorHours} hours</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeDetailTab === 'specifications' && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Technical Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedAircraft.specifications).map(([key, value]) => (
                      <div key={key} className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeDetailTab === 'career' && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Career Information</h3>
                  <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg mb-4">
                    <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">Job Market</p>
                    <p className="font-semibold text-slate-900 dark:text-white">High demand across major airlines</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg mb-4">
                    <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">Average Salary</p>
                    <p className="font-semibold text-slate-900 dark:text-white">$80,000 - $150,000 USD</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">Growth Prospects</p>
                    <p className="font-semibold text-slate-900 dark:text-white">Excellent - projected 5% annual growth</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
