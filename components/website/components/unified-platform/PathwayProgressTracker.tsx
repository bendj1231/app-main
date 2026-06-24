import React from 'react';
import { motion } from 'framer-motion';
import {
  Target, CheckCircle2, Circle, Plane, Clock, Award, Briefcase, TrendingUp, AlertCircle, MapPin, GraduationCap, Shield, ArrowRight
} from 'lucide-react';
import type { TabId } from './types';

interface Requirement {
  id: string;
  label: string;
  target: number;
  current: number;
  unit: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

interface PathwayTarget {
  role: string;
  operator: string;
  minHours: number;
  requirements: Requirement[];
}

// ─── PATHWAY PROGRESS TRACKER ───────────────────────────────────────────────
export const PathwayProgressTracker: React.FC<{
  profile: any;
  onNavigate?: (page: string) => void;
  setTab?: (tab: TabId) => void;
}> = ({ profile, onNavigate, setTab }) => {
  const hours = profile?.total_flight_hours ?? 0;
  const verifiedHours = profile?.verified_flight_hours ?? hours * 0.6;
  const picHours = hours * 0.65;
  const xcHours = hours * 0.25;
  const multiHours = hours * 0.1;

  // Default target: First Officer / Regional FO
  const target: PathwayTarget = {
    role: 'First Officer',
    operator: 'Regional Airline',
    minHours: 1500,
    requirements: [
      { id: 'total', label: 'Total Flight Time', target: 1500, current: hours, unit: 'hrs', icon: Plane },
      { id: 'pic', label: 'PIC Time', target: 250, current: picHours, unit: 'hrs', icon: Award },
      { id: 'xc', label: 'Cross Country', target: 100, current: xcHours, unit: 'hrs', icon: MapPin },
      { id: 'multi', label: 'Multi-Engine Time', target: 50, current: multiHours, unit: 'hrs', icon: TrendingUp },
      { id: 'verified', label: 'Verified Hours', target: 1500, current: verifiedHours, unit: 'hrs', icon: Shield },
    ],
  };

  const checklist = [
    { id: 'ppl', label: 'Private Pilot License (PPL)', done: hasField(profile, ['ppl', 'private']) },
    { id: 'cpl', label: 'Commercial Pilot License (CPL)', done: hasField(profile, ['cpl', 'commercial']) },
    { id: 'ir', label: 'Instrument Rating', done: hasField(profile, ['instrument', 'ir']) },
    { id: 'multi', label: 'Multi-Engine Rating', done: hasField(profile, ['multi-engine', 'multi']) },
    { id: 'atpl', label: 'ATPL / Frozen ATPL', done: hasField(profile, ['atpl', 'airline transport', 'frozen atpl']) },
    { id: 'medical', label: 'Current Class 1 Medical', done: !profile?.medical_expired },
    { id: 'hours', label: `${target.minHours} Total Hours`, done: hours >= target.minHours },
    { id: 'verified', label: 'Hours Verified', done: verifiedHours >= target.minHours },
  ];

  const completed = checklist.filter(c => c.done).length;
  const total = checklist.length;
  const overallPct = Math.round((completed / total) * 100);

  const nextObjective = checklist.find(c => !c.done) || checklist[checklist.length - 1];
  const nextReq = target.requirements.find(r => r.current < r.target);
  const hoursRemaining = Math.max(0, target.minHours - hours);

  return (
    <div className="space-y-5">
      {/* Career loading screen header */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.18), rgba(15,23,42,0.92))', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.4), transparent 70%)' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Target size={18} className="text-sky-400" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-sky-400">Pathway Progress Tracker</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-black text-white tracking-tight">{target.role} Track — {target.operator}</h2>
            <span className="text-sm font-black text-sky-400">{overallPct}%</span>
          </div>
          <p className="text-xs text-white/60 mb-4">
            {hoursRemaining > 0
              ? `${hoursRemaining} hours remaining to meet the ${target.minHours} hr minimum.`
              : 'Minimum hour requirement met. Focus on verification and ratings.'}
          </p>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #38bdf8, #2563eb)' }}
              initial={{ width: 0 }}
              animate={{ width: `${overallPct}%` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[9px] font-black text-white/40 uppercase tracking-wider">
            <span>0 hrs</span>
            <span>{target.minHours} hrs</span>
          </div>
        </div>
      </div>

      {/* Objective checklist */}
      <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap size={16} className="text-white/50" />
            <span className="text-[10px] font-black tracking-wider uppercase text-white/50">Objectives</span>
          </div>
          <span className="text-[10px] font-black text-white/40">{completed}/{total} done</span>
        </div>
        <div className="space-y-2">
          {checklist.map(({ id, label, done }) => (
            <div key={id} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: done ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)'}` }}>
              <div className="flex items-center gap-3">
                {done ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Circle size={16} className="text-white/20" />}
                <span className={`text-[11px] font-bold tracking-wide ${done ? 'text-white/60' : 'text-white'}`}>{label}</span>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider ${done ? 'text-emerald-400' : 'text-amber-400'}`}>{done ? 'Complete' : 'Missing'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Requirement bars */}
      <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-white/50" />
          <span className="text-[10px] font-black tracking-wider uppercase text-white/50">Hour Requirements</span>
        </div>
        <div className="space-y-4">
          {target.requirements.map(({ id, label, target: t, current, unit, icon: Icon }) => {
            const pct = Math.min((current / t) * 100, 100);
            const remaining = Math.max(0, t - current);
            return (
              <div key={id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon size={13} className="text-white/50" />
                    <span className="text-[11px] font-bold text-white/80">{label}</span>
                  </div>
                  <span className="text-[10px] font-black text-white/60">{current.toFixed(1)} / {t} {unit}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: pct >= 100 ? '#10b981' : '#38bdf8' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                {remaining > 0 && (
                  <p className="text-[9px] text-white/40">{remaining.toFixed(1)} {unit} remaining</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual mapper / perspective */}
      <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={16} className="text-white/50" />
          <span className="text-[10px] font-black tracking-wider uppercase text-white/50">Perspective Mapper</span>
        </div>
        <div className="relative h-24 rounded-xl overflow-hidden flex items-center px-4" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="absolute left-0 right-0 top-1/2 h-[2px]" style={{ background: 'rgba(255,255,255,0.1)' }} />
          {/* Milestones */}
          {[
            { label: 'PPL', pct: 13, icon: GraduationCap },
            { label: 'CPL', pct: 33, icon: Briefcase },
            { label: 'IR', pct: 53, icon: Target },
            { label: 'FO', pct: 100, icon: Plane },
          ].map(({ label, pct, icon: Icon }) => (
            <div key={label} className="absolute flex flex-col items-center gap-1" style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: overallPct >= pct ? 'rgba(56,189,248,0.25)' : 'rgba(255,255,255,0.08)', border: `1px solid ${overallPct >= pct ? 'rgba(56,189,248,0.5)' : 'rgba(255,255,255,0.15)'}` }}>
                <Icon size={12} className={overallPct >= pct ? 'text-sky-400' : 'text-white/30'} />
              </div>
              <span className="text-[8px] font-black text-white/40">{label}</span>
            </div>
          ))}
          {/* Pilot marker */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.8)]"
            initial={{ left: '0%' }}
            animate={{ left: `${Math.min(overallPct, 100)}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transform: 'translate(-50%, -50%)' }}
          />
        </div>
      </div>

      {/* Next action reminder */}
      <div className="rounded-2xl p-5 flex items-center justify-between gap-4" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(251,191,36,0.25)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-400 mt-0.5" />
          <div>
            <p className="text-[10px] font-black tracking-wider uppercase text-amber-400 mb-1">Next Objective</p>
            <p className="text-sm font-black text-white">{nextObjective?.label || nextReq?.label}</p>
            <p className="text-xs text-white/50 mt-0.5">
              {nextReq && nextReq.current < nextReq.target
                ? `${Math.max(0, nextReq.target - nextReq.current).toFixed(1)} ${nextReq.unit} left • ${nextReq.label}`
                : 'Complete the next checklist item to advance.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setTab ? setTab('pathways') : onNavigate?.('pathways')}
          className="px-4 py-2 rounded-xl text-[10px] font-black tracking-wider text-white transition-all hover:brightness-110 flex items-center gap-1 whitespace-nowrap"
          style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.9), rgba(217,119,6,0.9))' }}
        >
          VIEW PATHWAYS <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};

function hasField(profile: any, terms: string[]) {
  const text = [
    profile?.pilot_stage,
    profile?.license_type,
    profile?.current_level,
    profile?.current_occupation,
    Array.isArray(profile?.license_types) ? profile.license_types.join(' ') : profile?.license_types,
    Array.isArray(profile?.ratings) ? profile.ratings.join(' ') : profile?.ratings,
  ].join(' ').toLowerCase();
  return terms.some(t => text.includes(t));
}

export default PathwayProgressTracker;
