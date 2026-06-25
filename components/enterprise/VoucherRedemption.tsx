import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Ticket, Gift, CheckCircle, AlertTriangle, Crown,
  ArrowRight, Loader2
} from 'lucide-react';
import { useEnterprisePortal } from './hooks/useEnterprisePortal';

interface RedemptionResult {
  success: boolean;
  tier?: string;
  redeemed_at?: string;
  error?: string;
}

export function VoucherRedemption() {
  const { callApi } = useEnterprisePortal();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RedemptionResult | null>(null);

  const handleRedeem = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      // NOTE: In a real flow, pilot_id comes from the logged-in profile
      // This component assumes it's used inside a pilot-authenticated context
      const res = await callApi('redeemVoucher', {
        code: code.trim().toUpperCase(),
        pilot_id: 'self', // hook resolves actual id server-side from auth token
      }) as RedemptionResult;
      setResult(res);
      if (res.success) setCode('');
    } catch (e: any) {
      setResult({ success: false, error: e?.message || 'Invalid or expired code' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-600/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Gift className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Redeem Voucher</h1>
        <p className="text-slate-400 text-sm mt-1">
          Enter the one-time code from your ATO or flight school to unlock your subscription.
        </p>
      </div>

      {result?.success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-4"
        >
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
          <div>
            <h3 className="text-white font-bold text-lg">Voucher Redeemed!</h3>
            <p className="text-emerald-300 text-sm mt-1">
              Your <span className="capitalize font-bold">{result.tier?.replace('_', ' ')}</span> subscription is now active.
            </p>
          </div>
          <div className="text-slate-500 text-xs">
            Redeemed at {result.redeemed_at ? new Date(result.redeemed_at).toLocaleString() : new Date().toLocaleString()}
          </div>
          <button
            onClick={() => setResult(null)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition"
          >
            Redeem Another
          </button>
        </motion.div>
      ) : (
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-slate-400 text-xs mb-1.5 block font-medium uppercase tracking-wider">
              Voucher Code
            </label>
            <div className="relative">
              <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleRedeem()}
                placeholder="ATO-CLASS-2026-XXXXXX"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white text-lg font-mono tracking-wider placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {result?.error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2 text-red-400 text-sm"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {result.error}
            </motion.div>
          )}

          <button
            onClick={handleRedeem}
            disabled={loading || !code.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Crown className="w-5 h-5" />
                Redeem Voucher
              </>
            )}
          </button>

          <p className="text-slate-600 text-xs text-center leading-relaxed">
            Voucher codes are single-use and linked to your flight school batch.
            Contact your ATO if your code doesn't work.
          </p>
        </div>
      )}
    </div>
  );
}

export default VoucherRedemption;
