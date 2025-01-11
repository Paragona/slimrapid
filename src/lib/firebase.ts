"use client"

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2_T0xj0nwr8Hqcj7DMQDP0ivbCCpTGVw",
  authDomain: "carbon-sunup-443223-k4.firebaseapp.com",
  projectId: "carbon-sunup-443223-k4",
  storageBucket: "carbon-sunup-443223-k4.firebasestorage.app",
  messagingSenderId: "171789885264",
  appId: "1:171789885264:web:b0ad69fec81e1ff2245655",
  measurementId: "G-CKDGFR9DKM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only on client side
const getFirebaseAnalytics = async () => {
  if (typeof window !== 'undefined') {
    const { getAnalytics } = await import('firebase/analytics');
    return getAnalytics(app);
  }
  return null;
};

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, getFirebaseAnalytics };
export default app;
