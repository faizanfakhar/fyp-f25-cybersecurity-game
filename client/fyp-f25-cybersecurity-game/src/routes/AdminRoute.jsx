// ============================================================
// AdminRoute.jsx — Admin role check karta hai
// Player agar /admin pe jaane ki koshish kare toh /dashboard pe
// ============================================================

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function AdminRoute({ children }) {
  const { user, role } = useAuth();

  if (!user)            return <Navigate to="/login"     replace />;
  if (role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}
