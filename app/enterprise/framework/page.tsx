'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Types
interface Pillar {
  number: number;
  title: string;
  category: string;
  description: string;
  stakeholders: string[];
}

interface Hub {
  id: string;
  name: string;
  letter: string;
  color: string;
  description: string;
  pillars: Pillar[];
}

// Data - 25 Pillars organized by Hub
const hubs: Hub[] = [
  {
    id: 'hub-a',
    name: 'Operations & Recruitment',
    letter: 'A',
    color: 'blue',
    description: 'Core operational stakeholders directly involved in pilot employment and day-to-day aviation operations',
    pillars: [
      { number: 1, title: 'Commercial Airlines', category: 'Operations', description: 'Legacy and low-cost carriers with structured pilot pathways', stakeholders: ['Airlines', 'Flight Ops', 'HR'] },
      { number: 2, title: 'Cargo & Freight Operators', category: 'Operations', description: 'Logistics and air freight with unique training requirements', stakeholders: ['Cargo Airlines', 'Freight Operators'] },
      { number: 3, title: 'Charter & Business Aviation', category: 'Operations', description: 'Private and corporate aviation with specialized demands', stakeholders: ['Charter Companies', 'BizAv Operators'] },
      { number: 4, title: 'Emerging Aviation Sectors', category: 'Operations', description: 'eVTOL, air taxi, and next-generation mobility', stakeholders: ['eVTOL', 'UAM', 'Drone Operators'] },
      { number: 5, title: 'Flight Training Organizations', category: 'Training', description: 'ATOs providing structured pilot development programs', stakeholders: ['Flight Schools', 'ATOs', 'Academies'] },
    ]
  },
  {
    id: 'hub-b',
    name: 'Training & Transition',
    letter: 'B',
    color: 'indigo',
    description: 'Organizations facilitating pilot skill development and career transitions',
    pillars: [
      { number: 6, title: 'Type Rating & Simulator Centers', category: 'Training', description: 'Advanced training facilities for aircraft-specific certification', stakeholders: ['TRTOs', 'Simulator Centers'] },
      { number: 7, title: 'Military & Defense Commands', category: 'Training', description: 'Armed forces aviation with civilian transition pathways', stakeholders: ['Air Force', 'Naval Aviation', 'Army'] },
      { number: 8, title: 'Banking & Financial Institutions', category: 'Finance', description: 'Pilot loan products and career financing solutions', stakeholders: ['Banks', 'Lenders', 'Financial Services'] },
      { number: 9, title: 'Aviation Insurance Providers', category: 'Finance', description: 'Loss of license and pilot-specific coverage products', stakeholders: ['Insurers', 'Underwriters'] },
    ]
  },
  {
    id: 'hub-c',
    name: 'Capital, Risk & Compliance',
    letter: 'C',
    color: 'emerald',
    description: 'Regulatory, legal, and verification infrastructure ensuring safety and compliance',
    pillars: [
      { number: 10, title: 'Legal & Regulatory Bodies', category: 'Compliance', description: 'CAAP, FAA, EASA, and international aviation authorities', stakeholders: ['Regulators', 'CAAP', 'FAA', 'EASA'] },
      { number: 11, title: 'Verification APIs', category: 'Compliance', description: 'VEREMARK and background verification integration layer', stakeholders: ['VEREMARK', 'Background Check'] },
      { number: 12, title: 'Flight Data & Navigation', category: 'Data', description: 'Navigraph, ForeFlight, and operational data providers', stakeholders: ['Navigraph', 'ForeFlight', 'Data Providers'] },
      { number: 13, title: 'Aeromedical Examiners', category: 'Medical', description: 'AMEs conducting Class 1 medical certification', stakeholders: ['AMEs', 'Medical Examiners'] },
    ]
  },
  {
    id: 'hub-d',
    name: 'Infrastructure & Data',
    letter: 'D',
    color: 'amber',
    description: 'Core platform infrastructure, data providers, and manufacturing stakeholders',
    pillars: [
      { number: 14, title: 'Pilot Contributors & Mentors', category: 'Community', description: 'Experienced pilots contributing data and mentorship', stakeholders: ['Mentors', 'Unions', 'Associations'] },
      { number: 15, title: 'Aircraft Manufacturers', category: 'Manufacturing', description: 'OEMs including Airbus, Boeing, and regional manufacturers', stakeholders: ['Airbus', 'Boeing', 'OEMs'] },
      { number: 16, title: 'Aviation Recruitment Agencies', category: 'Recruitment', description: 'Specialized pilot placement and staffing firms', stakeholders: ['Recruiters', 'Agencies'] },
      { number: 17, title: 'Aviation Universities', category: 'Academia', description: 'Academic institutions with aviation programs', stakeholders: ['Universities', 'Colleges'] },
    ]
  },
  {
    id: 'hub-e',
    name: 'Community & Culture',
    letter: 'E',
    color: 'rose',
    description: 'Media, publications, and community-driven aviation stakeholders',
    pillars: [
      { number: 18, title: 'Aviation Media & Publications', category: 'Media', description: 'Industry publications and aviation journalism', stakeholders: ['Aviation Week', 'FlightGlobal', 'Media'] },
      { number: 19, title: 'Aviation Events & Career Fairs', category: 'Events', description: 'Industry conferences, job fairs, and networking events', stakeholders: ['Events', 'Career Fairs'] },
      { number: 20, title: 'Government Aviation Authorities', category: 'Government', description: 'National and regional aviation administration bodies', stakeholders: ['Civil Aviation', 'DOT'] },
    ]
  },
  {
    id: 'hub-f',
    name: 'Growth & Expansion',
    letter: 'F',
    color: 'violet',
    description: 'International organizations and emerging market expansion',
    pillars: [
      { number: 21, title: 'International Aviation Organizations', category: 'Global', description: 'IATA, ICAO, and international aviation bodies', stakeholders: ['IATA', 'ICAO'] },
      { number: 22, title: 'Church-Funded Humanitarian Missions', category: 'Humanitarian', description: 'Volunteer pilot verification for charitable aviation', stakeholders: ['Charities', 'NGOs', 'Missions'] },
    ]
  },
  {
    id: 'hub-g',
    name: 'Digital Discovery & Search',
    letter: 'G',
    color: 'cyan',
    description: 'Search platforms and digital discovery infrastructure',
    pillars: [
      { number: 25, title: 'Digital Discovery Platforms', category: 'Discovery', description: 'Search engines, job boards, and AI assistants', stakeholders: ['Search Engines', 'Job Boards', 'AI Assistants'] },
    ]
  },
];

// Hub color classes
const hubColors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', badge: 'bg-blue-100 text-blue-800' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-900', badge: 'bg-indigo-100 text-indigo-800' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', badge: 'bg-emerald-100 text-emerald-800' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', badge: 'bg-amber-100 text-amber-800' },
  rose: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-900', badge: 'bg-rose-100 text-rose-800' },
  violet: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-900', badge: 'bg-violet-100 text-violet-800' },
  cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-900', badge: 'bg-cyan-100 text-cyan-800' },
};

export default function EnterpriseFrameworkPage() {
  const [activeHub, setActiveHub] = useState<string | null>(null);
  const [showFullDocument, setShowFullDocument] = useState(false);

  const totalPillars = hubs.reduce((acc, hub) => acc + hub.pillars.length, 0);

  return (
        {/* Coded by Benjamin Bowler */}
    <div className="min-h-screen bg-slate-50">
      {/* Official Header */}
      <header className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="https://enterprise.pilotrecognition.com" className="flex items-center gap-2">
              <span className="text-xl font-bold">Pilot</span>
              <span className="text-xl font-bold text-red-500">Recognition</span>
              <span className="text-sm text-slate-400">Enterprise</span>
            </a>
            <span className="text-slate-600">|</span>
            <span className="text-sm text-slate-300">Universal Commercial Framework</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
              Version 10.0-Expanded
            </span>
            <a 
              href="mailto:enterprise@pilotrecognition.com"
              className="text-sm bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              Contact Partnership Team
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-2 rounded-lg mb-6">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-red-700">Official Strategic Document</span>
              </div>
              <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Universal Commercial<br />
                <span className="text-red-600">Framework</span>
              </h1>
              <p className="text-xl text-slate-600 mb-6 leading-relaxed">
                The Aviation Industry Operating System — A 25-pillar strategic blueprint 
                connecting airlines, training organizations, regulators, and industry stakeholders 
                through a unified pilot recognition and pathway infrastructure.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="bg-slate-100 px-4 py-2 rounded-lg font-medium">
                  {totalPillars} Strategic Pillars
                </span>
                <span className="bg-slate-100 px-4 py-2 rounded-lg font-medium">
                  7 Stakeholder Hubs
                </span>
                <span className="bg-slate-100 px-4 py-2 rounded-lg font-medium">
                  80+ Pages
                </span>
                <span className="bg-slate-100 px-4 py-2 rounded-lg font-medium">
                  May 2026 Edition
                </span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
              <h3 className="text-lg font-semibold mb-4 text-red-400">Framework at a Glance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-700">
                  <span className="text-slate-300">Recognition Score Algorithm</span>
                  <span className="font-mono text-emerald-400">Live</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-700">
                  <span className="text-slate-300">Veremark Integration</span>
                  <span className="font-mono text-emerald-400">Active</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-700">
                  <span className="text-slate-300">Countries Supported</span>
                  <span className="font-mono">150+</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-slate-300">Partnership Inquiries</span>
                  <span className="font-mono text-amber-400">Open</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Summary */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Executive Summary</h2>
          <p className="text-amber-800 leading-relaxed mb-4">
            The Universal Commercial Framework represents a paradigm shift in aviation career development. 
            Rather than fragmented job postings and opaque requirements, we provide a structured ecosystem 
            where every stakeholder — from airlines to flight schools to regulators — operates within a 
            unified data infrastructure.
          </p>
          <p className="text-amber-800 leading-relaxed">
            At the center is the <strong>Recognition Score</strong>: a verified, multi-dimensional metric 
            that transforms how pilots qualify for opportunities and how organizations discover talent.
          </p>
        </div>
      </section>

      {/* Hub Navigation */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">7 Strategic Hubs</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {hubs.map((hub) => {
            const colors = hubColors[hub.color];
            return (
              <button
                key={hub.id}
                onClick={() => setActiveHub(activeHub === hub.id ? null : hub.id)}
                className={`text-left p-6 rounded-xl border-2 transition-all ${
                  activeHub === hub.id 
                    ? `${colors.bg} ${colors.border} ring-2 ring-offset-2 ring-slate-900` 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`w-10 h-10 rounded-lg ${colors.badge} flex items-center justify-center font-bold text-lg`}>
                    {hub.letter}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {hub.pillars.length} Pillars
                  </span>
                </div>
                <h3 className={`font-bold mb-2 ${activeHub === hub.id ? colors.text : 'text-slate-900'}`}>
                  Hub {hub.letter}
                </h3>
                <p className="text-sm text-slate-600">{hub.name}</p>
              </button>
            );
          })}
        </div>

        {/* Active Hub Detail */}
        {activeHub && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-12">
            {hubs.filter(h => h.id === activeHub).map(hub => {
              const colors = hubColors[hub.color];
              return (
                <div key={hub.id}>
                  <div className={`${colors.bg} px-8 py-6 border-b ${colors.border}`}>
                    <div className="flex items-center gap-4 mb-2">
                      <span className={`w-12 h-12 rounded-xl ${colors.badge} flex items-center justify-center font-bold text-xl`}>
                        {hub.letter}
                      </span>
                      <div>
                        <h3 className={`text-2xl font-bold ${colors.text}`}>Hub {hub.letter}: {hub.name}</h3>
                        <p className="text-slate-600">{hub.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {hub.pillars.map(pillar => (
                        <div key={pillar.number} className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition-colors">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                              {pillar.number}
                            </span>
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                              {pillar.category}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 mb-2">{pillar.title}</h4>
                          <p className="text-sm text-slate-600 mb-4">{pillar.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {pillar.stakeholders.map(s => (
                              <span key={s} className="text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-600">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Framework Visualization - All Pillars */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Complete 25-Pillar Architecture</h2>
          <div className="grid grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-3">
            {hubs.flatMap(h => h.pillars).map(pillar => (
              <div 
                key={pillar.number}
                className="aspect-square bg-slate-100 hover:bg-slate-900 hover:text-white rounded-lg flex flex-col items-center justify-center p-2 transition-all cursor-pointer group"
                title={`Pillar ${pillar.number}: ${pillar.title}`}
              >
                <span className="text-2xl font-bold">{pillar.number}</span>
                <span className="text-xs text-center opacity-70 group-hover:opacity-100 line-clamp-2">
                  {pillar.title.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-500 mt-6 text-sm">
            Hover over numbers to preview. Click a Hub above to explore detailed pillar information.
          </p>
        </div>
      </section>

      {/* Commercial Framework Summary */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Commercial Partnership Model</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Tier 1: Basic Integration</h3>
            <ul className="space-y-2 text-blue-800 text-sm mb-6">
              <li>• API access to pathway data</li>
              <li>• Real-time requirement updates</li>
              <li>• Standard verification</li>
              <li>• Community support</li>
            </ul>
            <p className="text-xs text-blue-600 font-medium">ENTRY LEVEL PARTNERSHIP</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-8 border border-emerald-200">
            <h3 className="text-xl font-bold text-emerald-900 mb-4">Tier 2: Professional</h3>
            <ul className="space-y-2 text-emerald-800 text-sm mb-6">
              <li>• Advanced analytics dashboard</li>
              <li>• Priority API rate limits</li>
              <li>• Recognition Score integration</li>
              <li>• Co-marketing opportunities</li>
            </ul>
            <p className="text-xs text-emerald-600 font-medium">RECOMMENDED FOR MOST</p>
          </div>
          <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-8 border border-violet-200">
            <h3 className="text-xl font-bold text-violet-900 mb-4">Tier 3: Enterprise</h3>
            <ul className="space-y-2 text-violet-800 text-sm mb-6">
              <li>• White-label integration</li>
              <li>• Dedicated account manager</li>
              <li>• Custom development</li>
              <li>• Strategic partnership terms</li>
            </ul>
            <p className="text-xs text-violet-600 font-medium">FOR MAJOR STAKEHOLDERS</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Join the Universal Commercial Framework</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Connect your organization to the 25-pillar aviation ecosystem. 
            Access verified pilot data, streamline recruitment, and participate in the industry operating system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowFullDocument(true)}
              className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 py-4 rounded-xl transition-colors inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              View Full 80+ Page Document
            </button>
            <a 
              href="mailto:enterprise@pilotrecognition.com?subject=Framework Partnership Inquiry"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Request Partnership Discussion
            </a>
          </div>
          <p className="text-slate-500 mt-6 text-sm">
            Document distribution restricted to qualified industry stakeholders
          </p>
        </div>
      </section>

      {/* Full Document Modal */}
      {showFullDocument && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-xl font-bold">Universal Commercial Framework - Full Document</h3>
              <button 
                onClick={() => setShowFullDocument(false)}
                className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-amber-800 text-sm">
                  <strong>Confidential:</strong> This document contains strategic commercial information. 
                  Distribution outside your organization requires written permission.
                </p>
              </div>
              <p className="text-slate-600 text-center py-12">
                Full document viewer loading...<br />
                <span className="text-sm text-slate-400">
                  (Integrates with existing /framework/full page)
                </span>
              </p>
            </div>
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-4">
              <button 
                onClick={() => setShowFullDocument(false)}
                className="px-6 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                Close
              </button>
              <a 
                href="https://enterprise.pilotrecognition.com/framework/full"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Open Full Document →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">Pilot</span>
              <span className="font-bold text-red-600">Recognition</span>
            </div>
            <p className="text-sm text-slate-500">
              Universal Commercial Framework v10.0-Expanded • May 2026 • Partnership Discussion Only
            </p>
            <a 
              href="mailto:enterprise@pilotrecognition.com"
              className="text-sm text-slate-600 hover:text-red-600 transition-colors"
            >
              enterprise@pilotrecognition.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
