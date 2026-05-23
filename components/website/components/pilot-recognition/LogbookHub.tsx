import React, { useState, useEffect } from 'react';
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

const PROVIDER_META: Record<string, { name: string; logo: string; color: string; bg: string; url: string }> = {
  myflight: {
    name: 'MyFlight Logbook',
    logo: '✈',
    color: '#38bdf8',
    bg: 'rgba(56,189,248,0.08)',
    url: 'https://myflightbook.com',
  },
  foreflight: {
    name: 'ForeFlight',
    logo: '🛩',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.08)',
    url: 'https://foreflight.com',
  },
  safelog: {
    name: 'Safelog',
    logo: '📋',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    url: 'https://safelog.com',
  },
  logten: {
    name: 'LogTen Pro',
    logo: '📊',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    url: 'https://coradine.com',
  },
  manual: {
    name: 'Manual Entry',
    logo: '✍',
    color: '#94a3b8',
    bg: 'rgba(148,163,184,0.08)',
    url: '',
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

const ConnectProviderCard: React.FC<{ providerKey: string; onConnect: (key: string) => void }> = ({ providerKey, onConnect }) => {
  const meta = PROVIDER_META[providerKey] ?? PROVIDER_META.manual;
  return (
    <button
      onClick={() => onConnect(providerKey)}
      className="rounded-xl p-4 flex items-center gap-3 w-full text-left hover:brightness-110 transition-all group"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}
    >
      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: meta.bg }}>
        {meta.logo}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-white/70 group-hover:text-white transition-colors">{meta.name}</p>
        <p className="text-[10px] text-white/25">Click to connect</p>
      </div>
      <Plus size={14} className="text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
    </button>
  );
};

type SubPage = 'hub' | 'logbook' | 'sync';

export const LogbookHub: React.FC<LogbookHubProps> = ({ profile }) => {
  const [subPage, setSubPage] = useState<SubPage>('hub');
  const [providers, setProviders] = useState<SyncedProvider[]>([]);
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
    if (providerKey === 'myflight') {
      // MyFlight Logbook OAuth redirect (placeholder — replace with real OAuth URL)
      window.open(`https://myflightbook.com/oauth/authorize?client_id=PILOTRECOGNITION&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/myflight/callback')}&scope=readflights&state=${profile.id}`, '_blank');
    } else if (providerKey === 'manual') {
      setSubPage('logbook');
    } else {
      alert(`${PROVIDER_META[providerKey]?.name ?? providerKey} integration coming soon.`);
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
          <div className="rounded-xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
            <BookMarked size={28} className="text-white/15 mx-auto mb-3" />
            <p className="text-sm font-black text-white/40">No providers connected yet</p>
            <p className="text-[11px] text-white/25 mt-1">Connect a logbook provider below to sync your hours</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {providers.map(p => (
              <ProviderCard key={p.id} provider={p} onOpenLogbook={() => setSubPage('logbook')} />
            ))}
          </div>
        )}
      </div>

      {/* Available providers to connect */}
      {availableToConnect.length > 0 && (
        <div>
          <div className="mb-3">
            <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Available Integrations</p>
            <p className="text-sm font-black text-white">Connect a Provider</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {availableToConnect.map(key => (
              <ConnectProviderCard key={key} providerKey={key} onConnect={handleConnect} />
            ))}
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
