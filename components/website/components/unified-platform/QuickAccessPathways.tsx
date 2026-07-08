import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronRight, Plane, Star, Send, X, Activity, Award, Clock } from 'lucide-react';
import {
  useAirlinePathways,
  type AirlinePathway,
  type AirlinePathwayProfile,
} from './useAirlinePathways';

type PathwayTab = 'latest' | 'recommended' | 'submitted';

const TAB_CONFIG: { id: PathwayTab; label: string }[] = [
  { id: 'latest', label: 'Latest Pathways' },
  { id: 'recommended', label: 'Recommended' },
  { id: 'submitted', label: 'Submitted' },
];

const PathwayCard: React.FC<{ pathway: AirlinePathway; onClick: () => void }> = ({
  pathway,
  onClick,
}) => {
  const badgeColor =
    pathway.match >= 85 ? '#10b981' : pathway.match >= 70 ? '#3b82f6' : '#f59e0b';

  return (
    <div
      onClick={onClick}
      className="group flex w-[300px] max-w-full flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl shadow-slate-200/50 transition-all hover:scale-[1.02] hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/5 active:scale-[0.98] cursor-pointer sm:w-[420px] sm:max-w-[420px] sm:flex-row"
    >
      {/* Left: airline logo */}
      <div className="relative h-32 sm:h-auto w-full shrink-0 overflow-hidden flex items-center justify-center bg-slate-50 border-b sm:border-b-0 sm:border-r border-slate-100 sm:w-5/12">
        <img
          src={pathway.logo}
          alt={pathway.name}
          className="h-full w-full max-h-[70%] max-w-[70%] sm:max-h-[75%] sm:max-w-[75%] object-contain object-center"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      {/* Right: content */}
      <div className="flex w-full flex-col justify-between p-4 sm:w-7/12 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 truncate">
              {pathway.name}
            </h4>
            <p className="mt-0.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-indigo-600/90 truncate">
              {pathway.subtitle}
            </p>
          </div>
          {/* Match badge */}
          <span
            className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border text-[10px] font-extrabold shadow-sm"
            style={{
              background: `${badgeColor}15`,
              color: badgeColor,
              borderColor: `${badgeColor}30`,
              boxShadow: `0 1px 10px ${badgeColor}10`,
            }}
          >
            {pathway.match}
          </span>
        </div>

        {/* Stats block */}
        <div className="my-3 grid grid-cols-2 gap-2 rounded-xl border border-slate-200/60 bg-slate-50 p-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Region</p>
            <p className="mt-0.5 text-sm font-black text-slate-900 truncate">{pathway.region}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Category</p>
            <p className="mt-0.5 text-sm font-black text-slate-900 truncate">{pathway.category}</p>
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center justify-between">
          <div className="group/action inline-flex items-center -ml-2 px-2 py-1.5 rounded-lg text-xs font-bold text-slate-900 hover:bg-slate-100 transition-colors hover:text-red-600">
            View Pathway Details
            <ChevronRight
              size={14}
              className="ml-1.5 transform transition-transform group-hover/action:translate-x-0.5"
            />
          </div>
          {pathway.submitted && (
            <Star size={14} className="text-amber-500 fill-amber-500" />
          )}
        </div>
      </div>
    </div>
  );
};

type ModalTab = 'expectations' | 'requirements' | 'pathways';

const PathwayModal: React.FC<{
  pathway: AirlinePathway;
  onClose: () => void;
  onSelect?: (airline: AirlinePathway) => void;
}> = ({ pathway, onClose, onSelect }) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('expectations');
  const badgeColor =
    pathway.match >= 85 ? '#10b981' : pathway.match >= 70 ? '#3b82f6' : '#f59e0b';

  const requirements = [
    { label: 'Total Flight Time', value: `${1500 + pathway.gaps * 100} hours`, met: pathway.match >= 80 },
    { label: 'Medical Certificate', value: 'Class 1', met: true },
    { label: 'ICAO English Proficiency', value: 'Level 4+', met: pathway.match >= 70 },
    { label: 'Type Rating / Training', value: pathway.category, met: pathway.gaps <= 2 },
    { label: 'Background & References', value: 'Verified', met: pathway.submitted },
  ];

  const TAB_CONFIG: { id: ModalTab; label: string }[] = [
    { id: 'expectations', label: 'Expectations' },
    { id: 'requirements', label: 'Requirements' },
    { id: 'pathways', label: 'Pathways' },
  ];

  return ReactDOM.createPortal(
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[linear-gradient(180deg,rgba(10,15,25,0.98)_0%,rgba(5,8,14,1)_100%)] border border-slate-200 dark:border-white/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-black/[0.06] dark:bg-white/[0.06] hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10"
        >
          <X size={14} className="text-slate-500 dark:text-white/70" />
        </button>

        {/* Hero */}
        <div className="relative h-56 md:h-72 w-full overflow-hidden flex items-center justify-center bg-slate-900">
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(5,8,14,0.95) 0%, rgba(5,8,14,0.4) 50%, transparent 100%)' }}
          />
          <img
            src={pathway.logo}
            alt={pathway.name}
            className="relative z-10 h-28 md:h-36 w-auto max-w-[70%] object-contain drop-shadow-2xl"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-1" style={{ color: badgeColor }}>
                  {pathway.region} · {pathway.category}
                </p>
                <h2 className="text-3xl md:text-4xl font-black text-white">{pathway.name}</h2>
                <p className="text-sm text-white/50 mt-1">{pathway.subtitle}</p>
              </div>
              <span
                className="text-sm font-black px-3 py-1 rounded-full mb-1 shrink-0 ml-4"
                style={{
                  background: `${badgeColor}15`,
                  color: badgeColor,
                  border: `1px solid ${badgeColor}30`,
                }}
              >
                Match {pathway.match}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="relative p-6 md:p-8">
          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06]">
            {TAB_CONFIG.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-black tracking-wide transition-all ${
                    active
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/10'
                      : 'text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white/80'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="space-y-6 relative z-10 mb-6 min-h-[260px]">
            {activeTab === 'expectations' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center gap-4 p-4 rounded-xl border" style={{ background: `${badgeColor}10`, borderColor: `${badgeColor}25` }}>
                  <div
                    className="w-14 h-14 flex items-center justify-center rounded-full border text-lg font-extrabold shadow-sm shrink-0"
                    style={{
                      background: `${badgeColor}15`,
                      color: badgeColor,
                      borderColor: `${badgeColor}30`,
                      boxShadow: `0 1px 10px ${badgeColor}10`,
                    }}
                  >
                    {pathway.match}
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white font-bold text-sm">Profile Match</p>
                    <p className="text-slate-500 dark:text-white/35 text-xs mt-0.5">
                      {pathway.match >= 85 ? 'Strong fit for your profile' : pathway.match >= 70 ? 'Good fit with minor gaps' : 'Entry pathway — build hours to improve'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-slate-400 dark:text-white/40" />
                    <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 dark:text-white/40 uppercase">What to Expect</p>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-white/70 leading-relaxed">
                    The {pathway.subtitle} at {pathway.name} is a {pathway.category.toLowerCase()} opportunity based in {pathway.region}. Expect structured training, competitive progression, and access to a {pathway.match >= 80 ? 'global' : 'regional'} network.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Award size={14} className="text-slate-400 dark:text-white/40" />
                    <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 dark:text-white/40 uppercase">Highlights</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pathway.benefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="px-3 py-1.5 rounded-full text-[11px] font-black"
                        style={{ background: `${badgeColor}15`, color: badgeColor, border: `1px solid ${badgeColor}30` }}
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'requirements' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={14} className="text-slate-400 dark:text-white/40" />
                  <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 dark:text-white/40 uppercase">Eligibility Checklist</p>
                </div>
                {requirements.map((req) => (
                  <div
                    key={req.label}
                    className="flex items-center justify-between rounded-xl p-3.5 border"
                    style={{ background: req.met ? `${badgeColor}08` : 'rgba(245,158,11,0.06)', borderColor: req.met ? `${badgeColor}25` : 'rgba(245,158,11,0.15)' }}
                  >
                    <div>
                      <p className={`text-xs font-black ${req.met ? 'text-slate-900 dark:text-white' : 'text-amber-700 dark:text-amber-300'}`}>{req.label}</p>
                      <p className="text-[10px] text-slate-500 dark:text-white/40 mt-0.5">{req.value}</p>
                    </div>
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                      style={{
                        background: req.met ? `${badgeColor}20` : 'rgba(245,158,11,0.12)',
                        color: req.met ? badgeColor : '#f59e0b',
                      }}
                    >
                      {req.met ? '✓' : '!'}
                    </div>
                  </div>
                ))}
                <p className="text-[10px] text-slate-500 dark:text-white/30 leading-relaxed">
                  {pathway.gaps} gaps identified. Closing these will improve your match score and move you closer to eligibility.
                </p>
              </div>
            )}

            {activeTab === 'pathways' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="rounded-xl p-5 bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-white/[0.06] backdrop-blur-xl">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-wider">Match</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white">{pathway.match}%</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-wider">Gaps</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white">{pathway.gaps}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-wider">Status</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white">{pathway.submitted ? 'Submitted' : 'Open'}</p>
                    </div>
                  </div>
                  <div className="h-px bg-slate-200 dark:bg-white/5 mb-4" />
                  <div className="space-y-3">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-wider mb-1">Region</p>
                      <p className="text-sm text-slate-700 dark:text-white/80">{pathway.region}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-wider mb-1">Category</p>
                      <p className="text-sm text-slate-700 dark:text-white/80">{pathway.category}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-wider mb-1">Program</p>
                      <p className="text-sm text-slate-700 dark:text-white/80">{pathway.subtitle}</p>
                    </div>
                  </div>
                </div>

                {pathway.submitted ? (
                  <div className="flex items-center gap-3 rounded-xl p-4 bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06]">
                    <div className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-white/10 flex items-center justify-center bg-emerald-500/10">
                      <Star size={16} className="text-emerald-500 fill-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white">Interest Submitted</p>
                      <p className="text-[10px] text-slate-500 dark:text-white/50">You have expressed interest in this pathway.</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl p-4" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                    <div className="flex items-start gap-2">
                      <Award size={14} className="text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-black text-amber-700 dark:text-amber-300">Open Pathway</p>
                        <p className="text-[10px] text-amber-700/70 dark:text-amber-300/60 leading-relaxed mt-1">
                          Submit your interest to signal your application intent and track this pathway in your dashboard.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action */}
          <button
            onClick={() => {
              onSelect?.(pathway);
              onClose();
            }}
            className="w-full py-3 text-white font-black rounded-xl transition-all text-sm tracking-wide"
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #be123c 100%)',
              boxShadow: '0 8px 24px -8px rgba(220,38,38,0.4)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 32px -10px rgba(220,38,38,0.55)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px -8px rgba(220,38,38,0.4)'; }}
          >
            {onSelect ? 'View Full Pathway Details' : 'Submit Interest'}
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export const QuickAccessPathways: React.FC<{
  profile?: AirlinePathwayProfile;
  onSelect?: (airline: AirlinePathway) => void;
  pathways?: AirlinePathway[];
  recommended?: AirlinePathway[];
  latest?: AirlinePathway[];
  submitted?: AirlinePathway[];
  loading?: boolean;
}> = ({ profile, onSelect, pathways: pathwaysProp, recommended: recommendedProp, latest: latestProp, submitted: submittedProp, loading: loadingProp }) => {
  const hook = useAirlinePathways(profile);
  const allPathways = pathwaysProp ?? hook.pathways;
  const recommended = recommendedProp ?? hook.recommended;
  const latest = latestProp ?? hook.latest;
  const submitted = submittedProp ?? hook.submitted;
  const loading = loadingProp ?? hook.loading;
  const [activeTab, setActiveTab] = useState<PathwayTab>('recommended');
  const [selectedPathway, setSelectedPathway] = useState<AirlinePathway | null>(null);

  const filteredPathways =
    activeTab === 'recommended'
      ? recommended
      : activeTab === 'latest'
        ? latest
        : activeTab === 'submitted'
          ? submitted
          : allPathways;

  const displayedPathways = filteredPathways.slice(0, 20);

  const handleSelect = (pathway: AirlinePathway) => {
    setSelectedPathway(pathway);
  };

  return (
    <div className="w-full space-y-6 text-slate-900 rounded-2xl p-4 md:p-8 bg-transparent">
      {/* Header — same style as Digital Logbook section header */}
      <div className="flex items-center gap-3">
        <Zap size={22} className="text-red-500" />
        <div>
          <p className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">Career Pathways</p>
          <h3 className="text-lg md:text-xl font-bold text-slate-900">Quick Access Pathways</h3>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 text-xs font-bold">
        {TAB_CONFIG.map((tab) => {
          const count =
            tab.id === 'recommended'
              ? recommended.length
              : tab.id === 'latest'
                ? latest.length
                : submitted.length;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 md:px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                active
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/10'
                  : 'bg-slate-200/60 text-slate-600 hover:bg-slate-200/90'
              }`}
            >
              {tab.label}
              <span className={`ml-1 text-[10px] ${active ? 'opacity-80' : 'text-slate-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden rounded-2xl">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-slate-500">
              <Plane size={20} className="animate-pulse" />
              <span className="text-sm font-bold">Loading airline pathways...</span>
            </div>
          </div>
        ) : displayedPathways.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Send size={32} className="text-slate-300 mb-3" />
            <p className="text-slate-900 font-bold text-sm mb-1">
              No {TAB_CONFIG.find((t) => t.id === activeTab)?.label?.toLowerCase()} pathways yet
            </p>
            <p className="text-slate-500 text-xs max-w-sm">
              {activeTab === 'submitted'
                ? 'Submit interest to airlines and track your applications here.'
                : 'Discover new airline pathways and start matching your profile.'}
            </p>
          </div>
        ) : (
          <>
            <style>{`
              @keyframes pathwayScroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .pathway-carousel {
                animation: pathwayScroll 45s linear infinite;
              }
              .pathway-carousel:hover {
                animation-play-state: paused;
              }
            `}</style>
            <div className="relative overflow-hidden py-4">
              <div
                key={activeTab}
                className="pathway-carousel flex gap-4 px-4 md:px-6"
                style={{ width: 'max-content' }}
              >
                {[...displayedPathways, ...displayedPathways].map((pathway, i) => (
                  <PathwayCard
                    key={`${pathway.id}-${i}`}
                    pathway={pathway}
                    onClick={() => handleSelect(pathway)}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedPathway && (
          <PathwayModal
            pathway={selectedPathway}
            onClose={() => setSelectedPathway(null)}
            onSelect={onSelect}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickAccessPathways;
