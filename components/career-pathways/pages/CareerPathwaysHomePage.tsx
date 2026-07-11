import React, { useEffect, useRef, useState } from 'react';
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
} from 'lucide-react';
import { CareerPathwaysCarousel } from '@/components/website/components/CareerPathwaysCarousel';
import { AircraftShowcaseHero } from '@/components/website/components/pilot-recognition/AircraftShowcaseHero';
import { safeRedirect } from '@/lib/url-validator';
import type { TabId } from '@/components/website/components/unified-platform/types';
import { aircraftTypeRatings } from '@/data/aircraft-manufacturers';
import { SearchSystem } from '@/components/career-pathways/search';

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

export const CareerPathwaysHomePage: React.FC<CareerPathwaysHomePageProps> = ({
  onLogin: _onLogin,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [heroMode, setHeroMode] = useState<HeroMode>('type-ratings');
  const [isMarqueeInView, setIsMarqueeInView] = useState(false);
  const [isMarqueeHovered, setIsMarqueeHovered] = useState(false);
  const [isMarqueeManualScroll, setIsMarqueeManualScroll] = useState(false);
  const isMarqueePaused = isMarqueeInView || isMarqueeHovered || isMarqueeManualScroll;
  const marqueeRef = useRef<HTMLElement>(null);

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
    const timeout = setTimeout(() => {
      setHeroMode((current) => {
        if (current === 'type-ratings') return 'discover';
        if (current === 'discover') return 'programs';
        if (current === 'programs') return 'expectations';
        return 'type-ratings';
      });
    }, slideDurations[heroMode]);
    return () => clearTimeout(timeout);
  }, [heroMode]);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
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
                    Compare requirements and align your career with operator expectations worldwide.
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

        <div className="relative z-20 px-4 py-4">
          <SearchSystem className="max-w-4xl mx-auto" />
        </div>

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
    </div>
  );
};

export default CareerPathwaysHomePage;
