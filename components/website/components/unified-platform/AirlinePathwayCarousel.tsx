import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FolderOpen, ChevronRight, Plane, Clock, Star, ArrowRight, Send } from 'lucide-react';

interface AirlineManifestEntry {
  name: string;
  status: string;
  file: string;
  title: string;
  url?: string | null;
  width?: number | null;
  height?: number | null;
  mime?: string | null;
  path: string;
  source?: string;
  note?: string;
}

interface AirlinePathway {
  id: string;
  name: string;
  logo: string;
  region: string;
  category: string;
  match: number;
  gaps: number;
  subtitle: string;
  benefits: string[];
  submitted?: boolean;
}

type PathwayTab = 'latest' | 'recommended' | 'submitted';

const TAB_CONFIG: { id: PathwayTab; label: string }[] = [
  { id: 'latest', label: 'Latest Pathways' },
  { id: 'recommended', label: 'Recommended' },
  { id: 'submitted', label: 'Submitted' },
];

const RECOMMENDED_AIRLINES = new Set([
  'Singapore Airlines',
  'Cathay Pacific',
  'Philippine Airlines',
  'Cebu Pacific',
  'Qantas',
  'Air New Zealand',
  'All Nippon Airways',
  'Japan Airlines',
  'Korean Air',
  'Malaysia Airlines',
  'Thai Airways',
  'Vietnam Airlines',
  'IndiGo',
  'Air India',
  'Garuda Indonesia',
  'EVA Air',
  'China Airlines',
  'AirAsia',
  'Bangkok Airways',
  'Fiji Airways',
  'SriLankan Airlines',
  'Biman Bangladesh Airlines',
  'Royal Brunei Airlines',
]);

const LATEST_AIRLINES = new Set([
  'Starlux Airlines',
  'Zipair',
  'Akasa Air',
  'Air Seoul',
  'Tway Air',
  'Peach Aviation',
  'Scoot',
  'Jeju Air',
  'Jin Air',
  'Air Busan',
  'Eastar Jet',
  'Skymark Airlines',
  'Star Flyer',
  'Solaseed Air',
  'Spring Japan',
  'Hong Kong Express',
  'Tigerair Taiwan',
  'Mandarin Airlines',
  'VietJet Air',
  'Bamboo Airways',
  'Thai AirAsia',
  'Thai Lion Air',
  'Nok Air',
  'Citilink',
  'Batik Air',
  'Lion Air',
  'SkyJet Airlines',
  'Sunlight Air',
  'Royal Air Philippines',
  'Air Juan',
  'Sky Pasada',
  'Cebgo',
  'Philippines AirAsia',
]);

const SUBMITTED_AIRLINES = new Set([
  'Cebu Pacific',
  'Philippine Airlines',
  'AirAsia',
  'Philippines AirAsia',
]);

const SUBTITLES = [
  'First Officer Pipeline',
  'Direct Entry Captain',
  'Cadet Development Program',
  'Type-Rated Placement',
  'International Expansion',
  'Regional FO Track',
];

function generateSubtitle(name: string): string {
  const idx = name.length % SUBTITLES.length;
  return SUBTITLES[idx];
}

function generateMatch(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const base = 65 + (Math.abs(hash) % 30);
  return Math.min(98, Math.max(55, base));
}

function generateGaps(match: number): number {
  if (match >= 90) return 1;
  if (match >= 80) return 2;
  if (match >= 70) return 4;
  return 6;
}

function generateBenefits(match: number): string[] {
  if (match >= 90) return ['Fast-track', 'Hiring now'];
  if (match >= 80) return ['Training included', 'Global network'];
  if (match >= 70) return ['Competitive package', 'Upgrade path'];
  return ['Entry pathway', 'Build hours'];
}

function regionFromPath(path: string): string {
  const first = path.split('/')[0];
  return first
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function categoryFromPath(path: string): string {
  const second = path.split('/')[1] || 'operator';
  return second
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

interface AirlinePathwayProfile {
  total_flight_hours?: number | string | null;
  verification_status?: string | Record<string, unknown> | null;
  subscription_tier?: string | null;
  recognition_tier?: string | null;
}

export const AirlinePathwayCarousel: React.FC<{
  profile?: AirlinePathwayProfile;
  onSelect?: (airline: AirlinePathway) => void;
}> = ({ profile, onSelect }) => {
  const [manifest, setManifest] = useState<AirlineManifestEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<PathwayTab>('recommended');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/images/airline-logos/APAC/manifest.json')
      .then((r) => r.json())
      .then((data: AirlineManifestEntry[]) => {
        if (cancelled) return;
        const valid = data.filter((e) => e.status === 'downloaded' && e.path);
        setManifest(valid);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load airline logo manifest:', err);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const allPathways = useMemo<AirlinePathway[]>(() => {
    const hours =
      typeof profile?.total_flight_hours === 'string'
        ? parseFloat(profile.total_flight_hours)
        : typeof profile?.total_flight_hours === 'number'
          ? profile.total_flight_hours
          : 0;
    const verified =
      (typeof profile?.verification_status === 'string' &&
        profile.verification_status === 'verified') ||
      (typeof profile?.verification_status === 'object' &&
        profile?.verification_status !== null &&
        profile.verification_status.status === 'verified');
    const isSubscriber =
      profile?.subscription_tier === 'recognition_plus' ||
      profile?.recognition_tier === 'recognition_plus' ||
      profile?.subscription_tier === 'enterprise';

    return manifest.map((entry) => {
      let match = generateMatch(entry.name);
      if (verified) match += 5;
      if (isSubscriber) match += 3;
      if (hours >= 1500) match += 4;
      else if (hours >= 500) match += 2;
      match = Math.min(99, match);
      const gaps = generateGaps(match);
      return {
        id: slugify(entry.name),
        name: entry.name,
        logo: `/images/airline-logos/APAC/${entry.path}`,
        region: regionFromPath(entry.path),
        category: categoryFromPath(entry.path),
        match,
        gaps,
        subtitle: generateSubtitle(entry.name),
        benefits: generateBenefits(match),
        submitted: SUBMITTED_AIRLINES.has(entry.name),
      };
    });
  }, [manifest, profile]);

  const filteredPathways = useMemo(() => {
    if (activeTab === 'recommended') {
      return allPathways
        .filter((p) => RECOMMENDED_AIRLINES.has(p.name))
        .sort((a, b) => b.match - a.match);
    }
    if (activeTab === 'latest') {
      return allPathways
        .filter((p) => LATEST_AIRLINES.has(p.name))
        .sort((a, b) => b.match - a.match);
    }
    if (activeTab === 'submitted') {
      return allPathways.filter((p) => p.submitted).sort((a, b) => b.match - a.match);
    }
    return allPathways;
  }, [allPathways, activeTab]);

  const displayedPathways = filteredPathways.slice(0, 20);
  const averageMatch = displayedPathways.length
    ? Math.round(displayedPathways.reduce((sum, p) => sum + p.match, 0) / displayedPathways.length)
    : 0;

  const scrollBy = (direction: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 320, behavior: 'smooth' });
  };

  const handleSelect = (pathway: AirlinePathway) => {
    setSelectedId(pathway.id);
    onSelect?.(pathway);
  };

  return (
    <div
      className="backdrop-blur-2xl border border-white/20 p-8 shadow-2xl rounded-xl"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 12px 40px rgba(0,0,0,0.12)',
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <FolderOpen size={22} className="text-green-400" />
        <h3 className="text-xl font-bold text-white">» PATHWAY RECOMMENDATIONS</h3>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-2 mb-6 overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {TAB_CONFIG.map((tab) => {
          const count =
            tab.id === 'recommended'
              ? allPathways.filter((p) => RECOMMENDED_AIRLINES.has(p.name)).length
              : tab.id === 'latest'
                ? allPathways.filter((p) => LATEST_AIRLINES.has(p.name)).length
                : allPathways.filter((p) => p.submitted).length;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                active
                  ? 'bg-blue-500/80 text-white shadow-lg border-blue-400/40'
                  : 'bg-white/8 text-white/70 hover:bg-white/16 hover:text-white border-white/15'
              }`}
              style={active ? {
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 12px rgba(59,130,246,0.25)',
              } : {
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              {tab.label}
              <span
                className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-white/10 text-white/60'}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Carousel */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-white/60">
              <Plane size={20} className="animate-pulse" />
              <span className="text-sm font-bold">Loading airline pathways...</span>
            </div>
          </div>
        ) : displayedPathways.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Send size={32} className="text-white/30 mb-3" />
            <p className="text-white font-bold text-sm mb-1">
              No {TAB_CONFIG.find((t) => t.id === activeTab)?.label?.toLowerCase()} pathways yet
            </p>
            <p className="text-white/50 text-xs max-w-sm">
              {activeTab === 'submitted'
                ? 'Submit interest to airlines and track your applications here.'
                : 'Discover new airline pathways and start matching your profile.'}
            </p>
          </div>
        ) : (
          <>
            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto pt-1 pb-3 px-1 scroll-smooth"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255,255,255,0.2) transparent',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {displayedPathways.map((pathway) => {
                const isSelected = selectedId === pathway.id;
                return (
                  <button
                    key={pathway.id}
                    onClick={() => handleSelect(pathway)}
                    className={`flex-shrink-0 rounded-xl transition-all relative overflow-hidden text-left ${
                      isSelected ? 'shadow-2xl' : 'hover:shadow-lg'
                    }`}
                    style={{
                      width: '170px',
                      border: `2px solid ${isSelected ? 'rgba(14, 165, 233, 0.55)' : 'rgba(255,255,255,0.18)'}`,
                      background: isSelected ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(12px) saturate(1.1)',
                      WebkitBackdropFilter: 'blur(12px) saturate(1.1)',
                      boxShadow: isSelected
                        ? 'inset 0 1px 0 rgba(255,255,255,0.2), 0 0 24px rgba(14,165,233,0.25)'
                        : 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 12px rgba(0,0,0,0.06)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.16)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)';
                        e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
                        e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 12px rgba(0,0,0,0.06)';
                      }
                    }}
                  >
                    {/* Top: Logo on frosted light background */}
                    <div
                      className="h-[90px] relative overflow-hidden flex items-center justify-center p-3"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,255,255,0.25))',
                        borderBottom: '1px solid rgba(255,255,255,0.15)',
                      }}
                    >
                      <img
                        src={pathway.logo}
                        alt={pathway.name}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    {/* Bottom: Name and meta on frosted bg */}
                    <div className="p-3.5">
                      <p className="text-sm font-bold text-white truncate mb-1" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>{pathway.name}</p>
                      <div className="flex items-center justify-between text-[10px] text-white/70 mb-2">
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {pathway.subtitle}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            pathway.match >= 85
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/25'
                              : pathway.match >= 70
                                ? 'bg-blue-500/15 text-blue-300 border-blue-400/25'
                                : 'bg-amber-500/15 text-amber-300 border-amber-400/25'
                          }`}
                          style={{ backdropFilter: 'blur(4px)' }}
                        >
                          {pathway.match}% Match
                        </span>
                        {pathway.submitted && activeTab !== 'submitted' && (
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Scroll arrows */}
            <button
              onClick={() => scrollBy(-1)}
              className="absolute left-0 top-1/3 -translate-y-1/2 w-9 h-9 flex items-center justify-center z-10 transition-all rounded-full"
              style={{
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.25)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.22)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
              }}
            >
              <ChevronRight size={16} className="text-white rotate-180" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              className="absolute right-0 top-1/3 -translate-y-1/2 w-9 h-9 flex items-center justify-center z-10 transition-all rounded-full"
              style={{
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.25)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.22)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
              }}
            >
              <ChevronRight size={16} className="text-white" />
            </button>
          </>
        )}
      </div>

      {/* Insights footer */}
      <div className="mt-6 p-4 rounded-xl" style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))',
        backdropFilter: 'blur(12px) saturate(1.1)',
        WebkitBackdropFilter: 'blur(12px) saturate(1.1)',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 12px rgba(0,0,0,0.04)',
      }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-teal-400 rounded-full" />
          <span className="text-sm text-teal-400 font-bold">INSIGHTS</span>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          {activeTab === 'submitted' ? (
            <>
              You have submitted interest to{' '}
              <span className="text-white font-bold">
                {allPathways.filter((p) => p.submitted).length} airlines
              </span>
              . Verified pilots receive faster responses through the PilotRecognition pathway
              pipeline.
            </>
          ) : (
            <>
              Your profile matches{' '}
              <span className="text-white font-bold">
                {displayedPathways.length} {activeTab === 'latest' ? 'new' : 'high-potential'}{' '}
                pathways
              </span>{' '}
              with an average compatibility of{' '}
              <span className="text-white font-bold">{averageMatch}%</span>. Focus on completing the{' '}
              <span className="text-blue-400 font-bold">Transition Program</span> to increase your
              match score by an average of <span className="text-green-400 font-bold">12%</span>.
            </>
          )}
        </p>
        <button
          onClick={() =>
            window.dispatchEvent(new CustomEvent('open-tab', { detail: { tab: 'pathways' } }))
          }
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
        >
          Browse all pathways <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default AirlinePathwayCarousel;
