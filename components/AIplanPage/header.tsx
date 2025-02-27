import { View, Text, Pressable } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import Location from "@/assets/images/AIplan/location";
import { router } from "expo-router";

export default function Header() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Pressable
        onPress={() => {
          router.back();
        }}
      >
        {/* @ts-ignore */}
        <AntIcon name="leftcircle" size={30} color="#E8A838" />
      </Pressable>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#E8A838",
          // height: 30,
          paddingVertical: 5,
          paddingHorizontal: 8,
          borderRadius: 15,
          gap: 5,
        }}
      >
        <Location />
        <Text style={{ fontSize: 14, color: "white" }}>我的目标</Text>
      </View>
    </View>
  );
}
