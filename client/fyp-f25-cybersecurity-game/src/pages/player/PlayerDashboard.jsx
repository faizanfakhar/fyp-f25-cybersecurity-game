// ============================================================
// PlayerDashboard.jsx — Player's main dashboard
// Real data comes from Firestore via useAuth() hook
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";
import {
  Shield, Target, Trophy, MessageSquare, User,
  LayoutDashboard, LogOut, Star, Zap, Lock,
  ChevronRight, Bell, TrendingUp,
} from "lucide-react";

// ─── Sidebar navigation items ────────────────────────────────
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",   href: "/dashboard",   active: true  },
  { icon: Target,          label: "Missions",    href: "/missions",    active: false },
  { icon: Trophy,          label: "Leaderboard", href: "/leaderboard", active: false },
  { icon: MessageSquare,   label: "AI Chat",     href: "/ai-chat",     active: false },
  { icon: User,            label: "Profile",     href: "/profile",     active: false },
];

// ─── Sample missions data (will come from Firestore later) ───
const MISSIONS = [
  {
    id: 1,
    title: "Phishing Attack Scenario",
    sector: "Banking",
    difficulty: "Medium",
    points: 500,
    icon: "🎯",
    available: true,
  },
  {
    id: 2,
    title: "Corporate Network Breach",
    sector: "Corporate",
    difficulty: "Hard",
    points: 800,
    icon: "🏢",
    available: false,
  },
  {
    id: 3,
    title: "Healthcare Data Theft",
    sector: "Healthcare",
    difficulty: "Hard",
    points: 1000,
    icon: "🏥",
    available: false,
  },
];

// ─── Recent activity (will come from Firestore later) ────────
const RECENT_ACTIVITY = [
  { action: "Mission Completed", detail: "Phishing Basics",   time: "2 hours ago", icon: "✅" },
  { action: "Achievement Earned", detail: "First Login Badge", time: "1 day ago",   icon: "🏆" },
  { action: "Level Up!",          detail: "Level 1 → Level 2", time: "2 days ago",  icon: "⬆️" },
];

export default function PlayerDashboard() {
  const navigate            = useNavigate();
  const { user, userData }  = useAuth();
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [loggingOut,   setLoggingOut]   = useState(false);

  // Real data with fallback values
  const displayName       = userData?.displayName || user?.displayName || "Player";
  const level             = userData?.level             ?? 1;
  const totalScore        = userData?.totalScore        ?? 0;
  const missionsCompleted = userData?.missionsCompleted ?? 0;

  // ─── Logout handler ─────────────────────────────────────────
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      setLoggingOut(false);
    }
  };

  // ─── UI ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0D1117] flex">

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#161B22] border-r border-[#30363D]
        flex flex-col transform transition-transform duration-300
        lg:relative lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Brand */}
        <div className="p-6 border-b border-[#30363D]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-cyan-500/10 border border-cyan-500/30
                            rounded-lg flex items-center justify-center">
              <Shield className="text-cyan-400" size={20} />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">CyberGame</p>
              <p className="text-[#8B949E] text-xs mt-0.5">Training Platform</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => item.href !== "#" && navigate(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                          text-sm font-medium transition-colors duration-200
                          ${item.active
                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                            : "text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#0D1117]"
                          }`}
            >
              <item.icon size={18} />
              {item.label}
              {item.active && <ChevronRight className="ml-auto" size={16} />}
            </button>
          ))}
        </nav>

        {/* Logout at bottom */}
        <div className="p-4 border-t border-[#30363D]">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                       text-sm font-medium text-[#8B949E]
                       hover:text-red-400 hover:bg-red-500/5
                       transition-colors duration-200"
          >
            <LogOut size={18} />
            {loggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* NAVBAR */}
        <header className="sticky top-0 z-40 bg-[#161B22] border-b border-[#30363D]
                           px-6 py-4 flex items-center gap-4">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-[#8B949E] hover:text-white"
          >
            ☰
          </button>

          <div className="flex-1" />

          {/* Level Badge */}
          <div className="flex items-center gap-1.5 bg-purple-500/10 border
                          border-purple-500/30 rounded-full px-3 py-1">
            <Zap className="text-purple-400" size={14} />
            <span className="text-purple-400 text-xs font-semibold">
              Level {level}
            </span>
          </div>

          {/* Score Badge */}
          <div className="flex items-center gap-1.5 bg-yellow-500/10 border
                          border-yellow-500/30 rounded-full px-3 py-1">
            <Star className="text-yellow-400" size={14} />
            <span className="text-yellow-400 text-xs font-semibold">
              {totalScore.toLocaleString()} pts
            </span>
          </div>

          {/* Notification bell */}
          <button className="text-[#8B949E] hover:text-white transition-colors">
            <Bell size={20} />
          </button>

          {/* Avatar */}
          <div className="w-8 h-8 bg-cyan-500/20 border border-cyan-500/30
                          rounded-full flex items-center justify-center">
            <span className="text-cyan-400 text-sm font-bold">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">

          {/* Welcome Header */}
          <div>
            <h1 className="text-xl font-bold text-white">
              Welcome back, {displayName.split(" ")[0]}! 👋
            </h1>
            <p className="text-[#8B949E] text-sm mt-0.5">
              Continue your training — complete a mission today.
            </p>
          </div>

          {/* ── Stats Cards ─────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Level Card */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#8B949E] text-xs font-medium uppercase tracking-wider">
                  Current Level
                </p>
                <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex
                                items-center justify-center">
                  <Zap className="text-purple-400" size={16} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{level}</p>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-[#8B949E] mb-1">
                  <span>XP Progress</span>
                  <span>{totalScore % 1000} / 1000</span>
                </div>
                <div className="h-1.5 bg-[#30363D] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all"
                    style={{ width: `${(totalScore % 1000) / 10}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Score Card */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#8B949E] text-xs font-medium uppercase tracking-wider">
                  Total Score
                </p>
                <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex
                                items-center justify-center">
                  <Star className="text-yellow-400" size={16} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">
                {totalScore.toLocaleString()}
              </p>
              <p className="text-[#8B949E] text-xs mt-2 flex items-center gap-1">
                <TrendingUp size={12} />
                You are in the top 15% of players
              </p>
            </div>

            {/* Missions Card */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#8B949E] text-xs font-medium uppercase tracking-wider">
                  Missions Completed
                </p>
                <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex
                                items-center justify-center">
                  <Target className="text-cyan-400" size={16} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{missionsCompleted}</p>
              <p className="text-[#8B949E] text-xs mt-2">
                3 missions available
              </p>
            </div>

          </div>

          {/* ── Missions Section ─────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Available Missions</h2>
              <button className="text-cyan-400 text-sm hover:text-cyan-300
                                 transition-colors">
                View All →
              </button>
            </div>

            <div className="space-y-3">
              {MISSIONS.map((mission) => (
                <div
                  key={mission.id}
                  className={`bg-[#161B22] border rounded-xl p-4
                              flex items-center gap-4
                              ${mission.available
                                ? "border-[#30363D] hover:border-cyan-500/40 cursor-pointer"
                                : "border-[#30363D] opacity-60 cursor-not-allowed"
                              } transition-colors duration-200`}
                >
                  {/* Mission Icon */}
                  <div className="text-2xl w-12 h-12 bg-[#0D1117] rounded-xl
                                  flex items-center justify-center flex-shrink-0">
                    {mission.available ? mission.icon : "🔒"}
                  </div>

                  {/* Mission Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[#E6EDF3] font-medium text-sm">
                      {mission.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[#8B949E] text-xs">
                        Sector: {mission.sector}
                      </span>
                      <span className="text-[#30363D]">•</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full
                        ${mission.difficulty === "Medium"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-red-500/10 text-red-400"
                        }`}>
                        {mission.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Points + Button */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-cyan-400 text-sm font-semibold">
                      +{mission.points} pts
                    </p>
                    {mission.available ? (
                      <button onClick={() => navigate("/mission/phishing")}
        className="mt-1 bg-cyan-500 hover:bg-cyan-400
                                         text-black text-xs font-semibold
                                         px-3 py-1 rounded-lg transition-colors">
                        ▶ Start
                      </button>
                    ) : (
                      <span className="mt-1 flex items-center gap-1
                                       text-[#8B949E] text-xs">
                        <Lock size={12} /> Locked
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Recent Activity ──────────────────────────────── */}
          <div>
            <h2 className="text-white font-semibold mb-4">Recent Activity</h2>
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl
                            divide-y divide-[#30363D]">
              {RECENT_ACTIVITY.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4">
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-[#E6EDF3] text-sm font-medium">
                      {item.action}
                    </p>
                    <p className="text-[#8B949E] text-xs">{item.detail}</p>
                  </div>
                  <p className="text-[#8B949E] text-xs">{item.time}</p>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
