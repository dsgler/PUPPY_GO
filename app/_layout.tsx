import React, { createContext, useCallback, useEffect, useState } from "react";
import { Stack } from "expo-router";
import { Button, Dialog, PaperProvider, Portal } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";
import { ThemeProvider } from "react-native-paper";
import { Text, StyleSheet, View } from "react-native";
import { MYTHEME } from "@/consts/themeObj";
import * as NavigationBar from "expo-navigation-bar";

export const MyAlertCtx = createContext<
  (message: React.JSX.Element | string | Error) => void
>(() => {
  throw Error("获取失败");
});

export default function RootLayout() {
  useDrizzleStudio(SQLite.openDatabaseSync("myDatabase.db"));
  const [dialogV, setDialogV] = useState(false);
  const [dialogC, setDialogC] = useState<React.JSX.Element>();

  const myAlert = useCallback((message: React.JSX.Element | string | Error) => {
    console.log(message);
    let dataComponent: React.JSX.Element;

    if (typeof message === "string") {
      dataComponent = <Text>{message}</Text>;
    } else if (message instanceof Error) {
      dataComponent = <Text>{message.message}</Text>;
    } else {
      dataComponent = message;
    }

    setDialogC(dataComponent);
    setDialogV(true);
  }, []);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("rgba(0, 0, 0, 0)");
  }, []);

  return (
    <>
      <SQLite.SQLiteProvider databaseName="myDatabase.db">
        <MyAlertCtx.Provider value={myAlert}>
          <ThemeProvider theme={MYTHEME}>
            <PaperProvider>
              <ThemeProvider theme={MYTHEME}>
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="addPage"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="editTarget"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="+not-found" />
                </Stack>
                {dialogV ? (
                  <Portal>
                    <View style={StyleSheet.absoluteFill}>
                      <Dialog
                        visible={dialogV}
                        onDismiss={() => setDialogV(false)}
                        style={{ zIndex: 99 }}
                      >
                        <Dialog.Content>{dialogC}</Dialog.Content>
                        <Dialog.Actions>
                          <Button onPress={() => setDialogV(false)}>
                            好的
                          </Button>
                        </Dialog.Actions>
                      </Dialog>
                    </View>
                  </Portal>
                ) : null}
              </ThemeProvider>
            </PaperProvider>
          </ThemeProvider>
        </MyAlertCtx.Provider>
      </SQLite.SQLiteProvider>
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="auto" />
    </>
  );
}
