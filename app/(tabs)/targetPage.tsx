import Page from "@/components/targetPage";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function App() {
  return (
    <>
      <LinearGradient
        colors={["#FFCC8E", "#FFF0DE"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <Page />
    </>
  );
}
