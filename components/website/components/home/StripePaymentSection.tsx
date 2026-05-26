import React, { useState } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';

interface StripePaymentSectionProps {
  onNavigate: (page: string) => void;
}

const FREE_FEATURES_INCLUDED = [
  'Basic profile',
  '2 pathway submissions/month',
  '3 profile comparisons/month',
  '5 AI chats/month',
  'General pool visibility',
];

const FREE_FEATURES_EXCLUDED = [
  'Priority matching',
  'Exclusive pathways',
  'Verified credentials',
];

const FEATURES_ANNUAL = [
  'Full profile comparison',
  'Unlimited pathway submissions',
  'Priority matching',
  'AI career strategist',
  'EBT CBTA Fast-Track',
  'Exclusive pathways (Private Jet, eVTOL)',
  'Verified flight hours & credentials',
  '50% off Foundation & Transition',
];

const FEATURES_ANNUAL_EXTENDED = [
  'Live real-time profile — not a PDF. When you fly and log hours, your profile updates instantly. Airlines pull your current data, not a snapshot from months ago.',
  'Background screening — verified badge attached to your profile in the pulling system',
  'Recognition Score — scored on recency, hours flown, type rating, completeness & background check status',
  'Recognition+ Verified badge — airlines filter for this first: background checked, preferred tier',
  'Submit pathway interest — your profile enters the airline\'s ranked bulletin with background check attached',
  'Airlines don\'t get random CVs — they pull a scored shortlist of interested pilots. You rank highest.',
  'Airlines filter by: background check status, recency, type rating, hours, score — you appear at the top',
  'Priority position in shortlist — not buried in a general pool',
  'Direct feedback on profile gaps from match engine & score',
  'Recognition AI — extended use, pulls from latest type rating / airline / pathway changes and tells you exactly how to align your profile',
  'Atlas CV — upload & screened documents (licenses, medical, ratings)',
  'Screened documents visible to airlines & operators in the pull',
  'Unlimited profile comparisons (pathway / airline / type rating)',
  'EBT CBTA interview fast-track — priority access after Foundation Program (skip the queue)',
];

export default function StripePaymentSection({ onNavigate }: StripePaymentSectionProps) {
  const { currentUser } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [showAnnualDetails, setShowAnnualDetails] = useState(false);

  const handleCheckout = async (priceId: string) => {
    if (!currentUser) {
      onNavigate('recognition-plus');
      return;
    }
    setProcessing(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId: currentUser.id }),
      });
      if (!response.ok) throw new Error('Failed to create checkout session');
      const { url: checkoutUrl } = await response.json();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="w-full">
      {/* ── Outer wrapper: pricing left + feature details right ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl mb-4">

        {/* LEFT — white pricing card */}
        <div className="bg-white/95 backdrop-blur-sm px-8 py-10 flex flex-col">
          {/* Header */}
          <p className="text-red-600 text-xs font-bold uppercase tracking-[0.2em] mb-2">Pricing</p>
          <h3 className="text-slate-900 text-3xl font-bold mb-3">Choose Your Plan.</h3>
          <p className="text-slate-500 text-sm mb-8 max-w-sm">
            Start with a free trial. Upgrade to Recognition Plus for priority matching and AI-powered career tools.
          </p>

          {/* Two plan cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {/* Free card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col">
              <h4 className="text-slate-700 text-lg font-bold text-center mb-3">Free</h4>
              <p className="text-slate-900 text-4xl font-bold text-center mb-0.5">
                $0<span className="text-lg font-normal text-slate-500">/year</span>
              </p>
              <p className="text-slate-500 text-sm text-center mb-1">Basic access</p>
              <p className="text-slate-400 text-xs text-center font-semibold mb-5">Get started today</p>
              <ul className="space-y-2 mb-6 flex-1">
                {FREE_FEATURES_INCLUDED.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-slate-400 font-bold flex-shrink-0 mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
                {FREE_FEATURES_EXCLUDED.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-400">
                    <span className="font-bold flex-shrink-0 mt-0.5">—</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => { onNavigate('become-member'); window.scrollTo(0, 0); }}
                className="w-full py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors"
              >
                Get Started Free
              </button>
            </div>

            {/* Recognition+ Verified card */}
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 flex flex-col relative shadow-xl">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1 rounded-full shadow">
                Best Value
              </div>
              <h4 className="text-white text-lg font-bold text-center mt-2 mb-3">Recognition+ Verified</h4>
              <p className="text-white text-4xl font-bold text-center mb-0.5">
                $100<span className="text-lg font-normal text-red-200">/year</span>
              </p>
              <p className="text-red-200 text-sm text-center mb-1">Annual membership</p>
              <p className="text-red-300 text-xs text-center font-semibold mb-5">✓ 3-day free trial</p>
              <ul className="space-y-2 mb-6 flex-1">
                {FEATURES_ANNUAL.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white">
                    <span className="text-red-200 font-bold flex-shrink-0 mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onNavigate('recognition-plus')}
                disabled={processing}
                className="w-full py-3 rounded-full bg-white hover:bg-red-50 text-red-700 font-bold text-sm transition-colors disabled:opacity-50"
              >
                {processing ? 'Processing…' : 'Get Annual Plan'}
              </button>
            </div>
          </div>

          <p className="text-slate-400 text-xs text-center mt-5">Cancel anytime. No hidden fees. Free trial included.</p>
        </div>

        {/* RIGHT — dark feature details panel */}
        <div className="bg-slate-900/95 backdrop-blur-sm px-8 py-10 flex flex-col">
          <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-semibold mb-1">Full Feature Details</p>
          <h4 className="text-white text-xl font-bold mb-6">Everything that's included</h4>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-white font-bold text-base">Recognition+ Verified</span>
            <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-semibold">$100/yr</span>
          </div>
          <ul className="space-y-2.5 mb-4 flex-1">
            {(showAnnualDetails ? FEATURES_ANNUAL_EXTENDED : FEATURES_ANNUAL_EXTENDED.slice(0, 6)).map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-red-400 mt-0.5 flex-shrink-0">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setShowAnnualDetails(v => !v)}
            className="text-red-400 hover:text-red-300 text-xs font-semibold transition-colors mb-6"
          >
            {showAnnualDetails ? '↑ Show less' : `+ ${FEATURES_ANNUAL_EXTENDED.length - 6} more features`}
          </button>

          {/* Enterprise link inside the right panel */}
          <div className="mt-auto pt-4 border-t border-white/10">
            <p className="text-slate-400 text-xs mb-1">Are you an airline, operator, or training organization?</p>
            <button
              onClick={() => window.location.href = 'https://enterprise.pilotrecognition.com'}
              className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors"
            >
              Click here for enterprise access →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
