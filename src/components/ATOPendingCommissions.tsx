import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Commission {
  id: string;
  amount: number;
  held_at: string;
  expires_at: string;
  pilot_id: string;
  status: string;
}

interface AtoPendingCommissionsProps {
  atoId: string;
}

export const ATOPendingCommissions: React.FC<AtoPendingCommissionsProps> = ({ atoId }) => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [releasing, setReleasing] = useState(false);
  const [released, setReleased] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{hours: number; minutes: number; seconds: number} | null>(null);

  useEffect(() => {
    loadCommissions();
  }, [atoId]);

  // Countdown timer for expiry
  useEffect(() => {
    if (commissions.length === 0) return;

    const interval = setInterval(() => {
      const earliest = commissions.reduce((earliest, c) => {
        const d = new Date(c.expires_at);
        return d < earliest ? d : earliest;
      }, new Date(commissions[0].expires_at));

      const now = new Date();
      const diff = earliest.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      } else {
        setTimeLeft({
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [commissions]);

  async function loadCommissions() {
    try {
      const { data, error } = await supabase
        .from('held_commissions')
        .select('*')
        .eq('ato_enterprise_account_id', atoId)
        .eq('status', 'held')
        .order('expires_at', { ascending: true });

      if (error) throw error;

      setCommissions(data || []);
      setTotal((data || []).reduce((sum, c) => sum + (c.amount || 0), 0));
    } catch (err) {
      console.error('Failed to load commissions:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRelease() {
    setReleasing(true);
    try {
      const response = await fetch('/api/release-ato-commissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ atoId }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to release');

      setReleased(true);
      setCommissions([]);
      setTotal(0);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setReleasing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (released) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-green-600 text-xl">✓</span>
        </div>
        <h3 className="text-lg font-bold text-green-800 mb-2">Commissions Released!</h3>
        <p className="text-green-700 text-sm">
          Your held commissions have been released and will arrive in your wallet within 24 hours.
        </p>
      </div>
    );
  }

  if (commissions.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
        <p className="text-slate-500 text-sm">No pending commissions.</p>
        <p className="text-slate-400 text-xs mt-1">
          Commissions appear here when pilots from your school request verification checks.
        </p>
      </div>
    );
  }

  const isUrgent = timeLeft && timeLeft.hours < 6;
  const isExpired = timeLeft && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden border ${isUrgent ? 'border-red-300' : 'border-amber-200'}`}>
      {/* Header with countdown */}
      <div className={`px-6 py-4 border-b ${isUrgent ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-bold ${isUrgent ? 'text-red-900' : 'text-amber-900'}`}>
              {isExpired ? '⏰ Commissions Expired' : isUrgent ? '⏰ EXPIRES SOON' : 'Pending Commissions'}
            </h3>
            <p className={`text-sm ${isUrgent ? 'text-red-700' : 'text-amber-700'}`}>
              {commissions.length} verification{commissions.length > 1 ? 's' : ''} from your pilots
            </p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${isUrgent ? 'text-red-900' : 'text-amber-900'}`}>${total.toFixed(2}</p>
            <p className="text-xs text-slate-500">USDC held in escrow</p>
          </div>
        </div>

        {/* Countdown timer */}
        {timeLeft && !isExpired && (
          <div className={`mt-3 p-2 rounded-lg text-center ${isUrgent ? 'bg-red-100' : 'bg-white/50'}`}>
            <p className={`text-xs font-semibold ${isUrgent ? 'text-red-800' : 'text-amber-800'}`}>
              Expires in: {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </p>
            {isUrgent && (
              <p className="text-xs text-red-600 mt-1 font-bold">
                ⚠️ Subscribe before expiry or forfeit this money
              </p>
            )}
          </div>
        )}

        {isExpired && (
          <div className="mt-3 p-2 rounded-lg bg-slate-100 text-center">
            <p className="text-xs text-slate-600">
              These commissions have expired and rebounded to the platform.
              Subscribe to Enterprise to receive instant payouts on future checks.
            </p>
          </div>
        )}
      </div>

      {/* Commission list */}
      <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
        {commissions.map((commission) => {
          const commissionExpired = new Date(commission.expires_at) < new Date();
          return (
            <div key={commission.id} className={`px-6 py-3 flex items-center justify-between ${commissionExpired ? 'opacity-50' : 'hover:bg-slate-50'}`}>
              <div>
                <p className="text-sm font-semibold text-slate-700">Verification Check</p>
                <p className="text-xs text-slate-400">
                  Held {new Date(commission.held_at).toLocaleDateString()}
                  {commissionExpired ? ' — EXPIRED' : ` — Expires ${new Date(commission.expires_at).toLocaleTimeString(}`}
                </p>
              </div>
              <span className={`text-sm font-bold ${commissionExpired ? 'text-slate-400 line-through' : 'text-amber-700'}`}>
                +${commission.amount.toFixed(2}
              </span>
            </div>
          );
        })}
      </div>

      {/* Release button */}
      {!isExpired && (
        <div className={`px-6 py-4 border-t ${isUrgent ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
          <button
            onClick={handleRelease}
            disabled={releasing}
            className={`w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-50 ${
              isUrgent 
                ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {releasing ? 'Releasing...' : isUrgent ? `CLAIM $${total.toFixed(2} NOW — EXPIRES SOON` : `Release $${total.toFixed(2} USDC to My Wallet`}
          </button>
          <p className="text-xs text-slate-400 text-center mt-2">
            {isUrgent 
              ? '⏰ Subscribe to Enterprise before expiry or lose this money permanently'
              : 'Funds will be transferred to your registered wallet within 24 hours.'
            }
          </p>
        </div>
      )}

      {isExpired && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500">
            These commissions have expired. 
            <a href="/enterprise" className="text-red-600 font-semibold hover:underline ml-1">
              Subscribe to Enterprise
            </a> 
            to receive instant payouts on all future verification checks.
          </p>
        </div>
      )}
    </div>
  );
};
