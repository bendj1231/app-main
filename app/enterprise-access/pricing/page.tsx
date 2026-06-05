'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STAKEHOLDERS = [
  { label: 'Airlines & Operators', icon: '✈️', desc: 'Pull verified pilot profiles, filter by type rating, hours, and recognition score.' },
  { label: 'Flight Training Orgs', icon: '🎓', desc: 'Track graduate placement, issue verified flight hours, counter-sign credentials.' },
  { label: 'Recruitment Agencies', icon: '🤝', desc: 'Access pre-verified candidates. Cut screening time from weeks to minutes.' },
  { label: 'Aviation Insurers', icon: '🛡️', desc: 'Live credential feeds. Real-time medical and rating currency status.' },
  { label: 'Banks & Lenders', icon: '🏦', desc: 'Career trajectory data for aviation-specific loan underwriting.' },
  { label: 'Government & Regulators', icon: '📋', desc: 'Cross-border compliance data. Verified license and rating records.' },
];

const INCLUDED = [
  'Pull API — query the full verified pilot database',
  'Unlimited Pathway Card listings',
  'Recognition Score access per pilot profile',
  'EBT video interview access',
  'Live profile feed — not static CVs',
  'Placement tracking dashboard',
  'Pilot interest inbox',
  'GDPR & Philippines DPA compliant data handling',
  'Dedicated onboarding support',
];

const FAQS = [
  {
    q: 'Do airlines have to pay to use the platform?',
    a: 'No. Airlines, flight schools, and manufacturers can search the verified pilot directory and view profiles for free. Basic talent scouting costs nothing. Enterprise is for operators who need Pull API access, advanced filtering, EBT video records, and custom recruitment pipelines — not for casual browsing.',
  },
  {
    q: 'Who pays for what?',
    a: 'Pilots pay subscriptions to build and verify their professional profiles, manage their career data, and unlock full pathway access. That is the primary revenue model — pilots invest in their own verified record. Operators who move beyond free scouting into active, high-volume recruitment pay $1,000/year for Pull API and data access. Corporate costs are for pipeline tools, not individual profile views.',
  },
  {
    q: 'Why $1,000/year and not monthly?',
    a: 'Annual commitment keeps the platform neutral. We\'re not incentivised to upsell you month-to-month. One flat fee, full access, no surprises.',
  },
  {
    q: 'What\'s the $500 outcome fee?',
    a: 'Charged only when a pilot engagement results in a confirmed placement through a pathway you listed. No outcome, no fee.',
  },
  {
    q: 'What is the Pull API?',
    a: 'A REST API that lets you query the verified pilot database by criteria — hours, type ratings, recognition score, location, medical status. You pull the pilots you need rather than receiving hundreds of unsolicited applications. Free scouting uses the directory UI; the Pull API is for programmatic, high-volume, or integrated recruitment workflows.',
  },
  {
    q: 'How is this different from a job board?',
    a: 'This is not a job board. Pilots own their profiles and pay to build and verify them. Operators list pathway requirements, not job postings. Pilots submit interest — you pull from a pre-verified, scored pool. The direction of information flow is reversed, and the data belongs to the pilot, not the platform.',
  },
];

export default function EnterprisePricingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
        {/* Coded by Benjamin Bowler */}

      {/* ─── NAV ─── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/enterprise-access')} className="text-slate-500 text-sm hover:text-slate-900 transition-colors">
          ← Enterprise
        </button>
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Pricing</span>
        <button
          onClick={() => navigate('/enterprise-access/learn-more')}
          className="bg-slate-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
        >
          Get access
        </button>
      </nav>

      {/* ─── HERO ─── */}
      <section className="px-6 py-20 sm:py-32 max-w-4xl mx-auto text-center">
        <p className="text-[11px] uppercase tracking-[0.35em] text-red-600 font-semibold mb-4">Enterprise Access</p>
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 leading-none">
          $1,000<span className="text-slate-400 font-normal text-3xl sm:text-4xl">/year</span>
        </h1>
        <p className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto mb-3">
          One flat rate. Every stakeholder. Full access to the verified pilot database.
        </p>
        <p className="text-slate-400 text-sm">Airlines · ATOs · Insurers · Lenders · Regulators · Recruiters</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
          <button
            onClick={() => navigate('/enterprise-access/learn-more')}
            className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-slate-700 transition-colors text-sm"
          >
            Request access
          </button>
          <button
            onClick={() => navigate('/enterprise-access')}
            className="border border-slate-200 text-slate-700 px-8 py-3.5 rounded-xl font-semibold hover:border-slate-400 transition-colors text-sm"
          >
            Learn more
          </button>
        </div>
      </section>

      {/* ─── WHY FLAT ─── */}
      <section className="bg-slate-50 border-y border-slate-100 px-6 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Why one price</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-5">Switzerland doesn't have a loyalty programme.</h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Every stakeholder pays the same rate because the data belongs to the pilot, not the highest bidder.
            An airline paying $5,000/month would expect preferential data. That breaks the neutrality.
            $1,000/year flat keeps the infrastructure honest — and that's the only reason pilots trust it.
          </p>
        </div>
      </section>

      {/* ─── WHAT'S INCLUDED ─── */}
      <section className="px-6 py-16 sm:py-24 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">What's included</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Everything. No add-ons.</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Full platform access from day one. No feature tiers, no per-seat pricing, no upsell calls.
            </p>
          </div>
          <ul className="space-y-3">
            {INCLUDED.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center text-emerald-600 text-xs font-bold">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── STAKEHOLDERS ─── */}
      <section className="bg-slate-50 border-y border-slate-100 px-6 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3 text-center">Who it's for</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center">Every stakeholder in aviation.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STAKEHOLDERS.map((s, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-2xl mb-3">{s.icon}</p>
                <p className="font-semibold text-slate-900 text-sm mb-1">{s.label}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING CARDS ─── */}
      <section className="px-6 py-16 sm:py-24 max-w-4xl mx-auto">
        <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3 text-center">Plans</p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center">Start free. Scale when ready.</h2>
        <div className="grid md:grid-cols-3 gap-5">

          {/* Free */}
          <div className="border border-slate-200 rounded-2xl p-6">
            <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-2">Free</p>
            <p className="text-4xl font-bold text-slate-900 mb-1">$0</p>
            <p className="text-slate-500 text-sm mb-5">List pathways, receive interest</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex gap-2"><span className="text-slate-300">•</span>Public pathway card listing</li>
              <li className="flex gap-2"><span className="text-slate-300">•</span>Pilot interest inbox</li>
              <li className="flex gap-2"><span className="text-slate-300">•</span>Basic outcome dashboard</li>
              <li className="flex gap-2"><span className="text-slate-400 line-through text-xs">Pull API</span></li>
              <li className="flex gap-2"><span className="text-slate-400 line-through text-xs">Recognition Score access</span></li>
            </ul>
            <button
              onClick={() => navigate('/enterprise-access/learn-more')}
              className="mt-6 w-full border border-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-semibold hover:border-slate-400 transition-colors"
            >
              Get started free
            </button>
          </div>

          {/* Enterprise */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 ring-2 ring-slate-900">
            <p className="text-red-400 text-xs uppercase tracking-widest font-semibold mb-2">Enterprise</p>
            <p className="text-4xl font-bold mb-1">$1,000<span className="text-lg text-slate-400 font-normal">/yr</span></p>
            <p className="text-slate-400 text-sm mb-5">Full database access</p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex gap-2"><span className="text-emerald-400">✓</span>Everything in Free</li>
              <li className="flex gap-2"><span className="text-emerald-400">✓</span>Pull API — query pilot database</li>
              <li className="flex gap-2"><span className="text-emerald-400">✓</span>Recognition Score per pilot</li>
              <li className="flex gap-2"><span className="text-emerald-400">✓</span>EBT video access</li>
              <li className="flex gap-2"><span className="text-emerald-400">✓</span>Live profile feed</li>
              <li className="flex gap-2"><span className="text-emerald-400">✓</span>Placement tracking</li>
            </ul>
            <button
              onClick={() => navigate('/enterprise-access/learn-more')}
              className="mt-6 w-full bg-white text-slate-900 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors"
            >
              Request access
            </button>
          </div>

          {/* Outcome */}
          <div className="border border-slate-200 rounded-2xl p-6">
            <p className="text-emerald-600 text-xs uppercase tracking-widest font-semibold mb-2">Outcome Fee</p>
            <p className="text-4xl font-bold text-slate-900 mb-1">$500<span className="text-lg text-slate-500 font-normal">/placement</span></p>
            <p className="text-slate-500 text-sm mb-5">Only when it works</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex gap-2"><span className="text-emerald-500">•</span>Charged on confirmed placement</li>
              <li className="flex gap-2"><span className="text-emerald-500">•</span>Tracked through pathway interaction</li>
              <li className="flex gap-2"><span className="text-emerald-500">•</span>Attribution proven before billing</li>
              <li className="flex gap-2"><span className="text-emerald-500">•</span>No outcome = no fee</li>
            </ul>
            <p className="mt-6 text-xs text-slate-400 text-center">Added to Enterprise plan only</p>
          </div>

        </div>
        <p className="text-center text-slate-400 text-xs mt-6">
          Custom data licences available for high-volume integrations — insurers, lenders, OEMs.{' '}
          <button onClick={() => navigate('/enterprise-access/learn-more')} className="underline hover:text-slate-600">Contact us.</button>
        </p>
      </section>

      {/* ─── FAQ ─── */}
      <section className="bg-slate-50 border-t border-slate-100 px-6 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3 text-center">FAQ</p>
          <h2 className="text-3xl font-bold mb-10 text-center">Common questions.</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                >
                  <span className="font-semibold text-sm text-slate-900">{faq.q}</span>
                  <span className="text-slate-400 text-lg flex-shrink-0">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-6 py-20 sm:py-28 text-center">
        <h2 className="text-3xl sm:text-5xl font-bold mb-4">Ready to pull, not push?</h2>
        <p className="text-slate-500 text-base sm:text-lg mb-8 max-w-xl mx-auto">
          Access the verified pilot database. One flat rate. No surprises.
        </p>
        <button
          onClick={() => navigate('/enterprise-access/learn-more')}
          className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold text-base hover:bg-slate-700 transition-colors"
        >
          Request enterprise access — $1,000/yr
        </button>
      </section>

    </div>
  );
}
