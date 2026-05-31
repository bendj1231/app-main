'use client';

import { useState } from 'react';
import { ChevronDown, Shield, Users, FileText, Globe, Check, ArrowRight } from 'lucide-react';

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
  { label: 'Member Benefits', href: '/pilotshortage/benefits', active: true },
  { label: 'Advocacy', href: '/pilotshortage/advocacy' },
  { label: 'UCF', href: '/pilotshortage/ucf' },
  { label: 'News', href: '/pilotshortage/news' },
];

const benefits = [
  {
    icon: Shield,
    title: "Verified Pilot Status",
    description: "Get cryptographically verified credentials through pilotrecognition.com. Make your qualifications visible to employers.",
    features: ["License verification (CAAP, FAA, EASA)", "Medical certificate validation", "Flight hours logbook review", "Background check clearance"]
  },
  {
    icon: Users,
    title: "Industry Network",
    description: "Connect with 2,000+ pilots worldwide. Share experiences, career strategies, and pathway intelligence.",
    features: ["Member forum access", "Regional pilot groups", "Mentor matching", "Peer validation"]
  },
  {
    icon: FileText,
    title: "Career Resources",
    description: "Access pathway cards, airline requirements, and real-time career intelligence unavailable elsewhere.",
    features: ["Airline pathway cards", "Training provider directory", "Type rating guides", "Salary transparency data"]
  },
  {
    icon: Globe,
    title: "Advocacy Representation",
    description: "Your voice in policy debates. PSA represents stranded pilots in regulatory discussions and media coverage.",
    features: ["Policy submissions", "Media representation", "Congressional testimony", "Industry forum participation"]
  }
];

export default function BenefitsPage() {
  const [currentRegion, setCurrentRegion] = useState(regions[0]);

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
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-white text-sm font-bold uppercase tracking-wider">
              100% Free Membership
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Member Benefits
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            PSA is free because our mission is truth, not profit. Every pilot who invested 
            $50,000–$200,000 in training deserves to be heard.
          </p>
        </div>
      </div>

      {/* Benefits Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                <div className="w-14 h-14 bg-[#1e3a5f]/10 rounded-full flex items-center justify-center mb-6">
                  <benefit.icon className="w-7 h-7 text-[#1e3a5f]" />
                </div>

                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-3">{benefit.title}</h3>
                <p className="text-gray-600 mb-6">{benefit.description}</p>

                <ul className="space-y-3">
                  {benefit.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Free Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-[#c41e3a]/5 border border-[#c41e3a]/20 rounded-2xl p-8 md:p-12">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-[#c41e3a] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-2xl font-bold">?</span>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a5f] mb-4">
                  Why Is PSA Free?
                </h2>
                <p className="text-gray-600 mb-4">
                  We believe the truth about the pilot shortage should not be behind a paywall. 
                  Every pilot who invested $50,000–$200,000 in training deserves to be heard, 
                  regardless of their current financial situation.
                </p>
                <p className="text-gray-600">
                  Our funding comes from <strong>airline partnerships</strong> and <strong>advocacy grants</strong>—not 
                  from pilot wallets. This keeps us independent and ensures our loyalty is to pilots, not profits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
              Free for All Pilots
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you are a student, graduate, CFI, or captain—PSA membership is free for life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Student */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-2xl">🎓</span>
                </div>
                <h3 className="font-bold text-xl text-[#1e3a5f] mb-2">Student Member</h3>
                <div className="text-3xl font-bold text-green-600">FREE</div>
                <p className="text-gray-500 text-sm">For students and recent graduates</p>
              </div>

              <ul className="space-y-3 mb-8">
                {["Access to career resources", "Industry news and updates", "Member forum access", "Submit your story"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Professional - Featured */}
            <div className="bg-white rounded-xl border-2 border-[#c41e3a] p-8 relative shadow-lg">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#c41e3a] text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Most Popular
                </span>
              </div>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-600 text-2xl">✈️</span>
                </div>
                <h3 className="font-bold text-xl text-[#1e3a5f] mb-2">Professional Member</h3>
                <div className="text-3xl font-bold text-green-600">FREE</div>
                <p className="text-gray-500 text-sm">For active pilots and CFIs</p>
              </div>

              <ul className="space-y-3 mb-8">
                {["All Student benefits", "Verified pilot profile", "Direct airline connections", "Career advocacy support"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Airline Partner */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-2xl">🏢</span>
                </div>
                <h3 className="font-bold text-xl text-[#1e3a5f] mb-2">Airline Partner</h3>
                <div className="text-3xl font-bold text-purple-600">FREE</div>
                <p className="text-gray-500 text-sm">For airlines and operators</p>
              </div>

              <ul className="space-y-3 mb-8">
                {["Access to verified pilot pool", "Published pathway commitment", "Association partnership", "Recruitment support"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1e3a5f]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Join?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Become part of a growing community of aviation professionals advocating for transparent, fair career pathways.
          </p>
          <a
            href="/pilotshortage/join"
            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
          >
            Join PSA Today
            <ArrowRight className="w-5 h-5" />
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
