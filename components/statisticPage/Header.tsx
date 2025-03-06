import { router } from "expo-router";
import { View, Text, Pressable } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";

export function Header({
  date,
  ShowDatePicker,
}: {
  date: Date;
  ShowDatePicker: () => void;
}) {
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
          hitSlop={10}
        >
          {/* @ts-ignore */}
          <AntIcon name="close" size={16} />
        </Pressable>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 17, fontWeight: 700 }}>
            {date.getFullYear()}年{date.getMonth() + 1}月{" "}
          </Text>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.7)",
              borderRadius: 999,
              padding: 2,
            }}
          >
            <Pressable onPress={ShowDatePicker}>
              {/* @ts-ignore */}
              <AntIcon name="down" size={10} />
            </Pressable>
          </View>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
    </View>
  );
}
