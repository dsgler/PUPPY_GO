import {
  Text,
  View,
  Dimensions,
  Image,
  StyleProp,
  ViewStyle,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import CalIcon from "@/assets/images/index/calendar";
import { BrandColor, unChoseColor } from "@/consts/tabs";
import AiPlan from "./AiPlan";

import { addDataType, GetDataByDate, getDB, getDate } from "./sql";
import { Icon, TouchableRipple } from "react-native-paper";
import Svg, { Line, Path } from "react-native-svg";

export default function Index() {
  console.log("index渲染");
  // 用于存储设置
  let set = useRef<
    React.Dispatch<React.SetStateAction<React.JSX.Element | undefined>>
  >(() => {});

  // 每次获得 focus 的时候都会刷新
  useFocusEffect(() => {
    console.log("focus渲染");
    if (set.current) {
      showData(set.current);
    }
  });

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#FFCC8E", "#FFF0DE"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: Dimensions.get("screen").height,
        }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 15 }}>
          <Header />
          <WeekCalendar />
          <AiPlan />
        </View>
        <DataView set={set} />
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
        height: Dimensions.get("screen").height,
        width: Dimensions.get("screen").width,
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
        onPress={() => router.push("/addPage")}
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
        {d.getFullYear()}年{d.getMonth()}月
      </Text>
      <CalIcon />
    </View>
  );
}

function AddDays(date: Date, days: number) {
  var result = new Date(date); // 创建日期的副本以避免修改原始日期
  var oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
  result.setTime(result.getTime() + days * oneDay); // 减去指定天数的毫秒数
  return result;
}

const dayArr = [1, 2, 3, 4, 5, 6, 0];
function WeekCalendar() {
  let d = new Date();
  let dateArr: number[] = Array.from({ length: 7 });
  let t = d.getDay();
  let off = t === 0 ? -6 : -t + 1;
  for (let i = 0; i < 7; i++) {
    dateArr[i] = AddDays(d, off + i).getDate();
  }
  let isAfter = false;

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      {dateArr.map((date, index) => (
        <WeekCalendarCap
          key={index}
          date={date}
          day={dayArr[index]}
          isAfter={isAfter}
          isChosen={(() => {
            if (d.getDate() === date) {
              isAfter = true;
              return true;
            } else {
              return false;
            }
          })()}
        />
      ))}
    </View>
  );
}

function WeekCalendarCap({
  date,
  day,
  isChosen = false,
  isAfter,
}: {
  date: number;
  day: number;
  isChosen?: boolean;
  isAfter: boolean;
}) {
  let str: string;
  switch (day) {
    case 0:
      str = "周日";
      break;
    case 1:
      str = "周一";
      break;
    case 2:
      str = "周二";
      break;
    case 3:
      str = "周三";
      break;
    case 4:
      str = "周四";
      break;
    case 5:
      str = "周五";
      break;
    case 6:
      str = "周六";
      break;
    default:
      str = "未知";
      break;
  }

  return (
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
        {str}
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
          {date}
        </Text>
      </View>
    </View>
  );
}

async function showData(
  setDataFace: React.Dispatch<
    React.SetStateAction<React.JSX.Element | undefined>
  >
) {
  const db = await getDB();
  console.log("获得DB");
  const ret = await GetDataByDate(db, getDate());
  console.log("获得ret");
  if (ret.length === 0) {
    setDataFace(<EmptyDog />);
  } else {
    console.log(ret);
    setDataFace(<SportBlock />);
  }
}

function DataView({
  set,
}: {
  set: React.MutableRefObject<
    React.Dispatch<React.SetStateAction<React.JSX.Element | undefined>>
  >;
}) {
  const [dataFace, setDataFace] = useState<React.JSX.Element>();
  set.current = setDataFace;
  return dataFace;
}

function SportBlock() {
  const [contentHeight, setContentHeight] = useState(50);
  return (
    <View
      style={{
        marginTop: 20,
        paddingVertical: 20,
        backgroundColor: "white",
        borderRadius: 20,
        paddingRight: 15,
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
      }}
    >
      <SportBlockLeft height={contentHeight} />
      <SportBlockRight setHeight={setContentHeight} />
    </View>
  );
}

function SportBlockLeft({ height }: { height: number }) {
  console.log(height);
  return (
    <View
      style={{
        width: 40,
        alignItems: "center",
        marginRight: 10,
        marginLeft: 10,
      }}
    >
      <Text style={{ color: "#FF9B0B", fontSize: 15 }}>10:40</Text>
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
      <Text style={{ color: "#FF9B0B", fontSize: 15 }}>11:40</Text>
    </View>
  );
}

function SportBlockRight({
  setHeight,
}: {
  setHeight: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [contentWidth, setContentWidth] = useState<number>(0);
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
          <Text style={{ color: "#131315", fontSize: 16 }}>🎾网球</Text>
          <View
            style={{
              flexDirection: "row",
              height: 30,
              alignItems: "baseline",
              marginTop: 5,
            }}
          >
            <Icon source={"emoticon-happy-outline"} size={20} />
            <Text style={{ fontSize: 22, fontWeight: 500, color: "#131315" }}>
              {" 2:04 "}
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
                width: (contentWidth - 115) / 4,
              }}
            >
              <View
                style={{
                  height: 10,
                  width: (contentWidth - 115) / 4,
                  backgroundColor: "#FFD0A9",
                }}
              ></View>
            </View>
            <View
              style={{
                position: "absolute",
                height: 20,
                top: 0,
                left: (contentWidth - 115) / 4 - 20,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 50,
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
                    fontSize: 10,
                    textAlignVertical: "center",
                    lineHeight: 20,
                  }}
                >
                  毫不费力
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
            <SolidTag text={"＃尝试＃"} />
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
          }}
        >
          练习的第一天
        </Text>
        <Text style={{ color: "#131315", fontSize: 15 }}>
          今天去打羽毛球，状态不错。和球友们尽情挥拍，享受运动的快乐。虽有失误，但也有精彩的扣杀。每次击球都能感受到自己的进步，也体会到坚持练习的重要性。期待下次能有更好的表现，继续在球场上挥洒汗水……
        </Text>
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
          <Text>
            汪汪汪！你去打网球啦，好棒哦！你在球场上跑来跑去击球的样子肯定超帅的。不过，我觉得你下次打球的时候，可以多跳一跳去接球，就像我跳起来扑小玩偶一样，说不定能接到更多球呢。还有哦，打完球要记得多喝水，就像我喝完水才能更有精力玩耍！
          </Text>
        </View>
        <Image
          source={require("@/assets/images/index/doghead.png")}
          style={{ height: 40, width: 40 }}
        />
      </View>
    </View>
  );
}

function SolidTag({ text }: { text: String }) {
  return (
    <View
      style={{
        height: 23,
        borderWidth: 1,
        borderColor: "#FFCC8E",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
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
