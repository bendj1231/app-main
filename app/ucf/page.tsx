'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HUB_COLORS: Record<string, string> = {
  A: 'linear-gradient(135deg, #1e3a5f, #0f172a)',
  B: 'linear-gradient(135deg, #1e3a5f, #0f172a)',
  C: 'linear-gradient(135deg, #1e3a5f, #0f172a)',
  D: 'linear-gradient(135deg, #1e3a5f, #0f172a)',
  E: 'linear-gradient(135deg, #1e3a5f, #0f172a)',
  F: 'linear-gradient(135deg, #1e3a5f, #0f172a)',
  G: 'linear-gradient(135deg, #1e3a5f, #0f172a)',
};

const PILLARS = [
  // Hub A - Operations & Recruitment (5)
  { num: 1, hub: 'A', name: 'Commercial Airlines', desc: 'Streamlined recruitment with pre-verified pilot pools and real-time credential validation', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=90' },
  { num: 2, hub: 'A', name: 'Cargo & Freight', desc: 'Specialized pathways for cargo operators with freighter-specific requirements and night operation credentials', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=90' },
  { num: 3, hub: 'A', name: 'Charter & Business Aviation', desc: 'On-demand verification for private jets and charter operations with flexible scheduling and client-specific requirements', img: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=1200&q=90' },
  { num: 4, hub: 'A', name: 'Emerging Aviation', desc: 'eVTOL and urban air mobility readiness with electric aircraft certifications and autonomous flight standards', img: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1200&q=90' },
  { num: 5, hub: 'A', name: 'Recruitment Agencies', desc: 'Verified candidate matching with AI-driven compatibility scoring and automated compliance screening', img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=90' },
  // Hub B - Training & Transition (4)
  { num: 6, hub: 'B', name: 'Flight Training Organizations', desc: 'Graduate placement tracking with competency-based progression and industry-aligned curriculum validation', img: 'https://images.unsplash.com/photo-1559329373-6a4b5e72d1d0?auto=format&fit=crop&w=1200&q=90' },
  { num: 7, hub: 'B', name: 'Type Rating Centers', desc: 'Verified endorsement records with simulator session tracking and competency assessment integration', img: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=1200&q=90' },
  { num: 8, hub: 'B', name: 'Military & Defence', desc: 'Military-to-civilian transition programs with rank equivalency mapping and security clearance transfer protocols', img: 'https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?auto=format&fit=crop&w=1200&q=90' },
  { num: 9, hub: 'B', name: 'Aviation Universities', desc: 'Academic pathway alignment with credit recognition systems and research-to-industry knowledge transfer', img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=90' },
  // Hub C - Capital, Risk & Compliance (4)
  { num: 10, hub: 'C', name: 'Banking & Finance', desc: 'Career-trajectory lending with income-based repayment models and aviation-specific risk assessment algorithms', img: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=1200&q=90' },
  { num: 11, hub: 'C', name: 'Aviation Insurance', desc: 'Live risk assessment data with dynamic premium calculation based on real-time flight hours and incident history', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=90' },
  { num: 12, hub: 'C', name: 'Legal & Regulatory', desc: 'Automated compliance monitoring with jurisdiction-specific requirement tracking and regulatory change notifications', img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=90' },
  { num: 13, hub: 'C', name: 'Credit Rating', desc: 'Aviation-specific scoring models incorporating flight experience, aircraft type ratings, and employment stability metrics', img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=90' },
  // Hub D - Infrastructure & Data (4)
  { num: 14, hub: 'D', name: 'Verification APIs', desc: 'Background check integration with blockchain credential storage and real-time verification status updates', img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=90' },
  { num: 15, hub: 'D', name: 'Flight Data Apps', desc: 'Logbook synchronization and telemetry integration with automatic flight hour validation and route analysis', img: 'https://images.unsplash.com/photo-1488229297570-58520851e868?auto=format&fit=crop&w=1200&q=90' },
  { num: 16, hub: 'D', name: 'Aeromedical Examiners', desc: 'Medical status feeds with automated certificate expiration alerts and telemedicine integration for remote pilots', img: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1200&q=90' },
  { num: 17, hub: 'D', name: 'Simulator Data Providers', desc: 'Training hour validation with session recording, performance metrics, and instructor certification tracking', img: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&w=1200&q=90' },
  // Hub E - Community & Culture (4)
  { num: 18, hub: 'E', name: 'Pilot Mentors & Unions', desc: 'Knowledge sharing network with peer-to-peer mentorship matching and collective bargaining power analytics', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=90' },
  { num: 19, hub: 'E', name: 'Aircraft Manufacturers', desc: 'Fleet demand signaling with production pipeline integration and pilot qualification requirements for new aircraft types', img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=90' },
  { num: 20, hub: 'E', name: 'Aviation Media', desc: 'Industry insight platform with trend analysis, market intelligence, and career development content curation', img: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=90' },
  { num: 21, hub: 'E', name: 'Humanitarian Missions', desc: 'Volunteer pilot verification with disaster response coordination and humanitarian flight hour certification', img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=90' },
  // Hub F - Growth & Expansion (3)
  { num: 22, hub: 'F', name: 'Career Fairs & Events', desc: 'Digital event integration with virtual recruitment fairs, automated scheduling, and post-event analytics', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=90' },
  { num: 23, hub: 'F', name: 'Government Authorities', desc: 'Regulatory compliance automation with cross-border license recognition and international permit validation', img: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=90' },
  { num: 24, hub: 'F', name: 'International Organizations', desc: 'Cross-border standards harmonization with ICAO compliance tracking and multinational certification pathways', img: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=90' },
  // Hub G - Digital Discovery (3)
  { num: 25, hub: 'G', name: 'Search & Discovery', desc: 'SEO-structured pathways with AI-powered matching algorithms and personalized career recommendation engines', img: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200&q=90' },
];

function PillarCard({ pillar }: { pillar: typeof PILLARS[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative flex flex-row items-stretch overflow-hidden cursor-pointer"
      style={{ minHeight: '140px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left: Dark navy panel */}
      <div
        className="relative z-10 w-16 sm:w-32 lg:w-48 flex-shrink-0 flex flex-col items-center justify-center gap-1 sm:gap-3"
        style={{
          background: HUB_COLORS[pillar.hub],
        }}
      >
        <span
          className="font-black"
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            lineHeight: 1,
            color: hovered ? '#ef4444' : '#ffffff',
            transition: 'color 0.4s ease-in-out',
          }}
        >{pillar.num}</span>
        <span className="text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase opacity-90">Hub {pillar.hub}</span>
      </div>

      {/* Center: Content */}
      <div
        className="relative z-10 flex-1 px-4 sm:px-8 lg:px-12 py-5 sm:py-8 lg:py-10 flex flex-col justify-center"
        style={{ 
          backgroundColor: hovered ? '#0f172a' : '#ffffff', 
          transition: 'all 0.4s ease-in-out',
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-xs font-bold px-3 py-1.5 rounded-full text-white shadow"
            style={{ background: HUB_COLORS[pillar.hub] }}
          >
            Pillar {pillar.num}
          </span>
        </div>
        <h3
          className="font-bold text-base sm:text-2xl lg:text-3xl mb-2 sm:mb-3 tracking-tight"
          style={{ color: hovered ? '#ef4444' : '#0f172a', transition: 'color 0.4s ease-in-out' }}
        >{pillar.name}</h3>
        <div className="flex items-start gap-3">
          <span
            className="text-blue-600 mt-1"
            style={{ fontSize: '1.25rem', transition: 'color 0.4s ease-in-out' }}
          >→</span>
          <p
            className="text-base flex-1"
            style={{ color: hovered ? '#cbd5e1' : '#1e293b', transition: 'color 0.4s ease-in-out' }}
          >{pillar.desc}</p>
        </div>
      </div>

      {/* Right: Image */}
      <div className="relative hidden sm:block sm:w-56 lg:w-96 flex-shrink-0 overflow-hidden">
        <img
          src={pillar.img}
          alt={pillar.name}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background: hovered
              ? 'linear-gradient(to right, #0f172a 0%, rgba(15,23,42,0) 80%)'
              : 'transparent',
            transition: 'all 0.4s ease-in-out',
          }}
        />
      </div>
    </div>
  );
}

export default function UCFPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-lg sm:text-xl font-bold text-slate-900">Pilot</span>
            <span className="text-lg sm:text-xl font-bold text-red-600">Recognition</span>
          </Link>
          <nav className="flex items-center gap-3 sm:gap-6">
            <Link to="/framework" className="text-xs sm:text-sm text-slate-600 hover:text-slate-900">Framework</Link>
            <Link to="/framework/full" className="text-xs sm:text-sm text-slate-600 hover:text-slate-900">Full Version</Link>
          </nav>
        </div>
      </header>

      <section className="py-12 sm:py-20 text-center" style={{ backgroundColor: '#0f172a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs sm:text-sm font-medium rounded-full mb-4">
            Version 10.0-Expanded
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6" style={{ color: '#ffffff' }}>
            Universal Commercial <span style={{ color: '#ef4444' }}>Framework</span>
          </h1>
          <p className="text-base sm:text-xl max-w-3xl mx-auto" style={{ color: '#cbd5e1' }}>
            The Master Blueprint for the Aviation Industry Operating System
          </p>
          <div className="flex items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm mt-6 sm:mt-8 flex-wrap" style={{ color: '#94a3b8' }}>
            <span>7 Stakeholder Hubs</span>
            <span>25 Strategic Pillars</span>
            <span>90+ Pages</span>
          </div>
        </div>
      </section>

      {/* Section 2: What Is The UCF */}
      <section className="py-10 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">What Is The UCF?</h2>
        <p className="text-sm text-red-600 font-medium mb-6">and 25 pillars involved</p>
        <p className="text-lg text-slate-600 leading-relaxed mb-8">
          The Universal Commercial Framework is the <span className="font-semibold text-red-600">operating system blueprint</span> for aviation — 
          connecting airlines, flight schools, insurers, regulators, and pilots through a unified 
          data layer for the first time. It transforms fragmented verification, isolated training records, 
          and static CVs into a single, live, portable recognition ecosystem.
        </p>
        
        {/* Official Release Button */}
        <div className="flex justify-center">
          <Link
            to="/ucf/official-release"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Universal Commercial Framework Official Release
          </Link>
        </div>
      </section>

      {/* Section 3: The 25 Pillars - Stacked Full Width */}
      <section style={{ backgroundColor: '#f8fafc' }}>
        <div className="py-10 sm:py-16 text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">25 Strategic Pillars</h2>
          <p className="text-slate-500">Complete ecosystem directory — 7 Hubs unified under one framework</p>
        </div>
        
        <div className="divide-y divide-slate-100">
          {PILLARS.map((pillar) => (
            <PillarCard key={pillar.num} pillar={pillar} />
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
        <p>Universal Commercial Framework • PilotRecognition.com</p>
      </footer>
    </div>
  );
}
