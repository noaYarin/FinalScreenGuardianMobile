import React from "react";
import { Stack, router, type Href } from "expo-router";
import { APP_COLORS, COLORS } from "@/constants/theme";
import { showInfoToast } from "@/src/utils/appToast";

import HomeScreen from "@/src/screens/ChildrenScreens/HomeScreenChild/HomeScreen";
import {
  ChildChatbotHeaderButton,
  ChildNotificationsHeaderButton,
} from "@/src/components/Navigation/ChildHeaderButtons";

export default function ChildHomeRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "",
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerBackVisible: false,
          headerStyle: { backgroundColor: APP_COLORS.primaryBlue },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { color: "#FFFFFF" },
          contentStyle: { backgroundColor: COLORS.light.tint },
          headerLeft: () => (
            <ChildChatbotHeaderButton
              onPress={() => router.push("/Child/chatbot" as Href)}
            />
          ),
          headerRight: () => (
            <ChildNotificationsHeaderButton
              onPress={() => showInfoToast("No notifications yet", "Notifications")}
            />
          ),
        }}
      />
      <HomeScreen />
    </>
  );
}