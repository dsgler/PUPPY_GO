import AddPage from "@/components/addPage";
import { PaperProvider } from "react-native-paper";

export default function () {
  return (
    <PaperProvider>
      <AddPage />
    </PaperProvider>
  );
}
