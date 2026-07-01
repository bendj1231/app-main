import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Volume2, VolumeX } from 'lucide-react';
import type { TabId } from '../types';

interface FoundationWelcomeTabProps {
  setTab: (tab: TabId) => void;
  onNavigate: (page: string) => void;
}

/* ─── Rockstar Games homepage style: card grid, minimal text, image-driven ─── */

const GameCard: React.FC<{
  image: string;
  title: React.ReactNode;
  subtitle?: string;
  price?: string;
  onClick?: () => void;
  className?: string;
}> = ({ image, title, subtitle, price, onClick, className = '' }) => (
  <motion.div
    className={`group relative cursor-pointer overflow-hidden ${className}`}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    onClick={onClick}
  >
    <div className="absolute inset-0">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    </div>
    <div
      className="absolute inset-0 transition-opacity duration-500"
      style={{
        background:
          'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.1) 100%)',
      }}
    />
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
    <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-8">
      {subtitle && (
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/60 mb-2">
          {subtitle}
        </p>
      )}
      <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight">
        {title}
      </h3>
      {price && <p className="text-sm font-bold text-sky-400 mt-2">{price}</p>}
    </div>
  </motion.div>
);

const SectionHeader: React.FC<{
  label: string;
  title: string;
  className?: string;
  light?: boolean;
}> = ({ label, title, className = '', light = false }) => (
  <div className={`mb-8 ${className}`}>
    <p
      className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${light ? 'text-black/40' : 'text-white/40'}`}
    >
      {label}
    </p>
    <h2
      className={`text-2xl md:text-3xl font-black tracking-tight ${light ? 'text-black' : 'text-white'}`}
    >
      {title}
    </h2>
  </div>
);

/* ─── Hero Carousel: full-bleed edge-to-edge slides ─── */

const slides = [
  {
    image: '/foundation.png',
    label: 'WingMentor Program',
    title: 'Help 50.\nBecome One.',
    subtitle: 'Build leadership through action. 50 hours of mentorship. Recognition+ priority status. Not waiting for permission.',
    cta: 'Learn More',
    link: '/wingmentor-learn-more',
  },
  {
    image: '/program1.png',
    label: 'Transition Program',
    title: 'Airline Ready\nIn 12 Weeks',
    subtitle: '9 core competencies. Airbus HINFACT. Atlas resume format. Internship placement.',
    cta: 'Enroll Now',
    link: 'transition-program',
  },
  {
    image: '/theintervew.png',
    label: 'EBT Video Scoring',
    title: 'Prove Your\nCompetency',
    subtitle: 'Recorded interview scored by cognitive alignment. Airlines view it directly.',
    cta: 'Enroll Now',
    link: 'ebt-scoring',
  },
  {
    image: '/instructor vs wing mentor -2.png',
    label: 'Mentorship Network',
    title: 'Help 50.\nBecome One.',
    subtitle: 'One-to-one CRM skills. Earn Recognition+ priority status through effort.',
    cta: 'Enroll Now',
    link: 'mentorship',
  },
];

const HeroCarousel: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[active];

  return (
    <section
      className="relative"
      style={{
        width: '100vw',
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        height: '75vh',
        minHeight: '550px',
      }}
    >
      {/* Slides — edge to edge, extended up to cover nav */}
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute transition-opacity duration-1000"
          style={{
            opacity: i === active ? 1 : 0,
            top: '-120px',
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <img src={s.image} alt={s.label} className="w-full h-full object-cover" />
        </div>
      ))}

      {/* Gradient overlay — also extended up */}
      <div
        className="absolute z-10"
        style={{
          top: '-120px',
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 30%, rgba(11,11,11,0.88) 85%, #0b0b0b 100%)',
        }}
      />

      {/* Slide content — logo left, text+CTAs to its right, bottom area */}
      <div className="relative z-20 h-full w-full px-6 md:px-12">
        <div className="max-w-7xl mx-auto w-full h-full relative flex items-end pb-24 md:pb-28">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-8"
            >
              {/* Logo — left */}
              <img
                src="/logo.png"
                alt="Pilot Recognition"
                className="hidden md:block w-40 h-40 lg:w-52 lg:h-52 object-contain flex-shrink-0"
                style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
              />

              {/* Text + CTAs — right of logo */}
              <div className="flex flex-col items-start text-left">
                {/* Label */}
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/70 mb-2">
                  {slide.label}
                </p>

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.95] mb-4 max-w-2xl whitespace-pre-line">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-sm md:text-base text-white/50 max-w-md mb-6 leading-relaxed">
                  {slide.subtitle}
                </p>

                {/* CTAs */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onNavigate(slide.link)}
                    className="px-8 py-3 bg-red-600 text-white text-xs font-black uppercase tracking-wider rounded-full hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    {slide.cta}
                  </button>
                  <button
                    onClick={() => onNavigate(slide.link)}
                    className="px-8 py-3 border-2 border-white text-white text-xs font-black uppercase tracking-wider rounded-full hover:bg-white/10 transition-colors"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Carousel dots — bottom center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="transition-all duration-300"
            style={{
              width: i === active ? '32px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: i === active ? '#fff' : 'rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </div>
    </section>
  );
};

export const FoundationWelcomeTab: React.FC<FoundationWelcomeTabProps> = ({
  setTab,
  onNavigate,
}) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [logoVisible, setLogoVisible] = React.useState(false);

  React.useEffect(() => {
    // Logo fade-in sequence
    const logoTimer = setTimeout(() => {
      setLogoVisible(true);
    }, 100);

    // Fade out loading screen after logo is visible
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(loadingTimer);
    };
  }, []);

  return (
    <>
      {/* Loading Screen */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="!fixed inset-0 z-[99999] flex items-center justify-center bg-black"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }}
          >
            <motion.img
              src="/logo.png"
              alt="Pilot Recognition"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={logoVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="w-48 h-48 md:w-64 md:h-64 object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && (
        <div className="relative z-10 flex flex-col w-full" style={{ background: '#0b0b0b' }}>
      {/* ═══════════════════════════════════════════════════
          HERO CAROUSEL — Full-bleed edge-to-edge, Rockstar style
      ═══════════════════════════════════════════════════ */}
      <HeroCarousel onNavigate={onNavigate} />

      {/* ═══════════════════════════════════════════════════
          NEWS GRID — Rockstar-style: large featured left, stacked cards right
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* LEFT — Featured card (large), image only */}
            <motion.div
              className="group cursor-pointer flex flex-col w-full"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
              onClick={() => onNavigate('foundational-program')}
            >
              <div className="relative overflow-hidden aspect-[4/3] w-full">
                <img
                  src="/foundationprogram.png"
                  alt="Foundation Program"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </motion.div>

            {/* RIGHT — Stack of news cards */}
            <div className="flex flex-col gap-3">
              {[
                {
                  img: '/program1.png',
                  label: 'Transition Program',
                  title: 'Airline Ready in 12 Weeks',
                  date: '$299',
                  link: 'transition-program',
                },
                {
                  img: '/theintervew.png',
                  label: 'EBT Video Scoring',
                  title: 'Prove Your Competency',
                  date: 'Included',
                  link: 'ebt-scoring',
                },
                {
                  img: '/instructor vs wing mentor -2.png',
                  label: 'Mentorship Network',
                  title: 'Help 50. Become One.',
                  date: 'Earned',
                  link: 'mentorship',
                },
                {
                  img: '/pilotcenter.png',
                  label: 'Recognition+',
                  title: 'Get Verified. Get Seen.',
                  date: '$120',
                  link: 'recognition-plus',
                },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  className="group flex gap-4 cursor-pointer bg-[#111] hover:bg-[#1a1a1a] transition-colors p-3"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => onNavigate(item.link)}
                >
                  {/* Thumbnail */}
                  <div className="w-24 h-16 md:w-32 md:h-20 flex-shrink-0 overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {/* Text */}
                  <div className="flex flex-col justify-center">
                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-sky-400 mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm font-black text-white leading-snug mb-1">{item.title}</p>
                    <p className="text-[10px] text-white/30">{item.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom quote — centered */}
          <div className="text-center mt-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">
              Foundation Program
            </p>
            <p className="text-lg md:text-xl font-black text-white tracking-tight">
              "Start Your Journey. From CPL to Cockpit."
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED STRIP — Video background only */}
      <section
        className="relative h-[60vh] md:h-[70vh] overflow-hidden"
        style={{
          width: '100vw',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="https://pub-7d91692145fd4db8ad180eaf345568f7.r2.dev/videos/FINAL.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }} />
        </div>

        {/* Mute toggle — bottom right */}
        <button
          onClick={() => {
            if (videoRef.current) {
              videoRef.current.muted = !videoRef.current.muted;
              setIsMuted(videoRef.current.muted);
            }
          }}
          className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider text-white/80 bg-black/40 border border-white/20 hover:bg-black/60 hover:text-white transition-all"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
      </section>

      {/* DESCRIPTION SECTION — The Pipeline */}
      <section
        className="relative py-16 md:py-24 px-6"
        style={{
          background: '#ffffff',
          width: '100vw',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-4">
              In Support Of
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight leading-[1] mb-6">
              pilot<span className="text-red-600">shortage</span>.org
            </h2>
            <p className="text-sm text-black/60 max-w-lg mx-auto leading-relaxed mb-8">
              The WingMentor Program is fully aligned with and in support of pilots undergoing a
              program aimed to educate and prepare them on leadership skills through self-initiated
              action. This involves 50 hours of helping fellow pilots, building the leadership
              mindset we need in aviation today. Not waiting for permission. Creating the solution.
            </p>
            <button
              onClick={() => setTab('pilot-shortage-support' as TabId)}
              className="text-xs font-black uppercase tracking-wider text-black/70 hover:text-black transition-colors flex items-center gap-2 mx-auto"
            >
              Learn More <ChevronRight size={14} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* SECOND CARD ROW — Two larger cards */}
      <section
        className="relative py-8 px-4 md:px-8"
        style={{
          background: '#ffffff',
          width: '100vw',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeader label="Pathways" title="Discover" light />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GameCard
              image="/pathwaysplatform.png"
              title={
                <>
                  pilotcareer<span className="text-red-500">pathways</span>.com
                </>
              }
              subtitle="Submit interests to Career Matching Pathways"
              onClick={() => setTab('pathways' as TabId)}
              className="aspect-[16/9]"
            />
            <GameCard
              image="/construct.png"
              title={
                <>
                  pilot<span className="text-red-500">shortage</span>.org
                </>
              }
              subtitle="Connecting pilots to the industry"
              onClick={() => setTab('pathways' as TabId)}
              className="aspect-[16/9]"
            />
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section
        className="relative py-16 md:py-24 px-6"
        style={{
          background: '#ffffff',
          width: '100vw',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 mb-4">
              Get Started
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight mb-6">
              Free to start.
            </h2>
            <p className="text-sm text-black/50 max-w-md mx-auto mb-8">
              Until certification of recognition. $49 for full recognition status. Scholarships
              available. Effort-based. Your EBT score shows on your live profile.
            </p>
            <button
              onClick={() => onNavigate('foundational-program')}
              className="px-10 py-4 bg-red-600 text-white text-xs font-black uppercase tracking-wider hover:bg-red-700 transition-colors"
            >
              Enroll Now
            </button>
          </motion.div>
        </div>
      </section>
    </div>
      )}
    </>
  );
};

export default FoundationWelcomeTab;
