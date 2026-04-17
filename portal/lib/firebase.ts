import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase (optional - app can function with Supabase only)
let app;
let auth: any = null;
let db: any = null;

// Disable Firebase in portal context since it uses Supabase for authentication
const isPortalContext = typeof window !== 'undefined' && window.location.pathname.includes('/portal');

if (!isPortalContext) {
    try {
        // Debug: Log the Firebase config
        console.log('Firebase Config:', {
            apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'missing',
            projectId: firebaseConfig.projectId,
            authDomain: firebaseConfig.authDomain
        });

        // Check if we have valid Firebase credentials
        const hasValidCredentials = firebaseConfig.apiKey && 
                                  firebaseConfig.projectId &&
                                  firebaseConfig.apiKey.length > 10;

        if (!hasValidCredentials) {
            console.warn('⚠️ Firebase credentials are missing or invalid. Firebase features will be disabled.');
            throw new Error('Firebase credentials are missing or invalid.');
        }

        // Use real Firebase
        console.log("🔥 Connecting to real Firebase with project:", firebaseConfig.projectId);
        
        app = getApps().length ? getApp() : initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        
        console.log("✅ Firebase initialized successfully");
        
    } catch (error) {
        console.warn("⚠️ Firebase initialization failed or skipped:", error);
        console.warn("⚠️ App will continue with Supabase authentication only. Firebase features will be disabled.");
        // Don't throw - let the app continue with Supabase
    }
} else {
    console.log("⚠️ Firebase disabled in portal context (using Supabase for authentication)");
}

export { auth, db };
