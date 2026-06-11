import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { CareerPathwaysNavbar } from './layout/CareerPathwaysNavbar';
import { OAuthCallback } from '@/src/components/OAuthCallback';

// Lazy load page components - using actual platform pathways content as main page
import type { PathwaysPageModernProps } from '../../portal/pages/PathwaysPageModern';
const PathwaysPageModernLazy = lazy(() => import('../../portal/pages/PathwaysPageModern').then(m => ({ default: m.default })));
const PathwaysPageModern = PathwaysPageModernLazy as React.LazyExoticComponent<React.FC<PathwaysPageModernProps>>;
const ProgramsPage = lazy(() => import('./pages/ProgramsPage').then(m => ({ default: m.ProgramsPage })));
const ProgramDetailPage = lazy(() => import('./pages/ProgramDetailPage').then(m => ({ default: m.ProgramDetailPage })));
const AirlinesPage = lazy(() => import('./pages/AirlinesPage').then(m => ({ default: m.AirlinesPage })));
const GetStartedPage = lazy(() => import('./pages/GetStartedPage').then(m => ({ default: m.GetStartedPage })));
const PathwayDashboardPage = lazy(() => import('./pages/PathwayDashboardPage').then(m => ({ default: m.PathwayDashboardPage })));
const EnterpriseDirectoryPage = lazy(() => import('./pages/EnterpriseDirectoryPage').then(m => ({ default: m.EnterpriseDirectoryPage })));
const BecomeMemberPage = lazy(() => import('@/components/website/components/BecomeMemberPage').then(m => ({ default: m.BecomeMemberPage })));
const ProfilePage = lazy(() => import('../../app/profile/page').then(m => ({ default: m.default })));

// Unified platform pages
const PortalAirlineExpectationsPage = lazy(() => import('../../portal/pages/PortalAirlineExpectationsPage').then(m => ({ default: m.PortalAirlineExpectationsPage })));
const TypeRatingSearchPage = lazy(() => import('../../pages/TypeRatingSearchPage').then(m => ({ default: m.default })));
const GlobalAviationAuthoritiesPage = lazy(() => import('../../pages/GlobalAviationAuthoritiesPage').then(m => ({ default: m.default })));

const PageLoader = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="animate-pulse text-indigo-400">Loading...</div>
  </div>
);

// CSS injector that hides unified platform navbars/sidebars when rendered inside career pathways
const useHideUnifiedPlatformNav = () => {
  useEffect(() => {
    // CSS injection
    const style = document.createElement('style');
    style.id = 'career-pathways-unified-hide';
    style.textContent = `
      /* Hide PlatformNavbar — it's a fixed div with height:68px + gradient bg */
      div[style*="height: 68px"][style*="linear-gradient"] {
        display: none !important;
      }
      /* Hide PathwaysSidebar — aggressive targeting */
      div[style*="width: 340px"],
      div[style*="width:340px"],
      div[style*="position: fixed"],
      div[style*="position:fixed"],
      aside,
      [class*="sidebar"],
      [class*="Sidebar"],
      [id*="sidebar"],
      [id*="Sidebar"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        z-index: -999 !important;
      }
      /* Extra catch-all for any element that looks like a sidebar */
      div[style*="left: 0"][style*="top: 0"],
      div[style*="left:0"][style*="top:0"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        z-index: -999 !important;
      }
      /* Remove sidebar margin from main content */
      [style*="margin-left: 280px"],
      [style*="margin-left:280px"] {
        margin-left: 0 !important;
      }
      [style*="margin-left: 340px"],
      [style*="margin-left:340px"] {
        margin-left: 0 !important;
      }
      /* Remove top padding since we have our own navbar */
      [style*="padding-top: 2rem"] {
        padding-top: 0 !important;
      }
    `;
    document.head.appendChild(style);

    // JavaScript-based sidebar removal - more aggressive
    const removeSidebars = () => {
      const all = document.querySelectorAll('div, aside');
      all.forEach(el => {
        const computed = window.getComputedStyle(el);
        const style = (el as HTMLElement).style;
        
        // Remove if it looks like a sidebar
        if (
          computed.position === 'fixed' && 
          (computed.left === '0px' || parseInt(computed.width) >= 280) &&
          (parseInt(computed.width) <= 400)
        ) {
          (el as HTMLElement).style.display = 'none';
          (el as HTMLElement).remove();
        }
        
        // Remove by inline styles
        if (
          style.width?.includes('340px') ||
          style.width?.includes('280px') ||
          (style.position === 'fixed' && style.left === '0')
        ) {
          (el as HTMLElement).style.display = 'none';
          (el as HTMLElement).remove();
        }
      });
    };

    // Run immediately and multiple times to catch late-rendering elements
    removeSidebars();
    setTimeout(removeSidebars, 100);
    setTimeout(removeSidebars, 500);
    setTimeout(removeSidebars, 1000);
    setTimeout(removeSidebars, 2000);

    return () => {
      const existing = document.getElementById('career-pathways-unified-hide');
      if (existing) existing.remove();
    };
  }, []);
};

// Wrapper component that passes embedded=true to hide PlatformNavbar and PathwaysSidebar
const PathwaysPageModernWrapper = () => {
  // PathwaysPageModern now properly handles embedded={true} to hide its own navbar and sidebar
  // No CSS injection or DOM manipulation needed
  return <PathwaysPageModern embedded={true} />;
};

// Wrapper for unified platform pages to hide their navbars/sidebars
const UnifiedPageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useHideUnifiedPlatformNav();
  return <>{children}</>;
};

interface CareerPathwaysAppProps {
  onLogin?: () => void;
}

export const CareerPathwaysApp: React.FC<CareerPathwaysAppProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth0();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [userAvatar, setUserAvatar] = useState<string>('');

  useEffect(() => {
    
    // Use Auth0 state
    if (isAuthenticated && user) {
      setIsLoggedIn(true);
      setUserName(user.name || user.email?.split('@')[0] || 'Pilot');
      setUserAvatar(user.picture || '');
    } else {
      // Fallback to sessionStorage (not localStorage — reduces XSS persistence)
      const token = sessionStorage.getItem('auth_token');
      if (token) {
        setIsLoggedIn(true);
        setUserName(sessionStorage.getItem('user_name') || 'Pilot');
      }
    }
  }, [isAuthenticated, user]);

  const { isLoading: isAuth0Loading } = useAuth0();
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <CareerPathwaysNavbar 
        onLogin={onLogin} 
        isLoggedIn={isLoggedIn}
        userName={userName}
        userAvatar={userAvatar}
      />
      
      <main className="pt-16">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Auth callback routes */}
            <Route path="/callback" element={<OAuthCallback />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />

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
              element={<PathwaysPageModernWrapper />} 
            />
            <Route 
              path="/profile" 
              element={<ProfilePage />} 
            / >
            <Route 
              path="/airlines" 
              element={<AirlinesPage onNavigate={handleNavigate} />} 
            />
            <Route 
              path="/get-started" 
              element={<GetStartedPage />} 
            />
            <Route 
              path="/become-member" 
              element={<BecomeMemberPage onBack={() => navigate('/')} onNavigate={handleNavigate} onLogin={onLogin} />} 
            />
            <Route 
              path="/dashboard" 
              element={
                isAuth0Loading ? (
                  <PageLoader />
                ) : isLoggedIn || isAuthenticated ? (
                  <PathwayDashboardPage 
                    onNavigate={handleNavigate} 
                    pilotId={user?.sub || undefined}
                  />
                ) : (
                  <Navigate to="/get-started" replace />
                )
              } 
            />
            <Route 
              path="/platform" 
              element={<Navigate to="/dashboard" replace />} 
            />
            
            {/* Unified Platform Pages - from pilotrecognition.com */}
            <Route 
              path="/airline-expectations" 
              element={
                <UnifiedPageWrapper>
                  <PortalAirlineExpectationsPage onBack={() => navigate('/')} onNavigate={handleNavigate} />
                </UnifiedPageWrapper>
              } 
            />
            <Route 
              path="/type-ratings" 
              element={
                <UnifiedPageWrapper>
                  <TypeRatingSearchPage onNavigate={handleNavigate} onBack={() => navigate('/')} />
                </UnifiedPageWrapper>
              } 
            />
            <Route 
              path="/authorities" 
              element={
                <UnifiedPageWrapper>
                  <GlobalAviationAuthoritiesPage />
                </UnifiedPageWrapper>
              } 
            />
            <Route 
              path="/enterprise" 
              element={<EnterpriseDirectoryPage onNavigate={handleNavigate} />} 
            />
            
            {/* Redirects from old paths */}
            <Route path="/home" element={<Navigate to="/discover" replace />} />
            
            {/* 404 */}
            <Route 
              path="*" 
              element={
                <div className="min-h-screen flex flex-col items-center justify-center">
                  <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                  <p className="text-slate-400 mb-6">Page not found</p>
                  <button 
                    onClick={() => navigate('/discover')}
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
