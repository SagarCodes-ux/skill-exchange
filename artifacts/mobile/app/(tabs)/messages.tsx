import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/components/Avatar";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { Conversation } from "@/context/AppContext";

export default function MessagesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { conversations, unreadMessages } = useApp();

  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? 67 : insets.top;

  const renderItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: colors.border }]}
      onPress={() => router.push({ pathname: "/conversation/[id]", params: { id: item.id } })}
      activeOpacity={0.85}
    >
      <View style={styles.avatarWrapper}>
        <Avatar user={item.participant} size={48} />
        {item.unread > 0 && (
          <View style={[styles.unreadDot, { backgroundColor: colors.primary }]}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.name, { color: colors.foreground, fontFamily: item.unread > 0 ? "Inter_700Bold" : "Inter_600SemiBold" }]}>
            {item.participant.name}
          </Text>
          <Text style={[styles.time, { color: colors.mutedForeground }]}>{item.lastMessageTime}</Text>
        </View>
        <Text style={[styles.tradeLabel, { color: colors.primary }]} numberOfLines={1}>
          {item.trade.offerSkill.name} ↔ {item.trade.wantSkill.name}
        </Text>
        <Text
          style={[styles.lastMessage, { color: item.unread > 0 ? colors.foreground : colors.mutedForeground }]}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>Messages</Text>
          {unreadMessages > 0 && (
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              {unreadMessages} unread
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={[styles.editBtn, { backgroundColor: colors.muted }]}
        >
          <Feather name="edit-2" size={18} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: isWeb ? 34 + 80 : 90 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="message-circle" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No conversations yet</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Browse trades and reach out to start a conversation
            </Text>
            <TouchableOpacity
              style={[styles.exploreBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/(tabs)/explore")}
            >
              <Text style={styles.exploreBtnText}>Browse Trades</Text>
            </TouchableOpacity>
          </View>
        }
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
  },
  avatarWrapper: {
    position: "relative",
  },
  unreadDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Inter_700Bold",
  },
  content: {
    flex: 1,
    gap: 2,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 15,
  },
  time: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  tradeLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  lastMessage: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  separator: {
    height: 1,
    marginLeft: 82,
  },
  empty: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 17,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  exploreBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 8,
  },
  exploreBtnText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
});
