import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  connectAuthEmulator,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvWiDPEKGRiGzf6O7uXjUGyfQc2FElJjo",
  authDomain: "chat-app-93569.firebaseapp.com",
  projectId: "chat-app-93569",
  storageBucket: "chat-app-93569.appspot.com",
  messagingSenderId: "1098251682084",
  appId: "1:1098251682084:web:151f35837236c0dd6833b1",
  measurementId: "G-E5F053TLDP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// connectAuthEmulator
connectAuthEmulator(auth, "http://127.0.0.1:9099");

if (window.location.hostname === "localhost") {
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}
export { analytics, db, auth, googleProvider, app };
