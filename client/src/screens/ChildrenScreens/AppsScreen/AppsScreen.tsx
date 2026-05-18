import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  NativeModules,
  Pressable,
  ScrollView,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { apiGetDevicePolicyForChild } from "../../../api/device";
import { styles } from "./styles";

type InstalledApp = {
  name: string;
  packageName: string;
  icon?: string;
  isSystemApp?: boolean;
  isBlocked: boolean;
};

const { DeviceControl } = NativeModules;

export default function AppsScreen() {
  const { width } = useWindowDimensions();
  const { deviceId } = useLocalSearchParams<{ deviceId?: string }>();

  const isWide = width >= 760;

  const [apps, setApps] = useState<InstalledApp[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  async function loadApps() {
    try {
      setIsLoading(true);
      setErrorText("");

      if (!DeviceControl?.getInstalledApps) {
        setErrorText("App list is not available on this device.");
        return;
      }

      const installedApps = await DeviceControl.getInstalledApps();

      const policy = deviceId
        ? await apiGetDevicePolicyForChild(String(deviceId))
        : { applications: [] };

      const blockedPackages = new Set(
        (policy.applications ?? [])
          .filter((app) => app.isBlocked === true)
          .map((app) => String(app.packageName))
      );

      const normalizedApps = Array.isArray(installedApps)
        ? installedApps
            .filter((app) => app?.packageName && app?.name)
            .map((app) => {
              const packageName = String(app.packageName);

              return {
                name: String(app.name),
                packageName,
                icon: app.icon ? String(app.icon) : "default.png",
                isSystemApp: app.isSystemApp === true,
                isBlocked: blockedPackages.has(packageName),
              };
            })
            .sort((a, b) => a.name.localeCompare(b.name))
        : [];

      setApps(normalizedApps);
    } catch (error) {
      console.log("Failed to load installed apps:", error);
      setErrorText("Could not load apps right now.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadApps();
  }, [deviceId]);

  const blockedApps = useMemo(
    () => apps.filter((app) => app.isBlocked),
    [apps]
  );

  const filteredApps = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) return apps;

    return apps.filter(
      (app) =>
        app.name.toLowerCase().includes(query) ||
        app.packageName.toLowerCase().includes(query)
    );
  }, [apps, searchText]);

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, isWide && styles.containerWide]}>
          <View style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <MaterialCommunityIcons name="apps" size={32} color="#2563EB" />
            </View>

            <View style={styles.heroText}>
              <AppText weight="extraBold" style={styles.title}>
                My Apps
              </AppText>

              <AppText weight="medium" style={styles.subtitle}>
                See which apps are open and which apps are locked by your parent.
              </AppText>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <AppText weight="extraBold" style={styles.statNumber}>
                {apps.length}
              </AppText>
              <AppText weight="medium" style={styles.statLabel}>
                Apps found
              </AppText>
            </View>

            <View style={styles.lockedStatCard}>
              <AppText weight="extraBold" style={styles.statNumber}>
                {blockedApps.length}
              </AppText>
              <AppText weight="medium" style={styles.statLabel}>
                Locked apps
              </AppText>
            </View>
          </View>

          <Pressable
            onPress={loadApps}
            accessibilityRole="button"
            accessibilityLabel="Refresh app list"
            style={styles.refreshButton}
          >
            <MaterialCommunityIcons name="refresh" size={20} color="#FFFFFF" />
            <AppText weight="bold" style={styles.refreshText}>
              Refresh apps
            </AppText>
          </Pressable>

          <View style={styles.lockedSection}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="lock-outline"
                size={22}
                color="#DC2626"
              />
              <AppText weight="extraBold" style={styles.sectionTitle}>
                Locked Apps
              </AppText>
            </View>

            {blockedApps.length === 0 ? (
              <AppText weight="medium" style={styles.sectionHint}>
                No apps are locked right now.
              </AppText>
            ) : (
              <View style={styles.lockedChipsWrap}>
                {blockedApps.map((app) => (
                  <View key={app.packageName} style={styles.lockedChip}>
                    <MaterialCommunityIcons
                      name="lock"
                      size={14}
                      color="#DC2626"
                    />
                    <AppText weight="bold" style={styles.lockedChipText}>
                      {app.name}
                    </AppText>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.searchCard}>
            <MaterialCommunityIcons name="magnify" size={20} color="#64748B" />

            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search apps"
              placeholderTextColor="#94A3B8"
              style={styles.searchInput}
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Search apps"
            />
          </View>

          {isLoading ? (
            <View style={styles.stateCard}>
              <ActivityIndicator />
              <AppText weight="medium" style={styles.stateText}>
                Loading your apps...
              </AppText>
            </View>
          ) : errorText ? (
            <View style={styles.stateCard}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={34}
                color="#F97316"
              />
              <AppText weight="extraBold" style={styles.emptyTitle}>
                Something went wrong
              </AppText>
              <AppText weight="medium" style={styles.stateText}>
                {errorText}
              </AppText>
            </View>
          ) : filteredApps.length === 0 ? (
            <View style={styles.stateCard}>
              <MaterialCommunityIcons
                name="magnify-close"
                size={34}
                color="#64748B"
              />
              <AppText weight="extraBold" style={styles.emptyTitle}>
                No apps found
              </AppText>
              <AppText weight="medium" style={styles.stateText}>
                Try searching for a different app name.
              </AppText>
            </View>
          ) : (
            <View style={styles.appsList}>
              {filteredApps.map((app) => (
                <View key={app.packageName} style={styles.appCard}>
                  <View
                    style={[
                      styles.appIcon,
                      app.isBlocked && styles.appIconLocked,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={app.isBlocked ? "lock" : "cellphone"}
                      size={24}
                      color={app.isBlocked ? "#DC2626" : "#2563EB"}
                    />
                  </View>

                  <View style={styles.appInfo}>
                    <AppText weight="bold" style={styles.appName}>
                      {app.name}
                    </AppText>

                    <AppText weight="medium" style={styles.packageName}>
                      {app.packageName}
                    </AppText>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      app.isBlocked ? styles.lockedBadge : styles.openBadge,
                    ]}
                  >
                    <AppText
                      weight="bold"
                      style={[
                        styles.statusBadgeText,
                        app.isBlocked
                          ? styles.lockedBadgeText
                          : styles.openBadgeText,
                      ]}
                    >
                      {app.isBlocked ? "Locked" : "Open"}
                    </AppText>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}