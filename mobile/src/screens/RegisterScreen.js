// ============================================================
// src/screens/RegisterScreen.js — Mobile Register Screen
// ============================================================

import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView,
} from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../services/firebase";

export default function RegisterScreen({ navigation }) {
  const [displayName, setDisplayName] = useState("");
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  const getFriendlyError = (code) => {
    switch (code) {
      case "auth/email-already-in-use": return "This email is already registered.";
      case "auth/weak-password":        return "Password must be at least 6 characters.";
      case "auth/invalid-email":        return "Please enter a valid email address.";
      default: return "Something went wrong. Please try again.";
    }
  };

  const handleRegister = async () => {
    setError("");
    if (!displayName.trim()) { setError("Please enter your full name."); return; }
    if (!email.trim())       { setError("Please enter your email."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user   = result.user;
      await updateProfile(user, { displayName: displayName.trim() });
      await setDoc(doc(db, "users", user.uid), {
        uid:               user.uid,
        displayName:       displayName.trim(),
        email:             email.toLowerCase(),
        role:              "player",
        createdAt:         serverTimestamp(),
        totalScore:        0,
        missionsCompleted: 0,
        level:             1,
        isActive:          true,
      });
      navigation.replace("Main");
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>🛡️</Text>
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the CyberGame Platform</Text>
        </View>

        <View style={styles.card}>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#8B949E"
            value={displayName}
            onChangeText={setDisplayName}
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="email@example.com"
            placeholderTextColor="#8B949E"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#8B949E"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkText}>
              Already have an account?{" "}
              <Text style={styles.link}>Sign in</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: "#0D1117" },
  scroll:         { flexGrow: 1, justifyContent: "center", padding: 24 },
  logoContainer:  { alignItems: "center", marginBottom: 32 },
  logoBox: {
    width: 72, height: 72, backgroundColor: "rgba(6,182,212,0.1)",
    borderRadius: 16, borderWidth: 1, borderColor: "rgba(6,182,212,0.3)",
    alignItems: "center", justifyContent: "center", marginBottom: 12,
  },
  logoIcon:       { fontSize: 36 },
  title:          { fontSize: 24, fontWeight: "700", color: "#FFFFFF", marginBottom: 4 },
  subtitle:       { fontSize: 14, color: "#8B949E" },
  card: {
    backgroundColor: "#161B22", borderRadius: 16,
    borderWidth: 1, borderColor: "#30363D", padding: 24,
  },
  errorBox: {
    backgroundColor: "rgba(239,68,68,0.1)", borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)", borderRadius: 8,
    padding: 12, marginBottom: 16,
  },
  errorText:      { color: "#F87171", fontSize: 13 },
  label:          { color: "#E6EDF3", fontSize: 13, fontWeight: "500", marginBottom: 6 },
  input: {
    backgroundColor: "#0D1117", borderWidth: 1, borderColor: "#30363D",
    borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12,
    color: "#E6EDF3", fontSize: 14, marginBottom: 16,
  },
  button: {
    backgroundColor: "#06B6D4", borderRadius: 8,
    paddingVertical: 14, alignItems: "center", marginTop: 8, marginBottom: 20,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText:     { color: "#000000", fontSize: 15, fontWeight: "600" },
  linkText:       { color: "#8B949E", fontSize: 13, textAlign: "center" },
  link:           { color: "#06B6D4", fontWeight: "500" },
});
