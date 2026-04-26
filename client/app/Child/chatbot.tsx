import React from "react";
import { Stack } from "expo-router";
import ChatbotScreen from "@/src/components/Chatbot/ChatbotScreen";
import { APP_COLORS, COLORS } from "@/constants/theme";

export default function ChildChatbotRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Chatbot",
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: APP_COLORS.primaryBlue },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { color: "#FFFFFF" },
          contentStyle: { backgroundColor: COLORS.light.tint },
        }}
      />
      <ChatbotScreen role="CHILD" />
    </>
  );
}

