import React from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { useSelector } from "react-redux";

import { selectChildPalette } from "@/src/redux/slices/child-theme-slice";
import { CHILD_HEADING } from "@/src/theme/childTypography";

function ThemedChildStack() {
  const palette = useSelector(selectChildPalette);

  return (
    <View style={{ flex: 1, backgroundColor: palette.screenBg }}>
      <Stack
        screenOptions={{
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: palette.headerBg },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { color: "#FFFFFF", ...CHILD_HEADING.h2 },
          contentStyle: { backgroundColor: palette.screenBg },
        }}
      />
    </View>
  );
}

export default function ChildLayout() {
  return <ThemedChildStack />;
}
