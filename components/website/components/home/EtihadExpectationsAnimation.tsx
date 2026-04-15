import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Cpu, Users, Brain, Shield, Target, Briefcase, Zap, Search } from 'lucide-react';

interface EtihadExpectationsAnimationProps {
  isHovered: boolean;
}

export const EtihadExpectationsAnimation: React.FC<EtihadExpectationsAnimationProps> = ({ isHovered }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (isHovered) {
      setScrollY(0);
      
      const scrollInterval = setInterval(() => {
        setScrollY(prev => {
          if (prev >= 600) {
            clearInterval(scrollInterval);
            return 600;
          }
          return prev + 1;
        });
      }, 40);

      return () => clearInterval(scrollInterval);
    }
  }, [isHovered]);

  const etihadData = {
    name: 'Etihad Airways',
    location: 'UAE',
    salaryRange: '$115,000 - $200,000/year',
    flightHours: '2,500+ hrs TT',
    tags: ['Premium Airline', 'Abu Dhabi Hub', 'Modern Fleet'],
    image: '/images/airline-expectations/etihad-airways-new.jpg',
    description: 'Etihad Airways provides competitive tax-free packages from its Abu Dhabi base. The airline features a modern fleet and growing global network with focus on premium service standards.',
    fleet: 'Boeing 787, 777, Airbus A350, A380 - Modern fuel-efficient fleet with state-of-the-art cabins and sustainable aviation focus'
  };

  return (
    <div className="absolute inset-0 bg-white flex flex-col overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-[35%] min-h-[120px] flex-shrink-0">
        <img
          src={etihadData.image}
          alt={etihadData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[6px] font-bold tracking-[0.1em] uppercase text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-400/30">
              SELECTED AIRLINE
            </span>
            <div className="flex items-center gap-1 text-[8px] text-white/80">
              <MapPin className="w-3 h-3" />
              {etihadData.location}
            </div>
          </div>
          <h1 className="text-lg md:text-xl font-serif text-white font-bold leading-tight">
            {etihadData.name}
          </h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-hidden">
        <div
          className="transition-transform ease-linear"
          style={{ 
            transform: `translateY(-${scrollY}px)`,
            paddingBottom: `${scrollY + 20}px`,
            transitionDuration: '4s'
          }}
        >
          {/* Description */}
          <div className="p-3">
            <p className="text-[8px] text-slate-600 leading-relaxed">
              {etihadData.description}
            </p>
          </div>

          {/* Stats */}
          <div className="px-3 pb-3 flex gap-2">
            <div className="flex-1 bg-emerald-50 rounded-lg p-2 border border-emerald-200">
              <p className="text-[7px] font-semibold text-emerald-700">{etihadData.salaryRange}</p>
            </div>
            <div className="flex-1 bg-blue-50 rounded-lg p-2 border border-blue-200">
              <p className="text-[7px] font-semibold text-blue-700">{etihadData.flightHours}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="px-3 pb-3 flex flex-wrap gap-1">
            {etihadData.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[6px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Core Expectations */}
          <div className="px-3 pb-3">
            <h2 className="text-[9px] font-bold text-slate-900 mb-2">Core Expectations</h2>
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-2 border border-slate-200 shadow-sm">
                <div className="flex items-start gap-2">
                  <Cpu className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-[8px] font-semibold text-slate-800">Technical Mastery</h3>
                    <p className="text-[6px] text-slate-500">Automation logic, manual precision, systems mastery</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-2 border border-slate-200 shadow-sm">
                <div className="flex items-start gap-2">
                  <Users className="w-3 h-3 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-[8px] font-semibold text-slate-800">Behavioral Competency</h3>
                    <p className="text-[6px] text-slate-500">CRM excellence, decision making, leadership</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-2 border border-slate-200 shadow-sm">
                <div className="flex items-start gap-2">
                  <Brain className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-[8px] font-semibold text-slate-800">Cognitive Resilience</h3>
                    <p className="text-[6px] text-slate-500">Situational awareness, workload management</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Pipeline */}
          <div className="px-3 pb-3">
            <h2 className="text-[9px] font-bold text-slate-900 mb-2">Assessment Pipeline</h2>
            <div className="space-y-1">
              <div className="flex items-center gap-2 bg-slate-50 rounded p-1.5">
                <Search className="w-3 h-3 text-slate-600" />
                <span className="text-[7px] text-slate-700">Screening - Digital audit</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 rounded p-1.5">
                <Target className="w-3 h-3 text-blue-600" />
                <span className="text-[7px] text-slate-700">Psychometrics - Cognitive testing</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 rounded p-1.5">
                <Briefcase className="w-3 h-3 text-slate-600" />
                <span className="text-[7px] text-slate-700">Technical/HR - Competency interviews</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 rounded p-1.5">
                <Zap className="w-3 h-3 text-amber-600" />
                <span className="text-[7px] text-slate-700">Simulator Audit - EBT/CBTA demo</span>
              </div>
            </div>
          </div>

          {/* Fleet */}
          <div className="px-3 pb-3">
            <h2 className="text-[9px] font-bold text-slate-900 mb-2">Aircraft Fleet</h2>
            <div className="bg-white rounded-lg p-2 border border-slate-200 shadow-sm">
              <p className="text-[7px] text-slate-600 leading-relaxed">
                {etihadData.fleet}
              </p>
            </div>
          </div>

          {/* Match Score */}
          <div className="px-3 pb-3">
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-3 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[6px] text-red-200 uppercase tracking-wider mb-1">MATCH SCORE</p>
                  <p className="text-2xl font-bold">84%</p>
                </div>
                <div className="text-right">
                  <p className="text-[6px] text-red-200 uppercase tracking-wider mb-1">PILOT</p>
                  <p className="text-[8px] font-semibold">Pete Mitchell</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
