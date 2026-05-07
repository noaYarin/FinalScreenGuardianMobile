import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, View, useWindowDimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

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

const STATIC_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    type: "time",
    title: "Screen time reminder",
    message: "You have 15 minutes left today. Great job staying balanced.",
    timeLabel: "Now",
    icon: "timer-sand",
    isNew: true,
  },
  {
    id: "2",
    type: "reward",
    title: "Coins added",
    message: "You earned 20 familyCoins for completing a task.",
    timeLabel: "10 min ago",
    icon: "star-circle",
    isNew: true,
  },
  {
    id: "3",
    type: "task",
    title: "Task approved",
    message: "Your parent approved your completed task.",
    timeLabel: "Today",
    icon: "check-circle-outline",
    isNew: false,
  },
  {
    id: "4",
    type: "time",
    title: "Healthy break idea",
    message: "Take a short break, drink water, or stretch for a few minutes.",
    timeLabel: "Yesterday",
    icon: "heart-outline",
    isNew: false,
  },
];

export default function NotificationsScreen() {
  const { width } = useWindowDimensions();
  const [selectedFilter, setSelectedFilter] = useState<NotificationType>("all");

  const isTablet = width >= 700;

  const filteredNotifications = useMemo(() => {
    if (selectedFilter === "all") {
      return STATIC_NOTIFICATIONS;
    }

    return STATIC_NOTIFICATIONS.filter((item) => item.type === selectedFilter);
  }, [selectedFilter]);

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
            {filteredNotifications.map((item) => (
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
                    <AppText weight="extraBold" style={styles.notificationTitle}>
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
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}