import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
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
import { Avatar } from "@/components/Avatar";
import { SkillBadge } from "@/components/SkillBadge";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { Trade } from "@/context/AppContext";

export default function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { trades } = useApp();
  const [query, setQuery] = useState("");
  const [focusSearch, setFocusSearch] = useState(false);

  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? 67 : insets.top;

  const filtered = query.trim()
    ? trades.filter(
        (t) =>
          t.offerSkill.name.toLowerCase().includes(query.toLowerCase()) ||
          t.wantSkill.name.toLowerCase().includes(query.toLowerCase()) ||
          t.offeredBy.name.toLowerCase().includes(query.toLowerCase()) ||
          t.offerSkill.category.toLowerCase().includes(query.toLowerCase())
      )
    : trades.filter((t) => t.status === "open");

  const renderItem = ({ item }: { item: Trade }) => (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => router.push({ pathname: "/trade/[id]", params: { id: item.id } })}
      activeOpacity={0.85}
    >
      <Avatar user={item.offeredBy} size={44} />
      <View style={styles.rowContent}>
        <Text style={[styles.rowName, { color: colors.foreground }]}>{item.offeredBy.name}</Text>
        <View style={styles.rowSkills}>
          <SkillBadge skill={item.offerSkill} size="sm" />
          <Feather name="arrow-right" size={12} color={colors.mutedForeground} />
          <SkillBadge skill={item.wantSkill} size="sm" />
        </View>
        <View style={styles.rowMeta}>
          <Feather name="clock" size={11} color={colors.mutedForeground} />
          <Text style={[styles.rowMetaText, { color: colors.mutedForeground }]}>
            {item.hoursRequired}h · {item.futureDeadlineDays}d deadline
          </Text>
          {item.contractAddress && (
            <>
              <Feather name="shield" size={11} color="#10B981" />
              <Text style={[styles.rowMetaText, { color: "#10B981" }]}>On-chain</Text>
            </>
          )}
        </View>
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
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
        <Text style={[styles.title, { color: colors.foreground }]}>Explore</Text>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.muted,
              borderColor: focusSearch ? colors.primary : "transparent",
              borderWidth: 1.5,
            },
          ]}
        >
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search skills, people, categories..."
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setFocusSearch(true)}
            onBlur={() => setFocusSearch(false)}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, { paddingBottom: isWeb ? 34 + 80 : 90 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="search" size={32} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No results for "{query}"
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
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    padding: 0,
  },
  list: {
    padding: 16,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    marginBottom: 8,
  },
  rowContent: {
    flex: 1,
    gap: 5,
  },
  rowName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  rowSkills: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  rowMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rowMetaText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginRight: 6,
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
  },
});
