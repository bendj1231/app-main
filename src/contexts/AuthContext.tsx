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
            const result = await signInWithEmailAndPassword(auth, email, password);
            console.log("User signed in:", result.user.uid);

            // Fetch user profile on login
            try {
                console.log("Fetching user profile for:", result.user.uid);
                const docRef = doc(db, 'users', result.user.uid);

                // Add timeout for Firestore fetch
                const fetchPromise = getDoc(docRef);
                const timeoutPromise = new Promise<any>((_, reject) =>
                    setTimeout(() => reject(new Error('Profile fetch timed out')), 5000)
                );

                const docSnap = await Promise.race([fetchPromise, timeoutPromise]);

                if (docSnap && docSnap.exists()) {
                    console.log("User profile found via login");
                    setUserProfile(docSnap.data());
                } else {
                    console.log("No user profile found in Firestore for:", result.user.uid, "- Creating default profile");
                    const newProfile = {
                        uid: result.user.uid,
                        email: email,
                        createdAt: result.user.metadata.creationTime || new Date().toISOString(),
                        lastLogin: new Date().toISOString()
                    };
                    await setDoc(docRef, newProfile);
                    setUserProfile(newProfile);
                }
            } catch (firestoreError) {
                console.error("Error fetching user profile:", firestoreError);
                // Non-critical error, proceed
            }
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    }

    function logout() {
        return signOut(auth);
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
