import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

type Tab = {
  label: string;
  count?: number;
};

const TABS: Tab[] = [
  { label: "All" },
  { label: "Primary" },
  { label: "Offers", count: 3 },
  { label: "Other", count: 23 },
];

export default function TabBar() {
  const [activeTab, setActiveTab] = useState("Primary");

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.label;
          return (
            <TouchableOpacity
              key={tab.label}
              onPress={() => setActiveTab(tab.label)}
              style={styles.tabButton}
            >
              <View style={styles.tabContent}>
                <Text
                  style={[
                    styles.tabLabel,
                    isActive
                      ? styles.tabLabelActive
                      : styles.tabLabelInactive,
                  ]}
                >
                  {tab.label}
                </Text>
                {tab.count !== undefined && (
                  <Text
                    style={[
                      styles.tabCount,
                      isActive
                        ? styles.tabCountActive
                        : styles.tabCountInactive,
                    ]}
                  >
                    {tab.count}
                  </Text>
                )}
              </View>
              <View
                style={[
                  styles.indicator,
                  isActive && styles.indicatorActive,
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <TouchableOpacity style={styles.selectButton}>
        <Text style={styles.selectText}>Select</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    height: 48,
    alignItems: "flex-end",
  },
  scrollContent: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingLeft: 24,
    gap: 16,
    flex: 1,
  },
  tabButton: {
    gap: 2,
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 24,
  },
  tabLabelActive: {
    color: "#1d1d1f",
  },
  tabLabelInactive: {
    color: "rgba(29,29,31,0.75)",
  },
  tabCount: {
    fontSize: 17,
    fontWeight: "400",
    lineHeight: 20,
  },
  tabCountActive: {
    color: "rgba(29,29,31,0.61)",
  },
  tabCountInactive: {
    color: "rgba(29,29,31,0.61)",
  },
  indicator: {
    height: 3,
    borderRadius: 9,
    width: "100%",
  },
  indicatorActive: {
    backgroundColor: "#1d1d1f",
  },
  selectButton: {
    paddingRight: 12,
    paddingBottom: 12,
  },
  selectText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7d2eff",
    lineHeight: 24,
  },
});
