'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const navSections = [
  { id: 'document-information', label: 'Document Information' },
  { id: 'part-i-foundation-vision', label: 'Part I: Foundation & Vision' },
  { id: 'page-1-executive-summary', label: '→ Page 1: Executive Summary', indent: true },
  { id: 'the-aviation-industry-operating-system', label: '→ The Aviation Industry OS', indent: true },
  { id: 'part-ii-hub-a', label: 'Part II: Hub A — Operations & Recruitment' },
  { id: 'pillar-1-commercial-airlines', label: '→ Pillar 1: Commercial Airlines', indent: true },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function UCFOfficialReleasePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {sidebarOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
            <Link to="/ucf" className="text-slate-900 font-semibold hover:text-red-600 transition-colors text-sm">
              ← Back to UCF
            </Link>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline text-slate-500 text-sm">Official Release Document</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main layout */}
      <div className="w-full flex gap-6 pl-4 pr-6 py-8">

        {/* Left Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <aside className={`${sidebarOpen ? 'fixed left-0 top-0 z-50 h-full w-64 pt-20 px-4' : 'hidden'} md:block md:static md:w-64 md:flex-shrink-0 md:h-fit`}>
          <div className="sticky top-24 bg-slate-50 rounded-xl border border-slate-200 max-h-[calc(100vh-6rem)] overflow-y-auto shadow-lg md:shadow-none">
            <div className="p-3 border-b border-slate-200 bg-white rounded-t-xl">
              <h2 className="font-bold text-slate-900 text-sm">📑 Quick Navigation</h2>
              <p className="text-xs text-slate-500 mt-1">Jump to any section</p>
            </div>
            <nav className="p-2 space-y-0.5">
              {navSections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors hover:bg-slate-200 flex items-start gap-1.5 ${
                    s.indent ? 'pl-5 text-slate-600' : 'font-semibold text-slate-900 bg-slate-100'
                  }`}
                >
                  {s.indent
                    ? <span className="text-blue-500 mt-0.5 flex-shrink-0">→</span>
                    : <span className="text-red-500 mt-0.5 flex-shrink-0">▸</span>
                  }
                  <span className="leading-tight">{s.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Document article */}
        <article className="max-w-4xl mx-auto flex-1 min-w-0">

          {/* Document cover block */}
          <div id="document-information" className="mb-12 pb-10 border-b-2 border-slate-900 scroll-mt-24">
            <p className="text-xs font-bold tracking-widest uppercase text-red-600 mb-3">Official Release Document</p>
            <h1 className="text-4xl font-bold text-slate-900 mb-4 pb-4 border-b-2 border-slate-900">
              Universal Commercial Framework
            </h1>
            <p className="text-lg text-slate-600 mb-6">Complete Technical Specification and Implementation Guide</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {[
                { label: 'Version', value: '10.0-Expanded' },
                { label: 'Stakeholder Hubs', value: '7' },
                { label: 'Strategic Pillars', value: '25' },
                { label: 'Pages', value: '90+' },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">{item.label}</p>
                  <p className="text-xl font-bold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Part I heading */}
          <h1 id="part-i-foundation-vision" className="text-4xl font-bold text-slate-900 mt-12 mb-6 pb-4 border-b-2 border-slate-900 scroll-mt-24">
            PART I: FOUNDATION &amp; VISION
          </h1>

          {/* Page 1 heading */}
          <h2 id="page-1-executive-summary" className="text-2xl font-bold text-slate-800 mt-8 mb-4 pb-2 border-b border-slate-300 scroll-mt-24">
            Page 1: Executive Summary
          </h2>

          <h3 id="the-aviation-industry-operating-system" className="text-xl font-bold text-slate-800 mt-6 mb-3 scroll-mt-24">
            The Aviation Industry Operating System
          </h3>

          <p className="text-slate-700 leading-relaxed mb-4">
            The global aviation industry is one of the <strong>most complex, regulated, and interconnected industries on the planet.</strong> It involves airlines, cargo operators, charter companies, private jet operators, flight training academies, type rating centers, aircraft manufacturers, military institutions, banks and lenders, insurance underwriters, aeromedical examiners, recruitment agencies, government authorities, and the pilots who hold it all together. <strong>Every one of these sectors depends on the others.</strong> And yet — <strong>none of them share a common language.</strong>
          </p>

          <p className="text-slate-700 leading-relaxed mb-4">
            An airline <strong>cannot easily verify a pilot's credentials</strong> from another country. A bank <strong>cannot accurately assess the career risk</strong> of an aviation loan without live data. An insurance underwriter <strong>prices policies on estimates, not facts.</strong> A flight school has no way to demonstrate to a prospective student what their graduates actually went on to achieve. A recruitment agency sends <strong>hundreds of static CVs</strong> to an airline that receives thousands more from everywhere else. A regulatory body still relies on <strong>manually submitted paper records.</strong> A manufacturer launches a new aircraft type with <strong>no visibility into whether the trained pilot pool actually exists.</strong>
          </p>

          <div className="my-6 px-5 py-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
            <p className="text-sm font-bold text-red-600 uppercase tracking-widest mb-1">Key Observation</p>
            <p className="text-slate-700 leading-relaxed">Every sector is operating in isolation. The data exists — it is simply trapped.</p>
          </div>

          <p className="text-slate-700 leading-relaxed mb-4">
            <strong>Credentials are locked in systems that do not communicate.</strong> Qualifications are verified manually, slowly, and inconsistently. Requirements are posted and forgotten, <strong>outdated before the ink is dry.</strong> Pilots invest years and significant money building toward goals that <strong>have moved without anyone telling them.</strong> Airlines spend months on hiring cycles that could take weeks. Insurers, lenders, and regulators make <strong>critical decisions on incomplete information.</strong>
          </p>

          <p className="text-slate-700 leading-relaxed mb-6 font-bold text-lg text-slate-900">
            This is not a pilot problem. This is an industry infrastructure problem.
          </p>

          <p className="text-slate-700 leading-relaxed mb-4">
            <strong>PilotRecognition is the Aviation Industry Operating System</strong> — a neutral, centralized platform purpose-built to connect every stakeholder in aviation through <strong>verified, live, and structured data.</strong> It is not a job board. It is not a recruitment agency. It is not a resume database. It is <strong>the shared infrastructure the industry has never had:</strong> a system where every credential, every qualification, every requirement, every opportunity, and every decision point across the aviation ecosystem is <strong>connected, verified, and accessible in real time.</strong>
          </p>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4 scroll-mt-24">What this means for each stakeholder:</h3>

          <ul className="space-y-2 mb-6">
            {[
              { label: 'Commercial Airlines', desc: 'publish verified expectations, receive pre-qualified candidates, eliminate unstructured hiring, and integrate directly with existing ATS systems' },
              { label: 'Cargo & Freight Operators', desc: 'access freighter-specific pilot pools with verified night operation credentials and dangerous goods endorsements' },
              { label: 'Charter & Business Aviation', desc: 'verify on-demand pilot qualifications instantly for private jet and charter operations with client-specific requirements' },
              { label: 'Emerging Aviation (eVTOL & AAM)', desc: 'connect with electric aircraft certified pilots, establish autonomous flight standards, and signal urban air mobility demand' },
              { label: 'Recruitment Agencies', desc: 'access a verified, filterable pilot database with AI-driven compatibility scoring rather than managing unstructured CVs' },
              { label: 'Flight Training Organizations', desc: 'demonstrate graduate placement outcomes, connect students to live pathways, and validate competency-based progression' },
              { label: 'Type Rating Centers', desc: 'publish verified endorsement records, track simulator sessions, and integrate competency assessments directly into pilot profiles' },
              { label: 'Military & Defence Commands', desc: 'facilitate military-to-civilian transition with rank equivalency mapping and security clearance transfer protocols' },
              { label: 'Aviation Universities & Academies', desc: 'align academic pathways with industry requirements, enable credit recognition, and connect research to career outcomes' },
              { label: 'Banking & Financial Institutions', desc: 'access live career trajectory data to accurately price aviation loans, assess risk, and model income-based repayment' },
              { label: 'Aviation Insurance Providers', desc: 'underwrite on verified, real-time pilot records with dynamic premium calculation based on actual flight hours and incident history' },
              { label: 'Legal & Regulatory Bodies', desc: 'receive structured, auditable, automated compliance data with jurisdiction-specific requirement tracking and regulatory change notifications' },
              { label: 'Credit Rating Agencies', desc: 'apply aviation-specific scoring models incorporating flight experience, type ratings, and employment stability to accurately assess pilot creditworthiness' },
              { label: 'Verification API Providers', desc: 'integrate background check systems with blockchain credential storage and deliver real-time verification status updates at scale' },
              { label: 'Flight Data & Navigation Apps', desc: 'synchronize logbook data and telemetry with automatic flight hour validation, route analysis, and profile enrichment' },
              { label: 'Aeromedical Examiners (AMEs)', desc: 'connect medical certificate status directly to pilot profiles with automated expiration alerts and telemedicine integration for remote pilots' },
              { label: 'Simulator Data Providers', desc: 'validate training hours with session recording, performance metrics, and instructor certification tracking tied to pilot records' },
              { label: 'Pilot Mentors & Unions', desc: 'enable peer-to-peer mentorship matching, knowledge sharing, and collective bargaining power informed by real supply and demand analytics' },
              { label: 'Aircraft Manufacturers & OEMs', desc: 'signal fleet demand to the training pipeline, connect type rating centers to operators, and close the gap between production and pilot readiness' },
              { label: 'Aviation Media & Publications', desc: 'access industry trend data, market intelligence, and career development content to inform editorial and audience development strategies' },
              { label: 'Humanitarian & NGO Missions', desc: 'verify volunteer pilot credentials instantly for disaster response coordination and certify humanitarian flight hours toward professional recognition' },
              { label: 'Career Fairs & Aviation Events', desc: 'integrate digitally with virtual recruitment events, automate candidate scheduling, and deliver post-event analytics and follow-up pipelines' },
              { label: 'Government Aviation Authorities', desc: 'automate cross-border license recognition, streamline international permit validation, and receive structured compliance submissions in real time' },
              { label: 'International Aviation Organizations', desc: 'harmonize cross-border standards, track ICAO compliance, and establish multinational certification pathways under a unified data layer' },
              { label: 'Pilots', desc: 'build a live, verified, portable professional identity that moves across every operator, every sector, and every stage of a career — no longer tied to a single employer or static document' },
            ].map((item) => (
              <li key={item.label} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong className="text-red-600">{item.label}</strong> — {item.desc}</span>
              </li>
            ))}
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            This document is the complete operational blueprint for that system. It defines what every stakeholder contributes, what they receive, how the data flows, how value is distributed, and how the global aviation economy becomes unified — for the first time — <strong>under one framework.</strong>
          </p>

          <hr className="my-10 border-slate-300" />

          {/* Part II */}
          <h1 id="part-ii-hub-a" className="text-4xl font-bold text-slate-900 mt-12 mb-6 pb-4 border-b-2 border-slate-900 scroll-mt-24">
            PART II: HUB A — OPERATIONS &amp; RECRUITMENT
          </h1>

          <h2 id="pillar-1-commercial-airlines" className="text-2xl font-bold text-slate-800 mt-8 mb-4 pb-2 border-b border-slate-300 scroll-mt-24">
            PILLAR 1: COMMERCIAL AIRLINES
          </h2>

          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3 scroll-mt-24">The Problem: Recruitment Friction and Information Asymmetry</h3>

          <p className="text-slate-700 leading-relaxed mb-4">Commercial airlines face a consistent set of operational challenges in pilot recruitment that <strong>no existing platform has solved.</strong> The problem exists on both sides of the hiring relationship simultaneously.</p>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">Pain Points for Airlines:</h4>
          <ul className="space-y-2 mb-6">
            {[
              { n: '1', t: 'Volume without quality', d: '500+ applications per opening, majority unqualified. Sorting consumes HR resources.' },
              { n: '2', t: 'Static, outdated data', d: 'CVs submitted are months or years old; hours, ratings, medical status unknown.' },
              { n: '3', t: 'No pre-qualification', d: 'Aptitude and competency alignment unknown until interview stage.' },
              { n: '4', t: 'Manual compliance', d: 'Background checks, license verification, and data handling require manual export/import.' },
              { n: '5', t: 'Unpredictable pipelines', d: 'No visibility into qualified candidate pools until posting goes live.' },
              { n: '6', t: 'High washout rates', d: '35–45% of hired pilots fail to complete training or leave within 12 months.' },
            ].map((item) => (
              <li key={item.n} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong className="text-red-600">{item.n}. {item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">Pain Points for Pilots:</h4>
          <ul className="space-y-2 mb-6">
            {[
              { n: '1', t: 'No central directory', d: 'Job posts scattered across social media, professional networks, and generic boards. No single source of truth exists — pilots must actively monitor 10+ platforms just to stay informed.' },
              { n: '2', t: 'Opaque requirements', d: 'Exact hours, ratings, and competency expectations are rarely published clearly. Airlines post vague descriptions with terms like "competitive experience" — leaving pilots to guess.' },
              { n: '3', t: 'No self-alignment tool', d: 'Pilots cannot compare their profile against requirements before expressing interest. They discover disqualifying gaps only after submitting — wasting time on both sides.' },
              { n: '4', t: 'Outdated and unverified postings', d: 'Requirements change constantly. Pilots align their training and investment to postings that are months or years old, often never updated after initial publication.' },
              { n: '5', t: 'Expectations posted on unprofessional platforms', d: 'Airline requirements frequently appear on Facebook groups, WhatsApp threads, and generic job boards — platforms with no version control, no accountability, and no verification. A pilot making a $30,000 type rating decision should not be sourcing requirements from a Facebook post.' },
              { n: '6', t: 'Airline expectations never formally published', d: 'Many airlines have never formally documented what they expect from candidates. Requirements exist internally but are never shared with the pilot community in a structured, accessible format. Pilots are expected to align to a standard that has never been written down.' },
              { n: '7', t: 'No demand signals', d: 'Fleet expansion, new route launches, and type rating demand are invisible to pilots. Investment decisions — type ratings costing $20,000–$50,000 — are made without visibility into what operators actually need over the next 12–24 months.' },
              { n: '8', t: 'ATLAS CV formatting unknown to most pilots', d: 'ATLAS is the aviation-specific CV standard purpose-built for airline recruitment systems. Greenhouse is a widely used enterprise ATS platform adopted by major carriers. Both systems parse structured data fields — not free-text paragraphs. A pilot submitting a standard Word document CV into either system will have their profile parsed incorrectly, ranked lower, or dropped entirely. The vast majority of pilots have never heard of ATLAS formatting or Greenhouse — and submit CVs that are incompatible by default.' },
              { n: '9', t: 'ATS systems filter out high-value profiles invisibly', d: 'Greenhouse and ATLAS-integrated airline systems pre-screen applications before any human review. A pilot with 8,000 hours, an A320 type rating, and an exceptional EBT score can be automatically filtered out because their CV structure does not match the parser\'s expected field layout. No rejection email. No feedback. No explanation. The pilot assumes the airline wasn\'t hiring. The airline assumes no qualified candidates applied. Both are wrong — the system simply never surfaced the match.' },
              { n: '10', t: 'Unverified status', d: 'No differentiation exists between a verified, current pilot profile and a stale CV submitted by someone who left the industry two years ago. Airlines receive both identically — with no way to distinguish currency, recency, or actual readiness.' },
            ].map((item) => (
              <li key={item.n} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong className="text-red-600">{item.n}. {item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3 scroll-mt-24">The Platform Solution</h3>
          <p className="text-slate-700 leading-relaxed mb-6">Pillar 1 addresses both sides through <strong>two connected interfaces</strong> — one for pilots, one for airlines — operating on the same live data layer.</p>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">Core Terminology: What We Changed and Why</h4>
          <p className="text-slate-700 leading-relaxed mb-4">Every word on this platform is deliberate. Job board language frames pilots as applicants begging for attention. PilotRecognition reframes the relationship — <strong>pilots are professionals building a verified identity, not candidates submitting CVs into a void.</strong> Every terminology change below reflects that shift.</p>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-3 font-semibold text-red-400">OLD (Job Board)</th>
                  <th className="text-left px-4 py-3 font-semibold" style={{ color: '#34d399' }}>NEW (Recognition Platform)</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-300">Why It Matters</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { old: '"Apply Now"', newTerm: '"Submit Interest"', why: 'Applying implies desperation and a power imbalance. Submitting interest signals that the pilot is discoverable — operators come to them.' },
                  { old: '"Hiring" / "Hiring Now"', newTerm: '"Active" / "High Interest" / "Selecting"', why: 'Hiring is transactional. "Selecting" implies a deliberate process where both sides assess fit — not a mass intake.' },
                  { old: '"Career"', newTerm: '"Professional" / "Recognition" / "Pathway"', why: '"Career" is vague and passive. "Recognition" is active — it\'s something you build and earn, not something that happens to you.' },
                  { old: '"Job"', newTerm: '"Pathway" / "Opportunity"', why: 'A job is a transaction. A pathway is a direction — it implies progression, alignment, and a destination beyond the immediate role.' },
                  { old: '"Job Board"', newTerm: '"Recognition & Information Platform"', why: 'Job boards are databases of postings. PilotRecognition is a live infrastructure connecting verified data across the entire aviation ecosystem.' },
                  { old: '"Placement"', newTerm: '"Discovery" / "Connection"', why: 'Placement treats pilots like inventory to be moved. Discovery means pilots and operators find each other through shared, verified data.' },
                  { old: '"Get Hired"', newTerm: '"Get Recognized"', why: 'Getting hired is the outcome of a transaction. Getting recognized is the outcome of building something real — a verified professional identity.' },
                  { old: '"Career Path"', newTerm: '"Professional Pathway"', why: 'Pathways are specific, structured, and data-driven. Career paths are abstract. Pilots need to know exactly what\'s required at each step.' },
                  { old: '"Hiring Managers"', newTerm: '"Pathway Managers"', why: 'Airlines and operators aren\'t just hiring — they\'re managing structured pathways with defined requirements, thresholds, and intake signals.' },
                  { old: '"Job Openings"', newTerm: '"Pathway Openings"', why: 'Openings are reactive and temporary. Pathway openings are part of a live, structured requirement — tied to fleet growth, not just a vacancy.' },
                  { old: '"Recruitment"', newTerm: '"Pathway Teams" / "Discovery"', why: 'Recruitment is a push model. Discovery is pull — operators access a verified pool rather than pushing job posts into a noisy market.' },
                  { old: '"Application" (verb)', newTerm: '"Submit Interest"', why: 'Applying places the burden on the pilot and the power with the operator. Submitting interest is a mutual signal — it triggers a discovery process, not a review pile.' },
                  { old: '"Career Portals"', newTerm: '"Pathway Portals"', why: 'Portals for careers are generic. Pathway portals are structured entry points into specific, verified, requirement-mapped opportunities.' },
                ].map((row, i) => (
                  <tr key={row.old} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-3 border-b border-slate-700 text-red-400 font-medium align-top whitespace-nowrap">{row.old}</td>
                    <td className="px-4 py-3 border-b border-slate-700 text-slate-100 font-medium align-top whitespace-nowrap">{row.newTerm}</td>
                    <td className="px-4 py-3 border-b border-slate-700 text-slate-400 align-top">{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mt-8 mb-3">Industry Pain Points Directly Affecting the Commercial Sector</h4>
          <p className="text-slate-700 leading-relaxed mb-2">
            The commercial aviation sector is caught in a structural disconnect that no existing platform has addressed. Flight training organisations produce pilots. Airlines require pilots. And yet the two sides operate in near-total informational isolation — producing a gap that costs the industry <strong>billions annually in hiring friction, washout losses, and misaligned investment.</strong>
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The table below maps what the training pipeline delivers against what commercial operators actually assess — and where PilotRecognition intervenes to close that gap with verified, structured, live data.
          </p>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-3 font-semibold">Flight School Teaches</th>
                  <th className="text-left px-4 py-3 font-semibold text-red-400">Industry Actually Wants</th>
                  <th className="text-left px-4 py-3 font-semibold" style={{ color: '#34d399' }}>PilotRecognition Bridges</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { school: 'Stick-and-rudder skills', industry: '9 core competencies', bridge: 'EBT-aligned assessment' },
                  { school: 'Hours logged', industry: 'Behavioral patterns', bridge: 'Video scoring & analysis' },
                  { school: 'Checkrides passed', industry: 'Simulator performance', bridge: 'Assessment preparation' },
                  { school: '"Get 1500 hours"', industry: 'Specific operator pathways', bridge: 'Gap analysis & targeting' },
                  { school: 'Generic resume advice', industry: 'ATS-optimized CVs', bridge: 'ATLAS formatting' },
                  { school: 'Hope and luck', industry: 'Verified Recognition Profile', bridge: 'Industry-ready portfolio' },
                ].map((row, i) => (
                  <tr key={row.school} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.school}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-red-400 font-medium">{row.industry}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-100 font-medium">{row.bridge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <hr className="my-6 border-slate-200" />

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">FOR PILOTS: Career Pathways Page</h4>
          <p className="text-slate-700 leading-relaxed mb-4">A browsable directory of <strong>verified airline pathways</strong> with structured, timestamped requirement data. Each pathway card contains:</p>
          <ul className="space-y-1 mb-4">
            {[
              'Minimum flight hours (total, PIC, multi-engine, instrument)',
              'Required/preferred type ratings',
              'Medical certificate class required',
              'Age and nationality/residency eligibility',
              'ICAO language proficiency level (4/5/6)',
              'Recognition Score minimum threshold',
              'Experience level accepted (low-timer / mid-timer / high-timer)',
              'Type rating sponsorship status',
              'Current intake status: Open / Closed / Paused / Future Demand',
              'Last updated timestamp',
            ].map((item) => (
              <li key={item} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 mt-1 flex-shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-700 leading-relaxed mb-2 font-semibold">Alignment Tools:</p>
          <ul className="space-y-1 mb-6">
            {[
              'Live profile comparison against any pathway — exact gaps displayed',
              'Alerts when saved pathways update requirements',
              'Fleet demand visibility before type rating investment',
              'Aptitude pre-check before interest submission',
            ].map((item) => (
              <li key={item} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 mt-1 flex-shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <hr className="my-6 border-slate-200" />

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">FOR AIRLINES: Expectation Page</h4>
          <p className="text-slate-700 leading-relaxed mb-4">A structured, maintained profile <strong>replacing uncoordinated job posts.</strong> All fields timestamped and current. Profile fields include:</p>

          {[
            { heading: 'Identity & Operations', items: ['Airline name, ICAO/IATA code, domicile', 'Operating bases and hubs', 'Operational type (full-service, low-cost, regional, wet lease)'] },
            { heading: 'Fleet Information', items: ['Active aircraft types and fleet size', '12-month fleet outlook (additions, phase-outs)', 'Type rating demand signals'] },
            { heading: 'Intake Preferences', items: ['Position types (SO, FO, Captain, Direct Entry)', 'Experience levels sought', 'Type rating requirements', 'Background preferences (ATO, military, commercial, cadet)', 'Foreign pilot policy', 'Language requirements', 'Recognition Score range'] },
            { heading: 'Hiring Signal', items: ['Live Open / Closed / Paused status', 'Next window estimates', '12–24 month headcount forecast by role'] },
            { heading: 'Integration', items: ['ATS API connection', 'GDPR/PDPA-compliant data flow', 'No manual export/re-entry'] },
          ].map((section) => (
            <div key={section.heading} className="mb-4">
              <p className="text-slate-700 font-semibold mb-1">{section.heading}:</p>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                    <span className="text-slate-400 mt-1 flex-shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4 scroll-mt-24">Operational Outcomes</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Metric</th>
                  <th className="text-left px-4 py-2 font-semibold">Before</th>
                  <th className="text-left px-4 py-2 font-semibold text-red-400">After</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { metric: 'Time-to-hire', before: '6–12 months', after: '2–4 weeks (75% reduction)' },
                  { metric: 'Candidate washout rate', before: '35–45%', after: '<10%' },
                  { metric: 'Applications per opening', before: '500+ random CVs', after: 'Pre-filtered, verified only' },
                  { metric: 'Profile data freshness', before: 'Months/years old', after: 'Live real-time updates' },
                  { metric: 'Annual ROI (100-pilot target)', before: '—', after: '$1.2–2.4M' },
                ].map((row, i) => (
                  <tr key={row.metric} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">{row.metric}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-red-400">{row.before}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-100 font-medium">{row.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4 scroll-mt-24">Commercial Tiers</h3>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Tier</th>
                  <th className="text-left px-4 py-2 font-semibold">Monthly Fee</th>
                  <th className="text-left px-4 py-2 font-semibold">Features</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tier: 'Basic', fee: '$500', features: 'Pathway listing, 10 profile pulls/month' },
                  { tier: 'Professional', fee: '$1,000', features: '50 profile pulls, aptitude access, ATS integration' },
                  { tier: 'Enterprise', fee: '$2,500', features: 'Unlimited pulls, custom EBT development, dedicated support' },
                ].map((row, i) => (
                  <tr key={row.tier} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">{row.tier}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-red-400 font-semibold">{row.fee}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.features}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-slate-600 text-sm mb-8"><strong>Success Fee:</strong> $500 per confirmed hire (waived for first 10 hires)</p>

          <hr className="my-10 border-slate-300" />

          <p className="text-xs text-slate-400 text-center">Universal Commercial Framework · PilotRecognition.com · Official Release Document · Version 10.0-Expanded</p>

        </article>
      </div>
    </div>
  );
}
