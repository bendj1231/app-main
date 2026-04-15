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
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Structure the user data
        const structuredData = {
            uid: user.uid,
            email,
            createdAt: new Date().toISOString(),
            pilotCategory: userData.pilotCategory, // Keep top-level for easy querying
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

        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), structuredData);

        // Sync to Supabase for portal app access
        try {
            const { error: supabaseError } = await supabase
                .from('pilot_licensure_experience')
                .upsert({
                    user_id: user.uid,
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

            if (supabaseError) {
                console.error('Supabase sync error:', supabaseError);
            } else {
                console.log('Pilot data synced to Supabase successfully');
            }
        } catch (syncError) {
            console.error('Error syncing to Supabase:', syncError);
            // Non-critical: Firebase user is still created
        }

        // Send email verification
        try {
            await sendEmailVerification(user);
            console.log("Verification email sent to:", email);
        } catch (emailError) {
            console.error("Error sending verification email:", emailError);
            // Non-critical: User is still created, they can resend later if we add that feature
        }

        // Create readable roster entry for admin view
        // Format: [Experience] Name , License, Hours (UID_SUFFIX)
        if (userData.pilotCategory) {
            try {
                const experienceLevel = structuredData.experienceLevel; // Use the calculated level
                const shortUid = user.uid.substring(0, 5);

                // Construct ID: [Level] Name , License , Hours (UID)
                // e.g. [High Timer] Benjamin Bowler , CPL , 3000hrs (AbCdE)
                const safeId = `[${experienceLevel}] ${userData.pilotCategory} (${shortUid})`
                    .replace(/\//g, '-')
                    .replace(/\./g, '_');

                await setDoc(doc(db, 'pilot_roster', safeId), {
                    ...structuredData,
                    originalUid: user.uid
                });
            } catch (error) {
                console.error("Error creating roster entry:", error);
                // Non-critical, allows signup to proceed
            }
        }
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
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                // Fetch user profile
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

        return unsubscribe;
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
