import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { supabase } from '../lib/supabase';
// import { indexedDB } from '../lib/indexedDB';
// import { createManagementAPI } from '../lib/supabase-management';
import { useUserActivityLog } from '../hooks/useUserActivityLog';
import { PostOAuthWelcomeScreen } from '@/components/website/components/PostOAuthWelcomeScreen';
import {
  getVaultKey,
  getVaultKeyFromAuth0Token,
  clearVaultKey,
  encryptFields,
  decryptFields,
  PROFILE_SENSITIVE_FIELDS,
  PILOT_LICENSURE_SENSITIVE_FIELDS,
} from '../../lib/vault';

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
  verifyOtp: (email: string, token: string) => Promise<void>;
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
  const isEnterprise =
    location.pathname.startsWith('/enterprise') || window.location.hostname.includes('enterprise');
  const auth0Context = useAuth0();
  const {
    isAuthenticated: auth0IsAuthenticated,
    user: auth0User,
    isLoading: auth0Loading,
    getIdTokenClaims,
  } = isEnterprise
    ? auth0Context
    : { isAuthenticated: false, user: null, isLoading: false, getIdTokenClaims: () => null };
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const currentUserRef = React.useRef<SupabaseUser | null>(null);
  const oauthModalShownRef = React.useRef(false);
  const setCurrentUserWithRef = (user: SupabaseUser | null) => {
    currentUserRef.current = user;
    setCurrentUser(user);
  };
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const decryptAndSetUserProfile = async (data: UserProfile | null, auth0Sub?: string) => {
    if (!data) {
      setUserProfile(null);
      return;
    }
    try {
      const sub = auth0Sub || auth0User?.sub;
      if (sub) {
        // Prefer Auth0 ID token path — matches how data was encrypted
        try {
          const claims = await getIdTokenClaims?.();
          const idToken = claims?.__raw;
          if (idToken) {
            const key = await getVaultKeyFromAuth0Token(sub, idToken);
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const decrypted = await decryptFields(data, PROFILE_SENSITIVE_FIELDS as any, key);
            setUserProfile(decrypted);
            return;
          }
        } catch (err: unknown) {
          console.warn(
            '[AuthContext] Auth0 ID token vault decryption failed:',
            err instanceof Error ? err.message : err
          );
        }
        // Fallback: server-pepper path
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.access_token) {
          const key = await getVaultKey(sub, session.access_token);
          const decrypted = await decryptFields(
            data,
            PROFILE_SENSITIVE_FIELDS as unknown as string[],
            key
          );
          setUserProfile(decrypted);
          return;
        }
      }
    } catch (err: unknown) {
      console.warn(
        '[AuthContext] Profile decryption failed:',
        err instanceof Error ? err.message : err
      );
    }
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
        clearVaultKey();
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

  // Article 5 — Flush vault key on tab close / navigate away (shared airport terminal protection)
  useEffect(() => {
    const handleUnload = () => clearVaultKey();
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
      // Initialise vault key then background re-encrypt any plaintext legacy records
      if (auth0User.sub) {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
          if (!session?.access_token) return;
          try {
            const key = await getVaultKey(auth0User.sub!, session.access_token);

            const userId = session.user?.id || auth0User.sub!;
            const VAULT_PREFIX = '{"iv":"';
            const isPlain = (v: unknown) =>
              v !== null &&
              v !== undefined &&
              v !== '' &&
              !(typeof v === 'string' && v.startsWith(VAULT_PREFIX));
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const needsReEncrypt = (rec: Record<string, any>, fields: readonly string[]) =>
              fields.some((f) => isPlain(rec[f]));

            // Re-encrypt profiles table if any sensitive field is plaintext
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .maybeSingle();
            if (profile && needsReEncrypt(profile, PROFILE_SENSITIVE_FIELDS)) {
              /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
              const enc = await encryptFields(profile, PROFILE_SENSITIVE_FIELDS as any, key);
              await supabase.from('profiles').update(enc).eq('id', userId);
            }

            // Re-encrypt pilot_licensure_experience if any sensitive field is plaintext
            const { data: lic } = await supabase
              .from('pilot_licensure_experience')
              .select('*')
              .eq('user_id', userId)
              .maybeSingle();
            if (lic && needsReEncrypt(lic, PILOT_LICENSURE_SENSITIVE_FIELDS)) {
              /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
              const enc = await encryptFields(lic, PILOT_LICENSURE_SENSITIVE_FIELDS as any, key);
              await supabase.from('pilot_licensure_experience').update(enc).eq('user_id', userId);
            }
          } catch (err: unknown) {
            console.warn(
              '[vault] Init/re-encrypt failed (non-critical):',
              err instanceof Error ? err.message : err
            );
          }
        });
      }
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

      // Skip Edge Function to avoid rate limiting (429 errors) - use direct Supabase auth
      try {
        throw new Error('SKIP_EDGE_FUNCTION');
      } catch (_edgeFunctionError) {
        // Fallback to direct Supabase auth (original logic)
        const { data: supabaseData, error: supabaseError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: userData.fullName || email.split('@')[0],
              firebase_uid: null,
            },
          },
        });

        if (supabaseError) {
          if (
            supabaseError.message.includes('already registered') ||
            supabaseError.message === 'User already registered'
          ) {
            _userAlreadyExisted = true;

            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword(
              {
                email,
                password,
              }
            );

            if (signInError) {
              console.error('❌ Failed to sign in to get user ID:', signInError);
              throw new Error('USER_ALREADY_EXISTS');
            }

            if (!signInData.user) {
              throw new Error('USER_ALREADY_EXISTS');
            }

            userId = signInData.user.id;

            if (!signInData.user.email_confirmed_at) {
              const { error: resendError } = await supabase.auth.resend({
                type: 'signup',
                email,
              });
              if (resendError) {
                console.warn('⚠️ Failed to resend confirmation email:', resendError);
              } else {
              }
            }
          } else {
            console.error('❌ Supabase auth error:', supabaseError);
            throw new Error(`Supabase auth failed: ${supabaseError.message}`);
          }
        } else {
          if (!supabaseData.user) {
            throw new Error('No user returned from Supabase auth');
          }

          userId = supabaseData.user.id;
        }
      }

      // Acquire vault key for this session (non-blocking, falls back gracefully)
      let vaultKey: CryptoKey | null = null;
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const sub = auth0User?.sub || userId;
        if (session?.access_token && sub) {
          vaultKey = await getVaultKey(sub, session.access_token);
        }
      } catch (vaultErr: unknown) {
        console.warn(
          '[vault] Key unavailable during signup, writing plaintext:',
          vaultErr instanceof Error ? vaultErr.message : vaultErr
        );
      }

      // Step 2: Create or update portal profile in profiles table
      try {
        // First check if profile already exists
        const { data: existingProfile, error: checkError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') {
          // PGRST116 is "not found", which is expected if profile doesn't exist
          console.error('❌ Error checking existing profile:', checkError);
          throw new Error(`Failed to check existing profile: ${checkError.message}`);
        }

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
          const updatePayload = vaultKey
            ? /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
              await encryptFields(rawUpdatePayload, PROFILE_SENSITIVE_FIELDS as any, vaultKey)
            : rawUpdatePayload;
          const { error: updateError } = await supabase
            .from('profiles')
            .update(updatePayload)
            .eq('id', userId);

          if (updateError) {
            console.error('❌ Profile update error:', updateError);
            throw new Error(`Failed to update portal profile: ${updateError.message}`);
          }
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
              const { count } = await supabase
                .from('profiles')
                .select('id', { count: 'exact', head: true });
              const nextNum = (count ?? 2) + 1;
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
          const insertPayload = vaultKey
            ? /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
              await encryptFields(rawInsertPayload, PROFILE_SENSITIVE_FIELDS as any, vaultKey)
            : rawInsertPayload;
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({ id: userId, ...insertPayload });

          if (profileError) {
            console.error('❌ Profile insert error:', profileError);
            throw new Error(`Failed to create portal profile: ${profileError.message}`);
          }

          // Provision Pilot Wallet in background (non-blocking)
          try {
            const {
              data: { session: currentSession },
            } = await supabase.auth.getSession();
            if (currentSession?.access_token) {
              fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/wallet-provision`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${currentSession.access_token}`,
                  apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
                },
                body: JSON.stringify({
                  profile_id: userId,
                  auth0_id: userData.auth0Id || userId,
                  email: email,
                  name: userData.fullName || email.split('@')[0],
                }),
              })
                .then((r) => r.json())
                .then((d) => {
                  if (d.success) console.warn('✅ Pilot Wallet provisioned:', d.walletId);
                  else
                    console.warn(
                      '⚠️ Pilot Wallet provision skipped (wallet API offline):',
                      d.error
                    );
                })
                .catch((e) => console.warn('⚠️ Pilot Wallet provision failed (non-critical):', e));
            }
          } catch (walletErr) {
            console.warn('⚠️ Wallet provision non-critical error:', walletErr);
          }

          // Referral attribution — read code stored by /ref/[code] landing page
          try {
            const refCode =
              typeof document !== 'undefined'
                ? document.cookie
                    .split('; ')
                    .find((r) => r.startsWith('pr_ref='))
                    ?.split('=')[1]
                : null;
            if (refCode) {
              const { data: referrer } = await supabase
                .from('profiles')
                .select('id')
                .eq('referral_code', refCode)
                .maybeSingle();
              if (referrer) {
                await supabase
                  .from('profiles')
                  .update({
                    referred_by_code: refCode,
                    referred_by_profile_id: referrer.id,
                  })
                  .eq('id', userId);
                // Record in referral_conversions (partner = referrer via referral_partners if they exist)
                const { data: partner } = await supabase
                  .from('referral_partners')
                  .select('id, commission_rate, total_referrals')
                  .eq('referral_code', refCode)
                  .eq('is_active', true)
                  .maybeSingle();
                if (partner) {
                  await supabase.from('referral_conversions').upsert(
                    {
                      partner_id: partner.id,
                      referral_code: refCode,
                      pilot_id: userId,
                      pilot_email: email,
                      pilot_name: userData.fullName || null,
                      status: 'signed_up',
                      clicked_at: new Date().toISOString(),
                      signed_up_at: new Date().toISOString(),
                      commission_amount: partner.commission_rate ?? 20,
                    },
                    { onConflict: 'partner_id,pilot_email' }
                  );
                  await supabase
                    .from('referral_partners')
                    .update({
                      total_referrals: partner.total_referrals + 1,
                    })
                    .eq('id', partner.id);
                }
                // Clear cookie after attribution
                document.cookie = 'pr_ref=; path=/; max-age=0';
              }
            }
          } catch (refErr) {
            console.warn('⚠️ Referral attribution failed (non-critical):', refErr);
          }

          // Generate referral code for new pilot (non-blocking)
          try {
            supabase.functions
              .invoke('generate-referral', {
                body: { auth0Id: userData.auth0Id || userId, profileId: userId },
              })
              .catch(() => {});
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

        const { error: accessError } = await supabase
          .from('user_app_access')
          .insert(appAccessRecords);

        if (accessError) {
          // If records already exist, it's not a critical error
          if (accessError.code === '23505') {
          } else {
            console.error('App access creation error:', accessError);
            throw new Error(`Failed to create app access: ${accessError.message}`);
          }
        }
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
        const licensurePayload = vaultKey
          ?  
            await encryptFields(
              rawLicensurePayload,
              PILOT_LICENSURE_SENSITIVE_FIELDS as any,
              vaultKey
            )
          : rawLicensurePayload;
        const { error: pilotTableError } = await supabase
          .from('pilot_licensure_experience')
          .upsert({ user_id: userId, ...licensurePayload }, { onConflict: 'user_id' });

        if (pilotTableError) {
          console.error('Pilot table sync error:', pilotTableError);
          throw new Error(`Failed to sync to pilot table: ${pilotTableError.message}`);
        }
      } catch (pilotTableError) {
        console.error('Failed to sync to pilot table:', pilotTableError);
        throw pilotTableError;
      }

      // Step 8: Send account creation email via Resend
      try {
        const displayName = userData.fullName || email.split('@')[0];

        const { error } = await supabase.functions.invoke('send-account-created-email', {
          body: {
            email,
            name: displayName,
          },
          headers: getAuthHeaders(),
        });

        if (error) {
          console.error('❌ Account creation email error:', error);
        } else {
        }
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
      console.log('[AuthContext] Querying profiles for id:', user.id);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      console.log('[AuthContext] profiles query:', { profileData, profileError: profileError?.message });

      if (profileData && !profileError) {
        await decryptAndSetUserProfile(profileData);
      } else {
        console.log('[AuthContext] Querying pilot_licensure_experience...');
        const { data: pilotData, error: pilotError } = await supabase
          .from('pilot_licensure_experience')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        console.log('[AuthContext] pilot_licensure_experience query:', { pilotData, pilotError: pilotError?.message });

        if (pilotData && !pilotError) {
          await decryptAndSetUserProfile(pilotData);
        } else {
          // Preserve admin role from fallback login when profiles table is unreachable
          let fallbackRole: string | undefined = undefined;
          try {
            const fallback = JSON.parse(localStorage.getItem('adminFallbackLogin') || '{}');
            fallbackRole = fallback.role;
          } catch { /* ignore */ }
          setUserProfile({
            id: user.id,
            user_id: user.id,
            email: emailAddress,
            role: fallbackRole,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
          });
        }
      }
    } catch (profileError) {
      console.error('[AuthContext] Error fetching user profile from Supabase:', profileError);
    }
  }

  async function login(email: string, password: string) {
    console.log('[AuthContext] login() called with email:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      console.log('[AuthContext] signInWithPassword result:', { hasUser: !!data.user, hasSession: !!data.session, error: error?.message });
      if (error) throw new Error(error.message || 'Login failed');
      if (!data.user || !data.session) throw new Error('Login failed: No user or session returned');
      await handlePostLogin(data.user, data.session, email);
    } catch (error: any) {
      const errMsg = error?.message || String(error);
      console.log('[AuthContext] signInWithPassword failed:', errMsg);
      
      // Fallback: use custom admin_login RPC when Supabase Auth service is broken
      if (errMsg.includes('Database error querying schema') || errMsg.includes('Load failed')) {
        console.log('[AuthContext] Trying admin_login RPC fallback...');
        try {
          const { data: adminData, error: adminError } = await supabase.rpc('admin_login', {
            check_email: email,
            check_password: password
          });
          console.log('[AuthContext] admin_login RPC result:', { adminData, adminError: adminError?.message });
          
          if (adminError || !adminData || adminData.length === 0) {
            throw new Error('Invalid email or password');
          }
          
          const user = adminData[0];
          // Manually create a session-like object for admin users
          const mockUser = {
            id: user.id,
            email: user.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            email_confirmed_at: new Date().toISOString(),
            user_metadata: { display_name: user.display_name, role: user.role }
          };
          const mockSession = { access_token: 'admin-fallback-token', refresh_token: '' };
          
          // Store a local flag to indicate admin fallback login
          localStorage.setItem('adminFallbackLogin', JSON.stringify({
            id: user.id,
            email: user.email,
            role: user.role,
            display_name: user.display_name,
            timestamp: Date.now()
          }));
          
          await handlePostLogin(mockUser, mockSession, email);
          // Restore admin role since handlePostLogin may overwrite userProfile
          setUserProfile({
            id: user.id,
            email: user.email,
            display_name: user.display_name,
            role: user.role,
            created_at: new Date().toISOString(),
          });
          console.log('[AuthContext] Admin fallback login succeeded for:', user.email);
          return;
        } catch (fallbackError: any) {
          console.error('[AuthContext] Admin fallback login failed:', fallbackError);
          throw new Error(fallbackError?.message || 'Login failed');
        }
      }
      
      console.error('[AuthContext] Login failed:', error);
      throw error;
    }
  }

  async function sendOtp(email: string, redirectTo?: string) {
    const defaultRedirect = typeof window !== 'undefined' ? `${window.location.origin}/flight-deck-login` : undefined;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectTo || defaultRedirect,
      },
    });
    if (error) {
      console.error('sendOtp error:', error);
      throw new Error(error.message || 'Failed to send code. Please try again.');
    }
  }

  async function verifyOtp(email: string, token: string) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });
      if (error) throw new Error(error.message || 'Invalid code. Please try again.');
      if (!data.user || !data.session) throw new Error('Verification failed. Please try again.');
      await handlePostLogin(data.user, data.session, email);
    } catch (error) {
      console.error('verifyOtp failed:', error);
      throw error;
    }
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
    clearVaultKey(); // Clear vault key from memory

    // Clear Auth0 session data from sessionStorage
    sessionStorage.removeItem('sb-auth-provider');
    sessionStorage.removeItem('sb-auth-user-id');
    sessionStorage.removeItem('sb-auth-email');
    sessionStorage.removeItem('sb-auth-name');
    sessionStorage.removeItem('sb-auth-expiry');
    sessionStorage.removeItem('auth0_user_id');

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signOut error:', error);
        throw error;
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
      // If Supabase API fails, clear session storage directly
      // Remove all Supabase auth tokens from BOTH localStorage and sessionStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('auth') || key.includes('token'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
      // Also purge sessionStorage (Supabase auth session now lives here)
      const ssKeysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('auth') || key.includes('token'))) {
          ssKeysToRemove.push(key);
        }
      }
      ssKeysToRemove.forEach((key) => sessionStorage.removeItem(key));
    }
  }

  async function resetPassword(email: string) {
    // Use Supabase auth for password reset
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  // Refresh user profile from Supabase
  async function refreshUserProfile() {
    if (!currentUser) {
      return;
    }

    try {
      // Fetch profile from Supabase
      const { data: profileData, error } = await supabase
        .from('pilot_licensure_experience')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (profileData && !error) {
        await decryptAndSetUserProfile(profileData);
        logProfileUpdate(currentUser.id, {
          action: 'Profile refreshed after enrollment',
          timestamp: new Date().toISOString(),
        });
      } else {
        // Try profiles table as fallback
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle();

        if (profilesData && !profilesError) {
          await decryptAndSetUserProfile(profilesData);
          logProfileUpdate(currentUser.id, {
            action: 'Profile refreshed from profiles table',
            timestamp: new Date().toISOString(),
          });
        } else {
        }
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

      const { data, error } = await supabase.functions.invoke('auth-mfa-setup', {
        body: { userId: currentUser.uid, method, phoneNumber },
        headers: getAuthHeaders(),
      });

      if (error) {
        throw new Error(error.message || 'Failed to setup MFA');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to setup MFA');
      }

      setMfaSetupData({ secret: data.secret, qrCodeURL: data.qrCodeURL });
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

      const { data, error } = await supabase.functions.invoke('auth-mfa-verify', {
        body: { userId: currentUser.uid, code, isSetup },
        headers: getAuthHeaders(),
      });

      if (error) {
        throw new Error(error.message || 'Failed to verify MFA code');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to verify MFA code');
      }

      if (isSetup) {
        setMfaEnabled(true);
        setMfaSetupStep('none');
        setMfaSetupData({});
        return { success: true, backupCodes: data.backupCodes };
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

      const { data, error } = await supabase.functions.invoke('auth-mfa-disable', {
        body: { userId: currentUser.uid, code },
        headers: getAuthHeaders(),
      });

      if (error) {
        throw new Error(error.message || 'Failed to disable MFA');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to disable MFA');
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

      const { data, error } = await supabase.functions.invoke('auth-mfa-backup-codes', {
        body: { userId: currentUser.uid, action: 'generate', codeCount: 10 },
        headers: getAuthHeaders(),
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate backup codes');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to generate backup codes');
      }

      return data.backupCodes;
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

      const { data, error } = await supabase
        .from('mfa_secrets')
        .select('is_enabled')
        .eq('user_id', currentUser.uid)
        .single();

      if (error) {
        return false;
      }

      const enabled = data?.is_enabled || false;
      setMfaEnabled(enabled);
      return enabled;
    } catch (error) {
      console.error('MFA check status error:', error);
      return false;
    }
  }

  async function deleteAccount(userId: string) {
    try {
      // Call the delete-account Edge Function
      const { data, error } = await supabase.functions.invoke('delete-account', {
        body: { userId },
        headers: getAuthHeaders(),
      });

      if (error) {
        console.error('❌ Error calling delete-account Edge Function:', error);
        throw new Error(`Failed to delete account: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('❌ Error deleting account:', error);
      throw error;
    }
  }

  useEffect(() => {
    // Guard: prevent duplicate SIGNED_IN processing within 5 seconds
    let lastSignedInAt = 0;
    const SIGNED_IN_DEBOUNCE_MS = 5000;

    /** Retry helper for resilient Supabase calls inside auth handler */
    async function authRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
      for (let i = 0; i <= retries; i++) {
        try {
          return await fn();
        } catch (err) {
          const status = (err as any)?.status || (err as any)?.code;
          const isRetryable = status === 522 || status === 503 || status === 'timeout';
          if (!isRetryable || i === retries) throw err;
          await new Promise(r => setTimeout(r, 500 * (i + 1)));
        }
      }
      throw new Error('unreachable');
    }

    // Listen for auth state changes from Supabase (handles OAuth redirects)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Debug: record auth state change event
      try {
        const dbg = JSON.parse(sessionStorage.getItem('oauth_debug_log') || '[]');
        dbg.push({ ts: Date.now(), event, sessionUserId: session?.user?.id || null });
        sessionStorage.setItem('oauth_debug_log', JSON.stringify(dbg.slice(-50)));
        console.debug('[AuthContext] onAuthStateChange', { event, sessionUserId: session?.user?.id });
      } catch (e) {
        console.debug('[AuthContext] debug log write failed', e);
      }

      if (event === 'SIGNED_IN' && session?.user) {
        // DEBOUNCE: skip if we processed SIGNED_IN recently (prevents cascade from tab focus / token refresh)
        const now = Date.now();
        if (now - lastSignedInAt < SIGNED_IN_DEBOUNCE_MS) {
          console.debug('[AuthContext] SIGNED_IN debounced — skipping duplicate');
          return;
        }
        lastSignedInAt = now;

        // User signed in via OAuth
        console.log('[AuthContext] SIGNED_IN event — userId:', session.user.id, 'email:', session.user.email, 'path:', window.location.pathname);

        // Only check account if:
        // 1. We haven't already shown the modal in this session
        // 2. The user is not already set (prevents duplicate checks on tab switch)
        // 3. The user ID is different (new user signing in)
        const modalShownInStorage = localStorage.getItem('oauthModalShown') === 'true';
        const isNewUser = !currentUserRef.current || currentUserRef.current.id !== session.user.id;

        const isOauthRedirectPath = window.location.pathname === '/auth/callback' || window.location.pathname === '/callback';
        const isOnboarding = window.location.pathname.startsWith('/become-member');
        const shouldRunAccountCheck = !isOnboarding && (isOauthRedirectPath || (!oauthModalShownRef.current && !modalShownInStorage && isNewUser));
        console.log('[AuthContext] shouldRunAccountCheck:', shouldRunAccountCheck, { isOauthRedirectPath, isOnboarding, isNewUser, modalShownInStorage });

        if (shouldRunAccountCheck) {
          setOauthModalShown(true);

          // Start account check
          setOauthAccountCheck({ checking: true, hasAccount: null });
          console.log('[AuthContext] Starting profile check for OAuth user');

          const supabaseUser: SupabaseUser = {
            id: session.user.id,
            uid: session.user.id,
            email: session.user.email || '',
            display_name:
              session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            email_confirmed_at: session.user.email_confirmed_at || new Date().toISOString(),
            created_at: session.user.created_at || new Date().toISOString(),
            updated_at: session.user.updated_at || new Date().toISOString(),
          };

          setCurrentUserWithRef(supabaseUser);
          setExplicitLogoutInStorage(false); // Clear logout flag on sign-in

          // Scroll to top after successful login
          window.scrollTo(0, 0);

          // Check if user has an existing account profile (with retry + graceful failure)
          let profileFound = false;
          try {
            const profileResult = await authRetry(() =>
              Promise.resolve(
                supabase.from('profiles').select('*').eq('id', session!.user.id).maybeSingle()
              )
            );
            const profileData = profileResult.data;

            if (profileData) {
              console.log('[AuthContext] Profile found in profiles table for OAuth user');
              await decryptAndSetUserProfile(profileData);
              profileFound = true;
              setOauthAccountCheck({ checking: false, hasAccount: true });
            } else {
              // Try pilot_licensure_experience as fallback (with retry)
              const pilotResult = await authRetry(() =>
                Promise.resolve(
                  supabase.from('pilot_licensure_experience').select('*').eq('user_id', session!.user.id).maybeSingle()
                )
              );
              const pilotData = pilotResult.data;
              console.debug('[AuthContext] SIGNED_IN fallback fetched', { pilotData });

              if (pilotData) {
                console.log('[AuthContext] pilot_licensure_experience found — treating as existing account');
                await decryptAndSetUserProfile(pilotData);
                profileFound = true;
                setOauthAccountCheck({ checking: false, hasAccount: true });
              }
            }
          } catch (err) {
            console.warn('[AuthContext] Profile lookup failed (Supabase may be throttled):', err);
            try {
              const dbg = JSON.parse(sessionStorage.getItem('oauth_debug_log') || '[]');
              dbg.push({ ts: Date.now(), step: 'profile_check_error_resilient', err: err instanceof Error ? err.message : String(err) });
              sessionStorage.setItem('oauth_debug_log', JSON.stringify(dbg.slice(-50)));
            } catch {}
          }

          if (!profileFound) {
            console.warn('[AuthContext] No profile found — new user flow', { userId: session.user.id });
            setOauthAccountCheck({ checking: false, hasAccount: false });
            setUserProfile(null);
          }

          setLoading(false);
        } else {
          // User already signed in or same user, just set the user without checking account
          const supabaseUser: SupabaseUser = {
            id: session.user.id,
            uid: session.user.id,
            email: session.user.email || '',
            display_name:
              session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            email_confirmed_at: session.user.email_confirmed_at || new Date().toISOString(),
            created_at: session.user.created_at || new Date().toISOString(),
            updated_at: session.user.updated_at || new Date().toISOString(),
          };

          setCurrentUserWithRef(supabaseUser);
          setExplicitLogoutInStorage(false);
          setLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        lastSignedInAt = 0; // reset debounce on logout
        setCurrentUserWithRef(null);
        setUserProfile(null);
        setLoading(false);
        // Reset OAuth modal flag on logout
        setOauthModalShown(false);
        localStorage.removeItem('oauthModalShown');
        setOauthAccountCheck({ checking: false, hasAccount: null });
      } else if (event === 'TOKEN_REFRESHED') {
        // Session is still valid, no action needed
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Verify session using Supabase native session check (bypassing Edge Function due to 403 errors)
    const verifySession = async () => {
      // Clear explicit logout flag on OAuth redirect routes (callback or setup page)
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const isOAuthCallback = path === '/auth/callback' || path === '/callback';
        const isSetupPage = new URLSearchParams(window.location.search).get('setup') === '1';
        if (isOAuthCallback || isSetupPage) {
          setExplicitLogoutInStorage(false);
          setOauthModalShown(false);
          oauthModalShownRef.current = false;
          localStorage.removeItem('oauthModalShown');
        }
      }
      // Check if user explicitly logged out - prevent session restoration
      if (isExplicitLogout()) {
        setCurrentUser(null);
        setUserProfile(null);
        setLoading(false);
        return;
      }

      try {
        // Use Supabase native session check instead of Edge Function
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          setCurrentUser(null);
          setUserProfile(null);
          setLoading(false);
          return;
        }

        if (session?.user) {
          // Create SupabaseUser object
          const verifiedUser: SupabaseUser = {
            id: session.user.id,
            uid: session.user.id,
            email: session.user.email || '',
            display_name:
              session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            email_confirmed_at: session.user.email_confirmed_at || new Date().toISOString(),
            created_at: session.user.created_at || new Date().toISOString(),
            updated_at: session.user.updated_at || new Date().toISOString(),
          };

          setCurrentUser(verifiedUser);

          // Scroll to top on session restoration
          window.scrollTo(0, 0);

          // Fetch profile from Supabase
          try {
            const { data: profileData, error } = await supabase
              .from('pilot_licensure_experience')
              .select('*')
              .eq('user_id', session.user.id)
              .maybeSingle();

            if (profileData && !error) {
              await decryptAndSetUserProfile(profileData);
            } else {
              // No profile found — preserve admin fallback role if present
              let fallbackRole: string | undefined;
              try {
                const fb = JSON.parse(localStorage.getItem('adminFallbackLogin') || '{}');
                fallbackRole = fb.role;
              } catch { /* ignore */ }
              setUserProfile({
                id: session.user.id,
                user_id: session.user.id,
                email: session.user.email || '',
                role: fallbackRole,
                created_at: new Date().toISOString(),
                last_login: new Date().toISOString(),
              });
            }
          } catch (err) {
            console.error('❌ Error fetching Supabase profile:', err);
            // Preserve admin fallback role on timeout so admin dashboard stays accessible
            let fallbackRole: string | undefined;
            try {
              const fb = JSON.parse(localStorage.getItem('adminFallbackLogin') || '{}');
              fallbackRole = fb.role;
            } catch { /* ignore */ }
            setUserProfile({
              id: session.user.id,
              user_id: session.user.id,
              email: session.user.email || '',
              role: fallbackRole,
              created_at: new Date().toISOString(),
              last_login: new Date().toISOString(),
            });
          }
        } else {
          // Check for Auth0 session in sessionStorage
          const auth0Provider = sessionStorage.getItem('sb-auth-provider');
          const auth0UserId = sessionStorage.getItem('sb-auth-user-id');
          const auth0Email = sessionStorage.getItem('sb-auth-email');
          const auth0Name = sessionStorage.getItem('sb-auth-name');
          const auth0Expiry = sessionStorage.getItem('sb-auth-expiry');

          if (auth0Provider === 'auth0' && auth0UserId && auth0Email) {
            // Check if session expired
            if (auth0Expiry && parseInt(auth0Expiry) > Date.now()) {
              const restoredUser: SupabaseUser = {
                id: auth0UserId,
                uid: auth0UserId,
                email: auth0Email,
                email_confirmed_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                display_name: auth0Name || auth0Email.split('@')[0],
                displayName: auth0Name || auth0Email.split('@')[0],
              };
              setCurrentUser(restoredUser);

              // Fetch profile data from Supabase (includes profile_image_url)
              try {
                const { data: profileData } = await supabase
                  .from('profiles')
                  .select(
                    'profile_image_url, profile_image_public_id, full_name, display_name, email, current_flight_hours, overall_recognition_score, license_id, country_of_license, ratings'
                  )
                  .eq('auth0_id', auth0UserId)
                  .maybeSingle();

                if (profileData) {
                  let displayData = profileData;
                  try {
                    const {
                      data: { session: s },
                    } = await supabase.auth.getSession();
                    if (s?.access_token && auth0UserId) {
                      const vKey = await getVaultKey(auth0UserId, s.access_token);
                       
                      displayData = await decryptFields(
                        profileData,
                        PROFILE_SENSITIVE_FIELDS as any,
                        vKey
                      );
                    }
                  } catch (err: unknown) {
                    console.warn(
                      '[AuthContext] Vault decryption failed for restored session:',
                      err instanceof Error ? err.message : err
                    );
                  }
                  setUserProfile({
                    ...displayData,
                    user_id: auth0UserId,
                    profile_image_url: displayData.profile_image_url || '',
                    profile_image_public_id: displayData.profile_image_public_id || '',
                  });
                }
              } catch (err) {
                console.warn('⚠️ Could not load profile data for Auth0 session:', err);
              }
            } else {
              // Clear expired session data
              sessionStorage.removeItem('sb-auth-provider');
              sessionStorage.removeItem('sb-auth-user-id');
              sessionStorage.removeItem('sb-auth-email');
              sessionStorage.removeItem('sb-auth-name');
              sessionStorage.removeItem('sb-auth-expiry');
              setCurrentUser(null);
            }
          } else {
            setCurrentUser(null);
          }
          setUserProfile(null);
        }
      } catch (_err) {
        setCurrentUser(null);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    // Guard: only run session verification if we don't already have a user
    // This prevents loops when Vite Fast Refresh remounts the component
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
