// ============================================================
// src/screens/LeaderboardScreen.js — Top Players Leaderboard
// ============================================================

import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
} from "react-native";

const PLAYERS = [
  { rank: 1, name: "Faizan Fakhar",   score: 4500, level: 9,  missions: 12, avatar: "F" },
  { rank: 2, name: "M. Hammad",       score: 3800, level: 8,  missions: 10, avatar: "H" },
  { rank: 3, name: "Ali Hassan",      score: 3200, level: 7,  missions: 8,  avatar: "A" },
  { rank: 4, name: "Sara Ahmed",      score: 2900, level: 6,  missions: 7,  avatar: "S" },
  { rank: 5, name: "Omar Khan",       score: 2600, level: 5,  missions: 6,  avatar: "O" },
  { rank: 6, name: "Ayesha Malik",    score: 2300, level: 5,  missions: 5,  avatar: "A" },
  { rank: 7, name: "Bilal Ahmed",     score: 2000, level: 4,  missions: 4,  avatar: "B" },
  { rank: 8, name: "Fatima Zahra",    score: 1800, level: 4,  missions: 4,  avatar: "F" },
  { rank: 9, name: "Hassan Ali",      score: 1500, level: 3,  missions: 3,  avatar: "H" },
  { rank: 10, name: "Zara Sheikh",    score: 1200, level: 3,  missions: 3,  avatar: "Z" },
];

const RANK_COLORS = {
  1: "#FFD700",
  2: "#C0C0C0",
  3: "#CD7F32",
};

export default function LeaderboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏆 Leaderboard</Text>
        <Text style={styles.headerSub}>Top cybersecurity defenders</Text>
      </View>

      {/* Top 3 Podium */}
      <View style={styles.podium}>
        {/* 2nd Place */}
        <View style={styles.podiumItem}>
          <View style={[styles.podiumAvatar, { borderColor: "#C0C0C0" }]}>
            <Text style={styles.podiumAvatarText}>{PLAYERS[1].avatar}</Text>
          </View>
          <Text style={styles.podiumName} numberOfLines={1}>{PLAYERS[1].name.split(" ")[0]}</Text>
          <View style={[styles.podiumBase, { height: 60, backgroundColor: "#C0C0C0" }]}>
            <Text style={styles.podiumRank}>2</Text>
          </View>
        </View>

        {/* 1st Place */}
        <View style={styles.podiumItem}>
          <Text style={styles.crown}>👑</Text>
          <View style={[styles.podiumAvatar, { borderColor: "#FFD700", width: 56, height: 56 }]}>
            <Text style={[styles.podiumAvatarText, { fontSize: 22 }]}>{PLAYERS[0].avatar}</Text>
          </View>
          <Text style={styles.podiumName} numberOfLines={1}>{PLAYERS[0].name.split(" ")[0]}</Text>
          <View style={[styles.podiumBase, { height: 80, backgroundColor: "#FFD700" }]}>
            <Text style={styles.podiumRank}>1</Text>
          </View>
        </View>

        {/* 3rd Place */}
        <View style={styles.podiumItem}>
          <View style={[styles.podiumAvatar, { borderColor: "#CD7F32" }]}>
            <Text style={styles.podiumAvatarText}>{PLAYERS[2].avatar}</Text>
          </View>
          <Text style={styles.podiumName} numberOfLines={1}>{PLAYERS[2].name.split(" ")[0]}</Text>
          <View style={[styles.podiumBase, { height: 45, backgroundColor: "#CD7F32" }]}>
            <Text style={styles.podiumRank}>3</Text>
          </View>
        </View>
      </View>

      {/* Full List */}
      <ScrollView style={styles.list}>
        {PLAYERS.map((player) => (
          <View key={player.rank} style={styles.row}>
            <Text style={[styles.rank, { color: RANK_COLORS[player.rank] || "#8B949E" }]}>
              #{player.rank}
            </Text>
            <View style={[styles.avatar, { borderColor: RANK_COLORS[player.rank] || "#30363D" }]}>
              <Text style={styles.avatarText}>{player.avatar}</Text>
            </View>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerStats}>
                Level {player.level} • {player.missions} missions
              </Text>
            </View>
            <Text style={styles.score}>{player.score.toLocaleString()} pts</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: "#0D1117" },
  header: {
    backgroundColor: "#161B22", borderBottomWidth: 1,
    borderBottomColor: "#30363D", padding: 20,
  },
  headerTitle:    { color: "#FFFFFF", fontSize: 20, fontWeight: "700" },
  headerSub:      { color: "#8B949E", fontSize: 13, marginTop: 2 },
  podium: {
    flexDirection: "row", justifyContent: "center",
    alignItems: "flex-end", padding: 20, gap: 8,
    backgroundColor: "#161B22", borderBottomWidth: 1, borderBottomColor: "#30363D",
  },
  podiumItem:     { alignItems: "center", width: 90 },
  crown:          { fontSize: 20, marginBottom: 4 },
  podiumAvatar: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 2, backgroundColor: "#0D1117",
    alignItems: "center", justifyContent: "center", marginBottom: 4,
  },
  podiumAvatarText: { color: "#FFFFFF", fontWeight: "700", fontSize: 18 },
  podiumName:     { color: "#E6EDF3", fontSize: 11, fontWeight: "600", marginBottom: 4 },
  podiumBase: {
    width: "100%", borderRadius: 6,
    alignItems: "center", justifyContent: "center",
  },
  podiumRank:     { color: "#000", fontWeight: "800", fontSize: 16 },
  list:           { flex: 1, padding: 16 },
  row: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#161B22", borderRadius: 10,
    borderWidth: 1, borderColor: "#30363D",
    padding: 12, marginBottom: 8, gap: 10,
  },
  rank:           { width: 28, fontSize: 13, fontWeight: "700" },
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 1, backgroundColor: "#0D1117",
    alignItems: "center", justifyContent: "center",
  },
  avatarText:     { color: "#06B6D4", fontWeight: "700", fontSize: 14 },
  playerInfo:     { flex: 1 },
  playerName:     { color: "#E6EDF3", fontSize: 14, fontWeight: "500" },
  playerStats:    { color: "#8B949E", fontSize: 11, marginTop: 2 },
  score:          { color: "#06B6D4", fontSize: 13, fontWeight: "700" },
});
