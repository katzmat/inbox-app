import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const AVATAR_URL =
  "http://localhost:3845/assets/73404019ea9ad1a8cd9000a51651146c4ec4586b.png";
const YAHOO_PLUS_URL =
  "http://localhost:3845/assets/b0e0397819f9762b63f3945dabd26e84bd86ded3.svg";

export default function InboxHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Image
              source={{ uri: AVATAR_URL }}
              style={styles.avatarImage}
              defaultSource={require("../../assets/favicon.png")}
            />
          </View>
        </TouchableOpacity>

        <Text style={styles.title}>Inbox</Text>

        <TouchableOpacity style={styles.profileButton}>
          <View style={styles.yahooPlusIcon}>
            <Text style={styles.yahooPlusText}>Y+</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
  },
  topNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 9999,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "rgba(29,29,31,0.08)",
    overflow: "hidden",
  },
  avatarImage: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d1d1f",
    letterSpacing: -0.3,
    lineHeight: 36,
  },
  profileButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  yahooPlusIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#7d2eff",
    alignItems: "center",
    justifyContent: "center",
  },
  yahooPlusText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
});
