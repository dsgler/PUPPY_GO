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
  ColorValue,
  Keyboard,
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
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useImmer } from "use-immer";
import {
  Modal,
  Portal,
  Provider,
  Snackbar,
  TouchableRipple,
} from "react-native-paper";
import PressableText from "./PressableText";

import * as consts_duration from "@/consts/duration";
import { useSQLiteContext } from "expo-sqlite";
import * as SQLite from "expo-sqlite";
import { getDateNumber, getGapTimeString } from "@/utility/datetool";
import {
  addGroup,
  cancelCheck,
  createTable,
  frequencyType,
  getGroups,
  getProgressByDay,
  getProgressByMonth,
  getProgressByMonthRetRow,
  getProgressByWeek,
  getProgressByWeekRetRow,
  groupNameRow,
  setCheck,
  targetRow,
} from "@/sqls/targetSql2";
import sports from "@/consts/sportType";
import { MyAlertCtx } from "@/app/_layout";
import { dayDescriptionChina } from "@/consts/dayDescription";
import * as consts_frequency from "@/consts/frequency";

export function getDescription(v: {
  sportId: number;
  description: string;
  duration: number;
}) {
  return v.sportId === -1
    ? v.description
    : `${sports[v.sportId].sportName}${getGapTimeString(v.duration)}`;
}

const RefreshFnCtx = createContext<() => void>(() => {
  throw Error("获取错误");
});
export default function Page() {
  console.log("渲染targetPage");

  const db = useSQLiteContext();

  const [insertModalV, setInsertModalV] = useState(false);
  const [SnackbarV, setSnackbarV] = useState(false);
  const [SnackbarC, setSnackbarC] = useState("");

  const [durationType, setDurationType] = useState(consts_duration.DAILY);

  const [dataComponent, setDataComponent] = useState<
    React.JSX.Element[] | React.JSX.Element | undefined
  >();

  const [modalType, setModalType] = useState(0);

  const myAlert = useContext(MyAlertCtx);
  const myHint = useCallback((message: string) => {
    setSnackbarC(message);
    setSnackbarV(true);
  }, []);

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
            {durationType === consts_duration.DAILY ? (
              <AddTarget
                onPress={() => {
                  setModalType(ADD_TARGET);
                  setInsertModalV(true);
                }}
              />
            ) : (
              <AddGroup
                onPress={() => {
                  setModalType(ADD_GROUP);
                  setInsertModalV(true);
                }}
              />
            )}
            <View style={{ height: 10 }} />
            {dataComponent}
            <View style={{ height: 10 }}></View>
          </ScrollView>
        </SafeAreaView>
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Portal>
            <RefreshFnCtx.Provider value={RefreshFn}>
              <Modal
                visible={insertModalV}
                style={{
                  justifyContent: "flex-end",
                }}
                dismissable={false}
              >
                <ScrollView keyboardShouldPersistTaps={"always"}>
                  <View
                    style={{
                      backgroundColor: "#F4F4F4",
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                      paddingHorizontal: 20,
                      paddingTop: 20,
                    }}
                  >
                    <ModalComponentSwitcher
                      modalType={modalType}
                      setInsertModalV={setInsertModalV}
                      myHint={myHint}
                    />
                  </View>
                </ScrollView>
              </Modal>
            </RefreshFnCtx.Provider>
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
              duration={300}
            >
              {SnackbarC}
            </Snackbar>
          </Portal>
        </View>
      </RefreshFnCtx.Provider>
    </GestureHandlerRootView>
  );
}

const ADD_GROUP = 0;
const ADD_TARGET = 1;

function ModalComponentSwitcher({
  modalType,
  setInsertModalV,
  myHint,
}: {
  modalType: number;
  setInsertModalV: React.Dispatch<React.SetStateAction<boolean>>;
  myHint: (message: string) => void;
}) {
  if (modalType === ADD_GROUP) {
    return (
      <ModalComponent0 setInsertModalV={setInsertModalV} myHint={myHint} />
    );
  } else if (modalType === ADD_TARGET) {
    return (
      <ModalComponent1 setInsertModalV={setInsertModalV} myHint={myHint} />
    );
  } else {
    throw Error("未知的modalType:" + modalType);
  }
}

function ModalComponent0({
  setInsertModalV,
  myHint,
}: {
  setInsertModalV: React.Dispatch<React.SetStateAction<boolean>>;
  myHint: (message: string) => void;
}) {
  const [groupName, setGroupName] = useState("");
  const db = useSQLiteContext();
  const myAlert = useContext(MyAlertCtx);
  const RefreshFn = useContext(RefreshFnCtx);

  return (
    <View>
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
        <Text style={{ color: textColor, fontSize: 18 }}>创建分组</Text>
        <PressableText
          message="保存"
          color={BrandColor}
          highlightColor="#ffd399"
          TextStyle={{ fontSize: 16 }}
          onPress={() => {
            let t = groupName.trim();
            if (t === "") {
              myAlert("请输入groupName");
              return;
            }
            addGroup(db, t)
              .then(() => {
                myHint("保存成功");
                setInsertModalV(false);
                RefreshFn();
              })
              .catch(myAlert);
          }}
        />
      </View>
      <View
        style={{
          borderRadius: 15,
          backgroundColor: "white",
          marginTop: 20,
          marginBottom: 20,
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
          value={groupName}
          onChangeText={setGroupName}
        />
      </View>
    </View>
  );
}

const ModalComponent1Style = StyleSheet.create({
  row: {
    borderRadius: 15,
    backgroundColor: "white",
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    height: 45,
    justifyContent: "center",
  },
});

function ModalComponent1({
  setInsertModalV,
  myHint,
}: {
  setInsertModalV: React.Dispatch<React.SetStateAction<boolean>>;
  myHint: (message: string) => void;
}) {
  const [targetName, setTargetName] = useState("");
  const db = useSQLiteContext();
  const myAlert = useContext(MyAlertCtx);
  const RefreshFn = useContext(RefreshFnCtx);
  const [groups, setGroups] = useState<groupNameRow[]>([]);
  useEffect(() => {
    getGroups(db)
      .then((v) => {
        setGroups(v);
      })
      .catch(myAlert);
  }, [db, myAlert]);
  const groupList = useMemo<ListChooseListRowType[]>(
    () => groups.map((v) => ({ name: v.groupName, Id: v.groupId })),
    [groups]
  );

  const [frequency, updateFrequency] = useImmer<frequencyType>({
    typeId: consts_frequency.DAILY,
    content: [],
  });
  const [data, updatedata] = useImmer<targetRow>({
    Id: -1,
    groupId: -1,
    description: "",
    makeTime: -1,
    duration: 0,
    count: 0,
    frequency: "",
    sportId: -1,
    endTime: -1,
  });

  const MAIN = 0;
  const CHOOSE_GROUP = 1;
  const CYCLE = 2;
  const DURATION = 3;
  const COUNT = 4;

  const [pageType, setPageType] = useState(MAIN);

  if (pageType === MAIN) {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "baseline",
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
            onPress={() => {
              // let t = targetName.trim();
              // if (t === "") {
              //   myAlert("请输入groupName");
              //   return;
              // }
              // addGroup(db, t)
              //   .then(() => {
              //     myHint("保存成功");
              //     setInsertModalV(false);
              //     RefreshFn();
              //   })
              //   .catch(myAlert);
            }}
          />
        </View>
        <View style={ModalComponent1Style.row}>
          <TextInput
            cursorColor={BrandColor}
            autoFocus={true}
            style={{ fontSize: 16 }}
            value={targetName}
            onChangeText={setTargetName}
            placeholder="请输入目标"
          />
        </View>
        <Pressable
          onPress={() => {
            setPageType(CHOOSE_GROUP);
          }}
        >
          <View style={ModalComponent1Style.row}>
            <Text
              style={{
                fontSize: 16,
                color: data.groupId === -1 ? "grep" : "black",
              }}
            >
              {data.groupId === -1
                ? "请选择分组"
                : groups.find((v) => v.groupId === data.groupId)?.groupName}
            </Text>
          </View>
        </Pressable>
      </View>
    );
  } else if (pageType === CHOOSE_GROUP) {
    return (
      <View>
        <View style={{ flexDirection: "row" }}>
          <PressableText
            message="返回"
            color={BrandColor}
            highlightColor="#ffd399"
            TextStyle={{ fontSize: 16 }}
            onPress={() => {
              setPageType(MAIN);
            }}
          />
        </View>
        <ListChoose
          list={groupList}
          chosenId={data.groupId}
          setId={(newId) => {
            updatedata((data) => {
              data.groupId = newId;
            });
          }}
        />
      </View>
    );
  }
}

type ListChooseListRowType = { name: string; Id: number };
function ListChoose({
  list,
  chosenId,
  setId,
}: {
  list: ListChooseListRowType[];
  chosenId: number;
  setId: (newId: number) => void;
}) {
  return (
    <View>
      {list.map((v) => {
        return (
          <Pressable
            onPress={() => {
              setId(v.Id);
            }}
            style={{ marginVertical: 5 }}
            key={v.Id}
          >
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                paddingVertical: 10,
                paddingLeft: 16,
                paddingRight: 16,
                flexDirection: "row",
                height: 45,
              }}
            >
              <Text style={{ fontSize: 16, flex: 1 }}>{v.name}</Text>
              {chosenId === v.Id ? (
                // @ts-ignore
                <AntIcon name="checkcircle" size={21} color={BrandColor} />
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
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
    } else if (e.translationX > SWIPE_DISTANCE) {
      cardTransform.value = withTiming(0, swapConfig);
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
  const [isFolded, setIsFolded] = useState(
    new Date().getDay() === (data.day + 1) % 7 ? false : true
  );

  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 10,
        marginTop: 11,
        paddingVertical: 10,
        paddingHorizontal: 10,
      }}
    >
      <View style={{ flexDirection: "row", height: 30, alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16 }}>{dayDescriptionChina[data.day]}</Text>
        </View>
        <Pressable
          onPress={() => {
            setIsFolded(!isFolded);
          }}
        >
          {/* @ts-ignore */}
          <AntIcon name={isFolded ? "rightcircleo" : "downcircleo"} size={21} />
        </Pressable>
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: "#e7e7e7",
          marginVertical: 5,
        }}
      ></View>
      <View style={{ flexDirection: "row" }}>
        <Progress
          isShowText={true}
          total={data.children.length}
          achieved={data.finished}
          style={{ height: 25, flex: 1 }}
        />
        <View style={{ marginLeft: 10 }}>
          {/* @ts-ignore */}
          <AntIcon name="pluscircle" size={21} color={BrandColor} />
        </View>
      </View>
      <View style={{ display: isFolded ? "none" : "flex" }}>
        {data.children.map((v) => {
          return (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 13,
              }}
              key={v.Id}
            >
              <View style={{ marginRight: 8 }}>
                {v.isFinished ? (
                  /* @ts-ignore */
                  <AntIcon name="checkcircle" size={21} color="#FFCC8E" />
                ) : (
                  /* @ts-ignore */
                  <FeaIcon name="circle" size={21} color="#DCDCDC" />
                )}
              </View>
              <Text style={{ fontSize: 16 }}>{getDescription(v)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function MonthGroup({ data }: { data: getProgressByMonthRetRow }) {
  const [isFolded, setIsFolded] = useState(false);

  return (
    <Animated.View
      style={{
        backgroundColor: "white",
        borderRadius: 10,
        marginTop: 10,
        paddingHorizontal: 10,
      }}
      layout={LinearTransition.duration(300)}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16 }}>{data.groupName}</Text>
        </View>
        <Pressable
          onPress={() => {
            setIsFolded(!isFolded);
          }}
        >
          {/* @ts-ignore */}
          <AntIcon name={isFolded ? "rightcircleo" : "downcircleo"} size={21} />
        </Pressable>
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: "#e7e7e7",
        }}
      ></View>
      <View style={{ flexDirection: "row", marginVertical: 10 }}>
        <Progress
          isShowText={true}
          total={100}
          achieved={data.progress}
          style={{ height: 25, flex: 1 }}
        />
        <View style={{ marginLeft: 10 }}>
          {/* @ts-ignore */}
          <AntIcon name="pluscircle" size={21} color={BrandColor} />
        </View>
      </View>
      {isFolded ? null : (
        <Animated.View
          entering={FadeIn.duration(300).easing(Easing.inOut(Easing.quad))}
          exiting={FadeOut.duration(300).easing(Easing.inOut(Easing.quad))}
        >
          {data.children.map((data) => {
            return (
              <View key={data.Id}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                    height: 24,
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 16, lineHeight: 24 }}>
                      {getDescription(data)}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderRadius: 999,
                      backgroundColor: "#FFF1B0",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: 5,
                      marginLeft: 5,
                      height: 24,
                      minWidth: 24,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        lineHeight: 24,
                        color: "#FFBC2B",
                        textAlign: "center",
                      }}
                    >
                      {Math.max(0, data.count - data.times)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    height: 22,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Progress
                    isShowText={false}
                    total={data.count}
                    achieved={data.times}
                    color={data.times < data.count ? BrandColor : "#2BA471"}
                    height={6}
                    style={{ flex: 1 }}
                  />
                  {data.times < data.count && data.count !== 0 ? (
                    <Text
                      style={{
                        fontSize: 14,
                        lineHeight: 22,
                        width: 36,
                        textAlign: "right",
                      }}
                    >
                      {Math.round((100 * data.times) / data.count) + "%"}
                    </Text>
                  ) : (
                    // @ts-ignore
                    <AntIcon name="checkcircle" size={21} color="#2BA471" />
                  )}
                </View>
              </View>
            );
          })}
          <View style={{ height: 5 }}></View>
        </Animated.View>
      )}
    </Animated.View>
  );
}

function Progress({
  isShowText,
  total,
  achieved,
  style,
  textStyle,
  height = 30,
  color = BrandColor,
}: {
  isShowText: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  total: number;
  achieved: number;
  height?: number;
  color?: ColorValue;
}) {
  return (
    <View
      style={[
        {
          borderRadius: 999,
          backgroundColor: "#E7E7E7",
          height: height,
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
          // borderRadius: 999,
          backgroundColor: color,
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}></View>
      </View>
      <View style={{ flex: total - achieved, flexDirection: "row" }}>
        <View
          style={{
            backgroundColor: color,
            borderTopRightRadius: 999,
            borderBottomRightRadius: 999,
            minWidth: height / 2,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {isShowText ? (
            <Text style={[{ marginHorizontal: 5, color: "white" }, textStyle]}>
              {Math.round((100 * achieved) / total) + "%"}
            </Text>
          ) : undefined}
        </View>
      </View>
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
  console.log("showData调用");
  await createTable(db);
  if (durationType === consts_duration.DAILY) {
    let datas = await getProgressByDay(db, d);
    setDataComponent(
      <View>
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
    setDataComponent(
      <View>
        {datas.map((data, key) => (
          <WeekGroup data={data} key={key} />
        ))}
      </View>
    );
  } else if (durationType === consts_duration.MONTHLY) {
    const datas = await getProgressByMonth(db);
    console.log(datas);
    setDataComponent(
      <View>
        {datas.map((data, key) => {
          return <MonthGroup data={data} key={key} />;
        })}
      </View>
    );
  } else {
    throw Error("没有这个durationType类型");
  }
}
