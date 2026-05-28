import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import EmptyStateCard from "@/src/components/EmptyStateCard/EmptyStateCard";
import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import ChildDeviceSelector from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import { styles } from "./styles";
import { showErrorToast, showSuccessToast } from "@/src/utils/appToast";
import { getMyChildrenThunk } from "../../../redux/thunks/childrenThunks";
import {
  fetchDevicesByChild,
  setApplicationBlockedThunk,
} from "../../../redux/thunks/deviceThunks";

import type { RootState } from "../../../redux/store/types";

type FilterMode = "all" | "blocked" | "allowed";

function formatMinutes(minutes: number) {
  if (!minutes || minutes <= 0) {
    return "0 min";
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours <= 0) {
    return `${mins} min`;
  }

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}

export default function AppBlockingScreen() {
  const dispatch = useDispatch<any>();
  const { width } = useWindowDimensions();

  const isWide = width >= 760;

  const children = useSelector(
    (state: RootState) => state.children.childrenList
  );

  const devicesByChildId = useSelector(
    (state: RootState) => state.devices.byChildId
  );

  const statusByChildId = useSelector(
    (state: RootState) => state.devices.statusByChildId
  );

  const [selectedChildId, setSelectedChildId] = useState("");
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [updatingPackageName, setUpdatingPackageName] = useState<string | null>(
    null
  );

  useEffect(() => {
    dispatch(getMyChildrenThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedChildId && children.length > 0) {
      setSelectedChildId(String(children[0]._id));
    }
  }, [children, selectedChildId]);

  useEffect(() => {
    if (selectedChildId) {
      dispatch(fetchDevicesByChild(selectedChildId));
    }
  }, [dispatch, selectedChildId]);

  const devices = selectedChildId
    ? devicesByChildId[selectedChildId] ?? []
    : [];

  useEffect(() => {
    if (!selectedDeviceId && devices.length > 0) {
      setSelectedDeviceId(String(devices[0]._id));
    }
  }, [devices, selectedDeviceId]);

  const selectedDevice = devices.find(
    (device) => String(device._id) === String(selectedDeviceId)
  );

  const apps = useMemo(() => {
    const rawApps = selectedDevice?.applications ?? [];

    return rawApps
      .map((app) => ({
        name: app.name || app.appName || app.packageName,
        icon: app.icon,
        packageName: app.packageName,
        isBlocked: app.isBlocked === true,
        usedTodayMinutes: Number(app.screenTime?.usedTodayMinutes ?? 0),
      }))
      .filter((app) => {
        const query = searchText.trim().toLowerCase();

        const matchesSearch =
          !query ||
          app.name.toLowerCase().includes(query) ||
          app.packageName.toLowerCase().includes(query);

        const matchesFilter =
          filterMode === "all" ||
          (filterMode === "blocked" && app.isBlocked) ||
          (filterMode === "allowed" && !app.isBlocked);

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedDevice, searchText, filterMode]);

  const blockedCount =
    selectedDevice?.applications?.filter((app) => app.isBlocked === true)
      .length ?? 0;

  const totalCount = selectedDevice?.applications?.length ?? 0;

  const totalUsedTodayMinutes =
    selectedDevice?.applications?.reduce((sum, app) => {
      return sum + Number(app.screenTime?.usedTodayMinutes ?? 0);
    }, 0) ?? 0;

  const isLoading = selectedChildId
    ? statusByChildId[selectedChildId] === "loading"
    : false;

  const handleSelectChild = (childId: string) => {
    setSelectedChildId(childId);
    setSelectedDeviceId("");
    setSearchText("");
    setFilterMode("all");
  };

  const handleToggleApp = async (packageName: string, nextBlocked: boolean) => {
    if (!selectedChildId || !selectedDeviceId) return;

    const appName =
      selectedDevice?.applications?.find(
        (app) => app.packageName === packageName
      )?.name ?? packageName;

    try {
      setUpdatingPackageName(packageName);

      await dispatch(
        setApplicationBlockedThunk({
          childId: selectedChildId,
          deviceId: selectedDeviceId,
          packageName,
          isBlocked: nextBlocked,
        })
      ).unwrap();

      showSuccessToast(
        nextBlocked
          ? `${appName} was blocked successfully`
          : `${appName} was unblocked successfully`,
        nextBlocked ? "App blocked" : "App unblocked"
      );
    } catch {
      showErrorToast(
        nextBlocked
          ? `Could not block ${appName}.`
          : `Could not unblock ${appName}.`,
        "Action failed"
      );
    } finally {
      setUpdatingPackageName(null);
    }
  };

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, isWide && styles.containerWide]}>
          <View style={styles.introCard}>
            <View style={styles.introIconWrap}>
              <MaterialCommunityIcons
                name="shield-lock-outline"
                size={30}
                color="#2563EB"
              />
            </View>

            <View style={styles.introTextWrap}>
              <AppText weight="extraBold" style={styles.title}>
                Block apps on your child’s device
              </AppText>

              <AppText weight="medium" style={styles.subtitle}>
                Choose a child and device, then view usage and block or allow
                installed apps.
              </AppText>
            </View>
          </View>

          <ChildDeviceSelector
            selectedChildId={selectedChildId}
            onSelectChild={handleSelectChild}
            selectedDeviceId={selectedDeviceId}
            onSelectDevice={setSelectedDeviceId}
            showDevices
            deviceSectionTitleKey="Select device"
          />

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <AppText weight="extraBold" style={styles.summaryNumber}>
                {totalCount}
              </AppText>
              <AppText weight="medium" style={styles.summaryLabel}>
                Installed apps
              </AppText>
            </View>

            <View style={styles.summaryCard}>
              <AppText weight="extraBold" style={styles.summaryNumber}>
                {blockedCount}
              </AppText>
              <AppText weight="medium" style={styles.summaryLabel}>
                Blocked apps
              </AppText>
            </View>

            <View style={styles.summaryCard}>
              <AppText weight="extraBold" style={styles.summaryNumber}>
                {formatMinutes(totalUsedTodayMinutes)}
              </AppText>
              <AppText weight="medium" style={styles.summaryLabel}>
                Used today
              </AppText>
            </View>
          </View>

          <View style={styles.toolsCard}>
            <View style={styles.searchBox}>
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color="#64748B"
              />

              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search apps"
                placeholderTextColor="#94A3B8"
                style={styles.searchInput}
                autoCapitalize="none"
                autoCorrect={false}
                accessibilityLabel="Search installed apps"
              />
            </View>

            <View style={styles.filterRow}>
              {(["all", "blocked", "allowed"] as FilterMode[]).map((mode) => {
                const selected = filterMode === mode;
                const label =
                  mode === "all"
                    ? "All"
                    : mode === "blocked"
                      ? "Blocked"
                      : "Allowed";

                return (
                  <Pressable
                    key={mode}
                    onPress={() => setFilterMode(mode)}
                    accessibilityRole="button"
                    accessibilityLabel={`Show ${label.toLowerCase()} apps`}
                    style={[
                      styles.filterChip,
                      selected && styles.filterChipSelected,
                    ]}
                  >
                    <AppText
                      weight="bold"
                      style={[
                        styles.filterChipText,
                        selected && styles.filterChipTextSelected,
                      ]}
                    >
                      {label}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {isLoading ? (
            <View style={styles.stateCard}>
              <ActivityIndicator />
              <AppText weight="medium" style={styles.stateText}>
                Loading device apps...
              </AppText>
            </View>
          ) : !selectedDevice ? (
            <EmptyStateCard
              icon="cellphone-link-off"
              title="No device selected"
              subtitle="Choose a child and device to manage app blocking."
            />
          ) : totalCount === 0 ? (
            <View style={styles.stateCard}>
              <AppText weight="extraBold" style={styles.emptyTitle}>
                No apps found yet
              </AppText>
              <AppText weight="medium" style={styles.stateText}>
                Open the child app and sync installed apps from the child
                device.
              </AppText>
            </View>
          ) : apps.length === 0 ? (
            <EmptyStateCard
              icon="magnify-close"
              title="No matching apps"
              subtitle="Try changing the search or filter."
            />
          ) : (
            <View style={styles.appsList}>
              {apps.map((app) => {
                const isUpdating = updatingPackageName === app.packageName;
                const nextBlocked = !app.isBlocked;

                return (
                  <View key={app.packageName} style={styles.appCard}>
                    <View style={styles.appIcon}>
                      <MaterialCommunityIcons
                        name="cellphone"
                        size={24}
                        color="#2563EB"
                      />
                    </View>

                    <View style={styles.appInfo}>
                      <AppText weight="bold" style={styles.appName}>
                        {app.name}
                      </AppText>

                      <AppText weight="medium" style={styles.packageName}>
                        {app.packageName}
                      </AppText>

                      <View style={styles.usageBadge}>
                        <MaterialCommunityIcons
                          name="clock-outline"
                          size={14}
                          color="#EA580C"
                        />

                        <AppText weight="bold" style={styles.usageText}>
                          Used today: {formatMinutes(app.usedTodayMinutes)}
                        </AppText>
                      </View>

                      <View
                        style={[
                          styles.statusBadge,
                          app.isBlocked
                            ? styles.statusBadgeBlocked
                            : styles.statusBadgeAllowed,
                        ]}
                      >
                        <AppText
                          weight="bold"
                          style={[
                            styles.statusText,
                            app.isBlocked
                              ? styles.statusTextBlocked
                              : styles.statusTextAllowed,
                          ]}
                        >
                          {app.isBlocked ? "Blocked" : "Allowed"}
                        </AppText>
                      </View>
                    </View>

                    <Pressable
                      onPress={() =>
                        handleToggleApp(app.packageName, nextBlocked)
                      }
                      disabled={isUpdating}
                      accessibilityRole="button"
                      accessibilityLabel={
                        app.isBlocked
                          ? `Allow ${app.name}`
                          : `Block ${app.name}`
                      }
                      style={[
                        styles.actionButton,
                        app.isBlocked
                          ? styles.allowButton
                          : styles.blockButton,
                        isUpdating && styles.actionButtonDisabled,
                      ]}
                    >
                      <AppText weight="bold" style={styles.actionButtonText}>
                        {isUpdating
                          ? "Saving..."
                          : app.isBlocked
                            ? "Allow"
                            : "Block"}
                      </AppText>
                    </Pressable>
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