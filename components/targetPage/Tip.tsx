import { textColor } from '@/consts/tabs';
import { View, Text, Image } from 'react-native';

export function Tip() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          paddingHorizontal: 12,
          paddingVertical: 15,
          borderRadius: 10,
          boxShadow: '0 4 4 rgba(0,0,0,0.1)',
        }}
      >
        <Text style={{ color: textColor, fontSize: 14 }}>
          哇你又创建了新任务，记得去完成哦！{'\n'}
          Tips：拆分任务可以帮助你更好理清思路，让目标更清晰哦！
        </Text>
      </View>
      <View>
        <Image
          source={require('@/assets/images/targetPage/dog.png')}
          style={{
            width: 128,
            height: 128,
          }}
        />
      </View>
    </View>
  );
}
