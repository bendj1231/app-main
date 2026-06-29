import React from 'react';
import { motion } from 'framer-motion';
import {
  Plane,
  Truck,
  Building2,
  Briefcase,
  Cloud,
  Users,
  GraduationCap,
  MapPin,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Radar,
} from 'lucide-react';
import ProfileImage from '@/components/ProfileImage';
import type { TabId } from '../types';

interface PathwaysWelcomeTabProps {
  setTab: (tab: TabId) => void;
  onNavigate: (page: string) => void;
  profile?: any;
}

const categoryCard = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
};

const DIRECTORY_CATEGORIES = [
  {
    id: 'airlines',
    title: 'Airlines',
    subtitle: 'Commercial & cargo carriers',
    icon: Plane,
    gradient: 'from-blue-600 to-sky-400',
    onClick: (setTab: (t: TabId) => void) => setTab('pathways' as TabId),
  },
  {
    id: 'cargo',
    title: 'Cargo & Freight',
    subtitle: 'Freight, logistics, and postal operators',
    icon: Truck,
    gradient: 'from-indigo-600 to-violet-500',
    onClick: (setTab: (t: TabId) => void) => setTab('pathways' as TabId),
  },
  {
    id: 'corporate',
    title: 'Corporate Aviation',
    subtitle: 'Business jets & VIP transport',
    icon: Building2,
    gradient: 'from-emerald-600 to-teal-400',
    onClick: (setTab: (t: TabId) => void) => setTab('pathways' as TabId),
  },
  {
    id: 'charter',
    title: 'Charter',
    subtitle: 'On-demand air charter operators',
    icon: Briefcase,
    gradient: 'from-amber-600 to-orange-400',
    onClick: (setTab: (t: TabId) => void) => setTab('pathways' as TabId),
  },
  {
    id: 'helicopter',
    title: 'Helicopter',
    subtitle: 'Rotor-wing roles worldwide',
    icon: Cloud,
    gradient: 'from-rose-600 to-pink-400',
    onClick: (setTab: (t: TabId) => void) => setTab('pathways' as TabId),
  },
  {
    id: 'instructor',
    title: 'Flight Instruction',
    subtitle: 'Become a flight instructor or examiner',
    icon: GraduationCap,
    gradient: 'from-cyan-600 to-blue-400',
    onClick: (setTab: (t: TabId) => void) => setTab('pathways' as TabId),
  },
  {
    id: 'community',
    title: 'Community & Volunteer',
    subtitle: 'Humanitarian and advocacy missions',
    icon: Users,
    gradient: 'from-lime-600 to-green-400',
    onClick: (setTab: (t: TabId) => void) => setTab('pathways' as TabId),
  },
  {
    id: 'specialized',
    title: 'Specialized',
    subtitle: 'Seaplane, agricultural, and unique roles',
    icon: MapPin,
    gradient: 'from-fuchsia-600 to-purple-400',
    onClick: (setTab: (t: TabId) => void) => setTab('pathways' as TabId),
  },
];

const FEATURED_PATHWAYS = [
  {
    id: 'airline-first-officer',
    title: 'Airline First Officer',
    subtitle: 'CPL → Type Rating → Line Training',
    image: '/foundation.png',
  },
  {
    id: 'cargo-captain',
    title: 'Cargo Captain',
    subtitle: 'Heavy freight and long-haul operations',
    image: '/program1.png',
  },
  {
    id: 'corporate-pilot',
    title: 'Corporate Pilot',
    subtitle: 'Business aviation and VIP charter',
    image: '/theintervew.png',
  },
];

export const PathwaysWelcomeTab: React.FC<PathwaysWelcomeTabProps> = ({
  setTab,
  onNavigate,
  profile,
}) => {
  return (
    <div className="relative z-10 flex flex-col w-full" style={{ background: '#0b0b0b' }}>
      {/* ═══════════════════════════════════════════════════
          HERO — Pathways directory intro
      ═══════════════════════════════════════════════════ */}
      <section
        className="relative"
        style={{
          width: '100vw',
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
          height: '55vh',
          minHeight: '420px',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            top: '-120px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
          }}
        />
        <div
          className="absolute z-10"
          style={{
            top: '-120px',
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 40%, rgba(11,11,11,0.9) 85%, #0b0b0b 100%)',
          }}
        />
        <div className="relative z-20 h-full w-full px-6 md:px-12">
          <div className="max-w-7xl mx-auto w-full h-full relative flex items-end pb-20 md:pb-24">
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between w-full gap-8 lg:gap-12">
              {/* Left — headline + CTAs */}
              <div className="flex flex-col items-start text-left">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/70 mb-2">
                  Pathway Directory
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.95] mb-4 max-w-2xl whitespace-pre-line">
                  Find Your Next
                  {'\n'}Cockpit
                </h1>
                <p className="text-sm md:text-base text-white/50 max-w-md mb-6 leading-relaxed">
                  Structured career pathways from CPL to airline cockpit. Compare requirements, timelines, and eligibility across carriers worldwide.
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setTab('pathways' as TabId)}
                    className="px-8 py-3 bg-red-600 text-white text-xs font-black uppercase tracking-wider rounded-full hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    Browse All Pathways
                  </button>
                  <button
                    onClick={() => onNavigate('about-verification')}
                    className="px-8 py-3 border-2 border-white text-white text-xs font-black uppercase tracking-wider rounded-full hover:bg-white/10 transition-colors"
                  >
                    How It Works
                  </button>
                </div>
              </div>

              {/* Right — compact pilot profile card */}
              {profile && (
                <div
                  className="w-full lg:w-80 flex-shrink-0 rounded-2xl p-5 overflow-hidden relative"
                  style={{
                    background: 'rgba(15,22,35,0.95)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05), 0 20px 40px rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div className="absolute inset-0 pointer-events-none opacity-30">
                    <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 20%, rgba(56,189,248,0.18), transparent 45%), radial-gradient(circle at 70% 80%, rgba(99,102,241,0.14), transparent 45%)' }} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative">
                        <ProfileImage
                          url={profile?.profile_image_url}
                          publicId={profile?.profile_image_public_id}
                          name={profile?.display_name || profile?.full_name || profile?.email || 'Pilot'}
                          size={56}
                          className="rounded-full border-2 border-[rgba(15,22,35,0.95)]"
                          fallbackClassName="rounded-full bg-blue-500 text-white text-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[rgba(15,22,35,0.95)]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-white truncate">{profile?.display_name || profile?.full_name || profile?.email?.split('@')[0] || 'Pilot'}</p>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                          {profile?.license_type || profile?.current_occupation || 'Pilot Profile'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <p className="text-base font-black text-white">{profile?.pic_hours || '0'}</p>
                        <p className="text-[8px] font-black text-white/30 uppercase tracking-wider mt-0.5">PIC</p>
                      </div>
                      <div className="text-center py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <p className="text-base font-black text-white">{profile?.total_flight_hours || profile?.total_hours || '0'}</p>
                        <p className="text-[8px] font-black text-white/30 uppercase tracking-wider mt-0.5">Total</p>
                      </div>
                      <div className="text-center py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <p className="text-base font-black text-white">{profile?.dual_hours || '0'}</p>
                        <p className="text-[8px] font-black text-white/30 uppercase tracking-wider mt-0.5">Dual</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
                        <TrendingUp size={10} className="text-emerald-400" />
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider">Recognition Active</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setTab('profile' as TabId)}
                      className="w-full py-2.5 text-[10px] font-black tracking-wider text-white rounded-xl transition-all hover:bg-blue-600"
                      style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.9), rgba(29,78,216,0.9))' }}
                    >
                      VIEW FULL PROFILE →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI chatbot icon + message */}
          <div className="absolute bottom-6 right-6 md:right-12 z-30 flex items-center gap-3">
            <div className="hidden sm:block text-[10px] font-bold text-white/90 bg-black/50 px-3 py-2 rounded-xl backdrop-blur-sm border border-white/10">
              Need help finding your pathway? Ask AI
            </div>
            <button
              onClick={() => setTab('advanced-profile' as TabId)}
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}
            >
              <Radar size={22} className="text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CATEGORY GRID — Directory cards
      ═══════════════════════════════════════════════════ */}
      <section
        className="relative py-8 px-4 md:px-8"
        style={{
          background: '#0b0b0b',
          width: '100vw',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-3">
              Directory
            </p>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Browse by Category
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {DIRECTORY_CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.button
                  key={cat.id}
                  custom={i}
                  variants={categoryCard}
                  initial="hidden"
                  animate="visible"
                  onClick={() => cat.onClick(setTab)}
                  className="group relative overflow-hidden rounded-xl p-5 text-left transition-transform duration-300 hover:scale-[1.02]"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 bg-gradient-to-br ${cat.gradient}`} />
                  <div className="relative z-10">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-gradient-to-br ${cat.gradient}`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <h3 className="text-sm md:text-base font-black text-white tracking-tight mb-1">
                      {cat.title}
                    </h3>
                    <p className="text-[10px] text-white/40 leading-snug">
                      {cat.subtitle}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-white/50 group-hover:text-white transition-colors">
                      Explore <ArrowRight size={12} />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURED PATHWAYS — Rockstar-style cards
      ═══════════════════════════════════════════════════ */}
      <section
        className="relative py-8 px-4 md:px-8 pb-16"
        style={{
          background: '#0b0b0b',
          width: '100vw',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-3">
              Featured
            </p>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Popular Pathways
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURED_PATHWAYS.map((pathway, i) => (
              <motion.div
                key={pathway.id}
                custom={i}
                variants={categoryCard}
                initial="hidden"
                animate="visible"
                className="group relative cursor-pointer overflow-hidden rounded-xl aspect-[4/3]"
                onClick={() => setTab('pathways' as TabId)}
              >
                <div className="absolute inset-0">
                  <img
                    src={pathway.image}
                    alt={pathway.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)',
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                <div className="relative z-10 flex flex-col justify-end h-full p-5 md:p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/60 mb-2">
                    Pathway
                  </p>
                  <h3 className="text-lg md:text-xl font-black text-white tracking-tight leading-tight">
                    {pathway.title}
                  </h3>
                  <p className="text-xs text-white/50 mt-1">{pathway.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          AI CAREER ALIGNMENT MOCKUP
      ═══════════════════════════════════════════════════ */}
      <section
        className="relative py-8 px-4 md:px-8 pb-16"
        style={{
          background: '#0b0b0b',
          width: '100vw',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-emerald-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
                AI Powered
              </p>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Career Alignment Matching
            </h2>
            <p className="text-sm text-white/50 mt-2 max-w-2xl">
              Mockup of the AI system that compares your live profile against airline requirements and surfaces your best-fit pathways.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Profile snapshot */}
            <div
              className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <h3 className="text-sm font-black text-white mb-4">Your Profile Snapshot</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">License</span>
                  <span className="text-white font-bold">{profile?.license_type || 'CPL'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">Total Hours</span>
                  <span className="text-white font-bold">{profile?.total_flight_hours || profile?.total_hours || '240'} hrs</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">Medical</span>
                  <span className="text-emerald-400 font-bold">Class 1 Valid</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">English</span>
                  <span className="text-white font-bold">ICAO Level 5</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">Last Flown</span>
                  <span className="text-white font-bold">{profile?.last_flown || '2 weeks ago'}</span>
                </div>
              </div>
            </div>

            {/* Match results */}
            <div
              className="lg:col-span-2 rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <h3 className="text-sm font-black text-white mb-4">Top Pathway Matches</h3>
              <div className="space-y-4">
                {[
                  { name: 'Regional Airline First Officer', score: 87, gaps: ['Type Rating', '500 hrs'] },
                  { name: 'Cargo First Officer', score: 72, gaps: ['ATP license'] },
                  { name: 'Corporate Pilot', score: 64, gaps: ['Multi-engine', 'Jet time'] },
                ].map((match) => (
                  <div key={match.name} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{match.name}</span>
                        <span className="text-xs font-black text-emerald-400">{match.score}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500"
                          style={{ width: `${match.score}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-white/40 mt-1">Gaps: {match.gaps.join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <h4 className="text-[11px] font-black text-white/70 uppercase tracking-wider mb-3">AI Recommendation</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Focus on completing your type rating and building 500 additional hours to reach a 95% match for Regional Airline First Officer roles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
