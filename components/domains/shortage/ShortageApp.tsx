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

// Custom Navbar for pilotshortage.org
const ShortageNavbar = ({ onNavigate, currentRegion, onRegionChange }: { 
  onNavigate: (page: string) => void;
  currentRegion: Region;
  onRegionChange: (region: Region) => void;
}) => (
  <nav className="bg-white text-black border-b border-gray-200 sticky top-0 z-50">
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        {/* Logo - Text Only, pilotshortage.org style */}
        <div className="text-2xl font-bold tracking-tight">
          <span className="text-black">pilot</span>
          <span className="text-red-500">shortage</span>
          <span className="text-black">.org</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => onNavigate('about')} className="text-gray-700 hover:text-red-500 text-sm font-medium uppercase tracking-wide transition-colors">
            About PSA
          </button>
          <button onClick={() => onNavigate('benefits')} className="text-gray-700 hover:text-red-500 text-sm font-medium uppercase tracking-wide transition-colors">
            Member Benefits
          </button>
          <button onClick={() => onNavigate('advocacy')} className="text-gray-700 hover:text-red-500 text-sm font-medium uppercase tracking-wide transition-colors">
            Advocacy
          </button>
          <button 
            onClick={() => document.getElementById('psa-ucf')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-gray-700 hover:text-red-500 text-sm font-medium uppercase tracking-wide transition-colors"
          >
            UCF
          </button>
          <button onClick={() => onNavigate('news')} className="text-gray-700 hover:text-red-500 text-sm font-medium uppercase tracking-wide transition-colors">
            News
          </button>
          <RegionPicker currentRegion={currentRegion} onRegionChange={onRegionChange} />
          <button 
            onClick={() => onNavigate('join')}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded font-bold text-sm uppercase tracking-wide transition-colors"
          >
            Join PSA
          </button>
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

// Main content component
const ShortageLanding = lazy(() => import('./ShortageLanding').then(m => ({ default: m.default })));

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
    console.log('Navigate to:', page);
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
