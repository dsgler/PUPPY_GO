import { useState } from "react";
import Footer from "@/components/footer";
import { Slot } from "expo-router";
import React from "react";
import { activePageType, indexPageId } from "@/consts/tabs";

export default function Layout() {
  const [activePage, setActivePage] = useState<activePageType>(indexPageId);

  return (
    <>
      <Slot screenOptions={{ headerShown: false }} />
      <Footer activePage={activePage} setActivePage={setActivePage} />
    </>
  );
}
