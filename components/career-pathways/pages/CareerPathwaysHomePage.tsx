import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Award,
  ShieldCheck,
  Briefcase,
  DollarSign,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Building2,
  Plane,
  Search,
} from 'lucide-react';
import { CareerPathwaysCarousel } from '@/components/website/components/CareerPathwaysCarousel';
import { AircraftShowcaseHero } from '@/components/website/components/pilot-recognition/AircraftShowcaseHero';
import { safeRedirect } from '@/lib/url-validator';
import type { TabId } from '@/components/website/components/unified-platform/types';
import {
  aircraftTypeRatings,
  manufacturers,
  type AircraftTypeRating,
  type Manufacturer,
} from '@/data/aircraft-manufacturers';
import { DUMMY_FLIGHT_SCHOOLS, type FlightSchool } from '@/data/flight-schools';
import {
  airlines,
  type Airline,
} from '@/components/website/components/AirlineExpectationsCarousel';

interface GalleryImage {
  src: string;
  title: string;
  subtitle: string;
  route: string;
}

const galleryImages: GalleryImage[] = [
  {
    src: '/images/about-bg.png',
    title: 'Explore Pathways',
    subtitle: 'Discover training, ratings, and operator pathways',
    route: '/pathway/explore-pathways',
  },
  {
    src: '/images/set-06-pathways/pathway2.png',
    title: 'Airline Pathways',
    subtitle: 'Explore airline operator pathways worldwide',
    route: '/pathway/airline-pathways',
  },
  {
    src: '/images/set-06-pathways/type.png',
    title: 'Type Rating Center Pathways',
    subtitle: 'Compare training centers and costs',
    route: '/pathway/type-rating-center-pathways',
  },
  {
    src: '/images/set-08-website/cessna.png',
    title: 'ATO Pathways',
    subtitle: 'Find flight schools and approved training organizations',
    route: '/pathway/ato-pathways',
  },
  {
    src: '/images/set-02-pilot-gap/expect.png',
    title: 'Cargo Pathways',
    subtitle: 'Freight, cargo, and logistics operator routes',
    route: '/pathway/cargo-pathways',
  },
  {
    src: '/images/set-02-pilot-gap/shortage2.png',
    title: 'Charter Pathways',
    subtitle: 'Business aviation and charter operator careers',
    route: '/pathway/charter-pathways',
  },
  {
    src: '/images/set-08-website/Program.png',
    title: 'Program Pathways',
    subtitle: 'Wingmentor and partner pathways',
    route: '/pathway/program-pathways',
  },
  {
    src: '/images/about-bg.png',
    title: 'About',
    subtitle: 'Our mission and network',
    route: '/pathway/about',
  },
  {
    src: '/images/air-taxi-platform.png',
    title: 'eVTOL & Air Taxi Pathways',
    subtitle: 'Urban air mobility and advanced air mobility operators',
    route: '/pathway/evtol-air-taxi-pathways',
  },
];

interface CareerPathwaysHomePageProps {
  onLogin?: () => void;
}

interface HubCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  route: string;
  color: string;
  bgGradient: string;
  shadowClass: string;
  image: string;
  features: string[];
}

const getAircraftImage = (id: string) => {
  const aircraft = aircraftTypeRatings.find((a) => a.id === id);
  return aircraft?.images?.[0] || aircraft?.image || '/images/set-06-pathways/pathway2.png';
};

const hubCards: HubCard[] = [
  {
    id: 'career-pathways',
    title: 'Career Pathways',
    description: 'Explore training, type ratings, airlines, cargo, charter, and eVTOL pathways.',
    icon: GraduationCap,
    route: '/discover',
    color: '#10b981',
    bgGradient: 'from-emerald-500/10 to-emerald-600/5',
    shadowClass: 'hover:shadow-emerald-500/10',
    image: getAircraftImage('cessna-172'),
    features: ['Browse all pathways', 'Compare careers', 'Find your next step'],
  },
  {
    id: 'type-rating-search',
    title: 'Type Rating Search',
    description: 'Search type-rating centers, compare aircraft families, and book simulator time.',
    icon: Award,
    route: '/type-ratings',
    color: '#ef4444',
    bgGradient: 'from-red-500/10 to-red-600/5',
    shadowClass: 'hover:shadow-red-500/10',
    image: getAircraftImage('a320-200'),
    features: ['Type-rating centers', 'Aircraft comparison', 'Simulator booking'],
  },
  {
    id: 'airline-expectations',
    title: 'Airline Expectations',
    description:
      'Compare airline requirements, hiring expectations, and operator prerequisites worldwide.',
    icon: ShieldCheck,
    route: '/airline-expectations',
    color: '#6366f1',
    bgGradient: 'from-indigo-500/10 to-indigo-600/5',
    shadowClass: 'hover:shadow-indigo-500/10',
    image: getAircraftImage('gulfstream-g650'),
    features: ['Airline requirements', 'Hiring expectations', 'Operator prerequisites'],
  },
  {
    id: 'get-hired',
    title: 'Get Hired',
    description: 'Explore airlines, cargo, charter, corporate, and eVTOL operator pathways.',
    icon: Briefcase,
    route: '/airlines',
    color: '#06b6d4',
    bgGradient: 'from-cyan-500/10 to-cyan-600/5',
    shadowClass: 'hover:shadow-cyan-500/10',
    image: getAircraftImage('b737-max'),
    features: ['Airline pathways', 'Cargo & charter', 'eVTOL operators'],
  },
  {
    id: 'get-funded',
    title: 'Get Funded',
    description: 'Training loans, scholarships, insurance, and visa support for your next step.',
    icon: DollarSign,
    route: '/get-started',
    color: '#f59e0b',
    bgGradient: 'from-amber-500/10 to-amber-600/5',
    shadowClass: 'hover:shadow-amber-500/10',
    image: getAircraftImage('atr-72-600'),
    features: ['Training loans', 'Scholarships', 'Visa support'],
  },
  {
    id: 'get-recognition',
    title: 'Get Recognition',
    description: 'Build your Atlas CV, find mentors, join the associate program, and get seen.',
    icon: Star,
    route: '/profile',
    color: '#8b5cf6',
    bgGradient: 'from-violet-500/10 to-violet-600/5',
    shadowClass: 'hover:shadow-violet-500/10',
    image: getAircraftImage('crj900'),
    features: ['Atlas CV', 'Mentor network', 'Associate program'],
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const PathwaysPromo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative z-10">
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 py-12 md:py-16 px-4 text-center">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-3/4 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at top, rgba(20, 184, 166, 0.28) 0%, transparent 60%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 to-slate-950/80 pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-1.5 rounded-full bg-white/10">
              <Plane className="w-5 h-5 text-teal-400" />
            </div>
            <span className="text-sm font-bold text-white uppercase tracking-[0.2em]">
              Pilot Career Pathways
            </span>
          </div>

          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Choose the pathway that&apos;s right for you
          </h2>

          <p className="text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Compare training programs, type ratings, and operator pathways built for pilots — not
            recruiters.
          </p>

          <button
            onClick={() => navigate('/discover')}
            className="px-6 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold rounded-lg border border-slate-600 transition-colors"
          >
            Compare plans
          </button>

          <p className="text-xs text-slate-500 mt-4">
            *Select pathways. Excludes partner programs.
          </p>
        </div>
      </div>
    </section>
  );
};

type HeroMode = 'type-ratings' | 'discover' | 'programs' | 'expectations';

const slideDurations: Record<HeroMode, number> = {
  'type-ratings': 8000,
  discover: 8000,
  programs: 8000,
  expectations: 8000,
};

const DiscoverPathwaysShowcase: React.FC = () => {
  return (
    <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30 z-[2] pointer-events-none" />
      <img
        src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80&auto=format&fit=crop"
        alt="Discover pilot career pathways"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
    </div>
  );
};

const ProgramsShowcase: React.FC = () => {
  return (
    <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40 z-[2] pointer-events-none" />
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 p-2 opacity-25 h-full content-center">
        {[...galleryImages, ...galleryImages].map((image, i) => (
          <div key={i} className="aspect-video rounded-lg overflow-hidden bg-slate-800">
            <img src={image.src} alt={image.title} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

const ExpectationsShowcase: React.FC = () => {
  return (
    <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40 z-[2] pointer-events-none" />
      <img
        src="/images/set-02-pilot-gap/expect.png"
        alt="Career expectations"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
    </div>
  );
};

interface SearchHeroCarouselProps {
  query: string;
  onClear: () => void;
}

interface SearchCategory {
  id: string;
  title: string;
  image: string;
}

const searchCategories: SearchCategory[] = [
  { id: 'cadet-programs', title: 'Cadet Programs', image: '/images/set-08-website/Program.png' },
  {
    id: 'airline-expectations',
    title: 'Airline Expectations',
    image: '/images/set-02-pilot-gap/expect.png',
  },
  { id: 'type-ratings', title: 'Type Ratings', image: '/images/set-06-pathways/type.png' },
  { id: 'aircraft-types', title: 'Aircraft Types', image: '/images/set-08-website/cessna.png' },
  {
    id: 'cargo-operators',
    title: 'Cargo Operators',
    image: '/images/set-02-pilot-gap/shortage2.png',
  },
  { id: 'charter-operators', title: 'Charter Operators', image: '/images/about-bg.png' },
];

interface RelatedProgram {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  route: string;
}

const ATO_KEYWORDS = [
  'school',
  'college',
  'academy',
  'ato',
  'training',
  'institute',
  'university',
  'flight school',
  'aviation school',
  'aviation college',
  'pilot school',
  'flying school',
];

const scoreMatch = (text: string, query: string): number => {
  const normalized = text.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  if (normalized === q) return 100;
  if (normalized.startsWith(q + ' ')) return 80;
  if (
    normalized.includes(' ' + q + ' ') ||
    normalized.includes(' ' + q) ||
    normalized.startsWith(q)
  )
    return 60;
  if (normalized.includes(q)) return 40;
  return 0;
};

const getAirlineRelatedPrograms = (airline: Airline): RelatedProgram[] => {
  const fleetTypes = ['A320', 'B737', 'A350', 'B777', 'A380', 'B787'];
  const matchedTypes = fleetTypes.filter((type) => airline.fleet?.toUpperCase().includes(type));
  const fallbackTypes = matchedTypes.length > 0 ? matchedTypes.slice(0, 2) : ['A320', 'B737'];
  const location = airline.location.split(',')[0];
  return [
    {
      id: `${airline.id}-cadet`,
      title: `${airline.name} Cadet Academy`,
      subtitle: `Ab-initio to airline-ready in ${location}`,
      image: '/images/set-08-website/Program.png',
      route: '/pathway/program-pathways',
    },
    {
      id: `${airline.id}-type-rating`,
      title: `${fallbackTypes[0]} Type Rating Program`,
      subtitle: `Aligned with ${airline.name} fleet standards`,
      image: '/images/set-06-pathways/type.png',
      route: '/type-ratings',
    },
    {
      id: `${airline.id}-second-officer`,
      title: 'Second Officer Pathway',
      subtitle: `Structured route to ${airline.name} flight deck`,
      image: '/images/set-02-pilot-gap/expect.png',
      route: '/airline-expectations',
    },
    {
      id: `${airline.id}-mentorship`,
      title: 'Airline Mentorship Program',
      subtitle: `Connect with ${airline.name} pilots`,
      image: '/images/about-bg.png',
      route: '/profile',
    },
  ];
};

const useHorizontalCarousel = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);

  const scroll = (direction: 'left' | 'right') => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('[data-carousel-card]');
    const scrollAmount = card ? card.offsetWidth + 16 : track.clientWidth * 0.75;
    track.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    setIsDragging(true);
    dragStartX.current = e.pageX - track.offsetLeft;
    dragStartScrollLeft.current = track.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const track = trackRef.current;
    if (!track) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = dragStartScrollLeft.current - (x - dragStartX.current) * 1.5;
  };

  const handleMouseUp = () => setIsDragging(false);

  return {
    trackRef,
    isDragging,
    scroll,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
    },
  };
};

interface HorizontalCarouselProps {
  title: string;
  children: React.ReactNode;
}

const HorizontalCarousel: React.FC<HorizontalCarouselProps> = ({ title, children }) => {
  const { trackRef, isDragging, scroll, handlers } = useHorizontalCarousel();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scroll('left');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scroll('right');
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{title}</p>
      <div
        className="relative flex items-center py-2"
        onKeyDown={handleKeyDown}
        role="region"
        aria-label={title}
      >
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-slate-800/90 hover:bg-indigo-600 border border-white/10 hover:border-indigo-400/50 flex items-center justify-center text-white transition-colors shadow-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div
          ref={trackRef}
          tabIndex={0}
          className={`flex gap-4 overflow-x-auto scrollbar-hide px-14 py-4 snap-x snap-mandatory select-none outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 rounded-2xl ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          {...handlers}
        >
          {children}
        </div>
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-slate-800/90 hover:bg-indigo-600 border border-white/10 hover:border-indigo-400/50 flex items-center justify-center text-white transition-colors shadow-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  style?: React.CSSProperties;
}

const CarouselCard: React.FC<BaseCardProps> = ({
  children,
  className = '',
  onClick,
  selected,
  style,
}) => (
  <motion.button
    type="button"
    data-carousel-card
    whileHover={{ y: -6, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    style={style}
    className={`group relative shrink-0 rounded-2xl overflow-hidden text-left focus:outline-none snap-center transition-all ${
      selected
        ? 'ring-2 ring-indigo-400 shadow-[0_0_40px_rgba(99,102,241,0.35)]'
        : 'ring-1 ring-white/10'
    } ${className}`}
  >
    {children}
    {selected && (
      <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center z-10">
        <span className="text-white text-xs font-bold">✓</span>
      </div>
    )}
  </motion.button>
);

const AircraftCard: React.FC<{
  aircraft: AircraftTypeRating;
  selected?: boolean;
  onClick?: () => void;
}> = ({ aircraft, selected, onClick }) => {
  const image = aircraft.images?.[0] || aircraft.image;
  const manufacturer =
    manufacturers.find((m) => m.id === aircraft.manufacturer_id)?.name || aircraft.manufacturer_id;
  return (
    <CarouselCard
      selected={selected}
      onClick={onClick}
      className="w-[280px] md:w-[340px]"
      style={{ aspectRatio: '16 / 10' }}
    >
      <img
        src={image}
        alt={aircraft.model}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      <span className="absolute top-3 right-3 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider rounded-md bg-slate-950/70 text-white border border-white/10 backdrop-blur-sm">
        {aircraft.category}
      </span>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-base md:text-lg font-bold text-white">{aircraft.model}</p>
        <p className="text-xs text-slate-300">{manufacturer}</p>
      </div>
    </CarouselCard>
  );
};

const CategoryCard: React.FC<{
  category: SearchCategory;
  selected?: boolean;
  onClick?: () => void;
  size?: 'large' | 'small';
}> = ({ category, selected, onClick, size = 'large' }) => {
  const dims =
    size === 'large' ? 'w-[280px] md:w-[340px]' : 'w-[140px] h-[140px] md:w-[160px] md:h-[160px]';
  return (
    <CarouselCard
      selected={selected}
      onClick={onClick}
      className={dims}
      style={size === 'large' ? { aspectRatio: '16 / 10' } : undefined}
    >
      <img
        src={category.image}
        alt={category.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      <div className={`absolute bottom-0 left-0 right-0 ${size === 'large' ? 'p-4' : 'p-3'}`}>
        <p
          className={`font-bold text-white ${size === 'large' ? 'text-base md:text-lg' : 'text-sm'}`}
        >
          {category.title}
        </p>
      </div>
    </CarouselCard>
  );
};

const ATOCard: React.FC<{ school: FlightSchool; selected?: boolean; onClick?: () => void }> = ({
  school,
  selected,
  onClick,
}) => (
  <CarouselCard
    selected={selected}
    onClick={onClick}
    className="w-[280px] md:w-[340px]"
    style={{ aspectRatio: '16 / 10' }}
  >
    <img
      src={school.image || '/images/set-08-website/cessna.png'}
      alt={school.name}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
    <span className="absolute top-3 right-3 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider rounded-md bg-slate-950/70 text-white border border-white/10 backdrop-blur-sm">
      ATO
    </span>
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <p className="text-base md:text-lg font-bold text-white line-clamp-1">{school.name}</p>
      <p className="text-xs text-slate-300 line-clamp-1">{school.location}</p>
    </div>
  </CarouselCard>
);

const AirlineCard: React.FC<{
  airline: Airline;
  selected?: boolean;
  onClick?: () => void;
}> = ({ airline, selected, onClick }) => (
  <CarouselCard
    selected={selected}
    onClick={onClick}
    className="w-[280px] md:w-[340px]"
    style={{ aspectRatio: '16 / 10' }}
  >
    <img
      src={airline.image}
      alt={airline.name}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
    <span className="absolute top-3 right-3 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider rounded-md bg-slate-950/70 text-white border border-white/10 backdrop-blur-sm">
      Airline
    </span>
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <p className="font-bold text-white text-base md:text-lg">{airline.name}</p>
      <p className="text-xs text-slate-300">{airline.location}</p>
    </div>
  </CarouselCard>
);

const ManufacturerCard: React.FC<{
  manufacturer: Manufacturer;
  selected?: boolean;
  onClick?: () => void;
}> = ({ manufacturer, selected, onClick }) => (
  <CarouselCard
    selected={selected}
    onClick={onClick}
    className="w-[280px] md:w-[340px]"
    style={{ aspectRatio: '16 / 10' }}
  >
    <img
      src={manufacturer.heroImage || manufacturer.logo || '/images/set-08-website/cessna.png'}
      alt={manufacturer.name}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
    <span className="absolute top-3 right-3 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider rounded-md bg-slate-950/70 text-white border border-white/10 backdrop-blur-sm">
      Manufacturer
    </span>
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <p className="font-bold text-white text-base md:text-lg">{manufacturer.name}</p>
      <p className="text-xs text-slate-300 line-clamp-1">{manufacturer.headquarters}</p>
    </div>
  </CarouselCard>
);

const ProgramCard: React.FC<{
  program: RelatedProgram;
  selected?: boolean;
  onClick?: () => void;
}> = ({ program, selected, onClick }) => (
  <CarouselCard
    selected={selected}
    onClick={onClick}
    className="w-[280px] md:w-[340px]"
    style={{ aspectRatio: '16 / 10' }}
  >
    <img
      src={program.image}
      alt={program.title}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
    <span className="absolute top-3 right-3 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider rounded-md bg-slate-950/70 text-white border border-white/10 backdrop-blur-sm">
      Program
    </span>
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <p className="text-base md:text-lg font-bold text-white">{program.title}</p>
      <p className="text-xs text-slate-300">{program.subtitle}</p>
    </div>
  </CarouselCard>
);

type SearchResultItem =
  | { type: 'airline'; id: string; score: number; data: Airline }
  | { type: 'manufacturer'; id: string; score: number; data: Manufacturer }
  | { type: 'aircraft'; id: string; score: number; data: AircraftTypeRating }
  | { type: 'ato'; id: string; score: number; data: FlightSchool }
  | { type: 'program'; id: string; score: number; data: RelatedProgram }
  | { type: 'category'; id: string; score: number; data: SearchCategory };

const useSearchResults = (query: string): { items: SearchResultItem[] } => {
  const trimmedQuery = query.trim().toLowerCase();
  return useMemo(() => {
    if (!trimmedQuery) {
      return { items: [] };
    }

    const items: SearchResultItem[] = [];

    const matchedAirline = airlines
      .map((a) => ({ item: a, score: scoreMatch(a.name, trimmedQuery) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)[0];

    if (matchedAirline) {
      items.push({
        type: 'airline',
        id: matchedAirline.item.id,
        score: 100 + matchedAirline.score,
        data: matchedAirline.item,
      });
      getAirlineRelatedPrograms(matchedAirline.item).forEach((program) => {
        items.push({ type: 'program', id: program.id, score: 60, data: program });
      });
    }

    const matchedManufacturer = manufacturers
      .map((m) => ({ item: m, score: scoreMatch(m.name, trimmedQuery) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)[0];

    if (matchedManufacturer) {
      items.push({
        type: 'manufacturer',
        id: matchedManufacturer.item.id,
        score: 100 + matchedManufacturer.score,
        data: matchedManufacturer.item,
      });
    }

    aircraftTypeRatings.forEach((aircraft) => {
      const mfr = manufacturers.find((mf) => mf.id === aircraft.manufacturer_id);
      let score = 0;
      if (matchedManufacturer && aircraft.manufacturer_id === matchedManufacturer.item.id) {
        score += 70;
      }
      score += scoreMatch(aircraft.model, trimmedQuery);
      score += scoreMatch(aircraft.category, trimmedQuery);
      score += scoreMatch(mfr?.name || '', trimmedQuery);
      if (score > 0) {
        items.push({ type: 'aircraft', id: aircraft.id, score, data: aircraft });
      }
    });

    const atoKeywordHit = ATO_KEYWORDS.some((kw) => trimmedQuery.includes(kw));
    DUMMY_FLIGHT_SCHOOLS.filter((school) => school.id !== 'wingmentor-intro').forEach((school) => {
      let score = 0;
      if (atoKeywordHit) score += 30;
      score += scoreMatch(school.name, trimmedQuery);
      score += scoreMatch(school.location, trimmedQuery);
      score += (school.offerings || []).reduce((sum, o) => sum + scoreMatch(o, trimmedQuery), 0);
      if (score > 0) {
        items.push({ type: 'ato', id: school.id, score, data: school });
      }
    });

    const categoryMatches = searchCategories.filter((c) => scoreMatch(c.title, trimmedQuery) > 0);
    (categoryMatches.length > 0 ? categoryMatches : searchCategories).forEach((category) => {
      const titleScore = scoreMatch(category.title, trimmedQuery);
      items.push({
        type: 'category',
        id: category.id,
        score: titleScore > 0 ? 20 + titleScore : 10,
        data: category,
      });
    });

    const uniqueItems = items.reduce<SearchResultItem[]>((acc, item) => {
      if (!acc.some((i) => i.id === item.id && i.type === item.type)) {
        acc.push(item);
      }
      return acc;
    }, []);

    uniqueItems.sort((a, b) => b.score - a.score);
    return { items: uniqueItems.slice(0, 18) };
  }, [trimmedQuery]);
};

interface ResultCardProps {
  item: SearchResultItem;
  selected?: boolean;
  onClick?: () => void;
  featured?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ item, selected, onClick, featured }) => {
  const card = (() => {
    switch (item.type) {
      case 'airline':
        return <AirlineCard airline={item.data} selected={selected} onClick={onClick} />;
      case 'manufacturer':
        return <ManufacturerCard manufacturer={item.data} selected={selected} onClick={onClick} />;
      case 'aircraft':
        return <AircraftCard aircraft={item.data} selected={selected} onClick={onClick} />;
      case 'ato':
        return <ATOCard school={item.data} selected={selected} onClick={onClick} />;
      case 'program':
        return <ProgramCard program={item.data} selected={selected} onClick={onClick} />;
      case 'category':
        return (
          <CategoryCard category={item.data} size="large" selected={selected} onClick={onClick} />
        );
    }
  })();

  return (
    <div className="relative shrink-0">
      {featured && (
        <span className="absolute -top-2 left-3 z-20 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider rounded-md bg-indigo-600 text-white shadow-lg">
          Best match
        </span>
      )}
      {card}
    </div>
  );
};

const SearchHeroCarousel: React.FC<SearchHeroCarouselProps> = ({ query, onClear }) => {
  const { items } = useSearchResults(query);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleClick = (item: SearchResultItem) => {
    setSelectedId(item.id);
    switch (item.type) {
      case 'aircraft':
        navigate(`/type-ratings?aircraft=${item.data.id}`);
        break;
      case 'manufacturer':
        navigate(`/type-ratings?manufacturer=${item.data.id}`);
        break;
      case 'airline':
        navigate(`/airline-expectations?airline=${item.data.id}`);
        break;
      case 'ato':
        navigate('/pathway/ato-pathways');
        break;
      case 'program':
        navigate(item.data.route);
        break;
      case 'category':
      default:
        break;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative w-full flex flex-col bg-slate-950 px-4 pb-4 pt-12 md:pt-16"
      style={{ minHeight: 'clamp(480px, 65vh, 720px)' }}
    >
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Suggested pathways
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Matches for <span className="text-indigo-400">&quot;{query}&quot;</span>
          </h2>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white border border-white/10 hover:border-white/30 rounded-xl transition-colors"
        >
          Clear search
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-lg font-medium text-white mb-2">No pathways found</p>
          <p className="text-sm text-slate-400 max-w-md">
            Try searching for an aircraft model like &quot;A320&quot;, a manufacturer like
            &quot;Airbus&quot;, an airline like &quot;Emirates&quot;, or a school like &quot;WCC
            aviation college&quot;.
          </p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto w-full">
          <HorizontalCarousel title="Top matches">
            {items.map((item, index) => (
              <ResultCard
                key={`${item.type}-${item.id}`}
                item={item}
                featured={index === 0}
                selected={selectedId === item.id}
                onClick={() => handleClick(item)}
              />
            ))}
          </HorizontalCarousel>
        </div>
      )}
    </motion.div>
  );
};

interface SearchBarProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ inputRef, value, onChange, onSubmit }) => (
  <div className="flex items-center justify-center px-4 py-4">
    <div
      className="group relative flex items-center gap-3 w-full max-w-3xl bg-white border border-slate-200 rounded-2xl px-4 py-3.5 shadow-2xl"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="absolute -inset-1 bg-indigo-500/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <Search className="w-5 h-5 text-slate-500 shrink-0" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search aircraft type, school, job, or pathway..."
        className="relative z-10 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        value={value}
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSubmit();
          }
        }}
      />
      <button
        type="button"
        onClick={onSubmit}
        className="shrink-0 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
      >
        Search
      </button>
    </div>
  </div>
);

export const CareerPathwaysHomePage: React.FC<CareerPathwaysHomePageProps> = ({
  onLogin: _onLogin,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isSearchActive = searchQuery.trim().length > 0;
  const [heroMode, setHeroMode] = useState<HeroMode>('type-ratings');
  const [isMarqueeInView, setIsMarqueeInView] = useState(false);
  const [isMarqueeHovered, setIsMarqueeHovered] = useState(false);
  const [isMarqueeManualScroll, setIsMarqueeManualScroll] = useState(false);
  const isMarqueePaused = isMarqueeInView || isMarqueeHovered || isMarqueeManualScroll;
  const marqueeRef = useRef<HTMLElement>(null);

  const submitSearch = () => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      navigate('/type-ratings');
      return;
    }
    const aircraft = aircraftTypeRatings.find((a) => a.model.toLowerCase() === query);
    if (aircraft) {
      navigate(`/type-ratings?aircraft=${aircraft.id}`);
      return;
    }
    const manufacturer = manufacturers.find((m) => m.name.toLowerCase() === query);
    if (manufacturer) {
      navigate(`/type-ratings?manufacturer=${manufacturer.id}`);
      return;
    }
    const partialAircraft = aircraftTypeRatings.find((a) => a.model.toLowerCase().includes(query));
    if (partialAircraft) {
      navigate(`/type-ratings?aircraft=${partialAircraft.id}`);
      return;
    }
    const partialManufacturer = manufacturers.find((m) => m.name.toLowerCase().includes(query));
    if (partialManufacturer) {
      navigate(`/type-ratings?manufacturer=${partialManufacturer.id}`);
      return;
    }
    navigate(`/type-ratings?search=${encodeURIComponent(query)}`);
  };

  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsMarqueeInView(entry.isIntersecting && entry.intersectionRatio >= 1),
      { threshold: 1.0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;
    let timeout: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      setIsMarqueeManualScroll(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsMarqueeManualScroll(false), 2000);
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  const scrollMarquee = (direction: 'left' | 'right') => {
    const container = marqueeRef.current;
    if (!container) return;
    const card = container.querySelector<HTMLElement>('[data-marquee-card]');
    const scrollAmount = card ? card.offsetWidth + 16 : container.clientWidth * 0.85;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (isSearchActive) return;
    const timeout = setTimeout(() => {
      setHeroMode((current) => {
        if (current === 'type-ratings') return 'discover';
        if (current === 'discover') return 'programs';
        if (current === 'programs') return 'expectations';
        return 'type-ratings';
      });
    }, slideDurations[heroMode]);
    return () => clearTimeout(timeout);
  }, [heroMode, isSearchActive]);

  useEffect(() => {
    // DEBUG: log whenever search mode toggles
    // eslint-disable-next-line no-console
    console.log('[Pathways Debug] isSearchActive changed:', isSearchActive, 'query:', searchQuery);
  }, [isSearchActive, searchQuery]);

  useEffect(() => {
    const input = searchInputRef.current;
    // eslint-disable-next-line no-console
    console.log(
      '[Pathways Debug] search input element:',
      input,
      'focused:',
      input === document.activeElement
    );
  }, []);

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  // CareerPathwaysCarousel expects a setTab function; we are not inside the
  // unified platform here, so only one slide uses it and we can no-op safely.
  const handleSetTab = (_tab: TabId) => {
    navigate('/discover');
  };

  const handleSafeRedirect = (path: string) => {
    safeRedirect(path, '/');
  };

  useEffect(() => {
    if (!isSearchActive) return;
    const input = searchInputRef.current;
    if (input && document.activeElement !== input) {
      input.focus({ preventScroll: true });
    }
  }, [isSearchActive]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {!isSearchActive ? (
        <>
          {/* Discover-style hero */}
          <div className="relative w-full">
            <AircraftShowcaseHero
              showOverlay={false}
              heroTitle={heroMode === 'type-ratings' ? 'Discover type rating search' : undefined}
              heroCtaLabel={heroMode === 'type-ratings' ? 'Explore' : undefined}
              onHeroCta={heroMode === 'type-ratings' ? () => navigate('/type-ratings') : undefined}
            />

            <motion.div
              animate={{ opacity: heroMode === 'discover' ? 1 : 0 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="absolute inset-0 z-[1]"
            >
              <DiscoverPathwaysShowcase />
            </motion.div>

            <motion.div
              animate={{ opacity: heroMode === 'programs' ? 1 : 0 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="absolute inset-0 z-[1]"
            >
              <ProgramsShowcase />
            </motion.div>

            <motion.div
              animate={{ opacity: heroMode === 'expectations' ? 1 : 0 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="absolute inset-0 z-[1]"
            >
              <ExpectationsShowcase />
            </motion.div>

            {heroMode === 'discover' && (
              <div className="absolute inset-0 z-[2] pointer-events-none flex flex-col items-center justify-end pb-36 md:pb-40 px-4">
                <div className="pointer-events-auto flex flex-col items-center gap-2 max-w-4xl drop-shadow-lg">
                  <p className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-slate-300">
                    Find your path in aviation
                  </p>
                  <h2 className="text-2xl md:text-5xl font-black text-white uppercase text-center leading-tight">
                    Discover <span className="text-indigo-400">Pathways</span>
                  </h2>
                  <div className="text-xs md:text-sm text-slate-200 text-center max-w-2xl space-y-1">
                    <p>
                      Explore training, type ratings, airlines, cargo, charter, and eVTOL pathways.
                    </p>
                    <p>
                      Compare requirements and align your career with operator expectations
                      worldwide.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => navigate('/discover')}
                      className="px-4 py-1.5 border border-white/40 hover:border-white/70 text-white text-xs md:text-sm font-semibold rounded-full transition-colors"
                    >
                      Discover pathways
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/become-member')}
                      className="px-4 py-1.5 border border-white/40 hover:border-white/70 text-white text-xs md:text-sm font-semibold rounded-full transition-colors"
                    >
                      Create account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {heroMode === 'programs' && (
              <div className="absolute inset-0 z-[2] pointer-events-none flex flex-col items-center justify-end pb-36 md:pb-40 px-4">
                <div className="pointer-events-auto flex flex-col items-center gap-3 text-center">
                  <p className="text-sm md:text-base font-medium text-white uppercase tracking-[0.2em]">
                    Discover Pilot Programs
                  </p>
                  <h2 className="text-2xl md:text-4xl font-black text-white uppercase">
                    Programs for the next generation of pilots
                  </h2>
                  <img
                    src="/images/set-01-logos/logo.png"
                    alt="Wingmentor"
                    className="h-16 md:h-24 object-contain"
                  />
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigate('/programs')}
                      className="px-4 py-1.5 border border-white/40 hover:border-white/70 text-white text-xs md:text-sm font-semibold rounded-full transition-colors"
                    >
                      Discover programs
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/discover')}
                      className="px-4 py-1.5 border border-white/40 hover:border-white/70 text-white text-xs md:text-sm font-semibold rounded-full transition-colors"
                    >
                      Learn more
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/become-member')}
                      className="px-4 py-1.5 border border-white/40 hover:border-white/70 text-white text-xs md:text-sm font-semibold rounded-full transition-colors"
                    >
                      Create account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {heroMode === 'expectations' && (
              <div className="absolute inset-0 z-[2] pointer-events-none flex flex-col items-center justify-end pb-36 md:pb-40 px-4">
                <div className="pointer-events-auto flex flex-col items-center gap-3 text-center">
                  <p className="text-sm md:text-base font-medium text-white uppercase tracking-[0.2em]">
                    Discover Requirements and Expectations
                  </p>
                  <h2 className="text-2xl md:text-4xl font-black text-white uppercase">
                    Align your career towards up-to-date airline & operator requirements
                  </h2>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigate('/airline-expectations')}
                      className="px-4 py-1.5 border border-white/40 hover:border-white/70 text-white text-xs md:text-sm font-semibold rounded-full transition-colors"
                    >
                      Explore expectations
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/discover')}
                      className="px-4 py-1.5 border border-white/40 hover:border-white/70 text-white text-xs md:text-sm font-semibold rounded-full transition-colors"
                    >
                      Learn more
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/become-member')}
                      className="px-4 py-1.5 border border-white/40 hover:border-white/70 text-white text-xs md:text-sm font-semibold rounded-full transition-colors"
                    >
                      Create account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation tabs along the bottom of the hero */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-center">
              <div className="flex flex-wrap justify-center gap-2 p-2 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl">
                {[
                  { label: 'Type Rating Search', path: '/type-ratings', external: false },
                  { label: 'View Pathways', path: '/discover', external: false },
                  { label: 'Discover Wingmentor', path: '/programs', external: false },
                  {
                    label: 'Create Recognition Profile',
                    path: '/platform?tab=recognition-plus',
                    external: true,
                  },
                ].map((tab) => {
                  const isActive = location.pathname === tab.path;
                  return (
                    <button
                      key={tab.label}
                      type="button"
                      onClick={() => {
                        if (tab.external) {
                          window.location.href = `${window.location.origin}${tab.path}`;
                        } else {
                          navigate(tab.path);
                        }
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <SearchBar
            inputRef={searchInputRef}
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={submitSearch}
          />

          <div className="transition-all duration-500">
            {/* Quick nav gallery marquee cards */}
            <div
              className="relative"
              onMouseEnter={() => setIsMarqueeHovered(true)}
              onMouseLeave={() => setIsMarqueeHovered(false)}
            >
              <section ref={marqueeRef} className="py-8 md:py-12 overflow-x-auto scrollbar-hide">
                <style>{`
            @keyframes gallery-marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
                <div
                  className="flex gap-4 w-max"
                  style={{
                    animation: 'gallery-marquee 30s linear infinite',
                    animationPlayState: isMarqueePaused ? 'paused' : 'running',
                  }}
                >
                  {[...galleryImages, ...galleryImages].map((image, index) => (
                    <div
                      key={`${image.src}-${index}`}
                      data-marquee-card
                      onClick={() => navigate(image.route)}
                      className="group relative shrink-0 w-[85vw] sm:w-[65vw] md:w-[540px] aspect-video rounded-xl overflow-hidden cursor-pointer bg-slate-900"
                    >
                      <img
                        src={image.src}
                        alt={image.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/10" />

                      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                          {image.title}
                        </h3>
                        <p className="text-sm md:text-base text-slate-300">{image.subtitle}</p>
                      </div>

                      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 p-2 rounded-full bg-slate-900/50 text-white">
                        <Plane className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <button
                type="button"
                aria-label="Scroll left"
                onClick={() => scrollMarquee('left')}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <button
                type="button"
                aria-label="Scroll right"
                onClick={() => scrollMarquee('right')}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <PathwaysPromo />

            {/* Hub Grid */}
            <section className="px-4 py-12 md:py-20 relative z-10">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                      Jump into your pathway
                    </h2>
                    <p className="text-sm text-slate-400">
                      Pick a starting point and begin your aviation career.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/discover')}
                    className="hidden sm:flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Browse all <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {hubCards.slice(0, 3).map((card) => (
                    <motion.button
                      key={card.id}
                      variants={itemVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-50px' }}
                      onClick={() => handleCardClick(card.route)}
                      className="group relative overflow-hidden rounded-2xl aspect-[4/5] text-left focus:outline-none"
                    >
                      <img
                        src={card.image}
                        alt={card.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20 transition-opacity duration-300 group-hover:opacity-90" />

                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                          {card.title}
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed mb-5 line-clamp-3">
                          {card.description}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-white text-slate-950 transition-transform group-hover:translate-x-1">
                            Explore
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Mid-grid hero */}
                <div className="relative left-1/2 -translate-x-1/2 w-[100vw] my-8 md:my-12">
                  <AircraftShowcaseHero
                    showOverlay={false}
                    heroTitle="Discover all pathways"
                    heroCtaLabel="Explore"
                    onHeroCta={() => navigate('/discover')}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {hubCards.slice(3).map((card) => (
                    <motion.button
                      key={card.id}
                      variants={itemVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-50px' }}
                      onClick={() => handleCardClick(card.route)}
                      className="group relative overflow-hidden rounded-2xl aspect-[4/5] text-left focus:outline-none"
                    >
                      <img
                        src={card.image}
                        alt={card.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20 transition-opacity duration-300 group-hover:opacity-90" />

                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                          {card.title}
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed mb-5 line-clamp-3">
                          {card.description}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-white text-slate-950 transition-transform group-hover:translate-x-1">
                            Explore
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </section>

            {/* Recommended carousel — secondary, not major use */}
            <section className="px-4 pb-12 md:pb-20">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-bold text-white">Recommended for you</h2>
                    <p className="text-sm text-slate-400">
                      Curated pathways and opportunities from the network.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/discover')}
                    className="hidden sm:flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Explore all <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="h-[420px] md:h-[480px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/50">
                  <CareerPathwaysCarousel
                    airlinesCount={0}
                    setTab={handleSetTab}
                    safeRedirect={handleSafeRedirect}
                  />
                </div>
              </div>
            </section>

            {/* Partner CTA */}
            <section className="px-4 pb-16 md:pb-24">
              <div className="max-w-6xl mx-auto">
                <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800/50 p-8 md:p-12">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
                  <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="max-w-xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/60 text-xs font-medium text-slate-300 mb-4">
                        <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>For ATOs, flight schools & airlines</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                        Put your programs in front of the right pilots.
                      </h2>
                      <p className="text-sm md:text-base text-slate-400">
                        Partner with PilotRecognition to list type ratings, cadet programs, and
                        operator pathways where pilots are already searching.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                      <button
                        onClick={() => navigate('/enterprise')}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors"
                      >
                        Partner with us
                      </button>
                      <button
                        onClick={() => navigate('/get-started')}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl border border-slate-700 transition-colors"
                      >
                        Learn more
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </>
      ) : (
        <>
          {/* Search results hero — replaces the rotating hero */}
          <div className="relative w-full">
            <SearchHeroCarousel query={searchQuery} onClear={() => setSearchQuery('')} />
          </div>

          <SearchBar
            inputRef={searchInputRef}
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={submitSearch}
          />
        </>
      )}
    </div>
  );
};

export default CareerPathwaysHomePage;
