// ============================================================
// src/screens/DashboardScreen.js — Player Dashboard
// ============================================================

import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from "react-native";
import { useAuth } from "../context/AuthContext";

const MISSIONS = [
  { id: 1, title: "Phishing Attack Scenario", sector: "Banking",    difficulty: "Medium", points: 500,  icon: "🎯", available: true  },
  { id: 2, title: "Corporate Network Breach",  sector: "Corporate",  difficulty: "Hard",   points: 800,  icon: "🏢", available: false },
  { id: 3, title: "Healthcare Data Theft",     sector: "Healthcare", difficulty: "Hard",   points: 1000, icon: "🏥", available: false },
];

export default function DashboardScreen() {
  const { user, userData } = useAuth();

  const displayName       = userData?.displayName || user?.displayName || "Player";
  const level             = userData?.level             ?? 1;
  const totalScore        = userData?.totalScore        ?? 0;
  const missionsCompleted = userData?.missionsCompleted ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>CyberGame</Text>
            <Text style={styles.headerSub}>Training Platform</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>⚡ Level {level}</Text>
          </View>
        </View>

        <View style={styles.content}>

          {/* Welcome */}
          <Text style={styles.welcome}>Welcome back, {displayName.split(" ")[0]}! 👋</Text>
          <Text style={styles.welcomeSub}>Continue your training — complete a mission today.</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⚡</Text>
              <Text style={styles.statValue}>{level}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={styles.statValue}>{totalScore}</Text>
              <Text style={styles.statLabel}>Score</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🎯</Text>
              <Text style={styles.statValue}>{missionsCompleted}</Text>
              <Text style={styles.statLabel}>Missions</Text>
            </View>
          </View>

          {/* Missions */}
          <Text style={styles.sectionTitle}>Available Missions</Text>
          {MISSIONS.map((mission) => (
            <View key={mission.id}
              style={[styles.missionCard, !mission.available && styles.missionLocked]}>
              <Text style={styles.missionIcon}>{mission.available ? mission.icon : "🔒"}</Text>
              <View style={styles.missionInfo}>
                <Text style={styles.missionTitle}>{mission.title}</Text>
                <Text style={styles.missionSector}>Sector: {mission.sector}</Text>
              </View>
              <View style={styles.missionRight}>
                <Text style={styles.missionPoints}>+{mission.points} pts</Text>
                {mission.available && (
                  <TouchableOpacity style={styles.startBtn}>
                    <Text style={styles.startBtnText}>▶ Start</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: "#0D1117" },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "#161B22", borderBottomWidth: 1, borderBottomColor: "#30363D",
    paddingHorizontal: 20, paddingVertical: 16,
  },
  headerTitle:  { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
  headerSub:    { color: "#8B949E", fontSize: 11 },
  levelBadge: {
    backgroundColor: "rgba(168,85,247,0.1)", borderWidth: 1,
    borderColor: "rgba(168,85,247,0.3)", borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  levelText:    { color: "#A855F7", fontSize: 12, fontWeight: "600" },
  content:      { padding: 20 },
  welcome:      { color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginBottom: 4 },
  welcomeSub:   { color: "#8B949E", fontSize: 13, marginBottom: 24 },
  statsRow:     { flexDirection: "row", gap: 12, marginBottom: 28 },
  statCard: {
    flex: 1, backgroundColor: "#161B22", borderRadius: 12,
    borderWidth: 1, borderColor: "#30363D", padding: 16, alignItems: "center",
  },
  statIcon:     { fontSize: 20, marginBottom: 6 },
  statValue:    { color: "#FFFFFF", fontSize: 22, fontWeight: "700" },
  statLabel:    { color: "#8B949E", fontSize: 11, marginTop: 2 },
  sectionTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "600", marginBottom: 12 },
  missionCard: {
    backgroundColor: "#161B22", borderRadius: 12,
    borderWidth: 1, borderColor: "#30363D",
    flexDirection: "row", alignItems: "center",
    padding: 14, marginBottom: 10,
  },
  missionLocked:  { opacity: 0.5 },
  missionIcon:    { fontSize: 28, marginRight: 12 },
  missionInfo:    { flex: 1 },
  missionTitle:   { color: "#E6EDF3", fontSize: 14, fontWeight: "500" },
  missionSector:  { color: "#8B949E", fontSize: 12, marginTop: 2 },
  missionRight:   { alignItems: "flex-end" },
  missionPoints:  { color: "#06B6D4", fontSize: 13, fontWeight: "600" },
  startBtn: {
    backgroundColor: "#06B6D4", borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 4, marginTop: 4,
  },
  startBtnText:   { color: "#000", fontSize: 11, fontWeight: "600" },
});
