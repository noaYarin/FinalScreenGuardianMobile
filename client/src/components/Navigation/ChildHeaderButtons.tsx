import React from "react";
import { Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "@/src/components/AppText/AppText";
import { styles } from "./ChildHeaderButtons.styles";

type Props = {
  onPress: () => void;
};

type NotificationsButtonProps = Props & {
  unreadCount?: number;
};

export function ChildChatbotHeaderButton({ onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Open chatbot"
      hitSlop={10}
      style={({ pressed }) => [
        styles.leftButton,
        pressed ? styles.pressed : null,
      ]}
    >
      <MaterialCommunityIcons name="robot" size={20} color="#FFFFFF" />
    </Pressable>
  );
}

export function ChildNotificationsHeaderButton({
  onPress,
  unreadCount = 0,
}: NotificationsButtonProps) {
  const hasUnread = unreadCount > 0;
  const badgeText = unreadCount > 9 ? "9+" : String(unreadCount);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={
        hasUnread
          ? `Open notifications, ${badgeText} unread`
          : "Open notifications"
      }
      hitSlop={10}
      style={({ pressed }) => [
        styles.rightButton,
        pressed ? styles.pressed : null,
      ]}
    >
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name="bell-outline" size={20} color="#FFFFFF" />

        {hasUnread && (
          <View style={styles.badge}>
            <AppText weight="extraBold" style={styles.badgeText}>
              {badgeText}
            </AppText>
          </View>
        )}
      </View>
    </Pressable>
  );
}