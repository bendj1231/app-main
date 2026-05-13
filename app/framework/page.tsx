import React from 'react';
import { Link } from 'react-router-dom';

export default function FrameworkPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
          <Link to="/" className="font-semibold">← Back to Home</Link>
          <div className="flex gap-4">
            <Link to="/discover-pathways" className="text-sm text-slate-600 hover:text-red-600">Pathways →</Link>
          </div>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-12">
        <header className="text-center mb-12 pb-8 border-b-2 border-slate-900">
          <p className="text-sm text-red-600 font-semibold mb-2">FOR PILOTS</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Universal Commercial Framework</h1>
          <p className="text-xl text-slate-600 italic">Your Career Roadmap Explained Simply</p>
          <p className="text-sm text-slate-500 mt-4">The industry blueprint that fixes why your pathway is blocked</p>
        </header>

        {/* What is this */}
        <section className="mb-12 bg-slate-50 p-8 rounded-xl border-l-4 border-red-600">
          <h2 className="text-2xl font-bold mb-4">What Is This Framework?</h2>
          <p className="text-slate-700 text-lg mb-4">
            Think of it as the rulebook everyone in aviation is playing by — except nobody gave you a copy. 
            Airlines, flight schools, and regulators all operate within this 20-pillar structure. 
            Understanding it gives you the edge.
          </p>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <p className="text-sm text-slate-600">
              <strong>Why you care:</strong> The Framework identifies exactly why the 200→1,500 hour gap exists 
              and what airlines actually want beyond just hours. It&apos;s your cheat sheet for bypassing the bottlenecks.
            </p>
          </div>
        </section>

        {/* 12 Failures - Simplified */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b-2 border-slate-900 pb-2">The 12 Problems Holding You Back</h2>
          <p className="text-slate-600 mb-6">
            These are the systemic failures that make your aviation career harder than it should be. 
            We&apos;re fixing them — but you need to know they exist.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "1,500-Hour Catch-22", desc: "Need experience to get experience" },
              { title: "QR Code Apathy", desc: "Digital credentials ignored by employers" },
              { title: "Type-Rating Trap", desc: "Pay $50K+ before you're employable" },
              { title: "Hour Disconnect", desc: "Flight hours ≠ job readiness" },
              { title: "Handcuffed Instructors", desc: "Stuck teaching, not flying" },
              { title: "Bored Captains", desc: "Experienced pilots want out" },
              { title: "Alumni Backlog", desc: "Flight schools over-promise jobs" },
              { title: "Apples Metaphor", desc: "Comparing pilots incorrectly" },
              { title: "Insurance Paradox", desc: "Low-timers can't get coverage" },
              { title: "Generational Deterrence", desc: "Young people avoiding aviation" },
              { title: "Hardware Blindness", desc: "Ignoring new tech solutions" },
              { title: "Narrow Avenues", desc: "Too few career paths visible" }
            ].map((f, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-lg border-l-3 border-slate-300 hover:border-red-500 transition-colors">
                <h3 className="font-bold text-slate-900">{f.title}</h3>
                <p className="text-sm text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recognition Score Explained */}
        <section className="mb-12 bg-red-50 p-8 rounded-xl border-l-4 border-red-600">
          <h2 className="text-2xl font-bold mb-4 text-red-900">How Recognition Score Fits In</h2>
          <p className="text-red-800 mb-4">
            The Framework identifies what airlines want. Your Recognition Score proves you have it.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-red-600">0-39</p>
              <p className="text-sm text-slate-600">Bronze<br />Entry Level</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-yellow-600">40-59</p>
              <p className="text-sm text-slate-600">Silver<br />Developing</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-slate-400">60-79</p>
              <p className="text-sm text-slate-600">Gold<br />Qualified</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center border-2 border-yellow-400">
            <p className="text-4xl font-bold text-yellow-600">80-100</p>
            <p className="text-lg text-slate-800 font-semibold">Platinum — Airline Ready</p>
          </div>
        </section>

        {/* Enterprise Version CTA */}
        <section className="mb-12 bg-slate-900 text-white p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">For Airlines & Industry Partners</h2>
          <p className="text-slate-300 mb-6">
            The full 90+ page framework includes detailed operational blueprints, 
            API specifications, and commercial models for each stakeholder.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="https://enterprise.pilotrecognition.com/framework/full"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
            >
              View Full Framework (90+ Pages) →
            </a>
            <span className="text-slate-400 text-sm flex items-center justify-center">
              enterprise.pilotrecognition.com
            </span>
          </div>
        </section>

        {/* Quick Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Continue Your Journey</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/discover-pathways" className="p-6 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group">
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-red-600">Discover Pathways →</h3>
              <p className="text-sm text-slate-600">See which airlines match your Recognition Score</p>
            </Link>
            <Link to="/programs" className="p-6 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group">
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-red-600">Training Programs →</h3>
              <p className="text-sm text-slate-600">Build the skills the Framework says airlines want</p>
            </Link>
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
