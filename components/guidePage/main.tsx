import Animated, {
  clamp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
} from "react-native-reanimated";
import Page1 from "./page1";
import { SafeAreaView } from "react-native-safe-area-context";
import Page2 from "./page2";
import Page3 from "./page3";
import Page4 from "./page4";
import { Dimensions, StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useState } from "react";

export default function Page() {
  const pageWinth = Dimensions.get("window").width;

  // 确保按钮能点（不知道为什么）
  const [r, setR] = useState(false);
  const refresh = () => {
    setR(!r);
  };

  const transX = useSharedValue(0);
  const startX = useSharedValue(0);
  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = transX.value;
    })
    .onUpdate((e) => {
      let nextTranslate = startX.value + e.translationX;
      nextTranslate = clamp(nextTranslate, -3 * pageWinth, 0);
      transX.value = nextTranslate;
    })
    .onEnd((e) => {
      const isForward = e.velocityX < 0;
      const t = transX.value;
      const aim = clamp(
        Math.round(t / pageWinth) * pageWinth,
        -3 * pageWinth,
        0
      );
      const c: [number, number] = !isForward
        ? [aim, aim + pageWinth]
        : [aim - pageWinth, aim];
      c[0] = clamp(c[0], -3 * pageWinth, 0);
      c[1] = clamp(c[1], -3 * pageWinth, 0);

      transX.value = withDecay(
        {
          clamp: c,
          velocity: e.velocityX,
          deceleration: 0.999,
        },
        () => {
          const t = transX.value;
          const aim = clamp(
            Math.round(t / pageWinth) * pageWinth,
            -3 * pageWinth,
            0
          );
          transX.value = withTiming(aim, { duration: 50 }, runOnJS(refresh));
        }
      );
    });

  const p1Style = useAnimatedStyle(() => ({
    transform: [{ translateX: transX.value }],
  }));
  const p2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: transX.value + 1 * pageWinth }],
  }));
  const p3Style = useAnimatedStyle(() => ({
    transform: [{ translateX: transX.value + 2 * pageWinth }],
  }));
  const p4Style = useAnimatedStyle(() => ({
    transform: [{ translateX: transX.value + 3 * pageWinth }],
  }));

  return (
    <GestureHandlerRootView>
      <Animated.View style={{ flex: 1, backgroundColor: "white" }}>
        <GestureDetector gesture={panGesture}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={[StyleSheet.absoluteFill]}>
              <Page1 style={p1Style} />
            </View>
            <View style={[StyleSheet.absoluteFill]}>
              <Page2 style={p2Style} />
            </View>
            <View style={[StyleSheet.absoluteFill]}>
              <Page3 style={p3Style} />
            </View>
            <View style={[StyleSheet.absoluteFill]}>
              <Page4 style={p4Style} />
            </View>
            <View></View>
          </SafeAreaView>
        </GestureDetector>
      </Animated.View>
    </GestureHandlerRootView>
  );
}
