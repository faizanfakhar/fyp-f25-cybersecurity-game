// ============================================================
// AdminDashboard.jsx — Admin Panel
// Stats cards, Recharts chart, Users table
// IMPORTANT: npm install recharts karna hoga pehle
// ============================================================

import { useState, useEffect } from "react";
import { useNavigate }         from "react-router-dom";
import { signOut }             from "firebase/auth";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { auth, db }            from "../../services/firebase";
import { useAuth }             from "../../context/AuthContext";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Shield, Users, Target, TrendingUp, LogOut,
  LayoutDashboard, Settings, BarChart2, ChevronRight,
  RefreshCw, UserCheck, AlertTriangle,
} from "lucide-react";

// ─── Sidebar nav ─────────────────────────────────────────────
const ADMIN_NAV = [
  { icon: LayoutDashboard, label: "Overview",   active: true  },
  { icon: Users,           label: "Users",      active: false },
  { icon: Target,          label: "Scenarios",  active: false },
  { icon: BarChart2,       label: "Analytics",  active: false },
  { icon: Settings,        label: "Settings",   active: false },
];

// ─── Sample chart data (baad mein real data se replace karo) ─
const CHART_DATA = [
  { day: "Mon", users: 12, missions: 34 },
  { day: "Tue", users: 19, missions: 52 },
  { day: "Wed", users: 15, missions: 41 },
  { day: "Thu", users: 27, missions: 68 },
  { day: "Fri", users: 32, missions: 85 },
  { day: "Sat", users: 24, missions: 61 },
  { day: "Sun", users: 18, missions: 47 },
];

// ─── Difficulty badge ─────────────────────────────────────────
const LevelBadge = ({ level }) => {
  const colors = {
    1: "bg-green-500/10  text-green-400",
    2: "bg-yellow-500/10 text-yellow-400",
    3: "bg-red-500/10    text-red-400",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                      ${colors[level] || colors[1]}`}>
      Level {level}
    </span>
  );
};

export default function AdminDashboard() {
  const navigate          = useNavigate();
  const { user, userData } = useAuth();
  const [users,        setUsers]        = useState([]);
  const [stats,        setStats]        = useState({ totalUsers: 0, totalMissions: 0, avgScore: 0 });
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loggingOut,   setLoggingOut]   = useState(false);

  const displayName = userData?.displayName || user?.displayName || "Admin";

  // ─── Firestore se users fetch karo ──────────────────────────
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        // Recent 10 users fetch karo
        const q        = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(10));
        const snapshot = await getDocs(q);
        const allUsers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setUsers(allUsers);

        // Stats calculate karo
        const fullSnapshot = await getDocs(collection(db, "users"));
        const allDocs      = fullSnapshot.docs.map((d) => d.data());
        const totalUsers   = allDocs.length;
        const totalMissions= allDocs.reduce((sum, u) => sum + (u.missionsCompleted || 0), 0);
        const avgScore     = totalUsers > 0
          ? Math.round(allDocs.reduce((sum, u) => sum + (u.totalScore || 0), 0) / totalUsers)
          : 0;

        setStats({ totalUsers, totalMissions, avgScore });
      } catch (err) {
        console.error("Users fetch error:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // ─── Logout ─────────────────────────────────────────────────
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setLoggingOut(false);
    }
  };

  // ─── UI ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0D1117] flex">

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 bg-[#161B22] border-r border-[#30363D]
                         flex-col">
        {/* Brand */}
        <div className="p-6 border-b border-[#30363D]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500/10 border border-orange-500/30
                            rounded-lg flex items-center justify-center">
              <Shield className="text-orange-400" size={20} />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">CyberGame</p>
              <p className="text-orange-400 text-xs mt-0.5 font-medium">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {ADMIN_NAV.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                          text-sm font-medium transition-colors duration-200
                          ${item.active
                            ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                            : "text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#0D1117]"
                          }`}
            >
              <item.icon size={18} />
              {item.label}
              {item.active && <ChevronRight className="ml-auto" size={16} />}
            </button>
          ))}
        </nav>

        {/* Logout */}
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
            {loggingOut ? "Logout..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Navbar */}
        <header className="sticky top-0 z-40 bg-[#161B22] border-b border-[#30363D]
                           px-6 py-4 flex items-center">
          <div>
            <p className="text-white font-semibold text-sm">Admin Overview</p>
            <p className="text-[#8B949E] text-xs">
              Logged in as: {displayName}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="px-2 py-1 bg-orange-500/10 border border-orange-500/30
                            rounded-full">
              <span className="text-orange-400 text-xs font-semibold">ADMIN</span>
            </div>
            <div className="w-8 h-8 bg-orange-500/20 border border-orange-500/30
                            rounded-full flex items-center justify-center">
              <span className="text-orange-400 text-sm font-bold">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">

          {/* Page Title */}
          <div>
            <h1 className="text-xl font-bold text-white">Platform Overview</h1>
            <p className="text-[#8B949E] text-sm mt-0.5">
              Sab users aur activity ka summary yahan hai
            </p>
          </div>

          {/* ── Stats Cards ─────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#8B949E] text-xs font-medium uppercase tracking-wider">
                  Total Users
                </p>
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex
                                items-center justify-center">
                  <Users className="text-blue-400" size={16} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
              <p className="text-[#8B949E] text-xs mt-2 flex items-center gap-1">
                <UserCheck size={12} className="text-green-400" />
                <span className="text-green-400">Active platform users</span>
              </p>
            </div>

            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#8B949E] text-xs font-medium uppercase tracking-wider">
                  Missions Complete
                </p>
                <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex
                                items-center justify-center">
                  <Target className="text-cyan-400" size={16} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalMissions}</p>
              <p className="text-[#8B949E] text-xs mt-2">Across all users</p>
            </div>

            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#8B949E] text-xs font-medium uppercase tracking-wider">
                  Average Score
                </p>
                <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex
                                items-center justify-center">
                  <TrendingUp className="text-yellow-400" size={16} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">
                {stats.avgScore.toLocaleString()}
              </p>
              <p className="text-[#8B949E] text-xs mt-2">Per player average</p>
            </div>

          </div>

          {/* ── Chart ───────────────────────────────────────── */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-semibold">Weekly Activity</h2>
                <p className="text-[#8B949E] text-xs mt-0.5">
                  Users aur missions — is hafte
                </p>
              </div>
              <button className="flex items-center gap-1.5 text-[#8B949E] text-xs
                                 hover:text-white transition-colors">
                <RefreshCw size={14} />
                Refresh
              </button>
            </div>

            {/* Recharts — npm install recharts zaroor karna */}
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#8B949E", fontSize: 12 }}
                  axisLine={{ stroke: "#30363D" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#8B949E", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#161B22",
                    border: "1px solid #30363D",
                    borderRadius: "8px",
                    color: "#E6EDF3",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  dot={false}
                  name="New Users"
                />
                <Line
                  type="monotone"
                  dataKey="missions"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={false}
                  name="Missions"
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-cyan-400 rounded" />
                <span className="text-[#8B949E] text-xs">New Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-yellow-400 rounded" />
                <span className="text-[#8B949E] text-xs">Missions</span>
              </div>
            </div>
          </div>

          {/* ── Users Table ─────────────────────────────────── */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#30363D] flex items-center
                            justify-between">
              <h2 className="text-white font-semibold">Recent Users</h2>
              <span className="text-[#8B949E] text-xs">
                Last 10 registered
              </span>
            </div>

            {loadingUsers ? (
              <div className="p-8 text-center">
                <RefreshCw className="text-[#8B949E] animate-spin mx-auto mb-2" size={20} />
                <p className="text-[#8B949E] text-sm">Users load ho rahe hain...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center">
                <AlertTriangle className="text-yellow-400 mx-auto mb-2" size={20} />
                <p className="text-[#8B949E] text-sm">Abhi koi user nahi hai.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#30363D]">
                      {["Naam", "Email", "Level", "Score", "Missions", "Status"].map((h) => (
                        <th key={h}
                            className="px-6 py-3 text-left text-xs font-medium
                                       text-[#8B949E] uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#30363D]">
                    {users.map((u) => (
                      <tr key={u.id}
                          className="hover:bg-[#0D1117] transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 bg-cyan-500/10 rounded-full
                                            flex items-center justify-center">
                              <span className="text-cyan-400 text-xs font-bold">
                                {(u.displayName || "?").charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-[#E6EDF3] text-sm font-medium">
                              {u.displayName || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#8B949E] text-sm">
                          {u.email || "—"}
                        </td>
                        <td className="px-6 py-4">
                          <LevelBadge level={u.level || 1} />
                        </td>
                        <td className="px-6 py-4 text-[#E6EDF3] text-sm">
                          {(u.totalScore || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-[#E6EDF3] text-sm">
                          {u.missionsCompleted || 0}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                            ${u.isActive
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                            }`}>
                            {u.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
