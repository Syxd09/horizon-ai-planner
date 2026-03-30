import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0fJl1y3kqNyY4HgUJG2M1TeSql1hXAQk",
  authDomain: "horizon-ai-f1889.firebaseapp.com",
  projectId: "horizon-ai-f1889",
  storageBucket: "horizon-ai-f1889.firebasestorage.app",
  messagingSenderId: "233083349940",
  appId: "1:233083349940:web:202fd7e8dc80407dcae0e1",
  measurementId: "G-2M0BPDE4GR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Analytics is only available in browser
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
