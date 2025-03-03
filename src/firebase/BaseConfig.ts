import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const  app  =  initializeApp({
 apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
 authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
 projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
 storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
 messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGE_SENDER_ID,
 appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

export const firebaseAuth = getAuth(app);
// Initialize Firestore
export const firebaseFirestore = getFirestore(app);
export default app;