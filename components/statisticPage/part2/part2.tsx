import { StyleSheet, View } from "react-native";
import MyScrollView from "../../myScrollView";
import React, { useContext, useState } from "react";

import { addDataType } from "@/sqls/indexSql";
import { MyAlertCtx } from "@/app/_layout";
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
  const myAlert = useContext(MyAlertCtx);
  switch (pageType) {
    case pageType_consts.MOOD:
      return <MoodView datas={datas} />;
    case pageType_consts.DURATION:
      return <DurationView datas={datas} thisMonth={thisMonth} width={width} />;
    case pageType_consts.EFFORT:
      return <EffortView datas={datas} width={width} />;
    case pageType_consts.TAG:
      return <TagView />;
    default:
      myAlert("pageType不存在");
      return null;
  }
}
