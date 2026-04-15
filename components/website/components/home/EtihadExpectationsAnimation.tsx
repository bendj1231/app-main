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
          if (prev >= 500) {
            clearInterval(scrollInterval);
            return 500;
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
      {/* Header Section */}
      <div className="bg-white px-2 py-2 border-b border-slate-200 flex-shrink-0">
        <div className="text-center">
          <p className="text-[5px] font-bold tracking-[0.15em] uppercase text-blue-700 mb-0.5">
            Strategic Career Guidance
          </p>
          <h1 className="text-[8px] font-serif text-slate-900 leading-tight mb-0.5">
            Airline Expectations
          </h1>
          <p className="text-[5px] text-slate-600 leading-relaxed">
            Understanding what airlines really look for in pilot candidates
          </p>
        </div>
      </div>

      {/* Netflix-style Hero Section */}
      <div className="relative h-[25%] min-h-[80px] flex-shrink-0">
        <img
          src={etihadData.image}
          alt={etihadData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[5px] font-bold tracking-[0.1em] uppercase text-blue-400 bg-blue-500/20 px-1.5 py-0.5 rounded border border-blue-400/30">
              SELECTED AIRLINE
            </span>
            <div className="flex items-center gap-0.5 text-[6px] text-white/80">
              <MapPin className="w-2 h-2" />
              {etihadData.location}
            </div>
          </div>
          <h1 className="text-sm font-serif text-white font-bold leading-tight">
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
            transitionDuration: '5s'
          }}
        >
          {/* Description */}
          <div className="p-2">
            <p className="text-[6px] text-slate-600 leading-relaxed">
              {etihadData.description}
            </p>
          </div>

          {/* Stats */}
          <div className="px-2 pb-2 flex gap-1.5">
            <div className="flex-1 bg-emerald-50 rounded p-1.5 border border-emerald-200">
              <p className="text-[5px] font-semibold text-emerald-700">{etihadData.salaryRange}</p>
            </div>
            <div className="flex-1 bg-blue-50 rounded p-1.5 border border-blue-200">
              <p className="text-[5px] font-semibold text-blue-700">{etihadData.flightHours}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="px-2 pb-2 flex flex-wrap gap-0.5">
            {etihadData.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[5px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Core Expectations */}
          <div className="px-2 pb-2">
            <h2 className="text-[7px] font-bold text-slate-900 mb-1">Core Expectations</h2>
            <div className="space-y-1">
              <div className="bg-white rounded p-1.5 border border-slate-200 shadow-sm">
                <div className="flex items-start gap-1">
                  <Cpu className="w-2 h-2 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-[6px] font-semibold text-slate-800">Technical Mastery</h3>
                    <p className="text-[5px] text-slate-500">Automation, precision, systems</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded p-1.5 border border-slate-200 shadow-sm">
                <div className="flex items-start gap-1">
                  <Users className="w-2 h-2 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-[6px] font-semibold text-slate-800">Behavioral Competency</h3>
                    <p className="text-[5px] text-slate-500">CRM, decisions, leadership</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded p-1.5 border border-slate-200 shadow-sm">
                <div className="flex items-start gap-1">
                  <Brain className="w-2 h-2 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-[6px] font-semibold text-slate-800">Cognitive Resilience</h3>
                    <p className="text-[5px] text-slate-500">Awareness, workload mgmt</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Pipeline */}
          <div className="px-2 pb-2">
            <h2 className="text-[7px] font-bold text-slate-900 mb-1">Assessment Pipeline</h2>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1 bg-slate-50 rounded p-1">
                <Search className="w-2 h-2 text-slate-600" />
                <span className="text-[5px] text-slate-700">Screening - Digital audit</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-50 rounded p-1">
                <Target className="w-2 h-2 text-blue-600" />
                <span className="text-[5px] text-slate-700">Psychometrics - Cognitive testing</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-50 rounded p-1">
                <Briefcase className="w-2 h-2 text-slate-600" />
                <span className="text-[5px] text-slate-700">Technical/HR - Interviews</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-50 rounded p-1">
                <Zap className="w-2 h-2 text-amber-600" />
                <span className="text-[5px] text-slate-700">Simulator Audit - EBT/CBTA</span>
              </div>
            </div>
          </div>

          {/* Fleet */}
          <div className="px-2 pb-2">
            <h2 className="text-[7px] font-bold text-slate-900 mb-1">Aircraft Fleet</h2>
            <div className="bg-white rounded p-1.5 border border-slate-200 shadow-sm">
              <p className="text-[5px] text-slate-600 leading-relaxed">
                {etihadData.fleet}
              </p>
            </div>
          </div>

          {/* Requirements Section */}
          <div className="px-2 pb-2">
            <h2 className="text-[7px] font-bold text-slate-900 mb-1">Pilot Requirements</h2>
            <div className="bg-white rounded p-1.5 border border-slate-200 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-start gap-1">
                  <span className="text-[5px] text-slate-400 mt-0.5">•</span>
                  <span className="text-[5px] text-slate-700"><strong>2,500+ hrs</strong> Total Flight Time</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-[5px] text-slate-400 mt-0.5">•</span>
                  <span className="text-[5px] text-slate-700">Valid ATPL or CPL License</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-[5px] text-slate-400 mt-0.5">•</span>
                  <span className="text-[5px] text-slate-700">ICAO English Level 4+</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-[5px] text-slate-400 mt-0.5">•</span>
                  <span className="text-[5px] text-slate-700">Class 1 Medical Certificate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Match Score */}
          <div className="px-2 pb-2">
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded p-2 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[5px] text-red-200 uppercase tracking-wider mb-0.5">MATCH SCORE</p>
                  <p className="text-lg font-bold">84%</p>
                </div>
                <div className="text-right">
                  <p className="text-[5px] text-red-200 uppercase tracking-wider mb-0.5">PILOT</p>
                  <p className="text-[6px] font-semibold">Pete Mitchell</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
