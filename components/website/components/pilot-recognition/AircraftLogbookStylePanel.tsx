import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, User, Award, Bot, Send, Plane, Star, CheckCircle2, ChevronRight } from 'lucide-react';

interface Manufacturer {
  id: string;
  name: string;
  logo: string;
  reputation_score?: number;
}

interface AircraftTypeRating {
  id: string;
  model: string;
  manufacturer_id: string;
  category: string;
  subcategory?: string;
  image?: string;
  sketchfab_id?: string;
  description?: string;
  why_choose_rating?: string;
  first_flight?: string | number;
  demandLevel?: 'none' | 'high' | 'medium' | 'low';
  lifecycleStage?: 'early-career' | 'mid-career' | 'mature' | 'retiring' | 'end-of-life';
  lifecycle_stage?: 'early-career' | 'mid-career' | 'mature' | 'retiring' | 'end-of-life';
  operatorCount?: number;
  operator_count?: number;
  pilotCount?: number;
  pilot_count?: number;
  careerScore?: number;
  specifications?: Record<string, any>;
  training_requirements?: any;
  career_info?: any;
  news?: { id: string; title: string; summary: string; date: string; url: string }[];
}

interface AircraftLogbookStylePanelProps {
  aircraft: AircraftTypeRating;
  manufacturer?: Manufacturer;
  onClose?: () => void;
  onShowExtendedInfo?: () => void;
}

const getAircraftStatus = (aircraft: AircraftTypeRating) => {
  if (aircraft.id === 'supernal-sa-1') return 'Concept / R&D — Not certified';
  if (aircraft.id === 'b777x') return 'In certification / Pre-delivery';
  if (aircraft.subcategory?.includes('retired')) return 'End of production / Retired';
  if (aircraft.category === 'legacy') return 'End of production / In service';
  if (aircraft.category === 'military') return 'Active military service';
  if (aircraft.subcategory === 'game-changer') return 'Active production / In service';
  return 'Active / In service';
};

const getAircraftAge = (firstFlight?: string | number) => {
  if (!firstFlight) return null;
  return new Date().getFullYear() - Number(firstFlight);
};

const getAircraftPilotCount = (aircraft: AircraftTypeRating) => {
  const map: Record<string, string> = {
    'supernal-sa-1': '0', 'b777x': '0', 'b777-300er': '38,000 – 45,000', 'b787': '48,000 – 55,000',
    'b767-300er': '15,000 – 18,000', 'b737-ng': '110,000 – 130,000', 'b757': '14,000 – 17,000',
    'b717': '1,200 – 1,500', 'b727': '300 – 500', 'b747-8f': '3,500 – 4,500'
  };
  if (map[aircraft.id]) return map[aircraft.id];
  if (aircraft.pilotCount) return aircraft.pilotCount.toLocaleString();
  if (aircraft.pilot_count) return aircraft.pilot_count.toLocaleString();
  let hash = 0;
  for (let i = 0; i < aircraft.model.length; i++) hash = aircraft.model.charCodeAt(i) + ((hash << 5) - hash);
  return (Math.abs(hash) % 15000 + 500).toLocaleString();
};

const getCareerScore = (aircraft: AircraftTypeRating) => {
  if (aircraft.careerScore !== undefined) return aircraft.careerScore;
  let score = 70;
  if (aircraft.demandLevel === 'high') score += 15;
  if (aircraft.demandLevel === 'medium') score += 5;
  if (aircraft.lifecycleStage === 'early-career' || aircraft.lifecycle_stage === 'early-career') score += 10;
  if (aircraft.lifecycleStage === 'mid-career' || aircraft.lifecycle_stage === 'mid-career') score += 5;
  return Math.min(100, Math.max(0, score));
};

const demandColor = (demand?: string) => {
  if (demand === 'high') return '#10b981';
  if (demand === 'medium') return '#f59e0b';
  return '#ef4444';
};

const glass = {
  background: 'linear-gradient(135deg, rgba(20,26,38,0.80) 0%, rgba(14,19,29,0.86) 100%)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
};

export function AircraftLogbookStylePanel({ aircraft, manufacturer, onClose, onShowExtendedInfo }: AircraftLogbookStylePanelProps) {
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'Overview' | 'Training' | 'Hiring' | 'Compensation' | 'Comparison'>('Overview');

  const aircraftAge = getAircraftAge(aircraft.first_flight);

  useEffect(() => {
    setChatMessages([{ role: 'assistant', text: `Welcome to the aircraft assistant for **${aircraft.model}**.\n\nI can help you understand this type rating — ask about training, hiring, compensation, or technical specifications.` }]);
    setActiveTab('Overview');
  }, [aircraft.id]);

  const sendChat = () => {
    const text = chatInput.trim();
    if (!text) return;
    setChatMessages(prev => [...prev, { role: 'user', text }]);
    setChatInput('');
    setTimeout(() => setChatMessages(prev => [...prev, { role: 'assistant', text: `I don't have a live answer for that yet, but you can explore the sections below for more details on the **${aircraft.model}**.` }]), 600);
  };

  const SectionTitle = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <div className="flex items-center gap-2">
      {icon}
      <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">{label}</p>
    </div>
  );

  const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-xl p-5 ${className}`} style={glass}>{children}</div>
  );

  const HighlightBox = ({ children, color = 'sky' }: { children: React.ReactNode; color?: 'sky' | 'emerald' | 'blue' | 'purple' | 'orange' | 'teal' }) => {
    const colors: Record<string, string> = {
      sky: 'rgba(14,165,233,0.08)', emerald: 'rgba(16,185,129,0.08)', blue: 'rgba(59,130,246,0.08)',
      purple: 'rgba(168,85,247,0.08)', orange: 'rgba(249,115,22,0.08)', teal: 'rgba(20,184,166,0.08)'
    };
    return <div className="rounded-xl p-4" style={{ ...glass, background: colors[color] }}>{children}</div>;
  };

  const tableWrap = (head: React.ReactNode, rows: React.ReactNode[]) => (
    <div className="overflow-x-auto rounded-xl" style={glass}>
      <table className="w-full text-sm text-white/80">
        <thead><tr className="border-b border-white/10">{head}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i} className={i < rows.length - 1 ? 'border-b border-white/5' : ''}>{r}</tr>)}</tbody>
      </table>
    </div>
  );

  const aircraftHiringContent: Record<string, React.ReactNode> = {
    'a220-300': (
      <div className="space-y-4">
        <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="Hiring Requirements by Airline Type" />
        <p className="text-sm text-white/70 leading-relaxed">Many operators now offer company-funded type ratings for the A220 to meet high demand, but minimum flight hour thresholds vary significantly between regional and major carriers.</p>
        {tableWrap(
          <><th className="text-left p-3 font-semibold">Airline</th><th className="text-left p-3 font-semibold">Position</th><th className="text-left p-3 font-semibold">Min. Total Hours</th><th className="text-left p-3 font-semibold">Key Requirements</th></>,
          [
            <><td className="p-3">airBaltic</td><td className="p-3">First Officer</td><td className="p-3">300–500 hrs</td><td className="p-3">300+ hrs on aircraft &gt;5.7t; EASA license</td></>,
            <><td className="p-3">Breeze Airways</td><td className="p-3">First Officer</td><td className="p-3">1,500 hrs</td><td className="p-3">FAA ATP/R-ATP; 500 hrs turbine; 50 hrs multi-engine</td></>,
            <><td className="p-3">QantasLink</td><td className="p-3">First Officer</td><td className="p-3">500–700 hrs</td><td className="p-3">CASA license; 200 hrs multi-engine/turbine command</td></>,
            <><td className="p-3">Air France</td><td className="p-3">First Officer</td><td className="p-3">~1,500 hrs</td><td className="p-3">Typically requires EASA ATPL</td></>,
            <><td className="p-3">Delta Air Lines</td><td className="p-3">First Officer</td><td className="p-3">1,500+ hrs</td><td className="p-3">FAA ATP; prefers 1,000+ hours Part 121</td></>
          ]
        )}
      </div>
    ),
    'a220-100': (
      <div className="space-y-4">
        <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="First Officer Requirements" />
        <GlassCard><ul className="space-y-1.5 text-sm text-white/70"><li><strong>Total Flight Time:</strong> 1,500 hours (FAA) or 500 hours (EASA/ICAO cadet)</li><li><strong>Multi-Engine/Turbine:</strong> 500 hrs preferred</li><li><strong>License:</strong> Valid ATPL or CPL with frozen ATPL</li><li><strong>Medical:</strong> Class 1</li><li><strong>English:</strong> ICAO Level 4</li></ul></GlassCard>
        <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="Direct Entry Captain Requirements" />
        <GlassCard><ul className="space-y-1.5 text-sm text-white/70"><li><strong>Total Flight Time:</strong> 3,000 – 5,000+ hours</li><li><strong>PIC Time:</strong> 1,000 hrs on multi-pilot turbojet</li><li><strong>Type Specific:</strong> Non-type rated accepted with glass cockpit/FBW experience</li></ul></GlassCard>
        <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="Career Opportunities & Bonuses" />
        <div className="space-y-3">
          <HighlightBox color="emerald"><h4 className="text-sm font-semibold text-emerald-400 mb-1">Sign-on Bonuses</h4><p className="text-xs text-white/70">$10,000 – $15,000 for type-rated pilots</p></HighlightBox>
          <HighlightBox color="blue"><h4 className="text-sm font-semibold text-blue-400 mb-1">Fast-Track Command</h4><p className="text-xs text-white/70">Faster path to the left seat due to backlog</p></HighlightBox>
        </div>
        <HighlightBox color="sky"><h3 className="text-sm font-bold text-sky-400 mb-1 uppercase tracking-wide">Recruiter's Note</h3><p className="text-sm text-white/70 italic">"The A220 is the best airframe for transitioning from Regional Jets to Mainline flying."</p></HighlightBox>
      </div>
    ),
    'a320': (
      <div className="space-y-4">
        <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="First Officer Requirements" />
        <GlassCard><ul className="space-y-1.5 text-sm text-white/70"><li><strong>Total Flight Time:</strong> 1,500 hours (FAA ATP) or 200 hours (EASA/ICAO cadet)</li><li><strong>Multi-Engine/Turbine:</strong> 500 hrs preferred</li><li><strong>License:</strong> Valid ATPL or CPL with frozen ATPL</li><li><strong>Type Rating:</strong> LCCs often require self-funded; legacy carriers provide via bond</li></ul></GlassCard>
        <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="Direct Entry Captain Requirements" />
        <GlassCard><ul className="space-y-1.5 text-sm text-white/70"><li><strong>Total Flight Time:</strong> 3,000 – 5,000+ hours</li><li><strong>Command Experience:</strong> 1,000 hrs PIC on multi-pilot turbojet</li><li><strong>Glass Cockpit:</strong> Mandatory; FBW experience a major advantage</li></ul></GlassCard>
        <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="Career Opportunities" />
        <div className="space-y-3">
          <HighlightBox color="emerald"><h4 className="text-sm font-semibold text-emerald-400 mb-1">The "Neo" Growth</h4><p className="text-xs text-white/70">Airlines are hiring at record rates to replace aging CEO fleets</p></HighlightBox>
          <HighlightBox color="blue"><h4 className="text-sm font-semibold text-blue-400 mb-1">Fast-Track Command</h4><p className="text-xs text-white/70">FO-to-Captain upgrades in 3–5 years in high-growth regions</p></HighlightBox>
        </div>
        <HighlightBox color="sky"><h3 className="text-sm font-bold text-sky-400 mb-1 uppercase tracking-wide">Career Path Note</h3><p className="text-sm text-white/70 italic">"The A320 is the ultimate 'Utility Rating.' It opens doors to hundreds of airlines and serves as the foundation for the A330 and A350."</p></HighlightBox>
      </div>
    ),
    'a330': (
      <div className="space-y-4">
        <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="First Officer Requirements" />
        <GlassCard><ul className="space-y-1.5 text-sm text-white/70"><li><strong>Total Flight Time:</strong> 3,000 hours (FAA) or 1,500 hours (EASA/ICAO)</li><li><strong>Multi-Engine/Turbine:</strong> 1,000 hrs minimum</li><li><strong>License:</strong> Valid ATPL</li><li><strong>Type Rating:</strong> Provided via bond; A320 pilots can transition via CCQ in 8-10 days</li></ul></GlassCard>
        <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="Direct Entry Captain Requirements" />
        <GlassCard><ul className="space-y-1.5 text-sm text-white/70"><li><strong>Total Flight Time:</strong> 5,000 – 8,000+ hours</li><li><strong>Command Experience:</strong> 2,000 hrs PIC</li><li><strong>Wide-body:</strong> Preferred but not mandatory</li></ul></GlassCard>
        <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="Career Opportunities" />
        <div className="space-y-3">
          <HighlightBox color="emerald"><h4 className="text-sm font-semibold text-emerald-400 mb-1">The "A320 Advantage"</h4><p className="text-xs text-white/70">CCQ transition is famously smooth</p></HighlightBox>
          <HighlightBox color="blue"><h4 className="text-sm font-semibold text-blue-400 mb-1">Heavy Lifestyle</h4><p className="text-xs text-white/70">Premium layovers and significantly higher compensation</p></HighlightBox>
        </div>
        <HighlightBox color="sky"><h3 className="text-sm font-bold text-sky-400 mb-1 uppercase tracking-wide">Career Path Note</h3><p className="text-sm text-white/70 italic">"The A330 is the best aircraft for achieving a 'Heavy' rating without the stress of a completely new flight deck."</p></HighlightBox>
      </div>
    )
  };

  const aircraftCompensationContent: Record<string, React.ReactNode> = {
    'a220-300': (
      <div className="space-y-4">
        <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="Compensation Package (Year 1 First Officer)" />
        <GlassCard><ul className="space-y-1.5 text-sm text-white/70"><li><strong>Base Salary (MMG):</strong> ~$100,000 – $115,000</li><li><strong>Flight Hourly Rate:</strong> $110 – $170/hr</li><li><strong>Per Diems (Tax-Free):</strong> ~$7,000 – $12,000</li><li><strong>Total Annual Cash (Year 1):</strong> ~$110,000 – $135,000</li></ul></GlassCard>
      </div>
    ),
    'a220-100': (
      <div className="space-y-4">
        <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="First Officer Earnings" />
        <GlassCard><ul className="space-y-1.5 text-sm text-white/70"><li><strong>Starting Salary (Year 1):</strong> $110,000 – $135,000</li><li><strong>Senior FO (Year 5+):</strong> $160,000 – $220,000</li><li><strong>Hourly Rate:</strong> $112 – $185/hr</li></ul></GlassCard>
        <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="Captain Earnings" />
        <GlassCard><ul className="space-y-1.5 text-sm text-white/70"><li><strong>Starting Command:</strong> $260,000 – $315,000</li><li><strong>Senior Captain:</strong> $350,000 – $450,000+</li><li><strong>Hourly Rate:</strong> $295 – $415/hr</li></ul></GlassCard>
        <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="Additional Benefits" />
        <GlassCard><ul className="space-y-1.5 text-sm text-white/70"><li><strong>Per Diems:</strong> $7,000 – $12,000 annually</li><li><strong>Retirement:</strong> 14% – 17% direct contribution</li><li><strong>Sign-on Bonuses:</strong> $10k – $15k</li><li><strong>Efficiency Bonus:</strong> Productivity pay above 75 hrs/month</li></ul></GlassCard>
        <HighlightBox color="sky"><h3 className="text-sm font-bold text-sky-400 mb-1 uppercase tracking-wide">Summary</h3><p className="text-sm text-white/70 italic">"The A220 is a financial winner. Pilots enjoy A320-level pay with 21st-century tech and a massive growth curve."</p></HighlightBox>
      </div>
    ),
    'a320': (
      <div className="space-y-4">
        <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="Annual Compensation Profiles (2026)" />
        <p className="text-sm text-white/70 leading-relaxed">The A320 often shares the same pay scale as larger wide-bodies at legacy airlines, meaning pilots earn premium rates while maintaining a short-haul lifestyle.</p>
        {tableWrap(
          <><th className="text-left p-3 font-semibold">Region</th><th className="text-left p-3 font-semibold">First Officer</th><th className="text-left p-3 font-semibold">Captain</th><th className="text-left p-3 font-semibold">Key Benefits</th></>,
          [
            <><td className="p-3">United States</td><td className="p-3">$120,000 – $200,000+</td><td className="p-3">$250,000 – $450,000+</td><td className="p-3">14–17% 401k direct</td></>,
            <><td className="p-3">Middle East</td><td className="p-3">$100,000 – $180,000</td><td className="p-3">$200,000 – $380,000</td><td className="p-3">Tax-free, housing, schooling</td></>,
            <><td className="p-3">Europe</td><td className="p-3">€50,000 – €150,000</td><td className="p-3">€150,000 – €350,000</td><td className="p-3">High job security</td></>,
            <><td className="p-3">India / Asia</td><td className="p-3">$30,000 – $80,000</td><td className="p-3">$100,000 – $250,000+</td><td className="p-3">Rapid upgrades</td></>
          ]
        )}
        <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="Carrier Spotlights" />
        <div className="space-y-3">
          <HighlightBox color="purple"><h4 className="text-sm font-semibold text-purple-400 mb-1">Lufthansa Mainline</h4><p className="text-xs text-white/70">"Golden Cage" pay scale with base salary ~85% of total pay.</p></HighlightBox>
          <HighlightBox color="orange"><h4 className="text-sm font-semibold text-orange-400 mb-1">Air France</h4><p className="text-xs text-white/70">Dual-pillar system with high fixed pay and productivity "Prime de Vol".</p></HighlightBox>
          <HighlightBox color="teal"><h4 className="text-sm font-semibold text-teal-400 mb-1">Etihad Airways</h4><p className="text-xs text-white/70">Tax-free packages up to $170,000 for A320 Captains.</p></HighlightBox>
        </div>
        <HighlightBox color="sky"><h3 className="text-sm font-bold text-sky-400 mb-1 uppercase tracking-wide">Summary</h3><p className="text-sm text-white/70 italic">"The A320 is the most portable rating in aviation. It offers high-level compensation that rivals wide-body pay in the U.S. and tax-free opportunities in the Middle East."</p></HighlightBox>
      </div>
    ),
    'a330': (
      <div className="space-y-4">
        <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="Wide-Body Compensation Profile (2026)" />
        <p className="text-sm text-white/70 leading-relaxed">The A330 offers premium compensation for "Heavy" wide-body flying, with significantly higher earnings than narrow-body aircraft.</p>
        <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="First Officer Earnings" />
        <GlassCard><ul className="space-y-1.5 text-sm text-white/70"><li><strong>Starting Salary (Year 1):</strong> $140,000 – $180,000</li><li><strong>Senior FO (Year 5+):</strong> $180,000 – $220,000</li><li><strong>Hourly Rate:</strong> $180 – $250/hr</li></ul></GlassCard>
        <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="Captain Earnings" />
        <GlassCard><ul className="space-y-1.5 text-sm text-white/70"><li><strong>Starting Command:</strong> $280,000 – $350,000</li><li><strong>Senior Captain:</strong> $350,000 – $480,000+</li><li><strong>Hourly Rate:</strong> $350 – $480/hr</li></ul></GlassCard>
        <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="Additional Benefits" />
        <GlassCard><ul className="space-y-1.5 text-sm text-white/70"><li><strong>Per Diems:</strong> $15,000 – $25,000 annually (tax-free)</li><li><strong>Premium Layovers:</strong> 24-48 hour stays in premium destinations</li><li><strong>Retirement:</strong> 16% – 20% direct pension/401k funding</li></ul></GlassCard>
        <HighlightBox color="sky"><h3 className="text-sm font-bold text-sky-400 mb-1 uppercase tracking-wide">Summary</h3><p className="text-sm text-white/70 italic">"The A330 rating is a 'passport' to global wide-body carriers. It offers a massive jump in pay and lifestyle for a fraction of the training time of a Boeing 787."</p></HighlightBox>
      </div>
    )
  };

  const aircraftComparisonContent: Record<string, React.ReactNode> = {
    'a220-300': (
      <div className="space-y-4">
        <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="A220-100 vs. A220-300" />
        <HighlightBox color="sky"><p className="text-sm text-sky-400 font-semibold mb-2">Important: Pilots do not choose between them.</p><p className="text-sm text-white/70">Both share the Common Type Rating (BD-500). When you get rated on one, you are legally qualified to fly both.</p></HighlightBox>
        {tableWrap(
          <><th className="text-left p-3 font-semibold">Feature</th><th className="text-left p-3 font-semibold">A220-100</th><th className="text-left p-3 font-semibold">A220-300</th></>,
          [
            <><td className="p-3 font-semibold">Handling</td><td className="p-3">More "twitchy" and responsive</td><td className="p-3">More stable and "heavy" feel</td></>,
            <><td className="p-3 font-semibold">Routes</td><td className="p-3">Short, high-frequency, niche</td><td className="p-3">Long-haul narrow-body</td></>,
            <><td className="p-3 font-semibold">Prestige</td><td className="p-3">Access to restricted airports</td><td className="p-3">Access to flagship routes</td></>,
            <><td className="p-3 font-semibold">Landing</td><td className="p-3">Harder to "grease"</td><td className="p-3">Easier to land smoothly</td></>,
            <><td className="p-3 font-semibold">Best For</td><td className="p-3">Stick-and-rudder lovers</td><td className="p-3">Stability and long-range</td></>
          ]
        )}
        <HighlightBox color="sky"><h3 className="text-sm font-bold text-sky-400 mb-1 uppercase tracking-wide">Pilot Recognition Verdict</h3><p className="text-sm text-white/70 italic">"Don't worry about choosing a variant—focus on getting the BD-500 rating."</p></HighlightBox>
      </div>
    ),
    'a220-100': (
      <div className="space-y-4">
        <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="A220-100 vs. A220-300" />
        <HighlightBox color="sky"><p className="text-sm text-sky-400 font-semibold mb-2">Important: Pilots do not choose between them.</p><p className="text-sm text-white/70">Both share the Common Type Rating (BD-500). When you get rated on one, you are legally qualified to fly both.</p></HighlightBox>
        {tableWrap(
          <><th className="text-left p-3 font-semibold">Feature</th><th className="text-left p-3 font-semibold">A220-100</th><th className="text-left p-3 font-semibold">A220-300</th></>,
          [
            <><td className="p-3 font-semibold">Handling</td><td className="p-3">More "twitchy" and responsive</td><td className="p-3">More stable and "heavy" feel</td></>,
            <><td className="p-3 font-semibold">Routes</td><td className="p-3">Short, high-frequency, niche</td><td className="p-3">Long-haul narrow-body</td></>,
            <><td className="p-3 font-semibold">Prestige</td><td className="p-3">Access to restricted airports</td><td className="p-3">Access to flagship routes</td></>,
            <><td className="p-3 font-semibold">Landing</td><td className="p-3">Harder to "grease"</td><td className="p-3">Easier to land smoothly</td></>,
            <><td className="p-3 font-semibold">Best For</td><td className="p-3">Stick-and-rudder lovers</td><td className="p-3">Stability and long-range</td></>
          ]
        )}
        <HighlightBox color="sky"><h3 className="text-sm font-bold text-sky-400 mb-1 uppercase tracking-wide">Pilot Recognition Verdict</h3><p className="text-sm text-white/70 italic">"Don't worry about choosing a variant—focus on getting the BD-500 rating."</p></HighlightBox>
      </div>
    ),
    'a320': (
      <div className="space-y-4">
        <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="A320 Comparison Profile" />
        <p className="text-sm text-white/70 leading-relaxed">The A320 is most frequently compared to its arch-rival, the Boeing 737, and its smaller, more modern sibling, the Airbus A220.</p>
        {tableWrap(
          <><th className="text-left p-3 font-semibold">Feature</th><th className="text-left p-3 font-semibold">A320</th><th className="text-left p-3 font-semibold">B737</th><th className="text-left p-3 font-semibold">A220-300</th></>,
          [
            <><td className="p-3 font-semibold">Control System</td><td className="p-3">Sidestick / FBW</td><td className="p-3">Control Yoke / Cables</td><td className="p-3">Sidestick / FBW</td></>,
            <><td className="p-3 font-semibold">Cockpit Tech</td><td className="p-3">Glass / ECAM</td><td className="p-3">Glass / Overhead</td><td className="p-3">Advanced 5-Screen</td></>,
            <><td className="p-3 font-semibold">Training Path</td><td className="p-3">Foundation for A330/A350</td><td className="p-3">Foundation for 777/787</td><td className="p-3">Standalone (Niche)</td></>,
            <><td className="p-3 font-semibold">Pilot Comfort</td><td className="p-3">High (Tray table)</td><td className="p-3">Moderate (Cramped)</td><td className="p-3">High (Newest)</td></>,
            <><td className="p-3 font-semibold">Market Role</td><td className="p-3">Global Backbone</td><td className="p-3">Global Backbone</td><td className="p-3">High-Efficiency Specialist</td></>,
            <><td className="p-3 font-semibold">Handling</td><td className="p-3">"Law" Protected</td><td className="p-3">Traditional Manual</td><td className="p-3">"Law" Protected</td></>
          ]
        )}
        <HighlightBox color="sky"><h3 className="text-sm font-bold text-sky-400 mb-1 uppercase tracking-wide">Pilot Recognition Verdict</h3><p className="text-sm text-white/70 italic">"The A320 is the industry standard. If you are looking for your first jet rating, this is the one."</p></HighlightBox>
        <HighlightBox color="emerald"><h3 className="text-sm font-bold text-emerald-400 mb-1 uppercase tracking-wide">CEO vs. NEO Summary</h3><p className="text-sm text-white/70 italic">"The 'neo' is the smarter, greener version of the world's most popular jet."</p></HighlightBox>
      </div>
    ),
    'a330': (
      <div className="space-y-4">
        <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="A320 to A330: The Career Leap" />
        <p className="text-sm text-white/70 leading-relaxed">This transition chart shows A320 pilots exactly how to level up their careers. Airbus's Common Cockpit Philosophy turns a narrow-body pilot into a wide-body "Heavy" pilot with minimal friction.</p>
        {tableWrap(
          <><th className="text-left p-3 font-semibold">Feature</th><th className="text-left p-3 font-semibold">A320</th><th className="text-left p-3 font-semibold">A330</th></>,
          [
            <><td className="p-3 font-semibold">Typical Mission</td><td className="p-3">1–4 Hour Regional</td><td className="p-3">6–12 Hour Long-Haul</td></>,
            <><td className="p-3 font-semibold">Flight Deck</td><td className="p-3">6-screen Glass</td><td className="p-3">95% Identical</td></>,
            <><td className="p-3 font-semibold">Sidestick Logic</td><td className="p-3">Normal/Alternate/Direct</td><td className="p-3">Same Laws</td></>,
            <><td className="p-3 font-semibold">Training Path</td><td className="p-3">Full Type Rating</td><td className="p-3">CCQ Short Course</td></>,
            <><td className="p-3 font-semibold">Pilot Workload</td><td className="p-3">High (multiple sectors)</td><td className="p-3">Low (cruise-heavy)</td></>,
            <><td className="p-3 font-semibold">Wake Category</td><td className="p-3">Medium</td><td className="p-3">Heavy</td></>,
            <><td className="p-3 font-semibold">Bunk/Rest</td><td className="p-3">None</td><td className="p-3">Dedicated Crew Rest</td></>
          ]
        )}
        <HighlightBox color="sky"><h3 className="text-sm font-bold text-sky-400 mb-1 uppercase tracking-wide">Strategic Advice</h3><p className="text-sm text-white/70 italic">"If you are an A320 pilot, the A330 rating is your passport to the world."</p></HighlightBox>
        <HighlightBox color="emerald"><h3 className="text-sm font-bold text-emerald-400 mb-1 uppercase tracking-wide">The "Pilot Recognition" Verdict</h3><p className="text-sm text-white/70 italic">"Don't stay in the narrow-body lane forever. The A330 is the most logical and highest-ROI upgrade for an A320-rated pilot."</p></HighlightBox>
      </div>
    )
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(10,15,25,0.98) 0%, rgba(5,8,14,1) 100%)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
      {onClose && (
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <X size={14} className="text-white/70" />
        </button>
      )}

      {/* Header */}
      <div className="relative z-10 h-64 md:h-80 w-full overflow-hidden">
        {aircraft.sketchfab_id ? (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center"><img src={aircraft.image} alt={aircraft.model} className="w-full h-full object-cover" /></div>
        ) : aircraft.image ? (
          <img src={aircraft.image} alt={aircraft.model} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center"><Plane size={72} className="text-white/20" /></div>
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,8,14,0.95) 0%, rgba(5,8,14,0.4) 50%, transparent 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-1" style={{ color: '#38bdf8' }}>{aircraft.category} · {aircraft.model}</p>
              <h2 className="text-3xl md:text-4xl font-black text-white">{aircraft.model}</h2>
              <p className="text-sm text-white/50 mt-1">{manufacturer?.name || aircraft.manufacturer_id} · {getAircraftStatus(aircraft)} · First flight {aircraft.first_flight || 'N/A'}</p>
            </div>
            <span className="text-sm font-black px-3 py-1 rounded-full mb-1" style={{ background: `${demandColor(aircraft.demandLevel)}15`, color: demandColor(aircraft.demandLevel), border: `1px solid ${demandColor(aircraft.demandLevel)}30` }}>
              {aircraft.demandLevel === 'high' ? 'High Demand' : aircraft.demandLevel === 'medium' ? 'Medium Demand' : 'Demand Data'}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6 md:p-8 space-y-6">
        {/* First Flight & Lifecycle */}
        <div className="space-y-4">
          <SectionTitle icon={<Clock size={14} className="text-white/40" />} label="First Flight" />
          <p className="text-2xl font-black text-white">{aircraft.first_flight || 'N/A'}</p>
          {aircraftAge !== null && <p className="text-sm text-white/50">{aircraftAge} years in service</p>}
          <SectionTitle icon={<User size={14} className="text-white/40" />} label="Manufacturer & Lifecycle" />
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <img src={manufacturer?.logo || '/images/set-01-logos/logo.png'} alt={manufacturer?.name} className="w-10 h-10 rounded-full object-contain bg-white p-1" style={{ border: '2px solid rgba(255,255,255,0.1)' }} />
              <div>
                <p className="text-xs font-black text-white">{manufacturer?.name || aircraft.manufacturer_id}</p>
                <p className="text-[10px] text-white/50">Manufacturer</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5" style={{ border: '2px solid rgba(255,255,255,0.1)' }}>
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
              </div>
              <div>
                <p className="text-xs font-black text-white">{getCareerScore(aircraft)}/100</p>
                <p className="text-[10px] text-white/50">Career Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/10">
          <div className="flex gap-1 overflow-x-auto">
            {['Overview', 'Training', 'Hiring', 'Compensation', 'Comparison'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-sky-500 text-sky-400' : 'border-transparent text-white/50 hover:text-white/80 hover:border-white/20'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Tab Content */}
          <div className="space-y-4">
            {activeTab === 'Overview' && (
              <div className="space-y-4">
                <SectionTitle icon={<Award size={14} className="text-white/40" />} label="Aircraft Overview" />
                <GlassCard>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div><p className="text-[9px] font-black text-white/30 uppercase tracking-wider">Pilots Rated</p><p className="text-xl font-black text-white">{getAircraftPilotCount(aircraft)}</p></div>
                    <div><p className="text-[9px] font-black text-white/30 uppercase tracking-wider">Operators</p><p className="text-xl font-black text-white">{aircraft.operatorCount || aircraft.operator_count || 'N/A'}</p></div>
                    <div><p className="text-[9px] font-black text-white/30 uppercase tracking-wider">Reputation</p><p className="text-xl font-black text-white">{manufacturer?.reputation_score || 0}</p></div>
                  </div>
                  <div className="h-px bg-white/5 mb-4" />
                  <div className="space-y-3">
                    <div>
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-wider mb-1">Description</p>
                      <p className="text-sm text-white/80 leading-relaxed">{aircraft.description || 'No description available.'}</p>
                    </div>
                    {aircraft.why_choose_rating && (
                      <div>
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-wider mb-1">Why Choose This Rating?</p>
                        <p className="text-sm text-white/80 leading-relaxed">{aircraft.why_choose_rating}</p>
                        {aircraft.id === 'a220-300' && onShowExtendedInfo && (
                          <button onClick={onShowExtendedInfo} className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-sky-400 hover:text-sky-300 transition-colors">
                            View Full Career Outlook<ChevronRight size={16} />
                          </button>
                        )}
                      </div>
                    )}
                    <div>
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-wider mb-1">Technical Specs</p>
                      <div className="space-y-1">
                        {aircraft.specifications && Object.entries(aircraft.specifications).slice(0, 5).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center py-1 border-b border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-white/40">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="text-xs text-white/80">{String(value)}</span>
                          </div>
                        ))}
                        {!aircraft.specifications && <p className="text-xs text-white/50">Specifications not available.</p>}
                      </div>
                    </div>
                  </div>
                </GlassCard>
                {aircraft.news && aircraft.news.length > 0 && (
                  <div className="space-y-3">
                    <SectionTitle icon={<Award size={14} className="text-white/40" />} label="Latest News" />
                    {aircraft.news.map(news => (
                      <div key={news.id} className="rounded-xl p-4" style={glass}>
                        <h4 className="font-semibold text-white text-sm mb-1">{news.title}</h4>
                        <p className="text-xs text-white/50 mb-2">{news.summary}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/30">{new Date(news.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          <a href={news.url} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-400 hover:text-sky-300 font-medium">Read more →</a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Training' && (
              <div className="space-y-4">
                <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="Training Requirements" />
                <GlassCard>
                  {aircraft.training_requirements ? (
                    <ul className="space-y-2.5">
                      <li className="flex items-start gap-3 text-sm text-white/70"><CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />Minimum Flight Hours: {aircraft.training_requirements.minimumHours}</li>
                      <li className="flex items-start gap-3 text-sm text-white/70"><CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />Ground School: {aircraft.training_requirements.groundSchoolHours} hours</li>
                      <li className="flex items-start gap-3 text-sm text-white/70"><CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />Simulator Training: {aircraft.training_requirements.simulatorHours} hours</li>
                      <li className="flex items-start gap-3 text-sm text-white/70"><CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />Flight Training: {aircraft.training_requirements.flightHours} hours</li>
                    </ul>
                  ) : (
                    <p className="text-sm text-white/50">Training requirements data not available for this aircraft.</p>
                  )}
                </GlassCard>
                {aircraft.training_requirements?.curriculum && (
                  <div className="space-y-3">
                    <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="Training Curriculum" />
                    {aircraft.training_requirements.curriculum.map((item: any, i: number) => (
                      <div key={i} className="rounded-xl p-4" style={glass}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white text-sm">{item.phase}</h4>
                          <span className="text-xs text-white/50 px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.06)' }}>{item.duration}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.topics.map((topic: string, j: number) => (
                            <span key={j} className="text-xs text-white/70 px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.06)' }}>{topic}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <SectionTitle icon={<CheckCircle2 size={14} className="text-white/40" />} label="Simulator Training" />
                <GlassCard>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><p className="text-xs text-white/40 mb-1">Simulator Type</p><p className="font-semibold text-white">{(aircraft.training_requirements?.simulator as any)?.type || 'Full Flight Simulator'}</p></div>
                    <div><p className="text-xs text-white/40 mb-1">Available Locations</p><p className="font-semibold text-white">{((aircraft.training_requirements?.simulator as any)?.locations || []).join(', ') || 'N/A'}</p></div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-white/40 mb-1">Features</p>
                    <div className="flex flex-wrap gap-2">
                      {((aircraft.training_requirements?.simulator as any)?.features || []).map((feature: string, i: number) => (
                        <span key={i} className="text-xs text-white/70 px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.06)' }}>{feature}</span>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}

            {activeTab === 'Hiring' && (aircraftHiringContent[aircraft.id] || (
              <GlassCard><p className="text-sm text-white/50 italic">Hiring requirements are not available for this aircraft.</p></GlassCard>
            ))}

            {activeTab === 'Compensation' && (aircraftCompensationContent[aircraft.id] || (
              <GlassCard><p className="text-sm text-white/50 italic">Compensation data is not available for this aircraft.</p></GlassCard>
            ))}

            {activeTab === 'Comparison' && (aircraftComparisonContent[aircraft.id] || (
              <GlassCard><p className="text-sm text-white/50 italic">Comparison data is not available for this aircraft.</p></GlassCard>
            ))}
          </div>

          {/* Right: AI Assistant */}
          <div className="space-y-4">
            <SectionTitle icon={<Bot size={14} className="text-red-400" />} label="Aircraft AI Assistant" />
            <div className="rounded-xl flex flex-col" style={{ ...glass, height: '520px' }}>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <AnimatePresence>
                  {chatMessages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      initial={{ opacity: 0, y: 16, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.05 }}
                    >
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-red-600 text-white' : 'bg-white/[0.06] border border-white/[0.10] text-white/90'}`}>
                        <p className="text-[13px] leading-relaxed whitespace-pre-wrap">
                          {msg.text.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white">{part}</strong> : part)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="p-3 border-t border-white/5">
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-red-500/20 transition-all">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-red-600 flex-shrink-0">
                    <rect x="4" y="4" width="16" height="2.5" rx="1" fill="currentColor" />
                    <rect x="4" y="9.25" width="16" height="2.5" rx="1" fill="currentColor" />
                    <rect x="4" y="14.5" width="16" height="2.5" rx="1" fill="currentColor" />
                  </svg>
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                    placeholder="Ask about this aircraft..."
                    className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                  <button onClick={sendChat} disabled={!chatInput.trim()} className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 bg-red-600 hover:bg-red-500">
                    <Send size={14} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
