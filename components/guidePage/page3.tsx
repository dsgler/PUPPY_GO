import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Image, View, Text, StyleProp, ViewStyle } from 'react-native';
import { Styles } from './public';
import DotGroup from './dotGroup';

export default function Page3({
  style,
}: {
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}) {
  return (
    <Animated.View style={[{ flex: 1, overflow: 'hidden' }, style]}>
      <Animated.View
        style={{
          //   transform: [{ rotate: "22.32deg" }],
          position: 'absolute',
          top: 220,
          left: 20,
        }}
      >
        <Animated.View
          style={{
            backgroundColor: '#FFF285',
            position: 'absolute',
            width: 500,
            height: 136,
            top: 48,
            left: 180,
          }}
        ></Animated.View>
        <Animated.View>
          <Image
            source={require('@/assets/images/index/nothing.png')}
            style={{ height: 232, width: 298 }}
          />
        </Animated.View>
      </Animated.View>
      <View style={Styles.TextView}>
        <Text style={[Styles.MajorText]}>复盘总结</Text>
        <Text style={[Styles.SubText]}>原来你已经做到了这么多</Text>
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
        <DotGroup id={3} />
      </View>
    </Animated.View>
  );
}
