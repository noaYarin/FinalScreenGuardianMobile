import React from "react";
import { Modal, Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "../AppText/AppText";
import { styles } from "./styles";
import { getAchievementIconByKey } from "@/src/utils/achievementIcons";

export type UnlockedAchievement = {
    key?: string;
    title: string;
    description?: string;
    xpReward?: number;
};

type AchievementUnlockedModalProps = {
    visible: boolean;
    achievement: UnlockedAchievement | null;
    onClose: () => void;
};

// Displays a custom celebratory popup when the child unlocks a new achievement.
export default function AchievementUnlockedModal({
    visible,
    achievement,
    onClose,
}: AchievementUnlockedModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <View style={styles.iconWrap}>
                        <MaterialCommunityIcons
                            name="trophy-outline"
                            size={44}
                            color="#B46B00"
                        />
                    </View>

                    <AppText weight="extraBold" style={styles.kicker}>
                        New achievement unlocked!
                    </AppText>

                    <AppText weight="extraBold" style={styles.title}>
                        {achievement?.title ?? "New Achievement"}
                    </AppText>

                    {!!achievement?.description && (
                        <AppText style={styles.description}>
                            {achievement.description}
                        </AppText>
                    )}

                    <View style={styles.rewardPill}>
                        <MaterialCommunityIcons
                            name={getAchievementIconByKey(achievement?.key)}
                            size={44}
                            color="#B46B00"
                        />
                        <AppText weight="extraBold" style={styles.rewardText}>
                            +{achievement?.xpReward ?? 0} XP
                        </AppText>
                    </View>

                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={onClose}
                        accessibilityRole="button"
                        accessibilityLabel="Close achievement popup"
                    >
                        <AppText weight="extraBold" style={styles.buttonText}>
                            Awesome!
                        </AppText>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}