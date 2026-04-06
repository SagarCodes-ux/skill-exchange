import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/components/Avatar";
import { SkillBadge } from "@/components/SkillBadge";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function TradeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { trades, acceptTrade, currentUser } = useApp();
  const [accepting, setAccepting] = useState(false);

  const isWeb = Platform.OS === "web";
  const bottomPad = isWeb ? 34 : insets.bottom;

  const trade = trades.find((t) => t.id === id);

  if (!trade) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground, padding: 20 }}>Trade not found</Text>
      </View>
    );
  }

  const isOwn = trade.offeredBy.id === currentUser.id;
  const isOpen = trade.status === "open";

  const handleAccept = async () => {
    setAccepting(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    acceptTrade(trade.id);
    setTimeout(() => {
      setAccepting(false);
      Alert.alert(
        "Trade Request Sent!",
        `Your request has been sent to ${trade.offeredBy.name}. You'll be notified when they respond.`,
        [{ text: "Got it", onPress: () => router.back() }]
      );
    }, 500);
  };

  const handleMessage = () => {
    router.push({ pathname: "/conversation/[id]", params: { id: `c${trade.id}` } });
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPad + 100 }}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.userSection}>
            <Avatar user={trade.offeredBy} size={56} />
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: colors.foreground }]}>{trade.offeredBy.name}</Text>
              <Text style={[styles.userLocation, { color: colors.mutedForeground }]}>
                {trade.offeredBy.location}
              </Text>
              <View style={styles.repRow}>
                <Feather name="star" size={13} color="#F59E0B" />
                <Text style={[styles.rep, { color: colors.mutedForeground }]}>
                  {trade.offeredBy.reputation.toFixed(1)} · {trade.offeredBy.tradesCompleted} trades completed
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Text style={[styles.label, { color: colors.mutedForeground }]}>ABOUT</Text>
          <Text style={[styles.bio, { color: colors.foreground }]}>{trade.offeredBy.bio}</Text>
        </View>

        <View style={[styles.exchangeCard, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Text style={[styles.exchangeTitle, { color: colors.primary }]}>Trade Exchange</Text>
          <View style={styles.exchangeRow}>
            <View style={styles.exchangeSide}>
              <Text style={[styles.exchangeLabel, { color: colors.mutedForeground }]}>THEY OFFER</Text>
              <SkillBadge skill={trade.offerSkill} />
            </View>
            <View style={[styles.exchangeIcon, { backgroundColor: colors.primary }]}>
              <Feather name="repeat" size={18} color="#fff" />
            </View>
            <View style={styles.exchangeSide}>
              <Text style={[styles.exchangeLabel, { color: colors.mutedForeground }]}>THEY WANT</Text>
              <SkillBadge skill={trade.wantSkill} />
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>DESCRIPTION</Text>
          <Text style={[styles.description, { color: colors.foreground }]}>{trade.description}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>TRADE TERMS</Text>
          <View style={styles.termsList}>
            <View style={styles.termRow}>
              <View style={[styles.termIcon, { backgroundColor: colors.secondary }]}>
                <Feather name="clock" size={14} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.termValue, { color: colors.foreground }]}>{trade.hoursRequired} hours</Text>
                <Text style={[styles.termDesc, { color: colors.mutedForeground }]}>Total commitment required</Text>
              </View>
            </View>
            <View style={styles.termRow}>
              <View style={[styles.termIcon, { backgroundColor: colors.secondary }]}>
                <Feather name="calendar" size={14} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.termValue, { color: colors.foreground }]}>{trade.futureDeadlineDays} days</Text>
                <Text style={[styles.termDesc, { color: colors.mutedForeground }]}>Window to fulfill the future labor</Text>
              </View>
            </View>
            {trade.contractAddress ? (
              <View style={styles.termRow}>
                <View style={[styles.termIcon, { backgroundColor: "#ECFDF5" }]}>
                  <Feather name="shield" size={14} color="#10B981" />
                </View>
                <View>
                  <Text style={[styles.termValue, { color: "#10B981" }]}>Smart Contract Active</Text>
                  <Text style={[styles.termDesc, { color: colors.mutedForeground }]}>
                    {trade.contractAddress} · Verified on-chain
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.termRow}>
                <View style={[styles.termIcon, { backgroundColor: colors.secondary }]}>
                  <Feather name="shield" size={14} color={colors.mutedForeground} />
                </View>
                <View>
                  <Text style={[styles.termValue, { color: colors.foreground }]}>Smart Contract</Text>
                  <Text style={[styles.termDesc, { color: colors.mutedForeground }]}>
                    Deployed upon mutual acceptance
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>THEIR SKILLS</Text>
          <View style={styles.skillsList}>
            {trade.offeredBy.skills.map((skill) => (
              <SkillBadge key={skill.id} skill={skill} variant="outlined" />
            ))}
          </View>
        </View>
      </ScrollView>

      {!isOwn && isOpen && (
        <View
          style={[
            styles.actionBar,
            {
              backgroundColor: colors.card,
              borderTopColor: colors.border,
              paddingBottom: bottomPad + 16,
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.msgBtn, { borderColor: colors.border }]}
            onPress={handleMessage}
          >
            <Feather name="message-circle" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.acceptBtn, { backgroundColor: accepting ? colors.accent : colors.primary }]}
            onPress={handleAccept}
            disabled={accepting}
            activeOpacity={0.85}
          >
            {accepting ? (
              <Text style={styles.acceptBtnText}>Sending...</Text>
            ) : (
              <>
                <Feather name="check" size={18} color="#fff" />
                <Text style={styles.acceptBtnText}>Request Trade</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  userSection: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
    gap: 3,
  },
  userName: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
  },
  userLocation: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  repRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rep: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  divider: {
    height: 1,
  },
  label: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.7,
  },
  bio: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 21,
  },
  exchangeCard: {
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
  },
  exchangeTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    textAlign: "center",
  },
  exchangeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  exchangeSide: {
    flex: 1,
    gap: 6,
    alignItems: "center",
  },
  exchangeLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.6,
  },
  exchangeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  termsList: {
    gap: 14,
  },
  termRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  termIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  termValue: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  termDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginTop: 1,
  },
  skillsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  msgBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  acceptBtnText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
});
