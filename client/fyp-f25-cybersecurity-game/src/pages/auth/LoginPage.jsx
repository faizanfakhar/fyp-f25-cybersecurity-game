import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPass,   setShowPass]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [resetSent,  setResetSent]  = useState(false);

  const getFriendlyError = (code) => {
    switch (code) {
      case "auth/user-not-found":         return "No account found with this email.";
      case "auth/wrong-password":         return "Incorrect password. Please try again.";
      case "auth/invalid-email":          return "Invalid email format.";
      case "auth/too-many-requests":      return "Too many attempts. Please try again later.";
      case "auth/network-request-failed": return "Network error. Check your connection.";
      case "auth/invalid-credential":     return "Invalid email or password.";
      default:                            return "Something went wrong. Please try again.";
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
      const result  = await signInWithEmailAndPassword(auth, email, password);
      const docSnap = await getDoc(doc(db, "users", result.user.uid));
      if (docSnap.exists()) {
        docSnap.data().role === "admin" ? navigate("/admin") : navigate("/dashboard");
      }
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) { setError("Enter your email address first."); return; }
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err) {
      setError(getFriendlyError(err.code));
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center px-4">

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px]
                        bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16
                          bg-cyan-500/10 border border-cyan-500/30 rounded-2xl mb-4
                          shadow-lg shadow-cyan-500/10">
            <Shield className="text-cyan-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            CyberGame
          </h1>
          <p className="text-[#8B949E] text-sm mt-1">
            Cybersecurity Awareness Training Platform
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8
                        shadow-xl shadow-black/20">

          <h2 className="text-white font-semibold text-lg mb-6">Sign In</h2>

          {/* Success */}
          {resetSent && (
            <div className="mb-5 p-3 bg-green-500/10 border border-green-500/30
                            rounded-lg flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle size={16} />
              Password reset link sent. Check your email.
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30
                            rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#E6EDF3] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2
                                 text-[#8B949E]" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg
                             pl-10 pr-4 py-2.5 text-[#E6EDF3] text-sm
                             placeholder:text-[#484F58]
                             focus:outline-none focus:border-cyan-500 focus:ring-1
                             focus:ring-cyan-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#E6EDF3] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2
                                 text-[#8B949E]" size={18} />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg
                             pl-10 pr-10 py-2.5 text-[#E6EDF3] text-sm
                             placeholder:text-[#484F58]
                             focus:outline-none focus:border-cyan-500 focus:ring-1
                             focus:ring-cyan-500/20 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-[#8B949E] hover:text-cyan-400 transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#30363D] bg-[#0D1117]
                             accent-cyan-500 cursor-pointer"
                />
                <span className="text-sm text-[#8B949E]">Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-cyan-400 hover:text-cyan-300
                           transition-colors duration-200"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400
                         disabled:bg-cyan-500/40 disabled:cursor-not-allowed
                         text-black font-semibold py-2.5 rounded-lg text-sm
                         transition-all duration-200 shadow-lg shadow-cyan-500/20
                         hover:shadow-cyan-500/30"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#30363D]" />
            <span className="text-[#484F58] text-xs">OR</span>
            <div className="flex-1 h-px bg-[#30363D]" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-[#8B949E]">
            Don't have an account?{" "}
            <Link to="/register"
                  className="text-cyan-400 hover:text-cyan-300 font-medium
                             transition-colors duration-200">
              Create account
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-[#484F58] text-xs mt-6">
          FYP-F25 · Department of Software Engineering · UOL
        </p>
      </div>
    </div>
  );
}
