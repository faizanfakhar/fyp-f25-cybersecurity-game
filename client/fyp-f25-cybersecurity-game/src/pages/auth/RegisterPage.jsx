// ============================================================
// RegisterPage.jsx — Complete Registration Page
// Features: Name, Email, Pass, Confirm Pass, Firestore doc create
// ============================================================

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { Shield, User, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();

  // Form state
  const [displayName,  setDisplayName]  = useState("");
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [confirmPass,  setConfirmPass]  = useState("");
  const [showPass,     setShowPass]     = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  // Password strength check
  const getPasswordStrength = (pass) => {
    if (pass.length === 0) return null;
    if (pass.length < 6)   return { label: "Weak",   color: "bg-red-500",    width: "w-1/3" };
    if (pass.length < 10)  return { label: "Fair",   color: "bg-yellow-500", width: "w-2/3" };
    return                        { label: "Strong",  color: "bg-green-500",  width: "w-full" };
  };
  const strength = getPasswordStrength(password);

  // Firebase error messages
  const getFriendlyError = (code) => {
    switch (code) {
      case "auth/email-already-in-use":   return "This email is already registered.";
      case "auth/weak-password":          return "Password must be at least 6 characters.";
      case "auth/invalid-email":          return "Please enter a valid email address.";
      case "auth/network-request-failed": return "Network error. Please check your connection.";
      default: return "Something went wrong. Please try again.";
    }
  };

  // ─── Register submit handler ──────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!displayName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (password !== confirmPass) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create user in Firebase Auth
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user   = result.user;

      // Step 2: Update Firebase Auth profile with display name
      await updateProfile(user, { displayName: displayName.trim() });

      // Step 3: Create user document in Firestore
      // IMPORTANT: role is always "player" — admin is set manually in Firestore Console
      await setDoc(doc(db, "users", user.uid), {
        uid:               user.uid,
        displayName:       displayName.trim(),
        email:             email.toLowerCase(),
        role:              "player",           // ← Never change this here
        createdAt:         serverTimestamp(),
        totalScore:        0,
        missionsCompleted: 0,
        level:             1,
        isActive:          true,
      });

      // Step 4: Redirect to player dashboard
      navigate("/dashboard");

    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ─── UI ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center px-4 py-8">

      {/* Glowing background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96
                        bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16
                          bg-cyan-500/10 border border-cyan-500/30 rounded-2xl mb-4">
            <Shield className="text-cyan-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Create Your Account
          </h1>
          <p className="text-[#8B949E] text-sm mt-1">
            Join the CyberGame Training Platform
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8">

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30
                            rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">

            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-[#E6EDF3] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2
                                 text-[#8B949E]" size={18} />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg
                             pl-10 pr-4 py-2.5 text-[#E6EDF3] text-sm
                             placeholder:text-[#8B949E]
                             focus:outline-none focus:border-cyan-500
                             transition-colors duration-200"
                />
              </div>
            </div>

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
                             placeholder:text-[#8B949E]
                             focus:outline-none focus:border-cyan-500
                             transition-colors duration-200"
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

              {/* Password strength bar */}
              {strength && (
                <div className="mt-2">
                  <div className="h-1 bg-[#30363D] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300
                                    ${strength.color} ${strength.width}`} />
                  </div>
                  <p className="text-xs text-[#8B949E] mt-1">
                    Password strength: <span className="text-[#E6EDF3]">{strength.label}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[#E6EDF3] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2
                                 text-[#8B949E]" size={18} />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`w-full bg-[#0D1117] border rounded-lg
                              pl-10 pr-10 py-2.5 text-[#E6EDF3] text-sm
                              placeholder:text-[#8B949E]
                              focus:outline-none transition-colors duration-200
                              ${confirmPass && password !== confirmPass
                                ? "border-red-500 focus:border-red-500"
                                : "border-[#30363D] focus:border-cyan-500"
                              }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-[#8B949E] hover:text-cyan-400 transition-colors"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPass && password !== confirmPass && (
                <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50
                         text-black font-semibold py-2.5 rounded-lg text-sm mt-2
                         transition-colors duration-200 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

          </form>

          {/* Login link */}
          <p className="text-center text-sm text-[#8B949E] mt-6">
            Already have an account?{" "}
            <Link to="/login"
                  className="text-cyan-400 hover:text-cyan-300 font-medium
                             transition-colors duration-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
