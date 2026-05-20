import { Stack } from "expo-router";

import AppsScreen from "@/src/screens/ChildrenScreens/AppsScreen/AppsScreen";

export default function AppsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "My Apps",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <AppsScreen />
    </>
  );
}