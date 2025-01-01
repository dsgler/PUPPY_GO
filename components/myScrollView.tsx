import React, { useEffect, useRef } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
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
}: {
  children: React.ReactNode;
  style: StyleProp<ViewStyle>;
  marginTop: number;
}) {
  console.log("渲染scroll" + marginTop);
  const ViewHeight = useRef(0);
  const contentHeight = useRef(0);

  let startMargin = useSharedValue(0);
  let startTranslate = useSharedValue(0);
  const RootMarginTop = useSharedValue(marginTop);
  const InnerTranslate = useSharedValue(0);

  const RootAnimatedStyle = useAnimatedStyle(() => {
    console.log(RootMarginTop.value);
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
      if (RootMarginTop.value > 0) {
        startMargin.value = RootMarginTop.value;
        startTranslate.value = InnerTranslate.value;
      } else {
        startTranslate.value = InnerTranslate.value;
        startMargin.value = RootMarginTop.value;
      }
    })
    .onUpdate((e) => {
      //   console.log(RootMarginTop.value);
      if (RootMarginTop.value > 0) {
        let nextMargin = startMargin.value + e.translationY;
        console.log("nextMargin" + nextMargin);
        if (nextMargin <= 0) {
          startMargin.value = 0;
          startTranslate.value = nextMargin;
          RootMarginTop.value = 0;
          InnerTranslate.value = nextMargin;
        } else {
          RootMarginTop.value = nextMargin;
        }
      } else {
        let nextTranslate = startTranslate.value + e.translationY;
        if (nextTranslate > 0) {
          startTranslate.value = 0;
          startMargin.value = nextTranslate;
          RootMarginTop.value = nextTranslate;
          InnerTranslate.value = 0;
        } else {
          InnerTranslate.value = nextTranslate;
        }
      }
    })
    .onEnd((e) => {
      if (RootMarginTop.value <= 0) {
      }
    });

  return (
    <Animated.View
      onLayout={(e) => {
        ViewHeight.current = e.nativeEvent.layout.height + marginTop;
      }}
      style={[style, RootAnimatedStyle]}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector gesture={gestureHandler}>
          <Animated.View
            style={[{ flex: 1 }, InnerAnimatedStyle]}
            onLayout={(e) => {
              contentHeight.current = e.nativeEvent.layout.height;
            }}
          >
            {children}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Animated.View>
  );
}
