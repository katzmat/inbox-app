import { useState, useEffect, useCallback } from "react";
import { Platform, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { PhoneFrame, colors } from "./orbit-ds";
import InboxScreen from "./src/InboxScreen";
import PrototypeScreen from "./src/PrototypeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import { checkSession, disconnect } from "./src/services/gmail";

type Screen = "inbox" | "prototypes";
type AppState = "loading" | "login" | "app";

export default function App() {
  const [screen, setScreen] = useState<Screen>("prototypes");
  const [appState, setAppState] = useState<AppState>("loading");

  useEffect(() => {
    checkSession().then((s) => {
      setAppState(s.connected ? "app" : "login");
    }).catch(() => {
      setAppState("login");
    });
  }, []);

  const handleLoginSuccess = useCallback(() => {
    setAppState("app");
  }, []);

  const handleDisconnect = useCallback(async () => {
    await disconnect();
    setAppState("login");
  }, []);

  if (appState === "loading") {
    return (
      <SafeAreaProvider>
        <PhoneFrame>
          <View style={{ flex: 1, backgroundColor: "#1d1d1f" }} />
        </PhoneFrame>
      </SafeAreaProvider>
    );
  }

  if (appState === "login") {
    return (
      <SafeAreaProvider>
        <PhoneFrame>
          <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
            <LoginScreen onLoginSuccess={handleLoginSuccess} />
          </SafeAreaView>
        </PhoneFrame>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <PhoneFrame>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: screen === "prototypes" ? "#1d1d1f" : colors.background.primary }}
          edges={["top"]}
        >
          {screen === "inbox" ? <InboxScreen /> : <PrototypeScreen />}
        </SafeAreaView>

        {/* Screen toggle + disconnect - web only */}
        {Platform.OS === "web" && (
          <View style={navStyles.nav}>
            <TouchableOpacity
              onPress={() => setScreen("inbox")}
              style={[navStyles.navTab, screen === "inbox" && navStyles.navTabActive]}
            >
              <Text style={[navStyles.navText, screen === "inbox" && navStyles.navTextActive]}>
                Inbox
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setScreen("prototypes")}
              style={[navStyles.navTab, screen === "prototypes" && navStyles.navTabActive]}
            >
              <Text style={[navStyles.navText, screen === "prototypes" && navStyles.navTextActive]}>
                Briefing
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDisconnect}
              style={navStyles.navTab}
            >
              <Text style={navStyles.disconnectText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
        )}
      </PhoneFrame>
    </SafeAreaProvider>
  );
}

const navStyles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.line.neutral3,
    backgroundColor: "#fafafa",
  },
  navTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  navTabActive: {
    backgroundColor: colors.background.primary,
  },
  navText: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(29,29,31,0.4)",
  },
  navTextActive: {
    color: colors.brand,
    fontWeight: "600",
  },
  disconnectText: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(29,29,31,0.3)",
  },
});
