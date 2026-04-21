import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, MapPin, Clock, DollarSign, Plane, Users, Brain, Shield, Cpu, Search, Target, Briefcase, Zap, CheckCircle2, Star, Globe } from 'lucide-react';
import { useAuth } from '../../src/contexts/AuthContext';

interface Airline {
  id: string;
  name: string;
  location: string;
  salaryRange: string;
  flightHours: string;
  tags: string[];
  image: string;
  description: string;
  fleet?: string;
  flag?: string;
}

const AIRLINES: Airline[] = [
  {
    id: 'qatar',
    name: 'Qatar Airways',
    location: 'Doha, Qatar',
    salaryRange: '$120,000 – $250,000/yr',
    flightHours: '4,000+ hrs TT',
    tags: ['5-Star Airline', 'Tax-Free', 'Worldwide Routes'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/qatar-airways.jpg',
    description: 'Qatar Airways is renowned for its exceptional service standards and global network spanning over 160 destinations. Competitive tax-free packages, modern fleet, and rapid career progression.',
    fleet: 'Boeing 777, 787, Airbus A350, A380',
    flag: '🇶🇦',
  },
  {
    id: 'singapore',
    name: 'Singapore Airlines',
    location: 'Singapore',
    salaryRange: '$120,000 – $180,000/yr',
    flightHours: '3,000+ hrs TT',
    tags: ['Premium Carrier', 'Asian Hub', 'Great Benefits'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/singapore-airlines.jpg',
    description: 'Singapore Airlines maintains one of the highest service standards globally, offering comprehensive benefits and a strategic Asian hub location.',
    fleet: 'Airbus A350, A380, Boeing 777, 787',
    flag: '🇸🇬',
  },
  {
    id: 'cathay',
    name: 'Cathay Pacific',
    location: 'Hong Kong',
    salaryRange: '$110,000 – $160,000/yr',
    flightHours: '2,500+ hrs TT',
    tags: ['5-Star Airline', 'Asian Network', 'Career Growth'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/cathay-pacific.jpg',
    description: 'Cathay Pacific offers a dynamic work environment with extensive Asian network coverage and strong career progression pathways.',
    fleet: 'Airbus A350, A330, Boeing 777',
    flag: '🇭🇰',
  },
  {
    id: 'emirates',
    name: 'Emirates',
    location: 'Dubai, UAE',
    salaryRange: '$130,000 – $280,000/yr',
    flightHours: '4,000+ hrs TT',
    tags: ['5-Star Airline', 'Global Network', 'Tax-Free'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/emirates.png',
    description: 'Emirates operates one of the largest A380 and B777 fleets, offering unmatched global connectivity and exceptional training facilities.',
    fleet: 'Airbus A380, Boeing 777',
    flag: '🇦🇪',
  },
  {
    id: 'etihad',
    name: 'Etihad Airways',
    location: 'Abu Dhabi, UAE',
    salaryRange: '$110,000 – $220,000/yr',
    flightHours: '3,500+ hrs TT',
    tags: ['5-Star Airline', 'Tax-Free', 'Modern Fleet'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/etihad-airways-new.jpg',
    description: 'Etihad is known for its innovative approach to aviation and premium service, with a growing international network from Abu Dhabi.',
    fleet: 'Airbus A350, A320neo, Boeing 787',
    flag: '🇦🇪',
  },
  {
    id: 'lufthansa',
    name: 'Lufthansa',
    location: 'Frankfurt, Germany',
    salaryRange: '$95,000 – $160,000/yr',
    flightHours: '3,000+ hrs TT',
    tags: ['European Leader', 'Union Benefits', 'Stable Career'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/lufthansa.jpg',
    description: 'Lufthansa is one of Europe\'s largest carriers, offering excellent career stability, strong union representation, and world-class training.',
    fleet: 'Airbus A320 family, A350, Boeing 747, 787',
    flag: '🇩🇪',
  },
  {
    id: 'british',
    name: 'British Airways',
    location: 'London, UK',
    salaryRange: '£65,000 – £150,000/yr',
    flightHours: '3,000+ hrs TT',
    tags: ['Legacy Carrier', 'Global Routes', 'Premium Brand'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/british-airways.jpg',
    description: 'British Airways offers a prestigious career at one of the world\'s most recognised airline brands, with routes across six continents.',
    fleet: 'Airbus A320, A380, Boeing 777, 787',
    flag: '🇬🇧',
  },
  {
    id: 'airfrance',
    name: 'Air France',
    location: 'Paris, France',
    salaryRange: '€70,000 – €140,000/yr',
    flightHours: '2,500+ hrs TT',
    tags: ['European Carrier', 'Paris Hub', 'Career Growth'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/air-france.jpg',
    description: 'Air France operates a diverse route network from Paris CDG, offering a strong European and global career for pilots.',
    fleet: 'Airbus A320, A350, Boeing 777, 787',
    flag: '🇫🇷',
  },
  {
    id: 'klm',
    name: 'KLM Royal Dutch',
    location: 'Amsterdam, Netherlands',
    salaryRange: '€80,000 – $145,000/yr',
    flightHours: '2,500+ hrs TT',
    tags: ['Historic Airline', 'European Hub', 'Excellent Benefits'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/klm.jpg',
    description: 'KLM is one of the world\'s oldest airlines, offering a stable career with strong benefits and an extensive European and intercontinental network.',
    fleet: 'Boeing 737, 777, 787, Embraer E-Jets',
    flag: '🇳🇱',
  },
  {
    id: 'turkish',
    name: 'Turkish Airlines',
    location: 'Istanbul, Turkey',
    salaryRange: '$90,000 – $160,000/yr',
    flightHours: '3,000+ hrs TT',
    tags: ['Most Countries Flown', 'Growing Network', 'Modern Fleet'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/turkish-airlines.jpg',
    description: 'Turkish Airlines flies to more countries than any other airline, making it a unique opportunity for pilots who want global exposure.',
    fleet: 'Airbus A320 family, A350, Boeing 737, 777, 787',
    flag: '🇹🇷',
  },
  {
    id: 'ana',
    name: 'All Nippon Airways',
    location: 'Tokyo, Japan',
    salaryRange: '¥12M – ¥20M/yr',
    flightHours: '3,000+ hrs TT',
    tags: ['5-Star Airline', 'Japanese Service', 'Premium Culture'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/ana.jpg',
    description: 'ANA is Japan\'s largest airline and a 5-star carrier, known for impeccable service culture and a strong domestic and international network.',
    fleet: 'Boeing 787, 777, 737, Airbus A320 family',
    flag: '🇯🇵',
  },
  {
    id: 'jal',
    name: 'Japan Airlines',
    location: 'Tokyo, Japan',
    salaryRange: '¥11M – ¥18M/yr',
    flightHours: '2,500+ hrs TT',
    tags: ['Legacy Carrier', 'Safety Record', 'Premium Service'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/japan-airlines.jpg',
    description: 'Japan Airlines is celebrated for its safety record and world-class cabin service, operating a modern fleet from Tokyo Narita and Haneda.',
    fleet: 'Boeing 777, 787, Airbus A350',
    flag: '🇯🇵',
  },
];

const CORE_EXPECTATIONS = [
  {
    title: 'Technical Mastery',
    desc: 'Airlines assess automation management, systems knowledge, and manual flight path precision. Our EBT CBTA framework ensures competencies align with manufacturer standards.',
    icon: Cpu,
    color: 'from-blue-500 to-cyan-500',
    bullets: ['Automation Logic', 'Manual Precision', 'Systems Mastery'],
  },
  {
    title: 'Behavioral Competency',
    desc: 'CRM, crew leadership, and communication are evaluated through observed scenarios. 50 hours of verifiable mentorship validates behavioral competencies practically.',
    icon: Users,
    color: 'from-purple-500 to-violet-500',
    bullets: ['CRM Excellence', 'Decision Making', 'Balanced Leadership'],
  },
  {
    title: 'Cognitive Resilience',
    desc: 'Situational awareness, workload management, and pressure decision-making are assessed through EBT CBTA-aligned frameworks and recognition-based profiling.',
    icon: Brain,
    color: 'from-emerald-500 to-teal-500',
    bullets: ['Mental Agility', 'Situational Awareness', 'Workload Management'],
  },
  {
    title: 'Professional Persona',
    desc: 'Commitment to safety culture, airline values, and long-term career stewardship. Objective pathway matching based on verified competencies, not connections.',
    icon: Shield,
    color: 'from-amber-500 to-orange-500',
    bullets: ['Safety Culture', 'Company Fit', 'Ethics & Integrity'],
  },
];

const ASSESSMENT_PIPELINE = [
  { title: 'Screening', desc: 'Digital audit of your ATLAS CV and minimum legal credentials.', icon: Search },
  { title: 'Psychometrics', desc: 'Cognitive ability, spatial awareness, and personality fit testing.', icon: Target },
  { title: 'Technical / HR', desc: 'Competency-based interviews and SOP knowledge assessment.', icon: Briefcase },
  { title: 'Simulator Audit', desc: 'Practical EBT/CBTA competency demonstration in multi-crew environment.', icon: Zap },
];

export interface PortalAirlineExpectationsPageProps {
  onBack: () => void;
  isDarkMode?: boolean;
}

export const PortalAirlineExpectationsPage: React.FC<PortalAirlineExpectationsPageProps> = ({
  onBack,
  isDarkMode = true,
}) => {
  const [selectedAirline, setSelectedAirline] = useState<Airline | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const carouselRef = useRef<HTMLDivElement>(null);
  const { userProfile } = useAuth();

  const filteredAirlines = AIRLINES.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (!carouselRef.current) return;
      const container = carouselRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: 320, behavior: 'smooth' });
      }
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    carouselRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  const bg = isDarkMode ? 'bg-slate-950' : 'bg-slate-50';
  const card = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const text = isDarkMode ? 'text-white' : 'text-slate-900';
  const subtext = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const inputBg = isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400';

  return (
    <div className={`min-h-screen ${bg} ${text} font-sans`}>
      {/* Top Nav */}
      <div className={`sticky top-0 z-50 ${isDarkMode ? 'bg-slate-950/95' : 'bg-white/95'} backdrop-blur border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pathways
          </button>
          <div className="h-5 w-px bg-slate-700 mx-1" />
          <img src="/logo.png" alt="WingMentor" className="h-8 w-auto object-contain" />
          <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Airline Expectations</span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden pt-16 pb-12 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/30 via-transparent to-purple-900/20 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-sky-400 mb-3">Strategic Career Guidance</p>
          <h1 className={`text-4xl md:text-6xl font-serif font-normal leading-tight mb-4 ${text}`}>
            Airline Requirements Search
          </h1>
          <p className="text-lg md:text-xl mb-2" style={{ color: '#DAA520', fontFamily: 'Georgia, serif' }}>
            Requirements · Expectations · Career Pathways
          </p>
          <p className={`max-w-2xl mx-auto text-sm md:text-base leading-relaxed ${subtext} mt-4`}>
            Understanding what airlines really look for—beyond the 1,500-hour requirement. We bridge the gap between "having the hours" and "being the right candidate" through AI-powered pathway matching.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-lg mx-auto relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${subtext}`} />
            <input
              type="text"
              placeholder="Search airlines, locations, tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/50 transition-all ${inputBg}`}
            />
          </div>
        </div>
      </div>

      {/* Airline Carousel */}
      <div className="px-0 mb-12">
        <div className="max-w-7xl mx-auto px-6 mb-4 flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-serif font-normal ${text}`}>Browse Airlines</h2>
            <p className={`text-sm ${subtext}`}>{filteredAirlines.length} airlines available</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll('right')} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto pb-4 px-6 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {filteredAirlines.map(airline => (
            <div
              key={airline.id}
              onClick={() => setSelectedAirline(airline)}
              className={`flex-shrink-0 w-72 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 border ${
                selectedAirline?.id === airline.id
                  ? 'ring-2 ring-sky-500 border-sky-500/50'
                  : isDarkMode ? 'border-slate-800 hover:border-slate-600' : 'border-slate-200 hover:border-slate-400'
              } ${isDarkMode ? 'bg-slate-900' : 'bg-white'} group`}
            >
              {/* Card Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={airline.image}
                  alt={airline.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-lg">{airline.flag}</span>
                    <span className="text-white font-serif text-base leading-tight">{airline.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/70 text-xs">
                    <MapPin className="w-3 h-3" />
                    {airline.location}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <DollarSign className="w-3 h-3" />
                    <span className="font-medium">{airline.salaryRange}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs mb-3" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  <Clock className="w-3 h-3" />
                  {airline.flightHours}
                </div>
                <div className="flex flex-wrap gap-1">
                  {airline.tags.map(tag => (
                    <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Airline Detail */}
      {selectedAirline && (
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className={`rounded-2xl overflow-hidden border ${card}`}>
            {/* Hero Image */}
            <div className="relative h-64 md:h-80">
              <img
                src={selectedAirline.image}
                alt={selectedAirline.name}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{selectedAirline.flag}</span>
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-sky-400 bg-sky-500/20 px-3 py-1 rounded-full border border-sky-400/30">
                    Selected Airline
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-2">{selectedAirline.name}</h2>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1.5 text-white/80 text-sm"><MapPin className="w-4 h-4" />{selectedAirline.location}</span>
                  <span className="flex items-center gap-1.5 text-emerald-300 text-sm font-medium"><DollarSign className="w-4 h-4" />{selectedAirline.salaryRange}</span>
                  <span className="flex items-center gap-1.5 text-sky-300 text-sm"><Clock className="w-4 h-4" />{selectedAirline.flightHours}</span>
                </div>
              </div>
            </div>

            {/* Detail Content */}
            <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
              {/* Left */}
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${text}`}>About</h3>
                <p className={`text-sm leading-relaxed mb-6 ${subtext}`}>{selectedAirline.description}</p>

                {selectedAirline.fleet && (
                  <>
                    <h3 className={`text-lg font-semibold mb-3 ${text}`}>Fleet</h3>
                    <div className={`flex items-start gap-3 p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <Plane className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" />
                      <p className={`text-sm ${subtext}`}>{selectedAirline.fleet}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Right - Requirements */}
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${text}`}>Minimum Requirements</h3>
                <ul className="space-y-2.5">
                  {[
                    `${selectedAirline.flightHours} Total Flight Time`,
                    'Valid ATPL or CPL',
                    'ICAO English Level 4+',
                    'Class 1 Medical Certificate',
                    'Multi-Engine Instrument Rating',
                  ].map((req, i) => (
                    <li key={i} className={`flex items-start gap-3 text-sm ${subtext}`}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>

                <h3 className={`text-lg font-semibold mt-6 mb-3 ${text}`}>Preferred</h3>
                <ul className="space-y-2.5">
                  {[
                    `Type Rating on ${selectedAirline.name} fleet aircraft`,
                    'Previous airline / commercial experience',
                    'EBT / CBTA certification',
                    'MCC course completion',
                    'Recent line experience (last 12 months)',
                  ].map((req, i) => (
                    <li key={i} className={`flex items-start gap-3 text-sm ${subtext}`}>
                      <Star className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tags */}
            <div className={`px-6 md:px-8 pb-6 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} pt-5`}>
              <div className="flex flex-wrap gap-2">
                {selectedAirline.tags.map(tag => (
                  <span key={tag} className={`text-xs px-3 py-1.5 rounded-full font-medium ${isDarkMode ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-sky-50 text-sky-700 border border-sky-200'}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Core Expectations */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-serif font-normal ${text} mb-2`}>What Airlines Really Look For</h2>
          <p className={`text-sm ${subtext}`}>The four pillars assessed during every airline selection process</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CORE_EXPECTATIONS.map(exp => {
            const Icon = exp.icon;
            return (
              <div key={exp.title} className={`rounded-2xl border p-6 ${card}`}>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${exp.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className={`font-semibold mb-2 ${text}`}>{exp.title}</h3>
                <p className={`text-xs leading-relaxed mb-4 ${subtext}`}>{exp.desc}</p>
                <div className="flex flex-wrap gap-1">
                  {exp.bullets.map(b => (
                    <span key={b} className={`text-[10px] px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>{b}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assessment Pipeline */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-serif font-normal ${text} mb-2`}>The Assessment Pipeline</h2>
          <p className={`text-sm ${subtext}`}>From application to final offer — know every stage</p>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {ASSESSMENT_PIPELINE.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <div key={stage.title} className={`rounded-2xl border p-6 relative ${card}`}>
                <div className={`absolute top-4 right-4 text-2xl font-serif font-bold ${isDarkMode ? 'text-slate-700' : 'text-slate-200'}`}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <Icon className="w-5 h-5 text-sky-400" />
                </div>
                <h3 className={`font-semibold mb-2 ${text}`}>{stage.title}</h3>
                <p className={`text-xs leading-relaxed ${subtext}`}>{stage.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Match Profile Banner */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-900 border border-sky-800/50 p-8 text-center">
          <Globe className="w-10 h-10 text-sky-400 mx-auto mb-4" />
          <h3 className="text-2xl font-serif text-white mb-2">Check Your Airline Match Score</h3>
          <p className="text-sky-200/80 text-sm max-w-xl mx-auto mb-6">
            Your WingMentor PilotRecognition profile is automatically matched against each airline's verified requirements. Build your profile to unlock personalised match scores.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-5 py-2.5 rounded-full border border-white/20">
              <span className="text-white text-sm font-medium">Profile Score</span>
              <span className="text-sky-300 font-bold text-lg">{userProfile ? '82%' : '--'}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-5 py-2.5 rounded-full border border-white/20">
              <span className="text-white text-sm font-medium">Airlines Matched</span>
              <span className="text-emerald-300 font-bold text-lg">{userProfile ? AIRLINES.length : '0'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalAirlineExpectationsPage;
