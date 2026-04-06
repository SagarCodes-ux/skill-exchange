import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
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
import { StatCard } from "@/components/StatCard";
import { TradeCard } from "@/components/TradeCard";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { currentUser, myTrades } = useApp();

  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? 67 : insets.top;

  const renderStars = (rep: number) => {
    return (
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Feather
            key={i}
            name="star"
            size={14}
            color={i <= Math.round(rep) ? "#F59E0B" : colors.border}
          />
        ))}
        <Text style={[styles.repNum, { color: colors.mutedForeground }]}>
          {rep.toFixed(1)}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: isWeb ? 34 + 80 : 100 }}
    >
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity style={[styles.settingsBtn, { backgroundColor: colors.muted }]}>
          <Feather name="settings" size={18} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Avatar user={currentUser} size={72} />
        <Text style={[styles.profileName, { color: colors.foreground }]}>{currentUser.name}</Text>
        <Text style={[styles.profileLocation, { color: colors.mutedForeground }]}>
          <Feather name="map-pin" size={12} color={colors.mutedForeground} /> {currentUser.location}
        </Text>
        {renderStars(currentUser.reputation)}
        <Text style={[styles.profileBio, { color: colors.mutedForeground }]}>{currentUser.bio}</Text>
        <Text style={[styles.memberSince, { color: colors.mutedForeground }]}>
          Member since {currentUser.memberSince}
        </Text>
        <TouchableOpacity
          style={[styles.editProfileBtn, { borderColor: colors.border }]}
        >
          <Feather name="edit-2" size={14} color={colors.foreground} />
          <Text style={[styles.editProfileText, { color: colors.foreground }]}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <StatCard
          label="Trades Done"
          value={currentUser.tradesCompleted}
          icon={<Feather name="check-circle" size={20} color={colors.primary} />}
        />
        <StatCard
          label="Reputation"
          value={currentUser.reputation.toFixed(1)}
          icon={<Feather name="star" size={20} color="#F59E0B" />}
        />
        <StatCard
          label="Active"
          value={myTrades.filter((t) => t.status === "active").length}
          icon={<Feather name="activity" size={20} color="#10B981" />}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>My Skills</Text>
        <View style={[styles.skillsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {currentUser.skills.map((skill) => (
            <View key={skill.id} style={[styles.skillRow, { borderBottomColor: colors.border }]}>
              <SkillBadge skill={skill} />
              <View style={[styles.levelBadge, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.levelText, { color: colors.primary }]}>
                  {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
                </Text>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.addSkillBtn}>
            <Feather name="plus" size={16} color={colors.primary} />
            <Text style={[styles.addSkillText, { color: colors.primary }]}>Add a Skill</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>My Trades</Text>
          <TouchableOpacity onPress={() => router.push("/post-trade")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>Post New</Text>
          </TouchableOpacity>
        </View>
        {myTrades.length === 0 ? (
          <View style={[styles.emptyTrades, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="repeat" size={28} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No trades yet. Post your first trade!
            </Text>
            <TouchableOpacity
              style={[styles.postBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/post-trade")}
            >
              <Text style={styles.postBtnText}>Post a Trade</Text>
            </TouchableOpacity>
          </View>
        ) : (
          myTrades.map((trade) => (
            <TradeCard key={trade.id} trade={trade} compact />
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Smart Contracts</Text>
        <View style={[styles.contractInfo, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Feather name="shield" size={24} color={colors.primary} />
          <View style={styles.contractText}>
            <Text style={[styles.contractTitle, { color: colors.foreground }]}>
              Blockchain-Verified Trades
            </Text>
            <Text style={[styles.contractDesc, { color: colors.mutedForeground }]}>
              All trades are secured with on-chain smart contracts. Once both parties agree, the commitment is immutable and verifiable.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
    alignItems: "flex-end",
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  profileCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    gap: 6,
  },
  profileName: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    marginTop: 4,
  },
  profileLocation: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  stars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginVertical: 2,
  },
  repNum: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    marginLeft: 4,
  },
  profileBio: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 4,
  },
  memberSince: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  editProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 8,
  },
  editProfileText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 8,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
  },
  seeAll: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  skillsCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  skillRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  levelText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  addSkillBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 14,
    justifyContent: "center",
  },
  addSkillText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
  },
  emptyTrades: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    gap: 10,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
  },
  postBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 4,
  },
  postBtnText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  contractInfo: {
    flexDirection: "row",
    gap: 14,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  contractText: {
    flex: 1,
    gap: 4,
  },
  contractTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  contractDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
  },
});
