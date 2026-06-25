// ============================================================
// ProtectedRoute.jsx — Login check karta hai
// Agar user logged in nahi toh /login pe bhej deta hai
// ============================================================

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}
