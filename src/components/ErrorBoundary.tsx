import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../../orbit-ds/tokens/colors";
import { typography } from "../../orbit-ds/tokens/typography";
import { spacing } from "../../orbit-ds/tokens/spacing";
import { radius } from "../../orbit-ds/tokens/radius";

type Props = {
  children: ReactNode;
  fallbackTitle?: string;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error.message, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>
            {this.props.fallbackTitle ?? "Something went wrong"}
          </Text>
          <Text style={styles.message}>
            {this.state.error?.message ?? "An unexpected error occurred."}
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
            <Text style={styles.buttonText}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing[6],
    backgroundColor: colors.background.primary,
  },
  title: {
    ...typography.headline1,
    color: colors.foreground.primary,
    marginBottom: spacing[2],
    textAlign: "center",
  },
  message: {
    ...typography.body1,
    color: colors.foreground.tertiary,
    textAlign: "center",
    marginBottom: spacing[4],
    maxWidth: 300,
  },
  button: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radius.sm,
    backgroundColor: colors.foreground.primary,
  },
  buttonText: {
    ...typography.label3,
    color: colors.foreground.onColor,
  },
});
