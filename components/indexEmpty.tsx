import { Text, View, Dimensions, Image } from "react-native";
import { Link } from "expo-router";
import Footer from "@/components/footer";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#FFCC8E", "#FFF0DE"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: Dimensions.get("screen").height,
        }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View style={{ alignContent: "center", justifyContent: "center" }}>
            <Image
              source={require("@/assets/images/index/nothing.png")}
              resizeMode="center"
              style={{ width: 240, height: 187 }}
            ></Image>
            <Text style={{ textAlign: "center", color: "#828287" }}>
              还没有记录哦……
            </Text>
            <Text style={{ textAlign: "center", color: "#828287" }}>
              小狗会一直等着你的
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
