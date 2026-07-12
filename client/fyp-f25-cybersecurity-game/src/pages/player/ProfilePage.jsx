// ============================================================
// src/pages/player/ProfilePage.jsx — Profile Page
// ============================================================

import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";
import {
  Shield, Target, Trophy, MessageSquare, User,
  LayoutDashboard, LogOut, ChevronRight, Star,
  Zap, TrendingUp, CheckCircle,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",   href: "/dashboard",   active: false },
  { icon: Target,          label: "Missions",    href: "/missions",    active: false },
  { icon: Trophy,          label: "Leaderboard", href: "/leaderboard", active: false },
  { icon: MessageSquare,   label: "AI Chat",     href: "/ai-chat",     active: false },
  { icon: User,            label: "Profile",     href: "/profile",     active: true  },
];

const ACHIEVEMENTS = [
  { icon: "🎯", title: "First Mission",     desc: "Completed your first mission",    earned: true  },
  { icon: "🔥", title: "On Fire",           desc: "Complete 3 missions in a row",    earned: false },
  { icon: "🛡️", title: "Cyber Defender",    desc: "Score over 1000 points",          earned: false },
  { icon: "🏆", title: "Top Player",        desc: "Reach the top 10 leaderboard",    earned: false },
  { icon: "⚡", title: "Speed Runner",      desc: "Complete a mission under 2 mins", earned: false },
  { icon: "🎓", title: "Phishing Expert",   desc: "Get 100% on phishing mission",    earned: false },
];

export default function ProfilePage() {
  const navigate   = useNavigate();
  const { user, userData } = useAuth();

  const displayName       = userData?.displayName || user?.displayName || "Player";
  const email             = userData?.email        || user?.email       || "";
  const level             = userData?.level             ?? 1;
  const totalScore        = userData?.totalScore        ?? 0;
  const missionsCompleted = userData?.missionsCompleted ?? 0;
  const xpProgress        = totalScore % 1000;

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0D1117] flex">

      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#161B22] border-r border-[#30363D] flex-col">
        <div className="p-6 border-b border-[#30363D]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-center">
              <Shield className="text-cyan-400" size={20} />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">CyberGame</p>
              <p className="text-[#8B949E] text-xs mt-0.5">Training Platform</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.href)}
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

        <div className="p-4 border-t border-[#30363D]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                       text-sm font-medium text-[#8B949E]
                       hover:text-red-400 hover:bg-red-500/5 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-y-auto">

        <header className="sticky top-0 z-40 bg-[#161B22] border-b border-[#30363D] px-6 py-4">
          <h1 className="text-white font-semibold">My Profile</h1>
          <p className="text-[#8B949E] text-xs mt-0.5">Your cybersecurity training progress</p>
        </header>

        <main className="flex-1 p-6 space-y-6">

          {/* Profile Card */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-cyan-500/15 border-2 border-cyan-500/50
                              rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 text-3xl font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-white text-xl font-bold">{displayName}</h2>
                <p className="text-[#8B949E] text-sm mt-1">{email}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30
                                   rounded-full text-purple-400 text-xs font-semibold">
                    ⚡ Level {level} Cyber Defender
                  </span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30
                                   rounded-full text-cyan-400 text-xs font-semibold">
                    🎯 {missionsCompleted} Missions
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#8B949E] text-xs font-medium uppercase tracking-wider">Total Score</p>
                <Star className="text-yellow-400" size={16} />
              </div>
              <p className="text-3xl font-bold text-white">{totalScore.toLocaleString()}</p>
              <p className="text-[#8B949E] text-xs mt-2 flex items-center gap-1">
                <TrendingUp size={12} className="text-green-400" />
                <span className="text-green-400">Top 15% of players</span>
              </p>
            </div>

            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#8B949E] text-xs font-medium uppercase tracking-wider">Current Level</p>
                <Zap className="text-purple-400" size={16} />
              </div>
              <p className="text-3xl font-bold text-white">{level}</p>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-[#8B949E] mb-1">
                  <span>XP Progress</span>
                  <span>{xpProgress} / 1000</span>
                </div>
                <div className="h-1.5 bg-[#30363D] rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${xpProgress / 10}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#8B949E] text-xs font-medium uppercase tracking-wider">Missions Done</p>
                <Target className="text-cyan-400" size={16} />
              </div>
              <p className="text-3xl font-bold text-white">{missionsCompleted}</p>
              <p className="text-[#8B949E] text-xs mt-2">out of 6 total missions</p>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#30363D]">
              <h2 className="text-white font-semibold">Achievements</h2>
              <p className="text-[#8B949E] text-xs mt-0.5">
                {ACHIEVEMENTS.filter(a => a.earned).length} of {ACHIEVEMENTS.length} earned
              </p>
            </div>
            <div className="divide-y divide-[#30363D]">
              {ACHIEVEMENTS.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-4 px-6 py-4
                              ${!item.earned ? "opacity-40" : ""}`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-[#E6EDF3] text-sm font-medium">{item.title}</p>
                    <p className="text-[#8B949E] text-xs mt-0.5">{item.desc}</p>
                  </div>
                  {item.earned && <CheckCircle className="text-green-400" size={18} />}
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
