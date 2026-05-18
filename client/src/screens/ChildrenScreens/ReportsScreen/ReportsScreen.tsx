import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  NativeModules,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useFocusEffect, type Href } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/src/redux/store/types";
import { setReportsSelectedChildId } from "@/src/redux/slices/reports-slice";
import {
  buildChildChartsFromSnapshot,
  type ScreenTimeSnapshot,
} from "./buildChildReportsCharts";
import ChildReportsContent from "@/src/components/ReportsScreen/ChildReportsContent";
import ReportsMetricRow from "@/src/components/ReportsScreen/ReportsMetricRow";
import { styles } from "../../ParentScreens/ReportsScreen/styles";

const { DeviceControl } = NativeModules;

export default function ChildReportsScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const [childSnapshot, setChildSnapshot] = useState<ScreenTimeSnapshot | null>(
    null
  );
  const [isChildSnapshotLoading, setIsChildSnapshotLoading] = useState(false);

  const activeChildId = useSelector(
    (state: RootState) => state.auth.activeChildId
  );
  const selectedChildId = useSelector(
    (state: RootState) => state.reports.selectedChildId
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

  useEffect(() => {
    if (activeChildId) {
      dispatch(setReportsSelectedChildId(activeChildId));
    }
  }, [activeChildId, dispatch]);

  const effectiveChildId = activeChildId ?? selectedChildId;

  const loadChildSnapshot = useCallback(async () => {
    if (!DeviceControl?.getRemainingTime) {
      return;
    }

    setIsChildSnapshotLoading(true);

    try {
      const result = await DeviceControl.getRemainingTime();
      const dailyLimitMinutes = Boolean(result.limitEnabled)
        ? Number(result.dailyLimitMinutes ?? 0) +
          Number(result.extraMinutes ?? 0)
        : null;

      setChildSnapshot({
        usedTodayMinutes: Number(result.usedTodayMinutes) || 0,
        usedWeekMinutes: Number(result.usedWeekMinutes) || 0,
        dailyLimitMinutes,
      });
    } catch {
      setChildSnapshot(null);
    } finally {
      setIsChildSnapshotLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadChildSnapshot();
      const interval = setInterval(() => {
        void loadChildSnapshot();
      }, 5000);

      return () => clearInterval(interval);
    }, [loadChildSnapshot])
  );

  const charts = useMemo(() => {
    if (!childSnapshot) {
      return null;
    }

    return buildChildChartsFromSnapshot(childSnapshot);
  }, [childSnapshot]);

  const isLoading = isChildSnapshotLoading && !childSnapshot;

  if (!effectiveChildId) {
    return <View style={styles.screen} />;
  }

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </View>
    );
  }

  if (!charts) {
    return (
      <View style={styles.screen}>
        <View style={styles.loadingWrap}>
          <ReportsMetricRow
            label="Daily average"
            value="No data yet"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
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
