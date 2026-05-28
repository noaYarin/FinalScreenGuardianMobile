import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { NativeModules } from "react-native";
import { Button, TextInput as PaperTextInput } from "react-native-paper";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import CustomCard from "@/src/components/CustomCard/CustomCard";
import MinuteCard, { type MinuteCardTile } from "@/src/components/MinuteCard/MinuteCard";
import { styles } from "./styles";

import type { AppDispatch, RootState } from "@/src/redux/store/types";
import {
  createRequestThunk,
  fetchMyRequestsThunk,
} from "@/src/redux/thunks/requestThunks";
import { showErrorToast, showSuccessToast } from "@/src/utils/appToast";
import { selectChildPalette } from "@/src/redux/slices/child-theme-slice";

// Native module for device control actions and current screen-time status
const { DeviceControl } = NativeModules;

type MinuteOption = {
  minutes: number;
  tile: MinuteCardTile;
};

export default function ExtendTimeRequestScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const palette = useSelector(selectChildPalette);

  const { activeChildId, deviceId } = useSelector(
    (state: RootState) => state.auth
  );

  const devicesByChild = useSelector(
    (state: RootState) => state.devices.byChildId
  );

  const myRequests = useSelector(
    (state: RootState) => state.requests.mine ?? []
  );

  const device =
    devicesByChild[activeChildId ?? ""]?.find(
      (d) => String(d._id) === String(deviceId)
    ) ?? null;

  const minuteOptions: MinuteOption[] = useMemo(
    () => [
      { minutes: 10, tile: "blue" },
      { minutes: 30, tile: "purple" },
    ],
    []
  );

  const [selectedMinutes, setSelectedMinutes] = useState<number>(10);
  const [customMinutes, setCustomMinutes] = useState<number>(5);
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchMyRequestsThunk());
  }, [dispatch]);

  const hasPendingRequestForThisDevice = myRequests.some(
    (request) =>
      String(request.deviceId) === String(deviceId) &&
      request.status === "PENDING"
  );

  const selectPreset = (minutes: number) => setSelectedMinutes(minutes);

  const selectCustom = (minutes: number) => {
    setCustomMinutes(minutes);
    setSelectedMinutes(minutes);
  };

  const incCustom = () => selectCustom(Math.min(120, customMinutes + 1));
  const decCustom = () => selectCustom(Math.max(1, customMinutes - 1));

  const getErrorMessage = (msg?: string) => {
    if (!msg) return "Something went wrong. Please try again.";

    const lower = msg.toLowerCase();

    if (lower.includes("already")) {
      return "A pending extension request already exists for this device";
    }

    if (lower.includes("invalid")) {
      return "Invalid number of minutes";
    }

    return msg;
  };

  const onSend = async () => {
    if (isSubmitting) return;

    try {
      if (!deviceId) {
        showErrorToast("No linked device found", "Error");
        return;
      }

      if (!selectedMinutes || selectedMinutes < 1 || selectedMinutes > 120) {
        showErrorToast("Invalid number of minutes", "Error");
        return;
      }

      if (!DeviceControl?.getRemainingTime || !DeviceControl?.syncPolicyNow) {
        showErrorToast("Device control is not available on this device", "Error");
        return;
      }

      await DeviceControl.syncPolicyNow();
      const nativeState = await DeviceControl.getRemainingTime();

      const limitMode = String(nativeState?.limitMode ?? "NONE");
      const blockReason = String(nativeState?.blockReason ?? "");

      const isDailyLimitActive =
        nativeState?.limitEnabled === true &&
        limitMode === "DAILY" &&
        Number(nativeState?.dailyLimitMinutes ?? 0) > 0;

      const isDailyLimitReached =
        blockReason === "DAILY_LIMIT_REACHED";

      if (!isDailyLimitActive) {
        showErrorToast(
          "Extra time requests are only available for daily screen-time limits.",
          "Error"
        );
        return;
      }

      if (!isDailyLimitReached) {
        showErrorToast(
          "You can request more time only after your daily limit is reached.",
          "Error"
        );
        return;
      }

      if (hasPendingRequestForThisDevice) {
        showErrorToast(
          "You already have a pending request for more time.",
          "Error"
        );
        return;
      }

      setIsSubmitting(true);

      await dispatch(
        createRequestThunk({
          deviceId,
          requestedMinutes: selectedMinutes,
          reason: message.trim(),
        })
      ).unwrap();

      showSuccessToast("Extension request sent successfully.");

      router.back();
    } catch (error) {
      showErrorToast(getErrorMessage((error as Error)?.message), "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.outer}>
            <View style={styles.content}>
              <View style={styles.headerBlock}>
                <View style={styles.subTitleRow}>
                  <View style={styles.subTitleIconBadge}>
                    <MaterialCommunityIcons
                      name="clock-plus-outline"
                      size={28}
                      color="#2F6DEB"
                    />
                  </View>
                </View>

                <AppText weight="extraBold" style={styles.question}>
                  How much time to request?
                </AppText>

                <AppText weight="medium" style={styles.helperText}>
                  Choose a quick option or set your own amount
                </AppText>
              </View>

              <View style={styles.grid}>
                <View style={styles.rowTwo}>
                  <MinuteCard
                    minutes={minuteOptions[0].minutes}
                    active={selectedMinutes === minuteOptions[0].minutes}
                    tile={minuteOptions[0].tile}
                    onPress={() => selectPreset(minuteOptions[0].minutes)}
                    a11y={`Select ${minuteOptions[0].minutes} extra minutes`}
                    minutesLabel="minutes"
                  />

                  <MinuteCard
                    minutes={minuteOptions[1].minutes}
                    active={selectedMinutes === minuteOptions[1].minutes}
                    tile={minuteOptions[1].tile}
                    onPress={() => selectPreset(minuteOptions[1].minutes)}
                    a11y={`Select ${minuteOptions[1].minutes} extra minutes`}
                    minutesLabel="minutes"
                  />
                </View>

                <View style={styles.customRow}>
                  <CustomCard
                    customMinutes={customMinutes}
                    active={selectedMinutes === customMinutes}
                    onSelect={() => selectCustom(customMinutes)}
                    onDec={decCustom}
                    onInc={incCustom}
                  />
                </View>
              </View>

              <View
                style={styles.summaryBar}
                accessibilityRole="summary"
                accessibilityLabel={`Requested ${selectedMinutes} minutes`}
              >
                <AppText weight="bold" style={styles.summaryLabel}>
                  Requested
                </AppText>
                <AppText weight="extraBold" style={styles.summaryAmount}>
                  +{selectedMinutes} minutes
                </AppText>
              </View>

              <View style={styles.messageBlock}>
                <AppText weight="bold" style={styles.messageLabel}>
                  Message to parent (optional)
                </AppText>

                <PaperTextInput
                  mode="outlined"
                  value={message}
                  onChangeText={setMessage}
                  placeholder="I want to finish watching the movie..."
                  multiline
                  numberOfLines={4}
                  accessibilityLabel="Message field"
                  style={styles.messageInput}
                  contentStyle={styles.messageInputContent}
                  outlineStyle={styles.messageInputOutline}
                  theme={{
                    roundness: 18,
                    colors: {
                      primary: palette.accent,
                      outline: palette.cardBorder,
                      background: palette.accentSoft,
                      onSurfaceVariant: palette.textMuted,
                    },
                  }}
                />
              </View>

              <Button
                mode="contained"
                onPress={onSend}
                disabled={isSubmitting || hasPendingRequestForThisDevice}
                accessibilityLabel="Send extension request"
                style={[
                  styles.sendBtn,
                  (isSubmitting || hasPendingRequestForThisDevice) && styles.sendBtnDisabled,
                ]}
                contentStyle={styles.sendBtnContent}
                labelStyle={[
                  styles.sendBtnText,
                  (isSubmitting || hasPendingRequestForThisDevice) && styles.sendBtnTextDisabled,
                ]}
                buttonColor={
                  isSubmitting || hasPendingRequestForThisDevice ? "#E5E7EB" : "#16A34A"
                }
                textColor={
                  isSubmitting || hasPendingRequestForThisDevice ? "#475569" : "#FFFFFF"
                }
                icon="send"
              >
                {hasPendingRequestForThisDevice
                  ? "Pending request already sent"
                  : isSubmitting
                    ? "Sending..."
                    : "Send request to parent"}
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}