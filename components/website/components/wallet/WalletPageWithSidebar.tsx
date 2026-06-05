import React, { useState } from 'react';
import { WalletViewPage } from './WalletViewPage';
import { Shield, CreditCard, FileText, Lock, ChevronRight, Wallet, LayoutGrid, Clock, Key } from 'lucide-react';

type WalletSection = 'overview' | 'credentials' | 'logbook' | 'vault';

interface WalletPageWithSidebarProps {
  userId?: string;
  onNavigate?: (path: string) => void;
  noSidebar?: boolean; // When true, only render content (for use inside profile page)
}

export const WalletPageWithSidebar: React.FC<WalletPageWithSidebarProps> = ({ userId, onNavigate, noSidebar = false }) => {
  const [activeSection, setActiveSection] = useState<WalletSection>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Tab definitions for internal navigation (used when noSidebar=true)
  const tabButtons = (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
      {[
        { id: 'overview', label: 'Overview', icon: LayoutGrid },
        { id: 'credentials', label: 'Credentials', icon: CreditCard },
        { id: 'logbook', label: 'Logbook', icon: Clock },
        { id: 'vault', label: 'Security Vault', icon: Lock },
      ].map((tab) => {
        const Icon = tab.icon;
        const isActive = activeSection === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as WalletSection)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: isActive ? '#3b82f6' : '#e2e8f0',
              background: isActive ? '#3b82f6' : '#ffffff',
              color: isActive ? '#ffffff' : '#475569',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500,
            }}
          >
            <Icon size={16} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid, desc: 'Clearance status & summary' },
    { id: 'credentials', label: 'Credentials', icon: CreditCard, desc: 'Verified credentials (VCs)' },
    { id: 'logbook', label: 'Logbook', icon: Clock, desc: 'Flight hours & telemetry' },
    { id: 'vault', label: 'Security Vault', icon: Lock, desc: 'Encrypted storage & keys' },
  ];

  // When used inside profile page - just render content with tab buttons, no sidebar wrapper
  if (noSidebar) {
    return (
      <>
        <div style={{ padding: '1rem 0' }}>
          {tabButtons}
          <WalletViewPage 
            userId={userId} 
            initialTab={activeSection}
            embedded={true}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
      {/* MSFS 2024 Style Sidebar - Sticky */}
      <aside style={{
        width: sidebarCollapsed ? '80px' : '300px',
        flexShrink: 0,
        padding: '2rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'width 0.3s ease',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {/* Header with chevron like MSFS */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          paddingLeft: '0.25rem',
          paddingRight: '0.25rem',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Wallet size={20} color="#ffffff" />
          </div>
          {!sidebarCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>PIC</p>
              <p style={{ margin: '2px 0 0', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap' }}>Secure Vault</p>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            position: 'absolute',
            right: '-12px',
            top: '2rem',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#3b82f6',
            border: '2px solid #0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <ChevronRight size={14} color="#ffffff" style={{ transform: sidebarCollapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }} />
        </button>

        {/* Navigation Items - MSFS 2024 Rectangular Floating Style */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  const section = item.id as WalletSection;
                  setActiveSection(section);
                }}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: sidebarCollapsed ? 0 : '0.75rem',
                  padding: sidebarCollapsed ? '1rem' : '1rem 1.25rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: isActive
                    ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(29, 78, 216, 0.08) 100%)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  boxShadow: isActive
                    ? '0 4px 15px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                    : '0 2px 8px rgba(0,0,0,0.2)',
                  overflow: 'hidden',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(29, 78, 216, 0.15) 100%)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(29, 78, 216, 0.08) 100%)';
                  }
                }}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon size={20} style={{ flexShrink: 0 }} />
                {!sidebarCollapsed && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px', flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>{item.desc}</span>
                  </div>
                )}
                {!sidebarCollapsed && isActive && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        {!sidebarCollapsed && (
          <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s ease infinite' }} />
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Network Sync: Active</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748b', lineHeight: 1.5 }}>
              Secured by walt.id<br />Zero-knowledge encryption
            </p>
          </div>
        )}
      </aside>

      {/* Main Content Area - Narrower View */}
      <main style={{
        flex: 1,
        maxWidth: '900px',
        margin: '0 auto',
        padding: '1.5rem',
        overflowY: 'auto',
      }}>
        {/* Page Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #e2e8f0',
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
              {sidebarItems.find(i => i.id === activeSection)?.label}
            </h1>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              {sidebarItems.find(i => i.id === activeSection)?.desc}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => onNavigate?.('platform')}
              style={{
                padding: '0.5rem 1rem',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                color: '#475569',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to Platform
            </button>
          </div>
        </div>

        {/* Wallet Content Container */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
        }}>
          {/* Pass the active section to WalletViewPage as initial tab */}
          <WalletViewPage 
            userId={userId} 
            initialTab={activeSection}
            embedded={true}
          />
        </div>
      </main>
    </div>
    </>
  );
};
