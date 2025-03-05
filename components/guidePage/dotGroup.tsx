import { StyleProp, ViewStyle } from "react-native";
import { StyleSheet } from "react-native";
import { View } from "react-native";

const Style = StyleSheet.create({
  un: { width: 7, height: 7, backgroundColor: "#D9D9D9", borderRadius: 999 },
  ed: { width: 45, height: 7, backgroundColor: "#FFB52B", borderRadius: 999 },
});

export default function DotGroup({
  id,
  style,
}: {
  id: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ flexDirection: "row", gap: 8 }, style]}>
      <View style={id === 1 ? Style.ed : Style.un}></View>
      <View style={id === 2 ? Style.ed : Style.un}></View>
      <View style={id === 3 ? Style.ed : Style.un}></View>
      <View style={id === 4 ? Style.ed : Style.un}></View>
    </View>
  );
}
