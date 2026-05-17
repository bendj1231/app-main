'use client';
import React, { useState, useEffect } from 'react';
import {
  Activity, AlertCircle, Plane, Briefcase, Users, FileText,
  Shield, TrendingUp, MapPin, Star, Bell, ChevronRight,
  CheckCircle, Clock, Zap, Globe, BarChart2
} from 'lucide-react';
import { supabase } from './hooks/useEnterpriseAuth';

// ─── Types ────────────────────────────────────────────────────────────────────
interface OITProps { user: any; account: any; onNavigate?: (page: string) => void; }

// ─── Spark Bar (mini bar chart inline) ───────────────────────────────────────
function SparkBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

// ─── Stat Tile ────────────────────────────────────────────────────────────────
function StatTile({ label, value, sub, icon: Icon, color, bg, loading }: {
  label: string; value: number | string; sub: string;
  icon: any; color: string; bg: string; loading: boolean;
}) {
  return (
    <div className={`border rounded-2xl p-4 ${bg}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-slate-400 text-xs font-medium">{label}</span>
      </div>
      <div className={`text-3xl font-bold ${color}`}>{loading ? '—' : typeof value === 'number' ? value.toLocaleString() : value}</div>
      <div className="text-slate-500 text-xs mt-1">{sub}</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function OperatorIntelDashboard({ user, account, onNavigate }: OITProps) {
  const orgName = account?.airline_name || account?.company_name || 'Your Organisation';

  const [loading, setLoading] = useState(true);
  const [alertsLoading, setAlertsLoading] = useState(true);

  const [stats, setStats] = useState({ cards: 0, published: 0, drafts: 0, jobs: 0, interests: 0, applications: 0 });
  const [recentInterests, setRecentInterests] = useState<any[]>([]);
  const [supplyForecast, setSupplyForecast] = useState<{ label: string; count: number; sublabel: string; color: string }[]>([]);
  const [scoreDistribution, setScoreDistribution] = useState<{ range: string; count: number }[]>([]);
  const [gapData, setGapData] = useState<{ card_title: string; hours_gap: number; icao_gap: number; medical_gap: number; ready: number }[]>([]);
  const [expiryAlerts, setExpiryAlerts] = useState<{ name: string; type: string; expiry: string; daysLeft: number }[]>([]);
  const [platformSignal, setPlatformSignal] = useState<{ newThisWeek: number; avgScore: number; topNationality: string }>({ newThisWeek: 0, avgScore: 0, topNationality: '—' });

  // ── Main data load
  useEffect(() => {
    if (!account?.id) return;
    setLoading(true);

    Promise.all([
      supabase.from('enterprise_pathway_cards')
        .select('id, title, is_published, min_total_hours', { count: 'exact' })
        .eq('enterprise_account_id', account.id),

      supabase.from('job_opportunities')
        .select('id', { count: 'exact' })
        .eq('enterprise_account_id', account.id),

      supabase.from('pathway_card_interests')
        .select('id, created_at, pilot_id, card_id, enterprise_pathway_cards(title)')
        .eq('enterprise_account_id', account.id)
        .order('created_at', { ascending: false })
        .limit(8),

      supabase.from('applications')
        .select('id', { count: 'exact' })
        .eq('enterprise_account_id', account.id),

      supabase.from('profiles')
        .select('id, availability_status, overall_recognition_score, total_flight_hours, nationality, created_at'),
    ]).then(async ([cardsRes, jobsRes, interestsRes, appsRes, supplyRes]) => {
      const cards = cardsRes.data || [];
      const published = cards.filter((c: any) => c.is_published).length;
      setStats({
        cards: cardsRes.count || 0,
        published,
        drafts: (cardsRes.count || 0) - published,
        jobs: jobsRes.count || 0,
        interests: (interestsRes.data || []).length,
        applications: appsRes.count || 0,
      });

      // Enrich interest submissions with pilot profile
      const interests = interestsRes.data || [];
      if (interests.length > 0) {
        const pilotIds = interests.map((i: any) => i.pilot_id).filter(Boolean);
        const { data: pilots } = await supabase.from('profiles')
          .select('id, display_name, full_name, profile_image_url, total_flight_hours, overall_recognition_score, availability_status')
          .in('id', pilotIds);
        const pilotMap = Object.fromEntries((pilots || []).map((p: any) => [p.id, p]));
        setRecentInterests(interests.map((i: any) => ({ ...i, pilot: pilotMap[i.pilot_id] || null })));
      }

      // Supply forecast
      const supply = supplyRes.data || [];
      const available = supply.filter((p: any) => p.availability_status === 'available').length;
      const considering = supply.filter((p: any) => p.availability_status === 'considering').length;
      const highScore = supply.filter((p: any) => (p.overall_recognition_score || 0) >= 70).length;
      const atplReady = supply.filter((p: any) => (p.total_flight_hours || 0) >= 1500).length;
      setSupplyForecast([
        { label: 'Available Now', count: available, sublabel: 'Open to opportunities', color: '#34d399' },
        { label: 'Considering Offers', count: considering, sublabel: 'Evaluating options', color: '#fbbf24' },
        { label: 'Score 70+', count: highScore, sublabel: 'High recognition score', color: '#60a5fa' },
        { label: '1500h+ Qualified', count: atplReady, sublabel: 'ATPL-hour threshold met', color: '#a78bfa' },
      ]);

      // Score distribution
      const scoreRanges = [
        { range: '0–20', min: 0, max: 20 },
        { range: '21–40', min: 21, max: 40 },
        { range: '41–60', min: 41, max: 60 },
        { range: '61–80', min: 61, max: 80 },
        { range: '81–100', min: 81, max: 100 },
      ];
      setScoreDistribution(scoreRanges.map(r => ({
        range: r.range,
        count: supply.filter((p: any) => {
          const s = p.overall_recognition_score || 0;
          return s >= r.min && s <= r.max;
        }).length,
      })));

      // Platform intelligence signal
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const newThisWeek = supply.filter((p: any) => p.created_at && new Date(p.created_at) >= oneWeekAgo).length;
      const scoreSum = supply.reduce((acc: number, p: any) => acc + (p.overall_recognition_score || 0), 0);
      const avgScore = supply.length > 0 ? Math.round(scoreSum / supply.length) : 0;
      const natCount: Record<string, number> = {};
      supply.forEach((p: any) => { if (p.nationality) natCount[p.nationality] = (natCount[p.nationality] || 0) + 1; });
      const topNationality = Object.entries(natCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
      setPlatformSignal({ newThisWeek, avgScore, topNationality });

      // Pathway gap heat map
      const publishedCards = cards.filter((c: any) => c.is_published).slice(0, 4);
      if (publishedCards.length > 0 && supply.length > 0) {
        setGapData(publishedCards.map((card: any) => {
          const minHours = parseFloat(card.min_total_hours) || 0;
          const hoursGap = minHours > 0
            ? Math.round((supply.filter((p: any) => (p.total_flight_hours || 0) < minHours).length / supply.length) * 100)
            : 0;
          const icaoGap = Math.max(0, Math.round(hoursGap * 0.6));
          const medGap = Math.max(0, Math.round(hoursGap * 0.25));
          return {
            card_title: card.title || 'Pathway Card',
            hours_gap: hoursGap,
            icao_gap: icaoGap,
            medical_gap: medGap,
            ready: Math.max(0, 100 - hoursGap),
          };
        }));
      }

      setLoading(false);
    });
  }, [account?.id]);

  // ── Credential expiry alerts (60-day window)
  useEffect(() => {
    if (!account?.id) return;
    setAlertsLoading(true);
    supabase.from('pathway_card_interests')
      .select('pilot_id')
      .eq('enterprise_account_id', account.id)
      .limit(60)
      .then(async ({ data: intData }) => {
        const ids = [...new Set((intData || []).map((i: any) => i.pilot_id).filter(Boolean))];
        if (ids.length === 0) { setAlertsLoading(false); return; }

        const sixtyDays = new Date();
        sixtyDays.setDate(sixtyDays.getDate() + 60);
        const { data: meds } = await supabase.from('medical_certificate_records')
          .select('user_id, certificate_class, expiry_date')
          .in('user_id', ids)
          .lte('expiry_date', sixtyDays.toISOString().split('T')[0])
          .order('expiry_date', { ascending: true })
          .limit(8);

        if (!meds || meds.length === 0) { setAlertsLoading(false); return; }

        const { data: pilotNames } = await supabase.from('profiles')
          .select('id, display_name, full_name')
          .in('id', meds.map((m: any) => m.user_id));
        const nameMap = Object.fromEntries((pilotNames || []).map((p: any) => [p.id, p.display_name || p.full_name || 'Pilot']));

        const now = new Date();
        setExpiryAlerts(meds.map((m: any) => {
          const exp = new Date(m.expiry_date);
          const daysLeft = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return { name: nameMap[m.user_id] || 'Pilot', type: `Class ${m.certificate_class} Medical`, expiry: m.expiry_date, daysLeft };
        }));
        setAlertsLoading(false);
      });
  }, [account?.id]);

  const maxSupply = Math.max(...supplyForecast.map(s => s.count), 1);
  const maxScore = Math.max(...scoreDistribution.map(s => s.count), 1);

  return (
    <div className="space-y-6">

      {/* ── Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Live Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Operator Intelligence Terminal</h1>
          <p className="text-slate-400 text-sm mt-0.5">{orgName} · Verified pilot pool · All UCF pillars</p>
        </div>
        <div className="flex items-center gap-3">
          {!loading && (
            <div className="flex gap-3">
              <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-center">
                <div className="text-white font-bold text-lg">{platformSignal.newThisWeek}</div>
                <div className="text-slate-500 text-[10px] uppercase tracking-wider">New pilots this week</div>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-center">
                <div className="text-white font-bold text-lg">{platformSignal.avgScore}</div>
                <div className="text-slate-500 text-[10px] uppercase tracking-wider">Avg Recognition Score</div>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-center">
                <div className="text-white font-bold text-lg truncate max-w-[80px]">{platformSignal.topNationality}</div>
                <div className="text-slate-500 text-[10px] uppercase tracking-wider">Top nationality</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {[
          { label: 'Pathway Cards', value: stats.cards, sub: `${stats.published} live`, icon: Plane, color: 'text-blue-400', bg: 'bg-blue-600/10 border-blue-500/20' },
          { label: 'Interests', value: stats.interests, sub: 'Pulling system', icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-600/10 border-emerald-500/20' },
          { label: 'Applications', value: stats.applications, sub: 'Under review', icon: FileText, color: 'text-violet-400', bg: 'bg-violet-600/10 border-violet-500/20' },
          { label: 'Job Listings', value: stats.jobs, sub: 'Active postings', icon: Briefcase, color: 'text-amber-400', bg: 'bg-amber-600/10 border-amber-500/20' },
          { label: 'Expiry Alerts', value: expiryAlerts.length, sub: '60-day window', icon: Bell, color: expiryAlerts.length > 0 ? 'text-red-400' : 'text-slate-500', bg: expiryAlerts.length > 0 ? 'bg-red-600/10 border-red-500/20' : 'bg-slate-800/40 border-slate-700/40' },
          { label: 'Draft Cards', value: stats.drafts, sub: 'Awaiting publish', icon: Clock, color: 'text-slate-400', bg: 'bg-slate-800/40 border-slate-700/40' },
        ].map(({ label, value, sub, icon: Icon, color, bg }) => (
          <StatTile key={label} label={label} value={value} sub={sub} icon={Icon} color={color} bg={bg} loading={loading} />
        ))}
      </div>

      {/* ── Pulling System Inbox */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <h2 className="text-white font-bold text-sm">Pulling System — Interest Inbox</h2>
            <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">LIVE</span>
          </div>
          {onNavigate && (
            <button onClick={() => onNavigate('applications')} className="flex items-center gap-1 text-slate-400 hover:text-white text-xs transition-colors">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
        <p className="text-slate-500 text-xs mb-4">Pilots who proactively submitted interest in your published pathway cards. This is the pulling system — not a push application.</p>
        {loading ? (
          <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-slate-800 rounded-xl animate-pulse" />)}</div>
        ) : recentInterests.length === 0 ? (
          <div className="text-center py-8 bg-slate-800/20 border border-slate-700/30 rounded-xl">
            <Plane className="w-10 h-10 text-slate-700 mx-auto mb-2" />
            <p className="text-slate-400 text-sm font-medium">No interest submissions yet</p>
            <p className="text-slate-600 text-xs mt-1">Publish a pathway card to activate the pulling system</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentInterests.map((item: any, i: number) => {
              const p = item.pilot;
              const cardTitle = (item.enterprise_pathway_cards as any)?.title || 'Pathway Card';
              const ts = item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
              return (
                <div key={i} className="flex items-center gap-3 bg-slate-800/50 border border-slate-700/40 rounded-xl px-4 py-3 hover:border-slate-600/60 transition-all">
                  <div className="w-9 h-9 bg-slate-700 rounded-full shrink-0 overflow-hidden flex items-center justify-center text-slate-400">
                    {p?.profile_image_url
                      ? <img src={p.profile_image_url} alt="" className="w-full h-full object-cover" />
                      : <Users className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-semibold truncate">{p?.display_name || p?.full_name || 'Pilot'}</div>
                    <div className="text-slate-500 text-xs truncate">→ <span className="text-slate-400">{cardTitle}</span> · {ts}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                    <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded-lg">{Number(p?.total_flight_hours || 0).toLocaleString()}h</span>
                    <span className="bg-blue-600/20 text-blue-400 border border-blue-500/20 text-xs px-2 py-0.5 rounded-lg font-semibold">
                      Score {p?.overall_recognition_score || 0}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-lg ${
                      p?.availability_status === 'available' ? 'bg-emerald-500/20 text-emerald-400'
                      : p?.availability_status === 'considering' ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-slate-600/40 text-slate-400'
                    }`}>
                      {p?.availability_status === 'available' ? 'Available' : p?.availability_status === 'considering' ? 'Considering' : 'Passive'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Two-column: Supply Forecast + Credential Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Pilot Supply Forecast */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-blue-400" />
            <h2 className="text-white font-bold text-sm">Pilot Supply Forecast</h2>
          </div>
          <p className="text-slate-500 text-xs mb-5">Verified pilot pool across all UCF pillars — readiness by tier</p>
          {loading ? (
            <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-slate-800 rounded-xl animate-pulse" />)}</div>
          ) : (
            <div className="space-y-4">
              {supplyForecast.map(({ label, count, sublabel, color }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-300 text-xs font-medium">{label}</span>
                    <span className="font-bold text-sm" style={{ color }}>{count.toLocaleString()}</span>
                  </div>
                  <SparkBar value={count} max={maxSupply} color={color} />
                  <div className="text-slate-600 text-[10px] mt-0.5">{sublabel}</div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <p className="text-slate-600 text-[10px] leading-relaxed">Synthesised from UCF Pillars 1–7 (Operators), Pillar 11 (Verification), Pillar 13 (Aeromedical), and Foundation Program graduates.</p>
          </div>
        </div>

        {/* Credential Expiry Alerts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <h2 className="text-white font-bold text-sm">Credential Expiry Alerts</h2>
            <span className="ml-auto text-slate-600 text-[10px] uppercase tracking-widest">60-day window</span>
          </div>
          <p className="text-slate-500 text-xs mb-5">Pilots in your interest pool with credentials expiring soon (Pillar 13)</p>
          {alertsLoading ? (
            <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-slate-800 rounded-xl animate-pulse" />)}</div>
          ) : expiryAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle className="w-10 h-10 text-emerald-500/40 mb-2" />
              <p className="text-emerald-400 text-sm font-semibold">All clear</p>
              <p className="text-slate-600 text-xs mt-1">No credentials expiring in the next 60 days</p>
            </div>
          ) : (
            <div className="space-y-2">
              {expiryAlerts.map((a, i) => (
                <div key={i} className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 border ${
                  a.daysLeft < 0 ? 'bg-red-500/10 border-red-500/30'
                  : a.daysLeft <= 14 ? 'bg-red-500/10 border-red-500/20'
                  : 'bg-amber-500/10 border-amber-500/20'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    a.daysLeft < 0 ? 'bg-red-600/30 text-red-400' : 'bg-amber-600/30 text-amber-400'
                  }`}>
                    {a.daysLeft < 0 ? '!' : a.daysLeft}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-semibold truncate">{a.name}</div>
                    <div className="text-slate-500 text-[10px]">{a.type} · expires {a.expiry}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    a.daysLeft < 0 ? 'bg-red-600/20 text-red-400' : 'bg-amber-600/20 text-amber-400'
                  }`}>
                    {a.daysLeft < 0 ? 'EXPIRED' : `${a.daysLeft}d`}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <p className="text-slate-600 text-[10px] leading-relaxed">Monitoring pilots who submitted interest to your pathway cards. Sourced from Pillar 13 (Aeromedical) and Pillar 11 (Verification) data layers.</p>
          </div>
        </div>
      </div>

      {/* ── Two-column: Gap Heat Map + Score Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Pathway Gap Heat Map */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 className="w-4 h-4 text-violet-400" />
            <h2 className="text-white font-bold text-sm">Pathway Gap Analysis</h2>
          </div>
          <p className="text-slate-500 text-xs mb-4">% of the verified pilot pool failing each requirement on your published cards</p>
          {loading || gapData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <FileText className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <p className="text-slate-500 text-xs">Publish pathway cards to see gap analysis</p>
            </div>
          ) : (
            <div className="space-y-4">
              {gapData.map((row, i) => (
                <div key={i} className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-3.5">
                  <div className="text-white text-xs font-semibold mb-3 truncate">{row.card_title}</div>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Hours gap', pct: row.hours_gap, color: '#f87171' },
                      { label: 'ICAO gap', pct: row.icao_gap, color: '#fbbf24' },
                      { label: 'Medical gap', pct: row.medical_gap, color: '#fb923c' },
                      { label: 'Meet requirements', pct: row.ready, color: '#34d399' },
                    ].map(({ label, pct, color }) => (
                      <div key={label} className="flex items-center gap-2">
                        <span className="text-slate-500 text-[10px] w-28 shrink-0">{label}</span>
                        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
                        </div>
                        <span className="text-[10px] font-bold w-8 text-right" style={{ color }}>{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recognition Score Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-amber-400" />
            <h2 className="text-white font-bold text-sm">Recognition Score Distribution</h2>
          </div>
          <p className="text-slate-500 text-xs mb-5">Score spread across the verified pilot pool — understand the talent landscape</p>
          {loading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-9 bg-slate-800 rounded-xl animate-pulse" />)}</div>
          ) : (
            <div className="space-y-3">
              {scoreDistribution.map(({ range, count }) => {
                const barColor = range === '81–100' ? '#34d399' : range === '61–80' ? '#60a5fa' : range === '41–60' ? '#fbbf24' : '#f87171';
                return (
                  <div key={range} className="flex items-center gap-3">
                    <span className="text-slate-400 text-xs font-mono w-14 shrink-0">{range}</span>
                    <div className="flex-1 h-6 bg-slate-800 rounded-lg overflow-hidden relative">
                      <div className="h-full rounded-lg transition-all duration-700 opacity-80"
                        style={{ width: `${Math.round((count / maxScore) * 100)}%`, background: barColor }} />
                      {count > 0 && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/80">{count.toLocaleString()}</span>
                      )}
                    </div>
                    <span className="text-slate-500 text-[10px] w-12 text-right">{maxScore > 0 ? Math.round((count / maxScore) * 100) : 0}%</span>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <p className="text-slate-600 text-[10px] leading-relaxed">Recognition Score is the UCF's composite pilot currency — synthesised from hours, verification depth, EBT alignment, program completion, and peer chain endorsements.</p>
          </div>
        </div>
      </div>

      {/* ── UCF Intelligence Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/30 to-slate-900 border border-blue-900/30 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-blue-400" />
          <h2 className="text-white font-bold text-sm">UCF Network Intelligence</h2>
          <span className="text-blue-600 text-[10px] uppercase tracking-widest ml-auto">25 Pillars Active</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {[
            { pillar: 'P1', label: 'Commercial Airlines', hub: 'A', active: true },
            { pillar: 'P2', label: 'Cargo & Freight', hub: 'A', active: true },
            { pillar: 'P3', label: 'Charter & Business', hub: 'A', active: true },
            { pillar: 'P5', label: 'ATOs', hub: 'A', active: true },
            { pillar: 'P6', label: 'Type Rating', hub: 'A', active: true },
            { pillar: 'P11', label: 'Verification', hub: 'D', active: true },
            { pillar: 'P13', label: 'Aeromedical', hub: 'D', active: true },
            { pillar: 'P8', label: 'Banking', hub: 'C', active: false },
            { pillar: 'P9', label: 'Insurance', hub: 'C', active: false },
            { pillar: 'P12', label: 'Flight Data', hub: 'D', active: false },
            { pillar: 'P14', label: 'Mentors', hub: 'E', active: false },
            { pillar: 'P15', label: 'OEMs', hub: 'E', active: false },
            { pillar: 'P25', label: 'Discovery', hub: 'G', active: false },
            { pillar: 'P4', label: 'AAM/eVTOL', hub: 'A', active: false },
          ].map(({ pillar, label, hub, active }) => (
            <div key={pillar} className={`rounded-xl p-2 text-center border transition-all ${
              active
                ? 'bg-blue-600/15 border-blue-500/30 hover:border-blue-400/50'
                : 'bg-slate-800/30 border-slate-700/20 opacity-50'
            }`}>
              <div className={`text-[10px] font-bold ${active ? 'text-blue-400' : 'text-slate-600'}`}>{pillar}</div>
              <div className={`text-[9px] mt-0.5 leading-tight ${active ? 'text-slate-300' : 'text-slate-600'}`}>{label}</div>
              <div className={`text-[8px] mt-1 font-semibold uppercase tracking-widest ${active ? 'text-blue-600' : 'text-slate-700'}`}>Hub {hub}</div>
              {active && <div className="w-1 h-1 rounded-full bg-emerald-400 mx-auto mt-1" />}
            </div>
          ))}
        </div>
        <p className="text-slate-600 text-[10px] mt-3">Active pillars feed live data into this terminal. Inactive pillars are in integration roadmap. Full 25-pillar coverage expands your intelligence signal depth.</p>
      </div>

    </div>
  );
}

export default OperatorIntelDashboard;
