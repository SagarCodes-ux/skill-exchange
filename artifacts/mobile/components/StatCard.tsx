import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface Props {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, icon }: Props) {
  const colors = useColors();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {icon && <View style={styles.iconWrap}>{icon}</View>}
      <Text style={[styles.value, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    alignItems: "center",
    gap: 4,
  },
  iconWrap: {
    marginBottom: 4,
  },
  value: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
  },
  label: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    textAlign: "center",
  },
});
