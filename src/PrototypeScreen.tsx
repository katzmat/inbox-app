import React from "react";
import { View, StyleSheet } from "react-native";
import MorningBrief from "./screens/MorningBrief";

export default function PrototypeScreen() {
  return (
    <View style={styles.container}>
      <MorningBrief />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
