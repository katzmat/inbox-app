import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, spacing, Button } from "../../orbit-ds";
import { typography } from "../../orbit-ds/tokens/typography";
import { useSessionStore } from "../../src/stores/session";

export default function SettingsTab() {
  const router = useRouter();
  const userEmail = useSessionStore((s) => s.userEmail);
  const provider = useSessionStore((s) => s.provider);
  const disconnectSession = useSessionStore((s) => s.disconnect);

  const handleDisconnect = async () => {
    await disconnectSession();
    router.replace("/login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }} edges={["top"]}>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>

        {userEmail && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Account</Text>
            <Text style={styles.value}>{userEmail}</Text>
            {provider && (
              <Text style={styles.caption}>{provider}</Text>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Button
            label="Disconnect account"
            variant="tertiary"
            onPress={handleDisconnect}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing[6],
  },
  title: {
    ...typography.title3,
    color: colors.foreground.primary,
    marginBottom: spacing[6],
  },
  infoRow: {
    marginBottom: spacing[6],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.line.neutral3,
  },
  label: {
    ...typography.caption1,
    color: colors.foreground.tertiary,
    marginBottom: spacing[1],
  },
  value: {
    ...typography.body1,
    color: colors.foreground.primary,
  },
  caption: {
    ...typography.caption2,
    color: colors.foreground.tertiary,
    marginTop: spacing[0.5],
    textTransform: "capitalize",
  },
  section: {
    gap: spacing[3],
  },
});
