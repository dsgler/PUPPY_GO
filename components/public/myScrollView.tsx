import React, { useEffect } from 'react';
import Animated, {
  clamp,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { StyleProp, ViewStyle } from 'react-native';

/**
 * @describe 一个marginTop可变的ScrollView，滑动时改变translate，停止时才改变marginTop
 * @param marginTop 上边距
 * @param bounce 弹动范围
 * @param viewHeight scrollView整个可能显示的大小
 * @returns
 */
export default function MyScrollView({
  children,
  style,
  marginTop,
  bounce = 20,
  viewHeight,
}: {
  children: React.ReactNode;
  style: StyleProp<ViewStyle>;
  marginTop: number;
  bounce?: number;
  viewHeight: number;
}) {
  console.log('开始渲染ScrollView');

  // 用于计算高度，contentHeight 可能多次设置才是最终值
  // const ViewHeight = useSharedValue(0);
  const contentHeight = useSharedValue(0);

  // 通过开始时translate和offest计算最终translate
  const startTranslate = useSharedValue(0);

  // 用于设置Style
  const RootMarginTop = useSharedValue(marginTop);
  useEffect(() => {
    // console.log("marginTop changed:", marginTop);
    RootMarginTop.value = withTiming(marginTop);
  }, [RootMarginTop, marginTop]);
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
    .failOffsetX([-10, 10])
    .activeOffsetY([-10, 10])
    .onStart(() => {
      // console.log("开始滑动" + RootMarginTop.value);
      startTranslate.value = InnerTranslate.value;
    })
    .onUpdate((e) => {
      const RMT = RootMarginTop.value;
      const upBoundary = marginTop - RMT + bounce;
      const buttomBoundary = -contentHeight.value + viewHeight - RMT - bounce;

      const nextTranslate = startTranslate.value + e.translationY;

      // console.log("nextTranslate", nextTranslate);
      // 越界处理
      if (nextTranslate > upBoundary) {
        // console.log("upBoundary:" + upBoundary);
        InnerTranslate.value = upBoundary;
        return;
      }
      if (nextTranslate < buttomBoundary) {
        // console.log("buttomBoundary", buttomBoundary);
        InnerTranslate.value = buttomBoundary;
        return;
      }

      InnerTranslate.value = nextTranslate;
    })
    .onEnd((e) => {
      // 缓停动画
      const RMT = RootMarginTop.value;
      InnerTranslate.value = withDecay(
        {
          velocity: e.velocityY,
          clamp: [
            -contentHeight.value + viewHeight - RMT - bounce,
            marginTop - RMT + bounce,
          ],
        },
        () => {
          // 回弹动画，时上一个动画执行完后的回调
          InnerTranslate.value = withSpring(
            clamp(
              InnerTranslate.value,
              -contentHeight.value + viewHeight - RMT,
              marginTop - RMT,
            ),
            { duration: 500 },
            // 还是回调
            () => {
              // margin和translate偏移之和
              const off = InnerTranslate.value + RMT;

              // 调整margin
              if (off >= 0 && off <= marginTop) {
                // console.log(999, off);
                RootMarginTop.value = off;
                InnerTranslate.value = 0;
              } else {
                RootMarginTop.value = 0;
                InnerTranslate.value = off;
              }
            },
          );
        },
      );
    });

  return (
    <Animated.View style={[style, RootAnimatedStyle]}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector gesture={gestureHandler}>
          <Animated.View
            style={[InnerAnimatedStyle]}
            onLayout={(e) => {
              // console.log(777, e.nativeEvent.layout.height);
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
