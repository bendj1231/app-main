'use client';

import { useState } from 'react';
import { ChevronDown, Menu, X, ArrowRight, Shield, Globe, Plane } from 'lucide-react';

// Alert banner content
const alertBanner = {
  message: "Your training investment deserves recognition. Verify your credentials and join 2,000+ pilots demanding transparent pathways.",
  cta: "VERIFY NOW",
  link: "#verify"
};

// Navigation items
const navItems = [
  {
    label: "THE PROBLEM",
    dropdown: [
      { label: "The Clogged Pipeline", href: "#pipeline" },
      { label: "Four-Floor Tower", href: "#four-floors" },
      { label: "The 2013 Law", href: "#2013-law" },
      { label: "Case Studies", href: "#cases" }
    ]
  },
  {
    label: "SOLUTION",
    dropdown: [
      { label: "Verified Stories", href: "#stories" },
      { label: "Credential Vault", href: "#wallet" },
      { label: "Career Pathways", href: "#pathways" },
      { label: "Pilot Recognition", href: "#recognition" }
    ]
  },
  {
    label: "ADVOCACY",
    href: "#advocacy"
  },
  {
    label: "ABOUT PSA",
    dropdown: [
      { label: "Our Mission", href: "#mission" },
      { label: "Who We Are", href: "#team" },
      { label: "Partner Airlines", href: "#partners" },
      { label: "Contact", href: "#contact" }
    ]
  }
];

export default function ALPAStyleHero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Alert Banner - ALPA Style */}
      <div className="bg-[#c41e3a] text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="hidden md:inline font-bold text-sm uppercase tracking-wider">
                PILOT ADVOCACY ALERT
              </span>
              <span className="text-sm">
                {alertBanner.message}
              </span>
            </div>
            <a 
              href={alertBanner.link}
              className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:underline whitespace-nowrap"
            >
              {alertBanner.cta}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation - ALPA Style */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo - PSA Style */}
            <a href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#1e3a5f] rounded-full flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div className="text-xl font-bold tracking-tight">
                <span className="text-[#1e3a5f]">pilot</span>
                <span className="text-[#c41e3a]">shortage</span>
                <span className="text-[#1e3a5f]">.org</span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <div 
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.dropdown ? (
                    <button className="flex items-center gap-1 text-sm font-bold text-[#1e3a5f] uppercase tracking-wider hover:text-[#c41e3a] transition-colors py-2">
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <a 
                      href={item.href || "#"}
                      className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wider hover:text-[#c41e3a] transition-colors"
                    >
                      {item.label}
                    </a>
                  )}
                  
                  {/* Dropdown */}
                  {item.dropdown && activeDropdown === item.label && (
                    <div className="absolute top-full left-0 bg-white border border-gray-200 shadow-lg rounded-b-lg py-2 min-w-[200px]">
                      {item.dropdown.map((subItem) => (
                        <a
                          key={subItem.label}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#c41e3a] transition-colors"
                        >
                          {subItem.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <a 
                href="#verify" 
                className="flex items-center gap-2 text-sm font-bold text-[#1e3a5f] hover:text-[#c41e3a] transition-colors"
              >
                <Shield className="w-4 h-4" />
                VERIFY
              </a>
              <a 
                href="#join" 
                className="bg-[#c41e3a] hover:bg-[#a31830] text-white font-bold py-2.5 px-6 rounded text-sm uppercase tracking-wider transition-colors"
              >
                JOIN PSA
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 text-[#1e3a5f]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 py-4">
              {navItems.map((item) => (
                <div key={item.label} className="py-2 border-b border-gray-100 last:border-0">
                  {item.dropdown ? (
                    <div>
                      <div className="font-bold text-[#1e3a5f] uppercase tracking-wider py-2">
                        {item.label}
                      </div>
                      <div className="pl-4 space-y-2">
                        {item.dropdown.map((subItem) => (
                          <a
                            key={subItem.label}
                            href={subItem.href}
                            className="block py-1 text-sm text-gray-600 hover:text-[#c41e3a]"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {subItem.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <a 
                      href={item.href || "#"}
                      className="block font-bold text-[#1e3a5f] uppercase tracking-wider py-2 hover:text-[#c41e3a]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  )}
                </div>
              ))}
              <div className="pt-4 space-y-3">
                <a 
                  href="#verify" 
                  className="flex items-center justify-center gap-2 w-full py-3 border border-[#1e3a5f] text-[#1e3a5f] font-bold rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Shield className="w-4 h-4" />
                  VERIFY CREDENTIALS
                </a>
                <a 
                  href="#join" 
                  className="block w-full py-3 bg-[#c41e3a] text-white font-bold rounded text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  JOIN PSA
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Hero Section - ALPA Style Split Layout */}
      <div className="relative bg-gradient-to-br from-[#0a1628] via-[#1e3a5f] to-[#0a1628] min-h-[700px] flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(196, 30, 58, 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, rgba(30, 58, 95, 0.3) 0%, transparent 50%)`
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-[#c41e3a] rounded-full animate-pulse"></span>
                <span className="text-sm font-bold uppercase tracking-wider">
                  Pilots Run This, Not Corporations
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                There Is No
                <br />
                <span className="text-[#c41e3a]">Pilot Shortage.</span>
                <br />
                <span className="text-3xl md:text-4xl lg:text-5xl text-gray-300">
                  There Is A Clogged Pipeline.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl text-gray-300 mb-8 max-w-xl leading-relaxed">
                Thousands of qualified pilots sit stranded for years while airlines 
                complain about a "shortage." We're here to unclog the system.
              </p>

              {/* The Three-Step Loop - Horizontal */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center">
                  <div className="w-8 h-8 bg-[#c41e3a] rounded-full flex items-center justify-center mx-auto mb-2">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Step 1</div>
                  <div className="text-sm font-semibold">Share Story</div>
                  <div className="text-xs text-gray-400 mt-1">Free</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-[#c41e3a]/30 rounded-lg p-4 text-center ring-1 ring-[#c41e3a]/20">
                  <div className="w-8 h-8 bg-[#c41e3a] rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#c41e3a] mb-1">Step 2</div>
                  <div className="text-sm font-semibold">Verify</div>
                  <div className="text-xs text-gray-400 mt-1">$99/yr</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center">
                  <div className="w-8 h-8 bg-[#c41e3a] rounded-full flex items-center justify-center mx-auto mb-2">
                    <Plane className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Step 3</div>
                  <div className="text-sm font-semibold">Demand Pathways</div>
                  <div className="text-xs text-gray-400 mt-1">Collective</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#share-story"
                  className="inline-flex items-center justify-center gap-2 bg-[#c41e3a] hover:bg-[#a31830] text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
                >
                  Share Your Story
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="#learn-more"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg border border-white/30"
                >
                  See The Evidence
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 text-xs">✓</span>
                  </span>
                  100% Free Membership
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 text-xs">✓</span>
                  </span>
                  Identity Protected
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 text-xs">✓</span>
                  </span>
                  Verified Pilots Only
                </span>
              </div>
            </div>

            {/* Right Content - Visual Element */}
            <div className="hidden lg:block relative">
              {/* Pilot Silhouette / Abstract Representation */}
              <div className="relative">
                {/* Main Visual Container */}
                <div className="bg-gradient-to-br from-[#1e3a5f]/50 to-[#0a1628]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="text-3xl font-bold text-[#c41e3a]">15,000+</div>
                      <div className="text-sm text-gray-400">Stranded Pilots</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="text-3xl font-bold text-white">$50K-$200K</div>
                      <div className="text-sm text-gray-400">Training Investment</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="text-3xl font-bold text-white">2-4+ Years</div>
                      <div className="text-sm text-gray-400">Average Wait Time</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="text-3xl font-bold text-[#c41e3a]">Zero</div>
                      <div className="text-sm text-gray-400">Clear Pathways</div>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="bg-[#c41e3a]/10 border-l-4 border-[#c41e3a] rounded-r-lg p-4">
                    <p className="text-gray-300 italic text-sm leading-relaxed">
                      "I didn't fly 4,000 miles, risk everything I have for my career, wear my pilot 
                      uniform with three bars, just to be treated like a number."
                    </p>
                    <p className="text-[#c41e3a] text-xs font-semibold mt-2">
                      — user:flybravo, Commercial Pilot, 200 hours
                    </p>
                  </div>

                  {/* Partner Logos */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                      Coalition Partners
                    </p>
                    <div className="flex items-center gap-4 opacity-60">
                      <div className="text-white font-bold text-sm">pilotrecognition.com</div>
                      <div className="text-gray-400">•</div>
                      <div className="text-white font-bold text-sm">pilotcareerpathways.com</div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#c41e3a]/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#1e3a5f]/30 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
