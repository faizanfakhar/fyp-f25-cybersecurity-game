import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBz0ReX8VIlt8flYQVibDbegXzsrzU-g_w",
  authDomain: "fyp-f25-cybersecurity-game.firebaseapp.com",
  projectId: "fyp-f25-cybersecurity-game",
  storageBucket: "fyp-f25-cybersecurity-game.firebasestorage.app",
  messagingSenderId: "812505030162",
  appId: "1:812505030162:web:144b091560d5fe61f682cb",
};

const app  = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

export { auth, db };
