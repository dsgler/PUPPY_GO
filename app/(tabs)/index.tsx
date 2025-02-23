import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Index from "@/components/index";
import { StyleSheet } from "react-native";

export default function App() {
  return (
    <>
      <LinearGradient
        colors={["#FFCC8E", "#FFF0DE"]}
        style={StyleSheet.absoluteFill}
      />
      <Index />
    </>
  );
}
