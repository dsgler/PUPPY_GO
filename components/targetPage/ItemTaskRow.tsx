import { textColor } from '@/consts/tabs';
import { Text, Pressable, StyleProp, ViewStyle, View } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FeaIcon from 'react-native-vector-icons/Feather';

import Pencil from '@/assets/images/targetPage/pencil';

import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { useContext } from 'react';

import { useSQLiteContext } from 'expo-sqlite';
import { cancelCheck, deleteTarget, setCheck } from '@/sqls/targetSql2';
import { useUIStore } from '@/store/alertStore';
import { router } from 'expo-router';
import { RefreshFnCtx, myLayoutTransition } from './public';

export type TaskItemRowProps = {
  typeName: string;
  style?: StyleProp<ViewStyle>;
  isFinished: boolean;
  targetId: number;
};

export function TaskItemRow({
  typeName,
  style,
  isFinished,
  targetId,
}: TaskItemRowProps) {
  const swapConfig = {
    duration: 80,
    easing: Easing.in(Easing.ease),
  };

  const cardTransform = useSharedValue(0);
  const leftGesture = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => {
      cardTransform.value = withTiming(-50, swapConfig);
    });
  const rightGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      cardTransform.value = withTiming(0, swapConfig);
    });

  const myGesture = Gesture.Exclusive(leftGesture, rightGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: cardTransform.value }],
  }));

  const db = useSQLiteContext();
  const showAlert = useUIStore((state) => state.showAlert);
  const showConfirm = useUIStore((state) => state.showConfirm);
  const RefreshFn = useContext(RefreshFnCtx);
  return (
    <Animated.View
      style={style}
      // entering={myFadeIn}
      // exiting={myFadeOut}
      layout={myLayoutTransition}
    >
      <GestureDetector gesture={myGesture}>
        <Animated.View
          style={[
            {
              // display: "none",
              flexDirection: 'row',
              minHeight: 60,
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 10,
              // boxShadow: "0 4 4 rgba(0,0,0,0.1)",
              marginBottom: 10,
            },
            animatedStyle,
          ]}
        >
          <View style={{ marginHorizontal: 16 }}>
            <Pressable
              onPress={() => {
                if (isFinished) {
                  cancelCheck(db, targetId).catch(showAlert).then(RefreshFn);
                } else {
                  setCheck(db, targetId).catch(showAlert).then(RefreshFn);
                }
              }}
            >
              {isFinished ? (
                <AntIcon name="checkcircle" size={24} color="#FFCC8E" />
              ) : (
                <FeaIcon name="circle" size={24} color="#DCDCDC" />
              )}
            </Pressable>
          </View>
          <View style={{ flex: 1, marginRight: 5 }}>
            <Text
              style={{
                color: isFinished ? 'rgba(0,0,0,0.25)' : textColor,
                fontSize: 16,
                // lineHeight: 60,
              }}
            >
              {typeName}
            </Text>
          </View>
          <Pressable
            style={{ marginRight: 26 }}
            onPress={() => {
              router.push({
                pathname: '/editTarget',
                params: { targetId: targetId },
              });
            }}
          >
            <Pencil />
          </Pressable>
        </Animated.View>
      </GestureDetector>

      <View
        style={{
          flexDirection: 'row-reverse',
          height: 60,
          alignItems: 'center',
          backgroundColor: '#FF8972',
          borderRadius: 10,
          boxShadow: '0 4 4 rgba(0,0,0,0.1)',
          marginBottom: 10,

          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: -1,
        }}
      >
        <Pressable
          style={{ marginRight: 16 }}
          onPress={() => {
            showConfirm('确定删除吗？', () => {
              deleteTarget(db, targetId).then(RefreshFn).catch(showAlert);
            });
          }}
        >
          <FeaIcon name="trash-2" size={24} color={'white'} />
        </Pressable>
      </View>
    </Animated.View>
  );
}
