import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, ScrollView, View, useWindowDimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";
import type { AppDispatch, RootState } from "@/src/redux/store/types";
import type { Notification } from "@/src/api/notification";
import {
  fetchChildNotificationsThunk,
  markAllChildNotificationsReadThunk,
} from "@/src/redux/thunks/notificationThunks";

type NotificationType = "all" | "time" | "reward" | "task";

type NotificationItem = {
  id: string;
  type: Exclude<NotificationType, "all">;
  title: string;
  message: string;
  timeLabel: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  isNew: boolean;
};

const FILTERS: { id: NotificationType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "time", label: "Time" },
  { id: "reward", label: "Rewards" },
  { id: "task", label: "Tasks" },
];

function mapNotificationType(type: string): Exclude<NotificationType, "all"> {
  const normalized = String(type).toUpperCase();

  if (
    normalized.includes("SCREEN_TIME") ||
    normalized.includes("DEVICE_LOCKED") ||
    normalized.includes("DEVICE_UNLOCKED") ||
    normalized.includes("EXTENSION_REQUEST")
  ) {
    return "time";
  }

  if (
    normalized.includes("REWARD") ||
    normalized.includes("COIN") ||
    normalized.includes("ACHIEVEMENT")
  ) {
    return "reward";
  }

  if (normalized.includes("TASK")) {
    return "task";
  }

  return "time";
}

function getNotificationIcon(
  type: string
): keyof typeof MaterialCommunityIcons.glyphMap {
  const normalized = String(type).toUpperCase();

  if (normalized.includes("TASK_APPROVED")) return "check-circle-outline";
  if (normalized.includes("TASK")) return "clipboard-check-outline";
  if (normalized.includes("ACHIEVEMENT")) return "trophy";
  if (normalized.includes("REWARD") || normalized.includes("COIN")) {
    return "star-circle";
  }
  if (normalized.includes("LOCK")) return "lock-outline";
  if (normalized.includes("EXTENSION")) return "clock-plus-outline";
  if (normalized.includes("SCREEN_TIME")) return "timer-sand";

  return "bell-ring-outline";
}

function getTimeLabel(createdAt?: string) {
  if (!createdAt) return "Just now";

  const createdDate = new Date(createdAt);
  const createdTime = createdDate.getTime();

  if (Number.isNaN(createdTime)) return "Just now";

  const diffMs = Date.now() - createdTime;
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";

  if (diffMinutes < 60) {
    return diffMinutes === 1 ? "1 min ago" : `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays === 1) return "Yesterday";

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  return createdDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function mapNotificationToItem(notification: Notification): NotificationItem {
  return {
    id: String(notification._id),
    type: mapNotificationType(notification.type),
    title: notification.title || "New notification",
    message: notification.description || "",
    timeLabel: getTimeLabel(notification.createdAt),
    icon: getNotificationIcon(notification.type),
    isNew: !notification.isRead,
  };
}

export default function NotificationsScreen() {
  const dispatch = useDispatch<AppDispatch>();

  const { width } = useWindowDimensions();
  const [selectedFilter, setSelectedFilter] = useState<NotificationType>("all");

  const isTablet = width >= 700;

  const activeChildId = useSelector(
    (state: RootState) => state.auth.activeChildId
  );

  const notifications = useSelector(
    (state: RootState) => state.notifications.items
  );

  const hasUnreadChildNotifications = useMemo(() => {
    if (!activeChildId) return false;

    return notifications.some(
      (notification) =>
        notification.targetRole === "CHILD" &&
        String(notification.childId) === String(activeChildId) &&
        !notification.isRead
    );
  }, [activeChildId, notifications]);

  const hasUnreadChildNotificationsRef = useRef(false);

  useEffect(() => {
    hasUnreadChildNotificationsRef.current = hasUnreadChildNotifications;
  }, [hasUnreadChildNotifications]);

  useFocusEffect(
    useCallback(() => {
      if (!activeChildId) return;

      dispatch(fetchChildNotificationsThunk({ page: 1, limit: 30 }));

      return () => {
        if (!hasUnreadChildNotificationsRef.current) return;

        dispatch(markAllChildNotificationsReadThunk());
        hasUnreadChildNotificationsRef.current = false;
      };
    }, [dispatch, activeChildId])
  );
  
  const childNotifications = useMemo(() => {
    return notifications
      .filter((notification) => {
        const isChildNotification = notification.targetRole === "CHILD";

        const belongsToCurrentChild =
          !notification.childId ||
          !activeChildId ||
          String(notification.childId) === String(activeChildId);

        return isChildNotification && belongsToCurrentChild;
      })
      .map(mapNotificationToItem);
  }, [notifications, activeChildId]);

  const filteredNotifications = useMemo(() => {
    if (selectedFilter === "all") {
      return childNotifications;
    }

    return childNotifications.filter((item) => item.type === selectedFilter);
  }, [selectedFilter, childNotifications]);

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, isTablet && styles.tabletContainer]}>
          <View style={styles.heroCard}>
            <View style={styles.heroIconWrap}>
              <MaterialCommunityIcons
                name="bell-ring-outline"
                size={34}
                color="#2563EB"
              />
            </View>

            <View style={styles.heroTextBlock}>
              <AppText weight="extraBold" style={styles.title}>
                Notifications
              </AppText>

              <AppText weight="medium" style={styles.subtitle}>
                Helpful updates about your screen time, tasks, and rewards.
              </AppText>
            </View>
          </View>

          <View style={styles.filtersRow}>
            {FILTERS.map((filter) => {
              const isSelected = selectedFilter === filter.id;

              return (
                <Pressable
                  key={filter.id}
                  onPress={() => setSelectedFilter(filter.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Show ${filter.label} notifications`}
                  style={[
                    styles.filterChip,
                    isSelected && styles.filterChipSelected,
                  ]}
                >
                  <AppText
                    weight="bold"
                    style={[
                      styles.filterText,
                      isSelected && styles.filterTextSelected,
                    ]}
                  >
                    {filter.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.list}>
            {filteredNotifications.length === 0 ? (
              <View style={styles.notificationCard}>
                <View style={styles.notificationIconWrap}>
                  <MaterialCommunityIcons
                    name="bell-sleep-outline"
                    size={26}
                    color="#2563EB"
                  />
                </View>

                <View style={styles.notificationContent}>
                  <AppText weight="extraBold" style={styles.notificationTitle}>
                    No notifications yet
                  </AppText>

                  <AppText weight="medium" style={styles.notificationMessage}>
                    New updates about tasks, rewards, and screen time will
                    appear here.
                  </AppText>
                </View>
              </View>
            ) : (
              filteredNotifications.map((item) => (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.title}. ${item.message}`}
                  style={styles.notificationCard}
                >
                  <View style={styles.notificationIconWrap}>
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={26}
                      color="#2563EB"
                    />
                  </View>

                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <AppText
                        weight="extraBold"
                        style={styles.notificationTitle}
                      >
                        {item.title}
                      </AppText>

                      {item.isNew && (
                        <View style={styles.newBadge}>
                          <AppText weight="bold" style={styles.newBadgeText}>
                            New
                          </AppText>
                        </View>
                      )}
                    </View>

                    <AppText weight="medium" style={styles.notificationMessage}>
                      {item.message}
                    </AppText>

                    <AppText weight="medium" style={styles.timeLabel}>
                      {item.timeLabel}
                    </AppText>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}