import React from "react";
import { Stack } from "expo-router";

import AchievementsScreen from "@/src/screens/ChildrenScreens/AchievementsScreen/AchievementsScreen";
import { APP_COLORS, COLORS } from "@/constants/theme";

export default function AchievementsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Achievements",
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: APP_COLORS.primaryBlue },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { color: "#FFFFFF" },
          contentStyle: { backgroundColor: COLORS.light.tint },
        }}
      />
      <AchievementsScreen />
    </>
  );
}