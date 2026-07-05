'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TopNavbar } from '@/components/website/components/TopNavbar';
import { MeshGradient } from '@paper-design/shaders-react';
import { Search, ChevronRight, Plane, Globe, GraduationCap, Package, Briefcase, Zap, Star, Shield, Users, MapPin, TrendingUp } from 'lucide-react';


const CATEGORY_CARDS = [
  {
    id: 'commercial',
    label: 'COMMERCIAL AIRLINES',
    color: '#ef4444',
    icon: Plane,
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    desc: 'Mainline and regional airline first officer and captain positions worldwide. Global operator networks.',
    rating: 4.7,
    reviews: '1k+',
    networkSize: '120+',
    avgSalary: '$100k+',
    href: '/pathways-modern',
    badge: 'NEW',
  },
  {
    id: 'cadet',
    label: 'CADET PROGRAMS',
    color: '#06b6d4',
    icon: GraduationCap,
    image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
    desc: 'Airline-sponsored pipelines from zero hours to first officer. Comprehensive training and job placement.',
    rating: 4.8,
    reviews: '800+',
    networkSize: '40+',
    avgSalary: '$65k+',
    href: '/cadet-pathways',
    badge: 'NEW',
  },
  {
    id: 'cargo',
    label: 'CARGO OPERATIONS',
    color: '#8b5cf6',
    icon: Package,
    image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800&q=80',
    desc: 'Express and heavy cargo operations globally. FedEx, UPS, DHL networks.',
    rating: 4.8,
    reviews: '900+',
    networkSize: '35+',
    avgSalary: '$95k+',
    href: '/cargo-transportation',
  },
  {
    id: 'charter',
    label: 'PRIVATE CHARTER',
    color: '#f59e0b',
    icon: Briefcase,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
    desc: 'VIP, corporate, and on-demand charter operations. Large network of operators.',
    rating: 4.7,
    reviews: '700+',
    networkSize: '55+',
    avgSalary: '$110k+',
    href: '/private-charter-pathways',
    badge: 'NEW',
  },
  {
    id: 'airtaxi',
    label: 'AIR TAXI & eVTOL',
    color: '#10b981',
    icon: Zap,
    image: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80',
    desc: 'Next-generation urban air mobility. eVTOL operator training and career paths.',
    rating: 4.9,
    reviews: '1k+',
    networkSize: '20+',
    avgSalary: '$85k+',
    href: '/air-taxi-pathways',
    badge: 'NEW',
  },
  {
    id: 'military',
    label: 'MILITARY TRANSITION',
    color: '#9ca3af',
    icon: Shield,
    image: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&q=80',
    desc: 'Transition programs for military aviators. Credits and career paths to commercial roles.',
    rating: 4.5,
    reviews: '500+',
    networkSize: '15+',
    avgSalary: '$120k+',
    href: '/military-transition',
  },
];

const FEATURED_AIRCRAFT = {
  id: 'a320neo',
  name: 'A320neo commercial e-Airliner',
  image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
  rating: 5,
  cost: '$120k+',
  costLabel: 'Ops',
  networkSize: '150+ Airlines',
  networkLabel: 'Operator Network Size',
};

const STATS = [
  { value: '200+', label: 'Active Pathways', icon: TrendingUp },
  { value: '80+', label: 'Operators Listed', icon: Globe },
  { value: '12K+', label: 'Pilots Matched', icon: Users },
  { value: '40+', label: 'Countries', icon: MapPin },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export default function DiscoverPathwaysPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Universal search entity tabs
  type EntityType = 'all' | 'manufacturers' | 'airlines' | 'operators' | 'private-jet';
  const [activeEntity, setActiveEntity] = useState<EntityType>('all');
  const [activeEntityCategory, setActiveEntityCategory] = useState<string>('all');

  const ENTITY_TABS: { id: EntityType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'manufacturers', label: 'Manufacturers' },
    { id: 'airlines', label: 'Airlines' },
    { id: 'operators', label: 'Operators' },
    { id: 'private-jet', label: 'Private Jet' },
  ];

  const ENTITY_CATEGORIES: Record<EntityType, string[]> = {
    all: ['All'],
    manufacturers: ['All', 'Commercial Jets', 'Regional Aircraft', 'Business & Private', 'Helicopters', 'Military & Defense', 'General Aviation', 'eVTOL & UAM'],
    airlines: ['All', 'International', 'Regional', 'Low-Cost', 'Cargo', 'Legacy'],
    operators: ['All', 'Commercial', 'Corporate', 'Charter', 'Cargo', 'Training'],
    'private-jet': ['All', 'Light', 'Mid-Size', 'Super Mid-Size', 'Large', 'Ultra-Long Range'],
  };

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

      {/* ── TOP NAV BAR ── */}
      <TopNavbar
        onNavigate={(page) => navigate(`/${page}`)}
        onLogin={() => window.dispatchEvent(new CustomEvent('open-login-modal'))}
        currentPage="pathways"
      />

      <motion.div
        className="relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Spacer for fixed navbar */}
        <div className="h-20" />

        {/* ── STATS BAR ── */}
        <motion.section variants={itemVariants} className="px-6 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map(({ value, label, icon: Icon }) => (
                <div 
                  key={label} 
                  className="flex items-center gap-3 p-4 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <Icon size={18} className="text-cyan-400 flex-shrink-0" />
                  <div>
                    <div className="text-xl font-black text-white">{value}</div>
                    <div className="text-xs text-white/40">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── MAIN HERO + AIRCRAFT CARD ── */}
        <motion.section variants={itemVariants} className="px-6 pb-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Hero Content - Floating, no background */}
              <div className="relative p-2 flex flex-col justify-center" 
                style={{ minHeight: '360px' }}
              >
                {/* NEW Badge */}
                <div className="absolute top-0 right-0 px-3 py-1.5 rounded-md text-xs font-black text-white" 
                  style={{ background: '#f59e0b' }}>
                  NEW
                </div>

                <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
                  DISCOVER<br />
                  <span className="text-red-500">PATHWAYS</span>
                </h1>
                <p className="text-white/50 text-base leading-relaxed mb-6 max-w-md">
                  A complete platform for pilot hiring and verified recognition.
                  All pathways, matched and verified to your profile.
                </p>

                {/* Search Bar */}
                <div className="relative mb-3 max-w-md">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search categories, regions, or aircraft types"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                  />
                </div>

                {/* Universal Search Entity Tabs */}
                <div className="mb-5 max-w-md">
                  <div className="flex flex-col gap-2">
                    {/* Entity type pills */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {ENTITY_TABS.map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => { setActiveEntity(tab.id); setActiveEntityCategory('all'); }}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all ${
                            activeEntity === tab.id
                              ? 'bg-white text-slate-900 shadow-md'
                              : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    {/* Category tabs for selected entity */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {ENTITY_CATEGORIES[activeEntity].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setActiveEntityCategory(cat)}
                          className={`text-[11px] font-semibold transition-all pb-0.5 border-b-2 ${
                            activeEntityCategory === cat
                              ? 'text-white border-white'
                              : 'text-white/40 border-transparent hover:text-white/70'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href="/pathways-modern"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                    style={{ background: '#dc2626' }}
                  >
                    Browse All Pathways
                  </a>
                  <a
                    href="/platform?tab=pathways"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white/80 transition-all hover:text-white"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    Platform Login
                  </a>
                </div>
              </div>

              {/* Right: Featured Aircraft Card */}
              <div className="relative overflow-hidden rounded-2xl" 
                style={{ minHeight: '360px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img
                  src={FEATURED_AIRCRAFT.image}
                  alt={FEATURED_AIRCRAFT.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)' }} />
                
                {/* Content overlay */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{FEATURED_AIRCRAFT.name}</h3>
                    {/* Star rating */}
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < FEATURED_AIRCRAFT.rating ? "text-yellow-400 fill-yellow-400" : "text-white/30"} />
                      ))}
                    </div>
                  </div>
                  
                  {/* Bottom info pills */}
                  <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-2 rounded-lg text-xs" 
                      style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}>
                      <span className="text-white/50">COST: </span>
                      <span className="text-white font-semibold">{FEATURED_AIRCRAFT.cost}</span>
                      <span className="text-white/50"> {FEATURED_AIRCRAFT.costLabel}</span>
                    </div>
                    <div className="px-4 py-2 rounded-lg text-xs" 
                      style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}>
                      <span className="text-white/50">{FEATURED_AIRCRAFT.networkLabel}: </span>
                      <span className="text-white font-semibold">{FEATURED_AIRCRAFT.networkSize}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── CATEGORY CARDS ── */}
        <motion.section variants={itemVariants} className="px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-black tracking-[0.25em] text-white/30 uppercase">Browse by Category</p>
                <h2 className="text-xl font-black text-white mt-1">PATHWAY CATEGORIES</h2>
              </div>
              <a href="/pathways-modern" className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                View all <ChevronRight size={14} />
              </a>
            </div>

            {/* 3x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATEGORY_CARDS.map(card => {
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
                      
                      {/* Badge */}
                      {card.badge && (
                        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-md text-[10px] font-black text-white" 
                          style={{ background: '#f59e0b' }}>
                          {card.badge}
                        </div>
                      )}

                    </div>

                    {/* Content */}
                    <div className="px-4 py-3" style={{ background: 'rgba(15,23,42,0.97)' }}>
                      {/* Title with arrow */}
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-[10px] font-black" style={{ color: '#ffffff' }}>›</span>
                        <h3 className="text-[10px] font-black uppercase tracking-wide" style={{ color: '#ffffff' }}>
                          {card.label}
                        </h3>
                      </div>
                      
                      {/* Description */}
                      <p className="text-white/50 text-[10px] leading-relaxed mb-2">{card.desc}</p>
                      
                      {/* Stats row + Button - compact inline layout */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-[9px] text-white/40 overflow-hidden">
                          {/* Rating */}
                          <span className="flex items-center gap-0.5 flex-shrink-0">
                            <span className="text-yellow-400">★</span>
                            <span className="text-white/60">{card.rating}</span>
                            <span className="text-white/30">({card.reviews})</span>
                          </span>
                          {/* Network */}
                          <span className="flex-shrink-0">
                            <span className="text-white/30">Network: </span>
                            <span className="text-white/50">{card.networkSize}</span>
                          </span>
                          {/* Salary */}
                          <span className="flex-shrink-0">
                            <span className="text-white/30">Salary: </span>
                            <span className="text-white/50">{card.avgSalary}</span>
                          </span>
                        </div>
                        
                        {/* Explore button - right aligned */}
                        <button 
                          className="flex-shrink-0 px-3 py-1.5 rounded text-[9px] font-bold text-white transition-all hover:bg-white/20"
                          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}
                        >
                          Discover Pathway
                        </button>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* ── FOOTER ── */}
        <motion.footer variants={itemVariants} className="px-6 pb-10 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-6xl mx-auto pt-8">
            <p className="text-white/20 text-xs">
              © 2026 PilotRecognition.com — Discover Pathways
            </p>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
}
