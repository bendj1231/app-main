'use client';

import React, { useState } from 'react';
import { Lock, TrendingUp, DollarSign, Shield, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';

interface PremiumFeaturesPanelProps {
  isPremium: boolean;
  pilotId: string;
  authToken: string;
  supabaseUrl: string;
  gapAnalysisResult?: any;
}

interface SeniorityResult {
  riskScore: number;
  riskTier: string;
  actionRequired: string;
  transitionDeadlineYear: number;
  recommendedTypeRating: string;
  seniorityDropEstimate: number;
  retirementProbPct: number;
  yearsToTransitionWindow: number;
}

interface PayResult {
  scenarios: Array<{ name: string; year1: number; year2: number; year3: number; year4: number; year5: number; total5yr: number; typeRatingDeducted?: number }>;
  comparison: { deltaVsStay: number; typeRatingCost: number; paybackMonths: number | null; recommendation: string; widebodyPremiumPct: number };
}

interface AuditDoc {
  id: string;
  document_type: string;
  document_name: string;
  verification_status: string;
  ipfs_cid: string | null;
  ipfs_url: string | null;
  audit_pass_active: boolean;
  pinned_at: string;
}

const TIER_COLORS: Record<string, string> = {
  critical: 'text-red-400 bg-red-900/30 border-red-700',
  high:     'text-orange-400 bg-orange-900/30 border-orange-700',
  medium:   'text-yellow-400 bg-yellow-900/30 border-yellow-700',
  low:      'text-green-400 bg-green-900/30 border-green-700',
};

function PaywallCard({ title, icon: Icon, tagline, bullets }: { title: string; icon: any; tagline: string; bullets: string[] }) {
  return (
    <div className="relative rounded-xl border border-slate-700 bg-slate-900/50 p-5 overflow-hidden">
      <div className="absolute inset-0 backdrop-blur-[2px] bg-slate-950/60 z-10 flex flex-col items-center justify-center gap-3">
        <Lock className="w-7 h-7 text-amber-400" />
        <p className="text-sm font-semibold text-white">Recognition+ Required</p>
        <a
          href="/recognition-plus"
          className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
        >
          Upgrade — $99/year
        </a>
      </div>
      <div className="flex items-center gap-2 mb-2 opacity-30">
        <Icon className="w-5 h-5 text-amber-400" />
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <p className="text-xs text-slate-400 mb-3 opacity-30">{tagline}</p>
      <ul className="space-y-1 opacity-30">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-1.5 text-xs text-slate-400">
            <CheckCircle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PremiumFeaturesPanel({
  isPremium,
  pilotId,
  authToken,
  supabaseUrl,
  gapAnalysisResult,
}: PremiumFeaturesPanelProps) {
  const [openPanel, setOpenPanel] = useState<string | null>(null);

  // Seniority risk state
  const [seniorityForm, setSeniorityForm] = useState({ airlineIata: '', aircraftFamily: gapAnalysisResult?.currentAircraftType || '', currentSeniorityRank: '', estimatedFleetSize: '', yearsAtAirline: '' });
  const [seniorityResult, setSeniorityResult] = useState<SeniorityResult | null>(null);
  const [seniorityLoading, setSeniorityLoading] = useState(false);

  // Pay projection state
  const [payForm, setPayForm] = useState({ currentCarrier: 'regional', targetCarrier: 'major', currentAircraft: '', targetAircraft: gapAnalysisResult?.recommendedTransition || '', currentYearsIn: '3', currentRole: 'fo', typeRatingCostUsd: '35000' });
  const [payResult, setPayResult] = useState<PayResult | null>(null);
  const [payLoading, setPayLoading] = useState(false);

  // Audit locker state
  const [auditDocs, setAuditDocs] = useState<AuditDoc[]>([]);
  const [auditLoaded, setAuditLoaded] = useState(false);
  const [auditPinForm, setAuditPinForm] = useState({ documentType: 'logbook', documentName: '', fileHash: '' });
  const [auditPinLoading, setAuditPinLoading] = useState(false);
  const [auditPinResult, setAuditPinResult] = useState<any>(null);

  const callAgent = async (payload: object) => {
    const res = await fetch(`${supabaseUrl}/functions/v1/aviation-data-agent`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ pilotId, ...payload }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
    return json;
  };

  const runSeniorityRisk = async () => {
    setSeniorityLoading(true);
    try {
      const result = await callAgent({ action: 'seniority_risk', ...seniorityForm, currentSeniorityRank: Number(seniorityForm.currentSeniorityRank) || undefined, estimatedFleetSize: Number(seniorityForm.estimatedFleetSize) || undefined, yearsAtAirline: Number(seniorityForm.yearsAtAirline) || undefined });
      setSeniorityResult(result);
    } catch (e: any) { alert(e.message); }
    finally { setSeniorityLoading(false); }
  };

  const runPayProjection = async () => {
    setPayLoading(true);
    try {
      const result = await callAgent({ action: 'pay_projection', ...payForm, currentYearsIn: Number(payForm.currentYearsIn), typeRatingCostUsd: Number(payForm.typeRatingCostUsd) });
      setPayResult(result);
    } catch (e: any) { alert(e.message); }
    finally { setPayLoading(false); }
  };

  const loadAuditLocker = async () => {
    try {
      const result = await callAgent({ action: 'audit_locker', subAction: 'list' });
      setAuditDocs(result.documents || []);
      setAuditLoaded(true);
    } catch (e: any) { alert(e.message); }
  };

  const pinDocument = async () => {
    if (!auditPinForm.documentName || !auditPinForm.fileHash) return;
    setAuditPinLoading(true);
    try {
      const result = await callAgent({ action: 'audit_locker', subAction: 'pin', ...auditPinForm });
      setAuditPinResult(result);
      await loadAuditLocker();
    } catch (e: any) { alert(e.message); }
    finally { setAuditPinLoading(false); }
  };

  const inputCls = "w-full rounded-lg bg-slate-800 border border-slate-600 text-white text-xs px-3 py-2 focus:outline-none focus:border-amber-500";
  const labelCls = "text-xs text-slate-400 mb-1 block";
  const btnCls = "px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50";

  const toggle = (panel: string) => {
    if (!isPremium) return;
    setOpenPanel(prev => prev === panel ? null : panel);
    if (panel === 'audit' && !auditLoaded) loadAuditLocker();
  };

  const featureDefs: Array<{ id: string; icon: React.ElementType; title: string; tagline: string; bullets: string[] }> = [
    {
      id: 'seniority',
      icon: TrendingUp,
      title: 'Seniority Vulnerability Predictor',
      tagline: 'Know before your fleet retires under you.',
      bullets: ['Weibull retirement probability mapped to your seniority number', 'See how many positions you drop if your fleet type is retired', 'Hard deadline year to transition type ratings before seniority collapses'],
    },
    {
      id: 'pay',
      icon: DollarSign,
      title: '5-Year Pay Projection Calculator',
      tagline: 'Stay regional captain vs. junior major FO — the math decides.',
      bullets: ['Side-by-side 5-year earnings comparison', 'Type rating ROI — exact payback month', 'OEM demand multiplier applied to Boeing CMO delivery projections'],
    },
    {
      id: 'audit',
      icon: Shield,
      title: 'Cryptographic Audit Locker',
      tagline: 'One click. Tamper-evident. Airlines skip the paper chase.',
      bullets: ['SHA-256 hash pinned to immutable IPFS CID', 'One-button submit to any airline hiring pool', 'Verified Competency flag shown on your pilot profile'],
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1 h-4 rounded-full bg-amber-500" />
        <h2 className="text-sm font-semibold text-white">Recognition+ Features</h2>
        {!isPremium && (
          <span className="ml-auto text-xs bg-amber-500/20 text-amber-400 border border-amber-600/40 rounded-full px-2 py-0.5">Locked</span>
        )}
      </div>

      {featureDefs.map(({ id, icon: Icon, title, tagline, bullets }) =>
        !isPremium ? (
          <PaywallCard key={id} title={title} icon={Icon} tagline={tagline} bullets={bullets} />
        ) : (
          <div key={id} className="rounded-xl border border-slate-700 bg-slate-900/50 overflow-hidden">
            <button
              onClick={() => toggle(id)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {(Icon as any)({ className: 'w-5 h-5 text-amber-400' })}
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-slate-400">{tagline}</p>
                </div>
              </div>
              {openPanel === id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openPanel === id && (
              <div className="border-t border-slate-700 px-5 py-4 space-y-4">

                {/* ── Seniority Risk ── */}
                {id === 'seniority' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={labelCls}>Airline IATA code</label><input className={inputCls} placeholder="e.g. EK" value={seniorityForm.airlineIata} onChange={e => setSeniorityForm(p => ({ ...p, airlineIata: e.target.value }))} /></div>
                      <div><label className={labelCls}>Aircraft family</label><input className={inputCls} placeholder="e.g. A320" value={seniorityForm.aircraftFamily} onChange={e => setSeniorityForm(p => ({ ...p, aircraftFamily: e.target.value }))} /></div>
                      <div><label className={labelCls}>Your seniority rank #</label><input className={inputCls} type="number" placeholder="e.g. 85" value={seniorityForm.currentSeniorityRank} onChange={e => setSeniorityForm(p => ({ ...p, currentSeniorityRank: e.target.value }))} /></div>
                      <div><label className={labelCls}>Estimated fleet size</label><input className={inputCls} type="number" placeholder="e.g. 40" value={seniorityForm.estimatedFleetSize} onChange={e => setSeniorityForm(p => ({ ...p, estimatedFleetSize: e.target.value }))} /></div>
                    </div>
                    <button className={btnCls} onClick={runSeniorityRisk} disabled={seniorityLoading || !seniorityForm.airlineIata || !seniorityForm.aircraftFamily}>
                      {seniorityLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <TrendingUp className="w-3.5 h-3.5" />}
                      Calculate Risk
                    </button>

                    {seniorityResult && (
                      <div className={`rounded-lg border px-4 py-3 space-y-2 ${TIER_COLORS[seniorityResult.riskTier] || TIER_COLORS.medium}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wide">{seniorityResult.riskTier} RISK</span>
                          <span className="text-xl font-black">{seniorityResult.riskScore}<span className="text-xs font-normal">/100</span></span>
                        </div>
                        <p className="text-xs leading-relaxed">{seniorityResult.actionRequired}</p>
                        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-current/20">
                          <div className="text-center"><div className="text-base font-bold">{seniorityResult.retirementProbPct}%</div><div className="text-xs opacity-70">Retirement prob.</div></div>
                          <div className="text-center"><div className="text-base font-bold">−{seniorityResult.seniorityDropEstimate}</div><div className="text-xs opacity-70">Seniority drop</div></div>
                          <div className="text-center"><div className="text-base font-bold">{seniorityResult.transitionDeadlineYear}</div><div className="text-xs opacity-70">Deadline year</div></div>
                        </div>
                        <p className="text-xs opacity-80">Recommended: <strong>{seniorityResult.recommendedTypeRating}</strong></p>
                      </div>
                    )}
                  </>
                )}

                {/* ── Pay Projection ── */}
                {id === 'pay' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Current carrier tier</label>
                        <select className={inputCls} value={payForm.currentCarrier} onChange={e => setPayForm(p => ({ ...p, currentCarrier: e.target.value }))}>
                          {['regional', 'lowcost', 'major', 'cargo', 'charter'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Target carrier tier</label>
                        <select className={inputCls} value={payForm.targetCarrier} onChange={e => setPayForm(p => ({ ...p, targetCarrier: e.target.value }))}>
                          {['regional', 'lowcost', 'major', 'cargo', 'charter'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                        </select>
                      </div>
                      <div><label className={labelCls}>Current aircraft</label><input className={inputCls} placeholder="e.g. A320" value={payForm.currentAircraft} onChange={e => setPayForm(p => ({ ...p, currentAircraft: e.target.value }))} /></div>
                      <div><label className={labelCls}>Target aircraft</label><input className={inputCls} placeholder="e.g. A321neo" value={payForm.targetAircraft} onChange={e => setPayForm(p => ({ ...p, targetAircraft: e.target.value }))} /></div>
                      <div>
                        <label className={labelCls}>Current role</label>
                        <select className={inputCls} value={payForm.currentRole} onChange={e => setPayForm(p => ({ ...p, currentRole: e.target.value }))}>
                          <option value="fo">First Officer</option>
                          <option value="captain">Captain</option>
                        </select>
                      </div>
                      <div><label className={labelCls}>Years at current carrier</label><input className={inputCls} type="number" value={payForm.currentYearsIn} onChange={e => setPayForm(p => ({ ...p, currentYearsIn: e.target.value }))} /></div>
                      <div className="col-span-2"><label className={labelCls}>Type rating cost (USD)</label><input className={inputCls} type="number" value={payForm.typeRatingCostUsd} onChange={e => setPayForm(p => ({ ...p, typeRatingCostUsd: e.target.value }))} /></div>
                    </div>
                    <button className={btnCls} onClick={runPayProjection} disabled={payLoading}>
                      {payLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <DollarSign className="w-3.5 h-3.5" />}
                      Run Projection
                    </button>

                    {payResult && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          {payResult.scenarios.map((s, i) => (
                            <div key={i} className={`rounded-lg border p-3 ${i === 1 ? 'border-amber-600 bg-amber-900/20' : 'border-slate-700 bg-slate-800/50'}`}>
                              <p className="text-xs font-semibold text-white mb-2 truncate">{s.name}</p>
                              {[1,2,3,4,5].map(yr => (
                                <div key={yr} className="flex justify-between text-xs py-0.5">
                                  <span className="text-slate-400">Year {yr}</span>
                                  <span className="text-white font-mono">${((s as any)[`year${yr}`] || 0).toLocaleString()}</span>
                                </div>
                              ))}
                              <div className="border-t border-current/20 mt-1.5 pt-1.5 flex justify-between">
                                <span className="text-xs font-bold text-slate-300">5-yr total</span>
                                <span className="text-xs font-black text-amber-400">${s.total5yr.toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className={`rounded-lg border p-3 ${payResult.comparison.deltaVsStay >= 0 ? 'border-green-700 bg-green-900/20 text-green-400' : 'border-red-700 bg-red-900/20 text-red-400'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold">Net earnings lift</span>
                            <span className="text-lg font-black">{payResult.comparison.deltaVsStay >= 0 ? '+' : ''}${payResult.comparison.deltaVsStay.toLocaleString()}</span>
                          </div>
                          {payResult.comparison.paybackMonths && <p className="text-xs opacity-80">Type rating ROI payback: <strong>{payResult.comparison.paybackMonths} months</strong></p>}
                          <p className="text-xs mt-1.5 leading-relaxed opacity-90">{payResult.comparison.recommendation}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* ── Audit Locker ── */}
                {id === 'audit' && (
                  <>
                    {auditDocs.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {auditDocs.map(doc => (
                          <div key={doc.id} className="flex items-center justify-between rounded-lg bg-slate-800 border border-slate-700 px-3 py-2">
                            <div>
                              <p className="text-xs font-semibold text-white">{doc.document_name}</p>
                              <p className="text-xs text-slate-400">{doc.document_type} · {doc.verification_status}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {doc.audit_pass_active && <span className="text-xs bg-green-900/40 text-green-400 border border-green-700 rounded-full px-2 py-0.5">Audit Pass Active</span>}
                              {doc.ipfs_url && (
                                <a href={doc.ipfs_url} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3 space-y-3">
                      <p className="text-xs font-semibold text-slate-300">Pin a new document</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Document type</label>
                          <select className={inputCls} value={auditPinForm.documentType} onChange={e => setAuditPinForm(p => ({ ...p, documentType: e.target.value }))}>
                            {['logbook', 'medical', 'license', 'type_rating', 'background_check'].map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                          </select>
                        </div>
                        <div><label className={labelCls}>Document name</label><input className={inputCls} placeholder="e.g. Logbook 2024" value={auditPinForm.documentName} onChange={e => setAuditPinForm(p => ({ ...p, documentName: e.target.value }))} /></div>
                        <div className="col-span-2"><label className={labelCls}>SHA-256 file hash</label><input className={inputCls} placeholder="Paste SHA-256 hash of your document" value={auditPinForm.fileHash} onChange={e => setAuditPinForm(p => ({ ...p, fileHash: e.target.value }))} /></div>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-slate-400">Only the document hash is stored on IPFS — never the file itself. No PII is transmitted.</p>
                      </div>
                      <button className={btnCls} onClick={pinDocument} disabled={auditPinLoading || !auditPinForm.documentName || !auditPinForm.fileHash}>
                        {auditPinLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
                        Pin to IPFS
                      </button>

                      {auditPinResult?.ipfsCid && (
                        <div className="rounded-lg border border-green-700 bg-green-900/20 px-3 py-2 text-xs text-green-400">
                          <p className="font-bold mb-1">Pinned successfully</p>
                          <p className="font-mono break-all">{auditPinResult.ipfsCid}</p>
                          <a href={auditPinResult.ipfsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 mt-1 underline hover:text-green-300">
                            View on IPFS <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
