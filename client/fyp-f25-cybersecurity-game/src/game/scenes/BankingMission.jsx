// ============================================================
// src/game/scenes/BankingMission.jsx
// Mission 2 — Fake Banking Portal Detection
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { saveMissionScore } from "../../services/scoreService";
import {
  ChevronLeft, Shield, CheckCircle, XCircle,
  AlertTriangle, Lock, Globe, Eye, EyeOff, RefreshCw,
} from "lucide-react";

const SCENARIOS = [
  {
    id: 1, isFake: true,
    bankName: "HBL Bank",
    url: "https://hbl-secure-login.xyz/account/signin",
    ssl: false, sslText: "Not Secure",
    pageTitle: "HBL Internet Banking - Secure Login",
    logoColor: "#006400",
    welcomeText: "Welcome to HBL Internet Banking",
    subText: "Please enter your credentials to access your account",
    fields: ["Customer ID", "Password", "PIN"],
    notice: "⚠️ Your account has been temporarily suspended. Login immediately to restore access.",
    footer: "© 2024 HBL Bank Pakistan. All Rights Reserved.",
    clues: [
      "URL domain is 'hbl-secure-login.xyz' — not official 'hbl.com'",
      "No SSL certificate — shows 'Not Secure' in browser",
      "Asks for PIN along with password — real banks don't do this",
      "Creates urgency with 'account suspended' message",
    ],
  },
  {
    id: 2, isFake: false,
    bankName: "Meezan Bank",
    url: "https://www.meezanbank.com/internet-banking/login",
    ssl: true, sslText: "Secure",
    pageTitle: "Meezan Bank - Internet Banking Login",
    logoColor: "#1B4F72",
    welcomeText: "Meezan Bank Internet Banking",
    subText: "Secure login to your account",
    fields: ["User ID", "Password"],
    notice: null,
    footer: "© 2024 Meezan Bank Limited. All Rights Reserved.",
    clues: [],
  },
  {
    id: 3, isFake: true,
    bankName: "UBL United Bank",
    url: "http://ubl-banking-secure.pk.net/login/verify",
    ssl: false, sslText: "Not Secure",
    pageTitle: "UBL - Urgent Account Verification Required",
    logoColor: "#8B0000",
    welcomeText: "UBL Internet Banking - Account Verification",
    subText: "Verify your account to avoid suspension",
    fields: ["Account Number", "Password", "CNIC Number", "OTP"],
    notice: "🔴 URGENT: Your account will be blocked in 24 hours. Verify now!",
    footer: "© UBL Bank Verification Portal 2024",
    clues: [
      "URL uses HTTP not HTTPS — completely insecure",
      "Domain is 'ubl-banking-secure.pk.net' — not official 'ubl.com'",
      "Asks for CNIC number — banks never ask for this online",
      "Extremely urgent language designed to panic users",
    ],
  },
  {
    id: 4, isFake: false,
    bankName: "Allied Bank",
    url: "https://www.abl.com/internet-banking/login",
    ssl: true, sslText: "Secure",
    pageTitle: "Allied Bank Limited - Internet Banking",
    logoColor: "#00008B",
    welcomeText: "Allied Bank Internet Banking",
    subText: "Please enter your login credentials",
    fields: ["User ID", "Password"],
    notice: null,
    footer: "© 2024 Allied Bank Limited. Regulated by State Bank of Pakistan.",
    clues: [],
  },
  {
    id: 5, isFake: true,
    bankName: "MCB Bank",
    url: "https://mcb-account-verify.com/secure/login.php",
    ssl: true, sslText: "Secure",
    pageTitle: "MCB Bank - Account Security Update Required",
    logoColor: "#006400",
    welcomeText: "MCB Internet Banking - Security Update",
    subText: "Update your security details to continue",
    fields: ["Username", "Password", "ATM Card Number", "Card PIN"],
    notice: "Your account security needs to be updated. Enter your card details below.",
    footer: "© MCB Bank Security Department 2024",
    clues: [
      "Domain is 'mcb-account-verify.com' — not official 'mcb.com.pk'",
      "Asks for ATM card number and PIN — never give this online",
      "Even though SSL is present, the domain is wrong",
      "Requests card details that legitimate banks never ask for online",
    ],
  },
];

function BrowserBar({ scenario }) {
  return (
    <div className="bg-[#2D2D2D] rounded-t-xl border border-[#444] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#3C3C3C] border-b border-[#444]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex-1 flex items-center gap-2 bg-[#1E1E1E] rounded-lg px-3 py-1.5 ml-2">
          {scenario.ssl ? (
            <Lock className="text-green-400" size={12} />
          ) : (
            <AlertTriangle className="text-red-400" size={12} />
          )}
          <span className={`text-xs font-medium ${scenario.ssl ? "text-green-400" : "text-red-400"}`}>
            {scenario.sslText}
          </span>
          <span className="text-[#8B949E] text-xs ml-1 truncate">{scenario.url}</span>
        </div>
        <RefreshCw className="text-[#8B949E]" size={14} />
        <Globe className="text-[#8B949E]" size={14} />
      </div>
      <div className="flex items-center bg-[#2D2D2D] px-4 pt-2">
        <div className="flex items-center gap-2 bg-[#1E1E1E] rounded-t-lg px-4 py-1.5 border-t border-l border-r border-[#444]">
          <span className="text-sm">🏦</span>
          <span className="text-[#E6EDF3] text-xs">{scenario.pageTitle}</span>
        </div>
      </div>
    </div>
  );
}

function BankPortal({ scenario }) {
  const [showPass, setShowPass] = useState(false);
  const [values, setValues]     = useState({});
  return (
    <div className="bg-white rounded-b-xl overflow-hidden min-h-96">
      <div style={{ backgroundColor: scenario.logoColor }} className="px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-xl">🏦</span>
            </div>
            <div>
              <p className="text-white font-bold text-lg">{scenario.bankName}</p>
              <p className="text-white/70 text-xs">Internet Banking</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {scenario.ssl
              ? <><Lock size={12} className="text-green-300" /><span className="text-green-300">Secured</span></>
              : <><AlertTriangle size={12} className="text-red-300" /><span className="text-red-300">Not Secured</span></>
            }
          </div>
        </div>
      </div>
      <div className="p-8 flex justify-center">
        <div className="w-full max-w-sm">
          {scenario.notice && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-700 text-sm font-medium">{scenario.notice}</p>
            </div>
          )}
          <h2 className="text-gray-800 text-xl font-bold mb-1">{scenario.welcomeText}</h2>
          <p className="text-gray-500 text-sm mb-6">{scenario.subText}</p>
          <div className="space-y-4">
            {scenario.fields.map((field, idx) => (
              <div key={idx}>
                <label className="block text-gray-700 text-sm font-medium mb-1">{field}</label>
                <div className="relative">
                  <input
                    type={field.toLowerCase().includes("password") || field.toLowerCase().includes("pin") ? (showPass ? "text" : "password") : "text"}
                    placeholder={`Enter your ${field}`}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-blue-500"
                    value={values[field] || ""}
                    onChange={e => setValues(v => ({ ...v, [field]: e.target.value }))}
                  />
                  {(field.toLowerCase().includes("password") || field.toLowerCase().includes("pin")) && (
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button style={{ backgroundColor: scenario.logoColor }}
            className="w-full text-white font-semibold py-2.5 rounded-lg mt-6 text-sm">
            Login to Account
          </button>
          <div className="flex items-center justify-between mt-4">
            <a href="#" className="text-blue-600 text-xs">Forgot Password?</a>
            <a href="#" className="text-blue-600 text-xs">Register Now</a>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 border-t border-gray-200 px-8 py-3 text-center">
        <p className="text-gray-400 text-xs">{scenario.footer}</p>
      </div>
    </div>
  );
}

function ResultModal({ correct, scenario, onClose, onNext }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl max-w-lg w-full p-6">
        <div className="text-center mb-6">
          {correct
            ? <><CheckCircle className="text-green-400 mx-auto mb-3" size={48} /><h2 className="text-xl font-bold text-white">Correct! 🎉</h2><p className="text-green-400 mt-1">+100 points earned</p></>
            : <><XCircle className="text-red-400 mx-auto mb-3" size={48} /><h2 className="text-xl font-bold text-white">Incorrect!</h2><p className="text-red-400 mt-1">This was a {scenario.isFake ? "fake" : "legitimate"} banking portal</p></>
          }
        </div>
        {scenario.isFake ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
            <p className="text-red-400 font-semibold text-sm mb-2">🚨 Red Flags:</p>
            <ul className="space-y-1.5">
              {scenario.clues.map((clue, i) => (
                <li key={i} className="text-[#E6EDF3] text-sm flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>{clue}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4">
            <p className="text-green-400 font-semibold text-sm mb-2">✅ Legitimate because:</p>
            <ul className="space-y-1 text-[#E6EDF3] text-sm">
              <li>• Official bank domain</li>
              <li>• Valid SSL certificate</li>
              <li>• Only asks for User ID and Password</li>
              <li>• No urgency or pressure tactics</li>
            </ul>
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-[#30363D] text-[#8B949E] py-2.5 rounded-lg text-sm hover:text-white transition-colors">Inspect Again</button>
          <button onClick={onNext} className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-2.5 rounded-lg text-sm transition-colors">Next Portal →</button>
        </div>
      </div>
    </div>
  );
}

export default function BankingMission() {
  const navigate            = useNavigate();
  const { user }            = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answered, setAnswered]     = useState([]);
  const [score, setScore]           = useState(0);
  const [result, setResult]         = useState(null);
  const [complete, setComplete]     = useState(false);

  const scenario = SCENARIOS[currentIdx];

  const handleJudge = (isFake) => {
    const correct   = isFake === scenario.isFake;
    const newScore  = correct ? score + 100 : score;
    if (correct) setScore(newScore);
    const newAnswered = [...answered, scenario.id];
    setAnswered(newAnswered);
    setResult({ correct, scenario });

    if (newAnswered.length >= SCENARIOS.length) {
      // Save score to Firebase
      if (user) {
        saveMissionScore(user.uid, newScore).then(res => {
          console.log("Score saved:", res);
        });
      }
      setTimeout(() => setComplete(true), 500);
    }
  };

  const handleNext = () => {
    setResult(null);
    if (currentIdx + 1 >= SCENARIOS.length) {
      setComplete(true);
    } else {
      setCurrentIdx(i => i + 1);
    }
  };

  if (complete) {
    const pct = Math.round((score / (SCENARIOS.length * 100)) * 100);
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-4">
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl max-w-md w-full p-8 text-center">
          <div className="text-6xl mb-4">{pct >= 80 ? "🏆" : pct >= 60 ? "🥈" : "📚"}</div>
          <h1 className="text-2xl font-bold text-white mb-2">Mission Complete!</h1>
          <p className="text-[#8B949E] mb-6">Fake Banking Portal Detection</p>
          <div className="bg-[#0D1117] rounded-xl p-4 mb-6">
            <p className="text-4xl font-bold text-cyan-400">{score}</p>
            <p className="text-[#8B949E] text-sm mt-1">Points Earned This Mission</p>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#0D1117] rounded-lg p-3"><p className="text-xl font-bold text-white">{pct}%</p><p className="text-[#8B949E] text-xs">Accuracy</p></div>
            <div className="bg-[#0D1117] rounded-lg p-3"><p className="text-xl font-bold text-white">{SCENARIOS.length}</p><p className="text-[#8B949E] text-xs">Portals</p></div>
            <div className="bg-[#0D1117] rounded-lg p-3"><p className="text-xl font-bold text-white">{SCENARIOS.filter(s => s.isFake).length}</p><p className="text-[#8B949E] text-xs">Fake Sites</p></div>
          </div>
          <div className={`p-3 rounded-lg mb-6 text-sm ${pct >= 80 ? "bg-green-500/10 text-green-400 border border-green-500/30" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"}`}>
            {pct >= 80 ? "Excellent! You can spot fake banking portals effectively." : "Keep practicing to improve your detection skills."}
          </div>
          <button onClick={() => navigate("/dashboard")}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 rounded-lg transition-colors">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col">
      {result && <ResultModal correct={result.correct} scenario={result.scenario} onClose={() => setResult(null)} onNext={handleNext} />}

      <div className="bg-[#161B22] border-b border-[#30363D] px-6 py-3 flex items-center gap-4 sticky top-0 z-40">
        <button onClick={() => navigate("/dashboard")} className="text-[#8B949E] hover:text-white transition-colors flex items-center gap-1">
          <ChevronLeft size={18} /><span className="text-sm">Exit Mission</span>
        </button>
        <div className="flex-1 flex items-center gap-3">
          <Shield className="text-cyan-400" size={20} />
          <div>
            <p className="text-white font-semibold text-sm leading-none">Mission 2 — Fake Banking Portal Detection</p>
            <p className="text-[#8B949E] text-xs mt-0.5">Identify whether each banking portal is legitimate or fraudulent</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-cyan-400 font-bold text-sm">{score} pts</p>
            <p className="text-[#8B949E] text-xs">{answered.length}/{SCENARIOS.length} done</p>
          </div>
          <div className="w-24 h-1.5 bg-[#30363D] rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${(answered.length / SCENARIOS.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-yellow-400 font-semibold text-sm">Your Mission</p>
            <p className="text-[#8B949E] text-sm mt-1">Examine each banking portal carefully. Check the URL, SSL certificate, form fields, and any suspicious messages.</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-white font-semibold">Portal {currentIdx + 1} of {SCENARIOS.length}</p>
          <div className="flex items-center gap-1.5">
            {SCENARIOS.map((_, idx) => (
              <div key={idx} className={`w-2 h-2 rounded-full ${idx < currentIdx ? "bg-green-400" : idx === currentIdx ? "bg-cyan-400" : "bg-[#30363D]"}`} />
            ))}
          </div>
        </div>

        <div className="mb-6 shadow-2xl">
          <BrowserBar scenario={scenario} />
          <BankPortal scenario={scenario} />
        </div>

        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 mb-6">
          <p className="text-white font-semibold text-sm mb-3">🔍 What to Check:</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "URL Domain",       value: scenario.url.split("/")[2],               suspicious: scenario.isFake },
              { label: "SSL Certificate",  value: scenario.sslText,                          suspicious: !scenario.ssl   },
              { label: "Fields Requested", value: scenario.fields.join(", "),                suspicious: scenario.fields.length > 2 },
              { label: "Urgency Message",  value: scenario.notice ? "Yes ⚠️" : "None ✅",   suspicious: !!scenario.notice },
            ].map((item, idx) => (
              <div key={idx} className="bg-[#0D1117] rounded-lg p-3">
                <p className="text-[#8B949E] text-xs mb-1">{item.label}</p>
                <p className={`text-xs font-medium ${item.suspicious ? "text-red-400" : "text-green-400"}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {!answered.includes(scenario.id) ? (
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
            <p className="text-white font-semibold text-center mb-4">🤔 Is this banking portal legitimate or fake?</p>
            <div className="flex gap-4">
              <button onClick={() => handleJudge(false)} className="flex-1 bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 text-green-400 font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                <CheckCircle size={20} /> Legitimate Portal
              </button>
              <button onClick={() => handleJudge(true)} className="flex-1 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                <AlertTriangle size={20} /> Fake / Phishing Site
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
            <p className="text-green-400 font-medium">✅ You have judged this portal</p>
          </div>
        )}
      </div>
    </div>
  );
}
