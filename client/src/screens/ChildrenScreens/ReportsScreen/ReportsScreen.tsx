import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useFocusEffect, type Href } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

import {
  apiGetDeviceScreenTimeSnapshot,
  type DeviceScreenTimeSnapshot,
} from "@/src/api/device";
import type { RootState } from "@/src/redux/store/types";
import { selectChildPalette } from "@/src/redux/slices/child-theme-slice";
import { buildReportDaysFromHistory } from "@/src/utils/screenTimeHistory";
import {
  buildChildChartsFromScreenTime,
  type ChildScreenTimeInput,
} from "./buildChildReportsCharts";
import ChildReportsContent from "@/src/components/ReportsScreen/ChildReportsContent";
import EmptyStateCard from "@/src/components/EmptyStateCard/EmptyStateCard";
import ErrorStateCard from "@/src/components/ErrorStateCard/ErrorStateCard";
import { styles } from "../../ParentScreens/ReportsScreen/styles";

// Maps the API snapshot into chart input with the effective daily limit.
function screenTimeInputFromSnapshot(
  snapshot: DeviceScreenTimeSnapshot
): ChildScreenTimeInput {
  const isLimitEnabled = snapshot.isLimitEnabled === true;
  const limitMode = String(snapshot.limitMode ?? "NONE");
  const dailyLimitMinutes =
    isLimitEnabled && limitMode === "DAILY"
      ? Number(snapshot.dailyLimitMinutes ?? 0) +
        Number(snapshot.extraMinutesToday ?? 0)
      : null;

  const usedTodayMinutes = Number(snapshot.usedTodayMinutes ?? 0);
  const daysFromHistory = buildReportDaysFromHistory(
    snapshot.dailyUsageHistory,
    usedTodayMinutes
  );
  const serverDays = snapshot.days ?? [];
  const days =
    serverDays.length > 0 &&
    serverDays.some((day) => day.dateKey && (day.hasData || day.usedMinutes > 0))
      ? serverDays
      : daysFromHistory;

  return {
    usedTodayMinutes,
    dailyLimitMinutes,
    days:
      days.length > 0
        ? days.map((day, index) => ({
            ...day,
            usedMinutes: Math.max(
              Number(day.usedMinutes ?? 0),
              daysFromHistory[index]?.usedMinutes ?? 0
            ),
          }))
        : daysFromHistory,
  };
}

export default function ChildReportsScreen() {
  const navigation = useNavigation();
  const palette = useSelector(selectChildPalette);

  const [screenTimeSnapshot, setScreenTimeSnapshot] =
    useState<DeviceScreenTimeSnapshot | null>(null);
  const [isSnapshotLoading, setIsSnapshotLoading] = useState(false);
  const [snapshotError, setSnapshotError] = useState<string | null>(null);

  const activeChildId = useSelector(
    (state: RootState) => state.auth?.activeChildId ?? null
  );
  const deviceId = useSelector(
    (state: RootState) => state.auth?.deviceId ?? null
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: true,
      headerBackVisible: false,
      headerLeft: () => (
        <Pressable
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/Child/home" as Href);
            }
          }}
          hitSlop={12}
          style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center" }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialCommunityIcons name="chevron-left" size={30} color="#FFFFFF" />
        </Pressable>
      ),
    });
  }, [navigation]);

  const loadScreenTimeSnapshot = useCallback(async () => {
    const resolvedDeviceId = deviceId ? String(deviceId).trim() : "";

    if (!resolvedDeviceId) {
      setScreenTimeSnapshot(null);
      setSnapshotError(null);
      return;
    }

    setIsSnapshotLoading(true);
    setSnapshotError(null);

    try {
      const snapshot = await apiGetDeviceScreenTimeSnapshot(resolvedDeviceId);
      setScreenTimeSnapshot(snapshot);
    } catch {
      setScreenTimeSnapshot(null);
      setSnapshotError("Check your internet connection and open this screen again.");
    } finally {
      setIsSnapshotLoading(false);
    }
  }, [deviceId]);

  useFocusEffect(
    useCallback(() => {
      void loadScreenTimeSnapshot();
    }, [loadScreenTimeSnapshot])
  );

  const charts = useMemo(() => {
    if (!screenTimeSnapshot) {
      return null;
    }

    return buildChildChartsFromScreenTime(
      screenTimeInputFromSnapshot(screenTimeSnapshot)
    );
  }, [screenTimeSnapshot]);

  const isLoading = isSnapshotLoading && !screenTimeSnapshot && !snapshotError;

  const screenStyle = [styles.screen, { backgroundColor: palette.screenBg }];

  if (!activeChildId || !deviceId) {
    return (
      <View style={screenStyle}>
        <ScrollView contentContainerStyle={styles.feedbackWrap}>
          <EmptyStateCard
            icon="cellphone-link"
            title="Connect your device"
            subtitle="Connect this device to see your screen time reports."
          />
        </ScrollView>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={screenStyle}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </View>
    );
  }

  if (snapshotError || !charts) {
    return (
      <View style={screenStyle}>
        <ScrollView contentContainerStyle={styles.feedbackWrap}>
          {snapshotError ? (
            <ErrorStateCard
              title="Could not load reports"
              message={snapshotError}
            />
          ) : (
            <EmptyStateCard
              icon="chart-line"
              title="No reports yet"
              subtitle="Your screen time data will appear here once usage is tracked."
            />
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={screenStyle}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 8, paddingBottom: 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ChildReportsContent charts={charts} />
      </ScrollView>
    </View>
  );
}
