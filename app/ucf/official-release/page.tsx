'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const navSections = [
  { id: 'document-information', label: 'Document Information' },
  { id: 'part-i-foundation-vision', label: 'Part I: Foundation & Vision' },
  { id: 'page-1-executive-summary', label: '→ Page 1: Executive Summary', indent: true },
  { id: 'the-aviation-industry-operating-system', label: '→ The Aviation Industry OS', indent: true },
  { id: 'part-ii-hub-a', label: 'Hub A — Pathways & Expectations' },
  { id: 'pillar-1-commercial-airlines', label: '→ Pillar 1: Commercial Airlines', indent: true },
  { id: 'pillar-2-cargo-freight', label: '→ Pillar 2: Cargo & Freight Operators', indent: true },
  { id: 'pillar-3-charter-business', label: '→ Pillar 3: Charter & Business Aviation', indent: true },
  { id: 'pillar-4-emerging-sectors', label: '→ Pillar 4: Emerging Aviation Sectors', indent: true },
  { id: 'pillar-11-verification', label: '→ Pillar 11: Background Checks & Verification', indent: true },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const navHeight = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  }
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
          <p className="text-slate-500 text-sm mb-2 uppercase tracking-wide font-semibold">Pathways &amp; Expectations</p>
          <p className="text-slate-600 leading-relaxed mb-8">Hub A covers every operator sector that recruits professional pilots — commercial airlines, cargo &amp; freight, charter &amp; business aviation, and emerging sectors. Each pillar publishes structured pathway cards with verified requirements, hiring signals, and gap analysis tools. Operators publish what they expect. Pilots see exactly where they stand.</p>

          <h2 id="pillar-1-commercial-airlines" className="text-2xl font-bold text-slate-800 mt-8 mb-4 pb-2 border-b border-slate-300 scroll-mt-24">
            PILLAR 1: COMMERCIAL AIRLINES
          </h2>

          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3 scroll-mt-24">The Problem: Recruitment Friction and Information Asymmetry</h3>

          <p className="text-slate-700 leading-relaxed mb-4">Commercial airlines face a consistent set of operational challenges in pilot recruitment that <strong>no existing platform has solved.</strong> The problem exists on both sides of the hiring relationship simultaneously.</p>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">Pain Points for Airlines:</h4>
          <ul className="space-y-2 mb-6">
            {([
              { n: '1', t: 'Volume without quality', d: <><strong>500+ applications per opening</strong>, majority unqualified. Sorting consumes HR resources with <strong>no automated pre-filtering</strong> in place.</> },
              { n: '2', t: 'Static, outdated data', d: <>CVs submitted are <strong>months or years old</strong>; hours, ratings, and <strong>medical status are unknown</strong> and unverifiable at point of receipt.</> },
              { n: '3', t: 'Poor profile matching, scoring, and pre-qualification', d: <><strong>Aptitude and competency alignment</strong> remain unknown until the interview stage — the costliest point in the hiring cycle to discover a mismatch. Airlines have <strong>no automated scoring or matching layer</strong> to rank candidates against their own requirements before interviews are scheduled. Pre-qualification assessments, where they exist, are built against <strong>outdated job posts</strong> — requirements that have not been updated since the original posting went live. The result: candidates are assessed against criteria that <strong>no longer reflect what the airline actually needs</strong>, and high-value pilots are rejected while mismatched candidates advance. There is no live, dynamic matching between <strong>verified pilot profiles and current operator requirements</strong>.</> },
              { n: '4', t: 'Manual compliance and recruitment agency delegation', d: <>Airlines <strong>delegate recruitment to third-party agencies</strong> not because they want to — but because they simply <strong>do not have the internal capacity</strong> to process the volume of applications themselves. This delegation introduces a critical quality gap: agencies are incentivised to fill positions, not to find the best fit. <strong>Background checks, license verification, and data handling</strong> require manual export/import across disconnected systems — creating delays, duplication, and compliance risk at every handoff. The deeper cost is invisible: a <strong>flight instructor with 15 years of experience</strong>, 6,000 hours, and an exceptional competency record can be passed over entirely — not because they are unqualified, but because <strong>no system surfaced them</strong>. Agencies work from volume, not depth. High-value profiles that do not conform to standard CV formats, or that sit outside the agency's immediate search criteria, are <strong>systematically missed</strong>. The airline never knows what it lost.</> },
              { n: '5', t: 'Unpredictable pipelines and job board dependency', d: <>Airlines rely on job boards as their primary distribution channel — platforms that are <strong>nothing more than a place to push a post and pull in unfiltered responses</strong>. Job boards have <strong>no aviation background, no understanding of pilot qualifications</strong>, and no ability to distinguish a 200-hour student from a 10,000-hour captain. They are generic infrastructure being used for a highly specialised, safety-critical profession. Meanwhile, <strong>most experienced pilots actively disregard job boards</strong> — they prefer networking, direct industry connections, and submitting interest through professional channels. Applying via a generic job board feels transactional and beneath the profession. <strong>Submitting interest is professional. Applying to a job post is not.</strong> The result: airlines post on job boards, the best pilots never see it, and the pipeline fills with volume instead of quality. There is <strong>no visibility into qualified candidate pools</strong> until a posting goes live. Airlines react to vacancies rather than managing a <strong>proactive, pre-verified pipeline</strong> — and the job board model structurally prevents that from ever changing.</> },
              { n: '6', t: 'High washout rates and the cadet program chokehold', d: <><strong>35–45% of hired pilots</strong> fail to complete training or leave within 12 months — a direct consequence of <strong>poor pre-hire alignment</strong> between candidate profile and operator expectations. Cadet programmes across the region — including <strong>zero-to-hero streams</strong> — accept candidates with no prior flight experience, no aviation presence, and no demonstrated aptitude for the environment. Aviation is <strong>not a desk job and not a degree you can study your way through</strong>. Ground knowledge and flight performance are two entirely different capabilities — a student who has read every textbook will never carry the same weight as a flight instructor with real hours and real decisions behind them. <strong>A ground instructor and a flight instructor are not the same role.</strong> When airlines select cadets without flight background, they are making a costly assumption about trainability. Many burn out or wash out mid-training — not from lack of effort, but from a fundamental <strong>mismatch between academic performance and operational reality</strong>. Compounding this is the industry's accelerating shift to <strong>Evidence-Based Training (EBT)</strong> — a paradigm that moves the question from <em>"Can you fly the plane?"</em> to <em>"Are you mentally capable of handling the situation?"</em> Airlines are now facing cohorts of pilots who were trained under old standards and are <strong>unprepared for EBT assessment frameworks</strong>. The industry has a chokehold on who gets access and who gets selected — and the current selection model is producing the wrong outcomes.</> },
              { n: '7', t: 'No access to a verified, live pilot database', d: <>Airlines have <strong>no centralised, verified database</strong> of available pilots to pull from — and critically, no access to <strong>real-time pilot profiles</strong>. When a pilot flies today, their hours should update today. Their profile should reflect who they are <em>right now</em> — not who they were when they last updated a Word document. That infrastructure <strong>does not exist anywhere in the industry</strong>. Beyond currency, operators have no ability to distinguish between <strong>low-risk and high-risk pilot profiles</strong> — a distinction that is directly relevant to <strong>aviation insurance underwriters</strong> who need to assess liability exposure before an operator commits to a hire. A pilot's EBT interview score, their verified flight hours, their medical status, their training history — including <strong>incident history, crash landings, gear-up landings, and failed checkrides during training</strong> — are all data points that underwriters need and currently cannot access in a structured, verified format. PilotRecognition changes this through a <strong>consent-based data model</strong>: when a pilot submits interest against a pathway, they are explicitly consenting to their profile being accessed across all verified areas — flight hours, experience, medical certification, background checks, and EBT assessment results. <strong>Recognition+ members</strong> who have aligned their profiles to a specific pathway post represent the highest-quality pool available — pilots who have already undergone verification in multiple areas and have actively signalled readiness. The airline is not receiving 500 unfiltered CVs. They are accessing a <strong>pre-verified, consent-authorised, live profile pool</strong> — with risk distinction built in.</> },
              { n: '8', t: 'No international, aviation-specific background screening standard', d: <>Background checks in aviation are <strong>fragmented, slow, and inconsistent</strong>. A thorough check — covering criminal history, license authenticity, employment records, and medical certification across multiple jurisdictions — can take <strong>weeks or even months</strong>. There is no unified, internationally recognised screening framework with <strong>aviation stakeholders actively involved</strong>. Each airline runs its own process in isolation, with no shared infrastructure, no common standard, and no ability to leverage checks already completed by other operators. Standard commercial screening firms have access only to <strong>basic employment history</strong> — they do not have access to the deeply siloed records required for aviation safety. A critical and largely unaddressed gap is <strong>pilot life insurance</strong>. Most verification providers have no visibility into a pilot's life insurance coverage, policy structure, or beneficiary arrangements — data that is directly relevant to aviation safety risk assessment. The industry learned this the hard way: in <strong>April 1994</strong>, an off-duty flight engineer attempted to hijack a cargo aircraft and crash it deliberately, with the intent of making his death appear accidental so his family could collect a <strong>$2.5 million life insurance payout</strong>. The flight crew survived by overpowering him, but the incident exposed a structural blind spot — <strong>no pre-hire screening process had flagged the financial motive</strong>. The incident prompted significant changes to cockpit security and internal risk protocols, but it did not produce a unified, internationally standardised framework for pilot background screening. <strong>Pilot background data remains fragmented across airlines, government entities, regulators, and jurisdictions.</strong> The infrastructure to consolidate, verify, and share this data across operators — with appropriate consent and governance — <strong>still does not exist at the industry level.</strong></> },
              { n: '9', t: 'No real-time, accurate data on the pilot market — and the real pilot shortage story', d: <>Airlines make <strong>critical workforce planning decisions</strong> — fleet orders, route expansions, cadet program launches — based on assumptions, not data. The industry publishes forecasts of a <strong>global pilot shortage</strong>. But what those forecasts do not capture is what is actually happening at ground level. Consider a real case: a pilot — son of a senior Rolls-Royce engine technician, someone who grew up around aviation at the highest level — invested <strong>over $100,000 USD</strong>, accumulated <strong>700 hours</strong>, earned an <strong>ATR type rating</strong>, holds an <strong>AMT licence</strong> with a <strong>B737 rating</strong>, and called the platform one day to say: <em>"I quit flying. If I don't stop now, I will never recover my investment."</em> <strong>No placement. No recognition. No pathway.</strong> The industry told him there was a shortage. The shortage was real — but he was invisible to it. This is not an isolated case. <strong>Student pilots graduate with 200 hours</strong>, having spent $50,000 on flight training, and are immediately labelled low-timers and inexperienced. <strong>Flight instructors with 6,000 hours</strong> are still flight instructors — not because they lack capability, but because they are <strong>safeguarding their position</strong> in an industry with no stability, no demand signals, and a <strong>six-month process of wasted time and money</strong> just to attempt an airline application. Many gamble on a type rating — often a <strong>CAT 3 rating instead of starting with a CAT 1</strong> — because there is no structured information or guidance available. They are left with a rating they cannot monetise, a <strong>six-month recurrency requirement</strong>, a non-refundable, non-transferable investment — and the quiet realisation that they might have been better off buying a Cessna 152. Those who do secure an A320 type rating are often <strong>paying just to have it on their licence</strong> — with no pathway in sight. Meanwhile, <strong>flight instructors are promising their students the dream</strong> — when they themselves are trapped and cannot get out. The industry is running on <strong>hopes and ambitions</strong>, not infrastructure. And at the top of the pipeline — <strong>airline pilots with 12+ years of service</strong> are bored, under-recognised, and the only reason they are still with the same operator is <strong>seniority benefits</strong>. They want to move. They cannot — because the system offers no portable recognition for what they have built. The platform is also addressing a critical information gap: pilots are making <strong>$20,000–$50,000 type rating decisions</strong> based on packages marketed by type rating centres — with no direct access to manufacturer data, no objective stage mapping, and <strong>no clarity on what rating is appropriate for their current level</strong>. PilotRecognition is building direct information pathways from manufacturers so pilots receive <strong>accurate, stage-appropriate guidance</strong> — not a marketed package. The data on pilot availability exists. What has never existed is a platform to <strong>aggregate it, verify it, and make it visible</strong> — so that airlines can see in real time who is ready, where they are, and what they hold.<br /><br /><em>The shortage is not a lack of pilots. It is a lack of recognition infrastructure. That is what we are building.</em></> },
            ] as { n: string; t: string; d: React.ReactNode }[]).map((item) => (
              <li key={item.n} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong className="text-red-600">{item.n}. {item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">Pain Points for Pilots:</h4>
          <ul className="space-y-2 mb-6">
            {([
              { n: '1', t: 'No central directory — and no trusted source', d: <>Job posts are scattered across <strong>social media, professional networks, and generic boards</strong> with no single source of truth. Pilots must actively monitor <strong>10+ platforms</strong> just to stay informed — and most of what they find cannot be trusted. The majority of aviation job listings are managed by <strong>recruitment agencies or non-pilot-operated boards</strong> run by people with no aviation background, no understanding of pilot credentials, and no accountability for the accuracy of what they post. These platforms carry <strong>low trust and low visibility</strong> within the professional pilot community precisely because experienced pilots know what they are — marketing channels, not professional industry infrastructure. <strong>The noise drowns the signal.</strong> It extends to direct interactions as well: a pilot who walks into an airline's offices to enquire about opportunities is routinely told to <strong>"search online"</strong> — directed back into the same fragmented, untrustworthy environment they were trying to bypass. That moment — a motivated, professional pilot making a direct approach and being handed a generic redirect — <strong>destroys the airline's reputation in the eyes of that pilot instantly.</strong></> },
              { n: '2', t: 'Opaque requirements and misaligned career investment', d: <>Exact hours, ratings, and competency expectations are <strong>rarely published clearly</strong>. Airlines post vague descriptions with terms like <strong>"competitive experience"</strong> — leaving pilots to guess. When an hour requirement is published, it is almost never broken down into what actually matters: <strong>1,500 hours — but what kind?</strong> Multi-engine? Cross-country? Pilot-in-Command? Dual instruction received? These distinctions are not interchangeable, and a pilot who has 1,500 hours predominantly in single-engine dual time is a <strong>fundamentally different candidate</strong> to one with 1,500 hours of multi-engine PIC. Airlines know this. Pilots are not told. The result is that pilots are aligning their training investment — <strong>years of their career and tens of thousands of dollars</strong> — to requirements they have never seen in full. A question that almost no job post answers directly: <strong>are they open to foreign nationals, or is this position for citizens of that country only?</strong> Visa sponsorship, work permit requirements, and nationality restrictions are routinely omitted from postings — leaving international pilots to invest time in an application process that was never open to them. Job boards list the opening but lack the tools, structured fields, and live data integration to give a pilot a <strong>complete, up-to-date match against their actual profile</strong> — nationality, hours by type, ratings, medical status, and EBT readiness included. What pilots need, and what does not exist anywhere in the industry, is <strong>direct communication with operators and genuine industry recognition</strong> — not a posted vacancy on a generic platform, but a live, structured pathway that says: here is what we require, here is where you stand, and here is what you need to close the gap. PilotRecognition is building direct information pathways so pilots know exactly what hours are required by type, whether they are eligible as a foreign national, and what type rating investment is aligned to their stage — <strong>before they commit.</strong></> },
              { n: '3', t: 'No self-alignment tool — and no gap resolution pathway', d: <>Pilots <strong>cannot compare their profile against requirements</strong> before expressing interest. They discover disqualifying gaps only after submitting — <strong>wasting time on both sides</strong>. A job board tells you what an airline requires. It does not tell you <strong>what you are lacking, what you are missing, or how to solve it.</strong> There is no tool in existence today that takes a pilot's current profile — their hours by type, their ratings, their medical status, their EBT readiness, their background check status — and maps it in real time against an airline's published pathway expectations to produce a <strong>clear, actionable gap analysis</strong>. PilotRecognition introduces exactly that. The platform's profile matching engine compares a pilot's live profile against pathway requirements and surfaces <strong>precisely what is missing and what needs to be addressed</strong> before that pilot is in a position to submit interest. Beyond identifying gaps, the platform generates <strong>recommended pathways based on the pilot's interests, career stage, and development trajectory</strong> — showing not just where they fall short, but the structured route to close the gap. If a pathway post indicates that the operator requires background verification, the pilot is presented with two options: <strong>opt into their own background check process</strong>, or enrol in <strong>Recognition+</strong> — which already includes comprehensive background checking as part of the membership. The recommended pathway does not stop at gap identification. It tells the pilot <strong>how to get to the point</strong> where their profile aligns with what the airline has listed — whether that means building specific hour types, obtaining a particular rating, completing an EBT assessment, or achieving a preferred <strong>Recognition Score</strong> threshold based on hours, experience, age, endorsements, and verified competencies. <strong>The gap between a pilot and a pathway becomes visible, measurable, and solvable</strong> — for the first time.</> },
              { n: '4', t: 'Outdated and unverified postings — and the HR bombardment they cause', d: <>Requirements change constantly, but postings do not. <strong>Outdated posts remain live indefinitely</strong> — a position filled months ago still appears open, requirements that have been revised internally are never updated externally, and pilots are aligning their <strong>career trajectory, training investment, and pathway planning</strong> to a standard that <strong>no longer reflects what the airline actually needs</strong>. There is no version control, no expiry mechanism, and no accountability for accuracy on any platform currently used for aviation recruitment. The downstream consequence lands directly on the airline's own operations: <strong>HR departments are bombarded with thousands of enquiries and applications</strong>, the vast majority of which are not genuine expressions of qualified interest. They are the result of pilots chasing an outdated post with <strong>no alignment tool, no self-screening mechanism, and no way to know whether they even qualify</strong>. The airline's recruitment team spends its time processing noise — volume generated not by genuine candidate interest, but by <strong>an information environment it created and never maintained</strong>. Every hour spent filtering misaligned applications is an hour not spent evaluating the pilots who are actually ready.</> },
              { n: '5', t: 'Expectations posted on unprofessional platforms', d: <>Airline requirements frequently appear on <strong>Facebook groups, WhatsApp threads, and generic job boards</strong> — platforms with no version control, no accountability, and no verification. The result is an absurd but commonplace reality: an <strong>A320 Captain position</strong> — one of the most technically demanding and safety-critical roles in commercial aviation — posted on a general social platform that has <strong>nothing to do with aviation</strong>. A role that carries responsibility for hundreds of lives and millions of dollars of aircraft, reduced to a social media post between holiday photos and sponsored content. It is not taken seriously by the pilots it is trying to reach — and it should not be. A pilot making a <strong>$30,000 type rating decision</strong> should not be sourcing requirements from a Facebook post. There is no version control, no expiry, no professional standard, and <strong>no accountability for what is published</strong>. The platform has no aviation knowledge, no ability to verify the posting is current, and no mechanism to ensure the requirements listed are what the airline actually needs today. For a safety-critical, highly regulated profession, this is <strong>not an inconvenience — it is a structural disgrace.</strong></> },
              { n: '6', t: 'Airline expectations never formally published — and no structured way to present them', d: <>Many airlines have <strong>never formally documented</strong> what they expect from candidates. Requirements exist internally but are never shared with the pilot community in a structured, accessible format. Pilots are expected to <strong>align to a standard that has never been written down</strong>. There is currently no single place where an airline can direct a pilot to review their pathway requirements, understand what makes that operator the right choice, and <strong>compare it against other airlines in the region</strong>. Pilots have no structured way to evaluate why one airline is better aligned to their profile and career stage than another. Airlines have no structured way to present that case. The competitive differentiation that should drive pilot interest — remuneration, fleet type, base location, type rating sponsorship, career progression — <strong>exists nowhere in a comparable, accessible format.</strong> And there is a deeper question no airline currently answers publicly: <strong>why should a pilot choose you over the airline next door?</strong> Every aircraft is certified to the same standard. Every A320 type rating is the same rating. The plane does not change. <strong>What changes is the airline.</strong> Choosing an airline is a deeply personal decision — it affects a pilot's base, roster, quality of life, career trajectory, and whether they feel valued or disposable. Yet no platform exists where an airline can demonstrate its culture, its support infrastructure, its pilot development commitments, and its stance on pilot wellbeing in a way that is <strong>visible, comparable, and trusted by the pilot community</strong>. Is this airline <strong>pro-pilot</strong> — investing in people, supporting career progression, offering type rating sponsorship? Or are they <strong>anti-pilot</strong> — high attrition, poor rostering, pilots treated as a cost to be managed? That distinction <strong>does not exist anywhere in a structured, accessible format.</strong> Pilots find out after they join. Airlines wonder why retention is poor. PilotRecognition is that place — where operators can <strong>prove their commitment to pilots</strong> and pilots can make informed, values-aligned decisions <strong>before they commit.</strong></> },
              { n: '7', t: 'No demand signals and no fleet visibility', d: <>Fleet expansion, new route launches, and <strong>type rating demand are invisible</strong> to pilots. Investment decisions — type ratings costing <strong>$20,000–$50,000</strong> — are made without any visibility into what operators actually need over the next 12–24 months. A pilot considering a type rating needs to know not just what the airline currently operates, but what its <strong>future fleet trajectory looks like</strong>. If a pilot invests in an A330 type rating and the manufacturer releases a next-generation variant that renders the existing rating structurally obsolete or requires a full conversion — that pilot is left with an <strong>outdated, non-transferable credential</strong> and a career trajectory that has stalled at significant personal cost. Fleet transitions, aircraft retirements, and new variant introductions are <strong>never communicated to the pilot community</strong>. There is no channel, no platform, and no structured mechanism through which manufacturers or operators share forward-looking fleet demand data with pilots. <strong>Pilots are making irreversible financial decisions in an information vacuum</strong> — and the industry provides no infrastructure to change that. PilotRecognition is building direct pathways from manufacturers and operators so pilots have access to <strong>real fleet demand intelligence</strong> before they commit to a rating.</> },
              { n: '8', t: 'ATLAS CV formatting unknown to most pilots', d: <><strong>ATLAS</strong> is the aviation-specific CV standard purpose-built for airline recruitment systems. <strong>Greenhouse</strong> is a widely used enterprise ATS platform adopted by major carriers. Both systems parse <strong>structured data fields — not free-text paragraphs</strong>. A pilot submitting a standard Word document CV into either system will have their profile <strong>parsed incorrectly, ranked lower, or dropped entirely</strong>. The vast majority of pilots have never heard of ATLAS formatting or Greenhouse — and submit CVs that are <strong>incompatible by default</strong>.</> },
              { n: '9', t: 'ATS systems filter out high-value profiles invisibly', d: <>Greenhouse and ATLAS-integrated airline systems <strong>pre-screen applications before any human review</strong>. A pilot with <strong>8,000 hours, an A320 type rating, and an exceptional EBT score</strong> can be automatically filtered out because their CV structure does not match the parser's expected field layout. <strong>No rejection email. No feedback. No explanation.</strong> The pilot assumes the airline wasn't hiring. The airline assumes no qualified candidates applied. Both are wrong — <strong>the system simply never surfaced the match</strong>.</> },
              { n: '10', t: 'Unverified status', d: <>No differentiation exists between a <strong>verified, current pilot profile</strong> and a stale CV submitted by someone who left the industry two years ago. Airlines receive both identically — with <strong>no way to distinguish currency, recency, or actual readiness</strong>.</> },
              { n: '11', t: 'Background verification takes weeks — with no shared infrastructure', d: <>A pilot applying to multiple operators must <strong>undergo the same background checks repeatedly</strong> — each airline running its own fragmented process from scratch. Checks covering criminal records, license validity, employment history, and medical certification across international jurisdictions can take <strong>weeks or months to complete</strong>. There is no collaborative ecosystem, no shared verification backbone, and <strong>no aviation stakeholder framework</strong> to standardise or accelerate this process. PilotRecognition is building exactly that — a <strong>trusted, collaborative identity verification infrastructure</strong> for the global aviation industry, where a verified pilot profile carries recognised trust across every operator, every regulator, and every sector.</> },
              { n: '12', t: 'The next generation of aviation-heritage pilots is declining', d: <>Some of the most naturally capable pilots the industry will ever see are <strong>never entering it</strong>. Pilots with a hereditary aviation background — sons and daughters of captains, engineers, mechanics, and aviation professionals who grew up around aircraft, who understood the industry from childhood — are being <strong>actively advised by their own parents not to pursue aviation</strong>. Not because they lack the aptitude. Not because they lack the passion. But because the pilots who built their careers in this industry have <strong>watched it from the inside</strong> — and what they have seen is an industry with no clear entry pathway, no stability, no structured recognition for what you build, and a <strong>near-impossible career start</strong> that demands $50,000–$100,000 in training investment with no guarantee of a return. A captain who spent 30 years flying tells their child: <em>"Don't do what I did. There is no path."</em> That is not a recruitment problem. <strong>That is a structural failure of the entire industry ecosystem.</strong> The talent pipeline is not just clogged — it is being actively discouraged at the source. The most informed voices in aviation — the professionals who know it best — are steering the next generation away. Every aviation family that redirects their child toward a more stable profession represents <strong>a permanent loss to the industry's future capacity.</strong> On the other side — and this is where the damage is most severe — is the pilot with <strong>no aviation background whatsoever</strong>. No family in the industry. No insider knowledge. No one to tell them what they are walking into. These pilots blindly trust their flight school. They are told they will graduate and get into the airlines. They are not told about the 1,500-hour gap, the six-month airline application process, or that the flight instructor teaching them is himself still waiting after 15 years. They are not told that their $50,000 CPL will make them a <strong>low-timer with no placement pathway</strong>. They believe the brochure. They take the loan. And when concerns are raised — by peers, by industry voices, by the data — many enter a state of <strong>denial</strong>, convincing themselves that their $50,000 investment is secured, that the stories of pilots stuck without placement are someone else's problem, and that <strong>it simply could not happen to them</strong>. It does. Evidently and consistently, every pilot who graduates with a licence is labelled the same thing regardless of how much they spent or how hard they trained: <strong>a low-timer</strong>. The investment does not change the label. The hours do not lie. And the industry does not make exceptions. <strong>Approximately 80% of pilots entering the industry without an aviation heritage background fall into this void</strong> — no real expectations, no real industry knowledge, no structured guidance. When the reality hits — no airline call, no pathway, mounting debt, no direction — many are left in <strong>detrimental financial ruin</strong>. The flight school took the fees. The industry took the years. <strong>Nobody gave them the truth.</strong> These are not failed pilots. These are pilots who were failed by a system with no transparency and no accountability for the gap between what training promises and what the industry delivers. A structural turning point that accelerated this collapse was the <strong>2013 implementation of the 1,500-hour rule</strong> in the United States — a regulatory response to safety incidents that overnight doubled the minimum flight hours required for airline first officers from 250 to 1,500. The intent was safety. The consequence was a <strong>dramatic contraction of the entry pipeline</strong>. Training costs doubled. The time to reach airline eligibility extended by years. Pilots who had structured their careers, their finances, and their expectations around the 250-hour pathway were left stranded mid-investment. The rule shifted the talent landscape permanently — <strong>making commercial aviation inaccessible to a significant portion of the population</strong> who cannot sustain the financial burden of building 1,500 hours. The industry did not respond with infrastructure, guidance, or financial support. It simply raised the bar and left pilots to figure it out. The result is a <strong>generational loss of talent, money, and potential</strong> at the base of the pipeline — a collapsing foundation that the industry's shortage forecasts acknowledge in aggregate but have never addressed at the individual level. PilotRecognition exists to close that gap — with <strong>real expectations, real requirements, and a real pathway from day one.</strong><br /><br /><em>The shortage is not a lack of pilots. It is a lack of recognition infrastructure. That is what we are building.</em></> },
            ] as { n: string; t: string; d: React.ReactNode }[]).map((item) => (
              <li key={item.n} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong className="text-red-600">{item.n}. {item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3 scroll-mt-24">The Platform Solution</h3>
          <p className="text-slate-700 leading-relaxed mb-4">The pain points documented above are not abstract. They are the lived reality of every pilot in this industry and every airline that has ever tried to recruit from it. They have existed, unaddressed, for decades — not because the industry lacks capable people, but because it has never had the infrastructure to connect them correctly.</p>
          <p className="text-slate-700 leading-relaxed mb-4">Pillar 1 is the response. It addresses both sides through <strong>two connected interfaces</strong> — one for pilots, one for airlines — operating on the same live data layer. Together they do not just improve recruitment. <strong>They replace it.</strong></p>
          <p className="text-slate-700 leading-relaxed mb-3 font-semibold text-slate-800">The Flight Plan — Six Systemic Steps to Restoring Industry Order:</p>
          <ol className="space-y-3 mb-6 list-none">
            {[
              { n: '01', t: 'Establish a single source of truth', d: 'PilotRecognition becomes the central, trusted directory for the global pilot community — the one place where verified pilot profiles are maintained, pathway requirements are published by operators, and both sides can find each other without noise, fragmentation, or intermediaries.' },
              { n: '02', t: 'Replace static CVs with live, verified profiles', d: 'Pilot profiles on the platform update in real time as hours are logged, ratings are earned, medicals are renewed, and background checks are completed. Airlines are no longer reviewing documents — they are reviewing live professional identities that reflect exactly where a pilot stands today.' },
              { n: '03', t: 'Publish pathway requirements formally and comparably', d: 'Every operator on the platform publishes a structured Pathway Card — the exact hours by type, ratings required, EBT expectations, nationality eligibility, and Recognition Score threshold for each role. For the first time, pilots can see what every operator in the region actually requires, compare them side by side, and make informed, values-aligned career decisions before submitting a single expression of interest.' },
              { n: '04', t: 'Surface the gap — and the route to close it', d: "The platform's profile matching engine compares a pilot's live profile against every pathway they are eligible for and produces a clear, actionable gap analysis. Not just what is missing — but the recommended pathway to close it. The industry stops losing pilots to misalignment and starts retaining them through structured, achievable progression." },
              { n: '05', t: 'Shift from push applications to a pull system', d: 'Pilots build their verified profile once. Operators search, filter, and pull from the live database based on their exact requirements. The pilot is no longer chasing — they are discoverable. Airlines receive a shortlist of pre-matched, verified candidates instead of 500 unfiltered PDFs. Recruitment becomes precise, fast, and bilateral.' },
              { n: '06', t: 'Prove commitment — and rebuild trust at the base', d: 'Airlines that participate in the platform demonstrate publicly that they are pro-pilot — publishing real requirements, offering transparent pathway expectations, and committing to structured engagement with the pilot community. The industry stops haemorrhaging talent at the base because the people entering it — and the families advising them — can finally see a real, structured, navigable path forward.' },
            ].map(step => (
              <li key={step.n} className="flex items-start gap-3 text-slate-700 leading-relaxed">
                <span className="text-red-500 font-bold text-sm mt-1 flex-shrink-0">{step.n}</span>
                <span><strong className="text-slate-800">{step.t}</strong> — {step.d}</span>
              </li>
            ))}
          </ol>
          <p className="text-slate-700 leading-relaxed mb-6">This is not a product feature list. It is a <strong>structural restoration of the pipeline</strong> — from the captain advising their child not to enter aviation, to the flight school graduate who does not know what they are walking into, to the experienced pilot invisible to the shortage, to the airline spending months processing noise instead of finding talent. <strong>Every step of the flight plan addresses a documented failure. Every feature exists because the industry demanded it.</strong></p>

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

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-2 scroll-mt-24">Commercial Tiers — Two Distinct Pricing Models</h3>
          <p className="text-slate-700 leading-relaxed mb-6">Airlines access the platform through two independent products, each addressing a different need. <strong>Pathway Listings</strong> are for recruitment — posting structured pathway cards, pulling from the verified pilot database, and accessing EBT and profile data. <strong>Airline Expectations Page</strong> is a separate brand presence product — a dedicated listing on the Browse Airlines directory where pilots compare operators before deciding where to submit interest. These are not the same product and are priced independently.</p>

          <h4 className="text-lg font-bold text-slate-800 mb-3">Model 1 — Pathway Listings &amp; Pilot Database Access</h4>
          <p className="text-slate-600 text-sm mb-3">For airlines posting structured pathway requirements and pulling from the verified pilot database.</p>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Tier</th>
                  <th className="text-left px-4 py-2 font-semibold">Monthly Fee</th>
                  <th className="text-left px-4 py-2 font-semibold">Includes</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { tier: 'Basic', fee: 'Free', features: <>Post up to 3 pathway cards. <strong style={{color:'#dc2626'}}>View the first 10 pilots who submit interest</strong> — full profiles visible. <strong style={{color:'#dc2626'}}>Remaining interested pilots are blurred</strong> — giving you a live signal of demand without access to the full pool. <span style={{color:'#dc2626'}}>No database search or EBT score access.</span></> },
                  { tier: 'Enterprise', fee: '$1,000/yr', features: <><strong style={{color:'#dc2626'}}>Unlimited pulls</strong>, full EBT score access, custom EBT development, <strong style={{color:'#dc2626'}}>dedicated account support</strong>, API access, bulk pathway management.</> },
                ] as { tier: string; fee: string; features: React.ReactNode }[]).map((row, i) => (
                  <tr key={row.tier} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">{row.tier}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-red-400 font-semibold">{row.fee}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.features}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mb-3">Model 2 — Airline Expectations Page &amp; Browse Airlines Directory</h4>
          <p className="text-slate-600 text-sm mb-3">A separate product. This is the airline's public-facing presence on the platform — where pilots browse, compare, and decide which operators align with their values and career stage before submitting any interest.</p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Product</th>
                  <th className="text-left px-4 py-2 font-semibold">Annual Fee</th>
                  <th className="text-left px-4 py-2 font-semibold">What It Includes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tier: 'Airline Expectations Listing', fee: '$100/year', features: 'Dedicated airline profile on the Browse Airlines directory — culture, fleet, base locations, type rating sponsorship, career progression, pro-pilot commitments. Visible to all pilots on the platform. Comparable side-by-side against other operators in the region.' },
                ].map((row, i) => (
                  <tr key={row.tier} className="bg-slate-800">
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">{row.tier}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-red-400 font-semibold">{row.fee}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.features}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-slate-600 text-sm mb-8">The Browse Airlines directory surfaces the <strong>top-listed operators</strong> visible to every pilot on the platform. An airline that does not maintain its listing is invisible to pilots who are actively comparing their options. At <strong>$100 per year</strong>, this is the lowest-cost, highest-visibility brand presence available in professional aviation recruitment — and the only one where the audience is exclusively verified, career-active pilots.</p>
          <p className="text-slate-600 text-sm mb-6"><strong>Success Fee:</strong> $500 per confirmed hire (waived for first 10 hires)</p>

          <div className="my-6 px-5 py-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
            <p className="text-slate-800 text-sm leading-relaxed mb-2"><strong>Verification Cost Advantage for Airlines:</strong> Pilots on the platform self-verify their own credentials at account creation — identity, license, medical, employment history — stored in a portable digital wallet they own. When a pilot submits interest against your pathway, their core verification is <strong>already done.</strong> You are not paying to re-run checks you don't need.</p>
            <p className="text-slate-800 text-sm leading-relaxed mb-2">What you <em>can</em> optionally request — at your cost, on selected candidates only — are the <strong>airline-specific deeper checks</strong> that go beyond what a pilot self-verifies: criminal background (jurisdiction-specific), right-to-work validation, aviation security vetting, incident and insurance history, conduct records. These are operator-initiated, pilot-consented, and fully configurable per role.</p>
            <p className="text-slate-800 text-sm leading-relaxed"><strong>The saving:</strong> A pilot applying to 5 airlines on a traditional model generates 5 separate full background checks — each paid by a different airline, each starting from zero, each taking 2–4 weeks. On this platform, the same pilot's core verification is <strong>already complete and portable</strong>. You pay only for the operator-specific checks you actually need — on the shortlist you've already selected. <strong>Not on every applicant. Not from scratch. Not repeatedly.</strong></p>
          </div>

          <hr className="my-10 border-slate-300" />

          <h2 id="pillar-2-cargo-freight" className="text-4xl font-bold text-slate-900 mt-12 mb-6 pb-4 border-b-2 border-slate-900 scroll-mt-24">
            PILLAR 2: CARGO &amp; FREIGHT OPERATORS
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub A — Operations &amp; Recruitment</p>

          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Problem: An Entire Aviation Sector Hidden from the Pilot Pipeline</h3>
          <p className="text-slate-700 leading-relaxed mb-4">The industry presents pilots with a false binary: passenger airline or flight instructor. Cargo and freight aviation — a sector responsible for moving the world's goods, operating on every continent, and employing tens of thousands of professional pilots — is <strong>systematically absent from the pathways available to pilots at every level.</strong> It is not because cargo doesn't need pilots. It is because no structured channel exists to connect them.</p>
          <p className="text-slate-700 leading-relaxed mb-4">Cargo operations carry a different set of demands that generic aviation platforms cannot surface: 60–80% night operations, heavier autonomous decision-making requirements, heavy jet experience thresholds, and a lifestyle that is fundamentally distinct from passenger flying. Pilots who would thrive in cargo — and who are often <strong>immediately competitive for cargo roles</strong> while being years away from a passenger airline seat — are never shown the pathway. They stay stuck. The cargo operator gets a smaller, less aligned candidate pool. <strong>Both sides lose to the same information vacuum.</strong></p>
          <p className="text-slate-700 leading-relaxed mb-6"><strong>Pillar 2 addresses this with a dedicated cargo-specific pathway layer — structured operator profiles, night hours verification, heavy jet experience confirmation, and cargo-specific CBTA alignment. For the first time, pilots can compare cargo operators the same way they compare passenger carriers: requirements, roster patterns, command upgrade timelines, and salary transparency — all published, all current. Cargo becomes a visible, navigable, valued pathway. Not a fallback.</strong></p>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">The Untapped Pool: Pilots Already Ready for Cargo — Who Nobody Is Talking To</h3>
          <p className="text-slate-700 leading-relaxed mb-4">There is a category of pilot sitting in the clogged pipeline right now — experienced, operationally mature, and cargo-competitive — who has never been presented with a cargo pathway. They are not low-timers. They are <strong>flight instructors with 5,000–6,000 hours</strong>, built over 10–15 years of continuous flying. They have accumulated what cargo operations actually value most:</p>
          <ul className="space-y-2 mb-5">
            {([
              { t: 'Immense CRM depth', d: 'Years of two-crew and solo instruction builds crew resource management instincts that passenger cadet programs spend millions trying to replicate. These pilots have managed failures, emergencies, and high-workload scenarios — repeatedly, without automation catching them.' },
              { t: 'Systems failure handling', d: 'Flight instructors demonstrate failures by design. Engine-out procedures, electrical failures, instrument failures — handled in real aircraft, under real conditions, with student pilots who may freeze. This is precisely the autonomous decision-making profile cargo operations require.' },
              { t: 'Night currency and recency', d: 'Many instructors accumulate significant night hours across cross-country training, night endorsements, and instrument proficiency flights — often meeting or approaching cargo operator minimums without realising it.' },
              { t: 'Multi-engine and instrument time', d: 'Senior instructors on multi-engine aircraft hold the exact time profile cargo feeder and regional freight operators specify — multi-engine command time, instrument hours, and recency that generic airline applicant pools rarely match at this experience level.' },
            ] as { t: string; d: string }[]).map((item) => (
              <li key={item.t} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">{'->'}</span>
                <span><strong style={{color:'#dc2626'}}>{item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-700 leading-relaxed mb-4">These pilots are stuck — not because they lack the profile, but because <strong>nobody has shown them the door.</strong> They are foreshadowed in the industry: visible enough to be flying, invisible enough to be overlooked. The airline pathway feels blocked by seniority lists and type rating costs they cannot justify on an instructor's salary. So they stay. And cargo operators keep searching a shallow pool for candidates who are already qualified — just facing the wrong direction.</p>
          <p className="text-slate-700 leading-relaxed mb-6"><strong>Pillar 2 turns this around.</strong> The platform identifies instructors and experienced pipeline pilots whose profiles align with cargo operator requirements — night hours, command time, CRM history, failure handling experience — and presents them with a cargo pathway comparison against specific operators. For the first time, the match is visible to both sides simultaneously.</p>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">Pain Points for Pilots:</h3>
          <ul className="space-y-2 mb-6">
            {([
              { n: '1', t: 'Cargo is invisible as a pathway', d: <><strong>No platform presents cargo as a structured, navigable option.</strong> Pilots at every level — from <strong>500-hour instructors to experienced passenger FOs</strong> — are never shown cargo operators, their requirements, or the career advantages the sector offers. <strong>The pathway simply does not appear.</strong></> },
              { n: '2', t: 'No information on what cargo actually requires', d: <><strong>Night hour minimums, heavy jet experience thresholds, and cargo-specific CBTA competency dimensions</strong> are never published in a structured format. Pilots discover requirements only after applying — or after joining and <strong>finding the lifestyle incompatible.</strong></> },
              { n: '3', t: 'Type rating investment decisions made blind', d: <><strong>B737F, B767F, B747F, ATR72F</strong> — cargo-specific type rating demand is <strong>completely invisible.</strong> Pilots investing in freighter type ratings have no visibility into which operators are hiring, what fleet transitions are coming, or <strong>whether the rating will pay off.</strong></> },
              { n: '4', t: 'Salary, roster, and lifestyle never disclosed upfront', d: <><strong>Pay bands, layover allowances, and roster patterns</strong> are almost never published before the application stage. Pilots commit to a process with <strong>no transparency on what the role actually looks like day-to-day.</strong></> },
              { n: '5', t: 'No passenger-to-cargo transition pathway', d: <>Experienced passenger pilots who want to transition into cargo have <strong>no structured route.</strong> Which operators accept transitions? What currency is required? What type rating conversion applies? <strong>None of this is published or accessible.</strong></> },
              { n: '6', t: 'No profile gap analysis for cargo', d: <>Pilots cannot compare their current profile against a cargo operator's specific requirements. <strong>Night hours, command hours, heavy jet time</strong> — the exact gaps that determine eligibility are <strong>invisible until rejection.</strong></> },
            ] as { n: string; t: string; d: React.ReactNode }[]).map((item) => (
              <li key={item.n} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong className="text-red-600">{item.n}. {item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">Pain Points for Cargo Operators:</h3>
          <ul className="space-y-2 mb-8">
            {([
              { n: '1', t: 'Isolated, unverified pilot pool', d: <>Cargo operators have <strong>no centralised access to cargo-qualified pilot profiles.</strong> Candidate pools are built manually, per carrier, with <strong>no shared infrastructure</strong> and no night-hour or heavy jet experience verification.</> },
              { n: '2', t: 'High training washout rates', d: <>Without pre-screening for cargo-specific demands — <strong>night operations tolerance, autonomous decision-making, heavy jet background</strong> — operators accept candidates who wash out at a <strong>50% rate.</strong> Each washout represents <strong>months of training investment lost.</strong></> },
              { n: '3', t: 'No CBTA framework for cargo-specific competencies', d: <>Generic EBT/CBTA frameworks are built for passenger aviation. <strong>Night operations (20%) and autonomous decision-making (25%)</strong> are cargo-specific competency dimensions with <strong>no standardised assessment structure</strong> available on existing platforms.</> },
              { n: '4', t: 'Scheduling and recency compliance tracked manually', d: <><strong>Night recency and instrument currency</strong> requirements for cargo roles are tracked through <strong>manual records with significant delays.</strong> No real-time compliance feed exists across the industry.</> },
              { n: '5', t: 'Poor pilot self-selection — wrong candidates apply', d: <>Because <strong>cargo pathway requirements are unpublished,</strong> operators receive applications from pilots who are fundamentally unsuited to the lifestyle or unqualified for the role. <strong>Pre-screening does not exist</strong> before interest is submitted.</> },
            ] as { n: string; t: string; d: React.ReactNode }[]).map((item) => (
              <li key={item.n} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong className="text-red-600">{item.n}. {item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">What Pilots Need — And What the Industry Currently Provides</h3>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-3 font-semibold">What Pilots Need to Know</th>
                  <th className="text-left px-4 py-3 font-semibold text-red-400">Current Industry Reality</th>
                  <th className="text-left px-4 py-3 font-semibold" style={{ color: '#34d399' }}>PilotRecognition Solution</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { need: 'Cargo vs Passenger — Key Differences', current: 'Pilots discover this after joining', solution: 'Night-heavy ops, autonomous decision-making, less cabin crew interaction — all published upfront' },
                  { need: 'Night Operations Requirement', current: 'Unknown until briefed', solution: 'Cargo roles average 60–80% night operations — platform flags this per operator' },
                  { need: 'Type Ratings in Demand for Cargo', current: 'No visibility', solution: 'B737F, B767F, B747F, ATR72F — demand by operator published and updated live' },
                  { need: 'Minimum Hours to Enter Cargo', current: 'Varies — no standard published', solution: 'Platform shows minimum TT, command hours, and night hours per cargo operator' },
                  { need: 'Salary & Roster Transparency', current: 'Never disclosed before applying', solution: 'Cargo operators publish pay bands, layover allowances, roster patterns (e.g. 5 on / 3 off)' },
                  { need: 'Cargo Cadet & Direct Entry Programs', current: 'Rarely advertised publicly', solution: 'Published: DHL, FedEx, Cathay Cargo, and regional carriers — cadet eligibility criteria listed' },
                  { need: 'Foreign License Acceptance in Cargo', current: 'Unknown per operator', solution: 'Each operator\'s license validation policy published — ICAO equivalency and conversion steps' },
                  { need: 'Multinational Hiring in Cargo', current: 'Undisclosed', solution: 'Operators state: open globally / regional preference / nationals only' },
                  { need: 'Profile Gap Analysis for Cargo', current: 'Pilots apply blind', solution: 'Compare live profile to cargo pathway — exact gaps in hours, ratings, and night time shown' },
                  { need: 'Command Upgrade Timeline in Cargo', current: 'Opaque', solution: 'Average time-to-command by operator published — cargo often faster than major airline' },
                ].map((row, i) => (
                  <tr key={row.need} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">{row.need}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-red-400">{row.current}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.solution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Why Cargo Is an Overlooked Pathway</h3>
          <p className="text-slate-700 leading-relaxed mb-4">The industry presents pilots with a false binary: passenger airline or flight instructor. Cargo is systematically underrepresented as a viable pathway — despite offering faster command upgrades, schedule flexibility, and career longevity advantages that passenger aviation rarely matches. Pilots trapped in the clogged pipeline at floor level often have profiles that are <strong>immediately competitive for cargo roles</strong> — but they have never been shown the pathway.</p>
          <ul className="space-y-2 mb-6">
            {[
              { t: 'Night operations heavy', d: 'Cargo roles average 60–80% night operations — a different lifestyle, but one that appeals to pilots who prefer autonomy, fewer passenger interactions, and predictable patterns.' },
              { t: 'Autonomous decision-making demand', d: 'Cargo operations require a higher threshold of independent pilot judgment — fewer cabin crew, fewer passengers, and often remote destinations where operational self-sufficiency is critical.' },
              { t: 'Faster command upgrade', d: 'Many cargo operators offer command upgrade timelines significantly shorter than major passenger carriers — published per operator on the platform so pilots can compare before committing.' },
              { t: 'Passenger-to-cargo transition', d: 'Experienced passenger pilots can transition into cargo roles with type rating conversions — a structured pathway the platform maps out including which operators accept transitions and what currency is required.' },
              { t: 'Segregated talent pool', d: 'Cargo-qualified pilots are a specific subset. Cargo operators accessing the platform pull from a pre-filtered pool with night hour verification, heavy jet experience confirmation, and cargo-specific CBTA alignment.' },
            ].map((item) => (
              <li key={item.t} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong style={{color:'#dc2626'}}>{item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Platform Requirements for Cargo Operators</h3>
          <ul className="space-y-2 mb-6">
            {[
              { t: 'Specialized CBTA dimensions', d: 'Night operations weighted at 20% of competency assessment; autonomous decision-making at 25% — distinct from passenger operator frameworks.' },
              { t: 'Heavy jet experience verification', d: 'Minimum 1,000 hours on heavy jet confirmed via logbook verification — not self-reported.' },
              { t: 'Segregated talent pool access', d: 'Cargo operators access a filtered database of cargo-qualified pilots only — no noise from passenger-only profiles.' },
            ].map((item) => (
              <li key={item.t} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 mt-1 flex-shrink-0">•</span>
                <span><strong style={{color:'#dc2626'}}>{item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">Access to the Pilot Database</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Cargo operators on the platform access a <strong>live, verified pilot database</strong> — not a stack of CVs. The database is structured with two distinct tiers of pilot readiness, both filtered against your specific cargo pathway requirements before they appear in your results.</p>
          <ul className="space-y-3 mb-4">
            <li className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
              <span className="text-red-500 mt-1 flex-shrink-0">→</span>
              <span>
                <strong style={{color:'#dc2626'}}>Recognition+ Members — Priority Access</strong>{' '}
                The highest-quality tier. These pilots have completed background verification, hold a verified credential wallet, and have actively aligned their profile to your pathway. They are <strong>pre-cleared</strong> — identity confirmed, employment history verified, license validated, medical status current. For cargo operators, Recognition+ members also have their <strong>night hours, heavy jet time, and instrument currency</strong> confirmed — not self-reported. They arrive flagged as ready. No chasing documents. No delays.
              </span>
            </li>
            <li className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
              <span className="text-red-500 mt-1 flex-shrink-0">→</span>
              <span>
                <strong style={{color:'#dc2626'}}>Submitted Recognition Users — Profile-Matched Pool</strong>{' '}
                Standard platform members who have submitted interest against your cargo pathway. Their <strong>Recognition Score</strong> — calculated from total hours, command hours, night hours, heavy jet experience, type ratings held, recency, and EBT assessment results — is displayed alongside their profile. Operators can filter, rank, and compare by score, experience level, and pathway alignment. <strong>You see exactly where each pilot stands against your requirements</strong> — no guesswork, no blind applications.
              </span>
            </li>
          </ul>
          <p className="text-slate-700 leading-relaxed mb-6">Both tiers are filtered to your cargo pathway specifications before results are returned. A pilot whose profile does not meet your published minimum night hours, command time, or heavy jet threshold <strong>does not appear in your pool.</strong> The noise is removed before you ever open the list.</p>

          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Operational Outcomes</h3>
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
                  { metric: 'Training washout rate', before: '50%', after: '20% ($1.5M annual savings)' },
                  { metric: 'Time-to-qualified', before: '4 months', after: '6 weeks' },
                  { metric: '2-year pilot retention', before: '65%', after: '85%' },
                  { metric: 'Annual ROI', before: '—', after: '$1.8–2.2M' },
                  { metric: 'Pilot self-selection accuracy', before: 'High mismatch — wrong candidates apply', after: 'Pilots pre-screened by cargo pathway alignment before submitting interest' },
                  { metric: 'Scheduling & recency compliance', before: 'Manual records, delayed', after: 'Real-time automated compliance feed — night recency, instrument currency tracked' },
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

          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">How Cargo Operators Can Strengthen the Platform</h3>
          <p className="text-slate-600 text-sm mb-4 leading-relaxed">The following are optional contributions that cargo operators can choose to share. Each one improves the quality of the pilot pool available to you — and to every cargo operator on the platform. None are required to access the database.</p>
          <ul className="space-y-3 mb-8">
            {([
              { t: 'Retention outcome data', d: 'Operators who share anonymised retention data help the platform surface career stability signals to pilots — making cargo a more informed, more attractive choice for the right candidates.' },
              { t: 'Cargo-specific competency input', d: 'Operators with established CBTA frameworks for night operations or autonomous decision-making can optionally contribute to the cargo competency layer — improving assessment relevance for the whole sector.' },
              { t: 'Passenger-to-cargo transition pathways', d: 'Operators open to receiving experienced passenger pilots can publish structured transition criteria — eligibility requirements, type rating conversion steps, and currency expectations — making the transition visible and navigable for pilots who are already qualified but don\'t know you\'re open to them.' },
            ] as { t: string; d: string }[]).map((item) => (
              <li key={item.t} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 mt-1 flex-shrink-0">•</span>
                <span><strong className="text-slate-800">{item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">The Platform Solution</h3>
          <p className="text-slate-700 leading-relaxed mb-6">Pillar 2 delivers two parallel products — one for pilots navigating toward cargo, one for cargo operators building a better pipeline. Both operate on the same verified data layer. Both update in real time.</p>

          <hr className="my-6 border-slate-200" />

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">FOR PILOTS: Cargo Pathway Cards</h4>
          <p className="text-slate-700 leading-relaxed mb-4">A dedicated section of the Pathways directory filtered to cargo and freight operators. Each cargo pathway card contains:</p>
          <ul className="space-y-1 mb-4">
            {[
              'Minimum total time, command hours, and night hours required',
              'Heavy jet experience threshold and accepted aircraft types',
              'Type ratings in demand (B737F, B767F, B747F, ATR72F and others)',
              'Night operations percentage — flagged per operator',
              'Roster patterns, layover allowances, and pay band ranges',
              'Foreign license acceptance policy and ICAO equivalency steps',
              'Multinational hiring status: open globally / regional / nationals only',
              'Cadet and direct entry program eligibility criteria',
              'Command upgrade timeline — average per operator',
              'Intake status: Open / Closed / Paused / Future Demand',
              'Last updated timestamp',
            ].map((item) => (
              <li key={item} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 mt-1 flex-shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-700 leading-relaxed mb-2 font-semibold">Cargo-Specific Alignment Tools:</p>
          <ul className="space-y-1 mb-6">
            {[
              'Live profile comparison against any cargo pathway — night hours gap, heavy jet shortfall, and type rating requirements shown exactly',
              'Passenger-to-cargo transition eligibility checker — see which operators accept transitions and what currency is required',
              'Type rating demand visibility before investment — see which freighter ratings are in active demand by operator',
              'Alerts when saved cargo pathways update requirements or open intake',
            ].map((item) => (
              <li key={item} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 mt-1 flex-shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <hr className="my-6 border-slate-200" />

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">FOR CARGO OPERATORS: Expectations Page</h4>
          <p className="text-slate-700 leading-relaxed mb-4">A structured, maintained operator profile replacing uncoordinated job posts. All fields timestamped and current. Cargo-specific profile fields include:</p>
          {[
            { heading: 'Identity & Operations', items: ['Operator name, ICAO/IATA code, domicile bases', 'Cargo type: integrated express, freighter charter, regional cargo, e-commerce fulfilment', 'Route network and operating regions'] },
            { heading: 'Fleet & Type Rating Demand', items: ['Active freighter types and fleet size', '12-month fleet outlook and type rating demand signals', 'Accepted type rating equivalencies and conversion paths'] },
            { heading: 'Pilot Requirements', items: ['Minimum TT, command hours, night hours, heavy jet time', 'Night operations percentage — average per role', 'Medical certificate class required', 'Foreign license and multinational hiring policy', 'Passenger-to-cargo transition acceptance: yes / no / case-by-case'] },
            { heading: 'Hiring Signal', items: ['Live Open / Closed / Paused / Future Demand status', 'Next intake window estimate', '12–24 month headcount forecast by role'] },
            { heading: 'Lifestyle & Career Transparency', items: ['Roster patterns published (e.g. 5 on / 3 off, rotating)', 'Pay band ranges and layover allowances', 'Average time-to-command by role', 'Career advantages published — schedule flexibility, faster command, autonomy'] },
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

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-2">Commercial Tiers — Cargo Operator Access</h3>
          <p className="text-slate-700 leading-relaxed mb-6">Cargo operators access the platform through the same two independent products as all Hub A operators. <strong>Pathway Listings</strong> give access to the verified cargo pilot database and pull system. The <strong>Cargo Operator Expectations Page</strong> is a separate brand presence product — a dedicated listing where pilots browse and compare cargo operators before submitting interest.</p>

          <h4 className="text-lg font-bold text-slate-800 mb-3">Model 1 — Pathway Listings &amp; Pilot Database Access</h4>
          <p className="text-slate-600 text-sm mb-3">For cargo operators posting structured pathway requirements and pulling from the verified cargo pilot database.</p>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Tier</th>
                  <th className="text-left px-4 py-2 font-semibold">Monthly Fee</th>
                  <th className="text-left px-4 py-2 font-semibold">Includes</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { tier: 'Basic', fee: 'Free', features: <>Post up to 3 cargo pathway cards. <strong style={{color:'#dc2626'}}>View the first 10 pilots who submit interest</strong> — full profiles visible. <strong style={{color:'#dc2626'}}>Remaining interested pilots are blurred</strong> — giving you a live signal of demand without access to the full pool. <span style={{color:'#dc2626'}}>No database search or Recognition Score access.</span></> },
                  { tier: 'Enterprise', fee: '$1,000/yr', features: <>Unlimited pulls, cargo-specific CBTA assessment access, dedicated account support, API access, bulk pathway management.</> },
                ] as { tier: string; fee: string; features: React.ReactNode }[]).map((row, i) => (
                  <tr key={row.tier} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">{row.tier}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-red-400 font-semibold">{row.fee}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.features}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mb-3">Model 2 — Cargo Operator Expectations Page</h4>
          <p className="text-slate-600 text-sm mb-3">A separate product. The cargo operator's public-facing presence on the platform — where pilots browse, compare, and decide which operators align with their career stage and lifestyle before submitting any interest.</p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Product</th>
                  <th className="text-left px-4 py-2 font-semibold">Annual Fee</th>
                  <th className="text-left px-4 py-2 font-semibold">What It Includes</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-slate-800">
                  <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">Cargo Operator Expectations Listing</td>
                  <td className="px-4 py-2 border-b border-slate-700 text-red-400 font-semibold">$100/year</td>
                  <td className="px-4 py-2 border-b border-slate-700 text-slate-300">Dedicated cargo operator profile on the Browse Operators directory — fleet, roster patterns, pay bands, night ops percentage, type rating demand, command upgrade timeline, transition policy. Visible to all pilots on the platform. Comparable side-by-side against other cargo operators.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-slate-600 text-sm mb-4">At <strong>$100 per year</strong>, this is the only structured channel where cargo operators can present themselves to an audience of exclusively verified, career-active pilots who are actively comparing their options — before they apply anywhere.</p>
          <p className="text-slate-600 text-sm mb-8"><strong>Success Fee:</strong> $500 per confirmed hire (waived for first 10 hires)</p>

          <hr className="my-10 border-slate-300" />

          <h2 id="pillar-3-charter-business" className="text-4xl font-bold text-slate-900 mt-12 mb-6 pb-4 border-b-2 border-slate-900 scroll-mt-24">
            PILLAR 3: CHARTER &amp; BUSINESS AVIATION
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub A — Operations &amp; Recruitment</p>

          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Problem: A Sector That Recruits in the Dark</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Charter and business aviation is one of the most demanding and least understood sectors in professional aviation. It operates on discretion by design — operators do not post publicly, clients do not tolerate exposure, and pilots are expected to arrive pre-qualified, pre-vetted, and ready to deploy within days. <strong>The result is a recruitment model that is almost entirely invisible to the pilots who would be most suited for it.</strong></p>
          <p className="text-slate-700 leading-relaxed mb-4">Pilots qualified for charter and business aviation roles — typically experienced FOs and Captains with multi-engine command time, strong CRM records, and jet experience — are circulating in the same generic job boards as every other sector. They have no structured way to signal their suitability for VIP, VVIP, or charter operations. Operators have no structured way to find them without activating expensive executive search firms or relying on closed-network word-of-mouth.</p>
          <p className="text-slate-700 leading-relaxed mb-4"><strong>Pillar 3 addresses this with a discretion-first pathway layer — structured operator profiles accessible only to verified, profile-matched pilots, with deployment timelines, compensation frameworks, and VIP-specific competency requirements published in a structured format for the first time. <span style={{color:'#dc2626'}}>This is not a publicly browsable directory. It is a closed channel for serious aviation professionals.</span></strong></p>
          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-6 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>Recognition+ Exclusive Access.</strong> Pillar 3 pathways are accessible exclusively to <strong style={{color:'#f87171'}}>Recognition+ members</strong> ($99/yr) — pilots who have demonstrated commitment to their professional standing through verified credentials and a complete recognition profile. Free tier pilots can see that this pathway category exists — but access is restricted. Charter and business aviation operators require a verified, serious candidate pool. Recognition+ is the standard that qualifies a pilot for consideration.</p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">The Untapped Pool: Pilots Already Ready for Charter — Facing the Wrong Direction</h3>
          <p className="text-slate-700 leading-relaxed mb-4">The same clogged pipeline that produces cargo-ready instructors produces charter-ready pilots. <strong>Senior flight instructors and experienced passenger FOs</strong> with strong interpersonal skills, immaculate presentation, and multi-engine jet time are often ideally suited for charter and business aviation — but are never presented with the pathway. The sector's discretion works against both sides: operators don't advertise, pilots don't know to look.</p>
          <ul className="space-y-2 mb-6">
            {([
              { t: 'VIP service disposition', d: 'Years of high-pressure instruction and passenger-facing operations builds the calm, professional, client-first disposition that charter operators require. This cannot be trained in a simulator — it is demonstrated through career history.' },
              { t: 'Multi-engine command and jet time', d: 'Senior instructors and experienced FOs on multi-engine jets hold the exact time profile that light and mid-size charter operators specify — without the seniority lock-in of a legacy carrier.' },
              { t: 'Immediate deployment readiness', d: 'Pilots not embedded in airline seniority systems can transition to charter operations faster — no notice period negotiations, no seniority sacrifice, no position downgrade. They arrive ready.' },
              { t: 'Discretion and confidentiality track record', d: 'Flight instructors and professional pilots operate under implicit confidentiality obligations with every student and passenger. Charter operators need pilots who understand discretion as a professional default — not a policy they have to be trained on.' },
            ] as { t: string; d: string }[]).map((item) => (
              <li key={item.t} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">{'->'}</span>
                <span><strong style={{color:'#dc2626'}}>{item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">Pain Points for Pilots</h3>
          <ul className="space-y-2 mb-6">
            {([
              { n: '1', t: 'Charter is invisible as a pathway', d: <><strong>No platform presents charter or business aviation as a structured, searchable pathway.</strong> Pilots with the right profile — multi-engine command time, jet experience, strong CRM — <strong>never see the door.</strong></> },
              { n: '2', t: 'No published requirements', d: <><strong>VIP and VVIP operator requirements are never published.</strong> Hours minima, type rating preferences, grooming standards, language requirements, security clearance expectations — none of it is available before the approach stage.</> },
              { n: '3', t: 'No profile gap analysis for charter', d: <>Pilots cannot compare their current profile against a charter operator's specific requirements. <strong>The gaps are invisible until an informal approach is made — and rejected.</strong></> },
              { n: '4', t: 'Compensation opacity', d: <><strong>Charter pay structures are almost never disclosed upfront.</strong> Per-diem rates, standby allowances, trip pay structures, and retention bonuses are negotiated blind — with no market benchmark available to pilots.</> },
              { n: '5', t: 'No transition pathway from airlines', d: <>Senior airline pilots considering a move to charter aviation — for lifestyle, flexibility, or compensation reasons — have <strong>no structured route to evaluate operators, compare packages, or signal interest without compromising their current employment.</strong></> },
            ] as { n: string; t: string; d: React.ReactNode }[]).map((item) => (
              <li key={item.n} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">{'->'}</span>
                <span><strong style={{color:'#dc2626'}}>{item.n}. {item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">Pain Points for Charter &amp; Business Aviation Operators</h3>
          <ul className="space-y-2 mb-6">
            {([
              { n: '1', t: 'No discreet recruitment channel', d: <><strong>Public job postings are incompatible with VIP and VVIP operations.</strong> Operators cannot advertise without attracting unsuitable candidates, exposing client confidentiality, or triggering internal speculation among existing crew.</> },
              { n: '2', t: 'Expensive executive search dependency', d: <>Without a structured platform, operators rely on executive search firms charging <strong>15–25% of first-year salary per placement</strong> — for a role that may turn over within 18 months. The cost model is unsustainable for smaller operators.</> },
              { n: '3', t: 'No pre-verified candidate pipeline', d: <>Every candidate requires a full background check, reference verification, and security vetting from scratch. <strong>No pre-cleared pool exists.</strong> Deployment timelines stretch to 90+ days — unacceptable for operational coverage gaps.</> },
              { n: '4', t: 'Retention failure at the lifestyle stage', d: <>Charter operators lose pilots who self-select in without understanding the lifestyle: irregular scheduling, standby requirements, extended trips, and confidentiality obligations. <strong>No platform communicates this honestly before hire — resulting in high early-tenure attrition.</strong></> },
              { n: '5', t: 'No seniority-matched compensation framework', d: <>Operators compete for experienced pilots against airlines offering transparent seniority-based pay scales. Charter compensation is competitive but <strong>structurally opaque</strong> — operators cannot demonstrate their value proposition without a structured disclosure channel.</> },
            ] as { n: string; t: string; d: React.ReactNode }[]).map((item) => (
              <li key={item.n} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">{'->'}</span>
                <span><strong style={{color:'#dc2626'}}>{item.n}. {item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">The Platform Solution</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Pillar 3 introduces a <strong>closed, discretion-first pathway layer</strong> — a distinct mode of operator presence designed for sectors where <strong>public visibility is operationally inappropriate</strong>. Charter and business aviation operators publish structured pathway requirements accessible <strong>only to Recognition+ members whose verified profiles meet the operator's specified criteria</strong>. <strong>No public listing. No open applications. No unsolicited exposure.</strong></p>
          <p className="text-slate-700 leading-relaxed mb-4">This creates a <strong>two-sided quality lock</strong>. Pilots understand that accessing charter and business aviation pathways requires <strong>Recognition+ membership</strong> — verified credentials, a complete professional profile, and a demonstrated commitment to industry standing. Operators know that <strong>every pilot who reaches their pathway card has cleared that bar</strong>. The access gate is not arbitrary — it reflects the standard that <strong>VVIP and charter operators require before any consideration begins</strong>. <strong>That quality signal is not available through any other recruitment channel.</strong></p>
          <div className="bg-slate-50 border border-slate-200 rounded px-5 py-4 mb-6 text-sm text-slate-700">
            <p className="font-semibold text-slate-800 mb-2">How the access tiers work for pilots:</p>
            <ul className="space-y-1 list-disc ml-4">
              <li><strong style={{color:'#dc2626'}}>Free tier:</strong> Pilot sees "Charter &amp; Business Aviation" as a pathway category. Cards are locked. Prompted to upgrade to Recognition+ to unlock.</li>
              <li><strong style={{color:'#dc2626'}}>Recognition+ ($99/yr):</strong> Full charter pathway card access — but only for cards where the pilot's verified profile meets the operator's stated criteria. <strong style={{color:'#dc2626'}}>Irrelevant cards remain hidden. No browsing without matching.</strong></li>
              <li><strong style={{color:'#dc2626'}}>Recognition+ with verified wallet:</strong> <strong style={{color:'#dc2626'}}>Pre-cleared status</strong> displayed on charter pathway cards. Operators see <strong style={{color:'#dc2626'}}>verification badge</strong> alongside profile match. <strong style={{color:'#dc2626'}}>Deployment consideration prioritised.</strong></li>
            </ul>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">FOR PILOTS: Charter Pathway Cards</h4>
          <p className="text-slate-700 leading-relaxed mb-3">Recognition+ members whose verified profile aligns with an operator's stated criteria receive a charter pathway card — accessible only to them, not publicly visible. Each card contains:</p>
          <ul className="space-y-1 mb-5 ml-4 text-slate-700 text-sm list-disc">
            {[
              'Operator type (light jet, mid-size, heavy, VVIP)',
              'Base of operations and trip profile (regional, international, ultra-long-range)',
              'Type rating requirements and preferred aircraft types',
              'Minimum hours — total time, command time, jet time, multi-engine',
              'Deployment timeline expectations (standby, on-call, rostered)',
              'Compensation framework — base, per diem, trip pay, retention structure',
              'Lifestyle disclosure — scheduling pattern, layover frequency, client interaction level',
              'Security and confidentiality requirements',
              'Upgrade and progression pathway (Captain timelines, fleet transitions)',
              'Recognition Score threshold and profile gap comparison',
            ].map((item) => <li key={item}>{item}</li>)}
          </ul>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">FOR CHARTER OPERATORS: Structured Operator Profile</h4>
          <p className="text-slate-700 leading-relaxed mb-3">Operators on Pillar 3 configure a confidential backend profile with five structured sections — none of which is visible without a verified Recognition+ profile match:</p>
          <ul className="space-y-1 mb-5 ml-4 text-slate-700 text-sm list-disc">
            {[
              'Operator Identity — aircraft type, fleet size, operational base, client sector (corporate, HNWI, government)',
              'Deployment Requirements — timeline expectations, standby availability, contractual terms',
              'Pilot Profile Requirements — hours minima, type ratings, language requirements, presentation standards',
              'Compensation Structure — base salary, per diem, trip allowances, retention bonuses, comparison benchmark',
              'Culture & Lifestyle Transparency — scheduling pattern, trip duration, client interaction expectations, crew culture',
            ].map((item) => <li key={item}>{item}</li>)}
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">Access to the Pilot Database</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Charter operators access the same live verified pilot database as commercial and cargo operators — filtered specifically for charter-relevant profile criteria: jet command time, multi-engine hours, presentation history, CRM scores, and Recognition Score threshold.</p>
          <ul className="space-y-3 mb-4">
            {([
              { t: 'Recognition+ Members — Priority Access', d: 'Background verified, pre-cleared pilots with a completed digital credential wallet. Highest-quality tier — ready for immediate deployment consideration. Ideal for operators with 30-day placement timelines.' },
              { t: 'Submitted Recognition Users — Profile-Matched Pool', d: 'Platform members who have submitted interest and whose profiles align with charter pathway requirements. Filtered by jet time, command hours, and Recognition Score. Verification can be initiated immediately by the operator.' },
            ] as { t: string; d: string }[]).map((item) => (
              <li key={item.t} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">{'->'}</span>
                <span><strong style={{color:'#dc2626'}}>{item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-2">Commercial Tiers — Charter Operator Access</h3>
          <p className="text-slate-700 leading-relaxed mb-6">Charter operators access the platform through two independent products — confidential pathway listings and a structured operator profile. Both are priced independently and accessible only to verified Recognition+ pilot members.</p>

          <h4 className="text-lg font-bold text-slate-800 mb-3">Model 1 — Confidential Pathway Listings &amp; Pilot Database Access</h4>
          <p className="text-slate-600 text-sm mb-3">For charter operators posting discretion-required pathway requirements and accessing the verified Recognition+ pilot pool.</p>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Tier</th>
                  <th className="text-left px-4 py-2 font-semibold">Fee</th>
                  <th className="text-left px-4 py-2 font-semibold">Includes</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { tier: 'Basic', fee: 'Free', features: <>Post up to 2 confidential pathway listings. <strong style={{color:'#dc2626'}}>View the first 10 matched Recognition+ pilots</strong> — full profiles visible. <strong style={{color:'#dc2626'}}>Remaining matched pilots are blurred</strong> — live signal of pool depth without full access. <span style={{color:'#dc2626'}}>No database search. No Recognition Score access.</span></> },
                  { tier: 'Enterprise', fee: '$1,000/yr', features: <><strong style={{color:'#dc2626'}}>Unlimited confidential pathway listings</strong>, full Recognition+ pilot database access, Recognition Score and jet hours data, <strong style={{color:'#dc2626'}}>dedicated account support</strong>, NDA-enforced placement protocol, API access.</> },
                ] as { tier: string; fee: string; features: React.ReactNode }[]).map((row, i) => (
                  <tr key={row.tier} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">{row.tier}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-red-400 font-semibold">{row.fee}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.features}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mb-3">Model 2 — Operator Profile Listing</h4>
          <p className="text-slate-600 text-sm mb-3">A separate product. A structured operator presence — accessible to Recognition+ members only after a verified profile match. Not publicly browsable under any circumstances.</p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Product</th>
                  <th className="text-left px-4 py-2 font-semibold">Annual Fee</th>
                  <th className="text-left px-4 py-2 font-semibold">What It Includes</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { tier: 'Charter Expectations Listing', fee: '$100/year', features: 'Structured operator profile — fleet type, base, trip profile, compensation framework, lifestyle transparency, culture. Visible only to profile-matched, verified pilots. Not publicly searchable.' },
                ] as { tier: string; fee: string; features: string }[]).map((row) => (
                  <tr key={row.tier} className="bg-slate-800">
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">{row.tier}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-red-400 font-semibold">{row.fee}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.features}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-slate-600 text-sm mb-8"><strong>Success Fee:</strong> $500 per confirmed placement (waived for first 5 placements)</p>

          <hr className="my-8 border-slate-300" />
          <p className="text-slate-500 text-sm uppercase tracking-wide font-semibold mb-2">Section 2</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-2 mb-4">Platform Integrations — Business Aviation Operator Networks</h3>
          <p className="text-slate-700 leading-relaxed mb-4">The business aviation sector operates on established B2B operator networks — platforms where charter operators manage trip requests, source aircraft, connect with brokers, and coordinate crew requirements across their fleet. These networks represent the operational backbone of the charter industry. <strong>Pillar 3 is designed for direct API integration with these networks, creating a live pipeline between active charter operator demand and the verified Recognition+ pilot pool.</strong></p>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">The Core Opportunity: Pilot Outsourcing on Demand</h4>
          <p className="text-slate-700 leading-relaxed mb-4">Charter operators regularly face a specific problem: <strong>a confirmed trip, a qualified aircraft — and a crew gap.</strong> Wet lease arrangements, sudden crew unavailability, fleet expansion, and new route activations all create short-notice demand for qualified pilots that the operator's internal roster cannot fill. The current solution is phone calls, broker networks, and expensive last-minute placements.</p>
          <p className="text-slate-700 leading-relaxed mb-4">Pillar 3 positions the platform as the <strong>structured outsourcing channel</strong> for that gap — connecting operators on established business aviation networks directly to a pre-verified, Recognition+ pool of qualified pilots, filtered by aircraft type, hours profile, and deployment availability. <span style={{color:'#dc2626'}}><strong>The operator does not recruit broadly. They post a pathway requirement. The platform surfaces the match. The pilot is already verified.</strong></span></p>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">What Integration Enables</h4>
          <ul className="space-y-2 mb-6">
            {([
              { t: 'Live demand signals into pilot profiles', d: 'When an operator on a connected business aviation network posts a crew requirement, that signal flows directly into matched Recognition+ pilot pathway cards — in real time. Pilots are not browsing a static listing. They are seeing an active, current requirement from a verified operator.' },
              { t: 'Operator verification via network membership', d: 'Integration with established operator networks allows the platform to verify that a charter operator listing a pathway on Pillar 3 is a legitimate, active participant in the business aviation market — not an unverified entity. Operator credentials are cross-referenced, not self-declared.' },
              { t: 'Fleet and activity data enrichment', d: 'Operator profile pages on Pillar 3 can be enriched with verified fleet data drawn from network records — aircraft types actively operated, not self-reported. Pilots see the actual fleet, not a marketing description.' },
              { t: 'Pathway posting as the outsourcing trigger', d: 'Rather than activating a broker or search firm when a crew gap opens, operators post a confidential pathway requirement on the platform. The match algorithm returns a shortlist of pre-verified, deployment-ready Recognition+ pilots within hours. The outsourcing cost drops from 15–25% of annual salary to a flat placement fee.' },
              { t: 'Reciprocal value for the network', d: 'Business aviation operator networks gain access to a verified, structured pilot supply layer they currently do not offer their members. Pillar 3 integration positions the platform as infrastructure for the network — not a competitor to it. Operators stay on their existing platform. They simply gain a direct, verified crew sourcing channel as an added capability.' },
            ] as { t: string; d: string }[]).map((item) => (
              <li key={item.t} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">{'->'}</span>
                <span><strong style={{color:'#dc2626'}}>{item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">Automated Match Algorithm — The Pilot as the Beacon</h4>
          <p className="text-slate-700 leading-relaxed mb-4">In emergency aviation, an <strong>ELT — Emergency Locator Transmitter</strong> — is the signal that tells rescuers exactly where to look. It doesn't wait to be found. It transmits. <strong>A Recognition+ pilot profile on this platform operates the same way.</strong> It broadcasts a verified, structured signal into the industry continuously — and when an operator's criteria align with that signal, the match is made automatically.</p>
          <p className="text-slate-700 leading-relaxed mb-4">Operators configure their pathway criteria once — aircraft type, hours minima, deployment availability, type rating requirements. The platform's match algorithm runs continuously against the live Global Pilot Database. <strong>When a Recognition+ pilot's verified profile meets those criteria, both sides are notified.</strong> The pilot doesn't apply. The operator doesn't search. The system finds the alignment and surfaces it.</p>
          <p className="text-slate-700 leading-relaxed mb-4">Operators work in two modes. <strong>Recommended matches</strong> are delivered automatically — the algorithm surfaces the highest-aligned Recognition+ profiles on a recurring basis, at intervals, without the operator having to initiate a search. The pilot's profile is not shown once and forgotten. It re-enters the operator's view every time the match criteria remain active and the pilot's standing holds. <strong>Like an ELT pulsing at regular intervals — the signal keeps transmitting until the coordination centre locks on.</strong></p>
          <p className="text-slate-700 leading-relaxed mb-4">Operators can also <strong>hand-select</strong> from the matched pool directly — browsing verified Recognition+ profiles that meet their stated criteria and shortlisting candidates without algorithmic intermediary. Both modes feed the same outcome: <strong>a pilot's profile is in constant circulation within the operator network relevant to their qualifications</strong>, not submitted once to a vacancy and discarded when the role is filled.</p>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">The Notification System — Communication Is the Product</h4>
          <ul className="space-y-2 mb-6">
            {([
              { t: 'For the pilot — you are being seen', d: <><strong>A Recognition+ member receives a notification: an operator in the charter or private sector has matched their profile.</strong> Not a generic marketing email. A direct signal that a real operator with a live requirement has reviewed their credentials and identified them as a potential match. For a pilot who has spent years circulating invisible CVs, that notification is the first time the industry has looked back.</>},
              { t: 'For the operator — the crew gap closes faster', d: <>An operator with an aircraft on standby and a crew position to fill does not have days to run a search. The automated match delivers a shortlist of <strong>pre-verified, Recognition+ pilots who already meet the stated criteria</strong> — flagged the moment the profile alignment is confirmed. The time between need and candidate is measured in hours, not weeks.</> },
              { t: 'Profile view activity — the industry is watching', d: <>Recognition+ pilots can see when their profile has been viewed by an operator from the Global Pilot Database. <strong>This is not vanity data.</strong> It tells a pilot which sectors are actively interested in their profile, which gaps are causing operators to move on, and when their recognition score is working. It closes the feedback loop that the industry has never provided.</>},
              { t: 'Interest signals without direct contact', d: <>Operators can register interest in a matched pilot profile without initiating direct contact — a <strong>discreet intent signal</strong> that the pilot receives as a notification. No unsolicited approach. No premature commitment. The pilot decides whether to respond and consent to further contact. <strong>The operator controls who they approach. The pilot controls who reaches them.</strong></> },
            ] as { t: string; d: React.ReactNode }[]).map((item) => (
              <li key={item.t} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">{'->'}</span>
                <span><strong style={{color:'#dc2626'}}>{item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-6 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>The pilot is the ELT. The beacon.</strong> A verified Recognition+ profile transmits a continuous, structured signal into the industry. Operators are the coordination centre — scanning for the signal that matches their need. When the frequencies align, the platform locks on. <strong style={{color:'#f87171'}}>The pilot doesn't chase the industry. The industry finds them.</strong></p>
          </div>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-8 rounded-r">
            <p className="text-white text-sm leading-relaxed mb-0"><strong style={{color:'#f87171'}}>The exchange model is straightforward.</strong> Business aviation operators gain access to a qualified, pre-verified pilot pool for on-demand crew outsourcing. In return, they post confidential pathway requirements on the platform — structured listings that give Recognition+ pilots visibility into real, active opportunities in the charter and business aviation sector for the first time. <strong style={{color:'#f87171'}}>Operators get qualified crew. Pilots get access to a sector that was previously invisible to them. The platform connects both sides without brokers, without cold calls, and without the 15–25% placement cost of executive search.</strong></p>
          </div>

          <hr className="my-10 border-slate-300" />

          <h2 id="pillar-4-emerging-sectors" className="text-4xl font-bold text-slate-900 mt-12 mb-6 pb-4 border-b-2 border-slate-900 scroll-mt-24">
            PILLAR 4: EMERGING AVIATION SECTORS
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub A — Operations &amp; Recruitment</p>

          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Problem: Absence of Dedicated Talent Infrastructure</h3>
          <p className="text-slate-700 leading-relaxed mb-4">The rapid commercialisation of Advanced Air Mobility (AAM) — including eVTOL, air taxi, drone logistics, agricultural aviation, and autonomous systems — is no longer theoretical. These sectors are fully capitalised, type-certificated, and actively scaling human capital. However, they are attempting to scale in the complete absence of a dedicated recruitment infrastructure.</p>
          <p className="text-slate-700 leading-relaxed mb-4">Emerging aviation operators cannot systematically deploy the hiring frameworks used by commercial airlines. Competency matrices differ fundamentally, certification pathways remain non-standardised, and optimal candidate profiles do not align with traditional hours-based selection models. The result is severe <strong>structural friction</strong>: legacy job cross-posting attracts misaligned candidates, while highly adaptable, digitally native, early-career pilots remain invisible within traditional pipelines — entirely disconnected from alternative aviation pathways. <strong style={{color:'#dc2626'}}>The issue is not a top-line supply deficit. It is an infrastructure and channel routing failure.</strong></p>

          <div className="border border-slate-300 rounded-lg px-6 py-5 mb-6 bg-slate-50">
            <p className="text-xs uppercase tracking-wide font-semibold text-slate-500 mb-3">Case Study — Talent Acquisition Architecture Failure</p>
            <p className="text-slate-800 font-semibold mb-1">Etihad Aviation Career Fair, January 21, 2026 — Etihad Museum, Abu Dhabi</p>
            <p className="text-slate-500 text-xs mb-3">Direct observation by PilotRecognition founding team</p>
            <p className="text-slate-700 text-sm leading-relaxed mb-3"><strong>Objective observed reality:</strong> Demand and talent supply coexisted in high volumes, yet the structural architecture failed to execute a match. An unfiltered, unsegmented, and un-prequalified attendee pool — engineers, cadets, mechanics, and licensed pilots — overwhelmed the physical infrastructure, resulting in venue gate closures. Qualified flight crew present at the event were consistently presented with a single legacy screening metric:</p>
            <p className="text-slate-800 text-sm italic font-semibold mb-3 pl-4 border-l-4 border-red-500">"You know the requirements — 1,500 hours. Come back when you have them."</p>
            <p className="text-slate-700 text-sm leading-relaxed mb-0"><strong>Pipeline failure diagnosis:</strong> No gap analysis was offered. No transitional pathways were identified. No existing competency validation mechanisms were applied. The event confirmed that the aviation talent challenge is not a supply-side deficit. <strong style={{color:'#dc2626'}}>It is a structural failure of talent acquisition pipelines to route, segment, and match supply to demand.</strong></p>
          </div>

          <div className="border border-slate-300 rounded-lg px-6 py-5 mb-8 bg-slate-50">
            <p className="text-xs uppercase tracking-wide font-semibold text-slate-500 mb-3">Field Intelligence — Direct Industry Interview (Disclosed, Founding Team Present)</p>
            <p className="text-slate-800 font-semibold mb-1">Advanced Air Mobility Hiring Postures</p>
            <p className="text-slate-500 text-xs mb-3">Interviews conducted by PilotRecognition founding team; founding partner present throughout; all parties informed</p>
            <p className="text-slate-700 text-sm leading-relaxed mb-4">Direct industry interviews reveal a critical systemic contradiction: <strong>the eVTOL sector is defaulting to a 1,500-hour legacy benchmark solely due to the absence of an alternative validation framework.</strong> Not because aircraft type requirements demand it. Not because operational complexity mandates it. Because no structured alternative exists.</p>

            <p className="text-slate-700 text-sm font-semibold mb-2">The Access Gap — Misallocated Capital</p>
            <ul className="space-y-1 text-sm text-slate-700 list-disc ml-5 mb-4">
              <li>A commercial pilot graduate holding <strong>200 hours</strong> represents a baseline training capitalisation of approximately <strong>$50,000 USD</strong> — a licensed professional, medically certified, and legally qualified to operate commercial aircraft</li>
              <li>The sector's stated concession — targeting pilots <strong>below 1,000 hours</strong> as a "middle experience gap" — requires that candidate to independently finance an additional <strong>800 hours</strong> of flight time</li>
              <li>At a market average of <strong>$200 USD per flight hour</strong>, this structural gap demands an additional <strong>$160,000 USD</strong> in capital expenditure</li>
              <li>Aggregate investment to meet the eVTOL "accessible" minimum: <strong>over $210,000 USD</strong> (frequently exceeding <strong>$300,000 USD</strong> for integrated or extended training tracks)</li>
              <li><strong style={{color:'#dc2626'}}>The sector is rebranding the same access barrier, not removing it.</strong> The misallocated capital cost falls entirely on the candidate.</li>
            </ul>

            <p className="text-slate-700 text-sm font-semibold mb-2">Undisclosed Cross-Training Requirements</p>
            <ul className="space-y-1 text-sm text-slate-700 list-disc ml-5 mb-4">
              <li><strong>Fixed-wing aviators</strong> require comprehensive rotary-wing familiarisation modules before eVTOL consideration</li>
              <li><strong>Rotary-wing aviators</strong> require glass-cockpit, fixed-wing instrument familiarisation before eVTOL consideration</li>
              <li>Neither background is disqualifying — but <strong>both require additional modular training investment not currently published, mapped, or factored into any existing pilot profile system</strong></li>
            </ul>

            <p className="text-slate-700 text-sm font-semibold mb-2">Regulatory Timeline Misalignment</p>
            <p className="text-slate-700 text-sm leading-relaxed mb-0">Current market data indicates that leading eVTOL operators — including <strong>Archer Aviation</strong> — project their <strong>Air Operator Certificate (AOC) verification to occur in late Q3 2026 (approximately late September 2026)</strong>. Operators are actively evaluating candidates against legacy airline hour thresholds for commercial operations that are not yet legally cleared to fly. <strong style={{color:'#dc2626'}}>This represents a regulatory timeline misalignment that no current recruitment or verification platform is built to surface, track, or communicate to candidates.</strong></p>
          </div>

          <h3 id="pillar-4-verification-imperative" className="text-xl font-bold text-slate-800 mt-8 mb-3 scroll-mt-24">Strategic Imperative for Verification Partners</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Pillar 4 establishes the competency and verification infrastructure required to resolve this structural friction. By moving away from aggregate hour-tracking to granular, competency-based pilot profiles, the platform enables emerging operators to evaluate the true capabilities of a 200-hour candidate against role-specific requirements — not an inherited legacy threshold.</p>
          <p className="text-slate-700 leading-relaxed mb-4">For strategic verification partners, this structural shift creates an entirely new ecosystem of <strong>continuous credentialling</strong>. As pilots transition between fixed-wing, rotary, and eVTOL operational frameworks, the platform tracks and surfaces non-standard modular certifications, regulatory gap training completions, and specialised competency attainments in real time. <strong style={{color:'#dc2626'}}>This builds an industry-standard verification footprint for the next generation of aviation — one that does not yet exist anywhere in the market.</strong></p>

          <h4 className="text-base font-bold text-slate-800 mt-6 mb-2">The Insurance Barrier — The Real Driver Behind the 1,500-Hour Default</h4>
          <p className="text-slate-700 text-sm leading-relaxed mb-3">The 1,500-hour threshold is not purely a regulatory construct. Its primary enforcer is the aviation insurance market. Underwriters require aggregate flight time as a proxy for risk — because no alternative data set exists to quantify pilot competency at a granular level. Operators default to 1,500 hours not because their aircraft require it, but because their insurers price coverage against it.</p>
          <p className="text-slate-700 text-sm leading-relaxed mb-3"><strong style={{color:'#dc2626'}}>The Recognition Score changes this calculus.</strong> By generating a verified, multi-dimensional competency data set — incorporating simulator performance scores, EBT behavioural assessments, cognitive adaptability ratings, cross-training completions, and modular credential attainments — the platform provides insurers with the granular risk profile they currently lack. A 300-hour Recognition+ pilot with high EBT scores, completed rotary familiarisation, and documented urban operations awareness is a quantifiably lower risk profile than a 1,500-hour legacy candidate with no competency data beyond total time.</p>
          <p className="text-slate-700 text-sm leading-relaxed mb-4">When the insurer accepts the data set, the operator follows. <strong>The platform is not just matching pilots to operators — it is building the evidence base that unlocks lower-hour coverage for the entire emerging aviation sector.</strong></p>

          <h4 className="text-base font-bold text-slate-800 mt-6 mb-2">The Data-Backed Regulatory Lever — Anonymised Competency Benchmark</h4>
          <p className="text-slate-700 text-sm leading-relaxed mb-4">Pillar 4 does not only match pilots. It generates the industry's first <strong>Anonymised Competency Benchmark</strong>. By aggregating performance data from early-career pilots across simulator scores, EBT assessments, cognitive profiles, and modular training completions, the platform provides National Aviation Authorities (NAAs) with the empirical evidence required to shift from hours-based to competency-based licensing frameworks. The platform becomes the data infrastructure for future AAM regulation — not a consequence of it.</p>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-8 rounded-r">
            <p className="text-white text-sm leading-relaxed mb-2"><strong style={{color:'#f87171'}}>The verification opportunity in emerging aviation is not a single background check at point of hire.</strong> It is a continuous, modular credentialling pipeline — triggered each time a pilot completes a cross-training module, attains a new competency rating, or transitions between aircraft categories. <strong style={{color:'#f87171'}}>The platform is the infrastructure. Verification partners are the engine that validates every step.</strong></p>
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>Pathway cards are dynamic, not static.</strong> When a pilot's Recognition Score increases, or they complete a rotary familiarisation module, the platform automatically notifies matched AAM operators. The database is not a searchable list — it is an active recruitment engine that pushes verified readiness signals to operators in real time.</p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">The Misallocated Talent Pool: Early-Career Pilots Gridlocked in the Traditional Pipeline</h3>
          <p className="text-slate-700 leading-relaxed mb-4">The structural inefficiencies within the legacy aviation pipeline do not merely delay airline recruitment — they misallocate a vast cohort of highly motivated, technically capable aviators holding between 200 and 800 total flight hours. This talent pool has exhausted traditional entry routes, yet remains ideally suited for Advanced Air Mobility and alternative aviation roles, provided those pathways are rendered visible, structured, and systematically verified.</p>
          <ul className="space-y-4 mb-6">
            {([
              { t: 'Competency Over Aggregate Flight Hours', d: 'Low total flight time is not an absolute disqualifier. AAM and air taxi operators are actively designing competency frameworks where a 300-hour candidate possessing high cognitive scores, rapid situational adaptability, and urban operations awareness presents a lower operational risk profile than a 5,000-hour legacy airline pilot unaccustomed to low-altitude, high-density environments.' },
              { t: 'Technological-Native Architecture Alignment', d: 'Pilots entering the industry within the last decade are inherently digitally native, simulator-proficient, and optimised for advanced glass-cockpit interfaces. Modern AAM platforms — which lean heavily on fly-by-wire automation, integrated digital interfaces, and high data density — align seamlessly with the cognitive architecture of this demographic.' },
              { t: 'Freedom from Seniority Constraints', d: 'Early-career pilots have not yet accumulated years within traditional airline seniority systems. They possess full career flexibility to pivot permanently into alternative sectors. AAM operators therefore do not compete with legacy airlines for senior talent — they access an unencumbered, motivated pool with no sacrifice of position or pay scale.' },
              { t: 'Mission-Specific and Technical Readiness', d: 'Agricultural aviation and specialised humanitarian operations require pilot profiles defined by low-altitude operational comfort, high mechanical empathy, and a mission-first mindset. These behavioural traits are naturally developed by flight instructors and regional utility pilots — yet they are entirely unmeasured and unsurfaced by the traditional airline hiring apparatus.' },
              { t: 'Transition to Autonomous Fleet Operations', d: 'A critical yet currently invisible career pathway exists within large-scale agricultural and logistics drone operations. Fleet operators actively seek commercially licensed pilots to oversee, coordinate, and command multi-platform remotely piloted aircraft systems. A Commercial Pilot Licence (CPL) serves as an ideal regulatory and operational foundation for these roles — yet no existing recruitment platform communicates this demand to the market, leaving a pre-verified, qualified pilot pool entirely unaware of available positions.' },
            ] as { t: string; d: string }[]).map((item) => (
              <li key={item.t} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">{'->'}</span>
                <span><strong style={{color:'#dc2626'}}>{item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <div className="border border-slate-300 rounded-lg px-6 py-5 mb-8 bg-slate-50">
            <p className="text-xs uppercase tracking-wide font-semibold text-slate-500 mb-3">Sector Spotlight — Agricultural &amp; Autonomous Fleet Operations</p>
            <p className="text-slate-800 font-semibold mb-2">The Autonomous Fleet Pathway — Available Capacity vs. Market Deficit</p>
            <p className="text-slate-700 text-sm leading-relaxed mb-3">Agricultural and logistics drone operators — including multi-level group (MLG) structures covering land, sea, and air autonomous systems — are actively scaling their air operations tier and require commercially licensed pilots for fleet coordination, mission management, and remote pilot station operations. The Commercial Pilot Licence is a <strong>direct regulatory and competency foundation</strong> for these roles. Airspace awareness, weather interpretation, aeronautical decision-making, and SOP-based emergency response are precisely the differentiating capabilities that a CPL holder brings to an autonomous fleet operation.</p>
            <p className="text-slate-700 text-sm leading-relaxed mb-3">Two compounding market failures are preventing this match from occurring:</p>
            <ul className="space-y-1 text-sm text-slate-700 list-disc ml-5 mb-3">
              <li><strong>Demand is not visible to supply.</strong> No platform presents autonomous fleet management as a structured, accessible career pathway for CPL holders. Pilots with 200–800 hours gridlocked in the traditional pipeline are unaware their credentials qualify them for roles available today — not in 2027, not pending AOC certification.</li>
              <li><strong>Supply is not visible to demand.</strong> MLG and agricultural drone fleet operators have no structured channel into a pre-verified, commercially licensed pilot database. They recruit generically, attracting unqualified applicants, while the optimally qualified cohort remains entirely invisible.</li>
            </ul>
            <p className="text-slate-700 text-sm leading-relaxed mb-0">Pillar 4 resolves both failures simultaneously. Autonomous fleet operator pathway cards are published on the platform. Recognition+ pilots holding commercial licences are matched, notified, and presented to operators with verified credentials confirmed. <strong style={{color:'#dc2626'}}>The demand exists. The qualified supply exists. The structural channel between them does not — until now.</strong></p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Understanding the Distinction: Piloted eVTOL vs. Remotely Piloted &amp; Autonomous Drone Operations</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Emerging aviation is not a single category. It encompasses two fundamentally different operational models — and conflating them produces exactly the kind of misrouted recruitment that Pillar 4 exists to correct. The platform maps both separately, with distinct pathway cards and distinct candidate profiles for each.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border border-slate-300 rounded-lg px-5 py-5 bg-white">
              <p className="text-xs uppercase tracking-wide font-semibold text-red-600 mb-2">Piloted eVTOL — Manned Systems</p>
              <p className="text-slate-800 font-semibold text-sm mb-3">Joby Aviation · Archer Aviation · Wisk · Lilium</p>
              <ul className="space-y-2 text-sm text-slate-700 list-disc ml-4">
                <li><strong>Manned aircraft</strong> — a certificated pilot on board for every flight</li>
                <li><strong>City-to-city air mobility</strong> — short-distance, high-frequency urban routes. Example: Abu Dhabi to Dubai, cutting commute time by over 80% versus ground transport</li>
                <li><strong>Standard airspace integration</strong> — IFR/VFR routing, ATC communication, regulated flight paths</li>
                <li><strong>Public sector model (e.g. Joby Aviation)</strong> — mass-market air taxi network. Scheduled routes, high frequency, priced for general public access. Operationally comparable to an urban bus network at altitude. Pilot role: scheduled, repetitive, volume-driven</li>
                <li><strong>Private sector model (e.g. Archer Aviation)</strong> — on-demand, premium, and corporate-focused. Closer to private charter than public transit. Target clientele: corporate travellers, VIP passengers, time-sensitive private sector demand. Pilot role: service-oriented, discretion-first, relationship-proximate. <strong>Archer's private sector positioning is analogous to how Gulfstream is positioned in business aviation today</strong> — a premium brand, a premium aircraft, and an expectation of a premium crew profile to match</li>
                <li><strong>Pilot requirements</strong> — commercial licence, cross-training (fixed-wing ↔ rotary familiarisation), type rating on the specific eVTOL platform. Private sector operators are expected to weight presentation, discretion, client-facing competency, and verified professional standing alongside technical qualifications</li>
                <li><strong style={{color:'#dc2626'}}>Recognition+ as the future access gate for private eVTOL pathways</strong> — as private sector eVTOL operators mature and begin publishing structured pilot requirements, the profile they will seek is not a generic commercial licence holder. It is a <strong>verified, credentialled pilot with a Recognition+ profile</strong> — identity confirmed, credentials wallet complete, EBT assessment on record, and a professional standing that can be presented to a corporate client without hesitation. The platform anticipates this requirement and positions Recognition+ members as the pre-qualified pool for private eVTOL pathway access as the sector scales toward AOC certification and beyond</li>
                <li><strong>AOC dependency</strong> — operations cannot commence until the Air Operator Certificate is issued. Archer Aviation: projected late Q3 2026</li>
                <li><strong>Goal</strong> — eliminate urban traffic congestion, reduce intercity travel time by 80%+, scale across both public scheduled and private on-demand networks</li>
              </ul>
            </div>
            <div className="border border-slate-300 rounded-lg px-5 py-5 bg-white">
              <p className="text-xs uppercase tracking-wide font-semibold text-slate-500 mb-2">Pilotless Drone Operations — Unmanned Systems</p>
              <p className="text-slate-800 font-semibold text-sm mb-3">Agricultural · Logistics · Mapping · Multi-Domain Operations (e.g. MLG)</p>
              <ul className="space-y-2 text-sm text-slate-700 list-disc ml-4">
                <li><strong>Unmanned systems</strong> — remotely operated or autonomous, no pilot on board. Operators such as MLG cover <strong>land, sea, and air</strong> drone categories within a single multi-level group structure</li>
                <li><strong>Pilot relevance — primarily air operations</strong> — commercially licensed pilots are most directly transferable to the air drone category: crop spraying, field mapping, airspace-aware logistics delivery, and precision agriculture flight operations. Land and sea drone roles require different operational expertise</li>
                <li><strong>The remote pilot station</strong> — what appears automated to the public is not unmanaged. Passenger-carrying and high-value cargo drones are monitored and controlled from a remote operations centre — an office environment functionally analogous to a radar room. A licensed operator manages the flight in real time: routing, deconfliction, systems status, and handoff protocols</li>
                <li><strong>SOPs for mishaps and emergencies</strong> — remote drone operators follow structured emergency procedures for signal loss, airspace incursions, mechanical anomalies, and forced landing scenarios. These are pilot-oriented SOPs. They require aeronautical judgement, not just technical interface operation</li>
                <li><strong>Operator role</strong> — remote flight management, mission planning, airspace deconfliction, emergency response, systems oversight. The cockpit has moved to an office. The pilot function has not changed</li>
                <li><strong>Pilot advantage</strong> — commercial licence holders bring airspace awareness, weather judgement, emergency decision-making, and SOP discipline that direct-entry drone operators lack entirely — a genuine competitive edge within the air category of any multi-domain operator</li>
                <li><strong>Available now</strong> — no AOC pending, no type certification in progress. Air drone roles exist and are hiring today</li>
                <li><strong>The gap</strong> — commercially licensed pilots are not being presented with these roles. The pathway is invisible to the very candidates most qualified for the air operations tier</li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-8 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>Two sectors. Two completely different qualification paths. One platform that maps both.</strong> A pilot suitable for Joby or Archer requires a commercial licence, cross-training, and a type rating — and must wait for an AOC. A pilot suitable for agricultural drone fleet coordination requires a commercial licence and is hirable today. <strong style={{color:'#f87171'}}>Both are invisible to the pilots who qualify for them. Pillar 4 makes both visible.</strong></p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">Pain Points for Pilots</h3>
          <ul className="space-y-2 mb-6">
            {([
              { n: '1', t: 'Emerging aviation is invisible as a pathway', d: <><strong>No platform presents eVTOL, air taxi, drone logistics, agricultural drone operations, or autonomous systems as structured, searchable pathways.</strong> Pilots with the right disposition — adaptive, tech-native, low-time but high-potential — never see these sectors as viable options because they are never presented as such. Critically, <strong>pilots do not know their commercial licence is a qualifying foundation for agricultural and multi-level drone operator roles</strong> — a pathway that exists now, not in 2027.</> },
              { n: '2', t: 'No alternative certification framework', d: <><strong>Pilots locked out of the 1,500-hour airline route have no structured alternative.</strong> Emerging aviation operators are defining their own competency requirements, but those definitions are not published, searchable, or comparable. Pilots cannot build toward a target they cannot see.</> },
              { n: '3', t: 'No cognitive or behavioural profiling', d: <>Emerging aviation roles — particularly eVTOL and autonomous systems — require specific cognitive traits: <strong>rapid decision-making, systems awareness, comfort with ambiguity, and urban spatial orientation.</strong> No platform surfaces these traits in a pilot profile or maps them to operator requirements.</> },
              { n: '4', t: 'The pipeline default', d: <>Even pilots who would thrive in emerging aviation default to the traditional airline pipeline because <strong>no alternative is presented to them at the decision point</strong> — when they finish training, when they hit the instructor ceiling, when they consider their next move.</> },
              { n: '5', t: 'No transition data', d: <><strong>Pilots who have made the move from traditional to emerging aviation sectors have no platform to share that transition.</strong> The data — what worked, what was required, what the lifestyle looks like — does not exist in a structured, accessible format.</> },
            ] as { n: string; t: string; d: React.ReactNode }[]).map((item) => (
              <li key={item.n} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">{'->'}</span>
                <span><strong style={{color:'#dc2626'}}>{item.n}. {item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">Pain Points for Emerging Aviation Operators</h3>
          <ul className="space-y-2 mb-6">
            {([
              { n: '1', t: 'No candidate pipeline built for their requirements', d: <><strong>Emerging aviation operators cannot hire from the traditional pipeline without modification.</strong> They need pilots who meet non-standard competency frameworks — and no recruitment platform is configured to filter for those requirements.</> },
              { n: '2', t: 'Competing against legacy airlines for the wrong candidates', d: <>When emerging operators post on standard aviation job boards, they attract high-hour candidates seeking airline alternatives — not the early-career, tech-native, adaptive pilots they actually need. <strong>The wrong pool is self-selecting in.</strong></> },
              { n: '3', t: 'No industry standard for competency definition', d: <><strong>eVTOL and air taxi operators are individually defining their own competency frameworks</strong> with no cross-industry alignment. The platform creates the first structured format for publishing these requirements — enabling pilots to build toward them and enabling operators to compare their standards against peers.</> },
              { n: '4', t: '40–60% higher training costs from mis-hires', d: <>Hiring a traditional pilot and retraining them for eVTOL or air taxi operations costs significantly more than hiring a candidate whose profile was matched against emerging aviation criteria from the start. <strong>The absence of a structured matching layer is a direct cost driver.</strong></> },
              { n: '5', t: 'First-mover advantage is being lost', d: <>Operators who define competency standards early establish the industry benchmark. <strong>Without a platform to publish those standards, the first-mover advantage evaporates</strong> — competitors can match or exceed the framework without contributing to its development.</> },
              { n: '6', t: 'No direct access to pilots who are actively interested', d: <>Because emerging aviation is new, operators have no established channel into a pool of pilots who have specifically expressed interest in eVTOL, air taxi, or drone operations. <strong>They are recruiting from a general population with no interest signal, no pre-qualification, and no awareness of the sector's specific requirements.</strong> The platform provides the first structured pipeline of pilots who have actively opted into emerging aviation pathways — interest already declared, profile already built.</> },
              { n: '7', t: 'Aviation colleges do not yet recognise or address eVTOL demand', d: <>Flight training organisations and aviation universities have not integrated emerging aviation sector requirements into their curricula. <strong>There is no standard training module for eVTOL transition, no cross-training pathway taught at ATO level, and no graduate pipeline being built toward these operators.</strong> Pilots leave training with no awareness that these roles exist and no preparation for the cross-training they require. The platform addresses this directly — publishing the requirements, making the pathways visible to graduates at the point of career decision, and working with aviation training organisations to align curriculum to emerging sector demand.</>},
            ] as { n: string; t: string; d: React.ReactNode }[]).map((item) => (
              <li key={item.n} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">{'->'}</span>
                <span><strong style={{color:'#dc2626'}}>{item.n}. {item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">The Platform Solution</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Pillar 4 introduces the <strong>Alternative Avenues pathway layer</strong> — a dedicated section of the platform where emerging aviation operators publish structured competency requirements, and pilots are matched against those requirements regardless of total hours. <strong>Hours are one data point. Cognitive profile, adaptability score, simulator comfort, and EBT alignment are weighted equally.</strong></p>
          <p className="text-slate-700 leading-relaxed mb-4">For the first time, a 300-hour pilot with a strong Recognition Score, completed EBT video assessment, and a technology-native profile can be surfaced to an eVTOL operator ahead of a 2,000-hour legacy candidate who does not meet the cognitive requirements. <strong>The platform does not replicate the airline hiring model for emerging aviation. It builds a new one.</strong></p>
          <div className="bg-slate-50 border border-slate-200 rounded px-5 py-4 mb-6 text-sm text-slate-700">
            <p className="font-semibold text-slate-800 mb-2">What Pillar 4 pathway cards include:</p>
            <ul className="space-y-1 list-disc ml-4">
              <li><strong>Sector type</strong> — eVTOL, air taxi, drone logistics, agricultural aviation, autonomous systems</li>
              <li><strong>Minimum hours profile</strong> — total time, specific operation type (not a single threshold)</li>
              <li><strong>Cognitive and behavioural requirements</strong> — operator-defined, mapped to EBT/CBTA frameworks</li>
              <li><strong>Certification pathway</strong> — type rating, alternative certification route, or operator-specific training program</li>
              <li><strong>Technology platform</strong> — aircraft systems, avionics stack, operational software</li>
              <li><strong>Training cost and support</strong> — operator-funded training, bond requirements, return of service conditions</li>
              <li><strong>Career trajectory</strong> — progression route within the emerging operator's structure</li>
            </ul>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-10 mb-3">The ATO-to-AAM Bridge — Pre-Filtering the Pipeline at the Source</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Aviation training organisations are currently producing CPL graduates with no awareness that Advanced Air Mobility roles exist, no curriculum alignment with AAM competency requirements, and no pathway from graduation into anything other than the traditional airline queue. The platform addresses this at the source — not after graduation, but during it.</p>
          <div className="bg-slate-50 border border-slate-200 rounded px-5 py-4 mb-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-800 mb-2">AAM-Ready ATO Tagging</p>
            <p className="mb-3">The platform works with select Flight Training Organisations (ATOs/FTOs) to tag graduates as <strong style={{color:'#dc2626'}}>"AAM-Ready"</strong> — a verified designation indicating the graduate's training included eVTOL-relevant modules such as:</p>
            <ul className="space-y-1 list-disc ml-4 mb-3">
              <li>High-density urban navigation and low-altitude operational procedures</li>
              <li>Glass-cockpit automation and fly-by-wire systems familiarisation</li>
              <li>Energy management systems (applicable to electric propulsion platforms)</li>
              <li>Remote Pilot Station (RPS) orientation and handover procedure awareness</li>
            </ul>
            <p>ATOs that integrate these modules into their standard CPL curriculum are listed on the platform as <strong>AAM-Affiliated Training Organisations</strong>. Their graduates enter the platform with a pre-filtered, pre-verified designation — reducing operator screening time and creating a structured pipeline from training to emerging sector employment for the first time.</p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-10 mb-3">Modular Credentialling Taxonomy — The Digital Competency Map</h3>
          <p className="text-slate-700 leading-relaxed mb-4">A pilot profile on this platform is not a resumé. It is a <strong>Competency Map</strong> — a verified, dynamic record of specific sub-competencies that directly correspond to emerging aviation role requirements. The following taxonomy defines the micro-credentials the platform tracks, verifies, and surfaces to operators:</p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Micro-Credential</th>
                  <th className="text-left px-4 py-2 font-semibold">Applicable Sector</th>
                  <th className="text-left px-4 py-2 font-semibold">Verification Method</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { cred: 'Urban Airspace Management (UAM) Protocol', sector: 'eVTOL, Air Taxi', method: 'Simulator assessment + operator-defined competency sign-off' },
                  { cred: 'Battery / Energy Management Systems', sector: 'eVTOL, Electric UAM', method: 'Type-specific training completion record' },
                  { cred: 'Remote Pilot Station (RPS) Handover Procedures', sector: 'Autonomous Fleet, Drone Logistics', method: 'Operator SOP completion + platform attestation' },
                  { cred: 'High-Frequency Short-Haul Fatigue Management', sector: 'Air Taxi, eVTOL', method: 'EBT cognitive load assessment + operator declaration' },
                  { cred: 'Fixed-Wing to Rotary Familiarisation', sector: 'eVTOL (all)', method: 'ATO completion record, verified by platform' },
                  { cred: 'Rotary to Fixed-Wing Familiarisation', sector: 'eVTOL (all)', method: 'ATO completion record, verified by platform' },
                  { cred: 'Multi-Platform Fleet Coordination', sector: 'Autonomous Fleet, MLG Operations', method: 'Operator-issued module completion + platform attestation' },
                  { cred: 'Glass-Cockpit Automation Proficiency', sector: 'eVTOL, AAM (all)', method: 'Simulator performance score, EBT alignment' },
                  { cred: 'Humanitarian / Austerity Operations', sector: 'Autonomous Fleet, Agricultural, Disaster Relief', method: 'Mission-type declaration + operator or NGO sign-off. Elevated profile weighting for non-templated, high-stress environment competency.' },
                ] as { cred: string; sector: string; method: string }[]).map((row, i) => (
                  <tr key={row.cred} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-2 border border-slate-200 font-medium text-slate-800">{row.cred}</td>
                    <td className="px-4 py-2 border border-slate-200 text-slate-600">{row.sector}</td>
                    <td className="px-4 py-2 border border-slate-200 text-slate-600">{row.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-10 mb-3">Fleet Command Transition Package — CPL to Autonomous Operations</h3>
          <p className="text-slate-700 leading-relaxed mb-4">For commercially licensed pilots transitioning into autonomous fleet operations, the platform offers a structured <strong>Fleet Command Transition Package</strong> — a verified modular pathway that repositions the move from traditional flight to autonomous fleet management not as a downgrade, but as a <strong>specialised command function</strong>.</p>
          <div className="bg-slate-50 border border-slate-200 rounded px-5 py-4 mb-6 text-sm text-slate-700">
            <p className="font-semibold text-slate-800 mb-2">Fleet Command Operations — What It Includes:</p>
            <ul className="space-y-1 list-disc ml-4">
              <li><strong>Multi-Platform Coordination</strong> micro-credential — verified by the platform upon operator module completion</li>
              <li><strong>Remote Pilot Station orientation</strong> — documented SOP familiarity and emergency procedure competency</li>
              <li><strong>Airspace deconfliction for autonomous systems</strong> — competency assessment mapped to specific fleet types</li>
              <li><strong>Fleet Command designation</strong> on pilot profile — visible to all autonomous fleet operators browsing the Alternative Avenues layer</li>
            </ul>
            <p className="mt-3 text-slate-600">The CPL holder does not become a drone operator. <strong style={{color:'#dc2626'}}>They become a Fleet Commander — a licensed aviation professional managing airspace, systems, and safety from a command centre rather than a cockpit.</strong> The competency is the same. The platform makes it visible, verified, and searchable.</p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-2">Commercial Tiers — Emerging Sector Operator Access</h3>
          <p className="text-slate-700 leading-relaxed mb-6">Emerging aviation operators access the platform on a model designed for early-stage and scaling operations — lower entry cost, higher strategic value. Access is structured across two independent products.</p>

          <h4 className="text-lg font-bold text-slate-800 mb-3">Model 1 — Alternative Avenues Pathway Listings &amp; Pilot Database Access</h4>
          <p className="text-slate-600 text-sm mb-3">For emerging sector operators publishing structured competency pathway cards and accessing the matched, verified pilot pool.</p>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Tier</th>
                  <th className="text-left px-4 py-2 font-semibold">Fee</th>
                  <th className="text-left px-4 py-2 font-semibold">Includes</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { tier: 'Beta Partner', fee: 'Free', features: <><strong style={{color:'#dc2626'}}>Publish up to 3 Alternative Avenues pathway cards.</strong> Access first 10 matched pilot profiles — full profiles visible. <strong style={{color:'#dc2626'}}>Remaining matched pilots blurred</strong> — live signal of pool depth without full access. Participate in platform beta testing and competency framework co-development. <span style={{color:'#dc2626'}}>Recognition in platform as founding emerging sector partner.</span></> },
                  { tier: 'Enterprise', fee: '$1,000/yr', features: <><strong style={{color:'#dc2626'}}>Unlimited pathway listings</strong>, full matched pilot database access filtered by cognitive score and EBT assessment results, Recognition Score filtering, EBT video assessment viewing, <strong style={{color:'#dc2626'}}>transition data reports</strong> (pilots moving from traditional to emerging sectors), advanced competency framework publishing tools, <strong style={{color:'#dc2626'}}>industry benchmark reports</strong> comparing operator standards across the emerging aviation sector. <strong style={{color:'#dc2626'}}>Full API access</strong> — when an operator opens a role internally, the platform automatically pushes the top matched Recognition+ candidates directly into the operator's existing HR system. The platform becomes invisible infrastructure: indispensable, silent, always on.</> },
                ] as { tier: string; fee: string; features: React.ReactNode }[]).map((row, i) => (
                  <tr key={row.tier} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">{row.tier}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-red-400 font-semibold">{row.fee}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.features}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mb-3">Model 2 — Emerging Operator Profile Listing</h4>
          <p className="text-slate-600 text-sm mb-3">A separate product. Emerging sector operators are new to market and require public visibility to build awareness and attract pilots at scale. Profile listings are <strong>publicly visible by default</strong> — searchable by any platform user. Operators who subsequently shift to a private or premium sector model (e.g. corporate eVTOL, VIP air mobility) may elect to restrict visibility to verified Recognition+ members only, mirroring the charter operator model in Pillar 3.</p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Product</th>
                  <th className="text-left px-4 py-2 font-semibold">Annual Fee</th>
                  <th className="text-left px-4 py-2 font-semibold">What It Includes</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { tier: 'Emerging Sector Expectations Listing', fee: '$500/yr', features: 'Structured operator profile — sector type, aircraft platform, operational geography, competency framework summary, AOC status, cross-training requirements, and culture. Publicly visible and searchable by default. Operator may elect to restrict to Recognition+ verified pilots only upon transitioning to a private or premium sector model.' },
                ] as { tier: string; fee: string; features: string }[]).map((row) => (
                  <tr key={row.tier} className="bg-slate-800">
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">{row.tier}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-red-400 font-semibold">{row.fee}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.features}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded px-5 py-4 mb-8 text-sm text-slate-700">
            <p className="font-semibold text-slate-800 mb-3">Success Fee — Tiered by Contract Duration &amp; Role Type</p>
            <ul className="space-y-2 list-disc ml-4 mb-3">
              <li><strong>Short-term / Seasonal Roles</strong> (agricultural aviation, mapping, logistics drone): <strong style={{color:'#dc2626'}}>$250 per confirmed placement</strong> — or alternatively, a subscription <strong>Seat Model</strong> at $100/month per active deployed pilot, for operators with high-frequency seasonal recruitment cycles</li>
              <li><strong>Career-Track Roles</strong> (Archer/Joby eVTOL, air taxi, fleet command): <strong style={{color:'#dc2626'}}>$500 per confirmed placement</strong> — triggered upon the pilot passing the operator's initial training programme or probation period, not at offer acceptance</li>
              <li><strong>First 5 placements per operator:</strong> Success fee waived across all tiers</li>
            </ul>
            <p className="text-slate-600 mb-2"><strong>Clawback Credit Protection:</strong> If a placed pilot exits within 90 days of commencement, the operator receives a <strong>platform credit</strong> equivalent to the success fee paid — redeemable against the next matched placement. This reinforces that platform verification produces better retention outcomes than legacy hiring, and protects operators during the early deployment phase.</p>
            <p className="text-slate-600"><strong style={{color:'#dc2626'}}>Retention Badge:</strong> Operators whose placed pilots remain in role beyond 12 months are awarded a <strong>High Retention</strong> badge on their public Model 2 profile. In a new industry where operator culture is unknown and pilot confidence is low, a verified retention signal is the most powerful recruitment asset an emerging aviation operator can display. It attracts top-tier CPL holders who are evaluating risk before committing to a sector transition.</p>
          </div>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-8 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>The first-mover advantage is real.</strong> Emerging aviation operators who publish competency frameworks on this platform define the industry standard before their competitors do. Early-career pilots who align their profile to those frameworks become the pipeline. <strong style={{color:'#f87171'}}>The operator who builds the framework owns the talent pool that grows around it.</strong></p>
          </div>

          <hr className="my-10 border-slate-300" />

          <h2 id="pillar-11-verification" className="text-4xl font-bold text-slate-900 mt-12 mb-6 pb-4 border-b-2 border-slate-900 scroll-mt-24">
            PILLAR 11: BACKGROUND CHECKS &amp; VERIFICATION PROVIDERS
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub C — Capital, Risk &amp; Compliance</p>

          <div className="bg-slate-100 border border-slate-300 rounded px-5 py-3 mb-8 flex items-start gap-3">
            <span className="text-red-500 font-bold text-lg flex-shrink-0">↗</span>
            <p className="text-slate-700 text-sm leading-relaxed">
              <strong>Cross-reference — Pillar 4:</strong> The emerging aviation sector introduces a new class of verification requirement that extends beyond point-of-hire background checks. As pilots transition between fixed-wing, rotary, and eVTOL frameworks, modular cross-training completions and non-standard competency certifications must be tracked and verified continuously.{' '}
              <button
                onClick={() => scrollTo('pillar-4-verification-imperative')}
                className="text-red-600 font-semibold underline underline-offset-2 hover:text-red-800 cursor-pointer bg-transparent border-none p-0"
              >
                See: Strategic Imperative for Verification Partners — Pillar 4 ↑
              </button>
            </p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Problem: A Broken, Manual, Aviation-Blind Screening Industry</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Aviation background screening operates on <strong>outdated manual processes</strong> that create friction for every party in the hiring chain. Verification is not a minor inconvenience — it is a structural bottleneck that delays hiring, duplicates cost, exposes operators to fraud risk, and leaves pilots in a compliance void with no portable credential infrastructure.</p>
          <p className="text-slate-700 leading-relaxed mb-4">The deeper problem: generic background check providers treat pilots as standard employees. They have no understanding of aviation-specific credential structures — no access to CAA/FAA license databases, no awareness of Class 1 medical expiration cycles, no integration with airport security authorities for CTC and airside pass vetting. They verify employment history and run a criminal check. That is not aviation background screening. <strong>That is a generic HR process applied to a safety-critical profession it was never designed for.</strong></p>
          <p className="text-slate-700 leading-relaxed mb-6">Pillar 11 addresses this through a <strong>unified verification layer</strong> embedded directly into the platform — background checking as a native service, not an external chore. Pilots build a verified credential wallet once. It travels with them across every operator, every regulator, and every sector. <strong>Verify once. Apply anywhere.</strong></p>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">Pain Points — Airlines &amp; Operators</h4>
          <ul className="space-y-2 mb-6">
            {([
              { n: '1', t: 'Manual verification workflows', d: 'Employment history, license validation, and criminal checks require manual document chasing across multiple authorities — CAA, FAA, local police. Average turnaround: 14–30 days per candidate.' },
              { n: '2', t: 'Duplicate screening costs', d: 'Each airline runs identical checks on the same pilot. A pilot applying to 5 operators undergoes 5 separate background checks — industry-wide cost duplication with no shared infrastructure.' },
              { n: '3', t: 'No real-time status visibility', d: 'HR cannot track check progress. Pilots disappear into black holes with no timeline communication. Hiring decisions stall.' },
              { n: '4', t: 'Static, forgeable records', d: 'Paper-based certificates and self-reported employment histories are easily falsified. Fraud risk is high, detection is manual, and the consequences in aviation are safety-critical.' },
              { n: '5', t: 'Inconsistent global coverage', d: 'Check availability and turnaround varies wildly by country. No transparency on timelines, no standardisation across jurisdictions, no shared framework.' },
              { n: '6', t: 'No API integration capability', d: 'Most verification providers lack API infrastructure. Airlines manually download PDFs and re-upload to ATS systems — a process entirely incompatible with a live recruitment pipeline.' },
            ] as { n: string; t: string; d: string }[]).map((item) => (
              <li key={item.n} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong className="text-red-600">{item.n}. {item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">Pain Points — Pilots</h4>
          <ul className="space-y-2 mb-6">
            {([
              { n: '1', t: 'Opaque requirements', d: 'Each airline has a different check scope. Pilots discover requirements only after applying — triggering surprise rejections at the final offer stage.' },
              { n: '2', t: 'No pre-verification option', d: 'Pilots cannot complete checks proactively. They must wait for an airline to initiate, extending time-to-hire indefinitely.' },
              { n: '3', t: 'Repeat check burden', d: 'Every new application requires starting verification from zero. No portable credential wallet exists. The same pilot, verified five times, with no recognition of prior clearance.' },
              { n: '4', t: 'Insurance verification gap', d: 'Many operators require proof of life and accident insurance coverage with aviation-specific terms. No standard mechanism exists to verify this — it is the most overlooked compliance gap in pilot hiring.' },
              { n: '5', t: 'Cost uncertainty', d: 'Check costs are borne inconsistently — sometimes by the pilot, sometimes by the airline. No predictable pricing model, no transparency on scope, no clarity on what is being checked.' },
            ] as { n: string; t: string; d: string }[]).map((item) => (
              <li key={item.n} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong className="text-red-600">{item.n}. {item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">The Domain Knowledge Gap — Why Generic Providers Fail Aviation</h4>
          <p className="text-slate-700 leading-relaxed mb-4">Generic background check providers treat pilots as standard employees. They have no understanding of aviation-specific credential structures and no integration with the ecosystem required to verify them properly:</p>
          <ul className="space-y-2 mb-6">
            {([
              { n: '1', t: 'No aviation credential taxonomy', d: 'Generic providers do not understand license classes (PPL/CPL/ATPL), type ratings, medical certificate classes, or recency requirements. Verification forms do not capture aviation-specific data fields.' },
              { n: '2', t: 'Aviation security vetting blind spot', d: 'Standard checks miss CTC (Counter Terrorist Check), airside passes, airport ID badges, and Known Crewmember status — distinct from criminal checks and requiring aviation authority coordination.' },
              { n: '3', t: 'Insurance verification ignorance', d: 'Many operators require pilots to carry life and accident insurance with specific aviation coverage clauses. Generic providers have no awareness of this requirement — it is standard in aviation and completely foreign to employment screening.' },
              { n: '4', t: 'Medical certification complexity ignored', d: 'A Class 1 medical expires every 12 months (6 months for over-40s). Generic providers verify current employment but do not track medical expiration windows, renewal status, or Special Issuance conditions.' },
              { n: '5', t: 'Multi-authority licensing unaddressed', d: 'Pilots often hold licenses from multiple authorities — FAA, EASA, CAAP. Generic providers check one country. They do not understand license conversion, validation, or foreign license acceptance rules per operator.' },
            ] as { n: string; t: string; d: string }[]).map((item) => (
              <li key={item.n} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong className="text-red-600">{item.n}. {item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">The Platform Solution — Unified Verification Layer</h4>
          <p className="text-slate-700 leading-relaxed mb-4">Pillar 11 integrates background checking into the platform as a native service layer. Pilots build a <strong>verified credential wallet</strong> — once — that is recognised across every operator, every regulator, and every sector on the platform. Airlines no longer initiate checks from scratch. They access a pre-verified profile and pull only what they need, in real time, with pilot consent.</p>
          <p className="text-slate-700 leading-relaxed mb-4">The platform acts as the <strong>central coordination hub</strong> — connecting verification providers with the full aviation ecosystem they currently have no access to: aviation insurance underwriters, aviation medical examiners, aviation authority license databases, flight training organisations, airport security authorities, and airline HR requirement matrices. Verification is no longer a disconnected snapshot. It becomes a <strong>live, portable, pilot-owned credential</strong> that compounds in value with every new clearance earned.</p>
          <p className="text-slate-700 leading-relaxed mb-8">Pilots who enrol in <strong>Recognition+</strong> receive background checking as part of their membership — eliminating the cost uncertainty, the repeat burden, and the opaque requirements that currently make verification the final hidden barrier between a qualified pilot and a confirmed offer.</p>

          <h4 className="text-lg font-bold text-slate-800 mt-8 mb-3">The Pilot-Inputted Verification Model — Why This Changes Everything</h4>
          <p className="text-slate-700 leading-relaxed mb-4">Traditional background check providers sit downstream. They are reactive — waiting for an airline or employer to initiate a check before anything happens. <strong>This model is broken for aviation.</strong> The airline triggers the check only after a pilot has already applied, already passed screening, and is already in the offer stage. The check becomes a final-stage blocker rather than a pre-qualification signal.</p>
          <p className="text-slate-700 leading-relaxed mb-4">The platform flips this. <strong>The pilot initiates their own verification — before they apply to anyone.</strong> They build a verified credential wallet as part of their profile, driven by their own ambition to appear pre-cleared to any operator on the platform. This is not a passive transaction. It is an active career investment.</p>
          <p className="text-slate-700 leading-relaxed mb-6">This shift has three structural consequences that generic platforms and traditional providers cannot replicate:</p>
          <ul className="space-y-3 mb-6">
            {([
              { t: 'Pre-application volume — not post-offer', d: <>The platform captures pilots at the moment of <strong>profile creation</strong>, not the moment of job application. Verification is embedded into the pilot journey from day one — before any airline involvement. This generates <strong>continuous, unsolicited verification demand</strong> driven entirely by pilots building their own competitive profiles.</> },
              { t: 'Portable, pilot-owned credentials', d: <>Once verified, the credential belongs to the pilot — stored in a <strong>digital wallet</strong>, tamper-proof, and shareable with any operator on the platform with a single consent action. <strong>One verification. Every airline. No repetition.</strong> A pilot verified once is verified for every pathway they ever submit interest against — ending the duplicate cost model entirely.</> },
              { t: 'Reactive B2B becomes proactive B2C2B', d: <>Verification partners integrated into the platform stop waiting for enterprise clients to send work. <strong>Pilots bring the checks directly to them</strong> — creating a self-sustaining inbound verification pipeline. When verified pilots apply to airlines, those airlines encounter the verified credential infrastructure organically — a <strong>natural B2B acquisition channel</strong> for any verification partner embedded in the platform.</> },
            ] as { t: string; d: React.ReactNode }[]).map((item) => (
              <li key={item.t} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong style={{color:'#dc2626'}}>{item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <div className="my-6 px-5 py-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
            <p className="text-slate-800 text-sm leading-relaxed"><strong>The Commercial Logic:</strong> A pilot applying to 5 airlines on a traditional model generates 5 separate background checks — each paid by a different airline, each starting from zero, each taking 2–4 weeks. On this platform, the same pilot generates <strong>1 check, paid once, portable across all 5 applications</strong>. The verification partner processes fewer checks but captures <strong>every check that pilot will ever need</strong> — plus every pilot on the platform who follows the same model. Volume is not reduced. It is concentrated and made permanent.</p>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">Two Distinct Verification Layers — Pilot-Initiated vs. Operator-Requested</h4>
          <p className="text-slate-700 leading-relaxed mb-4">These are not the same product. They serve different purposes, are triggered by different parties, and carry different scopes. Both exist on the platform — independently.</p>

          <h5 className="font-semibold text-slate-800 mt-4 mb-2">Layer 1 — Pilot-Initiated Profile Verification (at account creation)</h5>
          <p className="text-slate-700 text-sm leading-relaxed mb-3">The pilot triggers this themselves — proactively, before applying to anyone. The purpose is to build a credible, portable profile that signals readiness to any operator on the platform. This layer is <strong>pilot-owned and career-portable.</strong></p>
          <ul className="space-y-2 mb-5">
            {([
              { t: 'Unverified profile (Free)', d: <>Pilot submits license number, logbook hours, and employment history as self-declared claims. Operators can see the <strong>signal of a match</strong> against their pathway — but the data carries no verification seal. <strong>Credibility is visible but unconfirmed.</strong></> },
              { t: 'Verified profile — Digital Credential Wallet', d: <>Pilot initiates formal verification of their own credentials: <strong>identity, license, medical status, employment history, ATO records.</strong> Once verified, results are stored in a tamper-proof digital wallet. A <strong>"Verification Preferred" badge</strong> appears on their profile. This credential is portable — shared with any operator, at any time, with a single consent action. Verify once. Apply anywhere.</> },
            ] as { t: string; d: React.ReactNode }[]).map((item) => (
              <li key={item.t} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong style={{color:'#dc2626'}}>{item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h5 className="font-semibold text-slate-800 mt-4 mb-2">Layer 2 — Operator-Requested Deep Verification (optional, on selected candidates)</h5>
          <p className="text-slate-700 text-sm leading-relaxed mb-3">This is a separate, operator-driven process. After reviewing pilot profiles from the database, an airline or cargo operator may choose to request <strong>deeper, operator-specific verification</strong> on a selected shortlist of candidates. This is <strong>entirely optional</strong> — the operator decides if, when, and on whom they initiate it. The pilot is notified and must consent before any additional checks proceed.</p>
          <ul className="space-y-2 mb-5">
            {([
              { t: 'Criminal background check', d: 'Jurisdiction-specific: NBI (Philippines), DBS (UK), FBI (US), equivalent authorities per country. Operator selects scope. Pilot consents.' },
              { t: 'Right-to-work and visa validation', d: 'Citizenship, visa status, work permit — verified per the operator\'s base country and hiring policy.' },
              { t: 'Aviation security vetting', d: 'CTC (Counter Terrorist Check), airside pass history, airport ID badge records — coordination with aviation security authorities where applicable.' },
              { t: 'Insurance and incident history', d: 'Aircraft incident history, NTSB/AAIB/TSB reports, hull loss involvement, insurance claims — pilot consent required. Scope configurable per operator.' },
              { t: 'Reference and conduct verification', d: 'Previous employer conduct records, structured reference checks, training dismissal history — verified against primary sources.' },
            ] as { t: string; d: string }[]).map((item) => (
              <li key={item.t} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 mt-1 flex-shrink-0">•</span>
                <span><strong style={{color:'#dc2626'}}>{item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 text-sm leading-relaxed mb-8">The operator pays per check for Layer 2. The pilot's Layer 1 wallet is not replaced — it is supplemented. An operator who completes a deep verification on a candidate can choose to contribute the results back to the pilot's wallet (with consent), further strengthening the pilot's portable credential for future applications.</p>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">Ecosystem Integration — How the Platform Connects Every Stakeholder</h4>

          <h5 className="text-base font-bold text-slate-800 mt-4 mb-2">For Airline HR Departments</h5>
          <p className="leading-relaxed mb-2 text-sm" style={{color:'#dc2626'}}><strong>Current gap:</strong> Each airline maintains unique requirements in siloed systems. Verification providers apply generic templates, missing operator-specific policies. HR manually chases documents across CAA/FAA/local authorities. Turnaround: 14–30 days per candidate.</p>
          <ul className="text-sm text-slate-700 space-y-1 mb-4 ml-4 list-disc">
            <li>Airlines publish per-role verification requirement matrices on platform backend (Captains = full checks, Cadets = standard, First Officers = enhanced)</li>
            <li>Webhook notifications feed verification status directly into airline ATS (Greenhouse, Workday, Lever)</li>
            <li>Pre-cleared candidate pipeline: 80% faster screening time — pilots arrive pre-verified with digital wallet</li>
            <li>Zero-cost model: pilots pay for verification, airlines access pre-verified candidates at no cost</li>
            <li>GDPR/PDPA compliant data handling across all jurisdictions</li>
          </ul>

          <h5 className="text-base font-bold text-slate-800 mt-4 mb-2">For Aviation Medical Examiners (AMEs)</h5>
          <p className="leading-relaxed mb-2 text-sm" style={{color:'#dc2626'}}><strong>Current gap:</strong> Medical status verification requires manual contact with individual AMEs. Background check companies cannot access Class 1/2/3 status, Special Issuance conditions, or renewal windows.</p>
          <ul className="text-sm text-slate-700 space-y-1 mb-4 ml-4 list-disc">
            <li>AMEs provide live Class 1/2/3 validation, Special Issuance tracking, and renewal window data via API</li>
            <li>Medical certificates flow directly into pilot-controlled digital wallets with immutable audit trail</li>
            <li>Automated renewal window monitoring enables proactive pilot notifications before expiration</li>
            <li>Underwriters receive real-time medical status for risk evaluation — weeks to minutes</li>
          </ul>

          <h5 className="text-base font-bold text-slate-800 mt-4 mb-2">For Aviation Authorities (CAA, FAA, EASA, CAAP)</h5>
          <p className="leading-relaxed mb-2 text-sm" style={{color:'#dc2626'}}><strong>Current gap:</strong> Each authority maintains separate license databases. Verification providers cannot access real-time credential validation, relying on pilot-submitted documents that may be falsified.</p>
          <ul className="text-sm text-slate-700 space-y-1 mb-4 ml-4 list-disc">
            <li>Pre-established API connections to CAA, FAA, EASA, CAAP for real-time license lookups</li>
            <li>Cross-border validation: API access for license conversion, validation, and foreign license acceptance rules per operator</li>
            <li>Biometric-linked verification with blockchain audit trails eliminates forged license submissions</li>
            <li>Authority databases remain source of truth — real-time lookups eliminate stale data</li>
          </ul>

          <h5 className="text-base font-bold text-slate-800 mt-4 mb-2">For Flight Training Organisations (ATOs)</h5>
          <p className="leading-relaxed mb-2 text-sm" style={{color:'#dc2626'}}><strong>Current gap:</strong> Cadet program verification cannot access ATO transcripts, simulator hour logs, or training completion records — leaving a critical blind spot for low-time pilots entering the industry.</p>
          <ul className="text-sm text-slate-700 space-y-1 mb-4 ml-4 list-disc">
            <li>ATOs provide verified training records, simulator hours, and completion certificates — blockchain-backed</li>
            <li>Schools feed graduating pilots directly into the platform pipeline with pre-cleared verification status</li>
            <li>Students can complete background checks before graduation — arriving at operators as pre-verified candidates</li>
            <li>ATOs receive "Recognition-Ready Training Provider" status and commission per graduate who joins the platform</li>
            <li>Training records help insurance underwriters evaluate low-time pilot risk — closing a critical underwriting gap</li>
          </ul>

          <h5 className="text-base font-bold text-slate-800 mt-4 mb-2">For Airport Security Authorities</h5>
          <p className="leading-relaxed mb-2 text-sm" style={{color:'#dc2626'}}><strong>Current gap:</strong> Airside passes, Counter Terrorist Check (CTC), and Known Crewmember status require direct aviation authority coordination. Background check companies treat these as standard criminal checks — missing aviation-specific security vetting entirely.</p>
          <ul className="text-sm text-slate-700 space-y-1 mb-4 ml-4 list-disc">
            <li>Coordinated verification channels for CTC, airside passes, airport ID badges, and Known Crewmember status</li>
            <li>Pre-verified security credentials flow into pilot wallet — airlines receive security status alongside all other credentials</li>
            <li>Pilots with current security clearances appear as "pre-cleared" on pathway cards</li>
          </ul>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">Pilot Verification Wallet — Verify Once, Apply Anywhere</h4>
          <ul className="text-sm text-slate-700 space-y-1 mb-4 ml-4 list-disc">
            <li><strong>Identity verification</strong> — government ID, biometric link</li>
            <li><strong>Employment history</strong> — previous airlines, flight schools, tenure verification</li>
            <li><strong>License validation</strong> — real-time CAA/FAA/EASA authority lookup</li>
            <li><strong>Medical certificate status</strong> — live feed from aviation medical examiners (Class 1/2/3)</li>
            <li><strong>Criminal background</strong> — country-specific: NBI, DBS, FBI, etc.</li>
            <li><strong>Right-to-work</strong> — visa, citizenship, work permit validation</li>
            <li><strong>ATO credentials</strong> — verified training records, simulator hours, completion certificates</li>
            <li><strong>Insurance background check</strong> (pilot-consent required) — aircraft incident history including training accidents, gear-up landings, runway excursions, hull loss, insurance claims, NTSB/AAIB/TSB reports</li>
          </ul>
          <p className="text-sm text-slate-700 mb-4">Service tiers: <strong>Standard</strong> (24–72 hour turnaround) · <strong>Expedited</strong> (4–24 hours for Recognition+ members) · <strong>Geographic transparency</strong> (estimated turnaround per country displayed before purchase)</p>

          <h5 className="text-base font-bold text-slate-800 mt-4 mb-2">Credential Expiry &amp; Renewal Tracking</h5>
          <p className="text-sm text-slate-700 leading-relaxed mb-2">Every verified credential in the pilot's wallet carries an <strong>expiry date</strong> — displayed live on their profile. A verification is not permanently valid. It reflects the state of the credential at the time it was issued, and the platform tracks whether that credential remains current. Pilots and operators both see the same status.</p>
          <p className="text-sm text-slate-700 leading-relaxed mb-2">For verification partners integrated into the platform, this creates a <strong>recurring, predictable renewal pipeline</strong> — not a one-time transaction. Every credential that expires is a re-verification opportunity. The categories that generate the highest renewal volume are:</p>
          <ul className="text-sm text-slate-700 space-y-1 mb-3 ml-4 list-disc">
            <li><strong>Medical certificates</strong> — Class 1 renews every <strong style={{color:'#dc2626'}}>12 months</strong> (<strong style={{color:'#dc2626'}}>6 months</strong> over 40). Class 2 every <strong style={{color:'#dc2626'}}>24 months</strong> (<strong style={{color:'#dc2626'}}>12 months</strong> over 40). Every active pilot on the platform renews on a fixed cycle — this is the highest-frequency recurring check in the wallet.</li>
            <li><strong>Criminal background checks</strong> — jurisdiction-dependent validity of <strong style={{color:'#dc2626'}}>12–24 months</strong>. Operators in regulated aviation markets (EU, UK, AU, PH) often require current checks within <strong style={{color:'#dc2626'}}>12 months</strong>. Re-verification is mandatory at each cycle.</li>
            <li><strong>Right-to-work and visa documents</strong> — tied directly to document expiry dates which vary per pilot. Live tracking against passport, visa, and work permit expiry dates generates continuous renewal demand as pilots move between operators and countries.</li>
            <li><strong>License revalidation</strong> — while license status is checked live against authority databases, type rating revalidations, instrument rating renewals, and foreign license validations have <strong style={{color:'#dc2626'}}>fixed renewal windows</strong> that trigger re-verification events.</li>
            <li><strong>Employment history updates</strong> — every time a pilot adds a new employer, the new record enters the verification queue. As pilots progress through their careers — across multiple operators — each transition generates a fresh verification request.</li>
            <li><strong>Insurance and incident history</strong> — operators may request updated incident checks <strong style={{color:'#dc2626'}}>annually</strong> on retained pilots. This is not a one-time check for senior command roles — it is reviewed at <strong style={{color:'#dc2626'}}>contract renewal</strong> and pathway resubmission.</li>
          </ul>
          <p className="text-sm text-slate-700 leading-relaxed mb-3">The platform sends <strong>automated renewal alerts</strong> to pilots ahead of each expiry window — <strong style={{color:'#dc2626'}}>90 days</strong>, <strong style={{color:'#dc2626'}}>60 days</strong>, and <strong style={{color:'#dc2626'}}>30 days</strong> prior. Pilots are directed to re-verify through the platform. Verification partners receive the renewal request through the same API integration used for initial checks. <strong>No separate pipeline. No manual handoff. The same infrastructure handles both.</strong></p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Credential</th>
                  <th className="text-left px-4 py-2 font-semibold">Typical Validity</th>
                  <th className="text-left px-4 py-2 font-semibold">Renewal Trigger</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { credential: 'Class 1 Medical Certificate', validity: '12 months (6 months if over 40)', renewal: 'Automated expiry alert 60 days prior. Profile badge downgraded to "Medical Renewal Required" if expired.' },
                  { credential: 'Class 2 Medical Certificate', validity: '24 months (12 months if over 40)', renewal: 'Same automated alert cycle. Pathway matching paused on roles requiring Class 1 if expired.' },
                  { credential: 'License Validation', validity: 'Live — checked against authority database', renewal: 'Real-time status. If license lapses, suspended, or revalidation overdue — profile flagged immediately.' },
                  { credential: 'Criminal Background Check', validity: '12–24 months (varies by jurisdiction)', renewal: 'Pilot notified ahead of expiry. Re-verification available at pilot or operator request.' },
                  { credential: 'Right-to-Work / Visa', validity: 'Per document expiry date', renewal: 'Live tracking against document expiry. Alert issued 90 days prior to document lapse.' },
                  { credential: 'ATO / Training Records', validity: 'Permanent once verified', renewal: 'No expiry — but new type ratings, simulator completions, and additional certifications can be added and verified at any time.' },
                  { credential: 'Employment History', validity: 'Verified as at date of check', renewal: 'Updated when pilot adds a new employer entry. New entry requires re-verification of that record.' },
                ] as { credential: string; validity: string; renewal: string }[]).map((row, i) => (
                  <tr key={row.credential} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-100"><strong style={{color:'#dc2626'}}>{row.credential}</strong></td>
                    <td className="px-4 py-2 border-b border-slate-700"><strong style={{color:'#dc2626'}}>{row.validity}</strong></td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.renewal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-slate-600 mb-6">An expired credential does not delete the pilot's wallet — it downgrades the relevant badge and notifies both the pilot and any operators who have that pilot on an active shortlist. <strong>Operators always see current, accurate credential status — not a snapshot frozen at hire date.</strong></p>

          <p className="text-sm text-slate-700 mb-6">Pre-cleared pilots receive a <strong>"Verification Preferred" badge</strong> — visible on pathway cards and prioritised in candidate lists. Airlines receive a shortlist of pre-verified, pre-cleared professionals. Zero surprise rejections at the final offer stage.</p>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">For Airlines — Integrated Verification Infrastructure</h4>

          <h5 className="text-base font-bold text-slate-800 mt-4 mb-2">API Integration</h5>
          <ul className="text-sm text-slate-700 space-y-1 mb-4 ml-4 list-disc">
            <li>Real-time verification triggers via REST API — instant check initiation when a pilot submits interest</li>
            <li>Webhook notifications — live updates on check completion pushed directly to airline systems</li>
            <li>99.9% uptime SLA — enterprise-grade reliability</li>
            <li>Direct ATS integration — Greenhouse, Workday, Lever and other major platforms supported</li>
          </ul>

          <h5 className="text-base font-bold text-slate-800 mt-4 mb-2">Configurable Check Depth — Per Role</h5>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Level</th>
                  <th className="text-left px-4 py-2 font-semibold">Includes</th>
                  <th className="text-left px-4 py-2 font-semibold">Typical Role</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { level: 'Standard', includes: 'ID, employment history, license validation, criminal background (basic)', role: 'Cadets, low-time First Officers' },
                  { level: 'Enhanced', includes: 'Standard + financial checks, reference validation, social media screening', role: 'First Officers, cargo pilots' },
                  { level: 'Full', includes: 'Enhanced + insurance verification, medical deep-dive, simulator record checks, incident history', role: 'Captains, senior command roles' },
                ].map((row, i) => (
                  <tr key={row.level} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">{row.level}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.includes}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h5 className="text-base font-bold text-slate-800 mt-4 mb-2">Fraud Prevention</h5>
          <ul className="text-sm text-slate-700 space-y-1 mb-6 ml-4 list-disc">
            <li>Near-zero identity fraud via biometric-linked verification</li>
            <li>Tamper-proof digital records eliminate forged certificates and falsified employment histories</li>
            <li>Cross-referenced authority lookups catch license discrepancies in real time</li>
            <li>Blockchain audit trails — immutable, verifiable verification history across every check ever completed</li>
          </ul>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">Insurance Risk Profiles — Consent-Based Underwriting Data</h4>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Risk Profile</th>
                  <th className="text-left px-4 py-2 font-semibold">Definition</th>
                  <th className="text-left px-4 py-2 font-semibold">Outcome</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { profile: 'Low Risk', def: 'Clean wallet — no incidents, current medical, stable employment, no claims', outcome: 'Preferred rates available from underwriters' },
                  { profile: 'Moderate Risk', def: 'Minor incidents, employment gaps with explanation, older pilots with enhanced medical monitoring', outcome: 'Standard rates with conditions' },
                  { profile: 'High Risk', def: 'Multiple incidents, license suspensions, medical Special Issuances, hull loss involvement', outcome: 'Premium rates or coverage exclusions' },
                ].map((row, i) => (
                  <tr key={row.profile} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">{row.profile}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.def}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.outcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h5 className="text-base font-bold text-slate-800 mt-4 mb-2">Risk Scoring Data Points</h5>
          <ul className="text-sm text-slate-700 space-y-1 mb-4 ml-4 list-disc">
            <li><strong>Flight hours vs. incident ratio</strong> — measures safety record over career span</li>
            <li><strong>Type rating complexity</strong> — complex aircraft (A380, B747) vs. single-aisle risk profiles</li>
            <li><strong>Medical certificate history</strong> — Class 1/2/3 status, renewals, Special Issuances</li>
            <li><strong>Employment stability</strong> — average tenure per employer; frequent moves = higher risk</li>
            <li><strong>Geographic risk exposure</strong> — high-risk route assignments (mountainous, weather-challenged)</li>
            <li><strong>Aircraft types operated</strong> — turboprop vs. jet vs. widebody complexity tiers</li>
          </ul>

          <h5 className="text-base font-bold text-slate-800 mt-4 mb-2">Consent-Based Access</h5>
          <ul className="text-sm text-slate-700 space-y-1 mb-4 ml-4 list-disc">
            <li>Pilots choose to share their verification wallet with insurance partners — opt-in only</li>
            <li>Underwriters receive tamper-proof risk profiles with no manual verification needed</li>
            <li>Real-time updates — medical status, license changes, new incidents pushed live</li>
            <li>Underwriting time: <strong>weeks → minutes</strong></li>
          </ul>
          <p className="text-sm text-slate-700 mb-6">Airlines publish their insurance risk profile requirements on pathway backend. Pilots are notified before applying: <em>"This pathway requires a Low Risk insurance profile — check your verification wallet."</em> Pilot consent required for all insurance data access.</p>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">Platform Requirements for Verification Partners</h4>
          <ul className="text-sm text-slate-700 space-y-1 mb-6 ml-4 list-disc">
            <li><strong>API Infrastructure</strong> — REST API with webhook support, HMAC signature authentication</li>
            <li><strong>Global Coverage</strong> — 150+ countries, with transparency on per-country turnaround times</li>
            <li><strong>Philippines Capability</strong> — PRC license verification, NBI clearance, physical address verification</li>
            <li><strong>ATS Integration</strong> — API keys for major platforms (Greenhouse, Workday, Lever)</li>
            <li><strong>Data Standards</strong> — standardised JSON schema for all check types</li>
            <li><strong>SLA Commitments</strong> — 99.9% API uptime, 99.5% webhook delivery success</li>
            <li><strong>Turnaround Times</strong> — Standard &lt;72 hours, expedited &lt;24 hours where possible</li>
            <li><strong>Compliance</strong> — GDPR, PDPA, aviation authority data handling standards</li>
          </ul>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">Commercial Model — Verification Tiers</h4>
          <p className="text-slate-600 text-sm mb-4">Verification on the platform operates across three distinct tiers — each triggered by a different party, for a different purpose. Verification partners are not consumers of this model. They are the infrastructure behind it — integrated as partners, not vendors.</p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Tier</th>
                  <th className="text-left px-4 py-2 font-semibold">Triggered By</th>
                  <th className="text-left px-4 py-2 font-semibold">Price</th>
                  <th className="text-left px-4 py-2 font-semibold">What It Covers</th>
                </tr>
              </thead>
              <tbody>
                {([
                  {
                    tier: 'Basic — Unverified Profile',
                    by: 'Pilot (self-declared)',
                    price: 'Free',
                    includes: <>Pilot submits license, logbook, and employment claims. <strong style={{color:'#dc2626'}}>No verification seal.</strong> Operators see a signal of match — <strong style={{color:'#dc2626'}}>credibility is visible but unconfirmed.</strong> Pilot is presented with an option to verify through <strong>Recognition+</strong> or a verified partner to unlock the credential wallet and badge.</>,
                  },
                  {
                    tier: 'Recognition+ — Pilot-Opted Verification',
                    by: 'Pilot (self-initiated)',
                    price: 'Included in Recognition+',
                    includes: <>Pilot initiates formal verification of their own credentials <strong style={{color:'#dc2626'}}>before submitting interest to any pathway.</strong> Identity, license, medical, employment history, and ATO records verified against primary sources. Stored in a <strong style={{color:'#dc2626'}}>tamper-proof digital wallet</strong> — portable, pilot-owned, shareable with any operator via single consent. <strong style={{color:'#dc2626'}}>"Verification Preferred" badge</strong> applied to profile. Verify once. Apply anywhere.</>,
                  },
                  {
                    tier: 'Operator Deep Check — Pathway Verification',
                    by: 'Airline / Operator (optional)',
                    price: '$12/check',
                    includes: <>Operator selects specific candidates from their shortlist and requests <strong style={{color:'#dc2626'}}>deeper, operator-specific checks</strong> not covered by the pilot's self-verification. Scope is configurable per role: <strong style={{color:'#dc2626'}}>criminal background</strong> (NBI, DBS, FBI), <strong style={{color:'#dc2626'}}>right-to-work validation</strong>, aviation security vetting, incident and insurance history, conduct records. <strong style={{color:'#dc2626'}}>Pilot must consent.</strong> Operator pays per check. Results optionally returned to pilot's wallet. <strong style={{color:'#dc2626'}}>Data Contribution Credit:</strong> Operators who contribute a verified Deep Check result back to the pilot's wallet receive a <strong>$2.00 credit</strong> against their next check fee — incentivising the creation of a shared, industry-wide trust commons where every check strengthens the global pilot data set.</>,
                  },
                ] as { tier: string; by: string; price: string; includes: React.ReactNode }[]).map((row, i) => (
                  <tr key={row.tier} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">{row.tier}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-400 text-xs">{row.by}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-red-400 font-semibold whitespace-nowrap">{row.price}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.includes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mt-8 mb-3">Transparency — Pilots Are Always Informed</h4>
          <p className="text-slate-700 leading-relaxed mb-4">When an operator initiates a deep background check on a pilot, <strong>the pilot is notified immediately.</strong> This is not optional. Transparency is a core principle of the platform — pilots are never checked without their knowledge. Consent is already captured at the point the pilot submits interest to a pathway.</p>
          <p className="text-slate-700 leading-relaxed mb-4">In the pilot's account dashboard, a dedicated <strong>"Verification Activity"</strong> section displays a live log of any operator-initiated checks currently in progress or completed. The notification includes:</p>
          <ul className="space-y-2 mb-5">
            {([
              { t: 'Operator name', d: 'The specific airline or cargo operator who initiated the check — displayed by name. The pilot knows exactly who is looking deeper into their profile.' },
              { t: 'Check scope', d: 'The type of check requested — criminal background, right-to-work, security vetting, incident history — displayed clearly so the pilot understands what is being reviewed.' },
              { t: 'Status', d: 'Live status of the check: Initiated / In Progress / Completed. The pilot is not left waiting in a black hole — they see the same timeline the operator sees.' },
              { t: 'Consent already captured', d: 'By submitting interest to a pathway, the pilot has already consented to the operator conducting due diligence as part of their review process. No re-consent is required. The notification is informational — the pilot is kept informed, not asked again.' },
              { t: 'Result contribution (optional)', d: 'Once complete, the operator may request to contribute the verified result back to the pilot\'s credential wallet. The pilot chooses whether to accept — if accepted, the check strengthens their portable profile for all future applications.' },
            ] as { t: string; d: string }[]).map((item) => (
              <li key={item.t} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong style={{color:'#dc2626'}}>{item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>
          <div className="my-4 px-5 py-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
            <p className="text-slate-800 text-sm leading-relaxed"><strong>Why this matters:</strong> In traditional hiring, pilots are background checked without notification — they find out only if something fails at the offer stage. This platform inverts that. A pilot who sees <em>"[Operator Name] has initiated a deep verification on your profile"</em> knows they are on a shortlist. It is a positive signal — transparent, timely, and respectful of the pilot's ownership over their own data.</p>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mt-8 mb-3">A. Continuous Monitoring — From Snapshot to Active Listener</h4>
          <p className="text-slate-700 text-sm leading-relaxed mb-3">Traditional background checks are a snapshot — accurate on the day they are printed, potentially wrong by the following week. The platform advances this to <strong>Active Monitoring</strong>: with pilot consent, the platform maintains a continuous listener on CAA, FAA, and EASA license databases. If a pilot's licence is suspended, or a Class 1 medical is revoked on a Tuesday, <strong style={{color:'#dc2626'}}>the "Verified" badge on the platform is flagged by Tuesday afternoon.</strong></p>
          <p className="text-slate-700 text-sm leading-relaxed mb-3">This provides immediate risk mitigation that no manual check, no PDF certificate, and no periodic re-screening cycle can match. Airlines operating on this platform are not relying on a check that was accurate 90 days ago. They are receiving live credential status on every pilot in their active pipeline — continuously, automatically, and without additional cost per update.</p>
          <div className="bg-slate-50 border border-slate-200 rounded px-5 py-4 mb-6 text-sm text-slate-700">
            <p className="font-semibold text-slate-800 mb-2">Active Monitoring — Trigger Events</p>
            <ul className="space-y-1 list-disc ml-4">
              <li><strong>Licence suspension or lapse</strong> — profile badge downgraded within hours; operators with that pilot on active shortlist notified immediately</li>
              <li><strong>Medical certificate revocation</strong> — Class 1/2 status change pushed from AME API; pathway matching paused on roles requiring current medical</li>
              <li><strong>Right-to-work document expiry</strong> — passport, visa, or work permit lapse triggers automated wallet flag and pilot notification</li>
              <li><strong>New incident record</strong> — if an authority database registers a new incident involving the pilot, the insurance risk profile updates in real time</li>
              <li><strong>Criminal record addition</strong> — jurisdiction-dependent monitoring where authority API permits continuous lookup rather than point-in-time check</li>
            </ul>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mt-8 mb-3">B. The Verification Wallet as a Premium Insurance Asset</h4>
          <p className="text-slate-700 text-sm leading-relaxed mb-3">The pilot verification wallet is not only a hiring credential — it is a <strong>personal financial asset</strong>. A pilot holding a <strong>High-Integrity Wallet</strong> — verified clean incident record, current Class 1 medical, EBT competency scores on file, and stable employment history — presents a quantifiably lower risk profile to personal insurance underwriters than an unverified pilot of equivalent hours.</p>
          <p className="text-slate-700 text-sm leading-relaxed mb-3"><strong style={{color:'#dc2626'}}>Pilots with a High-Integrity Wallet can use their verified profile to negotiate lower personal loss-of-licence insurance premiums.</strong> Loss-of-licence insurance — which protects a pilot's income if they lose their medical — is one of the most significant recurring financial obligations in a pilot's career. A verified competency profile gives underwriters the granular data required to price risk more accurately and offer preferential rates to demonstrably low-risk candidates.</p>
          <p className="text-slate-700 text-sm leading-relaxed mb-4">This creates a direct financial ROI for the pilot in keeping their wallet fully verified and continuously updated — not as a hiring requirement, but as a personal financial strategy. <strong>The more complete the wallet, the lower the premium. The platform does not just help pilots get hired. It helps them save money for the duration of their career.</strong></p>

          <h4 className="text-lg font-bold text-slate-800 mt-8 mb-3">C. Self-Sovereign Identity (SSI) &amp; W3C Verifiable Credentials</h4>
          <p className="text-slate-700 text-sm leading-relaxed mb-3">To ensure the tamper-proof claim is technically unassailable, the platform anchors its credential architecture in the <strong>W3C Verifiable Credentials (VC) standard</strong> — the globally recognised framework for decentralised, cryptographically verifiable digital identity.</p>
          <p className="text-slate-700 text-sm leading-relaxed mb-3">Under this model, the platform does not store a PDF of a licence certificate. <strong>The issuing authority — the CAA, the AME, the ATO — cryptographically signs a digital credential token.</strong> When a pilot shares that credential with Etihad, Archer, or any platform operator, the receiving system verifies the issuer's cryptographic signature — not the visual appearance of an image file. This eliminates the possibility of document fraud entirely. A Photoshopped licence is not a signed token. It fails verification at the cryptographic layer before any human reviews it.</p>
          <div className="bg-slate-50 border border-slate-200 rounded px-5 py-4 mb-6 text-sm text-slate-700">
            <p className="font-semibold text-slate-800 mb-2">How W3C Verifiable Credentials Work in the Pilot Wallet</p>
            <ul className="space-y-1 list-disc ml-4">
              <li><strong>Issuer</strong> — the authority that signs the credential: CAA issues the licence token; the AME issues the medical token; the ATO issues the training completion token</li>
              <li><strong>Holder</strong> — the pilot holds the signed credential token in their wallet. They control who sees it and when</li>
              <li><strong>Verifier</strong> — the airline or operator receiving the credential verifies the issuer's digital signature without contacting the issuing authority directly. The check is instant, automated, and cryptographically certain</li>
              <li><strong>Self-Sovereign</strong> — the pilot owns the credential. It cannot be revoked by the platform, altered by the operator, or intercepted in transit. The data belongs to the pilot, and they decide who accesses it</li>
            </ul>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mt-8 mb-3">Ecosystem Connectivity — Pillar 11 Handshakes</h4>
          <p className="text-slate-700 text-sm leading-relaxed mb-4">Pillar 11 is the data clearinghouse for the entire 25-pillar ecosystem. The verification wallet does not operate in isolation — it is the integration node that connects every credentialled interaction across every sector on the platform.</p>
          <ul className="space-y-3 mb-6">
            {([
              { t: 'Pillar 13 — Aeromedical', d: 'The AME does not issue a paper certificate. They push a signed Digital Medical Token directly into the pilot\'s Pillar 11 wallet via API. Medical status is live, cryptographically verified, and continuously monitored — not a scanned PDF submitted by the pilot.' },
              { t: 'Pillar 08 — Banking & Training Finance', d: 'When a pilot applies for a training loan through Pillar 08, the bank pulls the verified ATO transcript directly from the pilot\'s Pillar 11 wallet to confirm training progression before releasing funds. Loan disbursement is linked to verified milestone completion — not self-declaration.' },
              { t: 'Pillar 15 — Manufacturers & OEMs', d: 'Aircraft manufacturers and avionics OEMs push Software Familiarisation credentials directly into the pilot\'s wallet when they complete a new avionics course or type-specific systems module. The pilot\'s competency map updates automatically — without re-entering the platform.' },
              { t: 'Pillar 09 — Aviation Insurance', d: 'Pillar 11 provides insurers with the Anonymised Competency Benchmark data set required to move from hours-based to competency-based risk pricing. The wallet is the mechanism through which the platform becomes the actuarial data infrastructure for AAM underwriting.' },
              { t: 'Pillar 17 — Universities & ATOs', d: 'Institutions that integrate W3C credential issuance into their graduation process push AAM-Ready tokens directly into graduate wallets. The university becomes a verified node in the credential chain — not a paper-issuing institution external to the platform.' },
            ] as { t: string; d: string }[]).map((item) => (
              <li key={item.t} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong style={{color:'#dc2626'}}>{item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">Partnership Value Proposition</h4>
          <p className="text-slate-700 leading-relaxed mb-3">Together, PilotRecognition and its verification partners build the <strong>Global Clearinghouse for Verified Pilots</strong> — the standard infrastructure layer the aviation industry has never had. The platform is open to all pilots — free and verified alike. Verification is not a gate. It is an <strong>upgrade path</strong> — pilots who choose to verify their credentials gain visibility, credibility, and priority access that unverified profiles cannot match. Verification partners become the <strong>trusted credential engine</strong> behind that upgrade — the infrastructure that makes a pilot's profile worth more to every operator who sees it.</p>
          <p className="text-slate-700 leading-relaxed mb-4">Pilots on this platform are choosing to be seen. <strong>They are consenting to verification checks across all relevant areas of their professional record — identity, license, medical, employment history, and operator-requested due diligence — in exchange for recognition in the industry.</strong> Not recognition as a courtesy. Recognition as a verified, credible, career-ready professional that operators can trust and act on. The verification exchange is mutual: pilots give transparency, and the platform returns standing.</p>

          <h5 className="text-base font-bold text-slate-800 mt-6 mb-2">The Multi-Node Verification Model — Market Neutrality by Design</h5>
          <p className="text-slate-700 text-sm leading-relaxed mb-3">The platform does not rely on a single global verification provider. <strong>It operates as a Verification Orchestrator</strong> — a standardised interface that connects best-of-region partners, each holding source-of-truth depth with the aviation authorities in their specific jurisdiction. No single provider is global. The platform is. Regional partners are the nodes. PilotRecognition is the network.</p>
          <p className="text-slate-700 text-sm leading-relaxed mb-4">This architecture is not a compromise — it is a structural advantage. Each regional node operates within its jurisdictional lane, processing only the checks its authority relationships are built for. The platform aggregates the results into a single, standardised credential wallet. <strong>The regional providers change. The Aviation Taxonomy, the Recognition Score, and the Verified Badge are identical everywhere.</strong></p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Region</th>
                  <th className="text-left px-4 py-2 font-semibold">Verification Node</th>
                  <th className="text-left px-4 py-2 font-semibold">Primary Authorities</th>
                  <th className="text-left px-4 py-2 font-semibold">Data Residency</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { region: 'Europe', partner: 'Regional Partner A', auth: 'EASA, UK CAA, DBS — EU/EEA right-to-work, GDPR-compliant identity and employment verification', residency: 'EU/EEA servers — GDPR Article 44 compliant. No cross-border data transfer required.' },
                  { region: 'USA / Americas', partner: 'Regional Partner B', auth: 'FAA license database, FBI criminal checks, TSA aviation security vetting, NTSB incident records, Transport Canada', residency: 'US-domiciled infrastructure. FAA back-office relationships and federal agency coordination in jurisdiction.' },
                  { region: 'Asia-Pacific', partner: 'Regional Partner C', auth: 'CAAP (Philippines), CAAS (Singapore), CASA (Australia), NBI clearance, local police certificate coordination', residency: 'In-region data handling. High-volume pilot supply market expertise — NBI, CAAP, and regional CAA authority depth.' },
                  { region: 'Africa / Middle East', partner: 'Regional Partner D', auth: 'GCAA (UAE), PACA (Saudi Arabia), SACAA (South Africa), regional CAA networks', residency: 'In-region. Covers the primary Gulf operator hiring market and African pilot supply corridor.' },
                ] as { region: string; partner: string; auth: string; residency: string }[]).map((row, i) => (
                  <tr key={row.region} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100 whitespace-nowrap">{row.region}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-red-400 font-semibold whitespace-nowrap">{row.partner}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.auth}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-400 text-xs">{row.residency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h5 className="text-base font-bold text-slate-800 mt-6 mb-2">The Standardised Rosetta Stone — Universal Currency for Pilot Trust</h5>
          <p className="text-slate-700 text-sm leading-relaxed mb-4">While the verification providers differ by region, the output is always identical. A pilot verified in Manila and a pilot verified in London both appear on the platform with the same <strong>Recognition Score</strong>, the same <strong>Verified Badge</strong>, and credentials stored in the same W3C Verifiable Credential format. The regional providers are the mints. <strong>The platform is the currency.</strong> An operator in Dubai evaluating a Filipino pilot and a British pilot is reading from the same trust standard — regardless of which node produced each credential. This is the "Universal API" proposition: each regional partner builds one integration to PilotRecognition and gains access to every airline in the ecosystem — but processes only the checks within its zone of jurisdictional strength.</p>

          <h5 className="text-base font-bold text-slate-800 mt-6 mb-2">Data Residency Sovereignty — Natively Compliant by Architecture</h5>
          <p className="text-slate-700 text-sm leading-relaxed mb-4">Each regional node retains data within its own jurisdiction until the pilot actively chooses to share a credential with an operator. There is no requirement to transfer Philippine NBI data to European servers, or US FBI records to an Asian database. <strong>The platform does not hold the raw data — it holds the signed credential token.</strong> The token was signed in-region, by an in-region authority, processed by an in-region provider. GDPR, PDPA, and equivalent local data protection frameworks are satisfied at the architectural level — not through legal workarounds applied after the fact.</p>

          <h5 className="text-base font-bold text-slate-800 mt-6 mb-2">Commercial Fair Play — What This Means for Each Regional Partner</h5>
          <div className="bg-slate-50 border border-slate-200 rounded px-5 py-4 mb-4 text-sm text-slate-700">
            <ul className="space-y-2 list-disc ml-4">
              <li><strong>No channel conflict</strong> — each partner knows exactly which checks are theirs. The European node processes every pilot in the EASA/EU sphere. There is no ambiguity, no overlap, no competition with the other nodes.</li>
              <li><strong>Single integration, full ecosystem access</strong> — a regional partner builds one API integration to PilotRecognition and immediately gains distribution across every airline, operator, and emerging sector employer on the platform — globally.</li>
              <li><strong>Cross-node triggers without cross-node liability</strong> — if a Filipino pilot applies to a German airline, the Asia-Pacific node processes their origin history, and the European node handles right-to-work and local security vetting. Both nodes are triggered. Neither node is responsible for the other's jurisdiction. The platform orchestrates the handoff.</li>
              <li><strong>Market neutrality protects the platform</strong> — PilotRecognition does not favour any single provider. Operators receive the same credential quality regardless of the pilot's origin. The platform's integrity is not contingent on any one partner's performance.</li>
            </ul>
          </div>

          <h5 className="text-base font-bold text-slate-800 mt-6 mb-2">The Pilot Experience — Seamless Across Every Node</h5>
          <div className="bg-slate-50 border border-slate-200 rounded px-5 py-4 mb-6 text-sm text-slate-700">
            <p className="font-semibold text-slate-800 mb-3">Example: Filipino pilot applying to a German airline</p>
            <ol className="space-y-2 list-decimal ml-4">
              <li>Pilot creates a profile — platform detects Philippines origin and triggers <strong>Asia-Pacific Node (Partner C)</strong> for CAAP licence validation and NBI clearance</li>
              <li>Pilot submits interest to a Lufthansa Cargo pathway — platform triggers <strong>European Node (Node A)</strong> for EU right-to-work validation and EASA licence recognition check</li>
              <li>Both credential tokens are signed by their respective in-region providers and written to the pilot's wallet</li>
              <li>Lufthansa's HR system receives a single, unified credential wallet — two verified signatures, one standardised profile, zero manual document chasing</li>
              <li>The pilot sees one wallet. The operator sees one profile. <strong>The complexity is invisible. The trust is complete.</strong></li>
            </ol>
          </div>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-8 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>By being Market Neutral, the platform is structurally un-killable.</strong> If one regional node experiences a technical outage or a regulatory issue in a specific country, the remaining three nodes and the rest of the 25-pillar ecosystem continue operating without interruption. The platform has built a <strong style={{color:'#f87171'}}>decentralised trust network</strong> — resilient, regionally sovereign, and commercially fair to every participant in it.</p>
          </div>

          <h5 className="text-base font-bold text-slate-800 mt-8 mb-2">The Smart Routing Engine — Weighted Routing by Licensing Authority</h5>
          <p className="text-slate-700 text-sm leading-relaxed mb-4">When a pilot enrols in Recognition+, they are not selecting a verification company. They are purchasing a <strong>Verified Status</strong>. The platform acts as the Traffic Controller — routing each check and its associated fee automatically using a <strong>Weighted Routing Model</strong> that reads two data points at signup: the pilot's highest-tier active licence authority, and their 5-year residency and employment history trail. There is no human selection. There is no conflict. <strong>The pilot's own career history makes the routing decision.</strong></p>

          <div className="bg-slate-50 border border-slate-200 rounded px-5 py-4 mb-6 text-sm text-slate-700">
            <p className="font-semibold text-slate-800 mb-3">Tier 1 — Primary Routing: The Licensing Authority (Lead Node)</p>
            <p className="mb-3">The platform identifies the pilot's highest-tier active licence — FAA, EASA, CAAP, GCAA, etc. The issuing authority is the <strong style={{color:'#dc2626'}}>Anchor Key</strong>. The Lead Node is automatically assigned to the regional partner with direct API access to that authority. The licence is the pilot's primary professional identity — it is the most critical safety credential in the wallet, and it determines who takes the lead.</p>
            <ul className="space-y-1 list-disc ml-4 mb-0">
              <li>EASA or UK CAA licence → <strong>European Node (Node A)</strong> assigned as Lead. Handles identity verification and primary authority lookup. Target turnaround: <strong style={{color:'#dc2626'}}>4–24 hours</strong> via direct CAA API.</li>
              <li>FAA licence → <strong>USA Node (Node B)</strong> assigned as Lead. FAA database lookup, FBI check eligibility, NTSB record access.</li>
              <li>CAAP, CAAS, or CASA licence → <strong>Asia-Pacific Node (Node C)</strong> as Lead. NBI, CAAP, and regional authority depth.</li>
              <li>GCAA, PACA, or SACAA licence → <strong>Africa/Middle East Node (Node D)</strong> as Lead. Gulf operator vetting and African authority coordination.</li>
            </ul>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded px-5 py-4 mb-6 text-sm text-slate-700">
            <p className="font-semibold text-slate-800 mb-3">Tier 2 — Secondary Routing: The History Trail (Support Nodes)</p>
            <p className="mb-3">Aviation background checks require a 5-year residency and employment history. If that history spans multiple regions, the platform automatically triggers <strong>Sub-Tasks</strong> — parallel verifications routed to the relevant regional node for each jurisdiction in the pilot's trail. The Lead Node is never asked to verify records outside its authority relationships. Each node receives only the scope it is built for.</p>
            <div className="bg-white border border-slate-200 rounded px-4 py-3 mb-3">
              <p className="font-semibold text-slate-700 mb-1">Example scenario</p>
              <p className="text-slate-600">Pilot holds a UK CAA licence (Lead Node: European Node A). Has lived and worked in Manila for the last 3 years at Cebu Pacific.</p>
              <p className="text-slate-600 mt-1"><strong>Workflow:</strong> European Node handles UK CAA licence validation and identity. Platform automatically triggers a sub-task to Asia-Pacific Node for NBI clearance and Cebu Pacific employment verification. Both nodes run in parallel. The Asia-Pacific Node receives a flat <strong>Sub-Task Fee</strong> from the Global Verification Pool — paid automatically upon completion.</p>
            </div>
            <ul className="space-y-1 list-disc ml-4">
              <li>Sub-tasks are triggered per country/employer outside the Lead Node's region</li>
              <li>Sub-Task Fee is flat and pre-agreed per jurisdiction — no negotiation per pilot</li>
              <li>All sub-task results feed into the same credential wallet alongside the Lead Node's output</li>
              <li>The pilot sees a single unified wallet. The routing complexity is entirely invisible to them</li>
            </ul>
          </div>

          <h5 className="text-base font-bold text-slate-800 mt-6 mb-2">The Verification Bounty — Pricing Architecture</h5>
          <p className="text-slate-700 text-sm leading-relaxed mb-3">The pilot pays a flat annual Recognition+ fee. The platform treats this as a <strong>Wholesale Clearinghouse</strong> — absorbing the complexity of multi-regional routing, parallel sub-task payment, and variable jurisdiction costs within its subscription margin. Cost is predictable for the pilot. Revenue allocation is automatic for every partner involved.</p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Bounty Component</th>
                  <th className="text-left px-4 py-2 font-semibold">Logic</th>
                  <th className="text-left px-4 py-2 font-semibold">Who Gets Paid</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { component: 'Lead Node Credit', logic: 'Initial identity verification + primary licence authority lookup. The most critical credential in the wallet — highest wholesale allocation from the Bounty.', who: 'The regional partner tied to the pilot\'s highest-tier licence issuing authority. Assigned automatically by the routing engine.' },
                  { component: 'History Sub-Tasks', logic: 'Per-country, per-employer checks for any residency or employment outside the Lead Node\'s region. Flat pre-agreed Sub-Task Fee per jurisdiction, paid from Global Verification Pool on task completion.', who: 'The regional partner(s) tied to the pilot\'s residency history — one sub-task payment per triggered node, per jurisdiction.' },
                  { component: 'Continuous Monitoring', logic: 'Monthly licence status pulse check against the issuing authority\'s live database. Flags suspension, lapse, or revocation events in near real-time.', who: 'Shared between the platform (infrastructure) and the Lead Node (authority API relationship). Split pre-agreed at partner onboarding.' },
                  { component: 'Operator Deep Check (Layer 2)', logic: 'Operator-initiated. Scope-configurable per role. Pilot must consent. $2 platform API convenience fee retained per check.', who: 'The regional node best positioned for the check type requested. $10 wholesale per check, operator pays $12.' },
                ] as { component: string; logic: string; who: string }[]).map((row, i) => (
                  <tr key={row.component} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-red-400 whitespace-nowrap">{row.component}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300 text-xs">{row.logic}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-400 text-xs">{row.who}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h5 className="text-base font-bold text-slate-800 mt-6 mb-2">Node Sovereignty — Eliminating the "Who Gets the Pilot?" Conflict</h5>
          <p className="text-slate-700 text-sm leading-relaxed mb-3">A regional partner does not compete for pilots. They fulfil orders. The platform is positioned as a <strong>Verification Clearinghouse</strong> — the partner is not acquiring a customer, they are processing a task assigned to them by the routing engine based on jurisdictional authority. The conflict of interest is eliminated structurally, not contractually.</p>
          <p className="text-slate-700 text-sm leading-relaxed mb-4">When a pilot moves from the UK to the US and obtains an FAA licence, their EASA licence renewal is still credited to the European node. Their FAA validation is credited to the US node. <strong>Both partners earn from the pilot's career progression — without overlap, without dispute, and without platform involvement in the split.</strong> The routing engine handles it automatically at every stage of the pilot's career.</p>

          <h5 className="text-base font-bold text-slate-800 mt-6 mb-2">Overflow Protection — Performance-Based Routing</h5>
          <p className="text-slate-700 text-sm leading-relaxed mb-4">Regional partners are not granted permanent monopoly status. Lead Node designation is conditional on maintaining the platform's SLA standards. If a regional node's turnaround time drops below threshold — for example, a check that should complete in 3 days taking 10 — the platform automatically routes new tasks to a secondary provider within that region until performance recovers. <strong>Partners are incentivised to maintain speed and accuracy. The pilot's experience is never degraded by a single node's operational failure.</strong> This keeps the network competitive, self-correcting, and always performing at standard.</p>

          <h5 className="text-base font-bold text-slate-800 mt-6 mb-2">Pilot Dashboard Transparency — The Global Verification Dream Team</h5>
          <p className="text-slate-700 text-sm leading-relaxed mb-3">Pilots see exactly who is verifying each part of their profile. The Recognition+ dashboard displays a live verification activity feed — broken down by node, by credential type, and by status. Rather than obscuring the multi-provider architecture, the platform surfaces it as a <strong>feature</strong>: the pilot is receiving best-in-region expertise for every part of their global career record.</p>
          <div className="bg-slate-50 border border-slate-200 rounded px-5 py-4 mb-6 text-sm text-slate-700">
            <p className="font-semibold text-slate-800 mb-2">Example — Pilot dashboard verification activity</p>
            <ul className="space-y-1 list-disc ml-4">
              <li><strong>EASA Licence &amp; Identity</strong> — being verified by <em>European Node (Node A)</em> · In Progress</li>
              <li><strong>FAA Employment History (2018–2023)</strong> — being verified by <em>USA Node (Node B)</em> · Completed ✓</li>
              <li><strong>NBI Clearance (Philippines)</strong> — being verified by <em>Asia-Pacific Node (Node C)</em> · Awaiting authority response</li>
            </ul>
            <p className="mt-3 text-slate-600">The pilot is not confused by multiple providers. They understand they are receiving <strong>local expertise for every jurisdiction in their career</strong> — coordinated by a single platform, displayed in a single dashboard, stored in a single wallet.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded px-5 py-4 mb-6 text-sm text-slate-700">
            <p className="font-semibold text-slate-800 mb-2">Summary of Value for Regional Partners</p>
            <ul className="space-y-1 list-disc ml-4">
              <li><strong>Guaranteed volume</strong> — partners do not market to pilots. The platform sends them ready-to-verify files automatically from the subscription pool</li>
              <li><strong>No sales friction</strong> — payment is automatic upon task completion, drawn from the Global Verification Pool. No invoicing cycle, no debtor management</li>
              <li><strong>Specialisation without distraction</strong> — partners focus exclusively on the authorities they know best, reducing their operational cost and error rate</li>
              <li><strong>Performance incentive</strong> — Lead Node status is maintained through SLA compliance. Partners who perform retain their jurisdiction. Partners who underperform are temporarily routed around until recovery</li>
            </ul>
          </div>

          <ul className="text-sm text-slate-700 space-y-1 mb-6 ml-4 list-disc">
            <li>10–15% revenue share on verification fees — passive income without operational overhead</li>
            <li>Volume multiplier: one verified pilot applies to 5+ airlines = 5x check volume per user</li>
            <li>Year 1: 5,000 pilots verified — market development focus</li>
            <li>Year 2: 13,500 checks at tiered pricing — $255K revenue potential</li>
            <li>Year 3: 36,000 checks at volume pricing — $474K revenue potential</li>
          </ul>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">Operational Outcomes</h4>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Metric</th>
                  <th className="text-left px-4 py-2 font-semibold text-red-400">Before</th>
                  <th className="text-left px-4 py-2 font-semibold" style={{color:'#34d399'}}>After</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { metric: 'Verification turnaround', before: '14–30 days', after: '24–72 hours (standard) · 4–24 hours (expedited)' },
                  { metric: 'Duplicate check costs', before: '5x per multi-application pilot', after: '1x per pilot (portable wallet)' },
                  { metric: 'Fraud detection', before: 'Manual, reactive', after: 'Automated, proactive, blockchain-backed' },
                  { metric: 'ATS integration', before: 'Manual PDF upload', after: 'Direct API flow' },
                  { metric: 'Pilot surprise rejections', before: 'Common at final offer stage', after: 'Eliminated via pre-verification' },
                  { metric: 'HR screening time', before: '8–12 hours per candidate', after: '1–2 hours per candidate' },
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

          <hr className="my-10 border-slate-300" />

          <p className="text-xs text-slate-400 text-center">Universal Commercial Framework · PilotRecognition.com · Official Release Document · Version 10.0-Expanded</p>

        </article>
      </div>
    </div>
  );
}
