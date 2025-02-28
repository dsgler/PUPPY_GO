import { BrandColor, textColor } from "@/consts/tabs";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleProp,
  ViewStyle,
  TextInput,
  StyleSheet,
  GestureResponderEvent,
  TextStyle,
  ColorValue,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntIcon from "react-native-vector-icons/AntDesign";
import FeaIcon from "react-native-vector-icons/Feather";

import Pencil from "@/assets/images/targetPage/pencil";
import RepeatIcon from "@/assets/images/targetPage/repeat";

import {
  Directions,
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
import { Modal, Portal, TouchableRipple } from "react-native-paper";
import PressableText from "@/components/public/PressableText";

import * as consts_duration from "@/consts/duration";
import { useSQLiteContext } from "expo-sqlite";
import * as SQLite from "expo-sqlite";
import { getGapTimeString } from "@/utility/datetool";
import {
  addGroupOrGetGroupId,
  addTarget,
  cancelCheck,
  changeGroupName,
  childrenRow,
  createTable,
  deleteGroup,
  deleteTarget,
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
import sportArr from "@/consts/sportType";
import {
  defaultError,
  MyAlertCtx,
  MyConfirmCtx,
  MyHintCtx,
} from "@/app/_layout";
import { dayDescriptionChina } from "@/consts/dayDescription";
import * as consts_frequency from "@/consts/frequency";
import {
  CustomeMonthBlock,
  CustomeWeekBlock,
} from "@/components/public/CustomeMonthBlock";
import { repeatList } from "@/consts/repeatList";
import { router, useFocusEffect } from "expo-router";
// import { myFadeIn, myFadeOut, myLayoutTransition } from "@/consts/anime";

export function getDescription(v: {
  sportId: number;
  description: string;
  duration: number;
}) {
  return v.sportId === -1
    ? v.description
    : `${sportArr[v.sportId].sportName}${getGapTimeString(v.duration)}`;
}

const MenuCtx = createContext<[menuObjType, (menuobj: menuObjType) => void]>([
  {
    x: 0,
    y: 0,
    visibility: false,
    targetId: -1,
    groupId: -1,
    groupName: "",
  },
  defaultError,
]);

type menuObjType = {
  x: number;
  y: number;
  visibility: boolean;
  targetId: number;
  groupId: number;
  groupName: string;
};

const RefreshFnCtx = createContext<() => void>(() => {
  throw Error("获取错误");
});

export const myFadeIn = FadeIn.duration(300).easing(Easing.inOut(Easing.quad));
export const myFadeOut = FadeOut.duration(300).easing(
  Easing.inOut(Easing.quad)
);
export const myLayoutTransition = LinearTransition.duration(300);

export default function Page() {
  console.log("渲染targetPage");

  const db = useSQLiteContext();

  const [insertModalV, setInsertModalV] = useState(false);

  const [durationType, setDurationType] = useState(consts_duration.DAILY);

  const [dataComponent, setDataComponent] = useState<React.ReactNode>();

  const [modalType, setModalType] = useState(0);
  const [isEmpty, setIsEmpty] = useState(false);

  const myAlert = useContext(MyAlertCtx);
  const myConfirm = useContext(MyConfirmCtx);
  const [menuobj, setMenuobj] = useImmer<menuObjType>({
    x: 0,
    y: 0,
    visibility: false,
    targetId: -1,
    groupId: -1,
    groupName: "",
  });

  const RefreshFn = useCallback(() => {
    showData(db, durationType, new Date(), setDataComponent, setIsEmpty).catch(
      myAlert
    );
    setMenuobj((v) => {
      v.visibility = false;
    });
  }, [db, durationType, myAlert, setMenuobj]);

  useEffect(RefreshFn, [RefreshFn]);

  useFocusEffect(RefreshFn);

  const showAddGroup = useCallback(() => {
    setMenuobj((v) => {
      v.groupId = -1;
      v.groupName = "";
      v.targetId = -1;
      v.visibility = false;
    });
    setModalType(ADD_GROUP);
    setInsertModalV(true);
  }, [setMenuobj]);
  const showAddTarget = useCallback(() => {
    setModalType(ADD_TARGET);
    setInsertModalV(true);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RefreshFnCtx.Provider value={RefreshFn}>
        <SafeAreaView>
          <Animated.ScrollView style={{ paddingHorizontal: 20 }}>
            <TopBar
              durationType={durationType}
              setDurationType={setDurationType}
            />
            {(isEmpty && durationType === consts_duration.DAILY) || <Tip />}
            {(isEmpty && durationType === consts_duration.DAILY) ||
              (durationType === consts_duration.DAILY ? (
                <AddTarget onPress={showAddTarget} />
              ) : (
                <AddGroup onPress={showAddGroup} />
              ))}
            <View style={{ height: 10 }} />
            <MenuCtx.Provider value={[menuobj, setMenuobj]}>
              {dataComponent}
            </MenuCtx.Provider>
            <View style={{ height: 10 }}></View>
          </Animated.ScrollView>
        </SafeAreaView>
        {isEmpty && durationType === consts_duration.DAILY && (
          <View
            style={[
              StyleSheet.absoluteFill,
              { justifyContent: "center", alignItems: "center" },
            ]}
          >
            <Image
              source={require("@/assets/images/targetPage/empty.png")}
              style={{ width: 233, height: 187 }}
            />
            <Text
              style={{ color: "#828287", fontSize: 14, textAlign: "center" }}
            >
              {"还没有目标哦……\n先从一件小事开始吧"}
            </Text>
            <Pressable
              style={{
                backgroundColor: "#FF960B",
                borderRadius: 15,
                paddingHorizontal: 16,
                paddingVertical: 6,
                marginTop: 10,
              }}
              onPress={showAddTarget}
            >
              <Text style={{ fontSize: 16, color: "#FFFFFF" }}>去添加</Text>
            </Pressable>
          </View>
        )}
        <Portal>
          <RefreshFnCtx.Provider value={RefreshFn}>
            <MenuCtx.Provider value={[menuobj, setMenuobj]}>
              <Modal
                visible={insertModalV}
                style={{
                  justifyContent: "flex-end",
                }}
                dismissable={false}
              >
                <Animated.ScrollView
                  keyboardShouldPersistTaps={"always"}
                  layout={myLayoutTransition}
                >
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
                    />
                  </View>
                </Animated.ScrollView>
              </Modal>
            </MenuCtx.Provider>
          </RefreshFnCtx.Provider>
        </Portal>
        <Pressable
          style={[
            StyleSheet.absoluteFill,
            {
              display: menuobj.visibility ? "flex" : "none",
            },
          ]}
          onPress={() => {
            setMenuobj({ ...menuobj, visibility: false });
          }}
        >
          <Pressable
            style={{
              backgroundColor: "#E7E7E7",
              width: 150,
              position: "absolute",
              left: menuobj.x,
              top: menuobj.y,
              borderRadius: 10,
              gap: 3,
              overflow: "hidden",
              boxShadow: "0 4 34 rgba(0,0,0,0.1)",
            }}
            onPress={() => {}}
          >
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "white",
                paddingHorizontal: 10,
                height: 34,
              }}
              onPress={() => {
                if (menuobj.targetId !== -1) {
                  router.push({
                    pathname: "/editTarget",
                    params: { targetId: menuobj.targetId },
                  });
                } else if (menuobj.groupId !== -1) {
                  setModalType(ADD_GROUP);
                  setInsertModalV(true);
                }
              }}
              // disabled={menuobj.targetId === -1}
            >
              <Text style={{ fontSize: 14 }}>编辑</Text>
            </Pressable>
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "white",
                paddingHorizontal: 10,
                height: 34,
              }}
              onPress={() => {
                myConfirm("确定删除吗？", () => {
                  if (menuobj.targetId !== -1) {
                    deleteTarget(db, menuobj.targetId)
                      .then(RefreshFn)
                      .catch(myAlert);
                  } else if (menuobj.groupId !== -1) {
                    deleteGroup(db, menuobj.groupId)
                      .then(RefreshFn)
                      .catch(myAlert);
                  }
                });
              }}
            >
              <Text style={{ flex: 1, color: "#F57165", fontSize: 14 }}>
                删除
              </Text>
              {/* @ts-ignore */}
              <FeaIcon name="trash-2" size={24} color={"#F57165"} />
            </Pressable>
          </Pressable>
        </Pressable>
      </RefreshFnCtx.Provider>
    </GestureHandlerRootView>
  );
}

const ADD_GROUP = 0;
const ADD_TARGET = 1;

function ModalComponentSwitcher({
  modalType,
  setInsertModalV,
}: {
  modalType: number;
  setInsertModalV: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  if (modalType === ADD_GROUP) {
    return <ModalComponent0 setInsertModalV={setInsertModalV} />;
  } else if (modalType === ADD_TARGET) {
    return <ModalComponent1 setInsertModalV={setInsertModalV} />;
  } else {
    throw Error("未知的modalType:" + modalType);
  }
}

/**
 * @describe 同时承担了添加和修改 groupName
 * 具体通过  groupId是否为 -1 判断
 */
function ModalComponent0({
  setInsertModalV,
}: {
  setInsertModalV: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [menuobj] = useContext(MenuCtx);
  console.log(menuobj);
  const [groupName, setGroupName] = useState(menuobj.groupName);
  const db = useSQLiteContext();
  const myAlert = useContext(MyAlertCtx);
  const RefreshFn = useContext(RefreshFnCtx);
  const myHint = useContext(MyHintCtx);

  const isAdd = menuobj.groupId === -1;

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
        <Text style={{ color: textColor, fontSize: 18 }}>
          {isAdd ? "创建分组" : "修改分组"}
        </Text>
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
            if (isAdd) {
              addGroupOrGetGroupId(db, t)
                .then(() => {
                  myHint("添加成功");
                  setInsertModalV(false);
                  RefreshFn();
                })
                .catch(myAlert);
            } else {
              changeGroupName(db, menuobj.groupId, t)
                .then(() => {
                  myHint("修改成功");
                  setInsertModalV(false);
                  RefreshFn();
                })
                .catch(myAlert);
            }
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
          placeholder="请输入分组名"
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
    paddingHorizontal: 15,
    paddingVertical: 3,
    height: 45,
    justifyContent: "center",
  },
  block: {
    height: 24,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "white",
    paddingHorizontal: 3,
  },
});

function ModalComponent1({
  setInsertModalV,
}: {
  setInsertModalV: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [targetName, setTargetName] = useState("");
  const db = useSQLiteContext();
  const myAlert = useContext(MyAlertCtx);
  const myHint = useContext(MyHintCtx);
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
  // const repeatList: ListChooseListRowType[] = repeatList;

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
  const REPEAT = 2;
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
            marginBottom: 10,
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
              let t = targetName.trim();
              let alertText = "";
              if (t === "") {
                alertText += "请输入名称\n";
              }
              if (data.groupId === -1) {
                alertText += "请选择分组\n";
              }
              if (alertText !== "") {
                myAlert(alertText.trim());
                return;
              }

              addTarget(db, {
                ...data,
                frequency: JSON.stringify(frequency),
                description: t,
              })
                .then(() => {
                  myHint("保存成功");
                })
                .then(RefreshFn)
                .then(() => {
                  setInsertModalV(false);
                })
                .catch(myAlert);
            }}
          />
        </View>
        <View style={ModalComponent1Style.row}>
          <TextInput
            cursorColor={BrandColor}
            autoFocus={true}
            style={{ fontSize: 16, padding: 0 }}
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
                color: data.groupId === -1 ? "#666666" : "black",
              }}
            >
              {data.groupId === -1
                ? "请选择分组"
                : groups.find((v) => v.groupId === data.groupId)?.groupName}
            </Text>
          </View>
        </Pressable>
        <View style={{ flexDirection: "row", gap: 5, marginBottom: 10 }}>
          <Pressable
            onPress={() => {
              setPageType(REPEAT);
            }}
            style={ModalComponent1Style.block}
          >
            <RepeatIcon />
          </Pressable>
          <Pressable
            onPress={() => {
              setPageType(DURATION);
            }}
            style={ModalComponent1Style.block}
          >
            <Text style={{ fontSize: 16 }}>时间</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setPageType(COUNT);
            }}
            style={ModalComponent1Style.block}
          >
            <Text style={{ fontSize: 16 }}>次数</Text>
          </Pressable>
        </View>
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
  } else if (pageType === REPEAT) {
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
          list={repeatList}
          chosenId={frequency.typeId}
          setId={(newId) => {
            updateFrequency((v) => {
              v.typeId = newId;
            });
          }}
        />
        {frequency.typeId === consts_frequency.COSTUM_MONTH ? (
          <CustomeMonthBlock
            date={new Date()}
            chosen={frequency.content}
            setChosen={(arr) => {
              updateFrequency((v) => {
                v.content = arr;
              });
            }}
          />
        ) : null}
        {frequency.typeId === consts_frequency.COSTUM_WEEK ? (
          <CustomeWeekBlock
            chosen={frequency.content}
            setChosen={(arr) => {
              updateFrequency((v) => {
                v.content = arr;
              });
            }}
          />
        ) : null}
      </View>
    );
  } else if (pageType === DURATION) {
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
        <View
          style={[
            ModalComponent1Style.row,
            {
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: undefined,
            },
          ]}
        >
          <View
            style={{
              height: 56,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "flex-end",
              marginVertical: 10,
            }}
          >
            <TextInput
              style={{
                width: 90,
                fontSize: 50,
                color: "#ffa356",
                padding: 0,
                textAlign: "right",
                textDecorationLine: "underline",
              }}
              cursorColor="#ffa356"
              placeholder="0"
              value={data.duration === 0 ? "" : data.duration.toString()}
              onChangeText={(text) => {
                let t = Number(text);
                if (isNaN(t) || text.length > 3 || t < 0) {
                  myHint("请输入合理数字");
                  return;
                }
                updatedata((data) => {
                  data.duration = t;
                });
              }}
              keyboardType="numeric"
              autoFocus
            />
            <Text style={{ fontSize: 16 }}>分钟</Text>
          </View>
        </View>
      </View>
    );
  } else if (pageType === COUNT) {
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
        <View
          style={[
            ModalComponent1Style.row,
            {
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: undefined,
            },
          ]}
        >
          <View
            style={{
              height: 56,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "flex-end",
              marginVertical: 10,
            }}
          >
            <TextInput
              style={{
                width: 90,
                fontSize: 50,
                color: "#ffa356",
                padding: 0,
                textAlign: "right",
                textDecorationLine: "underline",
              }}
              cursorColor="#ffa356"
              placeholder="0"
              value={data.count === 0 ? "" : data.count.toString()}
              onChangeText={(text) => {
                let t = Number(text);
                if (
                  isNaN(t) ||
                  text.length > 3 ||
                  t < 0 ||
                  Math.floor(t) !== t
                ) {
                  myHint("请输入合理整数");
                  return;
                }
                updatedata((data) => {
                  data.count = t;
                });
              }}
              keyboardType="numeric"
              autoFocus
            />
            <Text style={{ fontSize: 16 }}>次</Text>
          </View>
        </View>
      </View>
    );
  } else {
    throw RangeError(pageType + "不是有意义的pageType");
  }
}

export type ListChooseListRowType = { name: string; Id: number };
export function ListChoose({
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
        boxShadow: "0 4 4 rgba(0,0,0,0.1)",
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
  const swapConfig = {
    duration: 80,
    easing: Easing.in(Easing.ease),
  };

  const cardTransform = useSharedValue(0);
  const leftGesture = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => {
      cardTransform.value = withTiming(-50, swapConfig);
    });
  const rightGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      cardTransform.value = withTiming(0, swapConfig);
    });

  const myGesture = Gesture.Exclusive(leftGesture, rightGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: cardTransform.value }],
  }));

  const db = useSQLiteContext();
  const myAlert = useContext(MyAlertCtx);
  const RefreshFn = useContext(RefreshFnCtx);
  return (
    <View style={style}>
      <GestureDetector gesture={myGesture}>
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
    <Animated.View
      style={{
        backgroundColor: "white",
        borderRadius: 10,
        marginTop: 11,
        paddingVertical: 10,
        paddingHorizontal: 10,
      }}
      layout={myLayoutTransition}
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
      {isFolded ? null : (
        <Animated.View entering={myFadeIn} exiting={myFadeOut}>
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
        </Animated.View>
      )}
    </Animated.View>
  );
}

function MonthGroup({ data }: { data: getProgressByMonthRetRow }) {
  const [isFolded, setIsFolded] = useState(false);
  const greyColor = "#E5DDD5";
  const duration = 500;
  const bgColor = useSharedValue<ColorValue>("#FFFFFF");
  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: bgColor.value,
    borderRadius: 5,
  }));
  const [menuObj, setMenu] = useContext(MenuCtx);
  useEffect(() => {
    if (!menuObj.visibility) {
      bgColor.value = withTiming("#FFFFFF", { duration: duration });
    }
  }, [bgColor, menuObj.visibility]);

  return (
    <Animated.View
      style={{
        backgroundColor: "white",
        borderRadius: 10,
        marginTop: 10,
        paddingHorizontal: 10,
      }}
      layout={myLayoutTransition}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <Pressable
          key={data.groupId}
          onPressIn={() => {
            bgColor.value = withTiming(greyColor, { duration: duration });
          }}
          onLongPress={(e) => {
            const obj: menuObjType = {
              x: e.nativeEvent.pageX,
              y: e.nativeEvent.pageY,
              targetId: -1,
              groupId: data.groupId,
              visibility: true,
              groupName: data.groupName,
            };
            setMenu(obj);
          }}
          onPressOut={() => {
            if (menuObj.visibility) {
              return;
            }

            bgColor.value = withTiming("#FFFFFF", { duration: duration });
          }}
          style={{ flex: 1 }}
        >
          <Animated.View style={bgStyle}>
            <Text style={{ fontSize: 18 }}>{data.groupName}</Text>
          </Animated.View>
        </Pressable>
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
        <Animated.View entering={myFadeIn} exiting={myFadeOut}>
          {data.children.map((data) => (
            <MonthgroupChildRow data={data} key={data.Id} />
          ))}
          <View style={{ height: 5 }}></View>
        </Animated.View>
      )}
    </Animated.View>
  );
}

function MonthgroupChildRow({ data }: { data: childrenRow }) {
  const greyColor = "#E5DDD5";
  const duration = 500;
  const bgColor = useSharedValue<ColorValue>("#FFFFFF");
  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: bgColor.value,
    borderRadius: 5,
  }));
  const [menuObj, setMenu] = useContext(MenuCtx);
  useEffect(() => {
    if (!menuObj.visibility) {
      bgColor.value = withTiming("#FFFFFF", { duration: duration });
    }
  }, [bgColor, menuObj.visibility]);

  return (
    <Pressable
      key={data.Id}
      onPressIn={() => {
        bgColor.value = withTiming(greyColor, { duration: duration });
      }}
      onLongPress={(e) => {
        const obj: menuObjType = {
          x: e.nativeEvent.pageX,
          y: e.nativeEvent.pageY,
          targetId: data.Id,
          groupId: -1,
          visibility: true,
          groupName: "",
        };
        setMenu(obj);
      }}
      onPressOut={() => {
        if (menuObj.visibility) {
          return;
        }

        bgColor.value = withTiming("#FFFFFF", { duration: duration });
      }}
    >
      <Animated.View style={bgStyle}>
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
          {data.count > data.times ? (
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
                {data.count - data.times}
              </Text>
            </View>
          ) : null}
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
            color={BrandColor}
            height={6}
            style={{ flex: 1 }}
            achievedColor={"#2BA471"}
          />
          <View
            style={{
              width: 36,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1 }}></View>
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
      </Animated.View>
    </Pressable>
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
  achievedColor = "#2BA471",
}: {
  isShowText: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  total: number;
  achieved: number;
  height?: number;
  color?: ColorValue;
  achievedColor?: ColorValue;
}) {
  if (total === 0) {
    total = achieved = 1;
  }
  const isAchieved = achieved >= total;

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
          backgroundColor: isAchieved ? achievedColor : color,
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}></View>
      </View>
      <View style={{ flex: total - achieved, flexDirection: "row" }}>
        <View
          style={{
            backgroundColor: isAchieved ? achievedColor : color,
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
  setDataComponent: React.Dispatch<React.SetStateAction<React.ReactNode>>,
  setIsEmpty: React.Dispatch<React.SetStateAction<boolean>>
) {
  console.log("showData调用");
  await createTable(db);
  if (durationType === consts_duration.DAILY) {
    let datas = await getProgressByDay(db, d);
    if (datas.length === 0) {
      setIsEmpty(true);
      setDataComponent(null);
      return;
    }

    setIsEmpty(false);
    setDataComponent(
      <View>
        {datas.map((data) => (
          <TaskItemRow
            typeName={
              data.sportId === -1
                ? data.description
                : `${sportArr[data.sportId].sportName}${getGapTimeString(
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
