import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
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
import { TradeCard } from "@/components/TradeCard";
import { SkillBadge } from "@/components/SkillBadge";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const CATEGORIES = [
  "All", "Design", "Development", "Marketing",
  "Music", "Photography", "Writing", "Data",
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { trades, currentUser, unreadCount, unreadMessages } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : 0;

  const filteredTrades = selectedCategory === "All"
    ? trades.filter((t) => t.status === "open")
    : trades.filter(
        (t) =>
          t.status === "open" &&
          (t.offerSkill.category === selectedCategory ||
            t.wantSkill.category === selectedCategory)
      );

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingBottom: bottomPad }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>Good morning</Text>
          <Text style={[styles.name, { color: colors.foreground }]}>{currentUser.name}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.muted }]}
            onPress={() => router.push("/notifications")}
          >
            <Feather name="bell" size={20} color={colors.foreground} />
            {unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <Avatar user={currentUser} size={38} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={[styles.heroBanner, { backgroundColor: colors.primary }]}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Trade Skills,{"\n"}Build Futures</Text>
            <Text style={styles.heroSubtitle}>
              Exchange your expertise today for the help you need tomorrow
            </Text>
            <TouchableOpacity
              style={styles.heroBtn}
              onPress={() => router.push("/post-trade")}
              activeOpacity={0.85}
            >
              <Feather name="plus" size={16} color={colors.primary} />
              <Text style={[styles.heroBtnText, { color: colors.primary }]}>Post a Trade</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>2.4k</Text>
              <Text style={styles.heroStatLabel}>Active Trades</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>12k</Text>
              <Text style={styles.heroStatLabel}>Members</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>98%</Text>
              <Text style={styles.heroStatLabel}>Satisfaction</Text>
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    selectedCategory === cat ? colors.primary : colors.card,
                  borderColor:
                    selectedCategory === cat ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: selectedCategory === cat ? "#fff" : colors.mutedForeground,
                  },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Open Trades
            </Text>
            <Text style={[styles.sectionCount, { color: colors.mutedForeground }]}>
              {filteredTrades.length} available
            </Text>
          </View>
          {filteredTrades.length === 0 ? (
            <View style={styles.empty}>
              <Feather name="inbox" size={32} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No trades in this category
              </Text>
            </View>
          ) : (
            filteredTrades.map((trade) => (
              <TradeCard key={trade.id} trade={trade} />
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push("/post-trade")}
        activeOpacity={0.85}
      >
        <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  greeting: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  name: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontFamily: "Inter_700Bold",
  },
  scroll: {
    paddingBottom: 100,
  },
  heroBanner: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  heroContent: {
    gap: 8,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    lineHeight: 32,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  heroBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 4,
  },
  heroBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  heroStats: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 14,
  },
  heroStat: {
    flex: 1,
    alignItems: "center",
  },
  heroStatNum: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 20,
  },
  heroStatLabel: {
    color: "rgba(255,255,255,0.75)",
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    marginTop: 2,
  },
  heroStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  categoryList: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
  },
  sectionCount: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  empty: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
  },
  fab: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
});
