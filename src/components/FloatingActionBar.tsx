import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

export default function FloatingActionBar() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.gradient} />
      <BlurView intensity={50} tint="dark" style={styles.bar}>
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="search-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons
            name="checkbox-outline"
            size={24}
            color="#ffffff"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="pencil-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 34,
    paddingTop: 6,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 9999,
    overflow: "hidden",
    backgroundColor: "rgba(29,29,31,0.9)",
    shadowColor: "rgba(29,29,31,1)",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.35,
    shadowRadius: 22,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(29,29,31,0.08)",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
});
