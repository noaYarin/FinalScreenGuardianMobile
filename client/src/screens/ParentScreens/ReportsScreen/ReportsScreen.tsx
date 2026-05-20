import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useLocalSearchParams } from "expo-router";

import ChildSelector from "@/src/components/ChildSelector/ChildSelector";
import AppText from "@/src/components/AppText/AppText";
import type { AppDispatch, RootState } from "@/src/redux/store/types";
import { getMyChildrenThunk } from "@/src/redux/thunks/childrenThunks";
import { fetchDevicesByChild } from "@/src/redux/thunks/deviceThunks";
import { fetchParentHomeSummaryThunk } from "@/src/redux/thunks/parentHomeThunks";
import {
  getChildScreenTimeReports,
  type HomeSummaryChild,
  type ScreenTimeUsageReport,
} from "@/src/api/parent";
import { store } from "@/src/redux/store";
import {
  setReportsSelectedChildId,
  setReportsTimeRange,
} from "@/src/redux/slices/reports-slice";

import {
  buildReportsDatasetFromReport,
  buildUsageReportFromSnapshot,
  mergeSnapshotWithHomeSummary,
  pickRepresentativeDevice,
  screenTimeSnapshotFromDevice,
} from "./buildReportsDataset";
import ReportsContent from "@/src/components/ReportsScreen/ReportsContent";
import ReportsMetricRow from "@/src/components/ReportsScreen/ReportsMetricRow";
import { styles } from "./styles";
import { showErrorToast } from "@/src/utils/appToast";

function buildFallbackReport(
  devicesByChild: RootState["devices"]["byChildId"],
  childrenSummary: HomeSummaryChild[],
  childId: string
): ScreenTimeUsageReport | null {
  const devices = devicesByChild[childId] ?? [];
  const device = pickRepresentativeDevice(devices);

  if (!device) {
    return {
      days: [],
      weeklyTotalMinutes: 0,
      dailyAverageMinutes: 0,
      topApp: null,
      hasLinkedDevice: false,
    };
  }

  const fromDevice = screenTimeSnapshotFromDevice(device);
  if (!fromDevice) {
    return null;
  }

  const homeSummary = childrenSummary.find(
    (child) => String(child.childId) === String(childId)
  );

  return buildUsageReportFromSnapshot(
    mergeSnapshotWithHomeSummary(fromDevice, homeSummary)
  );
}

export default function ParentReportsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useLocalSearchParams<{ childId?: string }>();

  const [usageReport, setUsageReport] = useState<ScreenTimeUsageReport | null>(
    null
  );
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const childrenList = useSelector(
    (state: RootState) => state.children.childrenList ?? []
  );
  const selectedChildId = useSelector(
    (state: RootState) => state.reports.selectedChildId
  );
  const selectedTimeRange = useSelector((state: RootState) => {
    const range = state.reports.selectedTimeRange;
    return range === "weekly" ? "weekly" : "daily";
  });

  const routeChildId =
    typeof params.childId === "string" && params.childId.trim()
      ? params.childId.trim()
      : null;

  const effectiveChildId = selectedChildId;

  useEffect(() => {
    dispatch(getMyChildrenThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!routeChildId) {
      return;
    }

    dispatch(setReportsSelectedChildId(routeChildId));
  }, [dispatch, routeChildId]);

  useEffect(() => {
    if (childrenList.length === 0) {
      return;
    }

    const hasValidSelection = childrenList.some(
      (child) => String(child._id) === String(selectedChildId)
    );

    if (!hasValidSelection) {
      dispatch(setReportsSelectedChildId(String(childrenList[0]._id)));
    }
  }, [childrenList, selectedChildId, dispatch]);

  const loadUsageReport = useCallback(async () => {
    if (!effectiveChildId) {
      setUsageReport(null);
      setLoadError(null);
      return;
    }

    setIsReportLoading(true);
    setLoadError(null);

    try {
      await Promise.all([
        dispatch(fetchDevicesByChild(effectiveChildId)).unwrap(),
        dispatch(fetchParentHomeSummaryThunk()).unwrap(),
      ]);
    } catch {
      showErrorToast("Could not load reports");
      setLoadError("Could not load reports");
    }

    try {
      const report = await getChildScreenTimeReports(effectiveChildId);
      setUsageReport(report);
    } catch (error) {
      const state = store.getState();
      const fallback = buildFallbackReport(
        state.devices.byChildId,
        state.parentHome.childrenSummary ?? [],
        effectiveChildId
      );

      if (fallback?.hasLinkedDevice) {
        setUsageReport(fallback);
      } else {
        setLoadError(
          error instanceof Error ? error.message : "Could not load reports"
        );
      }
    } finally {
      setIsReportLoading(false);
    }
  }, [dispatch, effectiveChildId]);

  useEffect(() => {
    void loadUsageReport();
  }, [loadUsageReport]);

  useFocusEffect(
    useCallback(() => {
      void loadUsageReport();
    }, [loadUsageReport])
  );

  const dataset = useMemo(() => {
    if (!usageReport?.hasLinkedDevice) {
      return null;
    }

    return buildReportsDatasetFromReport(selectedTimeRange, usageReport);
  }, [selectedTimeRange, usageReport]);

  const hasUsageData = (usageReport?.weeklyTotalMinutes ?? 0) > 0;

  if (!effectiveChildId) {
    return <View style={styles.screen} />;
  }

  if (isReportLoading && !usageReport) {
    return (
      <View style={styles.screen}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </View>
    );
  }

  if (!usageReport?.hasLinkedDevice) {
    return (
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <ChildSelector
              selectedChildId={effectiveChildId}
              onSelectChild={(childId) =>
                dispatch(setReportsSelectedChildId(childId))
              }
            />
            <View style={styles.emptyStateCard}>
              <AppText weight="bold" style={styles.emptyStateTitle}>
                No device connected
              </AppText>
              <AppText style={styles.emptyStateText}>
                Connect the child's device to start tracking screen time and view
                reports.
              </AppText>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (!dataset) {
    return (
      <View style={styles.screen}>
        <View style={styles.loadingWrap}>
          <ReportsMetricRow label="Daily average" value="No data yet" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ReportsContent
          dataset={dataset}
          selectedTimeRange={selectedTimeRange}
          onSelectTimeRange={(range) => dispatch(setReportsTimeRange(range))}
          topSlot={
            <>
              <ChildSelector
                selectedChildId={effectiveChildId}
                onSelectChild={(childId) =>
                  dispatch(setReportsSelectedChildId(childId))
                }
              />
              {loadError ? (
                <AppText style={styles.hintText}>{loadError}</AppText>
              ) : null}
              {!hasUsageData ? (
                <View style={styles.emptyStateCard}>
                  <AppText weight="bold" style={styles.emptyStateTitle}>
                    No usage recorded yet
                  </AppText>
                  <AppText style={styles.emptyStateText}>
                    Screen time appears here after the child device syncs usage.
                  </AppText>
                </View>
              ) : null}
            </>
          }
        />
      </ScrollView>
    </View>
  );
}
