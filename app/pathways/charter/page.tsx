'use client';

import React from 'react';
import { Link } from 'react-router-dom';

export default function CharterPathwaysPage() {
  const charterPathways = [
    {
      operator: 'NetJets',
      title: 'First Officer - Phenom 300 / Latitude',
      location: 'Columbus, OH / 200+ Bases',
      salary: '$85,000 - $110,000',
      requirements: { hours: 1500, license: 'ATPL', score: 65 },
      benefits: ['Fractional ownership model', 'Schedule flexibility', 'Diverse aircraft types'],
      spots: 25
    },
    {
      operator: 'Flexjet',
      title: 'First Officer - Challenger / Praetor',
      location: 'Cleveland, OH / Nationwide Bases',
      salary: '$90,000 - $120,000',
      requirements: { hours: 1500, license: 'ATPL', score: 68 },
      benefits: ['Red Label premium service', 'Modern fleet', 'Career advancement'],
      spots: 18
    },
    {
      operator: 'VistaJet',
      title: 'Corporate Pilot - Challenger 350 / Global',
      location: 'Global / No Fixed Base',
      salary: '$180,000 - $250,000',
      requirements: { hours: 3000, license: 'ATPL', score: 80 },
      benefits: ['20/10 schedule', 'Global destinations', 'Luxury accommodation'],
      spots: 8
    },
    {
      operator: 'Air Charter Service',
      title: 'Captain - Various Aircraft',
      location: 'London / Global Charter Network',
      salary: '£70,000 - £100,000',
      requirements: { hours: 2500, license: 'EASA ATPL', score: 75 },
      benefits: ['Command from start', 'Diverse flying', 'Client variety'],
      spots: 12
    },
    {
      operator: 'XOJET',
      title: 'Pilot - Citation / Challenger',
      location: 'Sacramento, CA / West Coast Bases',
      salary: '$95,000 - $125,000',
      requirements: { hours: 1500, license: 'ATPL', score: 70 },
      benefits: ['Tech-forward operations', 'Growth equity', 'Startup culture'],
      spots: 15
    },
    {
      operator: 'Jet Aviation',
      title: 'Line Pilot - Gulfstream / Falcon',
      location: 'Basel, Switzerland / European Bases',
      salary: '€95,000 - €130,000',
      requirements: { hours: 2000, license: 'EASA ATPL', score: 78 },
      benefits: ['Premium clients', 'Long-range aircraft', 'European lifestyle'],
      spots: 10
    }
  ];

  return (
        {/* Coded by Benjamin Bowler */}
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">✈️</span>
            <span className="text-amber-200 text-sm font-semibold uppercase tracking-wide">Charter Aviation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Charter & Private Aviation
          </h1>
          <p className="text-xl text-amber-100 max-w-3xl">
            Fly VIPs, celebrities, and executives. No flight attendants. No scheduled routes. 
            Just you, the aircraft, and premium clients. The ultimate flying job.
          </p>
        </div>
      </div>

      {/* Why Charter Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">👔</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">VIP Clients</h3>
            <p className="text-sm text-gray-600">
              Fly celebrities, CEOs, and high-net-worth individuals. First-class service 
              standards. Direct client relationships.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🗺️</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Diverse Flying</h3>
            <p className="text-sm text-gray-600">
              Different destinations daily. Access to 5,000+ airports vs 500 for airlines. 
              Unique challenges every flight.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💎</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Premium Pay</h3>
            <p className="text-sm text-gray-600">
              Charter pilots earn 30-50% above commercial rates at experienced levels. 
              Tips and bonuses common.
            </p>
          </div>
        </div>
      </div>

      {/* Pathway Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Active Charter Pathways</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {charterPathways.map((pathway, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-amber-600 to-orange-500 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{pathway.operator}</h3>
                    <p className="text-amber-100">{pathway.title}</p>
                  </div>
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
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
                
                <div className="flex justify-between items-center mb-4 p-3 bg-amber-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Salary Range</span>
                  <span className="text-amber-700 font-bold">{pathway.salary}</span>
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
                      <svg className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {benefit}
                    </div>
                  ))}
                </div>
                
                <Link 
                  to="/discover-pathways"
                  className="block w-full text-center bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Want the VIP Lifestyle?
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            Charter aviation offers the highest pilot-to-client ratio. Build relationships. 
            Fly diverse routes. Earn premium compensation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/discover-pathways"
              className="bg-white text-amber-700 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg transition-colors"
            >
              Explore All Pathways →
            </Link>
            <Link 
              to="/pilot-recognition"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-amber-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              Build Your Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
