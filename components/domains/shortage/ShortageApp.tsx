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
  { code: 'en-ph', name: 'Philippines', flag: '🇵🇭', currency: 'PHP', price: '₱1,500' },
  { code: 'en-us', name: 'United States', flag: '🇺🇸', currency: 'USD', price: '$99' },
  { code: 'en-gb', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', price: '£79' },
  { code: 'en-au', name: 'Australia', flag: '🇦🇺', currency: 'AUD', price: '$149' },
  { code: 'en-ca', name: 'Canada', flag: '🇨🇦', currency: 'CAD', price: '$129' },
  { code: 'en-sg', name: 'Singapore', flag: '🇸🇬', currency: 'SGD', price: '$149' },
  { code: 'en-ae', name: 'UAE', flag: '🇦🇪', currency: 'AED', price: '₵450' },
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
  <nav className="bg-white text-black border-b border-gray-200">
    <div className="container mx-auto px-4 py-4">
      {/* Top row - Region Picker */}
      <div className="flex justify-end mb-2">
        <RegionPicker currentRegion={currentRegion} onRegionChange={onRegionChange} />
      </div>
      
      {/* Main navbar row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold tracking-tight">
            <span className="text-black">pilot</span>
            <span className="text-red-500">shortage</span>
            <span className="text-gray-500">.org</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6 text-sm">
          <button onClick={() => onNavigate('about')} className="hover:text-red-500 transition-colors text-gray-700">About</button>
          <button onClick={() => onNavigate('membership')} className="hover:text-red-500 transition-colors text-gray-700">Membership</button>
          <button onClick={() => onNavigate('pathways')} className="hover:text-red-500 transition-colors text-gray-700">Pathways</button>
          <button onClick={() => onNavigate('contact')} className="hover:text-red-500 transition-colors text-gray-700">Contact</button>
          <button 
            onClick={() => onNavigate('join')}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Join Now
          </button>
        </div>
        
        {/* Mobile menu button */}
        <button className="md:hidden p-2 hover:text-red-500 text-gray-700">
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
          <ShortageLanding region={currentRegion} />
        </main>
      </Suspense>
      
      {/* Footer specific to pilotshortage.org */}
      <footer className="bg-gray-50 text-gray-600 py-8 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-black mb-2">
                <span className="text-black">pilot</span>
                <span className="text-red-500">shortage</span>
                <span className="text-gray-500">.org</span>
              </h4>
              <p className="text-gray-600">Solving the global pilot shortage through verified connections.</p>
            </div>
            <div>
              <h4 className="font-semibold text-black mb-2">Contact</h4>
              <p className="text-gray-600">info@pilotshortage.org</p>
            </div>
            <div>
              <h4 className="font-semibold text-black mb-2">Legal</h4>
              <p className="text-gray-600">&copy; 2026 pilotshortage.org. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
