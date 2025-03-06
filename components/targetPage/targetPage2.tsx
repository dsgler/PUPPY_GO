import { BrandColor, textColor } from "@/consts/tabs";
import { Text, Pressable, TextInput, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FeaIcon from "react-native-vector-icons/Feather";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useImmer } from "use-immer";
import { Modal, Portal } from "react-native-paper";
import PressableText from "@/components/public/PressableText";

import * as consts_duration from "@/consts/duration";
import { useSQLiteContext } from "expo-sqlite";
import * as SQLite from "expo-sqlite";
import { getGapTimeString } from "@/utility/datetool";
import {
  addGroupOrGetGroupId,
  changeGroupName,
  createTable,
  deleteGroup,
  deleteTarget,
  frequencyType,
  getProgressByDay,
  getProgressByMonth,
  getProgressByWeek,
  targetRow,
} from "@/sqls/targetSql2";
import sportArr from "@/consts/sportType";
import { MyAlertCtx, MyConfirmCtx, MyHintCtx } from "@/app/_layout";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { WeekGroup } from "./WeekGroup";
import { MonthGroup } from "./MonthGroup";
import {
  menuObjType,
  AddTarget_frequencyStateDefault,
  AddTarget_dataStateDefault,
  RefreshFnCtx,
  MenuCtx,
  ShowAddTargetCtx,
  ShowAddGroupCtx,
  myLayoutTransition,
  AddTargetStates,
} from "./public";
import { Tip } from "./Tip";
import { EmptyDog } from "./EmptyDog";
import { AddTarget, AddGroup } from "./AddRow";
import { TaskItemRow } from "./ItemTaskRow";
import { ModalComponent1 } from "./Modal1";
import { TopBar } from "./TopBar";

export default function Page() {
  console.log("渲染targetPage");
  const { durationType: durationTypeString } = useLocalSearchParams<{
    durationType: string;
  }>();

  let _durationType: number | undefined = Number(durationTypeString);
  if (![0, 1, 2].includes(_durationType)) {
    _durationType = undefined;
  }

  const db = useSQLiteContext();

  const [insertModalV, setInsertModalV] = useState(false);

  const [durationType, setDurationType] = useState(consts_duration.DAILY);
  useEffect(() => {
    console.log(_durationType);
    if (_durationType !== undefined) {
      setDurationType(_durationType);
    }
  }, [_durationType]);

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

  const AddTarget_frequencyState = useImmer<frequencyType>(
    AddTarget_frequencyStateDefault
  );
  const AddTarget_dataState = useImmer<targetRow>(AddTarget_dataStateDefault);
  const AddTargetStates: AddTargetStates = useMemo(
    () => ({
      frequencyState: AddTarget_frequencyState,
      dataState: AddTarget_dataState,
    }),
    [AddTarget_dataState, AddTarget_frequencyState]
  );

  const showAddTarget = useCallback(
    (
      isClear: boolean = true,
      afterClear?: (AddTargetStates: AddTargetStates) => void
    ) => {
      if (isClear) {
        AddTarget_dataState[1](AddTarget_dataStateDefault);
        AddTarget_frequencyState[1](AddTarget_frequencyStateDefault);
      }
      setModalType(ADD_TARGET);
      if (afterClear) {
        afterClear(AddTargetStates);
      }
      setInsertModalV(true);
    },
    [AddTargetStates, AddTarget_dataState, AddTarget_frequencyState]
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RefreshFnCtx.Provider value={RefreshFn}>
        <SafeAreaView>
          <Animated.ScrollView style={{ paddingHorizontal: 20 }}>
            <TopBar
              durationType={durationType}
              setDurationType={setDurationType}
            />
            {/* 在不为空的情况下在日界面显示 */}
            {(isEmpty && durationType === consts_duration.DAILY) || <Tip />}
            {(isEmpty && durationType === consts_duration.DAILY) ||
              (durationType === consts_duration.DAILY ? (
                <AddTarget onPress={showAddTarget} />
              ) : (
                <AddGroup onPress={showAddGroup} />
              ))}
            <View style={{ height: 10 }} />
            <MenuCtx.Provider value={[menuobj, setMenuobj]}>
              <ShowAddTargetCtx.Provider value={showAddTarget}>
                <ShowAddGroupCtx.Provider value={showAddGroup}>
                  {dataComponent}
                </ShowAddGroupCtx.Provider>
              </ShowAddTargetCtx.Provider>
            </MenuCtx.Provider>
            <View style={{ height: 10 }}></View>
          </Animated.ScrollView>
        </SafeAreaView>
        {isEmpty && durationType === consts_duration.DAILY && (
          <EmptyDog showAddTarget={showAddTarget} />
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
                      AddTargetStates={AddTargetStates}
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
  AddTargetStates,
}: {
  modalType: number;
  setInsertModalV: React.Dispatch<React.SetStateAction<boolean>>;
  AddTargetStates: AddTargetStates;
}) {
  if (modalType === ADD_GROUP) {
    return <ModalComponent0 setInsertModalV={setInsertModalV} />;
  } else if (modalType === ADD_TARGET) {
    return (
      <ModalComponent1
        setInsertModalV={setInsertModalV}
        AddTargetStates={AddTargetStates}
      />
    );
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
          style={{ fontSize: 16, padding: 0 }}
          value={groupName}
          onChangeText={setGroupName}
          placeholder="请输入分组名"
        />
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
      <Animated.View layout={myLayoutTransition}>
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
      </Animated.View>
    );
  } else if (durationType === consts_duration.WEEKLY) {
    const datas = await getProgressByWeek(db, d);
    setDataComponent(
      <View>
        {datas.map((data, key) => {
          console.log(data);
          if (data.children.length !== 0) {
            return <WeekGroup data={data} key={key} />;
          }
          return undefined;
        })}
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
