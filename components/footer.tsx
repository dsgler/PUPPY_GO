import { router } from "expo-router";
import { View, Pressable } from "react-native";
import { Surface } from "react-native-paper";
import AddIcon from "@/assets/images/Footer/add";
import LeftIcon from "@/assets/images/Footer/left";
import LeftedIcon from "@/assets/images/Footer/lefted";
import RighIcon from "@/assets/images/Footer/right";
import RighedIcon from "@/assets/images/Footer/righted";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

export default function Footer({ props }: { props: BottomTabBarProps }) {
  let indexMap = new Map<string, number>();
  for (let i = 0; i < props.state.routes.length; i++) {
    indexMap.set(props.state.routes[i].name, i);
  }

  return (
    <Surface elevation={5}>
      <View
        style={{ flexDirection: "row", height: 70, backgroundColor: "white" }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Pressable
            onPress={() => {
              props.navigation.navigate("index");
            }}
          >
            {props.state.index === indexMap.get("index") ? (
              <LeftedIcon />
            ) : (
              <LeftIcon />
            )}
          </Pressable>
        </View>

        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Pressable
            onPress={() => {
              router.push("/addPage");
            }}
          >
            <AddIcon />
          </Pressable>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Pressable
            onPress={() => {
              props.navigation.navigate("targetPage");
            }}
          >
            {props.state.index === indexMap.get("targetPage") ? (
              <RighedIcon />
            ) : (
              <RighIcon />
            )}
          </Pressable>
        </View>
      </View>
    </Surface>
  );
}
