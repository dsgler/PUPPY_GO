import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Stack } from "expo-router";
import {
  Button,
  Dialog,
  PaperProvider,
  Portal,
  Snackbar,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";
import { ThemeProvider } from "react-native-paper";
import { Text, StyleSheet, View, Pressable } from "react-native";
import { MYTHEME } from "@/consts/themeObj";
import * as NavigationBar from "expo-navigation-bar";
import { useFonts } from "expo-font";
import { enableMapSet } from "immer";
import { ImmerHook, useImmer } from "use-immer";

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
                      {spotlightPosiState[0].guideStep !== -1 && (
                        <Pressable style={[StyleSheet.absoluteFill]}>
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
                          <Pressable
                            style={{
                              width: 50,
                              height: 50,
                              backgroundColor: "white",
                            }}
                            onPress={() => {
                              spotlightPosiState[1](SpotlightPosiDefault);
                            }}
                          ></Pressable>
                        </Pressable>
                      )}
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
