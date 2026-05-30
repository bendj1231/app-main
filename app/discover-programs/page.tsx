'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavbar } from '@/components/website/components/TopNavbar';
import { MeshGradient } from '@paper-design/shaders-react';
import { Search, ChevronRight, GraduationCap, Target, Award, FileText, LayoutGrid, Plane, Star, Users, MapPin, TrendingUp, Globe } from 'lucide-react';

const PROGRAM_CARDS = [
  {
    id: 'foundation',
    label: 'FOUNDATION PROGRAM',
    color: '#ef4444',
    icon: GraduationCap,
    image: '/program1.png',
    desc: 'Start your pilot journey with 50 hours of verified mentorship and EBT CBTA-aligned competency assessment. The bridge from licensed to airline-ready.',
    rating: 4.9,
    reviews: '1.2k+',
    duration: '50 hrs',
    price: '$49',
    href: '/foundational-program',
    badge: 'START HERE',
  },
  {
    id: 'transition',
    label: 'TRANSITION PROGRAM',
    color: '#3b82f6',
    icon: Target,
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776948158/sedmmczhyibdw1okfcgx.png',
    desc: 'Designed for instructors and low-timers seeking multi-crew and jet environments. Airbus-aligned EBT CBTA framework with verified credentials.',
    rating: 4.8,
    reviews: '900+',
    duration: 'Self-paced',
    price: '$299',
    href: '/transition-program',
    badge: 'NEW',
  },
  {
    id: 'ebt-cbta',
    label: 'EBT & CBTA PROGRAMS',
    color: '#8b5cf6',
    icon: LayoutGrid,
    image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
    desc: 'Evidence-Based Training familiarization using integrated Airbus and Hinfact analytics. Industry-standard competency evaluation.',
    rating: 4.7,
    reviews: '600+',
    duration: 'Modular',
    price: 'Bundled',
    href: '/ebt-cbta',
    badge: 'NEW',
  },
  {
    id: 'benefits',
    label: 'PROGRAM BENEFITS',
    color: '#10b981',
    icon: Award,
    image: '/New Note.jpeg',
    desc: 'Discover certification advantages, career pathways, exclusive member perks, and the recognition score boost that comes with program completion.',
    rating: 4.6,
    reviews: '800+',
    duration: 'Ongoing',
    price: 'Included',
    href: '/benefits',
    badge: null,
  },
  {
    id: 'atlas-cv',
    label: 'ATLAS CV SYSTEMS',
    color: '#f59e0b',
    icon: FileText,
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    desc: 'Modernizing pilot profiles to meet manufacturer and recruiter data-driven standards. ATS-compatible formatting that gets noticed.',
    rating: 4.8,
    reviews: '1k+',
    duration: 'Instant',
    price: 'Included',
    href: '/atlas-cv',
    badge: 'NEW',
  },
  {
    id: 'news',
    label: 'NEWS & UPDATES',
    color: '#06b6d4',
    icon: Plane,
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
    desc: 'Latest industry insights, program announcements, Airbus advisory guidance, and aviation trends from the PilotRecognition network.',
    rating: 4.5,
    reviews: '500+',
    duration: 'Weekly',
    price: 'Free',
    href: '/news-updates',
    badge: null,
  },
];

const FEATURED_PROGRAM = {
  id: 'foundation',
  name: 'Foundation Program — Verified Mentorship',
  image: '/program1.png',
  rating: 5,
  price: '$49',
  priceLabel: 'Entry',
  duration: '50 hrs',
  durationLabel: 'Verified Mentorship',
};

const STATS = [
  { value: '6+', label: 'Active Programs', icon: TrendingUp },
  { value: '50hrs', label: 'Verified Mentorship', icon: Globe },
  { value: '2K+', label: 'Pilots Enrolled', icon: Users },
  { value: '12+', label: 'Industry Advisors', icon: MapPin },
];

export default function DiscoverProgramsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filtered = PROGRAM_CARDS.filter(c =>
    !searchQuery || c.label.toLowerCase().includes(searchQuery.toLowerCase()) || c.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#050a14] to-[#0d1f3c] relative">
      {/* MeshGradient Background */}
      <div className="fixed inset-0 z-0">
        <MeshGradient
          className="w-full h-full"
          colors={["#000000", "#050a14", "#0d1f3c", "#1e3a5f"]}
          speed={0.3}
        />
      </div>

      {/* Frosted glass blur overlay */}
      <div className="fixed inset-0 z-0 bg-white/5 backdrop-blur-md" />

      {/* TOP NAV BAR */}
      <TopNavbar
        onNavigate={(page) => navigate(`/${page}`)}
        onLogin={() => window.dispatchEvent(new CustomEvent('open-login-modal'))}
        currentPage="programs"
      />

      <div className="relative z-10">
        {/* Spacer for fixed navbar */}
        <div className="h-20" />

        {/* STATS BAR */}
        <section className="px-6 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map(({ value, label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-4 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <Icon size={18} className="text-amber-400 flex-shrink-0" />
                  <div>
                    <div className="text-xl font-black text-white">{value}</div>
                    <div className="text-xs text-white/40">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MAIN HERO + FEATURED CARD */}
        <section className="px-6 pb-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Hero Content */}
              <div className="relative p-2 flex flex-col justify-center" style={{ minHeight: '360px' }}>
                {/* NEW Badge */}
                <div className="absolute top-0 right-0 px-3 py-1.5 rounded-md text-xs font-black text-white"
                  style={{ background: '#f59e0b' }}>
                  NEW
                </div>

                <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
                  EXPLORE<br />
                  <span className="text-red-500">PROGRAMS</span>
                </h1>
                <p className="text-white/50 text-base leading-relaxed mb-6 max-w-md">
                  Structured training pathways from flight school to airline-ready professional.
                  Verified mentorship, industry-aligned curriculum, and recognition that travels.
                </p>

                {/* Search Bar */}
                <div className="relative mb-5 max-w-md">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search programs, training types, or topics"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href="/foundational-program"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                    style={{ background: '#dc2626' }}
                  >
                    Start Foundation Program
                  </a>
                  <a
                    href="/programs"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white/80 transition-all hover:text-white"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    Browse All Programs
                  </a>
                </div>
              </div>

              {/* Right: Featured Program Card */}
              <div className="relative overflow-hidden rounded-2xl"
                style={{ minHeight: '360px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img
                  src={FEATURED_PROGRAM.image}
                  alt={FEATURED_PROGRAM.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)' }} />

                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{FEATURED_PROGRAM.name}</h3>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < FEATURED_PROGRAM.rating ? "text-yellow-400 fill-yellow-400" : "text-white/30"} />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-2 rounded-lg text-xs"
                      style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}>
                      <span className="text-white/50">PRICE: </span>
                      <span className="text-white font-semibold">{FEATURED_PROGRAM.price}</span>
                      <span className="text-white/50"> {FEATURED_PROGRAM.priceLabel}</span>
                    </div>
                    <div className="px-4 py-2 rounded-lg text-xs"
                      style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}>
                      <span className="text-white/50">{FEATURED_PROGRAM.durationLabel}: </span>
                      <span className="text-white font-semibold">{FEATURED_PROGRAM.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROGRAM CARDS GRID */}
        <section className="px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-black tracking-[0.25em] text-white/30 uppercase">Browse by Program</p>
                <h2 className="text-xl font-black text-white mt-1">PROGRAM CATEGORIES</h2>
              </div>
              <a href="/programs" className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors">
                View all <ChevronRight size={14} />
              </a>
            </div>

            {/* 3x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(card => {
                const Icon = card.icon;
                return (
                  <a
                    key={card.id}
                    href={card.href}
                    className="group relative overflow-hidden rounded-2xl block transition-transform hover:scale-[1.02]"
                    style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    {/* Image with gradient overlay */}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={card.image}
                        alt={card.label}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(15,23,42,0.85) 100%)' }} />

                      {card.badge && (
                        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-md text-[10px] font-black text-white"
                          style={{ background: '#f59e0b' }}>
                          {card.badge}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="px-4 py-3" style={{ background: 'rgba(15,23,42,0.97)' }}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-[10px] font-black" style={{ color: '#ffffff' }}>›</span>
                        <h3 className="text-[10px] font-black uppercase tracking-wide" style={{ color: '#ffffff' }}>
                          {card.label}
                        </h3>
                      </div>

                      <p className="text-white/50 text-[10px] leading-relaxed mb-2">{card.desc}</p>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-[9px] text-white/40 overflow-hidden">
                          <span className="flex items-center gap-0.5 flex-shrink-0">
                            <span className="text-yellow-400">★</span>
                            <span className="text-white/60">{card.rating}</span>
                            <span className="text-white/30">({card.reviews})</span>
                          </span>
                          <span className="flex-shrink-0">
                            <span className="text-white/30">Duration: </span>
                            <span className="text-white/50">{card.duration}</span>
                          </span>
                          <span className="flex-shrink-0">
                            <span className="text-white/30">Price: </span>
                            <span className="text-white/50">{card.price}</span>
                          </span>
                        </div>

                        <button
                          className="flex-shrink-0 px-3 py-1.5 rounded text-[9px] font-bold text-white transition-all hover:bg-white/20"
                          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}
                        >
                          Explore Program
                        </button>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="px-6 pb-10 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-6xl mx-auto pt-8">
            <p className="text-white/20 text-xs">
              © 2026 PilotRecognition.com — Explore Programs
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
