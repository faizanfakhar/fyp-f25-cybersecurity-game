// ============================================================
// src/game/scenes/PhishingMission.jsx
// Mission 1 — Phishing Email Virtual Environment
// Looks and feels like a real Gmail-style email app
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { saveMissionScore } from "../../services/scoreService";
import {
  Inbox, Star, Send, Trash2, AlertTriangle,
  ChevronLeft, Search, Settings, Menu,
  Paperclip, Reply, Forward, MoreVertical,
  Shield, CheckCircle, XCircle, X
} from "lucide-react";

// ─── Email Data ───────────────────────────────────────────────
const EMAILS = [
  {
    id: 1,
    from: "security@bankislami-verify.com",
    fromName: "Bank Islami Security",
    subject: "⚠️ URGENT: Your account will be suspended in 24 hours",
    preview: "Dear Customer, We have detected suspicious activity...",
    time: "10:23 AM",
    read: false,
    starred: false,
    isPhishing: true,
    body: `Dear Valued Customer,

We have detected suspicious activity on your Bank Islami account. Your account will be SUSPENDED within 24 hours unless you verify your identity immediately.

Click the link below to verify your account:
http://bankislami-secure-verify.xyz/login

You will need to provide:
• Full Name
• Account Number
• PIN / Password
• Date of Birth

Failure to verify will result in permanent account suspension.

Regards,
Bank Islami Security Team`,
    suspiciousClues: [
      "Sender domain is 'bankislami-verify.com' — not the official 'bankislami.com'",
      "Creates urgency with '24 hours' threat",
      "Link goes to 'bankislami-secure-verify.xyz' — suspicious domain",
      "Asks for your PIN/Password — banks never ask for this",
      "Poor grammar and unprofessional tone",
    ],
    attachments: [],
  },
  {
    id: 2,
    from: "noreply@github.com",
    fromName: "GitHub",
    subject: "Your pull request has been merged",
    preview: "Congratulations! Your pull request #142 has been merged into main...",
    time: "9:15 AM",
    read: true,
    starred: true,
    isPhishing: false,
    body: `Hi faizanfakhar,

Your pull request #142 "feat: add authentication system" has been successfully merged into the main branch of fyp-f25-cybersecurity-game.

View the changes at: https://github.com/faizanfakhar/fyp-f25-cybersecurity-game/pull/142

Thanks for your contribution!

The GitHub Team`,
    suspiciousClues: [],
    attachments: [],
  },
  {
    id: 3,
    from: "hr@company-jobs-pk.net",
    fromName: "HR Department",
    subject: "You have been selected for a job offer - Confirm NOW",
    preview: "Congratulations! You have been selected for a high paying job...",
    time: "Yesterday",
    read: false,
    starred: false,
    isPhishing: true,
    body: `Congratulations!!!

You have been SELECTED for a high-paying remote job offer. Salary: PKR 150,000/month.

To confirm your position, please send us:
• Copy of your CNIC
• Bank account details
• Home address
• Phone number

Reply immediately or your position will be given to someone else!

Send fee of PKR 5,000 to confirm your slot.

HR Department`,
    suspiciousClues: [
      "Suspicious domain 'company-jobs-pk.net'",
      "Asks for personal documents and bank details",
      "Requires upfront payment — classic scam",
      "Excessive urgency and pressure tactics",
      "Unrealistic salary offer",
    ],
    attachments: [],
  },
  {
    id: 4,
    from: "no-reply@google.com",
    fromName: "Google",
    subject: "Security alert for your Google Account",
    preview: "A new sign-in on Windows. If this was you, you don't need to do anything...",
    time: "Yesterday",
    read: true,
    starred: false,
    isPhishing: false,
    body: `Hi Faizan,

Your Google Account was just signed in to from a new Windows device. If this was you, you don't need to do anything.

If you didn't sign in recently, your account may be compromised. Review activity at myaccount.google.com

The Google Accounts team`,
    suspiciousClues: [],
    attachments: [],
  },
];

// ─── Result Modal ────────────────────────────────────────────
function ResultModal({ correct, email, onClose, onNext }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl max-w-lg w-full p-6">
        <div className="text-center mb-6">
          {correct ? (
            <>
              <CheckCircle className="text-green-400 mx-auto mb-3" size={48} />
              <h2 className="text-xl font-bold text-white">Correct! 🎉</h2>
              <p className="text-green-400 mt-1">+100 points earned</p>
            </>
          ) : (
            <>
              <XCircle className="text-red-400 mx-auto mb-3" size={48} />
              <h2 className="text-xl font-bold text-white">Incorrect!</h2>
              <p className="text-red-400 mt-1">This was a {email.isPhishing ? "phishing" : "legitimate"} email</p>
            </>
          )}
        </div>

        {email.isPhishing && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
            <p className="text-red-400 font-semibold text-sm mb-2">
              🚨 Phishing Clues in this email:
            </p>
            <ul className="space-y-1">
              {email.suspiciousClues.map((clue, i) => (
                <li key={i} className="text-[#E6EDF3] text-sm flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>
                  {clue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!email.isPhishing && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4">
            <p className="text-green-400 font-semibold text-sm mb-2">
              ✅ This was a legitimate email because:
            </p>
            <ul className="space-y-1 text-[#E6EDF3] text-sm">
              <li>• Sender domain matches official company domain</li>
              <li>• No requests for personal information or passwords</li>
              <li>• Professional and appropriate tone</li>
              <li>• Links go to official websites</li>
            </ul>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-[#30363D] text-[#8B949E] py-2.5
                       rounded-lg text-sm hover:text-white transition-colors"
          >
            Continue Reading
          </button>
          <button
            onClick={onNext}
            className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black
                       font-semibold py-2.5 rounded-lg text-sm transition-colors"
          >
            Next Email →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function PhishingMission() {
  const navigate = useNavigate();
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emails, setEmails] = useState(EMAILS);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState([]);
  const [result, setResult] = useState(null);
  const [missionComplete, setMissionComplete] = useState(false);
  const [savedResult, setSavedResult] = useState(null);
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const phishingEmails = emails.filter(e => e.isPhishing).length;
  const answeredCount = answered.length;
  const totalEmails = emails.length;

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    setEmails(prev => prev.map(e =>
      e.id === email.id ? { ...e, read: true } : e
    ));
  };

  const handleJudge = (isPhishing) => {
    const correct = isPhishing === selectedEmail.isPhishing;
    if (correct) setScore(prev => prev + 100);
    setAnswered(prev => [...prev, selectedEmail.id]);
    setResult({ correct, email: selectedEmail });
  };

  const handleNext = () => {
    setResult(null);
    const nextEmail = emails.find(e => !answered.includes(e.id) && e.id !== selectedEmail.id);
    if (nextEmail) {
      setSelectedEmail(nextEmail);
    } else if (answered.length + 1 >= totalEmails) {
      setMissionComplete(true);
    } else {
      setSelectedEmail(null);
    }
  };

  // Mission Complete Screen
  if (missionComplete) {
    const percentage = Math.round((score / (totalEmails * 100)) * 100);
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-4">
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl max-w-md w-full p-8 text-center">
          <div className="text-6xl mb-4">
            {percentage >= 75 ? "🏆" : percentage >= 50 ? "🥈" : "📚"}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Mission Complete!</h1>
          <p className="text-[#8B949E] mb-6">Phishing Email Detection Training</p>

          <div className="bg-[#0D1117] rounded-xl p-4 mb-6">
            <p className="text-4xl font-bold text-cyan-400">{score}</p>
            <p className="text-[#8B949E] text-sm mt-1">Total Score</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#0D1117] rounded-lg p-3">
              <p className="text-xl font-bold text-white">{percentage}%</p>
              <p className="text-[#8B949E] text-xs">Accuracy</p>
            </div>
            <div className="bg-[#0D1117] rounded-lg p-3">
              <p className="text-xl font-bold text-white">{totalEmails}</p>
              <p className="text-[#8B949E] text-xs">Emails</p>
            </div>
            <div className="bg-[#0D1117] rounded-lg p-3">
              <p className="text-xl font-bold text-white">{phishingEmails}</p>
              <p className="text-[#8B949E] text-xs">Phishing</p>
            </div>
          </div>

          <div className={`p-3 rounded-lg mb-6 text-sm ${
            percentage >= 75
              ? "bg-green-500/10 text-green-400 border border-green-500/30"
              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
          }`}>
            {percentage >= 75
              ? "Excellent! You are well-protected against phishing attacks."
              : "Keep practicing to improve your phishing detection skills."}
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black
                       font-semibold py-3 rounded-lg transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col">

      {/* Result Modal */}
      {result && (
        <ResultModal
          correct={result.correct}
          email={result.email}
          onClose={() => setResult(null)}
          onNext={handleNext}
        />
      )}

      {/* Top Bar */}
      <div className="bg-[#161B22] border-b border-[#30363D] px-4 py-3
                      flex items-center gap-4 sticky top-0 z-40">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-[#8B949E] hover:text-white transition-colors flex items-center gap-1"
        >
          <ChevronLeft size={18} />
          <span className="text-sm">Exit Mission</span>
        </button>

        <div className="flex-1 flex items-center gap-3">
          <Shield className="text-cyan-400" size={20} />
          <div>
            <p className="text-white font-semibold text-sm leading-none">
              Mission 1 — Phishing Detection
            </p>
            <p className="text-[#8B949E] text-xs mt-0.5">
              Identify phishing emails in your inbox
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-cyan-400 font-bold text-sm">{score} pts</p>
            <p className="text-[#8B949E] text-xs">{answeredCount}/{totalEmails} done</p>
          </div>
          <div className="w-24 h-1.5 bg-[#30363D] rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full transition-all"
              style={{ width: `${(answeredCount / totalEmails) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Gmail-style Layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-56 bg-[#161B22] border-r border-[#30363D] flex flex-col">
            {/* Compose button */}
            <div className="p-4">
              <button className="w-full bg-[#1F6FEB] hover:bg-blue-500 text-white
                                 font-medium py-2.5 rounded-full text-sm transition-colors
                                 flex items-center justify-center gap-2">
                ✏️ Compose
              </button>
            </div>

            {/* Folders */}
            <nav className="px-2 space-y-0.5">
              {[
                { icon: Inbox,  label: "Inbox",   count: emails.filter(e => !e.read).length },
                { icon: Star,   label: "Starred",  count: null },
                { icon: Send,   label: "Sent",     count: null },
                { icon: Trash2, label: "Trash",    count: null },
              ].map((item) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-full
                              text-sm transition-colors
                              ${item.label === "Inbox"
                                ? "bg-blue-500/15 text-blue-400 font-medium"
                                : "text-[#8B949E] hover:bg-[#0D1117] hover:text-white"
                              }`}
                >
                  <item.icon size={18} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count > 0 && (
                    <span className="text-xs font-bold">{item.count}</span>
                  )}
                </button>
              ))}
            </nav>

            {/* Mission hint */}
            <div className="mt-auto p-4">
              <div className="bg-yellow-500/10 border border-yellow-500/30
                              rounded-xl p-3">
                <p className="text-yellow-400 text-xs font-semibold mb-1">
                  🎯 Your Mission
                </p>
                <p className="text-[#8B949E] text-xs leading-relaxed">
                  Read each email carefully. Identify which ones are phishing attempts.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Email List */}
        <div className="w-80 border-r border-[#30363D] flex flex-col bg-[#0D1117]">
          {/* Search */}
          <div className="p-3 border-b border-[#30363D]">
            <div className="flex items-center gap-2 bg-[#161B22] border border-[#30363D]
                            rounded-full px-3 py-2">
              <Search size={14} className="text-[#8B949E]" />
              <input
                type="text"
                placeholder="Search mail"
                className="bg-transparent text-[#E6EDF3] text-sm outline-none
                           placeholder:text-[#8B949E] flex-1"
              />
            </div>
          </div>

          {/* Email list */}
          <div className="flex-1 overflow-y-auto">
            {emails.map((email) => (
              <div
                key={email.id}
                onClick={() => handleEmailClick(email)}
                className={`flex items-start gap-3 px-4 py-3 cursor-pointer
                            border-b border-[#30363D] transition-colors
                            ${selectedEmail?.id === email.id
                              ? "bg-blue-500/10 border-l-2 border-l-blue-500"
                              : "hover:bg-[#161B22]"
                            }
                            ${!email.read ? "bg-[#161B22]" : ""}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center
                                 flex-shrink-0 text-sm font-bold
                                 ${email.isPhishing
                                   ? "bg-red-500/20 text-red-400"
                                   : "bg-blue-500/20 text-blue-400"
                                 }`}>
                  {email.fromName.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={`text-sm truncate ${!email.read ? "font-semibold text-white" : "text-[#E6EDF3]"}`}>
                      {email.fromName}
                    </p>
                    <p className="text-xs text-[#8B949E] flex-shrink-0 ml-2">{email.time}</p>
                  </div>
                  <p className={`text-xs truncate mb-0.5 ${!email.read ? "font-medium text-[#E6EDF3]" : "text-[#8B949E]"}`}>
                    {email.subject}
                  </p>
                  <p className="text-xs text-[#8B949E] truncate">{email.preview}</p>
                </div>

                {/* Indicators */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {!email.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                  {answered.includes(email.id) && (
                    <CheckCircle size={12} className="text-green-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Reading Pane */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedEmail ? (
            <>
              {/* Email Header */}
              <div className="bg-[#161B22] border-b border-[#30363D] p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex-1 pr-4">
                    {selectedEmail.subject}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button className="text-[#8B949E] hover:text-white p-1">
                      <Reply size={18} />
                    </button>
                    <button className="text-[#8B949E] hover:text-white p-1">
                      <Forward size={18} />
                    </button>
                    <button className="text-[#8B949E] hover:text-white p-1">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center
                                   text-sm font-bold flex-shrink-0
                                   ${selectedEmail.isPhishing
                                     ? "bg-red-500/20 text-red-400"
                                     : "bg-blue-500/20 text-blue-400"
                                   }`}>
                    {selectedEmail.fromName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium text-sm">
                        {selectedEmail.fromName}
                      </p>
                      <p className="text-[#8B949E] text-xs">
                        &lt;{selectedEmail.from}&gt;
                      </p>
                    </div>
                    <p className="text-[#8B949E] text-xs mt-0.5">
                      to me • {selectedEmail.time}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-2xl">
                  <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 mb-6">
                    <pre className="text-[#E6EDF3] text-sm leading-relaxed whitespace-pre-wrap font-sans">
                      {selectedEmail.body}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Judge Panel */}
              {!answered.includes(selectedEmail.id) && (
                <div className="bg-[#161B22] border-t border-[#30363D] p-4">
                  <p className="text-white font-semibold text-sm text-center mb-3">
                    🤔 Is this email legitimate or a phishing attempt?
                  </p>
                  <div className="flex gap-3 max-w-md mx-auto">
                    <button
                      onClick={() => handleJudge(false)}
                      className="flex-1 bg-green-500/10 border border-green-500/30
                                 hover:bg-green-500/20 text-green-400 font-semibold
                                 py-3 rounded-xl text-sm transition-colors flex
                                 items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Legitimate Email
                    </button>
                    <button
                      onClick={() => handleJudge(true)}
                      className="flex-1 bg-red-500/10 border border-red-500/30
                                 hover:bg-red-500/20 text-red-400 font-semibold
                                 py-3 rounded-xl text-sm transition-colors flex
                                 items-center justify-center gap-2"
                    >
                      <AlertTriangle size={16} />
                      Phishing Email
                    </button>
                  </div>
                </div>
              )}

              {answered.includes(selectedEmail.id) && (
                <div className="bg-[#161B22] border-t border-[#30363D] p-4 text-center">
                  <p className="text-green-400 text-sm font-medium">
                    ✅ You have already judged this email
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Inbox className="text-[#30363D] mx-auto mb-4" size={64} />
                <p className="text-[#8B949E] text-lg font-medium">Select an email to read</p>
                <p className="text-[#8B949E] text-sm mt-1">
                  Click on any email from the list to start
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
