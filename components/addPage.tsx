import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  TextInput,
  Dimensions,
  GestureResponderEvent,
  Image,
  StyleProp,
  TextStyle,
  ImageSourcePropType,
} from "react-native";
import {
  Text,
  IconButton,
  MD3Colors,
  Button,
  TouchableRipple,
  Icon,
} from "react-native-paper";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { createRef, useState } from "react";

import sports, { sportItemType } from "../data/sportType";
import BackIcon from "@/assets/images/addPage/back";
import Svg from "react-native-svg";
import Line from "@/assets/images/addPage/line";

const styles = StyleSheet.create({
  bg_container: {
    flex: 1,
    padding: 0,
    backgroundColor: "#fecf94",
  },
  main_container: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  sport_container: {
    padding: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  sport_container_un: {
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  dogImg: { width: 64, height: 37, top: -10 },
});

const MoodType = {
  happy: 0,
  sad: 1,
  wink: 2,
  angry: 3,
};

const MoodObj: {
  [key: number]: {
    unPic: () => ImageSourcePropType;
    pic: () => ImageSourcePropType;
    descirption: string;
  };
} = {
  0: {
    unPic: () => require("../assets/images/addPage/happy_un.png"),
    pic: () => require("../assets/images/addPage/happy.png"),
    descirption: "开心",
  },
  1: {
    unPic: () => require("../assets/images/addPage/sad_un.png"),
    pic: () => require("../assets/images/addPage/sad.png"),
    descirption: "伤心",
  },
  2: {
    unPic: () => require("../assets/images/addPage/wink_un.png"),
    pic: () => require("../assets/images/addPage/wink.png"),
    descirption: "得意",
  },
  3: {
    unPic: () => require("../assets/images/addPage/angry_un.png"),
    pic: () => require("../assets/images/addPage/angry.png"),
    descirption: "生气",
  },
};

function getRunningDog() {
  return require("../assets/images/addPage/runningDog.png");
}

export default function addPage() {
  const [chosenSportId, setChosenSportId] = useState(-1);
  const [exTime, setExTime] = useState("60");
  const [moodId, setMoodId] = useState(-1);
  const [effort, setEffort] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  let title, intext: string;

  function MoodContainer({ ImoodId }: { ImoodId: number }) {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Pressable onPress={() => setMoodId(ImoodId)}>
          <View
            style={{
              height: 85,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {(() => {
              if (moodId === ImoodId) {
                return (
                  <Image
                    source={MoodObj[ImoodId].pic()}
                    style={{ height: 85, aspectRatio: 1 }}
                  />
                );
              } else {
                return (
                  <Image
                    source={MoodObj[ImoodId].unPic()}
                    style={{ height: 70, aspectRatio: 1 }}
                  />
                );
              }
            })()}
          </View>
        </Pressable>
        <Text style={{ textAlign: "center", fontSize: 15 }}>
          {MoodObj[ImoodId].descirption}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.bg_container, { flexDirection: "column" }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            height: 40,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              marginLeft: 10,
              overflow: "hidden",
            }}
          >
            <TouchableRipple onPress={() => router.back()} style={{}}>
              <BackIcon />
            </TouchableRipple>
          </View>
        </View>
        <ScrollView style={[styles.main_container]}>
          <View
            style={{ flex: 1, flexDirection: "row-reverse", paddingRight: 15 }}
          >
            <TouchableRipple
              onPress={() => {}}
              style={{
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                borderBottomLeftRadius: 15,
                borderBottomRightRadius: 15,
                overflow: "hidden",
              }}
              borderless={true}
            >
              <View
                style={{
                  width: 80,
                  height: 35,
                  backgroundColor: "#ffa356",

                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 16, color: "white" }}>完成</Text>
              </View>
            </TouchableRipple>
          </View>
          <MainText>请选择运动的类型</MainText>
          <FlatList
            style={{ paddingVertical: 10 }}
            horizontal={true}
            data={sports}
            renderItem={({ item }) => (
              <ColorfulTag
                Message={item.sportName}
                Color={item.color}
                isChosen={chosenSportId === item.id}
                onPressF={() => setChosenSportId(item.id)}
              />
            )}
            showsHorizontalScrollIndicator={false}
          />
          <MainText>请选择运动的时长</MainText>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <TextInput
                style={{
                  width: 90,
                  fontSize: 50,
                  color: "#ffa356",
                  padding: 0,
                  textAlign: "right",
                }}
                placeholder="0"
                value={exTime}
                onChangeText={setExTime}
                keyboardType="numeric"
              ></TextInput>
              <Text>分钟</Text>
            </Text>
          </View>
          <MainText>请选择运动心情</MainText>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginTop: 15,
              paddingBottom: 30,
            }}
          >
            <MoodContainer ImoodId={0}></MoodContainer>
            <MoodContainer ImoodId={1}></MoodContainer>
            <MoodContainer ImoodId={2}></MoodContainer>
            <MoodContainer ImoodId={3}></MoodContainer>
          </View>
          <MainText>耗力</MainText>
          <View
            onLayout={(e) => {
              setContentWidth(e.nativeEvent.layout.width);
            }}
            style={{ marginTop: 15, height: 20 }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                borderRadius: 7.5,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: contentWidth / 4,
                  backgroundColor: "#ffd0a9",
                  height: 15,
                }}
              ></View>
              <View
                style={{
                  width: contentWidth / 4,
                  backgroundColor: "#ffa772",
                  height: 15,
                }}
              ></View>
              <View
                style={{
                  width: contentWidth / 4,
                  backgroundColor: "#f17527",
                  height: 15,
                }}
              ></View>
              <View
                style={{
                  width: contentWidth / 4,
                  backgroundColor: "#d25203",
                  height: 15,
                }}
              ></View>
            </View>
            <CreateCircleButton N={1} Position={contentWidth / 4 - 7.5} />
            <CreateCircleButton N={2} Position={(contentWidth / 4) * 2 - 7.5} />
            <CreateCircleButton N={3} Position={(contentWidth / 4) * 3 - 7.5} />
            <CreateCircleButton N={4} Position={(contentWidth / 4) * 4 - 15} />
            <Image
              source={getRunningDog()}
              style={[
                styles.dogImg,
                {
                  position: "absolute",
                  left: -10,
                  display: effort === 0 ? "flex" : "none",
                },
              ]}
            />
          </View>
          <EffortHint Effort={effort} />
          <MainText>关键词</MainText>
          <HintText>用几个简单的关键词概况一下本次运动吧</HintText>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <ColorfulTag
              Message="点击填写状态词"
              Color="#ff960b"
              isChosen={false}
            ></ColorfulTag>
          </View>
          <MainText style={{ marginVertical: 10 }}>运动日记</MainText>
          <View
            style={{
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
              backgroundColor: "#f5f5f5",
              marginHorizontal: 15,
              paddingHorizontal: 10,
            }}
          >
            <TextInput
              placeholder="标题"
              onEndEditing={(e) => {
                title = e.nativeEvent.text;
              }}
            />
            <View style={{ alignSelf: "center" }}>
              <Line length={contentWidth - 60} />
            </View>
            <TextInput
              multiline={true}
              placeholder="用一段话描述一下今天的辛苦付出吧！"
              style={{ minHeight: 100, textAlignVertical: "top" }}
              onEndEditing={(e) => {
                intext = e.nativeEvent.text;
              }}
            ></TextInput>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );

  function CreateCircleButton({
    N: n,
    Position: p,
  }: {
    N: number;
    Position: number;
  }) {
    if (effort === n) {
      return (
        <Image
          source={getRunningDog()}
          style={[styles.dogImg, { top: -25, left: p - 20 }]}
        />
      );
    } else {
      return (
        <View
          style={[
            {
              position: "absolute",
              top: 0,
            },
            {
              left: p,
            },
          ]}
        >
          <Pressable onPress={() => setEffort(n)}>
            <Icon source="circle" size={15} color="white"></Icon>
          </Pressable>
        </View>
      );
    }
  }
}

function MainText({
  children,
  isCenter = false,
  style,
}: {
  children: React.ReactNode;
  isCenter?: boolean;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <Text
      style={[
        {
          fontWeight: 700,
          fontSize: 20,
          textAlign: isCenter ? "center" : undefined,
          marginTop: 10,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

function HintText({
  children,
  isCenter = false,
}: {
  children: React.ReactNode;
  isCenter?: boolean;
}) {
  return (
    <Text
      style={{
        fontSize: 15,
        color: "grey",
        textAlign: isCenter ? "center" : undefined,
        marginVertical: 5,
      }}
    >
      {children}
    </Text>
  );
}

function ColorfulTag({
  Message,
  Color,
  isChosen,
  onPressF,
}: {
  Message: string;
  Color: string;
  isChosen: boolean;
  onPressF?: (event: GestureResponderEvent) => void;
}) {
  if (!isChosen) {
    return (
      <TouchableRipple
        onPress={onPressF}
        style={{ marginHorizontal: 8 }}
        borderless={true}
      >
        <View
          style={[
            styles.sport_container_un,
            {
              borderColor: Color,
            },
          ]}
        >
          <Text style={{ color: Color }}>{Message}</Text>
        </View>
      </TouchableRipple>
    );
  } else {
    return (
      <TouchableRipple onPress={() => {}} style={{ marginHorizontal: 8 }}>
        <View
          style={[
            styles.sport_container,
            {
              backgroundColor: Color,
            },
          ]}
        >
          <Text style={{ color: "black" }}>{Message}</Text>
        </View>
      </TouchableRipple>
    );
  }
}

function EffortHint({ Effort: Effort }: { Effort: number }) {
  let s1, s2: string;
  switch (Effort) {
    case 1:
      s1 = "毫不费力";
      s2 = "小小运动，轻松拿下";
      break;
    case 2:
      s1 = "比较轻松";
      s2 = "努努力，这点运动量简直轻轻松松";
      break;
    case 3:
      s1 = "有点费力";
      s2 = "呼哧带喘，只能用大拇指竖起来表示赞赏";
      break;
    case 4:
      s1 = "太费力啦";
      s2 = "今天的运动量太超标啦";
      break;
    default:
      s1 = "点击进度条记录运动耗力";
      s2 = "小狗我要开始奔跑啦";
      break;
  }
  return (
    <>
      <MainText isCenter={true}>{s1}</MainText>
      <HintText isCenter={true}>{s2}</HintText>
    </>
  );
}
