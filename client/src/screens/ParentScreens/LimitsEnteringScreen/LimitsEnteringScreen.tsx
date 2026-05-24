import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

type LimitItem = {
  key: string;
  label: string;
  description?: string;
  accessibilityLabel: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  route?: string;
};

type LimitSection = {
  key: string;
  title: string;
  items: LimitItem[];
};

const LIMIT_SECTIONS: LimitSection[] = [
  {
    key: "screenTime",
    title: "Screen Time",
    items: [
      {
        key: "daily",
        label: "Daily Limits",
        description: "Limit total screen time per day.",
        accessibilityLabel: "Go to daily limits screen",
        icon: "clock-time-four-outline",
        route: "/Parent/dailyTimeLimits",
      },
      {
        key: "weekly",
        label: "Weekly Limits",
        description: "Limit total screen time across the week.",
        accessibilityLabel: "Go to weekly limits screen",
        icon: "calendar-week-outline",
        route: "/Parent/weeklyLimits",
      },
      {
        key: "schedule",
        label: "Weekly Schedule",
        description: "Block screen time during specific days and hours.",
        accessibilityLabel: "Go to weekly schedule limits screen",
        icon: "calendar-clock-outline",
        route: "/Parent/routineLimits",
      },
    ],
  },
  {
    key: "apps",
    title: "Apps",
    items: [
      {
        key: "blockedApps",
        label: "Blocked Apps",
        description: "Manage apps that should not be allowed.",
        accessibilityLabel: "Go to app blocking screen",
        icon: "cellphone-lock",
        route: "/Parent/appBlocking",
      },
    ],
  },
];

export default function LimitsScreen() {
  const onPressItem = (route?: string) => {
    if (!route) return;
    router.push(route as never);
  };

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.introCard}>
            <AppText weight="extraBold" style={styles.introTitle}>
              Manage Limits
            </AppText>

            <AppText weight="medium" style={styles.introSubtitle}>
              Choose which type of limit you want to manage. The selected child
              and device will be checked inside each limit screen.
            </AppText>

            <View style={styles.activeLimitInfoBox}>
              <View style={styles.activeLimitInfoHeader}>
                <MaterialCommunityIcons
                  name="information-outline"
                  size={18}
                  color="#2563EB"
                />

                <AppText weight="extraBold" style={styles.activeLimitInfoTitle}>
                  One automatic limit per device
                </AppText>
              </View>

              <AppText weight="medium" style={styles.activeLimitInfoText}>
                Daily Limits, Weekly Limits, and Weekly Schedule cannot be active
                together on the same device. If one is already active, the other
                automatic options will be unavailable inside the relevant screen
                until you turn the active one off.
              </AppText>
            </View>
          </View>

          {LIMIT_SECTIONS.map((section) => (
            <View key={section.key} style={styles.sectionBlock}>
              <AppText weight="bold" style={styles.sectionTitle}>
                {section.title}
              </AppText>

              <View style={styles.groupCard}>
                {section.items.map((item, index) => {
                  const isLast = index === section.items.length - 1;
                  const isPressable = Boolean(item.route);

                  return (
                    <Pressable
                      key={item.key}
                      onPress={() => onPressItem(item.route)}
                      disabled={!isPressable}
                      accessibilityRole="button"
                      accessibilityLabel={item.accessibilityLabel}
                      style={({ pressed }) => [
                        styles.rowButton,
                        !isLast && styles.rowDivider,
                        pressed && isPressable && styles.rowPressed,
                        !isPressable && { opacity: 0.45 },
                      ]}
                    >
                      <View style={styles.rowContent}>
                        <View style={styles.rowMain}>
                          <View style={styles.iconWrap}>
                            <MaterialCommunityIcons
                              name={item.icon}
                              size={20}
                              color="#3B82F6"
                            />
                          </View>

                          <View style={styles.textWrap}>
                            <AppText
                              weight="bold"
                              style={[
                                styles.rowTitle,
                                !isPressable && styles.rowTitleDisabled,
                              ]}
                            >
                              {item.label}
                            </AppText>

                            {item.description ? (
                              <AppText
                                weight="medium"
                                style={[
                                  styles.rowDescription,
                                  !isPressable &&
                                    styles.rowDescriptionDisabled,
                                ]}
                              >
                                {item.description}
                              </AppText>
                            ) : null}
                          </View>
                        </View>

                        <View style={styles.rowEnd}>
                          {isPressable ? (
                            <MaterialCommunityIcons
                              name="chevron-right"
                              size={22}
                              color="#94A3B8"
                            />
                          ) : (
                            <AppText weight="medium" style={styles.soonText}>
                              Coming soon
                            </AppText>
                          )}
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}