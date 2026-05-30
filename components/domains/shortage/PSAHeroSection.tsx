'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function PSAHeroSection() {
  const [expandedFloor, setExpandedFloor] = useState<number | null>(null);

  const floors = [
    {
      id: 0,
      name: 'user:flybravo',
      role: 'Commercial Pilot',
      hours: '200',
      investment: '$50,000',
      title: 'The Rejection That Started It All',
      quote:
        "I didn't fly 4,000 miles, risk everything I have for my career, wear my pilot uniform with three bars and my solo badge, just to be treated like a number.",
      story:
        "January 21, 2026. Etihad Aviation Career Fair. Fully qualified CPL holder, valid medical, recent flight time. The response: '1500 hours. Come back when you got that. Scan the code and move on.'",
      stat: "$50,000 could've bought a house. Could've bought a Ferrari. Instead, invested in this.",
      color: 'bg-red-600',
    },
    {
      id: 1,
      name: 'user:FI7600',
      role: 'Flight Instructor',
      hours: '7,000',
      investment: '15 years teaching',
      title: "The Golden CFI Who Can't Escape",
      quote:
        'I want to be a private jet pilot. I want to fly corporate. But there is no pathway for that. Nobody values these pilots.',
      story:
        '15 years teaching. 7,000 hours. 3,000+ IFR simulator hours. 500+ students soloed. More qualified than most airline captains. Stuck teaching not by choice — because leaving means unemployment.',
      stat: 'The backbone of the industry. Still invisible.',
      color: 'bg-orange-500',
    },
    {
      id: 2,
      name: 'user:techpilot',
      role: 'Commercial Pilot',
      hours: '700',
      investment: '$150,000 + AMT degree',
      title: "The Connected Candidate Who Couldn't Get In",
      quote:
        'If the connected candidate is locked out, what chance does the average graduate have?',
      story:
        "700 hours. Self-funded. 4-year AMT degree. Aviation industry family connections. Zero callbacks. The system doesn't care about qualifications. It's blind to value.",
      stat: 'Even the connected are locked out.',
      color: 'bg-yellow-500',
    },
    {
      id: 3,
      name: 'user:capt12',
      role: 'Airline Captain',
      hours: '12 years',
      investment: 'Captain, airline pilot',
      title: 'Seniority Is A Prison',
      quote:
        'Worth it. Experienced. Credibility is real. But if he leaves, loses everything built.',
      story:
        "12 years at a major airline. Captain. Bored. Trapped. Wants to explore private aviation. But seniority doesn't travel. Leave = First Officer again. Benefits gone. 12 years erased.",
      stat: 'Your aviation footprint should travel with you.',
      color: 'bg-blue-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e3a5f] via-[#1e3a5f] to-white">
      {/* Main Hero - Two Column Layout */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Badge - Centered Above */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#c41e3a]/20 border border-[#c41e3a]/30 rounded-full px-4 py-2">
            <span className="w-2 h-2 bg-[#c41e3a] rounded-full animate-pulse"></span>
            <span className="text-[#c41e3a] text-sm font-bold uppercase tracking-wider">
              An Association Run By Pilots, For Pilots
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
          {/* Left Column - Main Hero Content */}
          <div className="text-center lg:text-left">
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              There Is No Pilot Shortage.
              <br />
              <span className="text-[#c41e3a]">There Is A Clogged Pipeline.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl">
              Thousands of pilots exist. They are trained, credentialed, and ready. But they are{' '}
              <span className="text-white font-bold">stuck</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#share-story"
                className="bg-[#c41e3a] hover:bg-[#a31830] text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
              >
                Share Your Story →
              </a>
              <a
                href="#four-floors"
                className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg border border-white/30"
              >
                See The Four Floors ↓
              </a>
            </div>

            {/* Trust Badge */}
            <div className="mt-6 text-gray-400 text-sm">
              ✓ Free membership. ✓ Identity protected. ✓ Verified through pilotrecognition.com
            </div>
          </div>

          {/* Right Column - Stacked Cards */}
          <div className="space-y-6">
            {/* Mission Statement */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8 text-left">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 border-b border-white/20 pb-2">
                Our Mission
              </h2>
              <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                <p>
                  Manufacturers build aircraft. Airlines buy them. Everyone assumes{' '}
                  <strong className="text-white">someone else</strong> will find the pilots. But
                  pilots are not secondary. We are the backbone. We hold the type ratings. We choose
                  which airline to fly for. We decide to become pilots in the first place.
                </p>
                <p>
                  Yet we are treated without direction.
                  <strong className="text-white">No pathways. No credibility.</strong>
                  200-hour graduates with no placement. Instructors stuck safeguarding their only
                  job. 12-year captains handcuffed to seniority — leave and become First Officer
                  again.
                </p>
                <p>
                  <strong className="text-white">PSA is pilots speaking for pilots.</strong>
                  We know the real story because we live it. We are collaborating with
                  manufacturers, airlines, and ATOs to provide transparency, direction, and clarity.
                </p>
                <p>
                  The real shortage? <strong className="text-white">Massive loss of talent.</strong>
                  Pilots see no future in aviation. No certainty. Despite investing hundreds of
                  thousands in ratings and licenses, they find no pathways, no proof of career
                  stability. We are here to fix that — before more talent walks away.
                </p>
                <p className="text-white font-bold text-center pt-3 border-t border-white/20 mt-3">
                  The pilot is not the failure. The industry failed the pilot. We are here to change
                  that.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* How We Work - Full Width */}
      <div className="bg-[#1e3a5f] border-t border-white/10 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center border-b border-white/20 pb-4">
              How We Work
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-gray-300 text-sm leading-relaxed">
              <div>
                <h3 className="text-white font-bold mb-2">Anonymous Stories, Protected Voices</h3>
                <p>
                  We welcome pilots telling their story — career shifts, training investment,
                  placement struggles, survival. All anonymous for safety against whistleblowing.
                </p>
              </div>
              <div>
                <h3 className="text-white font-bold mb-2">Verified For Credibility</h3>
                <p>
                  Support from{' '}
                  <a
                    href="https://pilotrecognition.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#c41e3a] hover:underline font-semibold"
                  >
                    pilotrecognition.com
                  </a>{' '}
                  — verify logbooks, flight hours, licenses. An extra layer of credibility for the
                  industry.
                </p>
              </div>
              <div>
                <h3 className="text-white font-bold mb-2">Career Trajectory — A First For Aviation</h3>
                <p>
                  Collaboration with{' '}
                  <a
                    href="https://pilotcareerpathways.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#c41e3a] hover:underline font-semibold"
                  >
                    pilotcareerpathways.com
                  </a>{' '}
                  — up-to-date airline requirements, expectations before applying, profile matching.
                </p>
              </div>
            </div>
            <p className="text-white font-bold text-center pt-6 border-t border-white/20 mt-6">
              We are pilotshortage.org — welcome to other associations fighting the cause.
            </p>
          </div>
        </div>
      </div>

      {/* The Four-Floor Tower */}
      <div id="four-floors" className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-[#1e3a5f] mb-4">
              The Four-Floor Tower
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The pipeline is clogged at every level. From 200-hour graduate to 12-year captain —{' '}
              <strong>everyone is trapped.</strong>
            </p>
          </div>

          {/* Floors */}
          <div className="max-w-4xl mx-auto space-y-4">
            {floors.map((floor) => (
              <div
                key={floor.id}
                className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-[#1e3a5f] transition-colors"
              >
                {/* Floor Header */}
                <button
                  onClick={() => setExpandedFloor(expandedFloor === floor.id ? null : floor.id)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 ${floor.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}
                    >
                      F{floor.id}
                    </div>
                    <div>
                      <div className="text-lg font-bold text-[#1e3a5f]">{floor.name}</div>
                      <div className="text-gray-500 text-sm">
                        <span className="inline-block bg-gray-100 rounded px-2 py-0.5 text-xs font-medium mr-2">
                          {floor.role}
                        </span>
                        {floor.hours} hrs • {floor.investment}
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    {expandedFloor === floor.id ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </button>

                {/* Expanded Content */}
                {expandedFloor === floor.id && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                    <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">{floor.title}</h3>
                    <blockquote className="text-lg text-gray-700 italic border-l-4 border-[#c41e3a] pl-4 mb-4">
                      "{floor.quote}"
                    </blockquote>
                    <p className="text-gray-600 mb-4">{floor.story}</p>
                    <div className="bg-[#c41e3a]/10 rounded-lg p-4 text-[#c41e3a] font-bold">
                      {floor.stat}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* The Angel Investor */}
          <div className="max-w-4xl mx-auto mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-xl">
                $
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold">user:investor</h3>
                  <span className="bg-white/20 rounded px-2 py-0.5 text-xs">Airline Captain</span>
                </div>
                <p className="text-white/90">
                  Active airline pilot. Flying international legs daily. Has capital to invest.
                  Wants change. Wants new opportunities.{' '}
                  <strong>Has zero time to research them.</strong>
                </p>
                <p className="text-white/70 text-sm mt-2">
                  Even success is a trap. The pipeline is clogged at every level — including the
                  top.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
