import React from "react";
import {
  View,
  Text,
  Pressable,
  ColorValue,
  StyleSheet,
  TextInput,
  StyleProp,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntIcon from "react-native-vector-icons/AntDesign";
import Pencil from "@/assets/images/targetPage/pencil";

const bgYellow = "#FEE6CE";
const bgRed = "#FECECE";
const bgBigRed = "#FF7272";

export default function Page() {
  return (
    <SafeAreaView style={{ paddingHorizontal: 16 }}>
      <Header />
      <View style={{ gap: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={[{ fontSize: 17 }, ColoredRowStyle.bold]}>
            跑步15分钟
          </Text>
          <Pencil />
        </View>
        <ColoredRow
          title={<Text style={ColoredRowStyle.title}>所属列表</Text>}
          backgroundColor={bgYellow}
        >
          <Text style={ColoredRowStyle.content}>减肥</Text>
        </ColoredRow>
        <ColoredRow
          title={<Text style={ColoredRowStyle.title}>创建时间</Text>}
          backgroundColor={bgYellow}
        >
          <Text style={ColoredRowStyle.content}>2025-01-19 23:28</Text>
        </ColoredRow>
        <ColoredRow
          title={<Text style={ColoredRowStyle.title}>目标时长</Text>}
          backgroundColor={bgRed}
          style={{ alignItems: "flex-start" }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: bgBigRed,
              borderRadius: 10,
              paddingHorizontal: 3,
            }}
          >
            <TextInput
              defaultValue="0"
              style={{
                fontSize: 22,
                lineHeight: 22,
                width: 40,
                color: "#FFFFFF",
                textAlign: "right",
                height: 30,
                fontWeight: 600,
                padding: 0,
                margin: 0,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                color: "#FFFFFF",
                alignSelf: "flex-end",
                marginBottom: 5,
              }}
            >
              分钟
            </Text>
          </View>
        </ColoredRow>
      </View>
    </SafeAreaView>
  );
}
function Header() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        height: 48,
        alignItems: "center",
      }}
    >
      <Pressable style={{ position: "absolute", left: 0 }}>
        {/* @ts-ignore */}
        <AntIcon name="leftcircle" size={34} color="#E8A838" />
      </Pressable>
      <Text style={[{ fontSize: 18 }, ColoredRowStyle.bold]}>目标详情</Text>
    </View>
  );
}

const ColoredRowStyle = StyleSheet.create({
  title: {
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 22,
  },
  content: {
    color: "rgba(0,0,0,0.9)",
    fontSize: 16,
    lineHeight: 24,
  },
  bold: {
    fontWeight: 600,
  },
});

function ColoredRow({
  title,
  children,
  backgroundColor,
  style,
}: {
  title: React.JSX.Element;
  children: React.ReactNode | undefined;
  backgroundColor: ColorValue;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          paddingHorizontal: 15,
          paddingVertical: 5,
          borderRadius: 10,
          backgroundColor,
          gap: 5,
        },
        style,
      ]}
    >
      <View>{title}</View>
      <View>{children}</View>
    </View>
  );
}
