import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntIcon from "react-native-vector-icons/AntDesign";
import Header from "./header";
import { ImmerHook, useImmer } from "use-immer";
import { createContext, useState } from "react";
import {
  HeightAndWeight,
  SICK,
  BodyImprove,
  sickArr,
} from "@/consts/AIplanPage";
import { defaultError } from "@/app/_layout";
import { HeightAndWeightView } from "./HeightAndWeightView";
import { Footer } from "./Footer";
import SickView from "./sickView";
import BodyImproveView from "./BodyImproveView";

type InfoObjType = {
  heightRaw: string;
  weightRaw: string;
  sick: { chosen: Set<number>; attach: string };
  bodyImprove: { chosen: Set<number>; attach: string };
};

const InfoObjDefault: InfoObjType = {
  heightRaw: "",
  weightRaw: "",
  sick: { chosen: new Set(), attach: "" },
  bodyImprove: { chosen: new Set(), attach: "" },
};

export const InfoObjStateCtx = createContext<ImmerHook<InfoObjType>>([
  InfoObjDefault,
  defaultError,
]);

export default function AIplanPage() {
  const InfoObjState = useImmer<InfoObjType>(InfoObjDefault);
  const StepState = useState(HeightAndWeight);

  return (
    <SafeAreaView style={{ paddingHorizontal: 16 }}>
      <ScrollView>
        <Header />
        <Text style={{ fontSize: 32, color: "white", paddingVertical: 15 }}>
          智能规划
        </Text>
        <InfoObjStateCtx.Provider value={InfoObjState}>
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 20,
              borderRadius: 12,
              backgroundColor: "white",
            }}
          >
            <Switcher StepState={StepState} />
            <View style={{ height: 20 }}></View>
            <Footer StepState={StepState} />
          </View>
        </InfoObjStateCtx.Provider>
      </ScrollView>
    </SafeAreaView>
  );
}

function Switcher({
  StepState: [Step],
}: {
  StepState: [number, React.Dispatch<React.SetStateAction<number>>];
}) {
  if (Step === HeightAndWeight) {
    return <HeightAndWeightView />;
  } else if (Step === SICK) {
    return <SickView />;
  } else if (Step === BodyImprove) {
    return <BodyImproveView />;
  }

  throw Error("不存在的Step");
}

export const checkValid = (Step: number, obj: InfoObjType): string => {
  let messages: string[] = [];
  if (Step >= HeightAndWeight) {
    const height = Number(obj.heightRaw);
    if (isNaN(height) || height < 50 || height > 300) {
      messages.push("请输入合理的身高");
    }
    const weight = Number(obj.weightRaw);
    if (isNaN(weight) || weight < 10 || weight > 300) {
      messages.push("请输入合理的体重");
    }
  }
  return messages.join("\n");
};

export const ViewStyle = StyleSheet.create({
  Text: { fontSize: 16, width: 80 },
  Input: { flex: 1, fontSize: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#e7e7e7",
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  mainText: { fontSize: 24, fontWeight: 500, marginBottom: 5 },
  subText: { fontSize: 12, color: "rgba(0,0,0,0.6)" },
});
