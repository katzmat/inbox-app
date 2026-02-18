import React from "react";
import { View, StyleSheet } from "react-native";
import ProtoZones from "./screens/ProtoZones";

export default function PrototypeScreen() {
  return (
    <View style={styles.container}>
      <ProtoZones />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
