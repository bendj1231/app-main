'use client';

import { useState } from 'react';
import { ArrowRight, Users, Globe, Award, ChevronDown } from 'lucide-react';

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
  { label: 'Advocacy', href: '/pilotshortage/advocacy' },
  { label: 'UCF', href: '/pilotshortage/ucf' },
  { label: 'News', href: '/pilotshortage/news' },
];

export default function ConnectingPilotsHero() {
  const [currentRegion, setCurrentRegion] = useState(regions[0]);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);

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
                  className="text-gray-700 hover:text-red-500 text-sm font-medium uppercase tracking-wide transition-colors"
                >
                  {item.label}
                </a>
              ))}

              {/* Region Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                >
                  <span>{currentRegion.flag}</span>
                  <span className="text-gray-700">{currentRegion.name}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showRegionDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showRegionDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                    {regions.map((region) => (
                      <button
                        key={region.code}
                        onClick={() => {
                          setCurrentRegion(region);
                          setShowRegionDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                          currentRegion.code === region.code ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-700'
                        }`}
                      >
                        <span>{region.flag}</span>
                        {region.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <a
                href="/pilotshortage/join"
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded font-bold text-sm uppercase tracking-wide transition-colors"
              >
                Join PSA
              </a>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-black">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#1e3a5f] via-[#0f172a] to-[#0a1628] min-h-[85vh] flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Alert Banner */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">
                {currentRegion.flag} Now active in {currentRegion.name}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Connecting Pilots
              <span className="block text-red-400">to the Industry</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light">
              The End to the Shortage
            </p>

            {/* Description */}
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              PSA bridges the gap between qualified pilots and aviation operators. 
              No more wasted hours. No more broken pathways. Just direct connections 
              between pilots who can fly and companies who need them.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="/pilotshortage/join"
                className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105"
              >
                Join PSA Today
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/pilotshortage/about"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-lg border border-white/30 transition-all"
              >
                Learn How It Works
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Users className="w-8 h-8 text-red-400" />
                </div>
                <div className="text-3xl font-bold text-white">2,000+</div>
                <div className="text-sm text-gray-400">Verified Pilots</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Globe className="w-8 h-8 text-red-400" />
                </div>
                <div className="text-3xl font-bold text-white">7</div>
                <div className="text-sm text-gray-400">Countries</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Award className="w-8 h-8 text-red-400" />
                </div>
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-gray-400">Free Membership</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Problem Statement Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-6">
              The Pipeline Isn't Broken. It's Clogged.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              There is no pilot shortage. There is a recognition shortage. Thousands of qualified 
              pilots sit on the ground while airlines claim they can't find crew. The system 
              isn't connecting supply with demand—it's hiding it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-red-600">0</span>
              </div>
              <h3 className="font-bold text-[#1e3a5f] mb-2">The Rejected</h3>
              <p className="text-gray-600 text-sm">
                CPL holders with 200 hours, promised airline jobs that never materialize. 
                Lines to instructor positions backed up years.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-orange-600">1</span>
              </div>
              <h3 className="font-bold text-[#1e3a5f] mb-2">The Trapped</h3>
              <p className="text-gray-600 text-sm">
                Flight instructors with 5,000+ hours, 15 years experience. Stuck because 
                nobody's leaving the next floor.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">2+</span>
              </div>
              <h3 className="font-bold text-[#1e3a5f] mb-2">The Invisible</h3>
              <p className="text-gray-600 text-sm">
                Everyone fighting for recognition. Pilots don't know what's required. 
                Airlines can't find verified candidates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-[#1e3a5f]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              PSA Unclogs the Pipeline
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              We don't train pilots. We connect them. Verified credentials, transparent pathways, 
              direct access to operators who need crew now.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <div className="text-3xl mb-4">✓</div>
              <h3 className="font-bold text-white mb-2">Verify</h3>
              <p className="text-gray-300 text-sm">
                Blockchain-backed credentials. One verification, trusted everywhere.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <div className="text-3xl mb-4">→</div>
              <h3 className="font-bold text-white mb-2">Connect</h3>
              <p className="text-gray-300 text-sm">
                Direct pathways to airlines, cargo, charter, and emerging sectors.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <div className="text-3xl mb-4">↑</div>
              <h3 className="font-bold text-white mb-2">Advance</h3>
              <p className="text-gray-300 text-sm">
                Recognition Score follows you. Seniority that travels between employers.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <div className="text-3xl mb-4">✈</div>
              <h3 className="font-bold text-white mb-2">Fly</h3>
              <p className="text-gray-300 text-sm">
                Stop waiting. Start flying. The industry needs you now.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-6">
              Ready to End the Shortage?
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Join 2,000+ pilots already in the PSA network. Free membership. 
              Verified status. Direct connections to aviation operators worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/pilotshortage/join"
                className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg transition-all"
              >
                Join PSA Free
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/pilotshortage/benefits"
                className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 px-8 rounded-lg transition-all"
              >
                See Member Benefits
              </a>
            </div>
          </div>
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
