import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { colors, spacing } from "../orbit-ds";
import QuietReport from "./screens/QuietReport";
import YourPeople from "./screens/YourPeople";
import CalmFamiliar from "./screens/CalmFamiliar";

const versions = [
  { id: 2, label: "Quiet Report", subtitle: "Reduction as the aha" },
  { id: 4, label: "Your People", subtitle: "Relationships first" },
  { id: 7, label: "Calm Familiar", subtitle: "Subtle intelligence" },
];

export default function PrototypeScreen() {
  const [activeVersion, setActiveVersion] = useState(2);

  return (
    <View style={styles.container}>
      {/* Version switcher */}
      <View style={styles.switcher}>
        {versions.map((v) => {
          const isActive = activeVersion === v.id;
          return (
            <TouchableOpacity
              key={v.id}
              onPress={() => setActiveVersion(v.id)}
              style={[styles.switcherTab, isActive && styles.switcherTabActive]}
            >
              <Text
                style={[
                  styles.switcherLabel,
                  isActive && styles.switcherLabelActive,
                ]}
              >
                {v.label}
              </Text>
              <Text
                style={[
                  styles.switcherSubtitle,
                  isActive && styles.switcherSubtitleActive,
                ]}
              >
                {v.subtitle}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Active version */}
      <View style={styles.content}>
        {activeVersion === 2 && <QuietReport />}
        {activeVersion === 4 && <YourPeople />}
        {activeVersion === 7 && <CalmFamiliar />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.foreground.primary,
  },
  switcher: {
    flexDirection: "row",
    backgroundColor: colors.foreground.primary,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  switcherTab: {
    flex: 1,
    paddingVertical: spacing[3],
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  switcherTabActive: {
    borderBottomColor: colors.foreground.onColor,
  },
  switcherLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.35)",
  },
  switcherLabelActive: {
    color: colors.foreground.onColor,
  },
  switcherSubtitle: {
    fontSize: 10,
    color: "rgba(255,255,255,0.15)",
    marginTop: 2,
  },
  switcherSubtitleActive: {
    color: "rgba(255,255,255,0.5)",
  },
  content: {
    flex: 1,
  },
});
