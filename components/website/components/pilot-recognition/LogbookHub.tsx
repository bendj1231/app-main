import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { safeRedirect } from '@/lib/url-validator';
import { BookMarked, Plane, RefreshCw, Plus, ChevronRight, Clock, Award, Link, CheckCircle, AlertCircle, ExternalLink, ArrowLeft, X, Send, Bot, User, Upload } from 'lucide-react';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import { useTheme } from '@/components/website/context/ThemeContext';
import { DigitalLogbookPage } from './DigitalLogbookPage';
import { CockpitFlightHoursDashboard } from '../unified-platform/CockpitFlightHoursDashboard';

interface LogbookHubProps {
  profile: any;
  onNavigate?: (path: string) => void;
  onCompleteProfile?: () => void;
}

interface SyncedProvider {
  id: string;
  provider: string;
  connected_at: string;
  last_synced_at: string | null;
  status: 'active' | 'error' | 'pending';
  total_hours?: number;
  flight_count?: number;
  metadata?: any;
}

const PROVIDER_META: Record<string, { name: string; logo: string; logoImg?: string; color: string; bg: string; url: string; region: string; badge?: string; method: string; methodColor: string; status: 'available' | 'coming_soon'; supports: string }> = {
  myflightbook: {
    name: 'MyFlightBook',
    logo: '📘',
    logoImg: 'https://myflightbook.com/logbook/Images/mfblogonew.png',
    color: '#00b4d8',
    bg: 'rgba(0,180,216,0.08)',
    url: 'https://myflightbook.com',
    region: 'Global',
    badge: 'Free',
    method: 'OAuth 2.0',
    methodColor: '#00b4d8',
    status: 'available',
    supports: 'Sync + CSV Import',
  },
  foreflight: {
    name: 'ForeFlight',
    logo: '✈️',
    logoImg: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/foreflight.png',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.08)',
    url: 'https://foreflight.com',
    region: 'Global · iOS / Web',
    badge: 'Certified',
    method: 'API Key',
    methodColor: '#818cf8',
    status: 'available',
    supports: 'CSV Import Only',
  },
  safelog: {
    name: 'Safelog',
    logo: '�',
    logoImg: 'https://images.g2crowd.com/uploads/product/image/social_landscape/social_landscape_3bec1397ab81178f1b2445f607f16189/safelog.png',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    url: 'https://safelog.com',
    region: 'Global · Web / Mobile',
    badge: 'Certified',
    method: 'Direct API',
    methodColor: '#34d399',
    status: 'available',
    supports: 'CSV Import Only',
  },
  logten: {
    name: 'LogTen Pro',
    logo: '�',
    logoImg: 'https://www.promptloop.com/_next/image?url=https%3A%2F%2Fcdn.promptloop.com%2Fbf22b421-ff8a-4b6e-9012-ebb6e4cbd10d.png&w=3840&q=75',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    url: 'https://coradine.com',
    region: 'iOS / macOS',
    badge: 'Certified',
    method: 'CSV Import',
    methodColor: '#fbbf24',
    status: 'available',
    supports: 'CSV Import Only',
  },
  recognitionplus: {
    name: 'Upload Your Logbook — Get Verified',
    logo: '🏅',
    color: '#dc2626',
    bg: 'rgba(220,38,38,0.08)',
    url: '/recognition-plus',
    region: 'Verified by ATO / Operator',
    badge: 'Verified',
    method: 'Recognition+',
    methodColor: '#ef4444',
    status: 'available',
    supports: 'Upload once. Verified for life.',
  },
};

const StatCard: React.FC<{ label: string; value: string | number; sub?: string; icon: React.ReactNode; accent: string }> = ({ label, value, sub, icon, accent }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.07]">
    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}>
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-black tracking-[0.18em] text-slate-400 dark:text-white/30 uppercase">{label}</p>
      <p className="text-xl font-black text-slate-900 dark:text-white leading-tight">{value}</p>
      {sub && <p className="text-[10px] text-slate-500 dark:text-white/40">{sub}</p>}
    </div>
  </div>
);

const ProviderCard: React.FC<{ provider: SyncedProvider; onOpenLogbook: () => void }> = ({ provider, onOpenLogbook }) => {
  const { isDarkMode } = useTheme();
  const meta = PROVIDER_META[provider.provider] ?? PROVIDER_META.manual;
  const isActive = provider.status === 'active';
  const lastSync = provider.last_synced_at
    ? new Date(provider.last_synced_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })
    : 'Never synced';

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        background: isDarkMode ? '#000000' : '#ffffff',
        border: `1px solid ${isActive ? meta.color + '30' : isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.08)',
      }}
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
            style={{
              background: isDarkMode ? '#111111' : '#f8fafc',
              border: `1px solid ${meta.color}25`,
            }}
          >
            {meta.logo}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{meta.name}</p>
              {isActive ? (
                <span className="flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>
                  <CheckCircle size={8} /> SYNCED
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}>
                  <AlertCircle size={8} /> ERROR
                </span>
              )}
            </div>
            <p className={`text-[10px] ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>Last sync: {lastSync}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div
            className="rounded-lg p-2.5 text-center"
            style={{ background: isDarkMode ? '#111111' : '#f8fafc', border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}
          >
            <p className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{provider.total_hours?.toFixed(1) ?? '—'}</p>
            <p className={`text-[9px] font-black tracking-wider uppercase ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>Total Hrs</p>
          </div>
          <div
            className="rounded-lg p-2.5 text-center"
            style={{ background: isDarkMode ? '#111111' : '#f8fafc', border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}
          >
            <p className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{provider.flight_count ?? '—'}</p>
            <p className={`text-[9px] font-black tracking-wider uppercase ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>Flights</p>
          </div>
        </div>
      </div>

      <div className={`flex border-t ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
        <button onClick={onOpenLogbook} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 transition-colors text-[10px] font-black tracking-wider ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-100'}`} style={{ color: meta.color }}>
          <BookMarked size={11} /> VIEW LOGBOOK
        </button>
        {meta.url && (
          <a href={meta.url} target="_blank" rel="noopener noreferrer" className={`px-3 flex items-center justify-center border-l ${isDarkMode ? 'border-white/5 hover:bg-white/5 text-white/30 hover:text-white/60' : 'border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-600'} transition-colors`}>
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
};

const ConnectProviderCard: React.FC<{ providerKey: string; selected: boolean; onSelect: (key: string) => void; onConnect?: (key: string) => void }> = ({ providerKey, selected, onSelect, onConnect }) => {
  const { isDarkMode } = useTheme();
  const meta = PROVIDER_META[providerKey] ?? PROVIDER_META.manual;
  const isComing = meta.status === 'coming_soon';
  const isRecognitionPlus = providerKey === 'recognitionplus';
  return (
    <div
      className="relative group flex flex-row items-center gap-3 px-3 rounded-xl w-full transition-all overflow-hidden"
      style={{
        background: isRecognitionPlus ? '#dc2626' : (isDarkMode ? '#000000' : '#ffffff'),
        border: selected ? `1px solid ${meta.color}40` : isRecognitionPlus ? '1px solid rgba(255,255,255,0.25)' : `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        boxShadow: selected ? `0 0 20px ${meta.color}15` : isRecognitionPlus ? '0 4px 24px rgba(220,38,38,0.35)' : (isDarkMode ? '0 4px 16px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.08)'),
      }}
    >
      {/* Logo — directly on card, no box */}
      {isRecognitionPlus ? (
        <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}><Upload size={14} /></span>
      ) : meta.logoImg ? (
        <img src={meta.logoImg} alt={meta.name} className="flex-shrink-0 w-7 h-7 object-contain opacity-90" />
      ) : (
        <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-lg">{meta.logo}</span>
      )}

      {/* Middle text */}
      <div className="flex-1 min-w-0 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-black tracking-wide ${isRecognitionPlus || isDarkMode ? 'text-white' : 'text-slate-900'}`}>{meta.name.toUpperCase()}</span>
          {meta.badge && (
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={isRecognitionPlus ? { background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' } : { background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>{meta.badge}</span>
          )}
        </div>
        <p className={`text-[9px] mt-0.5 ${isRecognitionPlus ? 'text-white/70' : (isDarkMode ? 'text-white/30' : 'text-slate-500')}`}>{meta.region}{providerKey === 'myflightbook' ? ' · Default logbook' : ''}</p>
        <p className={`text-[9px] mt-0.5 ${isRecognitionPlus ? 'text-white/50' : (isDarkMode ? 'text-white/20' : 'text-slate-400')}`}>{meta.supports}</p>
      </div>

      {/* Right: Connect / Import button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(providerKey);
          onConnect?.(providerKey);
        }}
        className={`flex-shrink-0 px-3 py-1.5 text-[10px] font-black tracking-wide transition-all hover:brightness-110 ${
          isRecognitionPlus
            ? 'bg-white text-red-600 rounded-full'
            : isDarkMode
              ? 'text-white rounded-lg'
              : 'text-slate-900 rounded-lg bg-slate-100 border border-slate-200'
        }`}
        style={isRecognitionPlus ? {} : (isDarkMode ? {
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        } : {})}
      >
        {isRecognitionPlus ? 'Get Verified →' : meta.supports === 'CSV Import Only' ? 'Import CSV →' : 'Connect →'}
      </button>

      {/* Selected glow border */}
      {selected && (
        <div className="absolute inset-0 rounded-xl pointer-events-none" style={{ boxShadow: `inset 0 0 0 1px ${meta.color}30, 0 0 24px ${meta.color}10` }} />
      )}
    </div>
  );
};

type AircraftCarouselItem = {
  name: string;
  type: string;
  hours: number;
  date: string;
  color: string;
  img: string;
  tail: string;
  landings: number;
  grade: string;
  instructor: string;
  remarks: string;
  route: string;
  conditions: string;
  engine: string;
  totalTime: number;
  crew: { name: string; role: string; position: string; pic: string }[];
};

const FlightCard: React.FC<{ ac: AircraftCarouselItem; onClick: () => void }> = ({ ac, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex w-[300px] flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-xl shadow-black/10 dark:shadow-black/40 transition-all hover:scale-[1.02] hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/5 active:scale-[0.98] cursor-pointer sm:w-auto sm:max-w-xl sm:flex-row"
    >
      {/* Left: Aircraft Image with clean, ambient vignette mask */}
      <div className="relative h-40 w-full shrink-0 overflow-hidden sm:h-auto sm:w-5/12">
        <img
          src={ac.img}
          alt={ac.type}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-slate-950/20 to-white dark:to-slate-950" />
      </div>

      {/* Right: Beautifully structured, high-contrast typography */}
      <div className="flex w-full flex-col justify-between p-4 sm:w-7/12 sm:p-6">
        {/* Header Block */}
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">{ac.name}</h4>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-indigo-400/90">{ac.type} · {ac.tail}</p>
          </div>
          {/* Polished glassmorphism badge */}
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full border text-xs font-extrabold shadow-sm"
            style={{
              background: `${ac.color}15`,
              color: ac.color,
              borderColor: `${ac.color}30`,
              boxShadow: `0 1px 10px ${ac.color}10`,
            }}
          >
            {ac.grade}
          </span>
        </div>

        {/* Clean, high-contrast stats block */}
        <div className="my-4 grid grid-cols-3 gap-2 rounded-xl border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/40 p-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Duration</p>
            <p className="mt-0.5 text-base font-black text-slate-900 dark:text-white">{ac.hours}h</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Landings</p>
            <p className="mt-0.5 text-base font-black text-slate-900 dark:text-white">{ac.landings}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Date</p>
            <p className="mt-1.5 whitespace-nowrap text-xs font-bold text-slate-700 dark:text-slate-200">{ac.date}</p>
          </div>
        </div>

        {/* Notes & ultra-visible action trigger */}
        <div>
          <p className="mb-3 line-clamp-2 text-xs font-medium italic leading-relaxed text-slate-700 dark:text-slate-300">
            {ac.remarks}
          </p>
          <div className="group inline-flex items-center -ml-2 px-2 py-1.5 rounded-lg text-xs font-bold text-slate-900 dark:text-white bg-slate-100/0 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors hover:text-red-600 dark:hover:text-red-400">
            View Flight Details
            <ChevronRight size={14} className="ml-1.5 transform transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

type SubPage = 'hub' | 'logbook' | 'sync';

export const LogbookHub: React.FC<LogbookHubProps> = ({ profile, onNavigate, onCompleteProfile }) => {
  const { callApi } = useWorkerAuth();
  const providersRef = useRef<HTMLDivElement>(null);
  const [subPage, setSubPage] = useState<SubPage>('hub');
  const [providers, setProviders] = useState<SyncedProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [totalFlights, setTotalFlights] = useState<number>(0);
  const [recentFlights, setRecentFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAircraft, setSelectedAircraft] = useState<any | null>(null);
  const [chatMessages, setChatMessages] = useState<{role:'user'|'assistant';text:string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [csvModalProvider, setCsvModalProvider] = useState<string | null>(null);
  const [, setSearchParams] = useSearchParams();

  const viewFlightInLogbook = useCallback((ac: typeof AIRCRAFT_CAROUSEL_DATA[number]) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('tab', 'profile');
      next.set('section', 'my_flightbook');
      next.set('flight', ac.tail);
      if (ac.img) next.set('img', ac.img);
      return next;
    });
  }, [setSearchParams]);

  const AIRCRAFT_CAROUSEL_DATA = [
    { name: 'Cessna 172S', type: 'C172', hours: 3.2, date: '28 Jun 2026', color: '#38bdf8', img: '/images/manufacturers/cessna/cessna-cessna_172.jpg', tail: 'RP-C1234', landings: 4, grade: 'A-', instructor: 'Capt. Reyes', remarks: 'Smooth short-field landing. Wind correction on final was precise.', route: 'RPLL - RPLC', conditions: 'VFR, 12kt wind 090°', engine: 'Lycoming IO-360-L2A', totalTime: 342.5, crew: [
      { name: 'Capt. Reyes', role: 'CFI', position: 'Right Seat', pic: 'https://i.pravatar.cc/150?u=reyes' },
      { name: 'Juan Dela Cruz', role: 'CPL Student', position: 'Left Seat', pic: 'https://i.pravatar.cc/150?u=juan' },
    ]},
    { name: 'Piper PA-44', type: 'PA44', hours: 2.5, date: '25 Jun 2026', color: '#818cf8', img: '/images/manufacturers/piper/piper-pa28.jpg', tail: 'RP-S8820', landings: 3, grade: 'B+', instructor: 'Capt. Dela Cruz', remarks: 'Good engine-out procedures. Maintain heading during single-engine ops.', route: 'RPLL - RPLI', conditions: 'VFR, scattered clouds 3,000ft', engine: 'Lycoming O-360-A1H6 x2', totalTime: 892.0, crew: [
      { name: 'Capt. Dela Cruz', role: 'Captain', position: 'Left Seat', pic: 'https://i.pravatar.cc/150?u=delacruz' },
      { name: 'Maria Santos', role: 'First Officer', position: 'Right Seat', pic: 'https://i.pravatar.cc/150?u=maria' },
    ]},
    { name: 'Cessna 152', type: 'C152', hours: 1.8, date: '22 Jun 2026', color: '#34d399', img: '/images/manufacturers/cessna/cessna-152.jpg', tail: 'RP-C9941', landings: 6, grade: 'A', instructor: 'Capt. Santos', remarks: 'Excellent stall recovery. Student solo-ready for pattern work.', route: 'RPLL - RPLB', conditions: 'VFR, calm wind', engine: 'Lycoming O-235-L2C', totalTime: 128.3, crew: [
      { name: 'Capt. Santos', role: 'CFI', position: 'Right Seat', pic: 'https://i.pravatar.cc/150?u=santos' },
      { name: 'Pedro Reyes', role: 'SPL Student', position: 'Left Seat', pic: 'https://i.pravatar.cc/150?u=pedro' },
    ]},
    { name: 'Tecnam P2008', type: 'P2008', hours: 4.0, date: '20 Jun 2026', color: '#f59e0b', img: '/images/manufacturers/tecnam/tecnam-p2008.jpg', tail: 'RP-T7721', landings: 2, grade: 'B', instructor: 'Capt. Lim', remarks: 'Cross-country navigation solid. Fuel planning needs attention.', route: 'RPLL - RPUY', conditions: 'VFR, haze, 8sm vis', engine: 'Rotax 912iS', totalTime: 56.7, crew: [
      { name: 'Capt. Lim', role: 'Check Pilot', position: 'Left Seat', pic: 'https://i.pravatar.cc/150?u=lim' },
      { name: 'Angelo Cruz', role: 'CPL Student', position: 'Right Seat', pic: 'https://i.pravatar.cc/150?u=angelo' },
    ]},
    { name: 'Diamond DA40', type: 'DA40', hours: 3.5, date: '18 Jun 2026', color: '#f472b6', img: '/images/manufacturers/diamond/diamond-da40.jpg', tail: 'RP-D4405', landings: 3, grade: 'A-', instructor: 'Capt. Tan', remarks: 'Glass cockpit proficiency improving. Autopilot coupling smooth.', route: 'RPLL - RPVP', conditions: 'IFR, overcast 1,500ft', engine: 'Lycoming IO-360-M1A', totalTime: 445.2, crew: [
      { name: 'Capt. Tan', role: 'CFI', position: 'Right Seat', pic: 'https://i.pravatar.cc/150?u=tan' },
      { name: 'David Park', role: 'CPL Student', position: 'Left Seat', pic: 'https://i.pravatar.cc/150?u=david' },
    ]},
    { name: 'Cessna 172S', type: 'C172', hours: 2.1, date: '15 Jun 2026', color: '#38bdf8', img: '/images/manufacturers/cessna/cessna-cessna_172.jpg', tail: 'RP-C1234', landings: 5, grade: 'B+', instructor: 'Capt. Reyes', remarks: 'Night flying session. Instrument scan disciplined.', route: 'RPLL - RPLC', conditions: 'Night VFR, clear, 10sm', engine: 'Lycoming IO-360-L2A', totalTime: 339.3, crew: [
      { name: 'Capt. Reyes', role: 'CFI', position: 'Right Seat', pic: 'https://i.pravatar.cc/150?u=reyes2' },
      { name: 'Lisa Chen', role: 'CPL Student', position: 'Left Seat', pic: 'https://i.pravatar.cc/150?u=lisa' },
    ]},
    { name: 'Piper PA-28', type: 'PA28', hours: 1.5, date: '12 Jun 2026', color: '#a78bfa', img: '/images/manufacturers/piper/piper-pa28.jpg', tail: 'RP-P2810', landings: 4, grade: 'A', instructor: 'Capt. Dela Cruz', remarks: 'Soft-field takeoff and landing mastery. Ready for checkride.', route: 'RPLL - RPLB', conditions: 'VFR, wet runway, 6kt wind', engine: 'Lycoming O-320-E2D', totalTime: 210.8, crew: [
      { name: 'Capt. Dela Cruz', role: 'CFI', position: 'Right Seat', pic: 'https://i.pravatar.cc/150?u=delacruz2' },
      { name: 'Mark Johnson', role: 'SPL Student', position: 'Left Seat', pic: 'https://i.pravatar.cc/150?u=mark' },
    ]},
    { name: 'Cessna 152', type: 'C152', hours: 2.8, date: '10 Jun 2026', color: '#34d399', img: '/images/manufacturers/cessna/cessna-152.jpg', tail: 'RP-C9941', landings: 8, grade: 'A-', instructor: 'Capt. Santos', remarks: 'Circuit practice. Consistent approach speeds maintained.', route: 'RPLL - RPLB', conditions: 'VFR, light turbulence', engine: 'Lycoming O-235-L2C', totalTime: 126.5, crew: [
      { name: 'Capt. Santos', role: 'CFI', position: 'Right Seat', pic: 'https://i.pravatar.cc/150?u=santos2' },
      { name: 'Rachel Kim', role: 'CPL Student', position: 'Left Seat', pic: 'https://i.pravatar.cc/150?u=rachel' },
    ]},
  ];

  const openAircraftModal = (ac: typeof AIRCRAFT_CAROUSEL_DATA[number]) => {
    setSelectedAircraft(ac);
    setChatInput('');
    setChatMessages([
      { role: 'assistant', text: `Welcome to your flight debrief for **${ac.name}** (${ac.tail}) on ${ac.date}.\n\n**CFI Remarks:** ${ac.remarks}\n\nI'm your AI logbook assistant. Ask me anything about this flight — I can elaborate on the instructor's feedback, suggest areas for improvement, or compare this entry against your training syllabus.` }
    ]);
  };

  const sendChat = () => {
    if (!chatInput.trim() || !selectedAircraft) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'assistant', text: `Based on your ${selectedAircraft.name} flight on ${selectedAircraft.date}: ${selectedAircraft.remarks} — ${userMsg.toLowerCase().includes('improve') ? 'Focus on maintaining centerline discipline during crosswind landings. Your wind correction was good but drifted slightly in the flare.' : userMsg.toLowerCase().includes('grade') ? `The ${selectedAircraft.grade} grade reflects solid performance with minor areas to polish.` : 'Keep building consistency in your pattern work. Total time on this airframe is now ' + selectedAircraft.totalTime + ' hours.'}` }]);
    }, 800);
  };

  useEffect(() => {
    if (!profile?.id) return;
    loadData();
  }, [profile?.id]);

  const loadData = async () => {
    setRefreshing(true);
    setLoading(true);
    const [syncRows, flightRows] = await Promise.all([
      callApi<Record<string, unknown>[]>('queryTable', {
        table: 'logbook_provider_sync',
        operation: 'select',
        where: { user_id: profile.id },
        limit: 500,
      }),
      callApi<Record<string, unknown>[]>('queryTable', {
        table: 'pilot_flight_logs',
        operation: 'select',
        where: { user_id: profile.id },
        limit: 5,
      }),
    ]);
    const synced = (syncRows || []).sort((a: any, b: any) => {
      const ca = a.connected_at || '';
      const cb = b.connected_at || '';
      return cb.localeCompare(ca);
    });
    const flightData = (flightRows || []).sort((a: any, b: any) => {
      const da = a.date || '';
      const db = b.date || '';
      return db.localeCompare(da);
    });
    setProviders((synced as unknown) as SyncedProvider[]);

    // Aggregate totals from synced providers
    const hrs = synced.reduce((sum: number, p: any) => sum + (p.total_hours ?? 0), 0);
    const flt = synced.reduce((sum: number, p: any) => sum + (p.flight_count ?? 0), 0);

    // Fallback to profile total_flight_hours if no synced providers
    setTotalHours(hrs > 0 ? hrs : (profile?.total_flight_hours ?? 0));
    setTotalFlights(flt > 0 ? flt : (flightData.length ?? 0));
    setRecentFlights(flightData);
    setLoading(false);
    setRefreshing(false);
  };

  const handleConnect = async (providerKey: string) => {
    if (!profile?.id) return;
    setConnecting(true);
    try {
      if (providerKey === 'myflightbook') {
        const clientId = (import.meta as any).env?.VITE_MFB_CLIENT_ID || 'PilotRecognition';
        const redirectUri = `${window.location.origin}/auth/logbook/callback`;
        const url = `https://myflightbook.com/logbook/mvc/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=totals&state=${profile.id}`;
        safeRedirect(url);
      } else if (['foreflight', 'safelog', 'logten'].includes(providerKey)) {
        setCsvModalProvider(providerKey);
      } else if (providerKey === 'recognitionplus') {
        if (onNavigate) {
          onNavigate('/platform?tab=recognition-plus');
        } else {
          window.location.href = '/platform?tab=recognition-plus';
        }
      }
    } finally {
      setConnecting(false);
    }
  };

  const connectedKeys = providers.map(p => p.provider);
  const availableToConnect = Object.keys(PROVIDER_META).filter(k => !connectedKeys.includes(k));

  if (subPage === 'logbook') {
    return (
      <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7">
        <div className="px-5 lg:px-7 pt-4 pb-2 flex items-center gap-3 border-b border-slate-200 dark:border-white/[0.07]">
          <button onClick={() => setSubPage('hub')} className="flex items-center gap-1.5 text-[10px] font-black tracking-wider text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white transition-colors">
            <ArrowLeft size={12} /> BACK TO LOGBOOK HUB
          </button>
        </div>
        <DigitalLogbookPage
          onBack={() => setSubPage('hub')}
          userProfile={profile ? { id: profile.id, uid: profile.id, firstName: profile.display_name?.split(' ')[0] || '', lastName: profile.display_name?.split(' ').slice(1).join(' ') || '', email: profile.email || '' } : null}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      {/* Header */}
      <div>
        <p className="text-[9px] font-black tracking-[0.2em] text-slate-400 dark:text-white/30 uppercase mb-1">Pilot Recognition</p>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Digital Logbook</h1>
        <p className="text-sm text-slate-500 dark:text-white/40 mt-0.5">Verified Flight Record Registry</p>
      </div>

      {/* Recent Aircraft Carousel */}
      {/* Connect logbook overlay disabled for now — always show carousel */}
      {false ? (
        <div className="relative rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {/* Blurred dashboard preview */}
          <div className="absolute inset-0 z-0 opacity-60" style={{ filter: 'blur(6px)', transform: 'scale(1.05)' }}>
            <CockpitFlightHoursDashboard
              userId={undefined}
              onCompleteProfile={onCompleteProfile}
              profile={{
                total_flight_hours: 847.5,
                pic_hours: 432,
                dual_hours: 215,
                cross_country_hours: 198,
                night_hours: 67,
                simulated_instrument_hours: 45,
                actual_instrument_hours: 32,
                sim_time: 12,
                total_landings: 342,
              }}
              isFreeUser={false}
              logbookConnected={false}
            />
          </div>

          {/* Overlay */}
          <div className="relative z-10 flex flex-col items-center justify-center py-14 px-6" style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}>
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)' }}>
              <span className="text-2xl">✈️</span>
            </div>
            <p className="text-sm font-black text-white mb-2">Sync Your Logbook</p>
            <p className="text-xs text-white/50 max-w-sm mx-auto leading-relaxed">
              Connect your logbook to track, verify and align your pathway career with AutoPilot AI
            </p>
            <button
              onClick={() => setSubPage('logbook')}
              className="mt-4 px-6 py-2.5 rounded-full text-xs font-black tracking-wider text-white transition-all hover:brightness-110"
              style={{ background: '#dc2626' }}
            >
              CONNECT LOGBOOK →
            </button>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.07] shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <div>
              <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Recent Activity</p>
              <p className="text-sm font-black text-white">Last Flown Aircraft</p>
            </div>
            <span className="text-[10px] font-black text-white/30">{totalHours > 0 ? `${totalHours.toFixed(1)}h total` : '—'}</span>
          </div>

          <div className="relative overflow-hidden py-4">
          <style>{`
            @keyframes aircraftScroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .aircraft-carousel {
              animation: aircraftScroll 40s linear infinite;
            }
            .aircraft-carousel:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div className="aircraft-carousel flex gap-4 px-6" style={{ width: 'max-content' }}>
            {[...AIRCRAFT_CAROUSEL_DATA, ...AIRCRAFT_CAROUSEL_DATA].map((ac, i) => (
              <FlightCard key={`${ac.name}-${i}`} ac={ac} onClick={() => viewFlightInLogbook(ac)} />
            ))}
          </div>
        </div>

        {/* Premium connect banner — below carousel */}
        <div className="px-4 pt-2 pb-4">
          <button
            onClick={() => setSubPage('logbook')}
            className="relative w-full overflow-hidden rounded-2xl border border-white/60 dark:border-slate-800 bg-white/75 dark:bg-slate-950/40 p-5 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 text-left"
          >
            {/* Subtle back-glow decoration for premium depth */}
            <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-red-500/5 dark:bg-indigo-500/10 blur-3xl pointer-events-none" />

            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Icon + Explainer Content */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 dark:bg-gradient-to-tr dark:from-indigo-500/20 dark:to-purple-500/20 text-red-500 dark:text-indigo-400 border border-red-100 dark:border-indigo-500/30 shadow-sm shadow-red-500/5 dark:shadow-inner">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                    {providers.length > 0 ? 'Your Flight Records' : 'Sync Your Flight Records'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-xl font-medium">
                    {providers.length > 0
                      ? 'Your logbook is connected. Open your flight records to review entries, verify hours, and track your pathway progress.'
                      : <>Connect your logbook to unlock <span className="text-red-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer">cinematic activity timelines</span> in your flight logs—transforming everyday entries into unforgettable, interactive flight memory tracks.</>}
                  </p>
                </div>
              </div>

              {/* Conditional CTA */}
              <span className="group w-full sm:w-auto shrink-0 inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black tracking-wide shadow-md shadow-red-600/10 hover:shadow-lg hover:shadow-red-600/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                {providers.length > 0 ? 'View Logbook' : 'Connect Logbook'}
                <svg className="w-3.5 h-3.5 ml-1.5 transform transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </div>
          </button>
        </div>
      </div>
      )}

      {/* ─── AIRCRAFT DETAIL MODAL ─── */}
      <AnimatePresence>
      {selectedAircraft && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedAircraft(null); }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[linear-gradient(180deg,rgba(10,15,25,0.98)_0%,rgba(5,8,14,1)_100%)] border border-slate-200 dark:border-white/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={() => setSelectedAircraft(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-black/[0.06] dark:bg-white/[0.06] hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10"
            >
              <X size={14} className="text-slate-500 dark:text-white/70" />
            </button>

            <div className="relative h-64 md:h-80 w-full overflow-hidden">
              <img src={selectedAircraft.img} alt={selectedAircraft.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,8,14,0.95) 0%, rgba(5,8,14,0.4) 50%, transparent 100%)' }} />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-1" style={{ color: selectedAircraft.color }}>{selectedAircraft.type} · {selectedAircraft.tail}</p>
                    <h2 className="text-3xl md:text-4xl font-black text-white">{selectedAircraft.name}</h2>
                    <p className="text-sm text-white/50 mt-1">{selectedAircraft.date} · {selectedAircraft.route} · {selectedAircraft.conditions}</p>
                  </div>
                  <span className="text-sm font-black px-3 py-1 rounded-full mb-1" style={{ background: `${selectedAircraft.color}15`, color: selectedAircraft.color, border: `1px solid ${selectedAircraft.color}30` }}>Grade {selectedAircraft.grade}</span>
                </div>
              </div>
            </div>

            <div className="relative p-6 md:p-8">
              <div className="space-y-6 relative z-10 mb-6">
                {/* Flight Date & Crew */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400 dark:text-white/40" />
                    <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 dark:text-white/40 uppercase">Flight Date</p>
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{selectedAircraft.date}</p>

                  {/* Crew on Board */}
                  <div className="flex items-center gap-2 mt-4">
                    <User size={14} className="text-slate-400 dark:text-white/40" />
                    <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 dark:text-white/40 uppercase">Crew on Board</p>
                  </div>
                  {selectedAircraft.crew && selectedAircraft.crew.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {selectedAircraft.crew.map((member: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 rounded-xl p-3 bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06]">
                          <img src={member.pic} alt={member.name} className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 dark:border-white/10" />
                          <div>
                            <p className="text-xs font-black text-slate-900 dark:text-white">{member.name}</p>
                            <p className="text-[10px] text-slate-500 dark:text-white/50">{member.role}</p>
                            <p className="text-[9px] font-black tracking-wider uppercase" style={{ color: selectedAircraft.color }}>{member.position}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl p-4" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                      <div className="flex items-start gap-2">
                        <AlertCircle size={14} className="text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-black text-amber-600 dark:text-amber-300">Crew Data Missing</p>
                          <p className="text-[10px] text-amber-600/70 dark:text-amber-300/60 leading-relaxed mt-1">
                            This logbook entry does not contain crew assignment data. When your logbook is scanned, crew roles and seat positions are extracted to verify PIC/SIC allocation and training authority. Without crew data, this entry cannot be cross-checked for dual-instruction validity or multi-crew currency. Please update your source logbook with pilot names, roles, and positions before re-uploading.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Flight Debrief */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2"><Award size={14} className="text-slate-400 dark:text-white/40" /><p className="text-[10px] font-black tracking-[0.2em] text-slate-400 dark:text-white/40 uppercase">Flight Debrief</p></div>
                  <div className="rounded-xl p-5 bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-white/[0.06] backdrop-blur-xl">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div><p className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-wider">Duration</p><p className="text-xl font-black text-slate-900 dark:text-white">{selectedAircraft.hours}h</p></div>
                      <div><p className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-wider">Landings</p><p className="text-xl font-black text-slate-900 dark:text-white">{selectedAircraft.landings}</p></div>
                      <div><p className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-wider">Total Time</p><p className="text-xl font-black text-slate-900 dark:text-white">{selectedAircraft.totalTime}h</p></div>
                    </div>
                    <div className="h-px bg-slate-200 dark:bg-white/5 mb-4" />
                    <div className="space-y-3">
                      <div><p className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-wider mb-1">CFI</p><p className="text-sm text-slate-700 dark:text-white/80">{selectedAircraft.instructor}</p></div>
                      <div><p className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-wider mb-1">Remarks</p><p className="text-sm text-slate-700 dark:text-white/80 leading-relaxed">{selectedAircraft.remarks}</p></div>
                      <div><p className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-wider mb-1">Engine</p><p className="text-sm text-slate-700 dark:text-white/80">{selectedAircraft.engine}</p></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">
                {/* LEFT SIDE: Glassy Ledger Entry (60%) */}
                <div className="lg:col-span-7 flex flex-col h-full rounded-2xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/20 backdrop-blur-xl p-5 shadow-xl shadow-black/10 dark:shadow-black/40">
                  <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <span>Glassy Ledger Entry</span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-950 bg-slate-50 dark:bg-slate-950/60">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-900 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 dark:bg-slate-950/90">
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Aircraft</th>
                          <th className="py-3 px-4">Route</th>
                          <th className="py-3 px-4 text-center">Dur</th>
                          <th className="py-3 px-4 text-center">Ldgs</th>
                          <th className="py-3 px-4 text-center">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/60 dark:divide-slate-900/60 text-slate-700 dark:text-slate-300 font-medium">
                        <tr className="hover:bg-slate-100 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{selectedAircraft.date}</td>
                          <td className="py-3.5 px-4 text-slate-900 dark:text-white font-bold">
                            {selectedAircraft.name}
                            <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 ml-1">{selectedAircraft.tail}</span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">{selectedAircraft.route}</td>
                          <td className="py-3.5 px-4 text-center font-bold" style={{ color: selectedAircraft.color }}>{selectedAircraft.hours}h</td>
                          <td className="py-3.5 px-4 text-center font-bold text-slate-900 dark:text-white">{selectedAircraft.landings}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className="inline-flex items-center justify-center w-5 h-5 rounded-full border text-[10px] font-black"
                              style={{
                                background: `${selectedAircraft.color}10`,
                                color: selectedAircraft.color,
                                borderColor: `${selectedAircraft.color}30`,
                              }}
                            >
                              {selectedAircraft.grade}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* RIGHT SIDE: Logbook AI Companion Panel (40%) */}
                <div className="lg:col-span-5 flex flex-col justify-between min-h-[340px] rounded-2xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/20 backdrop-blur-xl p-5 shadow-xl shadow-black/10 dark:shadow-black/40">
                  <div>
                    <div className="flex items-center gap-2 mb-4 text-xs font-bold text-red-500 dark:text-red-400 uppercase tracking-widest">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span>Logbook AI Assistant</span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 max-h-[200px] pr-1">
                      {chatMessages.map((msg, idx) => (
                        <motion.div
                          key={idx}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          initial={{ opacity: 0, y: 16, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.05 }}
                        >
                          <div className={`max-w-[90%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-red-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-900 text-slate-700 dark:text-slate-300'
                          }`}>
                            <p className="whitespace-pre-wrap">{msg.text.split('**').map((part: string, i: number) => i % 2 === 1 ? <strong key={i} className="text-slate-900 dark:text-white">{part}</strong> : part)}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 relative flex items-center rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 focus-within:border-red-500/40 transition-colors">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                      placeholder="Ask about your flight metrics..."
                      className="w-full bg-transparent py-3 pl-4 pr-12 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                    />
                    <div className="absolute right-2">
                      <button
                        onClick={sendChat}
                        disabled={!chatInput.trim()}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-600/20 active:scale-95 transition-all disabled:opacity-30"
                      >
                        <svg className="w-3 h-3 transform rotate-45 -translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9-7-9-7v14z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background decorative luxury glow */}
              <div className="absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-gradient-to-tr from-red-600/5 via-transparent to-transparent blur-3xl pointer-events-none" />
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* ─── CSV IMPORT MODAL ─── */}
      {csvModalProvider && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }} onClick={(e) => { if (e.target === e.currentTarget) setCsvModalProvider(null); }}>
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <button onClick={() => setCsvModalProvider(null)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100" style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)' }}><X size={14} className="text-gray-500" /></button>

            <div className="p-6 md:p-8 space-y-5">
              <div>
                <p className="text-lg font-black text-gray-900">Import Logbook CSV</p>
                <p className="text-sm font-black text-red-500 mt-1">{PROVIDER_META[csvModalProvider]?.name} — Compliance Verification</p>
              </div>

              <div className="rounded-xl p-4 bg-red-50 border border-red-100">
                <p className="text-[10px] font-black text-red-500 uppercase tracking-wider mb-2">How to export your CSV</p>
                <p className="text-xs text-red-600 leading-relaxed">
                  {csvModalProvider === 'foreflight' && 'Open ForeFlight → Logbook → Export → Select CSV format → Include all flight fields → Download the file to your device.'}
                  {csvModalProvider === 'safelog' && 'Open SafeLog → Reports → Export → Choose CSV/Excel → Select Full Logbook → Ensure all columns are included → Download.'}
                  {csvModalProvider === 'logten' && 'Open LogTen Pro → File → Export → CSV → Check "Include all fields" → Select date range (all time) → Save to your device.'}
                </p>
              </div>

              <div className="rounded-xl p-5 border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center gap-3 text-center transition-all hover:border-red-300 hover:bg-red-50/30 cursor-pointer">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100">
                  <Upload size={20} className="text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">Upload CSV File</p>
                  <p className="text-[10px] text-gray-400 mt-1">Drag & drop or click to browse</p>
                </div>
                <button
                  onClick={() => {
                    setCsvModalProvider(null);
                    setSubPage('logbook');
                  }}
                  className="mt-2 px-6 py-2.5 rounded-full text-xs font-black tracking-wider text-white transition-all hover:brightness-110"
                  style={{ background: '#dc2626' }}
                >
                  PROCEED TO UPLOADER →
                </button>
              </div>

              <div className="rounded-lg p-4 bg-gray-100 border border-gray-200">
                <p className="text-[9px] text-gray-400 leading-relaxed">
                  <span className="font-black text-gray-600">Notary Disclosure:</span> Your imported logbook data is used solely for compliance verification of your credentials and logbook credibility. It does not replace your existing logbook nor is it used for official operational purposes on this platform. All imported hours will be audited annually and split into <span className="font-black text-gray-600">Verified Hours</span> (cross-checked with your issuing authority) and <span className="font-black text-gray-600">Non-Verified Hours</span> (counting hours flown between verification cycles). Read-only access — we never modify your source logbook data.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent flights preview */}
      {recentFlights.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Activity</p>
              <p className="text-sm font-black text-white">Recent Flights</p>
            </div>
            <button onClick={() => setSubPage('logbook')} className="text-[10px] font-black tracking-wider text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1">
              VIEW ALL <ChevronRight size={11} />
            </button>
          </div>
          <div className="space-y-1.5">
            {recentFlights.map(log => (
              <div key={log.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)' }}>
                  <Plane size={13} className="text-sky-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-white truncate">{log.aircraft_type || '—'}{log.route ? ` · ${log.route}` : ''}</p>
                  <p className="text-[9px] text-white/30">{log.date ? new Date(log.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}{log.category ? ` · ${log.category}` : ''}</p>
                </div>
                <span className="text-[11px] font-black text-sky-300 flex-shrink-0">{log.hours}h</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LogbookHub;
