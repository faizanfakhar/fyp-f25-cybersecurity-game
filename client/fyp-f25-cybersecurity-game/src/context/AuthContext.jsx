// ============================================================
// AuthContext.jsx — Poori app ka auth state yahan manage hota hai
// useAuth() hook se kisi bhi component mein user aur role milta hai
// ============================================================

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);   // Firebase user object
  const [role, setRole]       = useState(null);   // "player" ya "admin"
  const [userData, setUserData] = useState(null); // Firestore se poora user doc
  const [loading, setLoading] = useState(true);   // Pehli baar load ho raha hai?

  useEffect(() => {
    // Firebase ki built-in listener — login/logout automatically detect karta hai
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Firestore se is user ka document uthao
          const docRef  = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setRole(data.role);       // "player" ya "admin"
            setUserData(data);        // Score, level, sab kuch
          }
          setUser(firebaseUser);
        } catch (error) {
          console.error("Firestore read error:", error);
          setUser(firebaseUser);
        }
      } else {
        // Logout ho gaya — sab clear karo
        setUser(null);
        setRole(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Component unmount hone par listener hatao
  }, []);

  const value = { user, role, userData, loading };

  // loading true hai tab tak koi bhi page render mat karo
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook — har jagah se easily use kar sako
export const useAuth = () => useContext(AuthContext);
