import React from "react";
import { Stack, router, type Href } from "expo-router";

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
          headerLeft: () => (
            <ChildChatbotHeaderButton
              onPress={() => router.push("/Child/chatbot" as Href)}
            />
          ),
          headerRight: () => (
            <ChildNotificationsHeaderButton
              onPress={() => router.push("/Child/notifications" as Href)}
            />
          ),
        }}
      />
      <HomeScreen />
    </>
  );
}