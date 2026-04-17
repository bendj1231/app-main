import React, { useState, useEffect, Suspense, useRef, useCallback } from 'react';
// CSS import disabled for integration to prevent MIME type errors
// import './App.css';

// Mentor Management System Imports
import { onAuthStateChange, type AuthState, SUPER_ADMIN_EMAIL, signOut, supabase } from './lib/supabase-auth';
import { PilotProfilePage } from './pages/PilotProfilePage';
import { PilotPortfolioPage } from './pages/PilotPortfolioPage';
import FoundationalProgramPage from './pages/FoundationalProgramPage';
import { WingMentorHome, type MainView } from './pages/WingMentorHome';
import { RecognitionAchievementPage } from './pages/RecognitionAchievementPage';
import { LoginPage } from './pages/LoginPage';
import { GraphicsPresetSelector, type DetectionResult, type GraphicsPreset } from './components/GraphicsPresetSelector';
import { LoadingScreen } from './components/LoadingScreen';
import type { LoadingPhase } from './components/LoadingScreen';

// Remote segment disabled for integration
// // Declare the remote module for TypeScript
// // @ts-ignore
// const RemoteSegment = React.lazy(() => import('remote_segment/Segment'));

import { Icons } from './icons';
type CardItem = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Icons;
  desktopOnly?: boolean;
  linkText: string;
  badge?: string;
  image?: string;
  onClickAction?: () => void;
};

const programs: CardItem[] = [
  {
    id: 'prog-1',
    title: 'Foundational Program',
    description: 'Sign up to begin your 50-hour verified mentorship track. Refine your CRM and procedural skills through high-fidelity simulator scenarios. Status: Registration Open.',
    icon: 'Book',
    linkText: 'Access Program',
    image: 'https://lh3.googleusercontent.com/d/1K2CccSObEUsvy6unD8iqWjSjn-Zcw08g',
    onClickAction: undefined // Will be attached dynamically inside App component
  },
  {
    id: 'prog-transition',
    title: 'Transition Program',
    description: 'Bridge the gap to the flight deck. Complete advanced multi-crew simulator scenarios to finalize your industry-ready portfolio. Status: Pending Foundational Verification.',
    icon: 'Book',
    linkText: 'Access Program',
    image: 'https://lh3.googleusercontent.com/d/1wPEIiMRj4fW34_NIQKRnzCf8KNhdD1TC'
  }
];

const accessibleViewMap: Record<string, MainView | 'mentorship'> = {
  foundational: 'foundational',
  'pilot-profile': 'pilot-profile',
  mentorship: 'mentorship',
  'atlas-cv': 'applications',
  w1000: 'applications'
};

const pathways: CardItem[] = [
  {
    id: 'path-1',
    title: 'Emirates ATPL Pathway',
    description: 'A structured roadmap designed to take you from a novice to a certified ATPL pilot.',
    icon: 'Map',
    linkText: 'View Pathway',
    image: 'https://connectedaviationtoday.com/wp-content/uploads/2020/12/shutterstock_1698112222.jpg'
  },
  {
    id: 'path-2',
    title: 'Commercial Pilot License',
    description: 'Accelerated track for aspiring commercial pilots looking to join major airlines.',
    icon: 'Map',
    linkText: 'View Pathway',
    image: 'https://images.unsplash.com/photo-1558509355-6b5d9bcbb4eb?q=80&w=600&auto=format&fit=crop'
  }
];

const applications: CardItem[] = [
  {
    id: 'app-1',
    title: 'Pilot Profile',
    description: 'Access your learning dashboard, track progress, and manage your pilot training journey.',
    icon: 'Monitor',
    linkText: 'Download Module',
    image: 'https://www.flightdeckfriend.com/wp-content/uploads/2019/02/Captain-Paperwork-Medium.jpg',
    badge: 'Dynamic'
  }
];

interface CardProps {
  item: CardItem;
}

const Card: React.FC<CardProps> = ({ item }) => {
  return (
    <div className="horizontal-card" data-desktop-only={item.desktopOnly ? "true" : "false"} style={{ cursor: 'pointer', padding: '1rem 2rem' }} onClick={item.onClickAction || (() => alert(`Opening ${item.title}`))}>
      <div className="horizontal-card-content-wrapper">
        <div style={{ maxWidth: '70%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '1.5rem', color: '#000000', fontWeight: 'bold' }}>•</div>
          <div className="horizontal-card-content" style={{ padding: '2rem 0', textAlign: 'left', maxWidth: '100%' }}>
            <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.title}</h3>

            {item.desktopOnly && (
              <div className="desktop-only-warning" style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem', padding: '0.25rem 0.5rem' }}>
                App not available on mobile
              </div>
            )}

            <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: 0, color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
              {item.description}
            </p>
          </div>
        </div>

        <div className="hub-card-arrow" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Icons.ArrowRight style={{ width: 24, height: 24 }} />
        </div>
      </div>
      {item.image && (
        <img src={item.image} alt={item.title} className="hub-card-bg-image" />
      )}
      {item.badge && (
        <span className={`badge ${item.badge === 'New' ? 'badge-new' : 'badge-pro'}`} style={{ top: '1.5rem', right: '1.5rem' }}>
          {item.badge}
        </span>
      )}
    </div>
  );
};

import { CloudBackground } from './components/CloudBackground';
import { ATPLPathwayPage } from './pages/ATPLPathwayPage';
import { EmergingAirTaxiPage } from './pages/EmergingAirTaxiPage';
import { PrivateSectorPage } from './pages/PrivateSectorPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { EnrollmentOnboardingPage } from './pages/EnrollmentOnboardingPage';
import { PostEnrollmentSlideshow } from './pages/PostEnrollmentSlideshow';
import { AIScreeningPage } from './pages/AIScreeningPage';
import { TermsAndConditionsPage } from './pages/TermsAndConditionsPage';
import { MentorshipSupervisionPage } from './pages/MentorshipSupervisionPage';
import PilotGapModulePage from './pages/PilotGapModulePage';
import PilotGapModule2 from './pages/PilotGapModule2';
import MentorshipProtocolsModulePage from './pages/MentorshipProtocolsModulePage';
import PeerAdvocacyModulePage from './pages/PeerAdvocacyModulePage';
import PilotJobDatabasePage from './pages/PilotJobDatabasePage';

const GRAPHICS_PRESET_STORAGE_KEY = 'wm-graphics-preset';
const GRAPHICS_PRESET_CONFIRMED_STORAGE_KEY = 'wm-graphics-preset-confirmed';
const DARK_MODE_STORAGE_KEY = 'wm-dark-mode';

const detectGraphicsPreset = (): DetectionResult => {
  if (typeof window === 'undefined') {
    return {
      recommendedPreset: 'mid',
      reason: 'Defaulting to a balanced profile until device information is available.',
      deviceLabel: 'Unknown device'
    };
  }

  const nav = window.navigator as Navigator & {
    deviceMemory?: number;
    hardwareConcurrency?: number;
    userAgentData?: { platform?: string };
  };

  const memory = nav.deviceMemory ?? 4;
  const cores = nav.hardwareConcurrency ?? 4;
  const userAgent = nav.userAgent.toLowerCase();
  const platform = (nav.userAgentData?.platform || nav.platform || '').toLowerCase();
  const screenPixels = window.innerWidth * window.innerHeight;

  const isOlderMac = (platform.includes('mac') || userAgent.includes('macintosh')) && cores <= 4;
  if (isOlderMac) {
    return {
      recommendedPreset: 'low',
      reason: 'Detected an older Mac profile, which is best grouped into the low-end optimization tier.',
      deviceLabel: 'Older Mac hardware / integrated graphics profile'
    };
  }

  if (memory <= 4 || cores <= 4 || screenPixels <= 1280 * 720) {
    return {
      recommendedPreset: 'low',
      reason: 'Detected older or lower-powered hardware, so the lightweight profile is the safest choice.',
      deviceLabel: `${memory}GB memory • ${cores} CPU threads`
    };
  }

  if ((platform.includes('mac') || userAgent.includes('macintosh')) && (userAgent.includes('apple silicon') || cores >= 8) && memory >= 8) {
    return {
      recommendedPreset: 'high',
      reason: 'Detected a newer high-performance Mac profile suitable for the highest visual tier.',
      deviceLabel: `${memory}GB memory • ${cores} CPU threads • modern Mac profile`
    };
  }

  if (memory >= 8 && cores >= 8 && screenPixels >= 1920 * 1080) {
    return {
      recommendedPreset: 'high',
      reason: 'Detected newer high-end hardware, so the full visual profile should run smoothly.',
      deviceLabel: `${memory}GB memory • ${cores} CPU threads • large display`
    };
  }

  return {
    recommendedPreset: 'mid',
    reason: 'Detected a balanced 2020-era or mainstream device profile, so mid-range optimization is the best fit.',
    deviceLabel: `${memory}GB memory • ${cores} CPU threads`
  };
};

function App({ onNavigateToMainApp, directToEnrollment = false }: { onNavigateToMainApp?: (page: string) => void; directToEnrollment?: boolean }) {
  const [isMobile, setIsMobile] = useState(false);
  const [showLoading, setShowLoading] = useState(!directToEnrollment);
  const [loginBlurred, setLoginBlurred] = useState(false);
  const [graphicsDetection, setGraphicsDetection] = useState<DetectionResult>(() => detectGraphicsPreset());
  const [graphicsPreset, setGraphicsPreset] = useState<GraphicsPreset>(() => detectGraphicsPreset().recommendedPreset);
  const [hasConfirmedGraphicsPreset, setHasConfirmedGraphicsPreset] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>('fetch');
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [canSkipLoading, setCanSkipLoading] = useState(false);
  const [authState, setAuthState] = useState<AuthState & { preloadedData?: { portfolio?: any; achievements?: any; enrollment?: any; pathways?: any; programs?: any } }>({
    user: null,
    userProfile: null,
    loading: true,
    currentSystem: 'pms',
    preloadedData: {}
  });
  const [isInitializing, setIsInitializing] = useState(!directToEnrollment);
  const loadingTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hasShownInitialLoading = useRef(false);
  
  type ViewName =
    | 'login'
    | 'hub'
    | 'dashboard'
    | 'programs'
    | 'pathways'
    | 'applications'
    | 'foundational'
    | 'atpl'
    | 'airtaxi'
    | 'privatesector'
    | 'foundational-onboarding'
    | 'post-enrollment-slideshow'
    | 'ai-screening'
    | 'remote-segment'
    | 'terms-conditions'
    | 'mentorship'
    | 'reset-password'
    | 'module-01'
    | 'module-02'
    | 'module-03'
    | 'pilot-profile'
    | 'recognition'
    | 'verification'
    | 'job-database'
    | 'become-member';

  const VIEW_WHITELIST: ViewName[] = [
    'login','hub','dashboard','programs','pathways','applications','foundational','atpl','airtaxi','privatesector',
    'foundational-onboarding','post-enrollment-slideshow','ai-screening','remote-segment','terms-conditions','mentorship',
    'reset-password','module-01','module-02','module-03','pilot-profile','recognition','verification','job-database','become-member'
  ];

  const [currentView, setCurrentView] = useState<ViewName>(directToEnrollment ? 'foundational' : 'login');
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [lastLoginEmail, setLastLoginEmail] = useState<string | null>(null);
  const [pendingHomeView, setPendingHomeView] = useState<MainView | null>(null);

  useEffect(() => {
    const detected = detectGraphicsPreset();
    setGraphicsDetection(detected);

    if (typeof window === 'undefined') return;

    const savedPreset = window.localStorage.getItem(GRAPHICS_PRESET_STORAGE_KEY) as GraphicsPreset | null;
    const savedConfirmed = window.localStorage.getItem(GRAPHICS_PRESET_CONFIRMED_STORAGE_KEY) === 'true';
    const savedDarkMode = window.localStorage.getItem(DARK_MODE_STORAGE_KEY) === 'true';

    setGraphicsPreset(savedPreset || detected.recommendedPreset);
    setHasConfirmedGraphicsPreset(savedConfirmed);
    setIsDarkMode(savedDarkMode);
  }, []);

  const handleConfirmGraphicsPreset = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(GRAPHICS_PRESET_STORAGE_KEY, graphicsPreset);
      window.localStorage.setItem(GRAPHICS_PRESET_CONFIRMED_STORAGE_KEY, 'true');
    }
    setHasConfirmedGraphicsPreset(true);
  }, [graphicsPreset]);

  const handleReopenGraphicsPreset = useCallback(() => {
    setHasConfirmedGraphicsPreset(false);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.dataset.performancePreset = graphicsPreset;
    return () => {
      delete document.body.dataset.performancePreset;
    };
  }, [graphicsPreset]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.dataset.theme = isDarkMode ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DARK_MODE_STORAGE_KEY, String(isDarkMode));
    }
    return () => {
      delete document.body.dataset.theme;
    };
  }, [isDarkMode]);

  const handleToggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const handleViewChange = (view: ViewName) => {
    console.log('🔀 View change requested:', view);
    if (!VIEW_WHITELIST.includes(view)) {
      console.warn('⚠️ Attempted to navigate to unknown view:', view);
      return;
    }
    setCurrentView(view);
  };

  const clearLoadingSequence = () => {
    loadingTimers.current.forEach((timerId) => clearTimeout(timerId));
    loadingTimers.current = [];
  };

  const isSuperAdmin = (authState.userProfile?.role === 'super_admin') || (authState.user?.email === SUPER_ADMIN_EMAIL) || (lastLoginEmail === SUPER_ADMIN_EMAIL);

  const handleModuleComplete = (moduleId: string) => {
    setCompletedModules(prev => prev.includes(moduleId) ? prev : [...prev, moduleId]);
  };
  
  const handleSelectDownload = () => {
    setCurrentView('remote-segment');
  };

  const handleSwitchSystem = async (system: 'pms' | 'wms' | 'super_admin') => {
    if (authState.userProfile) {
      setAuthState(prev => ({ ...prev, currentSystem: system }));
      // In production, save this to Firestore
      if (authState.user) {
        // await switchSystem(authState.user.uid, system);
      }
    }
  };

  useEffect(() => {
    if (pendingHomeView && currentView === 'hub') {
      // Clear pending view after hub renders
      const timer = requestAnimationFrame(() => setPendingHomeView(null));
      return () => cancelAnimationFrame(timer);
    }
  }, [pendingHomeView, currentView]);

  // Set isInitializing to false when currentView changes from 'login' to prevent stuck on initializing
  useEffect(() => {
    if (currentView !== 'login' && isInitializing) {
      console.log('🔓 Setting isInitializing to false due to view change');
      setIsInitializing(false);
    }
  }, [currentView, isInitializing]);

  useEffect(() => {
    console.log('🔐 Auth effect starting...');
    
    // Set up auth state listener
    const { data: { subscription } } = onAuthStateChange((nextState) => {
      console.log('🔐 Auth state changed:', { user: !!nextState.user, loading: nextState.loading, hasUserProfile: !!nextState.userProfile });
      setAuthState(nextState);
      if (nextState.user?.email) {
        setLastLoginEmail(nextState.user.email);
      }

      const isResetPasswordPage = window.location.pathname.includes('/reset-password') || 
                                  window.location.hash.includes('type=recovery');

      if (isResetPasswordPage) {
        setCurrentView('reset-password');
        setIsInitializing(false);
        return;
      }

      // Auth check complete
      console.log('✅ Setting isInitializing to false');
      setIsInitializing(false);

      // If user is logged in and loading hasn't started, trigger it
      // Only trigger if current view is 'login' to prevent re-triggering on tab switch
      // Skip loading sequence when directToEnrollment is true
      if (nextState.user && !hasShownInitialLoading.current && !showLoading && currentView === 'login' && !directToEnrollment) {
        console.log('🚀 Starting loading sequence for logged-in user');
        startLoadingSequence('pilot-profile');
      } else if (!nextState.user && !showLoading) {
        // No user, go to login
        console.log('👤 No user, going to login');
        setCurrentView('login');
      }
    });

    // Also check for existing session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 Initial session check:', { hasSession: !!session, email: session?.user?.email });
      // Don't force login view here - let the auth state listener handle it
      // This allows the listener to properly detect existing sessions from the home page
    });

    return () => subscription?.unsubscribe();
  }, []);


  const startLoadingSequence = useCallback(async (pendingView: MainView = 'pilot-profile', userId?: string) => {
    clearLoadingSequence();
    setPendingHomeView(pendingView);
    setLoadingPhase('fetch');
    setLoginBlurred(true);
    setShowLoading(true);
    setLoadingError(null);
    setCanSkipLoading(false);
    hasShownInitialLoading.current = true;

    // Enable skip after 2 seconds minimum
    loadingTimers.current.push(setTimeout(() => {
      setCanSkipLoading(true);
    }, 2000));

    // Use provided userId or fall back to authState
    const effectiveUserId = userId || authState.user?.id;
    if (!effectiveUserId) {
      // No user, just show loading animation then proceed
      loadingTimers.current.push(setTimeout(() => {
        setLoadingPhase('sync');
      }, 1500));

      loadingTimers.current.push(setTimeout(() => {
        setLoadingPhase('deploy');
      }, 3000));

      loadingTimers.current.push(setTimeout(() => {
        setShowLoading(false);
        clearLoadingSequence();
      }, 4200));
      return;
    }

    // Phase 1: Fetch enrollment and program data
    try {
      const { data: enrollmentData } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', effectiveUserId)
        .maybeSingle();
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('enrolled_programs, onboarding_data')
        .eq('id', effectiveUserId)
        .single();

      setAuthState(prev => ({
        ...prev,
        preloadedData: {
          ...prev.preloadedData,
          enrollment: enrollmentData,
          programs: profileData?.enrolled_programs || []
        }
      }));
    } catch (err) {
      console.error('Error fetching enrollment data:', err);
      setLoadingError('Failed to load enrollment data. Please try again.');
    }

    loadingTimers.current.push(setTimeout(() => {
      setLoadingPhase('sync');
    }, 1500));

    // Phase 2: Fetch recognition and achievements data
    loadingTimers.current.push(setTimeout(async () => {
      setLoadingPhase('sync');
      
      try {
        const { data: achievementsData } = await supabase
          .from('achievements')
          .select('*')
          .eq('user_id', effectiveUserId)
          .order('achievement_date', { ascending: false });
        
        setAuthState(prev => ({
          ...prev,
          preloadedData: {
            ...prev.preloadedData,
            achievements: achievementsData || []
          }
        }));
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setLoadingError('Failed to load achievements data. Please try again.');
      }
    }, 1500));

    // Phase 3: Fetch pilot portfolio data
    loadingTimers.current.push(setTimeout(async () => {
      setLoadingPhase('deploy');
      
      try {
        const { data: portfolioData } = await supabase
          .from('pilot_portfolio_data')
          .select('*')
          .eq('user_id', effectiveUserId)
          .maybeSingle();
        
        // Also fetch pathways data
        const { data: pathwaysData } = await supabase
          .from('user_pathways')
          .select('*')
          .eq('user_id', effectiveUserId);

        setAuthState(prev => ({
          ...prev,
          preloadedData: {
            ...prev.preloadedData,
            portfolio: portfolioData,
            pathways: pathwaysData || []
          }
        }));
      } catch (err) {
        console.error('Error fetching portfolio/pathways:', err);
        setLoadingError('Failed to load portfolio data. Please try again.');
      }
    }, 3000));

    loadingTimers.current.push(setTimeout(() => {
      setShowLoading(false);
      clearLoadingSequence();
    }, 4200));
  }, []);

  const handleLogin = (email: string) => {
    setLastLoginEmail(email);
    // Skip loading sequence when directToEnrollment is true
    if (!directToEnrollment) {
      startLoadingSequence('pilot-profile');
    }
  };

  useEffect(() => {
    if (!showLoading) {
      const timeout = setTimeout(() => setLoginBlurred(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [showLoading]);

  useEffect(() => {
    return () => {
      clearLoadingSequence();
    };
  }, []);

  useEffect(() => {
    const grantedApps = authState.userProfile?.appAccess?.filter(app => app.granted).map(app => app.appId) || [];
    const accessibleViews = grantedApps
      .map(appId => accessibleViewMap[appId])
      .filter(Boolean);
    console.log('📍 Active view:', currentView, '| Accessible apps:', grantedApps, '| Accessible views:', accessibleViews);
  }, [currentView, authState.userProfile]);

  useEffect(() => {
    if (authState.user && !hasShownInitialLoading.current && !showLoading && !directToEnrollment) {
      startLoadingSequence('pilot-profile');
    }
  }, [authState.user, showLoading, startLoadingSequence, directToEnrollment]);

  // Ensure showLoading stays false when directToEnrollment is true
  useEffect(() => {
    if (directToEnrollment && showLoading) {
      setShowLoading(false);
      clearLoadingSequence();
    }
  }, [directToEnrollment, showLoading]);

  useEffect(() => {
    if (!showLoading && authState.user && currentView === 'login') {
      setCurrentView('hub');
    }
  }, [showLoading, authState.user, currentView]);

  const handleLogout = async () => {
    try {
      // First sign out from Supabase
      await signOut();
      
      // Clear any stored session data
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('supabase.auth.refreshToken');
      
      // Clear IndexedDB session from main app
      try {
        const db = await (window as any).indexedDB.open('PilotRecognitionAuth', 1);
        const transaction = db.transaction(['authSession'], 'readwrite');
        const store = transaction.objectStore('authSession');
        store.delete('currentSession');
        console.log('✅ IndexedDB session cleared from portal logout');
      } catch (error) {
        console.error('❌ Error clearing IndexedDB session from portal:', error);
      }
      
      // Reset auth state
      setAuthState({
        user: null,
        userProfile: null,
        loading: false,
        currentSystem: 'pms',
        preloadedData: {}
      });
      
      // Reset view state
      setCurrentView('login');
      setLoginBlurred(false);
      setShowLoading(false);
      hasShownInitialLoading.current = false;
      
      // Clear URL hash
      window.location.hash = '';
      
      // Small delay to ensure state updates before any potential reload
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const refreshUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        console.log('📊 Profile data from Supabase:', profile);
        console.log('📋 enrolled_programs from profile:', profile.enrolled_programs);
        setAuthState(prev => ({
          ...prev,
          userProfile: profile
        }));
        console.log('✅ Profile refreshed successfully');
      } else {
        console.warn('⚠️ No profile data returned from Supabase');
      }
    } catch (error) {
      console.error('❌ Error refreshing profile:', error);
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle URL routing for password reset
  useEffect(() => {
    const handleRecoveryRouting = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;

      // Only route to reset-password if we have actual recovery params
      if ((pathname.includes('/reset-password') || hash.includes('type=recovery')) && 
          (hash.includes('access_token') || hash.includes('refresh_token'))) {
        setCurrentView('reset-password');
      }
    };

    // Check on initial load
    handleRecoveryRouting();

    const handleHashChange = () => handleRecoveryRouting();
    const handlePopState = () => handleRecoveryRouting();

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Hydrate onClickActions
  programs[0].onClickAction = () => {
    console.log('🧭 Programs directory -> Foundational clicked');
    setCurrentView('foundational');
  };
  applications[0].onClickAction = () => setCurrentView('pilot-profile');

  if (pathways.length >= 3) {
    pathways[0].onClickAction = () => setCurrentView('atpl');
    pathways[1].onClickAction = () => setCurrentView('airtaxi');
    pathways[2].onClickAction = () => setCurrentView('privatesector');
  }

  return (
    <>
      {/* <CloudBackground variant={currentView === 'login' || showLoading || isInitializing || isDarkMode ? 'dark' : 'light'} performancePreset={graphicsPreset} /> */}
      {isInitializing && !directToEnrollment ? (
        <div style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            textAlign: 'center',
            color: '#fff',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            <img src="/logo.png" alt="WingMentor" style={{ width: '320px', marginBottom: '2rem' }} />
            <div style={{ fontSize: '1.5rem', fontWeight: 500, letterSpacing: '0.15em' }}>INITIALIZING...</div>
          </div>
        </div>
      ) : showLoading && !directToEnrollment ? (
        <LoadingScreen
          phase={loadingPhase}
          error={loadingError}
          onRetry={() => {
            setLoadingError(null);
            // Restart loading sequence
            setShowLoading(true);
            setLoadingPhase('fetch');
            setCanSkipLoading(false);
            // Trigger data reload
            if (authState.user?.id) {
              startLoadingSequence(authState.user.id);
            }
          }}
          onSkip={() => {
            setShowLoading(false);
            clearLoadingSequence();
          }}
          canSkip={canSkipLoading}
        />
      ) : currentView === 'login' && !hasConfirmedGraphicsPreset ? (
        <GraphicsPresetSelector
          detection={graphicsDetection}
          selectedPreset={graphicsPreset}
          onSelect={setGraphicsPreset}
          onConfirm={handleConfirmGraphicsPreset}
        />
      ) : currentView === 'login' ? (
        <LoginPage onLogin={handleLogin} onNavigate={setCurrentView} onNavigateToMainApp={onNavigateToMainApp} blurred={loginBlurred} onChangeOptimization={handleReopenGraphicsPreset} />
      ) : currentView === 'reset-password' ? (
        <ResetPasswordPage />
      ) : currentView === 'hub' ? (
        <WingMentorHome
          onLogout={handleLogout}
          userProfile={authState.userProfile}
          onStartFoundationalEnrollment={() => setCurrentView('foundational-onboarding')}
          onViewChange={(view) => handleViewChange(view as ViewName)}
          onNavigateToMainApp={onNavigateToMainApp}
          initialView={pendingHomeView || 'pilot-portfolio'}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />
      ) : currentView === 'foundational' ? (
        <FoundationalProgramPage
          onBack={() => setCurrentView('hub')}
          onLogout={handleLogout}
          onStartEnrollment={() => setCurrentView('foundational-onboarding')}
          onStartSlideshow={() => setCurrentView('post-enrollment-slideshow')}
          onSelectDownload={() => handleSelectDownload()}
          onLaunchMentorship={() => setCurrentView('mentorship')}
          onLaunchModule01={() => setCurrentView('module-01')}
          onLaunchModule02={() => setCurrentView('module-02')}
          onLaunchModule03={() => setCurrentView('module-03')}
          completedModules={completedModules}
          directFromHome={directToEnrollment}
          userProfile={authState.userProfile}
        />
      ) : currentView === 'foundational-onboarding' ? (
        <EnrollmentOnboardingPage
          onComplete={() => setCurrentView('post-enrollment-slideshow')}
          onBackToPrograms={() => setCurrentView('foundational')}
          onLogout={handleLogout}
          onShowTerms={() => setCurrentView('terms-conditions')}
          onRefreshProfile={refreshUserProfile}
          onNavigateToDashboard={() => setCurrentView('hub')}
        />
      ) : currentView === 'terms-conditions' ? (
        <TermsAndConditionsPage onBack={() => setCurrentView('foundational-onboarding')} onAccept={() => setCurrentView('foundational-onboarding')} />
      ) : currentView === 'post-enrollment-slideshow' ? (
        <PostEnrollmentSlideshow
          onComplete={() => setCurrentView('foundational')}
        />
      ) : currentView === 'ai-screening' ? (
        <AIScreeningPage
          onBack={() => setCurrentView('foundational')}
          onLogout={handleLogout}
        />
      ) : currentView === 'pathways' || currentView === 'programs' ? (
        <WingMentorHome
          onLogout={handleLogout}
          userProfile={authState.userProfile}
          onStartFoundationalEnrollment={() => setCurrentView('foundational-onboarding')}
          onViewChange={(view) => handleViewChange(view as ViewName)}
          onNavigateToMainApp={onNavigateToMainApp}
          initialView={currentView === 'pathways' ? 'pathways' : 'programs'}
          preloadedData={authState.preloadedData}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />
      ) : currentView === 'privatesector' ? (
        <PrivateSectorPage onBack={() => setCurrentView('pathways')} onLogout={handleLogout} />
      ) : currentView === 'mentorship' ? (
        <PilotGapModule2 onBack={() => setCurrentView('foundational')} />
      ) : currentView === 'module-01' ? (
        <PilotGapModulePage
          onBack={() => setCurrentView('foundational')}
          onComplete={() => handleModuleComplete('stage-1')}
          onNavigateToMentorModules={() => setCurrentView('mentorship')}
        />
      ) : currentView === 'module-02' ? (
        <MentorshipProtocolsModulePage onBack={() => setCurrentView('foundational')} onLogout={handleLogout} />
      ) : currentView === 'module-03' ? (
        <PeerAdvocacyModulePage onBack={() => setCurrentView('foundational')} onLogout={handleLogout} />
      ) : currentView === 'pilot-profile' ? (
        <PilotPortfolioPage
          onBack={() => setCurrentView('hub')}
          userProfile={authState.userProfile}
          preloadedPortfolio={authState.preloadedData?.portfolio}
        />
      ) : currentView === 'recognition' ? (
        <RecognitionAchievementPage
          onBack={() => setCurrentView('hub')}
          onViewExams={() => setCurrentView('module-02')}
          onViewAtlas={() => setCurrentView('applications')}
          userProfile={authState.userProfile}
          preloadedAchievements={authState.preloadedData?.achievements}
          preloadedPortfolio={authState.preloadedData?.portfolio}
        />
      ) : currentView === 'remote-segment' ? (
        <div className="dashboard-container animate-fade-in">
          <main className="dashboard-card" style={{ position: 'relative' }}>
            <button className="platform-logout-btn" onClick={handleLogout}>
              <Icons.LogOut style={{ width: 16, height: 16 }} />
              Logout
            </button>
            <div className="dashboard-header" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '0', left: '0' }}>
                <button
                  className="back-btn"
                  onClick={() => setCurrentView('hub')}
                  style={{
                    padding: '0.5rem 0',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#475569',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#0f172a';
                    e.currentTarget.style.transform = 'translateX(-4px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = '#475569';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <Icons.ArrowLeft style={{ width: 16, height: 16 }} /> Back to Hub
                </button>
              </div>
              <div className="dashboard-logo" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '240px' }} />
              </div>
              <div className="dashboard-subtitle">DYNAMIC ASSET LOADING</div>
              <h1 className="dashboard-title">Remote Applications</h1>
            </div>

            <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Remote segment disabled for integration */}
              {/* <Suspense fallback={
                <div style={{ textAlign: 'center' }}>
                  <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
                  <p style={{ color: '#64748b' }}>Fetching remote segment from internal server...</p>
                </div>
              }>
                <RemoteSegment />
              </Suspense> */}
              <div style={{ textAlign: 'center', color: '#64748b' }}>
                <p>Remote segment disabled for integration</p>
              </div>
            </div>
          </main>
        </div>
      ) : currentView === 'job-database' ? (
        <PilotJobDatabasePage onBack={() => setCurrentView('hub')} onLogout={handleLogout} userProfile={authState.userProfile} />
      ) : (
        <></>
      )}
    </>
  );
}

export default App;
