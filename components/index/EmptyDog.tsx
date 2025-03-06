import { Text, View, Image } from "react-native";
import { router } from "expo-router";
import React, { useCallback } from "react";

import { TouchableRipple } from "react-native-paper";

export function EmptyDog({ date }: { date: number }) {
  console.log("dogdate:", date);
  return (
    <>
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
      <TouchableRipple
        borderless={true}
        onPress={useCallback(
          () => router.push({ pathname: "/addPage", params: { date } }),
          [date]
        )}
        style={{ borderRadius: 15, marginTop: 10, overflow: "hidden" }}
      >
        <View
          style={{
            width: 80,
            height: 32,
            backgroundColor: "#FF960B",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 16, textAlign: "center", color: "white" }}>
            去记录
          </Text>
        </View>
      </TouchableRipple>
    </>
  );
}
