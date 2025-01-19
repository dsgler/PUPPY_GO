import Footer from "@/components/footer";
import React from "react";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <Footer props={props} />}
    ></Tabs>
  );
}
