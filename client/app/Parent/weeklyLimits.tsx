import { Stack } from "expo-router";

import WeeklyScheduleScreen from "@/src/screens/ParentScreens/WeeklyScheduleScreen/WeeklyScheduleScreen";

export default function WeeklyScheduleRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Weekly Schedule",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <WeeklyScheduleScreen />
    </>
  );
}