'use client';

import React from 'react';
import { Link } from 'react-router-dom';

export default function CargoPathwaysPage() {
  const cargoPathways = [
    {
      airline: 'FedEx Express',
      title: 'First Officer - Boeing 767 Fleet',
      location: 'Memphis, TN / Global Hubs',
      salary: '$95,000 - $125,000',
      requirements: { hours: 1500, license: 'ATPL', score: 70 },
      benefits: ['Rapid upgrade to Captain (2-3 years)', 'Home base flexibility', 'Guaranteed hours'],
      spots: 15
    },
    {
      airline: 'UPS Airlines',
      title: 'First Officer - MD-11 / 747 Fleet',
      location: 'Louisville, KY / Worldport',
      salary: '$98,000 - $130,000',
      requirements: { hours: 1500, license: 'ATPL', score: 72 },
      benefits: ['Top-tier benefits package', 'Strong union representation', 'Stable cargo market'],
      spots: 12
    },
    {
      airline: 'DHL Aviation',
      title: 'First Officer - A300 / B757',
      location: 'Leipzig, Germany / Global Network',
      salary: '€75,000 - €95,000',
      requirements: { hours: 1500, license: 'EASA ATPL', score: 68 },
      benefits: ['European base options', 'International routes', 'Fast-track command'],
      spots: 8
    },
    {
      airline: 'Amazon Air',
      title: 'First Officer - B767 / A330',
      location: 'Cincinnati, OH / Multiple Bases',
      salary: '$90,000 - $115,000',
      requirements: { hours: 1500, license: 'ATPL', score: 65 },
      benefits: ['Growing fleet', 'Modern aircraft', 'Technology-focused'],
      spots: 20
    },
    {
      airline: 'Atlas Air',
      title: 'First Officer - 747 / 777 Freighter',
      location: 'Purchase, NY / Worldwide',
      salary: '$100,000 - $140,000',
      requirements: { hours: 2000, license: 'ATPL', score: 75 },
      benefits: ['Heavy jet experience', 'Global destinations', 'Premium pay rates'],
      spots: 10
    },
    {
      airline: 'Cargolux',
      title: 'First Officer - 747-8F',
      location: 'Luxembourg / Europe Hub',
      salary: '€85,000 - €110,000',
      requirements: { hours: 1500, license: 'EASA ATPL', score: 70 },
      benefits: ['All-cargo specialist', 'European lifestyle', 'Quality of life'],
      spots: 6
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Coded by Benjamin Bowler */}
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">📦</span>
            <span className="text-purple-200 text-sm font-semibold uppercase tracking-wide">Cargo Operations</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cargo & Freight Pathways
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl">
            No passengers. No jet bridges. Just pure flying. High pay, stable schedules, 
            and rapid captain upgrades. The cargo sector is booming.
          </p>
        </div>
      </div>

      {/* Why Cargo Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Higher Pay</h3>
            <p className="text-sm text-gray-600">
              Cargo pilots often earn 10-20% more than passenger airline equivalents. 
              Premium pay for overnight and international routes.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Fast Upgrade</h3>
            <p className="text-sm text-gray-600">
              Rapid progression to Captain. Most cargo carriers upgrade in 2-3 years vs 
              5-8 years at major passenger airlines.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🏠</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Better Schedule</h3>
            <p className="text-sm text-gray-600">
              Multiple days off between trips. No airport hassles. Many cargo pilots 
              work week-on/week-off patterns.
            </p>
          </div>
        </div>
      </div>

      {/* Pathway Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Active Cargo Pathways</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {cargoPathways.map((pathway, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{pathway.airline}</h3>
                    <p className="text-slate-300">{pathway.title}</p>
                  </div>
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {pathway.spots} spots
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-gray-600 text-sm mb-4">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {pathway.location}
                </div>
                
                <div className="flex justify-between items-center mb-4 p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Salary Range</span>
                  <span className="text-green-700 font-bold">{pathway.salary}</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-500 font-semibold">Requirements:</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{pathway.requirements.hours}+ hours</span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{pathway.requirements.license}</span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Score {pathway.requirements.score}+</span>
                  </div>
                </div>
                
                <div className="space-y-1 mb-4">
                  {pathway.benefits.map((benefit, bIdx) => (
                    <div key={bIdx} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {benefit}
                    </div>
                  ))}
                </div>
                
                <Link 
                  to="/discover-pathways"
                  className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready for No-Passenger Flying?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Cargo is the fastest-growing aviation sector. Higher pay, better schedules, 
            and rapid career progression.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/discover-pathways"
              className="bg-white text-purple-700 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg transition-colors"
            >
              Explore All Pathways →
            </Link>
            <Link 
              to="/programs"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              Upgrade Your Score
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
