import MyScrollView from "@/components/myScrollView";
import { BrandColor } from "@/consts/tabs";
import { useFocusEffect } from "expo-router";
import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView>
        <ScrollView style={{ paddingHorizontal: 20 }}>
          <View
            style={{
              height: 50,
              backgroundColor: "white",
              marginVertical: 15,
              flexDirection: "row",
              borderRadius: 25,
              alignItems: "center",
              boxShadow:
                "0 6 30 rgba(0,0,0,0.05),0 16 24 rgba(0,0,0,0.04),0 8 10 rgba(0,0,0,0.08)",
            }}
          >
            <View
              style={{
                height: 40,
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#FFE7CA",
                borderRadius: 20,
                marginLeft: 10,
                marginRight: 5,
              }}
            >
              <Text
                style={{ fontSize: 16, textAlign: "center", color: BrandColor }}
              >
                日
              </Text>
            </View>
            <View
              style={{
                height: 40,
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: 5,
              }}
            >
              <Text style={{ fontSize: 16, textAlign: "center" }}>日</Text>
            </View>
            <View
              style={{
                height: 40,
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: 5,
              }}
            >
              <Text style={{ fontSize: 16, textAlign: "center" }}>日</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
