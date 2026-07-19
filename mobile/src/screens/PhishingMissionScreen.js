// ============================================================
// src/screens/PhishingMissionScreen.js
// Mission 1 — Phishing Email Detection (Mobile)
// Looks like a real email app
// ============================================================

import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, TextInput,
  Modal, FlatList,
} from "react-native";

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
    clues: [
      "Sender domain is 'bankislami-verify.com' — not official",
      "Creates urgency with '24 hours' threat",
      "Link goes to suspicious '.xyz' domain",
      "Asks for PIN/Password — banks never do this",
    ],
  },
  {
    id: 2,
    from: "noreply@github.com",
    fromName: "GitHub",
    subject: "Your pull request has been merged",
    preview: "Congratulations! Your pull request #142 has been merged...",
    time: "9:15 AM",
    read: true,
    isPhishing: false,
    body: `Hi faizanfakhar,

Your pull request #142 "feat: add authentication system" has been successfully merged into the main branch.

View the changes at:
https://github.com/faizanfakhar/fyp-f25-cybersecurity-game/pull/142

Thanks for your contribution!

The GitHub Team`,
    clues: [],
  },
  {
    id: 3,
    from: "hr@company-jobs-pk.net",
    fromName: "HR Department",
    subject: "You have been selected for a job offer - Confirm NOW",
    preview: "Congratulations! You have been selected for a high paying job...",
    time: "Yesterday",
    read: false,
    isPhishing: true,
    body: `Congratulations!!!

You have been SELECTED for a high-paying remote job. Salary: PKR 150,000/month.

To confirm your position, please send us:
• Copy of your CNIC
• Bank account details
• Home address

Send fee of PKR 5,000 to confirm your slot immediately!

HR Department`,
    clues: [
      "Suspicious domain 'company-jobs-pk.net'",
      "Asks for personal documents and bank details",
      "Requires upfront payment — classic scam",
      "Excessive urgency and pressure tactics",
    ],
  },
  {
    id: 4,
    from: "no-reply@google.com",
    fromName: "Google",
    subject: "Security alert for your Google Account",
    preview: "A new sign-in on Windows. If this was you...",
    time: "Yesterday",
    read: true,
    isPhishing: false,
    body: `Hi Faizan,

Your Google Account was just signed in to from a new Windows device. If this was you, you don't need to do anything.

If you didn't sign in recently, your account may be compromised. Review activity at myaccount.google.com

The Google Accounts team`,
    clues: [],
  },
];

// ─── Result Modal ────────────────────────────────────────────
function ResultModal({ visible, correct, email, onClose, onNext }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalIcon}>{correct ? "✅" : "❌"}</Text>
          <Text style={styles.modalTitle}>
            {correct ? "Correct! 🎉" : "Incorrect!"}
          </Text>
          {correct && (
            <Text style={styles.modalPoints}>+100 points earned</Text>
          )}

          {email?.isPhishing && (
            <View style={styles.cluesBox}>
              <Text style={styles.cluesTitle}>🚨 Phishing Clues:</Text>
              {email.clues.map((clue, i) => (
                <Text key={i} style={styles.clueItem}>• {clue}</Text>
              ))}
            </View>
          )}

          {!email?.isPhishing && (
            <View style={styles.legitimateBox}>
              <Text style={styles.legitimateTitle}>✅ This was legitimate because:</Text>
              <Text style={styles.clueItem}>• Official sender domain</Text>
              <Text style={styles.clueItem}>• No requests for passwords</Text>
              <Text style={styles.clueItem}>• Professional tone</Text>
            </View>
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalBtnSecondary} onPress={onClose}>
              <Text style={styles.modalBtnSecondaryText}>Continue Reading</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtnPrimary} onPress={onNext}>
              <Text style={styles.modalBtnPrimaryText}>Next Email →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Complete Screen ─────────────────────────────────────────
export default function PhishingMissionScreen({ navigation }) {
  const [emails, setEmails]         = useState(EMAILS);
  const [selectedEmail, setSelected] = useState(null);
  const [answered, setAnswered]     = useState([]);
  const [score, setScore]           = useState(0);
  const [result, setResult]         = useState(null);
  const [complete, setComplete]     = useState(false);

  const handleSelect = (email) => {
    setSelected(email);
    setEmails(prev => prev.map(e => e.id === email.id ? { ...e, read: true } : e));
  };

  const handleJudge = (isPhishing) => {
    const correct = isPhishing === selectedEmail.isPhishing;
    if (correct) setScore(s => s + 100);
    const newAnswered = [...answered, selectedEmail.id];
    setAnswered(newAnswered);
    setResult({ correct, email: selectedEmail });
    if (newAnswered.length >= EMAILS.length) {
      setTimeout(() => setComplete(true), 2000);
    }
  };

  const handleNext = () => {
    setResult(null);
    const next = emails.find(e => !answered.includes(e.id) && e.id !== selectedEmail?.id);
    if (next) setSelected(next);
    else setSelected(null);
  };

  // Mission Complete
  if (complete) {
    const pct = Math.round((score / (EMAILS.length * 100)) * 100);
    return (
      <SafeAreaView style={styles.completeContainer}>
        <Text style={styles.completeEmoji}>
          {pct >= 75 ? "🏆" : pct >= 50 ? "🥈" : "📚"}
        </Text>
        <Text style={styles.completeTitle}>Mission Complete!</Text>
        <Text style={styles.completeSub}>Phishing Email Detection</Text>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreValue}>{score}</Text>
          <Text style={styles.scoreLabel}>Total Score</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{pct}%</Text>
            <Text style={styles.statLbl}>Accuracy</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{EMAILS.length}</Text>
            <Text style={styles.statLbl}>Emails</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{EMAILS.filter(e => e.isPhishing).length}</Text>
            <Text style={styles.statLbl}>Phishing</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Result Modal */}
      <ResultModal
        visible={!!result}
        correct={result?.correct}
        email={result?.email}
        onClose={() => setResult(null)}
        onNext={handleNext}
      />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.exitBtn}>← Exit</Text>
        </TouchableOpacity>
        <View style={styles.topCenter}>
          <Text style={styles.topTitle}>🛡️ Phishing Detection</Text>
          <Text style={styles.topSub}>Identify phishing emails</Text>
        </View>
        <View style={styles.topRight}>
          <Text style={styles.scoreText}>{score} pts</Text>
          <Text style={styles.progressText}>{answered.length}/{EMAILS.length}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(answered.length / EMAILS.length) * 100}%` }]} />
      </View>

      {selectedEmail ? (
        // Email Reading View
        <ScrollView style={styles.emailView}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backToInbox} onPress={() => setSelected(null)}>
            <Text style={styles.backToInboxText}>← Back to Inbox</Text>
          </TouchableOpacity>

          {/* Email Header */}
          <View style={styles.emailHeader}>
            <Text style={styles.emailSubject}>{selectedEmail.subject}</Text>
            <View style={styles.senderRow}>
              <View style={[styles.senderAvatar,
                { backgroundColor: selectedEmail.isPhishing ? "rgba(239,68,68,0.2)" : "rgba(59,130,246,0.2)" }]}>
                <Text style={[styles.senderAvatarText,
                  { color: selectedEmail.isPhishing ? "#F87171" : "#60A5FA" }]}>
                  {selectedEmail.fromName.charAt(0)}
                </Text>
              </View>
              <View style={styles.senderInfo}>
                <Text style={styles.senderName}>{selectedEmail.fromName}</Text>
                <Text style={styles.senderEmail}>{selectedEmail.from}</Text>
                <Text style={styles.senderTime}>{selectedEmail.time}</Text>
              </View>
            </View>
          </View>

          {/* Email Body */}
          <View style={styles.emailBody}>
            <Text style={styles.emailBodyText}>{selectedEmail.body}</Text>
          </View>

          {/* Judge Buttons */}
          {!answered.includes(selectedEmail.id) ? (
            <View style={styles.judgeSection}>
              <Text style={styles.judgeQuestion}>
                🤔 Is this email legitimate or phishing?
              </Text>
              <View style={styles.judgeButtons}>
                <TouchableOpacity
                  style={styles.legitimateBtn}
                  onPress={() => handleJudge(false)}
                >
                  <Text style={styles.legitimateBtnText}>✅ Legitimate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.phishingBtn}
                  onPress={() => handleJudge(true)}
                >
                  <Text style={styles.phishingBtnText}>🎣 Phishing</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.answeredBadge}>
              <Text style={styles.answeredText}>✅ Already judged</Text>
            </View>
          )}
        </ScrollView>
      ) : (
        // Inbox View
        <View style={styles.inbox}>
          {/* Search */}
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search mail"
              placeholderTextColor="#8B949E"
            />
          </View>

          {/* Mission Hint */}
          <View style={styles.hint}>
            <Text style={styles.hintText}>
              🎯 Read each email carefully and identify which ones are phishing attempts.
            </Text>
          </View>

          {/* Email List */}
          <FlatList
            data={emails}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.emailRow, !item.read && styles.emailRowUnread]}
                onPress={() => handleSelect(item)}
              >
                <View style={[styles.emailAvatar,
                  { backgroundColor: item.isPhishing ? "rgba(239,68,68,0.15)" : "rgba(59,130,246,0.15)" }]}>
                  <Text style={[styles.emailAvatarText,
                    { color: item.isPhishing ? "#F87171" : "#60A5FA" }]}>
                    {item.fromName.charAt(0)}
                  </Text>
                </View>
                <View style={styles.emailMeta}>
                  <View style={styles.emailMetaTop}>
                    <Text style={[styles.emailSender, !item.read && styles.emailSenderBold]}>
                      {item.fromName}
                    </Text>
                    <Text style={styles.emailTime}>{item.time}</Text>
                  </View>
                  <Text style={[styles.emailSubjectList, !item.read && styles.emailSubjectBold]}
                    numberOfLines={1}>
                    {item.subject}
                  </Text>
                  <Text style={styles.emailPreview} numberOfLines={1}>{item.preview}</Text>
                </View>
                <View style={styles.emailIndicators}>
                  {!item.read && <View style={styles.unreadDot} />}
                  {answered.includes(item.id) && <Text style={styles.answeredDot}>✓</Text>}
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: "#0D1117" },

  // Top Bar
  topBar: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#161B22", borderBottomWidth: 1,
    borderBottomColor: "#30363D", paddingHorizontal: 16, paddingVertical: 12,
  },
  exitBtn:            { color: "#8B949E", fontSize: 14, fontWeight: "500" },
  topCenter:          { flex: 1, alignItems: "center" },
  topTitle:           { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  topSub:             { color: "#8B949E", fontSize: 11, marginTop: 1 },
  topRight:           { alignItems: "flex-end" },
  scoreText:          { color: "#06B6D4", fontSize: 13, fontWeight: "700" },
  progressText:       { color: "#8B949E", fontSize: 11 },

  // Progress Bar
  progressBar:        { height: 3, backgroundColor: "#30363D" },
  progressFill:       { height: 3, backgroundColor: "#06B6D4" },

  // Inbox
  inbox:              { flex: 1 },
  searchBar: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#161B22", margin: 12,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: "#30363D",
  },
  searchIcon:         { fontSize: 14, marginRight: 8 },
  searchInput:        { flex: 1, color: "#E6EDF3", fontSize: 14 },
  hint: {
    backgroundColor: "rgba(245,158,11,0.1)", borderWidth: 1,
    borderColor: "rgba(245,158,11,0.3)", borderRadius: 10,
    marginHorizontal: 12, marginBottom: 8, padding: 10,
  },
  hintText:           { color: "#F59E0B", fontSize: 12, lineHeight: 18 },

  // Email Row
  emailRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: "#30363D",
  },
  emailRowUnread:     { backgroundColor: "#161B22" },
  emailAvatar: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  emailAvatarText:    { fontSize: 16, fontWeight: "700" },
  emailMeta:          { flex: 1 },
  emailMetaTop:       { flexDirection: "row", justifyContent: "space-between" },
  emailSender:        { color: "#8B949E", fontSize: 14 },
  emailSenderBold:    { color: "#FFFFFF", fontWeight: "600" },
  emailTime:          { color: "#8B949E", fontSize: 12 },
  emailSubjectList:   { color: "#8B949E", fontSize: 13, marginTop: 2 },
  emailSubjectBold:   { color: "#E6EDF3", fontWeight: "500" },
  emailPreview:       { color: "#8B949E", fontSize: 12, marginTop: 1 },
  emailIndicators:    { marginLeft: 8, alignItems: "center", gap: 4 },
  unreadDot:          { width: 8, height: 8, borderRadius: 4, backgroundColor: "#3B82F6" },
  answeredDot:        { color: "#22C55E", fontSize: 12 },

  // Email View
  emailView:          { flex: 1 },
  backToInbox: {
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: "#30363D",
  },
  backToInboxText:    { color: "#06B6D4", fontSize: 14 },
  emailHeader: {
    backgroundColor: "#161B22", padding: 16,
    borderBottomWidth: 1, borderBottomColor: "#30363D",
  },
  emailSubject:       { color: "#FFFFFF", fontSize: 16, fontWeight: "600", marginBottom: 12 },
  senderRow:          { flexDirection: "row", alignItems: "center" },
  senderAvatar: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  senderAvatarText:   { fontSize: 18, fontWeight: "700" },
  senderInfo:         { flex: 1 },
  senderName:         { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
  senderEmail:        { color: "#8B949E", fontSize: 12, marginTop: 2 },
  senderTime:         { color: "#8B949E", fontSize: 11, marginTop: 1 },
  emailBody:          { padding: 16, marginBottom: 8 },
  emailBodyText:      { color: "#E6EDF3", fontSize: 14, lineHeight: 22 },

  // Judge Section
  judgeSection: {
    margin: 16, backgroundColor: "#161B22",
    borderRadius: 12, borderWidth: 1,
    borderColor: "#30363D", padding: 16,
  },
  judgeQuestion:      { color: "#FFFFFF", fontSize: 14, fontWeight: "600", textAlign: "center", marginBottom: 12 },
  judgeButtons:       { flexDirection: "row", gap: 10 },
  legitimateBtn: {
    flex: 1, backgroundColor: "rgba(34,197,94,0.1)",
    borderWidth: 1, borderColor: "rgba(34,197,94,0.3)",
    borderRadius: 10, paddingVertical: 12, alignItems: "center",
  },
  legitimateBtnText:  { color: "#22C55E", fontSize: 14, fontWeight: "600" },
  phishingBtn: {
    flex: 1, backgroundColor: "rgba(239,68,68,0.1)",
    borderWidth: 1, borderColor: "rgba(239,68,68,0.3)",
    borderRadius: 10, paddingVertical: 12, alignItems: "center",
  },
  phishingBtnText:    { color: "#F87171", fontSize: 14, fontWeight: "600" },
  answeredBadge: {
    margin: 16, padding: 12, backgroundColor: "rgba(34,197,94,0.1)",
    borderRadius: 10, alignItems: "center",
  },
  answeredText:       { color: "#22C55E", fontSize: 14 },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center", alignItems: "center", padding: 20,
  },
  modalCard: {
    backgroundColor: "#161B22", borderRadius: 20,
    borderWidth: 1, borderColor: "#30363D",
    padding: 24, width: "100%",
  },
  modalIcon:          { fontSize: 48, textAlign: "center", marginBottom: 8 },
  modalTitle:         { color: "#FFFFFF", fontSize: 20, fontWeight: "700", textAlign: "center" },
  modalPoints:        { color: "#22C55E", fontSize: 14, textAlign: "center", marginTop: 4 },
  cluesBox: {
    backgroundColor: "rgba(239,68,68,0.1)", borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)", borderRadius: 10,
    padding: 12, marginTop: 16,
  },
  cluesTitle:         { color: "#F87171", fontSize: 13, fontWeight: "600", marginBottom: 6 },
  clueItem:           { color: "#E6EDF3", fontSize: 12, lineHeight: 20, marginBottom: 2 },
  legitimateBox: {
    backgroundColor: "rgba(34,197,94,0.1)", borderWidth: 1,
    borderColor: "rgba(34,197,94,0.3)", borderRadius: 10,
    padding: 12, marginTop: 16,
  },
  legitimateTitle:    { color: "#22C55E", fontSize: 13, fontWeight: "600", marginBottom: 6 },
  modalButtons:       { flexDirection: "row", gap: 10, marginTop: 16 },
  modalBtnSecondary: {
    flex: 1, borderWidth: 1, borderColor: "#30363D",
    borderRadius: 10, paddingVertical: 12, alignItems: "center",
  },
  modalBtnSecondaryText: { color: "#8B949E", fontSize: 13 },
  modalBtnPrimary: {
    flex: 1, backgroundColor: "#06B6D4",
    borderRadius: 10, paddingVertical: 12, alignItems: "center",
  },
  modalBtnPrimaryText: { color: "#000", fontSize: 13, fontWeight: "600" },

  // Complete Screen
  completeContainer: {
    flex: 1, backgroundColor: "#0D1117",
    alignItems: "center", justifyContent: "center", padding: 24,
  },
  completeEmoji:      { fontSize: 64, marginBottom: 16 },
  completeTitle:      { color: "#FFFFFF", fontSize: 24, fontWeight: "700" },
  completeSub:        { color: "#8B949E", fontSize: 14, marginTop: 4, marginBottom: 24 },
  scoreBox: {
    backgroundColor: "#161B22", borderRadius: 16,
    borderWidth: 1, borderColor: "#30363D",
    padding: 24, alignItems: "center", width: "100%", marginBottom: 16,
  },
  scoreValue:         { color: "#06B6D4", fontSize: 48, fontWeight: "700" },
  scoreLabel:         { color: "#8B949E", fontSize: 14, marginTop: 4 },
  statsRow:           { flexDirection: "row", gap: 12, marginBottom: 24, width: "100%" },
  statBox: {
    flex: 1, backgroundColor: "#161B22", borderRadius: 12,
    borderWidth: 1, borderColor: "#30363D",
    padding: 16, alignItems: "center",
  },
  statVal:            { color: "#FFFFFF", fontSize: 22, fontWeight: "700" },
  statLbl:            { color: "#8B949E", fontSize: 11, marginTop: 2 },
  backBtn: {
    width: "100%", backgroundColor: "#06B6D4",
    borderRadius: 12, paddingVertical: 16, alignItems: "center",
  },
  backBtnText:        { color: "#000", fontSize: 16, fontWeight: "600" },
});
