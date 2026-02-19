import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { OrbitText, spacing, radius } from "../../orbit-ds";
import {
  loginYahooPassword,
  loginGmailPassword,
} from "../services/gmail";

const G = {
  black: "#1d1d1f",
  dark: "#333",
  mid: "#666",
  muted: "#999",
  light: "#bbb",
  faint: "#ddd",
  bg: "#f5f5f5",
  white: "#fff",
  line: "#e8e8e8",
  error: "#c00",
};

type Tab = "yahoo" | "gmail";

export default function LoginScreen({
  onLoginSuccess,
}: {
  onLoginSuccess: () => void;
}) {
  const [tab, setTab] = useState<Tab>("yahoo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Shared fields
  const [email, setEmail] = useState("");
  const [appPassword, setAppPassword] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !appPassword.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const loginFn = tab === "yahoo" ? loginYahooPassword : loginGmailPassword;
      const res = await loginFn(email.trim(), appPassword.trim());
      if (res.success) {
        onLoginSuccess();
      } else {
        setError(res.error || "Login failed");
      }
    } catch {
      setError("Connection failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <OrbitText variant="title2" color={G.black} style={{ fontWeight: "300" }}>
          Connect your email
        </OrbitText>
        <OrbitText
          variant="body1"
          color={G.muted}
          style={{ marginTop: spacing[2] }}
        >
          Sign in to see your real inbox.
        </OrbitText>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => { setTab("yahoo"); setError(null); setEmail(""); setAppPassword(""); }}
          style={[styles.tab, tab === "yahoo" && styles.tabActive]}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, tab === "yahoo" && styles.tabTextActive]}>
            Yahoo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { setTab("gmail"); setError(null); setEmail(""); setAppPassword(""); }}
          style={[styles.tab, tab === "gmail" && styles.tabActive]}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, tab === "gmail" && styles.tabTextActive]}>
            Gmail
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={tab === "yahoo" ? "Yahoo email address" : "Gmail address"}
          placeholderTextColor={G.light}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="App password"
          placeholderTextColor={G.light}
          value={appPassword}
          onChangeText={setAppPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        <OrbitText
          variant="caption2"
          color={G.muted}
          style={{ marginTop: spacing[2] }}
        >
          {tab === "yahoo"
            ? "Use a Yahoo App Password (not your regular password).\nCreate one at login.yahoo.com → Account Security → Generate app password."
            : "Use a Google App Password (not your regular password).\nCreate one at myaccount.google.com → Security → App Passwords."}
        </OrbitText>

        <TouchableOpacity
          onPress={handleLogin}
          style={[styles.button, loading && styles.buttonDisabled]}
          activeOpacity={0.7}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={G.white} size="small" />
          ) : (
            <Text style={styles.buttonText}>
              Connect {tab === "yahoo" ? "Yahoo" : "Gmail"}
            </Text>
          )}
        </TouchableOpacity>

        {/* Error */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: G.white,
  },
  contentContainer: {
    padding: spacing[6],
    paddingTop: spacing[10],
  },
  header: {
    marginBottom: spacing[8],
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: G.line,
    marginBottom: spacing[5],
  },
  tab: {
    flex: 1,
    paddingVertical: spacing[3],
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: G.dark,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: G.muted,
  },
  tabTextActive: {
    color: G.dark,
    fontWeight: "600",
  },
  form: {
    gap: spacing[3],
  },
  input: {
    borderWidth: 1,
    borderColor: G.line,
    borderRadius: radius.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    fontSize: 15,
    color: G.dark,
    backgroundColor: G.bg,
  },
  button: {
    backgroundColor: G.dark,
    borderRadius: radius.md,
    paddingVertical: spacing[3],
    alignItems: "center",
    marginTop: spacing[3],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 15,
    color: G.white,
    fontWeight: "600",
  },
  errorBox: {
    backgroundColor: "#fef2f2",
    borderRadius: radius.sm,
    padding: spacing[3],
    marginTop: spacing[2],
  },
  errorText: {
    fontSize: 13,
    color: G.error,
  },
});
