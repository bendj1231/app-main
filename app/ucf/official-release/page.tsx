'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../src/contexts/AuthContext';

const navSections = [
  { id: 'document-information', label: 'Document Information', group: 'doc', standalone: true },

  { id: 'pillar-foundation-program', label: 'Hub F — Foundation & Vision', group: 'hubf' },
  { id: '', label: 'Vision Layer', indent: true, group: 'hubf', subheader: true },
  { id: 'page-1-executive-summary', label: 'Executive Summary', indent: true, group: 'hubf' },
  { id: 'the-aviation-industry-operating-system', label: 'The Aviation Industry OS', indent: true, group: 'hubf' },
  { id: 'origin-story', label: 'Origin Story', indent: true, group: 'hubf' },
  { id: '', label: 'Foundation Program', indent: true, group: 'hubf', subheader: true },
  { id: 'foundation-discipleship', label: 'Core I: Mentorship & Formation', indent: true, group: 'hubf' },
  { id: 'foundation-consultation', label: 'Core II: Consultation & EBT', indent: true, group: 'hubf' },
  { id: 'foundation-peer-chain', label: 'Core III: The Peer Chain', indent: true, group: 'hubf' },
  { id: 'foundation-recognition-score', label: 'Core IV: Recognition Score', indent: true, group: 'hubf' },
  { id: 'foundation-missionary-model', label: 'Core V: The Advocacy Model', indent: true, group: 'hubf' },

  { id: 'hub-d-infrastructure', label: 'Hub D — Infrastructure & Data', group: 'hubd' },
  { id: '', label: 'Verification & Trust', indent: true, group: 'hubd', subheader: true },
  { id: 'hub-b-verification', label: 'Pillar 11: Background Checks & Verification', indent: true, group: 'hubd' },
  { id: '', label: 'Data & Integration', indent: true, group: 'hubd', subheader: true },
  { id: 'pillar-12-flight-data', label: 'Pillar 12: Flight Data & Navigation Apps', indent: true, group: 'hubd' },
  { id: 'pillar-13-aeromedical', label: 'Pillar 13: Aeromedical Examiners', indent: true, group: 'hubd' },
  { id: 'pillar-telemetry', label: 'Pillar: Telemetry & Simulator Data', indent: true, group: 'hubd' },
  { id: '', label: 'Security & Compliance', indent: true, group: 'hubd', subheader: true },
  { id: 'pillar-credential-wallet', label: 'Pillar: Digital Credential Wallet', indent: true, group: 'hubd', adminOnly: true },
  { id: 'pillar-identity-verification', label: 'Pillar: Identity & Document Verification', indent: true, group: 'hubd', adminOnly: true },
  { id: 'pillar-ats-integration', label: 'Pillar: ATS & Airline Systems Integration', indent: true, group: 'hubd', adminOnly: true },
  { id: 'pillar-ai-matching', label: 'Pillar: AI & Matching Engine', indent: true, group: 'hubd', adminOnly: true },
  { id: 'pillar-data-privacy', label: 'Pillar: Data Privacy & Consent Layer', indent: true, group: 'hubd', adminOnly: true },
  { id: 'pillar-third-party-vault', label: 'Pillar: Third-Party Data Integration Provider', indent: true, group: 'hubd', adminOnly: true },

  { id: 'part-ii-hub-a', label: 'Hub A — Aviation Operators & Training', group: 'huba' },
  { id: '', label: 'Training Organizations', indent: true, group: 'huba', subheader: true },
  { id: 'pillar-5-flight-training', label: 'Pillar 5: Flight Training (ATOs)', indent: true, group: 'huba' },
  { id: 'pillar-6-type-rating', label: 'Pillar 6: Type Rating Centers', indent: true, group: 'huba' },
  { id: 'pillar-universities', label: 'Pillar: Aviation Universities & Academies', indent: true, group: 'huba' },
  { id: '', label: 'Aviation Operators', indent: true, group: 'huba', subheader: true },
  { id: 'pillar-1-commercial-airlines', label: 'Pillar 1: Commercial Airlines', indent: true, group: 'huba' },
  { id: 'pillar-2-cargo-freight', label: 'Pillar 2: Cargo & Freight', indent: true, group: 'huba' },
  { id: 'pillar-3-charter-business', label: 'Pillar 3: Charter & Business Aviation', indent: true, group: 'huba' },
  { id: 'pillar-4-emerging-sectors', label: 'Pillar 4: Emerging Sectors (AAM)', indent: true, group: 'huba' },
  { id: 'pillar-7-military', label: 'Pillar 7: Military & Defense', indent: true, group: 'huba' },
  { id: 'pillar-recruitment', label: 'Pillar: Aviation Recruitment Agencies', indent: true, group: 'huba' },

  { id: 'hub-c-capital', label: 'Hub C — Capital, Risk & Compliance', group: 'hubc' },
  { id: 'pillar-8-banking', label: 'Pillar 8: Banking & Financial Institutions', indent: true, group: 'hubc' },
  { id: 'pillar-9-insurance', label: 'Pillar 9: Aviation Insurance Providers', indent: true, group: 'hubc' },
  { id: 'pillar-10-regulatory', label: 'Pillar 10: Legal & Regulatory Bodies', indent: true, group: 'hubc' },
  { id: 'pillar-credit-rating', label: 'Pillar: Credit Rating Agencies', indent: true, group: 'hubc' },

  { id: 'hub-e-community', label: 'Hub E — Community, Strategy & Growth', group: 'hube' },
  { id: 'pillar-14-mentors', label: 'Pillar 14: Pilot Mentors & Unions', indent: true, group: 'hube' },
  { id: 'pillar-15-manufacturers', label: 'Pillar 15: Manufacturers & OEMs', indent: true, group: 'hube' },
  { id: 'pillar-media', label: 'Pillar: Aviation Media & Publications', indent: true, group: 'hube' },

  { id: 'hub-f-growth', label: 'Hub F — Growth & Expansion', group: 'hubfg' },
  { id: 'pillar-events', label: 'Pillar: Aviation Events & Career Fairs', indent: true, group: 'hubfg' },
  { id: 'pillar-government', label: 'Pillar: Government Aviation Authorities', indent: true, group: 'hubfg' },
  { id: 'pillar-international-orgs', label: 'Pillar: International Aviation Organizations', indent: true, group: 'hubfg' },

  { id: 'hub-g-discovery', label: 'Hub G — Digital Discovery', group: 'hubg' },
  { id: 'pillar-25-discovery', label: 'Pillar 25: Digital Discovery & Search', indent: true, group: 'hubg' },
  { id: 'pillar-platform-legal-model', label: 'Pillar: Platform Legal Model & Revenue', indent: true, group: 'hubg' },
  { id: 'pillar-legal-inquiry-fees', label: 'Legal Inquiry & Response Fees', indent: true, group: 'hubg', adminOnly: true },
  { id: 'pillar-credential-chain', label: 'Example: Credential Chain', indent: true, group: 'hubg', adminOnly: true },
  { id: 'pillar-financial-chain', label: 'Example: Financial Chain', indent: true, group: 'hubg', adminOnly: true },
  { id: 'pillar-verification-depth', label: 'Verification Depth Indicator', indent: true, group: 'hubg', adminOnly: true },

  { id: 'future-prospects', label: 'Future Prospects', group: 'prospects', adminOnly: true },
  { id: 'prospect-flywire', label: 'Flywire — Cross-Border Payments', indent: true, group: 'prospects', adminOnly: true },

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
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    hubf: true, hubd: true, huba: true, hubc: true, hube: true, hubfg: true, hubg: true, prospects: true,
  });
  const toggleGroup = (group: string) => setCollapsedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const { currentUser, userProfile, login, logout } = useAuth();
  const profileLoaded = userProfile !== undefined && userProfile !== null;
  const isInternal = profileLoaded
    ? userProfile?.role === 'super_admin' || userProfile?.role === 'mentor_manager'
    : !!currentUser;
  const isSuperAdmin = profileLoaded ? userProfile?.role === 'super_admin' : !!currentUser;
  const sessionUser = currentUser ? { email: currentUser.email } : null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      await login(loginEmail, loginPassword);
      setShowLoginForm(false);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    }
  };

  const handleLogout = async () => { await logout(); };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Toggle navigation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {sidebarOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
            <Link to="/ucf" className="text-slate-900 font-semibold hover:text-red-600 transition-colors text-xs sm:text-sm flex-shrink-0">
              ← UCF
            </Link>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline text-slate-500 text-sm truncate">Official Release Document</span>
          </div>
          <div className="flex gap-2 items-center flex-shrink-0">
            {sessionUser ? (
              <div className="flex items-center gap-2">
                {isInternal && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-semibold uppercase tracking-wide">Admin</span>}
                <span className="hidden lg:inline text-xs text-slate-500 truncate max-w-[140px]">{sessionUser.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-xs sm:text-sm font-medium text-slate-700 border border-slate-300 hover:bg-slate-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginForm(true)}
                className="text-xs sm:text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors"
              >
                <span className="hidden sm:inline">Admin </span>Login
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="hidden sm:inline-flex text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
          </div>
        </div>
      </nav>

      {showLoginForm && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center" onClick={() => setShowLoginForm(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Admin Login</h2>
            <p className="text-slate-500 text-sm mb-6">Sign in to access internal commercial data</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              {loginError && <p className="text-red-600 text-xs">{loginError}</p>}
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors">Sign In</button>
            </form>
            <button onClick={() => setShowLoginForm(false)} className="mt-4 w-full text-slate-400 text-xs hover:text-slate-600">Cancel</button>
          </div>
        </div>
      )}

      {/* Sidebar overlay backdrop */}
      {sidebarOpen && (
        <div className="fixed left-0 top-[57px] right-0 bottom-0 bg-black/40 z-30" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Fixed sidebar panel — always overlays the page */}
      <aside className={`fixed left-0 top-[57px] z-40 h-[calc(100vh-57px)] w-72 bg-white shadow-2xl transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-3 border-b border-slate-200 bg-white flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">📑 Quick Navigation</h2>
              <p className="text-xs text-slate-500 mt-0.5">Jump to any section</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500" aria-label="Close navigation">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <nav className="p-2 space-y-0.5 overflow-y-auto flex-1">
            {isInternal && (
              <button
                onClick={() => scrollTo('part-ii-hub-a')}
                className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1.5 border border-emerald-200 mb-1"
              >
                <span className="text-emerald-500 flex-shrink-0">▸</span>
                <span className="leading-tight">Business Overview (Admin)</span>
              </button>
            )}
            {navSections.map((s, i) => {
              const isParent = !s.indent;
              const isCollapsed = collapsedGroups[s.group] ?? false;
              if (s.adminOnly && !isSuperAdmin) return null;
              if (s.subheader) {
                if (isCollapsed) return null;
                return (
                  <div key={`sub-${i}`} className="pl-4 pt-2 pb-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">{s.label}</span>
                  </div>
                );
              }
              if (s.indent && isCollapsed) return null;
              return isParent ? (
                <button
                  key={s.id}
                  onClick={() => { scrollTo(s.id); if (s.standalone) setSidebarOpen(false); else toggleGroup(s.group); }}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-between gap-1"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-red-500 flex-shrink-0">▸</span>
                    <span className="leading-tight">{s.label}</span>
                  </div>
                  {!s.standalone && <span className="text-slate-400 text-[10px] flex-shrink-0">{isCollapsed ? '▼' : '▲'}</span>}
                </button>
              ) : (
                <button
                  key={s.id}
                  onClick={() => { scrollTo(s.id); setSidebarOpen(false); }}
                  className={`w-full text-left pl-5 pr-2 py-1.5 rounded-lg text-xs transition-colors flex items-start gap-1.5 ${s.adminOnly && isSuperAdmin ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold' : 'text-blue-900 hover:bg-slate-200'}`}
                >
                  <span className={`mt-0.5 flex-shrink-0 ${s.adminOnly && isSuperAdmin ? 'text-emerald-500' : 'text-blue-900'}`}>→</span>
                  <span className="leading-tight">{s.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main layout */}
      <div className="w-full py-4 sm:py-8 min-h-screen">

        {/* Document article */}
        <article className="max-w-3xl mx-auto px-4 sm:px-8 overflow-x-hidden">

          {/* Document cover block */}
          <div id="document-information" className="mb-12 pb-10 border-b-2 border-slate-900 scroll-mt-24">
            <p className="text-xs font-bold tracking-widest uppercase text-red-600 mb-3">Official Release Document</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 pb-4 border-b-2 border-slate-900">
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

          {/* Pilot First Manifesto */}
          <div className="bg-slate-900 rounded-xl px-8 py-8 mb-10">
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-6">The Founding Principle — Read This First</p>

            <p className="text-white text-2xl font-bold leading-tight mb-6">
              Without us, you are nothing.
            </p>

            <p className="text-slate-300 leading-relaxed mb-4 text-sm">A $300 million Airbus A350 is a very expensive paperweight without two qualified pilots in the flight deck. An airline is a marketing and ticketing agency without the crew to execute the schedule. The regulators have nothing to regulate without the humans flying the machines. The manufacturers have no reason to build without the professionals to operate what they produce.</p>

            <p className="text-slate-300 leading-relaxed mb-6 text-sm">For decades, the industry treated pilots like an endless, replaceable commodity — filtered by HR software, lost in manual verification queues, left waiting in hiring backlogs while the aircraft sat grounded. The global pilot shortage exposed the reality: <strong className="text-white">the power dynamic has flipped.</strong> The supply is finite. The demand is not. And the professionals who keep this industry solvent have never had the infrastructure to wield that reality.</p>

            <p className="text-slate-300 leading-relaxed mb-8 text-sm">PilotRecognition is that infrastructure. Not a job board. Not an HR tool. Not another filtering system designed to make it easier for airlines to say no. <strong className="text-white">A platform built by pilots, architected around pilot-owned data, designed to flip the script — from "pilots, please apply" to "airlines, here is the verified talent pool. Prove why they should fly for you."</strong></p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {([
                { title: 'The Power Has Shifted', body: 'Pilots are not applicants on this platform. They are the product. Airlines access the platform because without the pilots on it, they cannot operate. That changes every negotiation.' },
                { title: 'Airlines Apply to Pilots', body: 'The Operator Expectations Page requires airlines to publish their culture, compensation, lifestyle, and transparency — before a single pilot considers them. The power of evaluation runs both ways.' },
                { title: 'Data Stays With the Pilot', body: 'No airline can pull your data without your explicit approval. Every credential, every verification token, every piece of your professional identity is yours — held in your wallet, released on your command.' },
              ] as {title:string;body:string}[]).map((item) => (
                <div key={item.title} className="border border-slate-700 rounded-lg px-4 py-4 bg-slate-800">
                  <p className="font-bold text-white text-sm mb-2">{item.title}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-700 pt-6">
              <p className="text-slate-400 text-xs leading-relaxed italic">This platform is the collective bargaining tool the pilot community has never had — architected as a compliance and verification network, operating as the infrastructure that makes the aviation industry run. Every commercial model, every pricing tier, every legal structure in this document exists to serve one founding principle: <strong className="text-slate-200">pilots first.</strong></p>
            </div>
          </div>

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

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">The Base Layer Thesis — Why This Platform Cannot Be Replicated</h3>
          <p className="text-slate-700 leading-relaxed mb-4">In technology, the most powerful companies do not build the applications. They build the operating system that every application runs on. Microsoft did not build Office before Windows. Apple did not build the App Store before iOS. The platform that controls the base layer does not compete with what runs on top of it — <strong>it becomes the condition for everything else existing at all.</strong></p>
          <p className="text-slate-700 leading-relaxed mb-6">The aviation industry has operated top-down for 70 years: regulators dictate to airlines, airlines dictate to training centers, and pilots are treated as the end product — interchangeable cogs inserted into the last step of the process. <strong>That model is structurally inverted from reality.</strong> The pilot is not the end product. The pilot is the foundation. Remove the verified, qualified human from the left and right seats, and every other layer of the industry collapses simultaneously.</p>

          <div className="bg-slate-900 rounded-xl px-8 py-6 mb-8">
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-5">The Industry Stack — Corrected</p>
            <div className="space-y-2 mb-6">
              {([
                { layer: 'Layer 4 — Regulators', desc: 'Issue certificates, set standards, enforce compliance. Have nothing to regulate without the humans below.', color: '#94a3b8' },
                { layer: 'Layer 3 — Airlines & Operators', desc: 'Move passengers and cargo. Are marketing and scheduling companies without the crew to execute. Pay access fees to reach the layer below.', color: '#94a3b8' },
                { layer: 'Layer 2 — Training & Verification', desc: 'Produce and certify qualified pilots. Exist only to serve the layer below. Depend on the platform to place their graduates.', color: '#94a3b8' },
                { layer: 'Layer 1 — Manufacturers & OEMs', desc: 'Build aircraft. Cannot sell what airlines cannot crew. Pay for market intelligence about the layer below.', color: '#94a3b8' },
              ] as {layer:string;desc:string;color:string}[]).map((item, i) => (
                <div key={item.layer} className="flex items-start gap-4 border border-slate-700 rounded-lg px-4 py-3 bg-slate-800">
                  <span className="text-slate-500 text-xs font-mono flex-shrink-0 mt-0.5">{4 - i}</span>
                  <div>
                    <p className="text-slate-300 font-semibold text-sm">{item.layer}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-4 border-2 border-red-500 rounded-lg px-4 py-3 bg-slate-800">
                <span className="text-red-400 text-xs font-mono flex-shrink-0 mt-0.5 font-bold">0</span>
                <div>
                  <p className="font-bold text-sm" style={{color:'#f87171'}}>Layer 0 — The Pilot · THE BASE LAYER</p>
                  <p className="text-slate-300 text-xs leading-relaxed">The verified, qualified human. The only non-negotiable input in the entire industry. Every layer above depends on this one. <strong className="text-white">PilotRecognition owns the infrastructure where this layer lives, verifies, and commands its data.</strong></p>
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-xs italic">Every stakeholder above Layer 0 must plug into the platform to access Layer 0. That is not a feature. It is the moat.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {([
              {
                title: 'Why Airlines Cannot Walk Away',
                color: 'border-blue-400',
                items: [
                  'Their hiring pipeline depends on the verified pilot pool',
                  'Unverified hiring means regulatory exposure and liability',
                  'Every competitor airline is on the platform — absence signals weakness',
                  'Their ATS integrations are wired into the platform API',
                ],
              },
              {
                title: 'Why Training Centers Cannot Walk Away',
                color: 'border-emerald-400',
                items: [
                  'Their graduates need verified digital logbooks to be hired',
                  'Their placement rates are only provable through the platform',
                  'Students choose schools with verified placement outcomes',
                  'Their referral income flows through the platform',
                ],
              },
              {
                title: 'Why OEMs Cannot Walk Away',
                color: 'border-yellow-400',
                items: [
                  'Fleet sale decisions require live pilot supply data',
                  'Simulator production planning requires 18-month demand curves',
                  '"OEM Verified Graduate" pathway only exists on the platform',
                  'EBT curriculum development requires anonymised competency benchmarks',
                ],
              },
              {
                title: 'Why Insurers Cannot Walk Away',
                color: 'border-purple-400',
                items: [
                  'Source truth of verified hours is the only accurate underwriting input',
                  'Continuous monitoring replaces static annual snapshot',
                  'Competency-based premium pricing only possible with platform data',
                  'Hull insurance on multi-million dollar aircraft priced on estimates — until now',
                ],
              },
            ] as {title:string;color:string;items:string[]}[]).map(col => (
              <div key={col.title} className={`border-l-4 ${col.color} rounded-r-lg px-5 py-4 bg-white border border-slate-200`}>
                <p className="font-bold text-slate-900 text-sm mb-3">{col.title}</p>
                <ul className="space-y-1">{col.items.map(i => <li key={i} className="text-xs text-slate-600 flex gap-2"><span className="text-slate-400 flex-shrink-0">→</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-8 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>The legal consequence of owning the base layer:</strong> <span className="text-slate-300">Because the pilot owns their data in a decentralised wallet and commands every release — and because the platform is the neutral infrastructure through which that happens — no airline's aggressive legal department can rewrite the terms of access. The airline needs the network more than the network needs any single airline. This is not a negotiating position. It is the architecture.</span></p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">The Most Expensive Lie in Aviation — Validated at Industry Level</h3>

          <div className="bg-amber-50 border border-amber-300 rounded-lg px-5 py-4 mb-6">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">Industry Validation</p>
            <p className="text-slate-700 text-sm leading-relaxed">The following pain point was confirmed in recorded interviews with senior representatives from a major aircraft manufacturer. This is not a hypothesis. It is the core thesis of the platform, validated at the highest level of the manufacturing industry as a live, unresolved problem costing the industry billions in stalled expansion.</p>
          </div>

          <p className="text-slate-700 leading-relaxed mb-4">Flight schools and Type Rating Organisations — including the training arms of major manufacturers — sell a legally accurate but operationally misleading promise: <em>"Get your 200 hours, complete an A320 Type Rating, and you are qualified to sit in the right seat of an airliner."</em> They are correct. The Civil Aviation Authority will print the license. The pilot is legally compliant. <strong>And then the pilot walks into an airline, and the industry reality hits them like a brick wall.</strong></p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {([
              {
                source: 'The Airline Says',
                color: '#f87171',
                quote: '"Our internal Safety Management System requires 500 hours on type before solo rostering. Legal minimum is irrelevant to our ops manual."',
              },
              {
                source: 'The Insurer Says',
                color: '#fbbf24',
                quote: '"We will not cover a 200-hour pilot in an A320 unless the Captain has 5,000 hours — which destroys our roster flexibility. Policy denied."',
              },
              {
                source: 'The EBT Assessor Says',
                color: '#60a5fa',
                quote: '"This pilot holds the legal rating. Their verified competency profile is blank. We have no EBT data to assess actual readiness."',
              },
            ] as {source:string;color:string;quote:string}[]).map((item) => (
              <div key={item.source} className="border border-slate-200 rounded-lg px-5 py-4 bg-white">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{color: item.color}}>{item.source}</p>
                <p className="text-sm text-slate-600 leading-relaxed italic">{item.quote}</p>
              </div>
            ))}
          </div>

          <p className="text-slate-700 leading-relaxed mb-4"><strong>Manufacturers hate this disconnect.</strong> If airlines refuse to hire 200-hour type-rated pilots, the pilot pipeline stalls. If the pipeline stalls, airlines cannot expand their fleets. If airlines cannot expand, manufacturers cannot sell more aircraft. The gap between legal compliance and operational reality is not a pilot problem — it is a multi-billion-dollar constraint on every major manufacturer's revenue model.</p>

          <div className="bg-slate-900 rounded-xl px-8 py-6 mb-8">
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-4">How PilotRecognition Fixes This — The Truth Layer</p>
            <div className="space-y-3">
              {([
                {
                  n: '1',
                  title: 'Connecting Legal to Operational Reality',
                  body: 'If an airline requires more than the legal 200 hours, they must state it on their Operator Expectations Page. Pilots stop blindly spending $30,000 on a type rating hoping for a job. They pursue pathways where they know they meet the operational — not just the legal — requirement. The information gap closes. The waste stops.',
                },
                {
                  n: '2',
                  title: 'Giving Manufacturers a Data-Backed Shield for Their Graduates',
                  body: 'The manufacturer attaches Competency & EBT Tokens to their 200-hour graduates. Instead of an airline seeing "200 hours" and rejecting on insurance grounds, they see: is_type_rated = TRUE · simulator_competency_score = Top 10% · training_source_verified = OEM Training Centre. The airline and insurer get the proof they need. The manufacturer gets the pipeline they need. The pilot gets the job.',
                },
                {
                  n: '3',
                  title: 'The Broken Feedback Loop — Closed',
                  body: 'PilotRecognition becomes the feedback channel between manufacturers building the planes, schools selling the training, and airlines facing the operational reality. For the first time, that loop is visible, structured, and actionable. Manufacturers see which of their graduates are being hired, which are being rejected, and precisely why — in real time.',
                },
              ] as {n:string;title:string;body:string}[]).map((item) => (
                <div key={item.n} className="flex items-start gap-4 border border-slate-700 rounded-lg px-4 py-3 bg-slate-800">
                  <span className="text-red-400 font-bold text-sm flex-shrink-0 mt-0.5">{item.n}.</span>
                  <div>
                    <p className="font-bold text-white text-sm mb-1">{item.title}</p>
                    <p className="text-slate-400 text-xs leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-8 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>This is not a recruitment tool. It is the Truth Layer.</strong> <span className="text-slate-300">The gap between the license on paper and the readiness the industry demands is the most expensive information failure in aviation. PilotRecognition closes it — and senior representatives at the manufacturer level have confirmed, on record, that they need exactly this to exist.</span></p>
          </div>

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

          <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4">The Architectural Imperative: Pilot-Commanded Infrastructure</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Before engaging with any specific pillar, every stakeholder — airline, operator, regulator, or investor — must understand the foundational rule that governs how data moves on this platform. PilotRecognition is not a data broker. It operates as <strong>neutral, pilot-commanded infrastructure</strong>. This is not a marketing position. It is the legal and technical architecture on which every commercial relationship in this document is built.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {([
              {
                title: 'Zero Data Custody',
                color: '#34d399',
                desc: 'The platform does not store raw license files, medical certificates, or logbook pages. Verified credentials live exclusively in the pilot\'s personal Decentralised Identifier (DID) wallet. If the platform is ever targeted by a breach, there is no personal data to leak.',
              },
              {
                title: 'No Implicit Access',
                color: '#60a5fa',
                desc: 'Airlines and operators cannot pull candidate data passively. Every data release requires the pilot to receive a push notification and actively authorise the transaction by tapping APPROVE. Implicit consent does not exist on this platform.',
              },
              {
                title: 'Controller-to-Controller',
                color: '#f87171',
                desc: 'Background checks are processed via independent Data Controllers (Veremark, IDfy) who issue binary cryptographic proofs (e.g. is_license_valid = TRUE) back to the pilot\'s wallet. The platform remains a neutral conduit — never touching or storing the underlying data strings.',
              },
            ] as {title:string;color:string;desc:string}[]).map((item) => (
              <div key={item.title} className="border border-slate-200 rounded-lg px-5 py-4 bg-white">
                <p className="font-bold mb-2 text-sm" style={{color: item.color}}>{item.title}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-4 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>What this means for enterprise legal teams:</strong> <span className="text-slate-300">When your procurement or legal department reviews this platform, you are not entering a data processing agreement with a traditional SaaS vendor. You are accessing infrastructure that routes pilot-authorised cryptographic proofs. The liability of data custody remains with the source controllers (Veremark, IDfy). The power of data release remains entirely with the pilot. PilotRecognition operates as Joint Controller of the infrastructure only — under GDPR Article 26 and Philippine DPA RA 10173.</span></p>
          </div>

          <div className="bg-amber-50 border border-amber-300 rounded-lg px-5 py-3 mb-8">
            <p className="text-amber-800 text-sm"><strong>Enterprise DPA Note:</strong> If your organisation requires a standard Data Processing Agreement (e.g. Airbus, Boeing, or airline group procurement), PilotRecognition provides an <strong>Enterprise Vendor Statement</strong> explaining the Joint Controller architecture and confirming that the platform does not act as a data processor under your organisation's DPA. Available on request from enterprise accounts.</p>
          </div>

          <hr className="my-10 border-slate-300" />

          {/* Origin Story */}
          <h1 id="origin-story" className="text-4xl font-bold text-slate-900 mt-12 mb-6 pb-4 border-b-2 border-slate-900 scroll-mt-24">
            WHY THIS EXISTS: THE ORIGIN OF PILOTRECOGNITION
          </h1>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">The Founding Story — From the Pilot Who Built It</p>

          <p className="text-slate-700 leading-relaxed mb-4">This platform was not built in a boardroom. It was not born from a market research report or a venture capital thesis. It was built because of a phone call. A pilot — a friend — called and said four words that changed the direction of everything: <strong style={{color:'#dc2626'}}>"Ben, I quit flying."</strong></p>
          <p className="text-slate-700 leading-relaxed mb-4">That phone call is the reason PilotRecognition.com exists. Everything in this document — every pillar, every framework, every commercial model — traces back to that moment. And to understand why it matters, you need to understand the system that produced it.</p>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">Daniel's Story</h3>

          <div className="border border-slate-200 rounded-lg px-6 py-5 mb-6 bg-white">
            <p className="text-xs uppercase tracking-wide font-semibold text-slate-500 mb-3">Case Study — The Cost of a Broken System</p>
            <p className="text-slate-700 leading-relaxed mb-3">Daniel is not an average pilot. His father is a senior AMT — an Aircraft Maintenance Technician with Rolls-Royce affiliations. The person whose signature determines whether an aircraft engine is airworthy or not. <strong>His son has direct access to Airbus-level relationships, aviation industry insiders, and the kind of network most pilots spend careers trying to build.</strong></p>
            <p className="text-slate-700 leading-relaxed mb-3">Daniel spent four years working as an AMT mechanic because he was told — incorrectly — that he could not obtain a commercial pilot licence without a university degree. That was false. It was bad communication, lack of professional advocacy, and an industry that profits from keeping pilots in a cycle of uncertainty and spend. <strong>He was being kept in the machine, not guided out of it.</strong></p>
            <p className="text-slate-700 leading-relaxed mb-3">He then invested <strong>₱6,000,000 Philippine pesos</strong> — approximately $100,000 USD — in an ATR type rating. He completed his simulator training. He was certified as a CFI for ATR at Clark Airport. He did everything the system told him to do.</p>
            <p className="text-slate-700 leading-relaxed mb-3">No placement. No recognition. No return on investment.</p>
            <p className="text-slate-700 leading-relaxed mb-4">He called and said he was quitting. That if he did not stop now, he would never financially recover. <strong>A pilot with Airbus-level family connections, a completed type rating, simulator certification, and 6 million pesos invested — had nothing to show for it.</strong></p>
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <p className="text-slate-800 text-sm leading-relaxed italic">"If this is happening to Daniel — someone with every advantage the industry can offer — what is happening to the rest of us?"</p>
              <p className="text-slate-500 text-xs mt-1">— Karl &amp; Benjamin, Co-Founders, PilotRecognition.com</p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">January 21st — Abu Dhabi Aviation Career Fair</h3>
          <p className="text-slate-700 leading-relaxed mb-4">On January 21st, the founder took a risk. As a pilot with 200 hours and a commercial licence, he travelled to the UAE to attend the Aviation Career Fair — his one opportunity to put the industry's questions directly to the airlines, manufacturers, and authorities in the room.</p>
          <p className="text-slate-700 leading-relaxed mb-4">The first booth was Etihad. The response was immediate and familiar: <strong style={{color:'#dc2626'}}>"Sorry — you know the requirements. 1,500 hours. Come back and get that."</strong> A pilot who had spent $50,000 USD, flown across the world for a single shot at a real answer, was told to scan a QR code and leave.</p>
          <p className="text-slate-700 leading-relaxed mb-4">Then something shifted. The same pilot approached Etihad again — this time not just as a pilot, but as someone building a platform to solve exactly the communication failure they were standing inside. <strong>The attitude changed instantly.</strong> They became engaged. Welcoming. The conversation lasted. In that shift — from dismissal to dialogue — the entire thesis of PilotRecognition was confirmed in under two minutes.</p>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-6 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>The problem was never the pilot. The problem was the absence of a structured channel for communication between the pilot and the industry.</strong> Airlines are not cruel. They are numb. They have answered the same question from 10,000 pilots and it stopped meaning anything. They don't know how to say anything different because no platform exists to give them a different answer to give. <strong style={{color:'#f87171'}}>PilotRecognition builds that channel.</strong></p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">The Three Pilots This Platform Was Built For</h3>
          <p className="text-slate-700 leading-relaxed mb-5">Every mechanic in this framework, every pillar, every commercial model — was designed to solve for three specific people. They are not personas. They are real.</p>

          <div className="space-y-4 mb-8">
            {([
              {
                label: 'The Graduate — 200 Hours, $50,000 Spent, No Direction',
                body: <>A pilot graduates with a CPL. They have invested $50,000 USD — money owed to parents, to banks, to years of sacrifice. They were promised an industry that would absorb them. Instead: <strong>"1,500 hours. Come back."</strong> With 200 hours and no income, the path to 1,500 hours is a financial and psychological maze with no map. No one tells them which type rating to pursue, which operator is hiring for what, what the market actually demands. They are left to rely on Reddit, Discord, forum posts, and the sales pitches of simulator centres who have no obligation to tell them the truth.
                <br /><br />
                Studies now show that pilots with airline-employed parents are actively discouraging their children from entering aviation — not because they don't love the industry, but because they know exactly what it costs and exactly what it does not guarantee. <strong>The 2013 implementation of the 1,500-hour rule was written in response to an aircraft accident. It was designed to prevent a tragedy in the sky. What it created instead was a different kind of accident — one that does not show up in an NTSB report, one with no wreckage to photograph, but one that is destroying pilot career futures at scale.</strong> A law born from one crash has caused tens of thousands of silent ones. The Swiss Cheese model used in accident investigations applies here too: layer after layer of systemic failure, each one individually manageable, collectively catastrophic. The holes aligned — and the pilot fell through.</>
              },
              {
                label: 'The Instructor — 6,000 Hours, 15 Years, Handcuffed',
                body: <>There is an instructor at a prestigious flight school — a real person, not a hypothetical — who has been there for 15 years. 6,000 hours. He wants to move to corporate aviation. He cannot leave because if he does, he loses 15 years of seniority. He has a type rating. He has the hours. He has more real-world flying experience than most airline first officers. <strong>No one has formally recognised any of it.</strong>
                <br /><br />
                Meanwhile, the students in his class know he has been there 15 years and wonder privately: if this school is so good, why hasn't he left? It is a bad look for the school. It is a slow burn for the instructor. And it is a commercial problem for the ATO that cannot move throughput because the seat is permanently occupied.
                <br /><br />
                <strong>The clog is confirmed and occurring globally.</strong> Not just in the Philippines. This is a structural feature of an industry without a recognition layer — pilots accumulate at every floor, stuck not because of incompetence but because no structured mechanism exists to move them forward. PilotRecognition is that mechanism.</>
              },
              {
                label: 'The Airline Captain — 12 Years, Bored, Trapped',
                body: <>A Philippine Airlines captain — confirmed real conversation, pilot to pilot — 12 years in position. A330, 5,000 turbine hours. Bored. Wants change. Cannot move. The moment he leaves, his seniority resets to zero, his pay drops, and his lifestyle collapses. He is not trapped by the work. He is trapped by the system that was built around it.
                <br /><br />
                He does not have time to search for opportunities. He is flying international routes. His profile has never been formally presented to any operator outside his current airline because there has been no mechanism to do so. <strong>His capabilities are invisible to the market — not because he is not exceptional, but because no portable recognition infrastructure exists to make him visible.</strong>
                <br /><br />
                PilotRecognition manages his profile. Finds the opportunities he does not have time to find. And when the right operator sees him — he does not have to start from zero. His Recognition Score travels with him.</>
              },
            ] as { label: string; body: React.ReactNode }[]).map((item) => (
              <div key={item.label} className="border border-slate-200 rounded-lg px-5 py-4 bg-white">
                <p className="font-bold text-slate-900 mb-3" style={{color:'#dc2626'}}>{item.label}</p>
                <p className="text-sm text-slate-700 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">What Every Pilot Is Actually Asking</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Every pilot who has ever stood at an airline booth, filled out an application, or typed a question into an aviation forum is asking the same underlying set of questions. The industry has never built a structured answer to any of them.</p>
          <ul className="space-y-2 mb-6">
            {[
              'What type rating should I pursue — and will it actually lead to employment given the current market?',
              'Which operators are actively hiring for my profile, my hours, my geography, right now?',
              'Has the manufacturer released new aircraft that will make my type rating obsolete or more valuable?',
              'What does this airline actually want beyond the published minimums?',
              'What banking or financing options exist for type rating investment, and what collateral do lenders require?',
              'What insurance underwriter will cover me, and what do they consider low-risk vs high-risk?',
              'I have 200 hours — is there a career pathway available to me that is not flight instruction?',
              'If I pursue eVTOL or agricultural aviation or air taxi operations, is that a legitimate career or a dead end?',
              'Why is my 1,000 hours on a Cessna valued differently from 1,000 hours on a jet — and by how much?',
              'If I leave my current airline, what happens to my seniority, and is there any way to preserve my career value?',
            ].map((q) => (
              <li key={q} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span className="text-sm">{q}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-700 leading-relaxed mb-4"><strong>PilotRecognition is the infrastructure that makes these questions answerable — structurally, verifiably, and in real time.</strong> Not from a corporate desk. Not from a brochure. From a platform built by a pilot who asked every single one of them and received nothing useful in return.</p>

          <h3 className="text-xl font-bold text-slate-800 mt-10 mb-3">The Founder's Testimony — What the Industry Actually Did to Its Pilots</h3>
          <p className="text-slate-500 text-xs uppercase tracking-wide font-semibold mb-5">Written in the founder's own words. Unredacted.</p>

          <div className="border border-slate-200 rounded-lg px-6 py-5 mb-6 bg-white space-y-4">
            <p className="text-slate-700 leading-relaxed text-sm">When I first joined my flight school, I had no idea what I was getting into. I didn't know about the 1,500-hour rule. I didn't know about the real importance of licences and medicals. I was fixated. Ambitious. I believed and I trusted the process. <strong>That is the problem with flight schools — they make you believe, but they don't tell you what is actually happening in reality.</strong></p>

            <p className="text-slate-700 leading-relaxed text-sm">Flight schools need to be honest and open — especially when there is an accident or incident. There needs to be thorough checking of aircraft without hiding evidence of a crash or a landing excursion. I experienced it first hand. I was on approach for a landing. A plane was 50 feet above me. The instructor didn't notice. <strong>I did.</strong> I took the call. I reported on ATC. The ATC didn't know what to do. My flying days are finished. My training days are over. Now I am here — building a platform to help pilots, and people like me, get recognition in an industry that gave us nothing when we needed it most.</p>

            <div className="border-l-4 border-red-500 pl-4 py-1">
              <p className="text-slate-800 text-sm leading-relaxed italic">PilotRecognition.com is a beacon. An ELT — an Emergency Locator Transmitter — signalling for help. For pilots who completed their training, earned their 200 hours, and then disappeared into silence.</p>
            </div>

            <p className="text-slate-700 leading-relaxed text-sm">I went hangar to hangar. Twelve different locations. Seeking any opportunity as a pilot. Every single one — a closed door. I was simply asking about their requirements. <em>"Sorry, we're not hiring."</em> That was the answer. Every time.</p>

            <p className="text-slate-700 leading-relaxed text-sm">I walked into an airline reception and asked if there was someone I could speak to regarding pilot opportunities. I was told: <em>"Sorry, we don't do walk-ins. Here's an email. Thank you. Goodbye."</em> The cabin crew standing next to me was treated with more professional respect than a pilot who had already spent everything he had. <strong>That is not an exaggeration. That is what happened.</strong></p>

            <p className="text-slate-700 leading-relaxed text-sm">And then you go home. And your parents — who have no aviation background, who don't understand the 1,500-hour rule, who don't know what a type rating costs — they ask: <em>"What happened to you? You spent $50,000 and you can't find a job? Why can't you get a job at McDonald's to build some experience?"</em> They are not being cruel. They simply cannot comprehend a system that takes everything from someone and gives them a licence they cannot use.</p>

            <p className="text-slate-700 leading-relaxed text-sm">I watched friends stop talking about aviation. Some moved to farming. Some to construction. Because they know — the aviation dream is just a dream, even if you hold the licence. The licence proves nothing to an industry that has decided you are a low-timer, a high-risk, an inexperienced liability. <strong>The label follows you out of the gate the moment you graduate.</strong></p>

            <p className="text-slate-700 leading-relaxed text-sm">I once asked a senior captain a simple question about experimental aircraft registration in the Philippines. He looked at me and said: <em>"Your CFI should have taught you that."</em> And kept walking. <strong>There is an ego problem in this industry</strong> — not just in flight schools, but in the pilot community itself. Senior pilots who know the harsh truths and guard them, who wear the difficulty as a badge and offer nothing to the person behind them. That culture is part of the damage. And it stops here.</p>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">What the Head of Training Said</h4>
          <div className="bg-slate-100 border border-slate-300 rounded px-5 py-4 mb-6">
            <p className="text-slate-700 text-sm leading-relaxed italic mb-2">"Graduates are faced with a big question mark. They don't know how to get to the airlines — or to any starting position — because a structured pathway to get there simply does not exist."</p>
            <p className="text-slate-500 text-xs">— Head of Training, unnamed flight school (Philippines)</p>
          </div>
          <p className="text-slate-700 leading-relaxed mb-4">Flight schools are promoting their Advanced Operations and Management programs — not purely because they believe in their graduates' readiness, but because <strong>they cannot bear to watch what happens to those graduates after they leave.</strong> They see the backlash. They see the question mark. They feel the responsibility of having taken the money and having no structural answer for what comes next.</p>
          <p className="text-slate-700 leading-relaxed mb-4">That is not a condemnation of flight schools. It is a diagnosis. The system failed to build the infrastructure between training and employment, and everyone inside it — schools, pilots, airlines — is absorbing the cost in different ways. <strong>PilotRecognition is that infrastructure.</strong> It does not replace the flight school. It completes what the flight school was never equipped to finish.</p>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-6 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>This platform was not designed in theory. It was built from inside the wreckage.</strong> Every feature, every pillar, every framework in this document exists because someone lived through the exact failure it was designed to fix. The founder is not an observer of this problem. <strong style={{color:'#f87171'}}>He is the problem's most direct product — and this platform is his answer.</strong></p>
          </div>

          <p className="text-slate-700 leading-relaxed mb-6">The industry is 100 years old. Nothing in it is perfect. Accuracy is based entirely on what data exists — and until now, almost none of the right data has been structured, portable, or shared. <strong>That is what this document changes.</strong></p>

          <hr className="my-10 border-slate-300" />

          <div className="bg-slate-50 border border-slate-300 rounded-lg px-6 py-5 mb-10">
            <p className="text-xs uppercase tracking-wide font-semibold text-slate-400 mb-3">Architectural Note — The Neutrality Shield</p>
            <p className="text-slate-700 text-sm leading-relaxed mb-3">Everything written above this line is the <strong>Vision Layer</strong> — the founding story, the moral authority, the human cost of a broken system. It exists to establish trust with every pilot, every school, and every institution that asks: <em>why does this platform exist, and who built it?</em></p>
            <p className="text-slate-700 text-sm leading-relaxed mb-3">Everything written below this line is the <strong>Protocol Layer</strong> — hard, structured, cryptographically verifiable, and commercially defensible. It exists to establish trust with every airline, every regulator, every insurer, and every investor that asks: <em>how does this platform work, and what does it guarantee?</em></p>
            <p className="text-slate-700 text-sm leading-relaxed"><strong>PilotRecognition operates as a neutral infrastructure layer.</strong> It does not compete with airlines. It does not replace flight schools. It does not adjudicate between operators. It is the kernel — the standardised language the industry uses to communicate with itself. The Vision gives it moral authority. The Protocol gives it technical permanence. <strong style={{color:'#dc2626'}}>Both are required. Neither replaces the other.</strong></p>
          </div>

          {/* Part II */}
          <h1 id="part-ii-hub-a" className="text-4xl font-bold text-slate-900 mt-12 mb-3 pb-4 border-b-2 border-slate-900 scroll-mt-24">
            PART II: HUB A
          </h1>
          <h2 className="text-2xl font-bold text-slate-700 mb-2">Aviation Operators &amp; Training Organizations</h2>
          <p className="text-xs font-bold tracking-widest uppercase text-red-600 mb-6">Aviation Operators · Training Organizations · Pathways &amp; Expectations</p>

          <p className="text-slate-700 leading-relaxed mb-6 text-lg">Hub A is the operational core of the Universal Commercial Framework. It defines how every sector of professional aviation — from commercial airlines to military commands, from cadet flight schools to type rating simulators — connects with the verified pilot population through a single, standardised infrastructure layer.</p>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-8 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>The fundamental problem Hub A solves:</strong> Every sector in professional aviation recruits differently, publishes requirements inconsistently, and evaluates candidates against criteria that pilots have never been able to see in structured form. Hub A forces transparency — not as a policy demand, but as a commercial incentive. <strong style={{color:'#f87171'}}>Operators who publish structured pathway cards access a larger, better-aligned, pre-verified candidate pool. Operators who don't, don't.</strong></p>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-4">Hub A Coverage — Nine Pillars, Two Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="border border-slate-200 rounded-lg p-5 bg-white">
              <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">Aviation Operators</p>
              <ul className="space-y-2 text-sm text-slate-700">
                {[
                  { p: 'Pillar 1', t: 'Commercial Airlines', d: 'Pathway cards, CBTA alignment, gap analysis, pulling system' },
                  { p: 'Pillar 2', t: 'Cargo & Freight Operators', d: 'Night hours verification, heavy jet experience, dedicated pipeline' },
                  { p: 'Pillar 3', t: 'Charter & Business Aviation', d: 'Discretion-first matching, VIP pathway access, automated crew outsourcing' },
                  { p: 'Pillar 4', t: 'Emerging Sectors (AAM)', d: 'eVTOL, drones, agricultural aviation — non-hours-based competency routing' },
                  { p: 'Pillar 7', t: 'Military & Defense Commands', d: 'Civilian transition infrastructure, skills translation, verified transition pathways' },
                ].map(item => (
                  <li key={item.p} className="flex items-start gap-2">
                    <span className="text-red-500 font-bold flex-shrink-0 w-14">{item.p}</span>
                    <span><strong>{item.t}</strong> — {item.d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-slate-200 rounded-lg p-5 bg-white">
              <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">Training Organizations</p>
              <ul className="space-y-2 text-sm text-slate-700">
                {[
                  { p: 'Pillar 5', t: 'Flight Training Organizations (ATOs)', d: 'Operator-linked curriculum tokens, graduate pathway matching, CPL verification' },
                  { p: 'Pillar 6', t: 'Type Rating & Simulator Centers', d: 'Pathway-linked type rating listings, proficiency data integration, gap-to-rating routing' },
                ].map(item => (
                  <li key={item.p} className="flex items-start gap-2">
                    <span className="text-red-500 font-bold flex-shrink-0 w-14">{item.p}</span>
                    <span><strong>{item.t}</strong> — {item.d}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 leading-relaxed">Training organizations in Hub A are not passive directories. They are active participants in the pilot-to-operator pipeline — their output feeds directly into the verified candidate pool that operators access.</p>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg px-6 py-5 mb-10 bg-slate-50">
            <p className="text-xs uppercase tracking-wide font-semibold text-slate-500 mb-3">Hub A Architecture — How the Pillars Connect</p>
            <p className="text-slate-700 text-sm leading-relaxed mb-3">Each pillar in Hub A operates as an independent module — with its own operator profile structure, pathway card format, commercial tier, and verification layer. But they share a common data substrate: the <strong>Global Pilot Database</strong>. Every verified pilot profile is visible across all Hub A pillars simultaneously. A pilot who meets the criteria for a charter operator <em>and</em> a cargo pathway <em>and</em> a military transition program does not submit separate applications. <strong>Their single verified profile is matched against all active Hub A pathway criteria in real time.</strong></p>
            <p className="text-slate-700 text-sm leading-relaxed"><strong style={{color:'#dc2626'}}>One profile. Nine pillars. Continuous circulation.</strong> This is the structural advantage that no sector-specific job board or recruitment agency can replicate — and it is the foundation on which Hub A's commercial model is built.</p>
          </div>

          <h2 id="pillar-1-commercial-airlines" className="text-2xl font-bold text-slate-800 mt-8 mb-4 pb-2 border-b border-slate-300 scroll-mt-24">
            PILLAR 1: COMMERCIAL AIRLINES
          </h2>

          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3 scroll-mt-24">The Problem: The Structural Collapse of the Pipeline</h3>

          <p className="text-slate-700 leading-relaxed mb-4">Commercial airlines face a consistent set of operational challenges in pilot recruitment that <strong>no existing platform has solved.</strong> The problem exists on both sides of the hiring relationship simultaneously. But beneath the surface-level friction of slow hiring and poor CV quality lies a deeper failure — two invisible structural crises that the industry has not named, addressed, or built infrastructure to reverse.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="border-l-4 border-red-500 bg-red-50 px-5 py-4 rounded-r">
              <p className="font-bold text-slate-800 mb-1">Invisible Failure 1 — The Heritage Crisis</p>
              <p className="text-slate-700 text-sm leading-relaxed">The most naturally capable pilots — those with aviation heritage, who grew up around aircraft and absorbed the profession from birth — are being steered away at the source. Captains with 30-year careers are telling their own children not to follow them into aviation. Not from lack of love for it. From lived experience of an industry with no clear pathway, no structured recognition, and a near-impossible financial entry barrier. Meanwhile, non-heritage pilots enter blind — discovering the 1,500-hour gap and its $160,000 capital requirement only after they have already committed. <strong>Every aviation family that redirects their child is a permanent loss the industry will never recover.</strong></p>
            </div>
            <div className="border-l-4 border-slate-400 bg-slate-50 px-5 py-4 rounded-r">
              <p className="font-bold text-slate-800 mb-1">Invisible Failure 2 — The Information Asymmetry</p>
              <p className="text-slate-700 text-sm leading-relaxed">Airlines delegate to agencies because they cannot handle the volume. Agencies prioritise filling seats over finding fit. The result: high-value profiles are systematically buried — a 6,000-hour flight instructor filtered out by an ATS parser because their CV wasn't ATLAS-formatted. Cadet programmes carry a <strong>35–45% washout rate</strong> because they select on academic scores rather than operational aptitude. The airline never knows what it lost. The pilot never understands why. The asymmetry is total — and the infrastructure to close it does not exist anywhere in the industry.</p>
            </div>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">Pain Points for Airlines:</h4>
          <ul className="space-y-2 mb-6">
            {([
              { n: '1', t: 'HR Paralysis: High Volume, Zero Quality', d: <><strong>500+ applications per opening</strong>, majority unqualified. Sorting consumes HR resources with <strong>no automated pre-filtering</strong> in place.</> },
              { n: '2', t: 'Static, outdated data', d: <>CVs submitted are <strong>months or years old</strong>; hours, ratings, and <strong>medical status are unknown</strong> and unverifiable at point of receipt.</> },
              { n: '3', t: 'Poor profile matching, scoring, and pre-qualification', d: <><strong>Aptitude and competency alignment</strong> remain unknown until the interview stage — the costliest point in the hiring cycle to discover a mismatch. Airlines have <strong>no automated scoring or matching layer</strong> to rank candidates against their own requirements before interviews are scheduled. Pre-qualification assessments, where they exist, are built against <strong>outdated job posts</strong> — requirements that have not been updated since the original posting went live. The result: candidates are assessed against criteria that <strong>no longer reflect what the airline actually needs</strong>, and high-value pilots are rejected while mismatched candidates advance. There is no live, dynamic matching between <strong>verified pilot profiles and current operator requirements</strong>.</> },
              { n: '4', t: 'The Agency Compromise: Delegating Quality for Capacity', d: <>Airlines <strong>delegate recruitment to third-party agencies</strong> not because they want to — but because they simply <strong>do not have the internal capacity</strong> to process the volume of applications themselves. This delegation introduces a critical quality gap: agencies are incentivised to fill positions, not to find the best fit. <strong>Background checks, license verification, and data handling</strong> require manual export/import across disconnected systems — creating delays, duplication, and compliance risk at every handoff. The deeper cost is invisible: a <strong>flight instructor with 15 years of experience</strong>, 6,000 hours, and an exceptional competency record can be passed over entirely — not because they are unqualified, but because <strong>no system surfaced them</strong>. Agencies work from volume, not depth. High-value profiles that do not conform to standard CV formats, or that sit outside the agency's immediate search criteria, are <strong>systematically missed</strong>. The airline never knows what it lost.</> },
              { n: '5', t: 'Unpredictable pipelines and job board dependency', d: <>Airlines rely on job boards as their primary distribution channel — platforms that are <strong>nothing more than a place to push a post and pull in unfiltered responses</strong>. Job boards have <strong>no aviation background, no understanding of pilot qualifications</strong>, and no ability to distinguish a 200-hour student from a 10,000-hour captain. They are generic infrastructure being used for a highly specialised, safety-critical profession. Meanwhile, <strong>most experienced pilots actively disregard job boards</strong> — they prefer networking, direct industry connections, and submitting interest through professional channels. Applying via a generic job board feels transactional and beneath the profession. <strong>Submitting interest is professional. Applying to a job post is not.</strong> The result: airlines post on job boards, the best pilots never see it, and the pipeline fills with volume instead of quality. There is <strong>no visibility into qualified candidate pools</strong> until a posting goes live. Airlines react to vacancies rather than managing a <strong>proactive, pre-verified pipeline</strong> — and the job board model structurally prevents that from ever changing.</> },
              { n: '6', t: 'High washout rates and the cadet program chokehold', d: <><strong>35–45% of hired pilots</strong> fail to complete training or leave within 12 months — a direct consequence of <strong>poor pre-hire alignment</strong> between candidate profile and operator expectations. Cadet programmes across the region — including <strong>zero-to-hero streams</strong> — accept candidates with no prior flight experience, no aviation presence, and no demonstrated aptitude for the environment. Aviation is <strong>not a desk job and not a degree you can study your way through</strong>. Ground knowledge and flight performance are two entirely different capabilities — a student who has read every textbook will never carry the same weight as a flight instructor with real hours and real decisions behind them. <strong>A ground instructor and a flight instructor are not the same role.</strong> When airlines select cadets without flight background, they are making a costly assumption about trainability. Many burn out or wash out mid-training — not from lack of effort, but from a fundamental <strong>mismatch between academic performance and operational reality</strong>. Compounding this is the industry's accelerating shift to <strong>Evidence-Based Training (EBT)</strong> — a paradigm that moves the question from <em>"Can you fly the plane?"</em> to <em>"Are you mentally capable of handling the situation?"</em> Airlines are now facing cohorts of pilots who were trained under old standards and are <strong>unprepared for EBT assessment frameworks</strong>. The industry has a chokehold on who gets access and who gets selected — and the current selection model is producing the wrong outcomes. <strong style={{color:'#dc2626'}}>With initial type rating and line training costs often exceeding $30,000 per cadet, a 40% washout rate is a multi-million dollar annual bleed for a mid-sized carrier.</strong></> },
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
              { n: '12', t: 'The next generation of aviation-heritage pilots is declining', d: <>
              <p className="mb-3">Some of the most naturally capable pilots the industry will ever see are <strong>never entering it</strong>. Pilots with a hereditary aviation background — sons and daughters of captains, engineers, mechanics, and aviation professionals who grew up around aircraft, who understood the industry from childhood — are being <strong>actively advised by their own parents not to pursue aviation</strong>. Not because they lack the aptitude. Not because they lack the passion. But because the pilots who built their careers in this industry have <strong>watched it from the inside</strong> — and what they have seen is an industry with no clear entry pathway, no stability, no structured recognition for what you build, and a <strong>near-impossible career start</strong> that demands $50,000–$100,000 in training investment with no guarantee of a return. A captain who spent 30 years flying tells their child: <em>"Don't do what I did. There is no path."</em> That is not a recruitment problem. <strong>That is a structural failure of the entire industry ecosystem.</strong> The talent pipeline is not just clogged — it is being actively discouraged at the source. The most informed voices in aviation — the professionals who know it best — are steering the next generation away. Every aviation family that redirects their child toward a more stable profession represents <strong>a permanent loss to the industry's future capacity.</strong></p>
              <p className="mb-3">On the other side — and this is where the damage is most severe — is the pilot with <strong>no aviation background whatsoever</strong>. No family in the industry. No insider knowledge. No one to tell them what they are walking into. These pilots blindly trust their flight school. They are told they will graduate and get into the airlines. They are not told about the 1,500-hour gap, the six-month airline application process, or that the flight instructor teaching them is himself still waiting after 15 years. They are not told that their $50,000 CPL will make them a <strong>low-timer with no placement pathway</strong>. They believe the brochure. They take the loan. And when concerns are raised — by peers, by industry voices, by the data — many enter a state of <strong>denial</strong>, convincing themselves that their $50,000 investment is secured, that the stories of pilots stuck without placement are someone else's problem, and that <strong>it simply could not happen to them</strong>. It does. Evidently and consistently, every pilot who graduates with a licence is labelled the same thing regardless of how much they spent or how hard they trained: <strong>a low-timer</strong>. The investment does not change the label. The hours do not lie. And the industry does not make exceptions. <strong>Approximately 80% of pilots entering the industry without an aviation heritage background fall into this void</strong> — no real expectations, no real industry knowledge, no structured guidance. When the reality hits — no airline call, no pathway, mounting debt, no direction — many are left in <strong>detrimental financial ruin</strong>. The flight school took the fees. The industry took the years. <strong>Nobody gave them the truth.</strong> These are not failed pilots. These are pilots who were failed by a system with no transparency and no accountability for the gap between what training promises and what the industry delivers.</p>
              <p className="mb-3">A structural turning point that accelerated this collapse was the <strong>2013 implementation of the 1,500-hour rule</strong> in the United States — a regulatory response to safety incidents that overnight doubled the minimum flight hours required for airline first officers from 250 to 1,500. The intent was safety. The consequence was a <strong>dramatic contraction of the entry pipeline</strong>. Training costs doubled. The time to reach airline eligibility extended by years. Pilots who had structured their careers, their finances, and their expectations around the 250-hour pathway were left stranded mid-investment. The rule shifted the talent landscape permanently — <strong>making commercial aviation inaccessible to a significant portion of the population</strong> who cannot sustain the financial burden of building 1,500 hours. The industry did not respond with infrastructure, guidance, or financial support. It simply raised the bar and left pilots to figure it out. The result is a <strong>generational loss of talent, money, and potential</strong> at the base of the pipeline — a collapsing foundation that the industry's shortage forecasts acknowledge in aggregate but have never addressed at the individual level. PilotRecognition exists to close that gap — with <strong>real expectations, real requirements, and a real pathway from day one.</strong></p>
              <p><em>The shortage is not a lack of pilots. It is a lack of recognition infrastructure. That is what we are building.</em></p>
            </> },
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
            { heading: 'Integration', items: ['ATS API connection — Greenhouse, Workday, and ATLAS-compatible', 'PilotRecognition does not replace your ATS — it supercharges it with pre-verified, ATLAS-compliant pilot data', 'GDPR/PDPA-compliant data flow', 'No manual export or re-entry — verified pilot data flows directly into your existing hiring infrastructure'] },
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
                  { tier: 'Enterprise', fee: '$1,000/yr', features: <><strong style={{color:'#dc2626'}}>Unlimited pulls</strong> from the verified pilot database · Full EBT score access and custom EBT development · <strong style={{color:'#dc2626'}}>Direct ATS API integration — Greenhouse, Workday, and ATLAS-compatible</strong> · <strong>No manual export or re-entry</strong> — verified pilot data flows directly into your existing hiring infrastructure · Dedicated account support · Bulk pathway management.</> },
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

          <div className="bg-amber-50 border border-amber-400 rounded-lg px-5 py-4 mb-6">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">⚠ Admin Review — Pricing Restructure (Standby, Not Live)</p>
            <p className="text-slate-700 text-sm leading-relaxed mb-3">The following enterprise pricing restructure has been proposed and is pending internal review before any live update. <strong>Do not update the public pricing table until reviewed and approved.</strong></p>
            <div className="bg-white border border-amber-200 rounded px-4 py-3 text-sm text-slate-700">
              <p className="font-bold text-slate-900 mb-2">Proposed: Enterprise / OEM Tier — $1,000/month ($12,000/year)</p>
              <ul className="space-y-1">
                <li className="flex gap-2"><span className="text-amber-500 flex-shrink-0">→</span><span><strong>Platform Access Fee:</strong> $1,000/month — positions as infrastructure access, not data purchase. Removes procurement friction at major enterprise accounts (Airbus, Boeing, major airline groups).</span></li>
                <li className="flex gap-2"><span className="text-amber-500 flex-shrink-0">→</span><span><strong>Includes:</strong> Unlimited pathway listings, full verified pilot database access, API integration with ATS (Workday, Taleo, Greenhouse), dedicated account support, enterprise SLA.</span></li>
                <li className="flex gap-2"><span className="text-amber-500 flex-shrink-0">→</span><span><strong>Verification Consumption:</strong> Standard $50 transaction fee per identity pull — charged only when the pilot actively taps APPROVE to release their cryptographic proof. No data is sold. Fee covers infrastructure compute and API transit.</span></li>
                <li className="flex gap-2"><span className="text-amber-500 flex-shrink-0">→</span><span><strong>Legal framing:</strong> Monthly access fee reinforces that the platform charges for infrastructure, not data — strengthening the Joint Controller legal position under enterprise DPA review.</span></li>
                <li className="flex gap-2"><span className="text-amber-500 flex-shrink-0">→</span><span><strong>Current fee:</strong> $1,000/yr — below enterprise procurement thresholds, creates pricing credibility gap vs. tier. Current $1,000/yr moves to SME operator tier upon restructure.</span></li>
              </ul>
            </div>
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

          <div className="my-6 px-5 py-4 border-l-4 border-amber-400 bg-amber-50 rounded-r-lg">
            <p className="text-slate-800 text-sm font-bold mb-2">The Underwriter Handshake — Risk Distinction for Insurers and Airlines</p>
            <p className="text-slate-700 text-sm leading-relaxed mb-2">By making incident history — gear-up landings, failed checkrides during training, hull loss involvement — a <strong>consent-based data point</strong> within the pilot's Professional Standing Asset, the platform enables a direct handshake with Pillar 9 (Aviation Insurance). Underwriters can segment the pilot pool by verified risk profile rather than relying on hours alone as a proxy for safety.</p>
            <p className="text-slate-700 text-sm leading-relaxed mb-2">The consequence for operators is significant: a <strong>300-hour pilot with a flawless, fully verified training record</strong> — no incidents, no failed checkrides, consistent EBT performance — is now a quantifiably lower insurance risk than a 5,000-hour pilot whose last background refresh was three years ago. Pillar 11's Continuous Monitoring provides insurers with a live risk pulse on every verified pilot on the platform. This is the data infrastructure that finally breaks the 1,500-hour wall as the default hiring threshold — not by lowering standards, but by replacing a blunt hour-count with a verified competency and risk profile.</p>
            <p className="text-slate-700 text-sm leading-relaxed"><strong>For airlines:</strong> hiring a lower-hour, high-integrity verified pilot can translate directly into improved underwriting terms on your hull and liability coverage. The pilot's risk profile is no longer invisible — it is structured, verified, and portable.</p>
          </div>

          <div className="my-6 px-5 py-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
            <p className="text-slate-800 text-sm leading-relaxed mb-2"><strong>Verification Cost Advantage for Airlines:</strong> Pilots on the platform self-verify their own credentials at account creation — identity, license, medical, employment history — stored in a portable digital wallet they own. When a pilot submits interest against your pathway, their core verification is <strong>already done.</strong> You are not paying to re-run checks you don't need.</p>
            <p className="text-slate-800 text-sm leading-relaxed mb-2">What you <em>can</em> optionally request — at your cost, on selected candidates only — are the <strong>airline-specific deeper checks</strong> that go beyond what a pilot self-verifies: criminal background (jurisdiction-specific), right-to-work validation, aviation security vetting, incident and insurance history, conduct records. These are operator-initiated, pilot-consented, and fully configurable per role.</p>
            <p className="text-slate-800 text-sm leading-relaxed"><strong>The saving:</strong> Stop paying to verify applicants who aren't viable. On a traditional model, a pilot applying to 5 airlines generates 5 separate full background checks — each starting from zero, each taking 2–4 weeks, each billed to a different airline. On this platform, the pilot's core verification is <strong>already complete and portable</strong>. <strong style={{color:'#dc2626'}}>Pay only for the Layer 2 deep-checks on your verified shortlist. Not on every applicant. Not from scratch. Not repeatedly.</strong></p>
          </div>

          <hr className="my-10 border-slate-300" />

          <h2 id="pillar-2-cargo-freight" className="text-4xl font-bold text-slate-900 mt-12 mb-6 pb-4 border-b-2 border-slate-900 scroll-mt-24">
            PILLAR 2: CARGO &amp; FREIGHT OPERATORS
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub A — Aviation Operators &amp; Training Organizations</p>

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
          <p className="text-slate-700 leading-relaxed mb-4">One important distinction: many experienced instructors fly light twins — King Airs, Senecas, light multi-engine — not heavy jets. The platform maps the <strong>full cargo career track</strong>, not just a single entry point. Instructors with 5,000+ hours on light multi-engine match immediately against <strong>feeder and regional cargo operators</strong> (ATR72F, C208, C-130 variants) — building the heavy jet command time that mainline cargo operators require (B777F, B747F, B767F). The progression is structured and visible on the platform: <em>feeder cargo → regional freight → mainline heavy jet</em>. For the first time, a 5,000-hour instructor can see not just one cargo door — but the entire staircase.</p>
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
              { n: '5', t: "The 'Backside of the Clock' Attrition", d: <>One of cargo's most expensive and preventable problems: a pilot accepts a role, flies the first month of night operations, and quits. Not because they lack capability — but because <strong>nobody told them upfront that 60–80% of their flying would be overnight.</strong> Because cargo pathway requirements are unpublished, operators receive applications from pilots who are fundamentally unsuited to the lifestyle. The platform forces transparency on roster patterns before interest is submitted. <strong>Pilots who hate night flying simply won't apply</strong> — removing the most common source of early washout before it costs the operator a single training dollar.</> },
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
                  { tier: 'Enterprise', fee: '$1,000/yr', features: <><strong style={{color:'#dc2626'}}>Unlimited pulls</strong> from the verified cargo pilot database · Cargo-specific CBTA assessment access (night ops 20%, autonomous decision-making 25%) · <strong style={{color:'#dc2626'}}>Direct ATS API integration — Greenhouse, Workday, and ATLAS-compatible</strong> · <strong>No manual export or re-entry</strong> — verified pilot data flows directly into your existing hiring infrastructure · Dedicated account support · Bulk pathway management.</> },
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
          <p className="text-slate-600 text-sm mb-6"><strong>Success Fee:</strong> $500 per confirmed hire (waived for first 10 hires)</p>

          <div className="my-6 px-5 py-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
            <p className="text-slate-800 text-sm leading-relaxed mb-2"><strong>Verification Cost Advantage for Cargo Operators:</strong> Pilots on the platform self-verify their own credentials at account creation — identity, license, medical, employment history, night hours, and heavy jet time — stored in their portable Professional Standing Asset. When a pilot submits interest against your cargo pathway, their core verification is <strong>already done.</strong> You are not paying to re-run checks you don't need.</p>
            <p className="text-slate-800 text-sm leading-relaxed mb-2">What you can optionally request — at your cost, on selected candidates only — are the <strong>cargo-specific deeper checks</strong>: criminal background (jurisdiction-specific), right-to-work validation, aviation security vetting, and conduct records. Operator-initiated, pilot-consented, fully configurable per role.</p>
            <p className="text-slate-800 text-sm leading-relaxed"><strong>The saving:</strong> Stop paying to verify applicants who aren't viable. On a traditional model, each operator runs a full background check from scratch — weeks of delay, per candidate, per airline. On this platform, the pilot's core verification is <strong>already complete and portable</strong>. <strong style={{color:'#dc2626'}}>Pay only for the Layer 2 deep-checks on your verified shortlist. Not on every applicant. Not from scratch. Not repeatedly.</strong></p>
          </div>

          <hr className="my-10 border-slate-300" />

          <h2 id="pillar-3-charter-business" className="text-4xl font-bold text-slate-900 mt-12 mb-6 pb-4 border-b-2 border-slate-900 scroll-mt-24">
            PILLAR 3: CHARTER &amp; BUSINESS AVIATION
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub A — Aviation Operators &amp; Training Organizations</p>

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
              { t: 'Discretion and confidentiality track record', d: 'Flight instructors and professional pilots operate under implicit confidentiality obligations with every student and passenger. Charter operators need pilots who understand discretion as a professional default — not a policy they have to be trained on. The Professional Standing Asset (Pillar 11) surfaces specific verifiable discretion markers: documented NDA compliance history, absence of social media policy violations confirmed by previous employers, and an unblemished VIP conduct record — the exact signals a VVIP operator or private family office aviation manager needs before an approach is made.' },
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
          {[
            { heading: 'Operator Identity', items: ['Aircraft type, fleet size, operational base', 'Client sector: corporate, HNWI, government, private family office'] },
            { heading: 'Deployment Requirements', items: ['Engagement type: Full-Time Permanent / Long-Term Contract / Short-Term Contract (trip-by-trip)', 'Timeline expectations and standby availability requirements', 'Contractual terms and notice period expectations', 'Pop-up trip sourcing — operator can flag the profile as open to short-notice contract deployment'] },
            { heading: 'Pilot Profile Requirements', items: ['Hours minima: total time, command time, jet time, multi-engine', 'Type ratings required or preferred', 'Insurance & Owner Mandates — e.g. specific Time-in-Type minimums beyond simply holding the rating; underwriter-specified hour thresholds; aircraft owner non-negotiable criteria', 'Language requirements, presentation standards', 'NDA micro-credentials and VIP conduct record expected'] },
            { heading: 'Compensation Structure', items: ['Base salary, per diem, trip allowances, retention bonuses', 'Contract day rates for short-term engagements', 'Benchmark comparison against sector average'] },
            { heading: 'Culture & Lifestyle Transparency', items: ['Scheduling pattern, trip duration, layover frequency', 'Client interaction level and confidentiality obligations', 'Crew culture and operating environment'] },
          ].map((section) => (
            <div key={section.heading} className="mb-4">
              <p className="text-slate-700 font-semibold mb-1">{section.heading}:</p>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                    <span className="text-slate-400 mt-1 flex-shrink-0">•</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

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
                  { tier: 'Enterprise', fee: '$1,000/yr', features: <><strong style={{color:'#dc2626'}}>Unlimited confidential pathway listings</strong> · Full Recognition+ pilot database access · Recognition Score, jet hours, and command time data · <strong style={{color:'#dc2626'}}>Direct ATS API integration — Greenhouse, Workday, and ATLAS-compatible</strong> · <strong>No manual export or re-entry</strong> — verified pilot data flows directly into your existing hiring infrastructure · NDA-enforced placement protocol · Dedicated account support.</> },
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
          <div className="my-6 px-5 py-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
            <p className="text-slate-800 text-sm leading-relaxed mb-2"><strong>Verification Cost Advantage for Charter Operators:</strong> Every Recognition+ pilot who reaches your pathway card has already self-verified their identity, license, medical, employment history, jet time, and command hours — stored in their portable Professional Standing Asset. When a matched pilot surfaces in your results, their core verification is <strong>already done.</strong> You are not paying to run checks on a candidate you haven’t even spoken to yet.</p>
            <p className="text-slate-800 text-sm leading-relaxed mb-2">What you can optionally request — at your cost, on selected candidates only — are the <strong>charter-specific deeper checks</strong>: criminal background, security vetting, right-to-work validation, conduct records, and NDA compliance history. Operator-initiated, pilot-consented, fully configurable.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 mb-3">
              <div className="bg-red-100 border border-red-300 rounded px-4 py-3 text-sm">
                <p className="font-bold text-red-700 mb-2">Executive Search Firm</p>
                <p className="text-red-800 mb-1">20% of first-year salary <strong>= $40,000</strong> (on a $200k Captain role)</p>
                <p className="text-red-700 mb-1">+ 60–90 day lead time</p>
                <p className="text-red-700 mb-1">+ No pre-verification — full background check still required on top</p>
                <p className="text-red-700 mb-1">+ If pilot leaves in under 12 months: <strong>$40,000 burned, process restarts</strong></p>
                <p className="font-bold text-red-800 mt-2 pt-2 border-t border-red-300">Total cost to hire: <strong>~$40,000+</strong></p>
              </div>
              <div className="bg-green-50 border border-green-300 rounded px-4 py-3 text-sm">
                <p className="font-bold text-green-700 mb-2">PilotRecognition Enterprise</p>
                <p className="text-green-800 mb-1">$1,000/yr flat — unlimited placements, all sectors</p>
                <p className="text-green-700 mb-1">+ Instant ELT match — pre-verified Recognition+ pool</p>
                <p className="text-green-700 mb-1">+ ~$12 Layer 2 deep-check on your final shortlist candidate</p>
                <p className="text-green-700 mb-1">+ $500 success fee per confirmed placement</p>
                <p className="font-bold text-green-800 mt-2 pt-2 border-t border-green-300">Total cost to hire: <strong>$1,512</strong> — same day</p>
              </div>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed italic mb-2">The Director of Aviation takes this comparison to the CFO: <em>"I can get you a pre-vetted, background-checked Gulfstream Captain tomorrow and save you $38,488 on the placement fee."</em> The CFO signs the $1,000 subscription on the spot.</p>
            <p className="text-slate-800 text-sm leading-relaxed"><strong style={{color:'#dc2626'}}>Pay only for the Layer 2 deep-checks on your verified shortlist. Not on every applicant. Not from scratch. Not repeatedly.</strong></p>
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
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub A — Aviation Operators &amp; Training Organizations</p>

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

          <h2 id="pillar-5-flight-training" className="text-4xl font-bold text-slate-900 mt-12 mb-6 pb-4 border-b-2 border-slate-900 scroll-mt-24">
            PILLAR 5: FLIGHT TRAINING ORGANIZATIONS (ATOs)
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub B — Training &amp; Transition</p>

          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">I. Executive Overview: The Informational Disconnect</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Flight Training Organizations (ATOs) are tasked with producing qualified pilots, while operators are tasked with recruiting them. Currently, these two entities operate in informational isolation. This structural gap generates measurable industry-wide friction, including elevated candidate washout rates, extended hiring timelines, and misaligned capital investment.</p>
          <p className="text-slate-700 leading-relaxed mb-4">Currently, flight school graduation is a purely transactional event: hours are logged, examinations are passed, and paper certificates are issued. However, there is no structured recognition of the pilot's operational readiness, no verified connection to active employment pathways, and no digital infrastructure linking the graduation event to the broader aviation ecosystem.</p>
          <p className="text-slate-700 leading-relaxed mb-6">Pillar 5 addresses this inefficiency. It establishes a structured partnership framework for ATOs, connecting graduates to verified operator pathways, publishing audited placement outcomes, and embedding professional development programs directly into the transition phase. The institution ceases to be a terminal training environment and becomes an integrated node in a verifiable career trajectory.</p>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">II. Systemic Challenges of Operational Isolation</h3>
          <p className="text-slate-700 leading-relaxed mb-5">This section outlines the operational and commercial inefficiencies currently facing independent flight training institutions, and how integration with the PilotRecognition framework resolves these structural deficits.</p>
          <ul className="space-y-4 mb-8">
            {([
              {
                n: '1',
                t: 'Graduate Placement Visibility and Institutional Reputation',
                d: <>Extended periods of post-graduation unemployment result in negative reputational feedback loops. In a highly connected digital landscape, unplaced graduates deter prospective enrollment. By connecting graduates to a verified Professional Standing Asset and a live pathway comparison on graduation day, the ATO transitions from a primary training provider to a career facilitator. A graduate who is actively tracking toward a verified operator pathway remains a positive institutional outcome in progress.</>
              },
              {
                n: '2',
                t: 'Inefficiencies in Student Acquisition and Verification',
                d: <>Standard marketing expenditures yield diminishing returns when prospective students and their financial sponsors demand objective, verifiable outcome data over traditional promotional materials. Institutions that fail to provide audited placement data risk market skepticism. Platform integration serves as an objective customer acquisition strategy, allowing independently verified outcomes to validate institutional efficacy.</>
              },
              {
                n: '3',
                t: 'Transition Friction and Resource Capacity Constraints',
                d: <>Institutions frequently experience capacity constraints when graduates transition into instructor roles to accumulate flight hours but lack a visible pathway to commercial operators. This delays student throughput and limits instructional capacity. By providing instructors with visible, structured pathways to Cargo (Pillar 2) and Charter (Pillar 3) operators, the platform accelerates their industry transition, opening capacity for subsequent enrollment cycles.</>
              },
              {
                n: '4',
                t: 'Financial Underwriting and Credit Risk Exposure',
                d: <>Financial institutions are increasingly applying strict risk-assessment models to unsecured aviation training loans. When employment outcomes are statistically opaque, underwriting risk increases, resulting in elevated default rates and loan denials. The platform provides the structured data layer required by financial institutions to assess graduate placement probability, optimizing loan approval rates for students attending Recognition-Ready ATOs.</>
              },
            ] as { n: string; t: string; d: React.ReactNode }[]).map((item) => (
              <li key={item.n} className="ml-0 text-slate-700 leading-relaxed flex items-start gap-3 border border-slate-200 rounded-lg px-5 py-4 bg-white">
                <span className="text-red-500 font-bold text-base flex-shrink-0 mt-0.5">{item.n}.</span>
                <span><strong style={{color:'#dc2626'}}>{item.t}</strong><br /><span className="text-sm leading-relaxed">{item.d}</span></span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">III. The Structural Disconnect: Training Output vs. Operator Assessment</h3>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-3 font-semibold">Institutional Deliverable</th>
                  <th className="text-left px-4 py-3 font-semibold text-red-400">Operator Assessment Standard</th>
                  <th className="text-left px-4 py-3 font-semibold" style={{color:'#34d399'}}>PilotRecognition Infrastructure</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { a: 'Accumulation of flight hours', b: 'Behavioral patterns and decision-making', c: 'EBT video scoring and competency assessment' },
                  { a: 'Standardized checkrides passed', b: 'Simulator performance and CRM depth', c: 'CBTA-aligned assessment preparation' },
                  { a: '"Achieve minimum hours"', b: 'Specific operator pathway alignment', c: 'Gap analysis and pathway targeting' },
                  { a: 'General resume guidance', b: 'ATLAS-formatted, ATS-parseable CVs', c: 'ATLAS formatting and ATS system compatibility' },
                  { a: 'Fundamental manual flying skills', b: '9 Core EBT Competencies', c: 'Competency framework and industry alignment' },
                  { a: 'Paper graduation certificate', b: 'Verified professional identity', c: 'Recognition Profile & Day One Recognition' },
                ].map((row, i) => (
                  <tr key={row.a} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-100">{row.a}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-red-400">{row.b}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">IV. Programs: Extracurricular Professional Development</h3>
          <p className="text-slate-700 leading-relaxed mb-4">PilotRecognition Programs function as supplemental frameworks that operate alongside standard regulatory flight training. They address the operational gap between technical licensing and professional readiness.</p>
          <p className="text-slate-700 leading-relaxed mb-4">For flight instructors, these Programs provide a structured On-the-Job Training (OJT) framework focusing on the core competencies of effective instruction: <strong>Behaviourism</strong> (reinforcement of procedural responses), <strong>Cognitivism</strong> (situational awareness and aeronautical decision-making), and <strong>Constructivism</strong> (experience-based problem solving). These metrics are formally recognized, assessed, and verified as portable professional credentials.</p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Program</th>
                  <th className="text-left px-4 py-2 font-semibold">Individual Pilot</th>
                  <th className="text-left px-4 py-2 font-semibold">Campus Integration</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { prog: 'Foundation Program ($49)', pilot: 'Self-enrollment available', campus: 'Bulk campus licenses for graduating classes' },
                  { prog: 'Transition Program ($299)', pilot: 'Designed for final-semester students', campus: 'Integrated into final semester curriculum' },
                  { prog: 'EBT Video Scoring (Bundled)', pilot: 'Recorded assessment included', campus: 'Facilitated through campus assessment center partnerships' },
                ].map((row, i) => (
                  <tr key={row.prog} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">{row.prog}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.pilot}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.campus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-6">
            <span className="text-red-500 text-lg">↗</span>
            <p className="text-sm text-slate-700">
              <strong>Read More:</strong> These Programs are architected as part of the broader <a href="#pillar-foundation-program" className="text-red-600 hover:underline font-semibold">Foundational Program framework (Hub F)</a>, which establishes the 9 Core EBT Competencies and ATLAS Recognition standards referenced throughout this section.
            </p>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">Core Value Additions</h4>
          <ul className="space-y-2 mb-6">
            {([
              { t: 'Professional Identity Development', d: 'Enhancing communication and behavioral profiles prior to operator assessment.' },
              { t: 'Industry Alignment', d: 'Familiarization with EBT and CBTA competency frameworks and ATLAS Aviation CV formatting.' },
              { t: 'Verified Competency Portfolio', d: 'Mentorship tracking, behavioral assessment scores, and digital credentials permanently stored in the pilot\'s Professional Standing Asset.' },
            ] as {t: string; d: React.ReactNode}[]).map((item) => (
              <li key={item.t} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong style={{color:'#dc2626'}}>{item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4 mb-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Further Reading — Interconnected Framework</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <a href="#pillar-foundation-program" className="flex items-center gap-2 text-slate-700 hover:text-red-600 transition-colors">
                <span className="text-slate-400">→</span>
                <span><strong>Hub F:</strong> Foundational Program Architecture & EBT Methodology</span>
              </a>
              <a href="#pillar-6-type-rating" className="flex items-center gap-2 text-slate-700 hover:text-red-600 transition-colors">
                <span className="text-slate-400">→</span>
                <span><strong>Pillar 6:</strong> Type Rating & Simulator Center Partnerships</span>
              </a>
              <a href="#pillar-11-verification" className="flex items-center gap-2 text-slate-700 hover:text-red-600 transition-colors">
                <span className="text-slate-400">→</span>
                <span><strong>Pillar 11:</strong> Background Checks & Verification Providers</span>
              </a>
              <a href="#pillar-1-commercial-airlines" className="flex items-center gap-2 text-slate-700 hover:text-red-600 transition-colors">
                <span className="text-slate-400">→</span>
                <span><strong>Pillar 1:</strong> Operator Assessment Standards & Pathway Alignment</span>
              </a>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">V. Verified Issuers: The Digital Credential Standard</h3>
          <p className="text-slate-700 leading-relaxed mb-4">To eliminate document fraud and parsing errors, Enterprise ATOs are designated as <strong>Verified Issuers</strong>. These institutions are authorized to issue cryptographically signed digital tokens directly into a graduating pilot's Professional Standing Asset (Pillar 11). These credentials are immutable, operator-readable, and instantly verifiable.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {[
              { token: '"CPL-Complete" Token', desc: 'Confirms theoretical and practical completion to the issuing ATO\'s published standard. Visible to all operators in Hub A.' },
              { token: '"AAM-Ready" Token', desc: 'Issued for graduates completing emerging aviation modules, signaling readiness for eVTOL and autonomous systems (Pillar 4).' },
              { token: 'Operator-Specific Token', desc: 'Issued when curriculum is co-developed with a specific operator, confirming exact alignment with their pathway requirements.' },
            ].map((item) => (
              <div key={item.token} className="border border-slate-200 rounded-lg px-4 py-4 bg-white">
                <p className="font-bold text-slate-900 mb-2" style={{color:'#dc2626'}}>{item.token}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 bg-slate-100 border border-slate-200 rounded-lg px-4 py-3 mb-6">
            <span className="text-slate-500 text-lg">↗</span>
            <p className="text-sm text-slate-700">
              <strong>Read More:</strong> The verification infrastructure, background check orchestration, and credential validation framework is detailed in <a href="#pillar-11-verification" className="text-red-600 hover:underline font-semibold">Pillar 11: Background Checks & Verification Providers</a>.
            </p>
          </div>

          <div className="border border-slate-200 rounded-lg px-6 py-5 mb-8 bg-slate-50">
            <p className="text-xs uppercase tracking-wide font-semibold text-slate-500 mb-3">The Issuers Platform (Backend Infrastructure)</p>
            <p className="text-slate-800 text-sm leading-relaxed mb-3">PilotRecognition hosts the necessary decentralized architecture on behalf of the institution. The Enterprise ATO dashboard allows administrators to:</p>
            <div className="border-l-4 border-slate-400 pl-4 mb-4 bg-slate-100 py-3 pr-3 rounded-r">
              <p className="text-slate-700 text-xs font-semibold uppercase tracking-wide mb-1">Backend Foundation — Level 1 Baseline</p>
              <p className="text-slate-700 text-sm leading-relaxed">The credential tokens issued through this platform are anchored to the <strong>Level 1 baseline</strong> — the ground-truth data layer produced in direct cooperation with <strong>governing aviation authorities</strong> (GCAA, CASA, CAA, FAA, EASA and regional equivalents) and <strong>Authorised Medical Examiners (AMEs)</strong> for medical validity confirmation. Every signed token is traceable back to a regulatory source — not a self-reported claim, but a credential chain that begins at the authority that issued the licence and the examiner that certified the medical.</p>
            </div>
            <ul className="space-y-2 mb-4">
              {[
                'Define authorized credential types — CPL-Complete, AAM-Ready, or custom operator-specific designations',
                'Issue signed digital tokens to individual graduates or bulk-issue to graduating cohorts',
                'View the live status of every credential issued via an immutable audit trail',
                'Revoke credentials if standard compliance is retroactively compromised',
              ].map((item) => (
                <li key={item} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                  <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-slate-700 text-sm leading-relaxed"><strong>Issuance is included in the Enterprise ATO tier.</strong> The school does not pay per credential issued. They pay for the account — and the issuance infrastructure is part of what that account delivers.</p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">VI. Data Sovereignty: The Pilot-Owned Professional Record</h3>
          <p className="text-slate-700 leading-relaxed mb-4">A fundamental operational principle of the PilotRecognition infrastructure is <strong>data sovereignty</strong>. The platform functions as a neutral conduit — not a data controller. All verified credentials, training hours, competency assessments, and professional standing metrics are cryptographically bound to the individual pilot's wallet and remain under exclusive pilot ownership.</p>
          <p className="text-slate-700 leading-relaxed mb-4">PilotRecognition does not aggregate, monetize, or transfer pilot data to third parties. Enterprise ATOs, commercial operators, financial institutions, and regulatory bodies may only access specific credential elements when the pilot explicitly authorizes such disclosure via cryptographically signed consent. This architecture ensures that:</p>
          <ul className="space-y-2 mb-5">
            {[
              'The pilot maintains absolute discretion over which institutions may view their verified training history',
              'ATO-issued credentials remain portable across the ecosystem, independent of any single platform or institutional gatekeeper',
              "Data portability is enforced by cryptographic architecture, not contractual terms -- the pilot's private keys control access",
              'No institutional partner, including PilotRecognition itself, can unilaterally modify, revoke, or restrict access to verified credentials',
            ].map((item) => (
              <li key={item} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 mt-1 flex-shrink-0">•</span>
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mb-6">
            <p className="text-sm text-slate-600 italic">This structural neutrality ensures that ATOs participate in a credentialing ecosystem where the pilot — not the platform, not the flight school, and not the airline — retains ultimate authority over their professional identity.</p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">VII. The Verification Node: ATOs as Trusted Data Sources</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Current third-party background check providers lack the capacity to verify accumulated flight hours. PilotRecognition establishes ATOs as <strong>Verification Nodes</strong> — trusted institutional sources that mathematically confirm their own graduates' training hours directly within the platform.</p>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-6 rounded-r">
            <p className="text-white text-sm leading-relaxed mb-2"><strong style={{color:'#f87171'}}>Standard Verification Protocol</strong></p>
            <ol className="space-y-1 text-slate-300 text-sm">
              {[
                'Pilot registers and selects the affiliated ATO',
                'Pilot executes explicit digital consent for hour verification',
                'The ATO receives a verification prompt in the administrative dashboard',
                'The ATO confirms or amends the logged hours',
                'A "Verified Training Hours" credential is automatically minted to the pilot\'s wallet',
                'The ATO is permanently displayed as the issuing authority',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">VIII. Legal Implications of Verification Node Participation</h3>
          <p className="text-slate-700 leading-relaxed mb-4">By participating as a Verification Node, ATOs assume <strong>cryptographic liability</strong> for every attestation issued. Each "Verified Training Hours" credential is cryptographically signed by the institution, creating an immutable, legally traceable bond between the ATO and the data accuracy.</p>

          <div className="bg-red-50 border border-red-200 rounded-lg px-5 py-4 mb-5">
            <p className="text-xs font-bold text-red-700 uppercase tracking-widest mb-3">Falsification Liability Under Sequential Accountability Protocol</p>
            <p className="text-sm text-slate-700 mb-3">If an ATO falsifies training hours, competency assessments, or graduation records, disputes may be initiated by:</p>
            <div className="space-y-2 text-sm text-slate-700">
              <p><strong>Commercial Operators (Airlines):</strong> When a pilot washes out during type rating or line training due to skills deficiencies that should have been identified during initial training, the operator may initiate liability proceedings tracing back to the issuing ATO.</p>
              <p><strong>Other Operators (Cargo/Charter):</strong> When placement data reveals systematic discrepancies between ATO-reported competency and actual operational performance.</p>
              <p><strong>Individual Pilots:</strong> When falsified records result in career damage — failed checkrides, employment termination, or regulatory enforcement due to training deficiencies not reflected in verified credentials.</p>
              <p><strong>Financial Institutions:</strong> When training loans default due to unqualified graduates failing to secure employment because credential inflation misrepresented competency levels.</p>
              <p><strong>Regulatory Authorities (Civil Aviation Authorities / CAAs):</strong> When a pilot fails regulatory examinations (e.g., CPL checks conducted by Civil Aviation Authorities) and must return to the flight school for remedial training, exposing the ATO's initial competency certification as premature or inaccurate. The authority may hold the ATO accountable for certifying pilots who were not examination-ready.</p>
            </div>
          </div>

          <p className="text-slate-700 leading-relaxed mb-4"><strong>The Liability Pathway:</strong> Under the Sequential Accountability Protocol, disputes originating from any of these parties traverse through the verification chain:</p>
          <div className="bg-slate-900 rounded-lg px-5 py-4 mb-5 text-sm font-mono">
            <div className="space-y-1 text-slate-300">
              <p><span className="text-emerald-400">Dispute Origin:</span> Operator/Individual/Financial Institution/Regulatory Authority</p>
              <p><span className="text-slate-500">→</span> <span className="text-amber-400">$500-2,000</span> Platform routing and attestor identification</p>
              <p><span className="text-slate-500">→</span> <span className="text-amber-400">$1,000-3,000</span> Verification provider record retrieval</p>
              <p><span className="text-slate-500">→</span> <span className="text-amber-400">$1,500-4,000</span> <span className="text-red-400 font-bold">ATO as Originating Attestor (Pillar 5)</span></p>
            </div>
            <p className="text-slate-400 mt-3 pt-3 border-t border-slate-700">The ATO is <span className="text-red-400 font-bold">Level 4</span> in the liability chain — the originating attestor bearing ultimate responsibility for training record accuracy.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4 mb-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Example: Regulatory Examination Failure Chain</p>
            <p className="text-sm text-slate-700 mb-2">When a pilot fails regulatory authority examinations (e.g., Civil Aviation Authority CPL checks) and returns to the flight school for remedial training:</p>
            <div className="space-y-1 text-sm text-slate-700">
              <p><strong>1. Regulatory Authority:</strong> Documents examination failure, identifies pilot as ATO graduate</p>
              <p><strong>2. Authority Database:</strong> Links failure to issuing ATO's certification records</p>
              <p><strong>3. Platform Layer:</strong> Routes inquiry to Verification Node (issuing ATO) per cryptographic signature</p>
              <p><strong>4. Flight School (ATO):</strong> Must account for competency certification issued prior to examination</p>
            </div>
            <p className="text-sm text-slate-700 mt-3 pt-3 border-t border-slate-200"><strong>Result:</strong> The ATO that issued the "examination-ready" certification becomes the liable party for any costs associated with remedial training, re-examination fees, and career delays.</p>
          </div>

          <p className="text-slate-700 leading-relaxed mb-4"><strong>Legal Consequences of Falsification:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-slate-700 mb-5 ml-4">
            <li><strong>Contractual Breach:</strong> Violation of Verification Node Agreement warranting data accuracy</li>
            <li><strong>Regulatory Reporting:</strong> Aviation authorities may be notified of credential fraud under ATO certification obligations</li>
            <li><strong>Platform Exclusion:</strong> Permanent revocation of Verified Issuer status and removal from Recognition-Ready ATO listings</li>
            <li><strong>Reputational Damage:</strong> Immutable audit trail of revoked credentials permanently visible to all ecosystem participants</li>
            <li><strong>Financial Liability:</strong> Cost recovery for downstream losses (failed type ratings, employment termination, loan defaults)</li>
            <li><strong>Criminal Liability:</strong> Potential fraud charges under aviation regulatory frameworks for systematic credential falsification</li>
          </ul>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-5 py-4 mb-6">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-2">The Protection: Cryptographic Immutability</p>
            <p className="text-sm text-slate-700">While the liability exposure is significant, the cryptographic architecture also <strong>protects honest ATOs</strong>. Once a credential is issued, it cannot be forged or falsely attributed. The digital signature proves the credential originated from the ATO's authorized issuance infrastructure. This creates evidentiary clarity — either the ATO issued the credential (accepting liability) or the credential is fraudulent (absolving the ATO). There is no ambiguity in cryptographic attestation.</p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">IX. The Collective Bargaining Engine: Cross-Border Model</h3>
          <p className="text-slate-700 leading-relaxed mb-4">The platform leverages collective demand to optimize credential acquisition for pilots in developing aviation markets requiring globally recognized certifications (e.g., GCC Authority standards).</p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Component</th>
                  <th className="text-left px-4 py-2 font-semibold">Standard Protocol</th>
                  <th className="text-left px-4 py-2 font-semibold text-red-400">Platform Bulk Cohort (10+ Pilots)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { c: 'Training Rate', s: '18,000 AED per pilot', b: '10,000 AED per pilot (44% cost reduction)' },
                  { c: 'Visa Coordination', s: 'Individual processing', b: 'Centralized visa and logistical coordination included' },
                  { c: 'Systemic Outcome', s: 'High capital barriers to international credentialing', b: 'Reduced capital barriers with structured international training cohorts' },
                ].map((row, i) => (
                  <tr key={row.c} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">{row.c}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.s}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-red-400 font-semibold">{row.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">IX. The Ecosystem Revenue-Share Model</h3>
          <p className="text-slate-700 leading-relaxed mb-4">To align institutional incentives with ecosystem adoption, PilotRecognition employs a structured revenue-share framework for Enterprise ATOs. The platform recognizes that institutions serve as the primary onboarding nodes for the next generation of verified pilots.</p>
          <p className="text-slate-700 leading-relaxed mb-4">Rather than functioning solely as a software expenditure, the Enterprise tier is designed to achieve cost-neutrality and subsequent profitability for the institution through an <strong>Ecosystem Dividend</strong>.</p>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">The Financial Mechanism</h4>
          <ul className="space-y-2 mb-5">
            {[
              'For every graduating student who transitions onto the platform and activates a Recognition+ profile, the issuing ATO receives a $20 ecosystem dividend (referral distribution).',
              'The Enterprise access fee is fixed at $1,000 annually.',
              'Cost-Neutrality: An institution graduating just 50 participating students per year generates $1,000 in dividends, effectively zeroing out the platform access cost.',
              'Net-Revenue Generation: Any graduate volume beyond the 50-student threshold transitions the platform from an operational expenditure into a net-revenue generator for the school (e.g., 300 graduates yield $6,000 in ecosystem dividends against a $1,000 fixed cost, resulting in a 500% ROI).',
            ].map((item) => (
              <li key={item} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 mt-1 flex-shrink-0">•</span>
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>

          <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4 mb-6">
            <p className="text-sm text-slate-600 leading-relaxed">This framework ensures that the ATO is financially incentivized to maintain high-quality instruction, graduate throughput, and Day One Recognition onboarding, permanently aligning the school's commercial interests with the pilot's professional visibility.</p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">X. Commercial Tiers and Access Structures</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Tier</th>
                  <th className="text-left px-4 py-2 font-semibold">Annual Fee</th>
                  <th className="text-left px-4 py-2 font-semibold">Included Capabilities</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tier: 'Basic', fee: 'Free', features: 'Profile publication in the training directory. Graduate linkage enabled. No tracking, analytics, or Verification Node status.' },
                  { tier: 'Analytics', fee: '$500/yr', features: 'Graduate tracking dashboard. Visibility into pathway alignment and outcome metrics. Audited placement rate verification and publication.' },
                  { tier: 'Enterprise', fee: '$1,000/yr (+ $20/referral)', features: 'Direct CRM integration. Cryptographic token issuance (Verified Issuer). Verification Node status. Co-branded graduation credentials.' },
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

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">XI. Strategic Integrations: Systemic Benefits of ATO Participation</h3>
          <p className="text-slate-700 leading-relaxed mb-4">The integration of an ATO into the PilotRecognition ecosystem creates multi-pillar efficiencies, transitioning the institution from an isolated facility into a highly connected infrastructural node.</p>
          <ul className="space-y-2 mb-6">
            {[
              { n: '1', t: 'Centralized Airline Pipeline Standardization', d: 'As commercial operators mandate verified PilotRecognition credentials for application processing, partnered ATOs ensure uninterrupted pathway access for their student cohorts.' },
              { n: '2', t: 'Data-Backed Financial Underwriting (Pillar 10)', d: 'Providing financial institutions with verified placement data optimizes the approval algorithms for unsecured pilot training loans, securing student enrollment capital.' },
              { n: '3', t: 'Public Registry Discoverability', d: 'Verified placement metrics algorithms prioritize transparent ATOs in public searches, structurally disadvantageous to unverified institutions.' },
              { n: '4', t: 'Actuarial Risk Mitigation (Pillar 12)', d: 'Utilization of EBT tracking and digital compliance logs provides insurance underwriters with granular safety data, establishing the basis for targeted hull and liability premium reductions.' },
              { n: '5', t: 'Regulatory Audit Automation (Pillar 13)', d: 'Cryptographic hour tracking and token issuance generate immutable digital ledgers, drastically reducing the administrative burden of civil aviation authority compliance audits.' },
              { n: '6', t: 'Graduate Recurrency Lifecycle Management', d: 'Targeted platform notifications allow ATOs to seamlessly offer simulator preparation sessions to alumni when specific operator pathways open.' },
              { n: '7', t: 'Cross-Border Regulatory Verification', d: 'Verified placement metrics serve as objective institutional proof for foreign embassies, streamlining international student visa approvals.' },
              { n: '8', t: 'Cryptographic Verification and Liability Mitigation', d: 'Decentralized token issuance prevents downstream logbook falsification, actively shielding the institution from secondary liability.' },
              { n: '9', t: 'Competency Standardization', d: 'Continuous EBT metric monitoring allows Chief Flight Instructors to detect and correct internal grading bias in real time.' },
              { n: '10', t: 'Instructor Transition Optimization (Pillars 2 & 3)', d: 'Senior instructional staff are systematically surfaced to Cargo and Charter operators, maintaining healthy operational throughput.' },
              { n: '11', t: 'Civil-Military Transition Pathways (Pillar 8)', d: 'Platform algorithms route government-funded military veterans exclusively to Recognition-Ready ATOs to execute precise civilian conversion requirements.' },
              { n: '12', t: 'Macro-Level Fleet Intelligence (Pillar 15)', d: 'Access to predictive OEM fleet delivery schedules provides financial officers with the macro-data required to optimize capital expenditure on simulator acquisitions.' },
              { n: '13', t: 'Live Aeromedical Status Sync (Pillar 13)', d: 'Real-time integration with aeromedical examiner data automates dispatch compliance, preventing solo operations by students with expired certifications.' },
            ].map((item) => (
              <li key={item.n} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">{item.n}.</span>
                <span><strong style={{color:'#dc2626'}}>{item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <div className="bg-slate-100 border border-slate-300 rounded-lg px-5 py-4 mb-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Ecosystem Interconnection Map</p>
            <p className="text-sm text-slate-700 mb-3">The Strategic Integrations listed above span multiple Hubs and Pillars, demonstrating how ATO participation creates network effects across the entire framework:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <a href="#pillar-1-commercial-airlines" className="flex items-center gap-1.5 text-slate-600 hover:text-red-600 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                <span><strong>Pillar 1</strong> — Airlines</span>
              </a>
              <a href="#pillar-2-cargo-charter" className="flex items-center gap-1.5 text-slate-600 hover:text-red-600 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                <span><strong>Pillar 2</strong> — Cargo/Charter</span>
              </a>
              <a href="#pillar-3-business-aviation" className="flex items-center gap-1.5 text-slate-600 hover:text-red-600 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                <span><strong>Pillar 3</strong> — Business Aviation</span>
              </a>
              <a href="#pillar-8-military-conversion" className="flex items-center gap-1.5 text-slate-600 hover:text-red-600 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                <span><strong>Pillar 8</strong> — Military Conversion</span>
              </a>
              <a href="#pillar-10-financial" className="flex items-center gap-1.5 text-slate-600 hover:text-red-600 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                <span><strong>Pillar 10</strong> — Financial</span>
              </a>
              <a href="#pillar-12-insurance" className="flex items-center gap-1.5 text-slate-600 hover:text-red-600 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                <span><strong>Pillar 12</strong> — Insurance</span>
              </a>
              <a href="#pillar-13-medical-ame" className="flex items-center gap-1.5 text-slate-600 hover:text-red-600 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                <span><strong>Pillar 13</strong> — Medical/AME</span>
              </a>
              <a href="#pillar-15-manufacturers" className="flex items-center gap-1.5 text-slate-600 hover:text-red-600 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                <span><strong>Pillar 15</strong> — OEMs</span>
              </a>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">XII. The Accountability Protocol and Institutional Requirements</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Verified Issuer status and the Recognition-Ready designation are maintained through continuous alignment with established operational baselines. The platform functions as an objective evaluation framework, ensuring that credential standards remain consistent with current industry requirements.</p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4 mb-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">The Continuous Alignment Protocol</p>
            <p className="text-slate-700 text-sm leading-relaxed">The platform operates on a framework of continuous quality assurance, designed to ensure that Partner ATOs consistently represent the highest echelon of pilot production. Every 12 months, the platform conducts a data-driven evaluation of institutional placement rates and graduate EBT competency outcomes.</p>
            <p className="text-slate-700 text-sm leading-relaxed mt-3"><strong>Multi-Source Reporting Architecture:</strong> The assessment is executed through algorithmic aggregation of independently submitted ecosystem reports rather than platform-conducted verification. Annual institutional eligibility is determined through convergent data streams from: (a) commercial operators submitting verified placement outcomes via API; (b) financial institutions reporting graduate loan performance and credit outcomes (Pillar 10); (c) insurance underwriters documenting actuarial risk metrics and incident data (Pillar 12); (d) regulatory authorities flagging compliance events or certification actions (Pillar 13); and (e) graduate pilots providing employment outcome confirmations through their Credential Wallets. The platform functions exclusively as a neutral aggregation and communication layer — mathematically compiling third-party attestations and routing verification outcomes to relevant stakeholders without independent verification or judgment. When background check providers (Pillar 11), regulatory authorities (Pillar 13), or other ecosystem participants identify data anomalies, they utilize the platform's infrastructure to communicate findings directly to affected parties (institutions, pilots, operators). The platform does not originate these determinations; it serves as the secure conduit through which third-party verification outcomes are transmitted. This distributed reporting architecture ensures that no single entity, including the platform itself, exercises unilateral authority over institutional standing.</p>
            <p className="text-slate-700 text-sm leading-relaxed mt-3"><strong>The Universal Annual Report:</strong> On a 12-month cycle, the platform generates a consolidated Institutional Standing Report synthesizing all ecosystem data streams. This report is algorithmically distributed to relevant stakeholders: the subject institution, prospective students querying the training directory, commercial operators reviewing pipeline partners, financial institutions assessing underwriting risk, and regulatory bodies monitoring market integrity. The platform does not determine eligibility — it transparently publishes the convergent data picture and allows ecosystem participants to make informed determinations. Institutions maintaining positive standing across all reporting vectors retain Recognition-Ready status. Persistent negative divergence across multiple independent reporting sources triggers automatic suspension protocols, executed without platform discretion or administrative intervention.</p>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">Minimum Institutional Provisions</h4>
          <ul className="space-y-2 mb-4">
            {[
              { t: 'Essential', items: ['Submission to transparent, platform-audited placement statistics and participation in curriculum-to-pathway mapping.'] },
              { t: 'Preferred', items: ['Integration of mentorship hour tracking and the allocation of merit-based scholarship capacities.'] },
              { t: 'Strategic', items: ['Co-development of EBT-aligned curriculum modules and beta-testing of automated Day One Recognition onboarding.'] },
            ].map((section) => (
              <div key={section.t} className="mb-4">
                <p className="text-slate-700 font-semibold mb-1">{section.t}:</p>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                      <span className="text-slate-400 mt-1 flex-shrink-0">•</span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">XIII. Institutional Activity and Systemic Maintenance Criteria</h3>
          <p className="text-slate-700 leading-relaxed mb-4">To preserve the analytical integrity and operational utility of the network, the platform enforces automated parameters governing active institutional status. The ecosystem requires that all designated entities maintain continuous, verifiable training activity to ensure that operator pipelines, financial underwriting models, and regulatory compliance data remain accurate and dynamic.</p>
          <p className="text-slate-700 leading-relaxed mb-4">Rather than relying on manual or administrative interventions, the infrastructure utilizes objective data metrics to evaluate systemic participation and maintain network equilibrium.</p>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">1. Telemetry Verification and Operational Continuity</h4>
          <p className="text-slate-700 leading-relaxed mb-4">The platform ingests real-time operational data via integrated flight data monitoring (FDM) telemetry and automatic dependent surveillance-broadcast (ADS-B) systems. A prolonged absence of verified flight or simulator activity triggers an automated data-integrity notification. Continued structural inactivity over a predetermined observation window results in an automated administrative pause of the institution's network interface.</p>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">2. Statistical Deficits under the Continuous Alignment Protocol</h4>
          <p className="text-slate-700 leading-relaxed mb-4">As outlined in Section XII, institutions are required to undergo a data-driven evaluation every 12 months. An inability to generate audited placement metrics, standardized EBT competency portfolios, or verified training hour tokens due to operational cessation or insufficient throughput constitutes a non-compliance baseline.</p>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">3. Automated System Deactivation and Node Isolation</h4>
          <p className="text-slate-700 leading-relaxed mb-4">Upon failure to meet minimum telemetry or alignment thresholds, the platform automatically deactivates the institution's Verified Issuer credentials and suspends its profile within the training registry. This automated isolation ensures that:</p>
          <ul className="space-y-2 mb-4 ml-6">
            <li className="text-slate-700 leading-relaxed flex items-start gap-2">
              <span className="text-slate-400 mt-1 flex-shrink-0">•</span>
              <span className="text-sm">Commercial operator recruitment pipelines remain unencumbered by inactive data nodes.</span>
            </li>
            <li className="text-slate-700 leading-relaxed flex items-start gap-2">
              <span className="text-slate-400 mt-1 flex-shrink-0">•</span>
              <span className="text-sm">Prospective student capital is systematically directed toward operationally active training providers.</span>
            </li>
            <li className="text-slate-700 leading-relaxed flex items-start gap-2">
              <span className="text-slate-400 mt-1 flex-shrink-0">•</span>
              <span className="text-sm">Institutional verification metrics remain reliable assets for financial and actuarial underwriters within the network.</span>
            </li>
          </ul>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">4. Ecosystem Standardization</h4>
          <p className="text-slate-700 leading-relaxed mb-4">The programmatic exclusion of inactive or non-verifiable operations ensures that the Recognition-Ready designation represents active compliance with global aviation benchmarks. By verifying that every registered institution maintains active operational parameters and consistent graduate throughput, the framework guarantees the validity of all downstream credential chains entering the commercial aviation marketplace.</p>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">XIV. Subsidiary Program Classification and Deactivation Mechanics</h3>
          <p className="text-slate-700 leading-relaxed mb-4">The platform evaluates data metrics at the distinct operating certificate and institutional level. If a primary academy manages multiple entities, subsidiary registries, or satellite programs, the network monitors each operational node independently.</p>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">1. Independent Telemetry Validation per Air Operator Certificate (AOC)</h4>
          <p className="text-slate-700 leading-relaxed mb-4"><strong>The Baseline Parameter:</strong> The ingestion engine requires consistent transponder signals via integrated flight tracking systems (ADS-B) and verified flight data logs.</p>
          <p className="text-slate-700 leading-relaxed mb-4"><strong>The System Reaction:</strong> If a registered operational name logs zero flight activity over a rolling observation window (e.g., standard audit protocol intervals), the system isolates that specific node. Legacy brand association or parent infrastructure backing does not exempt a non-operational entity from data flatline flags.</p>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">2. Automated Token Invalidation for Inactive Entities</h4>
          <p className="text-slate-700 leading-relaxed mb-4">When an entity exhibits a prolonged operational baseline deficit, it is systematically restricted from injecting credentials into the network.</p>
          <p className="text-slate-700 leading-relaxed mb-4"><strong>Privilege Revocation:</strong> The platform automatically disables the Verified Issuer credentials associated with that specific entity registration.</p>
          <p className="text-slate-700 leading-relaxed mb-4"><strong>Pipeline Protection:</strong> This deactivation prevents an inactive entity from functioning as a passive or administrative vehicle for logging unverified or non-standard hours. By halting token minting capabilities, the system protects commercial operator databases from stale data entries.</p>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">3. Verification Mapping and Public Status Transparency</h4>
          <p className="text-slate-700 leading-relaxed mb-4">To prevent informational asymmetry for prospective student capital, the platform enforces absolute data transparency on the public registry interface.</p>
          <p className="text-slate-700 leading-relaxed mb-4"><strong>Status Update:</strong> Inactive programs automatically transition to Operational Interface: Paused or Active Telemetry: Non-Verifiable.</p>
          <p className="text-slate-700 leading-relaxed mb-4"><strong>Ecosystem Impact:</strong> This transparent status rendering ensures that airline sourcing pipelines, credit rating agencies (Pillar 14), and prospective applicants are immediately aware of the operational capacity limits of that specific program, independent of local market positioning or institutional legacy.</p>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">XV. Technical Mitigation of Anomalous Reporting Patterns</h3>
          <p className="text-slate-700 leading-relaxed mb-4">To guarantee the persistent reliability of the global talent pipeline, the platform's ingestion layer operates under an automated adversarial data-validation framework. The architecture assumes the presence of variable data quality and non-standard administrative reporting patterns. Rather than initiating manual investigation protocols, the system utilizes cross-pillar telemetry audits to systematically intercept and neutralize non-compliant data generation at the point of origin.</p>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">1. Predictive Discrepancy Isolation (The Telemetry Mirror)</h4>
          <p className="text-slate-700 leading-relaxed mb-4">The platform is engineered to detect structural data manipulations—specifically, the administrative practice of retroactively logging operational flight hours without corresponding aircraft utilization.</p>
          <p className="text-slate-700 leading-relaxed mb-4"><strong>The Mechanism:</strong> The platform's ingestion engine runs continuous, asynchronous comparisons between institutional dispatch logs, student wallet submissions, and global ADS-B transponder tracking registries.</p>
          <p className="text-slate-700 leading-relaxed mb-4"><strong>The System Realignment:</strong> If an institutional account attempts to execute a manual flight-hour validation (verify_hours = TRUE) that lacks a corresponding, real-time physical transponder track matching the exact tail number, altitude variance, and chronological window, the entry is automatically blocked. The system does not issue an administrative warning; it logs a Systemic Telemetry Anomaly token against the institution's permanent compliance score.</p>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">2. Cryptographic Anti-Spoofing Protocols (The Localized Capture Standard)</h4>
          <p className="text-slate-700 leading-relaxed mb-4">The framework accounts for potential attempts to subvert visual verification requirements—including the utilization of pre-recorded media, localized GPS spoofing, or administrative data-sharing overrides.</p>
          <p className="text-slate-700 leading-relaxed mb-4"><strong>The Mechanism:</strong> The portable user interface utilizes hardware-enforced cryptographic boundaries. Optical capture data (Hobbs and tachometer meter recordings) must bypass local storage directories entirely, hashing directly to the network ledger with live atomic timestamps and network-validated cellular triangulation data.</p>
          <p className="text-slate-700 leading-relaxed mb-4"><strong>The System Realignment:</strong> Any attempt to inject file metadata that exhibits an operational variance from verified atomic time or localized cellular tower handoffs triggers an immediate administrative hold on the affected credential chain. The software structurally prevents the duplication or recycling of a single flight data log across multiple student profiles, neutralizing the practice of double-logging single operational sequences.</p>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">3. Decentralized Verification Decoupling (The Regulatory Bypass Shield)</h4>
          <p className="text-slate-700 leading-relaxed mb-4">The platform addresses the historical vulnerability of localized administrative interference, where institutional pressure or external relationships are applied to regulatory personnel or individual students to manually override license and hour compliance states.</p>
          <p className="text-slate-700 leading-relaxed mb-4"><strong>The Mechanism:</strong> Under the Level 1 Baseline and Data Sovereignty provisions, the platform decouples verification authority. An individual pilot's Professional Standing Asset is controlled exclusively by their unique cryptographic keys, and the global hiring pipeline is governed by Hub A (Operator Sourcing Mandates).</p>
          <p className="text-slate-700 leading-relaxed mb-4"><strong>The System Realignment:</strong> Because international commercial operators query the network ledger via automated API endpoints, local physical document overrides or manual regulatory certifications carry no weight within the platform's matching engine. If the digital credential chain lacks the multi-source telemetry validation from the source node, the profile remains algorithmically non-discoverable to the hiring marketplace. External administrative protection of a underperforming or non-verifiable asset is rendered systemically irrelevant.</p>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">4. Legacy Fleet Verification Protocol (Non-Telemetry Aircraft)</h4>
          <p className="text-slate-700 leading-relaxed mb-4">The platform recognizes that substantial primary flight training occurs on legacy aircraft equipped with analog instrumentation and lacking integrated ADS-B transponder capabilities (e.g., Cessna 152, Cessna 150, Cessna 172). These aircraft constitute a significant portion of the global training fleet and require alternative verification methodologies that maintain data integrity standards without mandating prohibitively expensive avionics retrofits.</p>

          <p className="text-slate-700 leading-relaxed mb-4"><strong>The Mechanism:</strong> For non-telemetry aircraft, the platform implements a multi-source data reconciliation protocol utilizing pilot-initiated verification workflows, third-party flight management platform integrations, and cryptographic documentation standards.</p>

          <p className="text-slate-700 leading-relaxed mb-4"><strong>Primary Verification Pathways:</strong></p>
          <ul className="space-y-2 mb-4 ml-6">
            <li className="text-slate-700 leading-relaxed flex items-start gap-2">
              <span className="text-slate-400 mt-1 flex-shrink-0">•</span>
              <span className="text-sm"><strong>Integrated Flight Data Management:</strong> Pilots utilizing third-party digital logbook platforms (e.g., FL.io, FlightLogger) may establish API data bridges allowing direct ingestion of verified flight entries into the Professional Standing Asset. These entries carry platform-verified timestamps and are cross-referenced with institutional dispatch records when available.</span>
            </li>
            <li className="text-slate-700 leading-relaxed flex items-start gap-2">
              <span className="text-slate-400 mt-1 flex-shrink-0">•</span>
              <span className="text-sm"><strong>Chronological Instrument Capture:</strong> For aircraft lacking digital data export capabilities, the platform mandates photographic verification of primary flight instruments. Pilots execute optical capture of Hobbs meter or tachometer readings at engine start and shutdown, with cryptographic hashing binding the image to live atomic timestamps, GPS coordinates, and cellular triangulation data.</span>
            </li>
            <li className="text-slate-700 leading-relaxed flex items-start gap-2">
              <span className="text-slate-400 mt-1 flex-shrink-0">•</span>
              <span className="text-sm"><strong>Recognition+ Data Table Integration:</strong> Subscribers to the Recognition+ tier gain access to structured data table functionality within their Credential Wallet, enabling manual entry of flight parameters (tail number, departure/arrival aerodromes, flight duration, PIC/Dual breakdown) with institutional countersignature workflows. These entries require ATO verification node confirmation before minting to the ledger.</span>
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4"><strong>The System Realignment:</strong> Legacy aircraft verification operates under adjusted confidence scoring algorithms that weight multi-source documentation against available telemetry correlations. When an aircraft within an institutional fleet lacks ADS-B capability, the platform requires enhanced photographic verification frequency and cross-references with instructor validation tokens. This ensures that training hours accumulated on analog aircraft receive equivalent verification rigor to glass-cockpit platforms, preserving credential integrity across the entire training ecosystem.</p>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">XVI. Digital Logbook Partnership Strategy: The Regional Aggregator Model</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Legacy digital logbook providers (LogTen Pro, ForeFlight, capzlog.aero, FlightLogger, FLYLOG.io) view PilotRecognition as a highly viable strategic integration partner — not a competitive threat. These platforms function as data capture tools; PilotRecognition functions as the verification and marketplace infrastructure layer. Their roles are complementary and non-overlapping.</p>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-5 py-4 mb-5">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3">The Value Proposition for Logbook Providers</p>
            <div className="space-y-2 text-sm text-slate-700">
              <p><strong>Turning Dead Data into Career Utility:</strong> Digital logbooks currently function as advanced spreadsheet storage. By building API data bridges to PilotRecognition, logbook platforms transition from passive storage vaults to active career drivers. Pilots logging hours can instantly push verified entries to their Professional Standing Asset, matching with real-time airline hiring tracks.</p>
              <p><strong>Fighting Churn Post-Hiring:</strong> Logbook providers struggle to retain users after employment. PilotRecognition solves this by giving pilots a reason to maintain their logbook — the data feeds their verified credential wallet and hiring profile. Pilots who leave an employer keep their logbook active because their career assets depend on it.</p>
            </div>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">1. The Technical Integration Loop</h4>
          <p className="text-slate-700 leading-relaxed mb-4">Instead of competing to build a mobile logbook app, PilotRecognition leverages existing digital logbook platforms as frontend data ingestion nodes:</p>
          <div className="bg-slate-900 rounded-lg px-5 py-4 mb-5 text-sm font-mono">
            <div className="space-y-1 text-slate-300">
              <p><span className="text-emerald-400">Step 1:</span> Pilot records flight block time in their preferred logbook platform</p>
              <p><span className="text-emerald-400">Step 2:</span> Logbook platform packages entry and transmits via API to pilot's cryptographically secured PilotRecognition Wallet</p>
              <p><span className="text-emerald-400">Step 3:</span> Entry runs through Legacy Fleet Verification Protocol — timestamp validation, GPS log cross-reference, ATO Verification Node countersignature</p>
              <p><span className="text-emerald-400">Step 4:</span> Verified hours mint as cryptographically signed tokens in pilot's Professional Standing Asset</p>
            </div>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">2. The Regional Partnership Map</h4>
          <p className="text-slate-700 leading-relaxed mb-4">Pilot logbook preferences are highly regionalized due to local regulatory formats (EASA, FAA, CASA, UK CAA) and platform ecosystem preferences (iOS vs. Android). A single global partnership would limit growth. Instead, PilotRecognition adopts a regionalized multi-provider aggregator strategy:</p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Region</th>
                  <th className="text-left px-4 py-2 font-semibold">Primary Partner(s)</th>
                  <th className="text-left px-4 py-2 font-semibold">Strategic Rationale</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { r: 'Europe (EASA)', p: 'capzlog.aero, Logbook.aero', s: 'First EASA AMC1 FCL.050 certified digital logbooks; massive trust with European commercial and training pilots' },
                  { r: 'Americas (FAA)', p: 'LogTen Pro, ForeFlight', s: 'Dominant US market share; deep integrations with US airline scheduling apps; iOS ecosystem lock-in' },
                  { r: 'Asia-Pacific', p: 'FLYLOG.io, FL.io', s: 'Android/web-first platforms; essential for developing markets where Apple hardware penetration is limited' },
                  { r: 'Middle East & Africa', p: 'FlightLogger, custom integrations', s: 'Multi-platform support; accommodates mixed-fleet training environments and cross-border operations' },
                ].map((row, i) => (
                  <tr key={row.r} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">{row.r}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.p}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-400">{row.s}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">3. Why Regional Differentiation Solves the Level 1 Baseline Problem</h4>
          <p className="text-slate-700 leading-relaxed mb-4">Aviation law is deeply fragmented by region. The Level 1 Baseline requires ground-truth data produced in cooperation with governing aviation authorities (FAA, EASA, GCAA, CASA, etc.). By allowing multiple regional logbook providers to plug into the API, PilotRecognition does not need to build localized regulatory compliance engines for every CAA — the regional logbook apps handle local formatting compliance, while PilotRecognition focuses on cryptographic verification and airline matching.</p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4 mb-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">The Data Ingestion Framework (Localized Path)</p>
            <div className="space-y-1 text-sm font-mono text-slate-700">
              <p>[Local Pilot Data Entry]</p>
              <p className="text-slate-400">↓</p>
              <p>[Regional Frontend Logbook] → (e.g., capzlog.aero for EASA compliance)</p>
              <p className="text-slate-400">↓</p>
              <p>[PilotRecognition Ingestion API] → (Applies Regional Regulatory Logic)</p>
              <p className="text-slate-400">↓</p>
              <p>[Pilot's Sovereign Wallet Token] → (CPL-Complete / Validated Hours)</p>
            </div>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">4. The Competitive Moat: Why Logbook Providers Won't Replicate PilotRecognition</h4>
          <p className="text-slate-700 leading-relaxed mb-4">Building a digital logbook app is straightforward. Building PilotRecognition's infrastructure is operationally complex. To replicate the platform, a logbook provider would need to:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-700 mb-5 ml-4">
            <li>Re-architect around decentralized Web3 sovereign identity frameworks</li>
            <li>Legally bind flight schools into a Sequential Accountability Protocol with cryptographic liability for falsification</li>
            <li>Convince global airlines, insurance underwriters, and medical examiners to integrate with their proprietary backend</li>
            <li>Build airline enterprise agreements and verification provider networks (Veremark, IDfy)</li>
          </ul>
          <p className="text-slate-700 leading-relaxed mb-4">Logbook providers are software companies building tools for pilots. They do not possess the network infrastructure, airline enterprise agreements, or legal protocol design that PilotRecognition has established across Pillars 1-25.</p>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">5. The Network Effect: Visa/Mastercard Model</h4>
          <p className="text-slate-700 leading-relaxed mb-4">PilotRecognition operates like Visa or Mastercard — an aggregator network that does not care which "bank" issued the card:</p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-5 py-4 mb-5">
            <p className="text-sm text-slate-700"><strong>Visa does not care which local bank issued your credit card.</strong></p>
            <p className="text-sm text-slate-700"><strong>PilotRecognition does not care which logbook app a pilot uses.</strong></p>
            <p className="text-sm text-slate-700 mt-2">As long as flight data matches Telemetry Mirror requirements and receives ATO Verification Node countersignature, it mints into the pilot's decentralized wallet regardless of origin platform.</p>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">6. Partnership Pitch Strategy to Regional Providers</h4>
          <p className="text-slate-700 leading-relaxed mb-4">When approaching legacy logbook providers, the message is partnership, not displacement:</p>
          <div className="bg-slate-900 border-l-4 border-emerald-500 px-5 py-4 mb-6 rounded-r">
            <p className="text-white text-sm leading-relaxed italic">"We are not building a digital logbook, and we are not trying to take your users. We have built the decentralized credentialing and airline recruitment marketplace infrastructure. Keep your frontend users, but plug your data pipe into our network so your pilots can turn their logged hours into verified, airline-parseable career assets."</p>
          </div>
          <p className="text-slate-700 leading-relaxed mb-4">When approaching regional players like capzlog.aero in Europe:</p>
          <p className="text-slate-700 leading-relaxed mb-4"><strong>"LogTen Pro dominates the US, but you dominate Europe. By partnering with PilotRecognition, your European pilots get direct access to global cargo, charter, and airline pipelines that require verified credentials. We aren't competing with your EASA-certified software; we are giving your users a reason never to delete your app, because their capzlog data is what feeds their hiring profile."</strong></p>
          <p className="text-slate-700 leading-relaxed mb-4">This turns regional software providers into primary user-acquisition funnels — completely free of charge to PilotRecognition.</p>

          <hr className="my-10 border-slate-300" />

          <h2 id="pillar-6-type-rating" className="text-4xl font-bold text-slate-900 mt-12 mb-6 pb-4 border-b-2 border-slate-900 scroll-mt-24">
            PILLAR 6: TYPE RATING &amp; SIMULATOR CENTERS
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub B — Training &amp; Transition</p>

          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Problem: The Most Dangerous Financial Bottleneck in a Pilot's Career</h3>
          <p className="text-slate-700 leading-relaxed mb-4">A type rating is the most expensive single purchase most pilots will ever make in their career — and it is sold without accountability. A B737 type rating costs between <strong>$20,000 and $35,000 USD</strong>. A B777 or A350 rating can exceed <strong>$50,000</strong>. These are not training investments backed by verified employment probability. They are financial commitments made blind — to simulator centres with no obligation to disclose whether a pilot actually meets the prerequisite profile the rating is designed to serve.</p>
          <p className="text-slate-700 leading-relaxed mb-4">The result is a predatory dynamic: pilots are sold ratings they are not ready for, on aircraft types they are not positioned to fly, without any transparency on which operators are actively hiring for that type, what hours profile those operators require beyond the rating, or whether the specific centre delivering the training is trusted by the airlines the pilot intends to apply to. <strong style={{color:'#dc2626'}}>The simulator centre takes the fee. The pilot takes the risk. The airline sees the rating and asks a question the pilot cannot answer: "But do you have the hours?"</strong></p>
          <p className="text-slate-700 leading-relaxed mb-6">Pillar 6 introduces <strong>ethical type rating infrastructure</strong> — a framework where simulator and type rating centres participate in the platform under a verified disclosure standard, feeding live proficiency data into pilot profiles, and publishing prerequisite requirements linked directly to operator pathway cards. <strong>No pilot buys a rating blind. No centre sells a rating irresponsibly. The chain of accountability is restored.</strong></p>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-6 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>The Ethical Selling Standard:</strong> <strong style={{color:'#f87171'}}>No advanced type rating should be sold to a pilot who does not meet the baseline prerequisite profile for the operators that rating is designed to serve.</strong> This is not a legal obligation. It is a commercial one — simulator centres that sell mismatched ratings produce washouts, generate refund disputes, and destroy the reputation that keeps their doors open. The platform enforces this standard by linking rating listings directly to operator pathway requirements. If the pilot's verified profile does not meet the prerequisite, the pathway card flags the gap before the purchase decision is made.</p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">Pain Points for Pilots</h3>
          <ul className="space-y-2 mb-6">
            {([
              { n: '1', t: 'No visibility into which ratings operators are actually hiring for', d: <>Pilots invest $20,000–$50,000 in a type rating with <strong>no structured data on which operators are actively hiring for that type, in what volume, and at what hours profile.</strong> Type rating investment decisions are made on rumour, forum posts, and sales pitches from the centres selling the course.</> },
              { n: '2', t: 'No prerequisite transparency before purchase', d: <>Simulator centres are not required to publish the <strong>full prerequisite profile</strong> an operator expects beyond the rating itself — command time minimums, recency requirements, fleet-specific hours thresholds. Pilots discover these requirements after they have paid. The rating is useless without the hours. <strong>No refund is available.</strong></> },
              { n: '3', t: 'No centre quality differentiation', d: <>Not all simulator centres are equal. Some are airline-endorsed. Some are not. Some produce candidates that consistently pass airline type-specific assessments. Some do not. <strong>This information is entirely invisible to the pilot making a $30,000 purchasing decision.</strong></> },
              { n: '4', t: 'Simulator proficiency data does not travel', d: <>A pilot\'s simulator assessment scores, grading benchmarks, and proficiency history are locked inside the simulator centre\'s internal systems. <strong>They do not appear in the pilot\'s Recognition Profile, they are not visible to operators, and they are not portable.</strong> The most relevant evidence of flight deck competency a pilot produces — their performance under pressure in a certified full-flight simulator — disappears the moment they leave the building.</> },
              { n: '5', t: 'Type rating timing decisions made without pathway context', d: <>Pilots purchase type ratings at the wrong point in their career — before they have the hours profile that makes the rating usable, or on aircraft types that no operator in their accessible geography is currently recruiting for. <strong>The platform visibility to prevent this does not currently exist.</strong></> },
            ] as { n: string; t: string; d: React.ReactNode }[]).map((item) => (
              <li key={item.n} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong style={{color:'#dc2626'}}>{item.n}. {item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">Pain Points for Type Rating &amp; Simulator Centers</h3>
          <ul className="space-y-2 mb-6">
            {([
              { n: '1', t: 'High washout rates damage commercial reputation', d: <>Centres that sell ratings to under-qualified pilots produce <strong>washout rates of 35% or higher</strong>. Every washout is a refund dispute, a negative review, and a candidate who tells every pilot they know to avoid the centre. <strong>The short-term fee generates long-term reputational damage.</strong></> },
              { n: '2', t: 'No channel into the verified pilot pipeline', d: <>Simulator centres have no structured channel into the verified, career-active pilot database. They advertise generically, compete on price, and attract unqualified enquiries. <strong>They cannot filter for pilots whose verified profile actually matches the rating they are selling.</strong></> },
              { n: '3', t: 'Simulator performance data siloed and unused', d: <>Every full-flight simulator session produces objective, measurable proficiency data — approach stability, engine-out handling, crew coordination scores. This data sits in internal systems, contributes nothing to the pilot\'s professional profile, and is invisible to airlines who would pay a premium to see it. <strong>The most valuable aviation performance data in existence is currently worthless outside the simulator bay.</strong></> },
              { n: '4', t: 'No airline-endorsement pathway', d: <>There is no structured mechanism for a simulator centre to demonstrate to airlines that their training produces superior candidates. <strong>Airline endorsement — a commercially valuable status — is entirely informal, relationship-based, and inaccessible to newer or smaller centres regardless of training quality.</strong></> },
            ] as { n: string; t: string; d: React.ReactNode }[]).map((item) => (
              <li key={item.n} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong style={{color:'#dc2626'}}>{item.n}. {item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">The Platform Solution</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Pillar 6 integrates type rating and simulator centres into the platform's verification layer — creating a <strong>two-directional data flow</strong>: operator pathway requirements flow into the pilot's gap analysis (showing exactly which type rating is needed and when), and simulator proficiency data flows out of the centre and into the pilot's Professional Standing Asset.</p>
          <ul className="space-y-2 mb-6">
            {([
              { t: 'Pathway-linked type rating listings', d: 'Each type rating listed by a centre is linked directly to the operator pathway cards in Hub A that require it. A pilot viewing a B737 type rating card sees which operators are currently hiring B737-rated pilots, the full hours profile those operators require beyond the rating, and whether their current verified profile positions them to use the rating within a realistic timeline.' },
              { t: 'Prerequisite gate enforcement', d: 'Before a pilot can access a type rating listing, the platform cross-references their verified profile against the rating\'s published prerequisites. If they do not meet the threshold, they receive a structured gap analysis — not a blocked door. The centre\'s listing flags the gap, and the platform presents the pathway to close it first. Ethical selling is built into the infrastructure.' },
              { t: 'Live simulator proficiency data integration', d: 'Centres with API integration feed verified simulator grading data directly into the pilot\'s Professional Standing Asset — approach stability scores, engine-out procedure benchmarks, EBT competency assessments. For the first time, a pilot\'s simulator performance is a live, portable, operator-visible data point in their Recognition Profile. Airlines querying the database see not just that a pilot holds a type rating — but how well they perform in a simulator under assessed conditions.' },
              { t: 'Pre-Cleared Rating program', d: 'Simulator centres that meet the platform\'s ethical selling standard, publish verified washout rates, and integrate simulator data receive "Pre-Cleared" status — an airline-endorsed designation that tells pilots the centre\'s training produces candidates operators will consider. Pre-Cleared centres command a verified premium. Pilots pay more for certainty. Operators trust the output.' },
              { t: 'Washout analytics and pilot-to-rating matching', d: 'Platform data on pilot profile type versus training washout rates enables the match algorithm to actively steer pilots toward type ratings they are most likely to complete successfully — and toward centres whose training profile most closely matches their cognitive and skills baseline. Better matching means fewer washouts. Fewer washouts means better reputation for centres and fewer $30,000 losses for pilots.' },
            ] as { t: string; d: string }[]).map((item) => (
              <li key={item.t} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong style={{color:'#dc2626'}}>{item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-2">Commercial Tiers — Simulator &amp; Type Rating Centre Access</h3>
          <p className="text-slate-700 leading-relaxed mb-6">Centres access the platform through three tiers — from pathway listing only through to full API integration, live EBT data export, and custom assessment development.</p>
          <div className="overflow-x-auto mb-6">
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
                  { tier: 'Standard', fee: '$300/mo', features: <>Type rating pathway listings published on the platform — linked to operator pathway cards. Prerequisite requirements published. Centre profile visible to pilots browsing type rating options. <span style={{color:'#dc2626'}}>No simulator data integration or washout analytics.</span></> },
                  { tier: 'Professional', fee: '$800/mo + $30/referral', features: <><strong style={{color:'#dc2626'}}>API integration</strong> — simulator grading software feeds verified EBT proficiency data directly into pilot Professional Standing Assets. Washout analytics by pilot profile type. Gap analysis tool integration — pilots matched to ratings based on verified profile alignment. Co-develop gap analysis features. <strong>$30 referral fee paid to centre</strong> for every platform-enrolled pilot who completes a type rating at their facility.</> },
                  { tier: 'Enterprise', fee: '$1,500/mo', features: <><strong style={{color:'#dc2626'}}>Custom assessment development</strong> — co-build type-specific EBT competency frameworks with the platform. Priority placement in pilot match algorithm. <strong style={{color:'#dc2626'}}>Pre-Cleared Rating status</strong> — airline-endorsed designation on centre profile and all linked type rating cards. Simulator-to-airline performance correlation research access. Industry advisory role on training standardisation.</> },
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

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">What Centres Are Required to Provide</h4>
          {[
            { t: 'Essential', items: ['Publish prerequisite requirements linked to operator pathway cards — exact hours thresholds, recency requirements, and fleet-specific criteria an operator expects beyond the rating', 'Upload verified simulator proficiency data (Professional and Enterprise tiers)', 'Participate in the ethical selling certification program — no advanced ratings sold to pilots below the published prerequisite profile'] },
            { t: 'Preferred', items: ['Co-develop Gap Analysis tool integration — help map the delta between a pilot\'s current profile and type rating readiness', 'Share training washout analytics by pilot profile type — anonymised data used to improve matching accuracy', 'Provide type rating cost-to-outcome correlation data — which ratings produce the fastest pathway to employment'] },
            { t: 'Strategic', items: ['Joint research on simulator-to-airline performance correlation — build the evidence base that links simulator proficiency scores to airline assessment outcomes', 'Beta test the Pre-Cleared Rating program — become the first airline-endorsed centres on the platform', 'Industry advisory role on training standardisation — shape the competency framework standards that the whole sector adopts'] },
          ].map((section) => (
            <div key={section.t} className="mb-4">
              <p className="text-slate-700 font-semibold mb-1">{section.t}:</p>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                    <span className="text-slate-400 mt-1 flex-shrink-0">•</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="overflow-x-auto mt-6 mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-3 font-semibold">Metric</th>
                  <th className="text-left px-4 py-3 font-semibold text-red-400">Current Industry</th>
                  <th className="text-left px-4 py-3 font-semibold" style={{color:'#34d399'}}>With Platform Integration</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { m: 'Training washout rate', curr: '35%', plat: '15% (pilot-to-rating matching)' },
                  { m: 'Price premium achievable', curr: '0% (commoditised)', plat: '+20% avg (~$5,000/rating for Pre-Cleared status)' },
                  { m: 'Enrolment uplift', curr: 'Baseline', plat: '+20–30% from verified Pre-Cleared status' },
                  { m: 'Simulator data utility', curr: 'Locked in centre systems', plat: 'Live in pilot Recognition Profile, visible to operators' },
                  { m: 'Airline endorsement', curr: 'Informal, relationship-based', plat: 'Structured Pre-Cleared program, openly verifiable' },
                ].map((row, i) => (
                  <tr key={row.m} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">{row.m}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-red-400">{row.curr}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.plat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-8 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>The airline mandate is coming.</strong> As EBT and CBTA frameworks mature, airlines will begin specifying not just that a candidate holds a type rating — but that the rating was obtained at a verified, proficiency-data-publishing centre. The centres that integrate now will be the centres airlines name on their pathway cards. <strong style={{color:'#f87171'}}>The simulator centre that owns the verified data channel owns the pilot pipeline that flows through it.</strong></p>
          </div>

          <hr className="my-10 border-slate-300" />

          <h2 id="pillar-7-military" className="text-4xl font-bold text-slate-900 mt-12 mb-6 pb-4 border-b-2 border-slate-900 scroll-mt-24">
            PILLAR 7: MILITARY &amp; DEFENSE COMMANDS
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub B — Training &amp; Transition</p>

          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Problem: The Most Qualified Pilots in the World Are Invisible to the Industry</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Military pilots are, by objective measure, among the most capable aviators on the planet. They operate high-performance aircraft in contested environments, under extreme physiological and psychological pressure, with crew resource management and decision-making frameworks that commercial aviation has been trying to replicate for decades. <strong>They graduate from military service having demonstrated, under real conditions, every competency airlines claim to assess.</strong></p>
          <p className="text-slate-700 leading-relaxed mb-4">And then they leave the service — and become invisible. Their flight hours do not translate cleanly. Their sorties do not map to civilian logbook formats. Their competency records are held in classified or semi-classified service databases that civilian operators cannot access, cannot interpret, and cannot verify. The commercial aviation industry has no structured framework for converting a decade of military flight experience into a civilian hiring decision — so it defaults to the same blunt instrument it applies to everyone else: <strong style={{color:'#dc2626'}}>total hours. How many hours do you have? Come back when you have 1,500.</strong></p>
          <p className="text-slate-700 leading-relaxed mb-6">Pillar 7 builds the translation infrastructure that has never existed. Military sorties converted to civilian EBT benchmarks. Service records securely validated and mapped to commercial competency frameworks. Discharge status verified. The result: a veteran pilot arrives on the platform not as a blank profile waiting to be rebuilt from scratch — but as a <strong>fully translated, verified, high-value candidate</strong> whose decade of military service is finally legible to the commercial operators who need exactly what they have.</p>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-6 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>The military transition problem is not a skills problem. It is a translation problem.</strong> The pilot who flew 400 combat sorties in an F/A-18 has more real-world decision-making hours under pressure than most airline captains. The industry knows this. The industry also has no mechanism to prove it, document it, or act on it. <strong style={{color:'#f87171'}}>PilotRecognition builds that mechanism.</strong></p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">Pain Points for Veteran Pilots</h3>
          <ul className="space-y-2 mb-6">
            {([
              { n: '1', t: 'Military hours do not translate to civilian logbook format', d: <>A sortie is not a flight hour. A combat mission is not an IFR approach. The civilian aviation industry has no standardised conversion framework — so military experience that represents <strong>the highest-intensity, highest-stakes flying on earth</strong> is reduced to an approximate civilian hour count that undersells the actual competency by a factor the industry has never formally measured.</> },
              { n: '2', t: 'Service records are inaccessible to civilian operators', d: <>Military flight records, competency assessments, and operational ratings are held within defence department systems that civilian HR departments cannot access. A veteran pilot cannot simply email their service record to an airline. <strong>The evidence of their competency is locked behind institutional walls the industry has no key to.</strong></> },
              { n: '3', t: 'No civilian pathway visibility during service', d: <>Active-duty pilots have limited visibility into what the commercial sector requires, what they are missing, and what transition steps to take before discharge. By the time they leave service, <strong>they are already 12–18 months behind the transition timeline that would have maximised their civilian employment options.</strong> The preparation window is lost because the pathway data was never accessible during service.</> },
              { n: '4', t: 'Type rating requirements applied without competency credit', d: <>A veteran who has thousands of hours on high-performance multi-engine jets may be required to complete a full civilian type rating course with no credit for demonstrated performance. <strong>The training industry charges full price for skills the candidate demonstrably already has.</strong> There is no structured mechanism to fast-track a military pilot's type rating based on verified prior competency.</> },
              { n: '5', t: 'The seniority reset penalty', d: <>A veteran pilot who transitions to a commercial airline starts at the bottom of the seniority list regardless of experience. <strong>A 20-year military pilot with 3,000 hours of operational flying enters as a junior First Officer.</strong> The Recognition Score model provides a portable competency currency that partially offsets this structural disadvantage — operators who use the platform can see the full verified picture, not just the new hire start date.</> },
            ] as { n: string; t: string; d: React.ReactNode }[]).map((item) => (
              <li key={item.n} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong style={{color:'#dc2626'}}>{item.n}. {item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">Pain Points for Defense Commands &amp; Military Aviation Authorities</h3>
          <ul className="space-y-2 mb-6">
            {([
              { n: '1', t: 'Talent exodus with no structured handoff', d: <>Defense commands invest millions in producing a combat-ready military aviator. When that pilot leaves service, the investment leaves with them — into an industry that cannot properly receive it. There is no structured civilian handoff process. <strong>The defence sector loses the pilot. The commercial sector fails to recognise what it received.</strong> Both sides absorb a loss that a structured transition framework would eliminate.</> },
              { n: '2', t: 'Post-service employment failure damages recruitment', d: <>Veterans who struggle to find commercial employment after service generate negative word-of-mouth within active military communities. <strong>Post-service employment outcomes directly affect military recruitment</strong> — a veteran who spent 12 months unemployed after discharge tells everyone in the mess about it. Frictionless transitions are a national defence recruitment asset.</> },
              { n: '3', t: 'No visibility into where veteran pilots land', d: <>Defense commands have no structured data on where their pilots transition to, how long transition takes, or what competency gaps cause delays. <strong>There is no feedback loop between military service and commercial employment outcomes</strong> — which means training improvements that would accelerate transition cannot be identified or implemented.</> },
            ] as { n: string; t: string; d: React.ReactNode }[]).map((item) => (
              <li key={item.n} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong style={{color:'#dc2626'}}>{item.n}. {item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">The Platform Solution — The Military Translation Layer</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Pillar 7 introduces a <strong>structured military-to-civilian competency translation framework</strong> — converting the language of military aviation into verified, operator-readable data that slots directly into the platform's recognition infrastructure.</p>
          <ul className="space-y-2 mb-6">
            {([
              { t: 'Sortie-to-hour conversion matrices', d: 'Military sorties are converted to civilian equivalent flight hours using a complexity-weighted formula — night operations, instrument conditions, multi-crew coordination, and operational intensity all contribute to the final verified equivalent. The conversion is documented, defensible, and operator-visible in the veteran\'s Recognition Profile.' },
              { t: 'EBT competency mapping', d: 'Military training outcomes are mapped directly to the 9 ICAO EBT competency benchmarks — application of knowledge, communication, flight path management, leadership and teamwork, problem-solving and decision-making, situation awareness, workload management, and more. A veteran\'s service assessment record, once translated, produces an EBT-aligned competency profile without requiring a full civilian assessment programme.' },
              { t: 'Secure service record validation', d: 'Veteran service records are validated through a secure API channel — classified-level security protocols, discharge status verification (Honourable/General Under Honourable), and flight hour attestation from defence department data sources. The data never leaves the secure channel. What enters the pilot\'s Recognition Profile is the verified output, not the raw classified record.' },
              { t: 'Veteran Fast-Track pathway cards', d: 'Dedicated pathway cards for veteran pilots — published by operators who specifically value military experience and are willing to apply expedited assessment processes for verified veteran profiles. Fast-Track cards show the reduced training requirements, type rating credit eligibility, and direct-entry Captain or Senior First Officer options available to qualifying veterans.' },
              { t: 'Pre-Service Transition Visibility', d: 'Active-duty pilots within 24 months of anticipated discharge can access the platform\'s pathway comparison tools in read-only mode — seeing exactly what civilian operators require, what gaps they need to close before discharge, and what transition pathway is optimal given their specific military background. The preparation window is restored.' },
            ] as { t: string; d: string }[]).map((item) => (
              <li key={item.t} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong style={{color:'#dc2626'}}>{item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">The ROI Case — Veterans, Operators, and the Defence Sector</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-3 font-semibold">Metric</th>
                  <th className="text-left px-4 py-3 font-semibold text-red-400">Current Reality</th>
                  <th className="text-left px-4 py-3 font-semibold" style={{color:'#34d399'}}>With Platform Translation Layer</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { m: 'Time to commercial employment post-discharge', curr: '12 months average', plat: '3 months — verified profile, fast-track pathway match' },
                  { m: 'Transition training cost', curr: '$25,000 full type rating', plat: '$12,500 — 50% reduction via verified competency credit' },
                  { m: 'Post-service employment rate', curr: '60% within 12 months', plat: '90% — structured pathway visibility and pre-discharge preparation' },
                  { m: 'Military hour recognition', curr: 'Approximate, informal, undersold', plat: 'Verified, complexity-weighted, EBT-mapped, operator-visible' },
                  { m: 'Pathway visibility during service', curr: 'None', plat: 'Read-only access from 24 months pre-discharge' },
                ].map((row, i) => (
                  <tr key={row.m} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">{row.m}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-red-400">{row.curr}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.plat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-2">Commercial Access — Defense Commands &amp; Veteran Organisations</h3>
          <p className="text-slate-700 leading-relaxed mb-6">Defense commands and veteran aviation organisations access the platform under a bespoke partnership framework — the translation infrastructure is not a product sold to veterans; it is a structural capability built in partnership with the defence institutions that produced them.</p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Partnership Type</th>
                  <th className="text-left px-4 py-2 font-semibold">Structure</th>
                  <th className="text-left px-4 py-2 font-semibold">Deliverable</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { type: 'Defense Command MOU', structure: 'Memorandum of Understanding — no fee', deliverable: 'Secure API access for service record validation. Translation matrix co-development. Pre-discharge pathway visibility for active-duty pilots within 24 months of ETS.' },
                  { type: 'Veteran Aviation Organisation', structure: 'Affiliate partner — revenue share on programme enrolments', deliverable: 'Co-branded Veteran Fast-Track pathway cards. Priority matching for verified veteran profiles. Aggregate transition outcome reporting.' },
                  { type: 'Operator — Veteran Preference', structure: 'Included in existing Enterprise operator tier', deliverable: 'Veterans filter in pilot database search. Veteran Fast-Track pathway card publishing. Expedited assessment flag on matched veteran profiles.' },
                ] as { type: string; structure: string; deliverable: string }[]).map((row, i) => (
                  <tr key={row.type} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">{row.type}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-red-400 font-semibold">{row.structure}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.deliverable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">What Defense Commands Are Required to Provide</h4>
          {[
            { t: 'Essential', items: ['Translation matrices — co-develop the sortie-to-civilian-hour conversion standards (sorties × complexity factor) that form the verified baseline for military pilot Recognition Profiles', 'Secure API validation — provide access to service record and flight hour verification infrastructure at classified-level security', 'Discharge status verification — Honourable and General Under Honourable confirmation for platform eligibility'] },
            { t: 'Preferred', items: ['Participate in Veteran Fast-Track pathway development — define the expedited assessment criteria operators should apply to verified veteran profiles', 'Share veteran employment outcome data (anonymised) — used to refine the transition model and improve pathway targeting accuracy', 'Provide introductions to veteran aviation organisations for co-branded programme deployment'] },
            { t: 'Strategic', items: ['Industry advisory role — shape the military-to-civilian competency conversion standard that the whole sector adopts', 'Beta test Pre-Service Transition Visibility — grant read-only platform access to active-duty pilots within 24 months of discharge', 'Joint research on military-to-airline performance correlation — build the evidence base that unlocks type rating credit for verified military profiles'] },
          ].map((section) => (
            <div key={section.t} className="mb-4">
              <p className="text-slate-700 font-semibold mb-1">{section.t}:</p>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                    <span className="text-slate-400 mt-1 flex-shrink-0">•</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-8 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>Every veteran pilot who leaves military service and disappears from aviation is a national failure.</strong> The defence sector trained them. The commercial sector needs them. The gap between those two facts exists only because no structured translation infrastructure has ever been built. <strong style={{color:'#f87171'}}>PilotRecognition builds it — and in doing so, keeps the most capable aviators in the industry that needs them most.</strong></p>
          </div>

          <hr className="my-10 border-slate-300" />

          <h1 id="hub-b-verification" className="text-4xl font-bold text-slate-900 mt-12 mb-2 pb-4 border-b-2 border-slate-900 scroll-mt-24">
            HUB B — VERIFICATION &amp; TRUST
          </h1>
          <p className="text-slate-500 text-sm mb-8 uppercase tracking-wide font-semibold">Credential Integrity · Background Checks · Identity Verification</p>

          <h2 id="pillar-11-verification" className="text-3xl font-bold text-slate-900 mt-8 mb-6 pb-4 border-b border-slate-300 scroll-mt-24">
            PILLAR 11: BACKGROUND CHECKS &amp; VERIFICATION PROVIDERS
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub B — Verification &amp; Trust</p>

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
          <p className="text-slate-700 leading-relaxed mb-6">Pillar 11 addresses this through a <strong>unified verification layer</strong> embedded directly into the platform — background checking as a native service, not an external chore. Pilots build a <strong>Professional Standing Asset</strong> — a verified, pilot-owned credential wallet — once. It travels with them across every operator, every regulator, and every sector. <strong>Verify once. Apply anywhere.</strong></p>

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
              { n: '1', t: 'No aviation credential taxonomy', d: 'Generic providers do not understand license classes (PPL/CPL/ATPL), type ratings, medical certificate classes, or recency requirements. Verification forms do not capture aviation-specific data fields — there is no field for hours by type, no field for rating currency, and no concept of licence validity periods tied to regulatory authority databases.' },
              { n: '2', t: 'No access to CAA, FAA, or CAAP license databases', d: 'Generic providers cannot query ICAO-member authority databases directly. They cannot confirm whether a licence is valid, suspended, or revoked with the issuing authority — CAA (UK/EASA), FAA (US), CAAP (Philippines), GCAA (UAE), or CAAS (Singapore). They rely entirely on what the pilot self-declares. There is no API connection, no authority integration, and no real-time status check against the issuing regulator.' },
              { n: '3', t: 'Medical certificate classes not understood', d: 'Aviation operates on three distinct medical certificate classes — each with different privileges, holders, and expiry windows: Class 1 (ATPL/CPL — airline and commercial operations), Class 2 (PPL — private operations), Class 3 (Air Traffic Controllers). Generic providers have no awareness of this classification system, no ability to distinguish which class a pilot holds, and no framework for tracking renewal requirements per class.' },
              { n: '4', t: 'Class 1 medical expiration cycle ignored', d: 'A Class 1 medical expires every 12 months for pilots under 40 — and every 6 months for pilots aged 40 and over. This expiry cycle is a hard flight-privilege constraint: an airline pilot with an expired Class 1 cannot legally operate as PIC regardless of their licence, hours, or type rating. Generic providers verify employment but have no awareness of medical expiry windows, no tracking of renewal status, and no mechanism for Special Issuance or waiver conditions — meaning they issue a passing verification for a pilot who may be medically ineligible to fly.' },
              { n: '5', t: 'Multi-authority licensing unaddressed', d: 'Pilots often hold licenses from multiple authorities — FAA, EASA, CAAP, GCAA — and operate under foreign licence validations or conversions depending on the jurisdiction. Generic providers check one country. They do not understand licence conversion rules, cross-border validation requirements, or which authority\'s medical standard applies when a pilot holds dual licences.' },
            ] as { n: string; t: string; d: string }[]).map((item) => (
              <li key={item.n} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong className="text-red-600">{item.n}. {item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">The Platform Solution — Unified Verification Layer</h4>
          <p className="text-slate-700 leading-relaxed mb-4">Pillar 11 integrates background checking into the platform as a native service layer. Pilots build a <strong>Professional Standing Asset</strong> — a verified, portable credential record — once, recognised across every operator, every regulator, and every sector on the platform. Airlines no longer initiate checks from scratch. They access a pre-verified profile and pull only what they need, in real time, with pilot consent.</p>
          <p className="text-slate-700 leading-relaxed mb-4">The platform acts as the <strong>central coordination hub</strong> — connecting verification providers with the full aviation ecosystem they currently have no access to: aviation insurance underwriters, aviation medical examiners, aviation authority license databases, flight training organisations, airport security authorities, and airline HR requirement matrices. Verification is no longer a disconnected snapshot. It becomes a <strong>live, portable, pilot-owned credential</strong> that compounds in value with every new clearance earned.</p>
          <p className="text-slate-700 leading-relaxed mb-8">Pilots who enrol in <strong>Recognition+</strong> receive background checking as part of their membership — eliminating the cost uncertainty, the repeat burden, and the opaque requirements that currently make verification the final hidden barrier between a qualified pilot and a confirmed offer.</p>

          <h4 className="text-lg font-bold text-slate-800 mt-8 mb-3">The Pilot-Inputted Verification Model — Why This Changes Everything</h4>
          <p className="text-slate-700 leading-relaxed mb-4">Traditional background check providers sit downstream. They are reactive — waiting for an airline or employer to initiate a check before anything happens. <strong>This model is broken for aviation.</strong> The airline triggers the check only after a pilot has already applied, already passed screening, and is already in the offer stage. The check becomes a final-stage blocker rather than a pre-qualification signal.</p>
          <p className="text-slate-700 leading-relaxed mb-4">The platform flips this. <strong>The pilot initiates their own verification — before they apply to anyone.</strong> They build a <strong>Professional Standing Asset</strong> as part of their profile, driven by their own ambition to appear pre-cleared to any operator on the platform. This is not a passive transaction. It is an active career investment.</p>
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

          <h4 className="text-lg font-bold text-slate-800 mt-8 mb-3">The Triangulated Verification Architecture</h4>
          <p className="text-slate-700 leading-relaxed mb-4">PilotRecognition operates as a <strong>neutral orchestration layer</strong>. No raw pilot data is stored on the platform. Three independent providers handle distinct verification functions — each under the pilot's explicit consent, each holding only their own data, each issuing only confirmations back to the platform.</p>

          <div className="bg-slate-900 rounded-lg px-6 py-5 mb-6 font-mono text-xs leading-relaxed overflow-x-auto">
            <p className="text-slate-400 uppercase tracking-widest mb-4 text-xs">Verification Flow — Neutral Orchestration</p>
            <pre className="text-slate-300 whitespace-pre">{`Pilot submits data + pathway consent
        ↓
┌─────────────────────────────────────────────────┐
│              PilotRecognition                   │
│           (Neutral Orchestrator)                │
│  Routes checks · Issues tokens · No raw storage │
└────────┬──────────────┬──────────────┬──────────┘
         │              │              │
         ▼              ▼              ▼
  ┌────────────┐  ┌──────────┐  ┌───────────┐
  │  Veremark  │  │   IDfy   │  │ Verepass  │
  │            │  │          │  │           │
  │ CAAP       │  │ Flight   │  │ Pilot's   │
  │ License    │  │ Hours    │  │ portable  │
  │ Identity   │  │ Confirm  │  │ verified  │
  │ Prof. Qual │  │ + Cross- │  │ credential│
  │            │  │ check    │  │ wallet    │
  └────────────┘  └──────────┘  └───────────┘
         │              │              │
         └──────────────┴──────────────┘
                        ↓
              Token issued to pilot
              Verepass record updated
              No raw data on PR platform`}</pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {([
              { provider: 'Veremark', color: '#34d399', items: ['Workflow B — verification-led, not data sourcing', 'CAAP license + Professional Qualification check at registration ($13 partner rate)', 'Identity check triggered at airline shortlist ($9 — billed to airline at $50)', '15% markup confirmed in writing by Oliver Lobb (May 16, 2026)', 'Issues Verepass record to pilot simultaneously'] },
              { provider: 'IDfy', color: '#60a5fa', items: ['Training hours confirmation — pilot-initiated, school-confirmed', 'Cross-checks Veremark result as triangulation failsafe', 'If Veremark result = IDfy result → double confirmed ✅✅', 'If mismatch → flagged for review ⚠️', 'No single point of failure — operates independently of Veremark'] },
              { provider: 'Verepass', color: '#f87171', items: ["Veremark's pilot-facing portable credential wallet", 'Issued simultaneously with every Veremark check', 'Pilot owns this record regardless of platform', 'Travels with the pilot if they leave PilotRecognition', 'Surfaced inside PR Credential Wallet via API — pilot never leaves the platform'] },
            ] as {provider: string; color: string; items: string[]}[]).map((col) => (
              <div key={col.provider} className="border border-slate-200 rounded-lg px-4 py-4 bg-white">
                <p className="font-bold mb-3 text-sm" style={{color: col.color}}>{col.provider}</p>
                <ul className="space-y-1">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                      <span className="mt-0.5 flex-shrink-0" style={{color: col.color}}>→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-8 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>The neutrality statement:</strong> <span className="text-slate-300">"PilotRecognition does not own pilot data. We are neutral infrastructure — a trust layer between pilots, training organisations, and operators. We facilitate verified confirmations. The pilot controls what is shared, with whom, and for how long. We hold receipts. They own the record."</span> Same reason SWIFT doesn't own your money. They move it.</p>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mt-8 mb-3">The Pathway Consent Event — When the Airline Sees Everything</h4>
          <p className="text-slate-700 leading-relaxed mb-4">By default, all tokens in the pilot's Credential Wallet are <strong>private</strong>. The pilot sees everything. No operator sees anything — until the pilot submits interest in a pathway. That submission is the consent event that unlocks the full token stack for that specific operator only.</p>

          <div className="bg-slate-900 rounded-lg px-6 py-5 mb-6">
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-4">Pathway Consent Flow — Step by Step</p>
            <ol className="space-y-3">
              {([
                { step: '1', label: 'Airline posts a pathway', desc: 'Operator publishes requirements — hours, type rating, medical status, Recognition Score threshold. Visible to all pilots on the platform.' },
                { step: '2', label: 'Pilot submits interest', desc: 'Pilot clicks "Submit Interest." A consent modal appears — explicitly listing every data point the airline will receive access to: flight hours, license status, Recognition Score, programs, EBT score, employment history.' },
                { step: '3', label: 'Pilot consents', desc: '"By submitting this pathway, I authorise [Airline Name] to view my full Recognition Profile and Credential Wallet tokens for the purpose of this pathway application only." Pilot clicks: SUBMIT & CONSENT.' },
                { step: '4', label: 'Consent receipt issued', desc: 'A timestamped consent record is generated — pilot name, airline name, date, scope of data shared, pathway ID. This is the audit trail PilotRecognition holds.' },
                { step: '5', label: 'Airline receives full token access', desc: 'The airline\'s operator dashboard unlocks the pilot\'s full verified profile: ✅ License (Veremark) · ✅ Training Hours (IDfy) · ✅ Verepass record · ✅ Recognition Score · ✅ Programs · ✅ EBT score (if completed).' },
                { step: '6', label: 'Airline shortlists — identity pull triggered', desc: 'Airline clicks "Pull Profile" on shortlisted candidates. Identity check is triggered via Veremark ($9 cost, $50 charged to airline). Pilot is notified. $41 net margin to PilotRecognition.' },
                { step: '7', label: 'Access is scoped and revocable', desc: 'Access is per-pathway, per-operator only. Cebu Pacific sees the profile. PAL does not — until the pilot submits to PAL separately. Pilot can withdraw consent at any time — token access revoked instantly.' },
              ] as {step: string; label: string; desc: string}[]).map((item) => (
                <li key={item.step} className="flex items-start gap-3">
                  <span className="text-red-400 font-bold text-sm flex-shrink-0 w-5">{item.step}.</span>
                  <span className="text-sm"><strong style={{color:'#f87171'}}>{item.label}</strong> — <span className="text-slate-300">{item.desc}</span></span>
                </li>
              ))}
            </ol>
          </div>

          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Who</th>
                  <th className="text-left px-4 py-2 font-semibold">What They See</th>
                  <th className="text-left px-4 py-2 font-semibold">When</th>
                  <th className="text-left px-4 py-2 font-semibold">How Access is Granted</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { who: 'Pilot', sees: 'Full token stack — all receipts, all confirmations, all scores', when: 'Always', how: 'Their own wallet — permanent access' },
                  { who: 'Airline (pathway submitted)', sees: '✅ License · ✅ Hours · ✅ Verepass · ✅ Score · ✅ Programs · ✅ EBT', when: 'After pilot pathway submission', how: 'Pilot consent at submission — scoped to this pathway only' },
                  { who: 'Airline (profile pull)', sees: '+ Identity verification (live)', when: 'After airline shortlists and pays $50', how: 'Pilot notified — implicit consent via pathway submission' },
                  { who: 'Other operators', sees: 'Nothing', when: 'Never — unless pilot submits separately', how: 'No cross-operator data sharing without separate consent' },
                  { who: 'PilotRecognition', sees: 'Token metadata + receipt IDs only', when: 'Always', how: 'Platform role — never raw data' },
                  { who: 'Public', sees: 'Nothing', when: 'Never', how: 'Private by default' },
                ] as {who: string; sees: string; when: string; how: string}[]).map((row, i) => (
                  <tr key={row.who} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">{row.who}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300 text-xs">{row.sees}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-400 text-xs">{row.when}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-400 text-xs">{row.how}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-8 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>"We issue tokens. The pilot holds the key. The airline sees only what the pilot unlocks."</strong><br /><span className="text-slate-300 text-xs">This is the data privacy answer, the security answer, the investor answer, and the airline trust answer — in one sentence.</span></p>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mt-8 mb-3">Your Data. Your Wallet. Your Command.</h4>
          <p className="text-slate-700 leading-relaxed mb-4">This platform was built by pilots who have lived through the exact frustrations it solves — the manual verification queues, the opaque hiring requirements, the career delays caused by paper-based credential systems that belong to a different era. That shared background is not just a marketing narrative. It is the reason the platform is architected the way it is.</p>
          <p className="text-slate-700 leading-relaxed mb-4">PilotRecognition is not a data broker. We do not hoard your professional history. We are the secure radio channel you use to transmit your verified credentials directly to airlines. In aviation, nothing happens without the pilot's direct command. <strong>We have applied that exact principle to how data moves on this platform.</strong></p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {([
              { title: 'Zero Data Custody', icon: '🔒', desc: 'We do not store your raw license files, medical certificates, or logbook pages on our servers. If we are ever targeted by a breach, there is no personal data to leak.' },
              { title: 'Decentralised Ownership', icon: '🗝️', desc: 'Your verified credentials live in your personal Decentralised Identifier (DID) wallet. You own the cryptographic proofs of your career — not us, not the airline.' },
              { title: 'Pilot-Commanded Data Releases', icon: '✈️', desc: 'Airlines cannot pull your data implicitly. Every time an airline wants to view your verified status, you receive a push notification. You must actively tap APPROVE to grant temporary access.' },
              { title: 'The 10,000 Pilot Shield', icon: '🛡️', desc: 'When pilots control their own data, regulatory bottlenecks disappear, hiring timelines shrink from months to minutes, and the industry moves at the speed of flight.' },
            ] as {title:string;icon:string;desc:string}[]).map((item) => (
              <div key={item.title} className="border border-slate-200 rounded-lg px-5 py-4 bg-white flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="font-bold text-slate-900 mb-1">{item.title}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">How We Compare to Legacy Aviation Hiring</h4>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="bg-slate-900 text-white">
                <th className="text-left px-4 py-2 font-semibold">Feature</th>
                <th className="text-left px-4 py-2 font-semibold text-red-400">Legacy Aviation Hiring</th>
                <th className="text-left px-4 py-2 font-semibold" style={{color:'#34d399'}}>PilotRecognition Platform</th>
              </tr></thead>
              <tbody>
                {([
                  { f: 'Data Ownership', legacy: 'Owned by airlines and agencies', pr: 'Owned entirely by the pilot' },
                  { f: 'Consent Model', legacy: 'Hidden in long-form Terms and Conditions', pr: 'Explicit push notification per data request' },
                  { f: 'Verification Speed', legacy: '14–30 days via manual CAAP requests', pr: 'Instant via verified cryptographic tokens' },
                  { f: 'Data Storage', legacy: 'Vulnerable centralised filing cabinets and servers', pr: 'Decentralised DID wallets — pilot holds the key' },
                  { f: 'Airline Access', legacy: 'Airlines pull CVs without pilot knowledge', pr: 'Pilot must APPROVE every access event' },
                  { f: 'Portability', legacy: 'Credentials locked to each employer', pr: 'Credentials travel with the pilot across every operator' },
                ] as {f:string;legacy:string;pr:string}[]).map((row, i) => (
                  <tr key={row.f} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">{row.f}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-red-400 text-xs">{row.legacy}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-xs" style={{color:'#34d399'}}>{row.pr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-6 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>The three principles of pilot-commanded data:</strong><br />
            <span className="text-slate-300">1. Your data is never stored on PilotRecognition's servers — it stays with the providers you consent to independently.<br />
            2. Every airline access event requires your explicit tap of APPROVE — no implicit sharing, no background transfers.<br />
            3. Your tokens are non-transferable and non-financial — they are digital logbook stamps, not assets. They cannot be traded, sold, or used as collateral.</span></p>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mt-8 mb-3">What Happens When 10,000 Pilots Use This Platform</h4>
          <p className="text-slate-700 leading-relaxed mb-4">10,000 pilots in the Philippines is approximately 83% of the entire commercial pilot workforce. At that scale the platform is not a startup. It is the industry's verification infrastructure — and every stakeholder in aviation has a commercial reason to protect it.</p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="bg-slate-900 text-white">
                <th className="text-left px-4 py-2 font-semibold">Stakeholder</th>
                <th className="text-left px-4 py-2 font-semibold">What They Gain</th>
                <th className="text-left px-4 py-2 font-semibold">Why They Protect the Platform</th>
              </tr></thead>
              <tbody>
                {([
                  { s: 'Pilots (10,000)', g: 'Portable verified career record — no more starting from zero at every airline', p: 'Their verified credentials live in their own wallet — not on any platform\'s server' },
                  { s: 'Airlines', g: 'Pre-cleared pilot pool — 14–30 day verification → minutes', p: 'Their hiring pipeline depends on the verified database' },
                  { s: 'Flight Schools (ATOs)', g: 'Verified graduate placement rates — enrolment marketing that closes itself', p: 'Their graduate tracking and referral income depend on the platform' },
                  { s: 'CAAP / CAA', g: 'Structured data submissions — manual verification request volume drops dramatically', p: 'Platform reduces their administrative burden, not increases it' },
                  { s: 'Aviation Unions (PALEA, ALPA)', g: 'Digital logbook standards — collective bargaining power informed by real data', p: 'Any regulatory threat to pilot-owned data activates union response' },
                ] as {s:string;g:string;p:string}[]).map((row, i) => (
                  <tr key={row.s} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">{row.s}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300 text-xs">{row.g}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-400 text-xs">{row.p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-8 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>"We issue tokens. The pilot holds the key. The airline sees only what the pilot unlocks."</strong><br /><span className="text-slate-300 text-xs mt-1 block">This is the data privacy answer, the security answer, the investor answer, and the airline trust answer — in one sentence. Pilot-commanded infrastructure is not a legal strategy. It is the product.</span></p>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mt-8 mb-3">The Verification Mechanics: Binary Proofs &amp; Legal Neutrality</h4>
          <p className="text-slate-700 leading-relaxed mb-4">To solve the compliance bottleneck that generic verification providers have created, PilotRecognition eliminates data redundancy entirely. The platform never handles raw credential data. The flow that runs every time a check is initiated is as follows:</p>

          <div className="bg-slate-900 rounded-lg px-6 py-5 mb-6">
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-4">Binary Proof Flow — Every Check</p>
            <ol className="space-y-3">
              {([
                { n: '1', t: 'Pilot authorises', d: 'Pilot selects check type and authorises an independent verification partner (Veremark or IDfy) via explicit consent modal. No authorisation = no check runs.' },
                { n: '2', t: 'Partner queries primary source', d: 'The verification partner, acting as Independent Data Controller, queries the primary source directly — CAAP registry, FAA database, flight school confirmation, or NBI records — under their own regulatory authorisation.' },
                { n: '3', t: 'Binary Proof Token issued', d: 'The partner issues a Binary Proof Token directly to the pilot\'s DID wallet. Examples: medical_valid = TRUE · hours_verified = 1,500 · is_license_valid = TRUE · criminal_clear = TRUE. No raw data strings. Binary states only.' },
                { n: '4', t: 'PilotRecognition stores receipt only', d: 'The platform stores only the timestamped consent receipt and the transaction hash. Not the binary result. Not the underlying data. Not the pilot\'s credentials. The token lives in the pilot\'s wallet — not on the platform.' },
                { n: '5', t: 'Airline accesses via pilot approval', d: 'When an airline shortlists the pilot, they request access. The pilot receives a push notification and taps APPROVE. The airline\'s dashboard displays the binary proof tokens. The underlying data is never transmitted.' },
              ] as {n:string;t:string;d:string}[]).map((item) => (
                <li key={item.n} className="flex items-start gap-3">
                  <span className="text-red-400 font-bold text-sm flex-shrink-0 w-5">{item.n}.</span>
                  <span className="text-sm"><strong style={{color:'#f87171'}}>{item.t}</strong> — <span className="text-slate-300">{item.d}</span></span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4 mb-8">
            <p className="text-slate-800 text-sm leading-relaxed"><strong>The compliance consequence for enterprise operators:</strong> Because the platform never touches or stores underlying raw data strings, operators using PilotRecognition bypass months of vendor security audits typically required for SaaS platforms handling personal data. The liability of data custody remains with the source controllers (Veremark, IDfy). The power of data release remains entirely with the pilot. PilotRecognition operates legally as <strong>Joint Controller of the infrastructure</strong> — not as a data custodian — making it the only verification-integrated pilot platform that enterprise procurement and legal teams can approve without triggering standard data processor due diligence requirements.</p>
          </div>

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

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">The Professional Standing Asset — Verify Once, Apply Anywhere</h4>
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
          <p className="text-sm text-slate-700 mb-4">Service tiers: <strong>Standard</strong> (24–72 hour turnaround — included for all Recognition+ members) · <strong>Expedited</strong> (4–24 hours — available on request for Recognition+ members requiring faster processing) · <strong>Geographic transparency</strong> (estimated turnaround per country displayed before purchase)</p>

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
          <p className="text-sm text-slate-700 leading-relaxed mb-3">The platform sends <strong>automated Professional Standing alerts</strong> to pilots ahead of each expiry window — <strong style={{color:'#dc2626'}}>90 days</strong>, <strong style={{color:'#dc2626'}}>60 days</strong>, and <strong style={{color:'#dc2626'}}>30 days</strong> prior. The notification reads: <em style={{color:'#dc2626'}}>"Your Professional Standing is at risk — renew your Class 1 Medical token to maintain your Recognition+ status."</em> Pilots are directed to re-verify through the platform. Verification partners receive the renewal request through the same API integration used for initial checks. <strong>No separate pipeline. No manual handoff. The same infrastructure handles both.</strong></p>
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

          {isInternal && (<><h4 className="text-lg font-bold text-slate-800 mt-8 mb-3">Veremark Partnership — Live Pricing Integration <span className="ml-2 text-xs font-normal bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase tracking-wide">Internal — Admin Only</span></h4>
          <p className="text-slate-700 text-sm leading-relaxed mb-3">PilotRecognition operates as a <strong>Veremark partner</strong>, accessing their global background check infrastructure at a negotiated <strong>15% discount below RRP</strong> across all jurisdictions. This pricing forms the cost basis for both verification layers — enabling the platform to bundle checks into the pilot journey at a margin while remaining competitively priced versus any direct-to-pilot alternative.</p>
          <p className="text-slate-700 text-sm leading-relaxed mb-4">The four primary markets for pilot verification are the <strong>Philippines</strong> (launch market), <strong>UAE</strong> (Gulf hub), <strong>Singapore</strong> (APAC expansion), and <strong>United Kingdom</strong> (EASA/CAA-adjacent). The tables below show the <strong>Airside Professional Bundle</strong> — the standardised check set applied to every pilot at Layer 1 profile verification — with partner pricing per market.</p>

          <div className="border border-slate-200 rounded-lg px-6 py-5 mb-6 bg-white">
            <p className="text-xs uppercase tracking-wide font-semibold text-slate-500 mb-4">Airside Professional Bundle — Layer 1 (Pilot-Initiated Profile Verification)</p>
            <p className="text-slate-600 text-xs leading-relaxed mb-4">These checks form the <strong>standard Professional Standing Asset</strong>. Every pilot activating a verified profile on the platform completes this bundle. PilotRecognition pays Veremark at partner rate. The pilot pays the platform at a bundled rate inclusive of margin.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="text-left px-3 py-2 font-semibold">Check</th>
                    <th className="text-right px-3 py-2 font-semibold">🇵🇭 PH Partner</th>
                    <th className="text-right px-3 py-2 font-semibold">🇦🇪 UAE Partner</th>
                    <th className="text-right px-3 py-2 font-semibold">🇸🇬 SG Partner</th>
                    <th className="text-right px-3 py-2 font-semibold">🇬🇧 UK Partner</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    { check: 'Identity Verification', ph: '$9', ae: '$13', sg: '$13', uk: '$13' },
                    { check: 'Criminal Record Check', ph: '$13', ae: '$93', sg: 'N/A', uk: '$48' },
                    { check: 'Employment Check', ph: '$9', ae: '$35', sg: '$22', uk: '$27' },
                    { check: 'Education / Professional Qualification', ph: '$13', ae: '$99', sg: '$27', uk: '$27' },
                    { check: 'CV Gap Check', ph: '$15', ae: '$15', sg: '$15', uk: '$15' },
                    { check: 'Global Sanctions & PEP', ph: '$22', ae: '$22', sg: '$22', uk: '$22' },
                    { check: 'Address Check (Current)', ph: '$12', ae: '$12', sg: '$12', uk: '$12' },
                    { check: 'Right to Work', ph: '$9', ae: '$22', sg: '$18', uk: '$12' },
                    { check: 'Adverse Media Check', ph: '$14', ae: '$16', sg: '$16', uk: '$16' },
                  ] as { check: string; ph: string; ae: string; sg: string; uk: string }[]).map((row, i) => (
                    <tr key={row.check} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-3 py-2 border-b border-slate-200 text-slate-800 font-medium">{row.check}</td>
                      <td className="px-3 py-2 border-b border-slate-200 text-right text-slate-700">{row.ph}</td>
                      <td className="px-3 py-2 border-b border-slate-200 text-right text-slate-700">{row.ae}</td>
                      <td className="px-3 py-2 border-b border-slate-200 text-right text-slate-700">{row.sg}</td>
                      <td className="px-3 py-2 border-b border-slate-200 text-right text-slate-700">{row.uk}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-900 text-white font-bold">
                    <td className="px-3 py-2 font-bold">Bundle Total (Partner Cost)</td>
                    <td className="px-3 py-2 text-right" style={{color:'#34d399'}}>~$116</td>
                    <td className="px-3 py-2 text-right" style={{color:'#34d399'}}>~$327</td>
                    <td className="px-3 py-2 text-right" style={{color:'#34d399'}}>~$146</td>
                    <td className="px-3 py-2 text-right" style={{color:'#34d399'}}>~$192</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-slate-500 text-xs mt-3">Partner rates = RRP minus 15% Veremark discount. UAE costs are elevated due to regulated profession checks (Criminal: $93, Professional Qualification: $99). Philippines is the most cost-efficient launch market for the Layer 1 bundle.</p>
          </div>

          <div className="border border-slate-200 rounded-lg px-6 py-5 mb-6 bg-white">
            <p className="text-xs uppercase tracking-wide font-semibold text-slate-500 mb-4">Layer 2 — Operator-Requested Deep Verification (Additional Checks, Per-Request)</p>
            <p className="text-slate-600 text-xs leading-relaxed mb-4">These checks are <strong>not included in the standard bundle</strong>. Operators select and pay for them individually on shortlisted candidates. Pricing shown is partner cost to platform — operators are billed at a marked-up rate.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="text-left px-3 py-2 font-semibold">Check</th>
                    <th className="text-left px-3 py-2 font-semibold">Use Case</th>
                    <th className="text-right px-3 py-2 font-semibold">🇵🇭 PH</th>
                    <th className="text-right px-3 py-2 font-semibold">🇦🇪 UAE</th>
                    <th className="text-right px-3 py-2 font-semibold">🇸🇬 SG</th>
                    <th className="text-right px-3 py-2 font-semibold">🇬🇧 UK</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    { check: 'Regulated Professions Check', use: 'Airline/ATO compliance — confirms licence with authority', ph: 'N/A', ae: '$105', sg: '$16', uk: '$16' },
                    { check: 'Adverse Financial History', use: 'Insurance underwriters, lenders — financial risk signal', ph: '$14', ae: '$110', sg: '$30', uk: '$17' },
                    { check: 'Bankruptcy Check', use: 'Financiers, large operators — debt exposure', ph: 'N/A', ae: '$100', sg: '$29', uk: '$93' },
                    { check: 'Civil Check', use: 'Deep operator due diligence — litigation history', ph: '$14', ae: '$66', sg: '$29', uk: '$78' },
                    { check: 'Directorship Check', use: 'Corporate aviation — conflicts of interest', ph: '$31', ae: '$87', sg: '$31', uk: '$16' },
                    { check: 'Social Media Check', use: 'Charter/VIP operators — conduct & reputational risk', ph: '$32', ae: '$41', sg: '$41', uk: '$41' },
                    { check: 'Reference Check', use: 'All operators — prior employer conduct', ph: '$6', ae: '$13', sg: '$13', uk: '$13' },
                    { check: 'Employment Gap Check', use: 'Airlines — unexplained career gaps', ph: '$7', ae: '$22', sg: '$22', uk: '$22' },
                  ] as { check: string; use: string; ph: string; ae: string; sg: string; uk: string }[]).map((row, i) => (
                    <tr key={row.check} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-3 py-2 border-b border-slate-200 text-slate-800 font-medium">{row.check}</td>
                      <td className="px-3 py-2 border-b border-slate-200 text-slate-500 text-xs italic">{row.use}</td>
                      <td className="px-3 py-2 border-b border-slate-200 text-right text-slate-700">{row.ph}</td>
                      <td className="px-3 py-2 border-b border-slate-200 text-right text-slate-700">{row.ae}</td>
                      <td className="px-3 py-2 border-b border-slate-200 text-right text-slate-700">{row.sg}</td>
                      <td className="px-3 py-2 border-b border-slate-200 text-right text-slate-700">{row.uk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-slate-500 text-xs mt-3">N/A = check not available in that jurisdiction per Veremark pricing sheet. UAE deep checks carry the highest costs — driven by civil, bankruptcy, and regulated profession complexity in UAE jurisdiction.</p>
          </div>

          <div className="bg-slate-100 border border-slate-300 rounded px-5 py-4 mb-8">
            <p className="text-xs uppercase tracking-wide font-semibold text-slate-500 mb-2">Commercial Margin Logic — Multi-Currency, Multi-Market</p>
            <p className="text-slate-700 text-sm leading-relaxed mb-3">PilotRecognition pays Veremark at <strong>partner cost (RRP −15%)</strong>. The platform charges pilots at a <strong>regionally-priced bundled retail rate</strong> that reflects the cost structure of each market — meaning the platform does not absorb the cost difference between a Philippines check and a UAE check. <strong>The pilot in each market pays the rate appropriate to their jurisdiction. The margin percentage holds across all markets.</strong></p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="text-left px-3 py-2 font-semibold">Market</th>
                    <th className="text-right px-3 py-2 font-semibold">Partner Cost</th>
                    <th className="text-right px-3 py-2 font-semibold">Retail to Pilot</th>
                    <th className="text-right px-3 py-2 font-semibold">Platform Margin</th>
                    <th className="text-left px-3 py-2 font-semibold">Currency Context</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    { market: '🇵🇭 Philippines', cost: '~$116', retail: '$149–$179', margin: '$33–$63', note: 'PHP — high pilot volume, low absolute cost, highest ROI per check' },
                    { market: '🇸🇬 Singapore', cost: '~$146', retail: '$189–$219', margin: '$43–$73', note: 'SGD — affluent market, pilots expect premium pricing' },
                    { market: '🇬🇧 United Kingdom', cost: '~$192', retail: '$239–$279', margin: '$47–$87', note: 'GBP — strong aviation market, CAA-adjacent, high willingness to pay' },
                    { market: '🇦🇪 UAE', cost: '~$327', retail: '$389–$429', margin: '$62–$102', note: 'AED — highest cost base but highest absolute margin; Gulf pilots expect enterprise-grade verification' },
                  ] as { market: string; cost: string; retail: string; margin: string; note: string }[]).map((row, i) => (
                    <tr key={row.market} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-3 py-2 border-b border-slate-200 font-semibold text-slate-800">{row.market}</td>
                      <td className="px-3 py-2 border-b border-slate-200 text-right text-slate-600">{row.cost}</td>
                      <td className="px-3 py-2 border-b border-slate-200 text-right font-semibold text-slate-800">{row.retail}</td>
                      <td className="px-3 py-2 border-b border-slate-200 text-right font-bold" style={{color:'#34d399'}}>{row.margin}</td>
                      <td className="px-3 py-2 border-b border-slate-200 text-slate-500 italic text-xs">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed"><strong>The platform profits from every currency zone.</strong> A PHP pilot in Manila, an AED pilot in Dubai, an SGD pilot in Singapore, and a GBP pilot in London all pay their regional rate — and in every case, the platform earns a margin on the Veremark cost basis. <strong>Geographic expansion is not a cost problem. It is a revenue multiplication event.</strong> Every new market Veremark covers is a new margin stream the platform inherits automatically — without renegotiating the partnership or rebuilding the infrastructure.</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-300 rounded-lg px-6 py-5 mb-6">
            <p className="text-xs uppercase tracking-widest font-bold text-emerald-700 mb-1">White-Label Arbitrage — The Verification Profit Engine <span className="ml-2 font-normal text-emerald-600 normal-case tracking-normal">Admin Only</span></p>
            <p className="text-slate-700 text-sm leading-relaxed mb-4">This is the exact "White-Label Arbitrage" model that makes SaaS platforms structurally profitable at scale. By charging pilots and operators the <strong>RRP (Recommended Retail Price)</strong> and paying Veremark the <strong>Partner Price (−15%)</strong>, the platform is not passing through costs — it is turning the verification engine itself into a <strong>continuous, high-volume profit center</strong>. Every compliance transaction in the aviation industry generates a 15% margin. No separate product. No separate sales motion. Pure infrastructure arbitrage.</p>

            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <div className="bg-white border border-emerald-200 rounded-lg p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Layer 1 — UK Pilot Baseline (at account creation)</p>
                <table className="w-full text-xs mb-3">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-200">
                      <th className="text-left py-1 font-semibold">Check</th>
                      <th className="text-right py-1 font-semibold">Pilot Pays (RRP)</th>
                      <th className="text-right py-1 font-semibold">We Pay Veremark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {([
                      { check: 'Identity Verification', rrp: '$15', cost: '$13' },
                      { check: 'Criminal Record (DBS Basic)', rrp: '$56', cost: '$48' },
                      { check: 'Licence / Prof. Qualification', rrp: '$31', cost: '$27' },
                      { check: 'Employment Check', rrp: '$31', cost: '$27' },
                      { check: 'Right to Work', rrp: '$14', cost: '$12' },
                    ] as { check: string; rrp: string; cost: string }[]).map((r, i) => (
                      <tr key={r.check} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                        <td className="py-1.5 px-2 text-slate-700">{r.check}</td>
                        <td className="py-1.5 px-2 text-right font-semibold text-slate-800">{r.rrp}</td>
                        <td className="py-1.5 px-2 text-right text-slate-500">{r.cost}</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-slate-300 font-bold bg-emerald-50">
                      <td className="py-2 px-2 text-slate-800">Total</td>
                      <td className="py-2 px-2 text-right text-slate-900">$147.00</td>
                      <td className="py-2 px-2 text-right text-slate-600">$127.00</td>
                    </tr>
                  </tbody>
                </table>
                <div className="bg-emerald-100 border border-emerald-200 rounded px-3 py-2 text-xs">
                  <span className="font-bold text-emerald-800">Platform profit: $20.00</span>
                  <span className="text-emerald-600 ml-2">— on top of the $99/yr Recognition+ subscription.</span>
                </div>
              </div>

              <div className="bg-white border border-emerald-200 rounded-lg p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Layer 2 — UAE Operator Deep Check (per candidate)</p>
                <table className="w-full text-xs mb-3">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-200">
                      <th className="text-left py-1 font-semibold">Check</th>
                      <th className="text-right py-1 font-semibold">Operator Pays (RRP)</th>
                      <th className="text-right py-1 font-semibold">We Pay Veremark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {([
                      { check: 'Adverse Financial History', rrp: '$129', cost: '$110' },
                      { check: 'UAE Criminal Record', rrp: '$109', cost: '$93' },
                      { check: 'Social Media Check', rrp: '$48', cost: '$41' },
                    ] as { check: string; rrp: string; cost: string }[]).map((r, i) => (
                      <tr key={r.check} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                        <td className="py-1.5 px-2 text-slate-700">{r.check}</td>
                        <td className="py-1.5 px-2 text-right font-semibold text-slate-800">{r.rrp}</td>
                        <td className="py-1.5 px-2 text-right text-slate-500">{r.cost}</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-slate-300 font-bold bg-emerald-50">
                      <td className="py-2 px-2 text-slate-800">Total</td>
                      <td className="py-2 px-2 text-right text-slate-900">$286.00</td>
                      <td className="py-2 px-2 text-right text-slate-600">$244.00</td>
                    </tr>
                  </tbody>
                </table>
                <div className="bg-emerald-100 border border-emerald-200 rounded px-3 py-2 text-xs">
                  <span className="font-bold text-emerald-800">Platform profit: $42.00 per candidate.</span>
                  <span className="text-emerald-600 ml-2">10 finalists/month = $420 passive profit from API handoffs alone.</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 mb-4 text-sm">
              <p className="font-bold text-slate-800 mb-2">Why This Works Psychologically — The Transparency Pitch</p>
              <p className="text-slate-700 leading-relaxed mb-2">This model never needs to be hidden — it is inherently fair to all parties.</p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-0.5 flex-shrink-0">→</span><span><strong>To the pilot:</strong> "You are paying the exact market retail rate (RRP) for your background check. The difference is, once you buy it here, it is portable — you don't have to buy it five more times for five different airlines."</span></li>
                <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-0.5 flex-shrink-0">→</span><span><strong>To the operator:</strong> "You are paying the standard market rate for a background check — but you get the results instantly via API because the pilot's base profile is already verified."</span></li>
              </ul>
              <p className="text-slate-600 text-xs mt-3 italic">No one feels gouged. PilotRecognition captures a 15% margin on every compliance transaction in the aviation industry.</p>
            </div>

            <div className="bg-slate-900 rounded-lg px-5 py-4 text-xs text-white">
              <p className="font-bold text-red-400 mb-2 uppercase tracking-widest text-[10px]">Updated Commercial Model — Pillar 11 Pricing Language</p>
              <p className="text-slate-300 leading-relaxed mb-2"><strong className="text-white">Recognition+ (Pilot-Initiated):</strong> $99/yr subscription + Standard Retail Rate (RRP) for regional authority checks. The platform captures a <strong className="text-emerald-400">15% wholesale margin</strong> on all partner verifications — creating a micro-transaction profit engine alongside subscription revenue.</p>
              <p className="text-slate-300 leading-relaxed"><strong className="text-white">Operator Deep Check (Layer 2):</strong> Billed to the operator at Standard Retail Rate (RRP) per requested module (e.g., UAE Financial Check, UK Social Media). The operator pays market rate; the platform retains the <strong className="text-emerald-400">15% wholesale margin</strong>. At 10 finalists per month (UAE), this generates $420/month in pure passive profit from API handoffs — before any subscription or success fee revenue.</p>
            </div>
          </div>

          {isSuperAdmin && (<>
          <div className="bg-slate-950 border border-slate-700 rounded-lg px-6 py-5 mb-6">
            <p className="text-[10px] uppercase tracking-widest font-bold text-yellow-400 mb-1">Global Verification Pricing — RRP vs Partner Rate + Profit Margin <span className="ml-2 font-normal text-yellow-600 normal-case tracking-normal">Super Admin Only</span></p>
            <p className="text-slate-400 text-xs leading-relaxed mb-5">All figures in USD. Partner rate = Veremark Standard RRP − 15%. Profit margin = RRP − Partner cost, earned on every transaction. Source: Veremark pricing communication 14 May 2026.</p>

            {([
              {
                flag: '🇮🇳', country: 'India (IN)',
                rows: [
                  { service: 'Criminal Record Check', rrp: 28, partner: 24 },
                  { service: 'Education Check', rrp: 18, partner: 16 },
                  { service: 'Employment Check', rrp: 15, partner: 13 },
                  { service: 'Identity Verification', rrp: 15, partner: 13 },
                  { service: 'Social Media Check', rrp: 48, partner: 41 },
                  { service: 'Global Sanctions & PEP', rrp: 25, partner: 22 },
                ],
              },
              {
                flag: '🇵🇭', country: 'Philippines (PH)',
                rows: [
                  { service: 'Criminal Record Check', rrp: 15, partner: 13 },
                  { service: 'Education Check', rrp: 10, partner: 9 },
                  { service: 'Employment Check', rrp: 10, partner: 9 },
                  { service: 'Identity Verification', rrp: 10, partner: 9 },
                  { service: 'Social Media Check', rrp: 37, partner: 32 },
                  { service: 'Address Check (Current)', rrp: 14, partner: 12 },
                ],
              },
              {
                flag: '🇸🇬', country: 'Singapore (SG)',
                rows: [
                  { service: 'Education Check', rrp: 25, partner: 22 },
                  { service: 'Employment Check', rrp: 25, partner: 22 },
                  { service: 'MOM Accreditation Check', rrp: 71, partner: 61 },
                  { service: 'Driving License Check', rrp: 41, partner: 35 },
                  { service: 'Bankruptcy Check', rrp: 33, partner: 29 },
                  { service: 'Identity Verification', rrp: 15, partner: 13 },
                ],
              },
              {
                flag: '🇦🇪', country: 'United Arab Emirates (AE)',
                rows: [
                  { service: 'Criminal Record Check', rrp: 109, partner: 93 },
                  { service: 'Education Check', rrp: 41, partner: 35 },
                  { service: 'Employment Check', rrp: 41, partner: 35 },
                  { service: 'Professional Qualification', rrp: 116, partner: 99 },
                  { service: 'Directorship Check', rrp: 102, partner: 87 },
                  { service: 'Regulated Professions Check', rrp: 123, partner: 105 },
                ],
              },
              {
                flag: '🇬🇧', country: 'United Kingdom (GB)',
                rows: [
                  { service: 'DBS Basic (England/Wales)', rrp: 56, partner: 48 },
                  { service: 'Education Check', rrp: 31, partner: 27 },
                  { service: 'Employment Check', rrp: 31, partner: 27 },
                  { service: 'UK FCA Regulated Reference', rrp: 71, partner: 61 },
                  { service: 'Right To Work Check', rrp: 14, partner: 12 },
                  { service: 'Identity Verification', rrp: 15, partner: 13 },
                ],
              },
            ] as { flag: string; country: string; rows: { service: string; rrp: number; partner: number }[] }[]).map((market) => {
              const totalRRP = market.rows.reduce((s, r) => s + r.rrp, 0);
              const totalPartner = market.rows.reduce((s, r) => s + r.partner, 0);
              const totalMargin = totalRRP - totalPartner;
              const marginPct = ((totalMargin / totalRRP) * 100).toFixed(1);
              return (
                <div key={market.country} className="mb-6">
                  <p className="text-xs font-bold text-white mb-2">{market.flag} {market.country}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-800 text-slate-300">
                          <th className="text-left px-3 py-2 font-semibold">Service</th>
                          <th className="text-right px-3 py-2 font-semibold">Veremark RRP</th>
                          <th className="text-right px-3 py-2 font-semibold">Partner Cost</th>
                          <th className="text-right px-3 py-2 font-semibold text-yellow-400">Profit Margin</th>
                        </tr>
                      </thead>
                      <tbody>
                        {market.rows.map((row, i) => {
                          const margin = row.rrp - row.partner;
                          const pct = ((margin / row.rrp) * 100).toFixed(1);
                          return (
                            <tr key={row.service} className={i % 2 === 0 ? 'bg-slate-900' : 'bg-slate-800/50'}>
                              <td className="px-3 py-2 border-b border-slate-700 text-slate-200">{row.service}</td>
                              <td className="px-3 py-2 border-b border-slate-700 text-right text-slate-300">${row.rrp}</td>
                              <td className="px-3 py-2 border-b border-slate-700 text-right text-slate-400">${row.partner}</td>
                              <td className="px-3 py-2 border-b border-slate-700 text-right font-bold" style={{color:'#34d399'}}>${margin} <span className="text-[10px] text-emerald-600 font-normal">({pct}%)</span></td>
                            </tr>
                          );
                        })}
                        <tr className="bg-yellow-900/40 border-t-2 border-yellow-600/50 font-bold">
                          <td className="px-3 py-2 text-yellow-300">Total (all checks)</td>
                          <td className="px-3 py-2 text-right text-white">${totalRRP}</td>
                          <td className="px-3 py-2 text-right text-slate-300">${totalPartner}</td>
                          <td className="px-3 py-2 text-right text-yellow-300">${totalMargin} <span className="text-[10px] font-normal text-yellow-500">({marginPct}%)</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}

            <div className="bg-slate-800 border border-slate-600 rounded px-4 py-3 mt-2">
              <p className="text-[10px] uppercase tracking-widest font-bold text-yellow-400 mb-2">Country Margin Summary</p>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-700">
                    <th className="text-left py-1.5 font-semibold">Market</th>
                    <th className="text-right py-1.5 font-semibold">Total RRP</th>
                    <th className="text-right py-1.5 font-semibold">Total Partner Cost</th>
                    <th className="text-right py-1.5 font-semibold text-yellow-400">Total Profit</th>
                    <th className="text-right py-1.5 font-semibold text-yellow-400">Margin %</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    { flag: '🇮🇳', country: 'India', rrp: 149, partner: 129 },
                    { flag: '🇵🇭', country: 'Philippines', rrp: 96, partner: 84 },
                    { flag: '🇸🇬', country: 'Singapore', rrp: 210, partner: 182 },
                    { flag: '🇦🇪', country: 'UAE', rrp: 532, partner: 454 },
                    { flag: '🇬🇧', country: 'United Kingdom', rrp: 218, partner: 188 },
                  ] as { flag: string; country: string; rrp: number; partner: number }[]).map((r, i) => {
                    const margin = r.rrp - r.partner;
                    const pct = ((margin / r.rrp) * 100).toFixed(1);
                    return (
                      <tr key={r.country} className={i % 2 === 0 ? 'bg-slate-900/50' : ''}>
                        <td className="py-1.5 px-1 text-white font-medium">{r.flag} {r.country}</td>
                        <td className="py-1.5 px-1 text-right text-slate-300">${r.rrp}</td>
                        <td className="py-1.5 px-1 text-right text-slate-400">${r.partner}</td>
                        <td className="py-1.5 px-1 text-right font-bold" style={{color:'#34d399'}}>${margin}</td>
                        <td className="py-1.5 px-1 text-right font-bold text-yellow-400">{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="text-slate-500 text-[10px] mt-3">Margin % is consistent at ~13–15% across all markets — reflecting the fixed Veremark partner discount. UAE yields the highest absolute margin per transaction due to elevated check costs for regulated professions and criminal records.</p>
            </div>
          </div>
          </>)}

          </>)}

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

          <h5 className="text-base font-bold text-slate-800 mt-8 mb-3">The Multi-Node Model vs. Generic Verification — Feature Comparison</h5>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Feature</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-400">Generic Verification</th>
                  <th className="text-left px-4 py-2 font-semibold" style={{color:'#f87171'}}>Pillar 11 Multi-Node Model</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { feature: 'Routing', generic: 'Manual / random assignment', pillar: 'Automated — Jurisdiction-First, Anchor Key routing by issuing authority' },
                  { feature: 'Trust Model', generic: '"Take our word for it" — PDF on file', pillar: 'SSI — W3C Verifiable Credential, cryptographically signed by the issuing authority' },
                  { feature: 'Data Residency', generic: 'Cross-border transfer risk — GDPR liability', pillar: 'Natively local — data stays within regional node until pilot actively shares the token' },
                  { feature: 'Monitoring', generic: 'Point-in-time snapshot — valid on print date only', pillar: 'Live Stream — Active Listener on authority databases, 90/60/30-day renewal alerts, same-day flag on licence suspension' },
                  { feature: 'Pilot Experience', generic: 'Redundant & repetitive — new check per employer', pillar: 'Verify Once, Apply Anywhere — portable wallet, single consent, recognised across every operator on the platform' },
                  { feature: 'Aviation Specificity', generic: 'Generic HR process — no Class 1 medical tracking, no CTC, no type rating awareness', pillar: 'Aviation-native taxonomy — medical expiry windows, type ratings, CTC, airside passes, multi-authority licence validation' },
                  { feature: 'Revenue Model for Partners', generic: 'One-time check fee per employer request', pillar: 'Recurring — medical renewals, licence revalidations, employment updates, continuous monitoring pulse fees' },
                ] as { feature: string; generic: string; pillar: string }[]).map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-2 border border-slate-200 font-semibold text-slate-800 whitespace-nowrap">{row.feature}</td>
                    <td className="px-4 py-2 border border-slate-200 text-slate-500 text-xs">{row.generic}</td>
                    <td className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-medium">{row.pillar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h5 className="text-base font-bold text-slate-800 mt-8 mb-2">The Data Contribution Credit — The Moat Builder</h5>
          <p className="text-slate-700 text-sm leading-relaxed mb-3">The $2.00 operator credit for contributing Deep Check results back to a pilot's wallet is not just a pricing incentive. It is the mechanism that builds the platform's most durable competitive moat. Airlines are typically data hoarders — verification results sit in internal HR systems, used once, never shared. The credit inverts this behaviour by making contribution economically rational.</p>
          <p className="text-slate-700 text-sm leading-relaxed mb-4">Once a pilot's wallet contains verified contributions from three or more major operators — criminal checks, incident history, conduct records — that wallet becomes the most comprehensive verified pilot record in existence. <strong style={{color:'#dc2626'}}>A pilot whose professional standing is physically stored in this ecosystem has no incentive to leave it.</strong> Every new employer contribution deepens the lock-in. The platform is not just a job board the pilot uses occasionally — it is the permanent, living record of their entire aviation career. The moat is built one $2.00 credit at a time.</p>

          <h5 className="text-base font-bold text-slate-800 mt-8 mb-2">Partner ROI Summary — The Regional Partner View</h5>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">ROI Driver</th>
                  <th className="text-left px-4 py-2 font-semibold">What It Means for the Partner</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { driver: 'Zero Acquisition Cost', value: 'No sales team required for pilots. The platform sends ready-to-verify EASA (or regional equivalent) leads directly from every Recognition+ signup within the partner\'s jurisdiction. The pipeline is automatic.' },
                  { driver: 'High-Margin Recurring Revenue', value: 'Continuous Monitoring generates a recurring fee every 6–12 months per pilot — triggered by medical certificate and licence revalidation windows, not by the pilot seeking a new job. Revenue is decoupled from hiring activity.' },
                  { driver: 'Territorial Dominance', value: 'The Lead Node for a region is the default and exclusive processor for every pilot whose primary licence falls within that jurisdiction. No other regional partner can process that check. Territory is protected by routing logic, not by contract negotiation.' },
                  { driver: 'Cryptographic Authority', value: 'The regional partner acts as the Cryptographic Signer — not just a confirmer of facts, but the issuer of a signed digital token. The "Verification Preferred" badge on the platform is their signature. It is unforgeable and permanently associated with their node.' },
                  { driver: 'Single Integration, Global Distribution', value: 'One API integration to PilotRecognition gives the partner distribution across every airline, cargo operator, charter operator, and emerging sector employer on the platform — globally. The platform handles sales, routing, and payment. The partner handles checks.' },
                ] as { driver: string; value: string }[]).map((row, i) => (
                  <tr key={row.driver} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-red-400 whitespace-nowrap align-top">{row.driver}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300 text-xs">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="text-sm text-slate-700 space-y-1 mb-6 ml-4 list-disc">
            <li>10–15% revenue share on verification fees — passive income without operational overhead</li>
            <li>Volume multiplier: one verified pilot applies to 5+ airlines = 5x check volume per user</li>
            <li>Year 1: 5,000 pilots verified — market development focus</li>
            <li>Year 2: 13,500 checks at tiered pricing — $255K revenue potential</li>
            <li>Year 3: 36,000 checks at volume pricing — $474K revenue potential</li>
          </ul>

          <h4 className="text-lg font-bold text-slate-800 mt-8 mb-3">Ecosystem Integration — The Pillar 11 Handshake Map</h4>
          <p className="text-slate-700 text-sm leading-relaxed mb-4">Pillar 11 is the Central Processing Unit of the 25-pillar ecosystem. The Professional Standing Asset does not operate in isolation — it is the credential node through which every sector on the platform validates, trusts, and acts on pilot data. The following handshakes define how the verification infrastructure pulses outward across the map.</p>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Pillar</th>
                  <th className="text-left px-4 py-2 font-semibold">The Handshake</th>
                  <th className="text-left px-4 py-2 font-semibold">System Outcome</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { pillar: 'Pillar 04 — Emerging Sectors (eVTOL)', handshake: 'Modular Credentialling', outcome: 'Verifies the AAM-Ready tag in real time. Micro-credentials issued by ATOs or operators are pushed as signed tokens into the pilot\'s Professional Standing Asset — the competency map is live, not self-declared.' },
                  { pillar: 'Pillar 08 — Banking & Training Finance', handshake: 'Verified ATO Transcripts', outcome: 'Banks pull the verified training completion record directly from the pilot\'s asset before releasing loan funds. Disbursement is gated on verified milestone progress — not self-declaration.' },
                  { pillar: 'Pillar 09 — Aviation Insurance', handshake: 'Anonymised Competency Benchmarks', outcome: 'The asset provides the actuarial data set for High-Integrity Wallet premium discounts. Continuous Monitoring gives insurers a live risk pulse — replacing the static snapshot with a live stream.' },
                  { pillar: 'Pillar 13 — Aeromedical', handshake: 'Digital Medical Tokens', outcome: 'AMEs push signed Class 1/2/3 tokens directly into the pilot\'s asset via API. Medical status is live, cryptographically verified, and continuously monitored. The renewal window triggers the highest-frequency recurring transaction in the ecosystem.' },
                  { pillar: 'Pillar 15 — Manufacturers & OEMs', handshake: 'Software Familiarisation Credentials', outcome: 'OEMs push type-specific avionics course completions directly into the pilot\'s asset when a systems module is completed. The competency map updates without the pilot re-entering the platform.' },
                  { pillar: 'Pillar 17 — Universities & ATOs', handshake: 'AAM-Ready Graduate Tokens', outcome: 'Institutions integrating W3C credential issuance push AAM-Ready tokens at graduation. The ATO becomes a verified node in the credential chain — not an external paper-issuing body.' },
                  { pillar: 'Pillar 21 — Humanitarian Operations', handshake: 'Austerity Operations Credential', outcome: 'Signals readiness for high-stress, non-templated disaster-relief environments. NGO or operator sign-off is stored as a verified token — the "Special Forces" designation of the AAM credential map.' },
                ] as { pillar: string; handshake: string; outcome: string }[]).map((row, i) => (
                  <tr key={row.pillar} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-red-400 whitespace-nowrap align-top text-xs">{row.pillar}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-200 font-semibold align-top text-xs whitespace-nowrap">{row.handshake}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300 text-xs">{row.outcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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

          {/* Foundation Program Pillar */}
          <h1 id="pillar-foundation-program" className="text-4xl font-bold text-slate-900 mt-12 mb-6 pb-4 border-b-2 border-slate-900 scroll-mt-24">
            HUB F — THE FOUNDATION PROGRAM
          </h1>
          <p className="text-slate-500 text-sm mb-2 uppercase tracking-wide font-semibold">Pilot Formation · Mentorship · Verified Identity</p>
          <p className="text-slate-600 leading-relaxed mb-8">
            The Foundation Program is not a course. It is not a subscription. It is a structured formation process — the entry point into the PilotRecognition ecosystem and the infrastructure that transforms a pilot's private journey into a publicly verified, industry-recognised professional identity. Every pilot who completes it becomes more than qualified. They become <strong>recognised</strong>.
          </p>

          <div className="my-6 px-5 py-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
            <p className="text-sm font-bold text-red-600 uppercase tracking-widest mb-1">Founding Principle</p>
            <p className="text-slate-700 leading-relaxed">The industry produces qualified pilots. It does not produce recognised ones. The Foundation Program closes that gap — not with content, but with formation. Not with a certificate, but with a verified identity that the industry can trust and act on.</p>
          </div>

          <h2 id="foundation-discipleship" className="text-2xl font-bold text-slate-800 mt-10 mb-4 pb-2 border-b border-slate-300 scroll-mt-24">
            Core I — Module-Based Mentorship
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The Foundation Program is not a training organisation. It does not assign instructors, run classrooms, or issue course completions. It is a structured handbook — a set of guided modules built around a single principle: <strong>the knowledge you already hold has value for someone behind you.</strong>
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            A pilot with a PPL knows things a student pilot does not. A CPL holder understands what a PPL pilot is trying to figure out. An ATPL captain has navigated what a first officer is walking into. <strong>You do not need to be at the top of the industry to guide someone. You need to be one step ahead of them — and willing to share what that step looked like.</strong>
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The platform guides pilots through modules structured around their current licence level and experience. Each module surfaces the knowledge relevant to the pilots below them — and frames how to communicate it clearly, practically, and without ego. The pilot does not become a trainer. They become a resource. A reference point. Someone who has passed the same checkpoint and can describe what they found there.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { title: 'Based on What You Know', body: 'Modules are unlocked by your verified licence level and flight experience — not by application or approval. If you hold a PPL, the platform surfaces mentorship content relevant to students below that level. Your knowledge is the qualification.' },
              { title: 'Self-Guided, Not Assigned', body: 'There is no matching algorithm. No assigned senior mentor. You work through the handbook at your own pace, contributing guidance in the areas where your experience is verifiable. The platform structures it. You deliver it.' },
              { title: 'Verified Contribution Record', body: 'Every module completed and every guidance session logged is recorded on your Recognition Profile. It is not self-declared — it is timestamped and verified by the platform. A pilot with a full contribution record signals something no CV can replicate: that they understand the industry well enough to explain it.' },
            ].map((item) => (
              <div key={item.title} className="border border-slate-200 rounded-lg px-5 py-4 bg-white">
                <p className="font-bold text-red-600 mb-2 text-sm">{item.title}</p>
                <p className="text-slate-700 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <h2 id="foundation-consultation" className="text-2xl font-bold text-slate-800 mt-10 mb-4 pb-2 border-b border-slate-300 scroll-mt-24">
            Core II — Consultation &amp; EBT Alignment
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The Foundation Program is built on a single conviction: <strong>a captain is not someone who flies well — a captain is someone who thinks like one before they are ever given the seat.</strong> The consultation component of the program is where that thinking is developed. Not through manuals. Not through checkrides. Through structured, guided reflection on real situations, real decisions, and real failures — conducted between a pilot and a mentor who has lived through them.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            This is Evidence-Based Training at its foundational level. The 9 ICAO core competencies are not skills performed for an examiner — they are ways of thinking, communicating, and leading that must be built over time through practice and honest feedback. The Foundation Program is the only structured environment in aviation where a low-hour pilot begins developing these competencies before they are required to demonstrate them under pressure.
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-3 font-semibold">EBT Competency</th>
                  <th className="text-left px-4 py-3 font-semibold text-red-400">What the Industry Expects</th>
                  <th className="text-left px-4 py-3 font-semibold" style={{color:'#34d399'}}>How Foundation Builds It</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { comp: 'Application of Knowledge', expects: 'Accurate recall under pressure', builds: 'Structured consultation sessions using real-world scenarios drawn from the mentor\'s operational history' },
                  { comp: 'Communication', expects: 'Clear, structured, confident CRM communication', builds: 'Role-play and debrief exercises — pilot explains decisions aloud while mentor challenges assumptions' },
                  { comp: 'Flight Path Management (Manual)', expects: 'Precise manual handling in degraded conditions', builds: 'Gap analysis against simulator hour requirements; targeted pre-assessment preparation' },
                  { comp: 'Leadership & Teamwork', expects: 'Demonstrated crew authority without ego', builds: '4th-year-to-1st-year mentorship sessions — the pilot leads before they are led' },
                  { comp: 'Problem Solving & Decision Making', expects: 'Structured decision architecture under ambiguity', builds: 'Case-based consultation: mentor presents decisions, pilot reasons through them, outcome is debriefed' },
                  { comp: 'Situational Awareness', expects: 'Continuous threat and error management', builds: 'Profile gap analysis — the pilot learns to read their own career environment the same way they read an aircraft environment' },
                  { comp: 'Workload Management', expects: 'Prioritisation in high-density task environments', builds: 'Foundation Program structure itself — managing study, mentorship, assessment, and profile building simultaneously' },
                  { comp: 'Automation Management', expects: 'Appropriate mode awareness and intervention', builds: 'Type rating pathway consultation — understanding automation profiles before committing to a rating' },
                  { comp: 'Upset Prevention & Recovery', expects: 'Recognition and early intervention', builds: 'Career threat identification — recognising when a pilot\'s trajectory is heading toward a gap or a dead end before it becomes unrecoverable' },
                ] as { comp: string; expects: string; builds: string }[]).map((row, i) => (
                  <tr key={row.comp} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-red-400 align-top text-xs whitespace-nowrap">{row.comp}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300 text-xs align-top">{row.expects}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-100 text-xs align-top">{row.builds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="foundation-peer-chain" className="text-2xl font-bold text-slate-800 mt-10 mb-4 pb-2 border-b border-slate-300 scroll-mt-24">
            Core III — The Peer Chain
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most structurally important mechanic of the Foundation Program is not what a senior captain passes down to a cadet. It is what a CPL holder shares with a PPL student. What a first officer explains to a flight instructor who has never sat right-seat on a jet. What a low-timer with 300 hours knows about the PPL exam that a 50-hour student is still trying to pass. <strong>Every pilot is simultaneously a student and a resource — the chain runs in both directions at every level.</strong>
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The platform does not wait for pilots to reach the top before they contribute. It activates the knowledge they already have — structures it through modules, verifies it through the platform, and records it as a professional contribution. A pilot who has passed their CPL skills test last month knows something a PPL student needs to hear right now. That knowledge transfer is the chain.
          </p>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-6 rounded-r">
            <p className="text-white text-sm leading-relaxed">
              <strong style={{color:'#f87171'}}>The pilot does not contribute because they are told to. They contribute because it builds their Recognition Score, verifies their Leadership &amp; Teamwork competency, and advances their profile toward the thresholds operators require.</strong> The incentive is structural. The outcome is a self-replenishing knowledge network that grows automatically as the platform grows — no recruitment required, no senior assignment needed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="border-l-4 border-red-500 bg-red-50 px-5 py-4 rounded-r">
              <p className="font-bold text-slate-800 mb-2">What the 1st Year Gains</p>
              <ul className="space-y-1 text-slate-700 text-sm">
                {['Access to a peer who recently navigated what they are currently facing', 'A verified mentorship record from their first day on the platform', 'Honest, non-commercial guidance from someone with no financial incentive to mislead them', 'A model to follow — the 4th year is the proof that the process works', 'Recognition Score points from their very first mentorship session'].map(item => (
                  <li key={item} className="flex items-start gap-2"><span className="text-red-500 mt-1 flex-shrink-0">→</span><span>{item}</span></li>
                ))}
              </ul>
            </div>
            <div className="border-l-4 border-slate-400 bg-slate-50 px-5 py-4 rounded-r">
              <p className="font-bold text-slate-800 mb-2">What the 4th Year Gains</p>
              <ul className="space-y-1 text-slate-700 text-sm">
                {['Verified mentorship hours logged against their profile — visible to airlines', 'Recognition Score advancement in the Leadership & Teamwork competency band', 'Demonstrated consultation skills — a differentiator no type rating or logbook entry can provide', 'The formation of the habit of giving back — which defines what the platform\'s culture becomes', 'Priority pathway matching on airlines that weight mentorship hours in candidate assessment'].map(item => (
                  <li key={item} className="flex items-start gap-2"><span className="text-slate-500 mt-1 flex-shrink-0">→</span><span>{item}</span></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg px-6 py-5 mb-8 bg-white">
            <p className="text-xs uppercase tracking-wide font-semibold text-slate-500 mb-3">The Flywheel — How the Chain Compounds</p>
            <div className="flex flex-col md:flex-row items-center gap-3 text-sm text-slate-700 text-center">
              {['1st year enrolled', '4th year assigned', 'Both earn Recognition Score', '1st year becomes 4th year', '4th year becomes senior mentor', 'Senior mentor trains the next 4th year'].map((step, i, arr) => (
                <React.Fragment key={step}>
                  <div className="bg-slate-900 text-white rounded-lg px-3 py-2 text-xs font-semibold flex-1 min-w-0">{step}</div>
                  {i < arr.length - 1 && <span className="text-red-500 font-bold text-lg flex-shrink-0 hidden md:block">→</span>}
                </React.Fragment>
              ))}
            </div>
            <p className="text-slate-500 text-xs mt-4 text-center">The platform does not hire mentors. It produces them. Every pilot who is helped eventually helps another. The pool is self-replenishing.</p>
          </div>

          <h2 id="foundation-recognition-score" className="text-2xl font-bold text-slate-800 mt-10 mb-4 pb-2 border-b border-slate-300 scroll-mt-24">
            Core IV — Recognition Score Contribution
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The Recognition Score is the quantified output of the Foundation Program. It is not a grade. It is not a ranking. It is a live, verified composite of everything a pilot has actually done — and the Foundation Program is the primary mechanism through which that score is built at the early career stage.
          </p>
          <p className="text-slate-700 leading-relaxed mb-6 font-semibold text-slate-800 italic">
            "Your score grows when you learn. It grows again when you teach."
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-3 font-semibold">Foundation Activity</th>
                  <th className="text-left px-4 py-3 font-semibold text-red-400">Recognition Score Band</th>
                  <th className="text-left px-4 py-3 font-semibold" style={{color:'#34d399'}}>Weighting</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { activity: 'Mentorship hours received (per 10h block)', band: 'Professional Development', weight: 'Medium — signals investment from a senior pilot' },
                  { activity: 'Mentorship hours given (per 10h block)', band: 'Leadership & Teamwork (EBT)', weight: 'High — signals readiness to lead, not just follow' },
                  { activity: 'EBT consultation session completed', band: 'Competency Alignment', weight: 'High — directly mapped to airline assessment criteria' },
                  { activity: 'Gap analysis reviewed and actioned', band: 'Self-Awareness & Career Management', weight: 'Medium — signals the pilot understands where they stand' },
                  { activity: 'Foundation Program completion (50h)', band: 'Verified Formation', weight: 'High — unlocks Recognition+ eligibility and pathway submission' },
                  { activity: 'Peer mentorship chain contribution', band: 'Platform Contribution', weight: 'Bonus tier — pilots who give back rank higher in operator discovery pools' },
                ] as { activity: string; band: string; weight: string }[]).map((row, i) => (
                  <tr key={row.activity} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-200 text-xs align-top">{row.activity}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-red-400 font-medium text-xs align-top whitespace-nowrap">{row.band}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300 text-xs align-top">{row.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="foundation-missionary-model" className="text-2xl font-bold text-slate-800 mt-10 mb-4 pb-2 border-b border-slate-300 scroll-mt-24">
            Core V — The Advocacy Model
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The Foundation Program is not complete when the 50 hours are logged. It is complete when the pilot goes back out. The formation process follows a four-stage arc: <strong>Lost → Found → Transformed → Sent.</strong>
          </p>

          <div className="space-y-4 mb-8">
            {([
              { stage: 'Stage 1 — Lost', color: 'border-slate-400', bg: 'bg-slate-50', body: 'The pilot is trained but directionless. They have a licence. They have hours. They have debt. They do not have a map. No one has told them what the gap is, which operator is right for their profile, or what the industry actually needs from them right now. They are qualified. They are invisible.' },
              { stage: 'Stage 2 — Found', color: 'border-blue-400', bg: 'bg-blue-50', body: 'A mentor arrives. Not a salesperson. Not an algorithm. A pilot who has been where they are and found the way through. The Foundation Program begins. The gap is mapped. The route is structured. The profile starts to build. For the first time, the pilot sees exactly where they stand — and exactly what it takes to close the distance.' },
              { stage: 'Stage 3 — Transformed', color: 'border-amber-400', bg: 'bg-amber-50', body: 'The work is done. 50 hours of mentorship. EBT consultation sessions. Gap analysis actioned. Profile built, verified, and submitted. The pilot who emerges is not just more employable — they think differently. They carry themselves differently. They know what they\'re worth and they can prove it. Not because they say so. Because the record says so.' },
              { stage: 'Stage 4 — Sent', color: 'border-red-500', bg: 'bg-red-50', body: 'The formation is not complete until they go out. The pilot who was found now finds others. They walk into flight schools, crew rooms, and ramp areas. They sit across from 1st-year students. Not from a brochure — from experience. They show their Recognition Score. They show what the process produced. And they invite the next pilot into it. The chain never breaks.' },
            ] as { stage: string; color: string; bg: string; body: string }[]).map((item) => (
              <div key={item.stage} className={`border-l-4 ${item.color} ${item.bg} px-5 py-4 rounded-r`}>
                <p className="font-bold text-slate-900 mb-2">{item.stage}</p>
                <p className="text-slate-700 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-6 rounded-r">
            <p className="text-white text-sm leading-relaxed">
              <strong style={{color:'#f87171'}}>This is not a growth hack. It is a culture.</strong> The platform does not need a sales team to recruit pilots. It needs pilots who have been through the Foundation Program and know — from lived experience — that it changed what was possible for them. <strong style={{color:'#f87171'}}>Every pilot who goes out and brings another in is a continuation of the chain that started with a single phone call: "Ben, I quit flying."</strong>
            </p>
          </div>

          <div className="border border-slate-200 rounded-lg px-6 py-5 mb-10 bg-white">
            <p className="text-xs uppercase tracking-wide font-semibold text-slate-500 mb-3">Commercial Model — Foundation Program</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {[
                { tier: 'Free Tier', desc: 'Any pilot can enroll. Profile creation, gap analysis tool, and 10 hours of peer mentorship are available at no cost. The entry barrier is zero because the formation must be accessible to every pilot the industry has failed — including those who have no money left.', color: 'text-slate-600' },
                { tier: 'Foundation Complete', desc: '50-hour completion unlocks Recognition+ eligibility, pathway submission rights, and ATLAS CV generation. Verified by the platform. Recognised by every operator in the ecosystem.', color: 'text-blue-600' },
                { tier: 'Mentor Tier', desc: 'Pilots who give back 50+ mentorship hours are elevated to Mentor status — a verified designation visible on their profile. Airlines actively weight Mentor-tier pilots in pathway discovery because leadership formation at this level is a direct predictor of CRM performance.', color: 'text-red-600' },
              ].map((item) => (
                <div key={item.tier} className="border border-slate-200 rounded-lg p-4">
                  <p className={`font-bold mb-2 ${item.color}`}>{item.tier}</p>
                  <p className="text-slate-600 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <hr className="my-8 border-slate-200" />

          <h2 id="pillar-universities" className="text-3xl font-bold text-slate-900 mt-8 mb-6 pb-4 border-b border-slate-300 scroll-mt-24">
            AVIATION UNIVERSITIES &amp; ACADEMIES
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub A — Aviation Operators &amp; Training</p>
          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Problem: Universities Produce Graduates With No Verified Industry Connection</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Aviation degree programs and academies produce technically qualified graduates — and then hand them a certificate with no live connection to the industry that was supposed to receive them. Employment rates are tracked anecdotally. Operator requirements are not embedded in curriculum. A student can complete four years of aviation management or flight operations study and graduate with no verified record of what they are capable of, no pathway to the operators in their sector, and no mechanism to demonstrate that their academic training maps to real-world requirements.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { t: 'What Universities Must Contribute', items: ['Automatic platform enrollment for all incoming students from day one', 'Curriculum-to-pathway alignment: course modules mapped to verified operator requirements', 'Graduate outcome data: employment rates, time-to-employment, sector placement', 'Academic performance records feeding the Recognition Profile'] },
              { t: 'What Universities Gain', items: ['Demonstrable ROI: verified placement rates attract 30% more applicants', '"Verified Graduate" status differentiating graduates from unverified degree holders', 'Direct airline partnerships through the platform ecosystem', 'Research access to anonymised industry data for evidence-based curriculum development'] },
            ].map(col => (
              <div key={col.t} className="border border-slate-200 rounded-lg p-5 bg-white">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">{col.t}</p>
                <ul className="space-y-1 text-sm text-slate-700">{col.items.map(i => <li key={i} className="flex gap-2"><span className="text-red-500 flex-shrink-0">→</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>

          <hr className="my-8 border-slate-200" />

          <h2 id="pillar-recruitment" className="text-3xl font-bold text-slate-900 mt-8 mb-6 pb-4 border-b border-slate-300 scroll-mt-24">
            AVIATION RECRUITMENT AGENCIES
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub A — Aviation Operators &amp; Training</p>
          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Problem: Recruiters Are Competing on Volume, Not Quality</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Aviation recruitment agencies operate on a model that is structurally misaligned with the industry's actual problem. They charge a percentage of first-year salary — typically 15–20% — for placing pilots who are unverified, sourced from the same generic CV pool, and frequently mismatched to the operator. A $200,000 Captain placement costs the operator $40,000 in agency fees, plus full verification costs on top, plus a 60–90 day lead time. If the pilot leaves within 12 months, the entire cost is absorbed with nothing to show for it.</p>
          <p className="text-slate-700 leading-relaxed mb-6">The platform ends the percentage-of-salary model. Recruitment agencies that integrate with the Pre-Cleared Pipeline access a pool of verified, pathway-matched candidates — and earn a flat success fee per verified placement, with volume bonuses and recurring revenue from candidate verified status subscriptions.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { t: 'Integration Requirements', items: ['API access to Pre-Cleared Pipeline for verified candidates only', 'Success fees only — no upfront placement fees', 'No resume spam: only pull profiles with explicit pilot consent', 'Audit trail of all candidate interactions and placement outcomes'] },
              { t: 'What Agencies Gain', items: ['Pre-cleared candidates: no cold calling, no unverified CV screening', '3x better retention rates vs. traditional placement model', '70% reduction in candidate screening time', 'New revenue stream: annual "verified status" subscriptions for candidates in pipeline'] },
            ].map(col => (
              <div key={col.t} className="border border-slate-200 rounded-lg p-5 bg-white">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">{col.t}</p>
                <ul className="space-y-1 text-sm text-slate-700">{col.items.map(i => <li key={i} className="flex gap-2"><span className="text-red-500 flex-shrink-0">→</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-10 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>The fee comparison:</strong> Executive search firm = $40,000+ per Captain hire, 60–90 day lead time, no pre-verification, full background check still required. PilotRecognition Enterprise = <strong style={{color:'#f87171'}}>$1,512 total cost to hire, same day, pre-verified candidate.</strong> Agencies that price against this reality will win the market. Agencies that don't will lose it.</p>
          </div>

          <hr className="my-10 border-slate-300" />

          {/* HUB C */}
          <h1 id="hub-c-capital" className="text-4xl font-bold text-slate-900 mt-12 mb-3 pb-4 border-b-2 border-slate-900 scroll-mt-24">
            HUB C — CAPITAL, RISK &amp; COMPLIANCE
          </h1>
          <p className="text-xs font-bold tracking-widest uppercase text-red-600 mb-6">Banking · Insurance · Regulatory Bodies · The Financial Layer</p>
          <p className="text-slate-700 leading-relaxed mb-6 text-lg">Hub C connects the financial and regulatory infrastructure of aviation to the verified pilot data layer. Banks price aviation loans on incomplete information. Insurers underwrite on static logbooks. Regulators audit on paper. Hub C replaces all three models with live, cryptographically verified pilot data — making every capital and compliance decision in aviation more accurate, less risky, and faster to execute.</p>
          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-10 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>The core proposition for Hub C partners:</strong> A pilot actively progressing through a verified pathway on this platform is the most legible financial and compliance signal in aviation. <strong style={{color:'#f87171'}}>Banks can lend against it. Insurers can price against it. Regulators can audit against it. For the first time, the financial layer of aviation has a data substrate it can actually trust.</strong></p>
          </div>

          <h2 id="pillar-8-banking" className="text-3xl font-bold text-slate-900 mt-8 mb-6 pb-4 border-b border-slate-300 scroll-mt-24">
            PILLAR 8: BANKING &amp; FINANCIAL INSTITUTIONS
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub C — Capital, Risk &amp; Compliance</p>
          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Problem: Aviation Loans Are Priced on Ignorance</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Banks view pilot training loans as high-risk instruments — and with good reason. The conventional pipeline has a catastrophic ROI failure rate. A pilot borrows $50,000–$80,000 for training, graduates into a flight instructor role paying $800/month, and services the loan for a decade before reaching the salary that justified the investment. Default rates are high. Recovery is low. The result: predatory interest rates, restrictive collateral requirements, and near-total absence of structured aviation financing in most markets.</p>
          <p className="text-slate-700 leading-relaxed mb-6"><strong>The information failure is the credit failure.</strong> Banks are not pricing the pilot — they are pricing the absence of a verifiable track record. A pilot who cannot demonstrate active pathway progression, verified hours, and operator alignment is indistinguishable from one who has abandoned training entirely.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { t: 'What Banks Must Publish', items: ['Transparent lending criteria and minimum thresholds', 'Recognition Score bands that unlock lower interest rates', 'Pathway-linked loan products: type rating financing, program fees', 'Repayment deferral triggers tied to verified employment status'] },
              { t: 'What Banks Gain', items: ['Real-time pathway progression as predictive collateral', 'Verified employment event triggers for disbursement and collection', 'Dynamic risk adjustment as pilot profile strengthens', 'Access to the only structured aviation-specific borrower dataset in existence'] },
            ].map(col => (
              <div key={col.t} className="border border-slate-200 rounded-lg p-5 bg-white">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">{col.t}</p>
                <ul className="space-y-1 text-sm text-slate-700">{col.items.map(i => <li key={i} className="flex gap-2"><span className="text-red-500 flex-shrink-0">→</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-10 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>The platform insight:</strong> A pilot who completes the Foundation Program, maintains a Recognition+ profile, and has an active pathway submission against a verified airline is not a credit risk. They are a <strong style={{color:'#f87171'}}>measurable income event in progress.</strong> Banks that price this correctly will own the aviation training finance market. Banks that don't will keep losing it to cash-strapped pilots who borrow from family.</p>
          </div>

          <hr className="my-8 border-slate-200" />

          <h2 id="pillar-9-insurance" className="text-3xl font-bold text-slate-900 mt-8 mb-6 pb-4 border-b border-slate-300 scroll-mt-24">
            PILLAR 9: AVIATION INSURANCE PROVIDERS
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub C — Capital, Risk &amp; Compliance</p>
          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Problem: Actuaries Are Pricing Dead Paper</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Aviation insurance underwriting is built on static logbook submissions, self-reported flight hours, and historical incident records that are incomplete, manually compiled, and unverifiable at scale. Actuarial tables are calibrated on lagging indicators. A pilot who completed 200 simulator hours last month — demonstrating high recency and cognitive proficiency — is priced identically to one who has not flown in six months. <strong>The model cannot distinguish between them because the data infrastructure to do so has never existed.</strong></p>
          <p className="text-slate-700 leading-relaxed mb-6">The result is systematic mispricing in both directions: over-pricing active, proficient pilots who are charged for risks they don't carry, and under-pricing inactive or degraded pilots whose risk has not been captured by the static record.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { t: 'What Insurers Must Publish', items: ['Dynamic premium pricing tiers linked to Recognition Score bands', 'Explicit simulator and EBT metric thresholds for premium reduction', 'Real-time recency weighting disclosure', 'Incident history ingestion requirements and API schema'] },
              { t: 'What Insurers Gain', items: ['The most accurate actuarial dataset in aviation history', 'Real-time proficiency signals replacing static logbook submissions', 'Dynamic premium adjustment capability as pilot records update', 'Fraud elimination: verified credential records replace self-reported data'] },
            ].map(col => (
              <div key={col.t} className="border border-slate-200 rounded-lg p-5 bg-white">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">{col.t}</p>
                <ul className="space-y-1 text-sm text-slate-700">{col.items.map(i => <li key={i} className="flex gap-2"><span className="text-red-500 flex-shrink-0">→</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-10 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>The actuarial opportunity:</strong> A verified Recognition+ pilot with logged simulator sessions, EBT consultation completions, and a current medical certificate is a fundamentally different risk profile from an unverified pilot with equivalent hours on paper. <strong style={{color:'#f87171'}}>Insurers who can price that distinction will acquire the most commercially active segment of the pilot population at a structural cost advantage.</strong></p>
          </div>

          <hr className="my-8 border-slate-200" />

          <h2 id="pillar-10-regulatory" className="text-3xl font-bold text-slate-900 mt-8 mb-6 pb-4 border-b border-slate-300 scroll-mt-24">
            PILLAR 10: LEGAL &amp; REGULATORY BODIES
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub C — Capital, Risk &amp; Compliance</p>
          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Problem: Compliance Audits Are Manual, Slow, and Legally Exposed</h3>
          <p className="text-slate-700 leading-relaxed mb-4">In the event of an aviation incident, the competency and credentialing trail of the involved crew must be reconstructed manually — from paper logbooks, employment records, medical files, and training documentation held across multiple jurisdictions and institutions. This process takes weeks, introduces error at every transfer point, and exposes hiring organisations to negligent-hiring liability when gaps in the record surface post-incident.</p>
          <p className="text-slate-700 leading-relaxed mb-6">Regulatory authorities (CAAP, FAA, GCAA, EASA) operate compliance frameworks that assume paper-based submissions. Cross-border license recognition requires manual validation. ICAO standardisation mandates exist in policy but have no operational infrastructure to enforce them at the individual pilot level.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { t: 'What Regulators Must Publish', items: ['Compliance standards directly on the platform (FAA PRD mandates, ICAO Annex 1 requirements)', 'Cross-border licence recognition criteria and validation timelines', 'Jurisdiction-specific medical and recency requirements', 'Structured incident reporting schemas compatible with platform data architecture'] },
              { t: 'What Regulators Gain', items: ['Immutable, cryptographically secured audit trail for every pilot credential event', 'Automated cross-border licence recognition validation', 'Complete insulation from negligent-hiring liability for platform-verified hires', 'Real-time compliance submission replacing periodic paper audits'] },
            ].map(col => (
              <div key={col.t} className="border border-slate-200 rounded-lg p-5 bg-white">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">{col.t}</p>
                <ul className="space-y-1 text-sm text-slate-700">{col.items.map(i => <li key={i} className="flex gap-2"><span className="text-red-500 flex-shrink-0">→</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-10 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>The compliance architecture:</strong> A pilot hired through a verified pathway comes with an instant, cryptographically secure compliance dossier — license status, medical currency, background check record, training history, and EBT assessment results. <strong style={{color:'#f87171'}}>A regulator reviewing a platform-verified hire does not reconstruct a record. They access one that has been continuously maintained.</strong></p>
          </div>

          <hr className="my-10 border-slate-300" />

          {/* HUB D */}
          <h1 id="hub-d-infrastructure" className="text-4xl font-bold text-slate-900 mt-12 mb-3 pb-4 border-b-2 border-slate-900 scroll-mt-24">
            HUB D — INFRASTRUCTURE &amp; DATA
          </h1>
          <p className="text-xs font-bold tracking-widest uppercase text-red-600 mb-6">Flight Data · Aeromedical · Verified Ingestion Pipelines · The Technology Layer</p>
          <p className="text-slate-700 leading-relaxed mb-6 text-lg">Hub D integrates the data sources that pilots already use — navigation apps, logbook software, medical examiners — into the verified pilot profile. Every logbook entry a pilot makes in ForeFlight, every medical certificate issued by a DAME, every simulator session logged in Navigraph should flow directly into their professional identity. Hub D builds those pipelines.</p>
          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-10 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>The data isolation problem:</strong> Pilots use dozens of tools to manage their professional life. None of them talk to each other. None of them feed a verified professional record. The hours logged in ForeFlight are invisible to the airline reviewing a CV. The medical signed by the AME is a paper document that cannot be queried at scale. <strong style={{color:'#f87171'}}>Hub D ends the isolation. Every data source becomes a verified input to the pilot's single professional identity.</strong></p>
          </div>

          <h2 id="pillar-12-flight-data" className="text-4xl font-bold text-slate-900 mt-12 mb-6 pb-4 border-b-2 border-slate-900 scroll-mt-24">
            PILLAR 12: FLIGHT DATA &amp; NAVIGATION APPS
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub D — Infrastructure &amp; Data</p>

          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">I. Executive Overview: The Invisible Telemetry Problem</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Navigraph, ForeFlight, Garmin Pilot, SkyDemon, and desktop simulation platforms collectively capture millions of hours of granular pilot activity every month. Route planning architecture, airspace communication loops, approach currency records, and real-time weather decision-making patterns are continuously logged — yet they remain professionally invisible. They do not appear on a CV, they cannot be parsed by an airline Applicant Tracking System (ATS), and they contribute zero equity to a pilot's active job hunt.</p>
          <p className="text-slate-700 leading-relaxed mb-6">This represents a structural failure in data utilization. A pilot who logs dozens of hours mastering complex IFR routing or executing high-fidelity simulator profiles is demonstrably maintaining sharp cognitive currency. Currently, that currency is unverifiable.</p>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-6 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>The Data Silo Crisis:</strong> Flight applications operate primarily as <strong>consumer utilities rather than professional validation tools.</strong> A pilot generating highly predictive operational performance data has no mechanism to prove it, the airline has no way to search for it, and the application provider cannot leverage it beyond flat subscription fees. <strong style={{color:'#f87171'}}>Three distinct stakeholders, one broken data loop, zero collective value capture.</strong></p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">II. Stakeholder Pain Points</h3>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">For Pilots: The Invisible Competency Bottleneck</h4>
          <ul className="space-y-2 mb-6">
            {[
              { n: '1', t: 'Proficiency Evaporation', d: <>Advanced metrics — such as instrument approach diversity, holding pattern precision, and weather avoidance strategies — remain locked behind closed application screens, <strong>vanishing from professional profiles</strong> during employment transitions or gaps.</> },
              { n: '2', t: 'Orphaned Simulation Assets', d: <>High-fidelity hours logged on desktop simulators (X-Plane, MSFS) or fixed Flight Training Devices (FTDs) offer clear evidence of procedural proficiency but are <strong>entirely disregarded by airline recruiters</strong> due to a lack of source verification.</> },
              { n: '3', t: 'Proprietary Format Isolation', d: <>Closed, fragmented data structures prevent pilots from aggregating their multi-platform logs into a <strong>single, cohesive, and transportable career dossier.</strong></> },
            ].map((item) => (
              <li key={item.n} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong style={{color:'#dc2626'}}>{item.n}. {item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">For Flight Data Providers: The Commercial Glass Ceiling</h4>
          <ul className="space-y-2 mb-6">
            {[
              { n: '1', t: 'Subscription-Locked Monetization', d: <>Revenue models remain heavily restricted to <strong>consumer-tier subscriptions</strong>, completely missing high-margin B2B enterprise licensing, airline recruitment partnerships, and insurance analytics pipelines.</> },
              { n: '2', t: 'Post-Employment Attrition', d: <>The moment a pilot secures a mainline carrier position, the professional utility of personal flight-planning apps drops significantly, resulting in <strong>predictable, structural subscription churn.</strong></> },
            ].map((item) => (
              <li key={item.n} className="ml-6 text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                <span><strong style={{color:'#dc2626'}}>{item.n}. {item.t}</strong> — {item.d}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">III. The Architecture of Verified Telemetry Integration</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Pillar 12 re-architects flight data platforms into <strong>core professional credentialing infrastructure.</strong> By deploying secure API integrations between navigation providers, EFBs, simulation networks, and the PilotRecognition Professional Standing Asset, raw pilot telemetry is transformed into secure, portable Competency Tokens.</p>

          <div className="bg-slate-900 rounded-lg px-5 py-4 mb-5 text-sm font-mono">
            <div className="space-y-1 text-slate-300">
              <p><span className="text-emerald-400">[Application / Simulation Session]</span></p>
              <p><span className="text-slate-500">↓</span></p>
              <p><span className="text-emerald-400">[Automated API Ingestion]</span> ──> <span className="text-emerald-400">[Platform Anti-Spoofing Protocols]</span></p>
              <p><span className="text-slate-500">↓</span></p>
              <p><span className="text-emerald-400">[Pilot's Cryptographic Wallet Token]</span></p>
              <p><span className="text-slate-500">↓</span></p>
              <p><span className="text-emerald-400">[Airline Sourcing Pipeline]</span></p>
            </div>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">1. Technical Ingestion Architecture</h4>
          <ul className="list-disc list-inside space-y-1 text-slate-700 mb-5 ml-4">
            <li><strong>Data Capture Layer:</strong> The integrated flight application records the active session telemetry (trajectories, approach tracking, weather variables, simulation parameters).</li>
            <li><strong>Verification Node Processing:</strong> Telemetry is bound to an atomic timestamp, device hardware signature, and optional ATO/instructor countersignature.</li>
            <li><strong>API Bridge Transmission:</strong> Standardized data payloads are pushed securely to the PilotRecognition Ingestion Engine.</li>
            <li><strong>Sovereign Ledger Minting:</strong> A cryptographically signed token (e.g., Verified IFR Currency: 50 Hours) is deposited directly into the pilot's decentralized wallet.</li>
          </ul>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">2. Tiered Data Verification Protocols</h4>
          <p className="text-slate-700 leading-relaxed mb-4">To ensure analytical integrity for airline recruiters, incoming telemetry is weighted via four strict confidence tiers:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-700 mb-5 ml-4">
            <li><strong>Level 1 — Self-Reported:</strong> Manual logbook entries or user-exported flight files. Minimal validation weight.</li>
            <li><strong>Level 2 — Device-Verified:</strong> Automated application/GPS tracking backed by cryptographic device fingerprinting and anti-spoofing hashing.</li>
            <li><strong>Level 3 — Institutionally Countersigned:</strong> Simulator training center, flight school, or ATO-validated sessions verifying formal instructional parameters.</li>
            <li><strong>Level 4 — Multi-Source Triangulated:</strong> Telemetry run through the Platform Telemetry Mirror, cross-referencing log entries directly against live global ADS-B transponder tracking networks.</li>
          </ul>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">3. Platform Neutrality: The Non-Competitive Infrastructure Standard</h4>
          <p className="text-slate-700 leading-relaxed mb-4">A foundational tenet of the PilotRecognition architecture is <strong>absolute infrastructure neutrality.</strong> The platform does not compete with flight data apps, nor does it pick ecosystem winners or losers.</p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4 mb-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">The Neutrality Framework</p>
            <div className="space-y-2 text-sm text-slate-700">
              <p><strong>No Verification Authority:</strong> PilotRecognition never unilaterally alters or validates telemetry. It functions strictly as a secure conduit, leaving verification authority to independent decentralized nodes (ATOs, regulatory bodies, simulator centers).</p>
              <p><strong>Zero Product Competition:</strong> PilotRecognition does not build, own, or operate digital logbooks, EFBs, or navigation chart software. We do not compete with our partners. Our sole mission is to turn their data into verified professional currency.</p>
              <p><strong>Equal Treatment Doctrine:</strong> Every integrated platform utilizes identical API protocols, validation metrics, and carrier visibility channels. Telemetry weight is dictated purely by its verification level, never by the brand size of the application provider.</p>
              <p><strong>Sovereign Control:</strong> Pilots retain absolute keys to their records. No data can be accessed, surfaced, or transferred without an explicit cryptographic signature from the pilot's wallet.</p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">IV. The Pilot-First Network Referral Loop</h3>
          <p className="text-slate-700 leading-relaxed mb-4">We believe the pilots who build this network through active flight logs and simulator tracking should be the primary beneficiaries of its growth. Rather than paying opaque corporate data brokers, PilotRecognition aligns application developers and aviators via a clean, structured financial mechanism.</p>

          <h4 className="text-lg font-bold text-slate-800 mt-6 mb-3">The $20 Ecosystem Referral Dividend</h4>
          <p className="text-slate-700 leading-relaxed mb-4">When an integrated application partner (e.g., Navigraph, ForeFlight, SkyDemon) successfully onboards a pilot onto the PilotRecognition network, a <strong>$20 Ecosystem Referral Dividend</strong> is automatically unlocked upon the activation of that pilot's premium Recognition+ career profile.</p>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-5 py-4 mb-5">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3">Referral Economics</p>
            <div className="space-y-2 text-sm text-slate-700">
              <p><strong>Direct Allocation:</strong> The $20 dividend is distributed directly back to the originating partner application's infrastructure ledger.</p>
              <p><strong>LTV Optimization:</strong> Pilots are incentivized to maintain active, continuous app subscriptions because those subscriptions serve as the verified data pipe driving their live hiring profile. Churn drops significantly, extending pilot customer lifetime value.</p>
              <p><strong>Ecosystem Incentivization:</strong> This dividend motivates app developers to design deeper, cleaner, and highly advanced career-tracking utilities for pilots, transforming a basic consumer tool into an active professional accelerator.</p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">V. Application Integration Matrix</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Platform Classification</th>
                  <th className="text-left px-4 py-2 font-semibold">Primary Activity Input</th>
                  <th className="text-left px-4 py-2 font-semibold">Verified Wallet Token Generated</th>
                  <th className="text-left px-4 py-2 font-semibold">Downstream Airline Marketplace Visibility</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { t: 'Navigation & Charting (e.g., Navigraph, SkyDemon)', c: 'Route planning architectures, procedure selections, weather maps', v: 'Operational Currency Token (Measures routing complexity and approach diversity)', a: 'Demonstrates a pilot maintaining high cognitive familiarity with international terminal airspaces and changing weather logic.' },
                  { t: 'EFBs & Digital Logbooks (e.g., ForeFlight, Garmin Pilot)', c: 'Flight block tracking, manual logs, airframe times', v: 'Verified Flight Time Token (Cryptographically anchored to hardware logs)', a: 'Delivers fully verified flight times that bypass manual review and instantly clear ATS parsing constraints.' },
                  { t: 'Desktop Simulation (e.g., X-Plane, MSFS)', c: 'Systems management, failure checklists, procedure repetition', v: 'Simulator Proficiency Token (Validated via telemetry files and instructor hashes)', a: 'Showcases superior procedural familiarity and advanced type-specific cockpit readiness prior to formal airline screening.' },
                  { t: 'ATC Simulation Networks (e.g., PilotEdge, VATSIM)', c: 'Live radio phraseology, airspace structure interactions, controller compliance', v: 'CRM & Communication Token (Tracks transmission density and phraseology precision)', a: 'Establishes objective proof of radio proficiency and situational awareness, giving low-hour pilots a clear hiring edge.' },
                ].map((row, i) => (
                  <tr key={row.t} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">{row.t}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.c}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.v}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-400">{row.a}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-900 border-l-4 border-emerald-500 px-5 py-4 mb-6 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#34d399'}}>The Competitive Moat: Separating Toys from Tools</strong></p>
            <p className="text-white text-sm leading-relaxed mt-2">Once a flight application plugs into the PilotRecognition ecosystem, it shifts from an isolated consumer app to an indispensable professional asset. Platforms that refuse to provide data sovereignty to their pilots will be relegated to entertainment novelties. The platforms that champion pilot data ownership and direct airline routing will become the unquestioned industry standard for serious pilots.</p>
            <p className="text-white text-sm leading-relaxed mt-2"><strong style={{color:'#34d399'}}>The Pilot Value Proposition:</strong> You own your data — it is time you used it to advance your career.</p>
          </div>

          <hr className="my-8 border-slate-200" />

          <h2 id="pillar-13-aeromedical" className="text-3xl font-bold text-slate-900 mt-8 mb-6 pb-4 border-b border-slate-300 scroll-mt-24">
            PILLAR 13: AEROMEDICAL EXAMINERS (AMEs)
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub D — Infrastructure &amp; Data</p>
          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Problem: Medical Certificates Are the Most Forgeable Document in Aviation</h3>
          <p className="text-slate-700 leading-relaxed mb-4">A Class 1 medical certificate is a paper document with a stamp. Airlines receive it as a self-submitted file. There is no real-time queryable record of whether it is current, whether it was issued by an authorised examiner, or whether the pilot's medical status has changed since issuance. Fraud is straightforward. Expiry is invisible. The compliance gap between issuance and airline verification is unmeasured.</p>
          <p className="text-slate-700 leading-relaxed mb-6">AMEs who issue medical certificates carry no structured pipeline for communicating status to hiring organisations. They operate at the end of a paper chain that has not been modernised since the introduction of the original certificate format.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { t: 'What AMEs Must Provide', items: ['Digital validation signatures on issued certificates', 'Expiry dates and class designations ingested directly into pilot profiles', 'Direct authentication via secured practitioner portal', 'Real-time status updates when certificate is renewed, suspended, or revoked'] },
              { t: 'What AMEs Gain', items: ['Elimination of verification fraud and forged certificate inquiries', 'Reduced administrative load from airline verification requests', 'Modernised digital health ledger replacing paper-based records', 'Recognised status as a verified data provider in the platform ecosystem'] },
            ].map(col => (
              <div key={col.t} className="border border-slate-200 rounded-lg p-5 bg-white">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">{col.t}</p>
                <ul className="space-y-1 text-sm text-slate-700">{col.items.map(i => <li key={i} className="flex gap-2"><span className="text-red-500 flex-shrink-0">→</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-10 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>The medical integrity layer:</strong> When an airline queries a pilot profile on this platform, the medical certificate status is not self-reported — it is AME-verified and timestamped. <strong style={{color:'#f87171'}}>A pilot cannot submit a pathway application with an expired or unverified medical. The system enforces what the industry currently relies on honesty to maintain.</strong></p>
          </div>

          <hr className="my-10 border-slate-300" />

          {/* HUB E */}
          <h1 id="hub-e-community" className="text-4xl font-bold text-slate-900 mt-12 mb-3 pb-4 border-b-2 border-slate-900 scroll-mt-24">
            HUB E — COMMUNITY, STRATEGY &amp; GROWTH
          </h1>
          <p className="text-xs font-bold tracking-widest uppercase text-red-600 mb-6">Pilot Mentors · Unions · Manufacturers · OEMs · The Cultural Layer</p>
          <p className="text-slate-700 leading-relaxed mb-6 text-lg">Hub E is where the platform's flywheel closes. The data produced by Hubs A through D creates macro-level intelligence that manufacturers need to build the right aircraft, unions need to negotiate the right conditions, and mentors need to guide the next generation with accurate market knowledge. Hub E connects those stakeholders to the living data layer they have never had access to before.</p>

          <h2 id="pillar-14-mentors" className="text-3xl font-bold text-slate-900 mt-8 mb-6 pb-4 border-b border-slate-300 scroll-mt-24">
            PILLAR 14: PILOT CONTRIBUTORS, MENTORS &amp; UNIONS
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub E — Community, Strategy &amp; Growth</p>
          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Problem: Senior Pilots Have No Mechanism to Pass Knowledge Down</h3>
          <p className="text-slate-700 leading-relaxed mb-4">A 15,000-hour Captain retiring from a major carrier carries an irreplaceable cargo of operational knowledge, sector intelligence, and institutional memory. There is no structured mechanism for that knowledge to be transmitted to the pilots entering the industry who need it most. Mentorship in aviation is informal, ad hoc, and entirely dependent on personal network access — which 200-hour pilots, by definition, do not have.</p>
          <p className="text-slate-700 leading-relaxed mb-6">Unions negotiate on behalf of pilot cohorts using industry data that is incomplete, delayed, and aggregated to the point of uselessness for individual career decisions. A union negotiating salary bands does not know whether the cohort it represents has an average Recognition Score that justifies a renegotiation — because that metric has never existed.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { t: 'What Mentors & Unions Contribute', items: ['Senior pilots post verified mentorship availability on the platform', 'Junior pilots log consulting hours, leadership initiatives, and community contributions', 'Unions publish aggregated salary data, collective agreement terms, and negotiation precedents', 'Pre-Experience Portfolios: constructivism and leadership verified before 1,500 hours'] },
              { t: 'What They Gain', items: ['Junior pilots: a verified professional presence that bypasses the invisible 200-hour problem', 'Senior pilots: a structured legacy mechanism with a Recognition Score multiplier for hours given', 'Unions: aggregated Recognition Score data to negotiate collective benefits and group insurance rates', 'The platform contribution that makes the entire ecosystem function — without mentors, the chain breaks'] },
            ].map(col => (
              <div key={col.t} className="border border-slate-200 rounded-lg p-5 bg-white">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">{col.t}</p>
                <ul className="space-y-1 text-sm text-slate-700">{col.items.map(i => <li key={i} className="flex gap-2"><span className="text-red-500 flex-shrink-0">→</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>

          <hr className="my-8 border-slate-200" />

          <h2 id="pillar-15-manufacturers" className="text-3xl font-bold text-slate-900 mt-8 mb-6 pb-4 border-b border-slate-300 scroll-mt-24">
            PILLAR 15: MANUFACTURERS &amp; OEMs
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub E — Community, Strategy &amp; Growth</p>

          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Why Airbus and Boeing Are Among the Most Strategic Enterprise Players on This Platform</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Airbus is not on PilotRecognition to hire a handful of test pilots. Their entire multi-billion-dollar business model depends on airlines being able to crew the aircraft they sell. When Airbus pitches a $10 billion order of A350s to an airline, the airline's board asks one question: <strong>"Do we have the crew to operate these in 24 months?"</strong> If the answer is no, the order gets delayed or downsized. PilotRecognition is the only platform in existence that can answer that question with live, verified data.</p>
          <p className="text-slate-700 leading-relaxed mb-6">This makes the manufacturer relationship fundamentally different from a standard airline HR subscription. <strong>The use case is macro-intelligence and training pipeline management — not individual recruitment.</strong> The pricing, the product, and the pitch must reflect that.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {([
              {
                n: '1',
                title: 'The Fleet Sale Dealbreaker',
                color: '#f87171',
                body: 'When Airbus pitches a $10B A350 order, the airline asks: "Do we have crew to operate these in 24 months?" PilotRecognition answers that question live. Airbus tells the airline: "Our platform data shows 1,200 A350-rated pilots in region, 800 more completing training this year." That data point closes aircraft orders. The platform is worth more to Airbus sales than it is to airline HR.',
              },
              {
                n: '2',
                title: 'The Airbus Flight Academy Pipeline',
                color: '#60a5fa',
                body: 'Airbus operates one of the largest pilot training organisations in the world — A320 and A330 type rating centers globally. PilotRecognition lets them publish "Airbus Verified Graduate" pathways, funnelling freshly type-rated pilots directly to the airlines that just bought their planes. Their training centers become infinitely more attractive to student pilots. Graduate placement rates are verified, not self-reported.',
              },
              {
                n: '3',
                title: 'EBT & Anonymised Competency Data',
                color: '#34d399',
                body: 'As aviation moves toward Evidence-Based Training (EBT), manufacturers need to understand how pilots interact with their flight decks. Anonymised, aggregated platform data answers: "What is the average transition time from a Boeing 737 to an Airbus A320?" That macro data is worth its weight in gold for engineering and training curriculum design — and it never exposes individual pilot identities.',
              },
            ] as {n:string;title:string;color:string;body:string}[]).map((item) => (
              <div key={item.n} className="border border-slate-200 rounded-lg px-5 py-5 bg-white">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-black text-lg" style={{color: item.color}}>{item.n}</span>
                  <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-8 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>The connective tissue Airbus has never had:</strong> <span className="text-slate-300">PilotRecognition is the only platform that connects the planes Airbus builds to the humans who fly them — with live, verified, real-time data. The platform tells Airbus what the demand curve for A321XLR type ratings looks like 18 months before the aircraft enter service. It tells Boeing where the 737 MAX crew shortage is most acute. It tells Cessna exactly which cohort of student pilots are actively pursuing single-engine time-building pathways right now. <strong style={{color:'#f87171'}}>None of this intelligence exists anywhere else. It only exists because pilots are using the platform.</strong></span></p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">The Problem: Manufacturers Build on Lagging Indicators</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Airbus builds simulators based on fleet transition announcements that are years old by the time they reach production. Boeing calibrates type rating curriculum against operator orders that reflect decisions made two market cycles ago. Cessna targets marketing at pilot cohorts that have already moved to the next stage of training. <strong>The entire manufacturing and OEM ecosystem operates on the rear-view mirror.</strong></p>
          <p className="text-slate-700 leading-relaxed mb-6">Meanwhile, the platform generates real-time leading indicators: which type ratings pilots are pursuing, which pathway cards are generating the most interest, which aircraft types are creating the largest gap between supply and demand. This macro-intelligence is the most commercially valuable dataset in aviation — and manufacturers have never had access to it.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { t: 'What Manufacturers Must Publish', items: ['Macro-level fleet transition announcements and future aircraft capability specs', 'Type rating curriculum updates and simulator availability schedules', 'OEM-specific pathway integration requirements for sponsored type ratings', '"OEM Verified Graduate" pathway cards for training center alumni', 'Enterprise Data Insights subscription requirements for accessing platform trend data'] },
              { t: 'What Manufacturers Gain', items: ['Live pilot supply/demand data by aircraft type — 18 months ahead of order fulfillment', 'If pathway data shifts toward A321 qualifications, Airbus adapts simulator production before the demand peak', 'Targeted reach to pilots at the exact moment they are evaluating a type rating investment', '"OEM Verified Graduate" pipeline that makes training centers more attractive to student pilots', 'Anonymised EBT competency data for aircraft design and training curriculum development'] },
            ].map(col => (
              <div key={col.t} className="border border-slate-200 rounded-lg p-5 bg-white">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">{col.t}</p>
                <ul className="space-y-1 text-sm text-slate-700">{col.items.map(i => <li key={i} className="flex gap-2"><span className="text-red-500 flex-shrink-0">→</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">The Pilot-First OEM Architecture — How Manufacturers Interact With This Platform</h3>

          <div className="bg-slate-900 rounded-xl px-8 py-6 mb-6">
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-3">The Governing Rule — Non-Negotiable</p>
            <p className="text-white text-sm leading-relaxed mb-0"><strong style={{color:'#f87171'}}>The Pilot-First OEM Rule:</strong> <span className="text-slate-300">Manufacturers are granted access to platform macro-intelligence not to commoditise the pilot pool, but to invest in it. OEMs interact with aggregated, anonymised fleet-demand data only. They may interact with individual pilots solely through direct training sponsorships, OEM-certified credentialing, or explicit pilot-opted employment pathways. No OEM may passively extract individual pilot data. No OEM may use platform intelligence to suppress hiring standards or advocate for wage compression. Access is a privilege extended in exchange for contribution to the pilot ecosystem.</span></p>
          </div>

          <p className="text-slate-700 leading-relaxed mb-6">If manufacturers are treated as pure data consumers extracting intelligence from the pilot network, the platform becomes a corporate surveillance tool. Pilots will leave. The network dies. The value of the data collapses. <strong>The only sustainable model is one where OEM access creates direct, measurable value for the pilots whose data makes the intelligence possible.</strong> These four mechanisms enforce that at the architectural level — not just as policy.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {([
              {
                n: '1',
                title: 'Sponsor the Source — OEM Sponsorship Pathways',
                color: '#34d399',
                rule: 'Pilot-First mechanism: manufacturers fund the gap they identify.',
                body: 'If macro-intelligence reveals a shortage of type-rated pilots threatening a fleet sale, the manufacturer does not lobby airlines to lower their hiring minimums. They publish an OEM Sponsorship Pathway — offering to fully or partially fund type ratings for verified, high-aptitude pilots on the platform. The manufacturer spends $1.5M to sponsor 50 type ratings. The fleet sale closes. The pilot gets a career-changing credential at zero or reduced cost. The airline gets the crew. Everyone wins — because the manufacturer invested in the foundation instead of eroding it.',
              },
              {
                n: '2',
                title: 'Zero-Knowledge Macro Data Only',
                color: '#60a5fa',
                rule: 'Architecturally enforced: OEMs buy trends, not targets.',
                body: 'The data architecture hardcodes what manufacturers can see. They see: "412 verified A320 First Officers in Southeast Asia with 1,500+ hours." They never see names, contact information, or individual profiles. Individual pilots remain completely invisible unless they explicitly tap APPROVE to share their profile with a specific OEM employment pathway — such as a factory test pilot or simulator instructor role. Anonymisation is not a privacy policy. It is enforced at the data layer. There is no override.',
              },
              {
                n: '3',
                title: 'Direct Pilot-to-OEM Feedback Loop',
                color: '#f87171',
                rule: 'Pilots speak directly to manufacturers — bypassing airline bureaucracy.',
                body: 'When a manufacturer wants ground-truth data on cockpit ergonomics, flight control software behaviour, or EBT training effectiveness, they currently ask airline management — who filter the truth to protect their own metrics. On this platform, the manufacturer can push an anonymous, technically verified survey directly to confirmed aircraft type operators. Pilots flying the metal tell the people who built the metal. The pilot gets a direct voice to the manufacturer. The manufacturer gets raw, verified data from actual operators. The airline\'s PR layer is bypassed entirely.',
              },
              {
                n: '4',
                title: 'The OEM-Certified Immutable Credential',
                color: '#fbbf24',
                rule: 'The credential that cannot be doubted.',
                body: 'When a pilot completes training at an official manufacturer type rating centre, the OEM issues a cryptographically signed "OEM-Certified" token directly to the pilot\'s DID wallet. The token is immutable, timestamped, and manufacturer-verified. An airline cannot argue with a training credential digitally signed by the company that engineered the aircraft. The pilot\'s market value increases immediately. The manufacturer\'s training centre becomes the most credible credential source in the market. The pilot no longer has to fight to prove the quality of their training.',
              },
            ] as {n:string;title:string;color:string;rule:string;body:string}[]).map((item) => (
              <div key={item.n} className="border border-slate-200 rounded-lg px-5 py-5 bg-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-base flex-shrink-0" style={{color: item.color}}>{item.n}</span>
                  <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                </div>
                <p className="text-xs font-semibold mb-2" style={{color: item.color}}>{item.rule}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-10 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>The test for every OEM interaction:</strong> <span className="text-slate-300">Does this interaction make the individual pilot more valuable, more informed, or more empowered — or does it extract value from the pilot network to benefit the manufacturer? If the answer is extraction without contribution, the interaction does not exist on this platform. Every mechanism above passes this test. The OEM Sponsorship Pathway funds a pilot's career. Zero-Knowledge data protects pilot privacy by architecture. The feedback loop gives pilots a direct voice. The immutable credential makes the pilot undeniable. Manufacturers earn access by making the base layer stronger, not weaker.</span></p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">The Paper vs. Reality Gap — A Core Pain Point Validated at Manufacturer Level</h3>
          <p className="text-slate-700 leading-relaxed mb-4">This specific use case was confirmed in recorded conversations with senior representatives from a major aircraft manufacturer. No names or organisations are disclosed. The pain point is not theoretical — it is a live, multi-billion-dollar constraint on manufacturer expansion models, and PilotRecognition is the only architecture in existence that resolves it.</p>
          <p className="text-slate-700 leading-relaxed mb-4">Major manufacturers sell type ratings. Airlines buy the planes. The 200-hour type-rated pilot is legally qualified. But the airline's Safety Management System, the insurer's underwriting policy, and the EBT assessor's competency requirements all operate on a different standard from the legal minimum — <strong>and there is currently no infrastructure that bridges that gap.</strong></p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="bg-slate-900 text-white">
                <th className="text-left px-4 py-2 font-semibold">Gatekeeper</th>
                <th className="text-left px-4 py-2 font-semibold text-red-400">What They Reject</th>
                <th className="text-left px-4 py-2 font-semibold" style={{color:'#34d399'}}>What PilotRecognition Provides</th>
              </tr></thead>
              <tbody>
                {([
                  { g: 'Airline SMS', r: '"Legal 200hrs not sufficient — our ops manual requires 500hrs on type."', p: 'Operator Expectations Page forces airlines to publish their actual requirement, not the legal minimum. Pilots know before they pay for the rating.' },
                  { g: 'Insurance Underwriter', r: '"200hr type-rated pilot requires 5,000hr Captain on all flights — roster unworkable. Policy denied."', p: 'EBT Token: simulator_competency_score = Top 10% + training_source_verified = OEM Training Centre. Insurer has quantified competency, not just hours.' },
                  { g: 'EBT Assessor', r: '"Legal rating confirmed. Verified competency profile is blank. No EBT data to assess operational readiness."', p: 'Manufacturer issues Competency & EBT Tokens to graduates at point of training completion. Profile is populated before the pilot walks into an airline.' },
                  { g: 'Airline HR', r: '"200 hours. No operator experience. Cannot verify training quality."', p: 'training_source_verified = OEM Training Centre. Placement history of manufacturer graduates visible in aggregate. Quality is provable, not assumed.' },
                ] as {g:string;r:string;p:string}[]).map((row, i) => (
                  <tr key={row.g} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-semibold text-slate-100 text-xs">{row.g}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-red-400 text-xs italic">{row.r}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-xs" style={{color:'#34d399'}}>{row.p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-8 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>Why manufacturers pay for this:</strong> <span className="text-slate-300">If airlines refuse to hire 200-hour type-rated graduates, the type rating becomes commercially worthless. If type ratings become worthless, pilots stop buying them. If pilots stop buying them, manufacturer training revenue collapses — and airlines lose confidence in ordering aircraft they cannot crew. Major manufacturers have a direct commercial interest in the platform making their graduates hireable. The EBT Token structure is the mechanism that converts legal compliance into operational proof. That is worth far more than a standard enterprise subscription.</span></p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">OEM Pricing — Why $1,000/Year Is a Rounding Error</h3>
          <p className="text-slate-700 leading-relaxed mb-4">The standard airline enterprise tier is not the right commercial model for OEMs. An airline pays for recruitment infrastructure. <strong>A manufacturer pays for market intelligence that informs multi-billion-dollar production decisions.</strong> These are not the same product. The pricing must reflect that.</p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="bg-slate-900 text-white">
                <th className="text-left px-4 py-2 font-semibold">Tier</th>
                <th className="text-left px-4 py-2 font-semibold">Annual Fee</th>
                <th className="text-left px-4 py-2 font-semibold">What It Unlocks</th>
                <th className="text-left px-4 py-2 font-semibold">Best For</th>
              </tr></thead>
              <tbody>
                {([
                  { tier: 'Training Center', fee: '$1,000/mo', unlocks: 'Publish "OEM Verified Graduate" pathway cards. Track training center alumni outcomes. Graduate placement rate verification and publication.', for: 'Airbus Flight Academy, Boeing Global Services training centers, CAE, FlightSafety' },
                  { tier: 'OEM Market Intelligence', fee: '$5,000–$10,000/yr', unlocks: 'Macro-level pilot supply/demand analytics by aircraft type. Real-time type rating demand curves. Anonymised EBT competency benchmarks. Direct integration with global training centers on platform. Fleet transition demand forecasting.', for: 'Airbus, Boeing — strategic intelligence to support fleet sales and simulator production planning' },
                  { tier: 'OEM Enterprise + Data API', fee: 'Custom', unlocks: 'Live API feed of aggregated (never individual) pilot demand data. Integration into manufacturer ATS/CRM for training pipeline management. Co-branded "Manufacturer Endorsed" pathway status. Direct dataset licensing for EBT curriculum development.', for: 'Board-level fleet strategy teams at Airbus, Boeing, Embraer, Bombardier' },
                ] as {tier:string;fee:string;unlocks:string;for:string}[]).map((row, i) => (
                  <tr key={row.tier} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-bold text-slate-100">{row.tier}</td>
                    <td className="px-4 py-2 border-b border-slate-700 font-bold text-xs" style={{color:'#34d399'}}>{row.fee}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300 text-xs">{row.unlocks}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-400 text-xs italic">{row.for}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-amber-50 border border-amber-300 rounded-lg px-5 py-4 mb-6">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">Admin Note — OEM Pricing (Standby, Pending Review)</p>
            <p className="text-slate-700 text-sm leading-relaxed">The OEM Market Intelligence tier ($5,000–$10,000/yr) and Training Center tier ($1,000/mo) are proposed structures. A $1,000/year standard enterprise fee applied to Airbus or Boeing is a procurement rounding error — it signals the platform does not understand the commercial value of what it is providing. The OEM tier must be positioned as market intelligence infrastructure, not HR tooling. The anonymised data angle is critical: it bypasses individual data privacy concerns entirely while providing the highest-value dataset in aviation. Review before publishing publicly.</p>
          </div>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-10 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>The A321 dilemma resolved:</strong> The platform knows — in real time — whether pilots are training toward A320 or A321 qualifications, which operators are posting those pathway requirements, and what the demand curve looks like 18 months out. <strong style={{color:'#f87171'}}>A manufacturer with access to that data does not build the wrong simulator. It builds the right one, in the right volume, before the market needs it.</strong></p>
          </div>

          <hr className="my-8 border-slate-200" />

          <h2 id="pillar-media" className="text-3xl font-bold text-slate-900 mt-8 mb-6 pb-4 border-b border-slate-300 scroll-mt-24">
            AVIATION MEDIA &amp; PUBLICATIONS
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub E — Community, Strategy &amp; Growth</p>
          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Problem: Aviation Career Information Is Fragmented, Unverified, and Contradictory</h3>
          <p className="text-slate-700 leading-relaxed mb-4">A pilot searching for Emirates requirements today will find 50 different answers — none of them verified by the airline, most of them outdated, several of them wrong. Aviation media publishes career content based on anecdote, forum speculation, and press releases. The gap between what pilots read and what operators actually require is enormous, and it costs pilots real money. Training decisions made on bad information are financial disasters. The platform closes that gap by giving media partners access to verified, live, structured data — and a mechanism to publish it in a way that is provably accurate.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { t: 'What Media Partners Must Contribute', items: ['Publish data-driven stories using verified platform insights — not speculation', 'Accurate reporting: no sensationalism of pilot shortage, data-driven stories only', 'Privacy protection: no individual pilot identification without explicit consent', 'Source verification: platform data validation before publication'] },
              { t: 'What Media Partners Gain', items: ['Unique content: access to verified pathway data no other publication has', '"Data-driven aviation journalism" authority positioning', 'Interactive tools that attract 2–3x reader engagement', 'Revenue diversification: sponsored insights, data reports, platform-powered webinars'] },
            ].map(col => (
              <div key={col.t} className="border border-slate-200 rounded-lg p-5 bg-white">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">{col.t}</p>
                <ul className="space-y-1 text-sm text-slate-700">{col.items.map(i => <li key={i} className="flex gap-2"><span className="text-red-500 flex-shrink-0">→</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>

          {/* CREDIT RATING — added to Hub C section but anchored here for nav */}
          <hr className="my-8 border-slate-200" />

          <h2 id="pillar-credit-rating" className="text-3xl font-bold text-slate-900 mt-8 mb-6 pb-4 border-b border-slate-300 scroll-mt-24">
            CREDIT RATING AGENCIES
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub C — Capital, Risk &amp; Compliance</p>
          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Problem: Pilot Career Creditworthiness Is Unmeasurable</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Credit rating agencies that service the aviation sector — lending institutions, aviation finance houses, aircraft leasing firms — assess creditworthiness on the same blunt instruments used everywhere else: income history, debt ratios, employment tenure. None of these instruments are calibrated for the non-linear career trajectory of a commercial pilot. A 200-hour pilot with a clear pathway progression, verified training completions, and an active Recognition Score is a materially different credit risk from a 200-hour pilot with no verified record. The current system cannot distinguish between them.</p>
          <p className="text-slate-700 leading-relaxed mb-6">The platform creates a new creditworthiness signal: pathway progression. A pilot actively advancing through verified milestones on an airline-endorsed pathway is demonstrating measurable career momentum — which is the most accurate predictor of future earnings capacity in aviation. Credit rating agencies that integrate this signal into their models gain a risk differentiation capability that does not exist anywhere else in the market.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { t: 'Integration Requirements', items: ['API access to pilot pathway progression data (with consent)', 'Recognition Score as supplementary creditworthiness input', 'Verified training completion milestones as collateral signal', 'Dynamic risk adjustment as profile progresses'] },
              { t: 'What Rating Agencies Gain', items: ['First aviation-specific creditworthiness signal in the market', 'Ability to differentiate high-trajectory vs. stalled pilot career risk', 'Reduced default rates on aviation training loans', 'New product category: "Pathway-Verified" credit assessment for pilot applicants'] },
            ].map(col => (
              <div key={col.t} className="border border-slate-200 rounded-lg p-5 bg-white">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">{col.t}</p>
                <ul className="space-y-1 text-sm text-slate-700">{col.items.map(i => <li key={i} className="flex gap-2"><span className="text-red-500 flex-shrink-0">→</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>

          {/* TELEMETRY — added to Hub D section */}
          <hr className="my-8 border-slate-200" />

          <h2 id="pillar-telemetry" className="text-3xl font-bold text-slate-900 mt-8 mb-6 pb-4 border-b border-slate-300 scroll-mt-24">
            TELEMETRY &amp; SIMULATOR DATA PROVIDERS
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub D — Infrastructure &amp; Data</p>
          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Problem: Living Proficiency Data Is Trapped Inside Consumer Applications</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Pilots today maintain genuine cognitive currency through desktop simulators — MSFS, X-Plane — flying live, human-controlled ATC networks like VATSIM, logging complex IFR routes with real weather deviations, practising non-precision approaches, maintaining type familiarity through structured simulator sessions. None of this activity is visible to the industry. Insurance underwriters pricing policy risk cannot see it. Airlines assessing recency cannot access it. The pilot's Recognition Profile does not reflect it. The data exists, is being generated in real time, and is professionally invisible.</p>
          <p className="text-slate-700 leading-relaxed mb-6">Telemetry and simulator data providers — VATSIM, MSFS telemetry platforms, home simulator networks — sit on the most granular pilot proficiency dataset in existence. The integration path is straightforward: verified ingestion pipelines that port telemetry data, with pilot consent, directly into the Recognition Profile. A pilot who flew a 4-hour IFR route on a desktop sim last night, handled weather deviations with live ATC, and logged 6 ILS approaches — that activity should be verifiable. The platform makes it so.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { t: 'What Telemetry Providers Must Integrate', items: ['Direct API webhooks acting as verified ingestion pipelines', 'Real-time telemetry data porting to pilot Recognition Profiles', 'Data portability toggles: pilot-controlled consent for professional profile sharing', 'Subscription integration linking platform accounts to simulator profiles'] },
              { t: 'What Telemetry Providers Gain', items: ['Unprecedented user stickiness: if your simulator data builds a pilot\'s airline profile, they will never cancel their subscription', 'B2B enterprise demand: operators paying for access to telemetry-verified pilot pools', 'Platform partnership: co-branded "Verified Recency" status for active sim users', 'Insurance underwriter demand for real-time proficiency data'] },
            ].map(col => (
              <div key={col.t} className="border border-slate-200 rounded-lg p-5 bg-white">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">{col.t}</p>
                <ul className="space-y-1 text-sm text-slate-700">{col.items.map(i => <li key={i} className="flex gap-2"><span className="text-red-500 flex-shrink-0">→</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>

          <hr className="my-8 border-slate-200" />

          {/* DIGITAL CREDENTIAL WALLET */}
          <h2 id="pillar-credential-wallet" className="text-3xl font-bold text-slate-900 mt-8 mb-6 pb-4 border-b border-slate-300 scroll-mt-24">
            DIGITAL CREDENTIAL WALLET
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub D — Infrastructure &amp; Data · Security &amp; Compliance</p>
          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Architecture: We Display the Token. We Never Hold the Data.</h3>
          <p className="text-slate-700 leading-relaxed mb-4">PilotRecognition is a <strong>neutral display layer</strong>. The platform does not store pilot credentials, document scans, license numbers, or personal identification data. Instead, credential data is held exclusively by a <strong>third-party secure vault</strong> — the pilot's chosen data custodian. Veremark independently verifies that data against official registries. PilotRecognition receives only a <strong>triangulated verification token</strong> — the outcome of both signals agreeing — and displays that token to the pilot and, with consent, to operators.</p>
          <p className="text-slate-700 leading-relaxed mb-6">This architecture means the platform carries no credential liability. The vault holds the data. Veremark verifies it. We display the result. <strong>The pilot controls all three relationships independently.</strong></p>
          <div className="my-6 p-5 bg-slate-900 rounded-xl text-sm font-mono text-slate-300 leading-relaxed">
            <p className="text-emerald-400 font-bold mb-3 font-sans text-xs uppercase tracking-widest">Triangulation Signal Flow</p>
            <p>Pilot <span className="text-slate-500">→</span> <span className="text-blue-400">Third-Party Vault</span> <span className="text-slate-500">(data stored here, pilot consent given)</span></p>
            <p className="pl-4"><span className="text-slate-500">↓ vault sends data to Veremark with pilot consent</span></p>
            <p><span className="text-blue-400">Third-Party Vault</span> <span className="text-slate-500">→</span> <span className="text-yellow-400">Veremark</span> <span className="text-slate-500">(independent verification against CAAP / NBI / registries)</span></p>
            <p className="pl-4"><span className="text-slate-500">↓ Veremark sends token to platform</span></p>
            <p><span className="text-yellow-400">Veremark</span> <span className="text-slate-500">→</span> <span className="text-emerald-400">PilotRecognition</span> <span className="text-slate-500">(token only — no raw data)</span></p>
            <p className="pl-4"><span className="text-slate-500">↓ platform compares both signals</span></p>
            <p><span className="text-emerald-400">PilotRecognition</span> <span className="text-slate-500">→</span> <span className="text-white font-bold">TRIANGULATED ✓</span> <span className="text-slate-500">(vault token + Veremark token both agree)</span></p>
            <p className="pl-4"><span className="text-slate-500">↓ displayed to pilot and operators</span></p>
            <p><span className="text-white">Wallet Status: </span><span className="text-emerald-400 font-bold">PRE-CLEARED</span></p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { t: 'What the Wallet Displays', items: ['License status: Valid / Expired / Suspended', 'Medical certificate: Valid / Expired + expiry date', 'Type ratings held and currency status', 'Background check: Clear / Flagged', 'Identity: Verified / Unverified', 'Triangulation status: Both signals agree / Mismatch flagged', 'Pre-Cleared badge — issued only on full triangulation', 'Consent log — pilot controls who sees what'] },
              { t: 'What the Wallet Never Contains', items: ['Raw license document or scan', 'Passport or national ID image', 'License or PEL number', 'Medical certificate document', 'NBI clearance document', 'Any personally identifiable data', 'Any document stored in PilotRecognition servers', 'Any data not explicitly consented by pilot'] },
            ].map(col => (
              <div key={col.t} className="border border-slate-200 rounded-lg p-5 bg-white">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">{col.t}</p>
                <ul className="space-y-1 text-sm text-slate-700">{col.items.map(i => <li key={i} className="flex gap-2"><span className="text-red-500 flex-shrink-0">&rarr;</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="my-6 px-5 py-4 border-l-4 border-emerald-500 bg-emerald-50 rounded-r-lg">
            <p className="text-sm font-bold text-emerald-700 uppercase tracking-widest mb-1">Platform Status</p>
            <p className="text-slate-700 leading-relaxed">Wallet infrastructure is live. Tables: <code className="bg-slate-100 px-1 rounded text-xs">pilot_verification_wallet</code>, <code className="bg-slate-100 px-1 rounded text-xs">verification_checks</code>, <code className="bg-slate-100 px-1 rounded text-xs">verification_consent_log</code>. Token-only storage confirmed — no raw credential data in any table. Triangulation logic active.</p>
          </div>

          <hr className="my-8 border-slate-200" />

          {/* IDENTITY & DOCUMENT VERIFICATION */}
          <h2 id="pillar-identity-verification" className="text-3xl font-bold text-slate-900 mt-8 mb-6 pb-4 border-b border-slate-300 scroll-mt-24">
            IDENTITY &amp; DOCUMENT VERIFICATION
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub D — Infrastructure &amp; Data · Security &amp; Compliance</p>
          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Two Independent Sources. Neither Talks to the Other. Both Must Agree.</h3>
          <p className="text-slate-700 leading-relaxed mb-4">The triangulation model is the platform's core fraud-prevention architecture. Credential data is sourced from the <strong>third-party vault</strong> — the authoritative store the pilot consented to — and independently cross-checked by <strong>Veremark</strong> against official registries (CAAP, NBI, passport authorities). PilotRecognition compares both signals. If they match, a <strong>triangulated verification token</strong> is issued. If they conflict, the check is flagged for review.</p>
          <p className="text-slate-700 leading-relaxed mb-6">This makes fraud structurally impossible. A pilot cannot falsify a credential that must simultaneously match an independent vault record and an independent registry check that have never communicated with each other. The two signals are blind to each other — they only talk to PilotRecognition, which acts as the neutral comparison layer.</p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="bg-slate-900 text-white">
                <th className="text-left px-4 py-2 font-semibold">Credential</th>
                <th className="text-left px-4 py-2 font-semibold">Vault Signal</th>
                <th className="text-left px-4 py-2 font-semibold">Veremark Signal</th>
                <th className="text-left px-4 py-2 font-semibold">Triangulated Result</th>
              </tr></thead>
              <tbody>
                {([
                  { cred: 'CAAP Pilot License', vault: 'Valid · Exp 2030-10-23', veremark: 'Valid · Exp 2030-10-23', result: 'MATCH → Pre-Cleared ✓', ok: true },
                  { cred: 'Class 1 Medical', vault: 'Expired · 2026-05-02', veremark: 'Expired · 2026-05-02', result: 'MATCH → Flagged Expired ⚠️', ok: false },
                  { cred: 'NBI Clearance', vault: 'Clear', veremark: 'Clear', result: 'MATCH → Verified ✓', ok: true },
                  { cred: 'Identity / Passport', vault: 'Authentic', veremark: 'Authentic', result: 'MATCH → Verified ✓', ok: true },
                  { cred: 'Any Credential', vault: 'Value A', veremark: 'Value B', result: 'MISMATCH → Flagged 🚩', ok: false },
                ] as {cred:string;vault:string;veremark:string;result:string;ok:boolean}[]).map((row, i) => (
                  <tr key={row.cred} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-100 font-medium">{row.cred}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-blue-300">{row.vault}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-yellow-300">{row.veremark}</td>
                    <td className={`px-4 py-2 border-b border-slate-700 font-semibold ${row.ok ? 'text-emerald-400' : 'text-red-400'}`}>{row.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="bg-slate-900 text-white">
                <th className="text-left px-4 py-2 font-semibold">Check</th>
                <th className="text-left px-4 py-2 font-semibold">Provider</th>
                <th className="text-left px-4 py-2 font-semibold">Region</th>
                <th className="text-left px-4 py-2 font-semibold">Output</th>
              </tr></thead>
              <tbody>
                {([
                  { check: 'Passport / ID Verification', provider: 'Veremark', region: 'Global', output: 'Authentic / Flagged / Expired' },
                  { check: 'NBI Clearance', provider: 'Veremark PH', region: 'Philippines', output: 'Clear / With Record' },
                  { check: 'Address Verification', provider: 'Veremark', region: 'PH / UAE / Global', output: 'Confirmed / Unconfirmed' },
                  { check: 'PRC License Check', provider: 'Veremark PH', region: 'Philippines', output: 'Active / Lapsed / Not Found' },
                  { check: 'CAAP License Status', provider: 'Veremark / CAAP API', region: 'Philippines', output: 'Valid / Expired / Suspended' },
                  { check: 'Class 1 Medical', provider: 'AME Network', region: 'PH / Global', output: 'Valid / Expired / Date of Exam' },
                ] as {check:string;provider:string;region:string;output:string}[]).map((row, i) => (
                  <tr key={row.check} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-100 font-medium">{row.check}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.provider}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300">{row.region}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-emerald-400">{row.output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <hr className="my-8 border-slate-200" />

          {/* ATS INTEGRATION */}
          <h2 id="pillar-ats-integration" className="text-3xl font-bold text-slate-900 mt-8 mb-6 pb-4 border-b border-slate-300 scroll-mt-24">
            ATS &amp; AIRLINE SYSTEMS INTEGRATION
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub D — Infrastructure &amp; Data · Data &amp; Integration</p>
          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Last Mile — Verified Data Into Airline Infrastructure</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Verification means nothing if it stays inside the platform. The value of a verified pilot pool is only realised when that data flows directly into the systems airlines already use to hire. Airline Tracking Systems — Greenhouse, Workday, Oracle HCM, SAP SuccessFactors, and the ATLAS Aviation CV format — are where hiring decisions are actually made. The integration layer is what converts platform data into airline infrastructure value.</p>
          <p className="text-slate-700 leading-relaxed mb-6">Enterprise tier subscribers receive direct ATS API integration. Verified pilot profiles — credentials, Recognition Score, gap analysis, EBT video assessment — flow into the airline's existing ATS without manual export, copy-paste, or re-entry. A pilot who submits interest on the platform appears in the airline's Greenhouse instance, pre-verified, pre-scored, and pre-cleared. The hiring cycle compresses from months to weeks.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { t: 'Supported Systems', items: ['Greenhouse ATS', 'Workday HCM', 'Oracle Recruiting Cloud', 'SAP SuccessFactors', 'ATLAS Aviation CV (native)', 'Custom API endpoints'] },
              { t: 'Data Flowing Through', items: ['Verified pilot profile (structured)', 'Recognition Score + gap breakdown', 'Credential wallet status', 'EBT video assessment link', 'Pathway match percentage', 'Last verification timestamp'] },
              { t: 'Airline Outcome', items: ['Zero manual re-entry of pilot data', 'Pre-verified candidates only in pipeline', 'Recognition Score as first filter', 'ATLAS CV auto-formatted for review', 'Audit trail of data access', 'Compliance-ready hiring record'] },
            ].map(col => (
              <div key={col.t} className="border border-slate-200 rounded-lg p-5 bg-white">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">{col.t}</p>
                <ul className="space-y-1 text-sm text-slate-700">{col.items.map(i => <li key={i} className="flex gap-2"><span className="text-red-500 flex-shrink-0">&rarr;</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="my-6 px-5 py-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
            <p className="text-sm font-bold text-blue-700 uppercase tracking-widest mb-1">Commercial Gate</p>
            <p className="text-slate-700 leading-relaxed">ATS integration is exclusive to <strong>Enterprise tier ($1,000/yr)</strong>. It is the primary driver of enterprise subscription value. Free tier operators can view pilot interest manually through the portal. Only Enterprise subscribers receive the API integration that removes manual hiring steps entirely.</p>
          </div>

          <hr className="my-8 border-slate-200" />

          {/* AI & MATCHING ENGINE */}
          <h2 id="pillar-ai-matching" className="text-3xl font-bold text-slate-900 mt-8 mb-6 pb-4 border-b border-slate-300 scroll-mt-24">
            AI &amp; MATCHING ENGINE
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub D — Infrastructure &amp; Data · Data &amp; Integration</p>
          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Recognition Score — Your Currency for Pathway Access</h3>
          <p className="text-slate-700 leading-relaxed mb-4">The Recognition Score is not a rating. It is not a ranking. It is a structured gap analysis engine — a real-time comparison between a pilot's verified profile and any pathway requirement in the system. The score tells a pilot not where they stand in a league table, but precisely what they are missing, in what order to close it, and which operators they already qualify for today.</p>
          <p className="text-slate-700 leading-relaxed mb-6">The matching engine runs across all 25 UCF pillars simultaneously. It ingests verified credentials, flight hours, program completions, EBT assessment scores, telemetry data, and behavioural signals. It outputs a structured gap report per pathway — not a generic percentage, but a line-item breakdown: hours short, type rating missing, language proficiency level, recency gap, medical certificate status. Every gap is actionable. Every action moves the score.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { t: 'Score Inputs (Weighted)', items: ['Flight hours — total time, command, night, instrument (35%)', 'Verified credentials — license, medical, type ratings (25%)', 'Program completion — Foundation, Transition, EBT (20%)', 'Behavioural assessment — EBT video scoring (10%)', 'Recency — last 90-day activity, sim data (5%)', 'Peer validation and mentor endorsements (5%)'] },
              { t: 'Score Outputs', items: ['Pathway match % per operator card', 'Ranked gap list — what to close first', 'Pre-Cleared status for verified pilots', 'Priority queue position for airline pull', 'Insurance risk score feed (Hub C)', 'Regulatory compliance flag (Hub C)'] },
            ].map(col => (
              <div key={col.t} className="border border-slate-200 rounded-lg p-5 bg-white">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">{col.t}</p>
                <ul className="space-y-1 text-sm text-slate-700">{col.items.map(i => <li key={i} className="flex gap-2"><span className="text-red-500 flex-shrink-0">&rarr;</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>

          <hr className="my-8 border-slate-200" />

          {/* DATA PRIVACY & CONSENT */}
          <h2 id="pillar-data-privacy" className="text-3xl font-bold text-slate-900 mt-8 mb-6 pb-4 border-b border-slate-300 scroll-mt-24">
            DATA PRIVACY &amp; CONSENT LAYER
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub D — Infrastructure &amp; Data · Security &amp; Compliance</p>

          <div className="bg-amber-50 border border-amber-300 rounded-lg px-5 py-4 mb-8">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">Legal Architecture Review — May 16, 2026</p>
            <p className="text-slate-700 text-sm leading-relaxed">This section reflects a full legal critique of the original "Data Processor" claim and the revised architecture that emerged from it. The original framing was logically structured but not fully defensible under regulatory scrutiny. The revised architecture below addresses every identified vulnerability and is designed to withstand NPC (Philippines), DIFC (UAE), and GDPR review.</p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Core Vulnerability — Corrected</h3>
          <p className="text-slate-700 leading-relaxed mb-4">The original claim that PilotRecognition is a pure <strong>Data Processor</strong> is not fully defensible. Regulators do not assess what a platform claims in its Terms — they assess the economic and technical reality of who determines the purposes and means of processing. Because PilotRecognition defines the tokenization protocol, selects Veremark and IDfy, designs the data structure, and operates the marketplace connecting pilots to airlines — regulators will classify the platform as a <strong>Joint Controller</strong> alongside the pilot.</p>
          <p className="text-slate-700 leading-relaxed mb-6">The correct and defensible position is not to fight this classification — it is to <strong>accept Joint Controller status and structure it transparently under GDPR Article 26</strong>. This is legally cleaner, more honest, and more robust than an indefensible processor claim.</p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="bg-slate-900 text-white">
                <th className="text-left px-4 py-2 font-semibold">Party</th>
                <th className="text-left px-4 py-2 font-semibold">Legal Classification</th>
                <th className="text-left px-4 py-2 font-semibold">Responsibility</th>
                <th className="text-left px-4 py-2 font-semibold">Legal Basis</th>
              </tr></thead>
              <tbody>
                {([
                  { party: 'Pilot', classification: 'Primary Data Controller', responsibility: 'Owns all personal data. Controls what is shared, with whom, and for how long. Can revoke consent at any time.', basis: 'GDPR Art. 4(7) · RA 10173 Sec. 3(h)' },
                  { party: 'PilotRecognition', classification: 'Joint Controller', responsibility: 'Controls tokenization infrastructure and marketplace layer. Holds consent receipts and token metadata only. Never raw data.', basis: 'GDPR Art. 26 · RA 10173 Sec. 3(h)' },
                  { party: 'Veremark', classification: 'Independent Data Controller', responsibility: 'Independently verifies credentials against CAAP/government registries. Maintains own compliance logs. Signs DPA directly with pilot.', basis: 'GDPR Art. 4(7) · Their own ICO registration' },
                  { party: 'IDfy', classification: 'Independent Data Controller', responsibility: 'Independently confirms training hours with flight schools. Cross-checks Veremark results. Signs DPA directly with pilot.', basis: 'GDPR Art. 4(7) · Their own regulatory registration' },
                ] as {party:string;classification:string;responsibility:string;basis:string}[]).map((row, i) => (
                  <tr key={row.party} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-bold text-slate-100">{row.party}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-red-400 font-semibold">{row.classification}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300 text-xs">{row.responsibility}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-400 text-xs">{row.basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">The Five Architectural Fixes</h3>

          <div className="space-y-4 mb-8">
            {([
              {
                n: '1', title: 'Joint Controller Agreement (GDPR Art. 26)', color: '#34d399',
                body: 'A transparent Joint Controller Agreement must be in place between PilotRecognition and the pilot — defining which party controls which aspect of processing. Pilot controls: data sharing decisions. PilotRecognition controls: tokenization infrastructure and marketplace routing. This agreement must be accessible to any pilot on request and must clearly state that the pilot\'s rights (access, erasure, portability, objection) are always honoured by PilotRecognition as the joint controller operating the infrastructure.',
              },
              {
                n: '2', title: 'Explicit Pilot-Commanded Consent on Every Airline Pull', color: '#60a5fa',
                body: '"Implicit consent" and "legitimate interest" are eliminated from the airline pull flow entirely. Every single identity verification request by an airline requires a separate, timestamped, explicit approval action from the pilot — via push notification and email. The pilot taps APPROVE or DECLINE. No approval = no check runs. No data moves. This satisfies GDPR Art. 7 and RA 10173 Sec. 12(a) unambiguously — explicit, specific, freely given, withdrawable.',
              },
              {
                n: '3', title: 'Controller-to-Controller Agreements with Veremark and IDfy', color: '#f87171',
                body: 'Veremark and IDfy are not sub-processors — they are Independent Data Controllers with their own legal obligations, registry access agreements, and compliance requirements. The legal agreements between PilotRecognition and each provider must be Controller-to-Controller agreements, not sub-processor DPAs. Each provider signs a separate DPA directly with the pilot at the moment of check initiation.',
              },
              {
                n: '4', title: 'Binary Proof Tokens Only — No Personal Data Strings', color: '#fbbf24',
                body: 'Cryptographic tokens containing personal data strings (e.g. "CAAP License 155660-CPL, valid until Oct 2030") are Pseudonymised Personal Data under GDPR and RA 10173 — not anonymous. The token architecture must expose only binary proofs: is_license_valid = TRUE, is_medical_current = FALSE, training_hours_confirmed = TRUE. The underlying personal data remains exclusively with Veremark and IDfy. PilotRecognition passes the proof, not the record.',
              },
              {
                n: '5', title: 'Token Soulbound Architecture — Non-Transferable, Non-Financial, Utility-Only', color: '#a78bfa',
                body: 'Tokens that can be traded, sold, fractioned, or monetised on secondary markets immediately trigger SEC Philippines, UAE SCA, and BSP securities regulations. Every token issued by PilotRecognition must be: (a) non-transferable — bound to the pilot\'s identity, cannot be assigned to another pilot; (b) non-tradable — no secondary market, no sale mechanism; (c) non-financial — zero monetary value, no yield, no reward attached; (d) utility-only — identity verification purpose exclusively. These four conditions must be embedded in the technical token architecture and explicitly stated in the platform Terms.',
              },
            ] as {n:string;title:string;color:string;body:string}[]).map((item) => (
              <div key={item.n} className="border border-slate-200 rounded-lg px-5 py-4 bg-white">
                <div className="flex items-start gap-3">
                  <span className="font-bold text-lg flex-shrink-0" style={{color: item.color}}>{item.n}.</span>
                  <div>
                    <p className="font-bold text-slate-900 mb-2">{item.title}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">Regulatory Registration Costs — What the Joint Controller Architecture Actually Costs</h3>
          <p className="text-slate-700 leading-relaxed mb-4">There is no special fee for the word "Joint." Regulators do not charge extra for sharing data controllership with pilots. The Joint Controller designation is simply a legal relationship defined in Terms of Service, Privacy Policy, and Data Processing Agreements. You register under the standard <strong>Controller</strong> category — not a special joint category. Total baseline regulatory cost across all jurisdictions: <strong>under $1,000 combined.</strong></p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="bg-slate-900 text-white">
                <th className="text-left px-4 py-2 font-semibold">Jurisdiction</th>
                <th className="text-left px-4 py-2 font-semibold">Registration Body</th>
                <th className="text-left px-4 py-2 font-semibold">Registration Type</th>
                <th className="text-left px-4 py-2 font-semibold">Cost</th>
                <th className="text-left px-4 py-2 font-semibold">Timing</th>
              </tr></thead>
              <tbody>
                {([
                  { j: 'Joint Controller Designation', b: 'N/A', r: 'Legal relationship only — defined in T&Cs, Privacy Policy, DPAs', c: '$0', t: 'At launch — document drafting only' },
                  { j: 'Philippines', b: 'National Privacy Commission (NPC)', r: 'Personal Information Controller (PIC) — RA 10173 Sec. 46', c: '~₱1,000 (~$18)', t: 'Before first Veremark check runs on any Filipino pilot' },
                  { j: 'UAE (DIFC)', b: 'Commissioner of Data Protection', r: 'Data Protection Notification — Category II SaaS', c: '$750 initial · $250/year renewal', t: 'At DIFC incorporation or when data processing begins' },
                  { j: 'EU (GDPR)', b: 'National DPA (per member state)', r: 'No registration fee in most EU states', c: '$0', t: 'Operational compliance only — lawyers, security, DPAs' },
                  { j: 'UK (UK GDPR)', b: 'Information Commissioner\'s Office (ICO)', r: 'Annual Data Protection Fee — only if UK presence established', c: '£40–£60/year', t: 'Only if UK office or UK-specific processing established' },
                ] as {j:string;b:string;r:string;c:string;t:string}[]).map((row, i) => (
                  <tr key={row.j} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 font-semibold text-slate-100 text-xs">{row.j}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-300 text-xs">{row.b}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-400 text-xs">{row.r}</td>
                    <td className="px-4 py-2 border-b border-slate-700 font-bold text-xs" style={{color:'#34d399'}}>{row.c}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-400 text-xs">{row.t}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {([
              {
                title: 'What the Joint Controller Architecture Saves You',
                color: 'border-emerald-400 bg-emerald-50',
                titleColor: 'text-emerald-700',
                items: [
                  'NPC fine exposure eliminated: up to ₱5M per violation (RA 10173 Sec. 26)',
                  'GDPR fine exposure eliminated: up to €20M or 4% global turnover',
                  'Data breach liability eliminated: no raw data = nothing to leak',
                  'Securities law exposure eliminated: soulbound utility tokens = no SEC/BSP jurisdiction',
                  'Data custody liability eliminated: Veremark and IDfy hold it, not you',
                ],
              },
              {
                title: 'What You Actually Pay',
                color: 'border-blue-400 bg-blue-50',
                titleColor: 'text-blue-700',
                items: [
                  'NPC (Philippines PIC registration): ~₱1,000 (~$18) one-time',
                  'DIFC Data Protection Notification: $750 initial + $250/year renewal',
                  'UK ICO fee (only if UK presence): £40–£60/year',
                  'Legal drafting (T&Cs, Privacy Policy, DPAs): one-time lawyer cost',
                  'Total regulatory filing cost: under $1,000 combined across all jurisdictions',
                ],
              },
            ] as {title:string;color:string;titleColor:string;items:string[]}[]).map(col => (
              <div key={col.title} className={`border-l-4 rounded-r-lg px-5 py-4 ${col.color}`}>
                <p className={`font-bold text-sm mb-3 ${col.titleColor}`}>{col.title}</p>
                <ul className="space-y-1">{col.items.map(i => <li key={i} className="text-sm text-slate-700 flex gap-2"><span className="flex-shrink-0 text-slate-400">→</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-6 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>The asymmetry:</strong> <span className="text-slate-300">The Joint Controller architecture costs under $1,000 in regulatory filings. The alternative — operating as an unregistered data controller or claiming processor status you cannot defend — exposes the platform to fines that would end the business in one enforcement action. This is not a compliance cost. It is the cheapest insurance policy in the entire budget.</span></p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">The 10,000-Pilot Regulatory Shield</h3>
          <p className="text-slate-700 leading-relaxed mb-4">10,000 pilots in the Philippines represents approximately <strong>83% of the entire commercial pilot workforce</strong>. At that scale, the platform is not a startup — it is infrastructure. And the pilot-commanded architecture transforms that scale into a legal shield that no regulator can dismantle without political consequence.</p>
          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-6 rounded-r">
            <p className="text-white text-sm leading-relaxed mb-2"><strong style={{color:'#f87171'}}>The Shield Mechanism:</strong></p>
            <p className="text-slate-300 text-sm leading-relaxed">If PilotRecognition is built with pilot-commanded, decentralised architecture before reaching scale — any regulatory threat triggers 10,000 pilots saying: <em>"This is my data, held in my personal digital wallet, shared only by my explicit command. PilotRecognition is the radio channel. I am the pilot."</em> Regulators cannot fine a platform for data they do not hold. Regulators cannot prosecute infrastructure for transmitting data that the data subject themselves commanded to move. At 10,000 pilots, aviation unions (PALEA, ALPA international), airlines dependent on the verified pipeline, and ATOs dependent on placement data all have active commercial reasons to defend the platform. The regulatory risk becomes politically untenable.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {([
              { t: 'Scenario A — Centralised Data (Do Not Build)', color: 'border-red-400 bg-red-50', items: ['Platform holds pilot data on servers', 'Regulator investigates → finds personal data', 'NPC fine: up to ₱5M per violation (RA 10173 Sec. 26)', 'GDPR fine: up to €20M or 4% global turnover', '10,000 pilots lose verified records overnight'] },
              { t: 'Scenario B — Pilot-Commanded (Build This)', color: 'border-emerald-400 bg-emerald-50', items: ['Pilot holds DID wallet — platform holds receipt IDs only', 'Regulator investigates → finds nothing on platform servers', '10,000 pilots: "Our data is in our wallets. We command it."', 'Regulators have no target', 'Platform trust increases with every regulatory inquiry'] },
            ] as {t:string;color:string;items:string[]}[]).map(col => (
              <div key={col.t} className={`border-l-4 rounded-r-lg px-5 py-4 ${col.color}`}>
                <p className="font-bold text-slate-900 text-sm mb-3">{col.t}</p>
                <ul className="space-y-1">{col.items.map(i => <li key={i} className="text-sm text-slate-700 flex gap-2"><span className="flex-shrink-0 text-slate-400">→</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">We Remain Neutral. Your Data Is Never Ours.</h3>
          <p className="text-slate-700 leading-relaxed mb-4">PilotRecognition's legal and architectural position is one of <strong>complete neutrality</strong>. The platform does not hold pilot credentials. Credential data is secured by the <strong>third-party vault</strong> the pilot consents to. Veremark verifies it. PilotRecognition receives only the triangulated token — an outcome signal, not the underlying data. What the platform stores is the equivalent of a pass/fail result, not the exam paper.</p>
          <p className="text-slate-700 leading-relaxed mb-6">This means PilotRecognition is not a data custodian for sensitive credentials. It is a <strong>token display and consent management layer</strong>. The pilot controls three separate consent relationships: with the vault (data storage), with Veremark (verification), and with PilotRecognition (token display to operators). Revoking any one of the three immediately invalidates the token chain.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { t: 'Third-Party Vault', color: 'text-blue-600', items: ['Holds raw credential data', 'Pilot uploads documents here', 'Pilot signs vault DPA directly', 'Vault carries data custodian liability', 'Sends data to verification provider on pilot consent', 'Selected via competitive procurement process'] },
              { t: 'Veremark', color: 'text-yellow-600', items: ['Receives data from vault', 'Independently checks CAAP / NBI / registries', 'Issues verification token to PilotRecognition', 'Carries verification provider liability', 'DPA signed between pilot and Veremark', 'Never shares raw data with PilotRecognition'] },
              { t: 'PilotRecognition', color: 'text-emerald-600', items: ['Receives triangulated token only', 'Stores: status, expiry date, token reference', 'Never stores documents or PII credentials', 'Displays token to pilot and consented operators', 'Manages consent log for operator access', 'Zero credential liability — neutral display layer'] },
            ].map(col => (
              <div key={col.t} className="border border-slate-200 rounded-lg p-5 bg-white">
                <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${col.color}`}>{col.t}</p>
                <ul className="space-y-1 text-sm text-slate-700">{col.items.map(i => <li key={i} className="flex gap-2"><span className="text-red-500 flex-shrink-0">&rarr;</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { t: 'Pilot Rights', items: ['Revoke vault consent → data deleted from vault', 'Revoke Veremark consent → token invalidated', 'Revoke display consent → token hidden from operators', 'Data export from vault in structured format (GDPR Art. 20)', 'Full audit log of every operator access event', 'Notification when any operator views wallet token'] },
              { t: 'Compliance Coverage', items: ['GDPR — EU General Data Protection Regulation', 'DPA 2012 — Philippines Data Privacy Act', 'PDPA — Singapore Personal Data Protection Act', 'UAE Federal Decree-Law No. 45 of 2021', 'ICAO Annex 1 — pilot record data standards', 'ISO 27001 alignment for data security management'] },
            ].map(col => (
              <div key={col.t} className="border border-slate-200 rounded-lg p-5 bg-white">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">{col.t}</p>
                <ul className="space-y-1 text-sm text-slate-700">{col.items.map(i => <li key={i} className="flex gap-2"><span className="text-red-500 flex-shrink-0">&rarr;</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="my-6 px-5 py-4 border-l-4 border-slate-900 bg-slate-900 rounded-r-lg">
            <p className="text-sm font-bold text-white uppercase tracking-widest mb-2">The Pitch Position</p>
            <p className="text-slate-300 leading-relaxed italic">"PilotRecognition holds no pilot credentials. Your data is secured by a third-party vault. Veremark verifies it independently with your consent. We display only the triangulated outcome — a token. Not your data. Not our liability. Your control."</p>
          </div>
          <div className="my-6 px-5 py-4 border-l-4 border-emerald-500 bg-emerald-50 rounded-r-lg">
            <p className="text-sm font-bold text-emerald-700 uppercase tracking-widest mb-1">Platform Status</p>
            <p className="text-slate-700 leading-relaxed">Consent infrastructure live. Table: <code className="bg-slate-100 px-1 rounded text-xs">verification_consent_log</code>. Token-only storage confirmed across all <code className="bg-slate-100 px-1 rounded text-xs">verification_checks</code> rows. Triangulation signal comparison logic in development.</p>
          </div>

          <hr className="my-8 border-slate-200" />

          {/* THIRD-PARTY DATA INTEGRATION PROVIDER */}
          <h2 id="pillar-third-party-vault" className="text-3xl font-bold text-slate-900 mt-8 mb-6 pb-4 border-b border-slate-300 scroll-mt-24">
            THIRD-PARTY DATA INTEGRATION PROVIDER
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub D — Infrastructure &amp; Data · Security &amp; Compliance</p>
          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Vault — Where Pilot Data Lives, Independent of PilotRecognition</h3>
          <p className="text-slate-700 leading-relaxed mb-4">The third-party data integration provider is the <strong>foundational custody layer</strong> of the verification architecture. This provider holds the pilot's raw credential data — documents, scans, license records, medical certificates — in a secure, compliant vault entirely separate from PilotRecognition's infrastructure. The pilot's relationship with this provider is direct and independent. PilotRecognition never has access to the vault contents.</p>
          <p className="text-slate-700 leading-relaxed mb-6">This provider serves two functions simultaneously: <strong>secure data custody</strong> (holding verified documents on behalf of the pilot) and <strong>data integration</strong> (feeding structured credential data to Veremark for independent verification on the pilot's explicit consent). The vault is the source of truth. Veremark checks against registries. PilotRecognition compares the two signals and issues the triangulated token.</p>

          <div className="my-6 p-5 bg-slate-900 rounded-xl text-sm font-mono text-slate-300 leading-loose">
            <p className="text-blue-400 font-bold mb-3 font-sans text-xs uppercase tracking-widest">Vault Position in the Architecture</p>
            <p><span className="text-blue-400 font-bold">VAULT</span> <span className="text-slate-500">← pilot uploads documents here (direct relationship)</span></p>
            <p><span className="text-blue-400 font-bold">VAULT</span> <span className="text-slate-500">→ Veremark (structured data feed, pilot-consented)</span></p>
            <p><span className="text-blue-400 font-bold">VAULT</span> <span className="text-slate-500">→ PilotRecognition (vault-issued token only, no raw data)</span></p>
            <p className="mt-2 text-slate-500">Vault never communicates with Veremark on behalf of PilotRecognition.</p>
            <p className="text-slate-500">Each relationship is governed by a separate DPA signed by the pilot.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { t: 'What the Vault Holds', items: ['Pilot license documents (CAAP / GCAA / EASA)', 'Class 1 Medical certificate', 'Passport and national ID scans', 'NBI / criminal clearance documents', 'NTC Radio Operator license', 'Type rating certificates', 'Employment history records', 'Any document the pilot chooses to custody'] },
              { t: 'What the Vault Provides', items: ['Secure encrypted document storage', 'Structured data feed to Veremark (on consent)', 'Vault-issued token to PilotRecognition', 'Pilot-controlled access management', 'Audit log of all data sharing events', 'Right to erasure — full deletion on pilot request', 'GDPR / DPA PH compliant data handling', 'Independent of any airline or operator'] },
              { t: 'Vault Selection Criteria', items: ['SOC 2 Type II certified infrastructure', 'Embeddable SDK for seamless pilot experience', 'Direct pilot DPA with no platform liability', 'Token-based API (no raw document exposure)', 'Multi-jurisdiction compliance (GDPR, DPA PH, etc.)', 'Per-GB or usage-based pricing (not per-seat)', 'Selected partner: TBD pre-launch'] },
            ].map(col => (
              <div key={col.t} className="border border-slate-200 rounded-lg p-5 bg-white">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">{col.t}</p>
                <ul className="space-y-1 text-sm text-slate-700">{col.items.map(i => <li key={i} className="flex gap-2"><span className="text-red-500 flex-shrink-0">&rarr;</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="bg-slate-900 text-white">
                <th className="text-left px-4 py-2 font-semibold">Responsibility</th>
                <th className="text-left px-4 py-2 font-semibold">Vault Provider</th>
                <th className="text-left px-4 py-2 font-semibold">Veremark</th>
                <th className="text-left px-4 py-2 font-semibold">PilotRecognition</th>
              </tr></thead>
              <tbody>
                {([
                  { r: 'Holds raw documents', vault: '✓ Yes', veremark: '✓ Yes (their copy)', pr: '✕ Never' },
                  { r: 'Verifies against registries', vault: '✕ No', veremark: '✓ Yes', pr: '✕ No' },
                  { r: 'Issues verification token', vault: '✓ Vault token', veremark: '✓ Veremark token', pr: '✕ Receives only' },
                  { r: 'Compares both tokens', vault: '✕ No', veremark: '✕ No', pr: '✓ Yes — triangulation' },
                  { r: 'Displays result to pilot/airline', vault: '✕ No', veremark: '✕ No', pr: '✓ Yes — token display' },
                  { r: 'Carries data custodian liability', vault: '✓ Yes', veremark: '✓ Yes', pr: '✕ Zero' },
                  { r: 'Pilot signs DPA with', vault: '✓ Directly', veremark: '✓ Directly', pr: '✓ Consent log only' },
                ] as {r:string;vault:string;veremark:string;pr:string}[]).map((row, i) => (
                  <tr key={row.r} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'}>
                    <td className="px-4 py-2 border-b border-slate-700 text-slate-100 font-medium">{row.r}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-blue-300">{row.vault}</td>
                    <td className="px-4 py-2 border-b border-slate-700 text-yellow-300">{row.veremark}</td>
                    <td className={`px-4 py-2 border-b border-slate-700 font-semibold ${row.pr.startsWith('✕') ? 'text-emerald-400' : 'text-slate-300'}`}>{row.pr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="my-6 px-5 py-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
            <p className="text-sm font-bold text-blue-700 uppercase tracking-widest mb-1">Why This Matters Commercially</p>
            <p className="text-slate-700 leading-relaxed">The vault provider relationship is what allows PilotRecognition to operate as a <strong>data-neutral platform</strong>. Airlines trust the token because it comes from two independent sources. Pilots trust the platform because their data never enters it. Regulators have no basis to classify PilotRecognition as a data controller for credential data — the vault and Veremark hold that liability. This architecture is the legal foundation for global expansion without jurisdiction-by-jurisdiction data compliance registration.</p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-3">Controller-to-Controller API Flow</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Legacy architectures treat background check providers as sub-processors — receiving raw data, running checks, returning results. This creates joint liability that cannot be defended under GDPR Art. 28 because Veremark and IDfy have their own independent legal obligations, registry access agreements, and compliance requirements. <strong>PilotRecognition treats them as Independent Controllers.</strong> We do not pass raw data back and forth. We pass requests and receive binary receipts.</p>

          <div className="space-y-4 mb-6">
            {([
              {
                provider: 'Veremark Integration',
                color: '#34d399',
                steps: [
                  'Pilot initiates a Professional Qualification check via PilotRecognition UI',
                  'PilotRecognition passes the check request to Veremark — no raw document transfer',
                  'Veremark acts as Independent Controller: pings CAAP registry directly under their own regulatory authorisation',
                  'Veremark holds the raw data log — their infrastructure, their liability',
                  'PilotRecognition receives only: receipt_id + binary proof (is_license_valid = TRUE / is_medical_current = FALSE)',
                  'Binary proof stored in Supabase alongside consent timestamp and pilot ID — zero raw credential data',
                ],
              },
              {
                provider: 'IDfy Integration',
                color: '#60a5fa',
                steps: [
                  'Pilot initiates training hours confirmation — selects flight school from verified ATO list',
                  'PilotRecognition passes the confirmation request to IDfy — no raw logbook data transfer',
                  'IDfy acts as Independent Controller: contacts flight school directly under their own data agreements',
                  'School confirms in their dashboard: hours confirmed, denied, or partially corrected',
                  'IDfy also cross-checks Veremark results as triangulation failsafe — mismatch flagged for review',
                  'PilotRecognition receives only: receipt_id + binary proof (training_hours_confirmed = TRUE, confirmed_volume = 200hrs)',
                ],
              },
            ] as {provider:string;color:string;steps:string[]}[]).map((item) => (
              <div key={item.provider} className="border border-slate-200 rounded-lg px-5 py-4 bg-white">
                <p className="font-bold mb-3" style={{color: item.color}}>{item.provider}</p>
                <ol className="space-y-1">
                  {item.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="font-bold flex-shrink-0" style={{color: item.color}}>{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 rounded-lg px-5 py-4 mb-6">
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-3">What PilotRecognition Stores in Supabase — The Complete List</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {([
                { label: 'Stored', color: '#34d399', items: ['Timestamped consent receipt', 'Pilot ID (internal reference)', 'Airline ID (for pathway submissions)', 'Receipt ID from Veremark / IDfy', 'Binary proof result (TRUE / FALSE)', 'Cryptographic signature of approval event', 'Token expiry date'] },
                { label: 'Never Stored', color: '#f87171', items: ['Raw license documents', 'Passport or ID scans', 'Medical certificate files', 'Logbook pages or raw hour entries', 'CAAP registry query results', 'Personal data strings of any kind', 'Verepass raw credential data'] },
              ] as {label:string;color:string;items:string[]}[]).map((col) => (
                <div key={col.label}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{color: col.color}}>{col.label}</p>
                  <ul className="space-y-1">
                    {col.items.map(i => (
                      <li key={i} className="text-xs text-slate-300 flex gap-2">
                        <span style={{color: col.color}} className="flex-shrink-0">→</span>{i}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="my-6 px-5 py-4 border-l-4 border-slate-300 bg-slate-50 rounded-r-lg">
            <p className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-1">Pre-Launch Action</p>
            <p className="text-slate-700 leading-relaxed">Vault provider selection and DPA framework to be finalised before platform goes live. Two options under evaluation: (1) single vendor for both vault and verification — lowest integration friction; (2) separate vault provider from verification provider — preferred for institutional credibility and vendor independence. Final selection pending commercial and technical due diligence.</p>
          </div>

          {/* PUBLIC: Two-Tier Verification Model */}
          <div className="my-6 p-5 bg-white border border-slate-200 rounded-lg">
            <p className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-3">How Pilot Data Works: Free vs Recognition+</p>
            <p className="text-slate-600 mb-4">Two tiers of data integrity. Pilots choose their level of verification based on their career stage and pathway ambitions.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Free Tier — Claimed Credentials</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex gap-2"><span className="text-slate-400">→</span>Pilot manually enters license numbers, flight hours, ratings</li>
                  <li className="flex gap-2"><span className="text-slate-400">→</span>Data stored in PilotRecognition profile only</li>
                  <li className="flex gap-2"><span className="text-slate-400">→</span>Airlines see: <span className="text-amber-600 font-semibold">⚠ Self-reported — unverified</span></li>
                  <li className="flex gap-2"><span className="text-slate-400">→</span>Best for: Exploring pathways, understanding gaps</li>
                </ul>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-2">Recognition+ ($99/year) — Verified Credentials</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex gap-2"><span className="text-emerald-500">→</span>Pilot uploads actual documents to independent vault</li>
                  <li className="flex gap-2"><span className="text-emerald-500">→</span>Documents verified against official registries</li>
                  <li className="flex gap-2"><span className="text-emerald-500">→</span>Airlines see: <span className="text-emerald-600 font-semibold">✓ Verified — cleared for fast-track</span></li>
                  <li className="flex gap-2"><span className="text-emerald-500">→</span>Best for: Serious pathway applications, airline recruitment</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg text-sm">
              <p className="text-emerald-400 font-bold mb-2 uppercase tracking-widest">The Upgrade Path</p>
              <p className="text-slate-300">Free tier pilots can upgrade anytime. Their claimed data becomes "verified" once documents are uploaded and checked. Airlines trust verified pilots more — that's the Recognition+ advantage. No verification = pathway browsing only. Full verification = pathway access + priority matching.</p>
            </div>

            <p className="text-xs text-slate-500 mt-3 italic">Note: EBT interview videos and training materials are stored separately on PilotRecognition infrastructure, not in the credential vault. Only official documents (licenses, medicals, clearances) require third-party vault storage.</p>

            <div className="bg-slate-900 p-4 rounded-lg text-sm mt-4">
              <p className="text-emerald-400 font-bold mb-3 uppercase tracking-widest">The Engine Analogy: How Data Flows</p>
              <div className="space-y-2 text-slate-300">
                <p><span className="text-blue-400 font-bold">Fuel Tanks (Storage):</span> The third-party vault holds the raw pilot documents — like fuel tanks hold avgas. Independent, secure, separate from the engine.</p>
                <p><span className="text-yellow-400 font-bold">Fuel (Pilots):</span> Pilot credentials flow into the vault. Each document is a drop of fuel waiting to be processed.</p>
                <p><span className="text-orange-400 font-bold">Carburetor (Veremark):</span> The verification engine mixes raw documents with registry checks — CAAP, medical databases, clearance records. It "leans" the mixture: unverified claims burn off, only verified credentials pass through.</p>
                <p><span className="text-emerald-400 font-bold">Pistons (Pathways):</span> The verified pilots — now a clean, combustible mix — power the pathways. Airlines get only the verified, cleared-for-takeoff candidates.</p>
              </div>
              <p className="text-slate-400 mt-3 italic text-xs">PilotRecognition is not the fuel, the tank, or the carburetor. We're the ignition timing — the platform that coordinates when verified pilots meet the right pathways. The verification happens upstream. The value flows downstream.</p>
            </div>
          </div>

          {/* INTERNAL: Storage Boundary Clarification */}
          <div className="my-6 p-5 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-3">Internal Reference — Storage Architecture</p>
            <p className="text-sm text-slate-600 mb-4">Clear separation between credential verification (third-party vault) and program content (PilotRecognition infrastructure).</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="text-left px-4 py-2 font-semibold">Content Type</th>
                    <th className="text-left px-4 py-2 font-semibold">Storage Location</th>
                    <th className="text-left px-4 py-2 font-semibold">Typical Size</th>
                    <th className="text-left px-4 py-2 font-semibold">Access Control</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    { content: 'Pilot license (CAAP/GCAA/EASA/FAA)', location: 'Third-party vault', size: '~2-3 MB', access: 'Pilot → Veremark → Token' },
                    { content: 'Class 1 Medical certificate', location: 'Third-party vault', size: '~2 MB', access: 'Pilot → Veremark → Token' },
                    { content: 'Passport / National ID', location: 'Third-party vault', size: '~3 MB', access: 'Pilot → Veremark → Token' },
                    { content: 'NBI / Criminal clearance', location: 'Third-party vault', size: '~1-2 MB', access: 'Pilot → Veremark → Token' },
                    { content: 'Type rating certificates', location: 'Third-party vault', size: '~2-3 MB', access: 'Pilot → Veremark → Token' },
                    { content: 'EBT interview video', location: 'PilotRecognition storage', size: '~150-300 MB', access: 'Program evaluation only' },
                    { content: 'Training program materials', location: 'PilotRecognition storage', size: '~50-100 MB', access: 'Internal program use' },
                    { content: 'Employment history docs', location: 'Third-party vault', size: '~1-2 MB', access: 'Pilot → Veremark → Token' },
                  ] as { content: string; location: string; size: string; access: string }[]).map((row, i) => (
                    <tr key={row.content} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-4 py-2 border-b border-slate-200 text-slate-800 font-medium">{row.content}</td>
                      <td className={`px-4 py-2 border-b border-slate-200 ${row.location.includes('Third-party') ? 'text-blue-600' : 'text-emerald-600'}`}>{row.location}</td>
                      <td className="px-4 py-2 border-b border-slate-200 text-slate-600">{row.size}</td>
                      <td className="px-4 py-2 border-b border-slate-200 text-slate-600 text-xs">{row.access}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 mt-3 italic">Vault provider pricing based on ~15-50MB per pilot (documents only). Program content stored separately on PilotRecognition infrastructure.</p>
          </div>

          {/* INTERNAL: Provider Outreach Targets */}
          <div className="my-6 p-5 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-3">Internal Reference — Vault Provider Outreach Targets</p>
            <p className="text-sm text-slate-600 mb-4">Candidates for third-party vault partnership. Contact after UCF review and internal preparation.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="text-left px-4 py-2 font-semibold">Provider</th>
                    <th className="text-left px-4 py-2 font-semibold">Strength</th>
                    <th className="text-left px-4 py-2 font-semibold">Contact</th>
                    <th className="text-left px-4 py-2 font-semibold">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    { provider: 'IDfy', strength: 'Philippines-based vault, CAAP compliance, local data residency', contact: 'idfy.com/contact', priority: 'High — Philippines launch priority' },
                    { provider: 'Persona', strength: 'KYC-grade identity vault, embeddable SDK, multi-region', contact: 'partnerships@withpersona.com', priority: 'High — global expansion' },
                    { provider: 'Jumio', strength: 'Document vault, financial sector standard, multi-region', contact: 'jumio.com/contact-sales', priority: 'High — enterprise ready' },
                    { provider: 'Onfido', strength: 'GDPR-native, strong EU coverage', contact: 'onfido.com/contact-sales', priority: 'Medium — EU market expansion' },
                    { provider: 'Veremark Vault', strength: 'Single vendor (already verification partner)', contact: 'Existing Veremark relationship', priority: 'Medium — lowest friction' },
                    { provider: 'Trulioo', strength: 'Global identity verification + vault', contact: 'trulioo.com/contact', priority: 'Low — evaluate if primary options fail' },
                  ] as { provider: string; strength: string; contact: string; priority: string }[]).map((row, i) => (
                    <tr key={row.provider} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-4 py-2 border-b border-slate-200 text-slate-800 font-medium">{row.provider}</td>
                      <td className="px-4 py-2 border-b border-slate-200 text-slate-600">{row.strength}</td>
                      <td className="px-4 py-2 border-b border-slate-200 text-slate-600 text-xs">{row.contact}</td>
                      <td className={`px-4 py-2 border-b border-slate-200 text-xs ${row.priority.includes('High') ? 'text-red-600 font-semibold' : row.priority.includes('Medium') ? 'text-yellow-600' : 'text-slate-500'}`}>{row.priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 mt-3 italic">Initial outreach: IDfy (Philippines priority) + Persona/Jumio (global). Local vault for CAAP compliance; global providers for multi-region expansion. Veremark vault as fallback if separate vault proves too complex for September timeline.</p>
          </div>

          {/* INTERNAL: IDfy Deep Dive — Philippines Vault Partner */}
          <div className="my-6 p-5 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-3">Internal Reference — IDfy Analysis: Philippines Vault Partner</p>
            <p className="text-sm text-slate-600 mb-4">IDfy stands out as a viable alternative for the platform. As a dedicated Asia-focused identity and data infrastructure provider, their ecosystem natively aligns with the structural, legal, and financial parameters defined for the September launch.</p>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-2">Why IDfy Aligns with Architecture</p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex gap-2"><span className="text-emerald-500">→</span><strong>Compliant Local Data Custody:</strong> IDfy operates dedicated regional entities and local infrastructure, allowing clean isolation and hosting of digital archives within the Philippines. Directly satisfies data residency mandates for CAAP licenses under NPC Data Privacy Act of 2012.</li>
                <li className="flex gap-2"><span className="text-emerald-500">→</span><strong>Zero-Knowledge & Tokenization Infrastructure:</strong> Platform natively supports developer integrations utilizing pre-signed upload URLs and token-based access management. Structure keeps servers free of raw data handling, maintaining desired legal separation.</li>
                <li className="flex gap-2"><span className="text-emerald-500">→</span><strong>Target Commercial Structure:</strong> Unlike transaction-heavy engines, IDfy accommodates B2B enterprise agreements tailored around volume milestones. Flat SaaS infrastructure fee mapping to $1-2/year per pilot target achievable under volume commitments as scale reaches 10,000 users.</li>
              </ul>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg text-sm mb-4">
              <p className="text-blue-400 font-bold mb-3 uppercase tracking-widest">Architectural Integration Flow</p>
              <div className="space-y-1 text-slate-300 font-mono text-xs">
                <p><span className="text-yellow-400">[Pilot App Frontend]</span> --(1) Request Upload URL--&gt; <span className="text-yellow-400">[Pilot App Backend]</span></p>
                <p className="pl-8">|</p>
                <p className="pl-8">(3) Stream File</p>
                <p className="pl-8">Direct to Vault</p>
                <p className="pl-8">v</p>
                <p><span className="text-emerald-400">[IDfy PH Storage Vault]</span> &lt;------(4) Issue Token------ <span className="text-blue-400">[IDfy Core API]</span></p>
                <p className="pl-8">|</p>
                <p className="pl-8">(5) Return Secure Token Only</p>
                <p className="pl-8">v</p>
                <p><span className="text-slate-500">[Pilot App Database]</span> (Zero raw document touch)</p>
              </div>
            </div>

            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="text-left px-4 py-2 font-semibold">Feature</th>
                    <th className="text-left px-4 py-2 font-semibold">IDfy</th>
                    <th className="text-left px-4 py-2 font-semibold">Jumio</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    { feature: 'Primary Use Case', idfy: 'Localized identity data, verification, & governance', jumio: 'Global real-time identity & biometric verification' },
                    { feature: 'Data Residency', idfy: 'Localized within the Philippines', jumio: 'Centralized cloud regions (Global nodes)' },
                    { feature: 'Core Architecture', idfy: 'Supports persistent tokenized asset storage', jumio: 'Ephemeral processing (Transaction verification engine)' },
                    { feature: 'Pricing Model', idfy: 'Custom enterprise volume pricing tiers', jumio: 'High-cost per-transaction billing ($1-3+ per run)' },
                  ] as { feature: string; idfy: string; jumio: string }[]).map((row, i) => (
                    <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-4 py-2 border-b border-slate-200 text-slate-800 font-medium">{row.feature}</td>
                      <td className="px-4 py-2 border-b border-slate-200 text-emerald-600">{row.idfy}</td>
                      <td className="px-4 py-2 border-b border-slate-200 text-slate-600">{row.jumio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-2">Critical Distinction</p>
              <p className="text-sm text-slate-700">Jumio charges <strong>$1-3+ per verification transaction</strong> — destroys unit economics at scale. IDfy does <strong>flat infrastructure fees</strong> — scales with $99/year pilot subscription model. For 10,000 pilots: Jumio = $10K-30K+ per verification round. IDfy = $10K-20K/year flat.</p>
            </div>

            <p className="text-xs text-slate-500 mt-3 italic">Contact: emily@idfy.com | Next: Technical DPA review + API error-handling procedures.</p>
          </div>

          <hr className="my-8 border-slate-200" />

          {/* PAIN POINTS: THIRD-PARTY DATA VAULT PROVIDERS */}
          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Pain Points for Third-Party Data Vault Providers</h3>
          <p className="text-slate-700 leading-relaxed mb-6">Credential vault providers face structural business challenges that make aviation — and the PilotRecognition distribution model — a compelling strategic fit.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { num: '01', title: 'One-Time Verification = One-Time Revenue', desc: 'You verify a passport once, get paid once. The document sits in your vault for years generating nothing. Most credential vaults have <5% annual access rates — 95% of stored data is financial deadweight.' },
              { num: '02', title: 'Vertical Market Saturation', desc: 'Financial services and crypto exhausted. Aviation is an unpenetrated vertical with high-document complexity — but you have no distribution channel into it. Building airline sales teams is prohibitively expensive.' },
              { num: '03', title: 'Integration Cost Per Client', desc: 'Each enterprise deployment costs $50K-$150K in engineering for custom data flows and DPA negotiations. Small pilots cannot afford this. You need aggregated demand to amortize integration cost.' },
              { num: '04', title: 'Liability Concentration Without Offsetting Revenue', desc: 'You hold the risk: GDPR fines, breach liability, DPA violations. Meanwhile, the data owner pays nothing for storage and accesses rarely. Liability-to-revenue ratio is structurally unfavorable.' },
              { num: '05', title: 'Verification Silos = Incomplete Signal', desc: 'You store documents. Someone else verifies them against registries. You never see the outcome. Your vault has no "verified" dimension — just raw files. Airlines do not trust documents without registry confirmation.' },
              { num: '06', title: 'Pilot Acquisition Cost', desc: 'Direct B2C acquisition for credential vaults fails. Pilots will not proactively upload documents without a "reason" — pathway access, job applications, airline requirements. You have no demand-side platform.' },
              { num: '07', title: 'Regulatory Fragmentation by Jurisdiction', desc: 'CAAP. GCAA. EASA. FAA. Each requires different DPA terms, data residency rules, and registry integration patterns. You need a standardization layer that normalizes these variations.' },
              { num: '08', title: 'Competing Against "Good Enough" Cloud Storage', desc: 'AWS S3 + basic encryption satisfies most naive document storage needs. You compete with $0.023/GB commodity storage. Without a verification outcome layer, your premium pricing is unjustifiable.' },
              { num: '09', title: 'Vendor Consolidation Pressure', desc: 'Airlines want fewer vendors, not more. "We already use Veremark" — your separate vault becomes "another integration" rather than infrastructure. Without workflow embedding, you are value-engineered out.' },
              { num: '10', title: 'Data Erasure vs. Retention Conflict', desc: 'GDPR requires deletion on request. Business logic suggests retention for audit trails. You are caught between compliance and commercial utility. A clear custody termination framework clarifies this ambiguity.' },
            ].map(p => (
              <div key={p.num} className="border border-slate-200 rounded-lg p-5 bg-white">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">{p.num}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-800 mb-2">{p.title}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="my-6 p-5 bg-slate-900 rounded-xl text-sm text-slate-300">
            <p className="text-emerald-400 font-bold mb-4 font-sans text-xs uppercase tracking-widest">How PilotRecognition Addresses These</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { pain: 'One-time revenue', solve: 'Recurring access fees — pilots pay for pathway matching, vault gets per-access revenue share' },
                { pain: 'Vertical saturation', solve: 'Aviation-specific distribution: direct pilot database access, no sales team required' },
                { pain: 'Integration cost', solve: 'Single integration → many airlines via PilotRecognition\'s airline network' },
                { pain: 'Liability concentration', solve: 'Zero data at PilotRecognition; liability stays with vault per explicit DPA boundaries' },
                { pain: 'Verification silos', solve: 'Veremark integration completes the signal; vault + registry = trusted outcome' },
                { pain: 'Pilot acquisition', solve: '"Upload to apply" trigger: pathway access creates natural upload incentive' },
                { pain: 'Regulatory fragmentation', solve: 'PilotRecognition handles jurisdiction-specific consent flows; vault provides standardized API' },
                { pain: 'Cloud storage competition', solve: 'Verification outcome differentiates from dumb storage; worth the premium' },
                { pain: 'Vendor consolidation', solve: 'Embedded in pilot workflow: vault becomes invisible infrastructure, not a separate vendor' },
                { pain: 'Erasure conflict', solve: 'Clear custody lifecycle: pilot controls deletion; PilotRecognition only holds access tokens' },
              ].map((row, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-emerald-400 flex-shrink-0">→</span>
                  <div>
                    <span className="text-slate-400 text-xs">{row.pain}:</span>
                    <span className="text-slate-200 ml-1">{row.solve}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="my-6 px-5 py-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
            <p className="text-sm font-bold text-blue-700 uppercase tracking-widest mb-1">The Pitch to Vault Providers</p>
            <p className="text-slate-700 leading-relaxed italic">"You hold the documents. Veremark verifies them against registries. We provide the demand layer — pilots who need verified credentials to access pathways. You get recurring revenue from a new vertical without building aviation sales teams. We get clean legal separation that lets us scale globally without jurisdiction-by-jurisdiction data compliance. The pilot gets independent custody with purpose-driven access. Three parties, aligned incentives, zero overlap in liability."</p>
          </div>

          {/* INTERNAL: Technical Integration Flow */}
          <div className="my-6 p-5 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-3">Internal Reference — Technical Integration Flow (Hybrid UX)</p>
            <p className="text-sm text-slate-600 mb-4"><strong>Recognition+ members only ($99/year).</strong> Seamless pilot experience with zero legal liability. Pilot sees "Upload through our app" — legally, document flows direct to vault.</p>

            <div className="bg-white p-4 rounded-lg border border-slate-200 font-mono text-xs mb-4">
              <p className="font-bold text-slate-800 mb-2">UPLOAD FLOW (Recognition+ Members Only):</p>
              <div className="space-y-1 text-slate-600">
                <p>1. <span className="text-emerald-600 font-semibold">[Recognition+ Check]</span> Verify active subscription before showing upload widget</p>
                <p>2. Pilot clicks "Upload Documents" in PilotRecognition dashboard</p>
                <p>3. Frontend requests <span className="text-blue-600">pre-signed upload URL</span> from Vault API</p>
                <p>4. File streams <span className="text-emerald-600 font-semibold">DIRECT browser → Vault</span> (bypasses our servers)</p>
                <p>5. Vault returns <span className="text-blue-600">document_token</span> to browser</p>
                <p>6. Browser sends token (not file) to PilotRecognition backend</p>
                <p>7. We store: <code className="bg-slate-100 px-1">{'{vault_token: "doc_xyz789", provider: "persona"}'}</code></p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
                <p className="text-xs font-bold text-emerald-700 uppercase mb-1">What Pilot Sees</p>
                <p className="text-xs text-slate-600"><strong>Recognition+:</strong> "Upload your license" widget.<br/><strong>Free tier:</strong> "Upgrade to secure your documents" CTA.</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-xs font-bold text-blue-700 uppercase mb-1">What Actually Happens</p>
                <p className="text-xs text-slate-600">Direct browser-to-vault transfer via pre-signed URL</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded p-3">
                <p className="text-xs font-bold text-amber-700 uppercase mb-1">Liability Result</p>
                <p className="text-xs text-slate-600">We hold zero raw data. Zero breach risk. Clean DPA.</p>
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg text-xs text-slate-300 font-mono">
              <p className="text-emerald-400 font-bold mb-2">API CALL FOR DASHBOARD DISPLAY:</p>
              <p className="text-slate-400">// When pilot views their verification wallet</p>
              <p className="mb-2">const status = await vaultApi.checkStatus({'{'}</p>
              <p className="pl-2">token: pilot.vault_token, <span className="text-slate-500">// "doc_xyz789"</span></p>
              <p className="pl-2">userId: pilot.id</p>
              <p>{'}'});</p>
              <p className="text-slate-400 mt-2">// Returns verification status only — NOT the PDF</p>
              <p>{'{'} "license": "✓ Verified", "medical": "⚠ Expires 30 days" {'}'}</p>
            </div>

            <p className="text-xs text-slate-500 mt-3 italic">Key technical requirement: Vault provider must support pre-signed URL generation + embeddable iframe for "view document" functionality.</p>
          </div>

          {/* INTERNAL: Country-Specific Vault Strategy */}
          <div className="my-6 p-5 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-3">Internal Reference — Country-Specific Vault Strategy</p>
            <p className="text-sm text-slate-600 mb-4">Vault location determined by license issuing country (data residency). Verification provider (Veremark) location independent — Singapore hub can verify any global registry.</p>

            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="text-left px-4 py-2 font-semibold">Pilot License</th>
                    <th className="text-left px-4 py-2 font-semibold">Vault Location</th>
                    <th className="text-left px-4 py-2 font-semibold">Compliance Requirement</th>
                    <th className="text-left px-4 py-2 font-semibold">Provider Options</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    { license: 'CAAP (Philippines)', vault: 'Philippines', compliance: 'DPA Philippines', providers: 'IDfy (local), Persona (multi-region)' },
                    { license: 'EASA (Europe)', vault: 'EU', compliance: 'GDPR', providers: 'Onfido (EU-native), Persona, Jumio' },
                    { license: 'FAA (USA)', vault: 'USA', compliance: 'US data residency', providers: 'Persona, Jumio (US regions)' },
                    { license: 'GCAA (UAE)', vault: 'UAE / Middle East', compliance: 'UAE data protection', providers: 'Persona, Jumio (ME regions)' },
                    { license: 'CASA (Australia)', vault: 'Australia', compliance: 'Privacy Act 1988', providers: 'Persona, Jumio (APAC)' },
                  ] as { license: string; vault: string; compliance: string; providers: string }[]).map((row, i) => (
                    <tr key={row.license} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-4 py-2 border-b border-slate-200 text-slate-800 font-medium">{row.license}</td>
                      <td className="px-4 py-2 border-b border-slate-200 text-blue-600">{row.vault}</td>
                      <td className="px-4 py-2 border-b border-slate-200 text-slate-600">{row.compliance}</td>
                      <td className="px-4 py-2 border-b border-slate-200 text-slate-600 text-xs">{row.providers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg text-sm">
              <p className="text-emerald-400 font-bold mb-3 uppercase tracking-widest">Key Principle</p>
              <div className="space-y-2 text-slate-300">
                <p><span className="text-blue-400 font-bold">Vault location = License origin</span> (data residency compliance)</p>
                <p><span className="text-yellow-400 font-bold">Verification location = Anywhere</span> (Veremark Singapore verifies CAAP, EASA, FAA equally)</p>
                <p><span className="text-emerald-400 font-bold">Platform layer = Unified</span> (PilotRecognition shows one interface, routes to correct vault by license type)</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3 italic">Philippines launch strategy: Start with IDfy for CAAP compliance. Add Persona/Jumio multi-region capability for global expansion (EASA, FAA, GCAA). Verification remains Veremark throughout.</p>
          </div>

          {/* INTERNAL: Two-Tier Data Model */}
          <div className="my-6 p-5 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-3">Internal Reference — Two-Tier Data Model (Free vs Recognition+)</p>
            <p className="text-sm text-slate-600 mb-4">Clear distinction between claimed data (free tier) and verified data (paid tier). Vault storage drives subscription conversion.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Free Tier — Claimed Data</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex gap-2"><span className="text-slate-400">→</span>Pilot manually enters: license number, hours, ratings</li>
                  <li className="flex gap-2"><span className="text-slate-400">→</span>Status shown to airlines: <span className="text-amber-600 font-semibold">⚠ Unverified claim</span></li>
                  <li className="flex gap-2"><span className="text-slate-400">→</span>Storage: PilotRecognition database only</li>
                  <li className="flex gap-2"><span className="text-slate-400">→</span>No vault integration / zero storage cost</li>
                </ul>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-2">Recognition+ ($99/yr) — Verified Data</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex gap-2"><span className="text-emerald-500">→</span>Pilot uploads actual documents via vault widget</li>
                  <li className="flex gap-2"><span className="text-emerald-500">→</span>Status shown to airlines: <span className="text-emerald-600 font-semibold">✓ Verified via [Persona/Jumio]</span></li>
                  <li className="flex gap-2"><span className="text-emerald-500">→</span>Storage: Token in our DB, docs in third-party vault</li>
                  <li className="flex gap-2"><span className="text-emerald-500">→</span>Vault cost: ~$3-5/year per paid pilot</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg text-sm">
              <p className="text-emerald-400 font-bold mb-3 uppercase tracking-widest">Strategic Implications for Vault Providers</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300">
                <div className="flex gap-2 items-start">
                  <span className="text-emerald-400 flex-shrink-0">1.</span>
                  <p><strong className="text-slate-100">Not all pilots use storage immediately.</strong> Only Recognition+ conversions (~20-30% of signups) trigger vault costs.</p>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="text-emerald-400 flex-shrink-0">2.</span>
                  <p><strong className="text-slate-100">Free tier creates upgrade funnel.</strong> "Verify your claim → Upgrade to Recognition+" CTA drives paid conversions.</p>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="text-emerald-400 flex-shrink-0">3.</span>
                  <p><strong className="text-slate-100">Vault integration drives subscription.</strong> Secure document storage is core value prop for $99/year tier.</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3 italic">Example: 1,000 pilots sign up → ~250 upgrade to Recognition+ → 250 × $4 = $1,000/year vault storage cost. Free tier pilots (750) cost $0 in vault fees.</p>
          </div>

          <hr className="my-10 border-slate-300" />

          {/* HUB F GROWTH */}
          <h1 id="hub-f-growth" className="text-4xl font-bold text-slate-900 mt-12 mb-3 pb-4 border-b-2 border-slate-900 scroll-mt-24">
            HUB F — GROWTH &amp; EXPANSION
          </h1>
          <p className="text-xs font-bold tracking-widest uppercase text-red-600 mb-6">Aviation Events · Government Authorities · International Organizations</p>
          <p className="text-slate-700 leading-relaxed mb-6 text-lg">Hub F connects the platform to the broader institutional aviation ecosystem — the events that bring the industry together, the regulatory authorities that govern it, and the international organizations that set its global standards. These stakeholders do not fit neatly into any operational pillar. They sit above the ecosystem, shaping the environment in which every other pillar operates. Integrating them is how the platform scales from a regional tool to a global industry standard.</p>

          <h2 id="pillar-events" className="text-3xl font-bold text-slate-900 mt-8 mb-6 pb-4 border-b border-slate-300 scroll-mt-24">
            AVIATION EVENTS &amp; CAREER FAIRS
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub F — Growth &amp; Expansion</p>
          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Problem: Career Fairs Are Still Running on Paper Resumes and QR Codes</h3>
          <p className="text-slate-700 leading-relaxed mb-4">The UAE career fair incident that catalysed this platform is the defining case study for what is wrong with aviation events. A qualified, licensed, motivated pilot approaches a major carrier's stand. He is handed a QR code and told to come back with 1,500 hours. The recruiter is numb to unverified resumes. The pilot has no mechanism to demonstrate that he is different from the 500 other pilots who walked up before him. The outcome is a mutual waste of time, money, and opportunity.</p>
          <p className="text-slate-700 leading-relaxed mb-6">The platform transforms the career fair from a resume collection exercise into a live pathway matching event. Pilots pre-register on the platform. Their verified Recognition Profile is live before they arrive. Operators see matched candidates — pre-verified, pathway-aligned, Recognition Score visible — and engage with pilots who are genuinely suitable, not just physically present.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { t: 'The New Event Format', items: ['No paper resumes: QR code pathway access for every pilot at the event', 'Pre-event matching: pilots matched to relevant operators before arriving', 'Live pathway discovery: operators see verified profiles in real time at their stand', 'Post-event outcome tracking: 6-month hire, interview, and connection measurement'] },
              { t: 'What Event Organisers Gain', items: ['50% attendance increase: "pre-matched to operators" is a far stronger attendee proposition', '3x better hire rates vs. traditional career fair format', 'Real-time analytics informing future event planning', '"Future of Aviation Recruitment" positioning vs. competitors still running paper-based events'] },
            ].map(col => (
              <div key={col.t} className="border border-slate-200 rounded-lg p-5 bg-white">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">{col.t}</p>
                <ul className="space-y-1 text-sm text-slate-700">{col.items.map(i => <li key={i} className="flex gap-2"><span className="text-red-500 flex-shrink-0">→</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-10 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>The UAE transformation:</strong> Instead of "Come back when you have 1,500 hours" → <strong style={{color:'#f87171'}}>"Your profile matched 3 Pathways. Schedule your interviews now."</strong></p>
          </div>

          <hr className="my-8 border-slate-200" />

          <h2 id="pillar-government" className="text-3xl font-bold text-slate-900 mt-8 mb-6 pb-4 border-b border-slate-300 scroll-mt-24">
            GOVERNMENT AVIATION AUTHORITIES
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub F — Growth &amp; Expansion</p>
          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Problem: Regulators Still Audit on Paper in a Digital Industry</h3>
          <p className="text-slate-700 leading-relaxed mb-4">CAAP, FAA, EASA, GCAA — every national aviation authority in the world runs pilot credential verification on a combination of paper submissions, manual database queries, and self-declared logbook entries. The compliance process is slow, error-prone, and structurally vulnerable to fraud. An airline hiring a pilot with a forged Class 1 medical certificate has no real-time mechanism to detect the forgery at the point of hire. A regulator auditing a charter operator's pilot records does so manually, weeks after the fact, against documents that were already outdated when submitted.</p>
          <p className="text-slate-700 leading-relaxed mb-6">The platform provides the regulatory infrastructure upgrade the industry has been waiting for: a cryptographically verified, real-time pilot credential database that regulators can query at the point of compliance, not weeks after it matters.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { t: 'Integration Requirements', items: ['Real-time license status verification API (read access)', 'Medical certificate validation feed from AME-linked records', 'Recognition of platform as official competency verification channel', 'Standardised data formats enabling cross-border pilot mobility'] },
              { t: 'What Authorities Gain', items: ['83% reduction in compliance audit time: 120 hours → 20 hours per inspection', 'Fraud prevention: cryptographic verification eliminates credential forgery', 'International pilot mobility: standardised data enables seamless cross-border transfers', 'Data-driven policy: platform insights inform regulatory decision-making with live market data'] },
            ].map(col => (
              <div key={col.t} className="border border-slate-200 rounded-lg p-5 bg-white">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">{col.t}</p>
                <ul className="space-y-1 text-sm text-slate-700">{col.items.map(i => <li key={i} className="flex gap-2"><span className="text-red-500 flex-shrink-0">→</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>

          <hr className="my-8 border-slate-200" />

          <h2 id="pillar-international-orgs" className="text-3xl font-bold text-slate-900 mt-8 mb-6 pb-4 border-b border-slate-300 scroll-mt-24">
            INTERNATIONAL AVIATION ORGANIZATIONS
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub F — Growth &amp; Expansion</p>
          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">IATA, ICAO, and the Global Standard Problem</h3>
          <p className="text-slate-700 leading-relaxed mb-4">ICAO sets the global standards for pilot licensing, medical certification, and competency assessment. IATA represents the commercial interests of the world's airlines. Both organisations operate on data that is years old by the time it informs policy. ICAO's EBT framework was groundbreaking when published — but its implementation across member states is inconsistent, unverifiable, and disconnected from the digital infrastructure pilots actually use. IATA's safety and workforce data relies on member airline submissions that are partial, delayed, and incompatible across systems.</p>
          <p className="text-slate-700 leading-relaxed mb-6">The platform does not compete with international organisations — it provides the data layer they have never had. Real-time, anonymised, globally aggregated pilot competency data, pathway demand curves, licensing gap analysis by region, and EBT benchmark distributions. This is the dataset that makes global aviation workforce policy evidence-based rather than estimate-based.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { t: 'Integration Path', items: ['Anonymous aggregate platform data available to ICAO/IATA research bodies', 'EBT benchmark data feeding into global competency standard reviews', 'Pilot shortage data broken down by region, licence level, and sector', 'Cross-border licensing mobility data for bilateral agreement frameworks'] },
              { t: 'What International Bodies Gain', items: ['First real-time, globally aggregated pilot workforce dataset', 'Evidence-based policy development replacing delayed survey data', 'EBT implementation verification: measure whether the standard is actually working', 'Influence: platform data becomes the industry reference for workforce planning'] },
            ].map(col => (
              <div key={col.t} className="border border-slate-200 rounded-lg p-5 bg-white">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">{col.t}</p>
                <ul className="space-y-1 text-sm text-slate-700">{col.items.map(i => <li key={i} className="flex gap-2"><span className="text-red-500 flex-shrink-0">→</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>

          <hr className="my-10 border-slate-300" />

          {/* HUB G DISCOVERY */}
          <h1 id="hub-g-discovery" className="text-4xl font-bold text-slate-900 mt-12 mb-3 pb-4 border-b-2 border-slate-900 scroll-mt-24">
            HUB G — DIGITAL DISCOVERY
          </h1>
          <p className="text-xs font-bold tracking-widest uppercase text-red-600 mb-6">Search · Professional Networks · Job Boards · AI Platforms · The Discovery Layer</p>
          <p className="text-slate-700 leading-relaxed mb-6 text-lg">Every pilot journey begins with a search. Before a pilot contacts an airline, enrolls in flight school, or commits to a type rating — they search. They ask Google. They scroll LinkedIn. They query an AI assistant. They browse aviation job boards. The problem is that every search returns fragmented, unverified, contradictory information. Hub G is the platform's answer to that problem: structured, verified aviation career data embedded at the point of discovery, wherever that discovery happens.</p>

          <h2 id="pillar-25-discovery" className="text-3xl font-bold text-slate-900 mt-8 mb-6 pb-4 border-b border-slate-300 scroll-mt-24">
            PILLAR 25: DIGITAL DISCOVERY &amp; SEARCH PLATFORMS
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Hub G — Digital Discovery</p>
          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Problem: Aviation Career Information Is the Most Misinformed Category on the Internet</h3>
          <p className="text-slate-700 leading-relaxed mb-4">A search for "Emirates pilot requirements" returns 50 different answers. None are verified by the airline. Most are outdated. Several contain requirements that no longer apply. Professional networks show pilot job posts that closed months ago. Job boards list opportunities without context about actual pathway requirements. AI assistants confidently answer aviation career questions with information scraped from forums that haven't been updated since 2019. The result: pilots make expensive training decisions based on misinformation, and airlines continue receiving applications from pilots who have no realistic chance of meeting the requirements they were never accurately told about.</p>
          <p className="text-slate-700 leading-relaxed mb-6">Pillar 25 solves this by creating a structured data partnership between the platform and the world's discovery infrastructure. Instead of fragmented forum answers, pilots find verified, live pathway data directly in search results, career panels, and AI responses. The platform becomes the authoritative source for aviation career data across every discovery channel.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { t: 'Search Platforms', items: ['Structured pathway schema markup (JobPosting + OccupationalCertification)', 'Career pathway panels displaying verified pilot requirements', 'Knowledge graph integration as authoritative aviation career source', 'Voice search: virtual assistants answer "What do I need to become an Emirates pilot?" with verified data'] },
              { t: 'Professional Networks', items: ['Recognition Score and verified credentials displayed on pilot profiles', 'Pathway cards published as structured opportunities with live requirements', 'AI career assistant trained on verified platform data', 'Direct integration with aviation career search features'] },
              { t: 'Aviation-Specific Platforms', items: ['Real-time pathway requirement sync: no more outdated job posts', 'API integration for live pathway data in aviation job boards', 'Framework data powering airline requirement databases', 'Reddit/Discord bot integration providing framework-backed answers to career questions'] },
            ].map(col => (
              <div key={col.t} className="border border-slate-200 rounded-lg p-5 bg-white">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">{col.t}</p>
                <ul className="space-y-1 text-sm text-slate-700">{col.items.map(i => <li key={i} className="flex gap-2"><span className="text-red-500 flex-shrink-0">→</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="bg-slate-900 border-l-4 border-red-500 px-5 py-4 mb-10 rounded-r">
            <p className="text-white text-sm leading-relaxed"><strong style={{color:'#f87171'}}>The Discovery Flywheel:</strong> When a pilot searches "how to become an Emirates pilot" and finds verified, structured pathway data from the platform — they click through, create a profile, and enter the ecosystem. <strong style={{color:'#f87171'}}>Hub G is where the platform's network effect begins. Every discovery that returns verified data instead of forum speculation is a future pilot entering the verified pipeline.</strong></p>
          </div>

          <hr className="my-8 border-slate-200" />

          {/* PLATFORM LEGAL MODEL & REVENUE STRUCTURE */}
          <h2 id="pillar-platform-legal-model" className="text-3xl font-bold text-slate-900 mt-8 mb-6 pb-4 border-b border-slate-300 scroll-mt-24">
            PLATFORM LEGAL MODEL &amp; REVENUE STRUCTURE
          </h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wide font-semibold">Foundational Framework · Commercial Architecture · Legal Positioning</p>
          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">What PilotRecognition Actually Is — A Domain, Not a Corporation</h3>
          <p className="text-slate-700 leading-relaxed mb-4">PilotRecognition is a <strong>general platform</strong> — a domain that aggregates, structures, and displays reputable information across all UCF pillars. It is not a data company, a verification company, a staffing agency, or a financial institution. It is a <strong>neutral information and consent management layer</strong> operated through contracts with specialist providers who perform every functional role.</p>
          <p className="text-slate-700 leading-relaxed mb-6">This model means the platform does not require traditional business establishment in every jurisdiction it operates. The legal entity is minimal. The liability exposure is minimal. The operational complexity is minimal. What the platform does require — and what it charges for — is <strong>access to structured, verified, aggregated aviation career data</strong> that no other single source provides.</p>

          <div className="my-6 p-5 bg-slate-900 rounded-xl text-sm font-mono text-slate-300 leading-loose">
            <p className="text-emerald-400 font-bold mb-3 font-sans text-xs uppercase tracking-widest">What the Platform Is and Is Not</p>
            <p><span className="text-emerald-400">✓ Is:</span> <span className="text-slate-300">A domain publishing structured aviation career framework data</span></p>
            <p><span className="text-emerald-400">✓ Is:</span> <span className="text-slate-300">A consent management layer connecting pilots to vault + Veremark</span></p>
            <p><span className="text-emerald-400">✓ Is:</span> <span className="text-slate-300">A token display surface showing triangulated verification outcomes</span></p>
            <p><span className="text-emerald-400">✓ Is:</span> <span className="text-slate-300">A pathway matching interface between pilots and operators</span></p>
            <p className="mt-2"><span className="text-red-400">✕ Is not:</span> <span className="text-slate-300">A data custodian for pilot credentials</span></p>
            <p><span className="text-red-400">✕ Is not:</span> <span className="text-slate-300">A verification provider</span></p>
            <p><span className="text-red-400">✕ Is not:</span> <span className="text-slate-300">A staffing or recruitment agency</span></p>
            <p><span className="text-red-400">✕ Is not:</span> <span className="text-slate-300">A financial institution or payments processor</span></p>
            <p><span className="text-red-400">✕ Is not:</span> <span className="text-slate-300">Liable for the accuracy of third-party verification outcomes</span></p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Sequential Accountability Protocol (Liability Chain)</h3>
          <p className="text-slate-700 leading-relaxed mb-4">The platform architecture establishes a structured liability cascade ensuring that accountability flows to the originating data source rather than accumulating at the aggregation layer. When discrepancies, verification failures, or data quality issues emerge, the platform operates under a sequential referral mechanism that routes liability inquiry through the verification chain to the primary attestor.</p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4 mb-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">The Referral Chain Architecture</p>
            <div className="space-y-2 text-sm text-slate-700">
              <p><strong>Level 1 — Platform:</strong> Receives inquiry regarding data accuracy or verification outcome. Response: "The platform functions as a neutral aggregation layer. Verification services are performed by specialist providers under direct contract with participants. Refer inquiry to Veremark (verification provider)."</p>
              <p><strong>Level 2 — Verification Provider (Veremark):</strong> Receives inquiry regarding background check accuracy. Response: "Verification outcomes are based on data submitted by hiring operators and training institutions. Refer inquiry to the data-submitting airline or operator."</p>
              <p><strong>Level 3 — Commercial Operator:</strong> Receives inquiry regarding placement data or hiring outcomes. Response: "Operator assessments are conducted based on credentials issued by manufacturer-affiliated training centers and ATO verification nodes. Refer inquiry to the issuing flight school or training center."</p>
              <p><strong>Level 4 — Manufacturer / Flight School:</strong> Receives inquiry as the original attestor. Response: "This institution is the primary source of the contested data (hours, competency assessments, placement claims). Accountability rests with the originating entity per their Verification Node agreement."</p>
            </div>
          </div>

          <p className="text-slate-700 leading-relaxed mb-4"><strong>The Legal Outcome:</strong> Because every data element in the platform is cryptographically signed by its originating entity (flight school, operator, verification provider), liability cannot aggregate at the platform layer. The platform's role is limited to displaying triangulated outcomes from independently warranted sources. Each participant in the ecosystem contractually warrants the accuracy of their own submissions. The pilot, as data owner, controls which attestations appear in their Professional Standing Asset and bears ultimate responsibility for the veracity of their claimed credentials.</p>

          <p className="text-slate-700 leading-relaxed mb-4">This architecture ensures that the platform is structurally incapable of being held liable for data quality because the platform itself generates no data — it only displays what independent, warranting parties have submitted. The Sequential Accountability Protocol transforms platform liability from a legal risk into a contractual impossibility.</p>

          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Administrative Fee Structure for Legal Inquiries</h3>
          <p className="text-slate-700 leading-relaxed mb-4">The Sequential Accountability Protocol operates as a monetized administrative service. Each entity in the referral chain may assess fees for legal review, record retrieval, and attestation verification. This ensures that frivolous or unsubstantiated claims face economic disincentives while legitimate grievances receive proper administrative attention. Standard fee structures apply at each protocol level:</p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4 mb-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Standard Administrative Fee Schedule</p>
            <div className="space-y-2 text-sm text-slate-700">
              <p><strong>Level 1 — Platform:</strong> Initial inquiry intake and liability chain routing: <strong>$500-2,000</strong> per matter. Includes case assessment, originating attestor identification, and Signed Liability Chain Report generation.</p>
              <p><strong>Level 2 — Verification Provider:</strong> Background check record retrieval and accuracy warranty review: <strong>$1,000-3,000</strong> per subpoena or record request.</p>
              <p><strong>Level 3 — Commercial Operator:</strong> Placement data audit and credential verification review: <strong>$2,000-5,000</strong> per inquiry.</p>
              <p><strong>Level 4 — Originating Attestor:</strong> Primary source record verification, hours/competency audit: <strong>$1,500-4,000</strong> per attestation review.</p>
              <p><strong>Full Chain Documentation:</strong> Comprehensive Signed Liability Chain Report with all cryptographic signatures and attestations: <strong>$5,000-10,000</strong>.</p>
            </div>
          </div>

          <p className="text-slate-700 leading-relaxed mb-4"><strong>Economic Deterrent Effect:</strong> The cumulative administrative cost of pursuing a claim through the full Sequential Accountability Protocol ($10,000-24,000) ensures that only substantiated grievances with legitimate merit proceed beyond initial inquiry. This protects ecosystem participants from frivolous litigation while creating a revenue stream for legitimate administrative services. The platform and all participating providers reserve the right to assess these fees regardless of claim outcome or merit.</p>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Universal Liability Chain (All 25 Pillars)</h3>
          <p className="text-slate-700 leading-relaxed mb-4">The Sequential Accountability Protocol operates uniformly across all UCF pillars. Every data type has a defined liability pathway ensuring accountability routes to the original attestor, not the aggregation layer.</p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4 mb-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">HUB A — Aviation Operators & Training</p>
            <div className="space-y-2 text-sm text-slate-700">
              <p><strong>P1: Commercial Airlines</strong> — Dispute: "Pilot wasn't qualified" → <em>Final: ATO (issued competency tokens)</em></p>
              <p><strong>P2: Cargo & Freight</strong> — Dispute: "Pilot failed heavy jet transition" → <em>Final: Simulator Provider (certified proficiency)</em></p>
              <p><strong>P3: Charter & Business</strong> — Dispute: "SIC hire washed out" → <em>Final: Pilot (owns Professional Standing Asset)</em></p>
              <p><strong>P4: Emerging/AAM</strong> — Dispute: "eVTOL operator lacked certs" → <em>Final: OEM Training Center</em></p>
              <p><strong>P5: Flight Training</strong> — Dispute: "Hours were falsified" → <em>Final: ATO Verification Node</em></p>
              <p><strong>P6: Type Rating Centers</strong> — Dispute: "Simulator time didn't match logbook" → <em>Final: Simulator Center (hardware logs)</em></p>
              <p><strong>P7: Universities</strong> — Dispute: "Degree claims inaccurate" → <em>Final: Registrar (issued academic credentials)</em></p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4 mb-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">HUB B/C — Capital, Risk & Compliance</p>
            <div className="space-y-2 text-sm text-slate-700">
              <p><strong>P8: Banking</strong> — Dispute: "Loan default on falsified placement data" → <em>Final: Institution (submitted placement metrics)</em></p>
              <p><strong>P9: Insurance</strong> — Dispute: "Incident with pilot using fake hours" → <em>Final: ATO (issued Verification Node tokens)</em></p>
              <p><strong>P10: Regulatory</strong> — Dispute: "Compliance data inaccurate" → <em>Final: Authority (issued official certificate)</em></p>
              <p><strong>P13: Aeromedical</strong> — Dispute: "Medical cert expired but pilot flew" → <em>Final: AME (issued Class 1 certification)</em></p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4 mb-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">HUB D/E/F/G — Infrastructure, Community, Growth</p>
            <div className="space-y-2 text-sm text-slate-700">
              <p><strong>P11: Verification</strong> — Dispute: "Background check was wrong" → <em>Final: Verification Provider (warrants accuracy)</em></p>
              <p><strong>P12: Flight Data</strong> — Dispute: "Telemetry data incorrect" → <em>Final: FL.io/ADS-B Provider</em></p>
              <p><strong>P14: Mentors</strong> — Dispute: "Mentorship hours weren't logged" → <em>Final: Mentor (submitted attestation)</em></p>
              <p><strong>P15: Manufacturers</strong> — Dispute: "Type rating competency overstated" → <em>Final: Manufacturer (issued credential)</em></p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4 mb-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">The Pattern: Where Liability Always Lands</p>
            <div className="space-y-2 text-sm text-slate-700">
              <p><strong>Flight hours:</strong> ATO/Flight School → <em>Cryptographic Signer: ATO Verification Node</em></p>
              <p><strong>Medical status:</strong> Aeromedical Examiner → <em>Cryptographic Signer: AME (Pillar 13)</em></p>
              <p><strong>Background check:</strong> Veremark/HireRight → <em>Cryptographic Signer: Verification Provider (Pillar 11)</em></p>
              <p><strong>Type rating:</strong> Simulator Center → <em>Cryptographic Signer: TRC (Pillar 6)</em></p>
              <p><strong>Academic degree:</strong> University/Academy → <em>Cryptographic Signer: Registrar</em></p>
              <p><strong>Operator placement:</strong> Commercial Airline → <em>Cryptographic Signer: Airline HR (Pillar 1)</em></p>
              <p><strong>Insurance risk score:</strong> Insurance Underwriter → <em>Cryptographic Signer: Underwriter (Pillar 9)</em></p>
              <p><strong>Credit/loan performance:</strong> Financial Institution → <em>Cryptographic Signer: Bank (Pillar 8)</em></p>
              <p><strong>Competency tokens:</strong> Manufacturer/OEM → <em>Cryptographic Signer: OEM Training (Pillar 15)</em></p>
              <p><strong>Profile content:</strong> Individual Pilot → <em>Cryptographic Signer: Pilot (private key owner)</em></p>
            </div>
          </div>

          <h3 id="pillar-legal-inquiry-fees" className="text-xl font-bold text-slate-800 mt-8 mb-4 scroll-mt-24">Legal & Administrative Services Revenue (Detailed)</h3>
          <p className="text-slate-700 leading-relaxed mb-4">The Sequential Accountability Protocol generates revenue at every level of the liability chain. This transforms legal protection into a profit center while maintaining the platform's neutral positioning.</p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Level</th>
                  <th className="text-left px-4 py-2 font-semibold">Service</th>
                  <th className="text-left px-4 py-2 font-semibold">Fee Range</th>
                  <th className="text-left px-4 py-2 font-semibold">Est. Volume (Y1)</th>
                  <th className="text-left px-4 py-2 font-semibold">Revenue</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-200"><td className="px-4 py-2"><strong>Level 1</strong></td><td className="px-4 py-2">Initial inquiry intake, liability chain routing</td><td className="px-4 py-2">$500-2,000</td><td className="px-4 py-2">50 inquiries</td><td className="px-4 py-2">$75,000</td></tr>
                <tr className="border-b border-slate-200 bg-slate-50"><td className="px-4 py-2"><strong>Level 2</strong></td><td className="px-4 py-2">Verification record retrieval (Veremark)</td><td className="px-4 py-2">$1,000-3,000</td><td className="px-4 py-2">30 inquiries</td><td className="px-4 py-2">$60,000</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2"><strong>Level 3</strong></td><td className="px-4 py-2">Placement data audit, credential review</td><td className="px-4 py-2">$2,000-5,000</td><td className="px-4 py-2">20 inquiries</td><td className="px-4 py-2">$70,000</td></tr>
                <tr className="border-b border-slate-200 bg-slate-50"><td className="px-4 py-2"><strong>Level 4</strong></td><td className="px-4 py-2">Primary source verification, hours audit</td><td className="px-4 py-2">$1,500-4,000</td><td className="px-4 py-2">15 inquiries</td><td className="px-4 py-2">$41,250</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2"><strong>Full Chain</strong></td><td className="px-4 py-2">Comprehensive report with all signatures</td><td className="px-4 py-2">$5,000-10,000</td><td className="px-4 py-2">10 cases</td><td className="px-4 py-2">$75,000</td></tr>
                <tr className="bg-slate-900 text-white"><td className="px-4 py-2 font-bold" colSpan={4}>Legal Services Subtotal</td><td className="px-4 py-2 font-bold">$321,250</td></tr>
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4 mb-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Triple Win Architecture</p>
            <div className="space-y-2 text-sm text-slate-700">
              <p><strong>Platform:</strong> Protection + administrative routing fees per inquiry</p>
              <p><strong>Ecosystem Providers:</strong> Cost recovery for record retrieval and verification</p>
              <p><strong>Legitimate Claimants:</strong> Full accountability chain if claim has merit</p>
              <p><strong>Frivolous Claims:</strong> Economic screening ($10,000-24,000 to reach liable party)</p>
            </div>
          </div>

          <h3 id="pillar-credential-chain" className="text-xl font-bold text-slate-800 mt-8 mb-4 scroll-mt-24">Example: Full Liability Chain Cost Structure</h3>
          <p className="text-slate-700 leading-relaxed mb-4">A dispute over pilot credentials demonstrates how the Sequential Accountability Protocol operates as an economic screening mechanism. Each entity in the chain assesses administrative fees for record retrieval and verification routing:</p>

          <div className="bg-slate-900 rounded-lg px-5 py-4 mb-5 text-sm font-mono">
            <p className="text-slate-400 mb-2">// Example: Credential Verification Dispute</p>
            <div className="space-y-1 text-slate-300">
              <p><span className="text-emerald-400">Level 1:</span> Platform <span className="text-slate-500">→</span> Case intake, attestor identification <span className="text-amber-400">$500</span></p>
              <p><span className="text-emerald-400">Level 2:</span> Verification Provider <span className="text-slate-500">→</span> Background check records <span className="text-amber-400">$1,500</span></p>
              <p><span className="text-emerald-400">Level 3:</span> Regulatory Authority <span className="text-slate-500">→</span> License verification records <span className="text-amber-400">$3,000</span></p>
              <p><span className="text-emerald-400">Level 4:</span> Type Rating Organization <span className="text-slate-500">→</span> Simulator/competency records <span className="text-amber-400">$2,000</span></p>
              <p><span className="text-emerald-400">Level 5:</span> Flight School <span className="text-slate-500">→</span> Training hour verification <span className="text-amber-400">$1,500</span></p>
              <p><span className="text-emerald-400">Level 6:</span> Individual Pilot <span className="text-slate-500">→</span> Final attestor (no fee, owns data)</p>
            </div>
            <p className="text-slate-400 mt-3 pt-3 border-t border-slate-700">Total to reach liable party: <span className="text-red-400 font-bold">$8,500+</span> in administrative fees</p>
          </div>

          <p className="text-slate-700 leading-relaxed mb-4"><strong>The Structural Protection:</strong> By the time a claimant pays to traverse the full chain, one of three outcomes occurs:</p>
          <ol className="list-decimal list-inside space-y-1 text-slate-700 mb-4 ml-4">
            <li><strong>Budget exhaustion:</strong> Claimant abandons pursuit due to cumulative costs exceeding claim value</li>
            <li><strong>Intermediate settlement:</strong> Dispute resolves with a mid-chain entity (flight school, type rating org) rather than reaching the platform</li>
            <li><strong>Merit validation:</strong> Only substantiated claims with genuine evidence proceed to final attestor</li>
          </ol>
          <p className="text-slate-700 leading-relaxed mb-6"><strong>Why this strengthens trust:</strong> The fee structure ensures that only verified, warrantied data appears on the platform. Every entity in the chain has cryptographic skin in the game — their signature is their bond. The platform displays only what independent, warranting parties have submitted under contractual attestation. This is not "pay-to-play" — it is "verify-or-be-liable" enforced through cryptographic accountability.</p>

          <h3 id="pillar-financial-chain" className="text-xl font-bold text-slate-800 mt-8 mb-4 scroll-mt-24">Example: Financial & Risk Assessment Chain</h3>
          <p className="text-slate-700 leading-relaxed mb-4">Disputes involving financial underwriting or insurance risk assessments follow a parallel liability pathway through the capital and compliance hubs:</p>

          <div className="bg-slate-900 rounded-lg px-5 py-4 mb-5 text-sm font-mono">
            <p className="text-slate-400 mb-2">// Example: Training Loan Default Dispute</p>
            <div className="space-y-1 text-slate-300">
              <p><span className="text-emerald-400">Level 1:</span> Platform <span className="text-slate-500">→</span> Data routing, attestor mapping <span className="text-amber-400">$500</span></p>
              <p><span className="text-emerald-400">Level 2:</span> Financial Institution <span className="text-slate-500">→</span> Loan underwriting records <span className="text-amber-400">$2,500</span></p>
              <p><span className="text-emerald-400">Level 3:</span> Insurance Underwriter <span className="text-slate-500">→</span> Risk assessment documentation <span className="text-amber-400">$2,000</span></p>
              <p><span className="text-emerald-400">Level 4:</span> Placement Data Provider <span className="text-slate-500">→</span> Employment outcome verification <span className="text-amber-400">$1,500</span></p>
              <p><span className="text-emerald-400">Level 5:</span> Flight School <span className="text-slate-500">→</span> Training completion records <span className="text-amber-400">$1,500</span></p>
              <p><span className="text-emerald-400">Level 6:</span> Individual Pilot <span className="text-slate-500">→</span> Borrower/consenting party</p>
            </div>
            <p className="text-slate-400 mt-3 pt-3 border-t border-slate-700">Total to reach liable party: <span className="text-red-400 font-bold">$8,000+</span> in administrative fees</p>
          </div>

          <p className="text-slate-700 leading-relaxed mb-4"><strong>Cross-Hub Liability Routing:</strong> Financial disputes traverse through Capital Hub (Pillar 8), Risk Hub (Pillar 9), and Training Hub (Pillar 5) before reaching the individual. Each hub maintains independent cryptographic signatures on their data contributions:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-700 mb-6 ml-4">
            <li><strong>Banking records:</strong> Financial institution warrants loan performance data</li>
            <li><strong>Risk assessments:</strong> Insurance provider warrants underwriting calculations</li>
            <li><strong>Placement metrics:</strong> Operator warrants employment outcome claims</li>
            <li><strong>Training records:</strong> ATO warrants competency and hour attestations</li>
          </ul>
          <p className="text-slate-700 leading-relaxed mb-6">The platform aggregates these warrantied data points to generate composite scores (Creditworthiness Index, Risk Score, Placement Probability) but never generates the underlying data. Each score component traces to an independent cryptographic signature from the originating entity. This multi-source triangulation ensures that no single point of failure can compromise data integrity — and no single entity can be held liable for composite outcomes.</p>

          <h3 id="pillar-verification-depth" className="text-xl font-bold text-slate-800 mt-8 mb-4 scroll-mt-24">The Liability Chain as Verification Depth Indicator</h3>
          <p className="text-slate-700 leading-relaxed mb-4">The number of pillars a dispute must traverse is not a liability weakness — it is a <strong>verification strength indicator</strong>. Every additional hop in the Sequential Accountability Protocol represents an additional layer of independent attestation that the data has already passed through.</p>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-5 py-4 mb-5">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3">Verification Depth = Liability Chain Length</p>
            <div className="space-y-2 text-sm text-slate-700">
              <p><strong>Single-source platforms:</strong> 1-2 hops to liable party → $500-1,500 dispute cost → <em>Indicates minimal verification layers, higher data risk</em></p>
              <p><strong>PilotRecognition:</strong> 5-6 hops to liable party → $8,000-24,000 dispute cost → <em>Indicates multiple independent attestations, higher data reliability</em></p>
            </div>
          </div>

          <p className="text-slate-700 leading-relaxed mb-4">When an airline views a pilot's Professional Standing Asset on PilotRecognition, they are not seeing "platform data" — they are seeing data that has already survived scrutiny from:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-700 mb-4 ml-4">
            <li><strong>Training verification</strong> (ATO/competency attestor)</li>
            <li><strong>Regulatory verification</strong> (licensing authority)</li>
            <li><strong>Background verification</strong> (screening provider)</li>
            <li><strong>Employment verification</strong> (prior operators)</li>
            <li><strong>Financial verification</strong> (underwriting institution, if applicable)</li>
            <li><strong>Risk verification</strong> (insurance assessment, if applicable)</li>
          </ul>
          <p className="text-slate-700 leading-relaxed mb-4">Each of these entities has independently cryptographically signed their attestation. The liability chain length directly correlates with verification depth: <strong>the more expensive a claim is to pursue, the more layers of verification the data has already undergone.</strong></p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4 mb-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">The Competitive Moat</p>
            <p className="text-sm text-slate-700 mb-2">Competitors offering "cheaper dispute resolution" are advertising their verification shallowness. A $500 dispute cost means the platform holds the data directly with minimal third-party attestation — meaning <em>they</em> are the liable party when the data is wrong.</p>
            <p className="text-sm text-slate-700">PilotRecognition's $8,000-24,000 dispute cost signals to operators: <strong>this data has been battle-tested through multiple independent warranting parties.</strong> The cost is the proof of quality.</p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Platform Legal Positioning Summary</h3>
          <div className="my-6 p-5 bg-slate-900 rounded-xl text-sm font-mono text-slate-300 leading-loose">
            <p className="text-emerald-400 font-bold mb-3 font-sans text-xs uppercase tracking-widest">What the Platform IS:</p>
            <p>• A domain publishing structured aviation career framework data</p>
            <p>• A consent management layer connecting pilots to vault + Veremark</p>
            <p>• A token display surface showing triangulated verification outcomes</p>
            <p>• A pathway matching interface between pilots and operators</p>
            <p>• A neutral aggregation and communication layer</p>
            <p className="mt-3 text-red-400 font-bold mb-1 font-sans text-xs uppercase tracking-widest">What the Platform IS NOT:</p>
            <p className="text-slate-400">✗ A data custodian for pilot credentials (handled by Vault provider)</p>
            <p className="text-slate-400">✗ A verification provider (handled by Veremark)</p>
            <p className="text-slate-400">✗ A staffing or recruitment agency</p>
            <p className="text-slate-400">✗ A financial institution or payments processor (handled by Stripe)</p>
            <p className="text-slate-400">✗ Liable for the accuracy of third-party verification outcomes</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg px-5 py-4 mb-5">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">The Kill Shot: Platform's Standard Response</p>
            <p className="text-sm text-slate-700 italic">"PilotRecognition functions as a neutral aggregation and communication layer. Every data element displayed on the platform is cryptographically signed by an independent third party under contractual warranty. The platform does not generate, modify, or verify data — it only routes third-party attestations to their intended recipients. Refer all inquiries regarding data accuracy to the originating attestor identified by cryptographic signature in the pilot's Professional Standing Asset."</p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Strategic Positioning: Switzerland Neutrality</h3>
          <p className="text-slate-700 leading-relaxed mb-4">The "Switzerland" neutrality is the legal shield — by explicitly NOT performing regulated activities and only acting as an information/aggregation layer, the platform avoids the specialized licensing requirements that would apply to actual flight schools, banks, or recruitment agencies.</p>
          <p className="text-slate-700 leading-relaxed mb-4"><strong>Result:</strong> Structural invincibility through:</p>
          <ol className="list-decimal list-inside space-y-1 text-slate-700 mb-4 ml-4">
            <li>Cryptographic signatures creating audit trails</li>
            <li>Contractual warranties at every level</li>
            <li>Platform never being the "author" — only the "publisher"</li>
            <li>Safe harbor provisions (like Section 230) architected through cryptography</li>
          </ol>
          <p className="text-slate-700 leading-relaxed mb-6">The platform is 4-6 hops removed from any liability, and by the time a plaintiff reaches the original attestor, they've either run out of legal budget, settled with the flight school/airline, or realized the platform has zero assets to seize.</p>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Verdict: Legal Standing</h3>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-5 py-4 mb-4">
            <p className="text-sm text-slate-700 mb-2"><strong className="text-emerald-700">✓ Structurally untouchable for data liability</strong> — cannot be sued because "the hours were wrong."</p>
          </div>
          <p className="text-slate-700 leading-relaxed mb-2"><strong>Operationally touchable for:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-slate-700 mb-4 ml-4">
            <li>Security breaches</li>
            <li>Platform failures (bugs, negligence)</li>
            <li>Privacy violations (GDPR)</li>
            <li>Contract disputes (breach of $100/yr terms)</li>
          </ul>
          <p className="text-slate-700 leading-relaxed mb-6"><strong>Overall assessment:</strong> As close to "legally untouchable" as an aggregation platform can be, but not invincible. Maintain neutrality, don't editorialize, keep security tight.</p>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Comprehensive Revenue Architecture</h3>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Revenue Stream</th>
                  <th className="text-left px-4 py-2 font-semibold">Y1 Conservative</th>
                  <th className="text-left px-4 py-2 font-semibold">Y1 Stretch</th>
                  <th className="text-left px-4 py-2 font-semibold">Y2 Target</th>
                  <th className="text-left px-4 py-2 font-semibold">Y3 Target</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-200"><td className="px-4 py-2">Programs & Campus</td><td className="px-4 py-2">$307,000</td><td className="px-4 py-2">$450,000</td><td className="px-4 py-2">$1.5M</td><td className="px-4 py-2">$5M</td></tr>
                <tr className="border-b border-slate-200 bg-slate-50"><td className="px-4 py-2">Recognition Plus</td><td className="px-4 py-2">$297,000</td><td className="px-4 py-2">$500,000</td><td className="px-4 py-2">$2M</td><td className="px-4 py-2">$8M</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2">Premium Pathways</td><td className="px-4 py-2">$99,500</td><td className="px-4 py-2">$200,000</td><td className="px-4 py-2">$800K</td><td className="px-4 py-2">$3M</td></tr>
                <tr className="border-b border-slate-200 bg-slate-50"><td className="px-4 py-2">Enterprise Operators</td><td className="px-4 py-2">$145,000</td><td className="px-4 py-2">$300,000</td><td className="px-4 py-2">$1.2M</td><td className="px-4 py-2">$5M</td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2">Referral Fees</td><td className="px-4 py-2">$28,000</td><td className="px-4 py-2">$50,000</td><td className="px-4 py-2">$200K</td><td className="px-4 py-2">$800K</td></tr>
                <tr className="border-b border-slate-200 bg-emerald-50"><td className="px-4 py-2"><strong>Legal/Admin Services</strong></td><td className="px-4 py-2"><strong>$321,250</strong></td><td className="px-4 py-2"><strong>$500,000</strong></td><td className="px-4 py-2"><strong>$1M</strong></td><td className="px-4 py-2"><strong>$3M</strong></td></tr>
                <tr className="border-b border-slate-200"><td className="px-4 py-2">OEM Intelligence</td><td className="px-4 py-2">-</td><td className="px-4 py-2">$200,000</td><td className="px-4 py-2">$1.5M</td><td className="px-4 py-2">$8M</td></tr>
                <tr className="bg-slate-900 text-white"><td className="px-4 py-2 font-bold">Total</td><td className="px-4 py-2 font-bold">$1,197,750</td><td className="px-4 py-2 font-bold">$2,200,000</td><td className="px-4 py-2 font-bold">$8.2M</td><td className="px-4 py-2 font-bold">$32.8M</td></tr>
                <tr className="bg-slate-800 text-white"><td className="px-4 py-2 font-bold">Exit Valuation</td><td className="px-4 py-2">-</td><td className="px-4 py-2">-</td><td className="px-4 py-2">-</td><td className="px-4 py-2 font-bold">$200-500M</td></tr>
              </tbody>
            </table>
          </div>

          <p className="text-slate-700 leading-relaxed mb-6"><strong className="text-emerald-600">The legal telephone game is your hidden profit center</strong> — $321,250/year just from routing liability inquiries, with potential to scale to $1M+ as platform grows.</p>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">The Contract Model — $100/Year Per Pilot</h3>
          <p className="text-slate-700 leading-relaxed mb-6">Pilots access the platform under a <strong>direct contract</strong> — not a SaaS subscription in the traditional sense, but a service agreement granting access to the platform's aggregated data layer, pathway matching, and verification token display. At <strong>$100/year per pilot</strong>, the contract is simple: the pilot pays for access to the most structured, verified, and comprehensive aviation career intelligence platform in existence. The platform provides access. Specialist providers deliver every underlying service.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { t: 'Pilot Contract ($100/yr)', color: 'text-red-600', items: ['Access to all UCF pillar data and pathway cards', 'Verification wallet — token display from vault + Veremark', 'Recognition Score calculation and gap analysis', 'Pathway matching against all operator requirements', 'EBT video assessment submission', 'Priority queue status for operator pull', 'ATLAS CV generation and export', 'Consent management for operator data access'] },
              { t: 'Operator Contract ($1,000/yr)', color: 'text-blue-600', items: ['Enterprise pull-API access to verified pilot pool', 'Pre-Cleared pilot shortlist filtered by pathway', 'Recognition Score as first-pass hiring filter', 'ATS integration — Greenhouse / Workday / Oracle', 'EBT video assessment access for shortlisted pilots', 'Pathway card publishing and management', 'Consent-gated wallet token access per pilot', 'Compliance audit trail for every data access event'] },
              { t: 'Provider Contracts (Revenue Share)', color: 'text-emerald-600', items: ['Vault provider — data custody (DPA direct with pilot)', 'Veremark — verification (DPA direct with pilot)', 'Referral partners — $20/conversion (flight schools, TRCs)', 'Flight school referral — $20 per pilot converted', 'Manufacturer referral — $20 per pilot converted', 'Type rating center — $20 per pilot converted', 'Stripe — payment processing (no financial liability)', 'Resend — email delivery (no data custody)'] },
            ].map(col => (
              <div key={col.t} className="border border-slate-200 rounded-lg p-5 bg-white">
                <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${col.color}`}>{col.t}</p>
                <ul className="space-y-1 text-sm text-slate-700">{col.items.map(i => <li key={i} className="flex gap-2"><span className="text-red-500 flex-shrink-0">&rarr;</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Revenue Model at Scale</h3>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="bg-slate-900 text-white">
                <th className="text-left px-4 py-2 font-semibold">Revenue Stream</th>
                <th className="text-left px-4 py-2 font-semibold">Unit Price</th>
                <th className="text-left px-4 py-2 font-semibold">1,000 Units</th>
                <th className="text-left px-4 py-2 font-semibold">10,000 Units</th>
              </tr></thead>
              <tbody>
                {([
                  { stream: 'Pilot contracts', price: '$100/yr', k1: '$100,000', k10: '$1,000,000' },
                  { stream: 'Operator contracts', price: '$1,000/yr', k1: '$1,000,000', k10: '$10,000,000' },
                  { stream: 'Referral conversions', price: '$20/pilot', k1: '$20,000', k10: '$200,000' },
                  { stream: 'Foundation Program', price: '$49/pilot', k1: '$49,000', k10: '$490,000' },
                  { stream: 'Transition Program', price: '$299/pilot', k1: '$299,000', k10: '$2,990,000' },
                  { stream: 'Success fees (hires)', price: '$500/hire', k1: '$500,000', k10: '$5,000,000' },
                ] as {stream:string;price:string;k1:string;k10:string}[]).map((row, i) => (
                  <tr key={row.stream} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="px-4 py-2 border-b border-slate-200 text-slate-800 font-medium">{row.stream}</td>
                    <td className="px-4 py-2 border-b border-slate-200 text-slate-600">{row.price}</td>
                    <td className="px-4 py-2 border-b border-slate-200 text-blue-700 font-semibold">{row.k1}</td>
                    <td className="px-4 py-2 border-b border-slate-200 text-emerald-700 font-semibold">{row.k10}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">The Engine Metaphor — Many Parts, One Function</h3>
          <p className="text-slate-700 leading-relaxed mb-4">The platform operates like an engine. An engine is not the fuel. It is not the exhaust. It is not the pistons individually. It is the <strong>structure that makes all the parts work together</strong>. Remove any single part and the engine stops. The parts themselves are nothing without the structure that coordinates them.</p>
          <p className="text-slate-700 leading-relaxed mb-6">PilotRecognition is the engine. Veremark is a part. The vault provider is a part. Stripe is a part. The referral network is a part. The airline portal is a part. Each provider is specialist, independent, and fully liable for their own function. But <strong>none of them can serve a pilot without the platform that connects them</strong>. The platform's value is not in what it holds — it holds nothing. Its value is in what it coordinates.</p>

          <div className="my-6 p-5 bg-slate-900 rounded-xl text-sm text-slate-300 leading-relaxed">
            <p className="text-yellow-400 font-bold mb-4 text-xs uppercase tracking-widest font-sans">The Neutrality-Through-Liability Model</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-emerald-400 font-semibold mb-2 text-xs uppercase tracking-wide">Every Provider Needs the Platform</p>
                <ul className="space-y-1 text-sm">
                  {['Veremark needs the pilot pipeline we generate', 'The vault needs the consent flow we manage', 'Flight schools need the pilot discovery we provide', 'Airlines need the verified pool we aggregate', 'Referral partners need the conversion surface we operate', 'None can reach pilots at scale without the platform'].map(i => <li key={i} className="flex gap-2"><span className="text-emerald-400 flex-shrink-0">→</span>{i}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-red-400 font-semibold mb-2 text-xs uppercase tracking-wide">Every Provider Carries Their Own Liability</p>
                <ul className="space-y-1 text-sm">
                  {['Vault: data custodian liability — not ours', 'Veremark: verification accuracy liability — not ours', 'Stripe: payment processing liability — not ours', 'Airlines: hiring decision liability — not ours', 'Referral partners: commission disputes — not ours', 'Platform liability: access to an information layer — minimal'].map(i => <li key={i} className="flex gap-2"><span className="text-red-400 flex-shrink-0">→</span>{i}</li>)}
                </ul>
              </div>
            </div>
            <p className="mt-4 text-slate-400 text-xs italic">The more liability each provider carries independently, the more neutral the platform becomes — and the more every provider needs it to function.</p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Redundancy — No Single Point of Failure</h3>
          <p className="text-slate-700 leading-relaxed mb-4">A single-provider engine fails when one part fails. The platform is architected with <strong>redundant providers at every functional layer</strong>. If a vault provider goes offline, a backup vault is activated. If Veremark has an outage, a secondary verification provider covers the gap. If Stripe has a processing issue, an alternative payment rail exists. The pilot experience never breaks because the engine has spares for every part.</p>
          <p className="text-slate-700 leading-relaxed mb-6">This is not just operational resilience — it is <strong>commercial leverage</strong>. No single provider can hold the platform hostage by threatening to withdraw. The platform can switch providers without pilots noticing. That keeps every provider competitive, compliant, and motivated to maintain service quality.</p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="bg-slate-900 text-white">
                <th className="text-left px-4 py-2 font-semibold">Function</th>
                <th className="text-left px-4 py-2 font-semibold">Primary Provider</th>
                <th className="text-left px-4 py-2 font-semibold">Redundant Backup</th>
                <th className="text-left px-4 py-2 font-semibold">Failover Impact</th>
              </tr></thead>
              <tbody>
                {([
                  { fn: 'Data Vault / Custody', primary: 'Persona / Jumio', backup: 'Onfido / Veremark Vault', impact: 'Zero — pilot data stays in backup vault' },
                  { fn: 'Credential Verification', primary: 'Veremark', backup: 'First Advantage / HireRight', impact: 'Zero — token issued by backup verifier' },
                  { fn: 'Payment Processing', primary: 'Stripe', backup: 'PayPal / Braintree', impact: 'Zero — payment rail switches transparently' },
                  { fn: 'Email Delivery', primary: 'Resend', backup: 'SendGrid / Postmark', impact: 'Zero — delivery route switches automatically' },
                  { fn: 'Database Infrastructure', primary: 'Supabase (primary)', backup: 'Supabase failover replica', impact: 'Zero — automatic replica promotion' },
                  { fn: 'Hosting / CDN', primary: 'Vercel', backup: 'Netlify / Cloudflare Pages', impact: 'Minimal — DNS switch within minutes' },
                  { fn: 'Referral Network', primary: 'Flight schools / TRCs', backup: 'Manufacturer + airline referral tier', impact: 'Zero — multiple partner tiers active simultaneously' },
                ] as {fn:string;primary:string;backup:string;impact:string}[]).map((row, i) => (
                  <tr key={row.fn} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="px-4 py-2 border-b border-slate-200 text-slate-800 font-medium">{row.fn}</td>
                    <td className="px-4 py-2 border-b border-slate-200 text-blue-700">{row.primary}</td>
                    <td className="px-4 py-2 border-b border-slate-200 text-yellow-700">{row.backup}</td>
                    <td className="px-4 py-2 border-b border-slate-200 text-emerald-700 font-semibold">{row.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="my-6 px-5 py-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-r-lg">
            <p className="text-sm font-bold text-yellow-700 uppercase tracking-widest mb-1">Commercial Leverage</p>
            <p className="text-slate-700 leading-relaxed">Because the platform can switch any provider without disrupting the pilot experience, <strong>no provider has pricing power over the platform</strong>. Contracts are negotiated from a position of strength. The moment a provider raises rates or degrades service, the redundant alternative is activated. The engine keeps running.</p>
          </div>

          <div className="my-6 px-5 py-4 border-l-4 border-slate-900 bg-slate-900 rounded-r-lg">
            <p className="text-sm font-bold text-white uppercase tracking-widest mb-2">The Legal Position in One Line</p>
            <p className="text-slate-300 leading-relaxed italic">&quot;PilotRecognition is a website domain providing reputable, structured aviation career information across 25+ pillars. All specialist functions — data custody, verification, payment processing, email delivery — are handled by contracted third-party providers. The platform charges pilots $100/year for access to that aggregated intelligence layer. Nothing more.&quot;</p>
          </div>

          <hr className="my-10 border-slate-300" />

          {/* ── FUTURE PROSPECTS (admin only) ── */}
          {isSuperAdmin && (
            <section id="future-prospects" className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-amber-500 rounded-full flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-0.5">Internal Reference — Admin Only</p>
                  <h2 className="text-2xl font-bold text-slate-900">Future Prospects</h2>
                </div>
              </div>
              <p className="text-slate-600 mb-8 max-w-2xl">Strategic partnerships and integrations identified for post-launch expansion. Not current commitments — flagged for commercial evaluation once platform has traction and volume data to negotiate from.</p>

              {/* Flywire */}
              <div id="prospect-flywire" className="mb-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-black text-sm">FW</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">Flywire</h3>
                    <p className="text-sm text-slate-500">Cross-border payment infrastructure — aviation & education sector specialist</p>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">Post-Launch</span>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-2">Why It Fits</p>
                      <ul className="space-y-1.5 text-sm text-slate-700">
                        <li className="flex gap-2"><span className="text-emerald-500">→</span>Aviation & education sector focus — many ATOs already use it</li>
                        <li className="flex gap-2"><span className="text-emerald-500">→</span>Philippines, UAE, APAC coverage matches pilot base</li>
                        <li className="flex gap-2"><span className="text-emerald-500">→</span>Multi-currency + local payment methods (PHP, AED, EUR)</li>
                        <li className="flex gap-2"><span className="text-emerald-500">→</span>Installment / split payment support for $299 Transition Program</li>
                        <li className="flex gap-2"><span className="text-emerald-500">→</span>B2B receivables for $1,000/month airline enterprise fees</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-xs font-bold text-red-700 uppercase tracking-widest mb-2">Tradeoffs</p>
                      <ul className="space-y-1.5 text-sm text-slate-700">
                        <li className="flex gap-2"><span className="text-red-400">→</span>Priced for larger transaction volumes — minimums may not suit pre-launch</li>
                        <li className="flex gap-2"><span className="text-red-400">→</span>Stripe (already integrated) is cheaper for $49–$99 subscriptions</li>
                        <li className="flex gap-2"><span className="text-red-400">→</span>Strength is large one-time cross-border payments, not recurring micro-SaaS</li>
                        <li className="flex gap-2"><span className="text-red-400">→</span>Will ask for projected transaction volume — need ~500+ pilots first</li>
                      </ul>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white">
                          <th className="text-left px-4 py-2 font-semibold">Use Case</th>
                          <th className="text-left px-4 py-2 font-semibold">Current Solution</th>
                          <th className="text-left px-4 py-2 font-semibold">Flywire Advantage</th>
                          <th className="text-left px-4 py-2 font-semibold">Priority</th>
                        </tr>
                      </thead>
                      <tbody>
                        {([
                          { use: '$49 Foundation Program', current: 'Stripe', advantage: 'No improvement needed', priority: 'Keep Stripe' },
                          { use: '$99/year Recognition+', current: 'Stripe', advantage: 'No improvement needed', priority: 'Keep Stripe' },
                          { use: '$299 Transition Program (intl.)', current: 'Stripe', advantage: 'Local currency, installment plans, lower FX loss for pilots', priority: 'High — evaluate post-launch' },
                          { use: '$1,000/month Enterprise (airlines)', current: 'Manual / Stripe invoicing', advantage: 'B2B receivables, structured invoicing, PO support', priority: 'High — evaluate at 10+ operators' },
                          { use: 'Flight school bulk payments', current: 'Manual', advantage: 'Multi-payer bulk collections, institution billing', priority: 'Medium — Q1 2027' },
                        ] as {use:string;current:string;advantage:string;priority:string}[]).map((row, i) => (
                          <tr key={row.use} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="px-4 py-2 border-b border-slate-200 text-slate-800 font-medium">{row.use}</td>
                            <td className="px-4 py-2 border-b border-slate-200 text-slate-600">{row.current}</td>
                            <td className="px-4 py-2 border-b border-slate-200 text-slate-600">{row.advantage}</td>
                            <td className={`px-4 py-2 border-b border-slate-200 text-xs font-semibold ${
                              row.priority.startsWith('High') ? 'text-red-600' :
                              row.priority.startsWith('Medium') ? 'text-yellow-600' :
                              'text-slate-400'
                            }`}>{row.priority}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-slate-900 rounded-lg p-4">
                    <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-2">Recommended Action</p>
                    <p className="text-slate-300 text-sm">Do not replace Stripe pre-launch. Contact Flywire once volume data exists to negotiate from — target <strong className="text-white">500+ registered pilots</strong> and <strong className="text-white">10+ enterprise operators</strong> as the trigger point. Flag specifically for: (1) $299 Transition Program international installments, (2) airline enterprise invoicing at scale.</p>
                    <p className="text-slate-500 text-xs mt-2">Contact: <span className="text-blue-400">flywire.com/contact</span> · Recommended outreach timeline: <strong className="text-slate-300">Q1 2027</strong></p>
                  </div>
                </div>
              </div>
            </section>
          )}

          <hr className="my-10 border-slate-300" />

          <p className="text-xs text-slate-400 text-center">Universal Commercial Framework · PilotRecognition.com · Official Release Document · Version 10.0-Expanded</p>

        </article>
      </div>
    </div>
  );
}
