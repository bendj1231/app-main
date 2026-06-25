import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, CheckCircle, AlertTriangle, Users, ArrowRight,
  CreditCard, RefreshCw, Clock
} from 'lucide-react';
import { useEnterprisePortal } from './hooks/useEnterprisePortal';

interface ReferralPartner {
  id: string;
  name: string;
  email: string;
  partner_type: string;
  referral_code: string;
  total_referrals: number;
  total_payouts: number;
  pending_payouts: number;
  commission_rate: number;
}

interface ReferralConversion {
  id: string;
  pilot_email: string;
  pilot_name: string;
  commission_amount: number;
  commission_status: string;
  subscribed_at: string;
}

export function ReferralPayoutAdmin() {
  const { callApi } = useEnterprisePortal();
  const [partners, setPartners] = useState<ReferralPartner[]>([]);
  const [conversions, setConversions] = useState<Record<string, ReferralConversion[]>>({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const p = await callApi('getReferralPartners') as ReferralPartner[];
      setPartners(p);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handlePayout = async (partnerId: string) => {
    setProcessing(partnerId);
    try {
      const res = await callApi('triggerReferralPayout', { partner_id: partnerId }) as { success: boolean; amount: number; payout_id: string };
      if (res.success) {
        setMessage(`Payout of $${(res.amount / 100).toFixed(2)} sent`);
        setTimeout(() => setMessage(null), 3000);
        load();
      }
    } catch (e: any) {
      setMessage(e?.message || 'Payout failed');
    } finally { setProcessing(null); }
  };

  const loadConversions = async (partnerId: string) => {
    if (conversions[partnerId]) return;
    try {
      const res = await callApi('getReferralConversions', { partner_id: partnerId }) as ReferralConversion[];
      setConversions(prev => ({ ...prev, [partnerId]: res }));
    } catch (e) { console.error(e); }
  };

  const totalPending = partners.reduce((sum, p) => sum + (p.pending_payouts || 0), 0);
  const totalPaid = partners.reduce((sum, p) => sum + (p.total_payouts || 0), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-emerald-400" />
          Referral Payout Automation
        </h1>
        <p className="text-slate-400 text-sm mt-1">$20 auto-payout on every Recognition+ subscription. Trigger manual payouts here.</p>
      </div>

      {message && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`px-4 py-3 rounded-xl flex items-center gap-2 text-sm ${message.includes('sent') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {message.includes('sent') ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {message}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5">
          <DollarSign className="w-5 h-5 text-emerald-400 mb-2" />
          <div className="text-2xl font-bold text-white">${(totalPending / 100).toFixed(2)}</div>
          <div className="text-slate-500 text-xs">Total Pending Payouts</div>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5">
          <CreditCard className="w-5 h-5 text-blue-400 mb-2" />
          <div className="text-2xl font-bold text-white">${(totalPaid / 100).toFixed(2)}</div>
          <div className="text-slate-500 text-xs">Total Paid Out</div>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5">
          <Users className="w-5 h-5 text-purple-400 mb-2" />
          <div className="text-2xl font-bold text-white">{partners.length}</div>
          <div className="text-slate-500 text-xs">Active Partners</div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-slate-800 rounded-xl animate-pulse" />)}</div>
      ) : partners.length === 0 ? (
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-8 text-center">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-white font-bold mb-2">No Partners Yet</h3>
          <p className="text-slate-400 text-sm">Referral partners appear here when pilots generate referral codes.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {partners.map(p => {
            const convs = conversions[p.id] || [];
            return (
              <div key={p.id} className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600/15 rounded-xl flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">{p.name}</div>
                      <div className="text-slate-500 text-xs">{p.email || 'No email'} · {p.partner_type} · {p.referral_code}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-white font-bold text-sm">{p.total_referrals}</div>
                      <div className="text-slate-500 text-[10px]">Referrals</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-bold text-sm">${(p.pending_payouts / 100).toFixed(2)}</div>
                      <div className="text-slate-500 text-[10px]">Pending</div>
                    </div>
                    {p.pending_payouts > 0 ? (
                      <button onClick={() => handlePayout(p.id)} disabled={!!processing}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition">
                        {processing === p.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <DollarSign className="w-3.5 h-3.5" />}
                        {processing === p.id ? 'Processing...' : `Pay $${(p.pending_payouts / 100).toFixed(2)}`}
                      </button>
                    ) : (
                      <span className="text-slate-600 text-xs font-bold px-4 py-2.5">Paid Up</span>
                    )}
                  </div>
                </div>

                {convs.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-700/40 space-y-2">
                    {convs.slice(0, 3).map(c => (
                      <div key={c.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-slate-400">
                          <ArrowRight className="w-3 h-3 text-slate-600" />
                          {c.pilot_name || c.pilot_email}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold">${(c.commission_amount / 100).toFixed(2)}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            c.commission_status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {c.commission_status}
                          </span>
                          <span className="text-slate-600">{c.subscribed_at ? new Date(c.subscribed_at).toLocaleDateString() : ''}</span>
                        </div>
                      </div>
                    ))}
                    {convs.length > 3 && (
                      <div className="text-slate-600 text-[10px] text-center">+{convs.length - 3} more conversions</div>
                    )}
                  </div>
                )}

                {!conversions[p.id] && p.total_referrals > 0 && (
                  <button onClick={() => loadConversions(p.id)}
                    className="mt-3 text-blue-400 hover:text-blue-300 text-xs font-medium transition">
                    View {p.total_referrals} conversion{p.total_referrals !== 1 ? 's' : ''}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ReferralPayoutAdmin;
