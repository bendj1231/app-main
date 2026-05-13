'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// 25 Pillars with stakeholder mapping
const pillars = [
  { num: 1, name: 'Commercial Airlines', who: 'Airlines that hire you', problem: 'They can\'t find pre-verified pilots quickly' },
  { num: 2, name: 'Cargo & Freight Operators', who: 'FedEx, DHL, cargo airlines', problem: 'Need pilots with specific type ratings' },
  { num: 3, name: 'Charter & Business Aviation', who: 'Private jets, corporate flight depts', problem: 'Need flexible pilots with multiple skills' },
  { num: 4, name: 'Emerging Aviation (eVTOL)', who: 'Air taxi, drone companies', problem: 'No existing pilot pool for new aircraft' },
  { num: 5, name: 'Flight Training Organizations', who: 'Your flight school', problem: 'Graduates can\'t get jobs, instructors stuck' },
  { num: 6, name: 'Type Rating Centers', who: 'Simulator training facilities', problem: 'Expensive training, no job guarantee' },
  { num: 7, name: 'Military & Defense', who: 'Air Force, Navy aviation', problem: 'Civilian transition is broken' },
  { num: 8, name: 'Banking & Finance', who: 'Banks giving pilot loans', problem: 'Don\'t know which pilots are creditworthy' },
  { num: 9, name: 'Aviation Insurance', who: 'Insurance companies', problem: 'Can\'t assess pilot risk properly' },
  { num: 10, name: 'Regulatory Bodies', who: 'CAAP, FAA, EASA', problem: 'Paper-based, slow verification' },
  { num: 11, name: 'Verification APIs (VEREMARK)', who: 'Background check systems', problem: 'Pilots wait months for clearance' },
  { num: 12, name: 'Flight Data Providers', who: 'Navigraph, ForeFlight', problem: 'Data doesn\'t connect to job market' },
  { num: 13, name: 'Aeromedical Examiners', who: 'AMEs doing medicals', problem: 'Medical status not connected to hiring' },
  { num: 14, name: 'Pilot Mentors & Unions', who: 'Experienced pilots, unions', problem: 'Knowledge trapped, not shared' },
  { num: 15, name: 'Aircraft Manufacturers', who: 'Airbus, Boeing, OEMs', problem: 'Don\'t know who can fly their planes' },
  { num: 16, name: 'Recruitment Agencies', who: 'Pilot placement firms', problem: 'Matching pilots to jobs is guesswork' },
  { num: 17, name: 'Aviation Universities', who: 'Colleges with aviation programs', problem: 'Graduates lack industry connections' },
  { num: 18, name: 'Aviation Media', who: 'Publications, news', problem: 'Career advice is generic, not actionable' },
  { num: 19, name: 'Career Fairs & Events', who: 'Job fairs, conferences', problem: 'In-person only, limited reach' },
  { num: 20, name: 'Government Authorities', who: 'Civil aviation departments', problem: 'Policy lags behind industry needs' },
  { num: 21, name: 'International Organizations', who: 'IATA, ICAO', problem: 'Global standards don\'t transfer locally' },
  { num: 22, name: 'Church & Humanitarian Missions', who: 'Charitable aviation orgs', problem: 'Volunteer pilots not verified' },
  { num: 23, name: 'Aviation Events & Career Fairs', who: 'Industry events', problem: 'Networking limited by geography' },
  { num: 24, name: 'Government Aviation Authorities', who: 'National regulators', problem: 'Bureaucracy blocks career mobility' },
  { num: 25, name: 'Search & Discovery Platforms', who: 'Google, job boards, AI', problem: 'Pilots can\'t find verified pathways' },
];

// Problems organized by stakeholder type
const problemsByStakeholder = {
  'Airlines & Operators': [
    { title: '1,500-Hour Catch-22', desc: 'Airlines need experienced pilots, but won\'t hire to give experience' },
    { title: 'QR Code Apathy', desc: 'Airlines ignore digital credentials, demand paper' },
    { title: 'Type-Rating Trap', desc: 'Airlines want typed pilots but won\'t pay for training' },
    { title: 'Hour Disconnect', desc: 'Airlines focus on hours, not actual competency' },
  ],
  'Flight Schools & ATOs': [
    { title: 'Alumni Backlog', desc: 'Flight schools over-promise jobs, graduates stuck' },
    { title: 'Handcuffed Instructors', desc: 'Experienced instructors can\'t advance to airlines' },
    { title: 'Bored Captains', desc: 'Senior pilots want change but trapped by seniority' },
    { title: 'Hardware Blindness', desc: 'Schools ignore new tech that could help training' },
  ],
  'Regulators & Compliance': [
    { title: 'Insurance Paradox', desc: 'Insurance won\'t cover low-timers, blocking jobs' },
    { title: 'Paper-Based Verification', desc: 'Background checks take months, blocking hiring' },
    { title: 'Medical Disconnect', desc: 'Medical status not linked to job readiness' },
    { title: 'Apples Metaphor', desc: 'Regulators compare pilots incorrectly across sectors' },
  ],
  'The Industry Itself': [
    { title: 'Narrow Avenues', desc: 'Only one path visible: flight school → airline' },
    { title: 'Generational Deterrence', desc: 'Young people avoiding aviation careers' },
    { title: 'No Central Directory', desc: 'Jobs scattered across forums, social media, boards' },
    { title: 'Opaque Requirements', desc: 'What airlines actually want is never published clearly' },
  ],
};

// Accordion component
function Accordion({ title, children, isOpen, onToggle }: { title: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden mb-3">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${
          isOpen ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900 hover:bg-slate-100'
        }`}
      >
        <span className="font-semibold">{title}</span>
        <span className={`text-xl transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="p-5 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

export default function FrameworkPage() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
          <Link to="/" className="font-semibold hover:text-red-600 transition-colors">← Back to Home</Link>
          <div className="flex gap-4">
            <Link to="/discover-pathways" className="text-sm text-slate-600 hover:text-red-600">Pathways →</Link>
          </div>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-12 pb-8 border-b-2 border-slate-900">
          <p className="text-sm text-red-600 font-semibold mb-2 tracking-wider">FOR PILOTS</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Universal Commercial Framework</h1>
          <p className="text-xl text-slate-600 italic mb-2">Your Career Roadmap Explained Simply</p>
          <p className="text-sm text-slate-500">The industry blueprint that fixes why your pathway is blocked</p>
        </header>

        {/* What Is This Framework */}
        <section className="mb-12 bg-slate-50 p-8 rounded-xl border-l-4 border-red-600">
          <h2 className="text-2xl font-bold mb-4">What Is This Framework?</h2>
          <p className="text-slate-700 text-lg mb-4">
            Think of it as the rulebook everyone in aviation is playing by — except nobody gave you a copy. 
            Airlines, flight schools, and regulators all operate within this 25-pillar structure. 
            Understanding it gives you the edge.
          </p>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <p className="text-sm text-slate-600">
              <strong>Why you care:</strong> The Framework identifies exactly why the 200→1,500 hour gap exists 
              and what airlines actually want beyond just hours. It&apos;s your cheat sheet for bypassing the bottlenecks.
            </p>
          </div>
        </section>

        {/* 25 PILLARS FIRST - Stakeholders & Their Problems */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-red-600">
            <span className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">25</span>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">The 25 Pillars</h2>
              <p className="text-slate-600">Who they are and what problem they face (that affects you)</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {pillars.map((pillar) => (
              <div key={pillar.num} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-red-300 hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <span className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {pillar.num}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1">{pillar.name}</h3>
                    <p className="text-sm text-blue-600 font-medium mb-2">{pillar.who}</p>
                    <p className="text-sm text-slate-500">{pillar.problem}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROBLEMS BY STAKEHOLDER - Dropdown Table */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-slate-900">
            <span className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">The 12 Problems Holding You Back</h2>
              <p className="text-slate-600">Organized by which stakeholders create them</p>
            </div>
          </div>

          <p className="text-slate-600 mb-6">
            These systemic failures make your aviation career harder. Click each group to see how they block you:
          </p>

          {Object.entries(problemsByStakeholder).map(([group, problems]) => (
            <Accordion
              key={group}
              title={group}
              isOpen={openAccordion === group}
              onToggle={() => setOpenAccordion(openAccordion === group ? null : group)}
            >
              <div className="grid gap-3">
                {problems.map((problem, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-semibold text-slate-900">{problem.title}</h4>
                      <p className="text-sm text-slate-600">{problem.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Accordion>
          ))}
        </section>

        {/* Recognition Score Explained */}
        <section className="mb-12 bg-gradient-to-br from-red-50 to-amber-50 p-8 rounded-2xl border-2 border-red-200">
          <h2 className="text-2xl font-bold mb-4 text-red-900">How Recognition Score Fits In</h2>
          <p className="text-red-800 mb-6">
            The Framework identifies what all 25 stakeholders want. Your Recognition Score proves you have it.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl text-center shadow-sm">
              <p className="text-3xl font-bold text-red-600">0-39</p>
              <p className="text-sm text-slate-600 mt-1">Bronze<br />Entry Level</p>
            </div>
            <div className="bg-white p-4 rounded-xl text-center shadow-sm">
              <p className="text-3xl font-bold text-yellow-600">40-59</p>
              <p className="text-sm text-slate-600 mt-1">Silver<br />Developing</p>
            </div>
            <div className="bg-white p-4 rounded-xl text-center shadow-sm">
              <p className="text-3xl font-bold text-slate-400">60-79</p>
              <p className="text-sm text-slate-600 mt-1">Gold<br />Qualified</p>
            </div>
            <div className="bg-white p-4 rounded-xl text-center shadow-sm border-2 border-yellow-400">
              <p className="text-3xl font-bold text-yellow-600">80-100</p>
              <p className="text-sm text-slate-800 font-semibold mt-1">Platinum<br />Airline Ready</p>
            </div>
          </div>
        </section>

        {/* Continue Your Journey */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Continue Your Journey</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/discover-pathways" className="p-6 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors group">
              <h3 className="font-bold text-lg group-hover:text-red-400 transition-colors">Discover Pathways →</h3>
              <p className="text-sm text-slate-300 mt-2">See which airlines match your Recognition Score</p>
            </Link>
            <Link to="/programs" className="p-6 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors group">
              <h3 className="font-bold text-lg">Training Programs →</h3>
              <p className="text-sm text-red-100 mt-2">Build the skills the Framework says airlines want</p>
            </Link>
          </div>
        </section>

        {/* VEREMARK Partnership */}
        <section className="mb-12">
          <div className="bg-slate-900 text-white p-8 rounded-2xl">
            <p className="text-red-400 font-bold mb-2 text-sm tracking-wider">PILLAR 11 — VERIFICATION LAYER</p>
            <h3 className="text-2xl font-bold mb-4">VEREMARK Partnership</h3>
            <p className="text-slate-300 mb-6">Background verification that makes you &quot;pre-cleared&quot; for all 25 pillars</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-2xl font-bold text-red-400">PRC</p>
                <p className="text-xs text-slate-400">License Verify</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-2xl font-bold text-red-400">NBI</p>
                <p className="text-xs text-slate-400">Background Check</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-2xl font-bold text-red-400">Medical</p>
                <p className="text-xs text-slate-400">AME Status</p>
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise CTA */}
        <section className="mb-12 bg-gradient-to-r from-slate-100 to-slate-200 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">For Airlines & Industry Partners</h2>
          <p className="text-slate-600 mb-6">
            The full 90+ page framework includes API specs, integration guides, and commercial models for all 25 pillars.
          </p>
          <a 
            href="https://enterprise.pilotrecognition.com/framework"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            View Official Framework Page
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </section>

        {/* Footer CTA */}
        <div className="text-center py-8 border-t">
          <Link to="/framework/full"
             className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-xl transition-colors font-semibold text-lg">
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
