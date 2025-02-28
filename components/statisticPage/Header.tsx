import { router } from "expo-router";
import { View, Text, Pressable } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";

export function Header() {
  let d = new Date();
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pressable
          style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
          onPress={() => {
            router.back();
          }}
        >
          {/* @ts-ignore */}
          <AntIcon name="close" size={16} />
        </Pressable>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 17, fontWeight: 700 }}>
            {d.getFullYear()}年{d.getMonth() + 1}月{" "}
          </Text>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.7)",
              borderRadius: 999,
              padding: 2,
            }}
          >
            {/* @ts-ignore */}
            <AntIcon name="down" size={10} />
          </View>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
    </View>
  );
}
