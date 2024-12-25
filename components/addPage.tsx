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
import React, { useState } from "react";

import sports, { sportItemType } from "../data/sportType";
import BackIcon from "@/assets/images/addPage/back";

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
});

const MoodType = {
  happy: 0,
  sad: 1,
  wink: 2,
  angry: 3,
};

const MoodObj: { [key: number]: { icon: string; descirption: string } } = {
  0: { icon: "emoticon-happy", descirption: "开心" },
  1: { icon: "emoticon-sad", descirption: "伤心" },
  2: { icon: "emoticon-wink", descirption: "得意" },
  3: { icon: "emoticon-angry", descirption: "生气" },
};

export default function addPage() {
  const [chosenSportId, setChosenSportId] = useState(-1);
  const [exTime, setExTime] = useState("60");
  const [moodId, setMoodId] = useState(-1);
  const [effort, setEffort] = useState(0);

  /* function SportChooseContainer(item: sportItemType) {
    if (chosenSportId !== item.id) {
      return (
        <TouchableRipple
          onPress={() => setChosenSportId(item.id)}
          style={{ marginHorizontal: 5 }}
        >
          <View
            style={[
              styles.sport_container,
              {
                borderWidth: 1,
                borderLeftColor: item.color,
                borderRightColor: item.color,
                borderTopColor: item.color,
                borderBottomColor: item.color,
              },
            ]}
          >
            <Text style={{ color: item.color }}>{item.sportName}</Text>
          </View>
        </TouchableRipple>
      );
    } else {
      return (
        <TouchableRipple onPress={() => {}} style={{ marginHorizontal: 5 }}>
          <View
            style={[
              styles.sport_container,
              {
                backgroundColor: item.color,
              },
            ]}
          >
            <Text style={{ color: "black" }}>{item.sportName}</Text>
          </View>
        </TouchableRipple>
      );
    }
  } */

  function MoodContainer({ ImoodId }: { ImoodId: number }) {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Pressable onPress={() => setMoodId(ImoodId)}>
          <View
            style={{
              width: 50,
              height: 50,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon
              size={ImoodId === moodId ? 50 : 40}
              source={
                ImoodId === moodId
                  ? MoodObj[ImoodId].icon
                  : MoodObj[ImoodId].icon + "-outline"
              }
            ></Icon>
          </View>
        </Pressable>
        <Text style={{ textAlign: "center" }}>
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
                  // lineHeight: 30,
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
          <View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                borderBottomLeftRadius: 15,
                borderBottomRightRadius: 15,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: Dimensions.get("window").width / 4,
                  backgroundColor: "#ffd0a9",
                  height: 30,
                }}
              ></View>
              <View
                style={{
                  width: Dimensions.get("window").width / 4,
                  backgroundColor: "#ffa772",
                  height: 30,
                }}
              ></View>
              <View
                style={{
                  width: Dimensions.get("window").width / 4,
                  backgroundColor: "#f17527",
                  height: 30,
                }}
              ></View>
              <View
                style={{
                  width: Dimensions.get("window").width / 4,
                  backgroundColor: "#d25203",
                  height: 30,
                }}
              ></View>
            </View>
            <CreateCircleButton N={1} />
            <CreateCircleButton N={2} />
            <CreateCircleButton N={3} />
            <CreateCircleButton N={4} isEnd={true} />
          </View>
          <MainText isCenter={true}>点击进度条记录运动耗力</MainText>
          <HintText isCenter={true}>小狗我要开始奔跑啦</HintText>
          <MainText>关键词</MainText>
          <HintText>用几个简单的关键词概况一下本次运动吧</HintText>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <ColorfulTag
              Message="点击填写状态词"
              Color="#ff960b"
              isChosen={false}
            ></ColorfulTag>
          </View>
          <MainText>运动日记</MainText>
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
              multiline={true}
              style={{ minHeight: 100, textAlignVertical: "top" }}
            ></TextInput>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );

  function CreateCircleButton({
    N: n,
    isEnd = false,
  }: {
    N: number;
    isEnd?: boolean;
  }) {
    let size = effort === n ? 30 : 24;

    return (
      <View
        style={[
          {
            position: "absolute",
            top: (30 - size) / 2,
          },
          {
            left: isEnd
              ? undefined
              : (Dimensions.get("window").width / 4) * n - size / 2,
            right: isEnd ? 0 : undefined,
          },
        ]}
      >
        <Pressable onPress={() => setEffort(n)}>
          <Icon source="circle" size={size} color="white"></Icon>
        </Pressable>
      </View>
    );
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
