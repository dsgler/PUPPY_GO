import { router } from "expo-router";
import { View, Pressable } from "react-native";
import { Surface } from "react-native-paper";
// import AddIcon from "@/assets/images/Footer/add";
import LeftIcon from "@/assets/images/Footer/left";
import LeftHalfIcon from "@/assets/images/Footer/leftHalf";
import LeftedIcon from "@/assets/images/Footer/lefted";
import RightIcon from "@/assets/images/Footer/right";
import RightHalfIcon from "@/assets/images/Footer/rightHalf";
import RightedIcon from "@/assets/images/Footer/righted";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useState, useEffect, useContext, useRef } from "react";
import AntIcon from "react-native-vector-icons/AntDesign";
import { useUIStore } from "@/store/alertStore";

export default function Footer({ props }: { props: BottomTabBarProps }) {
  // console.log("footer渲染");
  const sptl = useUIStore(s=>s.spotlight);
    const setsptl=useUIStore(s=>s.updateSpotlight)
  const myRef = useRef<View>(null);
  useEffect(() => {
    if (sptl.guideStep === 1) {
      myRef.current?.measure((x, y, width, height, pageX, pageY) => {
        const o = {
          x: pageX - 5,
          y: pageY - 5,
          w: width + 10,
          h: height + 10,
          guideStep: 1,
        };
        console.log(o);
        setsptl(o);
      });
    }
  }, [setsptl, sptl.guideStep]);

  let indexMap = new Map<string, number>();
  for (let i = 0; i < props.state.routes.length; i++) {
    indexMap.set(props.state.routes[i].name, i);
  }

  let i = indexMap.get("index")!;
  let isLeftFocused = props.state.index === i;
  let indexRoute = props.state.routes[i];

  i = indexMap.get("targetPage")!;
  let isRightFocused = props.state.index === i;
  let TargetPageRoute = props.state.routes[i];

  let [LeftPlaceholder, setLeftPlaceholder] = useState(
    isLeftFocused ? <LeftedIcon /> : <LeftIcon />
  );

  let [RightPlaceholder, setRightPlaceholder] = useState(
    isRightFocused ? <RightedIcon /> : <RightIcon />
  );

  const [isLeftAnimating, setIsLeftAnimating] = useState(false);
  const [isRightAnimating, setIsRightAnimating] = useState(false);
  const AnimateTime = 200;

  useEffect(() => {
    if (isLeftAnimating) {
      return;
    }

    setLeftPlaceholder(isLeftFocused ? <LeftedIcon /> : <LeftIcon />);
  }, [isLeftFocused, isLeftAnimating]);

  useEffect(() => {
    if (isRightAnimating) {
      return;
    }

    setRightPlaceholder(isRightFocused ? <RightedIcon /> : <RightIcon />);
  }, [isRightFocused, isRightAnimating]);

  return (
    <Surface elevation={5}>
      <View
        style={{ flexDirection: "row", height: 70, backgroundColor: "white" }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Pressable
            onPress={() => {
              const event = props.navigation.emit({
                type: "tabPress",
                target: indexRoute.key,
                canPreventDefault: true,
              });

              if (!isLeftFocused && !event.defaultPrevented) {
                setLeftPlaceholder(<LeftHalfIcon />);
                setIsLeftAnimating(true);
                props.navigation.navigate(indexRoute.name, indexRoute.params);
                setTimeout(() => {
                  setIsLeftAnimating(false);
                }, AnimateTime);
              }
            }}
            onLongPress={() => {
              props.navigation.emit({
                type: "tabLongPress",
                target: props.state.routes[indexMap.get("index")!].key,
              });
            }}
          >
            {LeftPlaceholder}
          </Pressable>
        </View>

        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Pressable
            onPress={() => {
              router.push("/addPage");
            }}
            ref={myRef}
          >
            {/* <AddIcon /> */}
            {/* @ts-ignore */}
            <AntIcon name="pluscircle" size={56} color="#FFB52B" />
          </Pressable>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Pressable
            onPress={() => {
              const event = props.navigation.emit({
                type: "tabPress",
                target: TargetPageRoute.key,
                canPreventDefault: true,
              });

              if (!isRightFocused && !event.defaultPrevented) {
                setRightPlaceholder(<RightHalfIcon />);
                setIsRightAnimating(true);
                props.navigation.navigate(
                  TargetPageRoute.name,
                  TargetPageRoute.params
                );
                setTimeout(() => {
                  setIsRightAnimating(false);
                }, AnimateTime);
              }
            }}
            onLongPress={() => {
              props.navigation.emit({
                type: "tabLongPress",
                target: TargetPageRoute.key,
              });
            }}
          >
            {RightPlaceholder}
          </Pressable>
        </View>
      </View>
    </Surface>
  );
}
