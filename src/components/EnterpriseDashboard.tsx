import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAccountTier } from '../hooks/useAccountTier';
import { Paywall } from './Paywall';
import { HelioPaywall } from './HelioPaywall';

// Example enterprise dashboard page
export const EnterpriseDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { tier, isEnterprise, loading } = useAccountTier(currentUser?.id);
  const [showHelio, setShowHelio] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If enterprise, show full dashboard
  if (isEnterprise) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Enterprise Dashboard</h1>
            <p className="text-sm text-green-600 font-semibold">● Active — Unlimited Access</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Tier</p>
            <p className="text-lg font-bold text-red-600 capitalize">{tier.replace('_', ' ')}</p>
          </div>
        </div>

        {/* Pull API Panel */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-2">Pull API</h3>
            <p className="text-sm text-slate-500 mb-4">Live pilot database access</p>
            <button className="w-full py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700">
              Open API Console
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-2">Advanced Filtering</h3>
            <p className="text-sm text-slate-500 mb-4">Score, recency, type rating filters</p>
            <button className="w-full py-2 rounded-lg bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700">
              Build Filter
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-2">EBT Video Scoring</h3>
            <p className="text-sm text-slate-500 mb-4">View candidate interview recordings</p>
            <button className="w-full py-2 rounded-lg bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700">
              View Library
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-4">Usage This Month</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">2,340</p>
              <p className="text-xs text-slate-500">Profile Pulls</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">156</p>
              <p className="text-xs text-slate-500">Shortlists Created</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">12</p>
              <p className="text-xs text-slate-500">Pathways Posted</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">3</p>
              <p className="text-xs text-slate-500">Hires Confirmed</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If showing Helio paywall option
  if (showHelio) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <button
          onClick={() => setShowHelio(false)}
          className="text-sm text-slate-500 hover:text-slate-700 mb-4 flex items-center gap-1"
        >
          ← Back to options
        </button>
        <HelioPaywall
          amount={1000}
          recipientWallet="YOUR_USDC_WALLET_ADDRESS"
          paymentType="enterprise_monthly"
          userId={currentUser?.id}
          userEmail={currentUser?.email}
          onSuccess={(paymentId) => {
// [AUDIT] Removed console.log // line 106
            window.location.reload();
          }}
          onError={(error) => {
            console.error('Payment error:', error);
          }}
        />
      </div>
    );
  }

  // Free user — show paywall with both options
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Paywall
        requiredTier="enterprise"
        title="Enterprise Dashboard"
        description="Access the Pull API, advanced filtering, and EBT video scoring."
      >
        <div>{/* This content is blurred behind paywall */}</div>
      </Paywall>

      {/* Alternative: Helio crypto option */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500 mb-3">Or pay with crypto for instant activation</p>
        <button
          onClick={() => setShowHelio(true)}
          className="px-6 py-2.5 rounded-xl border border-purple-300 bg-purple-50 text-purple-700 font-semibold text-sm hover:bg-purple-100 transition-all"
        >
          Pay with USDC (Crypto)
        </button>
      </div>
    </div>
  );
};
