import React, { useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "../AppText/AppText";
import { styles } from "./styles";

type InfoHintProps = {
    title?: string;
    lines: string[];
};

export default function InfoHint({
    title = "Important information",
    lines,
}: InfoHintProps) {
    const [open, setOpen] = useState(false);

    return (
        <View style={styles.wrapper}>
            <Pressable
                onPress={() => setOpen(true)}
                accessibilityRole="button"
                accessibilityLabel="Open info"
                style={({ pressed }) => [
                    styles.iconButton,
                    pressed ? styles.iconButtonPressed : null,
                ]}
            >
                <MaterialCommunityIcons
                    name="lightbulb-on-outline"
                    size={20}
                    color="#F59E0B"
                />
            </Pressable>

            <Modal
                visible={open}
                transparent
                animationType="fade"
                onRequestClose={() => setOpen(false)}
            >
                <Pressable
                    onPress={() => setOpen(false)}
                    style={styles.backdrop}
                >
                    <Pressable onPress={() => {}} style={styles.modalCard}>
                        <AppText weight="bold" style={styles.title}>
                            {title}
                        </AppText>

                        <View style={styles.titleSeparator} />

                        <View style={styles.linesWrap}>
                            {lines.map((line, index) => (
                                <View key={`${title}-${index}`} style={styles.lineItemLtr}>
                                    <View style={styles.lineRow}>
                                        <View style={styles.dot} />
                                        <AppText style={styles.lineText}>{line}</AppText>
                                    </View>

                                    {index < lines.length - 1 ? <View style={styles.separator} /> : null}
                                </View>
                            ))}
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

