// ============================================================
// src/screens/ProfileScreen.js — User Profile Screen
// ============================================================

import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

const ACHIEVEMENTS = [
  { icon: "🎯", title: "First Mission",    desc: "Completed your first mission",   earned: true  },
  { icon: "🔥", title: "On Fire",          desc: "Complete 3 missions in a row",   earned: false },
  { icon: "🛡️", title: "Cyber Defender",   desc: "Score over 1000 points",         earned: false },
  { icon: "🏆", title: "Top Player",       desc: "Reach the top 10 leaderboard",   earned: false },
  { icon: "⚡", title: "Speed Runner",     desc: "Complete a mission under 2 mins", earned: false },
];

export default function ProfileScreen({ navigation }) {
  const { user, userData } = useAuth();

  const displayName       = userData?.displayName || user?.displayName || "Player";
  const email             = userData?.email        || user?.email       || "";
  const level             = userData?.level             ?? 1;
  const totalScore        = userData?.totalScore        ?? 0;
  const missionsCompleted = userData?.missionsCompleted ?? 0;

  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>⚡ Level {level} Cyber Defender</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalScore.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Score</Text>
          </View>
          <View style={[styles.statBox, styles.statBorder]}>
            <Text style={styles.statValue}>{missionsCompleted}</Text>
            <Text style={styles.statLabel}>Missions Done</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{level}</Text>
            <Text style={styles.statLabel}>Current Level</Text>
          </View>
        </View>

        {/* XP Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>XP Progress to Next Level</Text>
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: `${(totalScore % 1000) / 10}%` }]} />
          </View>
          <Text style={styles.xpText}>{totalScore % 1000} / 1000 XP</Text>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {ACHIEVEMENTS.map((item, idx) => (
            <View key={idx}
              style={[styles.achievementRow, !item.earned && styles.achievementLocked]}>
              <Text style={styles.achievementIcon}>{item.icon}</Text>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{item.title}</Text>
                <Text style={styles.achievementDesc}>{item.desc}</Text>
              </View>
              {item.earned && <Text style={styles.earned}>✅</Text>}
            </View>
          ))}
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: "#0D1117" },
  profileHeader: {
    backgroundColor: "#161B22", borderBottomWidth: 1,
    borderBottomColor: "#30363D", padding: 24, alignItems: "center",
  },
  avatarLarge: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "rgba(6,182,212,0.15)",
    borderWidth: 2, borderColor: "#06B6D4",
    alignItems: "center", justifyContent: "center", marginBottom: 12,
  },
  avatarText:       { color: "#06B6D4", fontSize: 32, fontWeight: "700" },
  name:             { color: "#FFFFFF", fontSize: 20, fontWeight: "700" },
  email:            { color: "#8B949E", fontSize: 13, marginTop: 4 },
  levelBadge: {
    marginTop: 10, backgroundColor: "rgba(168,85,247,0.1)",
    borderWidth: 1, borderColor: "rgba(168,85,247,0.3)",
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 4,
  },
  levelText:        { color: "#A855F7", fontSize: 13, fontWeight: "600" },
  statsRow: {
    flexDirection: "row", backgroundColor: "#161B22",
    borderBottomWidth: 1, borderBottomColor: "#30363D",
  },
  statBox:          { flex: 1, padding: 16, alignItems: "center" },
  statBorder:       { borderLeftWidth: 1, borderRightWidth: 1, borderColor: "#30363D" },
  statValue:        { color: "#FFFFFF", fontSize: 22, fontWeight: "700" },
  statLabel:        { color: "#8B949E", fontSize: 11, marginTop: 2 },
  section:          { padding: 20 },
  sectionTitle:     { color: "#FFFFFF", fontSize: 16, fontWeight: "600", marginBottom: 12 },
  xpBar: {
    height: 8, backgroundColor: "#30363D",
    borderRadius: 4, overflow: "hidden", marginBottom: 6,
  },
  xpFill:           { height: "100%", backgroundColor: "#A855F7", borderRadius: 4 },
  xpText:           { color: "#8B949E", fontSize: 12 },
  achievementRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#161B22", borderRadius: 10,
    borderWidth: 1, borderColor: "#30363D",
    padding: 12, marginBottom: 8, gap: 12,
  },
  achievementLocked: { opacity: 0.4 },
  achievementIcon:   { fontSize: 24 },
  achievementInfo:   { flex: 1 },
  achievementTitle:  { color: "#E6EDF3", fontSize: 14, fontWeight: "500" },
  achievementDesc:   { color: "#8B949E", fontSize: 12, marginTop: 2 },
  earned:            { fontSize: 16 },
  logoutBtn: {
    margin: 20, borderWidth: 1, borderColor: "#30363D",
    borderRadius: 8, paddingVertical: 14, alignItems: "center",
  },
  logoutText:        { color: "#F87171", fontSize: 14, fontWeight: "500" },
});
