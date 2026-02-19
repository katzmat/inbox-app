import { SafeAreaView } from "react-native-safe-area-context";
import InboxScreen from "../../src/InboxScreen";

export default function InboxTab() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <InboxScreen />
    </SafeAreaView>
  );
}
