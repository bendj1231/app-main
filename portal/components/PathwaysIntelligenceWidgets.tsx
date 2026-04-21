import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, AlertCircle, CheckCircle2, Clock, Zap, Star, Target,
  ChevronDown, ChevronUp, ExternalLink, Lightbulb, Award, BarChart3,
  ArrowRight, Flame, Crown
} from 'lucide-react';
import type { FullScoreResult, JobMatchesResult, RoadmapStep, TypeRatingRec, AirlineMatchResult } from '../hooks/usePathwaysIntelligence';

// ─── Animated Radar Chart ────────────────────────────────────────────────────

interface RadarChartProps {
  scores: { P: number; ET: number; B: number; L: number; S: number };
  size?: number;
  isDarkMode?: boolean;
  animate?: boolean;
}

export const RadarChart: React.FC<RadarChartProps> = ({ scores, size = 140, isDarkMode = true, animate = true }) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const labels = ['P', 'E×T', 'B', 'L', 'S'];
  const values = [scores.P, scores.ET, scores.B, scores.L, scores.S];
  const n = 5;

  const angleOf = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i: number, val: number) => {
    const a = angleOf(i);
    const pct = val / 100;
    return { x: cx + r * pct * Math.cos(a), y: cy + r * pct * Math.sin(a) };
  };
  const outer = (i: number) => ({ x: cx + r * Math.cos(angleOf(i)), y: cy + r * Math.sin(angleOf(i)) });

  const pilotPath = values.map((v, i) => `${i === 0 ? 'M' : 'L'}${pt(i, v).x.toFixed(1)},${pt(i, v).y.toFixed(1)}`).join(' ') + ' Z';
  const gridPath = (scale: number) => Array.from({ length: n }, (_, i) => outer(i))
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${(cx + (p.x - cx) * scale).toFixed(1)},${(cy + (p.y - cy) * scale).toFixed(1)}`).join(' ') + ' Z';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[0.25, 0.5, 0.75, 1].map(s => (
        <path key={s} d={gridPath(s)} fill="none" stroke={isDarkMode ? 'rgba(148,163,184,0.15)' : 'rgba(100,116,139,0.15)'} strokeWidth="1" />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const o = outer(i);
        return <line key={i} x1={cx} y1={cy} x2={o.x} y2={o.y} stroke={isDarkMode ? 'rgba(148,163,184,0.2)' : 'rgba(100,116,139,0.2)'} strokeWidth="1" />;
      })}
      {animate ? (
        <motion.path
          d={pilotPath}
          fill="rgba(56,189,248,0.20)"
          stroke="rgb(56,189,248)"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      ) : (
        <path d={pilotPath} fill="rgba(56,189,248,0.20)" stroke="rgb(56,189,248)" strokeWidth="2" />
      )}
      {values.map((v, i) => {
        const p = pt(i, v);
        return (
          <motion.circle key={i} cx={p.x} cy={p.y} r={3} fill="rgb(56,189,248)"
            initial={animate ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: animate ? 0.6 + i * 0.08 : 0, duration: 0.3 }}
          />
        );
      })}
      {labels.map((label, i) => {
        const o = outer(i);
        const lx = cx + (o.x - cx) * 1.28;
        const ly = cy + (o.y - cy) * 1.28;
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
            fontSize={size * 0.075} fill={isDarkMode ? 'rgb(148,163,184)' : 'rgb(100,116,139)'} fontWeight="600">
            {label}
          </text>
        );
      })}
    </svg>
  );
};

// ─── Score Velocity Badge ─────────────────────────────────────────────────────

export const ScoreVelocityBadge: React.FC<{ velocity: number; label: string; isDarkMode?: boolean }> = ({ velocity, label, isDarkMode = true }) => {
  if (!label) return null;
  const isPositive = velocity > 0;
  const isNeutral = velocity === 0;
  return (
    <motion.span
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
        isNeutral ? (isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600')
        : isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
      }`}
    >
      <TrendingUp className={`w-3 h-3 ${isPositive ? '' : 'rotate-180'}`} />
      {label}
    </motion.span>
  );
};

// ─── Profile Completion Nudge ─────────────────────────────────────────────────

export const ProfileCompletionNudge: React.FC<{ completeness: number; insights: FullScoreResult['insights']; isDarkMode?: boolean }> = ({ completeness, insights, isDarkMode = true }) => {
  const topInsight = insights.find(i => i.impact === 'high') || insights[0];
  if (completeness >= 90 || !topInsight) return null;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className={`rounded-xl px-4 py-3 flex items-center gap-3 mb-4 border ${
        isDarkMode ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'
      }`}
    >
      <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-semibold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>Profile {completeness}% complete</span>
          <div className="flex-1 h-1.5 rounded-full bg-slate-700 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-amber-400"
              initial={{ width: 0 }}
              animate={{ width: `${completeness}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>
        <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} truncate`}>{topInsight.message}</p>
      </div>
    </motion.div>
  );
};

// ─── Intelligence Header Banner (Job Listings) ────────────────────────────────

export const JobIntelligenceBanner: React.FC<{
  jobMatches: JobMatchesResult | null;
  loading: boolean;
  isDarkMode?: boolean;
}> = ({ jobMatches, loading, isDarkMode = true }) => {
  if (loading) {
    return (
      <div className={`rounded-2xl p-4 mb-6 animate-pulse ${isDarkMode ? 'bg-slate-800/60' : 'bg-slate-100'}`} style={{ height: 80 }} />
    );
  }
  if (!jobMatches) return null;
  const { matchesAbove75, matchesAbove90, totalJobs, pilotScore } = jobMatches;

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-4 mb-6 border ${isDarkMode ? 'bg-gradient-to-r from-sky-900/40 via-blue-900/30 to-slate-900/40 border-sky-500/20' : 'bg-gradient-to-r from-sky-50 via-blue-50 to-white border-sky-200'}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-sky-500/20' : 'bg-sky-100'}`}>
            <BarChart3 className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              You match <span className="text-sky-400">{matchesAbove75}</span> of {totalJobs} jobs above 75%
              {matchesAbove90 > 0 && <span className="text-emerald-400"> · {matchesAbove90} above 90%</span>}
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Based on your Recognition Score of {pilotScore.totalScore}/100</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: `E×T: ${pilotScore.totalScore}%`, color: 'sky' },
            { label: `B: ${pilotScore.B}%`, color: pilotScore.B >= 65 ? 'emerald' : 'amber' },
            { label: `L: ${pilotScore.L}%`, color: pilotScore.L >= 72 ? 'emerald' : 'amber' },
          ].map(pill => (
            <span key={pill.label} className={`px-2 py-1 rounded-full text-xs font-semibold ${
              pill.color === 'emerald' ? (isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-700')
              : pill.color === 'amber' ? (isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-700')
              : (isDarkMode ? 'bg-sky-500/20 text-sky-400' : 'bg-sky-50 text-sky-700')
            }`}>{pill.label}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Blind Spot Picks Row ─────────────────────────────────────────────────────

export const BlindSpotPicksRow: React.FC<{
  blindSpots: JobMatchesResult['blindSpotPicks'];
  loading: boolean;
  isDarkMode?: boolean;
  onDismiss?: () => void;
}> = ({ blindSpots, loading, isDarkMode = true, onDismiss }) => {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('blindspot_dismissed');
    if (stored) setDismissed(true);
  }, []);

  if (dismissed || loading || !blindSpots?.length) return null;

  const handleDismiss = () => {
    localStorage.setItem('blindspot_dismissed', '1');
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-6"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className={`text-sm font-semibold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>Blind Spot Picks — Outside your usual search</span>
        </div>
        <button onClick={handleDismiss} className={`text-xs ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'} transition-colors`}>Dismiss</button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {blindSpots.map((job, i) => (
          <motion.div
            key={job.jobId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex-shrink-0 w-64 rounded-xl p-3 border-2 border-amber-500/40 ${isDarkMode ? 'bg-amber-500/5' : 'bg-amber-50'}`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className={`text-sm font-semibold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{job.title}</p>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{job.company}</p>
              </div>
              <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">{job.matchPct}%</span>
            </div>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>You're a strong match — but this fell outside your usual interests</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ─── Gap Progress Bar (per job card) ─────────────────────────────────────────

export const JobGapBar: React.FC<{ hoursGap: number; reqHours: number; isDarkMode?: boolean }> = ({ hoursGap, reqHours, isDarkMode = true }) => {
  if (!reqHours) return null;
  const pct = reqHours > 0 ? Math.min(100, Math.round(((reqHours - hoursGap) / reqHours) * 100)) : 100;
  const color = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="mt-1.5">
      <div className={`h-1 w-full rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'} overflow-hidden`}>
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {hoursGap > 0 && (
        <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          {hoursGap.toLocaleString()} hrs to go
        </p>
      )}
    </div>
  );
};

// ─── Match Breakdown Popover ──────────────────────────────────────────────────

export const MatchBreakdownPopover: React.FC<{
  breakdown: { hours: number; typeRating: number; behavioral: number; language: number };
  matchPct: number;
  missingRating: string | null;
  isDarkMode?: boolean;
  onClose: () => void;
}> = ({ breakdown, matchPct, missingRating, isDarkMode = true, onClose }) => {
  const factors = [
    { label: 'Flight Hours', value: breakdown.hours, max: 40 },
    { label: 'Type Rating', value: breakdown.typeRating, max: 25 },
    { label: 'Behavioral Fit', value: breakdown.behavioral, max: 20 },
    { label: 'Language', value: breakdown.language, max: 15 },
  ];

  const improvements = [];
  if (breakdown.hours < 32) improvements.push('Build more flight hours to reach requirement');
  if (breakdown.typeRating < 20 && missingRating) improvements.push(`Obtain ${missingRating} type rating`);
  if (breakdown.behavioral < 15) improvements.push('Complete CRM & behavioral assessments');
  if (breakdown.language < 12) improvements.push('Improve ICAO language level to 5+');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -8 }}
      className={`absolute z-50 top-full mt-2 right-0 w-72 rounded-2xl shadow-2xl border p-4 ${
        isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
      }`}
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Match Breakdown</span>
        <button onClick={onClose} className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>✕</button>
      </div>
      <div className="space-y-2 mb-3">
        {factors.map(f => {
          const pct = Math.round((f.value / f.max) * 100);
          const color = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';
          return (
            <div key={f.label}>
              <div className="flex items-center justify-between text-xs mb-0.5">
                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>{f.label}</span>
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>{f.value}/{f.max}</span>
              </div>
              <div className={`h-1.5 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'} overflow-hidden`}>
                <motion.div className={`h-full rounded-full ${color}`} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
              </div>
            </div>
          );
        })}
      </div>
      {improvements.length > 0 && (
        <div className={`rounded-lg p-2.5 ${isDarkMode ? 'bg-sky-500/10 border border-sky-500/20' : 'bg-sky-50 border border-sky-200'}`}>
          <p className={`text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>To improve this match:</p>
          <ul className="space-y-1">
            {improvements.slice(0, 2).map((imp, i) => (
              <li key={i} className={`text-xs flex items-start gap-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                <ArrowRight className="w-3 h-3 text-sky-400 flex-shrink-0 mt-0.5" />
                {imp}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

// ─── Roadmap Timeline ─────────────────────────────────────────────────────────

export const RoadmapTimeline: React.FC<{
  steps: RoadmapStep[];
  loading: boolean;
  isDarkMode?: boolean;
}> = ({ steps, loading, isDarkMode = true }) => {
  const [expanded, setExpanded] = useState(true);

  if (loading) {
    return (
      <div className={`rounded-2xl p-5 mb-6 animate-pulse ${isDarkMode ? 'bg-slate-800/60' : 'bg-slate-100'}`} style={{ height: 160 }} />
    );
  }
  if (!steps?.length) return null;

  const statusIcon = (status: string) => {
    if (status === 'current') return <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-white" /></div>;
    if (status === 'complete' || status === 'ready') return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
    if (status === 'active') return <div className="w-5 h-5 rounded-full border-2 border-amber-400 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-amber-400" /></div>;
    return <div className={`w-5 h-5 rounded-full border-2 ${isDarkMode ? 'border-slate-600' : 'border-slate-300'}`} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border mb-6 overflow-hidden ${isDarkMode ? 'bg-slate-900/70 border-slate-700/50' : 'bg-white border-slate-200'}`}
    >
      <button
        onClick={() => setExpanded(e => !e)}
        className={`w-full flex items-center justify-between px-5 py-4 ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'} transition-colors`}
      >
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-sky-400" />
          <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Your Roadmap to This Pathway</span>
          {steps[3]?.etaMonths != null && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-sky-500/20 text-sky-400' : 'bg-sky-50 text-sky-600'}`}>
              {steps[3].etaMonths === 0 ? 'Ready Now' : `~${steps[3].etaMonths} months`}
            </span>
          )}
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 pb-5"
          >
            <div className="space-y-0">
              {steps.map((step, i) => (
                <div key={step.step} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="mt-1">{statusIcon(step.status)}</div>
                    {i < steps.length - 1 && (
                      <div className={`w-0.5 flex-1 my-1 ${step.status === 'current' || step.status === 'complete' || step.status === 'ready' ? 'bg-sky-500/40' : isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} style={{ minHeight: 24 }} />
                    )}
                  </div>
                  <div className="pb-4 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-semibold ${step.status === 'current' ? 'text-sky-400' : step.status === 'ready' || step.status === 'complete' ? 'text-emerald-400' : isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        Step {step.step}: {step.title}
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{step.description}</p>
                    {step.gaps && step.gaps.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {step.gaps.map((gap: any, gi: number) => (
                          <div key={gi} className={`flex items-start gap-2 p-2 rounded-lg text-xs ${gap.status === 'far' ? (isDarkMode ? 'bg-red-500/10' : 'bg-red-50') : (isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50')}`}>
                            <AlertCircle className={`w-3 h-3 flex-shrink-0 mt-0.5 ${gap.status === 'far' ? 'text-red-400' : 'text-amber-400'}`} />
                            <div>
                              <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{gap.dimension}: </span>
                              <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>{gap.suggestion}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {step.programs && step.programs.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {step.programs.map((prog: any, pi: number) => (
                          <div key={pi} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border ${prog.priority === 'high' ? (isDarkMode ? 'border-sky-500/40 bg-sky-500/10 text-sky-300' : 'border-sky-200 bg-sky-50 text-sky-700') : (isDarkMode ? 'border-slate-600 bg-slate-800 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600')}`}>
                            {prog.enrolled ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <ArrowRight className="w-3 h-3" />}
                            <span className="font-medium">{prog.name}</span>
                            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>{prog.scoreImpact}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {step.step === 4 && step.estimatedSalary && (
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{step.estimatedSalary} · {step.targetAirline}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Type Rating Recommendation Cards ────────────────────────────────────────

export const TypeRatingRecommendationBanner: React.FC<{
  recommendations: TypeRatingRec[];
  coverageLabel: string;
  airlinesAccessible: number;
  loading: boolean;
  isDarkMode?: boolean;
}> = ({ recommendations, coverageLabel, airlinesAccessible, loading, isDarkMode = true }) => {
  if (loading) {
    return <div className={`rounded-2xl p-5 mb-6 animate-pulse ${isDarkMode ? 'bg-slate-800/60' : 'bg-slate-100'}`} style={{ height: 140 }} />;
  }
  if (!recommendations?.length) return null;

  const top3 = recommendations.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recommended For You</span>
        </div>
        <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{coverageLabel}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {top3.map((rec, i) => (
          <motion.div
            key={rec.rating}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-xl p-4 border ${isDarkMode ? 'bg-slate-800/60 border-slate-700/50 hover:border-sky-500/40' : 'bg-white border-slate-200 hover:border-sky-300'} transition-colors`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-1.5">
                  {rec.priority === 'critical' && <Flame className="w-3.5 h-3.5 text-orange-400" />}
                  {rec.priority === 'prestige' && <Crown className="w-3.5 h-3.5 text-yellow-400" />}
                  {rec.priority === 'high' && <Star className="w-3.5 h-3.5 text-sky-400" />}
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{rec.rating}</span>
                </div>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{rec.family}</p>
              </div>
              <span className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>
                +{rec.jobsUnlocked} jobs
              </span>
            </div>
            <p className={`text-xs mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{rec.priorityLabel}</p>
            <div className={`text-xs space-y-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <p>Cost: <span className="font-medium">${rec.costUSD.toLocaleString()}</span></p>
              <p>{rec.roiLabel}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ─── Airline Match Badge ──────────────────────────────────────────────────────

export const AirlineMatchBadge: React.FC<{
  airlineId: string;
  airlineMatches: AirlineMatchResult[] | null;
  loading: boolean;
}> = ({ airlineId, airlineMatches, loading }) => {
  if (loading) return <div className="w-16 h-5 rounded-full bg-slate-700 animate-pulse" />;
  const match = airlineMatches?.find(a => a.id === airlineId);
  if (!match) return null;

  const colorClass = match.readinessColor === 'emerald'
    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    : match.readinessColor === 'amber'
    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    : 'bg-slate-700/50 text-slate-400 border-slate-600/50';

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${colorClass}`}
    >
      {match.matchPct}%
    </motion.span>
  );
};

// ─── Airline Readiness Groups Banner ─────────────────────────────────────────

export const AirlineReadinessBanner: React.FC<{
  readyNow: number;
  closeReach: number;
  longTerm: number;
  percentileLabel: string;
  globalPercentile: number;
  loading: boolean;
  isDarkMode?: boolean;
}> = ({ readyNow, closeReach, longTerm, percentileLabel, globalPercentile, loading, isDarkMode = true }) => {
  if (loading) return <div className={`rounded-2xl p-5 mb-6 animate-pulse ${isDarkMode ? 'bg-slate-800/60' : 'bg-slate-100'}`} style={{ height: 80 }} />;
  if (!readyNow && !closeReach && !longTerm) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-4 mb-6 border ${isDarkMode ? 'bg-gradient-to-r from-emerald-900/30 via-sky-900/20 to-slate-900/30 border-emerald-500/20' : 'bg-gradient-to-r from-emerald-50 via-sky-50 to-white border-emerald-200'}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{readyNow} <span className="text-emerald-400">Ready Now</span></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{closeReach} <span className="text-amber-400">Close</span></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-400" />
            <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{longTerm} Long-Term</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-yellow-400" />
          <span className={`text-xs font-semibold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>{percentileLabel}</span>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Score Live Widget ────────────────────────────────────────────────────────

export const ScoreLiveWidget: React.FC<{
  fullScore: FullScoreResult | null;
  loading: boolean;
  isDarkMode?: boolean;
}> = ({ fullScore, loading, isDarkMode = true }) => {
  if (loading) return <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 animate-pulse" />;

  const score = fullScore?.totalScore ?? null;
  const label = fullScore?.rankLabel ?? '';

  return (
    <div className="relative group">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ring-2 ${
        score !== null && score >= 70 ? 'ring-emerald-500/50 bg-gradient-to-br from-emerald-500 to-sky-500' :
        score !== null && score >= 50 ? 'ring-amber-500/50 bg-gradient-to-br from-amber-500 to-orange-500' :
        'ring-sky-500/50 bg-gradient-to-br from-sky-500 to-blue-600'
      }`}>
        <span className="text-white text-xs font-bold">{score ?? '?'}</span>
      </div>
      {label && (
        <div className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {label}
        </div>
      )}
    </div>
  );
};
