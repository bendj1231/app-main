import React, { useState } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';

interface StripePaymentSectionProps {
  onNavigate: (page: string) => void;
}

const FEATURES_60 = [
  'Live real-time profile — not a PDF. When you fly and log hours, your profile updates. Airlines always see your current status.',
  'Recognition Score — scored on recency, hours flown, type rating & profile completeness',
  'Recognition+ badge — airlines see your score in their ranked shortlist bulletin',
  'Submit pathway interest — airlines pull a scored shortlist of interested pilots (no background check)',
  'Airlines filter by: score, recency, type rating, hours flown — your profile is ranked, not just listed',
  'Priority position in shortlist — not buried in a general pool',
  'Unlimited profile comparisons (pathway / airline / type rating)',
  'Direct feedback on profile gaps from match engine & score',
  'Recognition AI — extended use, pulls from latest type rating / airline / pathway changes and tells you exactly how to align your profile',
  'Atlas CV — upload documents (licenses, medical, ratings)',
  'Uploaded documents visible on profile — not screened',
  'EBT CBTA interview fast-track — priority access after Foundation Program (skip the queue)',
  '25% off Foundation & Transition Programs',
];

const FEATURES_100 = [
  'Live real-time profile — not a PDF. When you fly and log hours, your profile updates instantly. Airlines pull your current data, not a snapshot from months ago.',
  'Veremark background screening — verified badge attached to your profile in the pulling system',
  'Recognition Score — scored on recency, hours flown, type rating, completeness & Veremark status',
  'Recognition+ Verified badge — airlines filter for this first: background checked, preferred tier',
  'Submit pathway interest — your profile enters the airline\'s ranked bulletin with background check attached',
  'Airlines don\'t get random CVs — they pull a scored shortlist of interested pilots. You rank highest.',
  'Airlines filter by: Veremark status, recency, type rating, hours, score — you appear at the top',
  'Priority position in shortlist — not buried in a general pool',
  'Direct feedback on profile gaps from match engine & score',
  'Recognition AI — extended use, pulls from latest type rating / airline / pathway changes and tells you exactly how to align your profile',
  'Atlas CV — upload & Veremark-screened documents (licenses, medical, ratings)',
  'Screened documents visible to airlines & operators in the pull',
  'Unlimited profile comparisons (pathway / airline / type rating)',
  'EBT CBTA interview fast-track — priority access after Foundation Program (skip the queue)',
  '50% off Foundation & Transition Programs',
];

const HERO_FEATURES_PREVIEW = 5;

export default function StripePaymentSection({ onNavigate }: StripePaymentSectionProps) {
  const { currentUser } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [showAllHero, setShowAllHero] = useState(false);

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
      {/* ── Hero Split: Copy left, Profile mockup right ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 px-2">
        {/* Left copy */}
        <div>
          <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-4">Pilot Programs</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
            <span className="text-red-500">Recognition+</span> Unlocks
          </h2>
          <p className="text-slate-300 text-base leading-relaxed mb-8 max-w-md">
            Get the recognition you deserve. Background screened, prepared through programs, connected to pathways — giving your profile the edge that airlines notice.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => { onNavigate('become-member'); window.scrollTo(0, 0); }}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 transition-all"
            >
              Secure your Profile with <span className="text-red-500 font-bold">Recognition+</span>
              <span className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center text-xs">→</span>
            </button>
            <button
              onClick={() => onNavigate('recognition-plus')}
              className="px-6 py-3 rounded-full bg-slate-800 border border-slate-600 text-white font-semibold text-sm hover:bg-slate-700 transition-all"
            >
              Learn more about Recognition Profile
            </button>
          </div>
        </div>

        {/* Right — $100/year pricing card */}
        <div className="relative">
          <div className="rounded-2xl border border-blue-500/40 bg-white/5 backdrop-blur-md shadow-2xl overflow-hidden">
            {/* Top accent line */}
            <div className="h-[3px] w-full bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />
            <div className="p-7">
              {/* Plan label */}
              <p className="text-[10px] uppercase tracking-[0.25em] text-blue-400 font-semibold mb-1">Recognition Plus</p>
              {/* Price */}
              <div className="flex items-end gap-2 mb-1">
                <span className="text-6xl font-bold text-white leading-none">$100</span>
                <span className="text-slate-400 text-base mb-1">/ year</span>
              </div>
              <p className="text-slate-400 text-sm mb-1">Airlines pull you — you don't chase them. Verified, ranked first.</p>
              <p className="text-blue-400 text-xs font-semibold mb-6">✓ 3-day free trial included</p>

              {/* Feature list */}
              <ul className="space-y-2.5 mb-3">
                {(showAllHero ? FEATURES_100 : FEATURES_100.slice(0, HERO_FEATURES_PREVIEW)).map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-400 text-[10px]">✓</span>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setShowAllHero(v => !v)}
                className="text-blue-400 hover:text-blue-300 text-xs font-semibold mb-5 flex items-center gap-1 transition-colors"
              >
                {showAllHero ? '↑ Show less' : `+ ${FEATURES_100.length - HERO_FEATURES_PREVIEW} more features`}
              </button>

              {/* CTA */}
              <button
                onClick={() => onNavigate('recognition-plus')}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-900/40"
              >
                Get Recognition Plus
              </button>
              <p className="text-center text-slate-500 text-xs mt-3">Cancel anytime · Secure checkout</p>
            </div>
          </div>
          {/* Decorative glow */}
          <div className="absolute -inset-4 rounded-3xl bg-blue-600/15 blur-2xl -z-10 pointer-events-none" />
        </div>
      </div>

      {/* ── Pricing Cards ── */}
      <div className="px-2">
        <p className="text-center text-[11px] uppercase tracking-[0.25em] text-slate-400 mb-2">Choose Your Plan</p>
        <h3 className="text-center text-2xl md:text-3xl font-bold text-white mb-8">Simple, transparent pricing</h3>

        {/* Free */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-4 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Free Account</p>
              <p className="text-3xl font-bold text-white">$0 <span className="text-base font-normal text-slate-400">/ forever</span></p>
              <p className="text-slate-400 text-sm mt-1">Recognition Score visible (no badge) · 2 pathway interests/month · enters general pool · Recognition AI (5 chats/month) · Standard Atlas CV · EBT interview 1–2 months after Foundation</p>
            </div>
            <button
              onClick={() => { onNavigate('become-member'); window.scrollTo(0, 0); }}
              disabled={processing}
              className="flex-shrink-0 px-8 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-50"
            >
              Create Free Account
            </button>
          </div>
        </div>

        {/* Annual + Semi-annual side by side */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* Annual */}
          <div className="relative bg-white/5 border border-blue-500/40 rounded-2xl p-6 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />
            <p className="text-[10px] uppercase tracking-widest text-blue-400 mb-1">Recognition Plus</p>
            <p className="text-4xl font-bold text-white mb-0.5">$100 <span className="text-base font-normal text-slate-400">/ year</span></p>
            <p className="text-slate-400 text-xs mb-1">Verified by Veremark · Preferred by airlines & operators</p>
            <p className="text-blue-400 text-xs font-semibold mb-5">✓ 3-day free trial</p>
            <ul className="space-y-2 mb-6">
              {FEATURES_100.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-blue-400 mt-0.5 flex-shrink-0">✓</span>{f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => onNavigate('recognition-plus')}
              disabled={processing}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-50"
            >
              {processing ? 'Processing…' : 'Get Recognition Plus'}
            </button>
          </div>

          {/* Semi-annual */}
          <div className="relative bg-white/5 border border-violet-500/40 rounded-2xl p-6 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-600 via-violet-400 to-transparent" />
            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-violet-600/80 text-white text-[10px] font-bold uppercase tracking-wider">Flexible</div>
            <p className="text-[10px] uppercase tracking-widest text-violet-400 mb-1">Recognition Plus</p>
            <p className="text-4xl font-bold text-white mb-0.5">$60 <span className="text-base font-normal text-slate-400">/ 6 months</span></p>
            <p className="text-slate-400 text-xs mb-1">Full intelligence · Shortlisted as Recognition+ member</p>
            <p className="text-violet-400 text-xs font-semibold mb-5">✓ 3-day free trial</p>
            <ul className="space-y-2 mb-6">
              {FEATURES_60.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-violet-400 mt-0.5 flex-shrink-0">✓</span>{f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => onNavigate('recognition-plus')}
              disabled={processing}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-50"
            >
              {processing ? 'Processing…' : 'Get Recognition Plus'}
            </button>
          </div>
        </div>

        {/* Enterprise */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2 pb-4 border-t border-white/10">
          <p className="text-slate-400 text-sm">Are you an airline, operator, or training organization?</p>
          <button
            onClick={() => window.location.href = 'https://enterprise.pilotrecognition.com'}
            className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors"
          >
            Click here for enterprise access →
          </button>
        </div>
      </div>
    </div>
  );
}
