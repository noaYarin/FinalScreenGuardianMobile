import React from "react";
import { View } from "react-native";

import { GOALS } from "@/data/childGoals";
import ScreenLayout from "@/src/layouts/ScreenLayout/ScreenLayout";
import AppText from "@/src/components/AppText/AppText";
import { styles } from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type ChildGoal = {
  id: number;
  title: string;
  description: string;
  progressLabel: string;
  completed: boolean;
};

const progressPercent = 50;

export default function GoalsScreen() {
  return (
    <ScreenLayout>
      <View style={styles.page}>
        <View style={styles.subHeader}>
          <AppText style={styles.subHeaderEmoji}>🎯</AppText>
          <AppText weight="medium" style={styles.subHeaderSubtitle}>
            Finish all 3 to unlock new ones!
          </AppText>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeaderRow}>
            <AppText weight="extraBold" style={styles.progressLabel}>
              Overall Progress
            </AppText>
            <AppText weight="extraBold" style={styles.progressPercent}>
              {progressPercent}%
            </AppText>
          </View>

          <View
            style={styles.progressTrack}
            accessibilityRole="progressbar"
            accessibilityLabel={`Overall progress ${progressPercent} percent`}
          >
            <View
              style={[
                styles.progressFill,
                { width: `${progressPercent}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.goalsList}>
          {(GOALS as readonly ChildGoal[]).map((goal) => (
            <View
              key={goal.id}
              style={[
                styles.goalCard,
                goal.completed ? styles.goalCardCompleted : styles.goalCardActive,
              ]}
              accessibilityRole="summary"
              accessibilityLabel={`${goal.title}, ${goal.description}, ${goal.progressLabel}`}
            >
              <View style={styles.goalCardRow}>
                {goal.completed ? (
                  <View
                    style={styles.checkboxCompleted}
                    accessibilityRole="image"
                    accessibilityLabel="Done"
                  >
                    <MaterialCommunityIcons
                      name="check"
                      size={18}
                      color="#7C4A1E"
                    />
                  </View>
                ) : (
                  <View
                    style={styles.checkboxEmpty}
                    accessibilityRole="image"
                    accessibilityLabel="Not done yet"
                  />
                )}

                <View style={styles.goalTextBlock}>
                  <AppText weight="extraBold" style={styles.goalTitle}>
                    {goal.title}
                  </AppText>
                  <AppText weight="medium" style={styles.goalDescription}>
                    {goal.description}
                  </AppText>
                  <AppText weight="bold" style={styles.goalProgress}>
                    {goal.progressLabel}
                  </AppText>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScreenLayout>
  );
}
