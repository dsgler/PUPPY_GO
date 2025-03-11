import React, { useRef } from "react";
import { Pressable, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function ShakeView({
  children,
  xTimes = 0,
  duration,
  style,
  xRange = 0,
  yRange = 0,
  yTimes = 0,
  onPress,
}: {
  children: React.ReactNode;
  xTimes?: number;
  yTimes?: number;
  xRange?: number;
  yRange?: number;
  style?: ViewStyle;
  duration: number;
  onPress?: () => void;
}) {
  const xt = useSharedValue(0);
  const yt = useSharedValue(0);
  const isLocked = useRef(false);
  const d = { duration };
  const s = useAnimatedStyle(() => ({
    transform: [{ translateX: xt.value }, { translateY: yt.value }],
  }));

  return (
    <Animated.View style={[style, s]}>
      <Pressable
        onPress={() => {
          if (onPress) onPress();
          if (isLocked.current) return;

          const sx = xt.value;
          const sy = yt.value;
          isLocked.current = true;
          setTimeout(() => {
            isLocked.current = false;
            console.log(xt.value, 777);
            console.log(yt.value, 777);
          }, d.duration * Math.max(xTimes + 4, yTimes + 4));
          if (xTimes !== 0 && xRange !== 0) {
            xt.value = withSequence(
              withTiming(sx - xRange, d),
              withRepeat(withTiming(xt.value + xRange * 2, d), xTimes, true),
              withTiming(sx, d)
            );
          }
          if (yTimes !== 0 && yRange !== 0) {
            yt.value = withSequence(
              withTiming(sy - yRange, d),
              withRepeat(withTiming(xt.value + yRange * 2, d), yTimes, true),
              withTiming(sy, d)
            );
          }
        }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
