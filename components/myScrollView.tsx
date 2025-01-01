import React, { useEffect, useRef } from "react";
import Animated, {
  clamp,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { StyleProp, ViewStyle } from "react-native";

export default function MyScrollView({
  children,
  style,
  marginTop,
  bounce = 10,
}: {
  children: React.ReactNode;
  style: StyleProp<ViewStyle>;
  marginTop: number;
  bounce?: number;
}) {
  console.log("渲染scroll" + marginTop);
  const ViewHeight = useSharedValue(0);
  const contentHeight = useSharedValue(0);

  let startTranslate = useSharedValue(0);
  const RootMarginTop = useSharedValue(marginTop);
  const InnerTranslate = useSharedValue(0);

  const RootAnimatedStyle = useAnimatedStyle(() => {
    return {
      marginTop: RootMarginTop.value,
    };
  });
  const InnerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: InnerTranslate.value }],
    };
  });
  const gestureHandler = Gesture.Pan()
    .onStart((e) => {
      console.log("开始滑动" + RootMarginTop.value);
      startTranslate.value = InnerTranslate.value;
    })
    .onUpdate((e) => {
      let nextTranslate = startTranslate.value + e.translationY;
      console.log(555, nextTranslate);
      if (
        nextTranslate > marginTop - RootMarginTop.value + bounce ||
        nextTranslate + RootMarginTop.value <
          -marginTop - contentHeight.value + ViewHeight.value - bounce
      ) {
        console.log(444, InnerTranslate.value);
        return;
      }

      InnerTranslate.value = nextTranslate;
    })
    .onEnd((e) => {
      InnerTranslate.value = withDecay(
        {
          velocity: e.velocityY,
          clamp: [
            -marginTop -
              contentHeight.value +
              ViewHeight.value -
              RootMarginTop.value,
            marginTop - RootMarginTop.value,
          ],
        },
        () => {
          InnerTranslate.value = clamp(
            InnerTranslate.value,
            -marginTop -
              contentHeight.value +
              ViewHeight.value -
              RootMarginTop.value,
            marginTop - RootMarginTop.value
          );
          const off = InnerTranslate.value + RootMarginTop.value;
          if (off >= 0 && off < marginTop) {
            console.log(999, off);
            RootMarginTop.value = off;
            InnerTranslate.value = 0;
          }
        }
      );
    });

  return (
    <Animated.View
      onLayout={(e) => {
        ViewHeight.value = e.nativeEvent.layout.height + marginTop;
      }}
      style={[style, RootAnimatedStyle]}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector gesture={gestureHandler}>
          <Animated.View
            style={[InnerAnimatedStyle]}
            onLayout={(e) => {
              console.log(777, e.nativeEvent.layout.height);
              contentHeight.value = e.nativeEvent.layout.height;
            }}
          >
            {children}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Animated.View>
  );
}
