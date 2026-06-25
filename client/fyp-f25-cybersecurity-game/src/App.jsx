// ============================================================
// App.jsx — Saari routes yahan define hain
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AdminRoute }     from "./routes/AdminRoute";

import LoginPage         from "./pages/auth/LoginPage";
import RegisterPage      from "./pages/auth/RegisterPage";
import PlayerDashboard   from "./pages/player/PlayerDashboard";
import AdminDashboard    from "./pages/admin/AdminDashboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default route — seedha login pe */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route path="/login"    element={<LoginPage />}    />
          <Route path="/register" element={<RegisterPage />} />

          {/* Player protected route */}
          <Route path="/dashboard" element={
            <ProtectedRoute><PlayerDashboard /></ProtectedRoute>
          } />

          {/* Admin only route */}
          <Route path="/admin" element={
            <AdminRoute><AdminDashboard /></AdminRoute>
          } />

          {/* Koi bhi aur URL — login pe bhejo */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
