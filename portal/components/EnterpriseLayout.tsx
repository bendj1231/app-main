import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import styles from './EnterpriseLayout.module.css';

interface EnterpriseLayoutProps {
  children: React.ReactNode;
  userFirstName?: string;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onLogout?: () => void;
  onNavigateToMainApp?: (page?: string) => void;
  onNavigateToModules?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToApplications?: () => void;
  onAccessWebsite?: () => void;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

export const EnterpriseLayout: React.FC<EnterpriseLayoutProps> = ({
  children,
  userFirstName,
  isDarkMode = false,
  onToggleDarkMode,
  onLogout,
  onNavigateToMainApp,
  onNavigateToModules,
  onNavigateToProfile,
  onNavigateToApplications,
  onAccessWebsite,
  sidebarCollapsed = false,
  onSidebarToggle
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSidebarToggle = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else if (onSidebarToggle) {
      onSidebarToggle();
    }
  };

  return (
    <div className={styles.layoutContainer}>
      {/* Sidebar */}
      <div className={`${styles.sidebarWrapper} ${isMobile ? styles.mobileSidebar : ''} ${isMobile && !isSidebarOpen ? styles.sidebarClosed : ''}`}>
        <Sidebar
          mainView="dashboard"
          onLogout={onLogout}
          onNavigate={() => {}}
          onNavigateToMainApp={onNavigateToMainApp}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className={styles.sidebarOverlay}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.mainContentCollapsed : ''}`}>
        {/* Top Bar */}
        <TopBar
          userFirstName={userFirstName || 'Pilot'}
          isDarkMode={isDarkMode}
          onToggleDarkMode={onToggleDarkMode}
          onNavigateToModules={onNavigateToModules}
          onNavigateToProfile={onNavigateToProfile}
          onNavigateToApplications={onNavigateToApplications}
          onAccessWebsite={onAccessWebsite}
          onNavigateToHome={onNavigateToMainApp}
          onLogout={onLogout}
        />

        {/* Page content */}
        <div className={styles.pageContent}>
          {children}
        </div>
      </div>

      {/* Mobile menu toggle button */}
      {isMobile && (
        <button
          className={styles.mobileMenuToggle}
          onClick={handleSidebarToggle}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};
