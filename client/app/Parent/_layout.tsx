import React from "react";
import { Stack } from "expo-router";
import { COLORS, APP_COLORS } from "@/constants/theme";

export default function ParentRootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerBackButtonDisplayMode: "minimal",
        contentStyle: {
          flex: 1,
          backgroundColor: APP_COLORS.screenBg,
        },
        headerStyle: {
          backgroundColor: COLORS.light.tint,
        },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="addChild"
        options={{
          title: "Add Child",
        }}
      />

      <Stack.Screen
        name="childDetails"
        options={{
          title: "Child Details",
        }}
      />

      <Stack.Screen
        name="childProfile"
        options={{
          title: "Child Profile",
        }}
      />

      <Stack.Screen
        name="editChildProfile"
        options={{
          title: "Edit Child Profile",
        }}
      />

      <Stack.Screen
        name="childLocation"
        options={{
          title: "Child Location",
        }}
      />



      <Stack.Screen
        name="linkDevice"
        options={{
          title: "Connect Device",
        }}
      />

      <Stack.Screen
        name="systemAlerts"
        options={{
          title: "System Alerts",
        }}
      />

      <Stack.Screen
        name="generateReport"
        options={{
          title: "Generate report",
        }}
      />

      <Stack.Screen
        name="analyticsReport"
        options={{
          title: "Usage report",
        }}
      />
    </Stack>
  );
}