'use client';

import React from 'react';
import { Link } from 'react-router-dom';

// 25 Pillars with neutral stakeholder mapping
const pillars = [
  { num: 1, name: 'Commercial Airlines', role: 'Major carriers and regional operators', contribution: 'Provide career pathways and fleet demand signals', need: 'Verified pilot competencies aligned with operational requirements' },
  { num: 2, name: 'Cargo & Freight Operators', role: 'Express delivery and freight airlines', contribution: 'Diverse operating environments and type ratings', need: 'Multi-crew coordination and specialized handling skills' },
  { num: 3, name: 'Charter & Business Aviation', role: 'Corporate flight departments and VIP charter', contribution: 'Flexible operations and diverse aircraft types', need: 'Professional versatility and client-facing competencies' },
  { num: 4, name: 'Emerging Aviation (eVTOL)', role: 'Urban air mobility and electric aircraft', contribution: 'Next-generation aircraft and new operational models', need: 'Technology-adaptable pilots for emerging markets' },
  { num: 5, name: 'Flight Training Organizations', role: 'ATOs and flight schools', contribution: 'Initial training and standardization', need: 'Industry-aligned curriculum and graduate placement pathways' },
  { num: 6, name: 'Type Rating Centers', role: 'Simulator and advanced training facilities', contribution: 'Advanced qualification and transition training', need: 'Clear prerequisites and competency-based assessment' },
  { num: 7, name: 'Military & Defense', role: 'Armed forces aviation', contribution: 'Discipline and advanced operational training', need: 'Civilian credential recognition and transition pathways' },
  { num: 8, name: 'Banking & Finance', role: 'Aviation financing and career loans', contribution: 'Financial infrastructure for training', need: 'Creditworthiness verification and career outcome data' },
  { num: 9, name: 'Aviation Insurance', role: 'Underwriters and risk assessors', contribution: 'Risk management and liability frameworks', need: 'Verified pilot history and competency profiles' },
  { num: 10, name: 'Regulatory Bodies', role: 'National aviation authorities', contribution: 'Safety standards and licensing frameworks', need: 'Digital verification systems and real-time compliance' },
  { num: 11, name: 'Verification Providers', role: 'Background check and credential verification', contribution: 'Trusted third-party verification infrastructure', need: 'Aviation-specific verification workflows' },
  { num: 12, name: 'Flight Data Providers', role: 'Navigation and flight planning platforms', contribution: 'Operational data and currency tracking', need: 'Integration with competency frameworks' },
  { num: 13, name: 'Aeromedical Examiners', role: 'AMEs and medical certification', contribution: 'Medical fitness verification', need: 'Real-time medical status integration' },
  { num: 14, name: 'Pilot Mentors & Unions', role: 'Professional associations and experienced pilots', contribution: 'Knowledge transfer and career guidance', need: 'Structured mentorship frameworks' },
  { num: 15, name: 'Aircraft Manufacturers', role: 'Commercial aircraft OEMs', contribution: 'Aircraft design and training standards', need: 'Pilot competency alignment with aircraft capabilities' },
  { num: 16, name: 'Recruitment Agencies', role: 'Pilot placement and staffing firms', contribution: 'Matching services and talent pools', need: 'Verified competency data and qualification matching' },
  { num: 17, name: 'Aviation Universities', role: 'Degree-granting institutions', contribution: 'Academic foundations and research', need: 'Industry connection and practical application pathways' },
  { num: 18, name: 'Aviation Media', role: 'Publications and industry news', contribution: 'Information dissemination and awareness', need: 'Accurate, actionable career guidance' },
  { num: 19, name: 'Career Fairs & Events', role: 'Recruitment events and conferences', contribution: 'Networking and opportunity exposure', need: 'Digital extension and year-round access' },
  { num: 20, name: 'Government Authorities', role: 'Civil aviation departments', contribution: 'Policy frameworks and national oversight', need: 'Labor market data and pipeline visibility' },
  { num: 21, name: 'International Organizations', role: 'Global aviation standards bodies', contribution: 'Global standards and harmonization', need: 'Local implementation and regional adaptation' },
  { num: 22, name: 'Humanitarian & Mission Aviation', role: 'Charitable and relief operations', contribution: 'Service-oriented flying opportunities', need: 'Verified volunteer pilot pools' },
  { num: 23, name: 'Airport Authorities', role: 'Airport operations and security', contribution: 'Infrastructure and operational support', need: 'Pre-cleared personnel verification' },
  { num: 24, name: 'Simulator Data Providers', role: 'Training analytics and performance tracking', contribution: 'Competency measurement and EBT/CBTA alignment', need: 'Standardized competency frameworks' },
  { num: 25, name: 'Digital Discovery Platforms', role: 'Search, AI, and career platforms', contribution: 'Visibility and access to opportunities', need: 'Verified data and trusted matching algorithms' },
];

export default function FrameworkPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
          <Link to="/" className="font-semibold hover:text-slate-900 transition-colors">← Back to Home</Link>
          <div className="flex gap-4">
            <Link to="/enterprise-access" className="text-sm text-slate-600 hover:text-slate-900">Enterprise Access →</Link>
          </div>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-12 pb-8 border-b-2 border-slate-900">
          <p className="text-sm text-slate-500 font-semibold mb-2 tracking-wider">FOR ENTERPRISE & PARTNERS</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Universal Commercial Framework</h1>
          <p className="text-xl text-slate-600 mb-4">The Aviation Industry Operating System</p>
          <p className="text-base text-slate-500 max-w-2xl mx-auto">
            A comprehensive blueprint connecting all 25 pillars of the aviation ecosystem. 
            This framework enables seamless collaboration between operators, training organizations, 
            regulatory bodies, and service providers to build a more efficient, transparent, and 
            interconnected aviation industry.
          </p>
        </header>

        {/* 25 PILLARS FIRST - Stakeholders & Their Problems */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-red-600">
            <span className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">25</span>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">The 25 Pillars</h2>
              <p className="text-slate-600">Each pillar's role, contribution, and integration needs</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {pillars.map((pillar) => (
              <div key={pillar.num} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-red-300 hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <span className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {pillar.num}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1">{pillar.name}</h3>
                    <p className="text-sm text-blue-600 font-medium mb-2">{pillar.role}</p>
                    <p className="text-sm text-slate-600 mb-1"><strong>Contribution:</strong> {pillar.contribution}</p>
                    <p className="text-sm text-slate-500"><strong>Need:</strong> {pillar.need}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Framework Overview */}
        <section className="mb-12 bg-slate-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Framework Overview</h2>
          <p className="text-slate-700 mb-4">
            The Universal Commercial Framework is designed to facilitate seamless integration between all 
            aviation industry stakeholders. Rather than operating in isolation, each pillar can leverage 
            shared data, verification systems, and competency frameworks to improve operational efficiency 
            and pilot career outcomes.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2">Integration Hub</h4>
              <p className="text-sm text-slate-600">Central platform connecting 25 industry pillars</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2">Verified Data</h4>
              <p className="text-sm text-slate-600">Blockchain-backed credentials and competencies</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2">Recognition Score</h4>
              <p className="text-sm text-slate-600">Standardized competency measurement across sectors</p>
            </div>
          </div>
        </section>

        {/* Recognition Score Standards */}
        <section className="mb-12 bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-2xl border-2 border-slate-200">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">Recognition Score Standards</h2>
          <p className="text-slate-700 mb-6">
            A standardized competency framework enabling cross-sector pilot assessment and recognition.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl text-center shadow-sm">
              <p className="text-3xl font-bold text-red-600">0-39</p>
              <p className="text-sm text-slate-600 mt-1">Bronze<br />Entry Level</p>
            </div>
            <div className="bg-white p-4 rounded-xl text-center shadow-sm">
              <p className="text-3xl font-bold text-yellow-600">40-59</p>
              <p className="text-sm text-slate-600 mt-1">Silver<br />Developing</p>
            </div>
            <div className="bg-white p-4 rounded-xl text-center shadow-sm">
              <p className="text-3xl font-bold text-slate-400">60-79</p>
              <p className="text-sm text-slate-600 mt-1">Gold<br />Qualified</p>
            </div>
            <div className="bg-white p-4 rounded-xl text-center shadow-sm border-2 border-yellow-400">
              <p className="text-3xl font-bold text-yellow-600">80-100</p>
              <p className="text-sm text-slate-800 font-semibold mt-1">Platinum<br />Airline Ready</p>
            </div>
          </div>
        </section>

        {/* Partnership Opportunities */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Partnership Opportunities</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/enterprise-access/airlines" className="p-6 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors group">
              <h3 className="font-bold text-lg group-hover:text-blue-400 transition-colors">Airlines & Operators →</h3>
              <p className="text-sm text-slate-300 mt-2">Access verified pilot pools and competency data</p>
            </Link>
            <Link to="/enterprise-access" className="p-6 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors group">
              <h3 className="font-bold text-lg group-hover:text-green-400 transition-colors">Flight Schools →</h3>
              <p className="text-sm text-slate-300 mt-2">Integrate programs and track graduate outcomes</p>
            </Link>
            <Link to="/enterprise-access" className="p-6 bg-slate-600 text-white rounded-xl hover:bg-slate-500 transition-colors group">
              <h3 className="font-bold text-lg group-hover:text-yellow-400 transition-colors">Industry Partners →</h3>
              <p className="text-sm text-slate-300 mt-2">Connect your services to the aviation ecosystem</p>
            </Link>
          </div>
        </section>

        {/* Verification Layer */}
        <section className="mb-12">
          <div className="bg-slate-900 text-white p-8 rounded-2xl">
            <p className="text-blue-400 font-bold mb-2 text-sm tracking-wider">PILLAR 11 — VERIFICATION LAYER</p>
            <h3 className="text-2xl font-bold mb-4">Third-Party Verification</h3>
            <p className="text-slate-300 mb-6">Trusted verification infrastructure enabling pre-cleared pilot status across all 25 pillars</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-2xl font-bold text-blue-400">Global</p>
                <p className="text-xs text-slate-400">150+ Countries</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-2xl font-bold text-blue-400">Real-Time</p>
                <p className="text-xs text-slate-400">API Verification</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-2xl font-bold text-blue-400">Blockchain</p>
                <p className="text-xs text-slate-400">Digital Wallet</p>
              </div>
            </div>
          </div>
        </section>

        {/* Full Framework CTA */}
        <section className="mb-12 bg-gradient-to-r from-slate-100 to-slate-200 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Complete Framework Documentation</h2>
          <p className="text-slate-600 mb-6">
            The full 90+ page framework includes detailed API specifications, integration guides, 
            commercial partnership models, and technical documentation for all 25 pillars.
          </p>
          <div className="flex gap-4">
            <Link 
              to="/framework/full"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              View Full Framework
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link 
              to="/enterprise-access"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-900 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Enterprise Access
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Contact */}
        <div className="text-center py-8 border-t">
          <p className="text-slate-600 mb-4">
            Interested in partnering with PilotRecognition? Contact our enterprise team.
          </p>
          <a 
            href="mailto:enterprise@pilotrecognition.com"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
          >
            enterprise@pilotrecognition.com
          </a>
        </div>
      </article>
    </div>
  );
}
