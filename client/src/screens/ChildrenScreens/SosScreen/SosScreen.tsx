import React, { useState } from "react";
import { View, Pressable, useWindowDimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";
import { showErrorToast, showSuccessToast } from "@/src/utils/appToast";
import type { RootState } from "@/src/redux/store/types";
import { apiSendSosAlert } from "@/src/api/sos";

export default function DistressScreen() {
  const { width } = useWindowDimensions();
  const [isSending, setIsSending] = useState(false);

  const deviceId = useSelector((state: RootState) => state.auth.deviceId);

  const areaSize = Math.min(320, Math.max(240, width - 32));
  const ringInset = Math.round(areaSize * (18 / 320));
  const buttonSize = Math.round(areaSize * (230 / 320));

  const onSOSPress = async () => {
    if (isSending) return;

    try {
      setIsSending(true);

      await apiSendSosAlert(deviceId ?? null);

      showSuccessToast(
        "An alert was sent to your parents.",
        "SOS sent"
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not send the SOS alert. Please try again.";

      showErrorToast(message, "SOS failed");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.page}>
        <View style={styles.heroCard}>
          <View style={[styles.sosArea, { width: areaSize, height: areaSize }]}>
            <View style={styles.ringOuter} />

            <View
              style={[
                styles.ringInner,
                {
                  top: ringInset,
                  left: ringInset,
                  right: ringInset,
                  bottom: ringInset,
                },
              ]}
            />

            <Pressable
              onPress={onSOSPress}
              disabled={isSending}
              accessibilityRole="button"
              accessibilityLabel="Send SOS"
              style={({ pressed }) => [
                styles.sosButton,
                {
                  width: buttonSize,
                  height: buttonSize,
                  borderRadius: buttonSize / 2,
                },
                pressed && !isSending && styles.sosButtonPressed,
                isSending && styles.sosButtonDisabled,
              ]}
            >
              <View style={styles.exMarkCircle}>
                <AppText weight="extraBold" style={styles.exMark}>
                  !
                </AppText>
              </View>

              <AppText weight="extraBold" style={styles.sosText}>
                SOS
              </AppText>

              {isSending && (
                <AppText weight="medium" style={styles.sendingText}>
                  Sending...
                </AppText>
              )}
            </Pressable>
          </View>

          <View style={styles.textBlock}>
            <AppText weight="extraBold" style={styles.titleText}>
              Need help?
            </AppText>

            <AppText weight="medium" style={styles.subtitle}>
              Tap the button to send an alert
            </AppText>
          </View>
        </View>

        <View style={styles.sendCard}>
          <View
            style={styles.peopleIcon}
            accessibilityElementsHidden
            importantForAccessibility="no"
          >
            <MaterialCommunityIcons
              name="account-group-outline"
              size={22}
              color="#2F6DEB"
            />
          </View>

          <View style={styles.sendCardText}>
            <AppText weight="medium" style={styles.sendToLabel}>
              Send to
            </AppText>

            <AppText weight="extraBold" style={styles.sendToValue}>
              Parents
            </AppText>
          </View>
        </View>

        <View style={styles.warningBox}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={18}
            color="#B46B00"
          />

          <AppText weight="medium" style={styles.warningText}>
            Use SOS only in real emergencies.
          </AppText>
        </View>
      </View>
    </ScreenLayout>
  );
}