// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app); 