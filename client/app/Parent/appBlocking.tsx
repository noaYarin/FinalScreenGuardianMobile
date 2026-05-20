import { Stack } from "expo-router";

import AppBlockingScreen from "@/src/screens/ParentScreens/AppBlockingScreen/AppBlockingScreen";

export default function AppBlockingRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "App Blocking",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <AppBlockingScreen />
    </>
  );
}