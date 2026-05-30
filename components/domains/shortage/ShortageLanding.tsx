'use client';

import { useState } from 'react';
import { getBrandFromLocalStorage, setBrandOverride, type DomainBrand } from '@/lib/domain';

export default function ShortageLanding() {
  const [brand, setBrand] = useState<DomainBrand>(getBrandFromLocalStorage());

  const handleBrandSwitch = (newBrand: DomainBrand) => {
    setBrandOverride(newBrand);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 via-blue-700 to-red-600">
      {/* Domain Switcher - For Development/Testing */}
      <div className="bg-black/50 text-white text-xs py-2 px-4 flex justify-between items-center">
        <span>Current Brand: <strong className="uppercase">{brand}</strong></span>
        <div className="flex gap-2">
          <button 
            onClick={() => handleBrandSwitch('shortage')}
            className={`px-3 py-1 rounded ${brand === 'shortage' ? 'bg-blue-500' : 'bg-gray-700'}`}
          >
            pilotshortage.org
          </button>
          <button 
            onClick={() => handleBrandSwitch('recognition')}
            className={`px-3 py-1 rounded ${brand === 'recognition' ? 'bg-indigo-500' : 'bg-gray-700'}`}
          >
            pilotrecognition.com
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 text-center text-white">
        <div className="inline-block bg-yellow-400 text-red-700 px-4 py-1 rounded-full text-sm font-bold mb-6">
          🇵🇭 Philippines Focused
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          The Pilot Shortage Association
        </h1>
        <p className="text-2xl md:text-3xl mb-4 text-blue-100">
          Solving the Philippines Pilot Shortage
        </p>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-50">
          Join 100 Founding Members. Get verified. Get connected. Get hired.
        </p>
        
        {/* Pricing Card */}
        <div className="bg-white text-gray-900 rounded-2xl p-8 max-w-md mx-auto shadow-2xl">
          <div className="text-blue-600 font-bold text-lg mb-2">Founding Member</div>
          <div className="text-4xl font-bold text-gray-900 mb-2">
            ₱1,500<span className="text-lg text-gray-500">/year</span>
          </div>
          <p className="text-sm text-gray-600 mb-6">Limited to first 100 members</p>
          
          <ul className="text-left text-sm space-y-3 mb-6">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> CAAP License Verification
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> NBI Clearance Check
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Member Directory Access
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Direct Airline Pathways
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Community Forum
            </li>
          </ul>
          
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors">
            Join the Association
          </button>
          
          <div className="mt-4 text-xs text-gray-500">
            Payment via GCash or Bank Transfer
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Creating Pathways With</h2>
          <div className="flex flex-wrap justify-center gap-8 opacity-70">
            <div className="text-xl font-bold text-gray-400">WCC Aviation</div>
            <div className="text-xl font-bold text-gray-400">Cebu Pacific</div>
            <div className="text-xl font-bold text-gray-400">Philippine Airlines</div>
            <div className="text-xl font-bold text-gray-400">AirAsia Philippines</div>
          </div>
        </div>
      </div>
    </div>
  );
}
