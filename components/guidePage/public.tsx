import { unChoseColor } from "@/consts/tabs";
import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  MajorText: {
    fontSize: 36,
    color: "#000000",
    textAlign: "center",
  },
  SubText: {
    fontSize: 13,
    color: unChoseColor,
    textAlign: "center",
  },
  TextView: {
    alignItems: "center",
    position: "absolute",
    bottom: 180,
    left: 0,
    right: 0,
  },
});
