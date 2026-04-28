import React, { useState, useEffect, Suspense, useRef, useCallback } from 'react';
// CSS import disabled for integration to prevent MIME type errors
// import './App.css';

// Mentor Management System Imports
import { onAuthStateChange, type AuthState, SUPER_ADMIN_EMAIL, signOut, supabase } from './lib/supabase-auth';
import { PilotProfilePage } from './pages/PilotProfilePage';
import { PilotPortfolioPage } from './pages/PilotPortfolioPage';
import FoundationalProgramPage from './pages/FoundationalProgramPage';
import { PilotRecognitionHome, type MainView } from './pages/PilotRecognitionHome';
import { RecognitionAchievementPage } from './pages/RecognitionAchievementPage';
import { LoginPage } from './pages/LoginPage';
import { GraphicsPresetSelector, type DetectionResult, type GraphicsPreset } from './components/GraphicsPresetSelector';
import { LoadingScreen } from './components/LoadingScreen';
import { PathwaysPageModern } from './pages/PathwaysPageModern';
import PathwayDetailPage from './pages/PathwayDetailPage';

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
    image: '/images/portal-app-1.png',
    onClickAction: undefined // Will be attached dynamically inside App component
  },
  {
    id: 'prog-transition',
    title: 'Transition Program',
    description: 'Bridge the gap to the flight deck. Complete advanced multi-crew simulator scenarios to finalize your industry-ready portfolio. Status: Pending Foundational Verification.',
    icon: 'Book',
    linkText: 'Access Program',
    image: '/images/portal-app-2.png'
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
    image: '/images/Captain-Paperwork-Medium.jpg',
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
import { EnrollmentConfirmationPage } from './pages/EnrollmentConfirmationPage';
import { PostEnrollmentSlideshow } from './pages/PostEnrollmentSlideshow';
import { AIScreeningPage } from './pages/AIScreeningPage';
import { TermsAndConditionsPage } from './pages/TermsAndConditionsPage';
import { MentorshipSupervisionPage } from './pages/MentorshipSupervisionPage';
import PilotGapModulePage from './pages/PilotGapModulePage';
import PilotGapModule2 from './pages/PilotGapModule2';
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
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [canSkipLoading, setCanSkipLoading] = useState(false);
  const [authState, setAuthState] = useState<AuthState & { preloadedData?: { portfolio?: any; achievements?: any; enrollment?: any; pathways?: any; programs?: any } }>({
    user: null,
    userProfile: null,
    loading: true,
    currentSystem: 'pms',
    preloadedData: {}
  });

  // Debug: Log component mount
  useEffect(() => {
    console.log('🚀 [PORTAL MOUNT] Portal component mounted');
    console.log('🔍 [PORTAL MOUNT] Initial state:', {
      currentView,
      directToEnrollment,
      pendingHomeView,
      isDarkMode
    });
    return () => {
      console.log('🔴 [PORTAL UNMOUNT] Portal component unmounted');
    };
  }, []);

  // Debug: Log auth state changes
  useEffect(() => {
    console.log('🔍 [PORTAL DEBUG] Auth state changed:', {
      hasUser: !!authState.user,
      userId: authState.user?.id,
      hasUserProfile: !!authState.userProfile,
      userProfileEmail: authState.userProfile?.email,
      userProfileFirstName: authState.userProfile?.firstName,
      userProfileProfileImage: authState.userProfile?.profile_image_url,
      loading: authState.loading
    });
  }, [authState]);

  const [isInitializing, setIsInitializing] = useState(!directToEnrollment);
  const loadingTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hasShownInitialLoading = useRef(false);
  
  type ViewName =
    | 'login'
    | 'reset-password'
    | 'hub'
    | 'foundational'
    | 'foundational-onboarding'
    | 'terms-conditions'
    | 'enrollment-confirmation'
    | 'post-enrollment-slideshow'
    | 'ai-screening'
    | 'programs'
    | 'pathways-modern'
    | 'pathway-detail'
    | 'privatesector'
    | 'mentorship'
    | 'module-01'
    | 'pilot-portfolio'
    | 'pilot-profile'
    | 'recognition'
    | 'remote-segment'
    | 'job-database'
    | 'become-member'
    | 'examination-portal';

  const VIEW_WHITELIST: ViewName[] = [
    'hub','programs','pathways-modern','foundational','privatesector',
    'foundational-onboarding','enrollment-confirmation','post-enrollment-slideshow','ai-screening','remote-segment','terms-conditions','mentorship',
    'reset-password','module-01','pilot-profile','pilot-portfolio','recognition','job-database','become-member','examination-portal','pathway-detail'
  ];

  const [currentView, setCurrentView] = useState<ViewName>(directToEnrollment ? 'foundational' : 'hub');
  const [initialModuleChapter, setInitialModuleChapter] = useState<number | undefined>(undefined);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [lastLoginEmail, setLastLoginEmail] = useState<string | null>(null);
  const [pendingHomeView, setPendingHomeView] = useState<MainView | null>(directToEnrollment ? null : 'pilot-portfolio');
  const [selectedPathwayId, setSelectedPathwayId] = useState<string | null>(null);

  useEffect(() => {
    const detected = detectGraphicsPreset();
    setGraphicsDetection(detected);

    if (typeof window === 'undefined') return;

    // Clear cache on page reload
    console.log('🧹 [CACHE] Clearing cache on page reload');
    window.localStorage.removeItem('supabase.auth.token');
    window.localStorage.removeItem('supabase.auth.refreshToken');
    window.localStorage.removeItem('supabase.auth.codeVerifier');
    window.localStorage.removeItem('supabase.auth.pkceVerifier');
    window.sessionStorage.clear();

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

  // Prevent automatic scroll to bottom when switching tabs
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleFocus = () => {
      // Scroll to top when window regains focus
      window.scrollTo(0, 0);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Scroll to top when tab becomes visible
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleToggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const handleViewChange = (view: ViewName, initialChapter?: number) => {
    console.log('🔄 [VIEW CHANGE] Requested view:', view);
    console.log('🔍 [VIEW CHANGE] Current view:', currentView);
    console.log('🔍 [VIEW CHANGE] View whitelist:', VIEW_WHITELIST);
    if (VIEW_WHITELIST.includes(view)) {
      console.log('✅ [VIEW CHANGE] View is whitelisted, navigating to:', view);
      setCurrentView(view);
      if (initialChapter !== undefined) {
        setInitialModuleChapter(initialChapter);
      } else {
        setInitialModuleChapter(undefined);
      }
      console.log('🔍 [VIEW CHANGE] View changed from', currentView, 'to', view);
    } else {
      console.log('❌ [VIEW CHANGE] View is NOT whitelisted, blocking navigation to:', view);
    }
  };

  const handleNavigateToMainApp = (page?: string) => {
    if (page && VIEW_WHITELIST.includes(page as ViewName)) {
      handleViewChange(page as ViewName);
    } else if (page) {
      onNavigateToMainApp?.(page);
    } else {
      onNavigateToMainApp?.('home');
    }
  };

  // Debug: Log current view on mount and change
  useEffect(() => {
    console.log('📍 [CURRENT VIEW] App is now rendering view:', currentView);
  }, [currentView]);

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

      // No loading sequence - portal loads directly
      console.log('⏭️ [ROUTING] Portal loads directly without loading sequence');
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
    setLoginBlurred(true);
    setShowLoading(true);
    setLoadingError(null);
    setCanSkipLoading(false);
    hasShownInitialLoading.current = true;

    // Enable skip after 2 seconds minimum
    loadingTimers.current.push(setTimeout(() => {
      setCanSkipLoading(true);
    }, 2000));

    console.log('🎬 Showing dummy loading sequence (always dummy now)');
    
    // Always show dummy loading sequence - no database queries
    loadingTimers.current.push(setTimeout(() => {
      setShowLoading(false);
      clearLoadingSequence();
    }, 3000));
  }, []);

  const handleLogin = (email: string) => {
    setLastLoginEmail(email);
    // Skip loading sequence when directToEnrollment is true
    if (!directToEnrollment) {
      startLoadingSequence('pilot-profile');
    }
  };

  useEffect(() => {
    console.log('🔍 [ROUTING-2] useEffect triggered:', {
      showLoading,
      authStateUser: !!authState.user,
      authStateLoading: authState.loading,
      currentView,
      directToEnrollment,
      onNavigateToMainApp: !!onNavigateToMainApp
    });

    // Don't make routing decisions while auth is still loading
    if (authState.loading) {
      console.log('⏳ [ROUTING-2] Auth still loading, skipping routing decision');
      return;
    }

    if (!showLoading) {
      const timeout = setTimeout(() => setLoginBlurred(false), 500);

      // No authentication checks - portal is accessible without login
      console.log('⏭️ [ROUTING-2] Portal accessible without authentication');

      return () => clearTimeout(timeout);
    }
  }, [showLoading, authState.user, authState.loading, currentView, directToEnrollment, onNavigateToMainApp]);

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

  // Loading sequence removed - no longer needed

  // Ensure showLoading stays false when directToEnrollment is true
  useEffect(() => {
    if (directToEnrollment && showLoading) {
      setShowLoading(false);
      clearLoadingSequence();
    }
  }, [directToEnrollment, showLoading]);

  useEffect(() => {
    console.log('🔍 [ROUTING-3] useEffect triggered:', {
      authStateUser: !!authState.user,
      authStateLoading: authState.loading,
      currentView,
      directToEnrollment,
      onNavigateToMainApp: !!onNavigateToMainApp
    });

    // Don't make routing decisions while auth is still loading
    if (authState.loading) {
      console.log('⏳ [ROUTING-3] Auth still loading, skipping routing decision');
      return;
    }

    // No authentication checks - portal is accessible without login
    console.log('⏭️ [ROUTING-3] Portal accessible without authentication');
  }, [authState.user, authState.loading, currentView, directToEnrollment, onNavigateToMainApp]);

  const handleLogout = async () => {
    try {
      console.log('🔴 [LOGOUT DEBUG] handleLogout called');
      console.log('🔴 [LOGOUT DEBUG] Calling logout function...');
      console.log('🔍 [LOGOUT DEBUG] Current auth state:', {
        hasUser: !!authState.user,
        userId: authState.user?.id,
        hasUserProfile: !!authState.userProfile,
        loading: authState.loading
      });

      // Clear URL hash first
      console.log('🔍 [LOGOUT DEBUG] Clearing URL hash');
      window.location.hash = '';
      console.log('✅ [LOGOUT DEBUG] URL hash cleared');

      // Clear any stored session data
      console.log('🔍 [LOGOUT DEBUG] Clearing localStorage');
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('supabase.auth.refreshToken');
      localStorage.removeItem('supabase.auth.codeVerifier');
      localStorage.removeItem('supabase.auth.pkceVerifier');
      console.log('✅ [LOGOUT DEBUG] localStorage cleared');

      // Clear IndexedDB session from main app
      try {
        console.log('🔍 [LOGOUT DEBUG] Attempting to clear IndexedDB session');
        const db = await (window as any).indexedDB.open('PilotRecognitionAuth', 1);
        const transaction = db.transaction(['authSession'], 'readwrite');
        if (transaction && transaction.objectStore) {
          const store = transaction.objectStore('authSession');
          store.delete('currentSession');
          console.log('✅ [LOGOUT DEBUG] IndexedDB session cleared from portal logout');
        } else {
          console.log('⚠️ [LOGOUT DEBUG] IndexedDB transaction or objectStore not available, skipping');
        }
      } catch (error) {
        console.error('❌ [LOGOUT DEBUG] Error clearing IndexedDB session from portal:', error);
        // Continue with logout even if IndexedDB clearing fails
      }

      console.log('🔴 [LOGOUT DEBUG] Clearing auth state...');
      // Reset auth state
      setAuthState({
        user: null,
        userProfile: null,
        loading: false,
        currentSystem: 'pms',
        preloadedData: {}
      });
      console.log('✅ [LOGOUT DEBUG] Auth state cleared');

      // Navigate back to main app home page immediately
      console.log('🔍 [LOGOUT DEBUG] Navigating to main app, page: home');
      console.log('🔍 [LOGOUT DEBUG] onNavigateToMainApp available:', !!onNavigateToMainApp);
      if (onNavigateToMainApp) {
        console.log('✅ [LOGOUT DEBUG] Calling onNavigateToMainApp with page: home');
        onNavigateToMainApp('home');
      } else {
        console.log('⚠️ [LOGOUT DEBUG] onNavigateToMainApp not available');
      }

      console.log('✅ [LOGOUT DEBUG] Logout successful, navigating to home');

      // Try to sign out from Supabase in background, don't block navigation
      signOut().then(() => {
        console.log('🔴 [LOGOUT DEBUG] Supabase signOut completed');
        supabase.auth.setSession({ access_token: '', refresh_token: '' });
        console.log('✅ [LOGOUT DEBUG] Supabase session cleared');
      }).catch((error: any) => {
        console.error('⚠️ [LOGOUT DEBUG] Supabase logout error (non-blocking):', error.message);
      });
    } catch (error) {
      console.error('❌ [LOGOUT DEBUG] Logout error:', error);
      // Still try to navigate to home even if logout fails
      if (onNavigateToMainApp) {
        console.log('🔍 [LOGOUT DEBUG] Attempting navigation to home after error');
        onNavigateToMainApp('home');
      }
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
      {/* <CloudBackground variant={currentView === 'login' || showLoading || isDarkMode ? 'dark' : 'light'} performancePreset={graphicsPreset} /> */}
      {currentView === 'reset-password' ? (
        <ResetPasswordPage />
      ) : currentView === 'hub' ? (
        <PilotRecognitionHome
          onLogout={handleLogout}
          userProfile={authState.userProfile}
          onStartFoundationalEnrollment={() => setCurrentView('foundational-onboarding')}
          onViewChange={(view, initialChapter) => handleViewChange(view as ViewName, initialChapter)}
          onNavigateToMainApp={handleNavigateToMainApp}
          initialView={pendingHomeView || 'pilot-portfolio'}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />
      ) : currentView === 'foundational' ? (
        <FoundationalProgramPage
          onBack={() => directToEnrollment ? onNavigateToMainApp?.('home') : setCurrentView('hub')}
          onLogout={handleLogout}
          onStartEnrollment={() => setCurrentView('foundational-onboarding')}
          onStartSlideshow={() => setCurrentView('post-enrollment-slideshow')}
          onSelectDownload={() => handleSelectDownload()}
          onLaunchMentorship={() => setCurrentView('mentorship')}
          onLaunchModule01={() => setCurrentView('module-01')}
          completedModules={completedModules}
          directFromHome={directToEnrollment}
          userProfile={authState.userProfile}
        />
      ) : currentView === 'foundational-onboarding' ? (
        <EnrollmentOnboardingPage
          onComplete={() => setCurrentView('enrollment-confirmation')}
          onBackToPrograms={() => directToEnrollment ? onNavigateToMainApp?.('home') : setCurrentView('foundational')}
          onLogout={handleLogout}
          onShowTerms={() => setCurrentView('terms-conditions')}
          onRefreshProfile={refreshUserProfile}
          onNavigateToDashboard={() => setCurrentView('hub')}
        />
      ) : currentView === 'terms-conditions' ? (
        <TermsAndConditionsPage onBack={() => setCurrentView('foundational-onboarding')} onAccept={() => setCurrentView('foundational-onboarding')} />
      ) : currentView === 'enrollment-confirmation' ? (
        <EnrollmentConfirmationPage
          onComplete={() => setCurrentView('post-enrollment-slideshow')}
          userProfile={authState.userProfile}
        />
      ) : currentView === 'post-enrollment-slideshow' ? (
        <PostEnrollmentSlideshow
          onComplete={() => setCurrentView('hub')}
        />
      ) : currentView === 'ai-screening' ? (
        <AIScreeningPage
          onBack={() => setCurrentView('foundational')}
          onLogout={handleLogout}
        />
      ) : currentView === 'programs' ? (
        <PilotRecognitionHome
          onLogout={handleLogout}
          userProfile={authState.userProfile}
          onStartFoundationalEnrollment={() => setCurrentView('foundational-onboarding')}
          onViewChange={(view, initialChapter) => handleViewChange(view as ViewName, initialChapter)}
          onNavigateToMainApp={handleNavigateToMainApp}
          initialView='programs'
          preloadedData={authState.preloadedData}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />
      ) : currentView === 'pathways-modern' ? (
        <PathwaysPageModern
          isDarkMode={isDarkMode}
          onNavigate={(page) => handleViewChange(page as ViewName)}
          onNavigateToPathway={(pathwayId) => {
            setSelectedPathwayId(pathwayId);
            setCurrentView('pathway-detail');
          }}
          onNavigateToMainApp={onNavigateToMainApp}
        />
      ) : currentView === 'pathway-detail' ? (
        <PathwayDetailPage
          pathwayId={selectedPathwayId || ''}
          onBack={() => setCurrentView('pathways-modern')}
        />
      ) : currentView === 'privatesector' ? (
        <PrivateSectorPage onBack={() => setCurrentView('programs')} onLogout={handleLogout} />
      ) : currentView === 'mentorship' ? (
        <PilotGapModule2 onBack={() => setCurrentView('foundational')} />
      ) : currentView === 'module-01' ? (
        <PilotGapModulePage
          onBack={() => setCurrentView('foundational')}
          onComplete={() => handleModuleComplete('stage-1')}
          onNavigateToMentorModules={() => setCurrentView('mentorship')}
          onNavigateToExaminationPortal={() => setCurrentView('examination-portal')}
          initialChapter={initialModuleChapter}
        />
      ) : currentView === 'pilot-portfolio' ? (
        <PilotPortfolioPage
          onBack={() => setCurrentView('hub')}
          userProfile={authState.userProfile}
          preloadedPortfolio={authState.preloadedData?.portfolio}
        />
      ) : currentView === 'pilot-profile' ? (
        <PilotPortfolioPage
          onBack={() => setCurrentView('hub')}
          userProfile={authState.userProfile}
          preloadedPortfolio={authState.preloadedData?.portfolio}
        />
      ) : currentView === 'recognition' ? (
        <RecognitionAchievementPage
          onBack={() => setCurrentView('hub')}
          onViewExams={() => setCurrentView('module-01')}
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
                <img src="/logo.png" alt="PilotRecognition Logo" style={{ maxWidth: '240px' }} />
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
