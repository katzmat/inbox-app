import { SafeAreaView } from "react-native-safe-area-context";
import ConceptOrbitInbox from "../../src/screens/ConceptOrbitInbox";

export default function BriefingTab() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <ConceptOrbitInbox />
    </SafeAreaView>
  );
}
