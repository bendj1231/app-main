'use client';

import { useState } from 'react';
import { ChevronDown, Plane, Users, Target, Heart } from 'lucide-react';

// Reuse the Region type and picker from ShortageApp
const regions = [
  { code: 'en-ph', name: 'Philippines', flag: '🇵🇭' },
  { code: 'en-us', name: 'United States', flag: '🇺🇸' },
  { code: 'en-gb', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'en-au', name: 'Australia', flag: '🇦🇺' },
  { code: 'en-ca', name: 'Canada', flag: '🇨🇦' },
  { code: 'en-sg', name: 'Singapore', flag: '🇸🇬' },
  { code: 'en-ae', name: 'UAE', flag: '🇦🇪' },
];

const navItems = [
  { label: 'About PSA', href: '/pilotshortage/about', active: true },
  { label: 'Member Benefits', href: '/pilotshortage/benefits' },
  { label: 'Advocacy', href: '/pilotshortage/advocacy' },
  { label: 'UCF', href: '/pilotshortage/ucf' },
  { label: 'News', href: '/pilotshortage/news' },
];

export default function AboutPSAPage() {
  const [currentRegion, setCurrentRegion] = useState(regions[0]);
  const [expandedFloor, setExpandedFloor] = useState<number | null>(null);

  const floors = [
    {
      id: 0,
      name: 'The Graduate',
      role: 'Commercial Pilot',
      hours: '200',
      investment: '$50,000',
      title: 'The Rejection That Started It All',
      color: 'bg-red-600',
      description: 'Graduates with 200 hours, promised airline jobs that never materialize. Line to instructor positions backed up 2-3 years.',
    },
    {
      id: 1,
      name: 'The CFI',
      role: 'Flight Instructor',
      hours: '7,000',
      investment: '15 years teaching',
      title: 'The Golden CFI Who Cannot Escape',
      color: 'bg-orange-500',
      description: '15 years teaching. 7,000 hours. Stuck teaching not by choice—because leaving means unemployment.',
    },
    {
      id: 2,
      name: 'The Mid-Time Pilot',
      role: 'Commercial Pilot',
      hours: '700',
      investment: '$150,000',
      title: 'The Connected Candidate Who Could Not Get In',
      color: 'bg-yellow-500',
      description: '700 hours. Self-funded. 4-year degree. Industry connections. Zero callbacks.',
    },
    {
      id: 3,
      name: 'The Captain',
      role: 'Airline Captain',
      hours: '12 years',
      investment: 'Captain, airline pilot',
      title: 'Seniority Is A Prison',
      color: 'bg-blue-600',
      description: '12 years at a major. Captain. Trapped. Wants to explore private aviation. But seniority does not travel.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white text-black border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/pilotshortage" className="text-2xl font-bold tracking-tight">
              <span className="text-black">pilot</span>
              <span className="text-red-500">shortage</span>
              <span className="text-black">.org</span>
            </a>

            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-medium uppercase tracking-wide transition-colors ${
                    item.active
                      ? 'text-red-500 font-bold'
                      : 'text-gray-700 hover:text-red-500'
                  }`}
                >
                  {item.label}
                </a>
              ))}

              <div className="relative">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm">
                  <span>{currentRegion.flag}</span>
                  <span className="text-gray-700">{currentRegion.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <a
                href="/pilotshortage/join"
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded font-bold text-sm uppercase tracking-wide transition-colors"
              >
                Join PSA
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0a1628] py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-red-400 text-sm font-bold uppercase tracking-wider">
              Run By Pilots, For Pilots
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            About PSA
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The Pilot Shortage Association is run and managed by pilots who lived the shortage 
            problem—not corporations, not consultants, not people who have never worn the uniform.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">Our Mission</h2>
            <p className="text-gray-600 text-lg">
              Manufacturers build aircraft. Airlines buy them. Everyone assumes someone else will find the pilots.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="w-12 h-12 bg-[#1e3a5f] rounded-full flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">The Problem</h3>
              <p className="text-gray-600">
                The pilot shortage is not a lack of talent—it is a massive failure of industry infrastructure. 
                Thousands of trained pilots sit stranded while airlines complain about staffing.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <div className="w-12 h-12 bg-[#c41e3a] rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">The Solution</h3>
              <p className="text-gray-600">
                PSA collaborates with manufacturers, airlines, and ATOs to provide transparency, 
                direction, and clear pathways for pilots at every career stage.
              </p>
            </div>
          </div>

          <div className="bg-[#c41e3a]/5 border border-[#c41e3a]/20 rounded-xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#c41e3a] rounded-full flex items-center justify-center flex-shrink-0">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">Pilots Are Not Secondary</h3>
                <p className="text-gray-600 leading-relaxed">
                  We are the backbone. We hold the type ratings. We choose which airline to fly for. 
                  We decide to become pilots in the first place. Yet we are treated without direction. 
                  <strong>No pathways. No credibility.</strong>
                </p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  200-hour graduates with no placement. Instructors stuck safeguarding their only job. 
                  12-year captains handcuffed to seniority—leave and become First Officer again.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Four-Floor Tower */}
      <section id="four-floors" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
              The Four-Floor Tower
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The pipeline is clogged at every level. From 200-hour graduate to 12-year captain—
              <strong>everyone is trapped.</strong>
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {floors.map((floor) => (
              <div
                key={floor.id}
                className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-[#1e3a5f] transition-colors"
              >
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
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedFloor === floor.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedFloor === floor.id && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                    <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">{floor.title}</h3>
                    <p className="text-gray-600">{floor.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">Who We Are</h2>
            <p className="text-gray-600 text-lg">
              PSA is not a corporate lobbying group. We are pilots who experienced the shortage firsthand.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#1e3a5f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-[#1e3a5f]" />
              </div>
              <h3 className="font-bold text-[#1e3a5f] mb-2">Founded By Pilots</h3>
              <p className="text-gray-600 text-sm">
                Built by aviators who spent years in the hour-building trap, not executives in boardrooms.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#c41e3a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="w-10 h-10 text-[#c41e3a]" />
              </div>
              <h3 className="font-bold text-[#1e3a5f] mb-2">Pilot-First Advocacy</h3>
              <p className="text-gray-600 text-sm">
                Every policy position starts with one question: Does this help the stranded pilot?
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="font-bold text-[#1e3a5f] mb-2">Transparent & Free</h3>
              <p className="text-gray-600 text-sm">
                100% free membership. No dues. No corporate funding that could compromise our voice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1e3a5f]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join The Movement</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Become part of a growing community of aviation professionals advocating for transparent, fair career pathways.
          </p>
          <a
            href="/pilotshortage/join"
            className="inline-block bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-10 rounded text-lg transition-colors"
          >
            Join PSA Today
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a1628] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">
                <span className="text-white">pilot</span>
                <span className="text-red-500">shortage</span>
                <span className="text-gray-400">.org</span>
              </h4>
              <p className="text-gray-400 text-sm">
                Professional representation for aviation professionals worldwide.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">About</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/pilotshortage/about" className="hover:text-white">Our Mission</a></li>
                <li><a href="/pilotshortage/about#four-floors" className="hover:text-white">The Four Floors</a></li>
                <li><a href="/pilotshortage/about#who-we-are" className="hover:text-white">Who We Are</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Members</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/pilotshortage/join" className="hover:text-white">Join PSA</a></li>
                <li><a href="/pilotshortage/benefits" className="hover:text-white">Member Benefits</a></li>
                <li><a href="/pilotshortage/advocacy" className="hover:text-white">Advocacy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/pilotshortage/ucf" className="hover:text-white">UCF Framework</a></li>
                <li><a href="/pilotshortage/news" className="hover:text-white">News & Updates</a></li>
                <li><a href="/pilotshortage/advocacy" className="hover:text-white">Policy Positions</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2026 pilotshortage.org. All rights reserved. Run by pilots, for pilots.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
