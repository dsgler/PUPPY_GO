import AddPage from "@/components/addPage";
import { StrictMode } from "react";
import {
  MD3LightTheme,
  PaperProvider,
  ThemeProvider,
} from "react-native-paper";

export default function Add() {
  return (
    <StrictMode>
      <AddPage />
    </StrictMode>
  );
}
