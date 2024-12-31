import AddPage from "@/components/addPage";
import { PaperProvider } from "react-native-paper";

export default function Add() {
  return (
    <PaperProvider>
      <AddPage />
    </PaperProvider>
  );
}
