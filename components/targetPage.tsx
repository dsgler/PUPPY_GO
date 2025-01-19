import { BrandColor, textColor } from "@/consts/tabs";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StyleProp,
  ViewStyle,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntIcon from "react-native-vector-icons/AntDesign";
import FeaIcon from "react-native-vector-icons/Feather";

import Pencil from "@/assets/images/targetPage/pencil";
import RightArrow from "@/assets/images/targetPage/right";
import AddIcon from "@/assets/images/targetPage/add";

import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import { useEffect, useState } from "react";
import { Modal, Portal, TouchableRipple } from "react-native-paper";
import PressableText from "./PressableText";

export default function Page() {
  console.log("渲染targetPage");

  const [insertModalV, setInsertModalV] = useState(true);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView>
        <ScrollView style={{ paddingHorizontal: 20 }}>
          <TopBar />
          <Tip />
          <AddTarget setInsertModalV={setInsertModalV} />
          <TaskRow message="增强机体免疫力" />
          <TaskRow message="锻炼肌肉" />
          <View style={{ height: 10 }} />
          <ItemRow message="你好" />
        </ScrollView>
      </SafeAreaView>
      <Portal>
        <Modal
          visible={insertModalV}
          // onDismiss={() => {
          //   setInsertModalV(false);
          // }}
          style={{
            flexDirection: "column-reverse",
            justifyContent: "flex-start",
          }}
          dismissable={false}
        >
          <View
            style={{
              height: 150,
              backgroundColor: "#F4F4F4",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginTop: 20,
              }}
            >
              <PressableText
                message="取消"
                color={BrandColor}
                highlightColor="#ffd399"
                TextStyle={{ fontSize: 16 }}
                onPress={() => {
                  setInsertModalV(false);
                }}
              />
              <Text style={{ color: textColor, fontSize: 18 }}>创建目标</Text>
              <PressableText
                message="保存"
                color={BrandColor}
                highlightColor="#ffd399"
                TextStyle={{ fontSize: 16 }}
              />
            </View>
            <View
              style={{
                borderRadius: 15,
                backgroundColor: "white",
                marginTop: 20,
                paddingHorizontal: 10,
                paddingVertical: 3,
              }}
            >
              <TextInput cursorColor={BrandColor} autoFocus={true} />
            </View>
          </View>
        </Modal>
      </Portal>
    </GestureHandlerRootView>
  );
}

function TopBar() {
  return (
    <View
      style={{
        backgroundColor: "white",
        flexDirection: "row",
        borderRadius: 25,
        alignItems: "center",
        boxShadow:
          "0 6 30 rgba(0,0,0,0.05),0 16 24 rgba(0,0,0,0.04),0 8 10 rgba(0,0,0,0.08)",
        marginTop: 10,
        marginBottom: 30,
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
          marginVertical: 5,
        }}
      >
        <Text style={{ fontSize: 16, textAlign: "center", color: BrandColor }}>
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
        <Text style={{ fontSize: 16, textAlign: "center" }}>月</Text>
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
        <Text style={{ fontSize: 16, textAlign: "center" }}>年</Text>
      </View>
    </View>
  );
}

function Tip() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          paddingHorizontal: 12,
          paddingVertical: 15,
          borderRadius: 10,
          boxShadow: "0 4 4 rgba(0,0,0,0.1)",
        }}
      >
        <Text style={{ color: textColor, fontSize: 14 }}>
          哇你又创建了新任务，记得去完成哦！{"\n"}
          Tips：拆分任务可以帮助你更好理清思路，让目标更清晰哦！
        </Text>
      </View>
      <View>
        <Image
          source={require("@/assets/images/targetPage/dog.png")}
          style={{
            width: 128,
            height: 128,
          }}
        />
      </View>
    </View>
  );
}

function AddTarget({
  setInsertModalV,
}: {
  setInsertModalV: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <TouchableRipple
      style={{
        marginTop: 20,
        borderRadius: 10,
        overflow: "hidden",
      }}
      borderless={true}
      onPress={() => {
        setInsertModalV(true);
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 60,
          backgroundColor: "#FFB52B",
        }}
      >
        <View style={{ width: 26, marginHorizontal: 16 }}>
          <AddIcon />
        </View>
        <Text style={{ color: textColor, fontSize: 14 }}>创建一个目标</Text>
      </View>
    </TouchableRipple>
  );
}

function TaskRow({
  message,
  style,
}: {
  message: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={style}>
      <View
        style={{
          flexDirection: "row",
          marginTop: 15,
          alignItems: "center",
        }}
      >
        <View>
          <Pencil />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text>{message}</Text>
        </View>
        <View>
          {/* <RightArrow /> */}
          {/* @ts-ignore */}
          <AntIcon name="rightcircleo" size={24} color={"black"} />
        </View>
      </View>
      <View
        style={{
          height: 2,
          backgroundColor: "#FF960B",
          borderRadius: 999,
          marginTop: 3,
        }}
      ></View>
    </View>
  );
}

function ItemRow({
  message,
  style,
}: {
  message: string;
  style?: StyleProp<ViewStyle>;
}) {
  const SWIPE_DISTANCE = 30;
  const swapConfig = {
    duration: 80,
    easing: Easing.in(Easing.ease),
  };

  const cardTransform = useSharedValue(0);
  const panGesture = Gesture.Pan().onEnd((e) => {
    if (e.translationX < -SWIPE_DISTANCE) {
      cardTransform.value = withTiming(-50, swapConfig);
      console.log("in");
    } else if (e.translationX > SWIPE_DISTANCE) {
      cardTransform.value = withTiming(0, swapConfig);
      console.log("back");
    }
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: cardTransform.value }],
  }));

  return (
    <View>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            {
              // display: "none",
              flexDirection: "row",
              height: 60,
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: 10,
              // boxShadow: "0 4 4 rgba(0,0,0,0.1)",
              marginBottom: 10,
            },
            animatedStyle,
            style,
          ]}
        >
          <View style={{ marginHorizontal: 16 }}>
            <Pressable>
              {/* @ts-ignore */}
              <FeaIcon name="circle" size={24} color={"#DCDCDC"} />
            </Pressable>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: textColor, fontSize: 16, lineHeight: 60 }}>
              {message}
            </Text>
          </View>
          <View style={{ marginRight: 26 }}>
            <Pencil />
          </View>
        </Animated.View>
      </GestureDetector>

      <View
        style={{
          flexDirection: "row-reverse",
          height: 60,
          alignItems: "center",
          backgroundColor: "#FF8972",
          borderRadius: 10,
          boxShadow: "0 4 4 rgba(0,0,0,0.1)",
          marginBottom: 10,

          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: -1,
        }}
      >
        <Pressable style={{ marginRight: 16 }}>
          {/* @ts-ignore */}
          <FeaIcon name="trash-2" size={24} color={"white"} />
        </Pressable>
      </View>
    </View>
  );
}
