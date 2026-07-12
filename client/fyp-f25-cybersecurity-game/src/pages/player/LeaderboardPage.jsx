// ============================================================
// src/pages/player/LeaderboardPage.jsx — Leaderboard Page
// ============================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";
import {
  Shield, Target, Trophy, MessageSquare, User,
  LayoutDashboard, LogOut, ChevronRight, TrendingUp,
  RefreshCw,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",   href: "/dashboard",   active: false },
  { icon: Target,          label: "Missions",    href: "/missions",    active: false },
  { icon: Trophy,          label: "Leaderboard", href: "/leaderboard", active: true  },
  { icon: MessageSquare,   label: "AI Chat",     href: "/ai-chat",     active: false },
  { icon: User,            label: "Profile",     href: "/profile",     active: false },
];

const RANK_COLORS = {
  1: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400", medal: "🥇" },
  2: { bg: "bg-gray-500/10",   border: "border-gray-500/30",   text: "text-gray-400",   medal: "🥈" },
  3: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", medal: "🥉" },
};

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const [players, setPlayers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const displayName = userData?.displayName || user?.displayName || "Player";

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const q = query(collection(db, "users"), orderBy("totalScore", "desc"), limit(20));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc, idx) => ({
          rank: idx + 1,
          ...doc.data(),
        }));
        setPlayers(data);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      setLoggingOut(false);
    }
  };

  const myRank = players.findIndex(p => p.uid === user?.uid) + 1;

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

      {/* Main */}
      <div className="flex-1 flex flex-col">

        <header className="sticky top-0 z-40 bg-[#161B22] border-b border-[#30363D] px-6 py-4 flex items-center">
          <div>
            <h1 className="text-white font-semibold">🏆 Leaderboard</h1>
            <p className="text-[#8B949E] text-xs mt-0.5">Top cybersecurity defenders</p>
          </div>
          {myRank > 0 && (
            <div className="ml-auto flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-3 py-1">
              <TrendingUp className="text-cyan-400" size={14} />
              <span className="text-cyan-400 text-xs font-semibold">Your Rank: #{myRank}</span>
            </div>
          )}
        </header>

        <main className="flex-1 p-6">

          {/* Top 3 Podium */}
          {players.length >= 3 && (
            <div className="flex items-end justify-center gap-4 mb-8">
              {/* 2nd */}
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-500/20 border-2 border-gray-400 rounded-full
                                flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-lg">
                    {players[1]?.displayName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="text-[#E6EDF3] text-xs font-medium mb-1">
                  {players[1]?.displayName?.split(" ")[0]}
                </p>
                <div className="bg-gray-500/20 border border-gray-500/30 rounded-t-lg
                                w-20 h-16 flex items-center justify-center">
                  <span className="text-2xl">🥈</span>
                </div>
              </div>

              {/* 1st */}
              <div className="text-center">
                <div className="text-2xl mb-1">👑</div>
                <div className="w-14 h-14 bg-yellow-500/20 border-2 border-yellow-400 rounded-full
                                flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-xl">
                    {players[0]?.displayName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="text-[#E6EDF3] text-xs font-medium mb-1">
                  {players[0]?.displayName?.split(" ")[0]}
                </p>
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-t-lg
                                w-20 h-24 flex items-center justify-center">
                  <span className="text-2xl">🥇</span>
                </div>
              </div>

              {/* 3rd */}
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500/20 border-2 border-orange-400 rounded-full
                                flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-lg">
                    {players[2]?.displayName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="text-[#E6EDF3] text-xs font-medium mb-1">
                  {players[2]?.displayName?.split(" ")[0]}
                </p>
                <div className="bg-orange-500/20 border border-orange-500/30 rounded-t-lg
                                w-20 h-12 flex items-center justify-center">
                  <span className="text-2xl">🥉</span>
                </div>
              </div>
            </div>
          )}

          {/* Full Table */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#30363D] flex items-center justify-between">
              <h2 className="text-white font-semibold">Rankings</h2>
              <button
                onClick={() => window.location.reload()}
                className="text-[#8B949E] hover:text-white text-xs flex items-center gap-1"
              >
                <RefreshCw size={12} /> Refresh
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <RefreshCw className="text-[#8B949E] animate-spin mx-auto mb-2" size={20} />
                <p className="text-[#8B949E] text-sm">Loading rankings...</p>
              </div>
            ) : players.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-[#8B949E] text-sm">No players yet. Be the first!</p>
              </div>
            ) : (
              <div className="divide-y divide-[#30363D]">
                {players.map((player) => {
                  const rankStyle = RANK_COLORS[player.rank];
                  const isMe = player.uid === user?.uid;
                  return (
                    <div
                      key={player.uid}
                      className={`flex items-center gap-4 px-6 py-4
                                  ${isMe ? "bg-cyan-500/5 border-l-2 border-cyan-500" : "hover:bg-[#0D1117]"}
                                  transition-colors`}
                    >
                      {/* Rank */}
                      <div className={`w-8 text-center font-bold text-sm
                                       ${rankStyle ? rankStyle.text : "text-[#8B949E]"}`}>
                        {rankStyle ? rankStyle.medal : `#${player.rank}`}
                      </div>

                      {/* Avatar */}
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center
                                       border font-bold text-sm
                                       ${isMe
                                         ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                                         : "bg-[#0D1117] border-[#30363D] text-[#8B949E]"
                                       }`}>
                        {player.displayName?.charAt(0).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${isMe ? "text-cyan-400" : "text-[#E6EDF3]"}`}>
                          {player.displayName} {isMe && "(You)"}
                        </p>
                        <p className="text-[#8B949E] text-xs">
                          Level {player.level || 1} • {player.missionsCompleted || 0} missions
                        </p>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <p className="text-white font-bold text-sm">
                          {(player.totalScore || 0).toLocaleString()}
                        </p>
                        <p className="text-[#8B949E] text-xs">points</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
