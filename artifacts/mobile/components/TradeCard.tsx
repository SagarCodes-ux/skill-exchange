import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { Trade } from "@/context/AppContext";
import { SkillBadge } from "./SkillBadge";
import { Avatar } from "./Avatar";

interface Props {
  trade: Trade;
  compact?: boolean;
}

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  pending: "Pending",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  open: "#10B981",
  pending: "#F59E0B",
  active: "#4F46E5",
  completed: "#6B7280",
  cancelled: "#EF4444",
};

export function TradeCard({ trade, compact = false }: Props) {
  const colors = useColors();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => router.push({ pathname: "/trade/[id]", params: { id: trade.id } })}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <View style={styles.userRow}>
          <Avatar user={trade.offeredBy} size={36} />
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.foreground }]}>{trade.offeredBy.name}</Text>
            <View style={styles.repRow}>
              <Feather name="star" size={11} color="#F59E0B" />
              <Text style={[styles.rep, { color: colors.mutedForeground }]}>
                {trade.offeredBy.reputation.toFixed(1)} · {trade.offeredBy.tradesCompleted} trades
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[trade.status] + "18" }]}>
          <Text style={[styles.statusText, { color: STATUS_COLORS[trade.status] }]}>
            {STATUS_LABELS[trade.status]}
          </Text>
        </View>
      </View>

      <View style={styles.exchange}>
        <View style={styles.exchangeSide}>
          <Text style={[styles.exchangeLabel, { color: colors.mutedForeground }]}>OFFERS</Text>
          <SkillBadge skill={trade.offerSkill} />
        </View>
        <View style={[styles.arrowContainer, { backgroundColor: colors.secondary }]}>
          <Feather name="repeat" size={16} color={colors.primary} />
        </View>
        <View style={styles.exchangeSide}>
          <Text style={[styles.exchangeLabel, { color: colors.mutedForeground }]}>WANTS</Text>
          <SkillBadge skill={trade.wantSkill} />
        </View>
      </View>

      {!compact && (
        <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={2}>
          {trade.description}
        </Text>
      )}

      <View style={styles.footer}>
        <View style={styles.metaItem}>
          <Feather name="clock" size={12} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
            {trade.hoursRequired}h commitment
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Feather name="calendar" size={12} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
            {trade.futureDeadlineDays}d to fulfill
          </Text>
        </View>
        {trade.contractAddress && (
          <View style={styles.metaItem}>
            <Feather name="shield" size={12} color="#10B981" />
            <Text style={[styles.metaText, { color: "#10B981" }]}>On-chain</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  repRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 1,
  },
  rep: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  exchange: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  exchangeSide: {
    flex: 1,
    gap: 6,
  },
  exchangeLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.6,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
