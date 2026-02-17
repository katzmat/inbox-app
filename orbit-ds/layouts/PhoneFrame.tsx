import React from "react";
import { Platform, View, StyleSheet } from "react-native";

type PhoneFrameProps = {
  children: React.ReactNode;
  width?: number;
  height?: number;
};

export default function PhoneFrame({
  children,
  width = 393,
  height = 852,
}: PhoneFrameProps) {
  if (Platform.OS !== "web") return <>{children}</>;

  return (
    <View style={styles.outer}>
      <View style={[styles.phone, { width, height }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: "#e5e5e5",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  phone: {
    backgroundColor: "#ffffff",
    borderRadius: 44,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
});
