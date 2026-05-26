import React from "react";
import { Tabs, router, type Href } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { RootState } from "@/src/redux/store/types";
import {
  ParentMenuHeaderButton,
  ParentNotificationsHeaderButton,
} from "@/src/components/Navigation/ParentHeaderButtons";

export default function ParentTabsLayout() {
  const insets = useSafeAreaInsets();

  const unreadNotificationsCount = useSelector((state: RootState) => {
    const parentId = state.auth.parentId;

    return state.notifications.items.filter(
      (notification) =>
        notification.targetRole === "PARENT" &&
        String(notification.parentId) === String(parentId) &&
        !notification.isRead
    ).length;
  });

  return (
    <Tabs
      screenOptions={() => {
        return {
          sceneContainerStyle: {
            backgroundColor: COLORS.light.background,
          },

          headerStyle: {
            backgroundColor: COLORS.light.tint,
          },

          title: "",
          headerTitle: "",

          tabBarShowLabel: true,

          tabBarStyle: {
            height: 72 + insets.bottom,
            paddingTop: 8,
            paddingBottom: Math.max(insets.bottom, 10),
            borderTopWidth: 1,
            borderTopColor: "#E7EFFA",
            backgroundColor: "#FFFFFF",
          },

          tabBarLabelStyle: {
            fontSize: 12,
          },

          tabBarActiveTintColor: COLORS.light.primary,
          tabBarInactiveTintColor: COLORS.light.tabIconDefault,

          headerTitleAlign: "center",
          headerShadowVisible: false,

          headerLeft: () => (
            <ParentMenuHeaderButton
              onPress={() => router.push("/Parent/homeMenu" as Href)}
            />
          ),

          headerRight: () => (
            <ParentNotificationsHeaderButton
              onPress={() => router.push("/Parent/systemAlerts" as Href)}
              unreadCount={unreadNotificationsCount}
            />
          ),
        };
      }}
    >
      <Tabs.Screen
        name="children"
        options={{
          tabBarLabel: "Children",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-group-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="limitsEntering"
        options={{
          tabBarLabel: "Limits",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="clock-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          tabBarLabel: "Reports",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chart-bar"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="cog-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}