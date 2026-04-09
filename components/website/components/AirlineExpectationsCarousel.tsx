"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IMAGES } from '../../../src/lib/website-constants';

interface Airline {
  id: string;
  name: string;
  location: string;
  locationFlag: string;
  salaryRange: string;
  flightHours: string;
  tags: string[];
  image: string;
  description: string;
}

const airlines: Airline[] = [
  {
    id: 'qatar',
    name: 'Qatar Airways',
    location: 'Qatar',
    locationFlag: '🇶🇦',
    salaryRange: '$120,000 - $250,000/year',
    flightHours: '2,500+ hrs TT',
    tags: ['5-Star Airline', 'Tax-Free', 'Worldwide Routes'],
    image: 'https://images.unsplash.com/photo-1542296332-2e44a0e7c7d5?q=80&w=2000&auto=format&fit=crop',
    description: 'Qatar Airways offers one of the most competitive compensation packages in the industry, with tax-free salaries and worldwide route opportunities. Known for exceptional service standards and rapid career progression.'
  },
  {
    id: 'singapore',
    name: 'Singapore Airlines',
    location: 'Singapore',
    locationFlag: '🇸🇬',
    salaryRange: '$120,000 - $180,000/year',
    flightHours: '3,000+ hrs TT',
    tags: ['Premium Carrier', 'Asian Hub', 'Great Benefits'],
    image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?q=80&w=2000&auto=format&fit=crop',
    description: 'Singapore Airlines maintains one of the highest service standards globally, offering comprehensive benefits and a strategic Asian hub location. The airline provides excellent training and career development opportunities.'
  },
  {
    id: 'cathay',
    name: 'Cathay Pacific',
    location: 'Hong Kong',
    locationFlag: '🇭🇰',
    salaryRange: '$110,000 - $160,000/year',
    flightHours: '2,800+ hrs TT',
    tags: ['5-Star Airline', 'Asian Network', 'Career Growth'],
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop',
    description: 'Cathay Pacific offers a dynamic career environment with extensive Asian network coverage. The airline provides competitive packages and strong opportunities for career advancement within the region.'
  },
  {
    id: 'emirates',
    name: 'Emirates',
    location: 'UAE',
    locationFlag: '🇦🇪',
    salaryRange: '$130,000 - $280,000/year',
    flightHours: '2,500+ hrs TT',
    tags: ['Global Network', 'Tax-Free', 'Dubai Base'],
    image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=2000&auto=format&fit=crop',
    description: 'Emirates operates one of the world\'s largest international networks from its Dubai hub. Offering tax-free salaries, accommodation allowances, and extensive global destinations with state-of-the-art fleet.'
  },
  {
    id: 'etihad',
    name: 'Etihad Airways',
    location: 'UAE',
    locationFlag: '🇦🇪',
    salaryRange: '$115,000 - $200,000/year',
    flightHours: '2,500+ hrs TT',
    tags: ['Abu Dhabi Hub', 'Modern Fleet', 'Global Routes'],
    image: 'https://images.unsplash.com/photo-1524592714635-d77511a4834d?q=80&w=2000&auto=format&fit=crop',
    description: 'Etihad Airways provides competitive tax-free packages from its Abu Dhabi base. The airline features a modern fleet and growing global network with focus on premium service standards.'
  }
];

export const AirlineExpectationsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < airlines.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentAirline = airlines[currentIndex];

  // Track which card is centered using Intersection Observer
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll('[data-airline-index]');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const index = parseInt(entry.target.getAttribute('data-airline-index') || '0');
            setCurrentIndex(index);
          }
        });
      },
      {
        root: container,
        threshold: 0.5,
        rootMargin: '-40% 0px -40% 0px' // Only detect when card is in center 20%
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  // Navigation handlers
  const goToCard = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full bg-white py-12 overflow-hidden">
      {/* Header - Far Left Aligned */}
      <div className="w-full px-8 mb-8">
        <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-3">
          Airline Expectations
        </h2>
        <p className="text-sm text-slate-500 mb-4 max-w-xl">
          Learn about expectations, requirements, and career paths from major airlines around the world
        </p>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
            AIRLINE EXPECTATIONS UPDATE
          </span>
          <span className="text-[10px] text-slate-400">
            Latest opportunities and industry news
          </span>
        </div>
      </div>

      {/* Main Content Area - Full Width Marquee Carousel */}
      <div className="relative w-full overflow-hidden py-8">
        {/* Marquee Container - Full Width Auto-Scrolling */}
        <div className="relative w-full overflow-hidden px-8">
          {/* Marquee Track */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 animate-marquee"
            style={{
              animation: 'marquee 30s linear infinite',
            }}
          >
            {/* Double the cards for seamless loop */}
            {[...airlines, ...airlines].map((airline, index) => {
              const actualIndex = index % airlines.length;
              const isActive = actualIndex === currentIndex;
              return (
                <div
                  key={`${airline.id}-${index}`}
                  data-airline-index={actualIndex}
                  className={`flex-shrink-0 w-[520px] h-[300px] rounded-2xl overflow-hidden shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                    isActive ? 'ring-4 ring-blue-400 ring-offset-2' : ''
                  }`}
                  onClick={() => goToCard(actualIndex)}
                >
                    {/* Card Image */}
                    <div className="relative w-full h-full">
                      <img
                        src={airline.image}
                        alt={airline.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />

                      {/* Card Content */}
                      <div className="absolute inset-0 p-5 flex flex-col justify-between">
                        {/* Top Label */}
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-blue-300">
                            AIRLINE — MAJOR AIRLINE
                          </span>
                          <span className="text-[10px] font-bold text-slate-700 bg-slate-300/80 px-2 py-0.5 rounded">
                            N/A
                          </span>
                        </div>

                        {/* Middle Content */}
                        <div>
                          <h3 className="text-2xl font-serif text-white mb-1">
                            {airline.name}
                          </h3>
                          <p className="text-sm text-white/60 mb-3">
                            {airline.name} Airways
                          </p>

                          {/* Info Row */}
                          <div className="flex items-center gap-4 mb-4 text-[12px] text-white/80">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                              {airline.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="text-white/60">$</span>
                              {airline.salaryRange}
                            </span>
                          </div>
                        </div>

                        {/* Bottom Row - Button and Tags */}
                        <div className="flex items-center justify-between gap-3">
                          <button className="px-5 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white text-[11px] font-semibold rounded-full transition-all duration-300 flex items-center gap-2 group">
                            Discover Expectations
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                          </button>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 justify-end">
                            {airline.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-medium text-emerald-300 bg-emerald-500/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-emerald-400/30"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Marquee Animation Style */}
          <style>{`
            @keyframes marquee {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            .animate-marquee:hover {
              animation-play-state: paused;
            }
          `}</style>

          {/* Pause on Hover Note */}
          <p className="text-center text-[11px] text-slate-400 italic mt-4">
            Auto-scrolling • Hover to pause • Click card to select
          </p>
        </div>

        {/* Selected Airline Info - Centered with Click Navigation */}
        <div className="mt-10 max-w-4xl mx-auto">
          <div className="flex items-start justify-center gap-6">
            {/* Prev Button */}
            <button
              onClick={goToPrev}
              disabled={currentIndex === 0}
              className="mt-8 w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-md disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Center Content */}
            <div className="text-center flex-1 max-w-2xl">
              {/* Badge Row */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  AIRLINE — {currentAirline.location.toUpperCase()} BASE
                </span>
                <span className="text-[10px] text-slate-400">Major Airline</span>
              </div>

              {/* Your pathway text */}
              <p className="text-lg font-serif text-slate-700 mb-2">
                Your pathway.
              </p>

              {/* Main Title */}
              <h3 className="text-3xl md:text-4xl font-serif text-amber-600 mb-6">
                {currentAirline.name} Career Path
              </h3>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed mb-4 max-w-2xl mx-auto">
                {currentAirline.description}
              </p>

              {/* Details Line */}
              <p className="text-xs text-slate-400">
                {currentAirline.tags.join(' • ')} • Located in {currentAirline.location} • {currentAirline.flightHours} Required
              </p>
            </div>

            {/* Next Button */}
            <button
              onClick={goToNext}
              disabled={currentIndex === airlines.length - 1}
              className="mt-8 w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-md disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Description */}
      <div className="max-w-4xl mx-auto px-6 mt-12 pt-8 border-t border-slate-100">
        <p className="text-sm text-slate-600 leading-relaxed text-center mb-3">
          Explore detailed expectations, requirements, and career progression opportunities from leading airlines worldwide. Each airline profile provides insights into salary ranges, required flight hours, type ratings, and unique benefits to help you make informed career decisions.
        </p>
        <p className="text-xs text-slate-400 text-center">
          Swipe through to discover airline-specific requirements and compare opportunities across global carriers.
        </p>
      </div>
    </div>
  );
};
