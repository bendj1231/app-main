// CUTOFF — Supabase no longer supported. Work in progress to migrate to Cloudflare D1 / R2.

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useWorkerAuth } from '../hooks/useWorkerAuth';
import { useUserActivityLog } from '../hooks/useUserActivityLog';
import { PostOAuthWelcomeScreen } from '@/components/website/components/PostOAuthWelcomeScreen';

interface SupabaseUser {
  id: string;
  uid: string; // For backward compatibility
  email: string;
  email_confirmed_at: string | null;
  created_at: string;
  updated_at: string;
  display_name?: string;
  displayName?: string; // For backward compatibility
}

interface UserProfile {
  id?: string;
  uid?: string;
  email?: string;
  full_name?: string;
  display_name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  status?: string;
  auth0_id?: string;
  avatar_url?: string;
  profile_image_url?: string;
  profile_image_public_id?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  nationality?: string;
  current_flight_hours?: number;
  flight_hours?: number;
  total_hours?: number;
  total_flight_hours?: number;
  mentorship_hours?: number;
  foundation_progress?: number;
  overall_recognition_score?: number;
  recognition_score?: number;
  score?: number;
  current_level?: string;
  level?: string;
  current_occupation?: string;
  license_id?: string;
  country_of_license?: string;
  ratings?: string[];
  pilot_id?: string;
  user_id?: string;
  created_at?: string;
  enrolled_programs?: unknown[];
  appAccess?: unknown[];
  displayName?: string;
  avatarUrl?: string;
  is_enrolled_in_foundational?: boolean;
  recognitionTier?: string;
  tier?: string;
  subscription_tier?: string;
  admin_permissions?: Record<string, any>;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: any;
}

interface AuthContextType {
  currentUser: SupabaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signupInProgress: boolean;
  signup: (
    email: string,
    password: string,
    userData: Record<string, string | string[] | undefined>
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  sendOtp: (email: string, redirectTo?: string) => Promise<void>;
  verifyOtp: (email: string, token: string, redirectTo?: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: (userId: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  getAuthHeaders: () => { 'X-CSRF-Token'?: string };
  refreshUserProfile: () => Promise<void>;
  // MFA functions
  mfaEnabled: boolean;
  mfaSetupStep: 'none' | 'qr' | 'verify';
  mfaSetupData: { secret?: string; qrCodeURL?: string };
  mfaSetup: (method?: 'totp' | 'sms', phoneNumber?: string) => Promise<void>;
  mfaVerify: (
    code: string,
    isSetup?: boolean
  ) => Promise<{ success: boolean; backupCodes?: string[] }>;
  mfaDisable: (code: string) => Promise<void>;
  mfaGenerateBackupCodes: () => Promise<string[]>;
  mfaCheckStatus: () => Promise<boolean>;
  // OAuth account check
  oauthAccountCheck: { checking: boolean; hasAccount: boolean | null };
  resetOauthAccountCheck: () => void;
  resetOauthAccountCheckOnly: () => void;
  // Passkey prompt
  showPasskeyPrompt: boolean;
  dismissPasskeyPrompt: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isAuthenticated: auth0IsAuthenticated,
    user: auth0User,
    isLoading: auth0Loading,
    getIdTokenClaims,
    getAccessTokenSilently,
    loginWithRedirect,
    logout: auth0Logout,
  } = useAuth0();
  const { callApi } = useWorkerAuth();
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const currentUserRef = React.useRef<SupabaseUser | null>(null);
  const oauthModalShownRef = React.useRef(false);
  const setCurrentUserWithRef = (user: SupabaseUser | null) => {
    currentUserRef.current = user;
    setCurrentUser(user);
  };
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const setUserProfileData = (data: UserProfile | null) => {
    setUserProfile(data);
  };

  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  // MFA state
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaSetupStep, setMfaSetupStep] = useState<'none' | 'qr' | 'verify'>('none');
  const [mfaSetupData, setMfaSetupData] = useState<{ secret?: string; qrCodeURL?: string }>({});

  // OAuth account check state - NOT persisted to sessionStorage to prevent stuck modal on refresh
  const [oauthAccountCheck, setOauthAccountCheck] = useState<{
    checking: boolean;
    hasAccount: boolean | null;
  }>({ checking: false, hasAccount: null });
  const [showPasskeyPrompt, setShowPasskeyPrompt] = useState(false);
  const [showOAuthWelcome, setShowOAuthWelcome] = useState(false);
  // Track previous auth state to detect genuine login (false → true) vs session restore
  const prevAuth0AuthenticatedRef = React.useRef<boolean | null>(null);

  // Article 5 — Session Isolation: idle timer ref + logout ref for stable closure
  const idleTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutRef = React.useRef<(() => Promise<void>) | null>(null);
  const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

  // Flag to track if we've already shown the modal for this session
  const [oauthModalShown, setOauthModalShown] = useState(() => {
    return localStorage.getItem('oauthModalShown') === 'true';
  });

  // Persist oauthModalShown flag to localStorage and keep ref in sync
  useEffect(() => {
    oauthModalShownRef.current = oauthModalShown;
    if (oauthModalShown) {
      localStorage.setItem('oauthModalShown', 'true');
    }
  }, [oauthModalShown]);

  // Function to reset OAuth account check state
  const resetOauthAccountCheck = () => {
    setOauthAccountCheck({ checking: false, hasAccount: null });
    oauthModalShownRef.current = false;
    setOauthModalShown(false);
    localStorage.removeItem('oauthModalShown');
  };

  // Function to reset account check state only, without removing oauthModalShown flag
  const resetOauthAccountCheckOnly = () => {
    setOauthAccountCheck({ checking: false, hasAccount: null });
    oauthModalShownRef.current = true;
    setOauthModalShown(true);
    localStorage.setItem('oauthModalShown', 'true');
  };

  // If OAuth signed-in user has no linked profile, ensure app redirects to become-member
  // Skip this for admin users (super_admin or admin role)
  useEffect(() => {
    if (oauthAccountCheck.hasAccount === false) {
      const isAdmin = userProfile?.role === 'super_admin' || userProfile?.role === 'admin';
      if (isAdmin) return; // Admins bypass onboarding

      const onboarding = window.location.pathname.startsWith('/become-member');
      if (onboarding) return;
      const target = '/become-member?setup=1';
      if (window.location.pathname !== target) {
        window.location.assign(target);
      }
    }
  }, [oauthAccountCheck.hasAccount, userProfile?.role]);

  // If OAuth signed-in user has a linked profile, show welcome screen then redirect
  // to /platform from common landing pages (handles Supabase redirect URL fallback)
  useEffect(() => {
    if (oauthAccountCheck.hasAccount === true && !oauthAccountCheck.checking) {
      const path = window.location.pathname;
      if (path === '/' || path === '/flight-deck-login') {
        setShowOAuthWelcome(true);
      }
    }
  }, [oauthAccountCheck.hasAccount, oauthAccountCheck.checking]);

  // Article 5 — Keep logoutRef current so idle timer always calls latest logout
  useEffect(() => {
    logoutRef.current = logout;
  });

  // Article 5 — Idle session timeout: auto-logout after 15 min inactivity (shared terminal protection)
  useEffect(() => {
    if (!currentUser) {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      return;
    }

    const resetTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        logoutRef.current?.();
      }, IDLE_TIMEOUT_MS);
    };

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [currentUser, IDLE_TIMEOUT_MS]);

  // Article 5 — Session cleanup on tab close
  useEffect(() => {
    const handleUnload = () => {
      setCurrentUser(null);
      setUserProfile(null);
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  // Sync Auth0 user into currentUser when there is no Supabase session
  useEffect(() => {
    if (auth0Loading) return;
    if (auth0IsAuthenticated && auth0User && !currentUser) {
      const auth0AsSupabaseUser: SupabaseUser = {
        id: auth0User.sub || '',
        uid: auth0User.sub || '',
        email: auth0User.email || '',
        email_confirmed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        display_name: auth0User.name || auth0User.email?.split('@')[0],
        displayName: auth0User.name || auth0User.email?.split('@')[0],
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentUser(auth0AsSupabaseUser);
      setLoading(false);

      // Store auth0 token info in sessionStorage for session restoration
      // sessionStorage is cleared on tab close, reducing XSS persistence vs localStorage
      sessionStorage.setItem('sb-auth-provider', 'auth0');
      sessionStorage.setItem('sb-auth-user-id', auth0User.sub || '');
      sessionStorage.setItem('sb-auth-email', auth0User.email || '');
      sessionStorage.setItem('sb-auth-name', auth0User.name || '');
      sessionStorage.setItem('sb-auth-expiry', (Date.now() + 7 * 24 * 60 * 60 * 1000).toString()); // 7 days

      // Persist auth0 user ID in sessionStorage for MFB logbook sync callback
      // sessionStorage is cleared on tab close, reducing XSS persistence vs localStorage
      if (auth0User.sub) sessionStorage.setItem('auth0_user_id', auth0User.sub);
      // Set fresh login flag so passkey prompt knows this is a real sign-in
      const wasAlreadyAuthenticated = prevAuth0AuthenticatedRef.current === true;
      if (!wasAlreadyAuthenticated && auth0User.sub?.startsWith('google-oauth2|')) {
        sessionStorage.setItem('pr_fresh_login', 'true');
      }
      // Show passkey prompt ONLY after a genuine Google sign-in success
      // Guard 1: prevRef was NOT true (rules out mid-session re-renders)
      // Guard 2: sessionStorage flag set above (rules out page refreshes)
      const freshLogin = sessionStorage.getItem('pr_fresh_login') === 'true';
      const passkeyRegistered = localStorage.getItem('pr_passkey_registered') === 'true';
      const passkeyDeclined = localStorage.getItem('pr_passkey_declined');
      const declinedRecently =
        passkeyDeclined && Date.now() - parseInt(passkeyDeclined) < 30 * 24 * 60 * 60 * 1000;
      const isGoogleLogin = auth0User.sub?.startsWith('google-oauth2|');
      if (
        isGoogleLogin &&
        freshLogin &&
        !passkeyRegistered &&
        !declinedRecently &&
        !wasAlreadyAuthenticated
      ) {
        sessionStorage.removeItem('pr_fresh_login'); // consume flag
        setTimeout(() => setShowPasskeyPrompt(true), 1500);
      }
    }
    // Always update the previous state ref AFTER checks
    prevAuth0AuthenticatedRef.current = auth0IsAuthenticated;
  }, [auth0IsAuthenticated, auth0User, auth0Loading, currentUser]);

  // Activity logging
  const { logLogin, logLogout, logProfileUpdate } = useUserActivityLog();

  // Helper function to get CSRF token from cookies
  const getCsrfTokenFromCookies = (): string | null => {
    const match = document.cookie.match(/csrf-token=([^;]+)/);
    return match ? match[1] : null;
  };

  // Helper function to include CSRF token in requests
  const getAuthHeaders = (isOAuthSession = false) => {
    const token = csrfToken || getCsrfTokenFromCookies();
    const headers: Record<string, string> = token ? { 'X-CSRF-Token': token } : {};
    if (isOAuthSession) {
      headers['X-OAuth-Session'] = 'true';
    }
    return headers;
  };

  // Helper function to check if user explicitly logged out
  const isExplicitLogout = (): boolean => {
    return localStorage.getItem('explicitLogout') === 'true';
  };

  // Helper function to set explicit logout flag in localStorage
  const setExplicitLogoutInStorage = (value: boolean) => {
    if (value) {
      localStorage.setItem('explicitLogout', 'true');
    } else {
      localStorage.removeItem('explicitLogout');
    }
  };

  const [signupInProgress, setSignupInProgress] = useState(false);

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  async function signup(email: string, password: string, userData: any) {
    setSignupInProgress(true);

    try {
      let userId: string;
      const _firebaseUser = null;
      let _userAlreadyExisted = false;

      // Auth0 handles authentication — use Auth0 user ID
      try {
        const token = await getAccessTokenSilently();
        if (!token) {
          await loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } });
          return;
        }
        userId = auth0User?.sub || '';
        if (!userId) {
          throw new Error('Auth0 user ID not available');
        }
      } catch (authErr) {
        console.error('Auth0 auth error:', authErr);
        throw new Error('Authentication failed. Please try again.');
      }

      // Step 2: Create or update portal profile in profiles table
      try {
        // First check if profile already exists
        const existingProfiles = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'profiles',
          operation: 'select',
          where: { id: userId },
          limit: 1,
        });
        const existingProfile = existingProfiles?.[0] || null;

        if (existingProfile) {
          // Profile exists, update
          const rawUpdatePayload = {
            display_name: userData.fullName || email.split('@')[0],
            full_name: userData.fullName,
            phone: userData.contactNumber,
            country: userData.residingCountry,
            date_of_birth: userData.dob || null,
            nationality: userData.nationality,
            updated_at: new Date().toISOString(),
            terms_accepted_at: userData.termsAcceptedAt || new Date().toISOString(),
            pilot_id: userData.pilotId,
            flight_school_address: userData.flightSchoolAddress,
            license_id: userData.licenseId,
            country_of_license: userData.countryOfLicense,
            current_flight_hours: userData.currentFlightHours,
            aircraft_rated_on: userData.aircraftRatedOn,
            experience_description: userData.experienceDescription,
            ratings: userData.ratings,
            program_interests: userData.programInterests,
            pathway_interests: userData.pathwayInterests,
            insight_interests: userData.insightInterests,
            english_proficiency_level: userData.englishProficiencyLevel || null,
            license_expiry: userData.licenseExpiry || null,
            medical_expiry: userData.medicalExpiry || null,
            medical_country: userData.medicalCountry || null,
            medical_class: userData.medicalClass || null,
            radio_license_expiry: userData.radioLicenseExpiry || null,
            last_flown: userData.lastFlown || null,
            professional_experiences: userData.jobExperiences || [],
          };
          await callApi('queryTable', { table: 'profiles', operation: 'update', id: userId, data: rawUpdatePayload });
        } else {
          // Profile doesn't exist, create it
          const _experienceLevel = (() => {
            const hours = parseInt(userData.currentFlightHours || '0', 10);
            if (hours < 500) return 'Low Timer';
            if (hours < 1500) return 'Middle Timer';
            return 'High Timer';
          })();

          // Auto-generate PR pilot ID: PR0003, PR0004, etc.
          let autoPilotId = userData.pilotId || null;
          if (!autoPilotId) {
            try {
              const countResult = await callApi<Record<string, unknown>[]>('queryTable', {
                table: 'profiles',
                operation: 'select',
                columns: 'id',
                limit: 1,
              });
              const nextNum = (countResult?.length ?? 0) + 1;
              autoPilotId = `PR${String(nextNum).padStart(4, '0')}`;
            } catch {
              console.warn('⚠️ Could not generate pilot ID');
            }
          }

          const rawInsertPayload = {
            email: email,
            display_name: userData.fullName || email.split('@')[0],
            full_name: userData.fullName,
            phone: userData.contactNumber,
            country: userData.residingCountry,
            date_of_birth: userData.dob || null,
            nationality: userData.nationality,
            role: 'mentee',
            status: 'active',
            firebase_uid: null,
            enrolled_programs: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            terms_accepted_at: userData.termsAcceptedAt || new Date().toISOString(),
            pilot_id: autoPilotId,
            flight_school_address: userData.flightSchoolAddress,
            license_id: userData.licenseId,
            country_of_license: userData.countryOfLicense,
            current_flight_hours: userData.currentFlightHours,
            aircraft_rated_on: userData.aircraftRatedOn,
            experience_description: userData.experienceDescription,
            ratings: userData.ratings,
            program_interests: userData.programInterests,
            pathway_interests: userData.pathwayInterests,
            insight_interests: userData.insightInterests,
            english_proficiency_level: userData.englishProficiencyLevel || null,
            license_expiry: userData.licenseExpiry || null,
            medical_expiry: userData.medicalExpiry || null,
            medical_country: userData.medicalCountry || null,
            medical_class: userData.medicalClass || null,
            radio_license_expiry: userData.radioLicenseExpiry || null,
            last_flown: userData.lastFlown || null,
            professional_experiences: userData.jobExperiences || [],
          };
          await callApi('queryTable', {
            table: 'profiles',
            operation: 'insert',
            data: { id: userId, ...rawInsertPayload },
          });

          // Provision Pilot Wallet in background (non-blocking)
          try {
            await callApi('provisionWallet', {
              profile_id: userId,
              auth0_id: userData.auth0Id || userId,
              email,
              name: userData.fullName || email.split('@')[0],
            });
          } catch (walletErr) {
            console.warn('⚠️ Wallet provision non-critical error:', walletErr);
          }

          // Store referral lineage on profile (payout happens on Recognition+ subscription, not signup)
          try {
            const refCode =
              typeof document !== 'undefined'
                ? document.cookie
                    .split('; ')
                    .find((r) => r.startsWith('pr_ref='))
                    ?.split('=')[1]
                : null;
            if (refCode) {
              const referrerRows = await callApi<Record<string, unknown>[]>('queryTable', {
                table: 'profiles',
                operation: 'select',
                where: { referral_code: refCode },
                limit: 1,
              });
              const referrer = referrerRows?.[0];
              if (referrer) {
                await callApi('queryTable', {
                  table: 'profiles',
                  operation: 'update',
                  id: userId,
                  data: {
                    referred_by_code: refCode,
                    referred_by_profile_id: (referrer as Record<string, unknown>).id,
                  },
                });
                // Clear cookie after attribution
                document.cookie = 'pr_ref=; path=/; max-age=0';
              }
            }
          } catch (refErr) {
            console.warn('⚠️ Referral lineage tracking failed (non-critical):', refErr);
          }

          // Generate referral code for new pilot (non-blocking)
          try {
            await callApi('generateReferral', { auth0Id: userData.auth0Id || userId, profileId: userId });
          } catch {}
        }
      } catch (profileError) {
        console.error('❌ Failed to create profile:', profileError);
        throw profileError;
      }

      // Step 3: Create app access records (ignore if already exist)
      try {
        const defaultApps = [
          { app_id: 'foundational', granted: true },
          { app_id: 'pilot-profile', granted: true },
          { app_id: 'mentorship', granted: false },
          { app_id: 'atlas-cv', granted: false },
          { app_id: 'w1000', granted: false },
        ];

        const appAccessRecords = defaultApps.map((app) => ({
          user_id: userId,
          app_id: app.app_id,
          granted: app.granted,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

        await callApi('queryTable', {
          table: 'user_app_access',
          operation: 'insert',
          data: appAccessRecords,
        });
      } catch (accessError) {
        console.error('Failed to create app access:', accessError);
        throw accessError;
      }

      // Step 4: Structure the user data
      const structuredData = {
        uid: userId, // Use Supabase ID as primary
        email,
        createdAt: new Date().toISOString(),
        pilotCategory: userData.pilotCategory,
        experienceLevel: (() => {
          const hours = parseInt(userData.currentFlightHours || '0', 10);
          if (hours < 500) return 'Low Timer';
          if (hours < 1500) return 'Middle Timer';
          return 'High Timer';
        })(),

        personalInfo: {
          fullName: userData.fullName,
          dob: userData.dob,
          nationality: userData.nationality,
          residingCountry: userData.residingCountry,
        },

        contactInfo: {
          email: email,
          contactNumber: userData.contactNumber,
          flightSchoolAddress: userData.flightSchoolAddress,
        },

        pilotCredentials: {
          pilotId: userData.pilotId,
          licenseId: userData.licenseId,
          countryOfLicense: userData.countryOfLicense,
          currentFlightHours: userData.currentFlightHours,
          experienceLevel: (() => {
            const hours = parseInt(userData.currentFlightHours || '0', 10);
            if (hours < 500) return 'Low Timer';
            if (hours < 1500) return 'Middle Timer';
            return 'High Timer';
          })(),
          experienceDescription: userData.experienceDescription,
          ratings: userData.ratings,
          aircraftRatedOn: userData.aircraftRatedOn,
        },

        programPreferences: {
          programInterests: userData.programInterests,
          pathwayInterests: userData.pathwayInterests,
        },

        insights: {
          insightInterests: userData.insightInterests,
        },
      };

      // Step 6: Sync to Supabase pilot_licensure_experience table with all gathered information
      try {
        const rawLicensurePayload = {
          pilot_id: userData.pilotId,
          full_legal_name: userData.fullName,
          first_name: userData.fullName?.split(' ')[0] || '',
          last_name: userData.fullName?.split(' ').slice(1).join(' ') || '',
          middle_name: userData.middleName || null,
          date_of_birth: userData.dob || userData.dateOfBirth || null,
          nationality: userData.nationality,
          residing_country: userData.residingCountry,
          flight_school_address: userData.flightSchoolAddress,
          contact_number: userData.contactNumber,
          languages: Array.isArray(userData.languages)
            ? userData.languages
            : userData.languages
              ? [userData.languages]
              : null,
          english_proficiency: userData.englishProficiencyLevel || null,
          license_number: userData.licenseId || userData.licenseNumber || null,
          license_expiry: userData.licenseExpiry || null,
          country_of_license: userData.countryOfLicense,
          current_flight_hours: userData.currentFlightHours,
          aircraft_ratings: userData.aircraftRatedOn
            ? [{ aircraft_type: userData.aircraftRatedOn, rating_date: null, is_current: true }]
            : [],
          experience_description: userData.experienceDescription,
          ratings: Array.isArray(userData.ratings)
            ? userData.ratings
            : userData.ratings
              ? [userData.ratings]
              : [],
          current_license: Array.isArray(userData.ratings)
            ? userData.ratings
            : userData.ratings
              ? [userData.ratings]
              : [],
          medical_expiry: userData.medicalExpiry || null,
          medical_country: userData.medicalCountry || null,
          medical_class: userData.medicalClass || null,
          radio_license_expiry: userData.radioLicenseExpiry || null,
          current_occupation: userData.currentOccupation || null,
          current_employer: userData.currentEmployer || null,
          current_position: userData.currentPosition || null,
          countries_visited: parseInt(userData.countriesVisited || '0', 10) || 0,
          favorite_aircraft: userData.favoriteAircraft || null,
          why_become_pilot: userData.whyBecomePilot || null,
          other_skills: userData.otherSkills || null,
          professional_experiences: Array.isArray(userData.jobExperiences)
            ? userData.jobExperiences
            : userData.jobExperiences
              ? [userData.jobExperiences]
              : [],
          aviation_pathways_interests: Array.isArray(userData.pathwayInterests)
            ? userData.pathwayInterests
            : userData.pathwayInterests
              ? [userData.pathwayInterests]
              : [],
          pilot_job_positions_interests: Array.isArray(userData.insightInterests)
            ? userData.insightInterests
            : userData.insightInterests
              ? [userData.insightInterests]
              : [],
          program_interests: Array.isArray(userData.programInterests)
            ? userData.programInterests
            : userData.programInterests
              ? [userData.programInterests]
              : [],
          insight_interests: Array.isArray(userData.insightInterests)
            ? userData.insightInterests
            : userData.insightInterests
              ? [userData.insightInterests]
              : [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        await callApi('queryTable', {
          table: 'pilot_licensure_experience',
          operation: 'insert',
          data: { user_id: userId, ...rawLicensurePayload },
        });
      } catch (pilotTableError) {
        console.error('Failed to sync to pilot table:', pilotTableError);
        throw pilotTableError;
      }

      // Step 8: Send account creation email via Resend
      try {
        const displayName = userData.fullName || email.split('@')[0];

        await callApi('sendAccountCreatedEmail', { email, name: displayName });
      } catch (emailError) {
        console.error('❌ Error sending account creation email:', emailError);
        // Non-critical: User is still created
      }

      // Step 8: Create readable roster entry for admin view
      if (userData.pilotCategory) {
        try {
          const experienceLevel = structuredData.experienceLevel;
          const shortUid = userId.substring(0, 5);
          const _safeId = `[${experienceLevel}] ${userData.pilotCategory} (${shortUid})`
            .replace(/\//g, '-')
            .replace(/\./g, '_');

          // Note: Roster entry creation removed as it was Firebase-specific
        } catch (error) {
          console.error('Error with roster entry:', error);
          // Non-critical, allows signup to proceed
        }
      }
    } finally {
      setSignupInProgress(false);
    }
  }

  // Shared post-login setup (set user, fetch profile, log activity)
  async function handlePostLogin(user: any, session: any, emailAddress: string) {
    console.log('[AuthContext] handlePostLogin() userId:', user.id);
    setExplicitLogoutInStorage(false);
    await logLogin(user.id);

    const supabaseUser: SupabaseUser = {
      id: user.id,
      uid: user.id,
      email: user.email || '',
      display_name: user.email?.split('@')[0],
      displayName: user.email?.split('@')[0],
      email_confirmed_at: user.email_confirmed_at || new Date().toISOString(),
      created_at: user.created_at || new Date().toISOString(),
      updated_at: user.updated_at || new Date().toISOString(),
    };

    setCurrentUser(supabaseUser);
    window.scrollTo(0, 0);

    try {
      console.log('[AuthContext] Fetching profile via Worker getProfile for auth0_id:', user.id, 'email:', emailAddress);
      const profileData = await callApi<Record<string, unknown>>('getProfile', {
        auth0_id: user.id,
        email: emailAddress,
      });
      console.log('[AuthContext] getProfile result:', { hasData: !!profileData, id: (profileData as any)?.id });

      if (profileData && (profileData as any)?.id) {
        setUserProfileData(profileData as UserProfile);
        console.log('[AuthContext] Profile loaded successfully:', (profileData as any).id);
      } else {
        console.warn('[AuthContext] getProfile returned empty — profile may not exist in D1 yet');
        // Set minimal profile so UI doesn't think user is logged out
        setUserProfile({
          id: user.id,
          user_id: user.id,
          email: emailAddress,
          role: 'pilot',
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        });
      }
    } catch (profileError) {
      console.error('[AuthContext] Error fetching user profile from Worker API:', profileError);
      // Set minimal profile so UI doesn't think user is logged out
      setUserProfile({
        id: user.id,
        user_id: user.id,
        email: emailAddress,
        role: 'pilot',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      });
    }
  }

  async function login(_email: string, _password: string) {
    // Auth0 handles authentication — redirect to Auth0 login
    await loginWithRedirect();
  }

  async function sendOtp(_email: string, redirectTo?: string) {
    // Auth0 handles OTP — redirect to Auth0 login
    await loginWithRedirect({
      appState: redirectTo ? { returnTo: redirectTo } : undefined,
    });
  }

  async function verifyOtp(_email: string, _token: string, redirectTo?: string) {
    // Auth0 handles verification — redirect to Auth0 login
    await loginWithRedirect({
      appState: redirectTo ? { returnTo: redirectTo } : undefined,
    });
  }

  async function logout() {
    // Log logout activity (don't let this block logout)
    if (currentUser) {
      try {
        await logLogout(currentUser.id);
      } catch (error) {
        console.error('Failed to log logout activity:', error);
      }
    }

    setExplicitLogoutInStorage(true); // Set flag to prevent re-authentication
    setCsrfToken(null); // Clear CSRF token
    setCurrentUser(null); // Clear current user
    setUserProfile(null); // Clear user profile
    setOauthAccountCheck({ checking: false, hasAccount: null }); // Clear OAuth account check to prevent redirect effects

    // Clear Auth0 session data from sessionStorage
    sessionStorage.removeItem('sb-auth-provider');
    sessionStorage.removeItem('sb-auth-user-id');
    sessionStorage.removeItem('sb-auth-email');
    sessionStorage.removeItem('sb-auth-name');
    sessionStorage.removeItem('sb-auth-expiry');
    sessionStorage.removeItem('auth0_user_id');

    try {
      await auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    } catch (error) {
      console.error('❌ Auth0 logout error:', error);
    }
  }

  async function resetPassword(_email: string) {
    // Auth0 handles password reset
    await loginWithRedirect({ authorizationParams: { screen_hint: 'reset_password' } });
  }

  // Refresh user profile from Worker API
  async function refreshUserProfile() {
    if (!currentUser) return;
    try {
      const licRows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'pilot_licensure_experience',
        operation: 'select',
        where: { user_id: currentUser.id },
        limit: 1,
      });
      const licData = licRows?.[0];
      if (licData) {
        setUserProfileData(licData as UserProfile);
        logProfileUpdate(currentUser.id, {
          action: 'Profile refreshed after enrollment',
          timestamp: new Date().toISOString(),
        });
        return;
      }
      const profileRows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'profiles',
        operation: 'select',
        where: { id: currentUser.id },
        limit: 1,
      });
      const profileData = profileRows?.[0];
      if (profileData) {
        setUserProfileData(profileData as UserProfile);
        logProfileUpdate(currentUser.id, {
          action: 'Profile refreshed from profiles table',
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('❌ Error refreshing user profile:', error);
    }
  }

  // MFA Setup - Initialize MFA for user
  async function mfaSetup(method: 'totp' | 'sms' = 'totp', phoneNumber?: string) {
    try {
      if (!currentUser) {
        throw new Error('User must be logged in to setup MFA');
      }

      const data = await callApi<Record<string, unknown>>('mfaSetup', { userId: currentUser.uid, method, phoneNumber });

      if (!data?.success) {
        throw new Error((data?.error as string) || 'Failed to setup MFA');
      }

      setMfaSetupData({ secret: data.secret as string, qrCodeURL: data.qrCodeURL as string });
      setMfaSetupStep('qr');
    } catch (error) {
      console.error('MFA setup error:', error);
      throw error;
    }
  }

  // MFA Verify - Verify TOTP code during setup or login
  async function mfaVerify(
    code: string,
    isSetup: boolean = false
  ): Promise<{ success: boolean; backupCodes?: string[] }> {
    try {
      if (!currentUser) {
        throw new Error('User must be logged in to verify MFA');
      }

      const data = await callApi<Record<string, unknown>>('mfaVerify', { userId: currentUser.uid, code, isSetup });

      if (!data?.success) {
        throw new Error((data?.error as string) || 'Failed to verify MFA code');
      }

      if (isSetup) {
        setMfaEnabled(true);
        setMfaSetupStep('none');
        setMfaSetupData({});
        return { success: true, backupCodes: data.backupCodes as string[] };
      }

      return { success: true };
    } catch (error) {
      console.error('MFA verify error:', error);
      throw error;
    }
  }

  // MFA Disable - Disable MFA for user
  async function mfaDisable(code: string) {
    try {
      if (!currentUser) {
        throw new Error('User must be logged in to disable MFA');
      }

      const data = await callApi<Record<string, unknown>>('mfaDisable', { userId: currentUser.uid, code });

      if (!data?.success) {
        throw new Error((data?.error as string) || 'Failed to disable MFA');
      }

      setMfaEnabled(false);
    } catch (error) {
      console.error('MFA disable error:', error);
      throw error;
    }
  }

  // MFA Generate Backup Codes
  async function mfaGenerateBackupCodes(): Promise<string[]> {
    try {
      if (!currentUser) {
        throw new Error('User must be logged in to generate backup codes');
      }

      const data = await callApi<Record<string, unknown>>('mfaBackupCodes', { userId: currentUser.uid, action: 'generate', codeCount: 10 });

      if (!data?.success) {
        throw new Error((data?.error as string) || 'Failed to generate backup codes');
      }

      return data.backupCodes as string[];
    } catch (error) {
      console.error('MFA generate backup codes error:', error);
      throw error;
    }
  }

  // MFA Check Status - Check if MFA is enabled for user
  async function mfaCheckStatus(): Promise<boolean> {
    try {
      if (!currentUser) {
        return false;
      }

      const rows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'mfa_secrets',
        operation: 'select',
        where: { user_id: currentUser.uid },
        limit: 1,
      });
      const data = rows?.[0] || null;

      const enabled = (data?.is_enabled as boolean) || false;
      setMfaEnabled(enabled);
      return enabled;
    } catch (error) {
      console.error('MFA check status error:', error);
      return false;
    }
  }

  async function deleteAccount(userId: string) {
    try {
      await callApi('deleteAccount', { userId });
    } catch (error) {
      console.error('❌ Error deleting account:', error);
      throw error;
    }
  }

  useEffect(() => {
    // Auth0 handles auth state changes — no Supabase listener needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Verify session using Auth0 (bypassing Supabase)
    const verifySession = async () => {
      if (isExplicitLogout()) {
        setCurrentUser(null);
        setUserProfile(null);
        setLoading(false);
        return;
      }
      try {
        const token = await getAccessTokenSilently();
        if (token && auth0User) {
          const verifiedUser: SupabaseUser = {
            id: auth0User.sub || '',
            uid: auth0User.sub || '',
            email: auth0User.email || '',
            display_name: auth0User.name || auth0User.email?.split('@')[0],
            displayName: auth0User.name || auth0User.email?.split('@')[0],
            email_confirmed_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setCurrentUser(verifiedUser);
          window.scrollTo(0, 0);
          try {
            const licRows = await callApi<Record<string, unknown>[]>('queryTable', {
              table: 'pilot_licensure_experience',
              operation: 'select',
              where: { user_id: auth0User.sub },
              limit: 1,
            });
            const licData = licRows?.[0];
            if (licData) {
              setUserProfileData(licData as UserProfile);
            } else {
              setUserProfile(null);
            }
          } catch (err) {
            console.warn('⚠️ Could not load profile for Auth0 session:', err);
            setUserProfile(null);
          }
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
      } catch (_err) {
        setCurrentUser(null);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };
    if (!currentUserRef.current) {
      verifySession();
    } else {
      setLoading(false);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    signupInProgress,
    signup,
    login,
    sendOtp,
    verifyOtp,
    logout,
    deleteAccount,
    resetPassword,
    getAuthHeaders,
    refreshUserProfile,
    // MFA properties
    mfaEnabled,
    mfaSetupStep,
    mfaSetupData,
    mfaSetup,
    mfaVerify,
    mfaDisable,
    mfaGenerateBackupCodes,
    mfaCheckStatus,
    // OAuth account check
    oauthAccountCheck,
    resetOauthAccountCheck,
    resetOauthAccountCheckOnly,
    showPasskeyPrompt,
    dismissPasskeyPrompt: () => setShowPasskeyPrompt(false),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      {showOAuthWelcome && (
        <PostOAuthWelcomeScreen
          userName={currentUser?.display_name || undefined}
          onComplete={() => {
            setShowOAuthWelcome(false);
            navigate('/platform', { replace: true });
          }}
        />
      )}
    </AuthContext.Provider>
  );
};
