import { useUIStore } from '@/store/alertStore';
import { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Pressable,
  GestureResponderEvent,
} from 'react-native';
import { AddTargetStates } from './public';

export function EmptyDog({
  showAddTarget,
}: {
  showAddTarget: (
    e?: GestureResponderEvent,
    isClear?: boolean,
    afterClear?: (AddTargetStates: AddTargetStates) => void,
  ) => void;
}) {
  const updateSpotlight = useUIStore((state) => state.updateSpotlight);
  const spotlight = useUIStore((state) => state.spotlight);
  const myRef = useRef<View>(null);
  useEffect(() => {
    if (spotlight.guideStep === 4) {
      myRef.current?.measure((x, y, width, height, pageX, pageY) => {
        const o = {
          x: pageX - 5,
          y: pageY - 5,
          w: width + 10,
          h: height + 10,
          guideStep: 4,
        };
        console.log(o);
        updateSpotlight(o);
      });
    }
  }, [updateSpotlight, spotlight.guideStep]);

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { justifyContent: 'center', alignItems: 'center' },
      ]}
    >
      <Image
        source={require('@/assets/images/targetPage/empty.png')}
        style={{ width: 233, height: 187 }}
      />
      <Text style={{ color: '#828287', fontSize: 14, textAlign: 'center' }}>
        {'还没有目标哦……\n先从一件小事开始吧'}
      </Text>
      <Pressable
        style={{
          backgroundColor: '#FF960B',
          borderRadius: 15,
          paddingHorizontal: 16,
          paddingVertical: 6,
          marginTop: 10,
        }}
        onPress={() => {
          showAddTarget();
        }}
        ref={myRef}
      >
        <Text style={{ fontSize: 16, color: '#FFFFFF' }}>去添加</Text>
      </Pressable>
    </View>
  );
}
