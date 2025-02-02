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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntIcon from "react-native-vector-icons/AntDesign";
import FeaIcon from "react-native-vector-icons/Feather";

import Pencil from "@/assets/images/targetPage/pencil";
import AddIcon from "@/assets/images/targetPage/add";

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
import {
  Button,
  Dialog,
  Modal,
  Portal,
  TouchableRipple,
} from "react-native-paper";
import PressableText from "./PressableText";

import {
  getTargetIdsByDurationTypeId,
  getTypenamesByIDs,
  getFinishsByIds,
  setTargetState,
  addTypenameByDurationTypeId,
  deleteTypeIdByDurationTypeId,
  daylyRowType,
  monothlyRowType,
  flatten,
  deflatten,
  NestedIterable,
} from "./targetSql";
import { getDB } from "../sqls/indexSql";
import { getDateNumber } from "@/utility/datetool";
import * as consts_duration from "@/consts/duration";

const RefreshFn = createContext<() => Promise<void>>(() => Promise.resolve());
const DateContext = createContext<[number, number]>([0, 0]);
const ActiveGroupId = createContext<
  [number, React.Dispatch<React.SetStateAction<number>>]
>([0, () => {}]);

export default function Page() {
  console.log("渲染targetPage");

  const [insertModalV, setInsertModalV] = useState(false);
  const [durationType, setDurationType] = useState(consts_duration.DAILY);
  const [ActiveGroupIdState, setActiveGroupIdState] = useState(-1);

  const [dataComponent, setDataComponent] = useState<
    React.JSX.Element[] | undefined
  >();
  const [newTargetContent, setNewTargetContent] = useState("");

  const [dialogV, setDialogV] = useState(false);
  const [dialogC, setDialogC] = useState("");

  const date = getSpecificDate(getDateNumber(new Date()), durationType);

  const refreshData = useCallback(() => {
    return showData(durationType, date, setDataComponent).catch((e) => {
      setDialogC(e.message);
      setDialogV(true);
    });
  }, [durationType, date, setDataComponent]);

  useEffect(() => {
    // refreshData();
  }, [refreshData]);

  // isFirstRun().then((t) => {
  //   if (t) {
  //     console.log("first");
  //     __setType()
  //       .then(refreshData)
  //       .catch((e) => {
  //         setDialogC(e.message);
  //         setDialogV(true);
  //       });
  //   }
  // });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView>
        <ScrollView style={{ paddingHorizontal: 20 }}>
          <TopBar
            durationType={durationType}
            setDurationType={(id) => {
              setDurationType(id);
              setActiveGroupIdState(-1);
            }}
          />
          <Tip />
          <AddTargetRow />
          <View style={{ height: 10 }} />
          <RefreshFn.Provider value={refreshData}>
            <DateContext.Provider value={[date, durationType]}>
              <ActiveGroupId.Provider
                value={[ActiveGroupIdState, setActiveGroupIdState]}
              >
                {dataComponent}
              </ActiveGroupId.Provider>
            </DateContext.Provider>
          </RefreshFn.Provider>
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
                onPress={() => {
                  if (newTargetContent.trim() === "") {
                    setDialogC("请输入内容");
                    setDialogV(true);
                    return;
                  }
                  let groupId =
                    ActiveGroupIdState === -1 ? undefined : ActiveGroupIdState;
                  addTypenameByDurationTypeId(
                    durationType,
                    newTargetContent,
                    groupId
                  )
                    .catch((e) => {
                      setDialogC(e.message);
                      setDialogV(true);
                      throw Error();
                    })
                    .then(refreshData)
                    .then(() => {
                      setNewTargetContent("");
                      setInsertModalV(false);
                    })
                    .catch();
                }}
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
                value={newTargetContent}
                onChangeText={setNewTargetContent}
                style={{ fontSize: 16 }}
              />
            </View>
          </View>
        </Modal>
        <Dialog visible={dialogV} onDismiss={() => setDialogV(false)}>
          <Dialog.Content>
            <Text>{dialogC}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogV(false)}>ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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

function AddTargetRow({
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
          <AddIcon />
        </View>
        <Text style={{ color: textColor, fontSize: 14 }}>创建一个目标</Text>
      </View>
    </TouchableRipple>
  );
}

function GroupTaskRow({
  groupId,
  message,
  style,
  childrenProps,
}: {
  groupId: number;
  message: string;
  style?: StyleProp<ViewStyle>;
  childrenProps: TaskItemRowProps[];
}) {
  const [ActiveGroupIdState, setActiveGroupIdState] = useContext(ActiveGroupId);

  return (
    <View style={style}>
      <View
        style={{
          flexDirection: "row",
          marginTop: 15,
          alignItems: "center",
        }}
      >
        <View>
          <Pencil />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text>{message}</Text>
        </View>
        <View>
          <Pressable
            onPress={() => {
              if (ActiveGroupIdState === groupId) {
                setActiveGroupIdState(-1);
              } else {
                setActiveGroupIdState(groupId);
              }
            }}
          >
            {/* @ts-ignore */}
            <AntIcon
              name={
                ActiveGroupIdState === groupId ? "downcircleo" : "rightcircleo"
              }
              size={24}
              color={"black"}
            />
          </Pressable>
        </View>
      </View>
      <View
        style={{
          height: 2,
          backgroundColor: "#FF960B",
          borderRadius: 999,
          marginTop: 3,
          marginBottom: 5,
        }}
      ></View>
      <View
        style={{ display: ActiveGroupIdState === groupId ? "flex" : "none" }}
      >
        {childrenProps.map((v, k) => (
          <TaskItemRow
            typeName={v.typeName}
            isFinished={v.isFinished}
            typeId={v.typeId}
            groupId={groupId}
            key={k}
          />
        ))}
      </View>
    </View>
  );
}

type TaskItemRowProps = {
  typeName: string;
  style?: StyleProp<ViewStyle>;
  isFinished: boolean;
  // setTargetState?: (isFinished: boolean, typeId: number) => Promise<void>;
  typeId: number;
  groupId?: number;
};

function TaskItemRow({
  typeName,
  style,
  isFinished,
  typeId,
  groupId,
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

  const refreshData = useContext(RefreshFn);
  const [date, durationType] = useContext(DateContext);

  return (
    <View>
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
            style,
          ]}
        >
          <View style={{ marginHorizontal: 16 }}>
            <Pressable
              onPress={() => {
                setTargetState(!isFinished, typeId, date).then(refreshData);
              }}
            >
              {isFinished ? (
                /* @ts-ignore */
                <AntIcon name="checkcircle" size={24} color="#B5C7FF" />
              ) : (
                /* @ts-ignore */
                <FeaIcon name="circle" size={24} color={"#DCDCDC"} />
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
        <Pressable
          style={{ marginRight: 16 }}
          onPress={() => {
            deleteTypeIdByDurationTypeId(durationType, typeId, groupId).then(
              refreshData
            );
          }}
        >
          {/* @ts-ignore */}
          <FeaIcon name="trash-2" size={24} color={"white"} />
        </Pressable>
      </View>
    </View>
  );
}

async function showData(
  durationType: number,
  date: number,
  setDataComponent: React.Dispatch<
    React.SetStateAction<React.JSX.Element[] | undefined>
  >
) {
  const db = await getDB();
  const rows = await getTargetIdsByDurationTypeId(durationType);
  let ret: React.JSX.Element[];
  if (durationType === DAYLY) {
    const ids = rows as unknown as daylyRowType[];
    const names = await getTypenamesByIDs(db, ids);
    const finishs = await getFinishsByIds(db, ids, date);

    if (ids.length !== names.length) {
      throw Error("ids.length!==names.length");
    }

    ret = Array.from({ length: ids.length }) as React.JSX.Element[];
    for (let i = 0; i < ids.length; i++) {
      ret[i] = (
        <TaskItemRow
          typeName={names[i]}
          typeId={ids[i]}
          isFinished={finishs[i]}
          key={i}
        />
      );
    }
  } else if (durationType === MONTHLY || durationType === YEARLY) {
    const ids = rows as unknown as monothlyRowType[];
    const ids_flattened = flatten(ids as NestedIterable<number>);
    const names: structedRowType[] = deflatten(
      await getTypenamesByIDs(db, ids_flattened),
      ids
    );
    const finishs: structedIsfinishedType[] = deflatten(
      await getFinishsByIds(db, ids_flattened, date),
      ids
    );
    ret = ids.map((v, k) => {
      const cp: TaskItemRowProps[] = v.children.map((v2, k2) => {
        return {
          typeName: names[k].children[k2],
          isFinished: finishs[k].children[k2],
          typeId: v2,
        };
      });
      return (
        <GroupTaskRow
          groupId={v.description}
          message={names[k].description}
          childrenProps={cp}
          key={k}
        />
      );
    });
  } else {
    throw Error("未知");
  }

  setDataComponent(ret);
}

function getSpecificDate(date: number, durationType: number) {
  switch (durationType) {
    case DAYLY:
      break;
    case MONTHLY:
      date = Math.floor(date / 100);
      break;
    case YEARLY:
      date = Math.floor(date / 10000);
      break;
    default:
      throw Error("未知的durationType:" + durationType);
  }
  return date;
}
