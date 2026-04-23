import React from "react";
import { Stack } from "expo-router";
import ChatbotScreen from "@/src/components/Chatbot/ChatbotScreen";

export default function ChildChatbotRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Chatbot",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <ChatbotScreen role="CHILD" />
    </>
  );
}

