import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "./Context/AuthProvider";

export { ErrorBoundary } from "expo-router";

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

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

// Splash screen component
function SplashScreenComponent() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
      }}
    >
      <ActivityIndicator size="large" color="#F4C430" />
    </View>
  );
}

function RootLayoutNav() {
  const { isLoading, isAuthenticated } = useAuth();

  // Show splash screen while checking auth status
  if (isLoading) {
    return <SplashScreenComponent />;
  }

  return (
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName={isAuthenticated ? "(tabs)" : "Authentication/Welcome"}
    >
      {/* If authenticated, show main app */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="Pages/ServiceDetails"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Pages/ServicesHistory"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Pages/EditAccountInfo"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Pages/RateService"
        options={{
          title: "Rate This Service",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Authentication/Welcome"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Authentication/Register"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Authentication/Login"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
