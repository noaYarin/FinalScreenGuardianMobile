import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  useWindowDimensions,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import ChildDeviceSelector from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import AutomaticLimitUnavailableCard from "@/src/components/AutomaticLimitUnavailableCard/AutomaticLimitUnavailableCard";
import { RootState } from "../../../redux/store/types";
import { styles } from "./styles";

type DayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

type WeeklyDayConfig = {
  key: DayKey;
  startMinutes: number;
  endMinutes: number;
  enabled: boolean;
};

const STEP_MINUTES = 30;
const MIN_MINUTES = 0;
const MAX_MINUTES = 23 * 60 + 30;

const DAYS: Record<DayKey, { short: string; full: string }> = {
  sun: { short: "S", full: "Sunday" },
  mon: { short: "M", full: "Monday" },
  tue: { short: "T", full: "Tuesday" },
  wed: { short: "W", full: "Wednesday" },
  thu: { short: "T", full: "Thursday" },
  fri: { short: "F", full: "Friday" },
  sat: { short: "S", full: "Saturday" },
};

const INITIAL_WEEKLY_CONFIG: WeeklyDayConfig[] = [
  { key: "sun", startMinutes: 7 * 60, endMinutes: 17 * 60, enabled: true },
  { key: "mon", startMinutes: 7 * 60 + 30, endMinutes: 16 * 60, enabled: true },
  { key: "tue", startMinutes: 7 * 60, endMinutes: 16 * 60 + 30, enabled: true },
  { key: "wed", startMinutes: 8 * 60, endMinutes: 15 * 60, enabled: true },
  { key: "thu", startMinutes: 7 * 60, endMinutes: 17 * 60 + 30, enabled: true },
  { key: "fri", startMinutes: 9 * 60, endMinutes: 13 * 60, enabled: true },
  { key: "sat", startMinutes: 10 * 60, endMinutes: 12 * 60, enabled: false },
];

function formatTime(minutes: number) {
  const normalized = Math.max(MIN_MINUTES, Math.min(MAX_MINUTES, minutes));
  const hours24 = Math.floor(normalized / 60);
  const mins = normalized % 60;
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  return `${String(hours12).padStart(2, "0")}:${String(mins).padStart(
    2,
    "0"
  )} ${suffix}`;
}

function calculateDurationHours(startMinutes: number, endMinutes: number) {
  const diff = Math.max(0, endMinutes - startMinutes);
  const hours = diff / 60;
  return Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
}

function getChildId(child: any) {
  return String(child?.id || child?._id || "");
}

function getDeviceId(device: any) {
  return String(device?.deviceId || device?._id || device?.id || "");
}

function getDeviceName(device: any) {
  return device?.name || device?.deviceName || "Connected device";
}

export default function WeeklyScheduleScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;

  const scrollRef = useRef<ScrollView | null>(null);
  const cardsSectionOffsetRef = useRef(0);
  const sectionOffsetsRef = useRef<Record<DayKey, number>>({
    sun: 0,
    mon: 0,
    tue: 0,
    wed: 0,
    thu: 0,
    fri: 0,
    sat: 0,
  });

  const childrenList = useSelector(
    (state: RootState) => state.children.childrenList
  );

  const devicesByChild = useSelector(
    (state: RootState) => state.devices.byChildId
  );

  const [selectedChildId, setSelectedChildId] = useState("");
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [weeklyConfig, setWeeklyConfig] = useState<WeeklyDayConfig[]>(
    INITIAL_WEEKLY_CONFIG
  );
  const [activeDayKey, setActiveDayKey] = useState<DayKey>("sun");

  useEffect(() => {
    if (selectedChildId || childrenList.length === 0) return;

    const firstChildId = getChildId(childrenList[0]);
    setSelectedChildId(firstChildId);

    const firstDevice = devicesByChild[firstChildId]?.[0];
    setSelectedDeviceId(firstDevice ? getDeviceId(firstDevice) : "");
  }, [childrenList, devicesByChild, selectedChildId]);

  const selectedChild = useMemo(() => {
    return childrenList.find(
      (child: any) => getChildId(child) === selectedChildId
    );
  }, [childrenList, selectedChildId]);

  const selectedDevice = useMemo(() => {
    const childDevices = devicesByChild[selectedChildId] || [];

    return childDevices.find(
      (device: any) => getDeviceId(device) === selectedDeviceId
    );
  }, [devicesByChild, selectedChildId, selectedDeviceId]);

  const childName = selectedChild?.name || "Child";
  const deviceName = selectedDevice
    ? getDeviceName(selectedDevice)
    : "Connected device";

  const activeLimitMode =
    selectedDevice?.screenTime?.isLimitEnabled === true
      ? selectedDevice.screenTime?.limitMode ?? "DAILY"
      : "NONE";

  const isOtherAutomaticLimitActive =
    activeLimitMode === "DAILY" || activeLimitMode === "WEEKLY";

  const otherAutomaticLimitLabel =
    activeLimitMode === "DAILY"
      ? "Daily Limits"
      : activeLimitMode === "WEEKLY"
        ? "Weekly Limits"
        : null;

  const enabledDaysCount = weeklyConfig.filter((day) => day.enabled).length;

  const activeDaysTotalHours = weeklyConfig
    .filter((day) => day.enabled)
    .reduce(
      (sum, day) => sum + Math.max(0, day.endMinutes - day.startMinutes) / 60,
      0
    );

  const handleSelectChild = (childId: string) => {
    setSelectedChildId(childId);

    const childDevices = devicesByChild[childId] || [];
    const firstDevice = childDevices[0];

    setSelectedDeviceId(firstDevice ? getDeviceId(firstDevice) : "");
  };

  const handleScrollToDay = (dayKey: DayKey) => {
    setActiveDayKey(dayKey);

    requestAnimationFrame(() => {
      const cardsSectionY = cardsSectionOffsetRef.current;
      const dayY = sectionOffsetsRef.current[dayKey];

      scrollRef.current?.scrollTo({
        y: Math.max(0, cardsSectionY + dayY - 18),
        animated: true,
      });
    });
  };

  const toggleDayEnabled = (dayKey: DayKey) => {
    if (isOtherAutomaticLimitActive) return;

    setWeeklyConfig((prev) =>
      prev.map((day) =>
        day.key === dayKey ? { ...day, enabled: !day.enabled } : day
      )
    );
  };

  const updateTime = (
    dayKey: DayKey,
    field: "startMinutes" | "endMinutes",
    direction: "increase" | "decrease"
  ) => {
    if (isOtherAutomaticLimitActive) return;

    setWeeklyConfig((prev) =>
      prev.map((day) => {
        if (day.key !== dayKey) return day;

        const delta = direction === "increase" ? STEP_MINUTES : -STEP_MINUTES;
        const nextValue = Math.max(
          MIN_MINUTES,
          Math.min(MAX_MINUTES, day[field] + delta)
        );

        if (field === "startMinutes") {
          return {
            ...day,
            startMinutes: Math.max(
              MIN_MINUTES,
              Math.min(nextValue, day.endMinutes - STEP_MINUTES)
            ),
          };
        }

        return {
          ...day,
          endMinutes: Math.min(
            MAX_MINUTES,
            Math.max(nextValue, day.startMinutes + STEP_MINUTES)
          ),
        };
      })
    );
  };

  const copyActiveDayToAll = () => {
    if (isOtherAutomaticLimitActive) return;

    const sourceDay = weeklyConfig.find((day) => day.key === activeDayKey);
    if (!sourceDay) return;

    setWeeklyConfig((prev) =>
      prev.map((day) =>
        day.key === activeDayKey
          ? day
          : {
              ...day,
              startMinutes: sourceDay.startMinutes,
              endMinutes: sourceDay.endMinutes,
              enabled: sourceDay.enabled,
            }
      )
    );
  };

  const saveSchedule = () => {
    if (isOtherAutomaticLimitActive) {
      Alert.alert(
        "Weekly Schedule unavailable",
        `${otherAutomaticLimitLabel} are currently active on this device. Turn them off before enabling Weekly Schedule.`
      );
      return;
    }

    Alert.alert("Weekly Schedule", "Schedule saved");
  };

  return (
    <ScreenLayout>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.contentMaxWidth}>
            <ChildDeviceSelector
              selectedChildId={selectedChildId}
              selectedDeviceId={selectedDeviceId}
              onSelectChild={handleSelectChild}
              onSelectDevice={setSelectedDeviceId}
              showDevices={true}
            />

            {selectedDevice && isOtherAutomaticLimitActive ? (
              <AutomaticLimitUnavailableCard
                title="Weekly Schedule unavailable"
                activeLimitLabel={otherAutomaticLimitLabel}
                targetLimitLabel="Weekly Schedule"
              />
            ) : null}

            <View style={styles.heroCard}>
              <View style={styles.heroTopRow}>
                <View style={styles.heroIconWrap}>
                  <MaterialCommunityIcons
                    name="calendar-week"
                    size={24}
                    color="#2F6BFF"
                  />
                </View>

                <View style={styles.heroTextWrap}>
                  <AppText weight="extraBold" style={styles.heroTitle}>
                    Weekly Hour Limits
                  </AppText>

                  <AppText weight="medium" style={styles.heroSubtitle}>
                    {`Set allowed usage hours for ${childName} on ${deviceName}`}
                  </AppText>
                </View>
              </View>

              <View
                style={[
                  styles.heroStatsRow,
                  !isTablet && styles.heroStatsColumn,
                ]}
              >
                <View style={styles.statCard}>
                  <AppText weight="bold" style={styles.statLabel}>
                    Active days
                  </AppText>

                  <AppText weight="extraBold" style={styles.statValue}>
                    {enabledDaysCount}
                  </AppText>
                </View>

                <View style={styles.statCard}>
                  <AppText weight="bold" style={styles.statLabel}>
                    Weekly hours
                  </AppText>

                  <AppText weight="extraBold" style={styles.statValue}>
                    {activeDaysTotalHours}
                  </AppText>
                </View>
              </View>
            </View>

            <View
              style={[
                styles.daysRailSection,
                isOtherAutomaticLimitActive && { opacity: 0.55 },
              ]}
            >
              <View style={styles.sectionHeaderRow}>
                <AppText weight="extraBold" style={styles.sectionTitle}>
                  Quick jump by day
                </AppText>

                <AppText weight="medium" style={styles.sectionHint}>
                  Tap a day to scroll to its section
                </AppText>
              </View>

              <View style={styles.dayRailOuter}>
                <View style={styles.dayRailWrap}>
                  {weeklyConfig.map((day) => {
                    const isActive = activeDayKey === day.key;
                    const dayName = DAYS[day.key].full;

                    return (
                      <Pressable
                        key={day.key}
                        onPress={() => handleScrollToDay(day.key)}
                        disabled={isOtherAutomaticLimitActive}
                        accessibilityRole="button"
                        accessibilityLabel={`Jump to ${dayName}`}
                        accessibilityState={{ selected: isActive }}
                        style={({ pressed }) => [
                          styles.dayRailChip,
                          day.enabled
                            ? styles.dayRailChipActive
                            : styles.dayRailChipInactive,
                          isActive && styles.dayRailChipFocused,
                          pressed && styles.dayRailChipPressed,
                        ]}
                      >
                        <AppText
                          weight="extraBold"
                          style={[
                            styles.dayRailChipLetter,
                            day.enabled
                              ? styles.dayRailChipLetterActive
                              : styles.dayRailChipLetterInactive,
                          ]}
                        >
                          {DAYS[day.key].short}
                        </AppText>

                        <AppText
                          weight="medium"
                          style={[
                            styles.dayRailChipLabel,
                            day.enabled
                              ? styles.dayRailChipLabelActive
                              : styles.dayRailChipLabelInactive,
                          ]}
                        >
                          {dayName}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>

            <View
              style={[
                styles.cardsSection,
                isOtherAutomaticLimitActive && { opacity: 0.55 },
              ]}
              onLayout={(event) => {
                cardsSectionOffsetRef.current = event.nativeEvent.layout.y;
              }}
            >
              {weeklyConfig.map((day) => {
                const dayName = DAYS[day.key].full;
                const totalHours = calculateDurationHours(
                  day.startMinutes,
                  day.endMinutes
                );

                return (
                  <View
                    key={day.key}
                    onLayout={(event) => {
                      sectionOffsetsRef.current[day.key] =
                        event.nativeEvent.layout.y;
                    }}
                    style={[
                      styles.dayCard,
                      activeDayKey === day.key && styles.dayCardActive,
                      !day.enabled && styles.dayCardDisabled,
                    ]}
                  >
                    <View style={styles.dayCardHeader}>
                      <View style={styles.dayIdentityRow}>
                        <View
                          style={[
                            styles.dayBadge,
                            !day.enabled && styles.dayBadgeDisabled,
                          ]}
                        >
                          <AppText
                            weight="extraBold"
                            style={styles.dayBadgeText}
                          >
                            {DAYS[day.key].short}
                          </AppText>
                        </View>

                        <View style={styles.dayNameWrap}>
                          <AppText weight="extraBold" style={styles.dayName}>
                            {dayName}
                          </AppText>

                          <AppText weight="medium" style={styles.dayStatus}>
                            {day.enabled ? "Enabled" : "Disabled"}
                          </AppText>
                        </View>
                      </View>

                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Enable or disable ${dayName}`}
                        accessibilityState={{ selected: day.enabled }}
                        disabled={isOtherAutomaticLimitActive}
                        style={({ pressed }) => [
                          styles.toggleWrap,
                          pressed && styles.toggleWrapPressed,
                        ]}
                        onPress={() => toggleDayEnabled(day.key)}
                      >
                        <View
                          style={[
                            styles.toggleTrack,
                            day.enabled && styles.toggleTrackOn,
                          ]}
                        >
                          <View
                            style={[
                              styles.toggleThumb,
                              day.enabled && styles.toggleThumbOn,
                            ]}
                          />
                        </View>
                      </Pressable>
                    </View>

                    <View
                      style={[
                        styles.timeGrid,
                        isTablet && styles.timeGridTablet,
                      ]}
                    >
                      <View style={styles.timeCard}>
                        <View style={styles.timeLabelRow}>
                          <MaterialCommunityIcons
                            name="clock-outline"
                            size={18}
                            color="#7D889C"
                          />

                          <AppText weight="bold" style={styles.timeLabel}>
                            Start time
                          </AppText>
                        </View>

                        <View style={styles.timeValueBox}>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Decrease start time for ${dayName}`}
                            disabled={isOtherAutomaticLimitActive}
                            onPress={() =>
                              updateTime(day.key, "startMinutes", "decrease")
                            }
                            style={({ pressed }) => [
                              styles.timeAdjustButton,
                              pressed && styles.timeAdjustButtonPressed,
                            ]}
                          >
                            <MaterialCommunityIcons
                              name="minus"
                              size={18}
                              color="#2F6BFF"
                            />
                          </Pressable>

                          <AppText weight="extraBold" style={styles.timeValue}>
                            {formatTime(day.startMinutes)}
                          </AppText>

                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Increase start time for ${dayName}`}
                            disabled={isOtherAutomaticLimitActive}
                            onPress={() =>
                              updateTime(day.key, "startMinutes", "increase")
                            }
                            style={({ pressed }) => [
                              styles.timeAdjustButton,
                              pressed && styles.timeAdjustButtonPressed,
                            ]}
                          >
                            <MaterialCommunityIcons
                              name="plus"
                              size={18}
                              color="#2F6BFF"
                            />
                          </Pressable>
                        </View>
                      </View>

                      <View style={styles.timeCard}>
                        <View style={styles.timeLabelRow}>
                          <MaterialCommunityIcons
                            name="clock-end"
                            size={18}
                            color="#7D889C"
                          />

                          <AppText weight="bold" style={styles.timeLabel}>
                            End time
                          </AppText>
                        </View>

                        <View style={styles.timeValueBox}>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Decrease end time for ${dayName}`}
                            disabled={isOtherAutomaticLimitActive}
                            onPress={() =>
                              updateTime(day.key, "endMinutes", "decrease")
                            }
                            style={({ pressed }) => [
                              styles.timeAdjustButton,
                              pressed && styles.timeAdjustButtonPressed,
                            ]}
                          >
                            <MaterialCommunityIcons
                              name="minus"
                              size={18}
                              color="#2F6BFF"
                            />
                          </Pressable>

                          <AppText weight="extraBold" style={styles.timeValue}>
                            {formatTime(day.endMinutes)}
                          </AppText>

                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Increase end time for ${dayName}`}
                            disabled={isOtherAutomaticLimitActive}
                            onPress={() =>
                              updateTime(day.key, "endMinutes", "increase")
                            }
                            style={({ pressed }) => [
                              styles.timeAdjustButton,
                              pressed && styles.timeAdjustButtonPressed,
                            ]}
                          >
                            <MaterialCommunityIcons
                              name="plus"
                              size={18}
                              color="#2F6BFF"
                            />
                          </Pressable>
                        </View>
                      </View>
                    </View>

                    <View style={styles.dayFooter}>
                      <View style={styles.totalHoursPill}>
                        <MaterialCommunityIcons
                          name="timer-outline"
                          size={16}
                          color="#2F6BFF"
                        />

                        <AppText weight="bold" style={styles.totalHoursText}>
                          {`Total time: ${totalHours} hours`}
                        </AppText>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.bottomActionsWrap}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Copy current settings to all days"
                disabled={isOtherAutomaticLimitActive}
                style={({ pressed }) => [
                  styles.secondaryActionButton,
                  pressed && styles.secondaryActionButtonPressed,
                  isOtherAutomaticLimitActive && { opacity: 0.45 },
                ]}
                onPress={copyActiveDayToAll}
              >
                <MaterialCommunityIcons
                  name="content-copy"
                  size={18}
                  color="#2F6BFF"
                />

                <AppText weight="bold" style={styles.secondaryActionText}>
                  Copy to all days
                </AppText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Save weekly schedule"
                disabled={isOtherAutomaticLimitActive}
                style={({ pressed }) => [
                  styles.primaryActionButton,
                  pressed && styles.primaryActionButtonPressed,
                  isOtherAutomaticLimitActive && { opacity: 0.45 },
                ]}
                onPress={saveSchedule}
              >
                <MaterialCommunityIcons
                  name="content-save-outline"
                  size={18}
                  color="#FFFFFF"
                />

                <AppText weight="bold" style={styles.primaryActionText}>
                  Save schedule
                </AppText>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}