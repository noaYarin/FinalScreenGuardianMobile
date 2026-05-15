import React from "react";
import { Stack } from "expo-router";

import AchievementsScreen from "@/src/screens/ChildrenScreens/AchievementsScreen/AchievementsScreen";

export default function AchievementsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Achievements",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <AchievementsScreen />
    </>
  );
}
