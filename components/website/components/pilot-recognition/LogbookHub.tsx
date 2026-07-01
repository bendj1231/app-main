import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { safeRedirect } from '@/lib/url-validator';
import { BookMarked, Plane, RefreshCw, Plus, ChevronRight, Clock, Award, Link, CheckCircle, AlertCircle, ExternalLink, ArrowLeft, X, Send, Bot, User, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
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
  <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}>
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-black tracking-[0.18em] text-white/30 uppercase">{label}</p>
      <p className="text-xl font-black text-white leading-tight">{value}</p>
      {sub && <p className="text-[10px] text-white/40">{sub}</p>}
    </div>
  </div>
);

const ProviderCard: React.FC<{ provider: SyncedProvider; onOpenLogbook: () => void }> = ({ provider, onOpenLogbook }) => {
  const meta = PROVIDER_META[provider.provider] ?? PROVIDER_META.manual;
  const isActive = provider.status === 'active';
  const lastSync = provider.last_synced_at
    ? new Date(provider.last_synced_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })
    : 'Never synced';

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        background: '#000000',
        border: `1px solid ${isActive ? meta.color + '30' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
            style={{
              background: '#111111',
              border: `1px solid ${meta.color}25`,
            }}
          >
            {meta.logo}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-black text-white">{meta.name}</p>
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
            <p className="text-[10px] text-white/30">Last sync: {lastSync}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div
            className="rounded-lg p-2.5 text-center"
            style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-lg font-black text-white">{provider.total_hours?.toFixed(1) ?? '—'}</p>
            <p className="text-[9px] text-white/30 font-black tracking-wider uppercase">Total Hrs</p>
          </div>
          <div
            className="rounded-lg p-2.5 text-center"
            style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-lg font-black text-white">{provider.flight_count ?? '—'}</p>
            <p className="text-[9px] text-white/30 font-black tracking-wider uppercase">Flights</p>
          </div>
        </div>
      </div>

      <div className="flex border-t border-white/5">
        <button onClick={onOpenLogbook} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 hover:bg-white/5 transition-colors text-[10px] font-black tracking-wider" style={{ color: meta.color }}>
          <BookMarked size={11} /> VIEW LOGBOOK
        </button>
        {meta.url && (
          <a href={meta.url} target="_blank" rel="noopener noreferrer" className="px-3 flex items-center justify-center border-l border-white/5 hover:bg-white/5 transition-colors text-white/30 hover:text-white/60">
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
};

const ConnectProviderCard: React.FC<{ providerKey: string; selected: boolean; onSelect: (key: string) => void; onConnect?: (key: string) => void }> = ({ providerKey, selected, onSelect, onConnect }) => {
  const meta = PROVIDER_META[providerKey] ?? PROVIDER_META.manual;
  const isComing = meta.status === 'coming_soon';
  const isRecognitionPlus = providerKey === 'recognitionplus';
  return (
    <div
      className="relative group flex flex-row items-center gap-3 px-3 rounded-xl w-full transition-all overflow-hidden"
      style={{
        background: isRecognitionPlus ? '#dc2626' : '#000000',
        border: selected ? `1px solid ${meta.color}40` : isRecognitionPlus ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: selected ? `0 0 20px ${meta.color}15` : isRecognitionPlus ? '0 4px 24px rgba(220,38,38,0.35)' : '0 4px 16px rgba(0,0,0,0.4)',
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
          <span className={`text-xs font-black tracking-wide ${isRecognitionPlus ? 'text-white' : 'text-white'}`}>{meta.name.toUpperCase()}</span>
          {meta.badge && (
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={isRecognitionPlus ? { background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' } : { background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>{meta.badge}</span>
          )}
        </div>
        <p className={`text-[9px] mt-0.5 ${isRecognitionPlus ? 'text-white/70' : 'text-white/30'}`}>{meta.region}{providerKey === 'myflightbook' ? ' · Default logbook' : ''}</p>
        <p className={`text-[9px] mt-0.5 ${isRecognitionPlus ? 'text-white/50' : 'text-white/20'}`}>{meta.supports}</p>
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
            : 'text-white rounded-lg'
        }`}
        style={isRecognitionPlus ? {} : {
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
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

type SubPage = 'hub' | 'logbook' | 'sync';

export const LogbookHub: React.FC<LogbookHubProps> = ({ profile, onNavigate, onCompleteProfile }) => {
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

  const AIRCRAFT_CAROUSEL_DATA = [
    { name: 'Cessna 172S', type: 'C172', hours: 3.2, date: '28 Jun 2026', color: '#38bdf8', img: 'https://s206.q4cdn.com/111183019/files/images/2021/403195-Cessna-Skyhawk-cfc927-original-1633017054.jpg', tail: 'RP-C1234', landings: 4, grade: 'A-', instructor: 'Capt. Reyes', remarks: 'Smooth short-field landing. Wind correction on final was precise.', route: 'RPLL - RPLC', conditions: 'VFR, 12kt wind 090°', engine: 'Lycoming IO-360-L2A', totalTime: 342.5, crew: [
      { name: 'Capt. Reyes', role: 'CFI', position: 'Right Seat', pic: 'https://i.pravatar.cc/150?u=reyes' },
      { name: 'Juan Dela Cruz', role: 'CPL Student', position: 'Left Seat', pic: 'https://i.pravatar.cc/150?u=juan' },
    ]},
    { name: 'Piper PA-44', type: 'PA44', hours: 2.5, date: '25 Jun 2026', color: '#818cf8', img: 'https://resources.globalair.com/specs/images/Twin%20Pistons/Piper/Seminole/PA-44-180/Exterior/Seminole%20PA-44-180%204.jpg?w=650&h=430&mode=max', tail: 'RP-S8820', landings: 3, grade: 'B+', instructor: 'Capt. Dela Cruz', remarks: 'Good engine-out procedures. Maintain heading during single-engine ops.', route: 'RPLL - RPLI', conditions: 'VFR, scattered clouds 3,000ft', engine: 'Lycoming O-360-A1H6 x2', totalTime: 892.0, crew: [
      { name: 'Capt. Dela Cruz', role: 'Captain', position: 'Left Seat', pic: 'https://i.pravatar.cc/150?u=delacruz' },
      { name: 'Maria Santos', role: 'First Officer', position: 'Right Seat', pic: 'https://i.pravatar.cc/150?u=maria' },
    ]},
    { name: 'Cessna 152', type: 'C152', hours: 1.8, date: '22 Jun 2026', color: '#34d399', img: 'https://i1.wp.com/www.avgeekery.com/wp-content/uploads/2020/02/Fleet-Cessna-152-Aerobat_Western-Australian-Aviation-Collegea.jpg?fit=1160%2C677&ssl=1', tail: 'RP-C9941', landings: 6, grade: 'A', instructor: 'Capt. Santos', remarks: 'Excellent stall recovery. Student solo-ready for pattern work.', route: 'RPLL - RPLB', conditions: 'VFR, calm wind', engine: 'Lycoming O-235-L2C', totalTime: 128.3, crew: [
      { name: 'Capt. Santos', role: 'CFI', position: 'Right Seat', pic: 'https://i.pravatar.cc/150?u=santos' },
      { name: 'Pedro Reyes', role: 'SPL Student', position: 'Left Seat', pic: 'https://i.pravatar.cc/150?u=pedro' },
    ]},
    { name: 'Tecnam P2008', type: 'P2008', hours: 4.0, date: '20 Jun 2026', color: '#f59e0b', img: 'https://tecnam.com/wp-content/uploads/2026/02/P2008-JC-NG-blue-Large.jpeg', tail: 'RP-T7721', landings: 2, grade: 'B', instructor: 'Capt. Lim', remarks: 'Cross-country navigation solid. Fuel planning needs attention.', route: 'RPLL - RPUY', conditions: 'VFR, haze, 8sm vis', engine: 'Rotax 912iS', totalTime: 56.7, crew: [
      { name: 'Capt. Lim', role: 'Check Pilot', position: 'Left Seat', pic: 'https://i.pravatar.cc/150?u=lim' },
      { name: 'Angelo Cruz', role: 'CPL Student', position: 'Right Seat', pic: 'https://i.pravatar.cc/150?u=angelo' },
    ]},
    { name: 'Diamond DA40', type: 'DA40', hours: 3.5, date: '18 Jun 2026', color: '#f472b6', img: 'https://upload.wikimedia.org/wikipedia/commons/8/87/OH-DAC_Tour_de_Sky_Oulu_20140810_02.JPG', tail: 'RP-D4405', landings: 3, grade: 'A-', instructor: 'Capt. Tan', remarks: 'Glass cockpit proficiency improving. Autopilot coupling smooth.', route: 'RPLL - RPVP', conditions: 'IFR, overcast 1,500ft', engine: 'Lycoming IO-360-M1A', totalTime: 445.2, crew: [
      { name: 'Capt. Tan', role: 'CFI', position: 'Right Seat', pic: 'https://i.pravatar.cc/150?u=tan' },
      { name: 'David Park', role: 'CPL Student', position: 'Left Seat', pic: 'https://i.pravatar.cc/150?u=david' },
    ]},
    { name: 'Cessna 172S', type: 'C172', hours: 2.1, date: '15 Jun 2026', color: '#38bdf8', img: 'https://s206.q4cdn.com/111183019/files/images/2021/403195-Cessna-Skyhawk-cfc927-original-1633017054.jpg', tail: 'RP-C1234', landings: 5, grade: 'B+', instructor: 'Capt. Reyes', remarks: 'Night flying session. Instrument scan disciplined.', route: 'RPLL - RPLC', conditions: 'Night VFR, clear, 10sm', engine: 'Lycoming IO-360-L2A', totalTime: 339.3, crew: [
      { name: 'Capt. Reyes', role: 'CFI', position: 'Right Seat', pic: 'https://i.pravatar.cc/150?u=reyes2' },
      { name: 'Lisa Chen', role: 'CPL Student', position: 'Left Seat', pic: 'https://i.pravatar.cc/150?u=lisa' },
    ]},
    { name: 'Piper PA-28', type: 'PA28', hours: 1.5, date: '12 Jun 2026', color: '#a78bfa', img: 'https://placehold.co/200x200/2a1e3a/a78bfa?text=PA28', tail: 'RP-P2810', landings: 4, grade: 'A', instructor: 'Capt. Dela Cruz', remarks: 'Soft-field takeoff and landing mastery. Ready for checkride.', route: 'RPLL - RPLB', conditions: 'VFR, wet runway, 6kt wind', engine: 'Lycoming O-320-E2D', totalTime: 210.8, crew: [
      { name: 'Capt. Dela Cruz', role: 'CFI', position: 'Right Seat', pic: 'https://i.pravatar.cc/150?u=delacruz2' },
      { name: 'Mark Johnson', role: 'SPL Student', position: 'Left Seat', pic: 'https://i.pravatar.cc/150?u=mark' },
    ]},
    { name: 'Cessna 152', type: 'C152', hours: 2.8, date: '10 Jun 2026', color: '#34d399', img: 'https://i1.wp.com/www.avgeekery.com/wp-content/uploads/2020/02/Fleet-Cessna-152-Aerobat_Western-Australian-Aviation-Collegea.jpg?fit=1160%2C677&ssl=1', tail: 'RP-C9941', landings: 8, grade: 'A-', instructor: 'Capt. Santos', remarks: 'Circuit practice. Consistent approach speeds maintained.', route: 'RPLL - RPLB', conditions: 'VFR, light turbulence', engine: 'Lycoming O-235-L2C', totalTime: 126.5, crew: [
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
    const [{ data: syncData }, { data: flightData }] = await Promise.all([
      supabase.from('logbook_provider_sync').select('*').eq('user_id', profile.id).order('connected_at', { ascending: false }),
      supabase.from('pilot_flight_logs').select('id,date,aircraft_type,route,hours,category').eq('user_id', profile.id).order('date', { ascending: false }).limit(5),
    ]);

    const synced = syncData ?? [];
    setProviders(synced);

    // Aggregate totals from synced providers
    const hrs = synced.reduce((sum: number, p: SyncedProvider) => sum + (p.total_hours ?? 0), 0);
    const flt = synced.reduce((sum: number, p: SyncedProvider) => sum + (p.flight_count ?? 0), 0);

    // Fallback to profile total_flight_hours if no synced providers
    setTotalHours(hrs > 0 ? hrs : (profile?.total_flight_hours ?? 0));
    setTotalFlights(flt > 0 ? flt : (flightData?.length ?? 0));
    setRecentFlights(flightData ?? []);
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
        <div className="px-5 lg:px-7 pt-4 pb-2 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={() => setSubPage('hub')} className="flex items-center gap-1.5 text-[10px] font-black tracking-wider text-white/40 hover:text-white transition-colors">
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase mb-1">Pilot Recognition</p>
        <h1 className="text-2xl font-black text-white">Digital Logbook</h1>
        <p className="text-sm text-white/40 mt-0.5">Verified Flight Record Registry</p>
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
        <div className="relative overflow-hidden rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
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
          <div className="aircraft-carousel flex gap-3 px-4" style={{ width: 'max-content' }}>
            {AIRCRAFT_CAROUSEL_DATA.map((ac, i) => (
              <div
                key={`${ac.name}-${i}`}
                onClick={() => openAircraftModal(ac)}
                className="flex-shrink-0 w-[28rem] h-48 rounded-xl overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer relative flex"
                style={{
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {/* Left: Aircraft Image */}
                <div className="relative w-[45%] h-full flex-shrink-0">
                  <img
                    src={ac.img}
                    alt={ac.type}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Gradient fade to right */}
                  <div
                    className="absolute inset-y-0 right-0 w-16"
                    style={{ background: 'linear-gradient(to right, transparent, rgba(15,23,42,0.95))' }}
                  />
                </div>

                {/* Right: Glassmorphism Flight Story */}
                <div
                  className="flex-1 h-full p-4 flex flex-col justify-between relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.85) 100%)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                >
                  {/* Top: Aircraft identity */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-black text-white leading-tight">{ac.name}</p>
                        <p className="text-[10px] text-white/40">{ac.type} · {ac.tail}</p>
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: `${ac.color}15`, color: ac.color, border: `1px solid ${ac.color}30` }}>
                        {ac.grade}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Flight metrics */}
                  <div className="flex items-center gap-4 mt-2">
                    <div>
                      <p className="text-[8px] font-black tracking-wider text-white/30 uppercase">Duration</p>
                      <p className="text-base font-black text-white">{ac.hours}h</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black tracking-wider text-white/30 uppercase">Landings</p>
                      <p className="text-base font-black text-white">{ac.landings}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black tracking-wider text-white/30 uppercase">Date</p>
                      <p className="text-xs font-black text-white/70">{ac.date}</p>
                    </div>
                  </div>

                  {/* Bottom: CFI remarks */}
                  <div className="mt-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[8px] font-black tracking-wider text-white/30 uppercase">CFI</span>
                      <span className="text-[9px] text-white/50">{ac.instructor}</span>
                    </div>
                    <p className="text-[10px] text-white/50 leading-relaxed line-clamp-2">{ac.remarks}</p>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 w-full h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.min((ac.hours / 5) * 100, 100)}%`, background: ac.color }} />
                  </div>

                  {/* Blinking click indicator */}
                  <div className="absolute bottom-2 right-3">
                    <span className="text-[8px] font-black tracking-wider text-red-400 uppercase animate-pulse">Click me →</span>
                  </div>
                </div>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {AIRCRAFT_CAROUSEL_DATA.map((ac, i) => (
              <div
                key={`dup-${ac.name}-${i}`}
                onClick={() => openAircraftModal(ac)}
                className="flex-shrink-0 w-[28rem] h-48 rounded-xl overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer relative flex"
                style={{
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {/* Left: Aircraft Image */}
                <div className="relative w-[45%] h-full flex-shrink-0">
                  <img
                    src={ac.img}
                    alt={ac.type}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Gradient fade to right */}
                  <div
                    className="absolute inset-y-0 right-0 w-16"
                    style={{ background: 'linear-gradient(to right, transparent, rgba(15,23,42,0.95))' }}
                  />
                </div>

                {/* Right: Glassmorphism Flight Story */}
                <div
                  className="flex-1 h-full p-4 flex flex-col justify-between relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.85) 100%)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                >
                  {/* Top: Aircraft identity */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-black text-white leading-tight">{ac.name}</p>
                        <p className="text-[10px] text-white/40">{ac.type} · {ac.tail}</p>
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: `${ac.color}15`, color: ac.color, border: `1px solid ${ac.color}30` }}>
                        {ac.grade}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Flight metrics */}
                  <div className="flex items-center gap-4 mt-2">
                    <div>
                      <p className="text-[8px] font-black tracking-wider text-white/30 uppercase">Duration</p>
                      <p className="text-base font-black text-white">{ac.hours}h</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black tracking-wider text-white/30 uppercase">Landings</p>
                      <p className="text-base font-black text-white">{ac.landings}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black tracking-wider text-white/30 uppercase">Date</p>
                      <p className="text-xs font-black text-white/70">{ac.date}</p>
                    </div>
                  </div>

                  {/* Bottom: CFI remarks */}
                  <div className="mt-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[8px] font-black tracking-wider text-white/30 uppercase">CFI</span>
                      <span className="text-[9px] text-white/50">{ac.instructor}</span>
                    </div>
                    <p className="text-[10px] text-white/50 leading-relaxed line-clamp-2">{ac.remarks}</p>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 w-full h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.min((ac.hours / 5) * 100, 100)}%`, background: ac.color }} />
                  </div>

                  {/* Blinking click indicator */}
                  <div className="absolute bottom-2 right-3">
                    <span className="text-[8px] font-black tracking-wider text-red-400 uppercase animate-pulse">Click me →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cinematic connect banner — below carousel */}
        <div className="px-4 pt-2 pb-3">
          <button
            onClick={() => providersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="w-full rounded-xl px-4 py-3 text-center transition-all hover:brightness-110"
            style={{
              background: '#dc2626',
              border: '1px solid rgba(220,38,38,0.5)',
              cursor: 'pointer',
            }}
          >
            <p className="text-[10px] text-white/90 leading-relaxed tracking-wide">
              <span className="font-black text-white">Connect your logbook</span> to view cinematic recent activities in your flight logs — turning every log into a real life memorable experience
            </p>
          </button>
        </div>
      </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setSubPage('logbook')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-black tracking-wider text-white transition-all hover:brightness-110"
          style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)' }}
        >
          <BookMarked size={13} /> OPEN LOGBOOK
        </button>
        <div className="flex flex-col items-center">
          <button
            onClick={loadData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-black tracking-wider transition-all"
            style={{
              background: refreshing ? 'rgba(220,38,38,0.1)' : 'rgba(255,255,255,0.05)',
              border: refreshing ? '1px solid rgba(220,38,38,0.3)' : '1px solid rgba(255,255,255,0.08)',
              color: refreshing ? '#ef4444' : 'rgba(255,255,255,0.6)',
              cursor: refreshing ? 'not-allowed' : 'pointer',
            }}
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} /> {refreshing ? 'SYNCING…' : 'REFRESH'}
          </button>
          {refreshing && (
            <p className="text-[9px] text-white/40 mt-1.5 text-center">Connecting your logbook — syncing to refresh the connection</p>
          )}
        </div>
      </div>

      {/* Synced providers */}
      <div ref={providersRef} id="logbook-providers">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Connected Sources</p>
            <p className="text-sm font-black text-white">Synced Logbook Providers</p>
          </div>
          {providers.length > 0 && (
            <span className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>
              {providers.length} CONNECTED
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
          </div>
        ) : providers.length === 0 ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              {Object.keys(PROVIDER_META).map(key => (
                <ConnectProviderCard key={key} providerKey={key} selected={selectedProvider === key} onSelect={setSelectedProvider} onConnect={(k) => handleConnect(k)} />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
              <span className="text-[9px]" style={{ color: '#00b4d8' }}>● OAuth 2.0</span>
              <span className="text-[9px] text-purple-400">● API Passkey</span>
              <span className="text-[9px] text-green-400">● Direct API</span>
              <span className="text-[9px] text-orange-400">● CSV Import</span>
            </div>
            <p className="text-center text-[10px] text-white/20">Read-only access only. We never modify your logbook data.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {providers.map(p => (
              <ProviderCard key={p.id} provider={p} onOpenLogbook={() => setSubPage('logbook')} />
            ))}
          </div>
        )}
      </div>

      {/* Available providers to connect — only shown when some are already connected */}
      {providers.length > 0 && availableToConnect.length > 0 && (
        <div>
          <div className="mb-3">
            <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Available Integrations</p>
            <p className="text-sm font-black text-white">Add Another Provider</p>
          </div>
          <div className="space-y-3">
            <div className="flex flex-col gap-3">
              {availableToConnect.map(key => (
                <ConnectProviderCard key={key} providerKey={key} selected={selectedProvider === key} onSelect={setSelectedProvider} />
              ))}
            </div>
            {selectedProvider && availableToConnect.includes(selectedProvider) && (
              <button
                onClick={() => handleConnect(selectedProvider)}
                disabled={connecting}
                className="w-full py-3 rounded-xl text-sm font-black tracking-wider transition-all"
                style={{ background: '#dc2626', color: '#fff', border: '1px solid rgba(220,38,38,0.4)', cursor: connecting ? 'not-allowed' : 'pointer' }}
              >
                {connecting ? 'Connecting…' : `Sync with ${PROVIDER_META[selectedProvider]?.name} →`}
              </button>
            )}
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
            className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl"
            style={{ background: 'linear-gradient(180deg, rgba(10,15,25,0.98) 0%, rgba(5,8,14,1) 100%)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <button onClick={() => setSelectedAircraft(null)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}><X size={14} className="text-white/70" /></button>

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

            <div className="p-6 md:p-8 space-y-6">
              {/* Flight Date & Crew */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-white/40" />
                  <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Flight Date</p>
                </div>
                <p className="text-2xl font-black text-white">{selectedAircraft.date}</p>

                {/* Crew on Board */}
                <div className="flex items-center gap-2 mt-4">
                  <User size={14} className="text-white/40" />
                  <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Crew on Board</p>
                </div>
                {selectedAircraft.crew && selectedAircraft.crew.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {selectedAircraft.crew.map((member: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <img src={member.pic} alt={member.name} className="w-10 h-10 rounded-full object-cover" style={{ border: '2px solid rgba(255,255,255,0.1)' }} />
                        <div>
                          <p className="text-xs font-black text-white">{member.name}</p>
                          <p className="text-[10px] text-white/50">{member.role}</p>
                          <p className="text-[9px] font-black tracking-wider uppercase" style={{ color: selectedAircraft.color }}>{member.position}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl p-4" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                    <div className="flex items-start gap-2">
                      <AlertCircle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-black text-amber-300">Crew Data Missing</p>
                        <p className="text-[10px] text-amber-300/60 leading-relaxed mt-1">
                          This logbook entry does not contain crew assignment data. When your logbook is scanned, crew roles and seat positions are extracted to verify PIC/SIC allocation and training authority. Without crew data, this entry cannot be cross-checked for dual-instruction validity or multi-crew currency. Please update your source logbook with pilot names, roles, and positions before re-uploading.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2"><Award size={14} className="text-white/40" /><p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Flight Debrief</p></div>
                  <div className="rounded-xl p-5" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div><p className="text-[9px] font-black text-white/30 uppercase tracking-wider">Duration</p><p className="text-xl font-black text-white">{selectedAircraft.hours}h</p></div>
                      <div><p className="text-[9px] font-black text-white/30 uppercase tracking-wider">Landings</p><p className="text-xl font-black text-white">{selectedAircraft.landings}</p></div>
                      <div><p className="text-[9px] font-black text-white/30 uppercase tracking-wider">Total Airframe</p><p className="text-xl font-black text-white">{selectedAircraft.totalTime}h</p></div>
                    </div>
                    <div className="h-px bg-white/5 mb-4" />
                    <div className="space-y-3">
                      <div><p className="text-[9px] font-black text-white/30 uppercase tracking-wider mb-1">CFI</p><p className="text-sm text-white/80">{selectedAircraft.instructor}</p></div>
                      <div><p className="text-[9px] font-black text-white/30 uppercase tracking-wider mb-1">Remarks</p><p className="text-sm text-white/80 leading-relaxed">{selectedAircraft.remarks}</p></div>
                      <div><p className="text-[9px] font-black text-white/30 uppercase tracking-wider mb-1">Engine</p><p className="text-sm text-white/80">{selectedAircraft.engine}</p></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2"><Bot size={14} className="text-red-400" /><p className="text-[10px] font-black tracking-[0.2em] text-red-400 uppercase">Logbook AI Assistant</p></div>
                  <div className="rounded-xl flex flex-col" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', height: '320px' }}>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {chatMessages.map((msg, idx) => (
                        <motion.div
                          key={idx}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          initial={{ opacity: 0, y: 16, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.05 }}
                        >
                          <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                            msg.role === 'user'
                              ? 'bg-red-600 text-white'
                              : 'bg-white/[0.06] border border-white/[0.10] text-white/90'
                          }`}>
                            <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.text.split('**').map((part: string, i: number) => i % 2 === 1 ? <strong key={i} className="text-white">{part}</strong> : part)}</p>
                          </div>
                        </motion.div>
                      ))}
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
                          placeholder="Ask about this flight..."
                          className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                        />
                        <button
                          onClick={sendChat}
                          disabled={!chatInput.trim()}
                          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 bg-red-600 hover:bg-red-500"
                        >
                          <Send size={14} className="text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2"><BookMarked size={14} className="text-white/40" /><p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Glassy Ledger Entry</p></div>
                <div className="rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.3)' }}>
                  <div className="grid grid-cols-12 gap-0 text-[9px] font-black tracking-wider text-white/30 uppercase border-b border-white/5 px-4 py-2" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Aircraft</div>
                    <div className="col-span-2">Route</div>
                    <div className="col-span-1 text-center">Dur</div>
                    <div className="col-span-1 text-center">Ldgs</div>
                    <div className="col-span-2">Conditions</div>
                    <div className="col-span-2 text-right">Grade</div>
                  </div>
                  <div className="grid grid-cols-12 gap-0 items-center text-[10px] text-white/80 px-4 py-3 border-b border-white/5">
                    <div className="col-span-2 font-black text-white">{selectedAircraft.date}</div>
                    <div className="col-span-2"><p className="font-black text-white">{selectedAircraft.name}</p><p className="text-white/40">{selectedAircraft.tail}</p></div>
                    <div className="col-span-2 font-medium">{selectedAircraft.route}</div>
                    <div className="col-span-1 text-center font-black" style={{ color: selectedAircraft.color }}>{selectedAircraft.hours}h</div>
                    <div className="col-span-1 text-center font-black text-white">{selectedAircraft.landings}</div>
                    <div className="col-span-2 text-white/50">{selectedAircraft.conditions}</div>
                    <div className="col-span-2 text-right"><span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: `${selectedAircraft.color}15`, color: selectedAircraft.color, border: `1px solid ${selectedAircraft.color}30` }}>{selectedAircraft.grade}</span></div>
                  </div>
                  <div className="px-4 py-3" style={{ background: 'rgba(255,255,255,0.015)' }}>
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-wider mb-1">CFI Remarks</p>
                    <p className="text-[11px] text-white/70 leading-relaxed">{selectedAircraft.remarks}</p>
                  </div>
                </div>
              </div>
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
              <div key={log.id} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
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
