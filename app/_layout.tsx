import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import * as Notifications from "expo-notifications";
import { useColorScheme } from "@/components/useColorScheme";
import notifee from "@notifee/react-native";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "/login/login",
};

SplashScreen.preventAutoHideAsync();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification } = detail;

  // 1. Double check that both the notification and its ID exist
  if (notification && notification.id && notification.data?.endDate) {
    const rawEndDate = notification.data.endDate;
    const endDateString =
      typeof rawEndDate === "string" ? rawEndDate : String(rawEndDate || "");

    const endDateTimestamp = parseInt(endDateString, 10);
    const now = Date.now();

    // 2. Safely process the date check
    if (!isNaN(endDateTimestamp) && now > endDateTimestamp) {
      console.log(
        `Medication period ended for alarm ${notification.id}. Cancelling future repeats.`,
      );

      // TypeScript is now happy because we proved notification.id exists inside the 'if' condition
      await notifee.cancelNotification(notification.id);
    }
  }
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="login/login">
        <Stack.Screen name="login/login" options={{ headerShown: false }} />
        <Stack.Screen name="signup/signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </ThemeProvider>
  );
}
