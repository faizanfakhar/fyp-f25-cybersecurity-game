// ============================================================
// LoginPage.jsx — Complete Login Page
// Features: Email/Pass, Remember Me, Forgot Password, Role Redirect
// ============================================================

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
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();

  // Form state
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [rememberMe,  setRememberMe]  = useState(false);
  const [showPass,    setShowPass]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [resetSent,   setResetSent]   = useState(false);

  // ─── Firebase error messages ko readable banao ───────────────
  const getFriendlyError = (code) => {
    switch (code) {
      case "auth/user-not-found":    return "Is email ka koi account nahi mila.";
      case "auth/wrong-password":    return "Password galat hai. Dobara try karo.";
      case "auth/invalid-email":     return "Email format sahi nahi hai.";
      case "auth/too-many-requests": return "Zyada galat tries. Thodi der baad try karo.";
      case "auth/network-request-failed": return "Internet connection check karo.";
      default: return "Kuch masla ho gaya. Dobara try karo.";
    }
  };

  // ─── Login submit handler ─────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Remember Me toggle — "Local" = browser band hone par bhi login rahe
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      // Firebase se login karo
      const result = await signInWithEmailAndPassword(auth, email, password);
      const uid    = result.user.uid;

      // Firestore se role check karo
      const docSnap = await getDoc(doc(db, "users", uid));
      if (docSnap.exists()) {
        const role = docSnap.data().role;
        // Role ke hisaab se redirect karo
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ─── Forgot Password ─────────────────────────────────────────
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Pehle email field mein apni email likho.");
      return;
    }
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err) {
      setError(getFriendlyError(err.code));
    }
  };

  // ─── UI ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center px-4">

      {/* Glowing background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96
                        bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">

        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16
                          bg-cyan-500/10 border border-cyan-500/30 rounded-2xl mb-4">
            <Shield className="text-cyan-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            CyberGame Platform
          </h1>
          <p className="text-[#8B949E] text-sm mt-1">
            Apne account mein login karo
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8">

          {/* Success message — reset email bheja */}
          {resetSent && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30
                            rounded-lg text-green-400 text-sm text-center">
              ✓ Password reset link bhej diya gaya. Email check karo.
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30
                            rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email Field */}
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
                  placeholder="email@example.com"
                  required
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg
                             pl-10 pr-4 py-2.5 text-[#E6EDF3] text-sm
                             placeholder:text-[#8B949E]
                             focus:outline-none focus:border-cyan-500
                             transition-colors duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
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
                             placeholder:text-[#8B949E]
                             focus:outline-none focus:border-cyan-500
                             transition-colors duration-200"
                />
                {/* Show/Hide Password toggle */}
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

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#30363D] bg-[#0D1117]
                             accent-cyan-500 cursor-pointer"
                />
                <span className="text-sm text-[#8B949E]">Mujhe yaad rakho</span>
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-cyan-400 hover:text-cyan-300
                           transition-colors duration-200"
              >
                Password bhool gaye?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50
                         text-black font-semibold py-2.5 rounded-lg text-sm
                         transition-colors duration-200 disabled:cursor-not-allowed"
            >
              {loading ? "Login ho raha hai..." : "Login"}
            </button>

          </form>

          {/* Register link */}
          <p className="text-center text-sm text-[#8B949E] mt-6">
            Account nahi hai?{" "}
            <Link to="/register"
                  className="text-cyan-400 hover:text-cyan-300 font-medium
                             transition-colors duration-200">
              Register karo
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
