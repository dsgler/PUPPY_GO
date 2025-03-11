import AddPage from "@/components/addPage/addPage";
import { useContext } from "react";
import { BackHandler } from "react-native";
import { MyConfirmCtx } from "./_layout";
import { router } from "expo-router";

export default function Add() {
  const myConfrim = useContext(MyConfirmCtx);
  BackHandler.addEventListener("hardwareBackPress", () => {
    myConfrim("确认退出吗？", router.back);
    return true;
  });
  return <AddPage />;
}
