import { unChoseColor } from "@/consts/tabs";
import { router } from "expo-router";
import { View, Image, Text, StyleProp, ViewStyle } from "react-native";
import { TouchableRipple, Icon } from "react-native-paper";

export default function AiPlan({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View
      style={[
        {
          height: 120,
          backgroundColor: "white",
          borderRadius: 10,
          marginTop: 10,
          boxShadow: "0 4 4 rgba(0,0,0,0.25)",
          flexDirection: "row",
        },
        style,
      ]}
    >
      <Image
        source={require("@/assets/images/index/dog.png")}
        style={{ width: 103, height: 103, alignSelf: "center", marginLeft: 10 }}
      />
      <View
        style={{
          height: 120,
          flex: 1,
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        <Image
          source={require("@/assets/images/index/aitext.png")}
          style={{ width: 180, height: 46.7578125 }}
        />
        <Text style={{ fontSize: 11, color: unChoseColor }}>
          小狗想帮你定制专属于你的私人运动计划哦
        </Text>
        <TouchableRipple
          onPress={() => {
            router.push({ pathname: "/AIplan" });
          }}
          onLongPress={() => {
            router.push({ pathname: "/guidePage" });
            // setsptl((v) => {
            //   v.guideStep = 1;
            // });
          }}
          borderless={true}
          style={{ borderRadius: 10, overflow: "hidden", marginTop: 5 }}
        >
          <View
            style={{
              width: 80,
              height: 30,
              backgroundColor: "#FFA356",
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 7,
            }}
          >
            <Text
              style={{ flex: 3, fontSize: 15, color: "white", lineHeight: 22 }}
            >
              去定制
            </Text>
            <View style={{ flex: 1 }}>
              <Icon source={"chevron-right"} size={20} color="white" />
            </View>
          </View>
        </TouchableRipple>
      </View>
    </View>
  );
}
