// ============================================================
// src/screens/MissionsScreen.js — All Missions Screen
// ============================================================

import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from "react-native";

const MISSIONS = [
  {
    id: 1, title: "Phishing Attack Scenario",
    sector: "Banking", difficulty: "Easy",
    points: 500, icon: "🎯", available: true,
    description: "Identify and avoid phishing emails targeting bank customers.",
  },
  {
    id: 2, title: "Corporate Network Breach",
    sector: "Corporate", difficulty: "Medium",
    points: 800, icon: "🏢", available: false,
    description: "Detect and respond to a corporate network intrusion attempt.",
  },
  {
    id: 3, title: "Healthcare Data Theft",
    sector: "Healthcare", difficulty: "Hard",
    points: 1000, icon: "🏥", available: false,
    description: "Protect sensitive patient data from cybercriminals.",
  },
  {
    id: 4, title: "Ransomware Defense",
    sector: "Corporate", difficulty: "Hard",
    points: 1200, icon: "🔐", available: false,
    description: "Stop a ransomware attack before it encrypts critical files.",
  },
  {
    id: 5, title: "Social Engineering Attack",
    sector: "General", difficulty: "Medium",
    points: 700, icon: "🎭", available: false,
    description: "Recognize and counter social engineering manipulation tactics.",
  },
];

const DIFFICULTY_COLORS = {
  Easy:   { bg: "rgba(34,197,94,0.1)",  text: "#22C55E" },
  Medium: { bg: "rgba(245,158,11,0.1)", text: "#F59E0B" },
  Hard:   { bg: "rgba(239,68,68,0.1)",  text: "#EF4444" },
};

export default function MissionsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Missions</Text>
        <Text style={styles.headerSub}>Complete missions to earn points</Text>
      </View>

      <ScrollView style={styles.scroll}>
        {MISSIONS.map((mission) => {
          const diff = DIFFICULTY_COLORS[mission.difficulty];
          return (
            <View key={mission.id}
              style={[styles.card, !mission.available && styles.cardLocked]}>

              <View style={styles.cardTop}>
                <Text style={styles.icon}>
                  {mission.available ? mission.icon : "🔒"}
                </Text>
                <View style={styles.cardInfo}>
                  <Text style={styles.title}>{mission.title}</Text>
                  <Text style={styles.description}>{mission.description}</Text>
                  <View style={styles.tags}>
                    <Text style={styles.sector}>{mission.sector}</Text>
                    <View style={[styles.diffBadge, { backgroundColor: diff.bg }]}>
                      <Text style={[styles.diffText, { color: diff.text }]}>
                        {mission.difficulty}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.cardBottom}>
                <Text style={styles.points}>+{mission.points} pts</Text>
                {mission.available ? (
                  <TouchableOpacity style={styles.startBtn}>
                    <Text style={styles.startBtnText}>▶ Start Mission</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.locked}>🔒 Locked</Text>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: "#0D1117" },
  header: {
    backgroundColor: "#161B22", borderBottomWidth: 1,
    borderBottomColor: "#30363D", padding: 20,
  },
  headerTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "700" },
  headerSub:   { color: "#8B949E", fontSize: 13, marginTop: 2 },
  scroll:      { padding: 16 },
  card: {
    backgroundColor: "#161B22", borderRadius: 12,
    borderWidth: 1, borderColor: "#30363D",
    padding: 16, marginBottom: 12,
  },
  cardLocked:  { opacity: 0.6 },
  cardTop:     { flexDirection: "row", gap: 12, marginBottom: 12 },
  icon:        { fontSize: 32 },
  cardInfo:    { flex: 1 },
  title:       { color: "#E6EDF3", fontSize: 15, fontWeight: "600", marginBottom: 4 },
  description: { color: "#8B949E", fontSize: 12, lineHeight: 18, marginBottom: 8 },
  tags:        { flexDirection: "row", alignItems: "center", gap: 8 },
  sector:      { color: "#8B949E", fontSize: 11 },
  diffBadge:   { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  diffText:    { fontSize: 11, fontWeight: "600" },
  cardBottom:  { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  points:      { color: "#06B6D4", fontSize: 14, fontWeight: "700" },
  startBtn: {
    backgroundColor: "#06B6D4", borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  startBtnText: { color: "#000", fontSize: 13, fontWeight: "600" },
  locked:       { color: "#8B949E", fontSize: 13 },
});
