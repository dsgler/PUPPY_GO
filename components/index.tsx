import {
  Text,
  View,
  Image,
  StyleProp,
  ViewStyle,
  Pressable,
  FlatList,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import React, { useState, useCallback, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CalIcon from "@/assets/images/index/calendar";
import { BrandColor, unChoseColor } from "@/consts/tabs";
import AiPlan from "./AiPlan";

import { addDataType, GetDataByDate, getDB } from "../sqls/indexSql";
import {
  getDateNumber,
  getTimeString,
  getGapTimeString,
} from "@/utility/datetool";
import { Icon, TouchableRipple } from "react-native-paper";
import Svg, { Line } from "react-native-svg";

import sportArr from "@/consts/sportType";
import { effortArr, MoodObj } from "@/consts";
import MyScrollView from "./myScrollView";
import { getDatesInWeek } from "@/utility/datetool";
import { dayDescription } from "../consts/dayDescription";

export default function Index() {
  console.log("index渲染");
  // 用于存储设置

  const [showT, setShowT] = useState(Date.now());
  const [dataComponent, setDataComponent] = useState<React.JSX.Element>();

  // 每次获得 focus 的时候都会刷新
  useFocusEffect(
    useCallback(() => {
      console.log("focus渲染");
      showData(setDataComponent, showT);
    }, [showT])
  );

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 15 }}>
            <Header />
            <WeekCalendar showT={showT} setShowT={setShowT} />
            <AiPlan />
          </View>
          {dataComponent}
        </View>
      </SafeAreaView>
    </View>
  );
}
function EmptyDog() {
  return (
    <View
      style={{
        position: "absolute",
        flex: 1,
        top: 100,
        left: 0,
        bottom: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={require("@/assets/images/index/nothing.png")}
        resizeMode="center"
        style={{ width: 240, height: 187 }}
      ></Image>
      <Text style={{ textAlign: "center", color: "#828287" }}>
        还没有记录哦……
      </Text>
      <Text style={{ textAlign: "center", color: "#828287" }}>
        小狗会一直等着你的
      </Text>
      <TouchableRipple
        borderless={true}
        onPress={useCallback(() => router.push("/addPage"), [])}
        style={{ borderRadius: 15, marginTop: 10, overflow: "hidden" }}
      >
        <View
          style={{
            width: 80,
            height: 32,
            backgroundColor: "#FF960B",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 16, textAlign: "center", color: "white" }}>
            去记录
          </Text>
        </View>
      </TouchableRipple>
    </View>
  );
}

function Header({ style }: { style?: StyleProp<ViewStyle> }) {
  let d = new Date();
  return (
    <View
      style={[
        {
          height: 50,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        style,
      ]}
    >
      <Text style={{ fontWeight: 700, fontSize: 20 }}>
        {d.getFullYear()}年{d.getMonth() + 1}月
      </Text>
      <CalIcon />
    </View>
  );
}

// 让周日在最后
// const dayArr = [1, 2, 3, 4, 5, 6, 0];
function WeekCalendar({
  showT,
  setShowT,
}: {
  showT: number;
  setShowT: React.Dispatch<React.SetStateAction<number>>;
}) {
  let d = new Date();

  let dateArr = getDatesInWeek(d);

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      {dateArr.map((date, index) => (
        <WeekCalendarCap
          key={index}
          d={date}
          isAfter={
            getDateNumber(date) !== getDateNumber(d) &&
            date.getTime() > d.getTime()
          }
          isChosen={getDateNumber(date) === getDateNumber(showT)}
          setShowT={setShowT}
        />
      ))}
    </View>
  );
}

function WeekCalendarCap({
  d,
  isChosen = false,
  isAfter,
  setShowT,
}: {
  d: Date;
  isChosen?: boolean;
  isAfter: boolean;
  setShowT: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <Pressable
      onPress={() => {
        setShowT(d.getTime());
      }}
      style={{ borderRadius: 17 }}
      disabled={isAfter}
    >
      <View
        style={{
          height: 60,
          width: 34,
          backgroundColor: isChosen ? "#FFF7EE" : undefined,
          borderRadius: 17,
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 5,
          paddingBottom: 3,
        }}
      >
        <Text
          style={{
            color: isChosen ? BrandColor : unChoseColor,
            fontSize: 12,
            textAlign: "center",
          }}
        >
          {dayDescription[d.getDay()]}
        </Text>
        <View
          style={{
            height: 30,
            aspectRatio: 1,
            backgroundColor: isChosen
              ? "#FFCC8E"
              : isAfter
              ? "#F2F2F6"
              : "#FFF7EE",
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: isAfter ? unChoseColor : "#FF960B" }}>
            {d.getDate()}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

async function showData(
  setDataFace: React.Dispatch<
    React.SetStateAction<React.JSX.Element | undefined>
  >,
  t: number
) {
  const db = await getDB();
  console.log("获得DB");
  const ret = await GetDataByDate(db, getDateNumber(t));
  console.log("获得ret");
  if (ret.length === 0) {
    setDataFace(<EmptyDog />);
  } else {
    console.log(ret);
    setDataFace(<SportList sportArr={ret} />);
  }
}

function SportList({ sportArr }: { sportArr: addDataType[] }) {
  const [height, setHeight] = useState(500);
  const marginTop = 260;
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }}
      onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
    >
      <MyScrollView marginTop={marginTop} style={{ flex: 1 }} bounce={20}>
        <View
          style={{
            paddingTop: 10,
            minHeight: height - marginTop,
            backgroundColor: "white",
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }}
        >
          {sportArr.map((v, k) => (
            <SportBlock data={v} key={k} />
          ))}
        </View>
      </MyScrollView>
    </View>
  );
}

function SportBlock({ data }: { data: addDataType }) {
  const [contentHeight, setContentHeight] = useState(50);
  // console.log("height" + contentHeight);
  return (
    <View
      style={{
        marginTop: 10,
        paddingVertical: 10,
        backgroundColor: "white",
        borderRadius: 20,
        paddingRight: 15,
        flexDirection: "row",
        alignItems: "flex-start",
      }}
    >
      <SportBlockLeft height={contentHeight} data={data} />
      <SportBlockRight setHeight={setContentHeight} data={data} />
    </View>
  );
}

function SportBlockLeft({
  height,
  data,
}: {
  height: number;
  data: addDataType;
}) {
  // console.log(height);
  return (
    <View
      style={{
        width: 40,
        alignItems: "center",
        marginRight: 10,
        marginLeft: 10,
      }}
    >
      <Text style={{ color: "#FF9B0B", fontSize: 15 }}>
        {getTimeString(data.timestart)}
      </Text>
      <Svg width={1} height={height}>
        <Line
          x1={0}
          y1={5}
          x2={0}
          y2={height - 5}
          stroke="#FF9B0B"
          stroke-width="1"
          strokeDasharray={"5,5"}
        />
      </Svg>
      <Text style={{ color: "#FF9B0B", fontSize: 15 }}>
        {getTimeString(data.timeend)}
      </Text>
    </View>
  );
}

function SportBlockRight({
  setHeight,
  data,
}: {
  setHeight: React.Dispatch<React.SetStateAction<number>>;
  data: addDataType;
}) {
  const [contentWidth, setContentWidth] = useState<number>(0);
  const tags: string[] = useMemo(() => JSON.parse(data.Tags), [data]);

  return (
    <View
      onLayout={(e) => {
        setContentWidth(e.nativeEvent.layout.width);
        setHeight(e.nativeEvent.layout.height);
      }}
      style={{ flex: 1, alignItems: "flex-start", marginVertical: 20 }}
    >
      <View style={{ height: 65, flexDirection: "row" }}>
        <View
          style={{
            height: 65,
            width: 115,
            borderRadius: 10,
            backgroundColor: "#FFCC8E",
            marginRight: 5,
            padding: 5,
          }}
        >
          <Text style={{ color: "#131315", fontSize: 16 }}>
            {sportArr[data.sportId].emoji + sportArr[data.sportId].sportName}
          </Text>
          <View
            style={{
              flexDirection: "row",
              height: 30,
              alignItems: "baseline",
              marginTop: 5,
            }}
          >
            <Icon source={MoodObj[data.moodId].icon} size={20} />
            <Text style={{ fontSize: 22, fontWeight: 500, color: "#131315" }}>
              {" " + getGapTimeString(data.timeend - data.timestart) + " "}
            </Text>
            <Text style={{ fontSize: 15, color: "#131315" }}>时长</Text>
          </View>
        </View>
        <View style={{ height: 65, flex: 1 }}>
          <View style={{ height: 35, flexDirection: "column-reverse" }}>
            <View
              style={{
                height: 10,
                borderRadius: 5,
                overflow: "hidden",
                width: ((contentWidth - 125) / 4) * data.effort,
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  height: 10,
                  width: (contentWidth - 125) / 4,
                  backgroundColor: "#FFD0A9",
                  display: data.effort >= 0 ? "flex" : "none",
                }}
              ></View>
              <View
                style={{
                  height: 10,
                  width: (contentWidth - 125) / 4,
                  backgroundColor: "#FFA772",
                  display: data.effort >= 1 ? "flex" : "none",
                }}
              ></View>
              <View
                style={{
                  height: 10,
                  width: (contentWidth - 125) / 4,
                  backgroundColor: "#F27527",
                  display: data.effort >= 2 ? "flex" : "none",
                }}
              ></View>
              <View
                style={{
                  height: 10,
                  width: (contentWidth - 125) / 4,
                  backgroundColor: "#D25203",
                  display: data.effort >= 3 ? "flex" : "none",
                }}
              ></View>
            </View>
            <View
              style={{
                position: "absolute",
                height: 20,
                top: 0,
                left: ((contentWidth - 125) / 4) * data.effort - 22,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 46,
                  height: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 6,
                  backgroundColor: "#FFB52B",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "#131315",
                    fontSize: 9,
                    textAlignVertical: "center",
                    lineHeight: 20,
                  }}
                >
                  {effortArr[data.effort].s1}
                </Text>
              </View>
              <View
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 2.5,
                  backgroundColor: "#FFB52B",
                  marginTop: 2,
                }}
              ></View>
            </View>
          </View>
          <View style={{ height: 30, flexDirection: "row", paddingTop: 7 }}>
            <FlatList
              data={tags}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <SolidTag text={item} key={index} style={{ marginRight: 5 }} />
              )}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "#FFF7EE",
          borderRadius: 5,
          boxShadow: "0 4 4 0 rgba(0,0,0,0.1)",
          marginTop: 10,
          paddingVertical: 15,
          paddingHorizontal: 12,
        }}
      >
        <Text
          style={{
            color: "#131315",
            fontWeight: 600,
            fontSize: 20,
            marginBottom: 5,
            paddingBottom: 2,
          }}
        >
          {data.title}
        </Text>
        <Text style={{ color: "#131315", fontSize: 15 }}>{data.content}</Text>
      </View>
      <View style={{ flexDirection: "row", marginTop: 15 }}>
        <View
          style={{
            backgroundColor: "#FFF8DA",
            borderRadius: 5,
            boxShadow: "0 4 4 0 rgba(0,0,0,0.1)",
            paddingVertical: 15,
            paddingHorizontal: 12,
            flex: 1,
            marginRight: 5,
          }}
        >
          <Text>{data.reply}</Text>
        </View>
        <Image
          source={require("@/assets/images/index/doghead.png")}
          style={{ height: 40, width: 40 }}
        />
      </View>
    </View>
  );
}

function SolidTag({
  text,
  style,
}: {
  text: String;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          height: 23,
          borderWidth: 1,
          borderColor: "#FFCC8E",
          borderRadius: 5,
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: "#131315",
          textAlign: "center",
          textAlignVertical: "center",
        }}
      >
        {text}
      </Text>
    </View>
  );
}
