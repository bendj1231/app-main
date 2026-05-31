'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ArrowLeft, Users, Globe, Award, ChevronDown, ChevronLeft, TrendingDown } from 'lucide-react';

const regions = [
  { code: 'en-ph', name: 'Philippines', flag: '🇵🇭' },
  { code: 'en-us', name: 'United States', flag: '🇺🇸' },
  { code: 'en-gb', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'en-au', name: 'Australia', flag: '🇦🇺' },
  { code: 'en-ca', name: 'Canada', flag: '🇨🇦' },
  { code: 'en-sg', name: 'Singapore', flag: '🇸🇬' },
  { code: 'en-ae', name: 'UAE', flag: '🇦🇪' },
];

const navItems = [
  { label: 'About PSA', href: '/pilotshortage/about' },
  { label: 'Member Benefits', href: '/pilotshortage/benefits' },
  { label: 'Advocacy', href: '/pilotshortage/advocacy' },
  { label: 'UCF', href: '/pilotshortage/ucf' },
  { label: 'News', href: '/pilotshortage/news' },
];

const slides = [
  {
    id: 1,
    bgImage: '/AE.png',
    tagline: 'The End to the Shortage',
    headline: 'Connecting Pilots',
    headlineAccent: 'to the Industry',
    description: 'Join the Pilot Shortage Association — 2,000+ verified pilots, 7 countries, 100% free membership.',
    ctaPrimary: { text: 'Join PSA Today', href: '/pilotshortage/join' },
    ctaSecondary: { text: 'Learn How It Works', href: '/pilotshortage/about' },
    stats: [
      { icon: Users, value: '2,000+', label: 'Verified Pilots' },
      { icon: Globe, value: '7', label: 'Countries' },
      { icon: Award, value: '100%', label: 'Free Membership' },
    ],
  },
  {
    id: 2,
    bgImage: '/hourglasss.png',
    tagline: 'Official Statement',
    headline: 'The Shortage Is Real.',
    headlineAccent: 'But Not What They Tell You.',
    description: '$50,000 in training. 200 hours graduated. Then the 1,500-hour rule changed everything. A generation of pilots walked away.',
    ctaPrimary: { text: 'Read Our Mission', href: '/pilotshortage/about' },
    ctaSecondary: { text: 'Share Your Story', href: '/pilotshortage/advocacy' },
    stats: [
      { icon: Users, value: '8,000+', label: 'Graduate Yearly' },
      { icon: Globe, value: '2-3', label: 'Years Waiting' },
      { icon: Award, value: '$50K', label: 'Avg Training Cost' },
    ],
  },
  {
    id: 3,
    bgImage: '/box3.png',
    tagline: 'Pilot Satisfaction Survey',
    headline: 'Are You Satisfied',
    headlineAccent: 'With What Aviation Offers Today?',
    description: 'For 100 years, pilots built aviation into what it is. Today, the same industry chokes its own — 200-hour graduates left stranded, instructor queues stretching years, and $50,000 investments rotting on the ground. The sky was promised. The chokehold was delivered. Tell us your truth.',
    ctaPrimary: { text: 'Submit Your Answer', href: '/pilotshortage/advocacy' },
    ctaSecondary: { text: 'Tell Your Pilot Story', href: '/pilotshortage/advocacy' },
    stats: [
      { icon: Users, value: '500+', label: 'Stories Shared' },
      { icon: Globe, value: '100%', label: 'Anonymous' },
      { icon: Award, value: '0', label: 'Cost to Speak' },
    ],
  },
  {
    id: 4,
    bgImage: '/construct.png',
    tagline: 'Pilot Testimony',
    headline: '"I spent $50K on training.',
    headlineAccent: 'Now I drive Uber."',
    description: 'Anonymous stories from qualified pilots who left the industry — not because they couldn\'t fly, but because nobody told them where they fit.',
    ctaPrimary: { text: 'Share Your Story', href: '/pilotshortage/advocacy' },
    ctaSecondary: { text: 'Read Testimonies', href: '/pilotshortage/news' },
    stats: [
      { icon: Users, value: '500+', label: 'Stories Collected' },
      { icon: Globe, value: '47', label: 'Airlines Pressured' },
      { icon: Award, value: '12', label: 'Pathways Posted' },
    ],
  },
  {
    id: 5,
    bgImage: '/crew2.png',
    tagline: 'Pipeline Crisis',
    headline: '80% of Pilots Are Shifting',
    headlineAccent: 'Careers.',
    description: 'The biggest career shift in aviation history: 80% of trained pilots are leaving the flight deck. Not from lack of passion — because the placement pipeline is completely broken.',
    ctaPrimary: { text: 'Read the Report', href: '/pilotshortage/news' },
    ctaSecondary: { text: 'Share Your Story', href: '/pilotshortage/advocacy' },
    stats: [
      { icon: TrendingDown, value: '80%', label: 'Career Shift' },
      { icon: Users, value: '20%', label: 'Staying in Cockpit' },
      { icon: Award, value: '$50K', label: 'Avg Training Cost' },
    ],
  },
  {
    id: 6,
    bgImage: '/fallen.png',
    tagline: 'The Broken Promise',
    headline: 'Fallen Commercial Pilot Graduates.',
    headlineAccent: 'Stuck with No Direction.',
    description: 'Fallen graduates — promised an aviation career the day they enrolled. Walked out with a CPL, 200 hours, and a bill for $50,000. The instructor line stretches years. The airline calls never came. Their wings are real. The system is not.',
    ctaPrimary: { text: 'Share Your Story', href: '/pilotshortage/advocacy' },
    ctaSecondary: { text: 'See The Data', href: '/pilotshortage/news' },
    stats: [
      { icon: Users, value: '15,000+', label: 'Fallen Grads' },
      { icon: Globe, value: '2–4', label: 'Years Waiting' },
      { icon: Award, value: '$50K', label: 'Broken Promise' },
    ],
  },
];

export default function ConnectingPilotsHero() {
  const [currentRegion, setCurrentRegion] = useState(regions[0]);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const handleNext = useCallback(() => {
    nextSlide();
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, [nextSlide]);

  const handlePrev = useCallback(() => {
    prevSlide();
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, [prevSlide]);

  const goToSlide = (index: number) => {
    setActiveSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const slide = slides[activeSlide];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section — Netflix Style Carousel */}
      <div className="relative bg-white min-h-[90vh] flex items-start pt-16 pb-24 overflow-hidden">
        {/* Right-side background images */}
        <div className="absolute inset-0">
          {slides.map((s, idx) => (
            <div
              key={s.id}
              className={`absolute top-0 bottom-0 right-0 w-full lg:w-[50%] transition-opacity duration-700 ease-out ${
                idx === activeSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={s.bgImage}
                alt=""
                className="w-full h-full object-cover object-center"
              />
              {/* Baggage Handler Arrow Overlay — Slide 5 only */}
              {s.id === 5 && (
                <div className="absolute left-[2%] top-[45%] z-30 pointer-events-none">
                  <div className="flex flex-col items-start">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-900 font-bold text-xs px-3 py-1.5 rounded shadow-lg border border-gray-200 whitespace-nowrap mb-1">
                      Commercial Pilot
                    </span>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="ml-4">
                      <path
                        d="M8 4 Q 8 28, 28 32"
                        stroke="#ef4444"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <polygon
                        points="26,28 32,34 24,35"
                        fill="#ef4444"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* White background panel behind text area */}
        <div className="absolute top-0 bottom-0 left-0 w-full lg:w-[50%] bg-white z-10" />

        {/* Slide Content */}
        <div className="container mx-auto px-4 py-12 relative z-20">
          {/* Slide Transition Wrapper */}
          <div className="relative min-h-[60vh] flex items-center">
            <div
              key={slide.id}
              className="w-full transition-all duration-700 ease-out"
              style={{
                animation: 'fadeSlideIn 0.7s ease-out',
              }}
            >
              {/* Text Content */}
              <div className="max-w-2xl">
                {/* Tagline */}
                <p className="text-xs md:text-sm text-red-500 font-semibold uppercase tracking-wider mb-3">
                  {slide.tagline}
                </p>

                {/* Headline */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-snug mb-4 max-w-xl">
                  {slide.headline}
                  <span className="block text-red-500">{slide.headlineAccent}</span>
                </h1>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-600 max-w-lg mb-6 leading-relaxed">
                  {slide.description}
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <a
                    href={slide.ctaPrimary.href}
                    className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 text-sm"
                  >
                    {slide.ctaPrimary.text}
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <a
                    href={slide.ctaSecondary.href}
                    className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg border border-gray-300 transition-all text-sm"
                  >
                    {slide.ctaSecondary.text}
                  </a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 max-w-md">
                  {slide.stats.map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <div className="flex justify-center mb-2">
                        <stat.icon className="w-6 h-6 text-red-500" />
                      </div>
                      <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-[10px] text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-gray-200/80 hover:bg-gray-300 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 transition-all border border-gray-300/50"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-gray-200/80 hover:bg-gray-300 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 transition-all border border-gray-300/50"
          aria-label="Next slide"
        >
          <ArrowRight className="w-6 h-6" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === activeSlide
                  ? 'w-8 h-2 bg-red-500'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="absolute bottom-28 right-8 z-20 text-gray-400 text-sm font-mono">
          {activeSlide + 1} / {slides.length}
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Mission Statement Banner */}
      <section className="py-16 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">
              Our Mission
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-6">
              The Pilot Shortage Is Real.<br />
              <span className="text-red-500">But It Is Not What They Tell You.</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto mb-8">
              Pilots invest $50,000+ in training, then hit a wall. The 1,500-hour rule fractured the pathway from school to cockpit. The real shortage is not pilots — it is <span className="text-gray-900 font-semibold">transparency, recognition, and direction</span>. PSA builds the infrastructure that connects qualified pilots to the careers they trained for.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/pilotshortage/about"
                className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition-all"
              >
                Read Our Full Statement
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/pilotshortage/join"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-800 font-bold py-3 px-8 rounded-lg border border-gray-300 transition-all"
              >
                Join PSA Today
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Banner */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-400 uppercase tracking-widest font-semibold mb-10">
            Discover our Partners
          </p>
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <div className="text-center md:text-left" style={{ fontFamily: 'Georgia, serif' }}>
              <div className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                <span className="text-[#1e3a5f]">pilot</span>
                <span className="text-red-500">recognition</span>
                <span className="text-[#1e3a5f]">.com</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Verification provider with sovereign pilot identity verification and verified badge
              </p>
            </div>
            <div className="text-center md:text-left" style={{ fontFamily: 'Georgia, serif' }}>
              <div className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                <span className="text-[#1e3a5f]">pilot</span>
                <span className="text-gray-500">career</span>
                <span className="text-red-500">pathways</span>
                <span className="text-[#1e3a5f]">.com</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Discover airlines, manufacturers posted up-to-date requirements and job expectations
              </p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Our Mission Statement Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">
                Official Statement — Pilot Shortage Association
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] leading-snug">
                The Pilot Shortage Is Real.<br />
                But It Is Not What They Tell You.
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
              <div className="space-y-5 text-gray-600 text-base md:text-lg leading-relaxed">
                <p>
                  Pilots invest upwards of <span className="text-[#1e3a5f] font-semibold">$50,000 USD</span> in flight training,
                  graduating with approximately <span className="text-[#1e3a5f] font-semibold">200 flight hours</span> and a clear expectation:
                  build time, meet requirements, and enter commercial aviation.
                </p>

                <p>
                  Following the events of <span className="text-[#1e3a5f] font-semibold">Colgan Air Flight 3407 in 2013</span>, regulatory
                  responses elevated the experience threshold to 1,500 hours. A well-intentioned safety measure
                  created an unintended consequence: a generation of qualified graduates found themselves in a gap
                  with no bridge. Instructor positions backed up two to three years. The pathway from training to
                  commercial operation fractured — not through fault of airlines or schools, but through a systemic
                  industry failure to adapt placement and career guidance to the new reality.
                </p>

                <p>
                  The result: a <span className="text-[#1e3a5f] font-semibold">massive loss of talent</span>. Pilots who trained for the
                  flight deck moved to construction, logistics, and corporate roles — not because they lacked
                  ability, but because the industry as a whole could not tell them where their qualifications fit,
                  what hours actually counted, or which pathways led forward.
                </p>

                <p>
                  This is the real shortage. Not a lack of pilots. Not a failure of airlines. Not a failure of
                  training institutions. A systemic failure of
                  <span className="text-[#1e3a5f] font-semibold"> transparency</span>,
                  <span className="text-[#1e3a5f] font-semibold"> recognition</span>, and
                  <span className="text-[#1e3a5f] font-semibold"> direction</span> — the infrastructure that connects trained pilots to
                  the careers they prepared for.
                </p>

                <p className="text-[#1e3a5f] font-medium border-l-4 border-red-500 pl-5">
                  PSA works alongside airlines, operators, and training institutions to build that
                  infrastructure — across three integrated platforms that verify credentials, collect
                  testimony, and create clear, posted pathways so every qualified pilot can see where
                  they fit and every operator can find the crew they need.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <a
                  href="/pilotshortage/advocacy"
                  className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold text-sm transition-colors"
                >
                  Read our full policy position
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="/pilotshortage/join"
                  className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  Join PSA Today
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-6">
              The Pipeline Isn't Broken. It's Clogged.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              There is no pilot shortage. There is a recognition shortage. Thousands of qualified 
              pilots sit on the ground while airlines claim they can't find crew. The system 
              isn't connecting supply with demand—it's hiding it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-red-600">0</span>
              </div>
              <h3 className="font-bold text-[#1e3a5f] mb-2">The Rejected</h3>
              <p className="text-gray-600 text-sm">
                CPL holders with 200 hours, promised airline jobs that never materialize. 
                Lines to instructor positions backed up years.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-orange-600">1</span>
              </div>
              <h3 className="font-bold text-[#1e3a5f] mb-2">The Trapped</h3>
              <p className="text-gray-600 text-sm">
                Flight instructors with 5,000+ hours, 15 years experience. Stuck because 
                nobody's leaving the next floor.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">2+</span>
              </div>
              <h3 className="font-bold text-[#1e3a5f] mb-2">The Invisible</h3>
              <p className="text-gray-600 text-sm">
                Everyone fighting for recognition. Pilots don't know what's required. 
                Airlines can't find verified candidates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-[#1e3a5f]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              PSA Unclogs the Pipeline
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              We don't train pilots. We connect them. Verified credentials, transparent pathways, 
              direct access to operators who need crew now.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <div className="text-3xl mb-4">✓</div>
              <h3 className="font-bold text-white mb-2">Verify</h3>
              <p className="text-gray-300 text-sm">
                Blockchain-backed credentials. One verification, trusted everywhere.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <div className="text-3xl mb-4">→</div>
              <h3 className="font-bold text-white mb-2">Connect</h3>
              <p className="text-gray-300 text-sm">
                Direct pathways to airlines, cargo, charter, and emerging sectors.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <div className="text-3xl mb-4">↑</div>
              <h3 className="font-bold text-white mb-2">Advance</h3>
              <p className="text-gray-300 text-sm">
                Recognition Score follows you. Seniority that travels between employers.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <div className="text-3xl mb-4">✈</div>
              <h3 className="font-bold text-white mb-2">Fly</h3>
              <p className="text-gray-300 text-sm">
                Stop waiting. Start flying. The industry needs you now.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-6">
              Ready to End the Shortage?
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Join 2,000+ pilots already in the PSA network. Free membership. 
              Verified status. Direct connections to aviation operators worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/pilotshortage/join"
                className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg transition-all"
              >
                Join PSA Free
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/pilotshortage/benefits"
                className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 px-8 rounded-lg transition-all"
              >
                See Member Benefits
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a1628] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">
                <span className="text-white">pilot</span>
                <span className="text-red-500">shortage</span>
                <span className="text-gray-400">.org</span>
              </h4>
              <p className="text-gray-400 text-sm">
                Professional representation for aviation professionals worldwide.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">About</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/pilotshortage/about" className="hover:text-white">Our Mission</a></li>
                <li><a href="/pilotshortage/about#four-floors" className="hover:text-white">The Four Floors</a></li>
                <li><a href="/pilotshortage/about#who-we-are" className="hover:text-white">Who We Are</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Members</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/pilotshortage/join" className="hover:text-white">Join PSA</a></li>
                <li><a href="/pilotshortage/benefits" className="hover:text-white">Member Benefits</a></li>
                <li><a href="/pilotshortage/advocacy" className="hover:text-white">Advocacy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/pilotshortage/ucf" className="hover:text-white">UCF Framework</a></li>
                <li><a href="/pilotshortage/news" className="hover:text-white">News & Updates</a></li>
                <li><a href="/pilotshortage/advocacy" className="hover:text-white">Policy Positions</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2026 pilotshortage.org. All rights reserved. Run by pilots, for pilots.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
