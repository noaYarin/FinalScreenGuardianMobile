import React from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { useSelector } from "react-redux";

import { selectChildPalette } from "@/src/redux/slices/child-theme-slice";
import { APP_COLORS } from "@/constants/theme";

function ThemedChildStack() {
  const palette = useSelector(selectChildPalette);

  return (
    <View style={{ flex: 1, backgroundColor: APP_COLORS.screenBg }}>
      <Stack
        screenOptions={{
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: palette.headerBg },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { color: "#FFFFFF", fontWeight: "800" },
          contentStyle: { backgroundColor: APP_COLORS.screenBg },
        }}
      />
    </View>
  );
}

export default function ChildLayout() {
  return <ThemedChildStack />;
}
