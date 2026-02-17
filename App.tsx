import { useState } from "react";
import { Platform, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { PhoneFrame, colors } from "./orbit-ds";
import InboxScreen from "./src/InboxScreen";
import PrototypeScreen from "./src/PrototypeScreen";

type Screen = "inbox" | "prototypes";

export default function App() {
  const [screen, setScreen] = useState<Screen>("prototypes");

  return (
    <SafeAreaProvider>
      <PhoneFrame>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: screen === "prototypes" ? colors.foreground.primary : colors.background.primary }}
          edges={["top"]}
        >
          {screen === "inbox" ? <InboxScreen /> : <PrototypeScreen />}
        </SafeAreaView>

        {/* Screen toggle - web only */}
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
                Prototypes
              </Text>
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
});
