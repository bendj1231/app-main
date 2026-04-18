import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendEmailVerification,
    sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import { indexedDB } from '../lib/indexedDB';
import { createManagementAPI } from '../lib/supabase-management';

interface AuthContextType {
    currentUser: User | null;
    userProfile: any | null;
    loading: boolean;
    signup: (email: string, password: string, userData: any) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    deleteAccount: (userId: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
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
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [explicitLogout, setExplicitLogout] = useState(false);

    // Clear explicitLogout flag on page refresh to allow session restoration
    useEffect(() => {
        setExplicitLogout(false);
    }, []);

    async function signup(email: string, password: string, userData: any) {
        console.log('🔵 Starting signup process for:', email);
        console.log('🔵 User data:', userData);

        let userId: string;
        let firebaseUser: any = null;
        let userAlreadyExisted = false;

        // Step 1: Create Supabase auth user first (preferred)
        try {
            console.log('🔵 Step 1: Creating Supabase auth user...');
            const { data: supabaseData, error: supabaseError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        display_name: userData.fullName || email.split('@')[0],
                        firebase_uid: null // Will be set after Firebase creation
                    }
                }
            });

            if (supabaseError) {
                // If user already exists, try to sign in to get the user ID
                if (supabaseError.message.includes('already registered') || supabaseError.message === 'User already registered') {
                    console.log('User already exists in auth, attempting to sign in...');
                    userAlreadyExisted = true;
                    
                    // Try to sign in to get the user ID
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
                    
                    // Send confirmation email for existing user
                    if (!signInData.user.email_confirmed_at) {
                        console.log('User email not confirmed, sending confirmation email...');
                        const { error: resendError } = await supabase.auth.resend({
                            type: 'signup',
                            email
                        });
                        if (resendError) {
                            console.warn('⚠️ Failed to resend confirmation email:', resendError);
                            // Non-critical: continue with profile creation
                        } else {
                            console.log('✅ Confirmation email sent');
                        }
                    } else {
                        console.log('User email already confirmed');
                    }
                    
                    // Don't sign out - keep the session for profile creation
                    // RLS policies require an authenticated session
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
        } catch (supabaseError) {
            console.error('❌ Failed to create Supabase auth user:', supabaseError);
            throw supabaseError;
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

        // Step 4: Create Firebase user for compatibility (using same ID pattern)
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            firebaseUser = userCredential.user;
            
            console.log('✅ Firebase user created:', firebaseUser.uid);

            // Update Supabase profile with Firebase UID
            await supabase
                .from('profiles')
                .update({ firebase_uid: firebaseUser.uid })
                .eq('id', userId);
        } catch (firebaseError) {
            console.error('Firebase creation error:', firebaseError);
            // Non-critical: Supabase auth is the primary auth
            console.log('⚠️ Firebase creation failed, but Supabase auth succeeded');
        }

        // Step 5: Structure the user data
        const structuredData = {
            uid: userId, // Use Supabase ID as primary
            firebaseUid: firebaseUser?.uid || null,
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

        // Step 6: Create user document in Firestore (using Supabase ID)
        try {
            await setDoc(doc(db, 'users', userId), structuredData);
            console.log('✅ Firestore document created:', userId);
        } catch (firestoreError) {
            console.error('Firestore creation error:', firestoreError);
            // Non-critical: Supabase is the primary
        }

        // Step 7: Sync to Supabase pilot_licensure_experience table with all gathered information
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
                }
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

        // Step 9: Create readable roster entry for admin view
        if (userData.pilotCategory) {
            try {
                const experienceLevel = structuredData.experienceLevel;
                const shortUid = userId.substring(0, 5);
                const safeId = `[${experienceLevel}] ${userData.pilotCategory} (${shortUid})`
                    .replace(/\//g, '-')
                    .replace(/\./g, '_');

                await setDoc(doc(db, 'pilot_roster', safeId), {
                    ...structuredData,
                    originalUid: userId,
                    firebaseUid: firebaseUser?.uid || null
                });
                console.log('✅ Roster entry created');
            } catch (error) {
                console.error("Error creating roster entry:", error);
                // Non-critical, allows signup to proceed
            }
        }

        console.log('🎉 Signup completed successfully for user:', userId);
    }

    async function login(email: string, password: string) {
        try {
            // Sign in with Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                console.error("Supabase login error:", error);
                throw new Error(error.message);
            }

            if (!data.user) {
                throw new Error("No user returned from Supabase");
            }

            console.log("User signed in via Supabase:", data.user.id);

            // Also sign in to Firebase to maintain compatibility
            try {
                await signInWithEmailAndPassword(auth, email, password);
            } catch (firebaseError) {
                console.log("Firebase sign-in (compatibility):", firebaseError);
                // Non-critical - Supabase is the primary auth
            }

            // Fetch user profile from Supabase
            try {
                console.log("Fetching user profile from Supabase for:", data.user.id);
                const { data: profileData, error: profileError } = await supabase
                    .from('pilot_licensure_experience')
                    .select('*')
                    .eq('user_id', data.user.id)
                    .single();

                if (profileError) {
                    console.log("Supabase profile fetch error:", profileError);
                }

                if (profileData) {
                    console.log("User profile found via Supabase");
                    setUserProfile(profileData);
                } else {
                    console.log("No user profile found in Supabase for:", data.user.id);
                    // Create minimal profile from auth data
                    const newProfile = {
                        uid: data.user.id,
                        email: email,
                        createdAt: data.user.created_at || new Date().toISOString(),
                        lastLogin: new Date().toISOString()
                    };
                    setUserProfile(newProfile);
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
        setExplicitLogout(true); // Set flag to prevent re-authentication
        try {
            console.log('🔴 Clearing all local state first...');
            // Clear all local state immediately to prevent any interference
            setCurrentUser(null);
            setUserProfile(null);
            console.log('✅ Local auth state cleared');

            console.log('🔴 Clearing IndexedDB session...');
            // Clear IndexedDB session
            await indexedDB.clearSession();
            console.log('✅ IndexedDB session cleared');

            console.log('🔴 Clearing localStorage...');
            // Clear localStorage items that might contain session data
            localStorage.removeItem('supabase.auth.token');
            localStorage.removeItem('supabase.auth.refreshToken');
            localStorage.removeItem('supabase.auth.codeVerifier');
            localStorage.removeItem('supabase.auth.pkceVerifier');
            // Clear all Supabase-related localStorage items
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('supabase.')) {
                    localStorage.removeItem(key);
                }
            });
            console.log('✅ localStorage cleared');

            console.log('🔴 Signing out from Supabase...');
            // Sign out from Supabase properly
            await supabase.auth.signOut().catch(err => {
                console.log('⚠️ Supabase signOut failed:', err);
            });
            console.log('✅ Supabase signOut completed');

            console.log('🔴 Signing out from Firebase...');
            // Also sign out from Firebase to prevent interference
            try {
                await signOut(auth);
                console.log('✅ Firebase signOut completed');
            } catch (firebaseError) {
                console.log('⚠️ Firebase signOut failed (non-critical):', firebaseError);
            }

            console.log('✅ Logout completed');
        } catch (error) {
            console.error("❌ Logout error:", error);
            // Even if there's an error, local state is already cleared
        }
    }

    function resetPassword(email: string) {
        return sendPasswordResetEmail(auth, email);
    }

    async function deleteAccount(userId: string) {
        console.log('🔴 deleteAccount called for user:', userId);
        try {
            // Call the delete-account Edge Function
            const { data, error } = await supabase.functions.invoke('delete-account', {
                body: { userId }
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
        // Clear Supabase session on app initialization to force fresh start
        const clearSupabaseSession = async () => {
            try {
                await supabase.auth.signOut();
                console.log('🔵 Supabase session cleared');
            } catch (error) {
                // Ignore error if no session exists
                console.log('🔵 No Supabase session to clear');
            }
        };

        clearSupabaseSession();

        // Session restoration disabled - cache clears on every refresh
        // const restoreSession = async () => {
        //     try {
        //         console.log('🔵 Attempting to restore session from IndexedDB...');
        //         const savedSession = await indexedDB.getSessionWithVerification(supabase);
        //         if (savedSession) {
        //             console.log("🔄 Restoring session from IndexedDB:", savedSession.user?.id);
        //             // Set the session in Supabase
        //             await supabase.auth.setSession({
        //                 access_token: savedSession.access_token,
        //                 refresh_token: savedSession.refresh_token,
        //             });
        //         } else {
        //             console.log('🔵 No saved session found in IndexedDB');
        //         }
        //     } catch (error) {
        //         console.error("❌ Error restoring session from IndexedDB:", error);
        //     }
        // };

        // restoreSession();

        // Firebase auth state listener
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                // Fetch user profile from Firebase
                try {
                    const docRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserProfile(docSnap.data());
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        // Supabase auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Supabase auth state changed:", event, "Supabase ID:", session?.user?.id, "Session:", session);

            // Prevent re-authentication after explicit logout
            if (explicitLogout && event === 'SIGNED_IN') {
                console.log("⚠️ Preventing re-authentication after explicit logout");
                setExplicitLogout(false); // Reset flag after preventing
                return;
            }

            if (session?.user) {
                console.log("✅ Supabase user authenticated:", session.user.id, session.user.email);

                // Session saving disabled - cache clears on every refresh
                // await indexedDB.saveSession(session);

                // Create a minimal User-like object for compatibility
                const supabaseUser = {
                    uid: session.user.id,
                    email: session.user.email || '',
                    emailVerified: session.user.email_confirmed_at ? true : false,
                    isAnonymous: false,
                    metadata: { creationTime: session.user.created_at, lastSignInTime: session.user.last_sign_in_at },
                    providerData: [],
                    refreshToken: session.refresh_token || '',
                    tenantId: null,
                    delete: async () => { },
                    getIdToken: async () => session.access_token || '',
                    getIdTokenResult: async () => ({}) as any,
                    reload: async () => { },
                    toJSON: () => ({ uid: session.user.id, email: session.user.email }),
                    displayName: session.user.user_metadata?.full_name || null,
                    phoneNumber: session.user.phone || null,
                    photoURL: session.user.user_metadata?.avatar_url || null,
                    providerId: 'supabase'
                } as unknown as User;

                setCurrentUser(supabaseUser);

                // Fetch profile from Supabase
                try {
                    const { data: profileData, error } = await supabase
                        .from('pilot_licensure_experience')
                        .select('*')
                        .eq('user_id', session.user.id)
                        .single();

                    if (profileData && !error) {
                        console.log("✅ Supabase profile fetched for user:", session.user.id);
                        setUserProfile(profileData);
                    } else {
                        console.log("⚠️ No Supabase profile found for user:", session.user.id, "Creating default profile");
                        // Create a default profile from Supabase auth data
                        const defaultProfile = {
                            user_id: session.user.id,
                            email: session.user.email,
                            created_at: session.user.created_at,
                            enrolled_programs: [],
                            appAccess: []
                        };
                        setUserProfile(defaultProfile);
                    }
                } catch (err) {
                    console.error("❌ Error fetching Supabase profile:", err);
                    // Create a default profile on error
                    const defaultProfile = {
                        user_id: session.user.id,
                        email: session.user.email,
                        created_at: session.user.created_at,
                        enrolled_programs: [],
                        appAccess: []
                    };
                    setUserProfile(defaultProfile);
                }
            } else if (event === 'SIGNED_OUT') {
                console.log("❌ Supabase user signed out");
                // Only clear if Firebase is also not signed in
                if (!auth.currentUser) {
                    setCurrentUser(null);
                    setUserProfile(null);
                }
            }
        });

        return () => {
    };
}, []);

const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    deleteAccount,
    resetPassword
};

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
