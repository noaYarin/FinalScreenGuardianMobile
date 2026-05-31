import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Pressable,
  TextInput,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import InlineDatePicker from "../../../components/InlineDatePicker/InlineDatePicker";
import { styles } from "../AddChildScreen/styles";

import type { RootState, AppDispatch } from "@/src/redux/store/types";
import { getMyChildrenThunk, updateCurrentChildProfileThunk } from "@/src/redux/thunks/childrenThunks";
import { showErrorToast, showSuccessToast } from "@/src/utils/appToast";
import { APP_COLORS } from "@/constants/theme";
import { parseRouteParam } from "../ChildDetailsScreen/childDetailsRouteParams";

type GenderOption = "boy" | "girl" | "other";

const GENDER_OPTIONS: {
  key: GenderOption;
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

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < date.getDate())
  ) {
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
  const params = useLocalSearchParams<{ childId?: string; id?: string }>();

  const children = useSelector(
    (state: RootState) => state.children.childrenList ?? []
  );
  const { isLoading } = useSelector((state: RootState) => state.children);

  const routeChildId = useMemo(() => {
    return (
      parseRouteParam(params.childId) ||
      parseRouteParam(params.id)
    );
  }, [params.childId, params.id]);

  const [childId, setChildId] = useState("");
  const [childName, setChildName] = useState("");
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [gender, setGender] = useState<GenderOption>("boy");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const hydratedChildIdRef = useRef("");

  const maxContentWidth = Math.min(900, Math.max(340, width - 32));

  useEffect(() => {
    dispatch(getMyChildrenThunk());
  }, [dispatch]);

  useEffect(() => {
    hydratedChildIdRef.current = "";
  }, [routeChildId]);

  useEffect(() => {
    if (children.length === 0) {
      return;
    }

    const targetId = routeChildId || String(children[0]._id);

    const currentChild = children.find(
      (child) => String(child._id) === String(targetId)
    );

    if (!currentChild) {
      return;
    }

    const currentChildId = String(currentChild._id);

    if (hydratedChildIdRef.current === currentChildId) {
      return;
    }

    hydratedChildIdRef.current = currentChildId;
    setChildId(currentChildId);
    setChildName(currentChild.name ?? "");

    if (currentChild.birthDate) {
      setBirthDate(new Date(currentChild.birthDate));
    }

    if (
      currentChild.gender === "boy" ||
      currentChild.gender === "girl" ||
      currentChild.gender === "other"
    ) {
      setGender(currentChild.gender);
    }
  }, [children, routeChildId]);

  const formattedBirthDate = useMemo(() => {
    return formatDateForDisplay(birthDate);
  }, [birthDate]);

  const onSave = async () => {
    if (!childId) {
      return;
    }

    if (!childName.trim()) {
      showErrorToast("Please enter a name", "Error");
      return;
    }

    const age = calculateAge(birthDate);

    if (age < 6 || age > 17) {
      showErrorToast("Age must be between 6 and 17", "Error");
      return;
    }

    try {
      await dispatch(
        updateCurrentChildProfileThunk({
          childId,
          name: childName.trim(),
          birthDate: formatDateForApi(birthDate),
          gender,
        })
      ).unwrap();

      showSuccessToast("Child profile updated successfully.");
      router.back();
    } catch (error) {
      showErrorToast(
        typeof error === "string"
          ? error
          : "Could not update the child profile. Please try again.",
        "Error"
      );
    }
  };

  return (
    <ScreenLayout scrollable={false} backgroundColor={APP_COLORS.screenBg}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.content, { maxWidth: maxContentWidth }]}>
          <View style={styles.formCard}>
            <View style={styles.fieldBlock}>
              <AppText weight="bold" style={styles.label}>
                Child's name
              </AppText>

              <TextInput
                value={childName}
                onChangeText={setChildName}
                placeholder="e.g. Leo"
                placeholderTextColor="#94A3B8"
                style={styles.input}
                maxLength={30}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!isLoading}
                accessibilityLabel="Child name field"
              />
            </View>

            <View style={styles.fieldBlock}>
              <AppText weight="bold" style={styles.label}>
                Birth date
              </AppText>

              <Pressable
                onPress={() => setShowDatePicker(true)}
                accessibilityRole="button"
                accessibilityLabel="Birth date field"
                style={({ pressed }) => [
                  styles.dateFieldButton,
                  pressed && styles.dateFieldButtonPressed,
                ]}
              >
                <View style={styles.dateFieldContent}>
                  <View style={styles.dateFieldLeft}>
                    <View style={styles.dateIconWrap}>
                      <MaterialCommunityIcons
                        name="calendar-outline"
                        size={22}
                        color="#2563EB"
                      />
                    </View>

                    <AppText weight="bold" style={styles.dateFieldValue}>
                      {formattedBirthDate}
                    </AppText>
                  </View>

                  <AppText weight="bold" style={styles.dateFieldChangeText}>
                    Change
                  </AppText>
                </View>
              </Pressable>

              <AppText style={styles.fieldHint}>
                The child must be between 6 and 17 years old.
              </AppText>

              <InlineDatePicker
                visible={showDatePicker}
                value={birthDate}
                maximumDate={new Date()}
                onChange={setBirthDate}
                onRequestClose={() => setShowDatePicker(false)}
                doneLabel="Done"
                doneAccessibilityLabel="Confirm birth date"
              />
            </View>

            <View style={styles.fieldBlock}>
              <AppText weight="bold" style={styles.label}>
                Gender
              </AppText>

              <View style={styles.genderRow}>
                {GENDER_OPTIONS.map((option) => {
                  const isSelected = gender === option.key;

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
                        color={isSelected ? "#1D4ED8" : "#64748B"}
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

            <Pressable
              style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
              onPress={onSave}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Save child profile"
            >
              {isLoading ? (
                <ActivityIndicator color="#1D4ED8" />
              ) : (
                <AppText weight="extraBold" style={styles.saveButtonText}>
                  Save Changes
                </AppText>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
