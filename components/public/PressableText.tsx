import { useState } from 'react';
import {
  ColorValue,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
} from 'react-native';

export default function PressableText({
  message,
  color,
  highlightColor,
  TextStyle,
  onPress,
}: {
  message: string;
  color: ColorValue;
  highlightColor: ColorValue;
  TextStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
}) {
  const [isHover, setIsHover] = useState(false);

  return (
    <Pressable
      onPressIn={() => {
        setIsHover(true);
      }}
      onPressOut={() => {
        setIsHover(false);
      }}
      onPress={onPress}
    >
      <Text style={[{ color: isHover ? highlightColor : color }, TextStyle]}>
        {message}
      </Text>
    </Pressable>
  );
}
