import { SafeAreaView } from "react-native-safe-area-context";
import ConceptDailyDigest from "../../src/screens/ConceptDailyDigest";

export default function BriefingTab() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAF7" }} edges={["top"]}>
      <ConceptDailyDigest />
    </SafeAreaView>
  );
}
