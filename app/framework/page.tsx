import React from 'react';
import { Link } from 'react-router-dom';

export default function FrameworkPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
          <Link to="/enterprise-access" className="font-semibold">← Back</Link>
          <a href="/docs/universal-commercial-framework.tex" download className="text-sm border px-4 py-2 rounded">Download .tex</a>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-12">
        <header className="text-center mb-12 pb-8 border-b-2 border-slate-900">
          <h1 className="text-5xl font-bold mb-4">Universal Commercial Framework</h1>
          <p className="text-xl text-slate-600 italic">Master Blueprint for Aviation Stakeholders</p>
          <p className="text-sm text-slate-500 mt-4">Revision: 10.0 | May 2026</p>
        </header>

        <section className="mb-12 bg-slate-50 p-8 rounded-xl border-l-4 border-slate-900">
          <h2 className="text-lg font-bold mb-4">Abstract</h2>
          <p className="text-slate-700 text-lg">
            20-pillar operational blueprint for airlines, training orgs, financial institutions, 
            regulators, and verification providers to unify the global aviation economy.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 border-b-2 border-slate-900 pb-2">12 Industry Failures</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              "1,500-Hour Catch-22",
              "QR Code Apathy", 
              "Type-Rating Trap",
              "Hour Disconnect",
              "Handcuffed Instructors",
              "Bored Captains",
              "Alumni Backlog",
              "Apples Metaphor",
              "Insurance Paradox",
              "Generational Deterrence",
              "Hardware Blindness",
              "Narrow Avenues"
            ].map((f, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded flex gap-3">
                <span className="font-bold">{i + 1}.</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 border-b-2 border-slate-900 pb-2">20 Stakeholder Pillars</h2>
          
          {[
            { hub: 'Hub A: Operations', pillars: ['Airlines', 'Cargo', 'BizAv', 'Emerging'] },
            { hub: 'Hub B: Training', pillars: ['Flight Schools', 'Type Rating', 'Military', 'Universities'] },
            { hub: 'Hub C: Capital', pillars: ['Banking', 'Insurance', 'Regulators'] },
            { hub: 'Hub D: Infrastructure', pillars: ['VEREMARK', 'Flight Data', 'AMEs'] },
            { hub: 'Hub E: Community', pillars: ['Mentors', 'Manufacturers'] },
            { hub: 'Hub F: Growth', pillars: ['Recruitment', 'Media', 'Events', 'Government'] }
          ].map((h) => (
            <div key={h.hub} className="mb-6">
              <h3 className="text-xl font-bold mb-3">{h.hub}</h3>
              <div className="flex flex-wrap gap-2">
                {h.pillars.map((p) => (
                  <span key={p} className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 border-b-2 border-slate-900 pb-2">VEREMARK Partnership</h2>
          <div className="bg-slate-900 text-white p-6 rounded-xl">
            <p className="text-red-400 font-bold mb-2">PILLAR 12 — CRITICAL PARTNERSHIP</p>
            <p className="mb-4">Philippines data pulls: PRC, NBI, Medical, Employment verification</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><p className="text-2xl font-bold text-red-400">2,230%</p><p className="text-xs">ROI 3yr</p></div>
              <div><p className="text-2xl font-bold text-red-400">5,000+</p><p className="text-xs">Pilots Y1</p></div>
              <div><p className="text-2xl font-bold text-red-400">$0→$12</p><p className="text-xs">Tiered</p></div>
            </div>
          </div>
        </section>

        <div className="text-center py-8 border-t">
          <Link to="/framework/full"
             className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg transition-colors">
            View Full Framework (90+ pages)
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </article>
    </div>
  );
}
