import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

import type { AppDispatch, RootState } from "@/src/redux/store/types";
import { fetchParentHomeSummaryThunk } from "@/src/redux/thunks/parentHomeThunks";

type AutomaticLimitKey = "daily" | "weekly" | "schedule";

type LimitItem = {
  key: string;
  label: string;
  description?: string;
  accessibilityLabel: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  route?: string;
  automaticLimitKey?: AutomaticLimitKey;
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
        description: "Set usage duration by day.",
        accessibilityLabel: "Go to daily limits screen",
        icon: "clock-time-four-outline",
        route: "/Parent/dailyTimeLimits",
        automaticLimitKey: "daily",
      },
      {
        key: "weekly",
        label: "Weekly Limits",
        description: "Set usage duration by week.",
        accessibilityLabel: "Go to weekly limits screen",
        icon: "calendar-week-outline",
        route: "/Parent/weeklyLimits",
        automaticLimitKey: "weekly",
      },
      {
        key: "schedule",
        label: "Weekly Schedule",
        description: "Set blocked time windows by day.",
        accessibilityLabel: "Go to weekly schedule limits screen",
        icon: "calendar-clock-outline",
        route: "/Parent/routineLimits",
        automaticLimitKey: "schedule",
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

function getActiveAutomaticLimitLabel(limitKey: AutomaticLimitKey | null) {
  if (limitKey === "daily") return "Daily Limits";
  if (limitKey === "weekly") return "Weekly Limits";
  if (limitKey === "schedule") return "Weekly Schedule";
  return null;
}

export default function LimitsScreen() {
  const dispatch = useDispatch<AppDispatch>();

  const childrenSummary = useSelector(
    (state: RootState) => state.parentHome.childrenSummary
  );

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchParentHomeSummaryThunk());
    }, [dispatch])
  );

  const activeAutomaticLimitKey = React.useMemo<AutomaticLimitKey | null>(() => {
    const activeChild = childrenSummary.find(
      (child) =>
        child.isLimitEnabled === true &&
        (child.limitMode === "DAILY" ||
          child.limitMode === "WEEKLY" ||
          child.limitMode === "SCHEDULE")
    );

    if (!activeChild) return null;

    if (activeChild.limitMode === "DAILY") return "daily";
    if (activeChild.limitMode === "WEEKLY") return "weekly";
    if (activeChild.limitMode === "SCHEDULE") return "schedule";

    return null;
  }, [childrenSummary]);

  const activeAutomaticLimitLabel =
    getActiveAutomaticLimitLabel(activeAutomaticLimitKey);

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
              Set screen time, schedules, and app restrictions in a clean and
              structured way.
            </AppText>

            <AppText weight="extraBold" style={styles.introSubtitle}>
              ⚠️ Only one automatic screen-time limit can be active at a time:
              daily, weekly, or weekly schedule.
            </AppText>

            {activeAutomaticLimitLabel ? (
              <AppText weight="medium" style={styles.introSubtitle}>
                Current active automatic limit: {activeAutomaticLimitLabel}.
                Turn it off before enabling another automatic limit.
              </AppText>
            ) : null}
          </View>

          {LIMIT_SECTIONS.map((section) => (
            <View key={section.key} style={styles.sectionBlock}>
              <AppText weight="bold" style={styles.sectionTitle}>
                {section.title}
              </AppText>

              <View style={styles.groupCard}>
                {section.items.map((item, index) => {
                  const isLast = index === section.items.length - 1;

                  const isBlockedByAnotherAutomaticLimit =
                    item.automaticLimitKey != null &&
                    activeAutomaticLimitKey != null &&
                    item.automaticLimitKey !== activeAutomaticLimitKey;

                  const isPressable =
                    Boolean(item.route) && !isBlockedByAnotherAutomaticLimit;

                  const description = isBlockedByAnotherAutomaticLimit
                    ? `Only one automatic limit can be active. Turn off ${activeAutomaticLimitLabel} first.`
                    : item.description;

                  return (
                    <Pressable
                      key={item.key}
                      onPress={() => onPressItem(item.route)}
                      disabled={!isPressable}
                      accessibilityRole="button"
                      accessibilityLabel={
                        isBlockedByAnotherAutomaticLimit
                          ? `${item.label} is locked because ${activeAutomaticLimitLabel} are active`
                          : item.accessibilityLabel
                      }
                      style={({ pressed }) => [
                        styles.rowButton,
                        !isLast && styles.rowDivider,
                        pressed && isPressable && styles.rowPressed,
                        isBlockedByAnotherAutomaticLimit && { opacity: 0.82 },
                        !item.route && { opacity: 0.45 },
                      ]}
                    >
                      <View style={styles.rowContent}>
                        <View style={styles.rowMain}>
                          <View style={styles.iconWrap}>
                            <MaterialCommunityIcons
                              name={item.icon}
                              size={20}
                              color={
                                isBlockedByAnotherAutomaticLimit
                                  ? "#64748B"
                                  : "#3B82F6"
                              }
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

                            {description ? (
                              <AppText
                                weight={
                                  isBlockedByAnotherAutomaticLimit
                                    ? "bold"
                                    : "medium"
                                }
                                style={[
                                  styles.rowDescription,
                                  !isPressable &&
                                    styles.rowDescriptionDisabled,
                                ]}
                              >
                                {description}
                              </AppText>
                            ) : null}
                          </View>
                        </View>

                        <View style={styles.rowEnd}>
                          {isBlockedByAnotherAutomaticLimit ? (
                            <AppText weight="extraBold" style={styles.soonText}>
                              Locked
                            </AppText>
                          ) : isPressable ? (
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