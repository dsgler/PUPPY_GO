import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  TextInput,
  GestureResponderEvent,
  Image,
  StyleProp,
  TextStyle,
} from "react-native";
import {
  Text,
  TouchableRipple,
  Icon,
  Portal,
  Dialog,
  Button,
  ThemeProvider,
  MD3LightTheme,
  IconButton,
} from "react-native-paper";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useRef } from "react";

import sports, { sportItemType } from "../data/sportType";
import BackIcon from "@/assets/images/addPage/back";
import Line from "@/assets/images/addPage/line";

import { insertData, addDataType, getmulti, getDB } from "./sql";
import { effortArr, MoodObj } from "@/consts";

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
  submit: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    overflow: "hidden",
  },
});

const MoodType = {
  happy: 0,
  sad: 1,
  wink: 2,
  angry: 3,
};

function getRunningDog() {
  return require("../assets/images/addPage/runningDog.png");
}

export default function AddPage() {
  const [chosenSportId, setChosenSportId] = useState(-1);
  const [exTime, setExTime] = useState("60");
  const [moodId, setMoodId] = useState(-1);
  const [effort, setEffort] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [dialogV, setDialogV] = useState(false);
  const [dialogC, setDialogC] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  console.log("add渲染");

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
    <View style={{ flex: 1 }}>
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
              style={{
                flex: 1,
                flexDirection: "row-reverse",
                paddingRight: 5,
              }}
            >
              <TouchableRipple
                onPress={() => {
                  handleSubmit(
                    {
                      ...getmulti(Number(exTime)),
                      sportId: chosenSportId,
                      moodId,
                      effort,
                      Tags: [],
                      title: title.trim(),
                      content: content.trim(),
                      reply: "这是一个reply",
                    },
                    setDialogV,
                    setDialogC
                  );
                }}
                style={styles.submit}
                borderless={true}
              >
                <View
                  style={{
                    width: 80,
                    height: 35,
                    backgroundColor: "#ffa356",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "white",
                      padding: 0,
                      lineHeight: 35,
                    }}
                  >
                    完成
                  </Text>
                </View>
              </TouchableRipple>
            </View>
            <View style={{ display: isEditing ? "none" : "flex" }}>
              <MainText>请选择运动的类型</MainText>
              <FlatList
                style={{ paddingVertical: 10 }}
                horizontal={true}
                data={sports}
                renderItem={({ item, index }) => (
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
                  // justifyContent: "space-between",
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
                    flexDirection: "row",
                    borderRadius: 7.5,
                    overflow: "hidden",
                    height: 15,
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
                <CreateCircleButton
                  N={2}
                  Position={(contentWidth / 4) * 2 - 7.5}
                />
                <CreateCircleButton
                  N={3}
                  Position={(contentWidth / 4) * 3 - 7.5}
                />
                <CreateCircleButton
                  N={4}
                  Position={(contentWidth / 4) * 4 - 15}
                />
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
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <MainText style={{ marginVertical: 10 }}>运动日记</MainText>
              <View style={{ display: isEditing ? "flex" : "none" }}>
                <IconButton
                  icon={"chevron-down"}
                  size={20}
                  onPress={() => setIsEditing(false)}
                />
              </View>
            </View>
            <View
              style={{
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                borderBottomLeftRadius: 15,
                borderBottomRightRadius: 15,
                backgroundColor: "#f5f5f5",
                marginHorizontal: 10,
                paddingHorizontal: 10,
                paddingVertical: 5,
                marginBottom: 20,
              }}
            >
              <TextInput
                placeholder="标题"
                value={title}
                onChangeText={(t) => setTitle(t)}
                style={{
                  fontSize: 22,
                  paddingVertical: 5,
                  fontWeight: 600,
                  display: isEditing ? "none" : "flex",
                }}
              />
              <View
                style={{
                  alignSelf: "center",
                  display: isEditing ? "none" : "flex",
                }}
              >
                <Line length={contentWidth - 50} />
              </View>
              <TextInput
                multiline={true}
                placeholder="用一段话描述一下今天的辛苦付出吧！"
                style={{
                  minHeight: isEditing ? 400 : 100,
                  // flex: 1,
                  textAlignVertical: "top",
                  fontSize: 15,
                  marginTop: 10,
                }}
                value={content}
                onChangeText={(t) => setContent(t)}
                onFocus={() => setIsEditing(true)}
              ></TextInput>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
      <Portal>
        <Dialog visible={dialogV} onDismiss={() => setDialogV(false)}>
          <Dialog.Content>
            <Text>{dialogC}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogV(false)}>ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
          style={[styles.dogImg, { top: -28, left: p - 22 }]}
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
        style={{ marginHorizontal: 8, borderRadius: 5, overflow: "hidden" }}
        borderless={true}
      >
        <View
          style={[
            {
              paddingVertical: 0,
              paddingHorizontal: 5,
              borderRadius: 5,
              borderWidth: 1,
              borderStyle: "dashed",
              borderColor: Color,
              height: 30,
              justifyContent: "center",
            },
          ]}
        >
          <Text
            style={{
              color: Color,
              fontSize: 14,
              textAlignVertical: "center",
            }}
          >
            {Message}
          </Text>
        </View>
      </TouchableRipple>
    );
  } else {
    return (
      <TouchableRipple
        onPress={() => {}}
        style={{ marginHorizontal: 8, borderRadius: 5, overflow: "hidden" }}
        borderless={true}
      >
        <View
          style={{
            paddingVertical: 0,
            paddingHorizontal: 5,
            backgroundColor: Color,
            borderRadius: 5,
            height: 30,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "black",
              textAlignVertical: "center",
            }}
          >
            {Message}
          </Text>
        </View>
      </TouchableRipple>
    );
  }
}

function EffortHint({ Effort }: { Effort: number }) {
  return (
    <>
      <MainText isCenter={true}>{effortArr[Effort].s1}</MainText>
      <HintText isCenter={true}>{effortArr[Effort].s2}</HintText>
    </>
  );
}

async function handleSubmit(
  data: addDataType,
  setDialogV: React.Dispatch<React.SetStateAction<boolean>>,
  setDialogC: React.Dispatch<React.SetStateAction<string>>
) {
  if (data.sportId === -1) {
    setDialogC("请选择运动类型");
    setDialogV(true);
    return;
  }
  if (data.moodId === -1) {
    setDialogC("请选择心情");
    setDialogV(true);
    return;
  }
  if (data.effort === 0) {
    setDialogC("请选择耗力");
    setDialogV(true);
    return;
  }
  if (data.title === "") {
    setDialogC("请输入标题");
    setDialogV(true);
    return;
  }
  if (data.content === "") {
    setDialogC("请输入标题");
    setDialogV(true);
    return;
  }

  let db = await getDB();
  await insertData(db, data);
  console.log("插入成功");
  router.back();
}
