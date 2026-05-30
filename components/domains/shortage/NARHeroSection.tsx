'use client';

import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';

export default function NARHeroSection() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Pilot Advocacy', href: '#' },
    { label: 'Membership', href: '#' },
    { label: 'Research & Data', href: '#' },
    { label: 'Government Relations', href: '#' },
    { label: 'Training', href: '#' },
    { label: 'News & Events', href: '#' },
  ];

  const topLinks = [
    { label: 'PSA Store', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Pay Dues', href: '#' },
    { label: 'Sign In', href: '#' },
  ];

  const newsItems = [
    {
      title: 'Despite Industry Claims, More Qualified Pilots Are Needed',
      hasArrow: true,
    },
    {
      title: 'Regional Hiring Numbers Improve, Major Carriers Lag Behind',
      hasArrow: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* TOP BAR - White background with search */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1e3a5f] rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">PSA</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-[#1e3a5f] font-bold text-sm leading-tight">
                  PILOT SHORTAGE
                </div>
                <div className="text-[#1e3a5f] font-bold text-sm leading-tight">
                  ASSOCIATION
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md mx-4 hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#1e3a5f]"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Top Links */}
            <div className="hidden lg:flex items-center gap-6 text-sm">
              {topLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[#1e3a5f] hover:text-[#c41e3a] font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION BAR - Blue */}
      <nav className="bg-[#1e3a5f]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-white text-sm font-medium px-4 py-2 hover:bg-[#2a4a73] transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* More Dropdown */}
            <div className="hidden lg:block">
              <button className="text-white text-sm font-medium px-4 py-2 hover:bg-[#2a4a73] transition-colors">
                More
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#1e3a5f] border-t border-[#2a4a73]">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block text-white text-sm font-medium py-2 hover:text-gray-300"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative">
        {/* Background Image */}
        <div className="relative h-[500px] md:h-[550px] lg:h-[600px]">
          {/* Image overlay with gradient */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=1920&q=80')`,
            }}
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>

          {/* Content Container */}
          <div className="container mx-auto px-4 relative h-full">
            <div className="flex items-center h-full">
              {/* Left: Hero Text */}
              <div className="max-w-2xl py-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                  Empowering Pilots<br />
                  to preserve, protect, and<br />
                  advance the right to<br />
                  aviation careers for all.
                </h1>
                
                {/* CTA Button */}
                <button className="bg-[#3182ce] hover:bg-[#2c72b5] text-white font-semibold py-3 px-8 rounded-sm transition-colors text-lg">
                  PSA Code of Ethics
                </button>

                {/* Secondary Link */}
                <div className="mt-6">
                  <a 
                    href="#" 
                    className="text-white text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    Learn more about the &quot;Right by You&quot; campaign
                    <span className="text-lg">›</span>
                  </a>
                </div>
              </div>

              {/* Right: News Panel */}
              <div className="hidden lg:block ml-auto">
                <div className="bg-black/60 backdrop-blur-sm rounded-sm overflow-hidden w-[340px]">
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/20">
                    <h3 className="text-white text-xs font-bold uppercase tracking-wider">
                      Latest News & Topics
                    </h3>
                    <a 
                      href="#" 
                      className="text-white text-xs font-medium hover:underline flex items-center gap-1"
                    >
                      More News
                      <span className="text-xs">▲</span>
                    </a>
                  </div>

                  {/* News Items */}
                  <div>
                    {newsItems.map((news, idx) => (
                      <a
                        key={idx}
                        href="#"
                        className="block px-5 py-4 border-b border-white/10 hover:bg-white/10 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-white text-sm font-medium leading-snug group-hover:underline">
                            {news.title}
                          </p>
                          {news.hasArrow && (
                            <span className="text-white/60 text-lg flex-shrink-0">›</span>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUB FOOTER */}
      <div className="bg-white py-6 border-b border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm font-medium tracking-wide uppercase">
            The Pilot Shortage Association
          </p>
        </div>
      </div>
    </div>
  );
}
