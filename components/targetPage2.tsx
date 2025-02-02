import { BrandColor, textColor } from "@/consts/tabs";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StyleProp,
  ViewStyle,
  TextInput,
  StyleSheet,
  GestureResponderEvent,
  TextStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntIcon from "react-native-vector-icons/AntDesign";
import FeaIcon from "react-native-vector-icons/Feather";

import Pencil from "@/assets/images/targetPage/pencil";

import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Modal, Portal, TouchableRipple } from "react-native-paper";
import PressableText from "./PressableText";

import * as consts_duration from "@/consts/duration";
import { useSQLiteContext } from "expo-sqlite";
import * as SQLite from "expo-sqlite";
import { getDateNumber, getGapTimeString } from "@/utility/datetool";
import {
  cancelCheck,
  getProgressByDay,
  getProgressByWeek,
  getProgressByWeekRetRow,
  setCheck,
} from "@/sqls/targetSql2";
import sports from "@/consts/sportType";
import { MyAlertCtx } from "@/app/_layout";
import { dayDescription, dayDescriptionChina } from "@/consts/dayDescription";

const RefreshFnCtx = createContext(() => {});
export default function Page() {
  console.log("渲染targetPage");

  const db = useSQLiteContext();

  const [insertModalV, setInsertModalV] = useState(false);
  const [durationType, setDurationType] = useState(consts_duration.DAILY);

  const [dataComponent, setDataComponent] = useState<
    React.JSX.Element[] | React.JSX.Element | undefined
  >();
  const myAlert = useContext(MyAlertCtx);
  const RefreshFn = useCallback(() => {
    showData(db, durationType, new Date(), setDataComponent).catch(myAlert);
  }, [db, myAlert, durationType]);

  useEffect(RefreshFn, [RefreshFn]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RefreshFnCtx.Provider value={RefreshFn}>
        <SafeAreaView>
          <ScrollView style={{ paddingHorizontal: 20 }}>
            <TopBar
              durationType={durationType}
              setDurationType={setDurationType}
            />
            <Tip />
            <View style={{ height: 10 }} />
            {dataComponent}
          </ScrollView>
        </SafeAreaView>
        <Portal>
          <Modal
            visible={insertModalV}
            style={{
              flexDirection: "column-reverse",
              justifyContent: "flex-start",
            }}
            dismissable={false}
          >
            <View
              style={{
                height: 150,
                backgroundColor: "#F4F4F4",
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                paddingHorizontal: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginTop: 20,
                }}
              >
                <PressableText
                  message="取消"
                  color={BrandColor}
                  highlightColor="#ffd399"
                  TextStyle={{ fontSize: 16 }}
                  onPress={() => {
                    setInsertModalV(false);
                  }}
                />
                <Text style={{ color: textColor, fontSize: 18 }}>创建目标</Text>
                <PressableText
                  message="保存"
                  color={BrandColor}
                  highlightColor="#ffd399"
                  TextStyle={{ fontSize: 16 }}
                  onPress={() => {}}
                />
              </View>
              <View
                style={{
                  borderRadius: 15,
                  backgroundColor: "white",
                  marginTop: 20,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  height: 45,
                  justifyContent: "center",
                }}
              >
                <TextInput
                  cursorColor={BrandColor}
                  autoFocus={true}
                  style={{ fontSize: 16 }}
                />
              </View>
            </View>
          </Modal>
        </Portal>
      </RefreshFnCtx.Provider>
    </GestureHandlerRootView>
  );
}

const TopBarStyle = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "row",
    borderRadius: 25,
    alignItems: "center",
    boxShadow:
      "0 6 30 rgba(0,0,0,0.05),0 16 24 rgba(0,0,0,0.04),0 8 10 rgba(0,0,0,0.08)",
    marginTop: 10,
    marginBottom: 30,
  },
  left: {
    height: 40,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 5,
    marginVertical: 5,
    borderRadius: 20,
  },
  middle: {
    height: 40,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 20,
  },
  right: {
    height: 40,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginLeft: 5,
    marginVertical: 5,
    borderRadius: 20,
  },
  chosen: {
    backgroundColor: "#FFE7CA",
    borderRadius: 20,
  },
  chosenText: { fontSize: 16, textAlign: "center", color: BrandColor },
  unchosen: {},
  unchosenText: { fontSize: 16, textAlign: "center" },
  TouchableRipple: { flex: 1, borderRadius: 20 },
});

function TopBar({
  durationType,
  setDurationType,
}: {
  durationType: number;
  setDurationType: (id: number) => void;
}) {
  return (
    <View style={TopBarStyle.container}>
      <TouchableRipple
        onPress={() => {
          setDurationType(consts_duration.DAILY);
        }}
        style={[
          TopBarStyle.left,
          durationType === consts_duration.DAILY
            ? TopBarStyle.chosen
            : TopBarStyle.unchosen,
        ]}
        borderless={true}
      >
        <Text
          style={
            durationType === consts_duration.DAILY
              ? TopBarStyle.chosenText
              : TopBarStyle.unchosenText
          }
        >
          日
        </Text>
      </TouchableRipple>
      <TouchableRipple
        onPress={() => {
          setDurationType(consts_duration.WEEKLY);
        }}
        style={[
          TopBarStyle.middle,
          durationType === consts_duration.WEEKLY
            ? TopBarStyle.chosen
            : TopBarStyle.unchosen,
        ]}
        borderless={true}
      >
        <Text
          style={
            durationType === consts_duration.WEEKLY
              ? TopBarStyle.chosenText
              : TopBarStyle.unchosenText
          }
        >
          周
        </Text>
      </TouchableRipple>
      <TouchableRipple
        onPress={() => {
          setDurationType(consts_duration.MONTHLY);
        }}
        style={[
          TopBarStyle.right,
          durationType === consts_duration.MONTHLY
            ? TopBarStyle.chosen
            : TopBarStyle.unchosen,
        ]}
        borderless={true}
      >
        <Text
          style={
            durationType === consts_duration.MONTHLY
              ? TopBarStyle.chosenText
              : TopBarStyle.unchosenText
          }
        >
          月
        </Text>
      </TouchableRipple>
    </View>
  );
}

function Tip() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          paddingHorizontal: 12,
          paddingVertical: 15,
          borderRadius: 10,
          boxShadow: "0 4 4 rgba(0,0,0,0.1)",
        }}
      >
        <Text style={{ color: textColor, fontSize: 14 }}>
          哇你又创建了新任务，记得去完成哦！{"\n"}
          Tips：拆分任务可以帮助你更好理清思路，让目标更清晰哦！
        </Text>
      </View>
      <View>
        <Image
          source={require("@/assets/images/targetPage/dog.png")}
          style={{
            width: 128,
            height: 128,
          }}
        />
      </View>
    </View>
  );
}

function AddGroup({
  onPress,
  style,
}: {
  onPress?:
    | (((event: GestureResponderEvent) => void) &
        ((e: GestureResponderEvent) => void))
    | undefined;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <TouchableRipple
      style={{
        marginTop: 20,
        borderRadius: 10,
        overflow: "hidden",
      }}
      borderless={true}
      onPress={onPress}
    >
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            height: 60,
            backgroundColor: "#FFB52B",
          },
          style,
        ]}
      >
        <View style={{ width: 26, marginHorizontal: 16 }}>
          {/* @ts-ignore */}
          <AntIcon name="plus" size={24} />
        </View>
        <Text style={{ color: textColor, fontSize: 14 }}>创建一个分组</Text>
      </View>
    </TouchableRipple>
  );
}

function AddTarget({
  onPress,
  style,
}: {
  onPress?:
    | (((event: GestureResponderEvent) => void) &
        ((e: GestureResponderEvent) => void))
    | undefined;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <TouchableRipple
      style={{
        marginTop: 20,
        borderRadius: 10,
        overflow: "hidden",
      }}
      borderless={true}
      onPress={onPress}
    >
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            height: 60,
            backgroundColor: "white",
          },
          style,
        ]}
      >
        <View style={{ flex: 1, marginLeft: 20 }}>
          <Text style={{ color: textColor, fontSize: 14 }}>创建一个目标</Text>
        </View>
        <View style={{ width: 26, marginHorizontal: 16 }}>
          {/* @ts-ignore */}
          <AntIcon name="pluscircle" size={24} color={BrandColor} />
        </View>
      </View>
    </TouchableRipple>
  );
}

type TaskItemRowProps = {
  typeName: string;
  style?: StyleProp<ViewStyle>;
  isFinished: boolean;
  targetId: number;
};

function TaskItemRow({
  typeName,
  style,
  isFinished,
  targetId,
}: TaskItemRowProps) {
  const SWIPE_DISTANCE = 30;
  const swapConfig = {
    duration: 80,
    easing: Easing.in(Easing.ease),
  };

  const cardTransform = useSharedValue(0);
  const panGesture = Gesture.Pan().onEnd((e) => {
    if (e.translationX < -SWIPE_DISTANCE) {
      cardTransform.value = withTiming(-50, swapConfig);
      console.log("in");
    } else if (e.translationX > SWIPE_DISTANCE) {
      cardTransform.value = withTiming(0, swapConfig);
      console.log("back");
    }
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: cardTransform.value }],
  }));

  const db = useSQLiteContext();
  const myAlert = useContext(MyAlertCtx);
  const RefreshFn = useContext(RefreshFnCtx);
  return (
    <View style={style}>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            {
              // display: "none",
              flexDirection: "row",
              height: 60,
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: 10,
              // boxShadow: "0 4 4 rgba(0,0,0,0.1)",
              marginBottom: 10,
            },
            animatedStyle,
          ]}
        >
          <View style={{ marginHorizontal: 16 }}>
            <Pressable
              onPress={() => {
                if (isFinished) {
                  cancelCheck(db, targetId).catch(myAlert).then(RefreshFn);
                } else {
                  setCheck(db, targetId).catch(myAlert).then(RefreshFn);
                }
              }}
            >
              {isFinished ? (
                /* @ts-ignore */
                <AntIcon name="checkcircle" size={24} color="#FFCC8E" />
              ) : (
                /* @ts-ignore */
                <FeaIcon name="circle" size={24} color="#DCDCDC" />
              )}
            </Pressable>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: isFinished ? "rgba(0,0,0,0.25)" : textColor,
                fontSize: 16,
                lineHeight: 60,
              }}
            >
              {typeName}
            </Text>
          </View>
          <View style={{ marginRight: 26 }}>
            <Pencil />
          </View>
        </Animated.View>
      </GestureDetector>

      <View
        style={{
          flexDirection: "row-reverse",
          height: 60,
          alignItems: "center",
          backgroundColor: "#FF8972",
          borderRadius: 10,
          boxShadow: "0 4 4 rgba(0,0,0,0.1)",
          marginBottom: 10,

          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: -1,
        }}
      >
        <Pressable style={{ marginRight: 16 }} onPress={() => {}}>
          {/* @ts-ignore */}
          <FeaIcon name="trash-2" size={24} color={"white"} />
        </Pressable>
      </View>
    </View>
  );
}

function WeekGroup({ data }: { data: getProgressByWeekRetRow }) {
  const [isFolded, setIsFolded] = useState(false);

  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <Text>{dayDescriptionChina[data.day]}</Text>
        </View>
        <Pressable
          onPress={() => {
            setIsFolded(!isFolded);
          }}
        >
          {/* @ts-ignore */}
          <AntIcon name={isFolded ? "rightcircleo" : "downcircleo"} />
        </Pressable>
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: "#e7e7e7",
          marginHorizontal: 10,
          marginVertical: 5,
        }}
      ></View>
      <Progress
        isShowText={true}
        total={data.children.length}
        achieved={data.finished}
        style={{ height: 25 }}
      />
      <View style={{ display: isFolded ? "none" : "flex" }}>
        {data.children.map((v) => {
          return (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View>
                {v.isFinished ? (
                  /* @ts-ignore */
                  <AntIcon name="checkcircle" size={24} color="#FFCC8E" />
                ) : (
                  /* @ts-ignore */
                  <FeaIcon name="circle" size={24} color="#DCDCDC" />
                )}
              </View>
              <Text>
                {v.sportId === -1
                  ? v.description
                  : `${sports[v.sportId].sportName}${getGapTimeString(
                      v.duration
                    )}`}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function Progress({
  isShowText,
  total,
  achieved,
  style,
  textStyle,
}: {
  isShowText: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  total: number;
  achieved: number;
}) {
  return (
    <View
      style={[
        {
          borderRadius: 999,
          backgroundColor: "#E7E7E7",
          height: 30,
          overflow: "hidden",
          flexDirection: "row",
        },
        style,
      ]}
    >
      <View
        style={{
          flex: achieved,
          flexDirection: "row",
          borderRadius: 999,
          backgroundColor: BrandColor,
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}></View>
        {isShowText ? (
          <Text style={[{ marginHorizontal: 5, color: "white" }, textStyle]}>
            {Math.round((100 * achieved) / total) + "%"}
          </Text>
        ) : undefined}
      </View>
      <View style={{ flex: total - achieved }}></View>
    </View>
  );
}

async function showData(
  db: SQLite.SQLiteDatabase,
  durationType: number,
  d: Date,
  setDataComponent: React.Dispatch<
    React.SetStateAction<React.JSX.Element | React.JSX.Element[] | undefined>
  >
) {
  if (durationType === consts_duration.DAILY) {
    let datas = await getProgressByDay(db, d);
    setDataComponent(
      <View>
        <AddTarget />
        {datas.map((data) => (
          <TaskItemRow
            typeName={
              data.sportId === -1
                ? data.description
                : `${sports[data.sportId].sportName}${getGapTimeString(
                    data.duration
                  )}`
            }
            isFinished={data.isFinished}
            targetId={data.Id}
            key={data.Id}
            style={{ marginTop: 10 }}
          />
        ))}
      </View>
    );
  } else if (durationType === consts_duration.WEEKLY) {
    const datas = await getProgressByWeek(db, d);
    console.log(datas);
    setDataComponent(
      <View>
        {datas.map((data, key) => (
          <WeekGroup data={data} key={key} />
        ))}
      </View>
    );
  }
}
