import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Award,
  ShieldCheck,
  Briefcase,
  DollarSign,
  Star,
  ArrowRight,
  Search,
  Building2,
  Plane,
} from 'lucide-react';
import { CareerPathwaysCarousel } from '@/components/website/components/CareerPathwaysCarousel';
import { safeRedirect } from '@/lib/url-validator';
import type { TabId } from '@/components/website/components/unified-platform/types';

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
}

const hubCards: HubCard[] = [
  {
    id: 'train',
    title: 'Train',
    description: 'Flight schools, instructor roles, and CPL/IR programs to build your foundation.',
    icon: GraduationCap,
    route: '/programs',
    color: '#10b981',
    bgGradient: 'from-emerald-500/10 to-emerald-600/5',
    shadowClass: 'hover:shadow-emerald-500/10',
  },
  {
    id: 'get-rated',
    title: 'Get Rated',
    description: 'Find type-rating centers, compare aircraft families, and book simulator time.',
    icon: Award,
    route: '/type-ratings',
    color: '#ef4444',
    bgGradient: 'from-red-500/10 to-red-600/5',
    shadowClass: 'hover:shadow-red-500/10',
  },
  {
    id: 'get-verified',
    title: 'Get Verified',
    description: 'Verify your license, medical, ratings, and logbook in one portable profile.',
    icon: ShieldCheck,
    route: '/get-started',
    color: '#6366f1',
    bgGradient: 'from-indigo-500/10 to-indigo-600/5',
    shadowClass: 'hover:shadow-indigo-500/10',
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
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const CareerPathwaysHomePage: React.FC<CareerPathwaysHomePageProps> = () => {
  const navigate = useNavigate();

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

  const featuredSearchTags = useMemo(
    () => ['A320 type rating', 'Cargo pilot', 'Flight instructor', 'Corporate aviation', 'eVTOL'],
    []
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Netflix-style Hero */}
      <section className="relative min-h-[75vh] md:min-h-[80vh] flex items-end overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/set-02-pilot-gap/expect.png)',
          }}
        />

        {/* Gradient overlays — left, bottom, and top */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 to-transparent" />

        <div className="relative w-full max-w-7xl mx-auto px-4 pb-12 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/70 border border-slate-700/60 text-xs font-medium text-slate-300 mb-5">
              <Plane className="w-3.5 h-3.5 text-indigo-400" />
              <span>Aviation Career GPS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-5 leading-[1.1]">
              From license
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                to airline.
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-300 max-w-xl mb-8 leading-relaxed">
              Discover training, type ratings, verified profiles, and operator pathways built for
              pilots — not recruiters.
            </p>

            {/* Search */}
            <div className="max-w-2xl mb-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-indigo-500/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-3 bg-slate-900/90 border border-slate-700 rounded-2xl px-4 py-3.5 shadow-2xl backdrop-blur-md">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search aircraft type, school, job, or pathway..."
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                    onClick={() => navigate('/type-ratings')}
                    readOnly
                  />
                  <button
                    onClick={() => navigate('/type-ratings')}
                    className="shrink-0 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Search tags */}
            <div className="flex flex-wrap gap-2">
              {featuredSearchTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate('/type-ratings')}
                  className="px-3 py-1.5 text-xs text-slate-300 bg-slate-900/70 border border-slate-700/60 rounded-full hover:text-white hover:border-slate-500 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hub Grid */}
      <section className="px-4 py-12 md:py-20 -mt-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Start your journey</h2>
              <p className="text-sm text-slate-400">
                Everything in the middle of your aviation career.
              </p>
            </div>
            <button
              onClick={() => navigate('/discover')}
              className="hidden sm:flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Browse all <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {hubCards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.button
                  key={card.id}
                  variants={itemVariants}
                  onClick={() => handleCardClick(card.route)}
                  className={`group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br ${card.bgGradient} p-6 text-left transition-all duration-300 hover:border-slate-600 hover:shadow-lg ${card.shadowClass}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800"
                      style={{ color: card.color }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-600 transition-all duration-300 group-hover:text-white group-hover:translate-x-1" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{card.description}</p>

                  <div
                    className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
                    style={{ backgroundColor: card.color }}
                  />
                </motion.button>
              );
            })}
          </motion.div>
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
                  Partner with PilotRecognition to list type ratings, cadet programs, and operator
                  pathways where pilots are already searching.
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
  );
};

export default CareerPathwaysHomePage;
