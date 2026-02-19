import { SafeAreaView } from "react-native-safe-area-context";
import MorningBrief from "../../src/screens/MorningBrief";

export default function BriefingTab() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1d1d1f" }} edges={["top"]}>
      <MorningBrief />
    </SafeAreaView>
  );
}
