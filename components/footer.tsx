import { router } from "expo-router";
import { View, Text, Image, Pressable } from "react-native";
import { Surface } from "react-native-paper";
import AddIcon from "@/assets/images/Footer/add";
import LeftIcon from "@/assets/images/Footer/left";
import LeftedIcon from "@/assets/images/Footer/lefted";
import RighIcon from "@/assets/images/Footer/right";
import RighedIcon from "@/assets/images/Footer/righted";
import * as R from "@/consts/tabs";

export default function Footer({
  activePage,
  setActivePage,
}: {
  activePage: R.activePageType;
  setActivePage: React.Dispatch<React.SetStateAction<R.activePageType>>;
}) {
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
              setActivePage(R.indexPageId);
              router.dismissTo("/(tabs)");
              // router.
            }}
          >
            {activePage === R.indexPageId ? <LeftedIcon /> : <LeftIcon />}
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
              setActivePage(R.targetPageId);
              router.dismissTo("/(tabs)/targetPage");
            }}
          >
            {activePage === R.targetPageId ? <RighedIcon /> : <RighIcon />}
          </Pressable>
        </View>
      </View>
    </Surface>
  );
}
