import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { colors } from "../tokens/colors";
import { spacing } from "../tokens/spacing";

export type TabItem = {
  label: string;
  count?: number;
};

type TabBarProps = {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (label: string) => void;
  rightAction?: React.ReactNode;
};

export default function TabBar({
  tabs,
  activeTab,
  onTabChange,
  rightAction,
}: TabBarProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.label;
          return (
            <TouchableOpacity
              key={tab.label}
              onPress={() => onTabChange(tab.label)}
              style={styles.tabButton}
            >
              <View style={styles.tabContent}>
                <Text
                  style={[
                    styles.tabLabel,
                    isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                  ]}
                >
                  {tab.label}
                </Text>
                {tab.count !== undefined && (
                  <Text style={styles.tabCount}>{tab.count}</Text>
                )}
              </View>
              <View style={[styles.indicator, isActive && styles.indicatorActive]} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {rightAction && <View style={styles.rightSlot}>{rightAction}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.background.primary,
    height: 48,
    alignItems: "flex-end",
  },
  scrollContent: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingLeft: spacing[6],
    gap: spacing[4],
    flex: 1,
  },
  tabButton: {
    gap: 2,
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1],
    paddingVertical: spacing[1],
  },
  tabLabel: {
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 24,
  },
  tabLabelActive: {
    color: colors.foreground.primary,
  },
  tabLabelInactive: {
    color: colors.foreground.secondary,
  },
  tabCount: {
    fontSize: 17,
    fontWeight: "400",
    lineHeight: 20,
    color: colors.foreground.tertiary,
  },
  indicator: {
    height: 3,
    borderRadius: 9,
    width: "100%",
  },
  indicatorActive: {
    backgroundColor: colors.foreground.primary,
  },
  rightSlot: {
    paddingRight: spacing[3],
    paddingBottom: spacing[3],
  },
});
