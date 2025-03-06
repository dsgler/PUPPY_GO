import { BrandColor, textColor } from "@/consts/tabs";
import {
  Text,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
  View,
} from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";

import { useContext, useEffect, useRef } from "react";
import { TouchableRipple } from "react-native-paper";

import { SpotlightPosiCtx } from "@/app/_layout";

export function AddGroup({
  onPress,
  style,
}: {
  onPress?:
    | (((event: GestureResponderEvent) => void) &
        ((e: GestureResponderEvent) => void))
    | undefined;
  style?: StyleProp<ViewStyle>;
}) {
  const [sptl, setsptl] = useContext(SpotlightPosiCtx);
  const myRef = useRef<View>(null);
  useEffect(() => {
    if (sptl.guideStep === 3) {
      setTimeout(() => {
        myRef.current?.measure((x, y, width, height, pageX, pageY) => {
          const o = {
            x: pageX - 5,
            y: pageY - 5,
            w: width + 10,
            h: height + 10,
            guideStep: 3,
          };
          console.log(o);
          setsptl(o);
        });
      }, 50);
    }
  }, [setsptl, sptl.guideStep]);

  return (
    <TouchableRipple
      style={{
        marginTop: 20,
        borderRadius: 10,
        overflow: "hidden",
      }}
      borderless={true}
      onPress={onPress}
      ref={myRef}
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

export function AddTarget({
  onPress,
  style,
}: {
  onPress?: Function;
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
      onPress={() => {
        if (onPress) {
          onPress();
        }
      }}
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
