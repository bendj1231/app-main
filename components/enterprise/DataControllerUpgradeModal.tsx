'use client';
import React, { useState } from 'react';
import { Shield, Lock, Eye, Zap, X, CheckCircle, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  enterpriseAccountId: string;
  currentTier?: string;
  airlineName?: string;
}

export function DataControllerUpgradeModal({
  isOpen,
  onClose,
  enterpriseAccountId,
  currentTier = 'free',
  airlineName = 'Your Airline',
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/functions/v1/enterprise-upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enterpriseAccountId,
          tier: 'data_controller',
          successUrl: `${window.location.origin}/enterprise/upgrade/success`,
          cancelUrl: `${window.location.origin}/enterprise/upgrade/cancel`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full shadow-2xl relative overflow-hidden">

        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        {/* Header gradient */}
        <div className="bg-gradient-to-r from-blue-600/20 via-violet-600/10 to-transparent p-6 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Upgrade Required</span>
          </div>
          <h2 className="text-xl font-bold text-white">Unlock the Full Pulling System</h2>
          <p className="text-slate-400 text-sm mt-1">
            {airlineName} is currently on the <span className="text-slate-300 font-semibold capitalize">{currentTier}</span> tier.
            Upgrade to Data Controller to access verified pilot profiles and direct contact.
          </p>
        </div>

        <div className="p-6 pt-2 space-y-5">

          {/* What you see now vs what you get */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-500 text-xs font-semibold uppercase">Free Tier</span>
              </div>
              <ul className="space-y-1.5">
                {[
                  'Post pathway cards',
                  'Blurred aggregate demand',
                  'Basic supply forecast',
                ].map(f => (
                  <li key={f} className="text-slate-500 text-xs flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-slate-600" />{f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-blue-400 text-xs font-semibold uppercase">Data Controller</span>
              </div>
              <ul className="space-y-1.5">
                {[
                  'Unblurred pilot profiles',
                  'Direct contact unlock',
                  'Verified hours & scores',
                  'Real-time credential alerts',
                  'Export candidate lists',
                ].map(f => (
                  <li key={f} className="text-slate-300 text-xs flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-emerald-600/10 to-blue-600/10 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-slate-400 text-xs">Data Controller Tier</div>
                <div className="text-white text-2xl font-bold">$1,000<span className="text-base font-normal text-slate-400">/year</span></div>
                <div className="text-emerald-400 text-xs mt-0.5">Billed annually · Cancel anytime</div>
              </div>
              <div className="text-right">
                <div className="text-slate-500 text-xs">Per verified connection</div>
                <div className="text-white text-lg font-bold">$500<span className="text-sm font-normal text-slate-400"> fee</span></div>
                <div className="text-slate-500 text-[10px]">Only if both parties agree to discharge</div>
              </div>
            </div>
          </div>

          {/* Compliance note */}
          <div className="flex items-start gap-2 bg-slate-800/30 rounded-lg p-2.5 border border-slate-700/30">
            <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-slate-500 text-[10px] leading-relaxed">
              Under the Mauritius Data Protection Act, this fee legally covers your Data Controller infrastructure for consent-based pilot data access. You only pay to contact pilots who explicitly submitted interest.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2.5 text-red-400 text-xs">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 text-emerald-400 text-xs">
              Redirecting to Stripe checkout...
            </div>
          )}

          {/* CTA */}
          <div className="flex gap-3">
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-semibold text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Upgrade to Data Controller
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-3 text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              Stay on Free
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
