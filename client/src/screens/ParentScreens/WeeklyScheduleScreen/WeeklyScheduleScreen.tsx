import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  BackHandler,
  Pressable,
  ScrollView,
  Switch,
  useWindowDimensions,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import ChildDeviceSelector from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import AutomaticLimitUnavailableCard from "@/src/components/AutomaticLimitUnavailableCard/AutomaticLimitUnavailableCard";

import type { AppDispatch, RootState } from "../../../redux/store/types";
import { getMyChildrenThunk } from "@/src/redux/thunks/childrenThunks";
import {
  fetchDevicesByChild,
  updateDeviceScreenTimeThunk,
} from "@/src/redux/thunks/deviceThunks";
import { showErrorToast, showSuccessToast } from "@/src/utils/appToast";

import { styles } from "./styles";

type DayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

type DayScheduleMode = "CUSTOM" | "ALL_DAY" | "BLOCKED";

type WeeklyDayConfig = {
  key: DayKey;
  startMinutes: number;
  endMinutes: number;
  enabled: boolean;
  mode: DayScheduleMode;
};

type WeeklySchedulePayloadDay = {
  dayOfWeek: number;
  isEnabled: boolean;
  startTime: string;
  endTime: string;
};

const STEP_MINUTES = 30;
const MIN_MINUTES = 0;
const END_OF_DAY_MINUTES = 23 * 60 + 59;
const MAX_SELECTABLE_MINUTES = 23 * 60 + 30;

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
  {
    key: "sun",
    startMinutes: 7 * 60,
    endMinutes: 17 * 60,
    enabled: true,
    mode: "CUSTOM",
  },
  {
    key: "mon",
    startMinutes: 7 * 60 + 30,
    endMinutes: 16 * 60,
    enabled: true,
    mode: "CUSTOM",
  },
  {
    key: "tue",
    startMinutes: 7 * 60,
    endMinutes: 16 * 60 + 30,
    enabled: true,
    mode: "CUSTOM",
  },
  {
    key: "wed",
    startMinutes: 8 * 60,
    endMinutes: 15 * 60,
    enabled: true,
    mode: "CUSTOM",
  },
  {
    key: "thu",
    startMinutes: 7 * 60,
    endMinutes: 17 * 60 + 30,
    enabled: true,
    mode: "CUSTOM",
  },
  {
    key: "fri",
    startMinutes: 9 * 60,
    endMinutes: 13 * 60,
    enabled: true,
    mode: "CUSTOM",
  },
  {
    key: "sat",
    startMinutes: 10 * 60,
    endMinutes: 18 * 60,
    enabled: true,
    mode: "CUSTOM",
  },
];

const DAY_KEY_TO_SERVER_DAY: Record<DayKey, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

const SERVER_DAY_TO_DAY_KEY: Record<number, DayKey> = {
  0: "sun",
  1: "mon",
  2: "tue",
  3: "wed",
  4: "thu",
  5: "fri",
  6: "sat",
};

function cloneWeeklyConfig(config: WeeklyDayConfig[]) {
  return config.map((day) => ({ ...day }));
}

function formatTime(minutes: number) {
  const normalized = Math.max(
    MIN_MINUTES,
    Math.min(END_OF_DAY_MINUTES, minutes)
  );

  const hours24 = Math.floor(normalized / 60);
  const mins = normalized % 60;
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  return `${String(hours12).padStart(2, "0")}:${String(mins).padStart(
    2,
    "0"
  )} ${suffix}`;
}

function formatTimeForServer(minutes: number) {
  const normalized = Math.max(
    MIN_MINUTES,
    Math.min(END_OF_DAY_MINUTES, minutes)
  );

  const hours = Math.floor(normalized / 60);
  const mins = normalized % 60;

  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

function parseServerTime(value: unknown) {
  if (typeof value !== "string") return null;

  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match) return null;

  return Number(match[1]) * 60 + Number(match[2]);
}

function getModeFromPayloadDay(
  isEnabled: unknown,
  startMinutes: number,
  endMinutes: number
): DayScheduleMode {
  if (isEnabled !== true) {
    return "BLOCKED";
  }

  if (startMinutes === MIN_MINUTES && endMinutes === END_OF_DAY_MINUTES) {
    return "ALL_DAY";
  }

  return "CUSTOM";
}

function mapWeeklyConfigToPayload(
  config: WeeklyDayConfig[]
): WeeklySchedulePayloadDay[] {
  return config.map((day) => {
    if (day.mode === "BLOCKED") {
      return {
        dayOfWeek: DAY_KEY_TO_SERVER_DAY[day.key],
        isEnabled: false,
        startTime: "00:00",
        endTime: "23:59",
      };
    }

    if (day.mode === "ALL_DAY") {
      return {
        dayOfWeek: DAY_KEY_TO_SERVER_DAY[day.key],
        isEnabled: true,
        startTime: "00:00",
        endTime: "23:59",
      };
    }

    return {
      dayOfWeek: DAY_KEY_TO_SERVER_DAY[day.key],
      isEnabled: true,
      startTime: formatTimeForServer(day.startMinutes),
      endTime: formatTimeForServer(day.endMinutes),
    };
  });
}

function mapPayloadToWeeklyConfig(value: unknown): WeeklyDayConfig[] {
  if (!Array.isArray(value)) {
    return cloneWeeklyConfig(INITIAL_WEEKLY_CONFIG);
  }

  const nextConfig = cloneWeeklyConfig(INITIAL_WEEKLY_CONFIG);

  value.forEach((rawDay) => {
    if (rawDay == null || typeof rawDay !== "object") return;

    const item = rawDay as {
      dayOfWeek?: unknown;
      isEnabled?: unknown;
      startTime?: unknown;
      endTime?: unknown;
    };

    const dayOfWeek = Number(item.dayOfWeek);
    const key = SERVER_DAY_TO_DAY_KEY[dayOfWeek];

    if (!key) return;

    const startMinutes = parseServerTime(item.startTime);
    const endMinutes = parseServerTime(item.endTime);

    if (startMinutes == null || endMinutes == null) return;
    if (startMinutes >= endMinutes) return;

    const index = nextConfig.findIndex((day) => day.key === key);
    if (index < 0) return;

    const mode = getModeFromPayloadDay(
      item.isEnabled,
      startMinutes,
      endMinutes
    );

    nextConfig[index] = {
      key,
      enabled: item.isEnabled === true,
      startMinutes,
      endMinutes,
      mode,
    };
  });

  return nextConfig;
}

function calculateDurationHours(day: WeeklyDayConfig) {
  if (day.mode === "BLOCKED") {
    return "0";
  }

  if (day.mode === "ALL_DAY") {
    return "24";
  }

  const diff = Math.max(0, day.endMinutes - day.startMinutes);
  const hours = diff / 60;

  return Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
}

function getModeLabel(mode: DayScheduleMode) {
  if (mode === "ALL_DAY") return "All day allowed";
  if (mode === "BLOCKED") return "Blocked all day";
  return "Allowed hours";
}

export default function WeeklyScheduleScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();

  const { childrenList } = useSelector((state: RootState) => state.children);
  const { byChildId } = useSelector((state: RootState) => state.devices);

  const children = Array.isArray(childrenList) ? childrenList : [];

  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");

  const [weeklyConfig, setWeeklyConfig] = useState<WeeklyDayConfig[]>(
    cloneWeeklyConfig(INITIAL_WEEKLY_CONFIG)
  );

  const [initialWeeklyConfig, setInitialWeeklyConfig] = useState<
    WeeklyDayConfig[]
  >(cloneWeeklyConfig(INITIAL_WEEKLY_CONFIG));

  const [activeDayKey, setActiveDayKey] = useState<DayKey>("sun");
  const [showWeeklyOverview, setShowWeeklyOverview] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const [isScheduleEnabled, setIsScheduleEnabled] = useState(false);
  const [initialIsScheduleEnabled, setInitialIsScheduleEnabled] =
    useState(false);

  const isSavingRef = useRef(false);

  const hasUnsavedChanges = useMemo(() => {
    return (
      isScheduleEnabled !== initialIsScheduleEnabled ||
      JSON.stringify(weeklyConfig) !== JSON.stringify(initialWeeklyConfig)
    );
  }, [
    isScheduleEnabled,
    initialIsScheduleEnabled,
    weeklyConfig,
    initialWeeklyConfig,
  ]);

  useEffect(() => {
    dispatch(getMyChildrenThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedChildId && children.length > 0) {
      setSelectedChildId(String(children[0]._id));
    }
  }, [children, selectedChildId]);

  useEffect(() => {
    if (!selectedChildId) return;

    dispatch(fetchDevicesByChild(selectedChildId));
  }, [dispatch, selectedChildId]);

  const selectedChild = useMemo(() => {
    if (!children.length) return null;

    return (
      children.find(
        (child: any) => String(child._id) === String(selectedChildId)
      ) ?? children[0]
    );
  }, [children, selectedChildId]);

  const currentChildDevices = useMemo(() => {
    if (!selectedChild?._id) return [];

    return byChildId[selectedChild._id] ?? [];
  }, [byChildId, selectedChild]);

  useEffect(() => {
    if (!selectedChild?._id) return;

    const firstDeviceId = currentChildDevices[0]?._id;
    const exists = currentChildDevices.some(
      (device: any) => String(device._id) === String(selectedDeviceId)
    );

    if (!exists) {
      setSelectedDeviceId(firstDeviceId ? String(firstDeviceId) : "");
    }
  }, [selectedChild, currentChildDevices, selectedDeviceId]);

  const selectedDevice = useMemo(() => {
    if (!currentChildDevices.length) return null;

    return (
      currentChildDevices.find(
        (device: any) => String(device._id) === String(selectedDeviceId)
      ) ?? currentChildDevices[0]
    );
  }, [currentChildDevices, selectedDeviceId]);

  useEffect(() => {
    if (!selectedDevice) return;

    const isCurrentScheduleActive =
      selectedDevice.screenTime?.isLimitEnabled === true &&
      selectedDevice.screenTime?.limitMode === "SCHEDULE";

    const nextWeeklyConfig = mapPayloadToWeeklyConfig(
      selectedDevice.screenTime?.weeklySchedule
    );

    setIsScheduleEnabled(isCurrentScheduleActive);
    setInitialIsScheduleEnabled(isCurrentScheduleActive);

    setWeeklyConfig(cloneWeeklyConfig(nextWeeklyConfig));
    setInitialWeeklyConfig(cloneWeeklyConfig(nextWeeklyConfig));

    setActiveDayKey("sun");
    setShowWeeklyOverview(false);
  }, [
    selectedDevice?._id,
    selectedDevice?.screenTime?.isLimitEnabled,
    selectedDevice?.screenTime?.limitMode,
    selectedDevice?.screenTime?.weeklySchedule,
  ]);

  const confirmLeaveWithoutSaving = useCallback(
    (onConfirm: () => void) => {
      if (!hasUnsavedChanges || isSavingRef.current) {
        onConfirm();
        return;
      }

      Alert.alert(
        "Leave without saving?",
        "You have changes that were not saved. If you leave now, they will be lost.",
        [
          {
            text: "Stay",
            style: "cancel",
          },
          {
            text: "Leave anyway",
            style: "destructive",
            onPress: onConfirm,
          },
        ]
      );
    },
    [hasUnsavedChanges]
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (event: any) => {
      if (!hasUnsavedChanges || isSavingRef.current) return;

      event.preventDefault();

      confirmLeaveWithoutSaving(() => {
        navigation.dispatch(event.data.action);
      });
    });

    return unsubscribe;
  }, [navigation, hasUnsavedChanges, confirmLeaveWithoutSaving]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (!hasUnsavedChanges || isSavingRef.current) {
            return false;
          }

          confirmLeaveWithoutSaving(() => {
            navigation.goBack();
          });

          return true;
        }
      );

      return () => subscription.remove();
    }, [hasUnsavedChanges, confirmLeaveWithoutSaving, navigation])
  );

  const childName = selectedChild?.name || "Child";

  const selectedDeviceName = selectedDevice
    ? String(
        (selectedDevice as any).deviceName ??
          (selectedDevice as any).model ??
          (selectedDevice as any).name ??
          "Connected device"
      )
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

  const allowedDaysCount = weeklyConfig.filter(
    (day) => day.mode !== "BLOCKED"
  ).length;

  const activeDaysTotalHours = weeklyConfig.reduce((sum, day) => {
    if (day.mode === "BLOCKED") return sum;
    if (day.mode === "ALL_DAY") return sum + 24;

    return sum + Math.max(0, day.endMinutes - day.startMinutes) / 60;
  }, 0);

  const setDayMode = (dayKey: DayKey, mode: DayScheduleMode) => {
    if (isOtherAutomaticLimitActive || isSaving) return;

    setActiveDayKey(dayKey);

    setWeeklyConfig((prev) =>
      prev.map((day) => {
        if (day.key !== dayKey) return day;

        if (mode === "ALL_DAY") {
          return {
            ...day,
            enabled: true,
            mode,
            startMinutes: MIN_MINUTES,
            endMinutes: END_OF_DAY_MINUTES,
          };
        }

        if (mode === "BLOCKED") {
          return {
            ...day,
            enabled: false,
            mode,
            startMinutes: MIN_MINUTES,
            endMinutes: END_OF_DAY_MINUTES,
          };
        }

        return {
          ...day,
          enabled: true,
          mode,
          startMinutes:
            day.mode === "BLOCKED" || day.mode === "ALL_DAY"
              ? 7 * 60
              : day.startMinutes,
          endMinutes:
            day.mode === "BLOCKED" || day.mode === "ALL_DAY"
              ? 17 * 60
              : day.endMinutes,
        };
      })
    );
  };

  const updateTime = (
    dayKey: DayKey,
    field: "startMinutes" | "endMinutes",
    direction: "increase" | "decrease"
  ) => {
    if (isOtherAutomaticLimitActive || isSaving) return;

    setActiveDayKey(dayKey);

    setWeeklyConfig((prev) =>
      prev.map((day) => {
        if (day.key !== dayKey) return day;

        const delta = direction === "increase" ? STEP_MINUTES : -STEP_MINUTES;

        if (field === "startMinutes") {
          const nextStart = Math.max(
            MIN_MINUTES,
            Math.min(day.startMinutes + delta, day.endMinutes - STEP_MINUTES)
          );

          return {
            ...day,
            enabled: true,
            mode: "CUSTOM",
            startMinutes: nextStart,
          };
        }

        const nextEnd = Math.max(
          day.startMinutes + STEP_MINUTES,
          Math.min(day.endMinutes + delta, MAX_SELECTABLE_MINUTES)
        );

        return {
          ...day,
          enabled: true,
          mode: "CUSTOM",
          endMinutes: nextEnd,
        };
      })
    );
  };

  const saveSchedule = async () => {
    if (!selectedChildId || !selectedDevice?._id) {
      showErrorToast(
        "Please select a child and device first.",
        "Weekly Schedule"
      );
      return;
    }

    const hasAtLeastOneAllowedDay = weeklyConfig.some(
      (day) => day.mode !== "BLOCKED"
    );

    if (isScheduleEnabled && !hasAtLeastOneAllowedDay) {
      showErrorToast(
        "Choose at least one allowed day before enabling weekly schedule.",
        "Weekly Schedule"
      );
      return;
    }

    try {
      setIsSaving(true);
      isSavingRef.current = true;

      await dispatch(
        updateDeviceScreenTimeThunk({
          childId: selectedChildId,
          deviceId: selectedDevice._id,
          isLimitEnabled: isScheduleEnabled,
          limitMode: isScheduleEnabled ? "SCHEDULE" : "NONE",
          weeklySchedule: mapWeeklyConfigToPayload(weeklyConfig),
        })
      ).unwrap();

      setInitialIsScheduleEnabled(isScheduleEnabled);
      setInitialWeeklyConfig(cloneWeeklyConfig(weeklyConfig));

      showSuccessToast(
        "Weekly schedule was saved successfully.",
        "Weekly Schedule"
      );
    } catch (error) {
      showErrorToast(
        "Could not save weekly schedule. Please try again.",
        "Weekly Schedule"
      );
    } finally {
      setIsSaving(false);
      isSavingRef.current = false;
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.contentMaxWidth}>
              <ChildDeviceSelector
                selectedChildId={selectedChildId}
                selectedDeviceId={selectedDeviceId}
                showDevices={true}
                onSelectChild={(childId) => {
                  setSelectedChildId(String(childId));
                  setSelectedDeviceId("");
                }}
                onSelectDevice={(deviceId) => {
                  setSelectedDeviceId(String(deviceId));
                }}
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
                      name={
                        isScheduleEnabled
                          ? "calendar-check"
                          : "calendar-remove"
                      }
                      size={23}
                      color="#2F6BFF"
                    />
                  </View>

                  <View style={styles.heroTextWrap}>
                    <AppText weight="extraBold" style={styles.heroTitle}>
                      Weekly Schedule
                    </AppText>

                    <AppText weight="medium" style={styles.heroSubtitle}>
                      {`Set weekly allowed usage hours for ${childName} on ${selectedDeviceName}`}
                    </AppText>
                  </View>
                </View>

                <View style={styles.scheduleToggleCard}>
                  <View style={styles.scheduleToggleTextWrap}>
                    <AppText
                      weight="extraBold"
                      style={styles.scheduleToggleTitle}
                    >
                      Enable weekly schedule
                    </AppText>

                    <AppText
                      weight="medium"
                      style={styles.scheduleToggleSubtitle}
                    >
                      Turning this on or off is saved only after tapping Save.
                    </AppText>
                  </View>

                  <Switch
                    value={isScheduleEnabled}
                    disabled={isOtherAutomaticLimitActive || isSaving}
                    onValueChange={setIsScheduleEnabled}
                    trackColor={{ false: "#CBD5E1", true: "#BFDBFE" }}
                    thumbColor={isScheduleEnabled ? "#2F6BFF" : "#F8FAFC"}
                  />
                </View>

                {hasUnsavedChanges ? (
                  <AppText weight="medium" style={styles.unsavedInlineText}>
                    Unsaved changes
                  </AppText>
                ) : null}

                <View
                  style={[
                    styles.scheduleStatusBadge,
                    isScheduleEnabled
                      ? styles.scheduleStatusBadgeActive
                      : styles.scheduleStatusBadgeInactive,
                  ]}
                >
                  <AppText
                    weight="bold"
                    style={[
                      styles.scheduleStatusText,
                      isScheduleEnabled
                        ? styles.scheduleStatusTextActive
                        : styles.scheduleStatusTextInactive,
                    ]}
                  >
                    {isScheduleEnabled
                      ? "Schedule on"
                      : "Schedule off"}
                  </AppText>
                </View>

                <View
                  style={[
                    styles.heroStatsRow,
                    !isTablet && styles.heroStatsColumn,
                  ]}
                >
                  <View style={styles.statCard}>
                    <AppText weight="bold" style={styles.statLabel}>
                      Allowed days
                    </AppText>

                    <AppText weight="extraBold" style={styles.statValue}>
                      {allowedDaysCount}
                    </AppText>
                  </View>

                  <View style={styles.statCard}>
                    <AppText weight="bold" style={styles.statLabel}>
                      Weekly hours
                    </AppText>

                    <AppText weight="extraBold" style={styles.statValue}>
                      {Number.isInteger(activeDaysTotalHours)
                        ? activeDaysTotalHours
                        : activeDaysTotalHours.toFixed(1)}
                    </AppText>
                  </View>
                </View>
              </View>

              <View
                style={[styles.daysRailSection, isSaving && { opacity: 0.55 }]}
              >
                <View style={styles.sectionHeaderRow}>
                  <AppText weight="extraBold" style={styles.sectionTitle}>
                    Choose a day
                  </AppText>

                  <AppText weight="medium" style={styles.sectionHint}>
                    Tap a day to open its settings
                  </AppText>
                </View>

                <View style={styles.dayRailOuter}>
                  <View style={styles.dayRailWrap}>
                    {weeklyConfig.map((day) => {
                      const isActive = activeDayKey === day.key;
                      const dayName = DAYS[day.key].full;
                      const isBlocked = day.mode === "BLOCKED";

                      return (
                        <Pressable
                          key={day.key}
                          onPress={() => setActiveDayKey(day.key)}
                          disabled={isSaving}
                          accessibilityRole="button"
                          accessibilityLabel={`Open ${dayName}`}
                          accessibilityState={{ selected: isActive }}
                          style={({ pressed }) => [
                            styles.dayRailChip,
                            isBlocked
                              ? styles.dayRailChipInactive
                              : styles.dayRailChipActive,
                            isActive && styles.dayRailChipFocused,
                            pressed && styles.dayRailChipPressed,
                          ]}
                        >
                          <AppText
                            weight="extraBold"
                            style={[
                              styles.dayRailChipLetter,
                              isBlocked
                                ? styles.dayRailChipLetterInactive
                                : styles.dayRailChipLetterActive,
                              isActive && styles.dayRailChipFocusedText,
                            ]}
                          >
                            {DAYS[day.key].short}
                          </AppText>

                          <AppText
                            weight="medium"
                            style={[
                              styles.dayRailChipLabel,
                              isBlocked
                                ? styles.dayRailChipLabelInactive
                                : styles.dayRailChipLabelActive,
                              isActive && styles.dayRailChipFocusedText,
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

              <View style={styles.weeklyOverviewSection}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    showWeeklyOverview
                      ? "Hide weekly overview"
                      : "View full weekly schedule"
                  }
                  onPress={() => setShowWeeklyOverview((prev) => !prev)}
                  style={({ pressed }) => [
                    styles.weeklyOverviewTextButton,
                    pressed && styles.weeklyOverviewTextButtonPressed,
                  ]}
                >
                  <AppText
                    weight="bold"
                    style={styles.weeklyOverviewTextButtonLabel}
                  >
                    {showWeeklyOverview
                      ? "Hide weekly overview"
                      : "View full weekly schedule"}
                  </AppText>
                </Pressable>

                {showWeeklyOverview ? (
                  <View style={styles.weeklyOverviewSimpleCard}>
                    {weeklyConfig.map((day) => {
                      const isBlocked = day.mode === "BLOCKED";
                      const isAllDay = day.mode === "ALL_DAY";

                      const summaryText = isBlocked
                        ? "Blocked all day"
                        : isAllDay
                          ? "All day allowed"
                          : `${formatTime(day.startMinutes)} - ${formatTime(
                              day.endMinutes
                            )}`;

                      return (
                        <View key={day.key} style={styles.weeklyOverviewSimpleRow}>
                          <AppText
                            weight="bold"
                            style={styles.weeklyOverviewSimpleDay}
                          >
                            {DAYS[day.key].full}
                          </AppText>

                          <AppText
                            weight="medium"
                            style={[
                              styles.weeklyOverviewSimpleTime,
                              isBlocked && styles.weeklyOverviewSimpleBlocked,
                              isAllDay && styles.weeklyOverviewSimpleAllDay,
                            ]}
                          >
                            {summaryText}
                          </AppText>
                        </View>
                      );
                    })}
                  </View>
                ) : null}
              </View>

              <View style={[styles.cardsSection, isSaving && { opacity: 0.55 }]}>
                {weeklyConfig.map((day) => {
                  const dayName = DAYS[day.key].full;
                  const totalHours = calculateDurationHours(day);
                  const isBlocked = day.mode === "BLOCKED";
                  const isCustom = day.mode === "CUSTOM";
                  const isExpanded = activeDayKey === day.key;

                  return (
                    <View
                      key={day.key}
                      style={[
                        styles.dayCard,
                        isExpanded && styles.dayCardActive,
                        isBlocked && styles.dayCardDisabled,
                      ]}
                    >
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Open ${dayName} settings`}
                        onPress={() => setActiveDayKey(day.key)}
                        style={styles.dayCardHeader}
                      >
                        <View style={styles.dayIdentityRow}>
                          <View
                            style={[
                              styles.dayBadge,
                              isBlocked && styles.dayBadgeDisabled,
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

                            <AppText
                              weight="medium"
                              style={[
                                styles.dayStatus,
                                day.mode === "ALL_DAY" &&
                                  styles.dayStatusAllowed,
                                day.mode === "BLOCKED" &&
                                  styles.dayStatusBlocked,
                              ]}
                            >
                              {getModeLabel(day.mode)}
                            </AppText>
                          </View>
                        </View>

                        <View style={styles.dayHeaderRight}>
                          <View
                            style={[
                              styles.scheduleModeStatusPill,
                              day.mode === "BLOCKED"
                                ? styles.scheduleModeStatusPillBlocked
                                : day.mode === "ALL_DAY"
                                  ? styles.scheduleModeStatusPillAllDay
                                  : styles.scheduleModeStatusPillAllowed,
                            ]}
                          >
                            <AppText
                              weight="bold"
                              style={[
                                styles.scheduleModeStatusText,
                                day.mode === "BLOCKED"
                                  ? styles.scheduleModeStatusTextBlocked
                                  : day.mode === "ALL_DAY"
                                    ? styles.scheduleModeStatusTextAllDay
                                    : styles.scheduleModeStatusTextAllowed,
                              ]}
                            >
                              {getModeLabel(day.mode)}
                            </AppText>
                          </View>

                          <MaterialCommunityIcons
                            name={isExpanded ? "chevron-up" : "chevron-down"}
                            size={21}
                            color="#7D889C"
                          />
                        </View>
                      </Pressable>

                      {isExpanded ? (
                        <View style={styles.dayExpandedContent}>
                          <View style={styles.scheduleModeButtonsRow}>
                            <Pressable
                              accessibilityRole="button"
                              accessibilityLabel={`Set ${dayName} to allowed hours`}
                              disabled={isOtherAutomaticLimitActive || isSaving}
                              onPress={() => setDayMode(day.key, "CUSTOM")}
                              style={({ pressed }) => [
                                styles.scheduleModeButton,
                                day.mode === "CUSTOM" &&
                                  styles.scheduleModeButtonActive,
                                pressed && styles.scheduleModeButtonPressed,
                                (isOtherAutomaticLimitActive || isSaving) && {
                                  opacity: 0.45,
                                },
                              ]}
                            >
                              <AppText
                                weight="bold"
                                style={[
                                  styles.scheduleModeButtonText,
                                  day.mode === "CUSTOM" &&
                                    styles.scheduleModeButtonTextActive,
                                ]}
                              >
                                Allowed hours
                              </AppText>
                            </Pressable>

                            <Pressable
                              accessibilityRole="button"
                              accessibilityLabel={`Allow all day on ${dayName}`}
                              disabled={isOtherAutomaticLimitActive || isSaving}
                              onPress={() => setDayMode(day.key, "ALL_DAY")}
                              style={({ pressed }) => [
                                styles.scheduleModeButton,
                                day.mode === "ALL_DAY" &&
                                  styles.scheduleModeButtonSuccessActive,
                                pressed && styles.scheduleModeButtonPressed,
                                (isOtherAutomaticLimitActive || isSaving) && {
                                  opacity: 0.45,
                                },
                              ]}
                            >
                              <AppText
                                weight="bold"
                                style={[
                                  styles.scheduleModeButtonText,
                                  day.mode === "ALL_DAY" &&
                                    styles.scheduleModeButtonSuccessTextActive,
                                ]}
                              >
                                All day allowed
                              </AppText>
                            </Pressable>

                            <Pressable
                              accessibilityRole="button"
                              accessibilityLabel={`Block all day on ${dayName}`}
                              disabled={isOtherAutomaticLimitActive || isSaving}
                              onPress={() => setDayMode(day.key, "BLOCKED")}
                              style={({ pressed }) => [
                                styles.scheduleModeButton,
                                day.mode === "BLOCKED" &&
                                  styles.scheduleModeButtonDangerActive,
                                pressed && styles.scheduleModeButtonPressed,
                                (isOtherAutomaticLimitActive || isSaving) && {
                                  opacity: 0.45,
                                },
                              ]}
                            >
                              <AppText
                                weight="bold"
                                style={[
                                  styles.scheduleModeButtonText,
                                  day.mode === "BLOCKED" &&
                                    styles.scheduleModeButtonDangerTextActive,
                                ]}
                              >
                                Blocked all day
                              </AppText>
                            </Pressable>
                          </View>

                          {isBlocked ? (
                            <View style={styles.blockedDayMessage}>
                              <AppText
                                weight="bold"
                                style={styles.blockedDayText}
                              >
                                This device will be blocked for the entire day.
                              </AppText>
                            </View>
                          ) : null}

                          {!isBlocked ? (
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
                                    size={17}
                                    color="#7D889C"
                                  />

                                  <AppText
                                    weight="bold"
                                    style={styles.timeLabel}
                                  >
                                    Start time
                                  </AppText>
                                </View>

                                <View style={styles.timeValueBox}>
                                  <Pressable
                                    accessibilityRole="button"
                                    accessibilityLabel={`Decrease start time for ${dayName}`}
                                    disabled={
                                      isOtherAutomaticLimitActive ||
                                      isSaving ||
                                      !isCustom
                                    }
                                    onPress={() =>
                                      updateTime(
                                        day.key,
                                        "startMinutes",
                                        "decrease"
                                      )
                                    }
                                    style={({ pressed }) => [
                                      styles.timeAdjustButton,
                                      pressed && styles.timeAdjustButtonPressed,
                                      !isCustom && { opacity: 0.35 },
                                    ]}
                                  >
                                    <MaterialCommunityIcons
                                      name="minus"
                                      size={18}
                                      color="#2F6BFF"
                                    />
                                  </Pressable>

                                  <AppText
                                    weight="extraBold"
                                    style={styles.timeValue}
                                  >
                                    {formatTime(day.startMinutes)}
                                  </AppText>

                                  <Pressable
                                    accessibilityRole="button"
                                    accessibilityLabel={`Increase start time for ${dayName}`}
                                    disabled={
                                      isOtherAutomaticLimitActive ||
                                      isSaving ||
                                      !isCustom
                                    }
                                    onPress={() =>
                                      updateTime(
                                        day.key,
                                        "startMinutes",
                                        "increase"
                                      )
                                    }
                                    style={({ pressed }) => [
                                      styles.timeAdjustButton,
                                      pressed && styles.timeAdjustButtonPressed,
                                      !isCustom && { opacity: 0.35 },
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
                                    size={17}
                                    color="#7D889C"
                                  />

                                  <AppText
                                    weight="bold"
                                    style={styles.timeLabel}
                                  >
                                    End time
                                  </AppText>
                                </View>

                                <View style={styles.timeValueBox}>
                                  <Pressable
                                    accessibilityRole="button"
                                    accessibilityLabel={`Decrease end time for ${dayName}`}
                                    disabled={
                                      isOtherAutomaticLimitActive ||
                                      isSaving ||
                                      !isCustom
                                    }
                                    onPress={() =>
                                      updateTime(
                                        day.key,
                                        "endMinutes",
                                        "decrease"
                                      )
                                    }
                                    style={({ pressed }) => [
                                      styles.timeAdjustButton,
                                      pressed && styles.timeAdjustButtonPressed,
                                      !isCustom && { opacity: 0.35 },
                                    ]}
                                  >
                                    <MaterialCommunityIcons
                                      name="minus"
                                      size={18}
                                      color="#2F6BFF"
                                    />
                                  </Pressable>

                                  <AppText
                                    weight="extraBold"
                                    style={styles.timeValue}
                                  >
                                    {formatTime(day.endMinutes)}
                                  </AppText>

                                  <Pressable
                                    accessibilityRole="button"
                                    accessibilityLabel={`Increase end time for ${dayName}`}
                                    disabled={
                                      isOtherAutomaticLimitActive ||
                                      isSaving ||
                                      !isCustom
                                    }
                                    onPress={() =>
                                      updateTime(
                                        day.key,
                                        "endMinutes",
                                        "increase"
                                      )
                                    }
                                    style={({ pressed }) => [
                                      styles.timeAdjustButton,
                                      pressed && styles.timeAdjustButtonPressed,
                                      !isCustom && { opacity: 0.35 },
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
                          ) : null}

                          <View style={styles.dayFooter}>
                            <View style={styles.totalHoursPill}>
                              <AppText
                                weight="bold"
                                style={styles.totalHoursText}
                              >
                                {`Allowed time: ${totalHours} hours`}
                              </AppText>
                            </View>
                          </View>
                        </View>
                      ) : null}
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {hasUnsavedChanges ? (
            <View style={styles.footerUnsavedRow}>
              <AppText weight="bold" style={styles.footerUnsavedText}>
                Unsaved changes
              </AppText>
            </View>
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Save weekly schedule"
            disabled={isOtherAutomaticLimitActive || isSaving || !hasUnsavedChanges}
            style={({ pressed }) => [
              styles.primaryActionButton,
              pressed && styles.primaryActionButtonPressed,
              (isOtherAutomaticLimitActive ||
                isSaving ||
                !hasUnsavedChanges) &&
                styles.primaryActionButtonDisabled,
            ]}
            onPress={saveSchedule}
          >
            <AppText weight="bold" style={styles.primaryActionText}>
              {isSaving ? "Saving..." : "Save schedule"}
            </AppText>
          </Pressable>
        </View>
      </View>
    </ScreenLayout>
  );
}