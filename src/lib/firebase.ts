import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAUO3L3fIrQFTLGEkgkeul38PwVwtV6EQc",
    authDomain: "wingmentor-ab3ad.firebaseapp.com",
    projectId: "wingmentor-ab3ad",
    storageBucket: "wingmentor-ab3ad.firebasestorage.app",
    messagingSenderId: "440657994354",
    appId: "1:440657994354:web:1e6347ea0e643749ef18eb",
    measurementId: "G-ZMFLVNW8BS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
