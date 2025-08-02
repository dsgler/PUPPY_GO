import { dayDescriptionChina } from '@/consts/dayDescription';
import * as consts_frequency from '@/consts/frequency';
import { BrandColor } from '@/consts/tabs';
import { getProgressByWeekRetRow } from '@/sqls/targetSql2';
import { useState, useContext } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FeaIcon from 'react-native-vector-icons/Feather';
import { Progress } from './Progress';
import {
  getDescription,
  myFadeIn,
  myLayoutTransition,
  ShowAddTargetCtx,
} from './public';

export function WeekGroup({ data }: { data: getProgressByWeekRetRow }) {
  const [isFolded, setIsFolded] = useState(
    new Date().getDay() === (data.day + 1) % 7 ? false : true,
  );
  const showAddTarget = useContext(ShowAddTargetCtx);

  return (
    <Animated.View
      style={{
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 11,
        paddingVertical: 10,
        paddingHorizontal: 10,
      }}
      layout={myLayoutTransition}
    >
      <View style={{ flexDirection: 'row', height: 30, alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16 }}>{dayDescriptionChina[data.day]}</Text>
        </View>
        <Pressable
          onPress={() => {
            setIsFolded(!isFolded);
          }}
        >
          <AntIcon name={isFolded ? 'rightcircleo' : 'downcircleo'} size={21} />
        </Pressable>
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: '#e7e7e7',
          marginVertical: 5,
        }}
      ></View>
      <View style={{ flexDirection: 'row' }}>
        <Progress
          isShowText={true}
          total={data.children.length}
          achieved={data.finished}
          style={{ height: 25, flex: 1 }}
        />
        <Pressable
          style={{ marginLeft: 10 }}
          onPress={() => {
            showAddTarget(undefined, true, (AddTargetStates) => {
              const {
                frequencyState: [, updateFrequency],
              } = AddTargetStates;
              updateFrequency((v) => {
                v.typeId = consts_frequency.COSTUM_WEEK;
                v.content = [data.day];
              });
            });
          }}
        >
          <AntIcon name="pluscircle" size={21} color={BrandColor} />
        </Pressable>
      </View>
      {isFolded ? null : (
        <Animated.View entering={myFadeIn}>
          {data.children.map((v) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 13,
                }}
                key={v.Id}
              >
                <View style={{ marginRight: 8 }}>
                  {v.isFinished ? (
                    <AntIcon name="checkcircle" size={21} color="#FFCC8E" />
                  ) : (
                    <FeaIcon name="circle" size={21} color="#DCDCDC" />
                  )}
                </View>
                <Text style={{ fontSize: 16 }}>{getDescription(v)}</Text>
              </View>
            );
          })}
        </Animated.View>
      )}
    </Animated.View>
  );
}
