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
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white text-xs p-4 rounded-lg shadow-xl border border-gray-700">
      <div className="font-bold mb-3 text-gray-400">DEV: Domain Switcher (4 Apps)</div>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleSwitch('recognition')}
          className={`px-3 py-2 rounded ${
            currentBrand === 'recognition'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <div className="font-medium">pilotrecognition.com</div>
          <div className="text-[10px] text-gray-400">Main Platform</div>
        </button>
        <button
          onClick={() => handleSwitch('shortage')}
          className={`px-3 py-2 rounded ${
            currentBrand === 'shortage'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <div className="font-medium">pilotshortage.org</div>
          <div className="text-[10px] text-gray-400">Advocacy/PSA</div>
        </button>
        <button
          onClick={() => handleSwitch('pilotterminal')}
          className={`px-3 py-2 rounded ${
            currentBrand === 'pilotterminal'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <div className="font-medium">pilotterminal.com</div>
          <div className="text-[10px] text-gray-400">Wallet/Identity</div>
        </button>
        <button
          onClick={() => handleSwitch('careerpathways')}
          className={`px-3 py-2 rounded ${
            currentBrand === 'careerpathways'
              ? 'bg-cyan-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <div className="font-medium">pilotcareerpathways.com</div>
          <div className="text-[10px] text-gray-400">Career Pathways</div>
        </button>
      </div>
      <div className="mt-3 pt-2 border-t border-gray-700 text-gray-500">
        Current: <span className="text-white uppercase font-medium">{currentBrand}</span>
      </div>
    </div>
  );
}
