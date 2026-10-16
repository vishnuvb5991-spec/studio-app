import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA-UlBQ6gl_tYj_Dn3GYLWCinqYNFR_2JM",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "balan-studios.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "balan-studios",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "balan-studios.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "613645344103",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:613645344103:web:5cf2ad544e01d49e20e3c2",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-P6EFWX97E3"
};

// Initialize Firebase safely (avoid duplicate initialization)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { signInWithPopup, signOut };
export default app;
