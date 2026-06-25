import React, { useEffect, useState } from 'react';
import { Crown, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { useEnterprisePortal } from './hooks/useEnterprisePortal';

interface Subscription {
  id: string;
  tier: string;
  status: string;
  current_period_end: string;
  billing_cycle: string;
  renewal_count: number;
  cancel_at_period_end: number;
}

const tierColor: Record<string, string> = {
  free: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  basic: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  pro: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  enterprise: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  recognitionplus: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

export function SubscriptionBadge() {
  const { account, callApi } = useEnterprisePortal();
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!account?.id) { setLoading(false); return; }
    callApi('getSubscription', { subscriber_type: 'enterprise', subscriber_id: account.id })
      .then((res: any) => { if (res) setSub(res); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [account?.id, callApi]);

  const tier = (sub?.tier || account?.subscription_tier || 'free').toLowerCase();
  const status = sub?.status || account?.subscription_status || 'free';
  const expiresAt = sub?.current_period_end ? new Date(sub.current_period_end) : null;
  const daysLeft = expiresAt ? Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  const colorClass = tierColor[tier] || tierColor.free;

  if (loading) return <div className="h-8 w-24 bg-slate-800 rounded-lg animate-pulse" />;

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${colorClass} w-fit`}>
      <Crown className="w-4 h-4 shrink-0" />
      <div className="min-w-0">
        <div className="text-sm font-bold capitalize">{tier}</div>
        {status === 'expired' ? (
          <div className="flex items-center gap-1 text-[10px]">
            <AlertTriangle className="w-3 h-3" /> Expired
          </div>
        ) : status === 'cancelled' ? (
          <div className="flex items-center gap-1 text-[10px]">
            <AlertTriangle className="w-3 h-3" /> Cancelled
          </div>
        ) : expiresAt ? (
          <div className="flex items-center gap-1 text-[10px]">
            <Clock className="w-3 h-3" />
            {daysLeft <= 7 ? `${daysLeft}d left` : `${Math.floor(daysLeft / 30)}mo left`}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[10px]">
            <CheckCircle className="w-3 h-3" /> Active
          </div>
        )}
      </div>
    </div>
  );
}

export default SubscriptionBadge;
