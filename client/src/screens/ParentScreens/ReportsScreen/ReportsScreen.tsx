import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router, useFocusEffect, useLocalSearchParams, type Href } from "expo-router";

import ChildDeviceSelector from "@/src/components/ChildDeviceSelector/ChildDeviceSelector";
import AppText from "@/src/components/AppText/AppText";
import type { AppDispatch, RootState } from "@/src/redux/store/types";
import { getMyChildrenThunk } from "@/src/redux/thunks/childrenThunks";
import { fetchDevicesByChild } from "@/src/redux/thunks/deviceThunks";
import { fetchParentHomeSummaryThunk } from "@/src/redux/thunks/parentHomeThunks";
import {
  getChildScreenTimeReports,
  type ScreenTimeUsageReport,
} from "@/src/api/parent";
import { store } from "@/src/redux/store";
import {
  setReportsSelectedChildId,
  setReportsTimeRange,
} from "@/src/redux/slices/reports-slice";
import EmptyStateCard from "@/src/components/EmptyStateCard/EmptyStateCard";
import {
  buildEmptyUsageReport,
  buildReportsDatasetFromReport,
  pickRepresentativeDevice,
} from "./buildReportsDataset";
import ReportsContent from "@/src/components/ReportsScreen/ReportsContent";
import ReportsMetricRow from "@/src/components/ReportsScreen/ReportsMetricRow";
import { styles } from "./styles";
import { showErrorToast } from "@/src/utils/appToast";
import type { Device } from "@/src/api/device";

const EMPTY_DEVICES: Device[] = [];

function buildFallbackReport(
  devicesByChild: RootState["devices"]["byChildId"],
  childId: string
): ScreenTimeUsageReport | null {
  const devices = devicesByChild[childId] ?? [];
  const device = pickRepresentativeDevice(devices);

  if (!device) {
    return {
      days: [],
      weeks: [],
      weeklyTotalMinutes: 0,
      monthlyTotalMinutes: 0,
      dailyAverageMinutes: 0,
      monthlyAverageMinutes: 0,
      topApp: null,
      hasLinkedDevice: false,
    };
  }

  return buildEmptyUsageReport();
}

export default function ParentReportsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useLocalSearchParams<{ childId?: string }>();

  const [usageReport, setUsageReport] = useState<ScreenTimeUsageReport | null>(
    null
  );
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");

  const childrenList = useSelector(
    (state: RootState) => state.children.childrenList ?? []
  );
  const childrenLoading = useSelector(
    (state: RootState) => state.children.isLoading
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

  const devicesForChild = useSelector((state: RootState) => {
    if (!effectiveChildId) {
      return EMPTY_DEVICES;
    }

    return state.devices.byChildId[effectiveChildId] ?? EMPTY_DEVICES;
  });

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

  useEffect(() => {
    if (!effectiveChildId) {
      return;
    }

    dispatch(fetchDevicesByChild(effectiveChildId));
  }, [dispatch, effectiveChildId]);

  const firstDeviceId =
    devicesForChild.length > 0 ? String(devicesForChild[0]._id) : "";

  useEffect(() => {
    if (!firstDeviceId) {
      setSelectedDeviceId((current) => (current === "" ? current : ""));
      return;
    }

    setSelectedDeviceId((current) => {
      const hasSelection = devicesForChild.some(
        (device) => String(device._id) === String(current)
      );

      return hasSelection ? current : firstDeviceId;
    });
  }, [devicesForChild, firstDeviceId]);

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

    if (!selectedDeviceId) {
      setUsageReport(null);
      setIsReportLoading(false);
      return;
    }

    try {
      const report = await getChildScreenTimeReports(
        effectiveChildId,
        selectedDeviceId
      );
      setUsageReport(report);
    } catch (error) {
      const state = store.getState();
      const fallback = buildFallbackReport(
        state.devices.byChildId,
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
  }, [dispatch, effectiveChildId, selectedDeviceId]);

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

  const hasUsageData =
    (usageReport?.weeklyTotalMinutes ?? 0) > 0 ||
    (usageReport?.monthlyTotalMinutes ?? 0) > 0 ||
    (usageReport?.days?.some((day) => day.hasData) ?? false) ||
    (usageReport?.weeks?.some((week) => week.hasData) ?? false);

  const onPressAddChild = () => router.push("/Parent/addChild" as Href);

  if (childrenLoading && childrenList.length === 0) {
    return (
      <View style={styles.screen}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </View>
    );
  }

  if (childrenList.length === 0 || !effectiveChildId) {
    return (
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <EmptyStateCard
              icon="account-outline"
              title="No children yet"
              subtitle="Add your first child to start tracking screen time and view reports."
              buttonLabel="Add Child"
              onPressButton={onPressAddChild}
              buttonStyle={styles.btnSecondary}
              buttonTextStyle={styles.btnSecondaryText}
            />
          </View>
        </ScrollView>
      </View>
    );
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
            <ChildDeviceSelector
              selectedChildId={effectiveChildId}
              onSelectChild={(childId) => {
                dispatch(setReportsSelectedChildId(childId));
                setSelectedDeviceId("");
              }}
              selectedDeviceId={selectedDeviceId}
              onSelectDevice={setSelectedDeviceId}
              showDevices
            />
            <EmptyStateCard
              icon="cellphone-link-off"
              title="No device connected"
              subtitle="Connect the child's device to start tracking screen time and view reports."
            />
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
          bottomSlot={
            <Pressable
              style={styles.generateReportBtn}
              onPress={() =>
                router.push(
                  `/Parent/generateReport?childId=${encodeURIComponent(effectiveChildId)}` as Href
                )
              }
            >
              <AppText weight="bold" style={styles.generateReportBtnText}>
                Generate Smart report
              </AppText>
            </Pressable>
          }
          topSlot={
            <>
              <ChildDeviceSelector
                selectedChildId={effectiveChildId}
                onSelectChild={(childId) => {
                  dispatch(setReportsSelectedChildId(childId));
                  setSelectedDeviceId("");
                }}
                selectedDeviceId={selectedDeviceId}
                onSelectDevice={setSelectedDeviceId}
                showDevices
              />
              {loadError ? (
                <AppText style={styles.hintText}>{loadError}</AppText>
              ) : null}
              {!hasUsageData ? (
                <EmptyStateCard
                  icon="chart-line"
                  title="No usage recorded yet"
                  subtitle="Screen time appears here after the child device syncs usage."
                />
              ) : null}
            </>
          }
        />
      </ScrollView>
    </View>
  );
}
