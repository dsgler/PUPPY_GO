import { View, Text, Pressable, Share } from 'react-native';
import { InfoObjStateCtx } from './public';
import { ViewStyle } from './ViewStyle';
import { BrandColor } from '@/consts/tabs';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { useContext } from 'react';
import { router } from 'expo-router';

export default function EndView() {
  const [InfoObj] = useContext(InfoObjStateCtx);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          transform: [{ translateY: -50 }],
        }}
      >
        <AntIcon name="checkcircle" size={80} color={BrandColor} />
        <Text style={[ViewStyle.mainText, { marginVertical: 20 }]}>
          生成完毕
        </Text>
        <Text style={ViewStyle.subText}>
          快去看看小狗为你精心准备的规划吧！
        </Text>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          gap: 8,
        }}
      >
        <Pressable
          style={{
            flex: 1,
            borderRadius: 6,
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: BrandColor,
            flexDirection: 'row',
            alignItems: 'center',
            height: 48,
            justifyContent: 'center',
          }}
          onPress={() => {
            Share.share({
              message: InfoObj.retArr
                .map(
                  (v) =>
                    `组名:${v.组名}\n训练项目:\n${v.训练项目
                      .map(
                        (m, k) =>
                          `${k + 1}.\n  项目名:${m.项目名}\n  训练频率:${
                            m.训练频率
                          }\n  每月目标训练次数:${m.每月目标训练次数}\n`,
                      )
                      .join(' \n')}`,
                )
                .join('\n \n'),
            });
          }}
        >
          <AntIcon name="sharealt" size={24} color={BrandColor} />
          <Text style={{ fontSize: 16, color: BrandColor }}>分享给朋友</Text>
        </Pressable>
        <Pressable
          style={{
            flex: 1,
            borderRadius: 6,
            backgroundColor: BrandColor,
            borderWidth: 1,
            borderColor: BrandColor,
            flexDirection: 'row',
            alignItems: 'center',
            height: 48,
            justifyContent: 'center',
          }}
          onPress={() => {
            router.dismissTo('/(tabs)/targetPage');
          }}
        >
          <Text style={{ fontSize: 16, color: 'white' }}>去查看</Text>
        </Pressable>
      </View>
    </View>
  );
}
