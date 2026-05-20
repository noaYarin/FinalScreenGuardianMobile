import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Switch,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import EmptyStateCard from "../../../components/EmptyStateCard/EmptyStateCard";
import AppText from "../../../components/AppText/AppText";
import ChildDeviceSelector from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import InfoHint from "../../../components/InfoHint/InfoHint";
import { styles } from "./styles";

import { showErrorToast, showInfoToast } from "@/src/utils/appToast";
import type { AppDispatch, RootState } from "@/src/redux/store/types";
import { getMyChildrenThunk } from "@/src/redux/thunks/childrenThunks";
import {
  fetchDevicesByChild,
  updateDeviceScreenTimeThunk,
} from "@/src/redux/thunks/deviceThunks";

type ScreenLimitCard = {
  id: string;
  title: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  currentHours: number;
  maxHours: number;
};

const STEP_HOURS = 30 / 60;
const MIN_HOURS = 30 / 60;

function formatHoursToClock(totalHours: number) {
  const safeHours = Math.max(0, totalHours || 0);
  const wholeHours = Math.floor(safeHours);
  const minutes = Math.round((safeHours - wholeHours) * 60);

  const normalizedHours = minutes === 60 ? wholeHours + 1 : wholeHours;
  const normalizedMinutes = minutes === 60 ? 0 : minutes;

  return `${normalizedHours}:${String(normalizedMinutes).padStart(2, "0")}`;
}

export default function WeeklyTimeLimitsScreen() {
  const dispatch = useDispatch<AppDispatch>();

  const { childrenList, isLoading, error } = useSelector(
    (state: RootState) => state.children
  );

  const { byChildId, statusByChildId, errorByChildId } = useSelector(
    (state: RootState) => state.devices
  );

  const children = Array.isArray(childrenList) ? childrenList : [];

  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [tempLimits, setTempLimits] = useState<Record<string, number>>({});
  const [tempLimitEnabled, setTempLimitEnabled] = useState<Record<string, boolean>>({});

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
      children.find((child: any) => String(child._id) === String(selectedChildId)) ??
      children[0]
    );
  }, [children, selectedChildId]);

  const currentChildDevices = useMemo(() => {
    return selectedChild ? byChildId[selectedChild._id] ?? [] : [];
  }, [byChildId, selectedChild]);

  const devicesStatus = selectedChildId
    ? statusByChildId[selectedChildId] ?? "idle"
    : "idle";

  const devicesError = selectedChildId
    ? errorByChildId[selectedChildId] ?? null
    : null;

  useEffect(() => {
    if (!selectedChild?._id) return;

    const firstDeviceId = currentChildDevices[0]?._id;
    const exists = currentChildDevices.some(
      (device: any) => String(device._id) === String(selectedDeviceId)
    );

    if (!exists) {
      setSelectedDeviceId(firstDeviceId ? String(firstDeviceId) : "");
      setEditingCardId(null);
      setTempLimits({});
      setTempLimitEnabled({});
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

  const selectedDeviceName = selectedDevice
    ? String(
      (selectedDevice as any).deviceName ??
      (selectedDevice as any).model ??
      (selectedDevice as any).name ??
      ""
    )
    : "";

  const selectedLimits: ScreenLimitCard[] = useMemo(() => {
    if (!selectedDevice) return [];

    const weeklyLimitMinutes =
      selectedDevice.screenTime?.weeklyLimitMinutes ?? 0;

    const usedThisWeekMinutes =
      selectedDevice.screenTime?.usedWeekMinutes ?? 0;

    return [
      {
        id: "weekly",
        title: "Weekly screen time",
        icon: "calendar-week-outline",
        currentHours: usedThisWeekMinutes / 60,
        maxHours: weeklyLimitMinutes / 60,
      },
    ];
  }, [selectedDevice]);

  const handleEditPress = (limitId: string) => {
    if (!selectedDevice) return;

    const currentMinutes =
      selectedDevice.screenTime?.weeklyLimitMinutes ?? MIN_HOURS * 60;

    const currentEnabled =
      selectedDevice.screenTime?.isLimitEnabled === true &&
      selectedDevice.screenTime?.limitMode === "WEEKLY";

    setTempLimits((prev) => ({
      ...prev,
      [limitId]: Math.max(MIN_HOURS * 60, currentMinutes),
    }));

    setTempLimitEnabled((prev) => ({
      ...prev,
      [limitId]: currentEnabled,
    }));

    setEditingCardId(limitId);
  };

  const updateLimitByStep = (limitId: string, deltaHours: number) => {
    if (!selectedDevice || !selectedChildId) return;

    const isEnabled = tempLimitEnabled[limitId] ?? false;
    if (!isEnabled) return;

    const baseMinutes =
      tempLimits[limitId] ??
      selectedDevice.screenTime?.weeklyLimitMinutes ??
      MIN_HOURS * 60;

    const nextMinutes = Math.max(MIN_HOURS * 60, baseMinutes + deltaHours * 60);

    setTempLimits((prev) => ({
      ...prev,
      [limitId]: Math.round(nextMinutes),
    }));
  };

  const handleSavePress = async (limitId: string) => {
    if (!selectedDevice || !selectedChildId) return;

    const nextMinutes = tempLimits[limitId];

    const nextEnabled =
      tempLimitEnabled[limitId] ??
      (selectedDevice.screenTime?.isLimitEnabled === true &&
        selectedDevice.screenTime?.limitMode === "WEEKLY");
    try {
      await dispatch(
        updateDeviceScreenTimeThunk({
          childId: selectedChildId,
          deviceId: selectedDevice._id,
          isLimitEnabled: nextEnabled ?? false,
          limitMode: nextEnabled ? "WEEKLY" : "NONE",
          weeklyLimitMinutes:
            nextEnabled === false
              ? selectedDevice.screenTime?.weeklyLimitMinutes ?? MIN_HOURS * 60
              : Math.max(MIN_HOURS * 60, nextMinutes ?? MIN_HOURS * 60),
        })
      ).unwrap();

      showInfoToast("The weekly limit was saved and sent to the child device.");
      setEditingCardId(null);

      setTempLimits((prev) => {
        const updated = { ...prev };
        delete updated[limitId];
        return updated;
      });

      setTempLimitEnabled((prev) => {
        const updated = { ...prev };
        delete updated[limitId];
        return updated;
      });
    } catch {
      showErrorToast("Could not update the weekly limit. Please try again.", "Error");
    }
  };

  if (isLoading && children.length === 0) {
    return (
      <ScreenLayout>
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      </ScreenLayout>
    );
  }

  if (error && children.length === 0) {
    return (
      <ScreenLayout>
        <View style={styles.container}>
          <AppText>{error}</AppText>
        </View>
      </ScreenLayout>
    );
  }

  if (!selectedChild) {
    return (
      <ScreenLayout>
        <View style={styles.container}>
          <EmptyStateCard
            icon="account-child-outline"
            title="No children yet"
            subtitle="Add a child to get started."
          />
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.infoBulbRow}>
            <InfoHint
              title="How weekly limits work"
              lines={[
                "The weekly limit resets automatically at the start of each new week",
                "The limit counts the total screen time used during the current week",
                "Usage Access and Accessibility must stay enabled on the child’s device",
                "If the device is offline, changes will apply when it reconnects",
                "Native locking is not connected yet, so reaching the limit is currently only displayed here",
              ]}
            />
          </View>

          <View style={styles.heroCard}>
            <AppText weight="extraBold" style={styles.heroTitle}>
              Manage weekly screen time
            </AppText>

            <AppText weight="medium" style={styles.heroSubtitle}>
              Choose a child and device, then set or update the total weekly screen-time limit.
            </AppText>
          </View>

          <ChildDeviceSelector
            selectedChildId={selectedChildId}
            selectedDeviceId={selectedDeviceId}
            showDevices={true}
            onSelectChild={(childId) => {
              setSelectedChildId(String(childId));
              setSelectedDeviceId("");
              setEditingCardId(null);
              setTempLimits({});
              setTempLimitEnabled({});
            }}
            onSelectDevice={(deviceId) => {
              setSelectedDeviceId(String(deviceId));
              setEditingCardId(null);
              setTempLimits({});
              setTempLimitEnabled({});
            }}
          />

          {isLoading && (
            <View style={styles.emptyState}>
              <AppText weight="medium" style={styles.emptySubtitle}>
                Loading...
              </AppText>
            </View>
          )}

          {!!devicesError && (
            <View style={styles.emptyState}>
              <AppText weight="medium" style={styles.emptySubtitle}>
                {devicesError}
              </AppText>
            </View>
          )}

          {!isLoading &&
            !devicesError &&
            selectedChildId &&
            devicesStatus === "loading" && (
              <View style={styles.emptyState}>
                <AppText weight="medium" style={styles.emptySubtitle}>
                  Loading...
                </AppText>
              </View>
            )}

          {!isLoading &&
            !devicesError &&
            selectedChildId &&
            devicesStatus !== "loading" &&
            currentChildDevices.length === 0 && (
              <EmptyStateCard
                icon="cellphone-link-off"
                title="No devices yet"
                subtitle="There are no connected devices for this child yet."
              />
            )}

          {selectedLimits.length > 0 && (
            <View style={styles.cardsList}>
              {selectedLimits.map((limitCard) => {
                const isEditing = editingCardId === limitCard.id;

                const isWeeklyModeActive =
                  selectedDevice?.screenTime?.isLimitEnabled === true &&
                  selectedDevice?.screenTime?.limitMode === "WEEKLY";

                const isEnabled =
                  tempLimitEnabled[limitCard.id] ?? isWeeklyModeActive;

                const effectiveMaxHours = isEditing
                  ? (tempLimits[limitCard.id] ?? limitCard.maxHours * 60) / 60
                  : limitCard.maxHours;

                const progress =
                  effectiveMaxHours > 0
                    ? Math.min(limitCard.currentHours / effectiveMaxHours, 1)
                    : 0;

                const canDecrease = isEnabled && effectiveMaxHours > MIN_HOURS;

                return (
                  <View key={limitCard.id} style={styles.limitCard}>
                    <View style={styles.limitTopRow}>
                      <View style={styles.limitTitleWrap}>
                        <AppText weight="bold" style={styles.limitTitle}>
                          {limitCard.title}
                        </AppText>

                        <AppText weight="medium" style={styles.limitMeta}>
                          {`${selectedChild?.name ?? ""} · ${selectedDeviceName}`}
                        </AppText>
                      </View>

                      <View style={styles.limitIconBox}>
                        <MaterialCommunityIcons
                          name={limitCard.icon}
                          size={24}
                          color="#3D6BF2"
                        />
                      </View>
                    </View>

                    <View style={styles.timePillsRow}>
                      <View style={styles.timePill}>
                        <AppText weight="medium" style={styles.timePillLabel}>
                          Used this week
                        </AppText>

                        <AppText weight="bold" style={styles.timePillValue}>
                          {formatHoursToClock(limitCard.currentHours)}
                        </AppText>
                      </View>

                      <View style={styles.timePill}>
                        <AppText weight="medium" style={styles.timePillLabel}>
                          Weekly limit
                        </AppText>

                        <AppText weight="bold" style={styles.timePillValue}>
                          {isEnabled
                            ? formatHoursToClock(effectiveMaxHours)
                            : "No limit"}
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.progressMetaRow}>
                      <AppText weight="medium" style={styles.progressMetaText}>
                        Weekly usage
                      </AppText>

                      <AppText weight="bold" style={styles.progressMetaValue}>
                        {isEnabled ? `${Math.round(progress * 100)}%` : "Off"}
                      </AppText>
                    </View>

                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${(isEnabled ? progress : 0) * 100}%` },
                        ]}
                      />
                    </View>

                    <View style={styles.actionsRow}>
                      <View
                        style={[
                          styles.statusChip,
                          !isEnabled
                            ? styles.statusChipNormal
                            : progress >= 1
                              ? styles.statusChipReached
                              : progress >= 0.8
                                ? styles.statusChipWarning
                                : styles.statusChipNormal,
                        ]}
                      >
                        <AppText
                          weight="bold"
                          style={[
                            styles.statusChipText,
                            !isEnabled
                              ? styles.statusChipTextNormal
                              : progress >= 1
                                ? styles.statusChipTextReached
                                : progress >= 0.8
                                  ? styles.statusChipTextWarning
                                  : styles.statusChipTextNormal,
                          ]}
                        >
                          {!isEnabled
                            ? "Off"
                            : progress >= 1
                              ? "Weekly limit reached"
                              : progress >= 0.8
                                ? "Almost reached"
                                : "OK"}
                        </AppText>
                      </View>

                      {!isEditing ? (
                        <View style={styles.editButtonWrap}>
                          <Pressable
                            onPress={() => handleEditPress(limitCard.id)}
                            accessibilityRole="button"
                            accessibilityLabel="Edit weekly limit"
                            style={({ pressed }) => [
                              styles.editButton,
                              pressed && styles.editButtonPressed,
                            ]}
                          >
                            <AppText weight="bold" style={styles.editButtonText}>
                              Edit Weekly Limit
                            </AppText>

                            <MaterialCommunityIcons
                              name="pencil-outline"
                              size={18}
                              color="#FFFFFF"
                            />
                          </Pressable>
                        </View>
                      ) : (
                        <View style={styles.editorWrap}>
                          <View style={styles.editorHeaderRow}>
                            <AppText weight="bold" style={styles.editorTitle}>
                              Edit Weekly Limit
                            </AppText>
                          </View>

                          <View style={styles.switchRow}>
                            <View style={styles.switchTextWrap}>
                              <AppText weight="medium" style={styles.switchHint}>
                                {isEnabled
                                  ? "Weekly limit is on"
                                  : "Weekly limit is off"}
                              </AppText>
                            </View>

                            <Switch
                              value={isEnabled}
                              onValueChange={(value) =>
                                setTempLimitEnabled((prev) => ({
                                  ...prev,
                                  [limitCard.id]: value,
                                }))
                              }
                              accessibilityLabel="Toggle weekly limit"
                            />
                          </View>

                          <View
                            style={[
                              styles.editorControlsRow,
                              !isEnabled && { opacity: 0.5 },
                            ]}
                          >
                            <Pressable
                              onPress={() =>
                                updateLimitByStep(limitCard.id, -STEP_HOURS)
                              }
                              disabled={!canDecrease}
                              accessibilityRole="button"
                              accessibilityLabel="Decrease by thirty minutes"
                              style={({ pressed }) => [
                                styles.stepButton,
                                styles.stepButtonSecondary,
                                pressed && styles.stepButtonPressed,
                                !canDecrease && styles.stepButtonDisabled,
                              ]}
                            >
                              <MaterialCommunityIcons
                                name="minus"
                                size={18}
                                color={canDecrease ? "#1F2A44" : "#A8B3C7"}
                              />

                              <AppText
                                weight="bold"
                                style={[
                                  styles.stepButtonTextSecondary,
                                  !canDecrease && styles.stepButtonTextDisabled,
                                ]}
                              >
                                30
                              </AppText>
                            </Pressable>

                            <View style={styles.currentValueBox}>
                              <AppText
                                weight="medium"
                                style={styles.currentValueLabel}
                              >
                                Weekly limit
                              </AppText>

                              <AppText
                                weight="extraBold"
                                style={styles.currentValueText}
                              >
                                {!isEnabled
                                  ? "No limit"
                                  : formatHoursToClock(effectiveMaxHours)}
                              </AppText>
                            </View>

                            <Pressable
                              onPress={() =>
                                updateLimitByStep(limitCard.id, STEP_HOURS)
                              }
                              disabled={!isEnabled}
                              accessibilityRole="button"
                              accessibilityLabel="Increase by thirty minutes"
                              style={({ pressed }) => [
                                styles.stepButton,
                                styles.stepButtonPrimary,
                                pressed && styles.stepButtonPressed,
                                !isEnabled && styles.stepButtonDisabled,
                              ]}
                            >
                              <MaterialCommunityIcons
                                name="plus"
                                size={18}
                                color={!isEnabled ? "#A8B3C7" : "#FFFFFF"}
                              />

                              <AppText
                                weight="bold"
                                style={[
                                  styles.stepButtonTextPrimary,
                                  !isEnabled && styles.stepButtonTextDisabled,
                                ]}
                              >
                                30
                              </AppText>
                            </Pressable>
                          </View>

                          <AppText weight="medium" style={styles.editorHint}>
                            Native locking is not implemented yet. For now, this screen only saves and displays the weekly limit.
                          </AppText>

                          <Pressable
                            onPress={() => handleSavePress(limitCard.id)}
                            accessibilityRole="button"
                            accessibilityLabel="Save weekly limit"
                            style={({ pressed }) => [
                              styles.saveButtonStrong,
                              styles.saveButtonStrongBottom,
                              pressed && styles.saveButtonStrongPressed,
                            ]}
                          >
                            <MaterialCommunityIcons
                              name="content-save-outline"
                              size={18}
                              color="#FFFFFF"
                            />

                            <AppText
                              weight="extraBold"
                              style={styles.saveButtonStrongText}
                            >
                              Save
                            </AppText>
                          </Pressable>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}