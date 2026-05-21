'use client';

import React from 'react';

export default function ManufacturersPage() {
  return (
        {/* Coded by Benjamin Bowler */}
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-red-400 font-semibold text-sm uppercase tracking-wide mb-4">
            For Aircraft Manufacturers & OEMs
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Build the Future of Aviation<br />
            <span className="text-red-500">With Pre-Trained Pilots</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Partner with PilotRecognition to certify pilots on your aircraft types before delivery. 
            Create EBT/CBTA-aligned training standards that airlines trust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:manufacturers@pilotrecognition.com" 
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              Partner With Us →
            </a>
            <a 
              href="https://enterprise.pilotrecognition.com/framework/full"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-slate-900 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              View Training Framework
            </a>
          </div>
        </div>
      </div>

      {/* Partner Logos */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-gray-500 text-sm mb-8">Partnering with leading manufacturers</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="font-bold text-xl text-slate-900">Airbus</p>
              <p className="text-xs text-gray-500">HINFACT Alignment</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="font-bold text-xl text-slate-900">Boeing</p>
              <p className="text-xs text-gray-500">Type Rating Integration</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="font-bold text-xl text-slate-900">Embraer</p>
              <p className="text-xs text-gray-500">Regional Jet Training</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="font-bold text-xl text-slate-900">Bombardier</p>
              <p className="text-xs text-gray-500">Business Aviation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Partner With PilotRecognition?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-8 rounded-xl">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Pre-Certified Pilot Pool</h3>
            <p className="text-gray-600 text-sm">
              Your customers get access to pilots already trained on your aircraft types. 
              Reduce delivery delays caused by pilot unavailability.
            </p>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-xl">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">EBT/CBTA Standardization</h3>
            <p className="text-gray-600 text-sm">
              Embed your Evidence-Based Training standards into pilot profiles. 
              Airlines see competency alignment before hiring.
            </p>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-xl">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Data-Driven Insights</h3>
            <p className="text-gray-600 text-sm">
              See where your aircraft types are in demand. Track pilot training 
              trends across regions and operator types.
            </p>
          </div>
        </div>
      </div>

      {/* Partnership Models */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Partnership Models
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 p-6 rounded-xl">
              <h3 className="font-bold text-xl mb-4">Training Integration</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Embed your training modules</li>
                <li>• EBT/CBTA competency mapping</li>
                <li>• Type rating pre-validation</li>
                <li>• Simulator hour tracking</li>
              </ul>
              <p className="text-red-400 font-semibold mt-4">$5,000/year</p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-xl border-2 border-red-500">
              <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                RECOMMENDED
              </div>
              <h3 className="font-bold text-xl mb-4">Strategic Partnership</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Everything in Training Integration</li>
                <li>• Dedicated manufacturer page</li>
                <li>• Priority pilot matching</li>
                <li>• Co-branded pathway cards</li>
                <li>• Quarterly industry reports</li>
              </ul>
              <p className="text-red-400 font-semibold mt-4">$15,000/year</p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-xl">
              <h3 className="font-bold text-xl mb-4">Enterprise Alliance</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Everything in Strategic Partnership</li>
                <li>• API access to pilot database</li>
                <li>• Custom analytics dashboard</li>
                <li>• White-label options</li>
                <li>• Dedicated account manager</li>
              </ul>
              <p className="text-red-400 font-semibold mt-4">$50,000/year</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Integrate Your Training Standards?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join Airbus and other leading manufacturers using PilotRecognition 
            to build the next generation of certified pilots.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:manufacturers@pilotrecognition.com?subject=Manufacturer Partnership Inquiry"
              className="bg-white text-red-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg transition-colors"
            >
              Apply for Partnership →
            </a>
            <a 
              href="tel:+4915259057144"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-red-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              Call: +49 152 59057144
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
