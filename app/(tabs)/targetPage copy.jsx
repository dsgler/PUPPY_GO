import React from "react";
import { StyleSheet, Dimensions, View, Text } from "react-native";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withDecay,
  clamp,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// 获取屏幕高度
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// 自定义滚动视图组件
const CustomScrollView = ({ children }) => {
  // 创建共享值，用于存储 Y 轴平移值
  const translateY = useSharedValue(0);

  // 手势处理程序
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      // 记录手势开始时的 Y 轴平移值
      console.log("start")
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      // 更新 Y 轴平移值
      translateY.value = context.startY + event.translationY;
    },
    onEnd: (event) => {
      // 使用衰减动画处理手势结束后的惯性滚动
      console.log("translateY.value："+translateY.value)
      // console.log("-(children.length * 100 - SCREEN_HEIGHT)："+-(children.length * 100 - SCREEN_HEIGHT))
      console.log("speed"+event.velocityY)
      translateY.value = withDecay({
        velocity: event.velocityY,
        clamp: [-(children.length * 100 - SCREEN_HEIGHT), 0], // 限制滚动范围
      },()=>{      translateY.value=clamp(translateY.value,-(children.length * 100 - SCREEN_HEIGHT),0)
      });
    },
    onCancel:(e)=>{
      console.log("cancel")
      translateY.value=clamp(translateY.value,-(children.length * 100 - SCREEN_HEIGHT),0)
    }
  });

  // 动画样式
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    // 使用 PanGestureHandler 处理手势事件
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};

// 主应用组件
const App = () => {
  return (
    <GestureHandlerRootView>
      <View style={styles.screen}>
        <CustomScrollView>
          {Array.from({ length: 20 }).map((_, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemText}>Item {index + 1}</Text>
            </View>
          ))}
        </CustomScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

// 样式
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
  },
  item: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  itemText: {
    fontSize: 18,
    color: "#333",
  },
});

export default App;