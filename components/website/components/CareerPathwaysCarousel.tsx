import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/shared/supabase';

type TabId = 'home' | 'profile' | 'wallet' | 'pathways' | 'programs' | 'airlines' | 'manufacturers' | 'atlas-cv' | 'logbook' | 'events' | 'newsroom' | 'settings' | 'score' | 'dashboard' | 'market-intel' | 'data-provenance' | 'cockpit';

interface Slide {
  id: string;
  eyebrow: string;
  titleWhite: string;
  titleAccent: string;
  titleSuffix?: string;
  subtitleWhite?: string;
  subtitleAccent?: string;
  subtitleSuffix?: string;
  description: string;
  cta: string;
  ctaAction: () => void;
  rightLabel: string;
  rightText: string;
  image: string;
  rightImage?: string;
  accent: string;
  bgPosition?: string;
  overlay?: string;
  textDark?: boolean;
  smallTitle?: boolean;
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
      id: 'airline-pathways',
      eyebrow: 'Airline Pathways',
      titleWhite: 'DISCOVER CAREER',
      titleAccent: 'PATHWAYS',
      description: 'Explore structured pathways from CPL to airline cockpit. Compare requirements, timelines, and eligibility across carriers worldwide.',
      cta: 'Browse Pathways',
      ctaAction: () => {
        localStorage.setItem('careerpathways_mode', 'true');
        window.location.href = `${window.location.origin}/?product=careerpathways`;
      },
      rightLabel: 'Pathway Database',
      rightText: 'Explore',
      image: '/expect.png',
      accent: '#6366f1',
    },
    {
      id: 'cadet-programs',
      eyebrow: 'Cadet Programs',
      titleWhite: 'AIRLINE CADET',
      titleAccent: 'PROGRAMS',
      description: 'Zero-to-hero programs sponsored by major airlines. Full funding, guaranteed placement, and structured training from day one.',
      cta: 'View Cadet Gates',
      ctaAction: () => {
        localStorage.setItem('careerpathways_mode', 'true');
        window.location.href = `${window.location.origin}/?product=careerpathways`;
      },
      rightLabel: 'Cadet Database',
      rightText: 'Explore',
      image: '/images/airline-operations.png',
      accent: '#06b6d4',
    },
    {
      id: 'corporate-aviation',
      eyebrow: 'Corporate Aviation',
      titleWhite: 'PRIVATE & CORPORATE',
      titleAccent: 'AVIATION',
      description: 'Charter, VIP transport, and business jet careers. Higher flexibility, premium compensation, and direct operator relationships.',
      cta: 'Explore Corporate',
      ctaAction: () => {
        localStorage.setItem('careerpathways_mode', 'true');
        window.location.href = `${window.location.origin}/?product=careerpathways`;
      },
      rightLabel: 'Corporate Ops',
      rightText: 'Explore',
      image: '/type.png',
      accent: '#f59e0b',
    },
    {
      id: 'flight-instructor',
      eyebrow: 'Flight Instruction',
      titleWhite: 'BECOME A FLIGHT',
      titleAccent: 'INSTRUCTOR',
      description: 'Build hours while teaching the next generation. ATO partnerships, instructor ratings, and pathway-to-airline programs.',
      cta: 'Find ATO Partners',
      ctaAction: () => {
        localStorage.setItem('careerpathways_mode', 'true');
        window.location.href = `${window.location.origin}/?product=careerpathways`;
      },
      rightLabel: 'ATO Network',
      rightText: 'Explore',
      image: '/cessna.png',
      accent: '#10b981',
    },
    {
      id: 'type-rating',
      eyebrow: 'Training',
      titleWhite: 'DISCOVER',
      titleAccent: 'TYPE RATINGS',
      description: 'Find approved type rating centers worldwide. Compare costs, locations, and airline partnerships.',
      cta: 'Discover Type Ratings',
      ctaAction: () => {
        localStorage.setItem('careerpathways_mode', 'true');
        window.location.href = `${window.location.origin}/type-ratings?product=careerpathways`;
      },
      rightLabel: 'Training Network',
      rightText: 'Explore',
      image: '/type.png',
      bgPosition: '30% center',
      accent: '#ef4444',
      overlay: 'linear-gradient(to right, rgba(15,23,42,0.70) 0%, rgba(15,23,42,0.50) 35%, rgba(15,23,42,0.25) 55%, rgba(15,23,42,0.08) 70%, transparent 100%)',
    },
    {
      id: 'programs',
      eyebrow: 'Programs',
      titleWhite: 'DISCOVER',
      titleAccent: 'PROGRAMS',
      description: 'New graduated pilots are eligible for the Wingmentor program in partnership with pilotshortage.org, pilotrecognition.com',
      cta: 'Explore Programs',
      ctaAction: () => safeRedirect('/programs'),
      rightLabel: 'Partnership',
      rightText: 'Wingmentor Program',
      image: '/Program.png',
      accent: '#06b6d4',
    },
    {
      id: 'discover',
      eyebrow: 'Airlines',
      titleWhite: 'DISCOVER',
      titleAccent: 'EXPECTATIONS',
      description: 'Compare airline requirements, salaries, and fleet types before you apply.',
      cta: 'Explore Airlines',
      ctaAction: () => {
        // Switch to career pathways mode on same domain — preserves SSO session
        localStorage.setItem('careerpathways_mode', 'true');
        window.location.href = `${window.location.origin}/airline-expectations?product=careerpathways`;
      },
      rightLabel: 'Airline Database',
      rightText: airlinesCount > 0 ? `${airlinesCount}+ Operators` : 'Coming Soon',
      image: '/expect.png',
      accent: '#06b6d4',
    },
    {
      id: 'ai-match',
      eyebrow: 'Recognition+',
      titleWhite: 'GET',
      titleAccent: 'RECOGNITION+',
      subtitleWhite: 'INTERNATIONAL',
      subtitleAccent: 'VERIFIED',
      description: 'Independent verification of license, medical, and ratings by authorised providers. Flight hours are audited against logbook records. Operators receive a standardised risk profile per candidate, readable across jurisdictions without re-verification.',
      cta: 'Get Recognition+',
      ctaAction: () => setTab('pathways'),
      rightLabel: 'Smart Matching',
      rightText: 'Learn more',
      image: '',
      rightImage: '/shortage2.png',
      bgPosition: 'center',
      accent: '#ef4444',
      overlay: '#ffffff',
      textDark: true,
    },
    {
      id: 'pilotshortage',
      eyebrow: 'Advocacy',
      titleWhite: 'PILOT',
      titleAccent: 'SHORTAGE',
      titleSuffix: '.ORG',
      subtitleWhite: 'connecting pilots',
      subtitleAccent: 'to the industry',
      description: 'The aviation industry is experiencing a measurable gap between trained pilots and available positions. Career pathways remain fragmented, with limited standardisation in licensing recognition, logbook verification, and employer-to-pilot communication. PilotShortage.org documents these structural factors and works toward practical solutions — transparent career mapping, standardised credential portability, and direct pilot representation in industry policy. A neutral platform built by pilots, for pilots.',
      cta: 'Become an associate member',
      ctaAction: () => window.open('https://pilotshortage.org', '_blank', 'noopener,noreferrer'),
      rightLabel: 'Community',
      rightText: 'Learn More',
      image: '',
      rightImage: '/construct.png',
      bgPosition: 'center',
      accent: '#ef4444',
      overlay: '#ffffff',
      textDark: true,
      smallTitle: true,
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
      className="relative w-full overflow-hidden rounded-none cursor-pointer group h-full"
      style={{ flexShrink: 0 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence>
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <div
            className="absolute inset-0 bg-cover transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: slide.image ? `url('${slide.image}')` : 'none', backgroundPosition: slide.bgPosition ?? 'center', backgroundSize: 'cover', backgroundColor: slide.rightImage ? '#ffffff' : undefined }}
          />
          {slide.rightImage && (
            <div className="absolute inset-0">
              <div
                className="absolute inset-y-0 right-0 w-[55%] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${slide.rightImage}')` }}
              />
              {/* White-to-transparent gradient between text and image */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to right, #ffffff 0%, #ffffff 45%, rgba(255,255,255,0.92) 50%, rgba(255,255,255,0.6) 58%, rgba(255,255,255,0.15) 68%, transparent 78%)',
                }}
              />
            </div>
          )}
          {/* Tint overlay (skipped when rightImage handles its own layering) */}
          {!slide.rightImage && (
            <div
              className="absolute inset-0"
              style={{
                background: slide.overlay ?? 'linear-gradient(to right, rgba(10,12,16,0.80) 0%, rgba(10,12,16,0.60) 35%, rgba(10,12,16,0.35) 55%, rgba(10,12,16,0.12) 70%, transparent 100%)',
              }}
            />
          )}

          {/* Left content panel */}
          <div className="absolute inset-0 flex items-stretch">
            <div className="relative w-[55%] h-full flex flex-col justify-end pl-14 pr-8 pb-8 pt-4">
              <div className="relative z-10">
                <h2 className={`font-black uppercase tracking-tight leading-[1.05] mb-2 ${slide.smallTitle ? 'text-4xl' : 'text-5xl'}`}>
                  <span className={slide.textDark ? 'text-slate-900' : 'text-white'}>{slide.titleWhite}</span>
                  <span className="text-red-500"> {slide.titleAccent}</span>
                  {slide.titleSuffix && (
                    <span className={slide.textDark ? 'text-slate-900' : 'text-white'}> {slide.titleSuffix}</span>
                  )}
                </h2>
                {slide.subtitleWhite && (
                  <h3 className={`font-black uppercase tracking-tight leading-[1.05] mb-2 ${slide.smallTitle ? 'text-2xl' : 'text-3xl'}`}>
                    <span className={slide.textDark ? 'text-slate-900' : 'text-white'}>{slide.subtitleWhite}</span>
                    <span className="text-red-500"> {slide.subtitleAccent}</span>
                    {slide.subtitleSuffix && (
                      <span className={slide.textDark ? 'text-slate-900' : 'text-white'}> {slide.subtitleSuffix}</span>
                    )}
                  </h3>
                )}
                <p className={`text-sm max-w-md leading-relaxed mb-4 ${slide.textDark ? 'text-slate-600' : 'text-slate-300'}`}>
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
                    className={`px-6 py-3 text-xs font-black uppercase tracking-wider border transition-all duration-200 flex items-center justify-center ${slide.textDark ? 'text-slate-700 border-slate-300/60' : 'text-white border-white/30'}`}
                    style={slide.textDark ? { background: 'rgba(0,0,0,0.04)' } : {
                      background: 'rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                    }}
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
        onClick={(e) => { e.stopPropagation(); setCurrent((prev) => (prev > 0 ? prev - 1 : slides.length - 1)); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.2)',
          cursor: 'pointer',
          opacity: 1,
        }}
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} className="text-white" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); setCurrent((prev) => (prev < slides.length - 1 ? prev + 1 : 0)); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.2)',
          cursor: 'pointer',
          opacity: 1,
        }}
        aria-label="Next slide"
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
