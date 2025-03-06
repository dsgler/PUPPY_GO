import { BrandColor } from "@/consts/tabs";
import { getProgressByMonthRetRow } from "@/sqls/targetSql2";
import { useState, useContext, useEffect } from "react";
import { ColorValue, View, Pressable, Text } from "react-native";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Progress } from "./Progress";
import { MonthgroupChildRow } from "./MonthgroupChildRow";
import {
  MenuCtx,
  ShowAddTargetCtx,
  myLayoutTransition,
  menuObjType,
  myFadeIn,
} from "./public";

export function MonthGroup({ data }: { data: getProgressByMonthRetRow }) {
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
  const showAddTarget = useContext(ShowAddTargetCtx);

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
        <Pressable
          style={{ marginLeft: 10 }}
          onPress={() => {
            showAddTarget(true, (AddTargetStates) => {
              const {
                dataState: [, updatedata],
              } = AddTargetStates;
              updatedata((_data) => {
                _data.groupId = data.groupId;
              });
            });
          }}
        >
          {/* @ts-ignore */}
          <AntIcon name="pluscircle" size={21} color={BrandColor} />
        </Pressable>
      </View>
      {isFolded ? null : (
        <Animated.View entering={myFadeIn}>
          {data.children.map((data) => (
            <MonthgroupChildRow data={data} key={data.Id} />
          ))}
          <View style={{ height: 5 }}></View>
        </Animated.View>
      )}
    </Animated.View>
  );
}
