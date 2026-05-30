import React from "react";
import { Stack } from "expo-router";
import { APP_COLORS } from "@/constants/theme";
import { RoleSelectionScreen } from "../../src/screens/EnteringScreens/RoleSelectionScreen/RoleSelectionScreen";

export default function RoleSelectionRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "",
          headerShadowVisible: false,
          contentStyle: { backgroundColor: APP_COLORS.screenBg },
        }}
      />
      <RoleSelectionScreen />
    </>
  );
}