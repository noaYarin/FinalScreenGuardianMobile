import React from "react";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { styles } from "./ChildHeaderButtons.styles";

type Props = {
  onPress: () => void;
};

export function ChildChatbotHeaderButton({ onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Open chatbot"
      hitSlop={10}
      style={({ pressed }) => [styles.leftButton, pressed ? styles.pressed : null]}
    >
      <MaterialCommunityIcons name="robot" size={20} color="#FFFFFF" />
    </Pressable>
  );
}

export function ChildNotificationsHeaderButton({ onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Open notifications"
      hitSlop={10}
      style={({ pressed }) => [styles.rightButton, pressed ? styles.pressed : null]}
    >
      <MaterialCommunityIcons name="bell-outline" size={20} color="#FFFFFF" />
    </Pressable>
  );
}

