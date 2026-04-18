import React, { useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

const ICON = {
  coin: "cash-multiple",
  check: "check",
  camera: "camera-outline",
} as const;

type Task = {
  id: string;
  title: string;
  coins: number;
  done: boolean;
};

export default function TasksScreen() {
  const [activeTab, setActiveTab] = useState<"done" | "todo">("done");

  const tasks: Task[] = [
    { id: "1", title: "Homework", coins: 15, done: true },
    { id: "2", title: "Read a Book", coins: 10, done: true },
    { id: "3", title: "Clean the Room", coins: 10, done: false },
    { id: "4", title: "Walk the Dog", coins: 8, done: false },
    { id: "5", title: "Help in the Kitchen", coins: 12, done: false },
  ];

  const filteredTasks =
    activeTab === "done"
      ? tasks.filter((task) => task.done)
      : tasks.filter((task) => !task.done);

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <View style={styles.contentMaxWidth}>
          <View style={styles.tabsWrapper}>
            <Pressable
              style={[
                styles.tabBtn,
                activeTab === "todo" ? styles.activeTab : styles.inactiveTab,
              ]}
              onPress={() => setActiveTab("todo")}
              accessibilityRole="button"
              accessibilityLabel="Show pending tasks"
            >
              <AppText weight="extraBold" style={styles.tabText}>
                Pending Tasks
              </AppText>
            </Pressable>

            <Pressable
              style={[
                styles.tabBtn,
                activeTab === "done" ? styles.activeTab : styles.inactiveTab,
              ]}
              onPress={() => setActiveTab("done")}
              accessibilityRole="button"
              accessibilityLabel="Show completed tasks"
            >
              <AppText weight="extraBold" style={styles.tabText}>
                Completed Tasks
              </AppText>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {filteredTasks.map((task) => (
              <View key={task.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <AppText
                    weight="extraBold"
                    style={styles.taskTitle}
                    numberOfLines={2}
                  >
                    {task.title}
                  </AppText>

                  <View style={styles.coinsBadge}>
                    <MaterialCommunityIcons
                      name={ICON.coin}
                      size={18}
                      color="#B46B00"
                    />
                    <AppText weight="extraBold" style={styles.coinsText}>
                      {task.coins}
                    </AppText>
                  </View>
                </View>

                {task.done ? (
                  <View style={styles.statusBoxDone}>
                    <View
                      style={[
                        styles.statusIconCircle,
                        styles.statusIconCircleDone,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={ICON.check}
                        size={18}
                        color="#0F8A5F"
                      />
                    </View>

                    <AppText weight="bold" style={styles.statusTextDone}>
                      Photo Uploaded
                    </AppText>
                  </View>
                ) : (
                  <View style={styles.todoArea}>
                    <AppText style={styles.todoHint}>
                      No photo uploaded
                    </AppText>

                    <Pressable
                      style={styles.uploadBtn}
                      accessibilityRole="button"
                      accessibilityLabel="Upload photo as proof of task completion"
                    >
                      <View style={styles.uploadBtnInner}>
                        <View
                          style={[
                            styles.statusIconCircle,
                            styles.statusIconCircleUpload,
                          ]}
                        >
                          <MaterialCommunityIcons
                            name={ICON.camera}
                            size={18}
                            color="#2F6DEB"
                          />
                        </View>

                        <AppText weight="extraBold" style={styles.uploadText}>
                          Upload Photo
                        </AppText>
                      </View>
                    </Pressable>
                  </View>
                )}
              </View>
            ))}

            <View style={styles.weekBox}>
              <View style={styles.weekInner}>
                <View style={styles.weekIconCircle}>
                  <MaterialCommunityIcons
                    name={ICON.coin}
                    size={18}
                    color="#B46B00"
                  />
                </View>

                <AppText weight="extraBold" style={styles.weekText}>
                  Coins earned this week: 38
                </AppText>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </ScreenLayout>
  );
}