'use client';

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface Pathway {
  id: string;
  airline: string;
  title: string;
  type: 'Cadet' | 'Cargo' | 'Charter' | 'Corporate' | 'Commercial';
  location: string;
  salary: string;
  requirements: {
    minHours: number;
    licenseType: string;
    minScore: number;
  };
  benefits: string[];
  spotsAvailable: number;
  deadline?: string;
}

const allPathways: Pathway[] = [
  {
    id: 'etihad-cadet-2026',
    airline: 'Etihad Airways',
    title: 'Cadet Pilot Program 2026',
    type: 'Cadet',
    location: 'Abu Dhabi, UAE',
    salary: 'Full Scholarship + Salary',
    requirements: { minHours: 0, licenseType: 'Student', minScore: 30 },
    benefits: ['Full scholarship', 'Guaranteed employment', 'A320 type rating'],
    spotsAvailable: 24,
    deadline: '2026-06-30'
  },
  {
    id: 'fedex-cargo-first-officer',
    airline: 'FedEx Express',
    title: 'First Officer - Boeing 767 Fleet',
    type: 'Cargo',
    location: 'Memphis, TN',
    salary: '$95,000 - $125,000',
    requirements: { minHours: 1500, licenseType: 'ATPL', minScore: 70 },
    benefits: ['Rapid captain upgrade', 'Home base flexibility', 'Guaranteed hours'],
    spotsAvailable: 15
  },
  {
    id: 'vista-corporate-pilot',
    airline: 'VistaJet',
    title: 'Corporate Pilot - Challenger 350',
    type: 'Corporate',
    location: 'Global / Flexible Base',
    salary: '$180,000 - $250,000',
    requirements: { minHours: 3000, licenseType: 'ATPL', minScore: 80 },
    benefits: ['20/10 schedule', 'Global destinations', 'Luxury accommodation'],
    spotsAvailable: 8
  },
  {
    id: 'netjets-charter',
    airline: 'NetJets',
    title: 'First Officer - Phenom 300',
    type: 'Charter',
    location: 'Columbus, OH / 200+ Bases',
    salary: '$85,000 - $110,000',
    requirements: { minHours: 1500, licenseType: 'ATPL', minScore: 65 },
    benefits: ['Fractional ownership model', 'Schedule flexibility', 'Diverse aircraft'],
    spotsAvailable: 25
  },
  {
    id: 'emirates-commercial',
    airline: 'Emirates',
    title: 'First Officer - A380 / B777',
    type: 'Commercial',
    location: 'Dubai, UAE',
    salary: '$80,000 - $120,000',
    requirements: { minHours: 2000, licenseType: 'ATPL', minScore: 75 },
    benefits: ['Tax-free salary', 'Company accommodation', 'Global network'],
    spotsAvailable: 50
  },
  {
    id: 'dubai-credential-philippines',
    airline: 'Dubai Training Partnership',
    title: 'PRC → UAE Credential Upgrade',
    type: 'Cadet',
    location: 'Remote + Fujairah, UAE',
    salary: '₱153,000 (44% savings)',
    requirements: { minHours: 200, licenseType: 'CPL', minScore: 25 },
    benefits: ['UAE-recognized certification', 'Visa included', 'Priority airline access'],
    spotsAvailable: 12,
    deadline: '2026-07-15'
  },
  {
    id: 'google-corporate',
    airline: 'Google (Alphabet)',
    title: 'Captain - G650 / G550 Fleet',
    type: 'Corporate',
    location: 'Mountain View, CA',
    salary: '$200,000 - $280,000',
    requirements: { minHours: 4000, licenseType: 'ATPL', minScore: 85 },
    benefits: ['Tech industry benefits', 'Stock options', 'Premium equipment'],
    spotsAvailable: 4
  },
  {
    id: 'ups-cargo',
    airline: 'UPS Airlines',
    title: 'First Officer - MD-11 / 747 Fleet',
    type: 'Cargo',
    location: 'Louisville, KY',
    salary: '$98,000 - $130,000',
    requirements: { minHours: 1500, licenseType: 'ATPL', minScore: 72 },
    benefits: ['Top-tier benefits', 'Strong union', 'Stable cargo market'],
    spotsAvailable: 12
  }
];

export default function DiscoverPathwaysPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [minHours, setMinHours] = useState<number>(0);
  const [savedPathways, setSavedPathways] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const filteredPathways = useMemo(() => {
    return allPathways.filter(pathway => {
      const matchesSearch = 
        pathway.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pathway.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pathway.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType === 'All' || pathway.type === selectedType;
      const matchesLocation = selectedLocation === 'All' || 
        (selectedLocation === 'North America' && (pathway.location.includes('USA') || pathway.location.includes('CA') || pathway.location.includes('OH') || pathway.location.includes('TN') || pathway.location.includes('KY'))) ||
        (selectedLocation === 'Middle East' && pathway.location.includes('UAE')) ||
        (selectedLocation === 'Europe' && (pathway.location.includes('Europe') || pathway.location.includes('UK') || pathway.location.includes('Germany'))) ||
        (selectedLocation === 'Asia-Pacific' && (pathway.location.includes('Asia') || pathway.location.includes('Philippines') || pathway.location.includes('Singapore')));
      
      const matchesHours = pathway.requirements.minHours >= minHours;
      
      return matchesSearch && matchesType && matchesLocation && matchesHours;
    });
  }, [searchQuery, selectedType, selectedLocation, minHours]);

  const toggleSave = (id: string) => {
    setSavedPathways(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleCompare = (id: string) => {
    if (compareList.includes(id)) {
      setCompareList(prev => prev.filter(p => p !== id));
    } else if (compareList.length < 3) {
      setCompareList(prev => [...prev, id]);
    }
  };

  const comparingPathways = allPathways.filter(p => compareList.includes(p.id));

  return (
        {/* Coded by Benjamin Bowler */}
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Your Pathway</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            {allPathways.length}+ active pathways. Filter by type, location, and requirements. 
            Save favorites. Compare side-by-side.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search airlines, locations, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            
            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="All">All Types</option>
              <option value="Cadet">Cadet Programs</option>
              <option value="Cargo">Cargo</option>
              <option value="Charter">Charter</option>
              <option value="Corporate">Corporate</option>
              <option value="Commercial">Commercial Airlines</option>
            </select>
            
            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="All">All Locations</option>
              <option value="North America">North America</option>
              <option value="Middle East">Middle East</option>
              <option value="Europe">Europe</option>
              <option value="Asia-Pacific">Asia-Pacific</option>
            </select>
          </div>
          
          {/* Min Hours Slider */}
          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm text-gray-600">Min Flight Hours:</span>
            <input
              type="range"
              min="0"
              max="4000"
              step="100"
              value={minHours}
              onChange={(e) => setMinHours(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-medium w-20">{minHours}+ hrs</span>
          </div>
          
          {/* Stats */}
          <div className="mt-4 flex items-center gap-6 text-sm">
            <span className="text-gray-600">Showing {filteredPathways.length} pathways</span>
            {savedPathways.length > 0 && (
              <span className="text-blue-600">{savedPathways.length} saved</span>
            )}
            {compareList.length > 0 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Compare {compareList.length} selected
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pathway Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPathways.map((pathway) => (
            <div key={pathway.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    pathway.type === 'Cargo' ? 'bg-purple-100 text-purple-800' :
                    pathway.type === 'Charter' ? 'bg-amber-100 text-amber-800' :
                    pathway.type === 'Corporate' ? 'bg-blue-100 text-blue-800' :
                    pathway.type === 'Cadet' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {pathway.type}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleSave(pathway.id)}
                      className={`p-1 rounded ${savedPathways.includes(pathway.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                      title="Save pathway"
                    >
                      ♥
                    </button>
                    <button
                      onClick={() => toggleCompare(pathway.id)}
                      disabled={!compareList.includes(pathway.id) && compareList.length >= 3}
                      className={`p-1 rounded ${compareList.includes(pathway.id) ? 'text-green-500' : compareList.length >= 3 ? 'text-gray-300' : 'text-gray-400 hover:text-green-500'}`}
                      title={compareList.length >= 3 && !compareList.includes(pathway.id) ? 'Max 3 for comparison' : 'Compare'}
                    >
                      ⚖️
                    </button>
                  </div>
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 mb-1">{pathway.airline}</h3>
                <p className="text-gray-600 text-sm mb-3">{pathway.title}</p>
                
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  📍 {pathway.location}
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  <p className="text-sm text-gray-600">Salary: <span className="font-semibold text-gray-900">{pathway.salary}</span></p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{pathway.requirements.minHours}+ hrs</span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Score {pathway.requirements.minScore}+</span>
                  {pathway.spotsAvailable < 15 && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">🔥 {pathway.spotsAvailable} spots</span>
                  )}
                </div>
                
                <Link
                  to={`/pathways/${pathway.id}`}
                  className="block w-full text-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {filteredPathways.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No pathways match your filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('All');
                setSelectedLocation('All');
                setMinHours(0);
              }}
              className="mt-4 text-red-600 hover:text-red-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Compare Modal */}
      {showCompareModal && comparingPathways.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold">Compare Pathways</h2>
              <button
                onClick={() => setShowCompareModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className={`grid gap-4 ${comparingPathways.length === 2 ? 'grid-cols-2' : comparingPathways.length === 3 ? 'grid-cols-3' : 'grid-cols-1'}`}>
                {comparingPathways.map((pathway) => (
                  <div key={pathway.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-bold text-lg mb-1">{pathway.airline}</h3>
                    <p className="text-sm text-gray-600 mb-3">{pathway.title}</p>
                    
                    <div className="space-y-2 text-sm">
                      <p><strong>Type:</strong> {pathway.type}</p>
                      <p><strong>Location:</strong> {pathway.location}</p>
                      <p><strong>Salary:</strong> {pathway.salary}</p>
                      <p><strong>Min Hours:</strong> {pathway.requirements.minHours}</p>
                      <p><strong>Min Score:</strong> {pathway.requirements.minScore}</p>
                      <p><strong>Spots:</strong> {pathway.spotsAvailable}</p>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-sm font-semibold mb-1">Benefits:</p>
                      <ul className="text-sm text-gray-600">
                        {pathway.benefits.slice(0, 3).map((b, i) => (
                          <li key={i}>• {b}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
