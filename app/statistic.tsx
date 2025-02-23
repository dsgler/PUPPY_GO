import Page from "@/components/statisticPage/main";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

export default function F() {
  return (
    <>
      <LinearGradient
        colors={["#FFCC8E", "#FFF0DE"]}
        style={StyleSheet.absoluteFill}
      />
      <Page />
    </>
  );
}
