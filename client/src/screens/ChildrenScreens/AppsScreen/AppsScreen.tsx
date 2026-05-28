import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  NativeModules,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { apiGetDevicePolicyForChild } from "../../../api/device";
import { onEvent } from "../../../services/socket";
import { POLICY_UPDATED } from "../../../constants/socketEvents";
import { styles } from "./styles";

type InstalledApp = {
  name: string;
  packageName: string;
  icon?: string;
  isSystemApp?: boolean;
  isBlocked: boolean;
};

const { DeviceControl } = NativeModules;

function getAppIconUri(icon?: string) {
  if (!icon || icon === "default.png") return null;

  if (
    icon.startsWith("data:image") ||
    icon.startsWith("file://") ||
    icon.startsWith("content://") ||
    icon.startsWith("http://") ||
    icon.startsWith("https://")
  ) {
    return icon;
  }

  return `data:image/png;base64,${icon}`;
}

export default function AppsScreen() {
  const { width } = useWindowDimensions();
  const { deviceId } = useLocalSearchParams<{ deviceId?: string }>();

  const isWide = width >= 760;

  const [apps, setApps] = useState<InstalledApp[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const loadApps = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) {
          setIsLoading(true);
        }

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

        const normalizedApps: InstalledApp[] = Array.isArray(installedApps)
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
        if (showLoader) {
          setIsLoading(false);
        }
      }
    },
    [deviceId]
  );

  useEffect(() => {
    loadApps(true);
  }, [loadApps]);

  useEffect(() => {
    const unsubscribePolicyUpdated = onEvent(POLICY_UPDATED, () => {
      loadApps(false);
    });

    return () => {
      if (unsubscribePolicyUpdated) unsubscribePolicyUpdated();
    };
  }, [loadApps]);

  const blockedApps = useMemo(
    () => apps.filter((app) => app.isBlocked),
    [apps]
  );

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, isWide && styles.containerWide]}>
          <View style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <MaterialCommunityIcons name="lock" size={32} color="#2563EB" />
            </View>

            <View style={styles.heroText}>
              <AppText weight="extraBold" style={styles.title}>
                Locked Apps
              </AppText>

              <AppText weight="medium" style={styles.subtitle}>
                These are the apps currently locked by your parent.
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

            {isLoading ? (
              <View style={styles.stateCard}>
                <ActivityIndicator />

                <AppText weight="medium" style={styles.stateText}>
                  Loading locked apps...
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
            ) : blockedApps.length === 0 ? (
              <View style={styles.stateCard}>
                <MaterialCommunityIcons
                  name="lock-open-outline"
                  size={34}
                  color="#64748B"
                />

                <AppText weight="extraBold" style={styles.emptyTitle}>
                  No locked apps
                </AppText>

                <AppText weight="medium" style={styles.stateText}>
                  No apps are locked right now.
                </AppText>
              </View>
            ) : (
              <View style={styles.appsList}>
                {blockedApps.map((app) => {
                  const iconUri = getAppIconUri(app.icon);

                  return (
                    <View key={app.packageName} style={styles.appCard}>
                      <View style={[styles.appIcon, styles.appIconLocked]}>
                        {iconUri ? (
                          <Image
                            source={{ uri: iconUri }}
                            resizeMode="contain"
                            style={{
                              width: 42,
                              height: 42,
                              borderRadius: 10,
                            }}
                          />
                        ) : (
                          <MaterialCommunityIcons
                            name="lock"
                            size={26}
                            color="#DC2626"
                          />
                        )}
                      </View>

                      <View style={styles.appInfo}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <AppText weight="extraBold" style={styles.appName}>
                            {app.name}
                          </AppText>

                          {app.isSystemApp ? (
                            <View
                              style={{
                                borderRadius: 999,
                                paddingHorizontal: 8,
                                paddingVertical: 3,
                                backgroundColor: "#F1F5F9",
                              }}
                            >
                              <AppText
                                weight="bold"
                                style={{
                                  fontSize: 11,
                                  color: "#64748B",
                                }}
                              >
                                System
                              </AppText>
                            </View>
                          ) : null}
                        </View>

                        <AppText weight="medium" style={styles.packageName}>
                          {app.packageName}
                        </AppText>
                      </View>

                      <View style={[styles.statusBadge, styles.lockedBadge]}>
                        <MaterialCommunityIcons
                          name="lock"
                          size={14}
                          color="#DC2626"
                        />

                        <AppText
                          weight="bold"
                          style={[
                            styles.statusBadgeText,
                            styles.lockedBadgeText,
                          ]}
                        >
                          Locked
                        </AppText>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}