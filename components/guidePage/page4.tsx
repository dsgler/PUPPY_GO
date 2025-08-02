import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Image, View, Text, StyleProp, ViewStyle } from 'react-native';
import { Styles } from './public';
import { TouchableRipple } from 'react-native-paper';
import { router } from 'expo-router';
import DotGroup from './dotGroup';
import { useContext } from 'react';
import { useUIStore } from '@/store/alertStore';
import { produce } from 'immer';

export default function Page4({
  style,
}: {
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}) {
  const setsptl = useUIStore((s) => s.updateSpotlight);

  return (
    <Animated.View style={[{ flex: 1, overflow: 'hidden' }, style]}>
      <Animated.View
        style={{
          position: 'absolute',
          top: 204,
          left: 0,
        }}
      >
        <Animated.View
          style={{
            backgroundColor: '#FFF285',
            position: 'absolute',
            width: 500,
            height: 136,
            top: 64,
            left: -400,
          }}
        ></Animated.View>
        <Animated.View>
          <Image
            source={require('@/assets/images/guidePage/proud.png')}
            style={{ height: 232, width: 298 }}
          />
        </Animated.View>
      </Animated.View>
      <View style={Styles.TextView}>
        <Text style={[Styles.MajorText]}>小狗陪伴</Text>
        <Text style={[Styles.SubText]}>心情变好，运动才能畅快无阻！</Text>
      </View>
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 140,
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <DotGroup id={4} />
      </View>
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 80,
          alignItems: 'center',
        }}
      >
        <TouchableRipple
          style={{
            flexDirection: 'row',
            width: 90,
            height: 33,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FF960B',
            borderRadius: 15,
            overflow: 'hidden',
          }}
          borderless={true}
          onPress={() => {
            router.dismissTo('/(tabs)');
            setsptl(
              produce(useUIStore.getState().spotlight, (v) => {
                v.guideStep = 1;
              }),
            );
          }}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>立即体验</Text>
        </TouchableRipple>
      </View>
    </Animated.View>
  );
}
