import {
  Text,
  View,
  Dimensions,
  Image,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import CalIcon from "@/assets/images/index/calendar";
import { Pressable } from "react-native";
import { BrandColor, unChoseColor } from "@/consts/tabs";
import AiPlan from "./AiPlan";

import { addDataType, GetDataByDate, getDB } from "./sql";

export default function Index() {
  // let set: React.Dispatch<React.SetStateAction<React.JSX.Element | undefined>>
  function DataView() {
    const [dataFace, setDataFace] = useState<React.JSX.Element>();
    // set=setDataFace
    if (dataFace === undefined) {
      console.log("渲染");
      showData(setDataFace);
    }
    return dataFace;
  }

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
        {DataView()}
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <Header />
          <WeekCalendar />
          <AiPlan />
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
      <Pressable onPress={() => router.push("/addPage")}>
        <View
          style={{
            width: 80,
            height: 32,
            borderRadius: 15,
            backgroundColor: "#FF960B",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          <Text style={{ fontSize: 16, textAlign: "center", color: "white" }}>
            去记录
          </Text>
        </View>
      </Pressable>
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
  let d = new Date();
  const ret = await GetDataByDate(
    db,
    `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
  );
  console.log("获得ret");
  if (ret.length === 0) {
    setDataFace(<EmptyDog />);
  } else {
    console.log(ret);
  }
}
