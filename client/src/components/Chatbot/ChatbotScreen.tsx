import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import {
  Bubble,
  GiftedChat,
  IMessage,
} from "react-native-gifted-chat";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "@/src/components/AppText/AppText";
import { CHATBOT_ITEMS } from "@/data/chatbotData";
import type { ChatbotRole } from "@/data/chatbotData";
import { questionBubbleBg, styles } from "./ChatbotScreen.styles";
import { CHILD_ACCENT_COLORS } from "@/constants/childAccentColors";

type Props = {
  role: ChatbotRole;
};

const BOT_USER = {
  _id: "bot",
  name: "Bot",
};

export default function ChatbotScreen({ role }: Props) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [sending, setSending] = useState(false);

  const insets = useSafeAreaInsets();

  const myUser = useMemo(
    () => ({
      _id: role === "CHILD" ? "child" : "parent",
      name: role === "CHILD" ? "Child" : "Parent",
    }),
    [role]
  );

  const questionBubbles = useMemo(() => {
    return CHATBOT_ITEMS.filter((item) => item.targetRole === "BOTH" || item.targetRole === role);
  }, [role]);

  const appendBotMessage = useCallback((text: string) => {
    const msg: IMessage = {
      _id: `${Date.now()}-bot`,
      text,
      createdAt: new Date(),
      user: BOT_USER,
    };
    setMessages((prev) => GiftedChat.append(prev, [msg]));
  }, []);

  useEffect(() => {
    setMessages([
      {
        _id: "welcome",
        text:"Hi! Pick a topic and I’ll help you.",
        createdAt: new Date(),
        user: BOT_USER,
      },
    ]);
  }, [role]);

  const handleSelectOption = useCallback(
    async (menuOptionNumber: number) => {
      if (!Number.isFinite(menuOptionNumber)) return;

      const menuItem = CHATBOT_ITEMS.find((m) => m.menuOptionNumber === menuOptionNumber);
      const userText = menuItem?.question ?? `Option ${menuOptionNumber}`;

      const userMsg: IMessage = {
        _id: `${Date.now()}-user`,
        text: userText,
        createdAt: new Date(),
        user: myUser,
      };
      setMessages((prev) => GiftedChat.append(prev, [userMsg]));

      try {
        setSending(true);
        appendBotMessage(menuItem?.answer ?? "Sorry, I don't have an answer for that yet.");
      } finally {
        setSending(false);
      }
    },
    [appendBotMessage, myUser]
  );

  return (
    <View style={styles.screen}>
      <View style={styles.topSection}>
        <View style={styles.sectionTitle}>
          <AppText weight="bold" style={styles.sectionTitleText}>
            Quick questions
          </AppText>
        </View>

        <View style={styles.questionsRow}>
          {questionBubbles.length === 0 ? (
            <View style={styles.emptyWrap}>
              <AppText weight="bold" style={styles.emptyTitle}>
                No questions available yet
              </AppText>
            </View>
          ) : (
            questionBubbles.map((item, idx) => (
            (() => {
              const bg = CHILD_ACCENT_COLORS[idx % CHILD_ACCENT_COLORS.length];
              return (
            <Pressable
              key={String(item.menuOptionNumber ?? idx)}
              onPress={() => handleSelectOption(item.menuOptionNumber)}
              accessibilityRole="button"
              accessibilityLabel={item.question}
              style={({ pressed }) => [
                styles.questionBubble,
                questionBubbleBg(bg),
                pressed ? styles.questionBubblePressed : null,
              ]}
            >
              <AppText weight="bold" style={styles.questionBubbleText}>
                {item.question}
              </AppText>
            </Pressable>
              );
            })()
          ))
          )}
        </View>
      </View>

      <View style={[styles.chatCard, { marginBottom: Math.max(insets.bottom, 0) }]}>
        <GiftedChat
          messages={messages}
          onSend={() => {
          }}
          user={myUser}
          renderInputToolbar={() => null}
          isTyping={sending}
          timeTextStyle={{
            left: { color: "#64748B" },
            right: { color: "rgba(255,255,255,0.85)" },
          }}
          renderAvatar={(props) => {
            const isBot = String(props?.currentMessage?.user?._id) === "bot";
            if (!isBot) return null;
            return (
              <View style={styles.botAvatarWrap}>
                <MaterialCommunityIcons name="robot" size={20} color="#FFFFFF" />
              </View>
            );
          }}
          renderBubble={(props) => (
            <Bubble
              {...props}
              wrapperStyle={{
                left: {
                  backgroundColor: "#FFFFFF",
                  borderWidth: 1,
                  borderColor: "#EAF1FF",
                  borderRadius: 18,
                  paddingVertical: 2,
                  paddingHorizontal: 2,
                },
                right: {
                  backgroundColor: "#2563EB",
                  borderRadius: 18,
                  paddingVertical: 2,
                  paddingHorizontal: 2,
                },
              }}
              textStyle={{
                left: { color: "#0F172A", fontSize: 15, lineHeight: 20 },
                right: { color: "#FFFFFF", fontSize: 15, lineHeight: 20 },
              }}
            />
          )}
        />
      </View>
    </View>
  );
}

