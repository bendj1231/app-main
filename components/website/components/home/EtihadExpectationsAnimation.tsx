import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Cpu, Users, Brain, Shield, Target, Briefcase, Zap, Search } from 'lucide-react';

interface EtihadExpectationsAnimationProps {
  isHovered: boolean;
}

export const EtihadExpectationsAnimation: React.FC<EtihadExpectationsAnimationProps> = ({ isHovered }) => {
  const [scrollY, setScrollY] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Clear any existing timeouts
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
    
    // Reset animation state to beginning
    setScrollY(0);
    setCurrentSection(0);
    
    // Animation loop function
    const runAnimation = () => {
      // Section 1: Header (0px) - show header only
      // Section 2: Netflix Hero (scroll to ~120px) - show hero section
      // Section 3: Pilot Requirements (scroll to ~300px) - show requirements section
      
      const section1Timeout = setTimeout(() => {
        setCurrentSection(1);
        setScrollY(120);
      }, 2000); // Show header for 2 seconds
      timeoutsRef.current.push(section1Timeout);
      
      const section2Timeout = setTimeout(() => {
        setCurrentSection(2);
        setScrollY(300);
      }, 5000); // Show hero for 3 seconds, then scroll to requirements
      timeoutsRef.current.push(section2Timeout);
      
      // Loop back to beginning after showing requirements
      const loopTimeout = setTimeout(() => {
        setScrollY(0);
        setCurrentSection(0);
        runAnimation(); // Restart the loop
      }, 8000); // Show requirements for 3 seconds, then loop
      timeoutsRef.current.push(loopTimeout);
    };
    
    runAnimation();
    
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current = [];
    };
  }, [isHovered]); // Add isHovered dependency to restart when returning to component

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
    <div className="absolute inset-0 bg-white overflow-hidden">
      {/* Single Scrollable Container */}
      <div
        className="transition-transform ease-in-out"
        style={{ 
          transform: `translateY(-${scrollY}px)`,
          paddingBottom: `${scrollY + 20}px`,
          transitionDuration: '1.5s'
        }}
      >
        {/* Section 1: Header */}
        <div className="bg-white px-2 py-2 border-b border-slate-200">
          <div className="text-center">
            <img
              src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
              alt="WingMentor Logo"
              className="mx-auto w-16 h-auto object-contain mb-1"
            />
            <p className="text-[5px] font-bold tracking-[0.3em] uppercase text-blue-700 mb-1">
              Strategic Career Guidance
            </p>
            <h1 className="text-[8px] font-serif text-slate-900 leading-tight mb-1">
              Airline Expectations
            </h1>
            <p className="text-[5px] text-slate-600 leading-relaxed max-w-xs mx-auto">
              Understanding what airlines really look for in pilot candidates—beyond the 1,500-hour requirement. We bridge the gap between "having the hours" and "being the right candidate."
            </p>
          </div>
        </div>

        {/* Section 2: Netflix-style Hero */}
        <div className="relative h-[25%] min-h-[100px]">
          <img
            src={etihadData.image}
            alt={etihadData.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[6px] font-bold tracking-[0.15em] uppercase text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full border border-blue-400/30 backdrop-blur-sm">
                SELECTED AIRLINE
              </span>
              <div className="flex items-center gap-1 text-[8px] text-white/80">
                <MapPin className="w-3 h-3" />
                {etihadData.location}
              </div>
            </div>
            <h1 className="text-lg font-serif text-white font-bold mb-2 leading-tight">
              {etihadData.name}
            </h1>
            <p className="text-[8px] text-white/90 leading-relaxed mb-2 max-w-xs">
              {etihadData.description}
            </p>
            <div className="mb-2">
              <p className="text-[6px] text-white/70">
                <span className="font-semibold text-white">Fleet:</span> {etihadData.fleet}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              <div className="flex items-center gap-1 bg-emerald-500/30 backdrop-blur-sm px-2 py-1 rounded border border-emerald-400/30">
                <span className="text-[6px] text-emerald-300 font-semibold">{etihadData.salaryRange}</span>
              </div>
              <div className="flex items-center gap-1 bg-blue-500/30 backdrop-blur-sm px-2 py-1 rounded border border-blue-400/30">
                <span className="text-[6px] text-blue-300 font-semibold">{etihadData.flightHours}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {etihadData.tags.slice(0, 4).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[5px] font-medium text-white/80 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Pilot Requirements */}
        <div className="bg-slate-50 px-2 py-2">
          <h2 className="text-[8px] font-bold text-slate-900 mb-2 pb-1 border-b-2 border-slate-200">Pilot Requirements</h2>
          <div className="bg-white rounded p-2 border border-slate-200 shadow-sm">
            <div className="mb-2 p-1.5 bg-amber-50 rounded border border-amber-200">
              <div className="flex items-start gap-1">
                <span className="text-amber-600 font-bold text-[8px] mt-0.5">!</span>
                <div>
                  <p className="text-[6px] font-semibold text-slate-800 mb-0.5">Last Updated Notice</p>
                  <p className="text-[5px] text-slate-600">Requirements last updated January 15, 2026</p>
                </div>
              </div>
            </div>
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
              <div className="flex items-start gap-1">
                <span className="text-[5px] text-slate-400 mt-0.5">•</span>
                <span className="text-[5px] text-slate-700">Multi-Engine Instrument Rating</span>
              </div>
            </div>
          </div>

          {/* Core Expectations */}
          <div className="mt-2 px-0 pb-2">
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
        {/* Section 3 content end */}
        </div>
      {/* Scrollable container end */}
      </div>
    {/* Outer container end */}
    </div>
  );
};
