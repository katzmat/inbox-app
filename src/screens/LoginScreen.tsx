import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Linking,
  ScrollView,
} from "react-native";
import { OrbitText, spacing, radius } from "../../orbit-ds";
import {
  loginYahooToken,
  loginGmailPassword,
  getYahooOAuthUrl,
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

  // Yahoo token fields
  const [yahooToken, setYahooToken] = useState("");

  // Gmail fields
  const [gmailEmail, setGmailEmail] = useState("");
  const [gmailPassword, setGmailPassword] = useState("");

  const handleYahooToken = async () => {
    if (!yahooToken.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await loginYahooToken(yahooToken.trim());
      if (res.success) {
        onLoginSuccess();
      } else {
        setError(res.error || "Yahoo login failed");
      }
    } catch {
      setError("Connection failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleGmailPassword = async () => {
    if (!gmailEmail.trim() || !gmailPassword.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await loginGmailPassword(gmailEmail.trim(), gmailPassword.trim());
      if (res.success) {
        onLoginSuccess();
      } else {
        setError(res.error || "Gmail login failed");
      }
    } catch {
      setError("Connection failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleYahooOAuth = () => {
    const url = getYahooOAuthUrl();
    if (Platform.OS === "web") {
      window.location.href = url;
    } else {
      Linking.openURL(url);
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
          onPress={() => { setTab("yahoo"); setError(null); }}
          style={[styles.tab, tab === "yahoo" && styles.tabActive]}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, tab === "yahoo" && styles.tabTextActive]}>
            Yahoo Token
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { setTab("gmail"); setError(null); }}
          style={[styles.tab, tab === "gmail" && styles.tabActive]}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, tab === "gmail" && styles.tabTextActive]}>
            Gmail
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab content */}
      <View style={styles.form}>
        {tab === "yahoo" ? (
          <>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Paste Yahoo OAuth token here..."
              placeholderTextColor={G.light}
              value={yahooToken}
              onChangeText={setYahooToken}
              multiline
              numberOfLines={4}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <OrbitText
              variant="caption2"
              color={G.muted}
              style={{ marginTop: spacing[2] }}
            >
              Get a token from the Yahoo Developer Console or your test script.
            </OrbitText>
            <TouchableOpacity
              onPress={handleYahooToken}
              style={[styles.button, loading && styles.buttonDisabled]}
              activeOpacity={0.7}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={G.white} size="small" />
              ) : (
                <Text style={styles.buttonText}>Connect Yahoo</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email (e.g. you@gmail.com)"
              placeholderTextColor={G.light}
              value={gmailEmail}
              onChangeText={setGmailEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              style={styles.input}
              placeholder="App password"
              placeholderTextColor={G.light}
              value={gmailPassword}
              onChangeText={setGmailPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            <OrbitText
              variant="caption2"
              color={G.muted}
              style={{ marginTop: spacing[2] }}
            >
              Use a Google App Password (not your regular password).{"\n"}
              Create one at myaccount.google.com → Security → App Passwords.
            </OrbitText>
            <TouchableOpacity
              onPress={handleGmailPassword}
              style={[styles.button, loading && styles.buttonDisabled]}
              activeOpacity={0.7}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={G.white} size="small" />
              ) : (
                <Text style={styles.buttonText}>Connect Gmail</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* Error */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>

      {/* Yahoo OAuth link */}
      <TouchableOpacity
        onPress={handleYahooOAuth}
        style={styles.oauthLink}
        activeOpacity={0.7}
      >
        <Text style={styles.oauthLinkText}>Sign in with Yahoo →</Text>
      </TouchableOpacity>
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
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: "top",
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
  oauthLink: {
    marginTop: spacing[8],
    alignItems: "center",
    paddingVertical: spacing[3],
  },
  oauthLinkText: {
    fontSize: 14,
    color: G.muted,
    fontWeight: "500",
  },
});
