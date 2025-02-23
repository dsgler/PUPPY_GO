import { showData } from "@/components";
import React, { useContext, useEffect, useState } from "react";
import { ChosenDateArrCtx } from "../main";
import { View } from "react-native";

export default function TagView() {
  const [dataComponent, setDataComponent] = useState<React.ReactNode>(null);
  const [dateNumber] = useContext(ChosenDateArrCtx);
  useEffect(() => {
    showData(setDataComponent, dateNumber, true);
    console.log("TagView渲染");
  }, [dateNumber]);
  return <View>{dataComponent}</View>;
}
