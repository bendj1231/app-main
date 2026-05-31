'use client';

import { useState } from 'react';
import { ChevronDown, AlertTriangle, BookOpen, FileText, ArrowRight, Scale, Clock } from 'lucide-react';

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
  { label: 'About PSA', href: '/pilotshortage/about' },
  { label: 'Member Benefits', href: '/pilotshortage/benefits' },
  { label: 'Advocacy', href: '/pilotshortage/advocacy', active: true },
  { label: 'UCF', href: '/pilotshortage/ucf' },
  { label: 'News', href: '/pilotshortage/news' },
];

const policyPositions = [
  {
    title: "The 1,500-Hour Rule",
    icon: Clock,
    summary: "Arbitrary hour-counting creates a humanitarian crisis without improving safety.",
    detail: "The 1,500-hour rule was created with good intentions after the Colgan Air tragedy. But 15 years later, it has created a humanitarian crisis—not a safety revolution. The spike in ATP certifications is a pandemic backlog illusion, not a sustainable pipeline.",
    stat: "15,000+",
    statLabel: "Pilots stranded",
    link: "#1500-rule"
  },
  {
    title: "Competency-Based Training",
    icon: BookOpen,
    summary: "Quality over quantity. Structured programs beat unstructured hour-building.",
    detail: "European EASA programs produce airline-ready pilots at 200-250 hours through structured, high-intensity training followed by airline-sponsored type ratings. The US system forces pilots into expensive, unstructured 'joy rides' that teach little.",
    stat: "$200K",
    statLabel: "US average cost",
    link: "#training-reform"
  },
  {
    title: "Air Service Deserts",
    icon: AlertTriangle,
    summary: "Rural communities lose air service while qualified pilots sit unemployed.",
    detail: "The rigidity of the 1,500-hour rule has forced regional carriers to cut flights or pull out of smaller airports entirely. Mainline airlines hire away regional captains, leaving communities disconnected from the global economy.",
    stat: "200+",
    statLabel: "Communities affected",
    link: "#air-service"
  },
  {
    title: "CFI Churn Crisis",
    icon: FileText,
    summary: "Flight instructors quit the moment they hit 1,500 hours.",
    detail: "Forcing candidates into CFI roles to 'build hours' creates a vicious loop. Average CFI tenure: 8-14 months. The moment instructors hit 1,500 hours, they exit to airlines—destabilizing flight schools and reducing training quality.",
    stat: "60%",
    statLabel: "Annual CFI turnover",
    link: "#cfi-churn"
  }
];

export default function AdvocacyPage() {
  const [currentRegion, setCurrentRegion] = useState(regions[0]);
  const [expandedPosition, setExpandedPosition] = useState<string | null>(null);

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
      <div className="bg-gradient-to-br from-[#c41e3a] to-[#a31830] py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
            <Scale className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-bold uppercase tracking-wider">
              Policy & Reform
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Advocacy
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            We support safety. We oppose arbitrary barriers. Here is our evidence-based 
            position on pilot training reform.
          </p>
        </div>
      </div>

      {/* Policy Positions Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
              Policy Positions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Data-driven positions on the regulations creating the pilot shortage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {policyPositions.map((position) => (
              <div
                key={position.title}
                className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-[#c41e3a] transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#c41e3a]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <position.icon className="w-6 h-6 text-[#c41e3a]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#1e3a5f] mb-1">{position.title}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-[#c41e3a]">{position.stat}</span>
                        <span className="text-gray-500 text-sm">{position.statLabel}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{position.summary}</p>

                  {expandedPosition === position.title && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-700 text-sm leading-relaxed">{position.detail}</p>
                    </div>
                  )}

                  <button
                    onClick={() => setExpandedPosition(expandedPosition === position.title ? null : position.title)}
                    className="text-[#c41e3a] font-semibold text-sm hover:underline flex items-center gap-1"
                  >
                    {expandedPosition === position.title ? 'Show Less' : 'Learn More'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedPosition === position.title ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Colgan Air Truth */}
      <section id="1500-rule" className="py-16 bg-[#1e3a5f] text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            What the Colgan Air Crash Actually Revealed
          </h2>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 mb-8">
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              The 2009 Colgan Air Flight 3407 tragedy killed 50 people. The NTSB investigation 
              revealed the actual causes—none of which are addressed by the 1,500-hour rule:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#c41e3a] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Pilot Fatigue</h4>
                    <p className="text-gray-400 text-sm">The captain had commuted across the country overnight. She was exhausted—not inexperienced.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#c41e3a] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Inadequate Training</h4>
                    <p className="text-gray-400 text-sm">The captain failed multiple checkrides before passing. The system allowed marginal pilots through.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#c41e3a] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Crew Resource Management</h4>
                    <p className="text-gray-400 text-sm">The first officer failed to challenge the captain's errors—a training issue, not an hours issue.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#c41e3a] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Airline Oversight</h4>
                    <p className="text-gray-400 text-sm">Colgan Air's operational culture prioritized schedule over safety. A systemic failure.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xl text-[#c41e3a] font-bold">
              The 1,500-hour rule addresses none of these actual causes.
            </p>
          </div>
        </div>
      </section>

      {/* Submit Your Story CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">
            Your Story Is Evidence
          </h2>
          <p className="text-gray-600 mb-8">
            We compile verified pilot testimonials to present to policymakers, media, and the public. 
            Share your experience with the 1,500-hour rule, hour-building, or the pathway to your airline career.
          </p>

          <a
            href="/pilotshortage/join"
            className="inline-flex items-center gap-2 bg-[#c41e3a] hover:bg-[#a31830] text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
          >
            Submit Your Story
            <ArrowRight className="w-5 h-5" />
          </a>

          <p className="text-gray-400 text-sm mt-4">
            All submissions are verified and identity-protected.
          </p>
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
