'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Globe, Award, ArrowRight, Shield, TrendingUp } from 'lucide-react';

interface GridCard {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  stat: string;
  statLabel: string;
  accentColor: string;
  image: string;
}

const gridCards: GridCard[] = [
  {
    id: 'pilots-stuck',
    icon: Users,
    title: '15,000+ Pilots',
    subtitle: 'Trained, credentialed, and ready — but stuck in the clogged pipeline',
    stat: '200:1',
    statLabel: 'Applicant ratio at major carriers',
    accentColor: 'from-[#c41e3a]/80 to-red-700/80',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
  },
  {
    id: 'investment-lost',
    icon: FileText,
    title: '$50K–$200K',
    subtitle: 'Training investment per pilot sitting idle without pathways',
    stat: '$520K',
    statLabel: 'Total gap per pilot to airline job',
    accentColor: 'from-amber-500/80 to-orange-600/80',
    image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80',
  },
  {
    id: 'global-reach',
    icon: Globe,
    title: 'Global Advocacy',
    subtitle: 'PSA operates across Philippines, UAE, Europe, and Americas',
    stat: '3 Continents',
    statLabel: 'Active advocacy regions',
    accentColor: 'from-blue-500/80 to-cyan-600/80',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
  },
  {
    id: 'verification',
    icon: Shield,
    title: 'Verified Stories',
    subtitle: 'Identity-protected testimonies from real pilots',
    stat: '100%',
    statLabel: 'Identity protected submissions',
    accentColor: 'from-emerald-500/80 to-teal-600/80',
    image: 'https://images.unsplash.com/photo-1521737600813-7f5b2795c173?w=800&q=80',
  },
];

export const ShortageGridHero: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className="relative min-h-screen bg-[#0f172a] overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0f172a]" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />

      <div className="relative z-10 container mx-auto px-4 py-20 lg:py-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#c41e3a]/10 border border-[#c41e3a]/30 rounded-full mb-6">
            <span className="w-2 h-2 bg-[#c41e3a] rounded-full animate-pulse" />
            <span className="text-[#c41e3a] text-sm font-semibold uppercase tracking-wider">
              The Real Numbers
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            There Is No Pilot Shortage.
            <br />
            <span className="text-[#c41e3a]">There Is A Clogged Pipeline.</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Thousands of pilots exist. They are trained, credentialed, and ready. But they are <span className="text-white font-semibold">stuck</span>.
          </p>
        </motion.div>

        {/* Grid Cards - PathwayGrid Style */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {gridCards.map((card, index) => {
            const isHovered = hoveredCard === card.id;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="group relative"
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Main Card Container - Matching PathwayGrid exactly */}
                <div className={`
                  relative w-full h-[340px] rounded-xl overflow-hidden
                  bg-black/85 border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
                  transition-all duration-300 ease-out
                  ${isHovered ? 'scale-[1.01] brightness-110' : 'scale-100'}
                `}>
                  {/* Background Image - Takes up most of card */}
                  <div className="absolute inset-0">
                    <img
                      src={card.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {/* MSFS Style Gradient Overlay - Bottom fade to dark */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#111827]/35 to-transparent" />
                  </div>

                  {/* NEW Badge - Amber/Orange */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-[#ff9f1c] text-black text-xs font-bold uppercase tracking-wider z-20">
                    NEW
                  </div>

                  {/* MSFS Style Content Area - Bottom section with solid dark bg */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-[#111827]">
                    <div className="flex flex-col">
                      {/* Title row with double chevrons - MSFS style */}
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs font-bold text-white/80">&#62;&#62;</span>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                          {card.title}
                        </h3>
                      </div>
                      {/* Accent underline - cyan gradient */}
                      <div className="w-full max-w-[120px] h-1 mb-2 bg-gradient-to-r from-[#00b4d8] to-transparent" />
                      {/* Description */}
                      <p className="text-[10px] leading-tight line-clamp-2 text-slate-300">
                        {card.subtitle}
                      </p>

                      {/* Stat row */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                        <div>
                          <div className="text-lg font-bold text-white">{card.stat}</div>
                          <div className="text-[9px] text-slate-400 uppercase tracking-wider">{card.statLabel}</div>
                        </div>
                        {/* Arrow indicator */}
                        <div className={`
                          w-7 h-7 rounded flex items-center justify-center
                          bg-white/10 border border-white/30
                          transition-all duration-300
                          ${isHovered ? 'bg-white/20 border-white/50' : ''}
                        `}>
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
        >
          <a
            href="#share-story"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-[#c41e3a] hover:bg-[#a31830] text-white font-bold rounded-lg transition-all duration-300 hover:scale-105"
          >
            Share Your Story
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#four-floors"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all duration-300"
          >
            <TrendingUp className="w-5 h-5" />
            See The Four Floors
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-12 text-slate-500 text-sm"
        >
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Identity Protected
          </span>
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-400" />
            Verified Testimony
          </span>
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#c41e3a]" />
            100% Free Membership
          </span>
        </motion.div>
      </div>
    </section>
  );
};
