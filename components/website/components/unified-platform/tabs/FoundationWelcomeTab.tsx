import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Award, Users, Clock, ChevronRight, Star, GraduationCap, Plane } from 'lucide-react';
import type { TabId } from '../types';

interface FoundationWelcomeTabProps {
  setTab: (tab: TabId) => void;
  onNavigate: (page: string) => void;
}

export const FoundationWelcomeTab: React.FC<FoundationWelcomeTabProps> = ({ setTab, onNavigate }) => {
  const features = [
    {
      icon: BookOpen,
      title: 'Foundation Program',
      desc: '$49 · Pilot development, thinking, leadership skills, behaviorism, cognitive skills.',
      color: 'from-sky-500 to-blue-600',
    },
    {
      icon: GraduationCap,
      title: 'Transition Program',
      desc: '$299 · Airline transition, industry alignment. 9 core competencies, Airbus HINFACT applications.',
      color: 'from-indigo-500 to-purple-600',
    },
    {
      icon: Award,
      title: 'EBT Video Scoring',
      desc: 'Recorded interview after 50-hour mentorship. Cognitive behaviorism and constructivism alignment.',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: Users,
      title: 'Mentorship Network',
      desc: 'One-to-one CRM skills through consultation and support. Become a mentor yourself.',
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  const steps = [
    { num: '01', title: 'Enroll', desc: 'Start with the Foundation Program ($49)' },
    { num: '02', title: 'Learn', desc: 'Complete modules at your own pace' },
    { num: '03', title: 'Mentor', desc: 'Help 50 pilots under supervision' },
    { num: '04', title: 'Verify', desc: 'EBT video scoring for airlines' },
  ];

  return (
    <div className="relative z-10 flex flex-col items-center min-h-screen px-4 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        {/* WingMentor Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png"
            alt="WingMentor"
            className="h-16 w-auto object-contain"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>

        <p className="text-[10px] font-black tracking-[0.25em] uppercase text-sky-400 mb-3">
          Programs
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
          FOUNDATION<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">PROGRAM</span>
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed max-w-lg mx-auto mb-6">
          Don't let your investment crash. Bridge the gap between flight school and airline cockpit
          with structured mentorship, behavioral scoring, and industry-aligned competencies.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('foundational-program')}
            className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all hover:brightness-110 hover:scale-105 flex items-center gap-2"
          >
            Start Foundation Program
            <ChevronRight size={14} />
          </button>
          <button
            onClick={() => setTab('programs' as TabId)}
            className="px-6 py-3 text-white text-xs font-black uppercase tracking-wider rounded-xl border border-white/20 transition-all hover:bg-white/10 flex items-center gap-2"
          >
            Browse All Programs
          </button>
        </div>
      </motion.div>

      {/* 4-Step Journey */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-4xl mx-auto mb-12"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {steps.map((s, i) => (
            <div
              key={s.num}
              className="relative p-4 rounded-xl text-left"
              style={{
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <span className="text-[10px] font-black text-sky-400 tracking-wider">{s.num}</span>
              <h3 className="text-sm font-bold text-white mt-1">{s.title}</h3>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-[1px] bg-white/20" />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-4xl mx-auto mb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group relative p-5 rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
                onClick={() => onNavigate('foundational-program')}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center mb-3`}>
                  <Icon size={18} className="text-white" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{f.title}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">{f.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-sky-400 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight size={10} />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Recognition Score CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full max-w-4xl mx-auto"
      >
        <div
          className="relative p-6 rounded-2xl text-center overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sky-400 via-blue-500 to-purple-500" />
          <Star size={20} className="text-amber-400 mx-auto mb-3" />
          <h3 className="text-lg font-black text-white mb-2">Your Recognition Score is Your Currency</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto mb-4">
            Complete programs, log hours, and verify credentials to build your score.
            Airlines pull from our database — your score unlocks pathway access.
          </p>
          <button
            onClick={() => setTab('score' as TabId)}
            className="px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white rounded-lg border border-white/20 transition-all hover:bg-white/10"
          >
            View Score Breakdown
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FoundationWelcomeTab;
