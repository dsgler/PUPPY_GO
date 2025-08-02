import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Image, View, Text, StyleProp, ViewStyle } from 'react-native';
import { Styles } from './public';
import DotGroup from './dotGroup';

export default function Page1({
  style,
}: {
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}) {
  return (
    <Animated.View style={[{ flex: 1, overflow: 'hidden' }, style]}>
      <Animated.View
        style={{
          transform: [{ rotate: '22.32deg' }],
          position: 'absolute',
          top: 50,
          left: 0,
        }}
      >
        <Animated.View
          style={{
            backgroundColor: '#FFF285',
            position: 'absolute',
            width: 500,
            height: 136,
            top: 120,
            left: 180,
          }}
        ></Animated.View>
        <Animated.View>
          <Image
            source={require('@/assets/images/targetPage/dog.png')}
            style={{ height: 325, width: 325 }}
          />
        </Animated.View>
      </Animated.View>
      <View style={Styles.TextView}>
        <Text style={[Styles.MajorText]}>心情or耗力</Text>
        <Text style={[Styles.SubText]}>你的每一步都值得被记录</Text>
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
        <DotGroup id={1} />
      </View>
    </Animated.View>
  );
}
