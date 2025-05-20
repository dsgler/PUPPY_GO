import AddPage from "@/components/addPage/addPage";
import { useContext, useEffect } from "react";
import { BackHandler } from "react-native";
import { MyConfirmCtx } from "./_layout";
import { router } from "expo-router";

export default function Add() {
  const myConfrim = useContext(MyConfirmCtx);
  useEffect(() => {
    const i = BackHandler.addEventListener("hardwareBackPress", () => {
      myConfrim("确认退出吗？", router.back);
      return true;
    });

    return () => {
      i.remove();
    };
  }, [myConfrim]);
  return <AddPage />;
}
