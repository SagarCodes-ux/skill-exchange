import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { User } from "@/context/AppContext";

interface Props {
  user: User;
  size?: number;
}

const AVATAR_COLORS = [
  "#4F46E5", "#7C3AED", "#DB2777", "#DC2626",
  "#D97706", "#059669", "#0891B2", "#2563EB",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function Avatar({ user, size = 40 }: Props) {
  const initials = getInitials(user.name);
  const bgColor = getColor(user.name);
  const fontSize = size * 0.38;

  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor },
      ]}
    >
      <Text style={[styles.initials, { fontSize, color: "#fff" }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontFamily: "Inter_700Bold",
  },
});
