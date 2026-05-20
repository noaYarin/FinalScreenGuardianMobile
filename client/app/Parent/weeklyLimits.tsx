import { Stack } from "expo-router";

import WeeklyTimeLimitsScreen from "@/src/screens/ParentScreens/WeeklyTimeLimitsScreen/WeeklyTimeLimitsScreen";

export default function WeeklyTimeLimitsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Weekly Time Limits",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <WeeklyTimeLimitsScreen />
    </>
  );
}