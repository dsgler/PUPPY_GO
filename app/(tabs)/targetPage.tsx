import MyScrollView from "@/components/myScrollView";
import { View, Text } from "react-native";

export default function Page() {
  return (
    <MyScrollView style={{ flex: 1 }} marginTop={400}>
      {Array.from({ length: 20 }).map((v, k) => (
        <View
          style={{ height: 100, backgroundColor: "tomato", marginTop: 10 }}
          key={k}
        >
          <Text style={{ fontSize: 30, textAlign: "center" }}>{k}</Text>
        </View>
      ))}
    </MyScrollView>
  );
}
