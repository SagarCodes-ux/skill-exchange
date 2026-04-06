import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { Skill } from "@/context/AppContext";

interface Props {
  skill: Skill;
  size?: "sm" | "md";
  variant?: "default" | "outlined";
}

const CATEGORY_COLORS: Record<string, string> = {
  Design: "#7C3AED",
  Development: "#2563EB",
  Marketing: "#D97706",
  Finance: "#059669",
  Writing: "#DC2626",
  Music: "#DB2777",
  Photography: "#7C3AED",
  Video: "#0891B2",
  Data: "#4F46E5",
  Teaching: "#16A34A",
};

export function SkillBadge({ skill, size = "md", variant = "default" }: Props) {
  const colors = useColors();
  const bgColor = CATEGORY_COLORS[skill.category] ?? colors.primary;
  const isSmall = size === "sm";

  if (variant === "outlined") {
    return (
      <View style={[styles.badge, styles.outlined, { borderColor: bgColor }]}>
        <Text style={[styles.label, isSmall && styles.labelSm, { color: bgColor }]}>
          {skill.name}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.badge, { backgroundColor: bgColor + "18" }]}>
      <Text style={[styles.label, isSmall && styles.labelSm, { color: bgColor }]}>
        {skill.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  outlined: {
    borderWidth: 1.5,
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  labelSm: {
    fontSize: 11,
  },
});
