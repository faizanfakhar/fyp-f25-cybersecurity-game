// ============================================================
// firebase.js — Firebase ko initialize karo
// Yeh file poori app mein import hogi
// ============================================================
 
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
 
// .env file se values aati hain — kabhi hardcode mat karo
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};
 
const app  = initializeApp(firebaseConfig);
 
export const auth = getAuth(app);      // Authentication ke liye
export const db   = getFirestore(app); // Database ke liye
export default app;