import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Crown, Calendar, DollarSign, RefreshCw, AlertTriangle,
  CheckCircle, XCircle, Zap, ArrowRight, ShieldCheck
} from 'lucide-react';
import { useEnterprisePortal } from './hooks/useEnterprisePortal';

interface Subscription {
  id: string;
  tier: string;
  status: string;
  billing_cycle: string;
  amount_cents: number;
  currency: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: number;
  renewal_count: number;
  payment_provider?: string;
  created_at: string;
}

export function SubscriptionManagement() {
  const { account, callApi } = useEnterprisePortal();
  const [sub, setSub] = useState<Subscription | null>(null);
  const [history, setHistory] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    if (!account?.id) return;
    try {
      setLoading(true);
      const active = await callApi('getSubscription', { subscriber_type: 'enterprise', subscriber_id: account.id }) as Subscription | null;
      setSub(active);
      // todo: get full history via another endpoint if needed
      setHistory(active ? [active] : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [account?.id]);

  const handleRenew = async () => {
    if (!sub?.id) return;
    setActionLoading(true);
    try {
      const res = await callApi('renewSubscription', { id: sub.id }) as Subscription;
      setSub(res);
      setMessage('Subscription renewed successfully');
      setTimeout(() => setMessage(null), 3000);
    } catch (e: any) {
      setMessage(e?.message || 'Renewal failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!sub?.id) return;
    setActionLoading(true);
    try {
      await callApi('cancelSubscription', { id: sub.id });
      setSub(null);
      setMessage('Subscription cancelled');
      setTimeout(() => setMessage(null), 3000);
      load();
    } catch (e: any) {
      setMessage(e?.message || 'Cancel failed');
    } finally {
      setActionLoading(false);
    }
  };

  const daysLeft = sub?.current_period_end
    ? Math.ceil((new Date(sub.current_period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  const tierColor: Record<string, string> = {
    free: 'text-slate-400',
    basic: 'text-blue-400',
    pro: 'text-emerald-400',
    enterprise: 'text-purple-400',
    recognitionplus: 'text-amber-400',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Crown className="w-6 h-6 text-amber-400" />
          Subscription
        </h1>
        <p className="text-slate-400 text-sm mt-1">Manage your enterprise plan, renewals, and billing cycle.</p>
      </div>

      {message && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`px-4 py-3 rounded-xl flex items-center gap-2 text-sm ${message.includes('success') || message.includes('renewed') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {message.includes('success') || message.includes('renewed') ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {message}
        </motion.div>
      )}

      {loading ? (
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-8 animate-pulse">
          <div className="h-6 w-40 bg-slate-700 rounded mb-4" />
          <div className="h-4 w-24 bg-slate-700 rounded" />
        </div>
      ) : sub ? (
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className={`text-3xl font-bold capitalize ${tierColor[sub.tier] || tierColor.free}`}>
                {sub.tier} Plan
              </div>
              <div className="flex items-center gap-2 mt-2">
                {sub.status === 'active' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                {sub.status === 'expired' && <XCircle className="w-4 h-4 text-red-400" />}
                {sub.status === 'cancelled' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                <span className="text-slate-300 text-sm capitalize">{sub.status}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white text-2xl font-bold">${(sub.amount_cents / 100).toFixed(2)}</div>
              <div className="text-slate-400 text-xs">/ {sub.billing_cycle}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
              <Calendar className="w-4 h-4 text-slate-500 mb-2" />
              <div className="text-white text-sm font-bold">{new Date(sub.current_period_end).toLocaleDateString()}</div>
              <div className="text-slate-500 text-xs">Expires</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
              <DollarSign className="w-4 h-4 text-slate-500 mb-2" />
              <div className="text-white text-sm font-bold">{sub.currency}</div>
              <div className="text-slate-500 text-xs">Currency</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
              <RefreshCw className="w-4 h-4 text-slate-500 mb-2" />
              <div className="text-white text-sm font-bold">{sub.renewal_count}</div>
              <div className="text-slate-500 text-xs">Renewals</div>
            </div>
            <div className={`rounded-xl p-4 border ${daysLeft <= 7 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-slate-900/50 border-slate-700/50'}`}>
              <Zap className={`w-4 h-4 mb-2 ${daysLeft <= 7 ? 'text-amber-400' : 'text-slate-500'}`} />
              <div className={`text-sm font-bold ${daysLeft <= 7 ? 'text-amber-400' : 'text-white'}`}>{daysLeft}d</div>
              <div className="text-slate-500 text-xs">Left</div>
            </div>
          </div>

          {sub.status === 'active' && (
            <div className="flex gap-3">
              <button onClick={handleRenew} disabled={actionLoading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition">
                <RefreshCw className="w-5 h-5" />
                {actionLoading ? 'Processing...' : 'Renew Now'}
              </button>
              <button onClick={handleCancel} disabled={actionLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition">
                <XCircle className="w-5 h-5" />
                Cancel
              </button>
            </div>
          )}

          {sub.status === 'expired' && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-amber-300 text-sm font-medium">Subscription Expired</p>
                <p className="text-amber-400/70 text-xs">Your plan has expired. Renew to restore full access.</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-8 text-center">
          <Crown className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-white font-bold mb-2">No Active Subscription</h3>
          <p className="text-slate-400 text-sm mb-4">You're on the free tier. Upgrade to unlock more features.</p>
          <button onClick={() => alert('Upgrade flow coming soon')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto">
            Upgrade Plan <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default SubscriptionManagement;
