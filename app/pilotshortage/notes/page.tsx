'use client';

// ARCHIVED CONTENT FROM ORIGINAL PILOTSHORTAGE.ORG HOMEPAGE
// This page contains the original UCF Framework documentation
// that was previously on the homepage. The homepage is being rebuilt.

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

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

export default function NotesPage() {
  const searchParams = useSearchParams();
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
          <Link to="/pilotshortage" style={{ textDecoration: 'none', color: '#60a5fa', fontWeight: 700, fontSize: '1.1rem' }}>
            ← Back to Home
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
              <Link to="/pilotshortage" style={{ textDecoration: 'none', color: '#60a5fa', fontWeight: 600 }}>
                ← Back to Home
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
                const isActive = activeSection === s.id && !s.subheader;
                if (s.subheader) {
                  return (
                    <div
                      key={`mobile-${s.group}-${s.label}`}
                      style={{
                        padding: '8px 0 4px',
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: '#64748b',
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
                    key={`mobile-${s.id}`}
                    onClick={() => {
                      scrollTo(s.id);
                      setMobileNavOpen(false);
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      fontSize: s.indent ? '0.9rem' : '1rem',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#60a5fa' : s.indent ? '#94a3b8' : '#e2e8f0',
                      background: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
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
          padding: '40px 24px',
          maxWidth: '900px',
        }}
      >
        <div style={{ marginBottom: '40px', borderBottom: '1px solid #1e293b', paddingBottom: '24px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px', color: '#f8fafc' }}>
            UCF Framework Archive
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
            Original homepage content preserved for reference. This documentation details the Universal Commercial Framework (UCF) - the 26 Pillars + 100 Steps that form the foundation of pilotshortage.org
          </p>
          <div style={{ marginTop: '16px' }}>
            <Link 
              to="/pilotshortage" 
              style={{ 
                display: 'inline-block',
                padding: '8px 16px',
                background: '#1e293b',
                color: '#60a5fa',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '0.9rem'
              }}
            >
              ← Return to New Homepage
            </Link>
          </div>
        </div>

        {/* Document Info */}
        <section id="document-information" style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '16px', color: '#f8fafc' }}>
            Document Information
          </h2>
          <div style={{ background: '#0f172a', padding: '20px', borderRadius: '8px', border: '1px solid #1e293b' }}>
            <p style={{ marginBottom: '12px', lineHeight: 1.6 }}><strong>Status:</strong> Living Document — Version 1.0.0</p>
            <p style={{ marginBottom: '12px', lineHeight: 1.6 }}><strong>Authors:</strong> Benjamin Bowler & Contributors</p>
            <p style={{ marginBottom: '12px', lineHeight: 1.6 }}><strong>Last Updated:</strong> January 21, 2026</p>
            <p style={{ lineHeight: 1.6 }}><strong>Abstract:</strong> This document presents a comprehensive 26-pillar industry framework designed to bridge the gap between aviation training and employment. The framework addresses systemic failures in pilot career progression through structured mentorship, verified credentials, and transparent employer-pilot matching.</p>
          </div>
        </section>

        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', borderTop: '1px solid #1e293b', marginTop: '60px' }}>
          <p>Full archived content available in backup file: <code>_page-archive.tsx</code></p>
          <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>
            The complete UCF framework documentation with all 26 pillars has been preserved.
          </p>
        </div>
      </main>
    </div>
  );
}
