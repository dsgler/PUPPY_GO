import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { router, Stack } from "expo-router";
import {
  Button,
  Dialog,
  PaperProvider,
  Portal,
  Snackbar,
  TouchableRipple,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";
import { ThemeProvider } from "react-native-paper";
import {
  Text,
  StyleSheet,
  View,
  Pressable,
  Image,
  ViewStyle,
} from "react-native";
import { MYTHEME } from "@/consts/themeObj";
import * as NavigationBar from "expo-navigation-bar";
import { useFonts } from "expo-font";
import { enableMapSet } from "immer";
import { ImmerHook, useImmer } from "use-immer";
import { StyleProp } from "react-native";
import { END_STEP, guideArr } from "@/consts/guide";

// 启用 immer 的 map 和 set 支持
enableMapSet();

export const defaultError = () => {
  throw TypeError("不应为初值");
};

const message2dataComponent = (message: React.JSX.Element | string | Error) => {
  let dataComponent: React.JSX.Element;

  if (typeof message === "string") {
    dataComponent = <Text>{message}</Text>;
  } else if (message instanceof Error) {
    dataComponent = <Text>{message.message}</Text>;
  } else {
    dataComponent = message;
  }

  return dataComponent;
};

export const MyAlertCtx =
  createContext<(message: React.JSX.Element | string | Error) => void>(
    defaultError
  );

export const MyHintCtx =
  createContext<(message: React.JSX.Element | string | Error) => void>(
    defaultError
  );

export const MyConfirmCtx =
  createContext<
    (message: React.JSX.Element | string | Error, onConfirm: () => void) => void
  >(defaultError);

const SpotlightPosiDefault = {
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  guideStep: -1,
};
export const SpotlightPosiCtx = createContext<
  ImmerHook<{
    x: number;
    y: number;
    w: number;
    h: number;
    guideStep: number;
  }>
>([SpotlightPosiDefault, defaultError]);

export default function RootLayout() {
  useDrizzleStudio(SQLite.openDatabaseSync("myDatabase.db"));
  const [dialogV, setDialogV] = useState(false);
  const [dialogC, setDialogC] = useState<React.ReactNode>();
  const [isComFirm, setIsConfirm] = useState(false);

  const [SnackbarV, setSnackbarV] = useState(false);
  const [SnackbarC, setSnackbarC] = useState<React.ReactNode | string>();

  const myAlert = useCallback((message: React.JSX.Element | string | Error) => {
    console.log(message);
    let dataComponent: React.JSX.Element = message2dataComponent(message);

    setIsConfirm(false);
    setDialogC(dataComponent);
    setDialogV(true);
  }, []);

  const myHint = useCallback((message: React.JSX.Element | string | Error) => {
    let dataComponent: React.ReactNode | string;

    if (typeof message === "string") {
      dataComponent = message;
    } else if (message instanceof Error) {
      dataComponent = message.message;
    } else {
      dataComponent = message;
    }

    setSnackbarC(dataComponent);
    setSnackbarV(true);
  }, []);

  const onConfirmRef = useRef<() => void>(defaultError);
  const myConfirm = useCallback(
    (message: React.JSX.Element | string | Error, onConfirm: () => void) => {
      let dataComponent: React.JSX.Element = message2dataComponent(message);

      onConfirmRef.current = onConfirm;

      setIsConfirm(true);
      setDialogC(dataComponent);
      setDialogV(true);
    },
    []
  );

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("rgba(0, 0, 0, 0)");
  }, []);

  useFonts({ AaTianNiuNai: require("@/assets/fonts/AaTianNiuNai.ttf") });

  const spotlightPosiState = useImmer(SpotlightPosiDefault);
  const spotlightPosi = spotlightPosiState[0];
  const [dogsayPosi, setDogsayPosi] = useImmer<StyleProp<ViewStyle>>({});
  useEffect(() => {
    const step = spotlightPosi.guideStep;
    if (step < 1 || step > 4) {
      return;
    }

    const g = guideArr[step - 1];
    setDogsayPosi({
      top: spotlightPosi.y + g.topModifier,
      left: g.leftModifier,
    });
  }, [setDogsayPosi, spotlightPosi]);
  const isEnd = spotlightPosi.guideStep === END_STEP;

  return (
    <>
      <SQLite.SQLiteProvider databaseName="myDatabase.db">
        <MyAlertCtx.Provider value={myAlert}>
          <MyHintCtx.Provider value={myHint}>
            <MyConfirmCtx.Provider value={myConfirm}>
              <SpotlightPosiCtx.Provider value={spotlightPosiState}>
                <ThemeProvider theme={MYTHEME}>
                  <PaperProvider>
                    <ThemeProvider theme={MYTHEME}>
                      <Stack screenOptions={{ headerShown: false }}></Stack>
                      {/* 引导 */}
                      {spotlightPosiState[0].guideStep !== -1 && (
                        <Pressable style={[StyleSheet.absoluteFill]}>
                          {/* 通过boxShadow实现遮罩 */}
                          <View
                            style={{
                              position: "absolute",
                              top: spotlightPosiState[0].y,
                              left: spotlightPosiState[0].x,
                              width: spotlightPosiState[0].w,
                              height: spotlightPosiState[0].h,
                              boxShadow: "0 0 0 3000 rgba(0, 0, 0, 0.5)",
                              borderRadius: 5,
                            }}
                          ></View>
                          <View
                            style={[
                              {
                                position: "absolute",
                                left: 0,
                                right: 20,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10,
                              },
                              dogsayPosi,
                            ]}
                          >
                            <Image
                              source={require("@/assets/images/index/dog.png")}
                              style={{ height: 103, width: 103 }}
                            />
                            <View style={{ gap: 20, flex: 1 }}>
                              <View
                                style={{
                                  paddingVertical: 12,
                                  paddingHorizontal: 15,
                                  backgroundColor: "white",
                                  borderRadius: 15,
                                }}
                              >
                                <Text
                                  style={{ fontSize: 14, textAlign: "center" }}
                                >
                                  {
                                    guideArr[spotlightPosi.guideStep - 1]
                                      .description
                                  }
                                </Text>
                              </View>
                              <TouchableRipple
                                style={{
                                  width: 73,
                                  height: 31,
                                  overflow: "hidden",
                                  flexDirection: "row",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  backgroundColor: "#FF960B",
                                  borderRadius: 15,
                                  alignSelf: "flex-end",
                                }}
                                borderless={true}
                                onPress={() => {
                                  const s = spotlightPosi.guideStep;
                                  if (s === 1) {
                                    spotlightPosiState[1]((v) => {
                                      v.guideStep++;
                                    });
                                  } else if (s === 2) {
                                    router.replace({
                                      pathname: "/(tabs)/targetPage",
                                      params: { durationType: 1 },
                                    });
                                    spotlightPosiState[1]((v) => {
                                      v.guideStep++;
                                    });
                                  } else if (s === 3) {
                                    router.replace({
                                      pathname: "/(tabs)/targetPage",
                                      params: { durationType: 0 },
                                    });
                                    spotlightPosiState[1]((v) => {
                                      v.guideStep++;
                                    });
                                  } else if (s === 4) {
                                    router.replace("/(tabs)");
                                    spotlightPosiState[1](SpotlightPosiDefault);
                                    console.log(111);
                                  }
                                }}
                              >
                                <Text style={{ fontSize: 16, color: "white" }}>
                                  {isEnd ? "知道了" : "下一步"}
                                </Text>
                              </TouchableRipple>
                            </View>
                          </View>
                        </Pressable>
                      )}
                      {/* 对话框 */}
                      {dialogV ? (
                        <Portal>
                          <View style={StyleSheet.absoluteFill}>
                            <Dialog
                              visible={dialogV}
                              onDismiss={() => setDialogV(false)}
                            >
                              <Dialog.Content>{dialogC}</Dialog.Content>
                              <Dialog.Actions>
                                {isComFirm ? (
                                  <>
                                    <Button onPress={() => setDialogV(false)}>
                                      取消
                                    </Button>
                                    <Button
                                      onPress={() => {
                                        onConfirmRef.current();
                                        setDialogV(false);
                                      }}
                                    >
                                      确定
                                    </Button>
                                  </>
                                ) : (
                                  <Button onPress={() => setDialogV(false)}>
                                    好的
                                  </Button>
                                )}
                              </Dialog.Actions>
                            </Dialog>
                          </View>
                        </Portal>
                      ) : null}
                      {SnackbarV ? (
                        <Portal>
                          <Snackbar
                            visible={SnackbarV}
                            onDismiss={() => {
                              setSnackbarV(false);
                            }}
                            action={{
                              label: "确定",
                              onPress: () => {
                                setSnackbarV(false);
                              },
                            }}
                            duration={500}
                          >
                            {SnackbarC}
                          </Snackbar>
                        </Portal>
                      ) : null}
                    </ThemeProvider>
                  </PaperProvider>
                </ThemeProvider>
              </SpotlightPosiCtx.Provider>
            </MyConfirmCtx.Provider>
          </MyHintCtx.Provider>
        </MyAlertCtx.Provider>
      </SQLite.SQLiteProvider>
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="auto" />
    </>
  );
}
