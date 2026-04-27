import React from "react";
import { Stack } from "expo-router";
import { APP_COLORS, COLORS } from "@/constants/theme";

import IdeasScreen from "@/src/screens/ChildrenScreens/IdeasScreen/IdeasScreen";

export default function ChildIdeasRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Ideas",
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: APP_COLORS.primaryBlue },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { color: "#FFFFFF" },
          contentStyle: { backgroundColor: COLORS.light.tint },
        }}
      />
      <IdeasScreen />
    </>
  );
}

