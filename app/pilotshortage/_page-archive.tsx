'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';

// Stub for AuthContext since this is used outside the main app router structure
const useAuth = () => ({
  user: null,
  isAdmin: false,
});

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
  { id: 'pillar-5-flight-training', label: 'Pillar 5: Flight Training (ATOs) & Hour Issuance', indent: true, group: 'huba' },
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
  { id: 'pillar-15-manufacturers', label: 'Pillar 15: Manufacturers & OEMs (Aircraft Manufacturers)', indent: true, group: 'hube' },
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
  { id: 'pillar-pilot-identity-infrastructure', label: 'Pillar: Shaping Pilot Digital Identity', indent: true, group: 'prospects', adminOnly: true },

];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const navHeight = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

export default function PilotShortagePage() {
  const searchParams = useSearchParams();
  const location = useLocation();
  const pathname = location.pathname;
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    if (!hash) return;
    const id = hash.replace('#', '');
    const attemptScroll = (attemptsLeft: number) => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      } else if (attemptsLeft > 0) {
        setTimeout(() => attemptScroll(attemptsLeft - 1), 100);
      }
    };
    attemptScroll(10);
  }, [searchParams]);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [showAdminOnly, setShowAdminOnly] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navSections
        .filter((s) => s.id)
        .map((s) => s.id);
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredNav = navSections.filter((s) => {
    if (!s.adminOnly) return true;
    return showAdminOnly;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1a', color: '#e2e8f0' }}>
      {/* Desktop Nav */}
      <aside
        style={{
          width: '280px',
          background: '#0f172a',
          borderRight: '1px solid #1e293b',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          overflowY: 'auto',
          padding: '24px 16px',
          display: 'none',
        }}
        className="desktop-nav"
      >
        <div style={{ marginBottom: '24px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#60a5fa', fontWeight: 700, fontSize: '1.1rem' }}>
            ← Back to Site
          </Link>
        </div>

        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Show admin pillars</span>
          <button
            onClick={() => setShowAdminOnly((v) => !v)}
            style={{
              width: '40px',
              height: '20px',
              borderRadius: '10px',
              background: showAdminOnly ? '#3b82f6' : '#334155',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '2px',
                left: showAdminOnly ? '22px' : '2px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.2s',
              }}
            />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {filteredNav.map((s) => {
            const isActive = activeSection === s.id && !s.subheader;
            if (s.subheader) {
              return (
                <div
                  key={`${s.group}-${s.label}`}
                  style={{
                    padding: '8px 0 4px',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#475569',
                    fontWeight: 600,
                    marginTop: '8px',
                    marginLeft: s.indent ? '12px' : '0',
                  }}
                >
                  {s.label}
                </div>
              );
            }
            if (!s.id) return null;
            return (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                style={{
                  textAlign: 'left',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: s.indent ? '0.8rem' : '0.85rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#60a5fa' : s.indent ? '#94a3b8' : '#cbd5e1',
                  background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  marginLeft: s.indent ? '12px' : '0',
                  transition: 'all 0.2s',
                }}
              >
                {s.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Nav Toggle */}
      <button
        onClick={() => setMobileNavOpen((v) => !v)}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 1000,
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '8px',
          padding: '10px 14px',
          color: '#e2e8f0',
          cursor: 'pointer',
          display: 'block',
        }}
        className="mobile-nav-toggle"
      >
        {mobileNavOpen ? '✕ Close' : '☰ Menu'}
      </button>

      {/* Mobile Nav Overlay */}
      {mobileNavOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            zIndex: 999,
            padding: '60px 20px 20px',
            overflowY: 'auto',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileNavOpen(false);
          }}
        >
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px' }}>
              <Link to="/" style={{ textDecoration: 'none', color: '#60a5fa', fontWeight: 600 }}>
                ← Back to Site
              </Link>
            </div>
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Admin pillars</span>
              <button
                onClick={() => setShowAdminOnly((v) => !v)}
                style={{
                  width: '40px',
                  height: '20px',
                  borderRadius: '10px',
                  background: showAdminOnly ? '#3b82f6' : '#334155',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: showAdminOnly ? '22px' : '2px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#fff',
                    transition: 'left 0.2s',
                  }}
                />
              </button>
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {filteredNav.map((s) => {
                if (s.subheader) {
                  return (
                    <div
                      key={`${s.group}-${s.label}`}
                      style={{
                        padding: '8px 0 4px',
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: '#475569',
                        fontWeight: 600,
                        marginTop: '8px',
                        marginLeft: s.indent ? '12px' : '0',
                      }}
                    >
                      {s.label}
                    </div>
                  );
                }
                if (!s.id) return null;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      scrollTo(s.id);
                      setMobileNavOpen(false);
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      fontSize: s.indent ? '0.85rem' : '0.9rem',
                      color: s.indent ? '#94a3b8' : '#e2e8f0',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      marginLeft: s.indent ? '12px' : '0',
                    }}
                  >
                    {s.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          marginLeft: '0',
          padding: '60px 20px 40px',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        {/* Document Header */}
        <section id="document-information" style={{ marginBottom: '48px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              border: '1px solid #334155',
              borderRadius: '12px',
              padding: '32px',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px', letterSpacing: '0.05em' }}>
              UNIVERSAL COMMERCIAL FRAMEWORK v1.0
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '16px', color: '#f8fafc' }}>
              The Pilot Shortage: Infrastructure Analysis
            </h1>
            <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
              A comprehensive examination of the aviation industry's pilot pipeline problem,
              structured across 7 Hubs and 25+ Pillars of the Universal Commercial Framework.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.8rem', color: '#64748b' }}>
              <span>Status: <strong style={{ color: '#22c55e' }}>OFFICIAL RELEASE</strong></span>
              <span>Classification: <strong>Public Document</strong></span>
              <span>Last Updated: <strong>May 2026</strong></span>
            </div>
          </div>
        </section>

        {/* Hub F - Foundation */}
        <section id="pillar-foundation-program" style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', color: '#60a5fa', borderBottom: '2px solid #334155', paddingBottom: '12px' }}>
            Hub F — Foundation & Vision
          </h2>

          <div id="page-1-executive-summary" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
              Executive Summary
            </h3>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8', marginBottom: '16px' }}>
                The aviation industry faces a structural pilot shortage that cannot be solved through traditional
                recruitment methods alone. This document presents the Universal Commercial Framework (UCF),
                a 25-pillar infrastructure designed to bridge the gap between pilot supply and airline demand.
              </p>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                The shortage is not merely a numbers problem—it is an <strong style={{ color: '#e2e8f0' }}>information
                and verification crisis</strong>. Airlines struggle to identify qualified candidates efficiently,
                while pilots lack visibility into pathway requirements and career progression opportunities.
              </p>
            </div>
          </div>

          <div id="the-aviation-industry-operating-system" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
              The Aviation Industry Operating System
            </h3>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8', marginBottom: '16px' }}>
                PilotRecognition.com operates as the middleware layer between fragmented aviation stakeholders.
                Like an operating system, we provide standardized interfaces for:
              </p>
              <ul style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8', paddingLeft: '20px', marginBottom: '16px' }}>
                <li>Pilot credential verification and portability</li>
                <li>Airline pathway requirement matching</li>
                <li>Training organization integration</li>
                <li>Regulatory compliance automation</li>
              </ul>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                This infrastructure enables the industry to scale beyond current manual processes,
                reducing time-to-hire from months to days while improving match quality.
              </p>
            </div>
          </div>

          <div id="origin-story" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
              Origin Story
            </h3>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8', marginBottom: '16px' }}>
                The PilotRecognition platform emerged from direct observation of the four-floor tower problem:
              </p>
              <ol style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8', paddingLeft: '20px', marginBottom: '16px' }}>
                <li><strong>Floor 0:</strong> Graduates with 200 hours, promised airline jobs that never materialize</li>
                <li><strong>Floor 1:</strong> Instructors with 5,000+ hours, stuck waiting for senior pilots to move up</li>
                <li><strong>Floor 2:</strong> The recognition gap—everyone fighting for visibility without standards</li>
                <li><strong>Floor 3:</strong> Senior captains trapped by seniority, unable to transition</li>
              </ol>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                Each floor represents a market failure in information flow. The UCF architecture addresses
                these disconnections through verified credentials, transparent pathways, and portable recognition.
              </p>
            </div>
          </div>

          {/* Foundation Program Cores */}
          <div id="foundation-discipleship" style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px', color: '#60a5fa' }}>
              Core I: Mentorship & Formation
            </h4>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#94a3b8' }}>
              The Foundation Program pairs pilots with industry mentors who provide structured guidance
              through the career pipeline. 50-hour mentorship minimum ensures meaningful relationship formation.
            </p>
          </div>

          <div id="foundation-consultation" style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px', color: '#60a5fa' }}>
              Core II: Consultation & EBT
            </h4>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#94a3b8' }}>
              Evidence-Based Training (EBT) principles applied to career development. Video interviews
              scored on behavioral constructs aligned with airline competency frameworks.
            </p>
          </div>

          <div id="foundation-peer-chain" style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px', color: '#60a5fa' }}>
              Core III: The Peer Chain
            </h4>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#94a3b8' }}>
              Pilots help other pilots. The peer chain creates viral growth while ensuring
              candidates understand the platform from those who have succeeded with it.
            </p>
          </div>

          <div id="foundation-recognition-score" style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px', color: '#60a5fa' }}>
              Core IV: Recognition Score
            </h4>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#94a3b8' }}>
              A standardized metric combining verified hours, credentials, mentorship completion,
              and behavioral assessments. The PR Score becomes portable currency across operators.
            </p>
          </div>

          <div id="foundation-missionary-model" style={{ marginBottom: '32px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px', color: '#60a5fa' }}>
              Core V: The Advocacy Model
            </h4>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#94a3b8' }}>
              Two-tier pricing ensures access regardless of financial means. 10% scholarship allocation
              creates case studies while maintaining platform sustainability.
            </p>
          </div>
        </section>

        {/* Hub D - Infrastructure */}
        <section id="hub-d-infrastructure" style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', color: '#60a5fa', borderBottom: '2px solid #334155', paddingBottom: '12px' }}>
            Hub D — Infrastructure & Data
          </h2>

          <div id="hub-b-verification" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
              Pillar 11: Background Checks & Verification
            </h3>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8', marginBottom: '16px' }}>
                Veremark partnership provides global verification infrastructure. Key capabilities:
              </p>
              <ul style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8', paddingLeft: '20px', marginBottom: '16px' }}>
                <li>CAAP PEL number single-pull (license + medical + ELP)</li>
                <li>Philippines ATO education verification</li>
                <li>Employment history and hours validation</li>
                <li>Real-time webhook status updates</li>
              </ul>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                $99/year verification fee with wallet-based credential storage. Airlines receive
                pre-verified candidate pools, reducing onboarding time by 6+ weeks.
              </p>
            </div>
          </div>

          <div id="pillar-12-flight-data" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
              Pillar 12: Flight Data & Navigation Apps
            </h3>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                Integration with ForeFlight, LogTen Pro, Safelog, and other e-logbook providers.
                Threshold-based certification: 50+ pilots using a provider unlocks API data pull rights
                for verified flight hours.
              </p>
            </div>
          </div>

          <div id="pillar-13-aeromedical" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
              Pillar 13: Aeromedical Examiners
            </h3>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                Direct integration with DMEs for real-time medical certificate status.
                Class 1/2/3 medical tracking with expiration alerts and renewal workflows.
              </p>
            </div>
          </div>

          <div id="pillar-telemetry" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
              Pillar: Telemetry & Simulator Data
            </h3>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                Simulator session data from Flight Safety, CAE, and TRTO partners.
                Skill-based assessments that complement flight hour metrics.
              </p>
            </div>
          </div>

          {showAdminOnly && (
            <>
              <div id="pillar-credential-wallet" style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
                  [Admin] Pillar: Digital Credential Wallet
                </h3>
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
                  <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                    W3C Verifiable Credentials architecture with tiered storage:
                    Tier 1 (HSM enclave), Tier 2 (encrypted IndexedDB), Tier 3 (endpoint registry),
                    Tier 4 (audit logging). ECDSA P-256 non-extractable key generation.
                  </p>
                </div>
              </div>

              <div id="pillar-identity-verification" style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
                  [Admin] Pillar: Identity & Document Verification
                </h3>
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
                  <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                    Multi-factor identity binding: biometric nonce binding, physical presence oracle,
                    and enterprise audit receipts. Attack Vector 23 mitigated through
                    cryptographically secured verification presentations.
                  </p>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Hub A - Aviation Operators */}
        <section id="part-ii-hub-a" style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', color: '#60a5fa', borderBottom: '2px solid #334155', paddingBottom: '12px' }}>
            Hub A — Aviation Operators & Training
          </h2>

          <div id="pillar-5-flight-training" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
              Pillar 5: Flight Training (ATOs) & Hour Issuance
            </h3>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8', marginBottom: '16px' }}>
                ATOs operate as dual-nature nodes in the ecosystem:
              </p>
              <ul style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8', paddingLeft: '20px', marginBottom: '16px' }}>
                <li><strong>As Operators:</strong> Post instructor pathways, pull verified CFIs</li>
                <li><strong>As Validators:</strong> Verify alumni logbooks, earn 5% per verification</li>
              </ul>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                Self-funding subscription model: busy ATOs recoup their $1,000/year enterprise fee
                through verification kickbacks. Philippines training partnerships demonstrate
                geographic arbitrage potential (10,000 AED bulk pricing vs 18,000 AED retail).
              </p>
            </div>
          </div>

          <div id="pillar-6-type-rating" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
              Pillar 6: Type Rating Centers
            </h3>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                TRTO integration for post-CPL career progression. Type rating readiness indicators
                based on flight hours, simulator performance, and airline-specific requirements.
              </p>
            </div>
          </div>

          <div id="pillar-1-commercial-airlines" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
              Pillar 1: Commercial Airlines
            </h3>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8', marginBottom: '16px' }}>
                Enterprise tier ($1,000/month) provides:
              </p>
              <ul style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8', paddingLeft: '20px', marginBottom: '16px' }}>
                <li>Pull API access to verified pilot database</li>
                <li>Advanced filtering (hours, ratings, medical status, location)</li>
                <li>EBT video interview access</li>
                <li>$500 success fee per hire through pathway</li>
              </ul>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                Airlines stop reviewing 500 PDF resumes. They pull from a cleared pool.
              </p>
            </div>
          </div>

          <div id="pillar-2-cargo-freight" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
              Pillar 2: Cargo & Freight
            </h3>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                Freighter-specific pathways with night operation credentials and fatigue management
                training. Different lifestyle profile attracts pilots seeking non-passenger operations.
              </p>
            </div>
          </div>

          <div id="pillar-3-charter-business" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
              Pillar 3: Charter & Business Aviation
            </h3>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                Private aviation pathways emphasizing client service skills alongside technical competency.
                Premium pathway tier ($49 each or $199/year bundle) for specialized access.
              </p>
            </div>
          </div>

          <div id="pillar-4-emerging-sectors" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
              Pillar 4: Emerging Sectors (AAM)
            </h3>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                eVTOL and urban air mobility readiness tracking. Electric aircraft certifications,
                autonomous flight standards, and next-generation pathway preparation.
              </p>
            </div>
          </div>
        </section>

        {/* Hub C - Capital */}
        <section id="hub-c-capital" style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', color: '#60a5fa', borderBottom: '2px solid #334155', paddingBottom: '12px' }}>
            Hub C — Capital, Risk & Compliance
          </h2>

          <div id="pillar-8-banking" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
              Pillar 8: Banking & Financial Institutions
            </h3>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                Pilot-specific lending products secured by verified credential assets.
                Training loans, type rating financing, and career transition credit.
                Creditworthiness based on PR Score and verified employment prospects.
              </p>
            </div>
          </div>

          <div id="pillar-9-insurance" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
              Pillar 9: Aviation Insurance Providers
            </h3>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                Loss-of-license insurance integrated with medical certificate tracking.
                Premium adjustments based on verified training history and behavioral scores.
              </p>
            </div>
          </div>

          <div id="pillar-10-regulatory" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
              Pillar 10: Legal & Regulatory Bodies
            </h3>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                Compliance with CAAP, FAA, EASA regulatory frameworks.
                Automated license validation against authority databases.
                PR-DCA-001 Data Controller Agreement v1.6 Terminal 1 implementation complete.
              </p>
            </div>
          </div>
        </section>

        {/* Hub E - Community */}
        <section id="hub-e-community" style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', color: '#60a5fa', borderBottom: '2px solid #334155', paddingBottom: '12px' }}>
            Hub E — Community, Strategy & Growth
          </h2>

          <div id="pillar-14-mentors" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
              Pillar 14: Pilot Mentors & Unions
            </h3>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                ALPA, union, and association partnerships for trusted mentorship networks.
                Peer validation of platform credibility through industry organization endorsement.
              </p>
            </div>
          </div>

          <div id="pillar-15-manufacturers" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
              Pillar 15: Manufacturers & OEMs
            </h3>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                Airbus, Boeing, Embraer pathway partnerships.
                Manufacturer-specific competency requirements integrated into PR Score.
                Type rating center recommendations based on fleet data.
              </p>
            </div>
          </div>
        </section>

        {/* Hub F/G - Growth & Discovery */}
        <section id="hub-f-growth" style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', color: '#60a5fa', borderBottom: '2px solid #334155', paddingBottom: '12px' }}>
            Hub F — Growth & Expansion
          </h2>

          <div id="pillar-events" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
              Pillar: Aviation Events & Career Fairs
            </h3>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                Dubai Aviation Career Fair and other event integrations.
                QR-code profile sharing for instant verified pilot presentation.
                Live pathway matching at recruitment events.
              </p>
            </div>
          </div>

          <div id="pillar-government" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
              Pillar: Government Aviation Authorities
            </h3>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                CAAP, FAA, EASA authority integration for real-time license status.
                Government promotion loops for regulatory compliance automation.
              </p>
            </div>
          </div>
        </section>

        <section id="hub-g-discovery" style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', color: '#60a5fa', borderBottom: '2px solid #334155', paddingBottom: '12px' }}>
            Hub G — Digital Discovery
          </h2>

          <div id="pillar-25-discovery" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
              Pillar 25: Digital Discovery & Search
            </h3>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8', marginBottom: '16px' }}>
                SEO-optimized pathway discovery for organic pilot acquisition.
                Target keywords: pilot shortage, type rating, cadet program, airline jobs,
                flight instructor jobs, cargo pilot careers.
              </p>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                Domain strategy: pilotrecognition.com as primary recognition platform,
                wallet.pilotrecognition.com for credential verification subdomain isolation.
              </p>
            </div>
          </div>

          <div id="pillar-platform-legal-model" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
              Pillar: Platform Legal Model & Revenue
            </h3>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8', marginBottom: '16px' }}>
                Revenue split on $99 verification check:
              </p>
              <ul style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8', paddingLeft: '20px', marginBottom: '16px' }}>
                <li>Veremark: 23% ($23)</li>
                <li>Logbook Provider: 5% ($5)</li>
                <li>ATO (if Enterprise member): 5% ($5 as Activation Credit)</li>
                <li>Platform: 67% (~$65 after Helio 1% fee)</li>
              </ul>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                Third-party paradise model: all stakeholders earn from verification value chain.
              </p>
            </div>
          </div>
        </section>

        {/* Future Prospects */}
        {showAdminOnly && (
          <section id="future-prospects" style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', color: '#60a5fa', borderBottom: '2px solid #334155', paddingBottom: '12px' }}>
              [Admin] Future Prospects
            </h2>

            <div id="prospect-flywire" style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
                Flywire — Cross-Border Payments
              </h3>
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                  Philippines-to-UAE payment infrastructure for training fees.
                  Multi-currency support for global pilot mobility.
                </p>
              </div>
            </div>

            <div id="pillar-pilot-identity-infrastructure" style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>
                Pillar: Shaping Pilot Digital Identity
              </h3>
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '24px' }}>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
                  W3C DID standards implementation for aviation-specific credentials.
                  Interoperable pilot identity across global operators and regulatory authorities.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid #334155', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Universal Commercial Framework v1.0 — PilotRecognition.com
          </p>
          <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: '8px' }}>
            This document is part of the official UCF release. For questions or corrections,
            contact the Benjamin Bowler (pending Aviation Pathways Ltd) engineering team.
          </p>
        </footer>
      </main>

      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav {
            display: block !important;
          }
          .mobile-nav-toggle {
            display: none !important;
          }
          main {
            margin-left: 280px !important;
            padding: 40px 48px !important;
          }
        }
      `}</style>
    </div>
  );
}
