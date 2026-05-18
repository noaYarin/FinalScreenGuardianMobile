import { Stack } from "expo-router";

import LimitsScreen from "@/src/screens/ParentScreens/LimitsEnteringScreen/LimitsEnteringScreen";

export default function LimitsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Limits",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <LimitsScreen />
    </>
  );
}