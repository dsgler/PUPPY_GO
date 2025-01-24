import React, { useState } from "react";
import { Stack } from "expo-router";
import { Button, Dialog, PaperProvider, Portal } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";
import { MD3LightTheme, ThemeProvider } from "react-native-paper";
import { Text } from "react-native";

export default function RootLayout() {
  useDrizzleStudio(SQLite.openDatabaseSync("myDatabase.db"));
  const [dialogV, setDialogV] = useState(false);
  const [dialogC, setDialogC] = useState("");
  try {
    return (
      <>
        <PaperProvider>
          <ThemeProvider
            theme={{
              ...MD3LightTheme,
              colors: {
                primary: "rgb(132, 84, 0)",
                onPrimary: "rgb(255, 255, 255)",
                primaryContainer: "rgb(255, 221, 183)",
                onPrimaryContainer: "rgb(42, 23, 0)",
                secondary: "rgb(120, 90, 0)",
                onSecondary: "rgb(255, 255, 255)",
                secondaryContainer: "rgb(255, 223, 156)",
                onSecondaryContainer: "rgb(37, 26, 0)",
                tertiary: "rgb(105, 95, 0)",
                onTertiary: "rgb(255, 255, 255)",
                tertiaryContainer: "rgb(245, 229, 104)",
                onTertiaryContainer: "rgb(32, 28, 0)",
                error: "rgb(186, 26, 26)",
                onError: "rgb(255, 255, 255)",
                errorContainer: "rgb(255, 218, 214)",
                onErrorContainer: "rgb(65, 0, 2)",
                background: "rgb(255, 251, 255)",
                onBackground: "rgb(31, 27, 22)",
                surface: "rgb(255, 251, 255)",
                onSurface: "rgb(31, 27, 22)",
                surfaceVariant: "rgb(240, 224, 208)",
                onSurfaceVariant: "rgb(80, 69, 57)",
                outline: "rgb(130, 117, 104)",
                outlineVariant: "rgb(212, 196, 180)",
                shadow: "rgb(0, 0, 0)",
                scrim: "rgb(0, 0, 0)",
                inverseSurface: "rgb(53, 47, 42)",
                inverseOnSurface: "rgb(249, 239, 231)",
                inversePrimary: "rgb(255, 185, 91)",
                elevation: {
                  level0: "transparent",
                  level1: "rgb(249, 243, 242)",
                  level2: "rgb(245, 238, 235)",
                  level3: "rgb(242, 233, 227)",
                  level4: "rgb(240, 231, 224)",
                  level5: "rgb(238, 228, 219)",
                },
                surfaceDisabled: "rgba(31, 27, 22, 0.12)",
                onSurfaceDisabled: "rgba(31, 27, 22, 0.38)",
                backdrop: "rgba(56, 47, 36, 0.4)",
              },
            }}
          >
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="addPage" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <Portal>
              <Dialog visible={dialogV} onDismiss={() => setDialogV(false)}>
                <Dialog.Content>
                  <Text>{dialogC}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => setDialogV(false)}>ok</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </ThemeProvider>
        </PaperProvider>
        {/* eslint-disable-next-line react/style-prop-object */}
        <StatusBar style="auto" />
      </>
    );
  } catch (e) {
    if (e instanceof Error) {
      setDialogC(e.message);
    }
    console.log(e);
  }
}
