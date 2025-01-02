import React, { useEffect, useRef } from "react";
import Animated, {
  clamp,
  useAnimatedStyle,
  useSharedValue,
  withClamp,
  withDecay,
  withSpring,
  withTiming,
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
  bounce = 20,
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
        nextTranslate <
          -contentHeight.value + ViewHeight.value - RootMarginTop.value - bounce
      ) {
        console.log(444, InnerTranslate.value);
        console.log(
          888,
          nextTranslate,
          contentHeight.value,
          ViewHeight.value,
          RootMarginTop.value
        );
        return;
      }

      InnerTranslate.value = nextTranslate;
    })
    .onEnd((e) => {
      InnerTranslate.value = withDecay(
        {
          velocity: e.velocityY,
          clamp: [
            -contentHeight.value +
              ViewHeight.value -
              RootMarginTop.value -
              bounce,
            marginTop - RootMarginTop.value + bounce,
          ],
        },
        () => {
          InnerTranslate.value = withSpring(
            clamp(
              InnerTranslate.value,
              -contentHeight.value + ViewHeight.value - RootMarginTop.value,
              marginTop - RootMarginTop.value
            ),
            { duration: 500 },
            () => {
              const off = InnerTranslate.value + RootMarginTop.value;
              if (off >= 0 && off <= marginTop) {
                console.log(999, off);
                RootMarginTop.value = off;
                InnerTranslate.value = 0;
              } else {
                RootMarginTop.value = 0;
                InnerTranslate.value = off;
              }
            }
          );
        }
      );
    });

  return (
    <Animated.View
      onLayout={(e) => {
        console.log(111, e.nativeEvent.layout.height);
        if (ViewHeight.value !== 0) {
          return;
        }
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
              // if (contentHeight.value !== 0) {
              //   return;
              // }
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
