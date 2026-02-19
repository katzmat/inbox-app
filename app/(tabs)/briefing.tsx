import { SafeAreaView } from "react-native-safe-area-context";
import ConceptTriageDeck from "../../src/screens/ConceptTriageDeck";

export default function BriefingTab() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }} edges={["top"]}>
      <ConceptTriageDeck />
    </SafeAreaView>
  );
}
