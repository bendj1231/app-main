'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../src/lib/supabase';
import { FleetIntelligenceCard } from './FleetIntelligenceCard';
import PremiumFeaturesPanel from './PremiumFeaturesPanel';

const SUPABASE_URL = 'https://gkbhgrozrzhalnjherfu.supabase.co';

const REGIONS = ['Asia-Pacific', 'Europe', 'North America', 'Middle East', 'Latin America', 'Africa'];
const SEGMENT_COLORS: Record<string, string> = {
  narrowbody: '#3b82f6', widebody: '#8b5cf6', regional: '#f59e0b', freighter: '#64748b',
};
const BRACKET_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  critical: { label: 'Critical Demand',  color: '#dc2626', bg: 'rgba(220,38,38,0.08)',   border: 'rgba(220,38,38,0.25)' },
  high:     { label: 'High Demand',      color: '#16a34a', bg: 'rgba(22,163,74,0.08)',   border: 'rgba(22,163,74,0.25)' },
  moderate: { label: 'Moderate Demand',  color: '#d97706', bg: 'rgba(217,119,6,0.08)',   border: 'rgba(217,119,6,0.25)' },
  low:      { label: 'Low Demand',       color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)' },
  retiring: { label: 'Fleet Retiring',   color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.25)' },
};

interface Forecast {
  id: string; oem: string; forecast_year: number; aircraft_segment: string;
  region: string; deliveries_20yr: number; fleet_growth_pct: number;
  retiring_units: number; demand_index: number; source_url: string; report_title: string;
}

interface WeibullPoint { age: number; retirementProb: number; survivingPct: number; status: string; }
interface WeibullVar  { value: number | string | null; unit: string; description?: string; source: string; url?: string; }
interface GapAnalysis {
  currentAircraftType: string; segment: string; demandIndex: number;
  demandBracket: string; fleetRetirementRisk: boolean; retirementWindowEnd: number;
  recommendedTransition: string; transitionReason: string;
  projected20YrDeliveries: number; fleetGrowthPct: number; retiringUnits: number;
  region: string; marketAlignmentScore: number;
  weibull: {
    formula: string;
    variables: { t: WeibullVar; eta: WeibullVar; beta: WeibullVar; C_total: WeibullVar; U_annual: WeibullVar };
    parameters: { beta: number; eta: number; utilHrsPerYear: number };
    fleetAge: number | string;
    retirementProbabilityPct: number | null;
    retirementStatus: string | null;
    demandSignal: string | null;
    age30PctRetirement: number; age50PctRetirement: number; age70PctRetirement: number;
    yearsToReplacementWindow: number | null; yearsToPhaseOut: number | null;
    retirementCurve: WeibullPoint[];
    source: string; sourceUrl: string;
  };
  dataSources: { name: string; url: string; type: string; pii: boolean }[];
  legalBasis: string;
  ipfsCid?: string | null;
  ipfsUrl?: string | null;
}

interface CareerIntelligenceDashboardProps {
  profile: any;
}

const DemandBar: React.FC<{ value: number; max?: number; color: string }> = ({ value, max = 10, color }) => (
  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', width: '100%' }}>
    <div style={{ height: '100%', width: `${Math.min(100, (value / max) * 100)}%`, background: color, borderRadius: 3, transition: 'width 0.8s ease' }} />
  </div>
);

const StatCard: React.FC<{ label: string; value: string | number; sub?: string; color?: string }> = ({ label, value, sub, color = 'white' }) => (
  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '14px 16px' }}>
    <p style={{ margin: '0 0 6px', fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{label}</p>
    <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</p>
    {sub && <p style={{ margin: '4px 0 0', fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{sub}</p>}
  </div>
);

export const CareerIntelligenceDashboard: React.FC<CareerIntelligenceDashboardProps> = ({ profile }) => {
  const [aircraftType, setAircraftType] = useState(profile?.aircraft_type || profile?.current_aircraft || '');
  const [region, setRegion] = useState('Asia-Pacific');
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [yearOfManufacture, setYearOfManufacture] = useState<string>('');
  const [airlineSlug, setAirlineSlug] = useState<string>('');
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis | null>(null);
  const [ipfsCid, setIpfsCid] = useState<string | null>(null);
  const [showWeibull, setShowWeibull] = useState(false);
  const [showProvenance, setShowProvenance] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string>('');
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [forecastsLoading, setForecastsLoading] = useState(true);
  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>('heatmap');

  // Load all OEM forecasts + auth token + premium status on mount
  useEffect(() => {
    const load = async () => {
      setForecastsLoading(true);
      const [{ data: forecastData }, session] = await Promise.all([
        supabase.from('oem_market_forecasts').select('*').order('demand_index', { ascending: false }),
        supabase.auth.getSession(),
      ]);
      setForecasts(forecastData ?? []);
      setForecastsLoading(false);
      const token = session.data.session?.access_token || '';
      setAuthToken(token);
      if (token && profile?.id) {
        const { data: prof } = await supabase.from('profiles').select('recognition_plus, recognition_plus_expires').eq('id', profile.id).maybeSingle();
        const exp = prof?.recognition_plus_expires ? new Date(prof.recognition_plus_expires) > new Date() : true;
        setIsPremium(!!(prof?.recognition_plus && exp));
      }
    };
    load();
  }, []);

  // Auto-run gap analysis if pilot has aircraft type on profile
  useEffect(() => {
    if (aircraftType) runGapAnalysis();
  }, []);

  const runGapAnalysis = useCallback(async () => {
    if (!aircraftType.trim()) return;
    setLoading(true);
    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) return;
      const res = await fetch(`${SUPABASE_URL}/functions/v1/aviation-data-agent`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'gap_analysis', aircraftType, region, yearOfManufacture: yearOfManufacture ? parseInt(yearOfManufacture) : null, airlineSlug: airlineSlug.trim() || null }),
      });
      const data = await res.json();
      if (res.ok) {
        setGapAnalysis(data);
        if (data.ipfsCid) setIpfsCid(data.ipfsCid);
      }
    } catch (e) {
      console.error('Gap analysis error:', e);
    } finally {
      setLoading(false);
    }
  }, [aircraftType, region, yearOfManufacture, airlineSlug]);

  const filteredForecasts = activeSegment
    ? forecasts.filter(f => f.aircraft_segment === activeSegment)
    : forecasts;

  const regionForecasts = forecasts.filter(f => f.region === region);
  const totalDeliveries = regionForecasts.reduce((s, f) => s + (f.deliveries_20yr || 0), 0);
  const topSegment = regionForecasts.sort((a, b) => b.demand_index - a.demand_index)[0];

  const bracket = gapAnalysis ? BRACKET_CONFIG[gapAnalysis.demandBracket] ?? BRACKET_CONFIG.moderate : null;

  return (
    <div style={{ fontFamily: 'system-ui,sans-serif' }}>

      {/* Header */}
      <div style={{ padding: '20px 20px 0' }}>
        <p style={{ margin: '0 0 3px', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: '#dc2626', textTransform: 'uppercase' }}>Career Intelligence</p>
        <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>Market Intelligence Dashboard</h2>
        <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
          Public data from Boeing CMO, Airbus GMF & OEM forecasts — most pilots never see this.
        </p>
      </div>

      {/* Gap Analyzer Input */}
      <div style={{ margin: '16px 20px 0', padding: '16px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)' }}>
        <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Your Career Gap Analyzer</p>
        <p style={{ margin: '0 0 10px', fontSize: 9, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
          Enter an airline slug (e.g. <code style={{ color: '#f59e0b' }}>cebu-pacific</code>, <code style={{ color: '#f59e0b' }}>emirates</code>) to pull live fleet age via
          {' '}<strong style={{ color: 'rgba(255,255,255,0.4)' }}>Aviationstack → OpenSky → ARLA/FAA → BTS.gov → OpenDataSoft → UK CAA → CASA → Airfleets.net → Boeing AEL</strong> — or enter year built manually.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            value={aircraftType}
            onChange={e => setAircraftType(e.target.value)}
            placeholder="Aircraft type (e.g. A320, 737MAX, ATR72)"
            style={{ flex: 1, minWidth: 140, padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontSize: 12, outline: 'none' }}
          />
          <input
            value={airlineSlug}
            onChange={e => setAirlineSlug(e.target.value)}
            placeholder="Airline slug (e.g. cebu-pacific)"
            style={{ width: 160, padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${airlineSlug ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.12)'}`, color: 'white', fontSize: 12, outline: 'none' }}
          />
          <input
            value={yearOfManufacture}
            onChange={e => setYearOfManufacture(e.target.value)}
            placeholder="Year built (manual)"
            type="number"
            min={1960} max={new Date().getFullYear()}
            style={{ width: 120, padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontSize: 12, outline: 'none' }}
          />
          <select
            value={region}
            onChange={e => setRegion(e.target.value)}
            style={{ padding: '8px 12px', background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontSize: 12, outline: 'none' }}
          >
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <button
            onClick={runGapAnalysis}
            disabled={loading || !aircraftType.trim()}
            style={{ padding: '8px 20px', background: loading ? '#475569' : '#dc2626', color: 'white', border: 'none', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: loading ? 'wait' : 'pointer' }}
          >
            {loading ? 'Analyzing…' : 'Analyze'}
          </button>
        </div>

        {/* Gap Analysis Result */}
        {gapAnalysis && bracket && (
          <div style={{ marginTop: 14, padding: '14px 16px', background: bracket.bg, border: `1px solid ${bracket.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <span style={{ fontSize: 9, fontWeight: 700, color: bracket.color, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{bracket.label}</span>
                <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 900, color: 'white' }}>{gapAnalysis.currentAircraftType} — {gapAnalysis.segment}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: 28, fontWeight: 900, color: bracket.color, lineHeight: 1 }}>{gapAnalysis.demandIndex.toFixed(1)}</p>
                <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>/ 10 Demand Index</p>
              </div>
            </div>
            <DemandBar value={gapAnalysis.demandIndex} color={bracket.color} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
              <div style={{ padding: '8px 10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ margin: '0 0 2px', fontSize: 8, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>20-yr Deliveries ({gapAnalysis.region})</p>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'white' }}>{gapAnalysis.projected20YrDeliveries.toLocaleString()}</p>
              </div>
              <div style={{ padding: '8px 10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ margin: '0 0 2px', fontSize: 8, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Market Alignment Score</p>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#10b981' }}>{gapAnalysis.marketAlignmentScore.toFixed(1)} / 10</p>
              </div>
            </div>
            {/* Weibull — 5 variable readout + demand signal */}
            {gapAnalysis.weibull && (
              <>
                {gapAnalysis.weibull.demandSignal && (
                  <>
                    <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14 }}>{gapAnalysis.weibull.retirementStatus === 'stable' ? '✅' : gapAnalysis.weibull.retirementStatus === 'window' ? '⚡' : '🔴'}</span>
                        <div>
                          <p style={{ margin: 0, fontSize: 11, fontWeight: 900, color: 'white' }}>{gapAnalysis.weibull.demandSignal}</p>
                          <p style={{ margin: 0, fontSize: 8, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>P_R({gapAnalysis.weibull.fleetAge}) = {gapAnalysis.weibull.retirementProbabilityPct}%</p>
                        </div>
                      </div>
                      {/* t source badge */}
                      <span style={{ fontSize: 8, padding: '2px 8px', background: (gapAnalysis.weibull.variables?.t as any)?.method?.startsWith('scraped') ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: (gapAnalysis.weibull.variables?.t as any)?.method?.startsWith('scraped') ? '#10b981' : '#f59e0b', border: `1px solid ${(gapAnalysis.weibull.variables?.t as any)?.method?.startsWith('scraped') ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`, letterSpacing: '0.06em', fontWeight: 700 }}>
                        {(gapAnalysis.weibull.variables?.t as any)?.method?.startsWith('scraped') || (gapAnalysis.weibull.variables?.t as any)?.method === 'api'
                          ? `🔴 LIVE — ${(gapAnalysis.weibull.variables?.t as any)?.source ?? 'Live Provider'}`
                          : '✏ MANUAL INPUT'}
                      </span>
                    </div>
                    {/* Pilot action box */}
                    {(gapAnalysis.weibull as any).pilotActionRequired && (
                      <div style={{ marginTop: 6, padding: '10px 12px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}>
                        <p style={{ margin: '0 0 2px', fontSize: 8, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pilot Action Required</p>
                        <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{(gapAnalysis.weibull as any).pilotActionRequired}</p>
                      </div>
                    )}
                  </>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 5, marginTop: 8 }}>
                  {[
                    { label: 't (Age)',      value: gapAnalysis.weibull.fleetAge !== 'unknown' ? `${gapAnalysis.weibull.fleetAge}y` : '—',   sub: 'Airfleets/FAA', color: 'white' },
                    { label: 'η Char.Life',  value: `${gapAnalysis.weibull.parameters.eta}y`,                                                  sub: 'Boeing AEL',   color: '#94a3b8' },
                    { label: 'β Wear-out',   value: gapAnalysis.weibull.parameters.beta,                                                        sub: 'Boeing AEL',   color: '#8b5cf6' },
                    { label: 'U Annual',     value: `${((gapAnalysis.weibull.parameters as any).utilHrsPerYear || 3000).toLocaleString()}h`,    sub: 'Boeing AEL',   color: '#3b82f6' },
                    { label: 'C Total est.', value: gapAnalysis.weibull.variables?.C_total?.value != null ? Number(gapAnalysis.weibull.variables.C_total.value).toLocaleString() : '—', sub: 'AviationDB', color: '#f59e0b' },
                  ].map((v, i) => (
                    <div key={i} style={{ padding: '7px 6px', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <p style={{ margin: '0 0 1px', fontSize: 7, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{v.label}</p>
                      <p style={{ margin: '0 0 1px', fontSize: 12, fontWeight: 900, color: v.color, lineHeight: 1 }}>{v.value}</p>
                      <p style={{ margin: 0, fontSize: 6, color: 'rgba(255,255,255,0.18)' }}>{v.sub}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 5, marginTop: 5 }}>
                  {[
                    { label: '< 30% Stable',   age: (gapAnalysis.weibull as any).age30PctRetirement, color: '#10b981' },
                    { label: '30–60% Window',   age: (gapAnalysis.weibull as any).age30PctRetirement, color: '#f59e0b' },
                    { label: '> 70% Phase-out', age: (gapAnalysis.weibull as any).age70PctRetirement, color: '#ef4444' },
                  ].map((th, i) => (
                    <div key={i} style={{ padding: '5px 8px', background: 'rgba(0,0,0,0.15)', border: `1px solid ${th.color}33` }}>
                      <p style={{ margin: '0 0 1px', fontSize: 7, color: th.color, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{th.label}</p>
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: 'white' }}>@ {th.age} yrs</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Weibull curve toggle */}
            {gapAnalysis.weibull?.retirementCurve && (
              <div style={{ marginTop: 10 }}>
                <button onClick={() => setShowWeibull(!showWeibull)}
                  style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 12px', cursor: 'pointer' }}>
                  {showWeibull ? '▲ Hide' : '▼ Show'} Weibull Attrition Curve
                </button>
                {showWeibull && (
                  <div style={{ marginTop: 8, padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p style={{ margin: '0 0 8px', fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      F(t) = 1 − exp(−(t/η)^β) &nbsp;·&nbsp; β={gapAnalysis.weibull.parameters.beta} η={gapAnalysis.weibull.parameters.eta} &nbsp;·&nbsp; Source: {gapAnalysis.weibull.source}
                    </p>
                    {/* SVG mini chart */}
                    <svg viewBox="0 0 360 80" width="100%" style={{ display: 'block' }}>
                      {/* Grid lines */}
                      {[0,25,50,75,100].map(pct => (
                        <line key={pct} x1={0} y1={80 - pct * 0.8} x2={360} y2={80 - pct * 0.8}
                          stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
                      ))}
                      {/* 50% threshold marker */}
                      <line x1={0} y1={40} x2={360} y2={40} stroke="rgba(239,68,68,0.3)" strokeWidth={0.8} strokeDasharray="4 3" />
                      <text x={2} y={37} fontSize={6} fill="rgba(239,68,68,0.5)">50% retire</text>
                      {/* Surviving fleet curve (green) */}
                      <polyline
                        fill="none" stroke="#10b981" strokeWidth={1.5}
                        points={gapAnalysis.weibull.retirementCurve.map((p, i) => `${i * (360 / 35)},${80 - p.survivingPct * 0.8}`).join(' ')}
                      />
                      {/* Retirement probability curve (red) */}
                      <polyline
                        fill="none" stroke="#ef4444" strokeWidth={1.5}
                        points={gapAnalysis.weibull.retirementCurve.map((p, i) => `${i * (360 / 35)},${80 - p.retirementProb * 0.8}`).join(' ')}
                      />
                      {/* Current fleet age marker */}
                      {typeof gapAnalysis.weibull.fleetAge === 'number' && (
                        <line
                          x1={gapAnalysis.weibull.fleetAge * (360 / 35)}
                          y1={0}
                          x2={gapAnalysis.weibull.fleetAge * (360 / 35)}
                          y2={80}
                          stroke="#f59e0b" strokeWidth={1.2} strokeDasharray="3 2"
                        />
                      )}
                      {/* X-axis labels */}
                      {[0, 5, 10, 15, 20, 25, 30, 35].map(yr => (
                        <text key={yr} x={yr * (360 / 35) + 1} y={78} fontSize={6} fill="rgba(255,255,255,0.25)">{yr}y</text>
                      ))}
                    </svg>
                    <div style={{ display: 'flex', gap: 14, marginTop: 6 }}>
                      <span style={{ fontSize: 8, color: '#10b981' }}>— Surviving fleet %</span>
                      <span style={{ fontSize: 8, color: '#ef4444' }}>— Retirement probability %</span>
                      {typeof gapAnalysis.weibull.fleetAge === 'number' && <span style={{ fontSize: 8, color: '#f59e0b' }}>┊ Current fleet age</span>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {gapAnalysis.fleetRetirementRisk && (
              <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, color: '#ef4444' }}>⚠ Fleet Retirement Risk Detected</p>
                <p style={{ margin: '0 0 6px', fontSize: 10, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                  Your current fleet type hits its economic attrition window by <strong style={{ color: 'white' }}>{gapAnalysis.retirementWindowEnd}</strong>. Start planning your next type rating now.
                </p>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#10b981' }}>
                  Recommended transition → {gapAnalysis.recommendedTransition}
                </p>
                <p style={{ margin: '3px 0 0', fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{gapAnalysis.transitionReason}</p>
              </div>
            )}
            {/* Fleet Intelligence Card */}
            <div style={{ marginTop: 12 }}>
              <FleetIntelligenceCard
                aircraftType={gapAnalysis.currentAircraftType}
                segment={gapAnalysis.segment}
                fleetAge={gapAnalysis.weibull.fleetAge}
                retirementProbPct={gapAnalysis.weibull.retirementProbabilityPct ?? 0}
                retirementStatus={gapAnalysis.weibull.retirementStatus ?? 'stable'}
                pilotActionRequired={(gapAnalysis.weibull as any).pilotActionRequired ?? ''}
                demandSignal={gapAnalysis.weibull.demandSignal ?? ''}
                recommendedTransition={gapAnalysis.recommendedTransition}
                age30Pct={gapAnalysis.weibull.age30PctRetirement}
                age50Pct={gapAnalysis.weibull.age50PctRetirement}
                age70Pct={gapAnalysis.weibull.age70PctRetirement}
                yearsToWindow={gapAnalysis.weibull.yearsToReplacementWindow}
                marketAlignmentScore={gapAnalysis.marketAlignmentScore}
                tSource={(gapAnalysis.weibull.variables?.t as any)?.source ?? 'manual'}
                tMethod={(gapAnalysis.weibull.variables?.t as any)?.method ?? 'manual'}
                pilotId={profile?.id ?? ''}
                onCidGenerated={cid => setIpfsCid(cid)}
              />
            </div>

            {/* Recognition+ Premium Features */}
            {authToken && (
              <div style={{ marginTop: 12 }}>
                <PremiumFeaturesPanel
                  isPremium={isPremium}
                  pilotId={profile?.id ?? ''}
                  authToken={authToken}
                  supabaseUrl={SUPABASE_URL}
                  gapAnalysisResult={gapAnalysis}
                />
              </div>
            )}

            {/* Data provenance toggle */}
            {gapAnalysis.dataSources && (
              <div style={{ marginTop: 8 }}>
                <button onClick={() => setShowProvenance(!showProvenance)}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', fontSize: 8, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: 0, cursor: 'pointer' }}>
                  {showProvenance ? '▲ Hide' : '▼ Show'} Data Sources & Legal Basis
                </button>
                {showProvenance && (
                  <div style={{ marginTop: 6, padding: '10px 12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p style={{ margin: '0 0 6px', fontSize: 8, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{gapAnalysis.legalBasis}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {gapAnalysis.dataSources.map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 8, padding: '1px 6px', background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', letterSpacing: '0.05em' }}>PUBLIC</span>
                          <a href={s.url} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', textDecoration: 'underline' }}>{s.name} ↗</a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* OEM Demand Heatmap */}
      <div style={{ margin: '12px 20px 0' }}>
        <button
          onClick={() => setExpanded(expanded === 'heatmap' ? null : 'heatmap')}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', color: 'white' }}
        >
          <div style={{ textAlign: 'left' }}>
            <p style={{ margin: '0 0 1px', fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>OEM Demand Heatmap</p>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: 'white' }}>43,000 Aircraft Over 20 Years — Where Are the Jobs?</p>
          </div>
          <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.3)' }}>{expanded === 'heatmap' ? '−' : '+'}</span>
        </button>

        {expanded === 'heatmap' && (
          <div style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.07)', borderTop: 'none', padding: '16px' }}>
            {/* Region summary stats */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              {REGIONS.filter(r => forecasts.some(f => f.region === r)).map(r => {
                const rForecasts = forecasts.filter(f => f.region === r);
                const total = rForecasts.reduce((s, f) => s + (f.deliveries_20yr || 0), 0);
                const topDI = Math.max(...rForecasts.map(f => f.demand_index || 0));
                const isActive = region === r;
                return (
                  <button key={r} onClick={() => setRegion(r)}
                    style={{ flex: 1, minWidth: 100, padding: '10px 12px', background: isActive ? 'rgba(220,38,38,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${isActive ? 'rgba(220,38,38,0.4)' : 'rgba(255,255,255,0.07)'}`, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                    <p style={{ margin: '0 0 2px', fontSize: 9, fontWeight: 700, color: isActive ? '#dc2626' : 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{r}</p>
                    <p style={{ margin: '0 0 1px', fontSize: 14, fontWeight: 900, color: 'white' }}>{total > 0 ? total.toLocaleString() : '—'}</p>
                    <p style={{ margin: 0, fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>DI {topDI.toFixed(1)}</p>
                  </button>
                );
              })}
            </div>

            {/* Segment filter tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
              {(['narrowbody','widebody','regional','freighter'] as const).map(seg => (
                <button key={seg} onClick={() => setActiveSegment(activeSegment === seg ? null : seg)}
                  style={{ padding: '4px 12px', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: activeSegment === seg ? SEGMENT_COLORS[seg] : 'rgba(255,255,255,0.05)', color: activeSegment === seg ? 'white' : 'rgba(255,255,255,0.4)', border: `1px solid ${activeSegment === seg ? SEGMENT_COLORS[seg] : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer' }}>
                  {seg}
                </button>
              ))}
            </div>

            {/* Forecast rows */}
            {forecastsLoading ? (
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '20px 0' }}>Loading forecast data…</p>
            ) : filteredForecasts.length === 0 ? (
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '20px 0' }}>No forecast data for this filter.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {filteredForecasts.map(f => {
                  const segColor = SEGMENT_COLORS[f.aircraft_segment] || '#94a3b8';
                  const bkt = f.demand_index >= 9 ? 'critical' : f.demand_index >= 7.5 ? 'high' : f.demand_index >= 6 ? 'moderate' : 'low';
                  const bktCfg = BRACKET_CONFIG[bkt];
                  return (
                    <div key={f.id} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, gap: 8, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 7px', background: segColor + '22', color: segColor, border: `1px solid ${segColor}44`, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{f.aircraft_segment}</span>
                          <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 7px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{f.oem.toUpperCase()}</span>
                          <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{f.region}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 9, fontWeight: 700, color: bktCfg.color, background: bktCfg.bg, border: `1px solid ${bktCfg.border}`, padding: '2px 8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{bktCfg.label}</span>
                          <span style={{ fontSize: 18, fontWeight: 900, color: bktCfg.color, lineHeight: 1 }}>{f.demand_index.toFixed(1)}</span>
                        </div>
                      </div>
                      <DemandBar value={f.demand_index} color={bktCfg.color} />
                      <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
                        <div>
                          <p style={{ margin: 0, fontSize: 8, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>20-yr Deliveries</p>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: 'white' }}>{(f.deliveries_20yr || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: 8, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Fleet Growth</p>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#10b981' }}>+{f.fleet_growth_pct}% / yr</p>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: 8, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Retiring Units</p>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#f59e0b' }}>{(f.retiring_units || 0).toLocaleString()}</p>
                        </div>
                        {f.source_url && (
                          <div style={{ marginLeft: 'auto' }}>
                            <a href={f.source_url} target="_blank" rel="noopener noreferrer"
                              style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)', textDecoration: 'underline', letterSpacing: '0.05em' }}>
                              {f.oem.toUpperCase()} Source ↗
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Region totals footer */}
            {totalDeliveries > 0 && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{region} — 20-Year Total</p>
                  <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: 'white' }}>{totalDeliveries.toLocaleString()} <span style={{ fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.3)' }}>aircraft deliveries</span></p>
                </div>
                {topSegment && (
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 1px', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Highest Demand Segment</p>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: SEGMENT_COLORS[topSegment.aircraft_segment] }}>{topSegment.aircraft_segment} — DI {topSegment.demand_index.toFixed(1)}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Public Data Disclosure Banner */}
      <div style={{ margin: '12px 20px 20px', padding: '12px 16px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
        <p style={{ margin: '0 0 4px', fontSize: 9, fontWeight: 700, color: '#10b981', letterSpacing: '0.15em', textTransform: 'uppercase' }}>This Data Is Public — Most Pilots Never Look</p>
        <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
          Boeing & Airbus publish 20-year delivery forecasts every year. CAAP, FAA and ICAO post all regulatory standards online. Manufacturers publish fleet retirement curves. PilotRecognition indexes this public data and maps it to your profile so you can make data-driven career decisions — not reactive ones.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
          {[
            { label: 'Boeing CMO', url: 'https://www.boeing.com/commercial/market/commercial-market-outlook' },
            { label: 'Airbus GMF', url: 'https://www.airbus.com/en/products-services/commercial-aircraft/market/global-market-forecast' },
            { label: 'ICAO Standards', url: 'https://www.icao.int/safety/Documents/ICAO_Annex1.pdf' },
            { label: 'Airfleets', url: 'https://airfleets.net' },
          ].map(s => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 9, fontWeight: 700, color: '#10b981', letterSpacing: '0.05em', textDecoration: 'underline' }}>
              {s.label} ↗
            </a>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CareerIntelligenceDashboard;
