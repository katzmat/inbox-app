import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import LoginScreen from "../src/screens/LoginScreen";
import { useSessionStore } from "../src/stores/session";

export default function LoginRoute() {
  const router = useRouter();
  const onLoginSuccess = useSessionStore((s) => s.onLoginSuccess);

  const handleLogin = async () => {
    await onLoginSuccess();
    router.replace("/(tabs)/briefing");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <LoginScreen onLoginSuccess={handleLogin} />
    </SafeAreaView>
  );
}
