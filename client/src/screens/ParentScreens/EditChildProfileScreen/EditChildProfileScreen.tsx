import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  useWindowDimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import InlineDatePicker from "../../../components/InlineDatePicker/InlineDatePicker";
import ChildSelector from "../../../components/ChildSelector/ChildSelector";
import { styles } from "./styles";

import type { RootState, AppDispatch } from "@/src/redux/store/types";
import { updateCurrentChildProfileThunk } from "@/src/redux/thunks/childrenThunks";
import { showErrorToast, showSuccessToast } from "@/src/utils/appToast";
import { APP_COLORS } from "@/constants/theme";

type GenderValue = "boy" | "girl" | "other";

const GENDER_OPTIONS: {
  key: GenderValue;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  accessibilityLabel: string;
}[] = [
  { key: "boy", icon: "human-male", label: "Boy", accessibilityLabel: "Select boy" },
  { key: "girl", icon: "human-female", label: "Girl", accessibilityLabel: "Select girl" },
  { key: "other", icon: "human-greeting-variant", label: "Other", accessibilityLabel: "Select other" },
];

function formatDateForDisplay(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function calculateAge(date: Date) {
  const today = new Date();

  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }

  return age;
}

function formatDateForApi(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function EditChildProfileScreen() {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch<AppDispatch>();

  const isTablet = width >= 768;
  const isLargeTablet = width >= 1100;

  const children = useSelector(
    (state: RootState) => state.children.childrenList ?? []
  );
  const { isLoading } = useSelector((state: RootState) => state.children);

  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [gender, setGender] = useState<GenderValue>("girl");
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!children || children.length === 0) return;

    const targetId = selectedChildId || String(children[0]._id);
    const currentChild = children.find((c) => String(c._id) === targetId);

    if (!currentChild) return;

    if (!selectedChildId) {
      setSelectedChildId(String(currentChild._id));
    }

    if (currentChild.birthDate) {
      const newDate = new Date(currentChild.birthDate);
      if (birthDate.getTime() !== newDate.getTime()) {
        setBirthDate(newDate);
      }
    }

    if (currentChild.gender && currentChild.gender !== gender) {
      setGender(currentChild.gender as GenderValue);
    }
  }, [children, selectedChildId]);

  const formattedBirthDate = useMemo(() => {
    return formatDateForDisplay(birthDate);
  }, [birthDate]);

  const handleSave = async () => {
    if (!selectedChildId || !birthDate) return;

    const age = calculateAge(birthDate);

    if (age < 6 || age > 17) {
      showErrorToast("Age must be between 6 and 17", "Error");
      return;
    }

    try {
      await dispatch(
        updateCurrentChildProfileThunk({
          childId: selectedChildId,
          birthDate: formatDateForApi(birthDate),
          gender,
        })
      ).unwrap();
      showSuccessToast("Child profile updated successfully.");
      router.back();
    } catch (error) {
      showErrorToast(
        typeof error === "string" ? error : "Could not update the child profile. Please try again.",
        "Error"
      );
    }
  };

  return (
    <ScreenLayout backgroundColor={APP_COLORS.screenBg}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.container,
            isTablet && styles.containerTablet,
            isLargeTablet && styles.containerLargeTablet,
          ]}
        >
          <ChildSelector
            selectedChildId={selectedChildId}
            onSelectChild={setSelectedChildId}
          />

          <View style={[styles.formGrid, isTablet && styles.formGridTablet]}>
            <View style={[styles.sectionCard, isTablet && styles.sectionCardHalf]}>
              <View style={styles.sectionHeader}>
                <AppText weight="extraBold" style={styles.sectionTitle}>
                  Birth Date
                </AppText>
              </View>

              <Pressable
                onPress={() => setShowDatePicker(true)}
                accessibilityRole="button"
                accessibilityLabel="Choose birth date"
                style={({ pressed }) => [
                  styles.dateFieldButton,
                  pressed && styles.dateFieldButtonPressed,
                ]}
              >
                <View style={styles.dateFieldContent}>
                  <View style={styles.dateFieldLeft}>
                    <View style={styles.dateIconWrap}>
                      <AppText style={styles.dateIconEmoji}>📅</AppText>
                    </View>

                    <View style={styles.dateTextWrap}>
                      <AppText weight="medium" style={styles.dateFieldLabel}>
                        Child birth date
                      </AppText>

                      <AppText weight="extraBold" style={styles.dateFieldValue}>
                        {formattedBirthDate}
                      </AppText>
                    </View>
                  </View>

                  <AppText weight="bold" style={styles.dateFieldChangeText}>
                    Change
                  </AppText>
                </View>
              </Pressable>

              <InlineDatePicker
                visible={showDatePicker}
                value={birthDate ?? new Date()}
                maximumDate={new Date()}
                onChange={setBirthDate}
                onRequestClose={() => setShowDatePicker(false)}
                doneLabel="Done"
                doneAccessibilityLabel="Confirm birth date"
                footerContainerStyle={styles.iosPickerFooter}
                donePressableStyle={styles.iosPickerDoneButton}
                doneLabelStyle={styles.iosPickerDoneText}
              />
            </View>

            <View style={[styles.sectionCard, isTablet && styles.sectionCardHalf]}>
              <View style={styles.sectionHeader}>
                <AppText weight="extraBold" style={styles.sectionTitle}>
                  Gender
                </AppText>
              </View>

              <View style={styles.genderRow}>
                {GENDER_OPTIONS.map((option) => {
                  const isSelected = option.key === gender;

                  return (
                    <Pressable
                      key={option.key}
                      onPress={() => setGender(option.key)}
                      style={[
                        styles.genderButton,
                        isSelected && styles.genderButtonActive,
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={option.accessibilityLabel}
                    >
                      <MaterialCommunityIcons
                        name={option.icon}
                        size={16}
                        color={isSelected ? "#2563EB" : "#475569"}
                      />

                      <AppText
                        weight="bold"
                        style={[
                          styles.genderButtonText,
                          isSelected && styles.genderButtonTextActive,
                        ]}
                      >
                        {option.label}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Save child profile settings"
              style={[styles.saveButton, isLoading && styles.disabledButton]}
            >
              {isLoading ? (
                <ActivityIndicator color="#1D4ED8" />
              ) : (
                <AppText style={styles.saveButtonText} weight="bold">
                  Save
                </AppText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}