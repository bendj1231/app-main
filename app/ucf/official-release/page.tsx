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
                {[
                  { tier: 'Basic', fee: '$500/mo', features: 'Post up to 3 pathway cards, 10 verified profile pulls/month, standard listing visibility' },
                  { tier: 'Professional', fee: '$1,000/mo', features: '50 profile pulls, full EBT score access, ATS integration feed, priority pathway visibility' },
                  { tier: 'Enterprise', fee: '$2,500/mo', features: 'Unlimited pulls, custom EBT development, dedicated account support, API access, bulk pathway management' },
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
          <p className="text-slate-600 text-sm mb-8"><strong>Success Fee:</strong> $500 per confirmed hire (waived for first 10 hires)</p>

          <hr className="my-10 border-slate-300" />

          <h2 className="text-2xl font-bold text-slate-900 mb-2 scroll-mt-24">Pillar 11: Background Checks &amp; Verification Providers</h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub C — Capital, Risk &amp; Compliance</p>

          <p className="text-slate-700 leading-relaxed mb-6">Aviation background screening operates on <strong>outdated manual processes</strong> that create friction for every party in the hiring chain. Verification is not a minor inconvenience — it is a structural bottleneck that delays hiring, duplicates cost, exposes operators to fraud risk, and leaves pilots in a compliance void with no portable credential infrastructure. Pillar 11 addresses this through a <strong>unified verification layer</strong> embedded directly into the platform — background checking as a service, not an external chore.</p>

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

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">Ecosystem Integration — How the Platform Connects Every Stakeholder</h4>

          <h5 className="font-bold text-slate-800 mt-4 mb-2">For Airline HR Departments</h5>
          <p className="text-slate-700 leading-relaxed mb-2 text-sm text-red-600">Current gap: Each airline maintains unique requirements in siloed systems. Verification providers apply generic templates, missing operator-specific policies. HR manually chases documents across CAA/FAA/local authorities. Turnaround: 14–30 days per candidate.</p>
          <ul className="text-sm text-slate-700 space-y-1 mb-4 ml-4 list-disc">
            <li>Airlines publish per-role verification requirement matrices on platform backend (Captains = full checks, Cadets = standard, First Officers = enhanced)</li>
            <li>Webhook notifications feed verification status directly into airline ATS (Greenhouse, Workday, Lever)</li>
            <li>Pre-cleared candidate pipeline: 80% faster screening time — pilots arrive pre-verified with digital wallet</li>
            <li>Zero-cost model: pilots pay for verification, airlines access pre-verified candidates at no cost</li>
            <li>GDPR/PDPA compliant data handling across all jurisdictions</li>
          </ul>

          <h5 className="font-bold text-slate-800 mt-4 mb-2">For Aviation Medical Examiners (AMEs)</h5>
          <p className="text-slate-700 leading-relaxed mb-2 text-sm text-red-600">Current gap: Medical status verification requires manual contact with individual AMEs. Background check companies cannot access Class 1/2/3 status, Special Issuance conditions, or renewal windows.</p>
          <ul className="text-sm text-slate-700 space-y-1 mb-4 ml-4 list-disc">
            <li>AMEs provide live Class 1/2/3 validation, Special Issuance tracking, and renewal window data via API</li>
            <li>Medical certificates flow directly into pilot-controlled digital wallets with immutable audit trail</li>
            <li>Automated renewal window monitoring enables proactive pilot notifications before expiration</li>
            <li>Underwriters receive real-time medical status for risk evaluation — weeks to minutes</li>
          </ul>

          <h5 className="font-bold text-slate-800 mt-4 mb-2">For Aviation Authorities (CAA, FAA, EASA, CAAP)</h5>
          <p className="text-slate-700 leading-relaxed mb-2 text-sm text-red-600">Current gap: Each authority maintains separate license databases. Verification providers cannot access real-time credential validation, relying on pilot-submitted documents that may be falsified.</p>
          <ul className="text-sm text-slate-700 space-y-1 mb-4 ml-4 list-disc">
            <li>Pre-established API connections to CAA, FAA, EASA, CAAP for real-time license lookups</li>
            <li>Cross-border validation: API access for license conversion, validation, and foreign license acceptance rules per operator</li>
            <li>Biometric-linked verification with blockchain audit trails eliminates forged license submissions</li>
            <li>Authority databases remain source of truth — real-time lookups eliminate stale data</li>
          </ul>

          <h5 className="font-bold text-slate-800 mt-4 mb-2">For Flight Training Organisations (ATOs)</h5>
          <p className="text-slate-700 leading-relaxed mb-2 text-sm text-red-600">Current gap: Cadet program verification cannot access ATO transcripts, simulator hour logs, or training completion records — leaving a critical blind spot for low-time pilots entering the industry.</p>
          <ul className="text-sm text-slate-700 space-y-1 mb-4 ml-4 list-disc">
            <li>ATOs provide verified training records, simulator hours, and completion certificates — blockchain-backed</li>
            <li>Schools feed graduating pilots directly into the platform pipeline with pre-cleared verification status</li>
            <li>Students can complete background checks before graduation — arriving at operators as pre-verified candidates</li>
            <li>ATOs receive "Recognition-Ready Training Provider" status and commission per graduate who joins the platform</li>
            <li>Training records help insurance underwriters evaluate low-time pilot risk — closing a critical underwriting gap</li>
          </ul>

          <h5 className="font-bold text-slate-800 mt-4 mb-2">For Airport Security Authorities</h5>
          <p className="text-slate-700 leading-relaxed mb-2 text-sm text-red-600">Current gap: Airside passes, Counter Terrorist Check (CTC), and Known Crewmember status require direct aviation authority coordination. Background check companies treat these as standard criminal checks — missing aviation-specific security vetting entirely.</p>
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
          <p className="text-sm text-slate-700 mb-6">Pre-cleared pilots receive a <strong>"Verification Preferred" badge</strong> — visible on pathway cards and prioritised in candidate lists. Airlines receive a shortlist of pre-verified, pre-cleared professionals. Zero surprise rejections at the final offer stage.</p>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">For Airlines — Integrated Verification Infrastructure</h4>

          <h5 className="font-bold text-slate-800 mt-4 mb-2">API Integration</h5>
          <ul className="text-sm text-slate-700 space-y-1 mb-4 ml-4 list-disc">
            <li>Real-time verification triggers via REST API — instant check initiation when a pilot submits interest</li>
            <li>Webhook notifications — live updates on check completion pushed directly to airline systems</li>
            <li>99.9% uptime SLA — enterprise-grade reliability</li>
            <li>Direct ATS integration — Greenhouse, Workday, Lever and other major platforms supported</li>
          </ul>

          <h5 className="font-bold text-slate-800 mt-4 mb-2">Configurable Check Depth — Per Role</h5>
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

          <h5 className="font-bold text-slate-800 mt-4 mb-2">Fraud Prevention</h5>
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
          <h5 className="font-bold text-slate-800 mt-4 mb-2">Risk Scoring Data Points</h5>
          <ul className="text-sm text-slate-700 space-y-1 mb-4 ml-4 list-disc">
            <li><strong>Flight hours vs. incident ratio</strong> — measures safety record over career span</li>
            <li><strong>Type rating complexity</strong> — complex aircraft (A380, B747) vs. single-aisle risk profiles</li>
            <li><strong>Medical certificate history</strong> — Class 1/2/3 status, renewals, Special Issuances</li>
            <li><strong>Employment stability</strong> — average tenure per employer; frequent moves = higher risk</li>
            <li><strong>Geographic risk exposure</strong> — high-risk route assignments (mountainous, weather-challenged)</li>
            <li><strong>Aircraft types operated</strong> — turboprop vs. jet vs. widebody complexity tiers</li>
          </ul>

          <h5 className="font-bold text-slate-800 mt-4 mb-2">Consent-Based Access</h5>
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

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">Commercial Model — Verification Pricing Tiers</h4>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Volume Tier</th>
                  <th className="text-left px-4 py-2 font-semibold">Price Per Check</th>
                  <th className="text-left px-4 py-2 font-semibold">Includes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tier: 'Launch (0–1,000 checks)', price: 'Co-investment / waived', includes: 'Market development phase — building the verified pilot pool' },
                  { tier: 'Growth (1,001–5,000 checks)', price: '$25 per check', includes: 'Standard checks, API access' },
                  { tier: 'Scale (5,001–10,000 checks)', price: '$15 per check', includes: 'Volume pricing, expedited options' },
                  { tier: 'Enterprise (10,000+ checks)', price: '$12 per check', includes: 'Unlimited, custom check development, dedicated support' },
                ].map((row, i) => (
                  <tr key={row.tier} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">{row.tier}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-red-400 font-semibold">{row.price}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.includes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">Partnership Value Proposition</h4>
          <p className="text-slate-700 leading-relaxed mb-3">Together, PilotRecognition and its verification partners build the <strong>Global Clearinghouse for Verified Pilots</strong> — the standard infrastructure layer the aviation industry has never had. PilotRecognition becomes the <strong>"immigration gateway"</strong> for pilots — the first stop where credentials are verified before any airline application. Verification partners become the <strong>"digital passport bureau"</strong> for aviation — the trusted provider that stamps pilots as cleared for hire.</p>
          <ul className="text-sm text-slate-700 space-y-1 mb-6 ml-4 list-disc">
            <li>10–15% revenue share on verification fees — passive income without operational overhead</li>
            <li>Volume multiplier: one verified pilot applies to 5+ airlines = 5x check volume per user</li>
            <li>Year 1: co-investment phase, 5,000 pilots verified — market development focus</li>
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
