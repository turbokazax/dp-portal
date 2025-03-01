// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // import getDatabase

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABOrccOhx8q1flpOGLoQ86UenzJrsik94",
  authDomain: "dp2-portal.firebaseapp.com",
  projectId: "dp2-portal",
  storageBucket: "dp2-portal.firebasestorage.app",
  messagingSenderId: "916903710173",
  appId: "1:916903710173:web:30d4fff61a035eefcaba34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app); // add this line to export the database instance
