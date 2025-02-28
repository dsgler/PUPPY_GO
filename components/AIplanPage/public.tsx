import { defaultError } from "@/app/_layout";
import { createContext } from "react";
import { ImmerHook } from "use-immer";
import { Pressable, StyleSheet, View } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import FeaIcon from "react-native-vector-icons/Feather";
import { HeightAndWeight } from "@/consts/AIplanPage";

export type InfoObjType = {
  heightRaw: string;
  weightRaw: string;
  sick: { chosen: Set<number>; attach: string };
  bodyImprove: { chosen: Set<number>; attach: string };
  raw: string;
};

export const InfoObjDefault: InfoObjType = {
  heightRaw: "",
  weightRaw: "",
  sick: { chosen: new Set(), attach: "" },
  bodyImprove: { chosen: new Set(), attach: "" },
  raw: "",
};

export const InfoObjStateCtx = createContext<ImmerHook<InfoObjType>>([
  InfoObjDefault,
  defaultError,
]);

export const ViewStyle = StyleSheet.create({
  Text: { fontSize: 16 },
  preInputText: { width: 80, fontSize: 16 },
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

export function ChooseRow({
  isChosen,
  toggleIsChosen,
  children,
}: {
  children?: React.ReactNode;
  isChosen: boolean;
  toggleIsChosen: () => void;
}) {
  return (
    <Pressable onPress={toggleIsChosen} style={ViewStyle.row}>
      <View style={{ flex: 1 }}>{children}</View>
      <View>
        {isChosen ? (
          /* @ts-ignore */
          <AntIcon name="checkcircle" size={24} color="#FFCC8E" />
        ) : (
          /* @ts-ignore */
          <FeaIcon name="circle" size={24} color="#DCDCDC" />
        )}
      </View>
    </Pressable>
  );
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
