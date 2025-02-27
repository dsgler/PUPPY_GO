import { StyleSheet, View } from "react-native";
import MyScrollView from "../../public/myScrollView";
import React, { useRef, useState } from "react";

import { addDataType } from "@/sqls/indexSql";
import * as pageType_consts from "../pageType";
import MoodView from "./Mood";
import DurationView from "./duration";
import EffortView from "./effort";
import TagView from "./tag";

export default function F({
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
  console.log("part2渲染");

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
            backgroundColor: "white",
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
  hasShown.current.add(pageType);

  return (
    <>
      <View
        style={{ display: pageType === pageType_consts.MOOD ? "flex" : "none" }}
      >
        <MoodView datas={datas} />
      </View>
      {hasShown.current.has(pageType_consts.DURATION) && (
        <View
          style={{
            display: pageType === pageType_consts.DURATION ? "flex" : "none",
          }}
        >
          <DurationView datas={datas} thisMonth={thisMonth} width={width} />
        </View>
      )}
      {hasShown.current.has(pageType_consts.EFFORT) && (
        <View
          style={{
            display: pageType === pageType_consts.EFFORT ? "flex" : "none",
          }}
        >
          <EffortView datas={datas} width={width} />
        </View>
      )}
      {hasShown.current.has(pageType_consts.TAG) && (
        <View
          style={{
            display: pageType === pageType_consts.TAG ? "flex" : "none",
          }}
        >
          <TagView />
        </View>
      )}
    </>
  );
}
