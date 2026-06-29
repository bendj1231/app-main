import React from 'react';
import {
  Home,
  User,
  Shield,
  Map,
  BookOpen,
  Plane,
  Wrench,
  FileText,
  BookMarked,
  Calendar,
  Newspaper,
  Settings,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Bell,
  Building2,
  AlertTriangle,
  Star,
  BadgeCheck,
  Target,
} from 'lucide-react';
import { supabase } from '@/lib/shared/supabase';
import type { NavItem } from './types';

interface Profile {
  id?: string;
  last_flown?: string | null;
  last_flight_date?: string | null;
  region?: string | null;
  location?: string | null;
  total_flight_hours?: number | null;
  pilot_stage?: string | null;
  license_type?: string | null;
  current_level?: string | null;
  current_occupation?: string | null;
  license_types?: string | string[] | null;
  ratings?: string | string[] | null;
  [key: string]: unknown;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Recognition Board', icon: BarChart3 },
  { id: 'home', label: 'Home', icon: Home },
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'wallet', label: 'Credential Vault', icon: Shield },
  { id: 'pathways-directory', label: 'Pathways', icon: Map },
  { id: 'programs', label: 'Programs', icon: BookOpen },
  { id: 'airlines', label: 'Airlines', icon: Plane },
  { id: 'manufacturers', label: 'Manufacturers', icon: Wrench },
  { id: 'atlas-cv', label: 'Atlas CV', icon: FileText },
  { id: 'verification', label: 'Verification', icon: BadgeCheck },
  { id: 'logbook', label: 'Logbook', icon: BookMarked },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'newsroom', label: 'Newsroom', icon: Newspaper },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const scoreColour = (s: number) =>
  s >= 80
    ? 'text-emerald-600'
    : s >= 60
      ? 'text-blue-600'
      : s >= 40
        ? 'text-yellow-600'
        : 'text-red-600';

export const scoreBg = (s: number) =>
  s >= 80 ? 'bg-emerald-500' : s >= 60 ? 'bg-blue-500' : s >= 40 ? 'bg-yellow-500' : 'bg-red-500';

export const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    verified: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    expired: 'bg-red-100 text-red-700 border-red-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    in_review: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return map[status] ?? 'bg-slate-100 text-slate-600 border-slate-200';
};

export const ScoreBar: React.FC<{ score: number; label?: string }> = ({ score, label }) => (
  <div className="w-full">
    {label && (
      <div className="flex justify-between text-xs text-white/50 mb-1">
        <span>{label}</span>
        <span className={scoreColour(score)}>{score}/100</span>
      </div>
    )}
    <div
      className="h-2 rounded-full overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.1)' }}
    >
      <div
        className={`h-full rounded-full transition-all duration-700 ${scoreBg(score)}`}
        style={{ width: `${score}%` }}
      />
    </div>
  </div>
);

export const LogbookPreviewPanel: React.FC<{ profile: Profile; onOpenLogbook: () => void }> = ({
  profile,
  onOpenLogbook,
}) => {
  const [logs, setLogs] = React.useState<Record<string, unknown>[]>([]);
  React.useEffect(() => {
    const id = profile?.id;
    if (!id) return;
    let active = true;
    supabase
      .from('pilot_flight_logs')
      .select('id,date,aircraft_type,route,hours')
      .eq('user_id', id)
      .order('date', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (active) setLogs(data ?? []);
      });
    return () => {
      active = false;
    };
  }, [profile?.id]);
  const totalHours = profile?.total_flight_hours ?? 0;
  return (
    <div
      style={{
        background: 'rgba(15,23,42,0.75)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">
            Digital Logbook
          </p>
          <p className="text-sm font-black text-white tracking-wide">Recent Flights</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-sky-300">
            {Number(totalHours).toLocaleString()} hrs total
          </span>
          <button
            onClick={onOpenLogbook}
            className="text-[10px] font-black tracking-wider text-sky-400 hover:text-sky-300 transition-colors"
          >
            ADD FLIGHT +
          </button>
        </div>
      </div>
      <div className="px-5 pb-4">
        {logs.length === 0 ? (
          <div
            className="flex items-center gap-3 py-3"
            style={{ border: '1px dashed rgba(255,255,255,0.1)' }}
          >
            <BookMarked size={14} className="text-white/20 mx-auto" />
            <p className="text-[10px] text-white/25 text-center w-full">No flights logged yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-3 px-3 py-2"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div
                  className="w-6 h-6 flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(14,165,233,0.12)',
                    border: '1px solid rgba(14,165,233,0.2)',
                  }}
                >
                  <Plane size={10} className="text-sky-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-white truncate">
                    {log.aircraft_type || '—'} {log.route ? `· ${log.route}` : ''}
                  </p>
                  <p className="text-[9px] text-white/30">
                    {log.date
                      ? new Date(log.date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: '2-digit',
                        })
                      : '—'}
                  </p>
                </div>
                <span className="text-[10px] font-black text-sky-300 flex-shrink-0">
                  {log.hours}h
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const CredentialRequestCard: React.FC<{
  request: Record<string, unknown>;
  onRespond: (approved: boolean) => Promise<void>;
}> = ({ request, onRespond }) => {
  const [responding, setResponding] = React.useState<'approve' | 'deny' | null>(null);
  const [done, setDone] = React.useState(false);
  const [decision, setDecision] = React.useState<'approved' | 'denied' | null>(null);

  const handle = async (approved: boolean) => {
    setResponding(approved ? 'approve' : 'deny');
    await onRespond(approved);
    setDecision(approved ? 'approved' : 'denied');
    setDone(true);
    setResponding(null);
  };

  const enterpriseName = request.enterprise_accounts?.name ?? 'An airline';
  const fields: string[] = request.requested_fields ?? ['license', 'medical', 'elp'];
  const requestedAt = new Date(request.requested_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (done) {
    return (
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{
          background: decision === 'approved' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.07)',
          border: `1px solid ${decision === 'approved' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.2)'}`,
        }}
      >
        <span className="text-sm">{decision === 'approved' ? '✅' : '🚫'}</span>
        <p className="text-xs font-bold text-white/70">
          {decision === 'approved'
            ? `Access granted to ${enterpriseName}`
            : `Request from ${enterpriseName} declined`}
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.3)' }}
    >
      <div className="flex items-start gap-3 px-4 pt-4 pb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)' }}
        >
          <Building2 size={16} className="text-orange-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-white tracking-wide">
            {enterpriseName} — Credential Request
          </p>
          <p className="text-[10px] text-white/45 mt-0.5">
            Requested {requestedAt} · Fields: {fields.join(', ')}
          </p>
          {request.request_message && (
            <p className="text-[10px] text-white/60 mt-1.5 leading-relaxed italic">
              "{request.request_message}"
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2 px-4 pb-4">
        <button
          disabled={!!responding}
          onClick={() => handle(true)}
          className="flex-1 py-2 text-[11px] font-black tracking-wider text-white rounded-lg transition-all"
          style={{
            background: responding === 'approve' ? 'rgba(16,185,129,0.5)' : 'rgba(16,185,129,0.75)',
            border: '1px solid rgba(16,185,129,0.4)',
          }}
        >
          {responding === 'approve' ? 'Approving…' : '✓ APPROVE'}
        </button>
        <button
          disabled={!!responding}
          onClick={() => handle(false)}
          className="flex-1 py-2 text-[11px] font-black tracking-wider text-white/70 rounded-lg transition-all"
          style={{
            background: responding === 'deny' ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.25)',
          }}
        >
          {responding === 'deny' ? 'Declining…' : '✕ DECLINE'}
        </button>
      </div>
    </div>
  );
};

export const NotificationsFeedPanel: React.FC<{ profileId?: string; profile?: Profile }> = ({
  profileId,
  profile,
}) => {
  const [notifs, setNotifs] = React.useState<Record<string, unknown>[]>([]);
  React.useEffect(() => {
    if (!profileId) return;
    let active = true;
    supabase
      .from('pilot_notifications')
      .select('*')
      .eq('pilot_id', profileId)
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => {
        if (active) setNotifs(data ?? []);
      });
    return () => {
      active = false;
    };
  }, [profileId]);

  const hours = profile?.total_flight_hours ?? 0;
  const targetHours = 1500;
  const hoursRemaining = Math.max(0, targetHours - hours);
  const hasPpl = hasProfileField(profile, ['ppl', 'private']);
  const hasCpl = hasProfileField(profile, ['cpl', 'commercial']);
  const hasIr = hasProfileField(profile, ['instrument', 'ir']);
  const hasAtpl = hasProfileField(profile, ['atpl', 'airline transport', 'frozen atpl']);
  const pathwayReminder = (() => {
    if (hoursRemaining > 0 && !hasCpl)
      return {
        title: 'Pathway objective: earn CPL + hours',
        body: `${hoursRemaining.toFixed(0)} hours left to reach the ${targetHours} hr regional-FO target.`,
        type: 'pathway_reminder',
      };
    if (hoursRemaining > 0 && hasCpl)
      return {
        title: 'Pathway objective: build hours',
        body: `${hoursRemaining.toFixed(0)} hours remaining to hit the ${targetHours} hr target.`,
        type: 'pathway_reminder',
      };
    if (!hasPpl)
      return {
        title: 'Pathway objective: start PPL',
        body: 'Begin Private Pilot License training to unlock the pathway tracker.',
        type: 'pathway_reminder',
      };
    if (!hasIr)
      return {
        title: 'Pathway objective: add Instrument Rating',
        body: 'Instrument Rating is required for most airline pathway targets.',
        type: 'pathway_reminder',
      };
    if (!hasAtpl)
      return {
        title: 'Pathway objective: ATPL theory',
        body: 'Complete ATPL / frozen ATPL theory to meet airline requirements.',
        type: 'pathway_reminder',
      };
    return {
      title: 'Pathway target met',
      body: 'You have reached the minimum regional-FO requirements. Apply to pathways.',
      type: 'pathway_reminder',
    };
  })();

  const lastFlightDate = profile?.last_flown || profile?.last_flight_date;
  const [daysSinceFlight] = React.useState(() =>
    lastFlightDate
      ? Math.floor((Date.now() - new Date(lastFlightDate).getTime()) / (1000 * 60 * 60 * 24))
      : null
  );
  const staleThreshold = 14;
  const nearbySchools = (() => {
    const region = (profile?.region || profile?.location || 'Global').toString().toLowerCase();
    if (region.includes('philippine') || region.includes('manila') || region.includes('cebu'))
      return ['WCC Aviation College', 'OMNI Aviation', 'ALG ATO'];
    if (region.includes('uae') || region.includes('dubai') || region.includes('abudhabi'))
      return ['Emirates Flight Academy', 'Gulf Aviation Academy', 'Dubai Aviation Club'];
    if (region.includes('usa') || region.includes('america'))
      return ['ATP Flight School', 'American Flyers', "Sporty's Academy"];
    if (region.includes('uk') || region.includes('britain') || region.includes('england'))
      return [
        'L3Harris Airline Academy',
        'CAE Oxford Aviation Academy',
        'Skyborne Airline Academy',
      ];
    if (region.includes('europe') || region.includes('germany') || region.includes('france'))
      return [
        'European Flight Academy',
        'Lufthansa Aviation Training',
        'Air France Flight Academy',
      ];
    return ['European Flight Academy', 'ATP Flight School', 'WCC Aviation College'];
  })();
  const flightSchoolReminder =
    daysSinceFlight === null || daysSinceFlight > staleThreshold
      ? {
          title: 'Keep your hours fresh',
          body: `You haven't flown in ${daysSinceFlight === null ? 'a while' : `${daysSinceFlight} days`}. Book a flight with a nearby school to keep your profile score up.`,
          type: 'flight_school_reminder',
          action: { label: 'BOOK A FLIGHT', schools: nearbySchools },
        }
      : null;

  const markRead = async (id: string) => {
    await supabase.from('pilot_notifications').update({ is_read: true }).eq('id', id);
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const iconFor = (type: string) => {
    if (type === 'credential_request')
      return { icon: Building2, color: '#f97316', bg: 'rgba(249,115,22,0.12)' };
    if (type === 'credential_expiry')
      return { icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' };
    if (type === 'tc_update')
      return { icon: FileText, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' };
    if (type === 'subscription_expiry')
      return { icon: Star, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };
    if (type === 'pathway_reminder')
      return { icon: Target, color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' };
    if (type === 'flight_school_reminder')
      return { icon: Plane, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' };
    return { icon: Bell, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' };
  };

  const allNotifs = [
    pathwayReminder,
    ...(flightSchoolReminder ? [flightSchoolReminder] : []),
    ...notifs,
  ];

  return (
    <div
      style={{
        background: 'rgba(15,23,42,0.75)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Activity</p>
          <p className="text-sm font-black text-white tracking-wide">Notifications</p>
        </div>
        {notifs.some((n) => !n.is_read) && (
          <span
            className="text-[9px] font-black px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(239,68,68,0.15)',
              color: '#f87171',
              border: '1px solid rgba(239,68,68,0.25)',
            }}
          >
            {notifs.filter((n) => !n.is_read).length} UNREAD
          </span>
        )}
      </div>
      <div className="px-5 pb-4">
        {allNotifs.length === 0 ? (
          <div className="flex items-center justify-center py-4">
            <p className="text-[10px] text-white/20">No notifications</p>
          </div>
        ) : (
          <div className="space-y-1">
            {allNotifs.map((n) => {
              const cfg = iconFor(n.type);
              const Icon = cfg.icon;
              return (
                <div
                  key={n.id ?? n.type}
                  className="flex items-start gap-3 px-3 py-2.5 cursor-pointer hover:brightness-110 transition-all"
                  style={{
                    background: n.is_read ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${n.is_read ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)'}`,
                  }}
                  onClick={() => n.id && !n.is_read && markRead(n.id)}
                >
                  <div
                    className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.color}30` }}
                  >
                    <Icon size={10} style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-[10px] font-black truncate ${n.is_read ? 'text-white/50' : 'text-white'}`}
                    >
                      {n.title}
                    </p>
                    {n.body && (
                      <p className="text-[9px] text-white/30 mt-0.5 leading-relaxed line-clamp-2">
                        {n.body}
                      </p>
                    )}
                    {n.action && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {n.action.schools.map((school: string) => (
                          <button
                            key={school}
                            className="px-2 py-1 rounded-md text-[8px] font-black tracking-wider text-white transition-all hover:brightness-110"
                            style={{
                              background:
                                'linear-gradient(135deg, rgba(245,158,11,0.9), rgba(217,119,6,0.9))',
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(
                                `Booking request for ${school} — contact integration placeholder`
                              );
                            }}
                          >
                            {n.action.label} {school}
                          </button>
                        ))}
                      </div>
                    )}
                    {n.created_at && (
                      <p className="text-[8px] text-white/20 mt-1">
                        {new Date(n.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    )}
                  </div>
                  {!n.is_read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0 mt-1.5" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export const StatusPill: React.FC<{ status: string; label?: string }> = ({ status, label }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${statusBadge(status)}`}
  >
    {status === 'verified' && <CheckCircle size={10} />}
    {status === 'expired' && <XCircle size={10} />}
    {status === 'pending' && <Clock size={10} />}
    {status === 'in_review' && <RefreshCw size={10} />}
    {label ?? status.replace('_', ' ').toUpperCase()}
  </span>
);

export const glassCard = 'rounded-xl p-5';

export const glassStyle: React.CSSProperties = {
  background: 'rgba(30,41,59,0.75)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.1)',
};

export const SectionCard: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ title, children, className = '', action, style }) => (
  <div className={`${glassCard} ${className}`} style={style ?? glassStyle}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xs font-bold text-white/80 uppercase tracking-widest">{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

export const EmailVerifyGate: React.FC<{ onResend: () => void; sent: boolean }> = ({
  onResend,
  sent,
}) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
    <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-5">
      <Bell size={28} className="text-amber-400" />
    </div>
    <h2 className="text-xl font-black text-white mb-2">Verify your email first</h2>
    <p className="text-sm text-white/50 max-w-sm mb-6 leading-relaxed">
      Your credential vault is locked until you confirm your email address. Check your inbox for a
      verification link from PilotRecognition.
    </p>
    {sent ? (
      <p className="text-xs text-emerald-400 font-semibold">
        ✓ Verification email sent — check your inbox
      </p>
    ) : (
      <button
        onClick={onResend}
        className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black rounded-lg transition-colors tracking-wider"
      >
        RESEND VERIFICATION EMAIL
      </button>
    )}
  </div>
);

function hasProfileField(profile: Profile | null, terms: string[]) {
  if (!profile) return false;
  const text = [
    profile?.pilot_stage,
    profile?.license_type,
    profile?.current_level,
    profile?.current_occupation,
    Array.isArray(profile?.license_types)
      ? profile.license_types.join(' ')
      : profile?.license_types,
    Array.isArray(profile?.ratings) ? profile.ratings.join(' ') : profile?.ratings,
  ]
    .join(' ')
    .toLowerCase();
  return terms.some((t) => text.includes(t));
}
