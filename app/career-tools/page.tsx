'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const CAREER_CATEGORIES = [
  {
    id: 'recognition-career-matches',
    icon: '⚡',
    label: 'Recognition Career Matches',
    color: 'blue',
    tagline: 'AI-powered matching system connecting pilots with ideal career pathways.',
    pain: "Pilots waste countless hours searching for suitable job opportunities across fragmented platforms, airline websites, and job boards. Most applications are rejected because pilots don't understand the specific requirements or their true fit for the role.",
    solution:
      'Our AI analyzes your complete profile — flight hours, type ratings, Recognition Score, location preferences, and career goals — to identify perfect matches. Get ranked compatibility scores and understand exactly where you stand for each opportunity.',
    benefits: [
      'Machine learning profile analysis',
      'Preference-based matching algorithms',
      'Smart career recommendations',
      'Continuous algorithm improvement',
      'Airline pathway matching',
      'Cargo operation opportunities',
      'Corporate aviation connections',
      'Charter company matching',
    ],
    pilots: [
      'Stop wasting time on unsuitable applications',
      'Know your exact compatibility before applying',
      'Discover hidden opportunities that fit you',
      'Get matched based on verified data',
    ],
  },
  {
    id: 'atlas-cv-builder',
    icon: '📄',
    label: 'ATLAS CV Builder',
    color: 'emerald',
    tagline: 'ATS-optimized aviation resume builder with industry-standard formatting.',
    pain: 'Most pilot CVs are rejected before human eyes see them because they fail ATS (Applicant Tracking Systems). Poor formatting, missing keywords, and non-standard layouts cause qualified pilots to be filtered out automatically.',
    solution:
      'The ATLAS CV Builder creates perfectly formatted, ATS-optimized resumes that pass automated screening. Built-in aviation keyword optimization, standardized formatting, and airline-specific templates ensure your CV reaches hiring managers.',
    benefits: [
      'ATS-optimized formatting standards',
      'Aviation keyword optimization',
      'Airline-specific CV templates',
      'Auto-import from your profile data',
      'One-click generation and export',
      'PDF and Word format options',
      'Real-time ATS compatibility scoring',
      'Professional layout customization',
    ],
    pilots: [
      'Ensure your CV reaches human recruiters',
      'Never worry about formatting rejection',
      'Auto-update with your latest achievements',
      'Stand out with professional presentation',
    ],
  },
  {
    id: 'interview-preparation',
    icon: '🎤',
    label: 'Interview Preparation',
    color: 'violet',
    tagline: 'Airline-specific interview training, mock assessments, and simulator prep.',
    pain: "Airline interviews are notoriously challenging — technical questions, competency assessments, group exercises, and simulator checks. Most pilots are underprepared and don't know what specific questions each airline asks, leading to costly rejections.",
    solution:
      'Comprehensive interview preparation including airline-specific question banks, video interview practice with AI feedback, technical quiz assessments, and simulator session prep. Know exactly what to expect before you walk in.',
    benefits: [
      'Airline-specific question databases',
      'Competency-based interview training',
      'Video practice with AI feedback',
      'Technical knowledge assessments',
      'Group exercise preparation',
      'Simulator check preparation',
      'HR and panel interview coaching',
      'Dress code and etiquette guides',
    ],
    pilots: [
      'Walk into interviews fully prepared',
      'Practice with real airline questions',
      'Get feedback on your performance',
      'Increase your success rate dramatically',
    ],
  },
  {
    id: 'career-pathway-planner',
    icon: '🗺️',
    label: 'Career Pathway Planner',
    color: 'amber',
    tagline: 'Visual roadmap from student pilot to airline command with step-by-step guidance.',
    pain: "Pilots often feel lost about their next career move. They don't know which ratings to pursue, what hours they need, or the optimal path from their current position to their dream airline job. Career planning is guesswork.",
    solution:
      'Interactive career roadmap showing exactly what you need at each stage. From student pilot → CPL → instructor → regional → major airline → command, with specific hour requirements, rating recommendations, and timeline estimates.',
    benefits: [
      'Visual career progression maps',
      'Hour requirements by stage',
      'Rating recommendation engine',
      'Timeline and cost estimates',
      'Multiple pathway options',
      'Regional to major airline routes',
      'Military to civilian conversion',
      'International career pathways',
    ],
    pilots: [
      'Know exactly what your next step should be',
      'Plan your career with confidence',
      'Understand time and cost investments',
      'Explore multiple pathway options',
    ],
  },
  {
    id: 'type-rating-advisor',
    icon: '✈️',
    label: 'Type Rating Advisor',
    color: 'cyan',
    tagline: 'Market demand analysis and ROI calculator for aircraft type ratings.',
    pain: "Type ratings cost tens of thousands and take weeks to complete, but pilots often choose based on hearsay rather than data. They don't know which ratings are in demand, which airlines are hiring for specific types, or the return on investment.",
    solution:
      'Data-driven type rating recommendations based on live market demand, airline hiring patterns, and your career goals. ROI calculator shows payback timelines, training provider comparisons, and job opportunity forecasts by aircraft type.',
    benefits: [
      'Live market demand analysis',
      'Airline hiring pattern tracking',
      'ROI calculator with payback estimates',
      'Training provider comparisons',
      'Cost vs opportunity analysis',
      'Job forecast by aircraft type',
      'Geographic demand mapping',
      'Seniority and fleet growth data',
    ],
    pilots: [
      'Invest in ratings with proven demand',
      'Calculate true return on investment',
      'Compare training providers easily',
      'Make data-driven career investments',
    ],
  },
  {
    id: 'airline-intelligence',
    icon: '🏢',
    label: 'Airline Intelligence',
    color: 'indigo',
    tagline: 'Comprehensive airline database with pay scales, fleet info, and pilot reviews.',
    pain: 'Researching airlines is time-consuming and information is scattered across forums, websites, and word-of-mouth. Pilots struggle to compare bases, fleets, pay scales, work rules, and quality of life across carriers.',
    solution:
      'Complete airline intelligence hub with verified data on fleet composition, base locations, pay scales by seniority, work rules, benefits, hiring status, and anonymous pilot reviews. Compare airlines side-by-side with objective data.',
    benefits: [
      'Comprehensive airline database',
      'Pay scale comparisons by seniority',
      'Fleet composition and growth plans',
      'Base location and commuting info',
      'Work rules and scheduling data',
      'Benefits and retirement packages',
      'Anonymous pilot reviews',
      'Hiring status and timeline updates',
    ],
    pilots: [
      'Research airlines with verified data',
      'Compare offers objectively',
      'Understand true quality of life',
      'Make informed career decisions',
    ],
  },
  {
    id: 'mentorship-network',
    icon: '👥',
    label: 'Mentorship Network',
    color: 'rose',
    tagline: 'Connect with experienced captains, career coaches, and industry veterans.',
    pain: 'New and transitioning pilots lack guidance from experienced professionals. They struggle to find mentors who understand their specific situation — whether upgrading to captain, changing airlines, or transitioning from military to civilian aviation.',
    solution:
      "Curated mentorship matching connecting you with experienced pilots who've walked your path. From captain upgrades and airline transitions to training advice and career coaching, get guidance from those who've succeeded before you.",
    benefits: [
      'Experienced captain mentors',
      'Airline transition specialists',
      'Military-to-civilian guides',
      'Career coaching sessions',
      'Type rating mentorship',
      'Command upgrade advisors',
      'Training provider recommendations',
      'Peer support communities',
    ],
    pilots: [
      "Learn from pilots who've succeeded",
      'Get personalized career guidance',
      'Navigate transitions with confidence',
      'Build valuable industry relationships',
    ],
  },
  {
    id: 'application-tracker',
    icon: '📋',
    label: 'Application Tracker',
    color: 'orange',
    tagline: 'Organize and track all your job applications, interviews, and follow-ups.',
    pain: 'Pilots applying to multiple airlines lose track of submissions, interview dates, document requirements, and follow-up timelines. Important opportunities slip through the cracks due to poor organization.',
    solution:
      'Centralized application management system tracking every submission, interview stage, required document, and follow-up date. Automated reminders ensure nothing falls through the cracks during your job search.',
    benefits: [
      'Centralized application database',
      'Interview stage tracking',
      'Document requirement checklists',
      'Follow-up date reminders',
      'Application status updates',
      'Response time analytics',
      'Interview preparation notes',
      'Outcome logging and insights',
    ],
    pilots: [
      'Never lose track of an application',
      'Stay organized across multiple airlines',
      'Never miss a follow-up deadline',
      'Learn from application outcomes',
    ],
  },
  {
    id: 'training-directory',
    icon: '🎓',
    label: 'Training Directory',
    color: 'teal',
    tagline: 'Verified flight schools, type rating centers, and simulator facilities.',
    pain: "Finding quality training providers is challenging — pilots rely on word-of-mouth and forums with conflicting opinions. They don't know which schools have the best pass rates, instructor quality, or airline relationships.",
    solution:
      'Comprehensive directory of verified training providers with reviews, pass rates, pricing, instructor credentials, and airline partnerships. Filter by location, aircraft type, cost, and training format to find your perfect match.',
    benefits: [
      'Verified training provider listings',
      'Student reviews and ratings',
      'Pass rate comparisons',
      'Pricing transparency',
      'Instructor credentials',
      'Airline partnership info',
      'Facility and equipment details',
      'Training format options',
    ],
    pilots: [
      'Find the best training for your needs',
      'Compare providers with real data',
      'Read reviews from fellow pilots',
      'Choose schools with airline connections',
    ],
  },
  {
    id: 'logbook-gap-analysis',
    icon: '📊',
    label: 'Logbook Gap Analysis',
    color: 'slate',
    tagline: "Check if your hours meet target airline requirements and identify what's missing.",
    pain: "Pilots often apply to airlines without knowing if they truly meet requirements. They waste time on applications destined for rejection because they're short on specific hour types, recency, or cross-country experience.",
    solution:
      "Automated analysis comparing your logbook against any airline's requirements. Instantly see where you meet, exceed, or fall short of requirements. Get specific guidance on what experience to build before applying.",
    benefits: [
      'Airline requirement comparison',
      'Hour type gap identification',
      'Recency requirement checking',
      'Cross-country experience analysis',
      'PIC and SIC hour breakdowns',
      'Night and instrument time checks',
      'Tailored improvement recommendations',
      'Application readiness scoring',
    ],
    pilots: [
      'Know if you qualify before applying',
      'Identify exactly what you need',
      'Build experience strategically',
      'Increase application success rates',
    ],
  },
];

const COLOR_CLASSES: Record<
  string,
  { eyebrow: string; badge: string; border: string; bg: string }
> = {
  blue: {
    eyebrow: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    border: 'border-blue-200',
    bg: 'bg-blue-50',
  },
  emerald: {
    eyebrow: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
  },
  violet: {
    eyebrow: 'text-violet-600',
    badge: 'bg-violet-100 text-violet-700 border-violet-200',
    border: 'border-violet-200',
    bg: 'bg-violet-50',
  },
  amber: {
    eyebrow: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    border: 'border-amber-200',
    bg: 'bg-amber-50',
  },
  cyan: {
    eyebrow: 'text-cyan-600',
    badge: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    border: 'border-cyan-200',
    bg: 'bg-cyan-50',
  },
  indigo: {
    eyebrow: 'text-indigo-600',
    badge: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    border: 'border-indigo-200',
    bg: 'bg-indigo-50',
  },
  rose: {
    eyebrow: 'text-rose-600',
    badge: 'bg-rose-100 text-rose-700 border-rose-200',
    border: 'border-rose-200',
    bg: 'bg-rose-50',
  },
  orange: {
    eyebrow: 'text-orange-600',
    badge: 'bg-orange-100 text-orange-700 border-orange-200',
    border: 'border-orange-200',
    bg: 'bg-orange-50',
  },
  teal: {
    eyebrow: 'text-teal-600',
    badge: 'bg-teal-100 text-teal-700 border-teal-200',
    border: 'border-teal-200',
    bg: 'bg-teal-50',
  },
  slate: {
    eyebrow: 'text-slate-600',
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    border: 'border-slate-200',
    bg: 'bg-slate-50',
  },
};

export default function CareerToolsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [scrolled, setScrolled] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const section = searchParams.get('section');
    if (section) {
      const element = document.getElementById(section);
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileNav(false);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ─── STICKY NAV ─── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm' : 'bg-white/80 backdrop-blur-sm'}`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="text-sm font-medium">Home</span>
              </button>
              <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
                <span className="text-xl font-bold tracking-tight">
                  <span className="text-slate-900">Pilot</span>
                  <span className="text-red-600">Recognition</span>
                </span>
                <span className="text-sm font-semibold text-slate-900 tracking-wide">
                  Career Tools
                </span>
              </button>
            </div>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {CAREER_CATEGORIES.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollTo(cat.id)}
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  {cat.label}
                </button>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => navigate('/become-member')}
                className="bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Access Career Tools
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
              onClick={() => setMobileNav(!mobileNav)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileNav ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileNav && (
          <div className="lg:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              {CAREER_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollTo(cat.id)}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-slate-50 rounded-lg"
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
              <div className="pt-2 border-t border-slate-100 mt-2">
                <button
                  onClick={() => navigate('/become-member')}
                  className="w-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-lg"
                >
                  Access Career Tools
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ─── HERO ─── */}
      <section className="relative bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-12">
          <div className="max-w-3xl">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors mb-4"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="text-sm font-medium">Back to Home</span>
            </button>
            <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">
              Professional Development
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 leading-tight">
              Career Tools
            </h1>
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-6 max-w-2xl">
              AI-powered career matching, interview preparation, pathway planning, and professional
              tools to advance your aviation career strategically.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => scrollTo('recognition-career-matches')}
                className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-xl transition-all"
              >
                Explore Tools
              </button>
              <button
                onClick={() => navigate('/become-member')}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-6 py-3 rounded-xl transition-all"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Stat strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-slate-200">
            <div>
              <p className="text-3xl font-bold text-slate-900 mb-1">10</p>
              <p className="text-sm text-slate-500">Career tools</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900 mb-1">AI</p>
              <p className="text-sm text-slate-500">Powered matching</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900 mb-1">Global</p>
              <p className="text-sm text-slate-500">Airline database</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900 mb-1">Verified</p>
              <p className="text-sm text-slate-500">Training directory</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORY GRID ─── */}
      <section className="py-16 px-6 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">
            Career Development
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            Complete Career Toolkit.
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mb-10">
            Ten comprehensive tools to plan, prepare, apply, and advance your aviation career with
            confidence.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CAREER_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollTo(cat.id)}
                className="group text-left bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 transition-all shadow-sm hover:shadow-md"
              >
                <div className="text-2xl mb-2">{cat.icon}</div>
                <h3 className="text-slate-900 font-semibold text-sm mb-1 group-hover:text-red-600 transition-colors">
                  {cat.label}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {cat.tagline.substring(0, 50)}...
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DEEP-DIVE SECTIONS ─── */}
      {CAREER_CATEGORIES.map((cat, idx) => (
        <section
          key={cat.id}
          id={cat.id}
          className={`py-16 px-6 border-b border-slate-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-10">
              {/* Left: intro */}
              <div className="lg:col-span-5">
                <p
                  className={`text-[11px] uppercase tracking-[0.25em] font-semibold mb-3 ${COLOR_CLASSES[cat.color]?.eyebrow ?? 'text-red-600'}`}
                >
                  {cat.label}
                </p>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-5 text-slate-900">
                  {cat.tagline}
                </h2>

                <div
                  className={`${COLOR_CLASSES[cat.color]?.bg ?? 'bg-red-50'} border ${COLOR_CLASSES[cat.color]?.border ?? 'border-red-200'} rounded-xl p-4 mb-5`}
                >
                  <p
                    className={`${COLOR_CLASSES[cat.color]?.eyebrow ?? 'text-red-600'} text-[10px] uppercase tracking-widest font-bold mb-2`}
                  >
                    The Challenge
                  </p>
                  <p className="text-slate-700 text-sm leading-relaxed">{cat.pain}</p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5">
                  <p className="text-emerald-700 text-[10px] uppercase tracking-widest font-bold mb-2">
                    Our Solution
                  </p>
                  <p className="text-slate-700 text-sm leading-relaxed">{cat.solution}</p>
                </div>
              </div>

              {/* Right: benefits */}
              <div className="lg:col-span-7">
                <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 font-semibold mb-4">
                  Key Benefits
                </p>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {cat.benefits.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-3"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${COLOR_CLASSES[cat.color]?.badge ?? 'bg-red-100 text-red-700'}`}
                      >
                        <span className="text-xs">✓</span>
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed">{b}</p>
                    </li>
                  ))}
                </ul>

                <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6 mt-6">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 font-semibold mb-4">
                    For Pilots
                  </p>
                  <ul className="space-y-3">
                    {cat.pilots.map((p, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{p}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ─── CTA SECTION ─── */}
      <section className="py-16 px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Advance Your Career Today</h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Join Pilot Recognition and access the complete career toolkit that helps you plan,
            prepare, and succeed in your aviation career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/become-member')}
              className="bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-4 rounded-xl transition-all"
            >
              Access Career Tools
            </button>
            <button
              onClick={() => navigate('/recognition-plus')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all"
            >
              View Recognition+
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-white border-t border-slate-200 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">
              <span className="text-slate-900">Pilot</span>
              <span className="text-red-600">Recognition</span>
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            &copy; 2026 PilotRecognition. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
