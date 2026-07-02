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
  Inbox,
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
  X,
} from 'lucide-react';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
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
  { id: 'home', label: 'Home', icon: Home },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'logbook', label: 'Logbook', icon: BookMarked },
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'recognition-plus', label: 'Recognition+', icon: BadgeCheck },
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
  const { callApi } = useWorkerAuth();
  const [logs, setLogs] = React.useState<Record<string, unknown>[]>([]);
  React.useEffect(() => {
    const id = profile?.id;
    if (!id) return;
    let active = true;
    callApi<Record<string, unknown>[]>('queryTable', {
      table: 'pilot_flight_logs',
      operation: 'select',
      where: { user_id: id },
      limit: 3,
    }).then((rows) => {
      const sorted = (rows || []).sort((a: any, b: any) => {
        const da = a.date || '';
        const db = b.date || '';
        return db.localeCompare(da);
      });
      if (active) setLogs(sorted);
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

export const NotificationsFeedPanel: React.FC<{ profileId?: string; profile?: Profile; onClose?: () => void }> = ({
  profileId,
  profile,
  onClose,
}) => {
  const { callApi } = useWorkerAuth();
  const [notifs, setNotifs] = React.useState<Record<string, unknown>[]>([]);
  React.useEffect(() => {
    if (!profileId) return;
    let active = true;
    callApi<Record<string, unknown>[]>('queryTable', {
      table: 'pilot_notifications',
      operation: 'select',
      where: { pilot_id: profileId },
      limit: 8,
    }).then((rows) => {
      const sorted = (rows || []).sort((a: any, b: any) => {
        const ca = a.created_at || '';
        const cb = b.created_at || '';
        return cb.localeCompare(ca);
      });
      if (active) setNotifs(sorted);
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
    if (!id.startsWith('rp-')) {
      await callApi('queryTable', {
        table: 'pilot_notifications',
        operation: 'update',
        id,
        data: { is_read: true },
      });
    }
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const avatarFor = (type: string) => {
    const userPic = (profile as Record<string, unknown>)?.profile_image_url as string | undefined;
    if (type === 'pr_system')
      return { src: null, badge: 'pr', color: '#dc2626', bg: 'rgba(0,0,0,0.06)', label: 'PR' };
    if (type === 'recognition_plus')
      return { src: null, badge: 'rplus', color: '#dc2626', bg: 'rgba(220,38,38,0.08)', label: 'Recognition+' };
    if (type === 'credential_request')
      return { src: 'https://i.pravatar.cc/150?u=operator', badge: null, color: '#f97316', bg: 'rgba(249,115,22,0.12)', label: 'Operator' };
    if (type === 'credential_expiry')
      return { src: 'https://i.pravatar.cc/150?u=authority', badge: null, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'CAA' };
    if (type === 'tc_update')
      return { src: 'https://i.pravatar.cc/150?u=legal', badge: null, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', label: 'Legal' };
    if (type === 'subscription_expiry')
      return { src: 'https://i.pravatar.cc/150?u=premium', badge: null, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Recognition+' };
    if (type === 'pathway_reminder')
      return { src: userPic || 'https://i.pravatar.cc/150?u=pathway', badge: null, color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', label: 'Pathways' };
    if (type === 'flight_school_reminder')
      return { src: 'https://i.pravatar.cc/150?u=ato', badge: null, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: 'ATO' };
    return { src: userPic || 'https://i.pravatar.cc/150?u=system', badge: null, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', label: 'System' };
  };

  const isPlus = (profile as Record<string, unknown>)?.subscription_tier === 'plus' || (profile as Record<string, unknown>)?.subscription_tier === 'enterprise';
  const profileComplete = !!(profile?.license_type || profile?.pilot_stage);

  const recognitionPlusWelcome = profileComplete
    ? {
        id: 'rp-welcome',
        title: 'Welcome to Recognition+',
        body: 'Your profile is verified and active. Get started with automated compliance tracking, credential expiry alerts, and priority pathway access to airline recruiters.',
        type: 'recognition_plus',
        is_read: false,
      }
    : {
        id: 'rp-get-started',
        title: 'Complete your profile to unlock Recognition+',
        body: 'Your verification form has been received. Complete your pilot profile — add your license type, ratings, and total hours — to activate your Recognition+ status and start getting pulled by operators.',
        type: 'recognition_plus',
        is_read: false,
      };

  const verificationPending = {
    id: 'rp-verification-pending',
    title: 'Verification pending — hang tight',
    body: 'Your verification documents have been submitted and are under review by our compliance team. You will receive an update within 24–48 hours. No further action is required.',
    type: 'pr_system',
    is_read: false,
  };

  const upgradePrompt = !isPlus
    ? {
        id: 'rp-upgrade',
        title: 'Upgrade to Recognition+',
        body: 'Unlock verified hours, automated credential tracking, expiry alerts, and priority airline pathway access. Your profile score increases by 40% with Recognition+.',
        type: 'recognition_plus',
        is_read: false,
      }
    : null;

  const allNotifs = [
    upgradePrompt,
    recognitionPlusWelcome,
    ...(profileComplete ? [] : [verificationPending]),
    pathwayReminder,
    ...(flightSchoolReminder ? [flightSchoolReminder] : []),
    ...notifs,
  ].filter(Boolean);

  const unreadCount = notifs.filter((n) => !n.is_read).length;

  return (
    <div className="bg-white/80 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-200/60">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">Activity</p>
          <p className="text-sm font-black text-slate-900 tracking-wide">Notifications</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="flex items-center gap-1.5 text-[9px] font-black px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {unreadCount} UNREAD
            </span>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={14} className="text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Notification list */}
      <div className="px-3 py-3 max-h-[380px] overflow-y-auto">
        {allNotifs.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Bell size={24} className="text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No notifications yet</p>
              <p className="text-[11px] text-slate-300 mt-1">New activity will appear here</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {allNotifs.map((n) => {
              const cfg = avatarFor(n.type);
              return (
                <div
                  key={n.id ?? n.type}
                  className={`flex items-start gap-3 px-3.5 py-3.5 rounded-xl cursor-pointer transition-all ${
                    n.is_read
                      ? 'hover:bg-white/40'
                      : 'hover:bg-white/60'
                  }`}
                  style={{
                    background: n.is_read
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.25) 100%)'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.45) 100%)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.5)',
                    boxShadow: n.is_read
                      ? '0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)'
                      : '0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
                  }}
                  onClick={() => n.id && !n.is_read && markRead(n.id)}
                >
                  <div className="relative flex-shrink-0 mt-0.5">
                    {cfg.badge ? (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black"
                        style={{ background: cfg.bg, border: `2px solid ${cfg.color}30` }}
                      >
                        {cfg.badge === 'pr' ? (
                          <span><span className="text-black">P</span><span className="text-red-600">R</span></span>
                        ) : cfg.badge === 'rplus' ? (
                          <span className="text-red-600">R+</span>
                        ) : null}
                      </div>
                    ) : (
                      <img
                        src={cfg.src || ''}
                        alt={cfg.label}
                        className="w-10 h-10 rounded-full object-cover"
                        style={{ border: `2px solid ${cfg.color}40` }}
                      />
                    )}
                    {!n.is_read && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-sky-500 border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-[12px] font-bold truncate ${n.is_read ? 'text-slate-500' : 'text-slate-900'}`}>
                        {n.title}
                      </p>
                      <span className="text-[8px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                        {cfg.label}
                      </span>
                    </div>
                    {n.body && (
                      <p className={`text-[11px] mt-1 leading-relaxed line-clamp-2 ${n.is_read ? 'text-slate-400' : 'text-slate-500'}`}>
                        {n.body}
                      </p>
                    )}
                    {n.action && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {n.action.schools.map((school: string) => (
                          <button
                            key={school}
                            className="px-3 py-1.5 rounded-full text-[9px] font-black tracking-wider text-white transition-all hover:brightness-110"
                            style={{ background: cfg.color }}
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Booking request for ${school} — contact integration placeholder`);
                            }}
                          >
                            {n.action.label} {school}
                          </button>
                        ))}
                      </div>
                    )}
                    {n.created_at && (
                      <p className="text-[10px] text-slate-400 mt-1.5">
                        {new Date(n.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-200/60 bg-slate-50/50">
        <button
          className="w-full text-center text-[11px] font-black text-slate-500 hover:text-slate-700 transition-colors"
        >
          View all in Inbox →
        </button>
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
