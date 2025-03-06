import { BrandColor } from "@/consts/tabs";
import { childrenRow } from "@/sqls/targetSql2";
import { useContext, useEffect } from "react";
import { ColorValue, Pressable, Text, View } from "react-native";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Progress } from "./Progress";
import { MenuCtx, menuObjType, getDescription } from "./public";

export function MonthgroupChildRow({ data }: { data: childrenRow }) {
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
        <Text
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            minHeight: 24,
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
        </Text>
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
