import React from "react";
import { Stack } from "expo-router";
import { APP_COLORS, COLORS } from "@/constants/theme";

import InterestsScreen from "@/src/screens/ChildrenScreens/InterestsScreen/InterestsScreen";

export default function ChildInterestsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Interests",
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: APP_COLORS.primaryBlue },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { color: "#FFFFFF" },
          contentStyle: { backgroundColor: COLORS.light.tint },
        }}
      />
      <InterestsScreen />
    </>
  );
}

