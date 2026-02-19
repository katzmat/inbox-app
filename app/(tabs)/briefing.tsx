import { SafeAreaView } from "react-native-safe-area-context";
import ConceptLifeThreads from "../../src/screens/ConceptLifeThreads";

export default function BriefingTab() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }} edges={["top"]}>
      <ConceptLifeThreads />
    </SafeAreaView>
  );
}
