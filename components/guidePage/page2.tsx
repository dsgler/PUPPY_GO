import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Image, View, Text, StyleProp, ViewStyle } from 'react-native';
import { Styles } from './public';
import DotGroup from './dotGroup';

export default function Page2({
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
          top: 193,
          left: 0,
        }}
      >
        <Animated.View
          style={{
            backgroundColor: '#FFF285',
            position: 'absolute',
            width: 500,
            height: 136,
            top: 0,
            left: 0,
            transform: [
              { rotate: '22.32deg' },
              { translateX: -320 },
              { translateY: 150 },
            ],
          }}
        ></Animated.View>
        <Animated.View>
          <Image
            source={require('@/assets/images/guidePage/baseball.png')}
            style={{
              height: 323,
              width: 323,
              transform: [{ rotate: '11.81deg' }],
            }}
          />
        </Animated.View>
      </Animated.View>
      <View style={Styles.TextView}>
        <Text style={[Styles.MajorText]}>智能规划</Text>
        <Text style={[Styles.SubText]}>这是专属于你的进阶方案</Text>
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
        <DotGroup id={2} />
      </View>
    </Animated.View>
  );
}
