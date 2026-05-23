/**
 * InfrastructureDashboard — Admin-only overview of all infrastructure in use.
 * Queries Supabase tables directly. All data is read-only.
 * Only rendered for super_admin users.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/shared/lib/supabase';
import {
  Database, Cloud, Zap, Users, Shield, Activity, Image,
  CreditCard, Mail, RefreshCw, AlertTriangle, CheckCircle, XCircle,
  Server, Globe, Lock, FileText, TrendingUp, BarChart3, Clock
} from 'lucide-react';

interface InfraStats {
  // Supabase (auth + DB)
  totalPilots: number;
  pilotsToday: number;
  pilotsWeek: number;
  activeSubscriptions: number;
  totalCredentials: number;
  totalEnrollments: number;
  totalFlightLogs: number;
  totalReferrals: number;
  securityEventsToday: number;
  activityToday: number;
  // AI / Groq
  aiRequestsToday: number;
  aiRequestsTotal: number;
  aiUniqueUsersToday: number;
  // Veremark
  veremarkWebhooksTotal: number;
  veremarkWebhooksWeek: number;
  veremarkWebhooksProcessed: number;
  veremarkWebhooksErrored: number;
  // verification_checks (outbound requests)
  vcTotal: number;
  vcPending: number;
  vcInProgress: number;
  vcVerified: number;
  vcFailed: number;
  vcFlagged: number;
  vcExpired: number;
  vcManuallyOverridden: number;
  // Stripe
  stripeCheckoutsTotal: number;
  // Cloudinary (profile images)
  profilesWithImages: number;
  // Notifications (Firebase writes tracked via Supabase)
  notificationsToday: number;
  notificationsTotal: number;
  // Wallet / VC
  pilotWallets: number;
  vcRevocations: number;
  // Rate limits / security
  rateLimitBuckets: number;
  // Auth0
  auth0LoginsToday: number;
  auth0EventsTotal: number;
  // Logbook providers (MyFlightBook etc)
  logbookConnectionsTotal: number;
  logbookConnectionsActive: number;
  connectedProviders: string[];
  // Helio (crypto payments)
  helioTokensTotal: number;
  paymentSplitsTotal: number;
  // Walt.id / DID
  waltDids: number;
  waltWalletsActive: number;
  // Resend (email)
  emailsSentTotal: number;
  // IPFS
  ipfsPins: number;
}

const REFRESH_INTERVAL = 30000; // 30s

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = '#3b82f6',
  alert = false,
}: {
  icon: any;
  label: string;
  value: number | string;
  sub?: string;
  color?: string;
  alert?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-1"
      style={{
        background: alert ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${alert ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.07)'}`,
      }}
    >
      <Icon size={14} style={{ color }} />
      <p className="text-xl font-black text-white mt-1">{value}</p>
      <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider leading-tight">{label}</p>
      {sub && <p className="text-[9px] text-white/30 mt-0.5">{sub}</p>}
    </div>
  );
}

function ServiceBlock({
  title,
  status,
  icon: Icon,
  color,
  children,
}: {
  title: string;
  status: 'live' | 'partial' | 'unknown';
  icon: any;
  color: string;
  children: React.ReactNode;
}) {
  const statusColor = status === 'live' ? '#22c55e' : status === 'partial' ? '#f59e0b' : '#6b7280';
  const statusLabel = status === 'live' ? 'Live' : status === 'partial' ? 'Partial' : 'Unknown';

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon size={15} style={{ color }} />
          <span className="text-[11px] font-black uppercase tracking-widest text-white/80">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
          <span className="text-[9px] font-bold" style={{ color: statusColor }}>{statusLabel}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

export const InfrastructureDashboard: React.FC = () => {
  const [stats, setStats] = useState<InfraStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

      const [
        pilotsRes, pilotsWeekRes, subRes, credRes, enrollRes, flightRes, refRes,
        secRes, actRes, aiTodayRes, aiTotalRes, aiUsersRes,
        veremarkRes, veremarkWeekRes, veremarkDetailRes,
        notifTodayRes, notifTotalRes,
        walletRes, vcRevRes,
        rateLimitRes, imagesRes,
        vcTotalRes, vcPendingRes, vcInProgressRes, vcVerifiedRes,
        vcFailedRes, vcFlaggedRes, vcExpiredRes, vcOverriddenRes,
        auth0TodayRes, auth0TotalRes,
        logbookTotalRes, logbookActiveRes, logbookProvidersRes,
        helioRes, paymentSplitsRes,
        waltDidsRes, waltWalletsRes,
        emailsRes, ipfsPinsRes,
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
        supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('pilot_credentials').select('*', { count: 'exact', head: true }),
        supabase.from('enrollments').select('*', { count: 'exact', head: true }),
        supabase.from('pilot_flight_logs').select('*', { count: 'exact', head: true }),
        supabase.from('referrals').select('*', { count: 'exact', head: true }),
        supabase.from('security_events').select('*', { count: 'exact', head: true }).gte('created_at', today),
        supabase.from('user_activity_log').select('*', { count: 'exact', head: true }).gte('created_at', today),
        supabase.from('ai_usage_log').select('*', { count: 'exact', head: true }).eq('date', today),
        supabase.from('ai_usage_log').select('*', { count: 'exact', head: true }),
        supabase.from('ai_usage_log').select('user_id').eq('date', today),
        supabase.from('veremark_webhook_logs').select('*', { count: 'exact', head: true }),
        supabase.from('veremark_webhook_logs').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
        supabase.from('verification_checks').select('id, status, manually_overridden'),
        supabase.from('notifications').select('*', { count: 'exact', head: true }).gte('created_at', today),
        supabase.from('notifications').select('*', { count: 'exact', head: true }),
        supabase.from('pilot_verification_wallet').select('*', { count: 'exact', head: true }),
        supabase.from('vc_revocation_registry').select('*', { count: 'exact', head: true }),
        supabase.from('rate_limit_buckets').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).not('profile_image_url', 'is', null),
        // verification_checks status breakdown
        supabase.from('verification_checks').select('*', { count: 'exact', head: true }),
        supabase.from('verification_checks').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('verification_checks').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
        supabase.from('verification_checks').select('*', { count: 'exact', head: true }).eq('status', 'verified'),
        supabase.from('verification_checks').select('*', { count: 'exact', head: true }).eq('status', 'failed'),
        supabase.from('verification_checks').select('*', { count: 'exact', head: true }).eq('status', 'flagged'),
        supabase.from('verification_checks').select('*', { count: 'exact', head: true }).eq('status', 'expired'),
        supabase.from('verification_checks').select('*', { count: 'exact', head: true }).eq('manually_overridden', true),
        // Auth0 — via activity log
        supabase.from('user_activity_log').select('*', { count: 'exact', head: true }).gte('created_at', today).or('activity_type.ilike.%login%,activity_type.ilike.%auth%'),
        supabase.from('user_activity_log').select('*', { count: 'exact', head: true }).or('activity_type.ilike.%login%,activity_type.ilike.%auth%'),
        // Logbook providers
        supabase.from('pilot_platform_connections').select('*', { count: 'exact', head: true }),
        supabase.from('pilot_platform_connections').select('*', { count: 'exact', head: true }).eq('connection_status', 'active'),
        supabase.from('pilot_platform_connections').select('provider_name'),
        // Helio
        supabase.from('ato_issued_tokens').select('*', { count: 'exact', head: true }),
        supabase.from('payment_splits').select('*', { count: 'exact', head: true }),
        // Walt.id
        supabase.from('pilot_dids').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).not('walt_wallet_id', 'is', null),
        // Resend — via notifications table method column
        supabase.from('notifications').select('*', { count: 'exact', head: true }),
        // IPFS
        supabase.from('public_ipfs_pins').select('*', { count: 'exact', head: true }),
      ]);

      const uniqueAIUsers = new Set((aiUsersRes.data || []).map((r: any) => r.user_id)).size;
      const connectedProviders: string[] = [...new Set<string>((logbookProvidersRes.data || []).map((r: any) => String(r.provider_name)).filter(Boolean))];

      setStats({
        totalPilots: pilotsRes.count ?? 0,
        pilotsToday: 0,
        pilotsWeek: pilotsWeekRes.count ?? 0,
        activeSubscriptions: subRes.count ?? 0,
        totalCredentials: credRes.count ?? 0,
        totalEnrollments: enrollRes.count ?? 0,
        totalFlightLogs: flightRes.count ?? 0,
        totalReferrals: refRes.count ?? 0,
        securityEventsToday: secRes.count ?? 0,
        activityToday: actRes.count ?? 0,
        aiRequestsToday: aiTodayRes.count ?? 0,
        aiRequestsTotal: aiTotalRes.count ?? 0,
        aiUniqueUsersToday: uniqueAIUsers,
        veremarkWebhooksTotal: veremarkRes.count ?? 0,
        veremarkWebhooksWeek: veremarkWeekRes.count ?? 0,
        veremarkWebhooksProcessed: (veremarkDetailRes.data || []).filter((r: any) => r.status === 'processed').length,
        veremarkWebhooksErrored: (veremarkDetailRes.data || []).filter((r: any) => r.status === 'error').length,
        vcTotal: vcTotalRes.count ?? 0,
        vcPending: vcPendingRes.count ?? 0,
        vcInProgress: vcInProgressRes.count ?? 0,
        vcVerified: vcVerifiedRes.count ?? 0,
        vcFailed: vcFailedRes.count ?? 0,
        vcFlagged: vcFlaggedRes.count ?? 0,
        vcExpired: vcExpiredRes.count ?? 0,
        vcManuallyOverridden: vcOverriddenRes.count ?? 0,
        stripeCheckoutsTotal: enrollRes.count ?? 0,
        profilesWithImages: imagesRes.count ?? 0,
        notificationsToday: notifTodayRes.count ?? 0,
        notificationsTotal: notifTotalRes.count ?? 0,
        pilotWallets: walletRes.count ?? 0,
        vcRevocations: vcRevRes.count ?? 0,
        rateLimitBuckets: rateLimitRes.count ?? 0,
        auth0LoginsToday: auth0TodayRes.count ?? 0,
        auth0EventsTotal: auth0TotalRes.count ?? 0,
        logbookConnectionsTotal: logbookTotalRes.count ?? 0,
        logbookConnectionsActive: logbookActiveRes.count ?? 0,
        connectedProviders,
        helioTokensTotal: helioRes.count ?? 0,
        paymentSplitsTotal: paymentSplitsRes.count ?? 0,
        waltDids: waltDidsRes.count ?? 0,
        waltWalletsActive: waltWalletsRes.count ?? 0,
        emailsSentTotal: emailsRes.count ?? 0,
        ipfsPins: ipfsPinsRes.count ?? 0,
      });
      setLastRefresh(new Date());
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
    const iv = setInterval(loadStats, REFRESH_INTERVAL);
    return () => clearInterval(iv);
  }, [loadStats]);

  if (loading && !stats) {
    return (
      <div className="flex items-center gap-2 text-white/40 text-xs py-4">
        <RefreshCw size={12} className="animate-spin" /> Loading infrastructure data...
      </div>
    );
  }

  if (error) {
    return <p className="text-xs text-red-400 py-2">Error loading infra stats: {error}</p>;
  }

  if (!stats) return null;

  const aiPct = Math.min(100, Math.round((stats.aiRequestsToday / 500) * 100));
  const aiBarColor = aiPct > 80 ? '#ef4444' : aiPct > 60 ? '#f59e0b' : '#22c55e';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#ef4444' }} />
          <span className="text-[10px] font-black uppercase tracking-widest text-red-400">
            Infrastructure Command Centre
          </span>
        </div>
        <div className="flex items-center gap-2">
          {lastRefresh && (
            <span className="text-[9px] text-white/30">
              Last refresh: {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={loadStats}
            className="flex items-center gap-1 px-2 py-1 rounded text-[9px] text-white/50 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <RefreshCw size={9} /> Refresh
          </button>
        </div>
      </div>

      {/* ── SUPABASE ───────────────────────────────────────────── */}
      <ServiceBlock title="Supabase — Auth + Database" status="live" icon={Database} color="#22c55e">
        <div className="grid grid-cols-4 gap-2">
          <StatCard icon={Users} label="Total Pilots" value={stats.totalPilots} color="#3b82f6" />
          <StatCard icon={TrendingUp} label="New This Week" value={stats.pilotsWeek} color="#8b5cf6" />
          <StatCard icon={CreditCard} label="Active Subs" value={stats.activeSubscriptions} color="#f59e0b" sub="Recognition+" />
          <StatCard icon={Activity} label="Activity Today" value={stats.activityToday} color="#22c55e" />
          <StatCard icon={FileText} label="Enrollments" value={stats.totalEnrollments} color="#06b6d4" />
          <StatCard icon={Globe} label="Flight Logs" value={stats.totalFlightLogs} color="#84cc16" />
          <StatCard icon={Users} label="Referrals" value={stats.totalReferrals} color="#ec4899" />
          <StatCard icon={Shield} label="Security Events Today" value={stats.securityEventsToday} color="#ef4444" alert={stats.securityEventsToday > 5} />
        </div>
      </ServiceBlock>

      {/* ── GROQ AI ────────────────────────────────────────────── */}
      <ServiceBlock title="Groq AI — llama-3.3-70b-versatile" status="live" icon={Zap} color="#8b5cf6">
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-white/50">Daily Platform Quota (500 hard limit)</span>
            <span className="text-[10px] font-black" style={{ color: aiBarColor }}>
              {stats.aiRequestsToday} / 500
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-1.5 rounded-full transition-all"
              style={{ width: `${aiPct}%`, background: aiBarColor }}
            />
          </div>
          <p className="text-[9px] text-white/30 mt-0.5">
            Groq free tier: 14,400 req/day &nbsp;·&nbsp; Platform cap: 500/day
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <StatCard icon={Zap} label="AI Requests Today" value={stats.aiRequestsToday} color="#8b5cf6" />
          <StatCard icon={BarChart3} label="All-Time AI Requests" value={stats.aiRequestsTotal} color="#a78bfa" />
          <StatCard icon={Users} label="Unique Users Today" value={stats.aiUniqueUsersToday} color="#c4b5fd" />
        </div>
      </ServiceBlock>

      {/* ── CLOUDINARY ─────────────────────────────────────────── */}
      <ServiceBlock title="Cloudinary — Profile Image Storage" status="live" icon={Image} color="#f59e0b">
        <div className="grid grid-cols-2 gap-2">
          <StatCard icon={Image} label="Pilots with Profile Images" value={stats.profilesWithImages} color="#f59e0b" sub={`${stats.totalPilots > 0 ? Math.round((stats.profilesWithImages / stats.totalPilots) * 100) : 0}% of pilots`} />
          <StatCard icon={Users} label="No Image Yet" value={stats.totalPilots - stats.profilesWithImages} color="#78716c" sub="Showing initials" />
        </div>
        <p className="text-[9px] text-white/20 mt-2">
          Cloud name: drcfmairy &nbsp;·&nbsp; Unsigned upload preset &nbsp;·&nbsp; Auto-optimize on delivery
        </p>
      </ServiceBlock>

      {/* ── FIREBASE ───────────────────────────────────────────── */}
      <ServiceBlock title="Firebase — Notifications (Firestore)" status="partial" icon={Cloud} color="#f97316">
        <div className="grid grid-cols-2 gap-2">
          <StatCard icon={Mail} label="Notifications Sent Today" value={stats.notificationsToday} color="#f97316" sub="Via Supabase notifications table" />
          <StatCard icon={BarChart3} label="Total Notifications" value={stats.notificationsTotal} color="#fb923c" />
        </div>
        <div
          className="mt-2 flex items-start gap-2 p-2 rounded-lg text-[9px] text-amber-300/70"
          style={{ background: 'rgba(251,146,60,0.06)', border: '1px solid rgba(251,146,60,0.15)' }}
        >
          <AlertTriangle size={10} className="flex-shrink-0 mt-0.5 text-amber-400" />
          Firebase Firestore writes happen client-side only — no invocation logs stored in Supabase.
          Counts above reflect the Supabase notifications table, not direct Firestore document writes.
          To get Firebase invocation counts, use the Firebase Console → Usage tab.
        </div>
      </ServiceBlock>

      {/* ── STRIPE ─────────────────────────────────────────────── */}
      <ServiceBlock title="Stripe — Payments" status={stats.activeSubscriptions > 0 ? 'live' : 'partial'} icon={CreditCard} color="#635bff">
        <div className="grid grid-cols-2 gap-2">
          <StatCard icon={CreditCard} label="Active Subscriptions" value={stats.activeSubscriptions} color="#635bff" sub="Recognition+ ($99/yr)" />
          <StatCard icon={FileText} label="Total Enrollments" value={stats.totalEnrollments} color="#7c3aed" sub="Programs purchased" />
        </div>
        <p className="text-[9px] text-white/20 mt-2">
          Full Stripe dashboard: dashboard.stripe.com &nbsp;·&nbsp; Webhook: /stripe-webhook
        </p>
      </ServiceBlock>

      {/* ── VEREMARK ───────────────────────────────────────────── */}
      <ServiceBlock
        title="Veremark — Credential Verification Pipeline"
        status={stats.vcTotal > 0 ? 'live' : stats.veremarkWebhooksTotal > 0 ? 'live' : 'partial'}
        icon={CheckCircle}
        color="#10b981"
      >
        {/* Outbound: checks we sent to Veremark */}
        <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">Outbound — Verification Requests Sent</p>
        <div className="grid grid-cols-4 gap-2 mb-3">
          <StatCard icon={FileText} label="Total Submitted" value={stats.vcTotal} color="#10b981" />
          <StatCard icon={Clock} label="Pending" value={stats.vcPending} color="#f59e0b" alert={stats.vcPending > 5} />
          <StatCard icon={Activity} label="In Progress" value={stats.vcInProgress} color="#3b82f6" />
          <StatCard icon={CheckCircle} label="Verified ✓" value={stats.vcVerified} color="#22c55e" />
        </div>
        <div className="grid grid-cols-4 gap-2 mb-3">
          <StatCard icon={XCircle} label="Failed" value={stats.vcFailed} color="#ef4444" alert={stats.vcFailed > 0} />
          <StatCard icon={AlertTriangle} label="Flagged ⚠" value={stats.vcFlagged} color="#f97316" alert={stats.vcFlagged > 0} />
          <StatCard icon={Clock} label="Expired" value={stats.vcExpired} color="#6b7280" alert={stats.vcExpired > 0} />
          <StatCard icon={Shield} label="Manually Overridden" value={stats.vcManuallyOverridden} color="#8b5cf6" />
        </div>

        {/* Visual status bar */}
        {stats.vcTotal > 0 && (
          <div className="mb-3">
            <div className="flex w-full h-2 rounded-full overflow-hidden gap-0.5">
              {stats.vcVerified > 0 && <div style={{ flex: stats.vcVerified, background: '#22c55e' }} title={`Verified: ${stats.vcVerified}`} />}
              {stats.vcInProgress > 0 && <div style={{ flex: stats.vcInProgress, background: '#3b82f6' }} title={`In Progress: ${stats.vcInProgress}`} />}
              {stats.vcPending > 0 && <div style={{ flex: stats.vcPending, background: '#f59e0b' }} title={`Pending: ${stats.vcPending}`} />}
              {stats.vcFlagged > 0 && <div style={{ flex: stats.vcFlagged, background: '#f97316' }} title={`Flagged: ${stats.vcFlagged}`} />}
              {stats.vcFailed > 0 && <div style={{ flex: stats.vcFailed, background: '#ef4444' }} title={`Failed: ${stats.vcFailed}`} />}
              {stats.vcExpired > 0 && <div style={{ flex: stats.vcExpired, background: '#6b7280' }} title={`Expired: ${stats.vcExpired}`} />}
            </div>
            <div className="flex gap-3 mt-1">
              {[
                { label: 'Verified', color: '#22c55e', v: stats.vcVerified },
                { label: 'In Progress', color: '#3b82f6', v: stats.vcInProgress },
                { label: 'Pending', color: '#f59e0b', v: stats.vcPending },
                { label: 'Flagged', color: '#f97316', v: stats.vcFlagged },
                { label: 'Failed', color: '#ef4444', v: stats.vcFailed },
                { label: 'Expired', color: '#6b7280', v: stats.vcExpired },
              ].filter(x => x.v > 0).map(({ label, color, v }) => (
                <span key={label} className="flex items-center gap-1 text-[8px] text-white/40">
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: color }} />
                  {label} ({v})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Inbound: webhooks Veremark sent us */}
        <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2 mt-1">Inbound — Webhooks Received from Veremark</p>
        <div className="grid grid-cols-4 gap-2">
          <StatCard icon={Globe} label="Total Received" value={stats.veremarkWebhooksTotal} color="#10b981" />
          <StatCard icon={Clock} label="This Week" value={stats.veremarkWebhooksWeek} color="#34d399" />
          <StatCard icon={CheckCircle} label="Processed OK" value={stats.veremarkWebhooksProcessed} color="#22c55e" />
          <StatCard icon={AlertTriangle} label="Errors" value={stats.veremarkWebhooksErrored} color="#ef4444" alert={stats.veremarkWebhooksErrored > 0} />
        </div>

        {stats.vcTotal === 0 && (
          <div className="mt-3 flex items-start gap-2 p-2 rounded-lg text-[9px] text-white/40"
            style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)' }}>
            <AlertTriangle size={10} className="flex-shrink-0 mt-0.5 text-emerald-500" />
            No verification checks submitted yet. Integration pending CAAP PEL API confirmation.
            Webhook endpoint: /veremark-webhook &nbsp;·&nbsp; Table: verification_checks
          </div>
        )}
      </ServiceBlock>

      {/* ── WALLET / VC ────────────────────────────────────────── */}
      <ServiceBlock title="Pilot Wallet — Verifiable Credentials" status="live" icon={Lock} color="#06b6d4">
        <div className="grid grid-cols-3 gap-2">
          <StatCard icon={Lock} label="Wallets Provisioned" value={stats.pilotWallets} color="#06b6d4" />
          <StatCard icon={Shield} label="Credentials Issued" value={stats.totalCredentials} color="#0891b2" />
          <StatCard icon={AlertTriangle} label="VC Revocations" value={stats.vcRevocations} color="#ef4444" alert={stats.vcRevocations > 0} />
        </div>
      </ServiceBlock>

      {/* ── NEON + MONGODB ─────────────────────────────────────── */}
      <ServiceBlock title="Neon PostgreSQL + MongoDB Atlas" status="unknown" icon={Server} color="#6b7280">
        <p className="text-[9px] text-white/40 leading-relaxed">
          Neon (Singapore) — OEM data, pathway cards, IPFS CID index. Query via NEON_DATABASE_URL.
          No usage counters stored in Supabase — check Neon Console for query metrics.
        </p>
        <p className="text-[9px] text-white/40 leading-relaxed mt-1">
          MongoDB Atlas (Singapore) — raw aviation API payloads, logbook JSON, flight telemetry.
          No usage counters stored in Supabase — check Atlas Dashboard for operation counts.
        </p>
        <div className="flex gap-2 mt-2">
          <a
            href="https://console.neon.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] px-2 py-1 rounded text-white/50 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Neon Console →
          </a>
          <a
            href="https://cloud.mongodb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] px-2 py-1 rounded text-white/50 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            MongoDB Atlas →
          </a>
        </div>
      </ServiceBlock>

      {/* ── BACKBLAZE B2 ───────────────────────────────────────── */}
      <ServiceBlock title="Backblaze B2 — Cold Backup Storage" status="unknown" icon={Server} color="#6b7280">
        <p className="text-[9px] text-white/40">
          Nightly backup of Supabase + Neon via b2-backup edge function. No usage tracked in Supabase.
          Check Backblaze dashboard for storage usage and backup history.
        </p>
      </ServiceBlock>

      {/* ── RATE LIMITS ────────────────────────────────────────── */}
      <ServiceBlock title="Rate Limiting + Security" status="live" icon={Shield} color="#ef4444">
        <div className="grid grid-cols-2 gap-2">
          <StatCard icon={Shield} label="Active Rate Limit Buckets" value={stats.rateLimitBuckets} color="#ef4444" sub="Sliding window entries" />
          <StatCard icon={AlertTriangle} label="Security Events Today" value={stats.securityEventsToday} color="#f97316" alert={stats.securityEventsToday > 10} />
        </div>
      </ServiceBlock>

      {/* ── AUTH0 ──────────────────────────────────────────────── */}
      <ServiceBlock title="Auth0 — Identity Provider" status="live" icon={Shield} color="#eb5424">
        <div className="grid grid-cols-2 gap-2">
          <StatCard icon={Users} label="Auth Events Today" value={stats.auth0LoginsToday} color="#eb5424" sub="Logged in user_activity_log" />
          <StatCard icon={BarChart3} label="Auth Events Total" value={stats.auth0EventsTotal} color="#f97316" />
        </div>
        <div
          className="mt-2 flex items-start gap-2 p-2 rounded-lg text-[9px] text-amber-300/70"
          style={{ background: 'rgba(235,84,36,0.06)', border: '1px solid rgba(235,84,36,0.15)' }}
        >
          <AlertTriangle size={10} className="flex-shrink-0 mt-0.5" style={{ color: '#eb5424' }} />
          Full Auth0 login counts, MFA events, and anomaly detection require the Auth0 Dashboard → Monitoring → Logs.
          Counts above reflect activity logged in Supabase only.
        </div>
        <a href="https://manage.auth0.com" target="_blank" rel="noopener noreferrer"
          className="inline-block mt-2 text-[9px] px-2 py-1 rounded text-white/50 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >Auth0 Dashboard →</a>
      </ServiceBlock>

      {/* ── LOGBOOK PROVIDERS ──────────────────────────────────── */}
      <ServiceBlock
        title="Logbook Providers — MyFlightBook / ForeFlight / Safelog"
        status={stats.logbookConnectionsTotal > 0 ? 'live' : 'partial'}
        icon={Activity}
        color="#0ea5e9"
      >
        <div className="grid grid-cols-2 gap-2">
          <StatCard icon={Activity} label="Total OAuth Connections" value={stats.logbookConnectionsTotal} color="#0ea5e9" />
          <StatCard icon={CheckCircle} label="Active Connections" value={stats.logbookConnectionsActive} color="#22c55e" />
        </div>
        {stats.connectedProviders.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="text-[9px] text-white/40 mr-1">Connected providers:</span>
            {stats.connectedProviders.map(p => (
              <span key={p} className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(14,165,233,0.15)', color: '#38bdf8' }}>{p}</span>
            ))}
          </div>
        ) : (
          <p className="text-[9px] text-white/30 mt-2">No pilots have connected a logbook provider yet. OAuth callback: /auth/logbook/callback</p>
        )}
      </ServiceBlock>

      {/* ── HELIO ──────────────────────────────────────────────── */}
      <ServiceBlock title="Helio — Crypto Payments (USDC)" status={stats.helioTokensTotal > 0 ? 'live' : 'partial'} icon={Zap} color="#a855f7">
        <div className="grid grid-cols-2 gap-2">
          <StatCard icon={Zap} label="ATO Tokens Issued" value={stats.helioTokensTotal} color="#a855f7" sub="Via helio-webhook" />
          <StatCard icon={CreditCard} label="Payment Splits" value={stats.paymentSplitsTotal} color="#c084fc" sub="3-way: Veremark / ATO / Platform" />
        </div>
        {stats.helioTokensTotal === 0 && (
          <p className="text-[9px] text-white/30 mt-2">No Helio payments processed yet — webhook: /helio-webhook</p>
        )}
      </ServiceBlock>

      {/* ── WALT.ID / DID ──────────────────────────────────────── */}
      <ServiceBlock title="Walt.id — DID / Verifiable Credential Issuer" status={stats.waltWalletsActive > 0 ? 'live' : 'partial'} icon={Lock} color="#6366f1">
        <div className="grid grid-cols-2 gap-2">
          <StatCard icon={Lock} label="Walt Wallets Active" value={stats.waltWalletsActive} color="#6366f1" sub="profiles with walt_wallet_id" />
          <StatCard icon={Globe} label="DIDs Registered" value={stats.waltDids} color="#818cf8" sub="pilot_dids table" />
        </div>
        <p className="text-[9px] text-white/20 mt-2">
          Issuer API: issuer.portal.walt.id &nbsp;·&nbsp; Wallet API: VITE_WALT_WALLET_API &nbsp;·&nbsp; Wallet provision edge fn: /wallet-provision
        </p>
      </ServiceBlock>

      {/* ── RESEND ─────────────────────────────────────────────── */}
      <ServiceBlock title="Resend — Transactional Email" status="live" icon={Mail} color="#64748b">
        <div className="grid grid-cols-2 gap-2">
          <StatCard icon={Mail} label="Notifications (Supabase)" value={stats.emailsSentTotal} color="#94a3b8" sub="All notification records" />
          <StatCard icon={Mail} label="Sent Today" value={stats.notificationsToday} color="#64748b" sub="Via Resend API" />
        </div>
        <p className="text-[9px] text-white/20 mt-2">
          Edge functions: send-account-created-email, send-enrollment-email, ato-notification &nbsp;·&nbsp;
          <a href="https://resend.com/emails" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/40">Resend Dashboard →</a>
        </p>
      </ServiceBlock>

      {/* ── SENTRY ─────────────────────────────────────────────── */}
      <ServiceBlock title="Sentry — Error Monitoring" status="unknown" icon={AlertTriangle} color="#f43f5e">
        <p className="text-[9px] text-white/40 leading-relaxed">
          Sentry is configured via src/lib/sentry.ts. Error events are sent directly to Sentry's servers — no counts stored in Supabase.
          Check Sentry Dashboard for error rates, performance traces, and replay sessions.
        </p>
        <a href="https://sentry.io" target="_blank" rel="noopener noreferrer"
          className="inline-block mt-2 text-[9px] px-2 py-1 rounded text-white/50 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >Sentry Dashboard →</a>
      </ServiceBlock>

      {/* ── IPFS / PINATA ──────────────────────────────────────── */}
      <ServiceBlock title="IPFS — Public Credential Pins" status={stats.ipfsPins > 0 ? 'live' : 'partial'} icon={Globe} color="#06b6d4">
        <div className="grid grid-cols-1 gap-2">
          <StatCard icon={Globe} label="Public IPFS Pins" value={stats.ipfsPins} color="#06b6d4" sub="Institutional / credential CIDs" />
        </div>
        {stats.ipfsPins === 0 && (
          <p className="text-[9px] text-white/30 mt-2">No IPFS pins yet — CIDs indexed in public_ipfs_pins table</p>
        )}
      </ServiceBlock>

      {/* Footer */}
      <div className="text-[9px] text-white/20 text-center pt-2 border-t border-white/5">
        Supabase-queryable: Groq AI, Cloudinary, Veremark, Stripe, Logbook connections, Helio, Walt.id, IPFS
        &nbsp;·&nbsp; External consoles needed: Auth0, Firebase, Neon, MongoDB, Sentry, Resend, Backblaze
        &nbsp;·&nbsp; Auto-refresh every 30s
      </div>
    </div>
  );
};
