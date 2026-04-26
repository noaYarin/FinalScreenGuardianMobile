import React from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { styles } from "./ParentHeaderButtons.styles";

export function ParentMenuHeaderButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Open menu"
      hitSlop={10}
      style={({ pressed }) => [
        styles.iconButtonLeft,
        pressed ? styles.pressed : null,
      ]}
    >
      <MaterialCommunityIcons name="menu" size={26} color="#0F172A" />
    </Pressable>
  );
}

export function ParentNotificationsHeaderButton({
  onPress,
  unreadCount,
}: {
  onPress: () => void;
  unreadCount: number;
}) {
  const showBadge = unreadCount > 0;
  const badgeText = unreadCount > 99 ? "99+" : String(unreadCount);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Open notifications"
      hitSlop={10}
      style={({ pressed }) => [
        styles.iconButtonRight,
        pressed ? styles.pressed : null,
      ]}
    >
      <View style={styles.bellIconBox}>
        <MaterialCommunityIcons name="bell-outline" size={26} color="#0F172A" />
        {showBadge ? (
          <View style={styles.bellBadge}>
            <Text style={styles.bellBadgeText} numberOfLines={1}>
              {badgeText}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

