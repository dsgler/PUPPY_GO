import React, {
  useEffect,
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
import { useImmer } from "use-immer";
import { StyleProp } from "react-native";
import { END_STEP, guideArr } from "@/consts/guide";
import { useUIStore } from "@/store/alertStore";

// 启用 immer 的 map 和 set 支持
enableMapSet();

export default function RootLayout() {
  useDrizzleStudio(SQLite.openDatabaseSync("myDatabase.db"));
  
  const alert = useUIStore((state) => state.alert);
  const hint = useUIStore((state) => state.hint); 
  const spotlight = useUIStore((state) => state.spotlight);
  const hideAlert = useUIStore((state) => state.hideAlert);
  const confirmAction = useUIStore((state) => state.confirmAction);
  const hideHint = useUIStore((state) => state.hideHint);
  const updateSpotlight = useUIStore((state) => state.updateSpotlight);
  const resetSpotlight = useUIStore((state) => state.resetSpotlight);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("rgba(0, 0, 0, 0)");
  }, []);

  useFonts({ AaTianNiuNai: require("@/assets/fonts/AaTianNiuNai.ttf") });

  const [dogsayPosi, setDogsayPosi] = useImmer<StyleProp<ViewStyle>>({});
  useEffect(() => {
    const step = spotlight.guideStep;
    if (step < 1 || step > 4) {
      return;
    }

    const g = guideArr[step - 1];
    setDogsayPosi({
      top: spotlight.y + g.topModifier,
      left: g.leftModifier,
    });
  }, [setDogsayPosi, spotlight]);
  const isEnd = spotlight.guideStep === END_STEP;

  return (
    <>
      <SQLite.SQLiteProvider databaseName="myDatabase.db">
        <ThemeProvider theme={MYTHEME}>
          <PaperProvider>
            <ThemeProvider theme={MYTHEME}>
              <Stack screenOptions={{ headerShown: false }}></Stack>
              {/* 引导 */}
              {spotlight.guideStep !== -1 && (
                <Pressable style={[StyleSheet.absoluteFill]}>
                  {/* 通过boxShadow实现遮罩 */}
                  <View
                    style={{
                      position: "absolute",
                      top: spotlight.y,
                      left: spotlight.x,
                      width: spotlight.w,
                      height: spotlight.h,
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
                            guideArr[spotlight.guideStep - 1]
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
                          const s = spotlight.guideStep;
                          if (s === 1) {
                            updateSpotlight({ guideStep: s + 1 });
                          } else if (s === 2) {
                            router.replace({
                              pathname: "/(tabs)/targetPage",
                              params: { durationType: 1 },
                            });
                            updateSpotlight({ guideStep: s + 1 });
                          } else if (s === 3) {
                            router.replace({
                              pathname: "/(tabs)/targetPage",
                              params: { durationType: 0 },
                            });
                            updateSpotlight({ guideStep: s + 1 });
                          } else if (s === 4) {
                            router.replace("/(tabs)");
                            resetSpotlight();
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
              {alert.isVisible ? (
                <Portal>
                  <View style={StyleSheet.absoluteFill}>
                    <Dialog
                      visible={alert.isVisible}
                      onDismiss={hideAlert}
                    >
                      <Dialog.Content>{alert.content}</Dialog.Content>
                      <Dialog.Actions>
                        {alert.isConfirm ? (
                          <>
                            <Button onPress={hideAlert}>
                              取消
                            </Button>
                            <Button
                              onPress={confirmAction}
                            >
                              确定
                            </Button>
                          </>
                        ) : (
                          <Button onPress={hideAlert}>
                            好的
                          </Button>
                        )}
                      </Dialog.Actions>
                    </Dialog>
                  </View>
                </Portal>
              ) : null}
              {hint.isVisible ? (
                <Portal>
                  <Snackbar
                    visible={hint.isVisible}
                    onDismiss={hideHint}
                    action={{
                      label: "确定",
                      onPress: hideHint,
                    }}
                    duration={500}
                  >
                    {hint.content}
                  </Snackbar>
                </Portal>
              ) : null}
            </ThemeProvider>
          </PaperProvider>
        </ThemeProvider>
      </SQLite.SQLiteProvider>
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="auto" />
    </>
  );
}
