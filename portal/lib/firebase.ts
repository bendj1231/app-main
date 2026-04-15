import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection as firestoreCollection, doc as firestoreDoc, query as firestoreQuery, where as firestoreWhere, getDocs as firestoreGetDocs, getDoc as firestoreGetDoc, addDoc as firestoreAddDoc, updateDoc as firestoreUpdateDoc, deleteDoc as firestoreDeleteDoc, setDoc as firestoreSetDoc, onSnapshot as firestoreOnSnapshot, orderBy as firestoreOrderBy, limit as firestoreLimit } from 'firebase/firestore';

// Create a mock Firestore instance for when db is null
const createMockFirestore = () => ({
  collection: (path: string) => ({
    id: path,
    path: path,
    parent: null,
    type: 'collection' as const,
    onSnapshot: () => () => {},
    getDocs: () => Promise.resolve({ docs: [] }),
    addDoc: () => Promise.resolve({ id: 'mock-id' })
  }),
  doc: (path: string) => ({
    id: path,
    path: path,
    parent: null,
    type: 'document' as const,
    onSnapshot: () => () => {},
    getDoc: () => Promise.resolve({ exists: false, data: () => ({}) }),
    setDoc: () => Promise.resolve(),
    updateDoc: () => Promise.resolve(),
    deleteDoc: () => Promise.resolve()
  })
});

// Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'wingmentor-ab3ad',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app;
let auth: any;
let db: any;

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
                              !firebaseConfig.apiKey.includes('DummyKey') &&
                              firebaseConfig.apiKey.length > 10;

    console.log('Credentials validation:', {
        hasApiKey: !!firebaseConfig.apiKey,
        hasProjectId: !!firebaseConfig.projectId,
        apiKeyLength: firebaseConfig.apiKey?.length,
        hasValidCredentials
    });

    if (!hasValidCredentials) {
        console.warn("⚠️ Firebase credentials missing or invalid. Using development mode.");
        console.log("To use real Firebase, update your .env file with valid credentials from Firebase Console.");
        
        // Use mock system for development
        auth = {
            onAuthStateChanged: (cb: any) => {
                setTimeout(() => cb({ 
                    uid: 'dev-super-admin', 
                    email: 'benjamintigerbowler@gmail.com',
                    displayName: 'Benjamin Bowler',
                    emailVerified: true,
                    isAnonymous: false,
                    metadata: {},
                    providerData: [],
                    refreshToken: 'mock-refresh-token',
                    tenantId: null
                }), 50);
                return () => {};
            }, 
            signOut: () => Promise.resolve(),
            currentUser: { 
                uid: 'dev-super-admin', 
                email: 'benjamintigerbowler@gmail.com',
                displayName: 'Benjamin Bowler',
                emailVerified: true,
                isAnonymous: false,
                metadata: {},
                providerData: [],
                refreshToken: 'mock-refresh-token',
                tenantId: null
            },
            _getRecaptchaConfig: () => ({
                siteKey: 'mock-site-key',
                size: 'normal',
                isProviderEnabled: (provider: string) => true
            }),
            signInWithEmailAndPassword: (email: string, _password: string) => {
                console.log("Mock sign in:", email);
                return Promise.resolve({
                    user: {
                        uid: 'new-user-' + Date.now(),
                        email: email,
                        displayName: email.split('@')[0],
                        emailVerified: false,
                        isAnonymous: false,
                        metadata: {},
                        providerData: [],
                        refreshToken: 'mock-refresh-token',
                        tenantId: null
                    },
                    credential: null,
                    operationType: 'signIn'
                });
            },
            createUserWithEmailAndPassword: (email: string, _password: string) => {
                console.log("Mock create user:", email);
                return Promise.resolve({
                    user: {
                        uid: 'new-user-' + Date.now(),
                        email: email,
                        displayName: email.split('@')[0],
                        emailVerified: false,
                        isAnonymous: false,
                        metadata: {},
                        providerData: [],
                        refreshToken: 'mock-refresh-token',
                        tenantId: null
                    },
                    credential: null,
                    operationType: 'signIn'
                });
            }
        };
        db = createMockFirestore();
        
    } else {
        // Use real Firebase
        console.log("🔥 Connecting to real Firebase with project:", firebaseConfig.projectId);
        
        app = getApps().length ? getApp() : initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        
        console.log("✅ Firebase initialized successfully");
    }
    
} catch (error) {
    console.error("❌ Firebase initialization failed:", error);
    console.log("📝 To fix this, get valid Firebase credentials from Firebase Console");
    
    // Fallback to mock system
    auth = {
        onAuthStateChanged: (cb: any) => {
            setTimeout(() => cb({ 
                uid: 'fallback-user', 
                email: 'benjamintigerbowler@gmail.com',
                displayName: 'Benjamin Bowler',
                emailVerified: true,
                isAnonymous: false,
                metadata: {},
                providerData: [],
                refreshToken: 'mock-refresh-token',
                tenantId: null
            }), 100);
            return () => {};
        }, 
        signOut: () => Promise.resolve(),
        currentUser: { uid: 'fallback-user', email: 'benjamintigerbowler@gmail.com' },
        _getRecaptchaConfig: () => ({
            siteKey: 'mock-site-key',
            size: 'normal',
            isProviderEnabled: (provider: string) => true
        }),
        signInWithEmailAndPassword: (_email: string, _password: string) => {
            return Promise.resolve({
                user: {
                    uid: 'fallback-user',
                    email: _email,
                    displayName: 'Benjamin Bowler',
                    emailVerified: true,
                    isAnonymous: false,
                    metadata: {},
                    providerData: [],
                    refreshToken: 'mock-refresh-token',
                    tenantId: null
                },
                credential: null,
                operationType: 'signIn'
            });
        }
    };
    db = createMockFirestore();
}

export { auth, db };
