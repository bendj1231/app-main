import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane, Truck, Building2, Briefcase, Cloud, Users,
  GraduationCap, MapPin, ArrowRight, Sparkles, CheckCircle,
  Unlock, Compass, Bell, TrendingUp, Star, Radar,
  Target, ChevronRight, BookOpen
} from 'lucide-react';
import type { TabId } from '../types';

interface PathwaysDiscoveryTabProps {
  setTab: (tab: TabId) => void;
  profile?: any;
}

const DISCOVERY_CATEGORIES = [
  {
    id: 'airlines',
    title: 'Airlines',
    subtitle: 'Commercial & cargo carriers',
    icon: Plane,
    gradient: 'from-blue-600 to-sky-400',
    description: 'Explore major airline cadet programs and first-officer pathways.',
  },
  {
    id: 'cargo',
    title: 'Cargo & Freight',
    subtitle: 'Freight, logistics, and postal operators',
    icon: Truck,
    gradient: 'from-indigo-600 to-violet-500',
    description: 'Heavy freight and long-haul cargo operations worldwide.',
  },
  {
    id: 'corporate',
    title: 'Corporate Aviation',
    subtitle: 'Business jets & VIP transport',
    icon: Building2,
    gradient: 'from-emerald-600 to-teal-400',
    description: 'Private and corporate aviation charter roles.',
  },
  {
    id: 'charter',
    title: 'Charter',
    subtitle: 'On-demand air charter operators',
    icon: Briefcase,
    gradient: 'from-amber-600 to-orange-400',
    description: 'On-demand and air-taxi charter opportunities.',
  },
  {
    id: 'helicopter',
    title: 'Helicopter',
    subtitle: 'Rotor-wing roles worldwide',
    icon: Cloud,
    gradient: 'from-rose-600 to-pink-400',
    description: 'Offshore, EMS, and utility helicopter operations.',
  },
  {
    id: 'instructor',
    title: 'Flight Instruction',
    subtitle: 'Become a flight instructor or examiner',
    icon: GraduationCap,
    gradient: 'from-cyan-600 to-blue-400',
    description: 'Flight training organizations and instructor roles.',
  },
  {
    id: 'community',
    title: 'Community & Volunteer',
    subtitle: 'Humanitarian and advocacy missions',
    icon: Users,
    gradient: 'from-lime-600 to-green-400',
    description: 'Humanitarian flying and volunteer pilot missions.',
  },
  {
    id: 'specialized',
    title: 'Specialized',
    subtitle: 'Seaplane, agricultural, and unique roles',
    icon: MapPin,
    gradient: 'from-fuchsia-600 to-purple-400',
    description: 'Agricultural, firefighting, and unique aviation roles.',
  },
];


export const PathwaysDiscoveryTab: React.FC<PathwaysDiscoveryTabProps> = ({
  setTab,
  profile,
}) => {
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const finishDiscovery = () => {
    try {
      localStorage.setItem('pathways_discovery_done', 'true');
    } catch {}
    setTab('pathways-directory' as TabId);
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const firstName = profile?.first_name || profile?.display_name?.split(' ')[0] || 'Pilot';

  return (
    <div
      className="relative min-h-screen flex flex-col items-center"
      style={{ background: '#0b0b0b' }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(30,58,95,0.4) 0%, transparent 60%)',
        }}
      />

      {/* Top step indicator */}
      <div className="relative z-10 w-full max-w-3xl pt-10 px-6">
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div
                className="flex items-center justify-center rounded-full transition-all duration-500"
                style={{
                  width: s === step ? 40 : 32,
                  height: s === step ? 40 : 32,
                  background:
                    s < step
                      ? '#16a34a'
                      : s === step
                        ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
                        : 'rgba(255,255,255,0.08)',
                  border:
                    s === step
                      ? '2px solid rgba(239,68,68,0.6)'
                      : '2px solid rgba(255,255,255,0.1)',
                  boxShadow:
                    s === step ? '0 0 24px rgba(220,38,38,0.3)' : 'none',
                }}
              >
                {s < step ? (
                  <CheckCircle size={16} className="text-white" />
                ) : (
                  <span
                    className="text-white font-black text-xs"
                    style={{ opacity: s === step ? 1 : 0.4 }}
                  >
                    {s}
                  </span>
                )}
              </div>
              {s < 3 && (
                <div
                  className="h-0.5 w-8 rounded-full transition-colors duration-500"
                  style={{
                    background:
                      s < step
                        ? '#16a34a'
                        : 'rgba(255,255,255,0.1)',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="relative z-10 w-full max-w-3xl px-6 pb-20">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' as const } }}
              exit={{ opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.3 } }}
              className="flex flex-col items-center text-center"
            >
              {/* Hero icon */}
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  boxShadow: '0 16px 48px rgba(220,38,38,0.3)',
                }}
              >
                <Unlock size={36} className="text-white" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
                Your Profile is Unlocked
              </h2>
              <p className="text-white/50 text-sm max-w-lg mb-10">
                Welcome to the next stage, {firstName}. You have completed your advanced
                profile and are now eligible for pathway discovery.
              </p>

              {/* Benefit cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-10">
                {[
                  {
                    icon: Sparkles,
                    title: 'Recognition Score Active',
                    desc: 'Your profile is now scored and visible to partner airlines.',
                  },
                  {
                    icon: Radar,
                    title: 'Pathway Eligibility',
                    desc: 'You can now submit interest in any pathway worldwide.',
                  },
                  {
                    icon: Bell,
                    title: 'Smart Matching',
                    desc: 'Get notified when new opportunities match your profile.',
                  },
                  {
                    icon: TrendingUp,
                    title: 'Track Progress',
                    desc: 'Monitor application status and credential verification.',
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="rounded-xl p-4 text-left"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          background: 'rgba(220,38,38,0.15)',
                        }}
                      >
                        <Icon size={16} className="text-red-400" />
                      </div>
                      <p className="text-white font-bold text-sm">{title}</p>
                    </div>
                    <p className="text-white/40 text-xs leading-relaxed pl-11">{desc}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black text-white transition-all hover:brightness-110"
                style={{
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  boxShadow: '0 8px 32px rgba(220,38,38,0.25)',
                }}
              >
                Discover How Pathways Work
                <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' as const } }}
              exit={{ opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.3 } }}
              className="flex flex-col items-center text-center"
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  boxShadow: '0 16px 48px rgba(37,99,235,0.3)',
                }}
              >
                <Compass size={36} className="text-white" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
                How Pathways Work
              </h2>
              <p className="text-white/50 text-sm max-w-lg mb-10">
                Three simple steps to land your next aviation role through Pilot Recognition.
              </p>

              {/* How it works steps */}
              <div className="w-full space-y-4 mb-10">
                {[
                  {
                    step: '01',
                    icon: Radar,
                    title: 'Browse the Directory',
                    desc: 'Explore 8 career categories from airlines to specialized aviation. Filter by license type, hours, and region.',
                  },
                  {
                    step: '02',
                    icon: Target,
                    title: 'Submit Interest',
                    desc: 'One-click expression of interest sends your verified profile directly to the pathway operator.',
                  },
                  {
                    step: '03',
                    icon: Star,
                    title: 'Track & Match',
                    desc: 'Follow your application inside your Inbox. Get matched with roles that fit your exact credentials.',
                  },
                ].map(({ step: num, icon: Icon, title, desc }) => (
                  <div
                    key={num}
                    className="flex items-start gap-4 rounded-xl p-5 text-left"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(37,99,235,0.15)' }}
                    >
                      <Icon size={18} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-blue-400 tracking-wider uppercase">
                          Step {num}
                        </span>
                      </div>
                      <p className="text-white font-bold text-sm mb-1">{title}</p>
                      <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black text-white transition-all hover:brightness-110"
                style={{
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  boxShadow: '0 8px 32px rgba(220,38,38,0.25)',
                }}
              >
                Choose What to Discover
                <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' as const } }}
              exit={{ opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.3 } }}
              className="flex flex-col items-center text-center"
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  background: 'linear-gradient(135deg, #16a34a, #15803d)',
                  boxShadow: '0 16px 48px rgba(22,163,74,0.3)',
                }}
              >
                <BookOpen size={36} className="text-white" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
                Choose Your Discovery
              </h2>
              <p className="text-white/50 text-sm max-w-lg mb-8">
                Select the aviation categories you want to explore. You can change these anytime.
              </p>

              {/* Category grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-8">
                {DISCOVERY_CATEGORIES.map(({ id, title, subtitle, icon: Icon, gradient, description }) => {
                  const selected = selectedCategories.includes(id);
                  return (
                    <button
                      key={id}
                      onClick={() => toggleCategory(id)}
                      className="relative rounded-xl p-4 text-left transition-all duration-200"
                      style={{
                        background: selected
                          ? 'rgba(22,163,74,0.1)'
                          : 'rgba(255,255,255,0.04)',
                        border: selected
                          ? '1px solid rgba(22,163,74,0.4)'
                          : '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${gradient}`}
                        >
                          <Icon size={18} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-white font-bold text-sm">{title}</p>
                            {selected && (
                              <CheckCircle size={16} className="text-emerald-400" />
                            )}
                          </div>
                          <p className="text-white/40 text-[10px] mt-0.5">{subtitle}</p>
                          <p className="text-white/30 text-[11px] mt-2 leading-relaxed">
                            {description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* CTA */}
              <button
                onClick={finishDiscovery}
                disabled={selectedCategories.length === 0}
                className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-black text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110"
                style={{
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  boxShadow: '0 8px 32px rgba(220,38,38,0.25)',
                }}
              >
                {selectedCategories.length > 0
                  ? `Discover ${selectedCategories.length} Selected`
                  : 'Select at least one category'}
                <ChevronRight size={16} />
              </button>

              <button
                onClick={finishDiscovery}
                className="mt-3 text-white/30 text-xs font-medium hover:text-white/60 transition-colors"
              >
                Skip for now →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
