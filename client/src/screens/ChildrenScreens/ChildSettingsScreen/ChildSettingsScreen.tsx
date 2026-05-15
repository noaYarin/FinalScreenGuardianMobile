import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { useSelector } from "react-redux";

import { selectChildPalette, selectChildThemeHue } from "@/src/redux/slices/child-theme-slice";
import {
  fetchChildPermissionSnapshot,
  openChildPermissionScreen,
  requestLocationIfNeeded,
  requestPostNotificationsIfNeeded,
  type ChildPermissionKey,
  type ChildPermissionSnapshot,
} from "@/src/services/childDevicePermissions";

import AppText from "@/src/components/AppText/AppText";
import ChildHueBar from "./ChildHueBar";
import { styles } from "./styles";

const PERMISSION_ROWS: {
  key: ChildPermissionKey;
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
}[] = [
  {
    key: "usageAccess",
    title: "Usage access",
    subtitle: "See screen time so limits stay fair.",
    icon: "chart-timeline-variant",
  },
  {
    key: "accessibility",
    title: "Accessibility",
    subtitle: "Helps the app pause other apps when it is time for a break.",
    icon: "human-greeting-variant",
  },
  {
    key: "notifications",
    title: "Notifications",
    subtitle: "Friendly reminders and safety alerts.",
    icon: "bell-ring",
  },
  {
    key: "location",
    title: "Location",
    subtitle: "So parents know you are okay when you are out.",
    icon: "map-marker",
  },
];

export default function ChildSettingsScreen() {
  const navigation = useNavigation();
  const palette = useSelector(selectChildPalette);
  const hue = useSelector(selectChildThemeHue);
  const [snap, setSnap] = useState<ChildPermissionSnapshot | null>(null);
  const [busyKey, setBusyKey] = useState<ChildPermissionKey | null>(null);

  const refresh = useCallback(async () => {
    const next = await fetchChildPermissionSnapshot();
    setSnap(next);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  useLayoutEffect(() => {
    const sub = AppState.addEventListener("change", (s) => {
      if (s === "active") refresh();
    });
    return () => sub.remove();
  }, [refresh]);

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
              router.replace("/Child" as Href);
            }
          }}
          hitSlop={12}
          style={styles.headerBackBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialCommunityIcons name="chevron-left" size={30} color="#FFFFFF" />
        </Pressable>
      ),
    });
  }, [navigation]);

  const onFix = async (key: ChildPermissionKey) => {
    setBusyKey(key);
    try {
      if (key === "notifications") {
        await requestPostNotificationsIfNeeded();
      }
      if (key === "location") {
        await requestLocationIfNeeded();
      }
      await openChildPermissionScreen(key);
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: palette.screenBg }]}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={[
          styles.permissionsBlock,
          { backgroundColor: palette.cardBg, borderColor: palette.cardBorder },
        ]}
      >
        <AppText weight="extraBold" style={[styles.permissionsTitle, { color: palette.text }]}>
          Permissions
        </AppText>
        <AppText weight="bold" style={[styles.permissionsIntro, { color: palette.textMuted }]}>
          The app needs these to work. 
        </AppText>
        {Platform.OS === "ios" ? (
          <AppText weight="medium" style={[styles.permissionsHint, { color: palette.textMuted }]}>
            On iPhone, some steps differ from Android.
          </AppText>
        ) : null}

        {PERMISSION_ROWS.map((row, index) => {
          const ok = snap ? Boolean(snap[row.key]) : false;
          const busy = busyKey === row.key;

          return (
            <View key={row.key}>
              {index > 0 ? <View style={styles.permissionDivider} /> : null}

              <View style={styles.cardTop}>
                <View style={[styles.rowIcon, { backgroundColor: palette.accentSoft }]}>
                  <MaterialCommunityIcons name={row.icon} size={28} color={palette.accent} />
                </View>
                <View style={styles.cardTextWrap}>
                  <AppText weight="extraBold" style={[styles.cardTitle, { color: palette.text }]}>
                    {row.title}
                  </AppText>
                  <AppText weight="medium" style={[styles.cardSubtitle, { color: palette.textMuted }]}>
                    {row.subtitle}
                  </AppText>
                </View>
                <View
                  style={[
                    styles.statusBubble,
                    { borderColor: ok ? palette.success : palette.danger },
                    ok && { backgroundColor: "rgba(21, 128, 61, 0.12)" },
                    !ok && { backgroundColor: "rgba(220, 38, 38, 0.1)" },
                  ]}
                >
                  {snap == null ? (
                    <ActivityIndicator color={palette.accent} />
                  ) : ok ? (
                    <MaterialCommunityIcons name="check-bold" size={26} color={palette.success} />
                  ) : (
                    <MaterialCommunityIcons name="close-thick" size={24} color={palette.danger} />
                  )}
                </View>
              </View>

              {!ok && snap != null ? (
                <Pressable
                  onPress={() => onFix(row.key)}
                  disabled={busy}
                  style={({ pressed }) => [
                    styles.fixBtn,
                    { backgroundColor: palette.accent },
                    pressed && styles.fixBtnPressed,
                    busy && styles.fixBtnDisabled,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Fix ${row.title}`}
                >
                  {busy ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <AppText weight="extraBold" style={styles.fixBtnText}>
                      Fix now
                    </AppText>
                  )}
                </Pressable>
              ) : null}
            </View>
          );
        })}
      </View>

      <View style={[styles.card, { backgroundColor: palette.cardBg, borderColor: palette.cardBorder }]}>
        <View style={styles.paletteHeaderRow}>
          <MaterialCommunityIcons name="palette" size={26} color={palette.accent} />
          <AppText weight="extraBold" style={[styles.sectionTitle, { color: palette.text }]}>
            Your colors
          </AppText>
        </View>
        <AppText weight="medium" style={[styles.sectionHint, { color: palette.textMuted }]}>
          Slide the bar sideways to change the look of your home.
        </AppText>
        <ChildHueBar hue={hue} borderColor={palette.cardBorder} />
      </View>
    </ScrollView>
  );
}
