import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Heart, Users, Award, Target, TrendingUp, AlertTriangle, Clock, Globe } from 'lucide-react';

interface PilotShortageSupportPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
  onLogin?: () => void;
  setTab?: (tab: string) => void;
  hideNav?: boolean;
}

const SectionStrip: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className = '', style }) => (
  <section className={`relative w-full overflow-hidden ${className}`} style={style}>
    {children}
  </section>
);

const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

export const PilotShortageSupportPage: React.FC<PilotShortageSupportPageProps> = ({
  onBack,
  onNavigate,
  setTab,
  hideNav,
}) => {
  const go = (tab: string) => (setTab ? setTab(tab) : onNavigate(tab));
  return (
    <div className="relative z-10 flex flex-col w-full">
      {/* ═══════════════════════════════════════════════════
          HERO — Full viewport, cinematic, massive type
      ═══════════════════════════════════════════════════ */}
      <section
        className="relative flex items-center justify-center overflow-visible"
        style={{
          minHeight: 'calc(92vh + 120px)',
          width: '100vw',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {/* Background image with dark overlay */}
        <img
          src="/images/set-02-pilot-gap/universal-pilot-gap.jpg"
          alt="Universal pilot gap"
          className="absolute w-full h-full object-cover"
          style={{ top: '-120px', left: 0, right: 0, bottom: 0 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(2,6,23,0.15) 0%, rgba(2,6,23,0.25) 25%, rgba(2,6,23,0.45) 45%, rgba(2,6,23,0.70) 70%, rgba(2,6,23,0.92) 100%)',
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400 mb-4">
              The Data
            </p>
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.85] mb-6">
              The Batch of
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)',
                }}
              >
                2015
              </span>
              <br />
              Is Still Waiting
            </h1>
            <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
              $50,000 investment. Sitting unused.
            </p>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 font-light tracking-wide max-w-2xl mx-auto mb-4 leading-relaxed">
              The pipeline is clogged. Graduates with 200 hours are promised airline jobs that never
              materialize. Instructor positions backed up 2-3 years. Your time, your money, your
              future — stuck in a system that doesn't move.
            </p>
            <p className="text-sm text-slate-400 max-w-xl mx-auto mb-6 leading-relaxed">
              pilotshortage.org tracks the real numbers. pilotrecognition.com gives you the tools to
              break through.
            </p>
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <p className="text-xs font-black uppercase tracking-wider text-red-400">
                Founding Pilots closes July 2026
              </p>
            </div>
            <a
              href="https://pilotshortage.org"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-12 py-4 text-sm font-black uppercase tracking-[0.15em] text-white transition-all hover:scale-105 flex items-center gap-3 mx-auto"
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                borderRadius: '4px',
              }}
            >
              Explore the Full Research
              <ChevronRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
            Explore
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-slate-500 to-transparent" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          STRIP 1 — The Numbers (Data Visualization)
      ═══════════════════════════════════════════════════ */}
      <SectionStrip className="py-20 md:py-28" style={{ background: '#020617' }}>
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-400 mb-4">
                The Reality
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.05] mb-6">
                The shortage is real.
                <br />
                The numbers prove it.
              </h2>
              <p className="text-sm text-slate-400 max-w-xl mx-auto">
                Don't apply blindly. Know where you fit. See the data that airlines use.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: AlertTriangle,
                value: '2-3 Years',
                label: 'CFI Pipeline Wait',
                desc: 'Skip the instructor line. Get pulled by airlines first.',
                color: 'text-red-400',
                bg: 'from-red-500/10 to-red-500/5',
              },
              {
                icon: Clock,
                value: '200 Hours',
                label: 'Graduate Deadlock',
                desc: 'Don\'t wait for instructor slots. Fast-track to airlines.',
                color: 'text-amber-400',
                bg: 'from-amber-500/10 to-amber-500/5',
              },
              {
                icon: TrendingUp,
                value: '$50K',
                label: 'Sitting Unused',
                desc: 'Your investment. Your time. Your future. Don\'t waste it.',
                color: 'text-orange-400',
                bg: 'from-orange-500/10 to-orange-500/5',
              },
              {
                icon: Globe,
                value: 'Global',
                label: 'Regional Gaps',
                desc: 'Shortages vary by country. Know where you fit.',
                color: 'text-blue-400',
                bg: 'from-blue-500/10 to-blue-500/5',
              },
            ].map((stat, i) => (
              <FadeIn key={i} delay={0.1 * (i + 1)}>
                <div
                  className={`relative p-8 rounded-sm border border-white/5 hover:border-white/10 transition-all overflow-hidden group`}
                  style={{
                    background: `linear-gradient(135deg, ${stat.bg}, transparent)`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <stat.icon className={`w-10 h-10 ${stat.color} mb-4 relative z-10`} />
                  <p className="text-5xl font-black text-white mb-2 relative z-10">{stat.value}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 relative z-10">
                    {stat.label}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed relative z-10">{stat.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.5}>
            <div
              className="relative p-8 rounded-sm border border-white/5 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0a0f1e 0%, #020617 100%)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-50" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), transparent)' }}
                  >
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white mb-2">Floor 0: Graduates Stuck</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      200 hours, promised airline jobs that never materialize. Instructor line backed
                      up 2-3 years. Batch of 2015 still waiting. Don't be next.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), transparent)' }}
                  >
                    <Clock className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white mb-2">Floor 1: Instructors Trapped</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      5,000-6,000 hours, 15 years experience. Stuck because nobody's leaving Floor 2.
                      Want recognition. Get Recognition+ status. Skip the line.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), transparent)' }}
                  >
                    <TrendingUp className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white mb-2">Floor 2: The Recognition Gap</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      The collapse point. Everyone fighting for recognition, pathways, expectations.
                      Industry lacks communication. Pilots fly blind. Get verified. Get pulled.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </SectionStrip>

      {/* ═══════════════════════════════════════════════════
          STRIP 2 — What We Track (The Data Standard)
      ═══════════════════════════════════════════════════ */}
      <SectionStrip className="py-20 md:py-28" style={{ background: '#0a0f1e' }}>
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-400 mb-4">
                The Data Standard
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.05] mb-6">
                What pilotshortage.org tracks
              </h2>
              <p className="text-base text-slate-400 leading-relaxed max-w-3xl mx-auto">
                The data standard that defines employment status categories, region codes, and hour
                thresholds across the aviation industry. This is the taxonomy that makes the problem
                measurable.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Regional Shortage Data',
                desc: 'Country-by-country shortage metrics. Not global averages. Real numbers.',
                icon: Globe,
                color: 'from-blue-500/10 to-blue-500/5',
                iconColor: 'text-blue-400',
              },
              {
                title: 'Graduate Unemployment Rates',
                desc: '200-hour graduates who can\'t get hired. The bottleneck quantified.',
                icon: AlertTriangle,
                color: 'from-red-500/10 to-red-500/5',
                iconColor: 'text-red-400',
              },
              {
                title: 'CFI Pipeline Wait Times',
                desc: 'Hour build bottlenecks. Instructor position backlogs measured in years.',
                icon: Clock,
                color: 'from-amber-500/10 to-amber-500/5',
                iconColor: 'text-amber-400',
              },
              {
                title: 'Airline Hiring Requirements',
                desc: 'Carrier-specific thresholds. What each airline actually requires.',
                icon: TrendingUp,
                color: 'from-green-500/10 to-green-500/5',
                iconColor: 'text-green-400',
              },
              {
                title: 'Live Pathway Openings',
                desc: 'Real-time pathway cards from partner airlines. Not job listings.',
                icon: ArrowRight,
                color: 'from-purple-500/10 to-purple-500/5',
                iconColor: 'text-purple-400',
              },
              {
                title: 'Verified Profile Matching',
                desc: 'Match pilots to pathways based on verified credentials, not self-reported data.',
                icon: Users,
                color: 'from-cyan-500/10 to-cyan-500/5',
                iconColor: 'text-cyan-400',
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={0.1 * (i + 1)}>
                <div
                  className={`relative p-6 rounded-sm border border-white/5 hover:border-white/10 transition-all overflow-hidden group`}
                  style={{
                    background: `linear-gradient(135deg, ${item.color}, transparent)`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div
                    className={`p-3 rounded-lg mb-4 inline-block ${item.iconColor}`}
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)',
                    }}
                  >
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-black text-white mb-2 relative z-10">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed relative z-10">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </SectionStrip>

      {/* ═══════════════════════════════════════════════════
          STRIP 3 — From Data To Action (The Bridge)
      ═══════════════════════════════════════════════════ */}
      <SectionStrip className="py-20 md:py-28" style={{ background: '#020617' }}>
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-400 mb-4">
              The Bridge
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.05] mb-6">
              From data to your career.
            </h2>
            <p className="text-base text-slate-400 leading-relaxed max-w-2xl mx-auto mb-14">
              pilotshortage.org shows the gap. pilotrecognition.com closes it. Here's how.
            </p>
          </FadeIn>

          <div className="space-y-4">
            {[
              {
                topic: 'Pilot Shortage by Region 2026',
                bridge: 'See which airlines are actively hiring in your region',
                action: 'pathways',
                icon: Globe,
                color: 'from-blue-500/10 to-blue-500/5',
                iconColor: 'text-blue-400',
              },
              {
                topic: "Why 200-Hour Graduates Can't Get Hired",
                bridge: 'Find your pathway from graduate to First Officer',
                action: 'programs',
                icon: AlertTriangle,
                color: 'from-red-500/10 to-red-500/5',
                iconColor: 'text-red-400',
              },
              {
                topic: 'CFI Pipeline Backed Up 2-3 Years',
                bridge: 'Skip the instructor line. Get pulled by airlines first.',
                action: 'recognition-plus-tab',
                icon: Clock,
                color: 'from-amber-500/10 to-amber-500/5',
                iconColor: 'text-amber-400',
              },
              {
                topic: 'Airline Hiring Requirements by Carrier',
                bridge: 'Match your profile to live pathway cards. Stop applying blindly.',
                action: 'profile',
                icon: TrendingUp,
                color: 'from-green-500/10 to-green-500/5',
                iconColor: 'text-green-400',
              },
            ].map((row, i) => (
              <FadeIn key={i} delay={0.1 * (i + 1)}>
                <div
                  className={`group flex flex-col sm:flex-row sm:items-center gap-4 p-6 border border-white/5 hover:border-white/10 transition-all cursor-pointer rounded-sm overflow-hidden`}
                  style={{
                    background: `linear-gradient(135deg, ${row.color}, transparent)`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-3 flex-1 relative z-10">
                    <div
                      className={`p-2 rounded-lg ${row.iconColor}`}
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)',
                      }}
                    >
                      <row.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 group-hover:text-slate-400 uppercase tracking-wider mb-1">
                        The data
                      </p>
                      <p className="text-base font-black text-white group-hover:text-red-400 transition-colors">
                        {row.topic}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-700 group-hover:text-red-400 shrink-0 hidden sm:block transition-colors relative z-10" />
                  <div className="flex-1 relative z-10">
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">
                      Your action
                    </p>
                    <p className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                      {row.bridge} →
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </SectionStrip>

      {/* ═══════════════════════════════════════════════════
          STRIP 4 — The Solution (WingMentor Program)
      ═══════════════════════════════════════════════════ */}
      <SectionStrip className="py-20 md:py-28" style={{ background: '#0a0f1e' }}>
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-400 mb-4">
                The Solution
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.05] mb-6">
                The WingMentor Program
              </h2>
              <p className="text-base text-slate-400 leading-relaxed max-w-3xl mx-auto">
                Leadership through action. 50 hours of self-initiated mentorship. Building the
                leadership mindset aviation needs today. From awareness to action.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Heart, value: '50', label: 'Hours of Giving', color: 'from-red-500/10 to-red-500/5', iconColor: 'text-red-400' },
              { icon: Users, value: '50+', label: 'Pilots Helped', color: 'from-purple-500/10 to-purple-500/5', iconColor: 'text-purple-400' },
              { icon: Award, value: '1', label: 'Recognition+ Status', color: 'from-amber-500/10 to-amber-500/5', iconColor: 'text-amber-400' },
            ].map((stat, i) => (
              <FadeIn key={i} delay={0.1 * (i + 1)}>
                <div
                  className={`relative p-8 text-center rounded-sm border border-white/5 hover:border-white/10 transition-all overflow-hidden group`}
                  style={{
                    background: `linear-gradient(135deg, ${stat.color}, transparent)`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div
                    className={`p-4 rounded-lg inline-block mb-4 ${stat.iconColor}`}
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)',
                    }}
                  >
                    <stat.icon className="w-10 h-10" />
                  </div>
                  <p className="text-5xl font-black text-white mb-2 relative z-10">{stat.value}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 relative z-10">
                    {stat.label}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
            <div
              className="relative p-8 rounded-sm border border-white/5 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #020617 0%, #0a0f1e 100%)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-50" />
              <div className="relative z-10">
                <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4">
                  The Mission
                </p>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  The WingMentor Program is fully aligned with and in support of pilots undergoing a
                  program aimed to educate and prepare them on leadership skills through self-initiated
                  action. This involves 50 hours of helping fellow pilots, building the leadership
                  mindset we need in aviation today.
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Not waiting for permission. Creating the solution.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </SectionStrip>

      {/* ═══════════════════════════════════════════════════
          STRIP 5 — How It Works
      ═══════════════════════════════════════════════════ */}
      <SectionStrip className="py-20 md:py-28" style={{ background: '#020617' }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-400 mb-4">
              How It Works
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.05] mb-14">
              Four steps to leadership.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Commit',
                desc: 'You commit to 50 hours of mentorship. Not for pay. Not for credit. For the industry.',
                color: 'from-red-500/10 to-red-500/5',
                iconColor: 'text-red-400',
              },
              {
                step: '02',
                title: 'Act',
                desc: 'You help fellow pilots with logbook reviews, interview prep, pathway guidance.',
                color: 'from-amber-500/10 to-amber-500/5',
                iconColor: 'text-amber-400',
              },
              {
                step: '03',
                title: 'Prove',
                desc: 'Your hours are verified. Your leadership is documented. Your Recognition+ status is earned.',
                color: 'from-green-500/10 to-green-500/5',
                iconColor: 'text-green-400',
              },
              {
                step: '04',
                title: 'Lead',
                desc: 'Airlines see a pilot who doesn\'t just fly — they lead. That\'s the pilot they hire.',
                color: 'from-blue-500/10 to-blue-500/5',
                iconColor: 'text-blue-400',
              },
            ].map((s, i) => (
              <FadeIn key={s.step} delay={0.1 * (i + 1)}>
                <div
                  className={`relative p-6 text-left rounded-sm border border-white/5 hover:border-white/10 transition-all overflow-hidden group`}
                  style={{
                    background: `linear-gradient(135deg, ${s.color}, transparent)`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-6xl font-black text-white/5 absolute -top-4 left-0 select-none">
                    {s.step}
                  </span>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={`p-2 rounded-lg ${s.iconColor}`}
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)',
                        }}
                      >
                        <Target className="w-4 h-4" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400">
                        Step {s.step}
                      </p>
                    </div>
                    <h3 className="text-lg font-black text-white mb-2">{s.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </SectionStrip>

      {/* ═══════════════════════════════════════════════════
          STRIP 6 — CTA
      ═══════════════════════════════════════════════════ */}
      <SectionStrip
        className="py-20 md:py-24 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0a0f1e 0%, #020617 100%)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_70%)]" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <p className="text-xs font-black uppercase tracking-wider text-red-400">
                47 spots remaining
              </p>
            </div>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              The pipeline is clogged. You can break through. Don't miss the founding cohort.
            </p>
            <button
              onClick={() => onNavigate('foundational-program')}
              className="group px-12 py-4 text-sm font-black uppercase tracking-[0.15em] text-white transition-all hover:scale-105 flex items-center gap-3 mx-auto relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                borderRadius: '4px',
                boxShadow: '0 0 40px rgba(239, 68, 68, 0.3)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              Join Founding Pilots
              <ChevronRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
            <p className="text-xs text-slate-500 mt-4">
              First 100 free verification through Veremark partnership
            </p>
          </FadeIn>
        </div>
      </SectionStrip>

      {/* ═══════════════════════════════════════════════════
          STRIP 7 — Back Button
      ═══════════════════════════════════════════════════ */}
      <SectionStrip
        className="py-16 md:py-20"
        style={{ background: '#020617', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <div className="flex justify-center">
              <button
                onClick={onBack}
                className="group flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10 hover:border-white/20 rounded-sm"
              >
                Back to Home
              </button>
            </div>
          </FadeIn>
        </div>
      </SectionStrip>
    </div>
  );
};
