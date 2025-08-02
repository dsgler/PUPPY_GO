import { Text, Pressable } from 'react-native';
import { ChooseSport } from '@/components/addPage/addPage';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Animated from 'react-native-reanimated';
import { useState } from 'react';
import { myFadeIn, myFadeOut, myLayoutTransition } from '@/consts/anime';

export default function F({
  sportId,
  setSportId,
}: {
  sportId: number;
  setSportId: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Animated.View>
      <Animated.View
        layout={myLayoutTransition}
        style={{
          backgroundColor: 'rgba(255,255,255,0.5)',
          alignSelf: 'flex-start',
          paddingVertical: 10,
          paddingHorizontal: 10,
          borderRadius: 20,
        }}
      >
        <Pressable
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={() => {
            setSportId(-1);
            setIsOpen(!isOpen);
          }}
        >
          <Text style={{ color: '#828287', fontSize: 14, marginRight: 5 }}>
            全部运动
          </Text>
          <AntIcon name="caretdown" color={'#828287'} size={14} />
        </Pressable>
      </Animated.View>
      {isOpen && (
        <Animated.View entering={myFadeIn} exiting={myFadeOut}>
          <ChooseSport sportId={sportId} setSportId={setSportId} />
        </Animated.View>
      )}
    </Animated.View>
  );
}
