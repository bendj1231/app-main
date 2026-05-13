'use client';

import React from 'react';
import { Link } from 'react-router-dom';

export default function CorporatePathwaysPage() {
  const corporatePathways = [
    {
      company: 'Google (Alphabet)',
      title: 'Captain - G650 / G550 Fleet',
      location: 'Mountain View, CA / SJC Base',
      salary: '$200,000 - $280,000',
      requirements: { hours: 4000, license: 'ATPL', score: 85 },
      benefits: ['Tech industry benefits', 'Stock options', 'Top-tier equipment'],
      spots: 4
    },
    {
      company: 'Apple',
      title: 'Captain - Gulfstream Fleet',
      location: 'Cupertino, CA / SJC Base',
      salary: '$220,000 - $300,000',
      requirements: { hours: 5000, license: 'ATPL', score: 90 },
      benefits: ['Premium compensation', 'Privacy-focused ops', 'Global travel'],
      spots: 3
    },
    {
      company: 'Walmart Aviation',
      title: 'Pilot - Global Express / G650',
      location: 'Bentonville, AR / XNA Base',
      salary: '$180,000 - $250,000',
      requirements: { hours: 3500, license: 'ATPL', score: 80 },
      benefits: ['Fortune 1 stability', 'Family-friendly', 'Bentonville lifestyle'],
      spots: 6
    },
    {
      company: 'FedEx Corporate',
      title: 'Captain - Falcon 8X / G650',
      location: 'Memphis, TN / MEM Base',
      salary: '$190,000 - $260,000',
      requirements: { hours: 4000, license: 'ATPL', score: 82 },
      benefits: ['Cargo + corporate synergy', 'FedEx benefits', 'Dual role options'],
      spots: 5
    },
    {
      company: 'Berkshire Hathaway',
      title: 'Captain - Various Long-Range Jets',
      location: 'Omaha, NE / OMA Base',
      salary: '$210,000 - $290,000',
      requirements: { hours: 4500, license: 'ATPL', score: 88 },
      benefits: ['Warren Buffett connection', 'Diverse portfolio ops', 'Midwest living'],
      spots: 4
    },
    {
      company: 'ExxonMobil Aviation',
      title: 'Pilot - Global 7500 / G650ER',
      location: 'Houston, TX / IAH Base',
      salary: '$195,000 - $275,000',
      requirements: { hours: 4000, license: 'ATPL', score: 85 },
      benefits: ['Energy sector travel', 'Houston hub', 'International ops'],
      spots: 7
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">🏢</span>
            <span className="text-blue-200 text-sm font-semibold uppercase tracking-wide">Corporate Flight Departments</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Corporate Aviation Careers
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl">
            Fly for Fortune 500 companies. Tech giants. Energy conglomerates. 
            The highest pilot compensation in aviation. Total compensation often 
            exceeds $300,000/year.
          </p>
        </div>
      </div>

      {/* Why Corporate Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💵</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Highest Pay</h3>
            <p className="text-sm text-gray-600">
              Corporate pilots earn $180K-$300K+ base. Add stock options, bonuses, 
              and benefits = $400K+ total compensation possible.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🏡</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Home Every Night</h3>
            <p className="text-sm text-gray-600">
              Most corporate roles are home-based. No 4-day trips. Back in your 
              own bed. Family-friendly schedules.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Premium Equipment</h3>
            <p className="text-sm text-gray-600">
              Fly the newest Gulfstream G650s, Global 7500s, Falcon 8Xs. 
              Better maintenance. Safer operations. Top-tier avionics.
            </p>
          </div>
        </div>
      </div>

      {/* Pathway Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Fortune 500 Flight Departments</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {corporatePathways.map((pathway, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{pathway.company}</h3>
                    <p className="text-blue-200">{pathway.title}</p>
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
                
                <div className="flex justify-between items-center mb-4 p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Total Compensation</span>
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
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements Note */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
          <h3 className="font-bold text-amber-900 mb-2">Corporate Aviation Requirements</h3>
          <p className="text-amber-800 text-sm">
            Corporate flight departments typically require 3,500+ hours and Platinum-tier Recognition Scores (80+). 
            These are senior positions. Build your score through our programs and gain heavy jet experience 
            via cargo or charter pathways first.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Targeting $300K+ Total Comp?
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Corporate aviation is the pinnacle of pilot careers. Build your Recognition Score. 
            Gain heavy jet time. Network with Fortune 500 flight departments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/discover-pathways"
              className="bg-white text-blue-700 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg transition-colors"
            >
              Explore Career Path →
            </Link>
            <Link 
              to="/programs/transition"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              Transition Program
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
