'use client';

import { useState, useEffect } from 'react';
import { type DomainBrand } from '@/lib/domain';

export default function DomainSwitcher() {
  const [currentBrand, setCurrentBrand] = useState<DomainBrand>('recognition');
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    // Check if we're in development
    setIsDev(window.location.hostname === 'localhost' || window.location.hostname.includes('vercel.app'));
    
    // Get current brand from localStorage
    const stored = localStorage.getItem('brand_override') as DomainBrand | null;
    if (stored) {
      setCurrentBrand(stored);
    }
  }, []);

  const handleSwitch = (brand: DomainBrand) => {
    localStorage.setItem('brand_override', brand);
    setCurrentBrand(brand);
    window.location.reload();
  };

  // Only show in development
  if (!isDev) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-xl border border-gray-700">
      <div className="font-bold mb-2 text-gray-400">DEV: Domain Switcher</div>
      <div className="flex gap-2">
        <button
          onClick={() => handleSwitch('shortage')}
          className={`px-3 py-1 rounded ${
            currentBrand === 'shortage' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          pilotshortage.org
        </button>
        <button
          onClick={() => handleSwitch('recognition')}
          className={`px-3 py-1 rounded ${
            currentBrand === 'recognition' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          pilotrecognition.com
        </button>
      </div>
      <div className="mt-2 text-gray-500">
        Current: <span className="text-white uppercase">{currentBrand}</span>
      </div>
    </div>
  );
}
