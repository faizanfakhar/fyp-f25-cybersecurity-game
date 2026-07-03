// ============================================================
// src/screens/LoginScreen.js — Mobile Login Screen
// ============================================================

import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

export default function LoginScreen({ navigation }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const getFriendlyError = (code) => {
    switch (code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential": return "Invalid email or password.";
      case "auth/invalid-email":      return "Please enter a valid email address.";
      case "auth/too-many-requests":  return "Too many attempts. Please try again later.";
      default: return "Something went wrong. Please try again.";
    }
  };

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const result  = await signInWithEmailAndPassword(auth, email, password);
      const docRef  = doc(db, "users", result.user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().role === "admin") {
        navigation.replace("Main");
      } else {
        navigation.replace("Main");
      }
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

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>🛡️</Text>
          </View>
          <Text style={styles.title}>CyberGame</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          ) : null}

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
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.linkText}>
              Don't have an account?{" "}
              <Text style={styles.link}>Create one</Text>
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
    width: 72, height: 72,
    backgroundColor: "rgba(6,182,212,0.1)",
    borderRadius: 16, borderWidth: 1,
    borderColor: "rgba(6,182,212,0.3)",
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
    paddingVertical: 14, alignItems: "center",
    marginTop: 8, marginBottom: 20,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText:     { color: "#000000", fontSize: 15, fontWeight: "600" },
  linkText:       { color: "#8B949E", fontSize: 13, textAlign: "center" },
  link:           { color: "#06B6D4", fontWeight: "500" },
});
