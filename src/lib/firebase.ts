// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDp2CeD3PqgV2KIX7iiC-_R10U-cWKycOY",
  authDomain: "verikind-51173.firebaseapp.com",
  projectId: "verikind-51173",
  storageBucket: "verikind-51173.firebasestorage.app",
  messagingSenderId: "970076936026",
  appId: "1:970076936026:web:680f965aa123c2486d4563",
  measurementId: "G-ZVG7VK7V5F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Database so the rest of your app can use them
export const auth = getAuth(app);
export const db = getFirestore(app);
