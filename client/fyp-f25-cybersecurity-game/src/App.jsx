import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider }   from "./context/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AdminRoute }     from "./routes/AdminRoute";

import LoginPage        from "./pages/auth/LoginPage";
import RegisterPage     from "./pages/auth/RegisterPage";
import PlayerDashboard  from "./pages/player/PlayerDashboard";
import AdminDashboard   from "./pages/admin/AdminDashboard";
import BankingMission  from "./game/scenes/BankingMission";
import PhishingMission  from "./game/scenes/PhishingMission";
import MissionsPage     from "./pages/player/MissionsPage";
import LeaderboardPage  from "./pages/player/LeaderboardPage";
import ProfilePage      from "./pages/player/ProfilePage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"            element={<Navigate to="/login" replace />} />
          <Route path="/login"       element={<LoginPage />} />
          <Route path="/register"    element={<RegisterPage />} />
          <Route path="/dashboard"   element={<ProtectedRoute><PlayerDashboard /></ProtectedRoute>} />
          <Route path="/missions"    element={<ProtectedRoute><MissionsPage /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
          <Route path="/profile"     element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/mission/banking"  element={<ProtectedRoute><BankingMission /></ProtectedRoute>} />
          <Route path="/mission/phishing" element={<ProtectedRoute><PhishingMission /></ProtectedRoute>} />
          <Route path="/admin"       element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="*"            element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
