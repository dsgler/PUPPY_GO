import { Pressable, View } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FeaIcon from 'react-native-vector-icons/Feather';
import { ViewStyle } from './ViewStyle';

export function ChooseRow({
  isChosen,
  toggleIsChosen,
  children,
}: {
  children?: React.ReactNode;
  isChosen: boolean;
  toggleIsChosen: () => void;
}) {
  return (
    <Pressable onPress={toggleIsChosen} style={ViewStyle.row}>
      <View style={{ flex: 1 }}>{children}</View>
      <View>
        {isChosen ? (
          <AntIcon name="checkcircle" size={24} color="#FFCC8E" />
        ) : (
          <FeaIcon name="circle" size={24} color="#DCDCDC" />
        )}
      </View>
    </Pressable>
  );
}
