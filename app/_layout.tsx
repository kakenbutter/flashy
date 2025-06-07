import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
// import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function Layout() {
  const colorScheme = useColorScheme();

  /*
    example code to load new font
    maybe has use later?

    const [loaded] = useFonts({
      YourFont: require("../assets/directory/to/your/font.ttf"),
    });

    if (!loaded) {
      return null;
    }
  */

  return (
    <KeyboardProvider>
      <ActionSheetProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen
              name="onboarding/index"
              options={{ presentation: "modal", headerShown: false }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </ActionSheetProvider>
    </KeyboardProvider>
  );
}
