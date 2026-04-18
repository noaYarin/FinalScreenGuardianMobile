import React from "react";
import { Stack } from "expo-router";

import HomeScreen from "@/src/screens/ChildrenScreens/HomeScreenChild/HomeScreen";

export default function ChildHomeRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Home",
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerBackVisible: false,
        }}
      />
      <HomeScreen />
    </>
  );
}