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

interface AuthContextType {
    currentUser: User | null;
    userProfile: any | null;
    loading: boolean;
    signup: (email: string, password: string, userData: any) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
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

    async function signup(email: string, password: string, userData: any) {
        let userId: string;
        let firebaseUser: any = null;

        // Step 1: Create Supabase auth user first (preferred)
        try {
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
                console.error('Supabase auth error:', supabaseError);
                throw new Error(`Supabase auth failed: ${supabaseError.message}`);
            }

            if (!supabaseData.user) {
                throw new Error('No user returned from Supabase auth');
            }

            userId = supabaseData.user.id;
            console.log('✅ Supabase auth user created:', userId);
        } catch (supabaseError) {
            console.error('Failed to create Supabase auth user:', supabaseError);
            throw supabaseError;
        }

        // Step 2: Create portal profile in profiles table
        try {
            const experienceLevel = (() => {
                const hours = parseInt(userData.currentFlightHours || '0', 10);
                if (hours < 500) return 'Low Timer';
                if (hours < 1500) return 'Middle Timer';
                return 'High Timer';
            })();

            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: userId,
                    email: email,
                    display_name: userData.fullName || email.split('@')[0],
                    full_name: userData.fullName,
                    phone: userData.contactNumber,
                    country: userData.residingCountry,
                    date_of_birth: userData.dob,
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
                    insight_interests: userData.insightInterests
                });

            if (profileError) {
                console.error('Portal profile creation error:', profileError);
                throw new Error(`Failed to create portal profile: ${profileError.message}`);
            }

            console.log('✅ Portal profile created:', userId);
        } catch (profileError) {
            console.error('Failed to create portal profile:', profileError);
            throw profileError;
        }

        // Step 3: Create app access records
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
                console.error('App access creation error:', accessError);
                throw new Error(`Failed to create app access: ${accessError.message}`);
            }

            console.log('✅ App access records created:', userId);
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
                    date_of_birth: userData.dob,
                    nationality: userData.nationality,
                    residing_country: userData.residingCountry,
                    flight_school_address: userData.flightSchoolAddress,
                    contact_number: userData.contactNumber,
                    license_number: userData.licenseId,
                    country_of_license: userData.countryOfLicense,
                    current_flight_hours: userData.currentFlightHours,
                    aircraft_ratings: userData.aircraftRatedOn ? [{ type: userData.aircraftRatedOn }] : [],
                    experience_description: userData.experienceDescription,
                    ratings: userData.ratings || [],
                    aviation_pathways_interests: userData.pathwayInterests || [],
                    pilot_job_positions_interests: userData.insightInterests || [],
                    program_interests: userData.programInterests || [],
                    insight_interests: userData.insightInterests || [],
                    current_license: userData.ratings || [],
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

        // Step 8: Send email verification via Supabase
        try {
            await supabase.auth.resend({
                type: 'signup',
                email: email
            });
            console.log("✅ Verification email sent via Supabase to:", email);
        } catch (emailError) {
            console.error("Error sending verification email:", emailError);
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
        // Sign out from Supabase
        await supabase.auth.signOut();
        // Sign out from Firebase
        await signOut(auth);
    }

    function resetPassword(email: string) {
        return sendPasswordResetEmail(auth, email);
    }

    useEffect(() => {
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
            console.log("Supabase auth state changed:", event, session?.user?.id);

            if (session?.user) {
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
                        setUserProfile(profileData);
                    }
                } catch (err) {
                    console.error("Error fetching Supabase profile:", err);
                }
            } else if (event === 'SIGNED_OUT') {
                // Only clear if Firebase is also not signed in
                if (!auth.currentUser) {
                    setCurrentUser(null);
                    setUserProfile(null);
                }
            }
        });

        return () => {
            unsubscribe();
            subscription.unsubscribe();
        };
    }, []);

    const value = {
        currentUser,
        userProfile,
        loading,
        signup,
        login,
        logout,
        resetPassword
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
