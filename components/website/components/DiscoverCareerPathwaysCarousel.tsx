import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

type TabId = 'home' | 'profile' | 'wallet' | 'pathways' | 'programs' | 'airlines' | 'settings' | 'score' | 'dashboard' | 'cockpit';

interface Slide {
  id: string;
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  cta: string;
  ctaAction: () => void;
  image: string;
  accent: string;
  overlay?: string;
}

interface DiscoverCareerPathwaysCarouselProps {
  setTab: (tab: TabId) => void;
}

export const DiscoverCareerPathwaysCarousel: React.FC<DiscoverCareerPathwaysCarouselProps> = ({
  setTab,
}) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides: Slide[] = [
    {
      id: 'airline-pathways',
      eyebrow: 'Airline Pathways',
      title: 'DISCOVER CAREER',
      titleAccent: 'PATHWAYS',
      description: 'Explore structured pathways from CPL to airline cockpit. Compare requirements, timelines, and eligibility across carriers worldwide.',
      cta: 'Browse Pathways',
      ctaAction: () => setTab('pathways'),
      image: '/expect.png',
      accent: '#6366f1',
    },
    {
      id: 'cadet-programs',
      eyebrow: 'Cadet Programs',
      title: 'AIRLINE CADET',
      titleAccent: 'PROGRAMS',
      description: 'Zero-to-hero programs sponsored by major airlines. Full funding, guaranteed placement, and structured training from day one.',
      cta: 'View Cadet Gates',
      ctaAction: () => setTab('pathways'),
      image: '/images/airline-operations.png',
      accent: '#06b6d4',
    },
    {
      id: 'corporate-aviation',
      eyebrow: 'Corporate Aviation',
      title: 'PRIVATE & CORPORATE',
      titleAccent: 'AVIATION',
      description: 'Charter, VIP transport, and business jet careers. Higher flexibility, premium compensation, and direct operator relationships.',
      cta: 'Explore Corporate',
      ctaAction: () => setTab('pathways'),
      image: '/type.png',
      accent: '#f59e0b',
    },
    {
      id: 'flight-instructor',
      eyebrow: 'Flight Instruction',
      title: 'BECOME A FLIGHT',
      titleAccent: 'INSTRUCTOR',
      description: 'Build hours while teaching the next generation. ATO partnerships, instructor ratings, and pathway-to-airline programs.',
      cta: 'Find ATO Partners',
      ctaAction: () => setTab('pathways'),
      image: '/cessna.png',
      accent: '#10b981',
    },
  ];

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  const slide = slides[current];

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl cursor-pointer group"
      style={{ height: 140, flexShrink: 0 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="absolute inset-0 bg-cover transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url('${slide.image}')`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: slide.overlay || 'linear-gradient(to right, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.60) 40%, rgba(15,23,42,0.30) 70%, transparent 100%)',
            }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex items-center px-5">
            <div className="flex flex-col gap-1.5 max-w-[55%]">
              <p className="text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: slide.accent }}>
                {slide.eyebrow}
              </p>
              <h3 className="text-lg font-black text-white tracking-tight leading-tight">
                {slide.title} <span style={{ color: slide.accent }}>{slide.titleAccent}</span>
              </h3>
              <p className="text-[10px] text-white/60 leading-relaxed line-clamp-2">
                {slide.description}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); slide.ctaAction(); }}
                className="mt-1 flex items-center gap-1.5 text-[10px] font-black tracking-wider uppercase transition-all hover:gap-2.5"
                style={{ color: slide.accent }}
              >
                {slide.cta}
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            className="transition-all"
            style={{
              width: i === current ? 18 : 6,
              height: 6,
              borderRadius: 3,
              background: i === current ? slide.accent : 'rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={(e) => { e.stopPropagation(); setCurrent((prev) => (prev - 1 + slides.length) % slides.length); }}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      >
        <ChevronLeft size={14} className="text-white" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); setCurrent((prev) => (prev + 1) % slides.length); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      >
        <ChevronRight size={14} className="text-white" />
      </button>
    </div>
  );
};
