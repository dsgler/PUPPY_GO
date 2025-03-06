import { BrandColor } from "@/consts/tabs";
import { StyleProp, ColorValue, View, Text } from "react-native";
import { ViewStyle, TextStyle } from "react-native";

export function Progress({
  isShowText,
  total,
  achieved,
  style,
  textStyle,
  height = 30,
  color = BrandColor,
  achievedColor = "#2BA471",
}: {
  isShowText: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  total: number;
  achieved: number;
  height?: number;
  color?: ColorValue;
  achievedColor?: ColorValue;
}) {
  if (total === 0) {
    total = achieved = 1;
  }
  const isAchieved = achieved >= total;

  return (
    <View
      style={[
        {
          borderRadius: 999,
          backgroundColor: "#E7E7E7",
          height: height,
          overflow: "hidden",
          flexDirection: "row",
        },
        style,
      ]}
    >
      <View
        style={{
          flex: achieved,
          flexDirection: "row",
          // borderRadius: 999,
          backgroundColor: isAchieved ? achievedColor : color,
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}></View>
      </View>
      <View style={{ flex: total - achieved, flexDirection: "row" }}>
        <View
          style={{
            backgroundColor: isAchieved ? achievedColor : color,
            borderTopRightRadius: 999,
            borderBottomRightRadius: 999,
            minWidth: height / 2,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {isShowText ? (
            <Text style={[{ marginHorizontal: 5, color: "white" }, textStyle]}>
              {Math.round((100 * achieved) / total) + "%"}
            </Text>
          ) : undefined}
        </View>
      </View>
    </View>
  );
}
