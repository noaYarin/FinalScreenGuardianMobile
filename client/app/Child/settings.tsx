import React from "react";
import { Stack } from "expo-router";

import ChildSettingsScreen from "@/src/screens/ChildrenScreens/ChildSettingsScreen/ChildSettingsScreen";

export default function ChildSettingsRoute() {
  return (
    <>
      <Stack.Screen options={{ title: "Settings" }} />
      <ChildSettingsScreen />
    </>
  );
}
