import { StyleSheet, View } from 'react-native';
import MyScrollView from '../../public/myScrollView';
import React, { useEffect, useRef, useState } from 'react';

import { addDataType } from '@/sqls/indexSql';
import * as pageType_consts from '../pageType';
import MoodView from './Mood';
import DurationView from './duration';
import EffortView from './effort';
import TagView from './tag';
import { EmptyDog } from '@/components/index/EmptyDog';
import { getDateNumber } from '@/utility/datetool';

function Page({
  upperHeight,
  datas,
  pageType,
  thisMonth,
}: {
  upperHeight: number;
  datas: addDataType[];
  pageType: number;
  thisMonth: Date[];
}) {
  const [fullHeight, setFullHeight] = useState(10);
  const [width, setWidth] = useState(0);
  console.log('part2渲染');

  return (
    <View
      style={[StyleSheet.absoluteFill]}
      onLayout={(e) => {
        setFullHeight(e.nativeEvent.layout.height);
      }}
    >
      <MyScrollView
        marginTop={upperHeight}
        style={{ flex: 1 }}
        bounce={20}
        viewHeight={fullHeight}
      >
        <View
          style={{
            paddingTop: 10,
            minHeight: fullHeight - upperHeight,
            backgroundColor: 'white',
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }}
        >
          <View
            onLayout={(e) => {
              setWidth(e.nativeEvent.layout.width);
            }}
          >
            <Switcher
              pageType={pageType}
              datas={datas}
              thisMonth={thisMonth}
              width={width}
            />
          </View>
        </View>
      </MyScrollView>
    </View>
  );
}
export default React.memo(Page);

// 太天才了
function Switcher({
  datas,
  pageType,
  thisMonth,
  width,
}: {
  datas: addDataType[];
  pageType: number;
  thisMonth: Date[];
  width: number;
}) {
  const hasShown = useRef(new Set());
  useEffect(() => {
    hasShown.current.clear();
  }, [datas]);
  hasShown.current.add(pageType);

  if (datas.length === 0) {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}
      >
        <EmptyDog date={getDateNumber(Date.now())} />
      </View>
    );
  }

  return (
    <>
      {hasShown.current.has(pageType_consts.MOOD) && (
        <View
          style={{
            display: pageType === pageType_consts.MOOD ? 'flex' : 'none',
          }}
        >
          <MoodView datas={datas} />
        </View>
      )}
      {hasShown.current.has(pageType_consts.DURATION) && (
        <View
          style={{
            display: pageType === pageType_consts.DURATION ? 'flex' : 'none',
          }}
        >
          <DurationView datas={datas} thisMonth={thisMonth} width={width} />
        </View>
      )}
      {hasShown.current.has(pageType_consts.EFFORT) && (
        <View
          style={{
            display: pageType === pageType_consts.EFFORT ? 'flex' : 'none',
          }}
        >
          <EffortView datas={datas} width={width} />
        </View>
      )}
      {hasShown.current.has(pageType_consts.TAG) && (
        <View
          style={{
            display: pageType === pageType_consts.TAG ? 'flex' : 'none',
          }}
        >
          <TagView />
        </View>
      )}
    </>
  );
}
