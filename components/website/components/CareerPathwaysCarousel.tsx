import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/shared/lib/supabase';

type TabId = 'home' | 'profile' | 'wallet' | 'pathways' | 'programs' | 'airlines' | 'manufacturers' | 'atlas-cv' | 'logbook' | 'events' | 'newsroom' | 'settings' | 'score' | 'dashboard' | 'market-intel' | 'data-provenance' | 'cockpit';

interface Slide {
  id: string;
  eyebrow: string;
  titleWhite: string;
  titleAccent: string;
  description: string;
  cta: string;
  ctaAction: () => void;
  rightLabel: string;
  rightText: string;
  image: string;
  accent: string;
}

interface CareerPathwaysCarouselProps {
  airlinesCount: number;
  setTab: (tab: TabId) => void;
  safeRedirect: (path: string) => void;
}

export const CareerPathwaysCarousel: React.FC<CareerPathwaysCarouselProps> = ({
  airlinesCount,
  setTab,
  safeRedirect,
}) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides: Slide[] = [
    {
      id: 'type-rating',
      eyebrow: 'Training',
      titleWhite: 'TYPE RATING',
      titleAccent: 'SEARCH',
      description: 'Find approved type rating centers worldwide. Compare costs, locations, and airline partnerships.',
      cta: 'Search Centers',
      ctaAction: () => safeRedirect('/type-rating-search'),
      rightLabel: 'Training Network',
      rightText: '200+ Approved Centers',
      image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1920&q=90',
      accent: '#6366f1',
    },
    {
      id: 'discover',
      eyebrow: 'Airlines',
      titleWhite: 'DISCOVER',
      titleAccent: 'EXPECTATIONS',
      description: 'Compare airline requirements, salaries, and fleet types before you apply.',
      cta: 'Explore Airlines',
      ctaAction: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const baseUrl = 'https://www.pilotcareerpathways.com/type-ratings';
        const url = session
          ? `${baseUrl}?access_token=${encodeURIComponent(session.access_token)}&refresh_token=${encodeURIComponent(session.refresh_token || '')}`
          : baseUrl;
        window.open(url, '_blank', 'noopener,noreferrer');
      },
      rightLabel: 'Airline Database',
      rightText: airlinesCount > 0 ? `${airlinesCount}+ Operators` : 'Coming Soon',
      image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=1920&q=90',
      accent: '#06b6d4',
    },
    {
      id: 'ai-match',
      eyebrow: 'Matching',
      titleWhite: 'AI-POWERED PILOT',
      titleAccent: 'PROFILE MATCH',
      description: 'Match your hours, ratings, and career goals to the right airline pathways instantly.',
      cta: 'Get Matched',
      ctaAction: () => setTab('pathways'),
      rightLabel: 'Smart Matching',
      rightText: 'Coming Soon',
      image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=1920&q=90',
      accent: '#10b981',
    },
  ];

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  const slide = slides[current];

  return (
    <div
      className="relative w-full overflow-hidden rounded-none cursor-pointer group"
      style={{ height: '420px', flexShrink: 0 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url('${slide.image}')` }}
          />
          {/* Seamless blur + fade overlay — no hard edge */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, rgba(2,6,23,0.88) 0%, rgba(2,6,23,0.65) 35%, rgba(2,6,23,0.25) 55%, rgba(2,6,23,0.05) 70%, transparent 100%)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              maskImage: 'linear-gradient(to right, black 0%, black 55%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, black 0%, black 55%, transparent 100%)',
            }}
          />

          {/* Left content panel */}
          <div className="absolute inset-0 flex items-stretch">
            <div className="relative w-[55%] h-full flex flex-col justify-center pl-14 pr-8 py-10">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-cyan-400 text-xs">&#8811;</span>
                  <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-[0.2em]">{slide.eyebrow}</p>
                </div>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-[1.05] mb-4">
                  <span className="text-white">{slide.titleWhite}</span>
                  <br />
                  <span className="text-red-500">{slide.titleAccent}</span>
                </h2>
                <p className="text-sm text-slate-300 max-w-md leading-relaxed mb-8">
                  {slide.description}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); slide.ctaAction(); }}
                    className="px-6 py-3 text-white text-xs font-black uppercase tracking-wider transition-all duration-200 hover:brightness-110 flex items-center justify-center"
                    style={{ background: slide.accent }}
                  >
                    {slide.cta}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); slide.ctaAction(); }}
                    className="px-6 py-3 text-white text-xs font-black uppercase tracking-wider border border-white/30 hover:bg-white/10 transition-all duration-200 flex items-center justify-center"
                  >
                    {slide.rightText}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </AnimatePresence>

      {/* Prev / Next arrows */}
      <button
        onClick={(e) => { e.stopPropagation(); if (current > 0) setCurrent((prev) => prev - 1); }}
        className={`absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all ${current > 0 ? 'hover:scale-110' : ''}`}
        style={{
          background: current > 0 ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.2)',
          backdropFilter: 'blur(4px)',
          border: current > 0 ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.08)',
          cursor: current > 0 ? 'pointer' : 'default',
          opacity: current > 0 ? 1 : 0.35,
        }}
        aria-label="Previous slide"
        disabled={current === 0}
      >
        <ChevronLeft size={20} className="text-white" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); if (current < slides.length - 1) setCurrent((prev) => prev + 1); }}
        className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all ${current < slides.length - 1 ? 'hover:scale-110' : ''}`}
        style={{
          background: current < slides.length - 1 ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.2)',
          backdropFilter: 'blur(4px)',
          border: current < slides.length - 1 ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.08)',
          cursor: current < slides.length - 1 ? 'pointer' : 'default',
          opacity: current < slides.length - 1 ? 1 : 0.35,
        }}
        aria-label="Next slide"
        disabled={current === slides.length - 1}
      >
        <ChevronRight size={20} className="text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            className="rounded-full transition-all"
            style={{
              width: i === current ? 20 : 8,
              height: 8,
              background: i === current ? 'white' : 'rgba(255,255,255,0.35)',
              borderRadius: 4,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CareerPathwaysCarousel;
