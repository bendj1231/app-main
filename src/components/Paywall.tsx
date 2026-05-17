import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAccountTier } from '../hooks/useAccountTier';

interface PaywallProps {
  requiredTier: 'recognition_plus' | 'enterprise' | 'enterprise_admin';
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const Paywall: React.FC<PaywallProps> = ({
  requiredTier,
  title,
  description,
  children,
}) => {
  const { currentUser } = useAuth();
  const { tier, loading, isEnterprise, isRecognitionPlus } = useAccountTier(currentUser?.id);
  const [showPaywall, setShowPaywall] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Check access
  const hasAccess = requiredTier === 'enterprise'
    ? isEnterprise
    : requiredTier === 'recognition_plus'
    ? isRecognitionPlus
    : tier === requiredTier;

  if (hasAccess) {
    return <>{children}</>;
  }

  // Paywall screen
  const isRecognitionPaywall = requiredTier === 'recognition_plus';
  const isEnterprisePaywall = requiredTier === 'enterprise' || requiredTier === 'enterprise_admin';

  return (
    <div className="relative">
      {/* Blurred preview of content */}
      <div className="blur-sm opacity-30 pointer-events-none select-none">
        {children}
      </div>

      {/* Paywall overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="max-w-md w-full mx-4 bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center">
          {/* Lock icon */}
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {title || (isEnterprisePaywall ? 'Enterprise Access Required' : 'Recognition+ Required')}
          </h3>
          <p className="text-slate-500 text-sm mb-6">
            {description ||
              (isEnterprisePaywall
                ? 'This feature is only available to Enterprise subscribers. Unlock the Pull API, advanced filtering, and unlimited profile access.'
                : 'Upgrade to Recognition+ to unlock full profile comparison, unlimited pathways, and priority matching.')}
          </p>

          {isEnterprisePaywall ? (
            <div className="space-y-3">
              <div className="bg-slate-50 rounded-xl p-4 text-left">
                <p className="text-sm font-semibold text-slate-900 mb-1">Enterprise Access Includes:</p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Pull API — live pilot database access</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Advanced filtering & scoring</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> EBT video scoring access</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Unlimited profile pulls</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Priority pathway posting</li>
                </ul>
              </div>
              <button
                onClick={() => setShowPaywall(true)}
                className="w-full py-3.5 rounded-xl bg-red-600 text-white font-bold text-sm uppercase tracking-wider hover:bg-red-700 transition-all"
              >
                Unlock Enterprise — $1,000/mo
              </button>
              <button
                onClick={() => setShowPaywall(true)}
                className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all"
              >
                Or $10,000/year (2 months free)
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-xl p-4 text-left">
                <p className="text-sm font-semibold text-slate-900 mb-1">Recognition+ Includes:</p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li className="flex items-center gap-2"><span className="text-blue-500">✓</span> Full profile comparison</li>
                  <li className="flex items-center gap-2"><span className="text-blue-500">✓</span> Unlimited pathway views</li>
                  <li className="flex items-center gap-2"><span className="text-blue-500">✓</span> Priority matching</li>
                  <li className="flex items-center gap-2"><span className="text-blue-500">✓</span> Recognition Score badge</li>
                  <li className="flex items-center gap-2"><span className="text-blue-500">✓</span> 25% off Programs</li>
                </ul>
              </div>
              <button
                onClick={() => setShowPaywall(true)}
                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm uppercase tracking-wider hover:bg-blue-500 transition-all"
              >
                Upgrade to Recognition+ — $100/yr
              </button>
            </div>
          )}

          <p className="text-[10px] text-slate-400 mt-4">
            Billed by Stripe, Inc. — Instant access after payment.
          </p>
        </div>
      </div>

      {/* Upgrade modal (simplified — redirects to billing) */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-w-lg w-full mx-4 bg-white rounded-2xl shadow-2xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Choose Your Plan</h3>

            {isEnterprisePaywall ? (
              <div className="space-y-3 mb-6">
                <a
                  href="/enterprise/invoice"
                  className="block w-full py-3 rounded-xl bg-red-600 text-white font-bold text-sm text-center hover:bg-red-700 transition-all"
                >
                  Enterprise Monthly — $1,000/mo
                </a>
                <a
                  href="/enterprise/invoice"
                  className="block w-full py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm text-center hover:bg-slate-50 transition-all"
                >
                  Enterprise Annual — $10,000/yr
                </a>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                <a
                  href="/recognition-plus"
                  className="block w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm text-center hover:bg-blue-500 transition-all"
                >
                  Recognition+ — $100/yr
                </a>
              </div>
            )}

            <button
              onClick={() => setShowPaywall(false)}
              className="w-full py-2.5 rounded-xl text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
