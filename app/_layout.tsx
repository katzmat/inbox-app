import { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PhoneFrame } from "../orbit-ds";
import { useSessionStore } from "../src/stores/session";
import ErrorBoundary from "../src/components/ErrorBoundary";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const status = useSessionStore((s) => s.status);
  const init = useSessionStore((s) => s.init);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (status === "loading") return;

    const inAuth = segments[0] === "login";

    if (status === "disconnected" && !inAuth) {
      router.replace("/login");
    } else if (status === "connected" && inAuth) {
      router.replace("/(tabs)/briefing");
    }
  }, [status, segments]);

  if (status === "loading") {
    return null;
  }

  return (
    <SafeAreaProvider>
      <PhoneFrame>
        <ErrorBoundary>
          <Slot />
        </ErrorBoundary>
      </PhoneFrame>
    </SafeAreaProvider>
  );
}
