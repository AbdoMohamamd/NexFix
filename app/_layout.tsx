import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Arimo-Bold": require("../assets/fonts/Arimo-Bold.ttf"),
    "Arimo-BoldItalic": require("../assets/fonts/Arimo-BoldItalic.ttf"),
    "Arimo-Italic": require("../assets/fonts/Arimo-Italic.ttf"),
    "Arimo-Medium": require("../assets/fonts/Arimo-Medium.ttf"),
    "Arimo-MediumItalic": require("../assets/fonts/Arimo-MediumItalic.ttf"),
    "Arimo-Regular": require("../assets/fonts/Arimo-Regular.ttf"),
    "Arimo-SemiBold": require("../assets/fonts/Arimo-SemiBold.ttf"),
    "Arimo-SemiBoldItalic": require("../assets/fonts/Arimo-SemiBoldItalic.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

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
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="Authentication/Welcome" // Fixed: "Authenticatoin" → "Authentication"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Authentication/Register" // Fixed
        options={{ title: "Create Account", headerStyle: {} }}
      />
      <Stack.Screen
        name="Authentication/Login" // Fixed and removed .tsx extension
        options={{ title: "Login" }}
      />

      <Stack.Screen
        name="Pages/ServiceDetails"
        options={{
          title: "Book Service",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Pages/ServicesHistory"
        options={{
          title: "Services History",
        }}
      />
      <Stack.Screen
        name="Pages/RateService"
        options={{
          title: "Rate This Service",
        }}
      />
    </Stack>
  );
}
