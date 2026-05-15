import React from "react";
import { Stack, router, type Href } from "expo-router";
import { useSelector } from "react-redux";
import HomeScreen from "@/src/screens/ChildrenScreens/HomeScreenChild/HomeScreen";
import {
  ChildChatbotHeaderButton,
  ChildNotificationsHeaderButton,
} from "@/src/components/Navigation/ChildHeaderButtons";
import type { RootState } from "@/src/redux/store/types";

export default function ChildHomeRoute() {
  const unreadChildNotificationsCount = useSelector((state: RootState) => {
    const activeChildId = state.auth.activeChildId;

    if (!activeChildId) return 0;

    return state.notifications.items.filter(
      (notification) =>
        notification.targetRole === "CHILD" &&
        String(notification.childId) === String(activeChildId) &&
        !notification.isRead
    ).length;
  });
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
              unreadCount={unreadChildNotificationsCount}

            />
          ),
        }}
      />
      <HomeScreen />
    </>
  );
}