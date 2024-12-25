import React from "react";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="addPage" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto"/>
    </>
  );
}
