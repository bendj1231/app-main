import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { indexedDB } from '../lib/indexedDB';
import { createManagementAPI } from '../lib/supabase-management';
import { useUserActivityLog } from '../hooks/useUserActivityLog';

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

interface AuthContextType {
    currentUser: SupabaseUser | null;
    userProfile: any | null;
    loading: boolean;
    signupInProgress: boolean;
    signup: (email: string, password: string, userData: any) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
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
    mfaVerify: (code: string, isSetup?: boolean) => Promise<{ success: boolean; backupCodes?: string[] }>;
    mfaDisable: (code: string) => Promise<void>;
    mfaGenerateBackupCodes: () => Promise<string[]>;
    mfaCheckStatus: () => Promise<boolean>;
    // OAuth account check
    oauthAccountCheck: { checking: boolean; hasAccount: boolean | null };
    resetOauthAccountCheck: () => void;
    resetOauthAccountCheckOnly: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
    const [userProfile, setUserProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [csrfToken, setCsrfToken] = useState<string | null>(null);

    // MFA state
    const [mfaEnabled, setMfaEnabled] = useState(false);
    const [mfaSetupStep, setMfaSetupStep] = useState<'none' | 'qr' | 'verify'>('none');
    const [mfaSetupData, setMfaSetupData] = useState<{ secret?: string; qrCodeURL?: string }>({});

    // OAuth account check state - NOT persisted to sessionStorage to prevent stuck modal on refresh
    const [oauthAccountCheck, setOauthAccountCheck] = useState<{ checking: boolean; hasAccount: boolean | null }>({ checking: false, hasAccount: null });

    // Flag to track if we've already shown the modal for this session
    const [oauthModalShown, setOauthModalShown] = useState(() => {
        return localStorage.getItem('oauthModalShown') === 'true';
    });

    // Persist oauthModalShown flag to localStorage
    useEffect(() => {
        if (oauthModalShown) {
            localStorage.setItem('oauthModalShown', 'true');
        }
    }, [oauthModalShown]);

    // Function to reset OAuth account check state
    const resetOauthAccountCheck = () => {
        setOauthAccountCheck({ checking: false, hasAccount: null });
        setOauthModalShown(false);
        localStorage.removeItem('oauthModalShown');
    };

    // Function to reset account check state only, without removing oauthModalShown flag
    const resetOauthAccountCheckOnly = () => {
        setOauthAccountCheck({ checking: false, hasAccount: null });
        // Ensure oauthModalShown is set to true to prevent re-checking on tab switch
        setOauthModalShown(true);
        localStorage.setItem('oauthModalShown', 'true');
    };

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

    async function signup(email: string, password: string, userData: any) {
        console.log('🔵 Starting signup process for:', email);
        console.log('🔵 User data:', userData);
        setSignupInProgress(true);

        try {
            let userId: string;
            let firebaseUser: any = null;
            let userAlreadyExisted = false;

            // Step 1: Use Edge Function for auth signup with rate limiting and CSRF protection
            try {
                console.log('🔵 Step 1: Creating Supabase auth user via Edge Function...');
                const { data, error } = await supabase.functions.invoke('auth-signup', {
                    body: { email, password, userData },
                    headers: getAuthHeaders()
                });

                if (error) {
                    // If Edge Function fails, fall back to direct Supabase auth
                    console.warn('⚠️ Edge Function signup failed, falling back to direct auth:', error.message);
                    throw error;
                }

                if (!data?.success) {
                    console.warn('⚠️ Edge Function returned error, falling back to direct auth:', data?.error);
                    throw new Error(data?.error || 'Signup failed');
                }

                // Store CSRF token from response
                if (data?.csrfToken) {
                    setCsrfToken(data.csrfToken);
                }

                userId = data.user.id;
                console.log('✅ User created via Edge Function:', userId);

                // If Edge Function returned a session, the user is already signed in
                // Otherwise, we need to sign in to get the session for profile creation
                if (data.session) {
                    console.log('✅ Session returned from Edge Function');
                } else {
                    console.log('🔵 Signing in to get session for profile creation...');
                    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                        email,
                        password
                    });
                    
                    if (signInError) {
                        throw new Error(`Failed to sign in after signup: ${signInError.message}`);
                    }
                    console.log('✅ Signed in successfully');
                }
            } catch (edgeFunctionError) {
                console.log('🔵 Edge Function failed, using direct Supabase auth as fallback...');
                
                // Fallback to direct Supabase auth (original logic)
                const { data: supabaseData, error: supabaseError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            display_name: userData.fullName || email.split('@')[0],
                            firebase_uid: null
                        }
                    }
                });

                if (supabaseError) {
                    if (supabaseError.message.includes('already registered') || supabaseError.message === 'User already registered') {
                        console.log('User already exists in auth, attempting to sign in...');
                        userAlreadyExisted = true;
                    
                        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                            email,
                            password
                        });
                        
                        if (signInError) {
                            console.error('❌ Failed to sign in to get user ID:', signInError);
                            throw new Error('USER_ALREADY_EXISTS');
                        }
                        
                        if (!signInData.user) {
                            throw new Error('USER_ALREADY_EXISTS');
                        }
                        
                        userId = signInData.user.id;
                        console.log('✅ Found existing auth user via sign in:', userId);
                        
                        if (!signInData.user.email_confirmed_at) {
                            console.log('User email not confirmed, sending confirmation email...');
                            const { error: resendError } = await supabase.auth.resend({
                                type: 'signup',
                                email
                            });
                            if (resendError) {
                                console.warn('⚠️ Failed to resend confirmation email:', resendError);
                            } else {
                                console.log('✅ Confirmation email sent');
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
                    console.log('✅ Supabase auth user created:', userId);
                }
            }

        console.log('🔵 Step 2: Creating portal profile...');

        // Step 2: Create or update portal profile in profiles table
        try {
            console.log('🔵 Step 2: Creating portal profile...');
            
            // First check if profile already exists
            const { data: existingProfile, error: checkError } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', userId)
                .single();
            
            if (checkError && checkError.code !== 'PGRST116') {
                // PGRST116 is "not found", which is expected if profile doesn't exist
                console.error('❌ Error checking existing profile:', checkError);
                throw new Error(`Failed to check existing profile: ${checkError.message}`);
            }
            
            if (existingProfile) {
                console.log('⚠️ Profile already exists for user, updating...');
                // Profile exists, update it
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({
                        display_name: userData.fullName || email.split('@')[0],
                        full_name: userData.fullName,
                        phone: userData.contactNumber,
                        country: userData.residingCountry,
                        date_of_birth: userData.dob || null,
                        nationality: userData.nationality,
                        updated_at: new Date().toISOString(),
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
                        // Additional ATLAS resume fields (only those that exist in profiles table)
                        english_proficiency_level: userData.englishProficiencyLevel || null,
                        license_expiry: userData.licenseExpiry || null,
                        medical_expiry: userData.medicalExpiry || null,
                        medical_country: userData.medicalCountry || null,
                        medical_class: userData.medicalClass || null,
                        radio_license_expiry: userData.radioLicenseExpiry || null,
                        last_flown: userData.lastFlown || null,
                        job_experiences: userData.jobExperiences || []
                    })
                    .eq('id', userId);

                if (updateError) {
                    console.error('❌ Profile update error:', updateError);
                    throw new Error(`Failed to update portal profile: ${updateError.message}`);
                }
            } else {
                // Profile doesn't exist, create it
                console.log('Creating new profile...');
                const experienceLevel = (() => {
                    const hours = parseInt(userData.currentFlightHours || '0', 10);
                    if (hours < 500) return 'Low Timer';
                    if (hours < 1500) return 'Middle Timer';
                    return 'High Timer';
                })();

                console.log('🔵 Experience level:', experienceLevel);

                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: userId,
                        email: email,
                        display_name: userData.fullName || email.split('@')[0],
                        full_name: userData.fullName,
                        phone: userData.contactNumber,
                        country: userData.residingCountry,
                        date_of_birth: userData.dob || null,
                        nationality: userData.nationality,
                        role: 'mentee', // Default role for new users
                        status: 'active',
                        firebase_uid: null, // Will be set after Firebase creation
                        enrolled_programs: [],
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        // Additional detailed fields
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
                        // Additional ATLAS resume fields (only those that exist in profiles table)
                        english_proficiency_level: userData.englishProficiencyLevel || null,
                        license_expiry: userData.licenseExpiry || null,
                        medical_expiry: userData.medicalExpiry || null,
                        medical_country: userData.medicalCountry || null,
                        medical_class: userData.medicalClass || null,
                        radio_license_expiry: userData.radioLicenseExpiry || null,
                        last_flown: userData.lastFlown || null,
                        job_experiences: userData.jobExperiences || []
                    });

                if (profileError) {
                    console.error('❌ Profile insert error:', profileError);
                    throw new Error(`Failed to create portal profile: ${profileError.message}`);
                }
                
                console.log('✅ Portal profile created:', userId);
                console.log('🔵 Profile created successfully. Proceeding to next step...');
            }
        } catch (profileError) {
            console.error('❌ Failed to create profile:', profileError);
            throw profileError;
        }

        console.log('🔵 Step 3: Creating app access records...');

        // Step 3: Create app access records (ignore if already exist)
        try {
            const defaultApps = [
                { app_id: 'foundational', granted: true },
                { app_id: 'pilot-profile', granted: true },
                { app_id: 'mentorship', granted: false },
                { app_id: 'atlas-cv', granted: false },
                { app_id: 'w1000', granted: false }
            ];

            const appAccessRecords = defaultApps.map(app => ({
                user_id: userId,
                app_id: app.app_id,
                granted: app.granted,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }));

            const { error: accessError } = await supabase
                .from('user_app_access')
                .insert(appAccessRecords);

            if (accessError) {
                // If records already exist, it's not a critical error
                if (accessError.code === '23505') {
                    console.log('App access records already exist, skipping...');
                } else {
                    console.error('App access creation error:', accessError);
                    throw new Error(`Failed to create app access: ${accessError.message}`);
                }
            }

            console.log('✅ App access records created/verified:', userId);
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
                residingCountry: userData.residingCountry
            },

            contactInfo: {
                email: email,
                contactNumber: userData.contactNumber,
                flightSchoolAddress: userData.flightSchoolAddress
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
                aircraftRatedOn: userData.aircraftRatedOn
            },

            programPreferences: {
                programInterests: userData.programInterests,
                pathwayInterests: userData.pathwayInterests
            },

            insights: {
                insightInterests: userData.insightInterests
            }
        };

        // Step 6: Sync to Supabase pilot_licensure_experience table with all gathered information
        try {
            const { error: pilotTableError } = await supabase
                .from('pilot_licensure_experience')
                .upsert({
                    user_id: userId,
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
                    languages: Array.isArray(userData.languages) ? userData.languages : (userData.languages ? [userData.languages] : null),
                    english_proficiency: userData.englishProficiencyLevel || null,
                    license_number: userData.licenseId || userData.licenseNumber || null,
                    license_expiry: userData.licenseExpiry || null,
                    country_of_license: userData.countryOfLicense,
                    current_flight_hours: userData.currentFlightHours,
                    aircraft_ratings: userData.aircraftRatedOn ? [{ aircraft_type: userData.aircraftRatedOn, rating_date: null, is_current: true }] : [],
                    experience_description: userData.experienceDescription,
                    ratings: Array.isArray(userData.ratings) ? userData.ratings : (userData.ratings ? [userData.ratings] : []),
                    current_license: Array.isArray(userData.ratings) ? userData.ratings : (userData.ratings ? [userData.ratings] : []),
                    // Medical information
                    medical_expiry: userData.medicalExpiry || null,
                    medical_country: userData.medicalCountry || null,
                    medical_class: userData.medicalClass || null,
                    radio_license_expiry: userData.radioLicenseExpiry || null,
                    // Current occupation
                    current_occupation: userData.currentOccupation || null,
                    current_employer: userData.currentEmployer || null,
                    current_position: userData.currentPosition || null,
                    // Additional info
                    countries_visited: parseInt(userData.countriesVisited || '0', 10) || 0,
                    favorite_aircraft: userData.favoriteAircraft || null,
                    why_become_pilot: userData.whyBecomePilot || null,
                    other_skills: userData.otherSkills || null,
                    // Job experiences
                    job_experiences: Array.isArray(userData.jobExperiences) ? userData.jobExperiences : (userData.jobExperiences ? [userData.jobExperiences] : []),
                    // Interests
                    aviation_pathways_interests: Array.isArray(userData.pathwayInterests) ? userData.pathwayInterests : (userData.pathwayInterests ? [userData.pathwayInterests] : []),
                    pilot_job_positions_interests: Array.isArray(userData.insightInterests) ? userData.insightInterests : (userData.insightInterests ? [userData.insightInterests] : []),
                    program_interests: Array.isArray(userData.programInterests) ? userData.programInterests : (userData.programInterests ? [userData.programInterests] : []),
                    insight_interests: Array.isArray(userData.insightInterests) ? userData.insightInterests : (userData.insightInterests ? [userData.insightInterests] : []),
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });

            if (pilotTableError) {
                console.error('Pilot table sync error:', pilotTableError);
                throw new Error(`Failed to sync to pilot table: ${pilotTableError.message}`);
            }

            console.log('✅ Pilot data synced to pilot_licensure_experience table');
        } catch (pilotTableError) {
            console.error('Failed to sync to pilot table:', pilotTableError);
            throw pilotTableError;
        }

        // Step 8: Send account creation email via Resend
        try {
            const displayName = userData.fullName || email.split('@')[0];
            console.log('📧 Attempting to send account creation email to:', email, 'with name:', displayName);
            
            const { data, error } = await supabase.functions.invoke('send-account-created-email', {
                body: {
                    email,
                    name: displayName
                },
                headers: getAuthHeaders()
            });
            
            console.log('📧 Email function response - data:', data, 'error:', error);
            
            if (error) {
                console.error('❌ Account creation email error:', error);
                console.log('⚠️ Account creation email failed to send via Resend');
            } else {
                console.log('✅ Account creation email sent via Resend to:', email);
            }
        } catch (emailError) {
            console.error("❌ Error sending account creation email:", emailError);
            // Non-critical: User is still created
        }

        // Step 8: Create readable roster entry for admin view
        if (userData.pilotCategory) {
            try {
                const experienceLevel = structuredData.experienceLevel;
                const shortUid = userId.substring(0, 5);
                const safeId = `[${experienceLevel}] ${userData.pilotCategory} (${shortUid})`
                    .replace(/\//g, '-')
                    .replace(/\./g, '_');

                console.log('✅ Roster entry would be created:', safeId);
                // Note: Roster entry creation removed as it was Firebase-specific
            } catch (error) {
                console.error("Error with roster entry:", error);
                // Non-critical, allows signup to proceed
            }
        }

        console.log('🎉 Signup completed successfully for user:', userId);
        } finally {
            setSignupInProgress(false);
        }
    }

    async function login(email: string, password: string) {
        try {
            // Use Supabase client directly for login
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                console.error("Supabase login error:", error);
                throw new Error(error.message || 'Login failed');
            }

            if (!data.user || !data.session) {
                throw new Error('Login failed: No user or session returned');
            }

            // Clear explicit logout flag on successful login
            setExplicitLogoutInStorage(false);

            console.log("User signed in via Supabase:", data.user.id);

            // Log login activity
            await logLogin(data.user.id);

            // Set currentUser state with Supabase user data
            const supabaseUser: SupabaseUser = {
                id: data.user.id,
                uid: data.user.id,
                email: data.user.email || '',
                display_name: data.user.email?.split('@')[0],
                displayName: data.user.email?.split('@')[0],
                email_confirmed_at: data.user.email_confirmed_at || new Date().toISOString(),
                created_at: data.user.created_at || new Date().toISOString(),
                updated_at: data.user.updated_at || new Date().toISOString()
            };

            setCurrentUser(supabaseUser);

            // Scroll to top after successful login
            window.scrollTo(0, 0);

            // Fetch user profile from Supabase
            try {
                console.log("Fetching user profile from Supabase for:", data.user.id);
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', data.user.id)
                    .maybeSingle();

                if (profileData && !profileError) {
                    console.log("✅ User profile fetched from profiles table:", data.user.id);
                    setUserProfile(profileData);
                } else {
                    console.log("⚠️ No user profile found in profiles table for:", data.user.id);
                    // Try pilot_licensure_experience as fallback
                    const { data: pilotData, error: pilotError } = await supabase
                        .from('pilot_licensure_experience')
                        .select('*')
                        .eq('user_id', data.user.id)
                        .maybeSingle();
                    
                    if (pilotData && !pilotError) {
                        console.log("✅ User profile fetched from pilot_licensure_experience table:", data.user.id);
                        setUserProfile(pilotData);
                    } else {
                        console.log("⚠️ No user profile found anywhere for:", data.user.id);
                        // Create minimal profile from auth data
                        const newProfile = {
                            id: data.user.id,
                            user_id: data.user.id,
                            email: email,
                            created_at: new Date().toISOString(),
                            last_login: new Date().toISOString()
                        };
                        setUserProfile(newProfile);
                    }
                }
            } catch (profileError) {
                console.error("Error fetching user profile from Supabase:", profileError);
                // Non-critical error, proceed with auth only
            }
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    }

    async function logout() {
        console.log('🔴 Logout function called');

        // Log logout activity (don't let this block logout)
        if (currentUser) {
            try {
                await logLogout(currentUser.id);
            } catch (error) {
                console.error("Failed to log logout activity:", error);
            }
        }

        setExplicitLogoutInStorage(true); // Set flag to prevent re-authentication
        setCsrfToken(null); // Clear CSRF token
        setCurrentUser(null); // Clear current user
        setUserProfile(null); // Clear user profile

        try {
            console.log('🔴 Calling Supabase signOut...');
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error("Supabase signOut error:", error);
                throw error;
            }
            console.log('✅ Logout completed');
        } catch (error) {
            console.error("❌ Logout error:", error);
            // If Supabase API fails, clear session storage directly
            // Remove all Supabase auth tokens from storage
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.startsWith('sb-') || key.includes('auth') || key.includes('token'))) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
            sessionStorage.clear();
            console.log('✅ Cleared auth storage manually');
        }
    }

    async function resetPassword(email: string) {
        // Use Supabase auth for password reset
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        });

        if (error) {
            throw new Error(error.message);
        }
    }

    // Refresh user profile from Supabase
    async function refreshUserProfile() {
        if (!currentUser) {
            console.log('⚠️ No current user to refresh profile');
            return;
        }

        try {
            console.log('🔄 Refreshing user profile for:', currentUser.id);
            
            // Fetch profile from Supabase
            const { data: profileData, error } = await supabase
                .from('pilot_licensure_experience')
                .select('*')
                .eq('user_id', currentUser.id)
                .maybeSingle();

            if (profileData && !error) {
                console.log('✅ User profile refreshed successfully:', currentUser.id);
                setUserProfile(profileData);
                logProfileUpdate(currentUser.id, { action: 'Profile refreshed after enrollment', timestamp: new Date().toISOString() });
            } else {
                console.log('⚠️ No profile found during refresh, checking profiles table');
                
                // Try profiles table as fallback
                const { data: profilesData, error: profilesError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', currentUser.id)
                    .maybeSingle();
                
                if (profilesData && !profilesError) {
                    console.log('✅ Profile refreshed from profiles table:', currentUser.id);
                    setUserProfile(profilesData);
                    logProfileUpdate(currentUser.id, { action: 'Profile refreshed from profiles table', timestamp: new Date().toISOString() });
                } else {
                    console.log('⚠️ No profile found in any table during refresh');
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
                headers: getAuthHeaders()
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
    async function mfaVerify(code: string, isSetup: boolean = false): Promise<{ success: boolean; backupCodes?: string[] }> {
        try {
            if (!currentUser) {
                throw new Error('User must be logged in to verify MFA');
            }

            const { data, error } = await supabase.functions.invoke('auth-mfa-verify', {
                body: { userId: currentUser.uid, code, isSetup },
                headers: getAuthHeaders()
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
                headers: getAuthHeaders()
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
                headers: getAuthHeaders()
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
        console.log('🔴 deleteAccount called for user:', userId);
        try {
            // Call the delete-account Edge Function
            const { data, error } = await supabase.functions.invoke('delete-account', {
                body: { userId },
                headers: getAuthHeaders()
            });

            if (error) {
                console.error('❌ Error calling delete-account Edge Function:', error);
                throw new Error(`Failed to delete account: ${error.message}`);
            }

            console.log('✅ Account deleted successfully');
            return data;
        } catch (error) {
            console.error('❌ Error deleting account:', error);
            throw error;
        }
    }

    useEffect(() => {
        // Listen for auth state changes from Supabase (handles OAuth redirects)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.id);
            
            if (event === 'SIGNED_IN' && session?.user) {
                // User signed in via OAuth
                console.log('User signed in via OAuth:', session.user.id);
                console.log('oauthModalShown flag:', oauthModalShown);
                console.log('oauthModalShown from localStorage:', localStorage.getItem('oauthModalShown'));
                console.log('currentUser state:', currentUser?.id);

                // Only check account if:
                // 1. We haven't already shown the modal in this session
                // 2. The user is not already set (prevents duplicate checks on tab switch)
                // 3. The user ID is different (new user signing in)
                const modalShownInStorage = localStorage.getItem('oauthModalShown') === 'true';
                const isNewUser = !currentUser || currentUser.id !== session.user.id;
                
                if (!oauthModalShown && !modalShownInStorage && isNewUser) {
                    console.log('Starting account check for new user...');
                    setOauthModalShown(true);

                    // Start account check
                    setOauthAccountCheck({ checking: true, hasAccount: null });
                    console.log('Set oauthAccountCheck to checking: true');

                    const supabaseUser: SupabaseUser = {
                        id: session.user.id,
                        uid: session.user.id,
                        email: session.user.email || '',
                        display_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                        displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                        email_confirmed_at: session.user.email_confirmed_at || new Date().toISOString(),
                        created_at: session.user.created_at || new Date().toISOString(),
                        updated_at: session.user.updated_at || new Date().toISOString()
                    };

                    setCurrentUser(supabaseUser);
                    setExplicitLogoutInStorage(false); // Clear logout flag on sign-in

                    // Scroll to top after successful login
                    window.scrollTo(0, 0);

                    // Check if user has an existing account profile
                    try {
                        console.log('Checking profile for user:', session.user.id);
                        const { data: profileData, error } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', session.user.id)
                            .maybeSingle();

                        console.log('Profile check result from profiles table:', { profileData, error });

                        if (profileData && !error) {
                            console.log("✅ Profile found for OAuth user in profiles table:", session.user.id);
                            setUserProfile(profileData);
                            setOauthAccountCheck({ checking: false, hasAccount: true });
                            console.log('Set oauthAccountCheck to hasAccount: true');
                        } else {
                            console.log("⚠️ No profile found in profiles table, checking pilot_licensure_experience for OAuth user:", session.user.id);
                            // Try pilot_licensure_experience as fallback
                            const { data: pilotData, error: pilotError } = await supabase
                                .from('pilot_licensure_experience')
                                .select('*')
                                .eq('user_id', session.user.id)
                                .maybeSingle();

                            if (pilotData && !pilotError) {
                                console.log("✅ Profile found for OAuth user in pilot_licensure_experience table:", session.user.id);
                                setUserProfile(pilotData);
                                setOauthAccountCheck({ checking: false, hasAccount: true });
                            } else {
                                console.log("⚠️ No profile found anywhere for OAuth user:", session.user.id);
                                setOauthAccountCheck({ checking: false, hasAccount: false });
                                console.log('Set oauthAccountCheck to hasAccount: false');
                                // Create default profile
                                const defaultProfile = {
                                    id: session.user.id,
                                    user_id: session.user.id,
                                    email: session.user.email,
                                    created_at: new Date().toISOString(),
                                    enrolled_programs: [],
                                    appAccess: []
                                };
                                setUserProfile(defaultProfile);
                            }
                        }
                    } catch (err) {
                        console.error("❌ Error checking profile for OAuth user:", err);
                        setOauthAccountCheck({ checking: false, hasAccount: false });
                        console.log('Set oauthAccountCheck to hasAccount: false due to error');
                    }

                    setLoading(false);
                } else {
                    // User already signed in or same user, just set the user without checking account
                    console.log('User already authenticated or same user, skipping account check');
                    const supabaseUser: SupabaseUser = {
                        id: session.user.id,
                        uid: session.user.id,
                        email: session.user.email || '',
                        display_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                        displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                        email_confirmed_at: session.user.email_confirmed_at || new Date().toISOString(),
                        created_at: session.user.created_at || new Date().toISOString(),
                        updated_at: session.user.updated_at || new Date().toISOString()
                    };

                    setCurrentUser(supabaseUser);
                    setExplicitLogoutInStorage(false);
                    setLoading(false);
                }
            } else if (event === 'SIGNED_OUT') {
                console.log('User signed out');
                setCurrentUser(null);
                setUserProfile(null);
                setLoading(false);
                // Reset OAuth modal flag on logout
                setOauthModalShown(false);
                localStorage.removeItem('oauthModalShown');
            } else if (event === 'TOKEN_REFRESHED') {
                console.log('Token refreshed');
                // Session is still valid, no action needed
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [currentUser, oauthModalShown]);

    useEffect(() => {
        // Verify session using Supabase native session check (bypassing Edge Function due to 403 errors)
        const verifySession = async () => {
            // Check if user explicitly logged out - prevent session restoration
            if (isExplicitLogout()) {
                console.log("⚠️ User explicitly logged out, skipping session restoration");
                setCurrentUser(null);
                setUserProfile(null);
                setLoading(false);
                return;
            }

            try {
                // Use Supabase native session check instead of Edge Function
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.log("⚠️ Session check error:", sessionError);
                    setCurrentUser(null);
                    setUserProfile(null);
                    setLoading(false);
                    return;
                }

                if (session?.user) {
                    console.log("✅ Session verified via Supabase:", session.user.id, session.user.email);

                    // Create SupabaseUser object
                    const verifiedUser: SupabaseUser = {
                        id: session.user.id,
                        uid: session.user.id,
                        email: session.user.email || '',
                        display_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                        displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                        email_confirmed_at: session.user.email_confirmed_at || new Date().toISOString(),
                        created_at: session.user.created_at || new Date().toISOString(),
                        updated_at: session.user.updated_at || new Date().toISOString()
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
                            console.log("✅ Supabase profile fetched for user:", session.user.id);
                            setUserProfile(profileData);
                        } else {
                            console.log("⚠️ No Supabase profile found for user:", session.user.id, "Creating default profile");
                            const defaultProfile = {
                                user_id: session.user.id,
                                email: session.user.email,
                                created_at: new Date().toISOString(),
                                enrolled_programs: [],
                                appAccess: []
                            };
                            setUserProfile(defaultProfile);
                        }
                    } catch (err) {
                        console.error("❌ Error fetching Supabase profile:", err);
                        const defaultProfile = {
                            user_id: session.user.id,
                            email: session.user.email,
                            created_at: new Date().toISOString(),
                            enrolled_programs: [],
                            appAccess: []
                        };
                        setUserProfile(defaultProfile);
                    }
                } else {
                    console.log("⚠️ No valid session found");
                    setCurrentUser(null);
                    setUserProfile(null);
                }
            } catch (err) {
                console.log("⚠️ Session verification failed:", err);
                setCurrentUser(null);
                setUserProfile(null);
            } finally {
                setLoading(false);
            }
        };

        verifySession();

        return () => {
    };
}, []);

const value = {
    currentUser,
    userProfile,
    loading,
    signupInProgress,
    signup,
    login,
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
    resetOauthAccountCheckOnly
};

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
