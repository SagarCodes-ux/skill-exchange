import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useLocalSearchParams } from "expo-router";
import { Avatar } from "@/components/Avatar";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { Message } from "@/context/AppContext";

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { conversations, currentUser } = useApp();
  const [text, setText] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  const isWeb = Platform.OS === "web";

  const convo = conversations.find((c) => c.id === id);
  const allMessages = convo
    ? [...convo.messages, ...localMessages]
    : localMessages;

  const handleSend = async () => {
    if (!text.trim()) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const msg: Message = {
      id: `msg_${Date.now()}`,
      senderId: "me",
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    setLocalMessages((prev) => [...prev, msg]);
    setText("");
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.senderId === "me" || item.senderId === currentUser.id;
    return (
      <View style={[styles.msgRow, isMe && styles.msgRowMe]}>
        {!isMe && convo && (
          <Avatar user={convo.participant} size={28} />
        )}
        <View
          style={[
            styles.bubble,
            isMe
              ? [styles.bubbleMe, { backgroundColor: colors.primary }]
              : [styles.bubbleOther, { backgroundColor: colors.card, borderColor: colors.border }],
          ]}
        >
          <Text style={[styles.bubbleText, { color: isMe ? "#fff" : colors.foreground }]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      {convo && (
        <View style={[styles.tradeContext, { backgroundColor: colors.secondary, borderBottomColor: colors.border }]}>
          <Feather name="repeat" size={14} color={colors.primary} />
          <Text style={[styles.tradeContextText, { color: colors.primary }]}>
            {convo.trade.offerSkill.name} ↔ {convo.trade.wantSkill.name}
          </Text>
        </View>
      )}

      <FlatList
        data={allMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        scrollEnabled={!!allMessages.length}
        ListEmptyComponent={
          <View style={styles.emptyChat}>
            {convo && <Avatar user={convo.participant} size={56} />}
            <Text style={[styles.emptyChatText, { color: colors.mutedForeground }]}>
              Start the conversation
            </Text>
          </View>
        }
      />

      <View
        style={[
          styles.inputBar,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingBottom: isWeb ? 34 : insets.bottom || 16,
          },
        ]}
      >
        <TextInput
          style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground }]}
          placeholder="Message..."
          placeholderTextColor={colors.mutedForeground}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: text.trim() ? colors.primary : colors.muted }]}
          onPress={handleSend}
          disabled={!text.trim()}
        >
          <Feather name="send" size={18} color={text.trim() ? "#fff" : colors.mutedForeground} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  tradeContext: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  tradeContextText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  messageList: {
    padding: 16,
    gap: 10,
    paddingBottom: 20,
  },
  msgRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 8,
  },
  msgRowMe: {
    flexDirection: "row-reverse",
  },
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleMe: {
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    borderWidth: 1,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyChat: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyChatText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
  },
});
