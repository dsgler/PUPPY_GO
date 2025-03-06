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
  ViewStyle,
} from "react-native";
import {
  Text,
  TouchableRipple,
  Icon,
  Portal,
  IconButton,
  Snackbar,
} from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useContext } from "react";

import sportArr from "@/consts/sportType";
import BackIcon from "@/assets/images/addPage/back";
import Line from "@/assets/images/addPage/line";

import { insertData, addDataType, getDB } from "@/sqls/indexSql";
import { getmulti } from "@/utility/datetool";
import { effortArr, MoodArr, thinkingStr } from "@/consts";
import { useImmer } from "use-immer";

import { MyAlertCtx } from "@/app/_layout";

const EmptyF = () => {};

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

export const requireRunningDog = require("@/assets/images/addPage/runningDog.png");

const MAIN = 0;
const CONTENT = 1;
const TAG = 2;

export default function AddPage() {
  const { date: dateStr } = useLocalSearchParams<{
    date: string;
  }>();

  let date = Number(dateStr);
  if (isNaN(date) || date < 1577808000000 || date > 33134716800000) {
    date = Date.now();
  }

  const [sportId, setSportId] = useState(-1);
  const [exTime, setExTime] = useState("60");
  const [moodId, setMoodId] = useState(-1);
  const [effort, setEffort] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [tags, updateTags] = useImmer<string[]>([]);
  const [tagContent, setTagContent] = useState("");
  const onTagContentChange = (text: string) => {
    if (text === "") {
      setTagContent("");
      return;
    }
    const endChar = text[text.length - 1];
    if (endChar === " " || endChar === "\n") {
      updateTags((tags) => {
        tags.push(text.trim());
      });
      setTagContent("");
      return;
    }

    setTagContent(text);
  };
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [SnackbarV, setSnackbarV] = useState(false);

  const [pageState, setPageState] = useState(MAIN);

  console.log("add渲染,dateStr:", dateStr, "date:", date);

  const myAlert = useContext(MyAlertCtx);

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
              <TouchableRipple
                onPress={() => {
                  router.back();
                }}
                style={{}}
              >
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
                  console.log(tags, JSON.stringify(tags));
                  if (isNaN(Number(exTime)) || Number(exTime) < 0) {
                    myAlert("请输入合理的运动时间");
                    return;
                  }

                  if (tagContent !== "") {
                    myAlert("还有tag未保存");
                    return;
                  }

                  handleSubmit(
                    {
                      ...getmulti(Number(exTime), new Date(date)),
                      sportId: sportId,
                      moodId,
                      effort,
                      Tags: JSON.stringify(tags),
                      title: title.trim(),
                      content: content.trim(),
                      reply: thinkingStr,
                    },
                    myAlert
                  );
                }}
                style={[
                  styles.submit,
                  { display: pageState === MAIN ? "flex" : "none" },
                ]}
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
            <View style={{ display: pageState === MAIN ? "flex" : "none" }}>
              <MainText>请选择运动的类型</MainText>
              <ChooseSport sportId={sportId} setSportId={setSportId} />
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
                    cursorColor="#ffa356"
                    placeholder="0"
                    value={exTime}
                    onChangeText={(text) => {
                      if (
                        isNaN(Number(text)) ||
                        text.length > 3 ||
                        Number(text) < 0
                      ) {
                        setSnackbarV(true);
                        return;
                      }
                      setExTime(text);
                    }}
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
                <MoodContainer
                  ImoodId={0}
                  currentMoodId={moodId}
                  setMoodId={setMoodId}
                ></MoodContainer>
                <MoodContainer
                  ImoodId={1}
                  currentMoodId={moodId}
                  setMoodId={setMoodId}
                ></MoodContainer>
                <MoodContainer
                  ImoodId={2}
                  currentMoodId={moodId}
                  setMoodId={setMoodId}
                ></MoodContainer>
                <MoodContainer
                  ImoodId={3}
                  currentMoodId={moodId}
                  setMoodId={setMoodId}
                ></MoodContainer>
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
                      backgroundColor: effortArr[1].color,
                      height: 15,
                    }}
                  ></View>
                  <View
                    style={{
                      width: contentWidth / 4,
                      backgroundColor: effortArr[2].color,
                      height: 15,
                    }}
                  ></View>
                  <View
                    style={{
                      width: contentWidth / 4,
                      backgroundColor: effortArr[3].color,
                      height: 15,
                    }}
                  ></View>
                  <View
                    style={{
                      width: contentWidth / 4,
                      backgroundColor: effortArr[4].color,
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
                  source={requireRunningDog}
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
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <MainText
                style={{
                  display:
                    pageState === MAIN || pageState === TAG ? "flex" : "none",
                }}
              >
                关键词
              </MainText>
              <View style={{ display: pageState === TAG ? "flex" : "none" }}>
                <IconButton
                  icon={"chevron-down"}
                  size={20}
                  onPress={() => setPageState(MAIN)}
                />
              </View>
            </View>
            <Pressable
              onPress={() => {
                setPageState(TAG);
              }}
            >
              <HintText
                style={{ display: pageState === MAIN ? "flex" : "none" }}
              >
                用几个简单的关键词概况一下本次运动吧
              </HintText>
            </Pressable>
            {pageState === TAG ? (
              <TextInput
                style={{
                  display: pageState === TAG ? "flex" : "none",
                  fontSize: 15,
                  lineHeight: 26,
                }}
                placeholder="(输入完成空格添加)"
                value={tagContent}
                onChangeText={onTagContentChange}
                autoFocus={true}
              ></TextInput>
            ) : undefined}
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  display:
                    pageState === MAIN || pageState === TAG ? "flex" : "none",
                }}
              >
                {tags.map((v, k) => {
                  return (
                    <ColorfulTag
                      Message={v}
                      Color="#ff960b"
                      isChosen={false}
                      key={k}
                      onPress={EmptyF}
                      style={{ marginVertical: 3 }}
                      onLongPress={() => {
                        updateTags(tags.filter((v1) => v1 !== v));
                      }}
                    />
                  );
                })}
                <ColorfulTag
                  Message="点击添加状态词"
                  Color="#ff960b"
                  isChosen={false}
                  onPress={() => {
                    if (pageState === MAIN) {
                      setPageState(TAG);
                    } else {
                      if (tagContent === "") {
                        myAlert("请输入Tag");
                        return;
                      }
                      updateTags((tags) => {
                        tags.unshift(tagContent);
                      });
                      setTagContent("");
                    }
                  }}
                  style={{
                    marginVertical: 3,
                    display: pageState === MAIN ? "flex" : "none",
                  }}
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
              <MainText
                style={{
                  marginVertical: 10,
                  display:
                    pageState === MAIN || pageState === CONTENT
                      ? "flex"
                      : "none",
                }}
              >
                运动日记
              </MainText>
              <View
                style={{ display: pageState === CONTENT ? "flex" : "none" }}
              >
                <IconButton
                  icon={"chevron-down"}
                  size={20}
                  onPress={() => setPageState(MAIN)}
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
                display:
                  pageState === MAIN || pageState === CONTENT ? "flex" : "none",
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
                  display: pageState === MAIN ? "flex" : "none",
                }}
              />
              <View
                style={{
                  alignSelf: "center",
                  display: pageState === MAIN ? "flex" : "none",
                }}
              >
                <Line length={contentWidth - 50} />
              </View>
              <TextInput
                multiline={true}
                placeholder="用一段话描述一下今天的辛苦付出吧！"
                style={{
                  minHeight: pageState === CONTENT ? 400 : 100,
                  // flex: 1,
                  textAlignVertical: "top",
                  fontSize: 15,
                  marginTop: 10,
                  display:
                    pageState === MAIN || pageState === CONTENT
                      ? "flex"
                      : "none",
                }}
                value={content}
                onChangeText={(t) => setContent(t)}
                onFocus={() => setPageState(CONTENT)}
              ></TextInput>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
      <Portal>
        <Snackbar
          visible={SnackbarV}
          onDismiss={() => {
            setSnackbarV(false);
          }}
          action={{
            label: "确定",
            onPress: () => {
              // Do something
              setSnackbarV(false);
            },
          }}
          duration={1000}
        >
          请输入合理的运动时间
        </Snackbar>
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
          source={requireRunningDog}
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
          <Pressable onPress={() => setEffort(n)} hitSlop={20}>
            <Icon source="circle" size={15} color="white"></Icon>
          </Pressable>
        </View>
      );
    }
  }
}

export function ChooseSport({
  sportId,
  setSportId,
}: {
  sportId: number;
  setSportId: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <FlatList
      style={{ paddingVertical: 10 }}
      horizontal={true}
      data={sportArr}
      renderItem={({ item, index }) => (
        <ColorfulTag
          Message={item.sportName}
          Color={item.color}
          isChosen={sportId === item.id}
          onPress={() => setSportId(item.id)}
        />
      )}
      showsHorizontalScrollIndicator={false}
    />
  );
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
          fontSize: 15,
          color: "grey",
          textAlign: isCenter ? "center" : undefined,
          marginVertical: 5,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

function MoodContainer({
  currentMoodId,
  ImoodId,
  setMoodId,
}: {
  ImoodId: number;
  currentMoodId: number;
  setMoodId: React.Dispatch<React.SetStateAction<number>>;
}) {
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
            if (currentMoodId === ImoodId) {
              return (
                <Image
                  source={MoodArr[ImoodId].pic}
                  style={{ height: 85, aspectRatio: 1 }}
                />
              );
            } else {
              return (
                <Image
                  source={MoodArr[ImoodId].unPic}
                  style={{ height: 70, aspectRatio: 1 }}
                />
              );
            }
          })()}
        </View>
      </Pressable>
      <Text style={{ textAlign: "center", fontSize: 15 }}>
        {MoodArr[ImoodId].descirption}
      </Text>
    </View>
  );
}

function ColorfulTag({
  Message,
  Color,
  isChosen,
  onPress,
  onLongPress,
  style,
}: {
  Message: string;
  Color: string;
  isChosen: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
}) {
  if (!isChosen) {
    return (
      <TouchableRipple
        onPress={onPress}
        style={[
          { marginHorizontal: 8, borderRadius: 5, overflow: "hidden" },
          style,
        ]}
        borderless={true}
        onLongPress={onLongPress}
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
  myAlert: (message: string) => void
) {
  if (isNaN(data.timestart) || data.timestart >= data.timeend) {
    myAlert("请输入合理的运动时间");
    return;
  }
  if (data.sportId === -1) {
    myAlert("请选择运动类型");
    return;
  }
  if (data.moodId === -1) {
    myAlert("请选择心情");
    return;
  }
  if (data.effort === 0) {
    myAlert("请选择耗力");
    return;
  }
  // if (data.title === "") {
  //   myAlert("请输入标题");
  //   return;
  // }
  // if (data.content === "") {
  //   myAlert("请输入内容");
  //   return;
  // }

  let db = await getDB();
  await insertData(db, data);
  console.log("插入成功");
  router.dismissTo("/(tabs)");
}
