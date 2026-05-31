import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Pressable,
  useWindowDimensions,
  NativeModules,
  Modal,
  ActivityIndicator,
  AppState,
} from "react-native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { router, useLocalSearchParams, type Href } from "expo-router";
import { Image } from "expo-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { showErrorToast, showInfoToast } from "@/src/utils/appToast";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import CoinIcon from "@/src/components/CoinIcon/CoinIcon";
import { styles as rawStyles, TILE_COLORS } from "./styles";

import { Child } from "@/src/redux/slices/children-slice";
import { fetchCurrentChildProfileThunk } from "@/src/redux/thunks/childrenThunks";
import {
  updateDeviceLocation,
  syncInstalledAppsThunk,
  syncAppUsageThunk,
} from "@/src/redux/thunks/deviceThunks";
import type { AppDispatch, RootState } from "@/src/redux/store/types";
import { selectChildPalette } from "@/src/redux/slices/child-theme-slice";
import { connectSocket, emitEvent, onEvent } from "@/src/services/socket";
import { REQUEST_CHILD_LOCATION } from "@/src/constants/socketEvents";
import { getAvatarImage } from "@/src/utils/avatarImages";
import { fetchChildPermissionSnapshot } from "@/src/services/childDevicePermissions";

const { DeviceControl } = NativeModules;
const styles = rawStyles as any;

const ICON = {
  points: "star-circle",
  level: "shield-star",
  time: "clock-outline",
  apps: "view-grid-outline",
  extend: "clock-plus-outline",
  shop: "shopping-outline",
  tasks: "clipboard-check-outline",
  achievements: "trophy-outline",
  goals: "target",
  charts: "chart-donut-variant",
  bulb: "lightbulb-on-outline",
  chatbot: "chat-processing-outline",
  help: "help-circle-outline",
  settings: "cog-outline",
  panic: "alert-circle-outline",
} as const;

function getXpRequiredForLevel(level: number) {
  return 100 + (level - 1) * 50;
}

function getAvatarStageFromLevel(level: number) {
  if (level >= 9) return 5;
  if (level >= 7) return 4;
  if (level >= 5) return 3;
  if (level >= 3) return 2;

  return 1;
}

function getNextAvatarStageLevel(level: number) {
  if (level < 3) return 3;
  if (level < 5) return 5;
  if (level < 7) return 7;
  if (level < 9) return 9;

  return null;
}

const AVATAR_STAGE_INFO: Record<
  number,
  {
    title: string;
    subtitle: string;
    icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  }
> = {
  1: {
    title: "Time Explorer",
    subtitle: "Starting the journey to balanced screen time!",
    icon: "star-circle",
  },
  2: {
    title: "Choice Maker",
    subtitle: "Making mindful choices and building good habits!",
    icon: "heart-circle",
  },
  3: {
    title: "Time Guardian",
    subtitle: "Keeping time in balance like a pro!",
    icon: "timer-sand",
  },
  4: {
    title: "Habit Hero",
    subtitle: "Building amazing habits and staying on track!",
    icon: "medal",
  },
  5: {
    title: "Balance Champion",
    subtitle: "A true champion of healthy screen time!",
    icon: "crown-circle",
  },
};

const AVATAR_INFO_SLIDES: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
  description: string;
  bgColor: string;
  borderColor: string;
  iconBgColor: string;
  iconColor: string;
}[] = [
    {
      icon: "trophy-outline",
      title: "Achievements",
      description:
        "Check your achievements to earn XP and celebrate your progress.",
      bgColor: "#FFF7ED",
      borderColor: "#FED7AA",
      iconBgColor: "#FFE8C2",
      iconColor: "#B45309",
    },
    {
      icon: "star-circle",
      title: "XP",
      description:
        "XP helps your avatar level up as you complete goals and unlock achievements.",
      bgColor: "#EEF4FF",
      borderColor: "#CFE3FF",
      iconBgColor: "#DBEAFE",
      iconColor: "#2563EB",
    },
    {
      icon: "trending-up",
      title: "Levels",
      description:
        "The more XP you collect, the higher your avatar level becomes.",
      bgColor: "#F3EDFF",
      borderColor: "#E0D2FF",
      iconBgColor: "#E9D5FF",
      iconColor: "#6D28D9",
    },
    {
      icon: "palette-outline",
      title: "Avatar stages",
      description: "At special levels, your avatar grows and gets a new look.",
      bgColor: "#EEFFF4",
      borderColor: "#CFF7DD",
      iconBgColor: "#DCFCE7",
      iconColor: "#16A34A",
    },
  ];

export default function HomeScreen() {
  const params = useLocalSearchParams<{ initialName?: string }>();
  const { width } = useWindowDimensions();
  const dispatch = useDispatch<AppDispatch>();

  const isPhoneSmall = width < 390;
  const isPhone = width < 430;
  const isTablet = width >= 430 && width < 900;

  const helloFontStyle = isPhone
    ? styles.helloPhone
    : isTablet
      ? styles.helloTablet
      : styles.helloLarge;

  const timerFontStyle = isPhone
    ? styles.timerValueFontPhone
    : isTablet
      ? styles.timerValueFontTablet
      : styles.timerValueFontLarge;

  const avatarWrapStyle = isPhone
    ? styles.avatarWrapPhone
    : isTablet
      ? styles.avatarWrapTablet
      : styles.avatarWrapLarge;

  const avatarBlockWidthStyle = isPhone
    ? styles.avatarBlockPhone
    : isTablet
      ? styles.avatarBlockTablet
      : styles.avatarBlockLarge;

  const [avatarInfoVisible, setAvatarInfoVisible] = useState(false);
  const [avatarInfoIndex, setAvatarInfoIndex] = useState(0);
  const [permGate, setPermGate] = useState<"checking" | "ok" | "missing">(
    "checking"
  );

  const [screenTime, setScreenTime] = useState({
    remainingMinutes: 0,
    usedTodayMinutes: 0,
    dailyLimitMinutes: 0,
    extraMinutes: 0,
    limitEnabled: false,
    limitMode: "NONE",
    manualLockEnabled: false,
    dailyLimitLockActive: false,
    weeklyLimitLockActive: false,
    scheduleLockActive: false,
    isScheduleMode: false,
    isBlockedNow: false,
    nextBlockAt: null as string | null,
    blockEndsAt: null as string | null,
  });

  const activeChildId = useSelector(
    (state: RootState) => state.auth.activeChildId
  );

  const childrenList = useSelector(
    (state: RootState) => state.children.childrenList
  );

  const deviceId = useSelector((state: RootState) => state.auth.deviceId);
  const parentId = useSelector((state: RootState) => state.auth.parentId);
  const childPalette = useSelector(selectChildPalette);
  const isHomeFocused = useIsFocused();

  const refreshPermissionGate = useCallback(async (showChecking = false) => {
    if (showChecking) setPermGate("checking");

    try {
      const snapshot = await fetchChildPermissionSnapshot();
      setPermGate(snapshot.allSatisfied ? "ok" : "missing");
    } catch {
      setPermGate("missing");
    }
  }, []);

  const activeChildData = useMemo(() => {
    if (activeChildId == null || String(activeChildId).trim() === "") {
      return undefined;
    }

    const list = Array.isArray(childrenList) ? childrenList : [];

    return list.find(
      (child: Child) => String(child._id) === String(activeChildId)
    );
  }, [childrenList, activeChildId]);

  const handleSyncLocation = async (requestData?: any) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const lastUpdated = new Date().toISOString();

      const locationData = {
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      };

      const resolvedDeviceId = deviceId && String(deviceId).trim();
      const targetParentId = requestData?.parentId || parentId;

      if (targetParentId) {
        emitEvent(REQUEST_CHILD_LOCATION, {
          parentId: targetParentId,
          childId: String(activeChildId),
          location: {
            lat: locationData.lat,
            lng: locationData.lng,
          },
          lastUpdated,
        });
      }

      if (resolvedDeviceId) {
        await dispatch(
          updateDeviceLocation({
            childId: String(activeChildId),
            deviceId: resolvedDeviceId,
            location: locationData,
          })
        ).unwrap();
      } else {
        showInfoToast(
          "Please ask your parent to reconnect this device so location can be saved.",
          "Device not linked"
        );
      }
    } catch (error) {
      showErrorToast("Could not to sync location.", "Error");
    }
  };

  useEffect(() => {
    if (!activeChildId) return;

    connectSocket(
      String(activeChildId),
      "child",
      parentId ? { parentId: String(parentId) } : undefined
    );

    const unsubscribe = onEvent(REQUEST_CHILD_LOCATION, (data) => {
      handleSyncLocation(data);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [activeChildId, parentId]);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchCurrentChildProfileThunk());
      void refreshPermissionGate(false);
    }, [dispatch, refreshPermissionGate])
  );

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (next === "active") {
        void refreshPermissionGate(false);
      }
    });

    return () => sub.remove();
  }, [refreshPermissionGate]);

  const loadScreenTime = async () => {
    try {
      if (!DeviceControl?.getRemainingTime) {
        console.log("DeviceControl.getRemainingTime is not available");
        return;
      }

      const result = await DeviceControl.getRemainingTime();

      setScreenTime({
        remainingMinutes: Number(result.remainingMinutes) || 0,
        usedTodayMinutes: Number(result.usedTodayMinutes) || 0,
        dailyLimitMinutes: Number(result.dailyLimitMinutes) || 0,
        extraMinutes: Number(result.extraMinutes) || 0,
        limitEnabled: Boolean(result.limitEnabled),
        limitMode: String(result.limitMode || "NONE"),
        manualLockEnabled: Boolean(result.manualLockEnabled),
        dailyLimitLockActive: Boolean(result.dailyLimitLockActive),
        weeklyLimitLockActive: Boolean(result.weeklyLimitLockActive),
        scheduleLockActive: Boolean(result.scheduleLockActive),
        isScheduleMode: Boolean(result.isScheduleMode),
        isBlockedNow: Boolean(result.isBlockedNow),
        nextBlockAt: result.nextBlockAt ?? null,
        blockEndsAt: result.blockEndsAt ?? null,
      });
    } catch (e) {
      console.log("Error loading screen time", e);
    }
  };

  useEffect(() => {
    loadScreenTime();

    const interval = setInterval(() => {
      loadScreenTime();
    }, 5000);

    return () => clearInterval(interval);
  }, [deviceId]);

  useEffect(() => {
    async function syncChildDeviceData() {
      if (!activeChildId || !deviceId) return;

      try {
        if (!DeviceControl) {
          console.log("DeviceControl native module is not available");
          return;
        }

        if (DeviceControl.getInstalledApps) {
          const apps = await DeviceControl.getInstalledApps();

          await dispatch(
            syncInstalledAppsThunk({
              childId: String(activeChildId),
              deviceId: String(deviceId),
              applications: apps,
            })
          ).unwrap();

          console.log("Installed apps synced:", apps.length);
        } else {
          console.log("DeviceControl.getInstalledApps is not available");
        }

        if (DeviceControl.getAppUsageStats) {
          const usageStats = await DeviceControl.getAppUsageStats();

          console.log("APP USAGE STATS:", usageStats);

          const youtubeUsage = usageStats.find(
            (app: any) =>
              app.packageName === "com.google.android.youtube" ||
              String(app.packageName).toLowerCase().includes("youtube")
          );

          console.log("YOUTUBE USAGE:", youtubeUsage);

          await dispatch(
            syncAppUsageThunk({
              childId: String(activeChildId),
              deviceId: String(deviceId),
              usageStats,
            })
          ).unwrap();

        } else {
          console.log("DeviceControl.getAppUsageStats is not available");
        }
      } catch (error) {
        console.log("Failed to sync child device data:", error);
      }
    }

    syncChildDeviceData();
  }, [dispatch, activeChildId, deviceId]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (next === "active") {
        loadScreenTime();

        if (activeChildId && deviceId && DeviceControl?.getAppUsageStats) {
          DeviceControl.getAppUsageStats()
            .then((usageStats: any[]) => {
              console.log("APP USAGE STATS ON APP ACTIVE:", usageStats);

              const youtubeUsage = usageStats.find(
                (app: any) =>
                  app.packageName === "com.google.android.youtube" ||
                  String(app.packageName).toLowerCase().includes("youtube")
              );

              return dispatch(
                syncAppUsageThunk({
                  childId: String(activeChildId),
                  deviceId: String(deviceId),
                  usageStats,
                })
              ).unwrap();
            })
            .then(() => {
              console.log("App usage synced after returning to app");
            })
            .catch((error: unknown) => {
              console.log("Failed to sync app usage on app active:", error);
            });
        }
      }
    });

    return () => sub.remove();
  }, [dispatch, activeChildId, deviceId]);

  const userName = (
    activeChildData?.name?.trim() ||
    (typeof params.initialName === "string" ? params.initialName.trim() : "") ||
    "Child"
  ).trim();

  const levelValue = Number(activeChildData?.avatar?.level) || 1;
  const avatarLevel = levelValue;
  const pointsValue = Number(activeChildData?.avatar?.currentXp) || 0;

  const xpRequiredForCurrentLevel = getXpRequiredForLevel(levelValue);

  const xpLeftToNextLevel = Math.max(
    0,
    xpRequiredForCurrentLevel - pointsValue
  );

  const xpProgressPercent =
    xpRequiredForCurrentLevel > 0
      ? Math.min(100, (pointsValue / xpRequiredForCurrentLevel) * 100)
      : 0;

  const xpMarkerPercent = Math.min(Math.max(xpProgressPercent, 8), 92);

  const avatarStage = getAvatarStageFromLevel(levelValue);
  const nextAvatarStageLevel = getNextAvatarStageLevel(levelValue);
  const avatarStageInfo = AVATAR_STAGE_INFO[avatarStage] ?? AVATAR_STAGE_INFO[1];
  const currentAvatarInfoSlide = AVATAR_INFO_SLIDES[avatarInfoIndex];

  const goToPreviousAvatarInfo = () => {
    setAvatarInfoIndex((prev) =>
      prev === 0 ? AVATAR_INFO_SLIDES.length - 1 : prev - 1
    );
  };

  const goToNextAvatarInfo = () => {
    setAvatarInfoIndex((prev) =>
      prev === AVATAR_INFO_SLIDES.length - 1 ? 0 : prev + 1
    );
  };

  const homeAvatarImage = useMemo(
    () =>
      getAvatarImage({
        gender: activeChildData?.gender,
        level: avatarLevel,
        imageName: activeChildData?.avatar?.img,
      }),
    [activeChildData?.gender, avatarLevel, activeChildData?.avatar?.img]
  );

  const coinsValue =
    activeChildData?.coins != null ? String(activeChildData.coins) : "0";

  const formatTime = (minutes: number) => {
    const safeMinutes = Math.max(0, Number(minutes) || 0);
    const h = Math.floor(safeMinutes / 60);
    const m = safeMinutes % 60;

    return `\u200E${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}\u200E`;
  };

  const total = screenTime.dailyLimitMinutes + screenTime.extraMinutes;

  const percent =
    screenTime.limitEnabled && total > 0
      ? Math.min((screenTime.usedTodayMinutes / total) * 100, 100)
      : 0;

  const isNoLimit = !screenTime.limitEnabled;

  const isScheduleMode = screenTime.limitMode === "SCHEDULE";
  const isWeeklyMode = screenTime.limitMode === "WEEKLY";

  const isDailyMode = screenTime.limitMode === "DAILY";

  const isDailyLimitReached =
    screenTime.limitEnabled &&
    isDailyMode &&
    (screenTime.dailyLimitLockActive === true ||
      screenTime.remainingMinutes <= 0);

  const isWeeklyLimitReached =
    screenTime.limitEnabled &&
    isWeeklyMode &&
    (screenTime.weeklyLimitLockActive === true ||
      screenTime.remainingMinutes <= 0);

  const isBlockedBySchedule =
    isScheduleMode && screenTime.isBlockedNow === true;

  const timerTitle = isScheduleMode
    ? "Weekly schedule"
    : isWeeklyMode
      ? "Weekly time left"
      : "Time left";
  const timerMainText = !screenTime.limitEnabled
    ? "No limit"
    : isScheduleMode
      ? isBlockedBySchedule
        ? "Blocked now"
        : "Open now"
      : isDailyLimitReached
        ? "Daily limit reached"
        : isWeeklyLimitReached
          ? "Weekly limit reached"
          : formatTime(screenTime.remainingMinutes);

  const timerSubText = !screenTime.limitEnabled
    ? "There is no active limit right now"
    : isScheduleMode
      ? isBlockedBySchedule
        ? screenTime.blockEndsAt
          ? `This is a scheduled break time. Ends at ${screenTime.blockEndsAt}`
          : "This is a scheduled break time"
        : screenTime.nextBlockAt
          ? `Next block at ${screenTime.nextBlockAt}`
          : "You can use the device right now"
      : isDailyLimitReached
        ? "You used all your screen time for today"
        : isWeeklyLimitReached
          ? "You used all your screen time for this week"
          : isWeeklyMode
            ? "Weekly screen time limit is active"
            : screenTime.remainingMinutes <= 5
              ? "Your time is almost over"
              : "Use your screen time wisely";

  const shouldShowProgress =
    screenTime.limitEnabled && !isScheduleMode;

  return (
    <View
      style={[
        styles.childHomeRoot,
        { backgroundColor: childPalette.screenBg },
      ]}
    >
      <ScreenLayout>
        <View style={[styles.page, isPhoneSmall && styles.pageSmall]}>
          <View style={styles.headerCard}>
            <View style={styles.headerRow}>
              <View style={styles.avatarWrapRow}>
                <View style={[styles.avatarBlock, avatarBlockWidthStyle]}>
                  <Pressable
                    onPress={() => {
                      setAvatarInfoIndex(0);
                      setAvatarInfoVisible(true);
                    }}
                    style={[styles.avatarWrap, avatarWrapStyle]}
                    accessibilityRole="button"
                    accessibilityLabel="Open avatar progress explanation"
                  >
                    <Image
                      source={homeAvatarImage}
                      style={styles.avatarPhoto}
                      contentFit="contain"
                      transition={160}
                      accessibilityLabel={`${userName} avatar`}
                    />
                  </Pressable>

                  <View style={styles.levelBadge}>
                    <AppText weight="extraBold" style={styles.levelBadgeText}>
                      Lv. {levelValue}
                    </AppText>
                  </View>

                  <View style={styles.xpProgressWrapper}>
                    <View style={styles.xpProgressHeader}>
                      <AppText weight="bold" style={styles.xpProgressText}>
                        {pointsValue}/{xpRequiredForCurrentLevel} XP
                      </AppText>

                      <AppText weight="bold" style={styles.xpProgressText}>
                        {xpLeftToNextLevel} left
                      </AppText>
                    </View>

                    <View style={styles.xpProgressTrack}>
                      <View
                        style={[
                          styles.xpProgressFill,
                          { width: `${xpProgressPercent}%` },
                        ]}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.headerTextSide}>
                  <AppText
                    weight="extraBold"
                    style={[styles.hello, helloFontStyle]}
                    numberOfLines={1}
                  >
                    {`Hi, ${userName}`}
                  </AppText>

                  <View style={styles.coinsSummaryBadge}>
                    <View style={styles.coinsSummaryTopRow}>
                      <CoinIcon size={18} />

                      <AppText weight="extraBold" style={styles.coinsSummaryText}>
                        {coinsValue} coins
                      </AppText>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardTitleRowCentered}>
              <View style={[styles.cardTitleLeft, styles.cardTitleLeftCentered]}>
                <View style={styles.iconBadge}>
                  <MaterialCommunityIcons
                    name={ICON.time}
                    size={18}
                    color="#0F172A"
                  />
                </View>

                <AppText weight="extraBold" style={styles.cardTitle}>
                  {timerTitle}
                </AppText>
              </View>
            </View>

            <AppText
              weight="extraBold"
              style={[
                styles.timerValue,
                timerFontStyle,
                styles.timerValueCentered,
              ]}
            >
              {timerMainText}
            </AppText>

            {shouldShowProgress ? (
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${percent}%` }]} />
              </View>
            ) : null}

            <AppText
              weight="bold"
              style={[styles.timerSub, styles.timerSubCentered]}
            >
              {timerSubText}
            </AppText>
          </View>

          <View style={styles.grid}>
            <Tile
              iconName={ICON.apps}
              label="Apps"
              colorKey="apps"
              onPress={() =>
                router.push(`/Child/apps?deviceId=${deviceId}` as Href)
              }
            />

            <Tile
              iconName={ICON.extend}
              label="Request"
              onPress={() => router.push("/Child/extendTime" as Href)}
              colorKey="extend"
            />

            <Tile
              iconName={ICON.shop}
              label="Shop"
              colorKey="shop"
              onPress={() => router.push("/Child/store" as Href)}
            />

            <Tile
              iconName={ICON.tasks}
              label="Tasks"
              colorKey="tasks"
              onPress={() => router.push("/Child/tasks" as Href)}
            />

            <Tile
              iconName={ICON.achievements}
              label="Achievements"
              colorKey="achievements"
              onPress={() => router.push("/Child/achievements" as Href)}
            />

            <Tile
              iconName={ICON.goals}
              label="Badges"
              colorKey="goals"
              onPress={() => router.push("/Child/goals" as Href)}
            />

            <Tile
              iconName={ICON.charts}
              label="Charts"
              colorKey="reports"
              onPress={() => router.push("/Child/reports" as Href)}
            />

            <Tile
              iconName={ICON.bulb}
              label="Ideas"
              colorKey="ideas"
              onPress={() => router.push("/Child/ideas" as Href)}
            />

            <Tile
              iconName={ICON.settings}
              label="Settings"
              colorKey="settings"
              onPress={() => router.push("/Child/settings" as Href)}
            />
          </View>

          <Pressable
            onPress={() => router.push("/Child/sos" as Href)}
            style={({ pressed }) => [
              styles.panicBtn,
              pressed && styles.panicPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Send SOS alert"
            accessibilityState={{ disabled: false }}
          >
            <View style={styles.panicContent}>
              <View style={styles.panicIconBadge}>
                <MaterialCommunityIcons
                  name={ICON.panic}
                  size={24}
                  color="#fff"
                />
              </View>

              <AppText weight="extraBold" style={styles.panicText}>
                SOS
              </AppText>
            </View>
          </Pressable>

          <Modal
            visible={avatarInfoVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setAvatarInfoVisible(false)}
          >
            <Pressable
              style={styles.avatarModalOverlay}
              onPress={() => setAvatarInfoVisible(false)}
            >
              <Pressable style={styles.avatarInfoCard} onPress={() => { }}>
                <View style={styles.avatarInfoImageWrap}>
                  <Image
                    source={homeAvatarImage}
                    style={styles.avatarInfoImage}
                    contentFit="contain"
                    transition={160}
                  />
                </View>

                <View style={styles.avatarInfoLevelBadge}>
                  <AppText weight="extraBold" style={styles.levelBadgeText}>
                    Lv. {levelValue}
                  </AppText>
                </View>

                <View style={styles.avatarStageTitleRow}>
                  <MaterialCommunityIcons
                    name={avatarStageInfo.icon}
                    size={22}
                    color="#5B7FD6"
                  />

                  <AppText weight="extraBold" style={styles.avatarInfoTitle}>
                    {avatarStageInfo.title}
                  </AppText>
                </View>

                <AppText weight="bold" style={styles.avatarInfoSubtitle}>
                  {avatarStageInfo.subtitle}
                </AppText>

                <View style={styles.avatarInfoXpBlock}>
                  <View
                    style={[
                      styles.avatarInfoXpMarker,
                      { left: `${xpMarkerPercent}%` },
                    ]}
                  >
                    <AppText
                      weight="extraBold"
                      style={styles.avatarInfoXpMarkerText}
                    >
                      {pointsValue}/{xpRequiredForCurrentLevel} XP
                    </AppText>
                  </View>

                  <View style={styles.avatarInfoProgressTrack}>
                    <View
                      style={[
                        styles.avatarInfoProgressFill,
                        { width: `${xpProgressPercent}%` },
                      ]}
                    />
                  </View>

                  <View style={styles.avatarInfoXpRangeRow}>
                    <AppText weight="bold" style={styles.avatarInfoXpRangeText}>
                      Level {levelValue}
                    </AppText>

                    <AppText weight="bold" style={styles.avatarInfoXpRangeText}>
                      Level {levelValue + 1}
                    </AppText>
                  </View>
                </View>

                <View
                  style={[
                    styles.avatarInfoSlideCard,
                    {
                      backgroundColor: currentAvatarInfoSlide.bgColor,
                      borderColor: currentAvatarInfoSlide.borderColor,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.avatarInfoSlideIconWrap,
                      {
                        backgroundColor: currentAvatarInfoSlide.iconBgColor,
                        borderColor: currentAvatarInfoSlide.borderColor,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={currentAvatarInfoSlide.icon}
                      size={34}
                      color={currentAvatarInfoSlide.iconColor}
                    />
                  </View>

                  <AppText weight="extraBold" style={styles.avatarInfoSlideTitle}>
                    {currentAvatarInfoSlide.title}
                  </AppText>

                  <AppText weight="medium" style={styles.avatarInfoSlideDescription}>
                    {currentAvatarInfoSlide.description}
                  </AppText>
                </View>

                <View style={styles.avatarInfoControlsRow}>
                  <Pressable
                    onPress={goToPreviousAvatarInfo}
                    accessibilityRole="button"
                    accessibilityLabel="Previous avatar information"
                    style={({ pressed }) => [
                      styles.avatarInfoArrowButton,
                      pressed && styles.avatarInfoArrowPressed,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="chevron-left"
                      size={26}
                      color="#2563EB"
                    />
                  </Pressable>

                  <AppText weight="bold" style={styles.avatarInfoStepText}>
                    {avatarInfoIndex + 1} / {AVATAR_INFO_SLIDES.length}
                  </AppText>

                  <Pressable
                    onPress={goToNextAvatarInfo}
                    accessibilityRole="button"
                    accessibilityLabel="Next avatar information"
                    style={({ pressed }) => [
                      styles.avatarInfoArrowButton,
                      pressed && styles.avatarInfoArrowPressed,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={26}
                      color="#2563EB"
                    />
                  </Pressable>
                </View>

                <AppText weight="bold" style={styles.avatarInfoDescription}>
                  {nextAvatarStageLevel
                    ? `Keep going!\nA new avatar look and title are waiting for you at level ${nextAvatarStageLevel}.`
                    : "Amazing! You unlocked every avatar look."}
                </AppText>

                <Pressable
                  style={styles.avatarInfoButton}
                  onPress={() => setAvatarInfoVisible(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Close avatar explanation"
                >
                  <AppText weight="extraBold" style={styles.avatarInfoButtonText}>
                    {"Let's go!"}
                  </AppText>
                </Pressable>
              </Pressable>
            </Pressable>
          </Modal>
        </View>
      </ScreenLayout>

      <Modal
        visible={isHomeFocused && permGate !== "ok"}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {
          /* Blocking until all permissions are granted */
        }}
      >
        <View style={styles.permissionModalOverlay}>
          <View
            style={[
              styles.permissionModalCard,
              { borderColor: childPalette.cardBorder },
            ]}
          >
            {permGate === "checking" ? (
              <>
                <ActivityIndicator size="large" color={childPalette.accent} />

                <AppText weight="bold" style={styles.permissionModalBody}>
                  Checking permissions…
                </AppText>
              </>
            ) : (
              <>
                <AppText weight="extraBold" style={styles.permissionModalTitle}>
                  Permissions needed
                </AppText>

                <AppText weight="bold" style={styles.permissionModalBody}>
                  To use Screen Guardian, turn on every permission in Settings.
                </AppText>

                <Pressable
                  style={({ pressed }) => [
                    styles.permissionModalBtn,
                    { backgroundColor: childPalette.accent },
                    pressed && styles.permissionModalBtnPressed,
                  ]}
                  onPress={() => router.push("/Child/settings" as Href)}
                  accessibilityRole="button"
                  accessibilityLabel="Open permissions settings"
                >
                  <AppText weight="extraBold" style={styles.permissionModalBtnText}>
                    Open permissions
                  </AppText>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Tile({
  iconName,
  label,
  onPress,
  colorKey,
  disabled = false,
}: {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  onPress?: () => void;
  colorKey: keyof typeof TILE_COLORS;
  disabled?: boolean;
}) {
  const c = TILE_COLORS[colorKey];

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: c.bg, borderColor: c.border },
        pressed && !disabled && styles.tilePressed,
        disabled && styles.tileDisabled,
      ]}
      onPress={disabled ? undefined : onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <View style={styles.tileInner}>
        <View style={styles.tileIconZone}>
          <View style={[styles.tileIconWrap, disabled && styles.tileIconDisabled]}>
            <MaterialCommunityIcons
              name={iconName}
              size={26}
              color={disabled ? "#9CA3AF" : c.icon}
            />
          </View>
        </View>

        <View style={styles.tileLabelZone}>
          <AppText
            weight="bold"
            style={[styles.tileText, disabled && styles.tileTextDisabled]}
            numberOfLines={2}
          >
            {label}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}