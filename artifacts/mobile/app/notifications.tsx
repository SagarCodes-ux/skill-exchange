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
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { Notification } from "@/context/AppContext";

const NOTIF_ICONS: Record<string, { icon: string; color: string; bg: string }> = {
  trade_request: { icon: "repeat", color: "#4F46E5", bg: "#EEF2FF" },
  message: { icon: "message-circle", color: "#0891B2", bg: "#ECFEFF" },
  contract_signed: { icon: "shield", color: "#10B981", bg: "#ECFDF5" },
  trade_completed: { icon: "check-circle", color: "#F59E0B", bg: "#FFFBEB" },
};

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useApp();

  const isWeb = Platform.OS === "web";

  const renderItem = ({ item }: { item: Notification }) => {
    const meta = NOTIF_ICONS[item.type] ?? NOTIF_ICONS.trade_request;
    return (
      <TouchableOpacity
        style={[
          styles.row,
          {
            backgroundColor: item.read ? colors.card : colors.secondary,
            borderBottomColor: colors.border,
          },
        ]}
        onPress={() => {
          markNotificationRead(item.id);
          if (item.tradeId) {
            router.push({ pathname: "/trade/[id]", params: { id: item.tradeId } });
          }
        }}
        activeOpacity={0.85}
      >
        <View style={[styles.iconWrap, { backgroundColor: meta.bg }]}>
          <Feather name={meta.icon as any} size={20} color={meta.color} />
        </View>
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={[styles.title, { color: colors.foreground, fontFamily: item.read ? "Inter_400Regular" : "Inter_600SemiBold" }]}>
              {item.title}
            </Text>
            {!item.read && <View style={[styles.dot, { backgroundColor: colors.primary }]} />}
          </View>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>{item.body}</Text>
          <Text style={[styles.time, { color: colors.mutedForeground }]}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: isWeb ? 34 + 80 : 100 }}
        ListHeaderComponent={
          unreadCount > 0 ? (
            <TouchableOpacity
              style={[styles.markAllBtn, { borderBottomColor: colors.border }]}
              onPress={markAllNotificationsRead}
            >
              <Text style={[styles.markAllText, { color: colors.primary }]}>
                Mark all as read
              </Text>
            </TouchableOpacity>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="bell" size={36} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>All caught up</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              You'll see trade updates and messages here
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  markAllBtn: {
    padding: 16,
    borderBottomWidth: 1,
    alignItems: "flex-end",
  },
  markAllText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
    borderBottomWidth: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 3,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  body: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
  time: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  empty: {
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 17,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
  },
});
