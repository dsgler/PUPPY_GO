import {
  Easing,
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { createContext } from "react";
import { ImmerHook } from "use-immer";

import { getGapTimeString } from "@/utility/datetool";
import { frequencyType, targetRow } from "@/sqls/targetSql2";
import sportArr from "@/consts/sportType";
import * as consts_frequency from "@/consts/frequency";
import { BrandColor } from "@/consts/tabs";
import { StyleSheet } from "react-native";
import { defaultError } from "@/consts/defaultError";

export function getDescription(v: {
  sportId: number;
  description: string;
  duration: number;
}) {
  return v.sportId === -1
    ? v.description
    : `${sportArr[v.sportId].sportName}${getGapTimeString(v.duration)}`;
}

export const MenuCtx = createContext<
  [menuObjType, (menuobj: menuObjType) => void]
>([
  {
    x: 0,
    y: 0,
    visibility: false,
    targetId: -1,
    groupId: -1,
    groupName: "",
  },
  defaultError,
]);

export type menuObjType = {
  x: number;
  y: number;
  visibility: boolean;
  targetId: number;
  groupId: number;
  groupName: string;
};

export const RefreshFnCtx = createContext<() => void>(() => {
  throw Error("不应获取默认值");
});

export const ShowAddTargetCtx =
  createContext<
    (
      isClear?: boolean,
      afterClear?: (AddTargetStates: AddTargetStates) => void
    ) => void
  >(defaultError);
export const ShowAddGroupCtx = createContext<() => void>(defaultError);
export type AddTargetStates = {
  frequencyState: ImmerHook<frequencyType>;
  dataState: ImmerHook<targetRow>;
};
export const AddTarget_frequencyStateDefault = {
  typeId: consts_frequency.DAILY,
  content: [],
};
export const AddTarget_dataStateDefault = {
  Id: -1,
  groupId: -1,
  description: "",
  makeTime: -1,
  duration: 0,
  count: 0,
  frequency: "",
  sportId: -1,
  endTime: -1,
};

export const myFadeIn = FadeIn.duration(300).easing(Easing.inOut(Easing.quad));
export const myFadeOut = FadeOut.duration(300).easing(
  Easing.inOut(Easing.quad)
);
export const myLayoutTransition = LinearTransition.duration(300);
export const TopBarStyle = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "row",
    borderRadius: 25,
    alignItems: "center",
    boxShadow:
      "0 6 30 rgba(0,0,0,0.05),0 16 24 rgba(0,0,0,0.04),0 8 10 rgba(0,0,0,0.08)",
    marginTop: 10,
    marginBottom: 30,
  },
  left: {
    height: 40,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 5,
    marginVertical: 5,
    borderRadius: 20,
  },
  middle: {
    height: 40,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 20,
  },
  right: {
    height: 40,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginLeft: 5,
    marginVertical: 5,
    borderRadius: 20,
  },
  chosen: {
    backgroundColor: "#FFE7CA",
    borderRadius: 20,
  },
  chosenText: { fontSize: 16, textAlign: "center", color: BrandColor },
  unchosen: {},
  unchosenText: { fontSize: 16, textAlign: "center" },
  TouchableRipple: { flex: 1, borderRadius: 20 },
});
