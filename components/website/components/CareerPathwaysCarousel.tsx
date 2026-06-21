import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      description: 'Find approved type rating centres worldwide. Compare costs, locations, and airline partnerships.',
      cta: 'Search Centres',
      ctaAction: () => safeRedirect('/type-rating-search'),
      rightLabel: 'Training Network',
      rightText: '200+ Approved Centres',
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
      style={{ height: '420px', flexShrink: 0, borderRadius: 0 }}
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
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/70 to-slate-800/30" />

          <div className="absolute inset-0 flex items-stretch">
            <div className="relative w-[60%] h-full flex flex-col justify-center px-8 py-8">
              <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-xl" />
              <div className="absolute inset-0 border-r border-white/20" />
              <div className="absolute inset-0 border border-white/10 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-cyan-400 text-xs">&#8811;</span>
                  <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-[0.2em]">{slide.eyebrow}</p>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight leading-tight mb-3">
                  <span className="text-white">{slide.titleWhite} </span>
                  <span className="text-red-500">{slide.titleAccent}</span>
                </h2>
                <div className="w-8 h-[2px] mb-4" style={{ background: slide.accent }} />
                <p className="text-sm text-slate-300 max-w-sm leading-relaxed mb-6">
                  {slide.description}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); slide.ctaAction(); }}
                    className="px-5 py-2.5 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg hover:brightness-110"
                    style={{ background: slide.accent, boxShadow: `0 10px 24px ${slide.accent}40` }}
                  >
                    {slide.cta}
                  </button>
                  <span className="text-xs text-slate-400">{slide.rightText}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-0 bottom-0 flex items-center justify-center" style={{ left: '60%', width: '40%' }}>
            <div className="absolute inset-0 backdrop-blur-md bg-white/5" />
            <div className="relative z-10 flex flex-col items-center justify-center">
              <span className="text-xs font-black tracking-[0.25em] uppercase text-white/60 mb-2">{slide.eyebrow}</span>
              <span className="text-2xl font-extrabold text-white/90 uppercase tracking-wider">{slide.rightText}</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-600 z-20" />
      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white transition-all group-hover:brightness-110 border border-white/30 hover:border-white/50 hover:bg-white/5" style={{ borderRadius: 0 }}>
        Open <ArrowRight size={12} />
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              background: i === current ? 'white' : 'rgba(255,255,255,0.35)',
              transform: i === current ? 'scale(1.3)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CareerPathwaysCarousel;
