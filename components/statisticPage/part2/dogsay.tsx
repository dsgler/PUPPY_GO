import { getArr } from '@/utility/getByKey';
import { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useUIStore } from '@/store/alertStore';
import { askForReply } from './askForReply';

export function DogsayRow({
  message,
  isLeft,
}: {
  message: string;
  isLeft: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: isLeft ? 'row' : 'row-reverse',
        marginHorizontal: 16,
        alignItems: 'center',
      }}
    >
      <Image
        source={require('@/assets/images/statisticPage/leftHead.png')}
        style={{
          width: 77,
          height: 77,
          transform: isLeft ? [] : [{ scaleX: -1 }],
        }}
      ></Image>
      <View
        style={{
          borderRadius: 10,
          backgroundColor: '#FFF1B0',
          flex: 1,
          paddingVertical: 10,
          paddingHorizontal: 20,
          flexDirection: 'row',
        }}
      >
        <Text style={{ fontSize: 14, flex: 1 }}>{message}</Text>
      </View>
    </View>
  );
}
export function DogsayGroup({
  reqStr,
  SystemPrompt,
}: {
  reqStr: string;
  SystemPrompt: string;
}) {
  const [raw, setRaw] = useState('');
  const showAlert = useUIStore((state) => state.showAlert);

  useEffect(() => {
    const es = askForReply({
      reqMessage: reqStr,
      setRaw,
      SystemPrompt,
      onError: showAlert,
    }).catch(showAlert);
    return () => {
      es.then((v) => {
        v?.close();
      });
    };
  }, [SystemPrompt, showAlert, reqStr]);

  let isLeft = false;
  const filteredArr = getArr(raw).map((v, k) => {
    isLeft = !isLeft;
    return <DogsayRow message={v} key={k} isLeft={isLeft} />;
  });

  if (filteredArr.length === 0) {
    return <DogsayRow message={raw} isLeft={true} />;
  } else {
    return <View style={{ gap: 10 }}>{filteredArr}</View>;
  }
}
