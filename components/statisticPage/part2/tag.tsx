import { showData } from "@/components/index";
import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { ChosenDateArrCtx } from "../public";

export default function TagView() {
  const [dataComponent, setDataComponent] = useState<React.ReactNode>(null);
  const [dateNumber] = useContext(ChosenDateArrCtx);
  useEffect(() => {
    showData(setDataComponent, dateNumber, true);
    console.log("TagView渲染");
  }, [dateNumber]);
  return <View>{dataComponent}</View>;
}
