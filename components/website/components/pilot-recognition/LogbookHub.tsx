import React, { useState, useEffect } from 'react';
import { safeRedirect } from '@/lib/url-validator';
import { BookMarked, Plane, RefreshCw, Plus, ChevronRight, Clock, Award, Link, CheckCircle, AlertCircle, ExternalLink, ArrowLeft } from 'lucide-react';
import { supabase } from '../../../../src/lib/supabase';
import { DigitalLogbookPage } from './DigitalLogbookPage';

interface LogbookHubProps {
  profile: any;
  onNavigate?: (path: string) => void;
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

const PROVIDER_META: Record<string, { name: string; logo: string; logoImg?: string; color: string; bg: string; url: string; region: string; badge?: string; method: string; methodColor: string; status: 'available' | 'coming_soon' }> = {
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
  },
  foreflight: {
    name: 'ForeFlight',
    logo: '✈️',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.08)',
    url: 'https://foreflight.com',
    region: 'Global · iOS / Web',
    badge: 'Certified',
    method: 'API Key',
    methodColor: '#818cf8',
    status: 'coming_soon',
  },
  safelog: {
    name: 'Safelog',
    logo: '�',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    url: 'https://safelog.com',
    region: 'Global · Web / Mobile',
    badge: 'Certified',
    method: 'Direct API',
    methodColor: '#34d399',
    status: 'coming_soon',
  },
  logten: {
    name: 'LogTen Pro',
    logo: '�',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    url: 'https://coradine.com',
    region: 'iOS / macOS',
    badge: 'Certified',
    method: 'CSV Import',
    methodColor: '#fbbf24',
    status: 'coming_soon',
  },
  manual: {
    name: 'Manual Entry',
    logo: '✍️',
    color: '#94a3b8',
    bg: 'rgba(148,163,184,0.08)',
    url: '',
    region: 'All platforms',
    method: 'Direct',
    methodColor: '#94a3b8',
    status: 'available',
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
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${isActive ? meta.color + '30' : 'rgba(255,255,255,0.07)'}` }}>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: meta.bg, border: `1px solid ${meta.color}30` }}>
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
          <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-lg font-black text-white">{provider.total_hours?.toFixed(1) ?? '—'}</p>
            <p className="text-[9px] text-white/30 font-black tracking-wider uppercase">Total Hrs</p>
          </div>
          <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
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

const ConnectProviderCard: React.FC<{ providerKey: string; selected: boolean; onSelect: (key: string) => void }> = ({ providerKey, selected, onSelect }) => {
  const meta = PROVIDER_META[providerKey] ?? PROVIDER_META.manual;
  const isComing = meta.status === 'coming_soon';
  return (
    <button
      disabled={isComing}
      onClick={() => !isComing && onSelect(providerKey)}
      className="relative group flex flex-row items-center gap-4 px-5 py-5 rounded-xl border text-left w-full transition-all"
      style={{
        background: selected ? 'rgba(255,255,255,0.95)' : isComing ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${selected ? 'rgba(255,255,255,0.6)' : isComing ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.12)'}`,
        cursor: isComing ? 'not-allowed' : 'pointer',
        backdropFilter: 'blur(8px)',
      }}
    >
      <span className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-lg overflow-hidden" style={{ background: selected ? 'transparent' : meta.bg }}>
        {meta.logoImg
          ? <img src={meta.logoImg} alt={meta.name} className="w-14 h-14 object-contain rounded" />
          : <span className="text-3xl">{meta.logo}</span>
        }
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-black leading-tight ${selected ? 'text-slate-800' : 'text-white'} group-hover:text-slate-800 transition-colors`}>{meta.name}</span>
          {meta.badge && (
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full transition-colors ${selected ? 'bg-emerald-500/30 text-emerald-700' : 'bg-emerald-500/15 text-emerald-400'}`}>{meta.badge}</span>
          )}
        </div>
        <span className={`text-[10px] transition-colors ${selected ? 'text-slate-500' : 'text-white/35 group-hover:text-slate-500'}`}>
          {meta.region}{providerKey === 'myflightbook' ? ' · Default logbook' : ''}
        </span>
      </div>
      <span className="text-[10px] font-semibold flex-shrink-0 transition-colors" style={{ color: selected ? '#64748b' : meta.methodColor }}>{meta.method}</span>
      {isComing && (
        <div className="absolute inset-0 rounded-xl flex items-center justify-center" style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(2px)' }}>
          <span className="text-[10px] font-black tracking-widest text-white/50 uppercase">Coming Soon</span>
        </div>
      )}
      {selected && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#00b4d8' }} />}
    </button>
  );
};

type SubPage = 'hub' | 'logbook' | 'sync';

export const LogbookHub: React.FC<LogbookHubProps> = ({ profile }) => {
  const [subPage, setSubPage] = useState<SubPage>('hub');
  const [providers, setProviders] = useState<SyncedProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [totalFlights, setTotalFlights] = useState<number>(0);
  const [recentFlights, setRecentFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.id) return;
    loadData();
  }, [profile?.id]);

  const loadData = async () => {
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
      } else if (providerKey === 'manual') {
        setSubPage('logbook');
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

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total Hours"
          value={totalHours > 0 ? totalHours.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '—'}
          sub="across all providers"
          icon={<Clock size={16} style={{ color: '#38bdf8' }} />}
          accent="#38bdf8"
        />
        <StatCard
          label="Total Flights"
          value={totalFlights > 0 ? totalFlights.toLocaleString() : '—'}
          sub="logged entries"
          icon={<Plane size={16} style={{ color: '#818cf8' }} />}
          accent="#818cf8"
        />
        <StatCard
          label="Providers Synced"
          value={providers.length}
          sub={providers.length === 0 ? 'connect one below' : `${providers.filter(p => p.status === 'active').length} active`}
          icon={<Link size={16} style={{ color: '#34d399' }} />}
          accent="#34d399"
        />
        <StatCard
          label="Verification Status"
          value={providers.length > 0 ? 'LINKED' : 'UNVERIFIED'}
          sub={providers.length > 0 ? 'provider connected' : 'sync to verify'}
          icon={<Award size={16} style={{ color: '#f59e0b' }} />}
          accent="#f59e0b"
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setSubPage('logbook')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-black tracking-wider text-white transition-all hover:brightness-110"
          style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)' }}
        >
          <BookMarked size={13} /> OPEN LOGBOOK
        </button>
        <button
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-black tracking-wider text-white/60 hover:text-white transition-all"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <RefreshCw size={13} /> REFRESH
        </button>
      </div>

      {/* Synced providers */}
      <div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.keys(PROVIDER_META).map(key => (
                <ConnectProviderCard key={key} providerKey={key} selected={selectedProvider === key} onSelect={setSelectedProvider} />
              ))}
            </div>
            <button
              onClick={() => selectedProvider && handleConnect(selectedProvider)}
              disabled={!selectedProvider || connecting}
              className="w-full py-3 rounded-xl text-sm font-black tracking-wider transition-all"
              style={{
                background: selectedProvider && !connecting ? '#dc2626' : 'rgba(255,255,255,0.05)',
                color: selectedProvider && !connecting ? '#fff' : 'rgba(255,255,255,0.25)',
                border: `1px solid ${selectedProvider && !connecting ? 'rgba(220,38,38,0.4)' : 'rgba(255,255,255,0.08)'}`,
                cursor: selectedProvider && !connecting ? 'pointer' : 'not-allowed',
              }}
            >
              {connecting ? 'Connecting…' : selectedProvider ? `Sync with ${PROVIDER_META[selectedProvider]?.name} →` : 'Select a provider above'}
            </button>
            <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
              <span className="text-[9px]" style={{ color: '#00b4d8' }}>● OAuth 2.0</span>
              <span className="text-[9px] text-purple-400">● API Passkey</span>
              <span className="text-[9px] text-green-400">● Direct API</span>
              <span className="text-[9px] text-orange-400">● CSV Import</span>
            </div>
            <p className="text-center text-[10px] text-white/20">Read-only access only. We never modify your logbook data.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
