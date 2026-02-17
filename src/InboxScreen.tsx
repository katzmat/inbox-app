import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import {
  StatusBar,
  TopNavigation,
  TabBar,
  ListItem,
  AdContainer,
  FloatingActionBar,
  colors,
} from "../orbit-ds";
import type { TabItem } from "../orbit-ds";
import { emails } from "./data/emails";

const TABS: TabItem[] = [
  { label: "All" },
  { label: "Primary" },
  { label: "Offers", count: 3 },
  { label: "Other", count: 23 },
];

function YahooPlusBadge() {
  return (
    <View style={styles.yahooPlusBadge}>
      <Text style={styles.ypText}>Y+</Text>
    </View>
  );
}

function SelectButton() {
  return (
    <TouchableOpacity>
      <Text style={styles.selectText}>Select</Text>
    </TouchableOpacity>
  );
}

export default function InboxScreen() {
  const [activeTab, setActiveTab] = useState("Primary");

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <TopNavigation
        title="Inbox"
        avatarImageUri="http://localhost:3845/assets/73404019ea9ad1a8cd9000a51651146c4ec4586b.png"
        rightAction={<YahooPlusBadge />}
      />
      <TabBar
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        rightAction={<SelectButton />}
      />
      <FlatList
        data={emails}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if (item.isAd) {
            return (
              <AdContainer
                brand={item.adBrand ?? item.sender}
                preview={item.preview}
                actions={item.actions}
              />
            );
          }
          return (
            <ListItem
              sender={item.sender}
              subject={item.subject}
              preview={item.preview}
              time={item.time}
              unread={item.unread}
              starred={item.starred}
              threadCount={item.threadCount}
              hasReply={item.hasReply}
              actions={item.actions}
            />
          );
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <FloatingActionBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  listContent: {
    paddingBottom: 120,
  },
  yahooPlusBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  ypText: {
    color: colors.foreground.onColor,
    fontSize: 11,
    fontWeight: "700",
  },
  selectText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.brand,
    lineHeight: 24,
  },
});
