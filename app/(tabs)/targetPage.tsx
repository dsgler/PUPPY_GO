import MyScrollView from "@/components/myScrollView";
import { useFocusEffect } from "expo-router";
import { useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const [t, setT] = useState("132");

  useFocusEffect(() => {
    (async () => {
      setTimeout(() => {
        setT("222");
      }, 1000);
    })();
  });

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView>
        <Text>{t}</Text>
      </SafeAreaView>
    </View>
  );
}
