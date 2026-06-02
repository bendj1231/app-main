'use client';

import React, { useState, useEffect, Suspense, lazy } from 'react';

// Region type definition
type Region = {
  code: string;
  name: string;
  flag: string;
  currency: string;
  price: string;
};

const regions: Region[] = [
  { code: 'en-ph', name: 'Philippines', flag: '🇵🇭', currency: 'PHP', price: 'Free' },
  { code: 'en-us', name: 'United States', flag: '🇺🇸', currency: 'USD', price: 'Free' },
  { code: 'en-gb', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', price: 'Free' },
  { code: 'en-au', name: 'Australia', flag: '🇦🇺', currency: 'AUD', price: 'Free' },
  { code: 'en-ca', name: 'Canada', flag: '🇨🇦', currency: 'CAD', price: 'Free' },
  { code: 'en-sg', name: 'Singapore', flag: '🇸🇬', currency: 'SGD', price: 'Free' },
  { code: 'en-ae', name: 'UAE', flag: '🇦🇪', currency: 'AED', price: 'Free' },
];

// Loading screen specific to pilotshortage.org
const ShortageLoadingScreen = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center">
    <div className="w-16 h-16 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mb-6"></div>
    <h2 className="text-2xl font-bold tracking-tight">
      <span className="text-black">pilot</span>
      <span className="text-red-500">shortage</span>
      <span className="text-black">.org</span>
    </h2>
    <p className="text-gray-500 text-sm mt-2">Loading...</p>
  </div>
);

// Region Picker Component
const RegionPicker = ({ currentRegion, onRegionChange }: { currentRegion: Region; onRegionChange: (region: Region) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
      >
        <span>{currentRegion.flag}</span>
        <span className="text-gray-700">{currentRegion.name}</span>
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {regions.map((region) => (
            <button
              key={region.code}
              onClick={() => {
                onRegionChange(region);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 ${
                region.code === currentRegion.code ? 'bg-gray-50' : ''
              }`}
            >
              <span>{region.flag}</span>
              <span className="text-gray-700">{region.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Navigation dropdown items - now linking to dedicated pages
const navDropdownItems = {
  about: [
    { label: 'Our Mission', href: '/pilotshortage/about' },
    { label: 'The Four-Floor Tower', href: '/pilotshortage/about#four-floors' },
    { label: 'Who We Are', href: '/pilotshortage/about#who-we-are' }
  ],
  benefits: [
    { label: 'Verified Stories', href: '/pilotshortage/join' },
    { label: 'Member Benefits', href: '/pilotshortage/benefits' },
    { label: 'Join PSA', href: '/pilotshortage/join' }
  ],
  advocacy: [
    { label: 'Policy Positions', href: '/pilotshortage/advocacy' },
    { label: '1,500-Hour Rule', href: '/pilotshortage/advocacy#1500-rule' },
    { label: 'Latest News', href: '/pilotshortage/news' },
    { label: 'Submit Your Story', href: '/pilotshortage/join' }
  ],
  ucf: [
    { label: 'Hub F - Foundation', href: '/pilotshortage/ucf#pillar-foundation-program' },
    { label: 'Hub A - Operators', href: '/pilotshortage/ucf#part-ii-hub-a' },
    { label: 'Hub D - Infrastructure', href: '/pilotshortage/ucf#hub-d-infrastructure' },
    { label: 'Full Framework', href: '/pilotshortage/ucf#document-information' }
  ]
};

// Custom Navbar for pilotshortage.org
const ShortageNavbar = ({ onNavigate, currentRegion, onRegionChange }: {
  onNavigate: (page: string) => void;
  currentRegion: Region;
  onRegionChange: (region: Region) => void;
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="bg-white text-black border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Text Only, pilotshortage.org style */}
          <a href="/pilotshortage" className="text-2xl font-bold tracking-tight">
            <span className="text-black">pilot</span>
            <span className="text-red-500">shortage</span>
            <span className="text-black">.org</span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            {/* About PSA Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('about')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a
                href="/pilotshortage/about"
                className="flex items-center gap-1 text-gray-700 hover:text-red-500 text-sm font-medium uppercase tracking-wide transition-colors py-2"
              >
                About PSA
                <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'about' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              {activeDropdown === 'about' && (
                <div className="absolute top-full left-0 bg-white border border-gray-200 shadow-lg rounded-lg py-2 min-w-[200px]">
                  {navDropdownItems.about.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Member Benefits Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('benefits')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a
                href="/pilotshortage/benefits"
                className="flex items-center gap-1 text-gray-700 hover:text-red-500 text-sm font-medium uppercase tracking-wide transition-colors py-2"
              >
                Member Benefits
                <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'benefits' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              {activeDropdown === 'benefits' && (
                <div className="absolute top-full left-0 bg-white border border-gray-200 shadow-lg rounded-lg py-2 min-w-[200px]">
                  {navDropdownItems.benefits.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Advocacy Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('advocacy')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a
                href="/pilotshortage/advocacy"
                className="flex items-center gap-1 text-gray-700 hover:text-red-500 text-sm font-medium uppercase tracking-wide transition-colors py-2"
              >
                Advocacy
                <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'advocacy' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              {activeDropdown === 'advocacy' && (
                <div className="absolute top-full left-0 bg-white border border-gray-200 shadow-lg rounded-lg py-2 min-w-[220px]">
                  {navDropdownItems.advocacy.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* UCF Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('ucf')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a
                href="/pilotshortage/ucf"
                className="flex items-center gap-1 text-gray-700 hover:text-red-500 text-sm font-medium uppercase tracking-wide transition-colors py-2"
              >
                UCF
                <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'ucf' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              {activeDropdown === 'ucf' && (
                <div className="absolute top-full left-0 bg-white border border-gray-200 shadow-lg rounded-lg py-2 min-w-[200px]">
                  {navDropdownItems.ucf.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* News - No dropdown */}
            <a
              href="/pilotshortage/news"
              className="text-gray-700 hover:text-red-500 text-sm font-medium uppercase tracking-wide transition-colors py-2"
            >
              News
            </a>

            {/* Wallet - Anonymous verification */}
            <a
              href="/pilotshortage/wallet"
              className="flex items-center gap-1 text-gray-700 hover:text-red-500 text-sm font-medium uppercase tracking-wide transition-colors py-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Wallet
            </a>

            {/* Coalition - No dropdown */}
            <a
              href="/pilotshortage/coalition"
              className="text-gray-700 hover:text-red-500 text-sm font-medium uppercase tracking-wide transition-colors py-2"
            >
              Coalition
            </a>

            <RegionPicker currentRegion={currentRegion} onRegionChange={onRegionChange} />
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
  );
};

// Main content component
const ShortageLanding = lazy(() => import('../shortage1/ConnectingPilotsHero').then(m => ({ default: m.default })));

export default function ShortageApp() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home');
  const [currentRegion, setCurrentRegion] = useState<Region>(regions[0]);

  useEffect(() => {
    // Detect region from URL path or default to first region
    const path = window.location.pathname;
    const regionCode = path.split('/')[1];
    const detectedRegion = regions.find(r => r.code === regionCode);
    if (detectedRegion) {
      setCurrentRegion(detectedRegion);
    }
    
    // Simulate loading time for the "app" feel
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleRegionChange = (region: Region) => {
    setCurrentRegion(region);
    // Update URL without page reload
    const newPath = `/${region.code}${window.location.search}`;
    window.history.pushState({}, '', newPath);
  };

  const handleNavigate = (page: string) => {
// [AUDIT] Removed console.log // line 324
    setCurrentView(page);
    // In full implementation, this would route to different views
  };

  if (isLoading) {
    return <ShortageLoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-white">
      <ShortageNavbar 
        onNavigate={handleNavigate} 
        currentRegion={currentRegion}
        onRegionChange={handleRegionChange}
      />
      
      <Suspense fallback={<ShortageLoadingScreen />}>
        <main>
          <ShortageLanding />
        </main>
      </Suspense>
      
      {/* Footer specific to pilotshortage.org */}
      <footer className="bg-[#1e3a5f] text-white py-12 border-t border-white/10">
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
                <li><a href="#" className="hover:text-white">Our Mission</a></li>
                <li><a href="#" className="hover:text-white">Leadership</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Members</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Join PSA</a></li>
                <li><a href="#" className="hover:text-white">Member Benefits</a></li>
                <li><a href="#" className="hover:text-white">Career Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Industry</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">News & Updates</a></li>
                <li><a href="#" className="hover:text-white">Advocacy</a></li>
                <li><a href="#" className="hover:text-white">Airline Partners</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 pilotshortage.org. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
