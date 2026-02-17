import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../tokens/colors";

type ScreenShellProps = {
  children: React.ReactNode;
  backgroundColor?: string;
  edges?: ("top" | "bottom" | "left" | "right")[];
  fab?: React.ReactNode;
};

export default function ScreenShell({
  children,
  backgroundColor = colors.background.primary,
  edges = ["top"],
  fab,
}: ScreenShellProps) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={edges}>
      {children}
      {fab}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
