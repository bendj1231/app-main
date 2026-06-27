'use client';
import React, { useState } from 'react';
import { supabase } from '../@/lib/supabase';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL as string;

// ─── Tier config ────────────────────────────────────────────────────────────
const TIER_CONFIG: Record<string, {
  label: string; ringColor: string; bgColor: string; borderColor: string;
  textColor: string; icon: string;
}> = {
  stable: {
    label: 'Stable Demand',
    ringColor: '#10b981', bgColor: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.2)',
    textColor: '#6ee7b7', icon: '✅',
  },
  window: {
    label: 'Upcoming Transition Window',
    ringColor: '#f59e0b', bgColor: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.2)',
    textColor: '#fde68a', icon: '⚡',
  },
  phaseout: {
    label: 'Critical Phase-Out',
    ringColor: '#ef4444', bgColor: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.25)',
    textColor: '#fca5a5', icon: '🔴',
  },
  end_of_service: {
    label: 'Critical Phase-Out',
    ringColor: '#dc2626', bgColor: 'rgba(220,38,38,0.08)', borderColor: 'rgba(220,38,38,0.3)',
    textColor: '#fca5a5', icon: '🔴',
  },
};

// ─── SVG Progress Ring ───────────────────────────────────────────────────────
const ProgressRing: React.FC<{ pct: number; color: string; size?: number }> = ({
  pct, color, size = 72,
}) => {
  const r = 15.9155;
  const circ = 2 * Math.PI * r;
  const filled = Math.min(100, Math.max(0, pct));
  const dash = `${filled}, 100`;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg
        viewBox="0 0 36 36"
        width={size} height={size}
        style={{ transform: 'rotate(-90deg)', display: 'block' }}
      >
        {/* Track */}
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3"
        />
        {/* Fill */}
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={dash} strokeLinecap="round"
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 900, color,
      }}>
        {filled.toFixed(1)}%
      </div>
    </div>
  );
};

// ─── Types ───────────────────────────────────────────────────────────────────
interface FleetIntelligenceCardProps {
  aircraftType: string;
  segment: string;
  fleetAge: number | string;
  retirementProbPct: number;
  retirementStatus: string;
  pilotActionRequired: string;
  demandSignal: string;
  recommendedTransition: string;
  age30Pct: number;
  age50Pct: number;
  age70Pct: number;
  yearsToWindow: number | null;
  marketAlignmentScore: number;
  tSource: string;
  tMethod: string;
  pilotId: string;
  onCidGenerated?: (cid: string) => void;
}

export const FleetIntelligenceCard: React.FC<FleetIntelligenceCardProps> = ({
  aircraftType, segment, fleetAge, retirementProbPct, retirementStatus,
  pilotActionRequired, demandSignal, recommendedTransition,
  age30Pct, age50Pct, age70Pct, yearsToWindow, marketAlignmentScore,
  tSource, tMethod, pilotId, onCidGenerated,
}) => {
  const [pinning, setPinning] = useState(false);
  const [cid, setCid] = useState<string | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);

  const tier = TIER_CONFIG[retirementStatus] ?? TIER_CONFIG.window;

  const handlePin = async () => {
    setPinning(true);
    setPinError(null);
    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) throw new Error('Not authenticated');

      const res = await fetch(`${SUPABASE_URL}/functions/v1/aviation-data-agent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'pin_market_audit',
          pilotId,
          aircraftType,
          fleetAge,
          retirementProbPct,
          retirementStatus,
          demandSignal,
          recommendedTransition,
          marketAlignmentScore,
          tSource,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Pin failed');
      if (data.cid) {
        setCid(data.cid);
        onCidGenerated?.(data.cid);
      }
    } catch (e: any) {
      setPinError(e.message);
    } finally {
      setPinning(false);
    }
  };

  return (
    <div style={{
      background: '#0f172a',
      border: `1px solid ${tier.borderColor}`,
      borderRadius: 16,
      overflow: 'hidden',
      fontFamily: 'system-ui, sans-serif',
      color: 'white',
      boxShadow: `0 8px 32px ${tier.ringColor}18`,
    }}>

      {/* Header */}
      <div style={{
        padding: '18px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Tier badge */}
          <span style={{
            display: 'inline-block', fontSize: 9, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '3px 10px', borderRadius: 20,
            background: tier.bgColor, color: tier.ringColor,
            border: `1px solid ${tier.borderColor}`,
          }}>
            {tier.icon} {tier.label}
          </span>
          <h3 style={{ margin: '8px 0 3px', fontSize: 15, fontWeight: 900, letterSpacing: '-0.02em' }}>
            {aircraftType} Fleet Intelligence
          </h3>
          <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
            t sourced: {tMethod?.startsWith('scraped') ? 'Airfleets.net (live scrape)' : tSource}
            {' · '}Weibull CDF — Boeing AEL
          </p>
        </div>

        {/* Progress ring */}
        <ProgressRing pct={retirementProbPct} color={tier.ringColor} size={72} />
      </div>

      {/* Data grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: 1, background: 'rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {[
          { label: 'Fleet Age',        value: fleetAge !== 'unknown' ? `${fleetAge} yrs` : '—', color: 'white' },
          { label: 'Retirement Prob.', value: `${retirementProbPct}%`,                          color: tier.ringColor },
          { label: 'Market Score',     value: `${marketAlignmentScore.toFixed(1)} / 10`,        color: '#10b981' },
          { label: '30% Entry Age',    value: `${age30Pct} yrs`,                                color: '#f59e0b' },
          { label: '50% Median',       value: `${age50Pct} yrs`,                                color: '#94a3b8' },
          { label: '70% Phase-out',    value: `${age70Pct} yrs`,                                color: '#ef4444' },
        ].map((item, i) => (
          <div key={i} style={{ padding: '10px 12px', background: '#0f172a' }}>
            <p style={{ margin: '0 0 2px', fontSize: 8, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</p>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: item.color, lineHeight: 1 }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Years to window */}
      {yearsToWindow !== null && yearsToWindow > 0 && (
        <div style={{ padding: '8px 20px', background: 'rgba(245,158,11,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700 }}>⏱</span>
          <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
            <strong style={{ color: '#f59e0b' }}>{yearsToWindow} years</strong> until fleet enters replacement window
          </p>
        </div>
      )}

      {/* Pilot action alert */}
      <div style={{ padding: '14px 20px', background: tier.bgColor, borderBottom: `1px solid ${tier.borderColor}` }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>{tier.icon}</span>
          <p style={{ margin: 0, fontSize: 11, color: tier.textColor, lineHeight: 1.65 }}>
            <strong>Pilot action:</strong> {pilotActionRequired}
          </p>
        </div>
      </div>

      {/* Recommended transition */}
      <div style={{ padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0 }}>Next Type</p>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: '#3b82f6' }}>{recommendedTransition}</p>
      </div>

      {/* IPFS anchor row */}
      <div style={{ padding: '14px 20px' }}>
        {!cid ? (
          <button
            onClick={handlePin}
            disabled={pinning}
            style={{
              width: '100%', padding: '11px 16px',
              background: pinning ? 'rgba(255,255,255,0.04)' : 'rgba(59,130,246,0.12)',
              border: '1px solid rgba(59,130,246,0.3)',
              color: pinning ? 'rgba(255,255,255,0.3)' : '#93c5fd',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', cursor: pinning ? 'wait' : 'pointer',
              borderRadius: 10, transition: 'all 0.2s',
            }}
          >
            {pinning ? '⏳ Pinning to IPFS…' : '🔗 Anchor Audit to IPFS — Generate Verified Badge'}
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* CID badge */}
            <div style={{
              padding: '10px 14px', background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.25)', borderRadius: 10,
            }}>
              <p style={{ margin: '0 0 3px', fontSize: 8, fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                ✅ Immutable CID Generated — Tamper-Proof Audit
              </p>
              <p style={{ margin: '0 0 6px', fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.55)', wordBreak: 'break-all' }}>{cid}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${cid}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 9, fontWeight: 700, color: '#10b981', textDecoration: 'none' }}
                >
                  View on IPFS ↗
                </a>
                <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
                <button
                  onClick={() => navigator.clipboard.writeText(cid)}
                  style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Copy CID
                </button>
              </div>
            </div>
            {/* Optimize profile CTA */}
            <a
              href="https://pilotrecognition.com"
              style={{
                display: 'block', textAlign: 'center', width: '100%',
                padding: '11px 16px', background: '#2563eb',
                color: 'white', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                textDecoration: 'none', borderRadius: 10,
                boxShadow: '0 4px 20px rgba(37,99,235,0.25)',
              }}
            >
              Optimize Profile to Future Demand →
            </a>
          </div>
        )}
        {pinError && (
          <p style={{ margin: '6px 0 0', fontSize: 9, color: '#f87171' }}>⚠ {pinError}</p>
        )}
      </div>
    </div>
  );
};

export default FleetIntelligenceCard;
