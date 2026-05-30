import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { CareerPathwaysNavbar } from './layout/CareerPathwaysNavbar';
import { CareerPathwaysLoadingScreen } from './CareerPathwaysLoadingScreen';

// Lazy load page components - using actual platform pathways content as main page
const PathwaysPageModern = lazy(() => import('@/portal/pages/PathwaysPageModern').then(m => ({ default: m.default })));
const ProgramsPage = lazy(() => import('./pages/ProgramsPage').then(m => ({ default: m.ProgramsPage })));
const ProgramDetailPage = lazy(() => import('./pages/ProgramDetailPage').then(m => ({ default: m.ProgramDetailPage })));
const AirlinesPage = lazy(() => import('./pages/AirlinesPage').then(m => ({ default: m.AirlinesPage })));
const GetStartedPage = lazy(() => import('./pages/GetStartedPage').then(m => ({ default: m.GetStartedPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));

const PageLoader = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="animate-pulse text-indigo-400">Loading...</div>
  </div>
);

interface CareerPathwaysAppProps {
  onLogin?: () => void;
}

export const CareerPathwaysApp: React.FC<CareerPathwaysAppProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    // Check auth status
    const checkAuth = async () => {
      // Placeholder - integrate with your actual auth system
      const token = localStorage.getItem('auth_token');
      if (token) {
        setIsLoggedIn(true);
        setUserName(localStorage.getItem('user_name') || 'Pilot');
      }
    };
    checkAuth();
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  if (isLoading) {
    return <CareerPathwaysLoadingScreen onComplete={handleLoadingComplete} minimumDuration={2000} />;
  }

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
            {/* Main pathways explorer - the platform PathwaysPageModern content */}
            <Route 
              path="/" 
              element={<PathwaysPageModern />} 
            />
            <Route 
              path="/pathways" 
              element={<PathwaysPageModern />} 
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
