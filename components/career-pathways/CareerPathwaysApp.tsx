import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { CareerPathwaysNavbar } from './layout/CareerPathwaysNavbar';

// Lazy load page components - using actual platform pathways content as main page
import type { PathwaysPageModernProps } from '../../portal/pages/PathwaysPageModern';
const PathwaysPageModernLazy = lazy(() => import('../../portal/pages/PathwaysPageModern').then(m => ({ default: m.default })));
const PathwaysPageModern = PathwaysPageModernLazy as React.LazyExoticComponent<React.FC<PathwaysPageModernProps>>;
const ProgramsPage = lazy(() => import('./pages/ProgramsPage').then(m => ({ default: m.ProgramsPage })));
const ProgramDetailPage = lazy(() => import('./pages/ProgramDetailPage').then(m => ({ default: m.ProgramDetailPage })));
const AirlinesPage = lazy(() => import('./pages/AirlinesPage').then(m => ({ default: m.AirlinesPage })));
const GetStartedPage = lazy(() => import('./pages/GetStartedPage').then(m => ({ default: m.GetStartedPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));

// Unified platform pages
const PortalAirlineExpectationsPage = lazy(() => import('../../portal/pages/PortalAirlineExpectationsPage').then(m => ({ default: m.PortalAirlineExpectationsPage })));
const TypeRatingSearchPage = lazy(() => import('../../pages/TypeRatingSearchPage').then(m => ({ default: m.default })));
const GlobalAviationAuthoritiesPage = lazy(() => import('../../pages/GlobalAviationAuthoritiesPage').then(m => ({ default: m.default })));

const PageLoader = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="animate-pulse text-indigo-400">Loading...</div>
  </div>
);

// Header component for above the search bar
const CareerPathwaysHeader = () => (
  <div className="text-center py-8">
    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
      pilotcareer<span className="text-red-500">pathways</span>.com
    </h1>
    <p className="text-slate-400 mt-2 text-lg">Your aviation career starts here</p>
  </div>
);

// Wrapper component that passes embedded=true and hides PathwaysSidebar via CSS
const PathwaysPageModernWrapper = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'career-pathways-sidebar-hide';
    style.textContent = `
      /* Hide PathwaysSidebar - left sidebar with 340px width */
      div[style*="width: 340px"],
      div[style*="width:340px"],
      aside,
      [class*="PathwaysSidebar"] {
        display: none !important;
      }
      /* Adjust main content margin and padding */
      main, [style*="margin-left: 340px"] {
        margin-left: 0 !important;
        width: 100vw !important;
        max-width: 100vw !important;
        padding-top: 0 !important;
      }
      /* Reduce top padding on main content wrapper */
      main > div {
        padding-top: 8px !important;
      }
      /* Move search bar up by reducing its margin */
      main [style*="padding-top: 80px"] {
        padding-top: 16px !important;
      }
    `;
    document.head.appendChild(style);

    // Inject header into the main content area
    const injectHeader = () => {
      // Find the main content area
      const mainContent = document.querySelector('main');
      if (!mainContent) return;

      // Check if header already exists
      if (document.getElementById('cpw-header')) return;

      // Create header element with high z-index to appear above shader
      const header = document.createElement('div');
      header.id = 'cpw-header';
      header.style.cssText = 'position: relative; z-index: 100; background: transparent;';
      header.innerHTML = `
        <div style="text-align: center; padding: 48px 0 16px 0; position: relative; z-index: 100;">
          <h1 style="font-size: 2.5rem; font-weight: 700; color: white; letter-spacing: -0.02em; margin: 0; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">
            pilotcareer<span style="color: #ef4444;">pathways</span>.com
          </h1>
          <p style="color: #e2e8f0; margin-top: 8px; font-size: 1.125rem; margin-bottom: 0; font-weight: 500;">
            Your aviation career starts here
          </p>
        </div>
      `;

      // Insert before the first child of main
      if (mainContent.firstChild) {
        mainContent.insertBefore(header, mainContent.firstChild);
      } else {
        mainContent.appendChild(header);
      }
    };

    // Also find and hide any fixed left-sidebars
    const hideSidebars = () => {
      document.querySelectorAll('div').forEach((el) => {
        const computed = window.getComputedStyle(el);
        if (computed.position === 'fixed' && computed.left === '0px') {
          const width = parseInt(computed.width);
          if (width > 250 && width < 400) {
            (el as HTMLElement).style.display = 'none';
          }
        }
      });
      injectHeader();
    };
    hideSidebars();
    setTimeout(hideSidebars, 100);
    setTimeout(hideSidebars, 500);
    setTimeout(hideSidebars, 1000);

    return () => {
      const existing = document.getElementById('career-pathways-sidebar-hide');
      if (existing) existing.remove();
      const header = document.getElementById('cpw-header');
      if (header) header.remove();
    };
  }, []);

  return <PathwaysPageModern embedded={true} />;
};

interface CareerPathwaysAppProps {
  onLogin?: () => void;
}

export const CareerPathwaysApp: React.FC<CareerPathwaysAppProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    console.log('[DEBUG CareerPathwaysApp] Mounted, current path:', window.location.pathname);
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsLoggedIn(true);
      setUserName(localStorage.getItem('user_name') || 'Pilot');
    }
  }, []);

  const handleNavigate = (path: string) => {
    console.log('[DEBUG CareerPathwaysApp] Navigating to:', path);
    navigate(path);
  };

  console.log('[DEBUG CareerPathwaysApp] Rendering, pathname:', window.location.pathname);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <CareerPathwaysNavbar 
        onLogin={onLogin} 
        isLoggedIn={isLoggedIn}
        userName={userName}
      />
      
      <main className="pt-16">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Main pathways explorer - CSS hides PlatformNavbar and sidebar */}
            <Route 
              path="/" 
              element={<PathwaysPageModernWrapper />} 
            />
            <Route 
              path="/pathways" 
              element={<PathwaysPageModernWrapper />} 
            />
            <Route 
              path="/programs" 
              element={<ProgramsPage onNavigate={handleNavigate} />} 
            />
            <Route 
              path="/programs/:programId" 
              element={<ProgramDetailPage onNavigate={handleNavigate} />} 
            />
            <Route 
              path="/discover" 
              element={<PathwaysPageModern />} 
            />
            <Route 
              path="/airlines" 
              element={<AirlinesPage onNavigate={handleNavigate} />} 
            />
            <Route 
              path="/get-started" 
              element={<GetStartedPage onNavigate={handleNavigate} onLogin={onLogin} />} 
            />
            <Route 
              path="/dashboard" 
              element={
                isLoggedIn ? (
                  <DashboardPage onNavigate={handleNavigate} />
                ) : (
                  <Navigate to="/get-started" replace />
                )
              } 
            />
            
            {/* Unified Platform Pages - from pilotrecognition.com */}
            <Route 
              path="/airline-expectations" 
              element={<PortalAirlineExpectationsPage onBack={() => navigate('/')} onNavigate={handleNavigate} />} 
            />
            <Route 
              path="/type-ratings" 
              element={<TypeRatingSearchPage onNavigate={handleNavigate} onBack={() => navigate('/')} />} 
            />
            <Route 
              path="/authorities" 
              element={<GlobalAviationAuthoritiesPage />} 
            />
            
            {/* Redirects from old paths */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            
            {/* 404 */}
            <Route 
              path="*" 
              element={
                <div className="min-h-screen flex flex-col items-center justify-center">
                  <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                  <p className="text-slate-400 mb-6">Page not found</p>
                  <button 
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white transition-colors"
                  >
                    Go Home
                  </button>
                </div>
              } 
            />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default CareerPathwaysApp;
