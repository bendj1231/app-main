import React, { useEffect, useState } from 'react';
import { Coins } from 'lucide-react';
import { useEnterprisePortal } from './hooks/useEnterprisePortal';

export function CreditBalancePill() {
  const { account, callApi } = useEnterprisePortal();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!account?.id) return;
    callApi('getCredits', { enterprise_id: account.id })
      .then((res: any) => setBalance(res.balance || 0))
      .catch(() => setBalance(0));
  }, [account?.id, callApi]);

  const displayBalance = balance === null ? '—' : `$${(balance / 100).toFixed(2)}`;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
      <Coins className="w-4 h-4 text-amber-400 shrink-0" />
      <div className="min-w-0">
        <div className="text-amber-300 text-sm font-bold truncate">{displayBalance}</div>
        <div className="text-amber-500/70 text-[10px] uppercase tracking-wider font-medium">Credits</div>
      </div>
    </div>
  );
}
