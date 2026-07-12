// ============================================================
// src/pages/player/MissionsPage.jsx — All Missions Page
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";
import {
  Shield, Target, Trophy, MessageSquare, User,
  LayoutDashboard, LogOut, ChevronRight, Lock,
  Star, Clock, CheckCircle,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",   href: "/dashboard",   active: false },
  { icon: Target,          label: "Missions",    href: "/missions",    active: true  },
  { icon: Trophy,          label: "Leaderboard", href: "/leaderboard", active: false },
  { icon: MessageSquare,   label: "AI Chat",     href: "/ai-chat",     active: false },
  { icon: User,            label: "Profile",     href: "/profile",     active: false },
];

const MISSIONS = [
  {
    id: 1,
    title: "Phishing Email Detection",
    description: "Identify phishing emails in a realistic email inbox simulation. Learn to spot suspicious senders, urgent language, and malicious links.",
    sector: "Banking",
    difficulty: "Easy",
    points: 500,
    duration: "10 min",
    icon: "🎯",
    available: true,
    route: "/mission/phishing",
    skills: ["Email Analysis", "Link Inspection", "Sender Verification"],
  },
  {
    id: 2,
    title: "Fake Banking Portal",
    description: "Navigate a fraudulent banking website and identify the signs that distinguish it from a legitimate bank portal.",
    sector: "Banking",
    difficulty: "Medium",
    points: 800,
    duration: "15 min",
    icon: "🏦",
    available: false,
    route: "/mission/banking",
    skills: ["URL Analysis", "SSL Verification", "UI Spoofing Detection"],
  },
  {
    id: 3,
    title: "Corporate Network Breach",
    description: "Detect and respond to a corporate network intrusion. Identify suspicious network activity and take appropriate defensive actions.",
    sector: "Corporate",
    difficulty: "Medium",
    points: 800,
    duration: "20 min",
    icon: "🏢",
    available: false,
    route: "/mission/corporate",
    skills: ["Network Analysis", "Intrusion Detection", "Incident Response"],
  },
  {
    id: 4,
    title: "Ransomware Defense",
    description: "Stop a ransomware attack before it encrypts critical files. Make quick decisions to contain the threat and protect your organization.",
    sector: "Corporate",
    difficulty: "Hard",
    points: 1200,
    duration: "25 min",
    icon: "🔐",
    available: false,
    route: "/mission/ransomware",
    skills: ["Malware Analysis", "Backup Recovery", "Threat Containment"],
  },
  {
    id: 5,
    title: "Healthcare Data Breach",
    description: "Protect sensitive patient data from cybercriminals targeting healthcare systems. Identify vulnerabilities and secure critical medical data.",
    sector: "Healthcare",
    difficulty: "Hard",
    points: 1000,
    duration: "20 min",
    icon: "🏥",
    available: false,
    route: "/mission/healthcare",
    skills: ["Data Protection", "HIPAA Compliance", "Access Control"],
  },
  {
    id: 6,
    title: "Social Engineering Attack",
    description: "Recognize and counter social engineering manipulation tactics used by cybercriminals to gain unauthorized access.",
    sector: "General",
    difficulty: "Medium",
    points: 700,
    duration: "15 min",
    icon: "🎭",
    available: false,
    route: "/mission/social",
    skills: ["Psychological Awareness", "Verification Protocols", "Security Culture"],
  },
];

const DIFFICULTY_COLORS = {
  Easy:   "bg-green-500/10 text-green-400 border-green-500/30",
  Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  Hard:   "bg-red-500/10 text-red-400 border-red-500/30",
};

const SECTOR_COLORS = {
  Banking:    "bg-blue-500/10 text-blue-400",
  Corporate:  "bg-purple-500/10 text-purple-400",
  Healthcare: "bg-pink-500/10 text-pink-400",
  General:    "bg-cyan-500/10 text-cyan-400",
};

export default function MissionsPage() {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const [filter, setFilter] = useState("All");
  const [loggingOut, setLoggingOut] = useState(false);

  const displayName = userData?.displayName || user?.displayName || "Player";

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      setLoggingOut(false);
    }
  };

  const sectors = ["All", "Banking", "Corporate", "Healthcare", "General"];
  const filtered = filter === "All" ? MISSIONS : MISSIONS.filter(m => m.sector === filter);

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
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                       text-sm font-medium text-[#8B949E]
                       hover:text-red-400 hover:bg-red-500/5 transition-colors"
          >
            <LogOut size={18} />
            {loggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#161B22] border-b border-[#30363D] px-6 py-4 flex items-center">
          <div>
            <h1 className="text-white font-semibold">All Missions</h1>
            <p className="text-[#8B949E] text-xs mt-0.5">
              Complete missions to earn points and level up
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500/20 border border-cyan-500/30 rounded-full flex items-center justify-center">
              <span className="text-cyan-400 text-sm font-bold">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                <Target className="text-cyan-400" size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-lg">{MISSIONS.length}</p>
                <p className="text-[#8B949E] text-xs">Total Missions</p>
              </div>
            </div>
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-400" size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-lg">1</p>
                <p className="text-[#8B949E] text-xs">Available Now</p>
              </div>
            </div>
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Star className="text-yellow-400" size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-lg">5,200</p>
                <p className="text-[#8B949E] text-xs">Total Points</p>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {sectors.map((sector) => (
              <button
                key={sector}
                onClick={() => setFilter(sector)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                            ${filter === sector
                              ? "bg-cyan-500 text-black"
                              : "bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-white"
                            }`}
              >
                {sector}
              </button>
            ))}
          </div>

          {/* Missions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((mission) => (
              <div
                key={mission.id}
                className={`bg-[#161B22] border border-[#30363D] rounded-xl p-5
                            ${mission.available ? "hover:border-cyan-500/40" : "opacity-70"}
                            transition-colors duration-200`}
              >
                {/* Mission Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl w-12 h-12 bg-[#0D1117] rounded-xl flex items-center justify-center flex-shrink-0">
                    {mission.available ? mission.icon : "🔒"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold text-sm">{mission.title}</h3>
                      {mission.available && (
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/30">
                          Available
                        </span>
                      )}
                    </div>
                    <p className="text-[#8B949E] text-xs leading-relaxed">{mission.description}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${SECTOR_COLORS[mission.sector]}`}>
                    {mission.sector}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${DIFFICULTY_COLORS[mission.difficulty]}`}>
                    {mission.difficulty}
                  </span>
                  <span className="flex items-center gap-1 text-[#8B949E] text-xs">
                    <Clock size={11} />
                    {mission.duration}
                  </span>
                </div>

                {/* Skills */}
                <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                  {mission.skills.map((skill) => (
                    <span key={skill}
                      className="px-2 py-0.5 bg-[#0D1117] border border-[#30363D]
                                 text-[#8B949E] text-xs rounded">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-[#30363D]">
                  <span className="text-cyan-400 font-bold text-sm">+{mission.points} pts</span>
                  {mission.available ? (
                    <button
                      onClick={() => navigate(mission.route)}
                      className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold
                                 px-4 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1.5"
                    >
                      ▶ Start Mission
                    </button>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[#8B949E] text-sm">
                      <Lock size={14} /> Locked
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
