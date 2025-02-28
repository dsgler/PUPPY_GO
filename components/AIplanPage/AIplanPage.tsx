import { View, Text, ScrollView } from "react-native";
import { useImmer } from "use-immer";
import { useState } from "react";
import {
  HeightAndWeight,
  SICK,
  BodyImprove,
  LOADING,
  END,
} from "@/consts/AIplanPage";
import { HeightAndWeightView } from "./HeightAndWeightView";
import { Footer } from "./Footer";
import SickView from "./sickView";
import BodyImproveView from "./BodyImproveView";
import { InfoObjType, InfoObjDefault, InfoObjStateCtx } from "./public";
import LoadingView from "./loadingView";
import EndView from "./end";

export default function AIplanPage() {
  const InfoObjState = useImmer<InfoObjType>(InfoObjDefault);
  const StepState = useState(HeightAndWeight);
  console.log("AIplanPage渲染,Step:", StepState[0]);

  if (StepState[0] === LOADING) {
    return (
      <InfoObjStateCtx.Provider value={InfoObjState}>
        <LoadingView StepState={StepState} />
      </InfoObjStateCtx.Provider>
    );
  }

  if (StepState[0] === END) {
    return (
      <InfoObjStateCtx.Provider value={InfoObjState}>
        <EndView />
      </InfoObjStateCtx.Provider>
    );
  }

  return (
    <ScrollView style={{ paddingHorizontal: 16 }}>
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
